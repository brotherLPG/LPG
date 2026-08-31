import api from './axios'

export const getFillingBatches = async (params) => {
  const response = await api.get('/filling-batches', { params })
  return response.data
}

export const deleteFillingBatch = async (id) => {
  const response = await api.delete(`/filling-batches/${id}`)
  return response.data
}

export const createFillingBatch = async (data) => {
  const response = await api.post('/filling-batches', data)
  return response.data
}

export const updateFillingBatch = async (id, data) => {
  const response = await api.patch(`/filling-batches/${id}`, data)
  return response.data
}

export const getFillingBatchById = async (id) => {
  const response = await api.get(`/filling-batches/${id}`)
  return response.data
}

export default {
  getFillingBatches,
  deleteFillingBatch,
  createFillingBatch,
  updateFillingBatch,
  getFillingBatchById,
}
