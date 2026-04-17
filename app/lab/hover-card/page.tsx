'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────

interface Profile {
  name: string
  handle: string
  title: string
  bio: string
  avatarColor: string
  initials: string
  stats: { label: string; value: string }[]
  tags: string[]
}

// ── HoverCard ─────────────────────────────────────────────────────────────────

function HoverCard({
  children,
  card,
}: {
  children: React.ReactNode
  card: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0, above: false })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const computePos = useCallback(() => {
    if (!triggerRef.current || !cardRef.current) return
    const tr = triggerRef.current.getBoundingClientRect()
    const cr = cardRef.current.getBoundingClientRect()
    const GAP = 10
    const above = window.innerHeight - tr.bottom < cr.height + GAP + 16
    let x = tr.left + tr.width / 2 - cr.width / 2
    let y = above ? tr.top - cr.height - GAP : tr.bottom + GAP
    x = Math.max(12, Math.min(window.innerWidth - cr.width - 12, x))
    y = Math.max(8, Math.min(window.innerHeight - cr.height - 8, y))
    setPos({ x, y, above })
  }, [])

  useEffect(() => {
    if (!mounted) return
    const id = requestAnimationFrame(() => {
      computePos()
      requestAnimationFrame(() => setVisible(true))
    })
    return () => cancelAnimationFrame(id)
  }, [mounted, computePos])

  const show = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    showTimer.current = setTimeout(() => setMounted(true), 280)
  }, [])

  const hide = useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current)
    setVisible(false)
    hideTimer.current = setTimeout(() => setMounted(false), 200)
  }, [])

  useEffect(() => () => {
    if (showTimer.current) clearTimeout(showTimer.current)
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }, [])

  const enterTransform = pos.above
    ? 'translateY(6px) scale(0.96)'
    : 'translateY(-6px) scale(0.96)'

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        style={{ display: 'inline-block' }}
      >
        {children}
      </span>

      {mounted && (
        <div
          ref={cardRef}
          onMouseEnter={() => { if (hideTimer.current) clearTimeout(hideTimer.current) }}
          onMouseLeave={hide}
          style={{
            position: 'fixed',
            top: pos.y,
            left: pos.x,
            zIndex: 9999,
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : enterTransform,
            transition: 'opacity 180ms ease, transform 230ms cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {card}
        </div>
      )}
    </>
  )
}

// ── ProfileCard ───────────────────────────────────────────────────────────────

