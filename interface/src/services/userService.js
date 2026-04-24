import api from './api';

const userService = {
  getUserById: async (userId) => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },
  getCurrentUserProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/api/users/profile', profileData);
    return response.data;
  },
  getAllSellers: async () => {
    const response = await api.get('/api/users/sellers');
    return response.data;
  }
};

export default userService;
