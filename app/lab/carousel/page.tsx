'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const SLIDES = [
  { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', title: 'Design Systems', sub: 'Build once, use everywhere' },
  { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', title: 'Motion Design', sub: 'Bring interfaces to life' },
  { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', title: 'Interaction', sub: 'Delight in every click' },
  { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', title: 'Typography', sub: 'Words that breathe' },
  { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', title: 'Color Theory', sub: 'Emotion through palette' },
]

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Nav Button ───────────────────────────────────────────────────────────────

function NavBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        border: '1px solid rgba(10,10,10,0.1)',
        background: '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: disabled ? 'rgba(10,10,10,0.2)' : '#0a0a0a',
        fontSize: 14,
        transition: 'background 150ms ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
        fontFamily: font,
        flexShrink: 0,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(10,10,10,0.04)' }}
      onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
    >
      {children}
    </button>
  )
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

function Carousel() {
  const [index, setIndex] = useState(0)
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [width, setWidth] = useState(540)

  const containerRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)
  const startXRef = useRef(0)
  const lastXRef = useRef(0)
  const lastTRef = useRef(0)
  const velRef = useRef(0)
  const offsetRef = useRef(0)

  const n = SLIDES.length

  useEffect(() => { indexRef.current = index }, [index])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    setWidth(el.offsetWidth)
    return () => ro.disconnect()
  }, [])

  const goTo = useCallback((i: number) => {
    const c = Math.max(0, Math.min(n - 1, i))
    indexRef.current = c
    setIndex(c)
    offsetRef.current = 0
    setOffset(0)
    setDragging(false)
  }, [n])

  useEffect(() => {
    if (!dragging) return

    const move = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX
      const now = Date.now()
      const dt = now - lastTRef.current
      if (dt > 0) velRef.current = (x - lastXRef.current) / dt
      lastXRef.current = x
      lastTRef.current = now
      let d = x - startXRef.current
      const i = indexRef.current
      if ((i === 0 && d > 0) || (i === n - 1 && d < 0)) d *= 0.25
      offsetRef.current = d
      setOffset(d)
    }

    const up = () => {
      const w = containerRef.current?.offsetWidth ?? 540
      const vel = velRef.current
      const off = offsetRef.current
      const i = indexRef.current
      if (vel > 0.4 || off > w * 0.3) goTo(i - 1)
      else if (vel < -0.4 || off < -w * 0.3) goTo(i + 1)
      else goTo(i)
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', move, { passive: true })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', up)
    }
  }, [dragging, goTo, n])

  const dragStart = (x: number) => {
    startXRef.current = x
    lastXRef.current = x
    lastTRef.current = Date.now()
    velRef.current = 0
    setDragging(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%', maxWidth: 520, fontFamily: font }}>

      {/* Viewport */}
      <div
        ref={containerRef}
        onMouseDown={e => { e.preventDefault(); dragStart(e.clientX) }}
        onTouchStart={e => dragStart(e.touches[0].clientX)}
        style={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: 16,
          cursor: dragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          boxShadow: '0 2px 16px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            display: 'flex',
            transform: `translateX(${-(index * width) + offset}px)`,
            transition: dragging ? 'none' : 'transform 380ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
          }}
        >
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width,
                height: 260,
                background: slide.bg,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '28px 28px 24px',
                boxSizing: 'border-box',
                pointerEvents: 'none',
              }}
            >
              <span style={{
                display: 'block',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: 8,
              }}>
                {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
              </span>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                {slide.title}
              </h2>
              <p style={{ margin: '6px 0 0', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.65)', letterSpacing: '-0.01em' }}>
                {slide.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <NavBtn onClick={() => goTo(index - 1)} disabled={index === 0}>←</NavBtn>

        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === index ? 18 : 6,
                height: 6,
                borderRadius: 99,
                background: i === index ? '#0a0a0a' : 'rgba(10,10,10,0.18)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 280ms cubic-bezier(0.34, 1.56, 0.64, 1), background 200ms ease',
              }}
            />
          ))}
        </div>

        <NavBtn onClick={() => goTo(index + 1)} disabled={index === n - 1}>→</NavBtn>
      </div>

      <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: 'rgba(10,10,10,0.3)', letterSpacing: '-0.01em' }}>
        Drag or swipe · tap arrows or dots to navigate
      </p>
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const SLIDES = [
  { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', title: 'Design Systems', sub: 'Build once, use everywhere' },
  { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', title: 'Motion Design', sub: 'Bring interfaces to life' },
  { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', title: 'Interaction', sub: 'Delight in every click' },
  { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', title: 'Typography', sub: 'Words that breathe' },
  { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', title: 'Color Theory', sub: 'Emotion through palette' },
]

function NavBtn({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 30, height: 30, borderRadius: '50%',
        border: '1px solid rgba(10,10,10,0.1)', background: '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: disabled ? 'rgba(10,10,10,0.2)' : '#0a0a0a',
        fontSize: 14, transition: 'background 150ms ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(10,10,10,0.04)' }}
      onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
    >
      {children}
    </button>
  )
}

export function Carousel() {
  const [index, setIndex] = useState(0)
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [width, setWidth] = useState(540)

  const containerRef = useRef(null)
  const indexRef = useRef(0)
  const startXRef = useRef(0)
  const lastXRef = useRef(0)
  const lastTRef = useRef(0)
  const velRef = useRef(0)
  const offsetRef = useRef(0)
  const n = SLIDES.length

  useEffect(() => { indexRef.current = index }, [index])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    setWidth(el.offsetWidth)
    return () => ro.disconnect()
  }, [])

  const goTo = useCallback((i) => {
    const c = Math.max(0, Math.min(n - 1, i))
    indexRef.current = c
    setIndex(c)
    offsetRef.current = 0
    setOffset(0)
    setDragging(false)
  }, [n])

  useEffect(() => {
    if (!dragging) return

    const move = (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX
      const now = Date.now()
      const dt = now - lastTRef.current
      if (dt > 0) velRef.current = (x - lastXRef.current) / dt
      lastXRef.current = x
      lastTRef.current = now
      let d = x - startXRef.current
      const i = indexRef.current
      if ((i === 0 && d > 0) || (i === n - 1 && d < 0)) d *= 0.25
      offsetRef.current = d
      setOffset(d)
    }

    const up = () => {
      const w = containerRef.current?.offsetWidth ?? 540
      const vel = velRef.current, off = offsetRef.current, i = indexRef.current
      if (vel > 0.4 || off > w * 0.3) goTo(i - 1)
      else if (vel < -0.4 || off < -w * 0.3) goTo(i + 1)
      else goTo(i)
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', move, { passive: true })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', up)
    }
  }, [dragging, goTo, n])

  const dragStart = (x) => {
    startXRef.current = x; lastXRef.current = x
    lastTRef.current = Date.now(); velRef.current = 0
    setDragging(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%', maxWidth: 520 }}>
      <div
        ref={containerRef}
        onMouseDown={e => { e.preventDefault(); dragStart(e.clientX) }}
        onTouchStart={e => dragStart(e.touches[0].clientX)}
        style={{
          width: '100%', overflow: 'hidden', borderRadius: 16,
          cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none',
          boxShadow: '0 2px 16px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{
          display: 'flex',
          transform: \`translateX(\${-(index * width) + offset}px)\`,
          transition: dragging ? 'none' : 'transform 380ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform',
        }}>
          {SLIDES.map((slide, i) => (
            <div key={i} style={{
              flexShrink: 0, width, height: 260,
              background: slide.bg,
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              padding: '28px 28px 24px', boxSizing: 'border-box', pointerEvents: 'none',
            }}>
              <span style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
              </span>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{slide.title}</h2>
              <p style={{ margin: '6px 0 0', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.65)', letterSpacing: '-0.01em' }}>{slide.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <NavBtn onClick={() => goTo(index - 1)} disabled={index === 0}>←</NavBtn>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === index ? 18 : 6, height: 6, borderRadius: 99,
              background: i === index ? '#0a0a0a' : 'rgba(10,10,10,0.18)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'width 280ms cubic-bezier(0.34, 1.56, 0.64, 1), background 200ms ease',
            }} />
          ))}
        </div>
        <NavBtn onClick={() => goTo(index + 1)} disabled={index === n - 1}>→</NavBtn>
      </div>

      <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: 'rgba(10,10,10,0.3)', letterSpacing: '-0.01em' }}>
        Drag or swipe · tap arrows or dots to navigate
      </p>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CarouselPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: font }}>

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
        <Carousel />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: 760, margin: '0 auto' }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)', marginBottom: 12 }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 20, overflowX: 'auto' }}>
          <pre style={{ margin: 0, fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace', fontSize: 12, lineHeight: 1.65, color: '#e5e5e5', whiteSpace: 'pre', overflowX: 'auto' }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
