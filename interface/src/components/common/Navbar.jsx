import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {

    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
    logout()
    navigate('/')
    }



  return (
   <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              🎨 Art Marketplace
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2"
                >
                  Dashboard
                </Link>
                <Link
                  to="/products"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2"
                >
                  Products
                </Link>
                <span className="text-gray-700">Hi, {user?.name}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;