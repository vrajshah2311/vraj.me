'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

function snap(v: number, step: number) {
  return Math.round(v / step) * step
}

function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  defaultLow,
  defaultHigh,
  formatValue = (v: number) => String(v),
  onChange,
}: {
  min?: number
  max?: number
  step?: number
  defaultLow?: number
  defaultHigh?: number
  formatValue?: (v: number) => string
  onChange?: (low: number, high: number) => void
}) {
  const [low, setLow] = useState(defaultLow ?? min)
  const [high, setHigh] = useState(defaultHigh ?? max)
  const [active, setActive] = useState<'low' | 'high' | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const lowPct = ((low - min) / (max - min)) * 100
  const highPct = ((high - min) / (max - min)) * 100

  const valFromX = useCallback(
    (clientX: number): number | null => {
      if (!trackRef.current) return null
      const { left, width } = trackRef.current.getBoundingClientRect()
      return snap(min + clamp((clientX - left) / width, 0, 1) * (max - min), step)
    },
    [min, max, step],
  )

  useEffect(() => {
    if (!active) return
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const val = valFromX(clientX)
      if (val === null) return
      if (active === 'low') {
        const next = clamp(val, min, high - step)
        setLow(next)
        onChange?.(next, high)
      } else {
        const next = clamp(val, low + step, max)
        setHigh(next)
        onChange?.(low, next)
      }
    }
    const onUp = () => setActive(null)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [active, low, high, min, max, step, onChange, valFromX])

  const handleTrackDown = (e: React.MouseEvent) => {
    const val = valFromX(e.clientX)
    if (val === null) return
    if (Math.abs(val - low) <= Math.abs(val - high)) {
      const next = clamp(val, min, high - step)
      setLow(next); onChange?.(next, high); setActive('low')
    } else {
      const next = clamp(val, low + step, max)
      setHigh(next); onChange?.(low, next); setActive('high')
    }
  }

  const stepKey = (thumb: 'low' | 'high') => (e: React.KeyboardEvent) => {
    const delta = e.shiftKey ? step * 10 : step
    if (thumb === 'low') {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setLow(v => { const n = clamp(snap(v - delta, step), min, high - step); onChange?.(n, high); return n })
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setLow(v => { const n = clamp(snap(v + delta, step), min, high - step); onChange?.(n, high); return n })
      }
    } else {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setHigh(v => { const n = clamp(snap(v - delta, step), low + step, max); onChange?.(low, n); return n })
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setHigh(v => { const n = clamp(snap(v + delta, step), low + step, max); onChange?.(low, n); return n })
      }
    }
  }

  const fillLeft = lowPct + '%'
  const fillRight = (100 - highPct) + '%'

  return (
    <div style={{ padding: '22px 10px 4px', userSelect: 'none', fontFamily: font }}>
      <div
        ref={trackRef}
        onMouseDown={handleTrackDown}
        style={{
          position: 'relative',
          height: 4,
          background: 'rgba(0,0,0,0.08)',
          borderRadius: 2,
          cursor: 'pointer',
        }}
      >
        {/* Filled range */}
        <div style={{
          position: 'absolute',
          top: 0, bottom: 0,
          left: fillLeft,
          right: fillRight,
          background: '#0a0a0a',
          borderRadius: 2,
          transition: active ? 'none' : 'left 0.06s ease, right 0.06s ease',
        }} />

        {/* Thumbs */}
        {(['low', 'high'] as const).map(thumb => {
          const pct = thumb === 'low' ? lowPct : highPct
          const val = thumb === 'low' ? low : high
          const isDragging = active === thumb
          const left = pct + '%'
          const tooltipTransform = isDragging
            ? 'translateX(-50%) translateY(0px)'
            : 'translateX(-50%) translateY(3px)'

          return (
            <div
              key={thumb}
              style={{
                position: 'absolute',
                top: '50%',
                left: left,
                transform: 'translate(-50%, -50%)',
                zIndex: thumb === 'high' ? 2 : 1,
              }}
            >
              {/* Floating tooltip */}
              <div style={{
                position: 'absolute',
                bottom: 'calc(100% + 10px)',
                left: '50%',
                transform: tooltipTransform,
                background: '#0a0a0a',
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 5,
                whiteSpace: 'nowrap' as const,
                letterSpacing: '-0.01em',
                pointerEvents: 'none' as const,
                opacity: isDragging ? 1 : 0,
                transition: 'opacity 0.12s ease, transform 0.12s ease',
              }}>
                {formatValue(val)}
                <div style={{
                  position: 'absolute',
                  top: '100%', left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0, height: 0,
                  borderLeft: '3.5px solid transparent',
                  borderRight: '3.5px solid transparent',
                  borderTop: '3.5px solid #0a0a0a',
                }} />
              </div>

              {/* Handle */}
              <div
                tabIndex={0}
                role="slider"
                aria-valuenow={val}
                aria-valuemin={min}
                aria-valuemax={max}
                onMouseDown={e => { e.stopPropagation(); setActive(thumb) }}
                onTouchStart={e => { e.stopPropagation(); setActive(thumb) }}
                onKeyDown={stepKey(thumb)}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#fff',
                  border: '1.5px solid rgba(0,0,0,0.14)',
                  boxShadow: isDragging
                    ? '0 0 0 4px rgba(0,0,0,0.07), 0 2px 10px rgba(0,0,0,0.18)'
                    : '0 1px 3px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.08)',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  outline: 'none',
                  touchAction: 'none' as const,
                  transition: 'box-shadow 0.15s ease',
                }}
                onFocus={e => {
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.12)'
                }}
                onBlur={e => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.08)'
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Demo ──────────────────────────────────────────────────────────────────────

function Demo() {
  const [price, setPrice] = useState({ low: 80, high: 420 })
  const [nights, setNights] = useState({ low: 2, high: 7 })
  const [guests, setGuests] = useState({ low: 1, high: 6 })
  const [applied, setApplied] = useState(false)

  const handleApply = () => {
    setApplied(true)
    setTimeout(() => setApplied(false), 1800)
  }

  const formatPrice = (v: number) => '$' + v
  const formatNights = (v: number) => v === 1 ? '1 night' : v + ' nights'
  const formatGuests = (v: number) => v === 1 ? '1 guest' : v + ' guests'

  const resultCount = Math.round(
    ((price.high - price.low) / 50) *
    ((nights.high - nights.low) / 2) *
    ((guests.high - guests.low) / 2) +
    8
  )

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
      padding: '40px 24px',
      fontFamily: font,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 380,
        background: '#fff',
        borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)',
        overflow: 'visible',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
              Filters
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.35)', marginTop: 2, letterSpacing: '-0.01em' }}>
              Drag handles or click the track
            </div>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 600,
            color: 'rgba(0,0,0,0.4)',
            background: 'rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: 20, padding: '4px 10px',
            letterSpacing: '-0.01em',
          }}>
            {resultCount} stays
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '16px 0 0' }} />

        {/* Price section */}
        <div style={{ padding: '16px 20px 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
              Price / night
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
              {'$' + price.low} – {'$' + price.high}
            </div>
          </div>
          <RangeSlider
            min={0}
            max={600}
            step={10}
            defaultLow={80}
            defaultHigh={420}
            formatValue={formatPrice}
            onChange={(lo, hi) => setPrice({ low: lo, high: hi })}
          />
          {/* Histogram bars decorative */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 28, margin: '6px 0 0', opacity: 0.15 }}>
            {[3,5,8,12,18,24,28,22,16,20,25,19,14,10,7,5,4,3,2,1].map((h, i) => (
              <div key={i} style={{
                flex: 1,
                height: (h / 28 * 100) + '%',
                background: '#0a0a0a',
                borderRadius: '1.5px 1.5px 0 0',
              }} />
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '8px 0 0' }} />

        {/* Nights section */}
        <div style={{ padding: '16px 20px 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
              Stay length
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
              {nights.low}–{nights.high} nights
            </div>
          </div>
          <RangeSlider
            min={1}
            max={30}
            step={1}
            defaultLow={2}
            defaultHigh={7}
            formatValue={formatNights}
            onChange={(lo, hi) => setNights({ low: lo, high: hi })}
          />
        </div>

        <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '8px 0 0' }} />

        {/* Guests section */}
        <div style={{ padding: '16px 20px 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
              Guests
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
              {guests.low}–{guests.high} guests
            </div>
          </div>
          <RangeSlider
            min={1}
            max={16}
            step={1}
            defaultLow={1}
            defaultHigh={6}
            formatValue={formatGuests}
            onChange={(lo, hi) => setGuests({ low: lo, high: hi })}
          />
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px 20px', display: 'flex', gap: 8 }}>
          <button
            style={{
              flex: 1,
              padding: '10px 16px',
              background: applied ? '#059669' : '#0a0a0a',
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              fontFamily: 'inherit',
              transition: 'background 0.25s ease',
            }}
            onClick={handleApply}
          >
            {applied ? '✓ Applied' : 'Apply filters'}
          </button>
          <button
            style={{
              padding: '10px 14px',
              background: 'transparent',
              border: '1px solid rgba(0,0,0,0.09)',
              borderRadius: 10,
              color: 'rgba(0,0,0,0.5)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              fontFamily: 'inherit',
              transition: 'background 0.15s ease, color 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#0a0a0a' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(0,0,0,0.5)' }}
            onClick={() => {
              setPrice({ low: 80, high: 420 })
              setNights({ low: 2, high: 7 })
              setGuests({ low: 1, high: 6 })
            }}
          >
            Reset
          </button>
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

// ── Code source ───────────────────────────────────────────────────────────────

const CODE_SOURCE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v))
}

function snap(v, step) {
  return Math.round(v / step) * step
}

export function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  defaultLow,
  defaultHigh,
  formatValue = (v) => String(v),
  onChange,
}) {
  const [low, setLow] = useState(defaultLow ?? min)
  const [high, setHigh] = useState(defaultHigh ?? max)
  const [active, setActive] = useState(null) // 'low' | 'high' | null
  const trackRef = useRef(null)

  const lowPct = ((low - min) / (max - min)) * 100
  const highPct = ((high - min) / (max - min)) * 100

  const valFromX = useCallback(
    (clientX) => {
      if (!trackRef.current) return null
      const { left, width } = trackRef.current.getBoundingClientRect()
      return snap(min + clamp((clientX - left) / width, 0, 1) * (max - min), step)
    },
    [min, max, step],
  )

  useEffect(() => {
    if (!active) return
    const onMove = (e) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const val = valFromX(clientX)
      if (val === null) return
      if (active === 'low') {
        const next = clamp(val, min, high - step)
        setLow(next); onChange?.(next, high)
      } else {
        const next = clamp(val, low + step, max)
        setHigh(next); onChange?.(low, next)
      }
    }
    const onUp = () => setActive(null)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [active, low, high, min, max, step, onChange, valFromX])

  const handleTrackDown = (e) => {
    const val = valFromX(e.clientX)
    if (val === null) return
    if (Math.abs(val - low) <= Math.abs(val - high)) {
      const next = clamp(val, min, high - step)
      setLow(next); onChange?.(next, high); setActive('low')
    } else {
      const next = clamp(val, low + step, max)
      setHigh(next); onChange?.(low, next); setActive('high')
    }
  }

  const stepKey = (thumb) => (e) => {
    const delta = e.shiftKey ? step * 10 : step
    if (thumb === 'low') {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setLow(v => { const n = clamp(snap(v - delta, step), min, high - step); onChange?.(n, high); return n })
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setLow(v => { const n = clamp(snap(v + delta, step), min, high - step); onChange?.(n, high); return n })
      }
    } else {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setHigh(v => { const n = clamp(snap(v - delta, step), low + step, max); onChange?.(low, n); return n })
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setHigh(v => { const n = clamp(snap(v + delta, step), low + step, max); onChange?.(low, n); return n })
      }
    }
  }

  const fillLeft = lowPct + '%'
  const fillRight = (100 - highPct) + '%'

  return (
    <div style={{ padding: '22px 10px 4px', userSelect: 'none', fontFamily: font }}>
      <div
        ref={trackRef}
        onMouseDown={handleTrackDown}
        style={{
          position: 'relative',
          height: 4,
          background: 'rgba(0,0,0,0.08)',
          borderRadius: 2,
          cursor: 'pointer',
        }}
      >
        {/* Filled range */}
        <div style={{
          position: 'absolute',
          top: 0, bottom: 0,
          left: fillLeft,
          right: fillRight,
          background: '#0a0a0a',
          borderRadius: 2,
          transition: active ? 'none' : 'left 0.06s ease, right 0.06s ease',
        }} />

        {/* Thumbs */}
        {['low', 'high'].map(thumb => {
          const pct = thumb === 'low' ? lowPct : highPct
          const val = thumb === 'low' ? low : high
          const isDragging = active === thumb
          const left = pct + '%'
          const tooltipTransform = isDragging
            ? 'translateX(-50%) translateY(0px)'
            : 'translateX(-50%) translateY(3px)'

          return (
            <div
              key={thumb}
              style={{
                position: 'absolute',
                top: '50%',
                left: left,
                transform: 'translate(-50%, -50%)',
                zIndex: thumb === 'high' ? 2 : 1,
              }}
            >
              {/* Floating tooltip */}
              <div style={{
                position: 'absolute',
                bottom: 'calc(100% + 10px)',
                left: '50%',
                transform: tooltipTransform,
                background: '#0a0a0a',
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 5,
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em',
                pointerEvents: 'none',
                opacity: isDragging ? 1 : 0,
                transition: 'opacity 0.12s ease, transform 0.12s ease',
              }}>
                {formatValue(val)}
                <div style={{
                  position: 'absolute',
                  top: '100%', left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0, height: 0,
                  borderLeft: '3.5px solid transparent',
                  borderRight: '3.5px solid transparent',
                  borderTop: '3.5px solid #0a0a0a',
                }} />
              </div>

              {/* Handle */}
              <div
                tabIndex={0}
                role="slider"
                aria-valuenow={val}
                aria-valuemin={min}
                aria-valuemax={max}
                onMouseDown={e => { e.stopPropagation(); setActive(thumb) }}
                onTouchStart={e => { e.stopPropagation(); setActive(thumb) }}
                onKeyDown={stepKey(thumb)}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#fff',
                  border: '1.5px solid rgba(0,0,0,0.14)',
                  boxShadow: isDragging
                    ? '0 0 0 4px rgba(0,0,0,0.07), 0 2px 10px rgba(0,0,0,0.18)'
                    : '0 1px 3px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.08)',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  outline: 'none',
                  touchAction: 'none',
                  transition: 'box-shadow 0.15s ease',
                }}
                onFocus={e => {
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.12)'
                }}
                onBlur={e => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.08)'
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Usage
export default function App() {
  const [price, setPrice] = useState({ low: 80, high: 420 })

  return (
    <div style={{ padding: 24, maxWidth: 380, fontFamily: font }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
        Price per night: \${price.low} – \${price.high}
      </div>
      <RangeSlider
        min={0} max={600} step={10}
        defaultLow={80} defaultHigh={420}
        formatValue={v => '\$' + v}
        onChange={(lo, hi) => setPrice({ low: lo, high: hi })}
      />
    </div>
  )
}`

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RangeSliderPage() {
  return (
    <div style={{ background: '#fff' }}>
      {/* DEMO */}
      <Demo />

      {/* CODE */}
      <div style={{ background: '#0a0a0a', padding: 'clamp(24px, 4vw, 48px)' as any, fontFamily: font }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>
                Range Slider
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                Drop into any React project — zero dependencies
              </div>
            </div>
            <CopyButton text={CODE_SOURCE} />
          </div>

          <div style={{ background: '#111', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              padding: '10px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center',
            }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontFamily: 'ui-monospace, monospace' }}>
                RangeSlider.tsx
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
