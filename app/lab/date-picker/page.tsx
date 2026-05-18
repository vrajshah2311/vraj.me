'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// ─── DatePicker ───────────────────────────────────────────────────────────────

interface DatePickerProps {
  value?: Date | null
  onChange?: (date: Date) => void
  placeholder?: string
}

function DatePicker({ value, onChange, placeholder = 'Pick a date' }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Date | null>(value ?? null)
  const [view, setView] = useState(() => value ?? new Date())
  const [animKey, setAnimKey] = useState(0)
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const navigate = useCallback((dir: 'prev' | 'next') => {
    setSlideDir(dir === 'next' ? 'left' : 'right')
    setAnimKey(k => k + 1)
    setView(v => {
      const d = new Date(v)
      d.setDate(1)
      d.setMonth(d.getMonth() + (dir === 'next' ? 1 : -1))
      return d
    })
  }, [])

  const selectDate = useCallback((date: Date) => {
    setSelected(date)
    onChange?.(date)
    setTimeout(() => setOpen(false), 80)
  }, [onChange])

  const year = view.getFullYear()
  const month = view.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const today = new Date()

  // Build 42-cell calendar grid
  const cells: { date: Date; outside: boolean }[] = []
  const prevMonthDays = getDaysInMonth(year, month - 1)
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, prevMonthDays - i), outside: true })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ date: new Date(year, month, i), outside: false })
  }
  const remaining = 42 - cells.length
  for (let i = 1; i <= remaining; i++) {
    cells.push({ date: new Date(year, month + 1, i), outside: true })
  }

  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', fontFamily: font }}>

      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '9px 14px',
          background: '#fff',
          border: `1px solid ${open ? 'rgba(10,10,10,0.18)' : 'rgba(10,10,10,0.12)'}`,
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500,
          color: selected ? '#0a0a0a' : 'rgba(10,10,10,0.36)',
          letterSpacing: '-0.01em',
          boxShadow: open
            ? '0 0 0 3px rgba(10,10,10,0.06), 0 1px 2px rgba(0,0,0,0.04)'
            : '0 1px 2px rgba(0,0,0,0.04)',
          transition: 'border-color 150ms ease, box-shadow 150ms ease, color 150ms ease',
          whiteSpace: 'nowrap',
          minWidth: '190px',
          fontFamily: 'inherit',
          outline: 'none',
        }}
      >
        {/* Calendar icon */}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: selected ? 0.45 : 0.28 }}>
          <rect x="1.5" y="3.5" width="13" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
          <path d="M1.5 7h13" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5 1.5v3M11 1.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span style={{ flex: 1, textAlign: 'left' }}>
          {selected ? formatDate(selected) : placeholder}
        </span>
        {/* Chevron */}
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{
            flexShrink: 0,
            opacity: 0.3,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <path d="M2 4.5l4 3.5 4-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Popover */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: '50%',
          transform: open
            ? 'translateX(-50%) translateY(0) scale(1)'
            : 'translateX(-50%) translateY(-8px) scale(0.97)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          zIndex: 100,
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: '14px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.04)',
          padding: '14px',
          width: '272px',
          transformOrigin: 'top center',
          transition: 'transform 220ms cubic-bezier(0.32,0.72,0,1), opacity 160ms ease',
        }}
      >
        {/* Month/Year header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
          paddingBottom: '10px',
          borderBottom: '1px solid rgba(10,10,10,0.06)',
        }}>
          <button
            onClick={() => navigate('prev')}
            style={{
              width: '28px', height: '28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: 'none', borderRadius: '7px',
              cursor: 'pointer', color: 'rgba(10,10,10,0.4)',
              transition: 'background 150ms ease, color 150ms ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,10,10,0.06)'; e.currentTarget.style.color = '#0a0a0a' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(10,10,10,0.4)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '-0.02em', color: '#0a0a0a' }}>
            {MONTHS[month]} {year}
          </div>

          <button
            onClick={() => navigate('next')}
            style={{
              width: '28px', height: '28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: 'none', borderRadius: '7px',
              cursor: 'pointer', color: 'rgba(10,10,10,0.4)',
              transition: 'background 150ms ease, color 150ms ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,10,10,0.06)'; e.currentTarget.style.color = '#0a0a0a' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(10,10,10,0.4)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Day-of-week labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '2px' }}>
          {DAYS.map(d => (
            <div
              key={d}
              style={{
                textAlign: 'center',
                fontSize: '10px',
                fontWeight: 600,
                color: 'rgba(10,10,10,0.28)',
                letterSpacing: '0.04em',
                padding: '4px 0',
                textTransform: 'uppercase',
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid — slides on month change */}
        <div style={{ overflow: 'hidden' }}>
          <div
            key={animKey}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '1px',
              animation: `dp-slide-${slideDir} 220ms cubic-bezier(0.4,0,0.2,1) both`,
            }}
          >
            {cells.map(({ date, outside }, i) => {
              const isSelected = !!selected && isSameDay(date, selected)
              const isToday = isSameDay(date, today)
              return (
                <button
                  key={i}
                  onClick={() => { if (!outside) selectDate(date) }}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    border: 'none',
                    borderRadius: '7px',
                    cursor: outside ? 'default' : 'pointer',
                    fontSize: '12px',
                    fontWeight: isSelected ? 600 : isToday && !outside ? 600 : 500,
                    background: isSelected
                      ? '#0a0a0a'
                      : isToday && !outside
                        ? 'rgba(10,10,10,0.07)'
                        : 'none',
                    color: isSelected
                      ? '#fff'
                      : outside
                        ? 'rgba(10,10,10,0.18)'
                        : '#0a0a0a',
                    letterSpacing: '-0.01em',
                    transition: 'background 100ms ease, color 100ms ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'inherit',
                    outline: 'none',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected && !outside) {
                      e.currentTarget.style.background = 'rgba(10,10,10,0.07)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = (isToday && !outside) ? 'rgba(10,10,10,0.07)' : 'none'
                    }
                  }}
                >
                  {date.getDate()}
                  {/* Today dot */}
                  {isToday && !outside && !isSelected && (
                    <span style={{
                      position: 'absolute',
                      bottom: '3px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '3px',
                      height: '3px',
                      borderRadius: '50%',
                      background: '#0a0a0a',
                      opacity: 0.35,
                    }} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '10px',
          paddingTop: '10px',
          borderTop: '1px solid rgba(10,10,10,0.06)',
        }}>
          <button
            onClick={() => selectDate(today)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '12px', fontWeight: 500,
              color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em',
              padding: '4px 8px', borderRadius: '6px',
              fontFamily: 'inherit', transition: 'color 150ms ease, background 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#0a0a0a'; e.currentTarget.style.background = 'rgba(10,10,10,0.05)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(10,10,10,0.45)'; e.currentTarget.style.background = 'none' }}
          >
            Today
          </button>
          {selected && (
            <button
              onClick={() => { setSelected(null); setOpen(false) }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '12px', fontWeight: 500,
                color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em',
                padding: '4px 8px', borderRadius: '6px',
                fontFamily: 'inherit', transition: 'color 150ms ease, background 150ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.background = 'rgba(220,38,38,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(10,10,10,0.45)'; e.currentTarget.style.background = 'none' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes dp-slide-left {
          from { opacity: 0; transform: translateX(14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes dp-slide-right {
          from { opacity: 0; transform: translateX(-14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function Demo() {
  const [date, setDate] = useState<Date | null>(null)
  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', fontFamily: font }}>
      <DatePicker value={date} onChange={setDate} />
      {date && (
        <p style={{
          margin: 0,
          fontSize: '12px',
          fontWeight: 500,
          color: 'rgba(10,10,10,0.4)',
          letterSpacing: '-0.01em',
        }}>
          Selected: {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      )}
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}
function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

interface DatePickerProps {
  value?: Date | null
  onChange?: (date: Date) => void
  placeholder?: string
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date' }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Date | null>(value ?? null)
  const [view, setView] = useState(() => value ?? new Date())
  const [animKey, setAnimKey] = useState(0)
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const navigate = useCallback((dir: 'prev' | 'next') => {
    setSlideDir(dir === 'next' ? 'left' : 'right')
    setAnimKey(k => k + 1)
    setView(v => {
      const d = new Date(v)
      d.setDate(1)
      d.setMonth(d.getMonth() + (dir === 'next' ? 1 : -1))
      return d
    })
  }, [])

  const selectDate = useCallback((date: Date) => {
    setSelected(date)
    onChange?.(date)
    setTimeout(() => setOpen(false), 80)
  }, [onChange])

  const year = view.getFullYear()
  const month = view.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const today = new Date()

  const cells: { date: Date; outside: boolean }[] = []
  const prevMonthDays = getDaysInMonth(year, month - 1)
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ date: new Date(year, month - 1, prevMonthDays - i), outside: true })
  for (let i = 1; i <= daysInMonth; i++)
    cells.push({ date: new Date(year, month, i), outside: false })
  for (let i = 1; i <= 42 - cells.length; i++)
    cells.push({ date: new Date(year, month + 1, i), outside: true })

  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', fontFamily: font }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '9px 14px', background: '#fff',
          border: \`1px solid \${open ? 'rgba(10,10,10,0.18)' : 'rgba(10,10,10,0.12)'}\`,
          borderRadius: '10px', cursor: 'pointer',
          fontSize: '14px', fontWeight: 500,
          color: selected ? '#0a0a0a' : 'rgba(10,10,10,0.36)',
          letterSpacing: '-0.01em',
          boxShadow: open
            ? '0 0 0 3px rgba(10,10,10,0.06), 0 1px 2px rgba(0,0,0,0.04)'
            : '0 1px 2px rgba(0,0,0,0.04)',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          minWidth: '190px', fontFamily: 'inherit', outline: 'none',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: selected ? 0.45 : 0.28 }}>
          <rect x="1.5" y="3.5" width="13" height="11" rx="2" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M1.5 7h13" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M5 1.5v3M11 1.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <span style={{ flex: 1, textAlign: 'left' }}>{selected ? formatDate(selected) : placeholder}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ flexShrink: 0, opacity: 0.3, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms cubic-bezier(0.4,0,0.2,1)' }}>
          <path d="M2 4.5l4 3.5 4-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div style={{
        position: 'absolute', top: 'calc(100% + 8px)', left: '50%',
        transform: open ? 'translateX(-50%) translateY(0) scale(1)' : 'translateX(-50%) translateY(-8px) scale(0.97)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        zIndex: 100, background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)', borderRadius: '14px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.1)',
        padding: '14px', width: '272px', transformOrigin: 'top center',
        transition: 'transform 220ms cubic-bezier(0.32,0.72,0,1), opacity 160ms ease',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
          <button onClick={() => navigate('prev')} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', borderRadius: '7px', cursor: 'pointer', color: 'rgba(10,10,10,0.4)', fontFamily: 'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,10,10,0.06)'; e.currentTarget.style.color = '#0a0a0a' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(10,10,10,0.4)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '-0.02em', color: '#0a0a0a' }}>
            {MONTHS[month]} {year}
          </div>
          <button onClick={() => navigate('next')} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', borderRadius: '7px', cursor: 'pointer', color: 'rgba(10,10,10,0.4)', fontFamily: 'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,10,10,0.06)'; e.currentTarget.style.color = '#0a0a0a' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(10,10,10,0.4)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '2px' }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 600, color: 'rgba(10,10,10,0.28)', letterSpacing: '0.04em', padding: '4px 0', textTransform: 'uppercase' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ overflow: 'hidden' }}>
          <div key={animKey} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', animation: \`dp-slide-\${slideDir} 220ms cubic-bezier(0.4,0,0.2,1) both\` }}>
            {cells.map(({ date, outside }, i) => {
              const isSelected = !!selected && isSameDay(date, selected)
              const isToday = isSameDay(date, today)
              return (
                <button key={i} onClick={() => { if (!outside) selectDate(date) }}
                  style={{
                    width: '100%', aspectRatio: '1', border: 'none', borderRadius: '7px',
                    cursor: outside ? 'default' : 'pointer',
                    fontSize: '12px', fontWeight: isSelected ? 600 : isToday && !outside ? 600 : 500,
                    background: isSelected ? '#0a0a0a' : isToday && !outside ? 'rgba(10,10,10,0.07)' : 'none',
                    color: isSelected ? '#fff' : outside ? 'rgba(10,10,10,0.18)' : '#0a0a0a',
                    letterSpacing: '-0.01em',
                    transition: 'background 100ms ease, color 100ms ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'inherit', outline: 'none', position: 'relative',
                  }}
                  onMouseEnter={e => { if (!isSelected && !outside) e.currentTarget.style.background = 'rgba(10,10,10,0.07)' }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = (isToday && !outside) ? 'rgba(10,10,10,0.07)' : 'none' }}
                >
                  {date.getDate()}
                  {isToday && !outside && !isSelected && (
                    <span style={{ position: 'absolute', bottom: '3px', left: '50%', transform: 'translateX(-50%)', width: '3px', height: '3px', borderRadius: '50%', background: '#0a0a0a', opacity: 0.35 }} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(10,10,10,0.06)' }}>
          <button onClick={() => selectDate(today)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em', padding: '4px 8px', borderRadius: '6px', fontFamily: 'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#0a0a0a'; e.currentTarget.style.background = 'rgba(10,10,10,0.05)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(10,10,10,0.45)'; e.currentTarget.style.background = 'none' }}>
            Today
          </button>
          {selected && (
            <button onClick={() => { setSelected(null); setOpen(false) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em', padding: '4px 8px', borderRadius: '6px', fontFamily: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.background = 'rgba(220,38,38,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(10,10,10,0.45)'; e.currentTarget.style.background = 'none' }}>
              Clear
            </button>
          )}
        </div>
      </div>

      <style>{\`
        @keyframes dp-slide-left {
          from { opacity: 0; transform: translateX(14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes dp-slide-right {
          from { opacity: 0; transform: translateX(-14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      \`}</style>
    </div>
  )
}

// Usage:
// const [date, setDate] = useState<Date | null>(null)
// <DatePicker value={date} onChange={setDate} placeholder="Pick a date" />`

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
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: '12px',
      }}>
        <p style={{
          margin: '0 0 16px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.3)',
        }}>
          Date Picker
        </p>
        <Demo />
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
