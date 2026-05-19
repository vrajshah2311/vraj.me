'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// ─── Color helpers ─────────────────────────────────────────────────────────────

function hsbToRgb(h: number, s: number, b: number): [number, number, number] {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return b - b * s * Math.max(0, Math.min(k, 4 - k, 1))
  }
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null
}

function rgbToHsb(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return [h * 360, max === 0 ? 0 : d / max, max]
}

function contrastColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#ffffff'
  const lum = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255
  return lum > 0.55 ? '#0a0a0a' : '#ffffff'
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const PRESETS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#0a0a0a', '#6b7280',
]

// ─── ColorPicker ──────────────────────────────────────────────────────────────

function ColorPicker({
  defaultColor = '#3b82f6',
  onChange,
}: {
  defaultColor?: string
  onChange?: (hex: string) => void
}) {
  const initial = hexToRgb(defaultColor) ?? [59, 130, 246]
  const [hsb, setHsb] = useState<[number, number, number]>(() =>
    rgbToHsb(initial[0], initial[1], initial[2])
  )
  const [hexInput, setHexInput] = useState(defaultColor)
  const [copied, setCopied] = useState(false)

  const sbRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef<'sb' | 'hue' | null>(null)
  const onChangeRef = useRef(onChange)
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  const [h, s, b] = hsb
  const [cr, cg, cb] = hsbToRgb(h, s, b)
  const hex = rgbToHex(cr, cg, cb)
  const [pr, pg, pb] = hsbToRgb(h, 1, 1)
  const pureHue = rgbToHex(pr, pg, pb)

  useEffect(() => {
    setHexInput(hex)
    onChangeRef.current?.(hex)
  }, [hex])

  const moveSb = useCallback((e: PointerEvent | React.PointerEvent) => {
    const el = sbRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const ns = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const nb = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height))
    setHsb(prev => [prev[0], ns, nb])
  }, [])

  const moveHue = useCallback((e: PointerEvent | React.PointerEvent) => {
    const el = hueRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const nh = Math.max(0, Math.min(360, ((e.clientX - rect.left) / rect.width) * 360))
    setHsb(prev => [nh, prev[1], prev[2]])
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (draggingRef.current === 'sb') moveSb(e)
      else if (draggingRef.current === 'hue') moveHue(e)
    }
    const onUp = () => { draggingRef.current = null }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [moveSb, moveHue])

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.07)',
      width: '248px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      userSelect: 'none',
    }}>

      {/* Saturation / Brightness square */}
      <div
        ref={sbRef}
        onPointerDown={e => {
          draggingRef.current = 'sb'
          e.currentTarget.setPointerCapture(e.pointerId)
          moveSb(e)
        }}
        style={{
          width: '100%',
          height: '188px',
          borderRadius: '10px',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'crosshair',
          background: pureHue,
          marginBottom: '12px',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #fff, transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #000)' }} />
        {/* Cursor */}
        <div style={{
          position: 'absolute',
          left: s * 100 + '%',
          top: (1 - b) * 100 + '%',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          border: '2.5px solid #fff',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.35)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          background: hex,
          transition: 'background 0ms',
        }} />
      </div>

      {/* Hue rail */}
      <div
        ref={hueRef}
        onPointerDown={e => {
          draggingRef.current = 'hue'
          e.currentTarget.setPointerCapture(e.pointerId)
          moveHue(e)
        }}
        style={{
          width: '100%',
          height: '12px',
          borderRadius: '6px',
          position: 'relative',
          cursor: 'pointer',
          background: 'linear-gradient(to right,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)',
          marginBottom: '14px',
        }}
      >
        <div style={{
          position: 'absolute',
          left: (h / 360) * 100 + '%',
          top: '50%',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          border: '2.5px solid #fff',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.18), 0 2px 5px rgba(0,0,0,0.22)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          background: pureHue,
        }} />
      </div>

      {/* Hex input row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '7px',
          background: hex, border: '1px solid rgba(0,0,0,0.1)',
          flexShrink: 0, transition: 'background 0ms',
        }} />
        <input
          value={hexInput}
          onChange={e => {
            setHexInput(e.target.value)
            if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
              const rgb = hexToRgb(e.target.value)
              if (rgb) setHsb(rgbToHsb(rgb[0], rgb[1], rgb[2]))
            }
          }}
          onBlur={() => setHexInput(hex)}
          spellCheck={false}
          style={{
            flex: 1, minWidth: 0, height: '28px',
            border: '1px solid rgba(10,10,10,0.1)', borderRadius: '7px',
            padding: '0 8px', fontSize: '12px', fontWeight: 500,
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", monospace',
            color: '#0a0a0a', outline: 'none', letterSpacing: '0.02em',
            background: '#fff',
          }}
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(hex).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            })
          }}
          style={{
            height: '28px', padding: '0 10px',
            border: '1px solid rgba(10,10,10,0.1)', borderRadius: '7px',
            background: copied ? '#0a0a0a' : '#fff',
            color: copied ? '#fff' : 'rgba(10,10,10,0.55)',
            fontSize: '11px', fontWeight: 600, cursor: 'pointer',
            transition: 'background 150ms ease, color 150ms ease',
            letterSpacing: '0.01em', flexShrink: 0, fontFamily: 'inherit',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Preset swatches */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {PRESETS.map(p => (
          <button
            key={p}
            onClick={() => {
              const rgb = hexToRgb(p)
              if (rgb) setHsb(rgbToHsb(rgb[0], rgb[1], rgb[2]))
            }}
            title={p}
            style={{
              width: '20px', height: '20px', borderRadius: '5px',
              background: p,
              border: hex === p ? '2px solid rgba(10,10,10,0.45)' : '1px solid rgba(0,0,0,0.08)',
              cursor: 'pointer', padding: 0,
              transition: 'transform 120ms ease, box-shadow 120ms ease',
              outline: 'none',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.2)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.22)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Preview Panel ─────────────────────────────────────────────────────────────

function PreviewPanel({ color }: { color: string }) {
  const fg = contrastColor(color)
  const [progress, setProgress] = useState(65)
  const rgb = hexToRgb(color) ?? [59, 130, 246]

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.07)',
      width: '248px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>
      <p style={{
        margin: '0 0 16px', fontSize: '11px', fontWeight: 600,
        color: 'rgba(10,10,10,0.32)', letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        Live Preview
      </p>

      {/* Filled button */}
      <button style={{
        width: '100%', height: '36px',
        background: color, color: fg,
        border: 'none', borderRadius: '9px',
        fontSize: '13px', fontWeight: 600, cursor: 'pointer',
        letterSpacing: '-0.01em', marginBottom: '8px',
        fontFamily: 'inherit', transition: 'opacity 120ms ease',
      }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Primary Button
      </button>

      {/* Outline button */}
      <button style={{
        width: '100%', height: '36px',
        background: 'transparent', color: color,
        border: '1.5px solid ' + color,
        borderRadius: '9px', fontSize: '13px', fontWeight: 600,
        cursor: 'pointer', letterSpacing: '-0.01em', marginBottom: '16px',
        fontFamily: 'inherit', transition: 'background 120ms ease',
      }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.06)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        Outline Button
      </button>

      {/* Badges */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center',
          height: '22px', padding: '0 9px', borderRadius: '99px',
          background: color, color: fg,
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.01em',
        }}>Badge</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center',
          height: '22px', padding: '0 9px', borderRadius: '99px',
          background: 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.1)',
          color: color,
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.01em',
          border: '1px solid rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.2)',
        }}>Subtle</span>
      </div>

      {/* Progress bar — click to scrub */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em' }}>Progress</span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: color, letterSpacing: '-0.01em', transition: 'color 0ms' }}>{progress}%</span>
        </div>
        <div
          style={{ width: '100%', height: '6px', background: 'rgba(10,10,10,0.06)', borderRadius: '3px', cursor: 'pointer' }}
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            setProgress(Math.round(((e.clientX - rect.left) / rect.width) * 100))
          }}
        >
          <div style={{
            width: progress + '%', height: '100%',
            background: color, borderRadius: '3px', transition: 'width 120ms ease, background 0ms',
          }} />
        </div>
      </div>

      {/* Avatar row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, color: fg, fontWeight: 700, fontSize: '13px',
          letterSpacing: '0.02em', transition: 'background 0ms',
        }}>
          VS
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>Vraj Shah</p>
          <p style={{ margin: 0, fontSize: '11px', color: 'rgba(10,10,10,0.4)', fontWeight: 500, letterSpacing: '-0.005em' }}>Product Designer</p>
        </div>
      </div>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function Demo() {
  const [color, setColor] = useState('#3b82f6')

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}>
      <ColorPicker defaultColor="#3b82f6" onChange={setColor} />
      <PreviewPanel color={color} />
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// ─── Color helpers ──────────────────────────────────────────────────────────

function hsbToRgb(h: number, s: number, b: number): [number, number, number] {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return b - b * s * Math.max(0, Math.min(k, 4 - k, 1))
  }
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex)
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null
}

function rgbToHsb(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return [h * 360, max === 0 ? 0 : d / max, max]
}

// ─── Presets ────────────────────────────────────────────────────────────────

const PRESETS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#0a0a0a', '#6b7280',
]

// ─── ColorPicker ────────────────────────────────────────────────────────────

export function ColorPicker({
  defaultColor = '#3b82f6',
  onChange,
}: {
  defaultColor?: string
  onChange?: (hex: string) => void
}) {
  const initial = hexToRgb(defaultColor) ?? [59, 130, 246]
  const [hsb, setHsb] = useState<[number, number, number]>(() =>
    rgbToHsb(initial[0], initial[1], initial[2])
  )
  const [hexInput, setHexInput] = useState(defaultColor)
  const [copied, setCopied] = useState(false)

  const sbRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef<'sb' | 'hue' | null>(null)
  const onChangeRef = useRef(onChange)
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  const [h, s, b] = hsb
  const [cr, cg, cb] = hsbToRgb(h, s, b)
  const hex = rgbToHex(cr, cg, cb)
  const [pr, pg, pb] = hsbToRgb(h, 1, 1)
  const pureHue = rgbToHex(pr, pg, pb)

  useEffect(() => {
    setHexInput(hex)
    onChangeRef.current?.(hex)
  }, [hex])

  const moveSb = useCallback((e: PointerEvent | React.PointerEvent) => {
    const el = sbRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const ns = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const nb = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height))
    setHsb(prev => [prev[0], ns, nb])
  }, [])

  const moveHue = useCallback((e: PointerEvent | React.PointerEvent) => {
    const el = hueRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const nh = Math.max(0, Math.min(360, ((e.clientX - rect.left) / rect.width) * 360))
    setHsb(prev => [nh, prev[1], prev[2]])
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (draggingRef.current === 'sb') moveSb(e)
      else if (draggingRef.current === 'hue') moveHue(e)
    }
    const onUp = () => { draggingRef.current = null }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [moveSb, moveHue])

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.07)',
      width: '248px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      userSelect: 'none',
    }}>

      {/* Saturation / Brightness square */}
      <div
        ref={sbRef}
        onPointerDown={e => {
          draggingRef.current = 'sb'
          e.currentTarget.setPointerCapture(e.pointerId)
          moveSb(e)
        }}
        style={{
          width: '100%', height: '188px', borderRadius: '10px',
          position: 'relative', overflow: 'hidden', cursor: 'crosshair',
          background: pureHue, marginBottom: '12px',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #fff, transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #000)' }} />
        <div style={{
          position: 'absolute',
          left: s * 100 + '%',
          top: (1 - b) * 100 + '%',
          width: '14px', height: '14px', borderRadius: '50%',
          border: '2.5px solid #fff',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.35)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none', background: hex,
        }} />
      </div>

      {/* Hue rail */}
      <div
        ref={hueRef}
        onPointerDown={e => {
          draggingRef.current = 'hue'
          e.currentTarget.setPointerCapture(e.pointerId)
          moveHue(e)
        }}
        style={{
          width: '100%', height: '12px', borderRadius: '6px',
          position: 'relative', cursor: 'pointer',
          background: 'linear-gradient(to right,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)',
          marginBottom: '14px',
        }}
      >
        <div style={{
          position: 'absolute',
          left: (h / 360) * 100 + '%',
          top: '50%',
          width: '18px', height: '18px', borderRadius: '50%',
          border: '2.5px solid #fff',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.18), 0 2px 5px rgba(0,0,0,0.22)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none', background: pureHue,
        }} />
      </div>

      {/* Hex input + copy */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '7px',
          background: hex, border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0,
        }} />
        <input
          value={hexInput}
          onChange={e => {
            setHexInput(e.target.value)
            if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
              const rgb = hexToRgb(e.target.value)
              if (rgb) setHsb(rgbToHsb(rgb[0], rgb[1], rgb[2]))
            }
          }}
          onBlur={() => setHexInput(hex)}
          spellCheck={false}
          style={{
            flex: 1, minWidth: 0, height: '28px',
            border: '1px solid rgba(10,10,10,0.1)', borderRadius: '7px',
            padding: '0 8px', fontSize: '12px', fontWeight: 500,
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", monospace',
            color: '#0a0a0a', outline: 'none', letterSpacing: '0.02em', background: '#fff',
          }}
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(hex).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            })
          }}
          style={{
            height: '28px', padding: '0 10px',
            border: '1px solid rgba(10,10,10,0.1)', borderRadius: '7px',
            background: copied ? '#0a0a0a' : '#fff',
            color: copied ? '#fff' : 'rgba(10,10,10,0.55)',
            fontSize: '11px', fontWeight: 600, cursor: 'pointer',
            transition: 'background 150ms ease, color 150ms ease',
            letterSpacing: '0.01em', flexShrink: 0, fontFamily: 'inherit',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Preset swatches */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {PRESETS.map(p => (
          <button
            key={p}
            onClick={() => {
              const rgb = hexToRgb(p)
              if (rgb) setHsb(rgbToHsb(rgb[0], rgb[1], rgb[2]))
            }}
            title={p}
            style={{
              width: '20px', height: '20px', borderRadius: '5px',
              background: p,
              border: hex === p ? '2px solid rgba(10,10,10,0.45)' : '1px solid rgba(0,0,0,0.08)',
              cursor: 'pointer', padding: 0, outline: 'none',
              transition: 'transform 120ms ease, box-shadow 120ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.2)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.22)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Usage:
// <ColorPicker defaultColor="#3b82f6" onChange={(hex) => console.log(hex)} />`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ColorPickerPage() {
  return (
    <main style={{
      backgroundColor: 'var(--bg, #ffffff)',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: '16px',
      }}>
        <p style={{
          margin: '0 0 8px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.3)',
        }}>
          Color Picker
        </p>
        <Demo />
        <p style={{
          margin: 0,
          fontSize: '12px',
          color: 'rgba(10,10,10,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
        }}>
          Drag the gradient · scrub the hue rail · type a hex value · click presets
        </p>
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
