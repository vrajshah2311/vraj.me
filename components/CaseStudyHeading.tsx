'use client'

import React from 'react'

interface CaseStudyHeadingProps {
  children: React.ReactNode
  className?: string
}

const CaseStudyHeading: React.FC<CaseStudyHeadingProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`case-study-heading font-sans ${className}`}>
      {children}
    </h2>
  )
}

export default CaseStudyHeading 