'use client'

import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section className="min-h-screen flex items-start justify-center pt-32">
      <div className="text-left max-w-2xl px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-heading-24 mb-8 leading-tight font-semibold text-white"
          >
            Designer, dancer and DJ living in Dubai
          </motion.h1>

          {/* Body Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6 text-[16px] text-white/70 leading-relaxed font-normal"
          >
            <p>
              Designer, dancer and DJ living in Dubai. Born in Vadodara, India. For the past 4 years, I've been designing interfaces at Luma. Helping millions of guests and thousands of hosts.
            </p>
            <p>
              Primarily I like working on -1-0-1 projects. Previously I've worked with clients like Linktree, Whop, Ninja AI, Lancify.
            </p>
            <p>
              The neurodivergent mind loves blending styles, clashing genres, stitching together what shouldn't work but somehow does. It's all there in the work, the music I make, and my sets. Forever balancing the artist's urge and the designer's duty. Creating for the soul vs. designing for the world.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero 