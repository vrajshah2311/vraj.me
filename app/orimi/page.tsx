'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface IconProps {
  className?: string;
  strokeWidth?: string;
}

function CentralChevronGrabberVerticalFilledOffStroke2Radius2(props: IconProps) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8 9.00009L11.2929 5.7072C11.6834 5.31668 12.3166 5.31668 12.7071 5.7072L16 9.00009" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 15L11.2929 18.2929C11.6834 18.6834 12.3166 18.6834 12.7071 18.2929L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const OrimiCaseStudy = () => {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHoverCardOpen, setIsHoverCardOpen] = useState(false)
  const hoverCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (hoverCardRef.current && !hoverCardRef.current.contains(event.target as Node)) {
        setIsHoverCardOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isHoverCardOpen])

  const toggleHoverCard = () => {
    setIsHoverCardOpen(!isHoverCardOpen)
  }

  const navigateToHome = () => {
    router.push('/')
  }

  const navigateToWork = () => {
    router.push('/')
    setTimeout(() => {
      const workSection = document.querySelector('#work-section')
      if (workSection) {
        workSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 500)
  }

  const switchCaseStudy = (caseStudy: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }
    setIsHoverCardOpen(false)
    // Navigate to the appropriate case study page
    if (caseStudy === 'profound') {
      router.push('/profound')
    } else if (caseStudy === 'nsave') {
      router.push('/nsave')
    }
    // orimi stays on current page
  }

  return (
    <main className="case-study-page">
      {/* Sticky Breadcrumbs */}
      {isScrolled && (
        <div className="case-study-sticky-nav">
          <div className="case-study-sticky-nav-inner">
            <div className="case-study-breadcrumb">
              <span className="case-study-breadcrumb-link" onClick={navigateToHome}>Home</span>
              <span className="case-study-breadcrumb-separator">{'>'}</span>
              <span className="case-study-breadcrumb-link" onClick={navigateToWork}>Work</span>
              <span className="case-study-breadcrumb-separator">{'>'}</span>
              <div className="relative inline-block" ref={hoverCardRef}>
                <span 
                  className="case-study-breadcrumb-current cursor-pointer hover:text-black transition-colors"
                  onClick={toggleHoverCard}
                >
                  Orimi
                </span>
                <span className="ml-0.5 inline-flex items-center" style={{ verticalAlign: 'middle' }}>
                  <CentralChevronGrabberVerticalFilledOffStroke2Radius2 className="w-4 h-4 text-neutral-400 pb-0.5" strokeWidth="3" />
                </span>
                
                {/* Hover Card */}
                {isHoverCardOpen && (
                  <div 
                    className="absolute top-full mt-0 left-0 bg-white border border-black/10 rounded-lg shadow-lg z-50"
                    style={{ minWidth: '160px' }}
                  >
                    <div className="py-1">
                      <div 
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between group h-8"
                        onClick={(e) => switchCaseStudy('profound', e)}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded flex items-center justify-center overflow-hidden">
                            <img src="/images/logos/isotype-dark.png" alt="Profound" className="w-full h-full object-contain" />
                          </div>
                          <span className="text-[11px] font-bold text-black">Profound</span>
                        </div>
                        <svg className="w-3 h-3 text-black opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div 
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between group h-8"
                        onClick={(e) => switchCaseStudy('nsave', e)}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded flex items-center justify-center overflow-hidden">
                            <img src="/images/logos/nsave-logo.webp" alt="nsave" className="w-full h-full object-contain" />
                          </div>
                          <span className="text-[11px] font-bold text-black">nsave</span>
                        </div>
                        <svg className="w-3 h-3 text-black opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div 
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between group h-8"
                        onClick={(e) => switchCaseStudy('orimi', e)}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded flex items-center justify-center overflow-hidden bg-black/5">
                            <span className="text-[8px] font-bold text-black">O</span>
                          </div>
                          <span className="text-[11px] font-bold text-black">Orimi</span>
                        </div>
                        <svg className="w-3 h-3 text-black stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="case-study-container">
        <div className="case-study-wrapper">
          {/* Header */}
          <div className="case-study-header">
            <div className="case-study-header-nav">
              <div className="case-study-breadcrumb">
                <span className="case-study-breadcrumb-link" onClick={navigateToHome}>Home</span>
                <span className="case-study-breadcrumb-separator">{'>'}</span>
                <span className="case-study-breadcrumb-link" onClick={navigateToWork}>Work</span>
                <span className="case-study-breadcrumb-separator">{'>'}</span>
                <div className="relative inline-block">
                  <span 
                    className="case-study-breadcrumb-current cursor-pointer hover:text-black transition-colors"
                    onClick={toggleHoverCard}
                  >
                    Orimi
                  </span>
                  <span className="ml-0.5 inline-flex items-center" style={{ verticalAlign: 'middle' }}>
                    <CentralChevronGrabberVerticalFilledOffStroke2Radius2 className="w-4 h-4 text-neutral-400 pb-0.5" strokeWidth="3" />
                  </span>
                </div>
              </div>
            </div>
            <h1 className="case-study-title">Orimi</h1>
          </div>

          {/* Case Study Content */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Intro */}
            <section>
              <h2 className="text-[12px] text-neutral-400 mb-4" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Intro</h2>
              <div className="text-[15px] leading-[26px] text-black mb-4" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                Designed a comprehensive freelancer productivity platform that streamlines project management, time tracking, and payment workflows.
              </div>
              <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                A clean, intuitive interface showing project calendar, client CRM, and automated invoicing in one unified flow.
              </div>
            </section>

            {/* Problem */}
            <section>
              <h2 className="text-[12px] text-neutral-400 mb-4" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Problem</h2>
              <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                Freelancers constantly juggle multiple clients, deadlines, and admin work—but most tools are either too rigid (like time trackers) or too chaotic (like Notion setups). There&apos;s no lightweight system that lets freelancers manage projects, track time, and handle payments in one flow.
              </div>
            </section>

            {/* Role & Team */}
            <section>
              <h2 className="text-[12px] text-neutral-400 mb-4" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Role & Team</h2>
              <div className="space-y-4">
                <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Founder & Lead Designer
                </div>
                <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Personal project with engineering collaborators
                </div>
                <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Problem discovery, UX flows, Interface design, Brand design, Product vision, MVP development oversight
                </div>
              </div>
            </section>

            {/* Approach */}
            <section>
              <h2 className="text-[12px] text-neutral-400 mb-4" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Approach</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-[15px] text-black mb-2" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Research & Discovery</h3>
                  <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Conducted interviews with 15+ freelancers across different domains—designers, devs, marketers—to validate pain points. Personal freelancing experience informed initial insights.
                  </div>
                </div>
                <div>
                  <h3 className="text-[15px] text-black mb-2" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Design & Development</h3>
                  <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Designed drag-and-drop project calendar, simple client CRM, automated invoicing with payment tracking, and lightweight AI assistant for follow-ups and reminders.
                  </div>
                </div>
                <div>
                  <h3 className="text-[15px] text-black mb-2" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>User Testing & Iteration</h3>
                  <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Prioritized workflows that feel natural—more like moving sticky notes than setting up Zapier automations. Focused on calm UI and quick setup with no steep learning curve.
                  </div>
                </div>
              </div>
            </section>

            {/* Challenges */}
            <section>
              <h2 className="text-[12px] text-neutral-400 mb-4" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Challenges</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-[15px] text-black mb-2" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Feature Complexity vs Simplicity</h3>
                  <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Most freelancers don&apos;t want more features—they want fewer, but smarter ones. Built something for myself which gave clarity on edge cases.
                  </div>
                </div>
                <div>
                  <h3 className="text-[15px] text-black mb-2" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>User Validation During Build</h3>
                  <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Talking to users while building is the best way to avoid overbuilding. Early user testing showed strong engagement and immediate adoption requests.
                  </div>
                </div>
                <div>
                  <h3 className="text-[15px] text-black mb-2" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Workflow Naturalness</h3>
                  <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Designed flows that feel intuitive rather than requiring complex setup. Focused on lightweight, smart features over feature-heavy complexity.
                  </div>
                </div>
              </div>
            </section>

            {/* Solution */}
            <section>
              <h2 className="text-[12px] text-neutral-400 mb-4" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Solution</h2>
              <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                Orimi provides a unified platform that handles the entire freelancer workflow—from project planning and time tracking to client management and automated invoicing. The system prioritizes natural workflows and smart automation over complex feature sets.
              </div>
            </section>

            {/* Impact */}
            <section>
              <h2 className="text-[12px] text-neutral-400 mb-4" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Impact</h2>
              <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                The product&apos;s still in early build, but early user testing showed strong engagement. Freelancers loved the calm UI and quick setup—no steep learning curve. Several testers asked to use it immediately for real client work.
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

export default OrimiCaseStudy 