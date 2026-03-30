import axios from 'axios'
import mockApi from './mockApi.js'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/admin'

// Use mock API for development
const useMockApi = true

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

const dashboardService = {
  // Get dashboard data
  getDashboardData: async (params = {}) => {
    if (useMockApi) {
      return mockApi.getDashboardData(params)
    }
    const response = await api.get('/dashboard', { params })
    return response
  },

  // Get sales analytics
  getSalesAnalytics: async (params = {}) => {
    if (useMockApi) {
      return mockApi.getSalesAnalytics(params)
    }
    const response = await api.get('/dashboard/sales', { params })
    return response
  },

  // Get top products
  getTopProducts: async (params = {}) => {
    if (useMockApi) {
      return mockApi.getTopProducts(params)
    }
    const response = await api.get('/dashboard/top-products', { params })
    return response
  },

  // Get recent orders
  getRecentOrders: async (params = {}) => {
    if (useMockApi) {
      return mockApi.getRecentOrders(params)
    }
    const response = await api.get('/dashboard/recent-orders', { params })
    return response
  },

  // Get customer analytics
  getCustomerAnalytics: async (params = {}) => {
    if (useMockApi) {
      return mockApi.getCustomerAnalytics(params)
    }
    const response = await api.get('/dashboard/customers', { params })
    return response
  },

  // Get order analytics
  getOrderAnalytics: async (params = {}) => {
    const response = await api.get('/dashboard/orders', { params })
    return response
  },

  // Get product analytics
  getProductAnalytics: async (params = {}) => {
    const response = await api.get('/dashboard/products', { params })
    return response
  },

  // Get revenue analytics
  getRevenueAnalytics: async (params = {}) => {
    const response = await api.get('/dashboard/revenue', { params })
    return response
  },

  // Get conversion analytics
  getConversionAnalytics: async (params = {}) => {
    const response = await api.get('/dashboard/conversions', { params })
    return response
  },

  // Get inventory alerts
  getInventoryAlerts: async () => {
    const response = await api.get('/dashboard/inventory-alerts')
    return response
  },

  // Get system health
  getSystemHealth: async () => {
    const response = await api.get('/dashboard/system-health')
    return response
  },

  // Export dashboard data
  exportDashboardData: async (params = {}) => {
    const response = await api.get('/dashboard/export', { 
      params,
      responseType: 'blob'
    })
    return response
  },
}

export default dashboardService
