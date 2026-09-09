import api from './axios'

export const getMaintenanceRecords = async (params) => {
  const response = await api.get('/maintenance-records', { params })
  return response.data
}

export const getMaintenanceRecordById = async (id) => {
  const response = await api.get(`/maintenance-records/${id}`)
  return response.data
}

export const createMaintenanceRecord = async (data) => {
  const response = await api.post('/maintenance-records', data)
  return response.data
}

export const updateMaintenanceRecord = async (id, data) => {
  const response = await api.patch(`/maintenance-records/${id}`, data)
  return response.data
}

export const deleteMaintenanceRecord = async (id) => {
  const response = await api.delete(`/maintenance-records/${id}`)
  return response.data
}

export default {
  getMaintenanceRecords,
  getMaintenanceRecordById,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
}
