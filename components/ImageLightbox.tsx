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

function isVideo(src: string) {
  return src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov')
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
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: '#fdfdfd' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Media lightbox"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-black/40 transition hover:bg-black/06 hover:text-black"
        aria-label="Close"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goPrev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full text-black/40 transition hover:bg-black/6 hover:text-black"
          aria-label="Previous"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goNext() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full text-black/40 transition hover:bg-black/6 hover:text-black"
          aria-label="Next"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Media */}
      <div
        className="relative max-h-[calc(100vh-80px)] max-w-[calc(100vw-80px)]"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo(src) ? (
          <video
            key={src}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            controls
            style={{ maxHeight: 'calc(100vh - 80px)', maxWidth: 'calc(100vw - 80px)', borderRadius: 8, display: 'block' }}
          />
        ) : (
          <Image
            src={src}
            alt={`${altPrefix} ${index + 1}`}
            width={1920}
            height={1080}
            className="max-h-[calc(100vh-80px)] w-auto max-w-[calc(100vw-80px)] object-contain rounded-lg"
            style={{ maxHeight: 'calc(100vh - 80px)' }}
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-sm" style={{ background: 'rgba(0,0,0,0.06)' }}>
          <span style={{ color: 'rgba(0,0,0,0.4)', fontSize: 13, fontWeight: 500 }}>{index + 1} / {images.length}</span>
        </div>
      )}
    </div>
  )
}
