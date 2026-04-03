'use client'

const blurLayers = [
  { blur: '1px',  mask: 'linear-gradient(to bottom, transparent 55%, white 75%)' },
  { blur: '3px',  mask: 'linear-gradient(to bottom, transparent 65%, white 82%)' },
  { blur: '6px',  mask: 'linear-gradient(to bottom, transparent 72%, white 88%)' },
  { blur: '12px', mask: 'linear-gradient(to bottom, transparent 78%, white 93%)' },
  { blur: '20px', mask: 'linear-gradient(to bottom, transparent 83%, white 97%)' },
]

export default function ProgressiveBlurPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)', padding: '40px 24px' }}>

      {/* Outer frame — 3% opacity, 16:9 */}
      <div style={{
        width: '560px',
        height: '315px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.12)',
        position: 'relative',
        backdropFilter: 'blur(2px)',
      }}>

      {/* Inner card — elevated, 40px from top */}
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '340px',
        height: '240px',
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.10), 0 32px 64px rgba(0,0,0,0.06)',
        position: 'relative' as const,
        overflow: 'hidden',
      }}>

        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', height: '100%', padding: '20px 20px 16px', scrollbarWidth: 'none' }}>
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '8px' }}>
            <p style={{ fontSize: '13px', lineHeight: '21px', color: 'var(--text-bio)', fontWeight: 500, letterSpacing: '-0.02em', margin: 0 }}>
              For the past few years, I've been designing end-to-end at YC and Sequoia-backed startups — across fintech, AI, and health. Shipping products used by real people, where clarity isn't a nice-to-have.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '21px', color: 'var(--text-bio)', fontWeight: 500, letterSpacing: '-0.02em', margin: 0 }}>
              I'm drawn to 0→1 problems. The kind where there's no template, no precedent — just a blank canvas and a hard constraint.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '21px', color: 'var(--text-bio)', fontWeight: 500, letterSpacing: '-0.02em', margin: 0 }}>
              I grew up playing drums. Took it seriously enough to earn a master's degree. Music taught me that the best work — in any medium — has rhythm, restraint, and nothing wasted. That's still how I design.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '21px', color: 'var(--text-bio)', fontWeight: 500, letterSpacing: '-0.02em', margin: 0 }}>
              Currently rounding rectangles at Peec AI. Before that: Model ML, Profound, nsave, Hale.
            </p>
          </div>

          {/* Footer row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['Say hello', 'X', 'LinkedIn'].map(label => (
                <span key={label} style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '-0.02em', cursor: 'pointer' }}>{label}</span>
              ))}
            </div>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', fontFamily: 'ui-monospace, monospace' }}>© 2026 Vraj</span>
          </div>
        </div>

        {/* Progressive blur overlay layers */}
        {blurLayers.map((layer, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              backdropFilter: `blur(${layer.blur})`,
              WebkitBackdropFilter: `blur(${layer.blur})`,
              maskImage: layer.mask,
              WebkitMaskImage: layer.mask,
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>{/* /inner card */}
      </div>{/* /outer frame */}

      {/* Label */}
      <p style={{ marginTop: '16px', fontSize: '13px', color: 'rgba(0,0,0,0.35)', fontWeight: 500, letterSpacing: '-0.01em' }}>
        Progressive blur on scroll
      </p>

    </main>
  )
}
