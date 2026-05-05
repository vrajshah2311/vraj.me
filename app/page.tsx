'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

const font = 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Expanded content per item ───────────────────────────────────────────────

type ExpandedContent = {
  lines: string[]
  images?: string[]
  videos?: string[]
  cta?: { label: string; href: string }
}

const EXPANDED: Record<string, ExpandedContent> = {
  'About': {
    lines: [
      '~Now',
      'Founding Designer at <em>Peec AI</em>.',
      'Helping brands understand',
      'how AI talks about them.',
      '<em>Search analytics</em>, visibility,',
      'what machines say when',
      'you\'re not in the room.',
      '',
      '~Experience',
      '<em>Ten plus products</em> shipped.',
      'Fintech, AI, health, ML.',
      'Profound, nsave, Model ML, Hale.',
      'Learned something different',
      'from each. Mostly <em>restraint</em>.',
      '',
      '~Process',
      '<em>Plan.</em> Talk to users first.',
      'Read the data. Understand why',
      'before touching any tool.',
      '',
      '<em>Prototype.</em> Go wide, then narrow.',
      'Kill bad ideas while they\'re cheap.',
      '',
      '<em>Build.</em> Sit with engineers.',
      'Not throw things over a wall.',
      'Every pixel earns its place.',
      '',
      '<em>Release.</em> Measure what moved.',
      'Iterate on real signal.',
      'Never call it done.',
      '',
      '~Thinking',
      'Every screen ships with',
      'a <em>business reason</em>.',
      '<em>Retention, activation, revenue.</em>',
      'Pretty but useless?',
      'That\'s just <em>decoration</em>.',
      '',
      '~Craft',
      '<em>Systems thinker.</em>',
      '<em>Feelings designer.</em>',
      'The weight of a <em>font</em>.',
      'The pause before a <em>transition</em>.',
      'The <em>quiet</em> between elements.',
      'Why a button <em>feels right</em>',
      'before anyone can say why.',
      '',
      'Making things that <em>move</em>.',
      'Not animation. <em>Emotion.</em>',
      'The kind that pulls you in.',
      '',
      'Caring about <em>craft</em>',
      'nobody will notice.',
      'The <em>0.5px border</em>.',
      'The easing that makes',
      'a menu feel <em>liquid</em>.',
      'A <em>loading state</em> that',
      'doesn\'t waste your time.',
      '',
      '~Location',
      '<em>Berlin</em>, Germany.',
      'From <em>India</em>.',
      'Always <em>making</em> something.',
    ],
  },
  'Peec AI': {
    lines: [
      'AI search analytics platform.',
      'Track how brands appear across',
      'ChatGPT, Perplexity, Gemini.',
      '',
      'Designed the core product —',
      'dashboards, prompt tracking,',
      'command palette, actions.',
    ],
    images: [
      '/images/case-studies/peec-ai/peec-cmdk-1.png',
      '/images/case-studies/peec-ai/peec-cmdk-2.png',
      '/images/case-studies/peec-ai/peec-cmdk-3.png',
      '/images/case-studies/peec-ai/peec-map-1.png',
      '/images/case-studies/peec-ai/peec-brands-1.png',
      '/images/case-studies/peec-ai/peec-url-details-1.png',
      '/images/case-studies/peec-ai/projects-cpp.png',
      '/images/case-studies/peec-ai/aa1.png',
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
    ],
    videos: ['/videos/peec-ai-product.mp4'],
  },
  'Profound': {
    lines: [
      'AI search intelligence.',
      'Helps brands understand how',
      'AI agents talk about them.',
      '',
      'Led design from research',
      'to shipped product.',
    ],
    images: [
      '/images/case-studies/profound/pr1.png',
      '/images/case-studies/profound/platforms.png',
      '/images/case-studies/profound/pr2.png',
      '/images/case-studies/profound/pr5.png',
      '/images/case-studies/profound/pr3.png',
      '/images/case-studies/profound/pr6.png',
      '/images/case-studies/profound/pr7.png',
      '/images/case-studies/profound/pr4.png',
      '/images/case-studies/profound/pem1.png',
      '/images/case-studies/profound/pem2.png',
      '/images/case-studies/profound/pem3.png',
      '/images/case-studies/profound/pem4.png',
      '/images/case-studies/profound/pem5.png',
      '/images/case-studies/profound/pem6.png',
    ],
    videos: ['/videos/profound-cve.mp4', '/videos/profound-search.mp4'],
  },
  'nsave': {
    lines: [
      'Cross-border fintech.',
      'Savings, investments, banking',
      'for emerging markets.',
      '',
      'End-to-end product design.',
      'Multi-currency, compliance,',
      'trust-first interface.',
    ],
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
  'Model ML': {
    lines: [
      'B2B machine learning platform.',
      'Build, deploy, monitor',
      'AI models at scale.',
      '',
      'Dashboard and data viz.',
    ],
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
  'Hale': {
    lines: [
      'Health and wellness platform.',
      'Sustainable habits through',
      'coaching and community.',
    ],
    images: [
      '/images/case-studies/hale/hale-1.png',
      '/images/case-studies/hale/hale-2.png',
      '/images/case-studies/hale/hale-3.png',
      '/images/case-studies/hale/hale-4.png',
    ],
  },
  'Expedite': {
    lines: [
      'Coming soon.',
    ],
  },
}

// ─── Links ───────────────────────────────────────────────────────────────────

type LinkItem = { label: string; href: string; external?: boolean; light?: boolean }

const LINKS: { section: string; items: LinkItem[] }[] = [
  { section: 'work', items: [
    { label: 'About', href: '#' },
    { label: 'Peec AI', href: '/peec-ai' },
    { label: 'Profound', href: '/profound' },
    { label: 'nsave', href: '/nsave' },
    { label: 'Model ML', href: '/model-ml' },
    { label: 'Hale', href: '/hale' },
    { label: 'Expedite', href: '/expedite' },
    { label: 'Show all', href: '/all-work', light: true },
  ]},
  { section: 'explore', items: [
    { label: 'Lab', href: '/lab' },
    { label: 'Try it out', href: '/lab/try-it-out' },
  ]},
  { section: 'connect', items: [
    { label: 'X', href: 'https://x.com/shahvraj99', external: true },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vraj-shah-375990199/', external: true },
    { label: 'Resume', href: '/resume' },
    { label: 'Calendar', href: 'https://cal.com/vraj-shah/say-hello-to-vraj?overlayCalendar=true', external: true },
  ]},
]

// ─── Page ────────────────────────────────────────────────────────────────────

// ─── Scroll Reveal Line ──────────────────────────────────────────────────────

function ScrollLine({ children, isHeader, delay }: { children: React.ReactNode; isHeader?: boolean; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const parent = el.closest('[data-scroll-container]') as HTMLElement | null
    const target = parent || window
    let rafId = 0

    const update = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const center = vh * 0.4
      const dist = Math.abs(rect.top + rect.height / 2 - center)
      const maxDist = vh * 0.35
      const p = Math.max(0, Math.min(1, 1 - dist / maxDist))
      const opacity = isHeader ? 0.3 + p * 0.15 : 0.06 + p * 0.94
      el.style.opacity = String(opacity)
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    target.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => { target.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId) }
  }, [isHeader])

  return (
    <div ref={ref} style={{
      animation: `lineIn 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s both`,
      willChange: 'opacity',
    }}>
      {children}
    </div>
  )
}

