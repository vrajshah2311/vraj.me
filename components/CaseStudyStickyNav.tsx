'use client'

import { useEffect, useState } from 'react'
import Breadcrumb from './Breadcrumb'

export default function CaseStudyStickyNav({ current }: { current: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="case-study-sticky-nav">
      <div className="case-study-sticky-nav-inner">
        <Breadcrumb current={current} />
      </div>
    </div>
  )
}
