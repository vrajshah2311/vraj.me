'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Command {
  id: string
  label: string
  description?: string
  icon: string
  group: string
  shortcut?: string[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const COMMANDS: Command[] = [
  { id: 'home',          label: 'Go to Home',               icon: '⌂', group: 'Navigate',  shortcut: ['G', 'H'] },
  { id: 'about',         label: 'Go to About',              icon: '○', group: 'Navigate' },
  { id: 'projects',      label: 'View Projects',            icon: '◈', group: 'Navigate' },
  { id: 'lab',           label: 'Open Lab',                 icon: '◉', group: 'Navigate' },
  { id: 'new-file',      label: 'New File',                 icon: '+', group: 'Actions',   shortcut: ['⌘', 'N'] },
  { id: 'duplicate',     label: 'Duplicate',                icon: '⊕', group: 'Actions',   shortcut: ['⌘', 'D'] },
  { id: 'copy-link',     label: 'Copy Link to Clipboard',   icon: '⌁', group: 'Actions',   shortcut: ['⌘', 'L'] },
  { id: 'share',         label: 'Share',                    icon: '↗', group: 'Actions' },
  { id: 'dark-mode',     label: 'Toggle Dark Mode',         icon: '◑', group: 'Settings' },
  { id: 'notifications', label: 'Notification Preferences', icon: '◎', group: 'Settings' },
  { id: 'shortcuts',     label: 'View All Shortcuts',       icon: '⌨', group: 'Settings',  shortcut: ['?'] },
  { id: 'logout',        label: 'Sign Out',                 icon: '→', group: 'Settings' },
]

// ─── Kbd ──────────────────────────────────────────────────────────────────────

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

function Kbd({ children, onClick }: { children: string; onClick?: () => void }) {
  return (
    <kbd
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '2px 5px', borderRadius: '5px',
        background: 'rgba(10,10,10,0.05)', border: '1px solid rgba(10,10,10,0.1)',
        fontSize: '11px', fontWeight: 600, color: 'rgba(10,10,10,0.5)',
        fontFamily: FONT, lineHeight: '1.4',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      {children}
    </kbd>
  )
}

// ─── CommandPalette ───────────────────────────────────────────────────────────

function CommandPalette() {
  const [open, setOpen]           = useState(false)
  const [visible, setVisible]     = useState(false)
  const [query, setQuery]         = useState('')
  const [activeIndex, setActive]  = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef  = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return COMMANDS
    const q = query.toLowerCase()
    return COMMANDS.filter(c =>
      c.label.toLowerCase().includes(q) ||
      c.group.toLowerCase().includes(q) ||
      (c.description?.toLowerCase() ?? '').includes(q)
    )
  }, [query])

  const groups = useMemo(() => {
    const map = new Map<string, Command[]>()
    filtered.forEach(c => {
      if (!map.has(c.group)) map.set(c.group, [])
      map.get(c.group)!.push(c)
    })
    return map
  }, [filtered])

  const handleOpen = useCallback(() => {
    setOpen(true)
    setQuery('')
    setActive(0)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setVisible(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      })
    )
  }, [])

  const handleClose = useCallback(() => {
    setVisible(false)
    setTimeout(() => { setOpen(false); setQuery(''); setActive(0) }, 210)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        visible ? handleClose() : handleOpen()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, handleOpen, handleClose])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { handleClose(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && filtered[activeIndex]) { e.preventDefault(); handleClose() }
  }

  useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.querySelector('[data-active="true"]') as HTMLElement
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  useEffect(() => { setActive(0) }, [query])

  return (
    <>
      {/* ── Trigger ── */}
      <button
        onClick={handleOpen}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 14px',
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.12)',
          borderRadius: '10px', cursor: 'pointer',
          fontFamily: FONT,
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
          transition: 'border-color 150ms ease',
          outline: 'none', minWidth: '260px',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,10,10,0.22)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,10,10,0.12)' }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{ color: 'rgba(10,10,10,0.35)', flexShrink: 0 }}>
          <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ flex: 1, textAlign: 'left', fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.38)', letterSpacing: '-0.01em' }}>
          Search commands...
        </span>
        <span style={{ display: 'flex', gap: '3px' }}>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>

      {/* ── Overlay ── */}
      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) handleClose() }}
          style={{
            position: 'fixed', inset: 0,
            background: visible ? 'rgba(0,0,0,0.32)' : 'rgba(0,0,0,0)',
            backdropFilter: visible ? 'blur(6px)' : 'blur(0px)',
            zIndex: 9999,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: '15vh',
            transition: 'background 200ms ease, backdrop-filter 200ms ease',
          }}
        >
          <div
            onKeyDown={handleKeyDown}
            style={{
              width: '480px', maxWidth: 'calc(100vw - 32px)',
              background: '#fff',
              borderRadius: '14px',
              border: '1px solid rgba(10,10,10,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
              overflow: 'hidden', fontFamily: FONT,
              transform: visible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(-12px)',
              opacity: visible ? 1 : 0,
              transition: 'transform 200ms cubic-bezier(0.32, 0.72, 0, 1), opacity 200ms ease',
            }}
          >
            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px',
              borderBottom: '1px solid rgba(10,10,10,0.06)',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                style={{ color: 'rgba(10,10,10,0.35)', flexShrink: 0 }}>
                <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search commands..."
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontSize: '14px', fontWeight: 500,
                  color: '#0a0a0a', letterSpacing: '-0.01em',
                  background: 'transparent', fontFamily: FONT,
                }}
              />
              <Kbd onClick={handleClose}>Esc</Kbd>
            </div>

            {/* Results */}
            <div ref={listRef} style={{ maxHeight: '340px', overflowY: 'auto', padding: '6px' }}>
              {filtered.length === 0 ? (
                <div style={{
                  padding: '32px 0', textAlign: 'center',
                  fontSize: '13px', color: 'rgba(10,10,10,0.35)', fontWeight: 500,
                }}>
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                Array.from(groups.entries()).map(([group, cmds], gi) => (
                  <div key={group} style={{ marginTop: gi > 0 ? '4px' : 0 }}>
                    <div style={{
                      padding: '6px 10px 4px',
                      fontSize: '10px', fontWeight: 700,
                      letterSpacing: '0.07em', textTransform: 'uppercase',
                      color: 'rgba(10,10,10,0.3)',
                    }}>
                      {group}
                    </div>
                    {cmds.map(cmd => {
                      const idx = filtered.indexOf(cmd)
                      const isActive = activeIndex === idx
                      return (
                        <button
                          key={cmd.id}
                          data-active={String(isActive)}
                          onClick={() => handleClose()}
                          onMouseEnter={() => setActive(idx)}
                          style={{
                            width: '100%',
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '8px 10px',
                            background: isActive ? 'rgba(10,10,10,0.05)' : 'transparent',
                            border: 'none', borderRadius: '8px',
                            cursor: 'pointer', textAlign: 'left',
                            boxSizing: 'border-box',
                            transition: 'background 80ms ease',
                            fontFamily: FONT,
                          }}
                        >
                          <span style={{
                            width: '28px', height: '28px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '7px',
                            background: isActive ? 'rgba(10,10,10,0.07)' : 'rgba(10,10,10,0.04)',
                            border: '1px solid rgba(10,10,10,0.07)',
                            fontSize: '13px', color: '#0a0a0a',
                            flexShrink: 0, transition: 'background 80ms ease',
                          }}>
                            {cmd.icon}
                          </span>
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span style={{
                              display: 'block',
                              fontSize: '13px', fontWeight: 500,
                              color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: '18px',
                            }}>
                              {cmd.label}
                            </span>
                            {cmd.description && (
                              <span style={{
                                display: 'block', fontSize: '11px', fontWeight: 500,
                                color: 'rgba(10,10,10,0.4)',
                                letterSpacing: '-0.01em', lineHeight: '15px',
                              }}>
                                {cmd.description}
                              </span>
                            )}
                          </span>
                          {cmd.shortcut && (
                            <span style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                              {cmd.shortcut.map(k => <Kbd key={k}>{k}</Kbd>)}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '8px 14px',
              borderTop: '1px solid rgba(10,10,10,0.06)',
              display: 'flex', gap: '14px', alignItems: 'center',
            }}>
              {[
                { keys: ['↑', '↓'], label: 'Navigate' },
                { keys: ['↵'],      label: 'Select' },
                { keys: ['Esc'],    label: 'Dismiss' },
              ].map(({ keys, label }) => (
                <span key={label} style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontSize: '11px', color: 'rgba(10,10,10,0.4)', fontWeight: 500,
                }}>
                  {keys.map(k => (
                    <kbd key={k} style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      padding: '1px 4px', borderRadius: '3px',
                      background: 'rgba(10,10,10,0.04)', border: '1px solid rgba(10,10,10,0.08)',
                      fontSize: '10px', fontWeight: 600, color: 'rgba(10,10,10,0.45)',
                      fontFamily: FONT, lineHeight: '1.6',
                    }}>
                      {k}
                    </kbd>
                  ))}
                  <span>{label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

interface Command {
  id: string
  label: string
  description?: string
  icon: string
  group: string
  shortcut?: string[]
}

const COMMANDS: Command[] = [
  { id: 'home',          label: 'Go to Home',               icon: '⌂', group: 'Navigate',  shortcut: ['G', 'H'] },
  { id: 'about',         label: 'Go to About',              icon: '○', group: 'Navigate' },
  { id: 'projects',      label: 'View Projects',            icon: '◈', group: 'Navigate' },
  { id: 'lab',           label: 'Open Lab',                 icon: '◉', group: 'Navigate' },
  { id: 'new-file',      label: 'New File',                 icon: '+', group: 'Actions',   shortcut: ['⌘', 'N'] },
  { id: 'duplicate',     label: 'Duplicate',                icon: '⊕', group: 'Actions',   shortcut: ['⌘', 'D'] },
  { id: 'copy-link',     label: 'Copy Link to Clipboard',   icon: '⌁', group: 'Actions',   shortcut: ['⌘', 'L'] },
  { id: 'share',         label: 'Share',                    icon: '↗', group: 'Actions' },
  { id: 'dark-mode',     label: 'Toggle Dark Mode',         icon: '◑', group: 'Settings' },
  { id: 'notifications', label: 'Notification Preferences', icon: '◎', group: 'Settings' },
  { id: 'shortcuts',     label: 'View All Shortcuts',       icon: '⌨', group: 'Settings',  shortcut: ['?'] },
  { id: 'logout',        label: 'Sign Out',                 icon: '→', group: 'Settings' },
]

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

function Kbd({ children, onClick }: { children: string; onClick?: () => void }) {
  return (
    <kbd onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: '2px 5px', borderRadius: '5px',
      background: 'rgba(10,10,10,0.05)', border: '1px solid rgba(10,10,10,0.1)',
      fontSize: '11px', fontWeight: 600, color: 'rgba(10,10,10,0.5)',
      fontFamily: FONT, lineHeight: '1.4',
      cursor: onClick ? 'pointer' : 'default', userSelect: 'none',
    }}>
      {children}
    </kbd>
  )
}

export function CommandPalette() {
  const [open, setOpen]          = useState(false)
  const [visible, setVisible]    = useState(false)
  const [query, setQuery]        = useState('')
  const [activeIndex, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef  = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return COMMANDS
    const q = query.toLowerCase()
    return COMMANDS.filter(c =>
      c.label.toLowerCase().includes(q) ||
      c.group.toLowerCase().includes(q) ||
      (c.description?.toLowerCase() ?? '').includes(q)
    )
  }, [query])

  const groups = useMemo(() => {
    const map = new Map<string, Command[]>()
    filtered.forEach(c => {
      if (!map.has(c.group)) map.set(c.group, [])
      map.get(c.group)!.push(c)
    })
    return map
  }, [filtered])

  const handleOpen = useCallback(() => {
    setOpen(true); setQuery(''); setActive(0)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setVisible(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      })
    )
  }, [])

  const handleClose = useCallback(() => {
    setVisible(false)
    setTimeout(() => { setOpen(false); setQuery(''); setActive(0) }, 210)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        visible ? handleClose() : handleOpen()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, handleOpen, handleClose])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { handleClose(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && filtered[activeIndex]) { e.preventDefault(); handleClose() }
  }

  useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.querySelector('[data-active="true"]') as HTMLElement
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  useEffect(() => { setActive(0) }, [query])

  return (
    <>
      <button
        onClick={handleOpen}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 14px', background: '#fff',
          border: '1px solid rgba(10,10,10,0.12)', borderRadius: '10px',
          cursor: 'pointer', fontFamily: FONT,
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
          transition: 'border-color 150ms ease', outline: 'none', minWidth: '260px',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,10,10,0.22)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,10,10,0.12)' }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: 'rgba(10,10,10,0.35)', flexShrink: 0 }}>
          <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ flex: 1, textAlign: 'left', fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.38)', letterSpacing: '-0.01em' }}>
          Search commands...
        </span>
        <span style={{ display: 'flex', gap: '3px' }}><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
      </button>

      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) handleClose() }}
          style={{
            position: 'fixed', inset: 0,
            background: visible ? 'rgba(0,0,0,0.32)' : 'rgba(0,0,0,0)',
            backdropFilter: visible ? 'blur(6px)' : 'blur(0px)',
            zIndex: 9999,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: '15vh',
            transition: 'background 200ms ease, backdrop-filter 200ms ease',
          }}
        >
          <div
            onKeyDown={handleKeyDown}
            style={{
              width: '480px', maxWidth: 'calc(100vw - 32px)',
              background: '#fff', borderRadius: '14px',
              border: '1px solid rgba(10,10,10,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
              overflow: 'hidden', fontFamily: FONT,
              transform: visible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(-12px)',
              opacity: visible ? 1 : 0,
              transition: 'transform 200ms cubic-bezier(0.32, 0.72, 0, 1), opacity 200ms ease',
            }}
          >
            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'rgba(10,10,10,0.35)', flexShrink: 0 }}>
                <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef} value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search commands..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', background: 'transparent', fontFamily: FONT }}
              />
              <Kbd onClick={handleClose}>Esc</Kbd>
            </div>

            {/* Results */}
            <div ref={listRef} style={{ maxHeight: '340px', overflowY: 'auto', padding: '6px' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '32px 0', textAlign: 'center', fontSize: '13px', color: 'rgba(10,10,10,0.35)', fontWeight: 500 }}>
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                Array.from(groups.entries()).map(([group, cmds], gi) => (
                  <div key={group} style={{ marginTop: gi > 0 ? '4px' : 0 }}>
                    <div style={{ padding: '6px 10px 4px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.3)' }}>
                      {group}
                    </div>
                    {cmds.map(cmd => {
                      const idx = filtered.indexOf(cmd)
                      const isActive = activeIndex === idx
                      return (
                        <button
                          key={cmd.id}
                          data-active={String(isActive)}
                          onClick={() => handleClose()}
                          onMouseEnter={() => setActive(idx)}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '8px 10px',
                            background: isActive ? 'rgba(10,10,10,0.05)' : 'transparent',
                            border: 'none', borderRadius: '8px', cursor: 'pointer',
                            textAlign: 'left', boxSizing: 'border-box',
                            transition: 'background 80ms ease', fontFamily: FONT,
                          }}
                        >
                          <span style={{
                            width: '28px', height: '28px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '7px',
                            background: isActive ? 'rgba(10,10,10,0.07)' : 'rgba(10,10,10,0.04)',
                            border: '1px solid rgba(10,10,10,0.07)',
                            fontSize: '13px', color: '#0a0a0a',
                            flexShrink: 0, transition: 'background 80ms ease',
                          }}>
                            {cmd.icon}
                          </span>
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: '18px' }}>
                              {cmd.label}
                            </span>
                            {cmd.description && (
                              <span style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em', lineHeight: '15px' }}>
                                {cmd.description}
                              </span>
                            )}
                          </span>
                          {cmd.shortcut && (
                            <span style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                              {cmd.shortcut.map(k => <Kbd key={k}>{k}</Kbd>)}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(10,10,10,0.06)', display: 'flex', gap: '14px', alignItems: 'center' }}>
              {[
                { keys: ['↑', '↓'], label: 'Navigate' },
                { keys: ['↵'],      label: 'Select' },
                { keys: ['Esc'],    label: 'Dismiss' },
              ].map(({ keys, label }) => (
                <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'rgba(10,10,10,0.4)', fontWeight: 500 }}>
                  {keys.map(k => (
                    <kbd key={k} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '1px 4px', borderRadius: '3px', background: 'rgba(10,10,10,0.04)', border: '1px solid rgba(10,10,10,0.08)', fontSize: '10px', fontWeight: 600, color: 'rgba(10,10,10,0.45)', fontFamily: FONT, lineHeight: '1.6' }}>
                      {k}
                    </kbd>
                  ))}
                  <span>{label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommandPalettePage() {
  return (
    <main style={{ backgroundColor: 'var(--bg, #ffffff)', minHeight: '100vh', fontFamily: FONT }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '60vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px', gap: '20px',
      }}>
        <CommandPalette />
        <p style={{
          margin: 0, fontSize: '12px',
          color: 'rgba(0,0,0,0.35)', fontWeight: 500, letterSpacing: '-0.01em',
          fontFamily: FONT,
        }}>
          Click to open · or press ⌘K · type to filter · ↑↓ navigate · Enter select
        </p>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'var(--text-muted, rgba(10,10,10,0.4))', marginBottom: '12px',
        }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
          <pre style={{
            margin: 0,
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
            fontSize: '12px', lineHeight: '1.65',
            color: '#e5e5e5', whiteSpace: 'pre', overflowX: 'auto',
          }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
