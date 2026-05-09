'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Types ────────────────────────────────────────────────────────────────────

type MenuEntry =
  | { type: 'divider' }
  | {
      type?: 'item'
      label: string
      icon?: string
      shortcut?: string
      disabled?: boolean
      danger?: boolean
      submenu?: { label: string; shortcut?: string }[]
      onSelect?: () => void
    }

// ─── ContextMenu ──────────────────────────────────────────────────────────────

function ContextMenu({
  items,
  x,
  y,
  onClose,
}: {
  items: MenuEntry[]
  x: number
  y: number
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x, y })
  const [visible, setVisible] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [submenuIdx, setSubmenuIdx] = useState<number | null>(null)

  // After first paint: measure menu size, clamp to viewport, then animate in
  useEffect(() => {
    if (!ref.current) return
    const { width, height } = ref.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    setPos({
      x: Math.max(8, x + width > vw - 8 ? x - width : x),
      y: Math.max(8, y + height > vh - 8 ? y - height : y),
    })
    requestAnimationFrame(() => setVisible(true))
  }, [x, y])

  const dismiss = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, 150)
  }, [onClose])

  useEffect(() => {
    const selectable = items.reduce<number[]>((a, e, i) => {
      if (e.type !== 'divider') a.push(i)
      return a
    }, [])

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { dismiss(); return }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIdx(prev => {
          const ci = selectable.indexOf(prev)
          return selectable[(ci + 1 + selectable.length) % selectable.length] ?? selectable[0]
        })
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIdx(prev => {
          const ci = selectable.indexOf(prev)
          return selectable[(ci - 1 + selectable.length) % selectable.length] ?? selectable[selectable.length - 1]
        })
      }
      if (e.key === 'Enter') {
        const entry = items[activeIdx]
        if (entry && entry.type !== 'divider' && !entry.disabled && !entry.submenu) {
          entry.onSelect?.()
          dismiss()
        }
      }
    }

    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) dismiss()
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [activeIdx, items, dismiss])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 9999,
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.14)',
        padding: '4px',
        minWidth: '204px',
        fontFamily: FONT,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.96)',
        transformOrigin: 'top left',
        transition: 'opacity 150ms ease, transform 150ms cubic-bezier(0.32, 0.72, 0, 1)',
        userSelect: 'none',
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      {items.map((entry, i) => {
        if (entry.type === 'divider') {
          return (
            <div
              key={i}
              style={{ height: '1px', background: 'rgba(10,10,10,0.06)', margin: '3px 4px' }}
            />
          )
        }

        const isActive = activeIdx === i
        const showSub = submenuIdx === i && entry.submenu

        return (
          <div
            key={i}
            style={{ position: 'relative' }}
            onMouseEnter={() => {
              setActiveIdx(i)
              if (entry.submenu) setSubmenuIdx(i)
              else setSubmenuIdx(null)
            }}
            onMouseLeave={() => {
              if (!entry.submenu) setActiveIdx(-1)
            }}
            onClick={() => {
              if (!entry.disabled && !entry.submenu) {
                entry.onSelect?.()
                dismiss()
              }
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 8px',
                borderRadius: '6px',
                cursor: entry.disabled ? 'default' : 'pointer',
                background: isActive && !entry.disabled ? 'rgba(10,10,10,0.05)' : 'transparent',
                opacity: entry.disabled ? 0.38 : 1,
                transition: 'background 80ms ease, opacity 80ms ease',
              }}
            >
              {entry.icon && (
                <span
                  style={{
                    width: '16px',
                    fontSize: '13px',
                    textAlign: 'center',
                    flexShrink: 0,
                    color: entry.danger ? '#dc2626' : 'rgba(10,10,10,0.45)',
                    lineHeight: 1,
                  }}
                >
                  {entry.icon}
                </span>
              )}
              <span
                style={{
                  flex: 1,
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  lineHeight: '18px',
                  color: entry.danger ? '#dc2626' : '#0a0a0a',
                }}
              >
                {entry.label}
              </span>
              {entry.shortcut && (
                <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.35)', fontWeight: 400 }}>
                  {entry.shortcut}
                </span>
              )}
              {entry.submenu && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  style={{ opacity: 0.35, flexShrink: 0 }}
                >
                  <path
                    d="M3.5 2L7 5L3.5 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            {/* Submenu panel */}
            {showSub && (
              <div
                style={{
                  position: 'absolute',
                  left: '100%',
                  top: -4,
                  marginLeft: 4,
                  background: '#fff',
                  border: '1px solid rgba(10,10,10,0.08)',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.14)',
                  padding: '4px',
                  minWidth: '160px',
                  zIndex: 10000,
                  animation: 'cmSubIn 130ms cubic-bezier(0.32,0.72,0,1)',
                }}
              >
                <style>{`@keyframes cmSubIn { from { opacity:0; transform:scale(0.96) translateX(-4px) } to { opacity:1; transform:none } }`}</style>
                {entry.submenu!.map((sub, si) => (
                  <div
                    key={si}
                    onClick={e => {
                      e.stopPropagation()
                      dismiss()
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500,
                      letterSpacing: '-0.01em',
                      color: '#0a0a0a',
                      lineHeight: '18px',
                      transition: 'background 80ms ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span>{sub.label}</span>
                    {sub.shortcut && (
                      <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.35)' }}>
                        {sub.shortcut}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

const FILES = [
  { name: 'page.tsx',           icon: '⚛', kind: 'TypeScript', size: '14 KB', modified: '2m ago'  },
  { name: 'README.md',          icon: '≡', kind: 'Markdown',   size: '4 KB',  modified: '1h ago'  },
  { name: 'package.json',       icon: '{}', kind: 'JSON',       size: '2 KB',  modified: '3d ago'  },
  { name: 'tailwind.config.ts', icon: '⚛', kind: 'TypeScript', size: '1 KB',  modified: '5d ago'  },
  { name: 'components',         icon: '▶', kind: 'Folder',     size: '—',     modified: '1h ago'  },
  { name: 'public',             icon: '▶', kind: 'Folder',     size: '—',     modified: '2d ago'  },
]

function Demo() {
  const [menu, setMenu] = useState<{ x: number; y: number; items: MenuEntry[] } | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [lastAction, setLastAction] = useState<string | null>(null)
  const actionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const act = (label: string) => {
    if (actionTimerRef.current) clearTimeout(actionTimerRef.current)
    setLastAction(label)
    setMenu(null)
    actionTimerRef.current = setTimeout(() => setLastAction(null), 3000)
  }

  const buildFileMenu = (fileName: string): MenuEntry[] => [
    { label: 'Open',       icon: '↗', shortcut: '⌘O', onSelect: () => act(`Open "${fileName}"`) },
    {
      label: 'Open With', icon: '⊕',
      submenu: [
        { label: 'VS Code',  shortcut: 'code .' },
        { label: 'Browser' },
        { label: 'TextEdit' },
      ],
    },
    { type: 'divider' },
    { label: 'Copy',       icon: '⎘', shortcut: '⌘C', onSelect: () => act(`Copy "${fileName}"`) },
    { label: 'Cut',        icon: '✂', shortcut: '⌘X', onSelect: () => act(`Cut "${fileName}"`) },
    { type: 'divider' },
    { label: 'Rename',                shortcut: '↩',  onSelect: () => act(`Rename "${fileName}"`) },
    { label: 'Duplicate',             shortcut: '⌘D', onSelect: () => act(`Duplicate "${fileName}"`) },
    { type: 'divider' },
    { label: 'Move to Trash', icon: '⌫', shortcut: '⌘⌫', danger: true, onSelect: () => act(`Trash "${fileName}"`) },
  ]

  const buildEmptyMenu = (): MenuEntry[] => [
    { label: 'New File',   icon: '+',  shortcut: '⌘N',  onSelect: () => act('New File') },
    { label: 'New Folder', icon: '▶',  shortcut: '⇧⌘N', onSelect: () => act('New Folder') },
    { type: 'divider' },
    { label: 'Paste',      icon: '⎘', shortcut: '⌘V', disabled: true },
    { type: 'divider' },
    {
      label: 'Sort By', icon: '↕',
      submenu: [
        { label: 'Name',          shortcut: 'A → Z' },
        { label: 'Kind' },
        { label: 'Size' },
        { label: 'Date Modified' },
      ],
    },
    { label: 'Get Info', icon: 'i', shortcut: '⌘I', onSelect: () => act('Get Info') },
  ]

  const openMenu = (e: React.MouseEvent, fileName?: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (fileName) setSelected(fileName)
    setMenu({
      x: e.clientX,
      y: e.clientY,
      items: fileName ? buildFileMenu(fileName) : buildEmptyMenu(),
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%', maxWidth: '520px' }}>
      {/* File browser card */}
      <div
        onContextMenu={e => openMenu(e)}
        style={{
          width: '100%',
          background: '#fff',
          borderRadius: '14px',
          border: '1px solid rgba(10,10,10,0.08)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          fontFamily: FONT,
        }}
      >
        {/* Window chrome */}
        <div
          style={{
            padding: '11px 16px',
            borderBottom: '1px solid rgba(10,10,10,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#fafafa',
          }}
        >
          <div style={{ display: 'flex', gap: '6px' }}>
            {['#FF5F56', '#FFBD2E', '#27C93F'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'rgba(10,10,10,0.38)',
              letterSpacing: '-0.01em',
              marginLeft: 4,
            }}
          >
            ~/projects/vraj.me
          </span>
        </div>

        {/* Column headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 88px 64px 80px',
            padding: '5px 16px',
            borderBottom: '1px solid rgba(10,10,10,0.05)',
          }}
        >
          {['Name', 'Kind', 'Size', 'Modified'].map(h => (
            <span
              key={h}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'rgba(10,10,10,0.35)',
                letterSpacing: '-0.01em',
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* File rows */}
        <div style={{ padding: '4px' }}>
          {FILES.map(f => (
            <div
              key={f.name}
              onContextMenu={e => openMenu(e, f.name)}
              onClick={() => setSelected(f.name)}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 88px 64px 80px',
                padding: '6px 12px',
                alignItems: 'center',
                cursor: 'default',
                borderRadius: '6px',
                background: selected === f.name ? 'rgba(10,10,10,0.05)' : 'transparent',
                transition: 'background 80ms ease',
              }}
              onMouseEnter={e => {
                if (selected !== f.name) e.currentTarget.style.background = 'rgba(10,10,10,0.03)'
              }}
              onMouseLeave={e => {
                if (selected !== f.name) e.currentTarget.style.background = 'transparent'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', lineHeight: 1, color: 'rgba(10,10,10,0.45)', width: 14, textAlign: 'center', flexShrink: 0 }}>
                  {f.icon}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#0a0a0a',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {f.name}
                </span>
              </span>
              <span style={{ fontSize: '12px', color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em' }}>
                {f.kind}
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: 'rgba(10,10,10,0.4)',
                  letterSpacing: '-0.01em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {f.size}
              </span>
              <span style={{ fontSize: '12px', color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em' }}>
                {f.modified}
              </span>
            </div>
          ))}
        </div>

        {/* Status bar */}
        <div
          style={{
            padding: '7px 16px',
            borderTop: '1px solid rgba(10,10,10,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minHeight: '32px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: 'rgba(10,10,10,0.35)',
              fontWeight: 500,
              letterSpacing: '-0.01em',
            }}
          >
            {FILES.length} items
          </span>
          {lastAction && (
            <span
              key={lastAction}
              style={{
                fontSize: '11px',
                color: 'rgba(10,10,10,0.5)',
                fontWeight: 500,
                background: 'rgba(10,10,10,0.04)',
                padding: '2px 8px',
                borderRadius: '5px',
                letterSpacing: '-0.01em',
                animation: 'cmFadeIn 180ms ease',
              }}
            >
              <style>{`@keyframes cmFadeIn { from { opacity:0; transform:translateY(2px) } to { opacity:1; transform:none } }`}</style>
              ↳ {lastAction}
            </span>
          )}
        </div>
      </div>

      {/* Hint */}
      <p
        style={{
          margin: 0,
          fontSize: '12px',
          color: 'rgba(0,0,0,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily: FONT,
          textAlign: 'center',
        }}
      >
        Right-click a file · right-click empty space for a different menu · ↑↓ ↵ Esc
      </p>

      {/* Render the context menu at the document level via position:fixed */}
      {menu && (
        <ContextMenu
          items={menu.items}
          x={menu.x}
          y={menu.y}
          onClose={() => setMenu(null)}
        />
      )}
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Types ──────────────────────────────────────────────────────────────────

type MenuEntry =
  | { type: 'divider' }
  | {
      type?: 'item'
      label: string
      icon?: string
      shortcut?: string
      disabled?: boolean
      danger?: boolean
      submenu?: { label: string; shortcut?: string }[]
      onSelect?: () => void
    }

// ─── ContextMenu ────────────────────────────────────────────────────────────

export function ContextMenu({
  items,
  x,
  y,
  onClose,
}: {
  items: MenuEntry[]
  x: number
  y: number
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x, y })
  const [visible, setVisible] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [submenuIdx, setSubmenuIdx] = useState<number | null>(null)

  // After first paint: measure, clamp to viewport, then animate in
  useEffect(() => {
    if (!ref.current) return
    const { width, height } = ref.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    setPos({
      x: Math.max(8, x + width > vw - 8 ? x - width : x),
      y: Math.max(8, y + height > vh - 8 ? y - height : y),
    })
    requestAnimationFrame(() => setVisible(true))
  }, [x, y])

  const dismiss = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, 150)
  }, [onClose])

  useEffect(() => {
    const sel = items.reduce<number[]>((a, e, i) => {
      if (e.type !== 'divider') a.push(i)
      return a
    }, [])

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { dismiss(); return }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIdx(prev => {
          const ci = sel.indexOf(prev)
          return sel[(ci + 1 + sel.length) % sel.length] ?? sel[0]
        })
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIdx(prev => {
          const ci = sel.indexOf(prev)
          return sel[(ci - 1 + sel.length) % sel.length] ?? sel[sel.length - 1]
        })
      }
      if (e.key === 'Enter') {
        const entry = items[activeIdx]
        if (entry && entry.type !== 'divider' && !entry.disabled && !entry.submenu) {
          entry.onSelect?.()
          dismiss()
        }
      }
    }

    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) dismiss()
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [activeIdx, items, dismiss])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 9999,
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.14)',
        padding: '4px',
        minWidth: '204px',
        fontFamily: FONT,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.96)',
        transformOrigin: 'top left',
        transition: 'opacity 150ms ease, transform 150ms cubic-bezier(0.32, 0.72, 0, 1)',
        userSelect: 'none',
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      {items.map((entry, i) => {
        if (entry.type === 'divider') {
          return <div key={i} style={{ height: '1px', background: 'rgba(10,10,10,0.06)', margin: '3px 4px' }} />
        }

        const isActive = activeIdx === i
        const showSub = submenuIdx === i && entry.submenu

        return (
          <div
            key={i}
            style={{ position: 'relative' }}
            onMouseEnter={() => {
              setActiveIdx(i)
              if (entry.submenu) setSubmenuIdx(i); else setSubmenuIdx(null)
            }}
            onMouseLeave={() => { if (!entry.submenu) setActiveIdx(-1) }}
            onClick={() => {
              if (!entry.disabled && !entry.submenu) { entry.onSelect?.(); dismiss() }
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 8px',
              borderRadius: '6px', cursor: entry.disabled ? 'default' : 'pointer',
              background: isActive && !entry.disabled ? 'rgba(10,10,10,0.05)' : 'transparent',
              opacity: entry.disabled ? 0.38 : 1, transition: 'background 80ms ease',
            }}>
              {entry.icon && (
                <span style={{
                  width: '16px', fontSize: '13px', textAlign: 'center', flexShrink: 0,
                  color: entry.danger ? '#dc2626' : 'rgba(10,10,10,0.45)', lineHeight: 1,
                }}>
                  {entry.icon}
                </span>
              )}
              <span style={{
                flex: 1, fontSize: '13px', fontWeight: 500, letterSpacing: '-0.01em',
                lineHeight: '18px', color: entry.danger ? '#dc2626' : '#0a0a0a',
              }}>
                {entry.label}
              </span>
              {entry.shortcut && (
                <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.35)', fontWeight: 400 }}>
                  {entry.shortcut}
                </span>
              )}
              {entry.submenu && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.35, flexShrink: 0 }}>
                  <path d="M3.5 2L7 5L3.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>

            {/* Submenu panel */}
            {showSub && (
              <div style={{
                position: 'absolute', left: '100%', top: -4, marginLeft: 4,
                background: '#fff', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.14)',
                padding: '4px', minWidth: '160px', zIndex: 10000,
                animation: 'cmSubIn 130ms cubic-bezier(0.32,0.72,0,1)',
              }}>
                <style>{\`@keyframes cmSubIn { from { opacity:0; transform:scale(0.96) translateX(-4px) } to { opacity:1; transform:none } }\`}</style>
                {entry.submenu!.map((sub, si) => (
                  <div
                    key={si}
                    onClick={e => { e.stopPropagation(); dismiss() }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '5px 8px', borderRadius: '6px', cursor: 'pointer',
                      fontSize: '13px', fontWeight: 500, letterSpacing: '-0.01em',
                      color: '#0a0a0a', lineHeight: '18px', transition: 'background 80ms ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span>{sub.label}</span>
                    {sub.shortcut && (
                      <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.35)' }}>{sub.shortcut}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Usage ──────────────────────────────────────────────────────────────────

export default function App() {
  const [menu, setMenu] = useState<{ x: number; y: number; items: MenuEntry[] } | null>(null)

  const items: MenuEntry[] = [
    { label: 'Copy',          icon: '⎘', shortcut: '⌘C', onSelect: () => console.log('copy') },
    { label: 'Cut',           icon: '✂', shortcut: '⌘X', onSelect: () => console.log('cut') },
    { type: 'divider' },
    { label: 'Rename',                   shortcut: '↩',  onSelect: () => console.log('rename') },
    { label: 'Duplicate',                shortcut: '⌘D', onSelect: () => console.log('duplicate') },
    { type: 'divider' },
    {
      label: 'Sort By', icon: '↕',
      submenu: [{ label: 'Name' }, { label: 'Date' }, { label: 'Size' }],
    },
    { type: 'divider' },
    { label: 'Move to Trash', icon: '⌫', shortcut: '⌘⌫', danger: true, onSelect: () => console.log('trash') },
  ]

  return (
    <div
      onContextMenu={e => {
        e.preventDefault()
        setMenu({ x: e.clientX, y: e.clientY, items })
      }}
      style={{ width: '100vw', height: '100vh', fontFamily: FONT }}
    >
      <p style={{ padding: 24, fontSize: 13, color: 'rgba(10,10,10,0.5)' }}>
        Right-click anywhere
      </p>
      {menu && (
        <ContextMenu
          items={menu.items}
          x={menu.x}
          y={menu.y}
          onClose={() => setMenu(null)}
        />
      )}
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContextMenuPage() {
  return (
    <main
      style={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        fontFamily: FONT,
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
        }}
      >
        <Demo />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.4)',
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
