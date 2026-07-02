'use client'

import { useState, useRef, useCallback } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ── NumberInput ───────────────────────────────────────────────────────────────

function NumberInput({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  decimals = 0,
  suffix = '',
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  decimals?: number
  suffix?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const startRef = useRef<{ y: number; value: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const clamp = useCallback((v: number) => Math.min(max, Math.max(min, v)), [min, max])
  const fmt = (v: number) => decimals > 0 ? v.toFixed(decimals) : String(v)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (editing) return
    e.preventDefault()
    startRef.current = { y: e.clientY, value }
    setDragging(true)

    const onMove = (ev: MouseEvent) => {
      if (!startRef.current) return
      const raw = startRef.current.value + (startRef.current.y - ev.clientY)
      onChange(parseFloat(clamp(raw).toFixed(decimals)))
    }
    const onUp = () => {
      setDragging(false)
      startRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (editing) return
    e.preventDefault()
    onChange(parseFloat(clamp(value + (e.deltaY < 0 ? step : -step)).toFixed(decimals)))
  }

  const handleDoubleClick = () => {
    setEditing(true)
    setDraft(fmt(value))
    setTimeout(() => { inputRef.current?.focus(); inputRef.current?.select() }, 0)
  }

  const commit = () => {
    const n = parseFloat(draft)
    if (!isNaN(n)) onChange(parseFloat(clamp(n).toFixed(decimals)))
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { commit(); return }
    if (e.key === 'Escape') { setEditing(false); return }
    const cur = parseFloat(draft)
    if (isNaN(cur)) return
    if (e.key === 'ArrowUp') { e.preventDefault(); setDraft(fmt(clamp(cur + step))) }
    if (e.key === 'ArrowDown') { e.preventDefault(); setDraft(fmt(clamp(cur - step))) }
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 30,
        borderRadius: 7,
        border: `1px solid ${dragging ? 'rgba(0,0,0,0.22)' : hovered ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.1)'}`,
        background: dragging ? 'rgba(0,0,0,0.04)' : hovered ? 'rgba(0,0,0,0.02)' : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: editing ? 'text' : 'ns-resize',
        userSelect: 'none' as const,
        transition: 'border-color 0.12s ease, background 0.12s ease',
        fontFamily: font,
        outline: editing ? '2px solid rgba(0,100,255,0.28)' : 'none',
        outlineOffset: '-1px',
      }}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            textAlign: 'center' as const,
            fontSize: 12.5,
            fontWeight: 500,
            color: '#0a0a0a',
            fontFamily: 'inherit',
            cursor: 'text',
            padding: '0 4px',
            letterSpacing: '-0.01em',
            boxSizing: 'border-box' as const,
          }}
        />
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 1,
          fontSize: 12.5,
          fontWeight: 500,
          color: '#0a0a0a',
          letterSpacing: '-0.01em',
          pointerEvents: 'none',
        }}>
          <span>{fmt(value)}</span>
          {suffix && (
            <span style={{ color: 'rgba(0,0,0,0.38)', fontSize: 11, marginLeft: 1 }}>{suffix}</span>
          )}
        </div>
      )}
    </div>
  )
}

// ── Demo ──────────────────────────────────────────────────────────────────────

const COLORS = [
  { hex: '#5B8FF9', label: 'Blue' },
  { hex: '#F4664A', label: 'Red' },
  { hex: '#30BF78', label: 'Green' },
  { hex: '#E6A23C', label: 'Amber' },
  { hex: '#9254DE', label: 'Purple' },
]

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        fontSize: 10,
        fontWeight: 600,
        color: 'rgba(0,0,0,0.35)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
        marginBottom: 8,
      }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)', marginBottom: 3 }}>
      {children}
    </div>
  )
}

