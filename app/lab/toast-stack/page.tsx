'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ── Types ─────────────────────────────────────────────────────────────────────

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'loading'

type Toast = {
  id: string
  type: ToastType
  title: string
  description?: string
  duration: number
}

// ── Config ────────────────────────────────────────────────────────────────────

const TOAST_CONFIG: Record<ToastType, { icon: string; accent: string; bg: string; border: string }> = {
  default: {
    icon: '◆',
    accent: '#0a0a0a',
    bg: '#fff',
    border: 'rgba(0,0,0,0.09)',
  },
  success: {
    icon: '✓',
    accent: 'rgba(5,150,105,0.9)',
    bg: '#fff',
    border: 'rgba(16,185,129,0.18)',
  },
  error: {
    icon: '✕',
    accent: 'rgba(220,38,38,0.9)',
    bg: '#fff',
    border: 'rgba(239,68,68,0.18)',
  },
  warning: {
    icon: '⚠',
    accent: 'rgba(217,119,6,0.9)',
    bg: '#fff',
    border: 'rgba(245,158,11,0.18)',
  },
  loading: {
    icon: '◌',
    accent: 'rgba(0,0,0,0.45)',
    bg: '#fff',
    border: 'rgba(0,0,0,0.09)',
  },
}

// ── ToastItem ─────────────────────────────────────────────────────────────────

function ToastItem({
  toast,
  index,
  total,
  onRemove,
}: {
  toast: Toast
  index: number
  total: number
  onRemove: (id: string) => void
}) {
  const [mounted, setMounted] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [progress, setProgress] = useState(100)
  const startTimeRef = useRef<number>(0)
  const remainingRef = useRef<number>(toast.duration)
  const rafRef = useRef<number>(0)
  const cfg = TOAST_CONFIG[toast.type]

  // Mount animation
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [])

  // Progress bar countdown
  useEffect(() => {
    if (toast.type === 'loading') return

    const tick = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now
      if (hovered) {
        startTimeRef.current = now - (toast.duration - remainingRef.current)
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      const elapsed = now - startTimeRef.current
      remainingRef.current = Math.max(0, toast.duration - elapsed)
      const pct = (remainingRef.current / toast.duration) * 100
      setProgress(pct)
      if (remainingRef.current <= 0) {
        dismiss()
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [hovered, toast.type, toast.duration])

  const dismiss = useCallback(() => {
    setLeaving(true)
    setTimeout(() => onRemove(toast.id), 300)
  }, [toast.id, onRemove])

  // Stack transform: items behind the front one are peeked at the bottom
  const stackDepth = total - 1 - index
  const isFront = stackDepth === 0
  const isVisible = stackDepth <= 2

  const translateY = isFront ? 0 : stackDepth * 8
  const scale = isFront ? 1 : 1 - stackDepth * 0.04
  const opacity = isVisible ? (isFront ? 1 : 1 - stackDepth * 0.15) : 0
  const zIndex = total - stackDepth

  const enterTransform = mounted ? `translateY(${translateY}px) scale(${scale})` : 'translateY(24px) scale(0.96)'
  const leaveTransform = leaving ? 'translateX(calc(100% + 24px))' : enterTransform

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex,
        transform: leaveTransform,
        opacity: leaving ? 0 : opacity,
        transition: leaving
          ? 'transform 280ms cubic-bezier(0.4,0,1,1), opacity 280ms ease'
          : 'transform 320ms cubic-bezier(0.34,1.2,0.64,1), opacity 200ms ease',
        pointerEvents: isFront ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          borderRadius: 12,
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          fontFamily: font,
        }}
      >
        <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          {/* Icon */}
          <div
            style={{
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: toast.type === 'loading' ? 16 : 12,
              color: cfg.accent,
              fontWeight: 600,
              marginTop: 1,
              animation: toast.type === 'loading' ? 'spin 1s linear infinite' : 'none',
            }}
          >
            {cfg.icon}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#0a0a0a',
                letterSpacing: '-0.02em',
                lineHeight: 1.3,
              }}
            >
              {toast.title}
            </div>
            {toast.description && (
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: 'rgba(0,0,0,0.45)',
                  letterSpacing: '-0.01em',
                  marginTop: 2,
                  lineHeight: 1.4,
                }}
              >
                {toast.description}
              </div>
            )}
          </div>

          {/* Dismiss button */}
          <button
            onClick={dismiss}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(0,0,0,0.3)',
              flexShrink: 0,
              borderRadius: 4,
              transition: 'color 0.12s ease, background 0.12s ease',
              marginTop: 1,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#0a0a0a'
              e.currentTarget.style.background = 'rgba(0,0,0,0.06)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(0,0,0,0.3)'
              e.currentTarget.style.background = 'none'
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 2L10 10M10 2L2 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        {toast.type !== 'loading' && (
          <div
            style={{
              height: 2,
              background: 'rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: cfg.accent,
                opacity: 0.5,
                transition: hovered ? 'none' : 'width 80ms linear',
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Toaster ───────────────────────────────────────────────────────────────────

function Toaster({
  toasts,
  onRemove,
}: {
  toasts: Toast[]
  onRemove: (id: string) => void
}) {
  const containerHeight = toasts.length > 0 ? 80 + Math.min(toasts.length - 1, 2) * 8 : 0

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 340,
        zIndex: 9999,
        height: containerHeight,
        transition: 'height 300ms cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: toasts.length === 0 ? 'none' : 'auto',
      }}
    >
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          index={index}
          total={toasts.length}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

// ── Demo ──────────────────────────────────────────────────────────────────────

const PRESETS: { label: string; type: ToastType; title: string; description?: string; duration?: number }[] = [
  { label: 'Default', type: 'default', title: 'Reminder', description: 'Your meeting starts in 5 minutes.' },
  { label: 'Success', type: 'success', title: 'Changes saved', description: 'Your changes have been published.' },
  { label: 'Error', type: 'error', title: 'Upload failed', description: 'File size exceeds the 10 MB limit.' },
  { label: 'Warning', type: 'warning', title: 'Storage almost full', description: 'You\'ve used 90% of your quota.' },
  { label: 'Loading', type: 'loading', title: 'Deploying...', description: 'This usually takes a few seconds.', duration: 99999 },
]

function Demo() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (preset: typeof PRESETS[0]) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts(prev => [
      ...prev,
      {
        id,
        type: preset.type,
        title: preset.title,
        description: preset.description,
        duration: preset.duration ?? 4000,
      },
    ])
  }

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '40px 24px',
        fontFamily: font,
      }}
    >
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow:
            '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)',
          padding: '24px',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#0a0a0a',
              letterSpacing: '-0.02em',
            }}
          >
            Toast notifications
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'rgba(0,0,0,0.35)',
              marginTop: 3,
              lineHeight: 1.4,
            }}
          >
            Stack up to 3 visible · hover to pause · auto-dismiss
          </div>
        </div>

        {/* Preset buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PRESETS.map(preset => {
            const cfg = TOAST_CONFIG[preset.type]
            return (
              <button
                key={preset.type}
                onClick={() => addToast(preset)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left' as const,
                  transition: 'background 0.12s ease, border-color 0.12s ease',
                  width: '100%',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.025)'
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fff'
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `${cfg.border}`,
                    border: `1px solid ${cfg.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    color: cfg.accent,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {cfg.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#0a0a0a',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {preset.label}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: 'rgba(0,0,0,0.35)',
                      letterSpacing: '-0.01em',
                      marginTop: 1,
                    }}
                  >
                    {preset.title}
                  </div>
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  style={{ color: 'rgba(0,0,0,0.2)', flexShrink: 0 }}
                >
                  <path
                    d="M5.5 3.5L9 7L5.5 10.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )
          })}
        </div>

        {/* Dismiss all */}
        {toasts.length > 1 && (
          <button
            onClick={() => setToasts([])}
            style={{
              marginTop: 12,
              width: '100%',
              padding: '9px 16px',
              background: 'transparent',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 500,
              color: 'rgba(0,0,0,0.45)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '-0.01em',
              transition: 'background 0.12s ease, color 0.12s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.04)'
              e.currentTarget.style.color = '#0a0a0a'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'rgba(0,0,0,0.45)'
            }}
          >
            Dismiss all ({toasts.length})
          </button>
        )}
      </div>

      <Toaster toasts={toasts} onRemove={removeToast} />
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
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: font,
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

