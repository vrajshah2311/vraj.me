"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"

import CaseStudyContent from "../../components/CaseStudyContent"
import CaseStudyTitleLink from "../../components/CaseStudyTitleLink"
import ScrollProgress from "../../components/ScrollProgress"
import Breadcrumb from "../../components/Breadcrumb"
import ImageLightbox from "../../components/ImageLightbox"

const images: string[] = [
  '/images/case-studies/MN1.png',
  '/images/case-studies/Exp1.png',
  '/images/case-studies/Exp2.png',
  '/images/case-studies/Exp3.png',
  '/images/case-studies/Exp4.png',
  '/images/case-studies/Exp5.png',
  '/images/case-studies/work/Wh1.png',
  '/images/case-studies/work/El1.png',
  '/images/case-studies/work/Co1.png',
  '/images/case-studies/work/Co2.png',
  '/images/case-studies/nsave/ns1.png',
  '/images/case-studies/nsave/ns2.png',
  '/images/case-studies/nsave/ns3.png',
  '/images/case-studies/nsave/ns4.png',
  '/images/case-studies/nsave/ns5.png',
  '/images/case-studies/nsave/ns6.png',
  '/images/case-studies/nsave/ns7.png',
  '/images/case-studies/nsave/ns8.png',
  '/images/case-studies/nsave/ns9.png',
  '/images/case-studies/nsave/ns10.png',
  '/images/case-studies/nsave/ns11.png',
  '/images/case-studies/profound/pr1.png',
  '/images/case-studies/profound/pr2.png',
  '/images/case-studies/profound/pr3.png',
  '/images/case-studies/profound/pr4.png',
  '/images/case-studies/profound/pr5.png',
  '/images/case-studies/profound/pr6.png',
  '/images/case-studies/profound/pr7.png',
  '/images/case-studies/profound/PEM1.png',
  '/images/case-studies/profound/PEM2.png',
  '/images/case-studies/profound/PEM3.png',
  '/images/case-studies/profound/PEM4.png',
  '/images/case-studies/profound/PEM5.png',
  '/images/case-studies/profound/PEM6.png',
  '/images/case-studies/Ex1.png',
  '/images/case-studies/LN1.png',
  '/images/case-studies/LN2.png',
  '/images/case-studies/LN3.png',
  '/images/case-studies/work/Ni2.png',
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
  '/images/case-studies/work/Ni14.png',
  '/images/case-studies/work/Ni15.png',
  '/images/case-studies/work/Ni16.png',
  '/images/case-studies/work/Ni17.png',
  '/images/case-studies/work/Ni18.png',
]

export default function AllWorkPage() {
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
              <Breadcrumb current="All work" />
            </div>
          </div>
        )}

        <div className="pb-1">
          <CaseStudyContent>
            <div className="pt-[96px] pb-2">
              <div className="case-study-header-nav">
                <div className="mb-8"><Breadcrumb current="All work" /></div>
              </div>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'var(--border-light)', marginBottom: '24px' }}></div>
              <CaseStudyTitleLink title="All work" />
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
              <Image src={src} alt={`All work ${i + 1}`} width={400} height={225} className="w-full h-full object-cover block rounded-[8px]" loading={i < 8 ? 'eager' : 'lazy'} />
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
            altPrefix="All work"
          />
        )}
      </main>
    </>
  )
}
