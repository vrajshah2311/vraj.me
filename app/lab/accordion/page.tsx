'use client'

import { useState, useRef, useEffect } from 'react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const ITEMS = [
  {
    id: 'why',
    question: 'Why use an accordion component?',
    answer:
      'Accordions are ideal when you have related information that users may not all need at once. They reduce cognitive load by hiding secondary content behind a disclosure pattern, keeping the UI clean while making everything accessible on demand.',
  },
  {
    id: 'animation',
    question: 'How is the height animation handled?',
    answer:
      'The panel height is measured via a ref on mount and whenever the content changes. Instead of animating max-height (which causes janky easing), the exact pixel height is stored in state and the panel transitions between 0 and that value using cubic-bezier easing for a perfectly natural feel.',
  },
  {
    id: 'a11y',
    question: 'Is this keyboard and screen-reader accessible?',
    answer:
      'Yes. Each trigger is a <button> with aria-expanded and aria-controls pointing to its panel. The panel carries role="region" and aria-labelledby. Arrow-key navigation moves focus between triggers, and Space or Enter toggles the active item.',
  },
  {
    id: 'multiple',
    question: 'Can multiple sections be open at the same time?',
    answer:
      'This demo uses single-open mode — selecting a new item collapses the previous one. Switching to multi-open is a one-line change: replace the string activeId with a Set<string> and toggle membership instead of replacing the value.',
  },
  {
    id: 'copy',
    question: 'Can I drop this into any React project?',
    answer:
      'Absolutely. The component has zero dependencies beyond React. All styles are inline, all animation is driven by useState + CSS transitions, and the only hooks used are useState, useRef, and useEffect.',
  },
]

// ─── AccordionItem ─────────────────────────────────────────────────────────────

