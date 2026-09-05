import api from './axios'

export const getInventoryItems = async (params) => {
  const response = await api.get('/inventory-items', { params })
  return response.data
}

export const deleteInventoryItem = async (id) => {
  const response = await api.delete(`/inventory-items/${id}`)
  return response.data
}

export const createInventoryItem = async (data) => {
  const response = await api.post('/inventory-items', data)
  return response.data
}

export const updateInventoryItem = async (id, data) => {
  const response = await api.patch(`/inventory-items/${id}`, data)
  return response.data
}

export const getInventoryItemById = async (id) => {
  const response = await api.get(`/inventory-items/${id}`)
  return response.data
}

export const getInventoryFormOptions = async () => {
  const response = await api.get('/inventory-items/form-options')
  return response.data
}

export default {
  getInventoryItems,
  deleteInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  getInventoryItemById,
  getInventoryFormOptions,
}
