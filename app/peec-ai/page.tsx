"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"

import CaseStudyContent from "../../components/CaseStudyContent"
import CaseStudyLogo from "../../components/CaseStudyLogo"
import CaseStudyTitleLink from "../../components/CaseStudyTitleLink"
import ScrollProgress from "../../components/ScrollProgress"
import Breadcrumb from "../../components/Breadcrumb"

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
  '/images/case-studies/peec-ai/Peec-URL-details-1.png',
  '/images/case-studies/peec-ai/Peec-brands-1.png',
]

export default function PeecAIPage() {
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
              <Breadcrumb current="Peec AI" />
            </div>
          </div>
        )}

        <div className="pb-1">
          <CaseStudyContent>
            <div className="pt-8 sm:pt-[32px] pb-2">
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

        {images.map((src, i) => (
          <div key={i} className="px-5 sm:px-8 lg:px-[32px]" style={{ marginBottom: '4px' }}>
            <Image src={src} alt={`Peec AI ${i + 1}`} width={1920} height={1080} className="w-full h-auto block rounded-lg sm:rounded-xl" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </main>
    </>
  )
}
