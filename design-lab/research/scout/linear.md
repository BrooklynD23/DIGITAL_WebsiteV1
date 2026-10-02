# Linear — https://linear.app
Category: dev/product tool. Shots: design-lab/references/linear/
Why good: product UI is the hero; extremely disciplined type + dark tokens; sections read as a spec, not a pitch.

## Narrative
1. Thin top nav (product, resources, customers, pricing, now, contact + Log in / Sign up pill).
2. Left-aligned 2-line H1 + one muted subline + a small "New: <feature> ->" changelog link (honest, no hype).
3. Large live-looking product frame (issue view with real data: activity feed, properties, cycle) bleeding to edges, fades in on load.
4. Feature index ("Features" label + 2-col expandable list: Projects / Pulse / Visual planning / Documents / Initiatives / Insights).
5. Alternating section pairs: short H2 left, paragraph + "Learn more ->" right (Intake, Planning, AI and automations, Build review ship).
6. Changelog preview, closing CTA ("Built for the future. Available today."), 6-col footer.

## Type
Inter Variable (weight 510, not 400/500 - a custom variable weight) + Berkeley Mono for code/IDs. H1 64/64 -1.4px tracking; H2 48/48 -1.06px; body 15/24 -0.165px, muted #8a8f98 on #08090a. Negative tracking scales with size.

## Color
bg #08090a, fg #f7f8f8, muted #8a8f98, borders ~#1c1d1f hairlines. Accent used only inside product UI (status yellow, labels). Page itself almost monochrome.

## Layout
Max ~1320px, 80px side margin, two-column rhythm (left label/heading, right body at ~52%). 1px dividers between sections; large vertical air (~120px+).

## Motion
Scroll fade-in + subtle parallax of product frames; product screenshot is staged and partly dimmed until in view. No GSAP/Lenis globals (custom). Helps hierarchy; the dim start state hides content for a moment.

## Product / proof / CTA
Proof = specific, realistic data inside the mock UI and a customers link; single CTA (Sign up pill, white on black) repeated in nav and footer.

## Mobile
No overflow. Nav collapses to hamburger but keeps Log in + Sign up visible; H1 wraps to 4 lines at ~40px; product frame crops off the right edge (reads as "more to see").

**Steal:** (1) show the real artefact (our project docs/specs/builds) as the hero image, with real data; (2) left label / right body two-column rhythm with hairlines; (3) negative tracking that scales with size.
**Avoid:** (1) dark-on-dark low-contrast muted text (check AA); (2) dimmed pre-reveal state hiding hero content; (3) monochrome sameness with no brand voice.
Tech: custom; Inter Variable + Berkeley Mono.
