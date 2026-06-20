'use client'

import { useState, useRef } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const BASE = 48
const MAX  = 84
const R    = 160   // influence radius in px

// ─── Types ────────────────────────────────────────────────────────────────────

interface DockItem {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

type DockEntry = DockItem | { separator: true }

function isSep(e: DockEntry): e is { separator: true } {
  return 'separator' in e && e.separator === true
}

// ─── FloatingDock ─────────────────────────────────────────────────────────────

function FloatingDock({
  items,
  base = BASE,
  max  = MAX,
  radius = R,
}: {
  items: DockEntry[]
  base?: number
  max?: number
  radius?: number
}) {
  const dockRef  = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [scales,       setScales]       = useState<number[]>(items.map(() => 1))
  const [hoveredIndex, setHoveredIndex] = useState(-1)
  const [isHovering,   setIsHovering]   = useState(false)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const newScales = items.map(() => 1)
    let topScale = 1
    let topIdx   = -1

    items.forEach((item, i) => {
      if (isSep(item)) return
      const el = itemRefs.current[i]
      if (!el) return
      const r   = el.getBoundingClientRect()
      const cx  = r.left + r.width / 2
      const d   = Math.abs(e.clientX - cx)
      const t   = Math.max(0, 1 - d / radius)
      const st  = (1 - Math.cos(t * Math.PI)) / 2      // cosine ease for smooth falloff
      const s   = 1 + (max / base - 1) * st
      newScales[i] = s
      if (s > topScale) { topScale = s; topIdx = i }
    })

    setScales(newScales)
    setHoveredIndex(topIdx)
  }

  const onMouseLeave = () => {
    setIsHovering(false)
    setScales(items.map(() => 1))
    setHoveredIndex(-1)
  }

  const borderR = Math.round(base * 0.224)   // macOS icon radius ratio

  return (
    <div
      ref={dockRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={() => setIsHovering(true)}
      style={{
        display: 'inline-flex',
        alignItems: 'flex-end',
        gap: 6,
        padding: '10px 14px',
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderRadius: 22,
        border: '1px solid rgba(255,255,255,0.85)',
        boxShadow:
          '0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
      }}
    >
      {items.map((item, i) => {
        if (isSep(item)) {
          return (
            <div
              key={`s${i}`}
              style={{
                width: 1,
                height: base * 0.55,
                background: 'rgba(10,10,10,0.13)',
                margin: '0 4px',
                alignSelf: 'center',
                flexShrink: 0,
              }}
            />
          )
        }

        const scale     = scales[i] ?? 1
        const showLabel = hoveredIndex === i

        return (
          <div
            key={i}
            ref={el => { itemRefs.current[i] = el }}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            {/* Tooltip */}
            <div
              style={{
                position: 'absolute',
                bottom: max + 16,
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '4px 9px',
                background: 'rgba(10,10,10,0.88)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '-0.01em',
                borderRadius: 7,
                whiteSpace: 'nowrap',
                fontFamily: FONT,
                opacity: showLabel ? 1 : 0,
                transition: `opacity ${showLabel ? 70 : 100}ms ease`,
                pointerEvents: 'none',
                zIndex: 10,
              }}
            >
              {item.label}
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderTop: '4px solid rgba(10,10,10,0.88)',
                }}
              />
            </div>

            {/* Icon button */}
            <button
              onClick={item.onClick}
              style={{
                width: base,
                height: base,
                borderRadius: borderR,
                background: '#fff',
                border: 'none',
                cursor: item.onClick ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                overflow: 'hidden',
                transform: `scale(${scale})`,
                transformOrigin: 'bottom center',
                transition: isHovering
                  ? 'none'
                  : 'transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)',
                outline: 'none',
                flexShrink: 0,
              }}
            >
              {item.icon}
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ─── Helpers for demo icons ────────────────────────────────────────────────────

function AppIcon({
  gradient,
  children,
}: {
  gradient: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  )
}

// simple SVG icons ─────────────────────────────────────────────────────────────

const S = 22   // icon stroke size

const HomeIcon = () => (
  <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12L12 3l9 9"/>
    <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/>
  </svg>
)
const SearchIcon = () => (
  <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/>
    <path d="M21 21l-4.35-4.35"/>
  </svg>
)
const FilesIcon = () => (
  <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
  </svg>
)
const ChatIcon = () => (
  <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
)
const MailIcon = () => (
  <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M22 7l-10 7L2 7"/>
  </svg>
)
const PhotoIcon = () => (
  <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <path d="M21 15l-5-5L5 21"/>
  </svg>
)
const MusicIcon = () => (
  <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="16" r="3"/>
  </svg>
)
const SettingsIcon = () => (
  <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
)

// ─── Demos ────────────────────────────────────────────────────────────────────

function AppDockDemo() {
  const items: DockEntry[] = [
    {
      label: 'Home',
      icon: <AppIcon gradient="linear-gradient(145deg,#4f8ef7,#2563eb)"><HomeIcon /></AppIcon>,
    },
    {
      label: 'Search',
      icon: <AppIcon gradient="linear-gradient(145deg,#a78bfa,#7c3aed)"><SearchIcon /></AppIcon>,
    },
    {
      label: 'Files',
      icon: <AppIcon gradient="linear-gradient(145deg,#fb923c,#ea580c)"><FilesIcon /></AppIcon>,
    },
    { separator: true },
    {
      label: 'Messages',
      icon: <AppIcon gradient="linear-gradient(145deg,#34d399,#059669)"><ChatIcon /></AppIcon>,
    },
    {
      label: 'Mail',
      icon: <AppIcon gradient="linear-gradient(145deg,#60a5fa,#2563eb)"><MailIcon /></AppIcon>,
    },
    { separator: true },
    {
      label: 'Photos',
      icon: <AppIcon gradient="linear-gradient(145deg,#f472b6,#db2777)"><PhotoIcon /></AppIcon>,
    },
    {
      label: 'Music',
      icon: <AppIcon gradient="linear-gradient(145deg,#f87171,#dc2626)"><MusicIcon /></AppIcon>,
    },
    { separator: true },
    {
      label: 'Settings',
      icon: <AppIcon gradient="linear-gradient(145deg,#9ca3af,#6b7280)"><SettingsIcon /></AppIcon>,
    },
  ]

  return <FloatingDock items={items} />
}

function ToolbarDemo() {
  const BoldIcon = () => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"/><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"/>
    </svg>
  )
  const ItalicIcon = () => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/>
    </svg>
  )
  const UnderlineIcon = () => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v7a6 6 0 0012 0V3"/><line x1="4" y1="21" x2="20" y2="21"/>
    </svg>
  )
  const LinkIcon = () => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
    </svg>
  )
  const ImageIcon = () => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
    </svg>
  )
  const CodeIcon = () => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  )

  const items: DockEntry[] = [
    { label: 'Bold',      icon: <BoldIcon /> },
    { label: 'Italic',    icon: <ItalicIcon /> },
    { label: 'Underline', icon: <UnderlineIcon /> },
    { separator: true },
    { label: 'Link',      icon: <LinkIcon /> },
    { label: 'Image',     icon: <ImageIcon /> },
    { label: 'Code',      icon: <CodeIcon /> },
  ]

  return <FloatingDock items={items} base={40} max={68} radius={120} />
}

// ─── Code source ──────────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState, useRef } from 'react'

const BASE   = 48   // resting icon size (px)
const MAX    = 84   // max magnified size (px)
const RADIUS = 160  // influence radius (px)

interface DockItem {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

type DockEntry = DockItem | { separator: true }

function isSep(e: DockEntry): e is { separator: true } {
  return 'separator' in e && e.separator === true
}

export function FloatingDock({
  items,
  base   = BASE,
  max    = MAX,
  radius = RADIUS,
}: {
  items: DockEntry[]
  base?: number
  max?: number
  radius?: number
}) {
  const dockRef  = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [scales,       setScales]       = useState<number[]>(items.map(() => 1))
  const [hoveredIndex, setHoveredIndex] = useState(-1)
  const [isHovering,   setIsHovering]   = useState(false)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const next = items.map(() => 1)
    let topScale = 1
    let topIdx   = -1

    items.forEach((item, i) => {
      if (isSep(item)) return
      const el = itemRefs.current[i]
      if (!el) return
      const r  = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const d  = Math.abs(e.clientX - cx)
      const t  = Math.max(0, 1 - d / radius)
      const st = (1 - Math.cos(t * Math.PI)) / 2   // cosine ease
      const s  = 1 + (max / base - 1) * st
      next[i] = s
      if (s > topScale) { topScale = s; topIdx = i }
    })

    setScales(next)
    setHoveredIndex(topIdx)
  }

