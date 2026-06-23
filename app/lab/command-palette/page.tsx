'use client'

import { useState, useEffect, useRef } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type Item = { id: string; group: string; label: string; kbd: string | null }

const ITEMS: Item[] = [
  { id: 'home',    group: 'Navigation', label: 'Go to Home',       kbd: null    },
  { id: 'about',   group: 'Navigation', label: 'Go to About',      kbd: null    },
  { id: 'work',    group: 'Navigation', label: 'Go to Work',       kbd: null    },
  { id: 'lab',     group: 'Navigation', label: 'Go to Lab',        kbd: null    },
  { id: 'copy',    group: 'Actions',    label: 'Copy Link',        kbd: '⌘ C'  },
  { id: 'share',   group: 'Actions',    label: 'Share Page',       kbd: null    },
  { id: 'new',     group: 'Actions',    label: 'New Document',     kbd: '⌘ N'  },
  { id: 'theme',   group: 'Actions',    label: 'Toggle Theme',     kbd: '⌘ .'  },
  { id: 'github',  group: 'Links',      label: 'GitHub Profile',   kbd: null    },
  { id: 'twitter', group: 'Links',      label: 'Twitter / X',      kbd: null    },
  { id: 'resume',  group: 'Links',      label: 'View Resume',      kbd: null    },
]

// Demo version — uses position:absolute within a bounded stage
function CommandPaletteDemo({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      setQuery('')
      setActiveIdx(0)
      setTimeout(() => inputRef.current?.focus(), 40)
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), 200)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => { setActiveIdx(0) }, [query])

  const filtered = query.trim()
    ? ITEMS.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : ITEMS

  const groups = Array.from(new Set(filtered.map(i => i.group))).map(g => ({
    label: g,
    items: filtered.filter(i => i.group === g),
  }))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && filtered[activeIdx]) { onClose() }
  }

  if (!mounted) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 20,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: 56,
        background: visible ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0)',
        backdropFilter: visible ? 'blur(5px)' : 'blur(0px)',
        WebkitBackdropFilter: visible ? 'blur(5px)' : 'blur(0px)',
        transition: 'background 0.18s ease, backdrop-filter 0.18s ease',
        borderRadius: 'inherit',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        style={{
          width: 520, maxWidth: 'calc(100% - 48px)',
          background: '#fff',
          borderRadius: 14,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.03), 0 20px 48px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.03)',
          overflow: 'hidden',
          fontFamily: font,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(-8px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s ease',
        }}
      >
        {/* Input row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '11px 14px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="6.5" cy="6.5" r="4" stroke="rgba(0,0,0,0.35)" strokeWidth="1.3" />
            <path d="M10 10L12.5 12.5" stroke="rgba(0,0,0,0.35)" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search or jump to..."
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 14, fontWeight: 500,
              color: '#0a0a0a', background: 'transparent',
              letterSpacing: '-0.01em', fontFamily: 'inherit',
            }}
          />
          <kbd style={{
            fontSize: 11, color: 'rgba(0,0,0,0.38)',
            background: 'rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 5, padding: '2px 6px',
            fontFamily: 'inherit', lineHeight: 1.5, cursor: 'default',
          }}>esc</kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 280, overflowY: 'auto', padding: '5px 0', scrollbarWidth: 'none' }}>
          <style>{`div::-webkit-scrollbar{display:none}`}</style>
          {filtered.length === 0 ? (
            <div style={{
              padding: '28px', textAlign: 'center' as const,
              fontSize: 13, color: 'rgba(0,0,0,0.38)', fontWeight: 500,
            }}>
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : groups.map(group => (
            <div key={group.label}>
              <div style={{
                padding: '6px 14px 3px',
                fontSize: 11, fontWeight: 600,
                color: 'rgba(0,0,0,0.32)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
              }}>
                {group.label}
              </div>
              {group.items.map(item => {
                const globalIdx = filtered.indexOf(item)
                const active = globalIdx === activeIdx
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '7px 14px', cursor: 'pointer',
                      background: active ? 'rgba(0,0,0,0.04)' : 'transparent',
                      transition: 'background 0.08s ease',
                    }}
                    onMouseEnter={() => setActiveIdx(globalIdx)}
                    onClick={onClose}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                      {item.label}
                    </span>
                    {item.kbd && (
                      <kbd style={{
                        fontSize: 11, color: 'rgba(0,0,0,0.38)',
                        background: 'rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: 5, padding: '2px 6px',
                        fontFamily: 'inherit',
                      }}>
                        {item.kbd}
                      </kbd>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '8px 14px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.32)',
          letterSpacing: '-0.01em',
        }}>
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  )
}

function Demo() {
  const [open, setOpen] = useState(true)
  const stageRef = useRef<HTMLDivElement>(null)

  // ⌘K on the page opens/closes the palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
      padding: '40px 24px',
      fontFamily: font,
    }}>
      {/* Stage */}
      <div
        ref={stageRef}
        style={{
          position: 'relative',
          width: 680, height: 460,
          background: '#fff',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Mock app header */}
        <div style={{
          height: 48, padding: '0 16px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#fff', zIndex: 10, position: 'relative',
        }}>
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <div style={{ flex: 1 }} />
          {/* Search trigger */}
          <button
            onClick={() => setOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '5px 10px', borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.09)',
              background: 'rgba(0,0,0,0.03)',
              cursor: 'pointer', fontSize: 12, fontWeight: 500,
              color: 'rgba(0,0,0,0.38)', letterSpacing: '-0.01em',
              fontFamily: font,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 8L10.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Search...
            <kbd style={{
              fontSize: 10, color: 'rgba(0,0,0,0.32)',
              padding: '1px 5px', borderRadius: 4,
              border: '1px solid rgba(0,0,0,0.1)',
              background: 'rgba(0,0,0,0.04)',
              fontFamily: 'inherit',
            }}>⌘K</kbd>
          </button>
          <div style={{ flex: 1 }} />
          {/* Nav dots */}
          {['Home', 'About', 'Work'].map(label => (
            <span key={label} style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.35)', letterSpacing: '-0.01em' }}>
              {label}
            </span>
          ))}
        </div>

        {/* Mock content */}
        <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Hero row */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ height: 80, flex: 2, background: 'rgba(0,0,0,0.04)', borderRadius: 10 }} />
            <div style={{ height: 80, flex: 1, background: 'rgba(0,0,0,0.03)', borderRadius: 10 }} />
          </div>
          {/* Card row */}
          <div style={{ display: 'flex', gap: 12 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                flex: 1, height: 90,
                background: 'rgba(0,0,0,0.03)',
                borderRadius: 10,
                border: '1px solid rgba(0,0,0,0.05)',
                padding: 12,
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <div style={{ height: 10, width: '60%', background: 'rgba(0,0,0,0.07)', borderRadius: 4 }} />
                <div style={{ height: 8, width: '80%', background: 'rgba(0,0,0,0.04)', borderRadius: 4 }} />
                <div style={{ height: 8, width: '45%', background: 'rgba(0,0,0,0.04)', borderRadius: 4 }} />
              </div>
            ))}
          </div>
          {/* List rows */}
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              height: 36,
              background: 'rgba(0,0,0,0.02)',
              borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10,
            }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,0,0,0.06)' }} />
              <div style={{ height: 8, width: `${40 + i * 12}%`, background: 'rgba(0,0,0,0.05)', borderRadius: 4 }} />
              <div style={{ flex: 1 }} />
              <div style={{ height: 8, width: 40, background: 'rgba(0,0,0,0.04)', borderRadius: 4 }} />
            </div>
          ))}
        </div>

        {/* Palette overlay (absolute within stage) */}
        <CommandPaletteDemo open={open} onClose={() => setOpen(false)} />
      </div>

      {/* Re-open hint */}
      <div style={{
        marginTop: 16,
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.38)',
        letterSpacing: '-0.01em',
        opacity: open ? 0 : 1,
        transition: 'opacity 0.2s ease',
      }}>
        <span>Press</span>
        <kbd style={{
          fontSize: 11, color: 'rgba(0,0,0,0.38)',
          background: 'rgba(0,0,0,0.07)',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: 5, padding: '2px 7px',
          fontFamily: font,
        }}>⌘K</kbd>
        <span>or click Search to re-open</span>
      </div>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: '5px 12px',
        background: copied ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 7,
        color: copied ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
        fontSize: 12, fontWeight: 500,
        cursor: 'pointer', fontFamily: font,
        letterSpacing: '-0.01em',
        transition: 'background 0.15s ease, color 0.15s ease',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

