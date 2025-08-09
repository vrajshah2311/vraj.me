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
  randomRotation: number
  randomScale: number
  animationDelay: number
}

// Generate proper grid layout with no overlapping and consistent spacing
const generateRandomImage = (id: number): ImageItem => {
  // Generate varied but reasonable image dimensions
  const aspectRatios = [
    { w: 400, h: 300 }, // 4:3
    { w: 350, h: 250 }, // 7:5
    { w: 300, h: 400 }, // 3:4 (portrait)
    { w: 450, h: 300 }, // 3:2
    { w: 320, h: 320 }, // 1:1 (square)
    { w: 380, h: 280 }, // Varied
    { w: 300, h: 350 }, // Portrait
    { w: 420, h: 280 }  // Wide
  ]
  
  const randomAspect = aspectRatios[id % aspectRatios.length]
  const sizeVariation = 0.8 + (Math.random() * 0.4) // 0.8 to 1.2 scale
  
  const finalWidth = Math.floor(randomAspect.w * sizeVariation)
  const finalHeight = Math.floor(randomAspect.h * sizeVariation)
  
  // Create proper grid layout with consistent spacing
  const availableWidth = typeof window !== 'undefined' ? window.innerWidth - 64 : 1200
  const padding = 24 // 24px padding around each image
  const minColumnWidth = 350 // Minimum column width including padding
  const columns = Math.max(1, Math.floor(availableWidth / minColumnWidth))
  const actualColumnWidth = Math.floor(availableWidth / columns)
  
  const columnIndex = (id - 1) % columns
  const rowIndex = Math.floor((id - 1) / columns)
  
  // Grid positioning with proper spacing and no overlap
  const maxImageHeight = 400 // Maximum height for any image in a row
  const rowHeight = maxImageHeight + (padding * 2) // Row height includes padding
  const gridX = columnIndex * actualColumnWidth + padding + (actualColumnWidth - finalWidth - (padding * 2)) / 2 // Center in column with padding
  const gridY = rowIndex * rowHeight + padding // Proper row spacing with padding
  
  return {
    id,
    src: `https://picsum.photos/${finalWidth}/${finalHeight}?random=${id}`,
    alt: `Work sample ${id}`,
    width: finalWidth,
    height: finalHeight,
    randomX: Math.max(padding, gridX),
    randomY: gridY,
    randomRotation: (Math.random() - 0.5) * 3, // Subtle rotation (reduced)
    randomScale: 1, // No additional scaling, use natural size
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
  const [containerSize, setContainerSize] = useState({ width: 1200, height: 1500 })
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const workItem = workItems[slug]
  
  // Set container size based on proper grid layout
  useEffect(() => {
    const updateContainerSize = () => {
      // Calculate columns based on viewport width
      const availableWidth = window.innerWidth - 64 // Account for container padding
      const padding = 24 // 24px padding around each image
      const minColumnWidth = 350 // Minimum column width including padding
      const columns = Math.max(1, Math.floor(availableWidth / minColumnWidth))
      const maxImageHeight = 400 // Maximum height for any image in a row
      const rowHeight = maxImageHeight + (padding * 2) // Row height includes padding
      const rows = Math.ceil(images.length / columns)
      
      setContainerSize({
        width: availableWidth, // Use full available width
        height: rows * rowHeight + padding // Total height with bottom padding
      })
    }
    
    updateContainerSize()
    window.addEventListener('resize', updateContainerSize)
    return () => window.removeEventListener('resize', updateContainerSize)
  }, [images.length])

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
      const initialImages = Array.from({ length: 24 }, (_, i) => generateRandomImage(i + 1))
      setImages(initialImages)
    }
  }, [workItem])
  
  // Load more images
  const loadMoreImages = useCallback(() => {
    if (loading) return
    
    setLoading(true)
    setTimeout(() => {
      const newImages = Array.from({ length: 16 }, (_, i) => 
        generateRandomImage(images.length + i + 1)
      )
      setImages(prev => [...prev, ...newImages])
      setPage(prev => prev + 1)
      setLoading(false)
    }, 1000) // Simulate loading delay
  }, [images.length, loading])
  
  // Container scroll handler for infinite scroll (grid-based)
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current
      if (!container) return
      
      const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = container
      
      // Load more when approaching bottom (since we have a proper grid)
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 800
      
      if (nearBottom) {
        loadMoreImages()
      }
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
      {/* Header */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-semibold text-black">{workItem.title}</h1>
            <p className="text-sm text-gray-600">{workItem.description} • {workItem.year}</p>
          </div>
          
          <div className="w-16"></div> {/* Spacer for center alignment */}
        </div>
      </div>
      
      {/* Scrollable Grid Container - Vertical Only */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-8"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,0,0,0.2) rgba(0,0,0,0.05)'
        }}
      >
        <div 
          className="relative w-full" 
          style={{ 
            height: `${containerSize.height}px` 
          }}
        >
          {images.map((image) => (
            <div 
              key={image.id} 
              className="absolute group cursor-pointer transition-all duration-500 hover:z-50 animate-float"
              style={{
                left: `${image.randomX}px`,
                top: `${image.randomY}px`,
                transform: `rotate(${image.randomRotation}deg)`,
                transformOrigin: 'center center',
                animationDelay: `${image.animationDelay}s`,
                animationDuration: `${3 + (image.id % 3)}s`,
                '--rotation': `${image.randomRotation}deg`,
                '--scale': '1'
              } as React.CSSProperties & { '--rotation': string; '--scale': string }}
            >
              <div className="relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="object-cover"
                  loading="lazy"
                  style={{
                    width: `${image.width}px`,
                    height: `${image.height}px`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Floating glow effect on hover */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500" />
                
                {/* Subtle border */}
                <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 transition-colors duration-300" />
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