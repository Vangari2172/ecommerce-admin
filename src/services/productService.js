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

const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params })
    return response
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response
  },

  // Create new product
  createProduct: async (productData) => {
    const response = await api.post('/products', productData)
    return response
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData)
    return response
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response
  },

  // Upload product images
  uploadImages: async (productId, formData) => {
    const response = await api.post(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  },

  // Update product status
  updateStatus: async (id, status) => {
    const response = await api.patch(`/products/${id}/status`, { status })
    return response
  },

  // Bulk update products
  bulkUpdate: async (productIds, updateData) => {
    const response = await api.put('/products/bulk', {
      productIds,
      updateData,
    })
    return response
  },

  // Get product categories
  getCategories: async () => {
    const response = await api.get('/products/categories')
    return response
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    const response = await api.get('/products/search', {
      params: { q: query, ...params },
    })
    return response
  },
}

export default productService
