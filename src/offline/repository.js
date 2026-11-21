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

function isOfflineSaleRecord(record) {
  return record?.provisional === true
    || record?.syncStatus === 'pending'
    || record?.syncStatus === 'failed'
    || String(record?.invoiceNumber || '').startsWith('OFF-')
    || String(record?._id || '').startsWith('local_');
}

function sortSaleRecords(records) {
  return [...records].sort((left, right) => {
    const leftOffline = isOfflineSaleRecord(left);
    const rightOffline = isOfflineSaleRecord(right);
    if (leftOffline !== rightOffline) return leftOffline ? -1 : 1;
    return new Date(right.createdAt || right.invoiceDate || 0).getTime()
      - new Date(left.createdAt || left.invoiceDate || 0).getTime();
  });
}

function salesListSummary(records) {
  const totals = {
    totalSalesAmount: 0,
    totalSalesCount: 0,
    todaySalesAmount: 0,
    todaySalesCount: 0,
    cashSalesAmount: 0,
    cashSalesCount: 0,
    creditSalesAmount: 0,
    creditSalesCount: 0,
    pendingCreditAmount: 0,
  };
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (const sale of records) {
    if (sale.saleStatus === 'cancelled' || sale.saleStatus === 'draft') continue;
    const amount = Number(sale.totalAmount) || 0;
    const credit = sale.saleType === 'credit' || sale.type === 'credit';
    totals.totalSalesAmount += amount;
    totals.totalSalesCount += 1;
    if (credit) {
      totals.creditSalesAmount += amount;
      totals.creditSalesCount += 1;
    } else {
      totals.cashSalesAmount += amount;
      totals.cashSalesCount += 1;
    }
    totals.pendingCreditAmount += Number(sale.outstandingAmount) || 0;
    const when = new Date(sale.invoiceDate || sale.createdAt || 0);
    if (when >= start) {
      totals.todaySalesAmount += amount;
      totals.todaySalesCount += 1;
    }
  }
  for (const key of Object.keys(totals)) {
    if (key.endsWith('Amount')) totals[key] = roundMoney(totals[key]);
  }
  return totals;
}

function includesText(value, query) {
  return String(value || '').toLowerCase().includes(String(query || '').trim().toLowerCase());
}

function partyId(value) {
  if (value && typeof value === 'object') return String(value._id || value.id || '');
  return String(value || '');
}

