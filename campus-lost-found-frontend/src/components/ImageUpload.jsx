import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'

const ImageUpload = ({ images, setImages, maxFiles = 5 }) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      toast.error('Some files were rejected. Please check file type and size.')
      return
    }

    // Check total file count
    if (images.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`)
      return
    }

    // Add new files to existing images
    const newImages = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }))

    setImages((prev) => [...prev, ...newImages])
  }, [images, maxFiles, setImages])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    },
    maxSize: 5242880, // 5MB
    maxFiles: maxFiles - images.length,
  })

  const removeImage = (id) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id)
      // Revoke object URL to free memory
      const removed = prev.find((img) => img.id === id)
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview)
      }
      return updated
    })
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
        `}
        role="button"
        tabIndex={0}
        aria-label="Upload images"
      >
        <input {...getInputProps()} />
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-4">
          {isDragActive ? (
            <p className="text-primary-600 font-medium">Drop images here...</p>
          ) : (
            <>
              <p className="text-gray-700 font-medium">
                Drag & drop images here, or click to select
              </p>
              <p className="text-sm text-gray-500 mt-2">
                PNG, JPG, GIF up to 5MB (max {maxFiles} images)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-lg overflow-hidden shadow-md aspect-square"
            >
              <img
                src={img.preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="
                  absolute top-2 right-2 bg-red-500 text-white rounded-full p-1
                  opacity-0 group-hover:opacity-100 transition-opacity
                  hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500
                "
                aria-label="Remove image"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 0 && (
        <p className="text-sm text-gray-600 text-center">
          {images.length} / {maxFiles} images uploaded
        </p>
      )}
    </div>
  )
}

export default ImageUpload
