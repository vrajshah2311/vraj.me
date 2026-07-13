'use client'

import { useState, useRef, useEffect } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_ABBRS = ['Su','Mo','Tu','We','Th','Fr','Sa']

function getDim(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function getFirst(y: number, m: number) { return new Date(y, m, 1).getDay() }
function fmtShort(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function daysBetween(a: Date, b: Date) {
  return Math.round(Math.abs(b.getTime() - a.getTime()) / 86400000)
}

// ── DayCell ───────────────────────────────────────────────────────────────────

function DayCell({
  day, selected, isToday, onClick,
}: { day: number; selected: boolean; isToday: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', width: '100%', aspectRatio: '1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', cursor: 'pointer', borderRadius: 8,
        fontSize: 12.5, fontWeight: selected ? 600 : 400, fontFamily: 'inherit',
        color: selected ? '#fff' : '#0a0a0a',
        background: selected ? '#0a0a0a' : hov ? 'rgba(0,0,0,0.06)' : 'transparent',
        transition: 'background 0.12s ease',
      }}
    >
      {day}
      {isToday && !selected && (
        <span style={{
          position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)',
          width: 3, height: 3, borderRadius: '50%', background: '#0a0a0a', display: 'block',
        }} />
      )}
    </button>
  )
}

// ── NavBtn ────────────────────────────────────────────────────────────────────

function NavBtn({ onClick, dir }: { onClick: () => void; dir: 'prev' | 'next' }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', borderRadius: 7, cursor: 'pointer',
        background: hov ? 'rgba(0,0,0,0.06)' : 'transparent',
        transition: 'background 0.12s ease',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d={dir === 'prev' ? 'M9 3.5L5.5 7L9 10.5' : 'M5 3.5L8.5 7L5 10.5'}
          stroke="rgba(0,0,0,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

// ── TextBtn ───────────────────────────────────────────────────────────────────

function TextBtn({ label, onClick }: { label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: 'none', background: 'none', cursor: 'pointer',
        fontFamily: font, fontSize: 11.5, fontWeight: 500,
        letterSpacing: '-0.01em', padding: '2px 0',
        color: hov ? '#0a0a0a' : 'rgba(0,0,0,0.4)',
        transition: 'color 0.12s ease',
      }}
    >
      {label}
    </button>
  )
}

// ── DatePicker ────────────────────────────────────────────────────────────────

