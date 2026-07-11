'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ── Color utilities ────────────────────────────────────────────────────────────

function hsbToRgb(h: number, s: number, b: number): [number, number, number] {
  s /= 100; b /= 100
  const k = (n: number) => (n + h / 60) % 6
  const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)))
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

function hexToRgb(hex: string): [number, number, number] | null {
  const c = hex.replace('#', '')
  if (!/^[0-9a-f]{6}$/i.test(c)) return null
  return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]
}

function rgbToHsb(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  let h = 0
  if (d) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  return [h, max ? Math.round((d / max) * 100) : 0, Math.round(max * 100)]
}

// ── ColorPicker component ──────────────────────────────────────────────────────

const SWATCHES = [
  '#FF6B6B', '#FF9F43', '#FECA57', '#1DD1A1',
  '#54A0FF', '#5F27CD', '#FF9FF3', '#C8D6E5',
  '#2C3E50', '#6C5CE7',
]

function ColorPicker() {
  const [hue, setHue] = useState(220)
  const [sat, setSat] = useState(72)
  const [bright, setBright] = useState(88)
  const [hexVal, setHexVal] = useState('')
  const [copied, setCopied] = useState(false)

  const gradRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const dragGrad = useRef(false)
  const dragHue = useRef(false)

  const [r, g, b] = hsbToRgb(hue, sat, bright)
  const hex = rgbToHex(r, g, b)
  const pureHue = rgbToHex(...hsbToRgb(hue, 100, 100))

  useEffect(() => { setHexVal(hex.slice(1).toUpperCase()) }, [hex])

  const applyGrad = useCallback((cx: number, cy: number) => {
    if (!gradRef.current) return
    const { left, top, width, height } = gradRef.current.getBoundingClientRect()
    setSat(Math.round(Math.max(0, Math.min(100, ((cx - left) / width) * 100))))
    setBright(Math.round(Math.max(0, Math.min(100, 100 - ((cy - top) / height) * 100))))
  }, [])

  const applyHue = useCallback((cx: number) => {
    if (!hueRef.current) return
    const { left, width } = hueRef.current.getBoundingClientRect()
    setHue(Math.round(Math.max(0, Math.min(360, ((cx - left) / width) * 360))))
  }, [])

  useEffect(() => {
    const mm = (e: MouseEvent) => {
      if (dragGrad.current) applyGrad(e.clientX, e.clientY)
      if (dragHue.current) applyHue(e.clientX)
    }
    const tm = (e: TouchEvent) => {
      const t = e.touches[0]
      if (dragGrad.current) applyGrad(t.clientX, t.clientY)
      if (dragHue.current) applyHue(t.clientX)
    }
    const up = () => { dragGrad.current = false; dragHue.current = false }
    window.addEventListener('mousemove', mm)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', tm, { passive: true })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', mm)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', tm)
      window.removeEventListener('touchend', up)
    }
  }, [applyGrad, applyHue])

  const onHexChange = (val: string) => {
    setHexVal(val.toUpperCase())
    const rgb = hexToRgb(val)
    if (rgb) { const [h, s, v] = rgbToHsb(...rgb); setHue(h); setSat(s); setBright(v) }
  }

  const onRgbChange = (ch: 0 | 1 | 2, val: string) => {
    const v = Math.max(0, Math.min(255, parseInt(val) || 0))
    const rgb: [number, number, number] = [r, g, b]
    rgb[ch] = v
    const [h, s, bv] = rgbToHsb(...rgb)
    setHue(h); setSat(s); setBright(bv)
  }

  return (
    <div style={{
      width: 280, background: '#fff', borderRadius: 14,
      border: '1px solid rgba(0,0,0,0.08)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.03), 0 20px 48px rgba(0,0,0,0.10)',
      overflow: 'hidden', fontFamily: font,
    }}>
      {/* Gradient canvas */}
      <div
        ref={gradRef}
        onMouseDown={e => { dragGrad.current = true; applyGrad(e.clientX, e.clientY) }}
        onTouchStart={e => { dragGrad.current = true; applyGrad(e.touches[0].clientX, e.touches[0].clientY) }}
        style={{
          position: 'relative', height: 180,
          background: pureHue, cursor: 'crosshair', userSelect: 'none' as const,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #fff, transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000, transparent)' }} />
        <div style={{
          position: 'absolute',
          left: sat + '%', top: (100 - bright) + '%',
          width: 14, height: 14, borderRadius: '50%',
          border: '2.5px solid #fff',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.2)',
          transform: 'translate(-50%, -50%)',
          background: hex, pointerEvents: 'none',
        }} />
      </div>

      <div style={{ padding: 14 }}>
        {/* Preview + hue slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            background: hex, border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }} />
          <div
            ref={hueRef}
            onMouseDown={e => { dragHue.current = true; applyHue(e.clientX) }}
            onTouchStart={e => { dragHue.current = true; applyHue(e.touches[0].clientX) }}
            style={{
              flex: 1, height: 14, borderRadius: 7, cursor: 'pointer',
              userSelect: 'none' as const, position: 'relative',
              background: 'linear-gradient(to right,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)',
            }}
          >
            <div style={{
              position: 'absolute', top: '50%',
              left: (hue / 360 * 100) + '%',
              width: 18, height: 18, borderRadius: '50%',
              border: '2.5px solid #fff',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.2)',
              transform: 'translate(-50%, -50%)',
              background: pureHue, pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* Hex + RGB inputs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <div style={{ flex: 1.8, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{
              fontSize: 10, fontWeight: 600, color: 'rgba(0,0,0,0.35)',
              letterSpacing: '0.05em', textTransform: 'uppercase' as const,
            }}>Hex</div>
            <div style={{
              display: 'flex', alignItems: 'center',
              border: '1px solid rgba(0,0,0,0.1)', borderRadius: 7,
              background: '#fafafa', overflow: 'hidden',
            }}>
              <span style={{ padding: '0 4px 0 8px', fontSize: 12, color: 'rgba(0,0,0,0.3)', fontWeight: 600 }}>#</span>
              <input
                value={hexVal}
                onChange={e => onHexChange(e.target.value)}
                maxLength={6}
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontSize: 12, fontWeight: 500, color: '#0a0a0a',
                  padding: '6px 8px 6px 0', letterSpacing: '0.04em',
                  fontFamily: 'ui-monospace, monospace',
                }}
              />
            </div>
          </div>
          {(['R', 'G', 'B'] as const).map((ch, i) => (
            <div key={ch} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{
                fontSize: 10, fontWeight: 600, color: 'rgba(0,0,0,0.35)',
                letterSpacing: '0.05em', textTransform: 'uppercase' as const,
              }}>{ch}</div>
              <input
                value={[r, g, b][i]}
                onChange={e => onRgbChange(i as 0 | 1 | 2, e.target.value)}
                type="number" min={0} max={255}
                style={{
                  width: '100%', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 7,
                  outline: 'none', background: '#fafafa',
                  fontSize: 12, fontWeight: 500, color: '#0a0a0a',
                  padding: '6px 4px', textAlign: 'center' as const,
                  fontFamily: 'ui-monospace, monospace', boxSizing: 'border-box' as const,
                }}
              />
            </div>
          ))}
        </div>

        {/* Swatches */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const, marginBottom: 12 }}>
          {SWATCHES.map(sw => (
            <button
              key={sw}
              onClick={() => {
                const rgb = hexToRgb(sw.slice(1))
                if (rgb) { const [h, s, v] = rgbToHsb(...rgb); setHue(h); setSat(s); setBright(v) }
              }}
              style={{
                width: 22, height: 22, borderRadius: 6, background: sw, padding: 0, cursor: 'pointer',
                border: hex.toLowerCase() === sw.toLowerCase()
                  ? '2.5px solid rgba(0,0,0,0.7)' : '1.5px solid rgba(0,0,0,0.12)',
                transition: 'transform 0.12s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            />
          ))}
        </div>

        {/* Copy button */}
        <button
          onClick={async () => {
            try { await navigator.clipboard.writeText(hex); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
          }}
          style={{
            width: '100%', padding: '8px 14px',
            background: copied ? '#0a0a0a' : 'rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8,
            fontSize: 12, fontWeight: 600,
            color: copied ? '#fff' : '#0a0a0a',
            cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '-0.01em',
            transition: 'background 0.15s ease, color 0.15s ease',
          }}
        >
          {copied ? '✓  Copied ' + hex : 'Copy  ' + hex}
        </button>
      </div>
    </div>
  )
}

// ── Demo ───────────────────────────────────────────────────────────────────────

function Demo() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
      padding: '40px 24px', fontFamily: font,
    }}>
      <ColorPicker />
    </div>
  )
}

