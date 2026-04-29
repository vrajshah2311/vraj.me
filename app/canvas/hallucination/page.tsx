'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Orb } from '@/components/ui/orb'

const font = 'var(--font-geist-sans), -apple-system, sans-serif'

const PHRASES: Record<string, string> = {
  subject:    'The tech company',
  users:      '2.2 billion active devices',
  listing:    'a major product reveal',
  pronoun:    'it',
  audio:      'consumer technology',
  engine:     'the personalisation system',
  discovery:  'the mixed-reality headset',
  retention:  'customer retention',
}

const PHRASE_ORDER = ['subject', 'users', 'listing', 'pronoun', 'audio']

type SegDef = { text: string; phraseId?: string; break?: boolean }

const SEGMENTS: SegDef[] = [
  { text: '', phraseId: 'subject' },
  { text: ' was founded in a Cupertino garage in 1976 and has since grown into the world\'s most valuable brand, powering ' },
  { text: '', phraseId: 'users' },
  { text: ' across more than 175 countries. The company made global headlines with ' },
  { text: '', phraseId: 'listing' },
  { text: ' in 2023, pushing further into ' },
  { text: '', phraseId: 'audio' },
  { text: '. Today, ' },
  { text: '', phraseId: 'pronoun' },
  { text: ' is widely regarded as the defining force in personal computing and continues to set the pace for design and innovation.' },
]

let _p = 0
const SEGS = SEGMENTS.map(s => {
  const t = (s.break || !s.phraseId) ? (s.text ?? '') : PHRASES[s.phraseId!]
  const start = _p; _p += t.length
  return { ...s, text: t, start, end: _p }
})
const TOTAL = _p

const HIGHLIGHT_DELAY = 180

// Simulated AI responses per model per phrase
const AI_RESPONSES: Record<string, Record<string, string[]>> = {
  subject: {
    ChatGPT:      ['Apple Inc.', 'Apple', 'Apple, the Cupertino giant,'],
    Perplexity:   ['Apple (AAPL)', 'Apple Inc., the iPhone maker,', 'Apple'],
    'AI Overview': ['Apple', 'Apple Inc.', 'Tech giant Apple'],
    Claude:       ['Apple', 'Apple, founded by Steve Jobs,', 'Apple Inc.'],
    Gemini:       ['Apple', 'Apple Inc.', 'Cupertino-based Apple'],
    Copilot:      ['Apple', 'Apple Inc.', 'Apple, the tech leader,'],
    Grok:         ['Apple 🍎', 'Apple Inc.', 'Apple'],
    DeepSeek:     ['Apple', 'Apple Inc.', 'Apple Corporation'],
    Mistral:      ['Apple', 'Apple Inc., headquartered in Cupertino,', 'Apple'],
  },
  users: {
    ChatGPT:      ["Apple's 2.2 billion active devices", '2.2 billion Apple devices worldwide', "Apple's ecosystem of 2.2 billion devices"],
    Perplexity:   ["Apple's estimated 2.2B active devices", "Apple's 2.2 billion active device install base", "2.2 billion devices in Apple's ecosystem"],
    'AI Overview': ["Apple's 2.2 billion active devices", '2.2 billion active Apple products globally', "Apple's massive 2.2B device footprint"],
    Claude:       ["Apple's 2.2 billion active devices", "an Apple ecosystem spanning 2.2 billion devices", "Apple's install base of 2.2 billion devices"],
    Gemini:       ["Apple's 2.2 billion active devices", '2.2 billion Apple-powered devices', "Apple's 2.2B-strong device ecosystem"],
    Copilot:      ["Apple's 2.2 billion active devices", "Apple's 2.2 billion device install base"],
    Grok:         ["Apple's absolutely massive 2.2 billion devices", "2.2 billion Apple devices (and counting)"],
    DeepSeek:     ["Apple's 2.2 billion active devices", "the 2.2 billion devices in Apple's ecosystem"],
    Mistral:      ["Apple's 2.2 billion active devices", "2.2 billion active Apple devices"],
  },
  listing: {
    ChatGPT:      ['the iPhone 16 launch keynote', 'the September 2023 iPhone 16 reveal', "Apple's iPhone 16 keynote event"],
    Perplexity:   ['the iPhone 16 launch at Apple Park', "Apple's iPhone 16 keynote in September 2023", 'the Wonderlust iPhone 16 event'],
    'AI Overview': ['the iPhone 16 launch keynote', 'the Apple iPhone 16 announcement', "Apple's 2023 fall keynote"],
    Claude:       ['the iPhone 16 launch keynote', "Apple's Wonderlust event", 'the September 2023 keynote unveiling iPhone 16'],
    Gemini:       ['the iPhone 16 launch keynote', 'the Apple Wonderlust keynote', 'the iPhone 16 reveal event'],
    Copilot:      ['the iPhone 16 launch keynote', "Apple's fall 2023 product launch"],
    Grok:         ['the iPhone 16 keynote drop', "Apple's big iPhone 16 reveal"],
    DeepSeek:     ['the iPhone 16 launch keynote', "Apple's iPhone 16 product announcement"],
    Mistral:      ['the iPhone 16 launch keynote', "Apple's September 2023 keynote"],
  },
  pronoun: {
    ChatGPT:      ['Apple', 'the company', 'Apple Inc.'],
    Perplexity:   ['Apple', 'the Cupertino company', 'Apple Inc.'],
    'AI Overview': ['Apple', 'Apple Inc.', 'the tech giant'],
    Claude:       ['Apple', 'the company', 'Apple'],
    Gemini:       ['Apple', 'Apple Inc.', 'Apple'],
    Copilot:      ['Apple', 'Apple Inc.'],
    Grok:         ['Apple', 'Tim Cook\'s Apple'],
    DeepSeek:     ['Apple', 'Apple Inc.'],
    Mistral:      ['Apple', 'Apple Inc.'],
  },
  audio: {
    ChatGPT:      ['Apple hardware and software', "Apple's integrated hardware-software ecosystem", 'Apple devices and services'],
    Perplexity:   ['Apple hardware and software', "Apple's hardware and software stack", "Apple's vertically integrated tech"],
    'AI Overview': ['Apple hardware and software', "Apple's product ecosystem", 'Apple devices and platforms'],
    Claude:       ['Apple hardware and software', "Apple's tightly integrated hardware and software", "Apple's product lineup"],
    Gemini:       ['Apple hardware and software', "Apple's device ecosystem", "Apple's hardware-software integration"],
    Copilot:      ['Apple hardware and software', "Apple's technology ecosystem"],
    Grok:         ["Apple's iconic hardware and slick software", 'Apple gear and software'],
    DeepSeek:     ['Apple hardware and software', "Apple's technology products"],
    Mistral:      ['Apple hardware and software', "Apple's integrated product range"],
  },
}


