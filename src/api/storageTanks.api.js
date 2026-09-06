import api from './axios'

export const getStorageTankDashboard = async () => {
  const response = await api.get('/storage-tanks/dashboard')
  return response.data
}
