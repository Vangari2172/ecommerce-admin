import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import dashboardService from '../../services/dashboardService.js'

// Async thunks
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getDashboardData(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchSalesAnalytics = createAsyncThunk(
  'dashboard/fetchSalesAnalytics',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getSalesAnalytics(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchTopProducts = createAsyncThunk(
  'dashboard/fetchTopProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getTopProducts(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchRecentOrders = createAsyncThunk(
  'dashboard/fetchRecentOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getRecentOrders(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchCustomerAnalytics = createAsyncThunk(
  'dashboard/fetchCustomerAnalytics',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getCustomerAnalytics(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const initialState = {
  // KPIs
  kpis: {
    totalRevenue: 0,
    totalOrders: 0,
    activeUsers: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  },
  kpiChanges: {
    revenueChange: 0,
    ordersChange: 0,
    usersChange: 0,
    conversionChange: 0,
  },
  
  // Analytics data
  salesAnalytics: {
    daily: [],
    weekly: [],
    monthly: [],
    yearly: [],
  },
  customerAnalytics: {
    newCustomers: [],
    returningCustomers: [],
    customerSegments: [],
  },
  
  // Top items
  topProducts: [],
  topCategories: [],
  
  // Recent activity
  recentOrders: [],
  recentActivity: [],
  
  // Loading and error states
  loading: false,
  error: null,
  
  // Date range for analytics
  dateRange: {
    start: null,
    end: null,
    preset: 'last30days', // today, yesterday, last7days, last30days, last90days, thisMonth, lastMonth, thisYear
  },
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setDateRange: (state, action) => {
      state.dateRange = { ...state.dateRange, ...action.payload }
    },
    resetDateRange: (state) => {
      state.dateRange = initialState.dateRange
    },
    updateKPI: (state, action) => {
      const { key, value } = action.payload
      if (state.kpis.hasOwnProperty(key)) {
        state.kpis[key] = value
      }
    },
    addRecentActivity: (state, action) => {
      state.recentActivity.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      })
      // Keep only last 50 activities
      if (state.recentActivity.length > 50) {
        state.recentActivity = state.recentActivity.slice(0, 50)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Data
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false
        state.kpis = action.payload.kpis || state.kpis
        state.kpiChanges = action.payload.kpiChanges || state.kpiChanges
        state.topProducts = action.payload.topProducts || []
        state.topCategories = action.payload.topCategories || []
        state.recentOrders = action.payload.recentOrders || []
        state.recentActivity = action.payload.recentActivity || []
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch dashboard data'
      })
      // Fetch Sales Analytics
      .addCase(fetchSalesAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSalesAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.salesAnalytics = {
          ...state.salesAnalytics,
          ...action.payload,
        }
      })
      .addCase(fetchSalesAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch sales analytics'
      })
      // Fetch Top Products
      .addCase(fetchTopProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.loading = false
        state.topProducts = action.payload.products || []
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch top products'
      })
      // Fetch Recent Orders
      .addCase(fetchRecentOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.loading = false
        state.recentOrders = action.payload.orders || []
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch recent orders'
      })
      // Fetch Customer Analytics
      .addCase(fetchCustomerAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCustomerAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.customerAnalytics = {
          ...state.customerAnalytics,
          ...action.payload,
        }
      })
      .addCase(fetchCustomerAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch customer analytics'
      })
  },
})

export const {
  clearError,
  setDateRange,
  resetDateRange,
  updateKPI,
  addRecentActivity,
} = dashboardSlice.actions

// Selectors
export const selectKPIs = (state) => state.dashboard.kpis
export const selectKPIChanges = (state) => state.dashboard.kpiChanges
export const selectSalesAnalytics = (state) => state.dashboard.salesAnalytics
export const selectCustomerAnalytics = (state) => state.dashboard.customerAnalytics
export const selectTopProducts = (state) => state.dashboard.topProducts
export const selectTopCategories = (state) => state.dashboard.topCategories
export const selectRecentOrders = (state) => state.dashboard.recentOrders
export const selectRecentActivity = (state) => state.dashboard.recentActivity
export const selectDashboardLoading = (state) => state.dashboard.loading
export const selectDashboardError = (state) => state.dashboard.error
export const selectDateRange = (state) => state.dashboard.dateRange

// Memoized selectors for performance
export const selectTotalRevenue = (state) => state.dashboard.kpis.totalRevenue
export const selectTotalOrders = (state) => state.dashboard.kpis.totalOrders
export const selectActiveUsers = (state) => state.dashboard.kpis.activeUsers
export const selectConversionRate = (state) => state.dashboard.kpis.conversionRate

export default dashboardSlice.reducer
