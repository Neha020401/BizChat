import api from './api';

const productService = {
 
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  
  getProductsBySeller: async (sellerId) => {
    const response = await api.get(`/products/seller/${sellerId}`);
    return response.data;
  },

  
  getMyProducts: async () => {
    const response = await api.get('/products/my-products');
    return response.data;
  },

  
  searchProducts: async (keyword) => {
    const response = await api.get(`/products/search?keyword=${keyword}`);
    return response.data;
  },

  
  getProductsByCategory: async (category) => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },

  
  filterByPrice: async (minPrice, maxPrice) => {
    const response = await api.get(`/products/filter/price?minPrice=${minPrice}&maxPrice=${maxPrice}`);
    return response.data;
  },

  
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;

