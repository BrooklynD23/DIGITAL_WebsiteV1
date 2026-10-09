# SHADES round 2, approach 2: research platform

Route: `/projects/shades-research/` (`robots: { index: false }`, not in the nav or the sitemap).
Files: `app/(apple)/projects/shades-research/page.tsx`, `research.module.css`. Server component, no client JS of its own.

## Structure (after the Fable render audit)

A lab notice. Type carries the page. Space separates chapters; 1px hairlines appear only inside data (dl rows,
lists, roadmap entries), per `DESIGN.md` §8. No pin, no how-it-works sequence, no diagram, no cards, no eyebrows.

| # | Beat | Tone | Layout | Content (source) |
|---|---|---|---|---|
| 0 | Hero | dark | centred | `hero.h1`; default `conceptLines` entry (its two sentences on two lines); solid `Glasses` once, `tether` on, at the 1024 measure, `heldWord` in the lens; caption `shades-reveal` `hero.renderCaption`, then `SHADES.expansion` |
| 1 | What it is | dark | statement, then row | `whatItIs` at h1 size; `tracks.title` left, the two tracks as a `dl` right |
| 2 | Boundary | light (seam) | **centrepiece**, centred | `boundary.title`; Is / Is not / Never `dl`, details at h2 size; `boundary.line` |
| 3 | First build | light | stack | `scope.title` + `scope.intro` on top; `scope.in` / `scope.out` as two hairline lists side by side |
| 4 | Seats | light | row | `seats.title`, `seats.intro`, `SHADES.join.mentor` left; shared `<Seats>` rows right |
| 5 | Roadmap | light | stack | `roadmap.title` + `roadmap.intro`; 7 numbered entries (large numerals, names under) in one line of columns; 4 columns ≤ 1068px; plain numbered rows ≤ 734px; `roadmap.note` |
| 6 | Join + footer | light | shared | `JoinChapter` (pill "Come to build night", secondary "Ask on Discord", backers), `WorldFooter` |

Measure: 1024px, the same as the LocalNav and footer, so all left edges line up. Geist 600 headings, Atkinson
Hyperlegible Next for every sentence. One dark-to-light seam (`DESIGN.md` §9).

## Decisions

1. **No call to action above the description.** LocalNav has `cta={null}`; the page's one filled CTA is the
   JoinChapter pill.
2. **Seat rows use solid hairlines** on this page (local `.seats a` override; `_shades/` untouched).
3. **No SeatRing, no red.** The ring reads as a diagram; no fixation dot; JoinChapter `visual={null}`.
4. **Tether is on** (coordinator, 2026-10-09): the glasses draw the cable and the external controller box. No
   caption for the box or cable is printed (no such string exists).
5. **Hero object at the full measure** (audit fix 2): the in-lens word reads at 1600 (~20px). At 390 the object is
   358px wide and the word is still small (~7px); see open questions.

## Audit fixes (Fable render audit, 2026-10-09)

| # | Finding | Fix |
|---|---|---|
| 1 | No concept caption on the hero glasses | `renderCaption` imported from `_content/shades-reveal.ts`, shown above the expansion line |
| 2 | Object 380px, word illegible | Object raised to the 1024 measure |
| 3 | Chapter hairlines + orphan rule under the seam | All chapter dividers and the orphan removed; hairlines only in data |
| 4 | Five identical 4fr / 8fr rows | Boundary centred and set large; scope and roadmap stacked at full width; roadmap as numbered columns |
| 5 | Notes said tether off | Updated (this file) |

## Verification (Playwright, headless shell 1246)

| Viewport | Status | Console errors | H-overflow | `<main>` / `h1` | Heading under bar | Tap < 44px | Dashed in hero |
|---|---|---|---|---|---|---|---|
| 1600×790 | 200 | 1 (see below) | none | 1 / 1 | 0 | 0 | 0 |
| 1280×720 | 200 | 1 | none | 1 / 1 | 0 | 0 | 0 |
| 768×1024 | 200 | 1 | none | 1 / 1 | 0 | 0 | 0 |
| 390×844 | 200 | 1 | none | 1 / 1 | 0 | 0 | 0 |
| 1600×790 reduced motion | 200 | 1 | none | 1 / 1 | 0 | 0 | 0 |
| 390×844 no JS | 200 | 0 | none | 1 / 1 | 0 | 0 | 0 |

The one console error is a React dev warning, "Each child in a list should have a unique key prop", raised in
`Glasses` (`_shades-art/Glasses.tsx`, the tether render path). It is not in this route's code and `_shades-art/` is
off limits here; it needs the artwork owner.

`npx tsc --noEmit`: clean. `npx next lint`: clean. The dashed check ignores the exploded-mode parts that `Glasses`
keeps in the DOM at opacity 0 in solid mode.

Screenshots in this folder: `{1600,390}-viewport.png`, `-full.png`, `-s0…s6.png` (s0 hero, s1 what it is + tracks,
s2 boundary, s3 scope, s4 seats, s5 roadmap, s6 join).

## Critique loops

1. Stage line wrapped mid-phrase → one sentence per line. Dashed seat rows → solid. Smooth scroll made the heading
   check unreliable → instant scroll; h1 / h2 scroll margins.
2. Content measure did not line up with the nav → 1024. Matter column too narrow → 4fr / 8fr.
3. Audit round (above).

## Missing strings

- A caption for the controller box or the cable, if one is wanted (only `shades.ts` scope.in "An external
  controller for compute and power" exists).
