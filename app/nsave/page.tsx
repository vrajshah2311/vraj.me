'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import CaseStudySection from '../../components/CaseStudySection'
import CaseStudyContent from '../../components/CaseStudyContent'
import CaseStudyImage from '../../components/CaseStudyImage'

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

export default function NsavePage() {
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
    }
    // nsave stays on current page
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
                  nsave
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
          {/* Header & Intro */}
          <CaseStudySection>
            <CaseStudyContent>
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
                        nsave
                      </span>
                      <span className="ml-0.5 inline-flex items-center" style={{ verticalAlign: 'middle' }}>
                        <CentralChevronGrabberVerticalFilledOffStroke2Radius2 className="w-4 h-4 text-neutral-400 pb-0.5" strokeWidth="3" />
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="case-study-logo">
                  <img src="/images/logos/nsave-logo.webp" alt="nsave Logo" className="w-full h-full object-contain" />
                </div>
                
                <h1 className="case-study-title">nsave</h1>
                
                <div>
                  <div className="case-study-heading">Intro</div>
                  <div className="case-study-text mb-4">
                    Designed a comprehensive financial platform that enables safe saving, investing, and international transfers for users in high-inflation countries.
                  </div>
                  <div className="case-study-text">
                    A trustworthy, transparent interface showing investment accounts, international transfers with real-time conversions, and streamlined KYC processes.
                  </div>
                </div>
              </div>
            </CaseStudyContent>
          </CaseStudySection>

          {/* Problem */}
          <CaseStudySection>
            <CaseStudyContent>
              <div>
                <div className="case-study-heading">Problem</div>
                <div className="case-study-text">
                  In countries with unstable currencies and strict capital controls, people often can&apos;t safely save, invest, or send money abroad. Local banking systems are slow, expensive, and untrusted. nsave was created to fix that.
                </div>
              </div>
            </CaseStudyContent>
          </CaseStudySection>

          {/* Add nsave main interface image */}
          <CaseStudySection>
            <CaseStudyImage imageSrc="/images/case-studies/nsave/nsave1.png" imageAlt="nsave main dashboard interface" />
          </CaseStudySection>

          {/* Role & Team */}
          <CaseStudySection>
            <CaseStudyContent>
              <div>
                <div className="case-study-heading">Role & Team</div>
                <div className="case-study-text mb-4">First and Only Designer</div>
                <div className="case-study-text mb-4">Solo designer working with CEO, engineers, and compliance team</div>
                <div className="case-study-text">Product UX, Brand design, User flows, Legal disclaimers, End-to-end experience design</div>
              </div>
            </CaseStudyContent>
          </CaseStudySection>

          {/* Role & Team Images */}
          <CaseStudySection>
            <CaseStudyImage imageSrc="/images/case-studies/nsave/ns1.png" imageAlt="nsave mobile interface design" />
          </CaseStudySection>

          {/* Approach */}
          <CaseStudySection>
            <CaseStudyContent>
              <div>
                <div className="case-study-heading">Approach</div>
                <div>
                  <div className="case-study-subheading">User Research</div>
                  <div className="case-study-text">
                    Interviewed users from Lebanon, Argentina, and Nigeria. Found universal frustrations: no trust in local banks, no visibility in transfers, and lots of hidden fees. Even simple things—like seeing funds reflected in USD—were major value props.
                  </div>
                </div>
              </div>
            </CaseStudyContent>
          </CaseStudySection>

          {/* User Research - Horizontal Carousel */}
          <CaseStudySection>
            <div className="case-study-carousel">
              <div className="case-study-carousel-inner">
                <div className="case-study-carousel-item">
                  <CaseStudyImage imageSrc="/images/case-studies/nsave/ns2.png" imageAlt="User research insights - Investment flows" />
                </div>
                <div className="case-study-carousel-item">
                  <CaseStudyImage imageSrc="/images/case-studies/nsave/ns3.png" imageAlt="User research insights - Transfer interface" />
                </div>
                <div className="case-study-carousel-item">
                  <CaseStudyImage imageSrc="/images/case-studies/nsave/ns4.png" imageAlt="User research insights - Mobile experience" />
                </div>
                <div className="case-study-carousel-item">
                  <CaseStudyImage imageSrc="/images/case-studies/nsave/ns5.png" imageAlt="User research insights - KYC flow" />
                </div>
                <div className="case-study-carousel-item">
                  <CaseStudyImage imageSrc="/images/case-studies/nsave/ns7.png" imageAlt="User research insights - Analytics dashboard" />
                </div>
              </div>
            </div>
          </CaseStudySection>

          <CaseStudySection>
            <CaseStudyContent>
              <div>
                <div>
                  <div className="case-study-subheading">Design & Development</div>
                  <div className="case-study-text mb-4">
                    Designed investment account flow with transparency, stability, and trust as key themes. Rebuilt international transfers UI with real-time conversions and expected delivery times. Redesigned onboarding/KYC flow into smaller, friction-reduced steps.
                  </div>
                </div>
                <div>
                  <div className="case-study-subheading">Trust & Compliance</div>
                  <div className="case-study-text">
                    Built a clear, calm visual system using soft tones, familiar patterns, and intentionally boring (aka safe-feeling) interactions. Had to educate clearly since couldn&apos;t legally call it a &quot;savings&quot; product.
                  </div>
                </div>
              </div>
            </CaseStudyContent>
          </CaseStudySection>

          {/* Design & Development Images */}
          <CaseStudySection>
            <CaseStudyImage imageSrc="/images/case-studies/nsave/ns6.png" imageAlt="nsave dashboard interface design" />
          </CaseStudySection>

          <CaseStudySection>
            <CaseStudyImage imageSrc="/images/case-studies/nsave/ns8.png" imageAlt="nsave investment interface design" />
          </CaseStudySection>

          <CaseStudySection>
            <CaseStudyImage imageSrc="/images/case-studies/nsave/ns9.png" imageAlt="nsave transfer flow design" />
          </CaseStudySection>

          {/* Challenges */}
          <CaseStudySection>
            <CaseStudyContent>
              <div>
                <div className="case-study-heading">Challenges</div>
                <div>
                  <div className="case-study-subheading">Building Trust in Fintech</div>
                  <div className="case-study-text mb-4">
                    When designing for money, especially in volatile regions, trust is the product. Used soft tones, familiar patterns, and intentionally safe-feeling interactions to build confidence.
                  </div>
                </div>
                <div>
                  <div className="case-study-subheading">Legal and Compliance Constraints</div>
                  <div className="case-study-text mb-4">
                    Legal and compliance constraints aren&apos;t blockers—they&apos;re design inputs. Had to educate clearly since couldn&apos;t legally call it a &quot;savings&quot; product, turning limitations into design opportunities.
                  </div>
                </div>
                <div>
                  <div className="case-study-subheading">KYC Completion Rates</div>
                  <div className="case-study-text">
                    Redesigned the onboarding/KYC flow into smaller, friction-reduced steps to improve completion rates. Small details like word choices or icon colors make or break confidence in fintech flows.
                  </div>
                </div>
              </div>
            </CaseStudyContent>
          </CaseStudySection>

          {/* Challenges Images */}
          <CaseStudySection>
            <CaseStudyImage imageSrc="/images/case-studies/nsave/ns11.png" imageAlt="nsave compliance and security features" />
          </CaseStudySection>

          {/* Video After Challenges */}
          <CaseStudySection>
            <div className="case-study-image">
              <div className="case-study-image-box">
                <iframe 
                  src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7284884667403501569?compact=1" 
                  height="399" 
                  width="504" 
                  frameBorder="0" 
                  allowFullScreen 
                  title="nsave challenges and solutions - LinkedIn video"
                  className="w-full h-full rounded-lg"
                  style={{ minHeight: '399px' }}
                />
              </div>
            </div>
          </CaseStudySection>

          {/* Solution */}
          <CaseStudySection>
            <CaseStudyContent>
              <div>
                <div className="case-study-heading">Solution</div>
                <div className="case-study-text">
                  nsave provides a full-stack financial product covering savings, investments, and transfers with complete transparency and trust. The platform offers real-time conversions, clear status tracking, and streamlined processes designed specifically for users in high-inflation countries.
                </div>
              </div>
            </CaseStudyContent>
          </CaseStudySection>

          {/* Impact */}
          <CaseStudySection>
            <CaseStudyContent>
              <div>
                <div className="case-study-heading">Impact</div>
                <div className="case-study-text">
                  We launched a full-stack financial product covering savings, investments, and transfers. KYC drop-off reduced significantly after the flow redesign. Support tickets around transfers dropped after improving status tracking. The investment product saw solid repeat usage, showing user trust. We started seeing word-of-mouth referrals—people were bringing friends and family onto the platform.
                </div>
              </div>
            </CaseStudyContent>
          </CaseStudySection>

          {/* Impact Image */}
          <CaseStudySection>
            <CaseStudyImage imageSrc="/images/case-studies/nsave/ns10.png" imageAlt="nsave impact and success metrics" />
          </CaseStudySection>
        </div>
      </div>
    </main>
  )
} 