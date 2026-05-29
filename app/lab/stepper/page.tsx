'use client'

import { useState } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Types ────────────────────────────────────────────────────────────────────

type StepStatus = 'upcoming' | 'active' | 'completed'

interface Step {
  label: string
  description?: string
}

// ─── StepNode ─────────────────────────────────────────────────────────────────

function StepNode({
  index,
  status,
  onClick,
}: {
  index: number
  status: StepStatus
  onClick?: () => void
}) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        background: status !== 'upcoming' ? '#0a0a0a' : '#fff',
        border: `1.5px solid ${status !== 'upcoming' ? '#0a0a0a' : 'rgba(10,10,10,0.12)'}`,
        boxShadow: hover && !!onClick ? '0 0 0 4px rgba(10,10,10,0.07)' : 'none',
        transition:
          'background 200ms cubic-bezier(0.4,0,0.2,1), border-color 200ms ease, box-shadow 150ms ease',
      }}
    >
      {status === 'completed' ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6L4.5 8.5L10 3.5"
            stroke="#fff"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: status === 'active' ? '#fff' : 'rgba(10,10,10,0.28)',
            fontFamily: FONT,
            transition: 'color 200ms ease',
            userSelect: 'none' as const,
          }}
        >
          {index + 1}
        </span>
      )}
    </div>
  )
}

// ─── Connector ────────────────────────────────────────────────────────────────

