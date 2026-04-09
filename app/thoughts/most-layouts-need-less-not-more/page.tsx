export default function Page() {
  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '550px', margin: '0 auto' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400, letterSpacing: '-0.01em', marginBottom: '24px' }}>
          04/09
        </p>
        <h1 style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '32px', lineHeight: 1.6 }}>
          Most layouts need less, not more
        </h1>
        <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.6, letterSpacing: '-0.01em' }}>
          <p style={{ marginBottom: '20px' }}>
            The instinct when something feels off in a layout is to add. Add another element, pull in a divider, introduce a secondary color, try a different texture. I do it too — there's a comfort in action, in having something new to react to. But most of the time, the problem was never a missing piece.
          </p>
          <p style={{ marginBottom: '20px' }}>
            I've been rebuilding this site a few times over the past year, and the version that finally felt right was the one where I stopped. Stopped adding sections, stopped introducing new type scales, stopped reaching for visual interest as a solution to visual noise. The pages that work are the ones where I gave the content room to breathe and trusted that breathing room to do its job.
          </p>
          <p style={{ marginBottom: '20px' }}>
            Whitespace isn't passive. It's structural. It tells your eye where to go and when to rest. A crowded layout forces the reader to work harder than they should — everything competes, so nothing wins. When you remove the competition, hierarchy becomes obvious without you having to engineer it.
          </p>
          <p>
            The hardest part is that restraint looks like nothing when it works. You don't notice the whitespace; you just feel the calm. That invisibility makes it easy to second-guess yourself — maybe it needs something. It usually doesn't.
          </p>
        </div>
      </div>
    </main>
  )
}
