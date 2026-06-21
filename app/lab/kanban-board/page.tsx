'use client'

import { useState, useRef } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = 'low' | 'medium' | 'high'
type Tag = 'feature' | 'bug' | 'design' | 'review'
type ColumnId = 'backlog' | 'in-progress' | 'done'

interface KanbanCard {
  id: string
  title: string
  tag?: Tag
  priority?: Priority
}

// ─── Config ───────────────────────────────────────────────────────────────────

const COLUMNS: { id: ColumnId; label: string; dotColor: string }[] = [
  { id: 'backlog',     label: 'Backlog',     dotColor: 'rgba(10,10,10,0.3)' },
  { id: 'in-progress', label: 'In Progress', dotColor: '#2563eb' },
  { id: 'done',        label: 'Done',        dotColor: '#16a34a' },
]

const TAG_STYLE: Record<Tag, { bg: string; text: string }> = {
  feature: { bg: 'rgba(124,58,237,0.1)',  text: '#7c3aed' },
  bug:     { bg: 'rgba(220,38,38,0.1)',   text: '#dc2626' },
  design:  { bg: 'rgba(234,88,12,0.1)',   text: '#ea580c' },
  review:  { bg: 'rgba(37,99,235,0.1)',   text: '#2563eb' },
}

const PRIORITY_COLOR: Record<Priority, string> = {
  low:    '#16a34a',
  medium: '#d97706',
  high:   '#dc2626',
}

const INITIAL_STATE: Record<ColumnId, KanbanCard[]> = {
  backlog: [
    { id: 'c1', title: 'Redesign onboarding flow', tag: 'design',  priority: 'high' },
    { id: 'c2', title: 'Add dark mode support',     tag: 'feature', priority: 'medium' },
    { id: 'c3', title: 'Fix Safari scroll bug',     tag: 'bug',     priority: 'high' },
    { id: 'c4', title: 'Write API documentation',   tag: 'review',  priority: 'low' },
  ],
  'in-progress': [
    { id: 'c5', title: 'Auth token refresh logic',  tag: 'feature', priority: 'high' },
    { id: 'c6', title: 'Update color palette',      tag: 'design',  priority: 'medium' },
  ],
  done: [
    { id: 'c7', title: 'Set up CI/CD pipeline',     tag: 'feature', priority: 'medium' },
    { id: 'c8', title: 'Mobile responsive nav',     tag: 'design',  priority: 'low' },
  ],
}

let nextId = 100

// ─── KanbanBoard ─────────────────────────────────────────────────────────────

function KanbanBoard() {
  const [cols, setCols] = useState<Record<ColumnId, KanbanCard[]>>(INITIAL_STATE)
  const [dragging, setDragging] = useState<{ cardId: string; fromCol: ColumnId } | null>(null)
  const [overCol, setOverCol] = useState<ColumnId | null>(null)
  const [adding, setAdding] = useState<{ colId: ColumnId; value: string } | null>(null)
  const dragCounters = useRef<Record<ColumnId, number>>({ backlog: 0, 'in-progress': 0, done: 0 })

  const moveCard = (cardId: string, fromCol: ColumnId, toCol: ColumnId) => {
    if (fromCol === toCol) return
    setCols(prev => {
      const card = prev[fromCol].find(c => c.id === cardId)
      if (!card) return prev
      return {
        ...prev,
        [fromCol]: prev[fromCol].filter(c => c.id !== cardId),
        [toCol]: [...prev[toCol], card],
      }
    })
  }

  const addCard = (colId: ColumnId, title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return
    const id = `new-${++nextId}`
    setCols(prev => ({
      ...prev,
      [colId]: [...prev[colId], { id, title: trimmed }],
    }))
  }

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      overflowX: 'auto',
      padding: '4px 2px 12px',
      width: '100%',
    }}>
      {COLUMNS.map(col => {
        const cards = cols[col.id]
        const isDragOver = overCol === col.id

        return (
          <div
            key={col.id}
            onDragEnter={e => {
              e.preventDefault()
              dragCounters.current[col.id]++
              setOverCol(col.id)
            }}
            onDragLeave={() => {
              dragCounters.current[col.id]--
              if (dragCounters.current[col.id] === 0) setOverCol(null)
            }}
            onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
            onDrop={e => {
              e.preventDefault()
              dragCounters.current[col.id] = 0
              const cardId = e.dataTransfer.getData('cardId')
              const fromCol = e.dataTransfer.getData('fromCol') as ColumnId
              moveCard(cardId, fromCol, col.id)
              setOverCol(null)
              setDragging(null)
            }}
            style={{
              background: isDragOver ? 'rgba(10,10,10,0.04)' : 'rgba(10,10,10,0.025)',
              border: `1px solid ${isDragOver ? 'rgba(10,10,10,0.14)' : 'rgba(10,10,10,0.06)'}`,
              borderRadius: '14px',
              padding: '14px',
              width: '236px',
              minWidth: '236px',
              display: 'flex',
              flexDirection: 'column' as const,
              gap: '6px',
              minHeight: '340px',
              transition: 'background 150ms ease, border-color 150ms ease',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              paddingBottom: '10px',
              borderBottom: '1px solid rgba(10,10,10,0.06)',
              marginBottom: '2px',
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: col.dotColor, flexShrink: 0 }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT, flex: 1 }}>
                {col.label}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(10,10,10,0.35)', fontFamily: FONT, minWidth: '12px', textAlign: 'right' as const }}>
                {cards.length}
              </span>
            </div>

            {/* Cards */}
            {cards.map(card => {
              const isDragging = dragging?.cardId === card.id
              return (
                <div
                  key={card.id}
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('cardId', card.id)
                    e.dataTransfer.setData('fromCol', col.id)
                    setDragging({ cardId: card.id, fromCol: col.id })
                  }}
                  onDragEnd={() => {
                    setDragging(null)
                    setOverCol(null)
                    Object.keys(dragCounters.current).forEach(k => { dragCounters.current[k as ColumnId] = 0 })
                  }}
                  onMouseEnter={e => {
                    if (!isDragging) {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(10,10,10,0.08)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    cursor: 'grab',
                    userSelect: 'none' as const,
                    opacity: isDragging ? 0.3 : 1,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    transform: 'translateY(0)',
                    transition: 'opacity 150ms ease, box-shadow 150ms ease, transform 150ms ease',
                    fontFamily: FONT,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: '1.45', flex: 1 }}>
                      {card.title}
                    </span>
                    {card.priority && (
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: PRIORITY_COLOR[card.priority],
                        flexShrink: 0, marginTop: '5px',
                      }} />
                    )}
                  </div>
                  {card.tag && (
                    <div style={{ marginTop: '8px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: TAG_STYLE[card.tag].bg,
                        color: TAG_STYLE[card.tag].text,
                        letterSpacing: '0em',
                      }}>
                        {card.tag}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Add card */}
            {adding?.colId === col.id ? (
              <div style={{ marginTop: '2px', display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                <input
                  autoFocus
                  value={adding.value}
                  onChange={e => setAdding({ colId: col.id, value: e.target.value })}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { addCard(col.id, adding.value); setAdding(null) }
                    if (e.key === 'Escape') setAdding(null)
                  }}
                  placeholder="Card title..."
                  style={{
                    padding: '8px 10px',
                    border: '1px solid rgba(10,10,10,0.15)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: FONT,
                    color: '#0a0a0a',
                    background: '#fff',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box' as const,
                    letterSpacing: '-0.01em',
                    boxShadow: '0 0 0 2px rgba(10,10,10,0.08)',
                  }}
                />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => { addCard(col.id, adding.value); setAdding(null) }}
                    style={{
                      flex: 1, padding: '6px 0',
                      background: '#0a0a0a', color: '#fff',
                      border: 'none', borderRadius: '6px',
                      fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer', fontFamily: FONT,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setAdding(null)}
                    style={{
                      padding: '6px 10px',
                      background: 'none',
                      color: 'rgba(10,10,10,0.45)',
                      border: '1px solid rgba(10,10,10,0.1)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontFamily: FONT,
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAdding({ colId: col.id, value: '' })}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '6px 0', marginTop: 'auto',
                  fontSize: '12px', color: 'rgba(10,10,10,0.38)', fontFamily: FONT,
                  fontWeight: 500, textAlign: 'left' as const, letterSpacing: '-0.01em',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0a0a0a')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(10,10,10,0.38)')}
              >
                + Add card
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type Priority = 'low' | 'medium' | 'high'
type Tag = 'feature' | 'bug' | 'design' | 'review'
type ColumnId = 'backlog' | 'in-progress' | 'done'

interface KanbanCard {
  id: string
  title: string
  tag?: Tag
  priority?: Priority
}

const COLUMNS: { id: ColumnId; label: string; dotColor: string }[] = [
  { id: 'backlog',      label: 'Backlog',     dotColor: 'rgba(10,10,10,0.3)' },
  { id: 'in-progress',  label: 'In Progress', dotColor: '#2563eb' },
  { id: 'done',         label: 'Done',        dotColor: '#16a34a' },
]

const TAG_STYLE: Record<Tag, { bg: string; text: string }> = {
  feature: { bg: 'rgba(124,58,237,0.1)', text: '#7c3aed' },
  bug:     { bg: 'rgba(220,38,38,0.1)',  text: '#dc2626' },
  design:  { bg: 'rgba(234,88,12,0.1)',  text: '#ea580c' },
  review:  { bg: 'rgba(37,99,235,0.1)',  text: '#2563eb' },
}

const PRIORITY_COLOR: Record<Priority, string> = {
  low: '#16a34a', medium: '#d97706', high: '#dc2626',
}

let nextId = 100

export function KanbanBoard({ initialState }: { initialState?: Record<ColumnId, KanbanCard[]> }) {
  const DEFAULT_STATE: Record<ColumnId, KanbanCard[]> = initialState ?? {
    backlog: [
      { id: 'c1', title: 'Redesign onboarding flow', tag: 'design',  priority: 'high' },
      { id: 'c2', title: 'Add dark mode support',     tag: 'feature', priority: 'medium' },
      { id: 'c3', title: 'Fix Safari scroll bug',     tag: 'bug',     priority: 'high' },
    ],
    'in-progress': [
      { id: 'c4', title: 'Auth token refresh',  tag: 'feature', priority: 'high' },
      { id: 'c5', title: 'Update color palette', tag: 'design',  priority: 'medium' },
    ],
    done: [
      { id: 'c6', title: 'Set up CI/CD pipeline', tag: 'feature', priority: 'medium' },
    ],
  }

  const [cols, setCols] = useState(DEFAULT_STATE)
  const [dragging, setDragging] = useState<{ cardId: string; fromCol: ColumnId } | null>(null)
  const [overCol, setOverCol] = useState<ColumnId | null>(null)
  const [adding, setAdding] = useState<{ colId: ColumnId; value: string } | null>(null)
  const dragCounters = useRef<Record<ColumnId, number>>({ backlog: 0, 'in-progress': 0, done: 0 })

  const moveCard = (cardId: string, fromCol: ColumnId, toCol: ColumnId) => {
    if (fromCol === toCol) return
    setCols(prev => {
      const card = prev[fromCol].find(c => c.id === cardId)
      if (!card) return prev
      return {
        ...prev,
        [fromCol]: prev[fromCol].filter(c => c.id !== cardId),
        [toCol]: [...prev[toCol], card],
      }
    })
  }

  const addCard = (colId: ColumnId, title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return
    setCols(prev => ({
      ...prev,
      [colId]: [...prev[colId], { id: \`card-\${++nextId}\`, title: trimmed }],
    }))
  }

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', overflowX: 'auto' }}>
      {COLUMNS.map(col => {
        const cards = cols[col.id]
        const isDragOver = overCol === col.id

        return (
          <div
            key={col.id}
            onDragEnter={e => {
              e.preventDefault()
              dragCounters.current[col.id]++
              setOverCol(col.id)
            }}
            onDragLeave={() => {
              dragCounters.current[col.id]--
              if (dragCounters.current[col.id] === 0) setOverCol(null)
            }}
            onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
            onDrop={e => {
              e.preventDefault()
              dragCounters.current[col.id] = 0
              const cardId = e.dataTransfer.getData('cardId')
              const fromCol = e.dataTransfer.getData('fromCol') as ColumnId
              moveCard(cardId, fromCol, col.id)
              setOverCol(null)
              setDragging(null)
            }}
            style={{
              background: isDragOver ? 'rgba(10,10,10,0.04)' : 'rgba(10,10,10,0.025)',
              border: \`1px solid \${isDragOver ? 'rgba(10,10,10,0.14)' : 'rgba(10,10,10,0.06)'}\`,
              borderRadius: '14px',
              padding: '14px',
              width: '236px',
              minWidth: '236px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              minHeight: '320px',
              transition: 'background 150ms ease, border-color 150ms ease',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', paddingBottom: '10px', borderBottom: '1px solid rgba(10,10,10,0.06)', marginBottom: '2px' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: col.dotColor }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT, flex: 1 }}>
                {col.label}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>{cards.length}</span>
            </div>

            {/* Cards */}
            {cards.map(card => {
              const isDragging = dragging?.cardId === card.id
              return (
                <div
                  key={card.id}
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData('cardId', card.id)
                    e.dataTransfer.setData('fromCol', col.id)
                    e.dataTransfer.effectAllowed = 'move'
                    setDragging({ cardId: card.id, fromCol: col.id })
                  }}
                  onDragEnd={() => {
                    setDragging(null)
                    setOverCol(null)
                    Object.keys(dragCounters.current).forEach(k => { dragCounters.current[k as ColumnId] = 0 })
                  }}
                  onMouseEnter={e => {
                    if (!isDragging) {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(10,10,10,0.08)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    cursor: 'grab',
                    userSelect: 'none',
                    opacity: isDragging ? 0.3 : 1,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    transform: 'translateY(0)',
                    transition: 'opacity 150ms ease, box-shadow 150ms ease, transform 150ms ease',
                    fontFamily: FONT,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: '1.45', flex: 1 }}>
                      {card.title}
                    </span>
                    {card.priority && (
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: PRIORITY_COLOR[card.priority], flexShrink: 0, marginTop: '5px' }} />
                    )}
                  </div>
                  {card.tag && (
                    <div style={{ marginTop: '8px' }}>
                      <span style={{ display: 'inline-block', padding: '2px 7px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, background: TAG_STYLE[card.tag].bg, color: TAG_STYLE[card.tag].text }}>
                        {card.tag}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Add card */}
            {adding?.colId === col.id ? (
              <div style={{ marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input
                  autoFocus
                  value={adding.value}
                  onChange={e => setAdding({ colId: col.id, value: e.target.value })}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { addCard(col.id, adding.value); setAdding(null) }
                    if (e.key === 'Escape') setAdding(null)
                  }}
                  placeholder="Card title..."
                  style={{ padding: '8px 10px', border: '1px solid rgba(10,10,10,0.15)', borderRadius: '8px', fontSize: '13px', fontFamily: FONT, color: '#0a0a0a', background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box', letterSpacing: '-0.01em' }}
                />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => { addCard(col.id, adding.value); setAdding(null) }} style={{ flex: 1, padding: '6px 0', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>Add</button>
                  <button onClick={() => setAdding(null)} style={{ padding: '6px 10px', background: 'none', color: 'rgba(10,10,10,0.45)', border: '1px solid rgba(10,10,10,0.1)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontFamily: FONT }}>✕</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAdding({ colId: col.id, value: '' })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', marginTop: 'auto', fontSize: '12px', color: 'rgba(10,10,10,0.38)', fontFamily: FONT, fontWeight: 500, textAlign: 'left', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 150ms ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0a0a0a')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(10,10,10,0.38)')}
              >
                + Add card
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KanbanBoardPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: '20px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', alignItems: 'center' }}>
          <p style={{
            margin: 0,
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            color: 'rgba(10,10,10,0.35)',
            fontFamily: FONT,
          }}>
            Drag cards between columns · click + Add card to create
          </p>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
          maxWidth: '100%',
          overflowX: 'auto',
        }}>
          {/* Board header */}
          <div style={{ marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT }}>
              Q3 Sprint
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.4)', marginTop: '1px', letterSpacing: '-0.01em', fontFamily: FONT }}>
              8 tasks · 2 in progress
            </div>
          </div>
          <KanbanBoard />
        </div>

        <p style={{
          margin: 0,
          fontSize: '11px',
          color: 'rgba(10,10,10,0.3)',
          fontFamily: FONT,
          letterSpacing: '-0.01em',
        }}>
          Priority · <span style={{ color: '#dc2626' }}>●</span> high &nbsp;
          <span style={{ color: '#d97706' }}>●</span> medium &nbsp;
          <span style={{ color: '#16a34a' }}>●</span> low
        </p>
      </section>

      {/* ── Code ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
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
