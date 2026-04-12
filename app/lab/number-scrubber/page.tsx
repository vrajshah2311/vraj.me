'use client'

import { useState, useRef, useCallback } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── NumberScrubber ───────────────────────────────────────────────────────────

interface ScrubberProps {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  unit?: string
  decimals?: number
  onChange: (v: number) => void
}

function NumberScrubber({
  label, value, min = -Infinity, max = Infinity, step = 1, unit = '', decimals = 0, onChange,
}: ScrubberProps) {
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [hovered, setHovered] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragRef = useRef({ startX: 0, startVal: 0 })

  const clamp = useCallback((v: number) => Math.min(max, Math.max(min, v)), [min, max])
  const fmt = (v: number) => v.toFixed(decimals)

  const startEdit = () => {
    setInputVal(fmt(value))
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 10)
  }

  const commitEdit = () => {
    const parsed = parseFloat(inputVal)
    if (!isNaN(parsed)) onChange(clamp(parsed))
    setEditing(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (editing) return
    e.preventDefault()
    const m = e.shiftKey ? 10 : e.altKey ? 0.1 : 1
    onChange(clamp(parseFloat((value - Math.sign(e.deltaY) * step * m).toFixed(decimals))))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (editing) return
    e.preventDefault()
    dragRef.current = { startX: e.clientX, startVal: value }
    setDragging(true)

    const onMove = (ev: MouseEvent) => {
      const m = ev.shiftKey ? 10 : ev.altKey ? 0.1 : 1
      const raw = dragRef.current.startVal + (ev.clientX - dragRef.current.startX) * step * m
      onChange(clamp(parseFloat(raw.toFixed(decimals))))
    }
    const onUp = () => {
      setDragging(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (editing) return
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const m = e.shiftKey ? 10 : e.altKey ? 0.1 : 1
      const dir = e.key === 'ArrowUp' ? 1 : -1
      onChange(clamp(parseFloat((value + dir * step * m).toFixed(decimals))))
    } else if (e.key === 'Enter') {
      startEdit()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{
        fontSize: '10px', fontWeight: 500, letterSpacing: '0.04em',
        textTransform: 'uppercase', color: 'rgba(10,10,10,0.38)', fontFamily: FONT,
      }}>
        {label}
      </span>
      <div
        tabIndex={editing ? -1 : 0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseDown={handleMouseDown}
        onDoubleClick={startEdit}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        style={{
          height: '32px',
          background: editing ? '#fff' : hovered || dragging ? 'rgba(10,10,10,0.06)' : 'rgba(10,10,10,0.04)',
          border: editing ? '1px solid rgba(10,10,10,0.2)' : '1px solid rgba(10,10,10,0.08)',
          borderRadius: '7px',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '10px',
          paddingRight: '10px',
          cursor: editing ? 'text' : 'ew-resize',
          transition: 'background 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
          boxShadow: editing ? '0 0 0 3px rgba(0,0,0,0.06)' : 'none',
          outline: 'none',
          userSelect: 'none',
        }}
      >
        {editing ? (
          <input
            ref={inputRef}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => {
              if (e.key === 'Enter') commitEdit()
              if (e.key === 'Escape') setEditing(false)
            }}
            style={{
              width: '100%', background: 'none', border: 'none', outline: 'none',
              fontSize: '13px', fontWeight: 500, color: '#0a0a0a',
              letterSpacing: '-0.01em', fontFamily: FONT, padding: 0, cursor: 'text',
            }}
          />
        ) : (
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT }}>
            {fmt(value)}{unit}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function PropertyPanel() {
  const [w, setW] = useState(200)
  const [h, setH] = useState(140)
  const [opacity, setOpacity] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [radius, setRadius] = useState(12)
  const [blur, setBlur] = useState(0)

  const scale = Math.min(1, 180 / Math.max(w, h, 1))
  const dw = Math.round(w * scale)
  const dh = Math.round(h * scale)

  return (
    <div style={{ display: 'flex', gap: '28px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>

      {/* Preview */}
      <div style={{
        width: '200px',
        height: '200px',
        background: 'rgba(10,10,10,0.04)',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${dw}px`,
          height: `${dh}px`,
          background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)',
          borderRadius: `${radius}px`,
          opacity: opacity / 100,
          transform: `rotate(${rotation}deg)`,
          filter: blur > 0 ? `blur(${blur}px)` : 'none',
          flexShrink: 0,
        }} />
      </div>

      {/* Property panel */}
      <div style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '14px',
        padding: '16px',
        width: '204px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        fontFamily: FONT,
      }}>
        <p style={{
          margin: '0 0 12px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.35)',
        }}>
          Frame
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <NumberScrubber label="W" value={w} min={10} max={400} step={1} unit="px" onChange={setW} />
          <NumberScrubber label="H" value={h} min={10} max={400} step={1} unit="px" onChange={setH} />
          <NumberScrubber label="Opacity" value={opacity} min={0} max={100} step={1} unit="%" onChange={setOpacity} />
          <NumberScrubber label="Rotation" value={rotation} min={-180} max={180} step={1} unit="°" onChange={setRotation} />
          <NumberScrubber label="Radius" value={radius} min={0} max={100} step={1} unit="px" onChange={setRadius} />
          <NumberScrubber label="Blur" value={blur} min={0} max={40} step={0.5} decimals={1} unit="px" onChange={setBlur} />
        </div>
        <p style={{
          margin: '14px 0 0',
          fontSize: '11px',
          lineHeight: '1.55',
          color: 'rgba(10,10,10,0.32)',
          letterSpacing: '-0.01em',
        }}>
          Scroll or drag to scrub · double-click to type · ↑↓ keys · shift ×10 · alt ×0.1
        </p>
      </div>
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useCallback } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

interface ScrubberProps {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  unit?: string
  decimals?: number
  onChange: (v: number) => void
}

export function NumberScrubber({
  label, value, min = -Infinity, max = Infinity, step = 1, unit = '', decimals = 0, onChange,
}: ScrubberProps) {
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [hovered, setHovered] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragRef = useRef({ startX: 0, startVal: 0 })

  const clamp = useCallback((v: number) => Math.min(max, Math.max(min, v)), [min, max])
  const fmt = (v: number) => v.toFixed(decimals)

  const startEdit = () => {
    setInputVal(fmt(value))
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 10)
  }

  const commitEdit = () => {
    const parsed = parseFloat(inputVal)
    if (!isNaN(parsed)) onChange(clamp(parsed))
    setEditing(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (editing) return
    e.preventDefault()
    const m = e.shiftKey ? 10 : e.altKey ? 0.1 : 1
    onChange(clamp(parseFloat((value - Math.sign(e.deltaY) * step * m).toFixed(decimals))))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (editing) return
    e.preventDefault()
    dragRef.current = { startX: e.clientX, startVal: value }
    setDragging(true)

    const onMove = (ev: MouseEvent) => {
      const m = ev.shiftKey ? 10 : ev.altKey ? 0.1 : 1
      const raw = dragRef.current.startVal + (ev.clientX - dragRef.current.startX) * step * m
      onChange(clamp(parseFloat(raw.toFixed(decimals))))
    }
    const onUp = () => {
      setDragging(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (editing) return
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const m = e.shiftKey ? 10 : e.altKey ? 0.1 : 1
      const dir = e.key === 'ArrowUp' ? 1 : -1
      onChange(clamp(parseFloat((value + dir * step * m).toFixed(decimals))))
    } else if (e.key === 'Enter') {
      startEdit()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{
        fontSize: '10px', fontWeight: 500, letterSpacing: '0.04em',
        textTransform: 'uppercase', color: 'rgba(10,10,10,0.38)', fontFamily: FONT,
      }}>
        {label}
      </span>
      <div
        tabIndex={editing ? -1 : 0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseDown={handleMouseDown}
        onDoubleClick={startEdit}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        style={{
          height: '32px',
          background: editing ? '#fff' : hovered || dragging ? 'rgba(10,10,10,0.06)' : 'rgba(10,10,10,0.04)',
          border: editing ? '1px solid rgba(10,10,10,0.2)' : '1px solid rgba(10,10,10,0.08)',
          borderRadius: '7px',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '10px',
          paddingRight: '10px',
          cursor: editing ? 'text' : 'ew-resize',
          transition: 'background 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
          boxShadow: editing ? '0 0 0 3px rgba(0,0,0,0.06)' : 'none',
          outline: 'none',
          userSelect: 'none',
        }}
      >
        {editing ? (
          <input
            ref={inputRef}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => {
              if (e.key === 'Enter') commitEdit()
              if (e.key === 'Escape') setEditing(false)
            }}
            style={{
              width: '100%', background: 'none', border: 'none', outline: 'none',
              fontSize: '13px', fontWeight: 500, color: '#0a0a0a',
              letterSpacing: '-0.01em', fontFamily: FONT, padding: 0, cursor: 'text',
            }}
          />
        ) : (
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT }}>
            {fmt(value)}{unit}
          </span>
        )}
      </div>
    </div>
  )
}

// Usage
export default function Example() {
  const [width, setWidth] = useState(240)
  const [height, setHeight] = useState(160)
  const [opacity, setOpacity] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [radius, setRadius] = useState(8)
  const [blur, setBlur] = useState(0)

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '14px',
      padding: '16px',
      width: '204px',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <NumberScrubber label="W" value={width} min={10} max={400} unit="px" onChange={setWidth} />
        <NumberScrubber label="H" value={height} min={10} max={400} unit="px" onChange={setHeight} />
        <NumberScrubber label="Opacity" value={opacity} min={0} max={100} unit="%" onChange={setOpacity} />
        <NumberScrubber label="Rotation" value={rotation} min={-180} max={180} unit="°" onChange={setRotation} />
        <NumberScrubber label="Radius" value={radius} min={0} max={100} unit="px" onChange={setRadius} />
        <NumberScrubber label="Blur" value={blur} min={0} max={40} step={0.5} decimals={1} unit="px" onChange={setBlur} />
      </div>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NumberScrubberPage() {
  return (
    <main style={{
      backgroundColor: 'var(--bg, #ffffff)',
      minHeight: '100vh',
      fontFamily: FONT,
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
        <PropertyPanel />
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
