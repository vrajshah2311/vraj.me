import { notFound } from 'next/navigation'
import Link from 'next/link'

const font = 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type Article = {
  title: string
  date: string
  body: string[]
}

const articles: Record<string, Article> = {
  'why-i-draft-in-grayscale-before-color': {
    title: 'Why I draft in grayscale before color',
    date: '05/15',
    body: [
      "There's something clarifying about removing color entirely. When I start a new screen, I force myself to work in grayscale first — no brand colors, no gradients, no fill hacks. Just shape, spacing, and type.",
      "It started as a constraint a mentor imposed on me years ago. I resented it at first. Color feels like thinking. A dash of orange tells you something is interactive, a muted background suggests hierarchy. Without it, you're working half-blind.",
      "But that's exactly the point. When color isn't available to do the heavy lifting, everything else has to earn its keep. Spacing has to communicate grouping. Type weight has to show importance. The layout itself has to feel navigable before a single hex code is applied.",
      "What I've found is that interfaces built this way tend to hold up better under scrutiny. If the hierarchy is obvious in grayscale, it's obvious everywhere — dark mode, low-contrast displays, printed documentation, the brief moment before a stylesheet loads. If it only makes sense with color, it's fragile.",
      "There's also a subtler benefit: it forces me to question whether I'm using color semantically or decoratively. A lot of early-career work uses color to paper over structural problems. A blue banner draws the eye, sure, but it doesn't solve the fact that the empty state beneath it makes no sense. Grayscale makes those problems visible early.",
      "I still add color. I love color. But by the time I reach for the palette, I want the bones of the thing to already be clean.",
    ],
  },
}

export default function ThoughtPage({ params }: { params: { slug: string } }) {
  const article = articles[params.slug]
  if (!article) notFound()

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 80 }}>
      <div style={{ maxWidth: 550, margin: '0 auto', paddingLeft: 20, paddingRight: 20, paddingBottom: 80 }}>
        <Link
          href="/thoughts"
          style={{
            fontFamily: font,
            fontSize: 13,
            fontWeight: 500,
            color: 'oklch(0 0 0 / 0.35)',
            textDecoration: 'none',
            display: 'block',
            marginBottom: 48,
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#171717')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'oklch(0 0 0 / 0.35)')}
        >← Back</Link>

        <p style={{ fontFamily: font, fontSize: 12, fontWeight: 500, color: 'var(--text-tertiary)', margin: '0 0 10px', letterSpacing: '0.02em' }}>
          {article.date}
        </p>

        <h1 style={{ fontFamily: font, fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 36px', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
          {article.title}
        </h1>

        {article.body.map((paragraph, i) => (
          <p key={i} style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 20px', lineHeight: 1.6 }}>
            {paragraph}
          </p>
        ))}
      </div>
    </main>
  )
}
