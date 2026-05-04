'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Data ─────────────────────────────────────────────────────────────────────

const ALL_SUGGESTIONS = [
  'React', 'TypeScript', 'Next.js', 'Tailwind', 'Node.js',
  'GraphQL', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes',
  'Python', 'Rust', 'Go', 'Figma', 'Framer',
  'AWS', 'Vercel', 'Prisma', 'tRPC', 'Supabase',
]

const PALETTE = [
  { bg: 'rgba(37,99,235,0.09)',  text: '#1d4ed8', border: 'rgba(37,99,235,0.2)'  },
  { bg: 'rgba(22,163,74,0.09)',  text: '#15803d', border: 'rgba(22,163,74,0.2)'  },
  { bg: 'rgba(217,119,6,0.09)', text: '#b45309', border: 'rgba(217,119,6,0.2)'  },
  { bg: 'rgba(139,92,246,0.09)', text: '#7c3aed', border: 'rgba(139,92,246,0.2)' },
  { bg: 'rgba(236,72,153,0.09)', text: '#be185d', border: 'rgba(236,72,153,0.2)' },
]

function getColor(tag: string) {
  let h = 0
  for (let i = 0; i < tag.length; i++) h = tag.charCodeAt(i) + h * 31
  return PALETTE[Math.abs(h) % PALETTE.length]
}

// ─── TagInput ─────────────────────────────────────────────────────────────────

