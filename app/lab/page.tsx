'use client'

import { useState } from 'react'
import LabCard from '@/components/LabCard'

const labCards = [
  { title: 'Multi-step Form', subtitle: 'UI Component', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/multi-step-form.mp4', href: '/lab/multi-step-form' },
  // Peec AI
  { title: 'Map', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/peec-ai-map.mp4', href: '/lab/map' },
  { title: 'Agent Analytics', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/aa.mp4', href: '/lab/agent-analytics' },
  { title: 'Dropdown', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/dropdown.mp4', href: '/lab/dropdown' },
  { title: 'Export Chart', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/export-chart.mp4', href: '/lab/export-chart' },
  { title: 'MCP', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/mcp-animation.mp4', href: '/lab/mcp' },
  { title: 'Matrix', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/matrix.mp4', href: '/lab/matrix' },
  { title: 'Actions Pt.1', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/actions-01.mp4', href: '/lab/actions-01' },
  { title: 'Actions Pt.2', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/actions-02.mp4', href: '/lab/actions-02' },
  { title: 'Actions Pt.3', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/actions-03.mp4', href: '/lab/actions-03' },
  { title: 'Actions Pt.4', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/actions-04.mp4', href: '/lab/actions-04' },
  // Profound
  { title: 'CVE Analysis', subtitle: 'Profound', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/profound-cve.mp4', href: '/lab/profound-cve' },
  { title: 'Fluid Search', subtitle: 'Profound', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/profound-search.mp4', href: '/lab/profound-search' },
  // Other
  { title: 'Toast Stack', subtitle: 'Notifications', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/toasts.mp4', href: '/lab/toast-stack' },
  { title: 'Progressive Blur', subtitle: 'Scroll Effect', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/lab-preview.mp4', href: '/lab/progressive-blur', cropBottom: true },
  { title: 'Orb', subtitle: 'Animation', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/orb.mp4', href: '/canvas/orb' },
  // Context AI
  { title: 'Insights', subtitle: 'Context AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/context-insights.mp4', href: '/lab/insights' },
  { title: 'Minipilot', subtitle: 'Context AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/context-minipilot.mp4', href: '/lab/minipilot' },
  { title: 'Docs', subtitle: 'Context AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/context-docs.mp4', href: '/lab/docs' },
  { title: 'Teams', subtitle: 'Context AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/context-teams.mp4', href: '/lab/teams' },
  { title: 'Landing', subtitle: 'Context AI', image: '/images/context-ai.png', video: '/videos/context-landing.mp4', href: '/lab/landing' },
  { title: 'Tooltip', subtitle: 'Context AI', image: '/images/context-tooltip.png', video: '/videos/context-tooltip.mp4', href: '/lab/tooltip' },
]

const tryCards = [
  { title: 'Actions', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/actions-01.mp4', href: '/canvas/hallucination', noModal: true },
  { title: 'Toasts', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/toasts.mp4', href: '/canvas/toasts', noModal: true },
  { title: 'Dropdown', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/dropdown.mp4', href: '/canvas/labels-dropdown', noModal: true },
  { title: 'Orb', subtitle: 'Animation', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/orb.mp4', href: '/canvas/orb', noModal: true },
]

export default function LabPage() {
  const [tab, setTab] = useState<'lab' | 'try'>('lab')
  const [hovTab, setHovTab] = useState<'lab' | 'try' | null>(null)
  const cards = tab === 'lab' ? labCards : tryCards

  return (
    <>
      <style>{`
        .lab-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          width: 100%;
        }
        @media (max-width: 900px) {
          .lab-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .lab-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <main className="relative overflow-x-hidden" style={{ backgroundColor: '#fff' }}>
        <div className="flex justify-center">
          <div className="w-full max-w-[600px] px-5 sm:px-8 lg:px-[32px]">
            <div className="pt-[20px] sm:pt-[90px] md:pt-[110px] lg:pt-[130px] xl:pt-[148px] 2xl:pt-[170px]">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <button
                  onClick={() => setTab('lab')}
                  onMouseEnter={() => setHovTab('lab')}
                  onMouseLeave={() => setHovTab(null)}
                  className="text-[22px]"
                  style={{
                    fontWeight: '600',
                    color: tab === 'lab' ? 'var(--text-primary)' : hovTab === 'lab' ? 'oklch(0 0 0 / 0.45)' : 'oklch(0 0 0 / 0.2)',
                    letterSpacing: '-0.02em', lineHeight: '1.1',
                    background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer',
                    transition: 'color 0.15s ease',
                  }}
                >
                  Lab
                </button>
                <button
                  onClick={() => setTab('try')}
                  onMouseEnter={() => setHovTab('try')}
                  onMouseLeave={() => setHovTab(null)}
                  className="text-[22px]"
                  style={{
                    fontWeight: '600',
                    color: tab === 'try' ? 'var(--text-primary)' : hovTab === 'try' ? 'oklch(0 0 0 / 0.45)' : 'oklch(0 0 0 / 0.2)',
                    letterSpacing: '-0.02em', lineHeight: '1.1',
                    background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer',
                    transition: 'color 0.15s ease',
                  }}
                >
                  Try it out
                </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 48, padding: '0 32px 32px' }}>
          <div
            key={tab}
            className="lab-grid"
            style={{
              animation: 'labFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {cards.map(lab => (
              <LabCard key={lab.href} {...lab} />
            ))}
          </div>
        </div>
        <div style={{ height: 80 }} />
      </main>
      <style>{`
        @keyframes labFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
