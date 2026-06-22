'use client'

import { useState, useEffect, useRef } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Types ────────────────────────────────────────────────────────────────────

type Variant = 'default' | 'destructive'

interface DialogProps {
  open: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: Variant
  icon?: string
}

// ─── ConfirmationDialog ───────────────────────────────────────────────────────

function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  icon,
}: DialogProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [shake, setShake] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (mountTimerRef.current) clearTimeout(mountTimerRef.current)
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
      mountTimerRef.current = setTimeout(() => setMounted(false), 280)
    }
    return () => { if (mountTimerRef.current) clearTimeout(mountTimerRef.current) }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    return () => { if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current) }
  }, [])

  if (!mounted) return null

  const isDestructive = variant === 'destructive'
  const confirmBg = isDestructive ? '#dc2626' : '#0a0a0a'
  const confirmHoverBg = isDestructive ? '#b91c1c' : '#262626'
  const iconBg = isDestructive ? '#fef2f2' : '#f5f5f5'
  const iconBorder = isDestructive ? 'rgba(220,38,38,0.15)' : 'rgba(10,10,10,0.08)'

  const triggerShake = () => {
    if (!isDestructive || shake) return
    setShake(true)
    shakeTimerRef.current = setTimeout(() => setShake(false), 420)
  }

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backdropFilter: `blur(${visible ? 6 : 0}px)`,
        WebkitBackdropFilter: `blur(${visible ? 6 : 0}px)`,
        backgroundColor: visible ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0)',
        transition: 'backdrop-filter 260ms ease, -webkit-backdrop-filter 260ms ease, background-color 260ms ease',
      }}
    >
      <style>{`
        @keyframes cdShake {
          0%, 100% { transform: translateX(0); }
          15%       { transform: translateX(-6px); }
          30%       { transform: translateX(6px); }
          45%       { transform: translateX(-4px); }
          60%       { transform: translateX(4px); }
          75%       { transform: translateX(-2px); }
          90%       { transform: translateX(2px); }
        }
      `}</style>

      {/* Enter/exit transform wrapper */}
      <div style={{
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(10px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 260ms cubic-bezier(0.32, 0.72, 0, 1), opacity 260ms ease',
      }}>
        {/* Shake wrapper */}
        <div
          onAnimationEnd={() => setShake(false)}
          style={{ animation: shake ? 'cdShake 420ms cubic-bezier(0.36, 0.07, 0.19, 0.97)' : 'none' }}
        >
          {/* Card */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid rgba(10,10,10,0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            width: '380px',
            maxWidth: 'calc(100vw - 48px)',
            padding: '24px',
            fontFamily: FONT,
          }}>
            {icon && (
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: iconBg,
                border: `1px solid ${iconBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                fontSize: '18px',
                flexShrink: 0,
              }}>
                {icon}
              </div>
            )}

            <h2 style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: 600,
              color: '#0a0a0a',
              letterSpacing: '-0.02em',
              lineHeight: '22px',
            }}>
              {title}
            </h2>

            <p style={{
              margin: '6px 0 0',
              fontSize: '13px',
              fontWeight: 500,
              color: 'rgba(10,10,10,0.55)',
              letterSpacing: '-0.01em',
              lineHeight: '19px',
            }}>
              {description}
            </p>

            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '20px',
              justifyContent: 'flex-end',
            }}>
              <button
                onClick={onClose}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(10,10,10,0.12)',
                  background: '#fff',
                  color: '#0a0a0a',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  cursor: 'pointer',
                  fontFamily: FONT,
                  transition: 'background 150ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >
                {cancelLabel}
              </button>

              <button
                onClick={() => onConfirm?.()}
                onMouseEnter={e => {
                  e.currentTarget.style.background = confirmHoverBg
                  triggerShake()
                }}
                onMouseLeave={e => (e.currentTarget.style.background = confirmBg)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: confirmBg,
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  cursor: 'pointer',
                  fontFamily: FONT,
                  transition: 'background 150ms ease',
                }}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

const DIALOGS = [
  {
    id: 'delete',
    triggerLabel: 'Delete file',
    triggerDesc: 'Destructive · permanent action',
    icon: '🗑️',
    title: 'Delete this file?',
    description: 'This action cannot be undone. The file will be permanently removed from your workspace.',
    confirmLabel: 'Delete file',
    variant: 'destructive' as Variant,
  },
  {
    id: 'remove',
    triggerLabel: 'Remove member',
    triggerDesc: 'Destructive · access revoked',
    icon: '⚠️',
    title: 'Remove team member?',
    description: 'Alex Chen will lose access to all projects and will be notified via email.',
    confirmLabel: 'Remove member',
    variant: 'destructive' as Variant,
  },
  {
    id: 'archive',
    triggerLabel: 'Archive project',
    triggerDesc: 'Default · reversible',
    icon: '📁',
    title: 'Archive this project?',
    description: 'The project will be moved to archives. You can restore it at any time from settings.',
    confirmLabel: 'Archive project',
    variant: 'default' as Variant,
  },
  {
    id: 'logout',
    triggerLabel: 'Sign out',
    triggerDesc: 'Default · session ends',
    icon: '👤',
    title: 'Sign out of your account?',
    description: "You'll need to sign back in to access your workspace. Any unsaved changes may be lost.",
    confirmLabel: 'Sign out',
    variant: 'default' as Variant,
  },
]

function Demo() {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid rgba(10,10,10,0.08)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        width: '360px',
        maxWidth: 'calc(100vw - 48px)',
        overflow: 'hidden',
        fontFamily: FONT,
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(10,10,10,0.06)',
        }}>
          <p style={{
            margin: 0,
            fontSize: '13px',
            fontWeight: 600,
            color: '#0a0a0a',
            letterSpacing: '-0.01em',
          }}>
            Confirmation Dialog
          </p>
          <p style={{
            margin: '2px 0 0',
            fontSize: '12px',
            fontWeight: 500,
            color: 'rgba(10,10,10,0.45)',
            letterSpacing: '-0.01em',
          }}>
            Click any action to preview
          </p>
        </div>

        <div style={{ padding: '8px' }}>
          {DIALOGS.map((d, i) => (
            <button
              key={d.id}
              onClick={() => setActiveId(d.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: FONT,
                transition: 'background 120ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: d.variant === 'destructive' ? '#fef2f2' : '#f5f5f5',
                border: `1px solid ${d.variant === 'destructive' ? 'rgba(220,38,38,0.15)' : 'rgba(10,10,10,0.08)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px',
                flexShrink: 0,
              }}>
                {d.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: 0,
                  fontSize: '13px',
                  fontWeight: 600,
                  color: d.variant === 'destructive' ? '#dc2626' : '#0a0a0a',
                  letterSpacing: '-0.01em',
                  lineHeight: '18px',
                }}>
                  {d.triggerLabel}
                </p>
                <p style={{
                  margin: '1px 0 0',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'rgba(10,10,10,0.4)',
                  letterSpacing: '-0.01em',
                }}>
                  {d.triggerDesc}
                </p>
              </div>

              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: 'rgba(10,10,10,0.25)' }}>
                <path d="M5.5 3.5L9 7L5.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>
      </div>

      {DIALOGS.map(d => (
        <ConfirmationDialog
          key={d.id}
          open={activeId === d.id}
          onClose={() => setActiveId(null)}
          onConfirm={() => setActiveId(null)}
          title={d.title}
          description={d.description}
          confirmLabel={d.confirmLabel}
          variant={d.variant}
          icon={d.icon}
        />
      ))}
    </>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useEffect, useRef } from 'react'

