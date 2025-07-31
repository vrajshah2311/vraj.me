'use client'

import { motion } from 'framer-motion'
import BouncyText from './BouncyText'

const Hero = () => {
  return (
    <section className="min-h-screen flex items-start justify-center" style={{ paddingTop: '120px' }}>
      <div className="text-left w-[600px] px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-8"
          >
            <BouncyText 
              text="Designer, dancer and DJ living in Dubai"
              className="text-heading-24 leading-tight font-semibold text-white/90"
              delay={0.05}
              staggerDelay={0.015}
            />
          </motion.div>

          {/* Body Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="space-y-6 text-[16px] text-white/60 leading-relaxed font-normal"
          >
            <div>
              <BouncyText 
                text="Designer, dancer and DJ living in Dubai. Born in Vadodara, India. For the past 4 years, I've been designing interfaces at Luma. Helping millions of guests and thousands of hosts."
                delay={0.4}
                staggerDelay={0.01}
              />
            </div>
            <div>
              <BouncyText 
                text="Primarily I like working on -1-0-1 projects. Previously I've worked with clients like Linktree, Whop, Ninja AI, Lancify."
                delay={0.6}
                staggerDelay={0.01}
              />
            </div>
            <div>
              <BouncyText 
                text="The neurodivergent mind loves blending styles, clashing genres, stitching together what shouldn't work but somehow does. It's all there in the work, the music I make, and my sets. Forever balancing the artist's urge and the designer's duty. Creating for the soul vs. designing for the world."
                delay={0.8}
                staggerDelay={0.008}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero 