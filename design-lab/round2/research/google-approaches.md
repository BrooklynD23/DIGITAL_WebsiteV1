# R2-GOOGLE: Google UI/frontend approaches (secondary source to Apple)

Verdict: Google's real lesson is restraint plus cheap motion. Spatial springs for UI, short `cubic-bezier(0.2,0,0,1)` reveals, muted autoplay clips (not scrubbed video), one persistent CTA, big 500-weight headlines with about 20 words. Scroll-driven CSS is NOT what store.google.com uses.

Method: Playwright headless (`design-lab/scripts/r2-google-{shoot,probe,scrub}.mjs`), live pages 2026-10-02. Screenshots and `metrics.json` in `design-lab/round2/references/google/{pixel11pro,pixel-buds-pro-2,pixel-watch-5,apple-compare-iphone}/`.
Caveat: the `scrollDrivenCss`, `viewTransition` and `contentVisibility` flags in `metrics.json` are FALSE POSITIVES (regex hit `animation-timeline: unset` resets). The probe in section 2 is the authority.

## 1. Material 3 Expressive: motion physics (verified from source)

Source: androidx `ExpressiveMotionTokens.kt` and `StandardMotionTokens.kt`
(github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/). Spring = (dampingRatio, stiffness), Compose units, mass 1.

| Token | Expressive (damp / stiff) | Standard (damp / stiff) | Use |
|---|---|---|---|
| fast spatial | 0.6 / 800 | 0.9 / 1400 | buttons, switches, small x/y/size/shape |
| default spatial | 0.8 / 380 | 0.9 / 700 | cards, sheets, mid components |
| slow spatial | 0.8 / 200 | 0.9 / 300 | full-screen, large hero moves |
| fast effects | 1.0 / 3800 | 1.0 / 3800 | color, opacity |
| default effects | 1.0 / 1600 | 1.0 / 1600 | color, opacity |
| slow effects | 1.0 / 800 | 1.0 / 800 | color, opacity |

Rule (secondary: github.com/minop1205/m3-expressive-react/pull/319): spatial springs may overshoot (position, size, rotation, corner radius). Effects springs are critically damped (damping 1.0) because opacity and color overshoot looks broken.

Derived for the `motion` / framer `type:"spring"` API (mass 1, `damping = 2*zeta*sqrt(stiffness)`; my arithmetic, verify by eye):
fast-spatial exp `{stiffness:800, damping:34}`, default-spatial `{380, 31}`, slow-spatial `{200, 23}`, effects default `{1600, 80}`, effects fast `{3800, 123}`, effects slow `{800, 57}`.

Duration and easing tokens (`MotionTokens.kt`, same dir): short 50/100/150/200 ms, medium 250/300/350/400, long 450/500/550/600, extra-long 700/800/900/1000.
Easings: emphasized/standard `cubic-bezier(0.2,0,0,1)`, emphasized-accelerate `(0.3,0,0.8,0.15)`, emphasized-decelerate `(0.05,0.7,0.1,1)`, standard-accelerate `(0.3,0,1,1)`, standard-decelerate `(0,0,0,1)`.

