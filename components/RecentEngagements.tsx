'use client'

import React from 'react'

type Engagement = {
  client: string
  scope: string
  year: string
  href?: string
}

const engagements: Engagement[] = [
  { client: 'Profound', scope: 'User Experience', year: '', href: '/profound' },
  { client: 'nsave', scope: 'Brand & User Experience', year: '', href: '/nsave' }
]

const RecentEngagements: React.FC = () => {
  return (
    <div id="work-section" className="mt-[16px] mb-[20px]">
      <div className="max-w-4xl">
        <h2 className="mb-2 text-[12px] text-neutral-400" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>Selected case studies</h2>
        <div className="w-full h-px mb-2" style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}></div>
        <div>
          <div>
            {engagements.map((item) => {
              if (item.href) {
                return (
                  <a key={`${item.client}-${item.year}`} href={item.href} className="grid grid-cols-12 items-center h-8 relative group cursor-pointer">
                    <div className="absolute inset-0 bg-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity -mx-2"></div>
                    <div className="col-span-6 relative z-10">
                      <div className="inline-flex items-center gap-1 text-black">
                        <span className="text-[13px]" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>{item.client}</span>
                        <svg className="w-3.5 h-3.5 rotate-30 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 17l9-9M17 17V7H7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                    <div className="col-span-6 text-right text-neutral-600 text-[12px] relative z-10" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>{item.scope}</div>
                  </a>
                )
              } else {
                return (
                  <div key={`${item.client}-${item.year}`} className="grid grid-cols-12 items-center h-8 relative group">
                    <div className="absolute inset-0 bg-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity -mx-2"></div>
                    <div className="col-span-6 relative z-10">
                      <span className="text-[13px] text-black" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>{item.client}</span>
                    </div>
                    <div className="col-span-6 text-right text-neutral-600 text-[12px] relative z-10" style={{ fontWeight: '500', fontVariationSettings: "'wght' 500" }}>{item.scope}</div>
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

export default RecentEngagements