function ProfileCard({ p }: { p: Profile }) {
  const [following, setFollowing] = useState(false)

  return (
    <div
      style={{
        width: '272px',
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Banner */}
      <div style={{
        height: '52px',
        background: `linear-gradient(135deg, ${p.avatarColor}28 0%, ${p.avatarColor}50 100%)`,
      }} />

      {/* Avatar row */}
      <div style={{
        padding: '0 16px',
        marginTop: '-26px',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: p.avatarColor,
          border: '3px solid #fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '-0.02em',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        }}>
          {p.initials}
        </div>

        <button
          onClick={() => setFollowing(f => !f)}
          style={{
            padding: '5px 14px',
            borderRadius: '8px',
            border: following ? 'none' : '1px solid rgba(10,10,10,0.12)',
            background: following ? '#0a0a0a' : '#fff',
            fontSize: '12px',
            fontWeight: 600,
            color: following ? '#fff' : '#0a0a0a',
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            transition: 'background 150ms ease, color 150ms ease, border 150ms ease',
            userSelect: 'none',
          }}
        >
          {following ? 'Following' : 'Follow'}
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {p.name}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em', marginTop: '1px' }}>
            @{p.handle}
          </div>
        </div>

        <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(10,10,10,0.45)', marginBottom: '4px', letterSpacing: '-0.01em' }}>
          {p.title}
        </div>

        <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)', lineHeight: 1.5, marginBottom: '12px', letterSpacing: '-0.01em' }}>
          {p.bio}
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
          {p.tags.map(tag => (
            <span
              key={tag}
              style={{
                padding: '2px 8px',
                borderRadius: '999px',
                background: 'rgba(10,10,10,0.05)',
                border: '1px solid rgba(10,10,10,0.07)',
                fontSize: '11px',
                fontWeight: 500,
                color: 'rgba(10,10,10,0.55)',
                letterSpacing: '-0.01em',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '20px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(10,10,10,0.06)',
        }}>
          {p.stats.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {s.value}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.38)', letterSpacing: '-0.01em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Data ───────────────────────────────────────────────────────────────────────

const PROFILES: Profile[] = [
  {
    name: 'Alex Chen',
    handle: 'alexchen',
    title: 'Senior Product Designer at Linear',
    bio: 'Building interfaces that feel inevitable. Previously at Figma and Notion.',
    avatarColor: '#6366f1',
    initials: 'AC',
    stats: [{ label: 'Following', value: '214' }, { label: 'Followers', value: '12.4k' }, { label: 'Posts', value: '847' }],
    tags: ['Design Systems', 'Motion', 'Figma'],
  },
  {
    name: 'Maya Patel',
    handle: 'mayapatel',
    title: 'Staff Engineer at Vercel',
    bio: 'Full-stack everything. Open source contributor. Tea over coffee, always.',
    avatarColor: '#ec4899',
    initials: 'MP',
    stats: [{ label: 'Following', value: '89' }, { label: 'Followers', value: '8.2k' }, { label: 'Posts', value: '391' }],
    tags: ['TypeScript', 'React', 'Infrastructure'],
  },
  {
    name: 'Jordan Rivera',
    handle: 'jrivera',
    title: 'Design Engineer at Stripe',
    bio: 'Where code meets craft. Writing about interaction design and web APIs.',
    avatarColor: '#f59e0b',
    initials: 'JR',
    stats: [{ label: 'Following', value: '532' }, { label: 'Followers', value: '23.1k' }, { label: 'Posts', value: '1.2k' }],
    tags: ['CSS', 'Animation', 'Web APIs'],
  },
  {
    name: 'Sam Okafor',
    handle: 'samokafor',
    title: 'Head of Design at Loom',
    bio: 'Making the complex feel simple. Obsessed with zero-friction experiences.',
    avatarColor: '#10b981',
    initials: 'SO',
    stats: [{ label: 'Following', value: '167' }, { label: 'Followers', value: '5.8k' }, { label: 'Posts', value: '629' }],
    tags: ['UX Research', 'Product', 'Accessibility'],
  },
]

const FEED = [
  { author: 0, action: 'merged a pull request in', target: 'linear/app', time: '2m ago' },
  { author: 1, action: 'pushed 3 commits to', target: 'vercel/next.js', time: '14m ago' },
  { author: 2, action: 'opened an issue in', target: 'stripe/elements', time: '1h ago' },
  { author: 3, action: 'starred', target: 'radix-ui/primitives', time: '3h ago' },
]

// ── Demo ───────────────────────────────────────────────────────────────────────

function Demo() {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '16px',
        padding: '28px 32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.06)',
        width: '100%',
        maxWidth: '440px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <p style={{
        margin: '0 0 14px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'rgba(10,10,10,0.35)',
      }}>
        Activity Feed
      </p>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {FEED.map((item, i) => {
          const profile = PROFILES[item.author]
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 0',
                borderBottom: i < FEED.length - 1 ? '1px solid rgba(10,10,10,0.05)' : 'none',
              }}
            >
              {/* Avatar */}
              <HoverCard card={<ProfileCard p={profile} />}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: profile.avatarColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0,
                  cursor: 'default',
                }}>
                  {profile.initials}
                </div>
              </HoverCard>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '13px', color: 'rgba(10,10,10,0.65)', lineHeight: 1.45, letterSpacing: '-0.01em' }}>
                  <HoverCard card={<ProfileCard p={profile} />}>
                    <span style={{
                      fontWeight: 600,
                      color: '#0a0a0a',
                      cursor: 'default',
                      borderBottom: '1px solid rgba(10,10,10,0.18)',
                      paddingBottom: '1px',
                    }}>
                      {profile.name}
                    </span>
                  </HoverCard>
                  {' '}{item.action}{' '}
                  <span style={{ fontWeight: 600, color: '#0a0a0a' }}>{item.target}</span>
                </span>
              </div>

              {/* Time */}
              <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.3)', flexShrink: 0, letterSpacing: '-0.01em' }}>
                {item.time}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Code source ────────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// Wrap any trigger element — the card renders in a fixed portal on hover.
function HoverCard({
  children,
  card,
}: {
  children: React.ReactNode
  card: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0, above: false })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const computePos = useCallback(() => {
    if (!triggerRef.current || !cardRef.current) return
    const tr = triggerRef.current.getBoundingClientRect()
    const cr = cardRef.current.getBoundingClientRect()
    const GAP = 10
    const above = window.innerHeight - tr.bottom < cr.height + GAP + 16
    let x = tr.left + tr.width / 2 - cr.width / 2
    let y = above ? tr.top - cr.height - GAP : tr.bottom + GAP
    x = Math.max(12, Math.min(window.innerWidth - cr.width - 12, x))
    y = Math.max(8, Math.min(window.innerHeight - cr.height - 8, y))
    setPos({ x, y, above })
  }, [])

  useEffect(() => {
    if (!mounted) return
    const id = requestAnimationFrame(() => {
      computePos()
      requestAnimationFrame(() => setVisible(true))
    })
    return () => cancelAnimationFrame(id)
  }, [mounted, computePos])

  const show = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    showTimer.current = setTimeout(() => setMounted(true), 280)
  }, [])

  const hide = useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current)
    setVisible(false)
    hideTimer.current = setTimeout(() => setMounted(false), 200)
  }, [])

  useEffect(() => () => {
    if (showTimer.current) clearTimeout(showTimer.current)
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }, [])

  const enterTransform = pos.above
    ? 'translateY(6px) scale(0.96)'
    : 'translateY(-6px) scale(0.96)'

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        style={{ display: 'inline-block' }}
      >
        {children}
      </span>

      {mounted && (
        <div
          ref={cardRef}
          onMouseEnter={() => { if (hideTimer.current) clearTimeout(hideTimer.current) }}
          onMouseLeave={hide}
          style={{
            position: 'fixed',
            top: pos.y,
            left: pos.x,
            zIndex: 9999,
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : enterTransform,
            transition: 'opacity 180ms ease, transform 230ms cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {card}
        </div>
      )}
    </>
  )
}

