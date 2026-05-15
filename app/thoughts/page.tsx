import Link from 'next/link'

const font = 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const articles = [
  { title: 'Why I draft in grayscale before color', date: '05/15', href: '/thoughts/why-i-draft-in-grayscale-before-color' },
]

export default function ThoughtsPage() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 550, margin: '0 auto', paddingTop: 80, paddingLeft: 20, paddingRight: 20, paddingBottom: 80 }}>
        <Link
          href="/"
          style={{
            fontFamily: font,
            fontSize: 13,
            fontWeight: 500,
            color: 'oklch(0 0 0 / 0.35)',
            textDecoration: 'none',
            display: 'block',
            marginBottom: 48,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#171717')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'oklch(0 0 0 / 0.35)')}
        >← Back</Link>

        <div style={{ fontFamily: font, fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 24 }}>
          Thoughts
        </div>

        {articles.map((article) => (
          <Link
            key={article.href}
            href={article.href}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 16,
              padding: '10px 0',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              fontFamily: font,
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.6,
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span>{article.title}</span>
            <span style={{ color: 'var(--text-tertiary)', flexShrink: 0, fontSize: 13 }}>{article.date}</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
