import api from './axios'

const RECORD_META_KEYS = new Set([
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

const unwrapMaintenanceRecord = (payload) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { record: payload, form: {} }
  }

  const nested =
    payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)
      ? payload.data
      : payload

  const form = nested.form || payload.form || {}
  const rawDoc = nested._doc && typeof nested._doc === 'object' ? nested._doc : {}
  const doc = (() => {
    try {
      return JSON.parse(JSON.stringify(rawDoc))
    } catch {
      return { ...rawDoc }
    }
  })()
  const record = { ...doc }

  Object.entries(nested).forEach(([key, value]) => {
    if (RECORD_META_KEYS.has(key) || value === undefined) return
    record[key] = value
  })

  if (record._id && typeof record._id === 'object') {
    record._id = record._id._id || record._id.toString?.() || String(record._id)
  }

  return { record, form }
}

export const getMaintenanceRecords = async (params) => {
  const response = await api.get('/maintenance-records', { params })
  return response.data
}

export const getMaintenanceRecordById = async (id) => {
  const response = await api.get(`/maintenance-records/${id}`)
  const payload = response.data
  const { record, form } = unwrapMaintenanceRecord(payload)

  return {
    success: payload?.success ?? true,
    message: payload?.message,
    data: {
      ...record,
      form,
    },
  }
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

export const getMaintenanceRecordFormOptions = async () => {
  const response = await api.get('/maintenance-records/form-options')
  return response.data
}

export default {
  getMaintenanceRecords,
  getMaintenanceRecordById,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
  getMaintenanceRecordFormOptions,
}
