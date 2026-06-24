'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type Task = { id: string; label: string; tag: string; tagColor: string }

const INITIAL_TASKS: Task[] = [
  { id: '1', label: 'Redesign onboarding flow', tag: 'Design', tagColor: '#0a0a0a' },
  { id: '2', label: 'Ship analytics dashboard', tag: 'Dev', tagColor: '#0a0a0a' },
  { id: '3', label: 'Write release notes', tag: 'Docs', tagColor: '#0a0a0a' },
  { id: '4', label: 'Sync with PM on roadmap', tag: 'Meeting', tagColor: '#0a0a0a' },
  { id: '5', label: 'Fix drag-drop on mobile', tag: 'Bug', tagColor: '#c0392b' },
  { id: '6', label: 'Review design tokens', tag: 'Design', tagColor: '#0a0a0a' },
]

function DragHandle() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, cursor: 'grab' }}>
      <circle cx="4.5" cy="3.5" r="1" fill="rgba(0,0,0,0.25)" />
      <circle cx="4.5" cy="7" r="1" fill="rgba(0,0,0,0.25)" />
      <circle cx="4.5" cy="10.5" r="1" fill="rgba(0,0,0,0.25)" />
      <circle cx="9.5" cy="3.5" r="1" fill="rgba(0,0,0,0.25)" />
      <circle cx="9.5" cy="7" r="1" fill="rgba(0,0,0,0.25)" />
      <circle cx="9.5" cy="10.5" r="1" fill="rgba(0,0,0,0.25)" />
    </svg>
  )
}

