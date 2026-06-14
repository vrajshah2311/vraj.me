'use client'

import { useState, useRef } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AvatarPerson {
  name: string
  color: string
}

// ─── Single Avatar ─────────────────────────────────────────────────────────────

function Avatar({
  person,
  size = 32,
  style: extraStyle,
}: {
  person: AvatarPerson
  size?: number
  style?: React.CSSProperties
}) {
  const [showTip, setShowTip] = useState(false)
  const initials = person.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div
      style={{ position: 'relative', ...extraStyle }}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: person.color,
          border: '2px solid #fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'default',
          boxSizing: 'border-box',
          boxShadow: '0 0 0 1px rgba(10,10,10,0.06)',
          flexShrink: 0,
        }}
      >
        <span style={{
          fontSize: size * 0.34,
          fontWeight: 600,
          color: '#fff',
          letterSpacing: '-0.02em',
          fontFamily: FONT,
          lineHeight: 1,
          userSelect: 'none',
        }}>
          {initials}
        </span>
      </div>

      {/* Name tooltip */}
      <div style={{
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: `translateX(-50%) translateY(${showTip ? -6 : -2}px)`,
        background: '#0a0a0a',
        color: '#fff',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '-0.01em',
        fontFamily: FONT,
        whiteSpace: 'nowrap',
        padding: '4px 8px',
        borderRadius: '6px',
        pointerEvents: 'none',
        opacity: showTip ? 1 : 0,
        transition: 'opacity 120ms ease, transform 120ms ease',
        zIndex: 100,
        marginBottom: '2px',
      }}>
        {person.name}
      </div>
    </div>
  )
}

// ─── Avatar Stack ──────────────────────────────────────────────────────────────

