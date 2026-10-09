# A11Y — Concept B (Engineering / System) `/design-lab/b`

Verdict: **solid structure, 2 serious axe rules at 390, plus a verbose live region.** Keyboard and focus pass; the main costs are the dense small-mono type and 32px row targets.

Evidence: `design-lab/renders/a11y/b/` (`results.json`, `axe-*.json`, `keyboard.json`, `focus-1440.png`, `targets-{390,834}.png`, `kbd-buildrun.png`, `reduced-1440.png`, `nojs-1440.png`).
Lab limitation (not counted): the concept `<header>`/`<footer>` sit inside the production `<main>` and lose landmark roles. The production skip link is tab stop 1.

## Results

| Check | 390 | 834 | 1440 |
|---|---|---|---|
| axe critical / serious (rules, nodes) | 0 / 2 (3) | 0 / 1 (2) | 0 / 1 (2) |
| axe incomplete color-contrast → pixel-probe est. fails | 84 → 2 | 83 → 2 | 78 → 0 |
| Horizontal overflow | none | none | none |
| Targets < 44×44 (non-inline / all) | 6 / 13 | 6 / 13 | n/a |
| h1 count / skipped levels | 1 / 0 | 1 / 0 | 1 / 0 |
| img alt / role=img names | ok | ok | ok |
| Min font / elements < 12px | 9.5px / 92 | 9.5px / 98 | 9.5px / 104 |
| Max / median chars per line | 39 / 34 | 58 / 46 | 58 / 48 |
| Focus ring visible (25 stops) | — | — | 25 / 25 |
| Reduced motion: infinite anims / hidden text | — | — | 0 / 0 |
| No-JS text vs JS / hidden blocks | — | — | 100% / 0 |
| Console errors | 0 | 0 | 0 |

## Keyboard walk — "How a build runs" subsystem selector + project filter

| Step | Result |
|---|---|
| Tab ×29 to "S2 Hardware / PCB" | reached (group has `aria-label`) |
| Enter | `aria-pressed=true`; live region reads the **whole run body** (about 400 chars run together: "OwnerS2 Hardware / PCB · ______ [open]one owner per subsystem01plan02prototype…") |
| ArrowRight | no change (plain toggle buttons; Tab moves between them, which is acceptable) |
| Filter "Open" + Enter | `aria-pressed=true`, announces "1 of 4 rows shown" (good) |

Operable: **yes**. Announced: **too much** on the build-run selector; filter is correct.

## Issues

| # | Severity | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | serious | Horizontally scrolling RSVP timing plot can't be reached by keyboard at 390 | axe `scrollable-region-focusable` `.b_plotScroll`; `RsvpTiming.tsx:77`, `b.module.css:309` | `tabIndex={0} role="region" aria-label="RSVP timing plot, scrolls sideways"` on the wrapper, or let the plot fit 390 with no scroll |
| 2 | serious | `aria-label` on plain `<span class="gate">` is prohibited, so the gate rules ("before merge: one test gate…") are lost to AT | axe `aria-prohibited-attr` 2 nodes; `BuildRun.tsx:97`, `:104` | Render the label text in an sr-only span inside `.gate`, or give it `role="img"` if the gate is a glyph |
| 3 | moderate | `aria-live="polite"` wraps the entire run body, so every subsystem switch reads about 400 chars of unpunctuated text | `BuildRun.tsx:71`; `keyboard.json` step 2 | Remove `aria-live` from `.runBody`; add a short sr-only status: "S2 Hardware / PCB selected. Owner open. 2 handoffs." |
| 4 | moderate | Touch targets under 44px: project index row links 32px tall; Join contact/Discord links 24px tall at 390; S1–S7 subsystem links 27–33px tall | `targets-390.png`; `results.json` 390 targets.list | `min-height: 44px` (padding) on `.rowLink`, contact links and the subsystem list links |
| 5 | moderate | Over 90 text elements below 12px; mono labels at 10–11px; SignalChain detail text at 10px estimated 3.7–4.3:1 | `b.module.css:191,377,463,528 (10px),545,567`; probe `.b_chainDetail` "any page" 3.82:1 at 390 | Mono floor 12px; chain detail text to `--b-ink-2` at ≥12px |

Later (minor): no roving tabindex in the S1–S7 group (fine, but 7 Tab stops); production + concept skip links both exist only because of the lab limitation.

## Top 3 fix-now

1. `RsvpTiming.tsx:77`: make `.plotScroll` focusable with a named region, or remove the scroll.
2. `BuildRun.tsx:97,104`: move the gate `aria-label` text into sr-only spans.
3. `BuildRun.tsx:71`: replace the body-wide `aria-live` with a one-line status.
