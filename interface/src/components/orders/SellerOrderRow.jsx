import React from 'react';
import { useNavigate } from 'react-router-dom';
import OrderStatusBadge from './OrderStatusBadge';

/** Status values the seller can progress an order through */
const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

/**
 * SellerOrderRow — one <tr> in the seller's orders table.
 *
 * Props:
 *   order           {object} - OrderResponse from backend
 *   onStatusUpdate  {fn}     - (orderId, newStatus) => void
 */
const SellerOrderRow = ({ order, onStatusUpdate }) => {
  const navigate = useNavigate();
  const canChangeStatus =
    order.status !== 'CANCELLED' && order.status !== 'DELIVERED';

  return (
    <tr>
      {/* ── Order Details ── */}
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-gray-900">{order.productTitle}</p>
          <p className="text-sm text-gray-600">Qty: {order.quantity}</p>
          <p className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      </td>

      {/* ── Buyer ── */}
      <td className="px-6 py-4">
        <p className="text-sm font-medium">{order.buyerName}</p>
      </td>

      {/* ── Amount ── */}
      <td className="px-6 py-4">
        <p className="font-semibold text-blue-600">
          ${order.totalPrice.toFixed(2)}
        </p>
      </td>

      {/* ── Status ── */}
      <td className="px-6 py-4">
        <OrderStatusBadge status={order.status} />
      </td>

      {/* ── Actions ── */}
      <td className="px-6 py-4">
        <div className="flex flex-col gap-2">
          {/* Status dropdown — hidden once order is terminal */}
          {canChangeStatus && (
            <select
              value={order.status}
              onChange={(e) => onStatusUpdate(order.id, e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          )}

          {/* Chat with buyer */}
          {order.buyerId && (
            <button
              onClick={() => navigate(`/chat/${order.buyerId}`)}
              className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors text-left"
            >
              💬 Chat with Buyer
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default SellerOrderRow;
