# SHADES round 2 · approach 1 · Product reveal — notes

Route: `/projects/shades-reveal/` (review only; `robots: { index: false }`, no nav or sitemap entry).
Built 2026-10-09 with the `impeccable` skill (new-work → craft floor → two critique/fix loops).

## Files

| File | What |
|---|---|
| `app/(apple)/projects/shades-reveal/page.tsx` | Page: hero, "what SHADES is", view, close, "Is this real?", shared `JoinChapter` + `WorldFooter` |
| `app/(apple)/projects/shades-reveal/AnatomyPin.tsx` | The one pin: 4 stages, `useScrollSteps` + `useStagePlayback` |
| `app/(apple)/projects/shades-reveal/reveal.module.css` | All page styles (fonts and root from `../shades/apple.module.css`, read-only import) |
| `design-lab/shades-concept/round2/reveal/RENDER-PROMPTS.md` | 2 image-gen prompts (RV-HERO, RV-CLOSE) |
| `design-lab/shades-concept/round2/reveal/*.png` | Screenshots of every beat and stage at 1600×790 and 390×844 |

## Story (5 beats)

1. **Hero.** `h1` "SHADES", concept line (`conceptLines` a, `isDefault`), the solid glasses three-quarter on `#000`, lens empty, caption "Concept render. Not a built device." One authored motion: the object arrives (opacity, 24px rise, 6px blur → sharp, 1.4 s, expo-out); off under reduced motion.
2. **What SHADES is.** The three `whatItIs` declaratives as display type. No heading, no eyebrow, no card; first line full ink, the next two ink-2.
3. **Anatomy.** One pin. It arrives on the solid object (the hero pose, `fit="room"` so the pose changes in place); after 7% of the pin it separates into the five group-coloured bodies. 4 stages from `anatomy.beats`: frame, display, optics, word timing + control. Right column: stage heading + one line, then a hairline legend of the five groups (swatch, label, role), lit rows follow the stage. Tracker: 4 buttons (44px) with the group hue. Scroll only picks the stage; the playhead tweens (1100 ms per stage, capped 1.5) and the shown stage follows `Math.round(playhead)`, so a jump of three plays the two between. No scrubbing, no wheel capture.
4. **The view.** `stages[4]` title + caption. A lens-shaped window in the black; inside, a page typeset live in Atkinson Hyperlegible Next (`bookWords`), top and left paper edges in view so it reads as a page, seen through a grey tint. The held word (`heldWord`, "word") in flat `#7FE6A3`, the red point `#d8412f` above it, held in the gap between the two paragraphs so the page stays legible around it. Caption "Illustrative view". No photograph.
5. **Close.** The solid glasses, front, same caption; `stages[5]` title + caption; the 7 roadmap phases as a numbered hairline list; `roadmap.note`; then "Is this real?" (4 Q/A rows, hairlines); then `JoinChapter` (SeatRing + Seats, as on `/projects/shades/`) and `WorldFooter`.

## Stand-ins

- **Both object images are code stand-ins** for future generated renders (`Glasses.tsx`, `mode="solid"`). Prompts in `RENDER-PROMPTS.md`. Swap-in steps are at the end of that file; keep the HTML caption.
- **`tether` is on** in every `<Glasses>` call (hero, close, pinned and static anatomy), per the Head Designer's 2026-10-09 change (cable to an external controller box; heavier temples). In the anatomy, Word timing and Control now lift out of the box as solid modules, so the pin has no dashed strokes at all. The render prompts include the cable and box. No caption for the box or cable is printed (no approved string).
- `Glasses` keeps its exploded labels positioned to the right of the box even in solid mode (opacity 0); `.render` clips them (`overflow-x: clip`) and the narrow anatomy keeps 64px of room for them. Worth fixing in the artwork (not mine to edit).

## Verification (2026-10-09, Playwright headless, server on :3100)

| Check | 1600×790 | 1280×720 | 768×1024 | 390×844 | reduced 390 | no-JS 1280 | no-JS 390 |
|---|---|---|---|---|---|---|---|
| Status 200 | pass | pass | pass | pass | pass | pass | pass |
| Console errors | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Horizontal overflow | none | none | none | none | none | none | none |
| One `<main>` / one `h1` | pass | pass | pass | pass | pass | pass | pass |
| Pinned stage below the 52px bar | top 52px | 52px | 52px | 52px | static | static | static |
| Tap targets ≥ 44px (page-owned) | pass | pass | pass | pass | pass | pass | pass |

Tap-target exceptions are all shared chrome, not owned here: footer text links (28–43px wide × 44px tall) and the off-screen skip link (106×24). Same on every Apple-system page.

Round-1 failure checks:

