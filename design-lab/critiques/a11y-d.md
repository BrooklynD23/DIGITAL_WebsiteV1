# A11Y — Concept D (Human / Community) `/design-lab/d`

Verdict: **0 critical / 0 serious, best type floor in the set (12px min, 0 elements under 12px).** The seat picker is a native radio group that works without JS. Its gap: the chosen seat's details aren't tied to the radio for screen readers.

Evidence: `design-lab/renders/a11y/d/` (`results.json`, `axe-*.json`, `keyboard.json`, `focus-1440.png`, `kbd-seat.png`, `targets-{390,834}.png`, `reduced-1440.png`, `nojs-1440.png`).
Lab limitation (not counted): the concept header/footer sit inside the production `<main>`, and the production skip link plus D's own "Skip to content" make 2 skip links (stops 1-2).

## Results

| Check | 390 | 834 | 1440 |
|---|---|---|---|
| axe critical / serious | 0 / 0 | 0 / 0 | 0 / 0 |
| axe incomplete | aria-prohibited-attr 1, color-contrast 3 → probe 0 | 1, 4 → 0 | 1, 13 → 0 |
| Horizontal overflow | none | none | none |
| Targets < 44×44 (non-inline / all) | 1 / 1 | 1 / 1 | n/a ("Seats" nav 39×44 at desktop) |
| h1 / skipped levels | 1 / 0 (27 headings) | 1 / 0 | 1 / 0 |
| img alt / role=img names | ok | ok | ok |
| Min font / elements < 12px | 12px / 0 | 12px / 0 | 12px / 0 |
| Max / median chars per line | 45 / 34 | 67 / 52 | 67 / 52 |
| Focus ring visible (25 stops) | — | — | 23 / 23 (stop 24 left the page, then wrapped) |
| Reduced motion | — | — | 0 running animations, 0 hidden text |
| No-JS | — | — | 100% text; 42 hidden blocks are the 6 unselected seat panels (CSS `:has()` picker still works) |
| Console errors | 0 | 0 | 0 |

## Keyboard walk — seat picker ("Pick the one you'd take")

| Step | Result |
|---|---|
| Tab ×13 to seat radio | fieldset + sr-only legend "Choose a subsystem seat"; ring on the chair (`d.module.css:917`, `kbd-seat.png`) |
| ArrowRight ×2 | checked → hardware-pcb → firmware-embedded; visible panel follows (`[data-seat]`) |
| Announced | radio name only ("Firmware / Embedded, radio, 3 of 7"). The panel text (description, bullets, "Seat 3 of 7", owner) is **not** announced or referenced |
| Tab | leaves the group to "Tell us you're coming" (panel has no focusables; correct) |

Operable: **yes**. Announced: **partially**.

## Issues

| # | Severity | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | moderate | Seat details panel is not linked to its radio; a screen-reader user picks a seat without hearing what it is | `page.tsx:532` (input), `:541` (panel `aria-labelledby` only); `keyboard.json` | `aria-describedby={\`seat-desc-${sub.id}\`}` on each `<input>`, with that id on the panel's `.recordObject` `<p>` (static, so it stays no-JS) |
| 2 | moderate | `aria-labelledby` on a plain `<div class="sheet">` is ignored (no role) | axe incomplete `aria-prohibited-attr` `.d_sheet`; `page.tsx:614` | Make it `<section aria-labelledby="d-sheet-h">` or add `role="region"` |
| 3 | minor | Below 960px the section nav (The work / How a build runs / Seats) is hidden with no menu; mobile has only wordmark + "Come build" | `d.module.css:1164-1165` `.navLinks`; landmarks at 390: `navs: []` | Add a `<details>` menu or a compact anchor row; single-page scroll works but has no wayfinding |
| 4 | minor | "Terms" 43×44 at 390/834; desktop nav "Seats" 39×44 | `targets-390.png` | `min-width: 44px` on short footer/nav links |
| 5 | minor | 2 skip links in a row (lab chrome + D) | `focus-1440.png` stops 1-2 | Keep D's link only once it moves to production |

## Top 3 fix-now

1. `page.tsx:532`: add `aria-describedby` from each seat radio to its panel description.
2. `page.tsx:614`: give `.sheet` a `<section>` element or a `region` role.
3. `d.module.css:1164`: provide mobile section navigation.
