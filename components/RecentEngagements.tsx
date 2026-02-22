'use client'

import React, { useState } from 'react'

const engagements = [
  { company: 'Peec AI', year: '2026', href: '/peec-ai' },
  { company: 'Hale', year: '2025', href: '/hale' },
  { company: 'Model ML', year: '2025', href: '/model-ml' },
  { company: 'Profound', year: '2025', href: '/profound' },
  { company: 'Context AI', year: '2024', href: 'https://www.context.ai/' },
  { company: 'nsave', year: '2023', href: '/nsave' },
  { company: 'View all work', year: '2017—2026', href: '/all-work' },
]

function EngagementRow({ company, year, href }: { company: string; year: string; href: string }) {
  const [hovered, setHovered] = useState(false)
  const isExternal = href.startsWith('http')

  return (
    <a
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="hover-trigger transition-colors duration-200"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="inline-flex items-baseline gap-1">
          <span className="hover-underline-animation text-[13px]" style={{ fontWeight: '600', color: '#0a0a0a' }}>
            {company}
          </span>
          <span style={{
            fontSize: '13px',
            fontWeight: '700',
            color: hovered ? '#0a0a0a' : 'rgba(10,10,10,0.25)',
            transition: 'color 0.2s ease',
            lineHeight: 1,
            position: 'relative',
            top: '1px'
          }}>↗</span>
        </span>
        <span className="text-[13px] shrink-0" style={{
          fontWeight: '400',
          color: hovered ? '#0a0a0a' : 'rgba(10,10,10,0.5)',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
          transition: 'color 0.2s ease'
        }}>
          {year}
        </span>
      </div>
    </a>
  )
}

const RecentEngagements: React.FC = () => {
  return (
    <div id="work-section" className="flex flex-col" style={{ gap: '6px' }}>
      {engagements.map((item) => (
        <EngagementRow key={item.company} company={item.company} year={item.year} href={item.href} />
      ))}
    </div>
  )
}

export default RecentEngagements
