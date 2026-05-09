'use client'

import Link from 'next/link'

const font = 'Geist, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif'

const experiments = [
  { label: 'Labels dropdown', href: '/canvas/labels-dropdown' },
  { label: 'Hallucination',   href: '/canvas/hallucination' },
  { label: 'Toasts',          href: '/canvas/toasts' },
  { label: 'Orb',             href: '/canvas/orb' },
  { label: 'Cmdk',            href: '/canvas/cmdk' },
]

export default function CanvasIndex() {
  return (
    <main style={{ minHeight: '100vh', background: '#FDFDFD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {experiments.map(({ label, href }) => (
          <Link key={href} href={href} style={{
            height: 30, paddingLeft: 12, paddingRight: 12,
            background: '#fff',
            boxShadow: '0px 1px 2px -1px rgba(23,23,23,0.08), 0px 1px 3px rgba(23,23,23,0.08), 0px 0px 0px 1px rgba(23,23,23,0.06)',
            borderRadius: 9,
            display: 'flex', alignItems: 'center',
            color: '#171717', fontSize: 12, fontFamily: font, fontWeight: 500,
            textDecoration: 'none',
          }}>
            {label}
          </Link>
        ))}
      </div>
    </main>
  )
}
