import api from './axios'

export const getOperationsOverview = async (params = {}) => {
  const response = await api.get('/dashboard/operations', { params })
  return response.data
}

export const getInventoryAlerts = async (params = {}) => {
  const response = await api.get('/dashboard/inventory-alerts', { params })
  return response.data
}

export default {
  getOperationsOverview,
  getInventoryAlerts,
}
