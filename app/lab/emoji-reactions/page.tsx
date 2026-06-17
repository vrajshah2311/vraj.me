'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'
const EMOJI_OPTIONS = ['👍', '❤️', '😂', '🎉', '🚀', '👀', '🔥', '💯']

type Reaction = { emoji: string; count: number; mine: boolean }

// ─── AnimatedCount ─────────────────────────────────────────────────────────────

function AnimatedCount({ value }: { value: number }) {
  const [bump, setBump] = useState(false)
  const prevRef = useRef(value)

  useEffect(() => {
    if (value !== prevRef.current) {
      prevRef.current = value
      setBump(true)
      const t = setTimeout(() => setBump(false), 350)
      return () => clearTimeout(t)
    }
  }, [value])

  return (
    <span style={{
      display: 'inline-block',
      transform: bump ? 'scale(1.5)' : 'scale(1)',
      transition: 'transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}>
      {value}
    </span>
  )
}

// ─── ReactionPill ──────────────────────────────────────────────────────────────

function ReactionPill({ reaction, onToggle }: { reaction: Reaction; onToggle: () => void }) {
  const [hovered, setHovered] = useState(false)
  const { emoji, count, mine } = reaction

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 10px',
        borderRadius: '100px',
        border: '1px solid',
        borderColor: mine
          ? 'rgba(99,102,241,0.45)'
          : hovered ? 'rgba(10,10,10,0.2)' : 'rgba(10,10,10,0.1)',
        background: mine
          ? 'rgba(99,102,241,0.08)'
          : hovered ? 'rgba(10,10,10,0.05)' : 'rgba(10,10,10,0.02)',
        cursor: 'pointer',
        fontSize: '13px',
        fontFamily: FONT,
        fontWeight: 500,
        color: mine ? '#6366f1' : 'rgba(10,10,10,0.65)',
        transition: 'border-color 150ms ease, background 150ms ease, color 150ms ease',
        letterSpacing: '-0.01em',
        lineHeight: 1.4,
        userSelect: 'none' as const,
        transform: 'scale(1)',
      }}
    >
      <span style={{ fontSize: '14px', lineHeight: 1 }}>{emoji}</span>
      <AnimatedCount value={count} />
    </button>
  )
}

// ─── EmojiReactions ────────────────────────────────────────────────────────────