// Example profile card rendered inside the hover card
function ProfileCard({ name, handle, bio, avatarColor, initials }: {
  name: string
  handle: string
  bio: string
  avatarColor: string
  initials: string
}) {
  const [following, setFollowing] = useState(false)

  return (
    <div style={{
      width: '272px',
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>
      <div style={{ height: '52px', background: avatarColor + '44' }} />

      <div style={{ padding: '0 16px', marginTop: '-26px', marginBottom: '10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: avatarColor, border: '3px solid #fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', fontWeight: 700, color: '#fff',
        }}>
          {initials}
        </div>

        <button
          onClick={() => setFollowing(f => !f)}
          style={{
            padding: '5px 14px', borderRadius: '8px',
            border: following ? 'none' : '1px solid rgba(10,10,10,0.12)',
            background: following ? '#0a0a0a' : '#fff',
            fontSize: '12px', fontWeight: 600,
            color: following ? '#fff' : '#0a0a0a',
            cursor: 'pointer',
            transition: 'background 150ms ease, color 150ms ease',
          }}
        >
          {following ? 'Following' : 'Follow'}
        </button>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em' }}>{name}</div>
        <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.4)', marginBottom: '8px' }}>@{handle}</div>
        <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)', lineHeight: 1.5 }}>{bio}</div>
      </div>
    </div>
  )
}

// Usage
export default function Example() {
  return (
    <p style={{ fontFamily: 'sans-serif', fontSize: '14px' }}>
      Hover over{' '}
      <HoverCard
        card={
          <ProfileCard
            name="Alex Chen"
            handle="alexchen"
            bio="Building interfaces that feel inevitable."
            avatarColor="#6366f1"
            initials="AC"
          />
        }
      >
        <span style={{ fontWeight: 600, borderBottom: '1px solid rgba(0,0,0,0.2)', paddingBottom: '1px', cursor: 'default' }}>
          Alex Chen
        </span>
      </HoverCard>
      {' '}to see the card.
    </p>
  )
}`

// ── Page ───────────────────────────────────────────────────────────────────────

export default function HoverCardPage() {
  return (
    <main
      style={{
        backgroundColor: 'var(--bg, #ffffff)',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Demo */}
      <section
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
          padding: '60px 24px',
        }}
      >
        <Demo />
      </section>

      {/* Code */}
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
