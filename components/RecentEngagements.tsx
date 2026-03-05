'use client'

import React, { useState } from 'react'
import Image from 'next/image'

const engagements = [
  { company: 'Peec AI', year: '2026', href: '/gallery/peec-ai', logo: '/images/logos/peec-ai-logo.png' },
  { company: 'Model ML', year: '2025', href: '/gallery/model-ml', logo: '/images/case-studies/model-ml/logo.svg' },
  { company: 'Profound', year: '2025', href: '/gallery/profound', logo: '/images/logos/isotype-dark.png' },
  { company: 'nsave', year: '2023', href: '/gallery/nsave', logo: '/images/logos/nsave-logo.webp' },
  { company: 'Hale', year: '2025', href: '/gallery/hale', logo: '/images/case-studies/hale/logo.png' },
]

function EngagementPill({
  company,
  href,
  logo,
}: {
  company: string
  href: string
  logo: string | null
}) {
  const [hovered, setHovered] = useState(false)
  const isExternal = href.startsWith('http')

  return (
    <a
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="inline-flex items-center gap-[5px] transition-colors duration-200"
      style={{
        color: hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {logo ? (
        <span className="flex shrink-0 w-4 h-4 rounded-[5px] overflow-hidden bg-transparent max-w-4 max-h-4">
          <Image src={logo} alt="" width={16} height={16} className="w-full h-full object-contain" />
        </span>
      ) : (
        <span className="flex shrink-0 w-4 h-4 rounded-[5px] items-center justify-center text-[8px] font-semibold" style={{ color: 'var(--text-tertiary)', backgroundColor: 'rgba(10,10,10,0.06)' }}>
          {company.charAt(0)}
        </span>
      )}
      <span className="text-[14px]" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{company}</span>
    </a>
  )
}

const RecentEngagements: React.FC = () => {
  return (
    <div id="work-section" className="flex flex-wrap items-center gap-x-3 gap-y-3">
      {engagements.map((item, i) => (
        <React.Fragment key={item.company}>
          {i > 0 && (
            <span
              className="shrink-0 self-center"
              style={{
                width: '2px',
                height: '10px',
                backgroundColor: 'rgba(10,10,10,0.08)',
                borderRadius: '9999px',
              }}
              aria-hidden
            />
          )}
          <EngagementPill
            company={item.company}
            href={item.href}
            logo={item.logo}
          />
        </React.Fragment>
      ))}
    </div>
  )
}

export default RecentEngagements
