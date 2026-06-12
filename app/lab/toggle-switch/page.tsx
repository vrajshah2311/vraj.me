'use client'

import { useState } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ── Toggle ─────────────────────────────────────────────────────────────────────

type ToggleSize    = 'sm' | 'md' | 'lg'
type ToggleVariant = 'default' | 'success' | 'destructive'

const DIMS: Record<ToggleSize, { w: number; h: number; thumb: number; pad: number }> = {
  sm: { w: 28, h: 16, thumb: 12, pad: 2 },
  md: { w: 36, h: 22, thumb: 18, pad: 2 },
  lg: { w: 44, h: 26, thumb: 22, pad: 2 },
}

const ON_COLOR: Record<ToggleVariant, string> = {
  default:     '#0a0a0a',
  success:     '#16a34a',
  destructive: '#dc2626',
}

function Toggle({
  checked,
  onChange,
  size    = 'md',
  variant = 'default',
  disabled = false,
}: {
  checked:  boolean
  onChange: (v: boolean) => void
  size?:    ToggleSize
  variant?: ToggleVariant
  disabled?: boolean
}) {
  const [pressed, setPressed] = useState(false)
  const d = DIMS[size]
  const travel = d.w - 2 * d.pad - d.thumb

  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        position:   'relative',
        width:       d.w,
        height:      d.h,
        background:  checked ? ON_COLOR[variant] : 'rgba(10,10,10,0.14)',
        border:      'none',
        borderRadius: 999,
        cursor:      disabled ? 'not-allowed' : 'pointer',
        padding:     0,
        flexShrink:  0,
        opacity:     disabled ? 0.4 : 1,
        transition:  'background 200ms cubic-bezier(0.32,0.72,0,1)',
        outline:     'none',
      }}
    >
      <span
        style={{
          position:     'absolute',
          top:           d.pad,
          left:          d.pad,
          width:         d.thumb,
          height:        d.thumb,
          background:   '#ffffff',
          borderRadius: '50%',
          boxShadow:    '0 1px 3px rgba(0,0,0,0.22), 0 1px 2px rgba(0,0,0,0.12)',
          transition:   'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform:     checked
            ? `translateX(${travel}px) scaleX(${pressed ? 0.82 : 1})`
            : `translateX(0px) scaleX(${pressed ? 0.82 : 1})`,
        }}
      />
    </button>
  )
}

// ── SettingRow ─────────────────────────────────────────────────────────────────

function SettingRow({
  label,
  description,
  checked,
  onChange,
  variant  = 'default',
  disabled = false,
  last     = false,
}: {
  label:       string
  description?: string
  checked:     boolean
  onChange:    (v: boolean) => void
  variant?:    ToggleVariant
  disabled?:   boolean
  last?:       boolean
}) {
  return (
    <div
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        gap:             16,
        padding:        '14px 0',
        borderBottom:   last ? 'none' : '1px solid rgba(10,10,10,0.06)',
        opacity:         disabled ? 0.5 : 1,
      }}
    >
      <div>
        <div style={{
          fontSize:      14,
          fontWeight:    500,
          color:         disabled ? 'rgba(10,10,10,0.45)' : '#0a0a0a',
          letterSpacing: '-0.01em',
          fontFamily:    FONT,
        }}>
          {label}
        </div>
        {description && (
          <div style={{
            fontSize:   12,
            color:      'rgba(10,10,10,0.4)',
            marginTop:   2,
            fontFamily: FONT,
          }}>
            {description}
          </div>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} variant={variant} disabled={disabled} />
    </div>
  )
}

// ── Demo ───────────────────────────────────────────────────────────────────────

