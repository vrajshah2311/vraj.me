'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Placement = 'top' | 'bottom' | 'left' | 'right'

// ─── Helpers (outside component to avoid recreation) ─────────────────────────

const ENTER: Record<Placement, string> = {
  top:    'translateY(4px) scale(0.94)',
  bottom: 'translateY(-4px) scale(0.94)',
  left:   'translateX(4px) scale(0.94)',
  right:  'translateX(-4px) scale(0.94)',
}

function arrowStyle(p: Placement): React.CSSProperties {
  const base: React.CSSProperties = { position: 'absolute', width: 0, height: 0 }
  const trans = '4px solid transparent'
  const solid = '4px solid #1c1c1c'
  if (p === 'top')    return { ...base, bottom: -4, left: '50%', transform: 'translateX(-50%)', borderLeft: trans, borderRight: trans, borderTop: solid }
  if (p === 'bottom') return { ...base, top: -4,    left: '50%', transform: 'translateX(-50%)', borderLeft: trans, borderRight: trans, borderBottom: solid }
  if (p === 'left')   return { ...base, right: -4,  top: '50%',  transform: 'translateY(-50%)', borderTop: trans, borderBottom: trans, borderLeft: solid }
  return                     { ...base, left: -4,   top: '50%',  transform: 'translateY(-50%)', borderTop: trans, borderBottom: trans, borderRight: solid }
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function Tooltip({
  content,
  placement = 'top',
  delay = 350,
  children,
}: {
  content: React.ReactNode
  placement?: Placement
  delay?: number
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0, pl: 'top' as Placement })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const computePos = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return
    const tr = triggerRef.current.getBoundingClientRect()
    const tt = tooltipRef.current.getBoundingClientRect()
    const GAP = 8
    const tries: Placement[] = [placement, 'top', 'bottom', 'right', 'left']
    for (const p of tries) {
      let x = 0, y = 0
      if (p === 'top') {
        x = tr.left + tr.width / 2 - tt.width / 2
        y = tr.top - tt.height - GAP
        if (y < 4) continue
      } else if (p === 'bottom') {
        x = tr.left + tr.width / 2 - tt.width / 2
        y = tr.bottom + GAP
        if (y + tt.height > window.innerHeight - 4) continue
      } else if (p === 'left') {
        x = tr.left - tt.width - GAP
        y = tr.top + tr.height / 2 - tt.height / 2
        if (x < 4) continue
      } else {
        x = tr.right + GAP
        y = tr.top + tr.height / 2 - tt.height / 2
        if (x + tt.width > window.innerWidth - 4) continue
      }
      x = Math.max(4, Math.min(window.innerWidth - tt.width - 4, x))
      y = Math.max(4, Math.min(window.innerHeight - tt.height - 4, y))
      setPos({ x, y, pl: p })
      return
    }
  }, [placement])

  // After mounting, measure + position, then fade in
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
    showTimer.current = setTimeout(() => setMounted(true), delay)
  }, [delay])

  const hide = useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current)
    setVisible(false)
    hideTimer.current = setTimeout(() => setMounted(false), 200)
  }, [])

  useEffect(() => () => {
    if (showTimer.current) clearTimeout(showTimer.current)
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }, [])

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        style={{ display: 'inline-block' }}
      >
        {children}
      </span>

      {mounted && (
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            position: 'fixed',
            top: pos.y,
            left: pos.x,
            zIndex: 9999,
            pointerEvents: 'none',
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : ENTER[pos.pl],
            transition: 'opacity 160ms ease, transform 180ms cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <div
            style={{
              position: 'relative',
              background: '#1c1c1c',
              color: 'rgba(255,255,255,0.88)',
              borderRadius: '7px',
              padding: '5px 10px',
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: '1.45',
              maxWidth: '280px',
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              boxShadow: '0 4px 14px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.12)',
            }}
          >
            {content}
            <div style={arrowStyle(pos.pl)} />
          </div>
        </div>
      )}
    </>
  )
}

// ─── Demo 1: Placement showcase ───────────────────────────────────────────────

function PlacementDemo() {
  const btnStyle: React.CSSProperties = {
    padding: '8px 18px',
    borderRadius: '8px',
    border: '1px solid rgba(10,10,10,0.08)',
    background: '#fff',
    color: '#0a0a0a',
    fontSize: '13px',
    fontWeight: 500,
    letterSpacing: '-0.01em',
    cursor: 'default',
    userSelect: 'none',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '16px',
        padding: '28px 40px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)' }}>
        Placement
      </p>

      <Tooltip content="Appears above the trigger" placement="top" delay={200}>
        <button style={btnStyle}>Top</button>
      </Tooltip>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Tooltip content="Appears to the left" placement="left" delay={200}>
          <button style={btnStyle}>Left</button>
        </Tooltip>

        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: 'rgba(10,10,10,0.04)', border: '1px solid rgba(10,10,10,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(10,10,10,0.18)' }} />
        </div>

        <Tooltip content="Appears to the right" placement="right" delay={200}>
          <button style={btnStyle}>Right</button>
        </Tooltip>
      </div>

      <Tooltip content="Appears below the trigger" placement="bottom" delay={200}>
        <button style={btnStyle}>Bottom</button>
      </Tooltip>
    </div>
  )
}

// ─── Demo 2: Keyboard shortcuts grid ─────────────────────────────────────────

const SHORTCUTS = [
  { key: '⌘K',  action: 'Open command palette', category: 'Navigation' },
  { key: '⌘P',  action: 'Quick open file',       category: 'Navigation' },
  { key: '⌘/',  action: 'Toggle comment',         category: 'Editing'   },
  { key: '⌘B',  action: 'Toggle sidebar',         category: 'View'      },
  { key: '⌘Z',  action: 'Undo last action',       category: 'Editing'   },
  { key: '⌘⇧Z', action: 'Redo last action',       category: 'Editing'   },
  { key: '⌘D',  action: 'Duplicate selection',    category: 'Editing'   },
  { key: '⌘L',  action: 'Select entire line',     category: 'Editing'   },
  { key: '⌘F',  action: 'Find in file',           category: 'Search'    },
  { key: '⌘H',  action: 'Find and replace',       category: 'Search'    },
  { key: '⌘⇧P', action: 'Show all commands',      category: 'Navigation'},
  { key: 'Esc', action: 'Close focused panel',    category: 'Navigation'},
]

const CAT_COLOR: Record<string, string> = {
  Navigation: '#3b82f6',
  Editing:    '#8b5cf6',
  View:       '#0ea5e9',
  Search:     '#f59e0b',
}

