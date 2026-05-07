'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TagOption {
  value: string
  label: string
  color?: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TECH_OPTIONS: TagOption[] = [
  { value: 'react',      label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'next',       label: 'Next.js' },
  { value: 'tailwind',   label: 'Tailwind' },
  { value: 'node',       label: 'Node.js' },
  { value: 'graphql',    label: 'GraphQL' },
  { value: 'postgres',   label: 'PostgreSQL' },
  { value: 'redis',      label: 'Redis' },
  { value: 'docker',     label: 'Docker' },
  { value: 'figma',      label: 'Figma' },
  { value: 'swift',      label: 'Swift' },
  { value: 'rust',       label: 'Rust' },
]

const LABEL_OPTIONS: TagOption[] = [
  { value: 'bug',      label: 'Bug',      color: '#dc2626' },
  { value: 'feature',  label: 'Feature',  color: '#2563eb' },
  { value: 'docs',     label: 'Docs',     color: '#7c3aed' },
  { value: 'refactor', label: 'Refactor', color: '#d97706' },
  { value: 'test',     label: 'Test',     color: '#16a34a' },
  { value: 'ci',       label: 'CI/CD',    color: '#0891b2' },
  { value: 'perf',     label: 'Perf',     color: '#db2777' },
  { value: 'security', label: 'Security', color: '#9333ea' },
]

// ─── Tag Chip ─────────────────────────────────────────────────────────────────

function TagChip({
  label,
  color,
  onRemove,
  visible,
}: {
  label: string
  color?: string
  onRemove: () => void
  visible: boolean
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        height: '24px',
        padding: '0 3px 0 8px',
        borderRadius: '6px',
        background: color ? `${color}18` : 'rgba(10,10,10,0.07)',
        border: `1px solid ${color ? `${color}35` : 'rgba(10,10,10,0.1)'}`,
        flexShrink: 0,
        transform: visible ? 'scale(1)' : 'scale(0.75)',
        opacity: visible ? 1 : 0,
        transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1), opacity 160ms ease',
      }}
    >
      {color && (
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
          marginRight: '2px',
        }} />
      )}
      <span style={{
        fontSize: '12px',
        fontWeight: 600,
        color: color ? color : '#0a0a0a',
        letterSpacing: '-0.01em',
        fontFamily: FONT,
        lineHeight: 1,
        userSelect: 'none',
      }}>
        {label}
      </span>
      <button
        onMouseDown={e => { e.preventDefault(); e.stopPropagation() }}
        onClick={e => { e.stopPropagation(); onRemove() }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
          height: '16px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          borderRadius: '4px',
          color: color ? `${color}99` : 'rgba(10,10,10,0.35)',
          fontSize: '10px',
          padding: 0,
          lineHeight: 1,
          flexShrink: 0,
          transition: 'background 120ms ease, color 120ms ease',
          fontFamily: FONT,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = color ? `${color}25` : 'rgba(10,10,10,0.1)'
          e.currentTarget.style.color = color ?? '#0a0a0a'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = color ? `${color}99` : 'rgba(10,10,10,0.35)'
        }}
      >
        ✕
      </button>
    </div>
  )
}

// ─── TagInput ─────────────────────────────────────────────────────────────────

