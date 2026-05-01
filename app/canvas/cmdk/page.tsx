'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const font = 'var(--font-geist-sans), -apple-system, sans-serif'
const mono = 'var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace'

// ─── Types ───────────────────────────────────────────────────────────────────

type Filter = 'all' | 'prompts' | 'brands' | 'models' | 'sources' | 'actions'
type SubItem = { icon: string; label: string; meta?: string; badge?: { text: string; color: string } }
type Item = { icon: string; label: string; meta?: string; badge?: { text: string; color: string }; shortcut?: string; tag?: string; subItems?: SubItem[] }
type Group = { label: string; filter: Filter; items: Item[] }
type Page = { title: string; icon: string; items: SubItem[] }

type StatBar = { label: string; value: string; fill: number; color: string }
type FlowState =
  | { kind: 'idle' }
  | { kind: 'input'; placeholder: string; btn: string; onSubmit: (v: string) => void; suggestions?: { label: string; meta: string }[] }
  | { kind: 'loading'; message: string; progress?: { current: number; total: number } }
  | { kind: 'success'; message: string; detail?: string; action?: { label: string; onClick: () => void }; sparkline?: boolean }
  | { kind: 'confirm'; title: string; message: string; btn: string; onConfirm: () => void }
  | { kind: 'detail'; title: string; stats: StatBar[]; snippet?: string; donut?: { segments: { label: string; value: number; color: string }[] }; sparkline?: boolean; summary?: string }

// ─── Mock Data ───────────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  'Best prediction market platforms for 2026?',
  'How accurate are crypto betting odds vs traditional polls?',
  'Which prediction markets have the lowest fees?',
  'Polymarket vs Kalshi for US election betting',
  'Top platforms for real-time geopolitical forecasting',
]
const BRAND_SUGGESTIONS = [
  { label: 'Augur', meta: 'augur.net' }, { label: 'Metaculus', meta: 'metaculus.com' },
  { label: 'Manifold', meta: 'manifold.markets' }, { label: 'Betfair', meta: 'betfair.com' },
  { label: 'DraftKings', meta: 'draftkings.com' },
]
const SUMMARY_TEXT = `Polymarket AI Visibility Report — April 2026
Visibility: 51% | Share of Voice: 60% | Position: #2.1 | Sentiment: 56/100
Models: ChatGPT (56%), AI Overviews (57%), Perplexity (39%)
Top Source: polymarket.com — 2,358 retrievals, 1,644 citations
Competitors: Kalshi (31%), PredictIt (15%)`
const TREND_POINTS = [38, 42, 40, 44, 43, 47, 45, 48, 46, 49, 47, 51, 48, 50, 52, 49, 51, 53, 50, 52, 54, 51, 53, 50, 52, 51, 49, 51, 50, 51]
const CHAT_PREVIEWS: Record<string, SubItem[]> = {
  ChatGPT: [
    { icon: '/icons/IconBubbleText.svg', label: 'Best prediction market for US elections?', meta: 'Apr 28 · Mentioned Polymarket 3x' },
    { icon: '/icons/IconBubbleText.svg', label: 'Compare crypto betting platforms', meta: 'Apr 27 · Mentioned Polymarket 5x' },
    { icon: '/icons/IconBubbleText.svg', label: 'How do prediction markets work?', meta: 'Apr 26 · Mentioned Polymarket 2x' },
    { icon: '/icons/IconBubbleText.svg', label: 'Top platforms for event contracts', meta: 'Apr 25 · Mentioned Polymarket 4x' },
    { icon: '/icons/IconBubbleText.svg', label: 'Polymarket features and fees', meta: 'Apr 24 · Mentioned Polymarket 7x' },
  ],
  'AI Overviews': [
    { icon: '/icons/IconBubbleText.svg', label: 'What is Polymarket?', meta: 'Apr 28 · Mentioned Polymarket 4x' },
    { icon: '/icons/IconBubbleText.svg', label: 'Prediction market regulation 2026', meta: 'Apr 27 · Mentioned Polymarket 2x' },
    { icon: '/icons/IconBubbleText.svg', label: 'Best crypto prediction platforms', meta: 'Apr 25 · Mentioned Polymarket 3x' },
  ],
  Perplexity: [
    { icon: '/icons/IconBubbleText.svg', label: 'Polymarket vs Kalshi comparison', meta: 'Apr 28 · Mentioned Polymarket 6x' },
    { icon: '/icons/IconBubbleText.svg', label: 'How to bet on elections online', meta: 'Apr 26 · Mentioned Polymarket 2x' },
    { icon: '/icons/IconBubbleText.svg', label: 'Decentralized prediction markets', meta: 'Apr 24 · Mentioned Polymarket 4x' },
  ],
}

// ─── Data ────────────────────────────────────────────────────────────────────

