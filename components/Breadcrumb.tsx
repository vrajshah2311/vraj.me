'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CentralChevronGrabberVerticalFilledOffStroke2Radius1 } from './CentralChevronGrabberVerticalFilledOffStroke2Radius1'

const workPages = [
  { label: 'Peec AI', href: '/peec-ai' },
  { label: 'Hale', href: '/hale' },
  { label: 'Model ML', href: '/model-ml' },
  { label: 'Profound', href: '/profound' },
  { label: 'nsave', href: '/nsave' },
  { label: 'All work', href: '/all-work' },
]

interface BreadcrumbProps {
  current: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ current }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const navigateToHome = () => router.push('/')

  return (
    <div className="flex items-center gap-[6px] text-[13px]">
      <span className="case-study-breadcrumb-link cursor-pointer" onClick={navigateToHome}>Home</span>
      <span className="case-study-breadcrumb-separator">/</span>
      <span ref={ref} className="case-study-breadcrumb-current relative cursor-pointer" onClick={() => setIsOpen(s => !s)}>
        {current}
        <CentralChevronGrabberVerticalFilledOffStroke2Radius1 className="inline-block w-3 h-3 ml-1" style={{ color: 'rgba(10,10,10,0.4)' }} />
        <div
          className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-xl z-50 transition-all duration-200 ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'}`}
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)', border: '1px solid rgba(10,10,10,0.08)', padding: '4px' }}
        >
          <div className="flex items-center" style={{ height: '28px', paddingLeft: '8px', paddingRight: '8px' }}>
            <span className="text-[13px]" style={{ fontWeight: '600', color: '#0a0a0a' }}>{current}</span>
          </div>
          <div style={{ height: '1px', backgroundColor: 'rgba(10,10,10,0.06)', margin: '2px 0' }}></div>
          <div className="flex flex-col" style={{ gap: '2px' }}>
          {workPages.filter(p => p.label !== current).map(p => (
            <button
              key={p.href}
              className="w-full text-left rounded-lg text-[13px] flex items-center justify-between group"
              style={{ color: 'rgba(10,10,10,0.5)', fontWeight: '400', height: '28px', paddingLeft: '8px', paddingRight: '8px', transition: 'all 0.15s ease' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.color = '#0a0a0a'; el.style.fontWeight = '600'; el.style.background = 'rgba(10,10,10,0.05)'; const arr = el.querySelector('.arr') as HTMLElement; if(arr){ arr.style.opacity='1'; arr.style.transform='translateX(0)'; arr.style.color='#0a0a0a' } }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.color = 'rgba(10,10,10,0.5)'; el.style.fontWeight = '400'; el.style.background = 'transparent'; const arr = el.querySelector('.arr') as HTMLElement; if(arr){ arr.style.opacity='0'; arr.style.transform='translateX(-4px)'; arr.style.color='rgba(10,10,10,0.4)' } }}
              onClick={() => router.push(p.href)}
            >
              <span>{p.label}</span>
              <span className="arr" style={{ opacity: 0, transform: 'translateX(-4px)', transition: 'all 0.15s ease', fontSize: '11px', color: 'rgba(10,10,10,0.4)' }}>↗</span>
            </button>
          ))}
          </div>
        </div>
      </span>
    </div>
  )
}

export default Breadcrumb
