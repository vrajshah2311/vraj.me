'use client'

import { useState } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type ButtonState = 'idle' | 'loading' | 'success' | 'error'

const CSS = `
  @keyframes morph-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes morph-shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-6px); }
    40%     { transform: translateX(6px); }
    60%     { transform: translateX(-4px); }
    80%     { transform: translateX(4px); }
  }
`

// ── Icons ─────────────────────────────────────────────────────────────────────

function SpinnerIcon({ visible }: { visible: boolean }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 18 18"
      style={{
        position: 'absolute',
        opacity: visible ? 1 : 0,
        transition: 'opacity 160ms ease',
        animation: visible ? 'morph-spin 700ms linear infinite' : 'none',
        pointerEvents: 'none',
      }}
    >
      <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.22)" strokeWidth="2" fill="none" />
      <circle
        cx="9" cy="9" r="7"
        stroke="white" strokeWidth="2" fill="none"
        strokeLinecap="round"
        strokeDasharray={44} strokeDashoffset={33}
      />
    </svg>
  )
}

function CheckIcon({ visible }: { visible: boolean }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 18 18"
      style={{
        position: 'absolute',
        opacity: visible ? 1 : 0,
        transition: 'opacity 200ms ease',
        pointerEvents: 'none',
      }}
    >
      <polyline
        points="3.5,9.5 7.5,13.5 14.5,4.5"
        fill="none" stroke="white" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round"
        style={{
          strokeDasharray: 22,
          strokeDashoffset: visible ? 0 : 22,
          transition: visible
            ? 'stroke-dashoffset 300ms cubic-bezier(0.4,0,0.2,1) 80ms'
            : 'stroke-dashoffset 0ms',
        }}
      />
    </svg>
  )
}

function XIcon({ visible }: { visible: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16"
      style={{
        position: 'absolute',
        opacity: visible ? 1 : 0,
        transition: 'opacity 180ms ease',
        pointerEvents: 'none',
      }}
    >
      <line x1="3.5" y1="3.5" x2="12.5" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="12.5" y1="3.5" x2="3.5" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ── MorphingButton ─────────────────────────────────────────────────────────────

function MorphingButton({
  label = 'Save Changes',
  width = 160,
  onAction,
}: {
  label?: string
  width?: number
  onAction: () => Promise<boolean>
}) {
  const [state, setState] = useState<ButtonState>('idle')
  const [shake, setShake] = useState(false)

  const handleClick = async () => {
    if (state !== 'idle') return
    setState('loading')
    let ok = false
    try { ok = await onAction() } catch { ok = false }
    if (ok) {
      setState('success')
      setTimeout(() => setState('idle'), 2300)
    } else {
      setState('error')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setTimeout(() => setState('idle'), 2300)
    }
  }

  const isCircle = state !== 'idle'
  const bg = state === 'success' ? '#16a34a' : state === 'error' ? '#dc2626' : '#0a0a0a'
  const statusText = state === 'success' ? 'Saved!' : state === 'error' ? 'Failed' : ''
  const statusColor = state === 'success' ? '#16a34a' : '#dc2626'

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <button
        onClick={handleClick}
        disabled={state !== 'idle'}
        style={{
          height: 42,
          width: isCircle ? '42px' : width + 'px',
          borderRadius: isCircle ? '50%' : '10px',
          border: 'none',
          background: bg,
          cursor: state === 'idle' ? 'pointer' : 'default',
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'width 300ms cubic-bezier(0.4,0,0.2,1), border-radius 300ms cubic-bezier(0.4,0,0.2,1), background 220ms ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          flexShrink: 0,
          animation: shake ? 'morph-shake 400ms cubic-bezier(0.36,0.07,0.19,0.97)' : 'none',
        }}
      >
        <span style={{
          position: 'absolute',
          fontSize: 14, fontWeight: 500, color: '#fff',
          fontFamily: FONT, letterSpacing: '-0.01em',
          opacity: state === 'idle' ? 1 : 0,
          transform: 'scale(' + (state === 'idle' ? '1' : '0.7') + ')',
          transition: 'opacity 180ms ease, transform 220ms ease',
          whiteSpace: 'nowrap', pointerEvents: 'none',
        }}>{label}</span>
        <SpinnerIcon visible={state === 'loading'} />
        <CheckIcon visible={state === 'success'} />
        <XIcon visible={state === 'error'} />
      </button>
      <span style={{
        fontSize: 12, fontWeight: 500,
        fontFamily: FONT, letterSpacing: '-0.01em',
        color: statusColor,
        opacity: statusText ? 1 : 0,
        transform: 'translateY(' + (statusText ? '0px' : '4px') + ')',
        transition: 'opacity 200ms ease, transform 200ms ease',
        height: 16, whiteSpace: 'nowrap',
      }}>{statusText || ' '}</span>
    </div>
  )
}

// ── Demo card ─────────────────────────────────────────────────────────────────

function ScenarioCard({
  label,
  description,
  color,
  onAction,
}: {
  label: string
  description: string
  color: string
  onAction: () => Promise<boolean>
}) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: 16,
      padding: '28px 32px 24px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      minWidth: 200,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: color, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
      </div>
      <MorphingButton label={label} onAction={onAction} />
      <span style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.01em',
        color: 'rgba(10,10,10,0.35)', fontFamily: FONT, textAlign: 'center',
      }}>{description}</span>
    </div>
  )
}

