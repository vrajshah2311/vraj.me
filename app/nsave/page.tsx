'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

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

const NsaveCaseStudy = () => {
  return (
    <main className="bg-white relative overflow-auto">
      <div className="flex justify-center">
        <div className="w-full max-w-[600px]">
          {/* Header */}
          <div className="pt-[96px] pb-2">
            <div className="relative mb-12">
              <Link href="/" className="text-[13px] text-neutral-600 hover:text-black transition-colors inline-block">
                <span className="text-black">Home</span>
                <span className="mx-2">{'>'}</span>
                <span className="text-black">Work</span>
                <span className="mx-2">{'>'}</span>
                <span className="text-neutral-400">nsave</span>
                <span className="ml-0.5 inline-flex items-center" style={{ verticalAlign: 'middle' }}>
                  <CentralChevronGrabberVerticalFilledOffStroke2Radius2 className="w-4 h-4 text-neutral-400 pb-0.5" strokeWidth="3" />
                </span>
              </Link>
            </div>
            <h1 className="text-[18px] text-black mb-8" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>nsave</h1>
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
                Designed a comprehensive financial platform that enables safe saving, investing, and international transfers for users in high-inflation countries.
              </div>
              <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                A trustworthy, transparent interface showing investment accounts, international transfers with real-time conversions, and streamlined KYC processes.
              </div>
            </section>

            {/* Problem */}
            <section>
              <h2 className="text-[12px] text-neutral-400 mb-4" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Problem</h2>
              <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                In countries with unstable currencies and strict capital controls, people often can&apos;t safely save, invest, or send money abroad. Local banking systems are slow, expensive, and untrusted. nsave was created to fix that.
              </div>
            </section>

            {/* Role & Team */}
            <section>
              <h2 className="text-[12px] text-neutral-400 mb-4" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Role & Team</h2>
              <div className="space-y-4">
                <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  First and Only Designer
                </div>
                <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Solo designer working with CEO, engineers, and compliance team
                </div>
                <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Product UX, Brand design, User flows, Legal disclaimers, End-to-end experience design
                </div>
              </div>
            </section>

            {/* Approach */}
            <section>
              <h2 className="text-[12px] text-neutral-400 mb-4" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Approach</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-[15px] text-black mb-2" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>User Research</h3>
                  <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Interviewed users from Lebanon, Argentina, and Nigeria. Found universal frustrations: no trust in local banks, no visibility in transfers, and lots of hidden fees. Even simple things—like seeing funds reflected in USD—were major value props.
                  </div>
                </div>
                <div>
                  <h3 className="text-[15px] text-black mb-2" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Design & Development</h3>
                  <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Designed investment account flow with transparency, stability, and trust as key themes. Rebuilt international transfers UI with real-time conversions and expected delivery times. Redesigned onboarding/KYC flow into smaller, friction-reduced steps.
                  </div>
                </div>
                <div>
                  <h3 className="text-[15px] text-black mb-2" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Trust & Compliance</h3>
                  <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Built a clear, calm visual system using soft tones, familiar patterns, and intentionally boring (aka safe-feeling) interactions. Had to educate clearly since couldn&apos;t legally call it a &quot;savings&quot; product.
                  </div>
                </div>
              </div>
            </section>

            {/* Challenges */}
            <section>
              <h2 className="text-[12px] text-neutral-400 mb-4" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Challenges</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-[15px] text-black mb-2" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Building Trust in Fintech</h3>
                  <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    When designing for money, especially in volatile regions, trust is the product. Used soft tones, familiar patterns, and intentionally safe-feeling interactions to build confidence.
                  </div>
                </div>
                <div>
                  <h3 className="text-[15px] text-black mb-2" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Legal and Compliance Constraints</h3>
                  <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Legal and compliance constraints aren&apos;t blockers—they&apos;re design inputs. Had to educate clearly since couldn&apos;t legally call it a &quot;savings&quot; product, turning limitations into design opportunities.
                  </div>
                </div>
                <div>
                  <h3 className="text-[15px] text-black mb-2" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>KYC Completion Rates</h3>
                  <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Redesigned the onboarding/KYC flow into smaller, friction-reduced steps to improve completion rates. Small details like word choices or icon colors make or break confidence in fintech flows.
                  </div>
                </div>
              </div>
            </section>

            {/* Solution */}
            <section>
              <h2 className="text-[12px] text-neutral-400 mb-4" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Solution</h2>
              <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                nsave provides a full-stack financial product covering savings, investments, and transfers with complete transparency and trust. The platform offers real-time conversions, clear status tracking, and streamlined processes designed specifically for users in high-inflation countries.
              </div>
            </section>

            {/* Impact */}
            <section>
              <h2 className="text-[12px] text-neutral-400 mb-4" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Impact</h2>
              <div className="text-[15px] leading-[26px] text-black" style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
                We launched a full-stack financial product covering savings, investments, and transfers. KYC drop-off reduced significantly after the flow redesign. Support tickets around transfers dropped after improving status tracking. The investment product saw solid repeat usage, showing user trust. We started seeing word-of-mouth referrals—people were bringing friends and family onto the platform.
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

export default NsaveCaseStudy 