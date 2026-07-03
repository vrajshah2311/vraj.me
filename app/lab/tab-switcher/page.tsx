'use client'

import { useState, useRef, useEffect } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ── TabSwitcher ───────────────────────────────────────────────────────────────

type TabVariant = 'pill' | 'underline'

function TabSwitcher({
  tabs,
  variant = 'pill',
  children,
}: {
  tabs: string[]
  variant?: TabVariant
  children: React.ReactNode[]
}) {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const navRef = useRef<HTMLDivElement>(null)
  const [ind, setInd] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const el = tabRefs.current[active]
    const nav = navRef.current
    if (!el || !nav) return
    const nr = nav.getBoundingClientRect()
    const er = el.getBoundingClientRect()
    setInd({ left: er.left - nr.left, width: er.width })
  }, [active])

  const isPill = variant === 'pill'

  return (
    <div style={{ fontFamily: font }}>
      {/* Nav */}
      <div
        ref={navRef}
        role="tablist"
        style={
          isPill
            ? {
                position: 'relative',
                display: 'inline-flex',
                gap: 2,
                padding: 3,
                background: 'rgba(0,0,0,0.05)',
                borderRadius: 10,
              }
            : {
                position: 'relative',
                display: 'flex',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
              }
        }
      >
        {/* Sliding indicator */}
        {isPill ? (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: 3,
              bottom: 3,
              left: ind.left,
              width: ind.width,
              background: '#fff',
              borderRadius: 7,
              boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 1px 6px rgba(0,0,0,0.04)',
              transition: 'left 220ms cubic-bezier(0.4,0,0.2,1), width 220ms cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        ) : (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              bottom: -1,
              left: ind.left,
              width: ind.width,
              height: 2,
              background: '#0a0a0a',
              borderRadius: 2,
              transition: 'left 220ms cubic-bezier(0.4,0,0.2,1), width 220ms cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        )}

        {tabs.map((tab, i) => (
          <button
            key={tab}
            ref={el => {
              tabRefs.current[i] = el
            }}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            style={
              isPill
                ? {
                    position: 'relative',
                    zIndex: 1,
                    padding: '6px 14px',
                    background: 'none',
                    border: 'none',
                    borderRadius: 7,
                    fontSize: 13,
                    fontWeight: 500,
                    color: active === i ? '#0a0a0a' : 'rgba(0,0,0,0.42)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    letterSpacing: '-0.01em',
                    transition: 'color 200ms ease',
                    whiteSpace: 'nowrap' as const,
                  }
                : {
                    padding: '9px 16px',
                    background: 'none',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 500,
                    color: active === i ? '#0a0a0a' : 'rgba(0,0,0,0.4)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    letterSpacing: '-0.01em',
                    transition: 'color 200ms ease',
                    whiteSpace: 'nowrap' as const,
                  }
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stacked content panels — all rendered, fade in/out */}
      <div style={{ display: 'grid', marginTop: isPill ? 20 : 24 }}>
        {children.map((child, i) => (
          <div
            key={i}
            aria-hidden={active !== i}
            style={{
              gridArea: '1 / 1',
              opacity: active === i ? 1 : 0,
              transform: active === i ? 'translateY(0)' : 'translateY(5px)',
              transition: 'opacity 180ms ease, transform 180ms ease',
              pointerEvents: active === i ? 'all' : 'none',
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Demo content helpers ──────────────────────────────────────────────────────

function StatCard({ label, value, delta }: { label: string; value: string; delta: string }) {
  const positive = delta.startsWith('+')
  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.025)',
        borderRadius: 10,
        border: '1px solid rgba(0,0,0,0.06)',
        padding: '14px 16px',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '-0.01em', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.03em' }}>{value}</div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: positive ? 'rgba(16,185,129,0.9)' : 'rgba(239,68,68,0.9)',
          marginTop: 4,
          letterSpacing: '-0.01em',
        }}
      >
        {delta} vs last month
      </div>
    </div>
  )
}

const ACTIVITY = [
  { who: 'Sarah K.', action: 'merged pull request', item: '#142 — Dark mode', time: '2m ago', color: 'rgba(16,185,129,0.1)', dot: 'rgba(16,185,129,0.8)' },
  { who: 'James L.', action: 'opened issue', item: '#143 — Mobile layout', time: '18m ago', color: 'rgba(59,130,246,0.1)', dot: 'rgba(59,130,246,0.8)' },
  { who: 'You', action: 'deployed to', item: 'production', time: '1h ago', color: 'rgba(168,85,247,0.1)', dot: 'rgba(168,85,247,0.8)' },
  { who: 'Mia C.', action: 'commented on', item: '#138 — API rate limits', time: '3h ago', color: 'rgba(245,158,11,0.1)', dot: 'rgba(245,158,11,0.8)' },
]

const MEMBERS = [
  { name: 'Sarah Kim', role: 'Lead Engineer', initials: 'SK', color: 'rgba(16,185,129,0.15)', text: 'rgba(5,150,105,0.9)' },
  { name: 'James Liu', role: 'Designer', initials: 'JL', color: 'rgba(59,130,246,0.12)', text: 'rgba(37,99,235,0.9)' },
  { name: 'Mia Chen', role: 'Backend', initials: 'MC', color: 'rgba(245,158,11,0.12)', text: 'rgba(180,100,0,0.9)' },
  { name: 'Tom Patel', role: 'DevOps', initials: 'TP', color: 'rgba(168,85,247,0.12)', text: 'rgba(124,58,237,0.9)' },
]

function OverviewContent() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <StatCard label="Total Users" value="24,821" delta="+12.4%" />
        <StatCard label="MRR" value="$8,340" delta="+6.1%" />
        <StatCard label="Active Sessions" value="1,204" delta="+3.8%" />
        <StatCard label="Churn Rate" value="1.2%" delta="-0.3%" />
      </div>
    </div>
  )
}

function ActivityContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {ACTIVITY.map((a, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 8,
            transition: 'background 0.12s ease',
            cursor: 'default',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.03)')}
          onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: a.dot,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>{a.who} </span>
            <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', letterSpacing: '-0.01em' }}>{a.action} </span>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>{a.item}</span>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.3)', fontWeight: 500, flexShrink: 0 }}>{a.time}</span>
        </div>
      ))}
    </div>
  )
}

function MembersContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {MEMBERS.map((m, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'background 0.12s ease',
            cursor: 'default',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.03)')}
          onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: m.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
              color: m.text,
              flexShrink: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {m.initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.015em' }}>{m.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', fontWeight: 500, marginTop: 1 }}>{m.role}</div>
          </div>
          <button
            style={{
              padding: '4px 10px',
              background: 'transparent',
              border: '1px solid rgba(0,0,0,0.09)',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 500,
              color: 'rgba(0,0,0,0.5)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '-0.01em',
              transition: 'background 0.12s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            View
          </button>
        </div>
      ))}
    </div>
  )
}

// ── Settings tab content (for underline variant demo) ─────────────────────────

function SettingsRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '12px 0',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.015em' }}>{label}</div>
        {description && (
          <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.38)', marginTop: 2, letterSpacing: '-0.01em' }}>
            {description}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div
      onClick={() => setOn(v => !v)}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: on ? '#0a0a0a' : 'rgba(0,0,0,0.12)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 200ms ease',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 19 : 3,
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 200ms cubic-bezier(0.4,0,0.2,1)',
        }}
      />
    </div>
  )
}

function GeneralContent() {
  return (
    <div>
      <SettingsRow label="Project name">
        <input
          defaultValue="my-project"
          style={{
            padding: '6px 10px',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 7,
            fontSize: 12,
            fontWeight: 500,
            color: '#0a0a0a',
            background: '#fff',
            outline: 'none',
            fontFamily: 'inherit',
            letterSpacing: '-0.01em',
            width: 140,
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)')}
        />
      </SettingsRow>
      <SettingsRow label="Email notifications" description="Get notified on important events">
        <Toggle defaultOn />
      </SettingsRow>
      <SettingsRow label="Public profile" description="Make your profile visible to others">
        <Toggle />
      </SettingsRow>
    </div>
  )
}

function SecurityContent() {
  return (
    <div>
      <SettingsRow label="Two-factor auth" description="Add an extra layer of security">
        <Toggle />
      </SettingsRow>
      <SettingsRow label="Session timeout" description="Auto-logout after inactivity">
        <Toggle defaultOn />
      </SettingsRow>
      <SettingsRow label="Login alerts" description="Email on new sign-in">
        <Toggle defaultOn />
      </SettingsRow>
    </div>
  )
}

function BillingContent() {
  return (
    <div style={{ paddingTop: 4 }}>
      <div
        style={{
          padding: '12px 14px',
          background: 'rgba(0,0,0,0.03)',
          borderRadius: 9,
          border: '1px solid rgba(0,0,0,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.015em' }}>Pro Plan</div>
          <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.4)', fontWeight: 500, marginTop: 2 }}>$29 / month · renews Aug 1</div>
        </div>
        <button
          style={{
            padding: '5px 12px',
            background: 'transparent',
            border: '1px solid rgba(0,0,0,0.09)',
            borderRadius: 7,
            fontSize: 12,
            fontWeight: 500,
            color: 'rgba(0,0,0,0.5)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '-0.01em',
          }}
        >
          Manage
        </button>
      </div>
    </div>
  )
}