const CODE_SOURCE = `'use client'

import { useState, useEffect, useRef } from 'react'

type Item = { id: string; group: string; label: string; kbd: string | null }

const ITEMS: Item[] = [
  { id: 'home',    group: 'Navigation', label: 'Go to Home',       kbd: null   },
  { id: 'about',   group: 'Navigation', label: 'Go to About',      kbd: null   },
  { id: 'work',    group: 'Navigation', label: 'Go to Work',       kbd: null   },
  { id: 'lab',     group: 'Navigation', label: 'Go to Lab',        kbd: null   },
  { id: 'copy',    group: 'Actions',    label: 'Copy Link',        kbd: '⌘ C' },
  { id: 'share',   group: 'Actions',    label: 'Share Page',       kbd: null   },
  { id: 'new',     group: 'Actions',    label: 'New Document',     kbd: '⌘ N' },
  { id: 'theme',   group: 'Actions',    label: 'Toggle Theme',     kbd: '⌘ .' },
  { id: 'github',  group: 'Links',      label: 'GitHub Profile',   kbd: null   },
  { id: 'twitter', group: 'Links',      label: 'Twitter / X',      kbd: null   },
  { id: 'resume',  group: 'Links',      label: 'View Resume',      kbd: null   },
]

function useCommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return { open, setOpen }
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      setQuery('')
      setActiveIdx(0)
      setTimeout(() => inputRef.current?.focus(), 40)
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), 200)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => { setActiveIdx(0) }, [query])

  const filtered = query.trim()
    ? ITEMS.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : ITEMS

  const groups = Array.from(new Set(filtered.map(i => i.group))).map(g => ({
    label: g,
    items: filtered.filter(i => i.group === g),
  }))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, filtered.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    }
    if (e.key === 'Enter' && filtered[activeIdx]) {
      // handle selection here
      onClose()
    }
  }

  if (!mounted) return null

  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '20vh',
        background: visible ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0)',
        backdropFilter: visible ? 'blur(5px)' : 'blur(0px)',
        WebkitBackdropFilter: visible ? 'blur(5px)' : 'blur(0px)',
        transition: 'background 0.18s ease, backdrop-filter 0.18s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        style={{
          width: 540, maxWidth: 'calc(100vw - 32px)',
          background: '#fff',
          borderRadius: 14,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.03), 0 20px 48px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.03)',
          overflow: 'hidden',
          fontFamily: font,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(-8px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s ease',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '11px 14px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="6.5" cy="6.5" r="4" stroke="rgba(0,0,0,0.35)" strokeWidth="1.3" />
            <path d="M10 10L12.5 12.5" stroke="rgba(0,0,0,0.35)" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search or jump to..."
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 14, fontWeight: 500,
              color: '#0a0a0a', background: 'transparent',
              letterSpacing: '-0.01em', fontFamily: 'inherit',
            }}
          />
          <kbd style={{
            fontSize: 11, color: 'rgba(0,0,0,0.38)',
            background: 'rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 5, padding: '2px 6px',
            fontFamily: 'inherit', lineHeight: 1.5, cursor: 'default',
          }}>esc</kbd>
        </div>

        <div style={{ maxHeight: 300, overflowY: 'auto', padding: '5px 0', scrollbarWidth: 'none' }}>
          {filtered.length === 0 ? (
            <div style={{
              padding: '28px', textAlign: 'center',
              fontSize: 13, color: 'rgba(0,0,0,0.38)', fontWeight: 500,
            }}>
              No results for "{query}"
            </div>
          ) : groups.map(group => (
            <div key={group.label}>
              <div style={{
                padding: '6px 14px 3px',
                fontSize: 11, fontWeight: 600,
                color: 'rgba(0,0,0,0.32)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                {group.label}
              </div>
              {group.items.map(item => {
                const globalIdx = filtered.indexOf(item)
                const active = globalIdx === activeIdx
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '7px 14px', cursor: 'pointer',
                      background: active ? 'rgba(0,0,0,0.04)' : 'transparent',
                      transition: 'background 0.08s ease',
                    }}
                    onMouseEnter={() => setActiveIdx(globalIdx)}
                    onClick={onClose}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                      {item.label}
                    </span>
                    {item.kbd && (
                      <kbd style={{
                        fontSize: 11, color: 'rgba(0,0,0,0.38)',
                        background: 'rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: 5, padding: '2px 6px',
                        fontFamily: 'inherit',
                      }}>
                        {item.kbd}
                      </kbd>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '8px 14px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.32)',
          letterSpacing: '-0.01em',
        }}>
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const { open, setOpen } = useCommandPalette()
  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: font }}>
      <header style={{
        height: 52, padding: '0 20px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.02em', color: '#0a0a0a' }}>
          Your App
        </span>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '5px 10px', borderRadius: 8,
            border: '1px solid rgba(0,0,0,0.09)',
            background: 'rgba(0,0,0,0.03)',
            cursor: 'pointer', fontSize: 12, fontWeight: 500,
            color: 'rgba(0,0,0,0.38)', letterSpacing: '-0.01em',
            fontFamily: 'inherit',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 8L10.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Search...
          <kbd style={{
            fontSize: 10, color: 'rgba(0,0,0,0.32)',
            padding: '1px 5px', borderRadius: 4,
            border: '1px solid rgba(0,0,0,0.1)',
            background: 'rgba(0,0,0,0.04)',
            fontFamily: 'inherit',
          }}>⌘K</kbd>
        </button>
      </header>

      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </div>
  )
}`

export default function CommandPalettePage() {
  return (
    <div style={{ background: '#fff' }}>
      {/* DEMO */}
      <Demo />

      {/* CODE */}
      <div style={{
        background: '#0a0a0a',
        padding: 'clamp(24px, 4vw, 48px)',
        fontFamily: font,
      }}>
        <div style={{
          maxWidth: 760,
          margin: '0 auto',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>
                Command Palette
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                Drop into any React project — zero dependencies
              </div>
            </div>
            <CopyButton text={CODE_SOURCE} />
          </div>

          {/* Code block */}
          <div style={{
            background: '#111',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}>
            {/* Tab bar */}
            <div style={{
              padding: '10px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontFamily: 'ui-monospace, monospace' }}>
                CommandPalette.tsx
              </div>
            </div>
            <pre style={{
              margin: 0,
              padding: '20px',
              overflowX: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
              fontSize: 12.5,
              lineHeight: 1.65,
              color: '#e5e5e5',
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
