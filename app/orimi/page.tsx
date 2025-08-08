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

const OrimiCaseStudy = () => {
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
                <span className="text-neutral-400">Orimi</span>
                <span className="ml-0.5 inline-flex items-center" style={{ verticalAlign: 'middle' }}>
                  <CentralChevronGrabberVerticalFilledOffStroke2Radius2 className="w-4 h-4 text-neutral-400 pb-0.5" strokeWidth="3" />
                </span>
              </Link>
            </div>
            <h1 className="text-[18px] text-black mb-8" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Orimi</h1>
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