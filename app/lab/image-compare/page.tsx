'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// ─── ImageCompare ─────────────────────────────────────────────────────────────

function ImageCompare({
  before,
  after,
  initialPosition = 50,
}: {
  before: React.ReactNode
  after: React.ReactNode
  initialPosition?: number
}) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const clamp = (v: number) => Math.max(3, Math.min(97, v))

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100))
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    updatePosition(e.clientX)
  }, [updatePosition])

  const onMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (!isDragging) return
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging, onMouseMove, onMouseUp])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPosition(p => clamp(p - 2))
    if (e.key === 'ArrowRight') setPosition(p => clamp(p + 2))
  }, [])

  const showBefore = position > 8
  const showAfter = position < 92

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={e => { e.preventDefault(); setIsDragging(true); updatePosition(e.clientX) }}
      onTouchStart={e => { e.preventDefault(); updatePosition(e.touches[0].clientX) }}
      onTouchMove={e => { e.preventDefault(); updatePosition(e.touches[0].clientX) }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        cursor: isDragging ? 'col-resize' : 'default',
        outline: 'none',
        touchAction: 'none',
      }}
    >
      {/* After layer (full width, sits behind) */}
      <div style={{ width: '100%', display: 'block' }}>{after}</div>

      {/* Before layer (clipped to the left) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: `inset(0 ${100 - position}% 0 0)`,
          transition: isDragging ? 'none' : undefined,
        }}
      >
        {before}
      </div>

      {/* Divider line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${position}%`,
          transform: 'translateX(-50%)',
          width: 2,
          background: 'rgba(255,255,255,0.95)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.12), 0 0 8px rgba(0,0,0,0.12)',
          pointerEvents: 'none',
        }}
      />

      {/* Handle */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${position}%`,
          transform: `translate(-50%, -50%) scale(${isDragging ? 1.1 : hovered ? 1.05 : 1})`,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: `0 2px 8px rgba(0,0,0,0.18), 0 0 0 1.5px rgba(0,0,0,0.08)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'col-resize',
          transition: 'transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M6 5L2 9L6 13M12 5L16 9L12 13"
            stroke="#0a0a0a"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Before label */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          background: 'rgba(10,10,10,0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: 6,
          padding: '4px 8px',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#fff',
          pointerEvents: 'none',
          opacity: showBefore ? 1 : 0,
          transform: showBefore ? 'translateY(0)' : 'translateY(-4px)',
          transition: 'opacity 180ms ease, transform 180ms ease',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        Before
      </div>

      {/* After label */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'rgba(10,10,10,0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: 6,
          padding: '4px 8px',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#fff',
          pointerEvents: 'none',
          opacity: showAfter ? 1 : 0,
          transform: showAfter ? 'translateY(0)' : 'translateY(-4px)',
          transition: 'opacity 180ms ease, transform 180ms ease',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        After
      </div>
    </div>
  )
}

// ─── Demo panels ──────────────────────────────────────────────────────────────

