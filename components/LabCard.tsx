'use client'

import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const geist = 'var(--font-geist-sans), -apple-system, sans-serif'
const geistMono = 'var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace'

interface LabCardProps {
  title: string
  subtitle: string
  image: string
  video?: string
  href: string
}

function VideoModal({ video, title, subtitle, onClose }: { video: string; title: string; subtitle: string; onClose: () => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 250)
  }

  return createPortal(
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: visible ? 'oklch(0 0 0 / 0.5)' : 'oklch(0 0 0 / 0)',
        backdropFilter: visible ? 'blur(12px)' : 'blur(0px)',
        WebkitBackdropFilter: visible ? 'blur(12px)' : 'blur(0px)',
        transition: 'background 0.3s cubic-bezier(0.16,1,0.3,1), backdrop-filter 0.3s cubic-bezier(0.16,1,0.3,1)',
        padding: 32,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FDFDFD',
          borderRadius: 20,
          overflow: 'hidden',
          maxWidth: 900,
          width: '100%',
          boxShadow: '0px 24px 80px oklch(0 0 0 / 0.2), 0px 0px 0px 1px oklch(0 0 0 / 0.06)',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(8px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.25s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: geistMono, fontSize: 14, fontWeight: 600, color: '#171717' }}>{title}</span>
            <span style={{ fontFamily: geist, fontSize: 14, fontWeight: 500, color: 'oklch(0 0 0 / 0.06)' }}>|</span>
            <span style={{ fontFamily: geistMono, fontSize: 14, fontWeight: 500, color: 'oklch(0 0 0 / 0.5)' }}>{subtitle}</span>
          </div>
          <div
            onClick={handleClose}
            style={{
              width: 28, height: 28, borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'oklch(0 0 0 / 0.04)',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0 0 0 / 0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'oklch(0 0 0 / 0.04)')}
          >
            <img src="/icons/IconCrossSmall.svg" width={14} height={14} alt="Close" />
          </div>
        </div>

        {/* Video */}
        <div style={{ padding: '0 16px 16px' }}>
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%', borderRadius: 12, display: 'block',
              boxShadow: '0px 1px 2px -1px rgba(23, 23, 23, 0.08), 0px 1px 3px rgba(23, 23, 23, 0.08), 0px 0px 0px 1px rgba(23, 23, 23, 0.06)',
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function LabCard({ title, subtitle, image, video, href }: LabCardProps) {
  const [hov, setHov] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <>
      <div
        style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={e => {
          if (video) { e.preventDefault(); setModalOpen(true) }
          else { window.location.href = href }
        }}
      >
        <div style={{
          width: '100%', padding: 4,
          background: hov ? 'oklch(0 0 0 / 0.06)' : 'oklch(0 0 0 / 0.04)',
          borderRadius: 20,
          display: 'flex', flexDirection: 'column', gap: 2,
          transition: 'background 0.2s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <div style={{
            position: 'relative', width: '100%', background: '#fff', borderRadius: 16, overflow: 'hidden',
            boxShadow: '0px 1px 2px -1px rgba(23, 23, 23, 0.08), 0px 1px 3px rgba(23, 23, 23, 0.08), 0px 0px 0px 1px rgba(23, 23, 23, 0.06)',
          }}>
            {video ? (
              <video
                ref={videoRef}
                src={video}
                muted
                loop
                playsInline
                autoPlay
                style={{ width: '100%', aspectRatio: '429 / 269', display: 'block', objectFit: 'cover' }}
              />
            ) : (
              <img
                src={image}
                alt={title}
                style={{ width: '100%', aspectRatio: '429 / 269', display: 'block', objectFit: 'cover' }}
              />
            )}
          </div>
          <div style={{
            height: 40, paddingLeft: 12, paddingRight: 12,
            display: 'flex', alignItems: 'center', gap: 4,
            overflow: 'hidden',
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                fontFamily: geistMono, fontSize: 14, fontWeight: 600,
                lineHeight: '14px', color: '#171717',
              }}>{title}</span>
              <span style={{
                fontFamily: geist, fontSize: 14, fontWeight: 500,
                lineHeight: '20px', color: 'oklch(0 0 0 / 0.06)',
              }}>|</span>
              <span style={{
                fontFamily: geistMono, fontSize: 14, fontWeight: 500,
                lineHeight: '20px', color: 'oklch(0 0 0 / 0.5)',
              }}>{subtitle}</span>
            </div>
            <img
              src="/icons/IconArrowUpRight.svg"
              width={16} height={16}
              alt=""
              style={{
                flexShrink: 0,
                opacity: hov ? 1 : 0.5,
                transform: hov ? 'translate(1px, -1px)' : 'translate(0, 0)',
                transition: 'opacity 0.2s ease, transform 0.2s cubic-bezier(0.16,1,0.3,1)',
              }}
            />
          </div>
        </div>
      </div>

      {modalOpen && video && (
        <VideoModal video={video} title={title} subtitle={subtitle} onClose={() => setModalOpen(false)} />
      )}
    </>
  )
}
