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
  // Users
  // =========================
  users: {
    all: ['users'],

    lists: () => ['users', 'list'],

    list: (params) => ['users', 'list', params],

    detail: id => ['users', 'detail', id]
  },

}
