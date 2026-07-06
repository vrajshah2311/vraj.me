'use client'

import React, { useState, useEffect, useRef } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type Placement = 'top' | 'bottom' | 'left' | 'right'

// ── TooltipBubble ─────────────────────────────────────────────────────────────

function TooltipBubble({
  label, shortcut, anchorRef, visible, placement,
}: {
  label: string
  shortcut?: string
  anchorRef: { readonly current: HTMLElement | null }
  visible: boolean
  placement: Placement
}) {
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const tipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (visible) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const anchor = anchorRef.current?.getBoundingClientRect()
        const tip = tipRef.current?.getBoundingClientRect()
        if (!anchor || !tip) return
        const gap = 8
        let top = 0, left = 0
        if (placement === 'top') {
          top = anchor.top - tip.height - gap
          left = anchor.left + anchor.width / 2 - tip.width / 2
        } else if (placement === 'bottom') {
          top = anchor.bottom + gap
          left = anchor.left + anchor.width / 2 - tip.width / 2
        } else if (placement === 'left') {
          top = anchor.top + anchor.height / 2 - tip.height / 2
          left = anchor.left - tip.width - gap
        } else {
          top = anchor.top + anchor.height / 2 - tip.height / 2
          left = anchor.right + gap
        }
        left = Math.max(8, Math.min(left, window.innerWidth - tip.width - 8))
        top = Math.max(8, Math.min(top, window.innerHeight - tip.height - 8))
        setPos({ top, left })
        setShow(true)
      }))
    } else {
      setShow(false)
      const t = setTimeout(() => setMounted(false), 180)
      return () => clearTimeout(t)
    }
  }, [visible, placement])

  if (!mounted) return null

  const dy = placement === 'top' ? 4 : placement === 'bottom' ? -4 : 0
  const dx = placement === 'left' ? 4 : placement === 'right' ? -4 : 0

  return (
    <div
      ref={tipRef}
      style={{
        position: 'fixed', top: pos.top, left: pos.left,
        zIndex: 9999, fontFamily: font, pointerEvents: 'none',
        transform: show ? 'translate(0,0) scale(1)' : `translate(${dx}px,${dy}px) scale(0.94)`,
        opacity: show ? 1 : 0,
        transition: show
          ? 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.12s ease'
          : 'transform 0.12s ease, opacity 0.1s ease',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: '#0a0a0a', color: '#fff',
        borderRadius: 7, padding: '5px 9px',
        fontSize: 12, fontWeight: 500, letterSpacing: '-0.01em',
        whiteSpace: 'nowrap' as const,
        boxShadow: '0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.06)',
      }}>
        <span>{label}</span>
        {shortcut && (
          <span style={{
            fontSize: 10, fontWeight: 600,
            color: 'rgba(255,255,255,0.45)',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 4, padding: '1px 5px',
          }}>{shortcut}</span>
        )}
      </div>
    </div>
  )
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

function Tooltip({
  children, label, shortcut, placement = 'top',
}: {
  children: React.ReactNode
  label: string
  shortcut?: string
  placement?: Placement
}) {
  const [visible, setVisible] = useState(false)
  const anchorRef = useRef<HTMLSpanElement>(null)
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const open = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    enterTimer.current = setTimeout(() => setVisible(true), 400)
  }
  const close = () => {
    if (enterTimer.current) clearTimeout(enterTimer.current)
    leaveTimer.current = setTimeout(() => setVisible(false), 80)
  }

  useEffect(() => () => {
    if (enterTimer.current) clearTimeout(enterTimer.current)
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
  }, [])

  return (
    <>
      <span ref={anchorRef} onMouseEnter={open} onMouseLeave={close} style={{ display: 'inline-block' }}>
        {children}
      </span>
      <TooltipBubble
        label={label} shortcut={shortcut}
        anchorRef={anchorRef} visible={visible} placement={placement}
      />
    </>
  )
}

// ── Demo ──────────────────────────────────────────────────────────────────────

type ToolItem = { icon: string; label: string; shortcut?: string; bold?: boolean; italic?: boolean; underline?: boolean } | { sep: true }

const TOOLBAR: ToolItem[] = [
  { icon: 'B', label: 'Bold', shortcut: '⌘B', bold: true },
  { icon: 'I', label: 'Italic', shortcut: '⌘I', italic: true },
  { icon: 'U', label: 'Underline', shortcut: '⌘U', underline: true },
  { sep: true },
  { icon: 'H1', label: 'Heading 1', shortcut: '⌘⌥1' },
  { icon: 'H2', label: 'Heading 2', shortcut: '⌘⌥2' },
  { sep: true },
  { icon: '</>', label: 'Code block', shortcut: '⌘E' },
  { icon: '↗', label: 'Insert link', shortcut: '⌘K' },
  { icon: '≡', label: 'Bullet list' },
  { icon: '⋮', label: 'More options' },
]

