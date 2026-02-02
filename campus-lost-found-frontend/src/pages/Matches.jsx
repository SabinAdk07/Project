import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ItemCard from '../components/ItemCard'
import ImageUpload from '../components/ImageUpload'
import { matchesAPI, uploadAPI } from '../api'

const Matches = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [images, setImages] = useState([])
  const [uploadingImages, setUploadingImages] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

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

  const onSubmit = async (data) => {
    setLoading(true)
    setSearched(false)

    try {
      // Upload images first if any
      let imageUrls = []
      if (images.length > 0) {
        setUploadingImages(true)
        const uploadPromises = images.map((img) => uploadAPI.uploadImage(img.file))
        const uploadResults = await Promise.all(uploadPromises)
        imageUrls = uploadResults.map((result) => result.url)
        setUploadingImages(false)
      }

      // Find matches
      const matchData = {
        name: data.name,
        description: data.description,
        category: data.category,
        location: data.location || null,
        date: data.date ? new Date(data.date).toISOString() : null,
        images: imageUrls,
      }

      const result = await matchesAPI.findMatches(matchData)
      setMatches(result.matches)
      setSearched(true)

      if (result.matches.length === 0) {
        toast.info('No matches found. Try adjusting your search criteria.')
      } else {
        toast.success(`Found ${result.matches.length} potential matches!`)
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to find matches')
      console.error('Error finding matches:', error)
    } finally {
      setLoading(false)
      setUploadingImages(false)
    }
  }

  const getMatchQuality = (score) => {
    if (score >= 0.7) return { label: 'Excellent Match', color: 'text-green-600 bg-green-100' }
    if (score >= 0.5) return { label: 'Good Match', color: 'text-blue-600 bg-blue-100' }
    if (score >= 0.3) return { label: 'Possible Match', color: 'text-yellow-600 bg-yellow-100' }
    return { label: 'Weak Match', color: 'text-gray-600 bg-gray-100' }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 bg-gray-50">
        <div className="container-custom max-w-6xl">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Matches</h1>
            <p className="text-gray-600">
              Describe your lost item and we'll search for potential matches in found items
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  {...register('name', { required: 'Item name is required' })}
                  className={`input-field ${errors.name ? 'input-error' : ''}`}
                  placeholder="e.g., iPhone 13 Pro, Blue Backpack"
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
                  placeholder="Provide as many details as possible: color, brand, distinguishing features, etc."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    Location (Optional)
                  </label>
                  <input
                    {...register('location')}
                    className="input-field"
                    placeholder="Where did you lose it?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Lost (Optional)
                  </label>
                  <input
                    type="date"
                    {...register('date')}
                    className="input-field"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images (Optional)
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  Adding images can help improve match accuracy
                </p>
                <ImageUpload images={images} setImages={setImages} maxFiles={3} />
              </div>

              <button
                type="submit"
                disabled={loading || uploadingImages}
                className="w-full btn-primary py-3 text-lg"
              >
                {uploadingImages ? (
                  'Uploading Images...'
                ) : loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching for Matches...
                  </span>
                ) : (
                  '🔍 Find Matches'
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          {searched && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {matches.length > 0 ? (
                  `Found ${matches.length} Potential ${matches.length === 1 ? 'Match' : 'Matches'}`
                ) : (
                  'No Matches Found'
                )}
              </h2>

              {matches.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
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
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No matches found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any items matching your description. Try:
                  </p>
                  <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Using different keywords or broader terms</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Checking other categories</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Browsing all found items manually</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Checking back later as new items are added daily</span>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-6">
                  {matches.map((match, index) => (
                    <motion.div
                      key={match.item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-xl font-semibold text-gray-900 mr-3">
                                {match.item.name}
                              </h3>
                              <span className={`badge ${getMatchQuality(match.score).color}`}>
                                {getMatchQuality(match.score).label}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Match Score: {Math.round(match.score * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Image */}
                          <div>
                            {match.item.images && match.item.images.length > 0 ? (
                              <img
                                src={match.item.images[0]}
                                alt={match.item.name}
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="md:col-span-2 space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                              <p className="text-gray-900">{match.item.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Category</h4>
                                <p className="text-gray-900 capitalize">{match.item.category}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                                <p className="text-gray-900">{match.item.location}</p>
                              </div>
                            </div>

                            {match.match_reasons && match.match_reasons.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Why this matches:</h4>
                                <ul className="space-y-1">
                                  {match.match_reasons.map((reason, idx) => (
                                    <li key={idx} className="flex items-start text-sm text-gray-700">
                                      <svg className="w-4 h-4 text-secondary-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      {reason}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Contact</h4>
                              <p className="text-gray-900">{match.item.user_email}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Help Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips for Better Matches</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Be as specific as possible in your description (brand, color, model)</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Include unique features or markings that make your item identifiable</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Providing images significantly improves match accuracy</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Search multiple times with different descriptions if needed</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Matches
