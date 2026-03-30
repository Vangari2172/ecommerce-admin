import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../../services/authService.js'

// Async thunks
export const loginAdmin = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const logoutAdmin = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
      return {}
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const refreshAdminToken = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const initialState = {
  user: null,
  token: localStorage.getItem('adminToken'),
  refreshToken: localStorage.getItem('adminRefreshToken'),
  isAuthenticated: !!localStorage.getItem('adminToken'),
  loading: false,
  error: null,
  permissions: ['admin'], // Default permissions for demo
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (state, action) => {
      const { user, token, refreshToken, permissions } = action.payload
      state.user = user
      state.token = token
      state.refreshToken = refreshToken
      state.permissions = permissions || []
      state.isAuthenticated = true
      state.error = null
      
      if (token) localStorage.setItem('adminToken', token)
      if (refreshToken) localStorage.setItem('adminRefreshToken', refreshToken)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.permissions = []
      state.error = null
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminRefreshToken')
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false
        authSlice.caseReducers.setCredentials(state, action)
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Login failed'
      })
      // Logout
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        authSlice.caseReducers.logout(state)
        state.loading = false
      })
      .addCase(logoutAdmin.rejected, (state) => {
        authSlice.caseReducers.logout(state)
        state.loading = false
      })
      // Refresh Token
      .addCase(refreshAdminToken.fulfilled, (state, action) => {
        const { token, refreshToken } = action.payload
        state.token = token
        state.refreshToken = refreshToken
        if (token) localStorage.setItem('adminToken', token)
        if (refreshToken) localStorage.setItem('adminRefreshToken', refreshToken)
      })
      .addCase(refreshAdminToken.rejected, (state) => {
        authSlice.caseReducers.logout(state)
      })
  },
})

export const { clearError, setCredentials, logout } = authSlice.actions

// Selectors
export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error
export const selectPermissions = (state) => state.auth.permissions

// Permission checker
export const hasPermission = (permission) => (state) => {
  return state.auth.permissions.includes(permission) || state.auth.permissions.includes('admin')
}

export default authSlice.reducer
