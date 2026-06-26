'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const SUGGESTIONS = [
  'React', 'TypeScript', 'Next.js', 'Tailwind', 'CSS',
  'Node.js', 'GraphQL', 'PostgreSQL', 'Redis', 'Docker',
  'Figma', 'Design', 'Motion', 'Animation', 'Performance',
  'Accessibility', 'Testing', 'DevOps', 'Security', 'API',
]

const TAG_COLORS = [
  { bg: 'rgba(59,130,246,0.08)', text: 'rgba(37,99,235,0.9)', border: 'rgba(59,130,246,0.15)' },
  { bg: 'rgba(16,185,129,0.08)', text: 'rgba(5,150,105,0.9)', border: 'rgba(16,185,129,0.15)' },
  { bg: 'rgba(245,158,11,0.08)', text: 'rgba(217,119,6,0.9)', border: 'rgba(245,158,11,0.15)' },
  { bg: 'rgba(239,68,68,0.08)', text: 'rgba(220,38,38,0.9)', border: 'rgba(239,68,68,0.15)' },
  { bg: 'rgba(168,85,247,0.08)', text: 'rgba(147,51,234,0.9)', border: 'rgba(168,85,247,0.15)' },
  { bg: 'rgba(236,72,153,0.08)', text: 'rgba(219,39,119,0.9)', border: 'rgba(236,72,153,0.15)' },
]

function getTagColor(label: string) {
  let hash = 0
  for (let i = 0; i < label.length; i++) hash = label.charCodeAt(i) + ((hash << 5) - hash)
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length]
}

type Tag = { id: string; label: string }

