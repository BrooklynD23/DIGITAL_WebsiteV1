# MICRO — Concept A "The Signed Edition": micro-interaction audit (§15, §9)

Verdict: **strong quiet editorial states; 3 gaps.** No pressed state, three unstyled hover targets, and a layout-animating ledger hover. Judged against A's own language: "reading marks, not app widgets".

Method: Playwright at 1440 / 390 / `reducedMotion: 'reduce'` / JS off. Hover and focus are pixel diffs of element crops, with the production cursor overlay hidden while measuring.
Scripts: `design-lab/scripts/micro-audit.mjs`, `micro-scenarios.mjs`, `micro-anchor.mjs`. Raw data: `design-lab/renders/micro/a/audit.json`, `scenarios.json`.

| # | Item (§15 / §9) | Status | Evidence | Fix in A's own style |
|---|---|---|---|---|
| 1 | Text wrapping | pass | `audit.json` `noJs.hiddenText 0`; 390px `scrollWidth 390` | — |
| 2 | Balanced headings | pass | h2/h3 `text-wrap: balance` (`a.module.css:624,725`). h1 is `auto` with hand-set lines, which is correct for the cut reveal | — |
| 3 | Line length | partial | 1 of 2 long paragraphs measures **84 cpl** ("DG-001 is a smartphone built from scratch…", `audit.json inventory.measures`) | Cap that lede at `max-width: 66ch`, like the other chapter ledes |
| 4 | Optical alignment | pass | crops `hover-011…015-ok.png`: arrows sit on the baseline and the red underline aligns with the text | — |
| 5 | Focus states | pass | 29/29 Tab stops show a ring; 0 obscured, 0 off-screen. 2px `#d8412f` at 3px offset (`a.module.css:69`), 3.84:1 on paper, above the 3:1 non-text minimum. Crops `focus-000…005-ok.png` | — |
| 6 | Hover feedback (button feedback) | partial | 8/28 targets show no change: the 3 pace buttons 200/300/450 (`hover-026/027/028-NONE.png`, `.rsvpPace` `a.module.css:1042` has no `:hover`), the wordmark (`hover-010-NONE.png`), and 4 colophon links: contact, Discord, Privacy, Terms (`hover-034…037-NONE.png`) | Pace: a red hairline under the numeral on hover, the same "reading mark" as text links. Colophon links: the thickening red underline already used by `.textLink:hover` (`:125`) |
| 7 | Pressed / active | fail | No `:active` rule in `a.module.css`. Press diff = 0 on "Read it" and "200" (`audit.json active`, `active-025/026.png`) | `:active { transform: translateY(1px); }` on `.rsvpButton`, `.rsvpPace`, `.primaryCta`, `.mastCta`: a press into the paper, no bounce |
| 8 | Cursor affordances | partial | Buttons and links use `pointer` (pass). The **production crosshair cursor** (`components/ui/CursorProvider.tsx`, mounted from `app/layout.tsx:91`) is visible here: `globalCursor.visible 2`, `html{cursor:none}`, and a lagging ring. That contradicts §8 "no cursor effect of our own". See `active-*.png`, where the ring shows in the crop | Copy D's opt-out (`app/design-lab/d/layout.tsx` `HIDE_GLOBAL_CHROME`) into A's layout. Better: the orchestrator adds a route opt-out to CursorProvider so its rAF loop stops too |
| 9 | Input states | n.a. | A has no text inputs | — |
| 10 | Disabled states | n.a. | No disabled controls (`linkVsButton.disabled []`) | — |
| 11 | Hover intent | pass | Hover effects are tint and underline only. Nothing opens on hover | — |
| 12 | Card expansion | partial | Ledger rows animate **`padding-left`** on hover (`a.module.css:648-654`; computed `transition-property: background-color, padding`). That is a layout property, so the row reflows each frame (`sc-ledger-hover.png`) | Keep the 12px shift but move it to `transform: translateX(12px)` on the row's inner grid; keep the plate tint |
| 13 | Overflow | pass | 390px: `scrollWidth 390`, 0 overflowing nodes | — |
| 14 | Whitespace | pass | Not re-audited here; no state change alters spacing except item 12 | — |
| 15 | Breakpoint behavior | pass | 390px: 1 target under 44px ("Terms" 41×44) | Pad the colophon links to 44px wide |
| 16 | Scroll behavior | pass | Anchor to `#rules` settles in 1.3s (smooth comes from production `app/globals.css:147`). It's disabled under reduced motion (`:191`). The next Tab continues after the target. No scroll-jacking | — |
| 17 | Loading states | n.a. | Static page, no async content | — |
| 18 | Empty states | pass | DG-003 "Unsigned" credit row and the blank credits section read as an intentional empty slot | — |
| 19 | Feedback after action (RSVP) | partial | Works: "Read it" → "Pause" → back to "Read it" at the end (`sc-rsvp-idle/playing/end.png`). But the button swaps its label **and** sets `aria-pressed` (`RsvpPlate.tsx:83`), so a screen reader hears "Pause, toggle button, pressed" | Keep the label swap and drop `aria-pressed`, or keep a fixed label "Read it" with `aria-pressed` |
| 20 | Transitions vs spec (§9) | pass | Measured 120ms / 240ms on `--ease-std` / `--ease-ink`, `aCut` and `aSign` at 900ms ink: all match spec §Motion. The `0.2s cubic-bezier(.4,0,.2,1)` ×24 entries belong to the hidden production chrome | — |
| 21 | Reduced motion | pass | Under reduce: 0 running animations, 0 rAF/s, 0 non-zero transitions; the hero renders final (`rm-hero.png`). Note: `.root * {transition-duration: .01ms !important}` (`a.module.css:1673`) is the blanket kill that impeccable flags. It is harmless here because every A transition is decorative | — |
| 22 | Idle motion | partial | A itself: 0 rAF/s at rest. The production cursor adds 60 rAF/s forever (`idleWithCursor.cursorRafPerSec 60`) | Same fix as item 8 |
| 23 | Link vs button | pass | Navigation is `<a>`, state is `<button>`; no `href="#"`, no `div` buttons | — |
| 24 | Browser surfaces | partial | `::selection` is production mustard `rgba(194,142,14,.3)`, which isn't in A's palette | `.root ::selection { background: color-mix(in srgb, var(--a-red) 22%, transparent); }` |

## Top 3 fix-now

1. **Remove the production crosshair cursor on `/design-lab/a`** (items 8, 22): it breaks "no cursor effect" and idles at 60 rAF/s.
2. **Add a pressed state** to the RSVP, pace and CTA buttons (item 7): a 1px press, not a bounce.
3. **Ledger hover: `padding-left` → `transform`** (item 12), and give the pace buttons and colophon links the red-underline hover (item 6).
