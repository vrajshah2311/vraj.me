'use client'

import { useState, useEffect, useRef } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type ButtonState = 'idle' | 'loading' | 'success' | 'error'

function MorphingButton({
  label,
  variant = 'primary',
  onAction,
}: {
  label: string
  variant?: 'primary' | 'secondary'
  onAction: () => Promise<void>
}) {
  const [state, setState] = useState<ButtonState>('idle')
  const [w, setW] = useState<number | null>(null)
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (ref.current) setW(ref.current.offsetWidth)
  }, [])

  const run = async () => {
    if (state !== 'idle') return
    setState('loading')
    try {
      await onAction()
      setState('success')
    } catch {
      setState('error')
    }
    setTimeout(() => setState('idle'), 2200)
  }

  const p = variant === 'primary'
  const collapsed = state !== 'idle'

  const bg =
    state === 'success' ? (p ? '#059669' : 'rgba(5,150,105,0.08)') :
    state === 'error'   ? (p ? '#dc2626' : 'rgba(220,38,38,0.08)') :
    p ? '#0a0a0a' : 'rgba(0,0,0,0.03)'

  const bd =
    state === 'success' ? 'rgba(5,150,105,0.28)' :
    state === 'error'   ? 'rgba(220,38,38,0.25)' :
    p ? '#0a0a0a' : 'rgba(0,0,0,0.12)'

  return (
    <button
      ref={ref}
      onClick={run}
      style={{
        width: collapsed ? 44 : (w ?? 'auto') as any,
        height: 44,
        padding: collapsed ? 0 : '0 20px',
        background: bg,
        border: '1px solid ' + bd,
        borderRadius: collapsed ? 22 : 10,
        cursor: state === 'idle' ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        fontFamily: font,
        outline: 'none',
        transition: [
          'width 320ms cubic-bezier(0.4,0,0.2,1)',
          'padding 320ms cubic-bezier(0.4,0,0.2,1)',
          'border-radius 320ms cubic-bezier(0.4,0,0.2,1)',
          'background 250ms ease',
          'border-color 250ms ease',
        ].join(', '),
      }}
    >
      {/* Label */}
      <span style={{
        position: 'absolute',
        fontSize: 14,
        fontWeight: 600,
        color: p ? '#fff' : '#0a0a0a',
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        opacity: state === 'idle' ? 1 : 0,
        transform: state === 'idle' ? 'translateY(0) scale(1)' : 'translateY(3px) scale(0.85)',
        transition: 'opacity 150ms ease, transform 150ms ease',
      }}>
        {label}
      </span>

      {/* Spinner */}
      <span style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: state === 'loading' ? 1 : 0,
        transform: state === 'loading' ? 'scale(1)' : 'scale(0.5)',
        transition: state === 'loading'
          ? 'opacity 180ms ease 220ms, transform 280ms cubic-bezier(0.34,1.4,0.64,1) 220ms'
          : 'opacity 100ms ease, transform 100ms ease',
      }}>
        <style>{`@keyframes mb_spin { to { transform: rotate(360deg); } }`}</style>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ animation: 'mb_spin 0.7s linear infinite' }}>
          <circle cx="10" cy="10" r="7" stroke={p ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} strokeWidth="2" />
          <path d="M10 3 A7 7 0 0 1 17 10" stroke={p ? '#fff' : '#0a0a0a'} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>

      {/* Success check */}
      <span style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: state === 'success' ? 1 : 0,
        transform: state === 'success' ? 'scale(1)' : 'scale(0.3)',
        transition: state === 'success'
          ? 'opacity 200ms ease 80ms, transform 360ms cubic-bezier(0.34,1.56,0.64,1) 80ms'
          : 'opacity 100ms ease, transform 100ms ease',
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 10.5L8.5 14L15 7" stroke={p ? '#fff' : '#059669'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* Error X */}
      <span style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: state === 'error' ? 1 : 0,
        transform: state === 'error' ? 'scale(1)' : 'scale(0.3)',
        transition: state === 'error'
          ? 'opacity 200ms ease 80ms, transform 360ms cubic-bezier(0.34,1.56,0.64,1) 80ms'
          : 'opacity 100ms ease, transform 100ms ease',
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 4L12 12M12 4L4 12" stroke={p ? '#fff' : '#dc2626'} strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </span>
    </button>
  )
}

// ── Demo ──────────────────────────────────────────────────────────────────────

const delay = (ms: number, fail = false) => () =>
  new Promise<void>((resolve, reject) =>
    setTimeout(() => (fail ? reject() : resolve()), ms)
  )

type Row = {
  title: string
  sub: string
  label: string
  variant?: 'primary' | 'secondary'
  ms: number
  fail?: boolean
}

const ROWS: Row[] = [
  { title: 'Save changes',    sub: 'Primary · resolves in 1.6s',  label: 'Save',    variant: 'primary',   ms: 1600 },
  { title: 'Sync workspace',  sub: 'Secondary · resolves in 2s',  label: 'Sync',    variant: 'secondary', ms: 2000 },
  { title: 'Publish draft',   sub: 'Primary · resolves in 1s',    label: 'Publish', variant: 'primary',   ms: 1000 },
  { title: 'Delete account',  sub: 'Secondary · always fails',     label: 'Delete',  variant: 'secondary', ms: 1300, fail: true },
]

