'use client'

import { useRouter } from 'next/navigation'
import LabCard from '@/components/LabCard'

const font = 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const tryCards = [
  { title: 'Actions', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/actions-01.mp4', href: '/canvas/hallucination', noModal: true },
  { title: 'Toasts', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/toasts.mp4', href: '/canvas/toasts', noModal: true },
  { title: 'Dropdown', subtitle: 'Peec AI', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/dropdown.mp4', href: '/canvas/labels-dropdown', noModal: true },
  { title: 'Orb', subtitle: 'Animation', image: 'https://placehold.co/429x269/ffffff/ffffff', video: '/videos/orb.mp4', href: '/canvas/orb', noModal: true },
]

export default function TryItOutPage() {
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
        .try-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          width: 100%;
        }
        @media (max-width: 900px) { .try-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .try-grid { grid-template-columns: 1fr; } }
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
        }}>Try it out</div>

        {/* Description lines */}
        <div style={{ fontFamily: font, fontSize: 'var(--v2-font-size, 44px)' as any, fontWeight: 600, lineHeight: 'var(--v2-line-height, 44px)' as any, letterSpacing: '-0.05em', color: '#171717' }}>Live prototypes.</div>
        <div style={{ fontFamily: font, fontSize: 'var(--v2-font-size, 44px)' as any, fontWeight: 600, lineHeight: 'var(--v2-line-height, 44px)' as any, letterSpacing: '-0.05em', color: '#171717' }}>Not videos. Not mockups.</div>
        <div style={{ fontFamily: font, fontSize: 'var(--v2-font-size, 44px)' as any, fontWeight: 600, lineHeight: 'var(--v2-line-height, 44px)' as any, letterSpacing: '-0.05em', color: '#171717' }}>Real interactions you can</div>
        <div style={{ fontFamily: font, fontSize: 'var(--v2-font-size, 44px)' as any, fontWeight: 600, lineHeight: 'var(--v2-line-height, 44px)' as any, letterSpacing: '-0.05em', color: '#171717' }}>click, drag, and feel.</div>

        <div className="try-grid" style={{ marginTop: 48 }}>
          {tryCards.map(card => (
            <LabCard key={card.href} {...card} />
          ))}
        </div>
      </div>
    </main>
  )
}
