'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// ─── SplitView ────────────────────────────────────────────────────────────────

function SplitView({
  left,
  right,
  defaultSplit = 50,
  minSize = 20,
}: {
  left: React.ReactNode
  right: React.ReactNode
  defaultSplit?: number
  minSize?: number
}) {
  const [split, setSplit] = useState(defaultSplit)
  const [dragging, setDragging] = useState(false)
  const [hovering, setHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const onHandleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    setDragging(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      setSplit(Math.min(100 - minSize, Math.max(minSize, pct)))
    }
    const onMouseUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      setDragging(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [minSize])

  const active = dragging || hovering

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left panel */}
      <div style={{ width: `${split}%`, height: '100%', overflow: 'auto', flexShrink: 0 }}>
        {left}
      </div>

      {/* Divider */}
      <div
        onMouseDown={onHandleMouseDown}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{
          position: 'relative',
          width: '1px',
          height: '100%',
          background: active ? 'rgba(10,10,10,0.2)' : 'rgba(10,10,10,0.08)',
          cursor: 'col-resize',
          flexShrink: 0,
          transition: 'background 150ms ease',
          zIndex: 10,
        }}
      >
        {/* Wide invisible hit target */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '-8px', right: '-8px', zIndex: 1 }} />
        {/* Handle pill */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '4px',
            height: '36px',
            background: active ? '#0a0a0a' : 'rgba(10,10,10,0.2)',
            borderRadius: '2px',
            transition: 'background 150ms ease, transform 150ms ease',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, height: '100%', overflow: 'auto' }}>
        {right}
      </div>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const ACCENT_COLORS = [
  { label: 'Slate',  value: '#0a0a0a' },
  { label: 'Blue',   value: '#2563eb' },
  { label: 'Violet', value: '#7c3aed' },
  { label: 'Green',  value: '#16a34a' },
  { label: 'Rose',   value: '#e11d48' },
  { label: 'Amber',  value: '#d97706' },
]

const SIZES = [
  { key: 'S', padding: '6px 14px',  fontSize: '12px', radius: '7px'  },
  { key: 'M', padding: '9px 20px',  fontSize: '13px', radius: '9px'  },
  { key: 'L', padding: '12px 26px', fontSize: '15px', radius: '11px' },
]

function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{
      margin: '0 0 14px',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'rgba(10,10,10,0.35)',
      fontFamily: FONT,
    }}>
      {children}
    </p>
  )
}

function FieldLabel({ children }: { children: string }) {
  return (
    <p style={{
      margin: '0 0 8px',
      fontSize: '12px',
      fontWeight: 500,
      color: '#0a0a0a',
      fontFamily: FONT,
      letterSpacing: '-0.01em',
    }}>
      {children}
    </p>
  )
}

function Demo() {
  const [accent, setAccent] = useState('#2563eb')
  const [sizeKey, setSizeKey] = useState('M')
  const [label, setLabel] = useState('Get started')
  const [variant, setVariant] = useState<'filled' | 'outline'>('filled')
  const [radius, setRadius] = useState<'default' | 'pill'>('default')

  const size = SIZES.find(s => s.key === sizeKey)!
  const borderRadius = radius === 'pill' ? '999px' : size.radius

  const leftPanel = (
    <div style={{ padding: '20px 20px', height: '100%', boxSizing: 'border-box' }}>
      <SectionLabel>Customize</SectionLabel>

      {/* Color */}
      <div style={{ marginBottom: '20px' }}>
        <FieldLabel>Color</FieldLabel>
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
          {ACCENT_COLORS.map(c => (
            <button
              key={c.value}
              title={c.label}
              onClick={() => setAccent(c.value)}
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: c.value,
                border: 'none',
                outline: accent === c.value ? `2px solid ${c.value}` : '2px solid transparent',
                outlineOffset: '2px',
                cursor: 'pointer',
                padding: 0,
                transition: 'outline 150ms ease',
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div style={{ marginBottom: '20px' }}>
        <FieldLabel>Size</FieldLabel>
        <div style={{ display: 'flex', gap: '4px' }}>
          {SIZES.map(s => (
            <button
              key={s.key}
              onClick={() => setSizeKey(s.key)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: sizeKey === s.key ? '#0a0a0a' : 'rgba(10,10,10,0.12)',
                background: sizeKey === s.key ? '#0a0a0a' : 'transparent',
                color: sizeKey === s.key ? '#fff' : '#0a0a0a',
                fontSize: '12px',
                fontWeight: 500,
                fontFamily: FONT,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {s.key}
            </button>
          ))}
        </div>
      </div>

      {/* Variant */}
      <div style={{ marginBottom: '20px' }}>
        <FieldLabel>Variant</FieldLabel>
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['filled', 'outline'] as const).map(v => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: variant === v ? '#0a0a0a' : 'rgba(10,10,10,0.12)',
                background: variant === v ? '#0a0a0a' : 'transparent',
                color: variant === v ? '#fff' : '#0a0a0a',
                fontSize: '12px',
                fontWeight: 500,
                fontFamily: FONT,
                cursor: 'pointer',
                transition: 'all 150ms ease',
                textTransform: 'capitalize',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Shape */}
      <div style={{ marginBottom: '20px' }}>
        <FieldLabel>Shape</FieldLabel>
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['default', 'pill'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRadius(r)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: radius === r ? '#0a0a0a' : 'rgba(10,10,10,0.12)',
                background: radius === r ? '#0a0a0a' : 'transparent',
                color: radius === r ? '#fff' : '#0a0a0a',
                fontSize: '12px',
                fontWeight: 500,
                fontFamily: FONT,
                cursor: 'pointer',
                transition: 'all 150ms ease',
                textTransform: 'capitalize',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Label */}
      <div>
        <FieldLabel>Label</FieldLabel>
        <input
          value={label}
          onChange={e => setLabel(e.target.value)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '7px 10px',
            borderRadius: '7px',
            border: '1px solid rgba(10,10,10,0.12)',
            fontSize: '13px',
            fontFamily: FONT,
            color: '#0a0a0a',
            outline: 'none',
            background: '#fff',
            transition: 'border-color 150ms ease',
          }}
          onFocus={e => (e.target.style.borderColor = '#0a0a0a')}
          onBlur={e => (e.target.style.borderColor = 'rgba(10,10,10,0.12)')}
        />
      </div>
    </div>
  )

  const rightPanel = (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(10,10,10,0.025)',
      gap: '16px',
    }}>
      <button
        style={{
          padding: size.padding,
          borderRadius,
          fontSize: size.fontSize,
          fontWeight: 600,
          fontFamily: FONT,
          letterSpacing: '-0.01em',
          cursor: 'pointer',
          border: variant === 'outline' ? `1.5px solid ${accent}` : 'none',
          background: variant === 'filled' ? accent : 'transparent',
          color: variant === 'filled' ? '#fff' : accent,
          transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
          lineHeight: 1,
        }}
      >
        {label || 'Button'}
      </button>
      <p style={{
        margin: 0,
        fontSize: '11px',
        color: 'rgba(10,10,10,0.3)',
        fontFamily: FONT,
        letterSpacing: '-0.01em',
      }}>
        Live preview
      </p>
    </div>
  )

  return (
    <div style={{
      width: '700px',
      maxWidth: '100%',
      height: '400px',
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      fontFamily: FONT,
    }}>
      {/* Faux window chrome */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid rgba(10,10,10,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexShrink: 0,
      }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
        <span style={{ marginLeft: '6px', fontSize: '12px', color: 'rgba(10,10,10,0.35)', letterSpacing: '-0.01em' }}>
          Drag the divider to resize panels
        </span>
      </div>

      {/* SplitView fills the rest */}
      <div style={{ height: 'calc(100% - 41px)' }}>
        <SplitView left={leftPanel} right={rightPanel} defaultSplit={48} minSize={28} />
      </div>
    </div>
  )
}

// ─── Code Source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export function SplitView({
  left,
  right,
  defaultSplit = 50,
  minSize = 20,
}: {
  left: React.ReactNode
  right: React.ReactNode
  defaultSplit?: number
  minSize?: number
}) {
  const [split, setSplit] = useState(defaultSplit)
  const [dragging, setDragging] = useState(false)
  const [hovering, setHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const onHandleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    setDragging(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      setSplit(Math.min(100 - minSize, Math.max(minSize, pct)))
    }
    const onMouseUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      setDragging(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [minSize])

  const active = dragging || hovering

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left panel */}
      <div style={{ width: \`\${split}%\`, height: '100%', overflow: 'auto', flexShrink: 0 }}>
        {left}
      </div>

      {/* Divider */}
      <div
        onMouseDown={onHandleMouseDown}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{
          position: 'relative',
          width: '1px',
          height: '100%',
          background: active ? 'rgba(10,10,10,0.2)' : 'rgba(10,10,10,0.08)',
          cursor: 'col-resize',
          flexShrink: 0,
          transition: 'background 150ms ease',
          zIndex: 10,
        }}
      >
        {/* Wide hit target */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '-8px', right: '-8px', zIndex: 1 }} />
        {/* Handle pill */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '4px',
            height: '36px',
            background: active ? '#0a0a0a' : 'rgba(10,10,10,0.2)',
            borderRadius: '2px',
            transition: 'background 150ms ease',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, height: '100%', overflow: 'auto' }}>
        {right}
      </div>
    </div>
  )
}

// Usage — give the container a fixed height, pass any content as left/right:
//
// <div style={{ height: '500px' }}>
//   <SplitView
//     left={<Sidebar />}
//     right={<MainContent />}
//     defaultSplit={35}
//     minSize={20}
//   />
// </div>`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SplitViewPage() {
  return (
    <main style={{
      backgroundColor: 'var(--bg, #ffffff)',
      minHeight: '100vh',
      fontFamily: FONT,
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
        <Demo />
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
