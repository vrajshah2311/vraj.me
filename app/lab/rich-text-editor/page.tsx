'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Tool config ──────────────────────────────────────────────────────────────

interface Tool {
  cmd: string
  label: string
  title: string
  fontWeight?: number
  fontStyle?: 'italic' | 'normal'
  textDecoration?: string
}

const TOOLS: Tool[] = [
  { cmd: 'bold',          label: 'B', title: 'Bold',          fontWeight: 700                    },
  { cmd: 'italic',        label: 'I', title: 'Italic',        fontStyle: 'italic'                },
  { cmd: 'underline',     label: 'U', title: 'Underline',     textDecoration: 'underline'        },
  { cmd: 'strikeThrough', label: 'S', title: 'Strikethrough', textDecoration: 'line-through'     },
]

// ─── Floating toolbar ─────────────────────────────────────────────────────────

function FormatToolbar({ x, y, visible, activeFormats, onFormat }: {
  x: number
  y: number
  visible: boolean
  activeFormats: Set<string>
  onFormat: (cmd: string) => void
}) {
  return (
    <div
      onMouseDown={e => e.preventDefault()}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: visible
          ? 'translateX(-50%) translateY(0px) scale(1)'
          : 'translateX(-50%) translateY(6px) scale(0.92)',
        transformOrigin: 'bottom center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 150ms ease, transform 150ms cubic-bezier(0.32, 0.72, 0, 1)',
        pointerEvents: visible ? 'auto' : 'none',
        zIndex: 50,
        userSelect: 'none',
      }}
    >
      {/* Pill */}
      <div style={{
        background: '#111',
        borderRadius: 8,
        padding: 3,
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.12)',
        whiteSpace: 'nowrap',
      }}>
        {TOOLS.map(tool => {
          const isActive = activeFormats.has(tool.cmd)
          return (
            <button
              key={tool.cmd}
              title={tool.title}
              onMouseDown={e => { e.preventDefault(); onFormat(tool.cmd) }}
              style={{
                padding: '5px 9px',
                background: isActive ? 'rgba(255,255,255,0.16)' : 'transparent',
                border: 'none',
                borderRadius: 5,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.62)',
                fontSize: 12,
                lineHeight: 1,
                cursor: 'pointer',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                transition: 'background 100ms ease, color 100ms ease',
                fontWeight: tool.fontWeight ?? 400,
                fontStyle: tool.fontStyle ?? 'normal',
                textDecoration: tool.textDecoration ?? 'none',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = isActive
                  ? 'rgba(255,255,255,0.16)' : 'transparent'
              }}
            >
              {tool.label}
            </button>
          )
        })}

        <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.14)', margin: '0 3px', flexShrink: 0 }} />

        <button
          title="Add link"
          onMouseDown={e => {
            e.preventDefault()
            const url = window.prompt('URL:')
            if (url) document.execCommand('createLink', false, url)
          }}
          style={{
            padding: '5px 8px',
            background: 'transparent',
            border: 'none',
            borderRadius: 5,
            color: 'rgba(255,255,255,0.62)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.05em',
            lineHeight: 1,
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            transition: 'background 100ms ease, color 100ms ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
        >
          LINK
        </button>
      </div>

      {/* Arrow pointing down toward selection */}
      <div style={{
        position: 'absolute',
        bottom: -4,
        left: '50%',
        transform: 'translateX(-50%) rotate(45deg)',
        width: 7,
        height: 7,
        background: '#111',
        borderRadius: '0 0 2px 0',
      }} />
    </div>
  )
}

// ─── Editor ───────────────────────────────────────────────────────────────────

const INIT_HTML = [
  '<p>Select any text to reveal the <strong>floating format bar</strong>.',
  ' Try making words <em>italic</em>, <u>underlined</u>, or <s>struck through</s>.</p>',
  '<p>This editor has zero dependencies — just the browser\'s native selection API.',
  ' Cmd+B, Cmd+I, and Cmd+U shortcuts work natively too.</p>',
].join('')

