'use client'

import { useState, useRef, useEffect } from 'react'

const geist = 'var(--font-geist-sans), -apple-system, sans-serif'

const TABS = ['Blur', 'No blur', 'Grey']

function OrbPillBar({ activeIndex, onSelect }: { activeIndex: number; onSelect: (i: number) => void }) {
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const [hoveredIdx, setHoveredIdx] = useState(-1)

  useEffect(() => {
    const el = pillRefs.current[activeIndex]
    const container = containerRef.current
    if (el && container) {
      const cRect = container.getBoundingClientRect()
      const eRect = el.getBoundingClientRect()
      setIndicator({ left: eRect.left - cRect.left, width: eRect.width })
    }
  }, [activeIndex])

  return (
    <div ref={containerRef} style={{
      display: 'inline-flex', alignItems: 'center', gap: 2,
      padding: 2, borderRadius: 12, position: 'relative',
      background: 'rgba(23, 23, 23, 0.04)',
    }}>
      <div style={{
        position: 'absolute', top: 2, height: 'calc(100% - 4px)',
        width: indicator.width, borderRadius: 8,
        background: '#FDFDFD',
        boxShadow: '0px -1px 0px rgba(23, 23, 23, 0.04) inset, 0px 1px 3px rgba(23, 23, 23, 0.08), 0px 0px 0px 1px rgba(23, 23, 23, 0.06)',
        overflow: 'hidden',
        left: indicator.left,
        transition: 'left 0.4s cubic-bezier(0.22, 1, 0.36, 1), width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }} />
      {TABS.map((label, i) => (
        <button
          key={label}
          ref={el => { pillRefs.current[i] = el }}
          onClick={() => onSelect(i)}
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(-1)}
          style={{
            height: 28, paddingLeft: 6, paddingRight: 6, width: 'fit-content',
            borderRadius: 8, border: 'none', cursor: 'pointer',
            background: i !== activeIndex && hoveredIdx === i ? 'rgba(23, 23, 23, 0.04)' : 'transparent',
            position: 'relative', zIndex: 1,
            overflow: 'hidden', whiteSpace: 'nowrap', flexShrink: 0,
            fontFamily: geist, fontSize: 14, fontWeight: 500, lineHeight: '14px',
            color: i === activeIndex ? '#171717' : hoveredIdx === i ? 'rgba(23, 23, 23, 0.85)' : 'rgba(23, 23, 23, 0.6)',
            transition: 'color 0.3s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function OrbPage() {
  const [activeTab, setActiveTab] = useState(0)
  const orbRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const smoothMouse = useRef({ x: 0, y: 0 })
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!orbRef.current) return
      const rect = orbRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      // Normalize to -1...1 range, clamped
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / 300))
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / 300))
      setMouse({ x: nx, y: ny })
    }
    window.addEventListener('mousemove', handleMove)

    // Smooth lerp
    const tick = () => {
      smoothMouse.current.x += (mouse.x - smoothMouse.current.x) * 0.08
      smoothMouse.current.y += (mouse.y - smoothMouse.current.y) * 0.08
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [mouse.x, mouse.y])

  // Derived offsets for blob positions
  const mx = mouse.x
  const my = mouse.y

  return (
    <main style={{
      minHeight: '100vh',
      background: '#FDFDFD',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 48,
      cursor: 'crosshair',
    }}>
      <style>{`
        @keyframes orbBase   { from { transform: rotate(0deg);    } to { transform: rotate(360deg);  } }
        @keyframes orbYellow { from { transform: rotate(0deg);    } to { transform: rotate(360deg);  } }
        @keyframes orbBlue   { from { transform: rotate(0deg);    } to { transform: rotate(-360deg); } }
        @keyframes orbHue    { from { filter: hue-rotate(0deg);   } to { filter: hue-rotate(360deg); } }
      `}</style>

      {/* Orb */}
      <div ref={orbRef} style={{
        filter: activeTab === 0 ? 'blur(6px)' : 'none',
        position: 'relative',
        transition: 'filter 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: `translate(${mx * 3}px, ${my * 3}px)`,
      }}>
        <div style={{
          width: 120, height: 120, borderRadius: 9999,
          overflow: 'hidden', clipPath: 'circle(50% at 50% 50%)',
          position: 'relative',
        }}>
          {/* Color layers */}
          <div style={{
            position: 'absolute', inset: 0,
            animation: activeTab === 2 ? 'none' : 'orbHue 6s linear infinite',
            filter: activeTab === 2 ? 'saturate(0)' : 'saturate(1)',
            transition: 'filter 0.5s ease',
          }}>
            {/* Blob 1 */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 9999,
              background: activeTab === 2
                ? `radial-gradient(ellipse 33% 40% at ${100 + mx * 15}% ${33 + my * 15}%, white 0%, transparent 100%), radial-gradient(ellipse 57% 57% at ${20 - mx * 10}% ${15 - my * 10}%, oklch(0.75 0 0) 0%, transparent 100%), radial-gradient(ellipse 60% 60% at 70% 50%, oklch(0.55 0 0) 0%, oklch(0.35 0 0) 100%)`
                : `radial-gradient(ellipse 33% 40% at ${100 + mx * 15}% ${33 + my * 15}%, white 0%, transparent 100%), radial-gradient(ellipse 57% 57% at ${20 - mx * 10}% ${15 - my * 10}%, #67E8F9 0%, transparent 100%), radial-gradient(ellipse 60% 60% at 70% 50%, #A78BFA 0%, #6366F1 100%)`,
              animation: 'orbBase 30s linear infinite',
            }} />
            {/* Blob 2 */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 9999,
              background: activeTab === 2
                ? `radial-gradient(ellipse 50% 50% at ${75 + mx * 20}% ${25 + my * 20}%, oklch(0.6 0 0) 0%, transparent 100%)`
                : `radial-gradient(ellipse 50% 50% at ${75 + mx * 20}% ${25 + my * 20}%, #F472B6 0%, transparent 100%)`,
              animation: 'orbYellow 25s linear infinite',
            }} />
            {/* White edge highlight */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 9999,
              background: `radial-gradient(ellipse 57% 55% at ${53 + mx * 12}% ${43 + my * 12}%, transparent 62%, transparent 80%, white 100%)`,
              opacity: activeTab === 2 ? 0.3 : 1,
              transition: 'opacity 0.5s ease',
            }} />
            {/* Blob 3 */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 9999,
              background: activeTab === 2
                ? `radial-gradient(ellipse 60% 60% at ${20 - mx * 18}% ${80 - my * 18}%, oklch(0.45 0 0) 0%, transparent 100%)`
                : `radial-gradient(ellipse 60% 60% at ${20 - mx * 18}% ${80 - my * 18}%, #7C3AED 0%, transparent 100%)`,
              opacity: 0.8,
              animation: 'orbBlue 38s linear infinite',
            }} />
          </div>
          {/* Backdrop blur — only for Blur tab */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 9999,
            backdropFilter: activeTab === 0 ? 'blur(12px)' : 'blur(4px)',
            WebkitBackdropFilter: activeTab === 0 ? 'blur(12px)' : 'blur(4px)',
            transition: 'backdrop-filter 0.5s ease',
          }} />
          {/* Grain noise */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 9999,
            backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")`,
            backgroundSize: '200px 200px', mixBlendMode: 'overlay', opacity: 0.25,
          }} />
        </div>
      </div>

      <OrbPillBar activeIndex={activeTab} onSelect={setActiveTab} />
    </main>
  )
}
