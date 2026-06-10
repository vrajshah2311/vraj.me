'use client'

import { useState, useRef, useEffect } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'
const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']
const STAR = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
let _uid = 0

// ─── PartialStar ──────────────────────────────────────────────────────────────

function PartialStar({ filled, size }: { filled: number; size: number }) {
  const id = useRef('pstar' + (++_uid)).current
  const v = Math.min(1, Math.max(0, filled))
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
      {v > 0 && v < 1 && (
        <defs>
          <linearGradient id={id}>
            <stop offset={v * 100 + '%'} stopColor="#f59e0b" />
            <stop offset={v * 100 + '%'} stopColor="rgba(10,10,10,0.1)" />
          </linearGradient>
        </defs>
      )}
      <path
        d={STAR}
        fill={v >= 1 ? '#f59e0b' : v <= 0 ? 'rgba(10,10,10,0.1)' : 'url(#' + id + ')'}
      />
    </svg>
  )
}

// ─── StarDisplay ──────────────────────────────────────────────────────────────

function StarDisplay({
  value,
  size = 16,
  showValue = true,
  reviewCount,
}: {
  value: number
  size?: number
  showValue?: boolean
  reviewCount?: number
}) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      {showValue && (
        <span style={{
          fontSize: Math.max(11, size) + 'px',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: '#0a0a0a',
          fontFamily: FONT,
          lineHeight: 1,
        }}>
          {value.toFixed(1)}
        </span>
      )}
      <div style={{ display: 'flex', gap: '1px' }}>
        {[0, 1, 2, 3, 4].map(i => (
          <PartialStar key={i} filled={Math.min(1, Math.max(0, value - i))} size={size} />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span style={{
          fontSize: '11px',
          color: 'rgba(10,10,10,0.4)',
          letterSpacing: '-0.01em',
          fontFamily: FONT,
        }}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  )
}

// ─── StarRating ───────────────────────────────────────────────────────────────

function StarRating({
  value = 0,
  onChange,
  size = 'md',
  disabled = false,
}: {
  value?: number
  onChange?: (v: number) => void
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}) {
  const [hover, setHover] = useState(0)
  const [popped, setPopped] = useState(-1)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const px = size === 'sm' ? 18 : size === 'lg' ? 38 : 28
  const gap = size === 'sm' ? '2px' : size === 'lg' ? '6px' : '4px'
  const disp = hover || value

  const click = (i: number) => {
    if (disabled) return
    onChange?.(i === value ? 0 : i)
    setPopped(i)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setPopped(-1), 400)
  }

  return (
    <>
      <style>{`@keyframes _sp{0%{transform:scale(1)}35%{transform:scale(1.42)}70%{transform:scale(0.88)}100%{transform:scale(1)}}`}</style>
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '10px', alignItems: 'center', userSelect: 'none' as const }}>
        <div style={{ display: 'flex', gap }}>
          {[1, 2, 3, 4, 5].map(i => (
            <button
              key={i}
              onClick={() => click(i)}
              onMouseEnter={() => !disabled && setHover(i)}
              onMouseLeave={() => !disabled && setHover(0)}
              disabled={disabled}
              aria-label={i + ' star' + (i > 1 ? 's' : '')}
              style={{
                background: 'none',
                border: 'none',
                padding: size === 'sm' ? '2px' : '4px',
                cursor: disabled ? 'default' : 'pointer',
                outline: 'none',
                animation: popped === i ? '_sp 380ms cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none',
                transform: popped !== i && hover === i ? 'scale(1.18)' : 'scale(1)',
                transition: 'transform 150ms cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              <svg
                width={px}
                height={px}
                viewBox="0 0 24 24"
                style={{ display: 'block', pointerEvents: 'none' as const }}
              >
                <path
                  d={STAR}
                  fill={i <= disp ? '#f59e0b' : 'rgba(10,10,10,0.1)'}
                  style={{ transition: 'fill 100ms ease' }}
                />
              </svg>
            </button>
          ))}
        </div>
        {size !== 'sm' && (
          <span style={{
            fontSize: size === 'lg' ? '13px' : '11px',
            fontWeight: 500,
            color: disp > 0 ? '#0a0a0a' : 'rgba(10,10,10,0.3)',
            letterSpacing: '-0.01em',
            fontFamily: FONT,
            transition: 'color 150ms ease',
            minWidth: '60px',
            textAlign: 'center' as const,
          }}>
            {LABELS[disp] ?? ''}
          </span>
        )}
      </div>
    </>
  )
}

// ─── Demo: Interactive ─────────────────────────────────────────────────────────

function InteractiveDemo() {
  const [rating, setRating] = useState(0)

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      width: '290px',
      maxWidth: '100%',
    }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', fontFamily: FONT }}>
          Rate this component
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(10,10,10,0.45)', marginTop: '3px', letterSpacing: '-0.01em', fontFamily: FONT }}>
          How would you rate the code quality?
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        padding: '10px 12px',
        background: rating > 0 ? 'rgba(16,163,74,0.05)' : 'rgba(10,10,10,0.025)',
        border: '1px solid ' + (rating > 0 ? 'rgba(16,163,74,0.15)' : 'rgba(10,10,10,0.06)'),
        borderRadius: '10px',
        transition: 'all 220ms ease',
      }}>
        <span style={{ fontSize: '13px', lineHeight: 1 }}>
          {rating > 0 ? '✓' : '○'}
        </span>
        <span style={{
          fontSize: '12px',
          fontWeight: 500,
          color: rating > 0 ? '#16a34a' : 'rgba(10,10,10,0.35)',
          letterSpacing: '-0.01em',
          fontFamily: FONT,
          transition: 'color 220ms ease',
        }}>
          {rating > 0 ? 'Thanks for the rating!' : 'Your rating is anonymous'}
        </span>
      </div>
    </div>
  )
}

// ─── Demo: Review Summary ──────────────────────────────────────────────────────

const BREAKDOWN = [
  { stars: 5, pct: 72, count: 2048 },
  { stars: 4, pct: 18, count: 511 },
  { stars: 3, pct: 6,  count: 171 },
  { stars: 2, pct: 3,  count: 85  },
  { stars: 1, pct: 1,  count: 32  },
]

function ReviewSummary() {
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150)
    return () => clearTimeout(t)
  }, [])

  const total = BREAKDOWN.reduce((s, r) => s + r.count, 0)

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      padding: '20px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      width: '290px',
      maxWidth: '100%',
    }}>
      <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: 'rgba(10,10,10,0.35)', fontFamily: FONT, marginBottom: '12px' }}>
        Community Rating
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '18px' }}>
        <span style={{ fontSize: '44px', fontWeight: 700, letterSpacing: '-0.04em', color: '#0a0a0a', lineHeight: 1, fontFamily: FONT }}>
          4.8
        </span>
        <div style={{ paddingBottom: '4px' }}>
          <StarDisplay value={4.8} size={15} showValue={false} />
          <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.4)', marginTop: '3px', letterSpacing: '-0.01em', fontFamily: FONT }}>
            {total.toLocaleString()} reviews
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
        {BREAKDOWN.map((r, idx) => (
          <div key={r.stars} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em', fontFamily: FONT, width: '10px', textAlign: 'right' as const, flexShrink: 0 }}>
              {r.stars}
            </span>
            <svg width={10} height={10} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path d={STAR} fill="rgba(10,10,10,0.2)" />
            </svg>
            <div style={{ flex: 1, height: '5px', background: 'rgba(10,10,10,0.07)', borderRadius: '3px', overflow: 'hidden' as const }}>
              <div style={{
                height: '100%',
                width: animated ? r.pct + '%' : '0%',
                background: '#f59e0b',
                borderRadius: '3px',
                transition: 'width 550ms cubic-bezier(0.4,0,0.2,1) ' + (idx * 60) + 'ms',
              }} />
            </div>
            <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.35)', letterSpacing: '-0.01em', fontFamily: FONT, width: '24px', flexShrink: 0, textAlign: 'right' as const }}>
              {r.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Demo: Size Variants ───────────────────────────────────────────────────────

function SizeVariants() {
  const [ratings, setRatings] = useState<Record<string, number>>({ sm: 4, md: 3, lg: 5 })

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      padding: '20px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      width: '290px',
      maxWidth: '100%',
    }}>
      <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: 'rgba(10,10,10,0.35)', fontFamily: FONT, marginBottom: '18px' }}>
        Sizes
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '18px' }}>
        {(['sm', 'md', 'lg'] as const).map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.35)', letterSpacing: '0.02em', fontFamily: FONT, width: '20px', flexShrink: 0 }}>
              {s}
            </span>
            <StarRating
              value={ratings[s]}
              onChange={v => setRatings(prev => ({ ...prev, [s]: v }))}
              size={s}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(10,10,10,0.06)' }}>
        <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.3)', letterSpacing: '-0.01em', fontFamily: FONT }}>
          All interactive · click same star to clear
        </div>
      </div>
    </div>
  )
}

// ─── Code Source ───────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'
const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']
const STAR = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
let _uid = 0

// Partial-fill star for read-only decimal ratings
function PartialStar({ filled, size }: { filled: number; size: number }) {
  const id = useRef('pstar' + (++_uid)).current
  const v = Math.min(1, Math.max(0, filled))
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
      {v > 0 && v < 1 && (
        <defs>
          <linearGradient id={id}>
            <stop offset={v * 100 + '%'} stopColor="#f59e0b" />
            <stop offset={v * 100 + '%'} stopColor="rgba(10,10,10,0.1)" />
          </linearGradient>
        </defs>
      )}
      <path
        d={STAR}
        fill={v >= 1 ? '#f59e0b' : v <= 0 ? 'rgba(10,10,10,0.1)' : 'url(#' + id + ')'}
      />
    </svg>
  )
}

