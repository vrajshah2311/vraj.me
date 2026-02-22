'use client'

import { ReactNode } from "react"

interface ScrollCarouselProps {
  children: ReactNode
}

export default function ScrollCarousel({ children }: ScrollCarouselProps) {
    return (
        <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 px-5 sm:px-8 lg:px-[32px]" style={{ width: 'max-content' }}>
                {children}
            </div>
        </div>
    )
}