'use client'

import { useState, useRef, useEffect } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tab {
  label: string
  content: React.ReactNode
}

// ─── FadeContent ──────────────────────────────────────────────────────────────
// Mounts invisible, fades+slides in on next frame. Use key={activeIndex} on it
// so React remounts (and replays the animation) whenever the tab changes.

function FadeContent({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <div style={{
      marginTop: 16,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(6px)',
      transition: 'opacity 180ms ease, transform 180ms ease',
    }}>
      {children}
    </div>
  )
}

// ─── TabSwitcher ──────────────────────────────────────────────────────────────

function TabSwitcher({
  tabs,
  variant = 'pill',
  defaultIndex = 0,
}: {
  tabs: Tab[]
  variant?: 'pill' | 'underline'
  defaultIndex?: number
}) {
  const [active, setActive] = useState(defaultIndex)
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const barRef = useRef<HTMLDivElement>(null)
  const isPill = variant === 'pill'

  useEffect(() => {
    const measure = () => {
      const el = tabRefs.current[active]
      const bar = barRef.current
      if (!el || !bar) return
      const br = bar.getBoundingClientRect()
      const tr = el.getBoundingClientRect()
      setIndicator({ left: tr.left - br.left, width: tr.width })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [active])

  return (
    <div style={{ fontFamily: FONT }}>
      {/* ── Tab bar ── */}
      <div
        ref={barRef}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          background: isPill ? 'rgba(10,10,10,0.05)' : 'transparent',
          borderRadius: isPill ? '10px' : '0',
          padding: isPill ? '3px' : '0',
          borderBottom: isPill ? 'none' : '1px solid rgba(10,10,10,0.08)',
        }}
      >
        {/* Sliding indicator */}
        {indicator !== null && (
          <div
            style={{
              position: 'absolute',
              ...(isPill
                ? { top: 3, bottom: 3 }
                : { bottom: -1 }),
              left: indicator.left,
              width: indicator.width,
              height: isPill ? 'calc(100% - 6px)' : 2,
              background: isPill ? '#fff' : '#0a0a0a',
              borderRadius: isPill ? '7px' : '2px 2px 0 0',
              boxShadow: isPill ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)' : 'none',
              transition: 'left 200ms cubic-bezier(0.4,0,0.2,1), width 200ms cubic-bezier(0.4,0,0.2,1)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Tab buttons */}
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            ref={el => { tabRefs.current[i] = el }}
            onClick={() => setActive(i)}
            style={{
              position: 'relative', zIndex: 1,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: isPill ? '5px 14px' : '8px 16px',
              fontSize: '13px', fontWeight: 500, letterSpacing: '-0.01em',
              color: active === i ? '#0a0a0a' : 'rgba(10,10,10,0.4)',
              transition: 'color 150ms ease',
              whiteSpace: 'nowrap',
              fontFamily: FONT,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Animated content panel */}
      <FadeContent key={active}>
        {tabs[active].content}
      </FadeContent>
    </div>
  )
}

// ─── Pill variant demo: Settings panel ────────────────────────────────────────

function SettingsDemo() {
  const [twoFA, setTwoFA] = useState(true)
  const [theme, setTheme] = useState<'Light' | 'System' | 'Dark'>('System')

  const row = (label: string, value: string, accent?: boolean) => (
    <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{
        fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em',
        textTransform: 'uppercase' as const, color: 'rgba(10,10,10,0.4)', fontFamily: FONT,
      }}>{label}</span>
      <span style={{
        fontSize: '13px', fontWeight: 500, letterSpacing: '-0.01em', fontFamily: FONT,
        color: accent ? '#6366f1' : '#0a0a0a',
        padding: '8px 10px', background: 'rgba(10,10,10,0.03)',
        border: '1px solid rgba(10,10,10,0.08)', borderRadius: '8px',
      }}>{value}</span>
    </div>
  )

  const tabs: Tab[] = [
    {
      label: 'General',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            paddingBottom: '12px', borderBottom: '1px solid rgba(10,10,10,0.06)',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', color: '#fff', fontWeight: 600, fontFamily: FONT,
              flexShrink: 0,
            }}>V</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT }}>Vraj Shah</div>
              <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em', marginTop: '1px', fontFamily: FONT }}>Product Designer</div>
            </div>
          </div>
          {row('Email', 'vraj@example.com')}
          {row('Plan', 'Pro · Renews Jan 2026', true)}
        </div>
      ),
    },
    {
      label: 'Appearance',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' as const, color: 'rgba(10,10,10,0.4)', fontFamily: FONT }}>Theme</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['Light', 'System', 'Dark'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: '8px',
                    border: '1px solid', borderColor: theme === t ? '#0a0a0a' : 'rgba(10,10,10,0.08)',
                    background: theme === t ? '#0a0a0a' : '#fff',
                    color: theme === t ? '#fff' : 'rgba(10,10,10,0.55)',
                    fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                    transition: 'all 150ms ease', letterSpacing: '-0.01em', fontFamily: FONT,
                  }}
                >{t}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' as const, color: 'rgba(10,10,10,0.4)', fontFamily: FONT }}>Accent</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['#6366f1', '#ec4899', '#0ea5e9', '#22c55e', '#f59e0b', '#0a0a0a'].map(c => (
                <div key={c} style={{
                  width: 24, height: 24, borderRadius: '50%', background: c,
                  cursor: 'pointer', flexShrink: 0,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }} />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      label: 'Security',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px', background: 'rgba(10,10,10,0.03)',
            border: '1px solid rgba(10,10,10,0.08)', borderRadius: '10px',
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT }}>Two-factor auth</div>
              <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.45)', marginTop: '2px', letterSpacing: '-0.01em', fontFamily: FONT }}>
                {twoFA ? 'Enabled via authenticator' : 'Not configured'}
              </div>
            </div>
            <button
              onClick={() => setTwoFA(v => !v)}
              style={{
                width: 40, height: 22, borderRadius: 11,
                background: twoFA ? '#0a0a0a' : 'rgba(10,10,10,0.15)',
                border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
                transition: 'background 200ms ease',
              }}
            >
              <div style={{
                position: 'absolute', top: 2, left: twoFA ? 20 : 2,
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transition: 'left 200ms cubic-bezier(0.4,0,0.2,1)',
              }} />
            </button>
          </div>
          <div style={{
            padding: '12px', background: 'rgba(10,10,10,0.03)',
            border: '1px solid rgba(10,10,10,0.08)', borderRadius: '10px',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT }}>Active sessions</div>
            <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.45)', marginTop: '2px', letterSpacing: '-0.01em', fontFamily: FONT }}>2 devices · Last seen just now</div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div style={{
      background: '#fff', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '16px',
      padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      width: '300px', maxWidth: '100%',
    }}>
      <TabSwitcher tabs={tabs} variant="pill" />
    </div>
  )
}

