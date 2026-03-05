'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRegisterScrollContainer } from '../components/ScrollContext'
import Hero from '../components/Hero'

const bioTextStyle = { fontWeight: '500' as const, color: 'var(--text-bio)', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif', letterSpacing: '-0.02em' }
const footerLinkStyle = { fontWeight: '500' as const, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif', letterSpacing: '-0.02em' }

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="footer-link text-[17px] leading-[27px]"
      style={footerLinkStyle}
    >
      {label}
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

  const [lastUpdated, setLastUpdated] = useState<string>("4 Mar'26")

  useEffect(() => {
    fetch('https://api.github.com/repos/vrajshah2311/vraj.me/commits/main')
      .then(res => res.json())
      .then(data => {
        const date = new Date(data?.commit?.committer?.date)
        if (!isNaN(date.getTime())) {
          const day = date.getDate()
          const month = date.toLocaleDateString('en-GB', { month: 'short' })
          const year = date.getFullYear().toString().slice(-2)
          setLastUpdated(`${day} ${month}'${year}`)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <main className="bio-links-group relative overflow-x-hidden" style={{ backgroundColor: '#fff' }}>
      <div className="flex justify-center min-h-screen">
        <div className="w-full max-w-[600px] px-5 sm:px-8 lg:px-[32px] relative overflow-visible flex flex-col">

          <motion.div className="pt-[148px]" {...fade(0)}>
            <div
              className="rounded-xl mb-4 inline-block overflow-hidden"
              style={{
                padding: '2px',
                border: '1.5px solid rgba(245, 48, 0, 0.9)',
                borderRadius: '14px',
                boxShadow: '0 10px 30px -8px rgba(200, 35, 0, 0.22), 0 4px 12px -4px rgba(200, 35, 0, 0.12)',
                transform: 'rotate(-1.5deg)',
                boxSizing: 'border-box',
              }}
            >
              <Image
                src="/images/avatars/profile.png"
                alt="Vraj Shah"
                width={88}
                height={75}
                className="rounded-xl"
                style={{ width: '88px', height: '75px', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
              />
            </div>
            <h1 className="text-[22px]" style={{ fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.1' }}>Vraj Shah</h1>
            <p className="text-[14px] mt-1" style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Updated on {lastUpdated}</p>
          </motion.div>

          <div style={{ marginTop: '20px' }}></div>
          <Hero />

          <motion.div style={{ marginTop: '20px' }} {...fade(0.35)}>
            <p
              className="text-[17px] leading-[27px]"
              style={{ fontWeight: '500', color: 'var(--text-bio)', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif', letterSpacing: '-0.02em' }}
            >
              I&apos;m currently rounding rectangles at <a href="/peec-ai" className="bio-link">Peec AI</a>, where I&apos;m mainly working on product. I&apos;ve also had the chance to work with great teams at <a href="/model-ml" className="bio-link">Model ML</a>, <a href="/profound" className="bio-link">Profound</a>, <a href="/nsave" className="bio-link">nsave</a>, and <a href="/hale" className="bio-link">Hale</a>—each one taught me something different.
            </p>
          </motion.div>

          <motion.div className="footer-links-group flex flex-wrap gap-x-4 gap-y-1 sm:gap-x-6" style={{ marginTop: '32px' }} {...fade(0.45)}>
            {[
              { label: 'Email', href: 'https://cal.com/vraj-shah/chat-with-vraj?user=vraj-shah&overlayCalendar=true&date=2025-08-12' },
              { label: 'Resume', href: '#' },
              { label: 'X', href: 'https://x.com/shahvraj99' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vraj-shah-375990199/' },
            ].map(({ label, href }) => (
              <FooterLink key={label} label={label} href={href} />
            ))}
          </motion.div>

          <div style={{ marginTop: '80px' }}></div>
        </div>
      </div>

      <motion.div className="fixed bottom-0 left-0 right-0" style={{ backgroundColor: '#fff' }} {...fade(0.45)}>
        <div className="flex justify-center">
          <div className="w-full max-w-[600px] px-5 sm:px-8 lg:px-[32px]">
            <div className="w-full h-px mb-4" style={{ backgroundColor: 'var(--border)' }}></div>
            <div className="pb-8 flex items-center justify-end">
              <p className="text-[13px] shrink-0" style={{ fontWeight: '500', color: 'var(--text-secondary)', fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace' }}>© 2026 Vraj</p>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  )
} 