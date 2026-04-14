'use client'

import { useState, useRef, useEffect } from 'react'

// ─── SegmentedControl ──────────────────────────────────────────────────────────

interface Segment {
  value: string
  label: string
  icon?: React.ReactNode
}

function SegmentedControl({
  segments,
  value,
  onChange,
}: {
  segments: Segment[]
  value: string
  onChange: (v: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pill, setPill] = useState({ left: 0, width: 0 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const idx = segments.findIndex(s => s.value === value)
    const btns = ref.current.querySelectorAll<HTMLButtonElement>('button')
    const btn = btns[idx]
    if (!btn) return
    const { left: cl } = ref.current.getBoundingClientRect()
    const { left: bl, width } = btn.getBoundingClientRect()
    setPill({ left: bl - cl, width })
    setReady(true)
  }, [value, segments]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={ref}
      role="group"
      style={{
        display: 'inline-flex',
        background: 'rgba(10,10,10,0.06)',
        borderRadius: '10px',
        padding: '3px',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Sliding pill */}
      {ready && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '3px',
            bottom: '3px',
            left: `${pill.left}px`,
            width: `${pill.width}px`,
            background: '#ffffff',
            borderRadius: '7px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
            transition: 'left 200ms cubic-bezier(0.4,0,0.2,1), width 200ms cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      {segments.map(seg => {
        const active = seg.value === value
        return (
          <button
            key={seg.value}
            onClick={() => onChange(seg.value)}
            aria-pressed={active}
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 13px',
              borderRadius: '7px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              color: active ? '#0a0a0a' : 'rgba(10,10,10,0.5)',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              transition: 'color 180ms ease',
            }}
          >
            {seg.icon && (
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {seg.icon}
              </span>
            )}
            {seg.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── SVG Icons ─────────────────────────────────────────────────────────────────

function IconGrid() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="0.5" y="0.5" width="5" height="5" rx="1.5" fill="currentColor" />
      <rect x="7.5" y="0.5" width="5" height="5" rx="1.5" fill="currentColor" />
      <rect x="0.5" y="7.5" width="5" height="5" rx="1.5" fill="currentColor" />
      <rect x="7.5" y="7.5" width="5" height="5" rx="1.5" fill="currentColor" />
    </svg>
  )
}

function IconList() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="0.5" y="1.5" width="12" height="2.5" rx="1.25" fill="currentColor" />
      <rect x="0.5" y="5.25" width="12" height="2.5" rx="1.25" fill="currentColor" />
      <rect x="0.5" y="9" width="12" height="2.5" rx="1.25" fill="currentColor" />
    </svg>
  )
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_ITEMS = [
  { id: 1, name: 'Design System', tag: 'Components', updated: '2h ago', color: '#6366f1' },
  { id: 2, name: 'Sprint Board',  tag: 'Tasks',      updated: '4h ago', color: '#0ea5e9' },
  { id: 3, name: 'Analytics',     tag: 'Metrics',    updated: '1d ago', color: '#22c55e' },
  { id: 4, name: 'API Docs',      tag: 'Docs',       updated: '2d ago', color: '#f59e0b' },
  { id: 5, name: 'User Flows',    tag: 'UX',         updated: '3d ago', color: '#ec4899' },
  { id: 6, name: 'Roadmap',       tag: 'Planning',   updated: '5d ago', color: '#8b5cf6' },
]

// ─── Demo 1: View Switcher ─────────────────────────────────────────────────────

function ViewSwitcherDemo() {
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const VIEW_SEGS = [
    { value: 'grid', label: 'Grid', icon: <IconGrid /> },
    { value: 'list', label: 'List', icon: <IconList /> },
  ]

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '16px',
        padding: '20px',
        width: '460px',
        maxWidth: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
          Workspaces
        </span>
        <SegmentedControl
          segments={VIEW_SEGS}
          value={view}
          onChange={v => setView(v as 'grid' | 'list')}
        />
      </div>

      {/* Content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: view === 'grid' ? 'repeat(3, 1fr)' : '1fr',
          gap: '6px',
        }}
      >
        {MOCK_ITEMS.map(item => (
          <div
            key={item.id}
            style={{
              padding: view === 'grid' ? '12px' : '9px 12px',
              borderRadius: '10px',
              border: '1px solid rgba(10,10,10,0.06)',
              background: 'rgba(10,10,10,0.015)',
              display: 'flex',
              flexDirection: view === 'grid' ? 'column' : 'row',
              alignItems: view === 'grid' ? 'flex-start' : 'center',
              gap: view === 'grid' ? '8px' : '10px',
              cursor: 'default',
              transition: 'padding 200ms ease',
            }}
          >
            {/* Color dot */}
            <div
              style={{
                width: view === 'grid' ? '28px' : '22px',
                height: view === 'grid' ? '28px' : '22px',
                borderRadius: '7px',
                background: `${item.color}1a`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'width 200ms ease, height 200ms ease',
              }}
            >
              <div
                style={{
                  width: view === 'grid' ? '10px' : '8px',
                  height: view === 'grid' ? '10px' : '8px',
                  borderRadius: '50%',
                  background: item.color,
                  transition: 'width 200ms ease, height 200ms ease',
                }}
              />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#0a0a0a',
                  letterSpacing: '-0.015em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.name}
              </p>
              {/* Shown only in list view */}
              <p
                style={{
                  margin: '1px 0 0',
                  fontSize: '11.5px',
                  color: 'rgba(10,10,10,0.45)',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  maxHeight: view === 'list' ? '20px' : '0px',
                  opacity: view === 'list' ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'opacity 200ms ease, max-height 220ms ease',
                }}
              >
                {item.tag} · {item.updated}
              </p>
            </div>

            {/* Shown only in grid view */}
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 500,
                color: 'rgba(10,10,10,0.38)',
                letterSpacing: '-0.01em',
                opacity: view === 'grid' ? 1 : 0,
                transition: 'opacity 150ms ease',
              }}
            >
              {item.updated}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Demo 2: Billing Toggle ────────────────────────────────────────────────────

const PLANS = [
  {
    name: 'Starter',
    desc: 'For individuals',
    monthly: 9,
    annual: 6,
    features: ['5 projects', '10 GB storage', 'Email support'],
    highlight: false,
  },
  {
    name: 'Pro',
    desc: 'For small teams',
    monthly: 29,
    annual: 19,
    features: ['Unlimited projects', '100 GB storage', 'Priority support'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    desc: 'For organizations',
    monthly: 99,
    annual: 69,
    features: ['Custom limits', '1 TB storage', 'Dedicated support'],
    highlight: false,
  },
]

function BillingToggleDemo() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual')

  const BILLING_SEGS = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'annual',  label: 'Annual'  },
  ]

  return (
    <div
      style={{
        width: '460px',
        maxWidth: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Toggle header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <SegmentedControl
          segments={BILLING_SEGS}
          value={billing}
          onChange={v => setBilling(v as 'monthly' | 'annual')}
        />
        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#16a34a',
            background: '#f0fdf4',
            border: '1px solid rgba(22,163,74,0.18)',
            borderRadius: '20px',
            padding: '3px 10px',
            letterSpacing: '-0.01em',
            opacity: billing === 'annual' ? 1 : 0,
            transform: billing === 'annual' ? 'translateY(0)' : 'translateY(-4px)',
            transition: 'opacity 200ms ease, transform 200ms ease',
            pointerEvents: 'none',
          }}
        >
          Save up to 30% annually
        </div>
      </div>

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {PLANS.map(plan => (
          <div
            key={plan.name}
            style={{
              background: plan.highlight ? '#0a0a0a' : '#ffffff',
              border: plan.highlight ? 'none' : '1px solid rgba(10,10,10,0.08)',
              borderRadius: '14px',
              padding: '16px',
              boxShadow: plan.highlight
                ? '0 4px 24px rgba(0,0,0,0.18)'
                : '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <p
              style={{
                margin: '0 0 2px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: plan.highlight ? '#fff' : '#0a0a0a',
                letterSpacing: '-0.015em',
              }}
            >
              {plan.name}
            </p>
            <p
              style={{
                margin: '0 0 14px',
                fontSize: '11px',
                color: plan.highlight ? 'rgba(255,255,255,0.45)' : 'rgba(10,10,10,0.4)',
                fontWeight: 500,
                letterSpacing: '-0.01em',
              }}
            >
              {plan.desc}
            </p>
            <div style={{ marginBottom: '14px' }}>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: plan.highlight ? '#fff' : '#0a0a0a',
                  letterSpacing: '-0.04em',
                }}
              >
                ${billing === 'monthly' ? plan.monthly : plan.annual}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: plan.highlight ? 'rgba(255,255,255,0.4)' : 'rgba(10,10,10,0.35)',
                  fontWeight: 500,
                  marginLeft: '2px',
                }}
              >
                /mo
              </span>
            </div>
            {plan.features.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path
                    d="M1.5 5.5l2.5 2.5 5.5-5"
                    stroke={plan.highlight ? 'rgba(255,255,255,0.5)' : 'rgba(10,10,10,0.4)'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  style={{
                    fontSize: '11.5px',
                    color: plan.highlight ? 'rgba(255,255,255,0.55)' : 'rgba(10,10,10,0.5)',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {f}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Code Source ───────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect } from 'react'

interface Segment {
  value: string
  label: string
  icon?: React.ReactNode
}

function SegmentedControl({
  segments,
  value,
  onChange,
}: {
  segments: Segment[]
  value: string
  onChange: (v: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pill, setPill] = useState({ left: 0, width: 0 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const idx = segments.findIndex(s => s.value === value)
    const btns = ref.current.querySelectorAll<HTMLButtonElement>('button')
    const btn = btns[idx]
    if (!btn) return
    const { left: cl } = ref.current.getBoundingClientRect()
    const { left: bl, width } = btn.getBoundingClientRect()
    setPill({ left: bl - cl, width })
    setReady(true)
  }, [value, segments])

  return (
    <div
      ref={ref}
      role="group"
      style={{
        display: 'inline-flex',
        background: 'rgba(10,10,10,0.06)',
        borderRadius: '10px',
        padding: '3px',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {ready && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '3px',
            bottom: '3px',
            left: \`\${pill.left}px\`,
            width: \`\${pill.width}px\`,
            background: '#ffffff',
            borderRadius: '7px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
            transition: 'left 200ms cubic-bezier(0.4,0,0.2,1), width 200ms cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}
      {segments.map(seg => {
        const active = seg.value === value
        return (
          <button
            key={seg.value}
            onClick={() => onChange(seg.value)}
            aria-pressed={active}
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 13px',
              borderRadius: '7px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              color: active ? '#0a0a0a' : 'rgba(10,10,10,0.5)',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              transition: 'color 180ms ease',
            }}
          >
            {seg.icon && (
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {seg.icon}
              </span>
            )}
            {seg.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Usage example ─────────────────────────────────────────────────────────────

export default function Example() {
  const [view, setView] = useState('grid')
  const [billing, setBilling] = useState('annual')

  const viewSegs = [
    { value: 'grid',  label: 'Grid'  },
    { value: 'list',  label: 'List'  },
    { value: 'table', label: 'Table' },
  ]

  const billingSegs = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'annual',  label: 'Annual'  },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '40px' }}>
      <SegmentedControl segments={viewSegs}    value={view}    onChange={setView}    />
      <SegmentedControl segments={billingSegs} value={billing} onChange={setBilling} />
    </div>
  )
}`

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SegmentedControlPage() {
  return (
    <main
      style={{
        backgroundColor: 'var(--bg, #ffffff)',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* ── Demo ── */}
      <section
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
          padding: '60px 24px',
          gap: '48px',
        }}
      >
        <ViewSwitcherDemo />
        <BillingToggleDemo />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-muted, rgba(10,10,10,0.4))',
            marginBottom: '12px',
          }}
        >
          Source
        </p>
        <div
          style={{
            background: '#0a0a0a',
            borderRadius: '12px',
            padding: '20px',
            overflowX: 'auto',
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
              fontSize: '12px',
              lineHeight: '1.65',
              color: '#e5e5e5',
              whiteSpace: 'pre',
              overflowX: 'auto',
            }}
          >
            {CODE}
          </pre>
        </div>
      </section>
    </main>
  )
}
