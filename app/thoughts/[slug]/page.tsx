import { notFound } from 'next/navigation'
import Link from 'next/link'

const font = 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type Article = {
  title: string
  date: string
  body: string[]
}

const articles: Record<string, Article> = {
  'every-hover-state-is-a-micro-promise': {
    title: 'Every hover state is a micro-promise',
    date: '05/17',
    body: [
      "When I hover over something and it changes, I'm receiving a commitment. The element is telling me: something will happen here, and that thing is predictable. Most of the time hover states get treated as visual decoration — a way to signal interactivity, to acknowledge the cursor. But hover is actually the first half of a contract.",
      "I noticed this most clearly while auditing a dashboard that users kept describing as confusing. Nothing was technically broken. But hover states were applied inconsistently: some elements changed color on hover with no click action attached, others triggered major state changes with no visible affordance beforehand. The cursor was lying. Users were hovering, seeing nothing change, and assuming nothing was interactive. Or worse: something changed on hover in a way that had no relationship to what clicking would actually do.",
      "The hover state should telegraph the action. A subtle background fill on a row promises a selection. A deepening shadow on a card promises a click. An underline promises navigation. The visual change isn't decoration — it's preemptive disclosure. It says: this is the thing, and here is roughly what it does. If the hover breaks that promise, the interaction feels arbitrary, even when it works correctly.",
      "What I try to do now is design hover and active states together, never separately. The hover state is a preview of the active state — the same gesture at lower intensity. If I can't figure out what the hover should look like, that's usually a sign the interaction itself isn't defined clearly enough. The hover problem is rarely a visual problem. It's a clarity problem wearing a visual costume.",
    ],
  },
  'spacing-is-punctuation-for-interfaces': {
    title: 'Spacing is punctuation for interfaces',
    date: '05/16',
    body: [
      "I used to think of spacing as the thing you did after the real design work was finished. Padding and margins were numbers you adjusted until things \"looked right\" — an aesthetic instinct, not a structural decision. It took me an embarrassingly long time to realize that spacing is the punctuation of an interface.",
      "Punctuation in writing tells you where to pause, where a thought ends, where emphasis falls. A comma slows the reader down. A period creates a stop. Whitespace in a layout does the same work. A tight gap between two elements says they belong together. A large margin before a section says: this is something new. The rhythm of a page — whether it feels calm or crowded, scannable or exhausting — is almost entirely a function of how space is distributed.",
      "What changed for me was noticing how often I could trace a confusing UI back to a spacing problem, not a content problem. A button that felt disconnected from its context turned out to just be too far from the field it submitted. A paragraph that felt out of place had the same margin above it as everything else, so nothing was anchoring it to what came before. Spacing was carrying no semantic weight at all.",
      "Now I treat spatial decisions the way I treat type decisions: deliberately. Eight pixels versus sixteen is not a preference; it's a statement about relationship. I keep a rough vocabulary — 4 for tight binding, 12 for association, 24 for section separation, 48 for breathing — and try to stay consistent within a screen the same way a writer tries to be consistent with punctuation. Break the rules, but know which rule you're breaking.",
    ],
  },
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