function EmojiReactions({ initialReactions }: { initialReactions: Reaction[] }) {
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions)
  const [pickerMounted, setPickerMounted] = useState(false)
  const [pickerVisible, setPickerVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const myEmojis = new Set(reactions.filter(r => r.mine).map(r => r.emoji))

  const closePicker = useCallback(() => {
    setPickerVisible(false)
    setTimeout(() => setPickerMounted(false), 220)
  }, [])

  const openPicker = () => {
    setPickerMounted(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setPickerVisible(true)))
  }

  const react = (emoji: string) => {
    setReactions(prev => {
      const existing = prev.find(r => r.emoji === emoji)
      if (existing?.mine) {
        const newCount = existing.count - 1
        return newCount === 0
          ? prev.filter(r => r.emoji !== emoji)
          : prev.map(r => r.emoji === emoji ? { ...r, count: newCount, mine: false } : r)
      }
      if (existing) {
        return prev.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, mine: true } : r)
      }
      return [...prev, { emoji, count: 1, mine: true }]
    })
    closePicker()
  }

  useEffect(() => {
    if (!pickerMounted) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closePicker()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [pickerMounted, closePicker])

  const pickerTransform = 'translateX(-50%) '
    + (pickerVisible ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(6px)')

  return (
    <div
      ref={containerRef}
      style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', fontFamily: FONT }}
    >
      {reactions.map(r => (
        <ReactionPill key={r.emoji} reaction={r} onToggle={() => react(r.emoji)} />
      ))}

      {/* Add reaction button + floating picker */}
      <div style={{ position: 'relative' }}>
        {pickerMounted && (
          <div style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: pickerTransform,
            opacity: pickerVisible ? 1 : 0,
            transformOrigin: 'bottom center',
            transition: 'transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 160ms ease',
            background: '#ffffff',
            border: '1px solid rgba(10,10,10,0.08)',
            borderRadius: '14px',
            padding: '8px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex',
            gap: '2px',
            zIndex: 100,
            whiteSpace: 'nowrap' as const,
          }}>
            {EMOJI_OPTIONS.map(emoji => {
              const active = myEmojis.has(emoji)
              return (
                <button
                  key={emoji}
                  onClick={() => react(emoji)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: active ? 'rgba(99,102,241,0.25)' : 'transparent',
                    background: active ? 'rgba(99,102,241,0.08)' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 120ms ease, transform 120ms ease, border-color 120ms ease',
                    lineHeight: 1,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = active
                      ? 'rgba(99,102,241,0.15)' : 'rgba(10,10,10,0.06)'
                    e.currentTarget.style.transform = 'scale(1.28)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = active
                      ? 'rgba(99,102,241,0.08)' : 'transparent'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  {emoji}
                </button>
              )
            })}
          </div>
        )}

        <button
          onClick={() => { if (pickerMounted) closePicker(); else openPicker() }}
          style={{
            width: '30px',
            height: '26px',
            borderRadius: '100px',
            border: '1px solid',
            borderColor: pickerMounted ? 'rgba(10,10,10,0.18)' : 'rgba(10,10,10,0.1)',
            background: pickerMounted ? 'rgba(10,10,10,0.06)' : 'rgba(10,10,10,0.02)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(10,10,10,0.45)',
            transition: 'all 150ms ease',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (!pickerMounted) {
              e.currentTarget.style.background = 'rgba(10,10,10,0.05)'
              e.currentTarget.style.borderColor = 'rgba(10,10,10,0.16)'
            }
          }}
          onMouseLeave={e => {
            if (!pickerMounted) {
              e.currentTarget.style.background = 'rgba(10,10,10,0.02)'
              e.currentTarget.style.borderColor = 'rgba(10,10,10,0.1)'
            }
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Demo messages ─────────────────────────────────────────────────────────────

const MESSAGES = [
  {
    id: 1,
    initials: 'VS',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    author: 'Vraj Shah',
    time: '2m ago',
    text: 'Corner radius on the modal feels right — 12px sits well against the card grid.',
    reactions: [
      { emoji: '👍', count: 5, mine: false },
      { emoji: '💯', count: 2, mine: false },
    ] as Reaction[],
  },
  {
    id: 2,
    initials: 'AK',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    author: 'Aisha Kim',
    time: '5m ago',
    text: 'Hover state needs more contrast. rgba(0,0,0,0.08) is my baseline for elevated surfaces.',
    reactions: [
      { emoji: '👍', count: 3, mine: false },
      { emoji: '🚀', count: 1, mine: false },
    ] as Reaction[],
  },
  {
    id: 3,
    initials: 'MR',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    author: 'Marcus Rivera',
    time: '12m ago',
    text: 'Just shipped the new onboarding flow — the animation timings feel polished on mobile.',
    reactions: [
      { emoji: '🎉', count: 8, mine: true },
      { emoji: '🚀', count: 4, mine: false },
      { emoji: '❤️', count: 2, mine: false },
    ] as Reaction[],
  },
]

function MessageCard({ msg }: { msg: typeof MESSAGES[number] }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '14px',
      padding: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      width: '360px',
      maxWidth: '100%',
      fontFamily: FONT,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: msg.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 700,
          color: '#fff',
          flexShrink: 0,
          letterSpacing: '0.04em',
        }}>
          {msg.initials}
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
            {msg.author}
          </div>
          <div style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em', marginTop: '1px' }}>
            {msg.time}
          </div>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: '14px', fontWeight: 400, color: 'rgba(10,10,10,0.72)', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
        {msg.text}
      </p>
      <EmojiReactions initialReactions={msg.reactions} />
    </div>
  )
}

// ─── Code source ───────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'
const EMOJI_OPTIONS = ['👍', '❤️', '😂', '🎉', '🚀', '👀', '🔥', '💯']

type Reaction = { emoji: string; count: number; mine: boolean }

const DEFAULT_REACTIONS: Reaction[] = [
  { emoji: '👍', count: 4, mine: false },
  { emoji: '❤️', count: 2, mine: true },
  { emoji: '🎉', count: 1, mine: false },
]

function AnimatedCount({ value }: { value: number }) {
  const [bump, setBump] = useState(false)
  const prevRef = useRef(value)

  useEffect(() => {
    if (value !== prevRef.current) {
      prevRef.current = value
      setBump(true)
      const t = setTimeout(() => setBump(false), 350)
      return () => clearTimeout(t)
    }
  }, [value])

  return (
    <span style={{
      display: 'inline-block',
      transform: bump ? 'scale(1.5)' : 'scale(1)',
      transition: 'transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}>
      {value}
    </span>
  )
}

function ReactionPill({ reaction, onToggle }: { reaction: Reaction; onToggle: () => void }) {
  const [hovered, setHovered] = useState(false)
  const { emoji, count, mine } = reaction

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        padding: '4px 10px', borderRadius: '100px', border: '1px solid',
        borderColor: mine ? 'rgba(99,102,241,0.45)' : hovered ? 'rgba(10,10,10,0.2)' : 'rgba(10,10,10,0.1)',
        background: mine ? 'rgba(99,102,241,0.08)' : hovered ? 'rgba(10,10,10,0.05)' : 'rgba(10,10,10,0.02)',
        cursor: 'pointer', fontSize: '13px', fontFamily: FONT, fontWeight: 500,
        color: mine ? '#6366f1' : 'rgba(10,10,10,0.65)',
        transition: 'border-color 150ms ease, background 150ms ease, color 150ms ease',
        letterSpacing: '-0.01em', lineHeight: 1.4, userSelect: 'none',
      }}
    >
      <span style={{ fontSize: '14px', lineHeight: 1 }}>{emoji}</span>
      <AnimatedCount value={count} />
    </button>
  )
}

