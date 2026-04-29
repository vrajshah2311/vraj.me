'use client'

import LabCard from '@/components/LabCard'

const labs = [
  // Peec AI
  { title: 'Agent Analytics', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/aa.mp4', href: '/lab/agent-analytics' },
  { title: 'Dropdown', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/dropdown.mp4', href: '/lab/dropdown' },
  { title: 'Export Chart', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/export-chart.mp4', href: '/lab/export-chart' },
  { title: 'MCP', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/mcp-animation.mp4', href: '/lab/mcp' },
  { title: 'Matrix', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/matrix.mp4', href: '/lab/matrix' },
  { title: 'Actions Pt.1', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/actions-01.mp4', href: '/lab/actions-01' },
  { title: 'Actions Pt.2', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/actions-02.mp4', href: '/lab/actions-02' },
  { title: 'Actions Pt.3', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/actions-03.mp4', href: '/lab/actions-03' },
  { title: 'Actions Pt.4', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/actions-04.mp4', href: '/lab/actions-04' },
  // Context AI
  { title: 'Insights', subtitle: 'Context AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/context-insights.mp4', href: '/lab/insights' },
  { title: 'Minipilot', subtitle: 'Context AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/context-minipilot.mp4', href: '/lab/minipilot' },
  { title: 'Docs', subtitle: 'Context AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/context-docs.mp4', href: '/lab/docs' },
  { title: 'Teams', subtitle: 'Context AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/context-teams.mp4', href: '/lab/teams' },
  { title: 'Landing', subtitle: 'Context AI', image: '/images/context-ai.png', video: '/videos/context-landing.mp4', href: '/lab/landing' },
  { title: 'Tooltip', subtitle: 'Context AI', image: '/images/context-tooltip.png', video: '/videos/context-tooltip.mp4', href: '/lab/tooltip' },
  // Profound
  { title: 'CVE Analysis', subtitle: 'Profound', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/profound-cve.mp4', href: '/lab/profound-cve' },
  { title: 'Fluid Search', subtitle: 'Profound', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/profound-search.mp4', href: '/lab/profound-search' },
  // Other
  { title: 'Hallucination', subtitle: 'AI Visibility', image: 'https://placehold.co/429x269/ffffff/ffffff', href: '/canvas/hallucination' },
  { title: 'Toast Stack', subtitle: 'Notifications', image: 'https://placehold.co/429x269/ffffff/ffffff', href: '/lab/toast-stack' },
  { title: 'Progressive Blur', subtitle: 'Scroll Effect', image: 'https://placehold.co/429x269/ffffff/ffffff', href: '/lab/progressive-blur' },
]

export default function LabPage() {
  return (
    <>
      <style>{`
        .lab-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          width: 100%;
        }
      `}</style>
      <main className="relative overflow-x-hidden" style={{ backgroundColor: '#fff' }}>
        <div className="flex justify-center">
          <div className="w-full max-w-[600px] px-5 sm:px-8 lg:px-[32px]">
            <div className="pt-[20px] sm:pt-[90px] md:pt-[110px] lg:pt-[130px] xl:pt-[148px] 2xl:pt-[170px]">
              <h1 className="text-[22px]" style={{ fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.1', margin: 0 }}>Lab</h1>
              <p className="text-[14px] mt-1" style={{ fontWeight: '500', color: 'var(--text-secondary)', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif', letterSpacing: '-0.01em' }}>Experiments with interface. Stories told through motion.</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center" style={{ marginTop: 28 }}>
          <div className="w-full px-5 sm:px-8 lg:px-[32px] lab-grid" style={{ maxWidth: 1200 }}>
            {labs.map(lab => (
              <LabCard key={lab.href} {...lab} />
            ))}
          </div>
        </div>
        <div style={{ height: 80 }} />
      </main>
    </>
  )
}