const GROUPS: Group[] = [
  { label: 'Quick Actions', filter: 'actions', items: [
    { icon: '/icons/IconPlusMedium.svg', label: 'New prompt', shortcut: '⌘N', subItems: [
      { icon: '/icons/IconBubbleText.svg', label: 'Blank prompt', meta: 'Start from scratch' },
      { icon: '/icons/IconLightBulb.svg', label: 'Suggested prompts', meta: 'AI-generated for your industry' },
      { icon: '/icons/IconClipboard.svg', label: 'Import from CSV', meta: 'Bulk import prompts' },
    ]},
    { icon: '/icons/IconTeam.svg', label: 'Add competitor', shortcut: '⌘J', subItems: [
      { icon: '/icons/IconMagnifyingGlass.svg', label: 'Search by name', meta: 'Find brands in our database' },
      { icon: '/icons/IconGlobe.svg', label: 'Add by domain', meta: 'Enter a website URL' },
      { icon: '/icons/IconFileArrowRightOut.svg', label: 'Import list', meta: 'CSV with brand names' },
    ]},
    { icon: '/icons/IconChart2.svg', label: 'Run analysis', shortcut: '⌘R', subItems: [
      { icon: '/icons/IconChart2.svg', label: 'Full analysis', meta: 'All 225 prompts across 3 models' },
      { icon: '/icons/IconTarget.svg', label: 'Brand comparison', meta: 'Polymarket vs competitors' },
      { icon: '/icons/IconTrending1.svg', label: 'Trend report', meta: 'Visibility changes over 30 days' },
    ]},
    { icon: '/icons/IconFileArrowRightOut.svg', label: 'Export report', shortcut: '⌘E', subItems: [
      { icon: '/icons/IconFileArrowRightOut.svg', label: 'Export as CSV', meta: 'Raw data for spreadsheets' },
      { icon: '/icons/IconFileEdit.svg', label: 'Export as PDF', meta: 'Formatted report' },
      { icon: '/icons/IconClipboard.svg', label: 'Copy to clipboard', meta: 'Summary for Slack/email' },
    ]},
    { icon: '/icons/IconMagnifyingGlass.svg', label: 'Search all chats', shortcut: '/', subItems: [
      { icon: '/icons/IconOpenai.svg', label: 'ChatGPT chats', meta: '2,671 conversations' },
      { icon: '/icons/IconGoogle.svg', label: 'AI Overview chats', meta: '2,439 conversations' },
      { icon: '/icons/IconPerplexity.svg', label: 'Perplexity chats', meta: '2,645 conversations' },
    ]},
  ]},
  { label: 'Tracked Prompts', filter: 'prompts', items: [
    { icon: '/icons/IconBubbleText.svg', label: 'Top decentralized sports betting sites?', meta: '3 models · low volume', badge: { text: '51%', color: 'oklch(0.7 0.16 70)' }, tag: 'Sports', subItems: [
      { icon: '/icons/IconOpenai.svg', label: 'ChatGPT', meta: 'Position #2 · 3 mentions', badge: { text: '58%', color: 'oklch(0.55 0.18 145)' } },
      { icon: '/icons/IconGoogle.svg', label: 'AI Overviews', meta: 'Position #1 · 5 mentions', badge: { text: '72%', color: 'oklch(0.55 0.18 145)' } },
      { icon: '/icons/IconPerplexity.svg', label: 'Perplexity', meta: 'Position #3 · 2 mentions', badge: { text: '31%', color: 'oklch(0.6 0.2 25)' } },
    ]},
    { icon: '/icons/IconBubbleText.svg', label: 'Polymarket features for crypto traders?', meta: '3 models · low volume', badge: { text: '56%', color: 'oklch(0.55 0.18 145)' }, tag: 'Product', subItems: [
      { icon: '/icons/IconOpenai.svg', label: 'ChatGPT', meta: 'Position #1 · 6 mentions', badge: { text: '67%', color: 'oklch(0.55 0.18 145)' } },
      { icon: '/icons/IconGoogle.svg', label: 'AI Overviews', meta: 'Position #2 · 4 mentions', badge: { text: '55%', color: 'oklch(0.55 0.18 145)' } },
      { icon: '/icons/IconPerplexity.svg', label: 'Perplexity', meta: 'Position #2 · 3 mentions', badge: { text: '44%', color: 'oklch(0.7 0.16 70)' } },
    ]},
    { icon: '/icons/IconBubbleText.svg', label: 'Best platforms to track election sentiment?', meta: '3 models · low volume', badge: { text: '57%', color: 'oklch(0.55 0.18 145)' }, tag: 'Politics', subItems: [
      { icon: '/icons/IconOpenai.svg', label: 'ChatGPT', meta: 'Position #1 · 4 mentions', badge: { text: '62%', color: 'oklch(0.55 0.18 145)' } },
      { icon: '/icons/IconGoogle.svg', label: 'AI Overviews', meta: 'Position #2 · 3 mentions', badge: { text: '55%', color: 'oklch(0.55 0.18 145)' } },
      { icon: '/icons/IconPerplexity.svg', label: 'Perplexity', meta: 'Position #2 · 2 mentions', badge: { text: '41%', color: 'oklch(0.7 0.16 70)' } },
    ]},
    { icon: '/icons/IconBubbleText.svg', label: 'Polymarket vs Kalshi for sports wagering?', meta: '3 models · low volume', badge: { text: '44%', color: 'oklch(0.7 0.16 70)' }, tag: 'Comparison', subItems: [
      { icon: '/icons/IconOpenai.svg', label: 'ChatGPT', meta: 'Position #1 · 5 mentions', badge: { text: '52%', color: 'oklch(0.55 0.18 145)' } },
      { icon: '/icons/IconGoogle.svg', label: 'AI Overviews', meta: 'Position #2 · 2 mentions', badge: { text: '40%', color: 'oklch(0.7 0.16 70)' } },
      { icon: '/icons/IconPerplexity.svg', label: 'Perplexity', meta: 'Position #3 · 1 mention', badge: { text: '28%', color: 'oklch(0.6 0.2 25)' } },
    ]},
  ]},
  { label: 'Brands', filter: 'brands', items: [
    { icon: '/icons/IconTarget2.svg', label: 'Polymarket', meta: 'Your brand · polymarket.com', badge: { text: '51%', color: 'oklch(0.55 0.18 145)' }, tag: 'Own', subItems: [
      { icon: '/icons/IconChart2.svg', label: 'Visibility: 51%', meta: '3,937 mentions in 7,755 chats' },
      { icon: '/icons/IconTrending1.svg', label: 'Share of voice: 60%', meta: 'Highest among tracked brands' },
      { icon: '/icons/IconTarget.svg', label: 'Avg. position: #2.1', meta: 'When mentioned in AI answers' },
      { icon: '/icons/IconBubbleText.svg', label: 'Sentiment: 56/100', meta: 'Neutral-positive across models' },
    ]},
    { icon: '/icons/IconTarget.svg', label: 'Kalshi', meta: 'Competitor · kalshi.com', badge: { text: '31%', color: 'oklch(0.6 0.2 25)' }, subItems: [
      { icon: '/icons/IconChart2.svg', label: 'Visibility: 31%', meta: '2,373 mentions in 7,742 chats' },
      { icon: '/icons/IconTrending1.svg', label: 'Share of voice: 28%', meta: '2nd among tracked brands' },
      { icon: '/icons/IconTarget.svg', label: 'Avg. position: #2.6', meta: 'When mentioned' },
      { icon: '/icons/IconBubbleText.svg', label: 'Sentiment: 58/100', meta: 'Slightly higher than Polymarket' },
    ]},
    { icon: '/icons/IconTarget.svg', label: 'PredictIt', meta: 'Competitor · predictit.org', badge: { text: '15%', color: 'oklch(0.6 0.2 25)' }, subItems: [
      { icon: '/icons/IconChart2.svg', label: 'Visibility: 15%', meta: '1,199 mentions in 7,742 chats' },
      { icon: '/icons/IconTrending1.svg', label: 'Share of voice: 12%', meta: 'Lowest among tracked' },
      { icon: '/icons/IconTarget.svg', label: 'Avg. position: #3.1', meta: 'Usually mentioned last' },
    ]},
  ]},
  { label: 'AI Models', filter: 'models', items: [
    { icon: '/icons/IconOpenai.svg', label: 'ChatGPT', meta: '2,671 chats · 56% visibility', badge: { text: '56%', color: 'oklch(0.55 0.18 145)' }, subItems: [
      { icon: '/icons/IconTarget2.svg', label: 'Polymarket visibility', meta: '56% · Position #2.4', badge: { text: '56%', color: 'oklch(0.55 0.18 145)' } },
      { icon: '/icons/IconTarget.svg', label: 'Kalshi visibility', meta: '34% · Position #2.8', badge: { text: '34%', color: 'oklch(0.6 0.2 25)' } },
      { icon: '/icons/IconTarget.svg', label: 'PredictIt visibility', meta: '18% · Position #3.2', badge: { text: '18%', color: 'oklch(0.6 0.2 25)' } },
    ]},
    { icon: '/icons/IconGoogle.svg', label: 'AI Overviews', meta: '2,439 chats · 57% visibility', badge: { text: '57%', color: 'oklch(0.55 0.18 145)' }, subItems: [
      { icon: '/icons/IconTarget2.svg', label: 'Polymarket visibility', meta: '57% · Position #2.0', badge: { text: '57%', color: 'oklch(0.55 0.18 145)' } },
      { icon: '/icons/IconTarget.svg', label: 'Kalshi visibility', meta: '29% · Position #2.5', badge: { text: '29%', color: 'oklch(0.6 0.2 25)' } },
    ]},
    { icon: '/icons/IconPerplexity.svg', label: 'Perplexity', meta: '2,645 chats · 39% visibility', badge: { text: '39%', color: 'oklch(0.6 0.2 25)' }, subItems: [
      { icon: '/icons/IconTarget2.svg', label: 'Polymarket visibility', meta: '39% · Position #1.7', badge: { text: '39%', color: 'oklch(0.6 0.2 25)' } },
      { icon: '/icons/IconTarget.svg', label: 'Kalshi visibility', meta: '28% · Position #2.4', badge: { text: '28%', color: 'oklch(0.6 0.2 25)' } },
    ]},
  ]},
  { label: 'Top Sources', filter: 'sources', items: [
    { icon: '/icons/IconGlobe.svg', label: 'polymarket.com', meta: '2,358 retrievals · 1,644 citations', badge: { text: '#1', color: 'oklch(0.55 0.18 145)' }, tag: 'Own', subItems: [
      { icon: '/icons/IconFileEdit.svg', label: '/markets', meta: '412 citations · CATEGORY_PAGE' },
      { icon: '/icons/IconFileEdit.svg', label: '/about', meta: '187 citations · HOMEPAGE' },
      { icon: '/icons/IconFileEdit.svg', label: '/election-predictions', meta: '156 citations · CATEGORY_PAGE' },
    ]},
    { icon: '/icons/IconGlobe.svg', label: 'youtube.com', meta: '2,533 retrievals · 729 citations', badge: { text: '#2', color: 'oklch(0.55 0.2 260)' }, tag: 'UGC', subItems: [
      { icon: '/icons/IconFileEdit.svg', label: 'Polymarket explained (video)', meta: '89 citations' },
      { icon: '/icons/IconFileEdit.svg', label: 'Prediction markets 2026', meta: '54 citations' },
    ]},
    { icon: '/icons/IconGlobe.svg', label: 'reddit.com', meta: '1,789 retrievals · 1,150 citations', badge: { text: '#3', color: 'oklch(0.55 0.2 260)' }, tag: 'UGC', subItems: [
      { icon: '/icons/IconFileEdit.svg', label: 'r/polymarket', meta: '412 citations' },
      { icon: '/icons/IconFileEdit.svg', label: 'r/CryptoCurrency', meta: '287 citations' },
    ]},
    { icon: '/icons/IconGlobe.svg', label: 'medium.com', meta: '1,700 retrievals · 609 citations', tag: 'UGC', subItems: [
      { icon: '/icons/IconFileEdit.svg', label: 'Guide to prediction markets', meta: '78 citations' },
    ]},
    { icon: '/icons/IconGlobe.svg', label: 'chain.link', meta: '1,081 retrievals · 777 citations', tag: 'Corporate', subItems: [
      { icon: '/icons/IconFileEdit.svg', label: '/data-feeds', meta: '312 citations · PRODUCT_PAGE' },
    ]},
  ]},
]

// ─── Flow Components ─────────────────────────────────────────────────────────

