'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── InlineEdit ───────────────────────────────────────────────────────────────

function InlineEdit({
  value,
  onChange,
  multiline = false,
  placeholder = 'Click to edit…',
  maxLength,
  fontSize = 14,
  fontWeight = 500,
  color = '#0a0a0a',
  emptyColor = 'rgba(10,10,10,0.3)',
}: {
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  placeholder?: string
  maxLength?: number
  fontSize?: number
  fontWeight?: number
  color?: string
  emptyColor?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [hovered, setHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { setDraft(value) }, [value])

  useEffect(() => {
    if (!editing) return
    const el = multiline ? textareaRef.current : inputRef.current
    if (!el) return
    el.focus()
    if (el instanceof HTMLInputElement) el.select()
    else { el.setSelectionRange(el.value.length, el.value.length) }
  }, [editing, multiline])

  const commit = useCallback(() => {
    const trimmed = draft.trim()
    if (trimmed) onChange(trimmed)
    else setDraft(value)
    setEditing(false)
  }, [draft, value, onChange])

  const cancel = useCallback(() => {
    setDraft(value)
    setEditing(false)
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') { e.preventDefault(); commit() }
    if (multiline && e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); commit() }
    if (e.key === 'Escape') cancel()
  }

  const baseStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize,
    fontWeight,
    color,
    letterSpacing: '-0.01em',
    lineHeight: multiline ? 1.55 : 1.35,
    width: '100%',
  }

  if (editing) {
    const fieldStyle: React.CSSProperties = {
      ...baseStyle,
      display: 'block',
      background: '#fff',
      border: '1.5px solid rgba(10,10,10,0.18)',
      borderRadius: '8px',
      padding: '6px 8px',
      outline: 'none',
      resize: 'none',
      boxShadow: '0 0 0 3px rgba(10,10,10,0.06)',
      width: '100%',
      boxSizing: 'border-box',
    }
    return (
      <div>
        {multiline ? (
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
            maxLength={maxLength}
            rows={3}
            style={fieldStyle}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
            maxLength={maxLength}
            style={fieldStyle}
          />
        )}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 5,
          fontSize: 11,
          fontFamily: FONT,
          color: 'rgba(10,10,10,0.35)',
        }}>
          <span>{multiline ? '⌘↵ to save · Esc to cancel' : '↵ to save · Esc to cancel'}</span>
          {maxLength && <span>{draft.length}/{maxLength}</span>}
        </div>
      </div>
    )
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setEditing(true)}
      title="Click to edit"
      style={{
        cursor: 'text',
        padding: '5px 8px',
        margin: '-5px -8px',
        borderRadius: '8px',
        background: hovered ? 'rgba(10,10,10,0.04)' : 'transparent',
        border: `1.5px solid ${hovered ? 'rgba(10,10,10,0.10)' : 'transparent'}`,
        transition: 'background 120ms ease, border-color 120ms ease',
        wordBreak: 'break-word',
      }}
    >
      <span style={{ ...baseStyle, display: 'block' }}>
        {value || <span style={{ color: emptyColor }}>{placeholder}</span>}
      </span>
    </div>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

type Status = 'todo' | 'in-progress' | 'done' | 'blocked'

const STATUS_CONFIG: Record<Status, { label: string; dot: string; bg: string; text: string }> = {
  'todo':        { label: 'Todo',        dot: 'rgba(10,10,10,0.3)', bg: 'rgba(10,10,10,0.06)', text: 'rgba(10,10,10,0.55)' },
  'in-progress': { label: 'In Progress', dot: '#f59e0b',            bg: '#fffbeb',              text: '#92400e'             },
  'done':        { label: 'Done',        dot: '#16a34a',            bg: '#f0fdf4',              text: '#166534'             },
  'blocked':     { label: 'Blocked',     dot: '#dc2626',            bg: '#fef2f2',              text: '#991b1b'             },
}

