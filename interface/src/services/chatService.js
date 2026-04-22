import api from './api';

const chatService = {
  // Get conversation history
  getConversation: async (otherUserId) => {
    const response = await api.get(`/api/chat/conversation?otherUserId=${otherUserId}`);
    return response.data;
  },

  // Get all conversations
  getConversations: async () => {
    const response = await api.get('/api/chat/conversations');
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (otherUserId) => {
    const response = await api.put(`/api/chat/read?otherUserId=${otherUserId}`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get('/api/chat/unread-count');
    return response.data;
  },
};

export default chatService;
