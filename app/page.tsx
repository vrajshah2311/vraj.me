'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
const ImageLightbox = dynamic(() => import('../components/ImageLightbox'), { ssr: false })

const font = 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Expanded content per item ───────────────────────────────────────────────

type ExpandedContent = {
  lines: string[]
  images?: string[]
  videos?: string[]
  cta?: { label: string; href: string }
  lockedFrames?: number
}

const EXPANDED: Record<string, ExpandedContent> = ((): Record<string, ExpandedContent> => {
  const base: Record<string, ExpandedContent> = {
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
      '/images/case-studies/peec-ai/Cmdk%2001.png',
      '/images/case-studies/peec-ai/Cmdk%2002.png',
      '/images/case-studies/peec-ai/Cmdk%2003.png',
      '/images/case-studies/peec-ai/Peec%20Actions%20v.1.png',
      '/images/case-studies/peec-ai/Peec%20Actions%20v.2.png',
      '/images/case-studies/peec-ai/Peec%20Actions%20v.3.png',
      '/images/case-studies/peec-ai/Peec%20Actions%20v.4.png',
      '/images/case-studies/peec-ai/Peec%20Actions%20v.5.png',
      '/images/case-studies/peec-ai/MCP.png',
      '/images/case-studies/peec-ai/peec-map-1.png',
      '/images/case-studies/peec-ai/Peec%20brands-1.png',
      '/images/case-studies/peec-ai/Peec%20URL%20details-1.png',
      '/images/case-studies/peec-ai/URL%20table.png',
      '/images/case-studies/peec-ai/Peec%20Overview-1.png',
      '/images/case-studies/peec-ai/Projects%20CPP.png',
      '/images/case-studies/peec-ai/AA1.png',
      '/images/case-studies/peec-ai/AA4.png',
      '/images/case-studies/peec-ai/Peec%20prompts-1.png',
      '/images/case-studies/peec-ai/Peec%20prompts-2.png',
      '/images/case-studies/peec-ai/Peec%20prompts%20table-2.png',
      '/images/case-studies/peec-ai/Peec%20prompt%20builder-1.png',
      '/images/case-studies/peec-ai/Peec%20prompt%20builder-2.png',
      '/images/case-studies/peec-ai/Peec%20Actions-1.png',
      '/images/case-studies/peec-ai/Peec%20Actions-2.png',
      '/images/case-studies/peec-ai/Peec%20Actions-3.png',
      '/images/case-studies/peec-ai/Peec%20Actions-4.png',
      '/images/case-studies/peec-ai/Peec%20Matrix-1.png',
      '/images/case-studies/peec-ai/Peec%20Onboarding-1.png',
      '/images/case-studies/peec-ai/Peec%20Onboarding-2.png',
      '/images/case-studies/peec-ai/Peec%20Onboarding%20-3.png',
      '/images/case-studies/peec-ai/Peec%20date%20picker%20-1.png',
      '/images/case-studies/peec-ai/Peec%20table%20-1.png',
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
      '/images/case-studies/profound/p10.png',
      '/images/case-studies/profound/p11.png',
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
      'AI teammates for finance.',
      'Automates the most painful',
      'workflows at the world\'s',
      'largest financial institutions.',
      '',
      'Some screens redesigned.',
      'Some flows built from scratch.',
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
    lockedFrames: 10,
  },
  'Hale': {
    lines: [
      'Health testing at home.',
      'Know your risks before',
      'symptoms ever show up.',
      '',
      'Led design direction.',
      '<a href="https://x.com/faizanwr">Faiz</a> on the team.',
    ],
    images: [
      '/images/case-studies/hale/hale-1.png',
      '/images/case-studies/hale/hale-2.png',
      '/images/case-studies/hale/hale-3.png',
      '/images/case-studies/hale/hale-4.png',
    ],
    lockedFrames: 10,
  },
  'Ninja': {
    lines: [
      'Crypto / web3 wallet.',
      'Send, swap, and stake',
      'across chains in seconds.',
      '',
      'Designed core flows —',
      'onboarding, swap, dashboards.',
    ],
    images: [
      '/images/case-studies/ninja/ninja-1.png',
      '/images/case-studies/ninja/ninja-2.png',
      '/images/case-studies/ninja/ninja-3.png',
      '/images/case-studies/ninja/ninja-4.png',
      '/images/case-studies/ninja/ninja-5.png',
      '/images/case-studies/ninja/ninja-6.png',
      '/images/case-studies/ninja/ninja-7.png',
      '/images/case-studies/ninja/ninja-8.png',
      '/images/case-studies/ninja/ninja-9.png',
      '/images/case-studies/ninja/ninja-10.png',
      '/images/case-studies/ninja/ninja-11.png',
      '/images/case-studies/ninja/ninja-12.png',
      '/images/case-studies/ninja/ninja-13.png',
      '/images/case-studies/ninja/ninja-14.png',
      '/images/case-studies/ninja/ninja-15.png',
      '/images/case-studies/ninja/ninja-16.png',
    ],
  },
  'Linktree': {
    lines: [
      'The link in bio.',
      'Used by 50M+ creators',
      'to share everything they make.',
      '',
      'Designed parts of the dashboard',
      'and creator-monetization flows.',
    ],
    images: [
      '/images/case-studies/linktree/linktree-1.png',
      '/images/case-studies/linktree/linktree-2.png',
      '/images/case-studies/linktree/linktree-3.png',
    ],
  },
  'Expedite': {
    lines: [
      'On-demand delivery, fast.',
      'Designed key flows across',
      'consumer ordering and dispatch.',
    ],
    images: [
      '/images/case-studies/expedite/expedite-1.png',
      '/images/case-studies/expedite/expedite-2.png',
      '/images/case-studies/expedite/expedite-3.png',
      '/images/case-studies/expedite/expedite-4.png',
      '/images/case-studies/expedite/expedite-5.png',
      '/images/case-studies/expedite/expedite-6.png',
    ],
  },
  'Context AI': {
    lines: [
      'AI inside the apps you use.',
      'Inline assistants for docs,',
      'search, and team workflows.',
    ],
    images: [
      '/images/case-studies/context-ai/context-ai-2.png',
      '/images/case-studies/context-ai/context-ai-3.png',
    ],
  },
  'Other': {
    lines: [
      'Bits and pieces.',
      'Side projects and small surfaces',
      'that didn\'t need their own page.',
    ],
    images: [
      '/images/case-studies/misc/misc-ma-1.png',
      '/images/case-studies/misc/misc-ma-2.png',
      '/images/case-studies/misc/misc-mn-1.png',
      '/images/case-studies/misc/misc-el-1.png',
      '/images/case-studies/misc/misc-op-1.png',
    ],
  },
  }

  // "Show all" — every image from every case study, aggregated
  base['Show all'] = {
    lines: [
      'Everything in one place.',
      'Every product, every screen.',
    ],
    images: ['Peec AI', 'Profound', 'nsave', 'Model ML', 'Hale', 'Ninja', 'Linktree', 'Context AI', 'Expedite', 'Other']
      .flatMap(key => base[key]?.images ?? []),
  }

  return base
})()