function BeforePanel() {
  return (
    <div style={{
      width: '100%',
      height: 440,
      background: '#1c1c1e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      boxSizing: 'border-box',
      fontFamily: 'Georgia, "Times New Roman", serif',
    }}>
      <div style={{
        background: '#2c2c2e',
        border: '1px solid #3c3c3e',
        borderRadius: 4,
        padding: '24px 20px',
        width: '100%',
        maxWidth: 340,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 4, background: '#444', border: '1px solid #555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 20 }}>👤</span>
          </div>
          <div>
            <div style={{ color: '#ccc', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>USER PROFILE</div>
            <div style={{ color: '#888', fontSize: 11, marginTop: 2 }}>Last updated: 06/12/2024</div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #3c3c3e', paddingTop: 12, marginBottom: 12 }}>
          <div style={{ color: '#aaa', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>FULL NAME</div>
          <div style={{ background: '#1c1c1e', border: '1px solid #444', padding: '6px 8px', color: '#ccc', fontSize: 13 }}>Alex Harper</div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ color: '#aaa', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>EMAIL ADDRESS</div>
          <div style={{ background: '#1c1c1e', border: '1px solid #444', padding: '6px 8px', color: '#ccc', fontSize: 13 }}>alex@company.com</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: '#aaa', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>ROLE</div>
          <div style={{ background: '#1c1c1e', border: '1px solid #444', padding: '6px 8px', color: '#ccc', fontSize: 13 }}>Design Lead</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ flex: 1, background: '#555', border: '1px solid #666', color: '#ccc', padding: '8px', fontSize: 12, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em' }}>CANCEL</button>
          <button style={{ flex: 1, background: '#007AFF', border: 'none', color: '#fff', padding: '8px', fontSize: 12, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em' }}>SAVE CHANGES</button>
        </div>
      </div>
    </div>
  )
}

function AfterPanel() {
  return (
    <div style={{
      width: '100%',
      height: 440,
      background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>
      <div style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: 16,
        padding: '24px',
        width: '100%',
        maxWidth: 340,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em',
          }}>AH</div>
          <div>
            <div style={{ color: '#0a0a0a', fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: '18px' }}>Alex Harper</div>
            <div style={{ color: 'rgba(10,10,10,0.4)', fontSize: 12, fontWeight: 500, marginTop: 2 }}>Design Lead</div>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', color: 'rgba(10,10,10,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 6 }}>Full name</label>
          <div style={{ background: 'rgba(10,10,10,0.03)', border: '1px solid rgba(10,10,10,0.09)', borderRadius: 8, padding: '9px 12px', color: '#0a0a0a', fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em' }}>Alex Harper</div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', color: 'rgba(10,10,10,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 6 }}>Email address</label>
          <div style={{ background: 'rgba(10,10,10,0.03)', border: '1px solid rgba(10,10,10,0.09)', borderRadius: 8, padding: '9px 12px', color: '#0a0a0a', fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em' }}>alex@company.com</div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', color: 'rgba(10,10,10,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 6 }}>Role</label>
          <div style={{ background: 'rgba(10,10,10,0.03)', border: '1px solid rgba(10,10,10,0.09)', borderRadius: 8, padding: '9px 12px', color: '#0a0a0a', fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em' }}>Design Lead</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ flex: 1, background: 'transparent', border: '1px solid rgba(10,10,10,0.1)', borderRadius: 8, color: 'rgba(10,10,10,0.6)', padding: '9px', fontSize: 13, fontWeight: 500, cursor: 'pointer', letterSpacing: '-0.01em' }}>Cancel</button>
          <button style={{ flex: 2, background: '#0a0a0a', border: 'none', borderRadius: 8, color: '#fff', padding: '9px', fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: '-0.01em' }}>Save changes</button>
        </div>
      </div>
    </div>
  )
}

// ─── Demo wrapper ─────────────────────────────────────────────────────────────

function Demo() {
  return (
    <div style={{
      width: '100%',
      maxWidth: 540,
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.10)',
    }}>
      <ImageCompare
        before={<BeforePanel />}
        after={<AfterPanel />}
        initialPosition={40}
      />
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export function ImageCompare({
  before,
  after,
  initialPosition = 50,
}: {
  before: React.ReactNode
  after: React.ReactNode
  initialPosition?: number
}) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const clamp = (v: number) => Math.max(3, Math.min(97, v))

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100))
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    updatePosition(e.clientX)
  }, [updatePosition])

  const onMouseUp = useCallback(() => setIsDragging(false), [])

  useEffect(() => {
    if (!isDragging) return
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging, onMouseMove, onMouseUp])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPosition(p => clamp(p - 2))
    if (e.key === 'ArrowRight') setPosition(p => clamp(p + 2))
  }, [])

  const showBefore = position > 8
  const showAfter = position < 92

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={e => { e.preventDefault(); setIsDragging(true); updatePosition(e.clientX) }}
      onTouchStart={e => { e.preventDefault(); updatePosition(e.touches[0].clientX) }}
      onTouchMove={e => { e.preventDefault(); updatePosition(e.touches[0].clientX) }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
        userSelect: 'none',
        cursor: isDragging ? 'col-resize' : 'default',
        outline: 'none',
        touchAction: 'none',
      }}
    >
      {/* After layer */}
      <div style={{ width: '100%' }}>{after}</div>

      {/* Before layer, clipped to left side */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: \`inset(0 \${100 - position}% 0 0)\`,
        }}
      >
        {before}
      </div>

      {/* Divider line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: \`\${position}%\`,
          transform: 'translateX(-50%)',
          width: 2,
          background: 'rgba(255,255,255,0.95)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.12), 0 0 8px rgba(0,0,0,0.12)',
          pointerEvents: 'none',
        }}
      />

      {/* Handle */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: \`\${position}%\`,
          transform: \`translate(-50%, -50%) scale(\${isDragging ? 1.1 : hovered ? 1.05 : 1})\`,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.18), 0 0 0 1.5px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'col-resize',
          transition: 'transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M6 5L2 9L6 13M12 5L16 9L12 13"
            stroke="#0a0a0a"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Before label */}
      <div style={{
        position: 'absolute', top: 12, left: 12,
        background: 'rgba(10,10,10,0.6)',
        backdropFilter: 'blur(8px)',
        borderRadius: 6, padding: '4px 8px',
        fontSize: 11, fontWeight: 600,
        letterSpacing: '0.04em', textTransform: 'uppercase', color: '#fff',
        pointerEvents: 'none',
        opacity: showBefore ? 1 : 0,
        transform: showBefore ? 'translateY(0)' : 'translateY(-4px)',
        transition: 'opacity 180ms ease, transform 180ms ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}>Before</div>

      {/* After label */}
      <div style={{
        position: 'absolute', top: 12, right: 12,
        background: 'rgba(10,10,10,0.6)',
        backdropFilter: 'blur(8px)',
        borderRadius: 6, padding: '4px 8px',
        fontSize: 11, fontWeight: 600,
        letterSpacing: '0.04em', textTransform: 'uppercase', color: '#fff',
        pointerEvents: 'none',
        opacity: showAfter ? 1 : 0,
        transform: showAfter ? 'translateY(0)' : 'translateY(-4px)',
        transition: 'opacity 180ms ease, transform 180ms ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}>After</div>
    </div>
  )
}

// Usage with real images:
//
// <ImageCompare
//   before={<img src="/before.png" style={{ width: '100%', display: 'block' }} />}
//   after={<img src="/after.png" style={{ width: '100%', display: 'block' }} />}
//   initialPosition={40}
// />
//
// Works with any React content — not just images!
// Use arrow keys for keyboard control.`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ImageComparePage() {
  return (
    <main style={{
      backgroundColor: 'var(--bg, #ffffff)',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: 16,
      }}>
        <p style={{
          margin: 0,
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.3)',
        }}>
          Image Compare
        </p>
        <Demo />
        <p style={{
          margin: 0,
          fontSize: '12px',
          color: 'rgba(10,10,10,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
        }}>
          Drag the handle · Arrow keys to nudge
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
