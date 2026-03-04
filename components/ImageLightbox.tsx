'use client'

import React, { useEffect, useCallback } from 'react'
import Image from 'next/image'

interface ImageLightboxProps {
  images: string[]
  currentIndex: number
  onClose: () => void
  onNavigate?: (nextIndex: number) => void
  altPrefix?: string
}

export default function ImageLightbox({ images, currentIndex, onClose, onNavigate, altPrefix = 'Image' }: ImageLightboxProps) {
  const index = Math.max(0, Math.min(currentIndex, images.length - 1))
  const src = images[index]

  const goPrev = useCallback(() => {
    if (images.length <= 1 || !onNavigate) return
    const next = index <= 0 ? images.length - 1 : index - 1
    onNavigate(next)
  }, [index, images.length, onNavigate])

  const goNext = useCallback(() => {
    if (images.length <= 1 || !onNavigate) return
    const next = index >= images.length - 1 ? 0 : index + 1
    onNavigate(next)
  }, [index, images.length, onNavigate])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, goPrev, goNext])

  if (!src) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close button - top right */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white"
        aria-label="Close"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image - click doesn't close so user can click the dimmed background */}
      <div
        className="relative max-h-[calc(100vh-80px)] max-w-[calc(100vw-80px)]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={`${altPrefix} ${index + 1}`}
          width={1920}
          height={1080}
          className="max-h-[calc(100vh-80px)] w-auto max-w-[calc(100vw-80px)] object-contain rounded-lg"
          style={{ maxHeight: 'calc(100vh - 80px)' }}
        />
      </div>

      {/* Optional: show index for multiple images */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white/80">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  )
}
