'use client'

import { useState, useRef, useCallback } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ── SpotlightCard ─────────────────────────────────────────────────────────────

function SpotlightCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = outerRef.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  return (
    <div
      ref={outerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        padding: 1,
        borderRadius: 17,
        background: hovered
          ? `radial-gradient(220px circle at ${pos.x}px ${pos.y}px, rgba(99,102,241,0.45), rgba(0,0,0,0.08) 55%)`
          : 'rgba(0,0,0,0.08)',
        transition: 'background 0.12s ease',
        cursor: 'default',
      }}
    >
      <div
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: 16,
          padding: '26px 22px',
          overflow: 'hidden',
          fontFamily: font,
          transition: 'box-shadow 0.25s ease',
          boxShadow: hovered
            ? '0 8px 20px rgba(0,0,0,0.05), 0 24px 56px rgba(0,0,0,0.08)'
            : 'none',
        }}
      >
        {/* Inner spotlight */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.35s ease',
            background: `radial-gradient(220px circle at ${pos.x}px ${pos.y}px, rgba(99,102,241,0.06), transparent 70%)`,
          }}
        />

        {/* Icon */}
        <div style={{
          width: 38, height: 38,
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.14)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16, position: 'relative',
        }}>
          {icon}
        </div>

        {/* Title */}
        <div style={{
          fontSize: 14, fontWeight: 600,
          color: '#0a0a0a', letterSpacing: '-0.02em',
          marginBottom: 7, position: 'relative',
        }}>
          {title}
        </div>

        {/* Description */}
        <div style={{
          fontSize: 13, fontWeight: 500,
          color: 'rgba(10,10,10,0.48)',
          letterSpacing: '-0.01em', lineHeight: 1.55,
          position: 'relative',
        }}>
          {description}
        </div>
      </div>
    </div>
  )
}

// ── Cards data ────────────────────────────────────────────────────────────────

