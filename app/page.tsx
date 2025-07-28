'use client'

import { useState } from 'react'
import Hero from '@/components/Hero'

export default function Home() {
  const [activeTab, setActiveTab] = useState('about')

  return (
    <main className="min-h-screen bg-black relative">
      <div className="flex justify-center">
        <div className="w-full max-w-[464px]">
          <Hero />
        </div>
      </div>
      
      {/* Navigation Bar */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/5 backdrop-blur-md rounded-xl px-1 py-1 shadow-lg w-fit border border-white/5" style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}>
          <div className="flex items-center gap-1 relative">
            {/* Sliding Background */}
            <div 
              className={`absolute top-0 h-8 bg-white/10 rounded-lg transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${
                activeTab === 'about' ? 'left-0 w-[72px]' : 'left-[76px] w-[88px]'
              }`}
            />
            
            {/* About Button */}
            <button 
              onClick={() => setActiveTab('about')}
              className={`relative px-2 h-8 flex items-center justify-center gap-2 text-xs font-medium transition-all duration-200 cursor-pointer group ${
                activeTab === 'about' ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <svg className={`w-3.5 h-3.5 transition-all duration-200 group-hover:scale-110 ${
                activeTab === 'about' ? 'text-white' : 'text-white/40'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'inherit' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>About</span>
            </button>
            
            {/* Portfolio Button */}
            <button 
              onClick={() => setActiveTab('portfolio')}
              className={`relative px-2 h-8 flex items-center justify-center gap-2 text-xs font-medium transition-all duration-200 cursor-pointer group ${
                activeTab === 'portfolio' ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <svg className={`w-3.5 h-3.5 transition-all duration-200 group-hover:scale-110 ${
                activeTab === 'portfolio' ? 'text-white' : 'text-white/40'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'inherit' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Portfolio</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
} 