function Connector({ filled }: { filled: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        height: 1.5,
        background: 'rgba(10,10,10,0.08)',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 1,
        margin: '0 3px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#0a0a0a',
          transformOrigin: 'left center',
          transform: `scaleX(${filled ? 1 : 0})`,
          transition: 'transform 380ms cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: 1,
        }}
      />
    </div>
  )
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (index: number) => void
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  const hasDescriptions = steps.some((s) => s.description)

  const getStatus = (i: number): StepStatus =>
    i < currentStep ? 'completed' : i === currentStep ? 'active' : 'upcoming'

  return (
    <div style={{ fontFamily: FONT, userSelect: 'none' as const }}>
      {/* Track: circles + connectors */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {steps.flatMap((_, i) => {
          const status = getStatus(i)
          const canClick = onStepClick && status !== 'upcoming'
          const node = (
            <StepNode
              key={`n${i}`}
              index={i}
              status={status}
              onClick={canClick ? () => onStepClick!(i) : undefined}
            />
          )
          if (i < steps.length - 1) {
            return [node, <Connector key={`c${i}`} filled={status === 'completed'} />]
          }
          return [node]
        })}
      </div>

      {/* Labels row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          marginTop: 10,
          height: hasDescriptions ? 34 : 20,
        }}
      >
        {steps.flatMap((step, i) => {
          const status = getStatus(i)
          const label = (
            <div
              key={`l${i}`}
              style={{ width: 32, position: 'relative', flexShrink: 0 }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                    color:
                      status === 'upcoming'
                        ? 'rgba(10,10,10,0.28)'
                        : status === 'active'
                        ? '#0a0a0a'
                        : 'rgba(10,10,10,0.55)',
                    transition: 'color 200ms ease',
                    whiteSpace: 'nowrap',
                    fontFamily: FONT,
                  }}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(10,10,10,0.35)',
                      marginTop: 2,
                      whiteSpace: 'nowrap',
                      letterSpacing: '-0.01em',
                      fontFamily: FONT,
                    }}
                  >
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          )
          if (i < steps.length - 1) {
            return [label, <div key={`ls${i}`} style={{ flex: 1 }} />]
          }
          return [label]
        })}
      </div>
    </div>
  )
}

// ─── NavButton ────────────────────────────────────────────────────────────────

function NavButton({
  onClick,
  disabled,
  children,
  variant = 'secondary',
}: {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}) {
  const [hover, setHover] = useState(false)
  const isPrimary = variant === 'primary'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '8px 16px',
        borderRadius: 8,
        border: isPrimary ? 'none' : '1px solid rgba(10,10,10,0.1)',
        background: isPrimary
          ? disabled
            ? 'rgba(10,10,10,0.08)'
            : hover
            ? '#171717'
            : '#0a0a0a'
          : hover && !disabled
          ? 'rgba(10,10,10,0.04)'
          : 'transparent',
        color: isPrimary
          ? disabled
            ? 'rgba(10,10,10,0.28)'
            : '#fff'
          : disabled
          ? 'rgba(10,10,10,0.2)'
          : '#0a0a0a',
        fontSize: '13px',
        fontWeight: 500,
        letterSpacing: '-0.01em',
        fontFamily: FONT,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 150ms ease, color 150ms ease',
        outline: 'none',
      }}
    >
      {children}
    </button>
  )
}

// ─── Checkout Demo ────────────────────────────────────────────────────────────

const CHECKOUT_STEPS: Step[] = [
  { label: 'Cart', description: '3 items' },
  { label: 'Shipping', description: 'Address' },
  { label: 'Payment', description: 'Card' },
  { label: 'Review', description: 'Confirm' },
  { label: 'Done', description: 'Placed!' },
]

const CHECKOUT_CONTENT = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 3h1.5l2.7 9.9A1.5 1.5 0 0 0 8.65 14H17a1.5 1.5 0 0 0 1.44-1.09L20 7H6" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="18" r="1.25" fill="#0a0a0a"/>
        <circle cx="16" cy="18" r="1.25" fill="#0a0a0a"/>
      </svg>
    ),
    heading: 'Your Cart',
    body: '3 items · $127.00 total',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="6" width="16" height="11" rx="2" stroke="#0a0a0a" strokeWidth="1.5"/>
        <path d="M7 6V5a4 4 0 0 1 8 0v1" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="11" cy="12" r="1.5" fill="#0a0a0a"/>
      </svg>
    ),
    heading: 'Shipping Address',
    body: 'Enter your delivery address',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="5" width="18" height="13" rx="2.5" stroke="#0a0a0a" strokeWidth="1.5"/>
        <path d="M2 9h18" stroke="#0a0a0a" strokeWidth="1.5"/>
        <rect x="5" y="13" width="4" height="1.5" rx="0.75" fill="#0a0a0a"/>
      </svg>
    ),
    heading: 'Payment',
    body: 'Add a payment method',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 11.5L8.5 16L18 6.5" stroke="#0a0a0a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    heading: 'Review Order',
    body: 'Everything looks right?',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2l2.37 6.26L20 9.27l-5 4.61 1.18 6.62L11 17.27l-5.18 3.23L7 13.88 2 9.27l6.63-1.01L11 2z" stroke="#0a0a0a" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    heading: 'Order Placed!',
    body: 'Order #2847 is confirmed',
  },
]

function CheckoutDemo() {
  const [step, setStep] = useState(0)
  const content = CHECKOUT_CONTENT[step]

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: 16,
        padding: '28px 24px',
        width: 380,
        maxWidth: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ marginBottom: 28 }}>
        <Stepper
          steps={CHECKOUT_STEPS}
          currentStep={step}
          onStepClick={(i) => i <= step && setStep(i)}
        />
      </div>

      {/* Step content */}
      <div
        key={step}
        style={{
          background: 'rgba(10,10,10,0.025)',
          border: '1px solid rgba(10,10,10,0.06)',
          borderRadius: 12,
          padding: '20px 20px 18px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          animation: 'stepFadeIn 200ms ease both',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: '#fff',
            border: '1px solid rgba(10,10,10,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {content.icon}
        </div>
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              color: '#0a0a0a',
              fontFamily: FONT,
              lineHeight: '20px',
            }}
          >
            {content.heading}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'rgba(10,10,10,0.45)',
              marginTop: 2,
              letterSpacing: '-0.01em',
              fontFamily: FONT,
            }}
          >
            {content.body}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <NavButton onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
          Back
        </NavButton>
        <div
          style={{
            fontSize: '11px',
            color: 'rgba(10,10,10,0.35)',
            fontFamily: FONT,
            letterSpacing: '-0.01em',
          }}
        >
          Step {step + 1} of {CHECKOUT_STEPS.length}
        </div>
        <NavButton
          onClick={() => setStep((s) => s + 1)}
          disabled={step === CHECKOUT_STEPS.length - 1}
          variant="primary"
        >
          {step === CHECKOUT_STEPS.length - 2 ? 'Place Order' : 'Continue'}
        </NavButton>
      </div>
    </div>
  )
}

// ─── Onboarding Demo ──────────────────────────────────────────────────────────

const ONBOARDING_STEPS: Step[] = [
  { label: 'Account' },
  { label: 'Profile' },
  { label: 'Preferences' },
  { label: 'Done' },
]

function OnboardingDemo() {
  const [step, setStep] = useState(1)

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: 16,
        padding: '24px',
        width: 340,
        maxWidth: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: '#0a0a0a',
          marginBottom: 4,
          fontFamily: FONT,
        }}
      >
        Set up your workspace
      </div>
      <div
        style={{
          fontSize: '12px',
          color: 'rgba(10,10,10,0.4)',
          marginBottom: 24,
          letterSpacing: '-0.01em',
          fontFamily: FONT,
        }}
      >
        Complete {ONBOARDING_STEPS.length} steps to get started
      </div>

      <Stepper
        steps={ONBOARDING_STEPS}
        currentStep={step}
        onStepClick={(i) => i <= step && setStep(i)}
      />

      {/* Mini nav */}
      <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
        <NavButton onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          Back
        </NavButton>
        <div style={{ flex: 1 }} />
        <NavButton
          onClick={() => setStep((s) => Math.min(ONBOARDING_STEPS.length - 1, s + 1))}
          disabled={step === ONBOARDING_STEPS.length - 1}
          variant="primary"
        >
          {step === ONBOARDING_STEPS.length - 2 ? 'Finish' : 'Next'}
        </NavButton>
      </div>
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type StepStatus = 'upcoming' | 'active' | 'completed'

