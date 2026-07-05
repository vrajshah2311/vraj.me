'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// Initial HTML rendered into the contentEditable on mount
const INITIAL_HTML = `<p style="font-weight:600;font-size:19px;letter-spacing:-0.03em;color:#0a0a0a;line-height:1.35;margin:0 0 14px">Design Systems at Scale</p><p style="margin:0 0 12px">A great design system isn’t just a component library — it’s a shared language between designers and engineers. When done right, it accelerates teams and reduces decision fatigue across every surface.</p><p style="margin:0 0 12px">The hardest part isn’t building the components. It’s establishing the constraints: spacing scales, color tokens, and typography ramps. <span style="color:rgba(0,0,0,0.35)">← Select any text to format it.</span></p><p style="margin:0">Primitives should be composable, not prescriptive. A Button shouldn’t force a specific layout — it should accept any content and adapt. That flexibility is what makes a system last.</p>`

// ── Types ──────────────────────────────────────────────────────────────────────

type Fmt = { bold: boolean; italic: boolean; underline: boolean; strike: boolean }

// ── Toolbar ────────────────────────────────────────────────────────────────────

function Toolbar({
  visible, x, y, fmt, linkMode, linkUrl, linkInputRef,
  onFormat, onLink, onLinkChange, onApply, onCancel,
}: {
  visible: boolean
  x: number
  y: number
  fmt: Fmt
  linkMode: boolean
  linkUrl: string
  linkInputRef: React.RefObject<HTMLInputElement>
  onFormat: (cmd: string) => void
  onLink: () => void
  onLinkChange: (v: string) => void
  onApply: () => void
  onCancel: () => void
}) {
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (visible) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)))
    } else {
      setShow(false)
      const t = setTimeout(() => setMounted(false), 180)
      return () => clearTimeout(t)
    }
  }, [visible])

  if (!mounted) return null

  const TH = 40 // approximate toolbar height
  const GAP = 8  // gap between toolbar bottom and selection top

  const BTN_BASE: React.CSSProperties = {
    border: 'none', borderRadius: 6,
    cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.1s ease, color 0.1s ease',
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: y - TH - GAP,
        left: x,
        transform: `translateX(-50%) translateY(${show ? 0 : 5}px)`,
        opacity: show ? 1 : 0,
        zIndex: 9999,
        fontFamily: font,
        transition: show
          ? 'opacity 0.15s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1)'
          : 'opacity 0.12s ease, transform 0.12s ease',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <div style={{
        background: '#111',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: '4px 4px',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        boxShadow: '0 2px 4px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.35)',
      }}>
        {linkMode ? (
          /* ── URL input mode ── */
          <>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 8, gap: 5, flex: 1 }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                <path d="M5 7L7 5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M3.5 8.5C2.67 9.33 1.33 9.33 0.5 8.5C-0.33 7.67 -0.33 6.33 0.5 5.5L2 4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M8.5 3.5C9.33 2.67 10.67 2.67 11.5 3.5C12.33 4.33 12.33 5.67 11.5 6.5L10 8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input
                ref={linkInputRef}
                value={linkUrl}
                onChange={e => onLinkChange(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); onApply() }
                  if (e.key === 'Escape') { e.preventDefault(); onCancel() }
                }}
                placeholder="Paste URL..."
                style={{
                  width: 162,
                  border: 'none', outline: 'none',
                  background: 'transparent',
                  color: '#fff',
                  fontSize: 12.5, fontWeight: 500,
                  fontFamily: 'inherit',
                  letterSpacing: '-0.01em',
                }}
              />
            </div>
            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />
            <button
              onMouseDown={e => { e.preventDefault(); onApply() }}
              style={{
                ...BTN_BASE,
                height: 28, padding: '0 10px',
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em',
              }}
            >
              Apply
            </button>
            <button
              onMouseDown={e => { e.preventDefault(); onCancel() }}
              style={{
                ...BTN_BASE,
                width: 28, height: 28,
                background: 'transparent',
                color: 'rgba(255,255,255,0.4)',
                fontSize: 13,
              }}
            >
              ✕
            </button>
          </>
        ) : (
          /* ── Format buttons ── */
          <>
            {([
              { cmd: 'bold',          label: 'B', active: fmt.bold,      s: { fontWeight: 700 } },
              { cmd: 'italic',        label: 'I', active: fmt.italic,    s: { fontStyle: 'italic' as const } },
              { cmd: 'underline',     label: 'U', active: fmt.underline, s: { textDecoration: 'underline' } },
              { cmd: 'strikeThrough', label: 'S', active: fmt.strike,    s: { textDecoration: 'line-through' } },
            ] as const).map(({ cmd, label, active, s }) => (
              <button
                key={cmd}
                onMouseDown={e => { e.preventDefault(); onFormat(cmd) }}
                style={{
                  ...BTN_BASE,
                  width: 30, height: 28,
                  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                  fontSize: 13,
                  ...s,
                }}
              >
                {label}
              </button>
            ))}
            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />
            <button
              onMouseDown={e => { e.preventDefault(); onLink() }}
              style={{
                ...BTN_BASE,
                height: 28, padding: '0 9px',
                background: 'transparent',
                color: 'rgba(255,255,255,0.55)',
                fontSize: 12, fontWeight: 500, gap: 4,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M5 7L7 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M3.5 8.5C2.67 9.33 1.33 9.33 0.5 8.5C-0.33 7.67 -0.33 6.33 0.5 5.5L2 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M8.5 3.5C9.33 2.67 10.67 2.67 11.5 3.5C12.33 4.33 12.33 5.67 11.5 6.5L10 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Link
            </button>
          </>
        )}
      </div>

      {/* Downward caret pointing at the selected text */}
      <div style={{
        position: 'absolute',
        bottom: -4,
        left: '50%',
        marginLeft: -4,
        width: 8,
        height: 8,
        background: '#111',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        transform: 'rotate(45deg)',
      }} />
    </div>
  )
}

