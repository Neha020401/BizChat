import React from "react";
import { Link } from "react-router-dom";
import {useAuth} from '../context/AuthContext';

const Dashboard = () => {
     const { user } = useAuth();
     
   return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.name}!
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Role</h3>
              <p className="text-2xl font-bold text-blue-600">{(user?.role) === 'SELLER' ? 'Seller' :'Union'}</p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Email</h3>
              <p className="text-sm text-green-600">{user?.email}</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Status</h3>
              <p className="text-2xl font-bold text-purple-600">Active</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Browse Products
              </button>
              <button className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700">
                My Orders
              </button>
              <button className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Wishlist
              </button>
              <button className="p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                Messages
              </button>

              {/* Seller-Specific Section */}
{(user?.role === 'SELLER' || user?.role === 'BOTH') && (
  <div className="bg-white rounded-lg shadow p-6 mt-8">
    <h2 className="text-xl font-semibold mb-4 text-gray-900">Seller Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link
        to="/add-product"
        className="flex items-center p-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
      >
        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="font-medium">Add New Product</span>
      </Link>

      <Link
        to="/my-products"
        className="flex items-center p-4 bg-linear-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition"
      >
        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="font-medium">Manage My Products</span>
      </Link>
    </div>
  </div>
)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;