# Concept B — Engineering / System

Route: `/design-lab/b` · DA-B · 2026-10-02 · renders `design-lab/renders/b/v1/` · interaction checks `design-lab/scripts/da-b-states.mjs`

## Thesis

**The homepage is the build's documentation set: every drawing on it is computed from the club's own project records.**

DIGITAL has no photos, no metrics and no named builders yet, but it does have structured engineering data: 7 subsystems, the parts each one touches, 4 workflow stages, 4 ownership rules, an RSVP pipeline and a demo word stream. Concept B turns that data into figures, registers and a title block, the artifacts an engineering team actually produces. Proof is the mechanism, drawn honestly: the hero is a subsystem → part interface map generated from `phoneV2.ts`, status is a ledger column, unknowns are `[confirm]`, and empty owner cells are `______`. Red has one meaning on the page: **this is where the build needs a person** (handoffs that need a reviewer, open slots, unsigned seats, the CTA).

## §31 Design system

### Typography (IBM Plex superfamily, `next/font/google`, scoped to the route, `preload: false`)

| Role | Family | Size (390 → 1440) | Weight | Line height | Tracking | Case |
|---|---|---|---|---|---|---|
| Display (h1, ≤3 lines) | IBM Plex Sans Condensed | `clamp(44px, 4.1vw, 68px)`; 600–1023px: `clamp(56px, 8.4vw, 80px)` | 600 | 0.94 | 0 | UPPER |
| Section heading (h2) | Plex Sans Condensed | `clamp(30px, 3.4vw, 48px)` | 600 | 1.0 | 0 | UPPER |
| Record heading | Plex Sans Condensed | `clamp(26px, 2.6vw, 36px)` | 600 | 1.02 | 0 | UPPER |
| H3 / row title | IBM Plex Sans | 19px (rows 18px) | 600 | 1.3 | 0 | Sentence |
| Body | Plex Sans | 16px → 17px (≥1024) | 400 | 1.55 | 0 | max 62ch, `text-wrap: pretty` |
| Small / captions | Plex Sans | 14px / 13px | 400 | 1.45 | 0 | |
| Mono labels (dt, eyebrows, fig heads) | IBM Plex Mono | 11–12px | 500 | 1.4 | 0.04–0.06em | UPPER |
| Mono values (tables, meta) | Plex Mono | 13–14px | 400–500 | 1.4 | 0 | lower / as data |
| SVG labels | Plex Mono | 10–11.5px in viewBox units (rendered ≈ 10–12px) | 500 | — | 0.02em | UPPER |

Rules: one display voice (Condensed caps only); mono is metadata and data only, never body; no 10px caps body text.

### Color (one chromatic accent; AA checked against `--b-bg`)

| Token | Value | Use |
|---|---|---|
| `--b-bg` | `#f2f2ee` | page (drawing sheet) |
| `--b-surface` | `#fafaf7` | elevated sheets: figures, seat register, pressed filters |
| `--b-recess` | `#e7e7e1` | parts in schematics, plate hatching |
| `--b-ink` (fg) | `#15171a` | text, linework, primary button, record strips (≈16:1) |
| `--b-ink-2` (muted fg) | `#50555b` | labels, captions, unknown values (≈6.7:1) |
| `--b-line` / `--b-line-soft` | `#c6c8c2` / `#dcddd7` | hairlines, dot grid / off cells |
| Primary | `--b-ink` | CTA fill, active status, selected tabs |
| Secondary | `--b-surface` + 1px ink | outline buttons, figures |
| Accent | `#d8412f` (non-text marks: rules, glyphs, CTA edge) · `#b23422` (text ≈5.5:1; white-on-fill tags/gates ≈6.2:1) | handoff tags H1–H4, gates G1/G2, open status, CTA left rule + hover, section codes |
| Dark band | `#15171a` / fg `#ecece6` / muted `#a6aaae` / line `#3a3d42` | footer title block, RSVP readout |
| States | hover: ink fill or underline; pressed: `aria-pressed` = ink fill (tabs) or surface + 2px ink underline (filters); focus: 2px ink outline, 2px offset (paper on dark); disabled: n/a |

Why keep production's `#d8412f`: in drawings, red is redline: the reviewer's mark. Here it marks review points and open seats, so it carries meaning instead of decoration.

