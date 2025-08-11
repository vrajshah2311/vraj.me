'use client'

import React from 'react'

type WorkItem = {
  title: string
  description: string
  year: string
  href?: string
}

const workItems: WorkItem[] = [
  { title: 'Ninja', description: 'Design & Development', year: '2024', href: '/work/ninja' },
  { title: 'Linktree', description: 'Product Design', year: '2024', href: '/work/linktree' },
  { title: 'Whop', description: 'User Experience', year: '2023', href: '/work/whop' },
  { title: 'Context', description: 'Brand & Design', year: '2023', href: '/work/context' }
]

const MyWork: React.FC = () => {
  return (
    <div id="my-work-section" className="mt-[16px] mb-[16px]">
      <div className="max-w-4xl">
        <h2 className="mb-2 text-[12px] text-neutral-400" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>MY work</h2>
        <div className="w-full h-px mb-2" style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}></div>
        <div>
          <div>
            {workItems.map((item) => {
              if (item.href) {
                return (
                  <a key={`${item.title}-${item.year}`} href={item.href} className="grid grid-cols-12 items-center h-8 relative group cursor-pointer">
                    <div className="absolute inset-0 bg-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity -mx-2"></div>
                    <div className="col-span-6 relative z-10">
                      <div className="inline-flex items-center gap-1 text-black">
                        <span className="text-[13px]" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>{item.title}</span>
                        <svg className="w-3.5 h-3.5 rotate-30 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 17l9-9M17 17V7H7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                    <div className="col-span-6 text-right text-neutral-600 text-[12px] relative z-10" style={{ fontWeight: '400', fontVariationSettings: "'wght' 400" }}>{item.description}</div>
                  </a>
                )
              } else {
                return (
                  <div key={`${item.title}-${item.year}`} className="grid grid-cols-12 items-center h-8 relative group">
                    <div className="absolute inset-0 bg-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity -mx-2"></div>
                    <div className="col-span-6 relative z-10">
                      <span className="text-[13px] text-black" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>{item.title}</span>
                    </div>
                    <div className="col-span-6 text-right text-neutral-600 text-[12px] relative z-10" style={{ fontWeight: '400', fontVariationSettings: "'wght' 400" }}>{item.description}</div>
                  </div>
                )
              }
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyWork