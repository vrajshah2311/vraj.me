'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'
const MONO = 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace'

// ─── SplitPane ────────────────────────────────────────────────────────────────

type Direction = 'horizontal' | 'vertical'

function SplitPane({
  direction = 'horizontal',
  initialSplit = 50,
  minA = 20,
  minB = 20,
  first,
  second,
}: {
  direction?: Direction
  initialSplit?: number
  minA?: number
  minB?: number
  first: React.ReactNode
  second: React.ReactNode
}) {
  const [split, setSplit] = useState(initialSplit)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isH = direction === 'horizontal'

  const startDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  useEffect(() => {
    if (!dragging) return

    const onMove = (e: MouseEvent | TouchEvent) => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const clientPos = 'touches' in e
        ? (isH ? e.touches[0].clientX : e.touches[0].clientY)
        : (isH ? e.clientX : e.clientY)
      const origin = isH ? rect.left : rect.top
      const size = isH ? rect.width : rect.height
      const pct = Math.min(100 - minB, Math.max(minA, ((clientPos - origin) / size) * 100))
      setSplit(pct)
    }

    const onUp = () => setDragging(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [dragging, isH, minA, minB])

  const resetSplit = () => setSplit(initialSplit)

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: isH ? 'row' : 'column',
        width: '100%',
        height: '100%',
        userSelect: dragging ? 'none' : 'auto',
        cursor: dragging ? (isH ? 'col-resize' : 'row-resize') : 'default',
      }}
    >
      {/* First pane */}
      <div style={{
        [isH ? 'width' : 'height']: `${split}%`,
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {first}
      </div>

      {/* Divider */}
      <div
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        onDoubleClick={resetSplit}
        style={{
          [isH ? 'width' : 'height']: '5px',
          flexShrink: 0,
          cursor: isH ? 'col-resize' : 'row-resize',
          background: dragging ? 'rgba(10,10,10,0.12)' : 'transparent',
          transition: 'background 150ms ease',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(10,10,10,0.08)' }}
        onMouseLeave={e => { if (!dragging) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
      >
        {/* Visual handle */}
        <div style={{
          [isH ? 'width' : 'height']: '1px',
          [isH ? 'height' : 'width']: '100%',
          background: dragging ? 'rgba(10,10,10,0.25)' : 'rgba(10,10,10,0.1)',
          transition: 'background 150ms ease',
          position: 'absolute',
        }} />
        <div style={{
          position: 'absolute',
          [isH ? 'width' : 'height']: '3px',
          [isH ? 'height' : 'width']: '24px',
          borderRadius: '999px',
          background: dragging ? '#0a0a0a' : 'rgba(10,10,10,0.25)',
          transition: 'background 150ms ease, transform 150ms ease',
          transform: dragging ? 'scale(1.2)' : 'scale(1)',
        }} />
      </div>

      {/* Second pane */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        minWidth: 0,
        minHeight: 0,
      }}>
        {second}
      </div>
    </div>
  )
}

// ─── Demo: File Explorer ──────────────────────────────────────────────────────

const FILES = [
  { name: 'index.tsx',    lang: 'tsx', content: `export default function Page() {\n  return (\n    <main>\n      <h1>Hello, world</h1>\n    </main>\n  )\n}` },
  { name: 'layout.tsx',   lang: 'tsx', content: `export default function Layout({\n  children,\n}: {\n  children: React.ReactNode\n}) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  )\n}` },
  { name: 'globals.css',  lang: 'css', content: `* {\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0;\n}\n\nbody {\n  font-family: -apple-system, sans-serif;\n  background: #ffffff;\n  color: #0a0a0a;\n}` },
  { name: 'package.json', lang: 'json', content: `{\n  "name": "my-app",\n  "version": "0.1.0",\n  "private": true,\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build"\n  }\n}` },
]

const LANG_COLORS: Record<string, string> = {
  tsx: '#3b82f6',
  css: '#a855f7',
  json: '#f59e0b',
}

function FileExplorerDemo() {
  const [selected, setSelected] = useState(0)

  return (
    <div style={{
      width: '520px',
      maxWidth: '100%',
      height: '260px',
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '14px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      fontFamily: FONT,
    }}>
      <SplitPane
        direction="horizontal"
        initialSplit={32}
        minA={22}
        minB={30}
        first={
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{
              padding: '10px 12px 8px',
              borderBottom: '1px solid rgba(10,10,10,0.06)',
              fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em',
              textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)',
            }}>
              Explorer
            </div>
            {/* File list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
              {FILES.map((f, i) => (
                <button
                  key={f.name}
                  onClick={() => setSelected(i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '5px 12px', border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: selected === i ? 'rgba(10,10,10,0.05)' : 'transparent',
                    transition: 'background 100ms ease',
                  }}
                  onMouseEnter={e => { if (selected !== i) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(10,10,10,0.03)' }}
                  onMouseLeave={e => { if (selected !== i) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                >
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                    background: LANG_COLORS[f.lang] ?? '#888',
                  }} />
                  <span style={{
                    fontSize: '12px', fontWeight: selected === i ? 500 : 400,
                    color: selected === i ? '#0a0a0a' : 'rgba(10,10,10,0.55)',
                    letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', fontFamily: MONO,
                    transition: 'color 100ms ease',
                  }}>
                    {f.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        }
        second={
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Tab bar */}
            <div style={{
              padding: '0 12px',
              borderBottom: '1px solid rgba(10,10,10,0.06)',
              display: 'flex', alignItems: 'center', gap: '0',
            }}>
              <div style={{
                padding: '9px 12px 8px', fontSize: '11px', fontWeight: 500,
                color: '#0a0a0a', borderBottom: '1.5px solid #0a0a0a',
                letterSpacing: '-0.01em', fontFamily: MONO,
              }}>
                {FILES[selected].name}
              </div>
            </div>
            {/* Code */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
              <pre style={{
                margin: 0, fontSize: '11.5px', lineHeight: '1.7',
                color: 'rgba(10,10,10,0.7)', fontFamily: MONO,
                whiteSpace: 'pre',
              }}>
                {FILES[selected].content}
              </pre>
            </div>
          </div>
        }
      />
    </div>
  )
}

// ─── Demo: Notes / Preview ────────────────────────────────────────────────────

const MARKDOWN = `# Meeting Notes

**Date:** June 2, 2026
**Attendees:** Alex, Jordan, Sam

## Agenda

1. Q2 roadmap review
2. Design system update
3. Launch timeline

## Action Items

- [ ] Alex: finalize specs by Friday
- [ ] Jordan: share mockups in Figma
- [ ] Sam: update staging environment

> Ship fast, iterate faster.`

function NotesDemo() {
  const [text, setText] = useState(MARKDOWN)

  const rendered = text
    .replace(/^# (.+)$/m,  '<h1 style="font-size:16px;font-weight:600;letter-spacing:-0.02em;margin:0 0 10px;color:#0a0a0a">$1</h1>')
    .replace(/^## (.+)$/gm,'<h2 style="font-size:13px;font-weight:600;letter-spacing:-0.01em;margin:12px 0 6px;color:#0a0a0a">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g,'<strong style="font-weight:600">$1</strong>')
    .replace(/^> (.+)$/gm, '<blockquote style="margin:10px 0;padding:8px 12px;border-left:2px solid rgba(10,10,10,0.12);color:rgba(10,10,10,0.5);font-style:italic;font-size:12px">$1</blockquote>')
    .replace(/^- \[x\] (.+)$/gm,'<div style="display:flex;gap:6px;align-items:flex-start;margin:3px 0"><span style="color:#16a34a;font-size:11px;margin-top:1px">✓</span><span style="text-decoration:line-through;color:rgba(10,10,10,0.35);font-size:12px">$1</span></div>')
    .replace(/^- \[ \] (.+)$/gm,'<div style="display:flex;gap:6px;align-items:flex-start;margin:3px 0"><span style="color:rgba(10,10,10,0.2);font-size:11px;margin-top:1px">○</span><span style="font-size:12px;color:rgba(10,10,10,0.7)">$1</span></div>')
    .replace(/^(\d+)\. (.+)$/gm,'<div style="display:flex;gap:6px;margin:3px 0;font-size:12px;color:rgba(10,10,10,0.7)"><span style="color:rgba(10,10,10,0.3);min-width:14px">$1.</span><span>$2</span></div>')
    .replace(/\n/g, ' ')

  return (
    <div style={{
      width: '620px',
      maxWidth: '100%',
      height: '280px',
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '14px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      fontFamily: FONT,
    }}>
      <SplitPane
        direction="horizontal"
        initialSplit={50}
        minA={25}
        minB={25}
        first={
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              padding: '8px 12px', borderBottom: '1px solid rgba(10,10,10,0.06)',
              fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em',
              textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)',
            }}>Editor</div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              spellCheck={false}
              style={{
                flex: 1, resize: 'none', border: 'none', outline: 'none',
                padding: '12px 14px', fontSize: '11.5px', lineHeight: '1.7',
                fontFamily: MONO, color: 'rgba(10,10,10,0.75)',
                background: 'transparent',
              }}
            />
          </div>
        }
        second={
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              padding: '8px 12px', borderBottom: '1px solid rgba(10,10,10,0.06)',
              fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em',
              textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)',
            }}>Preview</div>
            <div
              style={{
                flex: 1, overflowY: 'auto', padding: '12px 14px',
                fontSize: '12px', lineHeight: '1.65', color: 'rgba(10,10,10,0.7)',
              }}
              dangerouslySetInnerHTML={{ __html: rendered }}
            />
          </div>
        }
      />
    </div>
  )
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

