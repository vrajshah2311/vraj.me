'use client'

import { useState, useRef, useLayoutEffect } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TabItem {
  id: string
  label: string
  content: React.ReactNode
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function Tabs({ items, defaultTab }: { items: TabItem[]; defaultTab?: string }) {
  const [active, setActive] = useState(defaultTab ?? items[0]?.id ?? '')
  const [ind, setInd] = useState({ left: 0, width: 0 })
  const [ready, setReady] = useState(false)
  const [height, setHeight] = useState(0)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const barRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = tabRefs.current[active]
    const bar = barRef.current
    if (el && bar) {
      const br = bar.getBoundingClientRect()
      const er = el.getBoundingClientRect()
      setInd({ left: er.left - br.left, width: er.width })
    }
    const c = contentRefs.current[active]
    if (c) setHeight(c.offsetHeight)
    setReady(true)
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
      {/* Tab bar */}
      <div
        ref={barRef}
        style={{
          display: 'inline-flex',
          position: 'relative',
          background: 'rgba(10,10,10,0.05)',
          borderRadius: '10px',
          padding: '3px',
        }}
      >
        {/* Sliding pill */}
        <div
          style={{
            position: 'absolute',
            top: 3,
            bottom: 3,
            left: ind.left,
            width: ind.width,
            background: '#fff',
            borderRadius: '7px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
            transition: ready
              ? 'left 220ms cubic-bezier(0.4,0,0.2,1), width 220ms cubic-bezier(0.4,0,0.2,1)'
              : 'none',
            pointerEvents: 'none',
          }}
        />
        {items.map(tab => (
          <button
            key={tab.id}
            ref={el => { tabRefs.current[tab.id] = el }}
            onClick={() => setActive(tab.id)}
            style={{
              position: 'relative',
              zIndex: 1,
              padding: '6px 14px',
              border: 'none',
              background: 'none',
              borderRadius: '7px',
              fontSize: '13px',
              fontWeight: 500,
              color: active === tab.id ? '#0a0a0a' : 'rgba(10,10,10,0.45)',
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: 'color 200ms ease',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content area — height animates between tabs */}
      <div
        style={{
          position: 'relative',
          marginTop: 16,
          height: height || undefined,
          overflow: 'hidden',
          transition: ready ? 'height 200ms cubic-bezier(0.4,0,0.2,1)' : 'none',
        }}
      >
        {items.map(tab => (
          <div
            key={tab.id}
            ref={el => { contentRefs.current[tab.id] = el }}
            aria-hidden={active !== tab.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              opacity: active === tab.id ? 1 : 0,
              transform: active === tab.id ? 'none' : 'translateY(5px)',
              transition: 'opacity 180ms ease, transform 180ms ease',
              pointerEvents: active === tab.id ? 'auto' : 'none',
            }}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Demo content ─────────────────────────────────────────────────────────────

function OverviewContent() {
  return (
    <div>
      <p style={{
        margin: '0 0 16px',
        fontSize: '13px',
        color: 'rgba(10,10,10,0.55)',
        lineHeight: '1.65',
        letterSpacing: '-0.01em',
      }}>
        A shared design system with components, tokens, and documentation
        for the product team. Maintained weekly across three platforms.
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { value: '24', label: 'Components' },
          { value: '8', label: 'Members' },
          { value: '12', label: 'Open PRs' },
        ].map(stat => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              padding: '10px 12px',
              background: 'rgba(10,10,10,0.03)',
              border: '1px solid rgba(10,10,10,0.06)',
              borderRadius: '8px',
            }}
          >
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 600, letterSpacing: '-0.03em', color: '#0a0a0a' }}>
              {stat.value}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(10,10,10,0.4)', fontWeight: 500, letterSpacing: '-0.005em' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

const MEMBERS = [
  { initials: 'AH', name: 'Alex Harper',   role: 'Design Lead', color: '#6366f1' },
  { initials: 'MR', name: 'Maria Rossi',   role: 'Frontend',    color: '#0ea5e9' },
  { initials: 'JS', name: 'Jordan Smith',  role: 'Product',     color: '#10b981' },
  { initials: 'KL', name: 'Kai Lin',       role: 'Backend',     color: '#f59e0b' },
  { initials: 'TP', name: 'Taylor Park',   role: 'Research',    color: '#ec4899' },
]

function TeamContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {MEMBERS.map(m => (
        <div key={m.initials} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: m.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.01em',
            flexShrink: 0,
          }}>
            {m.initials}
          </div>
          <p style={{ flex: 1, margin: 0, fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
            {m.name}
          </p>
          <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.38)', fontWeight: 500 }}>
            {m.role}
          </span>
        </div>
      ))}
    </div>
  )
}

const ACTIVITY = [
  { user: 'SB', action: 'pushed 3 new components',        time: '2m ago',  color: '#8b5cf6', name: 'Sarah B.' },
  { user: 'AH', action: 'updated token values',           time: '14m ago', color: '#6366f1', name: 'Alex H.'  },
  { user: 'MR', action: 'opened PR #24 · Button states',  time: '1h ago',  color: '#0ea5e9', name: 'Maria R.' },
  { user: 'JS', action: 'left a comment on the spec',     time: '3h ago',  color: '#10b981', name: 'Jordan S.'},
  { user: 'KL', action: 'merged feat/dark-mode into main', time: '5h ago', color: '#f59e0b', name: 'Kai L.'   },
]

function ActivityContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {ACTIVITY.map(a => (
        <div key={a.user + a.time} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: a.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
            marginTop: 1,
          }}>
            {a.user}
          </div>
          <p style={{ flex: 1, margin: 0, fontSize: '12px', color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: '1.5' }}>
            <span style={{ fontWeight: 600 }}>{a.name}</span>{' '}{a.action}
          </p>
          <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.32)', fontWeight: 500, whiteSpace: 'nowrap', paddingTop: 1 }}>
            {a.time}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function Demo() {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.07)',
      width: '360px',
      maxWidth: '100%',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
          Design System
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(10,10,10,0.4)', fontWeight: 500, letterSpacing: '-0.01em' }}>
          vrajshah2311 / ds
        </p>
      </div>

      <Tabs
        defaultTab="overview"
        items={[
          { id: 'overview', label: 'Overview', content: <OverviewContent /> },
          { id: 'team',     label: 'Team',     content: <TeamContent /> },
          { id: 'activity', label: 'Activity', content: <ActivityContent /> },
        ]}
      />
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useLayoutEffect } from 'react'

interface TabItem {
  id: string
  label: string
  content: React.ReactNode
}

export function Tabs({ items, defaultTab }: { items: TabItem[]; defaultTab?: string }) {
  const [active, setActive] = useState(defaultTab ?? items[0]?.id ?? '')
  const [ind, setInd] = useState({ left: 0, width: 0 })
  const [ready, setReady] = useState(false)
  const [height, setHeight] = useState(0)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const barRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = tabRefs.current[active]
    const bar = barRef.current
    if (el && bar) {
      const br = bar.getBoundingClientRect()
      const er = el.getBoundingClientRect()
      setInd({ left: er.left - br.left, width: er.width })
    }
    const c = contentRefs.current[active]
    if (c) setHeight(c.offsetHeight)
    setReady(true)
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
      <div
        ref={barRef}
        style={{
          display: 'inline-flex',
          position: 'relative',
          background: 'rgba(10,10,10,0.05)',
          borderRadius: '10px',
          padding: '3px',
        }}
      >
        {/* Sliding pill indicator */}
        <div
          style={{
            position: 'absolute',
            top: 3, bottom: 3,
            left: ind.left, width: ind.width,
            background: '#fff',
            borderRadius: '7px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
            transition: ready
              ? 'left 220ms cubic-bezier(0.4,0,0.2,1), width 220ms cubic-bezier(0.4,0,0.2,1)'
              : 'none',
            pointerEvents: 'none',
          }}
        />
        {items.map(tab => (
          <button
            key={tab.id}
            ref={el => { tabRefs.current[tab.id] = el }}
            onClick={() => setActive(tab.id)}
            style={{
              position: 'relative', zIndex: 1,
              padding: '6px 14px',
              border: 'none', background: 'none',
              borderRadius: '7px',
              fontSize: '13px', fontWeight: 500,
              color: active === tab.id ? '#0a0a0a' : 'rgba(10,10,10,0.45)',
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: 'color 200ms ease',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content area — height animates between tabs */}
      <div
        style={{
          position: 'relative',
          marginTop: 16,
          height: height || undefined,
          overflow: 'hidden',
          transition: ready ? 'height 200ms cubic-bezier(0.4,0,0.2,1)' : 'none',
        }}
      >
        {items.map(tab => (
          <div
            key={tab.id}
            ref={el => { contentRefs.current[tab.id] = el }}
            aria-hidden={active !== tab.id}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              opacity: active === tab.id ? 1 : 0,
              transform: active === tab.id ? 'none' : 'translateY(5px)',
              transition: 'opacity 180ms ease, transform 180ms ease',
              pointerEvents: active === tab.id ? 'auto' : 'none',
            }}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}

// Usage:
// <Tabs
//   defaultTab="tab1"
//   items={[
//     { id: 'tab1', label: 'Overview', content: <div>Overview</div> },
//     { id: 'tab2', label: 'Details',  content: <div>Details</div>  },
//     { id: 'tab3', label: 'Activity', content: <div>Activity</div> },
//   ]}
// />`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TabsPage() {
  return (
    <main style={{
      backgroundColor: 'var(--bg, #ffffff)',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: '12px',
      }}>
        <p style={{
          margin: '0 0 12px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.3)',
        }}>
          Animated Tab Switcher
        </p>
        <Demo />
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
