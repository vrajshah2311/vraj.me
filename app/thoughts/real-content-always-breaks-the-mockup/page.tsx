export default function Page() {
  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '550px', margin: '0 auto' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400, letterSpacing: '-0.01em', marginBottom: '24px' }}>
          04/16
        </p>
        <h1 style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '32px', lineHeight: 1.6 }}>
          Real content always breaks the mockup
        </h1>
        <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.6, letterSpacing: '-0.01em' }}>
          <p style={{ marginBottom: '20px' }}>
            There's a ritual I've fallen into more times than I'd like to admit: spending an afternoon getting a layout to feel just right, then watching it fall apart the moment I swap in actual content. The placeholder text was three lines. The real copy is seven. The avatar was a smooth gradient blob. The real photo has an off-center composition and a busy background.
          </p>
          <p style={{ marginBottom: '20px' }}>
            Mockups are a kind of lie we tell ourselves to feel productive. They're controlled environments where every variable cooperates — the text is the right length, the numbers are round, the images are perfectly cropped. That's useful for exploring structure, but it breeds overconfidence. You start to mistake the mockup's tidiness for your own skill.
          </p>
          <p style={{ marginBottom: '20px' }}>
            The only way I've found to design honestly is to get real content in early and let it wreck things. Not after the design is "done" and you're polishing details, but at the rough stage when it still hurts less to start over. Paste in the actual copy. Drop in the real product photo. Use the edge-case numbers — the 47-character username, the item with no description yet.
          </p>
          <p>
            What breaks is usually what needed to break. The layout that couldn't handle a longer title wasn't a good layout — it was a fragile one you hadn't stress-tested yet. And the fixes you make after real content arrives tend to be more honest than anything you'd invent in a vacuum.
          </p>
        </div>
      </div>
    </main>
  )
}
