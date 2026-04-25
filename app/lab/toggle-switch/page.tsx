'use client'

import { useState } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────────

type Size = 'sm' | 'md' | 'lg'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  size?: Size
}

// ─── Toggle Switch ──────────────────────────────────────────────────────────────

const SIZES: Record<Size, { w: number; h: number; thumb: number; pad: number }> = {
  sm: { w: 32, h: 18, thumb: 14, pad: 2 },
  md: { w: 44, h: 24, thumb: 20, pad: 2 },
  lg: { w: 56, h: 30, thumb: 26, pad: 2 },
}

function ToggleSwitch({ checked, onChange, disabled = false, size = 'md' }: ToggleSwitchProps) {
  const [focused, setFocused] = useState(false)
  const { w, h, thumb, pad } = SIZES[size]
  const thumbLeft = checked ? w - thumb - pad : pad

  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        position: 'relative',
        display: 'block',
        width: w,
        height: h,
        borderRadius: h / 2,
        background: checked ? '#0a0a0a' : 'rgba(10,10,10,0.12)',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        flexShrink: 0,
        outline: focused ? '2px solid rgba(10,10,10,0.35)' : 'none',
        outlineOffset: 2,
        transition: 'background 180ms cubic-bezier(0.4,0,0.2,1), opacity 150ms ease',
        padding: 0,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: pad,
          left: thumbLeft,
          width: thumb,
          height: thumb,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.22), 0 0 0 0.5px rgba(0,0,0,0.06)',
          transition: 'left 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: 'none',
        }}
      />
    </button>
  )
}

// ─── Demo ──────────────────────────────────────────────────────────────────────

const SETTINGS = [
  { key: 'notifications', label: 'Email notifications', description: 'Receive emails about new activity and mentions' },
  { key: 'autosave',      label: 'Auto-save drafts',    description: 'Automatically save changes as you work' },
  { key: 'analytics',     label: 'Usage analytics',     description: 'Share anonymous data to help improve the product' },
  { key: 'sounds',        label: 'Sound effects',       description: 'Play sounds for messages and notifications' },
  { key: 'compact',       label: 'Compact mode',        description: 'Reduce spacing for a denser layout' },
]

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

function SettingsDemo() {
  const [settings, setSettings] = useState({
    notifications: true,
    autosave: true,
    analytics: false,
    sounds: false,
    compact: false,
  })

  const [sizeStates, setSizeStates] = useState<Record<Size, boolean>>({
    sm: true,
    md: false,
    lg: true,
  })

  const toggleSetting = (key: keyof typeof settings) =>
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))

  const toggleSize = (size: Size) =>
    setSizeStates(prev => ({ ...prev, [size]: !prev[size] }))

  return (
    <div style={{ width: '420px', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* ── Size + disabled showcase ── */}
      <div style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '14px',
        padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {(['sm', 'md', 'lg'] as Size[]).map(size => (
          <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <ToggleSwitch size={size} checked={sizeStates[size]} onChange={() => toggleSize(size)} />
            <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.38)', letterSpacing: '0.02em', fontFamily: FONT }}>
              {size}
            </span>
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <ToggleSwitch checked={true} onChange={() => {}} disabled />
          <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.38)', letterSpacing: '0.02em', fontFamily: FONT }}>
            disabled
          </span>
        </div>
      </div>

      {/* ── Settings panel ── */}
      <div style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '14px',
        padding: '0 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <p style={{
          margin: '16px 0 4px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.35)',
          fontFamily: FONT,
        }}>
          Preferences
        </p>

        {SETTINGS.map((item, i) => (
          <div
            key={item.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              padding: '13px 0',
              borderBottom: i < SETTINGS.length - 1 ? '1px solid rgba(10,10,10,0.06)' : 'none',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#0a0a0a',
                letterSpacing: '-0.01em',
                fontFamily: FONT,
              }}>
                {item.label}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(10,10,10,0.45)',
                marginTop: '2px',
                letterSpacing: '-0.01em',
                fontFamily: FONT,
              }}>
                {item.description}
              </div>
            </div>
            <ToggleSwitch
              checked={settings[item.key as keyof typeof settings]}
              onChange={() => toggleSetting(item.key as keyof typeof settings)}
            />
          </div>
        ))}
      </div>

    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState } from 'react'

type Size = 'sm' | 'md' | 'lg'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  size?: Size
}

const SIZES: Record<Size, { w: number; h: number; thumb: number; pad: number }> = {
  sm: { w: 32, h: 18, thumb: 14, pad: 2 },
  md: { w: 44, h: 24, thumb: 20, pad: 2 },
  lg: { w: 56, h: 30, thumb: 26, pad: 2 },
}

export function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
}: ToggleSwitchProps) {
  const [focused, setFocused] = useState(false)
  const { w, h, thumb, pad } = SIZES[size]
  const thumbLeft = checked ? w - thumb - pad : pad

  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        position: 'relative',
        display: 'block',
        width: w,
        height: h,
        borderRadius: h / 2,
        background: checked ? '#0a0a0a' : 'rgba(10,10,10,0.12)',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        flexShrink: 0,
        outline: focused ? '2px solid rgba(10,10,10,0.35)' : 'none',
        outlineOffset: 2,
        transition: 'background 180ms cubic-bezier(0.4,0,0.2,1), opacity 150ms ease',
        padding: 0,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: pad,
          left: thumbLeft,
          width: thumb,
          height: thumb,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.22), 0 0 0 0.5px rgba(0,0,0,0.06)',
          transition: 'left 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: 'none',
        }}
      />
    </button>
  )
}

// Usage example:
//
// const [on, setOn] = useState(false)
// <ToggleSwitch checked={on} onChange={setOn} />
// <ToggleSwitch checked={on} onChange={setOn} size="sm" />
// <ToggleSwitch checked={on} onChange={setOn} size="lg" />
// <ToggleSwitch checked={on} onChange={setOn} disabled />`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ToggleSwitchPage() {
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
        <SettingsDemo />
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
