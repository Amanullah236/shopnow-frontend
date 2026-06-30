import axiosInstance from './axiosInstance'

export const productApi = {
  // Get all products
  getProducts: async (params = {}) => {
    const response = await axiosInstance.get('/products', { params })
    return response.data
  },

  // Get single product
  getProduct: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`)
    return response.data
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await axiosInstance.get('/products/featured')
    return response.data
  },

  // Search products
  searchProducts: async (query) => {
    const response = await axiosInstance.get('/products', {
      params: { search: query }
    })
    return response.data
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    const response = await axiosInstance.get('/products', {
      params: { category: categoryId }
    })
    return response.data
  },

  // Create product (Admin)
  createProduct: async (productData) => {
    const response = await axiosInstance.post('/products', productData)
    return response.data
  },

  // Update product (Admin)
  updateProduct: async (id, productData) => {
    const response = await axiosInstance.put(`/products/${id}`, productData)
    return response.data
  },

  // Delete product (Admin)
  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`/products/${id}`)
    return response.data
  },
}