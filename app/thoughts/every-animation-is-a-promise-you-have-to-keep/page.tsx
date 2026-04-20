export default function Page() {
  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '550px', margin: '0 auto' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400, letterSpacing: '-0.01em', marginBottom: '24px' }}>
          04/20
        </p>
        <h1 style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '32px', lineHeight: 1.6 }}>
          Every animation is a promise you have to keep
        </h1>
        <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.6, letterSpacing: '-0.01em' }}>
          <p style={{ marginBottom: '20px' }}>
            I used to add animations to everything. Fades, slides, springy bounces — if an element moved on screen, I figured that meant it felt more alive. It took a while to understand that animation isn't decoration. It's a contract.
          </p>
          <p style={{ marginBottom: '20px' }}>
            When something animates, it makes a claim about the product's personality. A button that springs back on click says "this is playful." A modal that fades in cleanly says "this is calm and professional." But when the animation doesn't match the rest of the experience — when you have a serious data tool with bouncy carousels, or a casual consumer app with robotic linear transitions — the mismatch registers immediately, even if nobody can name it. Users trust their instincts more than their vocabulary.
          </p>
          <p style={{ marginBottom: '20px' }}>
            The harder problem is duration. I've spent embarrassing amounts of time on 20ms differences. There's a narrow window, usually somewhere between 150ms and 250ms, where an animation reads as intentional rather than laggy or imperceptible. Go below it and the motion feels like a glitch. Go above it and the product starts to feel slow — like it's making you wait for it to feel polished.
          </p>
          <p>
            What I keep coming back to is the idea that every animation should either communicate something or get out of the way. If a transition doesn't tell the user where they came from, where they're going, or how things are connected, it's probably just noise. And noise, even beautiful noise, erodes trust over time. The user starts to feel like the product is performing for them rather than working for them. That's a hard thing to recover from.
          </p>
        </div>
      </div>
    </main>
  )
}
