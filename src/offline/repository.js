import db from './db';
import { emitSync } from './status';

export function isLocalId(value) {
  return String(value || '').startsWith('local_');
}

export function newLocalId() {
  return `local_${crypto.randomUUID()}`;
}

export function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function requestPath(config) {
  const raw = String(config?.url || '').split('?')[0];
  return raw.startsWith('/') ? raw : `/${raw}`;
}

function requestMethod(config) {
  return String(config?.method || 'get').toLowerCase();
}

function bodyOf(config) {
  if (!config?.data) return {};
  if (typeof config.data === 'string') {
    try {
      return JSON.parse(config.data);
    } catch {
      return {};
    }
  }
  return config.data;
}

function paramsOf(config) {
  return config?.params || {};
}

function cacheKey(config) {
  const params = paramsOf(config);
  const ordered = Object.keys(params).sort().reduce((result, key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      result[key] = params[key];
    }
    return result;
  }, {});
  return `${requestMethod(config)} ${requestPath(config)} ${JSON.stringify(ordered)}`;
}

function envelope(message, data) {
  return { success: true, message, data };
}

function offlineReject(message) {
  const error = new Error(message);
  error.isAxiosError = true;
  error.response = {
    status: 400,
    data: { success: false, message },
  };
  return error;
}

function paginate(items, params) {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    pagination: {
      total: items.length,
      page,
      limit,
      totalPages: Math.ceil(items.length / limit) || 1,
    },
  };
}

function includesText(value, query) {
  return String(value || '').toLowerCase().includes(String(query || '').trim().toLowerCase());
}

function sameParty(left, right) {
  return String(left || '') !== '' && String(left) === String(right);
}

async function rememberSnapshot(config, payload) {
  if (requestMethod(config) !== 'get' || !payload) return;
  await db.snapshots.put({
    key: cacheKey(config),
    path: requestPath(config),
    envelope: payload,
    savedAt: new Date().toISOString(),
  });
  await absorbServerEnvelope(requestPath(config), payload);
}

async function absorbServerEnvelope(path, payload) {
  const items = payload?.data?.items;
  if (!Array.isArray(items)) return;
  if (path === '/customers') {
    for (const item of items) await upsertServerRow(db.customers, item);
  }
  if (path === '/sales') {
    for (const item of items) await upsertServerRow(db.sales, item);
  }
  if (path === '/payments') {
    for (const item of items) {
      await upsertServerRow(db.payments, item);
      await retireSaleReceipt(item);
    }
  }
}

function paymentSaleIds(payment) {
  return [payment?.saleId, ...(payment?.allocations || []).map((line) => line.saleId)]
    .filter(Boolean)
    .map(String);
}

async function retireSaleReceipt(payment) {
  const saleIds = new Set(paymentSaleIds(payment));
  if (!saleIds.size) return;
  const rows = await db.payments
    .filter((row) => row.origin === 'sale-receipt' && saleIds.has(String(row.saleServerId || '')))
    .toArray();
  if (rows.length) await db.payments.bulkDelete(rows.map((row) => row.localId));
}

async function upsertServerRow(table, item) {
  const serverId = item?._id;
  if (!serverId || isLocalId(serverId)) return;
  const existing = await table.where('serverId').equals(String(serverId)).first()
    || await table.get(String(serverId));
  if (existing && existing.syncStatus !== 'synced') return;
  await table.put({
    localId: existing?.localId || String(serverId),
    serverId: String(serverId),
    syncStatus: 'synced',
    customerLocalId: item.customerId ? String(item.customerId) : existing?.customerLocalId || '',
    origin: existing?.origin || 'server',
    record: { ...item, _id: String(serverId) },
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
  });
}

function rowRecord(row) {
  return row?.record || {};
}

async function allCustomers() {
  return db.customers.toArray();
}

async function allSales() {
  return db.sales.toArray();
}

async function allPayments() {
  return db.payments.toArray();
}

function customerMatches(row, id) {
  return sameParty(row.localId, id) || sameParty(row.serverId, id) || sameParty(rowRecord(row)._id, id);
}

async function findCustomer(id) {
  const rows = await allCustomers();
  return rows.find((row) => customerMatches(row, id)) || null;
}

async function findSale(id) {
  const rows = await allSales();
  return rows.find((row) => sameParty(row.localId, id) || sameParty(row.serverId, id) || sameParty(rowRecord(row)._id, id)) || null;
}

function digits(value) {
  return String(value || '').replace(/\D/g, '');
}

async function assertCustomerUnique(payload, ignoreLocalId) {
  const name = String(payload.customerName || '').trim().toLowerCase();
  const phone = digits(payload.phoneNumber);
  const rows = await allCustomers();
  const duplicate = rows.find((row) => {
    if (ignoreLocalId && row.localId === ignoreLocalId) return false;
    const record = rowRecord(row);
    const sameName = name && String(record.customerName || '').trim().toLowerCase() === name;
    const samePhone = phone && digits(record.phoneNumber) === phone;
    return samePhone || (sameName && !phone && !digits(record.phoneNumber));
  });
  if (duplicate) {
    throw offlineReject('A customer with the same phone or name is already on this computer.');
  }
}