// ─── Underline variant demo: Analytics panel ──────────────────────────────────

const METRICS = [
  { label: 'Sessions',  value: '24,891', delta: '+12%' },
  { label: 'Users',     value: '8,432',  delta: '+8%'  },
  { label: 'Bounce',    value: '42.1%',  delta: '−3%'  },
  { label: 'Avg. time', value: '3m 12s', delta: '+21s' },
]

const CHANNELS = [
  { label: 'Organic Search', pct: 48, color: '#6366f1' },
  { label: 'Direct',         pct: 27, color: '#0ea5e9' },
  { label: 'Social',         pct: 16, color: '#ec4899' },
  { label: 'Email',          pct:  9, color: '#f59e0b' },
]

const MONTHS  = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
const REVENUE = [42, 58, 51, 73, 68, 89]
const MAX_REV = Math.max(...REVENUE)

function AnalyticsDemo() {
  const tabs: Tab[] = [
    {
      label: 'Overview',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {METRICS.map(m => (
            <div key={m.label} style={{
              padding: '12px', background: 'rgba(10,10,10,0.02)',
              border: '1px solid rgba(10,10,10,0.06)', borderRadius: '10px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(10,10,10,0.4)', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '4px', fontFamily: FONT }}>{m.label}</div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', lineHeight: 1, fontFamily: FONT }}>{m.value}</div>
              <div style={{ fontSize: '11px', fontWeight: 500, color: '#16a34a', marginTop: '4px', letterSpacing: '-0.01em', fontFamily: FONT }}>{m.delta} vs last mo.</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: 'Traffic',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {CHANNELS.map(c => (
            <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.6)', letterSpacing: '-0.01em', width: '108px', flexShrink: 0, fontFamily: FONT }}>{c.label}</div>
              <div style={{ flex: 1, height: '6px', background: 'rgba(10,10,10,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${c.pct}%`, height: '100%', background: c.color, borderRadius: '3px', transition: 'width 400ms cubic-bezier(0.4,0,0.2,1)' }} />
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', width: '32px', textAlign: 'right' as const, flexShrink: 0, fontFamily: FONT }}>{c.pct}%</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: 'Revenue',
      content: (
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '72px', marginBottom: '8px' }}>
            {REVENUE.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                <div style={{
                  width: '100%',
                  background: i === REVENUE.length - 1 ? '#0a0a0a' : 'rgba(10,10,10,0.12)',
                  borderRadius: '3px 3px 0 0',
                  height: `${(v / MAX_REV) * 100}%`,
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '5px', borderTop: '1px solid rgba(10,10,10,0.06)', paddingTop: '6px' }}>
            {MONTHS.map((m, i) => (
              <div key={i} style={{ flex: 1, fontSize: '10px', fontWeight: 500, color: 'rgba(10,10,10,0.35)', textAlign: 'center' as const, letterSpacing: '-0.01em', fontFamily: FONT }}>{m}</div>
            ))}
          </div>
          <div style={{
            marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: '12px', borderTop: '1px solid rgba(10,10,10,0.06)',
          }}>
            <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em', fontWeight: 500, fontFamily: FONT }}>MRR</div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', fontFamily: FONT }}>$89,400</div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div style={{
      background: '#fff', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '16px',
      padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      width: '300px', maxWidth: '100%',
    }}>
      <TabSwitcher tabs={tabs} variant="underline" />
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect } from 'react'

interface Tab {
  label: string
  content: React.ReactNode
}

// Mounts invisible, fades+slides in. Use key={activeIndex} so React
// remounts (and replays the animation) whenever the tab changes.
function FadeContent({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <div style={{
      marginTop: 16,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(6px)',
      transition: 'opacity 180ms ease, transform 180ms ease',
    }}>
      {children}
    </div>
  )
}

export function TabSwitcher({
  tabs,
  variant = 'pill',
  defaultIndex = 0,
}: {
  tabs: Tab[]
  variant?: 'pill' | 'underline'
  defaultIndex?: number
}) {
  const [active, setActive] = useState(defaultIndex)
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const barRef = useRef<HTMLDivElement>(null)
  const isPill = variant === 'pill'
  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

  useEffect(() => {
    const measure = () => {
      const el = tabRefs.current[active]
      const bar = barRef.current
      if (!el || !bar) return
      const br = bar.getBoundingClientRect()
      const tr = el.getBoundingClientRect()
      setIndicator({ left: tr.left - br.left, width: tr.width })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [active])

  return (
    <div style={{ fontFamily: font }}>
      <div
        ref={barRef}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          background: isPill ? 'rgba(10,10,10,0.05)' : 'transparent',
          borderRadius: isPill ? '10px' : '0',
          padding: isPill ? '3px' : '0',
          borderBottom: isPill ? 'none' : '1px solid rgba(10,10,10,0.08)',
        }}
      >
        {indicator !== null && (
          <div
            style={{
              position: 'absolute',
              ...(isPill ? { top: 3, bottom: 3 } : { bottom: -1 }),
              left: indicator.left,
              width: indicator.width,
              height: isPill ? 'calc(100% - 6px)' : 2,
              background: isPill ? '#fff' : '#0a0a0a',
              borderRadius: isPill ? '7px' : '2px 2px 0 0',
              boxShadow: isPill ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)' : 'none',
              transition: 'left 200ms cubic-bezier(0.4,0,0.2,1), width 200ms cubic-bezier(0.4,0,0.2,1)',
              pointerEvents: 'none',
            }}
          />
        )}

        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            ref={el => { tabRefs.current[i] = el }}
            onClick={() => setActive(i)}
            style={{
              position: 'relative', zIndex: 1,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: isPill ? '5px 14px' : '8px 16px',
              fontSize: '13px', fontWeight: 500, letterSpacing: '-0.01em',
              color: active === i ? '#0a0a0a' : 'rgba(10,10,10,0.4)',
              transition: 'color 150ms ease',
              whiteSpace: 'nowrap',
              fontFamily: font,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <FadeContent key={active}>
        {tabs[active].content}
      </FadeContent>
    </div>
  )
}

// ── Example usage ──────────────────────────────────────────────────────────────
//
// const tabs = [
//   { label: 'General',    content: <div>General content</div>    },
//   { label: 'Appearance', content: <div>Appearance content</div> },
//   { label: 'Security',   content: <div>Security content</div>   },
// ]
//
// <TabSwitcher tabs={tabs} variant="pill" />
// <TabSwitcher tabs={tabs} variant="underline" />`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TabSwitcherPage() {
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
        gap: '32px',
      }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>Pill variant</p>
            <SettingsDemo />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>Underline variant</p>
            <AnalyticsDemo />
          </div>
        </div>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)',
          marginBottom: '12px', fontFamily: FONT,
        }}>Source</p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
          <pre style={{
            margin: 0,
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
            fontSize: '12px', lineHeight: '1.65', color: '#e5e5e5',
            whiteSpace: 'pre', overflowX: 'auto',
          }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
