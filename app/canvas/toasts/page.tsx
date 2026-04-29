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

const THEME: Record<ToastType, { icon: string; accent: string; glow: string }> = {
  success: { icon: '/icons/IconCircleCheck.svg',         accent: 'oklch(0.62 0.19 145)', glow: 'oklch(0.62 0.19 145 / 0.12)' },
  error:   { icon: '/icons/IconExclamationCircleBold.svg', accent: 'oklch(0.58 0.22 25)',  glow: 'oklch(0.58 0.22 25 / 0.12)' },
  info:    { icon: '/icons/IconCircleInfo.svg',           accent: 'oklch(0.55 0.2 260)',  glow: 'oklch(0.55 0.2 260 / 0.12)' },
  warning: { icon: '/icons/IconExclamationTriangle.svg',  accent: 'oklch(0.72 0.18 70)',  glow: 'oklch(0.72 0.18 70 / 0.12)' },
  loading: { icon: '',                                    accent: 'oklch(0.5 0 0)',       glow: 'oklch(0.5 0 0 / 0.08)' },
}

const DURATION = 5000

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

// ─── Single Toast ────────────────────────────────────────────────────────────

function Toast({ toast, onDismiss, onAction, index, total, stackHovered }: {
  toast: ToastItem
  onDismiss: (id: number) => void
  onAction?: (id: number) => void
  index: number
  total: number
  stackHovered: boolean
}) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const theme = THEME[toast.type]

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
  }, [])

  useEffect(() => {
    if (toast.type === 'loading') return
    if (stackHovered) { if (timerRef.current) clearTimeout(timerRef.current); return }
    timerRef.current = setTimeout(() => dismiss(), DURATION)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [stackHovered]) // eslint-disable-line

  const dismiss = useCallback(() => {
    setExiting(true)
    setTimeout(() => onDismiss(toast.id), 350)
  }, [toast.id, onDismiss])

  const dist = total - 1 - index
  const collapsed = !stackHovered && dist > 0
  const scale = collapsed ? 1 - dist * 0.035 : 1
  const yShift = collapsed ? dist * -6 : 0
  const hide = dist > 2

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      transform: visible && !exiting
        ? `translateY(${stackHovered ? index * -72 : yShift}px) scale(${scale})`
        : exiting
        ? 'translateY(-16px) scale(0.95)'
        : 'translateY(20px) scale(0.92)',
      opacity: exiting ? 0 : visible ? (hide ? 0 : 1) : 0,
      transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease',
      zIndex: index + 1,
      pointerEvents: hide ? 'none' : 'auto',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 14,
        padding: '12px 14px',
        boxShadow: `0 1px 3px oklch(0 0 0 / 0.06), 0 6px 16px oklch(0 0 0 / 0.08), 0 0 0 1px oklch(0 0 0 / 0.04), 0 0 0 4px ${theme.glow}`,
        display: 'flex', alignItems: 'flex-start', gap: 10,
        position: 'relative', overflow: 'hidden',
        fontFamily: geist,
      }}>
        {/* Icon */}
        <div style={{
          width: 20, height: 20, borderRadius: 99, flexShrink: 0, marginTop: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {toast.type === 'loading' ? (
            <Spinner size={18} />
          ) : (
            <img src={theme.icon} width={18} height={18} alt="" style={{ filter: `brightness(0) saturate(100%)` }} />
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#171717', letterSpacing: '-0.01em', lineHeight: '18px' }}>
            {toast.title}
          </p>
          {toast.message && (
            <p style={{ margin: '3px 0 0', fontSize: 12, fontWeight: 450, color: 'oklch(0 0 0 / 0.5)', letterSpacing: '-0.01em', lineHeight: '16px' }}>
              {toast.message}
            </p>
          )}
        </div>

        {/* Action / Dismiss */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginTop: 1 }}>
          {toast.action && (
            <button
              onClick={() => { onAction?.(toast.id); dismiss() }}
              style={{
                border: 'none', background: '#171717', color: '#fff',
                fontSize: 12, fontWeight: 600, fontFamily: geist,
                padding: '4px 10px', borderRadius: 7, cursor: 'pointer',
                letterSpacing: '-0.01em',
                transition: 'opacity 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {toast.action.label}
            </button>
          )}
          <div
            onClick={() => dismiss()}
            style={{
              width: 20, height: 20, borderRadius: 6, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0 0 0 / 0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <img src="/icons/IconCrossSmall.svg" width={12} height={12} alt="Close" style={{ opacity: 0.35 }} />
          </div>
        </div>

        {/* Progress bar */}
        {toast.type !== 'loading' && (
          <Progress accent={theme.accent} paused={stackHovered} duration={DURATION} />
        )}
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
      padding: 3, borderRadius: 12, position: 'relative',
      background: '#fff',
      boxShadow: '0px 1px 2px -1px oklch(0 0 0 / 0.08), 0px 1px 3px oklch(0 0 0 / 0.08), 0px 0px 0px 1px oklch(0 0 0 / 0.06)',
    }}>
      {/* Sliding indicator */}
      <div style={{
        position: 'absolute', top: 3, height: 'calc(100% - 6px)',
        width: indicator.width, borderRadius: 9,
        background: 'oklch(0 0 0 / 0.06)',
        left: indicator.left,
        transition: 'left 0.35s cubic-bezier(0.16,1,0.3,1), width 0.35s cubic-bezier(0.16,1,0.3,1)',
      }} />

      {PRESETS.map((p, i) => (
        <button
          key={p.type}
          ref={el => { pillRefs.current[i] = el }}
          onClick={() => onSelect(i)}
          style={{
            height: 30, paddingLeft: 12, paddingRight: 12,
            borderRadius: 9, border: 'none', cursor: 'pointer',
            background: 'transparent', position: 'relative', zIndex: 1,
            fontFamily: geist, fontSize: 13, fontWeight: 500,
            color: i === activeIndex ? '#171717' : 'oklch(0 0 0 / 0.35)',
            letterSpacing: '-0.01em',
            transition: 'color 0.25s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

// ─── Toast Demo ──────────────────────────────────────────────────────────────

function ToastDemo() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [hovered, setHovered] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const counter = useRef(0)

  const add = useCallback((type: ToastType, title: string, message?: string, action?: { label: string }) => {
    const id = ++counter.current
    setToasts(prev => [...prev.slice(-5), { id, type, title, message, action }])
  }, [])

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const handleSelect = (i: number) => {
    setActiveIdx(i)
    const p = PRESETS[i]
    add(p.type, p.title, p.message, (p as any).action)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Toast stack */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ width: 356, height: 100, position: 'relative', marginBottom: 40 }}
      >
        {toasts.map((toast, i) => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={remove}
            index={i}
            total={toasts.length}
            stackHovered={hovered}
          />
        ))}
      </div>

      {/* Pill bar at bottom */}
      <PillBar activeIndex={activeIdx} onSelect={handleSelect} />

      {/* Hint */}
      <p style={{ margin: '16px 0 0', fontSize: 12, fontWeight: 450, color: 'oklch(0 0 0 / 0.25)', fontFamily: geist, letterSpacing: '-0.01em' }}>
        Hover the stack to expand · click to dismiss
      </p>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ToastsPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#FDFDFD',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <style>{`
        @keyframes toastSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <ToastDemo />
    </main>
  )
}
