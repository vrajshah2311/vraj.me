'use client'

import { motion } from 'framer-motion'

const ImageBox = ({ 
  width = 600, 
  height = 300, 
  opacity = 0.1,
  className = ""
}: {
  width?: number
  height?: number
  opacity?: number
  className?: string
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className={`bg-white/10 backdrop-blur-sm border border-white/5 rounded-lg ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        opacity: opacity
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white/30 text-sm">Project Image</div>
      </div>
    </motion.div>
  )
}

export default ImageBox 