'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notification {
  id: number
  title: string
  body: string
  time: string
  read: boolean
  icon: string
  color: string
}

// ─── Bell Icon ────────────────────────────────────────────────────────────────

function BellIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 2a6 6 0 0 0-6 6v1.586l-1.707 1.707A1 1 0 0 0 3 13h14a1 1 0 0 0 .707-1.707L16 9.586V8a6 6 0 0 0-6-6Z"
        fill="currentColor"
      />
      <path
        d="M8 14a2 2 0 1 0 4 0H8Z"
        fill="currentColor"
      />
    </svg>
  )
}

// ─── NotificationBell ─────────────────────────────────────────────────────────

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, title: 'Alex Harper merged your PR', body: 'Virtualized list component has been merged into main.', time: '2m ago', read: false, icon: 'AH', color: '#6366f1' },
  { id: 2, title: 'Deploy succeeded', body: 'Production deploy v2.4.1 finished in 43s.', time: '18m ago', read: false, icon: '✓', color: '#16a34a' },
  { id: 3, title: 'Maria left a review', body: 'Left 3 comments on your design system PR.', time: '1h ago', read: false, icon: 'MR', color: '#0ea5e9' },
  { id: 4, title: 'Storage at 90%', body: 'You are approaching your plan limit.', time: '3h ago', read: true, icon: '!', color: '#d97706' },
  { id: 5, title: 'Jordan Smith mentioned you', body: 'Tagged you in the Q3 planning document.', time: '5h ago', read: true, icon: 'JS', color: '#10b981' },
]

