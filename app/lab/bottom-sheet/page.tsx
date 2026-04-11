'use client'

import React, { useState, useEffect } from 'react'

// ─── BottomSheet ──────────────────────────────────────────────────────────────

function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), 400)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: visible ? 'rgba(0,0,0,0.32)' : 'rgba(0,0,0,0)',
        backdropFilter: visible ? 'blur(3px)' : 'blur(0px)',
        transition: 'background 300ms ease, backdrop-filter 300ms ease',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bs-title"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '85vh',
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -1px 0 rgba(0,0,0,0.06), 0 -8px 48px rgba(0,0,0,0.16)',
          display: 'flex',
          flexDirection: 'column',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 400ms cubic-bezier(0.32, 0.72, 0, 1)',
          willChange: 'transform',
          overflow: 'hidden',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0', flexShrink: 0 }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '100px', background: 'rgba(0,0,0,0.1)' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px 0',
          flexShrink: 0,
        }}>
          <h2 id="bs-title" style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 600,
            color: '#0a0a0a',
            letterSpacing: '-0.02em',
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(10,10,10,0.06)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(10,10,10,0.5)',
              fontSize: '12px',
              fontWeight: 700,
              transition: 'background 150ms ease',
              flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.06)')}
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 32px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Share Sheet Content ──────────────────────────────────────────────────────

const SHARE_OPTIONS = [
  { icon: '🔗', label: 'Copy link',        sublabel: 'Copy the page URL' },
  { icon: '✉️', label: 'Send via email',   sublabel: 'Open in mail client' },
  { icon: '🐦', label: 'Post to X',        sublabel: 'Share on Twitter / X' },
  { icon: '💼', label: 'LinkedIn',         sublabel: 'Share professionally' },
  { icon: '💬', label: 'Send message',     sublabel: 'iMessage or SMS' },
]

function ShareContent({ onClose }: { onClose: () => void }) {
  const [clicked, setClicked] = useState<number | null>(null)

  const handleClick = (i: number) => {
    setClicked(i)
    setTimeout(() => { setClicked(null); onClose() }, 700)
  }

  return (
    <div>
      {/* Link preview card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        background: 'rgba(10,10,10,0.04)',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '10px',
        marginBottom: '16px',
      }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px',
          background: '#0a0a0a', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>V</span>
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: '18px' }}>
            Bottom Sheet — Lab
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: 'rgba(10,10,10,0.4)', fontFamily: 'monospace', lineHeight: '16px' }}>
            vraj.me/lab/bottom-sheet
          </p>
        </div>
      </div>

      {/* Action list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {SHARE_OPTIONS.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              background: clicked === i ? 'rgba(10,10,10,0.05)' : 'transparent',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background 120ms ease',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
            }}
            onMouseEnter={e => { if (clicked !== i) e.currentTarget.style.background = 'rgba(10,10,10,0.04)' }}
            onMouseLeave={e => { if (clicked !== i) e.currentTarget.style.background = 'transparent' }}
          >
            <span style={{ fontSize: '20px', lineHeight: '1', flexShrink: 0, width: '24px', textAlign: 'center' }}>
              {opt.icon}
            </span>
            <div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: '18px' }}>
                {clicked === i && i === 0 ? 'Copied!' : opt.label}
              </p>
              <p style={{ margin: 0, fontSize: '11.5px', color: 'rgba(10,10,10,0.44)', letterSpacing: '-0.01em', lineHeight: '16px' }}>
                {opt.sublabel}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Sort Sheet Content ───────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Most Relevant', desc: 'Best matches for your search' },
  { id: 'newest',    label: 'Newest First',  desc: 'Recently added items' },
  { id: 'oldest',    label: 'Oldest First',  desc: 'Earliest items first' },
  { id: 'popular',   label: 'Most Popular',  desc: 'Highest community ratings' },
]

function SortContent({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState('relevance')

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        {SORT_OPTIONS.map(opt => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              background: selected === opt.id ? 'rgba(10,10,10,0.05)' : 'transparent',
              border: `1px solid ${selected === opt.id ? 'rgba(10,10,10,0.14)' : 'rgba(10,10,10,0.07)'}`,
              borderRadius: '10px',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background 150ms ease, border-color 150ms ease',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
            }}
            onMouseEnter={e => { if (selected !== opt.id) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(10,10,10,0.03)' }}
            onMouseLeave={e => { if (selected !== opt.id) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            {/* Radio dot */}
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: `2px solid ${selected === opt.id ? '#0a0a0a' : 'rgba(10,10,10,0.22)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'border-color 150ms ease',
            }}>
              {selected === opt.id && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0a0a0a' }} />
              )}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '-0.01em', lineHeight: '18px' }}>
                {opt.label}
              </p>
              <p style={{ margin: 0, fontSize: '11.5px', color: 'rgba(10,10,10,0.44)', letterSpacing: '-0.01em', lineHeight: '16px' }}>
                {opt.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={onClose}
        style={{
          width: '100%',
          padding: '13px',
          background: '#0a0a0a',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          cursor: 'pointer',
          transition: 'opacity 150ms ease',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Apply Sort
      </button>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

const BTN: React.CSSProperties = {
  padding: '9px 18px',
  borderRadius: '9px',
  border: '1px solid rgba(10,10,10,0.08)',
  background: '#fff',
  color: '#0a0a0a',
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '-0.01em',
  cursor: 'pointer',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  transition: 'background 150ms ease, transform 100ms ease',
}

function BottomSheetDemo() {
  const [shareOpen, setShareOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  return (
    <>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          style={BTN}
          onClick={() => setShareOpen(true)}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Share
        </button>
        <button
          style={BTN}
          onClick={() => setSortOpen(true)}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Sort by
        </button>
      </div>

      <BottomSheet open={shareOpen} onClose={() => setShareOpen(false)} title="Share">
        <ShareContent onClose={() => setShareOpen(false)} />
      </BottomSheet>

      <BottomSheet open={sortOpen} onClose={() => setSortOpen(false)} title="Sort By">
        <SortContent onClose={() => setSortOpen(false)} />
      </BottomSheet>
    </>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import React, { useState, useEffect } from 'react'

function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), 400)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        background: visible ? 'rgba(0,0,0,0.32)' : 'rgba(0,0,0,0)',
        backdropFilter: visible ? 'blur(3px)' : 'blur(0px)',
        transition: 'background 300ms ease, backdrop-filter 300ms ease',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: '100%', maxWidth: '520px', maxHeight: '85vh',
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -1px 0 rgba(0,0,0,0.06), 0 -8px 48px rgba(0,0,0,0.16)',
          display: 'flex', flexDirection: 'column',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 400ms cubic-bezier(0.32, 0.72, 0, 1)',
          willChange: 'transform', overflow: 'hidden',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0', flexShrink: 0 }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '100px', background: 'rgba(0,0,0,0.1)' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px 0', flexShrink: 0,
        }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'rgba(10,10,10,0.06)', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(10,10,10,0.5)', fontSize: '12px', fontWeight: 700,
              transition: 'background 150ms ease', flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.06)')}
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 32px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Usage ────────────────────────────────────────────────────────────────────

export default function App() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Sheet</button>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Options"
      >
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(10,10,10,0.6)' }}>
          Your content here. The sheet scrolls if content overflows.
        </p>
      </BottomSheet>
    </>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BottomSheetPage() {
  return (
    <main style={{
      backgroundColor: '#fff',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    }}>

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
        <BottomSheetDemo />
      </section>

      {/* ── Code ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.4)',
          marginBottom: '12px',
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
