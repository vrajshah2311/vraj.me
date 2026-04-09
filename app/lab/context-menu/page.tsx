'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MenuSeparator {
  type: 'separator'
}

interface MenuAction {
  type: 'item'
  label: string
  shortcut?: string
  icon?: string
  danger?: boolean
  disabled?: boolean
}

type MenuItem = MenuSeparator | MenuAction

// ─── Data ─────────────────────────────────────────────────────────────────────

const MENU_ITEMS: MenuItem[] = [
  { type: 'item', label: 'Copy',             shortcut: '⌘C', icon: '⎘' },
  { type: 'item', label: 'Cut',              shortcut: '⌘X', icon: '✂' },
  { type: 'item', label: 'Paste',            shortcut: '⌘V', icon: '⎘', disabled: true },
  { type: 'separator' },
  { type: 'item', label: 'Rename',           shortcut: 'F2',  icon: '✏' },
  { type: 'item', label: 'Duplicate',        shortcut: '⌘D', icon: '+' },
  { type: 'separator' },
  { type: 'item', label: 'Share',            shortcut: '⌘⇧S', icon: '↑' },
  { type: 'item', label: 'Download',                           icon: '↓' },
  { type: 'separator' },
  { type: 'item', label: 'Move to Trash',   shortcut: '⌘⌫', icon: '⊗', danger: true },
]

// ─── ContextMenu ──────────────────────────────────────────────────────────────

