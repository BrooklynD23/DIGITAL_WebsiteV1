# SCOUT-3 summary: landing and product pages
Method note: chrome-devtools MCP browser was down (Target closed) for the whole run; I used local headless Chromium (Playwright) instead. Static captures only; motion claims are limited to what DOM/globals/screenshots show. HealthCentral blocked (403 bot page): not scouted.

## Pick list (9 sites, one line each)
1. teenage.engineering - hardware: a product company run like a design studio; art direction carries the brand.
2. Nothing - hardware: dot-grid + mono/serif pairing; product as specimen; shows geo/cookie modal risk.
3. Framework - hardware: modularity shown as flat-lay parts; closest to "different parts, one product".
4. Linear - dev tool: real product data as the hero; best type/tracking discipline.
5. Vercel - dev infra: one focal animated shape, heavy negative tracking, stat+logo proof.
6. Raycast - dev tool: interaction demos in cards; role/platform-aware CTA; (hero glow = anti-pattern).
7. Rive - design tool: labelled sample rail of real work + copy-paste CLI CTA next to sign-up.
8. Playdate - consumer: plain-language sentences, one field colour, a "make your own" builder band.
9. HealthCentral - requested content page: blocked, see healthcentral.md.
Why these for DIGITAL: all sell something built by makers; each shows the artefact itself, not stock imagery.

## Cross-site patterns
- Narrative order (7 of 8 scouted): promise -> the actual artefact -> index of what exists -> 2-col "label | body" sections -> proof -> one CTA pair -> footer. "Why" is one sentence in the hero, not a section.
- Hero: left-aligned or centred 1-2 line claim + ONE visual that is the real thing (Linear UI, Playdate device, Framework laptop, Rive samples). No stock, no illustration filler except TE (art-directed).
- Type: single grotesk at light/regular weight with NEGATIVE tracking that grows with size (Linear -1.4px at 64, Vercel -3.8px at 64), plus one mono for labels/IDs (Berkeley, Geist Mono, DM Mono). Body 14-18px.
- Color: near-monochrome chrome (#08090a/#fafafa), accent only on CTA or product (Framework orange, TE orange, Playdate yellow). Matches DIGITAL's one-accent rule.
- Project/product presentation: object on a neutral field + name + 1 line + text link (TE); labelled by use-case/discipline (Rive); flat-lay of parts (Framework). Always a concrete noun, never an icon card.
- Proof: named customers or numbers in context (Vercel stat row, Rive "2B users" claim). For DIGITAL only real members/projects/partners; no borrowed logos.
- CTA: exactly two forms repeated identically: primary filled pill + secondary outline/text (Framework, Vercel, Linear). Builders get a second, separate CTA (Rive CLI, Playdate dev site, Raycast "build").
- Mobile: nothing overflowed horizontally on 7 of 7 captured (Nothing mobile blocked by modals). Patterns: hamburger + one persistent CTA (Linear, Rive, Playdate); hero visual first then claim then CTAs stacked (Vercel, Framework); a cropped swipe row signals more (Rive, Linear's frame).
- Motion: 0 of 8 use GSAP/ScrollTrigger globals; Lenis only on Nothing. One focal animation (Vercel shape, Playdate 3D) beats many. Media-heavy pages: Framework 6 videos, Rive 10 -> lazy-load.
- Pitfalls seen: stacked cookie+geo modals before content (Nothing), cookie notice over hero (Framework), dim pre-reveal state (Linear), text-scramble mid-frame in mobile capture (Vercel), glow ribbons (Raycast) = BRIEF anti-patterns.

## Principles to carry into DIGITAL concepts
1. Hero shows a real project artefact (from lib/data) with real fields, not a slogan over a gradient.
2. Two-column "label | body" rhythm with 1px hairlines for the sections.
3. Project index as flat-lay/specimen entries with discipline tags (like Rive's labelled samples).
4. One accent colour on CTA only; mono for metadata.
5. "Make your own" / join band separated from "see our work".
