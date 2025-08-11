'use client'

import React from 'react'

interface CaseStudySubheadingProps {
  children: React.ReactNode
  className?: string
}

const CaseStudySubheading: React.FC<CaseStudySubheadingProps> = ({ children, className = '' }) => {
  return (
    <h3 className={`case-study-subheading font-sans ${className}`}>
      {children}
    </h3>
  )
}

export default CaseStudySubheading 