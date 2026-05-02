'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

const FONT   = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'
const ITEM_H = 56
const GAP    = 8
const SLOT   = ITEM_H + GAP   // 64 px per list slot

// ─── Types ────────────────────────────────────────────────────────────────────

interface Item {
  id: number
  label: string
  description: string
  icon: string
}

interface DragState {
  id: number
  startY: number
  startIndex: number
  currentIndex: number
  currentDY: number
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DEFAULT_ITEMS: Item[] = [
  { id: 1, label: 'Design System',  description: 'Components & tokens',      icon: '◈' },
  { id: 2, label: 'Prototyping',    description: 'Wireframes & mockups',      icon: '◉' },
  { id: 3, label: 'User Research',  description: 'Interviews & testing',      icon: '○' },
  { id: 4, label: 'Accessibility',  description: 'WCAG compliance',           icon: '⊕' },
  { id: 5, label: 'Motion Design',  description: 'Animations & easing',       icon: '◎' },
  { id: 6, label: 'Documentation',  description: 'Specs & guidelines',        icon: '⌁' },
]

// ─── DragHandle ───────────────────────────────────────────────────────────────

function DragHandle({ onPointerDown }: { onPointerDown: (e: React.PointerEvent) => void }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onPointerDown={onPointerDown}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 3px)',
        gridTemplateRows: 'repeat(3, 3px)',
        gap: '3px',
        padding: '8px 6px',
        cursor: 'grab',
        flexShrink: 0,
        opacity: hov ? 0.45 : 0.18,
        transition: 'opacity 150ms ease',
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{ width: 3, height: 3, borderRadius: '50%', background: '#0a0a0a' }}
        />
      ))}
    </div>
  )
}

// ─── DraggableList ────────────────────────────────────────────────────────────

function DraggableList() {
  const [items, setItems] = useState<Item[]>(DEFAULT_ITEMS)
  const lenRef            = useRef(items.length)
  const dragRef           = useRef<DragState | null>(null)
  const [ds, setDs]       = useState<DragState | null>(null)

  useEffect(() => { lenRef.current = items.length }, [items])

  const startDrag = useCallback((e: React.PointerEvent, id: number, index: number) => {
    e.preventDefault()
    const s: DragState = {
      id, startY: e.clientY,
      startIndex: index, currentIndex: index, currentDY: 0,
    }
    dragRef.current = s
    setDs({ ...s })
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return
      const dy = e.clientY - dragRef.current.startY
      const ci = Math.max(0, Math.min(
        lenRef.current - 1,
        Math.round((dragRef.current.startIndex * SLOT + dy) / SLOT),
      ))
      dragRef.current = { ...dragRef.current, currentDY: dy, currentIndex: ci }
      setDs({ ...dragRef.current })
    }

    const onUp = () => {
      if (!dragRef.current) return
      const { id, currentIndex } = dragRef.current
      setItems(prev => {
        const arr  = [...prev]
        const from = arr.findIndex(x => x.id === id)
        const [removed] = arr.splice(from, 1)
        arr.splice(currentIndex, 0, removed)
        return arr
      })
      dragRef.current = null
      setDs(null)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup',   onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup',   onUp)
    }
  }, [])

  const si = ds?.startIndex   ?? 0
  const ci = ds?.currentIndex ?? 0

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ width: 320, userSelect: 'none' }}>
        {items.map((item, i) => {
          const active = ds?.id === item.id

          let shift = 0
          if (ds && !active) {
            if (si < ci && i > si && i <= ci) shift = -SLOT
            if (si > ci && i >= ci && i < si) shift =  SLOT
          }

          return (
            <div
              key={item.id}
              style={{
                marginBottom: GAP,
                position: 'relative',
                zIndex: active ? 10 : 1,
                transform: active
                  ? `translateY(${ds!.currentDY}px)`
                  : `translateY(${shift}px)`,
                transition: active ? 'none' : 'transform 200ms cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            >
              <div
                style={{
                  background: '#fff',
                  border: `1px solid rgba(10,10,10,${active ? 0.14 : 0.08})`,
                  borderRadius: 12,
                  padding: '0 16px 0 4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  height: ITEM_H,
                  boxSizing: 'border-box',
                  boxShadow: active
                    ? '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)'
                    : '0 1px 2px rgba(0,0,0,0.04)',
                  transition: 'box-shadow 200ms ease, border-color 200ms ease',
                }}
              >
                <DragHandle onPointerDown={e => startDrag(e, item.id, i)} />

                <span
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(10,10,10,0.04)',
                    border: '1px solid rgba(10,10,10,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 600,
                    color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: '18px',
                  }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 500,
                    color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em', lineHeight: '15px',
                  }}>
                    {item.description}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Reset */}
      <button
        onClick={() => setItems(DEFAULT_ITEMS)}
        style={{
          marginTop: 20,
          padding: '7px 14px',
          background: 'rgba(10,10,10,0.04)',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: 8,
          fontSize: 12, fontWeight: 600,
          color: 'rgba(10,10,10,0.45)',
          letterSpacing: '-0.01em',
          cursor: 'pointer',
          fontFamily: FONT,
          transition: 'background 150ms ease, color 150ms ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(10,10,10,0.07)'
          e.currentTarget.style.color      = 'rgba(10,10,10,0.65)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(10,10,10,0.04)'
          e.currentTarget.style.color      = 'rgba(10,10,10,0.45)'
        }}
      >
        Reset order
      </button>
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const FONT   = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'
const ITEM_H = 56
const GAP    = 8
const SLOT   = ITEM_H + GAP  // 64 px per slot

interface Item {
  id: number
  label: string
  description: string
  icon: string
}

interface DragState {
  id: number
  startY: number
  startIndex: number
  currentIndex: number
  currentDY: number
}

const DEFAULT_ITEMS: Item[] = [
  { id: 1, label: 'Design System',  description: 'Components & tokens',  icon: '◈' },
  { id: 2, label: 'Prototyping',    description: 'Wireframes & mockups', icon: '◉' },
  { id: 3, label: 'User Research',  description: 'Interviews & testing', icon: '○' },
  { id: 4, label: 'Accessibility',  description: 'WCAG compliance',      icon: '⊕' },
  { id: 5, label: 'Motion Design',  description: 'Animations & easing',  icon: '◎' },
  { id: 6, label: 'Documentation',  description: 'Specs & guidelines',   icon: '⌁' },
]

function DragHandle({ onPointerDown }: { onPointerDown: (e: React.PointerEvent) => void }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onPointerDown={onPointerDown}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 3px)',
        gridTemplateRows: 'repeat(3, 3px)',
        gap: '3px',
        padding: '8px 6px',
        cursor: 'grab',
        flexShrink: 0,
        opacity: hov ? 0.45 : 0.18,
        transition: 'opacity 150ms ease',
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: '#0a0a0a' }} />
      ))}
    </div>
  )
}

