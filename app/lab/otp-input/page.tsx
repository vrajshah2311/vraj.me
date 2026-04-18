'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// ─── OTP Input ────────────────────────────────────────────────────────────────

const LENGTH = 6
const DEMO_CODE = '246810'

function OTPInput() {
  const [values, setValues] = useState<string[]>(Array(LENGTH).fill(''))
  const [focused, setFocused] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')
  const [shaking, setShaking] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const statusRef = useRef(status)
  statusRef.current = status

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes otp-shake {
        0%,100% { transform: translateX(0) }
        15%      { transform: translateX(-8px) }
        30%      { transform: translateX(7px) }
        45%      { transform: translateX(-5px) }
        60%      { transform: translateX(4px) }
        75%      { transform: translateX(-3px) }
        90%      { transform: translateX(2px) }
      }
    `
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  const focusAt = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(LENGTH - 1, index))
    inputRefs.current[clamped]?.focus()
  }, [])

  const verify = useCallback((vals: string[]) => {
    const code = vals.join('')
    if (code === DEMO_CODE) {
      setStatus('success')
    } else {
      setStatus('error')
      setShaking(true)
      setTimeout(() => {
        setShaking(false)
        setValues(Array(LENGTH).fill(''))
        setStatus('idle')
        setTimeout(() => focusAt(0), 0)
      }, 650)
    }
  }, [focusAt])

  const handleChange = useCallback((index: number, raw: string) => {
    if (statusRef.current !== 'idle') return
    const digit = raw.replace(/\D/g, '').slice(-1)

    setValues(prev => {
      const next = [...prev]
      next[index] = digit
      if (digit && next.every(v => v !== '')) {
        setTimeout(() => verify(next), 0)
      }
      return next
    })

    if (digit && index < LENGTH - 1) {
      focusAt(index + 1)
    }
  }, [focusAt, verify])

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent, currentValues: string[]) => {
    if (statusRef.current !== 'idle') return
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (currentValues[index]) {
        setValues(prev => {
          const next = [...prev]
          next[index] = ''
          return next
        })
      } else if (index > 0) {
        setValues(prev => {
          const next = [...prev]
          next[index - 1] = ''
          return next
        })
        focusAt(index - 1)
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusAt(index - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusAt(index + 1)
    }
  }, [focusAt])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    if (statusRef.current !== 'idle') return
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH)
    if (!pasted) return

    const next = Array(LENGTH).fill('') as string[]
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setValues(next)
    focusAt(Math.min(pasted.length, LENGTH - 1))
    if (pasted.length === LENGTH) {
      setTimeout(() => verify(next), 0)
    }
  }, [focusAt, verify])

  const reset = useCallback(() => {
    setValues(Array(LENGTH).fill(''))
    setStatus('idle')
    setTimeout(() => focusAt(0), 0)
  }, [focusAt])

  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      {/* Input row */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          animation: shaking ? 'otp-shake 0.55s cubic-bezier(0.36,0.07,0.19,0.97)' : 'none',
        }}
      >
        {values.map((val, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={val}
            disabled={status !== 'idle'}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e, values)}
            onPaste={handlePaste}
            onFocus={() => setFocused(i)}
            onBlur={() => setFocused(null)}
            onClick={e => { if (val) e.currentTarget.select() }}
            style={{
              width: '48px',
              height: '56px',
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 600,
              fontFamily: font,
              letterSpacing: '0',
              color: status === 'success' ? '#16a34a' : status === 'error' ? '#dc2626' : '#0a0a0a',
              background: status === 'success' ? '#f0fdf4' : '#ffffff',
              border: `1.5px solid ${
                status === 'success' ? '#16a34a' :
                status === 'error' ? '#dc2626' :
                focused === i ? '#0a0a0a' :
                'rgba(10,10,10,0.14)'
              }`,
              borderRadius: '12px',
              outline: 'none',
              caretColor: 'transparent',
              cursor: 'text',
              transition: 'border-color 150ms ease, background 200ms ease, color 200ms ease, box-shadow 150ms ease',
              boxShadow: status === 'success'
                ? '0 0 0 3px rgba(22,163,74,0.12)'
                : status === 'error'
                ? '0 0 0 3px rgba(220,38,38,0.1)'
                : focused === i
                ? '0 0 0 3px rgba(10,10,10,0.07)'
                : '0 1px 2px rgba(0,0,0,0.04)',
            }}
          />
        ))}
      </div>

      {/* Status line */}
      <div style={{ height: '18px', display: 'flex', alignItems: 'center' }}>
        {status === 'success' && (
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#16a34a', letterSpacing: '-0.01em', fontFamily: font }}>
            ✓ Code verified successfully
          </span>
        )}
        {status === 'error' && (
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#dc2626', letterSpacing: '-0.01em', fontFamily: font }}>
            Incorrect code — try again
          </span>
        )}
        {status === 'idle' && (
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.35)', letterSpacing: '-0.01em', fontFamily: font }}>
            Hint: try 2-4-6-8-1-0
          </span>
        )}
      </div>

      {status === 'success' && (
        <button
          onClick={reset}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(10,10,10,0.1)',
            background: '#ffffff',
            color: '#0a0a0a',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            cursor: 'pointer',
            fontFamily: font,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}
        >
          Try again
        </button>
      )}
    </div>
  )
}

// ─── Demo card ────────────────────────────────────────────────────────────────

function DemoCard() {
  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07)',
      padding: '36px 32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px',
      width: '100%',
      maxWidth: '360px',
    }}>
      {/* Icon */}
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: 'rgba(10,10,10,0.04)',
        border: '1px solid rgba(10,10,10,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
      }}>
        🔐
      </div>

      {/* Heading */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 600, letterSpacing: '-0.02em', color: '#0a0a0a', fontFamily: font }}>
          Verify your identity
        </h2>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.5)', letterSpacing: '-0.01em', fontFamily: font, lineHeight: '1.5' }}>
          Enter the 6-digit code sent to your device
        </p>
      </div>

      {/* OTP fields */}
      <OTPInput />
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

const LENGTH = 6
const VALID_CODE = '246810' // replace with your verification logic

function OTPInput({ onComplete }: { onComplete?: (code: string) => void }) {
  const [values, setValues] = useState<string[]>(Array(LENGTH).fill(''))
  const [focused, setFocused] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')
  const [shaking, setShaking] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const statusRef = useRef(status)
  statusRef.current = status

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = \`
      @keyframes otp-shake {
        0%,100% { transform: translateX(0) }
        15%      { transform: translateX(-8px) }
        30%      { transform: translateX(7px) }
        45%      { transform: translateX(-5px) }
        60%      { transform: translateX(4px) }
        75%      { transform: translateX(-3px) }
        90%      { transform: translateX(2px) }
      }
    \`
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  const focusAt = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(LENGTH - 1, index))
    inputRefs.current[clamped]?.focus()
  }, [])

  const verify = useCallback((vals: string[]) => {
    const code = vals.join('')
    if (code === VALID_CODE) {
      setStatus('success')
      onComplete?.(code)
    } else {
      setStatus('error')
      setShaking(true)
      setTimeout(() => {
        setShaking(false)
        setValues(Array(LENGTH).fill(''))
        setStatus('idle')
        setTimeout(() => focusAt(0), 0)
      }, 650)
    }
  }, [focusAt, onComplete])

  const handleChange = useCallback((index: number, raw: string) => {
    if (statusRef.current !== 'idle') return
    const digit = raw.replace(/\\D/g, '').slice(-1)
    setValues(prev => {
      const next = [...prev]
      next[index] = digit
      if (digit && next.every(v => v !== '')) {
        setTimeout(() => verify(next), 0)
      }
      return next
    })
    if (digit && index < LENGTH - 1) focusAt(index + 1)
  }, [focusAt, verify])

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent, currentValues: string[]) => {
      if (statusRef.current !== 'idle') return
      if (e.key === 'Backspace') {
        e.preventDefault()
        if (currentValues[index]) {
          setValues(prev => { const n = [...prev]; n[index] = ''; return n })
        } else if (index > 0) {
          setValues(prev => { const n = [...prev]; n[index - 1] = ''; return n })
          focusAt(index - 1)
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault(); focusAt(index - 1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault(); focusAt(index + 1)
      }
    },
    [focusAt],
  )

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    if (statusRef.current !== 'idle') return
    const pasted = e.clipboardData.getData('text').replace(/\\D/g, '').slice(0, LENGTH)
    if (!pasted) return
    const next = Array(LENGTH).fill('') as string[]
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setValues(next)
    focusAt(Math.min(pasted.length, LENGTH - 1))
    if (pasted.length === LENGTH) setTimeout(() => verify(next), 0)
  }, [focusAt, verify])

  const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', animation: shaking ? 'otp-shake 0.55s ease' : 'none' }}>
        {values.map((val, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={val}
            disabled={status !== 'idle'}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e, values)}
            onPaste={handlePaste}
            onFocus={() => setFocused(i)}
            onBlur={() => setFocused(null)}
            onClick={e => { if (val) e.currentTarget.select() }}
            style={{
              width: '48px', height: '56px',
              textAlign: 'center', fontSize: '20px', fontWeight: 600,
              fontFamily: font, letterSpacing: 0,
              color: status === 'success' ? '#16a34a' : status === 'error' ? '#dc2626' : '#0a0a0a',
              background: status === 'success' ? '#f0fdf4' : '#ffffff',
              border: \`1.5px solid \${
                status === 'success' ? '#16a34a' :
                status === 'error'   ? '#dc2626' :
                focused === i        ? '#0a0a0a' : 'rgba(10,10,10,0.14)'
              }\`,
              borderRadius: '12px', outline: 'none', caretColor: 'transparent',
              cursor: 'text',
              transition: 'border-color 150ms ease, background 200ms ease, color 200ms ease, box-shadow 150ms ease',
              boxShadow: status === 'success' ? '0 0 0 3px rgba(22,163,74,0.12)'
                : status === 'error' ? '0 0 0 3px rgba(220,38,38,0.1)'
                : focused === i ? '0 0 0 3px rgba(10,10,10,0.07)'
                : '0 1px 2px rgba(0,0,0,0.04)',
            }}
          />
        ))}
      </div>

      <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, fontFamily: font, letterSpacing: '-0.01em',
        color: status === 'success' ? '#16a34a' : status === 'error' ? '#dc2626' : 'rgba(10,10,10,0.4)' }}>
        {status === 'success' ? '✓ Code verified' : status === 'error' ? 'Incorrect code — try again' : 'Enter your 6-digit code'}
      </p>
    </div>
  )
}

export default OTPInput`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OTPInputPage() {
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
        <DemoCard />
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
        }}>
          <pre style={{ margin: 0, fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace', fontSize: '12px', lineHeight: '1.65', color: '#e5e5e5', whiteSpace: 'pre', overflowX: 'auto' }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
