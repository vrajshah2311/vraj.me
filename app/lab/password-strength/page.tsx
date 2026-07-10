'use client'

import { useState } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ── Strength helpers ────────────────────────────────────────────────────────────

type Strength = 0 | 1 | 2 | 3 | 4

function calcStrength(pw: string): Strength {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s as Strength
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLORS = ['transparent', '#ef4444', '#f97316', '#eab308', '#22c55e']
const STRENGTH_BG = ['transparent', 'rgba(239,68,68,0.08)', 'rgba(249,115,22,0.08)', 'rgba(234,179,8,0.08)', 'rgba(34,197,94,0.08)']

const REQUIREMENTS = [
  { label: '8+ characters',     test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter',  test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Number',            test: (p: string) => /[0-9]/.test(p) },
  { label: 'Special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

// ── EyeIcon ─────────────────────────────────────────────────────────────────────

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 8C2.5 4.5 5 2.5 8 2.5S13.5 4.5 15 8c-1.5 3.5-4 5.5-7 5.5S2.5 11.5 1 8Z" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="8" cy="8" r="2.25" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 2L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M6.4 6.55A2.25 2.25 0 0 0 10 9.6M4.2 4.35C2.7 5.3 1.7 6.6 1 8c1.5 3.5 4 5.5 7 5.5 1.4 0 2.7-.4 3.8-1.15M7 2.6C7.3 2.55 7.65 2.5 8 2.5c3 0 5.5 2 7 5.5-.5 1.2-1.2 2.2-2.1 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

// ── PasswordField ────────────────────────────────────────────────────────────────

function PasswordField({
  label,
  value,
  onChange,
  placeholder = 'Password',
  showStrength = false,
  matchAgainst,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  showStrength?: boolean
  matchAgainst?: string
}) {
  const [visible, setVisible] = useState(false)
  const [focused, setFocused] = useState(false)

  const strength = calcStrength(value)
  const showMatch = matchAgainst !== undefined && value.length > 0 && matchAgainst.length > 0
  const matched = showMatch && value === matchAgainst

  const borderColor = focused
    ? '#0a0a0a'
    : (showMatch && !matched)
    ? 'rgba(239,68,68,0.45)'
    : (showMatch && matched)
    ? 'rgba(34,197,94,0.4)'
    : 'rgba(0,0,0,0.1)'

  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', marginBottom: 6 }}>
        {label}
      </label>

      <div style={{ position: 'relative' }}>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px 40px 10px 12px',
            border: '1.5px solid ' + borderColor,
            borderRadius: 10,
            fontSize: 14,
            fontFamily: font,
            color: '#0a0a0a',
            background: '#fff',
            outline: 'none',
            boxSizing: 'border-box' as const,
            boxShadow: focused ? '0 0 0 3px rgba(0,0,0,0.05)' : 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            letterSpacing: visible ? '-0.01em' : '0.06em',
          }}
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            padding: 4,
            cursor: 'pointer',
            color: 'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.12s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#0a0a0a' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(0,0,0,0.35)' }}
        >
          <EyeIcon visible={visible} />
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  background: i <= strength ? STRENGTH_COLORS[strength] : 'rgba(0,0,0,0.08)',
                  transition: 'background 0.25s ease',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {REQUIREMENTS.map(req => {
                const done = req.test(value)
                return (
                  <div
                    key={req.label}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: done ? 1 : 0.45, transition: 'opacity 0.2s ease' }}
                  >
                    <div style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      border: done ? 'none' : '1px solid rgba(0,0,0,0.15)',
                      background: done ? '#22c55e' : 'transparent',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.2s ease',
                    }}>
                      {done && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3.2 5.7L6.5 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span style={{
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: done ? '#0a0a0a' : 'rgba(0,0,0,0.5)',
                      letterSpacing: '-0.01em',
                      transition: 'color 0.2s ease',
                    }}>
                      {req.label}
                    </span>
                  </div>
                )
              })}
            </div>

            {strength > 0 && (
              <div style={{
                padding: '3px 10px',
                borderRadius: 20,
                background: STRENGTH_BG[strength],
                border: '1px solid ' + STRENGTH_COLORS[strength] + '33',
                fontSize: 11.5,
                fontWeight: 600,
                color: STRENGTH_COLORS[strength],
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap' as const,
                flexShrink: 0,
                transition: 'all 0.25s ease',
              }}>
                {STRENGTH_LABELS[strength]}
              </div>
            )}
          </div>
        </div>
      )}

      {showMatch && (
        <div style={{
          marginTop: 6,
          fontSize: 11.5,
          fontWeight: 500,
          letterSpacing: '-0.01em',
          color: matched ? '#22c55e' : '#ef4444',
          transition: 'color 0.15s ease',
        }}>
          {matched ? '✓ Passwords match' : '✗ Passwords do not match'}
        </div>
      )}
    </div>
  )
}

