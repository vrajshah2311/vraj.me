'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'
const SWIPE_THRESHOLD = 80
const ROTATION_FACTOR = 0.12

// ─── Types ────────────────────────────────────────────────────────────────────

interface Card {
  id: number
  emoji: string
  title: string
  description: string
  accent: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_CARDS: Card[] = [
  { id: 1, emoji: '🚀', title: 'Ship faster', description: 'Build and deploy features in hours, not weeks. Keep the feedback loop tight.', accent: '#7c3aed' },
  { id: 2, emoji: '🎨', title: 'Design with intent', description: 'Every pixel has a purpose. Craft interfaces that feel inevitable, not accidental.', accent: '#0369a1' },
  { id: 3, emoji: '⚡', title: 'Performance first', description: 'Sub-100ms interactions. Optimistic updates. No spinner should ever be visible.', accent: '#b45309' },
  { id: 4, emoji: '🔒', title: 'Security by default', description: 'Auth, permissions, and data isolation baked in from day one — never bolted on later.', accent: '#15803d' },
  { id: 5, emoji: '🧩', title: 'Composable systems', description: 'Small, focused primitives that snap together cleanly. No god objects, no magic.', accent: '#be123c' },
]

// ─── Swipe Card ───────────────────────────────────────────────────────────────

function SwipeCard({
  card,
  index,
  total,
  onSwipe,
}: {
  card: Card
  index: number
  total: number
  onSwipe: (id: number, dir: 'left' | 'right') => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<{ x: number; y: number } | null>(null)
  const currentRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [gone, setGone] = useState<'left' | 'right' | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  const isTop = index === total - 1
  const stackOffset = (total - 1 - index) // 0 = top, increases toward back
  const maxStack = 3

  const release = useCallback(() => {
    if (!isTop) return
    const dx = currentRef.current.x
    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      const dir = dx > 0 ? 'right' : 'left'
      setGone(dir)
      setTimeout(() => onSwipe(card.id, dir), 350)
    } else {
      // Spring back
      setPos({ x: 0, y: 0 })
    }
    setDragging(false)
    startRef.current = null
  }, [isTop, card.id, onSwipe])

  // Pointer events
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!isTop) return
    e.currentTarget.setPointerCapture(e.pointerId)
    startRef.current = { x: e.clientX, y: e.clientY }
    currentRef.current = { x: 0, y: 0 }
    setDragging(true)
  }, [isTop])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!startRef.current || !isTop) return
    const dx = e.clientX - startRef.current.x
    const dy = e.clientY - startRef.current.y
    currentRef.current = { x: dx, y: dy }
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      setPos({ x: dx, y: dy })
    })
  }, [isTop])

  const onPointerUp = useCallback(() => {
    if (!isTop) return
    release()
  }, [isTop, release])

  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  // Compute transform
  const rotation = isTop ? pos.x * ROTATION_FACTOR : 0
  const stackScale = 1 - Math.min(stackOffset, maxStack) * 0.045
  const stackY = Math.min(stackOffset, maxStack) * 10

  let tx = pos.x
  let ty = pos.y
  let scale = isTop ? 1 : stackScale
  let rotate = rotation

  if (gone) {
    tx = gone === 'right' ? 600 : -600
    ty = pos.y + 100
    rotate = gone === 'right' ? 30 : -30
    scale = 0.85
  }

  // Direction hint opacity
  const swipeProgress = Math.min(Math.abs(pos.x) / SWIPE_THRESHOLD, 1)
  const hintRight = pos.x > 0 ? swipeProgress : 0
  const hintLeft = pos.x < 0 ? swipeProgress : 0

  if (stackOffset > maxStack) return null

  return (
    <div
      ref={cardRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: index,
        cursor: isTop ? (dragging ? 'grabbing' : 'grab') : 'default',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          width: '300px',
          background: '#fff',
          borderRadius: '20px',
          border: '1px solid rgba(10,10,10,0.08)',
          boxShadow: isTop
            ? '0 4px 8px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.10)'
            : '0 2px 8px rgba(0,0,0,0.06)',
          padding: '28px 24px 24px',
          fontFamily: FONT,
          transform: `translate(${tx}px, ${ty}px) rotate(${rotate}deg) scale(${scale})`,
          transformOrigin: 'center 120%',
          transition: dragging || gone
            ? (gone ? 'transform 350ms cubic-bezier(0.32, 0.72, 0, 1), opacity 350ms ease' : 'none')
            : 'transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          opacity: gone ? 0 : 1,
          willChange: 'transform',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Swipe hint overlays */}
        {isTop && (
          <>
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '20px',
              background: 'rgba(22,163,74,0.12)',
              border: '2px solid rgba(22,163,74,0.4)',
              opacity: hintRight,
              transition: 'opacity 60ms ease',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '20px',
              background: 'rgba(220,38,38,0.10)',
              border: '2px solid rgba(220,38,38,0.35)',
              opacity: hintLeft,
              transition: 'opacity 60ms ease',
              pointerEvents: 'none',
            }} />
            {/* Like / Nope labels */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              padding: '4px 10px',
              border: '2px solid #16a34a',
              borderRadius: '6px',
              color: '#16a34a',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              opacity: hintRight,
              transform: `rotate(-12deg)`,
              pointerEvents: 'none',
            }}>Keep</div>
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '4px 10px',
              border: '2px solid #dc2626',
              borderRadius: '6px',
              color: '#dc2626',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              opacity: hintLeft,
              transform: `rotate(12deg)`,
              pointerEvents: 'none',
            }}>Skip</div>
          </>
        )}

        {/* Accent dot */}
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: card.accent,
          marginBottom: '20px',
        }} />

        {/* Emoji */}
        <div style={{ fontSize: '40px', lineHeight: 1, marginBottom: '16px' }}>
          {card.emoji}
        </div>

        {/* Content */}
        <h3 style={{
          margin: '0 0 8px',
          fontSize: '17px',
          fontWeight: 600,
          color: '#0a0a0a',
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
        }}>
          {card.title}
        </h3>
        <p style={{
          margin: 0,
          fontSize: '13px',
          fontWeight: 500,
          color: 'rgba(10,10,10,0.55)',
          letterSpacing: '-0.01em',
          lineHeight: 1.6,
        }}>
          {card.description}
        </p>

        {/* Card counter */}
        <div style={{
          marginTop: '24px',
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              width: i === index ? '16px' : '5px',
              height: '5px',
              borderRadius: '3px',
              background: i === index ? card.accent : 'rgba(10,10,10,0.12)',
              transition: 'width 200ms ease, background 200ms ease',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Swipe Cards Demo ─────────────────────────────────────────────────────────

function SwipeCardsDemo() {
  const [cards, setCards] = useState(INITIAL_CARDS)
  const [history, setHistory] = useState<{ id: number; dir: 'left' | 'right' }[]>([])
  const [finished, setFinished] = useState(false)

  const handleSwipe = useCallback((id: number, dir: 'left' | 'right') => {
    setHistory(h => [...h, { id, dir }])
    setCards(prev => {
      const next = prev.filter(c => c.id !== id)
      if (next.length === 0) setFinished(true)
      return next
    })
  }, [])

  const handleReset = () => {
    setCards(INITIAL_CARDS)
    setHistory([])
    setFinished(false)
  }

  const handleUndo = () => {
    if (history.length === 0) return
    const last = history[history.length - 1]
    const card = INITIAL_CARDS.find(c => c.id === last.id)
    if (!card) return
    setHistory(h => h.slice(0, -1))
    setCards(prev => {
      const next = [...prev, card]
      return next.sort((a, b) => a.id - b.id)
    })
    setFinished(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
      {/* Card stack */}
      <div style={{
        position: 'relative',
        width: '300px',
        height: '280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {finished ? (
          <div style={{
            textAlign: 'center',
            fontFamily: FONT,
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
            <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
              All done
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(10,10,10,0.45)', fontWeight: 500 }}>
              You reviewed all cards
            </p>
          </div>
        ) : (
          cards.map((card, i) => (
            <SwipeCard
              key={card.id}
              card={card}
              index={i}
              total={cards.length}
              onSwipe={handleSwipe}
            />
          ))
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={() => {
            if (cards.length === 0) return
            handleSwipe(cards[cards.length - 1].id, 'left')
          }}
          disabled={cards.length === 0}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '1px solid rgba(10,10,10,0.10)',
            background: '#fff',
            cursor: cards.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: cards.length === 0 ? 0.35 : 1,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            transition: 'transform 100ms ease, box-shadow 100ms ease',
            fontFamily: FONT,
          }}
          onMouseEnter={e => { if (cards.length > 0) (e.currentTarget.style.transform = 'scale(1.08)') }}
          onMouseLeave={e => { (e.currentTarget.style.transform = 'scale(1)') }}
          title="Skip"
        >
          ✕
        </button>

        <button
          onClick={handleUndo}
          disabled={history.length === 0}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: '1px solid rgba(10,10,10,0.10)',
            background: '#fff',
            cursor: history.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            color: '#0a0a0a',
            letterSpacing: '-0.01em',
            fontFamily: FONT,
            opacity: history.length === 0 ? 0.35 : 1,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={e => { if (history.length > 0) (e.currentTarget.style.background = 'rgba(10,10,10,0.04)') }}
          onMouseLeave={e => { (e.currentTarget.style.background = '#fff') }}
        >
          Undo
        </button>

        <button
          onClick={() => {
            if (cards.length === 0) return
            handleSwipe(cards[cards.length - 1].id, 'right')
          }}
          disabled={cards.length === 0}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '1px solid rgba(10,10,10,0.10)',
            background: '#fff',
            cursor: cards.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: cards.length === 0 ? 0.35 : 1,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            transition: 'transform 100ms ease, box-shadow 100ms ease',
            fontFamily: FONT,
          }}
          onMouseEnter={e => { if (cards.length > 0) (e.currentTarget.style.transform = 'scale(1.08)') }}
          onMouseLeave={e => { (e.currentTarget.style.transform = 'scale(1)') }}
          title="Keep"
        >
          ♥
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '300px' }}>
          {history.map(h => {
            const card = INITIAL_CARDS.find(c => c.id === h.id)
            return (
              <span key={h.id} style={{
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 600,
                fontFamily: FONT,
                letterSpacing: '-0.01em',
                background: h.dir === 'right' ? 'rgba(22,163,74,0.10)' : 'rgba(220,38,38,0.08)',
                color: h.dir === 'right' ? '#16a34a' : '#dc2626',
                border: `1px solid ${h.dir === 'right' ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.15)'}`,
              }}>
                {h.dir === 'right' ? '♥' : '✕'} {card?.title}
              </span>
            )
          })}
        </div>
      )}

      <button
        onClick={handleReset}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 500,
          color: 'rgba(10,10,10,0.4)',
          fontFamily: FONT,
          letterSpacing: '-0.01em',
          transition: 'color 150ms ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#0a0a0a')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(10,10,10,0.4)')}
      >
        Reset
      </button>
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'
const SWIPE_THRESHOLD = 80
const ROTATION_FACTOR = 0.12

