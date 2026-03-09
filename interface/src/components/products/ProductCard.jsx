import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Product Image */}
        <div className="relative h-64 bg-gray-200">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-linear-to-br from-blue-100 to-purple-100">
              <span className="text-6xl">🎨</span>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-2 right-2">
            <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-md">
              {product.category}
            </span>
          </div>

          {/* Status Badge */}
          {product.status === 'SOLD' && (
            <div className="absolute top-2 left-2">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                SOLD
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">
            {product.title}
          </h3>

          {/* Seller Name */}
          <p className="text-sm text-gray-600 mb-2">
            by {product.sellerName}
          </p>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price and Stock */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">
                  {product.stock} in stock
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  Out of stock
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