function DraggableList() {
  const [items, setItems] = useState<Task[]>(INITIAL_TASKS)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)
  const ghostItem = items.find(i => i.id === draggingId)

  const handlePointerDown = useCallback((e: React.PointerEvent, id: string) => {
    const el = itemRefs.current.get(id)
    if (!el) return
    const rect = el.getBoundingClientRect()
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setDragPos({ x: e.clientX, y: e.clientY })
    setDraggingId(id)
    setOverId(id)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    e.preventDefault()
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingId) return
    setDragPos({ x: e.clientX, y: e.clientY })

    const container = containerRef.current
    if (!container) return
    let best: string | null = null
    let bestDist = Infinity
    itemRefs.current.forEach((el, id) => {
      if (id === draggingId) return
      const rect = el.getBoundingClientRect()
      const cy = rect.top + rect.height / 2
      const dist = Math.abs(e.clientY - cy)
      if (dist < bestDist) { bestDist = dist; best = id }
    })
    setOverId(best)
  }, [draggingId])

  const handlePointerUp = useCallback(() => {
    if (draggingId && overId && draggingId !== overId) {
      setItems(prev => {
        const next = [...prev]
        const fromIdx = next.findIndex(i => i.id === draggingId)
        const toIdx = next.findIndex(i => i.id === overId)
        const [moved] = next.splice(fromIdx, 1)
        next.splice(toIdx, 0, moved)
        return next
      })
    }
    setDraggingId(null)
    setOverId(null)
    setDragPos(null)
  }, [draggingId, overId])

  const toggleCheck = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ position: 'relative', userSelect: 'none' }}
    >
      {/* Ghost element */}
      {draggingId && dragPos && ghostItem && (
        <div
          style={{
            position: 'fixed',
            left: dragPos.x - dragOffset.x,
            top: dragPos.y - dragOffset.y,
            width: itemRefs.current.get(draggingId)?.offsetWidth ?? 400,
            zIndex: 999,
            pointerEvents: 'none',
            background: '#fff',
            borderRadius: 10,
            border: '1px solid rgba(0,0,0,0.12)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12), 0 16px 40px rgba(0,0,0,0.12)',
            padding: '11px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            opacity: 0.96,
            transform: 'rotate(1.5deg) scale(1.02)',
            transition: 'transform 0.05s ease',
          }}
        >
          <DragHandle />
          <div style={{ width: 18, height: 18, borderRadius: 5, border: '1.5px solid rgba(0,0,0,0.15)', flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
            {ghostItem.label}
          </span>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.4)', background: 'rgba(0,0,0,0.05)', borderRadius: 5, padding: '2px 7px' }}>
            {ghostItem.tag}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {items.map((item, idx) => {
          const isDragging = item.id === draggingId
          const isOver = item.id === overId && !isDragging
          return (
            <div
              key={item.id}
              ref={el => { if (el) itemRefs.current.set(item.id, el); else itemRefs.current.delete(item.id) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 14px',
                background: isOver ? 'rgba(0,0,0,0.03)' : isDragging ? 'rgba(0,0,0,0.02)' : '#fff',
                borderRadius: 10,
                border: `1px solid ${isOver ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.07)'}`,
                opacity: isDragging ? 0.35 : 1,
                transform: isOver ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'background 0.12s ease, border-color 0.12s ease, opacity 0.15s ease, transform 0.15s cubic-bezier(0.16,1,0.3,1)',
                cursor: isDragging ? 'grabbing' : 'default',
              }}
            >
              {/* Drag handle */}
              <div
                onPointerDown={e => handlePointerDown(e, item.id)}
                style={{ cursor: 'grab', padding: '2px', opacity: 0.5, transition: 'opacity 0.12s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
              >
                <DragHandle />
              </div>

              {/* Checkbox */}
              <div
                onClick={() => toggleCheck(item.id)}
                style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  border: checked.has(item.id) ? '1.5px solid #0a0a0a' : '1.5px solid rgba(0,0,0,0.18)',
                  background: checked.has(item.id) ? '#0a0a0a' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
              >
                {checked.has(item.id) && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4.2 7.5L8 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>

              {/* Label */}
              <span style={{
                flex: 1, fontSize: 13, fontWeight: 500,
                color: checked.has(item.id) ? 'rgba(0,0,0,0.3)' : '#0a0a0a',
                letterSpacing: '-0.01em',
                textDecoration: checked.has(item.id) ? 'line-through' : 'none',
                transition: 'color 0.15s ease, text-decoration 0.15s ease',
              }}>
                {item.label}
              </span>

              {/* Tag */}
              <span style={{
                fontSize: 11, fontWeight: 500,
                color: item.tag === 'Bug' ? '#c0392b' : 'rgba(0,0,0,0.4)',
                background: item.tag === 'Bug' ? 'rgba(192,57,43,0.08)' : 'rgba(0,0,0,0.04)',
                borderRadius: 5, padding: '2px 7px',
                letterSpacing: '-0.005em',
                flexShrink: 0,
              }}>
                {item.tag}
              </span>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.3)', letterSpacing: '-0.01em' }}>
          {checked.size > 0 ? `${checked.size} of ${items.length} done` : 'Drag to reorder · click to complete'}
        </span>
        {checked.size > 0 && (
          <button
            onClick={() => setChecked(new Set())}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.35)',
              letterSpacing: '-0.01em', fontFamily: 'inherit',
              transition: 'color 0.12s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0a0a0a')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.35)')}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

function Demo() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
      padding: '40px 24px',
      fontFamily: font,
    }}>
      <div style={{
        width: '100%', maxWidth: 480,
        background: '#fff',
        borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)',
        padding: '20px',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>Backlog</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.35)', marginTop: 1 }}>
              {INITIAL_TASKS.length} tasks
            </div>
          </div>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: '#0a0a0a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2.5V9.5M2.5 6H9.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <DraggableList />
      </div>

      <div style={{ marginTop: 16, fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.35)', letterSpacing: '-0.01em' }}>
        Drag rows to reorder · click checkbox to complete
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

import { useState, useRef, useCallback } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type Item = { id: string; label: string; tag: string }

const INITIAL_ITEMS: Item[] = [
  { id: '1', label: 'Redesign onboarding flow', tag: 'Design' },
  { id: '2', label: 'Ship analytics dashboard', tag: 'Dev' },
  { id: '3', label: 'Write release notes', tag: 'Docs' },
  { id: '4', label: 'Sync with PM on roadmap', tag: 'Meeting' },
  { id: '5', label: 'Fix drag-drop on mobile', tag: 'Bug' },
  { id: '6', label: 'Review design tokens', tag: 'Design' },
]

function DragHandle() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="4.5" cy="3.5" r="1" fill="rgba(0,0,0,0.25)" />
      <circle cx="4.5" cy="7" r="1" fill="rgba(0,0,0,0.25)" />
      <circle cx="4.5" cy="10.5" r="1" fill="rgba(0,0,0,0.25)" />
      <circle cx="9.5" cy="3.5" r="1" fill="rgba(0,0,0,0.25)" />
      <circle cx="9.5" cy="7" r="1" fill="rgba(0,0,0,0.25)" />
      <circle cx="9.5" cy="10.5" r="1" fill="rgba(0,0,0,0.25)" />
    </svg>
  )
}

export default function DraggableList() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)
  const ghostItem = items.find(i => i.id === draggingId)

  const handlePointerDown = useCallback((e: React.PointerEvent, id: string) => {
    const el = itemRefs.current.get(id)
    if (!el) return
    const rect = el.getBoundingClientRect()
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setDragPos({ x: e.clientX, y: e.clientY })
    setDraggingId(id)
    setOverId(id)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    e.preventDefault()
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingId) return
    setDragPos({ x: e.clientX, y: e.clientY })
    let best: string | null = null
    let bestDist = Infinity
    itemRefs.current.forEach((el, id) => {
      if (id === draggingId) return
      const rect = el.getBoundingClientRect()
      const cy = rect.top + rect.height / 2
      const dist = Math.abs(e.clientY - cy)
      if (dist < bestDist) { bestDist = dist; best = id }
    })
    setOverId(best)
  }, [draggingId])

  const handlePointerUp = useCallback(() => {
    if (draggingId && overId && draggingId !== overId) {
      setItems(prev => {
        const next = [...prev]
        const fromIdx = next.findIndex(i => i.id === draggingId)
        const toIdx = next.findIndex(i => i.id === overId)
        const [moved] = next.splice(fromIdx, 1)
        next.splice(toIdx, 0, moved)
        return next
      })
    }
    setDraggingId(null)
    setOverId(null)
    setDragPos(null)
  }, [draggingId, overId])

  const toggleCheck = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ fontFamily: font, position: 'relative', userSelect: 'none' }}
    >
      {/* Ghost / floating drag preview */}
      {draggingId && dragPos && ghostItem && (
        <div style={{
          position: 'fixed',
          left: dragPos.x - dragOffset.x,
          top: dragPos.y - dragOffset.y,
          width: itemRefs.current.get(draggingId)?.offsetWidth ?? 400,
          zIndex: 999, pointerEvents: 'none',
          background: '#fff', borderRadius: 10,
          border: '1px solid rgba(0,0,0,0.12)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12), 0 16px 40px rgba(0,0,0,0.12)',
          padding: '11px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          opacity: 0.96,
          transform: 'rotate(1.5deg) scale(1.02)',
        }}>
          <DragHandle />
          <div style={{ width: 18, height: 18, borderRadius: 5, border: '1.5px solid rgba(0,0,0,0.15)', flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
            {ghostItem.label}
          </span>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.4)', background: 'rgba(0,0,0,0.05)', borderRadius: 5, padding: '2px 7px' }}>
            {ghostItem.tag}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {items.map(item => {
          const isDragging = item.id === draggingId
          const isOver = item.id === overId && !isDragging
          return (
            <div
              key={item.id}
              ref={el => { if (el) itemRefs.current.set(item.id, el); else itemRefs.current.delete(item.id) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 14px',
                background: isOver ? 'rgba(0,0,0,0.03)' : isDragging ? 'rgba(0,0,0,0.02)' : '#fff',
                borderRadius: 10,
                border: \`1px solid \${isOver ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.07)'}\`,
                opacity: isDragging ? 0.35 : 1,
                transform: isOver ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'background 0.12s ease, border-color 0.12s ease, opacity 0.15s ease, transform 0.15s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {/* Drag handle */}
              <div
                onPointerDown={e => handlePointerDown(e, item.id)}
                style={{ cursor: 'grab', padding: '2px', opacity: 0.5, transition: 'opacity 0.12s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
              >
                <DragHandle />
              </div>

              {/* Checkbox */}
              <div
                onClick={() => toggleCheck(item.id)}
                style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  border: checked.has(item.id) ? '1.5px solid #0a0a0a' : '1.5px solid rgba(0,0,0,0.18)',
                  background: checked.has(item.id) ? '#0a0a0a' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
              >
                {checked.has(item.id) && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4.2 7.5L8 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>

              {/* Label */}
              <span style={{
                flex: 1, fontSize: 13, fontWeight: 500,
                color: checked.has(item.id) ? 'rgba(0,0,0,0.3)' : '#0a0a0a',
                letterSpacing: '-0.01em',
                textDecoration: checked.has(item.id) ? 'line-through' : 'none',
                transition: 'color 0.15s ease',
              }}>
                {item.label}
              </span>

              {/* Tag */}
              <span style={{
                fontSize: 11, fontWeight: 500,
                color: 'rgba(0,0,0,0.4)',
                background: 'rgba(0,0,0,0.04)',
                borderRadius: 5, padding: '2px 7px',
                flexShrink: 0,
              }}>
                {item.tag}
              </span>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.3)', letterSpacing: '-0.01em' }}>
          {checked.size > 0 ? \`\${checked.size} of \${items.length} done\` : 'Drag handle to reorder · click to complete'}
        </span>
      </div>
    </div>
  )
}`

export default function DraggableListPage() {
  return (
    <div style={{ background: '#fff' }}>
      <Demo />

      {/* CODE */}
      <div style={{ background: '#0a0a0a', padding: 'clamp(24px, 4vw, 48px)', fontFamily: font }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>
                Draggable Reorderable List
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                Drop into any React project — zero dependencies
              </div>
            </div>
            <CopyButton text={CODE_SOURCE} />
          </div>

          <div style={{ background: '#111', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontFamily: 'ui-monospace, monospace' }}>
                DraggableList.tsx
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
