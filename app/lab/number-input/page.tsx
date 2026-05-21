'use client'

import { useState, useRef, useEffect } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'
const MONO = 'ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NumberInputProps {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  label?: string
}

// ─── NumberInput ──────────────────────────────────────────────────────────────

function NumberInput({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  unit = '',
  label,
}: NumberInputProps) {
  const [editing, setEditing]   = useState(false)
  const [draft, setDraft]       = useState('')
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered]   = useState(false)

  const inputRef     = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragX0       = useRef(0)
  const dragV0       = useRef(0)
  const moved        = useRef(false)

  // Refs that stay current across the wheel/drag closures
  const stepRef      = useRef(step)
  const minRef       = useRef(min)
  const maxRef       = useRef(max)
  const curValueRef  = useRef(value)
  const editingRef   = useRef(editing)
  const onChangeRef  = useRef(onChange)

  useEffect(() => { stepRef.current     = step    })
  useEffect(() => { minRef.current      = min     })
  useEffect(() => { maxRef.current      = max     })
  useEffect(() => { curValueRef.current = value   }, [value])
  useEffect(() => { editingRef.current  = editing }, [editing])
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  const decimals = step < 1 ? (String(step).split('.')[1]?.length ?? 2) : 0
  const fmt   = (n: number) => n.toFixed(decimals)
  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  const snap  = (n: number) => +parseFloat(fmt(Math.round(n / step) * step))

  // Keep display in sync when value changes externally
  useEffect(() => {
    if (!editing) setDraft(fmt(value))
  }, [value, editing]) // eslint-disable-line react-hooks/exhaustive-deps

  // Non-passive wheel listener so preventDefault works
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handle = (e: WheelEvent) => {
      if (editingRef.current) return
      e.preventDefault()
      const s  = stepRef.current
      const d  = s < 1 ? (String(s).split('.')[1]?.length ?? 2) : 0
      const f  = (n: number) => n.toFixed(d)
      const sn = (n: number) => +parseFloat(f(Math.round(n / s) * s))
      const cl = (n: number) => Math.min(maxRef.current, Math.max(minRef.current, n))
      onChangeRef.current(sn(cl(curValueRef.current + (e.deltaY < 0 ? 1 : -1) * s)))
    }
    el.addEventListener('wheel', handle, { passive: false })
    return () => el.removeEventListener('wheel', handle)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (editing) return
    e.preventDefault()
    dragX0.current = e.clientX
    dragV0.current = value
    moved.current  = false
    setDragging(true)

    const onMove = (evt: MouseEvent) => {
      const dx = evt.clientX - dragX0.current
      if (Math.abs(dx) >= 2) moved.current = true
      onChange(snap(clamp(dragV0.current + dx * step)))
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      setDragging(false)
      if (!moved.current) {
        setEditing(true)
        setDraft(fmt(curValueRef.current))
        requestAnimationFrame(() => inputRef.current?.select())
      }
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  const commit = () => {
    const n = parseFloat(draft)
    if (!isNaN(n)) onChange(snap(clamp(n)))
    else setDraft(fmt(value))
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Escape') { commit(); return }
    if (e.key === 'ArrowUp')   { e.preventDefault(); onChange(snap(clamp(value + step))) }
    if (e.key === 'ArrowDown') { e.preventDefault(); onChange(snap(clamp(value - step))) }
  }

  const active      = dragging || editing
  const showChevron = !editing
  const chevronOpacity = showChevron ? (hovered || dragging ? 0.5 : 0.2) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <span style={{
          fontSize: 11, fontWeight: 500,
          color: 'rgba(10,10,10,0.4)', letterSpacing: '0.02em',
          fontFamily: FONT, userSelect: 'none',
        }}>
          {label}
        </span>
      )}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: hovered && !editing ? 'rgba(10,10,10,0.025)' : '#fff',
          border: '1px solid ' + (active ? 'rgba(10,10,10,0.2)' : hovered ? 'rgba(10,10,10,0.14)' : 'rgba(10,10,10,0.1)'),
          borderRadius: 8,
          height: 32,
          padding: '0 22px',
          cursor: editing ? 'text' : 'ew-resize',
          transition: 'border-color 150ms ease, box-shadow 150ms ease, background 150ms ease',
          boxShadow: active ? '0 0 0 3px rgba(10,10,10,0.06)' : 'none',
          userSelect: 'none',
          minWidth: 80,
        }}
      >
        {/* Left chevron */}
        <svg
          style={{ position: 'absolute', left: 8, opacity: chevronOpacity, pointerEvents: 'none', transition: 'opacity 150ms', flexShrink: 0 }}
          width="5" height="9" viewBox="0 0 5 9" fill="none"
        >
          <path d="M4 1L1 4.5L4 8" stroke="#0a0a0a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
            style={{
              width: '100%', background: 'none', border: 'none', outline: 'none',
              fontSize: 13, fontWeight: 500, color: '#0a0a0a',
              fontFamily: FONT, letterSpacing: '-0.01em', textAlign: 'center', padding: 0,
            }}
          />
        ) : (
          <span style={{
            flex: 1, fontSize: 13, fontWeight: 500, color: '#0a0a0a',
            fontFamily: FONT, letterSpacing: '-0.01em', textAlign: 'center',
            pointerEvents: 'none',
          }}>
            {fmt(value)}
            {unit && <span style={{ color: 'rgba(10,10,10,0.35)', fontSize: 11, marginLeft: 1 }}>{unit}</span>}
          </span>
        )}

        {/* Right chevron */}
        <svg
          style={{ position: 'absolute', right: 8, opacity: chevronOpacity, pointerEvents: 'none', transition: 'opacity 150ms', flexShrink: 0 }}
          width="5" height="9" viewBox="0 0 5 9" fill="none"
        >
          <path d="M1 1L4 4.5L1 8" stroke="#0a0a0a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

