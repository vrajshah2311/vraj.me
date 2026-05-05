"use client"

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import ImageLightbox from "@/components/ImageLightbox"
import Breadcrumb from "@/components/Breadcrumb"
import CaseStudyStickyNav from "@/components/CaseStudyStickyNav"

const images = [
  // Recent
  '/images/case-studies/peec-ai/peec-cmdk-1.png',
  '/images/case-studies/peec-ai/peec-cmdk-2.png',
  '/images/case-studies/peec-ai/peec-cmdk-3.png',
  '/images/case-studies/peec-ai/peec-map-1.png',
  '/images/case-studies/peec-ai/peec-brands-1.png',
  '/images/case-studies/peec-ai/peec-url-details-1.png',
  // Core
  '/images/case-studies/peec-ai/projects-cpp.png',
  '/images/case-studies/peec-ai/aa1.png',
  '/images/case-studies/peec-ai/peec-prompts-1.png',
  '/images/case-studies/peec-ai/peec-prompts-2.png',
  '/images/case-studies/peec-ai/peec-prompt-builder-1.png',
  '/images/case-studies/peec-ai/peec-prompt-builder-2.png',
  '/images/case-studies/peec-ai/peec-actions-1.png',
  '/images/case-studies/peec-ai/peec-actions-2.png',
  '/images/case-studies/peec-ai/peec-actions-3.png',
  '/images/case-studies/peec-ai/peec-actions-4.png',
  '/images/case-studies/peec-ai/peec-matrix-1.png',
  '/images/case-studies/peec-ai/peec-onboarding-1.png',
  '/images/case-studies/peec-ai/peec-onboarding-2.png',
  '/images/case-studies/peec-ai/peec-onboarding-3.png',
  '/images/case-studies/peec-ai/peec-date-picker-1.png',
  '/images/case-studies/peec-ai/peec-table-1.png',
]

function HeroVideo() {
  const [loaded, setLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onReady = () => setLoaded(true)
    v.addEventListener('loadeddata', onReady)
    if (v.readyState >= 2) setLoaded(true)
    return () => v.removeEventListener('loadeddata', onReady)
  }, [])

  return (
    <div style={{ padding: '0 32px 8px', margin: '0 auto', maxWidth: 1000 }}>
      <style>{`
        @keyframes skeletonShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 20, overflow: 'hidden', position: 'relative', background: '#f5f5f5', boxShadow: 'inset 0 0 0 0.5px oklch(0 0 0 / 0.2)' }}>
        {!loaded && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, oklch(0.96 0 0) 0%, oklch(0.92 0 0) 40%, oklch(0.96 0 0) 60%, oklch(0.96 0 0) 100%)',
            backgroundSize: '200% 100%',
            animation: 'skeletonShimmer 1.5s ease-in-out infinite',
          }} />
        )}
        <video
          ref={videoRef}
          src="/videos/peec-ai-product.mp4"
          autoPlay muted loop playsInline
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      </div>
    </div>
  )
}

export default function PeecAIPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <CaseStudyStickyNav current="Peec AI" />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ paddingTop: '96px', paddingBottom: '20px' }}>
          <div className="mb-8"><Breadcrumb current="Peec AI" /></div>
          <div style={{ width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src="/images/logos/peec-ai-logo.png" alt="Peec AI" width={64} height={64} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '14px', lineHeight: 1.1, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>Peec AI</h1>
        <p style={{ fontSize: '17px', lineHeight: 1.6, color: 'rgba(0,0,0,0.5)', marginBottom: '20px', maxWidth: '480px', fontWeight: 500, letterSpacing: '-0.02em', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>Designed the core product experience for Peec AI — an AI-powered marketing intelligence platform helping brands track, analyze, and optimize their presence across paid and organic channels.</p>


        <a href="https://peec.ai" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ display: 'inline-block', fontSize: '17px', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: '27px', marginBottom: '52px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>
          View live site
        </a>
      </div>

      {/* Hero video */}
      <HeroVideo />


      <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 20px 24px' }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>All work</h2>
      </div>

      <div style={{ padding: '0 32px 80px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, margin: '0 auto' }}>
        {images.map((src, i) => (
          <button key={i} type="button" onClick={() => setLightboxIndex(i)} style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#f5f5f5', cursor: 'pointer', borderRadius: 8, display: 'block', width: '100%', border: 'none', padding: 0 }}>
            <Image src={src} alt={`Peec AI ${i + 1}`} width={600} height={375} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading={i < 9 ? 'eager' : 'lazy'} quality={90} />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && <ImageLightbox images={images} currentIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} altPrefix="Peec AI" />}
    </main>
  )
}
