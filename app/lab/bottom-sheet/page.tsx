'use client'

import { useState, useRef, useEffect } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ——————————————————————————————————————————
// BOTTOM SHEET — Demo (bounded stage, absolute positioning)
// ——————————————————————————————————————————

function BottomSheetDemo({
  open,
  onClose,
  containerHeight,
}: {
  open: boolean
  onClose: () => void
  containerHeight: number
}) {
  const HALF = Math.round(containerHeight * 0.52)
  const FULL = Math.round(containerHeight * 0.80)

  const [height, setHeight] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef(0)
  const startHRef = useRef(0)

  useEffect(() => {
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setHeight(HALF)))
    } else {
      setHeight(0)
      const t = setTimeout(() => setMounted(false), 440)
      return () => clearTimeout(t)
    }
  }, [open])

  const snapTo = (h: number) => {
    const pts = [0, HALF, FULL]
    pts.sort((a, b) => Math.abs(a - h) - Math.abs(b - h))
    if (pts[0] === 0) {
      onClose()
    } else {
      setHeight(pts[0])
    }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    startYRef.current = e.clientY
    startHRef.current = height
    setIsDragging(true)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const delta = e.clientY - startYRef.current
    setHeight(Math.max(0, startHRef.current - delta))
  }

  const onPointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    snapTo(height)
  }

  if (!mounted) return null

  const pct = Math.min(1, height / FULL)
  const backdropAlpha = (pct * 0.45).toFixed(3)
  const backdropBlur = (pct * 6).toFixed(1)

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0, zIndex: 10,
          background: `rgba(0,0,0,${backdropAlpha})`,
          backdropFilter: `blur(${backdropBlur}px)`,
          WebkitBackdropFilter: `blur(${backdropBlur}px)`,
          transition: isDragging ? 'none' : 'background 0.38s ease, backdrop-filter 0.38s ease',
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
          height: `${height}px`,
          background: '#fff',
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.12), 0 -1px 4px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          transition: isDragging ? 'none' : 'height 0.42s cubic-bezier(0.32, 0.72, 0, 1)',
          display: 'flex', flexDirection: 'column',
          fontFamily: font,
        }}
      >
        {/* Drag handle */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{
            paddingTop: 10, paddingBottom: 8,
            display: 'flex', justifyContent: 'center',
            cursor: isDragging ? 'grabbing' : 'grab',
            flexShrink: 0, userSelect: 'none', touchAction: 'none',
          }}
        >
          <div style={{ width: 32, height: 4, background: 'rgba(0,0,0,0.14)', borderRadius: 2 }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2px 20px 24px', scrollbarWidth: 'none' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
              Share
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.38)', marginTop: 2 }}>
              Choose how to share this post
            </div>
          </div>

          {[
            { icon: '🔗', label: 'Copy link', desc: 'Copy to clipboard' },
            { icon: '✉️', label: 'Email', desc: 'Send via email' },
            { icon: '𝕏', label: 'Post to X', desc: 'Share on X / Twitter' },
            { icon: '💬', label: 'Message', desc: 'Send a direct message' },
          ].map(item => (
            <div
              key={item.label}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '9px 10px', borderRadius: 10,
                cursor: 'pointer', marginBottom: 2,
                transition: 'background 0.1s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width: 36, height: 36, background: 'rgba(0,0,0,0.04)',
                borderRadius: 10, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 16, flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.38)', fontWeight: 500, marginTop: 1 }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}

          <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '10px 0' }} />

          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '10px',
              background: 'rgba(0,0,0,0.04)', border: 'none', borderRadius: 10,
              fontSize: 13, fontWeight: 600, color: '#0a0a0a',
              cursor: 'pointer', letterSpacing: '-0.01em', fontFamily: 'inherit',
              transition: 'background 0.12s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}

// ——————————————————————————————————————————
// DEMO SECTION
// ——————————————————————————————————————————

const STAGE_H = 620

