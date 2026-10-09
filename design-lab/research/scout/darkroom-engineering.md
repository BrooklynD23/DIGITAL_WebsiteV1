# darkroom.engineering — https://darkroom.engineering
Category: creative-technology studio (engineering collective). Why: single-colour red-on-black system, monospace micro-type, huge pixel-display H1, tight grid with visible rules; open-source posture ("become an open source sponsor"). Pick reason: best fit for "engineering lab + studio" register.
Capture: standalone headless Chromium; refs in design-lab/references/darkroom-engineering/. Project videos render dark/blank in headless.

## Narrative
1. Header strip: pixel-glyph rows + domain label + WORK / ABOUT / CONTACT in red boxes
2. H1 "Where things get developed" at 200px custom display font, full-width
3. Dictionary-style definition "[ darkroom ], noun" (two senses) + 1 paragraph offer + MANIFESTO button
4. Three selected work entries: huge title over full-bleed video/image, one-line caption in mono ("just three builds we liked for different reasons"), ALL WORK button
5. Clients/testimonials, open-source tools block ("tools we build and use. now yours too"), capabilities, services, clients lists
## Type
therma (display, 200px/ls -10px, H2 120/700), sauce, mono (10px/200, caps). Everything uppercase mono for body.
## Color
Black bg; ONE red (lab(49.9 73.4 57) ~ #e8141c) for all type, borders, buttons; project media supplies all other colour.
## Layout
CSS vars: 4 columns on mobile (375 design width), --gap/--safe 8px scaled via vw, --header-height 28. Fluid vw-based grid, 1px rules between sections. Page ~8600px.
## Motion: full-bleed project video panels (seen); other motion not verified in static capture. Fallback behaviour unknown.
## Project/people/CTA
- Projects: huge title + full-bleed media + 1 line; honest "small sample" copy.
- No member faces on first screens; sponsor CTA fixed in footer ("become an open source sponsor").
- Rhetoric: dictionary definition + competence claim (design, engineering, system thinking together).
## Mobile: type scales to full-width, red-box nav collapses to menu icon; very legible (mobile.png).
## Steal as principle
1. One accent colour carries the whole system when imagery supplies the rest.
2. Dictionary-definition opener as the mission statement.
3. Fixed footer bar with the single recurring ask (sponsor/join).
## Avoid
1. All-caps mono body hurts long reading and AA at 10px. 2. Heavy video w/o fallback. 3. Client-service framing (DIGITAL is not an agency).
## Tech observed: no gsap/THREE/Lenis window globals found (likely bundled/module); custom vw grid via CSS vars.