function ProfileImage() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const parent = el.closest('[data-scroll-container]') as HTMLElement | null
    const target = parent || window
    let rafId = 0

    const update = () => {
      const scrollContainer = el.closest('[data-scroll-container]') as HTMLElement | null
      if (!scrollContainer) return
      const scrollTop = scrollContainer.scrollTop
      // Start shrinking after 50px of scroll, fully hidden by 350px
      const progress = Math.min(1, Math.max(0, (scrollTop - 50) / 300))

      const scale = 1 - progress * 0.65  // shrink to 35%
      const opacity = 1 - progress
      el.style.transform = `scale(${scale})`
      el.style.opacity = String(opacity)
      el.style.marginBottom = `${32 - progress * 32}px`
      el.style.height = `${266 * (1 - progress)}px`
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    target.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => { target.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId) }
  }, [])

  return (
    <div
      ref={ref}
      style={{
        marginBottom: 'clamp(16px, 3vw, 32px)' as any,
        width: 'clamp(120px, 30vw, 200px)' as any,
        height: 'clamp(160px, 40vw, 266px)' as any,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        transformOrigin: 'top left',
        willChange: 'transform, opacity',
        animation: 'lineIn 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) both',
      }}
    >
      <Image
        src="/images/avatars/profile.png"
        alt="Vraj Shah"
        fill
        style={{ objectFit: 'cover' }}
        sizes="200px"
      />
    </div>
  )
}