// ── InlineTextEditor ──────────────────────────────────────────────────────────

function InlineTextEditor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [tbVisible, setTbVisible] = useState(false)
  const [tbX, setTbX] = useState(0)
  const [tbY, setTbY] = useState(0)
  const [fmt, setFmt] = useState<Fmt>({ bold: false, italic: false, underline: false, strike: false })
  const [linkMode, setLinkMode] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const savedRange = useRef<Range | null>(null)
  const linkInputRef = useRef<HTMLInputElement>(null)
  // Mirror linkMode into a ref so the selectionchange handler can read it without stale closures
  const linkModeRef = useRef(false)

  useEffect(() => { linkModeRef.current = linkMode }, [linkMode])

  // Set initial HTML once — never let React reconcile editor children
  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = INITIAL_HTML
  }, [])

  const readFmt = (): Fmt => ({
    bold: document.queryCommandState('bold'),
    italic: document.queryCommandState('italic'),
    underline: document.queryCommandState('underline'),
    strike: document.queryCommandState('strikeThrough'),
  })

  const onSelectionChange = useCallback(() => {
    if (linkModeRef.current) return
    const sel = window.getSelection()
    const editor = editorRef.current
    if (!sel || sel.isCollapsed || sel.rangeCount === 0 || !editor) {
      setTbVisible(false)
      return
    }
    const range = sel.getRangeAt(0)
    if (!editor.contains(range.commonAncestorContainer)) {
      setTbVisible(false)
      return
    }
    const rect = range.getBoundingClientRect()
    if (rect.width < 2) { setTbVisible(false); return }
    setTbX(rect.left + rect.width / 2)
    setTbY(rect.top)
    setFmt(readFmt())
    setTbVisible(true)
  }, [])

  useEffect(() => {
    const onScroll = () => { if (!linkModeRef.current) setTbVisible(false) }
    document.addEventListener('selectionchange', onSelectionChange)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [onSelectionChange])

  const handleFormat = (cmd: string) => {
    document.execCommand(cmd, false)
    setFmt(readFmt())
  }

  const handleLink = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange()
    setLinkMode(true)
    setLinkUrl('')
    setTimeout(() => linkInputRef.current?.focus(), 20)
  }

  const applyLink = () => {
    if (savedRange.current) {
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(savedRange.current)
      const raw = linkUrl.trim()
      if (raw) {
        const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
        document.execCommand('createLink', false, url)
      }
    }
    setLinkMode(false)
    setTbVisible(false)
    savedRange.current = null
  }

  const cancelLink = () => {
    setLinkMode(false)
    setTbVisible(false)
    savedRange.current = null
  }

  return (
    <>
      <style>{`
        [data-te] a { color: inherit; text-decoration: underline dotted rgba(0,0,0,0.4); cursor: pointer; }
        [data-te] a:hover { text-decoration: underline solid rgba(0,0,0,0.6); }
        [data-te]:focus { outline: none; }
        [data-te] ::selection { background: rgba(0,0,0,0.1); }
      `}</style>
      <div
        ref={editorRef}
        data-te=""
        contentEditable
        suppressContentEditableWarning
        style={{
          outline: 'none',
          fontFamily: font,
          fontSize: 15,
          lineHeight: 1.75,
          color: '#0a0a0a',
          letterSpacing: '-0.015em',
          caretColor: '#0a0a0a',
          minHeight: 120,
        }}
      />
      <Toolbar
        visible={tbVisible}
        x={tbX}
        y={tbY}
        fmt={fmt}
        linkMode={linkMode}
        linkUrl={linkUrl}
        linkInputRef={linkInputRef}
        onFormat={handleFormat}
        onLink={handleLink}
        onLinkChange={setLinkUrl}
        onApply={applyLink}
        onCancel={cancelLink}
      />
    </>
  )
}

