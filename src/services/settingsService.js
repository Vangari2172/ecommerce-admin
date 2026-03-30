import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/admin'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const settingsService = {
  // Get settings
  getSettings: async (category = null) => {
    const url = category ? `/settings/${category}` : '/settings'
    const response = await api.get(url)
    return response
  },

  // Update settings
  updateSettings: async (category, settings) => {
    const response = await api.put(`/settings/${category}`, settings)
    return response
  },

  // Upload logo
  uploadLogo: async (formData) => {
    const response = await api.post('/settings/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  },

  // Test email settings
  testEmailSettings: async (emailData) => {
    const response = await api.post('/settings/test-email', emailData)
    return response
  },

  // Get tax settings
  getTaxSettings: async () => {
    const response = await api.get('/settings/tax')
    return response
  },

  // Update tax settings
  updateTaxSettings: async (taxData) => {
    const response = await api.put('/settings/tax', taxData)
    return response
  },

  // Get payment settings
  getPaymentSettings: async () => {
    const response = await api.get('/settings/payment')
    return response
  },

  // Update payment settings
  updatePaymentSettings: async (paymentData) => {
    const response = await api.put('/settings/payment', paymentData)
    return response
  },

  // Get delivery settings
  getDeliverySettings: async () => {
    const response = await api.get('/settings/delivery')
    return response
  },

  // Update delivery settings
  updateDeliverySettings: async (deliveryData) => {
    const response = await api.put('/settings/delivery', deliveryData)
    return response
  },

  // Reset settings to defaults
  resetSettings: async (category) => {
    const response = await api.post(`/settings/${category}/reset`)
    return response
  },

  // Export settings
  exportSettings: async () => {
    const response = await api.get('/settings/export', {
      responseType: 'blob',
    })
    return response
  },

  // Import settings
  importSettings: async (formData) => {
    const response = await api.post('/settings/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  },
}

export default settingsService
