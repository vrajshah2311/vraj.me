'use client'

import { useState, useEffect } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const STEPS = ['Account', 'Preferences', 'Review'] as const
const ROLES = ['Engineer', 'Designer', 'Product', 'Founder', 'Other'] as const

type Phase = 'in' | 'out' | 'entering'
type Errs = Record<string, string>

// ─── Field wrapper ───────────────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 600,
        color: 'rgba(0,0,0,0.4)', letterSpacing: '0.04em',
        textTransform: 'uppercase' as const, marginBottom: 6, fontFamily: font,
      }}>
        {label}
      </label>
      {children}
      {error && (
        <div style={{
          marginTop: 5, fontSize: 11, fontWeight: 500,
          color: 'rgba(220,38,38,0.85)', letterSpacing: '-0.01em', fontFamily: font,
        }}>
          {error}
        </div>
      )}
    </div>
  )
}

// ─── Controlled input ────────────────────────────────────────────────────────

function TextInput({
  value, onChange, placeholder, type = 'text', hasError = false,
}: {
  value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; hasError?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', padding: '9px 12px', boxSizing: 'border-box' as const,
        border: `1px solid ${hasError ? 'rgba(220,38,38,0.45)' : focused ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.09)'}`,
        borderRadius: 10, fontSize: 13, fontWeight: 500,
        color: '#0a0a0a',
        background: hasError ? 'rgba(254,242,242,0.5)' : '#fff',
        outline: 'none', letterSpacing: '-0.01em', fontFamily: font,
        boxShadow: focused && !hasError ? '0 0 0 3px rgba(0,0,0,0.04)' : 'none',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
      }}
    />
  )
}

