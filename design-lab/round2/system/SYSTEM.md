# Round-2 system (W0-SYS)

Shared by every round-2 page in both worlds. Code: `app/design-lab/r2/_system/` (barrel `index.ts`). Specimen: `/design-lab/r2/system`. Gate script: `node design-lab/scripts/r2-sys-raf.mjs`.

## 1. Imports

```ts
import { DotStage, DotGlyph, frame, VERBS, useScrollDrive, GlyphSeat, GLYPHS, StateMark,
         SPRING, EASE, DURATION, useScrollProgress, useReducedMotion } from '@/app/design-lab/r2/_system';
import { fontSignal, fontApple, fontReading } from '@/app/design-lab/r2/_system/fonts'; // W0-TYPE
```

`app/design-lab/r2/layout.tsx` already loads `tokens/worlds.css` and hides the production Navbar, Footer, skip link and crosshair cursor on every r2 route. Each page ships its own nav and skip link.

**Pair a world with its font class on the page root:** `world-signal ${fontSignal}` or `world-apple ${fontApple}` (SHADES reading surfaces add `fontReading`). The font class wins `--font-display/-text/-mono` and feeds weight, stretch and `--track-*` into the type tokens.

## 2. Dot engine (`_system/dots/`)

`frame(verb, t, opts) → { dots, lines }`: pure and deterministic (integer hashing, no `Math.random`). Coordinates are normalised to [-1, 1]. Radii are px for `opts.size`. **t = 1 is every verb's rest pose**: it is used for SSR, reduced motion, no-JS and pauses. Cyclic verbs also equal rest at t = 0, so they loop seamlessly. The engine caps output at 1,200 dots.

