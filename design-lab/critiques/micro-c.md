# MICRO — Concept C "Formation": micro-interaction audit (§15, §9)

Verdict: **richest interaction set, well-guarded; 3 gaps.** A disabled control with no reason, an undersized segmented toggle with no hover, and two cursors on a pointer-probe hero. Judged against C's language: "every interaction reveals real structure; no idle animation".

Method: Playwright at 1440 / 390 / reduced motion / JS off; WebGL via SwiftShader. Hover and focus are pixel diffs with the production cursor overlay hidden. Raw data: `design-lab/renders/micro/c/audit.json`, `scenarios.json`.

| # | Item (§15 / §9) | Status | Evidence | Fix in C's own style |
|---|---|---|---|---|
| 1 | Text wrapping | pass | JS off: 0 hidden text, poster SVG renders (`nojs-hero.png`) | — |
| 2 | Balanced headings | pass | h1 + all h2 `balance` | — |
| 3 | Line length | pass | Long paragraph 71 cpl, `pretty` | — |
| 4 | Optical alignment | pass | `sc-hero-signed.png` / `peek-signed-settled.png`: name sits on the "BUILT BY" rule; the descender crosses the line by design | — |
| 5 | Focus states | pass | 40/40 Tab stops ringed (2px `rgb(255,90,54)` offset 3px), 0 obscured. The radio row draws the ring via `:has(input:focus-visible)` (`c.module.css:379`) | — |
| 6 | Hover feedback | partial | 35/38 change. Gaps: wordmark, and **Live/Still** segmented buttons (`c.module.css:751-769` has no `:hover`, no transition; `hover-035-NONE.png` = "Still") | `.segmented button:not([aria-pressed=true]):hover{color:var(--fg);background:var(--line-2)}` at `--d-fast` |
| 7 | Pressed / active | fail | No `:active` rule in `c.module.css`. Press diff 0 on subsystem 01, Live, Play (`audit.json active`) | `:active{background:var(--line-2)}` on `.btnGhost`, `.segmented button`, legend buttons; 0ms |
| 8 | Cursor affordances | partial | `pointer` / `not-allowed` correct. But the **production crosshair cursor** is visible over the particle field (`globalCursor.visible 2`, `html{cursor:none}`), so the hero runs two pointer effects at once: particle probe and trailing ring. That breaks "one focal motion" | Hide the global cursor in C's layout (D's rule); the probe *is* C's cursor |
| 9 | Input states | pass | Sign input: accent 2px focus ring overriding `@tailwindcss/forms` (`c.module.css:1494`), themed caret, `maxLength 22` enforced (`sign.max len 22`). The name forms in particles in ~1.3s (`peek-signed-settled.png`) | Optional: show "22/22" in mono when full so truncation isn't silent |
| 10 | Disabled states | fail | Under reduced motion "Live" is `disabled` with `cursor:not-allowed` and **no reason**: no `title`, no `aria-describedby` (`HeroFormation.tsx:397`; `sc-rm-render-toggle.png`) | Mono note under the toggle: "Live is off: your system asks for reduced motion." Link it with `aria-describedby` |
| 11 | Hover intent | pass | Probe is mouse/pen only, never touch (doc §9), so scroll stays free | — |
| 12 | Card expansion | n.a. | Formation swap replaces expansion; poster swaps via CSS `:has()` without JS | — |
| 13 | Overflow | pass | 390px `scrollWidth 390`. Off-canvas nodes are inside the closed `<details>` menu (false positive) | — |
| 14 | Whitespace | pass | Unaffected by state | — |
| 15 | Breakpoint behavior / touch | partial | 7 targets under 44px at 390px: **Live/Still 64×36**, footer contact/Discord/legal links **35px** tall | `.segmented button{min-height:44px}`; footer links `padding-block:4px` |
| 16 | Scroll behavior | pass | `#process` anchor smooth-scrolls 1.19s only under `no-preference` (doc). The next Tab lands inside the target | — |
| 17 | Loading states | pass | WebGL is lazy: the SVG poster shows until `canvasReady` (`HeroFormation.tsx:239`), and switching Live → poster stays until the first frame | — |
| 18 | Empty states | pass | DG-003 "Unsigned": blank line + sign field is the designed empty state | — |
| 19 | Feedback after action | partial | Legend pin: polite readout "Firmware / Embedded: Each board…" (`sc-legend-pinned.png`, pass). RSVP Play/Pause swaps the label **and** `aria-pressed` (`RsvpReader.tsx:76`) | Keep the label swap and drop `aria-pressed` |
| 20 | Transitions vs spec (§9) | pass | 120ms / 240ms `cubic-bezier(0.2,0.7,0.1,1)`, as spec'd; one extra 300ms node | — |
| 21 | Reduced motion | pass | Under reduce: 0 rAF/s, 0 running animations, 0 transitions; WebGL off, poster shown | Add the disabled reason (item 10) |
| 22 | Idle motion | partial | C's field idles at **0 rAF/s** at rest (pass). The production cursor adds 57 rAF/s | Item 8 |
| 23 | Link vs button | pass | Radios for formation, buttons for state, links for routes | — |
| 24 | Browser surfaces | pass | Only concept that themes `::selection` (`c.module.css:52`) | — |

## Top 3 fix-now

1. **Explain the disabled "Live" button** under reduced motion (item 10). An unexplained `not-allowed` reads as broken.
2. **Live/Still segmented control**: 44px height, hover, pressed state (items 6, 7, 15). It is the one control that changes the hero's medium.
3. **Remove the production crosshair over the particle probe** (item 8): two pointer effects on one focal object.
