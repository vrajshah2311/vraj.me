'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── types ────────────────────────────────────────────────────────────────────

type MenuAction = {
  id: string
  label: string
  kbd?: string
  icon: React.ReactNode
  destructive?: boolean
  separator?: boolean
}

// ─── icons (inline SVG, no deps) ─────────────────────────────────────────────

const Icon = {
  Copy: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M3 9H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  Cut: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="3" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="10" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M3 10L6.5 3.5L10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Paste: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="2" y="3" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 3V2.5A.5.5 0 0 1 5.5 2h2a.5.5 0 0 1 .5.5V3" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 6.5h3M5 8.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  Rename: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 10.5h9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M8.5 2.5l1.5 1.5-5.5 5.5H3V8l5.5-5.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  ),
  Share: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M9.5 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M3.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M9.5 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 7l3.5 2M8.5 4L5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  Info: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M6.5 5.5v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="6.5" cy="3.8" r="0.6" fill="currentColor"/>
    </svg>
  ),
  Delete: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 3.5h9M5 3.5V2.5A.5.5 0 0 1 5.5 2h2a.5.5 0 0 1 .5.5v1M4 3.5l.5 7h4l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

const MENU_ITEMS: MenuAction[] = [
  { id: 'copy',    label: 'Copy',           kbd: '⌘C',  icon: Icon.Copy   },
  { id: 'cut',     label: 'Cut',            kbd: '⌘X',  icon: Icon.Cut    },
  { id: 'paste',   label: 'Paste',          kbd: '⌘V',  icon: Icon.Paste  },
  { id: 'rename',  label: 'Rename',         kbd: 'F2',  icon: Icon.Rename, separator: true },
  { id: 'share',   label: 'Share…',                     icon: Icon.Share  },
  { id: 'info',    label: 'Get info',       kbd: '⌘I',  icon: Icon.Info,  separator: true },
  { id: 'delete',  label: 'Move to Trash',  kbd: '⌘⌫', icon: Icon.Delete, destructive: true },
]

// ─── context menu component ───────────────────────────────────────────────────

function ContextMenu({
  x, y, visible, onClose, boundingEl,
}: {
  x: number; y: number; visible: boolean
  onClose: (id?: string) => void
  boundingEl: HTMLElement | null
}) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [pos, setPos] = useState({ x, y })
  const [show, setShow] = useState(false)

  // Clamp to bounding element so the menu stays inside the stage
  useEffect(() => {
    if (!visible || !boundingEl || !menuRef.current) return
    const rect = boundingEl.getBoundingClientRect()
    const mw = menuRef.current.offsetWidth || 200
    const mh = menuRef.current.offsetHeight || 260
    setPos({
      x: Math.min(x, rect.right - mw - 8),
      y: Math.min(y, rect.bottom - mh - 8),
    })
  }, [visible, x, y, boundingEl])

  useEffect(() => {
    if (visible) {
      setActiveId(null)
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)))
    } else {
      setShow(false)
    }
  }, [visible])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!visible) return
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveId(id => {
          const idx = MENU_ITEMS.findIndex(i => i.id === id)
          return MENU_ITEMS[(idx + 1) % MENU_ITEMS.length].id
        })
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveId(id => {
          const idx = MENU_ITEMS.findIndex(i => i.id === id)
          return MENU_ITEMS[(idx - 1 + MENU_ITEMS.length) % MENU_ITEMS.length].id
        })
      }
      if (e.key === 'Enter' && activeId) { onClose(activeId) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, activeId, onClose])

  if (!visible && !show) return null

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 999,
        width: 210,
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 12,
        border: '1px solid rgba(0,0,0,0.09)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.1), 0 32px 48px rgba(0,0,0,0.07)',
        padding: '4px 0',
        fontFamily: font,
        opacity: show ? 1 : 0,
        transform: show ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(-6px)',
        transformOrigin: 'top left',
        transition: 'opacity 0.14s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {MENU_ITEMS.map((item, i) => (
        <div key={item.id}>
          {item.separator && i > 0 && (
            <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '3px 0' }} />
          )}
          <div
            onMouseEnter={() => setActiveId(item.id)}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => onClose(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 10px',
              margin: '0 4px',
              borderRadius: 7,
              cursor: 'default',
              background: activeId === item.id ? 'rgba(0,0,0,0.06)' : 'transparent',
              transition: 'background 0.08s ease',
            }}
          >
            <span style={{
              color: item.destructive
                ? activeId === item.id ? '#d93025' : 'rgba(217,48,37,0.8)'
                : activeId === item.id ? '#0a0a0a' : 'rgba(0,0,0,0.55)',
              display: 'flex',
              transition: 'color 0.08s ease',
            }}>
              {item.icon}
            </span>
            <span style={{
              flex: 1,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              color: item.destructive
                ? activeId === item.id ? '#d93025' : 'rgba(217,48,37,0.85)'
                : activeId === item.id ? '#0a0a0a' : '#111',
              transition: 'color 0.08s ease',
            }}>
              {item.label}
            </span>
            {item.kbd && (
              <span style={{
                fontSize: 11,
                color: 'rgba(0,0,0,0.3)',
                letterSpacing: '0.01em',
                fontFamily: 'inherit',
              }}>
                {item.kbd}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── demo ─────────────────────────────────────────────────────────────────────

function Demo() {
  const [menu, setMenu] = useState<{ x: number; y: number; open: boolean }>({ x: 0, y: 0, open: false })
  const [lastAction, setLastAction] = useState<string | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  const files = [
    { name: 'index.tsx', type: 'tsx', size: '4.2 KB' },
    { name: 'globals.css', type: 'css', size: '1.1 KB' },
    { name: 'layout.tsx', type: 'tsx', size: '2.8 KB' },
    { name: 'utils.ts', type: 'ts', size: '3.5 KB' },
    { name: 'package.json', type: 'json', size: '0.8 KB' },
  ]

  const typeColor: Record<string, string> = {
    tsx: '#3178c6',
    css: '#cc6699',
    ts: '#3178c6',
    json: '#c0a050',
  }

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setMenu({ x: e.clientX, y: e.clientY, open: true })
  }, [])

  const handleClose = useCallback((id?: string) => {
    setMenu(m => ({ ...m, open: false }))
    if (id) {
      const item = MENU_ITEMS.find(i => i.id === id)
      if (item) setLastAction(item.label)
    }
  }, [])

  useEffect(() => {
    if (!menu.open) return
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu(m => ({ ...m, open: false }))
      }
    }
    window.addEventListener('mousedown', close)
    return () => window.removeEventListener('mousedown', close)
  }, [menu.open])

  const menuRef = useRef<HTMLDivElement>(null)

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '40px 24px',
        fontFamily: font,
      }}
    >
      {/* Stage */}
      <div
        ref={stageRef}
        onContextMenu={handleContextMenu}
        style={{
          width: '100%',
          maxWidth: 480,
          background: '#fff',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          cursor: 'context-menu',
          userSelect: 'none',
        }}
      >
        {/* Fake titlebar */}
        <div style={{
          height: 44,
          padding: '0 14px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#fafafa',
        }}>
          {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.4)', letterSpacing: '-0.01em' }}>
              Files
            </span>
          </div>
        </div>

        {/* File list */}
        <div style={{ padding: '6px 0' }}>
          {files.map((f, i) => (
            <div
              key={f.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 14px',
                cursor: 'default',
                transition: 'background 0.1s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.025)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: `${typeColor[f.type]}15`,
                border: `1px solid ${typeColor[f.type]}25`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: typeColor[f.type], letterSpacing: '0.02em', fontFamily: 'ui-monospace, monospace' }}>
                  {f.type.toUpperCase()}
                </span>
              </div>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                {f.name}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.3)', fontWeight: 500 }}>
                {f.size}
              </span>
            </div>
          ))}
        </div>

        {/* Status bar */}
        <div style={{
          height: 36,
          borderTop: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          background: '#fafafa',
        }}>
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            color: 'rgba(0,0,0,0.35)',
            letterSpacing: '-0.01em',
            transition: 'color 0.2s ease',
          }}>
            {lastAction ? `"${lastAction}" selected` : 'Right-click anywhere to open menu'}
          </span>
        </div>
      </div>

      <div style={{ marginTop: 14, fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.35)', letterSpacing: '-0.01em' }}>
        Right-click · arrow keys to navigate · enter to select · esc to close
      </div>

      {/* Context menu rendered here, clamped to stageRef */}
      <div ref={menuRef}>
        <ContextMenu
          x={menu.x}
          y={menu.y}
          visible={menu.open}
          onClose={handleClose}
          boundingEl={stageRef.current}
        />
      </div>
    </div>
  )
}

// ─── copy button ──────────────────────────────────────────────────────────────

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
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 7,
        color: copied ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
        fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: font,
        letterSpacing: '-0.01em',
        transition: 'background 0.15s ease, color 0.15s ease',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ─── source shown in code block ───────────────────────────────────────────────

