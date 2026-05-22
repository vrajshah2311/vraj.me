'use client'

import { useState, useRef, useEffect } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── AccordionItem ─────────────────────────────────────────────────────────────

function AccordionItem({
  title,
  subtitle,
  children,
  open,
  onToggle,
  isLast,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  open: boolean
  onToggle: () => void
  isLast?: boolean
}) {
  const innerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [hovered, setHovered] = useState(false)
  const skipTransitionRef = useRef(true)

  useEffect(() => {
    if (skipTransitionRef.current) {
      skipTransitionRef.current = false
      return
    }
    if (!innerRef.current) return
    setHeight(open ? innerRef.current.scrollHeight : 0)
  }, [open])

  return (
    <div style={{ borderBottom: isLast ? 'none' : '1px solid rgba(10,10,10,0.07)' }}>
      <button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '15px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left' as const,
          fontFamily: FONT,
          outline: 'none',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            lineHeight: '20px',
            color: hovered ? '#0a0a0a' : open ? '#0a0a0a' : 'rgba(10,10,10,0.75)',
            transition: 'color 150ms ease',
          }}>
            {title}
          </div>
          {subtitle && (
            <div style={{
              fontSize: '12px',
              color: 'rgba(10,10,10,0.4)',
              marginTop: '1px',
              letterSpacing: '-0.01em',
              fontFamily: FONT,
            }}>
              {subtitle}
            </div>
          )}
        </div>

        {/* Animated chevron */}
        <div style={{
          width: 20,
          height: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 220ms cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: hovered ? 0.7 : open ? 0.5 : 0.3,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 5L7 9.5L11.5 5" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {/* Animated content panel */}
      <div style={{
        height,
        overflow: 'hidden',
        transition: skipTransitionRef.current ? 'none' : 'height 240ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div ref={innerRef} style={{ paddingBottom: '15px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Accordion ─────────────────────────────────────────────────────────────────

function Accordion({
  items,
  multiple = false,
  defaultOpen,
}: {
  items: { title: string; subtitle?: string; content: React.ReactNode }[]
  multiple?: boolean
  defaultOpen?: number[]
}) {
  const [openSet, setOpenSet] = useState<Set<number>>(
    new Set(defaultOpen ?? [])
  )

  const toggle = (i: number) => {
    setOpenSet(prev => {
      const next = new Set(prev)
      if (next.has(i)) {
        next.delete(i)
      } else {
        if (!multiple) next.clear()
        next.add(i)
      }
      return next
    })
  }

  return (
    <div style={{ fontFamily: FONT }}>
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          title={item.title}
          subtitle={item.subtitle}
          open={openSet.has(i)}
          onToggle={() => toggle(i)}
          isLast={i === items.length - 1}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  )
}

// ─── FAQ Demo ──────────────────────────────────────────────────────────────────

function FaqDemo() {
  const items = [
    {
      title: 'How does the height animation work?',
      content: (
        <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'rgba(10,10,10,0.6)', letterSpacing: '-0.01em', fontFamily: FONT }}>
          On toggle, we measure the inner div's <code style={{ fontFamily: 'monospace', fontSize: '12px', background: 'rgba(10,10,10,0.06)', padding: '1px 5px', borderRadius: '4px' }}>scrollHeight</code> and set an explicit pixel height. CSS transitions animate between 0 and that value. The container is always <code style={{ fontFamily: 'monospace', fontSize: '12px', background: 'rgba(10,10,10,0.06)', padding: '1px 5px', borderRadius: '4px' }}>overflow: hidden</code> so content clips cleanly during animation.
        </div>
      ),
    },
    {
      title: 'Can I have multiple items open at once?',
      content: (
        <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'rgba(10,10,10,0.6)', letterSpacing: '-0.01em', fontFamily: FONT }}>
          Yes — pass <code style={{ fontFamily: 'monospace', fontSize: '12px', background: 'rgba(10,10,10,0.06)', padding: '1px 5px', borderRadius: '4px' }}>multiple=true</code> to allow any number of items to be expanded simultaneously. The default mode is single-open: opening one collapses the previously open item.
        </div>
      ),
    },
    {
      title: 'Does it work with dynamic content?',
      content: (
        <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'rgba(10,10,10,0.6)', letterSpacing: '-0.01em', fontFamily: FONT }}>
          The height is re-measured on every open/close toggle, so it handles arbitrary content. If content updates while an item is open, a ResizeObserver could be added to keep the height in sync — though for most use cases, re-toggling is sufficient.
        </div>
      ),
    },
    {
      title: 'What about keyboard accessibility?',
      content: (
        <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'rgba(10,10,10,0.6)', letterSpacing: '-0.01em', fontFamily: FONT }}>
          The trigger is a native <code style={{ fontFamily: 'monospace', fontSize: '12px', background: 'rgba(10,10,10,0.06)', padding: '1px 5px', borderRadius: '4px' }}>&lt;button&gt;</code>, so it's focusable and activatable via Enter or Space by default. Adding <code style={{ fontFamily: 'monospace', fontSize: '12px', background: 'rgba(10,10,10,0.06)', padding: '1px 5px', borderRadius: '4px' }}>aria-expanded</code> and <code style={{ fontFamily: 'monospace', fontSize: '12px', background: 'rgba(10,10,10,0.06)', padding: '1px 5px', borderRadius: '4px' }}>aria-controls</code> attributes rounds it out for full ARIA compliance.
        </div>
      ),
    },
  ]

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      padding: '4px 20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      width: '360px',
      maxWidth: '100%',
    }}>
      <div style={{ padding: '16px 0 4px', borderBottom: '1px solid rgba(10,10,10,0.07)', marginBottom: '0' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '-0.01em', color: '#0a0a0a', fontFamily: FONT }}>
          FAQ
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.4)', marginTop: '1px', letterSpacing: '-0.01em', fontFamily: FONT }}>
          Single open · click a question to expand
        </div>
      </div>
      <Accordion items={items} multiple={false} />
    </div>
  )
}

