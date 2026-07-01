'use client'

import { useState, useRef, useEffect } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ── AccordionItem ─────────────────────────────────────────────────────────────

function AccordionItem({
  title,
  children,
  open,
  onToggle,
  isFirst,
  isLast,
}: {
  title: string
  children: React.ReactNode
  open: boolean
  onToggle: () => void
  isFirst: boolean
  isLast: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        borderTop: isFirst ? 'none' : '1px solid rgba(0,0,0,0.07)',
      }}
    >
      <button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '15px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          textAlign: 'left',
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: open ? '#0a0a0a' : hovered ? '#0a0a0a' : 'rgba(0,0,0,0.7)',
            letterSpacing: '-0.015em',
            lineHeight: 1.4,
            transition: 'color 150ms ease',
          }}
        >
          {title}
        </span>
        {/* Chevron */}
        <div
          style={{
            flexShrink: 0,
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
            background: open ? 'rgba(0,0,0,0.06)' : hovered ? 'rgba(0,0,0,0.04)' : 'transparent',
            transition: 'background 150ms ease',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 220ms cubic-bezier(0.4, 0, 0.2, 1)',
              color: open ? '#0a0a0a' : 'rgba(0,0,0,0.4)',
            }}
          >
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* Animated content — CSS grid trick for smooth height */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 240ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              paddingBottom: 16,
              fontSize: 13,
              fontWeight: 400,
              color: 'rgba(0,0,0,0.5)',
              letterSpacing: '-0.01em',
              lineHeight: 1.6,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Accordion ─────────────────────────────────────────────────────────────────

function Accordion({
  items,
  allowMultiple = false,
}: {
  items: { title: string; content: string }[]
  allowMultiple?: boolean
}) {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set([0]))

  const toggle = (idx: number) => {
    setOpenSet(prev => {
      const next = new Set(prev)
      if (next.has(idx)) {
        next.delete(idx)
      } else {
        if (!allowMultiple) next.clear()
        next.add(idx)
      }
      return next
    })
  }

  return (
    <div style={{ fontFamily: font }}>
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          title={item.title}
          open={openSet.has(i)}
          onToggle={() => toggle(i)}
          isFirst={i === 0}
          isLast={i === items.length - 1}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  )
}

// ── Demo ──────────────────────────────────────────────────────────────────────

const PRICING_FAQ = [
  {
    title: 'What is included in the free plan?',
    content:
      'The free plan includes up to 3 projects, 1 GB of storage, and community support. You can invite up to 2 collaborators and access all core features with a 30-day data retention window.',
  },
  {
    title: 'Can I change my plan later?',
    content:
      'Yes — you can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately, and any unused credit is prorated to your next billing cycle.',
  },
  {
    title: 'How does billing work for teams?',
    content:
      'Team plans are billed per seat, per month. The workspace owner is charged for all active members. You can add or remove members at any time; seats are prorated to the day.',
  },
  {
    title: 'Is there a discount for annual billing?',
    content:
      'Annual plans are 20% cheaper than monthly billing. You can switch to annual at any time, and the remaining months on your current plan are applied as credit.',
  },
  {
    title: 'What happens when I cancel?',
    content:
      'Your data is retained for 30 days after cancellation so you can export everything. After that, your workspace and all associated data are permanently deleted.',
  },
]

const TOGGLE_ITEMS = [
  {
    title: 'Single expand (default)',
    items: PRICING_FAQ,
    allowMultiple: false,
  },
  {
    title: 'Multi-expand',
    items: PRICING_FAQ.slice(0, 3),
    allowMultiple: true,
  },
]

function Demo() {
  const [mode, setMode] = useState(0)

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '40px 24px',
        fontFamily: font,
      }}
    >
      <div style={{ width: '100%', maxWidth: 560 }}>
        {/* Mode switcher */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 20,
            justifyContent: 'center',
          }}
        >
          {TOGGLE_ITEMS.map((t, i) => (
            <button
              key={i}
              onClick={() => setMode(i)}
              style={{
                padding: '6px 14px',
                background: mode === i ? '#0a0a0a' : 'rgba(255,255,255,0.7)',
                border: '1px solid',
                borderColor: mode === i ? '#0a0a0a' : 'rgba(0,0,0,0.1)',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 500,
                color: mode === i ? '#fff' : 'rgba(0,0,0,0.5)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '-0.01em',
                transition: 'all 150ms ease',
              }}
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* Card */}
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow:
              '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)',
            padding: '8px 20px',
          }}
        >
          <div
            style={{
              padding: '14px 0 12px',
              borderBottom: '1px solid rgba(0,0,0,0.07)',
              marginBottom: 2,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#0a0a0a',
                letterSpacing: '-0.02em',
              }}
            >
              Frequently asked questions
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: 'rgba(0,0,0,0.35)',
                marginTop: 2,
                letterSpacing: '-0.005em',
              }}
            >
              {TOGGLE_ITEMS[mode].allowMultiple
                ? 'Multiple sections can be open at once'
                : 'Only one section open at a time'}
            </div>
          </div>

          <Accordion
            key={mode}
            items={TOGGLE_ITEMS[mode].items}
            allowMultiple={TOGGLE_ITEMS[mode].allowMultiple}
          />
        </div>
      </div>
    </div>
  )
}

