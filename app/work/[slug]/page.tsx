'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import * as motion from 'motion/react-client'

interface WorkItem {
  title: string
  description: string
  year: string
}

const workItems: { [key: string]: WorkItem } = {
  'ninja': { title: 'Ninja', description: 'Design & Development', year: '2024' },
  'linktree': { title: 'Linktree', description: 'Product Design', year: '2024' },
  'whop': { title: 'Whop', description: 'User Experience', year: '2023' },
  'context': { title: 'Context', description: 'Brand & Design', year: '2023' }
}

interface ImageItem {
  id: number
  src: string
  alt: string
  width: number
  height: number
  animationDelay: number
}

// Ninja project images
const ninjaImages = [
  '/images/case-studies/work/Ni2.png',
  '/images/case-studies/work/Ni3.png',
  '/images/case-studies/work/Ni4.png',
  '/images/case-studies/work/Ni5.png',
  '/images/case-studies/work/Ni6.png',
  '/images/case-studies/work/Ni7.png',
  '/images/case-studies/work/Ni8.png',
  '/images/case-studies/work/Ni9.png',
  '/images/case-studies/work/Ni10.png',
  '/images/case-studies/work/Ni11.png',
  '/images/case-studies/work/Ni12.png'
]

// Generate images with natural dimensions (CSS Grid handles positioning)
const generateRandomImage = (id: number, slug: string): ImageItem | null => {
  // Generate 16:9 aspect ratio images with exact 240x135px dimensions
  const baseWidth = 240
  const baseHeight = 135
  
  // Use consistent size for all images
  const finalWidth = baseWidth
  const finalHeight = baseHeight
  
  // Only use actual images that exist
  let imageSrc: string
  let alt: string
  
  if (slug === 'ninja' && ninjaImages.length > 0) {
    // Use actual Ninja images
    const imageIndex = (id - 1) % ninjaImages.length
    imageSrc = ninjaImages[imageIndex]
    alt = `Ninja Project Image ${imageIndex + 1}`
  } else {
    // For other projects, we need actual images
    // For now, return null to indicate no images
    return null
  }
  
  return {
    id,
    src: imageSrc,
    alt,
    width: finalWidth,
    height: finalHeight,
    animationDelay: Math.random() * 3
  }
}

export default function WorkPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [, setPage] = useState(1)
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const lastScrollTop = useRef(0)

  const workItem = workItems[slug]
  
  const openModal = (image: ImageItem) => {
    setSelectedImage(image)
    setIsModalOpen(true)
  }
  
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
  }

  // Prevent body scrolling when component mounts
  useEffect(() => {
    // Store original body overflow
    const originalOverflow = document.body.style.overflow
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden'
    
    // Restore original overflow when component unmounts
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  // Load initial images
  useEffect(() => {
    if (workItem) {
      // Only show actual images that exist
      if (slug === 'ninja') {
        // For Ninja, use all available images (no infinite scroll needed)
        const initialImages = Array.from({ length: ninjaImages.length }, (_, i) => generateRandomImage(i + 1, slug))
          .filter((img): img is ImageItem => img !== null)
        setImages(initialImages)
      } else {
        // For other projects, show message that images need to be added
        setImages([])
      }
    }
  }, [workItem, slug])
  
  // Load more images
  const loadMoreImages = useCallback(() => {
    if (loading) return
    
    // Only load more if we have actual images and haven't shown them all yet
    if (slug === 'ninja' && images.length < ninjaImages.length) {
      setLoading(true)
      setTimeout(() => {
        // Calculate how many more images we can add
        const remainingImages = ninjaImages.length - images.length
        const imagesToAdd = Math.min(16, remainingImages)
        
        // Add remaining images
        const newImages = Array.from({ length: imagesToAdd }, (_, i) => 
          generateRandomImage(images.length + i + 1, slug)
        )
          .filter((img): img is ImageItem => img !== null)
        
        setImages(prev => [...prev, ...newImages])
        setPage(prev => prev + 1)
        setLoading(false)
      }, 1000) // Simulate loading delay
    }
  }, [images.length, loading, slug])
  
  // Container scroll handler for infinite scroll and navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current
      if (!container) return
      
      const { scrollTop, scrollHeight, clientHeight } = container
      
      // Load more when approaching bottom (only if we haven't shown all images)
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 800
      
      if (nearBottom && slug === 'ninja' && images.length < ninjaImages.length) {
        loadMoreImages()
      }

      // Handle navbar visibility based on scroll direction
      if (scrollTop > lastScrollTop.current && scrollTop > 100) {
        // Scrolling down and past initial 100px
        setIsNavbarVisible(false)
      } else if (scrollTop < lastScrollTop.current) {
        // Scrolling up
        setIsNavbarVisible(true)
      }
      
      lastScrollTop.current = scrollTop
    }
    
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [loadMoreImages])
  
  if (!workItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Work not found</h1>
          <button 
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to home
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="work-page-container bg-white flex flex-col pt-[80px]">
      {/* Breadcrumb */}
      <div 
        className={`flex-shrink-0 z-50 h-[56px] transition-all duration-300 ease-in-out ${
          isNavbarVisible 
            ? 'translate-y-0 bg-white shadow-sm' 
            : '-translate-y-full bg-transparent'
        }`}
      >
        <div className="max-w-4xl mx-auto px-8 h-full flex items-center">
          <button 
            onClick={() => router.push('/')}
            className={`inline-flex items-center transition-all duration-300 text-[12px] ${
              isNavbarVisible 
                ? 'text-neutral-400 hover:text-black' 
                : 'text-black hover:text-neutral-600'
            }`}
            style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </button>
        </div>
      </div>
      
      {/* Scrollable Grid Container - Vertical Only */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,0,0,0.2) rgba(0,0,0,0.05)'
        }}
      >
        {slug === 'ninja' && images.length > 0 ? (
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8 justify-items-center"
            style={{
              minHeight: '100vh'
            }}
          >
            {images.map((image) => (
              <div 
                key={image.id} 
                className="flex justify-center items-center p-3"
                style={{
                  width: `${image.width + 32}px`,
                  height: `${image.height + 32}px`
                }}
              >
                <motion.div 
                  className="relative rounded-xl bg-white cursor-pointer"
                  style={{
                    width: `${image.width}px`,
                    height: `${image.height}px`
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openModal(image)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="object-cover rounded-xl"
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </motion.div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                {slug === 'ninja' ? 'Loading images...' : 'Images coming soon'}
              </h2>
              <p className="text-gray-500 text-sm">
                {slug === 'ninja' ? 'Please wait while we load your project images.' : 'We\'re working on adding images for this project.'}
              </p>
            </div>
          </div>
        )}
        
        {/* Loading indicator - only show if we're actually loading more */}
        {loading && slug === 'ninja' && images.length < ninjaImages.length && (
          <div className="flex justify-center py-8">
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              <span className="text-sm">Loading more...</span>
            </div>
          </div>
        )}
        
        {/* Stats - show total images for Ninja */}
        {slug === 'ninja' && images.length > 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            Showing {images.length} of {ninjaImages.length} images
          </div>
        )}
      </div>
      
      {/* Full Screen Modal */}
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-10">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-10 right-10 text-gray-600 hover:text-gray-800 transition-colors duration-200 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Image */}
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="max-w-full max-h-full object-contain rounded-lg"
            style={{
              maxWidth: 'calc(100vw - 80px)',
              maxHeight: 'calc(100vh - 80px)'
            }}
          />
        </div>
      )}
    </div>
  )
}