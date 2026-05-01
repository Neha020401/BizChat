import React from 'react';

/** Color map for order status values */
const STATUS_STYLES = {
  PENDING:   'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED:   'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

/**
 * OrderStatusBadge — a colored pill showing the order status.
 * Shared by both MyOrdersPage and SellerOrdersPage.
 *
 * @param {string} status - e.g. "PENDING", "SHIPPED"
 * @param {string} size   - "sm" (default) | "md"
 */
const OrderStatusBadge = ({ status, size = 'sm' }) => {
  const colorClass = STATUS_STYLES[status] || 'bg-gray-100 text-gray-800';
  const sizeClass  = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-1 text-xs';

  return (
    <span className={`font-semibold rounded-full ${colorClass} ${sizeClass}`}>
      {status}
    </span>
  );
};

export default OrderStatusBadge;