function ScrollFadeWrapper({ children, className }: { hasMedia?: boolean; children: React.ReactNode; className?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [canScrollDown, setCanScrollDown] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let rafId = 0

    const update = () => {
      setScrollTop(el.scrollTop)
      setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 2)
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId) }
  }, [])

  const showTop = scrollTop > 5
  const showBottom = canScrollDown

  return (
    <div className={className} style={{ flex: 1, position: 'relative', maxHeight: '100%' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(to bottom, var(--bg, #ffffff), transparent)',
        zIndex: 1, pointerEvents: 'none',
        opacity: showTop ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(to top, var(--bg, #ffffff), transparent)',
        zIndex: 1, pointerEvents: 'none',
        opacity: showBottom ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }} />
      <div ref={scrollRef} data-scroll-container onClick={e => e.stopPropagation()} style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
        padding: 'clamp(20px, 3vw, 32px)' as any, overflowY: 'auto', maxHeight: '100%', WebkitOverflowScrolling: 'touch' as any,
        cursor: 'default',
      }}>
        {children}
      </div>
    </div>
  )
}

function HighlightSpan({ text, visible }: { text: string; visible: boolean }) {
  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <span style={{
        position: 'absolute', left: -3, right: -3, top: 2, bottom: 2,
        background: 'oklch(0.95 0.1 90 / 0.5)',
        borderRadius: 4, zIndex: -1,
        transform: visible ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }} />
      {text}
    </span>
  )
}

function ScrollHighlightLine({ line, delay }: { line: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const highlightTriggered = useRef(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const parent = el.closest('[data-scroll-container]') as HTMLElement | null
    const target = parent || window
    let rafId = 0

    // Use IntersectionObserver for highlight trigger
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !highlightTriggered.current) {
          highlightTriggered.current = true
          setVisible(true)
        }
      },
      { root: parent, threshold: 0.1 }
    )
    observer.observe(el)

    const update = () => {
      const rect = el.getBoundingClientRect()
      const containerRect = parent ? parent.getBoundingClientRect() : { top: 0, height: window.innerHeight }
      const containerCenter = containerRect.top + containerRect.height * 0.4
      const elCenter = rect.top + rect.height / 2
      const dist = Math.abs(elCenter - containerCenter)
      const maxDist = containerRect.height * 0.4
      const p = Math.max(0, Math.min(1, 1 - dist / maxDist))
      const opacity = 0.06 + p * 0.94
      el.style.opacity = String(opacity)
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    target.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => { target.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId); observer.disconnect() }
  }, [])

  const parts = line.split(/(<em>.*?<\/em>)/g)

  return (
    <div ref={ref} style={{
      fontFamily: font, fontSize: 'var(--v2-font-size, 44px)' as any, fontWeight: 600,
      lineHeight: 'var(--v2-line-height, 44px)' as any, letterSpacing: '-0.05em',
      color: '#171717',
      willChange: 'opacity',
      animation: `lineIn 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s both`,
    }}>
      {parts.map((part, pi) => {
        if (part.startsWith('<em>')) {
          return <HighlightSpan key={pi} text={part.replace(/<\/?em>/g, '')} visible={visible} />
        }
        return <span key={pi}>{part}</span>
      })}
    </div>
  )
}

