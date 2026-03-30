import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import orderService from '../../services/orderService.js'

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrders(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status, notes }, { rejectWithValue }) => {
    try {
      const response = await orderService.updateOrderStatus(id, { status, notes })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const assignDeliveryPartner = createAsyncThunk(
  'orders/assignDeliveryPartner',
  async ({ orderId, partnerId }, { rejectWithValue }) => {
    try {
      const response = await orderService.assignDeliveryPartner(orderId, partnerId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const processRefund = createAsyncThunk(
  'orders/processRefund',
  async ({ orderId, refundData }, { rejectWithValue }) => {
    try {
      const response = await orderService.processRefund(orderId, refundData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const generateInvoice = createAsyncThunk(
  'orders/generateInvoice',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderService.generateInvoice(orderId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const initialState = {
  orders: [],
  currentOrder: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: '',
    status: '',
    dateRange: null,
    paymentStatus: '',
    minAmount: null,
    maxAmount: null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  orderStats: {
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    refunded: 0,
  },
  loading: false,
  error: null,
  success: null,
}

const orderSlice = createSlice({
  name: 'orders',
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
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },
    updateOrderInList: (state, action) => {
      const index = state.orders.findIndex(o => o.id === action.payload.order.id)
      if (index !== -1) {
        state.orders[index] = action.payload.order
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.orders
        state.pagination = action.payload.pagination
        state.orderStats = action.payload.stats || state.orderStats
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch orders'
      })
      // Fetch Order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload.order
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch order'
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false
        orderSlice.caseReducers.updateOrderInList(state, action)
        if (state.currentOrder?.id === action.payload.order.id) {
          state.currentOrder = action.payload.order
        }
        state.success = 'Order status updated successfully'
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to update order status'
      })
      // Assign Delivery Partner
      .addCase(assignDeliveryPartner.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(assignDeliveryPartner.fulfilled, (state, action) => {
        state.loading = false
        orderSlice.caseReducers.updateOrderInList(state, action)
        if (state.currentOrder?.id === action.payload.order.id) {
          state.currentOrder = action.payload.order
        }
        state.success = 'Delivery partner assigned successfully'
      })
      .addCase(assignDeliveryPartner.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to assign delivery partner'
      })
      // Process Refund
      .addCase(processRefund.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(processRefund.fulfilled, (state, action) => {
        state.loading = false
        orderSlice.caseReducers.updateOrderInList(state, action)
        if (state.currentOrder?.id === action.payload.order.id) {
          state.currentOrder = action.payload.order
        }
        state.success = 'Refund processed successfully'
      })
      .addCase(processRefund.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to process refund'
      })
      // Generate Invoice
      .addCase(generateInvoice.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(generateInvoice.fulfilled, (state, action) => {
        state.loading = false
        state.success = 'Invoice generated successfully'
        // Open invoice in new tab
        if (action.payload.invoiceUrl) {
          window.open(action.payload.invoiceUrl, '_blank')
        }
      })
      .addCase(generateInvoice.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to generate invoice'
      })
  },
})

export const {
  clearError,
  clearSuccess,
  setFilters,
  resetFilters,
  setCurrentOrder,
  clearCurrentOrder,
  updateOrderInList,
} = orderSlice.actions

// Selectors
export const selectOrders = (state) => state.orders.orders
export const selectCurrentOrder = (state) => state.orders.currentOrder
export const selectOrderPagination = (state) => state.orders.pagination
export const selectOrderFilters = (state) => state.orders.filters
export const selectOrderStats = (state) => state.orders.orderStats
export const selectOrderLoading = (state) => state.orders.loading
export const selectOrderError = (state) => state.orders.error
export const selectOrderSuccess = (state) => state.orders.success

export default orderSlice.reducer
