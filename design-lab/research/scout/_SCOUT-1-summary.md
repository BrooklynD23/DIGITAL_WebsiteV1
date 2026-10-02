# SCOUT-1 summary — Components & motion (6 sites, all reachable)

Method note: chrome-devtools MCP failed ("Target closed") on first call; I used the lab's local Playwright headless Chromium instead (no shared browser used). fancycomponents deep docs pages return intermittent HTTP 500 to fetchers; I read component source from GitHub (danielpetho/fancy, MIT).

## Cross-site patterns (steal as principles)
1. One library, tiny primitives: fancycomponents = ~50 single-file components on `motion/react`. Build a ~6-primitive kit (masked reveal, scramble label, sticky stack, drag, cursor proximity/trail, scroll-linked text) instead of bespoke effects.
2. Scroll-linked > autoplay: `useScroll` + `position: sticky` (Stacking Cards, 105 LOC) delivers the "wow" cheaply; reserve GSAP pin+scrub for ONE signature sequence (the hardware teardown).
3. Pointer effects are garnish: image trail, parallax floating, proximity fonts only decorate real content; every one needs a touch/static fallback.
4. Mono caps micro-labels + numbering + hairlines (motion.dev, Beautiful UI) = lab-notebook language that matches "engineering lab + studio".
5. Specimen presentation: number + title + caption + live demo + variant switch (Beautiful UI) suits project artifacts.
6. Masked/staggered text reveal (Vertical Cut Reveal) is the safest high-impact entrance; scramble-resolve (Scramble Hover) is the best "technical" hover.
7. Single saturated color field band (motion.dev blue) or single accent word (fancy blue) gives identity without gradients/glow.

## Reduced-motion handling (what exists)
| Source | Handling |
|---|---|
| motion | `<MotionConfig reducedMotion="user">` drops transform/layout anims, keeps opacity/colour; `useReducedMotion()` for manual |
| GSAP | `gsap.matchMedia()` condition `(prefers-reduced-motion: reduce)`; auto-reverts tweens + ScrollTriggers |
| Lenis | honoured by default: lerp=1, instant programmatic scroll |
| fancycomponents source | NONE (0 hits repo-wide). We must wrap every component ourselves |
Recommendation: global MotionConfig(user) + per-component static fallbacks; parallax, trail, autoplay video, physics OFF under reduce.

## Implementation hints
- Primary lib: `motion` (covers 12 of the 14 fancy components I read). LazyMotion for weight (KB not verified).
- GSAP (now free incl. ScrollTrigger per its pricing page): only for pinned scrub timelines; gate with matchMedia (desktop + no-pref).
- Lenis: optional, desktop pointer only, few KB; skip unless a concept needs scrubbed sequences. Pair via ScrollTrigger.update if both used. Never double-smooth.
- Heavy / lazy-load only: Gravity (matter-js, 510 LOC), Marquee Along SVG Path (464 LOC), cursor-proximity (rAF per letter), pixel trail.
- No fancy component is touch-aware; add tap/static fallbacks.

## Direction fit (my read; orchestrator decides)
- Studio/portfolio: Stacking Cards, Media Between Text, Vertical Cut Reveal, Image Trail (real project images).
- Engineering lab: Scramble Hover, Text Rotate (disciplines), Marquee Along SVG Path (blueprint trace), Drag Elements.
- Playful community: Gravity outro, Parallax Floating, Variable Font Cursor Proximity (needs variable font).

## Anti-references
MotionSites AI (glow text, glass, pills, generic AI-hero templates) and Beautiful UI's AI-chat aesthetic: borrow presentation grammar only, not look.

## Files
design-lab/research/scout/{fancycomponents,motion-dev,gsap-scrolltrigger,lenis,motionsites-ai,beautiful-ui}.md; screenshots in design-lab/references/{fancycomponents (8 component pages + home),motion-dev,gsap-scrolltrigger,gsap-demos,lenis,motionsites-ai,beautiful-ui}/.