async function catalogMaps() {
  const snapshots = await db.snapshots.toArray();
  const items = new Map();
  const accounts = new Map();
  const customers = new Map();
  for (const snap of snapshots) {
    const data = snap.envelope?.data;
    const itemLists = [data?.items, data?.inventoryItems];
    for (const list of itemLists) {
      if (!Array.isArray(list)) continue;
      for (const item of list) {
        if (item?._id && (item.itemName || item.currentQuantity != null)) {
          items.set(String(item._id), item);
        }
      }
    }
    const accountLists = [data?.accounts, data?.items];
    for (const list of accountLists) {
      if (!Array.isArray(list)) continue;
      for (const account of list) {
        if (account?._id && account.accountName) accounts.set(String(account._id), account);
      }
    }
    if (Array.isArray(data?.customers)) {
      for (const customer of data.customers) {
        if (customer?._id) customers.set(String(customer._id), customer);
      }
    }
  }
  return { items, accounts, customers };
}

async function pendingSaleQty(itemId, ignoreLocalId) {
  const sales = await allSales();
  let qty = 0;
  for (const sale of sales) {
    if (ignoreLocalId && sale.localId === ignoreLocalId) continue;
    if (sale.syncStatus === 'synced') continue;
    if (rowRecord(sale).saleStatus === 'cancelled' || rowRecord(sale).saleStatus === 'draft') continue;
    for (const line of rowRecord(sale).lineItems || []) {
      if (String(line.inventoryItemId) === String(itemId)) qty += Number(line.quantity) || 0;
    }
  }
  return qty;
}

async function stockOnHand(itemId, maps, ignoreLocalId) {
  const known = maps.items.get(String(itemId));
  if (!known || known.currentQuantity == null) return null;
  return roundMoney((Number(known.currentQuantity) || 0) - await pendingSaleQty(itemId, ignoreLocalId));
}

function saleTotals(lines, tradeDiscountAmount = 0, amountPaid = 0) {
  const subtotalAmount = roundMoney(lines.reduce((sum, line) => {
    return sum + (Number(line.quantity) * Number(line.unitPriceAmount) - (Number(line.discountAmount) || 0));
  }, 0));
  const discountAmount = roundMoney(tradeDiscountAmount);
  const totalAmount = roundMoney(Math.max(0, subtotalAmount - discountAmount));
  const paidAmount = roundMoney(amountPaid);
  const outstandingAmount = roundMoney(totalAmount - paidAmount);
  let paymentStatus = 'unpaid';
  if (outstandingAmount < 0) paymentStatus = 'refund-due';
  else if (outstandingAmount === 0) paymentStatus = 'paid';
  else if (paidAmount > 0) paymentStatus = 'partial';
  return {
    subtotalAmount,
    discountAmount,
    tradeDiscountAmount: discountAmount,
    taxAmount: 0,
    totalAmount,
    paidAmount,
    outstandingAmount,
    paymentStatus,
    saleType: outstandingAmount > 0 ? 'credit' : 'cash',
  };
}

async function knownCustomerOutstanding(customerId, maps) {
  const known = maps.customers.get(String(customerId));
  const base = Number(known?.outstanding) || 0;
  const sales = await allSales();
  const extra = sales.reduce((sum, sale) => {
    if (sale.syncStatus === 'synced') return sum;
    const record = rowRecord(sale);
    if (!sameParty(sale.customerLocalId, customerId) && !sameParty(record.customerId, customerId)) return sum;
    if (record.saleStatus === 'cancelled' || record.saleStatus === 'draft') return sum;
    return sum + (Number(record.outstandingAmount) || 0);
  }, 0);
  return roundMoney(base + extra);
}

