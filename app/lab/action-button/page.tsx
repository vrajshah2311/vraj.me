'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <>
      <style>{`@keyframes _ab_spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{
        width: '16px',
        height: '16px',
        border: '2px solid rgba(255,255,255,0.3)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        animation: '_ab_spin 0.65s linear infinite',
        flexShrink: 0,
      }} />
    </>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
      <path d="M1.5 5.5L5.5 9.5L13.5 1.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─── ActionButton ─────────────────────────────────────────────────────────────

type Phase = 'idle' | 'loading' | 'success' | 'error'

interface ActionButtonProps {
  children: string
  outcome?: 'success' | 'error'
  loadingMs?: number
  variant?: 'primary' | 'danger'
}

function ActionButton({
  children,
  outcome = 'success',
  loadingMs = 1400,
  variant = 'primary',
}: ActionButtonProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [naturalW, setNaturalW] = useState<number | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  // Capture the button's natural width once it's rendered
  useEffect(() => {
    if (btnRef.current && naturalW === null) {
      setNaturalW(btnRef.current.offsetWidth)
    }
  }, [naturalW])

  const handleClick = async () => {
    if (phase !== 'idle' || naturalW === null) return
    setPhase('loading')
    await new Promise<void>(r => setTimeout(r, loadingMs))
    setPhase(outcome)
    setTimeout(() => setPhase('idle'), 1600)
  }

  const morphed = phase !== 'idle'
  const idleBg = variant === 'danger' ? '#ef4444' : '#0a0a0a'
  const bg =
    phase === 'success' ? '#16a34a' :
    phase === 'error'   ? '#ef4444' :
    idleBg

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      disabled={phase !== 'idle'}
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: '40px',
        width: naturalW !== null ? (morphed ? '40px' : `${naturalW}px`) : 'auto',
        padding: '0 18px',
        borderRadius: morphed ? '50%' : '9px',
        background: bg,
        border: 'none',
        color: '#fff',
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        cursor: phase === 'idle' ? 'pointer' : 'default',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: naturalW !== null
          ? 'width 280ms cubic-bezier(0.4,0,0.2,1), border-radius 280ms cubic-bezier(0.4,0,0.2,1), background 300ms ease'
          : 'none',
        flexShrink: 0,
      }}
    >
      {/* Label */}
      <span style={{
        opacity: morphed ? 0 : 1,
        transform: morphed ? 'scale(0.75)' : 'scale(1)',
        transition: 'opacity 150ms ease, transform 150ms ease',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}>
        {children}
      </span>

      {/* Icon overlay — fades in after the button starts shrinking */}
      <span style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: morphed ? 1 : 0,
        transform: morphed ? 'scale(1)' : 'scale(0.5)',
        transition: 'opacity 200ms ease 80ms, transform 200ms ease 80ms',
        pointerEvents: 'none',
      }}>
        {phase === 'loading' && <Spinner />}
        {phase === 'success' && <CheckIcon />}
        {phase === 'error'   && <XIcon />}
      </span>
    </button>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

const DEMOS: {
  label: string
  hint: string
  outcome: 'success' | 'error'
  variant: 'primary' | 'danger'
}[] = [
  { label: 'Save changes',   hint: 'Profile settings update',  outcome: 'success', variant: 'primary' },
  { label: 'Send message',   hint: 'Chat or email dispatch',   outcome: 'success', variant: 'primary' },
  { label: 'Request access', hint: 'Permissions workflow',     outcome: 'success', variant: 'primary' },
  { label: 'Delete account', hint: 'Destructive action',       outcome: 'error',   variant: 'danger'  },
]

function Demo() {
  return (
    <div style={{
      width: '460px',
      maxWidth: '100%',
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>
      {/* Card header */}
      <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
          Action Button
        </p>
        <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em' }}>
          Click any button to trigger the state transition
        </p>
      </div>

      {/* Rows */}
      {DEMOS.map((d, i) => (
        <div
          key={d.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '13px 22px',
            borderBottom: i < DEMOS.length - 1 ? '1px solid rgba(10,10,10,0.06)' : 'none',
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
              {d.label}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em' }}>
              {d.hint}
            </p>
          </div>
          <ActionButton outcome={d.outcome} variant={d.variant}>
            {d.label}
          </ActionButton>
        </div>
      ))}
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useEffect, useRef } from 'react'

function Spinner() {
  return (
    <>
      <style>{\`@keyframes _ab_spin{to{transform:rotate(360deg)}}\`}</style>
      <div style={{
        width: '16px', height: '16px',
        border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
        borderRadius: '50%', animation: '_ab_spin 0.65s linear infinite', flexShrink: 0,
      }} />
    </>
  )
}

function CheckIcon() {
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
      <path d="M1.5 5.5L5.5 9.5L13.5 1.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

type Phase = 'idle' | 'loading' | 'success' | 'error'

interface ActionButtonProps {
  children: string
  outcome?: 'success' | 'error'
  loadingMs?: number
  variant?: 'primary' | 'danger'
}

export function ActionButton({
  children,
  outcome = 'success',
  loadingMs = 1400,
  variant = 'primary',
}: ActionButtonProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [naturalW, setNaturalW] = useState<number | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (btnRef.current && naturalW === null) {
      setNaturalW(btnRef.current.offsetWidth)
    }
  }, [naturalW])

  const handleClick = async () => {
    if (phase !== 'idle' || naturalW === null) return
    setPhase('loading')
    await new Promise<void>(r => setTimeout(r, loadingMs))
    setPhase(outcome)
    setTimeout(() => setPhase('idle'), 1600)
  }

  const morphed = phase !== 'idle'
  const idleBg = variant === 'danger' ? '#ef4444' : '#0a0a0a'
  const bg =
    phase === 'success' ? '#16a34a' :
    phase === 'error'   ? '#ef4444' :
    idleBg

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      disabled={phase !== 'idle'}
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: '40px',
        width: naturalW !== null ? (morphed ? '40px' : \`\${naturalW}px\`) : 'auto',
        padding: '0 18px',
        borderRadius: morphed ? '50%' : '9px',
        background: bg,
        border: 'none',
        color: '#fff',
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        cursor: phase === 'idle' ? 'pointer' : 'default',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: naturalW !== null
          ? 'width 280ms cubic-bezier(0.4,0,0.2,1), border-radius 280ms cubic-bezier(0.4,0,0.2,1), background 300ms ease'
          : 'none',
        flexShrink: 0,
      }}
    >
      <span style={{
        opacity: morphed ? 0 : 1,
        transform: morphed ? 'scale(0.75)' : 'scale(1)',
        transition: 'opacity 150ms ease, transform 150ms ease',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}>
        {children}
      </span>

      <span style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: morphed ? 1 : 0,
        transform: morphed ? 'scale(1)' : 'scale(0.5)',
        transition: 'opacity 200ms ease 80ms, transform 200ms ease 80ms',
        pointerEvents: 'none',
      }}>
        {phase === 'loading' && <Spinner />}
        {phase === 'success' && <CheckIcon />}
        {phase === 'error'   && <XIcon />}
      </span>
    </button>
  )
}

// Usage — pass an async onClick and the button handles the rest
// <ActionButton outcome="success" loadingMs={1400}>Save changes</ActionButton>
// <ActionButton outcome="error" variant="danger">Delete account</ActionButton>`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ActionButtonPage() {
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
