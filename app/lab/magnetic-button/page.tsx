'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── MagneticButton ───────────────────────────────────────────────────────────

interface MagneticButtonProps {
  children: React.ReactNode
  strength?: number
  style?: React.CSSProperties
  onClick?: () => void
}

function MagneticButton({ children, strength = 0.35, style, onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)
  const rafRef = useRef<number | null>(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  const animate = useCallback(() => {
    currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.12)
    currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.12)
    setOffset({ x: currentRef.current.x, y: currentRef.current.y })

    const dx = Math.abs(currentRef.current.x - targetRef.current.x)
    const dy = Math.abs(currentRef.current.y - targetRef.current.y)
    if (dx > 0.01 || dy > 0.01) {
      rafRef.current = requestAnimationFrame(animate)
    } else {
      rafRef.current = null
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    targetRef.current = {
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    }
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [strength, animate])

  const handleMouseLeave = useCallback(() => {
    setActive(false)
    targetRef.current = { x: 0, y: 0 }
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [animate])

  const handleMouseEnter = useCallback(() => {
    setActive(true)
  }, [])

  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: active ? 'box-shadow 200ms ease' : 'transform 600ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 200ms ease',
        cursor: 'pointer',
        border: 'none',
        fontFamily: FONT,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function Demo() {
  const [clicked, setClicked] = useState<string | null>(null)

  useEffect(() => {
    if (!clicked) return
    const id = setTimeout(() => setClicked(null), 1200)
    return () => clearTimeout(id)
  }, [clicked])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '64px' }}>

      {/* Primary CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>
          Primary CTA
        </p>
        <MagneticButton
          strength={0.4}
          onClick={() => setClicked('primary')}
          style={{
            padding: '14px 32px',
            borderRadius: '100px',
            background: '#0a0a0a',
            color: '#fff',
            fontSize: '15px',
            boxShadow: clicked === 'primary'
              ? '0 0 0 3px rgba(10,10,10,0.15)'
              : '0 2px 8px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.12)',
          }}
        >
          {clicked === 'primary' ? '✓ Done' : 'Get started'}
        </MagneticButton>
      </div>

      {/* Secondary group */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>
          Outlined
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <MagneticButton
            strength={0.3}
            onClick={() => setClicked('docs')}
            style={{
              padding: '11px 24px',
              borderRadius: '100px',
              background: '#fff',
              color: '#0a0a0a',
              fontSize: '14px',
              border: '1px solid rgba(10,10,10,0.12)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            {clicked === 'docs' ? '✓' : 'Read docs'}
          </MagneticButton>
          <MagneticButton
            strength={0.3}
            onClick={() => setClicked('demo')}
            style={{
              padding: '11px 24px',
              borderRadius: '100px',
              background: '#fff',
              color: '#0a0a0a',
              fontSize: '14px',
              border: '1px solid rgba(10,10,10,0.12)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            {clicked === 'demo' ? '✓' : 'View demo'}
          </MagneticButton>
        </div>
      </div>

      {/* Icon buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>
          Icon buttons · stronger pull
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          {(['↗', '★', '♡', '→'].map((icon, i) => (
            <MagneticButton
              key={icon}
              strength={0.5}
              onClick={() => setClicked(`icon-${i}`)}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: clicked === `icon-${i}` ? '#0a0a0a' : '#fff',
                color: clicked === `icon-${i}` ? '#fff' : '#0a0a0a',
                fontSize: '18px',
                border: '1px solid rgba(10,10,10,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                transition: 'background 200ms ease, color 200ms ease, box-shadow 200ms ease',
              }}
            >
              {icon}
            </MagneticButton>
          )))}
        </div>
      </div>

      <p style={{ margin: 0, fontSize: '12px', color: 'rgba(0,0,0,0.35)', fontWeight: 500, letterSpacing: '-0.01em', fontFamily: FONT }}>
        Hover to feel the pull · adjust <code style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>strength</code> prop (0–1)
      </p>
    </div>
  )
}

// ─── Source ───────────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface MagneticButtonProps {
  children: React.ReactNode
  strength?: number      // 0–1, how strongly the button pulls. Default 0.35
  style?: React.CSSProperties
  onClick?: () => void
}

export function MagneticButton({
  children,
  strength = 0.35,
  style,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)
  const rafRef = useRef<number | null>(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  const animate = useCallback(() => {
    currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.12)
    currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.12)
    setOffset({ x: currentRef.current.x, y: currentRef.current.y })

    const dx = Math.abs(currentRef.current.x - targetRef.current.x)
    const dy = Math.abs(currentRef.current.y - targetRef.current.y)
    if (dx > 0.01 || dy > 0.01) {
      rafRef.current = requestAnimationFrame(animate)
    } else {
      rafRef.current = null
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    targetRef.current = {
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    }
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [strength, animate])

  const handleMouseLeave = useCallback(() => {
    setActive(false)
    targetRef.current = { x: 0, y: 0 }
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [animate])

  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setActive(true)}
      onClick={onClick}
      style={{
        transform: \`translate(\${offset.x}px, \${offset.y}px)\`,
        // Snap back slowly when inactive, no transition during active tracking
        transition: active
          ? 'box-shadow 200ms ease'
          : 'transform 600ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 200ms ease',
        cursor: 'pointer',
        border: 'none',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// ── Usage ──────────────────────────────────────────────────────────────────────
//
// <MagneticButton
//   strength={0.4}
//   style={{
//     padding: '14px 32px',
//     borderRadius: '100px',
//     background: '#0a0a0a',
//     color: '#fff',
//     fontSize: '15px',
//     fontFamily: 'system-ui, sans-serif',
//     fontWeight: 500,
//   }}
// >
//   Get started
// </MagneticButton>`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MagneticButtonPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>

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
        <Demo />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)',
          marginBottom: '12px', fontFamily: FONT,
        }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
          <pre style={{
            margin: 0,
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
            fontSize: '12px', lineHeight: '1.65', color: '#e5e5e5',
            whiteSpace: 'pre', overflowX: 'auto',
          }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
