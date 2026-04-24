import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import chatService from '../services/chatService';
import userService from '../services/userService';

const ChatPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { connected, sendMessage, messages: wsMessages } = useWebSocket();

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (userId) {
      loadConversation(userId);
    }
  }, [userId]);

  // Listen for new WebSocket messages
  useEffect(() => {
    if (wsMessages.length > 0) {
      const latestMessage = wsMessages[wsMessages.length - 1];
      // If message is for current conversation, add it
      if (
        selectedUser &&
        (latestMessage.senderId === selectedUser.otherUserId ||
          latestMessage.receiverId === selectedUser.otherUserId)
      ) {
        setChatHistory((prev) => [...prev, latestMessage]);
        scrollToBottom();
      }
    }
  }, [wsMessages, selectedUser]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const data = await chatService.getConversations();
      setConversations(data);
      // We don't set selectedUser here anymore to prevent race condition 
      // with loadConversation which handles it.
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (otherUserId) => {
    try {
      const history = await chatService.getConversation(otherUserId);
      setChatHistory(history);

      // Mark as read
      await chatService.markAsRead(otherUserId);

      // Fetch user details to set selectedUser reliably
      try {
        const userDetails = await userService.getUserById(otherUserId);
        setSelectedUser({
          otherUserId: userDetails.id,
          otherUserName: userDetails.name || 'User'
        });
      } catch (userErr) {
        console.error('Error fetching user details:', userErr);
      }
    } catch (err) {
      console.error('Error loading conversation:', err);
    }
  };

  const handleSelectConversation = (conversation) => {
    navigate(`/chat/${conversation.otherUserId}`);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    // Send via WebSocket
    sendMessage(selectedUser.otherUserId, newMessage);

    // Add to local state optimistically
    const tempMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      receiverId: selectedUser.otherUserId,
      receiverName: selectedUser.otherUserName,
      message: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setChatHistory((prev) => [...prev, tempMessage]);
    setNewMessage('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <p className="text-sm text-gray-500">
            {connected ? '🟢 Connected' : '🔴 Disconnected'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <button
                key={conv.conversationId}
                onClick={() => handleSelectConversation(conv)}
                className={`w-full p-4 border-b hover:bg-gray-50 text-left transition ${
                  selectedUser?.otherUserId === conv.otherUserId
                    ? 'bg-blue-50 border-l-4 border-l-blue-600'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {conv.otherUserName}
                  </h3>
                  {conv.unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {conv.lastMessage}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(conv.lastMessageTime).toLocaleString()}
                </p>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No conversations yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-4 border-b flex items-center">
              <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                {selectedUser.otherUserName.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedUser.otherUserName}
                </h3>
                <p className="text-sm text-gray-500">
                  {connected ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {chatHistory.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`flex ${
                    msg.senderId === user.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-lg ${
                      msg.senderId === user.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="wrap-break-word">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderId === user.id ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="bg-white p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!connected}
                />
                <button
                  type="submit"
                  disabled={!connected || !newMessage.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
              {!connected && (
                <p className="text-sm text-red-600 mt-2">
                  Connecting to chat server...
                </p>
              )}
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-xl">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;