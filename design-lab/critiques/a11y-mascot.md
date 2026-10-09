# A11Y — MASCOT lab `/design-lab/mascot`

Verdict: **the mascot itself is accessible decoration.** It is `aria-hidden` with 0 focusables, reacts to keyboard focus as well as pointer, stays off on touch, and goes still under reduced motion. The toggles are operable and announced. 1 serious axe rule (accent text contrast, 3 nodes). Most small-target and tiny-font counts here come from the **production** nav/footer, which this route does not hide.

Evidence: `design-lab/renders/a11y/mascot/` (`results.json`, `axe-*.json`, `keyboard.json`, `focus-1440.png`, `kbd-mascot-on.png` (captured after Enter, i.e. the OFF state), `kbd-mascot-focus-cta.png`, `targets-{390,834}.png`, `reduced-1440.png`, `nojs-1440.png`).
Lab limitation (not counted): the route renders inside the production `<main>` with production Navbar/Footer visible. Their 13–22px link targets and 9.5–10.5px type (18 of the 20 small targets at 390; the other 2 are mascot-owned) are production issues, not mascot issues.

## Results

| Check | 390 | 834 | 1440 |
|---|---|---|---|
| axe critical / serious (rules, nodes) | 0 / 1 (3) | 0 / 1 (3) | 0 / 1 (3) |
| Horizontal overflow | none | none | none |
| Targets < 44×44 (all / mascot-owned) | 20 / 2 (build title links 26px tall) | 26 / 2 | n/a |
| h1 / skipped levels | 1 / 0 | 1 / 0 | 1 / 0 |
| Min font / elements < 12px | 9.5px / 22 (production chrome) | 9.5px / 29 | 9.5px / 29 |
| Max / median chars per line | 39 / 33 | 44 / 39 | 67 / 58 |
| Focus ring visible (25 stops) | — | — | 25 / 25 |
| Reduced motion | — | — | 0 running animations; status text explains the still mode |
| No-JS | — | — | 97% text; mascot absent (client-only `dynamic`, `ssr:false`), page complete |
| Console errors | 0 | 0 | 0 |

## Keyboard walk — Mascot toggle + Pause motion

| Step | Result / announced |
|---|---|
| Tab ×10 to "Mascot" (desktop, on by default) | `aria-pressed=true`, `aria-describedby` → status |
| Enter | `aria-pressed=false`; role=status says "Off. This is the page without a mascot." |
| (fresh load) "Pause motion" + Enter | `aria-pressed=true`; status says "Paused. The mascot is frozen and ignores the page." |
| Pause while mascot off | `aria-disabled=true`, still focusable (correct pattern) |
| Focus "Take a subsystem" (`data-mascot="join"`) | mascot reacts to `focusin` (`ModuleMascot.tsx:191, 261`), same as hover (`kbd-mascot-focus-cta.png`) |
| Touch / < 768px | toggle `aria-disabled` with status "Off on touch screens and narrow windows…" (`MascotDemo.tsx:17, 33`) |

Operable: **yes**. Announced: **yes**.

## Issues

| # | Severity | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | serious | Accent text `#d8412f` on `#f7f6f2` = 4.11:1 at 12px (eyebrow + DG codes) | axe `color-contrast` `.mascot_eyebrow`, `.mascot_code` ×2; `mascot.module.css:101-107` | Use an accent-ink token for text: #b8341f = 5.47:1, #c03a28 = 5.01:1 |
| 2 | moderate | Build title links are 26px tall at 390/834 (34px at 1440) | `.buildTitle a` `mascot.module.css:217`; `MascotDemo.tsx:133`; `targets-390.png` | `display: inline-block; padding-block: 9px` or stretch the link over the article |
| 3 | minor | Mascot is on by default for fine-pointer desktop users; motion starts without opt-in (reduced-motion users get the still version) | `statusText` `MascotDemo.tsx:31-38` | Acceptable for a comparison lab; for production, default off or honor a stored choice |
| 4 | minor | Mascot silk text "DIGITAL" is 6px at 3.4:1 | probe `.mascot_silk` | Decorative and inside `aria-hidden`, so it's not a failure; leave as is |
| 5 | minor (production, out of scope) | Production footer links are 13px tall at 390; production nav links 22px tall | `results.json` 390 targets.list `a.transition-colors` | Log against production `components/` (not this lab) |

## Top 3 fix-now

1. `mascot.module.css:101-107`: switch accent text to #b8341f.
2. `mascot.module.css:217`: pad build title links to 44px.
3. Keep the mascot pattern (`aria-hidden`, focus parity, touch/reduced-motion off) as the reference for any concept that adopts it.
