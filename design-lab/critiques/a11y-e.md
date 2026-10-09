# A11Y — Concept E (Startup / Product Studio) `/design-lab/e`

Verdict: **best dialog in the set, but the most contrast failures.** 0 critical. Serious color-contrast: 2 nodes at 390/834 and 29 nodes at 1440, from the accent button plus the scroll-dimmed phone sequence. Ledger brief dialog: focus moves in, is trapped, closes on Esc and returns to the trigger.

Evidence: `design-lab/renders/a11y/e/` (`results.json`, `axe-*.json`, `keyboard.json`, `focus-1440.png`, `kbd-dialog.png`, `targets-{390,834}.png`, `reduced-1440.png`, `nojs-1440.png`).
Lab limitation (not counted): the concept header/footer sit inside the production `<main>`, and the production skip link sits next to E's own skip link.

## Results

| Check | 390 | 834 | 1440 |
|---|---|---|---|
| axe critical / serious (rules, nodes) | 0 / 1 (2) | 0 / 1 (2) | 0 / 1 (29) |
| axe incomplete color-contrast → probe est. fails | 14 → 0 | 22 → 8 | 20 → 2 |
| Horizontal overflow | none | none | none |
| Targets < 44×44 (non-inline / all) | 3 / 3 | 3 / 3 | n/a |
| h1 / skipped levels | 1 / 0 (29 headings) | 1 / 0 | 1 / 0 |
| `<main>` landmarks | 2 | 2 | 2 |
| Min font / elements < 12px | 11px / 93 | 11px / 94 | 11px / 94 |
| Max / median chars per line | 48 / 36 | **87** / 69 (3 paras > 80) | **87** / 50 (3 > 80) |
| Focus ring visible (25 stops) | — | — | 25 / 25 |
| Reduced motion | — | — | 0 running animations, 0 hidden text (Lenis + GSAP gated) |
| No-JS | — | — | 100% text; ledger rows fall back to `<a href>` (`Ledger.tsx:141`) |
| Console errors | 0 | 0 | 0 |

## Keyboard walk — ledger → brief dialog

| Step | Result |
|---|---|
| Tab ×11 to DG-001 row | `<button aria-haspopup="dialog" aria-expanded=false>` |
| Enter | `role="dialog" aria-modal` opens; focus on "Close brief"; title via `aria-labelledby` (`kbd-dialog.png`) |
| Tab ×6 | all 6 stay inside (trap works); Shift+Tab wraps to "Current project page" |
| Escape | dialog closes; focus returns to the DG-001 row |

Operable: **yes**. Announced: **yes** (dialog role + name on focus). Reference-quality: reuse this pattern.

## Issues

| # | Severity | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | serious | Inactive phone-sequence steps and layers are dimmed to `opacity: .38` / `.32`, which puts real text at 2.1–2.7:1 on `#111311` (desktop, scroll-driven) | axe 1440: `.e_stepNum` 2.1:1, `.e_layerNum`/`.e_layerName` 2.68:1; `e.module.css:461`, `:482` | Dim the markers/strokes only; keep step text ≥4.5:1 (e.g. inactive text `color: var(--dark-muted)` #a3a69c = 7.55:1 on #111311, with no opacity) |
| 2 | serious | Primary button: white on `#d8412f` = 4.45:1 at 15px (fails 4.5 by 0.05) | axe all viewports `.e_btnPrimary`; `e.module.css:149`, token `:13` | Fill with `--accent-press` #b8341f (5.92:1 with white) or a #c63a28 base (5.20:1); keep #d8412f for non-text marks |
| 3 | moderate | Body paragraphs run 85–87 chars/line at 834 and 1440, because `max-width: 62ch` measures wide in Satoshi | `e.module.css:132` `.body`; `results.json` lineLength.worst | `max-width: 52ch` (≈ 66–70 chars) or `36rem` |
| 4 | moderate | Second `<main id="e-main">` nested in the production `<main>`: 2 main landmarks | `page.tsx:82` | In the lab use `<div id="e-main" tabIndex={-1}>`; restore `<main>` only once E owns the layout |
| 5 | moderate | Targets under 44px: "Current project page" links 25px tall (inline `minHeight: 0` overrides the button floor); "Take a subsystem" 40px | `CaseStudy.tsx:52`; `.btnPrimary`; `targets-390.png` | Drop `minHeight: 0`; `min-height: 44px` on `.btn` |

Later (minor): 93 mono labels at 11px (`e.module.css:174-567`, 12px floor recommended); RSVP HUD "450 wpm" white-on-image estimated at 2.3:1 (`e.module.css:504`, probe estimate: add a solid backing plate).

## Top 3 fix-now

1. `e.module.css:461,482`: stop dimming text by opacity; dim only the graphics.
2. `e.module.css:149`: move the button fill to #b8341f (5.92:1).
3. `e.module.css:132`: cap `.body` at 52ch.
