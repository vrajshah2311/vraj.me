'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import * as motion from 'motion/react-client'

// Source images for the Gallery (formerly Vault)
const baseImages: string[] = [
  '/images/case-studies/MN1.png', // MN1 always first
  'https://pbs.twimg.com/media/GrfyTa5XIAAVH1C?format=jpg&name=medium', // Twitter images
  'https://pbs.twimg.com/media/GoRjFbjWQAA3YYX?format=jpg&name=medium',
  'https://pbs.twimg.com/media/GoBUTPCWkAAephy?format=jpg&name=medium',
  'https://pbs.twimg.com/media/Gly9Mc2XAAAjzs4?format=jpg&name=4096x4096',
  'https://pbs.twimg.com/media/GsO_vhuWMAA5DYa?format=jpg&name=medium',
  'https://pbs.twimg.com/media/Gn-FtLlWcAANZkN?format=jpg&name=medium',
  'https://pbs.twimg.com/media/GspCFA9WQAALYSm?format=jpg&name=4096x4096',
  '/images/case-studies/Ex1.png', // Local image
  '/images/case-studies/LN1.png', // New local image
  '/images/case-studies/LN2.png', // New local image
  '/images/case-studies/LN3.png', // New local image
  '/images/case-studies/work/Ni2.png', // Ninja images grouped together
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

interface ImageItem {
  id: number
  src: string
  alt: string
  width: number
  height: number
  animationDelay: number
}

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

export default function GalleryPage() {
  const router = useRouter()
  const [images, setImages] = useState<ImageItem[]>([])
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const lastScrollTop = useRef(0)
  const [refreshKey, setRefreshKey] = useState(0) // Force refresh key

  // Prevent body scrolling when this page is open (match work page behavior)
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  // Load all images at once
  useEffect(() => {
    const initial = Array.from({ length: baseImages.length }, (_, i) => generateImage(i + 1))
    console.log('Loading images:', initial)
    console.log('Base images array:', baseImages)
    setImages(initial)
  }, [])

  const openModal = (image: ImageItem) => {
    setSelectedImage(image)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return
    
    const currentIndex = images.findIndex(img => img.id === selectedImage.id)
    if (currentIndex === -1) return
    
    let newIndex: number
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    } else {
      newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    }
    
    setSelectedImage(images[newIndex])
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return
      
      if (e.key === 'ArrowLeft') {
        navigateImage('prev')
      } else if (e.key === 'ArrowRight') {
        navigateImage('next')
      } else if (e.key === 'Escape') {
        closeModal()
      }
    }

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage, images])

  // Navbar show/hide on scroll of inner container
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current
      if (!container) return
      const { scrollTop } = container
      if (scrollTop > lastScrollTop.current && scrollTop > 100) {
        setIsNavbarVisible(false)
      } else if (scrollTop < lastScrollTop.current) {
        setIsNavbarVisible(true)
      }
      lastScrollTop.current = scrollTop
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="work-page-container bg-white flex flex-col">
      {/* Breadcrumb / Top bar */}
      <div
        className={`flex-shrink-0 z-50 h-[56px] transition-all duration-300 ease-in-out ${
          isNavbarVisible ? 'translate-y-0 bg-white' : '-translate-y-full bg-transparent'
        }`}
      >
        <div className="max-w-4xl mx-auto px-8 h-full flex items-center">
          <button
            onClick={() => router.push('/')}
            className={`inline-flex items-center transition-all duration-300 text-[12px] ${
              isNavbarVisible ? 'text-neutral-400 hover:text-black' : 'text-black hover:text-neutral-600'
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

      {/* Scrollable Grid Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.2) rgba(0,0,0,0.05)' }}
      >
        {images.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 p-8"
            style={{ minHeight: '100vh' }}
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(image)}
                style={{ width: '256px', height: '144px' }}
              >
                {image.src.startsWith('VIDEO:') ? (
                  <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="text-white text-center">
                      <div className="text-2xl mb-2">▶️</div>
                      <div className="text-sm">Context Video</div>
                    </div>
                  </div>
                ) : image.src.startsWith('http') ? (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="object-cover rounded-xl w-full h-full"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Failed to load external image in grid:', image.src)
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const fallback = document.createElement('div')
                      fallback.className = 'w-full h-full bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-center'
                      fallback.innerHTML = `
                        <div class="text-2xl mb-2">🖼️</div>
                        <div class="text-xs">Failed to load</div>
                      `
                      target.parentNode?.appendChild(fallback)
                    }}
                    onLoad={() => console.log('External image loaded in grid:', image.src)}
                  />
                ) : (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="object-cover rounded-xl"
                    loading="lazy"
                    style={{ width: '100%', height: '100%' }}
                    onError={(e) => {
                      console.error('Failed to load local image in grid:', image.src)
                      console.log('Attempted to load from:', image.src)
                    }}
                    onLoad={() => console.log('Local image loaded in grid:', image.src)}
                  />
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Images coming soon</h2>
              <p className="text-gray-500 text-sm">We're working on adding images for this gallery.</p>
            </div>
          </div>
        )}

        {/* Stats */}
        {images.length > 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">Showing {images.length} images</div>
        )}
      </div>

      {/* Full Screen Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-10">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-gray-500 text-lg hover:text-gray-700 z-10 bg-white bg-opacity-90 rounded-full w-6 h-6 flex items-center justify-center border border-gray-200 shadow-sm"
          >
            ✕
          </button>
          
          {/* Left Arrow */}
          <button
            onClick={() => navigateImage('prev')}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10 bg-white bg-opacity-90 rounded-full w-10 h-10 flex items-center justify-center border border-gray-200 shadow-sm"
          >
            ←
          </button>
          
          {/* Right Arrow */}
          <button
            onClick={() => navigateImage('next')}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10 bg-white bg-opacity-90 rounded-full w-10 h-10 flex items-center justify-center border border-gray-200 shadow-sm"
          >
            →
          </button>
          
          <div className="w-full h-full flex items-center justify-center">
            {(() => {
              console.log('Rendering modal for image:', selectedImage.src)
              
              if (selectedImage.src.startsWith('VIDEO:')) {
                return (
                  <div className="bg-white rounded-xl p-4 max-w-4xl max-h-full">
                    <iframe
                      src={selectedImage.src.replace('VIDEO:', '')}
                      width="560"
                      height="315"
                      frameBorder="0"
                      allowFullScreen
                      className="rounded-xl"
                    />
                  </div>
                )
              }
              
              if (selectedImage.src.startsWith('http')) {
                return (
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="max-w-full max-h-full object-contain"
                    style={{ maxWidth: 'calc(100vw - 80px)', maxHeight: 'calc(100vh - 80px)' }}
                    onError={(e) => {
                      console.error('External image failed in modal:', selectedImage.src)
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const fallback = document.createElement('div')
                      fallback.className = 'text-center text-gray-500'
                      fallback.innerHTML = `
                        <div class="text-6xl mb-4">🖼️</div>
                        <div class="text-xl">External image failed to load</div>
                        <div class="text-sm mt-2">${selectedImage.src}</div>
                      `
                      target.parentNode?.appendChild(fallback)
                    }}
                    onLoad={() => console.log('External image loaded in modal:', selectedImage.src)}
                  />
                )
              }
              
              // Local image
              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    fill
                    className="object-contain"
                    style={{ maxWidth: 'calc(100vw - 80px)', maxHeight: 'calc(100vh - 80px)' }}
                    quality={100}
                    onError={(e) => {
                      console.error('Local image failed in modal:', selectedImage.src)
                      console.log('Attempted to load from:', selectedImage.src)
                    }}
                    onLoad={() => console.log('Local image loaded in modal:', selectedImage.src)}
                  />
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}


