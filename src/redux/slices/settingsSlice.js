import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import settingsService from '../../services/settingsService.js'

// Async thunks
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (category = null, { rejectWithValue }) => {
    try {
      const response = await settingsService.getSettings(category)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async ({ category, settings }, { rejectWithValue }) => {
    try {
      const response = await settingsService.updateSettings(category, settings)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const uploadLogo = createAsyncThunk(
  'settings/uploadLogo',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await settingsService.uploadLogo(formData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const testEmailSettings = createAsyncThunk(
  'settings/testEmailSettings',
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await settingsService.testEmailSettings(emailData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchTaxSettings = createAsyncThunk(
  'settings/fetchTaxSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await settingsService.getTaxSettings()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateTaxSettings = createAsyncThunk(
  'settings/updateTaxSettings',
  async (taxData, { rejectWithValue }) => {
    try {
      const response = await settingsService.updateTaxSettings(taxData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchPaymentSettings = createAsyncThunk(
  'settings/fetchPaymentSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await settingsService.getPaymentSettings()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updatePaymentSettings = createAsyncThunk(
  'settings/updatePaymentSettings',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await settingsService.updatePaymentSettings(paymentData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const initialState = {
  // General settings
  general: {
    siteName: 'Seafood Store',
    siteDescription: 'Fresh seafood delivered to your doorstep',
    contactEmail: 'info@seafoodstore.com',
    contactPhone: '+1 234 567 8900',
    address: {
      street: '123 Ocean Drive',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA',
    },
    logo: null,
    favicon: null,
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    },
  },
  
  // Email settings
  email: {
    provider: 'smtp', // smtp, sendgrid, ses
    smtp: {
      host: '',
      port: 587,
      username: '',
      password: '',
      encryption: 'tls', // none, ssl, tls
    },
    sendgrid: {
      apiKey: '',
      fromEmail: '',
      fromName: '',
    },
    templates: {
      orderConfirmation: true,
      shippingUpdate: true,
      passwordReset: true,
      newsletter: true,
    },
  },
  
  // Tax settings
  tax: {
    enabled: true,
    inclusive: false,
    defaultRate: 8.5,
    taxRates: [
      {
        id: 1,
        name: 'Standard Tax',
        rate: 8.5,
        state: '',
        country: 'USA',
        applicable: true,
      },
    ],
  },
  
  // Payment settings
  payment: {
    providers: {
      stripe: {
        enabled: true,
        publicKey: '',
        secretKey: '',
        webhookSecret: '',
      },
      paypal: {
        enabled: false,
        clientId: '',
        clientSecret: '',
        sandbox: true,
      },
      razorpay: {
        enabled: false,
        keyId: '',
        keySecret: '',
      },
    },
    currency: 'USD',
    autoCapture: true,
  },
  
  // Delivery settings
  delivery: {
    freeShippingThreshold: 75,
    standardShipping: 9.99,
    expressShipping: 19.99,
    deliveryZones: [
      {
        id: 1,
        name: 'Local',
        postalCodes: ['33101', '33102', '33103'],
        shippingCost: 5.99,
        estimatedDays: 1,
      },
    ],
  },
  
  // System settings
  system: {
    maintenanceMode: false,
    maintenanceMessage: 'We are currently under maintenance. Please check back soon.',
    enableRegistration: true,
    enableGuestCheckout: true,
    lowStockThreshold: 10,
    enableNotifications: true,
  },
  
  // Loading and error states
  loading: false,
  error: null,
  success: null,
  lastUpdated: null,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccess: (state) => {
      state.success = null
    },
    updateLocalSettings: (state, action) => {
      const { category, data } = action.payload
      if (state.hasOwnProperty(category)) {
        state[category] = { ...state[category], ...data }
      }
    },
    resetSettings: (state, action) => {
      const category = action.payload
      if (category && state.hasOwnProperty(category)) {
        state[category] = initialState[category]
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Settings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false
        const { category, settings } = action.payload
        if (category && state.hasOwnProperty(category)) {
          state[category] = { ...state[category], ...settings }
        } else {
          // Update all provided settings
          Object.keys(settings).forEach(key => {
            if (state.hasOwnProperty(key)) {
              state[key] = { ...state[key], ...settings[key] }
            }
          })
        }
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch settings'
      })
      // Update Settings
      .addCase(updateSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false
        const { category, settings } = action.payload
        if (state.hasOwnProperty(category)) {
          state[category] = { ...state[category], ...settings }
        }
        state.success = 'Settings updated successfully'
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to update settings'
      })
      // Upload Logo
      .addCase(uploadLogo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(uploadLogo.fulfilled, (state, action) => {
        state.loading = false
        state.general.logo = action.payload.logo
        state.success = 'Logo uploaded successfully'
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(uploadLogo.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to upload logo'
      })
      // Test Email Settings
      .addCase(testEmailSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(testEmailSettings.fulfilled, (state) => {
        state.loading = false
        state.success = 'Test email sent successfully'
      })
      .addCase(testEmailSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to send test email'
      })
      // Fetch Tax Settings
      .addCase(fetchTaxSettings.fulfilled, (state, action) => {
        state.tax = { ...state.tax, ...action.payload }
      })
      // Update Tax Settings
      .addCase(updateTaxSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTaxSettings.fulfilled, (state, action) => {
        state.loading = false
        state.tax = { ...state.tax, ...action.payload }
        state.success = 'Tax settings updated successfully'
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(updateTaxSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to update tax settings'
      })
      // Fetch Payment Settings
      .addCase(fetchPaymentSettings.fulfilled, (state, action) => {
        state.payment = { ...state.payment, ...action.payload }
      })
      // Update Payment Settings
      .addCase(updatePaymentSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePaymentSettings.fulfilled, (state, action) => {
        state.loading = false
        state.payment = { ...state.payment, ...action.payload }
        state.success = 'Payment settings updated successfully'
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(updatePaymentSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to update payment settings'
      })
  },
})

export const {
  clearError,
  clearSuccess,
  updateLocalSettings,
  resetSettings,
} = settingsSlice.actions

// Selectors
export const selectGeneralSettings = (state) => state.settings.general
export const selectEmailSettings = (state) => state.settings.email
export const selectTaxSettings = (state) => state.settings.tax
export const selectPaymentSettings = (state) => state.settings.payment
export const selectDeliverySettings = (state) => state.settings.delivery
export const selectSystemSettings = (state) => state.settings.system
export const selectSettingsLoading = (state) => state.settings.loading
export const selectSettingsError = (state) => state.settings.error
export const selectSettingsSuccess = (state) => state.settings.success
export const selectLastUpdated = (state) => state.settings.lastUpdated

// Specific selectors
export const selectSiteName = (state) => state.settings.general.siteName
export const selectLogo = (state) => state.settings.general.logo
export const selectCurrency = (state) => state.settings.payment.currency
export const selectMaintenanceMode = (state) => state.settings.system.maintenanceMode

export default settingsSlice.reducer
