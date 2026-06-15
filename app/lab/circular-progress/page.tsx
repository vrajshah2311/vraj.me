'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── useAnimatedValue ─────────────────────────────────────────────────────────

function useAnimatedValue(target: number, duration = 900, easing = cubicOut): number {
  const [current, setCurrent] = useState(0)
  const startRef = useRef<number | null>(null)
  const fromRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    fromRef.current = current
    startRef.current = null
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const t = Math.min(1, (ts - startRef.current) / duration)
      const ease = easing(t)
      setCurrent(fromRef.current + (target - fromRef.current) * ease)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target]) // eslint-disable-line react-hooks/exhaustive-deps

  return current
}

function cubicOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// ─── CircularProgress ─────────────────────────────────────────────────────────

interface CircularProgressProps {
  value: number            // 0–100
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  label?: string
  sublabel?: string
  animate?: boolean
  cap?: 'round' | 'butt'
}

function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  color = '#0a0a0a',
  trackColor = 'rgba(10,10,10,0.07)',
  label,
  sublabel,
  animate = true,
  cap = 'round',
}: CircularProgressProps) {
  const animated = useAnimatedValue(animate ? value : value, 1000)
  const displayValue = animate ? animated : value

  const r = (size - strokeWidth) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (displayValue / 100) * circumference

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap={cap}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 30ms linear' }}
        />
      </svg>
      {(label !== undefined) && (
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, userSelect: 'none' }}>
          <div style={{ fontFamily: FONT, fontSize: size / 5.5, fontWeight: 600, letterSpacing: '-0.03em', color: '#0a0a0a', lineHeight: 1 }}>
            {label}
          </div>
          {sublabel && (
            <div style={{ fontFamily: FONT, fontSize: size / 9, fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em', marginTop: 2 }}>
              {sublabel}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── MultiRing ────────────────────────────────────────────────────────────────

interface RingConfig {
  value: number
  color: string
  label: string
}

function MultiRing({ rings, size = 160, gap = 12, strokeWidth = 10 }: {
  rings: RingConfig[]
  size?: number
  gap?: number
  strokeWidth?: number
}) {
  const maxRings = rings.length
  const totalTrackWidth = maxRings * (strokeWidth + gap) - gap
  const outerR = (size - strokeWidth) / 2
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
        {rings.map((ring, i) => {
          const r = outerR - i * (strokeWidth + gap)
          const cx = size / 2
          const cy = size / 2
          const circumference = 2 * Math.PI * r
          const animated = ring.value
          const offset = circumference - (animated / 100) * circumference
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={ring.color + '18'} strokeWidth={strokeWidth} />
              <circle
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={ring.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)' }}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function Demo() {
  const [mounted, setMounted] = useState(false)
  const [countdownValue, setCountdownValue] = useState(100)
  const [isRunning, setIsRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(30)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [fitnessRings, setFitnessRings] = useState([
    { value: 78, color: '#ef4444', label: 'Move' },
    { value: 62, color: '#f97316', label: 'Exercise' },
    { value: 91, color: '#22c55e', label: 'Stand' },
  ])

  const [metrics, setMetrics] = useState([
    { label: 'CPU', sublabel: 'usage', value: 67, color: '#6366f1' },
    { label: 'RAM', sublabel: 'used', value: 42, color: '#0ea5e9' },
    { label: 'Disk', sublabel: 'free', value: 23, color: '#f59e0b' },
  ])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!)
            setIsRunning(false)
            setCountdownValue(0)
            return 0
          }
          const next = s - 1
          setCountdownValue(Math.round((next / 30) * 100))
          return next
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning])

  const resetCountdown = () => {
    setIsRunning(false)
    setSecondsLeft(30)
    setCountdownValue(100)
  }

  const shuffleMetrics = () => {
    setMetrics(m => m.map(item => ({
      ...item,
      value: 15 + Math.floor(Math.random() * 80),
    })))
  }

  const shuffleFitness = () => {
    setFitnessRings(r => r.map(item => ({
      ...item,
      value: 30 + Math.floor(Math.random() * 65),
    })))
  }

  if (!mounted) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', width: '100%', maxWidth: 520 }}>

      {/* ── Metrics row ── */}
      <div style={{
        width: '100%',
        background: '#fff',
        borderRadius: 16,
        border: '1px solid rgba(10,10,10,0.08)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.05)',
        padding: '24px',
        fontFamily: FONT,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>System Health</div>
          <button
            onClick={shuffleMetrics}
            style={{
              background: 'rgba(10,10,10,0.05)',
              border: '1px solid rgba(10,10,10,0.08)',
              borderRadius: 8,
              padding: '5px 12px',
              fontSize: 12,
              fontWeight: 500,
              color: 'rgba(10,10,10,0.6)',
              cursor: 'pointer',
              fontFamily: FONT,
              letterSpacing: '-0.01em',
              transition: 'background 150ms ease, color 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,10,10,0.09)'; e.currentTarget.style.color = '#0a0a0a' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(10,10,10,0.05)'; e.currentTarget.style.color = 'rgba(10,10,10,0.6)' }}
          >
            Refresh
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {metrics.map(m => (
            <div key={m.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <CircularProgress
                value={m.value}
                size={90}
                strokeWidth={7}
                color={m.color}
                label={`${Math.round(m.value)}%`}
                sublabel={m.sublabel}
              />
              <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(10,10,10,0.5)', letterSpacing: '-0.01em' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Fitness rings + countdown row ── */}
      <div style={{ display: 'flex', gap: 16, width: '100%' }}>

        {/* Fitness rings */}
        <div style={{
          flex: 1,
          background: '#0a0a0a',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '20px',
          fontFamily: FONT,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>Activity</div>
            <button
              onClick={shuffleFitness}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                fontFamily: FONT,
                letterSpacing: '-0.01em',
                transition: 'background 150ms ease, color 150ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
            >
              Shuffle
            </button>
          </div>

          <MultiRing rings={fitnessRings} size={148} strokeWidth={11} gap={10} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
            {fitnessRings.map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.01em', flex: 1 }}>{r.label}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>{r.value}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Countdown timer */}
        <div style={{
          flex: 1,
          background: '#fff',
          borderRadius: 16,
          border: '1px solid rgba(10,10,10,0.08)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.05)',
          padding: '20px',
          fontFamily: FONT,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{ width: '100%', fontSize: 13, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>Countdown</div>

          <CircularProgress
            value={countdownValue}
            size={148}
            strokeWidth={7}
            color={secondsLeft > 10 ? '#0a0a0a' : secondsLeft > 5 ? '#f59e0b' : '#ef4444'}
            trackColor="rgba(10,10,10,0.06)"
            label={`${secondsLeft}s`}
            sublabel={isRunning ? 'running' : secondsLeft === 0 ? 'done' : 'paused'}
            animate={false}
          />

          <div style={{ display: 'flex', gap: 8, width: '100%' }}>
            <button
              onClick={() => setIsRunning(r => !r)}
              disabled={secondsLeft === 0}
              style={{
                flex: 1,
                background: '#0a0a0a',
                border: 'none',
                borderRadius: 9,
                padding: '9px',
                fontSize: 12,
                fontWeight: 600,
                color: '#fff',
                cursor: secondsLeft === 0 ? 'not-allowed' : 'pointer',
                fontFamily: FONT,
                letterSpacing: '-0.01em',
                opacity: secondsLeft === 0 ? 0.35 : 1,
                transition: 'opacity 150ms ease, background 150ms ease',
              }}
              onMouseEnter={e => { if (secondsLeft > 0) e.currentTarget.style.background = '#333' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0a0a0a' }}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetCountdown}
              style={{
                flex: 1,
                background: 'rgba(10,10,10,0.05)',
                border: '1px solid rgba(10,10,10,0.08)',
                borderRadius: 9,
                padding: '9px',
                fontSize: 12,
                fontWeight: 500,
                color: 'rgba(10,10,10,0.6)',
                cursor: 'pointer',
                fontFamily: FONT,
                letterSpacing: '-0.01em',
                transition: 'background 150ms ease, color 150ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,10,10,0.09)'; e.currentTarget.style.color = '#0a0a0a' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(10,10,10,0.05)'; e.currentTarget.style.color = 'rgba(10,10,10,0.6)' }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* ── Size showcase ── */}
      <div style={{
        width: '100%',
        background: '#fff',
        borderRadius: 16,
        border: '1px solid rgba(10,10,10,0.08)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.05)',
        padding: '24px',
        fontFamily: FONT,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', marginBottom: 24 }}>Sizes & Styles</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 12, flexWrap: 'wrap' }}>
          <CircularProgress value={82} size={40} strokeWidth={4} color="#0a0a0a" cap="butt" />
          <CircularProgress value={65} size={56} strokeWidth={5} color="#6366f1" label="65%" />
          <CircularProgress value={91} size={80} strokeWidth={6} color="#22c55e" label="91%" sublabel="done" />
          <CircularProgress value={47} size={100} strokeWidth={8} color="#f59e0b" label="47%" sublabel="halfway" />
          <CircularProgress value={33} size={48} strokeWidth={5} color="#ef4444" cap="round" />
        </div>
      </div>

    </div>
  )
}

// ─── Source code string ───────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useEffect, useRef } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ── Easing ────────────────────────────────────────────────────────────────────

function cubicOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// ── useAnimatedValue ──────────────────────────────────────────────────────────

function useAnimatedValue(target: number, duration = 900): number {
  const [current, setCurrent] = useState(0)
  const startRef = useRef<number | null>(null)
  const fromRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    fromRef.current = current
    startRef.current = null
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const t = Math.min(1, (ts - startRef.current) / duration)
      setCurrent(fromRef.current + (target - fromRef.current) * cubicOut(t))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target]) // eslint-disable-line react-hooks/exhaustive-deps
  return current
}

// ── CircularProgress ──────────────────────────────────────────────────────────

interface CircularProgressProps {
  value: number          // 0–100
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  label?: string
  sublabel?: string
  animate?: boolean
  cap?: 'round' | 'butt'
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  color = '#0a0a0a',
  trackColor = 'rgba(10,10,10,0.07)',
  label,
  sublabel,
  animate = true,
  cap = 'round',
}: CircularProgressProps) {
  const animated = useAnimatedValue(value, 900)
  const displayValue = animate ? animated : value

  const r = (size - strokeWidth) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (displayValue / 100) * circumference

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap={cap}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 30ms linear' }}
        />
      </svg>
      {label !== undefined && (
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, userSelect: 'none' }}>
          <div style={{ fontFamily: FONT, fontSize: size / 5.5, fontWeight: 600, letterSpacing: '-0.03em', color: '#0a0a0a', lineHeight: 1 }}>
            {label}
          </div>
          {sublabel && (
            <div style={{ fontFamily: FONT, fontSize: size / 9, fontWeight: 500, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em', marginTop: 2 }}>
              {sublabel}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── MultiRing ─────────────────────────────────────────────────────────────────

interface RingConfig { value: number; color: string; label: string }

export function MultiRing({ rings, size = 160, gap = 12, strokeWidth = 10 }: {
  rings: RingConfig[]; size?: number; gap?: number; strokeWidth?: number
}) {
  const outerR = (size - strokeWidth) / 2
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute', inset: 0 }}>
        {rings.map((ring, i) => {
          const r = outerR - i * (strokeWidth + gap)
          const cx = size / 2
          const circumference = 2 * Math.PI * r
          const offset = circumference - (ring.value / 100) * circumference
          return (
            <g key={i}>
              <circle cx={cx} cy={cx} r={r} fill="none" stroke={ring.color + '18'} strokeWidth={strokeWidth} />
              <circle
                cx={cx} cy={cx} r={r} fill="none" stroke={ring.color}
                strokeWidth={strokeWidth} strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)' }}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ── Usage ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [progress, setProgress] = useState(72)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 24, fontFamily: FONT }}>

      {/* Single ring */}
      <CircularProgress
        value={progress}
        size={120}
        strokeWidth={8}
        color="#6366f1"
        label={\`\${Math.round(progress)}%\`}
        sublabel="complete"
      />

      {/* Multi rings (fitness style) */}
      <MultiRing
        size={160}
        strokeWidth={11}
        gap={10}
        rings={[
          { value: 78, color: '#ef4444', label: 'Move' },
          { value: 62, color: '#f97316', label: 'Exercise' },
          { value: 91, color: '#22c55e', label: 'Stand' },
        ]}
      />
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CircularProgressPage() {
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
        <p style={{
          marginTop: 28,
          fontSize: 12,
          color: 'rgba(0,0,0,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily: FONT,
          textAlign: 'center',
        }}>
          SVG ring progress · animated value interpolation · multi-ring variant · countdown mode
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
          fontFamily: FONT,
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
