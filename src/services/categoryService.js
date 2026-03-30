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

const categoryService = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get('/categories')
    return response
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`)
    return response
  },

  // Create new category
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData)
    return response
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData)
    return response
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`)
    return response
  },

  // Reorder categories
  reorderCategories: async (categoryIds) => {
    const response = await api.put('/categories/reorder', { categoryIds })
    return response
  },

  // Upload category image
  uploadImage: async (categoryId, formData) => {
    const response = await api.post(`/categories/${categoryId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  },

  // Get category tree
  getCategoryTree: async () => {
    const response = await api.get('/categories/tree')
    return response
  },
}

export default categoryService
