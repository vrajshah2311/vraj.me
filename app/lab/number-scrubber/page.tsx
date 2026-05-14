'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// ─── NumberScrubber ───────────────────────────────────────────────────────────

interface ScrubberProps {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  decimals?: number
}

function NumberScrubber({
  label,
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  unit = '',
  decimals = 0,
}: ScrubberProps) {
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [scrubbing, setScrubbing] = useState(false)
  const [flash, setFlash] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clamp = (v: number) => Math.max(min, Math.min(max, v))
  const rnd = (v: number) => parseFloat(v.toFixed(decimals))
  const fmt = (v: number) => (decimals > 0 ? v.toFixed(decimals) : String(Math.round(v)))

  const triggerFlash = useCallback(() => {
    if (flashTimer.current) clearTimeout(flashTimer.current)
    setFlash(true)
    flashTimer.current = setTimeout(() => setFlash(false), 280)
  }, [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      if (editing) return
      e.preventDefault()
      const delta = e.deltaY < 0 ? step : -step
      const next = rnd(clamp(value + delta))
      if (next !== value) {
        onChange(next)
        triggerFlash()
      }
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [value, step, editing, min, max, decimals, onChange, triggerFlash]) // eslint-disable-line react-hooks/exhaustive-deps

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (editing) return
      e.preventDefault()
      const startX = e.clientX
      const startVal = value
      setScrubbing(true)
      const onMove = (ev: MouseEvent) => {
        const next = rnd(clamp(startVal + (ev.clientX - startX) * step))
        onChange(next)
        triggerFlash()
      }
      const onUp = () => {
        setScrubbing(false)
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
      }
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    },
    [editing, value, step, min, max, decimals, onChange, triggerFlash], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const onDblClick = useCallback(() => {
    setEditing(true)
    setInputVal(fmt(value))
    requestAnimationFrame(() => inputRef.current?.select())
  }, [value, decimals]) // eslint-disable-line react-hooks/exhaustive-deps

  const commit = useCallback(() => {
    const n = parseFloat(inputVal)
    if (!isNaN(n)) onChange(rnd(clamp(n)))
    setEditing(false)
  }, [inputVal, min, max, decimals, onChange]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => () => {
      if (flashTimer.current) clearTimeout(flashTimer.current)
    },
    [],
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: 'rgba(10,10,10,0.32)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          width: 18,
          flexShrink: 0,
          textAlign: 'center',
          userSelect: 'none',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {label}
      </span>
      <div
        ref={wrapRef}
        onMouseDown={onMouseDown}
        onDoubleClick={onDblClick}
        style={{
          flex: 1,
          height: 28,
          background: flash ? 'rgba(99,102,241,0.1)' : 'rgba(10,10,10,0.04)',
          border:
            '1px solid ' + (scrubbing ? 'rgba(10,10,10,0.16)' : 'rgba(10,10,10,0.08)'),
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          cursor: editing ? 'text' : 'ew-resize',
          overflow: 'hidden',
          transition: 'background 220ms ease, border-color 120ms ease',
          userSelect: 'none',
        }}
      >
        {editing ? (
          <input
            ref={inputRef}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                commit()
                return
              }
              if (e.key === 'Escape') {
                setEditing(false)
                return
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault()
                setInputVal(
                  fmt(rnd(clamp(parseFloat(inputVal || '0') + step))),
                )
              }
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setInputVal(
                  fmt(rnd(clamp(parseFloat(inputVal || '0') - step))),
                )
              }
            }}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: 'transparent',
              padding: '0 8px',
              fontSize: 12,
              fontWeight: 500,
              color: '#0a0a0a',
              letterSpacing: '-0.01em',
              outline: 'none',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
            }}
          />
        ) : (
          <span
            style={{
              padding: '0 8px',
              fontSize: 12,
              fontWeight: 500,
              color: '#0a0a0a',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'baseline',
              gap: 2,
              pointerEvents: 'none',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
            }}
          >
            {fmt(value)}
            {unit && (
              <span
                style={{
                  fontSize: 9,
                  color: 'rgba(10,10,10,0.3)',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}
              >
                {unit}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Demo A: Design Properties Panel ─────────────────────────────────────────

function DesignPanel() {
  const [vals, setVals] = useState({
    x: 72,
    y: 44,
    w: 156,
    h: 92,
    r: 0,
    o: 100,
  })
  const set =
    (k: keyof typeof vals) =>
    (v: number) =>
      setVals((p) => ({ ...p, [k]: v }))

  const PW = 296,
    PH = 160
  const VW = 300,
    VH = 160

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow:
          '0 2px 4px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.08)',
        width: 296,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Canvas preview */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: PH,
          background: 'rgba(10,10,10,0.02)',
          borderBottom: '1px solid rgba(10,10,10,0.07)',
          overflow: 'hidden',
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0 }}
          aria-hidden
        >
          <defs>
            <pattern
              id="dp-dots"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="0.5" cy="0.5" r="0.6" fill="rgba(10,10,10,0.11)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dp-dots)" />
        </svg>

        {/* Layer rect */}
        <div
          style={{
            position: 'absolute',
            left: (vals.x / VW) * PW,
            top: (vals.y / VH) * PH,
            width: (vals.w / VW) * PW,
            height: (vals.h / VH) * PH,
            background: 'rgba(99,102,241,0.15)',
            border: '1.5px solid rgba(99,102,241,0.6)',
            borderRadius: 3,
            opacity: vals.o / 100,
            transform: 'rotate(' + vals.r + 'deg)',
            transformOrigin: 'center',
            pointerEvents: 'none',
          }}
        >
          {(
            [
              { top: -3, left: -3 },
              { top: -3, right: -3 },
              { bottom: -3, left: -3 },
              { bottom: -3, right: -3 },
            ] as React.CSSProperties[]
          ).map((pos, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 5,
                height: 5,
                background: '#fff',
                border: '1.5px solid rgba(99,102,241,0.8)',
                borderRadius: 1,
                ...pos,
              }}
            />
          ))}
        </div>
      </div>

      {/* Properties */}
      <div
        style={{
          padding: '10px 14px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <p
          style={{
            margin: '0 0 5px',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.28)',
          }}
        >
          Position
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <NumberScrubber
            label="X"
            value={vals.x}
            onChange={set('x')}
            min={0}
            max={VW - vals.w}
          />
          <NumberScrubber
            label="Y"
            value={vals.y}
            onChange={set('y')}
            min={0}
            max={VH - vals.h}
          />
        </div>

        <p
          style={{
            margin: '9px 0 5px',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.28)',
          }}
        >
          Size
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <NumberScrubber
            label="W"
            value={vals.w}
            onChange={set('w')}
            min={8}
            max={VW}
          />
          <NumberScrubber
            label="H"
            value={vals.h}
            onChange={set('h')}
            min={8}
            max={VH}
          />
        </div>

        <p
          style={{
            margin: '9px 0 5px',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.28)',
          }}
        >
          Appearance
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <NumberScrubber
            label="R"
            value={vals.r}
            onChange={set('r')}
            min={-180}
            max={180}
            unit="°"
          />
          <NumberScrubber
            label="O"
            value={vals.o}
            onChange={set('o')}
            min={0}
            max={100}
            unit="%"
          />
        </div>
      </div>
    </div>
  )
}

