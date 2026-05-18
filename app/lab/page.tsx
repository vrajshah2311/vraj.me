'use client'

import { useRouter } from 'next/navigation'
import LabCard from '@/components/LabCard'

const font = 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const labCards = [
  { title: 'Date Picker', subtitle: 'Smooth Calendar Input', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/tabs.mp4', href: '/lab/date-picker' },
  { title: 'PIN / OTP Input', subtitle: 'Animated Code Entry', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/tabs.mp4', href: '/lab/pin-input' },
  { title: 'Hover Card', subtitle: 'Smooth Profile Reveal', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/tabs.mp4', href: '/lab/hover-card' },
  { title: 'Rich Text Editor', subtitle: 'Floating Format Bar', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/tabs.mp4', href: '/lab/rich-text-editor' },
  { title: 'Number Scrubber', subtitle: 'Scroll to Change', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/tabs.mp4', href: '/lab/number-scrubber' },
  { title: 'Accordion', subtitle: 'Smooth Expand/Collapse', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/tabs.mp4', href: '/lab/accordion' },
  { title: 'Tab Switcher', subtitle: 'Animated Tabs', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/tabs.mp4', href: '/lab/tabs' },
  { title: 'Map', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/peec-ai-map.mp4', href: '/lab' },
  { title: 'Agent Analytics', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/aa.mp4', href: '/lab' },
  { title: 'Dropdown', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/dropdown.mp4', href: '/lab/dropdown' },
  { title: 'Export Chart', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/export-chart.mp4', href: '/lab' },
  { title: 'MCP', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/mcp-animation.mp4', href: '/lab' },
  { title: 'Matrix', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/matrix.mp4', href: '/lab' },
  { title: 'Actions Pt.1', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/actions-01.mp4', href: '/lab' },
  { title: 'Actions Pt.2', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/actions-02.mp4', href: '/lab' },
  { title: 'Actions Pt.3', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/actions-03.mp4', href: '/lab' },
  { title: 'Actions Pt.4', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/actions-04.mp4', href: '/lab' },
  { title: 'CVE Analysis', subtitle: 'Profound', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/profound-cve.mp4', href: '/lab' },
  { title: 'Fluid Search', subtitle: 'Profound', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/profound-search.mp4', href: '/lab' },
  { title: 'Toast Stack', subtitle: 'Notifications', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/toasts.mp4', href: '/lab/toast-stack' },
  { title: 'Progressive Blur', subtitle: 'Scroll Effect', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/lab-preview.mp4', href: '/lab/progressive-blur', cropBottom: true },
  { title: 'Insights', subtitle: 'Context AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/context-insights.mp4', href: '/lab' },
  { title: 'Minipilot', subtitle: 'Context AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/context-minipilot.mp4', href: '/lab' },
  { title: 'Docs', subtitle: 'Context AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/context-docs.mp4', href: '/lab' },
  { title: 'Teams', subtitle: 'Context AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/context-teams.mp4', href: '/lab' },
  { title: 'Landing', subtitle: 'Context AI', image: '/images/context-ai.png', video: '/videos/context-landing.mp4', href: '/lab', credit: 'rayyan' },
  { title: 'Tooltip', subtitle: 'Context AI', image: '/images/context-tooltip.png', video: '/videos/context-tooltip.mp4', href: '/lab/tooltip', credit: 'rayyan' },
]

export default function LabPage() {
  const router = useRouter()

  return (
    <main style={{ minHeight: '100dvh', background: '#fff' }}>
      <style>{`
        :root {
          --v2-font-size: clamp(28px, 6vw, 44px);
          --v2-line-height: clamp(30px, 6.2vw, 46px);
        }
        @media (min-width: 1720px) {
          :root { --v2-font-size: 56px; --v2-line-height: 58px; }
        }
        .lab-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          width: 100%;
        }
        @media (max-width: 900px) { .lab-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .lab-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Sticky back button */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', padding: 'clamp(20px, 3vw, 32px)' as any, paddingBottom: 8, flexShrink: 0 }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer',
            fontFamily: font, fontSize: 13, fontWeight: 500, color: 'oklch(0 0 0 / 0.35)',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#171717')}
          onMouseLeave={e => (e.currentTarget.style.color = 'oklch(0 0 0 / 0.35)')}
        >← Back</button>
      </div>

      {/* Content */}
      <div style={{ padding: '0 clamp(20px, 3vw, 32px)' as any, paddingBottom: 'clamp(20px, 3vw, 32px)' as any }}>
        {/* Gray title */}
        <div style={{
          fontFamily: font, fontSize: 'var(--v2-font-size, 44px)' as any, fontWeight: 600,
          lineHeight: 'var(--v2-line-height, 44px)' as any, letterSpacing: '-0.05em',
          color: 'oklch(0 0 0 / 0.15)',
          marginBottom: 8,
        }}>Lab</div>

        {/* Description lines */}
        <div style={{ fontFamily: font, fontSize: 'var(--v2-font-size, 44px)' as any, fontWeight: 600, lineHeight: 'var(--v2-line-height, 44px)' as any, letterSpacing: '-0.05em', color: '#171717' }}>Where ideas get tested.</div>
        <div style={{ fontFamily: font, fontSize: 'var(--v2-font-size, 44px)' as any, fontWeight: 600, lineHeight: 'var(--v2-line-height, 44px)' as any, letterSpacing: '-0.05em', color: '#171717' }}>Micro-interactions, UI patterns,</div>
        <div style={{ fontFamily: font, fontSize: 'var(--v2-font-size, 44px)' as any, fontWeight: 600, lineHeight: 'var(--v2-line-height, 44px)' as any, letterSpacing: '-0.05em', color: '#171717' }}>motion work built across</div>
        <div style={{ fontFamily: font, fontSize: 'var(--v2-font-size, 44px)' as any, fontWeight: 600, lineHeight: 'var(--v2-line-height, 44px)' as any, letterSpacing: '-0.05em', color: '#171717' }}>real products and shipped.</div>

        <div className="lab-grid" style={{ marginTop: 48 }}>
          {labCards.map(card => (
            <LabCard key={card.href} {...card} />
          ))}
        </div>
      </div>
    </main>
  )
}
