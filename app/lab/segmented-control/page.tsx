'use client'

import { useState, useRef, useEffect } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ── SegmentedControl ──────────────────────────────────────────────────────────

type Option = { value: string; label: string }

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: Option[]
  value: string
  onChange: (v: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const segRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [pill, setPill] = useState({ left: 0, width: 0 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const idx = options.findIndex(o => o.value === value)
    const seg = segRefs.current[idx]
    const container = containerRef.current
    if (!seg || !container) return
    const cr = container.getBoundingClientRect()
    const sr = seg.getBoundingClientRect()
    setPill({ left: sr.left - cr.left, width: sr.width })
    setReady(true)
  }, [value, options])

  return (
    <div
      ref={containerRef}
      role="group"
      style={{
        display: 'inline-flex',
        position: 'relative',
        background: 'rgba(0,0,0,0.06)',
        borderRadius: 10,
        padding: 3,
        fontFamily: font,
        userSelect: 'none' as const,
      }}
    >
      {/* Sliding pill */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 3,
          bottom: 3,
          left: pill.left,
          width: pill.width,
          background: '#fff',
          borderRadius: 7,
          boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.05)',
          transition: ready
            ? 'left 220ms cubic-bezier(0.4,0,0.2,1), width 220ms cubic-bezier(0.4,0,0.2,1)'
            : 'none',
          pointerEvents: 'none',
        }}
      />
      {options.map((opt, i) => (
        <button
          key={opt.value}
          ref={el => { segRefs.current[i] = el }}
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '6px 16px',
            background: 'none',
            border: 'none',
            borderRadius: 7,
            cursor: 'pointer',
            outline: 'none',
            fontSize: 13,
            fontWeight: 500,
            color: value === opt.value ? '#0a0a0a' : 'rgba(0,0,0,0.42)',
            letterSpacing: '-0.01em',
            fontFamily: 'inherit',
            transition: 'color 160ms ease',
            whiteSpace: 'nowrap' as const,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ── Demo ──────────────────────────────────────────────────────────────────────

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity' },
  { value: 'settings', label: 'Settings' },
]

const MEMBERS = [
  { name: 'Vraj Shah', role: 'Owner', color: '#6366f1' },
  { name: 'Alex Kim', role: 'Admin', color: '#f59e0b' },
  { name: 'Sam Rivera', role: 'Member', color: '#10b981' },
  { name: 'Jordan Lee', role: 'Member', color: '#ef4444' },
]

const ACTIVITY = [
  { action: 'Deployed to production', time: '2 min ago', icon: '🚀' },
  { action: 'Pushed 3 commits to main', time: '18 min ago', icon: '⬆' },
  { action: 'Opened pull request #47', time: '1 hr ago', icon: '🔀' },
  { action: 'Closed issue #112', time: '3 hr ago', icon: '✓' },
  { action: 'Added new team member', time: 'Yesterday', icon: '＋' },
]

const STATS = [
  { label: 'Deployments', value: '24', delta: '+3' },
  { label: 'Uptime', value: '99.9%', delta: '' },
  { label: 'Team size', value: '4', delta: '+1' },
]

function TabContent({ tab }: { tab: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [tab])

  const style: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(6px)',
    transition: 'opacity 180ms ease, transform 180ms ease',
  }

  if (tab === 'overview') {
    return (
      <div style={style}>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              flex: 1,
              background: 'rgba(0,0,0,0.025)',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: 10,
              padding: '12px 12px 10px',
            }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.38)', letterSpacing: '-0.005em', marginBottom: 6 }}>
                {s.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.03em' }}>
                  {s.value}
                </span>
                {s.delta && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(16,185,129,0.85)', letterSpacing: '-0.01em' }}>
                    {s.delta}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bar chart placeholder */}
        <div style={{
          background: 'rgba(0,0,0,0.025)',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: 10,
          padding: '14px 14px 10px',
        }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.38)', marginBottom: 12 }}>
            Deploys this week
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 48 }}>
            {[35, 60, 45, 80, 55, 95, 70].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%',
                  height: `${h}%`,
                  background: i === 5 ? '#0a0a0a' : 'rgba(0,0,0,0.1)',
                  borderRadius: '3px 3px 2px 2px',
                  transition: 'height 400ms cubic-bezier(0.4,0,0.2,1)',
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' as const, fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.28)' }}>
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (tab === 'activity') {
    return (
      <div style={style}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {ACTIVITY.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 10px',
              borderRadius: 8,
              transition: 'background 120ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.03)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width: 28, height: 28,
                borderRadius: 8,
                background: 'rgba(0,0,0,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12,
                flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                  {item.action}
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.3)', letterSpacing: '-0.005em', flexShrink: 0 }}>
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // settings
  return (
    <div style={style}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[
          { label: 'Email notifications', desc: 'Receive updates via email', on: true },
          { label: 'Slack integration', desc: 'Post alerts to #deploys', on: false },
          { label: 'Two-factor auth', desc: 'Extra login security', on: true },
          { label: 'Public profile', desc: 'Visible to anyone', on: false },
        ].map((row, i) => (
          <ToggleRow key={i} label={row.label} desc={row.desc} defaultOn={row.on} />
        ))}

        <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: 10 }}>
            Members
          </div>
          {MEMBERS.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: m.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: '#fff',
                flexShrink: 0,
              }}>
                {m.name[0]}
              </div>
              <div style={{ flex: 1, fontSize: 12, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                {m.name}
              </div>
              <div style={{
                fontSize: 10, fontWeight: 600,
                color: 'rgba(0,0,0,0.38)',
                background: 'rgba(0,0,0,0.05)',
                borderRadius: 4, padding: '2px 7px',
                letterSpacing: '0.03em', textTransform: 'uppercase' as const,
              }}>
                {m.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ToggleRow({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '9px 10px', borderRadius: 8,
        cursor: 'pointer',
        transition: 'background 120ms ease',
      }}
      onClick={() => setOn(o => !o)}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.025)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>{label}</div>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.35)', letterSpacing: '-0.005em' }}>{desc}</div>
      </div>
      {/* Toggle pill */}
      <div style={{
        width: 36, height: 20,
        borderRadius: 10,
        background: on ? '#0a0a0a' : 'rgba(0,0,0,0.14)',
        position: 'relative',
        transition: 'background 200ms ease',
        flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute',
          top: 3, left: on ? 19 : 3,
          width: 14, height: 14,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          transition: 'left 200ms cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  )
}

function Demo() {
  const [tab, setTab] = useState('overview')

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
      padding: '40px 24px',
      fontFamily: font,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: '#fff',
        borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        {/* Card header */}
        <div style={{
          padding: '16px 16px 14px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
              Workspace
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.38)', letterSpacing: '-0.01em', marginTop: 1 }}>
              acme-corp
            </div>
          </div>
          <SegmentedControl options={TABS} value={tab} onChange={setTab} />
        </div>

        {/* Content area */}
        <div style={{ padding: 16, minHeight: 240 }}>
          <TabContent tab={tab} />
        </div>
      </div>
    </div>
  )
}

// ── CopyButton ────────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
      }}
      style={{
        padding: '5px 12px',
        background: copied ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 7,
        color: copied ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
        fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: font,
        letterSpacing: '-0.01em', transition: 'background 0.15s ease, color 0.15s ease',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ── Code source ───────────────────────────────────────────────────────────────

const CODE_SOURCE = `'use client'

import { useState, useRef, useEffect } from 'react'

type Option = { value: string; label: string }

export function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: Option[]
  value: string
  onChange: (v: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const segRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [pill, setPill] = useState({ left: 0, width: 0 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const idx = options.findIndex(o => o.value === value)
    const seg = segRefs.current[idx]
    const container = containerRef.current
    if (!seg || !container) return
    const cr = container.getBoundingClientRect()
    const sr = seg.getBoundingClientRect()
    setPill({ left: sr.left - cr.left, width: sr.width })
    setReady(true)
  }, [value, options])

  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

  return (
    <div
      ref={containerRef}
      role="group"
      style={{
        display: 'inline-flex',
        position: 'relative',
        background: 'rgba(0,0,0,0.06)',
        borderRadius: 10,
        padding: 3,
        fontFamily: font,
        userSelect: 'none',
      }}
    >
      {/* Sliding pill — no transition on first paint, smooth on all subsequent changes */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 3,
          bottom: 3,
          left: pill.left,
          width: pill.width,
          background: '#fff',
          borderRadius: 7,
          boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.05)',
          transition: ready
            ? 'left 220ms cubic-bezier(0.4,0,0.2,1), width 220ms cubic-bezier(0.4,0,0.2,1)'
            : 'none',
          pointerEvents: 'none',
        }}
      />
      {options.map((opt, i) => (
        <button
          key={opt.value}
          ref={el => { segRefs.current[i] = el }}
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '6px 16px',
            background: 'none',
            border: 'none',
            borderRadius: 7,
            cursor: 'pointer',
            outline: 'none',
            fontSize: 13,
            fontWeight: 500,
            color: value === opt.value ? '#0a0a0a' : 'rgba(0,0,0,0.42)',
            letterSpacing: '-0.01em',
            fontFamily: 'inherit',
            transition: 'color 160ms ease',
            whiteSpace: 'nowrap',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ── Usage example ─────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState('overview')

  return (
    <div style={{ padding: 24, fontFamily: '-apple-system, sans-serif' }}>
      <SegmentedControl
        options={[
          { value: 'overview',  label: 'Overview'  },
          { value: 'activity',  label: 'Activity'  },
          { value: 'settings',  label: 'Settings'  },
        ]}
        value={tab}
        onChange={setTab}
      />
      <p style={{ marginTop: 16, fontSize: 14, color: 'rgba(0,0,0,0.5)' }}>
        Active: {tab}
      </p>
    </div>
  )
}`

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SegmentedControlPage() {
  return (
    <div style={{ background: '#fff' }}>
      {/* DEMO */}
      <Demo />

      {/* CODE */}
      <div style={{ background: '#0a0a0a', padding: 'clamp(24px, 4vw, 48px)' as any, fontFamily: font }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>
                Segmented Control
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                Drop into any React project — zero dependencies
              </div>
            </div>
            <CopyButton text={CODE_SOURCE} />
          </div>

          <div style={{ background: '#111', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              padding: '10px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center',
            }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontFamily: 'ui-monospace, monospace' }}>
                SegmentedControl.tsx
              </div>
            </div>
            <pre style={{
              margin: 0,
              padding: '20px',
              overflowX: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
              fontSize: 12.5,
              lineHeight: 1.65,
              color: '#e5e5e5',
              scrollbarWidth: 'thin' as any,
              scrollbarColor: 'rgba(255,255,255,0.1) transparent',
            }}>
              <code>{CODE_SOURCE}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