function Demo() {
  const [width, setWidth] = useState(160)
  const [height, setHeight] = useState(160)
  const [opacity, setOpacity] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [radius, setRadius] = useState(20)
  const [color, setColor] = useState('#5B8FF9')

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
      padding: '40px 16px',
      fontFamily: font,
    }}>
      <style>{`
        @media (max-width: 560px) { .ni-card { flex-direction: column !important; } .ni-preview { min-height: 200px !important; border-right: none !important; border-bottom: 1px solid rgba(0,0,0,0.06) !important; } .ni-inspector { width: 100% !important; } }
      `}</style>

      <div
        className="ni-card"
        style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'row' as const,
          overflow: 'hidden',
          width: '100%',
          maxWidth: 620,
        }}
      >
        {/* Preview area */}
        <div
          className="ni-preview"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 340,
            position: 'relative' as const,
            borderRight: '1px solid rgba(0,0,0,0.06)',
            overflow: 'hidden',
            background: '#f8f8f8',
          }}
        >
          {/* Checker pattern */}
          <div style={{
            position: 'absolute' as const,
            inset: 0,
            backgroundImage: 'repeating-conic-gradient(rgba(0,0,0,0.04) 0% 25%, transparent 0% 50%)',
            backgroundSize: '14px 14px',
          }} />
          {/* Preview box */}
          <div style={{
            width,
            height,
            background: color,
            borderRadius: Math.min(radius, Math.min(width, height) / 2),
            opacity: opacity / 100,
            transform: `rotate(${rotation}deg)`,
            position: 'relative' as const,
            zIndex: 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            flexShrink: 0,
          }} />
        </div>

        {/* Inspector */}
        <div
          className="ni-inspector"
          style={{
            width: 200,
            flexShrink: 0,
            padding: '18px 16px',
            display: 'flex',
            flexDirection: 'column' as const,
            gap: 18,
          }}
        >
          {/* Fill */}
          <Row label="Fill">
            <div style={{ display: 'flex', gap: 6 }}>
              {COLORS.map(c => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  title={c.label}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: c.hex,
                    border: color === c.hex ? '2px solid #0a0a0a' : '2px solid transparent',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'transform 0.12s ease, border-color 0.12s ease',
                    transform: color === c.hex ? 'scale(1.18)' : 'scale(1)',
                    flexShrink: 0,
                    outline: 'none',
                  }}
                />
              ))}
            </div>
          </Row>

          {/* Size */}
          <Row label="Size">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <div>
                <FieldLabel>W</FieldLabel>
                <NumberInput value={width} onChange={setWidth} min={40} max={280} step={1} />
              </div>
              <div>
                <FieldLabel>H</FieldLabel>
                <NumberInput value={height} onChange={setHeight} min={40} max={280} step={1} />
              </div>
            </div>
          </Row>

          {/* Transform */}
          <Row label="Transform">
            <FieldLabel>Rotate</FieldLabel>
            <NumberInput value={rotation} onChange={setRotation} min={-360} max={360} step={1} suffix="°" />
          </Row>

          {/* Appearance */}
          <Row label="Appearance">
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
              <div>
                <FieldLabel>Opacity</FieldLabel>
                <NumberInput value={opacity} onChange={setOpacity} min={0} max={100} step={1} suffix="%" />
              </div>
              <div>
                <FieldLabel>Radius</FieldLabel>
                <NumberInput value={radius} onChange={setRadius} min={0} max={140} step={1} suffix="px" />
              </div>
            </div>
          </Row>

          {/* Hint */}
          <div style={{
            fontSize: 10,
            color: 'rgba(0,0,0,0.28)',
            letterSpacing: '-0.005em',
            lineHeight: 1.55,
            borderTop: '1px solid rgba(0,0,0,0.06)',
            paddingTop: 12,
            marginTop: 'auto' as const,
          }}>
            Drag ↕ or scroll to change<br />
            Double-click to type a value
          </div>
        </div>
      </div>
    </div>
  )
}

