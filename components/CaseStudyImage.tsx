'use client'

import React from 'react'
import OpacityBox from './OpacityBox'

interface CaseStudyImageProps {
  imageSrc?: string
  imageAlt?: string
  className?: string
  isFirst?: boolean
}

const CaseStudyImage: React.FC<CaseStudyImageProps> = ({ 
  imageSrc, 
  imageAlt, 
  className = '', 
  isFirst = false 
}) => {
  const imageClass = isFirst ? 'case-study-image-first' : 'case-study-image'
  
  return (
    <div className={imageClass}>
      <OpacityBox 
        className={`case-study-image-box ${className}`} 
        imageSrc={imageSrc} 
        imageAlt={imageAlt} 
      />
    </div>
  )
}

export default CaseStudyImage 