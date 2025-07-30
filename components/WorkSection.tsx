'use client'

import { motion } from 'framer-motion'
import OpacityBox from './OpacityBox'

const WorkSection = () => {

  return (
    <section className="py-32 flex items-start justify-center">
      <div className="text-left w-[464px] px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
                        className="space-y-12"
        >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="space-y-12"
            >
              {/* Project Header */}
              <div className="flex items-center gap-3">
                {/* Project Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-heading-24 font-semibold text-white">Orimi</h3>
                  </div>
                  <p className="text-white/70 text-[16px]">
                    2024 - Now
                  </p>
                </div>
              </div>
              
              {/* Project Description */}
              <div className="text-white/70 text-[16px] leading-relaxed font-normal">
                <p>When I first went full time as a freelancer, I thought invoicing and payments would be the easy part. Turns out, they were the messiest. Every client had a different system. Some wanted hourly logs. Others needed contracts upfront. A few just ghosted after sending a brief. I found myself buried in spreadsheets, chasing down hours, rewriting invoices, and sending polite but pointed payment reminders. After too many late nights doing admin instead of actual work, I decided to fix it.</p>
                <p className="mt-4">That's how <span className="text-white font-semibold">Orimi</span> started.</p>
              </div>
              
              {/* Opacity Box */}
              <OpacityBox />
              
              {/* Text below the box */}
              <div className="mt-6 text-left">
                <p className="text-white/70 text-[16px] leading-relaxed font-normal">
                  This is a custom box with specific dimensions and opacity settings. 
                  The box demonstrates the use of fixed width and height properties 
                  while maintaining a subtle appearance with low opacity.
                </p>
              </div>
            </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default WorkSection 