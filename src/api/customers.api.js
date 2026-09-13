import api from './axios'

export const getCustomers = async (params) => {
  const response = await api.get('/customers', { params })
  return response.data
}

export const deleteCustomer = async (id) => {
  const response = await api.delete(`/customers/${id}`)
  return response.data
}

export const createCustomer = async (data) => {
  const response = await api.post('/customers', data)
  return response.data
}

export const updateCustomer = async (id, data) => {
  const response = await api.patch(`/customers/${id}`, data)
  return response.data
}

export const getCustomerById = async (id) => {
  const response = await api.get(`/customers/${id}`)
  return response.data
}

export const getCustomerLedger = async (id) => {
  const response = await api.get(`/customers/${id}/ledger`)
  return response.data
}

export const getCustomerSalesHistory = async (id, params) => {
  const response = await api.get(`/customers/${id}/sales-history`, { params })
  return response.data
}

export const getCustomerPaymentHistory = async (id, params) => {
  const response = await api.get(`/customers/${id}/payment-history`, { params })
  return response.data
}
