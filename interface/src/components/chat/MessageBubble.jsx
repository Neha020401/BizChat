import React from 'react';
import Avatar from './Avatar';
import { formatTime } from './chatUtils';

/**
 * Renders a single chat message bubble.
 *
 * Props:
 *   message     {object}  - ChatMessageDTO from backend
 *   isMine      {boolean} - true if the logged-in user sent this message
 *   otherName   {string}  - display name of the other participant (for avatar)
 *   currentUser {object}  - the logged-in user object
 */
const MessageBubble = ({ message, isMine, otherName, currentUser }) => {
  return (
    <div
      className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
    >
      {/* Receiver avatar — shown on the left */}
      {!isMine && <Avatar name={otherName} size={7} />}

      <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[65%]`}>
        {/* Bubble */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words shadow-sm
            ${isMine
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm'
              : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
            }`}
        >
          {message.message}
        </div>

        {/* Timestamp + read receipt */}
        <span className="text-xs text-gray-400 mt-1 px-1">
          {formatTime(message.timeStamp)}
          {isMine && (
            <span className="ml-1 text-gray-400">
              {message.isRead ? ' ✓✓' : ' ✓'}
            </span>
          )}
        </span>
      </div>

      {/* Sender avatar — shown on the right */}
      {isMine && <Avatar name={currentUser?.name || 'Me'} size={7} />}
    </div>
  );
};

export default MessageBubble;
