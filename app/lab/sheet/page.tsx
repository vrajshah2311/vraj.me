'use client'

import { useState, useRef, useEffect } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Sheet ────────────────────────────────────────────────────────────────────

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  snapHeights?: number[]
}

function Sheet({ open, onClose, title, children, snapHeights = [300, 500] }: SheetProps) {
  const [height, setHeight]       = useState(snapHeights[0])
  const [dragDelta, setDragDelta] = useState(0)
  const [dragging, setDragging]   = useState(false)
  const [mounted, setMounted]     = useState(false)
  const [visible, setVisible]     = useState(false)

  const heightRef    = useRef(snapHeights[0])
  const dragRef      = useRef({ y: 0, active: false })
  const dragDeltaRef = useRef(0)

  // Mount / unmount with entrance animation
  useEffect(() => {
    if (open) {
      const h = snapHeights[0]
      setHeight(h); heightRef.current = h
      setDragDelta(0); dragDeltaRef.current = 0
      setMounted(true)
      const raf = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(raf)
    }
    setVisible(false)
    const t = setTimeout(() => setMounted(false), 320)
    return () => clearTimeout(t)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // Body scroll lock
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { y: e.clientY, active: true }
    setDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return
    const d = Math.max(0, e.clientY - dragRef.current.y)
    setDragDelta(d)
    dragDeltaRef.current = d
  }

  const onPointerUp = () => {
    if (!dragRef.current.active) return
    dragRef.current.active = false
    setDragging(false)

    const d = dragDeltaRef.current
    setDragDelta(0); dragDeltaRef.current = 0

    // Dismiss if dragged far enough
    if (d > heightRef.current * 0.32) { onClose(); return }

    // Snap to nearest snap point
    if (snapHeights.length > 1) {
      const target = heightRef.current - d
      const snap = snapHeights.reduce((a, b) =>
        Math.abs(b - target) < Math.abs(a - target) ? b : a
      )
      setHeight(snap); heightRef.current = snap
    }
  }

  if (!mounted) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.42)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 300ms ease',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height,
        background: '#fff',
        borderRadius: '16px 16px 0 0',
        border: '1px solid rgba(10,10,10,0.08)',
        borderBottom: 'none',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.12), 0 -1px 4px rgba(0,0,0,0.06)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: FONT,
        transform: visible ? `translateY(${dragDelta}px)` : 'translateY(100%)',
        transition: dragging
          ? 'none'
          : 'transform 300ms cubic-bezier(0.32,0.72,0,1), height 260ms cubic-bezier(0.32,0.72,0,1)',
        willChange: 'transform',
      }}>

        {/* Drag handle */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{
            padding: '10px 0 6px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: dragging ? 'grabbing' : 'grab',
            touchAction: 'none', userSelect: 'none',
          }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(10,10,10,0.14)' }} />
        </div>

        {/* Header */}
        {title && (
          <>
            <div style={{ padding: '4px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                {title}
              </span>
              <button
                onClick={onClose}
                style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(10,10,10,0.07)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'rgba(10,10,10,0.5)', transition: 'background 150ms ease', fontFamily: FONT }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.13)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.07)')}
              >
                ✕
              </button>
            </div>
            <div style={{ height: 1, background: 'rgba(10,10,10,0.06)', flexShrink: 0 }} />
          </>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 0' }}>
          {children}
        </div>

        {/* Snap indicators */}
        {snapHeights.length > 1 && (
          <div style={{ padding: '10px 0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, flexShrink: 0 }}>
            {snapHeights.map(h => (
              <button
                key={h}
                onClick={() => { setHeight(h); heightRef.current = h }}
                style={{
                  height: 5,
                  width: height === h ? 18 : 5,
                  borderRadius: 3,
                  background: height === h ? '#0a0a0a' : 'rgba(10,10,10,0.18)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'width 200ms cubic-bezier(0.32,0.72,0,1), background 200ms ease',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

const TEAM = [
  { id: 1, name: 'Sarah Chen',   role: 'Product Designer',    initials: 'SC', bg: '#e0f2fe', fg: '#0369a1', location: 'San Francisco', joined: 'Jan 2023', projects: 12, email: 'sarah@design.co' },
  { id: 2, name: 'Marcus Reed',  role: 'Software Engineer',   initials: 'MR', bg: '#f0fdf4', fg: '#166534', location: 'New York',       joined: 'Mar 2022', projects: 28, email: 'marcus@design.co' },
  { id: 3, name: 'Priya Nair',   role: 'Product Manager',     initials: 'PN', bg: '#fdf4ff', fg: '#7e22ce', location: 'Austin',         joined: 'Sep 2023', projects: 8,  email: 'priya@design.co' },
]

function Demo() {
  const [selected, setSelected] = useState<typeof TEAM[0] | null>(null)

  return (
    <>
      <div style={{ width: 340, maxWidth: 'calc(100vw - 48px)', fontFamily: FONT }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid rgba(10,10,10,0.08)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 20px 8px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em', color: '#0a0a0a' }}>Team</div>
            <div style={{ fontSize: 12, color: 'rgba(10,10,10,0.4)', marginTop: 2, letterSpacing: '-0.01em' }}>3 members</div>
          </div>

          {TEAM.map((member, i) => (
            <button
              key={member.id}
              onClick={() => setSelected(member)}
              style={{
                width: '100%', padding: '10px 20px',
                background: 'none', border: 'none',
                borderTop: i > 0 ? '1px solid rgba(10,10,10,0.05)' : 'none',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
                textAlign: 'left',
                transition: 'background 150ms ease', fontFamily: FONT,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.025)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: member.bg, color: member.fg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, flexShrink: 0, letterSpacing: '-0.02em',
              }}>
                {member.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {member.name}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(10,10,10,0.4)', marginTop: 1, letterSpacing: '-0.01em' }}>
                  {member.role}
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'rgba(10,10,10,0.2)' }}>
                <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>

        <p style={{ margin: '16px 0 0', fontSize: 12, color: 'rgba(0,0,0,0.32)', fontWeight: 500, letterSpacing: '-0.01em', textAlign: 'center', fontFamily: FONT }}>
          Click a member · drag handle to dismiss · dots to snap
        </p>
      </div>

      <Sheet
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        snapHeights={[300, 480]}
      >
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Avatar + role */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 16, borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: selected.bg, color: selected.fg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', flexShrink: 0,
              }}>
                {selected.initials}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                  {selected.name}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(10,10,10,0.45)', marginTop: 2, letterSpacing: '-0.01em' }}>
                  {selected.role}
                </div>
              </div>
            </div>

            {/* Info rows */}
            <div style={{ paddingTop: 4 }}>
              {[
                { label: 'Email',     value: selected.email },
                { label: 'Location',  value: selected.location },
                { label: 'Joined',    value: selected.joined },
                { label: 'Projects',  value: `${selected.projects} active` },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '11px 0', borderBottom: '1px solid rgba(10,10,10,0.05)',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em' }}>
                    {row.label}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, paddingTop: 16 }}>
              <button
                style={{ flex: 1, padding: '10px', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: '-0.01em', fontFamily: FONT, transition: 'background 150ms ease' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#222')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0a0a0a')}
              >
                Message
              </button>
              <button
                style={{ flex: 1, padding: '10px', background: 'rgba(10,10,10,0.06)', color: '#0a0a0a', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: '-0.01em', fontFamily: FONT, transition: 'background 150ms ease' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.06)')}
              >
                Profile
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect } from 'react'

// Drop-in bottom sheet with drag-to-dismiss and snap points.
// No dependencies required.

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  snapHeights?: number[]   // pixel heights for snap points, e.g. [300, 500]
}

export function Sheet({ open, onClose, title, children, snapHeights = [300, 500] }: SheetProps) {
  const [height, setHeight]       = useState(snapHeights[0])
  const [dragDelta, setDragDelta] = useState(0)
  const [dragging, setDragging]   = useState(false)
  const [mounted, setMounted]     = useState(false)
  const [visible, setVisible]     = useState(false)

  const heightRef    = useRef(snapHeights[0])
  const dragRef      = useRef({ y: 0, active: false })
  const dragDeltaRef = useRef(0)

  useEffect(() => {
    if (open) {
      const h = snapHeights[0]
      setHeight(h); heightRef.current = h
      setDragDelta(0); dragDeltaRef.current = 0
      setMounted(true)
      const raf = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(raf)
    }
    setVisible(false)
    const t = setTimeout(() => setMounted(false), 320)
    return () => clearTimeout(t)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { y: e.clientY, active: true }
    setDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return
    const d = Math.max(0, e.clientY - dragRef.current.y)
    setDragDelta(d); dragDeltaRef.current = d
  }

  const onPointerUp = () => {
    if (!dragRef.current.active) return
    dragRef.current.active = false
    setDragging(false)
    const d = dragDeltaRef.current
    setDragDelta(0); dragDeltaRef.current = 0
    if (d > heightRef.current * 0.32) { onClose(); return }
    if (snapHeights.length > 1) {
      const target = heightRef.current - d
      const snap = snapHeights.reduce((a, b) =>
        Math.abs(b - target) < Math.abs(a - target) ? b : a
      )
      setHeight(snap); heightRef.current = snap
    }
  }

  if (!mounted) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.42)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 300ms ease',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height,
        background: '#fff',
        borderRadius: '16px 16px 0 0',
        border: '1px solid rgba(10,10,10,0.08)',
        borderBottom: 'none',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', fontFamily: FONT,
        transform: visible ? \`translateY(\${dragDelta}px)\` : 'translateY(100%)',
        transition: dragging
          ? 'none'
          : 'transform 300ms cubic-bezier(0.32,0.72,0,1), height 260ms cubic-bezier(0.32,0.72,0,1)',
        willChange: 'transform',
      }}>

        {/* Drag handle */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{
            padding: '10px 0 6px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: dragging ? 'grabbing' : 'grab',
            touchAction: 'none', userSelect: 'none',
          }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(10,10,10,0.14)' }} />
        </div>

        {/* Optional header */}
        {title && (
          <>
            <div style={{ padding: '4px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                {title}
              </span>
              <button
                onClick={onClose}
                style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(10,10,10,0.07)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'rgba(10,10,10,0.5)' }}
              >
                ✕
              </button>
            </div>
            <div style={{ height: 1, background: 'rgba(10,10,10,0.06)', flexShrink: 0 }} />
          </>
        )}

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 0' }}>
          {children}
        </div>

        {/* Snap indicators — only shown when more than one snap point */}
        {snapHeights.length > 1 && (
          <div style={{ padding: '10px 0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, flexShrink: 0 }}>
            {snapHeights.map(h => (
              <button
                key={h}
                onClick={() => { setHeight(h); heightRef.current = h }}
                style={{
                  height: 5,
                  width: height === h ? 18 : 5,
                  borderRadius: 3,
                  background: height === h ? '#0a0a0a' : 'rgba(10,10,10,0.18)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'width 200ms cubic-bezier(0.32,0.72,0,1), background 200ms ease',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Usage ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ padding: 24, fontFamily: FONT }}>
      <button
        onClick={() => setOpen(true)}
        style={{ padding: '10px 20px', background: '#0a0a0a', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
      >
        Open Sheet
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Details" snapHeights={[300, 520]}>
        <p style={{ margin: 0, fontSize: 14, color: 'rgba(10,10,10,0.6)', lineHeight: 1.6 }}>
          Drag the handle to dismiss, or drag gently to snap between heights.
          Click the backdrop or press Escape to close.
        </p>
      </Sheet>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SheetPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: 0,
      }}>
        <Demo />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)', marginBottom: '12px',
        }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
          <pre style={{
            margin: 0,
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
            fontSize: '12px', lineHeight: '1.65', color: '#e5e5e5',
            whiteSpace: 'pre', overflowX: 'auto',
          }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
