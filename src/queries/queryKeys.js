export const queryKeys = {
  // =========================
  // Authentication
  // =========================
  auth: {
    currentUser: () => ['auth', 'current-user']
  },

  // =========================
  // Notifications
  // =========================
  notifications: {
    all: ['notifications'],

    lists: () => ['notifications', 'list'],

    list: (page, limit) => [
      'notifications',
      'list',
      {
        page,
        limit
      }
    ],

    detail: id => ['notifications', 'detail', id]
  },

  // =========================
  // Customers
  // =========================
  customers: {
    all: ['customers'],

    lists: () => ['customers', 'list'],

    list: (params) => ['customers', 'list', params],

    detail: id => ['customers', 'detail', id]
  },

  // =========================
  // Employees
  // =========================
  employees: {
    all: ['employees'],

    lists: () => ['employees', 'list'],

    list: (params) => ['employees', 'list', params],

    detail: id => ['employees', 'detail', id]
  },

  // =========================
  // Suppliers
  // =========================
  suppliers: {
    all: ['suppliers'],

    lists: () => ['suppliers', 'list'],

    list: (params) => ['suppliers', 'list', params],

    detail: id => ['suppliers', 'detail', id]
  },

  // =========================
  // Users
  // =========================
  users: {
    all: ['users'],

    lists: () => ['users', 'list'],

    list: (params) => ['users', 'list', params],

    detail: id => ['users', 'detail', id]
  },

  // =========================
  // Audit Logs
  // =========================
  auditLogs: {
    all: ['audit-logs'],

    lists: () => ['audit-logs', 'list'],

    list: (params) => ['audit-logs', 'list', params],
  },

  // =========================
  // Roles
  // =========================
  roles: {
    all: ['roles'],

    lists: () => ['roles', 'list'],

    list: (params) => ['roles', 'list', params],

    detail: id => ['roles', 'detail', id],
  },

  // =========================
  // Permissions
  // =========================
  permissions: {
    all: ['permissions'],

    list: () => ['permissions', 'list'],
  },

  // =========================
  // Cylinder Types
  // =========================
  cylinderTypes: {
    all: ['cylinder-types'],

    lists: () => ['cylinder-types', 'list'],

    list: (params) => ['cylinder-types', 'list', params],

    detail: id => ['cylinder-types', 'detail', id]
  },

  // =========================
  // LPG Receipts
  // =========================
  lpgReceipts: {
    all: ['lpg-receipts'],

    lists: () => ['lpg-receipts', 'list'],

    list: (params) => ['lpg-receipts', 'list', params],

    detail: id => ['lpg-receipts', 'detail', id]
  },

  // =========================
  // Filling Batches
  // =========================
  fillingBatches: {
    all: ['filling-batches'],

    formOptions: () => ['filling-batches', 'form-options'],

    lists: () => ['filling-batches', 'list'],

    list: (params) => ['filling-batches', 'list', params],

    detail: id => ['filling-batches', 'detail', id],
  },

  // =========================
  // Accounts
  // =========================
  accounts: {
    all: ['accounts'],

    lists: () => ['accounts', 'list'],

    list: (params) => ['accounts', 'list', params],

    detail: id => ['accounts', 'detail', id]
  },

  // =========================
  // Inventory
  // =========================
  inventory: {
    all: ['inventory'],

    lists: () => ['inventory', 'list'],

    list: (params) => ['inventory', 'list', params],

    detail: id => ['inventory', 'detail', id],

    formOptions: () => ['inventory', 'form-options']
  },

  // =========================
  // Storage Tanks
  // =========================
  storageTanks: {
    all: ['storage-tanks'],

    dashboard: () => ['storage-tanks', 'dashboard'],
  },

  // =========================
  // Sales
  // =========================
  sales: {
    all: ['sales'],

    lists: () => ['sales', 'list'],

    list: (params) => ['sales', 'list', params],

    detail: id => ['sales', 'detail', id]
  },

  // =========================
  // Return Sales
  // =========================
  returnSales: {
    all: ['return-sales'],

    lists: () => ['return-sales', 'list'],

    list: (params) => ['return-sales', 'list', params],

    detail: id => ['return-sales', 'detail', id],

    formOptions: () => ['return-sales', 'form-options']
  },

  // =========================
  // Payments
  // =========================
  payments: {
    all: ['payments'],

    lists: () => ['payments', 'list'],

    list: (params) => ['payments', 'list', params],

    detail: id => ['payments', 'detail', id],

    formOptions: () => ['payments', 'form-options']
  },

  // =========================
  // Assets
  // =========================
  assets: {
    all: ['assets'],

    lists: () => ['assets', 'list'],

    list: (params) => ['assets', 'list', params],

    detail: id => ['assets', 'detail', id]
  },

  // =========================
  // Maintenance Records
  // =========================
  maintenanceRecords: {
    all: ['maintenance-records'],

    lists: () => ['maintenance-records', 'list'],

    list: (params) => ['maintenance-records', 'list', params],

    detail: id => ['maintenance-records', 'detail', id]
  },
}
