"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import CaseStudySection from "../../../components/CaseStudySection"
import CaseStudyContent from "../../../components/CaseStudyContent"

import CaseStudyHeading from "../../../components/CaseStudyHeading"
import CaseStudyText from "../../../components/CaseStudyText"
import CaseStudyLogo from "../../../components/CaseStudyLogo"

import ScrollProgress from "../../../components/ScrollProgress"
import ScrollCarousel from "../../../components/ScrollCarousel"

export default function NinjaWorkPage() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 100)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navigateToHome = () => router.push("/")
  const navigateToWork = () => {
    router.push("/")
    setTimeout(() => {
      const workSection = document.querySelector("#work-section")
      if (workSection) workSection.scrollIntoView({ behavior: "smooth" })
    }, 400)
  }

  return (
    <>
      <ScrollProgress height={2} />
      <main className="bg-white relative overflow-visible">
        {isScrolled && (
          <div className="case-study-sticky-nav">
            <div className="case-study-sticky-nav-inner">
              <div className="case-study-breadcrumb">
                <span className="case-study-breadcrumb-link" onClick={navigateToHome}>Home</span>
                <span className="case-study-breadcrumb-separator">{">"}</span>
                <span className="case-study-breadcrumb-link" onClick={navigateToWork}>Work</span>
                <span className="case-study-breadcrumb-separator">{">"}</span>
                <span className="case-study-breadcrumb-current">Ninja</span>
              </div>
            </div>
          </div>
        )}

        <CaseStudySection>
          <CaseStudyContent>
            <div className="pt-[80px] pb-2">
              <div className="case-study-header-nav">
                <div className="case-study-breadcrumb">
                  <span className="case-study-breadcrumb-link" onClick={navigateToHome}>Home</span>
                  <span className="case-study-breadcrumb-separator">{">"}</span>
                  <span className="case-study-breadcrumb-link" onClick={navigateToWork}>Work</span>
                  <span className="case-study-breadcrumb-separator">{">"}</span>
                  <span className="case-study-breadcrumb-current">Ninja</span>
                </div>
              </div>
              <CaseStudyLogo>
                <img src="/images/avatars/ninja.png" alt="Ninja" className="w-full h-full object-contain" />
              </CaseStudyLogo>
              <h1 className="case-study-title">Ninja</h1>
              <div>
                <CaseStudyHeading>Intro</CaseStudyHeading>
                <CaseStudyText>
                  A creative tool exploring AI text generation features and workflows with playful UI and motion. This case study highlights UI explorations and product surfaces.
                </CaseStudyText>
              </div>
            </div>
          </CaseStudyContent>
        </CaseStudySection>

        {/* Grid/Carousel of work images */}
        <CaseStudySection>
          <div className="case-study-image-breakout">
            <ScrollCarousel>
              {[
                "ni2.png","ni3.png","ni4.png","ni5.png","ni6.png","ni7.png","ni8.png","ni9.png","ni10.png","ni11.png","ni12.png","ni14.png","ni15.png","ni16.png","ni17.png","ni18.png"
              ].map((name) => (
                <div key={name} className="flex-shrink-0">
                  <div className="case-study-image-box">
                    <img src={`/images/case-studies/work/${name}`} alt={`Ninja ${name}`} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </ScrollCarousel>
          </div>
        </CaseStudySection>

        {/* Notes */}
        <CaseStudySection>
          <CaseStudyContent>
            <div>
              <CaseStudyHeading>Process Notes</CaseStudyHeading>
              <CaseStudyText>
                Focused on clarity and speed—tight motion, minimal chrome, legible type, and simple composition. Iterated quickly across states and surfaces to validate flows.
              </CaseStudyText>
            </div>
          </CaseStudyContent>
        </CaseStudySection>
      </main>
    </>
  )
}