export function EmojiReactions({
  initialReactions = DEFAULT_REACTIONS,
}: {
  initialReactions?: Reaction[]
}) {
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions)
  const [pickerMounted, setPickerMounted] = useState(false)
  const [pickerVisible, setPickerVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const myEmojis = new Set(reactions.filter(r => r.mine).map(r => r.emoji))

  const closePicker = useCallback(() => {
    setPickerVisible(false)
    setTimeout(() => setPickerMounted(false), 220)
  }, [])

  const openPicker = () => {
    setPickerMounted(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setPickerVisible(true)))
  }

  const react = (emoji: string) => {
    setReactions(prev => {
      const existing = prev.find(r => r.emoji === emoji)
      if (existing?.mine) {
        const newCount = existing.count - 1
        return newCount === 0
          ? prev.filter(r => r.emoji !== emoji)
          : prev.map(r => r.emoji === emoji ? { ...r, count: newCount, mine: false } : r)
      }
      if (existing) {
        return prev.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, mine: true } : r)
      }
      return [...prev, { emoji, count: 1, mine: true }]
    })
    closePicker()
  }

  useEffect(() => {
    if (!pickerMounted) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closePicker()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [pickerMounted, closePicker])

  const pickerTransform = 'translateX(-50%) '
    + (pickerVisible ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(6px)')

  return (
    <div ref={containerRef} style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', fontFamily: FONT }}>
      {reactions.map(r => (
        <ReactionPill key={r.emoji} reaction={r} onToggle={() => react(r.emoji)} />
      ))}

      <div style={{ position: 'relative' }}>
        {pickerMounted && (
          <div style={{
            position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
            transform: pickerTransform, opacity: pickerVisible ? 1 : 0,
            transformOrigin: 'bottom center',
            transition: 'transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 160ms ease',
            background: '#fff', border: '1px solid rgba(10,10,10,0.08)', borderRadius: '14px',
            padding: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex', gap: '2px', zIndex: 100, whiteSpace: 'nowrap',
          }}>
            {EMOJI_OPTIONS.map(emoji => {
              const active = myEmojis.has(emoji)
              return (
                <button
                  key={emoji}
                  onClick={() => react(emoji)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px', border: '1px solid',
                    borderColor: active ? 'rgba(99,102,241,0.25)' : 'transparent',
                    background: active ? 'rgba(99,102,241,0.08)' : 'transparent',
                    cursor: 'pointer', fontSize: '18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 120ms ease, transform 120ms ease, border-color 120ms ease',
                    lineHeight: 1,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = active ? 'rgba(99,102,241,0.15)' : 'rgba(10,10,10,0.06)'
                    e.currentTarget.style.transform = 'scale(1.28)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = active ? 'rgba(99,102,241,0.08)' : 'transparent'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  {emoji}
                </button>
              )
            })}
          </div>
        )}

        <button
          onClick={() => { if (pickerMounted) closePicker(); else openPicker() }}
          style={{
            width: '30px', height: '26px', borderRadius: '100px', border: '1px solid',
            borderColor: pickerMounted ? 'rgba(10,10,10,0.18)' : 'rgba(10,10,10,0.1)',
            background: pickerMounted ? 'rgba(10,10,10,0.06)' : 'rgba(10,10,10,0.02)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(10,10,10,0.45)', transition: 'all 150ms ease',
          }}
          onMouseEnter={e => {
            if (!pickerMounted) {
              e.currentTarget.style.background = 'rgba(10,10,10,0.05)'
              e.currentTarget.style.borderColor = 'rgba(10,10,10,0.16)'
            }
          }}
          onMouseLeave={e => {
            if (!pickerMounted) {
              e.currentTarget.style.background = 'rgba(10,10,10,0.02)'
              e.currentTarget.style.borderColor = 'rgba(10,10,10,0.1)'
            }
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}`

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function EmojiReactionsPage() {
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
        gap: '12px',
      }}>
        {MESSAGES.map(msg => (
          <MessageCard key={msg.id} msg={msg} />
        ))}
        <p style={{
          margin: '12px 0 0',
          fontSize: '12px',
          color: 'rgba(10,10,10,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          fontFamily: FONT,
        }}>
          Click a reaction to toggle · press + to add your own
        </p>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          color: 'rgba(10,10,10,0.4)',
          marginBottom: '12px',
          fontFamily: FONT,
        }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
          <pre style={{
            margin: 0,
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
            fontSize: '12px',
            lineHeight: '1.65',
            color: '#e5e5e5',
            whiteSpace: 'pre' as const,
            overflowX: 'auto',
          }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
