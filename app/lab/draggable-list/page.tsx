'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Task {
  id: string
  label: string
  detail: string
  dot: string
}

const INITIAL: Task[] = [
  { id: '1', label: 'Design system audit',      detail: 'Review all tokens & components',    dot: '#2563eb' },
  { id: '2', label: 'Ship changelog page',      detail: 'Write copy and implement layout',   dot: '#16a34a' },
  { id: '3', label: 'Update API docs',          detail: 'Add new endpoints and examples',    dot: '#9333ea' },
  { id: '4', label: 'Write unit tests',         detail: 'Cover auth and data layers',        dot: '#ea580c' },
  { id: '5', label: 'Fix Safari overflow bug',  detail: 'Reproduction on mobile viewport',   dot: '#dc2626' },
]

const GAP = 8 // px gap between items — must match the flex gap below

// ─── DraggableList ────────────────────────────────────────────────────────────

function DraggableList() {
  const [tasks, setTasks]           = useState<Task[]>(INITIAL)
  const [renderDragIdx, setRenderDragIdx] = useState(-1)
  const [deltaY, setDeltaY]         = useState(0)
  const [renderOverIdx, setRenderOverIdx] = useState(-1)

  // All mutable drag state lives in refs so event handlers never go stale.
  const isDragging    = useRef(false)
  const dragIdx       = useRef(-1)
  const startY        = useRef(0)
  const itemH         = useRef(0)          // height of the dragged item
  const snapRects     = useRef<DOMRect[]>([]) // rects at drag-start
  const overIdxRef    = useRef(-1)
  const itemRefs      = useRef<(HTMLDivElement | null)[]>([])

  // ── Begin drag ──────────────────────────────────────────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault()
    const rects = itemRefs.current.map(el => el?.getBoundingClientRect() ?? new DOMRect())
    isDragging.current    = true
    dragIdx.current       = index
    startY.current        = e.clientY
    itemH.current         = rects[index].height
    snapRects.current     = rects
    overIdxRef.current    = index
    setRenderDragIdx(index)
    setDeltaY(0)
    setRenderOverIdx(index)
  }, [])

  // ── Mouse move / up (attached once) ─────────────────────────────────────────
  useEffect(() => {
    // Returns the index of the last item whose midpoint is above `y`.
    const computeOver = (y: number): number => {
      let result = 0
      for (let i = 0; i < snapRects.current.length; i++) {
        const { top, height } = snapRects.current[i]
        if (y >= top + height / 2) result = i
      }
      return result
    }

    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const dy   = e.clientY - startY.current
      const over = computeOver(e.clientY)
      overIdxRef.current = over
      setDeltaY(dy)
      setRenderOverIdx(over)
    }

    const onUp = () => {
      if (!isDragging.current) return
      const from = dragIdx.current
      const to   = overIdxRef.current
      if (from !== to && from >= 0 && to >= 0) {
        setTasks(prev => {
          const next = [...prev]
          const [removed] = next.splice(from, 1)
          next.splice(to, 0, removed)
          return next
        })
      }
      isDragging.current = false
      dragIdx.current    = -1
      overIdxRef.current = -1
      setRenderDragIdx(-1)
      setDeltaY(0)
      setRenderOverIdx(-1)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
    }
  }, []) // empty — all state accessed via refs

  const slotH = itemH.current + GAP // height of one slot (item + gap)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>

      {/* Hint */}
      <p style={{
        margin: 0,
        fontSize: '12px',
        color: 'rgba(10,10,10,0.4)',
        fontWeight: 500,
        letterSpacing: '-0.01em',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}>
        Drag the handle to reorder
      </p>

      {/* List */}
      <div style={{
        width: '420px',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: `${GAP}px`,
        userSelect: 'none',
      }}>
        {tasks.map((task, index) => {
          const isDraggingThis = index === renderDragIdx

          // Visual offset for non-dragged items
          let translateY = 0
          if (renderDragIdx >= 0 && !isDraggingThis) {
            const from = renderDragIdx
            const to   = renderOverIdx
            if (from < to && index > from && index <= to) {
              translateY = -slotH          // shift up when dragged item moves down
            } else if (from > to && index >= to && index < from) {
              translateY = slotH           // shift down when dragged item moves up
            }
          }

          return (
            <div
              key={task.id}
              ref={el => { itemRefs.current[index] = el }}
              style={{
                position: 'relative',
                zIndex: isDraggingThis ? 10 : 1,
                transform: isDraggingThis
                  ? `translateY(${deltaY}px)`
                  : `translateY(${translateY}px)`,
                transition: isDraggingThis
                  ? 'box-shadow 200ms ease'
                  : 'transform 180ms cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              <div style={{
                background: '#fff',
                border: `1px solid ${isDraggingThis ? 'rgba(10,10,10,0.13)' : 'rgba(10,10,10,0.08)'}`,
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: isDraggingThis
                  ? '0 16px 40px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08)'
                  : '0 1px 2px rgba(0,0,0,0.04)',
                transition: 'box-shadow 200ms ease, border-color 200ms ease',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              }}>

                {/* ── Drag handle ── */}
                <div
                  onMouseDown={e => handleMouseDown(e, index)}
                  style={{
                    cursor: isDraggingThis ? 'grabbing' : 'grab',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '3.5px',
                    padding: '5px',
                    margin: '-5px',
                    borderRadius: '5px',
                    flexShrink: 0,
                    color: 'rgba(10,10,10,0.28)',
                    transition: 'color 150ms ease',
                  }}
                  onMouseEnter={e => { if (!isDraggingThis) e.currentTarget.style.color = 'rgba(10,10,10,0.56)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(10,10,10,0.28)' }}
                >
                  {[0,1,2,3,4,5].map(i => (
                    <div key={i} style={{
                      width: '3px',
                      height: '3px',
                      borderRadius: '50%',
                      background: 'currentColor',
                    }} />
                  ))}
                </div>

                {/* ── Color dot ── */}
                <div style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: task.dot,
                  flexShrink: 0,
                  opacity: 0.8,
                }} />

                {/* ── Text ── */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: 0,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: '#0a0a0a',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.3,
                  }}>
                    {task.label}
                  </p>
                  <p style={{
                    margin: '2px 0 0',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'rgba(10,10,10,0.46)',
                    letterSpacing: '-0.01em',
                  }}>
                    {task.detail}
                  </p>
                </div>

                {/* ── Position badge ── */}
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '7px',
                  background: 'rgba(10,10,10,0.05)',
                  border: '1px solid rgba(10,10,10,0.07)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'rgba(10,10,10,0.35)',
                  flexShrink: 0,
                }}>
                  {index + 1}
                </div>

              </div>
            </div>
          )
        })}
      </div>

      {/* Reset */}
      <button
        onClick={() => setTasks(INITIAL)}
        style={{
          padding: '7px 16px',
          borderRadius: '8px',
          border: '1px solid rgba(10,10,10,0.08)',
          background: '#fff',
          color: 'rgba(10,10,10,0.52)',
          fontSize: '12.5px',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          cursor: 'pointer',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          transition: 'background 150ms ease, color 150ms ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,10,10,0.05)'; e.currentTarget.style.color = '#0a0a0a' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'rgba(10,10,10,0.52)' }}
      >
        Reset order
      </button>
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Task {
  id: string
  label: string
  detail: string
  dot: string
}