const STATUS_ORDER: Status[] = ['todo', 'in-progress', 'done', 'blocked']

function StatusBadge({ status, onChange }: { status: Status; onChange: (s: Status) => void }) {
  const cfg = STATUS_CONFIG[status]
  const [hovered, setHovered] = useState(false)

  const cycle = () => {
    const idx = STATUS_ORDER.indexOf(status)
    onChange(STATUS_ORDER[(idx + 1) % STATUS_ORDER.length])
  }

  return (
    <button
      onClick={cycle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 8px',
        borderRadius: 6,
        border: 'none',
        background: hovered ? `${cfg.bg}` : cfg.bg,
        color: cfg.text,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.02em',
        fontFamily: FONT,
        cursor: 'pointer',
        transition: 'opacity 120ms ease',
        opacity: hovered ? 0.75 : 1,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, display: 'inline-block', flexShrink: 0 }} />
      {cfg.label}
    </button>
  )
}

// ─── Priority Badge ───────────────────────────────────────────────────────────

type Priority = 'low' | 'medium' | 'high' | 'urgent'

const PRIORITY_CONFIG: Record<Priority, { label: string; icon: string; color: string }> = {
  low:    { label: 'Low',    icon: '↓', color: 'rgba(10,10,10,0.35)' },
  medium: { label: 'Medium', icon: '→', color: '#f59e0b'              },
  high:   { label: 'High',   icon: '↑', color: '#ef4444'              },
  urgent: { label: 'Urgent', icon: '↑↑', color: '#dc2626'             },
}

const PRIORITY_ORDER: Priority[] = ['low', 'medium', 'high', 'urgent']

function PriorityBadge({ priority, onChange }: { priority: Priority; onChange: (p: Priority) => void }) {
  const cfg = PRIORITY_CONFIG[priority]
  const [hovered, setHovered] = useState(false)

  const cycle = () => {
    const idx = PRIORITY_ORDER.indexOf(priority)
    onChange(PRIORITY_ORDER[(idx + 1) % PRIORITY_ORDER.length])
  }

  return (
    <button
      onClick={cycle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 8px',
        borderRadius: 6,
        border: '1px solid rgba(10,10,10,0.08)',
        background: hovered ? 'rgba(10,10,10,0.04)' : '#fff',
        color: cfg.color,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.01em',
        fontFamily: FONT,
        cursor: 'pointer',
        transition: 'background 120ms ease',
      }}
    >
      <span style={{ fontSize: 10 }}>{cfg.icon}</span>
      {cfg.label}
    </button>
  )
}

// ─── Task Card Demo ───────────────────────────────────────────────────────────