// ── Demo ──────────────────────────────────────────────────────────────────────

function Demo() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
      padding: '60px 24px',
      fontFamily: font,
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <div style={{
          textAlign: 'center',
          fontSize: 11, fontWeight: 600,
          color: 'rgba(0,0,0,0.35)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          marginBottom: 16,
        }}>
          Select any text to format
        </div>

        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}>
          {/* Editor chrome bar */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
                <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.3)', letterSpacing: '-0.01em' }}>
              draft.md
            </span>
            <div style={{ flex: 1 }} />
            <button style={{
              padding: '4px 10px',
              background: 'transparent',
              border: '1px solid rgba(0,0,0,0.09)',
              borderRadius: 6,
              fontSize: 11, fontWeight: 500,
              color: 'rgba(0,0,0,0.4)',
              cursor: 'pointer',
              fontFamily: font,
            }}>
              Save
            </button>
          </div>

          {/* Editor body */}
          <div style={{ padding: '24px' }}>
            <InlineTextEditor />
          </div>
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
        try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
      }}
      style={{
        padding: '5px 12px',
        background: copied ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 7,
        color: copied ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
        fontSize: 12, fontWeight: 500,
        cursor: 'pointer', fontFamily: font,
        letterSpacing: '-0.01em',
        transition: 'background 0.15s ease, color 0.15s ease',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

// ── CODE_SOURCE ───────────────────────────────────────────────────────────────

const CODE_SOURCE = `'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// Set your initial HTML content here
const INITIAL_HTML = \`
  <p><strong>Untitled</strong></p>
  <p>Start writing here, then select any text to format it.</p>
\`.trim()

// ── Toolbar ───────────────────────────────────────────────────────────────────

function Toolbar({ visible, x, y, fmt, linkMode, linkUrl, linkInputRef,
  onFormat, onLink, onLinkChange, onApply, onCancel }) {
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (visible) {
      setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)))
    } else {
      setShow(false)
      const t = setTimeout(() => setMounted(false), 180)
      return () => clearTimeout(t)
    }
  }, [visible])

  if (!mounted) return null

  const TH = 40 // approximate toolbar height
  const GAP = 8

  const BTN = {
    border: 'none', borderRadius: 6, cursor: 'pointer',
    fontFamily: 'inherit', display: 'flex', alignItems: 'center',
    justifyContent: 'center', transition: 'background 0.1s ease, color 0.1s ease',
  }

  return (
    <div style={{
      position: 'fixed',
      top: y - TH - GAP,
      left: x,
      transform: \`translateX(-50%) translateY(\${show ? 0 : 5}px)\`,
      opacity: show ? 1 : 0,
      zIndex: 9999,
      fontFamily: font,
      transition: show
        ? 'opacity 0.15s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1)'
        : 'opacity 0.12s ease, transform 0.12s ease',
      pointerEvents: show ? 'auto' : 'none',
    }}>
      <div style={{
        background: '#111',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: '4px 4px',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        boxShadow: '0 2px 4px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.35)',
      }}>
        {linkMode ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 8, gap: 5 }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                <path d="M5 7L7 5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M3.5 8.5C2.67 9.33 1.33 9.33 0.5 8.5C-0.33 7.67 -0.33 6.33 0.5 5.5L2 4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M8.5 3.5C9.33 2.67 10.67 2.67 11.5 3.5C12.33 4.33 12.33 5.67 11.5 6.5L10 8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input
                ref={linkInputRef}
                value={linkUrl}
                onChange={e => onLinkChange(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); onApply() }
                  if (e.key === 'Escape') { e.preventDefault(); onCancel() }
                }}
                placeholder="Paste URL..."
                style={{
                  width: 162, border: 'none', outline: 'none',
                  background: 'transparent', color: '#fff',
                  fontSize: 12.5, fontWeight: 500,
                  fontFamily: 'inherit', letterSpacing: '-0.01em',
                }}
              />
            </div>
            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />
            <button
              onMouseDown={e => { e.preventDefault(); onApply() }}
              style={{ ...BTN, height: 28, padding: '0 10px', background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em' }}
            >Apply</button>
            <button
              onMouseDown={e => { e.preventDefault(); onCancel() }}
              style={{ ...BTN, width: 28, height: 28, background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}
            >✕</button>
          </>
        ) : (
          <>
            {[
              { cmd: 'bold',          label: 'B', active: fmt.bold,      s: { fontWeight: 700 } },
              { cmd: 'italic',        label: 'I', active: fmt.italic,    s: { fontStyle: 'italic' } },
              { cmd: 'underline',     label: 'U', active: fmt.underline, s: { textDecoration: 'underline' } },
              { cmd: 'strikeThrough', label: 'S', active: fmt.strike,    s: { textDecoration: 'line-through' } },
            ].map(({ cmd, label, active, s }) => (
              <button
                key={cmd}
                onMouseDown={e => { e.preventDefault(); onFormat(cmd) }}
                style={{
                  ...BTN,
                  width: 30, height: 28,
                  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                  fontSize: 13,
                  ...s,
                }}
              >{label}</button>
            ))}
            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />
            <button
              onMouseDown={e => { e.preventDefault(); onLink() }}
              style={{ ...BTN, height: 28, padding: '0 9px', background: 'transparent', color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 500, gap: 4 }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M5 7L7 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M3.5 8.5C2.67 9.33 1.33 9.33 0.5 8.5C-0.33 7.67 -0.33 6.33 0.5 5.5L2 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M8.5 3.5C9.33 2.67 10.67 2.67 11.5 3.5C12.33 4.33 12.33 5.67 11.5 6.5L10 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Link
            </button>
          </>
        )}
      </div>

      {/* Downward caret */}
      <div style={{
        position: 'absolute', bottom: -4, left: '50%', marginLeft: -4,
        width: 8, height: 8, background: '#111',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        transform: 'rotate(45deg)',
      }} />
    </div>
  )
}

// ── InlineTextEditor ──────────────────────────────────────────────────────────
// Drop this anywhere. Renders a contentEditable area with a floating
// format toolbar that appears automatically when text is selected.

export function InlineTextEditor({ initialHtml = INITIAL_HTML } = {}) {
  const editorRef = useRef(null)
  const [tbVisible, setTbVisible] = useState(false)
  const [tbX, setTbX] = useState(0)
  const [tbY, setTbY] = useState(0)
  const [fmt, setFmt] = useState({ bold: false, italic: false, underline: false, strike: false })
  const [linkMode, setLinkMode] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const savedRange = useRef(null)
  const linkInputRef = useRef(null)
  // Ref mirror so selectionchange handler avoids stale closure on linkMode
  const linkModeRef = useRef(false)

  useEffect(() => { linkModeRef.current = linkMode }, [linkMode])

  // Inject initial HTML once; never update — let the browser own the DOM
  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = initialHtml
  }, [])

  const readFmt = () => ({
    bold: document.queryCommandState('bold'),
    italic: document.queryCommandState('italic'),
    underline: document.queryCommandState('underline'),
    strike: document.queryCommandState('strikeThrough'),
  })

  const onSelectionChange = useCallback(() => {
    if (linkModeRef.current) return
    const sel = window.getSelection()
    const editor = editorRef.current
    if (!sel || sel.isCollapsed || sel.rangeCount === 0 || !editor) { setTbVisible(false); return }
    const range = sel.getRangeAt(0)
    if (!editor.contains(range.commonAncestorContainer)) { setTbVisible(false); return }
    const rect = range.getBoundingClientRect()
    if (rect.width < 2) { setTbVisible(false); return }
    setTbX(rect.left + rect.width / 2)
    setTbY(rect.top)
    setFmt(readFmt())
    setTbVisible(true)
  }, [])

  useEffect(() => {
    const onScroll = () => { if (!linkModeRef.current) setTbVisible(false) }
    document.addEventListener('selectionchange', onSelectionChange)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [onSelectionChange])

  const handleFormat = (cmd) => { document.execCommand(cmd, false); setFmt(readFmt()) }

  const handleLink = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange()
    setLinkMode(true)
    setLinkUrl('')
    setTimeout(() => linkInputRef.current?.focus(), 20)
  }

  const applyLink = () => {
    if (savedRange.current) {
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(savedRange.current)
      const raw = linkUrl.trim()
      if (raw) {
        const url = /^https?:\\/\\//i.test(raw) ? raw : \`https://\${raw}\`
        document.execCommand('createLink', false, url)
      }
    }
    setLinkMode(false)
    setTbVisible(false)
    savedRange.current = null
  }

  const cancelLink = () => { setLinkMode(false); setTbVisible(false); savedRange.current = null }

  return (
    <>
      <style>{\`
        [data-te] a { color: inherit; text-decoration: underline dotted rgba(0,0,0,0.4); cursor: pointer; }
        [data-te] a:hover { text-decoration: underline; }
        [data-te]:focus { outline: none; }
        [data-te] ::selection { background: rgba(0,0,0,0.1); }
      \`}</style>
      <div
        ref={editorRef}
        data-te=""
        contentEditable
        suppressContentEditableWarning
        style={{
          outline: 'none',
          fontFamily: font,
          fontSize: 15,
          lineHeight: 1.75,
          color: '#0a0a0a',
          letterSpacing: '-0.015em',
          caretColor: '#0a0a0a',
          minHeight: 120,
        }}
      />
      <Toolbar
        visible={tbVisible} x={tbX} y={tbY} fmt={fmt}
        linkMode={linkMode} linkUrl={linkUrl} linkInputRef={linkInputRef}
        onFormat={handleFormat} onLink={handleLink} onLinkChange={setLinkUrl}
        onApply={applyLink} onCancel={cancelLink}
      />
    </>
  )
}

// Usage
export default function App() {
  return (
    <div style={{ padding: 32, maxWidth: 600, fontFamily: font }}>
      <InlineTextEditor />
    </div>
  )
}`

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TextEditorPage() {
  return (
    <div style={{ background: '#fff' }}>
      <Demo />

      <div style={{ background: '#0a0a0a', padding: 'clamp(24px, 4vw, 48px)' as any, fontFamily: font }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>
                Inline Text Editor
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                Drop into any React project — zero dependencies
              </div>
            </div>
            <CopyButton text={CODE_SOURCE} />
          </div>

          <div style={{
            background: '#111',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '10px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center',
            }}>
              <div style={{
                fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500,
                fontFamily: 'ui-monospace, monospace',
              }}>
                InlineTextEditor.tsx
              </div>
            </div>
            <pre style={{
              margin: 0, padding: '20px',
              overflowX: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
              fontSize: 12.5, lineHeight: 1.65, color: '#e5e5e5',
              scrollbarWidth: 'thin' as any,
              scrollbarColor: 'rgba(255,255,255,0.1) transparent',
            }}>
              <code>{CODE_SOURCE}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
