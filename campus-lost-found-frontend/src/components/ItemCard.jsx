import React from 'react'

const ItemCard = ({ item, onViewDetails, onClaim, showActions = true }) => {
  const getStatusBadge = (status) => {
    const statusClasses = {
      lost: 'badge-lost',
      found: 'badge-found',
      claimed: 'badge-claimed',
      returned: 'badge-returned',
    }
    return `badge ${statusClasses[status] || 'badge-lost'}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-image.jpg'
    if (imageUrl.startsWith('http')) return imageUrl
    return imageUrl
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden card-hover animate-fade-in"
      role="article"
      aria-label={`${item.status} item: ${item.name}`}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <img
            src={getImageUrl(item.images[0])}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {/* Status Badge */}
        <span className={`absolute top-2 right-2 ${getStatusBadge(item.status)}`}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
          {item.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Metadata */}
        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="capitalize">{item.category}</span>
          </div>
          
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{item.location}</span>
          </div>
          
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formatDate(item.date)}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={() => onViewDetails(item)}
              className="flex-1 btn-outline py-2 text-sm"
              aria-label={`View details for ${item.name}`}
            >
              View Details
            </button>
            {item.status !== 'claimed' && onClaim && (
              <button
                onClick={() => onClaim(item)}
                className="flex-1 btn-primary py-2 text-sm"
                aria-label={`Claim ${item.name}`}
              >
                Claim
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemCard
