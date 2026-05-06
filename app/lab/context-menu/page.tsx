'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MenuItem {
  id: string
  label: string
  shortcut?: string
  danger?: boolean
  disabled?: boolean
  dividerAbove?: boolean
  children?: MenuItem[]
}

// ─── Menu items ───────────────────────────────────────────────────────────────

const ITEMS: MenuItem[] = [
  { id: 'open',      label: 'Open',            shortcut: '↵' },
  { id: 'new-tab',   label: 'Open in new tab', shortcut: '⌘↵' },
  { id: 'dup',       label: 'Duplicate',       shortcut: '⌘D', dividerAbove: true },
  { id: 'rename',    label: 'Rename',          shortcut: 'F2' },
  { id: 'move',      label: 'Move to…',        children: [
    { id: 'move-inbox',    label: 'Inbox' },
    { id: 'move-archive',  label: 'Archive' },
    { id: 'move-projects', label: 'Projects' },
    { id: 'move-trash',    label: 'Trash', danger: true },
  ]},
  { id: 'copy-link', label: 'Copy link',       shortcut: '⌘L', dividerAbove: true },
  { id: 'download',  label: 'Download',        disabled: true },
  { id: 'delete',    label: 'Delete',          shortcut: '⌫', danger: true, dividerAbove: true },
]

// ─── MenuRow ──────────────────────────────────────────────────────────────────

function MenuRow({
  item,
  isActive,
  onHover,
  onClick,
}: {
  item: MenuItem
  isActive: boolean
  onHover: (item: MenuItem, el: HTMLElement) => void
  onClick: (item: MenuItem) => void
}) {
  const [hovered, setHovered] = useState(false)
  const highlighted = isActive || hovered

  const bgColor = highlighted
    ? item.danger ? 'rgba(220,38,38,0.06)' : 'rgba(10,10,10,0.05)'
    : 'transparent'

  const textColor = item.disabled
    ? 'rgba(10,10,10,0.28)'
    : item.danger
    ? '#dc2626'
    : '#0a0a0a'

  return (
    <>
      {item.dividerAbove && (
        <div style={{ height: '1px', background: 'rgba(10,10,10,0.07)', margin: '4px 0' }} />
      )}
      <div
        onMouseEnter={e => { setHovered(true); onHover(item, e.currentTarget) }}
        onMouseLeave={() => setHovered(false)}
        onClick={() => !item.disabled && !item.children && onClick(item)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 10px',
          borderRadius: '8px',
          background: bgColor,
          cursor: item.disabled ? 'not-allowed' : 'default',
          userSelect: 'none' as const,
          transition: 'background 100ms ease',
          gap: '24px',
        }}
      >
        <span style={{
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          color: textColor,
          lineHeight: '18px',
          fontFamily: FONT,
        }}>
          {item.label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {item.shortcut && (
            <span style={{
              fontSize: '11px',
              fontWeight: 500,
              color: item.disabled ? 'rgba(10,10,10,0.18)' : 'rgba(10,10,10,0.28)',
              letterSpacing: '0',
              fontFamily: FONT,
            }}>
              {item.shortcut}
            </span>
          )}
          {item.children && (
            <span style={{ fontSize: '13px', color: 'rgba(10,10,10,0.3)', lineHeight: '1' }}>›</span>
          )}
        </div>
      </div>
    </>
  )
}

// ─── ContextMenu ──────────────────────────────────────────────────────────────

function ContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number
  y: number
  items: MenuItem[]
  onClose: (action?: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [pos, setPos] = useState({ x, y })
  const [activeId, setActiveId] = useState<string | null>(null)
  const [submenuPos, setSubmenuPos] = useState({ x: 0, y: 0 })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Animate in
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Adjust to stay in viewport
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    let nx = x
    let ny = y
    if (nx + rect.width > window.innerWidth - 8) nx = window.innerWidth - rect.width - 8
    if (ny + rect.height > window.innerHeight - 8) ny = window.innerHeight - rect.height - 8
    if (nx < 8) nx = 8
    if (ny < 8) ny = 8
    setPos({ x: nx, y: ny })
  }, [x, y])

  // Close on outside click / Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const close = useCallback((action?: string) => {
    setMounted(false)
    setTimeout(() => onClose(action), 150)
  }, [onClose])

  const handleHover = useCallback((item: MenuItem, el: HTMLElement) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (item.children) {
      timerRef.current = setTimeout(() => {
        const rect = el.getBoundingClientRect()
        const subW = 172
        const rx = rect.right + 4
        setSubmenuPos({
          x: rx + subW > window.innerWidth ? rect.left - subW - 4 : rx,
          y: rect.top,
        })
        setActiveId(item.id)
      }, 120)
    } else {
      timerRef.current = setTimeout(() => setActiveId(null), 80)
    }
  }, [])

  const activeItem = items.find(i => i.id === activeId)

  return (
    <>
      <div
        ref={ref}
        onMouseDown={e => e.stopPropagation()}
        style={{
          position: 'fixed',
          left: pos.x,
          top: pos.y,
          zIndex: 9999,
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.1)',
          borderRadius: '12px',
          padding: '4px',
          minWidth: '208px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.12)',
          fontFamily: FONT,
          transform: mounted ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-4px)',
          opacity: mounted ? 1 : 0,
          transformOrigin: 'top left',
          transition: 'transform 160ms cubic-bezier(0.32,0.72,0,1), opacity 130ms ease',
        }}
      >
        {items.map(item => (
          <MenuRow
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onHover={handleHover}
            onClick={item => close(item.label)}
          />
        ))}
      </div>

      {/* Submenu */}
      {activeId && activeItem?.children && (
        <div
          onMouseDown={e => e.stopPropagation()}
          onMouseEnter={() => { if (timerRef.current) clearTimeout(timerRef.current) }}
          onMouseLeave={() => {
            timerRef.current = setTimeout(() => setActiveId(null), 100)
          }}
          style={{
            position: 'fixed',
            left: submenuPos.x,
            top: submenuPos.y,
            zIndex: 10000,
            background: '#fff',
            border: '1px solid rgba(10,10,10,0.1)',
            borderRadius: '12px',
            padding: '4px',
            minWidth: '160px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.12)',
            fontFamily: FONT,
            animation: 'ctxIn 130ms cubic-bezier(0.32,0.72,0,1) forwards',
          }}
        >
          {activeItem.children.map(child => (
            <MenuRow
              key={child.id}
              item={child}
              isActive={false}
              onHover={() => {}}
              onClick={item => close(item.label)}
            />
          ))}
        </div>
      )}
    </>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

const FILES = [
  { name: 'Brand Guidelines.pdf', size: '2.4 MB', type: 'PDF' },
  { name: 'Logo Assets.zip',      size: '18 MB',  type: 'ZIP' },
  { name: 'UI Components.fig',    size: '6.1 MB', type: 'FIG' },
  { name: 'Product Roadmap.csv',  size: '48 KB',  type: 'CSV' },
]

function ContextMenuDemo() {
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [feedbackVisible, setFeedbackVisible] = useState(false)

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setMenuPos({ x: e.clientX, y: e.clientY })
  }, [])

  const handleClose = useCallback((action?: string) => {
    setMenuPos(null)
    if (action) {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
      setFeedback(action)
      setFeedbackVisible(false)
      requestAnimationFrame(() => requestAnimationFrame(() => setFeedbackVisible(true)))
      feedbackTimer.current = setTimeout(() => {
        setFeedbackVisible(false)
        setTimeout(() => setFeedback(null), 300)
      }, 2000)
    }
  }, [])

  return (
    <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
      {/* Right-click target */}
      <div
        onContextMenu={handleContextMenu}
        style={{
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: '14px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
          cursor: 'context-menu',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '12px 14px',
          borderBottom: '1px solid rgba(10,10,10,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT }}>
            Files
          </span>
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.35)', letterSpacing: '-0.01em', fontFamily: FONT }}>
            {FILES.length} items
          </span>
        </div>

        {/* File rows */}
        <div style={{ padding: '6px' }}>
          {FILES.map((file, i) => (
            <div key={file.name} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '8px',
              background: i === 1 ? 'rgba(10,10,10,0.04)' : 'transparent',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '28px', height: '28px',
                  borderRadius: '6px',
                  background: 'rgba(10,10,10,0.04)',
                  border: '1px solid rgba(10,10,10,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: '8px', fontWeight: 700, color: 'rgba(10,10,10,0.3)', letterSpacing: '0.02em' }}>
                    {file.type}
                  </span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT }}>
                  {file.name}
                </span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.35)', flexShrink: 0, fontFamily: FONT }}>
                {file.size}
              </span>
            </div>
          ))}
        </div>

        {/* Hint */}
        <p style={{
          margin: 0,
          padding: '10px 16px 14px',
          textAlign: 'center',
          fontSize: '12px', fontWeight: 500,
          color: 'rgba(10,10,10,0.28)',
          letterSpacing: '-0.01em',
          fontFamily: FONT,
        }}>
          Right-click anywhere in this card
        </p>
      </div>

      {/* Feedback pill */}
      {feedback && (
        <div style={{
          position: 'absolute',
          bottom: -44,
          left: '50%',
          transform: feedbackVisible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(4px)',
          background: '#0a0a0a',
          color: '#fff',
          padding: '7px 14px',
          borderRadius: '8px',
          fontSize: '12px', fontWeight: 500,
          fontFamily: FONT,
          whiteSpace: 'nowrap',
          letterSpacing: '-0.01em',
          pointerEvents: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.16)',
          opacity: feedbackVisible ? 1 : 0,
          transition: 'opacity 200ms ease, transform 200ms cubic-bezier(0.32,0.72,0,1)',
        }}>
          ✓ {feedback}
        </div>
      )}

      {/* Context menu */}
      {menuPos && (
        <ContextMenu
          x={menuPos.x}
          y={menuPos.y}
          items={ITEMS}
          onClose={handleClose}
        />
      )}
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// Add @keyframes ctxIn to your global CSS:
// @keyframes ctxIn {
//   from { opacity: 0; transform: scale(0.95) translateY(-4px); }
//   to   { opacity: 1; transform: scale(1) translateY(0); }
// }

interface MenuItem {
  id: string
  label: string
  shortcut?: string
  danger?: boolean
  disabled?: boolean
  dividerAbove?: boolean
  children?: MenuItem[]
}

function MenuRow({ item, isActive, onHover, onClick }: {
  item: MenuItem
  isActive: boolean
  onHover: (item: MenuItem, el: HTMLElement) => void
  onClick: (item: MenuItem) => void
}) {
  const [hovered, setHovered] = useState(false)
  const highlighted = isActive || hovered
  const bgColor = highlighted
    ? item.danger ? 'rgba(220,38,38,0.06)' : 'rgba(10,10,10,0.05)'
    : 'transparent'
  const textColor = item.disabled ? 'rgba(10,10,10,0.28)' : item.danger ? '#dc2626' : '#0a0a0a'

  return (
    <>
      {item.dividerAbove && (
        <div style={{ height: '1px', background: 'rgba(10,10,10,0.07)', margin: '4px 0' }} />
      )}
      <div
        onMouseEnter={e => { setHovered(true); onHover(item, e.currentTarget) }}
        onMouseLeave={() => setHovered(false)}
        onClick={() => !item.disabled && !item.children && onClick(item)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '7px 10px', borderRadius: '8px', background: bgColor,
          cursor: item.disabled ? 'not-allowed' : 'default',
          userSelect: 'none', transition: 'background 100ms ease', gap: '24px',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '-0.01em', color: textColor, lineHeight: '18px', fontFamily: FONT }}>
          {item.label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {item.shortcut && (
            <span style={{ fontSize: '11px', fontWeight: 500, color: item.disabled ? 'rgba(10,10,10,0.18)' : 'rgba(10,10,10,0.28)', fontFamily: FONT }}>
              {item.shortcut}
            </span>
          )}
          {item.children && (
            <span style={{ fontSize: '13px', color: 'rgba(10,10,10,0.3)' }}>›</span>
          )}
        </div>
      </div>
    </>
  )
}

export function ContextMenu({ x, y, items, onClose }: {
  x: number
  y: number
  items: MenuItem[]
  onClose: (action?: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [pos, setPos] = useState({ x, y })
  const [activeId, setActiveId] = useState<string | null>(null)
  const [submenuPos, setSubmenuPos] = useState({ x: 0, y: 0 })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    let nx = x, ny = y
    if (nx + rect.width  > window.innerWidth  - 8) nx = window.innerWidth  - rect.width  - 8
    if (ny + rect.height > window.innerHeight - 8) ny = window.innerHeight - rect.height - 8
    if (nx < 8) nx = 8
    if (ny < 8) ny = 8
    setPos({ x: nx, y: ny })
  }, [x, y])

  useEffect(() => {
    const onKey  = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('keydown',   onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown',   onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const close = useCallback((action?: string) => {
    setMounted(false)
    setTimeout(() => onClose(action), 150)
  }, [onClose])

  const handleHover = useCallback((item: MenuItem, el: HTMLElement) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (item.children) {
      timerRef.current = setTimeout(() => {
        const rect = el.getBoundingClientRect()
        const subW = 172
        const rx = rect.right + 4
        setSubmenuPos({
          x: rx + subW > window.innerWidth ? rect.left - subW - 4 : rx,
          y: rect.top,
        })
        setActiveId(item.id)
      }, 120)
    } else {
      timerRef.current = setTimeout(() => setActiveId(null), 80)
    }
  }, [])

  const activeItem = items.find(i => i.id === activeId)

  return (
    <>
      <div
        ref={ref}
        onMouseDown={e => e.stopPropagation()}
        style={{
          position: 'fixed', left: pos.x, top: pos.y, zIndex: 9999,
          background: '#fff', border: '1px solid rgba(10,10,10,0.1)',
          borderRadius: '12px', padding: '4px', minWidth: '208px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.12)',
          fontFamily: FONT,
          transform: mounted ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-4px)',
          opacity: mounted ? 1 : 0,
          transformOrigin: 'top left',
          transition: 'transform 160ms cubic-bezier(0.32,0.72,0,1), opacity 130ms ease',
        }}
      >
        {items.map(item => (
          <MenuRow
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onHover={handleHover}
            onClick={item => close(item.label)}
          />
        ))}
      </div>

      {activeId && activeItem?.children && (
        <div
          onMouseDown={e => e.stopPropagation()}
          onMouseEnter={() => { if (timerRef.current) clearTimeout(timerRef.current) }}
          onMouseLeave={() => { timerRef.current = setTimeout(() => setActiveId(null), 100) }}
          style={{
            position: 'fixed', left: submenuPos.x, top: submenuPos.y, zIndex: 10000,
            background: '#fff', border: '1px solid rgba(10,10,10,0.1)',
            borderRadius: '12px', padding: '4px', minWidth: '160px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.12)',
            fontFamily: FONT, animation: 'ctxIn 130ms cubic-bezier(0.32,0.72,0,1) forwards',
          }}
        >
          {activeItem.children.map(child => (
            <MenuRow
              key={child.id}
              item={child}
              isActive={false}
              onHover={() => {}}
              onClick={item => close(item.label)}
            />
          ))}
        </div>
      )}
    </>
  )
}

// ── Usage ─────────────────────────────────────────────────────────────────────

const ITEMS: MenuItem[] = [
  { id: 'open',      label: 'Open',            shortcut: '↵' },
  { id: 'new-tab',   label: 'Open in new tab', shortcut: '⌘↵' },
  { id: 'dup',       label: 'Duplicate',       shortcut: '⌘D', dividerAbove: true },
  { id: 'rename',    label: 'Rename',          shortcut: 'F2' },
  { id: 'move',      label: 'Move to…',        children: [
    { id: 'move-inbox',    label: 'Inbox' },
    { id: 'move-archive',  label: 'Archive' },
    { id: 'move-projects', label: 'Projects' },
    { id: 'move-trash',    label: 'Trash', danger: true },
  ]},
  { id: 'copy-link', label: 'Copy link',       shortcut: '⌘L', dividerAbove: true },
  { id: 'download',  label: 'Download',        disabled: true },
  { id: 'delete',    label: 'Delete',          shortcut: '⌫', danger: true, dividerAbove: true },
]

export function Demo() {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)
  return (
    <div
      onContextMenu={e => { e.preventDefault(); setMenu({ x: e.clientX, y: e.clientY }) }}
      style={{ padding: '40px', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '12px', cursor: 'context-menu' }}
    >
      <p style={{ margin: 0, fontSize: '13px', color: 'rgba(10,10,10,0.5)', fontFamily: FONT }}>Right-click anywhere here</p>
      {menu && <ContextMenu x={menu.x} y={menu.y} items={ITEMS} onClose={() => setMenu(null)} />}
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContextMenuPage() {
  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: FONT }}>
      <style>{`
        @keyframes ctxIn {
          from { opacity: 0; transform: scale(0.95) translateY(-4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px 80px',
      }}>
        <ContextMenuDemo />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          color: 'rgba(10,10,10,0.4)',
          marginBottom: '12px',
          fontFamily: FONT,
        }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
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
