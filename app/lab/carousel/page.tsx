'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const SLIDES = [
  { emoji: '🎨', title: 'Design Systems',  desc: 'Build consistent, scalable UIs with shared tokens and reusable components across every surface.',      tag: 'UI/UX',   color: '#4F6EF5', bg: '#EEF2FF' },
  { emoji: '⚡', title: 'Performance',     desc: 'Optimize bundle size, reduce TBT, and ship sub-second experiences users actually stick around for.',     tag: 'Speed',   color: '#E85C2E', bg: '#FFF2EE' },
  { emoji: '🔐', title: 'Security',        desc: 'Auth flows, CSRF guards, CSP headers, and rate limiting — defense in depth from day one.',               tag: 'Safety',  color: '#16A34A', bg: '#EDFBF2' },
  { emoji: '📦', title: 'Bundling',        desc: 'Tree-shake, chunk-split, and lazy-load for smaller payloads that land faster on any network.',           tag: 'DX',      color: '#9333EA', bg: '#F5EEFF' },
  { emoji: '♿', title: 'Accessibility',   desc: 'WCAG 2.1 AA compliant by default — semantic HTML, ARIA patterns, and keyboard nav for every user.',      tag: 'a11y',    color: '#0EA5E9', bg: '#EFF9FF' },
  { emoji: '🚀', title: 'Deployment',      desc: 'From commit to production in seconds. Atomic deploys, instant rollbacks, and preview environments.',     tag: 'DevOps',  color: '#D97706', bg: '#FFFAEB' },
]

// ─── Carousel ─────────────────────────────────────────────────────────────────