function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Notification[]>(INITIAL_NOTIFICATIONS)
  const [shake, setShake] = useState(false)
  const [dropdownMounted, setDropdownMounted] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(6)

  const unread = items.filter(n => !n.read).length

  // Open/close with animation
  useEffect(() => {
    if (open) {
      setDropdownMounted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setDropdownVisible(true))
      })
    } else {
      setDropdownVisible(false)
      const t = setTimeout(() => setDropdownMounted(false), 220)
      return () => clearTimeout(t)
    }
  }, [open])

  // Click outside to close
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const triggerShake = useCallback(() => {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }, [])

  const addNotification = useCallback(() => {
    const SAMPLES = [
      { title: 'New comment on your post', body: 'Someone replied to your thread in #general.', icon: '💬', color: '#8b5cf6' },
      { title: 'CI pipeline failed', body: 'Build #312 failed on the auth-refactor branch.', icon: '✕', color: '#dc2626' },
      { title: 'Weekly report ready', body: 'Your analytics digest for this week is available.', icon: '📊', color: '#0ea5e9' },
      { title: 'Invite accepted', body: 'Kai Lin has joined your workspace.', icon: 'KL', color: '#f59e0b' },
    ]
    const sample = SAMPLES[nextId.current % SAMPLES.length]
    const newItem: Notification = {
      id: nextId.current++,
      title: sample.title,
      body: sample.body,
      time: 'just now',
      read: false,
      icon: sample.icon,
      color: sample.color,
    }
    setItems(prev => [newItem, ...prev].slice(0, 8))
    triggerShake()
  }, [triggerShake])

  const markRead = useCallback((id: number) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const markAllRead = useCallback(() => {
    setItems(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', fontFamily: FONT }}>
      {/* Trigger row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={addNotification}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(10,10,10,0.08)',
            background: '#fff',
            color: '#0a0a0a',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            cursor: 'pointer',
            fontFamily: FONT,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.05)')}
          onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
        >
          Add notification
        </button>

        {/* Bell button */}
        <div style={{ position: 'relative' }}>
          <style>{`
            @keyframes bell-shake {
              0%, 100% { transform: rotate(0deg); }
              10% { transform: rotate(-12deg); }
              30% { transform: rotate(12deg); }
              50% { transform: rotate(-8deg); }
              70% { transform: rotate(8deg); }
              90% { transform: rotate(-4deg); }
            }
            .bell-shake { animation: bell-shake 0.6s cubic-bezier(0.36,0.07,0.19,0.97) both; }
          `}</style>
          <button
            ref={buttonRef}
            onClick={() => setOpen(v => !v)}
            style={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              border: '1px solid rgba(10,10,10,0.08)',
              background: open ? 'rgba(10,10,10,0.05)' : '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0a0a0a',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              transition: 'background 150ms ease',
              position: 'relative',
            }}
            onMouseEnter={e => { if (!open) e.currentTarget.style.background = 'rgba(10,10,10,0.05)' }}
            onMouseLeave={e => { if (!open) e.currentTarget.style.background = '#fff' }}
          >
            <span className={shake ? 'bell-shake' : ''} style={{ display: 'flex', transformOrigin: 'top center' }}>
              <BellIcon size={18} />
            </span>
            {unread > 0 && (
              <span style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: unread > 9 ? 18 : 14,
                height: 14,
                borderRadius: '999px',
                background: '#dc2626',
                border: '2px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1,
                fontFamily: FONT,
                transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1)',
              }}>
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {dropdownMounted && (
            <div
              ref={dropdownRef}
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 320,
                background: '#fff',
                border: '1px solid rgba(10,10,10,0.08)',
                borderRadius: '14px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.10)',
                overflow: 'hidden',
                zIndex: 9999,
                opacity: dropdownVisible ? 1 : 0,
                transform: dropdownVisible ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.97)',
                transition: 'opacity 200ms cubic-bezier(0.4,0,0.2,1), transform 200ms cubic-bezier(0.4,0,0.2,1)',
                transformOrigin: 'top right',
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderBottom: '1px solid rgba(10,10,10,0.06)',
              }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                    Notifications
                  </span>
                  {unread > 0 && (
                    <span style={{
                      marginLeft: 6,
                      padding: '1px 6px',
                      background: 'rgba(220,38,38,0.08)',
                      border: '1px solid rgba(220,38,38,0.15)',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#dc2626',
                    }}>
                      {unread} new
                    </span>
                  )}
                </div>
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: 'rgba(10,10,10,0.4)',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      fontFamily: FONT,
                      transition: 'color 150ms ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#0a0a0a')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(10,10,10,0.4)')}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {items.length === 0 ? (
                  <div style={{ padding: '32px 16px', textAlign: 'center', color: 'rgba(10,10,10,0.35)', fontSize: '13px', fontWeight: 500 }}>
                    No notifications
                  </div>
                ) : (
                  items.map((item, i) => (
                    <NotificationRow
                      key={item.id}
                      item={item}
                      onRead={markRead}
                      isLast={i === items.length - 1}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <p style={{
        margin: 0,
        fontSize: '12px',
        color: 'rgba(0,0,0,0.35)',
        fontWeight: 500,
        letterSpacing: '-0.01em',
        fontFamily: FONT,
      }}>
        Add a notification · click bell to open · click item to mark read
      </p>
    </div>
  )
}

// ─── NotificationRow ──────────────────────────────────────────────────────────

function NotificationRow({
  item,
  onRead,
  isLast,
}: {
  item: Notification
  onRead: (id: number) => void
  isLast: boolean
}) {
  const isEmoji = item.icon.length > 2

  return (
    <div
      onClick={() => !item.read && onRead(item.id)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '10px 14px',
        borderBottom: isLast ? 'none' : '1px solid rgba(10,10,10,0.04)',
        background: item.read ? 'transparent' : 'rgba(99,102,241,0.03)',
        cursor: item.read ? 'default' : 'pointer',
        transition: 'background 150ms ease',
      }}
      onMouseEnter={e => { if (!item.read) e.currentTarget.style.background = 'rgba(10,10,10,0.03)' }}
      onMouseLeave={e => { e.currentTarget.style.background = item.read ? 'transparent' : 'rgba(99,102,241,0.03)' }}
    >
      {/* Icon */}
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: isEmoji ? 'rgba(10,10,10,0.04)' : item.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isEmoji ? '15px' : '10px',
        fontWeight: 700,
        color: isEmoji ? 'inherit' : '#fff',
        flexShrink: 0,
        fontFamily: FONT,
        letterSpacing: '0.01em',
      }}>
        {item.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontSize: '13px',
          fontWeight: item.read ? 500 : 600,
          color: item.read ? 'rgba(10,10,10,0.55)' : '#0a0a0a',
          letterSpacing: '-0.01em',
          lineHeight: '17px',
        }}>
          {item.title}
        </p>
        <p style={{
          margin: '2px 0 0',
          fontSize: '12px',
          color: 'rgba(10,10,10,0.4)',
          letterSpacing: '-0.01em',
          lineHeight: '16px',
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {item.body}
        </p>
      </div>

      {/* Right: time + unread dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
        <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.3)', fontWeight: 500, whiteSpace: 'nowrap' }}>
          {item.time}
        </span>
        {!item.read && (
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#6366f1',
            flexShrink: 0,
          }} />
        )}
      </div>
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Notification {
  id: number
  title: string
  body: string
  time: string
  read: boolean
  icon: string
  color: string
}

function BellIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2a6 6 0 0 0-6 6v1.586l-1.707 1.707A1 1 0 0 0 3 13h14a1 1 0 0 0 .707-1.707L16 9.586V8a6 6 0 0 0-6-6Z" fill="currentColor" />
      <path d="M8 14a2 2 0 1 0 4 0H8Z" fill="currentColor" />
    </svg>
  )
}

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

function NotificationRow({ item, onRead, isLast }: { item: Notification; onRead: (id: number) => void; isLast: boolean }) {
  const isEmoji = item.icon.length > 2
  return (
    <div
      onClick={() => !item.read && onRead(item.id)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        padding: '10px 14px',
        borderBottom: isLast ? 'none' : '1px solid rgba(10,10,10,0.04)',
        background: item.read ? 'transparent' : 'rgba(99,102,241,0.03)',
        cursor: item.read ? 'default' : 'pointer',
        transition: 'background 150ms ease',
      }}
      onMouseEnter={e => { if (!item.read) e.currentTarget.style.background = 'rgba(10,10,10,0.03)' }}
      onMouseLeave={e => { e.currentTarget.style.background = item.read ? 'transparent' : 'rgba(99,102,241,0.03)' }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: isEmoji ? 'rgba(10,10,10,0.04)' : item.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isEmoji ? '15px' : '10px', fontWeight: 700,
        color: isEmoji ? 'inherit' : '#fff', flexShrink: 0, fontFamily: FONT,
      }}>
        {item.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: item.read ? 500 : 600, color: item.read ? 'rgba(10,10,10,0.55)' : '#0a0a0a', letterSpacing: '-0.01em', lineHeight: '17px' }}>
          {item.title}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em', lineHeight: '16px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.body}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
        <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.3)', fontWeight: 500, whiteSpace: 'nowrap' }}>{item.time}</span>
        {!item.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1' }} />}
      </div>
    </div>
  )
}

export function NotificationBell({ notifications: initial }: { notifications: Notification[] }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Notification[]>(initial)
  const [shake, setShake] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unread = items.filter(n => !n.read).length

  useEffect(() => {
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), 220)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (buttonRef.current?.contains(e.target as Node)) return
      if (dropdownRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const markRead = useCallback((id: number) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const markAllRead = useCallback(() => {
    setItems(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  // Call this when a new notification arrives:
  // setItems(prev => [newNotification, ...prev])
  // setShake(true); setTimeout(() => setShake(false), 600)

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <style>{\`
        @keyframes bell-shake {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(-12deg); }
          30% { transform: rotate(12deg); }
          50% { transform: rotate(-8deg); }
          70% { transform: rotate(8deg); }
          90% { transform: rotate(-4deg); }
        }
        .bell-shake { animation: bell-shake 0.6s cubic-bezier(0.36,0.07,0.19,0.97) both; }
      \`}</style>

      <button
        ref={buttonRef}
        onClick={() => setOpen(v => !v)}
        style={{
          width: 40, height: 40, borderRadius: '10px',
          border: '1px solid rgba(10,10,10,0.08)',
          background: open ? 'rgba(10,10,10,0.05)' : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#0a0a0a',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          transition: 'background 150ms ease', position: 'relative',
        }}
      >
        <span className={shake ? 'bell-shake' : ''} style={{ display: 'flex', transformOrigin: 'top center' }}>
          <BellIcon size={18} />
        </span>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: unread > 9 ? 18 : 14, height: 14,
            borderRadius: '999px', background: '#dc2626', border: '2px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '9px', fontWeight: 700, color: '#fff', lineHeight: 1,
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {mounted && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            width: 320, background: '#fff',
            border: '1px solid rgba(10,10,10,0.08)', borderRadius: '14px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.10)',
            overflow: 'hidden', zIndex: 9999,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.97)',
            transition: 'opacity 200ms cubic-bezier(0.4,0,0.2,1), transform 200ms cubic-bezier(0.4,0,0.2,1)',
            transformOrigin: 'top right',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>Notifications</span>
              {unread > 0 && (
                <span style={{ marginLeft: 6, padding: '1px 6px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: '999px', fontSize: '11px', fontWeight: 600, color: '#dc2626' }}>
                  {unread} new
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.4)', padding: '2px 4px', borderRadius: '4px', fontFamily: FONT, transition: 'color 150ms ease' }}
              >
                Mark all read
              </button>
            )}
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {items.map((item, i) => (
              <NotificationRow key={item.id} item={item} onRead={markRead} isLast={i === items.length - 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationBellPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>

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
          margin: '0 0 8px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.3)',
        }}>
          Notification Bell
        </p>
        <NotificationBell />
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
