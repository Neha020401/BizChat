import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import chatService from '../services/chatService';
import userService from '../services/userService';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';

/**
 * ChatPage — orchestrates the chat feature.
 *
 * Responsibilities:
 *   - Fetches conversation list for the sidebar
 *   - Loads a specific conversation when :userId is in the URL
 *   - Handles sending messages via WebSocket
 *   - Listens for incoming WebSocket messages and appends them
 *
 * All UI rendering is delegated to:
 *   ConversationList  →  ConversationItem
 *   ChatWindow        →  MessageBubble, ChatInput
 */
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

  // ── Initial load ──────────────────────────────────────────
  useEffect(() => {
    fetchConversations();
  }, []);

  // ── Open conversation from URL param ──────────────────────
  useEffect(() => {
    if (userId) {
      loadConversation(userId);
    }
  }, [userId]);

  // ── Incoming WebSocket messages ───────────────────────────
  useEffect(() => {
    if (wsMessages.length === 0) return;
    const latest = wsMessages[wsMessages.length - 1];

    // Append to active conversation if it belongs here
    if (
      selectedUser &&
      (latest.senderId === selectedUser.otherUserId ||
        latest.receiverId === selectedUser.otherUserId)
    ) {
      setChatHistory((prev) => [...prev, latest]);
    }

    // Always refresh sidebar so last-message preview stays current
    fetchConversations();
  }, [wsMessages, selectedUser]);

  // ── Data fetching ─────────────────────────────────────────
  const fetchConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (otherUserId) => {
    // Show chat area immediately with a placeholder name
    setSelectedUser({ otherUserId, otherUserName: 'Loading…' });
    setChatHistory([]);

    // Load message history (may be empty for a brand-new chat)
    try {
      const history = await chatService.getConversation(otherUserId);
      setChatHistory(history || []);
    } catch (err) {
      console.error('Error fetching conversation history:', err);
      // Non-fatal — user can still send the first message
    }

    // Mark messages as read (fire-and-forget)
    chatService.markAsRead(otherUserId).catch(() => {});

    // Resolve the real display name
    // Backend returns: { id, email, profile: { name, ... }, ... }
    try {
      const userDetails = await userService.getUserById(otherUserId);
      const resolvedName =
        userDetails?.profile?.name ||
        userDetails?.name ||
        userDetails?.email ||
        'User';
      setSelectedUser({
        otherUserId: userDetails?.id || otherUserId,
        otherUserName: resolvedName,
      });
    } catch (userErr) {
      console.error('Error fetching user details:', userErr);
      // Fall back gracefully — chat is still usable
      setSelectedUser({ otherUserId, otherUserName: 'User' });
    }
  };

  // ── Event handlers ────────────────────────────────────────
  const handleSelectConversation = (conv) => {
    navigate(`/chat/${conv.otherUserId}`);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !connected) return;

    // Send via WebSocket
    sendMessage(selectedUser.otherUserId, newMessage);

    // Optimistic update — show message immediately without waiting for echo
    const tempMessage = {
      id: `temp-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      receiverId: selectedUser.otherUserId,
      receiverName: selectedUser.otherUserName,
      message: newMessage,
      timeStamp: new Date().toISOString(),
      isRead: false,
    };

    setChatHistory((prev) => [...prev, tempMessage]);
    setNewMessage('');
  };

  // ── Render ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600" />
          <p className="text-gray-500 text-sm">Loading conversations…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex bg-gray-100">
      {/* Sidebar */}
      <ConversationList
        conversations={conversations}
        selectedUserId={selectedUser?.otherUserId}
        connected={connected}
        onSelect={handleSelectConversation}
      />

      {/* Main pane */}
      {selectedUser ? (
        <ChatWindow
          selectedUser={selectedUser}
          chatHistory={chatHistory}
          currentUser={user}
          connected={connected}
          newMessage={newMessage}
          onMessageChange={(e) => setNewMessage(e.target.value)}
          onSendMessage={handleSendMessage}
        />
      ) : (
        /* Nothing selected yet */
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center px-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Your Messages
            </h2>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Select a conversation from the left, or contact a seller from any
              product page to start a new chat.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;