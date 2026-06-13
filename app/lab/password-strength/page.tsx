'use client'

import { useState, useRef, useEffect } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type Strength = 0 | 1 | 2 | 3 | 4

const STRENGTH_LABELS: Record<Strength, string> = {
  0: '',
  1: 'Weak',
  2: 'Fair',
  3: 'Good',
  4: 'Strong',
}

const STRENGTH_COLORS: Record<Strength, string> = {
  0: 'rgba(10,10,10,0.08)',
  1: '#ef4444',
  2: '#f97316',
  3: '#eab308',
  4: '#22c55e',
}

interface Requirement {
  label: string
  test: (p: string) => boolean
}

const REQUIREMENTS: Requirement[] = [
  { label: 'At least 8 characters', test: p => p.length >= 8 },
  { label: 'One uppercase letter',  test: p => /[A-Z]/.test(p) },
  { label: 'One number',            test: p => /[0-9]/.test(p) },
  { label: 'One special character', test: p => /[^A-Za-z0-9]/.test(p) },
]

function getStrength(password: string): Strength {
  if (!password) return 0
  const score = REQUIREMENTS.filter(r => r.test(password)).length
  if (score <= 1) return 1
  if (score === 2) return 2
  if (score === 3) return 3
  return 4
}

// ─── Eye Icon ─────────────────────────────────────────────────────────────────

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      {open ? (
        <>
          <path d="M8 3C4.5 3 1.5 8 1.5 8C1.5 8 4.5 13 8 13C11.5 13 14.5 8 14.5 8C14.5 8 11.5 3 8 3Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.25" />
        </>
      ) : (
        <>
          <path d="M2 2L14 14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          <path d="M6.5 3.5C7 3.2 7.5 3 8 3C11.5 3 14.5 8 14.5 8C14.3 8.4 14 8.9 13.6 9.4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          <path d="M4.2 5.2C3 6.2 1.5 8 1.5 8C1.5 8 4.5 13 8 13C9.1 13 10.2 12.5 11.1 11.8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

// ─── Check Icon ───────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ display: 'block' }}>
      <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Strength Segment ─────────────────────────────────────────────────────────

function StrengthSegment({ filled, color, delay }: { filled: boolean; color: string; delay: number }) {
  return (
    <div style={{
      flex: 1,
      height: '3px',
      borderRadius: '2px',
      background: filled ? color : 'rgba(10,10,10,0.08)',
      transition: `background 300ms ease ${delay}ms`,
    }} />
  )
}

// ─── Requirement Row ──────────────────────────────────────────────────────────

function RequirementRow({ label, met }: { label: string; met: boolean }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 16)
    return () => clearTimeout(id)
  }, [])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: FONT,
    }}>
      <div style={{
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        border: `1.5px solid ${met ? '#22c55e' : 'rgba(10,10,10,0.15)'}`,
        background: met ? '#22c55e' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: met ? '#fff' : 'transparent',
        transition: 'background 250ms cubic-bezier(0.34, 1.56, 0.64, 1), border-color 250ms ease, color 200ms ease',
        transform: mounted ? (met ? 'scale(1.08)' : 'scale(1)') : 'scale(0.8)',
      }}>
        <CheckIcon />
      </div>
      <span style={{
        fontSize: '12px',
        fontWeight: 500,
        color: met ? '#0a0a0a' : 'rgba(10,10,10,0.45)',
        letterSpacing: '-0.01em',
        transition: 'color 250ms ease',
      }}>
        {label}
      </span>
    </div>
  )
}

// ─── Password Strength Meter ──────────────────────────────────────────────────

