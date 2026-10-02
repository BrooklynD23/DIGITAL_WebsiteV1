# teenage engineering — https://teenage.engineering
Category: hardware / instruments. Captured via local headless Chromium (chrome-devtools MCP was down). Shots: design-lab/references/teenage-engineering/
Why good: product company that behaves like a design studio; the homepage is an editorial zine, not a shop grid. Total personality, zero SaaS template.

## Narrative (homepage)
1. Pictographic nav strip: 4 icon+label groups (products / store / latest / finder) + brand mark, no dropdowns.
2. Hero = illustrated, jokey editorial poster ("Daily Life of Mr. Update"), announces firmware updates as a story.
3. "explore products" grid: product-on-neutral-grey cells, name + "buy now" link, bundle packs side by side.
4. Full-bleed collage banners per product launch (halftone, tape, torn paper, risograph colour).
5. Newsletter / social / guides footer. Page is long (~15k px), mostly imagery.

## Type
te-20 / te-40 (proprietary pixel-adjacent grotesk), plus per-campaign display faces (franxurter, riddim, swingus). Body ~19px/22px, weight 100. Display = ultra-heavy condensed caps, tight tracking.

## Color
Neutral: #fff, #f5f5f5, #0f0e12, greys #e5e5e5-#4d4d4d. Accents as tokens: orange #f05a24, blue #0071bb, green #006837, red #b81d13, yellow #fab413. Orange is the signature.

## Layout
Layout scales from a 980px design width (--base-design-width: 980); heights are fractions of client width, so the composition scales as one poster. Flat grid cells divided by 1px hairlines; no cards, no radii on desktop.

## Motion / interaction
Almost none observed on load (no GSAP/Three/Lenis found). Personality comes from art direction, not animation. That helps: fast, light.

## Product presentation / proof / CTA
Products shot on flat grey, label top-left, text link "buy now" in blue. Proof = the objects and the art direction themselves; no logos, no testimonials. CTA is a low-key text link.

## Mobile
No horizontal overflow. Nav collapses to a 0-count cart chip + 3-dot menu; hero illustration scales whole; product cards become full-width rounded dark tiles (one product per screen).

**Steal as principle:** (1) let one strong art-direction device (illustration/collage) carry brand instead of effects; (2) icon+label nav that signals "maker" culture; (3) accent colours as a small named token set, one used loudly.
**Avoid:** (1) fixed-ratio scaling that makes tiny text unreadable on phones; (2) proprietary-feeling quirk everywhere (we lack the product line to justify it); (3) long image-only scroll with no stated purpose.
Tech: custom (no framework globals detected), Unicode/pixel fonts, no WebGL, no video.
