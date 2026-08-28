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

}
