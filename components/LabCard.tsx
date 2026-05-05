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
  cropBottom?: boolean
  noModal?: boolean
  credit?: string
}

function getCredit(subtitle: string): { text: string; link?: { label: string; href: string } } | null {
  if (subtitle === 'Peec AI') return { text: 'Design and concept by me' }
  if (subtitle === 'Profound') return { text: 'Designed and Concept by me, developed by', link: { label: 'Kian Bazza', href: 'https://x.com/kianbazza' } }
  if (subtitle === 'Context AI') return { text: 'Design and concept by me' }
  return { text: 'Design and developed by me' }
}

function VideoModal({ video, title, subtitle, creditOverride, onClose }: { video: string; title: string; subtitle: string; creditOverride?: string; onClose: () => void }) {
  const [visible, setVisible] = useState(false)
  const credit = creditOverride !== undefined
    ? creditOverride === 'rayyan'
      ? { text: 'Designed & Concept by me, developed by', link: { label: 'Rayyan Tariq', href: 'https://x.com/rayyananan_' } }
      : creditOverride === 'kian'
      ? { text: 'Designed by me, developed by', link: { label: 'Kian Bazza', href: 'https://x.com/kianbazza' } }
      : creditOverride ? { text: creditOverride } : null
    : getCredit(subtitle)

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
          maxWidth: 'calc(100vw - 64px)',
          maxHeight: 'calc(100vh - 64px)',
          width: 'auto',
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
        <div style={{ padding: '0 16px 0' }}>
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            style={{
              maxWidth: '100%', maxHeight: 'calc(100vh - 210px)', borderRadius: 12, display: 'block',
              boxShadow: '0px 1px 2px -1px rgba(23, 23, 23, 0.08), 0px 1px 3px rgba(23, 23, 23, 0.08), 0px 0px 0px 1px rgba(23, 23, 23, 0.06)',
            }}
          />
        </div>

        {/* Footer */}
        {credit && (
          <div style={{
            height: 52, paddingLeft: 16, paddingRight: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: geistMono, fontSize: 14, fontWeight: 500, color: 'oklch(0 0 0 / 0.5)' }}>
              {credit.text}{credit.link && (
                <>{' '}<a href={credit.link.href} target="_blank" rel="noopener noreferrer" style={{ color: '#171717', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2 }}>{credit.link.label}</a></>
              )}
            </span>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default function LabCard({ title, subtitle, image, video, href, cropBottom, noModal, credit: creditProp }: LabCardProps) {
  const [hov, setHov] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <>
      <style>{`
        @keyframes labSkeleton {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div
        style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={e => {
          if (video && !noModal) { e.preventDefault(); setModalOpen(true) }
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
            {/* Skeleton */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1,
              background: 'linear-gradient(90deg, #f5f5f5 25%, #ffffff 50%, #f5f5f5 75%)',
              backgroundSize: '200% 100%',
              animation: 'labSkeleton 1.6s ease-in-out infinite',
              opacity: loaded ? 0 : 1,
              transition: 'opacity 0.4s ease',
              pointerEvents: 'none',
            }} />
            {video ? (
              <video
                ref={videoRef}
                src={video}
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
                onCanPlay={() => setLoaded(true)}
                style={{ width: '100%', aspectRatio: '429 / 269', display: 'block', objectFit: 'cover', objectPosition: cropBottom ? 'center bottom' : undefined }}
              />
            ) : (
              <img
                src={image}
                alt={title}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                style={{ width: '100%', aspectRatio: '429 / 269', display: 'block', objectFit: 'cover', objectPosition: cropBottom ? 'center bottom' : undefined }}
              />
            )}
          </div>
          <div style={{
            height: 40, paddingLeft: 12, paddingRight: 12,
            display: 'flex', alignItems: 'center', gap: 4,
            overflow: 'hidden',
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, overflow: 'hidden' }}>
              <span style={{
                fontFamily: geistMono, fontSize: 14, fontWeight: 600,
                lineHeight: '14px', color: '#171717',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 1,
              }}>{title}</span>
              <span style={{
                fontFamily: geist, fontSize: 14, fontWeight: 500,
                lineHeight: '20px', color: 'oklch(0 0 0 / 0.06)', flexShrink: 0,
              }}>|</span>
              <span style={{
                fontFamily: geistMono, fontSize: 14, fontWeight: 500,
                lineHeight: '20px', color: 'oklch(0 0 0 / 0.5)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 1,
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
        <VideoModal video={video} title={title} subtitle={subtitle} creditOverride={creditProp} onClose={() => setModalOpen(false)} />
      )}
    </>
  )
}
