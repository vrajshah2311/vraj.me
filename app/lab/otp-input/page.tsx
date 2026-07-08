'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ── OTPInput component ─────────────────────────────────────────────────────────

function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
}: {
  length?: number
  value: string[]
  onChange: (val: string[]) => void
  onComplete?: (code: string) => void
  disabled?: boolean
  error?: boolean
}) {
  const [focused, setFocused] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const focusAt = (idx: number) => {
    inputRefs.current[Math.max(0, Math.min(idx, length - 1))]?.focus()
  }

  const handleChange = (idx: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1)
    const next = [...value]
    next[idx] = digit
    onChange(next)
    if (digit && idx < length - 1) focusAt(idx + 1)
    if (digit && idx === length - 1 && next.every(v => v !== '') && onComplete) {
      onComplete(next.join(''))
    }
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (value[idx]) {
        const next = [...value]
        next[idx] = ''
        onChange(next)
      } else if (idx > 0) {
        const next = [...value]
        next[idx - 1] = ''
        onChange(next)
        focusAt(idx - 1)
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusAt(idx - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusAt(idx + 1)
    } else if (e.key === 'Enter') {
      const code = value.join('')
      if (code.length === length && onComplete) onComplete(code)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!text) return
    const next = Array(length).fill('')
    text.split('').forEach((ch, i) => { next[i] = ch })
    onChange(next)
    const nextFocus = Math.min(text.length, length - 1)
    setTimeout(() => focusAt(nextFocus), 0)
    if (text.length === length && onComplete) onComplete(text)
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {value.map((val, idx) => {
        const isFocused = focused === idx
        const isFilled = val !== ''
        const borderColor = error
          ? 'rgba(220,38,38,0.6)'
          : isFocused
          ? '#0a0a0a'
          : isFilled
          ? 'rgba(0,0,0,0.18)'
          : 'rgba(0,0,0,0.1)'
        const bg = error
          ? 'rgba(254,242,242,0.6)'
          : disabled
          ? 'rgba(0,0,0,0.025)'
          : isFilled
          ? 'rgba(0,0,0,0.01)'
          : '#fff'
        const boxShadow = isFocused && !error
          ? '0 0 0 3px rgba(0,0,0,0.06)'
          : isFocused && error
          ? '0 0 0 3px rgba(220,38,38,0.1)'
          : 'none'

        return (
          <input
            key={idx}
            ref={el => { inputRefs.current[idx] = el }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={2}
            value={val}
            disabled={disabled}
            onFocus={() => setFocused(idx)}
            onBlur={() => setFocused(null)}
            onChange={e => handleChange(idx, e.target.value)}
            onKeyDown={e => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            onClick={() => focusAt(idx)}
            style={{
              width: 48,
              height: 54,
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: error ? 'rgba(220,38,38,0.9)' : '#0a0a0a',
              border: `1.5px solid ${borderColor}`,
              borderRadius: 12,
              outline: 'none',
              background: bg,
              caretColor: 'transparent',
              transition: 'border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease',
              fontFamily: font,
              boxShadow,
              cursor: disabled ? 'not-allowed' : 'text',
              opacity: disabled ? 0.5 : 1,
            }}
          />
        )
      })}
    </div>
  )
}

// ── ResendButton ───────────────────────────────────────────────────────────────

function ResendButton({ onResend }: { onResend: () => void }) {
  const [countdown, setCountdown] = useState(30)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const handleResend = () => {
    setCountdown(30)
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return c - 1
      })
    }, 1000)
    onResend()
  }

  const canResend = countdown === 0

  return (
    <button
      onClick={canResend ? handleResend : undefined}
      disabled={!canResend}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        fontSize: 13,
        fontWeight: 500,
        color: canResend ? '#0a0a0a' : 'rgba(0,0,0,0.35)',
        cursor: canResend ? 'pointer' : 'default',
        fontFamily: font,
        letterSpacing: '-0.01em',
        transition: 'color 0.15s ease',
        textDecoration: canResend ? 'underline' : 'none',
        textUnderlineOffset: 2,
      }}
    >
      {canResend ? 'Resend code' : `Resend in ${countdown}s`}
    </button>
  )
}

// ── Demo ───────────────────────────────────────────────────────────────────────

type VerifyState = 'idle' | 'loading' | 'success' | 'error'

