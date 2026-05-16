'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Profile {
  initials: string
  color: string
  name: string
  handle: string
  role: string
  bio: string
  followers: number
  following: number
  projects: number
}

// ─── HoverCard ────────────────────────────────────────────────────────────────

function HoverCard({
  trigger,
  children,
  openDelay = 200,
  closeDelay = 120,
}: {
  trigger: React.ReactNode
  children: React.ReactNode
  openDelay?: number
  closeDelay?: number
}) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom')
  const triggerRef = useRef<HTMLSpanElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const measure = useCallback(() => {
    const tr = triggerRef.current
    const cr = cardRef.current
    if (!tr) return
    const tb = tr.getBoundingClientRect()
    const cw = cr ? cr.offsetWidth : 280
    const ch = cr ? cr.offsetHeight : 180
    const OFFSET = 8
    const pl: 'top' | 'bottom' = window.innerHeight - tb.bottom >= ch + OFFSET ? 'bottom' : 'top'
    setCoords({
      top: pl === 'bottom' ? tb.bottom + OFFSET : tb.top - ch - OFFSET,
      left: Math.max(8, Math.min(tb.left + tb.width / 2 - cw / 2, window.innerWidth - cw - 8)),
    })
    setPlacement(pl)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const show = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    openTimer.current = setTimeout(() => {
      setOpen(true)
      requestAnimationFrame(measure)
    }, openDelay)
  }, [openDelay, measure])

  const hide = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay)
  }, [closeDelay])

  useEffect(() => () => {
    if (openTimer.current) clearTimeout(openTimer.current)
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  return (
    <>
      <span ref={triggerRef} onMouseEnter={show} onMouseLeave={hide} style={{ display: 'inline' }}>
        {trigger}
      </span>
      <div
        ref={cardRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        style={{
          position: 'fixed',
          top: coords.top,
          left: coords.left,
          zIndex: 9999,
          pointerEvents: open ? 'auto' : 'none',
          opacity: open ? 1 : 0,
          transform: open
            ? 'scale(1) translateY(0)'
            : `scale(0.95) translateY(${placement === 'bottom' ? '-6px' : '6px'})`,
          transition: 'opacity 160ms cubic-bezier(0.4,0,0.2,1), transform 160ms cubic-bezier(0.4,0,0.2,1)',
          transformOrigin: placement === 'bottom' ? 'top center' : 'bottom center',
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </div>
    </>
  )
}

// ─── ProfileCard ──────────────────────────────────────────────────────────────

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '14px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.10)',
      padding: '16px',
      width: '264px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: profile.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '15px', fontWeight: 700, color: '#fff',
          letterSpacing: '0.01em', flexShrink: 0,
        }}>
          {profile.initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', lineHeight: '18px' }}>
            {profile.name}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(10,10,10,0.4)', fontWeight: 500, letterSpacing: '-0.01em' }}>
            @{profile.handle}
          </p>
        </div>
      </div>

      {/* Role pill */}
      <div style={{
        display: 'inline-flex',
        background: 'rgba(10,10,10,0.04)',
        border: '1px solid rgba(10,10,10,0.06)',
        borderRadius: '6px',
        padding: '3px 8px',
        marginBottom: '10px',
      }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(10,10,10,0.5)', letterSpacing: '-0.01em' }}>
          {profile.role}
        </span>
      </div>

      {/* Bio */}
      <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'rgba(10,10,10,0.6)', lineHeight: '1.65', letterSpacing: '-0.01em', fontWeight: 500 }}>
        {profile.bio}
      </p>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', paddingTop: '12px', borderTop: '1px solid rgba(10,10,10,0.06)' }}>
        {[
          { value: profile.followers, label: 'Followers' },
          { value: profile.following, label: 'Following' },
          { value: profile.projects, label: 'Projects' },
        ].map(s => (
          <div key={s.label}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', lineHeight: '17px' }}>
              {s.value.toLocaleString()}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(10,10,10,0.38)', fontWeight: 500, letterSpacing: '-0.005em' }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const PROFILES: Profile[] = [
  {
    initials: 'AH', color: '#6366f1',
    name: 'Alex Harper', handle: 'alexharper', role: 'Design Lead',
    bio: 'Building design systems and interaction patterns that help product teams move faster.',
    followers: 1842, following: 312, projects: 47,
  },
  {
    initials: 'MR', color: '#0ea5e9',
    name: 'Maria Rossi', handle: 'mariarossi', role: 'Frontend Engineer',
    bio: 'Obsessed with performance and animations. React core team alumni. Open-source contributor.',
    followers: 4210, following: 187, projects: 89,
  },
  {
    initials: 'JS', color: '#10b981',
    name: 'Jordan Smith', handle: 'jordsmith', role: 'Product Manager',
    bio: 'Shipping at the intersection of AI and developer tools. Previously at Linear and Figma.',
    followers: 923, following: 541, projects: 12,
  },
  {
    initials: 'KL', color: '#f59e0b',
    name: 'Kai Lin', handle: 'kailin', role: 'Backend Engineer',
    bio: 'Distributed systems and databases. Author of the Zero to Prod open-source template.',
    followers: 2756, following: 98, projects: 63,
  },
]

const ACTIVITY = [
  { user: PROFILES[0], action: 'merged a design token update into main', time: '2m ago' },
  { user: PROFILES[1], action: 'opened PR #42 · Virtualized list component', time: '18m ago' },
  { user: PROFILES[2], action: 'left a comment on the Q3 roadmap', time: '1h ago' },
  { user: PROFILES[3], action: 'deployed new services to production', time: '3h ago' },
  { user: PROFILES[0], action: 'published the updated component spec', time: '5h ago' },
]

// ─── Demo ─────────────────────────────────────────────────────────────────────

function Demo() {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      overflow: 'hidden',
      width: '400px',
      maxWidth: '100%',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.07)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
          Activity
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(10,10,10,0.38)', fontWeight: 500, letterSpacing: '-0.01em' }}>
          Hover a name to preview their profile
        </p>
      </div>

      {/* Feed */}
      <div>
        {ACTIVITY.map((item, i) => (
          <div
            key={i}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 16px', transition: 'background 150ms ease' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.02)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: item.user.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 700, color: '#fff',
              flexShrink: 0, marginTop: 1,
            }}>
              {item.user.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#0a0a0a', lineHeight: '1.5', letterSpacing: '-0.01em' }}>
                <HoverCard
                  trigger={
                    <span style={{
                      fontWeight: 600,
                      cursor: 'default',
                      textDecoration: 'underline',
                      textDecorationStyle: 'dotted',
                      textDecorationColor: 'rgba(10,10,10,0.25)',
                      textUnderlineOffset: '2px',
                    }}>
                      {item.user.name}
                    </span>
                  }
                >
                  <ProfileCard profile={item.user} />
                </HoverCard>
                {' '}{item.action}
              </p>
            </div>
            <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.32)', fontWeight: 500, whiteSpace: 'nowrap', paddingTop: 2 }}>
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export function HoverCard({
  trigger,
  children,
  openDelay = 200,
  closeDelay = 120,
}: {
  trigger: React.ReactNode
  children: React.ReactNode
  openDelay?: number
  closeDelay?: number
}) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom')
  const triggerRef = useRef<HTMLSpanElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const measure = useCallback(() => {
    const tr = triggerRef.current
    const cr = cardRef.current
    if (!tr) return
    const tb = tr.getBoundingClientRect()
    const cw = cr ? cr.offsetWidth : 280
    const ch = cr ? cr.offsetHeight : 180
    const OFFSET = 8
    const pl: 'top' | 'bottom' = window.innerHeight - tb.bottom >= ch + OFFSET ? 'bottom' : 'top'
    setCoords({
      top: pl === 'bottom' ? tb.bottom + OFFSET : tb.top - ch - OFFSET,
      left: Math.max(8, Math.min(tb.left + tb.width / 2 - cw / 2, window.innerWidth - cw - 8)),
    })
    setPlacement(pl)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const show = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    openTimer.current = setTimeout(() => {
      setOpen(true)
      requestAnimationFrame(measure)
    }, openDelay)
  }, [openDelay, measure])

  const hide = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay)
  }, [closeDelay])

  useEffect(() => () => {
    if (openTimer.current) clearTimeout(openTimer.current)
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  return (
    <>
      <span ref={triggerRef} onMouseEnter={show} onMouseLeave={hide} style={{ display: 'inline' }}>
        {trigger}
      </span>
      <div
        ref={cardRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        style={{
          position: 'fixed',
          top: coords.top,
          left: coords.left,
          zIndex: 9999,
          pointerEvents: open ? 'auto' : 'none',
          opacity: open ? 1 : 0,
          transform: open
            ? 'scale(1) translateY(0)'
            : \`scale(0.95) translateY(\${placement === 'bottom' ? '-6px' : '6px'})\`,
          transition: 'opacity 160ms cubic-bezier(0.4,0,0.2,1), transform 160ms cubic-bezier(0.4,0,0.2,1)',
          transformOrigin: placement === 'bottom' ? 'top center' : 'bottom center',
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </div>
    </>
  )
}

// Usage:
// <HoverCard trigger={<span style={{ fontWeight: 600 }}>Alex Harper</span>}>
//   <div style={{ background: '#fff', border: '1px solid rgba(10,10,10,0.08)', borderRadius: 14, padding: 16, width: 260, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}>
//     Your card content here
//   </div>
// </HoverCard>`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HoverCardPage() {
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
          Hover Card
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
