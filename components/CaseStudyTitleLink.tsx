'use client'

import React, { useState } from 'react'

interface CaseStudyTitleLinkProps {
  title: string
  href?: string
}

const CaseStudyTitleLink: React.FC<CaseStudyTitleLinkProps> = ({ title, href }) => {
  const [hovered, setHovered] = useState(false)

  if (!href) {
    return <h1 className="case-study-title">{title}</h1>
  }

  return (
    <h1 className="case-study-title">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 group"
        style={{ textDecoration: 'none' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className="hover-underline-animation" style={{ paddingBottom: '1px' }}>
          {title}
        </span>
        <span style={{
          fontSize: '17px',
          color: hovered ? '#0a0a0a' : 'rgba(10,10,10,0.3)',
          transform: hovered ? 'translate(1px, -2px)' : 'translate(0, 0)',
          transition: 'all 0.2s ease',
          display: 'inline-block',
          fontWeight: '700',
          lineHeight: 1,
          position: 'relative',
          top: '2px'
        }}>
          ↗
        </span>
      </a>
    </h1>
  )
}

export default CaseStudyTitleLink