// ── CopyButton ─────────────────────────────────────────────────────────────────

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
        borderRadius: 7,
        color: copied ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
        fontSize: 12, fontWeight: 500,
        cursor: 'pointer', fontFamily: font,
        letterSpacing: '-0.01em',
        transition: 'background 0.15s ease, color 0.15s ease',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ── Code source ────────────────────────────────────────────────────────────────

const CODE_SOURCE = `'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

function hsbToRgb(h, s, b) {
  s /= 100; b /= 100
  const k = n => (n + h / 60) % 6
  const f = n => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)))
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)]
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

function hexToRgb(hex) {
  const c = hex.replace('#', '')
  if (!/^[0-9a-f]{6}$/i.test(c)) return null
  return [parseInt(c.slice(0,2),16), parseInt(c.slice(2,4),16), parseInt(c.slice(4,6),16)]
}

function rgbToHsb(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r,g,b), min = Math.min(r,g,b), d = max - min
  let h = 0
  if (d) {
    if (max === r) h = ((g-b)/d) % 6
    else if (max === g) h = (b-r)/d + 2
    else h = (r-g)/d + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  return [h, max ? Math.round((d/max)*100) : 0, Math.round(max*100)]
}

const SWATCHES = [
  '#FF6B6B','#FF9F43','#FECA57','#1DD1A1',
  '#54A0FF','#5F27CD','#FF9FF3','#C8D6E5',
  '#2C3E50','#6C5CE7',
]

export default function ColorPicker() {
  const [hue, setHue] = useState(220)
  const [sat, setSat] = useState(72)
  const [bright, setBright] = useState(88)
  const [hexVal, setHexVal] = useState('')
  const [copied, setCopied] = useState(false)

  const gradRef = useRef(null)
  const hueRef = useRef(null)
  const dragGrad = useRef(false)
  const dragHue = useRef(false)

  const [r, g, b] = hsbToRgb(hue, sat, bright)
  const hex = rgbToHex(r, g, b)
  const pureHue = rgbToHex(...hsbToRgb(hue, 100, 100))

  useEffect(() => { setHexVal(hex.slice(1).toUpperCase()) }, [hex])

  const applyGrad = useCallback((cx, cy) => {
    if (!gradRef.current) return
    const { left, top, width, height } = gradRef.current.getBoundingClientRect()
    setSat(Math.round(Math.max(0, Math.min(100, ((cx - left) / width) * 100))))
    setBright(Math.round(Math.max(0, Math.min(100, 100 - ((cy - top) / height) * 100))))
  }, [])

  const applyHue = useCallback((cx) => {
    if (!hueRef.current) return
    const { left, width } = hueRef.current.getBoundingClientRect()
    setHue(Math.round(Math.max(0, Math.min(360, ((cx - left) / width) * 360))))
  }, [])

  useEffect(() => {
    const mm = e => {
      if (dragGrad.current) applyGrad(e.clientX, e.clientY)
      if (dragHue.current) applyHue(e.clientX)
    }
    const tm = e => {
      const t = e.touches[0]
      if (dragGrad.current) applyGrad(t.clientX, t.clientY)
      if (dragHue.current) applyHue(t.clientX)
    }
    const up = () => { dragGrad.current = false; dragHue.current = false }
    window.addEventListener('mousemove', mm)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', tm, { passive: true })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', mm)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', tm)
      window.removeEventListener('touchend', up)
    }
  }, [applyGrad, applyHue])

  const onHexChange = val => {
    setHexVal(val.toUpperCase())
    const rgb = hexToRgb(val)
    if (rgb) { const [h, s, v] = rgbToHsb(...rgb); setHue(h); setSat(s); setBright(v) }
  }

  const onRgbChange = (ch, val) => {
    const v = Math.max(0, Math.min(255, parseInt(val) || 0))
    const rgb = [r, g, b]
    rgb[ch] = v
    const [h, s, bv] = rgbToHsb(...rgb)
    setHue(h); setSat(s); setBright(bv)
  }

  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

  return (
    <div style={{
      width: 280, background: '#fff', borderRadius: 14,
      border: '1px solid rgba(0,0,0,0.08)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.03), 0 20px 48px rgba(0,0,0,0.10)',
      overflow: 'hidden', fontFamily: font,
    }}>
      {/* Gradient canvas */}
      <div
        ref={gradRef}
        onMouseDown={e => { dragGrad.current = true; applyGrad(e.clientX, e.clientY) }}
        onTouchStart={e => { dragGrad.current = true; applyGrad(e.touches[0].clientX, e.touches[0].clientY) }}
        style={{ position: 'relative', height: 180, background: pureHue, cursor: 'crosshair', userSelect: 'none' }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #fff, transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000, transparent)' }} />
        <div style={{
          position: 'absolute',
          left: sat + '%', top: (100 - bright) + '%',
          width: 14, height: 14, borderRadius: '50%',
          border: '2.5px solid #fff',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.2)',
          transform: 'translate(-50%, -50%)',
          background: hex, pointerEvents: 'none',
        }} />
      </div>

      <div style={{ padding: 14 }}>
        {/* Preview + hue slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            background: hex, border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }} />
          <div
            ref={hueRef}
            onMouseDown={e => { dragHue.current = true; applyHue(e.clientX) }}
            onTouchStart={e => { dragHue.current = true; applyHue(e.touches[0].clientX) }}
            style={{
              flex: 1, height: 14, borderRadius: 7, cursor: 'pointer',
              userSelect: 'none', position: 'relative',
              background: 'linear-gradient(to right,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)',
            }}
          >
            <div style={{
              position: 'absolute', top: '50%',
              left: (hue / 360 * 100) + '%',
              width: 18, height: 18, borderRadius: '50%',
              border: '2.5px solid #fff',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.2)',
              transform: 'translate(-50%, -50%)',
              background: pureHue, pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* Hex + RGB inputs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <div style={{ flex: 1.8, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Hex</div>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 7, background: '#fafafa', overflow: 'hidden' }}>
              <span style={{ padding: '0 4px 0 8px', fontSize: 12, color: 'rgba(0,0,0,0.3)', fontWeight: 600 }}>#</span>
              <input
                value={hexVal}
                onChange={e => onHexChange(e.target.value)}
                maxLength={6}
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontSize: 12, fontWeight: 500, color: '#0a0a0a',
                  padding: '6px 8px 6px 0', letterSpacing: '0.04em',
                  fontFamily: 'ui-monospace, monospace',
                }}
              />
            </div>
          </div>
          {['R','G','B'].map((ch, i) => (
            <div key={ch} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{ch}</div>
              <input
                value={[r,g,b][i]}
                onChange={e => onRgbChange(i, e.target.value)}
                type="number" min={0} max={255}
                style={{
                  width: '100%', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 7,
                  outline: 'none', background: '#fafafa',
                  fontSize: 12, fontWeight: 500, color: '#0a0a0a',
                  padding: '6px 4px', textAlign: 'center',
                  fontFamily: 'ui-monospace, monospace', boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
        </div>

        {/* Swatches */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
          {SWATCHES.map(sw => (
            <button
              key={sw}
              onClick={() => {
                const rgb = hexToRgb(sw.slice(1))
                if (rgb) { const [h, s, v] = rgbToHsb(...rgb); setHue(h); setSat(s); setBright(v) }
              }}
              style={{
                width: 22, height: 22, borderRadius: 6, background: sw, padding: 0, cursor: 'pointer',
                border: hex.toLowerCase() === sw.toLowerCase() ? '2.5px solid rgba(0,0,0,0.7)' : '1.5px solid rgba(0,0,0,0.12)',
                transition: 'transform 0.12s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            />
          ))}
        </div>

        {/* Copy button */}
        <button
          onClick={async () => {
            try { await navigator.clipboard.writeText(hex); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
          }}
          style={{
            width: '100%', padding: '8px 14px',
            background: copied ? '#0a0a0a' : 'rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8,
            fontSize: 12, fontWeight: 600,
            color: copied ? '#fff' : '#0a0a0a',
            cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '-0.01em',
            transition: 'background 0.15s ease, color 0.15s ease',
          }}
        >
          {copied ? '✓  Copied ' + hex : 'Copy  ' + hex}
        </button>
      </div>
    </div>
  )
}`

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ColorPickerPage() {
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
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>
                Color Picker
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                Drop into any React project — zero dependencies
              </div>
            </div>
            <CopyButton text={CODE_SOURCE} />
          </div>

          <div style={{
            background: '#111', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center',
            }}>
              <div style={{
                fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500,
                fontFamily: 'ui-monospace, monospace',
              }}>
                ColorPicker.tsx
              </div>
            </div>
            <pre style={{
              margin: 0, padding: '20px', overflowX: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
              fontSize: 12.5, lineHeight: 1.65, color: '#e5e5e5',
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
