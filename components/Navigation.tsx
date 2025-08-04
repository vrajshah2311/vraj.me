'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  UserIcon, 
  DocumentTextIcon, 
  FolderIcon, 
  DocumentIcon, 
  PlayIcon 
} from '@heroicons/react/24/outline'
import { 
  UserIcon as UserIconSolid, 
  DocumentTextIcon as DocumentTextIconSolid, 
  FolderIcon as FolderIconSolid, 
  DocumentIcon as DocumentIconSolid, 
  PlayIcon as PlayIconSolid 
} from '@heroicons/react/24/solid'

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
  const caseStudiesRef = useRef<HTMLButtonElement>(null)
  const projectsRef = useRef<HTMLButtonElement>(null)
  const resumeRef = useRef<HTMLButtonElement>(null)
  const playgroundRef = useRef<HTMLButtonElement>(null)

  const updateSliderPosition = (tab: string) => {
    if (!aboutRef.current || !caseStudiesRef.current || !projectsRef.current || !resumeRef.current || !playgroundRef.current) return

    const aboutWidth = aboutRef.current.offsetWidth
    const caseStudiesWidth = caseStudiesRef.current.offsetWidth
    const projectsWidth = projectsRef.current.offsetWidth
    const resumeWidth = resumeRef.current.offsetWidth
    const playgroundWidth = playgroundRef.current.offsetWidth
    const gap = 8

    let left = 0
    let width = aboutWidth

    if (tab === 'case-studies') {
      left = aboutWidth + gap
      width = caseStudiesWidth
    } else if (tab === 'projects') {
      left = aboutWidth + gap + caseStudiesWidth + gap
      width = projectsWidth
    } else if (tab === 'resume') {
      left = aboutWidth + gap + caseStudiesWidth + gap + projectsWidth + gap
      width = resumeWidth
    } else if (tab === 'playground') {
      left = aboutWidth + gap + caseStudiesWidth + gap + projectsWidth + gap + resumeWidth + gap
      width = playgroundWidth
    }

    setSliderStyle({ left, width })
  }

  const calculatePositions = () => {
    if (aboutRef.current && caseStudiesRef.current && projectsRef.current && resumeRef.current && playgroundRef.current) {
      const aboutWidth = aboutRef.current.offsetWidth
      const caseStudiesWidth = caseStudiesRef.current.offsetWidth
      const projectsWidth = projectsRef.current.offsetWidth
      const resumeWidth = resumeRef.current.offsetWidth
      const playgroundWidth = playgroundRef.current.offsetWidth
      const gap = 8
      
      setSeparatorPositions({
        first: aboutWidth + gap / 2,
        second: aboutWidth + gap + caseStudiesWidth + gap / 2,
        third: aboutWidth + gap + caseStudiesWidth + gap + projectsWidth + gap / 2,
        fourth: aboutWidth + gap + caseStudiesWidth + gap + projectsWidth + gap + resumeWidth + gap / 2
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
    { id: 'case-studies', ref: caseStudiesRef, label: 'Case Studies', icon: 'portfolio' },
    { id: 'projects', ref: projectsRef, label: 'Projects', icon: 'projects' },
    { id: 'resume', ref: resumeRef, label: 'Resume', icon: 'resume' },
    { id: 'playground', ref: playgroundRef, label: 'Playground', icon: 'playground' }
  ]

  const getIcon = (icon: string, isActive: boolean = false) => {
    switch (icon) {
      case 'user':
        return isActive ? <UserIconSolid className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />
      case 'portfolio':
        return isActive ? <DocumentTextIconSolid className="w-3.5 h-3.5" /> : <DocumentTextIcon className="w-3.5 h-3.5" />
      case 'resume':
        return isActive ? <DocumentIconSolid className="w-3.5 h-3.5" /> : <DocumentIcon className="w-3.5 h-3.5" />
      case 'case-studies':
        return isActive ? <DocumentTextIconSolid className="w-3.5 h-3.5" /> : <DocumentTextIcon className="w-3.5 h-3.5" />
      case 'projects':
        return isActive ? <FolderIconSolid className="w-3.5 h-3.5" /> : <FolderIcon className="w-3.5 h-3.5" />
      case 'playground':
        return isActive ? <PlayIconSolid className="w-3.5 h-3.5" /> : <PlayIcon className="w-3.5 h-3.5" />
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
          

          
          {/* Navigation Buttons */}
          {navItems.map((item) => (
            <button 
              key={item.id}
              ref={item.ref}
              onClick={() => handleTabClick(item.id)}
              className={`relative pl-2 pr-2 h-8 flex items-center justify-center text-xs font-medium transition-all duration-2000 cursor-pointer group ${
                activeTab === item.id 
                  ? 'text-white'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >

              
              <div 
                className={`transition-all duration-2000 group-hover:scale-110 ${
                  activeTab === item.id 
                    ? 'text-white'
                    : 'text-white/30'
                }`}
              >
                {getIcon(item.icon, activeTab === item.id)}
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Navigation 