# MASCOT: "The Module", a brand-adapted page mascot

Recommendation: **ship no mascot on the homepage.** If the Head Designer wants one, use The Module
as an **opt-in easter egg on `/projects/*` and the 404 page only**, never on the homepage by default.
Prototype: `/design-lab/mascot` (toggle on/off to compare). Sources: ORIGINAL_PROMPT §16, §42, §43.
Copy here is exploratory and still goes through brand-voice-strategist → brand-guardian.

## 1. Route decision: (b) code-drawn SVG

| Route | Verdict | Why |
|---|---|---|
| (a) Adapt one of the 52 pre-drawn characters | Rejected | Viewed `gearbot`, `crt`, `cube` (`renders/mascot/v1/stock-reference-gearbot-crt-cube.png`). All are chibi, full-colour, sticker-style. That is the "sticker whimsy" CONTEXT-PACK §5 says to avoid, and §16 says no cartoon animal. They can't be restyled: each is a raster sprite sheet. |
| (c) Gemini (≤2 images) | Rejected | The page-mascot build needs Python PIL/numpy/scipy (missing) to key and align the sheets. 2 images = 1 character with no retry. Output would still be a raster chibi, and image-model art of a "member" risks reading as fabricated. |
| **(b) Code-drawn SVG from real artifacts** | **Chosen** | Built only from things DIGITAL actually makes. Restyles with tokens. No raster, no new deps. About 4.5 KB gzipped source, and it loads as its own lazy chunk. |

Character anatomy. Every part maps to a real fact:

| Part | Real source |
|---|---|
| Body: subsystem board, mounting holes, `DIGITAL` silkscreen | DG-001 Modular Smartphone, the subsystem as the unit of ownership |
| 7 edge pins plugged into the hero rule | 7 subsystems (`phoneV2.ts:140-288`) |
| Eyes: round lenses + bridge + temples | DG-002 Smart Reading glasses |
| Mouth: dark strip that shows one word at a time | RSVP method; the word sequence plays at the real 450 wpm demo rate |
| Poke payoffs `REVIEW → PASS → SIGNED` | Ownership model "one review path / one test gate" + thesis "put your name on" |

Interaction mechanics are adapted from `page-mascot` 0.1.0 (MIT): head follows a fine pointer, a poke blinks and then pays off, 4 quick pokes = dizzy, the squash animation honours reduced motion. The 9-cell sprite swap is replaced by continuous SVG transforms. The npm package itself isn't imported.

## 2. Behavior states

| Trigger (page event) | Reaction | Reduced-motion opt-in |
|---|---|---|
| Fine-pointer move, or keyboard focus anywhere | Pupils aim at the pointer or the focused element (dead zone 48px, max 5.2 units) | Pupils jump, no easing |
| Idle (every 3.5–7.5s, randomized) | Blink, 150ms | No blinks |
| No pointer activity for 20s | Lids half-closed ("sleepy"); blinking stops, so no timers run | Same, static |
| Hover/focus `[data-mascot="dg-001"]` | Strip `DG-001`; 7 pins light gold in sequence (60ms each) | All 7 light at once |
| Hover/focus `[data-mascot="dg-002"]` | Strip RSVP `one · word · at · a · time` at 450 wpm, then `DG-002` | Shows `DG-002` only |
| Hover/focus `[data-mascot="join"]` (both CTAs) | Pupils narrow (attentive); strip `THU 6PM` | Same |
| Poke 1 / 2 / 3 (mouse only) | Blink → `REVIEW` / `PASS` / `SIGNED`, squash | No squash |
| 4 pokes within 1.6s | Cross-eyed + `RETEST`, then recovers after 1.1s | Same, no squash |
| Pause pressed / scrolled off screen / tab hidden | Frozen neutral face; every listener and timer removed | n/a |

Hooks are declarative: a page opts an element in with `data-mascot="<key>"`. The mascot never reads page content.

## 3. Where it would appear

- **Allowed (opt-in):** perched on the rule under a project page's hero (`/projects/modular-smartphone`, `/projects/smart-reading`), where its parts refer to the project on screen. Also the 404 page, which is a low-stakes spot for personality.
- **Never:** homepage default state; `/contact` and every form; legal pages; `/team` (it would sit beside people); any print or OG image; over or inside content; fixed or sticky positioning (it would follow and obstruct the reader).

## 4. A11y + perf rules (§42, §43). All verified by `design-lab/scripts/mascot-states.mjs`: 22 of 22 PASS

1. The decoration is `aria-hidden="true"` and holds no focusable element. The poke is a mouse-only bonus.
2. A real toggle `<button aria-pressed>`, with the accessible name "Mascot" and the visible state `On/Off`. A separate **Pause motion** `<button aria-pressed>` covers WCAG 2.2.2.
3. Off by default under `prefers-reduced-motion`. The user can opt in to a still version.
4. On touch, coarse-pointer or <768px windows: it never mounts. The toggle is `aria-disabled` and a live status line explains why. CSS hides the perch too, so nothing flashes before JS runs.
5. No layout shift: the perch is absolutely positioned at a fixed size. Measured section tops `247/765/1571` are identical on and off.
6. Lazy: `next/dynamic({ ssr:false })`, mounted only when enabled. No rAF loop: pointer aim is at most 1 rAF per move, and blinks use one setTimeout. It stops completely off screen (IntersectionObserver), in a hidden tab, when paused, or when asleep.
7. Content renders server-side without JS. The mascot is pure enhancement. Console errors: 0 at every viewport and state.

## 5. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Credibility: a face on a builder org's homepage reads "student club" or "toy", against §20 | High | Keep it off the homepage. Line-art in production tokens, no chibi proportions. |
| Distraction: motion beside the thesis competes with the one focal object per page (CONTEXT-PACK §5.8) | High | Opt-in only. Sleeps after 20s. Pause control. Never beside a form. |
| Gimmick decay: the joke is spent after one visit | Medium | Reactions carry real info (project code, build night time), but that info already sits on the page |
| Conflicts with the production crosshair cursor (`CursorProvider`), which shows in the close-ups | Low | Hide the crosshair while it hovers the mascot, or drop one of the two |
| Maintenance: reactions keyed to copy (`THU 6PM`) can drift from `siteConfig` | Low | Derive strip text from `lib/data` before any production use |

## 6. Honest recommendation

The comparison (`with.png` vs `without.png`) shows the page is **complete and more serious without it**. The thesis is
the focal object, and the Module pulls the eye to the bottom-right corner, away from the CTA. The Module beats any stock
mascot because every part is a real DIGITAL artifact, but "the best mascot" is still a mascot. **Default: none.**
If the team wants a signature, reuse the Module's **drawing** (board + 7 pins + lens pair) as a static identity glyph for
project pages or the 404. That keeps the artifact-derived wit without motion.

## Files

- `app/design-lab/mascot/{page.tsx,MascotDemo.tsx,ModuleMascot.tsx,content.ts,mascot.module.css}`
- `design-lab/scripts/mascot-states.mjs`: with/without + 6 close-ups + 22 behaviour/a11y checks
- `design-lab/renders/mascot/v1/`: `mascot-{desktop,tablet,mobile}.png`, `with.png`, `without.png`, `closeup-*.png`, `closeups-strip.png`, `stock-reference-gearbot-crt-cube.png`