const CODE_SOURCE = `'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type MenuItem = {
  id: string
  label: string
  kbd?: string
  icon: React.ReactNode
  destructive?: boolean
  separator?: boolean
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'copy',   label: 'Copy',          kbd: '⌘C',  icon: <CopyIcon   /> },
  { id: 'cut',    label: 'Cut',           kbd: '⌘X',  icon: <CutIcon    /> },
  { id: 'paste',  label: 'Paste',         kbd: '⌘V',  icon: <PasteIcon  />, separator: true },
  { id: 'share',  label: 'Share…',                    icon: <ShareIcon  /> },
  { id: 'info',   label: 'Get info',      kbd: '⌘I',  icon: <InfoIcon   />, separator: true },
  { id: 'delete', label: 'Move to Trash', kbd: '⌘⌫', icon: <DeleteIcon />, destructive: true },
]

function ContextMenu({
  x, y, visible, onClose,
}: {
  x: number; y: number; visible: boolean
  onClose: (id?: string) => void
}) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [pos, setPos] = useState({ x, y })
  const [show, setShow] = useState(false)

  // Clamp so menu stays in viewport
  useEffect(() => {
    if (!visible || !menuRef.current) return
    const mw = menuRef.current.offsetWidth || 210
    const mh = menuRef.current.offsetHeight || 240
    setPos({
      x: Math.min(x, window.innerWidth  - mw - 8),
      y: Math.min(y, window.innerHeight - mh - 8),
    })
  }, [visible, x, y])

  useEffect(() => {
    if (visible) {
      setActiveId(null)
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)))
    } else {
      setShow(false)
    }
  }, [visible])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!visible) return
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveId(id => {
          const idx = MENU_ITEMS.findIndex(i => i.id === id)
          return MENU_ITEMS[(idx + 1) % MENU_ITEMS.length].id
        })
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveId(id => {
          const idx = MENU_ITEMS.findIndex(i => i.id === id)
          return MENU_ITEMS[(idx - 1 + MENU_ITEMS.length) % MENU_ITEMS.length].id
        })
      }
      if (e.key === 'Enter' && activeId) onClose(activeId)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, activeId, onClose])

  useEffect(() => {
    if (!visible) return
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose()
    }
    window.addEventListener('mousedown', close)
    return () => window.removeEventListener('mousedown', close)
  }, [visible, onClose])

  if (!visible && !show) return null

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 999,
        width: 210,
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 12,
        border: '1px solid rgba(0,0,0,0.09)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.1), 0 32px 48px rgba(0,0,0,0.07)',
        padding: '4px 0',
        fontFamily: font,
        opacity: show ? 1 : 0,
        transform: show ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(-6px)',
        transformOrigin: 'top left',
        transition: 'opacity 0.14s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {MENU_ITEMS.map((item, i) => (
        <div key={item.id}>
          {item.separator && i > 0 && (
            <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '3px 0' }} />
          )}
          <div
            onMouseEnter={() => setActiveId(item.id)}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => onClose(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 10px',
              margin: '0 4px',
              borderRadius: 7,
              cursor: 'default',
              background: activeId === item.id ? 'rgba(0,0,0,0.06)' : 'transparent',
              transition: 'background 0.08s ease',
            }}
          >
            <span style={{
              color: item.destructive
                ? activeId === item.id ? '#d93025' : 'rgba(217,48,37,0.8)'
                : activeId === item.id ? '#0a0a0a' : 'rgba(0,0,0,0.55)',
              display: 'flex',
              transition: 'color 0.08s ease',
            }}>
              {item.icon}
            </span>
            <span style={{
              flex: 1,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              color: item.destructive
                ? activeId === item.id ? '#d93025' : 'rgba(217,48,37,0.85)'
                : activeId === item.id ? '#0a0a0a' : '#111',
              transition: 'color 0.08s ease',
            }}>
              {item.label}
            </span>
            {item.kbd && (
              <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.01em' }}>
                {item.kbd}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// Usage in your app:
export default function App() {
  const [menu, setMenu] = useState<{ x: number; y: number; open: boolean }>({ x: 0, y: 0, open: false })

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setMenu({ x: e.clientX, y: e.clientY, open: true })
  }, [])

  return (
    <div
      style={{ minHeight: '100vh', fontFamily: font }}
      onContextMenu={handleContextMenu}
    >
      <p style={{ padding: 40, color: 'rgba(0,0,0,0.4)', fontSize: 13 }}>
        Right-click anywhere
      </p>

      <ContextMenu
        x={menu.x}
        y={menu.y}
        visible={menu.open}
        onClose={(id) => {
          setMenu(m => ({ ...m, open: false }))
          if (id) console.log('selected:', id)
        }}
      />
    </div>
  )
}`

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ContextMenuPage() {
  return (
    <div style={{ background: '#fff' }}>
      <Demo />

      {/* CODE */}
      <div style={{ background: '#0a0a0a', padding: 'clamp(24px, 4vw, 48px)', fontFamily: font }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>
                Context Menu
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
                ContextMenu.tsx
              </div>
            </div>
            <pre style={{
              margin: 0, padding: '20px',
              overflowX: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
              fontSize: 12.5, lineHeight: 1.65, color: '#e5e5e5',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.1) transparent',
            }}>
              <code>{CODE_SOURCE}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