`opts`: `seed`, `size` (px, default 160), `density` (×count), `shape` (form/settle), `layers` (explode), `level` (fill), `outcome` (`pass|hold|reject`, route), `kind` (`local|remote`, tether), `anchor` (draws the single red trigger dot at the verb's "here / now / open" point).

| Verb | Dots do | Real state it stands for | Rest pose |
|---|---|---|---|
| form | loose ring settles onto a shape | Plan: scope being drawn | target shape, dotted |
| orbit ↻ | parts on tilted orbits | Prototype: parts in progress | 3 parts parked |
| scramble ↻ | bands turn out, click back | Test: verification before merge | aligned rows |
| wire | nodes home + edges draw | Integrate | one connected graph |
| explode | layers separate on one axis | Teardown / scope reveal | fully exploded |
| pulse | packet runs a leader A → B | Handoff / review path | packet at B, leader solid |
| fixate | scattered dots converge | Focus / RSVP reading | point inside a reticle |
| seat | ring turns, one slot opens | Open role (no owner) | dashed slot (+ anchor) |
| hold ↻ | drift in place | Blocked / needs owner | lattice at 40% ink |
| settle | jitter stops, outline solid | Done, with a source | solid closed form |
| emit | call leaves model to tool | Tool call requested | packet at the tool |
| absorb | result (3×3) merges back | Tool result fed back | orb grown |
| fill | fixed slots fill in order | Context accumulating | filled to `level` |
| pin | top band outlined | System prompt / cached prefix | band outlined |
| evict | oldest slots exit, stay empty | Context overflow | empty outlined slots |
| compress | group collapses to a cluster | Compaction | dense cluster past a boundary |
| bud | children split off parent | Subagents start clean | 3 children apart |
| merge | children → 1 dot, return | Subagents report | 3 summary dots on parent |
| route | call meets the gate | Harness permission | past / held (+anchor) / bounced hollow |
| halt | packet laps, drops, ring locks | Loop ends: no tool calls | packet centred, ring solid |
| tether | port links to a server | MCP: local stdio / remote HTTP | link drawn |

↻ = cyclic. Line form carries state: solid = live/owned, dashed = pending/boundary, dotted = leader/planned. The agentic verbs are metaphors (a dot is not a token), so label them "illustrative" on the page.

### Renderers

- `<DotGlyph verb t? size? label? …opts />`: an SVG renderer with no hooks, safe in Server Components. Use it for marks under ~96px, static figures and print. Ink is `currentColor`; the anchor uses `var(--r2-trigger)`.
- `<DotStage verb size? t? progress? playing? loop? duration? playOnHover? label? onSettle? …opts ref />`: a 2D canvas, max 600px, DPR ≤ 2, ≤1,200 dots. Server HTML is the DotGlyph rest pose, and the canvas replaces it after its first paint. The wrapper is `role="img"`, labelled `"<verb>: <meaning>"` by default.
- Handle (`ref`): `play({ loop?, from? })`, `stop()` (finishes to rest in ≤450ms, then sleeps), `seek(t)`, `setProgress(p)` (scroll/slider drive, one coalesced draw per frame), `getT()`, `isRunning()`.
- Drives: `useScrollDrive(targetRef, stageRef, { range: 'contain'|'cover'|'entry', map?, onProgress?, cssVar? })` and `useTimeDrive(stageRef) → { play, stop }`. Controlled props work too: `progress={p}` and `playing={bool}`. `playOnHover` loops while the stage or its nearest `[data-stage-host]` is hovered or focused.
- All stages share one ticker (`dots/ticker.ts`), so a page has one rAF loop at most, and only while something moves.

## 3. Glyphs (`_system/icons/`)

There are 20 components (`GlyphSlab … GlyphEval`, also listed in `GLYPHS` with name, set and meaning), plus `<StateMark state="live|pending|stale|paused" />`.

- Props: `state` (`idle` | `working` | `done`), `size` (16 inline / 24 UI / 64 tile), `label` (omit for `aria-hidden`), `live` (force the working animation on).
- Grid: 24 units, live area 2–22. Strokes are 1px and non-scaling. Dots sit on a 2-unit pitch (r 0.75), nodes are r 1 and the anchor is r 1.5, with at most one red anchor per glyph.
- State axis (one SVG source, read by CSS through `data-state`):
  - **idle**: dotted outline, 60% ink, rest pose.
  - **working**: the glyph's verb plays, 100% ink.
  - **done**: solid outline, centre node filled, the anchor removed, never red.
  - State changes transition over 280–320ms.
- Working motion runs only while the glyph is hovered, inside a hovered or focused `[data-glyph-host]` row, inside a host with `data-active="true"` (the active scroll entry), or when `live` is set. It is pure CSS (no JS, no rAF) and is disabled under reduced motion.
- Honesty rule: a glyph appears only next to a real state value. Default to `idle`, and use `done` only with a source.

## 4. Tokens (`_system/tokens/`)

| Token | Value |
|---|---|
| UI state | 240 / 280 / 320ms, `cubic-bezier(0.4, 0, 0.6, 1)` (`--r2-ease-ui`, `EASE.ui`) |
| Reveal | `.r2-reveal`: 30px + fade on the `view()` timeline (`entry 0% → cover 30%`). Visible by default where unsupported or under reduced motion. `[data-r2-static]` on `<html>` shows all reveals for screenshots |
| Springs (`motion/react`) | `SPRING.spatial` ζ 0.8 / k 380 (damping 31.19) · `SPRING.spatialFast` 0.6 / 800 (33.94) · `SPRING.spatialSlow` 0.8 / 200 · `SPRING.effects` 1.0 / 800 (56.57, opacity/colour only) |
| Springs (CSS) | `--r2-spring-spatial(-fast)` and `--r2-spring-effects` as `linear()` easings, each with a `-dur` pair (`springToLinear()`) |
| Scroll | `useScrollProgress(ref, { range, onProgress?, cssVar? })`. CSS-only callers get `animation-timeline: view()` on the registered `--p` (0 JS). JS callers get one passive listener, attached only near the viewport, coalesced into the shared ticker. Reduced motion pins `--p = 1`. No ScrollTrigger |

**World tokens.** `.world-signal` and `.world-apple` share one vocabulary:

- Colour: `--r2-ground`, `-ground-raised`, `-ink`, `-ink-2`, `-ink-3`, `-hairline(-strong)`, `-trigger`, `-trigger-ink`, `-focus`.
- Type: `--r2-fs/lh/ls-{hero,h1,h2,h3,lead,body,small,label}`, `--r2-fw-display`, `--r2-fstretch-display`.
- Spacing: `--r2-space-1…10`, `--r2-gutter`, `--r2-target` (44px), `--r2-nav-h` (52px).

| | Signal Capture | Apple played straight |
|---|---|---|
| Ground | `#0b0c0a` + `.r2-graticule` (an oscilloscope grid, not decoration) | `#fff` / `#f5f5f7`; `[data-tone="dark"]` chapters are `#000` |
| Ink | bone `#ece8de` 16:1, `#a8a396` 7.8:1, `#8c887d` 5.5:1 | `#1d1d1f`, `#6e6e73` 5.1:1; dark: `#f5f5f7`, `#a1a1a6` |
| Type scale | 72 / 48 / 36 / 24 / 19 / 16, mobile hero 40/44 | 80 / 56 / 48 / 28 / 21 / 17 (+12), mobile hero 40/44, weight 600 |
| Red | `--r2-trigger` is the single marker only. Red text, if unavoidable, uses `--r2-trigger-ink` `#ef6a55` (6.4:1; a darker red fails on near-black) | CTA hover / anchor only: `--r2-cta-bg-hover` `#b3321f` (6.2:1 with white text) |
| CTA | none filled | `--r2-cta-bg/ink`, one filled CTA in the 52px local nav |

## 5. Performance rules (hard gates)

1. **0 rAF callbacks at rest.** Verify with `node design-lab/scripts/r2-sys-raf.mjs <route>`, which attributes callbacks and separates out the production cursor loop.
2. A stage runs only during a time drive, an interaction or a scroll drive. It sleeps when settled, offscreen (IntersectionObserver), in a hidden tab, or under reduced motion.
3. At most one moving glyph or stage per viewport on real pages. Never loop ambiently.
4. Keep ≤1,200 dots per stage, with DPR capped at 2. Prefer `DotGlyph` under 96px.
5. Scroll work uses CSS `view()` first. JS fallbacks use one listener, coalesced, with no layout reads outside the ticker frame.
6. Animate compositor properties only (transform, opacity). Never animate top, left, width or blur in a scroll path.

## 6. Accessibility rules

1. Reduced motion is a designed state: stages show the rest pose, `play()` jump-cuts to rest, scroll drives pin to rest, glyph animations and reveals are off, and content is identical.
2. No-JS: the DotStage server HTML is the SVG rest pose. Glyphs are static SVG, and reveals are visible by default.
3. Stages are `role="img"` with a state-specific label (pass `label` when the state changes). Glyphs are `aria-hidden` next to a visible word, or take `label` when they stand alone.
4. Every control is a real `<button>` or `<input type="range">` at 44px. Glyph rows that animate on hover also animate on `:focus-within`.
5. Colour never carries state. Line form (solid / dashed / half-height / struck) and words do.
