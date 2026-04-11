'use client'

const items = [
  { name: 'Bottom Sheet', href: '/lab/bottom-sheet' },
  { name: 'Draggable List', href: '/lab/draggable-list' },
  { name: 'Context Menu', href: '/lab/context-menu' },
  { name: 'Tab Switcher', href: '/lab/tab-switcher' },
  { name: 'Tag Input', href: '/lab/tag-input' },
  { name: 'Multi-Step Form', href: '/lab/multi-step-form' },
  { name: 'Command Palette', href: '/lab/command-palette' },
  { name: 'Toast Notification Stack', href: '/lab/toast-stack' },
  { name: 'Progressive Blur', href: '/lab/progressive-blur' },
  { name: 'Dropdown', href: '/lab/dropdown' },
]

export default function LabPage() {
  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', maxWidth: '320px' }}>
        {items.map(item => (
          <a
            key={item.href}
            href={item.href}
            style={{
              display: 'block',
              padding: '10px 12px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '-0.01em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover-bg, rgba(10,10,10,0.05))')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {item.name}
          </a>
        ))}
      </div>
    </main>
  )
}
