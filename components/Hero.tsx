'use client'

import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section className="flex items-start justify-start relative">
      <div className="w-full text-left px-0">
        <div className="text-[19px] leading-[30px] flex flex-col gap-2" style={{ fontWeight: '400', color: 'rgba(10,10,10,0.64)', fontFamily: '"SuisseWorks", Georgia, serif', letterSpacing: '-0.02em' }}>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          >
            Founding Designer at Peec AI. I build products that make complex things feel simple. <a href="https://frisovandestadt.substack.com/p/the-founding-designer" target="_blank" rel="noopener noreferrer" className="bio-link">I care about how things work,</a> how they scale, and how they feel in the smallest moments. I&apos;ve built products at YC and Sequoia-backed startups across SaaS, fintech, AI, and healthtech for both B2B and B2C. My work is grounded in clarity, structure, and the quiet decisions that make something feel effortless.
          </motion.p>
        </div>
      </div>
    </section>
  )
}

export default Hero 