'use client'

import { useState } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── RollingChar ──────────────────────────────────────────────────────────────
// Numeric chars render as a vertical 0–9 strip that CSS-transitions to the
// current digit. Non-numeric chars (commas, $, %, .) pass through as-is.

function RollingChar({ char }: { char: string }) {
  const n = parseInt(char, 10)

  if (isNaN(n)) {
    return (
      <span style={{ display: 'inline-flex', height: '1em', alignItems: 'center' }}>
        {char}
      </span>
    )
  }

  // The inner strip is 10em tall (10 digits × 1em each).
  // translateY(-n * 10%) moves up by n×1em, showing digit n.
  return (
    <span style={{ display: 'inline-block', height: '1em', overflow: 'hidden', verticalAlign: 'top' }}>
      <span style={{
        display: 'flex',
        flexDirection: 'column',
        height: '10em',
        transform: `translateY(${-n * 10}%)`,
        transition: 'transform 520ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
          <span key={d} style={{ display: 'flex', height: '1em', alignItems: 'center', justifyContent: 'center' }}>
            {d}
          </span>
        ))}
      </span>
    </span>
  )
}

// ─── NumberRoll ───────────────────────────────────────────────────────────────
// Pass a pre-formatted string (e.g. "14,738" or "$48.2K").
// Each digit smoothly rolls to its new position on re-render.
// Key digits by position-from-right so the units digit stays stable
// when the number gains/loses a leading digit.

interface NumberRollProps {
  value: string
  fontSize?: number
  fontWeight?: number
  color?: string
}

function NumberRoll({ value, fontSize = 36, fontWeight = 600, color = '#0a0a0a' }: NumberRollProps) {
  const chars = value.split('')
  const len = chars.length

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'flex-start',
      fontSize,
      fontWeight,
      color,
      letterSpacing: '-0.03em',
      lineHeight: '1',
      fontFamily: FONT,
      fontVariantNumeric: 'tabular-nums',
    }}>
      {chars.map((char, i) => (
        <RollingChar key={len - 1 - i} char={char} />
      ))}
    </span>
  )
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const SCENARIOS = [
  { users: '14,738', revenue: '$48,291', bounce: '42.1%', sessions: '2,834' },
  { users: '18,205', revenue: '$53,847', bounce: '38.7%', sessions: '3,612' },
  { users: '21,049', revenue: '$62,103', bounce: '35.2%', sessions: '4,281' },
  { users: '09,314', revenue: '$41,658', bounce: '47.8%', sessions: '1,927' },
]

const STAT_META = [
  { key: 'users'    as const, label: 'Active Users',  delta: ['+12%', '+24%', '+43%', '−11%'] },
  { key: 'revenue'  as const, label: 'Revenue',       delta: ['+8%',  '+11%', '+29%', '−13%'] },
  { key: 'bounce'   as const, label: 'Bounce Rate',   delta: ['−3%',  '−8%',  '−16%', '+14%'] },
  { key: 'sessions' as const, label: 'Sessions',      delta: ['+5%',  '+27%', '+51%', '−31%'] },
]

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  delta,
  positive,
}: {
  label: string
  value: string
  delta: string
  positive: boolean
}) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '14px',
      padding: '20px 22px 18px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      minWidth: '148px',
    }}>
      <span style={{
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
        color: 'rgba(10,10,10,0.38)',
        fontFamily: FONT,
        lineHeight: 1,
      }}>
        {label}
      </span>
      <NumberRoll value={value} fontSize={30} />
      <span style={{
        fontSize: '12px',
        fontWeight: 500,
        color: positive ? '#16a34a' : '#dc2626',
        letterSpacing: '-0.01em',
        fontFamily: FONT,
        lineHeight: 1,
      }}>
        {delta} vs last period
      </span>
    </div>
  )
}

// ─── NumberRollDemo ───────────────────────────────────────────────────────────

function NumberRollDemo() {
  const [idx, setIdx] = useState(0)
  const data = SCENARIOS[idx]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {STAT_META.map(({ key, label, delta }) => {
          const d = delta[idx]
          const positive = !d.startsWith('−')
          return (
            <StatCard
              key={key}
              label={label}
              value={data[key]}
              delta={d}
              positive={positive}
            />
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => setIdx(i => (i + 1) % SCENARIOS.length)}
          style={{
            padding: '9px 22px',
            borderRadius: '8px',
            border: '1px solid rgba(10,10,10,0.08)',
            background: '#fff',
            color: '#0a0a0a',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            cursor: 'pointer',
            fontFamily: FONT,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            transition: 'background 150ms ease, transform 100ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.05)')}
          onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Update Stats →
        </button>
        <p style={{
          margin: 0,
          fontSize: '12px',
          color: 'rgba(0,0,0,0.3)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily: FONT,
        }}>
          Watch each digit roll to its new value
        </p>
      </div>
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState } from 'react'

// Each digit is a vertical 0–9 strip that CSS-transitions to the current value.
// Non-numeric chars (commas, $, %, .) pass through unchanged.
function RollingChar({ char }: { char: string }) {
  const n = parseInt(char, 10)

  if (isNaN(n)) {
    return (
      <span style={{ display: 'inline-flex', height: '1em', alignItems: 'center' }}>
        {char}
      </span>
    )
  }

  // Strip is 10em tall (10 digits × 1em). translateY(-n×10%) shows digit n.
  return (
    <span style={{ display: 'inline-block', height: '1em', overflow: 'hidden', verticalAlign: 'top' }}>
      <span style={{
        display: 'flex',
        flexDirection: 'column',
        height: '10em',
        transform: \`translateY(\${-n * 10}%)\`,
        transition: 'transform 520ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
          <span key={d} style={{ display: 'flex', height: '1em', alignItems: 'center', justifyContent: 'center' }}>
            {d}
          </span>
        ))}
      </span>
    </span>
  )
}

// Pass a pre-formatted string — digits roll smoothly on every re-render.
// Keys by position-from-right so the units digit stays stable when the
// number gains or loses a leading digit.
export function NumberRoll({
  value,
  fontSize = 36,
  fontWeight = 600,
  color = '#0a0a0a',
}: {
  value: string
  fontSize?: number
  fontWeight?: number
  color?: string
}) {
  const chars = value.split('')
  const len = chars.length

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'flex-start',
      fontSize,
      fontWeight,
      color,
      letterSpacing: '-0.03em',
      lineHeight: '1',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      fontVariantNumeric: 'tabular-nums',
    }}>
      {chars.map((char, i) => (
        <RollingChar key={len - 1 - i} char={char} />
      ))}
    </span>
  )
}

// ── Example usage ─────────────────────────────────────────────────────────────

export default function Demo() {
  const [count, setCount] = useState(0)

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { minimumFractionDigits: 0 })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <NumberRoll value={fmt(count)} fontSize={48} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setCount(c => Math.max(0, c - 1000))}>−1,000</button>
        <button onClick={() => setCount(c => c + 1000)}>+1,000</button>
      </div>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NumberRollPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
      }}>
        <NumberRollDemo />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          color: 'rgba(10,10,10,0.4)',
          marginBottom: '12px',
          fontFamily: FONT,
        }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
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