function AvatarStack({
  people,
  maxVisible = 4,
  size = 32,
}: {
  people: AvatarPerson[]
  maxVisible?: number
  size?: number
}) {
  const [hovered, setHovered] = useState(false)
  const overflowCount = Math.max(0, people.length - maxVisible)
  const visible = people.slice(0, maxVisible)
  const hidden = people.slice(maxVisible)
  const [showOverflowTip, setShowOverflowTip] = useState(false)

  // Gap between avatars: collapsed = negative overlap, expanded = small positive gap
  const collapsedOffset = -(size * 0.3)
  const expandedOffset = 6

  return (
    <div
      style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {visible.map((person, i) => (
        <Avatar
          key={person.name}
          person={person}
          size={size}
          style={{
            marginLeft: i === 0 ? 0 : hovered ? expandedOffset : collapsedOffset,
            transition: 'margin-left 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: visible.length - i,
          }}
        />
      ))}

      {overflowCount > 0 && (
        <div
          style={{
            marginLeft: hovered ? expandedOffset : collapsedOffset,
            transition: 'margin-left 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: 0,
            position: 'relative',
          }}
          onMouseEnter={() => setShowOverflowTip(true)}
          onMouseLeave={() => setShowOverflowTip(false)}
        >
          <div style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: 'rgba(10,10,10,0.06)',
            border: '2px solid #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'default',
            boxSizing: 'border-box',
            boxShadow: '0 0 0 1px rgba(10,10,10,0.06)',
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: size * 0.3,
              fontWeight: 600,
              color: 'rgba(10,10,10,0.5)',
              letterSpacing: '-0.02em',
              fontFamily: FONT,
              lineHeight: 1,
              userSelect: 'none',
            }}>
              +{overflowCount}
            </span>
          </div>

          {/* Overflow names tooltip */}
          <div style={{
            position: 'absolute',
            bottom: '100%',
            right: 0,
            transform: `translateY(${showOverflowTip ? -6 : -2}px)`,
            background: '#0a0a0a',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            fontFamily: FONT,
            whiteSpace: 'nowrap',
            padding: '6px 10px',
            borderRadius: '8px',
            pointerEvents: 'none',
            opacity: showOverflowTip ? 1 : 0,
            transition: 'opacity 120ms ease, transform 120ms ease',
            zIndex: 100,
            marginBottom: '2px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }}>
            {hidden.map(p => (
              <span key={p.name}>{p.name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Demo ──────────────────────────────────────────────────────────────────────

const TEAM_A: AvatarPerson[] = [
  { name: 'Priya Sharma',   color: '#7c6ef2' },
  { name: 'James Liu',      color: '#0ea5e9' },
  { name: 'Sofia Martínez', color: '#f59e0b' },
  { name: 'Ethan Park',     color: '#10b981' },
  { name: 'Aisha Johnson',  color: '#ef4444' },
  { name: 'Noah Williams',  color: '#8b5cf6' },
]

const TEAM_B: AvatarPerson[] = [
  { name: 'Lena Fischer',   color: '#06b6d4' },
  { name: 'Marcus Brown',   color: '#f97316' },
  { name: 'Yuki Tanaka',    color: '#ec4899' },
  { name: 'Carlos Reyes',   color: '#3b82f6' },
  { name: 'Amara Diallo',   color: '#14b8a6' },
  { name: 'Ivan Petrov',    color: '#a855f7' },
  { name: 'Sara Lindqvist', color: '#eab308' },
  { name: 'Omar Hassan',    color: '#22c55e' },
]

const REVIEWERS: AvatarPerson[] = [
  { name: 'Alex Chen',     color: '#6366f1' },
  { name: 'Maya Patel',    color: '#f43f5e' },
  { name: 'Tom Nguyen',    color: '#0284c7' },
]

function DemoCard({
  label,
  sublabel,
  people,
  maxVisible,
  size,
}: {
  label: string
  sublabel: string
  people: AvatarPerson[]
  maxVisible?: number
  size?: number
}) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(10,10,10,0.08)',
      borderRadius: '16px',
      padding: '20px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      width: '320px',
      maxWidth: '100%',
    }}>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em', fontFamily: FONT, lineHeight: '18px' }}>
          {label}
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.4)', marginTop: '2px', letterSpacing: '-0.01em', fontFamily: FONT }}>
          {sublabel}
        </div>
      </div>
      <AvatarStack people={people} maxVisible={maxVisible} size={size} />
    </div>
  )
}

function AvatarStackDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
      <DemoCard
        label="Design Team"
        sublabel="6 members · hover to expand"
        people={TEAM_A}
        maxVisible={4}
        size={32}
      />
      <DemoCard
        label="Contributors"
        sublabel="8 members · overflow tooltip"
        people={TEAM_B}
        maxVisible={5}
        size={32}
      />
      <DemoCard
        label="Reviewers"
        sublabel="3 members · no overflow"
        people={REVIEWERS}
        maxVisible={5}
        size={36}
      />
    </div>
  )
}

// ─── Source code string ────────────────────────────────────────────────────────

const CODE = `'use client'

import { useState } from 'react'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

interface AvatarPerson {
  name: string
  color: string
}

function Avatar({ person, size = 32, style: extraStyle }: {
  person: AvatarPerson
  size?: number
  style?: React.CSSProperties
}) {
  const [showTip, setShowTip] = useState(false)
  const initials = person.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div
      style={{ position: 'relative', ...extraStyle }}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: person.color,
        border: '2px solid #fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'default', boxSizing: 'border-box',
        boxShadow: '0 0 0 1px rgba(10,10,10,0.06)', flexShrink: 0,
      }}>
        <span style={{
          fontSize: size * 0.34, fontWeight: 600, color: '#fff',
          letterSpacing: '-0.02em', fontFamily: FONT, lineHeight: 1, userSelect: 'none',
        }}>
          {initials}
        </span>
      </div>

      <div style={{
        position: 'absolute', bottom: '100%', left: '50%',
        transform: \`translateX(-50%) translateY(\${showTip ? -6 : -2}px)\`,
        background: '#0a0a0a', color: '#fff',
        fontSize: '11px', fontWeight: 500, letterSpacing: '-0.01em',
        fontFamily: FONT, whiteSpace: 'nowrap', padding: '4px 8px',
        borderRadius: '6px', pointerEvents: 'none',
        opacity: showTip ? 1 : 0,
        transition: 'opacity 120ms ease, transform 120ms ease',
        zIndex: 100, marginBottom: '2px',
      }}>
        {person.name}
      </div>
    </div>
  )
}

export function AvatarStack({
  people,
  maxVisible = 4,
  size = 32,
}: {
  people: AvatarPerson[]
  maxVisible?: number
  size?: number
}) {
  const [hovered, setHovered] = useState(false)
  const [showOverflowTip, setShowOverflowTip] = useState(false)
  const overflowCount = Math.max(0, people.length - maxVisible)
  const visible = people.slice(0, maxVisible)
  const hidden = people.slice(maxVisible)

  const collapsedOffset = -(size * 0.3)
  const expandedOffset = 6

  return (
    <div
      style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {visible.map((person, i) => (
        <Avatar
          key={person.name}
          person={person}
          size={size}
          style={{
            marginLeft: i === 0 ? 0 : hovered ? expandedOffset : collapsedOffset,
            transition: 'margin-left 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: visible.length - i,
          }}
        />
      ))}

      {overflowCount > 0 && (
        <div
          style={{
            marginLeft: hovered ? expandedOffset : collapsedOffset,
            transition: 'margin-left 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: 0, position: 'relative',
          }}
          onMouseEnter={() => setShowOverflowTip(true)}
          onMouseLeave={() => setShowOverflowTip(false)}
        >
          <div style={{
            width: size, height: size, borderRadius: '50%',
            background: 'rgba(10,10,10,0.06)',
            border: '2px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'default', boxSizing: 'border-box',
            boxShadow: '0 0 0 1px rgba(10,10,10,0.06)', flexShrink: 0,
          }}>
            <span style={{
              fontSize: size * 0.3, fontWeight: 600, color: 'rgba(10,10,10,0.5)',
              letterSpacing: '-0.02em', fontFamily: FONT, lineHeight: 1, userSelect: 'none',
            }}>
              +{overflowCount}
            </span>
          </div>

          <div style={{
            position: 'absolute', bottom: '100%', right: 0,
            transform: \`translateY(\${showOverflowTip ? -6 : -2}px)\`,
            background: '#0a0a0a', color: '#fff',
            fontSize: '11px', fontWeight: 500, letterSpacing: '-0.01em',
            fontFamily: FONT, whiteSpace: 'nowrap', padding: '6px 10px',
            borderRadius: '8px', pointerEvents: 'none',
            opacity: showOverflowTip ? 1 : 0,
            transition: 'opacity 120ms ease, transform 120ms ease',
            zIndex: 100, marginBottom: '2px',
            display: 'flex', flexDirection: 'column', gap: '3px',
          }}>
            {hidden.map(p => <span key={p.name}>{p.name}</span>)}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Usage ──────────────────────────────────────────────────────────────────────
//
// const people = [
//   { name: 'Alice Kim',   color: '#7c6ef2' },
//   { name: 'Bob Tremblay', color: '#0ea5e9' },
//   { name: 'Clara Ng',    color: '#f59e0b' },
//   { name: 'David Osei',  color: '#10b981' },
//   { name: 'Ema Rossi',   color: '#ef4444' },
// ]
//
// <AvatarStack people={people} />                  // 4 visible, rest in +N
// <AvatarStack people={people} maxVisible={3} />   // 3 visible
// <AvatarStack people={people} size={40} />        // larger avatars`

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AvatarStackPage() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: FONT }}>

      {/* ── Demo ── */}
      <section style={{
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #F0F1F4, #E8EAF0)',
        padding: '60px 24px',
        gap: '32px',
      }}>
        <AvatarStackDemo />
        <p style={{
          margin: 0,
          fontSize: '11px',
          fontWeight: 500,
          color: 'rgba(10,10,10,0.35)',
          letterSpacing: '-0.01em',
          fontFamily: FONT,
        }}>
          Hover a stack to expand · hover avatars or +N for names
        </p>
      </section>

      {/* ── Code block ── */}
      <section style={{ padding: '48px 24px 64px', maxWidth: '760px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          color: 'rgba(10,10,10,0.4)',
          marginBottom: '12px',
          fontFamily: FONT,
        }}>
          Source
        </p>
        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
          <pre style={{
            margin: 0,
            fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, monospace',
            fontSize: '12px',
            lineHeight: '1.65',
            color: '#e5e5e5',
            whiteSpace: 'pre',
            overflowX: 'auto',
          }}>
            {CODE}
          </pre>
        </div>
      </section>

    </main>
  )
}