function Carousel() {
  const [current, setCurrent] = useState(0)
  const [hovered, setHovered] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, scrollLeft: 0 })

  const goTo = useCallback((idx: number) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(idx, SLIDES.length - 1))
    setCurrent(clamped)
    track.scrollTo({ left: track.clientWidth * clamped, behavior: 'smooth' })
  }, [])

  const prev = useCallback(() => goTo(current === 0 ? SLIDES.length - 1 : current - 1), [current, goTo])
  const next = useCallback(() => goTo(current === SLIDES.length - 1 ? 0 : current + 1), [current, goTo])

  // Auto-advance
  useEffect(() => {
    if (hovered) return
    const id = setInterval(next, 4000)
    return () => clearInterval(id)
  }, [hovered, next])

  // Sync indicator from native scroll
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const idx = Math.round(track.scrollLeft / track.clientWidth)
      setCurrent(Math.max(0, Math.min(idx, SLIDES.length - 1)))
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  // Mouse drag
  const onMouseDown = (e: React.MouseEvent) => {
    const track = trackRef.current
    if (!track) return
    isDragging.current = true
    dragStart.current = { x: e.clientX, scrollLeft: track.scrollLeft }
    track.style.cursor = 'grabbing'
    track.style.scrollSnapType = 'none'
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return
    trackRef.current.scrollLeft = dragStart.current.scrollLeft - (e.clientX - dragStart.current.x)
  }

  const stopDrag = useCallback(() => {
    const track = trackRef.current
    if (!track || !isDragging.current) return
    isDragging.current = false
    track.style.cursor = 'grab'
    track.style.scrollSnapType = 'x mandatory'
    goTo(Math.round(track.scrollLeft / track.clientWidth))
  }, [goTo])

  return (
    <>
      <style>{`.carousel-track::-webkit-scrollbar{display:none}`}</style>
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); stopDrag() }}
      >
        {/* Slide track */}
        <div
          ref={trackRef}
          className="carousel-track"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          style={{
            display: 'flex',
            overflowX: 'scroll',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            borderRadius: '16px',
            cursor: 'grab',
          }}
        >
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              style={{
                flex: '0 0 100%',
                scrollSnapAlign: 'start',
                background: '#ffffff',
                border: '1px solid rgba(10,10,10,0.08)',
                borderRadius: '16px',
                padding: '36px 32px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                boxSizing: 'border-box' as const,
                userSelect: 'none' as const,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: slide.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '26px', flexShrink: 0,
                  }}>
                    {slide.emoji}
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: 600,
                    letterSpacing: '0.04em', textTransform: 'uppercase' as const,
                    color: slide.color, background: slide.bg,
                    padding: '4px 10px', borderRadius: '100px',
                  }}>
                    {slide.tag}
                  </span>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', color: '#0a0a0a', lineHeight: 1.2 }}>
                    {slide.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: 'rgba(10,10,10,0.58)', letterSpacing: '-0.01em', lineHeight: '1.6' }}>
                    {slide.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls row */}
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Expanding dot indicators */}
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={'Go to slide ' + (i + 1)}
                style={{
                  width: current === i ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  border: 'none',
                  background: current === i ? '#0a0a0a' : 'rgba(10,10,10,0.18)',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'width 250ms cubic-bezier(0.32,0.72,0,1), background 200ms ease',
                }}
              />
            ))}
          </div>

          {/* Counter + arrow buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '12px', color: 'rgba(10,10,10,0.35)', fontWeight: 500,
              letterSpacing: '-0.01em', minWidth: '32px', textAlign: 'right' as const,
            }}>
              {current + 1} / {SLIDES.length}
            </span>
            {[
              { label: 'Previous', onClick: prev, d: 'M8 4.5 4.5 8 8 11.5' },
              { label: 'Next',     onClick: next, d: 'M5 4.5 8.5 8 5 11.5' },
            ].map(btn => (
              <button
                key={btn.label}
                onClick={btn.onClick}
                aria-label={btn.label}
                style={{
                  width: '30px', height: '30px',
                  borderRadius: '8px',
                  border: '1px solid rgba(10,10,10,0.1)',
                  background: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  transition: 'background 150ms ease, transform 100ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}
                onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.88)')}
                onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <svg width="12" height="12" viewBox="0 0 13 16" fill="none">
                  <path d={btn.d} stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Hint */}
        <p style={{
          margin: '12px 0 0',
          fontSize: '11px', color: 'rgba(0,0,0,0.3)', fontWeight: 500,
          letterSpacing: '-0.01em', textAlign: 'center' as const,
        }}>
          drag · click dots · ← → keys · auto-advances every 4s
        </p>
      </div>
    </>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const SLIDES = [
  { emoji: '🎨', title: 'Design Systems',  desc: 'Build consistent, scalable UIs with shared tokens.',      tag: 'UI/UX',   color: '#4F6EF5', bg: '#EEF2FF' },
  { emoji: '⚡', title: 'Performance',     desc: 'Optimize bundle size and ship sub-second experiences.',   tag: 'Speed',   color: '#E85C2E', bg: '#FFF2EE' },
  { emoji: '🔐', title: 'Security',        desc: 'Auth flows, CSRF guards, and defense in depth.',          tag: 'Safety',  color: '#16A34A', bg: '#EDFBF2' },
  { emoji: '📦', title: 'Bundling',        desc: 'Tree-shake and lazy-load for smaller builds.',            tag: 'DX',      color: '#9333EA', bg: '#F5EEFF' },
  { emoji: '♿', title: 'Accessibility',   desc: 'WCAG 2.1 AA by default — keyboard nav for every user.',  tag: 'a11y',    color: '#0EA5E9', bg: '#EFF9FF' },
  { emoji: '🚀', title: 'Deployment',      desc: 'Atomic deploys, instant rollbacks, preview envs.',        tag: 'DevOps',  color: '#D97706', bg: '#FFFAEB' },
]

