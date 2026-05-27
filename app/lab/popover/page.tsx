'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Popover ───────────────────────────────────────────────────────────────────

function Popover({
  trigger,
  content,
  align = 'center',
}: {
  trigger: React.ReactNode
  content: React.ReactNode
  align?: 'start' | 'center' | 'end'
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [side, setSide] = useState<'bottom' | 'top'>('bottom')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const close = useCallback(() => {
    setOpen(false)
    exitTimer.current = setTimeout(() => setMounted(false), 180)
  }, [])

  const handleOpen = useCallback(() => {
    if (exitTimer.current) clearTimeout(exitTimer.current)
    setMounted(true)
    // Two rAFs: first lets the DOM paint the closed state, second triggers the open transition
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (wrapperRef.current && contentRef.current) {
          const r = wrapperRef.current.getBoundingClientRect()
          const ch = contentRef.current.offsetHeight || 200
          setSide(window.innerHeight - r.bottom > ch + 16 ? 'bottom' : 'top')
        }
        setOpen(true)
      })
    )
  }, [])

  const toggle = useCallback(
    () => (open ? close() : handleOpen()),
    [open, close, handleOpen]
  )

  // Click outside to close
  useEffect(() => {
    if (!mounted) return
    const onDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [mounted, close])

  // Escape to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  const txBase = align === 'center' ? 'translateX(-50%) ' : ''
  const transformOpen = txBase + 'scale(1)'
  const transformClosed = txBase + 'scale(0.94)'
  const originX = align === 'start' ? 'left' : align === 'end' ? 'right' : 'center'
  const originY = side === 'bottom' ? 'top' : 'bottom'

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <div onClick={toggle} style={{ display: 'inline-flex' }}>{trigger}</div>

      {mounted && (
        <div
          ref={contentRef}
          style={{
            position: 'absolute',
            zIndex: 100,
            ...(align === 'start'
              ? { left: 0 }
              : align === 'end'
              ? { right: 0 }
              : { left: '50%' }),
            ...(side === 'bottom'
              ? { top: 'calc(100% + 8px)' }
              : { bottom: 'calc(100% + 8px)' }),
            transformOrigin: originY + ' ' + originX,
            transform: open ? transformOpen : transformClosed,
            opacity: open ? 1 : 0,
            transition:
              'transform 180ms cubic-bezier(0.34, 1.2, 0.64, 1), opacity 150ms ease',
            pointerEvents: open ? 'auto' : 'none',
            background: '#fff',
            border: '1px solid rgba(10,10,10,0.08)',
            borderRadius: '14px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}

// ─── Demo 1: Profile Card ──────────────────────────────────────────────────────

function ProfileCardContent() {
  const [following, setFollowing] = useState(false)
  return (
    <div style={{ width: 252, padding: '16px', fontFamily: FONT }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }} />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Alex Chen
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em', marginTop: '2px' }}>
            @alexchen · Product Designer
          </div>
        </div>
      </div>

      <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'rgba(10,10,10,0.6)', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
        Building things at the intersection of design and engineering. ✦
      </p>

      <div style={{ display: 'flex', borderTop: '1px solid rgba(10,10,10,0.06)', borderBottom: '1px solid rgba(10,10,10,0.06)', margin: '0 0 12px', padding: '10px 0' }}>
        {[{ label: 'Projects', value: '24' }, { label: 'Followers', value: '1.2k' }, { label: 'Following', value: '184' }].map((s, i) => (
          <div key={s.label} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(10,10,10,0.06)' : 'none' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: '10px', color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em', marginTop: '1px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          onClick={() => setFollowing(f => !f)}
          style={{
            flex: 1, padding: '7px 0', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: following ? '#0a0a0a' : 'rgba(10,10,10,0.06)',
            color: following ? '#fff' : '#0a0a0a',
            fontSize: '12px', fontWeight: 600, letterSpacing: '-0.01em', fontFamily: FONT,
            transition: 'all 150ms ease',
          }}
        >
          {following ? '✓ Following' : '+ Follow'}
        </button>
        <button style={{
          flex: 1, padding: '7px 0', borderRadius: '8px', cursor: 'pointer',
          border: '1px solid rgba(10,10,10,0.10)', background: '#fff',
          color: '#0a0a0a', fontSize: '12px', fontWeight: 600, letterSpacing: '-0.01em', fontFamily: FONT,
        }}>
          Message
        </button>
      </div>
    </div>
  )
}

// ─── Demo 2: Action Menu ───────────────────────────────────────────────────────

const MENU_ITEMS = [
  { icon: '✎', label: 'Edit', shortcut: '⌘E', danger: false },
  { icon: '⎘', label: 'Duplicate', shortcut: '⌘D', danger: false },
  { icon: '◱', label: 'Rename', shortcut: 'F2', danger: false },
  { icon: '⤢', label: 'Move to...', shortcut: '', danger: false },
  null,
  { icon: '🔗', label: 'Copy link', shortcut: '⌘L', danger: false },
  null,
  { icon: '⊗', label: 'Delete', shortcut: '⌫', danger: true },
] as const

function ActionMenuContent() {
  return (
    <div style={{ width: 204, padding: '6px', fontFamily: FONT }}>
      {MENU_ITEMS.map((item, i) =>
        item === null ? (
          <div key={i} style={{ height: '1px', background: 'rgba(10,10,10,0.06)', margin: '4px 2px' }} />
        ) : (
          <button
            key={item.label}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '7px 10px', borderRadius: '7px', border: 'none', background: 'none',
              color: item.danger ? '#dc2626' : '#0a0a0a',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              textAlign: 'left', letterSpacing: '-0.01em', fontFamily: FONT,
              transition: 'background 100ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = item.danger ? 'rgba(220,38,38,0.06)' : 'rgba(10,10,10,0.05)'
            }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ opacity: 0.45, fontSize: '13px', width: '16px', textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </span>
            {item.shortcut ? (
              <kbd style={{ fontSize: '10px', color: 'rgba(10,10,10,0.3)', fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>
                {item.shortcut}
              </kbd>
            ) : null}
          </button>
        )
      )}
    </div>
  )
}

// ─── Demo 3: Notifications ─────────────────────────────────────────────────────

const NOTIFS = [
  { id: 1, color: '#6366f1', initials: 'JK', name: 'Jay K', action: 'commented on', item: 'your design', time: '2m ago', unread: true },
  { id: 2, color: '#16a34a', initials: 'SR', name: 'Sara R', action: 'merged', item: 'PR #142', time: '18m ago', unread: true },
  { id: 3, color: '#d97706', initials: 'MO', name: 'Mike O', action: 'assigned you to', item: 'Bug #89', time: '1h ago', unread: false },
  { id: 4, color: '#0ea5e9', initials: 'LT', name: 'Lin T', action: 'liked', item: 'your post', time: '3h ago', unread: false },
]

function NotificationsContent() {
  const [items, setItems] = useState(NOTIFS)
  const unread = items.filter(n => n.unread).length
  return (
    <div style={{ width: 300, fontFamily: FONT }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>Notifications</span>
          {unread > 0 && (
            <span style={{ background: '#0a0a0a', color: '#fff', fontSize: '10px', fontWeight: 700, borderRadius: '10px', padding: '1px 6px' }}>
              {unread}
            </span>
          )}
        </div>
        <button
          onClick={() => setItems(prev => prev.map(n => ({ ...n, unread: false })))}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'rgba(10,10,10,0.4)', fontWeight: 600, fontFamily: FONT, letterSpacing: '-0.01em', padding: 0 }}
        >
          Mark all read
        </button>
      </div>
      <div style={{ padding: '6px' }}>
        {items.map(n => (
          <div
            key={n.id}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '9px 10px',
              borderRadius: '8px', cursor: 'pointer', transition: 'background 120ms ease',
              background: n.unread ? 'rgba(10,10,10,0.03)' : 'transparent',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,10,10,0.05)' }}
            onMouseLeave={e => { e.currentTarget.style.background = n.unread ? 'rgba(10,10,10,0.03)' : 'transparent' }}
          >
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: n.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700 }}>
              {n.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(10,10,10,0.7)', lineHeight: 1.5, letterSpacing: '-0.01em' }}>
                <span style={{ fontWeight: 600, color: '#0a0a0a' }}>{n.name}</span>
                {' '}{n.action}{' '}
                <span style={{ fontWeight: 600, color: '#0a0a0a' }}>{n.item}</span>
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(10,10,10,0.35)', letterSpacing: '-0.01em' }}>{n.time}</p>
            </div>
            {n.unread && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0a0a0a', flexShrink: 0, marginTop: '5px' }} />}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(10,10,10,0.06)', padding: '10px 16px 12px', textAlign: 'center' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'rgba(10,10,10,0.45)', fontWeight: 600, fontFamily: FONT, letterSpacing: '-0.01em' }}>
          View all notifications →
        </button>
      </div>
    </div>
  )
}

// ─── Demo 4: Quick Info ────────────────────────────────────────────────────────

function QuickInfoContent() {
  return (
    <div style={{ width: 240, padding: '14px 16px', fontFamily: FONT }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(10,10,10,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(10,10,10,0.5)' }}>i</span>
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>Auto-positioning</span>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'rgba(10,10,10,0.6)', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
        The popover measures available viewport space and automatically flips above the trigger when there isn't enough room below.
      </p>
      <div style={{ display: 'flex', gap: '6px' }}>
        {['bottom', 'top'].map(s => (
          <div key={s} style={{ flex: 1, padding: '7px 8px', background: 'rgba(10,10,10,0.04)', borderRadius: '7px', border: '1px solid rgba(10,10,10,0.06)' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', marginBottom: '1px' }}>{s}</div>
            <div style={{ fontSize: '10px', color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em' }}>
              {s === 'bottom' ? 'space below ≥ height' : 'flipped when needed'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Shared trigger button style ───────────────────────────────────────────────

function TriggerBtn({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '7px',
        padding: '7px 13px', borderRadius: '10px',
        border: '1px solid rgba(10,10,10,0.10)', cursor: 'pointer',
        background: hovered ? 'rgba(10,10,10,0.04)' : '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        fontFamily: FONT, fontSize: '13px', fontWeight: 500,
        color: '#0a0a0a', letterSpacing: '-0.01em',
        transition: 'background 120ms ease',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// ─── Code source ───────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export function Popover({
  trigger,
  content,
  align = 'center',
}: {
  trigger: React.ReactNode
  content: React.ReactNode
  align?: 'start' | 'center' | 'end'
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [side, setSide] = useState<'bottom' | 'top'>('bottom')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const close = useCallback(() => {
    setOpen(false)
    exitTimer.current = setTimeout(() => setMounted(false), 180)
  }, [])

  const handleOpen = useCallback(() => {
    if (exitTimer.current) clearTimeout(exitTimer.current)
    setMounted(true)
    // Two rAFs: first paints the closed state, second triggers the open transition
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (wrapperRef.current && contentRef.current) {
          const r = wrapperRef.current.getBoundingClientRect()
          const ch = contentRef.current.offsetHeight || 200
          setSide(window.innerHeight - r.bottom > ch + 16 ? 'bottom' : 'top')
        }
        setOpen(true)
      })
    )
  }, [])

  const toggle = useCallback(
    () => (open ? close() : handleOpen()),
    [open, close, handleOpen]
  )

  // Click outside
  useEffect(() => {
    if (!mounted) return
    const onDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [mounted, close])

  // Escape key
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  const txBase = align === 'center' ? 'translateX(-50%) ' : ''
  const transformOpen = txBase + 'scale(1)'
  const transformClosed = txBase + 'scale(0.94)'
  const originX = align === 'start' ? 'left' : align === 'end' ? 'right' : 'center'
  const originY = side === 'bottom' ? 'top' : 'bottom'

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <div onClick={toggle} style={{ display: 'inline-flex' }}>{trigger}</div>

      {mounted && (
        <div
          ref={contentRef}
          style={{
            position: 'absolute',
            zIndex: 100,
            ...(align === 'start'
              ? { left: 0 }
              : align === 'end'
              ? { right: 0 }
              : { left: '50%' }),
            ...(side === 'bottom'
              ? { top: 'calc(100% + 8px)' }
              : { bottom: 'calc(100% + 8px)' }),
            transformOrigin: originY + ' ' + originX,
            transform: open ? transformOpen : transformClosed,
            opacity: open ? 1 : 0,
            transition:
              'transform 180ms cubic-bezier(0.34, 1.2, 0.64, 1), opacity 150ms ease',
            pointerEvents: open ? 'auto' : 'none',
            background: '#fff',
            border: '1px solid rgba(10,10,10,0.08)',
            borderRadius: '14px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}

// ── Usage ──────────────────────────────────────────────────────────────────────
//
// <Popover
//   trigger={<button>Open</button>}
//   content={<div style={{ padding: '16px' }}>Anything here</div>}
// />
//
// Props
//   trigger  any ReactNode — the click target that opens/closes the popover
//   content  any ReactNode — rendered inside the floating panel
//   align    'start' | 'center' | 'end'  (default 'center')
//            start  → left edge of panel aligns to left edge of trigger
//            center → panel is centered below/above the trigger
//            end    → right edge of panel aligns to right edge of trigger
//
// Behaviour
//   • Auto-flips above the trigger when there isn't enough space below
//   • Closes on click outside or Escape key
//   • Smooth scale+fade enter/exit animation anchored to the trigger edge`

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PopoverPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '70vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '80px 24px',
        gap: '48px',
        overflow: 'visible',
      }}>
        <div style={{
          display: 'flex', gap: '32px 48px', flexWrap: 'wrap',
          justifyContent: 'center', alignItems: 'flex-start',
        }}>

          {/* Profile card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>
              Profile Card
            </p>
            <Popover
              trigger={
                <TriggerBtn>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', flexShrink: 0 }} />
                  Alex Chen
                  <span style={{ fontSize: '10px', color: 'rgba(10,10,10,0.35)' }}>▾</span>
                </TriggerBtn>
              }
              content={<ProfileCardContent />}
            />
          </div>

          {/* Action menu */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>
              Action Menu
            </p>
            <Popover
              trigger={
                <TriggerBtn style={{ padding: '7px 11px', gap: 0 }}>
                  <span style={{ letterSpacing: '2px', fontSize: '14px' }}>···</span>
                </TriggerBtn>
              }
              content={<ActionMenuContent />}
            />
          </div>

          {/* Notifications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>
              Notifications
            </p>
            <Popover
              trigger={
                <div style={{ position: 'relative', display: 'inline-flex' }}>
                  <TriggerBtn style={{ padding: '7px 11px' }}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.5 1.5C5.01 1.5 3 3.51 3 6v3.5L1.5 11h12L12 9.5V6c0-2.49-2.01-4.5-4.5-4.5Z" stroke="#0a0a0a" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
                      <path d="M6 11.5a1.5 1.5 0 003 0" stroke="#0a0a0a" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                    </svg>
                    Inbox
                    <span style={{ fontSize: '10px', color: 'rgba(10,10,10,0.35)' }}>▾</span>
                  </TriggerBtn>
                  <div style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: '#dc2626', border: '2px solid #E8EAF0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 700, color: '#fff' }}>
                    2
                  </div>
                </div>
              }
              content={<NotificationsContent />}
            />
          </div>

          {/* Quick info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>
              Quick Info
            </p>
            <Popover
              trigger={
                <TriggerBtn>
                  Auto-position
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(10,10,10,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(10,10,10,0.5)', lineHeight: 1 }}>i</span>
                  </div>
                </TriggerBtn>
              }
              content={<QuickInfoContent />}
            />
          </div>

        </div>

        <p style={{ margin: 0, fontSize: '12px', color: 'rgba(10,10,10,0.3)', fontWeight: 500, letterSpacing: '-0.01em', fontFamily: FONT }}>
          Click any trigger · click outside or press Esc to close
        </p>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)', marginBottom: '12px', fontFamily: FONT }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
          <pre style={{ margin: 0, fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace', fontSize: '12px', lineHeight: '1.65', color: '#e5e5e5', whiteSpace: 'pre', overflowX: 'auto' }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