interface Card {
  id: number
  emoji: string
  title: string
  description: string
  accent: string
}

const CARDS: Card[] = [
  { id: 1, emoji: '🚀', title: 'Ship faster', description: 'Build and deploy features in hours, not weeks.', accent: '#7c3aed' },
  { id: 2, emoji: '🎨', title: 'Design with intent', description: 'Every pixel has a purpose.', accent: '#0369a1' },
  { id: 3, emoji: '⚡', title: 'Performance first', description: 'Sub-100ms interactions. No spinner ever.', accent: '#b45309' },
]

function SwipeCard({ card, index, total, onSwipe }: {
  card: Card; index: number; total: number; onSwipe: (id: number, dir: 'left' | 'right') => void
}) {
  const startRef = useRef<{ x: number; y: number } | null>(null)
  const currentRef = useRef({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [gone, setGone] = useState<'left' | 'right' | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const isTop = index === total - 1

  const release = useCallback(() => {
    if (!isTop) return
    const dx = currentRef.current.x
    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      const dir = dx > 0 ? 'right' : 'left'
      setGone(dir)
      setTimeout(() => onSwipe(card.id, dir), 350)
    } else {
      setPos({ x: 0, y: 0 })
    }
    setDragging(false)
    startRef.current = null
  }, [isTop, card.id, onSwipe])

  const onPointerDown = (e: React.PointerEvent) => {
    if (!isTop) return
    e.currentTarget.setPointerCapture(e.pointerId)
    startRef.current = { x: e.clientX, y: e.clientY }
    currentRef.current = { x: 0, y: 0 }
    setDragging(true)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!startRef.current || !isTop) return
    const dx = e.clientX - startRef.current.x
    const dy = e.clientY - startRef.current.y
    currentRef.current = { x: dx, y: dy }
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => setPos({ x: dx, y: dy }))
  }

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  const stackOffset = total - 1 - index
  const stackScale = 1 - Math.min(stackOffset, 3) * 0.045
  const rotation = isTop ? pos.x * ROTATION_FACTOR : 0
  const tx = gone ? (gone === 'right' ? 600 : -600) : pos.x
  const ty = gone ? pos.y + 100 : pos.y
  const scale = gone ? 0.85 : isTop ? 1 : stackScale
  const rotate = gone ? (gone === 'right' ? 30 : -30) : rotation

  const swipeProgress = Math.min(Math.abs(pos.x) / SWIPE_THRESHOLD, 1)
  const hintRight = pos.x > 0 ? swipeProgress : 0
  const hintLeft = pos.x < 0 ? swipeProgress : 0

  if (stackOffset > 3) return null

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: index, cursor: isTop ? (dragging ? 'grabbing' : 'grab') : 'default',
        touchAction: 'none', userSelect: 'none',
      }}
    >
      <div style={{
        width: '300px',
        background: '#fff',
        borderRadius: '20px',
        border: '1px solid rgba(10,10,10,0.08)',
        boxShadow: isTop
          ? '0 4px 8px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.10)'
          : '0 2px 8px rgba(0,0,0,0.06)',
        padding: '28px 24px 24px',
        fontFamily: FONT,
        transform: \`translate(\${tx}px, \${ty}px) rotate(\${rotate}deg) scale(\${scale})\`,
        transformOrigin: 'center 120%',
        transition: dragging || gone
          ? (gone ? 'transform 350ms cubic-bezier(0.32,0.72,0,1), opacity 350ms ease' : 'none')
          : 'transform 320ms cubic-bezier(0.34,1.56,0.64,1)',
        opacity: gone ? 0 : 1,
        willChange: 'transform',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {isTop && (
          <>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '20px', background: 'rgba(22,163,74,0.12)', border: '2px solid rgba(22,163,74,0.4)', opacity: hintRight, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '20px', background: 'rgba(220,38,38,0.10)', border: '2px solid rgba(220,38,38,0.35)', opacity: hintLeft, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '20px', left: '20px', padding: '4px 10px', border: '2px solid #16a34a', borderRadius: '6px', color: '#16a34a', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: hintRight, transform: 'rotate(-12deg)', pointerEvents: 'none' }}>Keep</div>
            <div style={{ position: 'absolute', top: '20px', right: '20px', padding: '4px 10px', border: '2px solid #dc2626', borderRadius: '6px', color: '#dc2626', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: hintLeft, transform: 'rotate(12deg)', pointerEvents: 'none' }}>Skip</div>
          </>
        )}
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: card.accent, marginBottom: '20px' }} />
        <div style={{ fontSize: '40px', lineHeight: 1, marginBottom: '16px' }}>{card.emoji}</div>
        <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', lineHeight: 1.3 }}>{card.title}</h3>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: 'rgba(10,10,10,0.55)', letterSpacing: '-0.01em', lineHeight: 1.6 }}>{card.description}</p>
        <div style={{ marginTop: '24px', display: 'flex', gap: '4px' }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{ width: i === index ? '16px' : '5px', height: '5px', borderRadius: '3px', background: i === index ? card.accent : 'rgba(10,10,10,0.12)', transition: 'width 200ms ease' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function SwipeCards() {
  const [cards, setCards] = useState(CARDS)
  const [history, setHistory] = useState<{ id: number; dir: 'left' | 'right' }[]>([])

  const handleSwipe = useCallback((id: number, dir: 'left' | 'right') => {
    setHistory(h => [...h, { id, dir }])
    setCards(prev => prev.filter(c => c.id !== id))
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
      <div style={{ position: 'relative', width: '300px', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {cards.length === 0 ? (
          <p style={{ fontFamily: FONT, fontSize: '15px', color: 'rgba(10,10,10,0.45)' }}>All done!</p>
        ) : (
          cards.map((card, i) => (
            <SwipeCard key={card.id} card={card} index={i} total={cards.length} onSwipe={handleSwipe} />
          ))
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => cards.length && handleSwipe(cards[cards.length - 1].id, 'left')}
          style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(10,10,10,0.10)', background: '#fff', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        <button onClick={() => cards.length && handleSwipe(cards[cards.length - 1].id, 'right')}
          style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(10,10,10,0.10)', background: '#fff', cursor: 'pointer', fontSize: '18px' }}>♥</button>
      </div>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SwipeCardsPage() {
  return (
    <main style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      fontFamily: FONT,
    }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
      }}>
        <SwipeCardsDemo />
        <p style={{
          marginTop: '24px',
          fontSize: '12px',
          color: 'rgba(0,0,0,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily: FONT,
          textAlign: 'center',
        }}>
          Drag left to skip · drag right to keep · or use the buttons below
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
