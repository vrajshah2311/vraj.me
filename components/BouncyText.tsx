'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface BouncyTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
  delay?: number
  staggerDelay?: number
  onComplete?: () => void
}

const BouncyText = ({ 
  text, 
  className = "", 
  style,
  delay = 0, 
  staggerDelay = 0.05,
  onComplete 
}: BouncyTextProps) => {
  const [words, setWords] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setWords(text.split(' '))
  }, [text])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay * 1000)
    
    return () => clearTimeout(timer)
  }, [delay])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0
      }
    }
  }

  const wordVariants = {
            hidden: { 
          opacity: 0,
          y: 2,
          scale: 0.995,
          filter: "blur(4px)"
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 30,
            duration: 0.3
          }
        }
  }

  return (
    <motion.div
      className={`inline ${className}`}
      style={style}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      onAnimationComplete={() => {
        if (onComplete) onComplete()
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          className={`inline-block mr-1 ${className}`}
          style={style}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

export default BouncyText 