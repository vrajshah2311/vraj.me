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

export default function NsavePage() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
              <span className="text-neutral-400">nsave</span>
              <span className="ml-0.5 inline-flex items-center" style={{ verticalAlign: 'middle' }}>
                <CentralChevronGrabberVerticalFilledOffStroke2Radius2 className="w-4 h-4 text-neutral-400 pb-0.5" strokeWidth="3" />
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center overflow-visible">
        <div className="w-full max-w-[600px] overflow-visible">
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
                    <span className="text-neutral-400">nsave</span>
                    <span className="ml-0.5 inline-flex items-center" style={{ verticalAlign: 'middle' }}>
                      <CentralChevronGrabberVerticalFilledOffStroke2Radius2 className="w-4 h-4 text-neutral-400 pb-0.5" strokeWidth="3" />
                    </span>
                  </div>
                </div>
                
                <CaseStudyLogo>
                  <img src="/nsave-logo.webp" alt="nsave Logo" className="w-full h-full object-contain" />
                </CaseStudyLogo>
                
                <h1 className="text-[18px] text-black mb-8" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>nsave</h1>
                
                <div>
                  <CaseStudyHeading>Intro</CaseStudyHeading>
                  <CaseStudyText>
                    Designed a comprehensive financial platform that enables safe saving, investing, and international transfers for users in high-inflation countries.
                  </CaseStudyText>
                  <CaseStudyText>
                    A trustworthy, transparent interface showing investment accounts, international transfers with real-time conversions, and streamlined KYC processes.
                  </CaseStudyText>
                </div>
              </div>
            </CaseStudyContent>
          </CaseStudySection>

          {/* Problem */}
          <CaseStudySection>
            <CaseStudyContent>
              <div>
                <CaseStudyHeading>Problem</CaseStudyHeading>
                <CaseStudyText>
                  In countries with unstable currencies and strict capital controls, people often can&apos;t safely save, invest, or send money abroad. Local banking systems are slow, expensive, and untrusted. nsave was created to fix that.
                </CaseStudyText>
              </div>
            </CaseStudyContent>
          </CaseStudySection>

          {/* Add nsave main interface image */}
          <CaseStudySection>
            <CaseStudyImage imageSrc="/nsave1.png" imageAlt="nsave main dashboard interface" />
          </CaseStudySection>

          {/* Role & Team */}
          <CaseStudySection>
            <CaseStudyContent>
              <div>
                <CaseStudyHeading>Role & Team</CaseStudyHeading>
                <CaseStudyText>First and Only Designer</CaseStudyText>
                <CaseStudyText>Solo designer working with CEO, engineers, and compliance team</CaseStudyText>
                <CaseStudyText>Product UX, Brand design, User flows, Legal disclaimers, End-to-end experience design</CaseStudyText>
              </div>
            </CaseStudyContent>
          </CaseStudySection>

          {/* Role & Team Images */}
          <CaseStudySection>
            <div className="space-y-2">
              <CaseStudyImage imageSrc="/nsave2.png" imageAlt="nsave mobile interface design" />
              <CaseStudyImage imageSrc="/nsave3.png" imageAlt="nsave analytics and reporting dashboard" />
            </div>
          </CaseStudySection>

          {/* Approach */}
          <CaseStudySection>
            <CaseStudyContent>
              <div>
                <CaseStudyHeading>Approach</CaseStudyHeading>
                <div>
                  <CaseStudySubheading>User Research</CaseStudySubheading>
                  <CaseStudyText>
                    Interviewed users from Lebanon, Argentina, and Nigeria. Found universal frustrations: no trust in local banks, no visibility in transfers, and lots of hidden fees. Even simple things—like seeing funds reflected in USD—were major value props.
                  </CaseStudyText>
                </div>
              </div>
            </CaseStudyContent>
          </CaseStudySection>

          {/* User Research - Horizontal Carousel */}
          <CaseStudySection>
            <div className="-mx-8 overflow-x-auto">
              <div className="flex space-x-4 w-max">
                <CaseStudyImage imageSrc="/nsave2.png" imageAlt="User research insights from Lebanon" className="w-80 flex-shrink-0" />
                <CaseStudyImage imageSrc="/nsave3.png" imageAlt="User research insights from Argentina" className="w-80 flex-shrink-0" />
                <CaseStudyImage imageSrc="/nsave4.png" imageAlt="User research insights from Nigeria" className="w-80 flex-shrink-0" />
                <CaseStudyImage imageSrc="/nsave1.png" imageAlt="User feedback analysis" className="w-80 flex-shrink-0" />
              </div>
            </div>
          </CaseStudySection>

          <CaseStudySection>
            <CaseStudyContent>
              <div>
                <div>
                  <CaseStudySubheading>Design & Development</CaseStudySubheading>
                  <CaseStudyText>
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
            </CaseStudyContent>
          </CaseStudySection>

          {/* Design & Development Image */}
          <CaseStudySection>
            <CaseStudyImage imageSrc="/nsave4.png" imageAlt="nsave investment and transfer interface design" />
          </CaseStudySection>

          {/* Challenges */}
          <CaseStudySection>
            <CaseStudyContent>
              <div>
                <CaseStudyHeading>Challenges</CaseStudyHeading>
                <div>
                  <CaseStudySubheading>Building Trust in Fintech</CaseStudySubheading>
                  <CaseStudyText>
                    When designing for money, especially in volatile regions, trust is the product. Used soft tones, familiar patterns, and intentionally safe-feeling interactions to build confidence.
                  </CaseStudyText>
                </div>
                <div>
                  <CaseStudySubheading>Legal and Compliance Constraints</CaseStudySubheading>
                  <CaseStudyText>
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
            </CaseStudyContent>
          </CaseStudySection>

          {/* Challenges Image */}
          <CaseStudySection>
            <CaseStudyImage imageSrc="/nsave3.png" imageAlt="nsave KYC flow and trust-building interface" />
          </CaseStudySection>

          {/* Solution */}
          <CaseStudySection>
            <CaseStudyContent>
              <div>
                <CaseStudyHeading>Solution</CaseStudyHeading>
                <CaseStudyText>
                  nsave provides a full-stack financial product covering savings, investments, and transfers with complete transparency and trust. The platform offers real-time conversions, clear status tracking, and streamlined processes designed specifically for users in high-inflation countries.
                </CaseStudyText>
              </div>
            </CaseStudyContent>
          </CaseStudySection>

          {/* Impact */}
          <CaseStudySection>
            <CaseStudyContent>
              <div>
                <CaseStudyHeading>Impact</CaseStudyHeading>
                <CaseStudyText>
                  We launched a full-stack financial product covering savings, investments, and transfers. KYC drop-off reduced significantly after the flow redesign. Support tickets around transfers dropped after improving status tracking. The investment product saw solid repeat usage, showing user trust. We started seeing word-of-mouth referrals—people were bringing friends and family onto the platform.
                </CaseStudyText>
              </div>
            </CaseStudyContent>
          </CaseStudySection>
        </div>
      </div>
    </main>
  )
} 