import api from './axios'

export const getSales = async (params) => {
  const response = await api.get('/sales', { params })
  return response.data
}

export const getSaleById = async (id) => {
  const response = await api.get(`/sales/${id}`)
  return response.data
}

export const getSaleFormOptions = async () => {
  const response = await api.get('/sales/form-options')
  return response.data
}

export const createSale = async (data) => {
  const response = await api.post('/sales', data)
  return response.data
}

export const updateSale = async (id, data) => {
  const response = await api.patch(`/sales/${id}`, data)
  return response.data
}

export const deleteSale = async (id) => {
  const response = await api.delete(`/sales/${id}`)
  return response.data
}

export default {
  getSales,
  getSaleById,
  getSaleFormOptions,
  createSale,
  updateSale,
  deleteSale,
}
