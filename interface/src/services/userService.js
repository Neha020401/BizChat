import api from './api';

const apiAppend = "/artDummies/users";

const userService = {
  getUserById: async (userId) => {
    const response = await api.get(`${apiAppend}/${userId}`);
    return response.data;
  },
  getCurrentUserProfile: async () => {
    const response = await api.get(`${apiAppend}/profile`);
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put(`${apiAppend}/profile`, profileData);
    return response.data;
  },
  getAllSellers: async () => {
    const response = await api.get(`${apiAppend}/sellers`);
    return response.data;
  }
};

export default userService;
