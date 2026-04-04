export default function ThoughtPage() {
  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', paddingTop: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{ maxWidth: '550px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.6, margin: 0 }}>
          we spent three hours arguing about a modal
        </h1>
        <p style={{ fontSize: '13px', fontWeight: 400, color: 'var(--text-muted)', letterSpacing: '-0.01em', marginTop: '8px', marginBottom: '40px' }}>
          04/04
        </p>
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
          <p>
            There&apos;s this moment in almost every design review where someone asks if a modal is the right pattern. And the conversation immediately slides from &quot;is this the right interaction&quot; to something that&apos;s really about trust and taste and who has the most experience. We once spent three hours on a single modal decision — whether a destructive action should be confirmed in a modal or inline. Three hours. And by the end of it, we shipped the modal because that&apos;s what the component library defaulted to, not because anyone made a real argument.
          </p>
          <p style={{ marginTop: '20px' }}>
            The frustrating part is that the modal debate is almost never about the modal. It&apos;s about whether you&apos;ve actually thought through the edge cases, whether your mental model of the user matches reality, whether you&apos;re designing for the happy path or for someone who&apos;s confused and scared and about to lose data. The modal is a stand-in for all of that. Nobody wants to say &quot;I haven&apos;t thought this through&quot; so instead you argue about whether a modal is appropriate.
          </p>
          <p style={{ marginTop: '20px' }}>
            I think about this every time I default to a pattern I know works. There&apos;s a difference between using a pattern because you&apos;ve genuinely evaluated it and using it because it&apos;s familiar and it&apos;ll survive the design review. Most of my early career decisions were the latter. I&apos;m still catching myself doing it.
          </p>
        </div>
      </div>
    </main>
  )
}
