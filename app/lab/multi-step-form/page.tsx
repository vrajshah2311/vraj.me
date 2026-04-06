'use client'

import { useState, useRef, useEffect } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  name: string
  email: string
  role: string
  company: string
  size: string
  goal: string
}

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 'identity', label: 'You' },
  { id: 'context',  label: 'Context' },
  { id: 'goal',     label: 'Goal' },
]

const ROLES = ['Designer', 'Engineer', 'Product Manager', 'Founder', 'Other']
const SIZES = ['Just me', '2–10', '11–50', '51–200', '200+']

// ─── Input ────────────────────────────────────────────────────────────────────

function Field({
  label,
  type = 'text',
  value,
  placeholder,
  onChange,
  autoFocus,
}: {
  label: string
  type?: string
  value: string
  placeholder?: string
  onChange: (v: string) => void
  autoFocus?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [autoFocus])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: '12px',
        fontWeight: 600,
        color: 'rgba(10,10,10,0.5)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}>
        {label}
      </label>
      <input
        ref={inputRef}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: '8px',
          border: `1px solid ${focused ? 'rgba(10,10,10,0.3)' : 'rgba(10,10,10,0.12)'}`,
          background: '#fff',
          fontSize: '14px',
          fontWeight: 500,
          color: '#0a0a0a',
          letterSpacing: '-0.01em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          outline: 'none',
          boxSizing: 'border-box',
          boxShadow: focused ? '0 0 0 3px rgba(10,10,10,0.06)' : 'none',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
        }}
      />
    </div>
  )
}

