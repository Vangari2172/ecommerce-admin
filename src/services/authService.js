import axios from 'axios'
import mockApi from './mockApi.js'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/admin'

// Use mock API for development
const useMockApi = true

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('adminRefreshToken')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })

          const { token, refreshToken: newRefreshToken } = response.data
          localStorage.setItem('adminToken', token)
          if (newRefreshToken) {
            localStorage.setItem('adminRefreshToken', newRefreshToken)
          }

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminRefreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

const authService = {
  // Login
  login: async (credentials) => {
    if (useMockApi) {
      return mockApi.login(credentials)
    }
    const response = await api.post('/auth/login', credentials)
    return response
  },

  // Logout
  logout: async () => {
    if (useMockApi) {
      return mockApi.logout()
    }
    const response = await api.post('/auth/logout')
    return response
  },

  // Refresh token
  refreshToken: async () => {
    if (useMockApi) {
      return mockApi.refreshToken()
    }
    const refreshToken = localStorage.getItem('adminRefreshToken')
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    })
    return response
  },

  // Get current user
  getCurrentUser: async () => {
    if (useMockApi) {
      return mockApi.getCurrentUser()
    }
    const response = await api.get('/auth/me')
    return response
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData)
    return response
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/password', passwordData)
    return response
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword,
    })
    return response
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token })
    return response
  },

  // Enable 2FA
  enable2FA: async () => {
    const response = await api.post('/auth/2fa/enable')
    return response
  },

  // Disable 2FA
  disable2FA: async (code) => {
    const response = await api.post('/auth/2fa/disable', { code })
    return response
  },

  // Verify 2FA
  verify2FA: async (code) => {
    const response = await api.post('/auth/2fa/verify', { code })
    return response
  },

  // Get backup codes
  getBackupCodes: async () => {
    const response = await api.get('/auth/2fa/backup-codes')
    return response
  },

  // Login activity
  getLoginActivity: async () => {
    const response = await api.get('/auth/login-activity')
    return response
  },

  // Revoke session
  revokeSession: async (sessionId) => {
    const response = await api.delete(`/auth/sessions/${sessionId}`)
    return response
  },

  // Revoke all sessions
  revokeAllSessions: async () => {
    const response = await api.delete('/auth/sessions')
    return response
  },
}

export default authService
