'use client'

import Link from 'next/link'

const font = 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const articles = [
  { title: 'Reduced motion showed me which transitions were necessary', date: '07/02', href: '/thoughts/reduced-motion-showed-me-which-transitions-were-necessary' },
  { title: 'The browser is where I finish my designs', date: '07/01', href: '/thoughts/the-browser-is-where-i-finish-my-designs' },
  { title: 'Dark mode showed me spacing was never absolute', date: '06/30', href: '/thoughts/dark-mode-showed-me-spacing-was-never-absolute' },
  { title: 'I stopped trusting my color calls after 6 PM', date: '06/29', href: '/thoughts/i-stopped-trusting-my-color-calls-after-6-pm' },
  { title: 'Two-column forms fragment what should be one thought', date: '06/28', href: '/thoughts/two-column-forms-fragment-what-should-be-one-thought' },
  { title: 'The wrong cursor made my design feel broken', date: '06/27', href: '/thoughts/the-wrong-cursor-made-my-design-feel-broken' },
  { title: 'Destructive actions taught me to design with weight', date: '06/26', href: '/thoughts/destructive-actions-taught-me-to-design-with-weight' },
  { title: 'Every second of hesitation is a design problem', date: '06/25', href: '/thoughts/every-second-of-hesitation-is-a-design-problem' },
  { title: 'I squint at every screen before I ship', date: '06/24', href: '/thoughts/i-squint-at-every-screen-before-i-ship' },
  { title: 'Writing the label first changed what I designed', date: '06/23', href: '/thoughts/writing-the-label-first-changed-what-i-designed' },
  { title: 'Overflow told me what I was afraid to decide', date: '06/22', href: '/thoughts/overflow-told-me-what-i-was-afraid-to-decide' },
  { title: 'I test at browser zoom 200% now', date: '06/21', href: '/thoughts/i-test-at-browser-zoom-200-now' },
  { title: 'Whitespace I tried to reclaim was load-bearing', date: '06/20', href: '/thoughts/whitespace-i-tried-to-reclaim-was-load-bearing' },
  { title: "Consistency revealed what I hadn't actually decided", date: '06/19', href: '/thoughts/consistency-revealed-what-i-hadnt-actually-decided' },
  { title: 'Fixed elements are a contract, not a convenience', date: '06/18', href: '/thoughts/fixed-elements-are-a-contract-not-a-convenience' },
  { title: 'I stopped designing at 150% zoom', date: '06/17', href: '/thoughts/i-stopped-designing-at-150-zoom' },
  { title: 'Input width tells users how much to write', date: '06/16', href: '/thoughts/input-width-tells-users-how-much-to-write' },
  { title: 'Keyboard order showed me my true layout hierarchy', date: '06/15', href: '/thoughts/keyboard-order-showed-me-my-true-layout-hierarchy' },
  { title: 'Color modes taught me what was actually structural', date: '06/14', href: '/thoughts/color-modes-taught-me-what-was-actually-structural' },
  { title: 'Border radius is a personality decision', date: '06/13', href: '/thoughts/border-radius-is-a-personality-decision' },
  { title: 'Touch targets made me more generous everywhere', date: '06/11', href: '/thoughts/touch-targets-made-me-more-generous-everywhere' },
  { title: 'Gray has temperature and it changes everything', date: '06/10', href: '/thoughts/gray-has-temperature-and-it-changes-everything' },
  { title: 'I started treating density as a user promise', date: '06/09', href: '/thoughts/i-started-treating-density-as-a-user-promise' },
  { title: 'Shadows only work when the light source agrees', date: '06/08', href: '/thoughts/shadows-only-work-when-the-light-source-agrees' },
  { title: 'I design with real data now, always', date: '06/07', href: '/thoughts/i-design-with-real-data-now-always' },
  { title: 'Friction reveals what users actually want', date: '06/06', href: '/thoughts/friction-reveals-what-users-actually-want' },
  { title: 'I cut half my font sizes and gained hierarchy', date: '06/05', href: '/thoughts/i-cut-half-my-font-sizes-and-gained-hierarchy' },
  { title: 'Monospace numbers made my tables easier to read', date: '06/04', href: '/thoughts/monospace-numbers-made-my-tables-easier-to-read' },
  { title: 'Naming things forced me to think more clearly', date: '06/03', href: '/thoughts/naming-things-forced-me-to-think-more-clearly' },
  { title: 'Contrast ratios changed how I see everything', date: '06/02', href: '/thoughts/contrast-ratios-changed-how-i-see-everything' },
  { title: 'Numbers lie about where the center is', date: '06/01', href: '/thoughts/numbers-lie-about-where-the-center-is' },
  { title: 'I used to remove focus rings', date: '05/31', href: '/thoughts/i-used-to-remove-focus-rings' },
  { title: 'Line length is the most ignored typographic decision', date: '05/30', href: '/thoughts/line-length-is-the-most-ignored-typographic-decision' },
  { title: 'Loading states tell the truth about your architecture', date: '05/29', href: '/thoughts/loading-states-tell-the-truth-about-your-architecture' },
  { title: 'I stopped adding borders and started adding space', date: '05/28', href: '/thoughts/i-stopped-adding-borders-and-started-adding-space' },
  { title: 'Alignment reveals what you actually believe about hierarchy', date: '05/27', href: '/thoughts/alignment-reveals-what-you-actually-believe-about-hierarchy' },
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
