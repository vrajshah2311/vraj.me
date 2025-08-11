'use client'

import React from 'react'

interface CaseStudyTextProps {
  children: React.ReactNode
  className?: string
}

const CaseStudyText: React.FC<CaseStudyTextProps> = ({ children, className = '' }) => {
  return (
    <div className={`case-study-text font-sans ${className}`}>
      {children}
    </div>
  )
}

export default CaseStudyText 