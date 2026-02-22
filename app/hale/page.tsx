"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"

import CaseStudyContent from "../../components/CaseStudyContent"
import CaseStudyTitleLink from "../../components/CaseStudyTitleLink"
import ScrollProgress from "../../components/ScrollProgress"
import Breadcrumb from "../../components/Breadcrumb"

const images: string[] = [
  '/images/case-studies/hale/Hale-3.png',
  '/images/case-studies/hale/Hale-2.png',
  '/images/case-studies/hale/Hale-4.png',
  '/images/case-studies/hale/Hale-1.png',
]

export default function HalePage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 100)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <ScrollProgress color="#000000" height={2} />
      <main className="bg-white relative overflow-visible">
        {isScrolled && (
          <div className="case-study-sticky-nav">
            <div className="case-study-sticky-nav-inner">
              <Breadcrumb current="Hale" />
            </div>
          </div>
        )}

        <div className="pb-1">
          <CaseStudyContent>
            <div className="pt-8 sm:pt-[32px] pb-2">
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

        {images.map((src, i) => (
          <div key={i} className="px-5 sm:px-8 lg:px-[32px]" style={{ marginBottom: '4px' }}>
            <Image src={src} alt={`Hale ${i + 1}`} width={1920} height={1080} className="w-full h-auto block rounded-lg sm:rounded-xl" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </main>
    </>
  )
}
