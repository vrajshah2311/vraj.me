'use client'

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  'React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js',
  'GraphQL', 'REST API', 'PostgreSQL', 'Redis', 'Docker',
  'Kubernetes', 'AWS', 'Vercel', 'Figma', 'Framer Motion',
  'Zustand', 'Prisma', 'tRPC', 'Zod', 'Vite',
  'Testing Library', 'Playwright', 'Storybook', 'Turborepo', 'pnpm',
]

// ─── TagInput ─────────────────────────────────────────────────────────────────

function TagInput() {
  const [tags, setTags] = useState<string[]>(['React', 'TypeScript'])
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [focused, setFocused] = useState(false)
  const [removingIdx, setRemovingIdx] = useState<number | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filtered = input.trim()
    ? SUGGESTIONS.filter(s =>
        s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
      ).slice(0, 6)
    : SUGGESTIONS.filter(s => !tags.includes(s)).slice(0, 6)

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

  // Scroll active option into view
  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const el = listRef.current.children[activeIdx] as HTMLElement
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIdx])

  const addTag = useCallback((value: string) => {
    const trimmed = value.trim()
    if (!trimmed || tags.includes(trimmed)) return
    setTags(prev => [...prev, trimmed])
    setInput('')
    setOpen(false)
    setActiveIdx(-1)
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [tags])

  const removeTag = useCallback((idx: number) => {
    setRemovingIdx(idx)
    setTimeout(() => {
      setTags(prev => prev.filter((_, i) => i !== idx))
      setRemovingIdx(null)
    }, 150)
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActiveIdx(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIdx >= 0 && filtered[activeIdx]) {
        addTag(filtered[activeIdx])
      } else if (input.trim()) {
        addTag(input.trim())
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIdx(-1)
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags.length - 1)
    } else if (e.key === ',') {
      e.preventDefault()
      if (input.trim()) addTag(input.trim())
    }
  }, [activeIdx, filtered, input, tags, addTag, removeTag])

  return (
    <div style={{ width: '480px', maxWidth: '100%' }}>
      <div ref={containerRef} style={{ position: 'relative' }}>
        {/* Field */}
        <div
          onClick={() => inputRef.current?.focus()}
          style={{
            background: '#fff',
            border: `1.5px solid ${focused ? 'rgba(10,10,10,0.3)' : 'rgba(10,10,10,0.12)'}`,
            borderRadius: '12px',
            padding: '8px 10px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            alignItems: 'center',
            cursor: 'text',
            transition: 'border-color 150ms ease, box-shadow 150ms ease',
            boxShadow: focused
              ? '0 0 0 3px rgba(10,10,10,0.06)'
              : '0 1px 2px rgba(0,0,0,0.04)',
            minHeight: '46px',
          }}
        >
          {tags.map((tag, idx) => (
            <span
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: removingIdx === idx ? 'transparent' : 'rgba(10,10,10,0.06)',
                border: '1px solid rgba(10,10,10,0.08)',
                borderRadius: '6px',
                padding: '3px 8px 3px 9px',
                fontSize: '12.5px',
                fontWeight: 500,
                color: removingIdx === idx ? 'transparent' : 'var(--text-primary, #0a0a0a)',
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                transform: removingIdx === idx ? 'scale(0.85)' : 'scale(1)',
                opacity: removingIdx === idx ? 0 : 1,
                transition: 'opacity 150ms ease, transform 150ms ease, background 150ms ease',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {tag}
              <button
                onMouseDown={e => { e.preventDefault(); removeTag(idx) }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(10,10,10,0.35)',
                  fontSize: '11px',
                  lineHeight: 1,
                  width: '14px',
                  height: '14px',
                  borderRadius: '3px',
                  transition: 'color 120ms ease, background 120ms ease',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget.style.color = '#0a0a0a')
                  ;(e.currentTarget.style.background = 'rgba(10,10,10,0.08)')
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget.style.color = 'rgba(10,10,10,0.35)')
                  ;(e.currentTarget.style.background = 'none')
                }}
                tabIndex={-1}
                aria-label={`Remove ${tag}`}
              >
                ✕
              </button>
            </span>
          ))}

          <input
            ref={inputRef}
            value={input}
            onChange={e => {
              setInput(e.target.value)
              setOpen(true)
              setActiveIdx(-1)
            }}
            onFocus={() => { setFocused(true); setOpen(true) }}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? 'Add tags…' : ''}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-primary, #0a0a0a)',
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              flex: '1 1 80px',
              minWidth: '60px',
              padding: '3px 2px',
              lineHeight: '20px',
            }}
          />
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
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            zIndex: 100,
            opacity: open && filtered.length > 0 ? 1 : 0,
            transform: open && filtered.length > 0 ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.98)',
            pointerEvents: open && filtered.length > 0 ? 'auto' : 'none',
            transition: 'opacity 150ms cubic-bezier(0.16,1,0.3,1), transform 150ms cubic-bezier(0.16,1,0.3,1)',
            transformOrigin: 'top center',
          }}
        >
          <ul
            ref={listRef}
            style={{
              margin: 0,
              padding: '4px',
              listStyle: 'none',
              maxHeight: '220px',
              overflowY: 'auto',
            }}
          >
            {filtered.map((s, idx) => (
              <li
                key={s}
                onMouseDown={e => { e.preventDefault(); addTag(s) }}
                onMouseEnter={() => setActiveIdx(idx)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--text-primary, #0a0a0a)',
                  letterSpacing: '-0.01em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                  cursor: 'pointer',
                  background: activeIdx === idx ? 'rgba(10,10,10,0.05)' : 'transparent',
                  transition: 'background 100ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{s}</span>
                {activeIdx === idx && (
                  <span style={{
                    fontSize: '11px',
                    color: 'rgba(10,10,10,0.35)',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                  }}>
                    ↵ select
                  </span>
                )}
              </li>
            ))}
          </ul>

          {/* Footer hint */}
          <div style={{
            borderTop: '1px solid rgba(10,10,10,0.06)',
            padding: '7px 14px',
            display: 'flex',
            gap: '12px',
          }}>
            {[
              ['↵', 'confirm'],
              ['⌫', 'remove last'],
              [',', 'add custom'],
            ].map(([key, label]) => (
              <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'rgba(10,10,10,0.35)', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                <kbd style={{
                  display: 'inline-block',
                  padding: '1px 5px',
                  background: 'rgba(10,10,10,0.05)',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontFamily: 'inherit',
                  color: 'rgba(10,10,10,0.5)',
                  border: '1px solid rgba(10,10,10,0.08)',
                  lineHeight: '16px',
                }}>
                  {key}
                </kbd>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Helper text */}
      <p style={{
        margin: '10px 0 0',
        fontSize: '12px',
        color: 'rgba(10,10,10,0.4)',
        fontWeight: 500,
        letterSpacing: '-0.01em',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}>
        {tags.length === 0
          ? 'No tags yet — type to search or add custom tags'
          : `${tags.length} tag${tags.length === 1 ? '' : 's'} · type to add more`}
      </p>
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react'

const SUGGESTIONS = [
  'React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js',
  'GraphQL', 'REST API', 'PostgreSQL', 'Redis', 'Docker',
  // add your own options here…
]

export function TagInput() {
  const [tags, setTags] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [focused, setFocused] = useState(false)
  const [removingIdx, setRemovingIdx] = useState<number | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filtered = input.trim()
    ? SUGGESTIONS.filter(s =>
        s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
      ).slice(0, 6)
    : SUGGESTIONS.filter(s => !tags.includes(s)).slice(0, 6)

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
    if (activeIdx >= 0 && listRef.current) {
      const el = listRef.current.children[activeIdx] as HTMLElement
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIdx])

  const addTag = useCallback((value: string) => {
    const trimmed = value.trim()
    if (!trimmed || tags.includes(trimmed)) return
    setTags(prev => [...prev, trimmed])
    setInput('')
    setOpen(false)
    setActiveIdx(-1)
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [tags])

  const removeTag = useCallback((idx: number) => {
    setRemovingIdx(idx)
    setTimeout(() => {
      setTags(prev => prev.filter((_, i) => i !== idx))
      setRemovingIdx(null)
    }, 150)
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActiveIdx(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIdx >= 0 && filtered[activeIdx]) {
        addTag(filtered[activeIdx])
      } else if (input.trim()) {
        addTag(input.trim())
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIdx(-1)
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags.length - 1)
    } else if (e.key === ',') {
      e.preventDefault()
      if (input.trim()) addTag(input.trim())
    }
  }, [activeIdx, filtered, input, tags, addTag, removeTag])

  return (
    <div style={{ width: '480px', maxWidth: '100%' }}>
      <div ref={containerRef} style={{ position: 'relative' }}>
        {/* Field */}
        <div
          onClick={() => inputRef.current?.focus()}
          style={{
            background: '#fff',
            border: \`1.5px solid \${focused ? 'rgba(10,10,10,0.3)' : 'rgba(10,10,10,0.12)'}\`,
            borderRadius: '12px',
            padding: '8px 10px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            alignItems: 'center',
            cursor: 'text',
            transition: 'border-color 150ms ease, box-shadow 150ms ease',
            boxShadow: focused
              ? '0 0 0 3px rgba(10,10,10,0.06)'
              : '0 1px 2px rgba(0,0,0,0.04)',
            minHeight: '46px',
          }}
        >
          {tags.map((tag, idx) => (
            <span
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: removingIdx === idx ? 'transparent' : 'rgba(10,10,10,0.06)',
                border: '1px solid rgba(10,10,10,0.08)',
                borderRadius: '6px',
                padding: '3px 8px 3px 9px',
                fontSize: '12.5px',
                fontWeight: 500,
                color: removingIdx === idx ? 'transparent' : '#0a0a0a',
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                transform: removingIdx === idx ? 'scale(0.85)' : 'scale(1)',
                opacity: removingIdx === idx ? 0 : 1,
                transition: 'opacity 150ms ease, transform 150ms ease',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {tag}
              <button
                onMouseDown={e => { e.preventDefault(); removeTag(idx) }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(10,10,10,0.35)', fontSize: '11px', lineHeight: 1,
                  width: '14px', height: '14px', borderRadius: '3px',
                  transition: 'color 120ms ease',
                  flexShrink: 0,
                }}
                tabIndex={-1}
                aria-label={\`Remove \${tag}\`}
              >✕</button>
            </span>
          ))}

          <input
            ref={inputRef}
            value={input}
            onChange={e => { setInput(e.target.value); setOpen(true); setActiveIdx(-1) }}
            onFocus={() => { setFocused(true); setOpen(true) }}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? 'Add tags…' : ''}
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              fontSize: '13px', fontWeight: 500, color: '#0a0a0a',
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              flex: '1 1 80px', minWidth: '60px',
              padding: '3px 2px', lineHeight: '20px',
            }}
          />
        </div>

        {/* Dropdown */}
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
            background: '#fff',
            border: '1px solid rgba(10,10,10,0.08)',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
            overflow: 'hidden', zIndex: 100,
            opacity: open && filtered.length > 0 ? 1 : 0,
            transform: open && filtered.length > 0 ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.98)',
            pointerEvents: open && filtered.length > 0 ? 'auto' : 'none',
            transition: 'opacity 150ms cubic-bezier(0.16,1,0.3,1), transform 150ms cubic-bezier(0.16,1,0.3,1)',
            transformOrigin: 'top center',
          }}
        >
          <ul ref={listRef} style={{ margin: 0, padding: '4px', listStyle: 'none', maxHeight: '220px', overflowY: 'auto' }}>
            {filtered.map((s, idx) => (
              <li
                key={s}
                onMouseDown={e => { e.preventDefault(); addTag(s) }}
                onMouseEnter={() => setActiveIdx(idx)}
                style={{
                  padding: '8px 10px', borderRadius: '8px',
                  fontSize: '13px', fontWeight: 500, color: '#0a0a0a',
                  letterSpacing: '-0.01em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                  cursor: 'pointer',
                  background: activeIdx === idx ? 'rgba(10,10,10,0.05)' : 'transparent',
                  transition: 'background 100ms ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <span>{s}</span>
                {activeIdx === idx && (
                  <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.35)', fontWeight: 500 }}>↵ select</span>
                )}
              </li>
            ))}
          </ul>
          <div style={{ borderTop: '1px solid rgba(10,10,10,0.06)', padding: '7px 14px', display: 'flex', gap: '12px' }}>
            {[['↵','confirm'],['⌫','remove last'],[',','add custom']].map(([key, label]) => (
              <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'rgba(10,10,10,0.35)', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
                <kbd style={{ display: 'inline-block', padding: '1px 5px', background: 'rgba(10,10,10,0.05)', borderRadius: '4px', fontSize: '11px', color: 'rgba(10,10,10,0.5)', border: '1px solid rgba(10,10,10,0.08)', lineHeight: '16px' }}>{key}</kbd>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TagInputPage() {
  return (
    <main style={{
      backgroundColor: 'var(--bg, #ffffff)',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
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
      }}>
        <TagInput />
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
