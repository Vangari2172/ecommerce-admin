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

const userService = {
  // Get all users
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params })
    return response
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData)
    return response
  },

  // Block user
  blockUser: async (id) => {
    const response = await api.put(`/users/${id}/block`)
    return response
  },

  // Unblock user
  unblockUser: async (id) => {
    const response = await api.put(`/users/${id}/unblock`)
    return response
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response
  },

  // Send notification to user
  sendNotification: async (userId, notificationData) => {
    const response = await api.post(`/users/${userId}/notifications`, notificationData)
    return response
  },

  // Get user analytics
  getUserAnalytics: async (params = {}) => {
    const response = await api.get('/users/analytics', { params })
    return response
  },

  // Export users
  exportUsers: async (params = {}) => {
    const response = await api.get('/users/export', {
      params,
      responseType: 'blob',
    })
    return response
  },

  // Search users
  searchUsers: async (query, params = {}) => {
    const response = await api.get('/users/search', {
      params: { q: query, ...params },
    })
    return response
  },

  // Get user orders
  getUserOrders: async (userId, params = {}) => {
    const response = await api.get(`/users/${userId}/orders`, { params })
    return response
  },
}

export default userService
