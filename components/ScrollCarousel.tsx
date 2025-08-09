'use client'

import {
    animate,
    motion,
    MotionValue,
    useMotionValue,
    useMotionValueEvent,
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
    const maskImage = useScrollOverflowMask(scrollXProgress)

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
            <motion.div 
                ref={ref} 
                className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-black/20 scrollbar-track-black/5"
                style={{ maskImage }}
            >
                <div className="flex space-x-4 px-8" style={{ width: 'max-content' }}>
                    {children}
                </div>
            </motion.div>
        </div>
    )
}

const left = `0%`
const right = `100%`
const leftInset = `20%`
const rightInset = `80%`
const transparent = `rgba(0,0,0,0)`
const opaque = `rgba(0,0,0,1)`

function useScrollOverflowMask(scrollXProgress: MotionValue<number>) {
    const maskImage = useMotionValue(
        `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
    )

    useMotionValueEvent(scrollXProgress, "change", (value) => {
        if (value === 0) {
            animate(
                maskImage,
                `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
            )
        } else if (value === 1) {
            animate(
                maskImage,
                `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`
            )
        } else if (
            scrollXProgress.getPrevious() === 0 ||
            scrollXProgress.getPrevious() === 1
        ) {
            animate(
                maskImage,
                `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`
            )
        }
    })

    return maskImage
}