  const onMouseLeave = () => {
    setIsHovering(false)
    setScales(items.map(() => 1))
    setHoveredIndex(-1)
  }

  const borderR = Math.round(base * 0.224)

  return (
    <div
      ref={dockRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={() => setIsHovering(true)}
      style={{
        display: 'inline-flex',
        alignItems: 'flex-end',
        gap: 6,
        padding: '10px 14px',
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderRadius: 22,
        border: '1px solid rgba(255,255,255,0.85)',
        boxShadow:
          '0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08),' +
          'inset 0 1px 0 rgba(255,255,255,0.8)',
      }}
    >
      {items.map((item, i) => {
        if (isSep(item)) {
          return (
            <div
              key={\`s\${i}\`}
              style={{
                width: 1, height: base * 0.55,
                background: 'rgba(10,10,10,0.13)',
                margin: '0 4px', alignSelf: 'center', flexShrink: 0,
              }}
            />
          )
        }

        const scale     = scales[i] ?? 1
        const showLabel = hoveredIndex === i

        return (
          <div
            key={i}
            ref={el => { itemRefs.current[i] = el }}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            {/* Tooltip */}
            <div style={{
              position: 'absolute',
              bottom: max + 16,
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '4px 9px',
              background: 'rgba(10,10,10,0.88)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              borderRadius: 7,
              whiteSpace: 'nowrap',
              opacity: showLabel ? 1 : 0,
              transition: \`opacity \${showLabel ? 70 : 100}ms ease\`,
              pointerEvents: 'none',
              zIndex: 10,
            }}>
              {item.label}
              <div style={{
                position: 'absolute', top: '100%', left: '50%',
                transform: 'translateX(-50%)',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '4px solid rgba(10,10,10,0.88)',
              }} />
            </div>

            {/* Icon */}
            <button
              onClick={item.onClick}
              style={{
                width: base, height: base,
                borderRadius: borderR,
                background: '#fff',
                border: 'none',
                cursor: item.onClick ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 0, overflow: 'hidden',
                transform: \`scale(\${scale})\`,
                transformOrigin: 'bottom center',
                transition: isHovering
                  ? 'none'
                  : 'transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)',
                outline: 'none', flexShrink: 0,
              }}
            >
              {item.icon}
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ── Usage ──────────────────────────────────────────────────────────────────────
//
// const items: DockEntry[] = [
//   { label: 'Home',  icon: <HomeIcon /> },
//   { label: 'Files', icon: <FilesIcon /> },
//   { separator: true },
//   { label: 'Settings', icon: <SettingsIcon />, onClick: () => openSettings() },
// ]
//
// // App dock (large)
// <FloatingDock items={items} />
//
// // Compact editor toolbar
// <FloatingDock items={items} base={40} max={68} radius={120} />`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FloatingDockPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>

      {/* ── Demo ── */}
      <section
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #dce8ff, #e8e0f8, #d8f0ea)',
          padding: '80px 24px 60px',
          gap: 48,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 40,
          }}
        >
          {/* App dock */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <p style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              color: 'rgba(10,10,10,0.35)',
              fontFamily: FONT,
            }}>
              App Dock — hover to magnify
            </p>
            <AppDockDemo />
          </div>

          {/* Toolbar dock */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <p style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              color: 'rgba(10,10,10,0.35)',
              fontFamily: FONT,
            }}>
              Compact Toolbar — base 40 / max 68
            </p>
            <ToolbarDemo />
          </div>
        </div>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '780px', margin: '0 auto' }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          color: 'rgba(10,10,10,0.4)',
          marginBottom: 12,
          fontFamily: FONT,
        }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: 12, padding: 20, overflowX: 'auto' }}>
          <pre style={{
            margin: 0,
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
            fontSize: 12,
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
