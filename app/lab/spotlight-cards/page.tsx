'use client'

import { useState, useRef, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SpotlightCardProps {
  children: React.ReactNode
  spotColor?: string
  style?: React.CSSProperties
}

// ─── SpotlightCard ────────────────────────────────────────────────────────────

function SpotlightCard({ children, spotColor = 'rgba(120, 119, 198, 0.12)', style }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'border-color 250ms ease, box-shadow 250ms ease',
        boxShadow: hovered
          ? '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08)'
          : '0 1px 3px rgba(0,0,0,0.04)',
        ...style,
      }}
    >
      {/* Spotlight layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 350ms ease',
          background: `radial-gradient(320px circle at ${mouse.x}px ${mouse.y}px, ${spotColor}, transparent 70%)`,
          zIndex: 1,
        }}
      />
      {/* Content sits above spotlight so text/icons aren't obscured */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

const FEATURES: {
  icon: React.ReactNode
  title: string
  desc: string
  spotColor: string
}[] = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    title: 'Instant onboarding',
    desc: 'Users are productive within minutes. Zero-config defaults that actually work.',
    spotColor: 'rgba(99, 102, 241, 0.1)',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7.5" stroke="#10b981" strokeWidth="1.5"/>
        <path d="M7 10L9.5 12.5L13.5 7.5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Real-time sync',
    desc: 'Changes propagate to every connected client in under 50ms.',
    spotColor: 'rgba(16, 185, 129, 0.1)',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="9" cy="9" r="5.5" stroke="#f59e0b" strokeWidth="1.5"/>
        <path d="M13.5 13.5L17 17" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Smart search',
    desc: 'Full-text across every record, with fuzzy matching and ranked relevance.',
    spotColor: 'rgba(245, 158, 11, 0.1)',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2.5" y="2.5" width="6" height="6" rx="2" stroke="#ef4444" strokeWidth="1.5"/>
        <rect x="11.5" y="2.5" width="6" height="6" rx="2" stroke="#ef4444" strokeWidth="1.5"/>
        <rect x="2.5" y="11.5" width="6" height="6" rx="2" stroke="#ef4444" strokeWidth="1.5"/>
        <rect x="11.5" y="11.5" width="6" height="6" rx="2" stroke="#ef4444" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Role-based access',
    desc: 'Fine-grained permissions at the org, project, and resource level.',
    spotColor: 'rgba(239, 68, 68, 0.1)',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 5H16M4 10H16M4 15H10" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Audit logs',
    desc: 'Tamper-proof activity history for compliance, debugging, and peace of mind.',
    spotColor: 'rgba(139, 92, 246, 0.1)',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 10C3 6.134 6.134 3 10 3" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M17 10C17 13.866 13.866 17 10 17" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="17" cy="10" r="2" fill="#0ea5e9"/>
        <circle cx="3" cy="10" r="2" fill="#0ea5e9"/>
      </svg>
    ),
    title: 'Webhooks',
    desc: 'Connect any event to any system. Reliable delivery with automatic retries.',
    spotColor: 'rgba(14, 165, 233, 0.1)',
  },
]

function SpotlightDemo() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      width: '100%',
      maxWidth: '680px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>
      <style>{`
        @media (max-width: 600px) {
          .spotlight-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 380px) {
          .spotlight-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {FEATURES.map((f, i) => (
        <SpotlightCard key={i} spotColor={f.spotColor}>
          <div style={{ padding: '20px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(10,10,10,0.04)',
              border: '1px solid rgba(10,10,10,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}>
              {f.icon}
            </div>
            <p style={{
              margin: '0 0 6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0a0a0a',
              letterSpacing: '-0.02em',
              lineHeight: '18px',
            }}>
              {f.title}
            </p>
            <p style={{
              margin: 0,
              fontSize: '12px',
              fontWeight: 450,
              color: 'rgba(10,10,10,0.55)',
              letterSpacing: '-0.01em',
              lineHeight: '17px',
            }}>
              {f.desc}
            </p>
          </div>
        </SpotlightCard>
      ))}
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useCallback } from 'react'

interface SpotlightCardProps {
  children: React.ReactNode
  spotColor?: string
  style?: React.CSSProperties
}

export function SpotlightCard({
  children,
  spotColor = 'rgba(120, 119, 198, 0.12)',
  style,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'box-shadow 250ms ease',
        boxShadow: hovered
          ? '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08)'
          : '0 1px 3px rgba(0,0,0,0.04)',
        ...style,
      }}
    >
      {/* Spotlight layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 350ms ease',
          background: \`radial-gradient(320px circle at \${mouse.x}px \${mouse.y}px, \${spotColor}, transparent 70%)\`,
          zIndex: 1,
        }}
      />
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}

// ─── Usage ────────────────────────────────────────────────────────────────────

export default function Example() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '40px' }}>
      {[
        { title: 'Fast', desc: 'Under 50ms p99 latency.', spotColor: 'rgba(99,102,241,0.12)' },
        { title: 'Reliable', desc: '99.99% uptime SLA.', spotColor: 'rgba(16,185,129,0.12)' },
        { title: 'Secure', desc: 'SOC 2 Type II certified.', spotColor: 'rgba(239,68,68,0.12)' },
      ].map((card) => (
        <SpotlightCard key={card.title} spotColor={card.spotColor}>
          <div style={{ padding: '24px' }}>
            <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: '14px', color: '#0a0a0a' }}>
              {card.title}
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(10,10,10,0.55)' }}>
              {card.desc}
            </p>
          </div>
        </SpotlightCard>
      ))}
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SpotlightCardsPage() {
  return (
    <main style={{
      backgroundColor: 'var(--bg, #ffffff)',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: '24px',
      }}>
        <p style={{
          margin: 0,
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.35)',
        }}>
          Move your cursor over the cards
        </p>
        <SpotlightDemo />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-muted, rgba(10,10,10,0.4))',
          marginBottom: '12px',
        }}>
          Source
        </p>
        <div style={{
          background: '#0a0a0a',
          borderRadius: '12px',
          padding: '20px',
          overflowX: 'auto',
        }}>
          <pre style={{
            margin: 0,
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
            fontSize: '12px',
            lineHeight: '1.65',
            color: '#e5e5e5',
            whiteSpace: 'pre',
            overflowX: 'auto',
          }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