function DatePicker({
  value, onChange, placeholder = 'Pick a date',
}: {
  value: Date | null
  onChange: (d: Date | null) => void
  placeholder?: string
}) {
  const today = new Date()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [viewYear, setViewYear] = useState(() => (value ?? today).getFullYear())
  const [viewMonth, setViewMonth] = useState(() => (value ?? today).getMonth())
  const [dir, setDir] = useState<'next' | 'prev'>('next')
  const [calKey, setCalKey] = useState(0)
  const [navigated, setNavigated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), 220)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const navigate = (d: 'prev' | 'next') => {
    setNavigated(true)
    setDir(d)
    setCalKey(k => k + 1)
    if (d === 'next') {
      if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
      else setViewMonth(m => m + 1)
    } else {
      if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
      else setViewMonth(m => m - 1)
    }
  }

  const dim = getDim(viewYear, viewMonth)
  const first = getFirst(viewYear, viewMonth)
  const isSelected = (day: number) =>
    !!value && value.getFullYear() === viewYear && value.getMonth() === viewMonth && value.getDate() === day
  const isTod = (day: number) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', fontFamily: font }}>
      <style>{`
        @keyframes dp-right { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes dp-left  { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '8px 13px',
          background: '#fff',
          border: `1px solid ${open ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.11)'}`,
          borderRadius: 10, cursor: 'pointer',
          fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
          color: value ? '#0a0a0a' : 'rgba(0,0,0,0.38)',
          letterSpacing: '-0.01em',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow: open
            ? '0 0 0 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
            : '0 1px 2px rgba(0,0,0,0.05)',
          whiteSpace: 'nowrap' as const,
          minWidth: 148,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{ flexShrink: 0, color: 'rgba(0,0,0,0.38)' }}>
          <rect x="1.5" y="2.5" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M1.5 5.5h11" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M4.5 1v2.5M9.5 1v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <span style={{ flex: 1 }}>{value ? fmtShort(value) : placeholder}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{
          flexShrink: 0, color: 'rgba(0,0,0,0.3)',
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s ease',
        }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Calendar popover */}
      {mounted && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 50,
          background: '#fff',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 14,
          boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.12)',
          padding: '12px', width: 252,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.97)',
          transformOrigin: 'top left',
          transition: 'opacity 0.18s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* Month nav */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10,
          }}>
            <NavBtn onClick={() => navigate('prev')} dir="prev" />
            <div style={{
              fontSize: 13, fontWeight: 600, color: '#0a0a0a',
              letterSpacing: '-0.02em', userSelect: 'none' as const,
            }}>
              {MONTHS[viewMonth]} {viewYear}
            </div>
            <NavBtn onClick={() => navigate('next')} dir="next" />
          </div>

          {/* Day-of-week headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 3 }}>
            {DAY_ABBRS.map(d => (
              <div key={d} style={{
                textAlign: 'center' as const, fontSize: 10, fontWeight: 600,
                color: 'rgba(0,0,0,0.28)', letterSpacing: '0.05em', padding: '3px 0',
              }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid with slide-in animation */}
          <div style={{ overflow: 'hidden' }}>
            <div
              key={calKey}
              style={{
                display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2,
                ...(navigated ? {
                  animation: `${dir === 'next' ? 'dp-right' : 'dp-left'} 0.2s cubic-bezier(0.16,1,0.3,1) both`,
                } : {}),
              }}
            >
              {Array.from({ length: first }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: dim }).map((_, i) => {
                const day = i + 1
                return (
                  <DayCell
                    key={day} day={day}
                    selected={isSelected(day)}
                    isToday={isTod(day)}
                    onClick={() => {
                      onChange(new Date(viewYear, viewMonth, day))
                      setOpen(false)
                    }}
                  />
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 8, paddingTop: 8,
            borderTop: '1px solid rgba(0,0,0,0.06)',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <TextBtn label="Today" onClick={() => { onChange(today); setOpen(false) }} />
            {value && <TextBtn label="Clear" onClick={() => { onChange(null); setOpen(false) }} />}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Demo ──────────────────────────────────────────────────────────────────────

function Demo() {
  const [checkin, setCheckin] = useState<Date | null>(null)
  const [checkout, setCheckout] = useState<Date | null>(null)

  const validRange = checkin && checkout && checkout > checkin
  const nights = validRange ? daysBetween(checkin, checkout) : null

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
      padding: '60px 24px',
      fontFamily: font,
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Card */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)',
          overflow: 'visible',
        }}>
          {/* Header */}
          <div style={{ padding: '18px 20px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'rgba(0,0,0,0.35)' }}>
                <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6c0 3.75 4.5 8.5 4.5 8.5s4.5-4.75 4.5-8.5c0-2.49-2.01-4.5-4.5-4.5z"
                  stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                Tokyo, Japan
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', fontWeight: 500, marginTop: 3, letterSpacing: '-0.01em' }}>
              Select your travel dates
            </div>
          </div>

          {/* Date pickers */}
          <div style={{ padding: '16px 20px 0' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 10.5, fontWeight: 600, color: 'rgba(0,0,0,0.32)',
                  letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                  marginBottom: 6,
                }}>
                  Check-in
                </div>
                <DatePicker value={checkin} onChange={setCheckin} placeholder="Select date" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 10.5, fontWeight: 600, color: 'rgba(0,0,0,0.32)',
                  letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                  marginBottom: 6,
                }}>
                  Check-out
                </div>
                <DatePicker value={checkout} onChange={setCheckout} placeholder="Select date" />
              </div>
            </div>

            {/* Duration summary */}
            <div style={{
              margin: '14px 0 0',
              padding: '12px 14px',
              borderRadius: 10,
              background: validRange ? 'rgba(0,0,0,0.025)' : 'rgba(0,0,0,0.02)',
              border: '1px solid rgba(0,0,0,0.05)',
              minHeight: 46,
              display: 'flex', alignItems: 'center',
              transition: 'background 0.2s ease',
            }}>
              {validRange ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    fontSize: 22, fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.04em',
                    lineHeight: 1,
                  }}>
                    {nights}
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.015em' }}>
                      {nights === 1 ? 'night' : 'nights'}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.38)', letterSpacing: '-0.01em', marginTop: 1 }}>
                      {fmtShort(checkin!)} → {fmtShort(checkout!)}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.28)', letterSpacing: '-0.01em' }}>
                  {!checkin && !checkout
                    ? 'Pick check-in and check-out dates'
                    : !checkin
                    ? 'Select a check-in date'
                    : !checkout
                    ? 'Now select a check-out date'
                    : 'Check-out must be after check-in'}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '14px 20px 18px' }}>
            <button
              style={{
                width: '100%', padding: '11px',
                background: validRange ? '#0a0a0a' : 'rgba(0,0,0,0.06)',
                border: 'none', borderRadius: 10,
                fontSize: 13.5, fontWeight: 600, fontFamily: font,
                color: validRange ? '#fff' : 'rgba(0,0,0,0.28)',
                letterSpacing: '-0.015em',
                cursor: validRange ? 'pointer' : 'default',
                transition: 'background 0.18s ease, color 0.18s ease',
              }}
            >
              Search availability
            </button>
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

