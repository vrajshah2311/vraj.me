import Link from 'next/link'

const font = 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const articles = [
  { title: 'Truncation is a judgment call, not a solution', date: '05/26', href: '/thoughts/truncation-is-a-judgment-call-not-a-solution' },
  { title: 'Defaults are your most consequential design decision', date: '05/25', href: '/thoughts/defaults-are-your-most-consequential-design-decision' },
  { title: 'I design the empty state first now', date: '05/24', href: '/thoughts/i-design-the-empty-state-first-now' },
  { title: 'Disabled buttons are a failure of information design', date: '05/23', href: '/thoughts/disabled-buttons-are-a-failure-of-information-design' },
  { title: 'Error messages should sound like a person', date: '05/22', href: '/thoughts/error-messages-should-sound-like-a-person' },
  { title: 'Placeholders are not a substitute for labels', date: '05/21', href: '/thoughts/placeholders-are-not-a-substitute-for-labels' },
  { title: 'Animations should feel inevitable, not impressive', date: '05/20', href: '/thoughts/animations-should-feel-inevitable-not-impressive' },
  { title: 'Icons that need tooltips have already failed', date: '05/19', href: '/thoughts/icons-that-need-tooltips-have-already-failed' },
  { title: 'I stopped writing "Submit" on buttons', date: '05/18', href: '/thoughts/i-stopped-writing-submit-on-buttons' },
  { title: 'Every hover state is a micro-promise', date: '05/17', href: '/thoughts/every-hover-state-is-a-micro-promise' },
  { title: 'Spacing is punctuation for interfaces', date: '05/16', href: '/thoughts/spacing-is-punctuation-for-interfaces' },
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
