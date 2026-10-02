# Hack Club — https://hackclub.com
Category: builder community (teen nonprofit). Why: warmest, most distinctive identity in the set; sketched-blueprint motifs, real photography, sticker-and-mail metaphors. Pick reason: shows how "scrappy maker" can still be crafted.
Capture: standalone headless Chromium; refs in design-lab/references/hack-club/.

## Narrative
1. Hero: serif H1 w/ one gradient word, email-field "Join!" inline signup, age gate note, scattered tilted photos framing the headline, hand-drawn hardware sketches
2. "Imagine a world where you made this:" rotating member-project cards (creator name/age/place, live link + source)
3. "...where you were here:" events (hackathon + game-jam clips, each with its own logo and a one-line fact)
4. YouTube thumbnails as proof of repeated execution ("done this countless times")
5. "Imagine a world where you joined" -> repeat join CTA
6. Donors/partners line ("run by teens, made possible by donors, successful with partners")
7. "Everything that comes with joining": community, HCB, 1,500+ clubs
## Type
zarathustra (display serif) H1 90px/400, H2 40px; phantomSans body 20px; cormorant + geologica loaded. Color #17171d on #fff.
## Color
CSS vars: --background #fff, --foreground #17171d, --surface #f9fafc, --border #00000014, --muted #17171db3, dark-mode toggle in nav. Accent: warm red/pink + gradient on single word.
## Layout
Centered stack, ~1030px content, photos bleed to the edges. Page ~8400px.
## Motion
Tilted photo collage, sticker overlays, wavy section dividers; dark-mode toggle. Static capture only; animation not verified.
## Project/people/CTA
- Projects humanized: name, age, location, program + play link AND source link.
- Join = email field inline in hero (lowest possible friction); repeated 3x. Repeating "Imagine a world where you..." frames each section as a second-person future.
- Sponsors: donors named by role, phrased as support not endorsement.
## Mobile: stacks; email field + CTA stay one row; photo collage hidden/reduced, sticker mail graphic remains.
## Steal as principle
1. Join form lives in the hero (one field), not behind a button.
2. Every project shows who made it + a "use it" link and a "read the source" link.
3. Repeating a second-person sentence stem to chapter the page.
## Avoid
1. Sticker/cartoon whimsy is teen-brand, wrong register for a studio. 2. Gradient word in headline is a SaaS cliche if copied. 3. Collage clutter hurts mobile.
## Tech observed: no gsap/THREE/Lenis globals (detection is window-only).
