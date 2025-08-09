'use client'

import { ReactNode } from "react"

interface ScrollCarouselProps {
  children: ReactNode
  className?: string
}

export default function ScrollCarousel({ children, className = '' }: ScrollCarouselProps) {
    return (
        <div className={`w-full overflow-x-auto ${className}`}>
            <div className="flex space-x-4 px-8" style={{ width: 'max-content' }}>
                {children}
            </div>
        </div>
    )
}