function Demo() {
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
        maxWidth: 460,
        background: '#fff',
        borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '22px 24px 16px' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
            Morphing Button
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.38)', marginTop: 3, letterSpacing: '-0.01em', lineHeight: 1.4 }}>
            Click any button to preview the full state transition sequence
          </div>
        </div>

        <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ROWS.map(row => (
            <div
              key={row.title}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 12px',
                background: 'rgba(0,0,0,0.02)',
                borderRadius: 10,
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                  {row.title}
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.38)', marginTop: 2 }}>
                  {row.sub}
                </div>
              </div>
              <MorphingButton
                label={row.label}
                variant={row.variant}
                onAction={delay(row.ms, row.fail)}
              />
            </div>
          ))}
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

import { useState, useEffect, useRef } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type ButtonState = 'idle' | 'loading' | 'success' | 'error'

export function MorphingButton({
  label,
  variant = 'primary',
  onAction,
}: {
  label: string
  variant?: 'primary' | 'secondary'
  onAction: () => Promise<void>
}) {
  const [state, setState] = useState<ButtonState>('idle')
  const [w, setW] = useState<number | null>(null)
  const ref = useRef<HTMLButtonElement>(null)

  // Measure natural width after mount so width transition has a pixel start value
  useEffect(() => {
    if (ref.current) setW(ref.current.offsetWidth)
  }, [])

  const run = async () => {
    if (state !== 'idle') return
    setState('loading')
    try {
      await onAction()
      setState('success')
    } catch {
      setState('error')
    }
    setTimeout(() => setState('idle'), 2200)
  }

  const p = variant === 'primary'
  const collapsed = state !== 'idle'

  const bg =
    state === 'success' ? (p ? '#059669' : 'rgba(5,150,105,0.08)') :
    state === 'error'   ? (p ? '#dc2626' : 'rgba(220,38,38,0.08)') :
    p ? '#0a0a0a' : 'rgba(0,0,0,0.03)'

  const bd =
    state === 'success' ? 'rgba(5,150,105,0.28)' :
    state === 'error'   ? 'rgba(220,38,38,0.25)' :
    p ? '#0a0a0a' : 'rgba(0,0,0,0.12)'

  return (
    <button
      ref={ref}
      onClick={run}
      style={{
        width: collapsed ? 44 : (w ?? 'auto') as any,
        height: 44,
        padding: collapsed ? 0 : '0 20px',
        background: bg,
        border: '1px solid ' + bd,
        borderRadius: collapsed ? 22 : 10,
        cursor: state === 'idle' ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        fontFamily: font,
        outline: 'none',
        transition: [
          'width 320ms cubic-bezier(0.4,0,0.2,1)',
          'padding 320ms cubic-bezier(0.4,0,0.2,1)',
          'border-radius 320ms cubic-bezier(0.4,0,0.2,1)',
          'background 250ms ease',
          'border-color 250ms ease',
        ].join(', '),
      }}
    >
      {/* Label */}
      <span style={{
        position: 'absolute',
        fontSize: 14, fontWeight: 600,
        color: p ? '#fff' : '#0a0a0a',
        letterSpacing: '-0.01em', whiteSpace: 'nowrap', pointerEvents: 'none',
        opacity: state === 'idle' ? 1 : 0,
        transform: state === 'idle' ? 'translateY(0) scale(1)' : 'translateY(3px) scale(0.85)',
        transition: 'opacity 150ms ease, transform 150ms ease',
      }}>
        {label}
      </span>

      {/* Spinner — delayed so it only appears after the button has collapsed */}
      <span style={{
        position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
        opacity: state === 'loading' ? 1 : 0,
        transform: state === 'loading' ? 'scale(1)' : 'scale(0.5)',
        transition: state === 'loading'
          ? 'opacity 180ms ease 220ms, transform 280ms cubic-bezier(0.34,1.4,0.64,1) 220ms'
          : 'opacity 100ms ease, transform 100ms ease',
      }}>
        <style>{\`@keyframes mb_spin { to { transform: rotate(360deg); } }\`}</style>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ animation: 'mb_spin 0.7s linear infinite' }}>
          <circle cx="10" cy="10" r="7" stroke={p ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} strokeWidth="2" />
          <path d="M10 3 A7 7 0 0 1 17 10" stroke={p ? '#fff' : '#0a0a0a'} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>

      {/* Check — spring-pops in on success */}
      <span style={{
        position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
        opacity: state === 'success' ? 1 : 0,
        transform: state === 'success' ? 'scale(1)' : 'scale(0.3)',
        transition: state === 'success'
          ? 'opacity 200ms ease 80ms, transform 360ms cubic-bezier(0.34,1.56,0.64,1) 80ms'
          : 'opacity 100ms ease, transform 100ms ease',
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 10.5L8.5 14L15 7" stroke={p ? '#fff' : '#059669'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* X — spring-pops in on error */}
      <span style={{
        position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
        opacity: state === 'error' ? 1 : 0,
        transform: state === 'error' ? 'scale(1)' : 'scale(0.3)',
        transition: state === 'error'
          ? 'opacity 200ms ease 80ms, transform 360ms cubic-bezier(0.34,1.56,0.64,1) 80ms'
          : 'opacity 100ms ease, transform 100ms ease',
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 4L12 12M12 4L4 12" stroke={p ? '#fff' : '#dc2626'} strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </span>
    </button>
  )
}

// Usage
export default function App() {
  const save = () => new Promise<void>((resolve) => setTimeout(resolve, 1600))
  const del  = () => new Promise<void>((_, reject) => setTimeout(reject, 1200))

  return (
    <div style={{ display: 'flex', gap: 12, padding: 24 }}>
      <MorphingButton label="Save changes" onAction={save} />
      <MorphingButton label="Delete account" variant="secondary" onAction={del} />
    </div>
  )
}`

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MorphingButtonPage() {
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
                Morphing Button
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
                MorphingButton.tsx
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
