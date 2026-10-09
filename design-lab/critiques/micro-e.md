# MICRO — Concept E "The Ledger": micro-interaction audit (§15, §9)

Verdict: **the row → brief dialog is the best-engineered interaction in the lab; the rest has 3 real gaps.** Idle rAF loops even under reduced motion, a pressed state identical to hover, and a long measure. Judged against E's language: "state changes are the only things that move".

Method: Playwright at 1440 / 390 / reduced motion / JS off; hover and focus are pixel diffs (production cursor hidden while measuring). Raw data: `design-lab/renders/micro/e/audit.json`, `scenarios.json`.

| # | Item (§15 / §9) | Status | Evidence | Fix in E's own style |
|---|---|---|---|---|
| 1 | Text wrapping | pass | JS off: 0 hidden text; rows render as links | — |
| 2 | Balanced headings | partial | h1/h2 `balance`, but h2 "Build ledger" and the 3 join h3s are `auto`; h1 breaks to **5 lines** at 1440 | `.root :is(h2,h3){text-wrap:balance}` |
| 3 | Line length | fail | `.body{max-width:62ch}` (`e.module.css:132`) resolves to 744px at 17px Satoshi = **94–100 characters per line** (7 of 8 long paragraphs; `audit.json inventory.measures`). `ch` is the width of "0", not an average glyph | `max-width: 38rem` (~70 cpl at 17px) |
| 4 | Optical alignment | pass | `sc-dialog-open.png`: ID, title and status chip land on the row's grid after the morph | — |
| 5 | Focus states | pass | 35/35 stops ringed (2px ink; inset −3px on rows), 0 obscured | — |
| 6 | Hover feedback | pass | 30/33 change; misses: wordmark, pressed "450" (expected), and partner rows "Recruit Talent"/"Become a Sponsor" at **0.2% pixel change** (barely visible, `hover-035-NONE.png`) | Partner rows: the same 2px ink left rule + surface step as ledger rows |
| 7 | Pressed / active | fail | No `:active` rule in `e.module.css`. RSVP pace "pressed" = ink border (`RsvpDemo.tsx:96` inline style), which is **identical to `.ctrl:hover`** (`e.module.css:512`): measured `450 border rgb(18,20,17)` vs hover border `var(--fg)` (`peek-rsvp-ctrls.png`, `sc-rsvp-pace.png`). Unhovered "Next word" (`#dcdbd3` border) looks disabled next to it | Pressed = ink fill + surface text (status-chip language); `:active{background:var(--surface-2)}` at `--dur-1` |
| 8 | Cursor affordances | partial | `pointer` correct. Production crosshair visible (`globalCursor.visible 2`, `html{cursor:none}`) | Hide in E's layout (D's rule) |
| 9 | Input states | n.a. | No text inputs | — |
| 10 | Disabled states | n.a. | None | — |
| 11 | Hover intent | pass | Nothing opens on hover; the dialog opens on click/Enter only | — |
| 12 | Card expansion (row → brief) | pass | Enter opens the dialog in 23ms; focus goes to "Close brief"; Tab cycles 3 controls; Escape closes; focus returns to the row (`aria-expanded` false); page scroll locked (`scrolledBy 0`, `html overflow hidden`). Evidence `sc-dialog-open.png`, `sc-dialog-viewport.png`, `Ledger.tsx:191-207` | Optional: `inert` on `<main>` while open; `aria-modal` alone relies on screen-reader support |
| 13 | Overflow | pass | 390px `scrollWidth 390` | — |
| 14 | Whitespace | pass | Unaffected by state | — |
| 15 | Breakpoint behavior / touch | partial | 3 targets under 44px at 390px: "Current project page" ×2 at **25px** tall, nav CTA "Take a subsystem" at **40px** | `.btnGhost` / text links `min-height:44px; display:inline-flex; align-items:center` |
| 16 | Scroll behavior | pass | Lenis smooth wheel (spec); `#roles` anchor settles 1.4s with `scroll-margin-top:72px`; next Tab lands inside the target. Lenis off under reduced motion / coarse pointer (`SmoothScroll.tsx:22-24`) | — |
| 17 | Loading states | n.a. | Static content; schematic is server-rendered fully exploded without JS | — |
| 18 | Empty states | pass | DG-003 "Unassigned" row, "Seats open 7", outcome `[placeholder]` | — |
| 19 | Feedback after action | partial | Dialog: strong (item 12). RSVP Play swaps label text **and** sets `aria-pressed` (`RsvpDemo.tsx:74-80`), so it reads "Pause, toggle button, pressed" | Drop `aria-pressed` on the Play/Pause control; keep it on pace buttons |
| 20 | Transitions vs spec (§9) | partial | 120 / 240ms `cubic-bezier(0.2,0,0,1)` and `rise` 720ms, as spec'd. `.ctrl` (RSVP buttons) has **no transition** (`e.module.css:507-511`; `noTransition 18`) | `.ctrl{transition:border-color var(--dur-1) var(--ease-out), background-color var(--dur-1) var(--ease-out)}` |
| 21 | Reduced motion | partial | CSS correct (0 animations, 0 transitions, Lenis not created). But **64 rAF/s still run under reduce** (`audit.json reducedMotion.rafPerSec`): the GSAP ticker starts even though `gsap.matchMedia` builds no scrub | Don't register ScrollTrigger or import GSAP until `ENHANCED_QUERY` matches (`PhoneSequence.tsx:22`) |
| 22 | Idle motion | fail | At rest, top of page: **123 rAF/s** from E, i.e. about 2 loops: the GSAP ticker driving Lenis (`SmoothScroll.tsx:30-32`) is confirmed in code; the second source was not identified. Plus 60/s from the production cursor. That contradicts "state changes are the only things that move" and §43 "no idle GPU saturation" | Stop the ticker when Lenis is idle (`lenis.on('scroll')` → `gsap.ticker.wake`/`sleep`), or let Lenis use `autoRaf` only while the scrub section is in view |
| 23 | Link vs button | pass | Rows are `<button aria-haspopup="dialog">` with JS and `<a>` without JS (`Ledger.tsx:126-141`) | — |
| 24 | Skip links | partial | Two consecutive skip links (production + E's "Skip to content") | Hide the production one in E's layout |
| 25 | Browser surfaces | partial | `::selection` = production mustard | `.root ::selection{background:var(--fg);color:var(--bg)}` |

## Top 3 fix-now

1. **Kill the idle rAF loops** (items 21, 22): 123/s at rest, 64/s under reduced motion. That is the opposite of E's motion thesis.
2. **Give pressed toggles their own state** (item 7): ink fill, not the hover border.
3. **Fix the measure**: `62ch` → `38rem` (item 3), which pulls 7 paragraphs from ~95 to ~70 characters per line.
