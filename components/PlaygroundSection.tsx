'use client'

import { motion } from 'framer-motion'

const PlaygroundSection = () => {
  return (
    <section className="min-h-screen flex items-start justify-center" style={{ paddingTop: '120px' }}>
      <div className="text-left w-[600px] px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-heading-24 font-semibold text-white/90">Playground</h2>
            <p className="text-white/60 text-[16px] leading-relaxed font-normal mt-4">
              This is where I experiment with new ideas and technologies.
            </p>
          </div>

          {/* Coming Soon Tag */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-xs font-medium text-white/80">Coming Soon</span>
            </div>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          <div className="mt-8">
            <p className="text-white/40 text-sm leading-relaxed">
              I'm currently working on some exciting experiments. Check back soon for interactive demos, prototypes, and experimental projects.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PlaygroundSection 