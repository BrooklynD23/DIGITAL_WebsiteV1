# fancycomponents.dev — SCOUT-1 notes (PRIMARY inspiration)

URL: https://www.fancycomponents.dev (author Daniel Petho; repo github.com/danielpetho/fancy, MIT, ~3.2k stars). Category: React component + microinteraction library (copy-paste shadcn-style registry, ~50 components in text/blocks/image/background/physics/carousel/filter).
Why good: every component is one small file, props-driven, built on one library (`motion/react`). Playful but each effect is a single idea. Quality bar for "fancy" without Three.js.
Method: browser screenshots (headless Playwright; chrome-devtools MCP was down, "Target closed") + source read via GitHub API. Docs deep pages intermittently return HTTP 500 to WebFetch; source on GitHub is the reliable reference. Shots: design-lab/references/fancycomponents/.

## Site itself (desktop.png, *-mobile.png)
- Hero: serif display "Make your website fancy" (Calendas Plus 96/120, -2.4px tracking, blue accent word rgb(0,21,255)); floating tilted demo cards drift around hero; two CTAs (black + blue). White bg, near-black text rgb(12,10,9).
- Type: Calendas Plus (serif display + p), Overused Grotesk (UI), plus demo fonts (VT323, Tiny5, Azeret Mono, Satoshi). Docs: h1 48/48 serif, h2 36 grotesk 500.
- Docs layout: 3 rounded panels (nav / content+Demo|Code tabs / on-this-page). Each page = Demo, Code, Usage, "Understanding the component", Notes, Props. Good doc template for our design-lab spec pages.
- Stack: Next.js (turbopack), Tailwind-ish, no gsap/lenis globals. Site chrome has 3 prefers-reduced-motion CSS rules; the components do NOT (see below).

## Components examined (source read; 14)
| Component | URL (/docs/components/...) | What it does | Deps | Suits |
|---|---|---|---|---|
| Image Trail | image/image-trail | Cursor drags a trail of images that scale in/out by travel distance (threshold, intensity, keyframes props) | motion (`useAnimate`), 248 LOC | Studio/Archive: project artifact imagery on pointer; needs touch fallback |
| Parallax Floating | image/parallax-floating | Elements float by depth relative to cursor (sensitivity, easingFactor) | motion `useAnimationFrame`, mouse-position hook | Studio hero collage of real project shots; desktop-only enhancement |
| Stacking Cards | blocks/stacking-cards | Sticky cards scale down as next stacks over (scroll progress, scaleMultiplier) | motion `useScroll`/`useTransform`, 105 LOC, pure CSS sticky | Projects-as-hero: scroll through project dossiers. Best fit, cheapest |
| Drag Elements | blocks/drag-elements | Draggable children with inertia, selected-on-top z-index | motion drag + InertiaOptions, 86 LOC | Lab/Workbench: draggable specimen cards, "pin your project" |
| Media Between Text | blocks/media-between-text | Two text halves part to reveal image/video; trigger hover/inView/ref | motion `useInView`, variants | Project title lockups revealing real photo; has fallbackUrl |
| Marquee Along SVG Path | blocks/marquee-along-svg-path | Items travel along an SVG path, scroll-velocity coupled, hover slowdown | motion `useScroll/useSpring`, 464 LOC | Blueprint/trace motifs: items ride a schematic path |
| Screensaver | blocks/screensaver | DVD-bounce element in bounds | motion + rAF | Low value; avoid (idle motion) |
| Scramble Hover | text/scramble-hover | Glyph scramble that resolves letter-by-letter (speed, sequential, revealDirection) | motion, 188 LOC | Mono/technical labels, nav, status codes; strongest "engineering" feel |
| Vertical Cut Reveal | text/vertical-cut-reveal | Per word/char/line masked vertical slide-up; staggerFrom first/last/center/random | motion `AnimationOptions`, 221 LOC | Any headline entrance; masked-reveal staple |
| Variable Font Cursor Proximity | text/variable-font-cursor-proximity | Font-variation axes change by cursor distance (radius, falloff linear/exp/gaussian) | motion + rAF; REQUIRES a variable font | Typographic concept; desktop-only; heavy rAF per letter |
| Scroll and Swap Text | text/scroll-and-swap-text | Text letters swap/scroll with scroll progress (spring-smoothed) | motion `useScroll/useSpring/useTransform` | Section-title scroll linkage (docs page 500'd; source read only) |
| Text Rotate | text/text-rotate | Rotating word list with stagger (440 LOC) | motion AnimatePresence | "We build ___" disciplines rotator (CS/Design/Business) |
| Gravity | physics/gravity | Matter.js bodies fall/stack, draggable, from DOM children | matter-js + lodash, 510 LOC (heavy) | Playful outro/footer "skills pile"; lazy-load only |
| Pixel Trail | background/pixel-trail | Grid of pixels that fade under cursor | motion + uuid | Pixel/engineering-lab grid; desktop only |
Also exist (not read): Float, Elastic Line, Cursor Attractor & Gravity, Simple Marquee, Circling Elements, Letter Swap/3D Swap, Typewriter, Breathing Text, Underline variants, Basic Number Ticker, carousel, filter.

## Principles to steal (≤3)
1. One idea, one file, one lib: each effect is a prop-driven wrapper over `motion` — keep our motion kit as ~6 small primitives (reveal, scramble, stack, drag, proximity, trail).
2. Pointer effects are decoration for real content: trail/parallax/proximity sit on top of real images/text; content is never gated behind them.
3. Scroll-linked transforms from `useScroll` + sticky (Stacking Cards) give "wow" at near-zero cost and no JS layout work.

## Avoid
1. No reduced-motion handling anywhere in component source (0 hits for reduced/useReducedMotion across repo): we must wrap with `useReducedMotion()` / `<MotionConfig reducedMotion="user">` ourselves.
2. Pointer-only (trail, parallax, proximity, drag) = nothing on touch; always supply a static or tap fallback.
3. Matter.js Gravity / rAF-per-letter proximity: heavy; lazy-load, pause off-screen, never on mobile.

## Tech/weight
`motion` (framer-motion successor, `import from "motion/react"`) covers ~12 of 14; matter-js only for Gravity. Needs `cn` util (clsx+tailwind-merge). MIT licence -> copy-paste OK with attribution comment (author tags like "Khoa Phan" in file headers).
