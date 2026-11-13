import api from '../api/axios';
import db from './db';
import { emitSync } from './status';
import {
  applyServerResult,
  isLocalId,
  markAuthRequired,
  markSyncMeta,
} from './repository';

let running = false;

function messageFrom(error) {
  return error?.response?.data?.message || error?.message || 'Sync failed';
}

async function resolveId(value) {
  if (!value || !isLocalId(value)) return value || null;
  const customer = await db.customers.get(value);
  if (customer?.serverId) return customer.serverId;
  const sale = await db.sales.get(value);
  if (sale?.serverId) return sale.serverId;
  const payment = await db.payments.get(value);
  if (payment?.serverId) return payment.serverId;
  return null;
}

async function readyPayload(operation) {
  const payload = { ...(operation.payload || {}) };
  if (payload.customerId) {
    const resolved = await resolveId(payload.customerId);
    if (!resolved) return null;
    payload.customerId = resolved;
  }
  if (payload.supplierId && isLocalId(payload.supplierId)) return null;
  if (payload.saleId) {
    const resolved = await resolveId(payload.saleId);
    if (!resolved) return null;
    payload.saleId = resolved;
  }
  if (Array.isArray(payload.allocations)) {
    payload.allocations = [];
    for (const line of operation.payload.allocations) {
      const next = { ...line };
      if (next.saleId) {
        const resolved = await resolveId(next.saleId);
        if (!resolved) return null;
        next.saleId = resolved;
      }
      if (next.lpgReceiptId && isLocalId(next.lpgReceiptId)) return null;
      payload.allocations.push(next);
    }
  }
  if (Array.isArray(payload.lineItems)) {
    payload.lineItems = payload.lineItems.map((line) => ({
      inventoryItemId: line.inventoryItemId,
      itemDescription: line.itemDescription,
      quantity: line.quantity,
      unitPriceAmount: line.unitPriceAmount,
      discountAmount: line.discountAmount,
    }));
  }
  delete payload.invoiceNumber;
  delete payload.saleNumber;
  delete payload.paymentNumber;
  delete payload.customerCode;
  return payload;
}

function requestFor(operation, serverId) {
  if (operation.entity === 'customer' && operation.action === 'create') {
    return { method: 'post', url: '/customers' };
  }
  if (operation.entity === 'customer' && operation.action === 'update') {
    return { method: 'patch', url: `/customers/${serverId}` };
  }
  if (operation.entity === 'sale' && operation.action === 'create') {
    return { method: 'post', url: '/sales' };
  }
  if (operation.entity === 'sale' && operation.action === 'update') {
    return { method: 'patch', url: `/sales/${serverId}` };
  }
  if (operation.entity === 'payment' && operation.action === 'create') {
    return { method: 'post', url: '/payments' };
  }
  return null;
}

async function operationBlocked(operation, byId) {
  for (const dependency of operation.dependsOn || []) {
    const parent = byId.get(dependency);
    if (parent && parent.status !== 'synced') return true;
  }
  return false;
}

async function sendOperation(operation) {
  const row = operation.entity === 'customer'
    ? await db.customers.get(operation.localId)
    : operation.entity === 'sale'
      ? await db.sales.get(operation.localId)
      : await db.payments.get(operation.localId);
  const target = requestFor(operation, row?.serverId);
  if (!target || (operation.action === 'update' && !row?.serverId)) {
    throw new Error('This offline change is missing its server record.');
  }
  const payload = await readyPayload(operation);
  if (!payload) return 'blocked';
  const response = await api.request({
    ...target,
    data: payload,
    headers: { 'Idempotency-Key': operation.operationId },
    skipOffline: true,
  });
  await applyServerResult(operation.localId, operation.entity, response.data?.data);
  await db.queue.put({
    ...operation,
    status: 'synced',
    lastError: '',
    updatedAt: new Date().toISOString(),
  });
  return 'synced';
}

export async function syncNow() {
  if (running || (typeof navigator !== 'undefined' && !navigator.onLine)) return;
  if (!localStorage.getItem('token')) {
    await markAuthRequired(true);
    return;
  }
  running = true;
  await markSyncMeta({ syncing: true });
  try {
    const queue = (await db.queue.toArray())
      .filter((item) => item.status === 'pending')
      .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt));
    const byId = new Map((await db.queue.toArray()).map((item) => [item.operationId, item]));
    for (const operation of queue) {
      if (await operationBlocked(operation, byId)) continue;
      await db.queue.put({ ...operation, status: 'syncing', updatedAt: new Date().toISOString() });
      try {
        const outcome = await sendOperation(operation);
        if (outcome === 'blocked') {
          await db.queue.put({ ...operation, status: 'pending', updatedAt: new Date().toISOString() });
          continue;
        }
        byId.set(operation.operationId, { ...operation, status: 'synced' });
        await markAuthRequired(false);
      } catch (error) {
        const status = error?.response?.status;
        if (!error?.response) {
          await db.queue.put({ ...operation, status: 'pending', updatedAt: new Date().toISOString() });
          break;
        }
        if (status === 401) {
          await db.queue.put({ ...operation, status: 'pending', updatedAt: new Date().toISOString() });
          await markAuthRequired(true);
          break;
        }
        await db.queue.put({
          ...operation,
          status: 'failed',
          attempts: (operation.attempts || 0) + 1,
          lastError: messageFrom(error),
          updatedAt: new Date().toISOString(),
        });
      }
    }
    await markSyncMeta({ syncing: false, lastSyncAt: new Date().toISOString() });
  } finally {
    running = false;
    await markSyncMeta({ syncing: false });
    emitSync();
  }
}

let started = false;

export function startSyncLoop() {
  if (started || typeof window === 'undefined') return;
  started = true;
  window.addEventListener('online', () => {
    syncNow();
  });
  window.setInterval(() => {
    if (navigator.onLine) syncNow();
  }, 20000);
  if (navigator.onLine) syncNow();
}
