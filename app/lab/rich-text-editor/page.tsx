'use client'

import React, { useState, useEffect, useRef } from 'react'

// ─── Initial HTML ──────────────────────────────────────────────────────────────

const INITIAL_HTML =
  '<p>Select any text to reveal the <strong>formatting toolbar</strong>. Try making text <em>italic</em>, <u>underlined</u>, or convert a paragraph to a heading.</p>' +
  '<p>Powered by the browser\'s native <code style="background:rgba(10,10,10,0.06);padding:2px 5px;border-radius:4px;font-size:0.88em;font-family:ui-monospace,monospace">contentEditable</code> API — no libraries required. Click anywhere to start editing.</p>'

// ─── Format state ──────────────────────────────────────────────────────────────

function getFormats() {
  try {
    return {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
    }
  } catch {
    return { bold: false, italic: false, underline: false, strikeThrough: false }
  }
}

// ─── FormatBtn ─────────────────────────────────────────────────────────────────

function FormatBtn({
  children, title, active, wide, onFmt,
}: {
  children: React.ReactNode
  title: string
  active: boolean
  wide?: boolean
  onFmt: () => void
}) {
  const [hov, setHov] = useState(false)
  return (
    <button
      title={title}
      onMouseDown={e => { e.preventDefault(); onFmt() }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: active ? 'rgba(255,255,255,0.16)' : hov ? 'rgba(255,255,255,0.09)' : 'transparent',
        border: 'none',
        color: active ? '#ffffff' : 'rgba(255,255,255,0.72)',
        width: wide ? '34px' : '28px',
        height: '26px',
        padding: 0,
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background 120ms ease, color 120ms ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {children}
    </button>
  )
}

// ─── Separator ─────────────────────────────────────────────────────────────────

const SEP = (
  <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)', margin: '0 2px', flexShrink: 0 }} />
)

// ─── RichTextEditor ────────────────────────────────────────────────────────────

function RichTextEditor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [toolbar, setToolbar] = useState({
    x: 0, y: 0, visible: false,
    bold: false, italic: false, underline: false, strikeThrough: false,
  })
  const [focused, setFocused] = useState(false)

  // Set initial content once (avoid SSR mismatch)
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = INITIAL_HTML
    }
  }, [])

  // Show/position toolbar whenever the selection changes
  useEffect(() => {
    const onSelChange = () => {
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed || !editorRef.current) {
        setToolbar(t => ({ ...t, visible: false }))
        return
      }
      const range = sel.getRangeAt(0)
      if (!editorRef.current.contains(range.commonAncestorContainer)) {
        setToolbar(t => ({ ...t, visible: false }))
        return
      }
      const rect = range.getBoundingClientRect()
      if (!rect.width) { setToolbar(t => ({ ...t, visible: false })); return }
      setToolbar({
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top),
        visible: true,
        ...getFormats(),
      })
    }
    document.addEventListener('selectionchange', onSelChange)
    return () => document.removeEventListener('selectionchange', onSelChange)
  }, [])

  const applyFmt = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val)
    setToolbar(t => ({ ...t, ...getFormats() }))
  }

  // Pre-computed transform avoids template literals (easier to copy/paste)
  const tbTransform = toolbar.visible
    ? 'translateX(-50%) translateY(calc(-100% - 10px))'
    : 'translateX(-50%) translateY(calc(-100% - 2px))'

  const cardBorder = focused ? '1px solid rgba(10,10,10,0.2)' : '1px solid rgba(10,10,10,0.08)'
  const cardShadow = focused
    ? '0 0 0 3px rgba(10,10,10,0.06), 0 2px 8px rgba(0,0,0,0.06)'
    : '0 1px 4px rgba(0,0,0,0.04)'

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>

      {/* Floating formatting toolbar */}
      <div style={{
        position: 'fixed',
        left: toolbar.x,
        top: toolbar.y,
        transform: tbTransform,
        opacity: toolbar.visible ? 1 : 0,
        pointerEvents: toolbar.visible ? 'auto' : 'none',
        transition: 'opacity 150ms ease, transform 150ms cubic-bezier(0.32, 0.72, 0, 1)',
        zIndex: 9999,
        background: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '9px',
        padding: '3px',
        display: 'flex',
        alignItems: 'center',
        gap: '1px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.32), 0 2px 6px rgba(0,0,0,0.16)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}>
        <FormatBtn title="Bold (⌘B)" active={toolbar.bold} onFmt={() => applyFmt('bold')}>
          <span style={{ fontWeight: 700, fontSize: '13px' }}>B</span>
        </FormatBtn>
        <FormatBtn title="Italic (⌘I)" active={toolbar.italic} onFmt={() => applyFmt('italic')}>
          <span style={{ fontStyle: 'italic', fontSize: '13px' }}>I</span>
        </FormatBtn>
        <FormatBtn title="Underline (⌘U)" active={toolbar.underline} onFmt={() => applyFmt('underline')}>
          <span style={{ textDecoration: 'underline', fontSize: '13px' }}>U</span>
        </FormatBtn>
        <FormatBtn title="Strikethrough" active={toolbar.strikeThrough} onFmt={() => applyFmt('strikeThrough')}>
          <span style={{ textDecoration: 'line-through', fontSize: '13px' }}>S</span>
        </FormatBtn>
        {SEP}
        <FormatBtn title="Heading 1" active={false} wide onFmt={() => applyFmt('formatBlock', 'h1')}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '-0.02em' }}>H1</span>
        </FormatBtn>
        <FormatBtn title="Heading 2" active={false} wide onFmt={() => applyFmt('formatBlock', 'h2')}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '-0.02em' }}>H2</span>
        </FormatBtn>
        {SEP}
        <FormatBtn title="Code block" active={false} wide onFmt={() => applyFmt('formatBlock', 'pre')}>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '10px' }}>{'</>'}</span>
        </FormatBtn>
        <FormatBtn title="Quote" active={false} wide onFmt={() => applyFmt('formatBlock', 'blockquote')}>
          <span style={{ fontSize: '14px', lineHeight: 1, marginTop: '-1px' }}>"</span>
        </FormatBtn>
      </div>

      {/* Editor card */}
      <div style={{
        background: '#ffffff',
        border: cardBorder,
        borderRadius: '14px',
        boxShadow: cardShadow,
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
        overflow: 'hidden',
      }}>
        {/* Chrome-style title bar */}
        <div style={{
          padding: '10px 16px 9px',
          borderBottom: '1px solid rgba(10,10,10,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10,10,10,0.015)',
        }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'rgba(10,10,10,0.38)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
            letterSpacing: '-0.01em',
          }}>
            Rich Text Editor
          </span>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {(['#ff5f57', '#febc2e', '#28c840'] as const).map(c => (
              <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
            ))}
          </div>
        </div>

        {/* Editable content area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            padding: '20px 24px 28px',
            minHeight: '190px',
            outline: 'none',
            fontSize: '15px',
            lineHeight: '1.68',
            color: '#0a0a0a',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
            letterSpacing: '-0.01em',
            caretColor: '#0a0a0a',
          }}
        />
      </div>

      {/* Hint */}
      <p style={{
        textAlign: 'center',
        margin: '14px 0 0',
        fontSize: '12px',
        color: 'rgba(10,10,10,0.35)',
        fontWeight: 500,
        letterSpacing: '-0.01em',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}>
        Click to edit · Select text to reveal toolbar
      </p>
    </div>
  )
}