async function buildSaleRecord(payload, localId) {
  const maps = await catalogMaps();
  const customer = await findCustomer(payload.customerId);
  const customerRecord = rowRecord(customer);
  const lines = (payload.lineItems || []).map((line) => {
    const item = maps.items.get(String(line.inventoryItemId));
    const quantity = Number(line.quantity);
    const unitPriceAmount = Number(line.unitPriceAmount) || 0;
    const discountAmount = Number(line.discountAmount) || 0;
    const lineTotalAmount = roundMoney(quantity * unitPriceAmount - discountAmount);
    return {
      _id: newLocalId(),
      inventoryItemId: line.inventoryItemId,
      itemCode: item?.itemCode || '',
      itemName: item?.itemName || line.itemDescription || '',
      itemDescription: line.itemDescription || item?.itemName || '',
      quantity,
      unitPriceAmount,
      discountAmount,
      taxAmount: 0,
      lineTotalAmount,
    };
  });
  const requested = new Map();
  for (const line of payload.lineItems || []) {
    const key = String(line.inventoryItemId);
    requested.set(key, (requested.get(key) || 0) + (Number(line.quantity) || 0));
  }
  for (const [itemId, quantity] of requested) {
    const available = await stockOnHand(itemId, maps, localId);
    if (available == null) {
      throw offlineReject('Open Inventory or a sale form once while online so stock can be checked offline.');
    }
    if (quantity > available + 0.0001) {
      throw offlineReject('Not enough stock for one or more sale items.');
    }
  }
  const totals = saleTotals(lines, payload.tradeDiscountAmount, payload.amountPaid);
  if (!payload.saveAsDraft && totals.outstandingAmount > 0) {
    const limit = Number(customerRecord.creditLimitAmount) || Number(maps.customers.get(String(payload.customerId))?.creditLimitAmount) || 0;
    if (limit > 0) {
      const current = await knownCustomerOutstanding(payload.customerId, maps);
      if (current + totals.outstandingAmount > limit) {
        throw offlineReject('Customer credit limit exceeded.');
      }
    }
  }
  const invoiceNumber = `OFF-${localId.slice(-6).toUpperCase()}`;
  const now = new Date().toISOString();
  return {
    _id: localId,
    saleNumber: invoiceNumber,
    invoiceNumber,
    customerId: payload.customerId,
    customerName: customerRecord.customerName || maps.customers.get(String(payload.customerId))?.customerName || '',
    customerCode: customerRecord.customerCode || maps.customers.get(String(payload.customerId))?.customerCode || '',
    invoiceDate: payload.invoiceDate || now,
    saleType: totals.saleType,
    type: totals.saleType,
    saleTypeLabel: totals.saleType === 'credit' ? 'Credit' : 'Cash',
    paymentTermDays: payload.paymentTermDays || 0,
    lineItems: lines,
    itemCount: lines.length,
    itemQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
    items: lines.reduce((sum, line) => sum + line.quantity, 0),
    ...totals,
    amount: totals.totalAmount,
    returnedAmount: 0,
    refundDueAmount: roundMoney(Math.max(0, -totals.outstandingAmount)),
    paymentStatusLabel: totals.paymentStatus,
    paymentMethod: payload.paymentMethod || '',
    referenceNumber: payload.referenceNumber || '',
    saleStatus: payload.saveAsDraft ? 'draft' : 'confirmed',
    saleStatusLabel: payload.saveAsDraft ? 'Draft' : 'Confirmed',
    remarks: payload.remarks || '',
    syncStatus: 'pending',
    provisional: true,
    createdAt: now,
    updatedAt: now,
  };
}

async function buildCustomerRecord(payload, localId) {
  const now = new Date().toISOString();
  return {
    _id: localId,
    customerCode: `OFF-${localId.slice(-6).toUpperCase()}`,
    customerName: payload.customerName,
    contactPersonName: payload.contactPersonName || '',
    phoneNumber: payload.phoneNumber || '',
    emailAddress: payload.emailAddress || '',
    billingAddress: payload.billingAddress || '',
    taxRegistrationNumber: payload.taxRegistrationNumber || '',
    creditLimitAmount: Number(payload.creditLimitAmount) || 0,
    paymentTermDays: Number(payload.paymentTermDays) || 0,
    openingBalanceAmount: Number(payload.openingBalanceAmount) || 0,
    isActive: payload.isActive !== false,
    syncStatus: 'pending',
    provisional: true,
    createdAt: now,
    updatedAt: now,
  };
}