function ShortcutGrid() {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
        width: '380px',
        maxWidth: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <p style={{ margin: '0 0 14px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)' }}>
        Keyboard Shortcuts
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {SHORTCUTS.map(s => (
          <Tooltip
            key={s.key}
            placement="top"
            delay={150}
            content={
              <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <span style={{
                  color: CAT_COLOR[s.category] ?? 'rgba(255,255,255,0.5)',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  {s.category}
                </span>
                <span>{s.action}</span>
              </span>
            }
          >
            <kbd style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px 10px',
              borderRadius: '7px',
              background: 'rgba(10,10,10,0.04)',
              border: '1px solid rgba(10,10,10,0.08)',
              borderBottom: '2px solid rgba(10,10,10,0.13)',
              fontSize: '12px',
              fontWeight: 600,
              color: '#0a0a0a',
              letterSpacing: '-0.01em',
              cursor: 'default',
              userSelect: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              minWidth: '36px',
              whiteSpace: 'nowrap',
            }}>
              {s.key}
            </kbd>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

type Placement = 'top' | 'bottom' | 'left' | 'right'

const ENTER: Record<Placement, string> = {
  top:    'translateY(4px) scale(0.94)',
  bottom: 'translateY(-4px) scale(0.94)',
  left:   'translateX(4px) scale(0.94)',
  right:  'translateX(-4px) scale(0.94)',
}

function arrowStyle(p: Placement): React.CSSProperties {
  const base: React.CSSProperties = { position: 'absolute', width: 0, height: 0 }
  const trans = '4px solid transparent'
  const solid = '4px solid #1c1c1c'
  if (p === 'top')    return { ...base, bottom: -4, left: '50%', transform: 'translateX(-50%)', borderLeft: trans, borderRight: trans, borderTop: solid }
  if (p === 'bottom') return { ...base, top: -4,    left: '50%', transform: 'translateX(-50%)', borderLeft: trans, borderRight: trans, borderBottom: solid }
  if (p === 'left')   return { ...base, right: -4,  top: '50%',  transform: 'translateY(-50%)', borderTop: trans, borderBottom: trans, borderLeft: solid }
  return                     { ...base, left: -4,   top: '50%',  transform: 'translateY(-50%)', borderTop: trans, borderBottom: trans, borderRight: solid }
}

export function Tooltip({
  content,
  placement = 'top',
  delay = 350,
  children,
}: {
  content: React.ReactNode
  placement?: Placement
  delay?: number
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0, pl: 'top' as Placement })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const computePos = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return
    const tr = triggerRef.current.getBoundingClientRect()
    const tt = tooltipRef.current.getBoundingClientRect()
    const GAP = 8
    const tries: Placement[] = [placement, 'top', 'bottom', 'right', 'left']
    for (const p of tries) {
      let x = 0, y = 0
      if (p === 'top') {
        x = tr.left + tr.width / 2 - tt.width / 2
        y = tr.top - tt.height - GAP
        if (y < 4) continue
      } else if (p === 'bottom') {
        x = tr.left + tr.width / 2 - tt.width / 2
        y = tr.bottom + GAP
        if (y + tt.height > window.innerHeight - 4) continue
      } else if (p === 'left') {
        x = tr.left - tt.width - GAP
        y = tr.top + tr.height / 2 - tt.height / 2
        if (x < 4) continue
      } else {
        x = tr.right + GAP
        y = tr.top + tr.height / 2 - tt.height / 2
        if (x + tt.width > window.innerWidth - 4) continue
      }
      x = Math.max(4, Math.min(window.innerWidth - tt.width - 4, x))
      y = Math.max(4, Math.min(window.innerHeight - tt.height - 4, y))
      setPos({ x, y, pl: p })
      return
    }
  }, [placement])

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
    showTimer.current = setTimeout(() => setMounted(true), delay)
  }, [delay])

  const hide = useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current)
    setVisible(false)
    hideTimer.current = setTimeout(() => setMounted(false), 200)
  }, [])

  useEffect(() => () => {
    if (showTimer.current) clearTimeout(showTimer.current)
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }, [])

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        style={{ display: 'inline-block' }}
      >
        {children}
      </span>

      {mounted && (
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            position: 'fixed',
            top: pos.y,
            left: pos.x,
            zIndex: 9999,
            pointerEvents: 'none',
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : ENTER[pos.pl],
            transition: 'opacity 160ms ease, transform 180ms cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <div
            style={{
              position: 'relative',
              background: '#1c1c1c',
              color: 'rgba(255,255,255,0.88)',
              borderRadius: '7px',
              padding: '5px 10px',
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: '1.45',
              maxWidth: '280px',
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              boxShadow: '0 4px 14px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.12)',
            }}
          >
            {content}
            <div style={arrowStyle(pos.pl)} />
          </div>
        </div>
      )}
    </>
  )
}

// ─── Usage example ─────────────────────────────────────────────────────────────

export default function Example() {
  return (
    <div style={{ display: 'flex', gap: '12px', padding: '60px', justifyContent: 'center', flexWrap: 'wrap' }}>
      <Tooltip content="Appears above" placement="top">
        <button>Top</button>
      </Tooltip>
      <Tooltip content="Appears to the right" placement="right">
        <button>Right</button>
      </Tooltip>
      <Tooltip content="Appears below" placement="bottom">
        <button>Bottom</button>
      </Tooltip>
      <Tooltip content="Appears to the left" placement="left">
        <button>Left</button>
      </Tooltip>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TooltipPage() {
  return (
    <main
      style={{
        backgroundColor: 'var(--bg, #ffffff)',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* ── Demo ── */}
      <section
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
          padding: '60px 24px',
          gap: '32px',
        }}
      >
        <PlacementDemo />
        <ShortcutGrid />
      </section>

      {/* ── Code block ── */}
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
