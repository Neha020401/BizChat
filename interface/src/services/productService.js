import api from './api';

const productService = {
  // Get all products
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get products by seller
  getProductsBySeller: async (sellerId) => {
    const response = await api.get(`/products/seller/${sellerId}`);
    return response.data;
  },

  // Get my products
  getMyProducts: async () => {
    const response = await api.get('/products/my-products');
    return response.data;
  },

  // Search products
  searchProducts: async (keyword) => {
    const response = await api.get(`/products/search?keyword=${keyword}`);
    return response.data;
  },

  // Filter by category
  getProductsByCategory: async (category) => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },

  // Filter by price
  filterByPrice: async (minPrice, maxPrice) => {
    const response = await api.get(`/products/filter/price?minPrice=${minPrice}&maxPrice=${maxPrice}`);
    return response.data;
  },

  // Create product
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;

