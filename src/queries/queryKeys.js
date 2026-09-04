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

}
