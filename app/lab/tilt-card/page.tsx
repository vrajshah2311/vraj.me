'use client'

import { useRef, useCallback } from 'react'

// ─── TiltCard ─────────────────────────────────────────────────────────────────

function TiltCard({
  children,
  maxTilt = 14,
  scale = 1.03,
  perspective = 900,
  glare = true,
  style,
}: {
  children: React.ReactNode
  maxTilt?: number
  scale?: number
  perspective?: number
  glare?: boolean
  style?: React.CSSProperties
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const el = cardRef.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const nx = (e.clientX - r.left) / r.width
        const ny = (e.clientY - r.top) / r.height
        const rx = (ny - 0.5) * maxTilt * 2
        const ry = (nx - 0.5) * maxTilt * -2
        el.style.transform = `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`
        el.style.transition = 'transform 0ms'
        const depth = (Math.abs(rx) + Math.abs(ry)) * 0.5
        el.style.boxShadow = `0 ${10 + depth}px ${28 + depth * 2.5}px rgba(0,0,0,${(0.08 + depth * 0.007).toFixed(3)})`
        if (glare && shineRef.current) {
          shineRef.current.style.background = `radial-gradient(circle at ${nx * 100}% ${ny * 100}%, rgba(255,255,255,0.18) 0%, transparent 62%)`
          shineRef.current.style.opacity = '1'
        }
      })
    },
    [maxTilt, scale, perspective, glare],
  )

  const onMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const el = cardRef.current
    if (!el) return
    el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`
    el.style.transition = 'transform 600ms cubic-bezier(0.03,0.98,0.52,0.99), box-shadow 500ms ease'
    el.style.boxShadow = ''
    if (glare && shineRef.current) shineRef.current.style.opacity = '0'
  }, [perspective, glare])

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        ...style,
      }}
    >
      {children}
      {glare && (
        <div
          ref={shineRef}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0,
            transition: 'opacity 200ms ease',
            zIndex: 10,
          }}
        />
      )}
    </div>
  )
}

// ─── Demo cards ───────────────────────────────────────────────────────────────

function AnalyticsCard() {
  const bars = [42, 58, 34, 67, 51, 79, 63, 88, 72, 84, 61, 93]
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: 16,
        padding: '20px 20px 16px',
        width: 216,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 18,
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              fontWeight: 600,
              color: 'rgba(10,10,10,0.38)',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            }}
          >
            Revenue
          </p>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 26,
              fontWeight: 600,
              color: '#0a0a0a',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            $48.2k
          </p>
        </div>
        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid rgba(22,163,74,0.18)',
            borderRadius: 6,
            padding: '3px 7px',
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a' }}>↑ 12.4%</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 52 }}>
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              background: i === bars.length - 1 ? '#0a0a0a' : 'rgba(10,10,10,0.08)',
              borderRadius: 3,
            }}
          />
        ))}
      </div>
      <p
        style={{
          margin: '10px 0 0',
          fontSize: 11,
          color: 'rgba(10,10,10,0.32)',
          fontWeight: 500,
          letterSpacing: '-0.005em',
        }}
      >
        Last 12 months
      </p>
    </div>
  )
}

function PricingCard() {
  const features = ['Unlimited projects', 'Team collaboration', 'Priority support', 'Analytics']
  return (
    <div
      style={{
        background: 'linear-gradient(145deg, #111 0%, #1c1c2e 100%)',
        borderRadius: 16,
        padding: '20px',
        width: 216,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 6,
          padding: '3px 8px',
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase' as const,
          }}
        >
          Popular
        </span>
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 13,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '-0.01em',
        }}
      >
        Pro
      </p>
      <div
        style={{
          margin: '8px 0 18px',
          display: 'flex',
          alignItems: 'baseline',
          gap: 4,
        }}
      >
        <span
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          $49
        </span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>/mo</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {features.map((f) => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.8)', fontWeight: 800 }}>✓</span>
            </div>
            <span
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 500,
                letterSpacing: '-0.01em',
              }}
            >
              {f}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 18,
          background: '#fff',
          borderRadius: 9,
          padding: '9px',
          textAlign: 'center' as const,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#0a0a0a',
            letterSpacing: '-0.02em',
          }}
        >
          Get started
        </span>
      </div>
    </div>
  )
}

function ProfileCard() {
  const skills = ['React', 'TypeScript', 'Motion']
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: 16,
        width: 216,
        overflow: 'hidden',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        style={{
          height: 60,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        }}
      />
      <div style={{ padding: '0 16px 16px' }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: '#6366f1',
            border: '3px solid #fff',
            marginTop: -23,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.02em',
            marginBottom: 10,
            boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
          }}
        >
          AH
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 600,
            color: '#0a0a0a',
            letterSpacing: '-0.02em',
          }}
        >
          Alex Harper
        </p>
        <p
          style={{
            margin: '2px 0 12px',
            fontSize: 12,
            color: 'rgba(10,10,10,0.38)',
            fontWeight: 500,
            letterSpacing: '-0.01em',
          }}
        >
          Product Designer · Linear
        </p>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const }}>
          {skills.map((s) => (
            <span
              key={s}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'rgba(10,10,10,0.48)',
                background: 'rgba(10,10,10,0.04)',
                border: '1px solid rgba(10,10,10,0.07)',
                borderRadius: 5,
                padding: '2px 7px',
                letterSpacing: '-0.005em',
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function Demo() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 36,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap' as const,
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <TiltCard
          style={{
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          }}
        >
          <AnalyticsCard />
        </TiltCard>

        <TiltCard
          style={{
            borderRadius: 16,
            boxShadow: '0 2px 12px rgba(0,0,0,0.16)',
          }}
        >
          <PricingCard />
        </TiltCard>

        <TiltCard
          style={{
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          }}
        >
          <ProfileCard />
        </TiltCard>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: 'rgba(0,0,0,0.28)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        Hover over the cards to see the 3D tilt · glare follows your cursor
      </p>
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useRef, useCallback } from 'react'

/**
 * TiltCard — wraps any content with smooth 3D perspective tilt on hover.
 *
 * Props:
 *   maxTilt   – max rotation in degrees (default 14)
 *   scale     – scale on hover (default 1.03)
 *   perspective – CSS perspective distance in px (default 900)
 *   glare     – show mouse-follow glare overlay (default true)
 *   style     – extra styles merged onto the wrapper (use for borderRadius, etc.)
 */
export function TiltCard({
  children,
  maxTilt = 14,
  scale = 1.03,
  perspective = 900,
  glare = true,
  style,
}: {
  children: React.ReactNode
  maxTilt?: number
  scale?: number
  perspective?: number
  glare?: boolean
  style?: React.CSSProperties
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const el = cardRef.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const nx = (e.clientX - r.left) / r.width
        const ny = (e.clientY - r.top) / r.height
        const rx = (ny - 0.5) * maxTilt * 2
        const ry = (nx - 0.5) * maxTilt * -2
        el.style.transform = \`perspective(\${perspective}px) rotateX(\${rx}deg) rotateY(\${ry}deg) scale(\${scale})\`
        el.style.transition = 'transform 0ms'
        const depth = (Math.abs(rx) + Math.abs(ry)) * 0.5
        el.style.boxShadow = \`0 \${10 + depth}px \${28 + depth * 2.5}px rgba(0,0,0,\${(0.08 + depth * 0.007).toFixed(3)})\`
        if (glare && shineRef.current) {
          shineRef.current.style.background = \`radial-gradient(circle at \${nx * 100}% \${ny * 100}%, rgba(255,255,255,0.18) 0%, transparent 62%)\`
          shineRef.current.style.opacity = '1'
        }
      })
    },
    [maxTilt, scale, perspective, glare],
  )

  const onMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const el = cardRef.current
    if (!el) return
    el.style.transform = \`perspective(\${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)\`
    el.style.transition = 'transform 600ms cubic-bezier(0.03,0.98,0.52,0.99), box-shadow 500ms ease'
    el.style.boxShadow = ''
    if (glare && shineRef.current) shineRef.current.style.opacity = '0'
  }, [perspective, glare])

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        ...style,
      }}
    >
      {children}
      {glare && (
        <div
          ref={shineRef}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0,
            transition: 'opacity 200ms ease',
            zIndex: 10,
          }}
        />
      )}
    </div>
  )
}

// Usage:
// <TiltCard style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
//   <YourCard />
// </TiltCard>
`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TiltCardPage() {
  return (
    <main
      style={{
        backgroundColor: 'var(--bg, #ffffff)',
        minHeight: '100vh',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* ── Demo ── */}
      <section
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
          padding: '60px 24px',
          gap: 16,
        }}
      >
        <p
          style={{
            margin: '0 0 8px',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.3)',
          }}
        >
          Tilt Card
        </p>
        <Demo />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-muted, rgba(10,10,10,0.4))',
            marginBottom: '12px',
          }}
        >
          Source
        </p>
        <div
          style={{
            background: '#0a0a0a',
            borderRadius: '12px',
            padding: '20px',
            overflowX: 'auto',
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily:
                'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
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
