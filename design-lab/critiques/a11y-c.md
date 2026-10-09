# A11Y — Concept C (Creative Technology) `/design-lab/c`

Verdict: **cleanest axe result in the set (0 / 0).** The WebGL hero degrades correctly: still SVG poster under reduced motion, and the build picker works without JS. Costs: 36px controls, 11px mono type, and a chatty layer readout.

Evidence: `design-lab/renders/a11y/c/` (`results.json`, `axe-*.json`, `keyboard.json`, `focus-1440.png`, `kbd-formation.png`, `kbd-layer.png`, `targets-{390,834}.png`, `reduced-1440.png`, `nojs-1440.png`).
Lab limitation (not counted): the concept header/footer sit inside the production `<main>`.

## Results

| Check | 390 | 834 | 1440 |
|---|---|---|---|
| axe critical / serious | 0 / 0 | 0 / 0 | 0 / 0 |
| axe incomplete color-contrast → probe est. fails | 3 → 0 | 3 → 0 | 3 → 0 |
| Horizontal overflow | none | none | none |
| Targets < 44×44 (non-inline / all) | 7 / 7 | 8 / 8 | n/a |
| h1 / skipped levels | 1 / 0 | 1 / 0 | 1 / 0 |
| img alt / role=img names | ok | ok | ok |
| Min font / elements < 12px | 11.5px / 87 | 11px / 95 | 11px / 95 |
| Max / median chars per line | 47 / 36 | 58 / 49 | 58 / 49 |
| Focus ring visible (25 stops) | — | — | 24 / 24 measurable. Stop 7 is the visually hidden radio; its ring is drawn on the label (`c.module.css:379`), confirmed in `kbd-formation.png` |
| Reduced motion | — | — | 0 running animations; Live render disabled; static dot poster shown (`reduced-1440.png`) |
| No-JS | — | — | 96% of JS text; picker swaps caption + poster via CSS `:has()` (verified by clicking DG-002 with JS off) |
| Console errors | 0 | 0 | 0 |

## Keyboard walk — "Pick a build" hero + subsystem layers + Render toggle

| Step | Result |
|---|---|
| Tab ×7 to formation radio | native radio group, legend "Pick a build" |
| ArrowDown / ArrowUp | `data-formation` switches reading ↔ phone; radio name carries ID + title + line |
| Tab ×2 to layer "01 Systems Architecture" | **announces on focus** "Systems Architecture: Clear boundaries…" |
| Tab + Enter on layer 02 | `aria-pressed=true`; announces 2 messages (reset text + layer 02 text) |
| Render "Still" + Enter | `aria-pressed` flips. "Live" stays operable when WebGL is available and is `disabled` under reduced motion |

Operable: **yes**. Announced: **yes, but too often** (every focus move through the 7 layers speaks).

## Issues

| # | Severity | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | moderate | Layer readout `aria-live` fires on focus and hover as well as on pin, so tabbing through 7 layers queues 7+ announcements | `HeroFormation.tsx:325-337` (`onFocus → setHighlight`, `aria-live="polite"` readout); `keyboard.json` steps 4-5 | Feed the live region only from `pinned` (the click); keep hover/focus highlight visual only |
| 2 | moderate | Render toggle buttons are 64×36; footer contact/legal links are 35px tall; nav CTA 40px at 834+ | `c.module.css:751-753` (`min-height: 36px`); `targets-390.png` | `min-height: 44px` on `.segmented button`, footer links and `.navCta` |
| 3 | moderate | Mono metadata (eyebrow, pick IDs, meta line, legend) at 11–11.5px across 87–95 elements | `c.module.css:99, 223, 875, 1011`; `results.json` fonts | 12px floor for mono; keep 11px only for decorative stage tags that are `aria-hidden` |
| 4 | minor | Changing formation doesn't announce the swapped caption fields (ID/status/method) | `HeroFormation.tsx:198-215` | Optional: `aria-describedby` from each radio to its caption panel's `<dl>` |
| 5 | minor | 4 ThinkingOrb canvases stay mounted under reduced motion (paused, no running animations measured) | `reduced-1440.png`; `BuildStages.tsx:49-57` | Fine as is; consider a static SVG under reduced motion to skip the canvas cost (§43) |

## Top 3 fix-now

1. `HeroFormation.tsx:325-337`: announce only on pin, not on focus or hover.
2. `c.module.css:751`: raise segmented and footer targets to 44px.
3. `c.module.css:99/223/875/1011`: move the mono floor to 12px.
