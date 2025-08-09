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

// Generate random dimensions and positioning data for vertical grid
const generateRandomImage = (id: number): ImageItem => {
  const baseWidth = 224
  const baseHeight = 149
  const aspectRatio = baseWidth / baseHeight
  
  // Add some variation while keeping close to target size
  const variation = 0.4
  const randomWidth = baseWidth + (Math.random() - 0.5) * baseWidth * variation
  const randomHeight = randomWidth / aspectRatio
  
  // Create vertical grid layout (responsive)
  const columns = 5 // Desktop: 5 columns, will be responsive
  const columnWidth = 100 / columns // Each column takes up 20% of width
  const columnIndex = (id - 1) % columns
  const rowIndex = Math.floor((id - 1) / columns)
  
  // Position within column with some randomness
  const baseX = columnIndex * columnWidth + (columnWidth * 0.1) // 10% padding from column start
  const randomXOffset = Math.random() * (columnWidth * 0.6) // Random within 60% of column width
  const finalX = baseX + randomXOffset
  
  // Staggered Y positioning with more randomness
  const baseY = rowIndex * 200 + (Math.random() * 120) // Base row height with random offset
  
  return {
    id,
    src: `https://picsum.photos/${Math.floor(randomWidth)}/${Math.floor(randomHeight)}?random=${id}`,
    alt: `Work sample ${id}`,
    width: Math.floor(randomWidth),
    height: Math.floor(randomHeight),
    randomX: Math.max(2, Math.min(85, finalX)), // Keep within bounds
    randomY: baseY,
    randomRotation: (Math.random() - 0.5) * 8, // Random rotation between -4 and 4 degrees
    randomScale: 0.8 + (Math.random() * 0.4), // Scale between 0.8 and 1.2
    animationDelay: Math.random() * 3 // Random delay for floating animation
  }
}

export default function WorkPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [, setPage] = useState(1)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  const workItem = workItems[slug]
  
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
  
  // Container scroll handler for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current
      if (!container) return
      
      const { scrollTop, scrollHeight, clientHeight } = container
      if (scrollTop + clientHeight >= scrollHeight - 500) { // Load more when 500px from bottom
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
    <div className="h-screen bg-white flex flex-col overflow-hidden">
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
      
      {/* Scrollable Grid Container */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-8"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,0,0,0.2) rgba(0,0,0,0.05)'
        }}
      >
        <div className="relative w-full" style={{ height: `${Math.max(1500, Math.ceil(images.length / 5) * 250)}px` }}>
          {images.map((image) => (
            <div 
              key={image.id} 
              className="absolute group cursor-pointer transition-all duration-500 hover:z-50 animate-float"
              style={{
                left: `${image.randomX}%`,
                top: `${image.randomY}px`,
                transform: `rotate(${image.randomRotation}deg) scale(${image.randomScale})`,
                transformOrigin: 'center center',
                animationDelay: `${image.animationDelay}s`,
                animationDuration: `${3 + (image.id % 3)}s`,
                '--rotation': `${image.randomRotation}deg`,
                '--scale': `${image.randomScale}`
              } as React.CSSProperties & { '--rotation': string; '--scale': string }}
            >
              <div className="relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="object-cover"
                  loading="lazy"
                  style={{
                    width: `${224 * image.randomScale}px`,
                    height: `${149 * image.randomScale}px`
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