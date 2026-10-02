# MICRO — Concept F "The Bench": micro-interaction audit (§15, §9)

Verdict: **the deepest stateful interaction (sign → drag → sheet) works by mouse, keyboard and reload; the finish around it lags.** A blue framework focus ring on the signature input, 11 dead hovers, and verbose drop announcements. Judged against F's language: "nothing moves unless you move it; your name is the only thing that is red".

Method: Playwright at 1440 / 390 / reduced motion / JS off, including a keyboard drag (Space, ArrowRight, Space) and a reload. Hover and focus are pixel diffs (production cursor hidden while measuring). Raw data: `design-lab/renders/micro/f/audit.json`, `scenarios.json`.

| # | Item (§15 / §9) | Status | Evidence | Fix in F's own style |
|---|---|---|---|---|
| 1 | Text wrapping | pass | JS off: 0 hidden text; the sign input is disabled with a reason (`Sections.tsx:50-55`) | — |
| 2 | Balanced headings | pass | Section h2/h3 `balance`; h1 visual is an `aria-hidden` sticker with sr-only text | — |
| 3 | Line length | partial | Footnote "Rules from DG-001's build scope…" runs **one 1172px line ≈ 190 cpl** at 13px (`f_footnote`, no `max-width`) | `max-width: 72ch` on the footnote |
| 4 | Optical alignment | pass | `peek-placed.png`: the tag sits on the "BUILT BY" baseline at −1.5° | — |
| 5 | Focus states | pass | 43/43 stops ringed (3px ink or mat-ink, offset 3–4px), 0 obscured despite the sticky tray | — |
| 6 | Hover feedback | fail | **11 links/buttons show no hover**: "Open the DG-001/DG-002 record", "Ways into Venture Studies", "Put your tag on a seat", "Not yet. Go to the bench", "List" (unpressed), and footer contact/Discord/Privacy/Terms/Cookies (`hover-031/038/040/042/023-NONE.png`). `.textLink` (`f.module.css:582`) and `.recordLink` (`:1084`) have no `:hover`. The name tag shows only `cursor:grab`, with no lift (`hover-021-NONE.png`) | Text links: the 180ms arrow nudge already on `.cta:hover svg` (`:543`). Tag hover: the pickup pose at half strength (`rotate(-1.5deg)`), with the full pose on drag |
| 7 | Pressed / active | fail | No `:active` rule in `f.module.css`; press diff 0 on "Bench" (`audit.json active`) | Press = 1px hard-shadow collapse (`translate(1px,1px)`, shadow 0), the bench's own pickup vocabulary in reverse |
| 8 | Cursor affordances | partial | `grab` on the tag, `pointer` on buttons (pass). Production crosshair visible (`globalCursor.visible 2`, `html{cursor:none}`), which hides the `grab` affordance under a ring | Hide it in F's layout next to the existing Navbar/Footer hide rule |
| 9 | Input states | fail | Sign input focus shows **`@tailwindcss/forms` blue** (`rgb(37,99,235)` border plus ring, `tailwind.config.ts:83`) stacked on F's 3px ink outline (`sc-sign-focus.png`). That is an off-palette chromatic colour on the one input that is "about you". `.signInput` (`f.module.css:480-499`) doesn't reset it | `.signInput:focus{box-shadow:none;border-bottom-color:var(--tag);outline:3px solid var(--ink);outline-offset:3px}`: red underline because the name is red |
| 10 | Disabled states | pass | No-JS: input disabled at 0.6 opacity with note "Signing needs JavaScript…" | — |
| 11 | Hover intent | pass | Seat hover inverts the phone layers it touches; nothing opens on hover | — |
| 12 | Card expansion | n.a. | None by design; List view is the alternate (`sc-list-view.png`) | — |
| 13 | Overflow | pass | 390px `scrollWidth 390` | — |
| 14 | Whitespace | pass | Sticky tray doesn't cover focused targets (0 obscured) | — |
| 15 | Breakpoint behavior / touch | pass | 2 targets under 44px at 390px ("Join" 41, "Terms" 40); bottom tab bar 56px (`sc-mobile-tabbar.png`) | Pad the strip links by 2px |
| 16 | Scroll behavior | partial | Spec "anchors jump"; measured `#bench` **smooth 0.75s** (production `app/globals.css:147`); the next Tab lands inside the target; tab `aria-current` follows scroll (`sc-tabs-thursday.png`) | `html:has([data-lab-f]){scroll-behavior:auto}` in F's layout `<style>` |
| 17 | Loading states | pass | Without JS, seat buttons become "Ask about this seat" links and the tray explains (concept doc) | — |
| 18 | Empty states | pass | "your name" tag, dashed unsigned seats, blank sheet (`sc-tray-unsigned.png`): the empty state *is* the thesis | — |
| 19 | Feedback after action | partial | Strong: the tray updates politely ("Your tag is on DG-001 · Systems Architecture…"), the button becomes "Take it back" and keeps focus, the name persists across reload (`persist.reload "Danny"`). But a drop also fires `seatDetail` `aria-live` (`Sections.tsx:104`) with **~350 characters** of seat copy, on top of dnd-kit's drop announcement (`scenarios.json kbd.drag`) | Make `seatDetail` non-live; the tray line already announces the result |
| 20 | Transitions vs spec (§9) | pass | 120 / 180ms `cubic-bezier(.2,.8,.2,1)`, matching the spec table | — |
| 21 | Reduced motion | pass | Under reduce: 0 rAF/s, 0 animations, 0 transitions; RSVP doesn't autoplay | — |
| 22 | Idle motion | partial | F: 0 rAF/s at rest (pass); production cursor 60 rAF/s (item 8) | Item 8 |
| 23 | Link vs button | pass | Tag is a dnd-kit `role=button` span with 3 equivalents (seat button, keyboard, List view) | — |
| 24 | Browser surfaces | partial | `::selection` = production mustard | `.root ::selection{background:var(--ink);color:var(--paper)}` keeps red reserved for the name |

## Top 3 fix-now

1. **Remove the `@tailwindcss/forms` blue from the sign input** (item 9): it is the signature interaction and the only off-palette colour on the page.
2. **Hover + pressed for text links, the List toggle and the tag** (items 6, 7): 11 dead hovers break "the page reacts in place".
3. **Silence `seatDetail` as a live region** (item 19): one plain-language drop announcement, not two.
