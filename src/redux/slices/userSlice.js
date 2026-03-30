import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../../services/userService.js'

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await userService.getUsers(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUser(id, userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const blockUser = createAsyncThunk(
  'users/blockUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await userService.blockUser(id)
      return { id, ...response.data }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const unblockUser = createAsyncThunk(
  'users/unblockUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await userService.unblockUser(id)
      return { id, ...response.data }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const sendUserNotification = createAsyncThunk(
  'users/sendNotification',
  async ({ userId, notificationData }, { rejectWithValue }) => {
    try {
      const response = await userService.sendNotification(userId, notificationData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const initialState = {
  users: [],
  currentUser: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: '',
    status: '',
    role: '',
    registrationDate: null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  userStats: {
    total: 0,
    active: 0,
    blocked: 0,
    newThisMonth: 0,
  },
  loading: false,
  error: null,
  success: null,
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccess: (state) => {
      state.success = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    clearCurrentUser: (state) => {
      state.currentUser = null
    },
    updateUserInList: (state, action) => {
      const index = state.users.findIndex(u => u.id === action.payload.user.id)
      if (index !== -1) {
        state.users[index] = action.payload.user
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.users
        state.pagination = action.payload.pagination
        state.userStats = action.payload.stats || state.userStats
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch users'
      })
      // Fetch User by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload.user
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch user'
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        userSlice.caseReducers.updateUserInList(state, action)
        if (state.currentUser?.id === action.payload.user.id) {
          state.currentUser = action.payload.user
        }
        state.success = 'User updated successfully'
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to update user'
      })
      // Block User
      .addCase(blockUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.loading = false
        const index = state.users.findIndex(u => u.id === action.payload.id)
        if (index !== -1) {
          state.users[index].status = 'blocked'
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser.status = 'blocked'
        }
        state.success = 'User blocked successfully'
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to block user'
      })
      // Unblock User
      .addCase(unblockUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        state.loading = false
        const index = state.users.findIndex(u => u.id === action.payload.id)
        if (index !== -1) {
          state.users[index].status = 'active'
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser.status = 'active'
        }
        state.success = 'User unblocked successfully'
      })
      .addCase(unblockUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to unblock user'
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.filter(u => u.id !== action.payload)
        state.success = 'User deleted successfully'
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to delete user'
      })
      // Send Notification
      .addCase(sendUserNotification.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendUserNotification.fulfilled, (state) => {
        state.loading = false
        state.success = 'Notification sent successfully'
      })
      .addCase(sendUserNotification.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to send notification'
      })
  },
})

export const {
  clearError,
  clearSuccess,
  setFilters,
  resetFilters,
  setCurrentUser,
  clearCurrentUser,
  updateUserInList,
} = userSlice.actions

// Selectors
export const selectUsers = (state) => state.users.users
export const selectCurrentUser = (state) => state.users.currentUser
export const selectUserPagination = (state) => state.users.pagination
export const selectUserFilters = (state) => state.users.filters
export const selectUserStats = (state) => state.users.userStats
export const selectUserLoading = (state) => state.users.loading
export const selectUserError = (state) => state.users.error
export const selectUserSuccess = (state) => state.users.success

export default userSlice.reducer
