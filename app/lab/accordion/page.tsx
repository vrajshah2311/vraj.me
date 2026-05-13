'use client'

import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AccordionItem {
  id: string
  question: string
  answer: string
}

// ─── AccordionRow ─────────────────────────────────────────────────────────────

function AccordionRow({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionItem
  isOpen: boolean
  onToggle: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ borderBottom: '1px solid rgba(10,10,10,0.07)' }}>
      <button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '14px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'inherit',
        }}
      >
        <span
          style={{
            fontSize: '13.5px',
            fontWeight: 500,
            color: '#0a0a0a',
            letterSpacing: '-0.015em',
            lineHeight: '1.4',
            opacity: isOpen || hovered ? 1 : 0.72,
            transition: 'opacity 150ms ease',
          }}
        >
          {item.question}
        </span>
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: isOpen
              ? '#0a0a0a'
              : hovered
              ? 'rgba(10,10,10,0.1)'
              : 'rgba(10,10,10,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 200ms ease',
          }}
        >
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            style={{
              display: 'block',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 250ms cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <path
              d="M1.5 3L4.5 6L7.5 3"
              stroke={isOpen ? '#fff' : 'rgba(10,10,10,0.45)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      </button>

      {/* CSS grid trick: 0fr → 1fr for smooth 0→auto height animation */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 260ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <p
            style={{
              margin: 0,
              paddingBottom: '14px',
              fontSize: '13px',
              color: 'rgba(10,10,10,0.56)',
              lineHeight: '1.65',
              letterSpacing: '-0.01em',
              fontFamily: 'inherit',
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

function Accordion({
  items,
  allowMultiple = false,
}: {
  items: AccordionItem[]
  allowMultiple?: boolean
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!allowMultiple) next.clear()
        next.add(id)
      }
      return next
    })
  }

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {items.map((item) => (
        <AccordionRow
          key={item.id}
          item={item}
          isOpen={openIds.has(item.id)}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

const ITEMS: AccordionItem[] = [
  {
    id: 'q1',
    question: 'How does the height animation work?',
    answer:
      'The CSS grid trick: transitioning grid-template-rows from 0fr to 1fr. This animates height from zero to the natural content size without any JavaScript measurement — resulting in butter-smooth transitions.',
  },
  {
    id: 'q2',
    question: 'Can multiple items be open at once?',
    answer:
      'Pass allowMultiple={true} to enable independent toggling. By default the accordion collapses the previous item when a new one opens, keeping the list compact and focused.',
  },
  {
    id: 'q3',
    question: 'Is this keyboard accessible?',
    answer:
      'Each trigger is a native <button> element, so it receives focus and responds to Enter/Space out of the box. For full WAI-ARIA compliance, add aria-expanded on the button and aria-hidden on collapsed panels.',
  },
  {
    id: 'q4',
    question: 'What are design tokens?',
    answer:
      'Named entities that store visual design attributes — color, spacing, typography. They ensure cross-platform consistency and make a global style change a single-line edit rather than a search-and-replace.',
  },
  {
    id: 'q5',
    question: 'Does it need any dependencies?',
    answer:
      'None. Pure React hooks and inline styles. No animation library, no CSS modules, no third-party packages. Drop the two components into any React project and it works immediately.',
  },
]

function Demo() {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '16px',
        padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.07)',
        width: '400px',
        maxWidth: '100%',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 600,
            color: '#0a0a0a',
            letterSpacing: '-0.02em',
          }}
        >
          FAQ
        </p>
        <p
          style={{
            margin: '2px 0 0',
            fontSize: '12px',
            color: 'rgba(10,10,10,0.4)',
            fontWeight: 500,
            letterSpacing: '-0.01em',
          }}
        >
          Frequently asked questions
        </p>
      </div>
      <Accordion items={ITEMS} />
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState } from 'react'

interface AccordionItem {
  id: string
  question: string
  answer: string
}

function AccordionRow({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionItem
  isOpen: boolean
  onToggle: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ borderBottom: '1px solid rgba(10,10,10,0.07)' }}>
      <button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '14px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'inherit',
        }}
      >
        <span
          style={{
            fontSize: '13.5px',
            fontWeight: 500,
            color: '#0a0a0a',
            letterSpacing: '-0.015em',
            lineHeight: '1.4',
            opacity: isOpen || hovered ? 1 : 0.72,
            transition: 'opacity 150ms ease',
          }}
        >
          {item.question}
        </span>
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: isOpen
              ? '#0a0a0a'
              : hovered
              ? 'rgba(10,10,10,0.1)'
              : 'rgba(10,10,10,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 200ms ease',
          }}
        >
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            style={{
              display: 'block',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 250ms cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <path
              d="M1.5 3L4.5 6L7.5 3"
              stroke={isOpen ? '#fff' : 'rgba(10,10,10,0.45)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      </button>

      {/* CSS grid trick: 0fr -> 1fr for smooth 0->auto height animation */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 260ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <p
            style={{
              margin: 0,
              paddingBottom: '14px',
              fontSize: '13px',
              color: 'rgba(10,10,10,0.56)',
              lineHeight: '1.65',
              letterSpacing: '-0.01em',
              fontFamily: 'inherit',
            }}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export function Accordion({
  items,
  allowMultiple = false,
}: {
  items: AccordionItem[]
  allowMultiple?: boolean
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!allowMultiple) next.clear()
        next.add(id)
      }
      return next
    })
  }

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {items.map((item) => (
        <AccordionRow
          key={item.id}
          item={item}
          isOpen={openIds.has(item.id)}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  )
}

// Usage:
// <Accordion
//   items={[
//     { id: 'a', question: 'What is this?', answer: 'An accordion component.' },
//     { id: 'b', question: 'Can many be open?', answer: 'Pass allowMultiple.' },
//   ]}
//   allowMultiple={false}
// />`

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
          minHeight: '65vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
          padding: '60px 24px',
          gap: '12px',
        }}
      >
        <p
          style={{
            margin: '0 0 12px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.3)',
          }}
        >
          Smooth Accordion
        </p>
        <Demo />
      </section>

      {/* ── Code block ── */}
      <section
        style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}
      >
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
