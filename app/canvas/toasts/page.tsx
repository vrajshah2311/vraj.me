'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const geist = 'var(--font-geist-sans), -apple-system, sans-serif'

// ─── Types ───────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading'

interface ToastItem {
  id: number
  type: ToastType
  title: string
  message?: string
  action?: { label: string }
}

// ─── Theme ───────────────────────────────────────────────────────────────────

const THEME: Record<ToastType, { color: string; bg: string; border: string }> = {
  success: { color: 'oklch(0.62 0.19 145)', bg: 'oklch(0.965 0.02 145)',  border: 'oklch(0.92 0.04 145)' },
  error:   { color: 'oklch(0.55 0.22 15)',  bg: 'oklch(0.965 0.02 15)',   border: 'oklch(0.92 0.04 15)' },
  info:    { color: 'oklch(0.55 0.2 260)',  bg: 'oklch(0.965 0.02 260)',  border: 'oklch(0.92 0.04 260)' },
  warning: { color: 'oklch(0.75 0.16 70)',  bg: 'oklch(0.97 0.02 70)',    border: 'oklch(0.93 0.04 70)' },
  loading: { color: 'oklch(0.15 0 0)',      bg: 'oklch(0.965 0 0)',       border: 'oklch(0.92 0 0)' },
}

function ToastIcon({ type, size = 16 }: { type: ToastType; size?: number }) {
  const color = THEME[type].color
  if (type === 'loading') return <Spinner size={size} />
  if (type === 'success') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill={color} />
      <path d="M5.5 8L7.2 9.8L10.5 6.2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
  if (type === 'error') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill={color} />
      <path d="M6 6L10 10M10 6L6 10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
  if (type === 'info') return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill={color} />
      <path d="M8 7V11" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5.25" r="0.75" fill="#fff" />
    </svg>
  )
  // warning
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M7.134 2.5a1 1 0 011.732 0l5.196 9a1 1 0 01-.866 1.5H2.804a1 1 0 01-.866-1.5l5.196-9z" fill={color} />
      <path d="M8 6V9" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="#fff" />
    </svg>
  )
}

const DURATION = 3500

// ─── Spinner ─────────────────────────────────────────────────────────────────

function Spinner({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={{ animation: 'toastSpin 0.8s linear infinite' }}>
      <circle cx="9" cy="9" r="7" stroke="oklch(0 0 0 / 0.1)" strokeWidth="2" />
      <path d="M16 9a7 7 0 00-7-7" stroke="oklch(0.4 0 0)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─── Progress ────────────────────────────────────────────────────────────────

function Progress({ accent, paused, duration }: { accent: string; paused: boolean; duration: number }) {
  const [pct, setPct] = useState(100)
  const startRef = useRef<number | null>(null)
  const savedRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (paused) {
      savedRef.current = pct
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }
    const elapsed = savedRef.current !== null ? ((100 - savedRef.current) / 100) * duration : 0
    startRef.current = null
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts - elapsed
      const p = Math.max(0, 100 - ((ts - startRef.current) / duration) * 100)
      setPct(p)
      if (p > 0) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [paused]) // eslint-disable-line

  return (
    <div style={{ position: 'absolute', bottom: 0, left: 12, right: 12, height: 2, borderRadius: 99, background: 'oklch(0 0 0 / 0.04)', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: accent, opacity: 0.5 }} />
    </div>
  )
}

// ─── Inline Progress ─────────────────────────────────────────────────────────

function InlineProgress({ paused, duration }: { paused: boolean; duration: number }) {
  const [pct, setPct] = useState(100)
  const startRef = useRef<number | null>(null)
  const savedRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (paused) {
      savedRef.current = pct
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }
    const elapsed = savedRef.current !== null ? ((100 - savedRef.current) / 100) * duration : 0
    startRef.current = null
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts - elapsed
      const p = Math.max(0, 100 - ((ts - startRef.current) / duration) * 100)
      setPct(p)
      if (p > 0) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [paused]) // eslint-disable-line

  return (
    <div style={{ width: 32, height: 6, background: 'rgba(23, 23, 23, 0.06)', borderRadius: 800, overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: 'rgba(23, 23, 23, 0.16)', borderRadius: 800 }} />
    </div>
  )
}