// ─── Toggle switch ───────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label, hint }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string
}) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '11px 14px',
        background: 'rgba(0,0,0,0.02)', borderRadius: 10,
        border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer',
        userSelect: 'none' as const,
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: font }}>
          {label}
        </div>
        {hint && (
          <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.35)', marginTop: 1, fontFamily: font }}>
            {hint}
          </div>
        )}
      </div>
      <div style={{
        width: 36, height: 20, borderRadius: 10, flexShrink: 0,
        background: checked ? '#0a0a0a' : 'rgba(0,0,0,0.12)',
        position: 'relative', transition: 'background 0.2s ease',
      }}>
        <div style={{
          position: 'absolute', top: 2,
          left: checked ? 18 : 2, width: 16, height: 16,
          borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
      </div>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

function MultiStepForm() {
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<Phase>('in')
  const [dir, setDir] = useState(1) // 1 = forward, -1 = backward
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<Errs>({})

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Engineer')
  const [notifs, setNotifs] = useState(true)

  // Double rAF ensures browser paints the 'entering' (off-screen) position
  // before the transition to 'in' (center) kicks in.
  useEffect(() => {
    if (phase === 'entering') {
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase('in')))
    }
  }, [phase])

  const navigate = (next: number) => {
    setDir(next > step ? 1 : -1)
    setPhase('out')
    setTimeout(() => {
      setStep(next)
      setErrors({})
      setPhase('entering')
    }, 160)
  }

  const validate = (): boolean => {
    const e: Errs = {}
    if (step === 0) {
      if (!name.trim()) e.name = 'Name is required'
      if (!email.trim()) e.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Enter a valid email'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (!validate()) return
    if (step < STEPS.length - 1) navigate(step + 1)
    else setDone(true)
  }

  const handleBack = () => {
    if (step > 0) navigate(step - 1)
  }

  const contentStyle = {
    opacity: phase === 'in' ? 1 : 0,
    transform:
      phase === 'in'
        ? 'translateX(0)'
        : phase === 'entering'
          ? `translateX(${dir * 18}px)`
          : `translateX(${-dir * 18}px)`,
    transition:
      phase !== 'entering'
        ? 'opacity 0.16s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
        : 'none',
  }

  // ── Success state ────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div style={{
        padding: '28px 24px 24px',
        display: 'flex', flexDirection: 'column' as const,
        alignItems: 'center', gap: 16, fontFamily: font,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(22,163,74,0.08)',
          border: '1.5px solid rgba(22,163,74,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4.5 10L8.5 14L15.5 6.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ textAlign: 'center' as const }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
            All set{name ? `, ${name.split(' ')[0]}` : ''}!
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.4)', marginTop: 4, letterSpacing: '-0.01em' }}>
            Your account has been created.
          </div>
        </div>
        <div style={{
          width: '100%', borderRadius: 10,
          border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden',
        }}>
          {[
            { label: 'Name', value: name || '—' },
            { label: 'Email', value: email || '—' },
            { label: 'Role', value: role },
            { label: 'Notifications', value: notifs ? 'Enabled' : 'Disabled' },
          ].map((item, i, arr) => (
            <div key={item.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px',
              borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
            }}>
              <span style={{
                fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.35)',
                letterSpacing: '0.04em', textTransform: 'uppercase' as const,
              }}>
                {item.label}
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setDone(false); setStep(0); setPhase('in')
            setName(''); setEmail(''); setRole('Engineer'); setNotifs(true)
          }}
          style={{
            background: 'none', border: 'none', fontSize: 12, fontWeight: 500,
            color: 'rgba(0,0,0,0.35)', cursor: 'pointer',
            letterSpacing: '-0.01em', fontFamily: font, padding: '4px 0',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#0a0a0a')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.35)')}
        >
          ← Start over
        </button>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: font }}>
      {/* ── Step indicator ── */}
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 24 }}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 5 }}>
                {/* Circle */}
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i <= step ? '#0a0a0a' : 'transparent',
                  border: i <= step ? 'none' : '1.5px solid rgba(0,0,0,0.12)',
                  transition: 'background 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease',
                }}>
                  {i < step ? (
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M2.5 5.5L4.5 7.5L8.5 3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span style={{
                      fontSize: 10, fontWeight: 600, lineHeight: 1,
                      color: i === step ? '#fff' : 'rgba(0,0,0,0.3)',
                    }}>
                      {i + 1}
                    </span>
                  )}
                </div>
                {/* Label */}
                <span style={{
                  fontSize: 10, fontWeight: 500, letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap' as const,
                  color: i === step ? '#0a0a0a' : 'rgba(0,0,0,0.3)',
                  transition: 'color 0.2s ease',
                }}>
                  {label}
                </span>
              </div>
              {/* Connecting line */}
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 1.5, margin: '12px 8px 0',
                  background: 'rgba(0,0,0,0.08)', position: 'relative',
                  overflow: 'hidden', borderRadius: 1,
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, bottom: 0,
                    background: '#0a0a0a', borderRadius: 1,
                    width: i < step ? '100%' : '0%',
                    transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Animated step content ── */}
      <div style={{ overflow: 'hidden' }}>
        <div style={{ padding: '0 24px', ...contentStyle }}>

          {/* Step 0: Account */}
          {step === 0 && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                  Create your account
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.4)', marginTop: 3, letterSpacing: '-0.01em' }}>
                  Let&apos;s start with the basics.
                </div>
              </div>
              <Field label="Full name" error={errors.name}>
                <TextInput value={name} onChange={setName} placeholder="Alex Johnson" hasError={!!errors.name} />
              </Field>
              <Field label="Email" error={errors.email}>
                <TextInput value={email} onChange={setEmail} placeholder="alex@example.com" type="email" hasError={!!errors.email} />
              </Field>
            </div>
          )}

          {/* Step 1: Preferences */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                  Set your preferences
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.4)', marginTop: 3, letterSpacing: '-0.01em' }}>
                  Customize your experience.
                </div>
              </div>
              <Field label="Role">
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                  {ROLES.map(r => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      style={{
                        padding: '6px 13px', borderRadius: 8,
                        border: `1px solid ${r === role ? '#0a0a0a' : 'rgba(0,0,0,0.09)'}`,
                        background: r === role ? '#0a0a0a' : 'transparent',
                        color: r === role ? '#fff' : '#0a0a0a',
                        fontSize: 12, fontWeight: 500, cursor: 'pointer',
                        letterSpacing: '-0.01em', fontFamily: font,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Notifications">
                <Toggle
                  checked={notifs}
                  onChange={setNotifs}
                  label="Email notifications"
                  hint="Get updates about your account"
                />
              </Field>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                  Review your details
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.4)', marginTop: 3, letterSpacing: '-0.01em' }}>
                  Everything look right?
                </div>
              </div>
              <div style={{ borderRadius: 10, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                {[
                  { label: 'Name', value: name || '—' },
                  { label: 'Email', value: email || '—' },
                  { label: 'Role', value: role },
                  { label: 'Notifications', value: notifs ? 'Enabled' : 'Disabled' },
                ].map((item, i, arr) => (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px',
                    borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.35)',
                      letterSpacing: '0.04em', textTransform: 'uppercase' as const,
                    }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Navigation ── */}
      <div style={{
        padding: '20px 24px 24px',
        display: 'flex', gap: 8,
        justifyContent: step > 0 ? 'space-between' : 'flex-end',
        alignItems: 'center',
      }}>
        {step > 0 && (
          <button
            onClick={handleBack}
            style={{
              padding: '9px 16px', background: 'transparent',
              border: '1px solid rgba(0,0,0,0.09)', borderRadius: 10,
              color: '#0a0a0a', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', letterSpacing: '-0.01em', fontFamily: font,
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            ← Back
          </button>
        )}
        <button
          onClick={handleNext}
          style={{
            flex: step === 0 ? 1 : 'none',
            padding: '9px 20px', background: '#0a0a0a', border: 'none',
            borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', letterSpacing: '-0.01em', fontFamily: font,
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {step === STEPS.length - 1 ? 'Create Account' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}

// ─── Demo wrapper ─────────────────────────────────────────────────────────────

function Demo() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column' as const,
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
      padding: '40px 24px',
      fontFamily: font,
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        background: '#fff',
        borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        <MultiStepForm />
      </div>
      <div style={{
        marginTop: 14, fontSize: 12, fontWeight: 500,
        color: 'rgba(0,0,0,0.35)', letterSpacing: '-0.01em',
      }}>
        Fill each step · animated slide transition · inline validation
      </div>
    </div>
  )
}

// ─── Copy button ──────────────────────────────────────────────────────────────

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
        border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7,
        color: copied ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
        fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: font,
        letterSpacing: '-0.01em', transition: 'background 0.15s ease, color 0.15s ease',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ─── Copyable source ──────────────────────────────────────────────────────────

const CODE_SOURCE = `'use client'

import { useState, useEffect } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const STEPS = ['Account', 'Preferences', 'Review']
const ROLES = ['Engineer', 'Designer', 'Product', 'Founder', 'Other']

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 600,
        color: 'rgba(0,0,0,0.4)', letterSpacing: '0.04em',
        textTransform: 'uppercase', marginBottom: 6, fontFamily: font,
      }}>
        {label}
      </label>
      {children}
      {error && (
        <div style={{
          marginTop: 5, fontSize: 11, fontWeight: 500,
          color: 'rgba(220,38,38,0.85)', letterSpacing: '-0.01em', fontFamily: font,
        }}>
          {error}
        </div>
      )}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text', hasError = false }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', padding: '9px 12px', boxSizing: 'border-box',
        border: \`1px solid \${hasError ? 'rgba(220,38,38,0.45)' : focused ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.09)'}\`,
        borderRadius: 10, fontSize: 13, fontWeight: 500, color: '#0a0a0a',
        background: hasError ? 'rgba(254,242,242,0.5)' : '#fff',
        outline: 'none', letterSpacing: '-0.01em', fontFamily: font,
        boxShadow: focused && !hasError ? '0 0 0 3px rgba(0,0,0,0.04)' : 'none',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
      }}
    />
  )
}

function Toggle({ checked, onChange, label, hint }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '11px 14px', background: 'rgba(0,0,0,0.02)', borderRadius: 10,
        border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer', userSelect: 'none',
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: font }}>
          {label}
        </div>
        {hint && (
          <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.35)', marginTop: 1, fontFamily: font }}>
            {hint}
          </div>
        )}
      </div>
      <div style={{
        width: 36, height: 20, borderRadius: 10, flexShrink: 0,
        background: checked ? '#0a0a0a' : 'rgba(0,0,0,0.12)',
        position: 'relative', transition: 'background 0.2s ease',
      }}>
        <div style={{
          position: 'absolute', top: 2, left: checked ? 18 : 2,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
      </div>
    </div>
  )
}

export default function MultiStepForm() {
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState('in') // 'in' | 'out' | 'entering'
  const [dir, setDir] = useState(1)        // 1 = forward, -1 = back
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState({})

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Engineer')
  const [notifs, setNotifs] = useState(true)

  // Double rAF: paint the off-screen position before transitioning to center.
  useEffect(() => {
    if (phase === 'entering') {
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase('in')))
    }
  }, [phase])

  const navigate = (next) => {
    setDir(next > step ? 1 : -1)
    setPhase('out')
    setTimeout(() => {
      setStep(next)
      setErrors({})
      setPhase('entering')
    }, 160)
  }

  const validate = () => {
    const e = {}
    if (step === 0) {
      if (!name.trim()) e.name = 'Name is required'
      if (!email.trim()) e.email = 'Email is required'
      else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim())) e.email = 'Enter a valid email'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (!validate()) return
    if (step < STEPS.length - 1) navigate(step + 1)
    else setDone(true)
  }

  const contentStyle = {
    opacity: phase === 'in' ? 1 : 0,
    transform:
      phase === 'in' ? 'translateX(0)'
      : phase === 'entering' ? \`translateX(\${dir * 18}px)\`
      : \`translateX(\${-dir * 18}px)\`,
    transition:
      phase !== 'entering'
        ? 'opacity 0.16s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
        : 'none',
  }

  if (done) {
    return (
      <div style={{ padding: '28px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, fontFamily: font }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(22,163,74,0.08)', border: '1.5px solid rgba(22,163,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4.5 10L8.5 14L15.5 6.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>All set{name ? \`, \${name.split(' ')[0]}\` : ''}!</div>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.4)', marginTop: 4, letterSpacing: '-0.01em' }}>Your account has been created.</div>
        </div>
        <div style={{ width: '100%', borderRadius: 10, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          {[['Name', name || '—'], ['Email', email || '—'], ['Role', role], ['Notifications', notifs ? 'Enabled' : 'Disabled']].map(([k, v], i, a) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: i < a.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>{v}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => { setDone(false); setStep(0); setPhase('in'); setName(''); setEmail(''); setRole('Engineer'); setNotifs(true) }}
          style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.35)', cursor: 'pointer', letterSpacing: '-0.01em', fontFamily: font, padding: '4px 0', transition: 'color 0.15s ease' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#0a0a0a')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.35)')}
        >
          ← Start over
        </button>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: font }}>
      {/* Step indicator */}
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 24 }}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i <= step ? '#0a0a0a' : 'transparent',
                  border: i <= step ? 'none' : '1.5px solid rgba(0,0,0,0.12)',
                  transition: 'background 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                  {i < step ? (
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M2.5 5.5L4.5 7.5L8.5 3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span style={{ fontSize: 10, fontWeight: 600, lineHeight: 1, color: i === step ? '#fff' : 'rgba(0,0,0,0.3)' }}>{i + 1}</span>
                  )}
                </div>
                <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '-0.01em', whiteSpace: 'nowrap', color: i === step ? '#0a0a0a' : 'rgba(0,0,0,0.3)', transition: 'color 0.2s ease' }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 1.5, margin: '12px 8px 0', background: 'rgba(0,0,0,0.08)', position: 'relative', overflow: 'hidden', borderRadius: 1 }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, background: '#0a0a0a', borderRadius: 1, width: i < step ? '100%' : '0%', transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Animated content */}
      <div style={{ overflow: 'hidden' }}>
        <div style={{ padding: '0 24px', ...contentStyle }}>
          {step === 0 && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>Create your account</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.4)', marginTop: 3, letterSpacing: '-0.01em' }}>Let's start with the basics.</div>
              </div>
              <Field label="Full name" error={errors.name}>
                <TextInput value={name} onChange={setName} placeholder="Alex Johnson" hasError={!!errors.name} />
              </Field>
              <Field label="Email" error={errors.email}>
                <TextInput value={email} onChange={setEmail} placeholder="alex@example.com" type="email" hasError={!!errors.email} />
              </Field>
            </div>
          )}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>Set your preferences</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.4)', marginTop: 3, letterSpacing: '-0.01em' }}>Customize your experience.</div>
              </div>
              <Field label="Role">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ROLES.map(r => (
                    <button key={r} onClick={() => setRole(r)} style={{ padding: '6px 13px', borderRadius: 8, border: \`1px solid \${r === role ? '#0a0a0a' : 'rgba(0,0,0,0.09)'}\`, background: r === role ? '#0a0a0a' : 'transparent', color: r === role ? '#fff' : '#0a0a0a', fontSize: 12, fontWeight: 500, cursor: 'pointer', letterSpacing: '-0.01em', fontFamily: font, transition: 'all 0.15s ease' }}>{r}</button>
                  ))}
                </div>
              </Field>
              <Field label="Notifications">
                <Toggle checked={notifs} onChange={setNotifs} label="Email notifications" hint="Get updates about your account" />
              </Field>
            </div>
          )}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>Review your details</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.4)', marginTop: 3, letterSpacing: '-0.01em' }}>Everything look right?</div>
              </div>
              <div style={{ borderRadius: 10, border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                {[{ label: 'Name', value: name || '—' }, { label: 'Email', value: email || '—' }, { label: 'Role', value: role }, { label: 'Notifications', value: notifs ? 'Enabled' : 'Disabled' }].map((item, i, arr) => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{item.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ padding: '20px 24px 24px', display: 'flex', gap: 8, justifyContent: step > 0 ? 'space-between' : 'flex-end', alignItems: 'center' }}>
        {step > 0 && (
          <button onClick={() => navigate(step - 1)} style={{ padding: '9px 16px', background: 'transparent', border: '1px solid rgba(0,0,0,0.09)', borderRadius: 10, color: '#0a0a0a', fontSize: 13, fontWeight: 500, cursor: 'pointer', letterSpacing: '-0.01em', fontFamily: font, transition: 'background 0.15s ease' }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>← Back</button>
        )}
        <button onClick={handleNext} style={{ flex: step === 0 ? 1 : 'none', padding: '9px 20px', background: '#0a0a0a', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: '-0.01em', fontFamily: font, transition: 'opacity 0.15s ease' }} onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
          {step === STEPS.length - 1 ? 'Create Account' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MultiStepFormPage() {
  return (
    <div style={{ background: '#fff' }}>
      <Demo />

      {/* CODE */}
      <div style={{ background: '#0a0a0a', padding: 'clamp(24px, 4vw, 48px)', fontFamily: font }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>
                Multi-Step Form
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
                MultiStepForm.tsx
              </div>
            </div>
            <pre style={{
              margin: 0, padding: '20px',
              overflowX: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
              fontSize: 12.5, lineHeight: 1.65, color: '#e5e5e5',
              scrollbarWidth: 'thin' as const,
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
