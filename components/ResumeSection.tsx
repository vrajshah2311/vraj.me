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
          {/* Header */}
          <div>
            <BouncyText 
              text="Experience"
              className="text-4xl font-bold text-white/90"
              delay={0.05}
              staggerDelay={0.015}
            />
          </div>

          {/* Creative Coming Soon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 px-8 py-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                  <span className="text-white/80 font-medium tracking-wide">Coming Soon</span>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ResumeSection 