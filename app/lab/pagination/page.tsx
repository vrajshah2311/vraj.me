'use client'

import { useState, useRef, useEffect } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Data ─────────────────────────────────────────────────────────────────────

const ARTICLES = [
  { id: 1,  title: 'The psychology of micro-interactions',          tag: 'Design',      time: '4 min' },
  { id: 2,  title: 'Building accessible date pickers from scratch', tag: 'Engineering', time: '8 min' },
  { id: 3,  title: 'Typography systems that scale',                 tag: 'Design',      time: '5 min' },
  { id: 4,  title: 'How Notion animated their sidebar',             tag: 'Engineering', time: '6 min' },
  { id: 5,  title: 'Color tokens in practice',                      tag: 'Design',      time: '3 min' },
  { id: 6,  title: 'CSS Grid vs Flexbox: when to use which',        tag: 'Engineering', time: '7 min' },
  { id: 7,  title: 'Designing for low-end devices',                 tag: 'Design',      time: '5 min' },
  { id: 8,  title: 'The art of the loading skeleton',               tag: 'Engineering', time: '4 min' },
  { id: 9,  title: 'Why motion matters in UI design',               tag: 'Design',      time: '6 min' },
  { id: 10, title: 'Scroll behaviors with IntersectionObserver',    tag: 'Engineering', time: '9 min' },
  { id: 11, title: 'Feedback loops in product design',              tag: 'Design',      time: '4 min' },
  { id: 12, title: 'Progressive enhancement, revisited',            tag: 'Engineering', time: '7 min' },
  { id: 13, title: 'Spatial design principles for digital products',tag: 'Design',      time: '5 min' },
  { id: 14, title: 'Writing readable TypeScript',                   tag: 'Engineering', time: '8 min' },
  { id: 15, title: 'Icons that communicate clearly',                tag: 'Design',      time: '3 min' },
  { id: 16, title: 'React state machines in production',            tag: 'Engineering', time: '10 min' },
  { id: 17, title: 'Onboarding UX patterns that actually work',     tag: 'Design',      time: '6 min' },
  { id: 18, title: 'Debouncing and throttling, demystified',        tag: 'Engineering', time: '5 min' },
  { id: 19, title: 'Whitespace as an active design element',        tag: 'Design',      time: '4 min' },
  { id: 20, title: 'Optimistic UI: building for speed',             tag: 'Engineering', time: '7 min' },
  { id: 21, title: 'The case for system fonts',                     tag: 'Design',      time: '3 min' },
  { id: 22, title: 'Virtualized lists with React',                  tag: 'Engineering', time: '8 min' },
  { id: 23, title: 'Visual hierarchy without color',                tag: 'Design',      time: '5 min' },
  { id: 24, title: 'Error boundaries and graceful degradation',     tag: 'Engineering', time: '6 min' },
  { id: 25, title: 'Gestalt principles for interface design',       tag: 'Design',      time: '7 min' },
  { id: 26, title: 'Web workers for heavy computations',            tag: 'Engineering', time: '9 min' },
  { id: 27, title: 'Designing empty states people actually read',   tag: 'Design',      time: '4 min' },
  { id: 28, title: 'Signals vs useState: a practical comparison',   tag: 'Engineering', time: '6 min' },
  { id: 29, title: 'The grid systems behind great layouts',         tag: 'Design',      time: '5 min' },
  { id: 30, title: 'Writing CSS that scales with your team',        tag: 'Engineering', time: '7 min' },
  { id: 31, title: 'Dark mode done right',                          tag: 'Design',      time: '6 min' },
  { id: 32, title: 'Prefetching data for instant navigation',       tag: 'Engineering', time: '5 min' },
  { id: 33, title: 'Reducing cognitive load in complex UIs',        tag: 'Design',      time: '8 min' },
  { id: 34, title: 'WCAG 2.2: what changed and why it matters',     tag: 'Engineering', time: '6 min' },
  { id: 35, title: 'Hierarchy through scale, not just weight',      tag: 'Design',      time: '4 min' },
  { id: 36, title: 'Smooth drag interactions without libraries',    tag: 'Engineering', time: '9 min' },
  { id: 37, title: 'Contrast ratios and the limits of WCAG',        tag: 'Design',      time: '5 min' },
  { id: 38, title: 'Building a design system from scratch',         tag: 'Engineering', time: '11 min' },
  { id: 39, title: 'Sizing with clamp() and fluid typography',      tag: 'Design',      time: '4 min' },
  { id: 40, title: 'The minimal surface area principle in APIs',    tag: 'Engineering', time: '7 min' },
]

