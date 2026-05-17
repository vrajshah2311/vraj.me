'use client'

import { useState, useRef, useCallback, useEffect, KeyboardEvent, ClipboardEvent } from 'react'

// ─── PinInput ─────────────────────────────────────────────────────────────────

function PinInput({
  length = 6,
  onComplete,
  disabled = false,
  error = false,
}: {
  length?: number
  onComplete?: (value: string) => void
  disabled?: boolean
  error?: boolean
}) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''))
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const [shake, setShake] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (error) {
      setShake(true)
      const t = setTimeout(() => setShake(false), 500)
      return () => clearTimeout(t)
    }
  }, [error])

  const focusAt = useCallback((i: number) => {
    inputRefs.current[Math.max(0, Math.min(i, length - 1))]?.focus()
  }, [length])

  const handleChange = useCallback((index: number, raw: string) => {
    const char = raw.replace(/\D/g, '').slice(-1)
    if (!char) return
    const next = [...values]
    next[index] = char
    setValues(next)
    if (index < length - 1) {
      focusAt(index + 1)
    } else {
      inputRefs.current[index]?.blur()
    }
    if (next.every(v => v !== '')) {
      onComplete?.(next.join(''))
    }
  }, [values, length, focusAt, onComplete])

  const handleKeyDown = useCallback((index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const next = [...values]
      if (next[index]) {
        next[index] = ''
        setValues(next)
      } else if (index > 0) {
        next[index - 1] = ''
        setValues(next)
        focusAt(index - 1)
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusAt(index - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusAt(index + 1)
    } else if (e.key === 'Delete') {
      e.preventDefault()
      const next = [...values]
      next[index] = ''
      setValues(next)
    }
  }, [values, focusAt])

  const handlePaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    const next = [...values]
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setValues(next)
    const nextFocus = Math.min(pasted.length, length - 1)
    focusAt(nextFocus)
    if (next.every(v => v !== '')) onComplete?.(next.join(''))
  }, [values, length, focusAt, onComplete])

  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index)
    setTimeout(() => inputRefs.current[index]?.select(), 0)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        transform: shake ? 'translateX(0)' : 'none',
        animation: shake ? 'pin-shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97)' : 'none',
      }}
    >
      <style>{`
        @keyframes pin-shake {
          0%,100%  { transform: translateX(0) }
          15%      { transform: translateX(-6px) }
          30%      { transform: translateX(5px) }
          45%      { transform: translateX(-4px) }
          60%      { transform: translateX(3px) }
          75%      { transform: translateX(-2px) }
          90%      { transform: translateX(1px) }
        }
      `}</style>
      {Array.from({ length }).map((_, i) => {
        const isFocused = focusedIndex === i
        const hasValue = !!values[i]
        const isError = error

        return (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={values[i]}
            disabled={disabled}
            onFocus={() => handleFocus(i)}
            onBlur={() => setFocusedIndex(null)}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            style={{
              width: '44px',
              height: '52px',
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: isError ? '#dc2626' : '#0a0a0a',
              background: hasValue ? '#fff' : 'rgba(10,10,10,0.03)',
              border: `1.5px solid ${
                isError
                  ? 'rgba(220,38,38,0.5)'
                  : isFocused
                  ? '#0a0a0a'
                  : hasValue
                  ? 'rgba(10,10,10,0.2)'
                  : 'rgba(10,10,10,0.1)'
              }`,
              borderRadius: '10px',
              outline: 'none',
              cursor: disabled ? 'not-allowed' : 'text',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              boxShadow: isFocused
                ? isError
                  ? '0 0 0 3px rgba(220,38,38,0.12)'
                  : '0 0 0 3px rgba(10,10,10,0.08)'
                : 'none',
              transition: 'border-color 150ms ease, box-shadow 150ms ease, background 150ms ease',
              caretColor: 'transparent',
            }}
          />
        )
      })}
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

type DemoState = 'idle' | 'loading' | 'success' | 'error'

const CORRECT_PIN = '241536'

