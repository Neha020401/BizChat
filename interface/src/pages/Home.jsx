import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
const {isAuthenticated} = useAuth();

return(
     <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5l font-extrabold text-gray-900 mb-6">
            Welcome to Art Marketplace
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Buy and sell beautiful artwork from talented artists around the world
          </p>
 <div className="flex justify-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 text-lg font-semibold"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Browse Artwork</h3>
            <p className="text-gray-600">
              Discover unique pieces from talented artists worldwide
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Chat with Artists</h3>
            <p className="text-gray-600">
              Connect directly with artists in real-time
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Easy Checkout</h3>
            <p className="text-gray-600">
              Secure ordering and tracking for all purchases
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;