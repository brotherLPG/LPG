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

export const getAccountFormOptions = async () => {
  const response = await api.get('/accounts/form-options')
  return response.data
}

export const getAccountTransactions = async (id, params) => {
  const response = await api.get(`/accounts/${id}/transactions`, { params })
  return response.data
}

export const getAccountLedger = async (id) => {
  const response = await api.get(`/accounts/${id}/ledger`)
  return response.data
}
