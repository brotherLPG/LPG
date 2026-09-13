import api from './axios'

const SUPPLIER_META_KEYS = new Set([
  '$__',
  '$isNew',
  '$locals',
  '$op',
  'errors',
  'isNew',
  '_doc',
  'form',
  'message',
  'success',
])

const unwrapSupplierRecord = (payload) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return payload
  }

  const nested = payload.data
  if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
    if (nested._doc || nested.supplierName || nested.supplierCode || nested._id) {
      return nested._doc ? { ...nested._doc } : { ...nested }
    }
  }

  if (payload._doc) {
    return { ...payload._doc }
  }

  if (payload.supplierName || payload.supplierCode || payload._id) {
    return Object.fromEntries(
      Object.entries(payload).filter(([key]) => !SUPPLIER_META_KEYS.has(key))
    )
  }

  return payload
}

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
  const payload = response.data

  return {
    success: payload?.success ?? true,
    message: payload?.message,
    form: payload?.form,
    data: unwrapSupplierRecord(payload),
  }
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
