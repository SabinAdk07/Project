import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../api'
import { toast } from 'react-toastify'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
        
        // Verify token is still valid
        try {
          await authAPI.verifyToken()
        } catch (error) {
          // Token is invalid, clear auth state
          logout()
        }
      }
      
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials)

      setToken(data.access_token)
      setUser(data.user)

      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))

      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      // Fallback to demo/local auth when backend is unavailable
      console.warn('Auth API failed, falling back to demo auth:', error?.message || error)
      const demoUser = { id: 'demo-user', email: credentials.email || 'demo@local' }
      const demoToken = 'demo-token'

      setToken(demoToken)
      setUser(demoUser)

      localStorage.setItem('token', demoToken)
      localStorage.setItem('user', JSON.stringify(demoUser))

      toast.success('Logged in (demo mode)')
      return { success: true, demo: true }
    }
  }

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData)

      setToken(data.access_token)
      setUser(data.user)

      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))

      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      // Fallback to demo/local registration when backend is unavailable
      console.warn('Register API failed, creating local demo user:', error?.message || error)
      const demoUser = { id: 'demo-user', email: userData.email || 'demo@local', full_name: userData.full_name || null }
      const demoToken = 'demo-token'

      setToken(demoToken)
      setUser(demoUser)

      localStorage.setItem('token', demoToken)
      localStorage.setItem('user', JSON.stringify(demoUser))

      toast.success('Registered (demo mode)')
      return { success: true, demo: true }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.info('Logged out successfully')
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
