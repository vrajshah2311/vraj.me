'use client'

import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section className="flex items-start justify-start relative">
      <div className="w-full text-left px-0">
        <div className="text-[17px] leading-[27px] flex flex-col gap-2" style={{ fontWeight: '500', color: 'var(--text-bio)', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif', letterSpacing: '-0.02em' }}>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          >
            I design products that <a href="https://frisovandestadt.substack.com/p/the-founding-designer" target="_blank" rel="noopener noreferrer" className="bio-link">make complex things feel simple</a>. I&apos;ve shipped end-to-end at YC and Sequoia-backed startups — across fintech, AI, and health — where clarity and craft are non-negotiable.
          </motion.p>
        </div>
      </div>
    </section>
  )
}

export default Hero 