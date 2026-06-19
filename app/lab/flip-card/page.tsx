'use client'

import { useState } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ── FlipCard ──────────────────────────────────────────────────────────────────

function FlipCard({
  front,
  back,
  width = 240,
  height = 300,
  trigger = 'hover',
}: {
  front: React.ReactNode
  back: React.ReactNode
  width?: number
  height?: number
  trigger?: 'hover' | 'click'
}) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      onClick={trigger === 'click' ? () => setFlipped(f => !f) : undefined}
      onMouseEnter={trigger === 'hover' ? () => setFlipped(true) : undefined}
      onMouseLeave={trigger === 'hover' ? () => setFlipped(false) : undefined}
      style={{
        width,
        height,
        perspective: 1000,
        cursor: trigger === 'click' ? 'pointer' : 'default',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        transformStyle: 'preserve-3d' as const,
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Front face */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0, left: 0,
          backfaceVisibility: 'hidden' as const,
          WebkitBackfaceVisibility: 'hidden' as const,
        }}>
          {front}
        </div>
        {/* Back face */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0, left: 0,
          backfaceVisibility: 'hidden' as const,
          WebkitBackfaceVisibility: 'hidden' as const,
          transform: 'rotateY(180deg)',
        }}>
          {back}
        </div>
      </div>
    </div>
  )
}

// ── Shared card shell ─────────────────────────────────────────────────────────

const shell: React.CSSProperties = {
  width: '100%',
  height: '100%',
  background: '#fff',
  border: '1px solid rgba(10,10,10,0.08)',
  borderRadius: 16,
  boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  fontFamily: FONT,
  overflow: 'hidden',
}

// ── Profile card ──────────────────────────────────────────────────────────────

