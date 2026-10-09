# SHADES round 2, approach 2: research platform

Route: `/projects/shades-research/` (`robots: { index: false }`, not in the nav or the sitemap).
Files: `app/(apple)/projects/shades-research/page.tsx`, `research.module.css`. Server component, no client JS of its own.

## Structure

A lab notice. Type and 1px hairlines carry the page. No pin, no how-it-works sequence, no diagram, no cards, no eyebrows.

| # | Beat | Tone | Content (source) |
|---|---|---|---|
| 0 | Hero | dark | `hero.h1`, default `conceptLines` entry (split into its two sentences for layout), solid `Glasses` once (three-quarter, 380px max, `heldWord` in the lens), `SHADES.expansion` as the caption |
| 1 | What it is | dark | `whatItIs` set at h1 size, then `tracks.title` + the two tracks as a `dl` |
| 2 | Boundary | light (seam) | `boundary.title`, Is / Is not / Never `dl`, `boundary.line` |
| 3 | First build | light | `scope.title`, `scope.intro`, `scope.in` / `scope.out` hairline lists |
| 4 | Seats | light | `seats.title`, `seats.intro`, `SHADES.join.mentor`, shared `<Seats>` rows (seat glyph, Discord link per role) |
| 5 | Roadmap | light | `roadmap.title`, `roadmap.intro`, 7 numbered hairline rows, `roadmap.note` |
| 6 | Join + footer | light | shared `JoinChapter` (pill "Come to build night", secondary "Ask on Discord", backers), `WorldFooter` |

Layout: every notice row is a 4fr / 8fr grid (heading left, matter right) under one hairline, on the 1024px measure
the LocalNav and footer use, so all left edges line up. One column at ≤ 1068px. Geist 600 headings, Atkinson
Hyperlegible Next for every sentence. One dark-to-light seam (`DESIGN.md` §9).

## Decisions

1. **No CTA above the description.** LocalNav has `cta={null}`; the page's one filled CTA is the JoinChapter pill
   (allowed by JoinChapter's own rule: pill only on a page without a LocalNav CTA).
2. **Seat rows use solid hairlines** on this page (the shared component's dashed "open seat" rows clashed with every
   other list). Override is local (`.seats a`); `_shades/` is untouched.
3. **No SeatRing.** It reads as a diagram; the brief bans diagrams.
4. **No red on the page.** No fixation dot in the lens; the JoinChapter seat orb is off (`visual={null}`).
5. **`tether`**: not yet in `Glasses.tsx` at hand-off (0 matches; geometry.ts was mid-edit). Built with it off. When
   it lands, add `tether` to the one `<Glasses>` in `page.tsx`; check the 380px width still reads at 390.

## Verification (Playwright, headless shell 1246)

| Viewport | Status | Console errors | H-overflow | `<main>` / `h1` | Heading under bar | Tap < 44px | Dashed in hero |
|---|---|---|---|---|---|---|---|
| 1600×790 | 200 | 0 | none | 1 / 1 | 0 | 0 | 0 |
| 1280×720 | 200 | 0 | none | 1 / 1 | 0 | 0 | 0 |
| 768×1024 | 200 | 0 | none | 1 / 1 | 0 | 0 | 0 |
| 390×844 | 200 | 0 | none | 1 / 1 | 0 | 0 | 0 |
| 1600×790 reduced motion | 200 | 0 | none | 1 / 1 | 0 | 0 | 0 |
| 390×844 no JS | 200 | 0 | none | 1 / 1 | 0 | 0 | 0 |

`npx tsc --noEmit`: clean. `npx next lint`: clean. Dashed check ignores the exploded-mode parts that `Glasses`
keeps in the DOM at opacity 0 in solid mode.

Screenshots in this folder: `{1600,390}-viewport.png`, `-full.png`, `-s0…s6.png` (s0 hero, s1 what it is + tracks,
s2 boundary, s3 scope, s4 seats, s5 roadmap, s6 join).

## Critique loops

1. Stage line wrapped mid-phrase → one sentence per line. Statement hairline stopped at 22ch → moved to the wrapper.
   Dashed seat rows → solid. Smooth-scroll made the heading check unreliable → instant scroll; h1/h2 scroll margins.
2. Content measure (1080) did not line up with the nav (1024) → matched. Matter column too narrow, scope items
   wrapped → 4fr / 8fr. Mobile glasses too large for "small" → 66vw.

## Missing strings

- None needed for the build. If the tether lands and needs a caption for the cable or the controller box, that
  string does not exist yet (`shades.ts` scope.in has "An external controller for compute and power" only).
