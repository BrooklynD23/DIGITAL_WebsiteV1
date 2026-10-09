# SHADES round 2, approach 3: "Hold still" (`/projects/shades-control/`)

Built 2026-10-09. Review route: `robots: { index: false }`, not in nav or sitemap.

## Page

| Beat | What it shows |
|---|---|
| Hero + 1 | `h1` SHADES, the default concept line, `hero.boundary`, then the one control. The site's own copy is typeset live (`lineText` + `pageWords`, read as one paragraph). A native `<input type="range">` sits under it, with five detents: Page, Line, Phrase, Word, Hold. `simulationNote` sits under the figure and the step caption under the slider. |
| 2 | "Set the pace." + `pace.caption`, then the shared `Reader` (`reader.wpm` 100–600), then `simulationNote`. |
| 3 | "One word. One point." The solid `Glasses` (three-quarter view, `tether` on) arrive once when the beat enters view, with "still." in the right lens. `glasses.caption` is visible under them. |
| 4 | Shared `JoinChapter` (SHADES seats ring, Discord) + `WorldFooter`. Here the page turns from dark to light (the seam). |

No pin, no scroll scrubbing, no wheel capture. There is one control in the hero.

## How the control works

- **The Page pose is the browser's own layout.** Words stay in normal flow (inline-block). Every other pose is a `transform` delta from the measured flow position, so the server HTML is the Page still and hydration moves nothing.
- **Poses:**
  - Line: the words ending on "still." that fit one line come to the centre row, and the rest of the page parts up and down to 8% ink.
  - Phrase: "eyes hold still." is centred; the rest of the line drops to 16%.
  - Word and Hold: the neighbours collapse into the one point, and "still." sits with its pivot letter (`rsvp.ts` `splitWord`) on the point, scaled up to about 46px.
- **Playhead:** one anime.js tween per slider change, 900ms per step, `inOut(3)`, capped at 1.5× for multi-step moves (the same rule as `useStagePlayback`). It can be retargeted mid-flight.
- **Hold shares Word's pose.** The playhead parks at Word. Hold is a state change: the dot does not move, a tick appears, and the word turns HUD green `#7FE6A3` in a 120ms colour snap. It is flat, with no glow and nothing dimming.
- **On landing, the red fixation point plays that step's jumps once.** Each jump is 120ms. There is one regression. Return sweeps fly straight back and no line is drawn for them. The drawn scanpath (hairline arcs plus ink marks) stays at rest. Jumps per step: Page 21, Line 8, Phrase 3, Word 4 micro-jumps, Hold 0. Nothing loops.
- **Reduced motion:** poses snap (verified: the final transform is reached within 60ms of each key press) and the whole scanpath is drawn at once.
- **No JS:** `@media (scripting: none)` hides the live figure and shows a five-frame still with step names and captions.
- **Keyboard and screen reader:** arrow keys, Home and End step the slider. `aria-valuetext` is the step name. The caption is `aria-live="polite"`. Focus shows a 2px ring on the 44px knob.

## Measured motion (1600×790, headless Chromium; re-measured after the Fable render-audit fixes)

Method: an in-page rAF sampler reads the held word's computed `transform` and `color` every frame (60fps). It is cross-checked by frame differences on a `recordVideo` capture (25fps, ±40ms per edge; the diff window also includes the 240ms step-label colour change). Contact sheets are in `motion/` (40ms per cell, 5×6; `sheet-arrival.png` is 60ms per cell).

