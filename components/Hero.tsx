'use client'

import { motion } from 'framer-motion'

const pStyle = { fontWeight: '500' as const, color: 'var(--text-bio)', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif', letterSpacing: '-0.02em' }

const Hero = () => {
  return (
    <section className="flex items-start justify-start relative">
      <div className="w-full text-left px-0">
        <div className="text-[17px] leading-[27px] flex flex-col gap-[12px]" style={pStyle}>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          >
            A designer living in Berlin. Born in Vadodara, India.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
          >
            For the past few years, I&apos;ve been designing end-to-end at YC and Sequoia-backed startups — across fintech, AI, and health. Shipping products used by real people, where clarity isn&apos;t a nice-to-have.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
          >
            I&apos;m drawn to 0→1 problems. The kind where there&apos;s no template, no precedent — just a blank canvas and a hard constraint.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
          >
            I grew up playing drums. Took it seriously enough to earn a master&apos;s degree. Music taught me that the best work — in any medium — has rhythm, restraint, and nothing wasted. That&apos;s still <a href="https://frisovandestadt.substack.com/p/the-founding-designer" target="_blank" rel="noopener noreferrer" className="bio-link">how I design</a>.
          </motion.p>
        </div>
      </div>
    </section>
  )
}

export default Hero
