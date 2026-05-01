export default function Page() {
  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '550px', margin: '0 auto' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400, letterSpacing: '-0.01em', marginBottom: '24px' }}>
          05/01
        </p>
        <h1 style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '32px', lineHeight: 1.6 }}>
          Empty states are where products show their character
        </h1>
        <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.6, letterSpacing: '-0.01em' }}>
          <p style={{ marginBottom: '20px' }}>
            Empty states don't get designed until the end. That's always been the pattern on every project I've worked on — you build out the full, populated states first, and then someone notices the new user experience looks like a void, and you scramble to throw something in. A placeholder illustration, a "No items yet" message, maybe a CTA button. Done. Ship it.
          </p>
          <p style={{ marginBottom: '20px' }}>
            But I've started to think empty states deserve early attention because they're the most honest version of the product. When there's nothing in the list, nothing in the inbox, nothing in the canvas — that's when you learn whether the product has a personality or just a function. The empty state is what greets every new user. It's the first impression, and it's also the moment when the interface has to do the most work with the least help.
          </p>
          <p style={{ marginBottom: '20px' }}>
            The best empty states I've seen aren't trying to hide the emptiness — they lean into it. They acknowledge where you are and make it feel like a starting point rather than a failure. There's a difference between a screen that says "You have no items" and one that says "Here's where you'll find your items once you add them." The second one has a point of view. It's imagining the future state on your behalf.
          </p>
          <p>
            What I've noticed is that you can tell a lot about a team's design culture by how much care they put into empty states. If they look like afterthoughts, usually the rest of the product's edge cases do too. It's a small thing, but it signals whether the team is designing for the whole experience or just the center of the bell curve.
          </p>
        </div>
      </div>
    </main>
  )
}
