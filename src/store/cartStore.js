import { create } from 'zustand';
import { cartApi } from '../api/cartApi';

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const data = await cartApi.getCart();
      set({ cart: data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch cart', loading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    set({ loading: true, error: null });
    try {
      const data = await cartApi.addToCart(productId, quantity);
      set({ cart: data.data, loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to add to cart', loading: false });
      return { success: false, message: error.response?.data?.message };
    }
  },

  updateCartItem: async (productId, quantity) => {
    set({ loading: true, error: null });
    try {
      const data = await cartApi.updateCartItem(productId, quantity);
      set({ cart: data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update cart', loading: false });
    }
  },

  removeFromCart: async (productId) => {
    set({ loading: true, error: null });
    try {
      const data = await cartApi.removeFromCart(productId);
      set({ cart: data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to remove from cart', loading: false });
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      const data = await cartApi.clearCart();
      set({ cart: data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to clear cart', loading: false });
    }
  },

  getCartItemCount: () => {
    const cart = get().cart;
    return cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  },
}));