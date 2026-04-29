'use client'

import { useRef, useEffect, useState } from 'react'

const font = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

interface BeforeAfterProps {
  images: string[]         // 2 or more
  labels?: string[]        // one per image, e.g. ['Design', 'Research', 'How it works']
  borderRadius?: string | number
}

export default function BeforeAfter({ images, labels, borderRadius = 4 }: BeforeAfterProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const cssSize      = useRef({ w: 0, h: 0 })
  const loadedImgs   = useRef<HTMLImageElement[]>([])
  const rafRefs      = useRef<(number | null)[]>([])

  // Per-handle state
  const n            = images.length
  const splits       = useRef<number[]>([])   // actual (lerped) positions 0–1
  const targets      = useRef<number[]>([])   // target positions
  const draggingIdx  = useRef<number>(-1)
  const handleRefs   = useRef<(HTMLDivElement | null)[]>([])
  const labelRefs    = useRef<(HTMLDivElement | null)[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [hoveredHandle, setHoveredHandle] = useState(-1)

  // Init splits: first image fills the frame, handles stacked near right edge
  useEffect(() => {
    splits.current  = Array.from({ length: n - 1 }, (_, i) => 0.90 + i * 0.05)
    targets.current = [...splits.current]
    rafRefs.current = new Array(n - 1).fill(null)
  }, [n])

  const buildShadeStrip = (renderW: number) => {
    const N = Math.max(1, Math.round(renderW))
    const sc = document.createElement('canvas')
    sc.width = N; sc.height = 1
    const sctx = sc.getContext('2d')!
    const img = sctx.createImageData(N, 1)
    const d = img.data
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1)
      const theta = t * Math.PI
      const diffuse = Math.cos(theta)
      const spec = Math.pow(Math.max(0, Math.cos((theta - Math.PI / 2) * 2.8)), 6) * 0.35
      const idx = i * 4
      if (diffuse >= 0) {
        const v = spec * 0.5 + diffuse * 0.03
        d[idx]=d[idx+1]=d[idx+2]=255; d[idx+3]=Math.min(255, v*255)
      } else {
        const v = -diffuse * 0.05
        d[idx]=d[idx+1]=d[idx+2]=0; d[idx+3]=Math.min(255, v*255)
      }
    }
    sctx.putImageData(img, 0, 0)
    return sc
  }

  const drawCurl = (ctx: CanvasRenderingContext2D, leftImg: HTMLImageElement, splitX: number, pct: number, W: number, H: number) => {
    const baseCurlW = Math.min(W * 0.12, 80)
    const curlW = baseCurlW * (0.3 + 0.7 * Math.sin(pct * Math.PI))
    const renderW = Math.min(curlW, splitX)
    const curlStart = splitX - renderW
    const arcLength = curlW * (Math.PI / 2)

    // Shadow on the right side
    if (splitX < W - 1) {
      const ss = curlW * 2.2
      const sg = ctx.createLinearGradient(splitX, 0, splitX + ss, 0)
      sg.addColorStop(0,    'rgba(0,0,0,0.05)')
      sg.addColorStop(0.15, 'rgba(0,0,0,0.02)')
      sg.addColorStop(0.40, 'rgba(0,0,0,0.01)')
      sg.addColorStop(1,    'rgba(0,0,0,0)')
      ctx.fillStyle = sg
      ctx.fillRect(splitX, 0, Math.min(ss, W - splitX), H)
    }

    // Curl zone
    if (renderW > 1) {
      ctx.save()
      ctx.beginPath(); ctx.rect(curlStart, 0, renderW, H); ctx.clip()
      const srcX = (curlStart / W) * leftImg.naturalWidth
      const srcW = (arcLength / W) * leftImg.naturalWidth
      ctx.drawImage(leftImg, srcX, 0, srcW, leftImg.naturalHeight, curlStart, 0, renderW, H)
      ctx.drawImage(buildShadeStrip(renderW), curlStart, 0, renderW, H)
      ctx.restore()

      // Paper edge
      const edgeW = Math.max(2, Math.min(12, renderW * 0.18))
      const pg = ctx.createLinearGradient(splitX - edgeW, 0, splitX, 0)
      pg.addColorStop(0,   'rgba(255,255,255,0)')
      pg.addColorStop(0.5, 'rgba(255,255,255,0.6)')
      pg.addColorStop(1,   'rgba(255,255,255,0.95)')
      ctx.fillStyle = pg
      ctx.fillRect(Math.max(0, splitX - edgeW), 0, edgeW, H)
    }
  }

  const draw = () => {
    const canvas = canvasRef.current
    const imgs = loadedImgs.current
    if (!canvas || imgs.length < n) return
    const ctx = canvas.getContext('2d')!
    const W = cssSize.current.w
    const H = cssSize.current.h
    if (!W || !H) return

    ctx.clearRect(0, 0, W, H)

    const sps = splits.current  // sorted split positions in px
    const splitXs = sps.map(p => W * p)

    // Draw rightmost image as base
    ctx.drawImage(imgs[imgs.length - 1], 0, 0, W, H)

    // Draw each image from right to left, clipped
    for (let i = imgs.length - 2; i >= 0; i--) {
      const splitX = splitXs[i]
      const flatEnd = splitX - Math.min(W * 0.12, 80) * (0.3 + 0.7 * Math.sin(sps[i] * Math.PI))

      // Draw shadows first
      drawCurl(ctx, imgs[i], splitX, sps[i], W, H)

      // Flat part of this image
      if (flatEnd > 0) {
        const leftBound = i > 0 ? splitXs[i - 1] : 0
        ctx.save()
        ctx.beginPath(); ctx.rect(leftBound, 0, flatEnd - leftBound, H); ctx.clip()
        ctx.drawImage(imgs[i], 0, 0, W, H)
        ctx.restore()
      }
    }

    // Update handle positions
    sps.forEach((p, i) => {
      const h = handleRefs.current[i]
      if (h) h.style.left = `${p * 100}%`
    })

    // Update label visibility + active segment
    const allSplits = [0, ...sps, 1]
    labelRefs.current.forEach((el, i) => {
      if (!el) return
      const segW = allSplits[i + 1] - allSplits[i]
      el.style.opacity = segW < 0.12 ? '0' : '1'
    })
    // Active = widest segment
    let maxW = 0, maxI = 0
    for (let i = 0; i < n; i++) {
      const w = allSplits[i + 1] - allSplits[i]
      if (w > maxW) { maxW = w; maxI = i }
    }
    setActiveIdx(maxI)
  }

  const startLerp = (idx: number) => {
    if (rafRefs.current[idx]) return
    const loop = () => {
      const curr = splits.current[idx]
      const tgt  = targets.current[idx]
      const diff = tgt - curr
      splits.current[idx] = Math.abs(diff) > 0.0002 ? curr + diff * 0.18 : tgt
      draw()
      if (Math.abs(diff) > 0.0002) {
        rafRefs.current[idx] = requestAnimationFrame(loop)
      } else {
        rafRefs.current[idx] = null
      }
    }
    rafRefs.current[idx] = requestAnimationFrame(loop)
  }

  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise(res => { const img = new Image(); img.crossOrigin = 'anonymous'; img.onload = () => res(img); img.src = src })

  useEffect(() => {
    const container = containerRef.current
    const canvas    = canvasRef.current
    if (!container || !canvas) return

    const setCanvasSize = (first: HTMLImageElement) => {
      const dpr  = window.devicePixelRatio || 1
      const cssW = container.offsetWidth
      const cssH = Math.round(cssW * (first.naturalHeight / first.naturalWidth))
      cssSize.current = { w: cssW, h: cssH }
      canvas.width  = cssW * dpr
      canvas.height = cssH * dpr
      canvas.style.width  = cssW + 'px'
      canvas.style.height = cssH + 'px'
      canvas.getContext('2d')!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    Promise.all(images.map(loadImage)).then(imgs => {
      loadedImgs.current = imgs
      setCanvasSize(imgs[0])
      draw()
    })

    const ro = new ResizeObserver(() => {
      if (!loadedImgs.current[0]) return
      setCanvasSize(loadedImgs.current[0])
      draw()
    })
    ro.observe(container)

    const onDown = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      // find closest handle
      let closest = 0, minDist = Infinity
      splits.current.forEach((s, i) => {
        const d = Math.abs(s - px)
        if (d < minDist) { minDist = d; closest = i }
      })
      draggingIdx.current = closest
      container.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (draggingIdx.current < 0) return
      const rect = container.getBoundingClientRect()
      const px = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
      const idx = draggingIdx.current
      // clamp between neighbours
      const lo = idx > 0 ? splits.current[idx - 1] + 0.02 : 0.01
      const hi = idx < splits.current.length - 1 ? splits.current[idx + 1] - 0.02 : 0.99
      targets.current[idx] = Math.min(hi, Math.max(lo, px))
      startLerp(idx)
    }
    const onUp = () => { draggingIdx.current = -1 }

    container.addEventListener('pointerdown',  onDown)
    container.addEventListener('pointermove',  onMove)
    container.addEventListener('pointerup',    onUp)
    container.addEventListener('pointercancel',onUp)

    return () => {
      ro.disconnect()
      rafRefs.current.forEach(r => r && cancelAnimationFrame(r))
      container.removeEventListener('pointerdown',  onDown)
      container.removeEventListener('pointermove',  onMove)
      container.removeEventListener('pointerup',    onUp)
      container.removeEventListener('pointercancel',onUp)
    }
  }, [images.join(',')])


  return (
    <div ref={containerRef} style={{
      position: 'relative', width: '100%',
      userSelect: 'none', cursor: 'default',
      touchAction: 'none', borderRadius,
      boxShadow: '0px 1px 2px -1px rgba(23,23,23,0.08), 0px 1px 3px rgba(23,23,23,0.08), 0px 0px 0px 1px rgba(23,23,23,0.06)',
    }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', borderRadius }} />

      {/* Handles — one per split */}
      {Array.from({ length: n - 1 }, (_, i) => (
        <div key={i} ref={el => { handleRefs.current[i] = el }}
          onMouseEnter={() => setHoveredHandle(i)}
          onMouseLeave={() => setHoveredHandle(-1)}
          style={{
            position: 'absolute', top: '50%',
            left: `${(i + 1) / n * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: 36, height: 36, borderRadius: '50%',
            background: hoveredHandle === i ? '#171717' : '#fff',
            boxShadow: '0 2px 16px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s ease',
            cursor: 'grab',
          }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 4L2 8L5 12" stroke={hoveredHandle === i ? '#fff' : 'rgba(23,23,23,0.6)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s ease' }}/>
            <path d="M11 4L14 8L11 12" stroke={hoveredHandle === i ? '#fff' : 'rgba(23,23,23,0.6)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s ease' }}/>
          </svg>
        </div>
      ))}

      {/* Bottom indicator pill */}
      <div style={{
        position: 'absolute', bottom: 16, left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(10,10,10,0.82)',
        backdropFilter: 'blur(20px) saturate(1.8)', WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
        borderRadius: 900, padding: '6px 12px',
        display: 'flex', alignItems: 'center', gap: 8,
        pointerEvents: 'none',
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', fontFamily: font, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
          {labels?.[activeIdx] ?? `Image ${activeIdx + 1}`}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {Array.from({ length: n }, (_, i) => (
            <div key={i} style={{
              width: i === activeIdx ? 16 : 4,
              height: 4, borderRadius: 900,
              background: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.35)',
              transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), background 0.3s ease',
            }} />
          ))}
        </div>
      </div>

    </div>
  )
}
