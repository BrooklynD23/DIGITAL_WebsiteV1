# COBE (https://cobe.vercel.app)
Category: generative / WebGL globe lib. Why good: 5.9 KB gzip, zero deps, dotted-halftone globe that reads as "instrument", not "AI blob". Pairs with the user's idea (globe of where project photos were taken).
Verified via local headless Playwright (chrome-devtools MCP was down: "Target closed"). Screenshots: design-lab/references/cobe/{desktop,mobile,scroll-1}.png

## Narrative
Hero globe w/ labelled markers + arcs + ring text -> 13-slide demo carousel -> install tabs (npm/pnpm/yarn/bun + "Copy Prompt") -> API table -> recipes (auto-rotate, draggable, focus location, CSS anchors, dynamic markers, perf, cleanup).

## Weight / compat
- cobe@2.0.1: 13.0 KB min / 5.9 KB gzip (bundlephobia), 0 deps. Own WebGL, NOT three.js.
- API: `createGlobe(canvas, opts)` -> `{update, destroy}`; you drive rAF yourself. Plain canvas, so React 18 / Next 14 fine inside a `"use client"` component + useEffect (call destroy on unmount). Static export OK (client-only).
- Markers (lat/lon, size, colour, id), arcs, glow/diffuse/dark/mapBrightness, `devicePixelRatio`, `scale`, `offset`. Recipes: Draggable, Focus Location, Dynamic Markers.
- CSS Anchor Positioning for labels (`--cobe-{id}` vars): modern-Chromium feature; needs a fallback (absolute-positioned DOM from projected coords) for Safari/Firefox. Not verified cross-browser.

## Type / colour (site chrome)
Geist Pixel / GeistPixelLine display (72px, ls 10.8px), Departure Mono 10.4px caps labels. bg #fff, --text #1a222b, one ink accent #0045f6, border #e0deda, max-width 640px. Single-accent + pixel type = strong "hardware spec sheet" character.

## Motion
Auto-rotating globe, marker pulse, carousel. Helpful as a single focal object; rAF loop must pause offscreen and under prefers-reduced-motion (render one static frame).

## Idea fit (user: globe of photo locations)
Works only if photo locations are REAL and geographically varied. DIGITAL builds are campus-based (Cal Poly Pomona); a world globe of one dot would be decorative. Better: regional/zoomed focus (Focus Location recipe on SoCal), or markers = real build sites/partners/events once content exists. Do not invent locations. [placeholder] data must be labelled.

## Steal as principle (<=3)
1. One precise instrument-like object + labelled callouts instead of generic hero art.
2. Single ink accent against white with mono caps micro-labels.
3. Copy-paste install/recipe tabs = "docs as proof of craft".
## Avoid
1. Globe as pure ornament with no real data. 2. Always-on rAF on mobile. 3. Anchor-positioning-only labels.

## Direction fit
C Creative Technology (best), B Engineering/System (good: mono labels), A Editorial (as small figure), F Radical (large cropped globe). Weak for D/E.
Tech observed: Next (Turbopack), 2 canvases, no THREE global.