const PER_PAGE = 5

// ─── getPageList ──────────────────────────────────────────────────────────────

function getPageList(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '…')[] = []
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || (p >= current - 1 && p <= current + 1)) {
      pages.push(p)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }
  return pages
}

// ─── Pagination ────────────────────────────────────────────────────────────────

function Pagination({
  page,
  total,
  onChange,
}: {
  page: number
  total: number
  onChange: (p: number) => void
}) {
  const pages = getPageList(page, total)
  const containerRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<Map<number, HTMLButtonElement | null>>(new Map())
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)
  const [animated, setAnimated] = useState(false)

  const pagesKey = pages.join(',')

  useEffect(() => {
    const btn = pageRefs.current.get(page)
    if (!btn) return
    const left = btn.offsetLeft
    const width = btn.offsetWidth
    setPill(prev => {
      if (!prev) {
        // first paint: no transition, then enable it after a frame
        requestAnimationFrame(() => setAnimated(true))
      }
      return { left, width }
    })
  }, [page, pagesKey]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      role="navigation"
      aria-label="Pagination"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '10px',
        padding: '3px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        position: 'relative',
        fontFamily: FONT,
      }}
    >
      {/* Sliding pill */}
      {pill && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '3px',
            left: `${pill.left}px`,
            width: `${pill.width}px`,
            height: '32px',
            background: '#0a0a0a',
            borderRadius: '7px',
            transition: animated
              ? 'left 220ms cubic-bezier(0.4, 0, 0.2, 1), width 220ms cubic-bezier(0.4, 0, 0.2, 1)'
              : 'none',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Prev */}
      <NavButton
        onClick={() => page > 1 && onChange(page - 1)}
        disabled={page === 1}
        label="Previous page"
      >
        ‹
      </NavButton>

      {/* Pages */}
      {pages.map((p, i) => {
        const isActive = p === page
        const isEllipsis = p === '…'
        return (
          <button
            key={typeof p === 'number' ? p : `e${i}`}
            ref={
              typeof p === 'number'
                ? (el) => { pageRefs.current.set(p as number, el) }
                : undefined
            }
            onClick={() => typeof p === 'number' && onChange(p)}
            disabled={isEllipsis}
            aria-label={isEllipsis ? undefined : `Page ${p}`}
            aria-current={isActive ? 'page' : undefined}
            style={{
              position: 'relative',
              zIndex: 1,
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              color: isEllipsis
                ? 'rgba(10,10,10,0.3)'
                : isActive
                  ? '#fff'
                  : 'rgba(10,10,10,0.65)',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 500,
              letterSpacing: '-0.01em',
              cursor: isEllipsis ? 'default' : 'pointer',
              fontFamily: FONT,
              transition: 'color 150ms ease',
              userSelect: 'none',
            }}
            onMouseEnter={e => {
              if (!isEllipsis && !isActive) e.currentTarget.style.color = '#0a0a0a'
            }}
            onMouseLeave={e => {
              if (!isEllipsis && !isActive) e.currentTarget.style.color = 'rgba(10,10,10,0.65)'
            }}
          >
            {isEllipsis ? '···' : p}
          </button>
        )
      })}

      {/* Next */}
      <NavButton
        onClick={() => page < total && onChange(page + 1)}
        disabled={page === total}
        label="Next page"
      >
        ›
      </NavButton>
    </div>
  )
}

function NavButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  disabled: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        position: 'relative',
        zIndex: 1,
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        border: 'none',
        background: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? 'rgba(10,10,10,0.2)' : 'rgba(10,10,10,0.45)',
        fontSize: '20px',
        lineHeight: 1,
        fontFamily: FONT,
        transition: 'color 150ms ease',
        userSelect: 'none',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.color = '#0a0a0a' }}
      onMouseLeave={e => { e.currentTarget.style.color = disabled ? 'rgba(10,10,10,0.2)' : 'rgba(10,10,10,0.45)' }}
    >
      {children}
    </button>
  )
}

// ─── Tag colors ────────────────────────────────────────────────────────────────

const TAG_STYLE: Record<string, { color: string; bg: string }> = {
  Design:      { color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  Engineering: { color: '#0284c7', bg: 'rgba(2,132,199,0.08)' },
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function PaginationDemo() {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(ARTICLES.length / PER_PAGE)
  const start = (page - 1) * PER_PAGE
  const items = ARTICLES.slice(start, start + PER_PAGE)

  const handleChange = (p: number) => {
    setPage(p)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        width: '100%',
        maxWidth: '480px',
      }}
    >
      {/* Article list */}
      <div
        style={{
          width: '100%',
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px 12px',
            borderBottom: '1px solid rgba(10,10,10,0.07)',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#0a0a0a',
              letterSpacing: '-0.01em',
              fontFamily: FONT,
            }}
          >
            Articles
          </span>
          <span
            style={{
              fontSize: '12px',
              color: 'rgba(10,10,10,0.4)',
              fontFamily: FONT,
              letterSpacing: '-0.01em',
            }}
          >
            {ARTICLES.length} total
          </span>
        </div>

        {/* List */}
        {items.map((article, i) => {
          const tag = TAG_STYLE[article.tag] ?? { color: '#555', bg: 'rgba(0,0,0,0.06)' }
          return (
            <div
              key={article.id}
              style={{
                padding: '13px 18px',
                borderBottom: i < items.length - 1 ? '1px solid rgba(10,10,10,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'default',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: tag.bg,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: tag.color,
                  fontFamily: FONT,
                  letterSpacing: '-0.02em',
                }}
              >
                {article.id}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#0a0a0a',
                    letterSpacing: '-0.01em',
                    lineHeight: '18px',
                    fontFamily: FONT,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {article.title}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '2px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 500,
                      color: tag.color,
                      background: tag.bg,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontFamily: FONT,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {article.tag}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'rgba(10,10,10,0.35)',
                      fontFamily: FONT,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {article.time}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination + page info row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            color: 'rgba(10,10,10,0.4)',
            fontFamily: FONT,
            letterSpacing: '-0.01em',
          }}
        >
          {start + 1}–{Math.min(start + PER_PAGE, ARTICLES.length)} of {ARTICLES.length}
        </span>
        <Pagination page={page} total={totalPages} onChange={handleChange} />
      </div>
    </div>
  )
}

// ─── Code source ───────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// Returns an array of page numbers with '…' for gaps.
// Shows current ± 1, always includes first and last.
function getPageList(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '…')[] = []
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || (p >= current - 1 && p <= current + 1)) {
      pages.push(p)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }
  return pages
}

function NavButton({
  onClick, disabled, label, children,
}: {
  onClick: () => void; disabled: boolean; label: string; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        position: 'relative', zIndex: 1,
        width: '32px', height: '32px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '8px', border: 'none', background: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? 'rgba(10,10,10,0.2)' : 'rgba(10,10,10,0.45)',
        fontSize: '20px', lineHeight: 1,
        fontFamily: FONT, transition: 'color 150ms ease', userSelect: 'none',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.color = '#0a0a0a' }}
      onMouseLeave={e => {
        e.currentTarget.style.color = disabled ? 'rgba(10,10,10,0.2)' : 'rgba(10,10,10,0.45)'
      }}
    >
      {children}
    </button>
  )
}

