'use client'

import { useState, useRef, useEffect } from 'react'

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  currentProject?: string
}

const Navigation = ({ activeTab, onTabChange, currentProject }: NavigationProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 64 })
  const [separatorPositions, setSeparatorPositions] = useState({ first: 0, second: 0, third: 0, fourth: 0 })
  
  const aboutRef = useRef<HTMLButtonElement>(null)
  const portfolioRef = useRef<HTMLButtonElement>(null)
  const resumeRef = useRef<HTMLButtonElement>(null)
  const playgroundRef = useRef<HTMLButtonElement>(null)

  const updateSliderPosition = (tab: string) => {
    if (!aboutRef.current || !portfolioRef.current || !resumeRef.current || !playgroundRef.current) return

    const aboutWidth = aboutRef.current.offsetWidth
    const portfolioWidth = portfolioRef.current.offsetWidth
    const resumeWidth = resumeRef.current.offsetWidth
    const playgroundWidth = playgroundRef.current.offsetWidth
    const gap = 8

    let left = 0
    let width = aboutWidth

    if (tab === 'portfolio') {
      left = aboutWidth + gap
      width = portfolioWidth
    } else if (tab === 'resume') {
      left = aboutWidth + gap + portfolioWidth + gap
      width = resumeWidth
    } else if (tab === 'playground') {
      left = aboutWidth + gap + portfolioWidth + gap + resumeWidth + gap
      width = playgroundWidth
    }

    setSliderStyle({ left, width })
  }

  const calculatePositions = () => {
    if (aboutRef.current && portfolioRef.current && resumeRef.current && playgroundRef.current) {
      const aboutWidth = aboutRef.current.offsetWidth
      const portfolioWidth = portfolioRef.current.offsetWidth
      const resumeWidth = resumeRef.current.offsetWidth
      const playgroundWidth = playgroundRef.current.offsetWidth
      const gap = 8
      
      setSeparatorPositions({
        first: aboutWidth + gap / 2,
        second: aboutWidth + gap + portfolioWidth + gap / 2,
        third: aboutWidth + gap + portfolioWidth + gap + resumeWidth + gap / 2,
        fourth: aboutWidth + gap + portfolioWidth + gap + resumeWidth + gap + playgroundWidth + gap / 2
      })
    }
  }

  useEffect(() => {
    calculatePositions()
    const timer = setTimeout(calculatePositions, 50)
    return () => clearTimeout(timer)
  }, [activeTab])

  useEffect(() => {
    const timer = setTimeout(calculatePositions, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    updateSliderPosition(activeTab)
  }, [activeTab])

  const handleTabClick = (tab: string) => {
    if (activeTab !== tab) {
      setIsTransitioning(true)
      setTimeout(() => setIsTransitioning(false), 500)
    }
    

    
    onTabChange(tab)
  }

  const navItems = [
    { id: 'about', ref: aboutRef, label: 'About', icon: 'user' },
    { id: 'portfolio', ref: portfolioRef, label: 'Work', icon: 'portfolio' },
    { id: 'resume', ref: resumeRef, label: 'Resume', icon: 'resume' },
    { id: 'playground', ref: playgroundRef, label: 'Playground', icon: 'playground' }
  ]

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'user':
        return (
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C17.5234 2 22 6.47717 22 12C22 17.5228 17.5234 22 12 22C6.47656 22 2 17.5228 2 12C2 6.47717 6.47656 2 12 2ZM12 15C9.60547 15 7.61719 16.0055 6.28516 17.5996C7.73826 19.081 9.76184 20 12 20C14.2382 20 16.2617 19.081 17.7148 17.5996C16.3828 16.0055 14.3945 15 12 15ZM12 6.75C10.2045 6.75 8.75 8.20509 8.75 10C8.75 11.7949 10.2045 13.25 12 13.25C13.7955 13.25 15.25 11.7949 15.25 10C15.25 8.20509 13.7955 6.75 12 6.75Z" fill="currentColor" />
        )
      case 'portfolio':
        return (
          <>
            <path d="M2 7C2 4.79086 3.79086 3 6 3H8.75736C9.81823 3 10.8356 3.42143 11.5858 4.17157L11.8284 4.41421C12.2035 4.78929 12.7122 5 13.2426 5H18C20.2091 5 22 6.79086 22 9V9.99963C21.1643 9.37194 20.1256 9 19 9H5C3.87439 9 2.83566 9.37194 2 9.99963V7Z" fill="currentColor" />
            <path d="M2 14V16C2 18.2091 3.79086 20 6 20H18C20.2091 20 22 18.2091 22 16V14C22 12.3431 20.6569 11 19 11H5C3.34315 11 2 12.3431 2 14Z" fill="currentColor" />
          </>
        )
      case 'resume':
        return (
          <>
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2H8C5.79086 2 4 3.79086 4 6V18C4 20.2091 5.79086 22 8 22H16C18.2091 22 20 20.2091 20 18V10H15C13.3431 10 12 8.65685 12 7V2ZM8 14C8 13.4477 8.44772 13 9 13H12C12.5523 13 13 13.4477 13 14C13 14.5523 12.5523 15 12 15H9C8.44772 15 8 14.5523 8 14ZM9 17C8.44772 17 8 17.4477 8 18C8 18.5523 8.44772 19 9 19H15.5C16.0523 19 16.5 18.5523 16.5 18C16.5 17.4477 16.0523 17 15.5 17H9Z" fill="currentColor" />
            <path d="M19.4142 8L14 2.58579V7C14 7.55228 14.4477 8 15 8H19.4142Z" fill="currentColor" />
          </>
        )
      case 'case-studies':
        return (
          <>
            <path fillRule="evenodd" clipRule="evenodd" d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4C21 4.55228 20.5523 5 20 5H4C3.44772 5 3 4.55228 3 4ZM3 8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8C21 8.55228 20.5523 9 20 9H4C3.44772 9 3 8.55228 3 8ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM3 16C3 15.4477 3.44772 15 4 15H20C20.5523 15 21 15.4477 21 16C21 16.5523 20.5523 17 20 17H4C3.44772 17 3 16.5523 3 16Z" fill="currentColor" />
          </>
        )
      case 'playground':
        return (
          <>
            <path fillRule="evenodd" clipRule="evenodd" d="M4 4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4C20 4.55228 19.5523 5 19 5H5C4.44772 5 4 4.55228 4 4ZM2 10C2 7.79086 3.79086 6 6 6H18C20.2091 6 22 7.79086 22 10V17C22 19.2091 20.2091 21 18 21H6C3.79086 21 2 19.2091 2 17V10ZM10.5668 10.5987C10.9133 10.4322 11.3245 10.479 11.6247 10.7191L14.1247 12.7191C14.3619 12.9089 14.5 13.1962 14.5 13.5C14.5 13.8038 14.3619 14.0911 14.1247 14.2809L11.6247 16.2809C11.3245 16.521 10.9133 16.5678 10.5668 16.4013C10.2203 16.2348 10 15.8844 10 15.5V11.5C10 11.1156 10.2203 10.7652 10.5668 10.5987Z" fill="currentColor" />
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="backdrop-blur-md rounded-xl px-1 py-1 shadow-lg w-fit border transition-all duration-2000 bg-white/5 border-white/5">
        <div className="flex items-center gap-2 relative">
          {/* Sliding Background */}
          <div 
            className="absolute rounded-lg transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] z-10"
            style={{
              left: `${sliderStyle.left}px`,
              width: `${sliderStyle.width}px`,
              height: '30px',
              top: '1px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              opacity: isTransitioning ? '0.8' : '1',
              transition: 'all 500ms cubic-bezier(0.87,0,0.13,1), opacity 350ms cubic-bezier(0.25,0.46,0.45,0.94)'
            }}
          />
          
          {/* Separator Lines */}
          <div className="absolute w-0.5 h-2.5 bg-white/5 z-20" style={{ left: `${separatorPositions.first}px`, top: '50%', transform: 'translate(-50%, -50%)' }} />
          <div className="absolute w-0.5 h-2.5 bg-white/5 z-20" style={{ left: `${separatorPositions.second}px`, top: '50%', transform: 'translate(-50%, -50%)' }} />
          <div className="absolute w-0.5 h-2.5 bg-white/5 z-20" style={{ left: `${separatorPositions.third}px`, top: '50%', transform: 'translate(-50%, -50%)' }} />
          <div className="absolute w-0.5 h-2.5 bg-white/5 z-20" style={{ left: `${separatorPositions.fourth}px`, top: '50%', transform: 'translate(-50%, -50%)' }} />
          
          {/* Navigation Buttons */}
          {navItems.map((item) => (
            <button 
              key={item.id}
              ref={item.ref}
              onClick={() => handleTabClick(item.id)}
              className={`relative pl-2 pr-2 h-8 flex items-center justify-center gap-2 text-xs font-medium transition-all duration-2000 cursor-pointer group ${
                activeTab === item.id 
                  ? 'text-white'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >

              
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`w-3.5 h-3.5 transition-all duration-2000 group-hover:scale-110 ${
                  activeTab === item.id 
                    ? 'text-white'
                    : 'text-white/30'
                }`} 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                style={{ color: 'inherit' }}
              >
                {getIcon(item.icon)}
              </svg>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Navigation 