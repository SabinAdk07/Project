import api from './axios'

/**
 * Authentication API calls
 */

export const authAPI = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Verify token
  verifyToken: async () => {
    const response = await api.post('/auth/verify')
    return response.data
  },

  // Request password reset
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },
}

/**
 * Items API calls
 */

export const itemsAPI = {
  // Get all items with filters
  getItems: async (filters = {}) => {
    const params = new URLSearchParams()
    
    if (filters.status) params.append('status', filters.status)
    if (filters.category) params.append('category', filters.category)
    if (filters.search) params.append('search', filters.search)
    if (filters.location) params.append('location', filters.location)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    
    const response = await api.get(`/items?${params}`)
    return response.data
  },

  // Get single item
  getItem: async (itemId) => {
    const response = await api.get(`/items/${itemId}`)
    return response.data
  },

  // Create new item
  createItem: async (itemData) => {
    const response = await api.post('/items', itemData)
    return response.data
  },

  // Update item
  updateItem: async (itemId, itemData) => {
    const response = await api.put(`/items/${itemId}`, itemData)
    return response.data
  },

  // Delete item
  deleteItem: async (itemId) => {
    await api.delete(`/items/${itemId}`)
  },

  // Claim item
  claimItem: async (itemId) => {
    const response = await api.post(`/items/${itemId}/claim`)
    return response.data
  },
}

/**
 * Upload API calls
 */

export const uploadAPI = {
  // Upload single image
  uploadImage: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Upload multiple images
  uploadMultiple: async (files) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    
    const response = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}

/**
 * Matches API calls
 */

export const matchesAPI = {
  // Find matches for lost item
  findMatches: async (itemData) => {
    const response = await api.post('/matches', itemData)
    return response.data
  },

  // Get personalized suggestions
  getSuggestions: async () => {
    const response = await api.get('/matches/suggestions')
    return response.data
  },
}
