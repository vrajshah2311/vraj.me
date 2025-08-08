'use client'

import React from 'react'

interface CaseStudyTextProps {
  children: React.ReactNode
  className?: string
}

const CaseStudyText: React.FC<CaseStudyTextProps> = ({ children, className = '' }) => {
  return (
    <div className={`case-study-text ${className}`} style={{ fontWeight: '500', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {children}
    </div>
  )
}

export default CaseStudyText 