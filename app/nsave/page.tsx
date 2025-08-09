'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import CaseStudyHeading from '../../components/CaseStudyHeading'
import CaseStudyText from '../../components/CaseStudyText'
import CaseStudySubheading from '../../components/CaseStudySubheading'
import CaseStudyLogo from '../../components/CaseStudyLogo'

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
    <main className="case-study-page" style={{ overflow: 'visible' }}>
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
          <div className="pt-[96px] pb-2">
            <div className="relative mb-12">
              <div className="text-[13px] text-neutral-600 inline-block" style={{ fontWeight: '600', fontVariationSettings: "'wght' 600" }}>
                <span className="text-black cursor-pointer hover:text-neutral-600 transition-colors" onClick={navigateToHome}>Home</span>
                <span className="mx-2">{'>'}</span>
                <span className="text-black cursor-pointer hover:text-neutral-600 transition-colors" onClick={navigateToWork}>Work</span>
                <span className="mx-2">{'>'}</span>
                <span className="text-neutral-400 relative group cursor-pointer hover-card-container" onClick={toggleHoverCard}>
                  nsave
                  {/* Hover Card */}
                  <div className={`absolute top-full left-0 mt-0 w-48 bg-white rounded-lg shadow-xl border border-black/10 p-1 transition-all duration-200 transform ${isHoverCardOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'}`}>
                    <div className="-space-y-0.5">
                      <div className="flex items-center space-x-2 p-1 rounded h-8 hover:bg-black/5 cursor-pointer transition-colors group/item" onClick={(e) => switchCaseStudy('profound', e)}>
                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                          <img src="/images/logos/isotype-dark.png" alt="Profound" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[12px] font-bold text-black flex-1">Profound</span>
                        <svg className="w-3 h-3 text-neutral-400 opacity-0 group-hover/item:opacity-100 group-hover/item:text-neutral-600 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-1 rounded h-8 transition-colors group/item">
                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                          <img src="/images/logos/nsave-logo.webp" alt="nsave" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[12px] font-bold text-black flex-1">nsave</span>
                        <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </span>
                <span className="ml-0.5 inline-flex items-center" style={{ verticalAlign: 'middle' }}>
                  <CentralChevronGrabberVerticalFilledOffStroke2Radius2 className="w-4 h-4 text-neutral-400 pb-0.5" strokeWidth="3" />
                </span>
              </div>
            </div>
            
            <CaseStudyLogo>
              <img src="/images/logos/nsave-logo.webp" alt="nsave Logo" className="w-full h-full object-contain" />
            </CaseStudyLogo>
            <h1 className="text-[18px] text-black mb-8" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>nsave</h1>
            
            {/* Intro */}
            <div className="case-study-section">
              <div className="case-study-content">
                <div className="case-study-content-inner">
                  <div>
                    <CaseStudyHeading>Intro</CaseStudyHeading>
                    <CaseStudyText className="mb-4">
                Designed a comprehensive financial platform that enables safe saving, investing, and international transfers for users in high-inflation countries.
                    </CaseStudyText>
                    <CaseStudyText>
                      A trustworthy, transparent interface showing investment accounts, international transfers with real-time conversions, and streamlined KYC processes.
                    </CaseStudyText>
                  </div>
                </div>
              </div>
            </div>

            {/* Intro Video */}
            <div className="case-study-section">
              <div className="case-study-image-breakout">
                <div className="case-study-image-box">
                  <iframe 
                    src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7287525248491536385?compact=1" 
                    height="399" 
                    width="504" 
                    frameBorder="0" 
                    allowFullScreen 
                    title="nsave comprehensive financial platform overview - LinkedIn video"
                    className="w-full h-full rounded-lg"
                    style={{ minHeight: '399px' }}
                  />
                </div>
              </div>
            </div>

            {/* Problem */}
            <div className="case-study-section">
              <div className="case-study-content">
                <div className="case-study-content-inner">
                  <div>
                    <CaseStudyHeading>Problem</CaseStudyHeading>
                    <CaseStudyText>
                      In countries with unstable currencies and strict capital controls, people often can&apos;t safely save, invest, or send money abroad. Local banking systems are slow, expensive, and untrusted. nsave was created to fix that.
                    </CaseStudyText>
                  </div>
                </div>
              </div>
            </div>

            {/* Role & Team */}
            <div className="case-study-section">
              <div className="case-study-content">
                <div className="case-study-content-inner">
                  <div>
                    <CaseStudyHeading>Role & Team</CaseStudyHeading>
                    <CaseStudyText className="mb-4">First and Only Designer</CaseStudyText>
                    <CaseStudyText className="mb-4">Solo designer working with CEO, engineers, and compliance team</CaseStudyText>
                    <CaseStudyText>Product UX, Brand design, User flows, Legal disclaimers, End-to-end experience design</CaseStudyText>
                  </div>
                </div>
              </div>
                </div>

            {/* Role & Team Images */}
            <div className="case-study-section">
              <div className="case-study-image-breakout">
                <div className="case-study-image-box">
                  <img 
                    src="/images/case-studies/nsave/ns1.png" 
                    alt="nsave mobile interface design"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Approach */}
            <div className="case-study-section">
              <div className="case-study-content">
                <div className="case-study-content-inner">
                  <div>
                    <CaseStudyHeading>Approach</CaseStudyHeading>
                <div>
                      <CaseStudySubheading>User Research</CaseStudySubheading>
                      <CaseStudyText>
                    Interviewed users from Lebanon, Argentina, and Nigeria. Found universal frustrations: no trust in local banks, no visibility in transfers, and lots of hidden fees. Even simple things—like seeing funds reflected in USD—were major value props.
                      </CaseStudyText>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Research - Horizontal Carousel */}
            <div className="case-study-section">
              <div className="case-study-image-breakout">
              <div className="w-full overflow-x-auto">
                <div className="flex space-x-4 px-8" style={{ width: 'max-content' }}>
                  <div className="flex-shrink-0">
                    <div className="case-study-image-box">
                      <img 
                        src="/images/case-studies/nsave/ns2.png" 
                        alt="User research insights - Investment flows"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="case-study-image-box">
                      <img 
                        src="/images/case-studies/nsave/ns3.png" 
                        alt="User research insights - Transfer interface"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="case-study-image-box">
                      <img 
                        src="/images/case-studies/nsave/ns4.png" 
                        alt="User research insights - Mobile experience"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="case-study-image-box">
                      <img 
                        src="/images/case-studies/nsave/ns5.png" 
                        alt="User research insights - KYC flow"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="case-study-image-box">
                      <img 
                        src="/images/case-studies/nsave/ns7.png" 
                        alt="User research insights - Analytics dashboard"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>

            <div className="case-study-section">
              <div className="case-study-content">
                <div className="case-study-content-inner">
                  <div>
                    <div>
                      <CaseStudySubheading>Design & Development</CaseStudySubheading>
                      <CaseStudyText className="mb-4">
                        Designed investment account flow with transparency, stability, and trust as key themes. Rebuilt international transfers UI with real-time conversions and expected delivery times. Redesigned onboarding/KYC flow into smaller, friction-reduced steps.
                      </CaseStudyText>
                </div>
                <div>
                      <CaseStudySubheading>Trust & Compliance</CaseStudySubheading>
                      <CaseStudyText>
                        Built a clear, calm visual system using soft tones, familiar patterns, and intentionally boring (aka safe-feeling) interactions. Had to educate clearly since couldn&apos;t legally call it a &quot;savings&quot; product.
                      </CaseStudyText>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Design & Development Images */}
            <div className="case-study-section">
              <div className="case-study-image-breakout">
                <div className="case-study-image-box">
                  <img 
                    src="/images/case-studies/nsave/ns6.png" 
                    alt="nsave dashboard interface design"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="case-study-section">
              <div className="case-study-image-breakout">
                <div className="case-study-image-box">
                  <img 
                    src="/images/case-studies/nsave/ns8.png" 
                    alt="nsave investment interface design"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="case-study-section">
              <div className="case-study-image-breakout">
                <div className="case-study-image-box">
                  <img 
                    src="/images/case-studies/nsave/ns9.png" 
                    alt="nsave transfer flow design"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Challenges */}
            <div className="case-study-section">
              <div className="case-study-content">
                <div className="case-study-content-inner">
                  <div>
                    <CaseStudyHeading>Challenges</CaseStudyHeading>
                <div>
                      <CaseStudySubheading>Building Trust in Fintech</CaseStudySubheading>
                      <CaseStudyText className="mb-4">
                    When designing for money, especially in volatile regions, trust is the product. Used soft tones, familiar patterns, and intentionally safe-feeling interactions to build confidence.
                      </CaseStudyText>
                    </div>
                    <div>
                      <CaseStudySubheading>Legal and Compliance Constraints</CaseStudySubheading>
                      <CaseStudyText className="mb-4">
                        Legal and compliance constraints aren&apos;t blockers—they&apos;re design inputs. Had to educate clearly since couldn&apos;t legally call it a &quot;savings&quot; product, turning limitations into design opportunities.
                      </CaseStudyText>
                    </div>
                    <div>
                      <CaseStudySubheading>KYC Completion Rates</CaseStudySubheading>
                      <CaseStudyText>
                        Redesigned the onboarding/KYC flow into smaller, friction-reduced steps to improve completion rates. Small details like word choices or icon colors make or break confidence in fintech flows.
                      </CaseStudyText>
                    </div>
                  </div>
                </div>
              </div>
                  </div>

            {/* Challenges Images */}
            <div className="case-study-section">
              <div className="case-study-image-breakout">
                <div className="case-study-image-box">
                  <img 
                    src="/images/case-studies/nsave/ns11.png" 
                    alt="nsave compliance and security features"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
                  </div>

            {/* Video After Challenges */}
            <div className="case-study-section">
              <div className="case-study-image-breakout">
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
            </div>

            {/* Solution */}
            <div className="case-study-section">
              <div className="case-study-content">
                <div className="case-study-content-inner">
                  <div>
                    <CaseStudyHeading>Solution</CaseStudyHeading>
                    <CaseStudyText>
                nsave provides a full-stack financial product covering savings, investments, and transfers with complete transparency and trust. The platform offers real-time conversions, clear status tracking, and streamlined processes designed specifically for users in high-inflation countries.
                    </CaseStudyText>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact */}
            <div className="case-study-section">
              <div className="case-study-content">
                <div className="case-study-content-inner">
                  <div>
                    <CaseStudyHeading>Impact</CaseStudyHeading>
                    <CaseStudyText>
                We launched a full-stack financial product covering savings, investments, and transfers. KYC drop-off reduced significantly after the flow redesign. Support tickets around transfers dropped after improving status tracking. The investment product saw solid repeat usage, showing user trust. We started seeing word-of-mouth referrals—people were bringing friends and family onto the platform.
                    </CaseStudyText>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Image */}
            <div className="case-study-section">
              <div className="case-study-image-breakout">
                <div className="case-study-image-box">
                  <img 
                    src="/images/case-studies/nsave/ns10.png" 
                    alt="nsave impact and success metrics"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}