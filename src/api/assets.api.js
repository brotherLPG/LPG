import api from './axios'

const ASSET_META_KEYS = new Set([
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

const unwrapAssetRecord = (payload) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { asset: payload, form: {} }
  }

  const nested =
    payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)
      ? payload.data
      : payload

  const form = nested.form || payload.form || {}
  const rawDoc = nested._doc && typeof nested._doc === 'object' ? nested._doc : {}
  let doc = {}
  try {
    doc = JSON.parse(JSON.stringify(rawDoc))
  } catch {
    doc = { ...rawDoc }
  }
  const asset = { ...doc }

  Object.entries(nested).forEach(([key, value]) => {
    if (ASSET_META_KEYS.has(key) || value === undefined) return
    asset[key] = value
  })

  return { asset, form }
}

export const getAssets = async (params) => {
  const response = await api.get('/assets', { params })
  return response.data
}

export const getAssetById = async (id) => {
  const response = await api.get(`/assets/${id}`)
  const payload = response.data
  const { asset, form } = unwrapAssetRecord(payload)

  return {
    success: payload?.success ?? true,
    message: payload?.message,
    data: {
      ...asset,
      form,
    },
  }
}

export const createAsset = async (data) => {
  const response = await api.post('/assets', data)
  return response.data
}

export const updateAsset = async (id, data) => {
  const response = await api.patch(`/assets/${id}`, data)
  return response.data
}

export const deleteAsset = async (id) => {
  const response = await api.delete(`/assets/${id}`)
  return response.data
}

export const getAssetFormOptions = async () => {
  const response = await api.get('/assets/form-options')
  return response.data
}

export default {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetFormOptions,
}
