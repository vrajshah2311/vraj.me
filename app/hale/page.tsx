"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import ImageLightbox from "../../components/ImageLightbox"

const images = [
  '/images/case-studies/hale/hale-1.png',
  '/images/case-studies/hale/hale-2.png',
  '/images/case-studies/hale/hale-3.png',
  '/images/case-studies/hale/hale-4.png',
]

export default function HalePage() {
  const router = useRouter()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '-72px', top: '148px', width: '64px', height: '64px', borderRadius: '800px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={() => router.push('/')} className="back-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11.5303 7.46967C11.8232 7.76256 11.8232 8.23744 11.5303 8.53033L8.81066 11.25L17 11.25C17.4142 11.25 17.75 11.5858 17.75 12C17.75 12.4142 17.4142 12.75 17 12.75L8.81066 12.75L11.5303 15.4697C11.8232 15.7626 11.8232 16.2374 11.5303 16.5303C11.2374 16.8232 10.7626 16.8232 10.4697 16.5303L6.46967 12.5303C6.17678 12.2374 6.17678 11.7626 6.46967 11.4697L10.4697 7.46967C10.7626 7.17678 11.2374 7.17678 11.5303 7.46967Z" fill="currentColor"/></svg>
          </button>
        </div>
        <div style={{ paddingTop: '148px', paddingBottom: '20px' }}>
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