function TagInput({
  options,
  placeholder = 'Add tags…',
  maxTags,
}: {
  options: TagOption[]
  placeholder?: string
  maxTags?: number
}) {
  const [selected, setSelected] = useState<TagOption[]>([])
  const [visible, setVisible] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    const selectedValues = new Set(selected.map(s => s.value))
    return options.filter(o =>
      !selectedValues.has(o.value) &&
      (q === '' || o.label.toLowerCase().includes(q))
    )
  }, [query, selected, options])

  useEffect(() => { setActiveIndex(0) }, [filtered.length, query])

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  useEffect(() => {
    if (!listRef.current || !open) return
    const el = listRef.current.children[activeIndex] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const addTag = useCallback((option: TagOption) => {
    if (maxTags && selected.length >= maxTags) return
    setSelected(prev => [...prev, option])
    setTimeout(() => setVisible(prev => new Set([...prev, option.value])), 16)
    setQuery('')
    inputRef.current?.focus()
  }, [maxTags, selected.length])

  const removeTag = useCallback((value: string) => {
    setVisible(prev => { const n = new Set(prev); n.delete(value); return n })
    setTimeout(() => setSelected(prev => prev.filter(t => t.value !== value)), 200)
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[activeIndex]) addTag(filtered[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    } else if (e.key === 'Backspace' && query === '' && selected.length > 0) {
      removeTag(selected[selected.length - 1].value)
    }
  }, [filtered, activeIndex, query, selected, addTag, removeTag])

  const atMax = maxTags != null && selected.length >= maxTags

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div
        onClick={() => { if (!atMax) { setOpen(true); inputRef.current?.focus() } }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '6px',
          minHeight: '44px',
          padding: '8px 10px',
          background: '#fff',
          border: `1px solid ${open ? 'rgba(10,10,10,0.18)' : 'rgba(10,10,10,0.1)'}`,
          borderRadius: '10px',
          boxShadow: open ? '0 0 0 3px rgba(10,10,10,0.05)' : '0 1px 2px rgba(0,0,0,0.03)',
          cursor: atMax ? 'default' : 'text',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
        }}
      >
        {selected.map(tag => (
          <TagChip
            key={tag.value}
            label={tag.label}
            color={tag.color}
            onRemove={() => removeTag(tag.value)}
            visible={visible.has(tag.value)}
          />
        ))}

        {!atMax ? (
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={selected.length === 0 ? placeholder : ''}
            style={{
              flex: '1 1 100px',
              minWidth: '80px',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: 500,
              color: '#0a0a0a',
              letterSpacing: '-0.01em',
              fontFamily: FONT,
              lineHeight: '24px',
              padding: 0,
            }}
          />
        ) : (
          <span style={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'rgba(10,10,10,0.3)',
            fontFamily: FONT,
            letterSpacing: '-0.01em',
          }}>
            Max {maxTags} tags
          </span>
        )}
      </div>

      {/* Dropdown */}
      {open && (filtered.length > 0 || query.trim() !== '') && (
        <div
          ref={listRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid rgba(10,10,10,0.1)',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            zIndex: 50,
            maxHeight: '200px',
            overflowY: 'auto',
            animation: 'tagDropIn 160ms cubic-bezier(0.32,0.72,0,1) forwards',
          }}
        >
          {filtered.length > 0 ? filtered.map((option, i) => (
            <div
              key={option.value}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseDown={e => { e.preventDefault(); addTag(option) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                cursor: 'pointer',
                background: i === activeIndex ? 'rgba(10,10,10,0.05)' : 'transparent',
                transition: 'background 80ms ease',
              }}
            >
              {option.color && (
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: option.color,
                  flexShrink: 0,
                }} />
              )}
              <span style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#0a0a0a',
                letterSpacing: '-0.01em',
                fontFamily: FONT,
              }}>
                {option.label}
              </span>
            </div>
          )) : (
            <div style={{ padding: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>
                No matches
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function Demo() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '28px',
      width: '100%',
      maxWidth: '380px',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        <label style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'rgba(10,10,10,0.45)',
          letterSpacing: '-0.01em',
          fontFamily: FONT,
        }}>
          Filter by technology
        </label>
        <TagInput
          options={TECH_OPTIONS}
          placeholder="Search technologies…"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        <label style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'rgba(10,10,10,0.45)',
          letterSpacing: '-0.01em',
          fontFamily: FONT,
        }}>
          Add labels
          <span style={{ fontWeight: 500, color: 'rgba(10,10,10,0.3)', marginLeft: '6px' }}>(max 3)</span>
        </label>
        <TagInput
          options={LABEL_OPTIONS}
          placeholder="Search labels…"
          maxTags={3}
        />
      </div>

      <p style={{
        margin: 0,
        fontSize: '12px',
        color: 'rgba(0,0,0,0.3)',
        fontWeight: 500,
        letterSpacing: '-0.01em',
        fontFamily: FONT,
        textAlign: 'center',
      }}>
        ↑↓ navigate · Enter to select · Backspace to remove · Esc to close
      </p>
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

interface TagOption {
  value: string
  label: string
  color?: string
}

// Drop in your own options — color is optional (used for label-style tags)
const OPTIONS: TagOption[] = [
  { value: 'react',     label: 'React' },
  { value: 'typescript',label: 'TypeScript' },
  { value: 'bug',       label: 'Bug',     color: '#dc2626' },
  { value: 'feature',   label: 'Feature', color: '#2563eb' },
]

