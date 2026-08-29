import { queryKeys } from './queryKeys'

import { getNotifications } from '../api/notificationApi.js'
import { getCustomers } from '../api/customers.api.js'
import { getUsers } from '../api/users.api.js'
import { getAuditLogs } from '../api/auditLogs.api.js'

export const prefetchDashboard = async queryClient => {
  await Promise.all([

    // ========================================
    // Notifications
    // ========================================

    queryClient.prefetchQuery({
      queryKey: queryKeys.notifications.list(1, 10),

      queryFn: () =>
        getNotifications({
          page: 1,
          limit: 10
        })
    }),

    // ========================================
    // Customers
    // ========================================

    queryClient.prefetchQuery({
      queryKey: queryKeys.customers.list({ search: "", isActive: undefined, page: 1, limit: 10 }),

      queryFn: () =>
        getCustomers({
          search: "",
          isActive: undefined,
          page: 1,
          limit: 10
        })
    }),

    // ========================================
    // Users
    // ========================================

    queryClient.prefetchQuery({
      queryKey: queryKeys.users.list({
        search: "",
        role: undefined,
        status: undefined
      }),

      queryFn: () =>
        getUsers({
          search: "",
          role: undefined,
          status: undefined
        })
    }),

    // ========================================
    // Audit Logs
    // ========================================

    queryClient.prefetchQuery({
      queryKey: queryKeys.auditLogs.list({ page: 1, limit: 10 }),

      queryFn: () =>
        getAuditLogs({ page: 1, limit: 10 })
    }),
  ])
}