async function buildPaymentRecord(payload, localId) {
  const customer = payload.customerId ? await findCustomer(payload.customerId) : null;
  const maps = await catalogMaps();
  const account = maps.accounts.get(String(payload.accountId));
  const sales = await allSales();
  const payments = await allPayments();
  const allocations = [];
  for (const line of payload.allocations || []) {
    const sale = line.saleId ? sales.find((row) => sameParty(row.localId, line.saleId) || sameParty(row.serverId, line.saleId)) : null;
    const already = payments.reduce((sum, payment) => {
      if (payment.syncStatus === 'synced') return sum;
      return sum + (payment.record?.allocations || []).reduce((inner, allocation) => {
        if (sameParty(allocation.saleId, line.saleId)) return inner + (Number(allocation.amountApplied) || 0);
        return inner;
      }, 0);
    }, 0);
    const outstanding = sale ? roundMoney((Number(rowRecord(sale).outstandingAmount) || 0) - already) : null;
    if (outstanding != null && Number(line.amountApplied) - outstanding > 0.009) {
      throw offlineReject('Payment is larger than the invoice outstanding on this computer.');
    }
    allocations.push({
      saleId: line.saleId || null,
      lpgReceiptId: line.lpgReceiptId || null,
      invoiceNumber: rowRecord(sale).invoiceNumber || '',
      amountApplied: roundMoney(line.amountApplied),
      outstandingAmount: outstanding,
    });
  }
  if (payload.paymentType === 'pay') {
    const balance = Number(account?.currentBalanceAmount);
    if (!account || Number.isNaN(balance)) {
      throw offlineReject('Open Accounting once while online so the cash balance can be checked.');
    }
    const reserved = payments.reduce((sum, payment) => {
      if (payment.syncStatus === 'synced') return sum;
      if (rowRecord(payment).paymentType !== 'pay') return sum;
      if (String(rowRecord(payment).accountId) !== String(payload.accountId)) return sum;
      return sum + (Number(rowRecord(payment).paymentAmount) || 0);
    }, 0);
    if (Number(payload.paymentAmount) > roundMoney(balance - reserved)) {
      throw offlineReject('Account does not have enough balance.');
    }
  }
  const now = new Date().toISOString();
  const paymentType = payload.paymentType || 'receive';
  const number = `OFF-${localId.slice(-6).toUpperCase()}`;
  return {
    _id: localId,
    paymentNumber: number,
    paymentDate: payload.paymentDate || now,
    paymentType,
    paymentTypeLabel: paymentType === 'pay' ? 'Supplier Payment' : paymentType === 'refund' ? 'Customer Refund' : 'Customer Receipt',
    direction: paymentType === 'receive' ? 'receive' : 'pay',
    customerId: payload.customerId || null,
    supplierId: payload.supplierId || null,
    partyName: rowRecord(customer).customerName || '',
    partyCode: rowRecord(customer).customerCode || '',
    accountId: payload.accountId,
    accountName: account ? `${account.accountCode || ''} – ${account.accountName}` : '',
    paymentAmount: roundMoney(payload.paymentAmount),
    paymentMethod: payload.paymentMethod || 'cash',
    paymentMethodLabel: payload.paymentMethod || 'cash',
    paymentStatus: 'recorded',
    paymentStatusLabel: 'Recorded',
    referenceNumber: payload.referenceNumber || '',
    remarks: payload.remarks || '',
    allocations,
    syncStatus: 'pending',
    provisional: true,
    createdAt: now,
    updatedAt: now,
  };
}

async function enqueue({ entity, action, localId, payload, dependsOn = [] }) {
  const operationId = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.queue.put({
    operationId,
    entity,
    action,
    localId,
    payload,
    dependsOn,
    status: 'pending',
    attempts: 0,
    lastError: '',
    createdAt: now,
    updatedAt: now,
  });
  emitSync();
  return operationId;
}

async function pendingCreate(entity, localId) {
  const rows = await db.queue.where('status').anyOf('pending', 'failed', 'syncing').toArray();
  return rows.find((row) => row.entity === entity && row.action === 'create' && row.localId === localId) || null;
}

export async function queueCustomerCreate(payload) {
  await assertCustomerUnique(payload);
  const localId = newLocalId();
  const record = await buildCustomerRecord(payload, localId);
  const serverPayload = { ...payload };
  delete serverPayload.customerCode;
  await db.customers.put({
    localId,
    serverId: '',
    syncStatus: 'pending',
    customerLocalId: localId,
    origin: 'local',
    record,
    updatedAt: record.updatedAt,
  });
  await enqueue({ entity: 'customer', action: 'create', localId, payload: serverPayload });
  return envelope('Customer saved on this computer', record);
}

export async function queueCustomerUpdate(id, payload) {
  const existing = await findCustomer(id);
  if (!existing) throw offlineReject('Customer is not on this computer yet.');
  await assertCustomerUnique({ ...rowRecord(existing), ...payload }, existing.localId);
  const record = { ...rowRecord(existing), ...payload, _id: rowRecord(existing)._id, updatedAt: new Date().toISOString(), provisional: true };
  await db.customers.put({ ...existing, syncStatus: 'pending', record, updatedAt: record.updatedAt });
  const createOp = await pendingCreate('customer', existing.localId);
  if (createOp) {
    createOp.payload = { ...createOp.payload, ...payload };
    createOp.status = 'pending';
    createOp.updatedAt = new Date().toISOString();
    await db.queue.put(createOp);
  } else if (existing.serverId) {
    await enqueue({ entity: 'customer', action: 'update', localId: existing.localId, payload });
  }
  emitSync();
  return envelope('Customer updated on this computer', record);
}

