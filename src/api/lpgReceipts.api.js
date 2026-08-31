import api from './axios'

export const getLpgReceipts = async (params) => {
  const response = await api.get('/lpg-receipts', { params })
  return response.data
}

export const deleteLpgReceipt = async (id) => {
  const response = await api.delete(`/lpg-receipts/${id}`)
  return response.data
}

export const createLpgReceipt = async (data) => {
  const response = await api.post('/lpg-receipts', data)
  return response.data
}

export const updateLpgReceipt = async (id, data) => {
  const response = await api.patch(`/lpg-receipts/${id}`, data)
  return response.data
}

export const getLpgReceiptById = async (id) => {
  const response = await api.get(`/lpg-receipts/${id}`)
  return response.data
}

export default {
  getLpgReceipts,
  deleteLpgReceipt,
  createLpgReceipt,
  updateLpgReceipt,
  getLpgReceiptById,
}
