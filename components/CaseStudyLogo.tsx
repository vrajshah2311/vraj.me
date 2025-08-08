'use client'

import React from 'react'

interface CaseStudyLogoProps {
  children?: React.ReactNode
  className?: string
}

const CaseStudyLogo: React.FC<CaseStudyLogoProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-14 h-14 mb-6 border border-black/10 rounded-2xl ${className}`} style={{ borderRadius: '16px', overflow: 'hidden' }}>
      {children}
    </div>
  )
}

export default CaseStudyLogo 