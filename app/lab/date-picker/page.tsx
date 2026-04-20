'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function formatDate(d: Date) {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

function Calendar({
  value,
  onChange,
}: {
  value: Date | null
  onChange: (d: Date) => void
}) {
  const today = new Date()
  const [viewYear, setViewYear]   = useState(value ? value.getFullYear() : today.getFullYear())
  const [viewMonth, setViewMonth] = useState(value ? value.getMonth()    : today.getMonth())
  const [dir, setDir]             = useState<1 | -1>(1)
  const [animKey, setAnimKey]     = useState(0)
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  const navigate = (delta: 1 | -1) => {
    setDir(delta)
    setAnimKey(k => k + 1)
    let m = viewMonth + delta
    let y = viewYear
    if (m < 0)  { m = 11; y-- }
    if (m > 11) { m = 0;  y++ }
    setViewMonth(m)
    setViewYear(y)
  }

  const totalDays  = daysInMonth(viewYear, viewMonth)
  const startOffset = firstDayOfMonth(viewYear, viewMonth)
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08)',
      width: '280px',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      userSelect: 'none',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 16px 12px',
        borderBottom: '1px solid rgba(10,10,10,0.05)',
      }}>
        <NavBtn onClick={() => navigate(-1)} label="←" />
        <span style={{
          fontSize: '14px', fontWeight: 600,
          color: '#0a0a0a', letterSpacing: '-0.02em',
        }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <NavBtn onClick={() => navigate(1)} label="→" />
      </div>

      {/* Day labels */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        padding: '10px 12px 4px',
      }}>
        {DAYS.map(d => (
          <div key={d} style={{
            textAlign: 'center', fontSize: '11px', fontWeight: 600,
            color: 'rgba(10,10,10,0.35)', letterSpacing: '0.02em',
            paddingBottom: '6px',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        key={animKey}
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
          padding: '0 12px 14px',
          animation: `slideIn${dir > 0 ? 'Right' : 'Left'} 200ms cubic-bezier(0.32,0.72,0,1)`,
        }}
      >
        <style>{`
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(12px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-12px); }
            to   { opacity: 1; transform: translateX(0); }
          }
        `}</style>

        {cells.map((day, i) => {
          if (!day) return <div key={i} />

          const thisDate  = new Date(viewYear, viewMonth, day)
          const isToday   = sameDay(thisDate, today)
          const isSelected = value && sameDay(thisDate, value)
          const isHovered = hoveredDay === day

          const bg = isSelected
            ? '#0a0a0a'
            : isHovered
              ? 'rgba(10,10,10,0.06)'
              : 'transparent'

          const color = isSelected
            ? '#ffffff'
            : isToday && !isSelected
              ? '#0a0a0a'
              : 'rgba(10,10,10,0.8)'

          return (
            <div
              key={i}
              onClick={() => onChange(thisDate)}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '34px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: bg,
                transition: 'background 120ms ease, color 120ms ease',
                position: 'relative',
              }}
            >
              <span style={{
                fontSize: '13px',
                fontWeight: isSelected || isToday ? 600 : 400,
                color,
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}>
                {day}
              </span>
              {isToday && !isSelected && (
                <span style={{
                  position: 'absolute', bottom: '4px', left: '50%',
                  transform: 'translateX(-50%)',
                  width: '3px', height: '3px',
                  borderRadius: '50%',
                  background: '#0a0a0a',
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function NavBtn({ onClick, label }: { onClick: () => void; label: string }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '28px', height: '28px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', borderRadius: '7px', cursor: 'pointer',
        background: hov ? 'rgba(10,10,10,0.06)' : 'transparent',
        color: 'rgba(10,10,10,0.6)',
        fontSize: '14px', fontWeight: 500,
        transition: 'background 120ms ease',
      }}
    >
      {label}
    </button>
  )
}

// ─── DatePicker (with input trigger) ─────────────────────────────────────────

function DatePicker() {
  const [open, setOpen]     = useState(false)
  const [value, setValue]   = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => setMounted(true), 16)
      return () => clearTimeout(id)
    } else {
      setMounted(false)
    }
  }, [open])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (d: Date) => {
    setValue(d)
    setMounted(false)
    setTimeout(() => setOpen(false), 160)
  }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '9px 14px',
          background: '#ffffff',
          border: `1px solid ${open ? 'rgba(10,10,10,0.2)' : 'rgba(10,10,10,0.12)'}`,
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '13px', fontWeight: 500,
          color: value ? '#0a0a0a' : 'rgba(10,10,10,0.4)',
          letterSpacing: '-0.01em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          boxShadow: open
            ? '0 0 0 3px rgba(10,10,10,0.06)'
            : '0 1px 2px rgba(0,0,0,0.04)',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          minWidth: '200px',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalIcon />
          {value ? formatDate(value) : 'Pick a date'}
        </span>
        <ChevronIcon open={open} />
      </button>

      {/* Popover */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0,
          zIndex: 100,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(-4px)',
          transformOrigin: 'top left',
          transition: 'opacity 160ms ease, transform 160ms cubic-bezier(0.32,0.72,0,1)',
        }}>
          <Calendar value={value} onChange={handleSelect} />
        </div>
      )}
    </div>
  )
}

function CalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: 'rgba(10,10,10,0.4)' }}>
      <rect x="1" y="2.5" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 5.5h12" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 1v3M9.5 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      style={{
        color: 'rgba(10,10,10,0.35)',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 200ms ease',
        flexShrink: 0,
      }}
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function Demo() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <DatePicker />
        <p style={{
          margin: 0, fontSize: '12px',
          color: 'rgba(10,10,10,0.4)', fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}>
          Click to open · navigate months · select a date
        </p>
      </div>
    </div>
  )
}

