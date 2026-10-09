# GSAP ScrollTrigger + demos — SCOUT-1

URLs: https://gsap.com/docs/v3/Plugins/ScrollTrigger/ , https://gsap.com/demos/ (shots: design-lab/references/gsap-scrolltrigger/, gsap-demos/; demo hub screenshot is mostly a loading/overlay state, low value). Category: scroll-animation engine.
Licence: pricing page states "GSAP is now 100% free for all users, thanks to Webflow's support" — ScrollTrigger and other plugins included (verify exact terms before shipping).

## Capabilities
- `pin` (spacing handled), `scrub` (optional smoothing), `snap` (progress/labels/custom), `toggleActions`, `markers`, callbacks (onEnter/Leave/Update), horizontal scroll, custom scroller containers, 200ms debounced resize recalculation. No scroll-jacking: works with native scroll + CSS snap.
- Fits the existing production hero ("scroll-driven hardware teardown") best: timeline scrubbed across a pinned section.
- Docs/demos site: dark bg rgb(14,16,15), cream text rgb(255,252,225), Mori + Fraktion Mono; 3 to 10 reduced-motion CSS rules.

## Reduced motion
`gsap.matchMedia()` with a `reduceMotion: "(prefers-reduced-motion: reduce)"` condition; on mismatch it auto-reverts tweens AND ScrollTriggers (no manual cleanup). Pattern: desktop+no-pref -> pinned scrub timeline; reduce -> static stacked layout. Also use for the mobile variant.

## Steal as principle
1. Pin + scrub for ONE signature sequence only (the teardown); everything else uses cheap sticky/CSS.
2. `matchMedia` as the single gate: motion, mobile, and reduced-motion are three branches of one config.
3. Markers/dev tooling: ship debug flag in prototypes to review scroll ranges.

## Avoid
1. Mixing GSAP and `motion` for the same effects: pick one per concept (GSAP for scroll timelines, Motion for component/UI).
2. Pinning on mobile (viewport-height jumps with URL bar; ScrollTrigger.normalizeScroll is a patch).
3. Forgetting `gsap.registerPlugin` / SSR: in Next 14 App Router use `"use client"` + `useGSAP`/context cleanup.

## Weight
gsap core ~tens of KB gz + ScrollTrigger plugin (exact sizes not verified here). Heavier than `motion` for simple reveals.
