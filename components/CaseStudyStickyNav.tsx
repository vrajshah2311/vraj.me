'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Breadcrumb from './Breadcrumb'

export default function CaseStudyStickyNav({ current }: { current: string }) {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="case-study-sticky-nav" style={{ opacity: 1, transform: 'none' }}>
      <div className="case-study-sticky-nav-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer',
              fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', gap: 4,
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            ← Back
          </button>
          {scrolled && (
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>|</span>
          )}
          {scrolled && <Breadcrumb current={current} />}
        </div>
      </div>
    </div>
  )
}
