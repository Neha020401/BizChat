import React from 'react';

/**
 * Formats a timestamp string into a human-readable label.
 *   - Same day   → "2:30 PM"
 *   - Yesterday  → "Yesterday"
 *   - Older      → "Apr 28" (short date)
 *
 * @param {string} ts - ISO timestamp string
 * @returns {string}
 */
export const formatTime = (ts) => {
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
