'use client'

import { ReactNode } from "react"

interface ScrollCarouselProps {
  children: ReactNode
}

export default function ScrollCarousel({ children }: ScrollCarouselProps) {
    return (
        <div className="w-full overflow-x-auto">
            <div className="flex space-x-4 px-8" style={{ width: 'max-content' }}>
                {children}
            </div>
        </div>
    )
}