export default function Carousel() {
  const [current, setCurrent] = useState(0)
  const [hovered, setHovered] = useState(false)
  const trackRef = useRef(null)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, scrollLeft: 0 })

  const goTo = useCallback((idx) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(idx, SLIDES.length - 1))
    setCurrent(clamped)
    track.scrollTo({ left: track.clientWidth * clamped, behavior: 'smooth' })
  }, [])

  const prev = useCallback(() => goTo(current === 0 ? SLIDES.length - 1 : current - 1), [current, goTo])
  const next = useCallback(() => goTo(current === SLIDES.length - 1 ? 0 : current + 1), [current, goTo])

  useEffect(() => {
    if (hovered) return
    const id = setInterval(next, 4000)
    return () => clearInterval(id)
  }, [hovered, next])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const idx = Math.round(track.scrollLeft / track.clientWidth)
      setCurrent(Math.max(0, Math.min(idx, SLIDES.length - 1)))
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  const onMouseDown = (e) => {
    const track = trackRef.current
    if (!track) return
    isDragging.current = true
    dragStart.current = { x: e.clientX, scrollLeft: track.scrollLeft }
    track.style.cursor = 'grabbing'
    track.style.scrollSnapType = 'none'
  }

  const onMouseMove = (e) => {
    if (!isDragging.current || !trackRef.current) return
    trackRef.current.scrollLeft = dragStart.current.scrollLeft - (e.clientX - dragStart.current.x)
  }

  const stopDrag = useCallback(() => {
    const track = trackRef.current
    if (!track || !isDragging.current) return
    isDragging.current = false
    track.style.cursor = 'grab'
    track.style.scrollSnapType = 'x mandatory'
    goTo(Math.round(track.scrollLeft / track.clientWidth))
  }, [goTo])

  return (
    <>
      <style>{\`.carousel-track::-webkit-scrollbar{display:none}\`}</style>
      <div
        style={{ width: '100%', maxWidth: '480px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); stopDrag() }}
      >
        <div
          ref={trackRef}
          className="carousel-track"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          style={{ display: 'flex', overflowX: 'scroll', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', borderRadius: '16px', cursor: 'grab' }}
        >
          {SLIDES.map((slide, i) => (
            <div key={i} style={{ flex: '0 0 100%', scrollSnapAlign: 'start', background: '#fff', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '16px', padding: '36px 32px', boxSizing: 'border-box', userSelect: 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: slide.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
                    {slide.emoji}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: slide.color, background: slide.bg, padding: '4px 10px', borderRadius: '100px' }}>
                    {slide.tag}
                  </span>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', color: '#0a0a0a', lineHeight: 1.2 }}>{slide.title}</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: 'rgba(10,10,10,0.58)', letterSpacing: '-0.01em', lineHeight: '1.6' }}>{slide.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{ width: current === i ? '20px' : '6px', height: '6px', borderRadius: '3px', border: 'none', background: current === i ? '#0a0a0a' : 'rgba(10,10,10,0.18)', cursor: 'pointer', padding: 0, transition: 'width 250ms cubic-bezier(0.32,0.72,0,1), background 200ms ease' }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(10,10,10,0.35)', fontWeight: 500, minWidth: '32px', textAlign: 'right' }}>
              {current + 1} / {SLIDES.length}
            </span>
            {[
              { label: 'Prev', onClick: prev, d: 'M8 4.5 4.5 8 8 11.5' },
              { label: 'Next', onClick: next, d: 'M5 4.5 8.5 8 5 11.5' },
            ].map(btn => (
              <button
                key={btn.label}
                onClick={btn.onClick}
                style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid rgba(10,10,10,0.1)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', transition: 'background 150ms ease, transform 100ms ease' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.88)')}
                onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <svg width="12" height="12" viewBox="0 0 13 16" fill="none">
                  <path d={btn.d} stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CarouselPage() {
  return (
    <main style={{ backgroundColor: 'var(--bg, #ffffff)', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>

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
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted, rgba(10,10,10,0.4))', marginBottom: '12px' }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
          <pre style={{ margin: 0, fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace', fontSize: '12px', lineHeight: '1.65', color: '#e5e5e5', whiteSpace: 'pre', overflowX: 'auto' }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
