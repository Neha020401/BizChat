import React, { useRef, useEffect } from 'react';
import Avatar from './Avatar';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

/**
 * The main chat pane — header, scrollable messages, and the input bar.
 * Rendered only when a conversation is selected.
 *
 * Props:
 *   selectedUser  {object}   - { otherUserId, otherUserName }
 *   chatHistory   {Array}    - list of ChatMessageDTO
 *   currentUser   {object}   - the logged-in user from AuthContext
 *   connected     {boolean}  - WebSocket status
 *   newMessage    {string}   - controlled input value
 *   onMessageChange {fn}     - (e) => void
 *   onSendMessage   {fn}     - (e) => void
 */
const ChatWindow = ({
  selectedUser,
  chatHistory,
  currentUser,
  connected,
  newMessage,
  onMessageChange,
  onSendMessage,
}) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll whenever chatHistory changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm flex items-center gap-4 shrink-0">
        <Avatar name={selectedUser.otherUserName} size={10} />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate">
            {selectedUser.otherUserName}
          </h3>
          <p
            className={`text-xs font-medium ${
              connected ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {connected ? 'Active now' : 'Offline'}
          </p>
        </div>
      </div>

      {/* ── Messages ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3 bg-gray-50">
        {chatHistory.length === 0 ? (
          /* Empty conversation — encourage the user to send a first message */
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-gray-700 font-semibold mb-1">
                Start the conversation!
              </p>
              <p className="text-gray-400 text-sm">
                Say hello to{' '}
                <span className="font-medium text-blue-600">
                  {selectedUser.otherUserName}
                </span>{' '}
                👋
              </p>
            </div>
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <MessageBubble
              key={msg.id || `msg-${index}`}
              message={msg}
              isMine={msg.senderId === currentUser?.id}
              otherName={selectedUser.otherUserName}
              currentUser={currentUser}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ────────────────────────────────────────── */}
      <ChatInput
        value={newMessage}
        onChange={onMessageChange}
        onSubmit={onSendMessage}
        connected={connected}
      />
    </div>
  );
};

export default ChatWindow;