// Drop this into any React project — no dependencies required.
// Supports default and destructive variants. Destructive confirms
// shake the card on hover to reinforce the weight of the action.

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type Variant = 'default' | 'destructive'

interface ConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: Variant
  icon?: string
}

export function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  icon,
}: ConfirmationDialogProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [shake, setShake] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (mountTimerRef.current) clearTimeout(mountTimerRef.current)
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
      mountTimerRef.current = setTimeout(() => setMounted(false), 280)
    }
    return () => { if (mountTimerRef.current) clearTimeout(mountTimerRef.current) }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    return () => { if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current) }
  }, [])

  if (!mounted) return null

  const isDestructive = variant === 'destructive'
  const confirmBg = isDestructive ? '#dc2626' : '#0a0a0a'
  const confirmHoverBg = isDestructive ? '#b91c1c' : '#262626'
  const iconBg = isDestructive ? '#fef2f2' : '#f5f5f5'
  const iconBorder = isDestructive ? 'rgba(220,38,38,0.15)' : 'rgba(10,10,10,0.08)'

  const triggerShake = () => {
    if (!isDestructive || shake) return
    setShake(true)
    shakeTimerRef.current = setTimeout(() => setShake(false), 420)
  }

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backdropFilter: \`blur(\${visible ? 6 : 0}px)\`,
        WebkitBackdropFilter: \`blur(\${visible ? 6 : 0}px)\`,
        backgroundColor: visible ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0)',
        transition: 'backdrop-filter 260ms ease, -webkit-backdrop-filter 260ms ease, background-color 260ms ease',
      }}
    >
      <style>{\`
        @keyframes cdShake {
          0%, 100% { transform: translateX(0); }
          15%       { transform: translateX(-6px); }
          30%       { transform: translateX(6px); }
          45%       { transform: translateX(-4px); }
          60%       { transform: translateX(4px); }
          75%       { transform: translateX(-2px); }
          90%       { transform: translateX(2px); }
        }
      \`}</style>

      {/* Enter/exit transform wrapper */}
      <div style={{
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(10px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 260ms cubic-bezier(0.32, 0.72, 0, 1), opacity 260ms ease',
      }}>
        {/* Shake wrapper — separate layer prevents transform conflict */}
        <div
          onAnimationEnd={() => setShake(false)}
          style={{ animation: shake ? 'cdShake 420ms cubic-bezier(0.36, 0.07, 0.19, 0.97)' : 'none' }}
        >
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid rgba(10,10,10,0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            width: '380px',
            maxWidth: 'calc(100vw - 48px)',
            padding: '24px',
            fontFamily: FONT,
          }}>
            {icon && (
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: iconBg, border: \`1px solid \${iconBorder}\`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px', fontSize: '18px', flexShrink: 0,
              }}>
                {icon}
              </div>
            )}

            <h2 style={{
              margin: 0, fontSize: '15px', fontWeight: 600, color: '#0a0a0a',
              letterSpacing: '-0.02em', lineHeight: '22px',
            }}>
              {title}
            </h2>

            <p style={{
              margin: '6px 0 0', fontSize: '13px', fontWeight: 500,
              color: 'rgba(10,10,10,0.55)', letterSpacing: '-0.01em', lineHeight: '19px',
            }}>
              {description}
            </p>

            <div style={{ display: 'flex', gap: '8px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '8px 16px', borderRadius: '8px',
                  border: '1px solid rgba(10,10,10,0.12)', background: '#fff',
                  color: '#0a0a0a', fontSize: '13px', fontWeight: 500,
                  letterSpacing: '-0.01em', cursor: 'pointer', fontFamily: FONT,
                  transition: 'background 150ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >
                {cancelLabel}
              </button>

              <button
                onClick={() => onConfirm?.()}
                onMouseEnter={e => { e.currentTarget.style.background = confirmHoverBg; triggerShake() }}
                onMouseLeave={e => (e.currentTarget.style.background = confirmBg)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: 'none',
                  background: confirmBg, color: '#fff', fontSize: '13px', fontWeight: 500,
                  letterSpacing: '-0.01em', cursor: 'pointer', fontFamily: FONT,
                  transition: 'background 150ms ease',
                }}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Usage ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}>Delete file</button>

      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => { console.log('confirmed'); setOpen(false) }}
        title="Delete this file?"
        description="This action cannot be undone. The file will be permanently removed from your workspace."
        confirmLabel="Delete file"
        variant="destructive"
        icon="🗑️"
      />
    </>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConfirmationDialogPage() {
  return (
    <main style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      fontFamily: FONT,
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
        gap: '0',
      }}>
        <Demo />
        <p style={{
          marginTop: '28px',
          fontSize: '12px',
          color: 'rgba(0,0,0,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily: FONT,
          textAlign: 'center',
        }}>
          Spring enter/exit · backdrop blur · destructive confirms shake on hover · Escape to close
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