function ProfileFront() {
  return (
    <div style={{ ...shell, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <div style={{
        width: 68, height: 68, borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, color: '#fff', fontWeight: 700, flexShrink: 0,
        letterSpacing: '-0.02em',
      }}>VS</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em', color: '#0a0a0a' }}>Vraj Shah</div>
        <div style={{ fontSize: 12, color: 'rgba(10,10,10,0.5)', marginTop: 3, letterSpacing: '-0.01em' }}>
          Product Designer & Dev
        </div>
        <div style={{ fontSize: 11, color: 'rgba(10,10,10,0.3)', marginTop: 2 }}>San Francisco, CA</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {['React', 'Motion', 'Design'].map(tag => (
          <span key={tag} style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.01em',
            padding: '3px 8px', borderRadius: 20,
            background: 'rgba(10,10,10,0.05)', color: 'rgba(10,10,10,0.45)',
          }}>{tag}</span>
        ))}
      </div>
      <div style={{ fontSize: 10, color: 'rgba(10,10,10,0.22)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M5 1.5C3.07 1.5 1.5 3.07 1.5 5S3.07 8.5 5 8.5 8.5 6.93 8.5 5 6.93 1.5 5 1.5zm0 3V5m0 1.5h.005" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        Hover to see contact
      </div>
    </div>
  )
}

function ProfileBack() {
  return (
    <div style={{ ...shell, justifyContent: 'center', gap: 16 }}>
      <div style={{ fontSize: 12, lineHeight: 1.65, color: 'rgba(10,10,10,0.6)', letterSpacing: '-0.01em' }}>
        Building products at the intersection of design and engineering. Focused on micro-interactions and developer tools.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {[
          { icon: '✉', label: 'vraj@peec.ai', color: '#6366f1' },
          { icon: '𝕏', label: '@vrajshah2311', color: '#0a0a0a' },
          { icon: '◆', label: 'github/vrajshah2311', color: '#16a34a' },
        ].map(link => (
          <div key={link.label} style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '8px 10px',
            background: 'rgba(10,10,10,0.025)',
            border: '1px solid rgba(10,10,10,0.06)',
            borderRadius: 8,
          }}>
            <span style={{ fontSize: 12, width: 16, textAlign: 'center', flexShrink: 0 }}>{link.icon}</span>
            <span style={{ fontSize: 11, color: link.color, fontWeight: 500, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {link.label}
            </span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10, color: 'rgba(10,10,10,0.22)', display: 'flex', alignItems: 'center', gap: 4 }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M9 5L5 1M5 1L1 5M5 1v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 5 5)"/>
        </svg>
        Hover away to flip back
      </div>
    </div>
  )
}

// ── Feature card ──────────────────────────────────────────────────────────────

function FeatureFront() {
  return (
    <div style={{ ...shell, alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div style={{
        width: 46, height: 46, borderRadius: 12,
        background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexShrink: 0,
      }}>⚡</div>
      <div style={{ flex: 1, marginTop: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em', color: '#0a0a0a', lineHeight: '22px' }}>
          Instant Sync
        </div>
        <div style={{ fontSize: 12, color: 'rgba(10,10,10,0.5)', marginTop: 7, lineHeight: 1.6, letterSpacing: '-0.01em' }}>
          Real-time updates across all devices with zero configuration.
        </div>
      </div>
      <div style={{ fontSize: 10, color: 'rgba(10,10,10,0.22)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <rect x="1" y="1" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M3.5 5L4.5 6L6.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Click to see details
      </div>
    </div>
  )
}

function FeatureBack() {
  return (
    <div style={{ ...shell, justifyContent: 'space-between' }}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em', color: '#0a0a0a' }}>What&apos;s included</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1, marginTop: 12 }}>
        {[
          'WebSocket-based live sync',
          'Conflict resolution built-in',
          'Offline mode with queue',
          'End-to-end encrypted',
        ].map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              background: 'rgba(14,165,233,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#0ea5e9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: 12, color: 'rgba(10,10,10,0.6)', letterSpacing: '-0.01em', lineHeight: '18px' }}>{f}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#0ea5e9', letterSpacing: '-0.01em' }}>
        Learn more
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6H9.5M6.5 3.5L9.5 6L6.5 8.5" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

// ── Stats card ────────────────────────────────────────────────────────────────

function StatsFront() {
  return (
    <div style={{ ...shell, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'rgba(10,10,10,0.35)' }}>
        Uptime SLA
      </div>
      <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.04em', color: '#0a0a0a', lineHeight: 1 }}>
        99.9%
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }} />
        <span style={{ fontSize: 11, color: 'rgba(10,10,10,0.5)', letterSpacing: '-0.01em' }}>All systems operational</span>
      </div>
      <div style={{ width: '80%', height: 1, background: 'rgba(10,10,10,0.06)', margin: '6px 0' }} />
      <div style={{ fontSize: 10, color: 'rgba(10,10,10,0.22)', display: 'flex', alignItems: 'center', gap: 4 }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M5 1L9 5M9 5L5 9M9 5H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Hover for breakdown
      </div>
    </div>
  )
}

function StatsBack() {
  const rows = [
    { label: 'This month', value: '100%', color: '#16a34a' },
    { label: 'Last 90 days', value: '99.97%', color: '#16a34a' },
    { label: 'Last year', value: '99.91%', color: '#0ea5e9' },
    { label: 'Total incidents', value: '3', color: 'rgba(10,10,10,0.6)' },
    { label: 'Avg resolution', value: '4m 12s', color: 'rgba(10,10,10,0.6)' },
  ]
  return (
    <div style={{ ...shell, justifyContent: 'center', gap: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em', color: '#0a0a0a' }}>Uptime Breakdown</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'rgba(10,10,10,0.5)', letterSpacing: '-0.01em' }}>{r.label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: r.color, letterSpacing: '-0.02em' }}>{r.value}</span>
          </div>
        ))}
      </div>
      <div style={{ width: '100%', height: 1, background: 'rgba(10,10,10,0.06)' }} />
      <div style={{ fontSize: 10, color: 'rgba(10,10,10,0.3)', letterSpacing: '-0.01em' }}>
        Updated every 5 min via status.io
      </div>
    </div>
  )
}

// ── Demo ──────────────────────────────────────────────────────────────────────

function Demo() {
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
      {([
        { label: 'Hover', front: <ProfileFront />, back: <ProfileBack />, trigger: 'hover' as const },
        { label: 'Click', front: <FeatureFront />, back: <FeatureBack />, trigger: 'click' as const },
        { label: 'Hover', front: <StatsFront />, back: <StatsBack />, trigger: 'hover' as const },
      ] as const).map((card, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <p style={{
            margin: 0,
            fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', fontFamily: FONT,
          }}>
            {card.label}
          </p>
          <FlipCard width={220} height={290} trigger={card.trigger} front={card.front} back={card.back} />
        </div>
      ))}
    </div>
  )
}

// ── Code source ───────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ── FlipCard ──────────────────────────────────────────────────────────────────
// Props:
//   front   — ReactNode rendered on the front face
//   back    — ReactNode rendered on the back face
//   width   — card width in px (default 240)
//   height  — card height in px (default 300)
//   trigger — 'hover' flips on mouseenter/leave, 'click' toggles on click

export function FlipCard({
  front,
  back,
  width = 240,
  height = 300,
  trigger = 'hover',
}: {
  front: React.ReactNode
  back: React.ReactNode
  width?: number
  height?: number
  trigger?: 'hover' | 'click'
}) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      onClick={trigger === 'click' ? () => setFlipped(f => !f) : undefined}
      onMouseEnter={trigger === 'hover' ? () => setFlipped(true) : undefined}
      onMouseLeave={trigger === 'hover' ? () => setFlipped(false) : undefined}
      style={{
        width,
        height,
        perspective: 1000,
        cursor: trigger === 'click' ? 'pointer' : 'default',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        transformStyle: 'preserve-3d' as const,
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Front face */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0, left: 0,
          backfaceVisibility: 'hidden' as const,
          WebkitBackfaceVisibility: 'hidden' as const,
        }}>
          {front}
        </div>
        {/* Back face — rotated 180deg so it faces the viewer when flipped */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0, left: 0,
          backfaceVisibility: 'hidden' as const,
          WebkitBackfaceVisibility: 'hidden' as const,
          transform: 'rotateY(180deg)',
        }}>
          {back}
        </div>
      </div>
    </div>
  )
}

// ── Usage ──────────────────────────────────────────────────────────────────────
//
// const CardFront = () => (
//   <div style={{
//     width: '100%', height: '100%',
//     background: '#fff', border: '1px solid rgba(10,10,10,0.08)',
//     borderRadius: 16, padding: 24, boxSizing: 'border-box',
//     display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
//   }}>
//     <h3>Front Face</h3>
//     <p>Hover or click to see the back</p>
//   </div>
// )
//
// const CardBack = () => (
//   <div style={{
//     width: '100%', height: '100%',
//     background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)',
//     borderRadius: 16, padding: 24, boxSizing: 'border-box',
//     display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
//   }}>
//     <h3 style={{ color: '#fff' }}>Back Face</h3>
//     <p style={{ color: 'rgba(255,255,255,0.6)' }}>Any React content goes here</p>
//   </div>
// )
//
// // Hover flip (default)
// <FlipCard width={240} height={300} front={<CardFront />} back={<CardBack />} />
//
// // Click flip
// <FlipCard width={240} height={300} trigger="click" front={<CardFront />} back={<CardBack />} />`

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FlipCardPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: 32,
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            margin: '0 0 6px',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
            textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)',
            fontFamily: FONT,
          }}>Interactive demo</p>
          <p style={{
            margin: 0, fontSize: 13, fontWeight: 500, color: 'rgba(10,10,10,0.5)',
            letterSpacing: '-0.01em', fontFamily: FONT,
          }}>Hover the first and third card · click the middle one</p>
        </div>
        <Demo />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)',
          marginBottom: '12px', fontFamily: FONT,
        }}>Source</p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
          <pre style={{
            margin: 0,
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
            fontSize: '12px', lineHeight: '1.65', color: '#e5e5e5',
            whiteSpace: 'pre', overflowX: 'auto',
          }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