// ── Demo ─────────────────────────────────────────────────────────────────────────

function Demo() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const strength = calcStrength(password)
  const passwordsMatch = password.length > 0 && confirm.length > 0 && password === confirm
  const isValid = strength === 4 && passwordsMatch && email.includes('@')

  const handleSubmit = () => {
    if (!isValid) return
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setEmail('')
      setPassword('')
      setConfirm('')
    }, 2500)
  }

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
        maxWidth: 400,
        background: '#fff',
        borderRadius: 20,
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)',
        padding: '28px 24px',
      }}>
        {submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '16px 0' }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'rgba(34,197,94,0.1)',
              border: '1.5px solid rgba(34,197,94,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}>✓</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                Account created!
              </div>
              <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', marginTop: 4 }}>
                Your password is strong and secure.
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                Create account
              </div>
              <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', marginTop: 4 }}>
                Password strength meter with live feedback
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', marginBottom: 6 }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 12px',
                    border: '1.5px solid rgba(0,0,0,0.1)',
                    borderRadius: 10,
                    fontSize: 14,
                    fontFamily: font,
                    color: '#0a0a0a',
                    background: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box' as const,
                    letterSpacing: '-0.01em',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#0a0a0a'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.05)'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              <PasswordField
                label="Password"
                value={password}
                onChange={setPassword}
                placeholder="Create a strong password"
                showStrength
              />

              <PasswordField
                label="Confirm password"
                value={confirm}
                onChange={setConfirm}
                placeholder="Repeat your password"
                matchAgainst={password}
              />

              <button
                onClick={handleSubmit}
                disabled={!isValid}
                style={{
                  marginTop: 4,
                  width: '100%',
                  padding: '11px 20px',
                  background: isValid ? '#0a0a0a' : 'rgba(0,0,0,0.06)',
                  border: 'none',
                  borderRadius: 11,
                  fontSize: 13,
                  fontWeight: 600,
                  color: isValid ? '#fff' : 'rgba(0,0,0,0.3)',
                  cursor: isValid ? 'pointer' : 'not-allowed',
                  fontFamily: font,
                  letterSpacing: '-0.01em',
                  transition: 'background 0.2s ease, color 0.2s ease, transform 0.1s ease',
                  boxSizing: 'border-box' as const,
                }}
                onMouseEnter={e => { if (isValid) (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a' }}
                onMouseLeave={e => { if (isValid) (e.currentTarget as HTMLButtonElement).style.background = '#0a0a0a' }}
                onMouseDown={e => { if (isValid) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.985)' }}
                onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
              >
                Create account
              </button>
            </div>
          </>
        )}
      </div>

      <div style={{
        marginTop: 16,
        fontSize: 12,
        fontWeight: 500,
        color: 'rgba(0,0,0,0.3)',
        letterSpacing: '-0.01em',
        textAlign: 'center',
      }}>
        Fill all fields with a strong password to activate the button
      </div>
    </div>
  )
}

// ── CopyButton ────────────────────────────────────────────────────────────────────

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

// ── Code source ───────────────────────────────────────────────────────────────────

