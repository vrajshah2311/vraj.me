'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef } from 'react'

const font = 'Geist, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif'

const experiments = [
  { label: 'Labels dropdown', href: '/canvas/labels-dropdown' },
  { label: 'Hallucination',   href: '/canvas/hallucination' },
  { label: 'Toasts',          href: '/canvas/toasts' },
  { label: 'Orb',             href: '/canvas/orb' },
  { label: 'Cmdk',            href: '/canvas/cmdk' },
]

export default function CanvasIndex() {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const audioUnlockedRef = useRef(false)

  useEffect(() => {
    const unlock = () => {
      if (audioUnlockedRef.current) return
      const Ctx = window.AudioContext || (window as any).webkitAudioContext
      if (!Ctx) return
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx()
      const ctx = audioCtxRef.current!
      if (ctx.state === 'suspended') ctx.resume()
      const buf = ctx.createBuffer(1, 1, 22050)
      const src = ctx.createBufferSource()
      src.buffer = buf
      src.connect(ctx.destination)
      src.start(0)
      audioUnlockedRef.current = true
    }
    window.addEventListener('pointerdown', unlock, { once: true, passive: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  const playTick = useCallback(() => {
    if (typeof window === 'undefined') return
    const Ctx = window.AudioContext || (window as any).webkitAudioContext
    if (!Ctx) return
    if (!audioCtxRef.current) audioCtxRef.current = new Ctx()
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime
    const dur = 0.03
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.setValueAtTime(2400, now)
    bp.Q.setValueAtTime(2.5, now)
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.setValueAtTime(800, now)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.08, now + 0.001)
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.025)
    noise.connect(bp).connect(hp).connect(gain).connect(ctx.destination)
    noise.start(now)
    noise.stop(now + dur)
  }, [])

  const onHover = useCallback(() => {
    playTick()
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(8)
  }, [playTick])

  return (
    <main style={{ minHeight: '100vh', background: '#FDFDFD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        {experiments.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            onMouseEnter={onHover}
            onFocus={onHover}
            style={{
              height: 30, paddingLeft: 12, paddingRight: 12,
              background: '#fff',
              boxShadow: '0px 1px 2px -1px rgba(23,23,23,0.08), 0px 1px 3px rgba(23,23,23,0.08), 0px 0px 0px 1px rgba(23,23,23,0.06)',
              borderRadius: 9,
              display: 'flex', alignItems: 'center',
              color: '#171717', fontSize: 12, fontFamily: font, fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            {label}
          </Link>
        ))}
      </div>
    </main>
  )
}