### Geometry

| Item | Value |
|---|---|
| Base unit | 4px; scale 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 |
| Page margins | 16px (<600) · 32px (600–1023) · 48px (≥1024) |
| Max width | 1440px |
| Grid | 12 columns ≥1024 (gap 24), single column + internal 2-col blocks below; hero 5 / 7, records 5 / 3 / 4 |
| Section rhythm | 64 / 80 / 96px |
| Radii | **0 everywhere** (identity decision) |
| Borders | 1px hairline (`--b-line`), 1px ink (frames), 2px ink (section rules, rail), 3px ink (owner bar base), dashed red = open/unsigned |
| Shadows | none; elevation = surface step + ink frame. Only inset rules (CTA red edge, pressed filter underline) |
| Texture | one: 16px dot grid inside figures only |

### Motion

| Item | Value |
|---|---|
| Durations | 120ms (hover/state) · 200ms (base) · 700ms (wire draw) |
| Easing | `cubic-bezier(0.2, 0, 0, 1)` (Carbon "productive"); no springs, no bounce |
| Entrance | Fig. 1 wires draw in once after hydration, staggered 45ms per wire, then the animation is removed (server HTML shows the finished drawing). Nothing else enters; no scroll reveals, so first paint is complete |
| Hover / focus | subsystem block inverts, its wires go 2.5px, other wires drop to 20% opacity, its parts get a 2px frame; buttons invert; links thicken underline to red |
| Data motion | RSVP readout steps at the real slot time (60 000 / 450 = 133.3ms), `steps`, no easing; auto-plays only when visible and motion is allowed; Pause/Play button (WCAG 2.2.2) |
| Page transitions | none: documentation should feel instant; anchors jump |
| Reduced motion | no draw-in, RSVP does not auto-play (static plot + first word), global CSS kills transitions |

### Iconography

Tabler outline, `stroke={1.5}`, 16px inline / 20px in buttons, ink only, ≤1 icon per control. Used: `IconArrowRight` (primary actions), `IconArrowUpRight` (leave page), `IconArrowDown` (in-page record), `IconBrandDiscord`, `IconPlayerPlay/Pause`. Status uses drawn square glyphs (filled = active, half = program, dashed red = open), not icons. No icon-in-chip feature rows.

## Layout, navigation, sections

| Part | Spec |
|---|---|
| **Nav** | Sticky 56px bar, 1px ink rule. Wordmark (ink square with red offset = "signed" block) · numbered anchors `01 Work · 02 How a build runs · 03 Join` · CTA "Take a subsystem". <900px: a `<details>` "Index" disclosure (works without JS), 44px targets. Global site Navbar/Footer hidden on this route only via scoped `body:has(#lab-b)` CSS |
| **Hero** | Left: eyebrow, thesis in 3 caps lines, positioning (canonical) + mechanism line, CTA + "See the builds", 2×2 mono meta table (build night, room, on the bench, experience). Right: **Fig. 1** interface map, header counts computed (7 subsystems · 10 parts · 4 handoffs), caption + source note. Same generator renders a compact layout (scrubber labels) <700px |
| **01 Work (projects)** | Status-driven ledger: ID · Build · Problem · Needs · Cycle · Status, rows ordered active → program → open, filter buttons with live counts. ≥1024 each row carries a computed signature glyph (DG-001 7×10 incidence matrix with handoffs in red; DG-002 11-pulse gate train; DG-003 empty dashed block). Below, full **Build records**: dark strip (ID, title, status) → problem / object / link · fields (status, disciplines, workflow, duration, outcome, built by, partner, repo, mentor, cost) · `[ PROJECT PHOTO … ] [placeholder]` plate · DG-001 subsystem register table (scope / risk / owner `______`) · DG-002 Fig. 2 signal chain + Fig. 3 RSVP timing. Venture Studies as a program card; DG-003 as an unsigned dashed record with "Pitch the next build" |
| **02 How a build runs (secondary)** | Subsystem selector (7 toggle buttons) drives an owner bar, the plan → prototype → test → integrate → release rail with gates G1 (test gate before merge) and G2 (repair plan before release), the subsystem's real risk under TEST, and its **real handoffs** (computed from Fig. 1 shared parts) under INTEGRATE; side panel = description, bullets, scope/risk/mode |
| **03 Join** | 3 numbered steps (build night with day/time/room, watch the Discord, pick a boundary), primary CTA + Discord, "Free to join". Seat register table: all 7 leadership seats from `team.ts`, each `OPEN` in red |
| **Footer** | Drawing title block on the dark band: vision line (verbatim), cells ORG · SHEET · DRAWN BY `______` · REV `[placeholder]` · BUILD NIGHT · CONTACT · DISCORD, legal links |