function RichTextEditor() {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [toolPos,        setToolPos]        = useState({ x: 0, y: 0 })
  const [toolbarVisible, setToolbarVisible] = useState(false)
  const [activeFormats,  setActiveFormats]  = useState(new Set<string>())

  // Set initial HTML once — never touch it again via React
  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = INIT_HTML
  }, [])

  const getActiveFormats = (): Set<string> => {
    const s = new Set<string>()
    if (document.queryCommandState('bold'))          s.add('bold')
    if (document.queryCommandState('italic'))        s.add('italic')
    if (document.queryCommandState('underline'))     s.add('underline')
    if (document.queryCommandState('strikeThrough')) s.add('strikeThrough')
    return s
  }

  const onSelectionChange = useCallback(() => {
    const sel = window.getSelection()

    if (!sel || sel.isCollapsed || !sel.rangeCount) {
      if (hideTimer.current) clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => setToolbarVisible(false), 120)
      return
    }

    const range   = sel.getRangeAt(0)
    const editor  = editorRef.current
    const wrapper = wrapRef.current

    if (!editor?.contains(range.commonAncestorContainer) || !wrapper) {
      setToolbarVisible(false)
      return
    }

    if (hideTimer.current) clearTimeout(hideTimer.current)

    const selR  = range.getBoundingClientRect()
    const wrapR = wrapper.getBoundingClientRect()

    const x = Math.max(72, Math.min(
      selR.left - wrapR.left + selR.width / 2,
      wrapR.width - 72,
    ))
    const y = Math.max(4, selR.top - wrapR.top - 50)

    setToolPos({ x, y })
    setActiveFormats(getActiveFormats())
    setToolbarVisible(true)
  }, [])

  useEffect(() => {
    document.addEventListener('selectionchange', onSelectionChange)
    return () => document.removeEventListener('selectionchange', onSelectionChange)
  }, [onSelectionChange])

  const applyFormat = (cmd: string) => {
    document.execCommand(cmd, false)
    editorRef.current?.focus()
    setActiveFormats(getActiveFormats())
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', maxWidth: 520 }}>
      <FormatToolbar
        x={toolPos.x}
        y={toolPos.y}
        visible={toolbarVisible}
        activeFormats={activeFormats}
        onFormat={applyFormat}
      />
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        style={{
          minHeight: 200,
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: 14,
          padding: '18px 20px',
          fontSize: 14,
          lineHeight: 1.8,
          color: '#0a0a0a',
          outline: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          letterSpacing: '-0.015em',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)',
          cursor: 'text',
          boxSizing: 'border-box' as const,
          wordBreak: 'break-word' as const,
        }}
      />
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const TOOLS = [
  { cmd: 'bold',          label: 'B', title: 'Bold',          fontWeight: 700                },
  { cmd: 'italic',        label: 'I', title: 'Italic',        fontStyle: 'italic'            },
  { cmd: 'underline',     label: 'U', title: 'Underline',     textDecoration: 'underline'    },
  { cmd: 'strikeThrough', label: 'S', title: 'Strikethrough', textDecoration: 'line-through' },
]

function FormatToolbar({ x, y, visible, activeFormats, onFormat }) {
  return (
    <div
      onMouseDown={e => e.preventDefault()}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: visible
          ? 'translateX(-50%) translateY(0px) scale(1)'
          : 'translateX(-50%) translateY(6px) scale(0.92)',
        transformOrigin: 'bottom center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 150ms ease, transform 150ms cubic-bezier(0.32, 0.72, 0, 1)',
        pointerEvents: visible ? 'auto' : 'none',
        zIndex: 50,
        userSelect: 'none',
      }}
    >
      <div style={{
        background: '#111',
        borderRadius: 8,
        padding: 3,
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.12)',
        whiteSpace: 'nowrap',
      }}>
        {TOOLS.map(tool => {
          const isActive = activeFormats.has(tool.cmd)
          return (
            <button
              key={tool.cmd}
              title={tool.title}
              onMouseDown={e => { e.preventDefault(); onFormat(tool.cmd) }}
              style={{
                padding: '5px 9px',
                background: isActive ? 'rgba(255,255,255,0.16)' : 'transparent',
                border: 'none',
                borderRadius: 5,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.62)',
                fontSize: 12,
                lineHeight: 1,
                cursor: 'pointer',
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                transition: 'background 100ms ease, color 100ms ease',
                fontWeight: tool.fontWeight ?? 400,
                fontStyle: tool.fontStyle ?? 'normal',
                textDecoration: tool.textDecoration ?? 'none',
              }}
            >
              {tool.label}
            </button>
          )
        })}

        <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.14)', margin: '0 3px' }} />

        <button
          title="Add link"
          onMouseDown={e => {
            e.preventDefault()
            const url = window.prompt('URL:')
            if (url) document.execCommand('createLink', false, url)
          }}
          style={{
            padding: '5px 8px',
            background: 'transparent',
            border: 'none',
            borderRadius: 5,
            color: 'rgba(255,255,255,0.62)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.05em',
            lineHeight: 1,
            cursor: 'pointer',
          }}
        >
          LINK
        </button>
      </div>

      {/* Arrow pointing down toward selection */}
      <div style={{
        position: 'absolute',
        bottom: -4,
        left: '50%',
        transform: 'translateX(-50%) rotate(45deg)',
        width: 7,
        height: 7,
        background: '#111',
        borderRadius: '0 0 2px 0',
      }} />
    </div>
  )
}

