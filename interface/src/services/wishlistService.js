import api from './api';

const apiAppend = "/artDummies/wishlist"
const wishlistService = {
  // Add to wishlist
  addToWishlist: async (productId) => {
    const response = await api.post(`${apiAppend}/${productId}`);
    return response.data;
  },

  // Get wishlist
  getWishlist: async () => {
    const response = await api.get(`${apiAppend}`);
    return response.data;
  },

  // Remove from wishlist
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`${apiAppend}/${productId}`);
    return response.data;
  },

  // Check if product is in wishlist
  isInWishlist: async (productId) => {
    const response = await api.get(`${apiAppend}/check/${productId}`);
    return response.data;
  },

 
};

export default wishlistService;