import { useState, useRef, useEffect } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_ABBRS = ['Su','Mo','Tu','We','Th','Fr','Sa']

function getDim(y, m) { return new Date(y, m + 1, 0).getDate() }
function getFirst(y, m) { return new Date(y, m, 1).getDay() }
function fmtShort(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function DayCell({ day, selected, isToday, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', width: '100%', aspectRatio: '1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', cursor: 'pointer', borderRadius: 8,
        fontSize: 12.5, fontWeight: selected ? 600 : 400, fontFamily: 'inherit',
        color: selected ? '#fff' : '#0a0a0a',
        background: selected ? '#0a0a0a' : hov ? 'rgba(0,0,0,0.06)' : 'transparent',
        transition: 'background 0.12s ease',
      }}
    >
      {day}
      {isToday && !selected && (
        <span style={{
          position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)',
          width: 3, height: 3, borderRadius: '50%', background: '#0a0a0a', display: 'block',
        }} />
      )}
    </button>
  )
}

function NavBtn({ onClick, dir }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', borderRadius: 7, cursor: 'pointer',
        background: hov ? 'rgba(0,0,0,0.06)' : 'transparent',
        transition: 'background 0.12s ease',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d={dir === 'prev' ? 'M9 3.5L5.5 7L9 10.5' : 'M5 3.5L8.5 7L5 10.5'}
          stroke="rgba(0,0,0,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

function TextBtn({ label, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: 'none', background: 'none', cursor: 'pointer',
        fontFamily: font, fontSize: 11.5, fontWeight: 500,
        letterSpacing: '-0.01em', padding: '2px 0',
        color: hov ? '#0a0a0a' : 'rgba(0,0,0,0.4)',
        transition: 'color 0.12s ease',
      }}
    >
      {label}
    </button>
  )
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date' }) {
  const today = new Date()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [viewYear, setViewYear] = useState(() => (value ?? today).getFullYear())
  const [viewMonth, setViewMonth] = useState(() => (value ?? today).getMonth())
  const [dir, setDir] = useState('next')
  const [calKey, setCalKey] = useState(0)
  const [navigated, setNavigated] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), 220)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const navigate = (d) => {
    setNavigated(true)
    setDir(d)
    setCalKey(k => k + 1)
    if (d === 'next') {
      if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
      else setViewMonth(m => m + 1)
    } else {
      if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
      else setViewMonth(m => m - 1)
    }
  }

  const dim = getDim(viewYear, viewMonth)
  const first = getFirst(viewYear, viewMonth)
  const isSelected = (day) =>
    !!value && value.getFullYear() === viewYear && value.getMonth() === viewMonth && value.getDate() === day
  const isTod = (day) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', fontFamily: font }}>
      <style>{\`
        @keyframes dp-right { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes dp-left  { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
      \`}</style>

      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 13px',
          background: '#fff', border: \`1px solid \${open ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.11)'}\`,
          borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 500,
          fontFamily: 'inherit', color: value ? '#0a0a0a' : 'rgba(0,0,0,0.38)',
          letterSpacing: '-0.01em', whiteSpace: 'nowrap', minWidth: 148,
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow: open
            ? '0 0 0 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
            : '0 1px 2px rgba(0,0,0,0.05)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{ flexShrink: 0, color: 'rgba(0,0,0,0.38)' }}>
          <rect x="1.5" y="2.5" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M1.5 5.5h11" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M4.5 1v2.5M9.5 1v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <span style={{ flex: 1 }}>{value ? fmtShort(value) : placeholder}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{
          flexShrink: 0, color: 'rgba(0,0,0,0.3)',
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s ease',
        }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {mounted && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 50,
          background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14,
          boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.12)',
          padding: '12px', width: 252,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.97)',
          transformOrigin: 'top left',
          transition: 'opacity 0.18s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 10,
          }}>
            <NavBtn onClick={() => navigate('prev')} dir="prev" />
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a',
              letterSpacing: '-0.02em', userSelect: 'none' }}>
              {MONTHS[viewMonth]} {viewYear}
            </div>
            <NavBtn onClick={() => navigate('next')} dir="next" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 3 }}>
            {DAY_ABBRS.map(d => (
              <div key={d} style={{
                textAlign: 'center', fontSize: 10, fontWeight: 600,
                color: 'rgba(0,0,0,0.28)', letterSpacing: '0.05em', padding: '3px 0',
              }}>{d}</div>
            ))}
          </div>

          <div style={{ overflow: 'hidden' }}>
            <div
              key={calKey}
              style={{
                display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2,
                ...(navigated ? {
                  animation: \`\${dir === 'next' ? 'dp-right' : 'dp-left'} 0.2s cubic-bezier(0.16,1,0.3,1) both\`,
                } : {}),
              }}
            >
              {Array.from({ length: first }).map((_, i) => <div key={\`e\${i}\`} />)}
              {Array.from({ length: dim }).map((_, i) => {
                const day = i + 1
                return (
                  <DayCell
                    key={day} day={day}
                    selected={isSelected(day)}
                    isToday={isTod(day)}
                    onClick={() => { onChange(new Date(viewYear, viewMonth, day)); setOpen(false) }}
                  />
                )
              })}
            </div>
          </div>

          <div style={{
            marginTop: 8, paddingTop: 8,
            borderTop: '1px solid rgba(0,0,0,0.06)',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <TextBtn label="Today" onClick={() => { onChange(today); setOpen(false) }} />
            {value && <TextBtn label="Clear" onClick={() => { onChange(null); setOpen(false) }} />}
          </div>
        </div>
      )}
    </div>
  )
}

// Usage
export default function App() {
  const [date, setDate] = useState(null)
  return (
    <div style={{ padding: 32, fontFamily: '-apple-system, sans-serif' }}>
      <DatePicker value={date} onChange={setDate} placeholder="Pick a date" />
      {date && (
        <p style={{ marginTop: 12, fontSize: 13, color: 'rgba(0,0,0,0.5)' }}>
          Selected: {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      )}
    </div>
  )
}`

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DatePickerPage() {
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
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <div>
              <div style={{
                fontSize: 16, fontWeight: 600, color: '#fff',
                letterSpacing: '-0.02em', marginBottom: 2,
              }}>
                Date Picker
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
              display: 'flex', alignItems: 'center',
            }}>
              <div style={{
                fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500,
                fontFamily: 'ui-monospace, monospace',
              }}>
                DatePicker.tsx
              </div>
            </div>
            <pre style={{
              margin: 0, padding: '20px',
              overflowX: 'auto',
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
