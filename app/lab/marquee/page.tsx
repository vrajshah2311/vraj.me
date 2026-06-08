'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Data ─────────────────────────────────────────────────────────────────────

const LOGOS = [
  { name: 'React',        dot: '#61DAFB' },
  { name: 'TypeScript',   dot: '#3178C6' },
  { name: 'Next.js',      dot: '#171717' },
  { name: 'Figma',        dot: '#F24E1E' },
  { name: 'Vercel',       dot: '#171717' },
  { name: 'Linear',       dot: '#5E6AD2' },
  { name: 'Stripe',       dot: '#635BFF' },
  { name: 'Tailwind CSS', dot: '#06B6D4' },
  { name: 'GitHub',       dot: '#24292E' },
  { name: 'Prisma',       dot: '#5A67D8' },
  { name: 'Supabase',     dot: '#3ECF8E' },
  { name: 'Notion',       dot: '#171717' },
]

const REVIEWS = [
  { quote: 'Saved us weeks. Copied three of these the same day we found this.', name: 'Mia Torres', role: 'Design Lead, Linear' },
  { quote: "The motion details are chef's kiss — smooth, intentional, never overdone.", name: 'David Kim', role: 'Engineer, Vercel' },
  { quote: 'Finally, components that feel like they belong in a real product.', name: 'Priya Sharma', role: 'Designer, Notion' },
  { quote: 'Outstanding accessibility and interaction detail. Rare to see this quality.', name: 'Elena Vasquez', role: 'Design Systems, Stripe' },
  { quote: 'We replaced our entire component library with these. Zero regrets.', name: 'Tom Eriksson', role: 'CTO, YC W24' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function LogoPill({ name, dot }: { name: string; dot: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '6px 13px 6px 10px', borderRadius: 100,
      background: '#fff', border: '1px solid rgba(10,10,10,0.08)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      fontSize: 13, fontWeight: 500, color: '#0a0a0a',
      letterSpacing: '-0.01em', fontFamily: FONT, whiteSpace: 'nowrap',
      userSelect: 'none',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0, display: 'block' }} />
      {name}
    </div>
  )
}

function ReviewCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div style={{
      width: 210, padding: '13px 15px',
      background: '#fff', borderRadius: 12,
      border: '1px solid rgba(10,10,10,0.07)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
      fontFamily: FONT, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
        {[0,1,2,3,4].map(i => <span key={i} style={{ color: '#F59E0B', fontSize: 11 }}>★</span>)}
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: 1.55 }}>
        &ldquo;{quote}&rdquo;
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%', background: 'rgba(10,10,10,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: 'rgba(10,10,10,0.5)', flexShrink: 0,
        }}>
          {name[0]}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>{name}</p>
          <p style={{ margin: 0, fontSize: 10, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em' }}>{role}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Marquee ──────────────────────────────────────────────────────────────────

function Marquee({
  items,
  speed = 60,
  direction = 'left',
  gap = 12,
  pauseOnHover = true,
  fadeColor = '#EAECF0',
}: {
  items: ReactNode[]
  speed?: number
  direction?: 'left' | 'right'
  gap?: number
  pauseOnHover?: boolean
  fadeColor?: string
}) {
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const [dur, setDur] = useState(30)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    setDur(el.scrollWidth / 2 / speed)
  }, [speed])

  const doubled = [...items, ...items]

  return (
    <div
      style={{ overflow: 'hidden', position: 'relative', width: '100%' }}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 80,
        background: `linear-gradient(to right, ${fadeColor}, transparent)`,
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 80,
        background: `linear-gradient(to left, ${fadeColor}, transparent)`,
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div
        ref={trackRef}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          animationName: direction === 'left' ? 'marquee-scroll-left' : 'marquee-scroll-right',
          animationDuration: `${dur}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationPlayState: paused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {doubled.map((item, i) => (
          <div key={i} style={{ flexShrink: 0, marginRight: gap }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function Demo() {
  const [speed, setSpeed] = useState(55)

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
      <Marquee
        items={LOGOS.map(l => <LogoPill key={l.name} name={l.name} dot={l.dot} />)}
        speed={speed}
        direction="left"
        gap={10}
        fadeColor="#EAECF0"
      />
      <Marquee
        items={REVIEWS.map(r => <ReviewCard key={r.name} {...r} />)}
        speed={speed * 0.5}
        direction="right"
        gap={12}
        fadeColor="#EAECF0"
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, fontFamily: FONT }}>
        <span style={{ fontSize: 12, color: 'rgba(10,10,10,0.4)', fontWeight: 500 }}>Slower</span>
        <input
          type="range" min={15} max={140} value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          style={{ width: 120, cursor: 'pointer', accentColor: '#0a0a0a' }}
        />
        <span style={{ fontSize: 12, color: 'rgba(10,10,10,0.4)', fontWeight: 500 }}>Faster</span>
      </div>
    </div>
  )
}

// ─── Code ─────────────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'

// Self-contained: injects its own keyframes on first mount.

function Marquee({
  items,
  speed = 60,
  direction = 'left',
  gap = 12,
  pauseOnHover = true,
  fadeColor = '#ffffff',
}: {
  items: ReactNode[]
  speed?: number
  direction?: 'left' | 'right'
  gap?: number
  pauseOnHover?: boolean
  fadeColor?: string
}) {
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const [dur, setDur] = useState(30)

  useEffect(() => {
    // Inject keyframes once
    const id = '__marquee_styles__'
    if (!document.getElementById(id)) {
      const s = document.createElement('style')
      s.id = id
      s.textContent =
        '@keyframes marquee-scroll-left{from{transform:translateX(0)}to{transform:translateX(-50%)}}' +
        '@keyframes marquee-scroll-right{from{transform:translateX(-50%)}to{transform:translateX(0)}}'
      document.head.appendChild(s)
    }
    const el = trackRef.current
    if (el) setDur(el.scrollWidth / 2 / speed)
  }, [speed])

  const doubled = [...items, ...items]

  return (
    <div
      style={{ overflow: 'hidden', position: 'relative', width: '100%' }}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      {/* Fade edges — set fadeColor to match your background */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 80, zIndex: 2, pointerEvents: 'none', background: \`linear-gradient(to right, \${fadeColor}, transparent)\` }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 80, zIndex: 2, pointerEvents: 'none', background: \`linear-gradient(to left, \${fadeColor}, transparent)\` }} />

      <div
        ref={trackRef}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          animationName: direction === 'left' ? 'marquee-scroll-left' : 'marquee-scroll-right',
          animationDuration: \`\${dur}s\`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationPlayState: paused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {doubled.map((item, i) => (
          <div key={i} style={{ flexShrink: 0, marginRight: gap }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Usage ────────────────────────────────────────────────────────────────────

export default function App() {
  const logos = ['React', 'TypeScript', 'Next.js', 'Figma', 'Vercel', 'Linear', 'Stripe']

  return (
    <div style={{ background: '#f5f5f5', padding: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Left-scrolling logo strip */}
      <Marquee
        items={logos.map(name => (
          <div key={name} style={{
            padding: '6px 14px', background: '#fff', borderRadius: 100,
            border: '1px solid rgba(0,0,0,0.08)', fontSize: 13, fontWeight: 500,
            whiteSpace: 'nowrap',
          }}>
            {name}
          </div>
        ))}
        speed={60}
        direction="left"
        gap={12}
        pauseOnHover
        fadeColor="#f5f5f5"
      />

      {/* Right-scrolling at half speed */}
      <Marquee
        items={logos.map(name => (
          <div key={name} style={{
            padding: '6px 14px', background: '#fff', borderRadius: 100,
            border: '1px solid rgba(0,0,0,0.08)', fontSize: 13, fontWeight: 500,
            whiteSpace: 'nowrap',
          }}>
            {name}
          </div>
        ))}
        speed={30}
        direction="right"
        gap={12}
        pauseOnHover
        fadeColor="#f5f5f5"
      />
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarqueePage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>
      <style>{`
        @keyframes marquee-scroll-left  { from { transform: translateX(0);    } to { transform: translateX(-50%); } }
        @keyframes marquee-scroll-right { from { transform: translateX(-50%); } to { transform: translateX(0);    } }
      `}</style>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 0 40px',
      }}>
        <Demo />
        <p style={{
          marginTop: 20, fontSize: 12, color: 'rgba(0,0,0,0.35)',
          fontWeight: 500, letterSpacing: '-0.01em', fontFamily: FONT,
        }}>
          Hover either row to pause · drag to change speed
        </p>
      </section>

      {/* ── Code ── */}
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
