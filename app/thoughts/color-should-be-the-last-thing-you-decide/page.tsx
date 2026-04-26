export default function Page() {
  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '550px', margin: '0 auto' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400, letterSpacing: '-0.01em', marginBottom: '24px' }}>
          04/26
        </p>
        <h1 style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '32px', lineHeight: 1.6 }}>
          Color should be the last thing you decide
        </h1>
        <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.6, letterSpacing: '-0.01em' }}>
          <p style={{ marginBottom: '20px' }}>
            I used to start every new project by picking a palette. It felt like the most exciting part — choosing colors is immediate and expressive, and it gives you something to react to quickly. But I've learned to resist that instinct now.
          </p>
          <p style={{ marginBottom: '20px' }}>
            The problem with deciding on color early is that it does too much work before the structure is ready to receive it. You end up making layout decisions to serve the color, when it should be the other way around. A bold accent might feel right in isolation, but once you build out a real interface around it, you discover it's fighting with everything — the hierarchy, the density, the context. And then you're stuck, because you've already committed.
          </p>
          <p style={{ marginBottom: '20px' }}>
            What I try to do now is get the design to a point where it almost works in grayscale. Not purely — I'm not dogmatic about it — but close enough that the hierarchy reads, the spacing breathes, and the interactions feel correct without any chromatic help. That's when color stops being decoration and starts being a system. You add it and it either confirms what the layout was already saying, or it reveals something you missed.
          </p>
          <p>
            The hardest part is that this approach is invisible. Nobody looks at a finished design and says "wow, you really nailed the order of operations." But I notice the difference in how settled the final thing feels, how few late-stage revisions happen when a color needs to change. If the structure is right, swapping a color is trivial. If it isn't, changing colors exposes every problem at once. Color is a reward for getting everything else right first.
          </p>
        </div>
      </div>
    </main>
  )
}