// ─── Features Demo ─────────────────────────────────────────────────────────────

function FeaturesDemo() {
  const items = [
    {
      title: 'Zero dependencies',
      subtitle: 'Pure React hooks + inline styles',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
          {['useState', 'useRef', 'useEffect'].map(hook => (
            <div key={hook} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 10px',
              background: 'rgba(10,10,10,0.025)',
              border: '1px solid rgba(10,10,10,0.06)',
              borderRadius: '8px',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
              <code style={{ fontSize: '12px', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                {hook}
              </code>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Smooth animation',
      subtitle: 'Native CSS height transition',
      content: (
        <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'rgba(10,10,10,0.6)', letterSpacing: '-0.01em', fontFamily: FONT }}>
          The height transition uses <code style={{ fontFamily: 'monospace', fontSize: '12px', background: 'rgba(10,10,10,0.06)', padding: '1px 5px', borderRadius: '4px' }}>cubic-bezier(0.4, 0, 0.2, 1)</code> — the same easing Material Design uses for standard motion. The chevron spins 180° on the same curve, creating a unified feel.
        </div>
      ),
    },
    {
      title: 'Two modes',
      subtitle: 'Single-open or multi-open',
      content: (
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: 'single', desc: 'One at a time', color: '#0ea5e9' },
            { label: 'multiple', desc: 'Any combination', color: '#16a34a' },
          ].map(m => (
            <div key={m.label} style={{
              flex: 1,
              padding: '10px',
              background: 'rgba(10,10,10,0.025)',
              border: '1px solid rgba(10,10,10,0.06)',
              borderRadius: '10px',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, marginBottom: '6px' }} />
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT }}>{m.label}</div>
              <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.45)', marginTop: '2px', letterSpacing: '-0.01em', fontFamily: FONT }}>{m.desc}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Composable content',
      subtitle: 'Pass any React node as content',
      content: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(10,10,10,0.025)', border: '1px solid rgba(10,10,10,0.06)', borderRadius: '10px' }}>
          <div style={{ fontSize: '22px', lineHeight: 1 }}>🧩</div>
          <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.6)', lineHeight: '1.5', letterSpacing: '-0.01em', fontFamily: FONT }}>
            Each item's <code style={{ fontFamily: 'monospace', background: 'rgba(10,10,10,0.06)', padding: '1px 4px', borderRadius: '3px' }}>content</code> prop accepts rich JSX — forms, images, nested components, anything.
          </div>
        </div>
      ),
    },
  ]

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      padding: '4px 20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      width: '360px',
      maxWidth: '100%',
    }}>
      <div style={{ padding: '16px 0 4px', borderBottom: '1px solid rgba(10,10,10,0.07)', marginBottom: '0' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '-0.01em', color: '#0a0a0a', fontFamily: FONT }}>
          What's included
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.4)', marginTop: '1px', letterSpacing: '-0.01em', fontFamily: FONT }}>
          Multi-open · expand any combination
        </div>
      </div>
      <Accordion items={items} multiple={true} />
    </div>
  )
}