function TagInput() {
  const [tags, setTags]     = useState<string[]>(['React', 'TypeScript'])
  const [input, setInput]   = useState('')
  const [open, setOpen]     = useState(false)
  const [hilite, setHilite] = useState(0)
  const [dying, setDying]   = useState<string | null>(null)
  const [born, setBorn]     = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef  = useRef<HTMLDivElement>(null)

  const filtered = ALL_SUGGESTIONS.filter(s =>
    !tags.includes(s) && s.toLowerCase().includes(input.toLowerCase())
  )
  const showDrop = open && (input.length > 0 ? true : filtered.length > 0)

  const addTag = useCallback((tag: string) => {
    if (tags.includes(tag)) return
    setBorn(tag)
    setTags(p => [...p, tag])
    setInput('')
    setHilite(0)
    setTimeout(() => setBorn(null), 200)
    inputRef.current?.focus()
  }, [tags])

  const removeTag = useCallback((tag: string) => {
    setDying(tag)
    setTimeout(() => { setTags(p => p.filter(t => t !== tag)); setDying(null) }, 160)
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault(); setHilite(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); setHilite(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[hilite]) addTag(filtered[hilite])
      else if (input.trim() && !tags.includes(input.trim())) addTag(input.trim())
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    } else if (e.key === 'Escape') {
      setOpen(false); inputRef.current?.blur()
    }
  }

  useEffect(() => { setHilite(0) }, [input])

  useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.children[hilite] as HTMLElement
    if (el) el.scrollIntoView({ block: 'nearest' })
  }, [hilite])

  return (
    <div style={{ width: 360, fontFamily: FONT }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 600,
        color: 'rgba(10,10,10,0.4)', letterSpacing: '0.06em',
        textTransform: 'uppercase', marginBottom: 8,
      }}>
        Skills
      </label>

      {/* ── Input container ── */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          background: '#fff',
          border: `1px solid ${open ? 'rgba(10,10,10,0.18)' : 'rgba(10,10,10,0.1)'}`,
          borderRadius: showDrop ? '12px 12px 0 0' : 12,
          padding: '7px 8px',
          display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center',
          boxShadow: open
            ? '0 0 0 3px rgba(10,10,10,0.05), 0 1px 2px rgba(0,0,0,0.04)'
            : '0 1px 2px rgba(0,0,0,0.04)',
          cursor: 'text',
          transition: 'border-color 150ms ease, box-shadow 150ms ease, border-radius 120ms ease',
          minHeight: 42,
        }}
      >
        {tags.map(tag => {
          const c = getColor(tag)
          const isDying = dying === tag
          const isBorn  = born  === tag
          return (
            <span key={tag} style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              padding: '3px 6px 3px 8px', borderRadius: 7,
              fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em',
              background:  isDying ? 'rgba(10,10,10,0.04)' : c.bg,
              color:       isDying ? 'rgba(10,10,10,0.2)'  : c.text,
              border:      `1px solid ${isDying ? 'rgba(10,10,10,0.07)' : c.border}`,
              transform:   isDying ? 'scale(0.85)' : isBorn ? 'scale(1.06)' : 'scale(1)',
              opacity:     isDying ? 0 : 1,
              transition:  'all 160ms cubic-bezier(0.32,0.72,0,1)',
            }}>
              {tag}
              <button
                onClick={e => { e.stopPropagation(); removeTag(tag) }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '1px 2px', display: 'flex', alignItems: 'center',
                  color: 'inherit', opacity: 0.4, fontSize: 10, lineHeight: 1,
                  borderRadius: 3, transition: 'opacity 100ms ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.4'  }}
              >✕</button>
            </span>
          )
        })}

        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 160)}
          onKeyDown={onKeyDown}
          placeholder={tags.length === 0 ? 'Add a skill…' : ''}
          style={{
            border: 'none', outline: 'none', background: 'transparent',
            fontSize: 13, fontWeight: 500, color: '#0a0a0a', fontFamily: FONT,
            minWidth: 90, flex: 1, letterSpacing: '-0.01em', padding: '2px 4px',
          }}
        />
      </div>

      {/* ── Dropdown ── */}
      {showDrop && (
        <div style={{
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.1)',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}>
          <div ref={listRef} style={{ overflowY: 'auto', maxHeight: 196, padding: '4px 0' }}>
            {filtered.length === 0 ? (
              <div style={{
                padding: '10px 14px', fontSize: 12, fontWeight: 500,
                color: 'rgba(10,10,10,0.38)', fontFamily: FONT,
              }}>
                Press Enter to add &quot;{input}&quot;
              </div>
            ) : filtered.map((s, i) => {
              const c = getColor(s)
              return (
                <div
                  key={s}
                  onMouseDown={e => { e.preventDefault(); addTag(s) }}
                  onMouseEnter={() => setHilite(i)}
                  style={{
                    padding: '8px 14px', cursor: 'pointer',
                    background: i === hilite ? 'rgba(10,10,10,0.04)' : 'transparent',
                    display: 'flex', alignItems: 'center', gap: 10,
                    transition: 'background 80ms ease',
                  }}
                >
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: c.text, flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 13, fontWeight: 500, color: '#0a0a0a',
                    letterSpacing: '-0.01em', fontFamily: FONT,
                  }}>
                    {s}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <p style={{
        marginTop: 10, fontSize: 11, fontWeight: 500,
        color: 'rgba(10,10,10,0.28)', fontFamily: FONT, letterSpacing: '-0.01em',
      }}>
        Type to filter · ↑↓ navigate · Enter to add · Backspace to remove
      </p>
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const ALL_SUGGESTIONS = [
  'React', 'TypeScript', 'Next.js', 'Tailwind', 'Node.js',
  'GraphQL', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes',
  'Python', 'Rust', 'Go', 'Figma', 'Framer',
  'AWS', 'Vercel', 'Prisma', 'tRPC', 'Supabase',
]

const PALETTE = [
  { bg: 'rgba(37,99,235,0.09)',  text: '#1d4ed8', border: 'rgba(37,99,235,0.2)'  },
  { bg: 'rgba(22,163,74,0.09)',  text: '#15803d', border: 'rgba(22,163,74,0.2)'  },
  { bg: 'rgba(217,119,6,0.09)', text: '#b45309', border: 'rgba(217,119,6,0.2)'  },
  { bg: 'rgba(139,92,246,0.09)', text: '#7c3aed', border: 'rgba(139,92,246,0.2)' },
  { bg: 'rgba(236,72,153,0.09)', text: '#be185d', border: 'rgba(236,72,153,0.2)' },
]

function getColor(tag: string) {
  let h = 0
  for (let i = 0; i < tag.length; i++) h = tag.charCodeAt(i) + h * 31
  return PALETTE[Math.abs(h) % PALETTE.length]
}

export function TagInput() {
  const [tags, setTags]     = useState<string[]>([])
  const [input, setInput]   = useState('')
  const [open, setOpen]     = useState(false)
  const [hilite, setHilite] = useState(0)
  const [dying, setDying]   = useState<string | null>(null)
  const [born, setBorn]     = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef  = useRef<HTMLDivElement>(null)

  const filtered = ALL_SUGGESTIONS.filter(s =>
    !tags.includes(s) && s.toLowerCase().includes(input.toLowerCase())
  )
  const showDrop = open && (input.length > 0 ? true : filtered.length > 0)

  const addTag = useCallback((tag: string) => {
    if (tags.includes(tag)) return
    setBorn(tag)
    setTags(p => [...p, tag])
    setInput('')
    setHilite(0)
    setTimeout(() => setBorn(null), 200)
    inputRef.current?.focus()
  }, [tags])

  const removeTag = useCallback((tag: string) => {
    setDying(tag)
    setTimeout(() => { setTags(p => p.filter(t => t !== tag)); setDying(null) }, 160)
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault(); setHilite(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); setHilite(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[hilite]) addTag(filtered[hilite])
      else if (input.trim() && !tags.includes(input.trim())) addTag(input.trim())
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    } else if (e.key === 'Escape') {
      setOpen(false); inputRef.current?.blur()
    }
  }

  useEffect(() => { setHilite(0) }, [input])

  useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.children[hilite] as HTMLElement
    if (el) el.scrollIntoView({ block: 'nearest' })
  }, [hilite])

  return (
    <div style={{ width: 360, fontFamily: FONT }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 600,
        color: 'rgba(10,10,10,0.4)', letterSpacing: '0.06em',
        textTransform: 'uppercase', marginBottom: 8,
      }}>
        Skills
      </label>

      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          background: '#fff',
          border: \`1px solid \${open ? 'rgba(10,10,10,0.18)' : 'rgba(10,10,10,0.1)'}\`,
          borderRadius: showDrop ? '12px 12px 0 0' : 12,
          padding: '7px 8px',
          display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center',
          boxShadow: open
            ? '0 0 0 3px rgba(10,10,10,0.05), 0 1px 2px rgba(0,0,0,0.04)'
            : '0 1px 2px rgba(0,0,0,0.04)',
          cursor: 'text',
          transition: 'border-color 150ms ease, box-shadow 150ms ease, border-radius 120ms ease',
          minHeight: 42,
        }}
      >
        {tags.map(tag => {
          const c = getColor(tag)
          const isDying = dying === tag
          const isBorn  = born  === tag
          return (
            <span key={tag} style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              padding: '3px 6px 3px 8px', borderRadius: 7,
              fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em',
              background:  isDying ? 'rgba(10,10,10,0.04)' : c.bg,
              color:       isDying ? 'rgba(10,10,10,0.2)'  : c.text,
              border:      \`1px solid \${isDying ? 'rgba(10,10,10,0.07)' : c.border}\`,
              transform:   isDying ? 'scale(0.85)' : isBorn ? 'scale(1.06)' : 'scale(1)',
              opacity:     isDying ? 0 : 1,
              transition:  'all 160ms cubic-bezier(0.32,0.72,0,1)',
            }}>
              {tag}
              <button
                onClick={e => { e.stopPropagation(); removeTag(tag) }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '1px 2px', display: 'flex', alignItems: 'center',
                  color: 'inherit', opacity: 0.4, fontSize: 10, lineHeight: 1,
                  borderRadius: 3, transition: 'opacity 100ms ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.4'  }}
              >✕</button>
            </span>
          )
        })}

        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 160)}
          onKeyDown={onKeyDown}
          placeholder={tags.length === 0 ? 'Add a skill…' : ''}
          style={{
            border: 'none', outline: 'none', background: 'transparent',
            fontSize: 13, fontWeight: 500, color: '#0a0a0a', fontFamily: FONT,
            minWidth: 90, flex: 1, letterSpacing: '-0.01em', padding: '2px 4px',
          }}
        />
      </div>

      {showDrop && (
        <div style={{
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.1)',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}>
          <div ref={listRef} style={{ overflowY: 'auto', maxHeight: 196, padding: '4px 0' }}>
            {filtered.length === 0 ? (
              <div style={{
                padding: '10px 14px', fontSize: 12, fontWeight: 500,
                color: 'rgba(10,10,10,0.38)', fontFamily: FONT,
              }}>
                Press Enter to add "{input}"
              </div>
            ) : filtered.map((s, i) => {
              const c = getColor(s)
              return (
                <div
                  key={s}
                  onMouseDown={e => { e.preventDefault(); addTag(s) }}
                  onMouseEnter={() => setHilite(i)}
                  style={{
                    padding: '8px 14px', cursor: 'pointer',
                    background: i === hilite ? 'rgba(10,10,10,0.04)' : 'transparent',
                    display: 'flex', alignItems: 'center', gap: 10,
                    transition: 'background 80ms ease',
                  }}
                >
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: c.text, flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 13, fontWeight: 500, color: '#0a0a0a',
                    letterSpacing: '-0.01em', fontFamily: FONT,
                  }}>
                    {s}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <p style={{
        marginTop: 10, fontSize: 11, fontWeight: 500,
        color: 'rgba(10,10,10,0.28)', fontFamily: FONT, letterSpacing: '-0.01em',
      }}>
        Type to filter · ↑↓ navigate · Enter to add · Backspace to remove
      </p>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TagInputPage() {
  return (
    <main style={{ backgroundColor: 'var(--bg, #ffffff)', minHeight: '100vh', fontFamily: FONT }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: 20,
      }}>
        <TagInput />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: 760, margin: '0 auto' }}>
        <p style={{
          fontSize: 11, fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'var(--text-muted, rgba(10,10,10,0.4))', marginBottom: 12,
        }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 20, overflowX: 'auto' }}>
          <pre style={{
            margin: 0,
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
            fontSize: 12, lineHeight: '1.65',
            color: '#e5e5e5', whiteSpace: 'pre', overflowX: 'auto',
          }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
