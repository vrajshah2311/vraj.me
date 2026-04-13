export default function Page() {
  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '550px', margin: '0 auto' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400, letterSpacing: '-0.01em', marginBottom: '24px' }}>
          04/13
        </p>
        <h1 style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '32px', lineHeight: 1.6 }}>
          The hover state is where design gets honest
        </h1>
        <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.6, letterSpacing: '-0.01em' }}>
          <p style={{ marginBottom: '20px' }}>
            Hover states are easy to neglect because they only exist for a moment and only for people using a mouse. In a design review, nobody screenshots them. In a handoff doc, they're often listed as "primary color + 10% opacity" and left at that. But I've come to think hover states are one of the most revealing details in any interface — they tell you whether someone actually thought about how the thing feels in motion, or just how it looks standing still.
          </p>
          <p style={{ marginBottom: '20px' }}>
            When I'm evaluating a design I didn't build, I mouse over everything before I read anything. A hover that feels immediate and right — the right duration, the right property changing, the right destination state — tells me the designer spent time with the component as a living thing. A hover that's stiff or missing tells me something else: that the work stopped at the static frame.
          </p>
          <p style={{ marginBottom: '20px' }}>
            The problem is that hover states live in time. Most of design still happens in space. Figma doesn't play back interactions the way a browser does — you can fake it with Smart Animate, but it's not the same as feeling it with a real cursor. That gap forces you to actually ship something and use it before you know if it's right. No amount of squinting at a static frame will tell you whether 150ms ease-out is better than 200ms ease-in-out.
          </p>
          <p>
            I've started treating the browser as part of my design tool, not just the place I hand off to. The hover state is where that shift matters most.
          </p>
        </div>
      </div>
    </main>
  )
}