// ── Optimization data ──────────────────────────────────────────────────────

const geist = 'var(--font-geist-sans), -apple-system, sans-serif'

const OPTIMIZATIONS: Record<string, { issue: string; resolved: string; suggestion: string }> = {
  subject:   { issue: 'Brand missing',   resolved: 'Brand added',    suggestion: 'Apple'                          },
  users:     { issue: 'Unattributed',    resolved: 'Attributed',     suggestion: "Apple's 2.2 billion active devices" },
  listing:   { issue: 'Unnamed event',   resolved: 'Named event',    suggestion: 'the iPhone 16 launch keynote'   },
  pronoun:   { issue: 'No brand name',   resolved: 'Brand named',    suggestion: 'Apple'                          },
  audio:     { issue: 'Generic term',    resolved: 'Specific term',  suggestion: 'Apple hardware and software'    },
  engine:    { issue: 'Unbranded',       resolved: 'Branded',        suggestion: 'Apple Intelligence'             },
  discovery: { issue: 'Unbranded',       resolved: 'Branded',        suggestion: 'Apple Vision Pro'               },
  retention: { issue: 'Unattributed',    resolved: 'Attributed',     suggestion: 'Apple customer retention'       },
}


// ── Progress Circle ────────────────────────────────────────────────────────
function ProgressCircle({ value, size = 24 }: { value: number; size?: number }) {
  const r = (size - 3) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - value / 100)
  const color = value >= 80 ? 'oklch(0.6 0.2 145)' : value >= 50 ? 'oklch(0.65 0.18 80)' : 'oklch(0.65 0.2 25)'
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={size > 28 ? 'oklch(1 0 0 / 0.1)' : 'oklch(0 0 0 / 0.06)'} strokeWidth={size > 28 ? 3 : 2.5} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size > 28 ? 3 : 2.5}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1), stroke 0.5s ease' }} />
      </svg>
      <span style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: geist, fontSize: size > 28 ? 10 : 8, fontWeight: 600, color: size > 28 ? '#fff' : '#171717', letterSpacing: '-0.02em',
      }}>{value}</span>
    </div>
  )
}

// ── Button ─────────────────────────────────────────────────────────────────
function BorderBtn({ children, onClick, green, disabled }: {
  children: React.ReactNode
  onClick?: () => void
  green?: boolean
  disabled?: boolean
}) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={disabled ? undefined : onClick}
      style={{
        height: 28, paddingLeft: 6, paddingRight: 6,
        position: 'relative', overflow: 'hidden',
        background: green
          ? 'oklch(0.768 0.189 125.3 / 0.1)'
          : hov
            ? 'linear-gradient(180deg, rgba(23,23,23,0) 0%, rgba(23,23,23,0.04) 100%), #FDFDFD'
            : 'linear-gradient(180deg, rgba(23,23,23,0) 0%, rgba(23,23,23,0) 100%), #FDFDFD',
        boxShadow: green
          ? '0 0 0 1px oklch(0.768 0.189 125.3 / 0.35)'
          : '0px 0px 0px 1px rgba(23,23,23,0) inset, 0px 0px 0px 1px rgba(23,23,23,0.08), 0px 1px 3px rgba(23,23,23,0.06)',
        borderRadius: 8,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'background 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 8,
        background: hov
          ? 'linear-gradient(180deg, rgba(23,23,23,0) 0%, rgba(23,23,23,0.04) 100%)'
          : 'linear-gradient(180deg, rgba(23,23,23,0) 0%, rgba(23,23,23,0) 100%)',
        transition: 'background 0.2s cubic-bezier(0.16,1,0.3,1)',
      }} />
      {children}
    </div>
  )
}

// ── Primary Button ─────────────────────────────────────────────────────────
function PrimaryBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: 28, paddingLeft: 6, paddingRight: 6, borderRadius: 8,
        display: 'inline-flex', alignItems: 'center', gap: 5,
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        opacity: hov ? 0.9 : 1,
        background: '#171717',
        boxShadow: '0px 0px 0px 1px rgba(253,253,253,0.12) inset, 0px 0px 0px 1px #171717, 0px 1px 3px rgba(23,23,23,0.06)',
        transition: 'opacity 0.2s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 8,
        background: hov
          ? 'linear-gradient(180deg, rgba(253,253,253,0) 0%, rgba(253,253,253,0.04) 100%)'
          : 'linear-gradient(180deg, rgba(253,253,253,0) 0%, rgba(253,253,253,0) 100%)',
        transition: 'background 0.2s cubic-bezier(0.16,1,0.3,1)',
      }} />
      {children}
    </div>
  )
}