// ── Demo ──────────────────────────────────────────────────────────────────────

function Demo() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: 24,
        fontFamily: font,
      }}
    >
      {/* Pill variant */}
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#fff',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07), 0 32px 64px rgba(0,0,0,0.05)',
          padding: '20px 20px 24px',
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
            my-project
          </div>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.35)', marginTop: 2 }}>
            Last updated 2 minutes ago
          </div>
        </div>

        <TabSwitcher tabs={['Overview', 'Activity', 'Members']} variant="pill">
          {[<OverviewContent key="o" />, <ActivityContent key="a" />, <MembersContent key="m" />]}
        </TabSwitcher>
      </div>

      {/* Underline variant */}
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#fff',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07), 0 32px 64px rgba(0,0,0,0.05)',
          padding: '20px 20px 24px',
        }}
      >
        <div style={{ marginBottom: 4 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
            Account Settings
          </div>
        </div>

        <TabSwitcher tabs={['General', 'Security', 'Billing']} variant="underline">
          {[<GeneralContent key="g" />, <SecurityContent key="s" />, <BillingContent key="b" />]}
        </TabSwitcher>
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
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {}
      }}
      style={{
        padding: '5px 12px',
        background: copied ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 7,
        color: copied ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: font,
        letterSpacing: '-0.01em',
        transition: 'background 0.15s ease, color 0.15s ease',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ── Code source ───────────────────────────────────────────────────────────────

const CODE_SOURCE = `'use client'

import { useState, useRef, useEffect } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

/**
 * TabSwitcher
 * variant: 'pill' (default) | 'underline'
 */
export function TabSwitcher({ tabs, variant = 'pill', children }) {
  const [active, setActive] = useState(0)
  const tabRefs = useRef([])
  const navRef = useRef(null)
  const [ind, setInd] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const el = tabRefs.current[active]
    const nav = navRef.current
    if (!el || !nav) return
    const nr = nav.getBoundingClientRect()
    const er = el.getBoundingClientRect()
    setInd({ left: er.left - nr.left, width: er.width })
  }, [active])

  const isPill = variant === 'pill'

  return (
    <div style={{ fontFamily: font }}>
      {/* Tab nav */}
      <div
        ref={navRef}
        role="tablist"
        style={isPill ? {
          position: 'relative',
          display: 'inline-flex',
          gap: 2,
          padding: 3,
          background: 'rgba(0,0,0,0.05)',
          borderRadius: 10,
        } : {
          position: 'relative',
          display: 'flex',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        {/* Sliding indicator */}
        {isPill ? (
          <div aria-hidden style={{
            position: 'absolute',
            top: 3, bottom: 3,
            left: ind.left, width: ind.width,
            background: '#fff',
            borderRadius: 7,
            boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 1px 6px rgba(0,0,0,0.04)',
            transition: 'left 220ms cubic-bezier(0.4,0,0.2,1), width 220ms cubic-bezier(0.4,0,0.2,1)',
          }} />
        ) : (
          <div aria-hidden style={{
            position: 'absolute',
            bottom: -1,
            left: ind.left, width: ind.width,
            height: 2,
            background: '#0a0a0a',
            borderRadius: 2,
            transition: 'left 220ms cubic-bezier(0.4,0,0.2,1), width 220ms cubic-bezier(0.4,0,0.2,1)',
          }} />
        )}

        {tabs.map((tab, i) => (
          <button
            key={tab}
            ref={el => { tabRefs.current[i] = el }}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            style={isPill ? {
              position: 'relative', zIndex: 1,
              padding: '6px 14px',
              background: 'none', border: 'none', borderRadius: 7,
              fontSize: 13, fontWeight: 500,
              color: active === i ? '#0a0a0a' : 'rgba(0,0,0,0.42)',
              cursor: 'pointer', fontFamily: 'inherit',
              letterSpacing: '-0.01em',
              transition: 'color 200ms ease',
              whiteSpace: 'nowrap',
            } : {
              padding: '9px 16px',
              background: 'none', border: 'none',
              fontSize: 13, fontWeight: 500,
              color: active === i ? '#0a0a0a' : 'rgba(0,0,0,0.4)',
              cursor: 'pointer', fontFamily: 'inherit',
              letterSpacing: '-0.01em',
              transition: 'color 200ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content panels — all rendered, stacked via CSS grid, fade in/out */}
      <div style={{ display: 'grid', marginTop: isPill ? 20 : 24 }}>
        {children.map((child, i) => (
          <div
            key={i}
            aria-hidden={active !== i}
            style={{
              gridArea: '1 / 1',
              opacity: active === i ? 1 : 0,
              transform: active === i ? 'translateY(0)' : 'translateY(5px)',
              transition: 'opacity 180ms ease, transform 180ms ease',
              pointerEvents: active === i ? 'all' : 'none',
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

// Usage
export default function App() {
  return (
    <div style={{ padding: 24, maxWidth: 480, fontFamily: font }}>
      {/* Pill variant */}
      <TabSwitcher tabs={['Overview', 'Activity', 'Members']} variant="pill">
        {[
          <div key="o">Overview content</div>,
          <div key="a">Activity content</div>,
          <div key="m">Members content</div>,
        ]}
      </TabSwitcher>

      <div style={{ marginTop: 40 }}>
        {/* Underline variant */}
        <TabSwitcher tabs={['General', 'Security', 'Billing']} variant="underline">
          {[
            <div key="g">General settings</div>,
            <div key="s">Security settings</div>,
            <div key="b">Billing details</div>,
          ]}
        </TabSwitcher>
      </div>
    </div>
  )
}`

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TabSwitcherPage() {
  return (
    <div style={{ background: '#fff' }}>
      {/* DEMO */}
      <Demo />

      {/* CODE */}
      <div
        style={{
          background: '#0a0a0a',
          padding: 'clamp(24px, 4vw, 48px)' as any,
          fontFamily: font,
        }}
      >
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                  marginBottom: 2,
                }}
              >
                Tab Switcher
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                Drop into any React project — zero dependencies
              </div>
            </div>
            <CopyButton text={CODE_SOURCE} />
          </div>

          <div
            style={{
              background: '#111',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '10px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 500,
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                TabSwitcher.tsx
              </div>
            </div>
            <pre
              style={{
                margin: 0,
                padding: '20px',
                overflowX: 'auto',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                fontSize: 12.5,
                lineHeight: 1.65,
                color: '#e5e5e5',
                scrollbarWidth: 'thin' as any,
                scrollbarColor: 'rgba(255,255,255,0.1) transparent',
              }}
            >
              <code>{CODE_SOURCE}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
