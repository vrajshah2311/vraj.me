'use client'

import React, { useState, useEffect, useRef } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type User = {
  id: string; name: string; handle: string; role: string; bio: string
  initials: string; color: string; followers: number; following: number
}

const USERS: User[] = [
  { id: 'emma', name: 'Emma Chen', handle: '@emmadesigns', role: 'Product Designer · Vercel', bio: 'Crafting delightful interfaces one pixel at a time.', initials: 'EC', color: '#8B5CF6', followers: 4800, following: 312 },
  { id: 'luca', name: 'Luca Moretti', handle: '@lucadev', role: 'Frontend Engineer · Linear', bio: 'Obsessed with performance, motion, and clean code.', initials: 'LM', color: '#0EA5E9', followers: 2100, following: 180 },
  { id: 'sarah', name: 'Sarah Kim', handle: '@sarahk', role: 'Design Engineer · Figma', bio: 'Building at the intersection of design and code.', initials: 'SK', color: '#F59E0B', followers: 11200, following: 640 },
  { id: 'alex', name: 'Alex Rivera', handle: '@alexmakes', role: 'Creative Director', bio: 'Art direction and visual storytelling for tech brands.', initials: 'AR', color: '#10B981', followers: 7300, following: 221 },
]

function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

// ── Hook ──────────────────────────────────────────────────────────────────────

function useHoverCard() {
  const [visible, setVisible] = useState(false)
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    enterTimer.current = setTimeout(() => setVisible(true), 350)
  }
  const hide = () => {
    if (enterTimer.current) clearTimeout(enterTimer.current)
    leaveTimer.current = setTimeout(() => setVisible(false), 150)
  }
  const cancelHide = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
  }

  useEffect(() => () => {
    if (enterTimer.current) clearTimeout(enterTimer.current)
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
  }, [])

  return { visible, show, hide, cancelHide }
}

// ── Popover ───────────────────────────────────────────────────────────────────

