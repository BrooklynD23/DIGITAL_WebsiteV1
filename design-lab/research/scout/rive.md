# Rive — https://rive.app
Category: design/animation tool (design-tool pick). Shots: design-lab/references/rive/
Why good: a design tool whose own page is a working gallery of what it makes; developer install line sits next to designer sign-up in the hero (both audiences, one panel).

## Narrative
1. Nav (Products / Community / Learn / Pricing / Downloads / Docs + Get Started).
2. Hero split: left column of labelled live samples (Automotive, Product UI, Game UI, Mobile Apps - each a looping video), right = wordmark, H1, one paragraph, boxed install panel (CLI one-liner with copy button + OS tabs, then Sign up / Download).
3. One-line proof ("Trusted by Spotify Wrapped, Duolingo ...").
4. "Design, code and animate" with runtime logos (React, Flutter, Unity, Unreal, C++...), "Build once, ship anywhere".
5. "Products built with Rive reach over 2 billion users" logo wall + paragraph with specific claims (4x faster production, 90% smaller files).
6. Newsletter.

## Type
Orbitron 900 (H1 40/48, +0.4px, caps) for display, Tomorrow/Inter body, Fragment Mono / JetBrains Mono / PragmataPro for code. Sci-fi caps - very distinct, a bit dated.

## Color
bg #000, #f1f1f1 text, panels #111; accent green (#7ed321-ish) and cyan only in code snippet. Colour comes from the sample videos.

## Layout
Narrow ~1000px centred container; left sample rail + right text; boxed panels, 1px borders, ~4px radius. Dense but legible.

## Motion
10 video elements + a canvas; Framer component attributes detected in DOM (site appears Framer-built). Samples loop - helps (it IS the product), costs bandwidth.

## Product / proof / CTA
Gallery of real products shown by use-case label; proof = named customers + a 2-billion-users stat (company-claimed); dual CTA: copy-paste CLI, or Sign up. Dev command as a CTA is a notable pattern.

## Mobile
No overflow. Samples become a horizontal swipe row above the H1 (cropped card signals swipe), text then install panel; Get Started stays in the header.

**Steal:** (1) sample rail of real project artefacts, labelled by discipline/use-case; (2) a "copy this" concrete next step as CTA (e.g. a join checklist) alongside the sign-up; (3) swipe row cropped to signal more on mobile.
**Avoid:** (1) all-caps techno display face; (2) 10 autoplaying videos (perf); (3) borrowed-logo claims we cannot back.
Tech: Framer-style DOM, canvas, 10 video elements.