| Transition | Intended | rAF measured | Video frame diff | Easing (progress at 25/50/75% of time; `inOut(3)` = 0.063/0.500/0.938) |
|---|---|---|---|---|
| Page → Line | 900ms `inOut(3)` | 900ms | 919ms | 0.092 / 0.516 / 0.953 |
| Line → Phrase | 900ms | 900ms | 920ms | 0.072 / 0.467 / 0.934 |
| Phrase → Word | 900ms | 867ms | 879ms | 0.062 / 0.461 / 0.910 |
| Word → Hold | 120ms colour snap, no movement | 100ms colour, 0 transform frames | under the diff threshold (1 frame) | — |
| Hold → Page (Home key) | 1350ms (1.5× cap), starts at once | 1300ms | 1520ms | — |
| Glasses arrival | 900ms `--r2-ease-entrance` + 480ms opacity; word on at +900ms in 120ms | 833ms of visible change | 1040ms + 280ms (word switching on) | 0.27 / 0.96 / 1.00 (ease-out) |
| Each jump | 120ms `inOut(2)` | by code (`HOP_MS`) | `sheet-line-jumps.png` | — |
| Caption swap | 240ms opacity | by CSS | — | — |

Opacity during moves:
- A word changes ink only in the half of the move nearest its brighter pose: it is gone before the collapse closes, and back only once it has arrived.
- A word that changes row (the line re-forming into the page) dips to 25% at mid-move.
- `sheet-t4-0.png` shows no legible pile-up over the held word.

## Verification

| Viewport | Mode | Status | Console errors | Overflow | `main` / `h1` | Heading under bar | Targets < 44px |
|---|---|---|---|---|---|---|---|
| 1600×790 | default | 200 | 0 | 0 | 1 / 1 | 0 | 1 (shared LocalNav "BRAIN", 35×44) |
| 1280×720 | default | 200 | 0 | 0 | 1 / 1 | 0 | same |
| 768×1024 | default | 200 | 0 | 0 | 1 / 1 | 0 | same |
| 390×844 | default | 200 | 0 | 0 | 1 / 1 | 0 | 0 |
| 1600 / 390 | reduced motion | 200 | 0 | 0 | 1 / 1 | 0 | as above; poses snap, Hold reached |
| 1600 / 390 | no JS | 200 | 0 | 0 | 1 / 1 | 0 | stills: 5 frames shown, live figure hidden |

The slider thumb is 44×44 (20px visible knob). `npx tsc --noEmit` and `npx next lint` are clean.

## Fable render-audit fixes (2026-10-09)

1. **Ghost lines:** a parted line stays only if its glyphs land inside the figure's unfaded band; otherwise it goes to 0. Measured on every step at 1600 and 390: 0 inked words cross the boundary line or the simulation note.
2. **Scanpath coverage:**
   - Page now reads every line: 3 of 3 rows at 1600, 5 of 5 at 390; marks x 321–1184 on a 300–1240 page.
   - Line covers the whole line: marks x 366–1219 on a 337–1264 line.
3. **Join:** `<Seats>` rows render inside `JoinChapter`, as on approach 1.
4. **Mid-tween pile-up and smudge:**
   - The opacity windows above fix the pile-up.
   - Word's micro-jumps are now one tiny correction onto the point with no arc drawn (the squiggle is gone).
5. **Caption height:** reserved at two lines and measured constant across all five steps (58px at 1600, 50px at 390).

## Critique → fix loops (impeccable)

1. **Loop 1:**
   - The Page scanpath dots sat on the text and arcs struck through line 1, so I opened the leading to 2.05 and put the dots in the gap.
   - Phrase words were cut hard at the box edge, so I added a side fade bleeding into the gutter.
   - Collapsing neighbours piled up over "still.", so they now fade to 0.
   - The 1000px-wide focus outline became a knob ring.
2. **Loop 2:**
   - Routed return-sweep lines read as boxes around lines, so they are no longer drawn.
   - A stray ghost word sat on the line's own row, so it is now hidden.
   - The caption fell below the fold at 1600×790, so I tightened the spacing.
   - Words faded linearly while collapsing, so they now leave early and arrive late.
   - The no-JS stills were stacked one word per line inside card frames. They are now plain typeset frames.
3. **Loop 3 (motion):** the Hold → Page dead time (see above).