// ─── Code ─────────────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useEffect, useRef } from 'react'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}
function formatDate(d: Date) {
  return \`\${MONTHS[d.getMonth()]} \${d.getDate()}, \${d.getFullYear()}\`
}

function NavBtn({ onClick, label }: { onClick: () => void; label: string }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '28px', height: '28px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', borderRadius: '7px', cursor: 'pointer',
        background: hov ? 'rgba(10,10,10,0.06)' : 'transparent',
        color: 'rgba(10,10,10,0.6)',
        fontSize: '14px', fontWeight: 500,
        transition: 'background 120ms ease',
      }}
    >
      {label}
    </button>
  )
}

function Calendar({ value, onChange }: { value: Date | null; onChange: (d: Date) => void }) {
  const today = new Date()
  const [viewYear, setViewYear]     = useState(value ? value.getFullYear() : today.getFullYear())
  const [viewMonth, setViewMonth]   = useState(value ? value.getMonth()    : today.getMonth())
  const [dir, setDir]               = useState<1 | -1>(1)
  const [animKey, setAnimKey]       = useState(0)
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  const navigate = (delta: 1 | -1) => {
    setDir(delta)
    setAnimKey(k => k + 1)
    let m = viewMonth + delta
    let y = viewYear
    if (m < 0)  { m = 11; y-- }
    if (m > 11) { m = 0;  y++ }
    setViewMonth(m)
    setViewYear(y)
  }

  const totalDays   = daysInMonth(viewYear, viewMonth)
  const startOffset = firstDayOfMonth(viewYear, viewMonth)
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08)',
      width: '280px',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      userSelect: 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 12px', borderBottom: '1px solid rgba(10,10,10,0.05)' }}>
        <NavBtn onClick={() => navigate(-1)} label="←" />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <NavBtn onClick={() => navigate(1)} label="→" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '10px 12px 4px' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: 'rgba(10,10,10,0.35)', letterSpacing: '0.02em', paddingBottom: '6px' }}>
            {d}
          </div>
        ))}
      </div>

      <div
        key={animKey}
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
          padding: '0 12px 14px',
          animation: \`slideIn\${dir > 0 ? 'Right' : 'Left'} 200ms cubic-bezier(0.32,0.72,0,1)\`,
        }}
      >
        <style>{\`
          @keyframes slideInRight { from { opacity:0; transform:translateX(12px); } to { opacity:1; transform:translateX(0); } }
          @keyframes slideInLeft  { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
        \`}</style>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const thisDate   = new Date(viewYear, viewMonth, day)
          const isToday    = sameDay(thisDate, today)
          const isSelected = value && sameDay(thisDate, value)
          const isHovered  = hoveredDay === day
          const bg    = isSelected ? '#0a0a0a' : isHovered ? 'rgba(10,10,10,0.06)' : 'transparent'
          const color = isSelected ? '#ffffff' : isToday && !isSelected ? '#0a0a0a' : 'rgba(10,10,10,0.8)'
          return (
            <div
              key={i}
              onClick={() => onChange(thisDate)}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '34px', borderRadius: '8px', cursor: 'pointer',
                background: bg, transition: 'background 120ms ease', position: 'relative',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: isSelected || isToday ? 600 : 400, color, letterSpacing: '-0.01em', lineHeight: 1 }}>
                {day}
              </span>
              {isToday && !isSelected && (
                <span style={{ position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)', width: '3px', height: '3px', borderRadius: '50%', background: '#0a0a0a' }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function DatePicker() {
  const [open, setOpen]       = useState(false)
  const [value, setValue]     = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => setMounted(true), 16)
      return () => clearTimeout(id)
    } else {
      setMounted(false)
    }
  }, [open])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (d: Date) => {
    setValue(d)
    setMounted(false)
    setTimeout(() => setOpen(false), 160)
  }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '9px 14px',
          background: '#ffffff',
          border: \`1px solid \${open ? 'rgba(10,10,10,0.2)' : 'rgba(10,10,10,0.12)'}\`,
          borderRadius: '10px', cursor: 'pointer',
          fontSize: '13px', fontWeight: 500,
          color: value ? '#0a0a0a' : 'rgba(10,10,10,0.4)',
          letterSpacing: '-0.01em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          boxShadow: open ? '0 0 0 3px rgba(10,10,10,0.06)' : '0 1px 2px rgba(0,0,0,0.04)',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          minWidth: '200px',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Calendar icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: 'rgba(10,10,10,0.4)' }}>
            <rect x="1" y="2.5" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M1 5.5h12" stroke="currentColor" strokeWidth="1.2" />
            <path d="M4.5 1v3M9.5 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {value ? formatDate(value) : 'Pick a date'}
        </span>
        {/* Chevron */}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: 'rgba(10,10,10,0.35)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease', flexShrink: 0 }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 100,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(-4px)',
          transformOrigin: 'top left',
          transition: 'opacity 160ms ease, transform 160ms cubic-bezier(0.32,0.72,0,1)',
        }}>
          <Calendar value={value} onChange={handleSelect} />
        </div>
      )}
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DatePickerPage() {
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
        <Demo />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-muted, rgba(10,10,10,0.4))',
          marginBottom: '12px',
        }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
          <pre style={{
            margin: 0,
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
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
