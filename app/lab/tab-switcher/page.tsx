'use client'

import { useState, useRef, useEffect } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Data ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview',  label: 'Overview'  },
  { id: 'updates',   label: 'Updates'   },
  { id: 'activity',  label: 'Activity'  },
]

const STATS = [
  { label: 'Total Users',  value: '12,847',  delta: '+12%' },
  { label: 'Active Today', value: '2,391',   delta: '+4%'  },
  { label: 'Revenue MTD',  value: '$84,200', delta: '+8%'  },
]

const UPDATES = [
  { title: 'New feature shipped',       time: '2h ago',    dot: '#2563eb' },
  { title: 'Server migration complete', time: '5h ago',    dot: '#16a34a' },
  { title: 'Design review scheduled',   time: 'Yesterday', dot: '#d97706' },
]

const ACTIVITY = [
  { user: 'Alex K.',   initials: 'AK', bg: 'hsl(210,65%,88%)', fg: 'hsl(210,50%,32%)', action: 'Commented on Dashboard v2',  time: '1h' },
  { user: 'Sam T.',    initials: 'ST', bg: 'hsl(150,60%,86%)', fg: 'hsl(150,45%,28%)', action: 'Merged pull request #142',    time: '3h' },
  { user: 'Jordan L.', initials: 'JL', bg: 'hsl(280,55%,88%)', fg: 'hsl(280,40%,34%)', action: 'Closed issue #89',            time: '6h' },
]

// ─── TabSwitcher ──────────────────────────────────────────────────────────────

