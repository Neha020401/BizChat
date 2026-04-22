import api from './api';

const wishlistService = {
  // Add to wishlist
  addToWishlist: async (productId) => {
    const response = await api.post(`/api/wishlist/${productId}`);
    return response.data;
  },

  // Get wishlist
  getWishlist: async () => {
    const response = await api.get('/api/wishlist');
    return response.data;
  },

  // Remove from wishlist
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/api/wishlist/${productId}`);
    return response.data;
  },

  // Check if product is in wishlist
  isInWishlist: async (productId) => {
    const response = await api.get(`/api/wishlist/check/${productId}`);
    return response.data;
  },
};

export default wishlistService;