'use client'

import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section className="flex items-start justify-start relative">
      <div className="w-full text-left px-0">
        <div className="text-[15px] leading-[22px] flex flex-col gap-2" style={{ fontWeight: '400', color: 'rgba(10,10,10,0.64)' }}>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          >
            A product designer based in Berlin. I build products that make complex things feel simple. I care about how things work, how they scale, and how they feel in the smallest moments. I&apos;ve built products across SaaS, fintech, AI, and healthtech for both B2B and B2C. My work is grounded in clarity, structure, and the quiet decisions that make something feel effortless.
          </motion.p>
        </div>
      </div>
    </section>
  )
}

export default Hero 