export function DraggableList() {
  const [items, setItems] = useState<Item[]>(DEFAULT_ITEMS)
  const lenRef            = useRef(items.length)
  const dragRef           = useRef<DragState | null>(null)
  const [ds, setDs]       = useState<DragState | null>(null)

  useEffect(() => { lenRef.current = items.length }, [items])

  const startDrag = useCallback((e: React.PointerEvent, id: number, index: number) => {
    e.preventDefault()
    const s: DragState = {
      id, startY: e.clientY,
      startIndex: index, currentIndex: index, currentDY: 0,
    }
    dragRef.current = s
    setDs({ ...s })
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return
      const dy = e.clientY - dragRef.current.startY
      const ci = Math.max(0, Math.min(
        lenRef.current - 1,
        Math.round((dragRef.current.startIndex * SLOT + dy) / SLOT),
      ))
      dragRef.current = { ...dragRef.current, currentDY: dy, currentIndex: ci }
      setDs({ ...dragRef.current })
    }

    const onUp = () => {
      if (!dragRef.current) return
      const { id, currentIndex } = dragRef.current
      setItems(prev => {
        const arr  = [...prev]
        const from = arr.findIndex(x => x.id === id)
        const [removed] = arr.splice(from, 1)
        arr.splice(currentIndex, 0, removed)
        return arr
      })
      dragRef.current = null
      setDs(null)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup',   onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup',   onUp)
    }
  }, [])

  const si = ds?.startIndex   ?? 0
  const ci = ds?.currentIndex ?? 0

  return (
    <div style={{ width: 320, userSelect: 'none', fontFamily: FONT }}>
      {items.map((item, i) => {
        const active = ds?.id === item.id

        let shift = 0
        if (ds && !active) {
          if (si < ci && i > si && i <= ci) shift = -SLOT
          if (si > ci && i >= ci && i < si) shift =  SLOT
        }

        return (
          <div
            key={item.id}
            style={{
              marginBottom: GAP,
              position: 'relative',
              zIndex: active ? 10 : 1,
              transform: active
                ? \`translateY(\${ds!.currentDY}px)\`
                : \`translateY(\${shift}px)\`,
              transition: active ? 'none' : 'transform 200ms cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            <div style={{
              background: '#fff',
              border: \`1px solid rgba(10,10,10,\${active ? 0.14 : 0.08})\`,
              borderRadius: 12,
              padding: '0 16px 0 4px',
              display: 'flex', alignItems: 'center', gap: 10,
              height: ITEM_H,
              boxSizing: 'border-box',
              boxShadow: active
                ? '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)'
                : '0 1px 2px rgba(0,0,0,0.04)',
              transition: 'box-shadow 200ms ease, border-color 200ms ease',
            }}>
              <DragHandle onPointerDown={e => startDrag(e, item.id, i)} />
              <span style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(10,10,10,0.04)',
                border: '1px solid rgba(10,10,10,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, flexShrink: 0,
              }}>
                {item.icon}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: '18px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em', lineHeight: '15px' }}>
                  {item.description}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DraggableListPage() {
  return (
    <main style={{ backgroundColor: 'var(--bg, #ffffff)', minHeight: '100vh', fontFamily: FONT }}>

      {/* ── Demo ── */}
      <section
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
          padding: '60px 24px',
          gap: 20,
        }}
      >
        <DraggableList />
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: 'rgba(0,0,0,0.35)',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            fontFamily: FONT,
          }}
        >
          Drag the handle to reorder items
        </p>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: 760, margin: '0 auto' }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-muted, rgba(10,10,10,0.4))',
            marginBottom: 12,
          }}
        >
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 20, overflowX: 'auto' }}>
          <pre
            style={{
              margin: 0,
              fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
              fontSize: 12,
              lineHeight: '1.65',
              color: '#e5e5e5',
              whiteSpace: 'pre',
              overflowX: 'auto',
            }}
          >
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