// ── Toolbar ────────────────────────────────────────────────────────────────
const Toolbar = React.forwardRef<HTMLDivElement, {
  x: number; y: number; visible: boolean; phraseId: string | null
  onEnter: () => void; onLeave: () => void
  onApply: (id: string) => void
  onEditConfirm: (id: string, text: string) => void
  onUndo: (id: string) => void
  applied: Set<string>
  currentText: string
  isEditing: boolean
  setIsEditing: (v: boolean) => void
  isAskingAI: boolean
  setIsAskingAI: (v: boolean) => void
  aiThinkingMsg: string
  onAskAI: (id: string, prompt: string, model: string) => void
  score: number | null
}>(function Toolbar({ x, y, visible, phraseId, onEnter, onLeave, onApply, onEditConfirm, onUndo, applied, currentText, isEditing, setIsEditing, isAskingAI, setIsAskingAI, aiThinkingMsg, onAskAI, score }, ref) {
  const opt       = phraseId ? OPTIMIZATIONS[phraseId] : null
  const isApplied = phraseId ? applied.has(phraseId) : false
  const [styleOpen,    setStyleOpen]    = useState(false)
  const [modelOpen,    setModelOpen]    = useState(false)
  const MODEL_LIST = [
    { label: 'ChatGPT',      icon: '/icons/IconOpenai.svg' },
    { label: 'Perplexity',   icon: '/icons/IconPerplexity.svg' },
    { label: 'AI Overview',  icon: '/icons/IconGoogle.svg' },
    { label: 'Claude',       icon: '/icons/IconClaudeai.svg' },
    { label: 'Gemini',       icon: '/icons/IconGemini.svg' },
    { label: 'Copilot',      icon: '/icons/IconMicrosoftCopilot.svg' },
    { label: 'Grok',         icon: '/icons/IconGrok.svg' },
    { label: 'DeepSeek',     icon: '/icons/IconDeepseek.svg' },
    { label: 'Mistral',      icon: '/icons/IconMistral.svg' },
  ]
  const [selectedModel, setSelectedModel] = useState('ChatGPT')
  const selectedModelIcon = MODEL_LIST.find(m => m.label === selectedModel)?.icon ?? '/icons/IconOpenai.svg'
  const [lockedWidth,  setLockedWidth]  = useState<number | null>(null)
  const innerRef  = useRef<HTMLDivElement>(null)
  const taRef     = useRef<HTMLTextAreaElement>(null)
  const styleRef  = useRef<HTMLDivElement>(null)

  const mergedRef = React.useCallback((node: HTMLDivElement | null) => {
    (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
  }, [ref])

  const aiInputRef = useRef<HTMLInputElement>(null)

  const modelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!visible) { setIsEditing(false); setIsAskingAI(false); setStyleOpen(false); setModelOpen(false) }
  }, [visible])

  useEffect(() => { setStyleOpen(false) }, [phraseId])

  useEffect(() => {
    if (!styleOpen) return
    const handler = (e: MouseEvent) => {
      if (styleRef.current && !styleRef.current.contains(e.target as Node)) setStyleOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [styleOpen])

  useEffect(() => {
    if (!modelOpen) return
    const handler = (e: MouseEvent) => {
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) setModelOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [modelOpen])

  useEffect(() => {
    if (isEditing) {
      requestAnimationFrame(() => {
        const el = taRef.current as unknown as HTMLInputElement | null
        if (el) { el.value = currentText; el.focus(); el.select() }
      })
    } else if (!isAskingAI && !aiThinkingMsg) {
      setLockedWidth(null)
    }
  }, [isEditing])

  useEffect(() => {
    if (isAskingAI) {
      requestAnimationFrame(() => aiInputRef.current?.focus())
    } else if (!isEditing && !aiThinkingMsg) {
      setLockedWidth(null)
    }
  }, [isAskingAI])

  // Badge bar colors per issue type
  const badgeBar: Record<string, string> = {
    'Brand missing':  'oklch(0.65 0.22 25)',   // red-orange
    'Unattributed':   'oklch(0.72 0.18 65)',    // amber
    'Unnamed event':  'oklch(0.65 0.15 185)',   // teal
    'No brand name':  'oklch(0.65 0.20 330)',   // pink
    'Generic term':   'oklch(0.55 0.22 230)',   // blue
    'Unbranded':      'oklch(0.58 0.20 145)',   // green
  }
  const badge = opt ? (badgeBar[opt.issue] ?? 'oklch(0.5 0.1 0)') : null

  const handleSave = () => {
    const val = (taRef.current as unknown as HTMLInputElement | null)?.value.trim()
    if (phraseId && val) onEditConfirm(phraseId, val)
    setIsEditing(false)
  }

  return (
    <div
      ref={mergedRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: 'absolute', left: x, top: y,
        width: (isEditing || isAskingAI) && lockedWidth ? lockedWidth : undefined,
        transform: `translate(-50%, calc(-100% - 4px)) translateY(${visible ? 0 : 6}px) scale(${visible ? 1 : 0.96})`,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        zIndex: 1000,
        transition: visible
          ? 'opacity 0.25s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1)'
          : 'opacity 0.18s cubic-bezier(0.4,0,1,1), transform 0.18s cubic-bezier(0.4,0,1,1)',
      }}
    >
      {/* Revolving gradient glow during AI thinking */}
      <div className="toolbar-glow" style={{
        position: 'absolute', inset: -2, borderRadius: 14,
        opacity: aiThinkingMsg ? 1 : 0,
        transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: 'none',
        background: 'conic-gradient(from var(--glow-angle, 0deg), oklch(0.7 0.15 280 / 0.6), oklch(0.65 0.15 220 / 0.5), oklch(0.75 0.12 330 / 0.4), oklch(0.7 0.1 145 / 0.35), transparent 40%, transparent 60%, oklch(0.7 0.15 280 / 0.6))',
        filter: 'blur(2px)',
      }} />

      {/* Toolbar content */}
      <div style={{
        position: 'relative',
        padding: 4,
        background: 'oklch(0.999 0 0)',
        boxShadow: '0px 4px 6px -4px oklch(0 0 0 / 0.08), 0px 10px 15px -3px oklch(0 0 0 / 0.08), 0px 0px 0px 1px oklch(0 0 0 / 0.07)',
        borderRadius: 12,
        display: 'inline-flex', alignItems: 'center',
        width: '100%',
        whiteSpace: 'nowrap', gap: 6,
      }}>
      {isAskingAI ? (
        /* ── Ask AI mode ── */
        <>
          <div style={{ filter: 'blur(0.8px)', flexShrink: 0, position: 'relative', marginLeft: 4 }}>
            <div style={{ width: 14, height: 14, borderRadius: 9999, overflow: 'hidden', clipPath: 'circle(50% at 50% 50%)', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, animation: 'orbHue 6s linear infinite' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: 'radial-gradient(ellipse 33% 40% at 100% 33%, white 0%, transparent 100%), radial-gradient(ellipse 57% 57% at 20% 15%, #67E8F9 0%, transparent 100%), radial-gradient(ellipse 60% 60% at 70% 50%, #A78BFA 0%, #6366F1 100%)', animation: 'orbBase 30s linear infinite' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: 'radial-gradient(ellipse 50% 50% at 75% 25%, #F472B6 0%, transparent 100%)', animation: 'orbYellow 25s linear infinite' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: 'radial-gradient(ellipse 57% 55% at 53% 43%, transparent 62%, transparent 80%, white 100%)' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: 'radial-gradient(ellipse 60% 60% at 20% 80%, #7C3AED 0%, transparent 100%)', opacity: 0.8, animation: 'orbBlue 38s linear infinite' }} />
              </div>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, backdropFilter: 'blur(1.5px)', WebkitBackdropFilter: 'blur(1.5px)' }} />
              <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='80' height='80' filter='url(%23n)'/></svg>")`, backgroundSize: '80px 80px', mixBlendMode: 'overlay', opacity: 0.25 }} />
            </div>
            <div style={{ position: 'absolute', inset: -2, backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='80' height='80' filter='url(%23n)'/></svg>")`, backgroundSize: '20px 20px', mixBlendMode: 'overlay', opacity: 0.15, pointerEvents: 'none' }} />
          </div>
          <input
            ref={aiInputRef}
            placeholder="How can I help?"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const val = aiInputRef.current?.value.trim()
                if (phraseId && val) onAskAI(phraseId, val, selectedModel)
              }
              if (e.key === 'Escape') setIsAskingAI(false)
            }}
            style={{
              flex: 1, minWidth: 0,
              border: 'none', outline: 'none', background: 'transparent',
              fontFamily: geist, fontSize: 14, fontWeight: 500, color: '#171717',
              letterSpacing: '-0.02em', lineHeight: '14px',
              paddingLeft: 2, paddingRight: 4,
              animation: 'editIn 0.25s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
          {/* Model dropdown */}
          <div ref={modelRef} style={{ position: 'relative' }}>
            <BorderBtn onClick={() => setModelOpen(p => !p)}>
              <img src={selectedModelIcon} width={14} height={14} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontFamily: geist, fontWeight: 500, letterSpacing: '-0.01em', color: '#171717' }}>{selectedModel}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="oklch(0 0 0 / 0.45)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </BorderBtn>
            {modelOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0,
                background: 'oklch(0.999 0 0)',
                boxShadow: '0px 4px 6px -4px oklch(0 0 0 / 0.1), 0px 16px 32px -8px oklch(0 0 0 / 0.12), 0px 0px 0px 1px oklch(0 0 0 / 0.07)',
                borderRadius: 14, padding: 4, display: 'flex', flexDirection: 'column', gap: 1,
                zIndex: 1001, minWidth: 160,
                animation: 'dropIn 0.22s cubic-bezier(0.16,1,0.3,1) forwards',
                transformOrigin: 'top left',
              }}>
                {MODEL_LIST.map(({ label, icon }) => (
                  <div key={label}
                    onClick={() => { setSelectedModel(label); setModelOpen(false) }}
                    style={{ height: 30, paddingLeft: 8, paddingRight: 8, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.18s cubic-bezier(0.16,1,0.3,1)', background: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0 0 0 / 0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <img src={icon} width={14} height={14} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: geist, fontSize: 14, fontWeight: 500, color: '#171717', letterSpacing: '-0.01em', flex: 1 }}>{label}</span>
                    {selectedModel === label && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}><path d="M2 6.5L4.5 9L10 3" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ width: 1, height: 16, background: 'oklch(0 0 0 / 0.1)', flexShrink: 0, margin: '0 3px' }} />
          <BorderBtn onClick={() => setIsAskingAI(false)}>
            <img src="/icons/IconCrossSmall.svg" width={14} height={14} style={{ flexShrink: 0 }} />
          </BorderBtn>
          <PrimaryBtn onClick={() => {
            const val = aiInputRef.current?.value.trim()
            if (phraseId && val) onAskAI(phraseId, val, selectedModel)
          }}>
            <img src="/icons/IconArrowUp.svg" width={14} height={14} style={{ flexShrink: 0, filter: 'invert(1)', opacity: 0.8 }} />
          </PrimaryBtn>
        </>
      ) : aiThinkingMsg ? (
        /* ── AI Thinking mode ── */
        <>
          <div style={{ filter: 'blur(0.8px)', flexShrink: 0, position: 'relative', marginLeft: 4, animation: 'orbPulse 1.5s ease-in-out infinite' }}>
            <div style={{ width: 14, height: 14, borderRadius: 9999, overflow: 'hidden', clipPath: 'circle(50% at 50% 50%)', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, animation: 'orbHue 3s linear infinite' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: 'radial-gradient(ellipse 33% 40% at 100% 33%, white 0%, transparent 100%), radial-gradient(ellipse 57% 57% at 20% 15%, #67E8F9 0%, transparent 100%), radial-gradient(ellipse 60% 60% at 70% 50%, #A78BFA 0%, #6366F1 100%)', animation: 'orbBase 15s linear infinite' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: 'radial-gradient(ellipse 50% 50% at 75% 25%, #F472B6 0%, transparent 100%)', animation: 'orbYellow 12s linear infinite' }} />
              </div>
            </div>
          </div>
          <span style={{
            fontFamily: geist, fontSize: 14, fontWeight: 500, letterSpacing: '-0.02em',
            background: 'linear-gradient(90deg, oklch(0.25 0 0) 0%, oklch(0.35 0 0) 35%, oklch(0.55 0.04 280) 50%, oklch(0.35 0 0) 65%, oklch(0.25 0 0) 100%)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 2.5s ease-in-out infinite',
            marginLeft: 4,
          }}>
            {aiThinkingMsg}
          </span>
        </>
      ) : isEditing ? (
        /* ── Edit mode ── */
        <>
          <input
            ref={taRef as unknown as React.RefObject<HTMLInputElement>}
            defaultValue={currentText}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); handleSave() }
              if (e.key === 'Escape') setIsEditing(false)
            }}
            style={{
              flex: 1, minWidth: 0,
              border: 'none', outline: 'none', background: 'transparent',
              fontFamily: geist, fontSize: 14, fontWeight: 500, color: '#171717',
              letterSpacing: '-0.02em', lineHeight: '14px',
              paddingLeft: 6, paddingRight: 4,
              animation: 'editIn 0.25s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
          <div style={{ width: 1, height: 16, background: 'oklch(0 0 0 / 0.1)', flexShrink: 0, margin: '0 3px' }} />
          <BorderBtn onClick={() => setIsEditing(false)}>
            <img src="/icons/IconCrossSmall.svg" width={14} height={14} style={{ flexShrink: 0 }} />
          </BorderBtn>
          <PrimaryBtn onClick={handleSave}>
            <img src="/icons/IconCheckmark2Small.svg" width={14} height={14} style={{ flexShrink: 0, filter: 'invert(1)', opacity: 0.8 }} />
          </PrimaryBtn>
        </>
      ) : (
        /* ── Normal mode ── */
        <>
          {opt && (
            <>
              <div style={{ position: 'relative' }}>
                <div style={{
                  height: 28, paddingLeft: score !== null ? 4 : 8, paddingRight: 8,
                  display: 'inline-flex', alignItems: 'center', gap: score !== null ? 5 : 7,
                  background: '#fff', boxShadow: '0 0 0 1px oklch(0 0 0 / 0.08)', borderRadius: 8,
                  cursor: isApplied ? 'default' : undefined,
                }}>
                  {score !== null ? (
                    <ProgressCircle value={score} size={20} />
                  ) : (
                    <div style={{ width: 2.5, height: 12, borderRadius: 99, flexShrink: 0, background: badge ?? 'oklch(0.5 0.1 0)', transition: 'background 0.35s cubic-bezier(0.16,1,0.3,1)' }} />
                  )}
                  <span style={{ fontSize: 14, fontFamily: geist, fontWeight: 500, lineHeight: '14px', color: '#171717', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                    {isApplied ? opt.resolved : opt.issue}
                  </span>
                </div>

              </div>

              <div style={{ width: 1, height: 16, background: 'oklch(0 0 0 / 0.1)', flexShrink: 0, margin: '0 4px' }} />
            </>
          )}

          {/* Editing options group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Style picker */}
            <div ref={styleRef} style={{ position: 'relative' }}>
              <BorderBtn onClick={() => setStyleOpen(p => !p)}>
                <img src="/icons/IconText1.svg" width={14} height={14} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontFamily: geist, fontWeight: 500, lineHeight: '14px', letterSpacing: '-0.02em', color: '#171717' }}>Body</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="oklch(0 0 0 / 0.45)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </BorderBtn>
              {styleOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 4px)', left: 0,
                  background: 'oklch(0.999 0 0)',
                  boxShadow: '0px 4px 6px -4px oklch(0 0 0 / 0.1), 0px 16px 32px -8px oklch(0 0 0 / 0.12), 0px 0px 0px 1px oklch(0 0 0 / 0.07)',
                  borderRadius: 14, padding: 4, display: 'flex', flexDirection: 'column', gap: 1,
                  zIndex: 1001, minWidth: 160,
                  animation: 'dropIn 0.22s cubic-bezier(0.16,1,0.3,1) forwards',
                  transformOrigin: 'top left',
                }}>
                  {[
                    { label: 'Text',      icon: '/icons/IconText1.svg', active: true  },
                    { label: 'Heading 1', icon: '/icons/IconH1.svg',    active: false },
                    { label: 'Heading 2', icon: '/icons/IconH2.svg',    active: false },
                    { label: 'Heading 3', icon: '/icons/IconH3.svg',    active: false },
                  ].map(({ label, icon, active }) => (
                    <div key={label}
                      onClick={() => { if (phraseId) onEditConfirm(phraseId, currentText); setStyleOpen(false) }}
                      style={{ height: 30, paddingLeft: 8, paddingRight: 8, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.18s cubic-bezier(0.16,1,0.3,1)', background: 'transparent' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0 0 0 / 0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <img src={icon} width={14} height={14} style={{ flexShrink: 0, opacity: 0.4 }} />
                      <span style={{ fontFamily: geist, fontSize: 14, fontWeight: 500, color: '#171717', letterSpacing: '-0.01em', flex: 1 }}>{label}</span>
                      {active && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}><path d="M2 6.5L4.5 9L10 3" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Edit button */}
            <BorderBtn onClick={() => { setLockedWidth(innerRef.current?.offsetWidth ?? null); setIsEditing(true) }}>
              <img src="/icons/IconPencil.svg" width={14} height={14} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontFamily: geist, fontWeight: 500, lineHeight: '14px', letterSpacing: '-0.02em', color: '#171717' }}>Edit</span>
            </BorderBtn>
          </div>

          <div style={{ width: 1, height: 16, background: 'oklch(0 0 0 / 0.1)', flexShrink: 0, margin: '0 4px' }} />

      {/* Ask AI + Optimise */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

      {/* Ask AI */}
      <BorderBtn onClick={() => { setLockedWidth(innerRef.current?.offsetWidth ?? null); setIsAskingAI(true) }}>
        <div style={{ filter: 'blur(0.8px)', flexShrink: 0, position: 'relative' }}>
        <div style={{ width: 14, height: 14, borderRadius: 9999, overflow: 'hidden', clipPath: 'circle(50% at 50% 50%)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, animation: 'orbHue 6s linear infinite' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: 'radial-gradient(ellipse 33% 40% at 100% 33%, white 0%, transparent 100%), radial-gradient(ellipse 57% 57% at 20% 15%, #67E8F9 0%, transparent 100%), radial-gradient(ellipse 60% 60% at 70% 50%, #A78BFA 0%, #6366F1 100%)', animation: 'orbBase 30s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: 'radial-gradient(ellipse 50% 50% at 75% 25%, #F472B6 0%, transparent 100%)', animation: 'orbYellow 25s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: 'radial-gradient(ellipse 57% 55% at 53% 43%, transparent 62%, transparent 80%, white 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: 'radial-gradient(ellipse 60% 60% at 20% 80%, #7C3AED 0%, transparent 100%)', opacity: 0.8, animation: 'orbBlue 38s linear infinite' }} />
          </div>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, backdropFilter: 'blur(1.5px)', WebkitBackdropFilter: 'blur(1.5px)' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='80' height='80' filter='url(%23n)'/></svg>")`, backgroundSize: '80px 80px', mixBlendMode: 'overlay', opacity: 0.25 }} />
        </div>
        <div style={{ position: 'absolute', inset: -2, backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='80' height='80' filter='url(%23n)'/></svg>")`, backgroundSize: '20px 20px', mixBlendMode: 'overlay', opacity: 0.15, pointerEvents: 'none' }} />
        </div>
        <span style={{ fontSize: 14, fontFamily: geist, fontWeight: 500, lineHeight: '14px', letterSpacing: '-0.02em', color: '#171717' }}>Ask AI</span>
      </BorderBtn>

      {/* Optimise / Undo — primary, far right */}
      {isApplied ? (
        <PrimaryBtn onClick={() => phraseId && onUndo(phraseId)}>
          <img src="/icons/IconArrowUndoUp.svg" width={14} height={14} style={{ flexShrink: 0, filter: 'invert(1)', opacity: 0.64 }} />
          <span style={{ fontSize: 14, fontFamily: geist, fontWeight: 500, lineHeight: '14px', color: '#FDFDFD' }}>Undo</span>
        </PrimaryBtn>
      ) : (
        <PrimaryBtn onClick={() => phraseId && onApply(phraseId)}>
          <img src="/icons/IconZap.svg" width={14} height={14} style={{ flexShrink: 0, filter: 'invert(1)', opacity: 0.64 }} />
          <span style={{ fontSize: 14, fontFamily: geist, fontWeight: 500, lineHeight: '14px', color: '#FDFDFD' }}>Optimise</span>
        </PrimaryBtn>
      )}

      </div>{/* end Ask AI + Optimise */}

        </> /* end normal mode */
      )}

      </div>{/* end toolbar content */}
    </div>
  )
})

// ── Burst ──────────────────────────────────────────────────────────────────
const BURST_PARTICLES = [
  { angle: -90, dist: 52, size: 6,  round: '50%', delay: 0,  color: 'oklch(0.55 0.22 145)' },
  { angle: -65, dist: 44, size: 4,  round: '3px', delay: 25, color: 'oklch(0.75 0.18 125)' },
  { angle: -45, dist: 58, size: 7,  round: '50%', delay: 10, color: 'oklch(0.65 0.20 155)' },
  { angle: -20, dist: 46, size: 4,  round: '3px', delay: 40, color: 'oklch(0.82 0.16 105)' },
  { angle:   0, dist: 54, size: 6,  round: '50%', delay: 15, color: 'oklch(0.55 0.22 145)' },
  { angle:  25, dist: 42, size: 4,  round: '3px', delay: 50, color: 'oklch(0.70 0.20 135)' },
  { angle:  50, dist: 56, size: 6,  round: '50%', delay: 5,  color: 'oklch(0.82 0.16 105)' },
  { angle: -115,dist: 48, size: 4,  round: '3px', delay: 35, color: 'oklch(0.65 0.20 155)' },
  { angle: -140,dist: 52, size: 6,  round: '50%', delay: 20, color: 'oklch(0.70 0.20 135)' },
]

function Burst({ x, y }: { x: number; y: number }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, pointerEvents: 'none', zIndex: 999 }}>
      {BURST_PARTICLES.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180
        const tx  = Math.round(Math.cos(rad) * p.dist)
        const ty  = Math.round(Math.sin(rad) * p.dist)
        const kf  = `burst_${i}_${Math.abs(tx)}_${Math.abs(ty)}`
        return (
          <div key={i}>
            <style>{`
              @keyframes ${kf} {
                0%   { transform: translate(-50%,-50%) translate(0px,0px) scale(1);   opacity: 1; }
                75%  { opacity: 1; }
                100% { transform: translate(-50%,-50%) translate(${tx}px,${ty}px) scale(0.2); opacity: 0; }
              }
            `}</style>
            <div style={{
              position: 'absolute',
              width: p.size, height: p.size,
              borderRadius: p.round,
              background: p.color,
              transform: 'translate(-50%,-50%)',
              animation: `${kf} 680ms cubic-bezier(0.2,0.8,0.3,1) ${p.delay}ms both`,
            }} />
          </div>
        )
      })}
    </div>
  )
}