## Responsive behavior

- **1440:** hero 5/7 split, map ≈1:1; ledger as a real table; records 3-col; Fig. 2 vertical (4fr) beside Fig. 3 (8fr).
- **834:** single-column hero, wide map still fits; ledger becomes stacked rows (code + status on one line, then title, problem, needs, cycle); record fields and plate side by side; Fig. 2 horizontal chain.
- **390:** display 44px, 3 lines; compact map (short labels from `scrubberLabel`, 1:1 scale); vertical signal chain; RSVP plot scrolls horizontally inside its figure; the subsystem register reflows into stacked cards (<700px); rail turns vertical with gates on the line. Checked: 0px horizontal overflow at 390 and 834; no target under 24px, primary targets 44px.

## Interaction language

Inspect, don't animate. Every interaction answers "which part, whose, what state": hover/focus traces a subsystem's wires; filters narrow by status; the selector traces one subsystem through the gates; the RSVP figure plays the real timing. Every state change is a toggle with `aria-pressed`, plus a polite live region for filter counts. Subsystem blocks in Fig. 1 are real links to their register rows (`:target` highlights the row with a red edge).

## Copy (exploratory; production still goes brand-voice-strategist → brand-guardian)

Voice: spec-sheet declaratives, mechanism over adjectives, honest status. Thesis and positioning verbatim from `homeLanding.ts`. New lines: "Two builds are on the bench. The phone splits into seven subsystems. Each one gets one owner and one test gate before merge." · "On the bench" · "Status is what's true today, not what's planned." · "Seven subsystems. One phone." · "One owner. One review per handoff. One test gate." · "This row is unsigned." · "Take a subsystem." · CTA "Take a subsystem" / "See the builds" / "Pitch the next build". All facts trace to `lib/data`; unknowns are `[confirm]` (phase, duration, VS needs, part names) or `[placeholder]` (photos, rev, builders).

## Required experiment: outcome

| Experiment | Result |
|---|---|
| Procedural SVG schematics from real data | **Done, 3 figures + 3 glyphs, all generated in `app/design-lab/b/schematic.ts`.** Fig. 1 routes 7 subsystems to the 10 parts in their `activePartIds` with orthogonal lanes and finds the 4 shared parts (midframe S1↔S6, flex cables S2↔S3, screen UI and front glass S4↔S5) and labels them handoffs H1–H4. Fig. 2 builds the DG-002 chain from `GLASSES_CONTENT.info` specs + `techStack` with the reader → RSVP pace feedback. Fig. 3 computes slot time from `hud.wpm` and `pov.words`. Same generator = wide + compact layouts. Section 02 reuses the computed handoffs, so the secondary section is driven by the same data |
| Status-driven project index | Done: status column + ordering + filters + glyph per status; dark/dashed record strips follow status |
| Recharts on real data | **Not used, on purpose.** There is no real quantitative series: member counts conflict, dates are missing, `explode` values are animation parameters, and the only numbers (7, 10, 4, 450 wpm, 8 months) are counts or one setting. A chart would be a vanity dashboard (§39). Hand SVG (Fig. 3 timing plot, incidence-matrix glyph) shows the real numbers at 0 KB. Revisit when the club logs dated REV entries or test results |

## Libraries

| Library | Used | Why |
|---|---|---|
| `next/font/google` (IBM Plex Sans Condensed / Sans / Mono) | yes | OFL, self-hosted by next/font, static-export safe; continuous family from display to data |
| `@tabler/icons-react` 3.48 | yes (6 icons) | most technical installed set; 1.5 stroke matches the 1–1.25px linework |
| React state + CSS Modules | yes | all interaction is small; no motion lib needed |
| `motion`, GSAP, Lenis, R3F | no | no scroll storytelling or 3D in this direction; avoiding them keeps the page instant and fully readable without JS |
| Recharts | no | see experiment |
| fancycomponents Scramble Hover | no | reads as "hacker terminal" cliché, which this direction must avoid |

