'use client'

import { useState, useRef, useEffect } from 'react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const TABS = [
  {
    id: 'overview',
    label: 'Overview',
    heading: 'Project Overview',
    body: 'A high-level summary of goals, scope, and key milestones. Track progress across all active initiatives and surface blockers before they compound.',
    tags: ['In Progress', 'Q2 2025'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    heading: 'Performance Metrics',
    body: 'Real-time engagement, retention, and conversion data across all acquisition channels — sliced by cohort, device, and region.',
    tags: ['↑ 12.4%', 'Last 30 days'],
  },
  {
    id: 'settings',
    label: 'Settings',
    heading: 'Configuration',
    body: 'Manage workspace preferences, API keys, integrations, and notification rules. Changes propagate across all connected environments instantly.',
    tags: ['Admin only'],
  },
  {
    id: 'team',
    label: 'Team',
    heading: 'Members & Roles',
    body: 'Invite collaborators, assign roles, and configure access permissions for each workspace resource. All changes are logged for audit.',
    tags: ['8 members', 'Pro plan'],
  },
]

// ─── TabSwitcher ──────────────────────────────────────────────────────────────

function TabSwitcher() {
  const [activeId, setActiveId] = useState('overview')
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const [animated, setAnimated] = useState(false)
  const [displayTab, setDisplayTab] = useState(TABS[0])
  const [contentOpacity, setContentOpacity] = useState(1)
  const [contentY, setContentY] = useState(0)

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const listRef = useRef<HTMLDivElement>(null)
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeIndex = TABS.findIndex(t => t.id === activeId)

  // Measure indicator position
  useEffect(() => {
    const el = tabRefs.current[activeIndex]
    const list = listRef.current
    if (!el || !list) return
    const listRect = list.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    setIndicator({ left: elRect.left - listRect.left, width: elRect.width })
    // Animate on all renders after the first
    setAnimated(true)
  }, [activeId, activeIndex])

  // Crossfade content on tab change
  useEffect(() => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current)
    setContentOpacity(0)
    setContentY(6)
    fadeTimer.current = setTimeout(() => {
      setDisplayTab(TABS.find(t => t.id === activeId)!)
      setContentOpacity(1)
      setContentY(0)
    }, 110)
    return () => { if (fadeTimer.current) clearTimeout(fadeTimer.current) }
  }, [activeId])

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = TABS[(idx + 1) % TABS.length]
      setActiveId(next.id)
      tabRefs.current[(idx + 1) % TABS.length]?.focus()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = TABS[(idx - 1 + TABS.length) % TABS.length]
      setActiveId(prev.id)
      tabRefs.current[(idx - 1 + TABS.length) % TABS.length]?.focus()
    }
  }

  return (
    <div style={{ width: '480px', maxWidth: '100%' }}>
      {/* ── Tab bar ── */}
      <div
        ref={listRef}
        role="tablist"
        style={{
          position: 'relative',
          display: 'inline-flex',
          background: 'rgba(10,10,10,0.06)',
          borderRadius: '10px',
          padding: '3px',
          gap: 0,
        }}
      >
        {/* Sliding pill */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '3px',
            height: 'calc(100% - 6px)',
            left: indicator.left,
            width: indicator.width,
            background: '#fff',
            borderRadius: '7px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.14), 0 0 0 0.5px rgba(0,0,0,0.06)',
            transition: animated
              ? 'left 220ms cubic-bezier(0.4,0,0.2,1), width 220ms cubic-bezier(0.4,0,0.2,1)'
              : 'none',
            pointerEvents: 'none',
          }}
        />

        {TABS.map((tab, idx) => (
          <button
            key={tab.id}
            ref={el => { tabRefs.current[idx] = el }}
            role="tab"
            aria-selected={tab.id === activeId}
            tabIndex={tab.id === activeId ? 0 : -1}
            onClick={() => setActiveId(tab.id)}
            onKeyDown={e => handleKeyDown(e, idx)}
            style={{
              position: 'relative',
              zIndex: 1,
              background: 'none',
              border: 'none',
              borderRadius: '7px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              cursor: 'pointer',
              color: tab.id === activeId ? '#0a0a0a' : 'rgba(10,10,10,0.46)',
              transition: 'color 200ms ease',
              whiteSpace: 'nowrap',
              outline: 'none',
              userSelect: 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content panel ── */}
      <div
        role="tabpanel"
        style={{
          marginTop: '10px',
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: '14px',
          padding: '22px 24px',
          minHeight: '148px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          opacity: contentOpacity,
          transform: `translateY(${contentY}px)`,
          transition: 'opacity 110ms ease, transform 110ms ease',
        }}
      >
        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '13px' }}>
          {displayTab.tags.map(tag => (
            <span
              key={tag}
              style={{
                display: 'inline-block',
                padding: '2px 9px',
                background: 'rgba(10,10,10,0.05)',
                border: '1px solid rgba(10,10,10,0.08)',
                borderRadius: '20px',
                fontSize: '11.5px',
                fontWeight: 500,
                color: 'rgba(10,10,10,0.55)',
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 style={{
          margin: '0 0 7px',
          fontSize: '14px',
          fontWeight: 600,
          color: '#0a0a0a',
          letterSpacing: '-0.02em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}>
          {displayTab.heading}
        </h3>

        <p style={{
          margin: 0,
          fontSize: '13px',
          color: 'rgba(10,10,10,0.58)',
          letterSpacing: '-0.01em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          lineHeight: '1.65',
        }}>
          {displayTab.body}
        </p>
      </div>
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect } from 'react'

const TABS = [
  {
    id: 'overview',
    label: 'Overview',
    heading: 'Project Overview',
    body: 'A high-level summary of goals, scope, and key milestones.',
    tags: ['In Progress', 'Q2 2025'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    heading: 'Performance Metrics',
    body: 'Real-time engagement, retention, and conversion data.',
    tags: ['↑ 12.4%', 'Last 30 days'],
  },
  {
    id: 'settings',
    label: 'Settings',
    heading: 'Configuration',
    body: 'Manage workspace preferences, API keys, and integrations.',
    tags: ['Admin only'],
  },
  {
    id: 'team',
    label: 'Team',
    heading: 'Members & Roles',
    body: 'Invite collaborators, assign roles, and configure access permissions.',
    tags: ['8 members'],
  },
]

export function TabSwitcher() {
  const [activeId, setActiveId] = useState('overview')
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const [animated, setAnimated] = useState(false)
  const [displayTab, setDisplayTab] = useState(TABS[0])
  const [contentOpacity, setContentOpacity] = useState(1)
  const [contentY, setContentY] = useState(0)

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const listRef = useRef<HTMLDivElement>(null)
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeIndex = TABS.findIndex(t => t.id === activeId)

  useEffect(() => {
    const el = tabRefs.current[activeIndex]
    const list = listRef.current
    if (!el || !list) return
    const listRect = list.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    setIndicator({ left: elRect.left - listRect.left, width: elRect.width })
    setAnimated(true)
  }, [activeId, activeIndex])

  useEffect(() => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current)
    setContentOpacity(0)
    setContentY(6)
    fadeTimer.current = setTimeout(() => {
      setDisplayTab(TABS.find(t => t.id === activeId)!)
      setContentOpacity(1)
      setContentY(0)
    }, 110)
    return () => { if (fadeTimer.current) clearTimeout(fadeTimer.current) }
  }, [activeId])

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = TABS[(idx + 1) % TABS.length]
      setActiveId(next.id)
      tabRefs.current[(idx + 1) % TABS.length]?.focus()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = TABS[(idx - 1 + TABS.length) % TABS.length]
      setActiveId(prev.id)
      tabRefs.current[(idx - 1 + TABS.length) % TABS.length]?.focus()
    }
  }

  return (
    <div style={{ width: '480px', maxWidth: '100%' }}>
      <div
        ref={listRef}
        role="tablist"
        style={{
          position: 'relative',
          display: 'inline-flex',
          background: 'rgba(10,10,10,0.06)',
          borderRadius: '10px',
          padding: '3px',
          gap: 0,
        }}
      >
        {/* Sliding pill */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '3px',
            height: 'calc(100% - 6px)',
            left: indicator.left,
            width: indicator.width,
            background: '#fff',
            borderRadius: '7px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.14), 0 0 0 0.5px rgba(0,0,0,0.06)',
            transition: animated
              ? 'left 220ms cubic-bezier(0.4,0,0.2,1), width 220ms cubic-bezier(0.4,0,0.2,1)'
              : 'none',
            pointerEvents: 'none',
          }}
        />

        {TABS.map((tab, idx) => (
          <button
            key={tab.id}
            ref={el => { tabRefs.current[idx] = el }}
            role="tab"
            aria-selected={tab.id === activeId}
            tabIndex={tab.id === activeId ? 0 : -1}
            onClick={() => setActiveId(tab.id)}
            onKeyDown={e => handleKeyDown(e, idx)}
            style={{
              position: 'relative',
              zIndex: 1,
              background: 'none',
              border: 'none',
              borderRadius: '7px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              cursor: 'pointer',
              color: tab.id === activeId ? '#0a0a0a' : 'rgba(10,10,10,0.46)',
              transition: 'color 200ms ease',
              whiteSpace: 'nowrap',
              outline: 'none',
              userSelect: 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        style={{
          marginTop: '10px',
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: '14px',
          padding: '22px 24px',
          minHeight: '148px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          opacity: contentOpacity,
          transform: \`translateY(\${contentY}px)\`,
          transition: 'opacity 110ms ease, transform 110ms ease',
        }}
      >
        <div style={{ display: 'flex', gap: '5px', marginBottom: '13px', flexWrap: 'wrap' }}>
          {displayTab.tags.map(tag => (
            <span
              key={tag}
              style={{
                display: 'inline-block',
                padding: '2px 9px',
                background: 'rgba(10,10,10,0.05)',
                border: '1px solid rgba(10,10,10,0.08)',
                borderRadius: '20px',
                fontSize: '11.5px',
                fontWeight: 500,
                color: 'rgba(10,10,10,0.55)',
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 style={{
          margin: '0 0 7px',
          fontSize: '14px',
          fontWeight: 600,
          color: '#0a0a0a',
          letterSpacing: '-0.02em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}>
          {displayTab.heading}
        </h3>

        <p style={{
          margin: 0,
          fontSize: '13px',
          color: 'rgba(10,10,10,0.58)',
          letterSpacing: '-0.01em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          lineHeight: '1.65',
        }}>
          {displayTab.body}
        </p>
      </div>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TabSwitcherPage() {
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
      }}>
        <TabSwitcher />
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
