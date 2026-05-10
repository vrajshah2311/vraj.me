'use client'

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const SUGGESTIONS = [
  'React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js',
  'GraphQL', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes',
  'Figma', 'Motion Design', 'Design Systems', 'Accessibility',
  'WebGL', 'Three.js', 'Framer Motion', 'Storybook', 'Vitest',
  'Rust', 'Go', 'Python', 'Machine Learning', 'Edge Computing',
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tag {
  id: number
  label: string
  removing: boolean
}

// ─── Tag Chip ─────────────────────────────────────────────────────────────────

function TagChip({ tag, onRemove }: { tag: Tag; onRemove: (id: number) => void }) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setEntered(true), 16)
    return () => clearTimeout(id)
  }, [])

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 8px 3px 10px',
        borderRadius: '6px',
        background: 'rgba(10,10,10,0.06)',
        border: '1px solid rgba(10,10,10,0.08)',
        fontSize: '13px',
        fontWeight: 500,
        color: '#0a0a0a',
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
        transform: (entered && !tag.removing) ? 'scale(1)' : 'scale(0.85)',
        opacity: (entered && !tag.removing) ? 1 : 0,
        transition: 'transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 150ms ease',
        willChange: 'transform, opacity',
        userSelect: 'none',
      }}
    >
      {tag.label}
      <button
        onClick={() => onRemove(tag.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '14px',
          height: '14px',
          borderRadius: '3px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: 0,
          color: 'rgba(10,10,10,0.4)',
          fontSize: '11px',
          lineHeight: 1,
          flexShrink: 0,
          transition: 'color 120ms ease, background 120ms ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#0a0a0a'
          e.currentTarget.style.background = 'rgba(10,10,10,0.08)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'rgba(10,10,10,0.4)'
          e.currentTarget.style.background = 'transparent'
        }}
        aria-label={`Remove ${tag.label}`}
      >
        ✕
      </button>
    </span>
  )
}

// ─── Dropdown Item ────────────────────────────────────────────────────────────

function DropdownItem({
  label,
  query,
  active,
  disabled,
  onClick,
  onHover,
}: {
  label: string
  query: string
  active: boolean
  disabled: boolean
  onClick: () => void
  onHover: () => void
}) {
  const idx = label.toLowerCase().indexOf(query.toLowerCase())
  const before = idx >= 0 ? label.slice(0, idx) : label
  const match  = idx >= 0 ? label.slice(idx, idx + query.length) : ''
  const after  = idx >= 0 ? label.slice(idx + query.length) : ''

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={onHover}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '7px 10px',
        border: 'none',
        borderRadius: '7px',
        background: active ? 'rgba(10,10,10,0.05)' : 'transparent',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: '13px',
        fontWeight: 500,
        color: disabled ? 'rgba(10,10,10,0.28)' : '#0a0a0a',
        letterSpacing: '-0.01em',
        fontFamily: FONT,
        textAlign: 'left',
        transition: 'background 100ms ease',
        flexShrink: 0,
      }}
    >
      <span>
        {before}
        {match && <strong style={{ fontWeight: 700 }}>{match}</strong>}
        {after}
      </span>
      {disabled && (
        <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.28)', marginLeft: '8px', fontWeight: 500 }}>
          added
        </span>
      )}
    </button>
  )
}

// ─── Tag Input ────────────────────────────────────────────────────────────────

