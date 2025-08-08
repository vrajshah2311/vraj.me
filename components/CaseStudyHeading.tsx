'use client'

import React from 'react'

interface CaseStudyHeadingProps {
  children: React.ReactNode
  className?: string
}

const CaseStudyHeading: React.FC<CaseStudyHeadingProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`case-study-heading ${className}`} style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>
      {children}
    </h2>
  )
}

export default CaseStudyHeading 