export async function queueSaleCreate(payload) {
  const customer = await findCustomer(payload.customerId);
  if (!customer && isLocalId(payload.customerId)) {
    throw offlineReject('Select a customer saved on this computer.');
  }
  const localId = newLocalId();
  const record = await buildSaleRecord(payload, localId);
  const serverPayload = { ...payload };
  delete serverPayload.invoiceNumber;
  delete serverPayload.saleNumber;
  await db.sales.put({
    localId,
    serverId: '',
    syncStatus: record.saleStatus === 'draft' ? 'pending' : 'pending',
    customerLocalId: String(payload.customerId),
    origin: 'local',
    record,
    payload: serverPayload,
    updatedAt: record.updatedAt,
  });
  const dependsOn = [];
  if (isLocalId(payload.customerId)) {
    const createOp = await pendingCreate('customer', payload.customerId);
    if (createOp) dependsOn.push(createOp.operationId);
  }
  await enqueue({ entity: 'sale', action: 'create', localId, payload: serverPayload, dependsOn });
  if (!payload.saveAsDraft && Number(payload.amountPaid) > 0) {
    const paymentId = newLocalId();
    const now = new Date().toISOString();
    const payment = {
      _id: paymentId,
      paymentNumber: `OFF-${paymentId.slice(-6).toUpperCase()}`,
      paymentDate: payload.invoiceDate || now,
      paymentType: 'receive',
      paymentTypeLabel: 'Customer Receipt',
      direction: 'receive',
      customerId: payload.customerId,
      partyName: record.customerName,
      partyCode: record.customerCode,
      accountId: payload.accountId,
      paymentAmount: roundMoney(payload.amountPaid),
      paymentMethod: payload.paymentMethod || 'cash',
      paymentMethodLabel: payload.paymentMethod || 'cash',
      paymentStatus: 'recorded',
      paymentStatusLabel: 'Recorded',
      referenceNumber: payload.referenceNumber || '',
      remarks: 'Received with invoice',
      allocations: [{
        saleId: localId,
        amountApplied: roundMoney(payload.amountPaid),
        invoiceNumber: record.invoiceNumber,
      }],
      provisional: true,
      createdAt: now,
      updatedAt: now,
    };
    await db.payments.put({
      localId: paymentId,
      serverId: '',
      syncStatus: 'pending',
      customerLocalId: String(payload.customerId),
      origin: 'sale-receipt',
      saleLocalId: localId,
      record: payment,
      updatedAt: now,
    });
  }
  return envelope('Sale saved on this computer', record);
}

export async function queueSaleUpdate(id, payload) {
  const existing = await findSale(id);
  if (!existing) throw offlineReject('Sale is not on this computer yet.');
  const createOp = await pendingCreate('sale', existing.localId);
  if (createOp) {
    const nextPayload = { ...createOp.payload, ...payload };
    const record = await buildSaleRecord(nextPayload, existing.localId);
    await db.sales.put({ ...existing, record, payload: nextPayload, syncStatus: 'pending', updatedAt: record.updatedAt });
    createOp.payload = nextPayload;
    createOp.status = 'pending';
    createOp.updatedAt = new Date().toISOString();
    await db.queue.put(createOp);
    emitSync();
    return envelope('Sale updated on this computer', record);
  }
  if (!existing.serverId) throw offlineReject('This sale is still waiting to sync.');
  const record = { ...rowRecord(existing), ...payload, provisional: true, updatedAt: new Date().toISOString() };
  await db.sales.put({ ...existing, syncStatus: 'pending', record, updatedAt: record.updatedAt });
  await enqueue({ entity: 'sale', action: 'update', localId: existing.localId, payload });
  return envelope('Sale updated on this computer', record);
}

export async function queuePaymentCreate(payload) {
  for (const line of payload.allocations || []) {
    if (line.saleId && isLocalId(line.saleId)) {
      const sale = await findSale(line.saleId);
      if (!sale) throw offlineReject('That invoice is not on this computer.');
    }
  }
  const localId = newLocalId();
  const record = await buildPaymentRecord(payload, localId);
  const dependsOn = [];
  if (isLocalId(payload.customerId)) {
    const createOp = await pendingCreate('customer', payload.customerId);
    if (createOp) dependsOn.push(createOp.operationId);
  }
  for (const line of payload.allocations || []) {
    if (isLocalId(line.saleId)) {
      const createOp = await pendingCreate('sale', line.saleId);
      if (createOp) dependsOn.push(createOp.operationId);
    }
  }
  await db.payments.put({
    localId,
    serverId: '',
    syncStatus: 'pending',
    customerLocalId: String(payload.customerId || ''),
    origin: 'local',
    record,
    updatedAt: record.updatedAt,
  });
  await enqueue({ entity: 'payment', action: 'create', localId, payload, dependsOn });
  return envelope('Payment saved on this computer', record);
}

function filterCustomers(rows, params) {
  return rows.filter((row) => {
    const record = rowRecord(row);
    if (params.isActive === true || params.isActive === 'true') {
      if (record.isActive === false) return false;
    }
    if (params.isActive === false || params.isActive === 'false') {
      if (record.isActive !== false) return false;
    }
    if (!params.search) return true;
    return [record.customerName, record.customerCode, record.phoneNumber, record.emailAddress]
      .some((value) => includesText(value, params.search));
  });
}

function filterSales(rows, params) {
  return rows.filter((row) => {
    const record = rowRecord(row);
    if (params.customerId && !sameParty(record.customerId, params.customerId) && !sameParty(row.customerLocalId, params.customerId)) {
      return false;
    }
    if (params.saleStatus && params.saleStatus !== 'all' && record.saleStatus !== params.saleStatus) return false;
    if (params.saleType && params.saleType !== 'all' && record.saleType !== params.saleType) return false;
    if (!params.search) return true;
    return [record.invoiceNumber, record.saleNumber, record.customerName, record.remarks]
      .some((value) => includesText(value, params.search));
  });
}

