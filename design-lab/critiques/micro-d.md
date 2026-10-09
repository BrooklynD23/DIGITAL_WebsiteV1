# MICRO — Concept D "Pull up a chair": micro-interaction audit (§15, §9)

Verdict: **best-finished micro layer of the six.** It is the only concept with a pressed state and the only one that hides the production cursor. The remaining gaps are small: seat-change feedback for screen readers, a duplicate skip link, and the cursor's still-running loop. Judged against D's language: "Pencil on paper: drawn, circled, underlined, signed; nothing glows, floats or slides".

Method: Playwright at 1440 / 390 / reduced motion / JS off; hover and focus are pixel diffs. Raw data: `design-lab/renders/micro/d/audit.json`, `scenarios.json`.

| # | Item (§15 / §9) | Status | Evidence | Fix in D's own style |
|---|---|---|---|---|
| 1 | Text wrapping | pass | JS off: 0 hidden text; sketches are server paths | — |
| 2 | Balanced headings | pass | All 28 headings `balance` | — |
| 3 | Line length | pass | 59 and 71 cpl, `pretty` | — |
| 4 | Optical alignment | pass | `sc-seats-after-arrow.png`: chair circles centre under two-line labels; red underline hugs the label | — |
| 5 | Focus states | pass | 23/23 stops ringed (3px `#a8321f`, offset 3px), 0 obscured. Seat focus draws a double red ring on the chair (`d.module.css:917`, `sc-seat-focus.png`) | — |
| 6 | Hover feedback | pass | 19/20 change; only the wordmark doesn't (`hover-011-NONE.png`) | Wordmark: the red underline wipe the nav links use |
| 7 | Pressed / active | pass | `.button:active` (`d.module.css:206`) measured `translateY(1px)` + `accent-ink` fill (`sc-button-active.png`) | — |
| 8 | Cursor affordances | partial | Production crosshair hidden and native cursor restored (`app/design-lab/d/layout.tsx` `HIDE_GLOBAL_CHROME`; `globalCursor.visible 0`). But CursorProvider's rAF loop still runs **60/s** while hidden (`idleWithCursor`) | Orchestrator: give CursorProvider a route opt-out (e.g. bail when `[data-concept]` is present) so the loop never starts |
| 9 | Input states | pass | Seat radios are visually hidden; state shows on the chair (checked fill, focus ring) | — |
| 10 | Disabled states | n.a. | None | — |
| 11 | Hover intent | pass | Chair hover `scale(1.08)` (`d.module.css:904`) is spec'd. Nothing opens on hover | — |
| 12 | Card expansion | n.a. | Seat panel swaps via `:has()`; no expansion | — |
| 13 | Overflow | pass | 390px `scrollWidth 390` | — |
| 14 | Whitespace | pass | Unaffected by state | — |
| 15 | Breakpoint behavior / touch | pass | 1 target under 44px at 390px ("Terms" 43×44) | Pad by 1px |
| 16 | Scroll behavior | pass | `#how` smooth 1.25s with `scroll-margin-top: 80px`; next Tab continues into the seat picker | — |
| 17 | Loading states | n.a. | Static; sketches draw on at 15% visibility but are complete in server HTML | — |
| 18 | Empty states | pass | "OWNER ____" blank line in every seat panel is the designed empty state (`sc-seats-after-arrow.png`) | — |
| 19 | Feedback after action (seat picker) | partial | Arrow keys move the checked seat and the panel follows (`seat.arrow checked firmware-embedded`). But the panel isn't announced: 0 live regions in `#seats`, and the radios have no `aria-describedby`, so a screen-reader user hears only "Firmware / Embedded, radio, 3 of 7" | Give each panel an `id` and point the matching radio's `aria-describedby` at it. Stays CSS-only and no-JS safe |
| 20 | Transitions vs spec (§9) | partial | 120/200ms on `cubic-bezier(0.2,0.7,0.2,1)`, as spec'd; 900ms draw-on `(0.45,0.05,0.3,1)`, as spec'd. The 40 sketch paths also fade at **320ms `ease-out`**, which isn't the spec's UI curve | Use the UI curve `cubic-bezier(0.2,0.7,0.2,1)` for the 320ms fill |
| 21 | Reduced motion | pass | Under reduce: 0 animations, 0 rAF/s, 0 transitions; sketches already drawn (`sc-rm-how.png`) | — |
| 22 | Idle motion | partial | D: 0 rAF/s; hidden cursor loop 60/s (item 8) | Item 8 |
| 23 | Link vs button | pass | Zero buttons by design: actions are links to `/contact`, choice is a radio group | — |
| 24 | Skip links | partial | Two consecutive skip links: production "Skip to main content" (production-styled, rounded) and D's "Skip to content" | Hide the production one in the same `HIDE_GLOBAL_CHROME` block (`body:has([data-concept="d"]) > a[href="#main-content"]`) |
| 25 | Browser surfaces | partial | `::selection` = production mustard, not D's red pencil | `.root ::selection{background:color-mix(in srgb,var(--accent) 20%,transparent)}` |

## Top 3 fix-now

1. **Connect each seat radio to its panel** with `aria-describedby` (item 19), so the one interactive object explains itself to screen readers.
2. **Drop the duplicate production skip link** (item 24).
3. **Stop the hidden cursor loop**: needs a CursorProvider opt-out from the orchestrator (item 8).