function Demo() {
  const [state, setState] = useState<DemoState>('idle')
  const [errorKey, setErrorKey] = useState(0)
  const [hint, setHint] = useState<string | null>(null)

  const handleComplete = useCallback(async (value: string) => {
    setState('loading')
    setHint(null)
    await new Promise(r => setTimeout(r, 900))
    if (value === CORRECT_PIN) {
      setState('success')
      setHint('Access granted')
    } else {
      setState('error')
      setErrorKey(k => k + 1)
      setHint('Incorrect code — try 241536')
      setTimeout(() => setState('idle'), 1800)
    }
  }, [])

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '16px',
        padding: '32px 28px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.07)',
        width: '380px',
        maxWidth: '100%',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background:
            state === 'success'
              ? '#f0fdf4'
              : state === 'error'
              ? '#fef2f2'
              : 'rgba(10,10,10,0.04)',
          border: `1px solid ${
            state === 'success'
              ? 'rgba(22,163,74,0.2)'
              : state === 'error'
              ? 'rgba(220,38,38,0.2)'
              : 'rgba(10,10,10,0.08)'
          }`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 300ms ease, border-color 300ms ease',
        }}
      >
        {state === 'success' ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 9.5L7.5 13L14 6" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : state === 'error' ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M5.5 5.5L12.5 12.5M12.5 5.5L5.5 12.5" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="3" y="8" width="12" height="8" rx="2" stroke="#0a0a0a" strokeWidth="1.5" strokeOpacity="0.5" />
            <path d="M6 8V6a3 3 0 0 1 6 0v2" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
          </svg>
        )}
      </div>

      {/* Heading */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
          Verification Code
        </p>
        <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'rgba(10,10,10,0.45)', fontWeight: 500, letterSpacing: '-0.01em' }}>
          Enter the 6-digit code sent to your device
        </p>
      </div>

      {/* Inputs */}
      <PinInput
        key={errorKey}
        length={6}
        onComplete={handleComplete}
        disabled={state === 'loading' || state === 'success'}
        error={state === 'error'}
      />

      {/* State feedback */}
      <div
        style={{
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {state === 'loading' && (
          <Spinner />
        )}
        {hint && state !== 'loading' && (
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              fontWeight: 500,
              color: state === 'success' ? '#16a34a' : '#dc2626',
              letterSpacing: '-0.01em',
              transition: 'opacity 200ms ease',
            }}
          >
            {hint}
          </p>
        )}
      </div>

      <p style={{ margin: 0, fontSize: '11.5px', color: 'rgba(10,10,10,0.35)', fontWeight: 500, letterSpacing: '-0.01em' }}>
        Paste, arrow keys, and backspace all work
      </p>
    </div>
  )
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ animation: 'pin-spin 0.7s linear infinite' }}
    >
      <style>{`@keyframes pin-spin { to { transform: rotate(360deg) } }`}</style>
      <circle cx="8" cy="8" r="6" stroke="rgba(10,10,10,0.12)" strokeWidth="2" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useCallback, useEffect, KeyboardEvent, ClipboardEvent } from 'react'