const INIT_HTML = \`<p>Select any text to reveal the <strong>floating format bar</strong>.
Try making words <em>italic</em>, <u>underlined</u>, or <s>struck through</s>.</p>
<p>Zero dependencies — just the browser's native selection API.</p>\`

export function RichTextEditor() {
  const wrapRef   = useRef(null)
  const editorRef = useRef(null)
  const hideTimer = useRef(null)
  const [toolPos,        setToolPos]        = useState({ x: 0, y: 0 })
  const [toolbarVisible, setToolbarVisible] = useState(false)
  const [activeFormats,  setActiveFormats]  = useState(new Set())

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = INIT_HTML
  }, [])

  const getActiveFormats = () => {
    const s = new Set()
    if (document.queryCommandState('bold'))          s.add('bold')
    if (document.queryCommandState('italic'))        s.add('italic')
    if (document.queryCommandState('underline'))     s.add('underline')
    if (document.queryCommandState('strikeThrough')) s.add('strikeThrough')
    return s
  }

  const onSelectionChange = useCallback(() => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || !sel.rangeCount) {
      if (hideTimer.current) clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => setToolbarVisible(false), 120)
      return
    }
    const range   = sel.getRangeAt(0)
    const editor  = editorRef.current
    const wrapper = wrapRef.current
    if (!editor?.contains(range.commonAncestorContainer) || !wrapper) {
      setToolbarVisible(false)
      return
    }
    if (hideTimer.current) clearTimeout(hideTimer.current)
    const selR  = range.getBoundingClientRect()
    const wrapR = wrapper.getBoundingClientRect()
    const x = Math.max(72, Math.min(selR.left - wrapR.left + selR.width / 2, wrapR.width - 72))
    const y = Math.max(4, selR.top - wrapR.top - 50)
    setToolPos({ x, y })
    setActiveFormats(getActiveFormats())
    setToolbarVisible(true)
  }, [])

  useEffect(() => {
    document.addEventListener('selectionchange', onSelectionChange)
    return () => document.removeEventListener('selectionchange', onSelectionChange)
  }, [onSelectionChange])

  const applyFormat = (cmd) => {
    document.execCommand(cmd, false)
    editorRef.current?.focus()
    setActiveFormats(getActiveFormats())
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', maxWidth: 520 }}>
      <FormatToolbar
        x={toolPos.x}
        y={toolPos.y}
        visible={toolbarVisible}
        activeFormats={activeFormats}
        onFormat={applyFormat}
      />
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        style={{
          minHeight: 200,
          background: '#fff',
          border: '1px solid rgba(10,10,10,0.08)',
          borderRadius: 14,
          padding: '18px 20px',
          fontSize: 14,
          lineHeight: 1.8,
          color: '#0a0a0a',
          outline: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          letterSpacing: '-0.015em',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)',
          cursor: 'text',
        }}
      />
    </div>
  )
}

// Usage: drop <RichTextEditor /> anywhere in your app.`

// ─── Page ─────────────────────────────────────────────────────────────────────

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
        gap: 16,
      }}>
        <p style={{
          margin: '0 0 4px',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          color: 'rgba(10,10,10,0.3)',
        }}>
          Rich Text Editor
        </p>

        <RichTextEditor />

        <p style={{
          margin: '4px 0 0',
          fontSize: 12,
          color: 'rgba(10,10,10,0.35)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
        }}>
          Select text to format · Cmd+B, Cmd+I, Cmd+U also work
        </p>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          color: 'var(--text-muted, rgba(10,10,10,0.4))',
          marginBottom: '12px',
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
