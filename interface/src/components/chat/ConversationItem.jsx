import React from 'react';
import Avatar from './Avatar';
import { formatTime } from './chatUtils';

/**
 * A single row in the conversation sidebar.
 *
 * Props:
 *   conversation  {object}  - ConversationDTO from backend
 *   isActive      {boolean} - whether this conversation is currently open
 *   onClick       {fn}      - called when the row is clicked
 */
const ConversationItem = ({ conversation, isActive, onClick }) => {
  const { otherUserName, lastMessage, lastMessageTime, unreadCount } =
    conversation;

  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 flex items-start gap-3 border-b border-gray-50
        hover:bg-blue-50 text-left transition-all duration-150 focus:outline-none
        ${isActive ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
    >
      {/* Avatar */}
      <Avatar name={otherUserName} size={10} />

      {/* Text content */}
      <div className="flex-1 min-w-0">
        {/* Name + timestamp row */}
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="font-semibold text-gray-900 text-sm truncate">
            {otherUserName}
          </h3>
          <span className="text-xs text-gray-400 shrink-0 ml-2">
            {formatTime(lastMessageTime)}
          </span>
        </div>

        {/* Last message + unread badge row */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 truncate max-w-[160px]">
            {lastMessage || 'Start a conversation…'}
          </p>
          {unreadCount > 0 && (
            <span className="ml-2 bg-blue-600 text-white text-xs font-bold
              rounded-full min-w-[20px] h-5 flex items-center justify-center
              px-1 shrink-0">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