function IconBtn({
  icon, bold, italic, underline, active, onToggle,
}: {
  icon: string; bold?: boolean; italic?: boolean; underline?: boolean
  active: boolean; onToggle: () => void
}) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 32, height: 32, border: 'none', borderRadius: 7, cursor: 'pointer',
        background: active ? 'rgba(0,0,0,0.08)' : hov ? 'rgba(0,0,0,0.05)' : 'transparent',
        color: '#0a0a0a',
        fontSize: icon.length > 2 ? 10 : 13,
        fontWeight: bold ? 800 : 500,
        fontStyle: italic ? 'italic' : 'normal',
        textDecoration: underline ? 'underline' : 'none',
        fontFamily: font,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.12s ease',
        flexShrink: 0,
      }}
    >{icon}</button>
  )
}

function Demo() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  const toggleIdx = (i: number) => setActiveIdx(prev => prev === i ? null : i)

  let btnIdx = -1

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
      padding: '40px 24px', fontFamily: font, gap: 28,
    }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.35)',
          letterSpacing: '0.06em', textTransform: 'uppercase' as const,
          marginBottom: 16, textAlign: 'center' as const,
        }}>Hover any toolbar button</div>

        <div style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.04)',
        }}>
          {/* Toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', flexWrap: 'wrap' as const, gap: 2,
            padding: '8px 12px', borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}>
            {TOOLBAR.map((item, i) => {
              if ('sep' in item) {
                return <div key={i} style={{ width: 1, height: 18, background: 'rgba(0,0,0,0.1)', margin: '0 4px', flexShrink: 0 }} />
              }
              btnIdx++
              const bi = btnIdx
              return (
                <Tooltip key={i} label={item.label} shortcut={item.shortcut} placement="top">
                  <IconBtn
                    icon={item.icon}
                    bold={item.bold}
                    italic={item.italic}
                    underline={item.underline}
                    active={activeIdx === bi}
                    onToggle={() => toggleIdx(bi)}
                  />
                </Tooltip>
              )
            })}
          </div>

          {/* Body */}
          <div style={{ padding: '16px 16px 20px' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', marginBottom: 8 }}>
              The quick brown fox
            </div>
            <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.55)', lineHeight: 1.65, letterSpacing: '-0.01em' }}>
              Jumps over the lazy dog. Each toolbar button shows a smooth tooltip with an optional keyboard shortcut badge — springs in from the direction of the trigger, exits fast.
            </div>
          </div>
        </div>
      </div>

      {/* Placement showcase */}
      <div>
        <div style={{
          fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.35)',
          letterSpacing: '0.06em', textTransform: 'uppercase' as const,
          marginBottom: 14, textAlign: 'center' as const,
        }}>All four placements</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' as const, justifyContent: 'center' as const }}>
          {(['top', 'right', 'bottom', 'left'] as Placement[]).map(p => (
            <Tooltip key={p} label={`Tooltip · ${p}`} placement={p}>
              <button style={{
                padding: '8px 16px', background: '#fff',
                border: '1px solid rgba(0,0,0,0.1)', borderRadius: 9,
                cursor: 'pointer', fontFamily: font,
                fontSize: 12, fontWeight: 500, color: '#0a0a0a',
                letterSpacing: '-0.01em',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                transition: 'background 0.12s ease, border-color 0.12s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.16)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)' }}
              >{p}</button>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── CopyButton ────────────────────────────────────────────────────────────────

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

// ── Code source ───────────────────────────────────────────────────────────────

const CODE_SOURCE = `'use client'

import React, { useState, useEffect, useRef } from 'react'

type Placement = 'top' | 'bottom' | 'left' | 'right'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ── TooltipBubble ─────────────────────────────────────────────────────────────
// Positioned with fixed coords computed from anchor.getBoundingClientRect().
// Double-rAF trick ensures tipRef is measured after mount for accurate width/height.

function TooltipBubble({
  label, shortcut, anchorRef, visible, placement,
}: {
  label: string
  shortcut?: string
  anchorRef: { readonly current: HTMLElement | null }
  visible: boolean
  placement: Placement
}) {
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const tipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (visible) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const anchor = anchorRef.current?.getBoundingClientRect()
        const tip = tipRef.current?.getBoundingClientRect()
        if (!anchor || !tip) return
        const gap = 8
        let top = 0, left = 0
        if (placement === 'top') {
          top = anchor.top - tip.height - gap
          left = anchor.left + anchor.width / 2 - tip.width / 2
        } else if (placement === 'bottom') {
          top = anchor.bottom + gap
          left = anchor.left + anchor.width / 2 - tip.width / 2
        } else if (placement === 'left') {
          top = anchor.top + anchor.height / 2 - tip.height / 2
          left = anchor.left - tip.width - gap
        } else {
          top = anchor.top + anchor.height / 2 - tip.height / 2
          left = anchor.right + gap
        }
        left = Math.max(8, Math.min(left, window.innerWidth - tip.width - 8))
        top = Math.max(8, Math.min(top, window.innerHeight - tip.height - 8))
        setPos({ top, left })
        setShow(true)
      }))
    } else {
      setShow(false)
      const t = setTimeout(() => setMounted(false), 180)
      return () => clearTimeout(t)
    }
  }, [visible, placement])

  if (!mounted) return null

  const dy = placement === 'top' ? 4 : placement === 'bottom' ? -4 : 0
  const dx = placement === 'left' ? 4 : placement === 'right' ? -4 : 0

  return (
    <div
      ref={tipRef}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        zIndex: 9999,
        fontFamily: font,
        pointerEvents: 'none',
        transform: show ? 'translate(0,0) scale(1)' : \`translate(\${dx}px,\${dy}px) scale(0.94)\`,
        opacity: show ? 1 : 0,
        transition: show
          ? 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.12s ease'
          : 'transform 0.12s ease, opacity 0.1s ease',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: '#0a0a0a',
        color: '#fff',
        borderRadius: 7,
        padding: '5px 9px',
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.06)',
      }}>
        <span>{label}</span>
        {shortcut && (
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.45)',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 4,
            padding: '1px 5px',
          }}>{shortcut}</span>
        )}
      </div>
    </div>
  )
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
// Wraps any trigger. 400ms open delay, 80ms close delay.
// Delay prevents flicker when quickly mousing over multiple targets.

export function Tooltip({
  children,
  label,
  shortcut,
  placement = 'top',
}: {
  children: React.ReactNode
  label: string
  shortcut?: string
  placement?: Placement
}) {
  const [visible, setVisible] = useState(false)
  const anchorRef = useRef<HTMLSpanElement>(null)
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const open = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    enterTimer.current = setTimeout(() => setVisible(true), 400)
  }
  const close = () => {
    if (enterTimer.current) clearTimeout(enterTimer.current)
    leaveTimer.current = setTimeout(() => setVisible(false), 80)
  }

  useEffect(() => () => {
    if (enterTimer.current) clearTimeout(enterTimer.current)
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
  }, [])

  return (
    <>
      <span
        ref={anchorRef}
        onMouseEnter={open}
        onMouseLeave={close}
        style={{ display: 'inline-block' }}
      >
        {children}
      </span>
      <TooltipBubble
        label={label}
        shortcut={shortcut}
        anchorRef={anchorRef}
        visible={visible}
        placement={placement}
      />
    </>
  )
}

// ── Usage ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div style={{ display: 'flex', gap: 12, padding: 40, fontFamily: font, flexWrap: 'wrap' }}>
      <Tooltip label="Bold" shortcut="⌘B">
        <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)', cursor: 'pointer', background: '#fff', fontWeight: 700 }}>B</button>
      </Tooltip>

      <Tooltip label="Tooltip on the right" placement="right">
        <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)', cursor: 'pointer', background: '#fff' }}>right</button>
      </Tooltip>

      <Tooltip label="Tooltip below" placement="bottom">
        <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)', cursor: 'pointer', background: '#fff' }}>bottom</button>
      </Tooltip>

      <Tooltip label="Tooltip to the left" placement="left">
        <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)', cursor: 'pointer', background: '#fff' }}>left</button>
      </Tooltip>
    </div>
  )
}`

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TooltipPage() {
  return (
    <div style={{ background: '#fff' }}>
      <Demo />

      <div style={{ background: '#0a0a0a', padding: 'clamp(24px, 4vw, 48px)' as any, fontFamily: font }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>
                Tooltip
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
                Tooltip.tsx
              </div>
            </div>
            <pre style={{
              margin: 0, padding: '20px', overflowX: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
              fontSize: 12.5, lineHeight: 1.65, color: '#e5e5e5',
              scrollbarWidth: 'thin' as any, scrollbarColor: 'rgba(255,255,255,0.1) transparent',
            }}>
              <code>{CODE_SOURCE}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