// ─── Code source ───────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

function AccordionItem({
  title,
  subtitle,
  children,
  open,
  onToggle,
  isLast,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  open: boolean
  onToggle: () => void
  isLast?: boolean
}) {
  const innerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [hovered, setHovered] = useState(false)
  const skipTransitionRef = useRef(true)

  useEffect(() => {
    if (skipTransitionRef.current) {
      skipTransitionRef.current = false
      return
    }
    if (!innerRef.current) return
    setHeight(open ? innerRef.current.scrollHeight : 0)
  }, [open])

  return (
    <div style={{ borderBottom: isLast ? 'none' : '1px solid rgba(10,10,10,0.07)' }}>
      <button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '15px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: FONT,
          outline: 'none',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            lineHeight: '20px',
            color: hovered ? '#0a0a0a' : open ? '#0a0a0a' : 'rgba(10,10,10,0.75)',
            transition: 'color 150ms ease',
          }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.4)', marginTop: '1px', letterSpacing: '-0.01em', fontFamily: FONT }}>
              {subtitle}
            </div>
          )}
        </div>

        <div style={{
          width: 20, height: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 220ms cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: hovered ? 0.7 : open ? 0.5 : 0.3,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 5L7 9.5L11.5 5" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      <div style={{
        height,
        overflow: 'hidden',
        transition: skipTransitionRef.current ? 'none' : 'height 240ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div ref={innerRef} style={{ paddingBottom: '15px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function Accordion({
  items,
  multiple = false,
  defaultOpen,
}: {
  items: { title: string; subtitle?: string; content: React.ReactNode }[]
  multiple?: boolean
  defaultOpen?: number[]
}) {
  const [openSet, setOpenSet] = useState<Set<number>>(
    new Set(defaultOpen ?? [])
  )

  const toggle = (i: number) => {
    setOpenSet(prev => {
      const next = new Set(prev)
      if (next.has(i)) {
        next.delete(i)
      } else {
        if (!multiple) next.clear()
        next.add(i)
      }
      return next
    })
  }

  return (
    <div style={{ fontFamily: FONT }}>
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          title={item.title}
          subtitle={item.subtitle}
          open={openSet.has(i)}
          onToggle={() => toggle(i)}
          isLast={i === items.length - 1}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  )
}

// ── Example usage ──────────────────────────────────────────────────────────────
//
// const items = [
//   { title: 'What is this?', content: <p>A smooth accordion component.</p> },
//   { title: 'How does it work?', content: <p>Animated height via scrollHeight measurement.</p> },
//   { title: 'Can I customize it?', content: <p>Yes — pass any React node as content.</p> },
// ]
//
// <Accordion items={items} />                    // single-open (default)
// <Accordion items={items} multiple />           // multi-open
// <Accordion items={items} defaultOpen={[0]} />  // start with first item open`

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AccordionPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: '24px',
      }}>
        <div style={{
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <p style={{
              margin: 0,
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'rgba(10,10,10,0.35)',
              fontFamily: FONT,
            }}>
              Single-open
            </p>
            <FaqDemo />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <p style={{
              margin: 0,
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'rgba(10,10,10,0.35)',
              fontFamily: FONT,
            }}>
              Multi-open
            </p>
            <FeaturesDemo />
          </div>
        </div>
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
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
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
