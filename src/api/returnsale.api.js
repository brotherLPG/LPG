import api from './axios'

export const getReturnSales = async (params) => {
  const response = await api.get('/sales-returns', { params })
  return response.data
}

export const getReturnSaleById = async (id) => {
  const response = await api.get(`/sales-returns/${id}`)
  return response.data
}

export const createReturnSale = async (data) => {
  const response = await api.post('/sales-returns', data)
  return response.data
}

export const updateReturnSale = async (id, data) => {
  const response = await api.patch(`/sales-returns/${id}`, data)
  return response.data
}

export const deleteReturnSale = async (id) => {
  const response = await api.delete(`/sales-returns/${id}`)
  return response.data
}

export const getReturnSaleFormOptions = async () => {
  const response = await api.get('/sales-returns/form-options')
  return response.data
}

export default {
  getReturnSales,
  getReturnSaleById,
  createReturnSale,
  updateReturnSale,
  deleteReturnSale,
  getReturnSaleFormOptions,
}