export function PinInput({
  length = 6,
  onComplete,
  disabled = false,
  error = false,
}: {
  length?: number
  onComplete?: (value: string) => void
  disabled?: boolean
  error?: boolean
}) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''))
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const [shake, setShake] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (error) {
      setShake(true)
      const t = setTimeout(() => setShake(false), 500)
      return () => clearTimeout(t)
    }
  }, [error])

  const focusAt = useCallback((i: number) => {
    inputRefs.current[Math.max(0, Math.min(i, length - 1))]?.focus()
  }, [length])

  const handleChange = useCallback((index: number, raw: string) => {
    const char = raw.replace(/\\D/g, '').slice(-1)
    if (!char) return
    const next = [...values]
    next[index] = char
    setValues(next)
    if (index < length - 1) {
      focusAt(index + 1)
    } else {
      inputRefs.current[index]?.blur()
    }
    if (next.every(v => v !== '')) onComplete?.(next.join(''))
  }, [values, length, focusAt, onComplete])

  const handleKeyDown = useCallback((index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const next = [...values]
      if (next[index]) {
        next[index] = ''
        setValues(next)
      } else if (index > 0) {
        next[index - 1] = ''
        setValues(next)
        focusAt(index - 1)
      }
    } else if (e.key === 'ArrowLeft')  { e.preventDefault(); focusAt(index - 1) }
      else if (e.key === 'ArrowRight') { e.preventDefault(); focusAt(index + 1) }
      else if (e.key === 'Delete')     { e.preventDefault(); const n=[...values]; n[index]=''; setValues(n) }
  }, [values, focusAt])

  const handlePaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\\D/g, '').slice(0, length)
    if (!pasted) return
    const next = [...values]
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setValues(next)
    focusAt(Math.min(pasted.length, length - 1))
    if (next.every(v => v !== '')) onComplete?.(next.join(''))
  }, [values, length, focusAt, onComplete])

  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index)
    setTimeout(() => inputRefs.current[index]?.select(), 0)
  }, [])

  return (
    <div style={{
      display: 'flex', gap: '8px',
      animation: shake ? 'pin-shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97)' : 'none',
    }}>
      <style>{\`
        @keyframes pin-shake {
          0%,100% { transform: translateX(0) }
          15%     { transform: translateX(-6px) }
          30%     { transform: translateX(5px) }
          45%     { transform: translateX(-4px) }
          60%     { transform: translateX(3px) }
          75%     { transform: translateX(-2px) }
          90%     { transform: translateX(1px) }
        }
      \`}</style>
      {Array.from({ length }).map((_, i) => {
        const isFocused = focusedIndex === i
        const hasValue  = !!values[i]
        return (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={values[i]}
            disabled={disabled}
            onFocus={() => handleFocus(i)}
            onBlur={() => setFocusedIndex(null)}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            style={{
              width: '44px', height: '52px',
              textAlign: 'center',
              fontSize: '20px', fontWeight: 600,
              color: error ? '#dc2626' : '#0a0a0a',
              background: hasValue ? '#fff' : 'rgba(10,10,10,0.03)',
              border: \`1.5px solid \${
                error    ? 'rgba(220,38,38,0.5)' :
                isFocused ? '#0a0a0a' :
                hasValue  ? 'rgba(10,10,10,0.2)' :
                             'rgba(10,10,10,0.1)'
              }\`,
              borderRadius: '10px',
              outline: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              boxShadow: isFocused
                ? error
                  ? '0 0 0 3px rgba(220,38,38,0.12)'
                  : '0 0 0 3px rgba(10,10,10,0.08)'
                : 'none',
              transition: 'border-color 150ms ease, box-shadow 150ms ease, background 150ms ease',
              caretColor: 'transparent',
            }}
          />
        )
      })}
    </div>
  )
}

// Usage:
// function OTPStep() {
//   const [error, setError] = useState(false)
//   const [key, setKey] = useState(0)
//
//   const handleComplete = async (code: string) => {
//     const ok = await verifyCode(code)
//     if (!ok) { setError(true); setKey(k => k + 1) }
//   }
//
//   return <PinInput key={key} length={6} onComplete={handleComplete} error={error} />
// }`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PinInputPage() {
  return (
    <main
      style={{
        backgroundColor: 'var(--bg, #ffffff)',
        minHeight: '100vh',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* ── Demo ── */}
      <section
        style={{
          minHeight: '65vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
          padding: '60px 24px',
          gap: '12px',
        }}
      >
        <p
          style={{
            margin: '0 0 12px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.3)',
          }}
        >
          PIN / OTP Input
        </p>
        <Demo />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-muted, rgba(10,10,10,0.4))',
            marginBottom: '12px',
          }}
        >
          Source
        </p>
        <div
          style={{
            background: '#0a0a0a',
            borderRadius: '12px',
            padding: '20px',
            overflowX: 'auto',
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily:
                'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
              fontSize: '12px',
              lineHeight: '1.65',
              color: '#e5e5e5',
              whiteSpace: 'pre',
              overflowX: 'auto',
            }}
          >
            {CODE}
          </pre>
        </div>
      </section>
    </main>
  )
}
