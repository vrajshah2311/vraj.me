'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import CaseStudySection from '../../components/CaseStudySection'
import CaseStudyContent from '../../components/CaseStudyContent'
import CaseStudyImage from '../../components/CaseStudyImage'
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

export default function ProfoundPage() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHoverCardOpen, setIsHoverCardOpen] = useState(false)
  const [currentCaseStudy, setCurrentCaseStudy] = useState('profound')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      // Close hover card if clicking outside of it
      if (isHoverCardOpen && !target.closest('.hover-card-container')) {
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
    // Wait for navigation to complete, then scroll
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
    setCurrentCaseStudy(caseStudy)
    setIsHoverCardOpen(false)
    // Scroll to top when switching case studies
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderCaseStudyContent = () => {
    switch (currentCaseStudy) {
      case 'nsave':
        return (
          <>
            <CaseStudyLogo>
              <img src="/nsave-logo.webp" alt="nsave Logo" className="w-full h-full object-contain" />
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

            {/* Problem Image */}
            <div className="case-study-section">
              <div className="case-study-image-breakout">
                <div className="case-study-image-box">
                  <img 
                    src="/nsave2.png" 
                    alt="nsave addressing financial challenges in unstable economies"
                    className="w-full h-full object-cover"
                  />
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
              <div className="space-y-2">
                <div className="case-study-image-breakout">
                  <div className="case-study-image-box">
                    <img 
                      src="/nsave2.png" 
                      alt="nsave mobile interface design"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="case-study-image-breakout">
                  <div className="case-study-image-box">
                    <img 
                      src="/nsave3.png" 
                      alt="nsave analytics and reporting dashboard"
                      className="w-full h-full object-cover"
                    />
                  </div>
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
                        src="/nsave2.png" 
                        alt="User research insights from Lebanon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="case-study-image-box">
                      <img 
                        src="/nsave3.png" 
                        alt="User research insights from Argentina"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="case-study-image-box">
                      <img 
                        src="/nsave4.png" 
                        alt="User research insights from Nigeria"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="case-study-image-box">
                      <img 
                        src="/nsave1.png" 
                        alt="User feedback analysis"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Design & Development */}
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

            {/* Design & Development Image */}
            <div className="case-study-section">
              <div className="case-study-image-breakout">
                <div className="case-study-image-box">
                  <img 
                    src="/nsave4.png" 
                    alt="nsave investment and transfer interface design"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Design & Development Video */}
            <div className="case-study-section">
              <div className="case-study-image-breakout">
                <div className="case-study-image-box">
                  <iframe 
                    src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7284884667403501569?compact=1" 
                    height="399" 
                    width="504" 
                    frameBorder="0" 
                    allowFullScreen 
                    title="nsave design and development process - LinkedIn video"
                    className="w-full h-full rounded-lg"
                    style={{ minHeight: '399px' }}
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

            {/* Challenges Image */}
            <div className="case-study-section">
              <div className="case-study-image-breakout">
                <div className="case-study-image-box">
                  <img 
                    src="/nsave3.png" 
                    alt="nsave KYC flow and trust-building interface"
                    className="w-full h-full object-cover"
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
          </>
        )
      case 'orimi':
        return (
          <>
            <div className="w-14 h-14 mb-6 bg-black/5 rounded-2xl flex items-center justify-center">
              <span className="text-lg font-bold text-black">O</span>
            </div>
            <h1 className="text-[18px] text-black mb-8" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Orimi</h1>
            <div>
              <CaseStudyHeading>Coming Soon</CaseStudyHeading>
              <CaseStudyText>
                The Orimi case study is currently being prepared. Check back soon for detailed insights into this brand and user experience project.
              </CaseStudyText>
            </div>
          </>
        )
      default: // profound
        return (
          <>
            <CaseStudyLogo>
              <img src="/isotype-dark.png" alt="Profound Logo" className="w-full h-full object-contain" />
            </CaseStudyLogo>
            <h1 className="text-[18px] text-black mb-8" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Profound</h1>
            {/* Profound content continues with all existing sections */}
          </>
        )
    }
  }

  return (
    <main className="bg-white relative overflow-visible">
      {/* Sticky Breadcrumbs */}
      {isScrolled && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/5">
          <div className="max-w-[600px] mx-auto py-4">
            <div className="text-[13px] text-neutral-600 inline-block" style={{ fontWeight: '600', fontVariationSettings: "'wght' 600" }}>
              <span className="text-black cursor-pointer hover:text-neutral-600 transition-colors" onClick={navigateToHome}>Home</span>
              <span className="mx-2">{'>'}</span>
              <span className="text-black cursor-pointer hover:text-neutral-600 transition-colors" onClick={navigateToWork}>Work</span>
              <span className="mx-2">{'>'}</span>
              <span className="text-neutral-400 relative group cursor-pointer hover-card-container" onClick={toggleHoverCard}>
                {currentCaseStudy === 'profound' ? 'Profound' : currentCaseStudy === 'nsave' ? 'nsave' : 'Orimi'}
                {/* Hover Card */}
                <div className={`absolute top-full left-0 mt-0 w-48 bg-white rounded-lg shadow-xl border border-black/10 p-1 transition-all duration-200 transform ${isHoverCardOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'}`}>
                  <div className="-space-y-0.5">
                    <div className={`flex items-center space-x-2 p-1 rounded h-8 ${currentCaseStudy === 'profound' ? '' : 'hover:bg-black/5 cursor-pointer'}`} onClick={currentCaseStudy !== 'profound' ? (e) => switchCaseStudy('profound', e) : undefined}>
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <img src="/isotype-dark.png" alt="Profound" className="w-5 h-5 object-contain" />
                      </div>
                      <span className="text-[12px] font-bold text-black flex-1">Profound</span>
                      {currentCaseStudy === 'profound' && (
                        <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    
                    <div className={`flex items-center space-x-2 p-1 rounded h-8 ${currentCaseStudy === 'nsave' ? '' : 'hover:bg-black/5 cursor-pointer'} transition-colors group/item`} onClick={currentCaseStudy !== 'nsave' ? (e) => switchCaseStudy('nsave', e) : undefined}>
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <img src="/nsave-logo.webp" alt="nsave" className="w-5 h-5 object-contain" />
                      </div>
                      <span className="text-[12px] font-bold text-black flex-1">nsave</span>
                      {currentCaseStudy === 'nsave' ? (
                        <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 text-neutral-400 opacity-0 group-hover/item:opacity-100 group-hover/item:text-neutral-600 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                    
                    <div className={`flex items-center space-x-2 p-1 rounded h-8 ${currentCaseStudy === 'orimi' ? '' : 'hover:bg-black/5 cursor-pointer'} transition-colors group/item`} onClick={currentCaseStudy !== 'orimi' ? (e) => switchCaseStudy('orimi', e) : undefined}>
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      </div>
                      <span className="text-[12px] font-bold text-black flex-1">Orimi</span>
                      {currentCaseStudy === 'orimi' ? (
                        <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 text-neutral-400 opacity-0 group-hover/item:opacity-100 group-hover/item:text-neutral-600 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </span>
              <span className="ml-0.5 inline-flex items-center" style={{ verticalAlign: 'middle' }}>
                <CentralChevronGrabberVerticalFilledOffStroke2Radius2 className="w-4 h-4 text-neutral-400 pb-0.5" strokeWidth="3" />
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Header & Intro */}
      <CaseStudySection>
        <CaseStudyContent>
          <div className="pt-[96px] pb-2">
            <div className="relative mb-12">
              <div className="text-[13px] text-neutral-600 inline-block" style={{ fontWeight: '600', fontVariationSettings: "'wght' 600" }}>
                <span className="text-black cursor-pointer hover:text-neutral-600 transition-colors" onClick={navigateToHome}>Home</span>
                <span className="mx-2">{'>'}</span>
                <span className="text-black cursor-pointer hover:text-neutral-600 transition-colors" onClick={navigateToWork}>Work</span>
                <span className="mx-2">{'>'}</span>
                <span className="text-neutral-400 relative group cursor-pointer hover-card-container" onClick={toggleHoverCard}>
                  {currentCaseStudy === 'profound' ? 'Profound' : currentCaseStudy === 'nsave' ? 'nsave' : 'Orimi'}
                  {/* Hover Card */}
                  <div className={`absolute top-full left-0 mt-0 w-48 bg-white rounded-lg shadow-xl border border-black/10 p-1 transition-all duration-200 transform ${isHoverCardOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'}`}>
                    <div className="-space-y-0.5">
                      <div className={`flex items-center space-x-2 p-1 rounded h-8 ${currentCaseStudy === 'profound' ? '' : 'hover:bg-black/5 cursor-pointer'}`} onClick={currentCaseStudy !== 'profound' ? (e) => switchCaseStudy('profound', e) : undefined}>
                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                          <img src="/isotype-dark.png" alt="Profound" className="w-3 h-3 object-contain" />
                        </div>
                        <span className="text-[12px] font-bold text-black flex-1">Profound</span>
                        {currentCaseStudy === 'profound' && (
                          <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      
                      <div className={`flex items-center space-x-2 p-1 rounded h-8 ${currentCaseStudy === 'nsave' ? '' : 'hover:bg-black/5 cursor-pointer'} transition-colors group/item`} onClick={currentCaseStudy !== 'nsave' ? (e) => switchCaseStudy('nsave', e) : undefined}>
                        <div className="w-5 h-5 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 border border-black/10">
                          <img src="/nsave-logo.webp" alt="nsave" className="w-4 h-4 object-contain" />
                        </div>
                        <span className="text-[12px] font-bold text-black flex-1">nsave</span>
                        {currentCaseStudy === 'nsave' ? (
                          <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-neutral-400 opacity-0 group-hover/item:opacity-100 group-hover/item:text-neutral-600 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                      
                      <div className={`flex items-center space-x-2 p-1 rounded h-8 ${currentCaseStudy === 'orimi' ? '' : 'hover:bg-black/5 cursor-pointer'} transition-colors group/item`} onClick={currentCaseStudy !== 'orimi' ? (e) => switchCaseStudy('orimi', e) : undefined}>
                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        </div>
                        <span className="text-[12px] font-bold text-black flex-1">Orimi</span>
                        {currentCaseStudy === 'orimi' ? (
                          <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-neutral-400 opacity-0 group-hover/item:opacity-100 group-hover/item:text-neutral-600 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </span>
                <span className="ml-0.5 inline-flex items-center" style={{ verticalAlign: 'middle' }}>
                  <CentralChevronGrabberVerticalFilledOffStroke2Radius2 className="w-4 h-4 text-neutral-400 pb-0.5" strokeWidth="3" />
                </span>
              </div>
            </div>
            {renderCaseStudyContent()}
          </div>

          {/* Conditional content based on current case study */}
          {currentCaseStudy === 'profound' && (
            <>
            {/* Intro */}
              <div>
                <CaseStudyHeading>Intro</CaseStudyHeading>
                <CaseStudyText>
                Transformed an early prototype into a polished B2B AI insights platform that helps marketers and researchers understand AI conversations.
                </CaseStudyText>
                <CaseStudyText>
                A hierarchical data explorer with bulk analysis tools and clean filtering systems for complex AI prompt data.
                </CaseStudyText>
              </div>
            </>
          )}
        </CaseStudyContent>
      </CaseStudySection>

      {/* Profound-specific content */}
      {currentCaseStudy === 'profound' && (
        <>
          {/* First Image - Pr1.png */}
      <CaseStudySection>
        <CaseStudyImage imageSrc="/pr1.png" imageAlt="Profound interface" isFirst={true} />
      </CaseStudySection>

      <CaseStudySection>
        <CaseStudyContent>
            {/* Problem */}
          <div>
            <CaseStudyHeading>Problem</CaseStudyHeading>
            <CaseStudyText>
                As more people turn to ChatGPT, Perplexity, and Copilot instead of Google, brands are losing visibility into what people are asking. Traditional SEO tools track keywords, not AI prompts. Profound wanted to fix that by surfacing actual conversations happening across AI.
            </CaseStudyText>
          </div>
        </CaseStudyContent>
      </CaseStudySection>

      {/* Platforms Image */}
      <CaseStudySection>
        <CaseStudyImage imageSrc="/platforms.png" imageAlt="Platforms interface" />
      </CaseStudySection>

      <CaseStudySection>
        <CaseStudyContent>
          {/* Role & Team */}
          <div>
            <CaseStudyHeading>Role & Team</CaseStudyHeading>
            <CaseStudyText>Product Design Contractor</CaseStudyText>
            <CaseStudyText>Solo designer working with engineers and founders</CaseStudyText>
            <CaseStudyText>UX flows, Visual system design, Figma components, Design system creation, Product polish</CaseStudyText>
              </div>
        </CaseStudyContent>
      </CaseStudySection>

      <CaseStudySection>
        <div className="space-y-2">
          <CaseStudyImage imageSrc="/pr2.png" imageAlt="Profound interface design" />
          <CaseStudyImage imageSrc="/pr5.png" imageAlt="Profound user experience flow" />
        </div>
      </CaseStudySection>

      <CaseStudySection>
        <CaseStudyContent>
          {/* Approach */}
          <div>
            <CaseStudyHeading>Approach</CaseStudyHeading>
            <div>
              <CaseStudySubheading>User Research</CaseStudySubheading>
              <CaseStudyText>
                Spoke to early adopters—growth teams, content strategists, and AI researchers. Found that users wanted clarity, not just data dumps—they needed to find trends, group prompts, and extract insights without being overwhelmed.
              </CaseStudyText>
      </div>
      
            {/* Horizontal Carousel/Parallax OpacityBoxes */}
      </div>
        </CaseStudyContent>
      </CaseStudySection>

      {/* User Research - Horizontal Carousel */}
      <CaseStudySection>
        <div className="w-full overflow-x-auto">
          <div className="flex space-x-4 px-8" style={{ width: 'max-content' }}>
            <div className="flex-shrink-0">
              <CaseStudyImage imageSrc="/pr3.png" imageAlt="User research insights" />
            </div>
            <div className="flex-shrink-0">
              <CaseStudyImage imageSrc="/pr6.png" imageAlt="User feedback analysis" />
                </div>
            <div className="flex-shrink-0">
              <CaseStudyImage imageSrc="/pr7.png" imageAlt="Research findings" />
                </div>
            <div className="flex-shrink-0">
              <CaseStudyImage imageSrc="/pr4.png" imageAlt="User journey mapping" />
                </div>
              </div>
        </div>
      </CaseStudySection>
      
      <CaseStudySection>
        <CaseStudyContent>
          <div>
            
                <div>
              <CaseStudySubheading>Design & Development</CaseStudySubheading>
              <CaseStudyText>
                    Designed hierarchical explorer to go from high-level topics to granular prompts, built bulk keyword analysis flow, redesigned date picker and filters, and created foundational design system for consistency.
              </CaseStudyText>
                </div>
                <div>
              <CaseStudySubheading>User Experience</CaseStudySubheading>
              <CaseStudyText>
                    Built all flows to feel lightweight and non-technical, even though the underlying data was complex. Focused on showing less data more meaningfully rather than overwhelming users.
              </CaseStudyText>
                  </div>
                </div>
        </CaseStudyContent>
      </CaseStudySection>

      <div className="case-study-section">
        <div className="case-study-image">
          <div className="case-study-image-box">
            <img 
              src="/p10.png" 
              alt="Design and development workflow"
              className="w-full h-full object-cover"
              style={{ maxWidth: 'none' }}
            />
              </div>
        </div>
      </div>
      
      <CaseStudySection>
        <CaseStudyContent>
            {/* Challenges */}
          <div>
            <CaseStudyHeading>Challenges</CaseStudyHeading>
                <div>
              <CaseStudySubheading>Data Complexity vs Clarity</CaseStudySubheading>
              <CaseStudyText>
                    Good design isn&apos;t just about surfacing more data—it&apos;s about showing less, more meaningfully. Working with messy data forced ruthless focus on clarity.
              </CaseStudyText>
                </div>
                <div>
              <CaseStudySubheading>Privacy Constraints</CaseStudySubheading>
              <CaseStudyText>
                    Constraints like privacy (can&apos;t always show raw prompts) can actually lead to better UX. Used these limitations as design inputs rather than blockers.
              </CaseStudyText>
                </div>
                <div>
              <CaseStudySubheading>Technical Data for Non-Technical Users</CaseStudySubheading>
              <CaseStudyText>
                    Created flows that feel lightweight and non-technical, even though the underlying data was complex. Focused on user-friendly interfaces for complex data analysis.
              </CaseStudyText>
                  </div>
                </div>
        </CaseStudyContent>
      </CaseStudySection>

      <CaseStudySection>
        <CaseStudyImage imageSrc="/p11.png" imageAlt="Challenges and solutions overview" />
      </CaseStudySection>

      <CaseStudySection>
        <CaseStudyContent>
            {/* Solution */}
          <div>
            <CaseStudyHeading>Solution</CaseStudyHeading>
            <CaseStudyText>
                Profound provides a comprehensive AI insights platform that transforms complex prompt data into actionable insights. The hierarchical explorer, bulk analysis tools, and clean filtering systems make AI conversation data accessible and useful for marketers and researchers.
            </CaseStudyText>
              </div>
        </CaseStudyContent>
      </CaseStudySection>

      <CaseStudySection>
        <CaseStudyContent>
            {/* Impact */}
          <div>
            <CaseStudyHeading>Impact</CaseStudyHeading>
            <CaseStudyText>
                We shipped a functional and beautiful v1 that supported early clients—mostly agencies—who started using it to guide content planning and product messaging. Internally, the design system unblocked engineering and helped the team build faster.
            </CaseStudyText>
              </div>
        </CaseStudyContent>
      </CaseStudySection>
        </>
      )}
    </main>
  )
}