function keepPaymentRow(row, rows) {
  if (row.origin !== 'sale-receipt') return true;
  if (!row.saleServerId) return true;
  return !rows.some((other) => other.localId !== row.localId
    && other.origin !== 'sale-receipt'
    && paymentSaleIds(rowRecord(other)).includes(String(row.saleServerId)));
}

function filterPayments(rows, params) {
  return rows.filter((row) => {
    const record = rowRecord(row);
    if (params.customerId && !sameParty(record.customerId, params.customerId) && !sameParty(row.customerLocalId, params.customerId)) {
      return false;
    }
    if (params.paymentType && record.paymentType !== params.paymentType) return false;
    if (!params.search) return true;
    return [record.paymentNumber, record.partyName, record.referenceNumber]
      .some((value) => includesText(value, params.search));
  });
}

async function customerLedger(id) {
  const customer = await findCustomer(id);
  if (!customer) return null;
  const record = rowRecord(customer);
  const sales = (await allSales()).filter((row) => {
    const sale = rowRecord(row);
    return (sameParty(row.customerLocalId, customer.localId) || sameParty(sale.customerId, id) || sameParty(sale.customerId, customer.serverId))
      && sale.saleStatus !== 'cancelled'
      && sale.saleStatus !== 'draft';
  });
  const paymentRows = await allPayments();
  const payments = paymentRows.filter((row) => {
    if (!keepPaymentRow(row, paymentRows)) return false;
    const payment = rowRecord(row);
    return sameParty(row.customerLocalId, customer.localId)
      || sameParty(payment.customerId, id)
      || sameParty(payment.customerId, customer.serverId);
  });
  const purchases = roundMoney(sales.reduce((sum, row) => sum + (Number(rowRecord(row).totalAmount) || 0), 0));
  const covered = new Set();
  let received = 0;
  let refunded = 0;
  for (const row of payments) {
    const payment = rowRecord(row);
    if (payment.paymentType === 'receive') received += Number(payment.paymentAmount) || 0;
    if (payment.paymentType === 'refund') refunded += Number(payment.paymentAmount) || 0;
    if (payment.saleId) covered.add(String(payment.saleId));
    for (const line of payment.allocations || []) {
      if (line.saleId) covered.add(String(line.saleId));
    }
  }
  for (const row of sales) {
    const sale = rowRecord(row);
    const known = covered.has(row.localId) || covered.has(String(row.serverId || '')) || covered.has(String(sale._id));
    if (!known && Number(sale.paidAmount) > 0) received += Number(sale.paidAmount) || 0;
  }
  const outstandingBalance = roundMoney(purchases - received + refunded);
  const lastPayment = payments
    .map(rowRecord)
    .filter((payment) => payment.paymentType === 'receive')
    .sort((left, right) => new Date(right.paymentDate) - new Date(left.paymentDate))[0];
  return envelope('Customer ledger fetched', {
    customer: {
      ...record,
      accountStatus: record.isActive === false ? 'Inactive Account' : 'Active Account',
    },
    summary: {
      totalPurchases: purchases,
      salesCount: sales.length,
      outstandingBalance,
      customerCreditAmount: roundMoney(Math.max(0, -outstandingBalance)),
      lastPaymentAmount: lastPayment ? roundMoney(lastPayment.paymentAmount) : 0,
      lastPaymentDate: lastPayment?.paymentDate || null,
      lastPaymentNumber: lastPayment?.paymentNumber || null,
      lastPaymentMethod: lastPayment?.paymentMethod || null,
      creditLimitAmount: roundMoney(record.creditLimitAmount),
      provisional: sales.some((row) => row.syncStatus !== 'synced') || payments.some((row) => row.syncStatus !== 'synced'),
    },
  });
}

async function adjustStock(items) {
  if (!Array.isArray(items)) return items;
  const copy = [];
  for (const item of items) {
    if (!item?._id || item.currentQuantity == null) {
      copy.push(item);
      continue;
    }
    const reserved = await pendingSaleQty(item._id);
    copy.push({
      ...item,
      currentQuantity: roundMoney(Math.max(0, (Number(item.currentQuantity) || 0) - reserved)),
    });
  }
  return copy;
}

async function withPendingParties(data) {
  if (!data) return data;
  const next = { ...data };
  if (Array.isArray(data.customers)) {
    const pending = (await allCustomers()).filter((row) => row.syncStatus !== 'synced');
    const extras = pending.map((row) => {
      const record = rowRecord(row);
      return {
        ...record,
        label: `${record.customerCode} – ${record.customerName}`,
        outstanding: record.openingBalanceAmount || 0,
      };
    });
    const seen = new Set(data.customers.map((customer) => String(customer._id)));
    next.customers = [...extras.filter((customer) => !seen.has(String(customer._id))), ...data.customers];
  }
  if (Array.isArray(data.inventoryItems)) {
    next.inventoryItems = await adjustStock(data.inventoryItems);
  }
  if (Array.isArray(data.items) && data.items.some((item) => item?.currentQuantity != null && item?.itemName)) {
    next.items = await adjustStock(data.items);
  }
  return next;
}

