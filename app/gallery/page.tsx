'use client'

import { useState, useEffect } from 'react'
import * as motion from 'motion/react-client'

interface ImageItem {
  id: number
  src: string
  alt: string
  width: number
  height: number
  animationDelay: number
}

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const baseImages: string[] = [
    '/images/case-studies/MN1.png', // MN1 always first
    'https://pbs.twimg.com/media/GrfyTa5XIAAVH1C?format=jpg&name=medium', // Twitter images
    'https://pbs.twimg.com/media/GoRjFbjWQAA3YYX?format=jpg&name=medium',
    'https://pbs.twimg.com/media/GoBUTPCWkAAephy?format=jpg&name=medium',
    'https://pbs.twimg.com/media/Gly9Mc2XAAAjzs4?format=jpg&name=4096x4096',
    'https://pbs.twimg.com/media/GsO_vhuWMAA5DYa?format=jpg&name=medium',
    'https://pbs.twimg.com/media/Gn-FtLlWcAANZkN?format=jpg&name=medium',
    'https://pbs.twimg.com/media/GspCFA9WQAALYSm?format=jpg&name=4096x4096', // New Twitter image
    '/images/case-studies/Ex1.png', // Local images grouped
    '/images/case-studies/LN1.png',
    '/images/case-studies/LN2.png',
    '/images/case-studies/LN3.png',
    '/images/case-studies/work/Ni2.png', // Ninja images grouped
    '/images/case-studies/work/Ni3.png',
    '/images/case-studies/work/Ni4.png',
    '/images/case-studies/work/Ni5.png',
    '/images/case-studies/work/Ni6.png',
    '/images/case-studies/work/Ni7.png',
    '/images/case-studies/work/Ni8.png',
    '/images/case-studies/work/Ni9.png',
    '/images/case-studies/work/Ni10.png',
    '/images/case-studies/work/Ni11.png',
    '/images/case-studies/work/Ni12.png',
    '/images/case-studies/work/Ni14.png', // New Ninja images
    '/images/case-studies/work/Ni15.png',
    '/images/case-studies/work/Ni16.png',
    '/images/case-studies/work/Ni17.png',
    '/images/case-studies/work/Ni18.png'
  ]

  const generateImage = (id: number): ImageItem => {
    const baseWidth = 256
    const baseHeight = 144
    const index = (id - 1) % baseImages.length
    return {
      id,
      src: baseImages[index],
      alt: `Gallery Image ${index + 1}`,
      width: baseWidth,
      height: baseHeight,
      animationDelay: Math.random() * 3
    }
  }

  const images = Array.from({ length: 30 }, (_, i) => generateImage(i + 1))

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image)
    setCurrentImageIndex(baseImages.indexOf(image.src))
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return
    
    let newIndex = currentImageIndex
    if (direction === 'prev') {
      newIndex = newIndex === 0 ? baseImages.length - 1 : newIndex - 1
    } else {
      newIndex = newIndex === baseImages.length - 1 ? 0 : newIndex + 1
    }
    
    setCurrentImageIndex(newIndex)
    const newImage = images.find(img => img.src === baseImages[newIndex])
    if (newImage) {
      setSelectedImage(newImage)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal()
      } else if (event.key === 'ArrowLeft') {
        navigateImage('prev')
      } else if (event.key === 'ArrowRight') {
        navigateImage('next')
      }
    }

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage, currentImageIndex, navigateImage])

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-[56px] bg-white border-b border-gray-200 z-40 flex items-center px-6">
        <a href="/" className="text-black hover:text-neutral-600 transition-colors">
          <span className="text-[13px]" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>← Back</span>
        </a>
      </nav>

      {/* Main Content */}
      <main className="pt-[56px] px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-8">Gallery</h1>
          
          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-10">
            {images.map((image) => (
              <motion.div
                key={image.id}
                className="cursor-pointer group"
                style={{ width: '256px', height: '144px' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: image.animationDelay, duration: 0.5 }}
                onClick={() => handleImageClick(image)}
              >
                {image.src.startsWith('http') ? (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                  />
                ) : (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-10">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={() => navigateImage('prev')}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white hover:bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => navigateImage('next')}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white hover:bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            {selectedImage.src.startsWith('http') ? (
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}


