import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container-custom py-4" role="navigation" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            aria-label="Campus Lost & Found Home"
          >
            <svg 
              className="w-8 h-8 text-primary-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <span className="text-xl font-bold text-gray-900">
              Campus Lost & Found
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              aria-label="Home"
            >
              Home
            </Link>
            <Link 
              to="/browse" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              aria-label="Browse Items"
            >
              Browse
            </Link>
            {isAuthenticated && (
              <Link 
                to="/matches" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                aria-label="Find Matches"
              >
                Find Matches
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm" aria-label={`Logged in as ${user?.email}`}>
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-outline py-2 px-4"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="btn-primary"
                aria-label="Login or Sign Up"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
