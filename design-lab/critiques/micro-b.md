# MICRO — Concept B "Engineering / System": micro-interaction audit (§15, §9)

Verdict: **the most complete state model of the six; the gaps are touch size and toggle semantics.** Every hover and focus answers "which part, whose, what state", as B's own language promises ("Inspect, don't animate").

Method: Playwright at 1440 / 390 / reduced motion / JS off. Hover and focus are pixel diffs of element crops (production cursor overlay hidden). Raw data: `design-lab/renders/micro/b/audit.json`, `scenarios.json`.

| # | Item (§15 / §9) | Status | Evidence | Fix in B's own style |
|---|---|---|---|---|
| 1 | Text wrapping | pass | JS off: 0 hidden text; 390px `scrollWidth 390` | — |
| 2 | Balanced headings | pass | All h2 `balance`; lede `pretty` (`audit.json inventory.headings`) | — |
| 3 | Line length | pass | Only long paragraph = 58 cpl | — |
| 4 | Optical alignment | pass | `sc-map-hover.png`: wires land on part pins, H-badges sit on the block edge | — |
| 5 | Focus states | pass | 41/41 Tab stops ringed, 0 obscured. Fig. 1 blocks trace their wires on focus exactly as on hover (`sc-map-focus.png` = `sc-map-hover.png`; `InterfaceMap.tsx:98-101`) | — |
| 6 | Hover feedback | pass | 34/40 change. The 6 that don't: 2 already-pressed toggles (All, S1, expected), the wordmark, and footer Privacy/Terms/Cookies (`hover-059…061-NONE.png`) | Footer legal links: underline on hover like `.navLink:hover` (`b.module.css:153`) |
| 7 | Pressed / active | fail | No `:active` rule in `b.module.css`. Press diff 0 on "All", "Pause word stream", "S1" (`audit.json active`, `active-036.png`) | Invert on `:active` (ink fill, surface text), the same inversion B already uses for hover on buttons, held while pressed. 0ms; Carbon "productive" |
| 8 | Cursor affordances | partial | `pointer` on all buttons and links (pass). Production crosshair cursor visible (`globalCursor.visible 2`, `html{cursor:none}`); its ring trails the pointer across Fig. 1 | Hide it in B's layout (D's rule, `app/design-lab/d/layout.tsx`); ask the orchestrator for a CursorProvider opt-out |
| 9 | Input states | n.a. | No text inputs | — |
| 10 | Disabled states | n.a. | None | — |
| 11 | Hover intent | pass | Fig. 1 trace is instant and reversible; nothing opens on hover | — |
| 12 | Card expansion | n.a. | B deliberately has none (`:target` row highlight instead: `sc-register-target.png`, `b.module.css:468`) | — |
| 13 | Overflow | pass | 390px: 0 overflowing nodes | — |
| 14 | Whitespace | pass | Not changed by any state | — |
| 15 | Breakpoint behavior / touch | fail | **13 targets under 44px at 390px**: 7 Fig. 1 subsystem links at **101×27**, 4 index row links at **32px** tall, plus 2 more (`audit.json mobile.smallSample`) | Fig. 1 at ≤600px: give each `.mapLink` an invisible 44px hit rect (`<rect class="hit" height="44" fill="transparent">`). Index rows: make the whole `<th>` the link (`display:block; min-height:44px`) |
| 16 | Mobile menu | partial | `<details>` "INDEX" opens a 4-link panel with 44px rows (`peek-mobile-menu.png`). But the summary label doesn't change when open, Escape doesn't close it, and picking a link leaves it open | Label "INDEX" → "CLOSE" via `details[open] summary`; small script: close on link click and on Escape |
| 17 | Scroll behavior | partial | Spec says "anchors jump: documentation should feel instant". Measured: `#process` anchor **smooth-scrolls 1.19s** (production `app/globals.css:147`). `:target` row lands with `scroll-margin-top: 80px` (pass) | `.page { scroll-behavior: auto }` is not enough because the rule is on `html`. Add `html:has(.page){scroll-behavior:auto}` in B's layout `<style>` |
| 18 | Loading states | n.a. | Static; Fig. 1 server HTML is the finished drawing | — |
| 19 | Empty states | n.a. | Every filter returns ≥1 row (All 4 / Active 2 / Program 1 / Open 1) | If filters ever hit 0, show a row "No builds in this state. [Pitch one]" |
| 20 | Feedback after action | partial | Filters: polite live region "1 of 4 rows shown" (pass, `sc-filter-open.png`). BuildRun: the **whole run body** (584 characters) is `aria-live="polite"` (`BuildRun.tsx:71`), so every tab click reads a paragraph aloud | Live region gets only "S3 Firmware / Embedded: 4 gates" and the body stays silent |
| 21 | Toggle semantics | partial | RSVP control swaps `aria-label` Pause/Play **and** sets `aria-pressed` (`RsvpTiming.tsx:71`), so it reads "Pause word stream, pressed" | Fixed label "Word stream" + `aria-pressed`, or label swap without `aria-pressed` |
| 22 | Transitions vs spec (§9) | pass | 120ms `cubic-bezier(0.2,0,0,1)` everywhere (×90 nodes); wire draw only under `no-preference` (`b.module.css:259`) | — |
| 23 | Reduced motion | pass | Under reduce: 0 animations, 0 rAF/s, 0 non-zero transitions; RSVP shows a static plot (spec) | — |
| 24 | Idle motion | partial | B itself 0 rAF/s at rest; production cursor adds 60 rAF/s | Item 8 |
| 25 | Link vs button | pass | Fig. 1 blocks are real links to register rows; filters/tabs are `button[aria-pressed]` | — |
| 26 | Browser surfaces | partial | `::selection` = production mustard; B's palette has no mustard | `.page ::selection{background:var(--b-ink);color:var(--b-surface)}` |

## Top 3 fix-now

1. **44px hit areas on Fig. 1 links and index rows at 390px** (item 15): 13 undersized targets on the concept's main inspection surface.
2. **Pressed state + toggle semantics** (items 7, 21): `:active` inversion; pick one of label-swap or `aria-pressed`.
3. **Make anchors actually jump and trim the BuildRun live region** (items 17, 20), to match B's "instant documentation" promise.
