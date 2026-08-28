import { queryKeys } from './queryKeys'

import { getNotifications } from '../api/notificationApi.js'

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
  ])
}
