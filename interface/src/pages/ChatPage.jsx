import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import chatService from '../services/chatService';
import userService from '../services/userService';

/* ─── tiny helpers ─────────────────────────────────────── */
const formatTime = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  if (isNaN(d)) return '';
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const Avatar = ({ name, size = 10 }) => {
  const initials = (name || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0`}
    >
      {initials}
    </div>
  );
};

/* ─── SendIcon ─────────────────────────────────────────── */
const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

/* ─── Main Component ───────────────────────────────────── */
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
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (userId) {
      loadConversation(userId);
    }
  }, [userId]);

  // Live incoming WebSocket messages
  useEffect(() => {
    if (wsMessages.length > 0) {
      const latest = wsMessages[wsMessages.length - 1];
      if (
        selectedUser &&
        (latest.senderId === selectedUser.otherUserId ||
          latest.receiverId === selectedUser.otherUserId)
      ) {
        setChatHistory((prev) => [...prev, latest]);
        scrollToBottom();
      }
      // Refresh conversation list to update last-message preview
      fetchConversations();
    }
  }, [wsMessages, selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (otherUserId) => {
    // ── Step 1: Set a placeholder immediately so the chat area opens right
    //           away even before we fetch the real user name.
    setSelectedUser({
      otherUserId,
      otherUserName: 'Loading…',
    });
    setChatHistory([]);

    // ── Step 2: Load message history (may be empty for a brand-new chat)
    try {
      const history = await chatService.getConversation(otherUserId);
      setChatHistory(history || []);
    } catch (err) {
      console.error('Error fetching conversation history:', err);
      // Non-fatal — keep going so the user can still send the first message
    }

    // ── Step 3: Mark existing messages as read (non-blocking)
    chatService.markAsRead(otherUserId).catch(() => {});

    // ── Step 4: Resolve the real display name
    //   Backend returns: { id, email, profile: { name, ... }, ... }
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
      // Could not fetch user details — fall back to ID so UI stays usable
      console.error('Error fetching user details:', userErr);
      setSelectedUser({
        otherUserId,
        otherUserName: 'User',
      });
    }
  };

  const handleSelectConversation = (conv) => {
    navigate(`/chat/${conv.otherUserId}`);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !connected) return;

    setSending(true);
    sendMessage(selectedUser.otherUserId, newMessage);

    // Optimistic update
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
    setSending(false);
    inputRef.current?.focus();
  };

  /* ── Loading Spinner ───────────────────────────────────── */
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

  /* ── Main Layout ───────────────────────────────────────── */
  return (
    <div className="h-[calc(100vh-64px)] flex bg-gray-100">

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Sidebar Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Messages</h2>
            <span
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                connected
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}
              />
              {connected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map((conv) => {
              const isActive = selectedUser?.otherUserId === conv.otherUserId;
              return (
                <button
                  key={conv.conversationId}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full px-4 py-3 flex items-start gap-3 border-b border-gray-50 hover:bg-blue-50 text-left transition-all duration-150 ${
                    isActive ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <Avatar name={conv.otherUserName} size={10} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {conv.otherUserName}
                      </h3>
                      <span className="text-xs text-gray-400 shrink-0 ml-2">
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 truncate max-w-[160px]">
                        {conv.lastMessage}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 bg-blue-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-gray-700 font-semibold mb-1">No messages yet</p>
              <p className="text-gray-400 text-sm">
                Browse products and contact a seller to start chatting.
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* ── Chat Area ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm flex items-center gap-4">
              <Avatar name={selectedUser.otherUserName} size={10} />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">
                  {selectedUser.otherUserName}
                </h3>
                <p className={`text-xs font-medium ${connected ? 'text-green-600' : 'text-gray-400'}`}>
                  {connected ? 'Active now' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3 bg-gray-50">
              {chatHistory.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow">
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">
                      No messages yet. Say hello! 👋
                    </p>
                  </div>
                </div>
              )}

              {chatHistory.map((msg, index) => {
                const isMine = msg.senderId === user.id;
                return (
                  <div
                    key={msg.id || index}
                    className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMine && <Avatar name={selectedUser.otherUserName} size={7} />}

                    <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[65%]`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words shadow-sm ${
                          isMine
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                        }`}
                      >
                        {msg.message}
                      </div>
                      <span className="text-xs text-gray-400 mt-1 px-1">
                        {formatTime(msg.timeStamp)}
                        {isMine && (
                          <span className="ml-1 text-gray-400">
                            {msg.isRead ? ' ✓✓' : ' ✓'}
                          </span>
                        )}
                      </span>
                    </div>

                    {isMine && <Avatar name={user.name} size={7} />}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="bg-white px-4 py-3 border-t border-gray-200"
            >
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={connected ? 'Type a message…' : 'Connecting…'}
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                  disabled={!connected || sending}
                  id="chat-message-input"
                />
                <button
                  type="submit"
                  id="chat-send-btn"
                  disabled={!connected || !newMessage.trim() || sending}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                    connected && newMessage.trim()
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <SendIcon />
                </button>
              </div>
              {!connected && (
                <p className="text-xs text-amber-600 mt-2 text-center">
                  Reconnecting to chat server…
                </p>
              )}
            </form>
          </>
        ) : (
          /* Empty State — no conversation selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center px-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Your Messages
              </h2>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                Select a conversation from the left, or contact a seller from
                any product page to start a new chat.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;