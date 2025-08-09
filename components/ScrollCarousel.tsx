'use client'

import {
    motion,
    useScroll,
} from "motion/react"
import { useRef, ReactNode } from "react"

interface ScrollCarouselProps {
  children: ReactNode
  className?: string
}

export default function ScrollCarousel({ children, className = '' }: ScrollCarouselProps) {
    const ref = useRef(null)
    const { scrollXProgress } = useScroll({ container: ref })

    return (
        <div className={`relative ${className}`}>
            <svg 
                className="absolute -top-16 -left-4 transform -rotate-90 z-10" 
                width="80" 
                height="80" 
                viewBox="0 0 100 100"
            >
                <circle 
                    cx="50" 
                    cy="50" 
                    r="30" 
                    pathLength="1" 
                    className="stroke-black/10"
                    strokeWidth="10"
                    fill="none"
                />
                <motion.circle
                    cx="50"
                    cy="50"
                    r="30"
                    pathLength="1"
                    className="stroke-black"
                    strokeWidth="10"
                    fill="none"
                    style={{ pathLength: scrollXProgress }}
                />
            </svg>
            <div 
                ref={ref} 
                className="w-full overflow-x-auto"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(0,0,0,0.2) rgba(0,0,0,0.05)'
                }}
            >
                <div className="flex space-x-4 px-8" style={{ width: 'max-content' }}>
                    {children}
                </div>
            </div>
        </div>
    )
}