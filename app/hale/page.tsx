"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"

import CaseStudyContent from "../../components/CaseStudyContent"
import CaseStudyTitleLink from "../../components/CaseStudyTitleLink"
import ScrollProgress from "../../components/ScrollProgress"
import Breadcrumb from "../../components/Breadcrumb"
import ImageLightbox from "../../components/ImageLightbox"

const images: string[] = [
  '/images/case-studies/hale/Hale-3.png',
  '/images/case-studies/hale/Hale-2.png',
  '/images/case-studies/hale/Hale-4.png',
  '/images/case-studies/hale/Hale-1.png',
]

export default function HalePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 100)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <ScrollProgress height={2} />
      <main className="relative overflow-visible" style={{ backgroundColor: 'var(--bg)' }}>
        {isScrolled && (
          <div className="case-study-sticky-nav">
            <div className="case-study-sticky-nav-inner">
              <Breadcrumb current="Hale" />
            </div>
          </div>
        )}

        <div className="pb-1">
          <CaseStudyContent>
            <div className="pt-[96px] pb-2">
              <div className="case-study-header-nav">
                <div className="mb-8"><Breadcrumb current="Hale" /></div>
              </div>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', overflow: 'hidden', marginBottom: '24px' }}>
                <img src="/images/case-studies/hale/logo.png" alt="Hale Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <CaseStudyTitleLink title="Hale" href="https://www.joinhale.com/" />
            </div>
          </CaseStudyContent>
        </div>

        <div className="px-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              className="aspect-video rounded-[8px] overflow-hidden relative w-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--link)]"
              style={{ border: '1px solid var(--border-cell)' }}
              onClick={() => setLightboxIndex(i)}
            >
              <Image src={src} alt={`Hale ${i + 1}`} width={400} height={225} className="w-full h-full object-cover block rounded-[8px]" loading={i === 0 ? 'eager' : 'lazy'} />
            </button>
          ))}
          {Array.from({ length: (4 - (images.length % 4)) % 4 }, (_, i) => (
            <div key={`empty-${i}`} className="aspect-video rounded-[8px] overflow-hidden relative" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border-cell)' }} aria-hidden />
          ))}
        </div>

        {lightboxIndex !== null && (
          <ImageLightbox
            images={images}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
            altPrefix="Hale"
          />
        )}
      </main>
    </>
  )
}
