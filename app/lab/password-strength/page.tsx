'use client'

import { useState, useMemo } from 'react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function analyze(pw: string) {
  const reqs = [
    { label: 'At least 8 characters',  met: pw.length >= 8 },
    { label: 'Uppercase letter',        met: /[A-Z]/.test(pw) },
    { label: 'Lowercase letter',        met: /[a-z]/.test(pw) },
    { label: 'Number',                  met: /[0-9]/.test(pw) },
    { label: 'Special character',       met: /[^A-Za-z0-9]/.test(pw) },
  ]
  const score = reqs.filter(r => r.met).length
  return { reqs, score }
}

const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong']
const STRENGTH_COLOR = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a']

// ─── Password Strength ────────────────────────────────────────────────────────

function PasswordStrength() {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const { reqs, score } = useMemo(() => analyze(password), [password])
  const active = password.length > 0
  const barColor = score > 0 ? STRENGTH_COLOR[score] : 'rgba(10,10,10,0.08)'

  return (
    <div style={{
      width: '300px',
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>

      <p style={{ margin: '0 0 16px', fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
        Create password
      </p>

      {/* Input */}
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter a password"
          autoComplete="new-password"
          spellCheck={false}
          style={{
            width: '100%',
            padding: '9px 38px 9px 12px',
            border: '1px solid rgba(10,10,10,0.12)',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#0a0a0a',
            letterSpacing: show ? '0' : '0.06em',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            background: '#fafafa',
            transition: 'border-color 150ms ease, box-shadow 150ms ease, background 150ms ease',
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = 'rgba(10,10,10,0.24)'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,10,10,0.06)'
            e.currentTarget.style.background = '#fff'
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = 'rgba(10,10,10,0.12)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.background = '#fafafa'
          }}
        />
        <button
          onClick={() => setShow(v => !v)}
          tabIndex={-1}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            padding: '3px',
            cursor: 'pointer',
            color: 'rgba(10,10,10,0.3)',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px',
            transition: 'color 150ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#0a0a0a')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(10,10,10,0.3)')}
        >
          {show ? (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M1 7.5c0 0 2.5-5 6.5-5s6.5 5 6.5 5-2.5 5-6.5 5-6.5-5-6.5-5z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
              <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.25"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M2 2.5l11 10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              <path d="M6.4 3.2C6.9 3.07 7.2 3 7.5 3c3.5 0 6 4.5 6 4.5a13.5 13.5 0 0 1-1.9 2.7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              <path d="M1 7.5s2-4.5 5.5-4.8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              <path d="M9.4 10.7C8.9 11 8.2 11.2 7.5 11.2c-3.5 0-6-3.7-6-3.7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Strength bar */}
      <div style={{
        marginTop: '12px',
        opacity: active ? 1 : 0,
        transform: active ? 'none' : 'translateY(4px)',
        transition: 'opacity 200ms ease, transform 200ms ease',
        pointerEvents: active ? 'all' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: barColor,
            transition: 'color 300ms ease',
            minWidth: '70px',
          }}>
            {score > 0 ? STRENGTH_LABEL[score] : ''}
          </span>
          <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.3)', letterSpacing: '-0.01em' }}>
            {score} / 5
          </span>
        </div>
        <div style={{ display: 'flex', gap: '3px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{
              flex: 1,
              height: '3px',
              borderRadius: '2px',
              background: active && i <= score ? barColor : 'rgba(10,10,10,0.07)',
              transition: 'background 300ms ease',
            }} />
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div style={{
        overflow: 'hidden',
        maxHeight: active ? '200px' : '0px',
        marginTop: active ? '14px' : '0',
        opacity: active ? 1 : 0,
        transition: 'max-height 300ms cubic-bezier(0.32, 0.72, 0, 1), opacity 200ms ease, margin-top 200ms ease',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {reqs.map(req => (
            <div key={req.label} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <div style={{
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                flexShrink: 0,
                background: req.met ? '#16a34a' : 'transparent',
                border: req.met ? 'none' : '1.5px solid rgba(10,10,10,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: req.met ? 'scale(1)' : 'scale(0.9)',
                transition: 'background 250ms ease, border 250ms ease, transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"
                  style={{ opacity: req.met ? 1 : 0, transition: 'opacity 200ms ease' }}>
                  <path d="M1.5 4l1.5 1.5 3-3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                color: req.met ? '#0a0a0a' : 'rgba(10,10,10,0.4)',
                transition: 'color 200ms ease',
              }}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useMemo } from 'react'

function analyze(pw: string) {
  const reqs = [
    { label: 'At least 8 characters',  met: pw.length >= 8 },
    { label: 'Uppercase letter',        met: /[A-Z]/.test(pw) },
    { label: 'Lowercase letter',        met: /[a-z]/.test(pw) },
    { label: 'Number',                  met: /[0-9]/.test(pw) },
    { label: 'Special character',       met: /[^A-Za-z0-9]/.test(pw) },
  ]
  const score = reqs.filter(r => r.met).length
  return { reqs, score }
}

const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong']
const STRENGTH_COLOR = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a']

export function PasswordStrength() {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const { reqs, score } = useMemo(() => analyze(password), [password])
  const active = password.length > 0
  const barColor = score > 0 ? STRENGTH_COLOR[score] : 'rgba(10,10,10,0.08)'

  return (
    <div style={{
      width: '300px',
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>

      <p style={{ margin: '0 0 16px', fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
        Create password
      </p>

      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter a password"
          autoComplete="new-password"
          spellCheck={false}
          style={{
            width: '100%',
            padding: '9px 38px 9px 12px',
            border: '1px solid rgba(10,10,10,0.12)',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#0a0a0a',
            letterSpacing: show ? '0' : '0.06em',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            background: '#fafafa',
            transition: 'border-color 150ms ease, box-shadow 150ms ease, background 150ms ease',
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = 'rgba(10,10,10,0.24)'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,10,10,0.06)'
            e.currentTarget.style.background = '#fff'
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = 'rgba(10,10,10,0.12)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.background = '#fafafa'
          }}
        />
        <button
          onClick={() => setShow(v => !v)}
          tabIndex={-1}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            padding: '3px',
            cursor: 'pointer',
            color: 'rgba(10,10,10,0.3)',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px',
            transition: 'color 150ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#0a0a0a')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(10,10,10,0.3)')}
        >
          {show ? (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M1 7.5c0 0 2.5-5 6.5-5s6.5 5 6.5 5-2.5 5-6.5 5-6.5-5-6.5-5z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
              <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.25"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M2 2.5l11 10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              <path d="M6.4 3.2C6.9 3.07 7.2 3 7.5 3c3.5 0 6 4.5 6 4.5a13.5 13.5 0 0 1-1.9 2.7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              <path d="M1 7.5s2-4.5 5.5-4.8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              <path d="M9.4 10.7C8.9 11 8.2 11.2 7.5 11.2c-3.5 0-6-3.7-6-3.7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      <div style={{
        marginTop: '12px',
        opacity: active ? 1 : 0,
        transform: active ? 'none' : 'translateY(4px)',
        transition: 'opacity 200ms ease, transform 200ms ease',
        pointerEvents: active ? 'all' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: barColor,
            transition: 'color 300ms ease',
            minWidth: '70px',
          }}>
            {score > 0 ? STRENGTH_LABEL[score] : ''}
          </span>
          <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.3)', letterSpacing: '-0.01em' }}>
            {score} / 5
          </span>
        </div>
        <div style={{ display: 'flex', gap: '3px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{
              flex: 1,
              height: '3px',
              borderRadius: '2px',
              background: active && i <= score ? barColor : 'rgba(10,10,10,0.07)',
              transition: 'background 300ms ease',
            }} />
          ))}
        </div>
      </div>

      <div style={{
        overflow: 'hidden',
        maxHeight: active ? '200px' : '0px',
        marginTop: active ? '14px' : '0',
        opacity: active ? 1 : 0,
        transition: 'max-height 300ms cubic-bezier(0.32, 0.72, 0, 1), opacity 200ms ease, margin-top 200ms ease',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {reqs.map(req => (
            <div key={req.label} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <div style={{
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                flexShrink: 0,
                background: req.met ? '#16a34a' : 'transparent',
                border: req.met ? 'none' : '1.5px solid rgba(10,10,10,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: req.met ? 'scale(1)' : 'scale(0.9)',
                transition: 'background 250ms ease, border 250ms ease, transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"
                  style={{ opacity: req.met ? 1 : 0, transition: 'opacity 200ms ease' }}>
                  <path d="M1.5 4l1.5 1.5 3-3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                color: req.met ? '#0a0a0a' : 'rgba(10,10,10,0.4)',
                transition: 'color 200ms ease',
              }}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PasswordStrengthPage() {
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
        gap: '20px',
      }}>
        <PasswordStrength />
        <p style={{
          margin: 0,
          fontSize: '12px',
          color: 'rgba(0,0,0,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
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
          color: 'var(--text-muted, rgba(10,10,10,0.4))',
          marginBottom: '12px',
        }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
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