function HoverCardPopover({
  user, anchorRef, visible, onMouseEnter, onMouseLeave,
}: {
  user: User
  anchorRef: { readonly current: HTMLElement | null }
  visible: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0, origin: 'top center', ty: -6 })

  useEffect(() => {
    if (visible) {
      const el = anchorRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const W = 276, H = 196, gap = 10
        let left = rect.left + rect.width / 2 - W / 2
        left = Math.max(8, Math.min(left, window.innerWidth - W - 8))
        const below = window.innerHeight - rect.bottom >= H + gap
        setPos({
          top: below ? rect.bottom + gap : rect.top - H - gap,
          left,
          origin: below ? 'top center' : 'bottom center',
          ty: below ? -6 : 6,
        })
      }
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)))
    } else {
      setShow(false)
      const t = setTimeout(() => setMounted(false), 200)
      return () => clearTimeout(t)
    }
  }, [visible])

  if (!mounted) return null

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'fixed', top: pos.top, left: pos.left, width: 276,
        zIndex: 9999, fontFamily: font,
        transformOrigin: pos.origin,
        transform: show ? 'scale(1) translateY(0)' : `scale(0.95) translateY(${pos.ty}px)`,
        opacity: show ? 1 : 0,
        transition: show
          ? 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.16s ease'
          : 'transform 0.14s ease, opacity 0.12s ease',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 14,
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.03), 0 16px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.02)',
        padding: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: user.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {user.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {user.name}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', fontWeight: 500, marginTop: 1, letterSpacing: '-0.01em' }}>
              {user.handle}
            </div>
          </div>
          <button
            onClick={e => e.stopPropagation()}
            style={{
              padding: '5px 12px', background: '#0a0a0a', border: 'none',
              borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#fff',
              cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, letterSpacing: '-0.01em',
            }}
          >
            Follow
          </button>
        </div>

        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', fontWeight: 500, marginBottom: 5, letterSpacing: '-0.01em' }}>
          {user.role}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.72)', lineHeight: 1.55, marginBottom: 14, letterSpacing: '-0.01em' }}>
          {user.bio}
        </div>

        <div style={{ display: 'flex', paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          {[{ label: 'Followers', value: user.followers }, { label: 'Following', value: user.following }].map((s, i) => (
            <div key={s.label} style={{ flex: 1, textAlign: i === 0 ? 'left' : 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                {fmt(s.value)}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Trigger components ────────────────────────────────────────────────────────

function Avatar({ user }: { user: User }) {
  const { visible, show, hide, cancelHide } = useHoverCard()
  const anchorRef = useRef<HTMLDivElement>(null)
  const [hov, setHov] = useState(false)
  return (
    <>
      <div
        ref={anchorRef}
        onMouseEnter={() => { setHov(true); show() }}
        onMouseLeave={() => { setHov(false); hide() }}
        style={{
          width: 36, height: 36, borderRadius: 11, background: user.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer', flexShrink: 0,
          boxShadow: hov ? '0 0 0 3px rgba(0,0,0,0.1)' : '0 0 0 0px rgba(0,0,0,0)',
          transition: 'box-shadow 0.15s ease',
        }}
      >
        {user.initials}
      </div>
      <HoverCardPopover user={user} anchorRef={anchorRef} visible={visible} onMouseEnter={cancelHide} onMouseLeave={hide} />
    </>
  )
}

function Mention({ user }: { user: User }) {
  const { visible, show, hide, cancelHide } = useHoverCard()
  const anchorRef = useRef<HTMLSpanElement>(null)
  const [hov, setHov] = useState(false)
  return (
    <>
      <span
        ref={anchorRef}
        onMouseEnter={() => { setHov(true); show() }}
        onMouseLeave={() => { setHov(false); hide() }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          padding: '1px 6px 1px 3px',
          background: hov ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.04)',
          border: `1px solid ${hov ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.08)'}`,
          borderRadius: 6, cursor: 'pointer',
          transition: 'background 0.1s ease, border-color 0.1s ease',
          verticalAlign: 'middle', position: 'relative', top: -1,
        }}
      >
        <span style={{
          width: 14, height: 14, borderRadius: 4, background: user.color,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 7, fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>
          {user.initials[0]}
        </span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
          {user.handle}
        </span>
      </span>
      <HoverCardPopover user={user} anchorRef={anchorRef} visible={visible} onMouseEnter={cancelHide} onMouseLeave={hide} />
    </>
  )
}

// ── Feed ──────────────────────────────────────────────────────────────────────

function Post({ user, time, children }: { user: User; time: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <Avatar user={user} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>{user.name}</span>
          <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.35)', fontWeight: 500, letterSpacing: '-0.01em' }}>
            {user.handle} · {time}
          </span>
        </div>
        <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.72)', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Demo ──────────────────────────────────────────────────────────────────────

function Demo() {
  const [emma, luca, sarah, alex] = USERS
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
      padding: '40px 24px', fontFamily: font,
    }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.35)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          marginBottom: 16, textAlign: 'center',
        }}>
          Hover over avatars or @mentions
        </div>
        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.04)',
          padding: '0 16px',
        }}>
          <div style={{
            padding: '14px 0 12px', borderBottom: '1px solid rgba(0,0,0,0.06)',
            fontSize: 13, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em',
          }}>
            Following
          </div>
          <Post user={emma} time="2h">
            Just shipped the new design system at Vercel 🎉 Big thanks to{' '}
            <Mention user={luca} />{' '}for the motion work and{' '}
            <Mention user={sarah} />{' '}for owning the token architecture.
          </Post>
          <Post user={sarah} time="5h">
            Design tokens aren&apos;t just variables — they&apos;re a shared language. Collab with{' '}
            <Mention user={alex} />{' '}on visual direction has been incredible. cc{' '}
            <Mention user={emma} />
          </Post>
          <Post user={alex} time="8h">
            Art direction for tech products is finally getting the respect it deserves. The work{' '}
            <Mention user={emma} />{' '}shipped this month is proof.
          </Post>
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
        border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7,
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

import React, { useState, useEffect, useRef } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ── useHoverCard hook ─────────────────────────────────────────────────────────
// show() after 350ms delay, hide() after 150ms delay, cancelHide() to keep open

function useHoverCard() {
  const [visible, setVisible] = useState(false)
  const enterTimer = useRef(null)
  const leaveTimer = useRef(null)

  const show = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    enterTimer.current = setTimeout(() => setVisible(true), 350)
  }
  const hide = () => {
    if (enterTimer.current) clearTimeout(enterTimer.current)
    leaveTimer.current = setTimeout(() => setVisible(false), 150)
  }
  const cancelHide = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
  }

  useEffect(() => () => {
    if (enterTimer.current) clearTimeout(enterTimer.current)
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
  }, [])

  return { visible, show, hide, cancelHide }
}

// ── HoverCardPanel ────────────────────────────────────────────────────────────
// Handles positioning (smart flip up/down) + enter/exit animation.
// Pass cardHeight so it can decide whether to open above or below.