// ─── Hover previews for non-expanded links ───────────────────────────────────

const HOVER_VIDEOS: Record<string, string[]> = {
  'Lab': [
    '/videos/peec-ai-map.mp4',
    '/videos/dropdown.mp4',
    '/videos/matrix.mp4',
    '/videos/actions-01.mp4',
    '/videos/toasts.mp4',
    '/videos/orb.mp4',
  ],
  'Try it out': [
    '/videos/actions-01.mp4',
    '/videos/toasts.mp4',
    '/videos/dropdown.mp4',
    '/videos/orb.mp4',
  ],
}

// ─── Links ───────────────────────────────────────────────────────────────────

type LinkItem = { label: string; href: string; external?: boolean; light?: boolean }

const LINKS: { section: string; items: LinkItem[] }[] = [
  { section: 'work', items: [
    { label: 'About', href: '#' },
    { label: 'Peec AI', href: '#' },
    { label: 'Profound', href: '#' },
    { label: 'nsave', href: '#' },
    { label: 'Model ML', href: '#' },
    { label: 'Hale', href: '#' },
    { label: 'Ninja', href: '#' },
    { label: 'Linktree', href: '#' },
    { label: 'Show all', href: '#', light: true },
  ]},
  { section: 'explore', items: [
    { label: 'Lab', href: '/lab' },
    { label: 'Try it out', href: '/lab/try-it-out' },
  ]},
  { section: 'connect', items: [
    { label: 'X', href: 'https://x.com/shahvraj99', external: true },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vraj-shah-375990199/', external: true },
    { label: 'Resume', href: '/resume' },
    { label: 'Say hi', href: 'https://cal.com/vraj-shah/say-hello-to-vraj?overlayCalendar=true', external: true },
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
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const inner = innerRef.current
    if (!wrap || !inner) return
    const target = wrap.closest('[data-scroll-container]') || window
    let rafId = 0

    const update = () => {
      const scrollContainer = wrap.closest('[data-scroll-container]') as HTMLElement | null
      if (!scrollContainer) return
      const scrollTop = scrollContainer.scrollTop
      const progress = Math.min(1, Math.max(0, (scrollTop - 50) / 300))
      const opacity = 1 - progress
      wrap.style.opacity = String(opacity)
      wrap.style.marginBottom = `${32 - progress * 32}px`
      // Collapse the wrapper height so text flows up
      wrap.style.maxHeight = `${120 * (1 - progress)}px`
    }

    const onScroll = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(update) }
    target.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => { target.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId) }
  }, [])

  return (
    <div ref={wrapRef} style={{ overflow: 'hidden', flexShrink: 0, marginBottom: 32, maxHeight: 120, transition: 'none', willChange: 'opacity, max-height, margin-bottom' }}>
      <div
        ref={innerRef}
        style={{
          width: 120,
          height: 120,
          borderRadius: 12,
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
          animation: 'lineIn 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) both',
        }}
      >
        <Image
          src="/images/avatars/profile.png"
          alt="Vraj Shah"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          sizes="120px"
        />
      </div>
    </div>
  )
}

function ScrollFadeWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollDown, setCanScrollDown] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let rafId = 0

    const update = () => {
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

  const showBottom = canScrollDown

  return (
    <div className={className} style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(to top, var(--bg, #ffffff), transparent)',
        zIndex: 1, pointerEvents: 'none',
        opacity: showBottom ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }} />
      <div ref={scrollRef} data-scroll-container
        onClick={e => e.stopPropagation()}
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
          paddingLeft: 'clamp(20px, 3vw, 32px)' as any,
          paddingRight: 'clamp(20px, 3vw, 32px)' as any,
          paddingBottom: 'clamp(20px, 3vw, 32px)' as any,
          paddingTop: 0,
          overflowY: 'auto',
          height: '100%',
          WebkitOverflowScrolling: 'touch' as any,
          touchAction: 'pan-y',
          scrollbarWidth: 'none' as any,
          msOverflowStyle: 'none' as any,
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

  const parts = line.split(/(<em>.*?<\/em>|<a href=".*?">.*?<\/a>)/g)

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
        const aMatch = part.match(/^<a href="(.*?)">(.*?)<\/a>$/)
        if (aMatch) {
          return (
            <a key={pi} href={aMatch[1]} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ position: 'relative', display: 'inline', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
              onMouseEnter={e => { const bg = e.currentTarget.querySelector('.a-highlight-bg') as HTMLElement; if (bg) bg.style.background = 'oklch(0.88 0.12 90 / 0.7)' }}
              onMouseLeave={e => { const bg = e.currentTarget.querySelector('.a-highlight-bg') as HTMLElement; if (bg) bg.style.background = 'oklch(0.95 0.1 90 / 0.5)' }}
            >
              <span className="a-highlight-bg" style={{
                position: 'absolute', left: -3, right: -3, top: 2, bottom: 2,
                background: 'oklch(0.95 0.1 90 / 0.5)',
                borderRadius: 4, zIndex: -1,
                transform: visible ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), background 0.15s ease',
              }} />
              {aMatch[2]}
            </a>
          )
        }
        return <span key={pi}>{part}</span>
      })}
    </div>
  )
}

