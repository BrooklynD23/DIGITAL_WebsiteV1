# motion.dev (examples) — SCOUT-1

URL: https://motion.dev/examples (shots: design-lab/references/motion-dev/). Category: animation library + 462-snippet example library (React / JS / Vue / Three.js / vgpu). Why good: the library fancycomponents is built on; examples are graded ("MotionScore" S 161 / A 172 / B 97 / C 32) and filterable by platform + category.
Access: free = tutorials + community; full source for 460+ = Motion+ (paid). I did NOT see paid source. Library itself is free/MIT.

## Site (desktop.png)
- Bg rgb(12,13,17) near-black + saturated sky-blue (#3d9bff-ish) hero band; off-white display "Examples" (TASA Orbiter 76px 700, -4.18px tracking, tight 62px lh); labels in Geist Mono 11px caps, 1.98px tracking, muted green-grey. oklch tokens.
- Layout: left filter rail (`FILTER:// name, api, category`, platform, MotionScore grades, categories with counts) + spotlight card + grid. Hard rectangles, 1px rules, almost no radii -> "engineering catalogue" feel.
- Categories (counts): Basics 96, Text 43, Carousel 30, Page transitions 25, Cursor 25, 3D 22, Loading 23, Scroll 16, Nav/Buttons/Interactions 15 each, plus Layout animations, Lists, Dialog, Forms, Radix, Ticker.
- Observed: no gsap/lenis globals; 11 reduced-motion CSS rules on page.

## Reduced motion (docs: motion.dev/docs/react-accessibility)
- `<MotionConfig reducedMotion="user">` auto-disables transform + layout animations, keeps opacity/colour. `useReducedMotion()` hook for manual branches. Parallax and autoplay video should also be turned off by us.
- This is the single cheapest global safety net for a motion-based build.

## Steal as principle
1. Catalogue UI with mono caps labels + counts + grades = a lab-notebook feel suited to "projects as artifacts" index.
2. Quality grading / honest status per item (our project status/outcome fields).
3. One color-field band + dark body: a single saturated block gives identity without gradients.

## Avoid
1. Paid-gated source: don't plan around Motion+ components; use free API (`animate`, `useScroll`, `useTransform`, `AnimatePresence`, `layout`).
2. Dense filter rail on mobile: collapses poorly (not tested here).
3. Over-large negative tracking at display sizes (-4px at 76px) hurts legibility if used on body copy.

## Library/weight
`motion` ("motion/react"): hybrid engine, tree-shakeable; `LazyMotion` + `domAnimation` for small bundles (I did not verify exact KB; check bundlephobia before committing). Covers: stagger reveals, shared-layout (`layoutId`), scroll-linked (`useScroll`), masked reveals, springs, drag, view transitions.
