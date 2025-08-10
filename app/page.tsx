'use client'

import { useEffect, useRef } from 'react'
import { useRegisterScrollContainer } from '../components/ScrollContext'
import Hero from '../components/Hero'
import RecentEngagements from '../components/RecentEngagements'

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  useRegisterScrollContainer(scrollContainerRef)

  useEffect(() => {
    // no-op, kept to ensure client hook ordering; global scroll handled by context
  }, [])

  return (
    <main ref={scrollContainerRef} className="bg-white relative overflow-auto">
      <div className="flex justify-center">
        <div className="w-full max-w-[600px]">
          <div className="pt-[80px] pb-2">
            <h1 className="text-[18px] text-black" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Vraj Shah</h1>
          </div>
          <Hero />
          <div style={{ marginTop: '50px' }}></div>
          <RecentEngagements />
          <div style={{ marginTop: '50px' }}></div>
          {/* Gallery (formerly Vault) */}
          <a href="/gallery" className="block bg-white rounded-lg border border-gray-100 transition-shadow" style={{ height: '242px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', height: '100%' }}>
              {/* Left Content */}
              <div style={{
                width: '300px',
                height: '242px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '12px',
                overflow: 'hidden'
              }}>
                <h2 className="text-[12px] font-medium text-neutral-400" style={{ fontFamily: '"Inter Variable"', lineHeight: '16px', fontWeight: '500' }}>Gallery</h2>
                <p className="text-[15px] font-medium" style={{ color: '#18181A', fontFamily: 'Inter', lineHeight: '22px', marginBottom: 'auto', maxWidth: '252px' }}>
                  This is a collection of my work, created in collaboration with studios like Endless, top notch designers, marketing agencies, & some pieces. I made just for fun.
                </p>
                <div style={{
                  overflow: 'hidden',
                  height: '32px'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    animation: 'ticker 20s linear infinite'
                  }}>
                    <button className="px-[11px] py-[3px] text-gray-700 rounded text-[13px] font-medium transition-colors flex items-center justify-center whitespace-nowrap" style={{ background: 'rgba(24, 24, 26, 0.03)' }}>Context</button>
                    <button className="px-[11px] py-[3px] text-gray-700 rounded text-[13px] font-medium transition-colors flex items-center justify-center whitespace-nowrap" style={{ background: 'rgba(24, 24, 26, 0.03)' }}>Ninja</button>
                    <button className="px-[11px] py-[3px] text-gray-700 rounded text-[13px] font-medium transition-colors flex items-center justify-center whitespace-nowrap" style={{ background: 'rgba(24, 24, 26, 0.03)' }}>Whop</button>
                    <button className="px-[11px] py-[3px] text-gray-700 rounded text-[13px] font-medium transition-colors flex items-center justify-center whitespace-nowrap" style={{ background: 'rgba(24, 24, 26, 0.03)' }}>Linktree</button>
                    <button className="px-[11px] py-[3px] text-gray-700 rounded text-[13px] font-medium transition-colors flex items-center justify-center whitespace-nowrap" style={{ background: 'rgba(24, 24, 26, 0.03)' }}>Opson</button>
                    <button className="px-[11px] py-[3px] text-gray-700 rounded text-[13px] font-medium transition-colors flex items-center justify-center whitespace-nowrap" style={{ background: 'rgba(24, 24, 26, 0.03)' }}>Eleven</button>
                    <button className="px-[11px] py-[3px] text-gray-700 rounded text-[13px] font-medium transition-colors flex items-center justify-center whitespace-nowrap" style={{ background: 'rgba(24, 24, 26, 0.03)' }}>OTPless</button>
                    <button className="px-[11px] py-[3px] text-gray-700 rounded text-[13px] font-medium transition-colors flex items-center justify-center whitespace-nowrap" style={{ background: 'rgba(24, 24, 26, 0.03)' }}>Scaledock</button>
                    {/* Duplicate pills for seamless loop */}
                    <button className="px-[11px] py-[3px] text-gray-700 rounded text-[13px] font-medium transition-colors flex items-center justify-center whitespace-nowrap" style={{ background: 'rgba(24, 24, 26, 0.03)' }}>Context</button>
                    <button className="px-[11px] py-[3px] text-gray-700 rounded text-[13px] font-medium transition-colors flex items-center justify-center whitespace-nowrap" style={{ background: 'rgba(24, 24, 26, 0.03)' }}>Ninja</button>
                    <button className="px-[11px] py-[3px] text-gray-700 rounded text-[13px] font-medium transition-colors flex items-center justify-center whitespace-nowrap" style={{ background: 'rgba(24, 24, 26, 0.03)' }}>Whop</button>
                    <button className="px-[11px] py-[3px] text-gray-700 rounded text-[13px] font-medium transition-colors flex items-center justify-center whitespace-nowrap" style={{ background: 'rgba(24, 24, 26, 0.03)' }}>Linktree</button>
                    <button className="px-[11px] py-[3px] text-gray-700 rounded text-[13px] font-medium transition-colors flex items-center justify-center whitespace-nowrap" style={{ background: 'rgba(24, 24, 26, 0.03)' }}>Opson</button>
                    <button className="px-[11px] py-[3px] text-gray-700 rounded text-[13px] font-medium transition-colors flex items-center justify-center whitespace-nowrap" style={{ background: 'rgba(24, 24, 26, 0.03)' }}>Eleven</button>
                    <button className="px-[11px] py-[3px] text-gray-700 rounded text-[13px] font-medium transition-colors flex items-center justify-center whitespace-nowrap" style={{ background: 'rgba(24, 24, 26, 0.03)' }}>OTPless</button>
                    <button className="px-[11px] py-[3px] text-gray-700 rounded text-[13px] font-medium transition-colors flex items-center justify-center whitespace-nowrap" style={{ background: 'rgba(24, 24, 26, 0.03)' }}>Scaledock</button>
                  </div>
                </div>
              </div>
              
              {/* Right Content - Project Previews */}
              <div style={{
                width: '300px',
                height: '242px',
                padding: '35px 23.999px 35.899px 24.001px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <img 
                  src="/images/case-studies/work/Frame 2087329258.png" 
                  alt="Ninja preview cards showing AI text generation features" 
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: '120%', transform: 'scale(1.2)' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.error('Image failed to load:', target.src);
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </a>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 h-[56px] bg-white z-40">
        <div className="w-full max-w-[600px] mx-auto h-full flex items-center justify-between">
          <div className="flex space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-black hover:text-neutral-600 transition-colors cursor-pointer">
                <span className="text-[13px]" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Contact</span>
                <svg className="w-4 h-4 rotate-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </button>
              
              {/* Hover Dropdown */}
              <div className="absolute bottom-full left-0 mb-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {/* Slack */}
                  <button
                    onClick={() => {
                      window.open('https://join.slack.com/t/lime-studio-group/shared_invite/zt-39vekbe36-QeJB~dPuU0w8wDKBmiynYg', '_blank')
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black flex items-center space-x-3 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.52 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521A2.527 2.527 0 0 1 12.644 8.834V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.521-2.522v-2.522h2.521zM15.165 17.688a2.527 2.527 0 0 1-2.521-2.523 2.526 2.526 0 0 1 2.521-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                    </svg>
                    <span>Slack</span>
                  </button>
                  
                  {/* Email */}
                  <button
                    onClick={(event) => {
                      navigator.clipboard.writeText('shahvraj.1199@gmail.com').then(() => {
                        // Show success feedback
                        const button = event?.target as HTMLButtonElement;
                        const span = button.querySelector('span');
                        if (span) {
                          const originalText = span.textContent;
                          span.textContent = 'Copied!';
                          button.classList.add('bg-green-50', 'text-green-700');
                          setTimeout(() => {
                            span.textContent = originalText;
                            button.classList.remove('bg-green-50', 'text-green-700');
                          }, 2000);
                        }
                      }).catch(() => {
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = 'shahvraj.1199@gmail.com';
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        
                        const button = event?.target as HTMLButtonElement;
                        const span = button.querySelector('span');
                        if (span) {
                          const originalText = span.textContent;
                          span.textContent = 'Copied!';
                          button.classList.add('bg-green-50', 'text-green-700');
                          setTimeout(() => {
                            span.textContent = originalText;
                            button.classList.remove('bg-green-50', 'text-green-700');
                          }, 2000);
                        }
                      });
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black flex items-center space-x-3 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <span>Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <a href="https://x.com/shahvraj99" className="text-black hover:text-black transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/vraj-shah-375990199/" className="text-black hover:text-[#0A66C2] transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://github.com/vrajshah2311" className="text-black hover:text-[#181717] transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
} 