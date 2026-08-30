export const queryKeys = {
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
  // Cylinder Types
  // =========================
  cylinderTypes: {
    all: ['cylinder-types'],

    lists: () => ['cylinder-types', 'list'],

    list: (params) => ['cylinder-types', 'list', params],

    detail: id => ['cylinder-types', 'detail', id]
  },

}