function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
      padding: '40px 24px',
      fontFamily: font,
    }}>
      {/* Phone stage */}
      <div style={{
        position: 'relative',
        width: 375,
        height: STAGE_H,
        maxWidth: 'calc(100vw - 48px)',
        background: '#f5f5f7',
        borderRadius: 20,
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        {/* Status bar */}
        <div style={{
          height: 44, padding: '0 20px',
          display: 'flex', alignItems: 'center',
          background: '#f5f5f7',
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>9:41</span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
            {[3, 5, 7, 9].map((h, i) => (
              <div key={i} style={{ width: 3, height: h, background: i < 3 ? '#0a0a0a' : 'rgba(0,0,0,0.2)', borderRadius: 1 }} />
            ))}
            <div style={{
              width: 13, height: 7, border: '1px solid #0a0a0a', borderRadius: 2,
              marginLeft: 4, display: 'flex', alignItems: 'center', padding: '0 1px',
            }}>
              <div style={{ width: 8, height: 4, background: '#0a0a0a', borderRadius: 1 }} />
            </div>
          </div>
        </div>

        {/* Nav bar */}
        <div style={{
          height: 44, padding: '0 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#f5f5f7',
        }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.03em' }}>Feed</span>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }} />
        </div>

        {/* Feed */}
        <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Featured post */}
          <div style={{
            background: '#fff', borderRadius: 14,
            border: '1px solid rgba(0,0,0,0.07)',
            padding: 14,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
                  Vraj Shah
                </div>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.38)', fontWeight: 500 }}>2h ago</div>
              </div>
            </div>
            <div style={{
              fontSize: 13, fontWeight: 500, color: '#0a0a0a',
              lineHeight: 1.5, letterSpacing: '-0.01em', marginBottom: 12,
            }}>
              Shipped a new bottom sheet with snap points & drag-to-dismiss. Zero dependencies.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {['❤️ 24', '💬 8'].map(l => (
                <button key={l} style={{
                  padding: '5px 10px', background: 'rgba(0,0,0,0.04)',
                  border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 500,
                  color: 'rgba(0,0,0,0.55)', cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  {l}
                </button>
              ))}
              <div style={{ flex: 1 }} />
              <button
                onClick={() => setOpen(true)}
                style={{
                  padding: '5px 12px', background: '#0a0a0a',
                  border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600,
                  color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                  letterSpacing: '-0.01em',
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Share ↑
              </button>
            </div>
          </div>

          {/* Ghost cards */}
          {[0.65, 0.4].map((opacity, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 14,
              border: '1px solid rgba(0,0,0,0.07)', padding: 14, opacity,
            }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.07)', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingTop: 2 }}>
                  <div style={{ height: 9, width: 80, background: 'rgba(0,0,0,0.07)', borderRadius: 4 }} />
                  <div style={{ height: 7, width: 50, background: 'rgba(0,0,0,0.04)', borderRadius: 4 }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ height: 9, width: '90%', background: 'rgba(0,0,0,0.05)', borderRadius: 4 }} />
                <div style={{ height: 9, width: ['75%', '55%'][i], background: 'rgba(0,0,0,0.05)', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom sheet overlay */}
        <BottomSheetDemo
          open={open}
          onClose={() => setOpen(false)}
          containerHeight={STAGE_H}
        />
      </div>

      {/* Hint */}
      <div style={{
        marginTop: 16, fontSize: 12, fontWeight: 500,
        color: 'rgba(0,0,0,0.38)', letterSpacing: '-0.01em',
        opacity: open ? 0 : 1, transition: 'opacity 0.2s ease',
        textAlign: 'center' as const,
      }}>
        Tap <strong style={{ color: 'rgba(0,0,0,0.55)' }}>Share ↑</strong> · Drag handle up/down to snap · Drag down past halfway to close
      </div>
    </div>
  )
}

// ——————————————————————————————————————————
// COPY BUTTON
// ——————————————————————————————————————————

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {}
      }}
      style={{
        padding: '5px 12px',
        background: copied ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 7,
        color: copied ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
        fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: font,
        letterSpacing: '-0.01em',
        transition: 'background 0.15s ease, color 0.15s ease',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ——————————————————————————————————————————
// COPYABLE SOURCE (standalone, fixed-position)
// ——————————————————————————————————————————

const CODE_SOURCE = `'use client'

import { useState, useEffect, useRef } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

function BottomSheet({ open, onClose, children }) {
  const [height, setHeight] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef(0)
  const startHRef = useRef(0)

  const getSnaps = () => {
    const vh = window.innerHeight
    return { half: Math.round(vh * 0.5), full: Math.round(vh * 0.85) }
  }

  useEffect(() => {
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => setHeight(getSnaps().half))
    } else {
      setHeight(0)
      const t = setTimeout(() => setMounted(false), 440)
      return () => clearTimeout(t)
    }
  }, [open])

  const snapTo = (h) => {
    const { half, full } = getSnaps()
    const pts = [0, half, full]
    pts.sort((a, b) => Math.abs(a - h) - Math.abs(b - h))
    if (pts[0] === 0) onClose()
    else setHeight(pts[0])
  }

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    startYRef.current = e.clientY
    startHRef.current = height
    setIsDragging(true)
  }

  const onPointerMove = (e) => {
    if (!isDragging) return
    const delta = e.clientY - startYRef.current
    setHeight(Math.max(0, startHRef.current - delta))
  }

  const onPointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    snapTo(height)
  }

  if (!mounted) return null

  const { full } = getSnaps()
  const pct = Math.min(1, height / full)
  const alpha = (pct * 0.45).toFixed(3)
  const blur = (pct * 6).toFixed(1)

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: \`rgba(0,0,0,\${alpha})\`,
          backdropFilter: \`blur(\${blur}px)\`,
          WebkitBackdropFilter: \`blur(\${blur}px)\`,
          transition: isDragging ? 'none' : 'background 0.38s ease, backdrop-filter 0.38s ease',
        }}
      />
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 51,
          height: \`\${height}px\`,
          background: '#fff',
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          transition: isDragging ? 'none' : 'height 0.42s cubic-bezier(0.32, 0.72, 0, 1)',
          display: 'flex', flexDirection: 'column',
          fontFamily: font,
        }}
      >
        {/* Drag handle */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{
            paddingTop: 10, paddingBottom: 8,
            display: 'flex', justifyContent: 'center',
            cursor: isDragging ? 'grabbing' : 'grab',
            flexShrink: 0, userSelect: 'none', touchAction: 'none',
          }}
        >
          <div style={{ width: 32, height: 4, background: 'rgba(0,0,0,0.14)', borderRadius: 2 }} />
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 40px', scrollbarWidth: 'none' }}>
          {children}
        </div>
      </div>
    </>
  )
}

export default function App() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ fontFamily: font, padding: 24 }}>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '10px 20px', background: '#0a0a0a', border: 'none',
          borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', letterSpacing: '-0.01em', fontFamily: 'inherit',
        }}
      >
        Open Sheet
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Sheet Title
          </div>
          <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.55)', lineHeight: 1.6 }}>
            Your content here. The sheet snaps between 50% and 85% of the viewport.
            Drag the handle up to expand, down to collapse or close.
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}`

// ——————————————————————————————————————————
// PAGE EXPORT
// ——————————————————————————————————————————

export default function BottomSheetPage() {
  return (
    <div style={{ background: '#fff' }}>
      {/* DEMO */}
      <Demo />

      {/* CODE */}
      <div style={{ background: '#0a0a0a', padding: 'clamp(24px, 4vw, 48px)', fontFamily: font }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>
                Bottom Sheet
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                Drop into any React project — zero dependencies
              </div>
            </div>
            <CopyButton text={CODE_SOURCE} />
          </div>

          <div style={{ background: '#111', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center',
            }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontFamily: 'ui-monospace, monospace' }}>
                BottomSheet.tsx
              </div>
            </div>
            <pre style={{
              margin: 0, padding: '20px',
              overflowX: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
              fontSize: 12.5, lineHeight: 1.65, color: '#e5e5e5',
              scrollbarWidth: 'thin',
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