import { useState, useEffect, useRef, useCallback } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'loading'
type Toast = { id: string; type: ToastType; title: string; description?: string; duration: number }

const TOAST_CONFIG = {
  default: { icon: '◆', accent: '#0a0a0a', border: 'rgba(0,0,0,0.09)' },
  success: { icon: '✓', accent: 'rgba(5,150,105,0.9)', border: 'rgba(16,185,129,0.18)' },
  error:   { icon: '✕', accent: 'rgba(220,38,38,0.9)', border: 'rgba(239,68,68,0.18)' },
  warning: { icon: '⚠', accent: 'rgba(217,119,6,0.9)', border: 'rgba(245,158,11,0.18)' },
  loading: { icon: '◌', accent: 'rgba(0,0,0,0.45)', border: 'rgba(0,0,0,0.09)' },
}

function ToastItem({ toast, index, total, onRemove }) {
  const [mounted, setMounted] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [progress, setProgress] = useState(100)
  const startTimeRef = useRef(0)
  const remainingRef = useRef(toast.duration)
  const rafRef = useRef(0)
  const cfg = TOAST_CONFIG[toast.type]

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [])

  useEffect(() => {
    if (toast.type === 'loading') return
    const tick = (now) => {
      if (!startTimeRef.current) startTimeRef.current = now
      if (hovered) {
        startTimeRef.current = now - (toast.duration - remainingRef.current)
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      const elapsed = now - startTimeRef.current
      remainingRef.current = Math.max(0, toast.duration - elapsed)
      setProgress((remainingRef.current / toast.duration) * 100)
      if (remainingRef.current <= 0) { dismiss(); return }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [hovered, toast.type, toast.duration])

  const dismiss = useCallback(() => {
    setLeaving(true)
    setTimeout(() => onRemove(toast.id), 300)
  }, [toast.id, onRemove])

  const stackDepth = total - 1 - index
  const isFront = stackDepth === 0
  const isVisible = stackDepth <= 2
  const translateY = isFront ? 0 : stackDepth * 8
  const scale = isFront ? 1 : 1 - stackDepth * 0.04
  const opacity = isVisible ? (isFront ? 1 : 1 - stackDepth * 0.15) : 0
  const zIndex = total - stackDepth
  const enterTransform = mounted ? \`translateY(\${translateY}px) scale(\${scale})\` : 'translateY(24px) scale(0.96)'
  const leaveTransform = leaving ? 'translateX(calc(100% + 24px))' : enterTransform

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex,
        transform: leaveTransform,
        opacity: leaving ? 0 : opacity,
        transition: leaving
          ? 'transform 280ms cubic-bezier(0.4,0,1,1), opacity 280ms ease'
          : 'transform 320ms cubic-bezier(0.34,1.2,0.64,1), opacity 200ms ease',
        pointerEvents: isFront ? 'auto' : 'none',
      }}
    >
      <div style={{
        background: '#fff',
        border: \`1px solid \${cfg.border}\`,
        borderRadius: 12,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        fontFamily: font,
      }}>
        <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{
            width: 20, height: 20, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0, fontSize: 12, color: cfg.accent,
            fontWeight: 600, marginTop: 1,
            animation: toast.type === 'loading' ? 'spin 1s linear infinite' : 'none',
          }}>
            {cfg.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
              {toast.title}
            </div>
            {toast.description && (
              <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginTop: 2, lineHeight: 1.4 }}>
                {toast.description}
              </div>
            )}
          </div>
          <button
            onClick={dismiss}
            style={{
              background: 'none', border: 'none', padding: '2px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', color: 'rgba(0,0,0,0.3)',
              borderRadius: 4, transition: 'color 0.12s ease', marginTop: 1,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {toast.type !== 'loading' && (
          <div style={{ height: 2, background: 'rgba(0,0,0,0.06)' }}>
            <div style={{
              height: '100%', width: \`\${progress}%\`,
              background: cfg.accent, opacity: 0.5,
              transition: hovered ? 'none' : 'width 80ms linear',
            }} />
          </div>
        )}
      </div>
    </div>
  )
}

export function Toaster({ toasts, onRemove }) {
  const containerHeight = toasts.length > 0 ? 80 + Math.min(toasts.length - 1, 2) * 8 : 0
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, width: 340, zIndex: 9999,
      height: containerHeight,
      transition: 'height 300ms cubic-bezier(0.4,0,0.2,1)',
      pointerEvents: toasts.length === 0 ? 'none' : 'auto',
    }}>
      <style>{\`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }\`}</style>
      {toasts.map((toast, index) => (
        <ToastItem key={toast.id} toast={toast} index={index} total={toasts.length} onRemove={onRemove} />
      ))}
    </div>
  )
}

// Usage
export default function App() {
  const [toasts, setToasts] = useState([])

  const addToast = (type, title, description, duration = 4000) => {
    const id = String(Date.now())
    setToasts(prev => [...prev, { id, type, title, description, duration }])
  }

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <div style={{ padding: 24, fontFamily: '-apple-system, sans-serif' }}>
      <button onClick={() => addToast('success', 'Changes saved', 'Your post has been published.')}>
        Show success
      </button>
      <button onClick={() => addToast('error', 'Upload failed', 'File exceeds 10 MB limit.')}>
        Show error
      </button>
      <Toaster toasts={toasts} onRemove={removeToast} />
    </div>
  )
}`

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ToastStackPage() {
  return (
    <div style={{ background: '#fff' }}>
      {/* DEMO */}
      <Demo />

      {/* CODE */}
      <div
        style={{
          background: '#0a0a0a',
          padding: 'clamp(24px, 4vw, 48px)' as any,
          fontFamily: font,
        }}
      >
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                  marginBottom: 2,
                }}
              >
                Toast Notification Stack
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.35)',
                  fontWeight: 500,
                }}
              >
                Drop into any React project — zero dependencies
              </div>
            </div>
            <CopyButton text={CODE_SOURCE} />
          </div>

          <div
            style={{
              background: '#111',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '10px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 500,
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                ToastStack.tsx
              </div>
            </div>
            <pre
              style={{
                margin: 0,
                padding: '20px',
                overflowX: 'auto',
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                fontSize: 12.5,
                lineHeight: 1.65,
                color: '#e5e5e5',
                scrollbarWidth: 'thin' as any,
                scrollbarColor: 'rgba(255,255,255,0.1) transparent',
              }}
            >
              <code>{CODE_SOURCE}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
