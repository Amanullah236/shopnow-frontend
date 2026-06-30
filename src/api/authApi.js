import axiosInstance from './axiosInstance'

export const authApi = {
  // Register
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData)
    return response.data
  },

  // Login
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password })
    return response.data
  },

  // Get current user
  getMe: async () => {
    const response = await axiosInstance.get('/auth/me')
    return response.data
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await axiosInstance.put('/auth/profile', userData)
    return response.data
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await axiosInstance.put('/auth/change-password', passwordData)
    return response.data
  },

  // ✅ FORGOT PASSWORD - OTP bhejo email pe
  forgotPassword: async (email) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email })
    return response.data
  },

  // ✅ VERIFY OTP - OTP check karo
  verifyOTP: async (email, otp) => {
    const response = await axiosInstance.post('/auth/verify-otp', { email, otp })
    return response.data
  },

  // ✅ RESET PASSWORD - naya password set karo
  resetPassword: async (email, otp, newPassword) => {
    const response = await axiosInstance.post('/auth/reset-password', { email, otp, newPassword })
    return response.data
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
}

export default authApi