// ─── Inspector section ────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontSize: 10, fontWeight: 600, letterSpacing: '0.07em',
        textTransform: 'uppercase' as const, color: 'rgba(10,10,10,0.28)',
        marginBottom: 8, fontFamily: FONT,
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function Demo() {
  const [width,    setWidth]   = useState(180)
  const [height,   setHeight]  = useState(100)
  const [radius,   setRadius]  = useState(16)
  const [rotation, setRot]     = useState(0)
  const [opacity,  setOpacity] = useState(100)
  const [fontSize, setFS]      = useState(15)
  const [lineH,    setLineH]   = useState(1.5)
  const [tracking, setTrack]   = useState(0)

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' as const, justifyContent: 'center' }}>

      {/* Inspector panel */}
      <div style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: 16,
        padding: 20,
        width: 236,
        flexShrink: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase' as const, color: 'rgba(10,10,10,0.35)',
          marginBottom: 20, fontFamily: FONT,
        }}>
          Inspector
        </div>

        <Section title="Frame">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <NumberInput value={width}  onChange={setWidth}  min={40} max={360} step={1}   unit="px" label="W" />
            <NumberInput value={height} onChange={setHeight} min={40} max={240} step={1}   unit="px" label="H" />
          </div>
        </Section>

        <Section title="Transform">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <NumberInput value={rotation} onChange={setRot}    min={-180} max={180} step={1} unit="°"  label="Rotation" />
            <NumberInput value={radius}   onChange={setRadius} min={0}   max={120}  step={1} unit="px" label="Radius" />
          </div>
        </Section>

        <Section title="Appearance">
          <NumberInput value={opacity} onChange={setOpacity} min={0} max={100} step={1} unit="%" label="Opacity" />
        </Section>

        <Section title="Typography">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <NumberInput value={fontSize} onChange={setFS}     min={6}   max={72}  step={1}    unit="px" label="Size" />
            <NumberInput value={lineH}    onChange={setLineH}  min={0.8} max={3.0} step={0.1}        label="Line H" />
          </div>
          <NumberInput value={tracking} onChange={setTrack} min={-0.1} max={0.5} step={0.01} label="Tracking" />
        </Section>
      </div>

      {/* Preview */}
      <div style={{
        flex: 1,
        minWidth: 260,
        minHeight: 260,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
      }}>
        <div style={{
          width: Math.min(width, 340),
          height: Math.min(height, 220),
          borderRadius: radius,
          opacity: opacity / 100,
          transform: 'rotate(' + rotation + 'deg)',
          background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'width 80ms ease, height 80ms ease, border-radius 80ms ease, opacity 80ms ease',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <span style={{
            color: '#fff',
            fontFamily: FONT,
            fontSize,
            lineHeight: lineH,
            letterSpacing: tracking + 'em',
            fontWeight: 600,
            userSelect: 'none' as const,
            padding: '0 16px',
            textAlign: 'center' as const,
            transition: 'font-size 80ms ease',
          }}>
            Preview
          </span>
        </div>

        <p style={{
          margin: 0,
          fontSize: 11,
          fontWeight: 500,
          color: 'rgba(10,10,10,0.35)',
          fontFamily: FONT,
          letterSpacing: '0.01em',
          textAlign: 'center' as const,
        }}>
          Drag ←→ or scroll to adjust · Click to type
        </p>
      </div>

    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

interface NumberInputProps {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  label?: string
}

export function NumberInput({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  unit = '',
  label,
}: NumberInputProps) {
  const [editing, setEditing]   = useState(false)
  const [draft, setDraft]       = useState('')
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered]   = useState(false)

  const inputRef     = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragX0       = useRef(0)
  const dragV0       = useRef(0)
  const moved        = useRef(false)

  // Refs stay current inside the wheel/drag closures
  const stepRef     = useRef(step)
  const minRef      = useRef(min)
  const maxRef      = useRef(max)
  const curValueRef = useRef(value)
  const editingRef  = useRef(editing)
  const onChangeRef = useRef(onChange)

  useEffect(() => { stepRef.current     = step    })
  useEffect(() => { minRef.current      = min     })
  useEffect(() => { maxRef.current      = max     })
  useEffect(() => { curValueRef.current = value   }, [value])
  useEffect(() => { editingRef.current  = editing }, [editing])
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  const decimals = step < 1 ? (String(step).split('.')[1]?.length ?? 2) : 0
  const fmt   = (n: number) => n.toFixed(decimals)
  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  const snap  = (n: number) => +parseFloat(fmt(Math.round(n / step) * step))

  useEffect(() => {
    if (!editing) setDraft(fmt(value))
  }, [value, editing]) // eslint-disable-line react-hooks/exhaustive-deps

  // Register as non-passive so preventDefault prevents page scroll
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handle = (e: WheelEvent) => {
      if (editingRef.current) return
      e.preventDefault()
      const s  = stepRef.current
      const d  = s < 1 ? (String(s).split('.')[1]?.length ?? 2) : 0
      const f  = (n: number) => n.toFixed(d)
      const sn = (n: number) => +parseFloat(f(Math.round(n / s) * s))
      const cl = (n: number) => Math.min(maxRef.current, Math.max(minRef.current, n))
      onChangeRef.current(sn(cl(curValueRef.current + (e.deltaY < 0 ? 1 : -1) * s)))
    }
    el.addEventListener('wheel', handle, { passive: false })
    return () => el.removeEventListener('wheel', handle)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (editing) return
    e.preventDefault()
    dragX0.current = e.clientX
    dragV0.current = value
    moved.current  = false
    setDragging(true)

    const onMove = (evt: MouseEvent) => {
      const dx = evt.clientX - dragX0.current
      if (Math.abs(dx) >= 2) moved.current = true
      onChange(snap(clamp(dragV0.current + dx * step)))
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      setDragging(false)
      if (!moved.current) {
        setEditing(true)
        setDraft(fmt(curValueRef.current))
        requestAnimationFrame(() => inputRef.current?.select())
      }
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  const commit = () => {
    const n = parseFloat(draft)
    if (!isNaN(n)) onChange(snap(clamp(n)))
    else setDraft(fmt(value))
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Escape') { commit(); return }
    if (e.key === 'ArrowUp')   { e.preventDefault(); onChange(snap(clamp(value + step))) }
    if (e.key === 'ArrowDown') { e.preventDefault(); onChange(snap(clamp(value - step))) }
  }

  const active        = dragging || editing
  const chevronOp     = !editing ? (hovered || dragging ? 0.5 : 0.2) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <span style={{
          fontSize: 11, fontWeight: 500,
          color: 'rgba(10,10,10,0.4)', letterSpacing: '0.02em',
          fontFamily: FONT, userSelect: 'none',
        }}>
          {label}
        </span>
      )}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: hovered && !editing ? 'rgba(10,10,10,0.025)' : '#fff',
          border: '1px solid ' + (active ? 'rgba(10,10,10,0.2)' : hovered ? 'rgba(10,10,10,0.14)' : 'rgba(10,10,10,0.1)'),
          borderRadius: 8,
          height: 32,
          padding: '0 22px',
          cursor: editing ? 'text' : 'ew-resize',
          transition: 'border-color 150ms ease, box-shadow 150ms ease, background 150ms ease',
          boxShadow: active ? '0 0 0 3px rgba(10,10,10,0.06)' : 'none',
          userSelect: 'none',
          minWidth: 80,
        }}
      >
        <svg
          style={{ position: 'absolute', left: 8, opacity: chevronOp, pointerEvents: 'none', transition: 'opacity 150ms' }}
          width="5" height="9" viewBox="0 0 5 9" fill="none"
        >
          <path d="M4 1L1 4.5L4 8" stroke="#0a0a0a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
            style={{
              width: '100%', background: 'none', border: 'none', outline: 'none',
              fontSize: 13, fontWeight: 500, color: '#0a0a0a',
              fontFamily: FONT, letterSpacing: '-0.01em', textAlign: 'center', padding: 0,
            }}
          />
        ) : (
          <span style={{
            flex: 1, fontSize: 13, fontWeight: 500, color: '#0a0a0a',
            fontFamily: FONT, letterSpacing: '-0.01em', textAlign: 'center', pointerEvents: 'none',
          }}>
            {fmt(value)}
            {unit && <span style={{ color: 'rgba(10,10,10,0.35)', fontSize: 11, marginLeft: 1 }}>{unit}</span>}
          </span>
        )}

        <svg
          style={{ position: 'absolute', right: 8, opacity: chevronOp, pointerEvents: 'none', transition: 'opacity 150ms' }}
          width="5" height="9" viewBox="0 0 5 9" fill="none"
        >
          <path d="M1 1L4 4.5L1 8" stroke="#0a0a0a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NumberInputPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>

      {/* Demo */}
      <section style={{
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
      }}>
        <Demo />
      </section>

      {/* Code */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase' as const, color: 'rgba(10,10,10,0.4)',
          marginBottom: '12px', fontFamily: FONT,
        }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
          <pre style={{
            margin: 0,
            fontFamily: MONO,
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
