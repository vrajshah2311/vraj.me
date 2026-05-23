'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'
const MONO = 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace'

// ─── Slider ───────────────────────────────────────────────────────────────────

interface SliderProps {
  min?: number
  max?: number
  step?: number
  value: number
  onChange: (v: number) => void
  formatValue?: (v: number) => string
  color?: string
  disabled?: boolean
}

function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  formatValue = (v) => String(v),
  color = '#0a0a0a',
  disabled = false,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [hovering, setHovering] = useState(false)
  const showTooltip = dragging || hovering

  const pct = ((value - min) / (max - min)) * 100

  const getValueFromEvent = useCallback(
    (clientX: number): number => {
      const el = trackRef.current
      if (!el) return value
      const rect = el.getBoundingClientRect()
      const raw = (clientX - rect.left) / rect.width
      const clamped = Math.max(0, Math.min(1, raw))
      const snapped = Math.round((clamped * (max - min)) / step) * step + min
      return Math.max(min, Math.min(max, snapped))
    },
    [min, max, step, value]
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return
      e.currentTarget.setPointerCapture(e.pointerId)
      setDragging(true)
      onChange(getValueFromEvent(e.clientX))
    },
    [disabled, getValueFromEvent, onChange]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return
      onChange(getValueFromEvent(e.clientX))
    },
    [dragging, getValueFromEvent, onChange]
  )

  const handlePointerUp = useCallback(() => {
    setDragging(false)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return
      const delta = e.shiftKey ? step * 10 : step
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault()
        onChange(Math.min(max, value + delta))
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault()
        onChange(Math.max(min, value - delta))
      } else if (e.key === 'Home') {
        e.preventDefault()
        onChange(min)
      } else if (e.key === 'End') {
        e.preventDefault()
        onChange(max)
      }
    },
    [disabled, min, max, step, value, onChange]
  )

  return (
    <div
      style={{
        position: 'relative',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        outline: 'none',
      }}
      tabIndex={disabled ? -1 : 0}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={formatValue(value)}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Track */}
      <div
        ref={trackRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '4px',
          borderRadius: '2px',
          background: 'rgba(10,10,10,0.1)',
          overflow: 'visible',
        }}
      >
        {/* Fill */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: '2px',
            transition: dragging ? 'none' : 'width 80ms ease',
            pointerEvents: 'none',
          }}
        />

        {/* Thumb */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${pct}%`,
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#fff',
            border: '1px solid rgba(10,10,10,0.12)',
            boxShadow: dragging
              ? `0 0 0 4px ${color}22, 0 1px 4px rgba(0,0,0,0.18)`
              : `0 1px 4px rgba(0,0,0,0.18), 0 0 0 0px ${color}22`,
            transform: 'translate(-50%, -50%)',
            transition: 'box-shadow 150ms ease',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Tooltip */}
        <div
          style={{
            position: 'absolute',
            bottom: '22px',
            left: `${pct}%`,
            transform: 'translateX(-50%)',
            background: '#0a0a0a',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
            fontFamily: FONT,
            letterSpacing: '-0.01em',
            lineHeight: 1,
            padding: '4px 7px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            opacity: showTooltip ? 1 : 0,
            transform: showTooltip
              ? 'translateX(-50%) translateY(0px)'
              : 'translateX(-50%) translateY(4px)',
            transition: 'opacity 120ms ease, transform 120ms ease',
            zIndex: 3,
          }}
        >
          {formatValue(value)}
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              bottom: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid #0a0a0a',
            }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Range Slider ─────────────────────────────────────────────────────────────

interface RangeSliderProps {
  min?: number
  max?: number
  step?: number
  low: number
  high: number
  onChange: (low: number, high: number) => void
  formatValue?: (v: number) => string
  color?: string
}

function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  low,
  high,
  onChange,
  formatValue = (v) => String(v),
  color = '#0a0a0a',
}: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeThumb, setActiveThumb] = useState<'low' | 'high' | null>(null)
  const [hoveredThumb, setHoveredThumb] = useState<'low' | 'high' | null>(null)

  const pctLow = ((low - min) / (max - min)) * 100
  const pctHigh = ((high - min) / (max - min)) * 100

  const getValueFromEvent = useCallback(
    (clientX: number): number => {
      const el = trackRef.current
      if (!el) return 0
      const rect = el.getBoundingClientRect()
      const raw = (clientX - rect.left) / rect.width
      const clamped = Math.max(0, Math.min(1, raw))
      const snapped = Math.round((clamped * (max - min)) / step) * step + min
      return Math.max(min, Math.min(max, snapped))
    },
    [min, max, step]
  )

  const handleThumbPointerDown = useCallback(
    (thumb: 'low' | 'high') => (e: React.PointerEvent) => {
      e.stopPropagation()
      e.currentTarget.setPointerCapture(e.pointerId)
      setActiveThumb(thumb)
    },
    []
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!activeThumb) return
      const v = getValueFromEvent(e.clientX)
      if (activeThumb === 'low') {
        onChange(Math.min(v, high - step), high)
      } else {
        onChange(low, Math.max(v, low + step))
      }
    },
    [activeThumb, getValueFromEvent, low, high, step, onChange]
  )

  const handlePointerUp = useCallback(() => {
    setActiveThumb(null)
  }, [])

  return (
    <div
      style={{ position: 'relative', height: '20px', display: 'flex', alignItems: 'center' }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        ref={trackRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '4px',
          borderRadius: '2px',
          background: 'rgba(10,10,10,0.1)',
          overflow: 'visible',
        }}
      >
        {/* Fill between thumbs */}
        <div
          style={{
            position: 'absolute',
            left: `${pctLow}%`,
            width: `${pctHigh - pctLow}%`,
            height: '100%',
            background: color,
            borderRadius: '2px',
            pointerEvents: 'none',
          }}
        />

        {/* Low thumb */}
        {(['low', 'high'] as const).map((thumb) => {
          const pct = thumb === 'low' ? pctLow : pctHigh
          const isActive = activeThumb === thumb
          const isHovered = hoveredThumb === thumb
          const showTip = isActive || isHovered
          const v = thumb === 'low' ? low : high

          return (
            <div
              key={thumb}
              style={{
                position: 'absolute',
                top: '50%',
                left: `${pct}%`,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#fff',
                border: '1px solid rgba(10,10,10,0.12)',
                boxShadow: isActive
                  ? `0 0 0 4px ${color}22, 0 1px 4px rgba(0,0,0,0.18)`
                  : `0 1px 4px rgba(0,0,0,0.18), 0 0 0 0px ${color}22`,
                transform: 'translate(-50%, -50%)',
                transition: 'box-shadow 150ms ease',
                zIndex: isActive ? 3 : 2,
                cursor: 'grab',
                touchAction: 'none',
              }}
              onPointerDown={handleThumbPointerDown(thumb)}
              onMouseEnter={() => setHoveredThumb(thumb)}
              onMouseLeave={() => setHoveredThumb(null)}
            >
              {/* Per-thumb tooltip */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '22px',
                  left: '50%',
                  transform: showTip
                    ? 'translateX(-50%) translateY(0px)'
                    : 'translateX(-50%) translateY(4px)',
                  background: '#0a0a0a',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: FONT,
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                  padding: '4px 7px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  opacity: showTip ? 1 : 0,
                  transition: 'opacity 120ms ease, transform 120ms ease',
                  zIndex: 4,
                }}
              >
                {formatValue(v)}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderTop: '4px solid #0a0a0a',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function Demo() {
  const [volume, setVolume] = useState(72)
  const [opacity, setOpacity] = useState(0.6)
  const [blur, setBlur] = useState(8)
  const [priceRange, setPriceRange] = useState({ low: 120, high: 640 })
  const [hue, setHue] = useState(210)
  const [rotation, setRotation] = useState(45)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', width: '100%', maxWidth: 480 }}>

      {/* ── Main card ── */}
      <div style={{
        width: '100%',
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid rgba(10,10,10,0.08)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)',
        padding: '24px',
        fontFamily: FONT,
      }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', marginBottom: '20px' }}>
          Controls
        </div>

        {/* Volume */}
        <Row label="Volume" value={`${volume}%`}>
          <Slider
            value={volume}
            onChange={setVolume}
            formatValue={(v) => `${v}%`}
          />
        </Row>

        {/* Opacity */}
        <Row label="Opacity" value={opacity.toFixed(2)}>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={opacity}
            onChange={setOpacity}
            formatValue={(v) => v.toFixed(2)}
            color="#6366f1"
          />
        </Row>

        {/* Blur */}
        <Row label="Blur" value={`${blur}px`}>
          <Slider
            min={0}
            max={32}
            step={1}
            value={blur}
            onChange={setBlur}
            formatValue={(v) => `${v}px`}
            color="#0ea5e9"
          />
        </Row>
      </div>

      {/* ── Color preview card ── */}
      <div style={{
        width: '100%',
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid rgba(10,10,10,0.08)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)',
        padding: '24px',
        fontFamily: FONT,
      }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', marginBottom: '20px' }}>
          Color
        </div>

        {/* Hue slider with rainbow track */}
        <Row label="Hue" value={`${hue}°`}>
          <div style={{ position: 'relative' }}>
            {/* Custom rainbow track underneath */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '4px',
              borderRadius: '2px',
              background: 'linear-gradient(to right, hsl(0,80%,55%), hsl(60,80%,55%), hsl(120,80%,45%), hsl(180,80%,45%), hsl(240,80%,60%), hsl(300,80%,55%), hsl(360,80%,55%))',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }} />
            <Slider
              min={0}
              max={360}
              step={1}
              value={hue}
              onChange={setHue}
              formatValue={(v) => `${v}°`}
              color={`hsl(${hue}, 80%, 50%)`}
            />
          </div>
        </Row>

        {/* Swatch preview */}
        <div style={{
          height: 56,
          borderRadius: 10,
          marginTop: 4,
          background: `hsl(${hue}, 75%, 55%)`,
          transition: 'background 100ms ease',
          border: '1px solid rgba(10,10,10,0.06)',
        }} />
      </div>

      {/* ── Range card ── */}
      <div style={{
        width: '100%',
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid rgba(10,10,10,0.08)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)',
        padding: '24px',
        fontFamily: FONT,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
            Price range
          </div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.55)', letterSpacing: '-0.01em' }}>
            ${priceRange.low} – ${priceRange.high}
          </div>
        </div>

        <RangeSlider
          min={0}
          max={1000}
          step={10}
          low={priceRange.low}
          high={priceRange.high}
          onChange={(low, high) => setPriceRange({ low, high })}
          formatValue={(v) => `$${v}`}
          color="#0a0a0a"
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>$0</span>
          <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>$1,000</span>
        </div>
      </div>

      {/* ── Rotation card ── */}
      <div style={{
        width: '100%',
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid rgba(10,10,10,0.08)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)',
        padding: '24px',
        fontFamily: FONT,
        display: 'flex',
        gap: 20,
        alignItems: 'center',
      }}>
        {/* Rotating icon */}
        <div style={{
          width: 56,
          height: 56,
          flexShrink: 0,
          borderRadius: 12,
          background: 'rgba(10,10,10,0.04)',
          border: '1px solid rgba(10,10,10,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 60ms linear',
          }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', marginBottom: 12 }}>
            Rotation · {rotation}°
          </div>
          <Slider
            min={-180}
            max={180}
            step={1}
            value={rotation}
            onChange={setRotation}
            formatValue={(v) => `${v}°`}
            color="#764ba2"
          />
        </div>
      </div>

    </div>
  )
}

// ─── Row helper ───────────────────────────────────────────────────────────────

function Row({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.55)', letterSpacing: '-0.01em', fontFamily: FONT }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', fontFamily: MONO }}>{value}</span>
      </div>
      {children}
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useCallback } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

interface SliderProps {
  min?: number
  max?: number
  step?: number
  value: number
  onChange: (v: number) => void
  formatValue?: (v: number) => string
  color?: string
  disabled?: boolean
}

export function Slider({
  min = 0, max = 100, step = 1, value, onChange,
  formatValue = (v) => String(v), color = '#0a0a0a', disabled = false,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [hovering, setHovering] = useState(false)
  const showTooltip = dragging || hovering
  const pct = ((value - min) / (max - min)) * 100

  const getValueFromEvent = useCallback((clientX: number): number => {
    const el = trackRef.current
    if (!el) return value
    const rect = el.getBoundingClientRect()
    const raw = (clientX - rect.left) / rect.width
    const clamped = Math.max(0, Math.min(1, raw))
    const snapped = Math.round((clamped * (max - min)) / step) * step + min
    return Math.max(min, Math.min(max, snapped))
  }, [min, max, step, value])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (disabled) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    onChange(getValueFromEvent(e.clientX))
  }, [disabled, getValueFromEvent, onChange])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return
    onChange(getValueFromEvent(e.clientX))
  }, [dragging, getValueFromEvent, onChange])

  const handlePointerUp = useCallback(() => { setDragging(false) }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return
    const delta = e.shiftKey ? step * 10 : step
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault(); onChange(Math.min(max, value + delta))
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault(); onChange(Math.max(min, value - delta))
    } else if (e.key === 'Home') {
      e.preventDefault(); onChange(min)
    } else if (e.key === 'End') {
      e.preventDefault(); onChange(max)
    }
  }, [disabled, min, max, step, value, onChange])

  return (
    <div
      style={{
        position: 'relative', height: '20px', display: 'flex',
        alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1, outline: 'none',
      }}
      tabIndex={disabled ? -1 : 0}
      role="slider"
      aria-valuemin={min} aria-valuemax={max} aria-valuenow={value}
      aria-valuetext={formatValue(value)}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        ref={trackRef}
        style={{ position: 'relative', width: '100%', height: '4px', borderRadius: '2px', background: 'rgba(10,10,10,0.1)', overflow: 'visible' }}
      >
        {/* Fill */}
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: \`\${pct}%\`, background: color, borderRadius: '2px', transition: dragging ? 'none' : 'width 80ms ease', pointerEvents: 'none' }} />

        {/* Thumb */}
        <div style={{
          position: 'absolute', top: '50%', left: \`\${pct}%\`,
          width: '16px', height: '16px', borderRadius: '50%',
          background: '#fff', border: '1px solid rgba(10,10,10,0.12)',
          boxShadow: dragging ? \`0 0 0 4px \${color}22, 0 1px 4px rgba(0,0,0,0.18)\` : '0 1px 4px rgba(0,0,0,0.18)',
          transform: 'translate(-50%, -50%)',
          transition: 'box-shadow 150ms ease', pointerEvents: 'none', zIndex: 2,
        }} />

        {/* Tooltip */}
        <div style={{
          position: 'absolute', bottom: '22px', left: \`\${pct}%\`,
          transform: showTooltip ? 'translateX(-50%) translateY(0px)' : 'translateX(-50%) translateY(4px)',
          background: '#0a0a0a', color: '#fff',
          fontSize: '11px', fontWeight: 600, fontFamily: FONT, letterSpacing: '-0.01em', lineHeight: 1,
          padding: '4px 7px', borderRadius: '6px', whiteSpace: 'nowrap', pointerEvents: 'none',
          opacity: showTooltip ? 1 : 0,
          transition: 'opacity 120ms ease, transform 120ms ease', zIndex: 3,
        }}>
          {formatValue(value)}
          <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #0a0a0a' }} />
        </div>
      </div>
    </div>
  )
}

// ── RangeSlider: two-thumb variant ────────────────────────────────────────────

interface RangeSliderProps {
  min?: number; max?: number; step?: number
  low: number; high: number
  onChange: (low: number, high: number) => void
  formatValue?: (v: number) => string
  color?: string
}

export function RangeSlider({
  min = 0, max = 100, step = 1, low, high, onChange,
  formatValue = (v) => String(v), color = '#0a0a0a',
}: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeThumb, setActiveThumb] = useState<'low' | 'high' | null>(null)
  const [hoveredThumb, setHoveredThumb] = useState<'low' | 'high' | null>(null)
  const pctLow = ((low - min) / (max - min)) * 100
  const pctHigh = ((high - min) / (max - min)) * 100

  const getValueFromEvent = useCallback((clientX: number): number => {
    const el = trackRef.current
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    const raw = (clientX - rect.left) / rect.width
    const clamped = Math.max(0, Math.min(1, raw))
    const snapped = Math.round((clamped * (max - min)) / step) * step + min
    return Math.max(min, Math.min(max, snapped))
  }, [min, max, step])

  const handleThumbPointerDown = (thumb: 'low' | 'high') => (e: React.PointerEvent) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    setActiveThumb(thumb)
  }

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!activeThumb) return
    const v = getValueFromEvent(e.clientX)
    if (activeThumb === 'low') onChange(Math.min(v, high - step), high)
    else onChange(low, Math.max(v, low + step))
  }, [activeThumb, getValueFromEvent, low, high, step, onChange])

  return (
    <div
      style={{ position: 'relative', height: '20px', display: 'flex', alignItems: 'center' }}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setActiveThumb(null)}
    >
      <div ref={trackRef} style={{ position: 'relative', width: '100%', height: '4px', borderRadius: '2px', background: 'rgba(10,10,10,0.1)', overflow: 'visible' }}>
        {/* Fill between thumbs */}
        <div style={{ position: 'absolute', left: \`\${pctLow}%\`, width: \`\${pctHigh - pctLow}%\`, height: '100%', background: color, borderRadius: '2px', pointerEvents: 'none' }} />

        {(['low', 'high'] as const).map((thumb) => {
          const pct = thumb === 'low' ? pctLow : pctHigh
          const isActive = activeThumb === thumb
          const showTip = isActive || hoveredThumb === thumb
          const v = thumb === 'low' ? low : high
          return (
            <div
              key={thumb}
              style={{
                position: 'absolute', top: '50%', left: \`\${pct}%\`,
                width: '16px', height: '16px', borderRadius: '50%',
                background: '#fff', border: '1px solid rgba(10,10,10,0.12)',
                boxShadow: isActive ? \`0 0 0 4px \${color}22, 0 1px 4px rgba(0,0,0,0.18)\` : '0 1px 4px rgba(0,0,0,0.18)',
                transform: 'translate(-50%, -50%)',
                transition: 'box-shadow 150ms ease', zIndex: isActive ? 3 : 2,
                cursor: 'grab', touchAction: 'none',
              }}
              onPointerDown={handleThumbPointerDown(thumb)}
              onMouseEnter={() => setHoveredThumb(thumb)}
              onMouseLeave={() => setHoveredThumb(null)}
            >
              <div style={{
                position: 'absolute', bottom: '22px', left: '50%',
                transform: showTip ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(4px)',
                background: '#0a0a0a', color: '#fff',
                fontSize: '11px', fontWeight: 600, fontFamily: FONT,
                padding: '4px 7px', borderRadius: '6px', whiteSpace: 'nowrap', pointerEvents: 'none',
                opacity: showTip ? 1 : 0, transition: 'opacity 120ms ease, transform 120ms ease', zIndex: 4,
              }}>
                {formatValue(v)}
                <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #0a0a0a' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Usage ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [volume, setVolume] = useState(72)
  const [price, setPrice] = useState({ low: 120, high: 640 })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', maxWidth: 480, fontFamily: FONT }}>
      <div>
        <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.5)' }}>Volume · {volume}%</p>
        <Slider value={volume} onChange={setVolume} formatValue={(v) => \`\${v}%\`} />
      </div>

      <div>
        <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.5)' }}>Price · \${price.low} – \${price.high}</p>
        <RangeSlider min={0} max={1000} step={10} low={price.low} high={price.high}
          onChange={(low, high) => setPrice({ low, high })} formatValue={(v) => \`\$\${v}\`} />
      </div>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SliderPage() {
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
        gap: '0',
      }}>
        <Demo />
        <p style={{
          marginTop: '32px',
          fontSize: '12px',
          color: 'rgba(0,0,0,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily: FONT,
          textAlign: 'center',
        }}>
          Drag, click, or use arrow keys · hover to reveal tooltip · range variant with two thumbs
        </p>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.4)',
          marginBottom: '12px',
          fontFamily: FONT,
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
