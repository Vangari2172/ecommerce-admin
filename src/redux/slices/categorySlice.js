import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import categoryService from '../../services/categoryService.js'

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategories()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await categoryService.createCategory(categoryData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await categoryService.updateCategory(id, categoryData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const reorderCategories = createAsyncThunk(
  'categories/reorderCategories',
  async (categoryIds, { rejectWithValue }) => {
    try {
      const response = await categoryService.reorderCategories(categoryIds)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const initialState = {
  categories: [],
  loading: false,
  error: null,
  success: null,
}

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccess: (state) => {
      state.success = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload.categories
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch categories'
      })
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false
        state.categories.push(action.payload.category)
        state.success = 'Category created successfully'
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to create category'
      })
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false
        const index = state.categories.findIndex(c => c.id === action.payload.category.id)
        if (index !== -1) {
          state.categories[index] = action.payload.category
        }
        state.success = 'Category updated successfully'
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to update category'
      })
      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false
        state.categories = state.categories.filter(c => c.id !== action.payload)
        state.success = 'Category deleted successfully'
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to delete category'
      })
      // Reorder Categories
      .addCase(reorderCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(reorderCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload.categories
        state.success = 'Categories reordered successfully'
      })
      .addCase(reorderCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to reorder categories'
      })
  },
})

export const { clearError, clearSuccess } = categorySlice.actions

// Selectors
export const selectCategories = (state) => state.categories.categories
export const selectCategoryLoading = (state) => state.categories.loading
export const selectCategoryError = (state) => state.categories.error
export const selectCategorySuccess = (state) => state.categories.success

export default categorySlice.reducer
