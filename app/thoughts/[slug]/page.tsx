import { notFound } from 'next/navigation'
import Link from 'next/link'

const font = 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type Article = {
  title: string
  date: string
  body: string[]
}

const articles: Record<string, Article> = {
  'defaults-are-your-most-consequential-design-decision': {
    title: 'Defaults are your most consequential design decision',
    date: '05/25',
    body: [
      "Most design decisions feel like choices. A button placement, a color, a label — these are things you think about deliberately, iterate on, test. Defaults are different. They're the decisions that get made before the user arrives, and they stay in force until someone deliberately overrides them. In my experience, defaults shape behavior more than almost anything else on the screen.",
      "I realized this while working on a notifications settings page. Every option was off by default. The intention was to be respectful — opt-in felt more ethical than opt-out. But in practice, almost no one changed the defaults. Which meant almost no one received notifications. Not because they didn't want them, but because they never decided either way. The default was making the decision on their behalf, silently.",
      "A default isn't neutral. It says: in the absence of input from you, this is what we think is right. That's a position. It encodes an opinion about who your user is and what they need. A form that defaults to the most restrictive privacy settings says something different about the product's values than one that defaults to sharing. Neither is passive.",
      "What I try to do now is treat every default as a commitment I need to be able to defend. If a toggle is on, why? If a text field has a pre-filled value, whose interest does that serve? The question isn't which default looks cleaner — it's which default reflects what most users in most contexts actually want. That often requires research, not intuition.",
      "The defaults I've set carelessly have caused more unintended behavior than almost anything else I've shipped.",
    ],
  },
  'i-design-the-empty-state-first-now': {
    title: 'I design the empty state first now',
    date: '05/24',
    body: [
      "The empty state is the first thing a user sees when they arrive somewhere new — no data, no history, nothing yet. For a long time I designed empty states last. I'd finish the filled version of a feature, ship it, and backfill whatever illustration or placeholder copy was needed to cover the blank screen. It always felt like a formality.",
      "At some point I started doing it the other way around, and it changed how I think about features entirely.",
      "Designing the empty state first forces a question most product specs don't ask: what does someone do here before they have anything? If the answer is unclear, the feature is underspecified. If I can't write copy that explains why this section exists before it contains anything, I don't fully understand what it's for. The empty state becomes a test — of clarity, of value, of whether the space earns its place in the product.",
      "It also surfaces something structural. Most features are designed in their populated state and encountered first as blank screens. That means the worst moment of the experience often gets the least design attention. Users arrive, see nothing, and have to infer what should come next. The emptiness is treated as temporary, so it gets temporary treatment.",
      "What I've found since reversing the order is that I rarely need to go back and design the empty state separately. Starting there shapes the layout, clarifies the call to action, and makes the copy ladder obvious. The empty state stops being an afterthought and becomes the foundation. Everything else just fills in around it.",
    ],
  },
  'disabled-buttons-are-a-failure-of-information-design': {
    title: 'Disabled buttons are a failure of information design',
    date: '05/23',
    body: [
      "Most forms I've worked on have a button that goes gray when something's wrong. Fields are empty, conditions aren't met, and the submit button just sits there, unreachable. The designer's intention is clear — protect the user from submitting an incomplete form. But the experience for the user is different: they see a target they can't reach and no explanation for why.",
      "I spent a long time thinking this was right. It feels protective. You're guiding the user. But a disabled button without explanation is just withholding. It signals something is wrong without saying what, so the user goes hunting. Is it the email? A missed required field? A password rule I didn't notice? You've introduced a puzzle where there should be guidance.",
      "The pattern I keep reaching for is an always-active button that fails gracefully. Let the user click. When they do, surface what's missing, exactly where it's missing. This treats the click as a request for feedback rather than a transgression to block. Most users who see a disabled submit button are already hunting for what's wrong — make the button the way to do that.",
      "There are cases where disabling makes sense — a \"Save\" button on a form that hasn't been touched, where making it active would imply unsaved changes. But even then, the disabled state should be communicative. A tooltip on hover, inline messaging, something that doesn't make the user feel like they're failing silently.",
      "What I've learned is that a disabled button is a design decision that pushes work onto the user. If I'm going to use one, I owe an explanation. If I can't articulate that explanation clearly, I probably should rethink the pattern entirely.",
    ],
  },
  'error-messages-should-sound-like-a-person': {
    title: 'Error messages should sound like a person',
    date: '05/22',
    body: [
      "Most error messages are written for the system, not the user. They surface internal state — \"Error: invalid_grant,\" \"Request failed with status 422,\" \"NullReferenceException\" — as if the person reading them shares the same mental model as the engineer who wrote the handler. They don't. They just clicked a button and something didn't work.",
      "Good error messages require you to imagine the specific person who will read them. They're already a little frustrated. They don't know what token validation means. They want to know two things: what went wrong, and what should I do next? Almost every error I've ever read fails on at least one of those.",
      "The format I keep coming back to is simple: one sentence for what happened, one sentence for the next action. \"We couldn't process your payment — please check your card details and try again.\" That's it. No jargon, no stack traces, no passive voice. The passive voice is especially corrosive. \"An error occurred\" assigns no agency and suggests no resolution. It reads like the interface shrugging.",
      "What changed my practice was starting to write error messages before writing success states. If I can describe every failure mode in plain language — and draft a response that actually helps — it usually means I understand the interaction well enough to build it right. When I struggle to write the error, it's almost always because the interaction itself is underspecified. Error messages are a forcing function for clarity.",
      "The most common failure I see isn't too little information. It's impersonal information. The system clearly knows something went wrong. It just never bothered to translate that knowledge into a message worth reading.",
    ],
  },
  'placeholders-are-not-a-substitute-for-labels': {
    title: 'Placeholders are not a substitute for labels',
    date: '05/21',
    body: [
      "For a long time, I used placeholder text as a shortcut. The label above a text input felt redundant when the placeholder was already doing the job — \"Enter your email\" sat right there in the field, saving vertical space, keeping things clean. Removing the label felt minimal. It looked like restraint.",
      "Then I started watching people actually fill out forms.",
      "The moment you type a single character, the placeholder disappears. That's by design — it clears the field for your input. But it also clears the instruction. If you second-guess yourself halfway through typing, you have no reference. If the field validation fails and you have to correct your answer, the hint is gone. You're left trying to remember what the form asked for.",
      "This is especially bad on mobile, where the virtual keyboard hides half the screen. Users jump between fields, lose context, backspace and re-enter. The placeholder was there for the empty state — which is the shortest moment in a form's life.",
      "A label above the field is always present. It doesn't have a lifecycle; it just sits there, grounding the field no matter what state it's in. Placeholder text has a lifecycle — it exists only until the input begins. Designing as if those are interchangeable is designing for the best case instead of the actual case.",
      "What I try to do now is treat placeholder text as a hint, not a label. If the field says \"Email address\" as a label, the placeholder can say \"you@example.com\" — it adds specificity, but losing it doesn't break the interaction. The label carries the essential meaning. The placeholder is a refinement.",
      "The savings in vertical space aren't worth the confusion downstream.",
    ],
  },
  'animations-should-feel-inevitable-not-impressive': {
    title: 'Animations should feel inevitable, not impressive',
    date: '05/20',
    body: [
      "The first time I noticed it was in a design review. The prototype had this elastic bounce on a modal entrance — satisfying to trigger, clearly thought through. Everyone in the room said \"ooh.\" I said it too.",
      "We shipped it. Two weeks later, nobody talked about it anymore. And three months later, I started noticing that the bounce was slightly annoying — like someone finishing your sentence with a little flourish. It called attention to itself every single time, even after the novelty was gone.",
      "Good animation isn't applause. It's comprehension. The job of a transition is to help you understand what just happened spatially — where did this thing come from, where did it go, what's the relationship between the thing I just had and the thing I now have? When it answers those questions clearly, it disappears. You don't experience it as animation; you just experience the interface as making sense.",
      "What I try to ask now when reviewing motion is: does this teach something, or does it perform? A panel sliding in from the right teaches: there's a hierarchy, this is a child of the thing you were just on. A card flipping to reveal a back side teaches: these two surfaces are related, you're toggling between faces. A checkmark bouncing after form submission teaches nothing — it just celebrates.",
      "The animations I'm proudest of are the ones nobody notices. They serve the exact moment they were designed for, then step aside. When someone using a product says \"it just feels right,\" that's often the motion doing its job invisibly. That's what I'm going for.",
    ],
  },
  'icons-that-need-tooltips-have-already-failed': {
    title: 'Icons that need tooltips have already failed',
    date: '05/19',
    body: [
      "There's a test I run on icon-only toolbars: I cover the tooltips and ask someone who hasn't used the product to tell me what each button does. The results are almost always humbling.",
      "An icon is a bet that the image carries enough meaning on its own. Most icons don't. The pencil means \"edit\" only because you've learned it means \"edit\" from a hundred other apps. The three horizontal lines means \"menu\" by convention, not by logic. An icon is borrowed meaning, and borrowed meaning can fail silently.",
      "The tooltip is a confession. When an icon needs a tooltip to be understood, the interface has already asked too much of the user — they had to hover, wait, read, and then form their intention. That's three extra steps for what should be instant recognition. The hover-to-understand pattern treats confusion as a feature.",
      "What I've started doing is designing icon + label pairs first, then asking whether the label can go. Sometimes it can — a trash can next to a \"Delete\" label isn't adding clarity, it's just noise. But more often than I expected, the label is doing real work, and removing it would leave a gap. That's when I keep both.",
      "The cases where icons work alone are narrower than UI conventions would suggest: play and pause on a video player, send on a chat box, close on a modal. These are high-frequency actions tied to physical metaphors with decades of reinforcement. Outside that small set, the label earns its space.",
      "An interface that requires discovery to use is not minimal — it's incomplete.",
    ],
  },
  'i-stopped-writing-submit-on-buttons': {
    title: 'I stopped writing "Submit" on buttons',
    date: '05/18',
    body: [
      '"Submit" is a data-processing term. It describes what the form does — it submits data to a server. It says nothing about what you get back, what happens next, or whether you should be nervous about clicking it.',
      'I stopped writing "Submit" on buttons a couple years ago, after watching someone pause on a checkout form and ask out loud: "Wait, is this going to charge me right now?" The button said "Submit." The answer was yes. There was nothing in that word that prepared them for that.',
      'Button text is a prediction. It should tell you the next state of the world. "Send Message" says something went somewhere. "Create Account" says something now exists. "Place Order" says a transaction is about to happen. Each of these carries weight, obligation, specificity. They require you to have thought through the consequence of the action — which means they also force clarity on the rest of the interaction.',
      'When I can\'t find a better word than "Submit," that\'s usually a symptom: either the action is unclear, or the screen is doing too many things and I haven\'t figured out what the user is actually committing to. The generic label becomes a placeholder for unresolved design thinking.',
      'I\'ve started treating button text as a diagnostic. If the word fits interchangeably with every other button on the screen, something is wrong. Good button copy is almost never transferable. "Continue" works on a multi-step flow. It would be strange on a payment confirmation. The specificity of the label is a measure of how well I understand my own design.',
    ],
  },
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