## Risks

1. **Part names are the build page's illustration model**, not a confirmed BOM. Fig. 1 must be confirmed by the phone leads before production (noted on the figure).
2. **Density.** Tables and mono labels can feel like a docs portal; mitigated by caps display, one red, and generous section rhythm, but a non-engineer may bounce. Venture Studies gets the least visual weight.
3. **Small SVG text** in the 1440 map (≈11–12px rendered) is at the floor. Text in SVG scales with the column.
4. **Empty-state honesty** (`______`, `[confirm]`) is the point, but six of them in one record can read as unfinished; production needs the club to fill phase, duration, owners.
5. Global chrome is hidden with a scoped `:has()` rule because `lib/immersiveRoutes.ts` is production-owned; production would add the route to the immersive list instead.

## Render loop log (§33)

| Loop | Found | Fixed |
|---|---|---|
| 1 | Hydration error from inline `<style>` children; caps thesis wrapped to 4 lines; Fig. 2 text ≈7px at 1440; "handoff" partner in §02 was the *next* subsystem (invented) | `dangerouslySetInnerHTML`; hero 5/7 + `clamp(44px, 4.1vw, 68px)`; Fig. 2 switches to the vertical layout beside Fig. 3; §02 now lists the real shared parts from Fig. 1 |
| 2 | Fig. 1 wires missing in full-page captures (CSS draw-in held at its start frame) | Draw-in armed by JS after hydration and removed after 1.6s; `pathLength=1` dashes |
| 3 | White on `#d8412f` tags = 4.45:1; seat terms and footer links wrapping at 390; mobile register squeezed | Tags/gates on `#b23422` (≈6.2:1); nowrap terms, full-width link cells; register → cards <700px; Gemini critique (`critiques/b-v1-gemini.md`) → fewer field borders |

Checks (`node design-lab/scripts/da-b-states.mjs`): 16/16 pass: hover trace, keyboard nav, filters, S4/S7 handoff notes, RSVP play/pause, reduced motion (no autoplay, no draw), no-JS content + 89 SVG paths, 0px overflow and no target <24px at 390/834, 0 console errors.
Note: `shoot.mjs` mobile (DPR 2) exceeds Chromium's 16 384px capture limit on this ~11 000px page and tiles; use `b-mobile-dpr1.png` (`design-lab/scripts/da-b-mobile.mjs`) as the true mobile full page.

## v2 changes (Wave 4 refinement, §36)

Inputs: `critiques/b-by-a.md`, `b-by-a-motion-gemini.md`, `micro-b.md`, `a11y-b.md`, orchestrator must-fix list. Thesis unchanged. Renders: `renders/b/v2/` (`b-{desktop,tablet,mobile}.png`, `states/`). Checks: `da-b-states.mjs` 21/21 pass (adds anchor-jump, single-shot RSVP, 44px Fig. 1 hit areas, rendered-text ≥12px at 390/834). 0 console errors, `tsc` clean for `app/design-lab/b/`. **These values replace the v1 spec where they differ.**

### Applied: fix now (8)

