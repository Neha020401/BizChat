import api from './api';



const apiAppend = "/artDummies/notifications";

const notificationService = {
  // Get all notifications
  getNotifications: async () => {
    const response = await api.get(`${apiAppend}`);
    return response.data;
  },

  // Get unread notifications
  getUnreadNotifications: async () => {
    const response = await api.get(`${apiAppend}/unread`);
    return response.data;
  },

  // Mark as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`${apiAppend}/${notificationId}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await api.get(`${apiAppend}/read-all`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get(`${apiAppend}/unread-count`);
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`${apiAppend}/${notificationId}`);
    return response.data;
  },
};

export default notificationService;
