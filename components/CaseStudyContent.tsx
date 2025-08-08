'use client'

import React from 'react'

interface CaseStudyContentProps {
  children: React.ReactNode
  className?: string
}

const CaseStudyContent: React.FC<CaseStudyContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`case-study-content ${className}`}>
      <div className="case-study-content-inner">
        {children}
      </div>
    </div>
  )
}

export default CaseStudyContent 