type Direction = 'horizontal' | 'vertical'

export function SplitPane({
  direction = 'horizontal',
  initialSplit = 50,
  minA = 20,
  minB = 20,
  first,
  second,
}: {
  direction?: Direction
  initialSplit?: number
  minA?: number   // minimum % for first pane
  minB?: number   // minimum % for second pane
  first: React.ReactNode
  second: React.ReactNode
}) {
  const [split, setSplit] = useState(initialSplit)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isH = direction === 'horizontal'

  const startDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  useEffect(() => {
    if (!dragging) return

    const onMove = (e: MouseEvent | TouchEvent) => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const clientPos = 'touches' in e
        ? (isH ? e.touches[0].clientX : e.touches[0].clientY)
        : (isH ? e.clientX : e.clientY)
      const origin = isH ? rect.left : rect.top
      const size = isH ? rect.width : rect.height
      const pct = Math.min(100 - minB, Math.max(minA, ((clientPos - origin) / size) * 100))
      setSplit(pct)
    }

    const onUp = () => setDragging(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [dragging, isH, minA, minB])

  const resetSplit = () => setSplit(initialSplit)

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: isH ? 'row' : 'column',
        width: '100%',
        height: '100%',
        userSelect: dragging ? 'none' : 'auto',
        cursor: dragging ? (isH ? 'col-resize' : 'row-resize') : 'default',
      }}
    >
      {/* First pane */}
      <div style={{
        [isH ? 'width' : 'height']: \`\${split}%\`,
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {first}
      </div>

      {/* Divider — double-click to reset to initialSplit */}
      <div
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        onDoubleClick={resetSplit}
        style={{
          [isH ? 'width' : 'height']: '5px',
          flexShrink: 0,
          cursor: isH ? 'col-resize' : 'row-resize',
          background: dragging ? 'rgba(10,10,10,0.12)' : 'transparent',
          transition: 'background 150ms ease',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.background = 'rgba(10,10,10,0.08)'
        }}
        onMouseLeave={e => {
          if (!dragging)
            (e.currentTarget as HTMLDivElement).style.background = 'transparent'
        }}
      >
        {/* The thin rule */}
        <div style={{
          [isH ? 'width' : 'height']: '1px',
          [isH ? 'height' : 'width']: '100%',
          background: dragging ? 'rgba(10,10,10,0.25)' : 'rgba(10,10,10,0.1)',
          transition: 'background 150ms ease',
          position: 'absolute',
        }} />
        {/* The drag pill */}
        <div style={{
          position: 'absolute',
          [isH ? 'width' : 'height']: '3px',
          [isH ? 'height' : 'width']: '24px',
          borderRadius: '999px',
          background: dragging ? '#0a0a0a' : 'rgba(10,10,10,0.25)',
          transition: 'background 150ms ease, transform 150ms ease',
          transform: dragging ? 'scale(1.2)' : 'scale(1)',
        }} />
      </div>

      {/* Second pane */}
      <div style={{ flex: 1, overflow: 'hidden', minWidth: 0, minHeight: 0 }}>
        {second}
      </div>
    </div>
  )
}

// ── Usage ──────────────────────────────────────────────────────────────────────
//
// <div style={{ width: '600px', height: '300px' }}>
//   <SplitPane
//     direction="horizontal"
//     initialSplit={40}
//     minA={20}
//     minB={20}
//     first={<LeftPanel />}
//     second={<RightPanel />}
//   />
// </div>
//
// direction:    'horizontal' (side-by-side) | 'vertical' (top-bottom)
// initialSplit: starting size of first pane as a percentage (default 50)
// minA / minB:  minimum % for each pane (default 20)
// Double-click the divider to reset to initialSplit.`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SplitPanePage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: '40px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', width: '100%', maxWidth: '620px' }}>
          <p style={{
            margin: 0, fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', fontFamily: FONT,
          }}>File explorer</p>
          <FileExplorerDemo />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', width: '100%', maxWidth: '620px' }}>
          <p style={{
            margin: 0, fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', fontFamily: FONT,
          }}>Editor + preview — try editing the text</p>
          <NotesDemo />
        </div>

        <p style={{
          margin: 0, fontSize: '11px', color: 'rgba(10,10,10,0.3)', fontFamily: FONT,
          letterSpacing: '-0.01em',
        }}>
          Drag the divider to resize · Double-click to reset
        </p>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)',
          marginBottom: '12px', fontFamily: FONT,
        }}>Source</p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
          <pre style={{
            margin: 0,
            fontFamily: MONO,
            fontSize: '12px', lineHeight: '1.65', color: '#e5e5e5',
            whiteSpace: 'pre', overflowX: 'auto',
          }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
