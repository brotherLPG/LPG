import api from './axios'

export const getNotifications = async ({ page = 1, limit = 10 }) => {
  const response = await api.get('/notifications', {
    params: {
      page,
      limit
    }
  })

  return response.data
}

export const markNotificationAsRead = async id => {
  const response = await api.patch(`/notifications/${id}/read`)

  return response.data
}

export const markAllNotificationsAsRead = async () => {
  const response = await api.patch('/notifications/read-all')

  return response.data
}
