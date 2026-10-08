# SHADES mockup A — "the object leads"

Route: `http://localhost:3100/projects/shades-a/` (`robots: { index: false }`, not in nav or sitemap, nothing committed).
Source: `app/(apple)/projects/shades-a/`. Screenshots in this folder: `1600-<n>-<stage>.png`, `390-<n>-<stage>.png`.

## 1. What each stage shows

One pinned section, one artwork, seven played stages (`useScrollSteps` count 7, `useStagePlayback` 1100 ms).
The glasses are 3D geometry in millimetres, written in code (`_art/scene.ts`) and projected per frame, so every
stage is a pose of the same parts. Original design: a soft-square frame, a plain arched bridge,
straight temples. No brand mark, nothing traced.

| # | Tracker | Figure | Under the figure |
|---|---|---|---|
| 0 | (none) | Dots scattered along six "lines" travel to one red point; the word appears there in green. Plays once per entry, timed | `hero.boundary` |
| 1 | Idea | Front elevation of the frame forms around the point: right lens first, then the rest. Dotted construction lines | |
| 2 | Form | The same drawing turns to three-quarter view. Temples, hinges, back face appear. Word in the right lens | |
| 3 | System | Parts separate and take a colour: frame (blue), lenses drop out (violet, Optics), display region lifts above its lens (green, dashed). Word timing and Control are dashed boxes drawn beside the frame (below it on phones) | Five-function legend: label + role |
| 4 | Optics | Camera closes on the right lens; the rest dims to 26%. Dashed display region, word, red point. Tags "Display", "Optics" | |
| 5 | View | Lens seen straight on. The book photograph appears inside the lens only. Words of one sentence of `bookWords` arrive one at a time at the point (340 ms each), then `heldWord` stays | `viewNote` |
| 6 | Glasses | Whole frame, calmer three-quarter view, word small in the right lens | Seven roadmap phases + `roadmap.note` |

After the pin: reader demo (`_shades/Reader.tsx`, unchanged), then light: two tracks + boundary, first-build
scope, `JoinChapter` with seats, footer. Dropped from V0.1: scan-path chapter, `shades-fixate` clip, light-path
pin, highlights strip, the separate roadmap section (now stage 6).

## 2. Book photograph: what I did about its text

Chosen: **the clear plate, softened in CSS (`filter: blur(3.5px)`), dimmed to 50%, cropped by the lens outline.**

- Why: at 3.5px the printed lines still read as a page of a book, but no word can be read, so "recnocile",
  "onccome", the page numbers and the running heads are gone. The pre-blurred plate (`book-blurry-*`) was not used:
  viewed on its own it is so soft that the book stops reading as a book. It was not tried inside the page.
- Why not "cover with live words": a typeset paragraph on top of a photographed page doubles the text and fights
  the one held word, which is the point of the stage.
- The live words are in the lens instead: the stream is `bookWords[5..17]`, ending on `heldWord`.
- Caveat: the file on disk still contains the typos (anyone who opens the image URL can read them). If that
  matters, bake the blur into the encoded file; the CSS then drops its filter.
- Dimming is needed for contrast: on undimmed paper the green word is unreadable. See the white variant.

## 3. Word colour

- Green `#7FE6A3`, flat, no glow. Red point `#d8412f`.
- White variant: two buttons beside the tracker, labelled with their values (`#7FE6A3`, `#FFFFFF`). It recolours
  the word in every stage. Frames saved: `1600-5-view-white-word.png`, `390-5-view-white-word.png`.
- Observation: over the dimmed page, white has more contrast than green. Over black they are equal in practice.

## 4. "Concept" labelling

Shown in place: a small outlined pill **Concept** + "SHADES is in planning. Parts are not chosen yet." on its own
line under the tracker, visible in all seven stages and in the stills. The hero foot also prints the boundary.

Alternatives from `conceptLabels`:

| id | Tag | Disclosure | Used by |
|---|---|---|---|
| `concept` | Concept | SHADES is in planning. Parts are not chosen yet. | A (shown) |
| `planning` | In planning | A concept in planning. Parts are not chosen yet. | B |
| `diagram` | Concept drawing | Diagram, not a render. Parts are not chosen yet. | neither |

Other positions considered: beside the `h1` in the hero only (lost after one scroll); in the nav bar (shared
chrome, off limits).

## 5. Reduced motion and no JS

No pin. Seven stills in normal flow, server-rendered from the same geometry, each `role="img"` with the stage's
`still` text, plus the same copy, legend, roadmap and notes. Tracker and colour buttons are hidden (not shown
disabled). The reader demo keeps its own fallback.

## 6. Decisions I took that need a yes or no

1. **Dashed frame.** `DESIGN.md` §11: dashed = planned. The frame is dashed (`7 3`); only the word and the point
   are solid. Solid looks more finished. One CSS line switches it (`[data-kind='solid']` in `concept.module.css`).
2. **A five-colour palette for the System stage** (SIDEKICK's recipe; display = the HUD green). New hues on SHADES.
3. **Hex values as the colour buttons' labels.** No label string exists in the content files.

## 7. Known gaps

- Catalogue styles (tracks, boundary, scope, reader chapter, nav spacing toggle) are imported unchanged from
  V0.1's `projects/shades/apple.module.css`. Move them when a mockup is chosen.
- Geometry is inline in a module (about 8 KB), not a static SVG + `<use>` (`DESIGN.md` §18), because it is
  re-projected per frame.
- The frame is small in the System stage at 1600×790: the box is wide and short, and the legend takes 90px.
- The far temple shows through the left lens in stages 2 and 6 (lenses are clear). No hidden-line removal
  beyond flat black rim faces.
- The pivot letter is not marked; the word is centred on the point.
- Phones: in-figure tags are hidden in the System stage (the legend names the groups); tracker shows markers only.
- The hero dots carry no note. `SHADES.problem.figureNote` ("Illustrative, not recorded data") could be added.
- SIDEKICK and BRAIN were not re-screenshotted: no shared file was edited.
- Not built in a clean copy (`next build`); dev server only.

## 8. Missing copy strings (not invented)

| Needed for | Used instead |
|---|---|
| Label for the word-colour control ("Word colour", "Green", "White") | the two hex values |
| `aria-label` for the stage tracker and for the stills list | `SHADES.name` |
| Note under the hero dots | none (see gaps) |
