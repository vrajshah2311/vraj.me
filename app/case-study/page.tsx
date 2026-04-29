'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const projects = [
  {
    label: 'All work', href: '/all-work', isHome: false, role: 'Everything I\'ve shipped',
    images: [
      '/images/case-studies/work/ni2.png',
      '/images/case-studies/work/ni3.png',
      '/images/case-studies/work/ni4.png',
      '/images/case-studies/work/ni5.png',
      '/images/case-studies/work/ni6.png',
      '/images/case-studies/work/ni7.png',
      '/images/case-studies/work/ni8.png',
      '/images/case-studies/work/ni9.png',
      '/images/case-studies/work/ni10.png',
      '/images/case-studies/work/ni11.png',
      '/images/case-studies/work/ni12.png',
      '/images/case-studies/work/ni14.png',
      '/images/case-studies/work/ni15.png',
      '/images/case-studies/work/ni16.png',
      '/images/case-studies/work/ni17.png',
      '/images/case-studies/work/ni18.png',
      '/images/case-studies/work/co1.png',
      '/images/case-studies/work/co2.png',
      '/images/case-studies/work/el1.png',
      '/images/case-studies/work/wh1.png',
      '/images/case-studies/other-portfolio/C1.png',
      '/images/case-studies/other-portfolio/C2.png',
      '/images/case-studies/other-portfolio/Wh1.png',
      '/images/case-studies/other-portfolio/Wh2.png',
      '/images/case-studies/other-portfolio/Wh3.png',
      '/images/case-studies/other-portfolio/Wh4.png',
      '/images/case-studies/other-portfolio/Wh5.png',
      '/images/case-studies/other-portfolio/Wh6.png',
      '/images/case-studies/other-portfolio/Wh7.png',
      '/images/case-studies/other-portfolio/Wh8.png',
      '/images/case-studies/other-portfolio/Wh9.png',
      '/images/case-studies/other-portfolio/Wh10.png',
      '/images/case-studies/other-portfolio/Wh11.png',
      '/images/case-studies/other-portfolio/Wh12.png',
      '/images/case-studies/other-portfolio/Wh13.png',
      '/images/case-studies/other-portfolio/Wh14.png',
      '/images/case-studies/other-portfolio/Wh15.png',
      '/images/case-studies/exp1.png',
      '/images/case-studies/exp2.png',
      '/images/case-studies/exp3.png',
      '/images/case-studies/exp4.png',
      '/images/case-studies/exp5.png',
      '/images/case-studies/ln1.png',
      '/images/case-studies/ln2.png',
      '/images/case-studies/ln3.png',
      '/images/case-studies/ma1.png',
      '/images/case-studies/ma2.png',
      '/images/case-studies/mn1.png',
      '/images/case-studies/ex1.png',
    ],
  },
  {
    label: 'Peec AI', href: '/peec-ai', role: 'Founding Designer',
    images: [
      '/images/case-studies/peec-ai/peec-overview-1.png',
      '/images/case-studies/peec-ai/peec-prompt-builder-1.png',
      '/images/case-studies/peec-ai/peec-prompt-builder-2.png',
      '/images/case-studies/peec-ai/peec-table-1.png',
      '/images/case-studies/peec-ai/peec-prompts-1.png',
      '/images/case-studies/peec-ai/peec-prompts-2.png',
      '/images/case-studies/peec-ai/peec-brands-1.png',
      '/images/case-studies/peec-ai/peec-actions-1.png',
      '/images/case-studies/peec-ai/peec-actions-2.png',
      '/images/case-studies/peec-ai/peec-actions-3.png',
      '/images/case-studies/peec-ai/peec-actions-4.png',
      '/images/case-studies/peec-ai/peec-date-picker-1.png',
      '/images/case-studies/peec-ai/peec-matrix-1.png',
      '/images/case-studies/peec-ai/peec-url-details-1.png',
      '/images/case-studies/peec-ai/peec-onboarding-1.png',
      '/images/case-studies/peec-ai/peec-onboarding-2.png',
      '/images/case-studies/peec-ai/peec-onboarding-3.png',
      '/images/case-studies/peec-ai/projects-cpp.png',
    ],
  },
  {
    label: 'Profound', href: '/profound', role: 'Product Designer',
    images: [
      '/images/case-studies/profound/pr1.png',
      '/images/case-studies/profound/pr2.png',
      '/images/case-studies/profound/pr3.png',
      '/images/case-studies/profound/pr4.png',
      '/images/case-studies/profound/pr5.png',
      '/images/case-studies/profound/pr6.png',
      '/images/case-studies/profound/pr7.png',
      '/images/case-studies/profound/pem1.png',
      '/images/case-studies/profound/pem2.png',
      '/images/case-studies/profound/pem3.png',
      '/images/case-studies/profound/pem4.png',
      '/images/case-studies/profound/pem5.png',
      '/images/case-studies/profound/pem6.png',
      '/images/case-studies/profound/platforms.png',
      '/images/case-studies/profound/p10.png',
      '/images/case-studies/profound/p11.png',
    ],
  },
  {
    label: 'nsave', href: '/nsave', role: 'Product Designer',
    images: [
      '/images/case-studies/nsave/ns1.png',
      '/images/case-studies/nsave/ns2.png',
      '/images/case-studies/nsave/ns3.png',
      '/images/case-studies/nsave/ns4.png',
      '/images/case-studies/nsave/ns5.png',
      '/images/case-studies/nsave/ns6.png',
      '/images/case-studies/nsave/ns7.png',
      '/images/case-studies/nsave/ns8.png',
      '/images/case-studies/nsave/ns9.png',
      '/images/case-studies/nsave/ns10.png',
      '/images/case-studies/nsave/ns11.png',
    ],
  },
  {
    label: 'Model ML', href: '/model-ml', role: 'Product Designer',
    images: [
      '/images/case-studies/model-ml/model-ml-1.png',
      '/images/case-studies/model-ml/model-ml-2.png',
      '/images/case-studies/model-ml/model-ml-3.png',
      '/images/case-studies/model-ml/model-ml-4.png',
      '/images/case-studies/model-ml/model-ml-5.png',
      '/images/case-studies/model-ml/model-ml-6.png',
      '/images/case-studies/model-ml/model-ml-7.png',
    ],
  },
  {
    label: 'Hale', href: '/hale', role: 'Product Designer',
    images: [
      '/images/case-studies/hale/hale-1.png',
      '/images/case-studies/hale/hale-2.png',
      '/images/case-studies/hale/hale-3.png',
      '/images/case-studies/hale/hale-4.png',
    ],
  },
]

