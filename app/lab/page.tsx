'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useSpring, useMotionValue, animate, AnimatePresence } from 'framer-motion'

/* ─────────────────────────────────────────────
   Magnetic Button
───────────────────────────────────────────── */
function MagneticButton() {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 })
  const sy = useSpring(y, { stiffness: 200, damping: 15 })

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.35)
    y.set((e.clientY - cy) * 0.35)
  }
  const handleLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className="magnetic-btn"
    >
      Hover me
    </motion.button>
  )
}

/* ─────────────────────────────────────────────
   Scramble Text
───────────────────────────────────────────── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%'
function ScrambleText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text)
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scramble = useCallback(() => {
    let iteration = 0
    clearInterval(frameRef.current!)
    frameRef.current = setInterval(() => {
      setDisplay(
        text.split('').map((char, i) =>
          i < iteration ? char : char === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join('')
      )
      if (iteration >= text.length) clearInterval(frameRef.current!)
      iteration += 0.5
    }, 30)
  }, [text])

  useEffect(() => () => clearInterval(frameRef.current!), [])

  return (
    <span
      onMouseEnter={scramble}
      style={{ fontFamily: 'ui-monospace, monospace', fontSize: '22px', fontWeight: 600, letterSpacing: '-0.02em', cursor: 'default', userSelect: 'none', color: '#000' }}
    >
      {display}
    </span>
  )
}

/* ─────────────────────────────────────────────
   Toggle
───────────────────────────────────────────── */
function Toggle() {
  const [on, setOn] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
      <motion.button
        onClick={() => setOn(!on)}
        style={{
          width: 56, height: 32, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 3,
          background: on ? '#f53000' : 'rgba(0,0,0,0.12)',
          display: 'flex', alignItems: 'center',
        }}
        animate={{ background: on ? '#f53000' : 'rgba(0,0,0,0.12)' }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
          animate={{ x: on ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
      <span style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', fontWeight: 500 }}>{on ? 'On' : 'Off'}</span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Spring Counter
───────────────────────────────────────────── */
function SpringCounter() {
  const [count, setCount] = useState(0)
  const displayed = useSpring(count, { stiffness: 120, damping: 14 })
  const [val, setVal] = useState(0)

  useEffect(() => {
    displayed.set(count)
    const unsub = displayed.on('change', v => setVal(Math.round(v)))
    return unsub
  }, [count, displayed])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <span style={{ fontSize: '52px', fontWeight: 600, letterSpacing: '-0.04em', color: '#000', fontVariantNumeric: 'tabular-nums', minWidth: 80, textAlign: 'center' }}>{val}</span>
      <div style={{ display: 'flex', gap: '10px' }}>
        {[
          { label: '−', action: () => setCount(c => c - 1) },
          { label: '+', action: () => setCount(c => c + 1) },
        ].map(({ label, action }) => (
          <motion.button
            key={label}
            onClick={action}
            whileTap={{ scale: 0.88 }}
            style={{ width: 40, height: 40, borderRadius: '50%', border: '1.5px solid rgba(0,0,0,0.12)', background: '#fff', fontSize: '20px', cursor: 'pointer', fontWeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}
          >
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Color Swatches
───────────────────────────────────────────── */
const swatches = [
  { hex: '#f53000', name: 'Orange' },
  { hex: '#000000', name: 'Black' },
  { hex: '#6366f1', name: 'Indigo' },
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#f59e0b', name: 'Amber' },
  { hex: '#ec4899', name: 'Pink' },
]
function ColorSwatches() {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopied(hex)
    setTimeout(() => setCopied(null), 1400)
  }
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {swatches.map(({ hex, name }) => (
        <motion.button
          key={hex}
          onClick={() => copy(hex)}
          whileHover={{ y: -4, scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          title={`Copy ${hex}`}
          style={{ width: 40, height: 40, borderRadius: '10px', background: hex, border: 'none', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
        >
          <AnimatePresence>
            {copied === hex && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Stagger Text
───────────────────────────────────────────── */
function StaggerText() {
  const [key, setKey] = useState(0)
  const words = 'Good design is as little design as possible'.split(' ')
  return (
    <motion.p
      key={key}
      onClick={() => setKey(k => k + 1)}
      style={{ fontSize: '18px', fontWeight: 500, letterSpacing: '-0.02em', color: '#000', lineHeight: 1.4, textAlign: 'center', cursor: 'pointer', margin: 0, maxWidth: '240px' }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  )
}

/* ─────────────────────────────────────────────
   Cursor Blob
───────────────────────────────────────────── */
function CursorBlob() {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useSpring(100, { stiffness: 80, damping: 12 })
  const y = useSpring(80, { stiffness: 80, damping: 12 })

  const handleMove = (e: React.MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect()
    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      style={{ width: '100%', height: '160px', borderRadius: '12px', background: 'rgba(0,0,0,0.03)', overflow: 'hidden', position: 'relative', cursor: 'none' }}
    >
      <motion.div
        style={{
          x, y,
          width: 80, height: 80, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,48,0,0.6) 0%, rgba(245,48,0,0) 70%)',
          translateX: '-50%', translateY: '-50%',
          position: 'absolute', pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '13px', color: 'rgba(0,0,0,0.35)', fontWeight: 500, pointerEvents: 'none' }}>Move cursor here</span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Accordion
───────────────────────────────────────────── */
const items = [
  { q: 'What do you design?', a: 'Products, systems, and the spaces in between.' },
  { q: 'Favourite tool?', a: 'Figma for design, Framer for prototypes.' },
  { q: 'Available for work?', a: 'Currently heads-down at Peec AI.' },
]
function Accordion() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{ width: '100%', textAlign: 'left', padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}
          >
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#000', letterSpacing: '-0.01em' }}>{item.q}</span>
            <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2 }} style={{ fontSize: '18px', color: 'rgba(0,0,0,0.4)', lineHeight: 1, flexShrink: 0 }}>+</motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'rgba(0,0,0,0.5)', lineHeight: 1.6, letterSpacing: '-0.01em' }}>{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Drag to rate
───────────────────────────────────────────── */
function DragRating() {
  const [rating, setRating] = useState(3)
  const emojis = ['😐', '🙂', '😊', '😄', '🤩']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <span style={{ fontSize: '48px' }}>{emojis[rating - 1]}</span>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <motion.button
            key={n}
            onClick={() => setRating(n)}
            whileTap={{ scale: 0.85 }}
            animate={{ scale: rating === n ? 1.2 : 1, opacity: n <= rating ? 1 : 0.25 }}
            style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f53000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </motion.button>
        ))}
      </div>
      <span style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', fontWeight: 500 }}>{['Meh', 'Okay', 'Good', 'Great', 'Love it'][rating - 1]}</span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Card wrapper
───────────────────────────────────────────── */
function Card({ title, children, span }: { title: string; children: React.ReactNode; span?: number }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      border: '1px solid rgba(0,0,0,0.06)',
      padding: '28px 24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      gridColumn: span ? `span ${span}` : undefined,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
        {children}
      </div>
      <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)' }}>{title}</span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function LabPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5', padding: '64px 24px 80px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
      <style>{`
        .magnetic-btn {
          padding: 12px 28px;
          border-radius: 999px;
          border: 1.5px solid rgba(0,0,0,0.12);
          background: #fff;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: -0.01em;
          color: #000;
        }
        .magnetic-btn:hover {
          border-color: #f53000;
          color: #f53000;
        }
      `}</style>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.03em', color: '#000', margin: 0, lineHeight: 1.1 }}>Lab</h1>
          <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'rgba(0,0,0,0.4)', fontWeight: 500, letterSpacing: '-0.01em' }}>Interactive components, experiments & micro-interactions.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <Card title="Magnetic Button"><MagneticButton /></Card>
          <Card title="Scramble Text"><ScrambleText text="HOVER OVER ME" /></Card>
          <Card title="Toggle"><Toggle /></Card>
          <Card title="Spring Counter"><SpringCounter /></Card>
          <Card title="Stagger Text"><StaggerText /></Card>
          <Card title="Drag Rating"><DragRating /></Card>
          <Card title="Color Swatches"><ColorSwatches /></Card>
          <Card title="Accordion" span={2}><div style={{ width: '100%' }}><Accordion /></div></Card>
          <Card title="Cursor Blob" span={3}><CursorBlob /></Card>
        </div>
      </div>
    </main>
  )
}