// ── CopyButton ────────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {}
      }}
      style={{
        padding: '5px 12px',
        background: copied ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 7,
        color: copied ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: font,
        letterSpacing: '-0.01em',
        transition: 'background 0.15s ease, color 0.15s ease',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ── Code source ───────────────────────────────────────────────────────────────

const CODE_SOURCE = `'use client'

import { useState, useRef } from 'react'

/**
 * NumberInput — drag ↕, scroll, or double-click to edit
 *
 * Props:
 *   value     — controlled numeric value
 *   onChange  — (number) => void
 *   min/max   — clamp bounds          (default: -Infinity / Infinity)
 *   step      — scroll & kbd delta    (default: 1)
 *   decimals  — decimal precision     (default: 0)
 *   suffix    — unit label            (default: '')
 */
function NumberInput({ value, onChange, min = -Infinity, max = Infinity, step = 1, decimals = 0, suffix = '' }) {
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState('')
  const [dragging, setDragging] = useState(false)
  const [hovered,  setHovered]  = useState(false)
  const startRef = useRef(null)
  const inputRef = useRef(null)

  const clamp = (v) => Math.min(max, Math.max(min, v))
  const fmt   = (v) => decimals > 0 ? v.toFixed(decimals) : String(v)

  // ── Drag to change ──────────────────────────────────────────────────────────
  const handleMouseDown = (e) => {
    if (editing) return
    e.preventDefault()
    startRef.current = { y: e.clientY, value }
    setDragging(true)

    const onMove = (ev) => {
      if (!startRef.current) return
      const raw = startRef.current.value + (startRef.current.y - ev.clientY)
      onChange(parseFloat(clamp(raw).toFixed(decimals)))
    }
    const onUp = () => {
      setDragging(false)
      startRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  // ── Scroll to change ────────────────────────────────────────────────────────
  const handleWheel = (e) => {
    if (editing) return
    e.preventDefault()
    onChange(parseFloat(clamp(value + (e.deltaY < 0 ? step : -step)).toFixed(decimals)))
  }

  // ── Double-click to type ────────────────────────────────────────────────────
  const handleDoubleClick = () => {
    setEditing(true)
    setDraft(fmt(value))
    setTimeout(() => { inputRef.current?.focus(); inputRef.current?.select() }, 0)
  }

  const commit = () => {
    const n = parseFloat(draft)
    if (!isNaN(n)) onChange(parseFloat(clamp(n).toFixed(decimals)))
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter')  { commit(); return }
    if (e.key === 'Escape') { setEditing(false); return }
    const cur = parseFloat(draft)
    if (isNaN(cur)) return
    if (e.key === 'ArrowUp')   { e.preventDefault(); setDraft(fmt(clamp(cur + step))) }
    if (e.key === 'ArrowDown') { e.preventDefault(); setDraft(fmt(clamp(cur - step))) }
  }

  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'

  return (
    <div
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: 30,
        borderRadius: 7,
        border: \`1px solid \${dragging ? 'rgba(0,0,0,0.22)' : hovered ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.1)'}\`,
        background: dragging ? 'rgba(0,0,0,0.04)' : hovered ? 'rgba(0,0,0,0.02)' : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: editing ? 'text' : 'ns-resize',
        userSelect: 'none',
        transition: 'border-color 0.12s ease, background 0.12s ease',
        fontFamily: font,
        outline: editing ? '2px solid rgba(0,100,255,0.28)' : 'none',
        outlineOffset: '-1px',
      }}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          style={{
            width: '100%', height: '100%',
            border: 'none', outline: 'none',
            background: 'transparent',
            textAlign: 'center',
            fontSize: 12.5, fontWeight: 500, color: '#0a0a0a',
            fontFamily: 'inherit', cursor: 'text',
            padding: '0 4px', letterSpacing: '-0.01em',
          }}
        />
      ) : (
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 1,
          fontSize: 12.5, fontWeight: 500,
          color: '#0a0a0a', letterSpacing: '-0.01em',
          pointerEvents: 'none',
        }}>
          {fmt(value)}
          {suffix && <span style={{ color: 'rgba(0,0,0,0.38)', fontSize: 11, marginLeft: 1 }}>{suffix}</span>}
        </div>
      )}
    </div>
  )
}

// ── Usage ───────────────────────────────────────────────────────────────────

export default function App() {
  const [width,    setWidth]    = useState(160)
  const [height,   setHeight]   = useState(160)
  const [opacity,  setOpacity]  = useState(100)
  const [rotation, setRotation] = useState(0)
  const [radius,   setRadius]   = useState(20)

  return (
    <div style={{ display: 'flex', gap: 8, padding: 24, fontFamily: '-apple-system, sans-serif' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)' }}>W</label>
        <NumberInput value={width} onChange={setWidth} min={40} max={280} step={1} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)' }}>H</label>
        <NumberInput value={height} onChange={setHeight} min={40} max={280} step={1} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)' }}>Opacity</label>
        <NumberInput value={opacity} onChange={setOpacity} min={0} max={100} step={1} suffix="%" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)' }}>Rotate</label>
        <NumberInput value={rotation} onChange={setRotation} min={-360} max={360} step={1} suffix="°" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)' }}>Radius</label>
        <NumberInput value={radius} onChange={setRadius} min={0} max={140} step={1} suffix="px" />
      </div>
    </div>
  )
}`

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NumberInputPage() {
  return (
    <div style={{ background: '#fff' }}>
      {/* DEMO */}
      <Demo />

      {/* CODE */}
      <div style={{
        background: '#0a0a0a',
        padding: 'clamp(24px, 4vw, 48px)' as any,
        fontFamily: font,
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <div>
              <div style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#fff',
                letterSpacing: '-0.02em',
                marginBottom: 2,
              }}>
                Number Input
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                Drop into any React project — zero dependencies
              </div>
            </div>
            <CopyButton text={CODE_SOURCE} />
          </div>

          {/* Code block */}
          <div style={{
            background: '#111',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '10px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
            }}>
              <div style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 500,
                fontFamily: 'ui-monospace, monospace',
              }}>
                NumberInput.tsx
              </div>
            </div>
            <pre style={{
              margin: 0,
              padding: '20px',
              overflowX: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
              fontSize: 12.5,
              lineHeight: 1.65,
              color: '#e5e5e5',
              scrollbarWidth: 'thin' as any,
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
