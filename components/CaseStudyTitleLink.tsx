'use client'

import React from 'react'

interface CaseStudyTitleLinkProps {
  title: string
  href?: string
}

const CaseStudyTitleLink: React.FC<CaseStudyTitleLinkProps> = ({ title, href }) => {
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
      >
        <span className="hover-underline-animation" style={{ paddingBottom: '1px' }}>
          {title}
        </span>
      </a>
    </h1>
  )
}

export default CaseStudyTitleLink
