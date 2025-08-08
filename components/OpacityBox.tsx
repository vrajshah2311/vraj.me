'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

type OpacityBoxProps = React.ComponentProps<typeof motion.div> & {
  children?: React.ReactNode
  className?: string
  imageSrc?: string
  imageAlt?: string
}

const OpacityBox: React.FC<OpacityBoxProps> = ({ children, className = '', imageSrc, imageAlt, ...rest }) => {
  const defaultMotionProps = {
    initial: { opacity: 1, y: 0 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px 0px -80px 0px', amount: 0.15 },
    transition: { duration: 0, ease: 'easeOut' },
  }

  return (
    <motion.div
      {...defaultMotionProps}
      {...rest}
      className={`${imageSrc ? '' : 'bg-black bg-opacity-5'} ${imageSrc ? 'p-0' : 'p-6'} ${className}`}
    >
      {imageSrc && (
        <div className="w-full h-full relative">
          <Image
            src={imageSrc}
            alt={imageAlt || 'Case study image'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => console.log('Image loaded:', imageSrc)}
            onError={(e) => console.error('Image error:', imageSrc, e)}
          />
        </div>
      )}
      {children}
    </motion.div>
  )
}

export default OpacityBox