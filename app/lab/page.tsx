'use client'

const items = [
  { name: 'File Upload Dropzone', href: '/lab/file-upload' },
  { name: 'Toggle Switch', href: '/lab/toggle-switch' },
  { name: 'Range Slider', href: '/lab/range-slider' },
  { name: 'Split View', href: '/lab/split-view' },
  { name: 'Action Button', href: '/lab/action-button' },
  { name: 'Date Picker', href: '/lab/date-picker' },
  { name: 'Color Picker', href: '/lab/color-picker' },
  { name: 'OTP Input', href: '/lab/otp-input' },
  { name: 'Hover Card', href: '/lab/hover-card' },
  { name: 'Rich Text Editor', href: '/lab/rich-text-editor' },
  { name: 'Tooltip', href: '/lab/tooltip' },
  { name: 'Segmented Control', href: '/lab/segmented-control' },
  { name: 'Accordion', href: '/lab/accordion' },
  { name: 'Number Scrubber', href: '/lab/number-scrubber' },
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
