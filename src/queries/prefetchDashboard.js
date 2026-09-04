import { queryKeys } from './queryKeys'

import { getNotifications } from '../api/notificationApi.js'
import { getCustomers } from '../api/customers.api.js'
import { getSuppliers } from '../api/suppliers.api.js'
import { getCylinderTypes } from '../api/cylinderTypes.api.js'
import { getLpgReceipts } from '../api/lpgReceipts.api.js'
import { getUsers } from '../api/users.api.js'
import { getAuditLogs } from '../api/auditLogs.api.js'
import { getRoles } from '../api/roles.api.js'
import { getFillingBatches } from '../api/fillingBatches.api.js'
import { getEmployees } from '../api/employees.api.js'
import { getPermissions } from '../api/permissions.api.js'
import { getCurrentUser } from '../api/auth.api.js'
import { getAccounts } from '../api/accounts.api.js'

export const prefetchDashboard = async queryClient => {
  await Promise.all([
    // ========================================
    // Current User
    // ========================================

    queryClient.prefetchQuery({
      queryKey: queryKeys.auth.currentUser(),
      queryFn: getCurrentUser
    }),

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
    // Suppliers
    // ========================================

    queryClient.prefetchQuery({
      queryKey: queryKeys.suppliers.list({ search: "", isActive: undefined, page: 1, limit: 10 }),

      queryFn: () =>
        getSuppliers({
          search: "",
          isActive: undefined,
          page: 1,
          limit: 10,
        })
    }),

    // ========================================
    // Cylinder Types
    // ========================================

    queryClient.prefetchQuery({
      queryKey: queryKeys.cylinderTypes.list({ search: "", isActive: undefined, page: 1, limit: 10 }),

      queryFn: () =>
        getCylinderTypes({
          search: "",
          isActive: undefined,
          page: 1,
          limit: 10,
        })
    }),

    // ========================================
    // LPG Receipts
    // ========================================

    queryClient.prefetchQuery({
      queryKey: queryKeys.lpgReceipts.list({ search: "", page: 1, limit: 10 }),

      queryFn: () =>
        getLpgReceipts({
          search: "",
          page: 1,
          limit: 10,
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

    // ========================================
    // Roles
    // ========================================

    queryClient.prefetchQuery({
      queryKey: queryKeys.roles.list(),

      queryFn: () =>
        getRoles({ search: "", page: 1, limit: 10 })
    }),

    // ========================================
    // Filling Batches
    // ========================================

    queryClient.prefetchQuery({
      queryKey: queryKeys.fillingBatches.list({ search: "", page: 1, limit: 10 }),

      queryFn: () =>
        getFillingBatches({
          search: "",
          page: 1,
          limit: 10,
        })
    }),

    // ========================================
    // Employees
    // ========================================

    queryClient.prefetchQuery({
      queryKey: queryKeys.employees.list({ search: undefined, employmentStatus: undefined, page: 1, limit: 10 }),

      queryFn: () =>
        getEmployees({
          search: undefined,
          employmentStatus: undefined,
          page: 1,
          limit: 10,
        })
    }),

    // ========================================
    // Permissions
    // ========================================

    queryClient.prefetchQuery({
      queryKey: queryKeys.permissions.list(),

      queryFn: () =>
        getPermissions()
    }),

    // ========================================
    // Accounts
    // ========================================

    queryClient.prefetchQuery({
      queryKey: queryKeys.accounts.list({ page: 1, limit: 10 }),

      queryFn: () =>
        getAccounts({ page: 1, limit: 10 })
    }),
  ])
}
