import api from './axios'

export const getSuppliers = async (params) => {
  const response = await api.get('/suppliers', { params })
  return response.data
}

export const deleteSupplier = async (id) => {
  const response = await api.delete(`/suppliers/${id}`)
  return response.data
}

export const createSupplier = async (data) => {
  const response = await api.post('/suppliers', data)
  return response.data
}

export const updateSupplier = async (id, data) => {
  const response = await api.patch(`/suppliers/${id}`, data)
  return response.data
}

export const getSupplierById = async (id) => {
  const response = await api.get(`/suppliers/${id}`)
  return response.data
}

export const getSupplierLedger = async (id) => {
  const response = await api.get(`/suppliers/${id}/ledger`)
  return response.data
}

export const getSupplierPurchaseHistory = async (id, params) => {
  const response = await api.get(`/suppliers/${id}/purchase-history`, { params })
  return response.data
}

export const getSupplierPaymentHistory = async (id, params) => {
  const response = await api.get(`/suppliers/${id}/payment-history`, { params })
  return response.data
}

export default {
  getSuppliers,
  deleteSupplier,
  createSupplier,
  updateSupplier,
  getSupplierById,
  getSupplierLedger,
  getSupplierPurchaseHistory,
  getSupplierPaymentHistory,
}