function TagInput({
  initialTags = [
    { id: '1', label: 'React' },
    { id: '2', label: 'TypeScript' },
    { id: '3', label: 'Design' },
  ],
  maxTags = 10,
  placeholder = 'Add tags...',
}: {
  initialTags?: Tag[]
  maxTags?: number
  placeholder?: string
}) {
  const [tags, setTags] = useState<Tag[]>(initialTags)
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const suggestions = SUGGESTIONS
    .filter(s => s.toLowerCase().includes(input.toLowerCase()) && input.length > 0)
    .filter(s => !tags.some(t => t.label.toLowerCase() === s.toLowerCase()))
    .slice(0, 6)

  const canCreate =
    input.trim().length > 0 &&
    !tags.some(t => t.label.toLowerCase() === input.trim().toLowerCase()) &&
    !suggestions.some(s => s.toLowerCase() === input.trim().toLowerCase())
  const showDropdown = focused && input.trim().length > 0 && (suggestions.length > 0 || canCreate)
  const atMax = tags.length >= maxTags

  const addTag = useCallback(
    (label: string) => {
      const trimmed = label.trim()
      if (!trimmed || tags.some(t => t.label.toLowerCase() === trimmed.toLowerCase()) || atMax) return
      setTags(prev => [...prev, { id: String(Date.now()), label: trimmed }])
      setInput('')
      setActiveIdx(-1)
      inputRef.current?.focus()
    },
    [tags, atMax],
  )

  const removeTag = useCallback((id: string) => {
    setRemovingId(id)
    setTimeout(() => {
      setTags(prev => prev.filter(t => t.id !== id))
      setRemovingId(null)
    }, 150)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (activeIdx >= 0 && activeIdx < suggestions.length) addTag(suggestions[activeIdx])
      else if (activeIdx === suggestions.length && canCreate) addTag(input)
      else if (input.trim()) addTag(input)
      return
    }
    if (e.key === 'Tab' && showDropdown) {
      e.preventDefault()
      if (suggestions[0]) addTag(suggestions[0])
      else addTag(input)
      return
    }
    if (e.key === 'ArrowDown' && showDropdown) {
      e.preventDefault()
      const max = suggestions.length + (canCreate ? 0 : -1)
      setActiveIdx(i => Math.min(i + 1, max))
      return
    }
    if (e.key === 'ArrowUp' && showDropdown) {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
      return
    }
    if (e.key === 'Escape') {
      setInput('')
      setActiveIdx(-1)
      inputRef.current?.blur()
      return
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1].id)
    }
  }

  useEffect(() => { setActiveIdx(-1) }, [input])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const borderColor = focused ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.09)'

  return (
    <div ref={containerRef} style={{ position: 'relative', fontFamily: font }}>
      {/* Input container */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          minHeight: 44,
          padding: '6px 8px',
          background: '#fff',
          borderRadius: 10,
          border: `1px solid ${borderColor}`,
          boxShadow: focused ? '0 0 0 3px rgba(0,0,0,0.04)' : 'none',
          display: 'flex',
          flexWrap: 'wrap' as const,
          gap: 4,
          alignItems: 'center',
          cursor: 'text',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        }}
      >
        {tags.map(tag => {
          const color = getTagColor(tag.label)
          const isRemoving = removingId === tag.id
          return (
            <div
              key={tag.id}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 7px 3px 8px',
                background: color.bg,
                border: `1px solid ${color.border}`,
                borderRadius: 6,
                fontSize: 12, fontWeight: 500,
                color: color.text,
                letterSpacing: '-0.005em',
                transform: isRemoving ? 'scale(0.8)' : 'scale(1)',
                opacity: isRemoving ? 0 : 1,
                transition: 'transform 0.15s ease, opacity 0.15s ease',
                userSelect: 'none' as const,
              }}
            >
              {tag.label}
              <button
                onMouseDown={e => { e.preventDefault(); removeTag(tag.id) }}
                style={{
                  background: 'none', border: 'none', padding: '1px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  color: 'inherit', opacity: 0.55,
                  transition: 'opacity 0.12s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.55')}
              >
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 1.5L7.5 7.5M7.5 1.5L1.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )
        })}

        {!atMax && (
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            style={{
              flex: 1, minWidth: 80, border: 'none', outline: 'none',
              background: 'transparent', fontSize: 13, fontWeight: 500,
              color: '#0a0a0a', letterSpacing: '-0.01em',
              fontFamily: 'inherit', padding: '3px 4px',
            }}
          />
        )}

        <span style={{
          fontSize: 11, fontWeight: 500,
          color: atMax ? 'rgba(220,38,38,0.7)' : 'rgba(0,0,0,0.25)',
          letterSpacing: '-0.01em', marginLeft: 'auto', paddingRight: 4, flexShrink: 0,
        }}>
          {tags.length}/{maxTags}
        </span>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: '#fff', borderRadius: 10,
          border: '1px solid rgba(0,0,0,0.09)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.03), 0 12px 32px rgba(0,0,0,0.08)',
          overflow: 'hidden', zIndex: 50,
        }}>
          {suggestions.map((s, i) => (
            <div
              key={s}
              onMouseDown={e => { e.preventDefault(); addTag(s) }}
              onMouseEnter={() => setActiveIdx(i)}
              style={{
                padding: '8px 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer',
                background: i === activeIdx ? 'rgba(0,0,0,0.04)' : 'transparent',
                transition: 'background 0.08s ease',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                {s}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.3)', fontWeight: 500 }}>↵</span>
            </div>
          ))}

          {canCreate && (
            <>
              {suggestions.length > 0 && <div style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />}
              <div
                onMouseDown={e => { e.preventDefault(); addTag(input) }}
                onMouseEnter={() => setActiveIdx(suggestions.length)}
                style={{
                  padding: '8px 12px',
                  display: 'flex', alignItems: 'center', gap: 6,
                  cursor: 'pointer',
                  background: activeIdx === suggestions.length ? 'rgba(0,0,0,0.04)' : 'transparent',
                  transition: 'background 0.08s ease',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 2.5V9.5M2.5 6H9.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                  Create &ldquo;{input.trim()}&rdquo;
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function Demo() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
      padding: '40px 24px',
      fontFamily: font,
    }}>
      <div style={{
        width: '100%', maxWidth: 440,
        background: '#fff',
        borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)',
        padding: '24px',
      }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
            New Post
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.35)', marginTop: 2 }}>
            Fill in the details below
          </div>
        </div>

        {/* Title field */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block', fontSize: 11, fontWeight: 600,
            color: 'rgba(0,0,0,0.45)', letterSpacing: '0.04em',
            textTransform: 'uppercase' as const, marginBottom: 6,
          }}>
            Title
          </label>
          <input
            defaultValue="Building a design system from scratch"
            style={{
              width: '100%', padding: '9px 12px',
              border: '1px solid rgba(0,0,0,0.09)', borderRadius: 10,
              fontSize: 13, fontWeight: 500, color: '#0a0a0a',
              background: '#fff', outline: 'none',
              letterSpacing: '-0.01em', fontFamily: 'inherit',
              boxSizing: 'border-box' as const,
              transition: 'border-color 0.15s ease',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.18)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.09)')}
          />
        </div>

        {/* Tags field */}
        <div>
          <label style={{
            display: 'block', fontSize: 11, fontWeight: 600,
            color: 'rgba(0,0,0,0.45)', letterSpacing: '0.04em',
            textTransform: 'uppercase' as const, marginBottom: 6,
          }}>
            Tags
          </label>
          <TagInput />
          <div style={{
            marginTop: 8, fontSize: 11, fontWeight: 500,
            color: 'rgba(0,0,0,0.28)', letterSpacing: '-0.01em',
          }}>
            Type to search · ↵ or , to add · Backspace to remove
          </div>
        </div>

        {/* Footer buttons */}
        <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
          <button
            style={{
              flex: 1, padding: '9px 16px',
              background: '#0a0a0a', border: 'none',
              borderRadius: 10, color: '#fff',
              fontSize: 13, fontWeight: 600,
              cursor: 'pointer', letterSpacing: '-0.01em',
              fontFamily: 'inherit',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Publish
          </button>
          <button
            style={{
              padding: '9px 16px',
              background: 'transparent',
              border: '1px solid rgba(0,0,0,0.09)',
              borderRadius: 10, color: '#0a0a0a',
              fontSize: 13, fontWeight: 500,
              cursor: 'pointer', letterSpacing: '-0.01em',
              fontFamily: 'inherit',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>
  )
}

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
        borderRadius: 7, color: copied ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
        fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: font,
        letterSpacing: '-0.01em', transition: 'background 0.15s ease, color 0.15s ease',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

const CODE_SOURCE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const SUGGESTIONS = [
  'React', 'TypeScript', 'Next.js', 'Tailwind', 'CSS',
  'Node.js', 'GraphQL', 'PostgreSQL', 'Redis', 'Docker',
  'Figma', 'Design', 'Motion', 'Animation', 'Performance',
  'Accessibility', 'Testing', 'DevOps', 'Security', 'API',
]

const TAG_COLORS = [
  { bg: 'rgba(59,130,246,0.08)', text: 'rgba(37,99,235,0.9)', border: 'rgba(59,130,246,0.15)' },
  { bg: 'rgba(16,185,129,0.08)', text: 'rgba(5,150,105,0.9)', border: 'rgba(16,185,129,0.15)' },
  { bg: 'rgba(245,158,11,0.08)', text: 'rgba(217,119,6,0.9)', border: 'rgba(245,158,11,0.15)' },
  { bg: 'rgba(239,68,68,0.08)', text: 'rgba(220,38,38,0.9)', border: 'rgba(239,68,68,0.15)' },
  { bg: 'rgba(168,85,247,0.08)', text: 'rgba(147,51,234,0.9)', border: 'rgba(168,85,247,0.15)' },
  { bg: 'rgba(236,72,153,0.08)', text: 'rgba(219,39,119,0.9)', border: 'rgba(236,72,153,0.15)' },
]

function getTagColor(label) {
  let hash = 0
  for (let i = 0; i < label.length; i++) hash = label.charCodeAt(i) + ((hash << 5) - hash)
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length]
}

export default function TagInput({
  initialTags = [
    { id: '1', label: 'React' },
    { id: '2', label: 'TypeScript' },
    { id: '3', label: 'Design' },
  ],
  maxTags = 10,
  placeholder = 'Add tags...',
}) {
  const [tags, setTags] = useState(initialTags)
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [removingId, setRemovingId] = useState(null)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  const suggestions = SUGGESTIONS
    .filter(s => s.toLowerCase().includes(input.toLowerCase()) && input.length > 0)
    .filter(s => !tags.some(t => t.label.toLowerCase() === s.toLowerCase()))
    .slice(0, 6)

  const canCreate =
    input.trim().length > 0 &&
    !tags.some(t => t.label.toLowerCase() === input.trim().toLowerCase()) &&
    !suggestions.some(s => s.toLowerCase() === input.trim().toLowerCase())
  const showDropdown = focused && input.trim().length > 0 && (suggestions.length > 0 || canCreate)
  const atMax = tags.length >= maxTags

  const addTag = useCallback(
    (label) => {
      const trimmed = label.trim()
      if (!trimmed || tags.some(t => t.label.toLowerCase() === trimmed.toLowerCase()) || atMax) return
      setTags(prev => [...prev, { id: String(Date.now()), label: trimmed }])
      setInput('')
      setActiveIdx(-1)
      inputRef.current?.focus()
    },
    [tags, atMax],
  )

  const removeTag = useCallback((id) => {
    setRemovingId(id)
    setTimeout(() => {
      setTags(prev => prev.filter(t => t.id !== id))
      setRemovingId(null)
    }, 150)
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (activeIdx >= 0 && activeIdx < suggestions.length) addTag(suggestions[activeIdx])
      else if (activeIdx === suggestions.length && canCreate) addTag(input)
      else if (input.trim()) addTag(input)
      return
    }
    if (e.key === 'Tab' && showDropdown) {
      e.preventDefault()
      if (suggestions[0]) addTag(suggestions[0])
      else addTag(input)
      return
    }
    if (e.key === 'ArrowDown' && showDropdown) {
      e.preventDefault()
      const max = suggestions.length + (canCreate ? 0 : -1)
      setActiveIdx(i => Math.min(i + 1, max))
      return
    }
    if (e.key === 'ArrowUp' && showDropdown) {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
      return
    }
    if (e.key === 'Escape') {
      setInput('')
      setActiveIdx(-1)
      inputRef.current?.blur()
      return
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1].id)
    }
  }

  useEffect(() => { setActiveIdx(-1) }, [input])

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const borderColor = focused ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.09)'

  return (
    <div ref={containerRef} style={{ position: 'relative', fontFamily: font }}>
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          minHeight: 44,
          padding: '6px 8px',
          background: '#fff',
          borderRadius: 10,
          border: \`1px solid \${borderColor}\`,
          boxShadow: focused ? '0 0 0 3px rgba(0,0,0,0.04)' : 'none',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          alignItems: 'center',
          cursor: 'text',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        }}
      >
        {tags.map(tag => {
          const color = getTagColor(tag.label)
          const isRemoving = removingId === tag.id
          return (
            <div
              key={tag.id}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 7px 3px 8px',
                background: color.bg,
                border: \`1px solid \${color.border}\`,
                borderRadius: 6,
                fontSize: 12, fontWeight: 500,
                color: color.text,
                letterSpacing: '-0.005em',
                transform: isRemoving ? 'scale(0.8)' : 'scale(1)',
                opacity: isRemoving ? 0 : 1,
                transition: 'transform 0.15s ease, opacity 0.15s ease',
                userSelect: 'none',
              }}
            >
              {tag.label}
              <button
                onMouseDown={e => { e.preventDefault(); removeTag(tag.id) }}
                style={{
                  background: 'none', border: 'none', padding: '1px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  color: 'inherit', opacity: 0.55,
                  transition: 'opacity 0.12s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.55')}
              >
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 1.5L7.5 7.5M7.5 1.5L1.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )
        })}

        {!atMax && (
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            style={{
              flex: 1, minWidth: 80, border: 'none', outline: 'none',
              background: 'transparent', fontSize: 13, fontWeight: 500,
              color: '#0a0a0a', letterSpacing: '-0.01em',
              fontFamily: 'inherit', padding: '3px 4px',
            }}
          />
        )}

        <span style={{
          fontSize: 11, fontWeight: 500,
          color: atMax ? 'rgba(220,38,38,0.7)' : 'rgba(0,0,0,0.25)',
          letterSpacing: '-0.01em', marginLeft: 'auto', paddingRight: 4, flexShrink: 0,
        }}>
          {tags.length}/{maxTags}
        </span>
      </div>

      {showDropdown && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: '#fff', borderRadius: 10,
          border: '1px solid rgba(0,0,0,0.09)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.03), 0 12px 32px rgba(0,0,0,0.08)',
          overflow: 'hidden', zIndex: 50,
        }}>
          {suggestions.map((s, i) => (
            <div
              key={s}
              onMouseDown={e => { e.preventDefault(); addTag(s) }}
              onMouseEnter={() => setActiveIdx(i)}
              style={{
                padding: '8px 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer',
                background: i === activeIdx ? 'rgba(0,0,0,0.04)' : 'transparent',
                transition: 'background 0.08s ease',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                {s}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.3)', fontWeight: 500 }}>↵</span>
            </div>
          ))}

          {canCreate && (
            <>
              {suggestions.length > 0 && <div style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />}
              <div
                onMouseDown={e => { e.preventDefault(); addTag(input) }}
                onMouseEnter={() => setActiveIdx(suggestions.length)}
                style={{
                  padding: '8px 12px',
                  display: 'flex', alignItems: 'center', gap: 6,
                  cursor: 'pointer',
                  background: activeIdx === suggestions.length ? 'rgba(0,0,0,0.04)' : 'transparent',
                  transition: 'background 0.08s ease',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 2.5V9.5M2.5 6H9.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                  Create "{input.trim()}"
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}`

export default function TagInputPage() {
  return (
    <div style={{ background: '#fff' }}>
      {/* DEMO */}
      <Demo />

      {/* CODE */}
      <div style={{ background: '#0a0a0a', padding: 'clamp(24px, 4vw, 48px)', fontFamily: font }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>
                Tag Input with Autocomplete
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                Drop into any React project — zero dependencies
              </div>
            </div>
            <CopyButton text={CODE_SOURCE} />
          </div>

          <div style={{ background: '#111', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center',
            }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontFamily: 'ui-monospace, monospace' }}>
                TagInput.tsx
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
