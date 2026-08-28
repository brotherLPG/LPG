import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../../api/notificationApi.js'
import { queryKeys } from '../queryKeys.js'


// ========================================
// GET NOTIFICATIONS
// ========================================

export const useNotifications = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.notifications.list(page, limit),

    queryFn: () =>
      getNotifications({
        page,
        limit
      }),

    placeholderData: previousData => previousData
  })
}

// ========================================
// MARK ONE NOTIFICATION AS READ
// ========================================

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markNotificationAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all
      })
    }
  })
}

// ========================================
// MARK ALL NOTIFICATIONS AS READ
// ========================================

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAllNotificationsAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all
      })
    }
  })
}
