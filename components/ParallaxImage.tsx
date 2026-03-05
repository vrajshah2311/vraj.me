"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxImageProps {
  src: string
  alt: string
  onClick: () => void
  eager?: boolean
}

export default function ParallaxImage({ src, alt, onClick, eager }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"])

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{ aspectRatio: '16/9', overflow: 'hidden', borderRadius: '8px', cursor: 'pointer', position: 'relative' }}
    >
      <motion.div style={{ y, width: '100%', height: '116%', position: 'absolute', top: '-8%', left: 0 }}>
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={900}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading={eager ? 'eager' : 'lazy'}
          quality={90}
        />
      </motion.div>
    </div>
  )
}