export default function HomePage() {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null)
  const [hoveredIdx, setHoveredIdx] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [closing, setClosing] = useState(false)
  const [displayedExpanded, setDisplayedExpanded] = useState<string | null>(null)

  const closeExpanded = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      setExpanded(null)
      setDisplayedExpanded(null)
      setClosing(false)
    }, 400)
  }, [])

  useEffect(() => {
    if (expanded) {
      setDisplayedExpanded(expanded)
      setClosing(false)
    }
  }, [expanded])

  const expandedContent = displayedExpanded ? EXPANDED[displayedExpanded] : null
  const isExpandedVisible = !!expanded && !closing
  const previewImages = hoveredLabel && !expanded ? (EXPANDED[hoveredLabel]?.images ?? null) : null

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && expanded) closeExpanded() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [expanded, closeExpanded])

  return (
    <main style={{
      minHeight: '100vh',
      position: 'relative',
    }}>
      <style>{`
        @keyframes v2FadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes imgIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes ticker {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        :root {
          --v2-font-size: clamp(28px, 6vw, 44px);
          --v2-line-height: clamp(30px, 6.2vw, 46px);
        }
        @media (min-width: 1720px) {
          :root {
            --v2-font-size: 56px;
            --v2-line-height: 58px;
          }
        }
        .v2-link {
          text-decoration: none;
          display: block;
          cursor: pointer;
        }
        .v2-media-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          width: 100%;
        }
        @media (max-width: 900px) {
          .v2-media-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .v2-media-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .v2-expanded { flex-direction: column !important; }
          .v2-expanded-text { flex: 1 !important; max-height: none !important; max-width: none !important; }
          .v2-expanded-media { flex: none !important; max-height: none !important; width: 100% !important; padding: 20px !important; }
        }
      `}</style>

      {/* Links view */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        minHeight: '100dvh', padding: 'clamp(20px, 3vw, 32px)' as any, boxSizing: 'border-box' as const,
        opacity: isExpandedVisible ? 0 : 1,
        transform: isExpandedVisible ? 'translateY(-12px)' : 'translateY(0)',
        transition: 'opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
        pointerEvents: isExpandedVisible ? 'none' : 'auto',
        position: 'relative', zIndex: 2,
      }}>
        {LINKS.map((section, si) => (
          <div key={section.section} style={{
            animation: `v2FadeIn 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${si * 0.08}s both`,
          }}>
            {section.items.map((link, li) => {
              const id = `${si}-${li}`
              const isHovered = hoveredIdx === id
              const anyHovered = hoveredIdx !== null
              const hasExpanded = !!EXPANDED[link.label]

              return (
                <a
                  key={link.label}
                  href={hasExpanded ? undefined : link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="v2-link"
                  onClick={hasExpanded ? (e) => { e.preventDefault(); setExpanded(link.label) } : undefined}
                  onMouseEnter={() => { setHoveredIdx(id); setHoveredLabel(link.label) }}
                  onMouseLeave={() => { setHoveredIdx(null); setHoveredLabel(null) }}
                  style={{
                    fontFamily: font,
                    fontSize: 'var(--v2-font-size, 44px)' as any,
                    fontWeight: 600,
                    lineHeight: 'var(--v2-line-height, 44px)' as any,
                    letterSpacing: '-0.05em',
                    color: isHovered
                      ? '#171717'
                      : anyHovered
                      ? 'oklch(0 0 0 / 0.12)'
                      : link.light ? 'oklch(0 0 0 / 0.18)' : 'oklch(0 0 0 / 0.3)',
                    padding: '1px 0',
                    transition: 'color 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    animation: `v2FadeIn 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${si * 0.08 + li * 0.04}s both`,
                  }}
                >
                  {link.label}
                </a>
              )
            })}
          </div>
        ))}
      </div>

      {/* Hover image preview — right side */}
      <div style={{
        position: 'fixed',
        top: 32, right: 32, bottom: 32,
        width: 'calc(50vw - 48px)',
        display: 'flex', flexDirection: 'column', gap: 0,
        opacity: previewImages ? 1 : 0,
        transform: previewImages ? 'translateX(0)' : 'translateX(12px)',
        transition: 'opacity 0.35s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)',
        pointerEvents: 'none',
        overflowY: 'auto',
        zIndex: 1,
      }}>
        {previewImages && previewImages.map((src, i) => (
          <div key={src} style={{
            width: '100%', aspectRatio: '16/9', overflow: 'hidden', position: 'relative',
            background: 'oklch(0 0 0 / 0.02)', flexShrink: 0,
            animation: `imgIn 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) ${i * 0.06}s both`,
          }}>
            <Image src={src} alt="" fill style={{ objectFit: 'cover' }} sizes="50vw" />
          </div>
        ))}
      </div>

      {/* Expanded view */}
      {expandedContent && (
        <div
          onClick={() => closeExpanded()}
          style={{
            position: 'fixed', inset: 0,
            display: 'flex', gap: 0,
            opacity: isExpandedVisible ? 1 : 0,
            transform: isExpandedVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
            cursor: 'pointer', zIndex: 3, background: 'var(--bg, #ffffff)',
          }}
          className="v2-expanded"
        >
          {/* Single scrollable content */}
          <ScrollFadeWrapper hasMedia={false} className="v2-expanded-text">
            {/* Back button */}
            <button
              onClick={(e) => { e.stopPropagation(); closeExpanded() }}
              style={{
                background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer',
                fontSize: 13, fontWeight: 500, color: 'oklch(0 0 0 / 0.35)',
                display: 'flex', alignItems: 'center', gap: 4,
                marginBottom: 16, transition: 'color 0.15s ease',
                animation: 'lineIn 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) both',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#171717')}
              onMouseLeave={e => (e.currentTarget.style.color = 'oklch(0 0 0 / 0.35)')}
            >← Back</button>

            {/* Label — hide for About */}
            {expanded !== 'About' && (
              <div style={{
                fontFamily: font, fontSize: 'var(--v2-font-size, 44px)' as any, fontWeight: 600,
                lineHeight: 'var(--v2-line-height, 44px)' as any, letterSpacing: '-0.05em',
                color: 'oklch(0 0 0 / 0.15)',
                marginBottom: 24,
                animation: 'lineIn 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) both',
              }}>{expanded}</div>
            )}

            {/* Profile image — About only */}
            {displayedExpanded === 'About' && (
              <ProfileImage />
            )}

            {/* Lines */}
            {expandedContent.lines.map((line, i) => {
              if (line === '') return <div key={i} style={{ minHeight: 'var(--v2-line-height, 44px)' as any, height: 'var(--v2-line-height, 44px)' as any, flexShrink: 0, width: '100%' }} />
              if (line.startsWith('~')) return (
                <ScrollLine key={i} isHeader delay={i * 0.04}>
                  <div style={{
                    fontFamily: font, fontSize: 'var(--v2-font-size, 44px)' as any, fontWeight: 600,
                    lineHeight: 'var(--v2-line-height, 44px)' as any, letterSpacing: '-0.05em',
                    color: 'oklch(0 0 0 / 0.15)',
                  }}>{line.slice(1)}</div>
                </ScrollLine>
              )
              return <ScrollHighlightLine key={i} line={line} delay={i * 0.04} />
            })}

            {/* CTA */}
            {expandedContent.cta && (
              <a
                href={expandedContent.cta.href}
                onClick={e => e.stopPropagation()}
                style={{
                  fontFamily: font, fontSize: 16, fontWeight: 500,
                  color: 'oklch(0 0 0 / 0.35)',
                  textDecoration: 'none', marginTop: 24, marginBottom: 32,
                  transition: 'color 0.2s ease',
                  animation: `lineIn 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${expandedContent.lines.length * 0.04}s both`,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#171717')}
                onMouseLeave={e => (e.currentTarget.style.color = 'oklch(0 0 0 / 0.35)')}
              >{expandedContent.cta.label}</a>
            )}

            {/* Images & videos grid */}
            {(expandedContent.videos?.length || expandedContent.images?.length) && (
              <div className="v2-media-grid">
                {expandedContent.videos?.map((src, i) => (
                  <div key={src} style={{
                    width: '100%', aspectRatio: '16/9', overflow: 'hidden', position: 'relative',
                    background: 'oklch(0 0 0 / 0.02)', borderRadius: 12,
                    animation: `imgIn 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) ${i * 0.08}s both`,
                  }}>
                    <video src={src} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                ))}
                {expandedContent.images?.map((src, i) => (
                  <div key={src} style={{
                    width: '100%', aspectRatio: '16/9', overflow: 'hidden', position: 'relative',
                    background: 'oklch(0 0 0 / 0.02)', borderRadius: 12,
                    animation: `imgIn 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) ${(expandedContent.videos?.length ?? 0) * 0.08 + i * 0.05}s both`,
                  }}>
                    <Image src={src} alt="" fill style={{ objectFit: 'cover' }} sizes="33vw" />
                  </div>
                ))}
              </div>
            )}
          </ScrollFadeWrapper>
        </div>
      )}
    </main>
  )
}
