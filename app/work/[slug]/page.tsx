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
  currentX?: number
  currentY?: number
  isDragging?: boolean
}

// Generate random dimensions and positioning data
const generateRandomImage = (id: number): ImageItem => {
  const baseWidth = 224
  const baseHeight = 149
  const aspectRatio = baseWidth / baseHeight
  
  // Add some variation while keeping close to target size
  const variation = 0.3
  const randomWidth = baseWidth + (Math.random() - 0.5) * baseWidth * variation
  const randomHeight = randomWidth / aspectRatio
  
  return {
    id,
    src: `https://picsum.photos/${Math.floor(randomWidth)}/${Math.floor(randomHeight)}?random=${id}`,
    alt: `Work sample ${id}`,
    width: Math.floor(randomWidth),
    height: Math.floor(randomHeight),
    randomX: Math.random() * 75, // Percentage from left
    randomY: (id - 1) * 180 + (Math.random() * 150), // Staggered Y with randomness
    randomRotation: (Math.random() - 0.5) * 6, // Random rotation between -3 and 3 degrees
    randomScale: 0.85 + (Math.random() * 0.3), // Scale between 0.85 and 1.15
    animationDelay: Math.random() * 2 // Random delay for floating animation
  }
}

export default function WorkPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [, setPage] = useState(1)
  const [draggedImage, setDraggedImage] = useState<number | null>(null)
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  
  const workItem = workItems[slug]
  
  // Load initial images
  useEffect(() => {
    if (workItem) {
      const initialImages = Array.from({ length: 12 }, (_, i) => generateRandomImage(i + 1))
      setImages(initialImages)
    }
  }, [workItem])
  
  // Load more images
  const loadMoreImages = useCallback(() => {
    if (loading) return
    
    setLoading(true)
    setTimeout(() => {
      const newImages = Array.from({ length: 8 }, (_, i) => 
        generateRandomImage(images.length + i + 1)
      )
      setImages(prev => [...prev, ...newImages])
      setPage(prev => prev + 1)
      setLoading(false)
    }, 1000) // Simulate loading delay
  }, [images.length, loading])
  
  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent, imageId: number) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
    setDraggedImage(imageId)
    
    // Update image dragging state
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, isDragging: true } : img
    ))
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (draggedImage === null) return
    
    const containerRect = document.querySelector('.relative.min-h-screen')?.getBoundingClientRect()
    if (!containerRect) return
    
    const newX = ((e.clientX - containerRect.left - dragOffset.current.x) / containerRect.width) * 100
    const newY = e.clientY - containerRect.top - dragOffset.current.y
    
    setImages(prev => prev.map(img => 
      img.id === draggedImage 
        ? { ...img, currentX: Math.max(0, Math.min(85, newX)), currentY: Math.max(0, newY) }
        : img
    ))
  }, [draggedImage])

  const handleMouseUp = useCallback(() => {
    if (draggedImage !== null) {
      setImages(prev => prev.map(img => 
        img.id === draggedImage ? { ...img, isDragging: false } : img
      ))
      setDraggedImage(null)
    }
  }, [draggedImage])

  // Mouse event listeners
  useEffect(() => {
    if (draggedImage !== null) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [draggedImage, handleMouseMove, handleMouseUp])

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= 
          document.documentElement.offsetHeight - 1000) {
        loadMoreImages()
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
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
      
      {/* Floating Random Grid */}
      <div className="relative min-h-screen px-4 py-8">
        <div className="relative w-full" style={{ height: `${Math.max(1200, images.length * 160)}px` }}>
          {images.map((image) => {
            const currentX = image.currentX !== undefined ? image.currentX : image.randomX
            const currentY = image.currentY !== undefined ? image.currentY : image.randomY
            
            return (
              <div 
                key={image.id} 
                className={`absolute group cursor-grab transition-all duration-300 hover:z-50 select-none ${
                  image.isDragging 
                    ? 'z-50 cursor-grabbing scale-105' 
                    : 'animate-float hover:scale-105'
                }`}
                style={{
                  left: `${currentX}%`,
                  top: `${currentY}px`,
                  transform: `rotate(${image.randomRotation}deg) scale(${image.randomScale})`,
                  transformOrigin: 'center center',
                  animationDelay: image.isDragging ? 'none' : `${image.animationDelay}s`,
                  animationDuration: image.isDragging ? 'none' : `${3 + (image.id % 3)}s`,
                  animationPlayState: image.isDragging ? 'paused' : 'running',
                  '--rotation': `${image.randomRotation}deg`,
                  '--scale': `${image.randomScale}`,
                  transition: image.isDragging ? 'none' : 'all 0.3s ease'
                } as React.CSSProperties & { '--rotation': string; '--scale': string }}
                onMouseDown={(e) => handleMouseDown(e, image.id)}
              >
                <div className={`relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-500 ${
                  image.isDragging 
                    ? 'shadow-2xl scale-110 -translate-y-2' 
                    : 'hover:shadow-2xl group-hover:scale-110 group-hover:-translate-y-2'
                }`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="object-cover pointer-events-none"
                    loading="lazy"
                    style={{
                      width: `${224 * image.randomScale}px`,
                      height: `${149 * image.randomScale}px`
                    }}
                    draggable={false}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-300 ${
                    image.isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`} />
                  
                  {/* Floating glow effect */}
                  <div className={`absolute -inset-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-xl blur-lg transition-all duration-500 ${
                    image.isDragging ? 'opacity-40' : 'opacity-0 group-hover:opacity-30'
                  }`} />
                  
                  {/* Border effect */}
                  <div className={`absolute inset-0 rounded-xl border transition-colors duration-300 ${
                    image.isDragging ? 'border-white/60' : 'border-white/20 group-hover:border-white/40'
                  }`} />
                  
                  {/* Drag indicator */}
                  {image.isDragging && (
                    <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1">
                      <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
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