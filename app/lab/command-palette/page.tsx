'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Command {
  id: string
  label: string
  group: string
  shortcut?: string
  icon: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const COMMANDS: Command[] = [
  { id: 'home',      label: 'Go to Home',          group: 'Navigation', icon: '⌂', shortcut: 'G H' },
  { id: 'lab',       label: 'Go to Lab',            group: 'Navigation', icon: '⚗', shortcut: 'G L' },
  { id: 'about',     label: 'Go to About',          group: 'Navigation', icon: '◉', shortcut: 'G A' },
  { id: 'copy-link', label: 'Copy Link',            group: 'Actions',    icon: '⎘', shortcut: '⌘ ⇧ C' },
  { id: 'share',     label: 'Share Page',           group: 'Actions',    icon: '↗' },
  { id: 'new-doc',   label: 'New Document',         group: 'Actions',    icon: '+', shortcut: '⌘ N' },
  { id: 'theme',     label: 'Toggle Theme',         group: 'Settings',   icon: '◑', shortcut: '⌘ ⇧ L' },
  { id: 'settings',  label: 'Open Settings',        group: 'Settings',   icon: '⚙', shortcut: '⌘ ,' },
  { id: 'shortcuts', label: 'Keyboard Shortcuts',   group: 'Settings',   icon: '⌨', shortcut: '⌘ /' },
]

// ─── Palette ──────────────────────────────────────────────────────────────────