function ContextMenu() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [visible, setVisible] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const menuRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const close = useCallback(() => {
    setVisible(false)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      setPos(null)
      setActiveIdx(-1)
    }, 200)
  }, [])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (hideTimer.current) clearTimeout(hideTimer.current)

    // Clamp to viewport
    const MENU_W = 224
    const MENU_H = 288
    const x = Math.min(e.clientX, window.innerWidth  - MENU_W - 8)
    const y = Math.min(e.clientY, window.innerHeight - MENU_H - 8)

    setPos({ x, y })
    setVisible(false)
    setActiveIdx(-1)

    // Two rAFs to let the element mount before animating in
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
  }, [])

  // Close on outside click / scroll / Escape
  useEffect(() => {
    if (!pos) return
    const down = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) close()
    }
    const scroll = () => close()
    window.addEventListener('mousedown', down)
    window.addEventListener('scroll', scroll, { passive: true, capture: true })
    return () => {
      window.removeEventListener('mousedown', down)
      window.removeEventListener('scroll', scroll, true)
    }
  }, [pos, close])

  // Keyboard navigation
  useEffect(() => {
    if (!pos) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const dir = e.key === 'ArrowDown' ? 1 : -1
        setActiveIdx(prev => {
          let next = prev + dir
          while (
            next >= 0 &&
            next < MENU_ITEMS.length &&
            (MENU_ITEMS[next].type === 'separator' || (MENU_ITEMS[next] as MenuAction).disabled)
          ) {
            next += dir
          }
          if (next < 0 || next >= MENU_ITEMS.length) return prev
          return next
        })
      }

      if (e.key === 'Enter' && activeIdx >= 0) {
        const item = MENU_ITEMS[activeIdx]
        if (item.type === 'item' && !item.disabled) close()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pos, activeIdx, close])

  return (
    <div
      onContextMenu={handleContextMenu}
      style={{
        width: '100%',
        maxWidth: '480px',
        height: '340px',
        borderRadius: '16px',
        border: '1.5px dashed rgba(10,10,10,0.14)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'context-menu',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      {/* Ghost file cards */}
      {['Project brief.pdf', 'Design tokens.json', 'Prototype v3.fig'].map((name, i) => (
        <div
          key={name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '10px',
            background: '#fff',
            border: '1px solid rgba(10,10,10,0.08)',
            width: '260px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            opacity: 0.9,
          }}
        >
          <div style={{
            width: '30px',
            height: '36px',
            borderRadius: '5px',
            background: ['#eff6ff', '#f0fdf4', '#fdf4ff'][i],
            border: `1px solid ${['rgba(37,99,235,0.15)', 'rgba(22,163,74,0.15)', 'rgba(168,85,247,0.15)'][i]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 700,
            color: ['#2563eb', '#16a34a', '#9333ea'][i],
            flexShrink: 0,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          }}>
            {['PDF', 'JSON', 'FIG'][i]}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
              {name}
            </p>
            <p style={{ margin: '1px 0 0', fontSize: '11px', color: 'rgba(10,10,10,0.4)', fontWeight: 500, letterSpacing: '-0.01em', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
              {['2.4 MB', '18 KB', '4.1 MB'][i]}
            </p>
          </div>
        </div>
      ))}

      <p style={{
        position: 'absolute',
        bottom: '16px',
        margin: 0,
        fontSize: '11.5px',
        color: 'rgba(10,10,10,0.35)',
        fontWeight: 500,
        letterSpacing: '-0.01em',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}>
        Right-click anywhere
      </p>

      {/* Menu — rendered fixed so it escapes the container */}
      {pos && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: pos.y,
            left: pos.x,
            zIndex: 9999,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(10,10,10,0.10)',
            borderRadius: '12px',
            padding: '4px',
            minWidth: '224px',
            boxShadow: '0 0 0 0.5px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.14)',
            transformOrigin: 'top left',
            transform: visible ? 'scale(1) translateY(0px)' : 'scale(0.93) translateY(-6px)',
            opacity: visible ? 1 : 0,
            transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 160ms ease',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          }}
        >
          {MENU_ITEMS.map((item, idx) => {
            if (item.type === 'separator') {
              return (
                <div
                  key={idx}
                  style={{
                    height: '1px',
                    background: 'rgba(10,10,10,0.07)',
                    margin: '3px 6px',
                  }}
                />
              )
            }

            const isActive = activeIdx === idx
            return (
              <button
                key={idx}
                onMouseEnter={() => !item.disabled && setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(-1)}
                onClick={() => { if (!item.disabled) close() }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive && !item.disabled ? 'rgba(10,10,10,0.06)' : 'transparent',
                  cursor: item.disabled ? 'default' : 'pointer',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  color: item.danger
                    ? item.disabled ? 'rgba(220,38,38,0.35)' : '#dc2626'
                    : item.disabled
                      ? 'rgba(10,10,10,0.25)'
                      : '#0a0a0a',
                  transition: 'background 80ms ease',
                  outline: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                }}
              >
                <span style={{
                  width: '16px',
                  textAlign: 'center',
                  fontSize: '12px',
                  flexShrink: 0,
                  opacity: item.disabled ? 0.4 : item.danger ? 1 : 0.65,
                }}>
                  {item.icon}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.shortcut && (
                  <span style={{
                    fontSize: '11.5px',
                    color: item.disabled ? 'rgba(10,10,10,0.18)' : 'rgba(10,10,10,0.35)',
                    fontWeight: 400,
                    letterSpacing: '0',
                    flexShrink: 0,
                  }}>
                    {item.shortcut}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface MenuSeparator { type: 'separator' }
interface MenuAction {
  type: 'item'
  label: string
  shortcut?: string
  icon?: string
  danger?: boolean
  disabled?: boolean
}
type MenuItem = MenuSeparator | MenuAction

const MENU_ITEMS: MenuItem[] = [
  { type: 'item', label: 'Copy',           shortcut: '⌘C', icon: '⎘' },
  { type: 'item', label: 'Cut',            shortcut: '⌘X', icon: '✂' },
  { type: 'item', label: 'Paste',          shortcut: '⌘V', icon: '⎘', disabled: true },
  { type: 'separator' },
  { type: 'item', label: 'Rename',         shortcut: 'F2',  icon: '✏' },
  { type: 'item', label: 'Duplicate',      shortcut: '⌘D', icon: '+' },
  { type: 'separator' },
  { type: 'item', label: 'Share',          shortcut: '⌘⇧S', icon: '↑' },
  { type: 'item', label: 'Download',                         icon: '↓' },
  { type: 'separator' },
  { type: 'item', label: 'Move to Trash', shortcut: '⌘⌫', icon: '⊗', danger: true },
]

export function ContextMenu() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [visible, setVisible] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const menuRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const close = useCallback(() => {
    setVisible(false)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => { setPos(null); setActiveIdx(-1) }, 200)
  }, [])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (hideTimer.current) clearTimeout(hideTimer.current)
    const MENU_W = 224, MENU_H = 288
    const x = Math.min(e.clientX, window.innerWidth  - MENU_W - 8)
    const y = Math.min(e.clientY, window.innerHeight - MENU_H - 8)
    setPos({ x, y })
    setVisible(false)
    setActiveIdx(-1)
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
  }, [])

  // Close on outside click / scroll
  useEffect(() => {
    if (!pos) return
    const down = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) close()
    }
    window.addEventListener('mousedown', down)
    window.addEventListener('scroll', close, { passive: true, capture: true })
    return () => {
      window.removeEventListener('mousedown', down)
      window.removeEventListener('scroll', close, true)
    }
  }, [pos, close])

  // Keyboard nav
  useEffect(() => {
    if (!pos) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const dir = e.key === 'ArrowDown' ? 1 : -1
        setActiveIdx(prev => {
          let next = prev + dir
          while (next >= 0 && next < MENU_ITEMS.length &&
            (MENU_ITEMS[next].type === 'separator' || (MENU_ITEMS[next] as MenuAction).disabled)
          ) next += dir
          return (next >= 0 && next < MENU_ITEMS.length) ? next : prev
        })
      }
      if (e.key === 'Enter' && activeIdx >= 0) {
        const item = MENU_ITEMS[activeIdx]
        if (item.type === 'item' && !item.disabled) close()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pos, activeIdx, close])

  return (
    <div onContextMenu={handleContextMenu} style={{ /* your trigger area */ }}>
      {/* your content */}

      {pos && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: pos.y,
            left: pos.x,
            zIndex: 9999,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(10,10,10,0.10)',
            borderRadius: '12px',
            padding: '4px',
            minWidth: '224px',
            boxShadow: '0 0 0 0.5px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.14)',
            transformOrigin: 'top left',
            transform: visible ? 'scale(1) translateY(0px)' : 'scale(0.93) translateY(-6px)',
            opacity: visible ? 1 : 0,
            transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 160ms ease',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          }}
        >
          {MENU_ITEMS.map((item, idx) => {
            if (item.type === 'separator') {
              return (
                <div key={idx} style={{ height: '1px', background: 'rgba(10,10,10,0.07)', margin: '3px 6px' }} />
              )
            }
            const isActive = activeIdx === idx
            return (
              <button
                key={idx}
                onMouseEnter={() => !item.disabled && setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(-1)}
                onClick={() => { if (!item.disabled) close() }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive && !item.disabled ? 'rgba(10,10,10,0.06)' : 'transparent',
                  cursor: item.disabled ? 'default' : 'pointer',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  color: item.danger
                    ? (item.disabled ? 'rgba(220,38,38,0.35)' : '#dc2626')
                    : (item.disabled ? 'rgba(10,10,10,0.25)' : '#0a0a0a'),
                  transition: 'background 80ms ease',
                  outline: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                }}
              >
                <span style={{ width: '16px', textAlign: 'center', fontSize: '12px', flexShrink: 0, opacity: item.disabled ? 0.4 : item.danger ? 1 : 0.65 }}>
                  {item.icon}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.shortcut && (
                  <span style={{ fontSize: '11.5px', color: item.disabled ? 'rgba(10,10,10,0.18)' : 'rgba(10,10,10,0.35)', fontWeight: 400, flexShrink: 0 }}>
                    {item.shortcut}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContextMenuPage() {
  return (
    <main style={{
      backgroundColor: 'var(--bg, #ffffff)',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>

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
        <ContextMenu />
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
