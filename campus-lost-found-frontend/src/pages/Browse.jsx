import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ItemCard from '../components/ItemCard'
import ImageUpload from '../components/ImageUpload'
import { itemsAPI, uploadAPI } from '../api'
import { useAuth } from '../context/AuthContext'

const Browse = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [showPostModal, setShowPostModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [postingItem, setPostingItem] = useState(false)
  const [images, setImages] = useState([])
  
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
    location: '',
    page: 1,
    limit: 20,
  })

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  useEffect(() => {
    fetchItems()
    
    // Check if should open post modal
    if (searchParams.get('post') === 'true' && isAuthenticated) {
      setShowPostModal(true)
    }
  }, [filters])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const data = await itemsAPI.getItems(filters)
      setItems(data.items)
      setPagination({
        page: data.page,
        pages: data.pages,
        total: data.total,
      })
    } catch (error) {
      toast.error('Failed to load items')
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewDetails = (item) => {
    setSelectedItem(item)
    setShowDetailsModal(true)
  }

  const handleClaimItem = async (item) => {
    if (!isAuthenticated) {
      toast.info('Please login to claim items')
      navigate('/login')
      return
    }

    try {
      await itemsAPI.claimItem(item.id)
      toast.success('Item claimed successfully!')
      fetchItems()
      setShowDetailsModal(false)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to claim item')
    }
  }

  const handlePostItem = async (data) => {
    if (!isAuthenticated) {
      toast.info('Please login to post items')
      navigate('/login')
      return
    }

    setPostingItem(true)

    try {
      // Upload images first
      let imageUrls = []
      if (images.length > 0) {
        setUploadingImages(true)
        const uploadPromises = images.map((img) => uploadAPI.uploadImage(img.file))
        const uploadResults = await Promise.all(uploadPromises)
        imageUrls = uploadResults.map((result) => result.url)
        setUploadingImages(false)
      }

      // Create item
      const itemData = {
        name: data.name,
        description: data.description,
        category: data.category,
        status: data.status,
        location: data.location,
        date: new Date(data.date).toISOString(),
        images: imageUrls,
      }

      await itemsAPI.createItem(itemData)
      toast.success('Item posted successfully!')
      setShowPostModal(false)
      reset()
      setImages([])
      fetchItems()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to post item')
    } finally {
      setPostingItem(false)
      setUploadingImages(false)
    }
  }

  const categories = [
    'electronics',
    'books',
    'clothing',
    'accessories',
    'ids',
    'keys',
    'bags',
    'sports',
    'other',
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 bg-gray-50">
        <div className="container-custom">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Items</h1>
              <p className="text-gray-600">
                {pagination.total} items found
              </p>
            </div>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  toast.info('Please login to post items')
                  navigate('/login')
                  return
                }
                setShowPostModal(true)
              }}
              className="btn-primary"
            >
              + Post New Item
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search items..."
                  className="input-field"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="input-field"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All</option>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                  <option value="claimed">Claimed</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  className="input-field"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Filter by location..."
                  className="input-field"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="loading-spinner"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <svg
                className="mx-auto h-24 w-24 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">Try adjusting your filters or be the first to post an item!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ItemCard
                      item={item}
                      onViewDetails={handleViewDetails}
                      onClaim={handleClaimItem}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="btn-outline disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="btn-outline disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Post Item Modal */}
      {showPostModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPostModal(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Post New Item</h2>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit(handlePostItem)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className={`input-field ${errors.name ? 'input-error' : ''}`}
                    placeholder="e.g., iPhone 13 Pro"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows="4"
                    className={`input-field ${errors.description ? 'input-error' : ''}`}
                    placeholder="Provide detailed description..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      className={`input-field ${errors.category ? 'input-error' : ''}`}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      {...register('status', { required: 'Status is required' })}
                      className={`input-field ${errors.status ? 'input-error' : ''}`}
                    >
                      <option value="">Select status</option>
                      <option value="lost">Lost</option>
                      <option value="found">Found</option>
                    </select>
                    {errors.status && (
                      <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      {...register('location', { required: 'Location is required' })}
                      className={`input-field ${errors.location ? 'input-error' : ''}`}
                      placeholder="e.g., Library"
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      {...register('date', { required: 'Date is required' })}
                      className={`input-field ${errors.date ? 'input-error' : ''}`}
                      max={new Date().toISOString().split('T')[0]}
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images (Optional)
                  </label>
                  <ImageUpload images={images} setImages={setImages} maxFiles={5} />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="flex-1 btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={postingItem || uploadingImages}
                    className="flex-1 btn-primary"
                  >
                    {uploadingImages ? 'Uploading Images...' : postingItem ? 'Posting...' : 'Post Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Item Details Modal */}
      {showDetailsModal && selectedItem && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetailsModal(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.name}</h2>
                  <span className={`badge ${selectedItem.status === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                    {selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}
                  </span>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Images */}
              {selectedItem.images && selectedItem.images.length > 0 && (
                <div className="mb-6">
                  <img
                    src={selectedItem.images[0]}
                    alt={selectedItem.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-900">{selectedItem.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                    <p className="text-gray-900 capitalize">{selectedItem.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                    <p className="text-gray-900">{selectedItem.location}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Contact</h3>
                  <p className="text-gray-900">{selectedItem.user_email}</p>
                </div>
              </div>

              {selectedItem.status !== 'claimed' && (
                <button
                  onClick={() => handleClaimItem(selectedItem)}
                  className="w-full btn-primary"
                >
                  Claim This Item
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Browse
