'use client'

import { motion, useSpring, useScroll } from "motion/react"

interface ScrollProgressProps {
  color?: string
  height?: number
}

export default function ScrollProgress({ 
  color = "#000000", 
  height = 2 
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      id="scroll-indicator"
      style={{
        scaleX,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: height,
        originX: 0,
        backgroundColor: color,
        zIndex: 9999,
      }}
    />
  )
}