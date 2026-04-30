'use client'

import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Direction = 'forward' | 'backward'

interface FormData {
  name: string
  email: string
  role: string
  experience: string
  company: string
  useCase: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { title: 'Personal info',   subtitle: "Let's start with the basics" },
  { title: 'Your background', subtitle: 'Tell us a bit about yourself' },
  { title: 'Workspace',       subtitle: 'Where will you use this?' },
  { title: 'All set!',        subtitle: '' },
]

const ROLES = ['Designer', 'Developer', 'Product', 'Founder', 'Other']
const EXP   = ['< 1 year', '1–3 years', '3–7 years', '7+ years']

// ─── Input ────────────────────────────────────────────────────────────────────

function Input({ label, value, onChange, placeholder, type = 'text', error }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  error?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: '12px', fontWeight: 600, letterSpacing: '-0.01em',
        color: error ? '#dc2626' : 'rgba(10,10,10,0.55)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          padding: '10px 12px',
          borderRadius: '10px',
          border: error
            ? '1px solid rgba(220,38,38,0.5)'
            : focused ? '1px solid rgba(10,10,10,0.24)' : '1px solid rgba(10,10,10,0.12)',
          background: '#fff',
          fontSize: '14px',
          fontWeight: 500,
          color: '#0a0a0a',
          letterSpacing: '-0.01em',
          outline: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          boxShadow: error
            ? '0 0 0 3px rgba(220,38,38,0.08)'
            : focused ? '0 0 0 3px rgba(10,10,10,0.06)' : 'none',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
      {error && (
        <span style={{ fontSize: '11px', fontWeight: 500, color: '#dc2626', letterSpacing: '-0.01em' }}>
          {error}
        </span>
      )}
    </div>
  )
}

// ─── Chip Select ──────────────────────────────────────────────────────────────