| # | Fix | Source | Where |
|---|---|---|---|
| 1 | Index jumps land below the nav: `.record { scroll-margin-top: 72px }`, sections 56px; `html:has(#lab-b){scroll-behavior:auto}` so anchors jump instantly, as the spec promised | orch 1, U1, micro 17 | `b.module.css`, `layout.tsx` |
| 2 | RSVP is single-shot: one 1.47s pass when ≥50% visible, holds on "look." with passed slots marked, plain **Run again** button (no toggle, no aria-pressed). Reduced motion: no automatic pass | orch 2, M1, Gemini motion, micro 21 | `RsvpTiming.tsx` |
| 3 | A11y: plot scroller is a focusable named region; gate G1/G2 text is sr-only content, not `aria-label` on a span; live region now one line ("S4 Operating System selected. Owner unassigned. 2 handoffs.") | orch 3–4, a11y 1–3 | `RsvpTiming.tsx`, `BuildRun.tsx` |
| 4 | Targets: Fig. 1 subsystem links get a 48px invisible hit rect (≥44 rendered at 390/834); ledger links and footer links 44px; compact map viewBox fitted to the 390 column so it renders ≥1:1 | orch 5, micro 15, U4 | `InterfaceMap.tsx`, `schematic.ts` |
| 5 | **Ownership inside the drawing** (replaces every `______`): unowned subsystem blocks are dashed red; Fig. 1 header computes `0 of 7 owned`; register Owner column and §02 owner bar say `UNASSIGNED` in red mono; DG-003 is "Open slot"; "Built by" became Owners/Credits facts; DRAWN BY / REV cells and the "Signed" column dropped. Source: `subsystemOwners` (all null, `team.ts` leads TBA) | lab-wide distinctiveness, D2, B3 | `copy.ts`, `InterfaceMap.tsx`, `page.tsx` |
| 6 | **Fig. 4 build × discipline matrix** in §03 Join: S1–S7 + DG-002 + VS × the 8 DESIGN.md §9.3 codes, solid = stated in the record (DG-002), hatched = inferred from scope text [confirm], computed column totals ("every column has a build that needs it"). Ledger "Needs" now lists codes for every row. Photo plates removed; "Photo log · 0 entries [placeholder]" field instead | B1, S2 | `DisciplineMatrix.tsx`, `copy.ts` |
| 7 | One title scale: thesis spans 12 columns, `clamp(44px, 6.6vw, 104px)` (monotonic: 44 / 55 / 95px at 390 / 834 / 1440; 2 lines ≥600, 3 below); h2 `clamp(28px, 2.8vw, 40px)`; rail names and chain labels moved to Plex Sans 600 so only titles use Condensed caps; hero 4/8 split; v1 dead space under the hero removed | H1, T1, H4 | `b.module.css`, `page.tsx` |
| 8 | 12px floor: all CSS 11px → 12px; SVG text 12px (map, tags, notes, chain, ticks, slots); Fig. 2 uses the vertical layout at every width (the horizontal one couldn't hold 12px labels) | lab-wide, a11y 5, T2 | all SVG components |

### Applied: trivial / lab-wide (not counted)

Production cursor hidden + `cursor:auto` (scoped `:has(#lab-b)`); `:active` pressed states (1px drop + ink inversion, 0ms); red AA (tags/gates already `#b23422` ≈6.2:1 under white, text `#b23422` ≈5.5:1; `#d8412f` only for strokes, rules, glyphs); reduced-motion block kills transitions too; footer legal hover underline; `::selection` ink; `theme-color` `#f2f2ee`; signature glyphs shown at all widths; Fig. 1 draw-in armed on visibility (≥40%), 500ms + 30ms stagger (Gemini: v1 was sluggish); mobile `<details>` menu closes on Escape and on link choice; heading semantics: record display line is the `h3` (with sr-only build name), strip title is a `p`; Fig. 1 caption defines "subsystem" for non-engineers.

### Rejected (with reason)

| Item | Reason |
|---|---|
| Port CSS Module to Tailwind (F2) | Lab prototype; CSS Modules aren't CSS-in-JS. Port belongs to production implementation with Head Designer sign-off |
| Gemini: default RSVP to paused | Single-shot pass + hold resolves the strobe while still showing the real timing once; reduced motion already gets no pass |
| Mobile bar CTA beside INDEX (U3) | Wordmark + INDEX + "Take a subsystem" don't fit 360px at 44px targets; CTA stays first in the menu and in the hero |
| Landmark fixes for header/footer inside production `<main>` | Lab limitation (production `app/layout.tsx`); fixed by adding the route to `immersiveRoutes` in production |
| Label swap on mobile menu summary | `<details>` already exposes expanded state; changing the label as well double-signals (lab rule) |

### Deferred

1. Per-subsystem CTA (`/contact?type=project-team&subsystem=…`) and selector ↔ URL hash sync (U2): production form doesn't read the param [confirm].
2. Ledger de-duplication + register inside `<details>` on mobile (H3); mobile page is still ≈11 700px.
3. REQ-1 requirement row per record (S1): needs copy pass through brand-voice-strategist.
4. Draw the §02 rail with Fig. 1 wire grammar (D1) and 4+3 S1–S7 grid selector on mobile (U5).
5. Matrix cells for S1–S7 and VS are inferred: phone leads and VS lead must confirm before production.
