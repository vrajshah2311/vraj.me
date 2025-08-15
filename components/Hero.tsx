'use client'

import { motion } from 'framer-motion'
import BouncyText from './BouncyText'

const Hero = () => {
  return (
    <section className="flex items-start justify-start relative">
              <div className="w-full max-w-[600px] text-left pt-2 px-0">
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
                text="Designer, instrumentalist, and vibe-coder. Born in India, now in London. Over the years, I've worked on products in SaaS, fintech, AI, and health tech both B2B and B2C. I'm into the details most people skip over: the perfect breakpoint, a form field that just feels right, a system that quietly scales. My work mixes clarity with complexity, pairing an artist's instinct with a designer's discipline."
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