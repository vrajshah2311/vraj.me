'use client'

import { useState, useRef, useEffect } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Segment {
  value: string
  label: string
}

// ─── SegmentedControl ─────────────────────────────────────────────────────────

function SegmentedControl({
  segments,
  value,
  onChange,
  size = 'md',
}: {
  segments: Segment[]
  value: string
  onChange: (v: string) => void
  size?: 'sm' | 'md' | 'lg'
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const [ready, setReady]         = useState(false)

  const activeIndex = segments.findIndex(s => s.value === value)

  useEffect(() => {
    if (!containerRef.current) return
    const btns = containerRef.current.querySelectorAll<HTMLButtonElement>('[data-seg]')
    const btn  = btns[activeIndex]
    if (!btn) return
    setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth })
    setReady(true)
  }, [activeIndex, segments])

  const pad    = size === 'sm' ? 3 : size === 'lg' ? 5 : 4
  const btnPad = size === 'sm' ? '3px 10px' : size === 'lg' ? '7px 18px' : '5px 14px'
  const fs     = size === 'sm' ? '11px'     : size === 'lg' ? '14px'     : '13px'

  return (
    <div
      ref={containerRef}
      style={{
        display: 'inline-flex',
        background: 'rgba(10,10,10,0.06)',
        borderRadius: '10px',
        padding: pad + 'px',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Sliding pill */}
      <div
        style={{
          position: 'absolute',
          top: pad,
          bottom: pad,
          left: indicator.left,
          width: indicator.width,
          background: '#ffffff',
          borderRadius: '7px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
          transition: ready
            ? 'left 200ms cubic-bezier(0.32, 0.72, 0, 1), width 200ms cubic-bezier(0.32, 0.72, 0, 1)'
            : 'none',
          opacity: ready ? 1 : 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {segments.map(seg => {
        const isActive = seg.value === value
        return (
          <button
            key={seg.value}
            data-seg="true"
            onClick={() => onChange(seg.value)}
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              border: 'none',
              background: 'transparent',
              padding: btnPad,
              borderRadius: '7px',
              cursor: 'pointer',
              fontSize: fs,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              fontFamily: FONT,
              color: isActive ? '#0a0a0a' : 'rgba(10,10,10,0.45)',
              transition: 'color 150ms ease',
              whiteSpace: 'nowrap',
              outline: 'none',
            }}
          >
            {seg.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const METRIC_SEGS: Segment[] = [
  { value: 'visitors',    label: 'Visitors'    },
  { value: 'engagement',  label: 'Engagement'  },
  { value: 'revenue',     label: 'Revenue'     },
]

const PERIOD_SEGS: Segment[] = [
  { value: '7d',  label: '7D'  },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: '1y',  label: '1Y'  },
]

const CHART_SEGS: Segment[] = [
  { value: 'line', label: 'Line' },
  { value: 'bar',  label: 'Bar'  },
  { value: 'area', label: 'Area' },
]

const THEME_SEGS: Segment[] = [
  { value: 'light',  label: 'Light'  },
  { value: 'system', label: 'Auto'   },
  { value: 'dark',   label: 'Dark'   },
]

type MetricKey = 'visitors' | 'engagement' | 'revenue'

const METRICS: Record<MetricKey, { rows: { label: string; value: string; change: string; up: boolean }[] }> = {
  visitors: {
    rows: [
      { label: 'Unique visitors',  value: '24,891', change: '+12.4%', up: true  },
      { label: 'Page views',       value: '81,230', change: '+8.1%',  up: true  },
      { label: 'Bounce rate',      value: '38.2%',  change: '-3.2%',  up: true  },
    ],
  },
  engagement: {
    rows: [
      { label: 'Avg. session',     value: '2m 34s', change: '+0.8%',  up: true  },
      { label: 'Pages / session',  value: '3.7',    change: '-0.3%',  up: false },
      { label: 'Return rate',      value: '41.5%',  change: '+5.1%',  up: true  },
    ],
  },
  revenue: {
    rows: [
      { label: 'MRR',              value: '$48,200', change: '+7.2%', up: true  },
      { label: 'Conversions',      value: '1,240',   change: '+9.8%', up: true  },
      { label: 'Avg. order',       value: '$38.87',  change: '-2.1%', up: false },
    ],
  },
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function Demo() {
  const [metric, setMetric] = useState<MetricKey>('visitors')
  const [period, setPeriod] = useState('30d')
  const [chart,  setChart]  = useState('line')
  const [theme,  setTheme]  = useState('system')
  const [animKey, setAnimKey] = useState(0)

  const handleMetric = (v: string) => {
    setMetric(v as MetricKey)
    setAnimKey(k => k + 1)
  }

  const { rows } = METRICS[metric]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>

      {/* ── Main card ── */}
      <div style={{
        width: '400px',
        maxWidth: 'calc(100vw - 48px)',
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid rgba(10,10,10,0.08)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        fontFamily: FONT,
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(10,10,10,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
            Analytics
          </span>
          <SegmentedControl segments={METRIC_SEGS} value={metric} onChange={handleMetric} size="sm" />
        </div>

        {/* Body — fades on metric change */}
        <div
          key={animKey}
          style={{ padding: '20px', animation: 'scFadeIn 160ms ease' }}
        >
          <style>{`@keyframes scFadeIn { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: translateY(0) } }`}</style>
          {rows.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < rows.length - 1 ? '1px solid rgba(10,10,10,0.05)' : 'none',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.55)', letterSpacing: '-0.01em' }}>
                {row.label}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                  {row.value}
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 600,
                  color: row.up ? '#16a34a' : '#dc2626',
                  background: row.up ? '#f0fdf4' : '#fef2f2',
                  padding: '2px 6px', borderRadius: '5px',
                  letterSpacing: '-0.01em',
                }}>
                  {row.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid rgba(10,10,10,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          <SegmentedControl segments={PERIOD_SEGS} value={period} onChange={setPeriod} size="sm" />
          <SegmentedControl segments={CHART_SEGS}  value={chart}  onChange={setChart}  size="sm" />
        </div>
      </div>

      {/* ── Sizes row ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <p style={{
          margin: 0,
          fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.28)', fontFamily: FONT,
        }}>
          Sizes
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
          <SegmentedControl segments={THEME_SEGS} value={theme} onChange={setTheme} size="sm" />
          <SegmentedControl segments={THEME_SEGS} value={theme} onChange={setTheme} size="md" />
          <SegmentedControl segments={THEME_SEGS} value={theme} onChange={setTheme} size="lg" />
        </div>
      </div>

    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect } from 'react'

// Drop this into any React project — no dependencies required.

interface Segment {
  value: string
  label: string
}

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

export function SegmentedControl({
  segments,
  value,
  onChange,
  size = 'md',
}: {
  segments: Segment[]
  value: string
  onChange: (v: string) => void
  size?: 'sm' | 'md' | 'lg'
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const [ready, setReady]         = useState(false)

  const activeIndex = segments.findIndex(s => s.value === value)

  useEffect(() => {
    if (!containerRef.current) return
    const btns = containerRef.current.querySelectorAll<HTMLButtonElement>('[data-seg]')
    const btn  = btns[activeIndex]
    if (!btn) return
    setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth })
    setReady(true)
  }, [activeIndex, segments])

  const pad    = size === 'sm' ? 3 : size === 'lg' ? 5 : 4
  const btnPad = size === 'sm' ? '3px 10px' : size === 'lg' ? '7px 18px' : '5px 14px'
  const fs     = size === 'sm' ? '11px'     : size === 'lg' ? '14px'     : '13px'

  return (
    <div
      ref={containerRef}
      style={{
        display: 'inline-flex',
        background: 'rgba(10,10,10,0.06)',
        borderRadius: '10px',
        padding: pad + 'px',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Sliding pill — tracks the active segment */}
      <div
        style={{
          position: 'absolute',
          top: pad,
          bottom: pad,
          left: indicator.left,
          width: indicator.width,
          background: '#ffffff',
          borderRadius: '7px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
          // Disable transition on first render to avoid sliding in from (0,0)
          transition: ready
            ? 'left 200ms cubic-bezier(0.32, 0.72, 0, 1), width 200ms cubic-bezier(0.32, 0.72, 0, 1)'
            : 'none',
          opacity: ready ? 1 : 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {segments.map(seg => {
        const isActive = seg.value === value
        return (
          <button
            key={seg.value}
            data-seg="true"
            onClick={() => onChange(seg.value)}
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              border: 'none',
              background: 'transparent',
              padding: btnPad,
              borderRadius: '7px',
              cursor: 'pointer',
              fontSize: fs,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              fontFamily: FONT,
              color: isActive ? '#0a0a0a' : 'rgba(10,10,10,0.45)',
              transition: 'color 150ms ease',
              whiteSpace: 'nowrap',
              outline: 'none',
            }}
          >
            {seg.label}
          </button>
        )
      })}
    </div>
  )
}

// ── Usage ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [period, setPeriod] = useState('week')
  const [theme, setTheme]   = useState('system')

  const PERIOD_SEGS = [
    { value: 'day',   label: 'Day'   },
    { value: 'week',  label: 'Week'  },
    { value: 'month', label: 'Month' },
  ]

  const THEME_SEGS = [
    { value: 'light',  label: 'Light'  },
    { value: 'system', label: 'Auto'   },
    { value: 'dark',   label: 'Dark'   },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', fontFamily: FONT }}>
      <SegmentedControl segments={PERIOD_SEGS} value={period} onChange={setPeriod} />
      <SegmentedControl segments={THEME_SEGS}  value={theme}  onChange={setTheme}  size="sm" />
      <p style={{ margin: 0, fontSize: '13px', color: 'rgba(10,10,10,0.5)' }}>
        Period: {period} · Appearance: {theme}
      </p>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SegmentedControlPage() {
  return (
    <main style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      fontFamily: FONT,
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
        gap: '0',
      }}>
        <Demo />
        <p style={{
          marginTop: '32px',
          fontSize: '12px',
          color: 'rgba(0,0,0,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily: FONT,
          textAlign: 'center',
        }}>
          Smooth sliding pill · works with variable-width labels · three size variants
        </p>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.4)',
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