function TaskCardDemo() {
  const [title, setTitle] = useState('Redesign onboarding flow')
  const [description, setDescription] = useState('Audit the existing 6-step onboarding and reduce it to 3 steps without losing conversion.')
  const [assignee, setAssignee] = useState('Vraj Shah')
  const [status, setStatus] = useState<Status>('in-progress')
  const [priority, setPriority] = useState<Priority>('high')

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      width: 380,
      maxWidth: '100%',
      fontFamily: FONT,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)' }}>
          ISS-247
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <StatusBadge status={status} onChange={setStatus} />
          <PriorityBadge priority={priority} onChange={setPriority} />
        </div>
      </div>

      {/* Title */}
      <div style={{ marginBottom: 12 }}>
        <InlineEdit
          value={title}
          onChange={setTitle}
          placeholder="Issue title…"
          fontSize={17}
          fontWeight={600}
          maxLength={80}
        />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(10,10,10,0.06)', marginBottom: 12 }} />

      {/* Description */}
      <div style={{ marginBottom: 20 }}>
        <InlineEdit
          value={description}
          onChange={setDescription}
          multiline
          placeholder="Add a description…"
          fontSize={13}
          fontWeight={400}
          color="rgba(10,10,10,0.72)"
          maxLength={300}
        />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(10,10,10,0.06)', marginBottom: 12 }} />

      {/* Meta row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', width: 64, flexShrink: 0 }}>Assignee</span>
          <InlineEdit
            value={assignee}
            onChange={setAssignee}
            placeholder="Unassigned"
            fontSize={13}
            fontWeight={500}
          />
        </div>
      </div>

      <p style={{ margin: '16px 0 0', fontSize: 11, color: 'rgba(10,10,10,0.3)', fontFamily: FONT }}>
        Click any text field to edit
      </p>
    </div>
  )
}

// ─── Editable List Demo ───────────────────────────────────────────────────────

interface ListItem {
  id: number
  text: string
  done: boolean
}

function EditableListDemo() {
  const [items, setItems] = useState<ListItem[]>([
    { id: 1, text: 'Research competitor pricing', done: true  },
    { id: 2, text: 'Draft Q3 OKRs with the team', done: false },
    { id: 3, text: 'Ship the new onboarding flow', done: false },
  ])
  const [newText, setNewText] = useState('')
  const nextId = useRef(4)

  const updateItem = (id: number, text: string) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, text } : it))
  }

  const toggleDone = (id: number) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, done: !it.done } : it))
  }

  const addItem = () => {
    const text = newText.trim()
    if (!text) return
    setItems(prev => [...prev, { id: nextId.current++, text, done: false }])
    setNewText('')
  }

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(it => it.id !== id))
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: 16,
      padding: '16px 20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      width: 340,
      maxWidth: '100%',
      fontFamily: FONT,
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', marginBottom: 14, letterSpacing: '-0.01em' }}>
        Q3 Goals
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(item => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '6px 0',
              borderBottom: '1px solid rgba(10,10,10,0.05)',
            }}
          >
            {/* Checkbox */}
            <button
              onClick={() => toggleDone(item.id)}
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                border: item.done ? 'none' : '1.5px solid rgba(10,10,10,0.2)',
                background: item.done ? '#0a0a0a' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                marginTop: 3,
                transition: 'background 150ms ease, border 150ms ease',
              }}
            >
              {item.done && <span style={{ color: '#fff', fontSize: 9, lineHeight: 1 }}>✓</span>}
            </button>

            {/* Inline edit */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <InlineEdit
                value={item.text}
                onChange={text => updateItem(item.id, text)}
                placeholder="Task name…"
                fontSize={13}
                fontWeight={400}
                color={item.done ? 'rgba(10,10,10,0.35)' : '#0a0a0a'}
              />
            </div>

            {/* Remove */}
            <button
              onClick={() => removeItem(item.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(10,10,10,0.25)',
                fontSize: 14,
                lineHeight: 1,
                padding: '2px 4px',
                borderRadius: 4,
                flexShrink: 0,
                marginTop: 1,
                transition: 'color 120ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(10,10,10,0.25)')}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Add new */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <input
          type="text"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addItem() }}
          placeholder="Add a goal…"
          style={{
            flex: 1,
            border: '1px solid rgba(10,10,10,0.10)',
            borderRadius: 8,
            padding: '6px 10px',
            fontSize: 13,
            fontFamily: FONT,
            color: '#0a0a0a',
            outline: 'none',
            background: 'rgba(10,10,10,0.02)',
          }}
        />
        <button
          onClick={addItem}
          style={{
            padding: '6px 14px',
            borderRadius: 8,
            border: 'none',
            background: '#0a0a0a',
            color: '#fff',
            fontSize: 13,
            fontWeight: 500,
            fontFamily: FONT,
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            transition: 'opacity 120ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Add
        </button>
      </div>
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

export function InlineEdit({
  value,
  onChange,
  multiline = false,
  placeholder = 'Click to edit…',
  maxLength,
  fontSize = 14,
  fontWeight = 500,
  color = '#0a0a0a',
  emptyColor = 'rgba(10,10,10,0.3)',
}: {
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  placeholder?: string
  maxLength?: number
  fontSize?: number
  fontWeight?: number
  color?: string
  emptyColor?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [hovered, setHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { setDraft(value) }, [value])

  useEffect(() => {
    if (!editing) return
    const el = multiline ? textareaRef.current : inputRef.current
    if (!el) return
    el.focus()
    if (el instanceof HTMLInputElement) el.select()
    else { el.setSelectionRange(el.value.length, el.value.length) }
  }, [editing, multiline])

  const commit = useCallback(() => {
    const trimmed = draft.trim()
    if (trimmed) onChange(trimmed)
    else setDraft(value)
    setEditing(false)
  }, [draft, value, onChange])

  const cancel = useCallback(() => {
    setDraft(value)
    setEditing(false)
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') { e.preventDefault(); commit() }
    if (multiline && e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); commit() }
    if (e.key === 'Escape') cancel()
  }

  const baseStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize,
    fontWeight,
    color,
    letterSpacing: '-0.01em',
    lineHeight: multiline ? 1.55 : 1.35,
    width: '100%',
  }

  if (editing) {
    const fieldStyle: React.CSSProperties = {
      ...baseStyle,
      display: 'block',
      background: '#fff',
      border: '1.5px solid rgba(10,10,10,0.18)',
      borderRadius: '8px',
      padding: '6px 8px',
      outline: 'none',
      resize: 'none',
      boxShadow: '0 0 0 3px rgba(10,10,10,0.06)',
      width: '100%',
      boxSizing: 'border-box',
    }
    return (
      <div>
        {multiline ? (
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
            maxLength={maxLength}
            rows={3}
            style={fieldStyle}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
            maxLength={maxLength}
            style={fieldStyle}
          />
        )}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 5,
          fontSize: 11,
          fontFamily: FONT,
          color: 'rgba(10,10,10,0.35)',
        }}>
          <span>{multiline ? '⌘↵ to save · Esc to cancel' : '↵ to save · Esc to cancel'}</span>
          {maxLength && <span>{draft.length}/{maxLength}</span>}
        </div>
      </div>
    )
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setEditing(true)}
      title="Click to edit"
      style={{
        cursor: 'text',
        padding: '5px 8px',
        margin: '-5px -8px',
        borderRadius: '8px',
        background: hovered ? 'rgba(10,10,10,0.04)' : 'transparent',
        border: \`1.5px solid \${hovered ? 'rgba(10,10,10,0.10)' : 'transparent'}\`,
        transition: 'background 120ms ease, border-color 120ms ease',
        wordBreak: 'break-word',
      }}
    >
      <span style={{ ...baseStyle, display: 'block' }}>
        {value || <span style={{ color: emptyColor }}>{placeholder}</span>}
      </span>
    </div>
  )
}

// ── Example usage ──────────────────────────────────────────────────────────────
//
// function MyCard() {
//   const [title, setTitle] = useState('Click me to edit this title')
//   const [note,  setNote]  = useState('Or this paragraph — blur or press ↵/⌘↵ to save, Esc to cancel.')
//
//   return (
//     <div>
//       <InlineEdit value={title} onChange={setTitle} fontSize={20} fontWeight={600} />
//       <InlineEdit value={note}  onChange={setNote}  multiline fontSize={14} fontWeight={400} color="rgba(10,10,10,0.65)" />
//     </div>
//   )
// }`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InlineEditPage() {
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
        gap: 32,
      }}>
        <div style={{
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>
              Issue card
            </p>
            <TaskCardDemo />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>
              Editable list
            </p>
            <EditableListDemo />
          </div>
        </div>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.4)',
          marginBottom: 12,
          fontFamily: FONT,
        }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 20, overflowX: 'auto' }}>
          <pre style={{
            margin: 0,
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
            fontSize: 12,
            lineHeight: 1.65,
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
