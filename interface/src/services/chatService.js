import api from './api';

const apiAppend = "/artDummies/chat";

const chatService = {
  // Get conversation history
  getConversation: async (otherUserId) => {
    const response = await api.get(`${apiAppend}/conversation?otherUserId=${otherUserId}`);
    return response.data;
  },

  // Get all conversations
  getConversations: async () => {
    const response = await api.get(`${apiAppend}/conversations`);
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (otherUserId) => {
    const response = await api.put(`${apiAppend}/read?otherUserId=${otherUserId}`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get(`${apiAppend}/unread-count`);
    return response.data;
  },
};

export default chatService;
