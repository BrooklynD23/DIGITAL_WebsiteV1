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
