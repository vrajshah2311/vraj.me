'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

function fmt(v: number) {
  return '$' + v.toLocaleString()
}

// Fake price distribution — 40 buckets × $50 spanning $0–$2000
const DIST = [1,2,3,5,8,13,18,23,28,32,35,37,38,38,37,35,32,30,27,24,21,18,16,13,11,9,8,7,6,5,4,4,3,3,2,2,2,1,1,1]
const MIN = 0
const MAX = 2000
const STEP = 10

// ─── RangeSlider ──────────────────────────────────────────────────────────────

function RangeSlider({
  low,
  high,
  onChange,
}: {
  low: number
  high: number
  onChange: (low: number, high: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging  = useRef<'low' | 'high' | null>(null)
  const stateRef  = useRef({ low, high })
  const [active, setActive] = useState<'low' | 'high' | null>(null)

  useEffect(() => { stateRef.current = { low, high } }, [low, high])

  // Stable refs so we can add/remove the same function reference
  const ptrRef = useRef<(e: PointerEvent) => void>()
  const upRef  = useRef<() => void>()
  const stablePtr = useCallback((e: PointerEvent) => ptrRef.current?.(e), [])
  const stableUp  = useCallback(() => upRef.current?.(), [])

  ptrRef.current = (e: PointerEvent) => {
    const track = trackRef.current
    if (!track || !dragging.current) return
    const rect = track.getBoundingClientRect()
    const pct  = clamp((e.clientX - rect.left) / rect.width, 0, 1)
    const val  = Math.round((MIN + pct * (MAX - MIN)) / STEP) * STEP
    const { low: lo, high: hi } = stateRef.current
    if (dragging.current === 'low')  onChange(clamp(val, MIN, hi - STEP), hi)
    else                              onChange(lo, clamp(val, lo + STEP, MAX))
  }

  upRef.current = () => {
    dragging.current = null
    setActive(null)
    window.removeEventListener('pointermove', stablePtr)
    window.removeEventListener('pointerup',   stableUp)
  }

  useEffect(() => () => {
    window.removeEventListener('pointermove', stablePtr)
    window.removeEventListener('pointerup',   stableUp)
  }, [stablePtr, stableUp])

  const startDrag = (which: 'low' | 'high') => (e: React.PointerEvent) => {
    e.preventDefault()
    dragging.current = which
    setActive(which)
    window.addEventListener('pointermove', stablePtr)
    window.addEventListener('pointerup',   stableUp)
  }

  const lo = ((low  - MIN) / (MAX - MIN)) * 100
  const hi = ((high - MIN) / (MAX - MIN)) * 100

  return (
    <div style={{ userSelect: 'none' }}>

      {/* Distribution histogram */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '44px', marginBottom: '6px' }}>
        {DIST.map((v, i) => {
          const bucketPct = (i / DIST.length) * 100
          const inRange   = bucketPct >= lo && bucketPct <= hi
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${(v / 38) * 100}%`,
                borderRadius: '2px 2px 0 0',
                background: inRange ? '#0a0a0a' : 'rgba(10,10,10,0.1)',
                transition: 'background 100ms ease',
              }}
            />
          )
        })}
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        style={{
          position: 'relative',
          height: '4px',
          borderRadius: '99px',
          background: 'rgba(10,10,10,0.1)',
          margin: '10px 0',
        }}
      >
        {/* Highlighted fill */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${lo}%`,
          right: `${100 - hi}%`,
          background: '#0a0a0a',
          borderRadius: '99px',
          pointerEvents: 'none',
        }} />

        {/* Thumbs */}
        {(['low', 'high'] as const).map(which => {
          const pct      = which === 'low' ? lo : hi
          const isActive = active === which
          return (
            <div
              key={which}
              onPointerDown={startDrag(which)}
              style={{
                position: 'absolute',
                top: '50%',
                left: `${pct}%`,
                width: '20px',
                height: '20px',
                transform: `translate(-50%, -50%) scale(${isActive ? 1.12 : 1})`,
                borderRadius: '50%',
                background: '#fff',
                border: `1.5px solid ${isActive ? 'rgba(0,0,0,0.22)' : 'rgba(0,0,0,0.12)'}`,
                boxShadow: isActive
                  ? '0 0 0 4px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.18)'
                  : '0 1px 4px rgba(0,0,0,0.14), 0 1px 2px rgba(0,0,0,0.08)',
                cursor: isActive ? 'grabbing' : 'grab',
                zIndex: which === 'high' ? 3 : 2,
                touchAction: 'none',
                transition: isActive ? 'none' : 'transform 150ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 150ms ease, border-color 150ms ease',
              }}
            />
          )
        })}
      </div>

      {/* Min / max labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.35)', fontWeight: 500 }}>{fmt(MIN)}</span>
        <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.35)', fontWeight: 500 }}>{fmt(MAX)}+</span>
      </div>
    </div>
  )
}

// ─── Demo card ────────────────────────────────────────────────────────────────

const PRESETS = [
  { label: 'Under $200', lo: 0,   hi: 200  },
  { label: '$200–$500',  lo: 200, hi: 500  },
  { label: '$500+',      lo: 500, hi: 2000 },
]

function countStays(low: number, high: number) {
  return Math.round(((high - low) / (MAX - MIN)) * 1500 + 80)
}

function PriceFilter() {
  const [low,  setLow]  = useState(120)
  const [high, setHigh] = useState(840)

  const handleChange = useCallback((lo: number, hi: number) => {
    setLow(lo)
    setHigh(hi)
  }, [])

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      padding: '24px',
      width: '340px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
            Price per night
          </p>
          <p style={{ margin: '3px 0 0', fontSize: '22px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {fmt(low)}<span style={{ color: 'rgba(10,10,10,0.35)', fontSize: '16px', fontWeight: 500 }}> – </span>{fmt(high)}
          </p>
        </div>
        <button
          onClick={() => { setLow(120); setHigh(840) }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'rgba(10,10,10,0.45)',
            letterSpacing: '-0.01em',
            fontFamily: 'inherit',
            transition: 'color 150ms ease, background 150ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#0a0a0a'; e.currentTarget.style.background = 'rgba(10,10,10,0.05)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(10,10,10,0.45)'; e.currentTarget.style.background = 'none' }}
        >
          Reset
        </button>
      </div>

      {/* Slider */}
      <RangeSlider low={low} high={high} onChange={handleChange} />

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(10,10,10,0.06)', margin: '20px 0' }} />

      {/* Preset chips */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {PRESETS.map(p => {
          const sel = low === p.lo && high === p.hi
          return (
            <button
              key={p.label}
              onClick={() => { setLow(p.lo); setHigh(p.hi) }}
              style={{
                flex: 1,
                padding: '7px 4px',
                borderRadius: '8px',
                border: `1px solid ${sel ? 'rgba(10,10,10,0.3)' : 'rgba(10,10,10,0.08)'}`,
                background: sel ? 'rgba(10,10,10,0.05)' : '#fff',
                color: sel ? '#0a0a0a' : 'rgba(10,10,10,0.55)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (!sel) e.currentTarget.style.background = 'rgba(10,10,10,0.03)' }}
              onMouseLeave={e => { if (!sel) e.currentTarget.style.background = '#fff' }}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      {/* Stay count */}
      <p style={{ margin: '16px 0 0', fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em' }}>
        {countStays(low, high).toLocaleString()} stays in this range
      </p>
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

// One bucket per $50 increment — replace with your real distribution data
const DIST = [1,2,3,5,8,13,18,23,28,32,35,37,38,38,37,35,32,30,27,24,21,18,16,13,11,9,8,7,6,5,4,4,3,3,2,2,2,1,1,1]
const MIN = 0
const MAX = 2000
const STEP = 10

function RangeSlider({
  low, high, onChange,
}: {
  low: number
  high: number
  onChange: (low: number, high: number) => void
}) {
  const trackRef  = useRef<HTMLDivElement>(null)
  const dragging  = useRef<'low' | 'high' | null>(null)
  const stateRef  = useRef({ low, high })
  const [active, setActive] = useState<'low' | 'high' | null>(null)

  useEffect(() => { stateRef.current = { low, high } }, [low, high])

  // Stable refs so we can add/remove the same function reference
  const ptrRef    = useRef<(e: PointerEvent) => void>()
  const upRef     = useRef<() => void>()
  const stablePtr = useCallback((e: PointerEvent) => ptrRef.current?.(e), [])
  const stableUp  = useCallback(() => upRef.current?.(), [])

  ptrRef.current = (e: PointerEvent) => {
    const track = trackRef.current
    if (!track || !dragging.current) return
    const rect = track.getBoundingClientRect()
    const pct  = clamp((e.clientX - rect.left) / rect.width, 0, 1)
    const val  = Math.round((MIN + pct * (MAX - MIN)) / STEP) * STEP
    const { low: lo, high: hi } = stateRef.current
    if (dragging.current === 'low')  onChange(clamp(val, MIN, hi - STEP), hi)
    else                              onChange(lo, clamp(val, lo + STEP, MAX))
  }

  upRef.current = () => {
    dragging.current = null
    setActive(null)
    window.removeEventListener('pointermove', stablePtr)
    window.removeEventListener('pointerup',   stableUp)
  }

  useEffect(() => () => {
    window.removeEventListener('pointermove', stablePtr)
    window.removeEventListener('pointerup',   stableUp)
  }, [stablePtr, stableUp])

  const startDrag = (which: 'low' | 'high') => (e: React.PointerEvent) => {
    e.preventDefault()
    dragging.current = which
    setActive(which)
    window.addEventListener('pointermove', stablePtr)
    window.addEventListener('pointerup',   stableUp)
  }

  const lo = ((low  - MIN) / (MAX - MIN)) * 100
  const hi = ((high - MIN) / (MAX - MIN)) * 100

  return (
    <div style={{ userSelect: 'none' }}>

      {/* Distribution histogram */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '44px', marginBottom: '6px' }}>
        {DIST.map((v, i) => {
          const bucketPct = (i / DIST.length) * 100
          const inRange   = bucketPct >= lo && bucketPct <= hi
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: \`\${(v / 38) * 100}%\`,
                borderRadius: '2px 2px 0 0',
                background: inRange ? '#0a0a0a' : 'rgba(10,10,10,0.1)',
                transition: 'background 100ms ease',
              }}
            />
          )
        })}
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        style={{
          position: 'relative',
          height: '4px',
          borderRadius: '99px',
          background: 'rgba(10,10,10,0.1)',
          margin: '10px 0',
        }}
      >
        {/* Highlighted fill */}
        <div style={{
          position: 'absolute',
          top: 0, bottom: 0,
          left: \`\${lo}%\`,
          right: \`\${100 - hi}%\`,
          background: '#0a0a0a',
          borderRadius: '99px',
          pointerEvents: 'none',
        }} />

        {/* Thumbs */}
        {(['low', 'high'] as const).map(which => {
          const pct      = which === 'low' ? lo : hi
          const isActive = active === which
          return (
            <div
              key={which}
              onPointerDown={startDrag(which)}
              style={{
                position: 'absolute',
                top: '50%',
                left: \`\${pct}%\`,
                width: '20px',
                height: '20px',
                transform: \`translate(-50%, -50%) scale(\${isActive ? 1.12 : 1})\`,
                borderRadius: '50%',
                background: '#fff',
                border: \`1.5px solid \${isActive ? 'rgba(0,0,0,0.22)' : 'rgba(0,0,0,0.12)'}\`,
                boxShadow: isActive
                  ? '0 0 0 4px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.18)'
                  : '0 1px 4px rgba(0,0,0,0.14), 0 1px 2px rgba(0,0,0,0.08)',
                cursor: isActive ? 'grabbing' : 'grab',
                zIndex: which === 'high' ? 3 : 2,
                touchAction: 'none',
                transition: isActive
                  ? 'none'
                  : 'transform 150ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 150ms ease, border-color 150ms ease',
              }}
            />
          )
        })}
      </div>

      {/* Min / max labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.35)', fontWeight: 500 }}>$0</span>
        <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.35)', fontWeight: 500 }}>$2,000+</span>
      </div>
    </div>
  )
}

// Usage example
export default function Example() {
  const [low, setLow]   = useState(120)
  const [high, setHigh] = useState(840)

  return (
    <div style={{ padding: '24px', maxWidth: '340px' }}>
      <p style={{ marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
        {'\$'}{low.toLocaleString()} – {'\$'}{high.toLocaleString()}
      </p>
      <RangeSlider
        low={low}
        high={high}
        onChange={(lo, hi) => { setLow(lo); setHigh(hi) }}
      />
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RangeSliderPage() {
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
        <PriceFilter />
        <p style={{
          margin: 0,
          fontSize: '12px',
          color: 'rgba(0,0,0,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
        }}>
          Drag the handles · click a preset · histogram reflects selection
        </p>
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
          marginTop: 0,
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
