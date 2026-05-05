'use client'

import { useState, useRef, useEffect } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tab {
  id: string
  label: string
}

// ─── Sliding indicator logic ──────────────────────────────────────────────────

function measureTab(
  id: string,
  tabRefs: React.MutableRefObject<Map<string, HTMLButtonElement>>,
  containerRef: React.RefObject<HTMLDivElement>,
): { left: number; width: number } | null {
  const btn = tabRefs.current.get(id)
  const container = containerRef.current
  if (!btn || !container) return null
  const b = btn.getBoundingClientRect()
  const c = container.getBoundingClientRect()
  return { left: b.left - c.left, width: b.width }
}

// ─── Pill Tab Switcher ────────────────────────────────────────────────────────

function PillTabs({
  tabs,
  activeId,
  onChange,
}: {
  tabs: Tab[]
  activeId: string
  onChange: (id: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const m = measureTab(activeId, tabRefs, containerRef)
    if (m) {
      setIndicator(m)
      if (!ready) requestAnimationFrame(() => setReady(true))
    }
    const ro = new ResizeObserver(() => {
      const m2 = measureTab(activeId, tabRefs, containerRef)
      if (m2) setIndicator(m2)
    })
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [activeId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        background: 'rgba(10,10,10,0.06)',
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
          left: indicator.left,
          width: indicator.width,
          background: '#fff',
          borderRadius: '7px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
          transition: ready
            ? 'left 200ms cubic-bezier(0.32,0.72,0,1), width 200ms cubic-bezier(0.32,0.72,0,1)'
            : 'none',
          pointerEvents: 'none',
        }}
      />
      {tabs.map(tab => (
        <button
          key={tab.id}
          ref={el => {
            if (el) tabRefs.current.set(tab.id, el)
            else tabRefs.current.delete(tab.id)
          }}
          onClick={() => onChange(tab.id)}
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '7px 16px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: activeId === tab.id ? 600 : 500,
            color: activeId === tab.id ? '#0a0a0a' : 'rgba(10,10,10,0.45)',
            letterSpacing: '-0.01em',
            fontFamily: FONT,
            transition: 'color 180ms ease',
            whiteSpace: 'nowrap',
            borderRadius: '7px',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ─── Underline Tab Switcher ───────────────────────────────────────────────────

function UnderlineTabs({
  tabs,
  activeId,
  onChange,
}: {
  tabs: Tab[]
  activeId: string
  onChange: (id: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const m = measureTab(activeId, tabRefs, containerRef)
    if (m) {
      setIndicator(m)
      if (!ready) requestAnimationFrame(() => setReady(true))
    }
    const ro = new ResizeObserver(() => {
      const m2 = measureTab(activeId, tabRefs, containerRef)
      if (m2) setIndicator(m2)
    })
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [activeId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        borderBottom: '1px solid rgba(10,10,10,0.1)',
      }}
    >
      {/* Sliding underline */}
      <div
        style={{
          position: 'absolute',
          bottom: -1,
          height: 2,
          left: indicator.left,
          width: indicator.width,
          background: '#0a0a0a',
          borderRadius: '2px 2px 0 0',
          transition: ready
            ? 'left 200ms cubic-bezier(0.32,0.72,0,1), width 200ms cubic-bezier(0.32,0.72,0,1)'
            : 'none',
          pointerEvents: 'none',
        }}
      />
      {tabs.map(tab => (
        <button
          key={tab.id}
          ref={el => {
            if (el) tabRefs.current.set(tab.id, el)
            else tabRefs.current.delete(tab.id)
          }}
          onClick={() => onChange(tab.id)}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: activeId === tab.id ? 600 : 500,
            color: activeId === tab.id ? '#0a0a0a' : 'rgba(10,10,10,0.4)',
            letterSpacing: '-0.01em',
            fontFamily: FONT,
            transition: 'color 180ms ease',
            whiteSpace: 'nowrap',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ─── Animated content panel ───────────────────────────────────────────────────

function FadePanel({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div
      key={id}
      style={{
        animation: 'tabFadeIn 180ms ease forwards',
      }}
    >
      {children}
    </div>
  )
}

// ─── Demo: pill variant with content ─────────────────────────────────────────

const PILL_TABS: Tab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'usage',    label: 'Usage' },
  { id: 'billing',  label: 'Billing' },
  { id: 'team',     label: 'Team' },
]

const STAT_ROWS = [
  [{ label: 'Revenue',    value: '$48,240',  delta: '+12.4%', up: true  },
   { label: 'Users',      value: '3,891',    delta: '+8.2%',  up: true  }],
  [{ label: 'Churn rate', value: '1.8%',     delta: '-0.3%',  up: true  },
   { label: 'Avg. MRR',   value: '$12.40',   delta: '+2.1%',  up: true  }],
]

const USAGE_BARS = [
  { label: 'API calls',   used: 72 },
  { label: 'Storage',     used: 45 },
  { label: 'Bandwidth',   used: 88 },
]

const TEAM_MEMBERS = [
  { initials: 'VS', name: 'Vraj Shah',    role: 'Owner',  color: '#0a0a0a' },
  { initials: 'AK', name: 'Anya Kapoor',  role: 'Admin',  color: '#2563eb' },
  { initials: 'JL', name: 'Jake Liu',     role: 'Member', color: '#16a34a' },
]

function OverviewContent() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
      {STAT_ROWS.flat().map(s => (
        <div
          key={s.label}
          style={{
            background: 'rgba(10,10,10,0.03)',
            border: '1px solid rgba(10,10,10,0.07)',
            borderRadius: '10px',
            padding: '14px 16px',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em', marginBottom: '6px' }}>
            {s.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.03em' }}>{s.value}</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: s.up ? '#16a34a' : '#dc2626', letterSpacing: '-0.01em' }}>{s.delta}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function UsageContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {USAGE_BARS.map(b => (
        <div key={b.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>{b.label}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: b.used > 80 ? '#dc2626' : 'rgba(10,10,10,0.5)', letterSpacing: '-0.01em' }}>{b.used}%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(10,10,10,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${b.used}%`,
              background: b.used > 80 ? '#dc2626' : '#0a0a0a',
              borderRadius: '99px',
              transition: 'width 600ms cubic-bezier(0.32,0.72,0,1)',
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function BillingContent() {
  return (
    <div style={{
      background: 'rgba(10,10,10,0.03)',
      border: '1px solid rgba(10,10,10,0.07)',
      borderRadius: '10px',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
    }}>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)', marginBottom: '4px' }}>Current plan</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em' }}>Pro</div>
        <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.45)', marginTop: '2px' }}>$49 / month · renews Jun 1</div>
      </div>
      <button style={{
        padding: '8px 14px',
        borderRadius: '8px',
        border: '1px solid rgba(10,10,10,0.12)',
        background: '#fff',
        fontSize: '12px',
        fontWeight: 600,
        color: '#0a0a0a',
        cursor: 'pointer',
        fontFamily: FONT,
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
      }}>
        Manage
      </button>
    </div>
  )
}

function TeamContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {TEAM_MEMBERS.map(m => (
        <div
          key={m.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 10px',
            borderRadius: '8px',
            transition: 'background 150ms ease',
            cursor: 'default',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: m.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff', letterSpacing: '0' }}>{m.initials}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: '17px' }}>{m.name}</div>
            <div style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em' }}>{m.role}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

const PILL_CONTENT: Record<string, React.ReactNode> = {
  overview: <OverviewContent />,
  usage:    <UsageContent />,
  billing:  <BillingContent />,
  team:     <TeamContent />,
}

function PillDemo() {
  const [activeId, setActiveId] = useState('overview')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '380px' }}>
      <PillTabs tabs={PILL_TABS} activeId={activeId} onChange={setActiveId} />
      <div style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '12px',
        padding: '18px',
        minHeight: '130px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <FadePanel id={activeId}>{PILL_CONTENT[activeId]}</FadePanel>
      </div>
    </div>
  )
}

// ─── Demo: underline variant ──────────────────────────────────────────────────

const UNDERLINE_TABS: Tab[] = [
  { id: 'all',      label: 'All' },
  { id: 'active',   label: 'Active' },
  { id: 'archived', label: 'Archived' },
  { id: 'draft',    label: 'Draft' },
]

const COUNTS: Record<string, number> = { all: 24, active: 18, archived: 4, draft: 2 }

const LIST_ITEMS = [
  { name: 'Q2 Brand Refresh',  status: 'active',   date: 'May 2' },
  { name: 'Onboarding Flow v3', status: 'active',  date: 'Apr 28' },
  { name: 'Landing Redesign',  status: 'draft',    date: 'Apr 20' },
  { name: 'Icon System',       status: 'archived', date: 'Mar 15' },
]

function UnderlineDemo() {
  const [activeId, setActiveId] = useState('all')

  const filtered = activeId === 'all'
    ? LIST_ITEMS
    : LIST_ITEMS.filter(i => i.status === activeId)

  const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
    active:   { bg: '#f0fdf4', text: '#16a34a' },
    draft:    { bg: '#fffbeb', text: '#d97706' },
    archived: { bg: 'rgba(10,10,10,0.05)', text: 'rgba(10,10,10,0.4)' },
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '380px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <UnderlineTabs tabs={UNDERLINE_TABS} activeId={activeId} onChange={setActiveId} />
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.35)', letterSpacing: '-0.01em' }}>
          {COUNTS[activeId]} items
        </span>
      </div>

      <div style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderTop: 'none',
        borderRadius: '0 0 12px 12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        minHeight: '80px',
      }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', fontSize: '13px', color: 'rgba(10,10,10,0.35)', fontWeight: 500 }}>
            No items
          </div>
        ) : (
          <FadePanel id={activeId}>
            {filtered.map((item, i) => (
              <div
                key={item.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 16px',
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(10,10,10,0.06)' : 'none',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                  {item.name}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.35)' }}>{item.date}</span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    padding: '2px 7px',
                    borderRadius: '99px',
                    background: STATUS_COLOR[item.status].bg,
                    color: STATUS_COLOR[item.status].text,
                  }}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </FadePanel>
        )}
      </div>
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

interface Tab { id: string; label: string }

function measureTab(
  id: string,
  tabRefs: React.MutableRefObject<Map<string, HTMLButtonElement>>,
  containerRef: React.RefObject<HTMLDivElement>,
) {
  const btn = tabRefs.current.get(id)
  const container = containerRef.current
  if (!btn || !container) return null
  const b = btn.getBoundingClientRect()
  const c = container.getBoundingClientRect()
  return { left: b.left - c.left, width: b.width }
}

// ── Pill variant ──────────────────────────────────────────────────────────────

export function PillTabs({
  tabs,
  activeId,
  onChange,
}: {
  tabs: Tab[]
  activeId: string
  onChange: (id: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const m = measureTab(activeId, tabRefs, containerRef)
    if (m) {
      setIndicator(m)
      if (!ready) requestAnimationFrame(() => setReady(true))
    }
    const ro = new ResizeObserver(() => {
      const m2 = measureTab(activeId, tabRefs, containerRef)
      if (m2) setIndicator(m2)
    })
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [activeId])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        background: 'rgba(10,10,10,0.06)',
        borderRadius: '10px',
        padding: '3px',
      }}
    >
      {/* Sliding pill */}
      <div style={{
        position: 'absolute',
        top: 3, bottom: 3,
        left: indicator.left,
        width: indicator.width,
        background: '#fff',
        borderRadius: '7px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        transition: ready
          ? 'left 200ms cubic-bezier(0.32,0.72,0,1), width 200ms cubic-bezier(0.32,0.72,0,1)'
          : 'none',
        pointerEvents: 'none',
      }} />

      {tabs.map(tab => (
        <button
          key={tab.id}
          ref={el => {
            if (el) tabRefs.current.set(tab.id, el)
            else tabRefs.current.delete(tab.id)
          }}
          onClick={() => onChange(tab.id)}
          style={{
            position: 'relative', zIndex: 1,
            padding: '7px 16px',
            border: 'none', background: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: activeId === tab.id ? 600 : 500,
            color: activeId === tab.id ? '#0a0a0a' : 'rgba(10,10,10,0.45)',
            letterSpacing: '-0.01em',
            fontFamily: FONT,
            transition: 'color 180ms ease',
            whiteSpace: 'nowrap',
            borderRadius: '7px',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ── Underline variant ─────────────────────────────────────────────────────────

export function UnderlineTabs({
  tabs,
  activeId,
  onChange,
}: {
  tabs: Tab[]
  activeId: string
  onChange: (id: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const m = measureTab(activeId, tabRefs, containerRef)
    if (m) {
      setIndicator(m)
      if (!ready) requestAnimationFrame(() => setReady(true))
    }
    const ro = new ResizeObserver(() => {
      const m2 = measureTab(activeId, tabRefs, containerRef)
      if (m2) setIndicator(m2)
    })
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [activeId])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        borderBottom: '1px solid rgba(10,10,10,0.1)',
      }}
    >
      {/* Sliding underline */}
      <div style={{
        position: 'absolute',
        bottom: -1, height: 2,
        left: indicator.left,
        width: indicator.width,
        background: '#0a0a0a',
        borderRadius: '2px 2px 0 0',
        transition: ready
          ? 'left 200ms cubic-bezier(0.32,0.72,0,1), width 200ms cubic-bezier(0.32,0.72,0,1)'
          : 'none',
        pointerEvents: 'none',
      }} />

      {tabs.map(tab => (
        <button
          key={tab.id}
          ref={el => {
            if (el) tabRefs.current.set(tab.id, el)
            else tabRefs.current.delete(tab.id)
          }}
          onClick={() => onChange(tab.id)}
          style={{
            padding: '10px 16px',
            border: 'none', background: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: activeId === tab.id ? 600 : 500,
            color: activeId === tab.id ? '#0a0a0a' : 'rgba(10,10,10,0.4)',
            letterSpacing: '-0.01em',
            fontFamily: FONT,
            transition: 'color 180ms ease',
            whiteSpace: 'nowrap',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ── Usage example ──────────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'usage',    label: 'Usage' },
  { id: 'billing',  label: 'Billing' },
]

export function Demo() {
  const [activeId, setActiveId] = useState('overview')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <PillTabs tabs={TABS} activeId={activeId} onChange={setActiveId} />
      <div style={{ padding: '16px', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '12px' }}>
        {activeId === 'overview' && <p>Overview content</p>}
        {activeId === 'usage'    && <p>Usage content</p>}
        {activeId === 'billing'  && <p>Billing content</p>}
      </div>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TabSwitcherPage() {
  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: FONT }}>
      <style>{`
        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: '40px',
      }}>
        <PillDemo />
        <UnderlineDemo />

        <p style={{
          margin: 0,
          fontSize: '12px',
          color: 'rgba(0,0,0,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily: FONT,
          textAlign: 'center',
        }}>
          Pill + underline variants · indicator position measured from DOM · ResizeObserver keeps it accurate
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
