'use client'

import { motion } from 'framer-motion'

const PlaygroundSection = () => {
  return (
    <section className="min-h-screen flex items-start justify-center" style={{ paddingTop: '120px' }}>
      <div className="text-left max-w-2xl px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-heading-24 font-semibold text-white">Playground</h2>
          <p className="text-white/70 text-[16px] leading-relaxed font-normal">
            This is where I experiment with new ideas and technologies. Coming soon...
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default PlaygroundSection 