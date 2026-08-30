import api from './axios'

export const getCylinderTypes = async (params) => {
  const response = await api.get('/cylinder-types', { params })
  return response.data
}

export const deleteCylinderType = async (id) => {
  const response = await api.delete(`/cylinder-types/${id}`)
  return response.data
}

export const createCylinderType = async (data) => {
  const response = await api.post('/cylinder-types', data)
  return response.data
}

export const updateCylinderType = async (id, data) => {
  const response = await api.patch(`/cylinder-types/${id}`, data)
  return response.data
}

export const getCylinderTypeById = async (id) => {
  const response = await api.get(`/cylinder-types/${id}`)
  return response.data
}

export default {
  getCylinderTypes,
  deleteCylinderType,
  createCylinderType,
  updateCylinderType,
  getCylinderTypeById,
}
