'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

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
  randomX: number
  randomY: number
  randomScale: number
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
const generateRandomImage = (id: number, slug: string): ImageItem => {
  // Generate 16:9 aspect ratio images with exact 240x135px dimensions
  const baseWidth = 240
  const baseHeight = 135
  
  // Use consistent size for all images
  const finalWidth = baseWidth
  const finalHeight = baseHeight
  
  // Use actual Ninja images if available, otherwise fallback to Picsum
  let imageSrc: string
  if (slug === 'ninja' && ninjaImages.length > 0) {
    // Cycle through available Ninja images
    const imageIndex = (id - 1) % ninjaImages.length
    imageSrc = ninjaImages[imageIndex]
  } else {
    imageSrc = `https://picsum.photos/${finalWidth}/${finalHeight}?random=${id}`
  }
  
  return {
    id,
    src: imageSrc,
    alt: `${slug.charAt(0).toUpperCase() + slug.slice(1)} work sample ${id}`,
    width: finalWidth,
    height: finalHeight,
    randomX: (Math.random() - 0.5) * 16, // Reduced random X offset ±8px
    randomY: (Math.random() - 0.5) * 16, // Reduced random Y offset ±8px
    randomScale: 0.98 + Math.random() * 0.04, // Reduced random scale 0.98-1.02
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const lastScrollTop = useRef(0)

  const workItem = workItems[slug]
  


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
      // For Ninja, start with all available images, for others use 24
      const initialCount = slug === 'ninja' ? ninjaImages.length : 24
      const initialImages = Array.from({ length: initialCount }, (_, i) => generateRandomImage(i + 1, slug))
      setImages(initialImages)
    }
  }, [workItem, slug])
  
  // Load more images
  const loadMoreImages = useCallback(() => {
    if (loading) return
    
    setLoading(true)
    setTimeout(() => {
      // For Ninja, cycle through available images, for others load 16 new ones
      let newImages: ImageItem[]
      if (slug === 'ninja') {
        // Cycle through available Ninja images
        newImages = Array.from({ length: 16 }, (_, i) => 
          generateRandomImage(images.length + i + 1, slug)
        )
      } else {
        newImages = Array.from({ length: 16 }, (_, i) => 
          generateRandomImage(images.length + i + 1, slug)
        )
      }
      
      setImages(prev => [...prev, ...newImages])
      setPage(prev => prev + 1)
      setLoading(false)
    }, 1000) // Simulate loading delay
  }, [images.length, loading, slug])
  
  // Container scroll handler for infinite scroll and navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current
      if (!container) return
      
      const { scrollTop, scrollHeight, clientHeight } = container
      
      // Load more when approaching bottom (since we have a proper grid)
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 800
      
      if (nearBottom) {
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
    <div className="work-page-container bg-white flex flex-col">
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
              <div 
                className="relative rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                style={{
                  transform: `translate(${image.randomX}px, ${image.randomY}px) scale(${image.randomScale})`,
                  transformOrigin: 'center center',
                  width: `${image.width}px`,
                  height: `${image.height}px`
                }}
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
              </div>
            </div>
          ))}
        </div>
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              <span className="text-sm">Loading more...</span>
            </div>
          </div>
        )}
        
        {/* Stats */}
        <div className="text-center py-8 text-gray-500 text-sm">
          Showing {images.length} items
        </div>
      </div>
    </div>
  )
}