function sameParty(left, right) {
  const leftId = partyId(left);
  const rightId = partyId(right);
  return leftId !== '' && leftId === rightId;
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
  if (/^\/filling-batches\/[^/]+$/.test(path) && !path.endsWith('/form-options') && payload?.data?._id) {
    await upsertServerRow(db.fillingBatches, payload.data);
  }
  const items = payload?.data?.items;
  if (!Array.isArray(items)) return;
  if (path === '/customers') {
    for (const item of items) await upsertServerRow(db.customers, item);
  }
  if (path === '/sales') {
    for (const item of items) await upsertServerRow(db.sales, item);
  }
  if (path === '/suppliers') {
    for (const item of items) await upsertServerRow(db.suppliers, item);
  }
  if (path === '/accounts') {
    for (const item of items) await upsertServerRow(db.accounts, item);
  }
  if (path === '/filling-batches') {
    for (const item of items) await upsertServerRow(db.fillingBatches, item);
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

async function allSuppliers() {
  return db.suppliers.toArray();
}

async function allAccounts() {
  return db.accounts.toArray();
}

async function allSales() {
  return db.sales.toArray();
}

async function allPayments() {
  return db.payments.toArray();
}

async function allFillingBatches() {
  return db.fillingBatches.toArray();
}

function customerMatches(row, id) {
  return sameParty(row.localId, id) || sameParty(row.serverId, id) || sameParty(rowRecord(row)._id, id);
}

async function findCustomer(id) {
  const rows = await allCustomers();
  return rows.find((row) => customerMatches(row, id)) || null;
}

async function findSupplier(id) {
  const rows = await allSuppliers();
  return rows.find((row) => customerMatches(row, id)) || null;
}

async function findAccount(id) {
  const rows = await allAccounts();
  return rows.find((row) => customerMatches(row, id)) || null;
}

const ACCOUNT_TYPES = new Set(['cash', 'bank', 'receivable', 'payable', 'income', 'expense', 'equity']);
const ACCOUNT_TYPE_LABELS = {
  cash: 'Cash',
  bank: 'Bank',
  receivable: 'Receivable',
  payable: 'Payable',
  income: 'Income',
  expense: 'Expense',
  equity: 'Equity',
};
const ACCOUNT_CATEGORIES = new Set(['operating', 'banking', 'fleet', 'payroll', 'payable', 'receivable', 'other']);
const ACCOUNT_CATEGORY_LABELS = {
  operating: 'Operating',
  banking: 'Banking',
  fleet: 'Fleet / Vehicle',
  payroll: 'Payroll',
  payable: 'Payables',
  receivable: 'Receivables',
  other: 'Other',
};

function accountStatusOf(record) {
  if (record.isActive === false) return { status: 'inactive', statusLabel: 'Inactive' };
  if (record.needsReview) return { status: 'review', statusLabel: 'Review' };
  return { status: 'active', statusLabel: 'Active' };
}

function assertAccountPayload(payload, partial) {
  if (!partial || payload.accountName != null) {
    if (String(payload.accountName || '').trim().length < 2) {
      throw offlineReject('Account name must be at least 2 characters.');
    }
  }
  if (!partial || payload.accountType != null) {
    if (!ACCOUNT_TYPES.has(payload.accountType)) {
      throw offlineReject('Select an account type.');
    }
  }
  if (payload.accountCategory && !ACCOUNT_CATEGORIES.has(payload.accountCategory)) {
    throw offlineReject('Select an account category.');
  }
}

const SUPPLIER_TERMS = new Set([0, 7, 15, 30, 45, 60, 90]);

function assertSupplierPayload(payload) {
  if (String(payload.supplierName || '').trim().length < 2) {
    throw offlineReject('Supplier name must be at least 2 characters.');
  }
  if (String(payload.contactPersonName || '').trim().length < 2) {
    throw offlineReject('Contact person must be at least 2 characters.');
  }
  if (String(payload.phoneNumber || '').trim().length < 7) {
    throw offlineReject('Phone number must be at least 7 characters.');
  }
  if (String(payload.businessAddress || '').trim().length < 5) {
    throw offlineReject('Business address must be at least 5 characters.');
  }
  if (!SUPPLIER_TERMS.has(Number(payload.paymentTermDays))) {
    throw offlineReject('Invalid payment terms.');
  }
}

async function findFilling(id) {
  const rows = await allFillingBatches();
  return rows.find((row) => sameParty(row.localId, id) || sameParty(row.serverId, id) || sameParty(rowRecord(row)._id, id)) || null;
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

async function assertSupplierUnique(payload, ignoreLocalId) {
  const name = String(payload.supplierName || '').trim().toLowerCase();
  const phone = digits(payload.phoneNumber);
  const rows = await allSuppliers();
  const duplicate = rows.find((row) => {
    if (ignoreLocalId && row.localId === ignoreLocalId) return false;
    const record = rowRecord(row);
    const sameName = name && String(record.supplierName || '').trim().toLowerCase() === name;
    const samePhone = phone && digits(record.phoneNumber) === phone;
    return samePhone || (sameName && !phone && !digits(record.phoneNumber));
  });
  if (duplicate) {
    throw offlineReject('A supplier with the same phone or name is already on this computer.');
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
  for (const row of await allAccounts()) {
    const record = rowRecord(row);
    if (record._id) accounts.set(String(record._id), record);
    if (row.serverId) accounts.set(String(row.serverId), record);
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

async function buildSupplierRecord(payload, localId, existing) {
  const now = new Date().toISOString();
  const previous = existing ? rowRecord(existing) : {};
  return {
    _id: previous._id || localId,
    supplierCode: previous.supplierCode || `OFF-${localId.slice(-6).toUpperCase()}`,
    supplierName: payload.supplierName,
    contactPersonName: payload.contactPersonName || '',
    phoneNumber: payload.phoneNumber || '',
    emailAddress: payload.emailAddress || '',
    isActive: payload.isActive !== false,
    paymentTermDays: Number(payload.paymentTermDays) || 0,
    creditLimitAmount: Number(payload.creditLimitAmount) || 0,
    openingBalanceAmount: Number(payload.openingBalanceAmount) || 0,
    businessAddress: payload.businessAddress || '',
    city: payload.city || '',
    stateProvince: payload.stateProvince || '',
    taxRegistrationNumber: payload.taxRegistrationNumber || '',
    bankName: payload.bankName || '',
    bankAccountTitle: payload.bankAccountTitle || '',
    bankAccountNumber: payload.bankAccountNumber || '',
    iban: String(payload.iban || '').replace(/\s/g, '').toUpperCase(),
    syncStatus: 'pending',
    provisional: true,
    createdAt: previous.createdAt || now,
    updatedAt: now,
  };
}

async function buildPaymentRecord(payload, localId) {
  const customer = payload.customerId ? await findCustomer(payload.customerId) : null;
  const supplier = payload.supplierId ? await findSupplier(payload.supplierId) : null;
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
    partyName: rowRecord(customer).customerName || rowRecord(supplier).supplierName || '',
    partyCode: rowRecord(customer).customerCode || rowRecord(supplier).supplierCode || '',
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

export async function queueSupplierCreate(payload) {
  assertSupplierPayload(payload);
  await assertSupplierUnique(payload);
  const localId = newLocalId();
  const record = await buildSupplierRecord(payload, localId);
  const serverPayload = { ...payload };
  delete serverPayload.supplierCode;
  await db.suppliers.put({
    localId,
    serverId: '',
    syncStatus: 'pending',
    origin: 'local',
    record,
    updatedAt: record.updatedAt,
  });
  await enqueue({ entity: 'supplier', action: 'create', localId, payload: serverPayload });
  return envelope('Supplier saved on this computer', record);
}

export async function queueSupplierUpdate(id, payload) {
  const existing = await findSupplier(id);
  if (!existing) throw offlineReject('Supplier is not on this computer yet.');
  const merged = { ...rowRecord(existing), ...payload };
  assertSupplierPayload(merged);
  await assertSupplierUnique(merged, existing.localId);
  const record = await buildSupplierRecord(merged, existing.localId, existing);
  await db.suppliers.put({ ...existing, syncStatus: 'pending', record, updatedAt: record.updatedAt });
  const createOp = await pendingCreate('supplier', existing.localId);
  if (createOp) {
    createOp.payload = { ...createOp.payload, ...payload };
    delete createOp.payload.supplierCode;
    createOp.status = 'pending';
    createOp.updatedAt = new Date().toISOString();
    await db.queue.put(createOp);
  } else if (existing.serverId) {
    const serverPayload = { ...payload };
    delete serverPayload.supplierCode;
    await enqueue({ entity: 'supplier', action: 'update', localId: existing.localId, payload: serverPayload });
  }
  emitSync();
  return envelope('Supplier updated on this computer', record);
}

function accountOption(record) {
  return {
    _id: record._id,
    accountCode: record.accountCode,
    accountName: record.accountName,
    accountType: record.accountType,
    isPrimary: Boolean(record.isPrimary),
    currentBalanceAmount: Number(record.currentBalanceAmount) || 0,
    label: `${record.accountCode} – ${record.accountName}`,
  };
}

async function buildAccountRecord(payload, localId, existing) {
  const now = new Date().toISOString();
  const previous = existing ? rowRecord(existing) : {};
  const opening = payload.openingBalanceAmount != null
    ? Number(payload.openingBalanceAmount) || 0
    : Number(previous.openingBalanceAmount) || 0;
  const current = existing && payload.openingBalanceAmount == null
    ? Number(previous.currentBalanceAmount) || 0
    : opening;
  const accountType = payload.accountType || previous.accountType;
  const accountCategory = payload.accountCategory || previous.accountCategory || 'operating';
  const bankName = payload.bankName ?? previous.bankName ?? '';
  const branchName = payload.branchName ?? previous.branchName ?? '';
  const branchDisplay = bankName && branchName ? `${bankName} – ${branchName}` : bankName || branchName || '';
  const parent = payload.parentAccountId
    ? await findAccount(payload.parentAccountId)
    : null;
  const parentRecord = parent ? rowRecord(parent) : {};
  const isActive = payload.isActive != null ? payload.isActive !== false : previous.isActive !== false;
  const needsReview = payload.needsReview != null ? Boolean(payload.needsReview) : Boolean(previous.needsReview);
  const record = {
    _id: previous._id || localId,
    accountCode: previous.accountCode || `OFF-${localId.slice(-6).toUpperCase()}`,
    accountName: payload.accountName ?? previous.accountName,
    accountType,
    accountTypeLabel: ACCOUNT_TYPE_LABELS[accountType] || accountType || '',
    accountCategory,
    accountCategoryLabel: ACCOUNT_CATEGORY_LABELS[accountCategory] || accountCategory,
    parentAccountId: payload.parentAccountId ?? previous.parentAccountId ?? null,
    parentAccountName: parentRecord.accountName || previous.parentAccountName || '',
    parentAccountCode: parentRecord.accountCode || previous.parentAccountCode || '',
    description: payload.description ?? previous.description ?? '',
    bankName,
    branchName,
    branchDisplay,
    accountNumber: payload.accountNumber ?? previous.accountNumber ?? '',
    ibanOrSwift: String(payload.ibanOrSwift ?? previous.ibanOrSwift ?? '').trim().toUpperCase(),
    openingBalanceAmount: roundMoney(opening),
    currentBalanceAmount: roundMoney(current),
    openedAt: payload.openedAt ?? previous.openedAt ?? null,
    allowManualEntries: payload.allowManualEntries != null
      ? payload.allowManualEntries !== false
      : previous.allowManualEntries !== false,
    isPrimary: payload.isPrimary != null ? Boolean(payload.isPrimary) : Boolean(previous.isPrimary),
    needsReview,
    isActive,
    ...accountStatusOf({ isActive, needsReview }),
    syncStatus: 'pending',
    provisional: true,
    createdAt: previous.createdAt || now,
    updatedAt: now,
  };
  return record;
}

async function clearOtherPrimaryAccounts(localId) {
  const rows = await allAccounts();
  for (const row of rows) {
    if (row.localId === localId) continue;
    const record = rowRecord(row);
    if (!record.isPrimary) continue;
    await db.accounts.put({
      ...row,
      record: { ...record, isPrimary: false },
      updatedAt: new Date().toISOString(),
    });
  }
}

export async function queueAccountCreate(payload) {
  assertAccountPayload(payload);
  if (payload.parentAccountId && isLocalId(payload.parentAccountId)) {
    const parent = await findAccount(payload.parentAccountId);
    if (!parent) throw offlineReject('Select a parent account saved on this computer.');
  }
  const localId = newLocalId();
  const record = await buildAccountRecord(payload, localId);
  if (record.isPrimary) await clearOtherPrimaryAccounts(localId);
  const serverPayload = { ...payload };
  delete serverPayload.accountCode;
  delete serverPayload.currentBalanceAmount;
  await db.accounts.put({
    localId,
    serverId: '',
    syncStatus: 'pending',
    origin: 'local',
    record,
    updatedAt: record.updatedAt,
  });
  const dependsOn = [];
  if (isLocalId(payload.parentAccountId)) {
    const createOp = await pendingCreate('account', payload.parentAccountId);
    if (createOp) dependsOn.push(createOp.operationId);
  }
  await enqueue({ entity: 'account', action: 'create', localId, payload: serverPayload, dependsOn });
  return envelope('Account saved on this computer', record);
}

export async function queueAccountUpdate(id, payload) {
  const existing = await findAccount(id);
  if (!existing) throw offlineReject('Account is not on this computer yet.');
  const merged = { ...rowRecord(existing), ...payload };
  assertAccountPayload(merged);
  const record = await buildAccountRecord(merged, existing.localId, existing);
  if (record.isPrimary) await clearOtherPrimaryAccounts(existing.localId);
  await db.accounts.put({ ...existing, syncStatus: 'pending', record, updatedAt: record.updatedAt });
  const createOp = await pendingCreate('account', existing.localId);
  if (createOp) {
    createOp.payload = { ...createOp.payload, ...payload };
    delete createOp.payload.accountCode;
    delete createOp.payload.currentBalanceAmount;
    createOp.status = 'pending';
    createOp.updatedAt = new Date().toISOString();
    await db.queue.put(createOp);
  } else if (existing.serverId) {
    const serverPayload = { ...payload };
    delete serverPayload.accountCode;
    delete serverPayload.currentBalanceAmount;
    await enqueue({ entity: 'account', action: 'update', localId: existing.localId, payload: serverPayload });
  }
  emitSync();
  return envelope('Account updated on this computer', record);
}

export async function queueFillingCreate(payload) {
  assertFillingPayload(payload);
  const localId = newLocalId();
  const record = await buildFillingRecord(payload, localId);
  await assertFillingTank(record, localId);
  await assertFillingInventory(record, localId);
  const serverPayload = { ...payload };
  delete serverPayload.batchNumber;
  await db.fillingBatches.put({
    localId,
    serverId: '',
    syncStatus: 'pending',
    origin: 'local',
    record,
    updatedAt: record.updatedAt,
  });
  await enqueue({ entity: 'fillingBatch', action: 'create', localId, payload: serverPayload });
  emitSync();
  return envelope('Filling batch saved on this computer', record);
}

export async function queueFillingUpdate(id, payload) {
  const existing = await findFilling(id);
  if (!existing) throw offlineReject('This filling batch is not on this computer yet.');
  assertFillingPayload({ ...rowRecord(existing), ...payload, lines: payload.lines || rowRecord(existing).lines });
  const record = await buildFillingRecord(payload, existing.localId, rowRecord(existing));
  await assertFillingTank(record, existing.localId);
  await assertFillingInventory(record, existing.localId);
  const stockBaseline = existing.syncStatus === 'synced' && !existing.stockBaseline
    ? rowRecord(existing)
    : existing.stockBaseline || null;
  await db.fillingBatches.put({
    ...existing,
    stockBaseline,
    syncStatus: 'pending',
    record,
    updatedAt: record.updatedAt,
  });
  const createOp = await pendingCreate('fillingBatch', existing.localId);
  if (createOp) {
    createOp.payload = { ...createOp.payload, ...payload };
    delete createOp.payload.batchNumber;
    createOp.status = 'pending';
    createOp.updatedAt = new Date().toISOString();
    await db.queue.put(createOp);
  } else if (existing.serverId) {
    const serverPayload = { ...payload };
    delete serverPayload.batchNumber;
    await enqueue({ entity: 'fillingBatch', action: 'update', localId: existing.localId, payload: serverPayload });
  } else {
    const serverPayload = { ...payload };
    delete serverPayload.batchNumber;
    await enqueue({ entity: 'fillingBatch', action: 'create', localId: existing.localId, payload: serverPayload });
  }
  emitSync();
  return envelope('Filling batch updated on this computer', record);
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
  if (isLocalId(payload.accountId)) {
    const account = await findAccount(payload.accountId);
    if (!account) throw offlineReject('Select an account saved on this computer.');
    const createOp = await pendingCreate('account', payload.accountId);
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
  if (isLocalId(payload.supplierId)) {
    const supplier = await findSupplier(payload.supplierId);
    if (!supplier) throw offlineReject('Select a supplier saved on this computer.');
    const createOp = await pendingCreate('supplier', payload.supplierId);
    if (createOp) dependsOn.push(createOp.operationId);
  }
  if (isLocalId(payload.accountId)) {
    const account = await findAccount(payload.accountId);
    if (!account) throw offlineReject('Select an account saved on this computer.');
    const createOp = await pendingCreate('account', payload.accountId);
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

function filterSuppliers(rows, params) {
  return rows.filter((row) => {
    const record = rowRecord(row);
    if (params.isActive === true || params.isActive === 'true') {
      if (record.isActive === false) return false;
    }
    if (params.isActive === false || params.isActive === 'false') {
      if (record.isActive !== false) return false;
    }
    if (!params.search) return true;
    return [
      record.supplierName,
      record.supplierCode,
      record.contactPersonName,
      record.phoneNumber,
      record.emailAddress,
      record.city,
      record.taxRegistrationNumber,
      record.bankName,
    ].some((value) => includesText(value, params.search));
  });
}

function filterAccounts(rows, params) {
  return rows.filter((row) => {
    const record = rowRecord(row);
    if (params.accountType && params.accountType !== 'all' && record.accountType !== params.accountType) return false;
    if (params.status === 'inactive' && record.isActive !== false) return false;
    if (params.status === 'review' && !record.needsReview) return false;
    if (params.status === 'active' && (record.isActive === false || record.needsReview)) return false;
    if (!params.search) return true;
    return [record.accountCode, record.accountName, record.bankName, record.branchName, record.accountNumber]
      .some((value) => includesText(value, params.search));
  });
}

function accountListSummary(items) {
  return {
    totalAccounts: items.length,
    activeAccounts: items.filter((account) => account.isActive !== false && !account.needsReview).length,
    totalOpeningBalance: roundMoney(items.reduce((sum, account) => sum + (Number(account.openingBalanceAmount) || 0), 0)),
    totalCurrentBalance: roundMoney(items.reduce((sum, account) => sum + (Number(account.currentBalanceAmount) || 0), 0)),
    needsReviewCount: items.filter((account) => account.needsReview).length,
  };
}

function accountFormOptionsData(parentRecords) {
  return {
    nextAccountCode: '',
    accountTypes: Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => ({ value, label })),
    accountCategories: Object.entries(ACCOUNT_CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
    statuses: [
      { value: 'active', label: 'Active' },
      { value: 'review', label: 'Review' },
      { value: 'inactive', label: 'Inactive' },
    ],
    activeStatuses: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
    parentAccounts: parentRecords.filter((account) => account.isActive !== false).map(accountOption),
  };
}

function fillingLineTotals(line) {
  const count = Number(line.cylinderCount) || 0;
  const weight = Number(line.targetFillWeightKg) || 0;
  const expected = roundMoney(count * weight);
  const hasResidual = line.residualRecoveredKg != null && line.residualRecoveredKg !== '';
  const hasActual = line.actualLpgUsedKg != null && line.actualLpgUsedKg !== '';
  let residual = hasResidual ? Number(line.residualRecoveredKg) : null;
  let actual = hasActual ? Number(line.actualLpgUsedKg) : null;
  if (actual == null && residual == null) {
    actual = expected;
    residual = 0;
  } else if (actual == null) {
    actual = roundMoney(expected - residual);
  } else if (residual == null) {
    residual = roundMoney(Math.max(0, expected - actual));
  }
  return {
    cylinderCount: count,
    targetFillWeightKg: weight,
    expectedFillKg: expected,
    residualRecoveredKg: roundMoney(residual),
    actualLpgUsedKg: roundMoney(actual),
  };
}

function calendarDay(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const local = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const utc = date.toISOString().slice(0, 10);
  return { local, utc };
}

function matchesFillingDay(value, day) {
  if (!day) return true;
  const wanted = String(day).slice(0, 10);
  const parts = calendarDay(value);
  return parts.local === wanted || parts.utc === wanted;
}

function filterFillingBatches(rows, params) {
  const search = String(params.search || '').trim().toLowerCase();
  return rows.filter((row) => {
    const record = rowRecord(row);
    if (params.batchStatus && params.batchStatus !== 'all' && record.batchStatus !== params.batchStatus) return false;
    if (params.storageTankId && !sameParty(record.storageTankId, params.storageTankId) && !sameParty(record.tank?._id, params.storageTankId)) return false;
    const day = params.date || (params.startDate && params.startDate === params.endDate ? params.startDate : '');
    if (day && !matchesFillingDay(record.fillingDate, day)) return false;
    if (params.startDate && params.startDate !== params.endDate) {
      const start = new Date(params.startDate);
      if (!Number.isNaN(start.getTime()) && new Date(record.fillingDate) < start) return false;
    }
    if (params.endDate && params.startDate !== params.endDate) {
      const end = new Date(params.endDate);
      end.setDate(end.getDate() + 1);
      if (!Number.isNaN(end.getTime()) && new Date(record.fillingDate) >= end) return false;
    }
    if (!search) return true;
    return [record.batchNumber, record.sourceTankName, record.tank?.tankName, record.tank?.tankCode, record.cylinderTypeName, record.operatorName, record.remarks]
      .some((value) => includesText(value, search));
  });
}

function sortFillingRecords(records) {
  return [...records].sort((left, right) => {
    const leftOffline = left?.provisional === true || left?.syncStatus === 'pending' || left?.syncStatus === 'failed' || String(left?.batchNumber || '').startsWith('OFF-') || String(left?._id || '').startsWith('local_');
    const rightOffline = right?.provisional === true || right?.syncStatus === 'pending' || right?.syncStatus === 'failed' || String(right?.batchNumber || '').startsWith('OFF-') || String(right?._id || '').startsWith('local_');
    if (leftOffline !== rightOffline) return leftOffline ? -1 : 1;
    return new Date(right.fillingDate || right.createdAt || 0).getTime() - new Date(left.fillingDate || left.createdAt || 0).getTime();
  });
}

function fillingListSummary(records) {
  const completed = records.filter((batch) => batch.batchStatus !== 'pending');
  return {
    totalBatches: records.length,
    totalQuantityKg: roundMoney(completed.reduce((sum, batch) => sum + (Number(batch.actualLpgUsedKg) || 0), 0)),
    totalResidualRecoveredKg: roundMoney(completed.reduce((sum, batch) => sum + (Number(batch.residualRecoveredKg) || 0), 0)),
    completed: completed.length,
    pending: records.filter((batch) => batch.batchStatus === 'pending').length,
  };
}

const FILLING_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

function cylinderTypeKey(value) {
  return String(value?._id || value?.id || value || '');
}

function fillLineCounts(record) {
  const counts = new Map();
  if (!record || record.batchStatus === 'pending') return counts;
  for (const line of record.lines || []) {
    const typeId = cylinderTypeKey(line.cylinderTypeId);
    const count = Number(line.cylinderCount) || 0;
    if (!typeId || count <= 0) continue;
    counts.set(typeId, (counts.get(typeId) || 0) + count);
  }
  return counts;
}

function fillUsedKg(record) {
  if (!record || record.batchStatus === 'pending') return 0;
  if (record.actualLpgUsedKg != null) return Number(record.actualLpgUsedKg) || 0;
  return (record.lines || []).reduce((sum, line) => sum + (Number(line.actualLpgUsedKg) || 0), 0);
}

async function pendingFillEffect() {
  const filled = new Map();
  const empty = new Map();
  let kg = 0;
  for (const row of await allFillingBatches()) {
    const currentCounts = fillLineCounts(rowRecord(row));
    const baselineCounts = row.syncStatus === 'synced' ? currentCounts : fillLineCounts(row.stockBaseline);
    const apply = (typeId, delta) => {
      if (!delta) return;
      filled.set(typeId, (filled.get(typeId) || 0) + delta);
      empty.set(typeId, (empty.get(typeId) || 0) + delta);
    };
    for (const [typeId, count] of currentCounts) apply(typeId, count - (baselineCounts.get(typeId) || 0));
    for (const [typeId, count] of baselineCounts) {
      if (!currentCounts.has(typeId)) apply(typeId, -count);
    }
    const currentKg = fillUsedKg(rowRecord(row));
    const baselineKg = row.syncStatus === 'synced' ? currentKg : fillUsedKg(row.stockBaseline);
    kg += currentKg - baselineKg;
  }
  return { filled, empty, kg: roundMoney(kg) };
}

function stockLabels(quantity, minimumStockLevel) {
  const qty = Number(quantity) || 0;
  const min = Number(minimumStockLevel) || 0;
  if (qty <= 0) return { stockStatus: 'out-of-stock', stockStatusLabel: 'Out of Stock' };
  if (min > 0 && qty <= min) return { stockStatus: 'low-stock', stockStatusLabel: 'Low Stock' };
  return { stockStatus: 'in-stock', stockStatusLabel: 'In Stock' };
}

function applyFillToItem(item, effect) {
  if (!item) return item;
  const typeId = cylinderTypeKey(item.cylinderTypeId);
  let delta = 0;
  if (item.itemCategory === 'filled-cylinder') delta = effect.filled.get(typeId) || 0;
  if (item.itemCategory === 'empty-cylinder') delta = -(effect.empty.get(typeId) || 0);
  if (!delta) return item;
  const currentQuantity = roundMoney(Math.max(0, (Number(item.currentQuantity) || 0) + delta));
  return {
    ...item,
    currentQuantity,
    ...(item.stockStatusLabel || item.minimumStockLevel != null ? stockLabels(currentQuantity, item.minimumStockLevel) : {}),
  };
}

function applyTankKg(tank, reservedKg) {
  if (!tank || !reservedKg) return tank;
  const current = roundMoney(Math.max(0, (Number(tank.currentQuantityKg) || 0) - reservedKg));
  const capacity = Number(tank.capacityKg) || 0;
  const next = {
    ...tank,
    currentQuantityKg: current,
    fillPercent: capacity > 0 ? Math.round((current / capacity) * 1000) / 10 : tank.fillPercent,
  };
  if (tank.availableCapacityKg != null) next.availableCapacityKg = roundMoney(capacity - current);
  if (tank.tankCode && tank.tankName) {
    next.displayName = `${tank.tankCode} — ${tank.tankName} (${current.toLocaleString('en-US')} / ${capacity.toLocaleString('en-US')} KG)`;
  }
  return next;
}

async function withTankReservation(data) {
  if (!data?.tank || data.tank.currentQuantityKg == null) return data;
  const { kg } = await pendingFillEffect();
  if (!kg) return data;
  return { ...data, tank: applyTankKg(data.tank, kg) };
}

async function fillingCatalog() {
  const snaps = await db.snapshots.toArray();
  const form = snaps.find((snap) => snap.path === '/filling-batches/form-options')?.envelope?.data || {};
  return form;
}

async function buildFillingRecord(payload, localId, previous = {}) {
  const catalog = await fillingCatalog();
  const tank = catalog.tank || {};
  const lines = (payload.lines || previous.lines || []).map((line) => {
    const type = (catalog.cylinderTypes || []).find((item) => sameParty(item._id, line.cylinderTypeId)) || {};
    const totals = fillingLineTotals(line);
    return {
      ...totals,
      cylinderTypeId: line.cylinderTypeId,
      cylinderTypeName: type.typeName || line.cylinderTypeName || '',
      cylinderType: type._id ? { _id: type._id, typeCode: type.typeCode, typeName: type.typeName, capacityKg: type.capacityKg } : line.cylinderType || null,
    };
  });
  const operator = (catalog.employees || []).find((item) => sameParty(item._id, payload.operatorEmployeeId || previous.operatorEmployeeId)) || {};
  const status = payload.batchStatus || previous.batchStatus || 'completed';
  const now = new Date().toISOString();
  const cylinderTypeName = lines.length > 1
    ? lines.filter((line) => line.cylinderTypeName).map((line) => `${line.cylinderTypeName} × ${line.cylinderCount}`).join(', ')
    : (lines[0]?.cylinderTypeName || previous.cylinderTypeName || '');
  return {
    _id: previous._id || localId,
    batchNumber: previous.batchNumber || `OFF-${String(localId).slice(-6).toUpperCase()}`,
    fillingDate: payload.fillingDate || previous.fillingDate || now,
    storageTankId: payload.storageTankId || previous.storageTankId || tank._id || null,
    sourceTankName: tank.tankName || previous.sourceTankName || '',
    tank: tank._id ? {
      _id: tank._id,
      tankCode: tank.tankCode,
      tankName: tank.tankName,
      currentQuantityKg: tank.currentQuantityKg,
      capacityKg: tank.capacityKg,
      displayName: tank.displayName,
    } : previous.tank || null,
    lines,
    cylinderCount: lines.reduce((sum, line) => sum + line.cylinderCount, 0),
    targetFillWeightKg: lines[0]?.targetFillWeightKg || 0,
    expectedFillKg: roundMoney(lines.reduce((sum, line) => sum + line.expectedFillKg, 0)),
    residualRecoveredKg: roundMoney(lines.reduce((sum, line) => sum + line.residualRecoveredKg, 0)),
    actualLpgUsedKg: roundMoney(lines.reduce((sum, line) => sum + line.actualLpgUsedKg, 0)),
    cylinderTypeId: lines[0]?.cylinderTypeId || previous.cylinderTypeId || null,
    cylinderTypeName,
    operatorEmployeeId: payload.operatorEmployeeId || previous.operatorEmployeeId || null,
    operatorName: operator.displayName || operator.fullName || previous.operatorName || '',
    operator: operator._id ? {
      _id: operator._id,
      employeeCode: operator.employeeCode,
      fullName: operator.fullName,
      jobTitle: operator.jobTitle || '',
    } : previous.operator || null,
    remarks: payload.remarks ?? previous.remarks ?? '',
    batchStatus: status,
    batchStatusLabel: status === 'pending' ? 'Pending' : 'Completed',
    syncStatus: 'pending',
    provisional: true,
    createdAt: previous.createdAt || now,
    updatedAt: now,
  };
}

function assertFillingPayload(payload) {
  if (!payload.fillingDate) throw offlineReject('Choose a filling date.');
  if (!payload.operatorEmployeeId) throw offlineReject('Choose the operator.');
  if (!Array.isArray(payload.lines) || !payload.lines.length) throw offlineReject('Add at least one cylinder type.');
  payload.lines.forEach((line, index) => {
    if (!line.cylinderTypeId) throw offlineReject(`Cylinder type ${index + 1} is required.`);
    if (!(Number(line.cylinderCount) >= 1)) throw offlineReject('Cylinder count must be at least 1.');
    if (!(Number(line.targetFillWeightKg) > 0)) throw offlineReject('Target fill weight must be greater than 0.');
  });
}

async function assertFillingTank(record, ignoreLocalId) {
  if (record.batchStatus === 'pending') return;
  const catalog = await fillingCatalog();
  if (catalog.tank?.currentQuantityKg == null) return;
  const reserved = (await allFillingBatches()).reduce((sum, row) => {
    if (row.localId === ignoreLocalId || row.syncStatus === 'synced') return sum;
    const saved = rowRecord(row);
    if (saved.batchStatus === 'pending') return sum;
    return sum + (Number(saved.actualLpgUsedKg) || 0);
  }, 0);
  const available = roundMoney((Number(catalog.tank.currentQuantityKg) || 0) - reserved);
  if ((Number(record.actualLpgUsedKg) || 0) > available + 0.001) {
    throw offlineReject('The storage tank does not have enough gas for this batch.');
  }
}

async function cachedInventoryItems() {
  const snaps = await db.snapshots.toArray();
  const items = [];
  const seen = new Set();
  for (const snap of snaps) {
    if (snap.path !== '/inventory-items') continue;
    for (const item of snap.envelope?.data?.items || []) {
      if (!item?._id || seen.has(String(item._id))) continue;
      seen.add(String(item._id));
      items.push(item);
    }
  }
  return items;
}

async function assertFillingInventory(record, ignoreLocalId) {
  if (record.batchStatus === 'pending') return;
  const items = await cachedInventoryItems();
  if (!items.length) return;
  const effect = await pendingFillEffect();
  const existing = ignoreLocalId ? await db.fillingBatches.get(ignoreLocalId) : null;
  if (existing) {
    for (const [typeId, count] of fillLineCounts(rowRecord(existing))) {
      effect.empty.set(typeId, (effect.empty.get(typeId) || 0) - count);
    }
  }
  for (const line of record.lines || []) {
    const typeId = cylinderTypeKey(line.cylinderTypeId);
    const empty = items.find((item) => item.itemCategory === 'empty-cylinder' && cylinderTypeKey(item.cylinderTypeId) === typeId);
    if (!empty) continue;
    const available = (Number(empty.currentQuantity) || 0) - (effect.empty.get(typeId) || 0);
    if ((Number(line.cylinderCount) || 0) > available + 0.001) {
      const name = line.cylinderTypeName || empty.itemName || 'this cylinder type';
      throw offlineReject(`Not enough empty cylinders for ${name}.`);
    }
  }
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
    if (params.supplierId && !sameParty(record.supplierId, params.supplierId)) return false;
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

async function supplierLedger(id) {
  const supplier = await findSupplier(id);
  if (!supplier) return null;
  const record = rowRecord(supplier);
  const payments = (await allPayments()).filter((row) => {
    const payment = rowRecord(row);
    return payment.paymentType === 'pay'
      && (sameParty(payment.supplierId, id) || sameParty(payment.supplierId, supplier.localId) || sameParty(payment.supplierId, supplier.serverId));
  });
  const paid = roundMoney(payments.reduce((sum, row) => sum + (Number(rowRecord(row).paymentAmount) || 0), 0));
  const lastPayment = payments
    .map(rowRecord)
    .sort((left, right) => new Date(right.paymentDate) - new Date(left.paymentDate))[0];
  return envelope('Supplier ledger fetched', {
    supplier: {
      ...record,
      accountStatus: record.isActive === false ? 'Inactive Account' : 'Active Account',
    },
    summary: {
      totalPurchases: 0,
      purchaseCount: 0,
      totalQuantityKg: 0,
      outstandingBalance: roundMoney(0 - paid),
      lastPaymentAmount: lastPayment ? roundMoney(lastPayment.paymentAmount) : 0,
      lastPaymentDate: lastPayment?.paymentDate || null,
      lastPaymentNumber: lastPayment?.paymentNumber || null,
      lastPaymentMethod: lastPayment?.paymentMethod || null,
      lastPaymentMethodLabel: lastPayment?.paymentMethodLabel || lastPayment?.paymentMethod || null,
      creditLimitAmount: roundMoney(record.creditLimitAmount),
      provisional: supplier.syncStatus !== 'synced' || payments.some((row) => row.syncStatus !== 'synced'),
    },
  });
}

async function accountLedger(id) {
  const account = await findAccount(id);
  if (!account) return null;
  const record = rowRecord(account);
  return envelope('Account ledger fetched', {
    account: record,
    summary: {
      openingBalanceAmount: roundMoney(record.openingBalanceAmount),
      currentBalanceAmount: roundMoney(record.currentBalanceAmount),
      totalInward: 0,
      totalOutward: 0,
      netMovement: 0,
      inwardCount: 0,
      outwardCount: 0,
      transactionCount: 0,
      lastTransactionAmount: 0,
      lastTransactionDate: null,
      lastTransactionNumber: null,
      lastTransactionDirection: null,
      lastTransactionDirectionLabel: null,
      provisional: account.syncStatus !== 'synced',
    },
  });
}

async function adjustStock(items) {
  if (!Array.isArray(items)) return items;
  const effect = await pendingFillEffect();
  const copy = [];
  for (const item of items) {
    if (!item?._id || item.currentQuantity == null) {
      copy.push(item);
      continue;
    }
    const reserved = await pendingSaleQty(item._id);
    const afterSales = {
      ...item,
      currentQuantity: roundMoney(Math.max(0, (Number(item.currentQuantity) || 0) - reserved)),
    };
    copy.push(applyFillToItem(afterSales, effect));
  }
  return copy;
}

async function adjustCylinderCards(cards) {
  if (!Array.isArray(cards)) return cards;
  const effect = await pendingFillEffect();
  const known = await cachedInventoryItems();
  return cards.map((card) => {
    const match = known.find((item) => String(item._id) === String(card.itemId || card._id));
    return applyFillToItem({
      ...card,
      cylinderTypeId: cylinderTypeKey(card.cylinderTypeId) || cylinderTypeKey(match?.cylinderTypeId),
      itemCategory: card.itemCategory || match?.itemCategory,
      minimumStockLevel: card.minimumStockLevel ?? match?.minimumStockLevel,
    }, effect);
  });
}

function shiftFilledStock(item, beforeCounts, afterCounts) {
  const typeId = cylinderTypeKey(item?.cylinderTypeId);
  if (!typeId) return item;
  const delta = (afterCounts.get(typeId) || 0) - (beforeCounts.get(typeId) || 0);
  if (!delta) return item;
  const sign = item.itemCategory === 'filled-cylinder' ? 1 : item.itemCategory === 'empty-cylinder' ? -1 : 0;
  if (!sign) return item;
  const currentQuantity = roundMoney(Math.max(0, (Number(item.currentQuantity) || 0) + sign * delta));
  return {
    ...item,
    currentQuantity,
    ...(item.stockStatusLabel || item.minimumStockLevel != null ? stockLabels(currentQuantity, item.minimumStockLevel) : {}),
  };
}

async function patchInventoryForFill(before, after) {
  const beforeCounts = fillLineCounts(before);
  const afterCounts = fillLineCounts(after);
  const kgDelta = roundMoney(fillUsedKg(after) - fillUsedKg(before));
  const snaps = await db.snapshots.toArray();
  for (const snap of snaps) {
    const data = snap.envelope?.data;
    if (!data) continue;
    if (snap.path === '/inventory-items') {
      const next = { ...data };
      if (Array.isArray(data.items)) next.items = data.items.map((item) => shiftFilledStock(item, beforeCounts, afterCounts));
      if (Array.isArray(data.summary?.cylinderCards)) {
        const types = new Map((next.items || data.items || []).map((item) => [String(item._id), cylinderTypeKey(item.cylinderTypeId)]));
        next.summary = {
          ...data.summary,
          cylinderCards: data.summary.cylinderCards.map((card) => shiftFilledStock({
            ...card,
            cylinderTypeId: cylinderTypeKey(card.cylinderTypeId) || types.get(String(card.itemId || card._id)) || '',
          }, beforeCounts, afterCounts)),
        };
      }
      await db.snapshots.put({ ...snap, envelope: { ...snap.envelope, data: next } });
    }
    if (kgDelta && snap.path === '/filling-batches/form-options' && data.tank) {
      await db.snapshots.put({
        ...snap,
        envelope: { ...snap.envelope, data: { ...data, tank: applyTankKg(data.tank, kgDelta) } },
      });
    }
    if (kgDelta && snap.path === '/storage-tanks/dashboard' && data.currentQuantityKg != null) {
      await db.snapshots.put({
        ...snap,
        envelope: { ...snap.envelope, data: applyTankKg(data, kgDelta) },
      });
    }
  }
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
  if (Array.isArray(data.suppliers)) {
    const pending = (await allSuppliers()).filter((row) => row.syncStatus !== 'synced');
    const extras = pending.map((row) => {
      const record = rowRecord(row);
      return {
        _id: record._id,
        supplierCode: record.supplierCode,
        supplierName: record.supplierName,
        label: `${record.supplierCode} – ${record.supplierName}`,
      };
    });
    const seen = new Set(data.suppliers.map((supplier) => String(supplier._id)));
    next.suppliers = [...extras.filter((supplier) => !seen.has(String(supplier._id))), ...data.suppliers];
  }
  const pendingAccounts = (await allAccounts())
    .filter((row) => row.syncStatus !== 'synced' && rowRecord(row).isActive !== false)
    .map((row) => accountOption(rowRecord(row)));
  if (pendingAccounts.length && Array.isArray(data.accounts)) {
    const seen = new Set(data.accounts.map((account) => String(account._id)));
    next.accounts = [...pendingAccounts.filter((account) => !seen.has(String(account._id))), ...data.accounts];
  }
  if (pendingAccounts.length && Array.isArray(data.parentAccounts)) {
    const seen = new Set(data.parentAccounts.map((account) => String(account._id)));
    next.parentAccounts = [...pendingAccounts.filter((account) => !seen.has(String(account._id))), ...data.parentAccounts];
  }
  if (Array.isArray(data.inventoryItems)) {
    next.inventoryItems = await adjustStock(data.inventoryItems);
  }
  if (Array.isArray(data.items) && data.items.some((item) => item?.currentQuantity != null && item?.itemName)) {
    next.items = await adjustStock(data.items);
  }
  if (Array.isArray(data.summary?.cylinderCards)) {
    next.summary = {
      ...data.summary,
      cylinderCards: await adjustCylinderCards(data.summary.cylinderCards),
    };
  }
  if (data.tankCode && data.currentQuantityKg != null && data.capacityKg != null && !data.tank) {
    const { kg } = await pendingFillEffect();
    if (kg) Object.assign(next, applyTankKg(data, kg));
  }
  if (data.itemCode && data.itemCategory && data.currentQuantity != null && !Array.isArray(data.items)) {
    const [adjusted] = await adjustStock([data]);
    Object.assign(next, adjusted);
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
  const idMatch = path.match(/^\/(customers|suppliers|accounts|sales|payments|filling-batches)\/([^/]+)$/);
  if (idMatch && idMatch[2] !== 'form-options') {
    const table = idMatch[1] === 'customers' ? await findCustomer(idMatch[2])
      : idMatch[1] === 'suppliers' ? await findSupplier(idMatch[2])
        : idMatch[1] === 'accounts' ? await findAccount(idMatch[2])
          : idMatch[1] === 'sales' ? await findSale(idMatch[2])
            : idMatch[1] === 'filling-batches' ? await findFilling(idMatch[2])
            : (await allPayments()).find((row) => sameParty(row.localId, idMatch[2]) || sameParty(row.serverId, idMatch[2]));
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
  if (/^\/suppliers\/[^/]+\/ledger$/.test(path)) {
    const supplier = await findSupplier(path.split('/')[2]);
    if (supplier && supplier.syncStatus !== 'synced') {
      const ledger = await supplierLedger(path.split('/')[2]);
      if (ledger) return ledger;
    }
  }
  if (/^\/suppliers\/[^/]+\/purchase-history$/.test(path)) {
    const supplier = await findSupplier(path.split('/')[2]);
    if (supplier && supplier.syncStatus !== 'synced') {
      return envelope('Supplier purchase history fetched', paginate([], params));
    }
  }
  if (/^\/suppliers\/[^/]+\/payment-history$/.test(path)) {
    const id = path.split('/')[2];
    const supplier = await findSupplier(id);
    if (supplier && supplier.syncStatus !== 'synced') {
      const rows = filterPayments(await allPayments(), { ...params, supplierId: supplier.localId });
      const alsoServer = supplier.serverId
        ? filterPayments(await allPayments(), { ...params, supplierId: supplier.serverId })
        : [];
      const seen = new Set();
      const combined = [...rows, ...alsoServer].filter((row) => {
        if (seen.has(row.localId)) return false;
        seen.add(row.localId);
        return true;
      });
      return envelope('Supplier payment history fetched', paginate(combined.map(rowRecord), params));
    }
  }
  if (path === '/customers' && (await allCustomers()).length) {
    const rows = filterCustomers(await allCustomers(), params);
    return envelope('Customers fetched', paginate(rows.map(rowRecord), params));
  }
  if (path === '/suppliers') {
    const localRows = filterSuppliers(await allSuppliers(), params);
    const listed = await db.snapshots.get(cacheKey(config));
    const snapItems = Array.isArray(listed?.envelope?.data?.items) ? listed.envelope.data.items : [];
    if (localRows.length || snapItems.length) {
      const covered = new Set();
      for (const row of await allSuppliers()) {
        if (row.serverId) covered.add(String(row.serverId));
        const recordId = rowRecord(row)._id;
        if (recordId) covered.add(String(recordId));
      }
      const extras = filterSuppliers(
        snapItems
          .filter((item) => item?._id && !covered.has(String(item._id)))
          .map((item) => ({ record: item })),
        params,
      ).map(rowRecord);
      const items = [...localRows.map(rowRecord), ...extras];
      if (items.length) return envelope('Suppliers fetched', paginate(items, params));
    }
  }
  if (path === '/accounts') {
    const localRows = filterAccounts(await allAccounts(), params);
    const listed = await db.snapshots.get(cacheKey(config));
    const snapItems = Array.isArray(listed?.envelope?.data?.items) ? listed.envelope.data.items : [];
    if (localRows.length || snapItems.length) {
      const covered = new Set();
      for (const row of await allAccounts()) {
        if (row.serverId) covered.add(String(row.serverId));
        const recordId = rowRecord(row)._id;
        if (recordId) covered.add(String(recordId));
      }
      const extras = filterAccounts(
        snapItems
          .filter((item) => item?._id && !covered.has(String(item._id)))
          .map((item) => ({ record: item })),
        params,
      ).map(rowRecord);
      const items = [...localRows.map(rowRecord), ...extras];
      if (items.length) {
        return envelope('Accounts fetched', {
          ...paginate(items, params),
          summary: accountListSummary(items),
        });
      }
    }
  }
  if (path === '/sales' && (await allSales()).length) {
    const rows = filterSales(await allSales(), params);
    const records = sortSaleRecords(rows.map(rowRecord));
    return envelope('Sales fetched', {
      ...paginate(records, params),
      summary: salesListSummary(records),
    });
  }
  if (path === '/filling-batches') {
    const localRows = await allFillingBatches();
    const snaps = await db.snapshots.toArray();
    const cached = [];
    const covered = new Set();
    for (const row of localRows) {
      if (row.serverId) covered.add(String(row.serverId));
      const recordId = rowRecord(row)._id;
      if (recordId) covered.add(String(recordId));
    }
    for (const snap of snaps) {
      if (snap.path !== '/filling-batches') continue;
      for (const item of snap.envelope?.data?.items || []) {
        if (!item?._id || covered.has(String(item._id))) continue;
        covered.add(String(item._id));
        cached.push({ record: item, syncStatus: 'synced' });
      }
    }
    const records = sortFillingRecords(filterFillingBatches([...localRows, ...cached], params).map(rowRecord));
    return envelope('Filling batches fetched', {
      ...paginate(records, params),
      summary: fillingListSummary(records),
      meta: { statuses: FILLING_STATUSES },
    });
  }
  if (path === '/payments' && (await allPayments()).length) {
    const source = await allPayments();
    const rows = filterPayments(source, params).filter((row) => keepPaymentRow(row, source));
    return envelope('Payments fetched', paginate(rows.map(rowRecord), params));
  }

  const snap = await db.snapshots.get(cacheKey(config));
  if (!snap?.envelope) {
    if (/^\/suppliers\/[^/]+\/ledger$/.test(path)) {
      const ledger = await supplierLedger(path.split('/')[2]);
      if (ledger) return ledger;
    }
    if (/^\/accounts\/[^/]+\/ledger$/.test(path)) {
      const ledger = await accountLedger(path.split('/')[2]);
      if (ledger) return ledger;
    }
    if (/^\/accounts\/[^/]+\/transactions$/.test(path)) {
      const account = await findAccount(path.split('/')[2]);
      if (account && account.syncStatus !== 'synced') {
        return envelope('Account transactions fetched', {
          account: rowRecord(account),
          ...paginate([], params),
        });
      }
    }
    if (path === '/accounts/form-options') {
      const parents = (await allAccounts()).map(rowRecord);
      return envelope('Account form options fetched', accountFormOptionsData(parents));
    }
    return null;
  }
  const data = await withPendingParties(snap.envelope.data);
  if (path === '/payments/form-options' && params.customerId) {
    data.outstandingInvoices = await outstandingForCustomer(params.customerId);
    data.customers = (await withPendingParties({ customers: data.customers || [] })).customers;
  }
  if (path === '/filling-batches/form-options') {
    const adjusted = await withTankReservation(data);
    Object.assign(data, adjusted);
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
  if (method === 'post' && path === '/suppliers') return queueSupplierCreate(payload);
  if (method === 'patch' && /^\/suppliers\/[^/]+$/.test(path)) {
    return queueSupplierUpdate(path.split('/')[2], payload);
  }
  if (method === 'post' && path === '/accounts') return queueAccountCreate(payload);
  if (method === 'patch' && /^\/accounts\/[^/]+$/.test(path)) {
    return queueAccountUpdate(path.split('/')[2], payload);
  }
  if (method === 'post' && path === '/filling-batches') return queueFillingCreate(payload);
  if (method === 'patch' && /^\/filling-batches\/[^/]+$/.test(path)) {
    return queueFillingUpdate(path.split('/')[2], payload);
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
  if (!['/customers', '/suppliers', '/accounts', '/sales', '/payments', '/filling-batches'].includes(path) || !Array.isArray(payload.data.items)) {
    const data = await withPendingParties(payload.data);
    if (path === '/filling-batches/form-options') {
      return { ...payload, data: await withTankReservation(data) };
    }
    return { ...payload, data };
  }
  const table = path === '/customers' ? filterCustomers(await allCustomers(), params)
    : path === '/suppliers' ? filterSuppliers(await allSuppliers(), params)
      : path === '/accounts' ? filterAccounts(await allAccounts(), params)
        : path === '/sales' ? filterSales(await allSales(), params)
          : path === '/filling-batches' ? filterFillingBatches(await allFillingBatches(), params)
            : filterPayments(await allPayments(), params);
  const pending = table
    .filter((row) => row.syncStatus !== 'synced' && row.origin !== 'sale-receipt')
    .map(rowRecord);
  if (!pending.length || Number(params.page || 1) !== 1) return payload;
  const seen = new Set(payload.data.items.map((item) => String(item._id)));
  const extras = pending.filter((item) => !seen.has(String(item._id)));
  const replaced = payload.data.items.map((item) => (
    pending.find((row) => String(row._id) === String(item._id)) || item
  ));
  const summary = payload.data.summary;
  const freshFills = path === '/filling-batches'
    ? extras.filter((batch) => String(batch._id || '').startsWith('local_') || String(batch.batchNumber || '').startsWith('OFF-'))
    : [];
  const completedFills = freshFills.filter((batch) => batch.batchStatus !== 'pending');
  const freshSales = path === '/sales'
    ? extras.filter((sale) => String(sale._id || '').startsWith('local_') || String(sale.invoiceNumber || '').startsWith('OFF-'))
    : [];
  const countedSales = freshSales.filter((sale) => sale.saleStatus !== 'cancelled' && sale.saleStatus !== 'draft');
  const saleAmount = (sale) => Number(sale.totalAmount) || 0;
  const isCreditSale = (sale) => sale.saleType === 'credit' || sale.type === 'credit';
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todaySales = countedSales.filter((sale) => new Date(sale.invoiceDate || sale.createdAt || 0) >= todayStart);
  const nextSummary = path === '/filling-batches' && summary ? {
    ...summary,
    totalBatches: (summary.totalBatches || 0) + freshFills.length,
    totalQuantityKg: roundMoney((summary.totalQuantityKg || 0) + completedFills.reduce((sum, batch) => sum + (Number(batch.actualLpgUsedKg) || 0), 0)),
    totalResidualRecoveredKg: roundMoney((summary.totalResidualRecoveredKg || 0) + completedFills.reduce((sum, batch) => sum + (Number(batch.residualRecoveredKg) || 0), 0)),
    completed: (summary.completed || 0) + completedFills.length,
    pending: (summary.pending || 0) + freshFills.filter((batch) => batch.batchStatus === 'pending').length,
  } : path === '/sales' && summary ? {
    ...summary,
    totalSalesAmount: roundMoney((summary.totalSalesAmount || 0) + countedSales.reduce((sum, sale) => sum + saleAmount(sale), 0)),
    totalSalesCount: (summary.totalSalesCount || 0) + countedSales.length,
    todaySalesAmount: roundMoney((summary.todaySalesAmount || 0) + todaySales.reduce((sum, sale) => sum + saleAmount(sale), 0)),
    todaySalesCount: (summary.todaySalesCount || 0) + todaySales.length,
    cashSalesAmount: roundMoney((summary.cashSalesAmount || 0) + countedSales.filter((sale) => !isCreditSale(sale)).reduce((sum, sale) => sum + saleAmount(sale), 0)),
    cashSalesCount: (summary.cashSalesCount || 0) + countedSales.filter((sale) => !isCreditSale(sale)).length,
    creditSalesAmount: roundMoney((summary.creditSalesAmount || 0) + countedSales.filter(isCreditSale).reduce((sum, sale) => sum + saleAmount(sale), 0)),
    creditSalesCount: (summary.creditSalesCount || 0) + countedSales.filter(isCreditSale).length,
    pendingCreditAmount: roundMoney((summary.pendingCreditAmount || 0) + countedSales.reduce((sum, sale) => sum + (Number(sale.outstandingAmount) || 0), 0)),
  } : path === '/accounts' && summary ? {
    ...summary,
    totalAccounts: (summary.totalAccounts || 0) + extras.length,
    activeAccounts: (summary.activeAccounts || 0) + extras.filter((account) => account.isActive !== false && !account.needsReview).length,
    totalOpeningBalance: roundMoney((summary.totalOpeningBalance || 0) + extras.reduce((sum, account) => sum + (Number(account.openingBalanceAmount) || 0), 0)),
    totalCurrentBalance: roundMoney((summary.totalCurrentBalance || 0) + extras.reduce((sum, account) => sum + (Number(account.currentBalanceAmount) || 0), 0)),
    needsReviewCount: (summary.needsReviewCount || 0) + extras.filter((account) => account.needsReview).length,
  } : summary;
  return {
    ...payload,
    data: {
      ...payload.data,
      items: [...extras, ...replaced],
      ...(nextSummary ? { summary: nextSummary } : {}),
      pagination: {
        ...payload.data.pagination,
        total: (payload.data.pagination?.total || payload.data.items.length) + (path === '/sales' ? freshSales.length : path === '/filling-batches' ? freshFills.length : extras.length),
      },
    },
  };
}

export async function applyServerResult(localId, entity, serverRecord) {
  const table = entity === 'customer' ? db.customers
    : entity === 'supplier' ? db.suppliers
      : entity === 'account' ? db.accounts
        : entity === 'sale' ? db.sales
          : entity === 'fillingBatch' ? db.fillingBatches
            : db.payments;
  const existing = await table.get(localId);
  if (!existing || !serverRecord?._id) return;
  const fillBefore = entity === 'fillingBatch'
    ? (existing.stockBaseline || (existing.syncStatus === 'synced' ? rowRecord(existing) : null))
    : null;
  const saved = {
    ...existing,
    serverId: String(serverRecord._id),
    syncStatus: 'synced',
    record: { ...serverRecord, syncStatus: 'synced', provisional: false },
    updatedAt: new Date().toISOString(),
  };
  delete saved.stockBaseline;
  await table.put(saved);
  if (entity === 'fillingBatch') await patchInventoryForFill(fillBefore, serverRecord);
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

export async function discardPendingSale(localId) {
  const sale = await db.sales.get(localId);
  if (!sale || sale.serverId) return false;
  const queue = await db.queue.toArray();
  const related = queue.filter((item) => (
    item.localId === localId
    || item.saleLocalId === localId
    || (item.dependsOn || []).includes(localId)
  ));
  if (related.length) await db.queue.bulkDelete(related.map((item) => item.operationId));
  const payments = await db.payments.filter((payment) => payment.saleLocalId === localId).toArray();
  if (payments.length) await db.payments.bulkDelete(payments.map((payment) => payment.localId));
  await db.sales.delete(localId);
  emitSync();
  return true;
}

export async function discardFailedOperation(operationId) {
  const row = await db.queue.get(operationId);
  if (!row || row.status !== 'failed') return;
  const table = row.entity === 'customer' ? db.customers
    : row.entity === 'supplier' ? db.suppliers
      : row.entity === 'account' ? db.accounts
        : row.entity === 'sale' ? db.sales
          : row.entity === 'fillingBatch' ? db.fillingBatches
            : db.payments;
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
    suppliers: await db.suppliers.toArray(),
    accounts: await db.accounts.toArray(),
    sales: await db.sales.toArray(),
    payments: await db.payments.toArray(),
    fillingBatches: await db.fillingBatches.toArray(),
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
  if (method === 'post' && ['/customers', '/suppliers', '/accounts', '/sales', '/payments', '/filling-batches'].includes(path)) return true;
  if (method === 'patch' && /^\/(customers|suppliers|accounts|sales|filling-batches)\/[^/]+$/.test(path)) return true;
  return false;
}

export function isRead(config) {
  return requestMethod(config) === 'get';
}