// ── Skeleton ──────────────────────────────────────────────────────────────────
// ── FadeImage ─────────────────────────────────────────────────────────────────
function FadeImage({ src, borderRadius, priority }: { src: string; borderRadius: string | number; priority?: boolean }) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setLoaded(false) }, [src])

  return (
    <div style={{
      position: 'relative', width: '100%', borderRadius,
      aspectRatio: loaded ? 'auto' : '4/3',
      background: loaded ? '#FDFDFD' : 'linear-gradient(90deg, #f0f0f0 25%, #ebebeb 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: loaded ? 'none' : 'shimmer 1.4s ease-in-out infinite',
    }}>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <img src={src} onLoad={() => setLoaded(true)} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'low'} style={{
        width: '100%', height: 'auto', display: 'block',
        borderRadius, background: '#FDFDFD',
        boxShadow: '0px 1px 2px -1px rgba(23,23,23,0.08), 0px 1px 3px rgba(23,23,23,0.08), 0px 0px 0px 1px rgba(23,23,23,0.06)',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }} />
    </div>
  )
}

// ── Sticky Header ─────────────────────────────────────────────────────────────
function StickyHeader({ project }: { project: typeof projects[0] }) {
  return (
    <div style={{
      borderRadius: '20px 20px 0 0',
      background: '#F5F5F5',
      paddingTop: 24, paddingBottom: 16, paddingLeft: 24, paddingRight: 24,
      flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 6,
      display: 'inline-flex', width: '100%', boxSizing: 'border-box',
    }}>
      <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#171717', fontSize: 18, fontFamily: font, fontWeight: 600, lineHeight: '22px', letterSpacing: '-0.022em', wordWrap: 'break-word' }}>{project.label}</div>
      {project.role && <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'rgba(23,23,23,0.50)', fontSize: 14, fontFamily: font, fontWeight: 500, lineHeight: '20px', letterSpacing: '-0.01em', wordWrap: 'break-word' }}>{project.role}</div>}
    </div>
  )
}

// ── Top Nav ───────────────────────────────────────────────────────────────────
function TopNav({ current, onChange, dark, visible, view, onViewChange }: { current: string; onChange: (label: string) => void; dark: boolean; visible: boolean; view: 'list' | 'grid2' | 'grid3'; onViewChange: (v: 'list' | 'grid2' | 'grid3') => void }) {
  const pillBg      = dark ? 'rgba(10,10,10,0.82)' : '#FDFDFD'
  const pillOutline = dark ? '1px rgba(255,255,255,0.1) solid' : '1px rgba(23,23,23,0.08) solid'
  const pillBlur    = dark ? 'blur(20px) saturate(1.8)' : 'none'
  const activeBg    = dark ? 'rgba(255,255,255,0.12)' : 'rgba(23,23,23,0.06)'
  const hoveredBg   = dark ? 'rgba(255,255,255,0.08)' : 'rgba(23,23,23,0.04)'
  const activeCol   = dark ? '#fff' : '#171717'
  const inactiveCol = dark ? 'rgba(255,255,255,0.5)' : 'rgba(23,23,23,0.60)'
  const hoveredCol  = dark ? 'rgba(255,255,255,0.85)' : 'rgba(23,23,23,0.85)'
  const iconActive  = dark ? '#fff' : '#171717'
  const iconMuted   = dark ? 'rgba(255,255,255,0.4)' : 'rgba(23,23,23,0.4)'
  const t = 'background 0.4s cubic-bezier(0.4,0,0.2,1), color 0.4s cubic-bezier(0.4,0,0.2,1), outline-color 0.4s cubic-bezier(0.4,0,0.2,1)'

  return (
    <>
    <style>{`
      .cs-nav-item { transition: background 0.1s ease, color 0.1s ease; }
      .cs-nav-item:not(.cs-nav-active):hover { background: ${hoveredBg} !important; color: ${hoveredCol} !important; }
      .cs-view-btn { transition: background 0.1s ease; }
      .cs-view-btn:not(.cs-view-active):hover { background: ${hoveredBg} !important; }
    `}</style>
    <div style={{
      position: 'sticky', top: 0, zIndex: 20,
      paddingTop: 16, paddingBottom: 16, marginTop: -16,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0px)' : 'translateY(-12px)',
      transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1)',
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      {/* Left pill */}
      <div style={{
        height: 40, padding: 3, borderRadius: 900,
        outline: pillOutline, outlineOffset: -1,
        display: 'flex', alignItems: 'center', gap: 2,
        background: pillBg,
        backdropFilter: pillBlur, WebkitBackdropFilter: pillBlur,
        transition: t,
      }}>
        {projects.map(p => {
          const isActive = p.label === current
          return (
            <a key={p.label}
              className={`cs-nav-item${isActive ? ' cs-nav-active' : ''}`}
              onClick={e => { e.preventDefault(); onChange(p.label) }}
              style={{
                alignSelf: 'stretch', padding: '0 10px', borderRadius: 900,
                display: 'flex', alignItems: 'center',
                fontSize: 14, fontWeight: isActive ? 600 : 500, lineHeight: '20px', letterSpacing: '-0.01em',
                color: isActive ? activeCol : inactiveCol,
                background: isActive ? activeBg : 'transparent',
                textDecoration: 'none', fontFamily: font,
                whiteSpace: 'nowrap', cursor: 'pointer',
              }}
            >{p.label}</a>
          )
        })}
      </div>

      {/* Right pill */}
      <div style={{
        height: 40, padding: 3, borderRadius: 900,
        outline: pillOutline, outlineOffset: -1,
        display: 'flex', alignItems: 'center', gap: 2,
        background: pillBg,
        backdropFilter: pillBlur, WebkitBackdropFilter: pillBlur,
        transition: t,
      }}>
        {(['list', 'grid2', 'grid3'] as const).map(v => {
          const isActive = view === v
          const fill = isActive ? iconActive : iconMuted
          return (
            <button key={v} onClick={() => onViewChange(v)}
              className={`cs-view-btn${isActive ? ' cs-view-active' : ''}`}
              style={{
              alignSelf: 'stretch', padding: '0 10px', borderRadius: 900,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isActive ? activeBg : 'transparent',
            }}>
              {v === 'list' ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3" width="12" height="2" rx="1" fill={fill} />
                  <rect x="2" y="7" width="12" height="2" rx="1" fill={fill} />
                  <rect x="2" y="11" width="12" height="2" rx="1" fill={fill} />
                </svg>
              ) : v === 'grid2' ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" rx="1" fill={fill} />
                  <rect x="9" y="2" width="5" height="5" rx="1" fill={fill} />
                  <rect x="2" y="9" width="5" height="5" rx="1" fill={fill} />
                  <rect x="9" y="9" width="5" height="5" rx="1" fill={fill} />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="1" width="4" height="4" rx="1" fill={fill} />
                  <rect x="6" y="1" width="4" height="4" rx="1" fill={fill} />
                  <rect x="11" y="1" width="4" height="4" rx="1" fill={fill} />
                  <rect x="1" y="6" width="4" height="4" rx="1" fill={fill} />
                  <rect x="6" y="6" width="4" height="4" rx="1" fill={fill} />
                  <rect x="11" y="6" width="4" height="4" rx="1" fill={fill} />
                  <rect x="1" y="11" width="4" height="4" rx="1" fill={fill} />
                  <rect x="6" y="11" width="4" height="4" rx="1" fill={fill} />
                  <rect x="11" y="11" width="4" height="4" rx="1" fill={fill} />
                </svg>
              )}
            </button>
          )
        })}
      </div>
    </div>
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CaseStudy() {
  const [current, setCurrent] = useState('Peec AI')
  const project = projects.find(p => p.label === current) ?? projects[1]
  const [dark, setDark] = useState(false)
  const [view, setView] = useState<'list' | 'grid2' | 'grid3'>('grid3')
  const headerRef = useRef<HTMLDivElement>(null)
  const imageGridRef = useRef<HTMLDivElement>(null)

  const changeView = (newView: 'list' | 'grid2' | 'grid3') => {
    // find anchor: first image cell whose top is at or above viewport center
    const grid = imageGridRef.current
    if (!grid) { setView(newView); return }
    const cells = Array.from(grid.children) as HTMLElement[]
    let anchorEl: HTMLElement | null = null
    let anchorTop = 0
    for (const cell of cells) {
      const rect = cell.getBoundingClientRect()
      if (rect.top <= window.innerHeight / 2) { anchorEl = cell; anchorTop = rect.top }
    }
    setView(newView)
    if (!anchorEl) return
    const captured = anchorEl
    const capturedTop = anchorTop
    // wait two frames: one for React state, one for framer-motion FLIP
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const newTop = captured.getBoundingClientRect().top
      window.scrollBy({ top: newTop - capturedTop, behavior: 'instant' as ScrollBehavior })
    }))
  }

  useEffect(() => {
    const lenis = new Lenis()
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (!headerRef.current) return
      const rect = headerRef.current.getBoundingClientRect()
      setDark(rect.bottom < 64)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#FDFDFD', fontFamily: font }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 1440,
        paddingTop: 32,
        paddingLeft: 48,
        paddingRight: 48,
        paddingBottom: 40,
      }}>
        <TopNav current={current} onChange={label => { setCurrent(label) }} dark={dark} visible={true} view={view} onViewChange={changeView} />

        {/* Card */}
        <div style={{
          position: 'relative',
          width: '100%',
          background: 'rgba(23,23,23,0.04)',
          borderRadius: 20,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div ref={headerRef}><StickyHeader key={current} project={project} /></div>

          {/* Images */}
          <motion.div ref={imageGridRef} layout style={{ alignSelf: 'stretch', display: 'grid', gap: '1px', gridTemplateColumns: view === 'grid3' ? '1fr 1fr 1fr' : view === 'grid2' ? '1fr 1fr' : '1fr' }} transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={{ display: 'contents' }}
              >
                {project.images.map((src, i) => (
                  <motion.div key={src} layout="position" transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }} style={{ lineHeight: 0 }}>
                    <FadeImage src={src} borderRadius="0" priority={i < 6} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      </div>
    </main>
  )
}
