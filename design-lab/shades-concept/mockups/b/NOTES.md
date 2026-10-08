# SHADES mockup B — "the book leads"

Route: `http://localhost:3100/projects/shades-b/` (`robots: { index: false }`, not in nav or sitemap).
Source: `app/(apple)/projects/shades-b/`. Built 2026-10-08. Not committed.

## 1. What each stage shows

One pin, seven stages, `useScrollSteps` (count 7, playShare 0.72) + `useStagePlayback` (1100 ms). One glasses
geometry (`_frame/geometry.ts`, millimetres, orthographic yaw + pitch) is re-projected for every pose, so each
stage is a real turn of one object.

| # | Stage | Ground | Figure |
|---|---|---|---|
| 0 | Hero | Paper | The live page (44 `bookWords`) in two halves. 12 fixation marks hop along the lines with one jump back, then land on one point. The word plate appears there and the page's words arrive one at a time at 100 wpm; the matching word is underlined on the page. Pause button stops it |
| 1 | Idea | Paper | Dashed front elevation drawn around the plate, centre lines, side elevation at the right (≥ 900px) |
| 2 | Form | Paper | The same frame turned three-quarter, flat ink body, tinted lenses, word in the wearer's right lens |
| 3 | System | Book dimmed 90% | Dashed line art. Optics blank and display lift off the word lens along one axis. Tags: Frame, Optics, Display. Word timing and Control are dashed boxes off the frame, chained to the display |
| 4 | Optics | Book dimmed 86% | Close on the word lens. The lens is a bright window: the page is seen only through it, with the word on its plate |
| 5 | View | Paper | Front view, lens fills the figure. Flat 30% lens tint over the live page; green word on its dark plate; the same word underlined on the page |
| 6 | Glasses | Paper | Whole frame again, three-quarter, solid |

After the pin: reader demo (reused as is) → two tracks with the five `systemGroups` and the boundary → first-build
scope → seven-phase roadmap (all `#000` / `#161617`) → shared `JoinChapter` with seats → `WorldFooter`.

## 2. Book-text handling

**Chosen: the blurred plate only** (`book-blurry-1920` / `book-blurry-mobile`), zoomed onto the right-hand page
(spine at the left), warmed with a CSS filter, under a flat 40% paper wash.

- Why: no baked-in word is legible, so the typos, page numbers, running heads, magazine and desk are all gone
  without retouching. The live words are the only sharp text, which is the concept (only the point you look at is in focus).
- Cost: 5 KB AVIF desktop, 2.6 KB mobile. The clear photograph is not loaded on this route.
- Contrast: ink `#1d1d1f` and `#3d3d42` on the washed paper; the two dimmed stages switch copy to `#f5f5f7` / `#a1a1a6`.
  Not measured by tool; checked by eye in the screenshots.

## 3. Held word over paper

Green `#7FE6A3` on a flat dark plate (`#0b0f0d`, dashed outline = the planned display region), plus a flat lens
tint. No glow, no blur. The red point sits under the pivot letter. `1600-5-view-white-word-variant.png` shows the
white word for comparison (screenshot only; injected CSS, not shipped).

## 4. Concept label

- In place: dashed chip **"In planning"** + "A concept in planning. Parts are not chosen yet." under the tracker,
  every stage and on the still page. Dashed = planned, as in `DESIGN.md` §11.
- Alternative 1 (`concept`): "Concept" + "SHADES is in planning. Parts are not chosen yet."
- Alternative 2 (`diagram`): "Concept drawing" + "Diagram, not a render. Parts are not chosen yet."

## 5. Known gaps

1. Phone, whole-frame stages (Idea, Form, Glasses): the word in the lens is about 10px. Legible as a mark, not as text.
2. Idea line art: rims, bridge and end pieces are separate outlines, so short overlap lines show at the joins.
3. Two tone seams (paper → black after the pin, black → light at Join). `DESIGN.md` §9 allows one.
4. Solid body in Form / View / Glasses, although `DESIGN.md` §11 says dashed = planned. The chip and captions carry the "planning" message there.
5. The pin sets `data-tone` on the shared LocalNav from page code (light on paper, dark on the two dimmed stages). `ToneSync` is untouched.
6. Geometry is inline in code, not a static SVG + `<use>` (`DESIGN.md` §18), because it is re-projected every frame.
7. Shared "Skip to content" link measures 106×24 (shared chrome, same on every page).
8. Stills omit the side elevation and the per-word pivot alignment.

## 6. Missing copy strings (not invented)

| Need | Used instead |
|---|---|
| Tracker `aria-label` (e.g. a "concept stages" label) | `SHADES.name` |
| Pause / play label for the hero word stream | `SHADES.reader.controls.pause` / `.resume` |
| Heading for a system-detail section | `SHADES.tracks.headline`, groups listed under Engineering |
| Figure note for Idea / Form / Glasses | none shown |

## 7. Verification (2026-10-08)

| Run | Status | Console errors | scrollWidth | main / h1 | Heading under bar |
|---|---|---|---|---|---|
| 1600×790 | 200 | 0 | 1600 | 1 / 1 | 0 |
| 1280×720 | 200 | 0 | 1280 | 1 / 1 | 0 |
| 768×1024 | 200 | 0 | 768 | 1 / 1 | 0 |
| 390×844 | 200 | 0 | 390 | 1 / 1 | 0 |
| reduced motion 1600 | 200 | 0 | 1600 | 1 / 1 | 0 (stills, no pin) |
| no JS 390 | 200 | 0 | 390 | 1 / 1 | 0 (stills, no pin) |

Tap targets: all ≥ 44px except the shared skip link. `npx tsc --noEmit` clean. `npx next lint` clean.
Screenshots: `1600-0-hero.png` … `390-6-glasses.png`, `*-tail-*.png`, `reduced-1600.png`, `nojs-390.png`.