// ─── Drawer tabs (above the bottom-sheet) ────────────────────────────────────

const DRAWER_TABS = ['Peec AI', 'Profound', 'nsave', 'Model ML', 'Hale', 'Ninja', 'Linktree', 'Context AI', 'Expedite', 'Other', 'Show all']

function DrawerTabs({ active, onChange }: { active: string | null; onChange: (s: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Keep the active tab scrolled into view (centered horizontally) when it changes
  useEffect(() => {
    if (!scrollRef.current || !active) return
    const btn = scrollRef.current.querySelector(`[data-tab="${active}"]`) as HTMLButtonElement | null
    btn?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [active])

  return (
    // Outer wrapper handles horizontal scroll without clipping vertical shadows.
    // Padding gives the inner container's outline shadow room to render.
    <div
      ref={scrollRef}
      className="drawer-tabs-scroll"
      style={{
        maxWidth: '100%',
        overflowX: 'auto',
        overflowY: 'visible',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        padding: '4px 4px',     // breathing room for the active button's outer ring + drop shadow
        margin: '-4px -4px',    // cancel the visual gap we just added
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 2,
          background: 'rgba(23, 23, 23, 0.04)',
          borderRadius: 10,
          userSelect: 'none',
        }}
      >
      {DRAWER_TABS.map(tab => {
        const isActive = active === tab
        return (
          <button
            key={tab}
            data-tab={tab}
            onClick={() => onChange(tab)}
            style={{
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 5,
              height: 28,
              paddingLeft: 6, paddingRight: 6,
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              overflow: 'hidden',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              outline: 'none',
              // Outlined when active, Ghost when inactive
              background: isActive ? '#FDFDFD' : 'transparent',
              boxShadow: isActive
                ? 'inset 0 -1px 0 rgba(23, 23, 23, 0.04), 0 1px 3px rgba(23, 23, 23, 0.08), 0 0 0 1px rgba(23, 23, 23, 0.06)'
                : 'none',
              color: isActive ? '#171717' : 'rgba(23, 23, 23, 0.60)',
              fontFamily: font,
              fontSize: 14,
              fontWeight: 500,
              lineHeight: '14px',
              transition: 'background 180ms cubic-bezier(0.32, 0.72, 0, 1), box-shadow 180ms cubic-bezier(0.32, 0.72, 0, 1), color 150ms ease',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'rgba(23, 23, 23, 0.85)' }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(23, 23, 23, 0.60)' }}
          >
            {tab}
          </button>
        )
      })}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null)
  const [hoveredIdx, setHoveredIdx] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [closing, setClosing] = useState(false)
  const [displayedExpanded, setDisplayedExpanded] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // ── Hover feedback: short tick + haptic on link hover ───────────────────
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
      // Play a silent buffer to fully unlock on iOS
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
    // Short white-noise burst, band-passed to ~2.5kHz, with a sharp attack
    // and ~25ms decay — the "tk" of a key bottoming out.
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
  const onLinkHover = useCallback(() => {
    playTick()
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(8)
  }, [playTick])

  const closeExpanded = useCallback(() => {
    setClosing(true)
    setLightboxIndex(null)
    setTimeout(() => {
      setExpanded(null)
      setDisplayedExpanded(null)
      setClosing(false)
    }, 400)
  }, [])

  // ── Drag-to-dismiss (Emil Kowalski's drawer principles) ───────────────────
  const drawerRef    = useRef<HTMLDivElement>(null)
  const backdropRef  = useRef<HTMLDivElement>(null)
  const tabsBarRef   = useRef<HTMLDivElement>(null)
  const dragRef      = useRef<{
    active: boolean
    pointerId: number
    startY: number
    lastY: number
    lastT: number
    velocity: number
    height: number
  } | null>(null)

  // Iframely-iOS easing — same curve Emil uses
  const DRAWER_EASE = 'cubic-bezier(0.32, 0.72, 0, 1)'

  const onDragStart = useCallback((e: React.PointerEvent) => {
    if (!drawerRef.current) return
    if (dragRef.current?.active) return
    const h = drawerRef.current.offsetHeight
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startY: e.clientY,
      lastY: e.clientY,
      lastT: performance.now(),
      velocity: 0,
      height: h,
    }
    // Only the drawer itself loses its transition during drag.
    // Tabs and backdrop stay put — owned by React.
    drawerRef.current.style.transition = 'none'
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onDragMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d?.active || d.pointerId !== e.pointerId || !drawerRef.current) return
    let delta = e.clientY - d.startY
    // Ignore tiny jitter (so a click doesn't move anything)
    if (Math.abs(delta) < 2) return
    // Damping when dragging up (overscroll resistance)
    if (delta < 0) delta = -Math.pow(-delta, 0.6) * 1.4
    drawerRef.current.style.transform = `translateY(${delta}px)`
    // Velocity for flick detection
    const now = performance.now()
    const dt = Math.max(1, now - d.lastT)
    d.velocity = (e.clientY - d.lastY) / dt
    d.lastY = e.clientY
    d.lastT = now
  }, [])

  const onDragEnd = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d?.active || d.pointerId !== e.pointerId || !drawerRef.current) return
    d.active = false

    const delta = e.clientY - d.startY
    const shouldClose = delta > d.height * 0.25 || d.velocity > 0.5

    drawerRef.current.style.transition = `transform 0.42s ${DRAWER_EASE}`

    if (shouldClose) {
      drawerRef.current.style.transform = 'translateY(100%)'
      setTimeout(() => closeExpanded(), 0)
    } else {
      drawerRef.current.style.transform = 'translateY(0)'
      setTimeout(() => {
        if (drawerRef.current) { drawerRef.current.style.transform = ''; drawerRef.current.style.transition = '' }
      }, 460)
    }
  }, [closeExpanded])

  useEffect(() => {
    if (expanded) {
      setDisplayedExpanded(expanded)
      setClosing(false)
      // Reset scroll position
      setTimeout(() => {
        const sc = document.querySelector('[data-scroll-container]')
        if (sc) sc.scrollTop = 0
      }, 50)
    }
  }, [expanded])

  const expandedContent = displayedExpanded ? EXPANDED[displayedExpanded] : null
  const isExpandedVisible = !!expanded && !closing
  const previewImages = hoveredLabel && !expanded ? (EXPANDED[hoveredLabel]?.images ?? null) : null
  const previewVideos = hoveredLabel && !expanded && !previewImages ? (HOVER_VIDEOS[hoveredLabel] ?? null) : null

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && expanded) closeExpanded() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [expanded, closeExpanded])

  return (
    <main style={{
      minHeight: '100vh',
      position: 'relative',
      background: 'var(--bg, #ffffff)',
    }}>
      <style>{`
        [data-scroll-container]::-webkit-scrollbar { display: none; }
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
        height: '100dvh', padding: 'clamp(20px, 3vw, 32px)' as any, boxSizing: 'border-box' as const,
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
                  onMouseEnter={() => { setHoveredIdx(id); setHoveredLabel(link.label); onLinkHover() }}
                  onFocus={onLinkHover}
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

      {/* Hover preview — right side */}
      <div style={{
        position: 'fixed',
        top: 32, right: 32, bottom: 32,
        width: 'calc(50vw - 48px)',
        display: 'flex', flexDirection: 'column', gap: 0,
        opacity: (previewImages || previewVideos) ? 1 : 0,
        transform: (previewImages || previewVideos) ? 'translateX(0)' : 'translateX(12px)',
        transition: 'opacity 0.35s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)',
        pointerEvents: 'none',
        overflowY: 'auto',
        zIndex: 1,
      }}>
        {previewImages && previewImages.map((src: string, i: number) => (
          <div key={src} style={{
            width: '100%', aspectRatio: '16/9', overflow: 'hidden', position: 'relative',
            background: 'oklch(0 0 0 / 0.02)', flexShrink: 0,
            animation: `imgIn 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) ${i * 0.06}s both`,
          }}>
            <Image src={src} alt="" fill style={{ objectFit: 'cover' }} sizes="50vw" />
          </div>
        ))}
        {previewVideos && previewVideos.map((src, i) => (
          <div key={src} style={{
            width: '100%', padding: 4, background: 'oklch(0 0 0 / 0.04)',
            borderRadius: 20, flexShrink: 0, marginBottom: 8,
            animation: `imgIn 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) ${i * 0.06}s both`,
          }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0px 0px 0px 1px oklch(0 0 0 / 0.06)' }}>
              <video src={src} autoPlay muted loop playsInline preload="none" style={{ width: '100%', aspectRatio: '429/269', display: 'block', objectFit: 'cover' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Expanded view — bottom-sheet drawer with tabs floating above */}
      {expandedContent && (
        <>
          {/* Backdrop — clean white over the page */}
          <div
            ref={backdropRef}
            onClick={() => closeExpanded()}
            style={{
              position: 'fixed', inset: 0, zIndex: 3,
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)' as any,
              opacity: isExpandedVisible ? 1 : 0,
              transition: 'opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
              cursor: 'pointer',
            }}
          />

          {/* Tabs above the drawer */}
          <div
            ref={tabsBarRef}
            style={{
              position: 'fixed', zIndex: 5,
              left: '50%',
              bottom: 'calc(92vh + 14px)',
              transform: `translateX(-50%) translateY(${isExpandedVisible ? 0 : 16}px)`,
              opacity: isExpandedVisible ? 1 : 0,
              transition: 'transform 0.45s cubic-bezier(0.32, 0.72, 0, 1) 0.05s, opacity 0.4s ease 0.05s',
              maxWidth: 'calc(100vw - 24px)',
              pointerEvents: isExpandedVisible ? 'auto' : 'none',
            }}
          >
            <DrawerTabs active={displayedExpanded} onChange={setExpanded} />
          </div>

          {/* Drawer */}
          <div
            ref={drawerRef}
            style={{
              position: 'fixed', zIndex: 4,
              bottom: 0, left: 0, right: 0,
              height: '92vh',
              background: '#ffffff',
              borderRadius: '24px 24px 0 0',
              transform: `translateY(${isExpandedVisible ? '0' : '100%'})`,
              transition: 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
              overflow: 'hidden',
              boxShadow: '0 -1px 0 rgba(10,10,10,0.06), 0 -16px 48px rgba(10,10,10,0.10)',
              display: 'flex', flexDirection: 'column',
              touchAction: 'none',
            }}
          >
            {/* Drag handle zone — drag from anywhere in this strip to dismiss */}
            <div
              onPointerDown={onDragStart}
              onPointerMove={onDragMove}
              onPointerUp={onDragEnd}
              onPointerCancel={onDragEnd}
              style={{
                flexShrink: 0,
                padding: '10px 0 8px',
                display: 'flex', justifyContent: 'center',
                touchAction: 'none',
                cursor: 'grab',
              }}
            >
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.18)', pointerEvents: 'none' }} />
            </div>

            {/* Close button */}
            <button
              onClick={closeExpanded}
              aria-label="Close"
              style={{
                position: 'absolute', top: 14, right: 16, zIndex: 2,
                background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 999,
                width: 32, height: 32, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.10)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
            >
              <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                <path d="M3 3l8 8M11 3l-8 8" stroke="rgba(0,0,0,0.55)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Scrollable content (key forces remount on tab switch so animations replay) */}
            <ScrollFadeWrapper key={displayedExpanded ?? ''} className="v2-expanded-text">
              {/* Label — hide for About */}
              {displayedExpanded !== 'About' && (
                <div style={{
                  fontFamily: font, fontSize: 'var(--v2-font-size, 44px)' as any, fontWeight: 600,
                  lineHeight: 'var(--v2-line-height, 44px)' as any, letterSpacing: '-0.05em',
                  color: 'oklch(0 0 0 / 0.15)',
                  marginBottom: 8,
                  animation: 'lineIn 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) both',
                }}>{displayedExpanded}</div>
              )}

            {/* Profile image — About only */}
            {displayedExpanded === 'About' && (
              <ProfileImage />
            )}

            {/* Lines */}
            {expandedContent.lines.map((line, i) => {
              if (line === '') return <div key={i} style={{ minHeight: 32, height: 32, flexShrink: 0, width: '100%' }} />
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
            {(expandedContent.videos?.length || expandedContent.images?.length || expandedContent.lockedFrames) && (
              <div className="v2-media-grid" style={{ marginTop: 48 }}>
                {expandedContent.videos?.map((src, i) => (
                  <div key={src}
                    onClick={e => { e.stopPropagation(); setLightboxIndex(i) }}
                    onMouseEnter={e => { const vid = e.currentTarget.querySelector('video') as HTMLElement; if (vid) vid.style.transform = 'scale(1.02)' }}
                    onMouseLeave={e => { const vid = e.currentTarget.querySelector('video') as HTMLElement; if (vid) vid.style.transform = 'scale(1)' }}
                    style={{
                      width: '100%', aspectRatio: '16/9', overflow: 'hidden', position: 'relative',
                      background: 'oklch(0 0 0 / 0.02)', borderRadius: 12, cursor: 'pointer',
                      animation: `imgIn 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) ${i * 0.08}s both`,
                    }}>
                    <video src={src} autoPlay muted loop playsInline preload="none" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)' }} />
                  </div>
                ))}
                {expandedContent.images?.map((src, i) => (
                  <div key={src}
                    onClick={e => { e.stopPropagation(); setLightboxIndex((expandedContent.videos?.length ?? 0) + i) }}
                    onMouseEnter={e => { const img = e.currentTarget.querySelector('img') as HTMLElement; if (img) img.style.transform = 'scale(1.02)' }}
                    onMouseLeave={e => { const img = e.currentTarget.querySelector('img') as HTMLElement; if (img) img.style.transform = 'scale(1)' }}
                    style={{
                      width: '100%', aspectRatio: '16/9', overflow: 'hidden', position: 'relative',
                      background: 'oklch(0 0 0 / 0.02)', borderRadius: 12, cursor: 'pointer',
                      animation: `imgIn 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) ${(expandedContent.videos?.length ?? 0) * 0.08 + i * 0.05}s both`,
                    }}>
                    <Image src={src} alt="" fill style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)' }} sizes="33vw" />
                  </div>
                ))}
                {expandedContent.lockedFrames && Array.from({ length: expandedContent.lockedFrames }).map((_, i) => (
                  <div key={`locked-${i}`}
                    onMouseEnter={e => { const tip = e.currentTarget.querySelector('.nda-tip') as HTMLElement; if (tip) tip.style.opacity = '1' }}
                    onMouseLeave={e => { const tip = e.currentTarget.querySelector('.nda-tip') as HTMLElement; if (tip) tip.style.opacity = '0' }}
                    style={{
                      width: '100%', aspectRatio: '16/9', borderRadius: 12, background: 'rgba(0,0,0,0.03)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative', cursor: 'default',
                    }}>
                    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" style={{ opacity: 0.1 }}>
                      <rect x={4} y={9} width={12} height={9} rx={2} fill="currentColor" />
                      <path d="M7 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
                    </svg>
                    <div className="nda-tip" style={{
                      position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
                      background: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.4)', borderRadius: 6,
                      padding: '4px 10px', fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap',
                      fontFamily: font, opacity: 0, transition: 'opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)', pointerEvents: 'none',
                    }}>Protected under NDA</div>
                  </div>
                ))}
              </div>
            )}
          </ScrollFadeWrapper>
          </div>
        </>
      )}

      {lightboxIndex !== null && expandedContent && (
        <ImageLightbox
          images={[...(expandedContent.videos ?? []), ...(expandedContent.images ?? [])]}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          altPrefix={displayedExpanded ?? 'Image'}
        />
      )}
    </main>
  )
}
