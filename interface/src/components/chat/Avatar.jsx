import React from 'react';

/**
 * Displays the initials of a name inside a gradient circle.
 * Used as a fallback avatar throughout the chat UI.
 *
 * @param {string} name  - Full name to derive initials from
 * @param {number} size  - Tailwind size unit (e.g. 10 → w-10 h-10)
 */
const Avatar = ({ name = 'U', size = 10 }) => {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-blue-500 to-purple-600
        flex items-center justify-center text-white font-bold text-sm shrink-0 select-none`}
    >
      {initials}
    </div>
  );
};

export default Avatar;