const simulateSuccess = (): Promise<boolean> =>
  new Promise(r => setTimeout(() => r(true), 1600))

const simulateError = (): Promise<boolean> =>
  new Promise(r => setTimeout(() => r(false), 1600))

const simulateRandom = (): Promise<boolean> =>
  new Promise(r => setTimeout(() => r(Math.random() > 0.45), 1600))

function Demo() {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
      <ScenarioCard
        label="Save Changes"
        description="Always succeeds"
        color="#16a34a"
        onAction={simulateSuccess}
      />
      <ScenarioCard
        label="Send Invite"
        description="~55% success rate"
        color="#6366f1"
        onAction={simulateRandom}
      />
      <ScenarioCard
        label="Delete File"
        description="Always fails"
        color="#dc2626"
        onAction={simulateError}
      />
    </div>
  )
}

// ── Code source ───────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type ButtonState = 'idle' | 'loading' | 'success' | 'error'

const CSS = \`
  @keyframes morph-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes morph-shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-6px); }
    40%     { transform: translateX(6px); }
    60%     { transform: translateX(-4px); }
    80%     { transform: translateX(4px); }
  }
\`

function SpinnerIcon({ visible }: { visible: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18"
      style={{ position: 'absolute', opacity: visible ? 1 : 0, transition: 'opacity 160ms ease',
        animation: visible ? 'morph-spin 700ms linear infinite' : 'none', pointerEvents: 'none' }}
    >
      <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.22)" strokeWidth="2" fill="none" />
      <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="2" fill="none"
        strokeLinecap="round" strokeDasharray={44} strokeDashoffset={33} />
    </svg>
  )
}

function CheckIcon({ visible }: { visible: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18"
      style={{ position: 'absolute', opacity: visible ? 1 : 0, transition: 'opacity 200ms ease', pointerEvents: 'none' }}
    >
      <polyline
        points="3.5,9.5 7.5,13.5 14.5,4.5"
        fill="none" stroke="white" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round"
        style={{
          strokeDasharray: 22,
          strokeDashoffset: visible ? 0 : 22,
          transition: visible
            ? 'stroke-dashoffset 300ms cubic-bezier(0.4,0,0.2,1) 80ms'
            : 'stroke-dashoffset 0ms',
        }}
      />
    </svg>
  )
}

function XIcon({ visible }: { visible: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16"
      style={{ position: 'absolute', opacity: visible ? 1 : 0, transition: 'opacity 180ms ease', pointerEvents: 'none' }}
    >
      <line x1="3.5" y1="3.5" x2="12.5" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="12.5" y1="3.5" x2="3.5" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function MorphingButton({
  label = 'Save Changes',
  width = 160,
  onAction,
}: {
  label?: string
  width?: number
  onAction: () => Promise<boolean>
}) {
  const [state, setState] = useState<ButtonState>('idle')
  const [shake, setShake] = useState(false)

  const handleClick = async () => {
    if (state !== 'idle') return
    setState('loading')
    let ok = false
    try { ok = await onAction() } catch { ok = false }
    if (ok) {
      setState('success')
      setTimeout(() => setState('idle'), 2300)
    } else {
      setState('error')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setTimeout(() => setState('idle'), 2300)
    }
  }

  const isCircle = state !== 'idle'
  const bg = state === 'success' ? '#16a34a' : state === 'error' ? '#dc2626' : '#0a0a0a'
  const statusText = state === 'success' ? 'Saved!' : state === 'error' ? 'Failed' : ''
  const statusColor = state === 'success' ? '#16a34a' : '#dc2626'

  return (
    <>
      <style>{\`
        @keyframes morph-spin { to { transform: rotate(360deg); } }
        @keyframes morph-shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      \`}</style>
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <button
          onClick={handleClick}
          disabled={state !== 'idle'}
          style={{
            height: 42,
            width: isCircle ? '42px' : width + 'px',
            borderRadius: isCircle ? '50%' : '10px',
            border: 'none',
            background: bg,
            cursor: state === 'idle' ? 'pointer' : 'default',
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'width 300ms cubic-bezier(0.4,0,0.2,1), border-radius 300ms cubic-bezier(0.4,0,0.2,1), background 220ms ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            flexShrink: 0,
            animation: shake ? 'morph-shake 400ms cubic-bezier(0.36,0.07,0.19,0.97)' : 'none',
          }}
        >
          <span style={{
            position: 'absolute',
            fontSize: 14, fontWeight: 500, color: '#fff',
            fontFamily: FONT, letterSpacing: '-0.01em',
            opacity: state === 'idle' ? 1 : 0,
            transform: 'scale(' + (state === 'idle' ? '1' : '0.7') + ')',
            transition: 'opacity 180ms ease, transform 220ms ease',
            whiteSpace: 'nowrap', pointerEvents: 'none',
          }}>{label}</span>
          <SpinnerIcon visible={state === 'loading'} />
          <CheckIcon visible={state === 'success'} />
          <XIcon visible={state === 'error'} />
        </button>
        <span style={{
          fontSize: 12, fontWeight: 500, fontFamily: FONT, letterSpacing: '-0.01em',
          color: statusColor,
          opacity: statusText ? 1 : 0,
          transform: 'translateY(' + (statusText ? '0px' : '4px') + ')',
          transition: 'opacity 200ms ease, transform 200ms ease',
          height: 16, whiteSpace: 'nowrap',
        }}>{statusText || ' '}</span>
      </div>
    </>
  )
}

// ── Usage ──────────────────────────────────────────────────────────────────────
//
// <MorphingButton
//   label="Save Changes"
//   onAction={async () => {
//     const res = await saveToAPI()
//     return res.ok          // return true → success, false/throw → error
//   }}
// />`

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MorphingButtonPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>
      <style>{CSS}</style>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: 32,
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            margin: '0 0 6px',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
            textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)',
            fontFamily: FONT,
          }}>Interactive demo</p>
          <p style={{
            margin: 0, fontSize: 13, fontWeight: 500, color: 'rgba(10,10,10,0.5)',
            letterSpacing: '-0.01em', fontFamily: FONT,
          }}>Click any button to watch it morph through each state</p>
        </div>
        <Demo />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)',
          marginBottom: '12px', fontFamily: FONT,
        }}>Source</p>
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