// ─── Demo B: Typography Panel ─────────────────────────────────────────────────

function TypographyPanel() {
  const [size, setSize] = useState(18)
  const [lh, setLh] = useState(150)
  const [ls, setLs] = useState(0)

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow:
          '0 2px 4px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.08)',
        width: 296,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Text preview */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid rgba(10,10,10,0.07)',
          background: 'rgba(10,10,10,0.02)',
          minHeight: 100,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: size,
            lineHeight: lh / 100,
            letterSpacing: ls / 100 + 'em',
            fontWeight: 500,
            color: '#0a0a0a',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          }}
        >
          The quick brown fox jumps over the lazy dog.
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          padding: '10px 14px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <p
          style={{
            margin: '0 0 5px',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.28)',
          }}
        >
          Typography
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <NumberScrubber
            label="S"
            value={size}
            onChange={setSize}
            min={8}
            max={72}
            unit="px"
          />
          <NumberScrubber
            label="L"
            value={lh}
            onChange={setLh}
            min={80}
            max={250}
            unit="%"
          />
          <NumberScrubber
            label="K"
            value={ls}
            onChange={setLs}
            min={-10}
            max={40}
            unit="%"
            step={0.5}
            decimals={1}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface ScrubberProps {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  decimals?: number
}

export function NumberScrubber({
  label,
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  unit = '',
  decimals = 0,
}: ScrubberProps) {
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [scrubbing, setScrubbing] = useState(false)
  const [flash, setFlash] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clamp = (v: number) => Math.max(min, Math.min(max, v))
  const rnd = (v: number) => parseFloat(v.toFixed(decimals))
  const fmt = (v: number) => (decimals > 0 ? v.toFixed(decimals) : String(Math.round(v)))

  const triggerFlash = useCallback(() => {
    if (flashTimer.current) clearTimeout(flashTimer.current)
    setFlash(true)
    flashTimer.current = setTimeout(() => setFlash(false), 280)
  }, [])

  // Scroll wheel to change value
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      if (editing) return
      e.preventDefault()
      const delta = e.deltaY < 0 ? step : -step
      const next = rnd(clamp(value + delta))
      if (next !== value) { onChange(next); triggerFlash() }
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [value, step, editing, min, max, decimals, onChange, triggerFlash])

  // Click + drag horizontally to scrub
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (editing) return
    e.preventDefault()
    const startX = e.clientX
    const startVal = value
    setScrubbing(true)
    const onMove = (ev: MouseEvent) => {
      const next = rnd(clamp(startVal + (ev.clientX - startX) * step))
      onChange(next)
      triggerFlash()
    }
    const onUp = () => {
      setScrubbing(false)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [editing, value, step, min, max, decimals, onChange, triggerFlash])

  // Double-click to type directly
  const onDblClick = useCallback(() => {
    setEditing(true)
    setInputVal(fmt(value))
    requestAnimationFrame(() => inputRef.current?.select())
  }, [value, decimals])

  const commit = useCallback(() => {
    const n = parseFloat(inputVal)
    if (!isNaN(n)) onChange(rnd(clamp(n)))
    setEditing(false)
  }, [inputVal, min, max, decimals, onChange])

  useEffect(() => () => { if (flashTimer.current) clearTimeout(flashTimer.current) }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
      <span style={{
        fontSize: 10, fontWeight: 700, color: 'rgba(10,10,10,0.32)',
        letterSpacing: '0.05em', textTransform: 'uppercase',
        width: 18, flexShrink: 0, textAlign: 'center', userSelect: 'none',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}>
        {label}
      </span>
      <div
        ref={wrapRef}
        onMouseDown={onMouseDown}
        onDoubleClick={onDblClick}
        style={{
          flex: 1, height: 28,
          background: flash ? 'rgba(99,102,241,0.1)' : 'rgba(10,10,10,0.04)',
          border: '1px solid ' + (scrubbing ? 'rgba(10,10,10,0.16)' : 'rgba(10,10,10,0.08)'),
          borderRadius: 6,
          display: 'flex', alignItems: 'center',
          cursor: editing ? 'text' : 'ew-resize',
          overflow: 'hidden',
          transition: 'background 220ms ease, border-color 120ms ease',
          userSelect: 'none',
        }}
      >
        {editing ? (
          <input
            ref={inputRef}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onBlur={commit}
            onKeyDown={e => {
              if (e.key === 'Enter')  { commit(); return }
              if (e.key === 'Escape') { setEditing(false); return }
              if (e.key === 'ArrowUp')   { e.preventDefault(); setInputVal(fmt(rnd(clamp(parseFloat(inputVal || '0') + step)))) }
              if (e.key === 'ArrowDown') { e.preventDefault(); setInputVal(fmt(rnd(clamp(parseFloat(inputVal || '0') - step)))) }
            }}
            style={{
              width: '100%', height: '100%', border: 'none', background: 'transparent',
              padding: '0 8px', fontSize: 12, fontWeight: 500, color: '#0a0a0a',
              letterSpacing: '-0.01em', outline: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
            }}
          />
        ) : (
          <span style={{
            padding: '0 8px', fontSize: 12, fontWeight: 500, color: '#0a0a0a',
            letterSpacing: '-0.02em', display: 'flex', alignItems: 'baseline', gap: 2,
            pointerEvents: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          }}>
            {fmt(value)}
            {unit && (
              <span style={{ fontSize: 9, color: 'rgba(10,10,10,0.3)', fontWeight: 600, letterSpacing: '0.02em' }}>
                {unit}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  )
}

// Usage:
// <NumberScrubber label="X"  value={x}  onChange={setX}  min={0}  max={400} />
// <NumberScrubber label="O"  value={op} onChange={setOp} min={0}  max={100} unit="%" />
// <NumberScrubber label="LS" value={ls} onChange={setLs} min={-10} max={40} unit="%" step={0.5} decimals={1} />`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NumberScrubberPage() {
  return (
    <main
      style={{
        backgroundColor: 'var(--bg, #ffffff)',
        minHeight: '100vh',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* ── Demo ── */}
      <section
        style={{
          minHeight: '65vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
          padding: '60px 24px',
          gap: '32px',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.3)',
          }}
        >
          Number Scrubber
        </p>

        <div
          style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <DesignPanel />
          <TypographyPanel />
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: 'rgba(10,10,10,0.3)',
            letterSpacing: '-0.01em',
            textAlign: 'center',
          }}
        >
          Scroll or drag to adjust &middot; Double-click to type
        </p>
      </section>

      {/* ── Code block ── */}
      <section
        style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}
      >
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
        <div
          style={{
            background: '#0a0a0a',
            borderRadius: 12,
            padding: 20,
            overflowX: 'auto',
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily:
                'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
              fontSize: 12,
              lineHeight: 1.65,
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