async function outstandingForCustomer(customerId) {
  const sales = (await allSales()).filter((row) => {
    const sale = rowRecord(row);
    return (sameParty(row.customerLocalId, customerId) || sameParty(sale.customerId, customerId))
      && sale.saleStatus !== 'cancelled'
      && sale.saleStatus !== 'draft'
      && Number(sale.outstandingAmount) > 0;
  });
  return sales.map((row) => {
    const sale = rowRecord(row);
    return {
      _id: sale._id,
      invoiceNumber: sale.invoiceNumber,
      saleNumber: sale.saleNumber || sale.invoiceNumber,
      invoiceDate: sale.invoiceDate,
      totalAmount: sale.totalAmount,
      outstandingAmount: sale.outstandingAmount,
      paidAmount: sale.paidAmount,
      label: `${sale.invoiceNumber} – Outstanding Rs ${Number(sale.outstandingAmount).toFixed(2)}`,
    };
  });
}

export async function serveGet(config) {
  const path = requestPath(config);
  const params = paramsOf(config);
  const idMatch = path.match(/^\/(customers|sales|payments)\/([^/]+)$/);
  if (idMatch && idMatch[2] !== 'form-options') {
    const table = idMatch[1] === 'customers' ? await findCustomer(idMatch[2]) : idMatch[1] === 'sales' ? await findSale(idMatch[2]) : (await allPayments()).find((row) => sameParty(row.localId, idMatch[2]) || sameParty(row.serverId, idMatch[2]));
    if (table) return envelope('Saved on this computer', rowRecord(table));
  }
  if (/^\/customers\/[^/]+\/ledger$/.test(path)) {
    const ledger = await customerLedger(path.split('/')[2]);
    if (ledger) return ledger;
  }
  if (/^\/customers\/[^/]+\/sales-history$/.test(path)) {
    const id = path.split('/')[2];
    const rows = filterSales(await allSales(), { ...params, customerId: id });
    return envelope('Customer sales history fetched', paginate(rows.map(rowRecord), params));
  }
  if (/^\/customers\/[^/]+\/payment-history$/.test(path)) {
    const id = path.split('/')[2];
    const rows = filterPayments(await allPayments(), { ...params, customerId: id });
    return envelope('Customer payment history fetched', paginate(rows.map(rowRecord), params));
  }
  if (path === '/customers' && (await allCustomers()).length) {
    const rows = filterCustomers(await allCustomers(), params);
    return envelope('Customers fetched', paginate(rows.map(rowRecord), params));
  }
  if (path === '/sales' && (await allSales()).length) {
    const rows = filterSales(await allSales(), params);
    return envelope('Sales fetched', paginate(rows.map(rowRecord), params));
  }
  if (path === '/payments' && (await allPayments()).length) {
    const source = await allPayments();
    const rows = filterPayments(source, params).filter((row) => keepPaymentRow(row, source));
    return envelope('Payments fetched', paginate(rows.map(rowRecord), params));
  }

  const snap = await db.snapshots.get(cacheKey(config));
  if (!snap?.envelope) return null;
  const data = await withPendingParties(snap.envelope.data);
  if (path === '/payments/form-options' && params.customerId) {
    data.outstandingInvoices = await outstandingForCustomer(params.customerId);
    data.customers = (await withPendingParties({ customers: data.customers || [] })).customers;
  }
  if (path === '/sales/form-options') {
    const pending = (await allCustomers()).filter((row) => row.syncStatus !== 'synced');
    const extras = pending.map((row) => {
      const record = rowRecord(row);
      return { ...record, label: `${record.customerCode} – ${record.customerName}` };
    });
    const seen = new Set((data.customers || []).map((customer) => String(customer._id)));
    data.customers = [...extras.filter((customer) => !seen.has(String(customer._id))), ...(data.customers || [])];
  }
  return { ...snap.envelope, data };
}

export async function serveWrite(config) {
  const path = requestPath(config);
  const method = requestMethod(config);
  const payload = bodyOf(config);
  if (method === 'post' && path === '/customers') return queueCustomerCreate(payload);
  if (method === 'patch' && /^\/customers\/[^/]+$/.test(path)) {
    return queueCustomerUpdate(path.split('/')[2], payload);
  }
  if (method === 'post' && path === '/sales') return queueSaleCreate(payload);
  if (method === 'patch' && /^\/sales\/[^/]+$/.test(path)) {
    return queueSaleUpdate(path.split('/')[2], payload);
  }
  if (method === 'post' && path === '/payments') return queuePaymentCreate(payload);
  throw offlineReject('This action needs an internet connection. Nothing was saved.');
}