const CARDS = [
  {
    title: 'Blazing Fast',
    description: 'Sub-50ms response times with edge-cached rendering on every request.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8.5 1.5L3 9h4.5L7 14.5l5.5-7.5H8L8.5 1.5z" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Zero Trust Security',
    description: 'End-to-end encrypted with per-request authentication and full audit logs.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5L2.5 4v4c0 3 2.5 5.2 5.5 6 3-.8 5.5-3 5.5-6V4L8 1.5z" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Real-time Analytics',
    description: 'Live dashboards with streaming data and millisecond-precision event tracking.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 11.5L5.5 7.5 8.5 9.5 12.5 4.5" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 14h12" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Conflict-free Sync',
    description: 'CRDTs power seamless merges across all devices with zero data loss.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8c0-2.8 2.2-5 5-5 1.7 0 3.2.8 4.1 2.1" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M13 8c0 2.8-2.2 5-5 5-1.7 0-3.2-.8-4.1-2.1" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M11.5 2L13 3.5 11.5 5" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.5 11L3 12.5 4.5 14" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Design System Ready',
    description: 'WCAG AA accessible, design tokens, and Figma-synced variables out of the box.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="5" height="5" rx="1.5" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" />
        <rect x="9" y="2" width="5" height="5" rx="1.5" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" />
        <rect x="2" y="9" width="5" height="5" rx="1.5" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" />
        <rect x="9" y="9" width="5" height="5" rx="1.5" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    title: 'Multiplayer Ready',
    description: 'Presence indicators, live cursors, and shared state with built-in conflict resolution.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="5.5" cy="5" r="2.5" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" />
        <circle cx="10.5" cy="5" r="2.5" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" />
        <path d="M1 13c0-2.2 2-4 4.5-4s4.5 1.8 4.5 4" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M10 9.2c2 .4 3.5 2 3.5 3.8" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
]

// ── Demo ──────────────────────────────────────────────────────────────────────

function Demo() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '48px 24px',
        fontFamily: font,
      }}
    >
      <style>{`
        .sc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          width: 100%;
          max-width: 680px;
        }
        @media (max-width: 640px) { .sc-grid { grid-template-columns: 1fr; } }
        @media (min-width: 641px) and (max-width: 960px) { .sc-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{
          fontSize: 11, fontWeight: 600,
          color: 'rgba(99,102,241,0.85)', letterSpacing: '0.06em',
          textTransform: 'uppercase', marginBottom: 10,
        }}>
          Spotlight Cards
        </div>
        <div style={{
          fontSize: 22, fontWeight: 600,
          color: '#0a0a0a', letterSpacing: '-0.04em',
          lineHeight: 1.25, marginBottom: 8,
        }}>
          Move your cursor over the cards
        </div>
        <div style={{
          fontSize: 13, fontWeight: 500,
          color: 'rgba(10,10,10,0.42)', letterSpacing: '-0.01em',
        }}>
          Spotlight and border glow track the cursor independently per card
        </div>
      </div>

      {/* Grid */}
      <div className="sc-grid">
        {CARDS.map(card => (
          <SpotlightCard key={card.title} title={card.title} description={card.description} icon={card.icon} />
        ))}
      </div>
    </div>
  )
}

// ── CopyButton ────────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
      }}
      style={{
        padding: '5px 12px',
        background: copied ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 7,
        color: copied ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
        fontSize: 12, fontWeight: 500,
        cursor: 'pointer', fontFamily: font,
        letterSpacing: '-0.01em',
        transition: 'background 0.15s ease, color 0.15s ease',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ── Code source ───────────────────────────────────────────────────────────────

const CODE_SOURCE = `'use client'

import { useState, useRef, useCallback } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// SpotlightCard tracks mouse position to render a radial gradient spotlight
// on both the border (outer wrapper) and the card fill (inner overlay).
export function SpotlightCard({ title, description, icon }) {
  const outerRef = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = useCallback((e) => {
    const rect = outerRef.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  return (
    <div
      ref={outerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        padding: 1,
        borderRadius: 17,
        // Outer gradient creates the glowing border effect
        background: hovered
          ? \`radial-gradient(220px circle at \${pos.x}px \${pos.y}px, rgba(99,102,241,0.45), rgba(0,0,0,0.08) 55%)\`
          : 'rgba(0,0,0,0.08)',
        transition: 'background 0.12s ease',
        cursor: 'default',
      }}
    >
      <div
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: 16,
          padding: '26px 22px',
          overflow: 'hidden',
          fontFamily: font,
          transition: 'box-shadow 0.25s ease',
          boxShadow: hovered
            ? '0 8px 20px rgba(0,0,0,0.05), 0 24px 56px rgba(0,0,0,0.08)'
            : 'none',
        }}
      >
        {/* Inner spotlight — subtle tint on the card fill */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.35s ease',
            background: \`radial-gradient(220px circle at \${pos.x}px \${pos.y}px, rgba(99,102,241,0.06), transparent 70%)\`,
          }}
        />

        {/* Icon slot */}
        <div style={{
          width: 38, height: 38,
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.14)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16, position: 'relative',
        }}>
          {icon}
        </div>

        <div style={{
          fontSize: 14, fontWeight: 600,
          color: '#0a0a0a', letterSpacing: '-0.02em',
          marginBottom: 7, position: 'relative',
        }}>
          {title}
        </div>

        <div style={{
          fontSize: 13, fontWeight: 500,
          color: 'rgba(10,10,10,0.48)',
          letterSpacing: '-0.01em', lineHeight: 1.55,
          position: 'relative',
        }}>
          {description}
        </div>
      </div>
    </div>
  )
}

// Usage
export default function App() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 680, margin: '0 auto', padding: 24 }}>
      <SpotlightCard
        title="Blazing Fast"
        description="Sub-50ms response times with edge-cached rendering on every request."
        icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8.5 1.5L3 9h4.5L7 14.5l5.5-7.5H8L8.5 1.5z" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        }
      />
      <SpotlightCard
        title="Zero Trust Security"
        description="End-to-end encrypted with per-request auth and full audit logs."
        icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5L2.5 4v4c0 3 2.5 5.2 5.5 6 3-.8 5.5-3 5.5-6V4L8 1.5z" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        }
      />
      <SpotlightCard
        title="Real-time Analytics"
        description="Live dashboards with streaming data and millisecond precision."
        icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 11.5L5.5 7.5 8.5 9.5 12.5 4.5" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 14h12" stroke="rgba(99,102,241,0.9)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        }
      />
    </div>
  )
}`

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SpotlightCardsPage() {
  return (
    <div style={{ background: '#fff' }}>
      {/* DEMO */}
      <Demo />

      {/* CODE */}
      <div style={{ background: '#0a0a0a', padding: 'clamp(24px, 4vw, 48px)' as any, fontFamily: font }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>
                Spotlight Cards
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                Drop into any React project — zero dependencies
              </div>
            </div>
            <CopyButton text={CODE_SOURCE} />
          </div>

          <div style={{ background: '#111', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              padding: '10px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center',
            }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontFamily: 'ui-monospace, monospace' }}>
                SpotlightCard.tsx
              </div>
            </div>
            <pre style={{
              margin: 0,
              padding: '20px',
              overflowX: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
              fontSize: 12.5,
              lineHeight: 1.65,
              color: '#e5e5e5',
              scrollbarWidth: 'thin' as any,
              scrollbarColor: 'rgba(255,255,255,0.1) transparent',
            }}>
              <code>{CODE_SOURCE}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
