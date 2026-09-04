import api from './axios'

export const getAccounts = async (params) => {
  const response = await api.get('/accounts', { params })
  return response.data
}

export const getAccountById = async (id) => {
  const response = await api.get(`/accounts/${id}`)
  return response.data
}

export const createAccount = async (data) => {
  const response = await api.post('/accounts', data)
  return response.data
}

export const updateAccount = async (id, data) => {
  const response = await api.patch(`/accounts/${id}`, data)
  return response.data
}

export const deleteAccount = async (id) => {
  const response = await api.delete(`/accounts/${id}`)
  return response.data
}
