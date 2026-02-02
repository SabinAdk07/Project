import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" role="status" aria-label="Loading">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