function PasswordStrengthMeter() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmFocused, setConfirmFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const strength = getStrength(password)
  const strengthColor = STRENGTH_COLORS[strength]
  const strengthLabel = STRENGTH_LABELS[strength]
  const metRequirements = REQUIREMENTS.map(r => r.test(password))
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword

  return (
    <div style={{
      width: '380px',
      maxWidth: 'calc(100vw - 48px)',
      background: '#fff',
      borderRadius: '16px',
      border: '1px solid rgba(10,10,10,0.08)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      fontFamily: FONT,
    }}>

      {/* Header */}
      <div style={{
        padding: '20px 24px 16px',
        borderBottom: '1px solid rgba(10,10,10,0.06)',
      }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
          Create password
        </p>
        <p style={{ margin: '3px 0 0', fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em' }}>
          Choose a strong password to secure your account
        </p>
      </div>

      {/* Form body */}
      <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Password input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
            Password
          </label>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '9px',
            border: `1px solid ${focused ? 'rgba(10,10,10,0.22)' : 'rgba(10,10,10,0.10)'}`,
            background: '#fff',
            boxShadow: focused ? '0 0 0 3px rgba(10,10,10,0.05)' : '0 1px 2px rgba(0,0,0,0.04)',
            transition: 'border-color 150ms ease, box-shadow 150ms ease',
          }}>
            <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Enter password"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                padding: '10px 12px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#0a0a0a',
                letterSpacing: '-0.01em',
                fontFamily: FONT,
              }}
            />
            <button
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: 'absolute',
                right: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(10,10,10,0.4)',
                borderRadius: '5px',
                transition: 'color 150ms ease, background 150ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#0a0a0a'; e.currentTarget.style.background = 'rgba(10,10,10,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(10,10,10,0.4)'; e.currentTarget.style.background = 'transparent' }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={!showPassword} />
            </button>
          </div>

          {/* Strength bar + label */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '2px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {([1, 2, 3, 4] as Strength[]).map((level, i) => (
                <StrengthSegment
                  key={level}
                  filled={strength >= level}
                  color={strengthColor}
                  delay={i * 40}
                />
              ))}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              height: '16px',
            }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: strengthColor,
                letterSpacing: '-0.01em',
                opacity: strength > 0 ? 1 : 0,
                transform: strength > 0 ? 'translateY(0)' : 'translateY(4px)',
                transition: 'color 300ms ease, opacity 200ms ease, transform 200ms ease',
              }}>
                {strengthLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '12px 14px',
          background: 'rgba(10,10,10,0.02)',
          borderRadius: '10px',
          border: '1px solid rgba(10,10,10,0.05)',
        }}>
          {REQUIREMENTS.map((req, i) => (
            <RequirementRow key={i} label={req.label} met={metRequirements[i]} />
          ))}
        </div>

        {/* Confirm password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
            Confirm password
          </label>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '9px',
            border: `1px solid ${
              passwordsMismatch ? 'rgba(239,68,68,0.5)' :
              passwordsMatch ? 'rgba(34,197,94,0.5)' :
              confirmFocused ? 'rgba(10,10,10,0.22)' :
              'rgba(10,10,10,0.10)'
            }`,
            background: '#fff',
            boxShadow: confirmFocused ? '0 0 0 3px rgba(10,10,10,0.05)' : '0 1px 2px rgba(0,0,0,0.04)',
            transition: 'border-color 200ms ease, box-shadow 150ms ease',
          }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              onFocus={() => setConfirmFocused(true)}
              onBlur={() => setConfirmFocused(false)}
              placeholder="Re-enter password"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                padding: '10px 12px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#0a0a0a',
                letterSpacing: '-0.01em',
                fontFamily: FONT,
              }}
            />
            {/* Match indicator */}
            {confirmPassword.length > 0 && (
              <div style={{
                position: 'absolute',
                right: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: passwordsMatch ? '#22c55e' : '#ef4444',
                color: '#fff',
                transition: 'background 250ms ease, transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: 'scale(1)',
              }}>
                {passwordsMatch ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </div>
            )}
          </div>
          {passwordsMismatch && (
            <p style={{
              margin: 0,
              fontSize: '11px',
              fontWeight: 500,
              color: '#ef4444',
              letterSpacing: '-0.01em',
            }}>
              Passwords don&apos;t match
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          disabled={strength < 4 || !passwordsMatch}
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: '9px',
            border: 'none',
            background: strength === 4 && passwordsMatch ? '#0a0a0a' : 'rgba(10,10,10,0.06)',
            color: strength === 4 && passwordsMatch ? '#fff' : 'rgba(10,10,10,0.3)',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            cursor: strength === 4 && passwordsMatch ? 'pointer' : 'not-allowed',
            fontFamily: FONT,
            transition: 'background 300ms ease, color 300ms ease, transform 100ms ease',
            marginTop: '4px',
          }}
          onMouseEnter={e => { if (strength === 4 && passwordsMatch) e.currentTarget.style.background = '#1a1a1a' }}
          onMouseLeave={e => { if (strength === 4 && passwordsMatch) e.currentTarget.style.background = '#0a0a0a' }}
          onMouseDown={e => { if (strength === 4 && passwordsMatch) e.currentTarget.style.transform = 'scale(0.98)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          Create account
        </button>

      </div>
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type Strength = 0 | 1 | 2 | 3 | 4

const STRENGTH_LABELS: Record<Strength, string> = {
  0: '', 1: 'Weak', 2: 'Fair', 3: 'Good', 4: 'Strong',
}

const STRENGTH_COLORS: Record<Strength, string> = {
  0: 'rgba(10,10,10,0.08)',
  1: '#ef4444',
  2: '#f97316',
  3: '#eab308',
  4: '#22c55e',
}

const REQUIREMENTS = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter',  test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number',            test: (p: string) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

function getStrength(password: string): Strength {
  if (!password) return 0
  const score = REQUIREMENTS.filter(r => r.test(password)).length
  if (score <= 1) return 1
  if (score === 2) return 2
  if (score === 3) return 3
  return 4
}

function StrengthSegment({ filled, color, delay }: { filled: boolean; color: string; delay: number }) {
  return (
    <div style={{
      flex: 1, height: '3px', borderRadius: '2px',
      background: filled ? color : 'rgba(10,10,10,0.08)',
      transition: \`background 300ms ease \${delay}ms\`,
    }} />
  )
}

function RequirementRow({ label, met }: { label: string; met: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
        border: \`1.5px solid \${met ? '#22c55e' : 'rgba(10,10,10,0.15)'}\`,
        background: met ? '#22c55e' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: met ? '#fff' : 'transparent',
        transition: 'background 250ms cubic-bezier(0.34,1.56,0.64,1), border-color 250ms ease, color 200ms ease',
      }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span style={{
        fontSize: '12px', fontWeight: 500, letterSpacing: '-0.01em',
        color: met ? '#0a0a0a' : 'rgba(10,10,10,0.45)',
        transition: 'color 250ms ease',
      }}>
        {label}
      </span>
    </div>
  )
}

export function PasswordStrengthMeter() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmFocused, setConfirmFocused] = useState(false)

  const strength = getStrength(password)
  const strengthColor = STRENGTH_COLORS[strength]
  const metRequirements = REQUIREMENTS.map(r => r.test(password))
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword

  return (
    <div style={{
      width: '380px', maxWidth: 'calc(100vw - 48px)',
      background: '#fff', borderRadius: '16px',
      border: '1px solid rgba(10,10,10,0.08)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)',
      fontFamily: FONT,
    }}>
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
          Create password
        </p>
        <p style={{ margin: '3px 0 0', fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em' }}>
          Choose a strong password to secure your account
        </p>
      </div>

      <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Password input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
            Password
          </label>
          <div style={{
            position: 'relative', display: 'flex', alignItems: 'center',
            borderRadius: '9px',
            border: \`1px solid \${focused ? 'rgba(10,10,10,0.22)' : 'rgba(10,10,10,0.10)'}\`,
            background: '#fff',
            boxShadow: focused ? '0 0 0 3px rgba(10,10,10,0.05)' : '0 1px 2px rgba(0,0,0,0.04)',
            transition: 'border-color 150ms ease, box-shadow 150ms ease',
          }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Enter password"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                padding: '10px 12px', fontSize: '13px', fontWeight: 500,
                color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT,
              }}
            />
            <button
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: 'absolute', right: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '4px', background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(10,10,10,0.4)', borderRadius: '5px',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {/* swap your Eye/EyeOff icon here */}
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>

          {/* Strength bar + label */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '2px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {([1, 2, 3, 4] as Strength[]).map((level, i) => (
                <StrengthSegment key={level} filled={strength >= level} color={strengthColor} delay={i * 40} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', height: '16px' }}>
              <span style={{
                fontSize: '11px', fontWeight: 600, color: strengthColor, letterSpacing: '-0.01em',
                opacity: strength > 0 ? 1 : 0,
                transition: 'color 300ms ease, opacity 200ms ease',
              }}>
                {STRENGTH_LABELS[strength]}
              </span>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '8px',
          padding: '12px 14px', background: 'rgba(10,10,10,0.02)',
          borderRadius: '10px', border: '1px solid rgba(10,10,10,0.05)',
        }}>
          {REQUIREMENTS.map((req, i) => (
            <RequirementRow key={i} label={req.label} met={metRequirements[i]} />
          ))}
        </div>

        {/* Confirm password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
            Confirm password
          </label>
          <div style={{
            position: 'relative', display: 'flex', alignItems: 'center',
            borderRadius: '9px',
            border: \`1px solid \${
              passwordsMismatch ? 'rgba(239,68,68,0.5)' :
              passwordsMatch ? 'rgba(34,197,94,0.5)' :
              confirmFocused ? 'rgba(10,10,10,0.22)' : 'rgba(10,10,10,0.10)'
            }\`,
            background: '#fff',
            transition: 'border-color 200ms ease',
          }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              onFocus={() => setConfirmFocused(true)}
              onBlur={() => setConfirmFocused(false)}
              placeholder="Re-enter password"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                padding: '10px 12px', fontSize: '13px', fontWeight: 500,
                color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT,
              }}
            />
            {confirmPassword.length > 0 && (
              <div style={{
                position: 'absolute', right: '10px',
                width: '18px', height: '18px', borderRadius: '50%',
                background: passwordsMatch ? '#22c55e' : '#ef4444',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', transition: 'background 250ms ease',
              }}>
                {passwordsMatch ? '✓' : '✕'}
              </div>
            )}
          </div>
          {passwordsMismatch && (
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 500, color: '#ef4444', letterSpacing: '-0.01em' }}>
              Passwords don&apos;t match
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          disabled={strength < 4 || !passwordsMatch}
          style={{
            width: '100%', padding: '10px 16px', borderRadius: '9px', border: 'none',
            background: strength === 4 && passwordsMatch ? '#0a0a0a' : 'rgba(10,10,10,0.06)',
            color: strength === 4 && passwordsMatch ? '#fff' : 'rgba(10,10,10,0.3)',
            fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em',
            cursor: strength === 4 && passwordsMatch ? 'pointer' : 'not-allowed',
            fontFamily: FONT, transition: 'background 300ms ease, color 300ms ease',
            marginTop: '4px',
          }}
        >
          Create account
        </button>
      </div>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PasswordStrengthPage() {
  return (
    <main style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      fontFamily: FONT,
    }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
      }}>
        <PasswordStrengthMeter />
        <p style={{
          marginTop: '24px',
          fontSize: '12px',
          color: 'rgba(0,0,0,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily: FONT,
          textAlign: 'center',
        }}>
          Type a password to see real-time strength feedback
        </p>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.4)',
          marginBottom: '12px',
          fontFamily: FONT,
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
