'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Option {
  value: string
  label: string
  description?: string
  emoji?: string
}

interface ComboboxProps {
  options: Option[]
  placeholder?: string
  value: string | null
  onChange: (value: string | null) => void
  emptyMessage?: string
  disabled?: boolean
  width?: number
}

// ─── Highlight ────────────────────────────────────────────────────────────────

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const index = text.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, index)}
      <mark style={{
        background: 'rgba(10,10,10,0.1)',
        borderRadius: '2px',
        padding: '0 1px',
        color: 'inherit',
        fontWeight: 700,
      }}>
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  )
}

// ─── Combobox ─────────────────────────────────────────────────────────────────

function Combobox({
  options,
  placeholder = 'Search…',
  value,
  onChange,
  emptyMessage = 'No results.',
  disabled = false,
  width = 280,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(0)
  const [dropdownMounted, setDropdownMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value) ?? null

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(query.toLowerCase()) ||
    (o.description ?? '').toLowerCase().includes(query.toLowerCase())
  )

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Scroll highlighted item into view
  useEffect(() => {
    const el = listRef.current?.children[highlighted] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [highlighted])

  // Animate dropdown in after mount
  useEffect(() => {
    if (open) {
      const id = setTimeout(() => setDropdownMounted(true), 16)
      return () => clearTimeout(id)
    } else {
      setDropdownMounted(false)
      setHighlighted(0)
    }
  }, [open])

  const select = useCallback((opt: Option) => {
    onChange(opt.value)
    setOpen(false)
    setQuery('')
  }, [onChange])

  const clear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    setQuery('')
  }, [onChange])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        setOpen(true)
        e.preventDefault()
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        setHighlighted(i => Math.min(i + 1, filtered.length - 1))
        e.preventDefault()
        break
      case 'ArrowUp':
        setHighlighted(i => Math.max(i - 1, 0))
        e.preventDefault()
        break
      case 'Enter':
        if (filtered[highlighted]) select(filtered[highlighted])
        e.preventDefault()
        break
      case 'Escape':
        setOpen(false)
        setQuery('')
        inputRef.current?.blur()
        break
    }
  }

  const isFocused = open

  return (
    <div ref={containerRef} style={{ position: 'relative', width, maxWidth: '100%' }}>
      {/* ── Trigger ── */}
      <div
        onClick={() => { if (!disabled) { setOpen(true); setTimeout(() => inputRef.current?.focus(), 0) } }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0 10px 0 12px',
          height: '38px',
          background: '#fff',
          border: `1px solid ${isFocused ? 'rgba(10,10,10,0.22)' : 'rgba(10,10,10,0.1)'}`,
          borderRadius: '10px',
          cursor: disabled ? 'default' : 'text',
          boxShadow: isFocused
            ? '0 0 0 3px rgba(10,10,10,0.06), 0 1px 2px rgba(0,0,0,0.04)'
            : '0 1px 2px rgba(0,0,0,0.04)',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          opacity: disabled ? 0.45 : 1,
          userSelect: 'none',
        }}
      >
        {/* Search icon */}
        <svg
          width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke={isFocused ? 'rgba(10,10,10,0.5)' : 'rgba(10,10,10,0.3)'}
          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transition: 'stroke 150ms ease' }}
        >
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>

        {/* Input */}
        <input
          ref={inputRef}
          value={open ? query : (selected?.label ?? '')}
          onChange={e => { setQuery(e.target.value); setHighlighted(0) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={open ? placeholder : (selected ? '' : placeholder)}
          disabled={disabled}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '13px',
            fontWeight: (selected && !open) ? 500 : 400,
            color: (selected && !open) ? '#0a0a0a' : 'rgba(10,10,10,0.4)',
            letterSpacing: '-0.01em',
            fontFamily: FONT,
            cursor: disabled ? 'default' : 'text',
            minWidth: 0,
          }}
        />

        {/* Clear or chevron */}
        {selected && !open ? (
          <button
            onClick={clear}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '3px', color: 'rgba(10,10,10,0.3)',
              display: 'flex', alignItems: 'center', borderRadius: '4px',
              flexShrink: 0, transition: 'color 150ms ease, background 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#0a0a0a'; e.currentTarget.style.background = 'rgba(10,10,10,0.05)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(10,10,10,0.3)'; e.currentTarget.style.background = 'transparent' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : (
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="rgba(10,10,10,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </div>

      {/* ── Dropdown ── */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 5px)',
          left: 0,
          right: 0,
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.09)',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06), 0 12px 28px -4px rgba(0,0,0,0.1)',
          zIndex: 50,
          overflow: 'hidden',
          transform: dropdownMounted ? 'translateY(0) scale(1)' : 'translateY(-4px) scale(0.975)',
          opacity: dropdownMounted ? 1 : 0,
          transition: 'transform 160ms cubic-bezier(0.32,0.72,0,1), opacity 120ms ease',
          transformOrigin: 'top center',
        }}>
          {filtered.length === 0 ? (
            <div style={{
              padding: '28px 16px',
              textAlign: 'center',
              fontSize: '13px',
              color: 'rgba(10,10,10,0.35)',
              fontFamily: FONT,
              fontWeight: 500,
              letterSpacing: '-0.01em',
            }}>
              {emptyMessage}
            </div>
          ) : (
            <ul
              ref={listRef}
              style={{
                listStyle: 'none', margin: 0,
                padding: '4px',
                maxHeight: '228px',
                overflowY: 'auto',
              }}
            >
              {filtered.map((opt, i) => {
                const isSelected = opt.value === value
                const isHi = i === highlighted
                return (
                  <li
                    key={opt.value}
                    onMouseDown={e => { e.preventDefault(); select(opt) }}
                    onMouseEnter={() => setHighlighted(i)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: opt.description ? '7px 9px' : '6px 9px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: isHi ? 'rgba(10,10,10,0.04)' : 'transparent',
                      transition: 'background 80ms ease',
                    }}
                  >
                    {/* Leading: emoji or checkmark/spacer */}
                    {opt.emoji ? (
                      <span style={{ fontSize: '15px', lineHeight: 1, flexShrink: 0 }}>{opt.emoji}</span>
                    ) : isSelected ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <div style={{ width: 13, flexShrink: 0 }} />
                    )}

                    {/* Label + description */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: isSelected ? 600 : 500,
                        color: '#0a0a0a',
                        letterSpacing: '-0.01em',
                        fontFamily: FONT,
                        lineHeight: '18px',
                      }}>
                        <Highlight text={opt.label} query={query} />
                      </div>
                      {opt.description && (
                        <div style={{
                          fontSize: '11px',
                          color: 'rgba(10,10,10,0.38)',
                          letterSpacing: '-0.005em',
                          marginTop: '1px',
                          fontFamily: FONT,
                          fontWeight: 500,
                          lineHeight: '15px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          <Highlight text={opt.description} query={query} />
                        </div>
                      )}
                    </div>

                    {/* Trailing checkmark when emoji is present */}
                    {opt.emoji && isSelected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const TIMEZONES: Option[] = [
  { value: 'pst',  label: 'Pacific Time',   description: 'UTC−8 · Los Angeles, Seattle',    emoji: '🌊' },
  { value: 'mst',  label: 'Mountain Time',  description: 'UTC−7 · Denver, Phoenix',          emoji: '⛰️' },
  { value: 'cst',  label: 'Central Time',   description: 'UTC−6 · Chicago, Dallas',          emoji: '🌾' },
  { value: 'est',  label: 'Eastern Time',   description: 'UTC−5 · New York, Miami',          emoji: '🗽' },
  { value: 'gmt',  label: 'Greenwich Mean', description: 'UTC+0 · London, Dublin',           emoji: '🎡' },
  { value: 'cet',  label: 'Central Europe', description: 'UTC+1 · Paris, Berlin, Rome',      emoji: '🏰' },
  { value: 'ist',  label: 'India Standard', description: 'UTC+5:30 · Mumbai, Bengaluru',     emoji: '🕌' },
  { value: 'sgt',  label: 'Singapore Time', description: 'UTC+8 · Singapore, Kuala Lumpur',  emoji: '🦁' },
  { value: 'jst',  label: 'Japan Standard', description: 'UTC+9 · Tokyo, Osaka',             emoji: '⛩️' },
  { value: 'aest', label: 'AE Eastern',     description: 'UTC+10 · Sydney, Melbourne',       emoji: '🦘' },
]

const FRAMEWORKS: Option[] = [
  { value: 'next',    label: 'Next.js',      description: 'React · Vercel' },
  { value: 'remix',   label: 'Remix',        description: 'React · Shopify' },
  { value: 'astro',   label: 'Astro',        description: 'Multi-framework · Islands' },
  { value: 'nuxt',    label: 'Nuxt',         description: 'Vue · Nuxt Labs' },
  { value: 'svelte',  label: 'SvelteKit',    description: 'Svelte · Vercel' },
  { value: 'solid',   label: 'SolidStart',   description: 'SolidJS · fine-grained reactivity' },
  { value: 'qwik',    label: 'Qwik City',    description: 'Qwik · Builder.io' },
  { value: 'angular', label: 'Angular',      description: 'TypeScript · Google' },
  { value: 'tanstack', label: 'TanStack Start', description: 'React · TanStack' },
  { value: 'fresh',   label: 'Fresh',        description: 'Preact · Deno' },
]

// ─── Demo wrapper ─────────────────────────────────────────────────────────────

function ComboboxDemo() {
  const [timezone, setTimezone] = useState<string | null>(null)
  const [framework, setFramework] = useState<string | null>(null)

  return (
    <div style={{
      display: 'flex',
      gap: '32px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}>
      {/* Timezone picker */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
          width: '300px',
          maxWidth: '100%',
        }}>
          <p style={{
            margin: '0 0 5px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            color: 'rgba(10,10,10,0.35)',
            fontFamily: FONT,
          }}>Time zone</p>
          <p style={{ margin: '0 0 14px', fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT }}>
            When should your meeting run?
          </p>
          <Combobox
            options={TIMEZONES}
            placeholder="Search time zones…"
            value={timezone}
            onChange={setTimezone}
            emptyMessage="No matching time zone."
            width={260}
          />
          {timezone && (
            <p style={{ margin: '10px 0 0', fontSize: '12px', color: 'rgba(10,10,10,0.45)', fontFamily: FONT, fontWeight: 500, letterSpacing: '-0.01em' }}>
              Selected: {TIMEZONES.find(t => t.value === timezone)?.label}
            </p>
          )}
        </div>
        <p style={{ margin: 0, textAlign: 'center', fontSize: '11px', color: 'rgba(0,0,0,0.3)', fontFamily: FONT, fontWeight: 500, letterSpacing: '-0.01em' }}>
          With emoji · descriptions
        </p>
      </div>

      {/* Framework picker */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
          width: '300px',
          maxWidth: '100%',
        }}>
          <p style={{
            margin: '0 0 5px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            color: 'rgba(10,10,10,0.35)',
            fontFamily: FONT,
          }}>Framework</p>
          <p style={{ margin: '0 0 14px', fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT }}>
            What are you building with?
          </p>
          <Combobox
            options={FRAMEWORKS}
            placeholder="Search frameworks…"
            value={framework}
            onChange={setFramework}
            emptyMessage="Framework not found."
            width={260}
          />
          {framework && (
            <p style={{ margin: '10px 0 0', fontSize: '12px', color: 'rgba(10,10,10,0.45)', fontFamily: FONT, fontWeight: 500, letterSpacing: '-0.01em' }}>
              Selected: {FRAMEWORKS.find(f => f.value === framework)?.label}
            </p>
          )}
        </div>
        <p style={{ margin: 0, textAlign: 'center', fontSize: '11px', color: 'rgba(0,0,0,0.3)', fontFamily: FONT, fontWeight: 500, letterSpacing: '-0.01em' }}>
          Text-only · keyboard nav
        </p>
      </div>
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

interface Option {
  value: string
  label: string
  description?: string
  emoji?: string
}

interface ComboboxProps {
  options: Option[]
  placeholder?: string
  value: string | null
  onChange: (value: string | null) => void
  emptyMessage?: string
  disabled?: boolean
  width?: number
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const index = text.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, index)}
      <mark style={{ background: 'rgba(10,10,10,0.1)', borderRadius: '2px', padding: '0 1px', color: 'inherit', fontWeight: 700 }}>
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  )
}

export function Combobox({
  options,
  placeholder = 'Search…',
  value,
  onChange,
  emptyMessage = 'No results.',
  disabled = false,
  width = 280,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(0)
  const [dropdownMounted, setDropdownMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value) ?? null
  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(query.toLowerCase()) ||
    (o.description ?? '').toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const el = listRef.current?.children[highlighted] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [highlighted])

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => setDropdownMounted(true), 16)
      return () => clearTimeout(id)
    } else {
      setDropdownMounted(false)
      setHighlighted(0)
    }
  }, [open])

  const select = useCallback((opt: Option) => {
    onChange(opt.value)
    setOpen(false)
    setQuery('')
  }, [onChange])

  const clear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    setQuery('')
  }, [onChange])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        setOpen(true)
        e.preventDefault()
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown': setHighlighted(i => Math.min(i + 1, filtered.length - 1)); e.preventDefault(); break
      case 'ArrowUp':   setHighlighted(i => Math.max(i - 1, 0)); e.preventDefault(); break
      case 'Enter':     if (filtered[highlighted]) select(filtered[highlighted]); e.preventDefault(); break
      case 'Escape':    setOpen(false); setQuery(''); inputRef.current?.blur(); break
    }
  }

  const isFocused = open

  return (
    <div ref={containerRef} style={{ position: 'relative', width, maxWidth: '100%' }}>
      {/* Trigger */}
      <div
        onClick={() => { if (!disabled) { setOpen(true); setTimeout(() => inputRef.current?.focus(), 0) } }}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '0 10px 0 12px', height: '38px', background: '#fff',
          border: \`1px solid \${isFocused ? 'rgba(10,10,10,0.22)' : 'rgba(10,10,10,0.1)'}\`,
          borderRadius: '10px', cursor: disabled ? 'default' : 'text',
          boxShadow: isFocused
            ? '0 0 0 3px rgba(10,10,10,0.06), 0 1px 2px rgba(0,0,0,0.04)'
            : '0 1px 2px rgba(0,0,0,0.04)',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          opacity: disabled ? 0.45 : 1, userSelect: 'none',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke={isFocused ? 'rgba(10,10,10,0.5)' : 'rgba(10,10,10,0.3)'}
          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transition: 'stroke 150ms ease' }}
        >
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>

        <input
          ref={inputRef}
          value={open ? query : (selected?.label ?? '')}
          onChange={e => { setQuery(e.target.value); setHighlighted(0) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={open ? placeholder : (selected ? '' : placeholder)}
          disabled={disabled}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontSize: '13px', fontWeight: (selected && !open) ? 500 : 400,
            color: (selected && !open) ? '#0a0a0a' : 'rgba(10,10,10,0.4)',
            letterSpacing: '-0.01em', fontFamily: FONT, cursor: disabled ? 'default' : 'text', minWidth: 0,
          }}
        />

        {selected && !open ? (
          <button onClick={clear} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '3px',
            color: 'rgba(10,10,10,0.3)', display: 'flex', alignItems: 'center',
            borderRadius: '4px', flexShrink: 0, transition: 'color 150ms ease',
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="rgba(10,10,10,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0,
          background: '#fff', border: '1px solid rgba(10,10,10,0.09)',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06), 0 12px 28px -4px rgba(0,0,0,0.1)',
          zIndex: 50, overflow: 'hidden',
          transform: dropdownMounted ? 'translateY(0) scale(1)' : 'translateY(-4px) scale(0.975)',
          opacity: dropdownMounted ? 1 : 0,
          transition: 'transform 160ms cubic-bezier(0.32,0.72,0,1), opacity 120ms ease',
          transformOrigin: 'top center',
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '28px 16px', textAlign: 'center', fontSize: '13px', color: 'rgba(10,10,10,0.35)', fontFamily: FONT, fontWeight: 500 }}>
              {emptyMessage}
            </div>
          ) : (
            <ul ref={listRef} style={{ listStyle: 'none', margin: 0, padding: '4px', maxHeight: '228px', overflowY: 'auto' }}>
              {filtered.map((opt, i) => {
                const isSelected = opt.value === value
                const isHi = i === highlighted
                return (
                  <li
                    key={opt.value}
                    onMouseDown={e => { e.preventDefault(); select(opt) }}
                    onMouseEnter={() => setHighlighted(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '9px',
                      padding: opt.description ? '7px 9px' : '6px 9px',
                      borderRadius: '8px', cursor: 'pointer',
                      background: isHi ? 'rgba(10,10,10,0.04)' : 'transparent',
                      transition: 'background 80ms ease',
                    }}
                  >
                    {opt.emoji ? (
                      <span style={{ fontSize: '15px', lineHeight: 1, flexShrink: 0 }}>{opt.emoji}</span>
                    ) : isSelected ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <div style={{ width: 13, flexShrink: 0 }} />
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: isSelected ? 600 : 500, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT, lineHeight: '18px' }}>
                        <Highlight text={opt.label} query={query} />
                      </div>
                      {opt.description && (
                        <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.38)', letterSpacing: '-0.005em', marginTop: '1px', fontFamily: FONT, fontWeight: 500, lineHeight: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <Highlight text={opt.description} query={query} />
                        </div>
                      )}
                    </div>

                    {opt.emoji && isSelected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

// ── Example usage ──────────────────────────────────────────────────────────────
//
// const [value, setValue] = useState<string | null>(null)
//
// const options = [
//   { value: 'next',  label: 'Next.js',  description: 'React · Vercel' },
//   { value: 'remix', label: 'Remix',    description: 'React · Shopify' },
//   { value: 'astro', label: 'Astro',    description: 'Multi-framework' },
// ]
//
// <Combobox
//   options={options}
//   placeholder="Search frameworks…"
//   value={value}
//   onChange={setValue}
// />`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ComboboxPage() {
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
        gap: '32px',
      }}>
        <ComboboxDemo />
        <p style={{
          margin: 0,
          fontSize: '11px',
          color: 'rgba(0,0,0,0.3)',
          fontFamily: FONT,
          fontWeight: 500,
          letterSpacing: '-0.01em',
        }}>
          Type to filter · ↑↓ to navigate · Enter to select · Esc to close
        </p>
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