function MiniBar({ label, value, fill, color }: StatBar) {
  return (
    <div style={{ padding: '8px 0', animation: 'flowIn 0.25s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: font, fontSize: 13, fontWeight: 500, color: 'oklch(0.2 0.02 60)' }}>{label}</span>
        <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 600, color }}>{value}</span>
      </div>
      <div style={{ height: 4, borderRadius: 99, background: 'oklch(0 0 0 / 0.04)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 99, background: color, width: `${fill * 100}%`, animation: 'barGrow 0.6s cubic-bezier(0.25,0.1,0.25,1) forwards', transformOrigin: 'left' }} />
      </div>
    </div>
  )
}

function Sparkline({ points, color = 'oklch(0.55 0.18 145)', w = 200, h = 32 }: { points: number[]; color?: string; w?: number; h?: number }) {
  const min = Math.min(...points), max = Math.max(...points), range = max - min || 1
  const d = points.map((p, i) => `${(i / (points.length - 1)) * w},${h - ((p - min) / range) * h}`).join(' L')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" style={{ display: 'block' }}>
      <path d={`M${d}`} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MiniDonut({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  let acc = 0
  const stops = segments.map(seg => { const start = acc; acc += (seg.value / total) * 360; return `${seg.color} ${start}deg ${acc}deg` }).join(', ')
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, animation: 'flowIn 0.3s ease' }}>
      <div style={{ width: 48, height: 48, borderRadius: 99, background: `conic-gradient(${stops})`, flexShrink: 0, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 12, borderRadius: 99, background: 'oklch(0.995 0 0)' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {segments.map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: 99, background: s.color, flexShrink: 0 }} />
            <span style={{ fontFamily: font, fontSize: 12, fontWeight: 500, color: 'oklch(0.25 0.01 60)' }}>{s.label}</span>
            <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 600, color: 'oklch(0 0 0 / 0.35)' }}>{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FlowView({ flow, onBack, flowInput, setFlowInput, showToast }: {
  flow: FlowState; onBack: () => void; flowInput: string; setFlowInput: (v: string) => void; showToast: (m: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (flow.kind === 'input') requestAnimationFrame(() => inputRef.current?.focus())
  }, [flow.kind])

  if (flow.kind === 'input') {
    const isTextarea = flow.placeholder.includes('CSV') || flow.placeholder.includes('Paste')
    return (
      <div style={{ padding: '16px 12px', animation: 'flowIn 0.2s ease' }}>
        {isTextarea ? (
          <textarea
            ref={textareaRef}
            value={flowInput}
            onChange={e => setFlowInput(e.target.value)}
            placeholder={flow.placeholder}
            onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); onBack() } }}
            style={{ width: '100%', height: 100, resize: 'none', border: '1.5px dashed oklch(0 0 0 / 0.12)', borderRadius: 10, padding: 12, fontFamily: font, fontSize: 13, fontWeight: 400, color: 'oklch(0.2 0.02 60)', background: 'oklch(0 0 0 / 0.015)', outline: 'none' }}
          />
        ) : (
          <input
            ref={inputRef}
            value={flowInput}
            onChange={e => setFlowInput(e.target.value)}
            placeholder={flow.placeholder}
            onKeyDown={e => { if (e.key === 'Enter' && flowInput.trim()) { e.stopPropagation(); flow.onSubmit(flowInput) } if (e.key === 'Escape') { e.stopPropagation(); onBack() } }}
            style={{ width: '100%', height: 40, border: '1px solid oklch(0 0 0 / 0.08)', borderRadius: 10, padding: '0 12px', fontFamily: font, fontSize: 14, fontWeight: 400, color: 'oklch(0.2 0.02 60)', background: 'oklch(0 0 0 / 0.015)', outline: 'none' }}
          />
        )}
        {flow.suggestions && flowInput && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {flow.suggestions.filter(s => s.label.toLowerCase().includes(flowInput.toLowerCase())).map(s => (
              <div key={s.label} onClick={() => flow.onSubmit(s.label)} style={{ padding: '8px 10px', borderRadius: 8, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', transition: 'background 100ms ease' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0 0 0 / 0.03)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <span style={{ fontFamily: font, fontSize: 13, fontWeight: 500, color: 'oklch(0.2 0.02 60)' }}>{s.label}</span>
                <span style={{ fontFamily: font, fontSize: 12, color: 'oklch(0 0 0 / 0.3)' }}>{s.meta}</span>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => flowInput.trim() && flow.onSubmit(flowInput)} style={{
          marginTop: 10, height: 32, paddingLeft: 12, paddingRight: 12, borderRadius: 8, border: 'none', cursor: 'pointer',
          background: flowInput.trim() ? 'oklch(0.15 0 0)' : 'oklch(0 0 0 / 0.06)',
          color: flowInput.trim() ? '#fff' : 'oklch(0 0 0 / 0.3)',
          fontFamily: font, fontSize: 13, fontWeight: 500, transition: 'all 0.15s ease',
        }}>{flow.btn}</button>
      </div>
    )
  }

  if (flow.kind === 'loading') {
    return (
      <div style={{ padding: '48px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, animation: 'flowIn 0.2s ease' }}>
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
          <circle cx="12" cy="12" r="10" stroke="oklch(0 0 0 / 0.08)" strokeWidth="2.5" />
          <path d="M22 12a10 10 0 00-10-10" stroke="oklch(0.4 0 0)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <span style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: 'oklch(0.2 0.02 60)' }}>{flow.message}</span>
        {flow.progress && (
          <div style={{ width: 200, height: 4, borderRadius: 99, background: 'oklch(0 0 0 / 0.04)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, background: 'oklch(0.55 0.18 145)', width: `${(flow.progress.current / flow.progress.total) * 100}%`, transition: 'width 0.3s ease' }} />
          </div>
        )}
      </div>
    )
  }

  if (flow.kind === 'success') {
    return (
      <div style={{ padding: '40px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, animation: 'flowIn 0.2s ease' }}>
        <div style={{ width: 36, height: 36, borderRadius: 99, background: 'oklch(0.55 0.18 145 / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'checkIn 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <svg width={18} height={18} viewBox="0 0 18 18" fill="none"><path d="M4 9.5L7.5 13L14 5" stroke="oklch(0.55 0.18 145)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <span style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: 'oklch(0.15 0.02 60)', textAlign: 'center' }}>{flow.message}</span>
        {flow.detail && <span style={{ fontFamily: mono, fontSize: 12, color: 'oklch(0 0 0 / 0.35)' }}>{flow.detail}</span>}
        {flow.sparkline && <Sparkline points={TREND_POINTS} />}
        {flow.action && (
          <button onClick={flow.action.onClick} style={{ marginTop: 4, height: 28, paddingLeft: 10, paddingRight: 10, borderRadius: 6, border: '1px solid oklch(0 0 0 / 0.08)', background: '#fff', fontFamily: font, fontSize: 12, fontWeight: 500, color: 'oklch(0.2 0.02 60)', cursor: 'pointer', transition: 'background 0.15s ease' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0 0 0 / 0.03)')} onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
          >{flow.action.label}</button>
        )}
      </div>
    )
  }

  if (flow.kind === 'confirm') {
    return (
      <div style={{ padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, animation: 'flowIn 0.2s ease' }}>
        <span style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: 'oklch(0.15 0.02 60)' }}>{flow.title}</span>
        <span style={{ fontFamily: font, fontSize: 13, fontWeight: 400, color: 'oklch(0 0 0 / 0.4)', textAlign: 'center', maxWidth: 360 }}>{flow.message}</span>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button onClick={onBack} style={{ height: 32, paddingLeft: 12, paddingRight: 12, borderRadius: 8, border: '1px solid oklch(0 0 0 / 0.08)', background: '#fff', fontFamily: font, fontSize: 13, fontWeight: 500, color: 'oklch(0 0 0 / 0.5)', cursor: 'pointer' }}>Cancel</button>
          <button onClick={flow.onConfirm} style={{ height: 32, paddingLeft: 12, paddingRight: 12, borderRadius: 8, border: 'none', background: 'oklch(0.15 0 0)', fontFamily: font, fontSize: 13, fontWeight: 500, color: '#fff', cursor: 'pointer' }}>{flow.btn}</button>
        </div>
      </div>
    )
  }

  if (flow.kind === 'detail') {
    return (
      <div style={{ padding: '12px 12px', animation: 'flowIn 0.2s ease' }}>
        <div style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: 'oklch(0 0 0 / 0.3)', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: 4 }}>{flow.title}</div>
        {flow.stats.map(s => <MiniBar key={s.label} {...s} />)}
        {flow.donut && <div style={{ padding: '12px 0' }}><MiniDonut segments={flow.donut.segments} /></div>}
        {flow.sparkline && <div style={{ padding: '8px 0' }}><div style={{ fontFamily: font, fontSize: 11, fontWeight: 500, color: 'oklch(0 0 0 / 0.3)', marginBottom: 6 }}>30-day trend</div><Sparkline points={TREND_POINTS} /></div>}
        {flow.summary && <div style={{ padding: '8px 0', fontFamily: font, fontSize: 12, fontWeight: 500, color: 'oklch(0.55 0.18 145)' }}>{flow.summary}</div>}
        {flow.snippet && (
          <div style={{ marginTop: 8, padding: 10, borderRadius: 8, background: 'oklch(0 0 0 / 0.02)', border: '1px solid oklch(0 0 0 / 0.04)' }}>
            <div style={{ fontFamily: font, fontSize: 11, fontWeight: 500, color: 'oklch(0 0 0 / 0.3)', marginBottom: 4 }}>Latest AI response</div>
            <p style={{ fontFamily: font, fontSize: 12.5, fontWeight: 400, color: 'oklch(0.25 0.01 60)', lineHeight: '18px', margin: 0 }}>{flow.snippet}</p>
          </div>
        )}
      </div>
    )
  }

  return null
}

// ─── Preview Panel ───────────────────────────────────────────────────────────

// Preview content per item type
const PREVIEW_CONTENT: Record<string, { title: string; breadcrumb?: string; body: string; items?: { icon: string; text: string }[] }> = {
  // Actions
  'New prompt': { title: 'New Prompt', breadcrumb: 'Quick Actions', body: 'Create a new search prompt to track how AI models respond to questions about your industry. Prompts are executed daily across all selected models.', items: [
    { icon: '/icons/IconBubbleText.svg', text: 'Write a natural question your customers would ask AI' },
    { icon: '/icons/IconChart2.svg', text: 'Track visibility, position, and sentiment automatically' },
    { icon: '/icons/IconTarget.svg', text: 'Compare your brand against competitors per prompt' },
  ]},
  'Add competitor': { title: 'Add Competitor', breadcrumb: 'Quick Actions', body: 'Track how competing brands appear in AI search results alongside yours. Monitor their visibility, position, and share of voice.', items: [
    { icon: '/icons/IconTrending1.svg', text: 'See how competitors rank vs. your brand' },
    { icon: '/icons/IconChart2.svg', text: 'Track share of voice changes over time' },
  ]},
  'Run analysis': { title: 'Run Analysis', breadcrumb: 'Quick Actions', body: 'Execute all tracked prompts across selected AI models. Each run generates fresh visibility, sentiment, and position data.', items: [
    { icon: '/icons/IconOpenai.svg', text: '225 prompts queued across ChatGPT, AI Overviews, Perplexity' },
    { icon: '/icons/IconZap.svg', text: 'Estimated time: ~4 minutes' },
  ]},
  'Export report': { title: 'Export Report', breadcrumb: 'Quick Actions', body: 'Download your visibility data as CSV, PDF, or copy a summary for sharing with your team.' },
  'Search all chats': { title: 'Search Chats', breadcrumb: 'Quick Actions', body: 'Browse through 7,755 AI conversations where your prompts were executed. See exactly how each model responded.' },
}

const PROMPT_RESPONSES: Record<string, string> = {
  'Top decentralized sports betting sites?': '"When it comes to decentralized sports betting, Polymarket stands out as the leading platform. Built on the Polygon blockchain, it offers transparent settlement and deep liquidity for event-based contracts. Kalshi also provides regulated event contracts but is centralized..."',
  'Polymarket features for crypto traders?': '"Polymarket offers several features tailored to crypto traders: on-chain settlement via Polygon, no KYC for basic trading, deep order books with USDC, and an API for programmatic trading. The platform has become the go-to for prediction markets..."',
  'Best platforms to track election sentiment?': '"For tracking election sentiment in real-time, Polymarket has become the gold standard. Its prediction markets aggregate crowd wisdom with real money at stake, making them more accurate than traditional polls. The platform saw $3.2B in volume during the 2024 election cycle..."',
  'Polymarket vs Kalshi for sports wagering?': '"Polymarket and Kalshi take different approaches: Polymarket is decentralized, built on blockchain, and has no trading fees. Kalshi is CFTC-regulated, operates as a traditional exchange, but has a narrower market selection. For sports, Polymarket offers more markets..."',
}

const BRAND_PREVIEWS: Record<string, { trend: string; topPrompt: string; change: string }> = {
  'Polymarket': { trend: 'Visibility trending up +3.2% over 30 days', topPrompt: '"Best prediction market platforms?" — mentioned in 89% of responses', change: 'Gained #1 position on Perplexity this week' },
  'Kalshi': { trend: 'Visibility flat over 30 days', topPrompt: '"Regulated event contracts" — mentioned in 67% of responses', change: 'Lost position to Polymarket on ChatGPT' },
  'PredictIt': { trend: 'Visibility declining -2.1% over 30 days', topPrompt: '"Election prediction platforms" — mentioned in 34% of responses', change: 'Dropping on AI Overviews since March' },
}

const SOURCE_PREVIEWS: Record<string, { title: string; snippet: string }> = {
  'polymarket.com': { title: 'Polymarket — Trade on the world\'s most pressing topics', snippet: 'Polymarket is the world\'s largest prediction market. Trade on elections, sports, crypto, and more with transparent on-chain settlement.' },
  'youtube.com': { title: 'YouTube — Polymarket content', snippet: 'Multiple creators have covered Polymarket, including tutorials on trading, election predictions analysis, and platform reviews.' },
  'reddit.com': { title: 'r/polymarket — 48.2k members', snippet: 'Active community discussing markets, strategies, and platform updates. Top posts often reach r/all during major events.' },
  'medium.com': { title: 'Prediction market analysis articles', snippet: 'Long-form content comparing prediction markets, explaining how they work, and analyzing their accuracy vs traditional methods.' },
  'chain.link': { title: 'Chainlink — Decentralized Oracle Network', snippet: 'Chainlink provides the data feeds that power Polymarket\'s market resolution, ensuring transparent and tamper-proof outcomes.' },
}

function PreviewPanel({ item, currentPage, flow }: { item: Item | SubItem | null; currentPage: Page | null; flow: FlowState }) {
  if (flow.kind === 'loading') return (
    <div className="cmdk-preview" style={{ ...previewBase, alignItems: 'center', justifyContent: 'center' }}>
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
        <circle cx="12" cy="12" r="10" stroke="oklch(0 0 0 / 0.06)" strokeWidth="2.5" />
        <path d="M22 12a10 10 0 00-10-10" stroke="oklch(0 0 0 / 0.2)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  )
  if (flow.kind === 'success') return (
    <div className="cmdk-preview" style={{ ...previewBase, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <div style={{ width: 40, height: 40, borderRadius: 99, background: 'oklch(0.55 0.18 145 / 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'checkIn 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <svg width={20} height={20} viewBox="0 0 18 18" fill="none"><path d="M4 9.5L7.5 13L14 5" stroke="oklch(0.55 0.18 145)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <span style={{ fontFamily: font, fontSize: 13, fontWeight: 500, color: 'oklch(0.55 0.18 145)' }}>Complete</span>
    </div>
  )
  if (flow.kind !== 'idle') return <div className="cmdk-preview" style={previewBase} />

  if (!item) return (
    <div className="cmdk-preview" style={{ ...previewBase, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.5 }}>
        <img src="/icons/IconMagnifyingGlass.svg" width={20} height={20} alt="" style={{ opacity: 0.2 }} />
        <span style={{ fontFamily: font, fontSize: 12, fontWeight: 400, color: 'oklch(0 0 0 / 0.25)' }}>Hover to preview</span>
      </div>
    </div>
  )

  const badge = item.badge
  const label = item.label

  // Action preview
  const actionPreview = PREVIEW_CONTENT[label]
  if (actionPreview && !currentPage) return (
    <div key={label} className="cmdk-preview" style={{ ...previewBase, animation: 'flowIn 0.15s ease' }}>
      {actionPreview.breadcrumb && <div style={{ fontFamily: font, fontSize: 11, fontWeight: 500, color: 'oklch(0 0 0 / 0.25)', marginBottom: 4 }}>{actionPreview.breadcrumb}</div>}
      <div style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: 'oklch(0.15 0.02 60)', letterSpacing: '-0.02em', marginBottom: 10 }}>{actionPreview.title}</div>
      <p style={{ fontFamily: font, fontSize: 13, fontWeight: 400, color: 'oklch(0 0 0 / 0.45)', lineHeight: '20px', margin: '0 0 16px' }}>{actionPreview.body}</p>
      {actionPreview.items && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {actionPreview.items.map(ai => (
            <div key={ai.text} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <img src={ai.icon} width={14} height={14} alt="" style={{ opacity: 0.35, marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontFamily: font, fontSize: 12.5, fontWeight: 400, color: 'oklch(0 0 0 / 0.5)', lineHeight: '17px' }}>{ai.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // Prompt preview — show AI response
  if (item.icon === '/icons/IconBubbleText.svg' && !currentPage) {
    const response = Object.entries(PROMPT_RESPONSES).find(([k]) => label.includes(k.slice(0, 20)))?.[1] ?? '"Polymarket is frequently mentioned as a top prediction market platform across AI search results, with strong visibility in the crypto and forecasting categories."'
    return (
      <div key={label} className="cmdk-preview" style={{ ...previewBase, animation: 'flowIn 0.15s ease' }}>
        <div style={{ fontFamily: font, fontSize: 11, fontWeight: 500, color: 'oklch(0 0 0 / 0.25)', marginBottom: 4 }}>AI Response Preview</div>
        <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: 'oklch(0.15 0.02 60)', letterSpacing: '-0.01em', lineHeight: '20px', marginBottom: 12 }}>{label}</div>
        <div style={{ padding: 14, borderRadius: 10, background: 'oklch(0 0 0 / 0.02)', border: '1px solid oklch(0 0 0 / 0.04)', marginBottom: 16 }}>
          <p style={{ fontFamily: font, fontSize: 13, fontWeight: 400, color: 'oklch(0.2 0.02 60)', lineHeight: '20px', margin: 0, fontStyle: 'italic' }}>{response}</p>
        </div>
        {badge && (
          <>
            <div style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: 'oklch(0 0 0 / 0.25)', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: 8 }}>Visibility by model</div>
            <MiniBar label="ChatGPT" value={`${parseInt(badge.text) + 5}%`} fill={(parseInt(badge.text) + 5) / 100} color="oklch(0.55 0.18 145)" />
            <MiniBar label="AI Overviews" value={`${parseInt(badge.text) + 1}%`} fill={(parseInt(badge.text) + 1) / 100} color="oklch(0.55 0.2 260)" />
            <MiniBar label="Perplexity" value={`${Math.max(0, parseInt(badge.text) - 12)}%`} fill={Math.max(0, parseInt(badge.text) - 12) / 100} color="oklch(0.7 0.16 70)" />
          </>
        )}
      </div>
    )
  }

  // Brand preview
  const brandPreview = BRAND_PREVIEWS[label]
  if (brandPreview) return (
    <div key={label} className="cmdk-preview" style={{ ...previewBase, animation: 'flowIn 0.15s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'oklch(0 0 0 / 0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={item.icon} width={22} height={22} alt="" style={{ opacity: 0.5 }} />
        </div>
        <div>
          <div style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: 'oklch(0.15 0.02 60)', letterSpacing: '-0.02em' }}>{label}</div>
          {item.meta && <div style={{ fontFamily: font, fontSize: 12, color: 'oklch(0 0 0 / 0.35)' }}>{item.meta}</div>}
        </div>
        {badge && <div style={{ marginLeft: 'auto', fontFamily: mono, fontSize: 18, fontWeight: 700, color: badge.color }}>{badge.text}</div>}
      </div>
      <div style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: 'oklch(0 0 0 / 0.25)', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: 8 }}>30-day trend</div>
      <Sparkline points={TREND_POINTS} w={460} h={40} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
        {[brandPreview.trend, brandPreview.topPrompt, brandPreview.change].map((text, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ width: 4, height: 4, borderRadius: 99, background: i === 0 ? 'oklch(0.55 0.18 145)' : 'oklch(0 0 0 / 0.15)', flexShrink: 0, marginTop: 6 }} />
            <span style={{ fontFamily: font, fontSize: 12.5, fontWeight: 400, color: 'oklch(0 0 0 / 0.45)', lineHeight: '17px' }}>{text}</span>
          </div>
        ))}
      </div>
      {label === 'Polymarket' && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: 'oklch(0 0 0 / 0.25)', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: 8 }}>Share of voice</div>
          <MiniDonut segments={[{ label: 'Polymarket', value: 60, color: 'oklch(0.55 0.18 145)' }, { label: 'Kalshi', value: 28, color: 'oklch(0.55 0.2 260)' }, { label: 'PredictIt', value: 12, color: 'oklch(0.7 0.16 70)' }]} />
        </div>
      )}
    </div>
  )

  // Model preview
  if ((item.icon === '/icons/IconOpenai.svg' || item.icon === '/icons/IconGoogle.svg' || item.icon === '/icons/IconPerplexity.svg') && badge && !currentPage) {
    const chats = CHAT_PREVIEWS[label] ?? CHAT_PREVIEWS.ChatGPT
    return (
      <div key={label} className="cmdk-preview" style={{ ...previewBase, animation: 'flowIn 0.15s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <img src={item.icon} width={24} height={24} alt="" style={{ opacity: 0.6 }} />
          <div>
            <div style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: 'oklch(0.15 0.02 60)', letterSpacing: '-0.02em' }}>{label}</div>
            <div style={{ fontFamily: font, fontSize: 12, color: 'oklch(0 0 0 / 0.35)' }}>{item.meta}</div>
          </div>
        </div>
        <div style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: 'oklch(0 0 0 / 0.25)', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: 8 }}>Brand visibility</div>
        <MiniBar label="Polymarket" value={badge.text} fill={parseInt(badge.text) / 100} color="oklch(0.55 0.18 145)" />
        <MiniBar label="Kalshi" value={`${Math.max(0, parseInt(badge.text) - 22)}%`} fill={Math.max(0, parseInt(badge.text) - 22) / 100} color="oklch(0.6 0.2 25)" />
        <MiniBar label="PredictIt" value={`${Math.max(0, parseInt(badge.text) - 38)}%`} fill={Math.max(0, parseInt(badge.text) - 38) / 100} color="oklch(0.6 0.2 25)" />
        <div style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: 'oklch(0 0 0 / 0.25)', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginTop: 16, marginBottom: 8 }}>Recent chats</div>
        {chats.slice(0, 3).map(c => (
          <div key={c.label} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '6px 0' }}>
            <img src="/icons/IconBubbleText.svg" width={13} height={13} alt="" style={{ opacity: 0.3, marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: font, fontSize: 12, fontWeight: 500, color: 'oklch(0.25 0.01 60)', lineHeight: '16px' }}>{c.label}</div>
              <div style={{ fontFamily: font, fontSize: 11, color: 'oklch(0 0 0 / 0.3)' }}>{c.meta}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Source preview
  const sourcePreview = SOURCE_PREVIEWS[label]
  if (sourcePreview) return (
    <div key={label} className="cmdk-preview" style={{ ...previewBase, animation: 'flowIn 0.15s ease' }}>
      <div style={{ fontFamily: font, fontSize: 11, fontWeight: 500, color: 'oklch(0 0 0 / 0.25)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: 'oklch(0.15 0.02 60)', letterSpacing: '-0.01em', lineHeight: '20px', marginBottom: 10 }}>{sourcePreview.title}</div>
      <p style={{ fontFamily: font, fontSize: 13, fontWeight: 400, color: 'oklch(0 0 0 / 0.45)', lineHeight: '20px', margin: '0 0 16px' }}>{sourcePreview.snippet}</p>
      <div style={{ fontFamily: font, fontSize: 11, fontWeight: 600, color: 'oklch(0 0 0 / 0.25)', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: 8 }}>30-day citations</div>
      <Sparkline points={TREND_POINTS} color={badge?.color ?? 'oklch(0.55 0.18 145)'} w={460} h={36} />
      {badge && <div style={{ fontFamily: font, fontSize: 12, fontWeight: 500, color: badge.color, marginTop: 8 }}>{badge.text} most cited source</div>}
    </div>
  )

  // Fallback — generic
  return (
    <div key={label} className="cmdk-preview" style={{ ...previewBase, animation: 'flowIn 0.15s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'oklch(0 0 0 / 0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={item.icon} width={18} height={18} alt="" style={{ opacity: 0.45 }} />
        </div>
        <div>
          <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: 'oklch(0.15 0.02 60)', letterSpacing: '-0.01em' }}>{label}</div>
          {item.meta && <div style={{ fontFamily: font, fontSize: 12, color: 'oklch(0 0 0 / 0.35)' }}>{item.meta}</div>}
        </div>
      </div>
      {badge && (
        <div style={{ fontFamily: mono, fontSize: 24, fontWeight: 700, color: badge.color, margin: '8px 0' }}>{badge.text}</div>
      )}
    </div>
  )
}

const previewBase: React.CSSProperties = {
  flex: 1, padding: 20, display: 'flex', flexDirection: 'column',
  borderLeft: '1px solid oklch(0 0 0 / 0.04)', overflowY: 'auto', minHeight: 0,
  scrollBehavior: 'smooth',
}

// ─── CmdRow ──────────────────────────────────────────────────────────────────

function CmdRow({ item, active, onClick, onHover, hasArrow }: {
  item: SubItem & { tag?: string; shortcut?: string }; active: boolean; onClick: () => void; onHover: () => void; hasArrow?: boolean
}) {
  return (
    <div className="cmdk-item" onClick={onClick} onMouseEnter={onHover} style={{
      minHeight: 40, paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 6,
      borderRadius: 10, cursor: 'default', display: 'flex', alignItems: 'center', gap: 10,
      background: active ? 'oklch(0 0 0 / 0.035)' : 'transparent',
    }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: active ? 'oklch(0 0 0 / 0.05)' : 'oklch(0 0 0 / 0.025)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 120ms ease' }}>
        <img src={item.icon} width={15} height={15} alt="" style={{ opacity: active ? 0.55 : 0.35, transition: 'opacity 120ms ease' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ fontFamily: font, fontSize: 13.5, fontWeight: 500, color: active ? 'oklch(0.15 0.02 60)' : 'oklch(0.25 0.01 60)', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'color 120ms ease' }}>{item.label}</span>
        {item.meta && <span style={{ fontFamily: font, fontSize: 11.5, fontWeight: 400, color: 'oklch(0 0 0 / 0.3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.meta}</span>}
      </div>
      {'tag' in item && (item as any).tag && <span style={{ fontFamily: font, fontSize: 10.5, fontWeight: 500, color: (item as any).tag === 'Own' ? 'oklch(0.5 0.15 145)' : 'oklch(0 0 0 / 0.25)', background: (item as any).tag === 'Own' ? 'oklch(0.5 0.15 145 / 0.07)' : 'oklch(0 0 0 / 0.03)', padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>{(item as any).tag}</span>}
      {item.badge && <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 600, color: item.badge.color, background: item.badge.color.replace(')', ' / 0.08)'), padding: '2px 7px', borderRadius: 6, letterSpacing: '-0.02em', flexShrink: 0 }}>{item.badge.text}</div>}
      {'shortcut' in item && (item as any).shortcut && <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>{((item as any).shortcut as string).split('').filter((c: string) => c !== ' ').map((key: string, ki: number) => <kbd key={ki} style={{ fontFamily: mono, fontSize: 10, fontWeight: 500, padding: '2px 5px', borderRadius: 4, background: 'oklch(0 0 0 / 0.025)', border: '1px solid oklch(0 0 0 / 0.05)', color: 'oklch(0 0 0 / 0.28)', lineHeight: '13px', opacity: active ? 1 : 0.7 }}>{key}</kbd>)}</div>}
      {hasArrow && <img src="/icons/IconChevronLargeRight.svg" width={14} height={14} alt="" style={{ opacity: active ? 0.35 : 0.15, flexShrink: 0, transition: 'opacity 120ms ease' }} />}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CmdkPage() {
  const [open, setOpen] = useState(true)
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const [activeFilter, setActiveFilter] = useState<Filter>('all')
  const [pageStack, setPageStack] = useState<Page[]>([])
  const [flow, setFlow] = useState<FlowState>({ kind: 'idle' })
  const [flowInput, setFlowInput] = useState('')
  const [filterDropdown, setFilterDropdown] = useState(false)
  const [toast, setToast] = useState('')
  const [toastVis, setToastVis] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentPage = pageStack.length > 0 ? pageStack[pageStack.length - 1] : null
  const filteredGroups = activeFilter === 'all' ? GROUPS : GROUPS.filter(g => g.filter === activeFilter)
  const allItems = filteredGroups.flatMap(g => g.items)
  const searched = !currentPage && query ? allItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase()) || (item.meta?.toLowerCase().includes(query.toLowerCase())) || (item.tag?.toLowerCase().includes(query.toLowerCase()))) : null
  const subSearched = currentPage && query ? currentPage.items.filter(item => item.label.toLowerCase().includes(query.toLowerCase()) || (item.meta?.toLowerCase().includes(query.toLowerCase()))) : null
  const displayGroups = searched ? [{ label: `${searched.length} result${searched.length !== 1 ? 's' : ''}`, filter: 'all' as Filter, items: searched }] : currentPage ? [{ label: currentPage.title, filter: 'all' as Filter, items: subSearched ?? currentPage.items }] : filteredGroups
  const totalItems = displayGroups.reduce((sum, g) => sum + g.items.length, 0)

  useEffect(() => { setActiveIdx(0) }, [query, activeFilter, pageStack.length])
  useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current); if (progressRef.current) clearInterval(progressRef.current) } }, [])

  const showToast = useCallback((msg: string) => { setToast(msg); setToastVis(true); setTimeout(() => setToastVis(false), 2200) }, [])
  const resetFlow = useCallback(() => { setFlow({ kind: 'idle' }); setFlowInput('') }, [])

  const pushPage = useCallback((item: Item) => {
    if (item.subItems) { setPageStack(prev => [...prev, { title: item.label, icon: item.icon, items: item.subItems! }]); setQuery(''); resetFlow() }
  }, [resetFlow])

  const popPage = useCallback(() => {
    if (flow.kind !== 'idle') { resetFlow(); return }
    setPageStack(prev => prev.slice(0, -1)); setQuery('')
  }, [flow.kind, resetFlow])

  // Loading helper
  const runLoading = useCallback((msg: string, duration: number, then: () => void) => {
    setFlow({ kind: 'loading', message: msg })
    timerRef.current = setTimeout(then, duration)
  }, [])

  const runLoadingWithProgress = useCallback((msg: string, total: number, then: () => void) => {
    let current = 0
    setFlow({ kind: 'loading', message: msg, progress: { current: 0, total } })
    progressRef.current = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 5
      if (current >= total) { current = total; if (progressRef.current) clearInterval(progressRef.current); setTimeout(then, 400) }
      setFlow({ kind: 'loading', message: `${msg} ${current}/${total}`, progress: { current, total } })
    }, 300)
  }, [])

  // ─── handleSubItemClick ──────────────────────────────────────────────────
  const handleSubItemClick = useCallback((item: SubItem) => {
    const ctx = currentPage?.title ?? ''

    // New prompt
    if (ctx === 'New prompt') {
      if (item.label === 'Blank prompt') {
        setFlow({ kind: 'input', placeholder: 'Type your prompt to track...', btn: 'Track Prompt', onSubmit: (v) => {
          runLoading('Adding prompt...', 1200, () => setFlow({ kind: 'success', message: 'Prompt added to tracking', detail: v }))
        }}); return
      }
      if (item.label === 'Suggested prompts') {
        setPageStack(prev => [...prev, { title: 'Suggested Prompts', icon: '/icons/IconLightBulb.svg', items: SUGGESTED_PROMPTS.map(p => ({ icon: '/icons/IconBubbleText.svg', label: p, meta: 'Click to add' })) }]); setQuery(''); return
      }
      if (item.label === 'Import from CSV') {
        setFlow({ kind: 'input', placeholder: 'Paste CSV content here...', btn: 'Import', onSubmit: () => {
          runLoading('Importing prompts...', 1500, () => setFlow({ kind: 'success', message: '12 prompts imported successfully' }))
        }}); return
      }
    }

    // Suggested prompts (deep page)
    if (ctx === 'Suggested Prompts') {
      runLoading('Adding prompt...', 1200, () => setFlow({ kind: 'success', message: 'Prompt added', detail: item.label })); return
    }

    // Add competitor
    if (ctx === 'Add competitor') {
      if (item.label === 'Search by name') {
        setFlow({ kind: 'input', placeholder: 'Search for a brand...', btn: 'Add', suggestions: BRAND_SUGGESTIONS, onSubmit: (v) => {
          runLoading(`Adding ${v}...`, 1200, () => setFlow({ kind: 'success', message: `${v} added as competitor` }))
        }}); return
      }
      if (item.label === 'Add by domain') {
        setFlow({ kind: 'input', placeholder: 'Enter domain (e.g. augur.net)', btn: 'Add Domain', onSubmit: (v) => {
          runLoading(`Looking up ${v}...`, 1500, () => setFlow({ kind: 'success', message: `${v} added as competitor` }))
        }}); return
      }
      if (item.label === 'Import list') {
        setFlow({ kind: 'input', placeholder: 'Paste brand names (one per line)...', btn: 'Import', onSubmit: () => {
          runLoading('Importing competitors...', 1500, () => setFlow({ kind: 'success', message: '4 competitors imported' }))
        }}); return
      }
    }

    // Run analysis
    if (ctx === 'Run analysis') {
      if (item.label === 'Full analysis') {
        setFlow({ kind: 'confirm', title: 'Run full analysis?', message: '225 prompts across 3 models. This will use ~675 API credits.', btn: 'Run Analysis', onConfirm: () => {
          runLoadingWithProgress('Analyzing...', 225, () => setFlow({ kind: 'success', message: 'Analysis complete', detail: '225 prompts analyzed across 3 models' }))
        }}); return
      }
      if (item.label === 'Brand comparison') {
        setFlow({ kind: 'confirm', title: 'Compare brands?', message: 'Compare Polymarket against 2 competitors across all prompts.', btn: 'Compare', onConfirm: () => {
          runLoading('Comparing brands...', 2000, () => setFlow({ kind: 'success', message: 'Comparison complete', action: { label: 'View results', onClick: () => showToast('Opening comparison...') } }))
        }}); return
      }
      if (item.label === 'Trend report') {
        setFlow({ kind: 'confirm', title: 'Generate trend report?', message: '30-day visibility trends for all tracked brands.', btn: 'Generate', onConfirm: () => {
          runLoading('Generating report...', 2000, () => setFlow({ kind: 'success', message: 'Visibility up 8% this month', sparkline: true }))
        }}); return
      }
    }

    // Export
    if (ctx === 'Export report') {
      if (item.label === 'Copy to clipboard') {
        navigator.clipboard?.writeText(SUMMARY_TEXT).catch(() => {})
        showToast('Copied to clipboard'); return
      }
      if (item.label === 'Export as CSV') {
        runLoading('Generating CSV...', 1500, () => setFlow({ kind: 'success', message: 'report_polymarket_apr2026.csv', action: { label: 'Download (2.4 MB)', onClick: () => showToast('Downloaded!') } })); return
      }
      if (item.label === 'Export as PDF') {
        runLoading('Generating PDF...', 2000, () => setFlow({ kind: 'success', message: 'report_polymarket_apr2026.pdf', action: { label: 'Download (1.8 MB)', onClick: () => showToast('Downloaded!') } })); return
      }
    }

    // Search chats → push new page
    if (ctx === 'Search all chats') {
      const model = item.label.replace(' chats', '')
      const chats = CHAT_PREVIEWS[model] ?? CHAT_PREVIEWS.ChatGPT
      setPageStack(prev => [...prev, { title: `${model} Chats`, icon: item.icon, items: chats }]); setQuery(''); return
    }

    // Chat detail
    if (ctx.endsWith('Chats')) {
      setFlow({ kind: 'detail', title: 'AI Response', stats: [], snippet: `"...${item.label}... Polymarket is a leading prediction market platform that allows users to trade on the outcomes of real-world events. It uses blockchain technology for transparent settlement and has become especially popular for political and economic forecasting."` }); return
    }

    // Prompts → model breakdown
    if (currentPage && ['ChatGPT', 'AI Overviews', 'Perplexity'].includes(item.label)) {
      const vis = item.badge ? parseInt(item.badge.text) : 50
      setFlow({ kind: 'detail', title: `${item.label} — ${currentPage.title.slice(0, 30)}`, stats: [
        { label: 'Visibility', value: item.badge?.text ?? '—', fill: vis / 100, color: item.badge?.color ?? 'oklch(0.5 0 0)' },
        { label: 'Position', value: item.meta?.match(/#\d+/)?.[0] ?? '#—', fill: 0.7, color: 'oklch(0.55 0.2 260)' },
        { label: 'Mentions', value: item.meta?.match(/\d+ mention/)?.[0] ?? '—', fill: vis / 100, color: 'oklch(0.7 0.16 70)' },
      ], snippet: `"Polymarket stands out as a top prediction platform with transparent, blockchain-based settlement. Users report high liquidity and a wide range of markets covering elections, sports, and global events."` }); return
    }

    // Brand stats
    if (item.label.startsWith('Visibility:')) {
      setFlow({ kind: 'detail', title: 'Visibility by Model', stats: [
        { label: 'ChatGPT', value: '56%', fill: 0.56, color: 'oklch(0.55 0.18 145)' },
        { label: 'AI Overviews', value: '57%', fill: 0.57, color: 'oklch(0.55 0.18 145)' },
        { label: 'Perplexity', value: '39%', fill: 0.39, color: 'oklch(0.6 0.2 25)' },
      ], sparkline: true, summary: 'vs. last month: +3.2%' }); return
    }
    if (item.label.startsWith('Share of voice:')) {
      setFlow({ kind: 'detail', title: 'Share of Voice', stats: [], donut: { segments: [
        { label: 'Polymarket', value: 60, color: 'oklch(0.55 0.18 145)' },
        { label: 'Kalshi', value: 28, color: 'oklch(0.55 0.2 260)' },
        { label: 'PredictIt', value: 12, color: 'oklch(0.7 0.16 70)' },
      ]}}); return
    }
    if (item.label.startsWith('Avg. position:')) {
      setFlow({ kind: 'detail', title: 'Position by Model', stats: [
        { label: 'ChatGPT', value: '#2.4', fill: 0.76, color: 'oklch(0.55 0.2 260)' },
        { label: 'AI Overviews', value: '#2.0', fill: 0.8, color: 'oklch(0.55 0.18 145)' },
        { label: 'Perplexity', value: '#1.7', fill: 0.83, color: 'oklch(0.55 0.18 145)' },
      ]}); return
    }
    if (item.label.startsWith('Sentiment:')) {
      setFlow({ kind: 'detail', title: 'Sentiment by Model', stats: [
        { label: 'ChatGPT', value: '54', fill: 0.54, color: 'oklch(0.7 0.16 70)' },
        { label: 'AI Overviews', value: '60', fill: 0.6, color: 'oklch(0.55 0.18 145)' },
        { label: 'Perplexity', value: '56', fill: 0.56, color: 'oklch(0.55 0.18 145)' },
      ]}); return
    }

    // Model → brand visibility
    if (item.label.includes('visibility')) {
      const vis = item.badge ? parseInt(item.badge.text) : 40
      setFlow({ kind: 'detail', title: item.label, stats: [
        { label: 'Sports prompts', value: `${vis + 2}%`, fill: (vis + 2) / 100, color: item.badge?.color ?? 'oklch(0.5 0 0)' },
        { label: 'Product prompts', value: `${vis + 8}%`, fill: (vis + 8) / 100, color: 'oklch(0.55 0.18 145)' },
        { label: 'Politics prompts', value: `${vis - 5}%`, fill: (vis - 5) / 100, color: 'oklch(0.7 0.16 70)' },
        { label: 'Comparison prompts', value: `${vis - 10}%`, fill: (vis - 10) / 100, color: 'oklch(0.6 0.2 25)' },
      ], summary: `Appears in ${vis}% of responses from this model` }); return
    }

    // Source pages
    if (item.label.startsWith('/') || item.label.startsWith('r/') || item.label.includes('(video)') || item.label.includes('Guide')) {
      const cites = parseInt(item.meta?.match(/\d+/)?.[0] ?? '0')
      setFlow({ kind: 'detail', title: item.label, stats: [
        { label: 'ChatGPT citations', value: `${Math.round(cites * 0.4)}`, fill: 0.4, color: 'oklch(0.55 0.18 145)' },
        { label: 'AI Overview citations', value: `${Math.round(cites * 0.35)}`, fill: 0.35, color: 'oklch(0.55 0.2 260)' },
        { label: 'Perplexity citations', value: `${Math.round(cites * 0.25)}`, fill: 0.25, color: 'oklch(0.7 0.16 70)' },
      ], summary: `${cites} total citations` }); return
    }

    showToast(`Opened: ${item.label}`)
  }, [currentPage, runLoading, runLoadingWithProgress, showToast])

  // Keyboard
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (flow.kind === 'input') return // let input handle its own keys
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => (i + 1) % totalItems) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => (i - 1 + totalItems) % totalItems) }
    if (e.key === 'Enter' && flow.kind === 'idle') {
      e.preventDefault()
      if (currentPage) { const items = subSearched ?? currentPage.items; if (items[activeIdx]) handleSubItemClick(items[activeIdx]); return }
      let i = 0; for (const g of displayGroups) { for (const item of g.items) { if (i === activeIdx) { pushPage(item as Item); return }; i++ } }
    }
    if (e.key === 'Escape') {
      if (flow.kind !== 'idle') { resetFlow() }
      else if (query) { setQuery('') }
      else if (currentPage) { setPageStack(prev => prev.slice(0, -1)); setQuery('') }
      else if (activeFilter !== 'all') { setActiveFilter('all') }
      else { setOpen(false) }
    }
    if (e.key === 'Backspace' && !query) {
      if (flow.kind !== 'idle') { resetFlow() }
      else if (currentPage) { setPageStack(prev => prev.slice(0, -1)); setQuery('') }
    }
  }, [totalItems, activeIdx, currentPage, displayGroups, pushPage, handleSubItemClick, flow.kind, query, activeFilter, subSearched, resetFlow])

  // Global ⌘K
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.metaKey && e.key === 'k') { e.preventDefault(); setOpen(p => !p) } }
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
  }, [])

  useEffect(() => { if (open) { setQuery(''); setActiveFilter('all'); setActiveIdx(0); setPageStack([]); resetFlow(); requestAnimationFrame(() => inputRef.current?.focus()) } }, [open, resetFlow])
  useEffect(() => { const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`) as HTMLElement; if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) }, [activeIdx])
  useEffect(() => { if (!filterDropdown) return; const h = (e: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterDropdown(false) }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [filterDropdown])

  // Get active item for preview
  const getActiveItem = useCallback((): (Item | SubItem | null) => {
    if (flow.kind !== 'idle') return null
    if (currentPage) {
      const items = subSearched ?? currentPage.items
      return items[activeIdx] ?? null
    }
    let i = 0
    for (const g of displayGroups) {
      for (const item of g.items) {
        if (i === activeIdx) return item
        i++
      }
    }
    return null
  }, [flow.kind, currentPage, subSearched, activeIdx, displayGroups])

  const previewItem = getActiveItem()

  let itemIdx = 0
  const footerHints = flow.kind === 'input' ? '↵ Submit · esc Back' : flow.kind === 'loading' ? 'Processing...' : flow.kind === 'success' ? 'esc Back' : flow.kind === 'confirm' ? '↵ Confirm · esc Cancel' : flow.kind === 'detail' ? 'esc Back' : currentPage ? '↵ Select · ⌫ Back' : '↑↓ Navigate · ↵ Open · esc Close'

  return (
    <main style={{ minHeight: '100vh', background: '#FDFDFD', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <style>{`
        @keyframes cmdkIn { from { opacity:0; transform:scale(0.97) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes backdropIn { from { opacity:0; } to { opacity:1; } }
        @keyframes dropIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pageIn { from { opacity:0; transform:translateX(8px); } to { opacity:1; transform:translateX(0); } }
        @keyframes flowIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes checkIn { from { transform:scale(0); } 60% { transform:scale(1.15); } to { transform:scale(1); } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes barGrow { from { transform:scaleX(0); } to { transform:scaleX(1); } }
        .cmdk-item { transition: background 120ms cubic-bezier(0.4,0,0.2,1); }
        .cmdk-item:active { transform: scale(0.997); }
        .cmdk-filter:hover { background: oklch(0 0 0 / 0.03) !important; }
        .cmdk-filter:active { transform: scale(0.97); }
        .cmdk-list { scroll-behavior: smooth; }
        .cmdk-list::-webkit-scrollbar { width: 4px; }
        .cmdk-list::-webkit-scrollbar-track { background: transparent; }
        .cmdk-list::-webkit-scrollbar-thumb { background: oklch(0 0 0 / 0.06); border-radius: 99px; }
        input::placeholder, textarea::placeholder { color: oklch(0 0 0 / 0.28); }
        .cmdk-preview::-webkit-scrollbar { width: 4px; }
        .cmdk-preview::-webkit-scrollbar-track { background: transparent; }
        .cmdk-preview::-webkit-scrollbar-thumb { background: oklch(0 0 0 / 0.06); border-radius: 99px; }
      `}</style>

      {!open && (
        <div onClick={() => setOpen(true)} style={{ cursor: 'pointer', animation: 'cmdkIn 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 12, background: 'oklch(0 0 0 / 0.03)', border: '1px solid oklch(0 0 0 / 0.06)', transition: 'background 0.2s ease' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0 0 0 / 0.05)')} onMouseLeave={e => (e.currentTarget.style.background = 'oklch(0 0 0 / 0.03)')}>
            <img src="/icons/IconMagnifyingGlass.svg" width={16} height={16} alt="" style={{ opacity: 0.3 }} />
            <span style={{ fontFamily: font, fontSize: 14, fontWeight: 400, color: 'oklch(0 0 0 / 0.35)' }}>Search prompts, brands, sources...</span>
            <div style={{ display: 'flex', gap: 3, marginLeft: 12 }}>
              <kbd style={{ fontFamily: mono, fontSize: 11, fontWeight: 500, padding: '2px 6px', borderRadius: 5, background: 'oklch(0 0 0 / 0.04)', border: '1px solid oklch(0 0 0 / 0.08)', color: 'oklch(0 0 0 / 0.35)', lineHeight: '14px' }}>⌘</kbd>
              <kbd style={{ fontFamily: mono, fontSize: 11, fontWeight: 500, padding: '2px 6px', borderRadius: 5, background: 'oklch(0 0 0 / 0.04)', border: '1px solid oklch(0 0 0 / 0.08)', color: 'oklch(0 0 0 / 0.35)', lineHeight: '14px' }}>K</kbd>
            </div>
          </div>
        </div>
      )}

      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'oklch(0 0 0 / 0.15)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', animation: 'backdropIn 0.2s ease' }} />}

      {open && (
        <div style={{ width: 1006, height: 700, overflow: 'hidden', background: 'oklch(0.995 0 0)', borderRadius: 16, boxShadow: '0px 1px 2px oklch(0 0 0 / 0.02), 0px 4px 12px oklch(0 0 0 / 0.04), 0px 16px 40px oklch(0 0 0 / 0.06), 0px 0px 0px 1px oklch(0 0 0 / 0.04)', display: 'flex', flexDirection: 'row', animation: 'cmdkIn 0.3s cubic-bezier(0.25,0.1,0.25,1)', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 1000 }}>

          {/* Left panel — commands */}
          <div style={{ width: 420, display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%' }}>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 18px 12px' }}>
            {currentPage ? (
              <div onClick={popPage} style={{ cursor: 'pointer', flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'oklch(0 0 0 / 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s ease' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0 0 0 / 0.07)')} onMouseLeave={e => (e.currentTarget.style.background = 'oklch(0 0 0 / 0.04)')}>
                <img src="/icons/IconArrowLeft.svg" width={16} height={16} alt="" style={{ opacity: 0.45 }} />
              </div>
            ) : (
              <img src="/icons/IconMagnifyingGlass.svg" width={18} height={18} alt="" style={{ opacity: 0.28, flexShrink: 0 }} />
            )}
            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKeyDown}
              placeholder={currentPage ? `Search in ${currentPage.title.slice(0, 30)}...` : 'Search prompts, brands, sources...'}
              autoFocus style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: font, fontSize: 15, fontWeight: 400, color: 'oklch(0.18 0.02 60)', letterSpacing: '-0.01em' }} />
            <kbd style={{ fontFamily: mono, fontSize: 11, fontWeight: 500, padding: '2px 6px', borderRadius: 5, background: 'oklch(0 0 0 / 0.03)', border: '1px solid oklch(0 0 0 / 0.06)', color: 'oklch(0 0 0 / 0.3)', lineHeight: '14px', flexShrink: 0 }}>esc</kbd>
          </div>

          {/* Filters */}
          {!currentPage && (
            <div style={{ padding: '4px 18px 0', display: 'flex', gap: 6, alignItems: 'center' }}>
              {([{ key: 'all' as Filter, label: 'All' }, { key: 'prompts' as Filter, label: 'Prompts' }, { key: 'brands' as Filter, label: 'Brands' }, { key: 'models' as Filter, label: 'Models' }, { key: 'sources' as Filter, label: 'Sources' }]).map(f => {
                const a = activeFilter === f.key
                return <button key={f.key} className="cmdk-filter" onClick={() => { setActiveFilter(f.key); setActiveIdx(0) }} style={{ height: 26, paddingLeft: 8, paddingRight: 8, borderRadius: 6, cursor: 'pointer', border: a ? '1px solid oklch(0.6 0.18 25 / 0.5)' : '1px solid oklch(0 0 0 / 0.08)', background: a ? 'oklch(0.6 0.18 25 / 0.06)' : 'transparent', fontFamily: font, fontSize: 12, fontWeight: 500, color: a ? 'oklch(0.5 0.18 25)' : 'oklch(0 0 0 / 0.45)', transition: 'all 200ms ease' }}>{f.label}</button>
              })}
              <div ref={filterRef} style={{ position: 'relative' }}>
                <button className="cmdk-filter" onClick={() => setFilterDropdown(p => !p)} style={{ height: 26, paddingLeft: 6, paddingRight: 6, borderRadius: 6, cursor: 'pointer', border: '1px solid oklch(0 0 0 / 0.08)', background: 'transparent', fontFamily: font, fontSize: 12, fontWeight: 500, color: 'oklch(0 0 0 / 0.3)', display: 'flex', alignItems: 'center', gap: 3, transition: 'all 200ms ease' }}>
                  <img src="/icons/IconPlusMedium.svg" width={12} height={12} alt="" style={{ opacity: 0.3 }} /> Filter
                </button>
                {filterDropdown && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, background: 'oklch(0.995 0 0)', borderRadius: 12, padding: 4, boxShadow: '0px 4px 16px oklch(0 0 0 / 0.08), 0px 0px 0px 1px oklch(0 0 0 / 0.05)', zIndex: 1001, minWidth: 160, animation: 'dropIn 0.15s ease' }}>
                    {['By tag', 'By country', 'By date range', 'By volume'].map(label => (
                      <div key={label} onClick={() => { showToast(`Filter: ${label}`); setFilterDropdown(false) }} style={{ height: 32, paddingLeft: 10, paddingRight: 10, borderRadius: 8, display: 'flex', alignItems: 'center', cursor: 'pointer', fontFamily: font, fontSize: 13, fontWeight: 500, color: 'oklch(0.25 0.01 60)', transition: 'background 100ms ease' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0 0 0 / 0.03)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>{label}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={{ height: 1, margin: `${currentPage ? '6px' : '10px'} 18px 0`, background: 'oklch(0 0 0 / 0.04)' }} />

          {/* List / Flow */}
          <div ref={listRef} className="cmdk-list" key={`${pageStack.length}-${flow.kind}`} style={{ padding: 6, overflowY: 'auto', flex: 1, animation: currentPage ? 'pageIn 0.2s ease' : undefined }}>
            {flow.kind !== 'idle' ? (
              <FlowView flow={flow} onBack={resetFlow} flowInput={flowInput} setFlowInput={setFlowInput} showToast={showToast} />
            ) : currentPage ? (
              (subSearched ?? currentPage.items).map((item, idx) => (
                <CmdRow key={item.label + idx} item={item} active={idx === activeIdx} onClick={() => { setActiveIdx(idx); handleSubItemClick(item) }} onHover={() => setActiveIdx(idx)} />
              ))
            ) : (
              displayGroups.map(group => {
                if (group.items.length === 0) return null
                return (
                  <div key={group.label}>
                    <div style={{ padding: '12px 12px 6px', fontFamily: font, fontSize: 11, fontWeight: 600, color: 'oklch(0 0 0 / 0.3)', letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>{group.label}</div>
                    {group.items.map(item => {
                      const idx = itemIdx++
                      return <div key={item.label + idx} data-idx={idx}><CmdRow item={item} active={idx === activeIdx} onClick={() => { setActiveIdx(idx); if ((item as Item).subItems) pushPage(item as Item) }} onHover={() => setActiveIdx(idx)} hasArrow={!!(item as Item).subItems} /></div>
                    })}
                  </div>
                )
              })
            )}
            {((searched && searched.length === 0) || (subSearched && subSearched.length === 0)) && flow.kind === 'idle' && (
              <div style={{ padding: '40px 10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <img src="/icons/IconMagnifyingGlass.svg" width={24} height={24} alt="" style={{ opacity: 0.15 }} />
                <span style={{ fontFamily: font, fontSize: 14, fontWeight: 400, color: 'oklch(0 0 0 / 0.25)' }}>No results for &ldquo;{query}&rdquo;</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid oklch(0 0 0 / 0.04)', background: 'oklch(0 0 0 / 0.012)' }}>
            <span style={{ fontFamily: font, fontSize: 11, fontWeight: 500, color: 'oklch(0 0 0 / 0.28)' }}>{footerHints}</span>
            <span style={{ fontFamily: font, fontSize: 11, fontWeight: 400, color: 'oklch(0 0 0 / 0.2)' }}>Polymarket · Apr 2026</span>
          </div>
          </div>{/* end left panel */}

          {/* Right panel — preview */}
          <PreviewPanel item={previewItem} currentPage={currentPage} flow={flow} />
        </div>
      )}

      {/* Toast */}
      <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: `translateX(-50%) translateY(${toastVis ? 0 : 12}px)`, opacity: toastVis ? 1 : 0, transition: 'all 0.3s cubic-bezier(0.25,0.1,0.25,1)', background: 'oklch(0.15 0 0)', color: '#fff', fontFamily: font, fontSize: 13, fontWeight: 500, padding: '8px 16px', borderRadius: 10, letterSpacing: '-0.01em', pointerEvents: 'none', zIndex: 9999, boxShadow: '0px 4px 16px oklch(0 0 0 / 0.2)', whiteSpace: 'nowrap' }}>{toast}</div>
    </main>
  )
}
