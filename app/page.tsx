'use client'

import { useState } from 'react'
import Hero from '@/components/Hero'
import WorkSection from '@/components/WorkSection'
import ResumeSection from '@/components/ResumeSection'
import PlaygroundSection from '@/components/PlaygroundSection'
import Navigation from '@/components/Navigation'

export default function Home() {
  const [activeTab, setActiveTab] = useState('about')

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <Hero />
      case 'portfolio':
        return <WorkSection />
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