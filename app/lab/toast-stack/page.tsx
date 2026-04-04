'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastItem {
  id: number
  type: ToastType
  title: string
  message?: string
  createdAt: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DURATION = 4000

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'i',
  warning: '!',
}

const COLORS: Record<ToastType, { icon: string; bg: string; border: string; progress: string }> = {
  success: { icon: '#16a34a', bg: '#f0fdf4', border: 'rgba(22,163,74,0.2)', progress: '#16a34a' },
  error:   { icon: '#dc2626', bg: '#fef2f2', border: 'rgba(220,38,38,0.2)',  progress: '#dc2626' },
  info:    { icon: '#2563eb', bg: '#eff6ff', border: 'rgba(37,99,235,0.2)',  progress: '#2563eb' },
  warning: { icon: '#d97706', bg: '#fffbeb', border: 'rgba(217,119,6,0.2)',  progress: '#d97706' },
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ color, paused }: { color: string; paused: boolean }) {
  const [width, setWidth] = useState(100)
  const startRef = useRef<number | null>(null)
  const pausedAtRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (paused) {
      pausedAtRef.current = width
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    const elapsed = pausedAtRef.current !== null
      ? ((100 - pausedAtRef.current) / 100) * DURATION
      : 0

    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts - elapsed
      const pct = Math.max(0, 100 - ((ts - startRef.current) / DURATION) * 100)
      setWidth(pct)
      if (pct > 0) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [paused]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', borderRadius: '0 0 12px 12px', background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${width}%`,
        background: color,
        borderRadius: '0 0 12px 12px',
        transition: 'none',
      }} />
    </div>
  )
}

// ─── Single Toast ─────────────────────────────────────────────────────────────

function Toast({ toast, onDismiss, index, total }: {
  toast: ToastItem
  onDismiss: (id: number) => void
  index: number
  total: number
}) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const colors = COLORS[toast.type]

  // Animate in
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 16)
    return () => clearTimeout(id)
  }, [])

  // Auto-dismiss
  useEffect(() => {
    if (hovered) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }
    timerRef.current = setTimeout(() => handleDismiss(), DURATION)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [hovered]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDismiss = useCallback(() => {
    setVisible(false)
    setTimeout(() => onDismiss(toast.id), 300)
  }, [toast.id, onDismiss])

  // Stacking transform: items behind are scaled down and pushed up
  const distFromTop = total - 1 - index
  const isCollapsed = !hovered && distFromTop > 0
  const scale = isCollapsed ? 1 - distFromTop * 0.04 : 1
  const translateY = isCollapsed ? distFromTop * -8 : 0
  const opacity = distFromTop > 2 ? 0 : 1

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        transform: visible
          ? `translateY(${hovered ? index * -76 : translateY}px) scale(${scale})`
          : 'translateY(24px) scale(0.96)',
        opacity: visible ? opacity : 0,
        transition: 'transform 280ms cubic-bezier(0.32, 0.72, 0, 1), opacity 280ms ease',
        zIndex: index + 1,
        willChange: 'transform, opacity',
      }}
    >
      <div style={{
        background: '#fff',
        border: `1px solid var(--border, rgba(10,10,10,0.08))`,
        borderRadius: '12px',
        padding: '12px 14px 14px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}>
        {/* Icon badge */}
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '1px',
        }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: colors.icon, lineHeight: 1 }}>
            {ICONS[toast.type]}
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary, #0a0a0a)', letterSpacing: '-0.01em', lineHeight: '18px' }}>
            {toast.title}
          </p>
          {toast.message && (
            <p style={{ margin: '2px 0 0', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary, rgba(10,10,10,0.64))', letterSpacing: '-0.01em', lineHeight: '17px' }}>
              {toast.message}
            </p>
          )}
        </div>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            color: 'var(--text-muted, rgba(10,10,10,0.4))',
            fontSize: '14px',
            lineHeight: 1,
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '1px',
            transition: 'color 150ms ease, background 150ms ease',
          }}
          onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--text-primary, #0a0a0a)'; (e.target as HTMLElement).style.background = 'var(--hover-bg, rgba(10,10,10,0.05))' }}
          onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text-muted, rgba(10,10,10,0.4))'; (e.target as HTMLElement).style.background = 'transparent' }}
        >
          ✕
        </button>

        {/* Progress bar */}
        <ProgressBar color={colors.progress} paused={hovered} />
      </div>
    </div>
  )
}

// ─── Toast Stack ──────────────────────────────────────────────────────────────