function TagChip({ label, color, onRemove, visible }: {
  label: string; color?: string; onRemove: () => void; visible: boolean
}) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      height: '24px', padding: '0 3px 0 8px', borderRadius: '6px',
      background: color ? \`\${color}18\` : 'rgba(10,10,10,0.07)',
      border: \`1px solid \${color ? \`\${color}35\` : 'rgba(10,10,10,0.1)'}\`,
      flexShrink: 0,
      transform: visible ? 'scale(1)' : 'scale(0.75)',
      opacity: visible ? 1 : 0,
      transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1), opacity 160ms ease',
    }}>
      {color && (
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0, marginRight: '2px' }} />
      )}
      <span style={{ fontSize: '12px', fontWeight: 600, color: color ?? '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT, lineHeight: 1, userSelect: 'none' }}>
        {label}
      </span>
      <button
        onMouseDown={e => { e.preventDefault(); e.stopPropagation() }}
        onClick={e => { e.stopPropagation(); onRemove() }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '16px', height: '16px', border: 'none', background: 'none',
          cursor: 'pointer', borderRadius: '4px', color: color ? \`\${color}99\` : 'rgba(10,10,10,0.35)',
          fontSize: '10px', padding: 0, lineHeight: 1, flexShrink: 0,
          transition: 'background 120ms ease, color 120ms ease', fontFamily: FONT,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = color ? \`\${color}25\` : 'rgba(10,10,10,0.1)'; e.currentTarget.style.color = color ?? '#0a0a0a' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = color ? \`\${color}99\` : 'rgba(10,10,10,0.35)' }}
      >✕</button>
    </div>
  )
}

export function TagInput({ options, placeholder = 'Add tags…', maxTags }: {
  options: TagOption[]; placeholder?: string; maxTags?: number
}) {
  const [selected, setSelected] = useState<TagOption[]>([])
  const [visible, setVisible] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    const selectedValues = new Set(selected.map(s => s.value))
    return options.filter(o =>
      !selectedValues.has(o.value) && (q === '' || o.label.toLowerCase().includes(q))
    )
  }, [query, selected, options])

  useEffect(() => { setActiveIndex(0) }, [filtered.length, query])

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  useEffect(() => {
    if (!listRef.current || !open) return
    const el = listRef.current.children[activeIndex] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const addTag = useCallback((option: TagOption) => {
    if (maxTags && selected.length >= maxTags) return
    setSelected(prev => [...prev, option])
    setTimeout(() => setVisible(prev => new Set([...prev, option.value])), 16)
    setQuery('')
    inputRef.current?.focus()
  }, [maxTags, selected.length])

  const removeTag = useCallback((value: string) => {
    setVisible(prev => { const n = new Set(prev); n.delete(value); return n })
    setTimeout(() => setSelected(prev => prev.filter(t => t.value !== value)), 200)
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActiveIndex(i => Math.min(i + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[activeIndex]) addTag(filtered[activeIndex]) }
    else if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur() }
    else if (e.key === 'Backspace' && query === '' && selected.length > 0) removeTag(selected[selected.length - 1].value)
  }, [filtered, activeIndex, query, selected, addTag, removeTag])

  const atMax = maxTags != null && selected.length >= maxTags

  return (
    <>
      <style>{\`
        @keyframes tagDropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      \`}</style>

      <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
        <div
          onClick={() => { if (!atMax) { setOpen(true); inputRef.current?.focus() } }}
          style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px',
            minHeight: '44px', padding: '8px 10px', background: '#fff',
            border: \`1px solid \${open ? 'rgba(10,10,10,0.18)' : 'rgba(10,10,10,0.1)'}\`,
            borderRadius: '10px',
            boxShadow: open ? '0 0 0 3px rgba(10,10,10,0.05)' : '0 1px 2px rgba(0,0,0,0.03)',
            cursor: atMax ? 'default' : 'text',
            transition: 'border-color 150ms ease, box-shadow 150ms ease',
          }}
        >
          {selected.map(tag => (
            <TagChip key={tag.value} label={tag.label} color={tag.color} onRemove={() => removeTag(tag.value)} visible={visible.has(tag.value)} />
          ))}
          {!atMax ? (
            <input
              ref={inputRef} value={query}
              onChange={e => { setQuery(e.target.value); setOpen(true) }}
              onFocus={() => setOpen(true)} onKeyDown={handleKeyDown}
              placeholder={selected.length === 0 ? placeholder : ''}
              style={{
                flex: '1 1 100px', minWidth: '80px', border: 'none', outline: 'none',
                background: 'transparent', fontSize: '13px', fontWeight: 500, color: '#0a0a0a',
                letterSpacing: '-0.01em', fontFamily: FONT, lineHeight: '24px', padding: 0,
              }}
            />
          ) : (
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.3)', fontFamily: FONT, letterSpacing: '-0.01em' }}>
              Max {maxTags} tags
            </span>
          )}
        </div>

        {open && (filtered.length > 0 || query.trim() !== '') && (
          <div ref={listRef} style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
            background: '#fff', border: '1px solid rgba(10,10,10,0.1)', borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
            overflow: 'hidden', zIndex: 50, maxHeight: '200px', overflowY: 'auto',
            animation: 'tagDropIn 160ms cubic-bezier(0.32,0.72,0,1) forwards',
          }}>
            {filtered.length > 0 ? filtered.map((option, i) => (
              <div
                key={option.value}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={e => { e.preventDefault(); addTag(option) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 10px', cursor: 'pointer',
                  background: i === activeIndex ? 'rgba(10,10,10,0.05)' : 'transparent',
                  transition: 'background 80ms ease',
                }}
              >
                {option.color && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: option.color, flexShrink: 0 }} />}
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT }}>
                  {option.label}
                </span>
              </div>
            )) : (
              <div style={{ padding: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>No matches</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TagInputPage() {
  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: FONT }}>
      <style>{`
        @keyframes tagDropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
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
        padding: '60px 24px',
      }}>
        <Demo />
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