// ── Phrase span ─────────────────────────────────────────────────────────────
function PhraseSpan({ highlighted, isReplacing, isApplied, isAIThinking, typing, onEnter, onLeave }: {
  highlighted: boolean
  isReplacing: boolean
  isApplied: boolean
  isAIThinking?: boolean
  typing: string
  onEnter: (el: HTMLElement) => void
  onLeave: () => void
}) {
  const bg = isAIThinking
    ? 'oklch(0.92 0.01 280 / 0.15)'
    : isApplied
    ? 'oklch(0.93 0.08 145 / 0.18)'
    : highlighted || isReplacing
    ? 'oklch(0.95 0.08 70 / 0.18)'
    : 'transparent'

  const color = isAIThinking
    ? 'transparent'
    : isApplied
    ? 'oklch(0.45 0.14 145)'
    : highlighted || isReplacing
    ? 'oklch(0.52 0.14 60)'
    : '#1d1d1f'

  return (
    <span
      onMouseEnter={(highlighted || isApplied) ? (e) => onEnter(e.currentTarget) : undefined}
      onMouseLeave={(highlighted || isApplied) ? onLeave : undefined}
      style={{
        background: isAIThinking
          ? 'linear-gradient(90deg, oklch(0.55 0 0) 0%, oklch(0.7 0 0) 35%, oklch(0.85 0.03 280) 50%, oklch(0.7 0 0) 65%, oklch(0.55 0 0) 100%)'
          : bg,
        backgroundSize: isAIThinking ? '200% 100%' : undefined,
        animation: isAIThinking ? 'textShimmer 2.5s ease-in-out infinite' : undefined,
        WebkitBackgroundClip: isAIThinking ? 'text' : undefined,
        WebkitTextFillColor: isAIThinking ? 'transparent' : undefined,
        WebkitBoxDecorationBreak: 'clone',
        boxDecorationBreak: 'clone' as any,
        borderRadius: 3,
        color,
        transition: 'background 0.5s cubic-bezier(0.16,1,0.3,1), color 0.5s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {typing}{isReplacing && <span style={{ display: 'inline-block', width: 1.5, height: 12, background: 'oklch(0.52 0.14 60)', verticalAlign: 'middle', marginLeft: 1, borderRadius: 1, animation: 'cursorBlink 0.5s step-end infinite' }} />}
    </span>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function Page() {
  const [charCount,   setCharCount]   = useState(0)
  const [showCursor,  setShowCursor]  = useState(false)
  const [highlighted,   setHighlighted]   = useState<Set<string>>(new Set())
  const contentRef    = useRef<HTMLDivElement>(null)
  const [topPad, setTopPad] = useState(() =>
    typeof window !== 'undefined' ? Math.round(window.innerHeight / 2) : 400
  )
  const [applied,      setApplied]      = useState<Set<string>>(new Set())
  const [replaceCount, setReplaceCount] = useState<Map<string, number>>(new Map())
  const [customTexts,  setCustomTexts]  = useState<Map<string, string>>(new Map())
  const [bursts,       setBursts]       = useState<Array<{ key: number; x: number; y: number }>>([])
  const burstKey = useRef(0)
  const [toolbarPos,    setToolbarPos]    = useState<{ x: number; y: number } | null>(null)
  const [toolbarVis,    setToolbarVis]    = useState(false)
  const [activePhraseId, setActivePhraseId] = useState<string | null>(null)
  const [toolbarEditing, setToolbarEditing] = useState(false)
  const [toolbarAskAI, setToolbarAskAI] = useState(false)
  const [aiThinkingId, setAiThinkingId] = useState<string | null>(null)
  const [aiThinkingMsg, setAiThinkingMsg] = useState('')
  const [aiRevealId, setAiRevealId] = useState<string | null>(null)
  const [aiRevealCount, setAiRevealCount] = useState(0)
  const [scores, setScores] = useState<Map<string, number>>(new Map())

  const containerRef  = useRef<HTMLDivElement>(null)
  const hideTimer     = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setTopPad(Math.max(48, Math.round((window.innerHeight - el.offsetHeight) / 2)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const showToolbar = (el: HTMLElement, phraseId: string) => {
    if (toolbarEditingRef.current || toolbarAskAIRef.current || aiThinkingRef.current || aiRevealRef.current) return
    if (hideTimer.current) clearTimeout(hideTimer.current)
    const container = containerRef.current
    if (!container) return
    const cRect = container.getBoundingClientRect()
    const rects = el.getClientRects()
    const first = rects[0] ?? el.getBoundingClientRect()
    setToolbarPos({
      x: first.left - cRect.left + first.width / 2,
      y: first.top  - cRect.top,
    })
    setActivePhraseId(phraseId)
    setToolbarVis(true)
  }

  const toolbarEditingRef = useRef(false)
  const toolbarAskAIRef = useRef(false)
  const aiThinkingRef = useRef(false)
  const aiRevealRef = useRef(false)
  useEffect(() => { toolbarEditingRef.current = toolbarEditing }, [toolbarEditing])
  useEffect(() => { toolbarAskAIRef.current = toolbarAskAI }, [toolbarAskAI])
  useEffect(() => { aiThinkingRef.current = !!aiThinkingId }, [aiThinkingId])
  useEffect(() => { aiRevealRef.current = !!aiRevealId }, [aiRevealId])

  const scheduleHide = () => {
    if (toolbarEditingRef.current || toolbarAskAIRef.current || aiThinkingRef.current || aiRevealRef.current) return
    hideTimer.current = setTimeout(() => setToolbarVis(false), 120)
  }

  const cancelHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }

  const toolbarNodeRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!toolbarEditing && !toolbarAskAI) return
    const handler = (e: MouseEvent) => {
      if (toolbarNodeRef.current && !toolbarNodeRef.current.contains(e.target as Node)) {
        setToolbarEditing(false)
        setToolbarAskAI(false)
        setToolbarVis(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [toolbarEditing, toolbarAskAI])

  useEffect(() => {
    let raf: number | null = null
    let startTime: number | null = null
    let triggered = false
    const MS_PER_CHAR = 18

    const tick = (now: number) => {
      if (startTime === null) startTime = now
      const target = Math.min(TOTAL, Math.floor((now - startTime) / MS_PER_CHAR))
      setCharCount(target)

      if (target >= TOTAL && !triggered) {
        triggered = true
        setTimeout(() => setShowCursor(false), 300)
        PHRASE_ORDER.forEach((id, i) => {
          setTimeout(() => {
            setHighlighted(prev => { const n = new Set(prev); n.add(id); return n })
          }, 500 + i * HIGHLIGHT_DELAY)
        })
        return
      }

      raf = requestAnimationFrame(tick)
    }

    const t0 = setTimeout(() => setShowCursor(true), 300)
    const t1 = setTimeout(() => { raf = requestAnimationFrame(tick) }, 400)

    return () => {
      clearTimeout(t0)
      clearTimeout(t1)
      if (raf) cancelAnimationFrame(raf)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  const done = charCount >= TOTAL

  return (
    <main style={{
      minHeight: '100vh', background: 'oklch(0.999 0 0)',
      fontSize: 15, fontFamily: font, fontWeight: 500,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      paddingTop: topPad, paddingBottom: 48,
      transition: 'padding-top 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)',
    }}>
      <style>{`
        @keyframes cursorBlink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes orbBase   { from { transform: rotate(0deg);    } to { transform: rotate(360deg);  } }
        @keyframes orbYellow { from { transform: rotate(0deg);    } to { transform: rotate(360deg);  } }
        @keyframes orbBlue   { from { transform: rotate(0deg);    } to { transform: rotate(-360deg); } }
        @keyframes orbHue    { from { filter: hue-rotate(0deg);   } to { filter: hue-rotate(360deg); } }
        @keyframes dropIn    { from { opacity:0; transform:translateY(-6px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes editIn    { from { opacity:0; transform:translateX(-6px); } to { opacity:1; transform:translateX(0); } }
        @keyframes shimmer   { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes orbPulse  { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.25); opacity: 0.85; } }
        @keyframes textShimmer {
          0%   { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        @property --glow-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes glowSpin {
          from { --glow-angle: 0deg; }
          to   { --glow-angle: 360deg; }
        }
        .toolbar-glow {
          animation: glowSpin 3s linear infinite;
        }
      `}</style>
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id="orb-noise" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" result="noise"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.18 0" in="noise" result="softNoise"/>
            <feBlend in="SourceGraphic" in2="softNoise" mode="soft-light"/>
          </filter>
        </defs>
      </svg>

      <div ref={contentRef} style={{ width: 576 }}>


        {/* Text block */}
        <div ref={containerRef} style={{ position: 'relative' }}>
          {bursts.map(b => <Burst key={b.key} x={b.x} y={b.y} />)}


          {toolbarPos && (
            <Toolbar
              ref={toolbarNodeRef}
              x={toolbarPos.x}
              y={toolbarPos.y}
              visible={toolbarVis}
              phraseId={activePhraseId}
              onEnter={cancelHide}
              onLeave={scheduleHide}
              isEditing={toolbarEditing}
              setIsEditing={setToolbarEditing}
              isAskingAI={toolbarAskAI}
              setIsAskingAI={setToolbarAskAI}
              applied={(() => { const s = new Set(applied); customTexts.forEach((_, k) => s.add(k)); return s })()}
              onApply={id => {
                const suggestion = OPTIMIZATIONS[id]?.suggestion ?? ''
                let count = 0
                const tick = () => {
                  count++
                  setReplaceCount(prev => { const n = new Map(prev); n.set(id, count); return n })
                  if (count < suggestion.length) {
                    setTimeout(tick, 32)
                  } else {
                    setTimeout(() => {
                      setApplied(prev => { const n = new Set(prev); n.add(id); return n })
                      setReplaceCount(prev => { const n = new Map(prev); n.delete(id); return n })
                      setScores(prev => { const n = new Map(prev); n.set(id, Math.floor(Math.random() * 15) + 82); return n })
                      if (toolbarPos) {
                        const k = ++burstKey.current
                        setBursts(prev => [...prev, { key: k, x: toolbarPos.x, y: toolbarPos.y + 10 }])
                        setTimeout(() => setBursts(prev => prev.filter(b => b.key !== k)), 900)
                      }
                    }, 120)
                  }
                }
                tick()
              }}
              onEditConfirm={(id, text) => {
                setCustomTexts(prev => { const n = new Map(prev); n.set(id, text); return n })
                setApplied(prev => { const n = new Set(prev); n.delete(id); return n })
                setScores(prev => { const n = new Map(prev); n.set(id, Math.floor(Math.random() * 25) + 60); return n })
                if (toolbarPos) {
                  const k = ++burstKey.current
                  setBursts(prev => [...prev, { key: k, x: toolbarPos.x, y: toolbarPos.y + 10 }])
                  setTimeout(() => setBursts(prev => prev.filter(b => b.key !== k)), 900)
                }
              }}
              currentText={
                activePhraseId
                  ? (customTexts.get(activePhraseId) ?? (applied.has(activePhraseId) ? (OPTIMIZATIONS[activePhraseId]?.suggestion ?? PHRASES[activePhraseId]) : PHRASES[activePhraseId]))
                  : ''
              }
              onUndo={id => {
                setApplied(prev => { const n = new Set(prev); n.delete(id); return n })
                setCustomTexts(prev => { const n = new Map(prev); n.delete(id); return n })
                setReplaceCount(prev => { const n = new Map(prev); n.delete(id); return n })
                setScores(prev => { const n = new Map(prev); n.delete(id); return n })
              }}
              aiThinkingMsg={aiThinkingMsg}
              score={activePhraseId ? (scores.get(activePhraseId) ?? null) : null}
              onAskAI={(id, _prompt, model) => {
                setToolbarAskAI(false)
                setAiThinkingId(id)

                const THINKING_MSGS = ['Analyzing...', 'Rewriting...', 'Polishing...']
                let msgIdx = 0
                setAiThinkingMsg(THINKING_MSGS[0])
                const msgInterval = setInterval(() => {
                  msgIdx = (msgIdx + 1) % THINKING_MSGS.length
                  setAiThinkingMsg(THINKING_MSGS[msgIdx])
                }, 2000)

                // Pick a response from the model's pool, avoid repeating current text
                const currentVal = customTexts.get(id) ?? (applied.has(id) ? (OPTIMIZATIONS[id]?.suggestion ?? PHRASES[id]) : PHRASES[id])
                const pool = AI_RESPONSES[id]?.[model] ?? AI_RESPONSES[id]?.ChatGPT ?? [OPTIMIZATIONS[id]?.suggestion ?? currentVal]
                const candidates = pool.filter(t => t !== currentVal)
                const newText = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : pool[Math.floor(Math.random() * pool.length)]
                setTimeout(() => {
                  clearInterval(msgInterval)
                  setAiThinkingId(null)
                  setAiThinkingMsg('')

                  // Reveal new text char by char
                  setAiRevealId(id)
                  let count = 0
                  const revealTick = () => {
                    count++
                    setAiRevealCount(count)
                    if (count < newText.length) {
                      setTimeout(revealTick, 55)
                    } else {
                      setTimeout(() => {
                        setAiRevealId(null)
                        setAiRevealCount(0)
                        setCustomTexts(prev => { const n = new Map(prev); n.set(id, newText); return n })
                        setApplied(prev => { const n = new Set(prev); n.delete(id); return n })
                        setScores(prev => { const n = new Map(prev); n.set(id, Math.floor(Math.random() * 20) + 75); return n })
                        if (toolbarPos) {
                          const k = ++burstKey.current
                          setBursts(prev => [...prev, { key: k, x: toolbarPos.x, y: toolbarPos.y + 10 }])
                          setTimeout(() => setBursts(prev => prev.filter(b => b.key !== k)), 900)
                        }
                      }, 100)
                    }
                  }
                  revealTick()
                }, 5000)
              }}
            />
          )}

          {(['p1', 'p2'] as const).map(para => {
            const breakIdx = SEGS.findIndex(s => s.break)
            const segs = SEGS.filter(s =>
              para === 'p1'
                ? !s.break && (breakIdx === -1 || SEGS.indexOf(s) < breakIdx)
                : breakIdx !== -1 && SEGS.indexOf(s) > breakIdx
            )
            const lastSeg = segs[segs.length - 1]
            const paraVisible = segs.some(s => charCount > s.start)
            if (!paraVisible) return null

            return (
              <p key={para} style={{
                fontFamily: font, fontSize: 15, fontWeight: 500, lineHeight: '23px', color: '#1d1d1f',
                margin: para === 'p2' ? '20px 0 0' : '0', textAlign: 'center', letterSpacing: '-0.01em',
              }}>
                {segs.map((seg, i) => {
                  const chars = Math.max(0, Math.min(seg.text.length, charCount - seg.start))
                  if (chars === 0) return null

                  if (seg.phraseId) {
                    const id = seg.phraseId
                    return (
                      <PhraseSpan
                        key={id}
                        highlighted={highlighted.has(id) && !applied.has(id) && !customTexts.has(id) && !replaceCount.has(id)}
                        isReplacing={replaceCount.has(id) || aiRevealId === id}
                        isApplied={applied.has(id) || customTexts.has(id)}
                        isAIThinking={aiThinkingId === id}
                        typing={
                          aiRevealId === id
                            ? (OPTIMIZATIONS[id]?.suggestion ?? seg.text).slice(0, aiRevealCount)
                            : aiThinkingId === id
                            ? (customTexts.get(id) ?? (applied.has(id) ? (OPTIMIZATIONS[id]?.suggestion ?? seg.text) : seg.text.slice(0, chars)))
                            : customTexts.has(id)
                            ? customTexts.get(id)!
                            : applied.has(id)
                            ? (OPTIMIZATIONS[id]?.suggestion ?? seg.text)
                            : replaceCount.has(id)
                            ? (OPTIMIZATIONS[id]?.suggestion ?? seg.text).slice(0, replaceCount.get(id)!)
                            : seg.text.slice(0, chars)
                        }
                        onEnter={el => showToolbar(el, id)}
                        onLeave={scheduleHide}
                      />
                    )
                  }
                  return <span key={i}>{seg.text.slice(0, chars)}</span>
                })}

                {showCursor && !done && lastSeg && charCount > lastSeg.start && charCount <= lastSeg.end && (
                  <span style={{
                    display: 'inline-block', width: 1.5, height: 13,
                    background: 'oklch(0.145 0 0 / 0.45)', verticalAlign: 'middle',
                    marginLeft: 1, borderRadius: 1,
                    animation: 'cursorBlink 0.55s step-end infinite',
                  }} />
                )}
              </p>
            )
          })}
        </div>

      </div>
    </main>
  )
}