function ChipSelect({ label, options, value, onChange, error }: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
  error?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{
        fontSize: '12px', fontWeight: 600, letterSpacing: '-0.01em',
        color: error ? '#dc2626' : 'rgba(10,10,10,0.55)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}>
        {label}
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {options.map(opt => {
          const sel = value === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: sel ? '1px solid rgba(10,10,10,0.3)' : '1px solid rgba(10,10,10,0.1)',
                background: sel ? '#0a0a0a' : '#fff',
                color: sel ? '#fff' : 'rgba(10,10,10,0.65)',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                transition: 'background 150ms ease, border-color 150ms ease, color 150ms ease',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {error && (
        <span style={{ fontSize: '11px', fontWeight: 500, color: '#dc2626', letterSpacing: '-0.01em' }}>
          {error}
        </span>
      )}
    </div>
  )
}

// ─── Multi-step Form ──────────────────────────────────────────────────────────

function MultiStepForm() {
  const [step, setStep]       = useState(0)
  const [dir, setDir]         = useState<Direction>('forward')
  const [visible, setVisible] = useState(true)
  const [busy, setBusy]       = useState(false)
  const [errors, setErrors]   = useState<Partial<Record<keyof FormData, string>>>({})
  const [data, setData]       = useState<FormData>({
    name: '', email: '', role: '', experience: '', company: '', useCase: '',
  })

  const TOTAL = STEPS.length - 1

  const update = (field: keyof FormData) => (val: string) => {
    setData(p => ({ ...p, [field]: val }))
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }))
  }

  const validate = (s: number) => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (s === 0) {
      if (!data.name.trim()) e.name = 'Name is required'
      if (!data.email.trim()) e.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email'
    } else if (s === 1) {
      if (!data.role) e.role = 'Please choose a role'
      if (!data.experience) e.experience = 'Please choose your experience level'
    } else if (s === 2) {
      if (!data.company.trim()) e.company = 'Company or project name is required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const transition = (next: number, d: Direction) => {
    if (busy) return
    setBusy(true)
    setDir(d)
    setVisible(false)
    setTimeout(() => {
      setStep(next)
      setVisible(true)
      setBusy(false)
    }, 200)
  }

  const next  = () => { if (validate(step)) transition(step + 1, 'forward') }
  const back  = () => { if (step > 0) transition(step - 1, 'backward') }
  const reset = () => {
    setData({ name: '', email: '', role: '', experience: '', company: '', useCase: '' })
    setErrors({})
    transition(0, 'backward')
  }

  const isSuccess = step === TOTAL
  const firstName = data.name.split(' ')[0] || 'there'

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)',
      width: '400px',
      maxWidth: '100%',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>

      {/* ─ Step indicators ─ */}
      {!isSuccess && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < TOTAL - 1 ? 1 : 0 }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                background: i <= step ? '#0a0a0a' : 'rgba(10,10,10,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 300ms ease',
              }}>
                {i < step ? (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span style={{
                    fontSize: '10px', fontWeight: 700, lineHeight: '1',
                    color: i === step ? '#fff' : 'rgba(10,10,10,0.3)',
                  }}>
                    {i + 1}
                  </span>
                )}
              </div>
              {i < TOTAL - 1 && (
                <div style={{
                  flex: 1, height: '1px', margin: '0 8px',
                  background: i < step ? '#0a0a0a' : 'rgba(10,10,10,0.08)',
                  transition: 'background 400ms ease',
                }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ─ Animated content ─ */}
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateX(0)'
          : dir === 'forward' ? 'translateX(-14px)' : 'translateX(14px)',
        transition: 'opacity 180ms ease, transform 200ms cubic-bezier(0.32, 0.72, 0, 1)',
      }}>

        {/* Header */}
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{
            margin: '0 0 4px', fontSize: '18px', fontWeight: 600,
            color: '#0a0a0a', letterSpacing: '-0.02em', lineHeight: '1.2',
          }}>
            {STEPS[step].title}
          </h2>
          {STEPS[step].subtitle && (
            <p style={{
              margin: 0, fontSize: '13px', fontWeight: 500,
              color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em',
            }}>
              {STEPS[step].subtitle}
            </p>
          )}
        </div>

        {/* Step 0 – personal info */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Full name"
              value={data.name}
              onChange={update('name')}
              placeholder="Jane Smith"
              error={errors.name}
            />
            <Input
              label="Email address"
              value={data.email}
              onChange={update('email')}
              placeholder="jane@example.com"
              type="email"
              error={errors.email}
            />
          </div>
        )}

        {/* Step 1 – role & experience */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ChipSelect
              label="Your role"
              options={ROLES}
              value={data.role}
              onChange={update('role')}
              error={errors.role}
            />
            <ChipSelect
              label="Years of experience"
              options={EXP}
              value={data.experience}
              onChange={update('experience')}
              error={errors.experience}
            />
          </div>
        )}

        {/* Step 2 – workspace */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Company or project"
              value={data.company}
              onChange={update('company')}
              placeholder="Acme Inc."
              error={errors.company}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{
                fontSize: '12px', fontWeight: 600, letterSpacing: '-0.01em',
                color: 'rgba(10,10,10,0.55)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              }}>
                What will you use this for?{' '}
                <span style={{ fontWeight: 500, color: 'rgba(10,10,10,0.35)' }}>(optional)</span>
              </label>
              <textarea
                value={data.useCase}
                onChange={e => update('useCase')(e.target.value)}
                placeholder="e.g. Building a SaaS dashboard..."
                rows={3}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(10,10,10,0.12)',
                  background: '#fff',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#0a0a0a',
                  letterSpacing: '-0.01em',
                  outline: 'none',
                  resize: 'none',
                  lineHeight: '1.5',
                  boxSizing: 'border-box',
                  width: '100%',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                  transition: 'border-color 150ms ease, box-shadow 150ms ease',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(10,10,10,0.24)'
                  e.target.style.boxShadow   = '0 0 0 3px rgba(10,10,10,0.06)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(10,10,10,0.12)'
                  e.target.style.boxShadow   = 'none'
                }}
              />
            </div>
          </div>
        )}

        {/* Step 3 – success */}
        {step === 3 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center', gap: '16px', padding: '8px 0 4px',
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%', background: '#0a0a0a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 12L9.5 17.5L20 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 style={{
                margin: '0 0 6px', fontSize: '20px', fontWeight: 600,
                color: '#0a0a0a', letterSpacing: '-0.02em',
              }}>
                You're all set, {firstName}!
              </h2>
              <p style={{
                margin: 0, fontSize: '13px', fontWeight: 500,
                color: 'rgba(10,10,10,0.5)', letterSpacing: '-0.01em', lineHeight: '1.5',
              }}>
                We'll reach you at{' '}
                <strong style={{ color: '#0a0a0a', fontWeight: 600 }}>{data.email}</strong>
              </p>
            </div>
            <div style={{
              background: 'rgba(10,10,10,0.03)', borderRadius: '10px',
              padding: '14px 18px', width: '100%', textAlign: 'left',
            }}>
              {[
                { label: 'Role',       value: data.role       || '—' },
                { label: 'Experience', value: data.experience || '—' },
                { label: 'Company',    value: data.company    || '—' },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '5px 0',
                }}>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.4)' }}>
                    {row.label}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─ Navigation ─ */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginTop: '28px',
      }}>
        {!isSuccess && step > 0 ? (
          <button
            onClick={back}
            style={{
              padding: '9px 18px', borderRadius: '9px',
              border: '1px solid rgba(10,10,10,0.10)', background: '#fff',
              color: 'rgba(10,10,10,0.6)', fontSize: '13px', fontWeight: 500,
              letterSpacing: '-0.01em', cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              transition: 'background 150ms ease, color 150ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(10,10,10,0.04)'
              e.currentTarget.style.color = '#0a0a0a'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.color = 'rgba(10,10,10,0.6)'
            }}
          >
            Back
          </button>
        ) : <div />}

        {isSuccess ? (
          <button
            onClick={reset}
            style={{
              padding: '9px 20px', borderRadius: '9px', border: 'none',
              background: 'rgba(10,10,10,0.06)', color: '#0a0a0a',
              fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em',
              cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(10,10,10,0.09)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(10,10,10,0.06)'}
          >
            Start over
          </button>
        ) : (
          <button
            onClick={next}
            style={{
              padding: '9px 20px', borderRadius: '9px', border: 'none',
              background: '#0a0a0a', color: '#fff',
              fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              transition: 'opacity 150ms ease, transform 100ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {step === TOTAL - 1 ? 'Submit' : 'Continue'}
            {step < TOTAL - 1 && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6H9.5M6.5 3L9.5 6L6.5 9"
                  stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState } from 'react'

type Direction = 'forward' | 'backward'

interface FormData {
  name: string
  email: string
  role: string
  experience: string
  company: string
  useCase: string
}

const STEPS = [
  { title: 'Personal info',   subtitle: "Let's start with the basics" },
  { title: 'Your background', subtitle: 'Tell us a bit about yourself' },
  { title: 'Workspace',       subtitle: 'Where will you use this?' },
  { title: 'All set!',        subtitle: '' },
]

const ROLES = ['Designer', 'Developer', 'Product', 'Founder', 'Other']
const EXP   = ['< 1 year', '1–3 years', '3–7 years', '7+ years']

function Input({ label, value, onChange, placeholder, type = 'text', error }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  error?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: '12px', fontWeight: 600, letterSpacing: '-0.01em',
        color: error ? '#dc2626' : 'rgba(10,10,10,0.55)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          padding: '10px 12px',
          borderRadius: '10px',
          border: error
            ? '1px solid rgba(220,38,38,0.5)'
            : focused ? '1px solid rgba(10,10,10,0.24)' : '1px solid rgba(10,10,10,0.12)',
          background: '#fff',
          fontSize: '14px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em',
          outline: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          boxShadow: error
            ? '0 0 0 3px rgba(220,38,38,0.08)'
            : focused ? '0 0 0 3px rgba(10,10,10,0.06)' : 'none',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          width: '100%', boxSizing: 'border-box' as const,
        }}
      />
      {error && (
        <span style={{ fontSize: '11px', fontWeight: 500, color: '#dc2626', letterSpacing: '-0.01em' }}>
          {error}
        </span>
      )}
    </div>
  )
}

function ChipSelect({ label, options, value, onChange, error }: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
  error?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{
        fontSize: '12px', fontWeight: 600, letterSpacing: '-0.01em',
        color: error ? '#dc2626' : 'rgba(10,10,10,0.55)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}>
        {label}
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {options.map(opt => {
          const sel = value === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              style={{
                padding: '7px 14px', borderRadius: '8px',
                border: sel ? '1px solid rgba(10,10,10,0.3)' : '1px solid rgba(10,10,10,0.1)',
                background: sel ? '#0a0a0a' : '#fff',
                color: sel ? '#fff' : 'rgba(10,10,10,0.65)',
                fontSize: '13px', fontWeight: 500, letterSpacing: '-0.01em',
                cursor: 'pointer',
                transition: 'background 150ms ease, border-color 150ms ease, color 150ms ease',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {error && (
        <span style={{ fontSize: '11px', fontWeight: 500, color: '#dc2626', letterSpacing: '-0.01em' }}>
          {error}
        </span>
      )}
    </div>
  )
}

export function MultiStepForm() {
  const [step, setStep]       = useState(0)
  const [dir, setDir]         = useState<Direction>('forward')
  const [visible, setVisible] = useState(true)
  const [busy, setBusy]       = useState(false)
  const [errors, setErrors]   = useState<Partial<Record<keyof FormData, string>>>({})
  const [data, setData]       = useState<FormData>({
    name: '', email: '', role: '', experience: '', company: '', useCase: '',
  })

  const TOTAL = STEPS.length - 1

  const update = (field: keyof FormData) => (val: string) => {
    setData(p => ({ ...p, [field]: val }))
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }))
  }

  const validate = (s: number) => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (s === 0) {
      if (!data.name.trim()) e.name = 'Name is required'
      if (!data.email.trim()) e.email = 'Email is required'
      else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(data.email)) e.email = 'Enter a valid email'
    } else if (s === 1) {
      if (!data.role) e.role = 'Please choose a role'
      if (!data.experience) e.experience = 'Please choose your experience level'
    } else if (s === 2) {
      if (!data.company.trim()) e.company = 'Company or project name is required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const transition = (next: number, d: Direction) => {
    if (busy) return
    setBusy(true)
    setDir(d)
    setVisible(false)
    setTimeout(() => { setStep(next); setVisible(true); setBusy(false) }, 200)
  }

  const next  = () => { if (validate(step)) transition(step + 1, 'forward') }
  const back  = () => { if (step > 0) transition(step - 1, 'backward') }
  const reset = () => {
    setData({ name: '', email: '', role: '', experience: '', company: '', useCase: '' })
    setErrors({})
    transition(0, 'backward')
  }

  const isSuccess = step === TOTAL
  const firstName = data.name.split(' ')[0] || 'there'

  return (
    <div style={{
      background: '#fff', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '16px',
      padding: '32px', boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)',
      width: '400px', maxWidth: '100%',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>

      {/* Step indicators */}
      {!isSuccess && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < TOTAL - 1 ? 1 : 0 }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                background: i <= step ? '#0a0a0a' : 'rgba(10,10,10,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 300ms ease',
              }}>
                {i < step ? (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span style={{ fontSize: '10px', fontWeight: 700, lineHeight: '1', color: i === step ? '#fff' : 'rgba(10,10,10,0.3)' }}>
                    {i + 1}
                  </span>
                )}
              </div>
              {i < TOTAL - 1 && (
                <div style={{
                  flex: 1, height: '1px', margin: '0 8px',
                  background: i < step ? '#0a0a0a' : 'rgba(10,10,10,0.08)',
                  transition: 'background 400ms ease',
                }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Animated content */}
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : dir === 'forward' ? 'translateX(-14px)' : 'translateX(14px)',
        transition: 'opacity 180ms ease, transform 200ms cubic-bezier(0.32, 0.72, 0, 1)',
      }}>
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
            {STEPS[step].title}
          </h2>
          {STEPS[step].subtitle && (
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em' }}>
              {STEPS[step].subtitle}
            </p>
          )}
        </div>

        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Full name" value={data.name} onChange={update('name')} placeholder="Jane Smith" error={errors.name} />
            <Input label="Email address" value={data.email} onChange={update('email')} placeholder="jane@example.com" type="email" error={errors.email} />
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ChipSelect label="Your role" options={ROLES} value={data.role} onChange={update('role')} error={errors.role} />
            <ChipSelect label="Years of experience" options={EXP} value={data.experience} onChange={update('experience')} error={errors.experience} />
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Company or project" value={data.company} onChange={update('company')} placeholder="Acme Inc." error={errors.company} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(10,10,10,0.55)', letterSpacing: '-0.01em' }}>
                What will you use this for?{' '}
                <span style={{ fontWeight: 500, color: 'rgba(10,10,10,0.35)' }}>(optional)</span>
              </label>
              <textarea
                value={data.useCase}
                onChange={e => update('useCase')(e.target.value)}
                placeholder="e.g. Building a SaaS dashboard..."
                rows={3}
                style={{
                  padding: '10px 12px', borderRadius: '10px',
                  border: '1px solid rgba(10,10,10,0.12)', background: '#fff',
                  fontSize: '14px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em',
                  outline: 'none', resize: 'none', lineHeight: '1.5',
                  boxSizing: 'border-box' as const, width: '100%',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                  transition: 'border-color 150ms ease, box-shadow 150ms ease',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(10,10,10,0.24)'; e.target.style.boxShadow = '0 0 0 3px rgba(10,10,10,0.06)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(10,10,10,0.12)'; e.target.style.boxShadow = 'none' }}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '8px 0 4px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 12L9.5 17.5L20 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                You're all set, {firstName}!
              </h2>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.5)', letterSpacing: '-0.01em', lineHeight: '1.5' }}>
                We'll reach you at <strong style={{ color: '#0a0a0a', fontWeight: 600 }}>{data.email}</strong>
              </p>
            </div>
            <div style={{ background: 'rgba(10,10,10,0.03)', borderRadius: '10px', padding: '14px 18px', width: '100%', textAlign: 'left' }}>
              {[
                { label: 'Role',       value: data.role       || '—' },
                { label: 'Experience', value: data.experience || '—' },
                { label: 'Company',    value: data.company    || '—' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.4)' }}>{row.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px' }}>
        {!isSuccess && step > 0 ? (
          <button
            onClick={back}
            style={{
              padding: '9px 18px', borderRadius: '9px',
              border: '1px solid rgba(10,10,10,0.10)', background: '#fff',
              color: 'rgba(10,10,10,0.6)', fontSize: '13px', fontWeight: 500,
              letterSpacing: '-0.01em', cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              transition: 'background 150ms ease, color 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,10,10,0.04)'; e.currentTarget.style.color = '#0a0a0a' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'rgba(10,10,10,0.6)' }}
          >
            Back
          </button>
        ) : <div />}

        {isSuccess ? (
          <button
            onClick={reset}
            style={{
              padding: '9px 20px', borderRadius: '9px', border: 'none',
              background: 'rgba(10,10,10,0.06)', color: '#0a0a0a',
              fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em', cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.09)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.06)')}
          >
            Start over
          </button>
        ) : (
          <button
            onClick={next}
            style={{
              padding: '9px 20px', borderRadius: '9px', border: 'none',
              background: '#0a0a0a', color: '#fff',
              fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              transition: 'opacity 150ms ease, transform 100ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {step === TOTAL - 1 ? 'Submit' : 'Continue'}
            {step < TOTAL - 1 && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6H9.5M6.5 3L9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MultiStepFormPage() {
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
        gap: '24px',
      }}>
        <MultiStepForm />
        <p style={{
          margin: 0,
          fontSize: '12px',
          color: 'rgba(0,0,0,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}>
          Fill in each step · validation on continue · smooth slide transitions
        </p>
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
