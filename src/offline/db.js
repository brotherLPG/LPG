import Dexie from 'dexie';

const db = new Dexie('brother-lpg');

db.version(1).stores({
  customers: 'localId, serverId, syncStatus, updatedAt',
  sales: 'localId, serverId, syncStatus, customerLocalId, updatedAt',
  payments: 'localId, serverId, syncStatus, customerLocalId, updatedAt',
  queue: 'operationId, status, entity, createdAt',
  snapshots: 'key',
  auth: 'email',
  meta: 'key',
});

db.version(2).stores({
  customers: 'localId, serverId, syncStatus, updatedAt',
  suppliers: 'localId, serverId, syncStatus, updatedAt',
  sales: 'localId, serverId, syncStatus, customerLocalId, updatedAt',
  payments: 'localId, serverId, syncStatus, customerLocalId, updatedAt',
  queue: 'operationId, status, entity, createdAt',
  snapshots: 'key',
  auth: 'email',
  meta: 'key',
});

export default db;
