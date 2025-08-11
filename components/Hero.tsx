'use client'

import { motion } from 'framer-motion'
import BouncyText from './BouncyText'

const Hero = () => {
  return (
    <section className="flex items-start justify-start relative">
              <div className="w-full max-w-[600px] text-left pt-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px 0px -80px 0px', amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ height: 'auto', minHeight: 'auto', marginBottom: '0' }}
        >
          <div className="text-[15px] leading-[26px] text-black opacity-70" style={{ fontWeight: '400', fontFamily: 'Inter, system-ui, sans-serif', height: 'auto', minHeight: 'auto' }}>
            <div className="text-black">
              <BouncyText 
                text="Designer, instrumentalist, & a Vibe coder. Born & raised in India, Currently leaving in London, UK."
                className="text-black"
                delay={0.1}
                staggerDelay={0.015}
              />
              <BouncyText 
                text="Over the past few years, I've designed products across SaaS, fintech, AI, and healthtech i.e B2B & B2C spaces."
                className="text-black"
                delay={0.1}
                staggerDelay={0.015}
              />
              <BouncyText 
                text="I'm drawn to the quiet details most people miss — the perfect breakpoint, the form field that just works, the system that scales without fuss. My work blends clarity with complexity, the artist's instinct with the designer's discipline."
                className="text-black"
                delay={0.1}
                staggerDelay={0.015}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero 