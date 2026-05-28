'use client'

import { useState } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Skeleton primitive ────────────────────────────────────────────────────────

function Skeleton({
  width = '100%',
  height = 14,
  radius = 6,
}: {
  width?: string | number
  height?: string | number
  radius?: number
}) {
  return (
    <div style={{
      width,
      height,
      borderRadius: radius,
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-shimmer 1.4s ease-in-out infinite',
      flexShrink: 0,
    }} />
  )
}

// ─── Profile card ─────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Skeleton width={44} height={44} radius={22} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
          <Skeleton width="62%" height={13} />
          <Skeleton width="42%" height={11} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <Skeleton height={12} />
        <Skeleton height={12} width="88%" />
        <Skeleton height={12} width="65%" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Skeleton width={84} height={32} radius={8} />
        <Skeleton width={84} height={32} radius={8} />
      </div>
    </div>
  )
}

function ProfileLoaded() {
  const [following, setFollowing] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: FONT }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 22, flexShrink: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: '#fff', fontWeight: 700,
        }}>V</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>Vraj Shah</div>
          <div style={{ fontSize: 12, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em', marginTop: 2 }}>Product Designer</div>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: 'rgba(10,10,10,0.64)', lineHeight: '1.55', letterSpacing: '-0.01em' }}>
        Building interfaces that feel inevitable. Currently at Peec AI, crafting AI-native design tools.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => setFollowing(f => !f)}
          style={{
            padding: '6px 16px', borderRadius: 8, cursor: 'pointer',
            background: following ? 'rgba(10,10,10,0.05)' : '#0a0a0a',
            color: following ? '#0a0a0a' : '#fff',
            border: `1px solid ${following ? 'rgba(10,10,10,0.1)' : '#0a0a0a'}`,
            fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em',
            transition: 'all 150ms ease', fontFamily: FONT,
          }}
        >{following ? 'Following' : 'Follow'}</button>
        <button style={{
          padding: '6px 16px', borderRadius: 8, cursor: 'pointer',
          background: 'rgba(10,10,10,0.04)', color: '#0a0a0a',
          border: '1px solid rgba(10,10,10,0.08)',
          fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em', fontFamily: FONT,
        }}>Message</button>
      </div>
    </div>
  )
}

// ─── Article card ─────────────────────────────────────────────────────────────

function ArticleSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Skeleton height={144} radius={10} />
      <div style={{ display: 'flex', gap: 6 }}>
        <Skeleton width={52} height={22} radius={11} />
        <Skeleton width={66} height={22} radius={11} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <Skeleton height={15} />
        <Skeleton height={15} width="78%" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Skeleton height={12} />
        <Skeleton height={12} />
        <Skeleton height={12} width="55%" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Skeleton width={22} height={22} radius={11} />
          <Skeleton width={56} height={11} />
        </div>
        <Skeleton width={52} height={11} />
      </div>
    </div>
  )
}

function ArticleLoaded() {
  const [liked, setLiked] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: FONT }}>
      <div style={{
        height: 144, borderRadius: 10,
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36,
      }}>🎨</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {['Design', 'UI/UX'].map(tag => (
          <span key={tag} style={{
            padding: '3px 10px', borderRadius: 11,
            background: 'rgba(10,10,10,0.05)',
            fontSize: 11, fontWeight: 600, color: 'rgba(10,10,10,0.5)', letterSpacing: '-0.01em',
          }}>{tag}</span>
        ))}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', lineHeight: '1.35' }}>
        Designing for the gap between intention and action
      </div>
      <p style={{ margin: 0, fontSize: 12, color: 'rgba(10,10,10,0.55)', lineHeight: '1.6', letterSpacing: '-0.01em' }}>
        Good interfaces anticipate what you need before you know you need it. Here's how to design for intent rather than instruction.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
        <button
          onClick={() => setLiked(l => !l)}
          style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <span style={{ fontSize: 15, filter: liked ? 'none' : 'grayscale(1)', transition: 'filter 150ms ease' }}>❤️</span>
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '-0.01em',
            color: liked ? '#ef4444' : 'rgba(10,10,10,0.4)',
            transition: 'color 150ms ease', fontFamily: FONT,
          }}>{liked ? '243' : '242'}</span>
        </button>
        <span style={{ fontSize: 11, color: 'rgba(10,10,10,0.4)', letterSpacing: '-0.01em', fontWeight: 500 }}>5 min read</span>
      </div>
    </div>
  )
}

// ─── Card wrapper (crossfade) ─────────────────────────────────────────────────

function FadeCard({
  loaded,
  skeleton,
  content,
}: {
  loaded: boolean
  skeleton: React.ReactNode
  content: React.ReactNode
}) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: 16,
      padding: 20,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.07)',
      width: 268,
      maxWidth: '100%',
      position: 'relative',
      minHeight: 10,
    }}>
      {/* Skeleton layer */}
      <div style={{
        opacity: loaded ? 0 : 1,
        transition: 'opacity 280ms ease',
        pointerEvents: loaded ? 'none' : 'auto',
      }}>
        {skeleton}
      </div>

      {/* Content layer */}
      <div style={{
        position: 'absolute',
        inset: 20,
        opacity: loaded ? 1 : 0,
        transition: 'opacity 280ms ease 120ms',
        pointerEvents: loaded ? 'auto' : 'none',
      }}>
        {content}
      </div>
    </div>
  )
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

function SkeletonDemo() {
  const [loaded, setLoaded] = useState(false)
  const [pending, setPending] = useState(false)

  function toggle() {
    if (loaded) { setLoaded(false); return }
    setPending(true)
    setTimeout(() => { setPending(false); setLoaded(true) }, 1200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36 }}>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>Profile</p>
          <FadeCard loaded={loaded} skeleton={<ProfileSkeleton />} content={<ProfileLoaded />} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: 'rgba(10,10,10,0.35)', fontFamily: FONT }}>Article</p>
          <FadeCard loaded={loaded} skeleton={<ArticleSkeleton />} content={<ArticleLoaded />} />
        </div>
      </div>

      <button
        onClick={toggle}
        disabled={pending}
        style={{
          padding: '9px 26px', borderRadius: 10,
          background: pending ? 'rgba(10,10,10,0.05)' : '#0a0a0a',
          color: pending ? 'rgba(10,10,10,0.3)' : '#fff',
          border: `1px solid ${pending ? 'rgba(10,10,10,0.1)' : '#0a0a0a'}`,
          fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em',
          cursor: pending ? 'default' : 'pointer',
          transition: 'all 200ms ease', fontFamily: FONT,
        }}
      >
        {pending ? 'Loading…' : loaded ? 'Reset' : 'Reveal content'}
      </button>
    </div>
  )
}

// ─── Copyable source ──────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Global shimmer keyframes ────────────────────────────────────────────────
// Add this once to your global CSS (or inject via a <style> tag):
//
//   @keyframes skeleton-shimmer {
//     0%   { background-position: 200% 0; }
//     100% { background-position: -200% 0; }
//   }

// ─── Skeleton primitive ──────────────────────────────────────────────────────

export function Skeleton({
  width = '100%',
  height = 14,
  radius = 6,
}: {
  width?: string | number
  height?: string | number
  radius?: number
}) {
  return (
    <div style={{
      width,
      height,
      borderRadius: radius,
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-shimmer 1.4s ease-in-out infinite',
      flexShrink: 0,
    }} />
  )
}

// ─── FadeCard wrapper ────────────────────────────────────────────────────────
// Crossfades between skeleton and loaded content.

export function FadeCard({
  loaded,
  skeleton,
  content,
}: {
  loaded: boolean
  skeleton: React.ReactNode
  content: React.ReactNode
}) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        opacity: loaded ? 0 : 1,
        transition: 'opacity 280ms ease',
        pointerEvents: loaded ? 'none' : 'auto',
      }}>
        {skeleton}
      </div>
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: loaded ? 1 : 0,
        transition: 'opacity 280ms ease 120ms',
        pointerEvents: loaded ? 'auto' : 'none',
      }}>
        {content}
      </div>
    </div>
  )
}

// ─── Example usage ───────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <Skeleton width={44} height={44} radius={22} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
          <Skeleton width="62%" height={13} />
          <Skeleton width="42%" height={11} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <Skeleton height={12} />
        <Skeleton height={12} width="88%" />
        <Skeleton height={12} width="65%" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Skeleton width={84} height={32} radius={8} />
        <Skeleton width={84} height={32} radius={8} />
      </div>
    </div>
  )
}

function ProfileLoaded() {
  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 22,
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: '#fff', fontWeight: 700, flexShrink: 0,
        }}>V</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>Vraj Shah</div>
          <div style={{ fontSize: 12, color: 'rgba(10,10,10,0.45)', letterSpacing: '-0.01em' }}>Product Designer</div>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: 'rgba(10,10,10,0.64)', lineHeight: '1.55', letterSpacing: '-0.01em' }}>
        Building interfaces that feel inevitable.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={{ padding: '6px 16px', borderRadius: 8, background: '#0a0a0a', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>Follow</button>
        <button style={{ padding: '6px 16px', borderRadius: 8, background: 'rgba(10,10,10,0.05)', color: '#0a0a0a', border: '1px solid rgba(10,10,10,0.08)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>Message</button>
      </div>
    </div>
  )
}

export default function Example() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div>
      {/* Inject keyframes once */}
      <style>{\`
        @keyframes skeleton-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
      \`}</style>

      <div style={{
        background: '#fff',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: 16,
        padding: 20,
        width: 268,
      }}>
        <FadeCard
          loaded={loaded}
          skeleton={<ProfileSkeleton />}
          content={<ProfileLoaded />}
        />
      </div>

      <button onClick={() => setLoaded(l => !l)} style={{ marginTop: 16 }}>
        {loaded ? 'Reset' : 'Load'}
      </button>
    </div>
  )
}`

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SkeletonPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>

      {/* Inject shimmer keyframes */}
      <style>{`
        @keyframes skeleton-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
      }}>
        <SkeletonDemo />
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
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
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
