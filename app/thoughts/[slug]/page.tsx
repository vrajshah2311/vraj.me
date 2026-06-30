'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'

const font = 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

type Article = {
  title: string
  date: string
  body: string[]
}

const articles: Record<string, Article> = {
  'dark-mode-showed-me-spacing-was-never-absolute': {
    title: 'Dark mode showed me spacing was never absolute',
    date: '06/30',
    body: [
      "The first time I designed a dark mode interface seriously — not just swapping colors but actually thinking about how the layout felt — something was off. I'd taken the exact same spacing values from the light version. Same 32px section gaps, same 16px inner padding, same 8px between a label and its input. Everything was correct in the file. It felt cramped on screen.",
      "I spent a while adjusting individual components before I noticed the pattern: almost every spacing value I'd brought over from light mode needed to be increased. Not dramatically — maybe 20 to 30 percent — but consistently. The dark version of the design needed more air.",
      "The reason, I think, has to do with how light behaves. In a light interface, whitespace is literally bright. A 32px gap between two cards isn't just spatial distance — it's a band of high luminance that reads as expansive. The eye sees brightness as openness. In a dark interface, that same 32px gap is now dark. The spatial distance hasn't changed, but the visual cue that communicated distance has been stripped away. What's left is proximity with no light telling you to perceive it as separated.",
      "What this taught me is that spacing values are not intrinsic — they're relative to the surfaces they exist between. Sixteen pixels of gap adjacent to white has more perceived space than sixteen pixels adjacent to near-black. The number is the same. The experience is different.",
      "I now do a light-mode and dark-mode pass on the same layout, adjusting spacing independently for each. The components that need the most recalibration are usually the densest ones: data tables, nested content, form fields grouped closely together. They feel fine in light and claustrophobic in dark until I add the right amount of room back in.",
    ],
  },
  'i-stopped-trusting-my-color-calls-after-6-pm': {
    title: 'I stopped trusting my color calls after 6 PM',
    date: '06/29',
    body: [
      "There's a rule I gave myself a while back: no final color decisions after dark. It sounds superstitious. It isn't.",
      "The problem started with a project I was working late into the night to finish. The background color I'd been agonizing over looked perfect at 11 PM — warm, muted, sophisticated. I shipped it. In the morning, on the same laptop in daylight, it looked greenish and slightly sick. Nothing had changed in the file. Everything had changed in how I was seeing.",
      "Color perception is context-dependent in ways we mostly ignore. The ambient light in a room shifts the reference point your eyes use to evaluate any color on screen. A warm incandescent lamp at night makes everything feel warmer, including your screen, and you compensate unconsciously — pulling colors cooler to balance. In daylight, those compensations are exposed. The same hex value looks different.",
      "Eye fatigue makes it worse. After six hours at a screen, the eye's ability to discriminate subtle hue differences degrades. Colors that looked distinct start to flatten. Decisions that seemed precise turn out to be educated guesses made by tired hardware.",
      "What I do now is flag any color decision made past 6 PM and revisit it the next morning before committing. Not change it — just check. Most of the time it still holds. But enough times it doesn't that the habit is worth the delay. A background that seemed to warm the whole interface the night before just looks slightly dingy. A brand color that felt energetic reads as aggressive in a rested morning light.",
      "Design software can't tell you what the eye sees at 11 PM. That's exactly the problem.",
    ],
  },
  'two-column-forms-fragment-what-should-be-one-thought': {
    title: 'Two-column forms fragment what should be one thought',
    date: '06/28',
    body: [
      "Two-column form layouts have a particular appeal on wide screens. They look organized. First name next to last name, city next to state — the pairing reads as intentional structure. The symmetry suggests the designer was in control. I used them for years before I understood what they were doing to the people filling them out.",
      "The problem is reading direction. Users navigate forms with an expectation about order: this field, then the next, then the one after. In a single-column form, that sequence is unambiguous. In a two-column layout, the order depends on which reading convention you apply — do you go left column first, top to bottom, then right column? Or left to right across each row? Neither is obviously correct. That ambiguity is small, but forms are rarely one decision. Multiplied across fifteen fields, the user is navigating layout before they're engaging with content.",
      "What made this concrete for me was watching someone fill out a checkout form I'd designed. First name and last name side by side, shipping address below, then city and state side by side, zip code next to it. The user tabbed through and immediately lost the thread. They weren't confused by the questions — they were confused by the path. The spatial pattern implied left-to-right, then broke it, then implied it again. The form was a zigzag, not a flow.",
      "The exception I've kept is fields where the pairing carries genuine meaning, not just spatial efficiency. First and last name belong together because they're a single concept. But city and state are only adjacent because of a mailing address convention. Putting them side by side to save vertical space treats layout compactness as a user benefit — it's not. It's a designer preference.",
      "Single-column forms take longer to scroll and less time to complete. That tradeoff is worth making almost every time.",
    ],
  },
  'the-wrong-cursor-made-my-design-feel-broken': {
    title: 'The wrong cursor made my design feel broken',
    date: '06/27',
    body: [
      "For a long time I applied `cursor: pointer` to everything interactive without much thought. Cards, expandable rows, inline tags, section labels. The pointer finger was shorthand for clickable, which felt like honest communication — if it does something, show the hand.",
      "Then I watched someone hover over a section header I'd built. It had a click handler that toggled a tooltip, not a navigation event. They hesitated for half a second, then clicked expecting to go somewhere. The cursor had implied a link. The interaction delivered something quieter. Nothing was broken, but something felt off — and they felt it too.",
      "Cursor style is the first affordance signal a user receives, before any visible state change. `pointer` carries the weight of navigation: follow this somewhere, do something significant. `default` says information lives here, or interaction is understated. `grab` says this can be repositioned. Each implies a different contract, and users read them before any click fires.",
      "What I started doing is being intentional about which cursor each pattern deserves. Toggles and expandable rows often read more accurately with `default` — the action is contextual, not navigational. The finger icon signals more urgency than most of those interactions warrant. Overusing `pointer` dilutes the signal until it means nothing at all.",
      "When users describe a product as feeling slightly off on hover — not broken, just slightly wrong — cursor mismatch is often the cause. It doesn't surface in bug reports. It just adds a thin layer of static between the user and the interface. Getting it right is one of those invisible details that nobody notices, which is exactly the point.",
    ],
  },
  'destructive-actions-taught-me-to-design-with-weight': {
    title: 'Destructive actions taught me to design with weight',
    date: '06/26',
    body: [
      "For most of my design career, I treated button hierarchy as a binary: primary buttons are big and prominent, secondary buttons are smaller and quieter. The framework felt clean. It covered most cases without much thought.",
      "Then I started paying more attention to destructive actions. A \"Delete account\" option sitting at the bottom of a settings page, styled as a secondary link in muted gray — technically correct, visually understated, and quietly wrong. Users who shouldn't click it barely registered it. Users who needed to find it missed it entirely.",
      "The problem was that I'd been conflating prominence with priority. Primary means \"the action I want users to take most.\" But destructive actions aren't primary or secondary in that sense — they're orthogonal. They need to be findable for the people who need them and impossible to click accidentally by everyone else.",
      "What I've started doing is thinking about button weight in terms of consequence rather than hierarchy. An action that creates something can be quiet — it costs little to undo. An action that destroys something irreversibly needs a different visual strategy: visible enough to find deliberately, shaped to avoid accidental activation. That might mean size, color, or placement. Usually it means all three, calibrated together.",
      "The detail that changed my practice was spacing. A \"Delete\" button that sits far from the primary action, with clear separation — not just a different color — communicates that these are distinct decisions, not continuation steps. Users navigate to it intentionally instead of arriving there by momentum. That spatial distance does more work than any red color has ever done in my designs.",
      "Visual weight and visual danger aren't the same signal. I used to assume prominent meant safe and quiet meant careful. Now I think prominence is about discoverability, and weight is about consequence — and getting them right together is the actual problem.",
    ],
  },
  'every-second-of-hesitation-is-a-design-problem': {
    title: 'Every second of hesitation is a design problem',
    date: '06/25',
    body: [
      "When I watch someone use a product I've built, I'm not watching for errors. I'm watching for hesitation.",
      "A half-second pause before clicking. A cursor that drifts to the wrong element before correcting course. Eyes that move to the label again after they've already read it. These are the moments that carry the most information, and they happen so fast that usability sessions almost miss them.",
      "Hesitation means the next step wasn't obvious. Not wrong — not inaccessible — just not immediately legible. The person figured it out, because people are adaptive, but they spent something to do it. A fraction of their attention. A moment of uncertainty. Over the course of an interface, those fractions add up. They're the difference between using something that feels effortless and something that takes work you never consciously notice doing.",
      "I started logging hesitation events the way I log errors. Where did you pause? What were you looking for? Did you find it before or after you acted? The pattern that usually emerges is that the same two or three spots catch everyone. A button that looks like a label. A confirmation that came too fast after the action. A field that wasn't clearly tied to what it was asking about.",
      "What I've had to accept is that the clear design is never as clear as it felt when I made it. I know what everything does. My confidence is the thing getting in the way. Watching hesitation is how I see my own interface without my own context — which is the only way to know whether it actually works.",
    ],
  },
  'i-squint-at-every-screen-before-i-ship': {
    title: 'I squint at every screen before I ship',
    date: '06/24',
    body: [
      "Squinting sounds like a joke. I used to think so too. But at some point I started closing my eyes almost all the way when reviewing a layout, and what I saw changed how I worked.",
      "When you squint, sharp edges blur and color flattens into approximate masses. Text disappears. What remains is light and dark, large and small — the visual weight of each element at its most essential. If something is supposed to be the first thing someone sees, it should read that way even to half-closed eyes. If it doesn't, the design hasn't actually done the work.",
      "The first time I tried it deliberately, I was looking at a product page I thought was clean. Squinting, the most prominent shape was a secondary navigation bar I'd styled with too much contrast. The primary call to action, which I'd intended to be obvious, was nearly invisible in the blurred view. I'd been polishing the wrong thing.",
      "What squinting tests is hierarchy of attention — not which elements are labeled important, but which elements actually pull the eye first. You can declare a button primary all day through props and naming conventions. The blur test doesn't care about intentions. It shows you what the visual weight is actually doing.",
      "I now do it twice: once midway through a layout, and once before I mark something ready. It takes ten seconds. It's caught things that hours of detailed review missed — a card that reads darker than the content it frames, a headline that competes with the background color, text-heavy sections that collapse into unreadable mass when the type details disappear. The blur test is honest in a way that close inspection isn't.",
    ],
  },
  'writing-the-label-first-changed-what-i-designed': {
    title: 'Writing the label first changed what I designed',
    date: '06/23',
    body: [
      "For most of my early work, copy was a placeholder. Lorem ipsum in the layout, \"Button\" on the button, \"Title\" in the heading slot. The design came first and the words fit into it afterward. It felt efficient — I'd solve the structure and fill in the specifics later.",
      "The problem showed up in reviews. I'd present a screen and someone would ask what this button does, and I'd explain it with words I hadn't put on the button yet. The design made sense when I talked over it. It didn't make sense on its own.",
      "I started reversing the order. Before placing any component, I'd write the label, the heading, the call to action. What is the user deciding here? What word best names that decision? This forced a kind of specificity that a shape on a grid never does. A rectangle labeled \"Button\" can mean anything. A rectangle labeled \"Delete account permanently\" has a specific weight — it shapes how large it should feel, where it belongs on the page, how much breathing room it needs.",
      "What I found is that when the words are right, the layout almost writes itself. The length of the label determines the component's minimum size. The stakes of the action determine its visual prominence. The user's mental model of what they're doing — which the label has to reflect — tells you what they need to see before they get there.",
      "The screens I've been least satisfied with are usually the ones where I designed first and wrote later. The copy ends up shoehorned into a shape that was never really made for it. Words are thinking. Starting with them means the design has already done that work.",
    ],
  },
  'overflow-told-me-what-i-was-afraid-to-decide': {
    title: 'Overflow told me what I was afraid to decide',
    date: '06/22',
    body: [
      "Overflow was my most reliable sign of unfinished thinking. Not the CSS property — the behavior. When a component started doing something unexpected with content that exceeded its container, I'd usually jump to fix the visible symptom. Add ellipsis. Set a max-height. Clip it. The overflow would stop being visible, and I'd move on without ever asking why it happened.",
      "The question I kept avoiding was: what happens when there's too much? For a card component holding a product name, that's obvious enough to resolve. But for anything more open-ended — a user bio, an event description, a note — the overflow was exposing a decision I'd deferred. How long can this be? What happens when someone writes more than expected? Who decides?",
      "I started treating every overflow occurrence as a design failure of a specific kind — not a visual problem but a missing constraint. Either the content model didn't have limits that matched the layout, or the layout didn't adapt to the content model, or both were undefined and one happened to be shorter than the other during testing. Scrollable, clipped, or elastic — each overflow strategy implies a different model of the component. Choosing the right one requires knowing what the component is actually for.",
      "What helped me was deciding overflow behavior before styling anything. Not at the end, not as a visual patch. At the beginning, alongside the question of what the component needs to hold. When I do it in that order, the behavior I choose shapes the layout rather than the other way around. The ellipsis I would have added by reflex turns into a genuine constraint — a character limit, a fixed-height scroll region, or a layout that can stretch. The overflow becomes a choice instead of an accident.",
    ],
  },
  'i-test-at-browser-zoom-200-now': {
    title: 'I test at browser zoom 200% now',
    date: '06/21',
    body: [
      "Most accessibility checklists include browser zoom as a line item. Press CMD and plus a few times, see if it breaks. In practice it gets tested once, declared acceptable, and forgotten. I was doing the same thing until someone on my team mentioned they used their browser at 175% permanently — not because of a visual impairment, but because they found it more comfortable. That reframe hit differently.",
      "Zoom isn't an edge case. It's a preference. Anyone who sets a larger default font size, anyone on a high-DPI display with a small physical screen, anyone who gets headaches reading small type — they all exist on a spectrum the same zoom tests cover. Designing as if 100% is the only viewport is designing for a narrow assumption about how people use computers.",
      "What 200% zoom breaks consistently: sticky elements that cover too much of the screen when text is large, fixed-width containers that force horizontal scrolling, absolute-positioned decorative elements that overlap content. These aren't exotic failures. They're everywhere, and they only show up when you actually look.",
      "The test I use now is to zoom to 200%, do the core task of whatever I'm designing, and see if I get stuck. Usually I do, at least once. A label that was one line wraps and now stacks awkwardly over its input. A tooltip clips the viewport. An illustration that looked balanced at default size now dominates half the visible area.",
      "None of these feel like problems when you're working at a comfortable zoom level. That's the trap. Testing at 200% is fast — maybe three minutes — and it consistently finds issues that no static review or design critique would surface. I added it to my own definition of done, not as an accessibility checkbox, but as a basic check on whether the layout actually holds.",
    ],
  },
  'whitespace-i-tried-to-reclaim-was-load-bearing': {
    title: 'Whitespace I tried to reclaim was load-bearing',
    date: '06/20',
    body: [
      "There's a kind of whitespace that looks wasteful until you remove it. For a long time I treated generous padding as a sign the layout wasn't finished — too much room between things meant I hadn't figured out where they belonged. My instinct was to tighten.",
      "I kept hitting the same problem. Compressing the margins made things that had seemed readable feel busy. Not obviously crowded — just harder to parse. I'd gained nothing visible and lost something I couldn't name.",
      "What I eventually understood is that whitespace carries meaning, not just air. The space around a section header isn't decorating the header — it's separating it from what came before and binding it to what follows. The padding inside a card isn't generosity — it's the visual boundary that makes the card a unit. When I removed those gaps, I wasn't being efficient. I was dismantling structure I'd already built.",
      "The test I use now is to ask: if I remove this space, does anything become ambiguous? Usually something does. Two sections merge visually. A label floats loose from what it belongs to. An action stops feeling distinct from the content it operates on. That ambiguity was always latent — the space was suppressing it.",
      "There's room in every layout to tighten some things and loosen others. But I've learned to distinguish space that's filling from space that's working. The filling kind can go. The working kind has a job. Before I cut a margin, I want to know what it was doing.",
    ],
  },
  'consistency-revealed-what-i-hadnt-actually-decided': {
    title: "Consistency revealed what I hadn't actually decided",
    date: '06/19',
    body: [
      "Components look finished when they're built for one context. The button works, the card renders, the modal opens and closes. Everything is tested against the scenario you had in mind when you designed it. Then you start using the component everywhere, and the edges show.",
      "I've found that inconsistency in a design system is rarely caused by carelessness. It's caused by incompleteness. A card component that works for a product listing breaks on a profile page not because someone made a mistake, but because the card was never designed to hold a human face and a timestamp and a paragraph of unstructured text. The card knew one thing: it knew the data it was designed for.",
      "Applying a component consistently is a test. It finds the decisions that were deferred, the assumptions that were baked in, the questions that felt obvious when you had one example and become real when you have ten. A button that looks fine with two words of copy can feel meaningless with eight. A tooltip designed for a short label wraps awkwardly with a full sentence.",
      "What I started doing is designing with at least three different content shapes before I finalize any component. Not just the clean example, but the short version, the long version, and the broken version — something with missing data, something with text that wraps. The third example is always the most revealing. It shows me what the component was actually designed to handle, and what I was quietly hoping wouldn't happen.",
      "Consistency doesn't create problems. It surfaces them. If applying a component creates awkwardness, the awkwardness was already there — hiding in the first example I let stand.",
    ],
  },
  'fixed-elements-are-a-contract-not-a-convenience': {
    title: 'Fixed elements are a contract, not a convenience',
    date: '06/18',
    body: [
      "Sticky positioning feels generous. The user scrolls away from an important button, and instead of letting them lose it, you bring it along. The intent is helpful. But making something fixed also makes an argument about relevance: this element matters everywhere on this page, at every scroll depth, in every context. That's a strong claim. Most sticky elements can't defend it.",
      "I started auditing sticky components the same way I audit copy: by asking whether the claim was true. A sticky nav bar says navigation matters everywhere on this page. Usually that's right. A sticky action bar at the bottom of a long form says this action is always available — also defensible, since the form is continuous and the submit button should follow. But a sticky sidebar CTA on a blog post? That's saying \"sign up for the newsletter\" is relevant no matter what part of the article you're reading. It's not. It's just optimizing for the edge where the user forgets they're supposed to convert.",
      "When designers reach for sticky as a rescue for a button that gets scrolled away, the question isn't \"should this be sticky?\" It's \"why is this button getting abandoned?\" Usually the answer is that the page is too long, the CTA came too early, or the hierarchy is making something feel lower priority than it is. Sticky masks the symptom. The layout still needs to be fixed.",
      "I've started treating every sticky element as a claim I have to make aloud: this information is always relevant at this point in the flow. If I can't say it with confidence, I take the sticky off and solve the real problem.",
    ],
  },
  'i-stopped-designing-at-150-zoom': {
    title: 'I stopped designing at 150% zoom',
    date: '06/17',
    body: [
      "Working at 150% zoom in Figma became so normal that I stopped noticing I was doing it. The canvas felt comfortable. Fine details were easy to see. I could adjust spacing precisely, read small type, and evaluate alignment without straining. My designs looked considered and deliberate at that scale.",
      "Then they'd get implemented, and I'd open the page on my laptop and something felt wrong. Buttons that looked spacious in the file were cramped on screen. The body copy I'd set at 14px seemed smaller than I remembered. The secondary text at 12px was genuinely hard to read. I kept sending back feedback that felt like nitpicks — \"can we increase the padding here?\" — without understanding why I kept needing to.",
      "The problem was that I was making judgment calls against a version of the design that didn't exist anywhere except my canvas. At 150%, a 16px font renders roughly as large as 24px text would appear on screen. My visual quality sense was calibrated to a size my users would never see.",
      "When I made a rule to preview at 100% before any design decision felt final, everything shifted. Padding that seemed generous at scale looked thin. Hit targets that had appeared comfortable were barely at the minimum. Details I'd considered deliberate disappeared into ambiguity. I started sizing up from what worked at actual size, not refining down from what worked inflated.",
      "The zoomed-in view is still useful — for fine pixel work, for evaluating type rendering, for precisely aligning small elements. But the decision layer belongs at 100%. That's the only canvas that corresponds to a screen someone will actually look at.",
    ],
  },
  'input-width-tells-users-how-much-to-write': {
    title: 'Input width tells users how much to write',
    date: '06/16',
    body: [
      "The width of a text field is part of the question. I didn't think about this consciously for years — I sized inputs to fit the grid, to align with other fields, to look proportional. The width was a layout decision. Then I started noticing how fields were leading users toward certain kinds of answers.",
      "A narrow input communicates: short. A first name field at 120px wide feels right. A phone number field should be about the length of a phone number. When I put a notes field at the same width as a single-line name field, something felt off — not because of any visible error, but because the spatial contract implied \"write a bit\" when I actually wanted \"write as much as you need.\" The textarea needed to be wider and taller, not as an aesthetic choice but as an instruction.",
      "I noticed this most sharply on a form where someone had crammed a long free-text field into the same narrow column as a zip code. Users were writing one-sentence answers to a question we'd intended to be open-ended. The field was telling them to be brief. They listened.",
      "Width isn't just layout; it's communication. A form field that asks \"describe your project\" should feel spacious before the user types a single character. The proportion of the field predicts what's expected. A mismatch between the field's size and the expected answer length creates a quiet dissonance — users either under-fill or feel like they're overflowing something that wasn't designed for them.",
      "Now I size form fields based on what they're asking for. Short codes get narrow fields. Open-ended prompts get generous ones. The width becomes part of the question, not a side effect of the grid.",
    ],
  },
  'keyboard-order-showed-me-my-true-layout-hierarchy': {
    title: 'Keyboard order showed me my true layout hierarchy',
    date: '06/15',
    body: [
      "Tab order exposed something in my layouts that spacing and sizing had hidden. When I pressed Tab through forms I'd built, the focus jumped around in ways that made no sense — not randomly, but in the order I'd written the HTML, which wasn't always the order I'd designed the visual flow. The sequence was technically correct; the intent was invisible to it.",
      "I started paying attention to this after watching someone navigate a settings page with only a keyboard. They were fast — more efficient with keyboard than most mouse users — and they got genuinely stuck. The tab sequence skipped over a conditionally visible section, then circled back to a nav link they'd already passed. It wasn't broken. It just wasn't designed.",
      "The thing I keep coming back to is that keyboard order is a layout opinion. A visual design can imply hierarchy through size, position, and weight, but the tab sequence has to commit. It can't equivocate. When I finally started explicitly reasoning about what should come first, second, and third under keyboard navigation, I found myself resolving ambiguities I hadn't known were there. Should this secondary action come before or after the primary one? In tab order, you can't defer that question.",
      "Now I press Tab early in the design process, not just at the end during accessibility review. The order usually needs adjustment, which means the DOM order needs adjustment, which sometimes means the visual layout was misleading about what it actually thought the flow should be. The keyboard catches what the eye lets pass.",
    ],
  },
  'color-modes-taught-me-what-was-actually-structural': {
    title: 'Color modes taught me what was actually structural',
    date: '06/14',
    body: [
      "Dark mode was the most revealing audit I've done as a designer. Not because implementing it was technically hard, but because it forced a question I'd been quietly avoiding: why does each color exist?",
      "Most of my early color work was intuitive. I'd adjust values until things looked right — a warm background, a medium gray for borders, a particular blue for links. The choices held together in light mode because they'd evolved together, each value reacting to the others. When I tried to translate the system to dark, the intuition broke. I couldn't just invert the values. Things looked wrong in ways I couldn't name.",
      "What I had to do was go back to the intent behind each choice. The white background wasn't white because white is default — it was white because that surface is the highest layer in the visual stack. The gray border existed to separate surfaces, not to look neutral. The secondary text color was a subordination decision. Every color had a role. Understanding the role told me what dark mode actually needed.",
      "Surfaces that carry meaning translate across modes. Surfaces that are just 'how it looked' don't. That distinction showed me which parts of my system were designed and which parts had just accumulated. Structural decisions — surface hierarchy, contrast levels, affordance colors — mapped cleanly. Decorative ones had to be reinvented.",
      "Now I design with both modes in mind from the start, not as a requirement but as a test. If I can explain why a color exists in terms of its role, I can make it work in any context. If I can't, I haven't finished. Dark mode didn't change my thinking. It showed me where the thinking hadn't happened.",
    ],
  },
  'border-radius-is-a-personality-decision': {
    title: 'Border radius is a personality decision',
    date: '06/13',
    body: [
      "For a long time I treated border-radius as a finishing detail. I'd build everything and then dial the corners until they felt right — which usually meant copying whatever the design system defaulted to. Four pixels was common. Eight when I wanted things to feel more modern. The choice felt aesthetic, minor. I wasn't really deciding anything.",
      "I started to see otherwise when I worked on two products at once: one for enterprise finance, one for a consumer journaling app. I applied similar radius values to both. The journaling app felt clinical. The finance product looked like it was trying too hard to be friendly. Same corners, two wrong answers. That's when I started thinking about radius as a voice, not a detail.",
      "Sharp corners read as precise, formal, capable. Fully rounded shapes feel warm, accessible, a little casual. Neither is better — they're positioning decisions. A business intelligence tool and a meditation app sit in very different places on that spectrum, and the right radius for each isn't arbitrary. It reflects what the product is actually trying to make people feel.",
      "What I do now is decide on a stance before touching components. Not a number — a direction. Capable and serious, or approachable and human? Once I've answered that, the right value becomes much easier to find. And I apply it consistently. Mixed radii — a rounded button next to a sharp card — communicate indecision. Consistency is how you make a stance legible.",
    ],
  },
  'touch-targets-made-me-more-generous-everywhere': {
    title: 'Touch targets made me more generous everywhere',
    date: '06/11',
    body: [
      "Designing for touch first changed something in how I think about interactive space, even on desktop. A 44px minimum tap target is the kind of rule that sounds arbitrary until you try hitting a 20px icon with your thumb while scrolling. Then it stops being a guideline — it becomes a physical fact about hands.",
      "What surprised me was how much this thinking started to influence my desktop work. I'd spent years sizing clickable elements to look right without considering the actual interactive area. A 12px \"edit\" link in a table cell looked clean. But to click it, you had to park a cursor on a narrow strip of text and press — which felt fine with a mouse until I watched someone navigate that same table with a trackpad.",
      "Trackpads aren't mice. Precision on a trackpad takes effort. The distance between a cell and an edit action two rows down is a real cost, even when the visual design doesn't acknowledge it. I started adding invisible padding — extending hit areas without changing how anything looked. Nobody sees it. Most people feel it as the vague sense that something is easy to use.",
      "The generous target is a form of trust. It says: I expected you might not land perfectly. That quality — the sense that an interface accommodates you rather than requiring you to accommodate it — is hard to name but easy to feel. It shows up in feedback as \"it just feels nice\" without anyone ever explaining why.",
      "I now apply touch-scale thinking to all my interactive targets, even on interfaces that will never see a phone. The discipline of mobile constraints made my desktop work more human. Sometimes the most useful design rules come from a context you're not building for.",
    ],
  },
  'gray-has-temperature-and-it-changes-everything': {
    title: 'Gray has temperature and it changes everything',
    date: '06/10',
    body: [
      "For years, I thought gray was the safe choice. Not a color, really — just absence. Wherever I wasn't sure what to do, I reached for gray: backgrounds, borders, secondary text, disabled states. It felt like restraint.",
      "Then I started noticing that some of my interfaces felt fractured in a way I couldn't diagnose. Everything was aligned, the type was right, the spacing was consistent — but something was off. It took me a while to trace it to the grays.",
      "Grays have temperature. A gray with a slight blue cast and a gray with a slight yellow cast can have identical lightness values and still feel like strangers next to each other. One reads as cool, clinical, modern. The other reads as warm, organic, slightly aged. When you mix them — even subtly — the interface carries an internal disagreement that the eye picks up and the brain calls discomfort.",
      "I'd been pulling grays from different sources without realizing they had incompatible temperatures. The border came from one system, the background from another, the disabled text from a copied snippet. Each one worked in isolation. Together, they didn't.",
      "What helped was picking a direction first. Warm or cool? One temperature decision, applied everywhere. My backgrounds, borders, dividers, placeholder text, and disabled states all draw from the same hue angle. They may be different lightness levels, but they're related. They belong to the same light.",
      "The discipline matters in dark mode too, maybe more. Cool blacks and warm charcoals on the same screen feel like two different products sharing a viewport. Choosing your gray temperature is one of the quietest, most load-bearing decisions a visual system can make.",
    ],
  },
  'i-started-treating-density-as-a-user-promise': {
    title: 'I started treating density as a user promise',
    date: '06/09',
    body: [
      "Most arguments about density go nowhere useful. How much information per screen, how tight to make the rows, whether to collapse or expand by default — these get treated as aesthetic questions. Do you want it to breathe? Does it look modern? The conversation stays abstract because nobody's anchored it to a user.",
      "Density is a promise. A sparse layout says: take your time, nothing here requires prior knowledge, newcomers are welcome. That's useful at the right moment — onboarding, consumer flows, anything where a first-timer's comfort matters. But the promise has a shelf life. Once someone uses the product every day and knows exactly what they're doing, the whitespace stops being welcoming. Every scroll to reach a value they need, every extra click through an expanded container, is friction on behalf of a user who isn't there anymore.",
      "Dense layouts make the opposite promise: this was built for someone who already knows what they want. They're faster, more navigable when you're fluent, and genuinely hostile when you're not. This is why trading platforms and code editors and administrative tools feel impenetrable to newcomers — not because they're poorly designed, but because they were optimized honestly for a different person.",
      "The mistake I kept making was treating density as a visual setting I could adjust independently of everything else. Once I started understanding it as a contract, I had to ask a different question first: how often does the primary user return, and what do they already know when they arrive? Daily, expert, high-frequency — make it dense. Occasional, varied, exploratory — give it room. The density should flow from the answer to that question, not from how many things I wanted to fit on the screen.",
    ],
  },
  'shadows-only-work-when-the-light-source-agrees': {
    title: 'Shadows only work when the light source agrees',
    date: '06/08',
    body: [
      "There's a habit I fell into early: adding box shadows to elements one at a time, adjusting each until it looked right in isolation. A card got a soft shadow. A modal got a heavier one. A dropdown had its own. When I laid them all out together, something felt off — not broken, just slightly unconvincing. The kind of thing you sense before you can name it.",
      "The problem was the light source. Every shadow implies one. A shadow offset below and to the right means the light is above and to the left. When I'd been tuning shadows individually, I'd quietly introduced three or four different implied light sources into the same screen. Nothing agreed. The depth was technically present but spatially incoherent.",
      "Real objects in real light exist in the same environment. A card and a modal and a dropdown aren't three separate decisions — they live in the same interface, under the same implied sun. When I started treating light direction as a fixed constant — one offset direction for the whole system, one elevation scale where deeper layers cast longer and softer shadows — the UI felt more grounded. Not dramatically better, but unambiguously more real.",
      "The test I use now is to look at a screen and ask: where is the light coming from? If I can't answer that consistently across every raised element, the shadows need another pass. Shadows that don't agree are worse than no shadows at all. They introduce a quiet contradiction the eye keeps trying to resolve, and most users will just feel something is slightly off without ever knowing why.",
    ],
  },
  'i-design-with-real-data-now-always': {
    title: 'I design with real data now, always',
    date: '06/07',
    body: [
      "For a long time I used lorem ipsum and placeholder content while designing. The layouts looked clean, the cards felt balanced, everything sat exactly where I put it. Then I'd hand off to an engineer and within a week something would break — a name too long for its container, a description that pushed a button off screen, a number with too many digits for the column I'd allocated.",
      "The mistake wasn't in the engineering handoff. The mistake was mine. I'd been designing for the best possible input, not the real one. Lorem ipsum is about 40 characters on average. Real product descriptions are sometimes 400. Real user names aren't \"John Smith\" — they're \"María José Rodríguez-Hernández\" or a single initial followed by nothing.",
      "Now I pull real data from the actual product before I touch a single layout decision. I paste in the longest names, the most verbose descriptions, the edge-case numbers. What happens is useful: designs that looked tight suddenly look cramped, hierarchies collapse, elements I thought were secondary turn out to be primary once I see how often they actually appear.",
      "Real data is like a stress test for hierarchy. It shows you what your layout actually thinks is important versus what you wanted it to think. The discomfort of watching a design break under real content is worth more than the comfort of a layout that only ever held ideal input. I don't reach for placeholder text anymore — the real stuff is always more honest about what I still have to solve.",
    ],
  },
  'friction-reveals-what-users-actually-want': {
    title: 'Friction reveals what users actually want',
    date: '06/06',
    body: [
      "Friction is usually treated as a problem to eliminate. But when I started watching people actually use things I'd built — not in usability studies, but in the real messy ways people use software — I noticed that where users slowed down or worked around something told me more about their actual goals than anything they said out loud.",
      "There's a feature I spent three weeks designing: a way to bulk-edit records. Clean UI, keyboard shortcuts, intuitive selection model. Almost nobody used it. Instead, they kept opening individual records one at a time, making the same edit, closing, opening the next. I initially read this as a discoverability failure. Then I watched more closely. They weren't failing to find bulk edit — they were reading each record while they edited it. The task wasn't \"apply this value to all these records.\" It was \"evaluate each record and decide whether this edit applies.\" The friction was the workflow.",
      "Removing the friction would have meant removing the pauses. The individual opens were the feature. I'd designed a time-saver for a task that wasn't meant to be fast.",
      "Now I try to distinguish between friction that harms and friction that informs. Friction that harms is the field you can't tab out of, the error that doesn't explain itself, the step that exists for the system's sake rather than yours. Friction that informs is the hesitation before clicking Delete, the moment a user re-reads a confirmation, the pause before committing. That second kind is something I've started protecting rather than smoothing away.",
      "The patterns people invent around your design are a more accurate product brief than any spec doc. They're showing you what they need when the designed path doesn't quite fit.",
    ],
  },
  'i-cut-half-my-font-sizes-and-gained-hierarchy': {
    title: 'I cut half my font sizes and gained hierarchy',
    date: '06/05',
    body: [
      "For most of my early design career, I thought hierarchy was a size problem. A heading should be big. A subheading slightly smaller. Body copy smaller still. I'd end up with six or seven distinct sizes on a single screen — 32, 24, 20, 16, 14, 12, 11 — and wonder why the page felt cluttered even when the spacing was generous.",
      "The turning point was working within a design system that had already constrained the type scale to three sizes: 18, 14, and 12. At first it felt limiting. I didn't see how I could create the hierarchy I needed without pulling from more rungs on the ladder. Then I started building with those three sizes, and something clicked.",
      "Hierarchy doesn't come from size alone. When you don't have a fourth size to reach for, you use weight, color, and letter-spacing to do the work. A section label at 12px in uppercase, widely tracked, in a tertiary color becomes visually subordinate to 14px body text in a primary color — even though a label traditionally precedes content and carries some authority. The hierarchy is built through contrast across multiple dimensions at once, not just one.",
      "What I found is that fewer sizes force you to be deliberate about everything else. You can't hide a weak color decision behind a dramatic size jump. The type scale becomes a constraint that sharpens the rest of your choices.",
      "I still choose type scales carefully. But my starting point is now \"how few sizes can I use?\" rather than \"which sizes do I need?\" The smaller the scale, the more honest the hierarchy has to be.",
    ],
  },
  'monospace-numbers-made-my-tables-easier-to-read': {
    title: 'Monospace numbers made my tables easier to read',
    date: '06/04',
    body: [
      "For years, my data tables looked subtly wrong and I couldn't figure out why. Columns of numbers never quite aligned the way they should. I'd try adjusting spacing, tweaking padding, wondering if the font was the problem. Then I learned about tabular numbers.",
      "Most typefaces render digits proportionally — a \"1\" takes up less horizontal space than an \"8,\" just like letters do. This is fine for body copy. Numbers in a sentence don't need to line up vertically. But in a table, column, or any numeric sequence meant to be read top to bottom, proportional digits create misalignment that looks like a spacing error when it's actually a typography feature doing the wrong job.",
      "The fix is one CSS property: `font-variant-numeric: tabular-nums`. It switches the font to its tabular numeral variant, where every digit occupies the same horizontal width. The difference is subtle but immediate — columns of prices, quantities, and dates suddenly read as columns instead of staggered noise.",
      "What surprised me was how long I'd been approximating this with monospace fallbacks or manual letter-spacing tweaks. I'd sometimes swap in a monospace font just for number columns, which introduced a new problem: the type character changed. `tabular-nums` doesn't change the typeface, just the glyph metrics. The numbers still belong to the same visual system.",
      "Now I apply it anytime I display numbers meant to register vertically: data tables, stat blocks, timestamps in logs. It's one of those typography features that sits hidden until you need it, and then you can't unsee the problem it solves.",
    ],
  },
  'naming-things-forced-me-to-think-more-clearly': {
    title: 'Naming things forced me to think more clearly',
    date: '06/03',
    body: [
      "I used to name things generically. A button was primary-button. A card was product-card. Modals were modal-1, modal-2, until they weren't. The names held as long as the design did, and then they didn't hold at all.",
      "The moment I started working more seriously on a component system, the naming fell apart immediately. I had two things that looked like cards but did different jobs. One showed summary information and linked out. The other allowed inline editing. I kept calling them both \"cards,\" which meant I couldn't talk about them without a paragraph of context, and I couldn't scan a page map and know which was which.",
      "When I finally forced myself to name them based on what they did — not what they looked like — I had to understand them clearly enough to write one word that captured their purpose. That exercise surfaced something uncomfortable: I hadn't actually decided what each component was for. I was describing their appearance because I hadn't finished thinking through their role.",
      "This happens in product design too, not just systems. When I find myself calling something \"the detail view\" or \"the settings section,\" that vagueness is usually a sign the purpose is still blurry. Meaningful names require resolved intent. You can't name a thing you haven't defined.",
      "Now I treat naming difficulty as a design signal. If I'm struggling to describe a component in one to three words, the design isn't done. The name is a test I give myself: does this concept have a center of gravity? If I pass, I know I understand it. If I fail, I know exactly what to go back and figure out.",
    ],
  },
  'contrast-ratios-changed-how-i-see-everything': {
    title: 'Contrast ratios changed how I see everything',
    date: '06/02',
    body: [
      "I started paying attention to contrast ratios because of an accessibility audit. The kind where a tool highlights your text in red and tells you it fails WCAG AA. At first I treated it like a compliance checkbox — adjust the color until the number passes, move on.",
      "But then I started actually reading the numbers. A 2.5:1 ratio versus a 7:1 ratio isn't just a technical distinction. It's the difference between text that asks to be read and text that demands to be. Understanding that forced me to think about why I was choosing low contrast in the first place.",
      "Mostly I was doing it to look sophisticated. Subtle grays felt more refined than stark black. But sophistication was getting confused with legibility. I was making users work harder to extract information so the interface could look calm.",
      "Now I think about contrast as structure. High contrast draws the eye first. Medium contrast fills the supporting role. Low contrast creates texture without competing. When I lay out a page this way deliberately — not just adjusting until things pass — the hierarchy emerges from the values themselves rather than from spacing or size tricks.",
      "The numbers give you a language. 4.5:1 is the floor for readable text. 7:1 is where things become effortless. Anything below 3:1 is decorative at best. Knowing these anchors didn't make me a more mechanical designer — it gave me precision where I used to have intuition. And the intuition got sharper for it.",
    ],
  },
  'numbers-lie-about-where-the-center-is': {
    title: 'Numbers lie about where the center is',
    date: '06/01',
    body: [
      "There's a version of centered that CSS computes and a version that your eye perceives, and they're almost never the same thing.",
      "I spent a long time treating centering as a solved problem. `margin: 0 auto` on a container, `align-items: center` on a flex parent — done. But when I started paying close attention to whether things actually looked centered, not just computed to be centered, I kept finding they didn't.",
      "An icon with visual weight distributed toward the bottom looks high when placed at the mathematical center of a button. Move it one or two pixels down and suddenly it looks right. The math didn't change; the perception did. This happens constantly with common icons — a house, a lock, a trash can — shapes that carry most of their mass in their lower half.",
      "The same thing happens with text inside capsule buttons. Equal padding above and below the label often looks like the text is sitting too low. Capital letters have tall ascenders and shallow descenders, so the eye reads the visual midpoint differently than the arithmetic one. Type designers compensate for this manually, even in digital type. They call it optical adjustment. I didn't know that word for years, but I kept bumping into the problem.",
      "What this has taught me is that design is a perceptual discipline before it's a mathematical one. Numbers define starting points and systems of constraint. But the final call is always about what reads as right — as balanced, centered, stable — to the eye receiving it. When I override a technically correct value with something that just works visually, I'm not being imprecise. I'm finishing the job.",
    ],
  },
  'i-used-to-remove-focus-rings': {
    title: 'I used to remove focus rings',
    date: '05/31',
    body: [
      "The first production stylesheet I ever shipped had `outline: none` in it. I was building something in a hurry, and the blue ring that appeared on clicked buttons felt accidental — a leftover from a browser making its best guess at a UI I'd already designed. Removing it took one line. Done.",
      "I removed focus rings reflexively for years after that. They were always in the way of something cleaner. They clashed with the rounded corners I'd carefully chosen. They appeared on things I assumed users would never navigate to with a keyboard. And then I watched someone actually use a keyboard to navigate a product I'd built.",
      "They hit Tab to get to a form field, and nothing happened. The field received focus — the cursor was there — but there was no visible indicator of where they were on the page. They tabbed through it twice before giving up.",
      "The ring isn't decorative. It's a cursor for people who don't use a mouse. Removing it because it looks bad doesn't eliminate the need — it just means the need goes unmet invisibly. That's worse than the default browser styling. At least the ugly ring told you something true.",
      "What I do now is treat the focus style as a design constraint, not a browser default to override. The question isn't whether to show a focus indicator, but what it should look like in this specific system. A 2px offset ring in the brand's accent color tends to feel intentional rather than leftover. If the browser default clashes, the answer is to design a better one, not to hide it.",
      "The `:focus-visible` pseudo-class helped me let go of the original complaint. It restricts the ring to keyboard navigation, so it doesn't appear on click. Most of what I was removing wasn't actually a problem with the ring — it was a problem with when it appeared. The solution was precision, not suppression.",
    ],
  },
  'line-length-is-the-most-ignored-typographic-decision': {
    title: 'Line length is the most ignored typographic decision',
    date: '05/30',
    body: [
      "Most typographic advice circles around the same decisions: which typeface, what size, how much weight. These are visible choices — easy to compare, easy to debate. Line length is different. It gets set once, usually as a side effect of the container width, and then it's essentially forgotten.",
      "I noticed it on a product I used daily for months before something clicked. The body copy was exhausting to read, and I kept attributing it to the font. Then I put a character counter on it: lines were running to about 110 characters. That's nearly double the range that makes reading comfortable.",
      "The research on this is old and consistent. Somewhere between 55 and 75 characters per line is where reading feels natural — it matches how the eye moves across a line and returns to find the start of the next one. Too short and the rhythm becomes choppy. Too long and the eye drifts, loses its place, or gives up. Most people don't consciously notice when it's wrong. They just find the reading tiring.",
      "The problem in digital design is that column width usually comes from layout constraints, not reading ones. A container is 720px wide because the grid is 720px wide, not because anyone asked what the optimal measure would be at that typeface and size. The type fits, so no one questions it.",
      "What I try to do now is treat line length as an input, not an output. I pick a measure I'd want to read, then derive the container size from it — not the other way around. It's a small inversion, but it puts the reading experience first instead of last.",
    ],
  },
  'loading-states-tell-the-truth-about-your-architecture': {
    title: 'Loading states tell the truth about your architecture',
    date: '05/29',
    body: [
      "There's a moment after you click something — before the result appears — where the interface either earns your trust or loses it. Most teams treat loading states as an afterthought: a spinner placed last, or nothing at all. But I've come to see them as one of the most honest parts of a product.",
      "A loading state that drags too long means something is slow. A skeleton that doesn't match the real content layout reveals that the loading UI was designed separately from the destination. A spinner with no sense of timing implies the team never thought about how long the operation takes. All of that is legible, if you know what to look for.",
      "When I'm using a product I've never seen before, I watch the loading states the way you'd watch someone's face when asked a hard question. The delay, the shape, the entrance transition — they tell you how much attention was paid to the space between intention and result. A thoughtful loading state means someone modeled the user's experience, not just the server's.",
      "I've started using loading state design as a diagnostic for my own work. When I can't sketch a skeleton screen, it usually means I don't fully understand the final layout yet. When the perceived wait feels wrong, something in the data structure or fetch logic needs rethinking. The loading state is the symptom. The architecture is the cause.",
      "Most users won't name this. They'll just say the product feels fast or slow, polished or rough. The loading states are usually why.",
    ],
  },
  'i-stopped-adding-borders-and-started-adding-space': {
    title: 'I stopped adding borders and started adding space',
    date: '05/28',
    body: [
      "Borders are a crutch I used for years. Whenever a section felt unclear, whenever two elements seemed to bleed into each other, my first instinct was to draw a line between them. It looked decisive. It felt like I was solving something.",
      "But a border is an admission. When I add a divider between two rows in a form, I'm confessing that my spacing isn't doing enough work to show they're distinct. A horizontal rule in the middle of a settings panel usually means the groupings weren't clear before it showed up. The border patches the layout without fixing the problem underneath.",
      "What changed for me was sitting with Gestalt principles more seriously — specifically proximity. Elements that are close together are perceived as a group without any marking at all. Enough white space between two things can separate them more cleanly than a line ever could. The border becomes redundant when the space is doing its job.",
      "I audit borders now with a simple test: if I remove this, do things still make sense? More often than I expect, the answer is yes. The border was compensating for insufficient margin, or masking the fact that I hadn't decided what belonged together. When I delete it, I have to solve the real problem — tightening the related things and increasing the gap to the unrelated ones.",
      "There are borders I keep: table rows with repeating data, ruled lines in long-form editorial layouts, hairline dividers in dense UIs where space is genuinely constrained. But those are justified exceptions, not reflexes. If I can't explain why a border is there, it usually shouldn't be.",
    ],
  },
  'alignment-reveals-what-you-actually-believe-about-hierarchy': {
    title: 'Alignment reveals what you actually believe about hierarchy',
    date: '05/27',
    body: [
      "Most of the time when I adjust alignment, I'm pretending it's aesthetic. I move something from left to center, or nudge a caption to match the column it lives in, and I tell myself I'm cleaning up the visual surface. Then I started noticing that I could trace almost every alignment choice back to a belief about relationships — about what belongs to what, and what should feel separate.",
      "Left-aligned text in a card says: this content is in a list, each card is a unit, the edges create a rhythm. Center-aligned text says: this is isolated, this needs to feel considered on its own terms. When I mix both in the same view without thinking about it, I'm not making a design choice — I'm making a disagreement visible. The eye catches it, even when the user can't name it.",
      "The alignment decisions I've regretted most came from copying what looked good in isolation. A center-aligned headline felt editorial in a hero section, so I tried it for section labels too. It fell apart. The labels were navigational, not expressive — they needed to sit flush with the content they introduced, not float above it as if they were titles of their own. Same technique, wrong context.",
      "What I've started doing is asking: what's the primary axis of this layout, and do my alignment choices reinforce or fight it? A grid-heavy page wants left and right edges to register. A long-form reading experience might want centered type to slow you down. Once I can answer that honestly, most alignment problems resolve themselves. The ones that don't usually mean the layout itself is unclear — and alignment is just the symptom showing up first.",
    ],
  },
  'truncation-is-a-judgment-call-not-a-solution': {
    title: 'Truncation is a judgment call, not a solution',
    date: '05/26',
    body: [
      "Every time I truncate text, I'm making a decision about what the user needs to know right now. That framing changed how I approach it.",
      "For a long time I treated truncation as an engineering inevitability — text is long, containers are fixed, ellipsis fills the gap. But an ellipsis is a signal: there's more, and I've decided you don't need it. That's a real choice. It carries an opinion about what's worth surfacing.",
      "The problem with most truncation isn't the truncation itself — it's that it pretends to be complete. A truncated label in a table cell looks like a label. The ellipsis at the end is easy to miss. Users make decisions based on what they can see, and what they see is partial. When they eventually discover the rest, the interface has already misled them.",
      "The pattern I keep trying to avoid is truncation plus tooltip. It's seductive because it feels responsible — the information is technically accessible. But it buries content behind a gesture most users won't make. If the full text matters enough to reveal on hover, it usually matters enough to show.",
      "What I ask myself now is: what created the constraint that made truncation necessary? Sometimes the container is too small for the content and the layout needs to flex. Sometimes the content is genuinely too long and the problem is upstream — in the content model, or in how the feature was specified. Truncation that solves a layout problem without acknowledging the content problem just relocates the issue.",
      "When I do truncate, I try to make the incompleteness obvious: a fade rather than ellipsis, an explicit \"See more,\" something that signals the clip point clearly. The ellipsis is a polite lie. I'd rather be upfront about what I'm hiding.",
    ],
  },
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
