# SIDEKICK Page — Style Reference

> A phone, part by part. One black surface, one real board, nine played poses.

**Status: LOCKED — approved by the Head Designer on 2026-10-07.** The page is approved as built. No
adjustments are to be made to it. Any change to the files listed under [Locked files](#9-locked-files),
or any shared change that alters how this page renders, needs explicit Head Designer sign-off first.
This document is extracted as-implemented from the component source.

**Route:** `/projects/sidekick/` (promoted from the design lab `/design-lab/r2/apple/sidekick/` on 2026-10-07; the old URL is a redirect stub).
**Theme:** dark story (`#000`) from the board pin to the end of the facts strip, then a light catalogue.
**System:** root `DESIGN.md` (tokens, chrome, the pinned played stage). This file records what is specific to SIDEKICK.

---

## 1. Concept

SIDEKICK (formerly the Modular Smartphone) is presented through one object: its FPGA main board, drawn
from the KiCad file in the project repository. The page does not show a phone render. It takes the real
board apart in order:

whole board → copper stack → processing → memory → power → USB → RF → board I/O → whole board again.

One pinned section carries all nine stages as poses of the same artwork. The stack separates, then each
part group in turn lifts off its side of the board in its own colour while everything else dims, then
the board closes with every group still tinted, as a legend. Nothing is swapped between stages.

Under the pin, a black facts strip closes the story with six numbers. The light catalogue follows:
the repository's ten subsystems, the archive status, the ownership rules and the join.

## 2. Copy (verbatim — source: `boardStages` in `app/(apple)/_content/sidekick.ts`)

| # | Tracker label | Heading | Line |
|---|---|---|---|
| 1 | Board | A phone, part by part. | This is the main board of SIDEKICK, a student-designed modular smartphone built around an FPGA. |
| 2 | Layers | Six copper layers. | Four layers carry most of the routing. In1 is a ground plane. In3 holds the power planes. |
| 3 | Processing | The Zynq sits in the middle. | One XC7Z020 holds both the processing system and the programmable logic. |
| 4 | Memory | DDR3 beside it. | One 96-ball DDR3 device gives the processing system its memory. |
| 5 | Power | Six regulators on the back. | Bringing up the eight power rails is the first step of the planned boot flow. |
| 6 | USB | USB-C on the short edge. | A USB-C receptacle and a Micro-B receptacle share one end of the board. |
| 7 | RF transceiver | An AD9361 at the far end. | One AD9361, four baluns and six U.FL coaxial connectors make up the transceiver section. |
| 8 | Board I/O | Where the next board connects. | A 2 × 40 board-to-board connector and two header rows lead off this board. |
| 9 | Whole board | One board again. | Every part above is in the archived KiCad file. |

Stage 1 is the page `h1`; stages 2–9 are `h2`. Each caption also carries a Geist Mono label line above
the heading (stage 1: "SIDEKICK · FPGA main board"; other stages: the tracker label, with the group
swatch on group stages) and a parts table of reference designator · value · package, read from
`rows` in the same export. Stage 9 adds the link "View the design files on GitHub" → `LINKS.github`.

**Facts strip** (`boardFacts`): "The board, in numbers." — Outline, Copper, Footprints, Vias, Smallest
track, Panel.
**Catalogue:** "Ten subsystems, one repository." (`subsystems`) · "An archive, not a finished phone."
(`archive`: planned data path, design targets) · "One of each, per part." (`rulesHeadline`,
`ruleSentences`).
**Ending** (`join` + `MEETINGS.subteam`): "Take a subsystem." · "Pick a board. Its files are in the
repository." · "Subteam meetings depend on the team." · "Join the Discord to connect with the leads." ·
chevron link "Take a subsystem on Discord" → `CLUB.discord` (`https://discord.gg/U77P2U2D84`, new tab,
`rel="noopener noreferrer"`).
**Nav:** one sticky bar. Wordmark `DIGITAL` → `/`; links SIDEKICK (current), SHADES, BRAIN; CTA pill
"Take a subsystem" → `#join`.

Copy rules that produced this: the heading states the thing; one sentence per stage; part values are
printed exactly as the schematic symbol spells them; no `[confirm]` tags, no hype adjectives, no
personal names, no claim that the board was fabricated, tested or shipped.

## 3. Board facts and their source

Every number on the page is read from the project repository
(`https://github.com/DIGITALatCalPolyPomonaCPP/SIDEKICK-Prev.-TheSmartphoneProject-`): the board file
`zynq_sdr_dongle.kicad_pcb` (edge, stackup, footprints, nets), the schematic sheets (sheet names,
symbol values), `gerber/Manufacture Requirements.docx` (panel) and `README.md` (subsystem table, status,
planned architecture). Geometry and counts are produced by `design-lab/scripts/sidekick-mainboard.mjs`
and stored in `app/(apple)/_sidekick/mainboard-manifest.json`.

| Fact | Value | Where it is printed |
|---|---|---|
| Outline | 61.3 × 22.8 mm (Edge.Cuts, one board) | Stage 1 row, facts strip |
| Mounting holes | Four, 2.0 mm | Stage 1 row |
| Copper | 6 layers: F.Cu, In1 to In4, B.Cu; FR-4 | Stage 1 and 2, facts strip |
| Footprints | 277, both sides | Facts strip |
| Vias | 924 (0.4 mm pad, 0.2 mm drill) | Facts strip |
| Smallest track | 0.1 mm | Facts strip |
| Panel | 4 boards, 75.3 × 94.2 mm (manufacturing notes) | Facts strip |

| Group (palette key) | Label | Footprints | Schematic sheets |
|---|---|---|---|
| `compute` | Processing | 67 | PS and PL sheets |
| `memory` | Memory | 37 | PS DDR sheet |
| `power` | Power | 89 | Power sheets |
| `usb` | USB | 30 | USB Connector sheet |
| `rf` | RF transceiver | 42 | Transceiver RF sheet |
| `io` | Board I/O | 12 | BTB Connector and root sheets |
| | **Total** | **277** | |

A footprint's group is the schematic sheet it sits on (`GROUP_OF` in the script). Drawn body heights
are artwork only and are never printed as a specification.

## 4. Layout

**Board story** (`app/(apple)/_sidekick/mainboard.module.css`)

| Property | Value |
|---|---|
| Pin height | `calc(100svh + 8 * 50svh)` — nine stages, half a viewport of scroll between them |
| Sticky box | `top: var(--r2-sticky-top)`; `height: calc(100svh - var(--r2-nav-h))`; `overflow: hidden`; `max-width: 1360px`; gutter padding |
| Grid | columns `minmax(0, 1.3fr) minmax(0, 1fr)` (figure · captions), rows `minmax(0, 1fr) 52px` (stage · tracker), `column-gap: var(--r2-space-7)` |
| Figure height | `--art-h: calc(100svh - var(--r2-nav-h) - 52px)`; rig width `min(100%, calc(var(--art-h) * var(--mb-ratio)))` |
| Artwork box | viewBox `-1.2 -6.32 75.23 51.97` (board millimetres, isometric); `--mb-ratio` = 75.23 / 51.97 |
| Captions | all in one grid cell, `align-self: start`, `padding-top: clamp(64px, 16svh, 150px)` so every heading starts on the same line |
| Camera fit | the rig scales to `min(1, room the pose needs vertically, width left after 96px of layer tags)`, so no pose leaves the stage |
| ≤ 899px | one column; rows `40svh` (figure) · `minmax(0, 1fr)` (caption) · `48px` (tracker) |
| Stills (no pin) | one column, `max-width: 720px`, `gap: var(--r2-space-9)`; each still reserves the room its pose needs |

**Catalogue** (`app/(apple)/projects/sidekick/sidekick.module.css`)

| Section | Value |
|---|---|
| Column | `--wrap: 980px`, centred |
| Facts strip | `#000`; padding `--r2-space-8` top, `--r2-space-9` bottom; 3 columns (2 at ≤ 734px); each cell has a 1px `--r2-hairline-strong` top rule |
| Subsystems | hairline list; row grid `minmax(0, 1.1fr) 9em minmax(0, 1.6fr)` (name · part · line); 14px row padding; one column at ≤ 734px |
| Status | two columns, `gap: var(--r2-space-7)`: a numbered data path and a targets list, hairline rows; one column at ≤ 734px |
| Rules | `--r2-ground-raised` band, centred, list `max-width: 40rem` |
| Section padding | `--r2-space-9` top; `--r2-space-8` or `--r2-space-9` bottom |

## 5. Type

| Role | Size | Notes |
|---|---|---|
| Stage heading (`h1`, stage 1) | 56 / 60 | `--r2-fs-h1`; tracking `max(var(--r2-ls-h1), -0.03em)` |
| Stage heading (`h2`) | 48 / 52 | `--r2-fs-h2`; same tracking rule |
| Stage headings, ≤ 1200px (pinned) | 36 / 40 | both levels |
| Stage headings, ≤ 899px (pinned) | 28 / 32 | both levels |
| Stage line | 17 / 25 (15 / 21 at ≤ 899px) | `--r2-ink-2`, max 34rem |
| Label line | 12 / 16, Geist Mono, uppercase, `0.04em` | `--r2-ink-2` |
| Parts table | 13 / 18 (12 / 16 at ≤ 899px) | reference and value in Geist Mono; reference column 7.5em (5.5em) |
| Layer tags | 11 / 12, Geist Mono, `0.04em` | copper; the core tag "FR-4" in `--sk-fr4` |
| Tracker | 12 / 16 | `--r2-ink-2`; current and hover `--r2-ink` |
| Section headings (catalogue) | `--r2-fs-h1` step | centred, balanced |
| Section lead | `--r2-fs-lead`, weight 600 | `--r2-ink-2`, max 34rem |
| Fact value | `--r2-fs-h3` step, weight 600 | term and note at 12 / 16 in `--r2-ink-2` |

## 6. Colour

The board is copper line art on black. The six part groups use the SIDEKICK functional palette, the
one sanctioned multi-colour exception in the system (root `DESIGN.md` §12). Variables are set on the
page wrapper in `sidekick.module.css`; the hex is the sRGB fallback of the `oklch` value.

| Variable | Use | sRGB | `oklch` |
|---|---|---|---|
| `--board-copper` | Copper layers, parts at rest, layer tags | `#c9965f` | — |
| `--sk-fr4` | FR-4 core outline and its tag | `#efe6d2` | — |
| `--sk-g-compute` | Processing | `#60c2ff` | `oklch(0.78 0.13 240)` |
| `--sk-g-memory` | Memory | `#b28fef` | `oklch(0.72 0.14 300)` |
| `--sk-g-power` | Power | `#68d7a1` | `oklch(0.8 0.13 160)` |
| `--sk-g-usb` | USB | `#5ce9f0` | `oklch(0.86 0.12 200)` |
| `--sk-g-rf` | RF transceiver | `#ef8bc5` | `oklch(0.76 0.14 345)` |
| `--sk-g-io` | Board I/O | `#cce576` | `oklch(0.88 0.14 120)` |

Rules: the hues alternate in lightness so neighbours separate without hue; they stay clear of copper
and of the red trigger; a group colour never appears without its text label (caption label line, legend
rows on stage 9, tracker label). The board story uses no red; red appears on this page only where the
shared chrome puts it (the nav pill hover and the anchor dot of the join seat). No gradients, glow or
cards.

## 7. Motion

| Behaviour | Implementation |
|---|---|
| Stage pick | `useScrollSteps` over 9 stages (`lead` 0, `playShare: 0.72`). Native scroll, no wheel capture. |
| Transition | `useStagePlayback` (`app/(apple)/projects/_hero/useStagePlayback.ts`) tweens a playhead to the target stage at **1100 ms** per stage (capped at 1.5 stages), cubic in-out, interruptible and reversible. Never scrubbed. |
| Paint | `applyPose` in `BoardStory.tsx` lerps the two neighbouring poses and writes `transform` and `opacity` on whole boxes (one per copper layer, the core, and each part group per side), plus the rig scale and the layer-tag positions. No path is rewritten. |
| Group colour | Each part box holds two copies of the same SVG: copper below, the group colour above, cross-faded by opacity. |
| Caption swap | Out-then-in: outgoing 160 ms, incoming 240 ms after a 160 ms delay, opacity + 12px y. Never two at once. |
| At rest | 0 rAF. A `ResizeObserver` refits the camera on resize. |

Poses (`app/(apple)/_sidekick/mainboardPoses.ts`):

| Stage | `spread` | `focus` | `legend` | Layer tags |
|---|---|---|---|---|
| board | 0 | — | 0 | off |
| layers | 1 | — | 0 | on |
| compute, memory, power, usb, rf, io | 0.15 | that group | 0 | off |
| whole | 0 | — | 0.75 | off |

Constants: 7 mm between neighbouring tiers at full spread; the group in focus travels 12 mm off its
side of the board; other parts dim to 0.16 opacity and copper to 0.22. Inner copper and back-side parts
are hidden while the board is assembled.

## 8. Controls, accessibility and fallbacks

- Tracker: nine real `<button>`s in a `<nav aria-label="Board steps">`, `aria-current="step"`, 44px
  tall, each with an `aria-label`. The marker is an 8px square (2px radius) in the group colour on
  group stages. Only the current step shows its name; the others name themselves on hover and keyboard
  focus.
- The artwork is `aria-hidden`. Each stage's heading, line and parts table are its text alternative.
- Inactive captions are `aria-hidden`.
- Reduced motion / no JS: the pin does not exist. Nine stills stack in normal flow
  (`<ol aria-label="The main board in nine steps">`), each a server-rendered `Mainboard` in that stage's
  pose with the same copy and parts table. Full content parity. The pin switches on only under
  `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`.
- A "Skip to content" link is the first focusable element and targets `#r2-main`.

## 9. Locked files

Do not edit without Head Designer sign-off:

- `app/(apple)/projects/sidekick/page.tsx`
- `app/(apple)/projects/sidekick/BoardStory.tsx`
- `app/(apple)/projects/sidekick/sidekick.module.css`
- `app/(apple)/_sidekick/Mainboard.tsx`
- `app/(apple)/_sidekick/mainboardPoses.ts`
- `app/(apple)/_sidekick/mainboard.module.css`
- `app/(apple)/_sidekick/mainboard-manifest.json`
- In `app/(apple)/_content/sidekick.ts`: `mainboard`, `boardStages`, `boardFacts`, `subsystems`,
  `archive` and their types (`PartGroupId`, `BoardStageId`, `PartRow`, `BoardStage`); also the values
  the page reads from the older part of the file (`sidekick.name`, `sidekick.joinLink`, `join`,
  `rulesHeadline`, `ruleSentences`)
- `public/boards/sidekick-mainboard/*` (19 SVG files: six copper layers, `core.svg`, twelve
  `parts-<group>-<f|b>.svg`)
- `design-lab/scripts/sidekick-mainboard.mjs`

### Shared code this page depends on

A change to any of these can alter the locked page. Check SIDEKICK at 1600×790 and 390×844 after
touching them, and keep its rendering identical:

| Dependency | Used for |
|---|---|
| `app/(apple)/projects/_hero/useStagePlayback.ts` | The stage playhead tween |
| `app/(apple)/_system` (`useScrollSteps`, tokens in `tokens/worlds.css`, fonts) | Stage pick, type and colour tokens |
| `app/(apple)/_chrome` (`LocalNav`, `JoinChapter`, `WorldFooter`, `PAGES`, `href`, `CLUB`, `LINKS.github`, `MEETINGS.subteam`, `chrome.module.css`) | The nav, the ending, the footer, the links |
| `app/(apple)/_content/home.ts` (`localTitle`) | The nav wordmark |
| `design-lab/scripts/kicad-sexpr.mjs`, `kicad-geom.mjs` | Imported by the extraction script |

The sticky-box height assumes one 52px sticky bar.

## 10. Open item — which board is drawn

The photograph in the project repository's README shows a different board from the one drawn here: an
XC7Z020 in the CLG484 package, with an RTL8211F and eight mounting holes. The design file for that board
is not in the repository. The board on this page is the one whose file is there,
`zynq_sdr_dongle.kicad_pcb` (XC7Z020 CLG400, four mounting holes).

Decision (Head Designer, 2026-10-07): keep the repository board for now.

Swapping later is a rerun of the extraction, not a redesign:

1. `node design-lab/scripts/sidekick-mainboard.mjs <path/to/new.kicad_pcb>` rewrites the SVG files and
   the manifest. The script asserts six copper layers, four mounting holes and a 250 KB SVG budget, and
   maps footprints to groups by schematic sheet name, so a different board needs those checks and the
   `GROUP_OF` table reviewed.
2. Update the copy and counts in `boardStages` and `boardFacts` from the new file.
3. Both steps touch locked files and need sign-off.

The script also writes `public/boards/sidekick-mainboard/components.json`. No page reads it; the copy
from the first run is in `archive/public/design-lab/r2/boards/sidekick-mainboard/`.

## 11. Out of scope for the lock

- The earlier module-stack content below the `LEGACY` line in `_content/sidekick.ts` and the unused
  components in `app/(apple)/_sidekick/` (`Stack.tsx`, `IsoModules.tsx`, `geometry.ts`, `lineForm.ts`,
  `stackFrame.ts`, `stack.module.css`). No live route renders them.
- The Signal-world SIDEKICK page (archived: `archive/app/design-lab/r2/signal/sidekick/`).
