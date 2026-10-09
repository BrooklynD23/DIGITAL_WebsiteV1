# Lenis (smooth scroll) — SCOUT-1

URL: https://lenis.darkroom.engineering (shots: design-lab/references/lenis/). Category: smooth-scroll library by darkroom.engineering. Observed `lenis` global and `has-custom-cursor` class on the site.

## Site (desktop.png)
- Black bg; giant blackletter display letters (hero reveals via split color field pink/black) with starfield; Panchang (h2 52px 700), Anton (body 24px), Roboto 14px 900 labels. Custom cursor on page. Sections: hero "SCROLL TO EXPLORE" -> "Why smooth scroll?" -> showcase / templates / submit. 1 reduced-motion CSS rule.
- Loud, brand-forward, type-as-graphic; not directly our tone but shows type as a hero object.

## Facts (from GitHub README)
- A few KB, zero deps; runs on native scroll so `position: sticky`, anchor links, a11y, find-in-page kept. React adapter `lenis/react`. Snap plugin (CSS scroll-snap NOT supported). `anchors: true` for hash links.
- Reduced motion: honoured by default - lerp forced to 1 (no smoothing), programmatic scrolls jump instantly, instance still runs for DOM/WebGL sync.
- With GSAP: `lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add(t => lenis.raf(t*1000))`; `gsap.ticker.lagSmoothing(0)`.
- Caveats: nested scroll areas need `data-lenis-prevent` (or `allowNestedScroll`); no iframe support; Safari 60fps cap / 30fps low-power.

## Steal as principle
1. Smoothing is a feel layer: keep content/layout independent so removing it loses nothing.
2. Let motion libs read one shared scroll source (Lenis -> ScrollTrigger/`useScroll`) to avoid double-smoothing.
3. Anchor + scrollTo with offset for in-page nav (About / Join sections).

## Avoid
1. Smooth scroll on touch: native momentum is better; enable on desktop pointer only.
2. Smoothing + pinned/sticky stacks without testing (jitter risk if two sources animate scroll).
3. Custom cursor as default: only as progressive enhancement (production already has crosshair cursor per #0051).

## Verdict
Optional. Adds little for a content-first student site; justify only if a concept relies on scrubbed sequences. Weight negligible.
