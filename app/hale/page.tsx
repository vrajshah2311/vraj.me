"use client"

import React, { useState } from "react"
import Image from "next/image"
import ImageLightbox from "../../components/ImageLightbox"
import Breadcrumb from "../../components/Breadcrumb"
import CaseStudyStickyNav from "../../components/CaseStudyStickyNav"

const images = [
  '/images/case-studies/hale/hale-1.png',
  '/images/case-studies/hale/hale-2.png',
  '/images/case-studies/hale/hale-3.png',
  '/images/case-studies/hale/hale-4.png',
]

export default function HalePage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <CaseStudyStickyNav current="Hale" />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px', position: 'relative' }}>
        <div style={{ paddingTop: '96px', paddingBottom: '20px' }}>
          <div className="mb-8"><Breadcrumb current="Hale" /></div>
          <div style={{ width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src="/images/case-studies/hale/logo.png" alt="Hale" width={64} height={64} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '14px', lineHeight: 1.1, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>Hale</h1>
        <p style={{ fontSize: '17px', lineHeight: 1.6, color: 'rgba(0,0,0,0.5)', marginBottom: '20px', maxWidth: '480px', fontWeight: 500, letterSpacing: '-0.02em', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>Designed the end-to-end product experience for Hale — a health and wellness platform helping people build sustainable habits through personalized coaching and community support.</p>


        <a href="https://www.joinhale.com/" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ display: 'inline-block', fontSize: '17px', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: '27px', marginBottom: '52px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif' }}>
          View live site
        </a>
      </div>

      <div style={{ padding: '0 24px 80px', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '1200px', margin: '0 auto' }}>
        {images.map((src, i) => (
          <button key={i} type="button" onClick={() => setLightboxIndex(i)} style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#fff', cursor: 'pointer', borderRadius: '8px', display: 'block', width: '100%', border: 'none', padding: 0 }}>
            <Image src={src} alt={`Hale ${i + 1}`} width={1000} height={563} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="eager" quality={90} />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && <ImageLightbox images={images} currentIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} altPrefix="Hale" />}
    </main>
  )
}
