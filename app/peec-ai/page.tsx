"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"

import CaseStudyContent from "../../components/CaseStudyContent"
import CaseStudyLogo from "../../components/CaseStudyLogo"
import CaseStudyTitleLink from "../../components/CaseStudyTitleLink"
import ScrollProgress from "../../components/ScrollProgress"
import Breadcrumb from "../../components/Breadcrumb"
import ImageLightbox from "../../components/ImageLightbox"

const images: string[] = [
  '/images/case-studies/peec-ai/Peec-Overview-1.png',
  '/images/case-studies/peec-ai/Peec-prompts-1.png',
  '/images/case-studies/peec-ai/Peec-prompts-2.png',
  '/images/case-studies/peec-ai/Peec-prompt-builder-1.png',
  '/images/case-studies/peec-ai/Peec-prompt-builder-2.png',
  '/images/case-studies/peec-ai/Peec-Actions-1.png',
  '/images/case-studies/peec-ai/Peec-Actions-2.png',
  '/images/case-studies/peec-ai/Peec-Actions-3.png',
  '/images/case-studies/peec-ai/Peec-Actions-4.png',
  '/images/case-studies/peec-ai/Peec-Matrix-1.png',
  '/images/case-studies/peec-ai/Peec-Onboarding-1.png',
  '/images/case-studies/peec-ai/Peec-Onboarding-2.png',
  '/images/case-studies/peec-ai/Peec-Onboarding-3.png',
  '/images/case-studies/peec-ai/Peec-date-picker-1.png',
  '/images/case-studies/peec-ai/Peec-table-1.png',
  '/images/case-studies/peec-ai/Peec-URL-details-1.png',
  '/images/case-studies/peec-ai/Peec-brands-1.png',
]

export default function PeecAIPage() {
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
              <Breadcrumb current="Peec AI" />
            </div>
          </div>
        )}

        <div className="pb-1">
          <CaseStudyContent>
            <div className="pt-[96px] pb-2">
              <div className="case-study-header-nav">
                <div className="mb-8"><Breadcrumb current="Peec AI" /></div>
              </div>
              <CaseStudyLogo>
                <img src="/images/logos/peec-ai-logo.png" alt="Peec AI Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </CaseStudyLogo>
              <CaseStudyTitleLink title="Peec AI" href="https://peec.ai" />
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
              <Image src={src} alt={`Peec AI ${i + 1}`} width={400} height={225} className="w-full h-full object-cover block rounded-[8px]" loading={i < 8 ? 'eager' : 'lazy'} quality={100} />
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
            altPrefix="Peec AI"
          />
        )}
      </main>
    </>
  )
}
