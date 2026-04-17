export default function Page() {
  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', padding: '80px 24px' }}>
      <div style={{ maxWidth: '550px', margin: '0 auto' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400, letterSpacing: '-0.01em', marginBottom: '24px' }}>
          04/17
        </p>
        <h1 style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '32px', lineHeight: 1.6 }}>
          Padding is where you confess your taste
        </h1>
        <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.6, letterSpacing: '-0.01em' }}>
          <p style={{ marginBottom: '20px' }}>
            Padding is one of those decisions that looks boring from the outside and feels agonizing from the inside. You'd think it was simple — add some space around the element, move on. But every time I open the spacing inspector, I find myself making a dozen micro-judgments that reveal something about how I think design should feel.
          </p>
          <p style={{ marginBottom: '20px' }}>
            Too tight and the interface feels anxious, like it's afraid to breathe. Too loose and it feels uncommitted, like the designer couldn't decide what mattered so they just spread everything out. The range between "this reads as intentional" and "this reads as careless" is maybe 4 pixels. That's not a lot of margin for error.
          </p>
          <p style={{ marginBottom: '20px' }}>
            What I've noticed is that padding choices are basically a statement about hierarchy. When you give something generous padding, you're saying: this thing deserves room. This thing is important enough to not be crowded. You're spending visual budget on it. And when you pinch the padding on something else, you're quietly deprioritizing it — sometimes deliberately, sometimes because you ran out of space and fudged it.
          </p>
          <p>
            I used to copy padding values from Figma files I admired, thinking I could absorb their judgment. It doesn't really work that way. You have to develop your own sense of what feels right, which means making a lot of wrong choices first and learning to notice the discomfort before rationalizing it away. The moment something feels slightly off but you can't name why — that's usually the padding.
          </p>
        </div>
      </div>
    </main>
  )
}
