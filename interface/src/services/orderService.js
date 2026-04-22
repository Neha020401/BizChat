import api from './api';

const orderService = {
  // Create order
  createOrder: async (orderData) => {
    const response = await api.post('/order', orderData);
    return response.data;
  },

  // Get buyer's orders
  getMyOrders: async () => {
    const response = await api.get('/order/my-orders');
    return response.data;
  },

  // Get seller's received orders
  getReceivedOrders: async () => {
    const response = await api.get('/order/received');
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/order/${id}`);
    return response.data;
  },

  // Update order status (Seller only)
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/order/${id}/status?status=${status}`);
    return response.data;
  },

  // Cancel order (Buyer only)
  cancelOrder: async (id) => {
    const response = await api.put(`/order/${id}/cancel`);
    return response.data;
  },
};

export default orderService;