interface Step {
  label: string
  description?: string
}

function StepNode({
  index,
  status,
  onClick,
}: {
  index: number
  status: StepStatus
  onClick?: () => void
}) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        background: status !== 'upcoming' ? '#0a0a0a' : '#fff',
        border: \`1.5px solid \${status !== 'upcoming' ? '#0a0a0a' : 'rgba(10,10,10,0.12)'}\`,
        boxShadow: hover && !!onClick ? '0 0 0 4px rgba(10,10,10,0.07)' : 'none',
        transition:
          'background 200ms cubic-bezier(0.4,0,0.2,1), border-color 200ms ease, box-shadow 150ms ease',
      }}
    >
      {status === 'completed' ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6L4.5 8.5L10 3.5"
            stroke="#fff"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: status === 'active' ? '#fff' : 'rgba(10,10,10,0.28)',
            fontFamily: FONT,
            transition: 'color 200ms ease',
            userSelect: 'none',
          }}
        >
          {index + 1}
        </span>
      )}
    </div>
  )
}

function Connector({ filled }: { filled: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        height: 1.5,
        background: 'rgba(10,10,10,0.08)',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 1,
        margin: '0 3px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#0a0a0a',
          transformOrigin: 'left center',
          transform: \`scaleX(\${filled ? 1 : 0})\`,
          transition: 'transform 380ms cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: 1,
        }}
      />
    </div>
  )
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (index: number) => void
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  const hasDescriptions = steps.some((s) => s.description)

  const getStatus = (i: number): StepStatus =>
    i < currentStep ? 'completed' : i === currentStep ? 'active' : 'upcoming'

  return (
    <div style={{ fontFamily: FONT, userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {steps.flatMap((_, i) => {
          const status = getStatus(i)
          const canClick = onStepClick && status !== 'upcoming'
          const node = (
            <StepNode
              key={\`n\${i}\`}
              index={i}
              status={status}
              onClick={canClick ? () => onStepClick!(i) : undefined}
            />
          )
          if (i < steps.length - 1) {
            return [node, <Connector key={\`c\${i}\`} filled={status === 'completed'} />]
          }
          return [node]
        })}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          marginTop: 10,
          height: hasDescriptions ? 34 : 20,
        }}
      >
        {steps.flatMap((step, i) => {
          const status = getStatus(i)
          const label = (
            <div
              key={\`l\${i}\`}
              style={{ width: 32, position: 'relative', flexShrink: 0 }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                    color:
                      status === 'upcoming'
                        ? 'rgba(10,10,10,0.28)'
                        : status === 'active'
                        ? '#0a0a0a'
                        : 'rgba(10,10,10,0.55)',
                    transition: 'color 200ms ease',
                    whiteSpace: 'nowrap',
                    fontFamily: FONT,
                  }}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(10,10,10,0.35)',
                      marginTop: 2,
                      whiteSpace: 'nowrap',
                      letterSpacing: '-0.01em',
                      fontFamily: FONT,
                    }}
                  >
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          )
          if (i < steps.length - 1) {
            return [label, <div key={\`ls\${i}\`} style={{ flex: 1 }} />]
          }
          return [label]
        })}
      </div>
    </div>
  )
}

// ── Example usage ──────────────────────────────────────────────────────────────
//
// const steps = [
//   { label: 'Cart',     description: '3 items'  },
//   { label: 'Shipping', description: 'Address'  },
//   { label: 'Payment',  description: 'Card'     },
//   { label: 'Review',   description: 'Confirm'  },
//   { label: 'Done',     description: 'Placed!'  },
// ]
//
// <Stepper steps={steps} currentStep={currentStep} />
//
// // Click completed steps to jump back:
// <Stepper steps={steps} currentStep={currentStep} onStepClick={setStep} />`

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function StepperPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>
      <style>{`
        @keyframes stepFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>

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
          gap: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            <p
              style={{
                margin: 0,
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
                color: 'rgba(10,10,10,0.35)',
                fontFamily: FONT,
              }}
            >
              With descriptions
            </p>
            <CheckoutDemo />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            <p
              style={{
                margin: 0,
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
                color: 'rgba(10,10,10,0.35)',
                fontFamily: FONT,
              }}
            >
              Compact
            </p>
            <OnboardingDemo />
          </div>
        </div>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            color: 'rgba(10,10,10,0.4)',
            marginBottom: '12px',
            fontFamily: FONT,
          }}
        >
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
          <pre
            style={{
              margin: 0,
              fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
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
