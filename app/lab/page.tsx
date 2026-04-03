'use client'

const sections = [
  {
    title: 'Interactions',
    items: [
      { name: 'Progressive blur on scroll', date: '03/11', href: '/lab/progressive-blur' },
      { name: 'Tag Dropdown', date: '03/11', href: '/lab/dropdown' },
      { name: 'Embossed Card', date: '03/11', href: '#' },
    ],
  },
]

export default function LabPage() {
  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '550px', margin: '0 auto' }}>

        {sections.map((section, si) => (
          <div key={si} style={{ marginBottom: '40px' }}>

            {/* Items */}
            <div className="group/list">
              {section.items.map((item, ii) => (
                <a
                  key={ii}
                  href={item.href}
                  className="group/item flex items-baseline group-hover/list:opacity-40 hover:!opacity-100 transition-opacity duration-200"
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '72px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    borderBottom: '0.4px solid var(--border)',
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400, flexShrink: 0, letterSpacing: '-0.01em' }}>
                    {item.date}
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, letterSpacing: '-0.02em' }}>
                    {item.name}
                  </span>
                </a>
              ))}
            </div>

          </div>
        ))}

      </div>
    </main>
  )
}
