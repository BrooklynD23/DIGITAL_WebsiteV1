# Nothing — https://nothing.tech
Category: consumer hardware. Shots: design-lab/references/nothing/ (desktop + 3 scroll shots usable; mobile blocked by a geo "store locator" modal I could not dismiss - recorded honestly).
Why good: a dot-matrix/industrial identity applied to everything, down to the nav and country prompt; product imagery treated as lab specimens.

## Narrative (homepage, from DOM headings + shots)
1. Floating pill nav (menu / wordmark / cart) + offers strip.
2. Hero: dark, single product centred, small mono product label, serif headline, one white "DISCOVER" button, faint dot grid behind.
3. "Shop by category" - offset 2-column product tiles, label as underlined mono link.
4. Campaign story blocks (brand ambassador, colour drop, battery test video) - full-bleed photo/video.
5. "Why buy on nothing.tech" benefit row, "Join the community" footer.

## Type
Three voices: Ndot / NType82 (dot-matrix display), a high-contrast serif for headlines (seen in shots), mono (Lattera Mono / Geist Mono) for labels and buttons. H1/H2 48px/48px, weight 400, uppercase mono micro-labels. Body 15/24, #333.

## Color
bg #f4f4f4 (light sections) and near-black hero; fg #040404; accent only as product colour (red square on headphone, hot pink earbuds). No UI accent colour.

## Layout
Narrow centred column (~576px) for nav + overlays on desktop; dotted background grid (~115px pitch) runs behind all sections. Generous whitespace, tiles offset on a staggered baseline.

## Motion
Lenis smooth scroll detected. Background grid + blurred colour washes on transitions. Mostly helps (calm); modal blur is heavy.

## Product / proof / CTA
Product = hero object + one-line claim; proof via celebrity/ambassador stories and a real-world "we tested battery for 5 days" narrative (claim-as-story). CTA = one white rectangular button, mono caps. Zero pill CTAs.

## Mobile
Geo/country modal and cookie modal cover the first screen on both viewports (UX warning: stacked interruptions). Page itself shows no horizontal overflow.

**Steal:** (1) one signature texture (dot grid) as structure, not decoration; (2) mono micro-labels + serif headline pairing; (3) "claim as story" (a concrete test) instead of a spec list.
**Avoid:** (1) stacked cookie + geo modals before content; (2) heavy blur transitions; (3) over-reliance on product renders we do not have.
Tech: Lenis, Geist + custom dot fonts; no GSAP/Three global.
