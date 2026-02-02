import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const { login, register: registerUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm()

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const onSubmit = async (data) => {
    setLoading(true)
    
    try {
      if (isLogin) {
        // Login
        const result = await login({
          email: data.email,
          password: data.password,
        })
        
        if (result.success) {
          navigate('/')
        }
      } else {
        // Register
        const result = await registerUser({
          email: data.email,
          password: data.password,
          confirm_password: data.confirmPassword,
          full_name: data.fullName || null,
        })
        
        if (result.success) {
          navigate('/')
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    toast.info('Password reset feature coming soon!')
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    reset()
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-primary-600"
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
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={toggleMode}
              className="font-medium text-primary-600 hover:text-primary-500"
              type="button"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            {/* Full Name (Register Only) */}
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name (Optional)
                </label>
                <input
                  id="fullName"
                  type="text"
                  {...register('fullName')}
                  className="input-field"
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={`input-field ${errors.email ? 'input-error' : ''}`}
                placeholder="you@campus.edu"
                autoComplete="email"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                id="password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className={`input-field ${errors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password (Register Only) */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === watch('password') || 'Passwords do not match',
                  })}
                  className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                />
                {errors.confirmPassword && (
                  <p id="confirm-password-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Forgot Password (Login Only) */}
          {isLogin && (
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg"
              aria-label={isLogin ? 'Sign in' : 'Sign up'}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
              )}
            </button>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs text-blue-700">
            Email: john@campus.edu<br />
            Password: password123
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
