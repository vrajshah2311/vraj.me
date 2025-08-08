'use client'

import React from 'react'

interface CaseStudySectionProps {
  children: React.ReactNode
  className?: string
}

const CaseStudySection: React.FC<CaseStudySectionProps> = ({ children, className = '' }) => {
  return (
    <div className={`case-study-section ${className}`}>
      {children}
    </div>
  )
}

export default CaseStudySection 