export async function rememberOnlineResponse(config, payload) {
  try {
    await rememberSnapshot(config, payload);
  } catch {
    // A cache miss must not fail a successful online request.
  }
}

export async function mergePendingIntoResponse(config, payload) {
  if (requestMethod(config) !== 'get' || !payload?.data) return payload;
  const path = requestPath(config);
  const params = paramsOf(config);
  if (!['/customers', '/sales', '/payments'].includes(path) || !Array.isArray(payload.data.items)) {
    const data = await withPendingParties(payload.data);
    return { ...payload, data };
  }
  const table = path === '/customers' ? filterCustomers(await allCustomers(), params)
    : path === '/sales' ? filterSales(await allSales(), params)
      : filterPayments(await allPayments(), params);
  const pending = table
    .filter((row) => row.syncStatus !== 'synced' && row.origin !== 'sale-receipt')
    .map(rowRecord);
  if (!pending.length || Number(params.page || 1) !== 1) return payload;
  const seen = new Set(payload.data.items.map((item) => String(item._id)));
  const extras = pending.filter((item) => !seen.has(String(item._id)));
  return {
    ...payload,
    data: {
      ...payload.data,
      items: [...extras, ...payload.data.items],
      pagination: {
        ...payload.data.pagination,
        total: (payload.data.pagination?.total || payload.data.items.length) + extras.length,
      },
    },
  };
}

export async function applyServerResult(localId, entity, serverRecord) {
  const table = entity === 'customer' ? db.customers : entity === 'sale' ? db.sales : db.payments;
  const existing = await table.get(localId);
  if (!existing || !serverRecord?._id) return;
  await table.put({
    ...existing,
    serverId: String(serverRecord._id),
    syncStatus: 'synced',
    record: { ...serverRecord, syncStatus: 'synced', provisional: false },
    updatedAt: new Date().toISOString(),
  });
  if (entity === 'sale') {
    const payments = await allPayments();
    for (const payment of payments) {
      if (payment.origin === 'sale-receipt' && payment.saleLocalId === localId) {
        await db.payments.put({
          ...payment,
          saleServerId: String(serverRecord._id),
          syncStatus: 'synced',
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }
}

export async function getSyncSummary() {
  const queue = await db.queue.toArray();
  const pending = queue.filter((item) => item.status === 'pending' || item.status === 'syncing').length;
  const failed = queue.filter((item) => item.status === 'failed');
  const synced = queue.filter((item) => item.status === 'synced').length;
  const meta = await db.meta.get('sync');
  const auth = await db.meta.get('auth');
  return {
    online: typeof navigator === 'undefined' ? true : navigator.onLine,
    pending,
    failed,
    synced,
    lastSyncAt: meta?.lastSyncAt || null,
    authRequired: Boolean(auth?.required),
    syncing: Boolean(meta?.syncing),
  };
}

export async function retryOperation(operationId) {
  const row = await db.queue.get(operationId);
  if (!row) return;
  await db.queue.put({
    ...row,
    status: 'pending',
    lastError: '',
    updatedAt: new Date().toISOString(),
  });
  emitSync();
}

export async function discardFailedOperation(operationId) {
  const row = await db.queue.get(operationId);
  if (!row || row.status !== 'failed') return;
  const table = row.entity === 'customer' ? db.customers : row.entity === 'sale' ? db.sales : db.payments;
  const record = await table.get(row.localId);
  if (row.action === 'create' && record && !record.serverId) {
    await table.delete(row.localId);
    if (row.entity === 'sale') {
      const payments = await db.payments.filter((payment) => payment.saleLocalId === row.localId).toArray();
      await db.payments.bulkDelete(payments.map((payment) => payment.localId));
    }
  } else if (record?.serverId) {
    await table.put({ ...record, syncStatus: 'synced' });
  }
  await db.queue.delete(operationId);
  emitSync();
}

export async function exportOfflineBackup() {
  const payload = {
    exportedAt: new Date().toISOString(),
    customers: await db.customers.toArray(),
    sales: await db.sales.toArray(),
    payments: await db.payments.toArray(),
    queue: await db.queue.toArray(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `brother-lpg-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export async function markAuthRequired(required) {
  await db.meta.put({ key: 'auth', required: Boolean(required) });
  emitSync();
}

export async function markSyncMeta(patch) {
  const current = (await db.meta.get('sync')) || { key: 'sync' };
  await db.meta.put({ ...current, key: 'sync', ...patch });
  emitSync();
}

export function canQueueWrite(config) {
  const path = requestPath(config);
  const method = requestMethod(config);
  if (method === 'post' && ['/customers', '/sales', '/payments'].includes(path)) return true;
  if (method === 'patch' && /^\/(customers|sales)\/[^/]+$/.test(path)) return true;
  return false;
}

export function isRead(config) {
  return requestMethod(config) === 'get';
}
