const articles: { title: string; date: string; href: string }[] = [
  { title: 'Every animation is a promise you have to keep', date: '04/20', href: '/thoughts/every-animation-is-a-promise-you-have-to-keep' },
  { title: 'Padding is where you confess your taste', date: '04/17', href: '/thoughts/padding-is-where-you-confess-your-taste' },
  { title: 'Real content always breaks the mockup', date: '04/16', href: '/thoughts/real-content-always-breaks-the-mockup' },
  { title: 'The hover state is where design gets honest', date: '04/13', href: '/thoughts/the-hover-state-is-where-design-gets-honest' },
  { title: 'Most layouts need less, not more', date: '04/09', href: '/thoughts/most-layouts-need-less-not-more' },
  {
    title: 'we spent three hours arguing about a modal',
    date: '04/04',
    href: '/thoughts/we-spent-three-hours-arguing-about-a-modal',
  },
]

export default function ThoughtsPage() {
  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '550px', margin: '0 auto' }}>

        {articles.length === 0 ? (
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '-0.01em' }}>
            Coming soon
          </p>
        ) : (
          <div className="group/list">
            {articles.map((article, i) => (
              <a
                key={i}
                href={article.href}
                className="group-hover/list:opacity-40 hover:!opacity-100 transition-opacity duration-200"
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
                  {article.date}
                </span>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, letterSpacing: '-0.02em' }}>
                  {article.title}
                </span>
              </a>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}
