'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
  }
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)]
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = ((h * 60) + 360) % 360
  }
  return [h, max === 0 ? 0 : d / max, max]
}

function toHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

function parseHex(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  const n = parseInt(clean, 16)
  if (isNaN(n)) return null
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

// ─── ColorPicker ──────────────────────────────────────────────────────────────

const PRESETS = [
  '#0a0a0a', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6',
  '#ec4899', '#ffffff',
]

function ColorPicker() {
  const [hsv, setHsv] = useState<[number, number, number]>([217, 0.82, 0.95])
  const [hexInput, setHexInput] = useState('')
  const [hexError, setHexError] = useState(false)
  const [copied, setCopied] = useState(false)

  const svRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const svDragging = useRef(false)
  const hueDragging = useRef(false)

  const [h, s, v] = hsv
  const [r, g, b] = hsvToRgb(h, s, v)
  const hex = toHex(r, g, b)
  const hueColor = toHex(...hsvToRgb(h, 1, 1))

  // Sync hex input when hsv changes (but only if not currently editing)
  const editingHex = useRef(false)
  useEffect(() => {
    if (!editingHex.current) setHexInput(hex.slice(1).toUpperCase())
  }, [hex])

  // ── SV canvas interaction ──
  const handleSvMove = useCallback((e: MouseEvent | Touch) => {
    if (!svRef.current) return
    const rect = svRef.current.getBoundingClientRect()
    const sx = clamp((('clientX' in e ? e.clientX : e.clientX) - rect.left) / rect.width, 0, 1)
    const sy = clamp((('clientY' in e ? e.clientY : e.clientY) - rect.top) / rect.height, 0, 1)
    setHsv(([hh]) => [hh, sx, 1 - sy])
  }, [])

  const handleSvDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    svDragging.current = true
    const point = 'touches' in e ? e.touches[0] : e
    handleSvMove(point as unknown as MouseEvent)
  }, [handleSvMove])

  // ── Hue slider interaction ──
  const handleHueMove = useCallback((e: MouseEvent | Touch) => {
    if (!hueRef.current) return
    const rect = hueRef.current.getBoundingClientRect()
    const x = clamp((('clientX' in e ? e.clientX : e.clientX) - rect.left) / rect.width, 0, 1)
    setHsv(([, ss, vv]) => [x * 360, ss, vv])
  }, [])

  const handleHueDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    hueDragging.current = true
    const point = 'touches' in e ? e.touches[0] : e
    handleHueMove(point as unknown as MouseEvent)
  }, [handleHueMove])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (svDragging.current) handleSvMove(e)
      if (hueDragging.current) handleHueMove(e)
    }
    const onUp = () => { svDragging.current = false; hueDragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [handleSvMove, handleHueMove])

  // ── Hex input ──
  const handleHexChange = (val: string) => {
    editingHex.current = true
    setHexInput(val.toUpperCase().replace(/[^0-9A-F]/gi, '').slice(0, 6))
    const parsed = parseHex(val)
    if (parsed) {
      setHsv(rgbToHsv(...parsed))
      setHexError(false)
    } else {
      setHexError(val.length > 0 && val.length !== 6)
    }
  }

  const handleHexBlur = () => {
    editingHex.current = false
    setHexError(false)
    setHexInput(hex.slice(1).toUpperCase())
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const svThumbX = s * 100
  const svThumbY = (1 - v) * 100
  const hueThumbX = (h / 360) * 100

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      padding: '16px',
      width: '260px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.08)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      userSelect: 'none',
    }}>

      {/* SV Canvas */}
      <div
        ref={svRef}
        onMouseDown={handleSvDown}
        style={{
          position: 'relative',
          width: '100%',
          height: '200px',
          borderRadius: '10px',
          overflow: 'hidden',
          cursor: 'crosshair',
          marginBottom: '12px',
          flexShrink: 0,
          background: hueColor,
        }}
      >
        {/* White gradient (left→right: white to transparent) */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #fff, transparent)' }} />
        {/* Black gradient (top→bottom: transparent to black) */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #000)' }} />
        {/* Thumb */}
        <div style={{
          position: 'absolute',
          left: `${svThumbX}%`,
          top: `${svThumbY}%`,
          transform: 'translate(-50%, -50%)',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          border: '2.5px solid #fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          background: hex,
          pointerEvents: 'none',
          transition: svDragging.current ? 'none' : 'left 0ms, top 0ms',
        }} />
      </div>

      {/* Hue Slider */}
      <div
        ref={hueRef}
        onMouseDown={handleHueDown}
        style={{
          position: 'relative',
          width: '100%',
          height: '12px',
          borderRadius: '6px',
          background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
          cursor: 'pointer',
          marginBottom: '14px',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{
          position: 'absolute',
          left: `${hueThumbX}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          border: '2.5px solid #fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          background: hueColor,
          pointerEvents: 'none',
        }} />
      </div>

      {/* Preview + Hex Input + Copy */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        {/* Color swatch */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: hex,
          border: '1px solid rgba(10,10,10,0.10)',
          flexShrink: 0,
          boxShadow: `0 2px 8px ${hex}55`,
          transition: 'background 80ms ease, box-shadow 80ms ease',
        }} />

        {/* Hex input */}
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '13px',
            fontWeight: 600,
            color: 'rgba(10,10,10,0.35)',
            pointerEvents: 'none',
            lineHeight: 1,
          }}>#</span>
          <input
            value={hexInput}
            onChange={e => handleHexChange(e.target.value)}
            onBlur={handleHexBlur}
            onFocus={() => { editingHex.current = true }}
            maxLength={6}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '8px 10px 8px 22px',
              border: `1.5px solid ${hexError ? 'rgba(220,38,38,0.5)' : 'rgba(10,10,10,0.12)'}`,
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0a0a0a',
              letterSpacing: '0.04em',
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              outline: 'none',
              background: '#fff',
              transition: 'border-color 150ms ease',
            }}
          />
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          style={{
            flexShrink: 0,
            padding: '8px 10px',
            borderRadius: '8px',
            border: '1.5px solid rgba(10,10,10,0.10)',
            background: copied ? 'rgba(34,197,94,0.08)' : '#fff',
            color: copied ? '#16a34a' : 'rgba(10,10,10,0.5)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            transition: 'all 150ms ease',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { if (!copied) e.currentTarget.style.background = 'rgba(10,10,10,0.04)' }}
          onMouseLeave={e => { if (!copied) e.currentTarget.style.background = '#fff' }}
        >
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>

      {/* RGB readout */}
      <div style={{
        display: 'flex',
        gap: '6px',
        marginBottom: '14px',
      }}>
        {[['R', r], ['G', g], ['B', b]].map(([label, val]) => (
          <div key={label as string} style={{
            flex: 1,
            background: 'rgba(10,10,10,0.03)',
            border: '1px solid rgba(10,10,10,0.06)',
            borderRadius: '8px',
            padding: '6px 8px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(10,10,10,0.35)', letterSpacing: '0.04em', marginBottom: '2px' }}>{label}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Presets */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {PRESETS.map(preset => (
          <button
            key={preset}
            onClick={() => {
              const parsed = parseHex(preset)
              if (parsed) setHsv(rgbToHsv(...parsed))
            }}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: preset,
              border: hex.toLowerCase() === preset ? '2.5px solid rgba(10,10,10,0.5)' : '1.5px solid rgba(10,10,10,0.12)',
              cursor: 'pointer',
              padding: 0,
              outline: 'none',
              boxShadow: hex.toLowerCase() === preset ? `0 0 0 2px #fff, 0 0 0 4px rgba(10,10,10,0.15)` : 'none',
              transition: 'box-shadow 120ms ease, border-color 120ms ease',
              flexShrink: 0,
            }}
            title={preset}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
  }
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)]
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = ((h * 60) + 360) % 360
  }
  return [h, max === 0 ? 0 : d / max, max]
}

function toHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

function parseHex(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  const n = parseInt(clean, 16)
  if (isNaN(n)) return null
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

const PRESETS = [
  '#0a0a0a', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6',
  '#ec4899', '#ffffff',
]

export function ColorPicker() {
  const [hsv, setHsv] = useState<[number, number, number]>([217, 0.82, 0.95])
  const [hexInput, setHexInput] = useState('')
  const [hexError, setHexError] = useState(false)
  const [copied, setCopied] = useState(false)

  const svRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const svDragging = useRef(false)
  const hueDragging = useRef(false)
  const editingHex = useRef(false)

  const [h, s, v] = hsv
  const [r, g, b] = hsvToRgb(h, s, v)
  const hex = toHex(r, g, b)
  const hueColor = toHex(...hsvToRgb(h, 1, 1))

  useEffect(() => {
    if (!editingHex.current) setHexInput(hex.slice(1).toUpperCase())
  }, [hex])

  const handleSvMove = useCallback((e: MouseEvent) => {
    if (!svRef.current) return
    const rect = svRef.current.getBoundingClientRect()
    const sx = clamp((e.clientX - rect.left) / rect.width, 0, 1)
    const sy = clamp((e.clientY - rect.top) / rect.height, 0, 1)
    setHsv(([hh]) => [hh, sx, 1 - sy])
  }, [])

  const handleHueMove = useCallback((e: MouseEvent) => {
    if (!hueRef.current) return
    const rect = hueRef.current.getBoundingClientRect()
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1)
    setHsv(([, ss, vv]) => [x * 360, ss, vv])
  }, [])

  const handleSvDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    svDragging.current = true
    handleSvMove(e.nativeEvent)
  }, [handleSvMove])

  const handleHueDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    hueDragging.current = true
    handleHueMove(e.nativeEvent)
  }, [handleHueMove])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (svDragging.current) handleSvMove(e)
      if (hueDragging.current) handleHueMove(e)
    }
    const onUp = () => { svDragging.current = false; hueDragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [handleSvMove, handleHueMove])

  const handleHexChange = (val: string) => {
    editingHex.current = true
    setHexInput(val.toUpperCase().replace(/[^0-9A-F]/gi, '').slice(0, 6))
    const parsed = parseHex(val)
    if (parsed) { setHsv(rgbToHsv(...parsed)); setHexError(false) }
    else setHexError(val.length > 0 && val.length !== 6)
  }

  const handleHexBlur = () => {
    editingHex.current = false
    setHexError(false)
    setHexInput(hex.slice(1).toUpperCase())
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const svThumbX = s * 100
  const svThumbY = (1 - v) * 100
  const hueThumbX = (h / 360) * 100

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      padding: '16px',
      width: '260px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.08)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      userSelect: 'none',
    }}>
      {/* SV Canvas */}
      <div
        ref={svRef}
        onMouseDown={handleSvDown}
        style={{
          position: 'relative', width: '100%', height: '200px',
          borderRadius: '10px', overflow: 'hidden', cursor: 'crosshair',
          marginBottom: '12px', background: hueColor,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #fff, transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #000)' }} />
        <div style={{
          position: 'absolute',
          left: \`\${svThumbX}%\`,
          top: \`\${svThumbY}%\`,
          transform: 'translate(-50%, -50%)',
          width: '14px', height: '14px', borderRadius: '50%',
          border: '2.5px solid #fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          background: hex, pointerEvents: 'none',
        }} />
      </div>

      {/* Hue Slider */}
      <div
        ref={hueRef}
        onMouseDown={handleHueDown}
        style={{
          position: 'relative', width: '100%', height: '12px', borderRadius: '6px',
          background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
          cursor: 'pointer', marginBottom: '14px',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{
          position: 'absolute',
          left: \`\${hueThumbX}%\`, top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '18px', height: '18px', borderRadius: '50%',
          border: '2.5px solid #fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          background: hueColor, pointerEvents: 'none',
        }} />
      </div>

      {/* Preview + Hex + Copy */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: hex, border: '1px solid rgba(10,10,10,0.10)',
          flexShrink: 0, boxShadow: \`0 2px 8px \${hex}55\`,
          transition: 'background 80ms ease',
        }} />
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{
            position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
            fontSize: '13px', fontWeight: 600, color: 'rgba(10,10,10,0.35)', pointerEvents: 'none',
          }}>#</span>
          <input
            value={hexInput}
            onChange={e => handleHexChange(e.target.value)}
            onBlur={handleHexBlur}
            onFocus={() => { editingHex.current = true }}
            maxLength={6}
            style={{
              width: '100%', boxSizing: 'border-box' as const,
              padding: '8px 10px 8px 22px',
              border: \`1.5px solid \${hexError ? 'rgba(220,38,38,0.5)' : 'rgba(10,10,10,0.12)'}\`,
              borderRadius: '8px', fontSize: '13px', fontWeight: 600,
              color: '#0a0a0a', letterSpacing: '0.04em',
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              outline: 'none', background: '#fff',
            }}
          />
        </div>
        <button
          onClick={handleCopy}
          style={{
            flexShrink: 0, padding: '8px 10px', borderRadius: '8px',
            border: '1.5px solid rgba(10,10,10,0.10)',
            background: copied ? 'rgba(34,197,94,0.08)' : '#fff',
            color: copied ? '#16a34a' : 'rgba(10,10,10,0.5)',
            fontSize: '11px', fontWeight: 600, cursor: 'pointer',
            letterSpacing: '-0.01em', transition: 'all 150ms ease',
            lineHeight: 1, whiteSpace: 'nowrap' as const,
          }}
        >
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>

      {/* RGB readout */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
        {[['R', r], ['G', g], ['B', b]].map(([label, val]) => (
          <div key={label as string} style={{
            flex: 1, background: 'rgba(10,10,10,0.03)',
            border: '1px solid rgba(10,10,10,0.06)',
            borderRadius: '8px', padding: '6px 8px', textAlign: 'center' as const,
          }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(10,10,10,0.35)', letterSpacing: '0.04em', marginBottom: '2px' }}>{label}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Presets */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
        {PRESETS.map(preset => (
          <button
            key={preset}
            onClick={() => { const p = parseHex(preset); if (p) setHsv(rgbToHsv(...p)) }}
            style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: preset, border: '1.5px solid rgba(10,10,10,0.12)',
              cursor: 'pointer', padding: 0, outline: 'none',
              transition: 'box-shadow 120ms ease',
            }}
            title={preset}
          />
        ))}
      </div>
    </div>
  )
}`

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
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
      }}>
        <ColorPicker />
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