| Check | Result |
|---|---|
| No dashed stroke in hero or closing frames | pass (none anywhere on the page with `tether` on) |
| Reads as a product page, not a diagram | pass: object, statements, one diagram pin, a view, the object again |
| ≤ 4 stages in the pin | pass: 4 (plus the pre-separation hold, not a stage) |
| Typeset page behind the word reads as a page at 390 | pass: paper edges, two paragraphs, 12px text (see `390-04-view.png`) |
| Hero lens empty | pass |
| Max two object images | pass: hero + close (the anatomy drawing is the brief's line/exploded beat) |

## Critique loops

1. Loop 1: stage heading split "see-/through" → non-breaking hyphen at render and a wider column; held word collided with the text line and red point sat on "the" → word now held in a paragraph gap; lens too big for 790 → sized from viewport height; lens shape read as an egg → flat brow, rounded lower corners (matches the frame's D lens); 390 hero object tiny (figure shrink-wrapped) → full-width figure, content centred.
2. Loop 2: re-shot all beats at both sizes after `tether` landed; one defect: 390 horizontal overflow (32px) from the artwork's hidden labels → clipped / padded. Re-verified: all 7 runs clean.
3. Known: the verify runs saw dev-server reloads while the artwork agent edited `_shades-art/` (one run hit a 500 from their mid-edit `Glasses.tsx`); the final runs were taken after 90 s of no artwork edits.
4. Left as is: at 390 the anatomy drawing is small (about 310px wide) because the tethered pose is wide; legible, labels intact.

## Fable render audit fixes (2026-10-09)

| # | Fix | Before | After |
|---|---|---|---|
| 1 | View: paper and ink; shadows removed | ink rgb(38,36,31) on paper rgb(91,88,82) = 2.19:1; `.paper` box-shadow 0 12.8px 32px; `.lens::after` inset 38px darkening | ink #1d1d1f on paper #8f8c85 = 5.02:1; no shadow, no edge gradient |
| 1b | Held word on the lighter page | green on paper would be about 2.3:1 | the word sits on the display's own region (one flat field, rgba(16,16,16,.72) ≈ #343331): 8.3:1. No glow, no shadow |
| 2 | Tracker labelled (DESIGN §12) | 4 unlabelled squares | active stage names its group(s) beside its square(s): "Frame", "Display", "Optics", "Word timing, Control"; the last stage shows both hues |
| 3 | Pin label systems 3 → 2 | drawing labels + legend + tracker | drawing labels hidden (`[role=img] > span`); legend + labelled tracker carry every name (390 too) |
| 4 | One column, 1024 measure | what x368 w864 · roadmap x480 w640 · FAQ x308 w984 (nav content x336) | what, roadmap (heading, list, note) and FAQ all x336 w928 at 1600, the nav and footer content edge |
| 5 | Type to the scale | `h1` 112/112; statements 52/58 | `h1` `--r2-fs-hero` 80/84 (40/44 at 390); statements `--r2-fs-h1` 56/60 (32/36 at 390) |
| 6 | Pre-separation pose centred | object centre 65px left of the art centre at 1600, 58px at 390 | 8px right at 1600, 4px right at 390 (`translateX(10%)` in solid pose, slides back over 640ms as the parts separate) |

Re-verified after the fixes: 7 of 7 runs status 200, 0 console errors, no overflow, one `main` / `h1`, pin at 52px; `tsc` and `lint` clean. One run during the re-shoot logged a React key warning from `_shades-art/Glasses.tsx` while the artwork agent was editing it; it did not recur. Not ours.

## Merge with "Hold still" (Head Designer pick, 2026-10-09)

This route is the SHADES direction: the product reveal with the Hold still slider as its view beat.

| # | Change | Where |
|---|---|---|
| 1 | Beat 4 is now `HoldStill` (imported from `projects/shades-control/HoldStill.tsx`, unchanged; it prints `simulationNote` as its own figcaption). Not pinned. Title and caption from `view`. The old lens-window figure, `figureLabel` and all its CSS are deleted. No-JS: `ViewStills.tsx` (the control page's five-frame still, which is local to its `page.tsx`, so it is mirrored here) plus `simulationNote`; it reuses `control.module.css` `.live` / `.noscript` (read-only import) | `page.tsx`, `ViewStills.tsx`, `reveal.module.css` |
| 2 | Hero line: still the `isDefault` entry, now "A concept in planning. A research platform, not a medical device." | `page.tsx` |
| 3 | Box caption (`boxCaption` default) under the hero and closing objects, as a second quiet line under "Concept render. Not a built device." Each fits on one line at 390 | `RenderCaption` in `page.tsx` |
| 4 | "Is SHADES a medical device?": the `boundaryTable` rows (Is / Is not / Never) as a small hairline `dl` under the sentence | `page.tsx`, `.bounds` |
| 5 | The grey display panel: approved. With the lens figure gone, no word sits on paper on this page (HoldStill sets its page on black), so there is no panel to keep | — |
| 6 | `SHADES.expansion` is not printed anywhere (grep clean) | — |
| 7 | Standard local nav with its "Pick your seat" button, unchanged | — |
| — | `whatItIs` is now 2 lines (brand review); the layout maps the array, no count assumed | — |

Critique → fix loop (merged page): the "what" band left an empty 256px under the second statement before the pin's own top room → bottom padding 128 → 64px. Open, outside this folder: at the Hold step `HoldStill` clears the page completely (ghost lines go to 0 at Word and Hold; `GHOST = 0.08` only at Line), so the title's claim "The page stays in view" is not shown at the end of the slider (see `1600-04-view-5-hold.png`). Needs a change in `shades-control/HoldStill.tsx` (see "Prop change" below).

**Prop change needed in HoldStill (not made; not my folder):** keep the typeset page faint behind the word at Word and Hold, e.g. an optional `pageAtHold?: number` (opacity of the off-line words at steps 3–4, default today's 0; this page would pass about 0.12–0.16), or make that the default for both routes.

Verification after the merge: 7 of 7 runs status 200, 0 console errors, no overflow, one `main` / `h1`, pin at 52px; the range input and tracker are ≥ 44px; no-JS shows the five stills and the note (range hidden); reduced motion keeps the slider (poses snap). `tsc` exit 0, `next lint` clean. Screenshots: every beat and stage at 1600×790 and 390×844, including the five slider steps (`*-04-view-1-page.png` … `*-04-view-5-hold.png`), plus `nojs-390-view.png`, `reduced-390-view.png`, `nojs-390-full.png`, `reduced-390-full.png`.
