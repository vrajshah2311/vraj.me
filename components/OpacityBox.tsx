'use client'

import { motion } from 'framer-motion'

interface OpacityBoxProps {
  width?: string
  height?: string
  opacity?: number
}

const OpacityBox = ({ 
  width = '840px', 
  height = '472.5px', 
  opacity = 0.03
}: OpacityBoxProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-8"
    >
      <div 
        className="border rounded-lg shadow-lg transition-all duration-2000 bg-white border-white/20"
        style={{
          width,
          height,
          display: 'block',
          boxSizing: 'border-box',
          opacity,
          minWidth: width,
          maxWidth: width,
          minHeight: height,
          maxHeight: height,
          flexShrink: 0,
          marginLeft: '-188px'
        }}
      >

      </div>
    </motion.div>
  )
}

export default OpacityBox 