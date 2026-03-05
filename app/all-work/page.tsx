"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"

import CaseStudyContent from "../../components/CaseStudyContent"
import CaseStudyTitleLink from "../../components/CaseStudyTitleLink"
import ScrollProgress from "../../components/ScrollProgress"
import Breadcrumb from "../../components/Breadcrumb"
import ImageLightbox from "../../components/ImageLightbox"

const images: string[] = [
  '/images/case-studies/mn1.png',
  '/images/case-studies/exp1.png',
  '/images/case-studies/exp2.png',
  '/images/case-studies/exp3.png',
  '/images/case-studies/exp4.png',
  '/images/case-studies/exp5.png',
  '/images/case-studies/work/wh1.png',
  '/images/case-studies/work/el1.png',
  '/images/case-studies/work/co1.png',
  '/images/case-studies/work/co2.png',
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
  '/images/case-studies/profound/pem1.png',
  '/images/case-studies/profound/pem2.png',
  '/images/case-studies/profound/pem3.png',
  '/images/case-studies/profound/pem4.png',
  '/images/case-studies/profound/pem5.png',
  '/images/case-studies/profound/pem6.png',
  '/images/case-studies/ex1.png',
  '/images/case-studies/ln1.png',
  '/images/case-studies/ln2.png',
  '/images/case-studies/ln3.png',
  '/images/case-studies/work/ni2.png',
  '/images/case-studies/work/ni3.png',
  '/images/case-studies/work/ni4.png',
  '/images/case-studies/work/ni5.png',
  '/images/case-studies/work/ni6.png',
  '/images/case-studies/work/ni7.png',
  '/images/case-studies/work/ni8.png',
  '/images/case-studies/work/ni9.png',
  '/images/case-studies/work/ni10.png',
  '/images/case-studies/work/ni11.png',
  '/images/case-studies/work/ni12.png',
  '/images/case-studies/work/ni14.png',
  '/images/case-studies/work/ni15.png',
  '/images/case-studies/work/ni16.png',
  '/images/case-studies/work/ni17.png',
  '/images/case-studies/work/ni18.png',
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
