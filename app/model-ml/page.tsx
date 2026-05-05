"use client"

import React, { useState } from "react"
import Image from "next/image"
import ImageLightbox from "../../components/ImageLightbox"
import Breadcrumb from "../../components/Breadcrumb"
import CaseStudyStickyNav from "../../components/CaseStudyStickyNav"

const images = [
  '/images/case-studies/model-ml/model-ml-1.png',
  '/images/case-studies/model-ml/model-ml-2.png',
  '/images/case-studies/model-ml/model-ml-3.png',
  '/images/case-studies/model-ml/model-ml-4.png',
  '/images/case-studies/model-ml/model-ml-5.png',
  '/images/case-studies/model-ml/model-ml-6.png',
  '/images/case-studies/model-ml/model-ml-7.png',
]

export default function ModelMLPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <CaseStudyStickyNav current="Model ML" />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px', position: 'relative' }}>
        <div style={{ paddingTop: '96px', paddingBottom: '20px' }}>
          <div className="mb-8"><Breadcrumb current="Model ML" /></div>
          <div style={{ width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src="/images/case-studies/model-ml/logo.svg" alt="Model ML" width={64} height={64} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '14px', lineHeight: 1.1, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>Model ML</h1>
        <p style={{ fontSize: '17px', lineHeight: 1.6, color: 'rgba(0,0,0,0.5)', marginBottom: '20px', maxWidth: '480px', fontWeight: 500, letterSpacing: '-0.02em', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>AI-powered digital teammates for finance. Model ML automates the most time-consuming workflows at the world's largest financial institutions — document analysis, meeting intelligence, IC memo writing, due diligence, and more.</p>
        <p style={{ fontSize: '17px', lineHeight: 1.6, color: 'rgba(0,0,0,0.5)', marginBottom: '20px', maxWidth: '480px', fontWeight: 500, letterSpacing: '-0.02em', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>A few screens were redesigned and a few flows built from scratch — across the core product experience.</p>


        <a href="https://www.modelml.com/" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ display: 'inline-block', fontSize: '17px', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: '27px', marginBottom: '52px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>
          View live site
        </a>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 20px 24px' }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>All work</h2>
      </div>
      <div style={{ padding: '0 32px 80px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, margin: '0 auto' }}>
        {images.map((src, i) => (
          <button key={i} type="button" onClick={() => setLightboxIndex(i)} style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#f5f5f5', cursor: 'pointer', borderRadius: 8, display: 'block', width: '100%', border: 'none', padding: 0 }}>
            <Image src={src} alt={`Model ML ${i + 1}`} width={600} height={375} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading={i < 9 ? 'eager' : 'lazy'} quality={90} />
          </button>
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={`locked-${i}`} style={{
            aspectRatio: '16/9', borderRadius: 8, background: '#f5f5f5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width={20} height={20} viewBox="0 0 20 20" fill="none" style={{ opacity: 0.3 }}>
              <rect x={4} y={9} width={12} height={9} rx={2} fill="currentColor" />
              <path d="M7 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && <ImageLightbox images={images} currentIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} altPrefix="Model ML" />}
    </main>
  )
}