export function Pagination({
  page, total, onChange,
}: {
  page: number; total: number; onChange: (p: number) => void
}) {
  const pages = getPageList(page, total)
  const containerRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<Map<number, HTMLButtonElement | null>>(new Map())
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)
  const [animated, setAnimated] = useState(false)

  const pagesKey = pages.join(',')

  useEffect(() => {
    const btn = pageRefs.current.get(page)
    if (!btn) return
    const left = btn.offsetLeft
    const width = btn.offsetWidth
    setPill(prev => {
      if (!prev) requestAnimationFrame(() => setAnimated(true))
      return { left, width }
    })
  }, [page, pagesKey]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      role="navigation"
      aria-label="Pagination"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '2px',
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '10px', padding: '3px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        position: 'relative', fontFamily: FONT,
      }}
    >
      {pill && (
        <div
          aria-hidden
          style={{
            position: 'absolute', top: '3px',
            left: \`\${pill.left}px\`,
            width: \`\${pill.width}px\`,
            height: '32px', background: '#0a0a0a', borderRadius: '7px',
            transition: animated
              ? 'left 220ms cubic-bezier(0.4, 0, 0.2, 1), width 220ms cubic-bezier(0.4, 0, 0.2, 1)'
              : 'none',
            pointerEvents: 'none',
          }}
        />
      )}

      <NavButton onClick={() => page > 1 && onChange(page - 1)} disabled={page === 1} label="Previous page">
        ‹
      </NavButton>

      {pages.map((p, i) => {
        const isActive = p === page
        const isEllipsis = p === '…'
        return (
          <button
            key={typeof p === 'number' ? p : \`e\${i}\`}
            ref={typeof p === 'number' ? (el) => { pageRefs.current.set(p as number, el) } : undefined}
            onClick={() => typeof p === 'number' && onChange(p)}
            disabled={isEllipsis}
            aria-label={isEllipsis ? undefined : \`Page \${p}\`}
            aria-current={isActive ? 'page' : undefined}
            style={{
              position: 'relative', zIndex: 1,
              width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '8px', border: 'none', background: 'transparent',
              color: isEllipsis ? 'rgba(10,10,10,0.3)' : isActive ? '#fff' : 'rgba(10,10,10,0.65)',
              fontSize: '13px', fontWeight: isActive ? 600 : 500,
              letterSpacing: '-0.01em',
              cursor: isEllipsis ? 'default' : 'pointer',
              fontFamily: FONT, transition: 'color 150ms ease', userSelect: 'none',
            }}
            onMouseEnter={e => { if (!isEllipsis && !isActive) e.currentTarget.style.color = '#0a0a0a' }}
            onMouseLeave={e => { if (!isEllipsis && !isActive) e.currentTarget.style.color = 'rgba(10,10,10,0.65)' }}
          >
            {isEllipsis ? '···' : p}
          </button>
        )
      })}

      <NavButton onClick={() => page < total && onChange(page + 1)} disabled={page === total} label="Next page">
        ›
      </NavButton>
    </div>
  )
}

// ── Usage ─────────────────────────────────────────────────────────────────────
//
// const [page, setPage] = useState(1)
//
// <Pagination page={page} total={20} onChange={setPage} />
//
// Works for any total page count. The pill slides smoothly between pages.
// Ellipsis collapse is automatic — no configuration needed.`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PaginationPage() {
  return (
    <main
      style={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        fontFamily: FONT,
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
        }}
      >
        <PaginationDemo />
      </section>

      {/* ── Code block ── */}
      <section
        style={{
          padding: '48px 24px 64px',
          maxWidth: '760px',
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(10,10,10,0.4)',
            marginBottom: '12px',
            fontFamily: FONT,
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
              fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
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
