import axiosInstance from './axiosInstance'

export const orderApi = {
  createOrder: async (orderData) => {
    const response = await axiosInstance.post('/orders', orderData)
    return response.data
  },

  getMyOrders: async () => {
    const response = await axiosInstance.get('/orders/my-orders')
    return response.data
  },

  getOrder: async (id) => {
    const response = await axiosInstance.get(`/orders/${id}`)
    return response.data
  },

  cancelOrder: async (id) => {
    const response = await axiosInstance.put(`/orders/${id}/cancel`)
    return response.data
  },

  getAllOrders: async (params = {}) => {
    const response = await axiosInstance.get('/orders', { params })
    return response.data
  },

  updateOrderStatus: async (id, data) => {
    const response = await axiosInstance.put(`/orders/${id}/status`, data)
    return response.data
  },

  updatePaymentStatus: async (id, data) => {
    const response = await axiosInstance.put(`/orders/${id}/payment`, data)
    return response.data
  },

  // ← NAYA: User apne orders clear kare
  clearOrders: async () => {
    const response = await axiosInstance.delete('/orders/clear')
    return response.data
  },

  // ← NAYA: Admin sab orders clear kare
  clearAllOrders: async () => {
    const response = await axiosInstance.delete('/orders/clear/all')
    return response.data
  },
}