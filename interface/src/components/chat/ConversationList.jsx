import React from 'react';
import ConversationItem from './ConversationItem';

/**
 * The left sidebar — shows the connection status pill and the full
 * list of conversations. Delegates individual rows to ConversationItem.
 *
 * Props:
 *   conversations   {Array}   - list of ConversationDTO objects
 *   selectedUserId  {string}  - otherUserId of the currently open chat
 *   connected       {boolean} - WebSocket connection state
 *   onSelect        {fn}      - (conversation) => void
 */
const ConversationList = ({
  conversations,
  selectedUserId,
  connected,
  onSelect,
}) => {
  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm shrink-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Messages</h2>

          {/* Online / Offline pill */}
          <span
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
              ${connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
            />
            {connected ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Conversation rows */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.conversationId || conv.otherUserId}
              conversation={conv}
              isActive={selectedUserId === conv.otherUserId}
              onClick={() => onSelect(conv)}
            />
          ))
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
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
            <p className="text-gray-700 font-semibold mb-1">No messages yet</p>
            <p className="text-gray-400 text-sm">
              Browse products and contact a seller to start chatting.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ConversationList;
