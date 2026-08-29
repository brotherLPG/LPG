import api from './axios'

export const getUsers = async (params) => {
  const response = await api.get('/users', { params })
  return response.data
}

export const createUser = async (data) => {
  const response = await api.post('/Users', data)
  return response.data
}

export const deleteUser = async (id) => {
  const response = await api.delete(`/user/${id}`)
  return response.data
}

export const updateUser = async (id, data) => {
  const response = await api.patch(`/user/${id}`, data)
  return response.data
}

export const getUserById = async (id) => {
  const response = await api.get(`/user/${id}`)
  return response.data
}
