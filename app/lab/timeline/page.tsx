'use client'

import { useState, useEffect, useRef } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Types ────────────────────────────────────────────────────────────────────

type EventType = 'default' | 'success' | 'error' | 'warning' | 'info'

interface TimelineEvent {
  id: number
  type: EventType
  title: string
  description?: string
  timestamp: string
  avatar?: { initials: string; color: string }
  tag?: string
}

// ─── Dot color map ────────────────────────────────────────────────────────────

const TYPE_STYLES: Record<EventType, { dot: string; glow: string }> = {
  default: { dot: 'rgba(10,10,10,0.3)',   glow: 'rgba(10,10,10,0.08)'   },
  success: { dot: '#16a34a',              glow: 'rgba(22,163,74,0.15)'  },
  error:   { dot: '#dc2626',              glow: 'rgba(220,38,38,0.15)'  },
  warning: { dot: '#d97706',              glow: 'rgba(217,119,6,0.15)'  },
  info:    { dot: '#2563eb',              glow: 'rgba(37,99,235,0.15)'  },
}

// ─── Single item ──────────────────────────────────────────────────────────────

function TimelineItem({
  event,
  isLast,
  delay = 0,
}: {
  event: TimelineEvent
  isLast: boolean
  delay?: number
}) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const didAnimate = useRef(false)
  const s = TYPE_STYLES[event.type]

  useEffect(() => {
    if (didAnimate.current) return
    didAnimate.current = true
    const id = setTimeout(() => setVisible(true), delay + 16)
    return () => clearTimeout(id)
  }, []) // eslint-disable-line

  return (
    <div
      style={{
        display: 'flex',
        gap: '14px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-8px)',
        transition: 'opacity 320ms ease, transform 320ms ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Track: dot + connector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '28px', flexShrink: 0 }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: '#fff',
          border: `1.5px solid ${hovered ? s.dot : 'rgba(10,10,10,0.1)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: hovered ? `0 0 0 5px ${s.glow}` : '0 0 0 0px transparent',
          transition: 'box-shadow 200ms ease, border-color 200ms ease',
          flexShrink: 0,
        }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: s.dot,
            transform: hovered ? 'scale(1.45)' : 'scale(1)',
            transition: 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }} />
        </div>
        {!isLast && (
          <div style={{
            width: '1px', flex: 1,
            background: 'rgba(10,10,10,0.07)',
            marginTop: '3px', minHeight: '10px',
          }} />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, paddingBottom: isLast ? '2px' : '18px', paddingTop: '4px' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          gap: '6px', flexWrap: 'wrap' as const,
          marginBottom: event.description ? '3px' : 0,
        }}>
          {event.avatar && (
            <div style={{
              width: '16px', height: '16px', borderRadius: '50%',
              background: event.avatar.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '8px', fontWeight: 700, color: '#fff',
              flexShrink: 0, marginTop: '2px', fontFamily: FONT,
            }}>
              {event.avatar.initials}
            </div>
          )}

          <span style={{
            fontSize: '13px', fontWeight: 600, color: '#0a0a0a',
            letterSpacing: '-0.01em', lineHeight: '20px',
            fontFamily: FONT, flex: 1, minWidth: 0,
          }}>
            {event.title}
          </span>

          {event.tag && (
            <span style={{
              fontSize: '10px', fontWeight: 600, letterSpacing: '0.02em',
              color: s.dot, background: s.glow,
              padding: '1px 6px', borderRadius: '4px',
              flexShrink: 0, fontFamily: FONT,
            }}>
              {event.tag}
            </span>
          )}

          <span style={{
            fontSize: '11px', fontWeight: 500,
            color: 'rgba(10,10,10,0.35)',
            letterSpacing: '-0.01em', fontFamily: FONT,
            flexShrink: 0, marginTop: '1px', whiteSpace: 'nowrap' as const,
          }}>
            {event.timestamp}
          </span>
        </div>

        {event.description && (
          <p style={{
            margin: 0, fontSize: '12px', fontWeight: 400,
            color: 'rgba(10,10,10,0.5)',
            letterSpacing: '-0.01em', lineHeight: '17px', fontFamily: FONT,
          }}>
            {event.description}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_EVENTS: TimelineEvent[] = [
  {
    id: 1, type: 'success', timestamp: 'just now',
    title: 'Deployed to production',
    description: 'v2.4.1 shipped successfully to all regions.',
    avatar: { initials: 'V', color: '#6366f1' },
    tag: 'DEPLOY',
  },
  {
    id: 2, type: 'info', timestamp: '4m ago',
    title: 'Pull request merged',
    description: 'feat: add smooth timeline component — 3 files changed.',
    avatar: { initials: 'A', color: '#0ea5e9' },
  },
  {
    id: 3, type: 'warning', timestamp: '22m ago',
    title: 'High memory usage detected',
    description: 'Worker peaked at 89%. Auto-scaling triggered.',
    tag: 'ALERT',
  },
  {
    id: 4, type: 'default', timestamp: '1h ago',
    title: 'Code review requested',
    description: '2 reviewers assigned. Awaiting approval.',
    avatar: { initials: 'S', color: '#ec4899' },
  },
  {
    id: 5, type: 'error', timestamp: '2h ago',
    title: 'Build failed',
    description: 'TypeScript error in components/Button.tsx at line 42.',
    avatar: { initials: 'V', color: '#6366f1' },
    tag: 'CI',
  },
  {
    id: 6, type: 'success', timestamp: '2h ago',
    title: 'All tests passed',
    description: '247 tests run · 100% coverage maintained.',
    tag: 'CI',
  },
]

const NEW_OPTIONS: Omit<TimelineEvent, 'id'>[] = [
  { type: 'success', timestamp: 'just now', title: 'Deployment succeeded', description: 'Changes are live in production.', avatar: { initials: 'V', color: '#6366f1' }, tag: 'DEPLOY' },
  { type: 'info', timestamp: 'just now', title: 'Comment added', description: 'Left a note on the open issue.', avatar: { initials: 'A', color: '#0ea5e9' } },
  { type: 'warning', timestamp: 'just now', title: 'Rate limit warning', description: 'API quota at 80%. Consider upgrading.', tag: 'ALERT' },
  { type: 'error', timestamp: 'just now', title: 'Service degraded', description: 'Increased latency in /api/search endpoint.' },
  { type: 'default', timestamp: 'just now', title: 'Branch created', description: 'feat/smooth-animations pushed to remote.', avatar: { initials: 'S', color: '#ec4899' } },
  { type: 'info', timestamp: 'just now', title: 'Issue opened', description: 'Accessibility: missing aria-labels on icon buttons.', avatar: { initials: 'A', color: '#0ea5e9' } },
]

// ─── Timeline component ───────────────────────────────────────────────────────

function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>(INITIAL_EVENTS)
  const [flash, setFlash] = useState(false)
  const counterRef = useRef(100)

  const addEvent = () => {
    const id = ++counterRef.current
    const pick = NEW_OPTIONS[Math.floor(Math.random() * NEW_OPTIONS.length)]
    setEvents(prev => [{ ...pick, id }, ...prev].slice(0, 10))
    setFlash(true)
    setTimeout(() => setFlash(false), 400)
  }

  return (
    <div style={{ width: '380px', maxWidth: '100%', fontFamily: FONT }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '16px',
      }}>
        <div>
          <div style={{
            fontSize: '15px', fontWeight: 600, color: '#0a0a0a',
            letterSpacing: '-0.02em', fontFamily: FONT,
          }}>
            Activity
          </div>
          <div style={{
            fontSize: '12px', fontWeight: 500,
            color: 'rgba(10,10,10,0.4)',
            letterSpacing: '-0.01em', fontFamily: FONT,
          }}>
            {events.length} recent event{events.length !== 1 ? 's' : ''}
          </div>
        </div>

        <button
          onClick={addEvent}
          style={{
            padding: '7px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(10,10,10,0.08)',
            background: flash ? 'rgba(10,10,10,0.05)' : '#fff',
            color: '#0a0a0a',
            fontSize: '12px', fontWeight: 600, letterSpacing: '-0.01em',
            cursor: 'pointer', fontFamily: FONT,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            transition: 'background 150ms ease, transform 100ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.05)')}
          onMouseLeave={e => { if (!flash) e.currentTarget.style.background = '#fff' }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          + Add event
        </button>
      </div>

      {/* Card */}
      <div style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '14px',
        padding: '16px 16px 10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
        maxHeight: '440px',
        overflowY: 'auto',
      }}>
        {events.map((event, i) => (
          <TimelineItem
            key={event.id}
            event={event}
            isLast={i === events.length - 1}
            delay={Math.min(i * 55, 270)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useEffect, useRef } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type EventType = 'default' | 'success' | 'error' | 'warning' | 'info'

interface TimelineEvent {
  id: number
  type: EventType
  title: string
  description?: string
  timestamp: string
  avatar?: { initials: string; color: string }
  tag?: string
}

const TYPE_STYLES: Record<EventType, { dot: string; glow: string }> = {
  default: { dot: 'rgba(10,10,10,0.3)',  glow: 'rgba(10,10,10,0.08)'  },
  success: { dot: '#16a34a',             glow: 'rgba(22,163,74,0.15)' },
  error:   { dot: '#dc2626',             glow: 'rgba(220,38,38,0.15)' },
  warning: { dot: '#d97706',             glow: 'rgba(217,119,6,0.15)' },
  info:    { dot: '#2563eb',             glow: 'rgba(37,99,235,0.15)' },
}

function TimelineItem({
  event,
  isLast,
  delay = 0,
}: {
  event: TimelineEvent
  isLast: boolean
  delay?: number
}) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const didAnimate = useRef(false)
  const s = TYPE_STYLES[event.type]

  useEffect(() => {
    if (didAnimate.current) return
    didAnimate.current = true
    const id = setTimeout(() => setVisible(true), delay + 16)
    return () => clearTimeout(id)
  }, []) // eslint-disable-line

  return (
    <div
      style={{
        display: 'flex', gap: '14px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-8px)',
        transition: 'opacity 320ms ease, transform 320ms ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Track */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '28px', flexShrink: 0 }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%', background: '#fff',
          border: \`1.5px solid \${hovered ? s.dot : 'rgba(10,10,10,0.1)'}\`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: hovered ? \`0 0 0 5px \${s.glow}\` : '0 0 0 0px transparent',
          transition: 'box-shadow 200ms ease, border-color 200ms ease',
          flexShrink: 0,
        }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%', background: s.dot,
            transform: hovered ? 'scale(1.45)' : 'scale(1)',
            transition: 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }} />
        </div>
        {!isLast && (
          <div style={{
            width: '1px', flex: 1, background: 'rgba(10,10,10,0.07)',
            marginTop: '3px', minHeight: '10px',
          }} />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, paddingBottom: isLast ? '2px' : '18px', paddingTop: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', flexWrap: 'wrap', marginBottom: event.description ? '3px' : 0 }}>
          {event.avatar && (
            <div style={{
              width: '16px', height: '16px', borderRadius: '50%', background: event.avatar.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '8px', fontWeight: 700, color: '#fff', flexShrink: 0, marginTop: '2px',
            }}>
              {event.avatar.initials}
            </div>
          )}
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: '20px', flex: 1, minWidth: 0 }}>
            {event.title}
          </span>
          {event.tag && (
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.02em', color: s.dot, background: s.glow, padding: '1px 6px', borderRadius: '4px', flexShrink: 0 }}>
              {event.tag}
            </span>
          )}
          <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.35)', letterSpacing: '-0.01em', flexShrink: 0, marginTop: '1px', whiteSpace: 'nowrap' }}>
            {event.timestamp}
          </span>
        </div>
        {event.description && (
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 400, color: 'rgba(10,10,10,0.5)', letterSpacing: '-0.01em', lineHeight: '17px' }}>
            {event.description}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Example usage ──────────────────────────────────────────────────────────────

const EVENTS: TimelineEvent[] = [
  { id: 1, type: 'success', timestamp: 'just now', title: 'Deployed to production', description: 'v2.4.1 shipped to all regions.', avatar: { initials: 'V', color: '#6366f1' }, tag: 'DEPLOY' },
  { id: 2, type: 'info',    timestamp: '4m ago',   title: 'Pull request merged',    description: 'feat: add smooth timeline component.', avatar: { initials: 'A', color: '#0ea5e9' } },
  { id: 3, type: 'warning', timestamp: '22m ago',  title: 'High memory usage',      description: 'Worker peaked at 89%. Auto-scaled.', tag: 'ALERT' },
  { id: 4, type: 'error',   timestamp: '2h ago',   title: 'Build failed',           description: 'TypeScript error in Button.tsx:42.', tag: 'CI' },
  { id: 5, type: 'default', timestamp: '3h ago',   title: 'Code review requested',  description: '2 reviewers assigned.', avatar: { initials: 'S', color: '#ec4899' } },
]

export function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>(EVENTS)
  const counterRef = useRef(100)

  const addEvent = () => {
    const id = ++counterRef.current
    setEvents(prev => [
      { id, type: 'info', timestamp: 'just now', title: 'New event added', description: 'Something just happened.' },
      ...prev,
    ].slice(0, 10))
  }

  return (
    <div style={{ width: '380px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>Activity</div>
        <button
          onClick={addEvent}
          style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(10,10,10,0.08)', background: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
        >
          + Add event
        </button>
      </div>
      <div style={{ background: '#fff', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '14px', padding: '16px 16px 10px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
        {events.map((event, i) => (
          <TimelineItem key={event.id} event={event} isLast={i === events.length - 1} delay={Math.min(i * 55, 270)} />
        ))}
      </div>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TimelinePage() {
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
      }}>
        <Timeline />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase' as const, color: 'rgba(10,10,10,0.4)',
          marginBottom: '12px', fontFamily: FONT,
        }}>
          Source
        </p>
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