const CODE_SOURCE = `'use client'

import { useState } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

function calcStrength(pw) {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLORS = ['transparent', '#ef4444', '#f97316', '#eab308', '#22c55e']
const STRENGTH_BG = ['transparent', 'rgba(239,68,68,0.08)', 'rgba(249,115,22,0.08)', 'rgba(234,179,8,0.08)', 'rgba(34,197,94,0.08)']

const REQUIREMENTS = [
  { label: '8+ characters',    test: (p) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Number',           test: (p) => /[0-9]/.test(p) },
  { label: 'Special character',test: (p) => /[^A-Za-z0-9]/.test(p) },
]

function EyeIcon({ visible }) {
  return visible ? (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 8C2.5 4.5 5 2.5 8 2.5S13.5 4.5 15 8c-1.5 3.5-4 5.5-7 5.5S2.5 11.5 1 8Z" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="8" cy="8" r="2.25" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 2L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M6.4 6.55A2.25 2.25 0 0 0 10 9.6M4.2 4.35C2.7 5.3 1.7 6.6 1 8c1.5 3.5 4 5.5 7 5.5 1.4 0 2.7-.4 3.8-1.15M7 2.6C7.3 2.55 7.65 2.5 8 2.5c3 0 5.5 2 7 5.5-.5 1.2-1.2 2.2-2.1 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

export function PasswordField({ label, value, onChange, placeholder = 'Password', showStrength = false, matchAgainst }) {
  const [visible, setVisible] = useState(false)
  const [focused, setFocused] = useState(false)

  const strength = calcStrength(value)
  const showMatch = matchAgainst !== undefined && value.length > 0 && matchAgainst.length > 0
  const matched = showMatch && value === matchAgainst

  const borderColor = focused
    ? '#0a0a0a'
    : (showMatch && !matched) ? 'rgba(239,68,68,0.45)'
    : (showMatch && matched) ? 'rgba(34,197,94,0.4)'
    : 'rgba(0,0,0,0.1)'

  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', marginBottom: 6 }}>
        {label}
      </label>

      <div style={{ position: 'relative' }}>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            display: 'block', width: '100%',
            padding: '10px 40px 10px 12px',
            border: '1.5px solid ' + borderColor,
            borderRadius: 10, fontSize: 14, fontFamily: font,
            color: '#0a0a0a', background: '#fff', outline: 'none',
            boxSizing: 'border-box',
            boxShadow: focused ? '0 0 0 3px rgba(0,0,0,0.05)' : 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            letterSpacing: visible ? '-0.01em' : '0.06em',
          }}
        />
        <button type="button" onClick={() => setVisible(v => !v)} style={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', padding: 4, cursor: 'pointer',
          color: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center',
          transition: 'color 0.12s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#0a0a0a' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(0,0,0,0.35)' }}
        >
          <EyeIcon visible={visible} />
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= strength ? STRENGTH_COLORS[strength] : 'rgba(0,0,0,0.08)',
                transition: 'background 0.25s ease',
              }} />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {REQUIREMENTS.map(req => {
                const done = req.test(value)
                return (
                  <div key={req.label} style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: done ? 1 : 0.45, transition: 'opacity 0.2s ease' }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%',
                      border: done ? 'none' : '1px solid rgba(0,0,0,0.15)',
                      background: done ? '#22c55e' : 'transparent',
                      flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.2s ease',
                    }}>
                      {done && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3.2 5.7L6.5 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 500, color: done ? '#0a0a0a' : 'rgba(0,0,0,0.5)', letterSpacing: '-0.01em', transition: 'color 0.2s ease' }}>
                      {req.label}
                    </span>
                  </div>
                )
              })}
            </div>

            {strength > 0 && (
              <div style={{
                padding: '3px 10px', borderRadius: 20,
                background: STRENGTH_BG[strength],
                border: '1px solid ' + STRENGTH_COLORS[strength] + '33',
                fontSize: 11.5, fontWeight: 600, color: STRENGTH_COLORS[strength],
                letterSpacing: '-0.01em', whiteSpace: 'nowrap', flexShrink: 0,
                transition: 'all 0.25s ease',
              }}>
                {STRENGTH_LABELS[strength]}
              </div>
            )}
          </div>
        </div>
      )}

      {showMatch && (
        <div style={{ marginTop: 6, fontSize: 11.5, fontWeight: 500, letterSpacing: '-0.01em', color: matched ? '#22c55e' : '#ef4444', transition: 'color 0.15s ease' }}>
          {matched ? '✓ Passwords match' : '✗ Passwords do not match'}
        </div>
      )}
    </div>
  )
}

// Usage
export default function App() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  return (
    <div style={{ padding: 24, maxWidth: 360, fontFamily: font, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PasswordField
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="Create a strong password"
        showStrength
      />
      <PasswordField
        label="Confirm password"
        value={confirm}
        onChange={setConfirm}
        placeholder="Repeat your password"
        matchAgainst={password}
      />
    </div>
  )
}`

// ── Page ─────────────────────────────────────────────────────────────────────────

export default function PasswordStrengthPage() {
  return (
    <div style={{ background: '#fff' }}>
      <Demo />

      <div style={{ background: '#0a0a0a', padding: 'clamp(24px, 4vw, 48px)' as any, fontFamily: font }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>
                Password Strength Meter
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                Drop into any React project — zero dependencies
              </div>
            </div>
            <CopyButton text={CODE_SOURCE} />
          </div>

          <div style={{ background: '#111', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontFamily: 'ui-monospace, monospace' }}>
                PasswordField.tsx
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