function ToastStack() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counterRef = useRef(0)

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = ++counterRef.current
    setToasts(prev => [...prev.slice(-4), { id, type, title, message, createdAt: Date.now() }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const PRESETS: { type: ToastType; title: string; message: string; label: string }[] = [
    { type: 'success', label: 'Success',  title: 'Changes saved',        message: 'Your draft has been saved successfully.' },
    { type: 'error',   label: 'Error',    title: 'Upload failed',         message: 'File exceeds the 10 MB size limit.' },
    { type: 'info',    label: 'Info',     title: 'New version available', message: 'Refresh to get the latest updates.' },
    { type: 'warning', label: 'Warning',  title: 'Storage almost full',   message: 'You\'ve used 90% of your storage.' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
      {/* Trigger buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {PRESETS.map(p => (
          <button
            key={p.type}
            onClick={() => addToast(p.type, p.title, p.message)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border, rgba(10,10,10,0.08))',
              background: '#fff',
              color: 'var(--text-primary, #0a0a0a)',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              transition: 'background 150ms ease, transform 100ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover-bg, rgba(10,10,10,0.05))')}
            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Label */}
      <p style={{ margin: 0, fontSize: '12px', color: 'rgba(0,0,0,0.35)', fontWeight: 500, letterSpacing: '-0.01em', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
        Hover to expand stack · click ✕ or wait 4s to dismiss
      </p>

      {/* Stack viewport */}
      <div style={{ width: '320px', height: '80px', position: 'relative' }}>
        {toasts.map((toast, i) => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={removeToast}
            index={i}
            total={toasts.length}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastItem {
  id: number
  type: ToastType
  title: string
  message?: string
}

const DURATION = 4000

const ICONS: Record<ToastType, string> = {
  success: '✓', error: '✕', info: 'i', warning: '!',
}

const COLORS: Record<ToastType, { icon: string; bg: string; border: string; progress: string }> = {
  success: { icon: '#16a34a', bg: '#f0fdf4', border: 'rgba(22,163,74,0.2)',  progress: '#16a34a' },
  error:   { icon: '#dc2626', bg: '#fef2f2', border: 'rgba(220,38,38,0.2)',  progress: '#dc2626' },
  info:    { icon: '#2563eb', bg: '#eff6ff', border: 'rgba(37,99,235,0.2)',  progress: '#2563eb' },
  warning: { icon: '#d97706', bg: '#fffbeb', border: 'rgba(217,119,6,0.2)',  progress: '#d97706' },
}

function ProgressBar({ color, paused }: { color: string; paused: boolean }) {
  const [width, setWidth] = useState(100)
  const startRef = useRef<number | null>(null)
  const pausedAtRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (paused) {
      pausedAtRef.current = width
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }
    const elapsed = pausedAtRef.current !== null
      ? ((100 - pausedAtRef.current) / 100) * DURATION : 0
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts - elapsed
      const pct = Math.max(0, 100 - ((ts - startRef.current) / DURATION) * 100)
      setWidth(pct)
      if (pct > 0) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [paused])

  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', borderRadius: '0 0 12px 12px', background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: \`\${width}%\`, background: color, borderRadius: '0 0 12px 12px', transition: 'none' }} />
    </div>
  )
}

function Toast({ toast, onDismiss, index, total }: { toast: ToastItem; onDismiss: (id: number) => void; index: number; total: number }) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const colors = COLORS[toast.type]

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 16)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (hovered) { if (timerRef.current) clearTimeout(timerRef.current); return }
    timerRef.current = setTimeout(() => handleDismiss(), DURATION)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [hovered])

  const handleDismiss = useCallback(() => {
    setVisible(false)
    setTimeout(() => onDismiss(toast.id), 300)
  }, [toast.id, onDismiss])

  const distFromTop = total - 1 - index
  const isCollapsed = !hovered && distFromTop > 0
  const scale = isCollapsed ? 1 - distFromTop * 0.04 : 1
  const translateY = isCollapsed ? distFromTop * -8 : 0
  const opacity = distFromTop > 2 ? 0 : 1

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        transform: visible
          ? \`translateY(\${hovered ? index * -76 : translateY}px) scale(\${scale})\`
          : 'translateY(24px) scale(0.96)',
        opacity: visible ? opacity : 0,
        transition: 'transform 280ms cubic-bezier(0.32, 0.72, 0, 1), opacity 280ms ease',
        zIndex: index + 1,
      }}
    >
      <div style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '12px',
        padding: '12px 14px 14px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        position: 'relative', overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}>
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%',
          background: colors.bg, border: \`1px solid \${colors.border}\`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginTop: '1px',
        }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: colors.icon, lineHeight: 1 }}>
            {ICONS[toast.type]}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: '18px' }}>
            {toast.title}
          </p>
          {toast.message && (
            <p style={{ margin: '2px 0 0', fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.64)', letterSpacing: '-0.01em', lineHeight: '17px' }}>
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={handleDismiss}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'rgba(10,10,10,0.4)', fontSize: '14px', lineHeight: 1, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}
        >✕</button>
        <ProgressBar color={colors.progress} paused={hovered} />
      </div>
    </div>
  )
}

export function ToastStack() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counterRef = useRef(0)

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = ++counterRef.current
    setToasts(prev => [...prev.slice(-4), { id, type, title, message }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <div>
      {/* Trigger buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {(['success', 'error', 'info', 'warning'] as ToastType[]).map(type => (
          <button key={type} onClick={() => addToast(type, type.charAt(0).toUpperCase() + type.slice(1), 'Sample message')}>
            {type}
          </button>
        ))}
      </div>

      {/* Stack — position this fixed/absolute in your real app */}
      <div style={{ width: '320px', height: '80px', position: 'relative', marginTop: '24px' }}>
        {toasts.map((toast, i) => (
          <Toast key={toast.id} toast={toast} onDismiss={removeToast} index={i} total={toasts.length} />
        ))}
      </div>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ToastStackPage() {
  return (
    <main style={{ backgroundColor: 'var(--bg, #ffffff)', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>

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
        <ToastStack />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted, rgba(10,10,10,0.4))', marginBottom: '12px' }}>
          Source
        </p>
        <div style={{
          background: '#0a0a0a',
          borderRadius: '12px',
          padding: '20px',
          overflowX: 'auto',
          position: 'relative',
        }}>
          <pre style={{ margin: 0, fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace', fontSize: '12px', lineHeight: '1.65', color: '#e5e5e5', whiteSpace: 'pre', overflowX: 'auto' }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
