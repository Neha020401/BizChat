import React, { useRef } from 'react';

/** Send arrow icon */
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

/**
 * The message input bar at the bottom of the chat window.
 *
 * Props:
 *   value       {string}    - current input value (controlled)
 *   onChange    {fn}        - (e) => void — called on every keystroke
 *   onSubmit    {fn}        - (e) => void — called on form submit
 *   connected   {boolean}   - WebSocket connection state
 *   disabled    {boolean}   - additional disable flag (e.g. while sending)
 */
const ChatInput = ({ value, onChange, onSubmit, connected, disabled = false }) => {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    onSubmit(e);
    // Re-focus after sending
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const canSend = connected && value.trim() && !disabled;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white px-4 py-3 border-t border-gray-200"
    >
      <div
        className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2
          border border-gray-200 focus-within:border-blue-400
          focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200"
      >
        <input
          ref={inputRef}
          id="chat-message-input"
          type="text"
          value={value}
          onChange={onChange}
          placeholder={connected ? 'Type a message…' : 'Connecting…'}
          className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
          disabled={!connected || disabled}
          autoComplete="off"
        />

        <button
          id="chat-send-btn"
          type="submit"
          disabled={!canSend}
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0
            transition-all duration-200
            ${canSend
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
  );
};

export default ChatInput;
