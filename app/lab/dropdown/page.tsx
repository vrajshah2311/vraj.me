'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Option {
  value: string
  label: string
  description?: string
  icon?: string
  group?: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const OPTIONS: Option[] = [
  { value: 'figma',   label: 'Figma',   description: 'Design & prototyping',  icon: '◆', group: 'Design' },
  { value: 'framer',  label: 'Framer',  description: 'Web design platform',   icon: '◈', group: 'Design' },
  { value: 'sketch',  label: 'Sketch',  description: 'Mac design tool',       icon: '◇', group: 'Design' },
  { value: 'react',   label: 'React',   description: 'UI component library',  icon: '⬡', group: 'Development' },
  { value: 'vue',     label: 'Vue',     description: 'Progressive framework', icon: '⬢', group: 'Development' },
  { value: 'svelte',  label: 'Svelte',  description: 'Compiler framework',    icon: '⬟', group: 'Development' },
  { value: 'vercel',  label: 'Vercel',  description: 'Frontend cloud',        icon: '▲', group: 'Deployment' },
  { value: 'netlify', label: 'Netlify', description: 'Web platform',          icon: '◉', group: 'Deployment' },
]

// ─── Dropdown ─────────────────────────────────────────────────────────────────

function Dropdown({
  options = OPTIONS,
  placeholder = 'Select an option...',
}: {
  options?: Option[]
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    if (!query) return options
    const q = query.toLowerCase()
    return options.filter(o =>
      o.label.toLowerCase().includes(q) ||
      (o.description?.toLowerCase() ?? '').includes(q)
    )
  }, [query, options])

  const groups = useMemo(() => {
    const map = new Map<string, Option[]>()
    filtered.forEach(o => {
      const g = o.group ?? ''
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(o)
    })
    return map
  }, [filtered])

  const selectedOption = options.find(o => o.value === selected)

  const handleOpen = () => {
    setOpen(true)
    setQuery('')
    setActiveIndex(-1)
    setTimeout(() => searchRef.current?.focus(), 60)
  }

  const handleClose = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActiveIndex(-1)
  }, [])

  const handleSelect = (value: string) => {
    setSelected(value)
    handleClose()
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) handleClose()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open, handleClose])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { handleClose(); return }
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        handleOpen()
      }
      return
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); handleSelect(filtered[activeIndex].value) }
  }

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return
    const el = listRef.current.querySelector('[data-idx="' + activeIndex + '"]') as HTMLElement
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '280px' }}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger */}
      <button
        onClick={() => open ? handleClose() : handleOpen()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '9px 12px',
          background: '#fff',
          border: (focused || open) ? '1px solid rgba(10,10,10,0.24)' : '1px solid rgba(10,10,10,0.12)',
          borderRadius: '10px',
          cursor: 'pointer',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          boxShadow: (focused || open)
            ? '0 0 0 3px rgba(10,10,10,0.06), 0 1px 2px rgba(0,0,0,0.04)'
            : '0 1px 2px rgba(0,0,0,0.04)',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          outline: 'none',
        }}
      >
        {selectedOption ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {selectedOption.icon && (
              <span style={{ fontSize: '13px', color: '#0a0a0a' }}>{selectedOption.icon}</span>
            )}
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
              {selectedOption.label}
            </span>
          </span>
        ) : (
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.35)', letterSpacing: '-0.01em' }}>
            {placeholder}
          </span>
        )}
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 200ms cubic-bezier(0.32, 0.72, 0, 1)',
            color: 'rgba(10,10,10,0.4)',
            flexShrink: 0,
          }}
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Popover */}
      <div style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        right: 0,
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.10)',
        zIndex: 50,
        overflow: 'hidden',
        transformOrigin: 'top center',
        transform: open ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(-6px)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition: 'transform 200ms cubic-bezier(0.32, 0.72, 0, 1), opacity 180ms ease',
      }}>
        {/* Search */}
        <div style={{ padding: '8px 8px 6px', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
          <div style={{ position: 'relative' }}>
            <svg
              width="13" height="13" viewBox="0 0 13 13" fill="none"
              style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(10,10,10,0.3)', pointerEvents: 'none' }}
            >
              <circle cx="5.5" cy="5.5" r="3.75" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8.5 8.5L11 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              ref={searchRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setActiveIndex(-1) }}
              placeholder="Search..."
              style={{
                width: '100%',
                padding: '7px 10px 7px 29px',
                border: '1px solid rgba(10,10,10,0.08)',
                borderRadius: '7px',
                background: 'rgba(10,10,10,0.03)',
                fontSize: '13px',
                fontWeight: 500,
                color: '#0a0a0a',
                letterSpacing: '-0.01em',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              }}
            />
          </div>
        </div>

        {/* Options */}
        <div ref={listRef} style={{ maxHeight: '236px', overflowY: 'auto', padding: '6px' }}>
          {filtered.length === 0 ? (
            <div style={{
              padding: '20px 0',
              textAlign: 'center',
              fontSize: '13px',
              color: 'rgba(10,10,10,0.35)',
              fontWeight: 500,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
            }}>
              No results
            </div>
          ) : (
            Array.from(groups.entries()).map(([group, opts], gi) => (
              <div key={group} style={{ marginTop: gi > 0 ? '2px' : 0 }}>
                {group && (
                  <div style={{
                    padding: '6px 8px 3px',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    color: 'rgba(10,10,10,0.3)',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                  }}>
                    {group}
                  </div>
                )}
                {opts.map(opt => {
                  const idx = filtered.indexOf(opt)
                  const isActive = activeIndex === idx
                  const isSelected = selected === opt.value
                  return (
                    <button
                      key={opt.value}
                      data-idx={idx}
                      onClick={() => handleSelect(opt.value)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '7px 8px',
                        background: isActive ? 'rgba(10,10,10,0.05)' : 'transparent',
                        border: 'none',
                        borderRadius: '7px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        boxSizing: 'border-box',
                        transition: 'background 100ms ease',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                      }}
                    >
                      {opt.icon && (
                        <span style={{ fontSize: '13px', width: '18px', textAlign: 'center', flexShrink: 0, color: '#0a0a0a' }}>
                          {opt.icon}
                        </span>
                      )}
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{
                          display: 'block',
                          fontSize: '13px',
                          fontWeight: isSelected ? 600 : 500,
                          color: '#0a0a0a',
                          letterSpacing: '-0.01em',
                          lineHeight: '18px',
                        }}>
                          {opt.label}
                        </span>
                        {opt.description && (
                          <span style={{
                            display: 'block',
                            fontSize: '11px',
                            fontWeight: 500,
                            color: 'rgba(10,10,10,0.4)',
                            letterSpacing: '-0.01em',
                            lineHeight: '15px',
                          }}>
                            {opt.description}
                          </span>
                        )}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        color: '#0a0a0a',
                        flexShrink: 0,
                        opacity: isSelected ? 1 : 0,
                        transition: 'opacity 150ms ease',
                        fontWeight: 700,
                        lineHeight: 1,
                      }}>
                        ✓
                      </span>
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

interface Option {
  value: string
  label: string
  description?: string
  icon?: string
  group?: string
}

const OPTIONS: Option[] = [
  { value: 'figma',   label: 'Figma',   description: 'Design & prototyping',  icon: '◆', group: 'Design' },
  { value: 'framer',  label: 'Framer',  description: 'Web design platform',   icon: '◈', group: 'Design' },
  { value: 'sketch',  label: 'Sketch',  description: 'Mac design tool',       icon: '◇', group: 'Design' },
  { value: 'react',   label: 'React',   description: 'UI component library',  icon: '⬡', group: 'Development' },
  { value: 'vue',     label: 'Vue',     description: 'Progressive framework', icon: '⬢', group: 'Development' },
  { value: 'svelte',  label: 'Svelte',  description: 'Compiler framework',    icon: '⬟', group: 'Development' },
  { value: 'vercel',  label: 'Vercel',  description: 'Frontend cloud',        icon: '▲', group: 'Deployment' },
  { value: 'netlify', label: 'Netlify', description: 'Web platform',          icon: '◉', group: 'Deployment' },
]

export function Dropdown({
  options = OPTIONS,
  placeholder = 'Select an option...',
}: {
  options?: Option[]
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    if (!query) return options
    const q = query.toLowerCase()
    return options.filter(o =>
      o.label.toLowerCase().includes(q) ||
      (o.description?.toLowerCase() ?? '').includes(q)
    )
  }, [query, options])

  const groups = useMemo(() => {
    const map = new Map<string, Option[]>()
    filtered.forEach(o => {
      const g = o.group ?? ''
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(o)
    })
    return map
  }, [filtered])

  const selectedOption = options.find(o => o.value === selected)

  const handleOpen = () => {
    setOpen(true)
    setQuery('')
    setActiveIndex(-1)
    setTimeout(() => searchRef.current?.focus(), 60)
  }

  const handleClose = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActiveIndex(-1)
  }, [])

  const handleSelect = (value: string) => {
    setSelected(value)
    handleClose()
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) handleClose()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open, handleClose])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { handleClose(); return }
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault(); handleOpen()
      }
      return
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); handleSelect(filtered[activeIndex].value) }
  }

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return
    const el = listRef.current.querySelector('[data-idx="' + activeIndex + '"]') as HTMLElement
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '280px' }} onKeyDown={handleKeyDown}>
      <button
        onClick={() => open ? handleClose() : handleOpen()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '9px 12px',
          background: '#fff',
          border: (focused || open) ? '1px solid rgba(10,10,10,0.24)' : '1px solid rgba(10,10,10,0.12)',
          borderRadius: '10px',
          cursor: 'pointer',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          boxShadow: (focused || open)
            ? '0 0 0 3px rgba(10,10,10,0.06), 0 1px 2px rgba(0,0,0,0.04)'
            : '0 1px 2px rgba(0,0,0,0.04)',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          outline: 'none',
        }}
      >
        {selectedOption ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {selectedOption.icon && <span style={{ fontSize: '13px' }}>{selectedOption.icon}</span>}
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
              {selectedOption.label}
            </span>
          </span>
        ) : (
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.35)', letterSpacing: '-0.01em' }}>
            {placeholder}
          </span>
        )}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms cubic-bezier(0.32, 0.72, 0, 1)', color: 'rgba(10,10,10,0.4)', flexShrink: 0 }}>
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        right: 0,
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.10)',
        zIndex: 50,
        overflow: 'hidden',
        transformOrigin: 'top center',
        transform: open ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(-6px)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition: 'transform 200ms cubic-bezier(0.32, 0.72, 0, 1), opacity 180ms ease',
      }}>
        <div style={{ padding: '8px 8px 6px', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
          <div style={{ position: 'relative' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
              style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(10,10,10,0.3)', pointerEvents: 'none' }}>
              <circle cx="5.5" cy="5.5" r="3.75" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8.5 8.5L11 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              ref={searchRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setActiveIndex(-1) }}
              placeholder="Search..."
              style={{
                width: '100%',
                padding: '7px 10px 7px 29px',
                border: '1px solid rgba(10,10,10,0.08)',
                borderRadius: '7px',
                background: 'rgba(10,10,10,0.03)',
                fontSize: '13px',
                fontWeight: 500,
                color: '#0a0a0a',
                letterSpacing: '-0.01em',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              }}
            />
          </div>
        </div>

        <div ref={listRef} style={{ maxHeight: '236px', overflowY: 'auto', padding: '6px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '20px 0', textAlign: 'center', fontSize: '13px', color: 'rgba(10,10,10,0.35)', fontWeight: 500 }}>
              No results
            </div>
          ) : (
            Array.from(groups.entries()).map(([group, opts], gi) => (
              <div key={group} style={{ marginTop: gi > 0 ? '2px' : 0 }}>
                {group && (
                  <div style={{ padding: '6px 8px 3px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.3)' }}>
                    {group}
                  </div>
                )}
                {opts.map(opt => {
                  const idx = filtered.indexOf(opt)
                  const isActive = activeIndex === idx
                  const isSelected = selected === opt.value
                  return (
                    <button
                      key={opt.value}
                      data-idx={idx}
                      onClick={() => handleSelect(opt.value)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '7px 8px',
                        background: isActive ? 'rgba(10,10,10,0.05)' : 'transparent',
                        border: 'none',
                        borderRadius: '7px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        boxSizing: 'border-box',
                        transition: 'background 100ms ease',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                      }}
                    >
                      {opt.icon && <span style={{ fontSize: '13px', width: '18px', textAlign: 'center', flexShrink: 0 }}>{opt.icon}</span>}
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontSize: '13px', fontWeight: isSelected ? 600 : 500, color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: '18px' }}>
                          {opt.label}
                        </span>
                        {opt.description && (
                          <span style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em', lineHeight: '15px' }}>
                            {opt.description}
                          </span>
                        )}
                      </span>
                      <span style={{ fontSize: '11px', color: '#0a0a0a', flexShrink: 0, opacity: isSelected ? 1 : 0, transition: 'opacity 150ms ease', fontWeight: 700 }}>
                        ✓
                      </span>
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DropdownPage() {
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
        gap: '24px',
      }}>
        <Dropdown />
        <p style={{
          margin: 0,
          fontSize: '12px',
          color: 'rgba(0,0,0,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}>
          Click to open · type to filter · ↑↓ navigate · Enter select · Esc close
        </p>
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
