'use client'

import { useState } from 'react'
import Hero from '@/components/Hero'
import CaseStudies from '@/components/CaseStudies'
import Projects from '@/components/Projects'
import ResumeSection from '@/components/ResumeSection'
import PlaygroundSection from '@/components/PlaygroundSection'
import Navigation from '@/components/Navigation'

export default function Home() {
  const [activeTab, setActiveTab] = useState('case-studies')

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <Hero />
      case 'case-studies':
        return <CaseStudies />
      case 'projects':
        return <Projects />
      case 'resume':
        return <ResumeSection />
      case 'playground':
        return <PlaygroundSection />
      default:
        return <Hero />
    }
  }

  return (
    <main className="min-h-screen bg-black relative">
      <div className="flex justify-center">
        <div className="w-full max-w-[600px]">
          {renderContent()}
        </div>
      </div>
      
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} currentProject="other" />
    </main>
  )
} 