// ─── Single Toast ────────────────────────────────────────────────────────────

function Toast({ toast, onDismiss, onAction, index, total, stackHovered, showProgress, expandOffset, colorIcons }: {
  toast: ToastItem
  onDismiss: (id: number) => void
  onAction?: (id: number) => void
  index: number
  total: number
  stackHovered: boolean
  showProgress: boolean
  expandOffset: number
  colorIcons: boolean
}) {
  const [mounted, setMounted] = useState(false)
  const [exiting, setExiting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)))
  }, [])

  useEffect(() => {
    if (toast.type === 'loading') return
    if (!showProgress) {
      if (stackHovered) { if (timerRef.current) clearTimeout(timerRef.current); return }
    }
    timerRef.current = setTimeout(() => dismiss(), DURATION)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [stackHovered, showProgress]) // eslint-disable-line

  const dismiss = useCallback(() => {
    setExiting(true)
    setTimeout(() => onDismiss(toast.id), 400)
  }, [toast.id, onDismiss])

  const dist = total - 1 - index
  const collapsed = !stackHovered && dist > 0
  const scale = collapsed ? 1 - dist * 0.04 : 1
  const yShift = collapsed ? dist * -8 : 0
  const hide = dist > 3

  const y = mounted && !exiting
    ? (stackHovered ? -expandOffset : yShift)
    : exiting ? -8 : 100

  return (
    <div
      data-mounted={mounted && !exiting}
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        transform: `translateY(${mounted && !exiting ? y : exiting ? -8 : '100%'}${mounted && !exiting ? 'px' : exiting ? 'px' : ''}) scale(${mounted && !exiting ? scale : 1})`,
        opacity: exiting ? 0 : mounted ? (hide ? 0 : 1) : 0,
        transition: 'transform 400ms ease, opacity 300ms ease',
        zIndex: index + 1,
        pointerEvents: hide ? 'none' : 'auto',
      }}
    >
      <div style={{
        background: colorIcons ? THEME[toast.type].bg : '#FDFDFD',
        borderRadius: 16,
        paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10,
        boxShadow: colorIcons
          ? `0px 0px 0px 1px ${THEME[toast.type].border}`
          : '0px 8px 10px -6px rgba(23, 23, 23, 0.10), 0px 20px 25px -5px rgba(23, 23, 23, 0.08), 0px 0px 0px 1px rgba(23, 23, 23, 0.08)',
        display: 'flex', alignItems: 'flex-start', gap: 8,
        position: 'relative', overflow: 'hidden',
        transition: 'background 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        fontFamily: geist,
      }}>
        {/* Icon */}
        <div style={{ display: 'flex', alignItems: 'flex-start', flexShrink: 0, paddingTop: 1 }}>
          <ToastIcon type={toast.type} size={16} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <p style={{ flex: 1, margin: 0, fontSize: 14, fontWeight: 500, color: '#171717', lineHeight: '14px' }}>
              {toast.title}
            </p>
            {/* Progress bar */}
            {toast.type !== 'loading' && showProgress && (
              <InlineProgress paused={stackHovered} duration={DURATION} />
            )}
          </div>
          {toast.message && (
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'rgba(23, 23, 23, 0.5)', lineHeight: '18px' }}>
              {toast.message}
            </p>
          )}
          {toast.action && (
            <button
              onClick={() => { onAction?.(toast.id); dismiss() }}
              style={{
                border: 'none',
                background: 'linear-gradient(180deg, rgba(23, 23, 23, 0) 30%, rgba(23, 23, 23, 0) 100%), #FDFDFD',
                boxShadow: '0px -1px 0px rgba(23, 23, 23, 0.04) inset, 0px 1px 3px rgba(23, 23, 23, 0.08), 0px 0px 0px 1px rgba(23, 23, 23, 0.06)',
                color: '#171717',
                fontSize: 14, fontWeight: 500, fontFamily: geist,
                lineHeight: '14px',
                paddingLeft: 6, paddingRight: 6, height: 28,
                borderRadius: 8, cursor: 'pointer',
                overflow: 'hidden', alignSelf: 'flex-start',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                transition: 'opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {toast.action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Pill Bar ────────────────────────────────────────────────────────────────

const PRESETS = [
  { type: 'success' as const, label: 'Success', title: 'Changes saved', message: 'Your profile has been updated successfully.' },
  { type: 'error' as const,   label: 'Error',   title: 'Upload failed', message: 'The file exceeds the 10 MB limit.' },
  { type: 'info' as const,    label: 'Info',    title: 'New version available', message: 'Refresh the page to get the latest updates.' },
  { type: 'warning' as const, label: 'Warning', title: 'Storage almost full', message: "You've used 90% of your available storage.", action: { label: 'Upgrade' } },
  { type: 'loading' as const, label: 'Loading', title: 'Uploading file...', message: '3 of 12 files processed' },
]

function PillBar({ activeIndex, onSelect }: { activeIndex: number; onSelect: (i: number) => void }) {
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const [hoveredIdx, setHoveredIdx] = useState(-1)

  useEffect(() => {
    const el = pillRefs.current[activeIndex]
    const container = containerRef.current
    if (el && container) {
      const cRect = container.getBoundingClientRect()
      const eRect = el.getBoundingClientRect()
      setIndicator({
        left: eRect.left - cRect.left,
        width: eRect.width,
      })
    }
  }, [activeIndex])

  return (
    <div ref={containerRef} style={{
      display: 'inline-flex', alignItems: 'center', gap: 2,
      padding: 2, borderRadius: 12, position: 'relative',
      background: 'rgba(23, 23, 23, 0.04)',
    }}>
      {/* Sliding indicator */}
      <div style={{
        position: 'absolute', top: 2, height: 'calc(100% - 4px)',
        width: indicator.width, borderRadius: 8,
        background: '#FDFDFD',
        boxShadow: '0px -1px 0px rgba(23, 23, 23, 0.04) inset, 0px 1px 3px rgba(23, 23, 23, 0.08), 0px 0px 0px 1px rgba(23, 23, 23, 0.06)',
        overflow: 'hidden',
        left: indicator.left,
        transition: 'left 0.4s cubic-bezier(0.22, 1, 0.36, 1), width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }} />

      {PRESETS.map((p, i) => (
        <button
          key={p.type}
          ref={el => { pillRefs.current[i] = el }}
          onClick={() => onSelect(i)}
          style={{
            height: 28, paddingLeft: 6, paddingRight: 6, width: 'fit-content',
            borderRadius: 8, border: 'none', cursor: 'pointer',
            background: i !== activeIndex && hoveredIdx === i ? 'rgba(23, 23, 23, 0.04)' : 'transparent',
            position: 'relative', zIndex: 1,
            overflow: 'hidden', whiteSpace: 'nowrap', flexShrink: 0,
            fontFamily: geist, fontSize: 14, fontWeight: 500,
            lineHeight: '14px',
            color: i === activeIndex ? '#171717' : hoveredIdx === i ? 'rgba(23, 23, 23, 0.85)' : 'rgba(23, 23, 23, 0.6)',
            transition: 'color 0.3s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(-1)}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

// ─── Message Pool ────────────────────────────────────────────────────────────

const MESSAGE_POOL: Record<ToastType, { title: string; message?: string; action?: { label: string } }[]> = {
  success: [
    { title: 'Changes saved', message: 'Your profile has been updated successfully.' },
    { title: 'Payment received', message: 'Invoice #1042 has been paid.' },
    { title: 'Export complete', message: 'Your CSV file is ready to download.' },
    { title: 'Team member added', message: 'alex@company.com now has editor access.' },
  ],
  error: [
    { title: 'Upload failed', message: 'The file exceeds the 10 MB limit.' },
    { title: 'Connection lost', message: 'Check your internet and try again.' },
    { title: 'Payment declined', message: 'Your card ending in 4242 was declined.' },
    { title: 'Import failed', message: '3 rows contain invalid email addresses.' },
    { title: 'Permission denied', message: 'You need admin access to delete this.' },
  ],
  info: [
    { title: 'New version available', message: 'Refresh the page to get the latest updates.' },
    { title: 'Scheduled maintenance', message: 'The platform will be briefly offline at 2am UTC.' },
    { title: '2 comments on your report', message: 'Sarah and Mike left feedback.' },
    { title: 'API rate limit reached', message: 'Requests will resume in 60 seconds.' },
    { title: 'Sync in progress', message: 'Your data is being synced across devices.' },
  ],
  warning: [
    { title: 'Storage almost full', message: '90% of storage used.', action: { label: 'Upgrade' } },
    { title: 'Trial ending soon', message: 'Your free trial expires in 3 days.', action: { label: 'Subscribe' } },
    { title: 'Weak password', message: 'Consider using a stronger password for security.' },
    { title: 'Unused seats', message: 'You have 4 unused seats on your plan.', action: { label: 'Manage' } },
    { title: 'Browser outdated', message: 'Some features may not work correctly.' },
  ],
  loading: [
    { title: 'Uploading file...', message: '3 of 12 files processed' },
    { title: 'Generating report...', message: 'This may take a few seconds' },
    { title: 'Syncing data...', message: 'Connecting to server' },
    { title: 'Processing payment...', message: 'Please wait' },
    { title: 'Importing contacts...', message: '142 of 500 rows complete' },
  ],
}

// ─── Type Dropdown ───────────────────────────────────────────────────────────

function TypeDropdown({ activeIndex, onSelect }: { activeIndex: number; onSelect: (i: number) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const active = PRESETS[activeIndex]

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          height: 28, paddingLeft: 6, paddingRight: 6,
          background: '#FDFDFD',
          boxShadow: '0px -1px 0px rgba(23, 23, 23, 0.04) inset, 0px 1px 3px rgba(23, 23, 23, 0.08), 0px 0px 0px 1px rgba(23, 23, 23, 0.06)',
          overflow: 'hidden', border: 'none', borderRadius: 8, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}
      >
        <span style={{ fontFamily: geist, fontSize: 14, fontWeight: 500, lineHeight: '14px', color: '#171717' }}>{active.label}</span>
        <img src="/icons/IconChevronDownMedium.svg" width={16} height={16} alt="" style={{ flexShrink: 0, opacity: 0.4 }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: 0,
          background: '#FDFDFD', borderRadius: 14, padding: 4,
          boxShadow: '0px 8px 10px -6px rgba(23, 23, 23, 0.10), 0px 20px 25px -5px rgba(23, 23, 23, 0.08), 0px 0px 0px 1px rgba(23, 23, 23, 0.08)',
          display: 'flex', flexDirection: 'column', gap: 1,
          zIndex: 1001, minWidth: 160,
          animation: 'toastDropIn 0.2s cubic-bezier(0.16,1,0.3,1) forwards',
        }}>
          {PRESETS.map((p, i) => (
            <div key={p.type}
              onClick={() => { onSelect(i); setOpen(false) }}
              style={{
                height: 30, paddingLeft: 8, paddingRight: 8, borderRadius: 8,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                background: 'transparent',
                transition: 'background 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(23, 23, 23, 0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontFamily: geist, fontSize: 13, fontWeight: 500, color: '#171717', flex: 1 }}>{p.label}</span>
              {i === activeIndex && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M2 6.5L4.5 9L10 3" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Action Pill Bar ─────────────────────────────────────────────────────────

function ActionPillBar({ autoplay, onAddToast, onToggleAutoplay }: {
  autoplay: boolean
  onAddToast: () => void
  onToggleAutoplay: () => void
}) {
  const addRef = useRef<HTMLButtonElement>(null)
  const keyRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const activeBtn = autoplay ? 1 : 0

  useEffect(() => {
    const el = activeBtn === 0 ? addRef.current : keyRef.current
    const container = containerRef.current
    if (el && container) {
      const cRect = container.getBoundingClientRect()
      const eRect = el.getBoundingClientRect()
      setIndicator({ left: eRect.left - cRect.left, width: eRect.width })
    }
  }, [activeBtn])

  return (
    <div ref={containerRef} style={{
      display: 'inline-flex', alignItems: 'center', gap: 2,
      padding: 2, borderRadius: 12, position: 'relative',
      background: 'rgba(23, 23, 23, 0.04)',
    }}>
      {/* Sliding indicator */}
      <div style={{
        position: 'absolute', top: 2, height: 'calc(100% - 4px)',
        width: indicator.width, borderRadius: 8,
        background: '#FDFDFD',
        boxShadow: '0px -1px 0px rgba(23, 23, 23, 0.04) inset, 0px 1px 3px rgba(23, 23, 23, 0.08), 0px 0px 0px 1px rgba(23, 23, 23, 0.06)',
        left: indicator.left,
        transition: 'left 0.4s cubic-bezier(0.22, 1, 0.36, 1), width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }} />

      <button
        ref={addRef}
        onClick={onAddToast}
        style={{
          height: 28, paddingLeft: 8, paddingRight: 8,
          borderRadius: 8, border: 'none', cursor: 'pointer',
          background: 'transparent', position: 'relative', zIndex: 1,
          fontFamily: geist, fontSize: 13, fontWeight: 500, lineHeight: '14px',
          color: !autoplay ? '#171717' : 'rgba(23, 23, 23, 0.6)',
          display: 'inline-flex', alignItems: 'center', gap: 5,
          transition: 'color 0.2s cubic-bezier(0.16,1,0.3,1)',
          whiteSpace: 'nowrap',
        }}
      >
        Add Toast
      </button>

      <button
        ref={keyRef}
        onClick={onToggleAutoplay}
        style={{
          height: 28, paddingLeft: 8, paddingRight: 8,
          borderRadius: 8, border: 'none', cursor: 'pointer',
          background: 'transparent', position: 'relative', zIndex: 1,
          fontFamily: geist, fontSize: 13, fontWeight: 500, lineHeight: '14px',
          color: autoplay ? '#171717' : 'rgba(23, 23, 23, 0.6)',
          display: 'inline-flex', alignItems: 'center', gap: 5,
          transition: 'color 0.2s cubic-bezier(0.16,1,0.3,1)',
          whiteSpace: 'nowrap',
        }}
      >
        Keyframes
      </button>
    </div>
  )
}

// ─── Toast Demo ──────────────────────────────────────────────────────────────

function ToastDemo() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [hovered, setHovered] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [autoplay, setAutoplay] = useState(false)
  const [colorIcons, setColorIcons] = useState(false)
  const [shake, setShake] = useState(false)
  const stackRef = useRef<HTMLDivElement>(null)
  const counter = useRef(0)
  const msgCounter = useRef<Record<string, number>>({})
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const addRandom = useCallback((type: ToastType) => {
    setToasts(prev => {
      if (prev.length >= 3) {
        setShake(true)
        setTimeout(() => setShake(false), 500)
        return prev
      }
      const pool = MESSAGE_POOL[type]
      const idx = (msgCounter.current[type] ?? 0) % pool.length
      msgCounter.current[type] = idx + 1
      const msg = pool[idx]
      const id = ++counter.current
      return [...prev, { id, type, title: msg.title, message: msg.message, action: msg.action }]
    })
  }, [])

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const activeIdxRef = useRef(activeIdx)
  activeIdxRef.current = activeIdx

  const handleSelect = (i: number) => {
    setActiveIdx(i)
    setToasts([])
    setTimeout(() => addRandom(PRESETS[i].type), 50)
  }

  const handleAddToast = () => {
    if (autoplay) {
      setAutoplay(false)
      setToasts([])
      setTimeout(() => addRandom(PRESETS[activeIdxRef.current].type), 50)
    } else {
      addRandom(PRESETS[activeIdxRef.current].type)
    }
  }

  // Autoplay
  useEffect(() => {
    if (autoplay) {
      addRandom(PRESETS[activeIdxRef.current].type)
      autoplayRef.current = setInterval(() => {
        addRandom(PRESETS[activeIdxRef.current].type)
      }, 2200)
    } else {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
    }
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current) }
  }, [autoplay]) // eslint-disable-line

  // Dismiss all on click outside
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node) && toasts.length > 0) {
        // Stagger remove from back (oldest first)
        toasts.forEach((t, i) => {
          setTimeout(() => remove(t.id), i * 80)
        })
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [toasts, remove])

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Toast stack */}
      <div
        ref={stackRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ width: 380, height: 100, position: 'relative', marginBottom: 40, animation: shake ? 'toastShake 0.4s ease' : undefined }}
      >
        {toasts.map((toast, i) => {
          // Calculate cumulative offset from bottom for expanded view
          let offset = 0
          const gap = 8
          const els = stackRef.current?.children
          if (els) {
            for (let j = toasts.length - 1; j > i; j--) {
              const el = els[j] as HTMLElement | undefined
              offset += (el?.offsetHeight ?? 70) + gap
            }
          }
          return (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={remove}
            index={i}
            total={toasts.length}
            stackHovered={hovered}
            showProgress={autoplay}
            expandOffset={offset}
            colorIcons={colorIcons}
          />
          )
        })}
      </div>

      {/* Controls row */}
      <p className="hint-shimmer" style={{ margin: '0 0 16px', fontSize: 13, fontWeight: 500, fontFamily: geist, letterSpacing: '-0.01em',
        color: 'oklch(0 0 0 / 0.18)',
        background: 'linear-gradient(90deg, oklch(0 0 0 / 0.18) 0%, oklch(0 0 0 / 0.18) 35%, oklch(0 0 0 / 0.25) 45%, oklch(0 0 0 / 0.3) 50%, oklch(0 0 0 / 0.25) 55%, oklch(0 0 0 / 0.18) 65%, oklch(0 0 0 / 0.18) 100%)',
        backgroundSize: '200% 100%',
        backgroundPosition: '200% 0',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Hover the stack to expand
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Action pill bar: Add Toast | Keyframes */}
        <ActionPillBar
          autoplay={autoplay}
          onAddToast={handleAddToast}
          onToggleAutoplay={() => setAutoplay(p => !p)}
        />

        <div style={{ width: 1, height: 16, background: 'oklch(0 0 0 / 0.1)', flexShrink: 0, margin: '0 3px' }} />

        {/* Type dropdown */}
        <TypeDropdown activeIndex={activeIdx} onSelect={handleSelect} />

        {/* Color toggle */}
        <button
          onClick={() => setColorIcons(p => !p)}
          style={{
            height: 28, width: 28, padding: 0,
            background: '#FDFDFD',
            boxShadow: '0px -1px 0px rgba(23, 23, 23, 0.04) inset, 0px 1px 3px rgba(23, 23, 23, 0.08), 0px 0px 0px 1px rgba(23, 23, 23, 0.06)',
            overflow: 'hidden', border: 'none', borderRadius: 8, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <div style={{
            width: 12, height: 12, borderRadius: 99,
            background: colorIcons
              ? 'conic-gradient(oklch(0.62 0.19 145), oklch(0.55 0.2 260), oklch(0.55 0.22 15), oklch(0.75 0.16 70), oklch(0.62 0.19 145))'
              : 'rgba(23, 23, 23, 0.2)',
            transition: 'background 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          }} />
        </button>
      </div>

    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ToastsPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#FDFDFD',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      padding: '40px 24px 60px',
    }}>
      <style>{`
        @keyframes toastSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes toastDropIn { from { opacity: 0; transform: translateY(6px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes toastShake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-4px); } 40% { transform: translateX(4px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(2px); } }
        @keyframes hintShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .hint-shimmer { animation: hintShimmer 2s ease 7s infinite; }
      `}</style>
      <ToastDemo />
    </main>
  )
}