function TabSwitcher() {
  const [activeIdx, setActiveIdx]   = useState(0)
  const [pill, setPill]             = useState<{ left: number; width: number } | null>(null)
  const [contentKey, setContentKey] = useState(0)
  const tabEls = useRef<(HTMLButtonElement | null)[]>([])
  const barRef = useRef<HTMLDivElement>(null)

  const measure = (idx: number) => {
    const el  = tabEls.current[idx]
    const bar = barRef.current
    if (!el || !bar) return
    const er = el.getBoundingClientRect()
    const br = bar.getBoundingClientRect()
    setPill({ left: er.left - br.left, width: er.width })
  }

  // Measure on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => measure(0))
    return () => cancelAnimationFrame(raf)
  }, []) // eslint-disable-line

  // Measure on tab change
  useEffect(() => {
    const raf = requestAnimationFrame(() => measure(activeIdx))
    return () => cancelAnimationFrame(raf)
  }, [activeIdx]) // eslint-disable-line

  // Re-measure on resize
  useEffect(() => {
    const onResize = () => measure(activeIdx)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeIdx]) // eslint-disable-line

  const handleSelect = (idx: number) => {
    if (idx === activeIdx) return
    setActiveIdx(idx)
    setContentKey(k => k + 1)
  }

  const panels = [
    // Overview
    <div key="o" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {STATS.map(row => (
        <div
          key={row.label}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '9px 12px',
            background: 'rgba(10,10,10,0.025)',
            borderRadius: 9,
            border: '1px solid rgba(10,10,10,0.05)',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(10,10,10,0.5)', letterSpacing: '-0.01em' }}>
            {row.label}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
              {row.value}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 600, color: '#16a34a',
              background: 'rgba(22,163,74,0.1)', padding: '2px 5px', borderRadius: 5,
            }}>
              {row.delta}
            </span>
          </div>
        </div>
      ))}
    </div>,

    // Updates
    <div key="u" style={{ display: 'flex', flexDirection: 'column' }}>
      {UPDATES.map((item, i) => (
        <div
          key={item.title}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 0',
            borderBottom: i < UPDATES.length - 1 ? '1px solid rgba(10,10,10,0.06)' : 'none',
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.dot, flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
            {item.title}
          </span>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(10,10,10,0.35)' }}>
            {item.time}
          </span>
        </div>
      ))}
    </div>,

    // Activity
    <div key="a" style={{ display: 'flex', flexDirection: 'column' }}>
      {ACTIVITY.map((item, i) => (
        <div
          key={item.user}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 0',
            borderBottom: i < ACTIVITY.length - 1 ? '1px solid rgba(10,10,10,0.06)' : 'none',
          }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: item.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: item.fg,
            flexShrink: 0,
          }}>
            {item.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#0a0a0a' }}>{item.user} </span>
            <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(10,10,10,0.45)' }}>{item.action}</span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 500, color: 'rgba(10,10,10,0.3)', flexShrink: 0 }}>
            {item.time}
          </span>
        </div>
      ))}
    </div>,
  ]

  return (
    <>
      <style>{`@keyframes tsIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{
        width: 320,
        background: '#fff',
        borderRadius: 16,
        border: '1px solid rgba(10,10,10,0.08)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
        padding: '14px',
        fontFamily: FONT,
      }}>
        {/* Tab bar */}
        <div
          ref={barRef}
          style={{
            position: 'relative',
            display: 'flex',
            background: 'rgba(10,10,10,0.04)',
            borderRadius: 10,
            padding: 3,
            marginBottom: 14,
          }}
        >
          {/* Sliding pill */}
          {pill && (
            <div style={{
              position: 'absolute',
              top: 3, bottom: 3,
              left: pill.left,
              width: pill.width,
              background: '#fff',
              borderRadius: 7,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
              transition: 'left 220ms cubic-bezier(0.32, 0.72, 0, 1), width 150ms ease',
              pointerEvents: 'none',
            }} />
          )}

          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              ref={el => { tabEls.current[i] = el }}
              onClick={() => handleSelect(i)}
              style={{
                flex: 1,
                position: 'relative', zIndex: 1,
                padding: '6px 10px',
                border: 'none', background: 'none',
                borderRadius: 7, cursor: 'pointer',
                fontSize: 12, fontWeight: 600,
                color: activeIdx === i ? '#0a0a0a' : 'rgba(10,10,10,0.38)',
                letterSpacing: '-0.01em',
                transition: 'color 200ms ease',
                fontFamily: FONT,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Animated content */}
        <div key={contentKey} style={{ animation: 'tsIn 180ms ease' }}>
          {panels[activeIdx]}
        </div>
      </div>
    </>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'updates',  label: 'Updates'  },
  { id: 'activity', label: 'Activity' },
]

const STATS = [
  { label: 'Total Users',  value: '12,847',  delta: '+12%' },
  { label: 'Active Today', value: '2,391',   delta: '+4%'  },
  { label: 'Revenue MTD',  value: '$84,200', delta: '+8%'  },
]

const UPDATES = [
  { title: 'New feature shipped',       time: '2h ago',    dot: '#2563eb' },
  { title: 'Server migration complete', time: '5h ago',    dot: '#16a34a' },
  { title: 'Design review scheduled',   time: 'Yesterday', dot: '#d97706' },
]

const ACTIVITY = [
  { user: 'Alex K.',   initials: 'AK', bg: 'hsl(210,65%,88%)', fg: 'hsl(210,50%,32%)', action: 'Commented on Dashboard v2', time: '1h' },
  { user: 'Sam T.',    initials: 'ST', bg: 'hsl(150,60%,86%)', fg: 'hsl(150,45%,28%)', action: 'Merged pull request #142',   time: '3h' },
  { user: 'Jordan L.', initials: 'JL', bg: 'hsl(280,55%,88%)', fg: 'hsl(280,40%,34%)', action: 'Closed issue #89',           time: '6h' },
]

export function TabSwitcher() {
  const [activeIdx, setActiveIdx]   = useState(0)
  const [pill, setPill]             = useState<{ left: number; width: number } | null>(null)
  const [contentKey, setContentKey] = useState(0)
  const tabEls = useRef<(HTMLButtonElement | null)[]>([])
  const barRef = useRef<HTMLDivElement>(null)

  const measure = (idx: number) => {
    const el  = tabEls.current[idx]
    const bar = barRef.current
    if (!el || !bar) return
    const er = el.getBoundingClientRect()
    const br = bar.getBoundingClientRect()
    setPill({ left: er.left - br.left, width: er.width })
  }

  useEffect(() => {
    const raf = requestAnimationFrame(() => measure(0))
    return () => cancelAnimationFrame(raf)
  }, []) // eslint-disable-line

  useEffect(() => {
    const raf = requestAnimationFrame(() => measure(activeIdx))
    return () => cancelAnimationFrame(raf)
  }, [activeIdx]) // eslint-disable-line

  useEffect(() => {
    const onResize = () => measure(activeIdx)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeIdx]) // eslint-disable-line

  const handleSelect = (idx: number) => {
    if (idx === activeIdx) return
    setActiveIdx(idx)
    setContentKey(k => k + 1)
  }

  const panels = [
    <div key="o" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {STATS.map(row => (
        <div key={row.label} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '9px 12px',
          background: 'rgba(10,10,10,0.025)',
          borderRadius: 9,
          border: '1px solid rgba(10,10,10,0.05)',
        }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(10,10,10,0.5)', letterSpacing: '-0.01em' }}>
            {row.label}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
              {row.value}
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#16a34a', background: 'rgba(22,163,74,0.1)', padding: '2px 5px', borderRadius: 5 }}>
              {row.delta}
            </span>
          </div>
        </div>
      ))}
    </div>,

    <div key="u" style={{ display: 'flex', flexDirection: 'column' }}>
      {UPDATES.map((item, i) => (
        <div key={item.title} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 0',
          borderBottom: i < UPDATES.length - 1 ? '1px solid rgba(10,10,10,0.06)' : 'none',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.dot, flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>{item.title}</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(10,10,10,0.35)' }}>{item.time}</span>
        </div>
      ))}
    </div>,

    <div key="a" style={{ display: 'flex', flexDirection: 'column' }}>
      {ACTIVITY.map((item, i) => (
        <div key={item.user} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 0',
          borderBottom: i < ACTIVITY.length - 1 ? '1px solid rgba(10,10,10,0.06)' : 'none',
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: item.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: item.fg, flexShrink: 0,
          }}>
            {item.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#0a0a0a' }}>{item.user} </span>
            <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(10,10,10,0.45)' }}>{item.action}</span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 500, color: 'rgba(10,10,10,0.3)', flexShrink: 0 }}>{item.time}</span>
        </div>
      ))}
    </div>,
  ]

  return (
    <>
      <style>{\`@keyframes tsIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }\`}</style>
      <div style={{
        width: 320,
        background: '#fff',
        borderRadius: 16,
        border: '1px solid rgba(10,10,10,0.08)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
        padding: '14px',
        fontFamily: FONT,
      }}>
        <div ref={barRef} style={{ position: 'relative', display: 'flex', background: 'rgba(10,10,10,0.04)', borderRadius: 10, padding: 3, marginBottom: 14 }}>
          {pill && (
            <div style={{
              position: 'absolute', top: 3, bottom: 3,
              left: pill.left, width: pill.width,
              background: '#fff', borderRadius: 7,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
              transition: 'left 220ms cubic-bezier(0.32, 0.72, 0, 1), width 150ms ease',
              pointerEvents: 'none',
            }} />
          )}
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              ref={el => { tabEls.current[i] = el }}
              onClick={() => handleSelect(i)}
              style={{
                flex: 1, position: 'relative', zIndex: 1,
                padding: '6px 10px', border: 'none', background: 'none',
                borderRadius: 7, cursor: 'pointer',
                fontSize: 12, fontWeight: 600,
                color: activeIdx === i ? '#0a0a0a' : 'rgba(10,10,10,0.38)',
                letterSpacing: '-0.01em',
                transition: 'color 200ms ease', fontFamily: FONT,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div key={contentKey} style={{ animation: 'tsIn 180ms ease' }}>
          {panels[activeIdx]}
        </div>
      </div>
    </>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TabSwitcherPage() {
  return (
    <main style={{ backgroundColor: 'var(--bg, #ffffff)', minHeight: '100vh', fontFamily: FONT }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: 20,
      }}>
        <TabSwitcher />
        <p style={{
          margin: 0, fontSize: 12,
          color: 'rgba(0,0,0,0.35)', fontWeight: 500,
          letterSpacing: '-0.01em', fontFamily: FONT,
        }}>
          Click tabs to switch · pill indicator slides smoothly
        </p>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: 760, margin: '0 auto' }}>
        <p style={{
          fontSize: 11, fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'var(--text-muted, rgba(10,10,10,0.4))', marginBottom: 12,
        }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 20, overflowX: 'auto' }}>
          <pre style={{
            margin: 0,
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
            fontSize: 12, lineHeight: '1.65',
            color: '#e5e5e5', whiteSpace: 'pre', overflowX: 'auto',
          }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