// ─── Chip selector ────────────────────────────────────────────────────────────

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{
        fontSize: '12px',
        fontWeight: 600,
        color: 'rgba(10,10,10,0.5)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}>
        {label}
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {options.map(opt => {
          const selected = value === opt
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: `1px solid ${selected ? 'rgba(10,10,10,0.35)' : 'rgba(10,10,10,0.12)'}`,
                background: selected ? '#0a0a0a' : '#fff',
                color: selected ? '#fff' : '#0a0a0a',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                transition: 'background 150ms ease, border-color 150ms ease, color 150ms ease, transform 80ms ease',
                transform: 'scale(1)',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

function TextArea({
  label,
  value,
  placeholder,
  onChange,
  autoFocus,
}: {
  label: string
  value: string
  placeholder?: string
  onChange: (v: string) => void
  autoFocus?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => ref.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [autoFocus])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: '12px',
        fontWeight: 600,
        color: 'rgba(10,10,10,0.5)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}>
        {label}
      </label>
      <textarea
        ref={ref}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={4}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: '8px',
          border: `1px solid ${focused ? 'rgba(10,10,10,0.3)' : 'rgba(10,10,10,0.12)'}`,
          background: '#fff',
          fontSize: '14px',
          fontWeight: 500,
          color: '#0a0a0a',
          letterSpacing: '-0.01em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          outline: 'none',
          resize: 'none',
          boxSizing: 'border-box',
          boxShadow: focused ? '0 0 0 3px rgba(10,10,10,0.06)' : 'none',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
        }}
      />
    </div>
  )
}

// ─── Multi-step form ──────────────────────────────────────────────────────────

function MultiStepForm() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [animating, setAnimating] = useState(false)
  const [done, setDone] = useState(false)
  const [data, setData] = useState<FormData>({
    name: '', email: '', role: '', company: '', size: '', goal: '',
  })

  const set = (key: keyof FormData) => (v: string) =>
    setData(prev => ({ ...prev, [key]: v }))

  const canProceed = [
    data.name.trim() !== '' && data.email.trim() !== '',
    data.role !== '' && data.size !== '',
    data.goal.trim() !== '',
  ][step]

  function go(next: number) {
    if (animating) return
    setDirection(next > step ? 'forward' : 'back')
    setAnimating(true)
    setTimeout(() => {
      setStep(next)
      setAnimating(false)
    }, 220)
  }

  function submit() {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setDone(true)
      setAnimating(false)
    }, 220)
  }

  function reset() {
    setDone(false)
    setStep(0)
    setDirection('forward')
    setData({ name: '', email: '', role: '', company: '', size: '', goal: '' })
  }

  // Slide animation values
  const slideOut = animating
    ? direction === 'forward' ? '-24px' : '24px'
    : '0px'
  const opacity = animating ? 0 : 1

  return (
    <div style={{
      width: '100%',
      maxWidth: '420px',
      background: '#fff',
      borderRadius: '16px',
      border: '1px solid rgba(10,10,10,0.08)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>

      {/* ── Progress bar ── */}
      {!done && (
        <div style={{ padding: '20px 24px 0' }}>
          {/* Step pills */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                style={{
                  flex: 1,
                  height: '3px',
                  borderRadius: '99px',
                  background: i <= step ? '#0a0a0a' : 'rgba(10,10,10,0.1)',
                  transition: 'background 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            ))}
          </div>

          {/* Step label */}
          <p style={{
            margin: 0,
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.35)',
          }}>
            Step {step + 1} of {STEPS.length} — {STEPS[step].label}
          </p>
        </div>
      )}

      {/* ── Animated content ── */}
      <div style={{
        padding: done ? '40px 24px' : '16px 24px 24px',
        transform: `translateX(${slideOut})`,
        opacity,
        transition: 'transform 220ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms ease',
      }}>

        {done ? (
          /* ── Success state ── */
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#f0fdf4',
              border: '1px solid rgba(22,163,74,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '20px',
            }}>
              ✓
            </div>
            <h2 style={{
              margin: '0 0 8px',
              fontSize: '17px',
              fontWeight: 700,
              color: '#0a0a0a',
              letterSpacing: '-0.02em',
            }}>
              All set, {data.name.split(' ')[0]}!
            </h2>
            <p style={{
              margin: '0 0 24px',
              fontSize: '13px',
              fontWeight: 500,
              color: 'rgba(10,10,10,0.5)',
              letterSpacing: '-0.01em',
              lineHeight: '1.5',
            }}>
              We'll reach out to {data.email} shortly.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '9px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(10,10,10,0.12)',
                background: 'transparent',
                color: '#0a0a0a',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background 150ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              Start over
            </button>
          </div>

        ) : step === 0 ? (
          /* ── Step 1: Identity ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                Tell us about yourself
              </h2>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em' }}>
                Quick intro to get started.
              </p>
            </div>
            <Field label="Full name" value={data.name} placeholder="Jane Smith" onChange={set('name')} autoFocus />
            <Field label="Work email" type="email" value={data.email} placeholder="jane@acme.com" onChange={set('email')} />
          </div>

        ) : step === 1 ? (
          /* ── Step 2: Context ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                A bit of context
              </h2>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em' }}>
                Helps us tailor the experience.
              </p>
            </div>
            <ChipGroup label="Your role" options={ROLES} value={data.role} onChange={set('role')} />
            <Field label="Company (optional)" value={data.company} placeholder="Acme Inc." onChange={set('company')} />
            <ChipGroup label="Team size" options={SIZES} value={data.size} onChange={set('size')} />
          </div>

        ) : (
          /* ── Step 3: Goal ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                What's your main goal?
              </h2>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em' }}>
                We'll focus on what matters most to you.
              </p>
            </div>
            <TextArea
              label="In your own words"
              value={data.goal}
              placeholder="e.g. Ship our design system faster without sacrificing quality…"
              onChange={set('goal')}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* ── Footer nav ── */}
      {!done && (
        <div style={{
          padding: '0 24px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Back */}
          <button
            onClick={() => go(step - 1)}
            disabled={step === 0}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(10,10,10,0.12)',
              background: 'transparent',
              color: step === 0 ? 'rgba(10,10,10,0.25)' : '#0a0a0a',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              cursor: step === 0 ? 'default' : 'pointer',
              fontFamily: 'inherit',
              transition: 'background 150ms ease, color 150ms ease',
              pointerEvents: step === 0 ? 'none' : 'auto',
            }}
            onMouseEnter={e => step > 0 && (e.currentTarget.style.background = 'rgba(10,10,10,0.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Back
          </button>

          {/* Next / Submit */}
          <button
            onClick={step < STEPS.length - 1 ? () => go(step + 1) : submit}
            disabled={!canProceed}
            style={{
              padding: '9px 20px',
              borderRadius: '8px',
              border: 'none',
              background: canProceed ? '#0a0a0a' : 'rgba(10,10,10,0.12)',
              color: canProceed ? '#fff' : 'rgba(10,10,10,0.3)',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              cursor: canProceed ? 'pointer' : 'default',
              fontFamily: 'inherit',
              transition: 'background 150ms ease, color 150ms ease, transform 80ms ease',
              transform: 'scale(1)',
            }}
            onMouseDown={e => canProceed && (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {step < STEPS.length - 1 ? 'Continue' : 'Submit'}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect } from 'react'

interface FormData {
  name: string; email: string; role: string
  company: string; size: string; goal: string
}

const STEPS = [
  { id: 'identity', label: 'You' },
  { id: 'context',  label: 'Context' },
  { id: 'goal',     label: 'Goal' },
]

const ROLES = ['Designer', 'Engineer', 'Product Manager', 'Founder', 'Other']
const SIZES = ['Just me', '2–10', '11–50', '51–200', '200+']

function Field({ label, type = 'text', value, placeholder, onChange, autoFocus }: {
  label: string; type?: string; value: string; placeholder?: string
  onChange: (v: string) => void; autoFocus?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [autoFocus])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(10,10,10,0.5)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <input
        ref={inputRef} type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: '8px',
          border: \`1px solid \${focused ? 'rgba(10,10,10,0.3)' : 'rgba(10,10,10,0.12)'}\`,
          background: '#fff', fontSize: '14px', fontWeight: 500, color: '#0a0a0a',
          letterSpacing: '-0.01em', outline: 'none', boxSizing: 'border-box',
          boxShadow: focused ? '0 0 0 3px rgba(10,10,10,0.06)' : 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
        }}
      />
    </div>
  )
}

function ChipGroup({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(10,10,10,0.5)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {options.map(opt => {
          const selected = value === opt
          return (
            <button key={opt} onClick={() => onChange(opt)} style={{
              padding: '7px 14px', borderRadius: '8px',
              border: \`1px solid \${selected ? 'rgba(10,10,10,0.35)' : 'rgba(10,10,10,0.12)'}\`,
              background: selected ? '#0a0a0a' : '#fff',
              color: selected ? '#fff' : '#0a0a0a',
              fontSize: '13px', fontWeight: 500, letterSpacing: '-0.01em',
              cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              transition: 'background 150ms ease, border-color 150ms ease, color 150ms ease',
            }}>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TextArea({ label, value, placeholder, onChange, autoFocus }: {
  label: string; value: string; placeholder?: string
  onChange: (v: string) => void; autoFocus?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => ref.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [autoFocus])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(10,10,10,0.5)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <textarea
        ref={ref} value={value} placeholder={placeholder} rows={4}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: '8px',
          border: \`1px solid \${focused ? 'rgba(10,10,10,0.3)' : 'rgba(10,10,10,0.12)'}\`,
          background: '#fff', fontSize: '14px', fontWeight: 500, color: '#0a0a0a',
          letterSpacing: '-0.01em', outline: 'none', resize: 'none', boxSizing: 'border-box',
          boxShadow: focused ? '0 0 0 3px rgba(10,10,10,0.06)' : 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
        }}
      />
    </div>
  )
}

export function MultiStepForm() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [animating, setAnimating] = useState(false)
  const [done, setDone] = useState(false)
  const [data, setData] = useState<FormData>({
    name: '', email: '', role: '', company: '', size: '', goal: '',
  })

  const set = (key: keyof FormData) => (v: string) =>
    setData(prev => ({ ...prev, [key]: v }))

  const canProceed = [
    data.name.trim() !== '' && data.email.trim() !== '',
    data.role !== '' && data.size !== '',
    data.goal.trim() !== '',
  ][step]

  function go(next: number) {
    if (animating) return
    setDirection(next > step ? 'forward' : 'back')
    setAnimating(true)
    setTimeout(() => { setStep(next); setAnimating(false) }, 220)
  }

  function submit() {
    if (animating) return
    setAnimating(true)
    setTimeout(() => { setDone(true); setAnimating(false) }, 220)
  }

  const slideOut = animating ? (direction === 'forward' ? '-24px' : '24px') : '0px'
  const opacity = animating ? 0 : 1

  return (
    <div style={{
      width: '100%', maxWidth: '420px', background: '#fff',
      borderRadius: '16px', border: '1px solid rgba(10,10,10,0.08)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>

      {!done && (
        <div style={{ padding: '20px 24px 0' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
            {STEPS.map((s, i) => (
              <div key={s.id} style={{
                flex: 1, height: '3px', borderRadius: '99px',
                background: i <= step ? '#0a0a0a' : 'rgba(10,10,10,0.1)',
                transition: 'background 300ms cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
            ))}
          </div>
          <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)' }}>
            Step {step + 1} of {STEPS.length} — {STEPS[step].label}
          </p>
        </div>
      )}

      <div style={{
        padding: done ? '40px 24px' : '16px 24px 24px',
        transform: \`translateX(\${slideOut})\`,
        opacity,
        transition: 'transform 220ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms ease',
      }}>
        {done ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: '#f0fdf4', border: '1px solid rgba(22,163,74,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: '20px',
            }}>✓</div>
            <h2 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
              All set, {data.name.split(' ')[0]}!
            </h2>
            <p style={{ margin: '0 0 24px', fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.5)', letterSpacing: '-0.01em', lineHeight: '1.5' }}>
              We'll reach out to {data.email} shortly.
            </p>
          </div>
        ) : step === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em' }}>Tell us about yourself</h2>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em' }}>Quick intro to get started.</p>
            </div>
            <Field label="Full name" value={data.name} placeholder="Jane Smith" onChange={set('name')} autoFocus />
            <Field label="Work email" type="email" value={data.email} placeholder="jane@acme.com" onChange={set('email')} />
          </div>
        ) : step === 1 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em' }}>A bit of context</h2>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em' }}>Helps us tailor the experience.</p>
            </div>
            <ChipGroup label="Your role" options={ROLES} value={data.role} onChange={set('role')} />
            <Field label="Company (optional)" value={data.company} placeholder="Acme Inc." onChange={set('company')} />
            <ChipGroup label="Team size" options={SIZES} value={data.size} onChange={set('size')} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em' }}>What's your main goal?</h2>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em' }}>We'll focus on what matters most to you.</p>
            </div>
            <TextArea label="In your own words" value={data.goal} placeholder="e.g. Ship our design system faster…" onChange={set('goal')} autoFocus />
          </div>
        )}
      </div>

      {!done && (
        <div style={{ padding: '0 24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => go(step - 1)} disabled={step === 0}
            style={{
              padding: '9px 16px', borderRadius: '8px',
              border: '1px solid rgba(10,10,10,0.12)', background: 'transparent',
              color: step === 0 ? 'rgba(10,10,10,0.25)' : '#0a0a0a',
              fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em',
              cursor: step === 0 ? 'default' : 'pointer', fontFamily: 'inherit',
              transition: 'background 150ms ease',
            }}
          >Back</button>
          <button
            onClick={step < STEPS.length - 1 ? () => go(step + 1) : submit}
            disabled={!canProceed}
            style={{
              padding: '9px 20px', borderRadius: '8px', border: 'none',
              background: canProceed ? '#0a0a0a' : 'rgba(10,10,10,0.12)',
              color: canProceed ? '#fff' : 'rgba(10,10,10,0.3)',
              fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em',
              cursor: canProceed ? 'pointer' : 'default', fontFamily: 'inherit',
              transition: 'background 150ms ease, color 150ms ease',
            }}
          >
            {step < STEPS.length - 1 ? 'Continue' : 'Submit'}
          </button>
        </div>
      )}
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
      }}>
        <MultiStepForm />
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
