import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice.js'
import productSlice from './slices/productSlice.js'
import categorySlice from './slices/categorySlice.js'
import orderSlice from './slices/orderSlice.js'
import userSlice from './slices/userSlice.js'
import dashboardSlice from './slices/dashboardSlice.js'
import settingsSlice from './slices/settingsSlice.js'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    categories: categorySlice,
    orders: orderSlice,
    users: userSlice,
    dashboard: dashboardSlice,
    settings: settingsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export default store
