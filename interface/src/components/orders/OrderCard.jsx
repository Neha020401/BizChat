import React from 'react';
import { useNavigate } from 'react-router-dom';
import OrderStatusBadge from './OrderStatusBadge';

/**
 * OrderCard — a single buyer order card used in MyOrdersPage.
 *
 * Props:
 *   order           {object} - OrderResponse from backend
 *   onCancelOrder   {fn}     - (orderId) => void
 */
const OrderCard = ({ order, onCancelOrder }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* ── Header ── */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-600">
            Order ID: <span className="font-mono">{order.id}</span>
          </p>
          <p className="text-sm text-gray-600">
            Placed on: {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <OrderStatusBadge status={order.status} size="md" />
      </div>

      {/* ── Product Info ── */}
      <div className="flex gap-4 mb-4">
        <div className="text-6xl">🎨</div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{order.productTitle}</h3>
          <p className="text-gray-600">Seller: {order.sellerName}</p>
          <p className="text-gray-600">Quantity: {order.quantity}</p>
          <p className="text-xl font-bold text-blue-600 mt-2">
            ${order.totalPrice.toFixed(2)}
          </p>
        </div>
      </div>

      {/* ── Shipping Address ── */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="font-semibold mb-2">Shipping Address</h4>
        <p className="text-sm text-gray-700">
          {order.shippingAddress.street}<br />
          {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
          {order.shippingAddress.zipCode}<br />
          {order.shippingAddress.country}<br />
          Phone: {order.shippingAddress.phone}
        </p>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => navigate(`/products/${order.productId}`)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Product
        </button>

        {order.sellerId && (
          <button
            onClick={() => navigate(`/chat/${order.sellerId}`)}
            className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
          >
            💬 Chat with Seller
          </button>
        )}

        {order.status === 'PENDING' && (
          <button
            onClick={() => onCancelOrder(order.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