function Demo() {
  const [notifs,   setNotifs]   = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [autoplay, setAutoplay] = useState(true)
  const [privacy,  setPrivacy]  = useState(false)
  const [sounds,   setSounds]   = useState(true)
  const [danger,   setDanger]   = useState(false)

  const [sz, setSz] = useState(true)

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'center',
      gap:            28,
      width:         '100%',
      maxWidth:       400,
    }}>

      {/* ── Preferences card ── */}
      <div style={{
        background:   '#fff',
        border:       '1px solid rgba(10,10,10,0.08)',
        borderRadius:  16,
        padding:      '20px 22px 6px',
        width:        '100%',
        boxShadow:    '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          fontSize:      11,
          fontWeight:    600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color:         'rgba(10,10,10,0.3)',
          fontFamily:    FONT,
          marginBottom:   12,
        }}>
          Preferences
        </div>

        <SettingRow
          label="Push notifications"
          description="Receive alerts for new activity"
          checked={notifs}
          onChange={setNotifs}
        />
        <SettingRow
          label="Dark mode"
          description="Switch interface to dark theme"
          checked={darkMode}
          onChange={setDarkMode}
        />
        <SettingRow
          label="Autoplay"
          description="Automatically play the next item"
          checked={autoplay}
          onChange={setAutoplay}
        />
        <SettingRow
          label="Privacy mode"
          description="Blur sensitive information"
          checked={privacy}
          onChange={setPrivacy}
          variant="success"
        />
        <SettingRow
          label="Sound effects"
          description="Play audio on interactions"
          checked={sounds}
          onChange={setSounds}
          last
        />
      </div>

      {/* ── Danger zone card ── */}
      <div style={{
        background:   '#fff',
        border:       '1px solid rgba(10,10,10,0.08)',
        borderRadius:  16,
        padding:      '20px 22px',
        width:        '100%',
        boxShadow:    '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          fontSize:      11,
          fontWeight:    600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color:         'rgba(10,10,10,0.3)',
          fontFamily:    FONT,
          marginBottom:   12,
        }}>
          Danger Zone
        </div>
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          gap:             16,
        }}>
          <div>
            <div style={{
              fontSize:      14,
              fontWeight:    500,
              color:          danger ? '#dc2626' : '#0a0a0a',
              letterSpacing: '-0.01em',
              fontFamily:    FONT,
              transition:    'color 200ms ease',
            }}>
              Delete all data
            </div>
            <div style={{
              fontSize:   12,
              color:      'rgba(10,10,10,0.4)',
              marginTop:   2,
              fontFamily: FONT,
            }}>
              Permanently remove your account
            </div>
          </div>
          <Toggle checked={danger} onChange={setDanger} variant="destructive" />
        </div>
      </div>

      {/* ── Sizes showcase ── */}
      <div style={{
        background:   '#fff',
        border:       '1px solid rgba(10,10,10,0.08)',
        borderRadius:  16,
        padding:      '20px 22px',
        width:        '100%',
        boxShadow:    '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          fontSize:      11,
          fontWeight:    600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color:         'rgba(10,10,10,0.3)',
          fontFamily:    FONT,
          marginBottom:   16,
        }}>
          Sizes
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {(['sm', 'md', 'lg'] as ToggleSize[]).map(s => (
            <div key={s} style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
            }}>
              <span style={{
                fontSize:      13,
                color:         'rgba(10,10,10,0.45)',
                fontFamily:    FONT,
                letterSpacing: '-0.01em',
              }}>
                {s}
              </span>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Toggle checked={false} onChange={() => {}} size={s} />
                <Toggle checked={true}  onChange={() => {}} size={s} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

// ── Code source ────────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState } from 'react'

// Drop this into any React project — no dependencies required.

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type ToggleSize    = 'sm' | 'md' | 'lg'
type ToggleVariant = 'default' | 'success' | 'destructive'

const DIMS: Record<ToggleSize, { w: number; h: number; thumb: number; pad: number }> = {
  sm: { w: 28, h: 16, thumb: 12, pad: 2 },
  md: { w: 36, h: 22, thumb: 18, pad: 2 },
  lg: { w: 44, h: 26, thumb: 22, pad: 2 },
}

const ON_COLOR: Record<ToggleVariant, string> = {
  default:     '#0a0a0a',
  success:     '#16a34a',
  destructive: '#dc2626',
}

export function Toggle({
  checked,
  onChange,
  size    = 'md',
  variant = 'default',
  disabled = false,
}: {
  checked:  boolean
  onChange: (v: boolean) => void
  size?:    ToggleSize
  variant?: ToggleVariant
  disabled?: boolean
}) {
  const [pressed, setPressed] = useState(false)
  const d = DIMS[size]
  const travel = d.w - 2 * d.pad - d.thumb

  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        position:     'relative',
        width:         d.w,
        height:        d.h,
        background:    checked ? ON_COLOR[variant] : 'rgba(10,10,10,0.14)',
        border:        'none',
        borderRadius:  999,
        cursor:        disabled ? 'not-allowed' : 'pointer',
        padding:       0,
        flexShrink:    0,
        opacity:       disabled ? 0.4 : 1,
        transition:    'background 200ms cubic-bezier(0.32,0.72,0,1)',
        outline:       'none',
      }}
    >
      <span
        style={{
          position:     'absolute',
          top:           d.pad,
          left:          d.pad,
          width:         d.thumb,
          height:        d.thumb,
          background:   '#ffffff',
          borderRadius: '50%',
          boxShadow:    '0 1px 3px rgba(0,0,0,0.22), 0 1px 2px rgba(0,0,0,0.12)',
          transition:   'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform:     checked
            ? \`translateX(\${travel}px) scaleX(\${pressed ? 0.82 : 1})\`
            : \`translateX(0px) scaleX(\${pressed ? 0.82 : 1})\`,
        }}
      />
    </button>
  )
}

// ── Usage ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [enabled, setEnabled] = useState(false)
  const [privacy, setPrivacy] = useState(true)
  const [danger,  setDanger]  = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24, fontFamily: FONT }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
          Notifications
        </span>
        <Toggle checked={enabled} onChange={setEnabled} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
          Privacy mode
        </span>
        <Toggle checked={privacy} onChange={setPrivacy} variant="success" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#dc2626', letterSpacing: '-0.01em' }}>
          Delete data
        </span>
        <Toggle checked={danger} onChange={setDanger} variant="destructive" />
      </div>
    </div>
  )
}`

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ToggleSwitchPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight:      '60vh',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding:        '60px 24px',
        gap:             0,
      }}>
        <Demo />
        <p style={{
          marginTop:     32,
          fontSize:      12,
          color:         'rgba(0,0,0,0.35)',
          fontWeight:    500,
          letterSpacing: '-0.01em',
          fontFamily:    FONT,
          textAlign:     'center',
        }}>
          Spring-physics thumb · three sizes · three color variants · pressed squish
        </p>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize:      11,
          fontWeight:    600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color:         'rgba(10,10,10,0.4)',
          marginBottom:   12,
        }}>
          Source
        </p>
        <div style={{
          background:   '#0a0a0a',
          borderRadius:  12,
          padding:       20,
          overflowX:    'auto',
        }}>
          <pre style={{
            margin:      0,
            fontFamily:  'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
            fontSize:    '12px',
            lineHeight:  '1.65',
            color:       '#e5e5e5',
            whiteSpace:  'pre',
            overflowX:   'auto',
          }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