function HoverCardPanel({ children, anchorRef, visible, onMouseEnter, onMouseLeave, cardHeight = 200 }) {
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0, origin: 'top center', ty: -6 })
  const CARD_WIDTH = 280

  useEffect(() => {
    if (visible && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      const gap = 10
      let left = rect.left + rect.width / 2 - CARD_WIDTH / 2
      left = Math.max(8, Math.min(left, window.innerWidth - CARD_WIDTH - 8))
      const below = window.innerHeight - rect.bottom >= cardHeight + gap
      setPos({
        top: below ? rect.bottom + gap : rect.top - cardHeight - gap,
        left,
        origin: below ? 'top center' : 'bottom center',
        ty: below ? -6 : 6,
      })
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)))
    } else if (!visible) {
      setShow(false)
      const t = setTimeout(() => setMounted(false), 200)
      return () => clearTimeout(t)
    }
  }, [visible])

  if (!mounted) return null

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        width: CARD_WIDTH,
        zIndex: 9999,
        fontFamily: font,
        transformOrigin: pos.origin,
        transform: show ? 'scale(1) translateY(0)' : \`scale(0.95) translateY(\${pos.ty}px)\`,
        opacity: show ? 1 : 0,
        transition: show
          ? 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.16s ease'
          : 'transform 0.14s ease, opacity 0.12s ease',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      {children}
    </div>
  )
}

// ── HoverCard compound component ──────────────────────────────────────────────
// Wrap any trigger. Pass the card UI as \`content\`.
// cardHeight tells the panel how tall the card is (for flip logic).

export function HoverCard({ children, content, cardHeight = 200 }) {
  const { visible, show, hide, cancelHide } = useHoverCard()
  const anchorRef = useRef(null)

  return (
    <>
      <span
        ref={anchorRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        style={{ display: 'inline-block' }}
      >
        {children}
      </span>
      <HoverCardPanel
        anchorRef={anchorRef}
        visible={visible}
        onMouseEnter={cancelHide}
        onMouseLeave={hide}
        cardHeight={cardHeight}
      >
        {content}
      </HoverCardPanel>
    </>
  )
}

// ── Example usage ─────────────────────────────────────────────────────────────

const user = {
  name: 'Emma Chen', handle: '@emmadesigns', role: 'Product Designer · Vercel',
  bio: 'Crafting delightful interfaces one pixel at a time.',
  initials: 'EC', color: '#8B5CF6', followers: 4800, following: 312,
}

function ProfileCard() {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: 16,
      border: '1px solid rgba(0,0,0,0.08)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.03), 0 16px 40px rgba(0,0,0,0.12)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, background: user.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff',
        }}>{user.initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>{user.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', fontWeight: 500, marginTop: 1 }}>{user.handle}</div>
        </div>
        <button style={{
          padding: '5px 12px', background: '#0a0a0a', border: 'none',
          borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#fff',
          cursor: 'pointer', flexShrink: 0,
        }}>Follow</button>
      </div>
      <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', fontWeight: 500, marginBottom: 4 }}>{user.role}</div>
      <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.72)', lineHeight: 1.55, marginBottom: 14 }}>{user.bio}</div>
      <div style={{ display: 'flex', paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a' }}>4.8k</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>Followers</div>
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a' }}>312</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>Following</div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div style={{ padding: 40, fontFamily: font, fontSize: 14, color: '#0a0a0a', lineHeight: 1.6 }}>
      <p>
        Design work by{' '}
        <HoverCard content={<ProfileCard />} cardHeight={196}>
          <span style={{ fontWeight: 600, cursor: 'pointer', borderBottom: '1px dotted rgba(0,0,0,0.3)' }}>
            Emma Chen
          </span>
        </HoverCard>
        {' '}— hover to see her profile.
      </p>
    </div>
  )
}`

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HoverCardPage() {
  return (
    <div style={{ background: '#fff' }}>
      <Demo />

      <div style={{ background: '#0a0a0a', padding: 'clamp(24px, 4vw, 48px)' as any, fontFamily: font }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>
                Hover Card
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                Drop into any React project — zero dependencies
              </div>
            </div>
            <CopyButton text={CODE_SOURCE} />
          </div>

          <div style={{ background: '#111', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontFamily: 'ui-monospace, monospace' }}>
                HoverCard.tsx
              </div>
            </div>
            <pre style={{
              margin: 0, padding: '20px', overflowX: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
              fontSize: 12.5, lineHeight: 1.65, color: '#e5e5e5',
              scrollbarWidth: 'thin' as any, scrollbarColor: 'rgba(255,255,255,0.1) transparent',
            }}>
              <code>{CODE_SOURCE}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
