import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { itemsAPI } from '../api'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const [stats, setStats] = useState({ lost: 0, found: 0, returned: 0 })
  const [recentItems, setRecentItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch stats
      const [lostData, foundData, returnedData, recentData] = await Promise.all([
        itemsAPI.getItems({ status: 'lost', limit: 1 }),
        itemsAPI.getItems({ status: 'found', limit: 1 }),
        itemsAPI.getItems({ status: 'returned', limit: 1 }),
        itemsAPI.getItems({ limit: 6 }),
      ])

      setStats({
        lost: lostData.total,
        found: foundData.total,
        returned: returnedData.total,
      })
      setRecentItems(recentData.items)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleActionClick = (path) => {
    if (!isAuthenticated) {
      toast.info('Please login to continue')
      navigate('/login')
      return
    }
    navigate(path)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Lost Something? Found Something?
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Help Your Campus Community!
            </p>
            <p className="text-lg mb-10 text-blue-50">
              Connect with students and staff to reunite lost items with their owners.
              Our platform makes it easy to report and find lost belongings across campus.
            </p>
            
            {!isAuthenticated && (
              <Link
                to="/login"
                className="inline-block bg-white text-primary-600 font-bold py-3 px-8 rounded-lg 
                         hover:bg-blue-50 transition-colors shadow-lg text-lg"
              >
                Get Started Now
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center p-8 bg-red-50 rounded-lg shadow-md"
            >
              <div className="text-4xl font-bold text-red-600 mb-2">
                {loading ? '...' : stats.lost}
              </div>
              <div className="text-gray-700 font-medium">Lost Items</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center p-8 bg-secondary-50 rounded-lg shadow-md"
            >
              <div className="text-4xl font-bold text-secondary-600 mb-2">
                {loading ? '...' : stats.found}
              </div>
              <div className="text-gray-700 font-medium">Found Items</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center p-8 bg-blue-50 rounded-lg shadow-md"
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {loading ? '...' : stats.returned}
              </div>
              <div className="text-gray-700 font-medium">Successful Returns</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Actions Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Lost Something Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-8 card-hover"
            >
              <div className="flex items-center mb-6">
                <svg
                  className="w-12 h-12 text-red-500 mr-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900">Lost Something?</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Search our database of found items or report your lost item to help others identify it.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/browse')}
                  className="w-full btn-outline"
                >
                  Browse Found Items
                </button>
                <button
                  onClick={() => handleActionClick('/matches')}
                  className="w-full btn-primary"
                >
                  Find Matches for Your Item
                </button>
              </div>
            </motion.div>

            {/* Found Something Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-8 card-hover"
            >
              <div className="flex items-center mb-6">
                <svg
                  className="w-12 h-12 text-secondary-500 mr-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900">Found Something?</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Help someone find their lost item by posting what you found. Upload photos and details.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/browse')}
                  className="w-full btn-outline"
                >
                  Browse Lost Items
                </button>
                <button
                  onClick={() => handleActionClick('/browse?post=true')}
                  className="w-full btn-secondary"
                >
                  Post Found Item
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Items Section */}
      {recentItems.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Recent Items
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recentItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-6 shadow-md card-hover"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                      {item.name}
                    </h3>
                    <span className={`badge ${item.status === 'lost' ? 'badge-lost' : 'badge-found'} ml-2`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="capitalize">{item.category}</span> • {item.location}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/browse" className="btn-primary inline-block">
                View All Items
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Report or Search</h3>
              <p className="text-gray-600">
                Lost something? Search found items. Found something? Post it with photos.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m4 0h-1v4h-1M12 8v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Matched</h3>
              <p className="text-gray-600">
                Our smart system matches lost and found items based on description and category.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1118.88 6.196 9 9 0 015.12 17.804zM12 11a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Reunite</h3>
              <p className="text-gray-600">
                Connect with the finder or owner and arrange to retrieve your item.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