const INITIAL: Task[] = [
  { id: '1', label: 'Design system audit',     detail: 'Review all tokens & components',  dot: '#2563eb' },
  { id: '2', label: 'Ship changelog page',     detail: 'Write copy and implement layout', dot: '#16a34a' },
  { id: '3', label: 'Update API docs',         detail: 'Add new endpoints and examples',  dot: '#9333ea' },
  { id: '4', label: 'Write unit tests',        detail: 'Cover auth and data layers',      dot: '#ea580c' },
  { id: '5', label: 'Fix Safari overflow bug', detail: 'Reproduction on mobile viewport', dot: '#dc2626' },
]

const GAP = 8

export function DraggableList() {
  const [tasks, setTasks]                 = useState<Task[]>(INITIAL)
  const [renderDragIdx, setRenderDragIdx] = useState(-1)
  const [deltaY, setDeltaY]               = useState(0)
  const [renderOverIdx, setRenderOverIdx] = useState(-1)

  // Mutable drag state in refs — handlers never go stale
  const isDragging  = useRef(false)
  const dragIdx     = useRef(-1)
  const startY      = useRef(0)
  const itemH       = useRef(0)
  const snapRects   = useRef<DOMRect[]>([])
  const overIdxRef  = useRef(-1)
  const itemRefs    = useRef<(HTMLDivElement | null)[]>([])

  const handleMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault()
    const rects         = itemRefs.current.map(el => el?.getBoundingClientRect() ?? new DOMRect())
    isDragging.current  = true
    dragIdx.current     = index
    startY.current      = e.clientY
    itemH.current       = rects[index].height
    snapRects.current   = rects
    overIdxRef.current  = index
    setRenderDragIdx(index)
    setDeltaY(0)
    setRenderOverIdx(index)
  }, [])

  useEffect(() => {
    const computeOver = (y: number): number => {
      let result = 0
      for (let i = 0; i < snapRects.current.length; i++) {
        const { top, height } = snapRects.current[i]
        if (y >= top + height / 2) result = i
      }
      return result
    }

    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const over         = computeOver(e.clientY)
      overIdxRef.current = over
      setDeltaY(e.clientY - startY.current)
      setRenderOverIdx(over)
    }

    const onUp = () => {
      if (!isDragging.current) return
      const from = dragIdx.current
      const to   = overIdxRef.current
      if (from !== to && from >= 0 && to >= 0) {
        setTasks(prev => {
          const next = [...prev]
          const [removed] = next.splice(from, 1)
          next.splice(to, 0, removed)
          return next
        })
      }
      isDragging.current = false
      dragIdx.current    = -1
      overIdxRef.current = -1
      setRenderDragIdx(-1)
      setDeltaY(0)
      setRenderOverIdx(-1)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
    }
  }, [])

  const slotH = itemH.current + GAP

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      <p style={{
        margin: 0, fontSize: '12px', fontWeight: 500,
        color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}>
        Drag the handle to reorder
      </p>

      <div style={{ width: '420px', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: \`\${GAP}px\`, userSelect: 'none' }}>
        {tasks.map((task, index) => {
          const isDraggingThis = index === renderDragIdx
          let translateY = 0
          if (renderDragIdx >= 0 && !isDraggingThis) {
            const from = renderDragIdx, to = renderOverIdx
            if (from < to && index > from && index <= to) translateY = -slotH
            else if (from > to && index >= to && index < from) translateY = slotH
          }

          return (
            <div
              key={task.id}
              ref={el => { itemRefs.current[index] = el }}
              style={{
                position: 'relative',
                zIndex: isDraggingThis ? 10 : 1,
                transform: isDraggingThis
                  ? \`translateY(\${deltaY}px)\`
                  : \`translateY(\${translateY}px)\`,
                transition: isDraggingThis
                  ? 'box-shadow 200ms ease'
                  : 'transform 180ms cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              <div style={{
                background: '#fff',
                border: \`1px solid \${isDraggingThis ? 'rgba(10,10,10,0.13)' : 'rgba(10,10,10,0.08)'}\`,
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: isDraggingThis
                  ? '0 16px 40px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08)'
                  : '0 1px 2px rgba(0,0,0,0.04)',
                transition: 'box-shadow 200ms ease, border-color 200ms ease',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              }}>
                {/* Drag handle */}
                <div
                  onMouseDown={e => handleMouseDown(e, index)}
                  style={{
                    cursor: isDraggingThis ? 'grabbing' : 'grab',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '3.5px',
                    padding: '5px',
                    margin: '-5px',
                    borderRadius: '5px',
                    flexShrink: 0,
                    color: 'rgba(10,10,10,0.28)',
                    transition: 'color 150ms ease',
                  }}
                  onMouseEnter={e => { if (!isDraggingThis) e.currentTarget.style.color = 'rgba(10,10,10,0.56)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(10,10,10,0.28)' }}
                >
                  {[0,1,2,3,4,5].map(i => (
                    <div key={i} style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'currentColor' }} />
                  ))}
                </div>

                {/* Color dot */}
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: task.dot, flexShrink: 0, opacity: 0.8 }} />

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                    {task.label}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.46)', letterSpacing: '-0.01em' }}>
                    {task.detail}
                  </p>
                </div>

                {/* Position badge */}
                <div style={{
                  width: '22px', height: '22px', borderRadius: '7px',
                  background: 'rgba(10,10,10,0.05)', border: '1px solid rgba(10,10,10,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 600, color: 'rgba(10,10,10,0.35)', flexShrink: 0,
                }}>
                  {index + 1}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => setTasks(INITIAL)}
        style={{
          padding: '7px 16px', borderRadius: '8px',
          border: '1px solid rgba(10,10,10,0.08)', background: '#fff',
          color: 'rgba(10,10,10,0.52)', fontSize: '12.5px', fontWeight: 500,
          letterSpacing: '-0.01em', cursor: 'pointer',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)', transition: 'background 150ms ease, color 150ms ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,10,10,0.05)'; e.currentTarget.style.color = '#0a0a0a' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'rgba(10,10,10,0.52)' }}
      >
        Reset order
      </button>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DraggableListPage() {
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
        <DraggableList />
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