function TagInput({
  suggestions,
  placeholder = 'Add tag…',
  maxTags,
}: {
  suggestions: string[]
  placeholder?: string
  maxTags?: number
}) {
  const [tags, setTags] = useState<Tag[]>([])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef(0)

  const tagLabels = tags.map(t => t.label)
  const filtered = suggestions.filter(s =>
    s.toLowerCase().includes(query.toLowerCase())
  )
  const reachedMax = maxTags !== undefined && tags.filter(t => !t.removing).length >= maxTags

  const addTag = useCallback((label: string) => {
    if (!label.trim()) return
    if (tagLabels.includes(label)) return
    if (reachedMax) return
    setTags(prev => [...prev, { id: ++counterRef.current, label, removing: false }])
    setQuery('')
    setOpen(false)
    setActiveIdx(-1)
    inputRef.current?.focus()
  }, [tagLabels, reachedMax])

  const removeTag = useCallback((id: number) => {
    setTags(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t))
    setTimeout(() => {
      setTags(prev => prev.filter(t => t.id !== id))
    }, 200)
  }, [])

  const removeLastTag = useCallback(() => {
    const live = tags.filter(t => !t.removing)
    if (live.length === 0) return
    removeTag(live[live.length - 1].id)
  }, [tags, removeTag])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIdx >= 0 && filtered[activeIdx]) {
        addTag(filtered[activeIdx])
      } else if (query.trim()) {
        addTag(query.trim())
      }
    } else if (e.key === 'Backspace' && query === '') {
      e.preventDefault()
      removeLastTag()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIdx(-1)
    }
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setActiveIdx(-1)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Scroll active item into view
  useEffect(() => {
    if (activeIdx < 0 || !dropRef.current) return
    const item = dropRef.current.children[activeIdx] as HTMLElement
    item?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  const showDrop = open && filtered.length > 0 && !reachedMax

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Input wrapper */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 10px',
          borderRadius: '10px',
          border: `1px solid ${focused ? 'rgba(10,10,10,0.22)' : 'rgba(10,10,10,0.10)'}`,
          background: '#fff',
          boxShadow: focused
            ? '0 0 0 3px rgba(10,10,10,0.05)'
            : '0 1px 2px rgba(0,0,0,0.04)',
          cursor: 'text',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          minHeight: '44px',
          fontFamily: FONT,
        }}
      >
        {tags.map(tag => (
          <TagChip key={tag.id} tag={tag} onRemove={removeTag} />
        ))}
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setActiveIdx(-1) }}
          onFocus={() => { setFocused(true); if (query || filtered.length) setOpen(true) }}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          disabled={reachedMax}
          style={{
            flex: '1 1 80px',
            minWidth: '80px',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '13px',
            fontWeight: 500,
            color: '#0a0a0a',
            letterSpacing: '-0.01em',
            fontFamily: FONT,
            padding: '2px 0',
            caretColor: '#0a0a0a',
          }}
        />
        {reachedMax && (
          <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.35)', fontWeight: 500, marginLeft: 'auto', whiteSpace: 'nowrap' }}>
            max {maxTags} tags
          </span>
        )}
      </div>

      {/* Dropdown */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: '10px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
          padding: '4px',
          zIndex: 50,
          maxHeight: '200px',
          overflowY: 'auto',
          transformOrigin: 'top center',
          transform: showDrop ? 'scaleY(1) translateY(0)' : 'scaleY(0.92) translateY(-6px)',
          opacity: showDrop ? 1 : 0,
          pointerEvents: showDrop ? 'auto' : 'none',
          transition: 'transform 180ms cubic-bezier(0.32, 0.72, 0, 1), opacity 150ms ease',
        }}
        ref={dropRef}
      >
        {filtered.map((s, i) => (
          <DropdownItem
            key={s}
            label={s}
            query={query}
            active={i === activeIdx}
            disabled={tagLabels.includes(s)}
            onClick={() => addTag(s)}
            onHover={() => setActiveIdx(i)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function Demo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', width: '100%' }}>

      {/* ── Main card ── */}
      <div style={{
        width: '420px',
        maxWidth: 'calc(100vw - 48px)',
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid rgba(10,10,10,0.08)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        fontFamily: FONT,
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px 12px',
          borderBottom: '1px solid rgba(10,10,10,0.06)',
        }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
            Skills
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em' }}>
            Add up to 5 skills to your profile
          </p>
        </div>

        <div style={{ padding: '16px 20px 20px' }}>
          <TagInput suggestions={SUGGESTIONS} placeholder="Search skills…" maxTags={5} />
        </div>
      </div>

      {/* ── Freeform card ── */}
      <div style={{
        width: '420px',
        maxWidth: 'calc(100vw - 48px)',
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid rgba(10,10,10,0.08)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        fontFamily: FONT,
      }}>
        <div style={{
          padding: '16px 20px 12px',
          borderBottom: '1px solid rgba(10,10,10,0.06)',
        }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
            Labels
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em' }}>
            Press Enter to create a custom label
          </p>
        </div>
        <div style={{ padding: '16px 20px 20px' }}>
          <TagInput suggestions={['bug', 'feature', 'docs', 'breaking', 'chore', 'refactor', 'performance', 'security']} placeholder="Add label…" />
        </div>
      </div>

    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

interface Tag {
  id: number
  label: string
  removing: boolean
}

function TagChip({ tag, onRemove }: { tag: Tag; onRemove: (id: number) => void }) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setEntered(true), 16)
    return () => clearTimeout(id)
  }, [])

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 8px 3px 10px',
        borderRadius: '6px',
        background: 'rgba(10,10,10,0.06)',
        border: '1px solid rgba(10,10,10,0.08)',
        fontSize: '13px',
        fontWeight: 500,
        color: '#0a0a0a',
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
        transform: (entered && !tag.removing) ? 'scale(1)' : 'scale(0.85)',
        opacity: (entered && !tag.removing) ? 1 : 0,
        transition: 'transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 150ms ease',
        userSelect: 'none',
      }}
    >
      {tag.label}
      <button
        onClick={() => onRemove(tag.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '14px',
          height: '14px',
          borderRadius: '3px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: 0,
          color: 'rgba(10,10,10,0.4)',
          fontSize: '11px',
          lineHeight: 1,
        }}
        aria-label={\`Remove \${tag.label}\`}
      >✕</button>
    </span>
  )
}

function DropdownItem({ label, query, active, disabled, onClick, onHover }: {
  label: string; query: string; active: boolean; disabled: boolean;
  onClick: () => void; onHover: () => void
}) {
  const idx = label.toLowerCase().indexOf(query.toLowerCase())
  const before = idx >= 0 ? label.slice(0, idx) : label
  const match  = idx >= 0 ? label.slice(idx, idx + query.length) : ''
  const after  = idx >= 0 ? label.slice(idx + query.length) : ''

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={onHover}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '7px 10px',
        border: 'none',
        borderRadius: '7px',
        background: active ? 'rgba(10,10,10,0.05)' : 'transparent',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: '13px',
        fontWeight: 500,
        color: disabled ? 'rgba(10,10,10,0.28)' : '#0a0a0a',
        letterSpacing: '-0.01em',
        fontFamily: FONT,
        textAlign: 'left',
        transition: 'background 100ms ease',
      }}
    >
      <span>
        {before}
        {match && <strong style={{ fontWeight: 700 }}>{match}</strong>}
        {after}
      </span>
      {disabled && (
        <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.28)', marginLeft: '8px' }}>added</span>
      )}
    </button>
  )
}

export function TagInput({
  suggestions,
  placeholder = 'Add tag…',
  maxTags,
}: {
  suggestions: string[]
  placeholder?: string
  maxTags?: number
}) {
  const [tags, setTags] = useState<Tag[]>([])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef(0)

  const tagLabels = tags.map(t => t.label)
  const filtered = suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()))
  const reachedMax = maxTags !== undefined && tags.filter(t => !t.removing).length >= maxTags

  const addTag = useCallback((label: string) => {
    if (!label.trim() || tagLabels.includes(label) || reachedMax) return
    setTags(prev => [...prev, { id: ++counterRef.current, label, removing: false }])
    setQuery('')
    setOpen(false)
    setActiveIdx(-1)
    inputRef.current?.focus()
  }, [tagLabels, reachedMax])

  const removeTag = useCallback((id: number) => {
    setTags(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t))
    setTimeout(() => setTags(prev => prev.filter(t => t.id !== id)), 200)
  }, [])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIdx >= 0 && filtered[activeIdx]) addTag(filtered[activeIdx])
      else if (query.trim()) addTag(query.trim())
    } else if (e.key === 'Backspace' && query === '') {
      e.preventDefault()
      const live = tags.filter(t => !t.removing)
      if (live.length) removeTag(live[live.length - 1].id)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIdx(-1)
    }
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setActiveIdx(-1)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (activeIdx < 0 || !dropRef.current) return
    const item = dropRef.current.children[activeIdx] as HTMLElement
    item?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  const showDrop = open && filtered.length > 0 && !reachedMax

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 10px',
          borderRadius: '10px',
          border: \`1px solid \${focused ? 'rgba(10,10,10,0.22)' : 'rgba(10,10,10,0.10)'}\`,
          background: '#fff',
          boxShadow: focused ? '0 0 0 3px rgba(10,10,10,0.05)' : '0 1px 2px rgba(0,0,0,0.04)',
          cursor: 'text',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          minHeight: '44px',
          fontFamily: FONT,
        }}
      >
        {tags.map(tag => (
          <TagChip key={tag.id} tag={tag} onRemove={removeTag} />
        ))}
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setActiveIdx(-1) }}
          onFocus={() => { setFocused(true); if (query || filtered.length) setOpen(true) }}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          disabled={reachedMax}
          style={{
            flex: '1 1 80px',
            minWidth: '80px',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '13px',
            fontWeight: 500,
            color: '#0a0a0a',
            letterSpacing: '-0.01em',
            fontFamily: FONT,
            padding: '2px 0',
            caretColor: '#0a0a0a',
          }}
        />
        {reachedMax && (
          <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.35)', fontWeight: 500, marginLeft: 'auto' }}>
            max {maxTags} tags
          </span>
        )}
      </div>

      <div
        ref={dropRef}
        style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: '10px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
          padding: '4px',
          zIndex: 50,
          maxHeight: '200px',
          overflowY: 'auto',
          transformOrigin: 'top center',
          transform: showDrop ? 'scaleY(1) translateY(0)' : 'scaleY(0.92) translateY(-6px)',
          opacity: showDrop ? 1 : 0,
          pointerEvents: showDrop ? 'auto' : 'none',
          transition: 'transform 180ms cubic-bezier(0.32, 0.72, 0, 1), opacity 150ms ease',
        }}
      >
        {filtered.map((s, i) => (
          <DropdownItem
            key={s}
            label={s}
            query={query}
            active={i === activeIdx}
            disabled={tagLabels.includes(s)}
            onClick={() => addTag(s)}
            onHover={() => setActiveIdx(i)}
          />
        ))}
      </div>
    </div>
  )
}

// Usage:
// <TagInput
//   suggestions={['React', 'TypeScript', 'Node.js']}
//   placeholder="Search skills…"
//   maxTags={5}
// />`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TagInputPage() {
  return (
    <main style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      fontFamily: FONT,
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
        gap: '0',
      }}>
        <Demo />
        <p style={{
          marginTop: '32px',
          fontSize: '12px',
          color: 'rgba(0,0,0,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily: FONT,
          textAlign: 'center',
        }}>
          Type to filter · Enter or click to add · Backspace to remove last · Arrow keys to navigate
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