function CommandPalette({ onClose, onSelect }: {
  onClose: () => void
  onSelect: (cmd: Command) => void
}) {
  const [query, setQuery]       = useState('')
  const [activeIdx, setActive]  = useState(0)
  const [mounted, setMounted]   = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef  = useRef<HTMLDivElement>(null)

  // Mount animation
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 16)
    inputRef.current?.focus()
    return () => clearTimeout(id)
  }, [])

  // Filtered + grouped results
  const filtered = query.trim()
    ? COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase().trim()))
    : COMMANDS

  const groups = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    ;(acc[cmd.group] ??= []).push(cmd)
    return acc
  }, {})

  const flat = Object.values(groups).flat()

  // Reset selection on query change
  useEffect(() => { setActive(0) }, [query])

  // Scroll active item into view
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  const close = useCallback(() => {
    setMounted(false)
    setTimeout(onClose, 200)
  }, [onClose])

  const select = useCallback((cmd: Command) => {
    setMounted(false)
    setTimeout(() => onSelect(cmd), 150)
  }, [onSelect])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown')  { e.preventDefault(); setActive(i => (i + 1) % Math.max(flat.length, 1)) }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(i => (i - 1 + Math.max(flat.length, 1)) % Math.max(flat.length, 1)) }
    else if (e.key === 'Enter' && flat[activeIdx]) select(flat[activeIdx])
    else if (e.key === 'Escape') close()
  }

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0,
        background: mounted ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0)',
        backdropFilter: mounted ? 'blur(6px)' : 'blur(0px)',
        WebkitBackdropFilter: mounted ? 'blur(6px)' : 'blur(0px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '14vh',
        transition: 'background 200ms ease, backdrop-filter 200ms ease',
        zIndex: 1000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        onKeyDown={onKeyDown}
        style={{
          width: '480px',
          maxWidth: 'calc(100vw - 32px)',
          background: '#ffffff',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: '14px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          transform: mounted ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(-10px)',
          opacity: mounted ? 1 : 0,
          transition: 'transform 220ms cubic-bezier(0.32, 0.72, 0, 1), opacity 220ms ease',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* Search row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 14px',
          borderBottom: '1px solid rgba(10,10,10,0.06)',
        }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, color: 'rgba(10,10,10,0.35)' }}>
            <path d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM9.5 10.207l3.146 3.147a.5.5 0 0 0 .708-.708L10.207 9.5A4.5 4.5 0 1 0 9.5 10.207Z" fill="currentColor" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search commands…"
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: '14px', fontWeight: 500,
              color: '#0a0a0a', background: 'transparent',
              letterSpacing: '-0.01em',
              fontFamily: 'inherit',
            }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus() }}
              style={{
                background: 'rgba(10,10,10,0.06)', border: 'none', cursor: 'pointer',
                padding: '2px 7px', borderRadius: '5px',
                color: 'rgba(10,10,10,0.45)', fontSize: '11px', fontWeight: 600,
                lineHeight: '16px', fontFamily: 'inherit',
                transition: 'background 150ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.06)')}
            >
              Clear
            </button>
          )}
        </div>

        {/* Results list */}
        <div ref={listRef} style={{ maxHeight: '308px', overflowY: 'auto', padding: '6px' }}>
          {flat.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'rgba(10,10,10,0.4)', fontSize: '13px', fontWeight: 500, letterSpacing: '-0.01em' }}>
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            Object.entries(groups).map(([group, cmds]) => (
              <div key={group}>
                <div style={{
                  padding: '6px 10px 4px',
                  fontSize: '10px', fontWeight: 600,
                  letterSpacing: '0.07em', textTransform: 'uppercase',
                  color: 'rgba(10,10,10,0.3)',
                }}>
                  {group}
                </div>
                {cmds.map(cmd => {
                  const idx = flat.indexOf(cmd)
                  const active = idx === activeIdx
                  return (
                    <div
                      key={cmd.id}
                      data-idx={idx}
                      onClick={() => select(cmd)}
                      onMouseMove={() => setActive(idx)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '7px 10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: active ? 'rgba(10,10,10,0.05)' : 'transparent',
                        transition: 'background 80ms ease',
                      }}
                    >
                      <span style={{
                        width: '22px', textAlign: 'center', fontSize: '13px', flexShrink: 0,
                        color: active ? '#0a0a0a' : 'rgba(10,10,10,0.45)',
                        transition: 'color 80ms ease',
                      }}>
                        {cmd.icon}
                      </span>
                      <span style={{
                        flex: 1, fontSize: '13px', fontWeight: 500,
                        color: '#0a0a0a', letterSpacing: '-0.01em',
                      }}>
                        {cmd.label}
                      </span>
                      {cmd.shortcut && (
                        <span style={{
                          fontSize: '11px', fontWeight: 500,
                          color: 'rgba(10,10,10,0.3)',
                          letterSpacing: '0.03em', whiteSpace: 'nowrap',
                        }}>
                          {cmd.shortcut}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div style={{
          borderTop: '1px solid rgba(10,10,10,0.06)',
          padding: '8px 14px',
          display: 'flex', gap: '14px', alignItems: 'center',
        }}>
          {([['↑↓', 'navigate'], ['↵', 'select'], ['esc', 'close']] as [string, string][]).map(([key, label]) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'rgba(10,10,10,0.35)', fontWeight: 500 }}>
              <kbd style={{
                background: 'rgba(10,10,10,0.05)',
                border: '1px solid rgba(10,10,10,0.1)',
                borderRadius: '4px', padding: '1px 5px',
                fontSize: '10px', fontFamily: 'inherit',
                color: 'rgba(10,10,10,0.45)',
              }}>{key}</kbd>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Demo Wrapper ─────────────────────────────────────────────────────────────

function Demo() {
  const [open, setOpen]           = useState(false)
  const [lastCmd, setLastCmd]     = useState<string | null>(null)
  const [flash, setFlash]         = useState(false)

  // Global ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleSelect = (cmd: Command) => {
    setOpen(false)
    setLastCmd(cmd.label)
    setFlash(true)
    setTimeout(() => setFlash(false), 1200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 16px',
          background: '#ffffff',
          border: '1px solid rgba(10,10,10,0.1)',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '13px', fontWeight: 500,
          color: '#0a0a0a', letterSpacing: '-0.01em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)',
          transition: 'box-shadow 150ms ease, transform 100ms ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)')}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <svg width="13" height="13" viewBox="0 0 15 15" fill="none" style={{ color: 'rgba(10,10,10,0.45)' }}>
          <path d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM9.5 10.207l3.146 3.147a.5.5 0 0 0 .708-.708L10.207 9.5A4.5 4.5 0 1 0 9.5 10.207Z" fill="currentColor" />
        </svg>
        Open Command Palette
        <span style={{
          display: 'flex', gap: '3px', alignItems: 'center',
          marginLeft: '4px',
        }}>
          <kbd style={{ background: 'rgba(10,10,10,0.06)', border: '1px solid rgba(10,10,10,0.1)', borderRadius: '4px', padding: '1px 5px', fontSize: '10px', fontWeight: 600, color: 'rgba(10,10,10,0.45)', fontFamily: 'inherit' }}>⌘</kbd>
          <kbd style={{ background: 'rgba(10,10,10,0.06)', border: '1px solid rgba(10,10,10,0.1)', borderRadius: '4px', padding: '1px 5px', fontSize: '10px', fontWeight: 600, color: 'rgba(10,10,10,0.45)', fontFamily: 'inherit' }}>K</kbd>
        </span>
      </button>

      {/* Last selected feedback */}
      <div style={{
        height: '28px',
        display: 'flex', alignItems: 'center',
        opacity: lastCmd ? 1 : 0,
        transform: flash ? 'translateY(0)' : 'translateY(4px)',
        transition: 'opacity 250ms ease, transform 250ms ease',
      }}>
        {lastCmd && (
          <span style={{
            fontSize: '12px', fontWeight: 500,
            color: 'rgba(10,10,10,0.45)',
            letterSpacing: '-0.01em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          }}>
            Ran &ldquo;<span style={{ color: '#0a0a0a' }}>{lastCmd}</span>&rdquo;
          </span>
        )}
      </div>

      {open && (
        <CommandPalette
          onClose={() => setOpen(false)}
          onSelect={handleSelect}
        />
      )}
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Command {
  id: string
  label: string
  group: string
  shortcut?: string
  icon: string
}

const COMMANDS: Command[] = [
  { id: 'home',      label: 'Go to Home',        group: 'Navigation', icon: '⌂', shortcut: 'G H' },
  { id: 'lab',       label: 'Go to Lab',          group: 'Navigation', icon: '⚗', shortcut: 'G L' },
  { id: 'about',     label: 'Go to About',        group: 'Navigation', icon: '◉', shortcut: 'G A' },
  { id: 'copy-link', label: 'Copy Link',          group: 'Actions',    icon: '⎘', shortcut: '⌘ ⇧ C' },
  { id: 'share',     label: 'Share Page',         group: 'Actions',    icon: '↗' },
  { id: 'new-doc',   label: 'New Document',       group: 'Actions',    icon: '+', shortcut: '⌘ N' },
  { id: 'theme',     label: 'Toggle Theme',       group: 'Settings',   icon: '◑', shortcut: '⌘ ⇧ L' },
  { id: 'settings',  label: 'Open Settings',      group: 'Settings',   icon: '⚙', shortcut: '⌘ ,' },
  { id: 'shortcuts', label: 'Keyboard Shortcuts', group: 'Settings',   icon: '⌨', shortcut: '⌘ /' },
]

function CommandPalette({ onClose, onSelect }: {
  onClose: () => void
  onSelect: (cmd: Command) => void
}) {
  const [query, setQuery]     = useState('')
  const [activeIdx, setActive] = useState(0)
  const [mounted, setMounted]  = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 16)
    inputRef.current?.focus()
    return () => clearTimeout(id)
  }, [])

  const filtered = query.trim()
    ? COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase().trim()))
    : COMMANDS

  const groups = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    ;(acc[cmd.group] ??= []).push(cmd)
    return acc
  }, {})

  const flat = Object.values(groups).flat()

  useEffect(() => { setActive(0) }, [query])

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(\`[data-idx="\${activeIdx}"]\`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  const close = useCallback(() => {
    setMounted(false)
    setTimeout(onClose, 200)
  }, [onClose])

  const select = useCallback((cmd: Command) => {
    setMounted(false)
    setTimeout(() => onSelect(cmd), 150)
  }, [onSelect])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown')       { e.preventDefault(); setActive(i => (i + 1) % Math.max(flat.length, 1)) }
    else if (e.key === 'ArrowUp')    { e.preventDefault(); setActive(i => (i - 1 + Math.max(flat.length, 1)) % Math.max(flat.length, 1)) }
    else if (e.key === 'Enter' && flat[activeIdx]) select(flat[activeIdx])
    else if (e.key === 'Escape')     close()
  }

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed', inset: 0,
        background: mounted ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0)',
        backdropFilter: mounted ? 'blur(6px)' : 'blur(0px)',
        WebkitBackdropFilter: mounted ? 'blur(6px)' : 'blur(0px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '14vh',
        transition: 'background 200ms ease, backdrop-filter 200ms ease',
        zIndex: 1000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        onKeyDown={onKeyDown}
        style={{
          width: '480px',
          maxWidth: 'calc(100vw - 32px)',
          background: '#ffffff',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: '14px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          transform: mounted ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(-10px)',
          opacity: mounted ? 1 : 0,
          transition: 'transform 220ms cubic-bezier(0.32, 0.72, 0, 1), opacity 220ms ease',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* Search row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, color: 'rgba(10,10,10,0.35)' }}>
            <path d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM9.5 10.207l3.146 3.147a.5.5 0 0 0 .708-.708L10.207 9.5A4.5 4.5 0 1 0 9.5 10.207Z" fill="currentColor" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search commands…"
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', fontWeight: 500, color: '#0a0a0a', background: 'transparent', letterSpacing: '-0.01em', fontFamily: 'inherit' }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus() }}
              style={{ background: 'rgba(10,10,10,0.06)', border: 'none', cursor: 'pointer', padding: '2px 7px', borderRadius: '5px', color: 'rgba(10,10,10,0.45)', fontSize: '11px', fontWeight: 600, fontFamily: 'inherit' }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Results */}
        <div ref={listRef} style={{ maxHeight: '308px', overflowY: 'auto', padding: '6px' }}>
          {flat.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'rgba(10,10,10,0.4)', fontSize: '13px', fontWeight: 500, letterSpacing: '-0.01em' }}>
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : Object.entries(groups).map(([group, cmds]) => (
            <div key={group}>
              <div style={{ padding: '6px 10px 4px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.3)' }}>
                {group}
              </div>
              {cmds.map(cmd => {
                const idx = flat.indexOf(cmd)
                const active = idx === activeIdx
                return (
                  <div
                    key={cmd.id}
                    data-idx={idx}
                    onClick={() => select(cmd)}
                    onMouseMove={() => setActive(idx)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '7px 10px', borderRadius: '8px', cursor: 'pointer',
                      background: active ? 'rgba(10,10,10,0.05)' : 'transparent',
                      transition: 'background 80ms ease',
                    }}
                  >
                    <span style={{ width: '22px', textAlign: 'center', fontSize: '13px', flexShrink: 0, color: active ? '#0a0a0a' : 'rgba(10,10,10,0.45)', transition: 'color 80ms ease' }}>
                      {cmd.icon}
                    </span>
                    <span style={{ flex: 1, fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                      {cmd.label}
                    </span>
                    {cmd.shortcut && (
                      <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.3)', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
                        {cmd.shortcut}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid rgba(10,10,10,0.06)', padding: '8px 14px', display: 'flex', gap: '14px', alignItems: 'center' }}>
          {([['↑↓', 'navigate'], ['↵', 'select'], ['esc', 'close']] as [string, string][]).map(([key, label]) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'rgba(10,10,10,0.35)', fontWeight: 500 }}>
              <kbd style={{ background: 'rgba(10,10,10,0.05)', border: '1px solid rgba(10,10,10,0.1)', borderRadius: '4px', padding: '1px 5px', fontSize: '10px', fontFamily: 'inherit', color: 'rgba(10,10,10,0.45)' }}>{key}</kbd>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Usage ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [open, setOpen]       = useState(false)
  const [lastCmd, setLastCmd] = useState<string | null>(null)

  // ⌘K / Ctrl+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Command Palette ⌘K</button>
      {lastCmd && <p>Ran: {lastCmd}</p>}
      {open && (
        <CommandPalette
          onClose={() => setOpen(false)}
          onSelect={cmd => { setLastCmd(cmd.label); setOpen(false) }}
        />
      )}
    </>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommandPalettePage() {
  return (
    <main style={{ backgroundColor: 'var(--bg, #ffffff)', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: '12px',
      }}>
        <Demo />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted, rgba(10,10,10,0.4))', marginBottom: '12px' }}>
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
