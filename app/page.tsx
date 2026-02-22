'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRegisterScrollContainer } from '../components/ScrollContext'
import Hero from '../components/Hero'
import RecentEngagements from '../components/RecentEngagements'

function FooterLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover-trigger inline-flex items-baseline gap-1 text-[13px] transition-colors duration-200"
      style={{ fontWeight: '600', color: '#0a0a0a' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="hover-underline-animation">{label}</span>
      <span style={{ fontSize: '13px', fontWeight: '700', color: hovered ? '#0a0a0a' : 'rgba(10,10,10,0.25)', transition: 'color 0.2s ease', position: 'relative', top: '1px' }}>↗</span>
    </a>
  )
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay },
})

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  useRegisterScrollContainer(scrollContainerRef)

  const [lastUpdated, setLastUpdated] = useState<string>('19 July, 2025')

  useEffect(() => {
    fetch('https://api.github.com/repos/vrajshah2311/vraj.me/commits/main')
      .then(res => res.json())
      .then(data => {
        const date = new Date(data?.commit?.committer?.date)
        if (!isNaN(date.getTime())) {
          const formatted = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
          setLastUpdated(formatted)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <main ref={scrollContainerRef} className="bg-white relative overflow-y-auto overflow-x-hidden h-screen">
      <div className="flex justify-center min-h-screen">
        <div className="w-full max-w-[600px] px-5 sm:px-8 lg:px-[32px] relative overflow-visible flex flex-col">

          <motion.div className="pt-8 sm:pt-[32px]" {...fade(0)}>
            <Image
              src="/images/avatars/profile.png"
              alt="Vraj Shah"
              width={64}
              height={64}
              className="rounded-full mb-4"
              style={{ width: '64px', height: '64px', objectFit: 'cover', objectPosition: 'center top' }}
            />
            <h1 className="text-[20px]" style={{ fontWeight: '600', color: '#0a0a0a', letterSpacing: '-0.02em', lineHeight: '1.1' }}>Vraj Shah</h1>
            <p className="text-[13px] mt-1" style={{ fontWeight: '400', color: 'rgba(10,10,10,0.5)' }}>Last Update {lastUpdated}</p>
          </motion.div>

          <div style={{ marginTop: '20px' }}></div>
          <Hero />

          <div style={{ marginTop: '32px', height: '1px', backgroundColor: 'rgba(10,10,10,0.08)' }}></div>

          <motion.div style={{ marginTop: '32px' }} {...fade(0.35)}>
            <RecentEngagements />
          </motion.div>

          <div style={{ marginTop: '80px' }}></div>
        </div>
      </div>

      <motion.div className="fixed bottom-0 left-0 right-0 bg-white" {...fade(0.45)}>
        <div className="flex justify-center">
          <div className="w-full max-w-[600px] px-5 sm:px-8 lg:px-[32px]">
            <div className="w-full h-px mb-4" style={{ backgroundColor: 'rgba(10,10,10,0.08)' }}></div>
            <div className="pb-8 flex items-center justify-between">
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 sm:gap-x-6">
                {[
                  { label: 'Email', href: 'https://cal.com/vraj-shah/chat-with-vraj?user=vraj-shah&overlayCalendar=true&date=2025-08-12' },
                  { label: 'Resume', href: '#' },
                  { label: 'X', href: 'https://x.com/shahvraj99' },
                  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vraj-shah-375990199/' },
                ].map(({ label, href }) => (
                  <FooterLink key={label} label={label} href={href} />
                ))}
              </div>
              <p className="text-[13px] shrink-0" style={{ fontWeight: '400', color: 'rgba(10,10,10,0.5)', fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace' }}>© 2026 Vraj</p>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  )
} 