// Read-only display for decimal averages (e.g. 4.8)
function StarDisplay({
  value,
  size = 16,
  showValue = true,
  reviewCount,
}: {
  value: number
  size?: number
  showValue?: boolean
  reviewCount?: number
}) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      {showValue && (
        <span style={{
          fontSize: Math.max(11, size) + 'px',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: '#0a0a0a',
          fontFamily: FONT,
          lineHeight: 1,
        }}>
          {value.toFixed(1)}
        </span>
      )}
      <div style={{ display: 'flex', gap: '1px' }}>
        {[0, 1, 2, 3, 4].map(i => (
          <PartialStar key={i} filled={Math.min(1, Math.max(0, value - i))} size={size} />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span style={{ fontSize: '11px', color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em', fontFamily: FONT }}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  )
}

// Interactive star selector — click to rate, click same star to clear
function StarRating({
  value = 0,
  onChange,
  size = 'md',
  disabled = false,
}: {
  value?: number
  onChange?: (v: number) => void
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}) {
  const [hover, setHover] = useState(0)
  const [popped, setPopped] = useState(-1)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const px = size === 'sm' ? 18 : size === 'lg' ? 38 : 28
  const gap = size === 'sm' ? '2px' : size === 'lg' ? '6px' : '4px'
  const disp = hover || value

  const click = (i: number) => {
    if (disabled) return
    onChange?.(i === value ? 0 : i)
    setPopped(i)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setPopped(-1), 400)
  }

  return (
    <>
      <style>{\`@keyframes _sp{0%{transform:scale(1)}35%{transform:scale(1.42)}70%{transform:scale(0.88)}100%{transform:scale(1)}}\`}</style>
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '10px', alignItems: 'center', userSelect: 'none' }}>
        <div style={{ display: 'flex', gap }}>
          {[1, 2, 3, 4, 5].map(i => (
            <button
              key={i}
              onClick={() => click(i)}
              onMouseEnter={() => !disabled && setHover(i)}
              onMouseLeave={() => !disabled && setHover(0)}
              disabled={disabled}
              aria-label={i + ' star' + (i > 1 ? 's' : '')}
              style={{
                background: 'none',
                border: 'none',
                padding: size === 'sm' ? '2px' : '4px',
                cursor: disabled ? 'default' : 'pointer',
                outline: 'none',
                animation: popped === i ? '_sp 380ms cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none',
                transform: popped !== i && hover === i ? 'scale(1.18)' : 'scale(1)',
                transition: 'transform 150ms cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              <svg width={px} height={px} viewBox="0 0 24 24" style={{ display: 'block', pointerEvents: 'none' }}>
                <path
                  d={STAR}
                  fill={i <= disp ? '#f59e0b' : 'rgba(10,10,10,0.1)'}
                  style={{ transition: 'fill 100ms ease' }}
                />
              </svg>
            </button>
          ))}
        </div>
        {size !== 'sm' && (
          <span style={{
            fontSize: size === 'lg' ? '13px' : '11px',
            fontWeight: 500,
            color: disp > 0 ? '#0a0a0a' : 'rgba(10,10,10,0.3)',
            letterSpacing: '-0.01em',
            fontFamily: FONT,
            transition: 'color 150ms ease',
            minWidth: '60px',
            textAlign: 'center',
          }}>
            {LABELS[disp] ?? ''}
          </span>
        )}
      </div>
    </>
  )
}

// ── Usage ──
//
// const [rating, setRating] = useState(0)
//
// <StarRating value={rating} onChange={setRating} />
// <StarRating value={rating} onChange={setRating} size="lg" />
// <StarRating value={4} disabled />
//
// <StarDisplay value={4.8} reviewCount={2847} />
// <StarDisplay value={3.5} size={20} showValue={false} />`

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function StarRatingPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: '32px',
      }}>
        <div style={{ textAlign: 'center' as const }}>
          <p style={{
            margin: '0 0 4px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            color: 'rgba(10,10,10,0.35)',
            fontFamily: FONT,
          }}>
            Star Rating
          </p>
          <p style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: '#0a0a0a',
            fontFamily: FONT,
          }}>
            Rate, display & review
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap' as const,
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'rgba(10,10,10,0.3)', fontFamily: FONT }}>
              Interactive
            </p>
            <InteractiveDemo />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'rgba(10,10,10,0.3)', fontFamily: FONT }}>
              Review Summary
            </p>
            <ReviewSummary />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'rgba(10,10,10,0.3)', fontFamily: FONT }}>
              Sizes
            </p>
            <SizeVariants />
          </div>
        </div>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          color: 'rgba(10,10,10,0.4)',
          marginBottom: '12px',
          fontFamily: FONT,
        }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' as const }}>
          <pre style={{
            margin: 0,
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
            fontSize: '12px',
            lineHeight: '1.65',
            color: '#e5e5e5',
            whiteSpace: 'pre' as const,
            overflowX: 'auto' as const,
          }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
