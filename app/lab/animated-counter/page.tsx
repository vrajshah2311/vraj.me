'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Easing ───────────────────────────────────────────────────────────────────

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Format = 'integer' | 'currency' | 'decimal'

interface Stat {
  label: string
  target: number
  format: Format
  suffix?: string
  trend: string
  up: boolean
}

// ─── formatValue ──────────────────────────────────────────────────────────────

function formatValue(raw: number, format: Format, suffix?: string): string {
  let s = ''
  if (format === 'currency') s = '$' + Math.round(raw).toLocaleString('en-US')
  else if (format === 'decimal') s = raw.toFixed(1)
  else s = Math.round(raw).toLocaleString('en-US')
  return suffix ? s + ' ' + suffix : s
}

// ─── AnimatedNumber ───────────────────────────────────────────────────────────

function AnimatedNumber({ target, format, suffix, duration, runKey }: {
  target: number
  format: Format
  suffix?: string
  duration: number
  runKey: number
}) {
  const [val, setVal] = useState(0)
  const rafRef = useRef<number | null>(null)
  const t0Ref  = useRef<number | null>(null)

  useEffect(() => {
    setVal(0)
    t0Ref.current = null
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    const delay = setTimeout(() => {
      const tick = (ts: number) => {
        if (!t0Ref.current) t0Ref.current = ts
        const prog = Math.min((ts - t0Ref.current) / duration, 1)
        setVal(easeOutExpo(prog) * target)
        if (prog < 1) rafRef.current = requestAnimationFrame(tick)
        else setVal(target)
      }
      rafRef.current = requestAnimationFrame(tick)
    }, 40)

    return () => {
      clearTimeout(delay)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [runKey, target, duration]) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{formatValue(val, format, suffix)}</>
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ stat, runKey, delay }: { stat: Stat; runKey: number; delay: number }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const id = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(id)
  }, [runKey, delay])

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 360ms cubic-bezier(0.32,0.72,0,1), transform 360ms cubic-bezier(0.32,0.72,0,1)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>
      <p style={{
        margin: '0 0 10px',
        fontSize: '12px',
        fontWeight: 500,
        color: 'rgba(10,10,10,0.45)',
        letterSpacing: '-0.01em',
        lineHeight: 1,
      }}>
        {stat.label}
      </p>

      <p style={{
        margin: 0,
        fontSize: '30px',
        fontWeight: 600,
        color: '#0a0a0a',
        letterSpacing: '-0.04em',
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
      }}>
        <AnimatedNumber
          target={stat.target}
          format={stat.format}
          suffix={stat.suffix}
          duration={1400 + delay}
          runKey={runKey}
        />
      </p>

      <p style={{
        margin: '10px 0 0',
        fontSize: '12px',
        fontWeight: 500,
        color: stat.up ? '#16a34a' : '#dc2626',
        letterSpacing: '-0.01em',
      }}>
        {stat.trend}
      </p>
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS: Stat[] = [
  { label: 'Monthly Revenue', target: 124500, format: 'currency',                  trend: '↑ 18.2% vs last month', up: true  },
  { label: 'Active Users',    target: 84231,  format: 'integer',                   trend: '↑ 2,140 new this week',  up: true  },
  { label: 'Conversion Rate', target: 3.4,    format: 'decimal',  suffix: '%',     trend: '↓ 0.3pp this week',     up: false },
  { label: 'Avg. Response',   target: 142,    format: 'integer',  suffix: 'ms',    trend: '↑ 38ms faster',         up: true  },
]

// ─── Demo ─────────────────────────────────────────────────────────────────────

function AnimatedCounterDemo() {
  const [runKey, setRunKey] = useState(1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        width: '100%',
        maxWidth: '460px',
      }}>
        {STATS.map((s, i) => (
          <StatCard key={s.label} stat={s} runKey={runKey} delay={i * 90} />
        ))}
      </div>

      <button
        onClick={() => setRunKey(k => k + 1)}
        style={{
          padding: '9px 20px',
          borderRadius: '8px',
          border: '1px solid rgba(10,10,10,0.1)',
          background: '#fff',
          color: '#0a0a0a',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          cursor: 'pointer',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          transition: 'background 150ms ease, transform 100ms ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.05)')}
        onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Replay
      </button>
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useEffect, useRef } from 'react'

// Expo ease-out — fast start, smooth deceleration
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

type Format = 'integer' | 'currency' | 'decimal'

function formatValue(raw: number, format: Format, suffix?: string): string {
  let s = ''
  if (format === 'currency') s = '$' + Math.round(raw).toLocaleString('en-US')
  else if (format === 'decimal') s = raw.toFixed(1)
  else s = Math.round(raw).toLocaleString('en-US')
  return suffix ? s + '\\u200a' + suffix : s
}

export function AnimatedNumber({ target, format = 'integer', suffix, duration = 1600, runKey }: {
  target: number
  format?: Format
  suffix?: string
  duration?: number
  runKey: number         // increment this to replay the animation
}) {
  const [val, setVal] = useState(0)
  const rafRef = useRef<number | null>(null)
  const t0Ref  = useRef<number | null>(null)

  useEffect(() => {
    setVal(0)
    t0Ref.current = null
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    const delay = setTimeout(() => {
      const tick = (ts: number) => {
        if (!t0Ref.current) t0Ref.current = ts
        const prog = Math.min((ts - t0Ref.current) / duration, 1)
        setVal(easeOutExpo(prog) * target)
        if (prog < 1) rafRef.current = requestAnimationFrame(tick)
        else setVal(target)
      }
      rafRef.current = requestAnimationFrame(tick)
    }, 40)

    return () => {
      clearTimeout(delay)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [runKey, target, duration])

  return <>{formatValue(val, format, suffix)}</>
}

// ── Usage ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [key, setKey] = useState(1)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>
        <AnimatedNumber target={124500} format="currency" runKey={key} />
      </p>
      <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>
        <AnimatedNumber target={84231} format="integer" runKey={key} duration={1800} />
      </p>
      <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>
        <AnimatedNumber target={3.4} format="decimal" suffix="%" runKey={key} duration={1200} />
      </p>
      <button onClick={() => setKey(k => k + 1)}>Replay</button>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnimatedCounterPage() {
  return (
    <main style={{ backgroundColor: 'var(--bg, #ffffff)', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>

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
        <AnimatedCounterDemo />
      </section>

      {/* ── Code ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted, rgba(10,10,10,0.4))', marginBottom: '12px' }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
          <pre style={{ margin: 0, fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace', fontSize: '12px', lineHeight: '1.65', color: '#e5e5e5', whiteSpace: 'pre', overflowX: 'auto' }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