// ── CopyButton ────────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {}
      }}
      style={{
        padding: '5px 12px',
        background: copied ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 7,
        color: copied ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: font,
        letterSpacing: '-0.01em',
        transition: 'background 0.15s ease, color 0.15s ease',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ── Code source ───────────────────────────────────────────────────────────────

const CODE_SOURCE = `'use client'

import { useState } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

function AccordionItem({ title, children, open, onToggle, isFirst }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ borderTop: isFirst ? 'none' : '1px solid rgba(0,0,0,0.07)' }}>
      <button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '15px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          textAlign: 'left',
          gap: 12,
        }}
      >
        <span style={{
          fontSize: 14,
          fontWeight: 500,
          color: open ? '#0a0a0a' : hovered ? '#0a0a0a' : 'rgba(0,0,0,0.7)',
          letterSpacing: '-0.015em',
          lineHeight: 1.4,
          transition: 'color 150ms ease',
        }}>
          {title}
        </span>
        <div style={{
          flexShrink: 0,
          width: 20,
          height: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          background: open ? 'rgba(0,0,0,0.06)' : hovered ? 'rgba(0,0,0,0.04)' : 'transparent',
          transition: 'background 150ms ease',
        }}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 220ms cubic-bezier(0.4, 0, 0.2, 1)',
              color: open ? '#0a0a0a' : 'rgba(0,0,0,0.4)',
            }}
          >
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* CSS grid trick — animates height without knowing the target height */}
      <div style={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows 240ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{
            paddingBottom: 16,
            fontSize: 13,
            color: 'rgba(0,0,0,0.5)',
            letterSpacing: '-0.01em',
            lineHeight: 1.6,
          }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Accordion({ items, allowMultiple = false }) {
  const [openSet, setOpenSet] = useState(new Set([0]))

  const toggle = (idx) => {
    setOpenSet(prev => {
      const next = new Set(prev)
      if (next.has(idx)) {
        next.delete(idx)
      } else {
        if (!allowMultiple) next.clear()
        next.add(idx)
      }
      return next
    })
  }

  return (
    <div style={{ fontFamily: font }}>
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          title={item.title}
          open={openSet.has(i)}
          onToggle={() => toggle(i)}
          isFirst={i === 0}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  )
}

// Usage
export default function App() {
  const items = [
    { title: 'What is included in the free plan?', content: 'The free plan includes up to 3 projects, 1 GB of storage, and community support.' },
    { title: 'Can I change my plan later?', content: 'Yes — you can upgrade or downgrade at any time from your account settings.' },
    { title: 'How does billing work for teams?', content: 'Team plans are billed per seat, per month, prorated to the day.' },
  ]

  return (
    <div style={{ padding: 24, maxWidth: 480, fontFamily: '-apple-system, sans-serif' }}>
      <Accordion items={items} />
      {/* For multi-expand: <Accordion items={items} allowMultiple /> */}
    </div>
  )
}`

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AccordionPage() {
  return (
    <div style={{ background: '#fff' }}>
      {/* DEMO */}
      <Demo />

      {/* CODE */}
      <div
        style={{
          background: '#0a0a0a',
          padding: 'clamp(24px, 4vw, 48px)' as any,
          fontFamily: font,
        }}
      >
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                  marginBottom: 2,
                }}
              >
                Accordion
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.35)',
                  fontWeight: 500,
                }}
              >
                Drop into any React project — zero dependencies
              </div>
            </div>
            <CopyButton text={CODE_SOURCE} />
          </div>

          <div
            style={{
              background: '#111',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '10px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 500,
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                Accordion.tsx
              </div>
            </div>
            <pre
              style={{
                margin: 0,
                padding: '20px',
                overflowX: 'auto',
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                fontSize: 12.5,
                lineHeight: 1.65,
                color: '#e5e5e5',
                scrollbarWidth: 'thin' as any,
                scrollbarColor: 'rgba(255,255,255,0.1) transparent',
              }}
            >
              <code>{CODE_SOURCE}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