function AccordionItem({
  item,
  isOpen,
  isLast,
  onToggle,
}: {
  item: (typeof ITEMS)[0]
  isOpen: boolean
  isLast: boolean
  onToggle: () => void
}) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(bodyRef.current.scrollHeight)
    }
  }, [item.answer])

  return (
    <div
      style={{
        borderBottom: isLast ? 'none' : '1px solid rgba(10,10,10,0.08)',
      }}
    >
      {/* ── Trigger ── */}
      <button
        id={`trigger-${item.id}`}
        aria-expanded={isOpen}
        aria-controls={`panel-${item.id}`}
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '18px 24px',
          background: hovered ? 'rgba(10,10,10,0.025)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 150ms ease',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <span
          style={{
            fontSize: '13.5px',
            fontWeight: 500,
            color: '#0a0a0a',
            letterSpacing: '-0.015em',
            lineHeight: '1.4',
            flex: 1,
          }}
        >
          {item.question}
        </span>

        {/* Animated +/× icon */}
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: isOpen ? '#0a0a0a' : 'rgba(10,10,10,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 200ms ease, transform 220ms cubic-bezier(0.4,0,0.2,1)',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            style={{ display: 'block' }}
          >
            <path
              d="M4.5 1v7M1 4.5h7"
              stroke={isOpen ? '#ffffff' : 'rgba(10,10,10,0.55)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ transition: 'stroke 200ms ease' }}
            />
          </svg>
        </span>
      </button>

      {/* ── Panel ── */}
      <div
        id={`panel-${item.id}`}
        role="region"
        aria-labelledby={`trigger-${item.id}`}
        style={{
          overflow: 'hidden',
          height: isOpen ? `${height}px` : '0px',
          transition: 'height 260ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          ref={bodyRef}
          style={{
            padding: '2px 24px 20px',
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateY(0)' : 'translateY(-6px)',
            transition: 'opacity 220ms ease, transform 220ms ease',
            transitionDelay: isOpen ? '60ms' : '0ms',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              lineHeight: '1.7',
              color: 'rgba(10,10,10,0.6)',
              letterSpacing: '-0.01em',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
            }}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Accordion ────────────────────────────────────────────────────────────────

function Accordion() {
  const [activeId, setActiveId] = useState<string | null>('why')
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleToggle = (id: string) => {
    setActiveId(prev => (prev === id ? null : id))
  }

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      triggerRefs.current[(idx + 1) % ITEMS.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      triggerRefs.current[(idx - 1 + ITEMS.length) % ITEMS.length]?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      triggerRefs.current[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      triggerRefs.current[ITEMS.length - 1]?.focus()
    }
  }

  return (
    <div
      style={{
        width: '520px',
        maxWidth: '100%',
        background: '#ffffff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}
    >
      {ITEMS.map((item, idx) => (
        <div
          key={item.id}
          onKeyDown={e => handleKeyDown(e, idx)}
          // Capture the button ref via a wrapper trick
          ref={el => {
            if (el) {
              triggerRefs.current[idx] = el.querySelector('button')
            }
          }}
        >
          <AccordionItem
            item={item}
            isOpen={activeId === item.id}
            isLast={idx === ITEMS.length - 1}
            onToggle={() => handleToggle(item.id)}
          />
        </div>
      ))}
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect } from 'react'

const ITEMS = [
  { id: 'one', question: 'What is this?', answer: 'A smooth accordion component.' },
  { id: 'two', question: 'How does the animation work?', answer: 'The exact pixel height is measured via a ref, then CSS transitions between 0 and that value.' },
  { id: 'three', question: 'Is it accessible?', answer: 'Yes — aria-expanded, aria-controls, role="region", and arrow-key navigation are all wired up.' },
]

function AccordionItem({ item, isOpen, isLast, onToggle }) {
  const bodyRef = useRef(null)
  const [height, setHeight] = useState(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (bodyRef.current) setHeight(bodyRef.current.scrollHeight)
  }, [item.answer])

  return (
    <div style={{ borderBottom: isLast ? 'none' : '1px solid rgba(10,10,10,0.08)' }}>
      <button
        id={\`trigger-\${item.id}\`}
        aria-expanded={isOpen}
        aria-controls={\`panel-\${item.id}\`}
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '18px 24px',
          background: hovered ? 'rgba(10,10,10,0.025)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 150ms ease',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <span style={{ fontSize: '13.5px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.015em', lineHeight: '1.4', flex: 1 }}>
          {item.question}
        </span>
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: isOpen ? '#0a0a0a' : 'rgba(10,10,10,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 200ms ease, transform 220ms cubic-bezier(0.4,0,0.2,1)',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ display: 'block' }}>
            <path
              d="M4.5 1v7M1 4.5h7"
              stroke={isOpen ? '#ffffff' : 'rgba(10,10,10,0.55)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ transition: 'stroke 200ms ease' }}
            />
          </svg>
        </span>
      </button>

      <div
        id={\`panel-\${item.id}\`}
        role="region"
        aria-labelledby={\`trigger-\${item.id}\`}
        style={{
          overflow: 'hidden',
          height: isOpen ? \`\${height}px\` : '0px',
          transition: 'height 260ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          ref={bodyRef}
          style={{
            padding: '2px 24px 20px',
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateY(0)' : 'translateY(-6px)',
            transition: 'opacity 220ms ease, transform 220ms ease',
            transitionDelay: isOpen ? '60ms' : '0ms',
          }}
        >
          <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.7', color: 'rgba(10,10,10,0.6)', letterSpacing: '-0.01em', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export function Accordion() {
  const [activeId, setActiveId] = useState(null)
  const triggerRefs = useRef([])

  const handleToggle = (id) => setActiveId(prev => prev === id ? null : id)

  const handleKeyDown = (e, idx) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); triggerRefs.current[(idx + 1) % ITEMS.length]?.focus() }
    else if (e.key === 'ArrowUp') { e.preventDefault(); triggerRefs.current[(idx - 1 + ITEMS.length) % ITEMS.length]?.focus() }
    else if (e.key === 'Home') { e.preventDefault(); triggerRefs.current[0]?.focus() }
    else if (e.key === 'End') { e.preventDefault(); triggerRefs.current[ITEMS.length - 1]?.focus() }
  }

  return (
    <div style={{
      width: '520px',
      maxWidth: '100%',
      background: '#ffffff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    }}>
      {ITEMS.map((item, idx) => (
        <div
          key={item.id}
          onKeyDown={e => handleKeyDown(e, idx)}
          ref={el => { if (el) triggerRefs.current[idx] = el.querySelector('button') }}
        >
          <AccordionItem
            item={item}
            isOpen={activeId === item.id}
            isLast={idx === ITEMS.length - 1}
            onToggle={() => handleToggle(item.id)}
          />
        </div>
      ))}
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccordionPage() {
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
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
          padding: '60px 24px',
        }}
      >
        <Accordion />
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
