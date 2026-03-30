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

const orderService = {
  // Get all orders
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params })
    return response
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`)
    return response
  },

  // Update order status
  updateOrderStatus: async (id, statusData) => {
    const response = await api.put(`/orders/${id}/status`, statusData)
    return response
  },

  // Assign delivery partner
  assignDeliveryPartner: async (orderId, partnerId) => {
    const response = await api.put(`/orders/${orderId}/delivery-partner`, {
      partnerId,
    })
    return response
  },

  // Process refund
  processRefund: async (orderId, refundData) => {
    const response = await api.post(`/orders/${orderId}/refund`, refundData)
    return response
  },

  // Generate invoice
  generateInvoice: async (orderId) => {
    const response = await api.post(`/orders/${orderId}/invoice`)
    return response
  },

  // Get order analytics
  getOrderAnalytics: async (params = {}) => {
    const response = await api.get('/orders/analytics', { params })
    return response
  },

  // Bulk update orders
  bulkUpdate: async (orderIds, updateData) => {
    const response = await api.put('/orders/bulk', {
      orderIds,
      updateData,
    })
    return response
  },

  // Export orders
  exportOrders: async (params = {}) => {
    const response = await api.get('/orders/export', {
      params,
      responseType: 'blob',
    })
    return response
  },

  // Get order tracking
  getOrderTracking: async (orderId) => {
    const response = await api.get(`/orders/${orderId}/tracking`)
    return response
  },
}

export default orderService