// ─── Source code for copy ──────────────────────────────────────────────────────

const CODE = `'use client'

import React, { useState, useEffect, useRef } from 'react'

const INITIAL_HTML =
  '<p>Select any text to reveal the <strong>formatting toolbar</strong>.</p>' +
  '<p>Powered by the browser native contentEditable API — no libraries required.</p>'

function getFormats() {
  try {
    return {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
    }
  } catch {
    return { bold: false, italic: false, underline: false, strikeThrough: false }
  }
}

function FormatBtn({ children, title, active, wide, onFmt }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      title={title}
      onMouseDown={e => { e.preventDefault(); onFmt() }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: active ? 'rgba(255,255,255,0.16)' : hov ? 'rgba(255,255,255,0.09)' : 'transparent',
        border: 'none',
        color: active ? '#ffffff' : 'rgba(255,255,255,0.72)',
        width: wide ? '34px' : '28px',
        height: '26px',
        padding: 0,
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background 120ms ease, color 120ms ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {children}
    </button>
  )
}

const SEP = (
  <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)', margin: '0 2px', flexShrink: 0 }} />
)

export function RichTextEditor() {
  const editorRef = useRef(null)
  const [toolbar, setToolbar] = useState({
    x: 0, y: 0, visible: false,
    bold: false, italic: false, underline: false, strikeThrough: false,
  })
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = INITIAL_HTML
    }
  }, [])

  useEffect(() => {
    const onSelChange = () => {
      const sel = window.getSelection()
      if (!sel || sel.isCollapsed || !editorRef.current) {
        setToolbar(t => ({ ...t, visible: false }))
        return
      }
      const range = sel.getRangeAt(0)
      if (!editorRef.current.contains(range.commonAncestorContainer)) {
        setToolbar(t => ({ ...t, visible: false }))
        return
      }
      const rect = range.getBoundingClientRect()
      if (!rect.width) { setToolbar(t => ({ ...t, visible: false })); return }
      setToolbar({
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top),
        visible: true,
        ...getFormats(),
      })
    }
    document.addEventListener('selectionchange', onSelChange)
    return () => document.removeEventListener('selectionchange', onSelChange)
  }, [])

  const applyFmt = (cmd, val) => {
    document.execCommand(cmd, false, val)
    setToolbar(t => ({ ...t, ...getFormats() }))
  }

  const tbTransform = toolbar.visible
    ? 'translateX(-50%) translateY(calc(-100% - 10px))'
    : 'translateX(-50%) translateY(calc(-100% - 2px))'

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
      {/* Floating toolbar */}
      <div style={{
        position: 'fixed',
        left: toolbar.x,
        top: toolbar.y,
        transform: tbTransform,
        opacity: toolbar.visible ? 1 : 0,
        pointerEvents: toolbar.visible ? 'auto' : 'none',
        transition: 'opacity 150ms ease, transform 150ms cubic-bezier(0.32, 0.72, 0, 1)',
        zIndex: 9999,
        background: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '9px',
        padding: '3px',
        display: 'flex',
        alignItems: 'center',
        gap: '1px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.32), 0 2px 6px rgba(0,0,0,0.16)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}>
        <FormatBtn title="Bold (Cmd+B)" active={toolbar.bold} onFmt={() => applyFmt('bold')}>
          <span style={{ fontWeight: 700, fontSize: '13px' }}>B</span>
        </FormatBtn>
        <FormatBtn title="Italic (Cmd+I)" active={toolbar.italic} onFmt={() => applyFmt('italic')}>
          <span style={{ fontStyle: 'italic', fontSize: '13px' }}>I</span>
        </FormatBtn>
        <FormatBtn title="Underline (Cmd+U)" active={toolbar.underline} onFmt={() => applyFmt('underline')}>
          <span style={{ textDecoration: 'underline', fontSize: '13px' }}>U</span>
        </FormatBtn>
        <FormatBtn title="Strikethrough" active={toolbar.strikeThrough} onFmt={() => applyFmt('strikeThrough')}>
          <span style={{ textDecoration: 'line-through', fontSize: '13px' }}>S</span>
        </FormatBtn>
        {SEP}
        <FormatBtn title="Heading 1" active={false} wide onFmt={() => applyFmt('formatBlock', 'h1')}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '-0.02em' }}>H1</span>
        </FormatBtn>
        <FormatBtn title="Heading 2" active={false} wide onFmt={() => applyFmt('formatBlock', 'h2')}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '-0.02em' }}>H2</span>
        </FormatBtn>
        {SEP}
        <FormatBtn title="Code block" active={false} wide onFmt={() => applyFmt('formatBlock', 'pre')}>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '10px' }}>{'</>'}</span>
        </FormatBtn>
        <FormatBtn title="Quote" active={false} wide onFmt={() => applyFmt('formatBlock', 'blockquote')}>
          <span style={{ fontSize: '14px', lineHeight: 1, marginTop: '-1px' }}>"</span>
        </FormatBtn>
      </div>

      {/* Editor card */}
      <div style={{
        background: '#ffffff',
        border: focused ? '1px solid rgba(10,10,10,0.2)' : '1px solid rgba(10,10,10,0.08)',
        borderRadius: '14px',
        boxShadow: focused
          ? '0 0 0 3px rgba(10,10,10,0.06), 0 2px 8px rgba(0,0,0,0.06)'
          : '0 1px 4px rgba(0,0,0,0.04)',
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
        overflow: 'hidden',
      }}>
        {/* Title bar */}
        <div style={{
          padding: '10px 16px 9px',
          borderBottom: '1px solid rgba(10,10,10,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(10,10,10,0.015)',
        }}>
          <span style={{
            fontSize: '12px', fontWeight: 500, color: 'rgba(10,10,10,0.38)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
            letterSpacing: '-0.01em',
          }}>Rich Text Editor</span>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => (
              <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
            ))}
          </div>
        </div>

        {/* Editable content */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            padding: '20px 24px 28px',
            minHeight: '190px',
            outline: 'none',
            fontSize: '15px',
            lineHeight: '1.68',
            color: '#0a0a0a',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
            letterSpacing: '-0.01em',
            caretColor: '#0a0a0a',
          }}
        />
      </div>

      <p style={{
        textAlign: 'center', margin: '14px 0 0', fontSize: '12px',
        color: 'rgba(10,10,10,0.35)', fontWeight: 500, letterSpacing: '-0.01em',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}>
        Click to edit · Select text to reveal toolbar
      </p>
    </div>
  )
}`

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function RichTextEditorPage() {
  return (
    <main style={{
      backgroundColor: 'var(--bg, #ffffff)',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
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
        <RichTextEditor />
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-muted, rgba(10,10,10,0.4))',
          marginBottom: '12px',
          margin: '0 0 12px',
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
