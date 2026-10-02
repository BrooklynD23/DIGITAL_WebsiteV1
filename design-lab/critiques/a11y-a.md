# A11Y — Concept A (Editorial / Studio) `/design-lab/a`

Verdict: **near-clean.** 0 critical, 1 serious axe rule (1 node). Keyboard, focus, reduced motion and no-JS all pass.

Evidence: `design-lab/renders/a11y/a/` (`results.json`, `axe-{390,834,1440}.json`, `keyboard.json`, `focus-1440.png`, `targets-{390,834}.png`, `reduced-1440.png`, `nojs-1440.png`, `kbd-rsvp.png`).
Scripts: `design-lab/scripts/a11y-audit.mjs`, `a11y-keyboard.mjs`, `a11y-summary.mjs`.
Lab limitation (not counted): the root layout wraps the concept in production `<main>`, so the concept `<header>`/`<footer>` lose banner/contentinfo roles, and the production skip link is tab stop 1.

## Results

| Check | 390 | 834 | 1440 |
|---|---|---|---|
| axe critical / serious (rules, nodes) | 0 / 1 (1) | 0 / 1 (1) | 0 / 1 (1) |
| axe incomplete color-contrast (paper gradient) | 17 → pixel probe: 1 est. fail | 30 → 0 | 30 → 0 |
| Horizontal overflow | none | none | none |
| Targets < 44×44 (non-inline / all) | 1 / 1 | 1 / 1 | n/a (pointer) |
| Headings: h1 count / skipped levels | 1 / 0 | 1 / 0 | 1 / 0 |
| img without alt / unnamed role=img | 0 / 0 | 0 / 0 | 0 / 0 |
| Min font-size / elements < 12px | 9.5px / 7 | 9px / 21 | 9px / 21 |
| Max / median chars per line | 39 / 39 | 71 / 58 | 71 / 58 |
| Focus ring visible (25 Tab stops) | — | — | 25 / 25 |
| Reduced motion: infinite animations / hidden text | — | — | 0 / 0 |
| No-JS: text vs JS / hidden blocks | — | — | 100% / 0 |
| Console errors | 0 | 0 | 0 |

## Keyboard walk — RSVP plate (Fig. 3)

| Step | Result |
|---|---|
| Tab ×17 to "Read it" | reached, ring visible |
| Enter | plays; button becomes "Pause", `aria-pressed=true` |
| Enter again (within playback) | stops; "Read it", `aria-pressed=false` |
| Tab ×2 + Space on "300" | `aria-pressed` moves to 300 |
| Announced | nothing (word display is `aria-live="off"`; the full sentence is in the figcaption — correct choice) |

Operable: **yes**. Announced: state via `aria-pressed`, content via figcaption.

## Issues

| # | Severity | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | serious | `aria-label` on a plain `<p>` is prohibited; screen readers ignore it, so the "Workflow: plan, then prototype…" label never reaches AT | axe `aria-prohibited-attr` `.a_rail`; `app/design-lab/a/page.tsx:304` | Drop the `aria-label` and add the sentence as `<span className="sr-only">`, or make it `<ol aria-label="Workflow">` with one `<li>` per stage |
| 2 | moderate | Figure 1 SVG labels render at 9–10.5px (subsystem names, "owner ______", layer numbers) | `a.module.css:538` `.fig1Num` 9.5px, `:544` `.fig1Label` 10.5px, `:550` `.fig1Owner` 9px; `results.json` fonts.tinyList | Raise to ≥12px rendered; at 834+ the figure isn't scaled down, so set 12px in user units |
| 3 | minor | RSVP button changes its label ("Read it" → "Pause") **and** sets `aria-pressed`; AT hears "Pause, toggle button, pressed" | `RsvpPlate.tsx:85` | Pick one: a fixed label "Play reading demo" + `aria-pressed`, or a changing label with no `aria-pressed` |
| 4 | minor | Colophon "Terms" link is 41×44 (3px narrow) | `targets-390.png`; `content.ts:195` | `min-width: 44px` or padding on colophon links |
| 5 | minor | Sign mark "×" estimated at 3.84:1 at 11px (pixel probe, 390) | `results.json` 390 contrastProbe `.a_signX` | Use `--a-ink` for the mark, or mark it `aria-hidden` if decorative |

## Top 3 fix-now

1. `page.tsx:304`: replace the `<p aria-label>` workflow rail with sr-only text or an `<ol>`.
2. `a.module.css:538-550`: set Figure 1 SVG text to ≥12px.
3. `RsvpPlate.tsx:85`: choose either `aria-pressed` or a changing label, not both.