function Demo() {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
  const [state, setState] = useState<VerifyState>('idle')
  const [resendKey, setResendKey] = useState(0)

  const isComplete = digits.every(d => d !== '')
  const isDisabled = state === 'loading' || state === 'success'

  const handleComplete = useCallback((code: string) => {
    if (state === 'idle') verify(code)
  }, [state])

  const verify = (code: string) => {
    setState('loading')
    setTimeout(() => {
      // Demo: "123456" succeeds, anything else errors
      setState(code === '123456' ? 'success' : 'error')
    }, 1200)
  }

  const handleVerify = () => {
    if (!isComplete || state !== 'idle') return
    verify(digits.join(''))
  }

  const handleReset = () => {
    setState('idle')
    setDigits(Array(6).fill(''))
    setResendKey(k => k + 1)
  }

  const handleResend = () => {
    setState('idle')
    setDigits(Array(6).fill(''))
  }

  const handleAutoFill = () => {
    if (isDisabled) return
    const demo = ['1','2','3','4','5','6']
    setDigits(demo)
    setState('idle')
    setTimeout(() => verify('123456'), 100)
  }

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
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#fff',
          borderRadius: 20,
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow:
            '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)',
          padding: '32px 28px 28px',
        }}
      >
        {state === 'success' ? (
          // Success state
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'rgba(5,150,105,0.08)',
                border: '1.5px solid rgba(5,150,105,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              ✓
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                Verified!
              </div>
              <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', marginTop: 4 }}>
                Your identity has been confirmed.
              </div>
            </div>
            <button
              onClick={handleReset}
              style={{
                marginTop: 8,
                padding: '9px 20px',
                background: 'rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                color: '#0a0a0a',
                cursor: 'pointer',
                fontFamily: font,
                letterSpacing: '-0.01em',
                transition: 'background 0.12s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                Check your email
              </div>
              <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', marginTop: 4, lineHeight: 1.5 }}>
                We sent a 6-digit code to{' '}
                <span style={{ color: 'rgba(0,0,0,0.7)', fontWeight: 500 }}>v***@peec.ai</span>
              </div>
            </div>

            {/* OTP Input */}
            <OTPInput
              length={6}
              value={digits}
              onChange={val => {
                setDigits(val)
                if (state === 'error') setState('idle')
              }}
              onComplete={handleComplete}
              disabled={isDisabled}
              error={state === 'error'}
            />

            {/* Error message */}
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                fontWeight: 500,
                color: 'rgba(220,38,38,0.9)',
                letterSpacing: '-0.01em',
                minHeight: 16,
                opacity: state === 'error' ? 1 : 0,
                transform: state === 'error' ? 'translateY(0)' : 'translateY(-4px)',
                transition: 'opacity 0.18s ease, transform 0.18s ease',
              }}
            >
              Incorrect code. Please try again.
            </div>

            {/* Verify button */}
            <button
              onClick={handleVerify}
              disabled={!isComplete || isDisabled}
              style={{
                marginTop: state === 'error' ? 12 : 20,
                width: '100%',
                padding: '11px 20px',
                background: isComplete && !isDisabled ? '#0a0a0a' : 'rgba(0,0,0,0.06)',
                border: 'none',
                borderRadius: 11,
                fontSize: 13,
                fontWeight: 600,
                color: isComplete && !isDisabled ? '#fff' : 'rgba(0,0,0,0.3)',
                cursor: isComplete && !isDisabled ? 'pointer' : 'not-allowed',
                fontFamily: font,
                letterSpacing: '-0.01em',
                transition: 'background 0.2s ease, color 0.2s ease, transform 0.1s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              onMouseEnter={e => {
                if (isComplete && !isDisabled) e.currentTarget.style.background = '#1a1a1a'
              }}
              onMouseLeave={e => {
                if (isComplete && !isDisabled) e.currentTarget.style.background = '#0a0a0a'
              }}
              onMouseDown={e => {
                if (isComplete && !isDisabled) e.currentTarget.style.transform = 'scale(0.985)'
              }}
              onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              {state === 'loading' ? (
                <>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 13,
                      height: 13,
                      border: '1.5px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                    }}
                  />
                  Verifying…
                </>
              ) : (
                'Verify'
              )}
            </button>

            {/* Footer */}
            <div
              style={{
                marginTop: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <ResendButton key={resendKey} onResend={handleResend} />
              <button
                onClick={handleAutoFill}
                disabled={isDisabled}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'rgba(0,0,0,0.3)',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  fontFamily: font,
                  letterSpacing: '-0.01em',
                  transition: 'color 0.12s ease',
                }}
                onMouseEnter={e => {
                  if (!isDisabled) e.currentTarget.style.color = 'rgba(0,0,0,0.55)'
                }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(0,0,0,0.3)' }}
              >
                Autofill demo →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Hint */}
      <div
        style={{
          marginTop: 16,
          fontSize: 12,
          fontWeight: 500,
          color: 'rgba(0,0,0,0.3)',
          letterSpacing: '-0.01em',
          textAlign: 'center',
        }}
      >
        Type 1-2-3-4-5-6 to verify · paste support · keyboard navigation
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── CopyButton ─────────────────────────────────────────────────────────────────

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

// ── Code source ────────────────────────────────────────────────────────────────

const CODE_SOURCE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
}) {
  const [focused, setFocused] = useState(null)
  const inputRefs = useRef([])

  const focusAt = (idx) => {
    inputRefs.current[Math.max(0, Math.min(idx, length - 1))]?.focus()
  }

  const handleChange = (idx, raw) => {
    const digit = raw.replace(/\\D/g, '').slice(-1)
    const next = [...value]
    next[idx] = digit
    onChange(next)
    if (digit && idx < length - 1) focusAt(idx + 1)
    if (digit && idx === length - 1 && next.every(v => v !== '') && onComplete) {
      onComplete(next.join(''))
    }
  }

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (value[idx]) {
        const next = [...value]
        next[idx] = ''
        onChange(next)
      } else if (idx > 0) {
        const next = [...value]
        next[idx - 1] = ''
        onChange(next)
        focusAt(idx - 1)
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault(); focusAt(idx - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault(); focusAt(idx + 1)
    } else if (e.key === 'Enter') {
      const code = value.join('')
      if (code.length === length && onComplete) onComplete(code)
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\\D/g, '').slice(0, length)
    if (!text) return
    const next = Array(length).fill('')
    text.split('').forEach((ch, i) => { next[i] = ch })
    onChange(next)
    setTimeout(() => focusAt(Math.min(text.length, length - 1)), 0)
    if (text.length === length && onComplete) onComplete(text)
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {value.map((val, idx) => {
        const isFocused = focused === idx
        const isFilled = val !== ''
        const borderColor = error
          ? 'rgba(220,38,38,0.6)'
          : isFocused ? '#0a0a0a'
          : isFilled ? 'rgba(0,0,0,0.18)'
          : 'rgba(0,0,0,0.1)'
        const boxShadow = isFocused
          ? \`0 0 0 3px \${error ? 'rgba(220,38,38,0.1)' : 'rgba(0,0,0,0.06)'}\`
          : 'none'

        return (
          <input
            key={idx}
            ref={el => { inputRefs.current[idx] = el }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={2}
            value={val}
            disabled={disabled}
            onFocus={() => setFocused(idx)}
            onBlur={() => setFocused(null)}
            onChange={e => handleChange(idx, e.target.value)}
            onKeyDown={e => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            onClick={() => focusAt(idx)}
            style={{
              width: 48, height: 54,
              textAlign: 'center',
              fontSize: 20, fontWeight: 600,
              letterSpacing: '-0.01em',
              color: error ? 'rgba(220,38,38,0.9)' : '#0a0a0a',
              border: \`1.5px solid \${borderColor}\`,
              borderRadius: 12, outline: 'none',
              background: error ? 'rgba(254,242,242,0.6)' : disabled ? 'rgba(0,0,0,0.025)' : '#fff',
              caretColor: 'transparent',
              transition: 'border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease',
              fontFamily: font, boxShadow,
              cursor: disabled ? 'not-allowed' : 'text',
              opacity: disabled ? 0.5 : 1,
            }}
          />
        )
      })}
    </div>
  )
}

// ResendButton — countdown timer, re-enables after 30 s
function ResendButton({ onResend }) {
  const [countdown, setCountdown] = useState(30)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(timerRef.current); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  const handleResend = () => {
    setCountdown(30)
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(timerRef.current); return 0 }
        return c - 1
      })
    }, 1000)
    onResend()
  }

  return (
    <button
      onClick={countdown === 0 ? handleResend : undefined}
      disabled={countdown !== 0}
      style={{
        background: 'none', border: 'none', padding: 0,
        fontSize: 13, fontWeight: 500,
        color: countdown === 0 ? '#0a0a0a' : 'rgba(0,0,0,0.35)',
        cursor: countdown === 0 ? 'pointer' : 'default',
        fontFamily: font, letterSpacing: '-0.01em',
        textDecoration: countdown === 0 ? 'underline' : 'none',
        textUnderlineOffset: 2,
        transition: 'color 0.15s ease',
      }}
    >
      {countdown === 0 ? 'Resend code' : \`Resend in \${countdown}s\`}
    </button>
  )
}

// Full usage example
export default function App() {
  const [digits, setDigits] = useState(Array(6).fill(''))
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'

  const verify = useCallback((code) => {
    setStatus('loading')
    // Replace with your API call
    setTimeout(() => setStatus(code === '123456' ? 'success' : 'error'), 1200)
  }, [])

  return (
    <div style={{ padding: 24, fontFamily: font }}>
      <OTPInput
        length={6}
        value={digits}
        onChange={val => { setDigits(val); if (status === 'error') setStatus('idle') }}
        onComplete={verify}
        disabled={status === 'loading' || status === 'success'}
        error={status === 'error'}
      />

      {status === 'error' && (
        <p style={{ color: 'rgba(220,38,38,0.9)', fontSize: 12, marginTop: 8 }}>
          Incorrect code. Please try again.
        </p>
      )}

      <ResendButton onResend={() => { setDigits(Array(6).fill('')); setStatus('idle') }} />

      <style>{\`@keyframes spin { to { transform: rotate(360deg); } }\`}</style>
    </div>
  )
}`

// ── Page ───────────────────────────────────────────────────────────────────────

export default function OTPInputPage() {
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
                OTP / Verification Code Input
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
                OTPInput.tsx
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
