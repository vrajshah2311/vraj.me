'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'

// ─── Image data ──────────────────────────────────────────────────────────────

const caseStudyImages: Record<string, string[]> = {
  'peec-ai': [
    '/images/case-studies/peec-ai/peec-overview-1.png',
    '/images/case-studies/peec-ai/peec-prompts-1.png',
    '/images/case-studies/peec-ai/peec-prompts-2.png',
    '/images/case-studies/peec-ai/peec-prompt-builder-1.png',
    '/images/case-studies/peec-ai/peec-prompt-builder-2.png',
    '/images/case-studies/peec-ai/peec-actions-1.png',
    '/images/case-studies/peec-ai/peec-actions-2.png',
    '/images/case-studies/peec-ai/peec-actions-3.png',
    '/images/case-studies/peec-ai/peec-actions-4.png',
    '/images/case-studies/peec-ai/peec-matrix-1.png',
    '/images/case-studies/peec-ai/peec-onboarding-1.png',
    '/images/case-studies/peec-ai/peec-onboarding-2.png',
    '/images/case-studies/peec-ai/peec-onboarding-3.png',
    '/images/case-studies/peec-ai/peec-date-picker-1.png',
    '/images/case-studies/peec-ai/peec-table-1.png',
    '/images/case-studies/peec-ai/peec-url-details-1.png',
    '/images/case-studies/peec-ai/peec-brands-1.png',
  ],
  'profound': [
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
  ],
  'nsave': [
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
  'hale': [
    '/images/case-studies/hale/hale-1.png',
    '/images/case-studies/hale/hale-2.png',
    '/images/case-studies/hale/hale-3.png',
    '/images/case-studies/hale/hale-4.png',
  ],
  'model-ml': [
    '/images/case-studies/model-ml/model-ml-1.png',
    '/images/case-studies/model-ml/model-ml-2.png',
    '/images/case-studies/model-ml/model-ml-3.png',
    '/images/case-studies/model-ml/model-ml-4.png',
    '/images/case-studies/model-ml/model-ml-5.png',
    '/images/case-studies/model-ml/model-ml-6.png',
    '/images/case-studies/model-ml/model-ml-7.png',
  ],
}

const labels: Record<string, string> = {
  'peec-ai': 'Peec AI',
  'profound': 'Profound',
  'nsave': 'nSave',
  'hale': 'Hale',
  'model-ml': 'Model ML',
}

const dockItems = [
  { slug: 'peec-ai',  label: 'Peec AI',  logo: '/images/logos/peec-ai-logo.png' },
  { slug: 'model-ml', label: 'Model ML', logo: '/images/case-studies/model-ml/logo.svg' },
  { slug: 'profound', label: 'Profound', logo: '/images/logos/isotype-dark.png' },
  { slug: 'nsave',    label: 'nSave',    logo: '/images/logos/nsave-logo.webp' },
  { slug: 'hale',     label: 'Hale',     logo: '/images/case-studies/hale/logo.png' },
]

// ─── Cell map: each image placed exactly once per GRID tile ──────────────────

// Grid large enough that the tiling period (~8,500px) is never obvious
const GRID_W = 16
const GRID_H = 12

type CellData = { src: string; slug: string }

function scramble(n: number): number {
  n = Math.imul(n ^ (n >>> 16), 0x45d9f3b)
  n = Math.imul(n ^ (n >>> 16), 0x45d9f3b)
  return (n ^ (n >>> 16)) >>> 0
}

// Pre-place all images at unique grid positions using hash + linear probe
const cellMap = new Map<string, CellData>()
;(function buildCellMap() {
  const all: CellData[] = Object.entries(caseStudyImages).flatMap(
    ([slug, imgs]) => imgs.map(src => ({ src, slug }))
  )
  const used = new Set<string>()
  all.forEach((img, i) => {
    let h = scramble(i * 1664525 + 1013904223)
    let col = h % GRID_W
    let row = scramble(h + 1) % GRID_H
    while (used.has(`${col},${row}`)) {
      h = scramble(h + 1)
      col = h % GRID_W
      row = scramble(h + 1) % GRID_H
    }
    used.add(`${col},${row}`)
    cellMap.set(`${col},${row}`, img)
  })
})()

function getCellData(col: number, row: number): CellData | null {
  const gc = ((col % GRID_W) + GRID_W) % GRID_W
  const gr = ((row % GRID_H) + GRID_H) % GRID_H
  return cellMap.get(`${gc},${gr}`) ?? null
}

// Find nearest grid cell (in non-modular space) that matches targetSlug
function findNearestCell(targetSlug: string, fromCol: number, fromRow: number) {
  for (let r = 0; r <= Math.max(GRID_W, GRID_H); r++) {
    for (let dc = -r; dc <= r; dc++) {
      for (let dr = -r; dr <= r; dr++) {
        if (Math.max(Math.abs(dc), Math.abs(dr)) !== r) continue
        const col = fromCol + dc
        const row = fromRow + dr
        const gc = ((col % GRID_W) + GRID_W) % GRID_W
        const gr = ((row % GRID_H) + GRID_H) % GRID_H
        if (cellMap.get(`${gc},${gr}`)?.slug === targetSlug) {
          return { col, row }
        }
      }
    }
  }
  return { col: fromCol, row: fromRow }
}

// ─── Layout constants ─────────────────────────────────────────────────────────

const CELL_W = 520
const CELL_H = 292
const GAP = 16
const SW = CELL_W + GAP
const SH = CELL_H + GAP
const FRICTION = 0.96
const BUFFER = 2

// ─── Filter dropdown ──────────────────────────────────────────────────────────

function FilterDropdown({ active, onSelect }: { active: string; onSelect: (s: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 select-none flex flex-col items-center gap-2">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '12px',
          padding: '6px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
          transformOrigin: 'bottom center',
          transform: open ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(6px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'transform 0.2s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease',
        }}
      >
        {/* All work */}
        {(() => {
          const isActive = active === 'all'
          return (
            <button
              type="button"
              onClick={() => { onSelect('all'); setOpen(false) }}
              className="flex items-center gap-2 focus:outline-none px-3"
              style={{
                height: '32px',
                background: isActive ? 'rgba(0,0,0,0.05)' : 'transparent',
                borderRadius: '8px 8px 0 0',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                marginBottom: '2px',
                transition: 'background 0.15s ease',
              }}
            >
              <span style={{ width: '6px', height: '6px', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 400, color: isActive ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.4)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                All work
              </span>
            </button>
          )
        })()}

        {dockItems.map(item => {
          const isActive = item.slug === active
          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => { onSelect(item.slug); setOpen(false) }}
              className="flex items-center gap-2 focus:outline-none rounded-[8px] px-3"
              style={{ height: '32px', background: isActive ? 'rgba(249,115,22,0.08)' : 'transparent', transition: 'background 0.15s ease' }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '9999px', backgroundColor: isActive ? 'rgba(249,115,22,0.9)' : 'transparent', flexShrink: 0, transition: 'background-color 0.15s ease' }} />
              <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 400, color: isActive ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.55)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-center focus:outline-none"
        style={{ width: '36px', height: '32px', borderRadius: '800px', background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', transition: 'background 0.15s ease' }}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M2 4h11M4 7.5h7M6.5 11h2" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FocusGalleryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [activeSlug, setActiveSlug] = useState(slug)
  const activeLabel = activeSlug === 'all' ? 'All work' : (labels[activeSlug] ?? activeSlug)
  const focusCount = activeSlug === 'all'
    ? Object.values(caseStudyImages).reduce((s, imgs) => s + imgs.length, 0)
    : (caseStudyImages[activeSlug]?.length ?? 0)

  const [vp, setVp] = useState({ w: 0, h: 0 })
  const vpRef = useRef({ w: 0, h: 0 })

  const ox = useRef(0)
  const oy = useRef(0)

  const [tick, setTick] = useState(0)
  const bump = useCallback(() => setTick(t => t + 1), [])

  const dragging = useRef(false)
  const lastPt = useRef({ x: 0, y: 0 })
  const lastT = useRef(0)
  const vx = useRef(0)
  const vy = useRef(0)
  const rafId = useRef<number | null>(null)
  const [grabbing, setGrabbing] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const val = { w: window.innerWidth, h: window.innerHeight - 48 }
      setVp(val)
      vpRef.current = val
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = null }
      ox.current -= e.deltaX
      oy.current -= e.deltaY
      bump()
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [bump])

  const panTargetOx = useRef(0)
  const panTargetOy = useRef(0)

  const animatePanTo = useCallback((targetOx: number, targetOy: number) => {
    if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = null }
    panTargetOx.current = targetOx
    panTargetOy.current = targetOy
    const LERP = 0.075
    const step = () => {
      const dx = panTargetOx.current - ox.current
      const dy = panTargetOy.current - oy.current
      if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {
        ox.current = panTargetOx.current
        oy.current = panTargetOy.current
        bump()
        rafId.current = null
        return
      }
      ox.current += dx * LERP
      oy.current += dy * LERP
      bump()
      rafId.current = requestAnimationFrame(step)
    }
    rafId.current = requestAnimationFrame(step)
  }, [bump])

  const startMomentum = useCallback(() => {
    const step = () => {
      vx.current *= FRICTION
      vy.current *= FRICTION
      if (Math.abs(vx.current) < 0.05 && Math.abs(vy.current) < 0.05) {
        rafId.current = null
        return
      }
      ox.current += vx.current
      oy.current += vy.current
      bump()
      rafId.current = requestAnimationFrame(step)
    }
    rafId.current = requestAnimationFrame(step)
  }, [bump])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = null }
    dragging.current = true
    setGrabbing(true)
    lastPt.current = { x: e.clientX, y: e.clientY }
    lastT.current = performance.now()
    vx.current = 0
    vy.current = 0
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const now = performance.now()
    const dt = now - lastT.current
    const dx = e.clientX - lastPt.current.x
    const dy = e.clientY - lastPt.current.y
    if (dt > 0) {
      vx.current = vx.current * 0.4 + (dx / dt * 16) * 0.6
      vy.current = vy.current * 0.4 + (dy / dt * 16) * 0.6
    }
    ox.current += dx
    oy.current += dy
    lastPt.current = { x: e.clientX, y: e.clientY }
    lastT.current = now
    bump()
  }, [bump])

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return
    dragging.current = false
    setGrabbing(false)
    startMomentum()
  }, [startMomentum])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') router.push('/') }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [router])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const handleSelect = useCallback((newSlug: string) => {
    if (newSlug === activeSlug) return
    setActiveSlug(newSlug)
    if (newSlug === 'all') return

    const { w, h } = vpRef.current
    const fromCol = Math.round((-ox.current + w / 2) / SW)
    const fromRow = Math.round((-oy.current + h / 2) / SH)

    const { col, row } = findNearestCell(newSlug, fromCol, fromRow)
    animatePanTo(w / 2 - col * SW, h / 2 - row * SH)
  }, [activeSlug, animatePanTo])

  // ── Compute visible cells ─────────────────────────────────────────────────
  const cells: { key: string; col: number; row: number; x: number; y: number }[] = []

  if (vp.w > 0) {
    const startCol = Math.floor(-ox.current / SW) - BUFFER
    const endCol   = Math.ceil((-ox.current + vp.w) / SW) + BUFFER
    const startRow = Math.floor(-oy.current / SH) - BUFFER
    const endRow   = Math.ceil((-oy.current + vp.h) / SH) + BUFFER

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        cells.push({
          key: `${col},${row}`,
          col, row,
          x: col * SW + ox.current,
          y: row * SH + oy.current,
        })
      }
    }
  }

  void tick

  return (
    <div className="fixed inset-0 bg-white flex flex-col select-none">
      {/* Nav */}
      <div
        className="flex-shrink-0 h-12 flex items-center justify-between px-5 z-50"
        style={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.07)' }}
      >
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-black/40 hover:text-black transition-colors text-[13px]"
          style={{ fontWeight: 500 }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <span className="text-black text-[13px] transition-all duration-300" style={{ fontWeight: 600 }}>
          {activeLabel}
          <span className="ml-2 text-black/35" style={{ fontWeight: 400 }}>{focusCount} images</span>
        </span>

        <span className="text-black/25 text-[12px] tabular-nums">ESC</span>
      </div>

      {/* Infinite pan canvas */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden"
        style={{ cursor: grabbing ? 'grabbing' : 'grab' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {cells.map(cell => {
          const img = getCellData(cell.col, cell.row)
          if (!img) return null
          const focused = activeSlug === 'all' || img.slug === activeSlug
          return (
            <div
              key={cell.key}
              style={{
                position: 'absolute',
                left: cell.x,
                top: cell.y,
                width: CELL_W,
                height: CELL_H,
                overflow: 'hidden',
                borderRadius: 0,
                willChange: 'transform',
                opacity: focused ? 1 : 0.15,
                filter: focused ? 'none' : 'blur(2px) saturate(0.4)',
                transition: 'opacity 0.65s cubic-bezier(0.16,1,0.3,1), filter 0.65s cubic-bezier(0.16,1,0.3,1)',
                outline: focused ? '2px solid rgba(249,115,22,0.5)' : 'none',
                outlineOffset: '-2px',
              }}
              onMouseEnter={e => {
                if (!focused) {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.opacity = '0.65'
                  el.style.filter = 'blur(0px) saturate(1)'
                }
              }}
              onMouseLeave={e => {
                if (!focused) {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.opacity = '0.15'
                  el.style.filter = 'blur(2px) saturate(0.4)'
                }
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt=""
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none', userSelect: 'none' }}
              />
            </div>
          )
        })}
      </div>

      <FilterDropdown active={activeSlug} onSelect={handleSelect} />
    </div>
  )
}