Shape morph: M3E adds 35 RoundedPolygon shapes and feature-matched morphing (convex corner, concave corner, flat edge matched, then subdivided to equal segment counts). Source: m3.material.io/styles/shape/overview-principles; search summary via github.com/floor/mtrl/pull/325. Web equivalent: SVG path morph (flubber or `motion`'s `animate(d)`), only valid between paths with matched structure.
Seen live: Google's own buttons use an overshoot shape-transition easing `cubic-bezier(.4,.1,.5,1.4)` (CSS var `--gm3-button-filled-container-shape-transition-easing-function`, read from store.google.com stylesheet). Same-family, cheap web approximation of a spatial spring: one `y1 > 1`.
Emphasized type: store pages use Google Sans Flex (headings 500, tight tracking), Google Sans Text for body. Variable font, so weight/width/roundness are axes, not separate files.

## 2. store.google.com measured (1440x900 and 390x844, 6 scroll stops each)

| Page | Height desktop / mobile | Videos in DOM | Sticky | H2 sizes desktop | Word counts at stops (desktop, incl. nav/footer) |
|---|---|---|---|---|---|
| Pixel 11 Pro | 37,918 / 36,843 px (~42 viewports) | 81 | 2 | 76 | 69, 19, 82, 62, 225, 479 (footer) |
| Pixel Watch 5 | 29,435 / 30,082 | 34 | 2 | 60, 48, 32 | 90, 14, 130, 147, 38, 373 (footer) |
| Pixel Buds Pro 2 | 9,581 / 12,910 (~10.6 viewports) | 16 | 0 | 60, 40, 32 | 79, 141, 61, 106, 127, 454 (footer) |

- Words per viewport: median content viewport is 60-140 words, hero 14-90. Headline is 3-8 words ("Light ears ahead.", "Designed for Gemini Intelligence."). Body paragraph under it about 40 words. Section copy blocks (carousel cards) are about 20-30 words. Biggest pages (Pixel) are long but each viewport carries one idea.
- Type scale, desktop (computed): 76 / 60 / 48 / 40 / 36 / 32 / 24 / 20 / 16 / 14 / 12 px, headings weight 500. Mobile: 36 / 32 / 28 / 24 / 22 / 18 / 16 / 14. Body 16-20, base 16.
- Section rhythm: alternating full-bleed color fields (cream, sage, white, sky) plus full-bleed media blocks (about 840 px tall) then centered headline plus paragraph. Watch page uses horizontally scrolling 3-up feature cards with a headline plus 20-30 word body each. Buds mobile uses accordion rows ("Speak with locals in their language." + chevron) to hide copy: shorter pages without removing content.
- CTA placement: desktop = floating pill header (sticky top 24 px, 84 px tall) with product name left, price plus financing right and a black `Buy` button always visible. Mobile = bottom-fixed price bar with `Buy` bottom-right (~y 760-780 of 844) plus a top pill with `Menu`. In-page secondary: `Compare`, `Learn more`. One primary CTA, never repeated as a hero button pair.
- Scroll-linked effects (probed): `document.getAnimations()` returned 0, no `ScrollTimeline` in use, no canvas, no Lottie, no Lenis. Reveal = one-shot CSS keyframes on view: `clip-path: inset(100% 0 0)` open, 0.7 s linear; image `scale(1.1)->1` 0.85 s delayed 0.35 s; heading block 1.3 s `cubic-bezier(0.6,0.05,0.01,0.99)`. Other easings seen: `(0.2,0,0,1)`, `(0.23,1,0.32,1)`, `(0.4,0,0.2,1)`, hover opacity 75-200 ms. GSAP string present in the page, but no sticky scrub found.
- Video vs sequence: `<video muted playsinline>` with poster, `preload="none"` on most (only first `auto`), mp4 + webm. Playback sampled at real-time speed (about +0.25 s per 250 ms step), started when in view and not tied to scroll position, so it is NOT scrubbed. Pause/replay buttons overlaid (`pause`, replay circle) for a11y. Clips 802x640 up to 2880x1600.
- Weight: during one full scroll of Pixel 11 Pro: 322 requests, 2.3 MB JS, 9.3 MB images, 31 MB video. That is Google's budget, not ours.
- `prefers-reduced-motion`: 1 media rule in their CSS (as served). Do better.
- Apple vs Google (weak comparison, hub page `apple.com/iphone/`, redirected from `/iphone-17-pro/`, so detail is for the Apple scout): Apple hero 76 words, H1 80 px/600, section H2 56 px, 27 sticky elements, 0 video/canvas on the hub; Google hero 14-90 words, H2 up to 76 px/500. Apple leans on sticky scroll choreography (27 sticky); Google leans on sequential full-bleed color/media blocks plus muted clips and a persistent buy bar. Apple = scroll as timeline; Google = scroll as page turn.

## 3. Cheap-motion techniques: recommendation table

Support facts verified: MDN BCD (animation-timeline: Chrome 115, Firefox preview only, Safari 26), developer.chrome.com/docs/css-ui/scroll-driven-animations, web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available (Baseline newly available 2025-10-14, Firefox 144), web.dev/articles/inp (good <=200 ms at p75), web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count, web.dev/articles/content-visibility, MDN BCD (linear(): Chrome 113, Firefox 112, Safari 17.2; content-visibility: Chrome 85, Firefox 125, Safari 18).

| Technique | Support | Cost | Use it for | Fallback |
|---|---|---|---|---|
| CSS `animation-timeline: view()/scroll()` | Chrome/Edge 115+, Safari 26+, Firefox not shipped (preview). MDN: not Baseline | Runs off main thread when animating transform/opacity (Chrome docs) | Section reveals, rail progress bar, parallax drift, exploded-part offsets driven by `--p` | `@supports (animation-timeline: scroll())` else 1 shared `IntersectionObserver` toggling `.is-in` (one-shot) or `motion`/GSAP `ScrollTrigger` (already in deps) |
| JS scroll progress -> CSS var (`--p`), one rAF listener | All | Style recalc only if children use `calc(var(--p))` on transform/opacity; cap to 1 sticky section | Exploded phone scrub, stage strip progress where CSS timeline is missing | Is the fallback. Skip if `prefers-reduced-motion` |
| View Transitions, same-document | Baseline newly available (Chrome, Safari, Firefox 144 w/o types) | Snapshot compositing; keep under about 400 ms | Tab/state swaps (workflow stage change, project filter), not scrubs | Feature-detect `document.startViewTransition`, else direct state set |
| React `<ViewTransition>` / Next `transitionTypes` | Next docs v16.3 say works with React canary in App Router. This repo is Next 14.2 + React 18: NOT available | n/a | Cross-route morph (project card -> project page) | On Next 14 call `document.startViewTransition` manually around `router.push`, or skip route transitions |
| Compositor-only props (`transform`, `opacity`) | All | No layout/paint; `will-change` only on the 1-3 elements actually animating; watch layer count (compositing target about 4-5 ms) | Everything animated at 60 fps | Never animate top/left/width/box-shadow/filter blur in scroll loops |
| CSS `linear()` easing as spring | Chrome 113, Firefox 112, Safari 17.2 | Free (sampled curve) | Baked M3 spring overshoot for hover/press, orb pop, with no JS | `cubic-bezier(.4,.1,.5,1.4)` (Google's own overshoot) |
| `motion` spring (stiffness/damping above) | JS, all | Main thread but small | Interruptible gestures, drag, toggles, shape/path morph | Same values as CSS fallback |
| Muted `<video>` loop (poster, preload none, mp4+webm, IO play/pause) | All | Decode cost; no seek latency; Google runs 81 of them lazily | Orb loops, ambient glasses b-roll, hero loop | Poster image |
| Canvas image sequence | All | Decoded RAM = w*h*4 bytes per frame: 1280x720 = 3.7 MB, 90 frames = about 332 MB if all resident (arithmetic). Preload many requests | Only for photoreal rotation that cannot be layered | Static key frames |
| Video `currentTime` scrub | All, but seeks are slow on long-GOP encodes | Needs all-intra/keyframe-every-frame re-encode, big files | Avoid | Layered SVG parts (below) |
| Layered SVG/PNG parts + transforms | All | Smallest; resolution independent; fits "isometric exploded" | Exploded phone, glasses layers | none needed |
| `content-visibility: auto` + `contain-intrinsic-size` | Chrome 85, Firefox 125, Safari 18 | web.dev measured 232 ms -> 30 ms initial render in its demo | Long below-fold sections (team, projects grid) | Ignored by old browsers |
| `prefers-reduced-motion` | All | Free | Gate: remove scrub/parallax/slides, keep opacity and short state fades (web.dev/articles/prefers-reduced-motion: remove decorative, keep functional) | Show end state statically |

Budgets to adopt: INP good <= 200 ms (p75); keep each task under the 50 ms long-task line; <= 3 simultaneously animating layers per viewport; no scroll listener doing layout reads; videos <= 1 MB per clip at 600 px.

## 4. Material Symbols: variable axes and a "state" axis for our dots

Source: developers.google.com/fonts/docs/material_symbols. Axes: FILL 0..1 (one glyph holds outline and filled, interpolates), wght 100..700, GRAD -50..200 (finer than wght, used for dark-mode and elevation), opsz 20..48 dp (stroke thickens as size shrinks to stay optically even). CSS: `font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24`. Size: 295 KB all icons, 1.7-2.6 KB when subset by icon name and axis range.
Idea to borrow: ONE icon source with continuous axes, not one file per state, and animating an axis is the transition.
Our "state" axis (design, not Google's): custom family of dot icons as a single SVG with `--state` 0..1..2 (idle, working, done), where the same primitives morph. Idle = hollow ring (r=6, stroke 1.5). Working = ring + 90 deg arc `stroke-dasharray` rotating (transform, compositor). Done = ring fills (`fill-opacity` 0->1) and tick draws via `stroke-dashoffset`. Drive with `data-state` plus CSS transitions (effects spring-like `linear()`, 200-300 ms) or `motion` on a single MotionValue. Add an `opsz` analogue: thinner stroke at 16 px, thicker at 48 px (`--sw` token). Keep geometry in a 24-unit box. For free: the stage strip becomes data: `stage.state` maps to visuals, no per-stage assets.

## 5. Application to DIGITAL

(a) 4-stage workflow strip with animated dot orbs
- Orbs = 1 SVG per stage, `data-state` idle -> working -> done, advanced by the strip's scroll progress (`--p` or `view()` timeline) so the current stage is "working" and prior ones "done".
- Orb idle loop: CSS transform rotation or the `linear()` bounce, no JS; pause when off-screen (IO) and under reduced motion.
- Stage change: fast-spatial spring on the active marker (800/0.6), effects-default on the label color (1600/1.0).
- Copy: 3-8 word stage name + one 15-20 word line, like a Google feature card. Accordion rows on mobile (Buds pattern).

(b) Scroll-driven exploded isometric phone + sticky subsystem list
- Build from layered SVG parts, each `translate` offset = `--p * dist`, one sticky container (like Pixel's `position:sticky`). Not video scrub, not frame sequence.
- Primary: `animation-timeline: view()` on the stage wrapper. Fallback: one rAF listener writing `--p`. Reduced motion: show the exploded end state, list still clickable.
- Subsystem list is sticky beside it; the active item highlights via `view()` ranges or IO; item <-> part linked by color dot (state axis again). Clicking an item can use `startViewTransition`-free scroll-to via `scrollIntoView` (smooth only if motion allowed).
- Layer budget: <= 3 `will-change` groups at once; parts promote only while the section is intersecting.

(c) Reading-glasses page with RSVP word-at-a-time demo
- RSVP is JS timing, not scroll motion: a 1-word `<span>` swapped every 60000/wpm ms. Only the word text changes (no layout shift: fixed-width mono box, ORP letter aligned with a fixed accent column). Cost is trivial. Start/stop with a Google-style visible pause button (they overlay pause and replay on clips).
- Do not scroll-scrub the words. Autoplay only on user press; honor reduced motion by defaulting to a paused, tap-to-advance mode.
- Optional glasses b-roll as a muted loop (poster first, `preload="none"`).

## 6. Use / adapt / avoid

Use
1. M3E spatial/effects spring split with the exact tokens above (fast-spatial for controls, slow-spatial for big parts, effects springs for color/opacity).
2. Compositor-only motion plus `@supports` gating of scroll-driven CSS, JS `--p` fallback, one global reduced-motion policy.
3. Persistent single-CTA bar (pill header desktop, bottom bar mobile) and 3-8 word headlines at 500 weight.
4. Muted loop clips with poster, `preload="none"`, IO start, visible pause control.
5. `content-visibility: auto` on below-fold sections.

Adapt
1. Material Symbols axis concept: one dot-icon with a state axis (idle/working/done) instead of Google's FILL/wght/GRAD/opsz.
2. Shape morph: SVG path morph between matched-structure shapes (dot to ring to pill) instead of Compose RoundedPolygon.
3. Google reveal (clip-path inset + scale 1.1->1, about 0.7-1.3 s): shorten to 400-700 ms, trigger once via `view()` or IO.
4. Accordion rows to cut copy on mobile (Buds), but keep real text in DOM.
5. View Transitions for state swaps only; manual `startViewTransition` on Next 14 for route changes.

Avoid
1. Google's media weight (31 MB video, 9 MB images, 2.3 MB JS per scroll). Cap ours at a fraction.
2. Video `currentTime` scrubbing and big canvas frame sequences for the phone.
3. Relying on `<ViewTransition>` or `transitionTypes` (needs Next 16 / React canary, not Next 14.2 + React 18).
4. Using `animation-timeline` without fallback (Firefox not shipped as of MDN BCD today).
5. Overshoot on opacity or color; bounce on text.

## Gaps / unverified
- Apple comparison used the hub page only. Product-page numbers belong to the Apple scout.
- `motion` library's own ScrollTimeline acceleration claim not verified here. Test before relying on it.
- Spring `damping` conversions are my arithmetic. Check feel in a live demo.
- Firefox `animation-timeline` status changes quickly; recheck before building.
