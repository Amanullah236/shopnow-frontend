import axiosInstance from './axiosInstance';

export const categoryApi = {
  getCategories: async () => {
    const response = await axiosInstance.get('/categories');
    return response.data;
  },

  getCategory: async (id) => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  },
};