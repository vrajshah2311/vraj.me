'use client'

import { motion } from 'framer-motion'
import BouncyText from './BouncyText'

const ResumeSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center" style={{ paddingTop: '120px' }}>
      <div className="text-center w-[600px] px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-12"
        >
          {/* Coming Soon with Animated Dots */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex items-center justify-center gap-1"
          >
            <span className="text-white/60 text-lg font-medium">Coming soon</span>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ResumeSection 