import api from './api';

const orderService = {
  // Create order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get buyer's orders
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  // Get seller's received orders
  getReceivedOrders: async () => {
    const response = await api.get('/orders/received');
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Update order status (Seller only)
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status?status=${status}`);
    return response.data;
  },

  // Cancel order (Buyer only)
  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },
};

export default orderService;
