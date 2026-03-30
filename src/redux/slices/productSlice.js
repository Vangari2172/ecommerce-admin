import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from '../../services/productService.js'

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(productData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await productService.updateProduct(id, productData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const uploadProductImages = createAsyncThunk(
  'products/uploadImages',
  async ({ productId, formData }, { rejectWithValue }) => {
    try {
      const response = await productService.uploadImages(productId, formData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const initialState = {
  products: [],
  currentProduct: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: '',
    category: '',
    status: '',
    priceRange: null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  loading: false,
  error: null,
  success: null,
}

const productSlice = createSlice({
  name: 'products',
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
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.pagination = action.payload.pagination
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch products'
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProduct = action.payload.product
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch product'
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products.unshift(action.payload.product)
        state.success = 'Product created successfully'
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to create product'
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false
        const index = state.products.findIndex(p => p.id === action.payload.product.id)
        if (index !== -1) {
          state.products[index] = action.payload.product
        }
        if (state.currentProduct?.id === action.payload.product.id) {
          state.currentProduct = action.payload.product
        }
        state.success = 'Product updated successfully'
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to update product'
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products = state.products.filter(p => p.id !== action.payload)
        state.success = 'Product deleted successfully'
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to delete product'
      })
      // Upload Images
      .addCase(uploadProductImages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(uploadProductImages.fulfilled, (state, action) => {
        state.loading = false
        if (state.currentProduct) {
          state.currentProduct.images = action.payload.images
        }
        state.success = 'Images uploaded successfully'
      })
      .addCase(uploadProductImages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to upload images'
      })
  },
})

export const {
  clearError,
  clearSuccess,
  setFilters,
  resetFilters,
  setCurrentProduct,
  clearCurrentProduct,
} = productSlice.actions

// Selectors
export const selectProducts = (state) => state.products.products
export const selectCurrentProduct = (state) => state.products.currentProduct
export const selectProductPagination = (state) => state.products.pagination
export const selectProductFilters = (state) => state.products.filters
export const selectProductLoading = (state) => state.products.loading
export const selectProductError = (state) => state.products.error
export const selectProductSuccess = (state) => state.products.success

export default productSlice.reducer
