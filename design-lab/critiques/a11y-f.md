# A11Y — Concept F (Radical Experiment) `/design-lab/f`

Verdict: **0 critical / 0 serious, and the most ambitious interaction is fully keyboard- and screen-reader-operable.** dnd-kit KeyboardSensor, custom instructions, spoken drag events and a button per seat. Main cost: drops announce 3 messages at once, and 15 `aria-label`s sit on plain spans.

Evidence: `design-lab/renders/a11y/f/` (`results.json`, `axe-*.json`, `keyboard.json`, `focus-1440.png`, `kbd-dropped.png`, `targets-{390,834}.png`, `reduced-1440.png`, `nojs-1440.png`).
Lab limitation (not counted): the concept header/footer sit inside the production `<main>`.

## Results

| Check | 390 | 834 | 1440 |
|---|---|---|---|
| axe critical / serious | 0 / 0 | 0 / 0 | 0 / 0 |
| axe incomplete | aria-prohibited-attr 1, color-contrast 25 | 15, 29 | 15, 34 |
| Pixel-probe est. contrast fails | 4 (ruler, `aria-hidden`, decorative) | 7 (ruler) | 12 (11 ruler + DG-003 "Empty" 3.67:1) |
| Horizontal overflow | none | none | none |
| Targets < 44×44 (non-inline / all) | 2 / 3 | 1 / 2 | n/a |
| h1 / skipped levels | 1 / 0 | 1 / 0 | 1 / 0 |
| Min font / elements < 12px | 11px / 62 | 11px / 76 | 11px / 77 |
| Max / median chars per line | 74 / 30 | **93** / 21 | **93** / 21 |
| Focus ring visible (25 stops) | — | — | 25 / 25 |
| Reduced motion | — | — | 0 running animations, 0 hidden text |
| No-JS | — | — | 100% text; sign field disabled with note "Signing needs JavaScript…" (`Sections.tsx:53-55`); seat buttons fall back to "Ask about this seat" links |
| Console errors | 0 | 0 | 0 |

## Keyboard walk — sign → drag name tag → seat buttons

| Step | Result / announced |
|---|---|
| Tab ×11 to `#f-sign`, type "Ada" | labelled field, `aria-describedby` note |
| Tab ×2 to tag (`role=button`) | name "Your name tag: Ada. Draggable."; dnd-kit instructions attached |
| Space | "Over Systems Architecture, DG-001 The Modular Smartphone." |
| ArrowRight ×2 | "Over Hardware / PCB…", "Over Firmware / Embedded…" (seat-to-seat, not 25px nudges) |
| Space | **3 announcements at once**: own status line, dnd-kit "Name tag placed on…", and the full `.seatDetail` panel text |
| "Put Ada here" button + Enter | works without drag; announces status + full panel; focus lands on "Take it back from Operating System…" |

Operable: **yes** (drag and button paths). Announced: **yes, too verbose on drop**.

## Issues

| # | Severity | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | moderate | Drop/seat change speaks 3 live regions back-to-back; the `.seatDetail` region reads the whole sheet | `Sections.tsx:104` (`aria-live="polite"` on seatDetail); `keyboard.json` "Space (drop)" | Remove `aria-live` from `.seatDetail`; let the dnd-kit announcement + one status line carry it |
| 2 | moderate | `aria-label="unsigned"` on plain spans (15 nodes) is unreliably exposed; SR may read "______" instead | axe incomplete `aria-prohibited-attr` `.f_blank`; `Bench.tsx:132` | `<span aria-hidden="true">______</span><span className={styles.srOnly}>unsigned</span>` |
| 3 | moderate | Footnote runs 93 chars/line at 834/1440 (no max-width) | `f.module.css:1210` `.footnote` | `max-width: 68ch` |
| 4 | minor | DG-003 "Empty" field estimated at 3.67:1 (pixel probe) | `results.json` 1440 contrastProbe `article[data-record="dg-003"] dd` | Verify, then darken the muted token to ≥4.5:1 |
| 5 | minor | Small targets: inline "Put your tag on a seat" 21px tall (inline exception applies); nav "Join" 41×44 at 390; "Terms" 40×44 | `Sections.tsx:126`; `targets-390.png` | Pad short nav/footer links to 44px wide |

Later (minor): 62–77 mono labels at 11px (`f.module.css:80,92,134,172,250,336,372,390,627,1121`); the ruler numbers (1.5:1) are `aria-hidden` decoration (`page.tsx:65`), so they're not a failure.

## Top 3 fix-now

1. `Sections.tsx:104`: drop `aria-live` from `.seatDetail`.
2. `Bench.tsx:132`: replace the span `aria-label` with sr-only text.
3. `f.module.css:1210`: cap `.footnote` at 68ch.
