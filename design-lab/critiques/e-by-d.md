# Concept E "The Ledger", critiqued through Concept D's lens

CRIT-4 · 2026-10-02 · ORIGINAL_PROMPT §35 (cross-critique), §34 (motion), §6 (Vercel guidelines as auditor), §7 (Taste).
Lens: D's designer. D asks "who will I become and what will I make if I join?" and keeps text still. This critique doesn't ask E to become D. Every suggestion stays in E's register: a product studio's ledger, Carbon hairlines, Cabinet/Satoshi/JetBrains, one red, motion only on state change.

**Verdict:** E is the most credible concept for executives, recruiters and sponsors. Its hero artifact (the ledger) and the RSVP demo are real product thinking. Two problems hold it back. It can't tell *we don't know yet* from *this seat is yours*: 30 bracketed `[placeholder]`/`[confirm]` markers (rendered HTML count), so honesty reads as an unfinished site. And the person who would fill a row never appears. One real bug breaks the RSVP demo on phones.

Evidence base:
- Renders `design-lab/renders/e/v1/` (stitched desktop/tablet/mobile), slices `design-lab/renders/e/crit/slices/{d-*,m-sheet1,m-sheet2,t-sheet}.png`
- Recording `design-lab/renders/e/crit/motion.webm` + `motion-reduced.webm`, frames `crit/frames/NNN.png` (4 fps), sheets `crit/sheet-*.png`
- Measurements from `design-lab/scripts/crit4-e-record.mjs`: 0 console errors. Desktop CLS 0.0005. Mobile RSVP view 440 px wide inside a 350 px figure. Doc height 8,469 → 9,798 px after GSAP enhancement
- Gemini motion critique + cross-check: `design-lab/critiques/e-gemini-motion.md`
- Source `app/design-lab/e/**` (read-only)

Severity: **high** = breaks the concept or a user task; **med** = weakens the pitch for E's audience; **low** = polish.

---

## 1. Hierarchy

| # | Finding | Evidence | Sev | Suggestion (E's style) |
|---|---|---|---|---|
| H1 | The thesis out-shouts the hero artifact. The H1 runs 5 lines at 96 px in a 5/12 column. The ledger (E's stated hero object) sits to its right and ends ~150 px above the hero copy, leaving a dead block under it | `crit/slices/d-0.png` (ledger ends y≈808, hero copy y≈950); `e.module.css:95-103,238` | med | Make the ledger win. Either cap `.display` at ~72 px so the thesis sets in 3 lines, or run the H1 full-width across 12 columns above a 5/7 split of lead + ledger. Linear's own pattern is headline over artifact, not beside it |
| H2 | The "not shipped" status is said 8 times on one page: lead, hero fact `0`, 2 ledger tags, 2 case strips, 2 outcome intros, plus 2 fact rows | Rendered HTML count; `page.tsx:94`, `CaseStudy.tsx:51`, `content.ts:60` | med | State it once per object, like a status column does. Keep the hero `Shipped 0` numeral (it's the brave, E-only move) and the ledger chip. Drop the case-strip `Outcome: not shipped` and the repeated outcome intro sentence |
| H3 | Each case study is ~3,000 px desktop / ~5,000 px mobile and identical in shape, so neither has a peak beyond its artifact. Two 16:5 striped `[PROJECT PHOTO] [placeholder]` plates add ~520 px of nothing | `crit/slices/d-3600.png`, `d-5400.png`; `e.module.css:399-404` | med | Keep the fixed template (it *is* E), but give fields that are empty a compact state: one fact-sheet row `Pending · duration, outcome, repo, partner` instead of 4 dashed rows. Remove the photo plates from the prototype. A changelog doesn't print empty image slots |
| H4 | The section H2 "Same template for every build. Blanks stay blank." describes the page, not the work | `page.tsx:139` | low | Point the H2 at the builds (E voice, numbers only when real), e.g. "Two builds. Every field reported." *(exploratory; copy still goes brand-voice-strategist → brand-guardian)* |

## 2. Typography

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| T1 | Mono is used for running sentences at 11 px: RSVP caption, step meta, slot notes, seat status. CONTEXT-PACK §5 lists "10px all-caps mono body" as an avoid. These sit 1 px above it | `e.module.css:422,458,513`; `crit/mobile-rsvp.png` (4-line mono caption) | med | Keep mono for keys only (`SCOPE`, `RISK`, `OWNER`, IDs). Set the values and any full sentence in Satoshi 14–15 px. A ledger reads key:value, and the value should be the readable half |
| T2 | Cabinet Grotesk + Satoshi + JetBrains Mono is word-for-word the Taste skill's (§7) default "anti-slop" pairing (`design-taste-frontend-v1` Rule 1), so it's now the statistically likely premium pick | `/home/danny/.claude/skills/design-taste-frontend-v1/SKILL.md` §3 Rule 1; `layout.tsx:13` | med | Keep the families (they fit) and make one move E owns. Use tabular, slashed-zero JetBrains numerals for every ID, count and date, so `DG-001`, `0`, `— / 7` and `As of` become a typographic system of their own. Give `.heroFactNum`/`.slotNum` `font-variant-numeric: tabular-nums` (`e.module.css:233,419`) |
| T3 | Fontshare via CDN `<link>`, with no preload or size-adjusted fallback. At 96 px a swap from `system-ui` to Cabinet is a visible reflow. It also conflicts with DESIGN.md §8 (next/font only) | `layout.tsx:13-16,40-44` | med (feasibility) | Ask the Head Designer for the §8 exception now. If it's refused, the E-faithful swap is a self-hostable grotesk at 800 with the same 0.96 leading. Re-render before deciding |

## 3. Distinctiveness

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| X1 | **The ledger is E's one owned idea, and it stops at the hero.** Below the fold the page turns into a well-made case-study template any studio could use | `crit/slices/d-0.png` vs `d-1800.png`..`d-5400.png` | med | Carry the ledger grammar down the page: IDs, status chips and `As of` stamps on every block. Case studies become "ledger entry expanded", and roles become "ledger of seats" |
| X2 | **Unsigned "BUILT BY ______" device: partly earned, partly borrowed.** *Earned*: the sign-off grid maps to the real ownership model (Project lead · Subsystem owners · Reviewer · Test gate, `page.tsx` signoff props, `phoneV2.ts:295-300`). That's E turning the gates into a signature block. *Borrowed*: underlined signature lines, `Built by ______ (unsigned)`, `owner: ______ [placeholder]` and the close "Put your name on a build." are D's paper-and-pencil motif dropped into a product UI. Count: 9 `______`, 7 `[unsigned]`. All six concepts converged on this (CONTEXT-PACK seeded it), so on its own it's generic | `CaseStudy.tsx:124`, `PhoneSequence.tsx:117`, `content.ts:137,150`, `page.tsx:346`; `crit/slices/d-3600.png` sign-off row | med | **What only E can do:** product teams don't sign lines, they *assign* rows. (1) Replace every underline with an **assignee cell**: `Owner · Unassigned` as a status chip, the way an issue tracker shows it. That's the same promise in E's grammar. (2) Add a **gate board**: 7 subsystems × 4 gates = 28 cells, all empty today, which is the honest zero state. It's real structure, not a fake KPI (it's built from `phoneV2` subsystems × `scopeItems`), and it fills in as the club works. It's the proof device D can't have. (3) Close on a **draft ledger row** instead of the seeded line: `DG-001 · Firmware / Embedded · Owner: you · Status: proposed → Open the form` (`/contact?type=project-team`). The visitor sees their name as a row state, not a signature |

## 4. Usability

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| U1 | **RSVP demo breaks at 390.** `aspect-ratio: 16/8` + `min-height: 220px` forces the view to 440 px inside a 350 px figure. The word centre sits 46 px right of the figure centre (241 vs 195), and the `450 WPM` HUD is clipped. On the demo whose whole point is "one word held at a fixed point", the point is off-centre | `e.module.css:489`; measured by `crit4-e-record.mjs`; `crit/mobile-rsvp.png`; `crit/slices/m-sheet2.png` col 1 | **high** | `aspect-ratio: auto` below 600 px with a fixed `height: 220px`, or drop `min-height` and use `aspect-ratio: 16/10` on mobile. Re-measure the word centre = figure centre |
| U2 | The open-roles board leads with President · VP · Secretary · Treasurer. That's the most "student club" content on the page, inside the concept meant for execs and sponsors. The product seats (7 subsystem owners with real scope and risk) appear only as `owner: ______` in 11 px mono on the dark band | `crit/slices/d-5400.png`; `page.tsx:296`; `PhoneSequence.tsx:117` | med | Lead the board with the 7 subsystem-owner seats as job-post rows (title · build · scope · risk · `Unassigned` · Take seat), from `phoneV2.subsystemSections`. Fold the officer seats underneath as "Studio operations · 7 seats". Same data, studio register |
| U3 | The ledger row → brief → "Read the case study" path adds a click that shows little new: the brief repeats row fields plus a one-line problem, then sends you to a section one scroll away. Hydration also swaps the row from `<a>` to `<button>`, so cmd/middle-click and deep links stop working | `Ledger.tsx:125-144`; frames 56–64 (`crit/sheet-morph.png`) | med | Give the brief content only it has: that build's **open seats** (U2 rows filtered to the build) with deep links. Or keep the row an `<a href="#case-…">` and put the morph on the case header (E's own spec says "same layoutId from ledger to `/projects/<slug>` header"). Sync open state to `?brief=dg-001` |
| U4 | The production crosshair cursor leaks in: `body { cursor: none }` plus a 28 px ring and 5 px dot. E has no cursor language, and the native I-beam and pointer are gone | `app/layout.tsx:91` `CursorProvider`; not hidden by `app/design-lab/e/layout.tsx:28-35`; frames 56, 61, 71, 85, 89 | med | Hide it in E's layout style tag the same way nav/footer are (or the orchestrator adds `/design-lab` to `IMMERSIVE_PREFIXES`). E's pointer feedback is the row's 2 px ink rule, which is enough |
| U5 | Two "Take a subsystem" buttons go to different places: nav → `#join`, join section → `/contact?type=project-team` | `page.tsx:63`, join CTA | low | One label, one destination. Nav CTA goes straight to the form, or nav reads "Join" |

## 5. Brand fit

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| B1 | **Two kinds of blank share one style.** `[confirm — toolchain sources conflict]` and `[placeholder — phase to confirm]` are *internal TODOs*. `Partner slot open` and `Owner unassigned` are *invitations*. Both render as muted text with the same dashed `::before` glyph. To a recruiter the first kind reads as an unfinished website, not studio honesty. 30 bracketed markers in ~1,600 words | `e.module.css:133-134` `.ph`; rendered count 23 `[placeholder` + 7 `[confirm`; `crit/slices/d-1800.png` fact sheet | **high** | Split the states. **Open** (invitation): accent-dashed chip with a CTA. **Pending** (known gap with a reason): a quiet `Pending` chip with no brackets. **TODO** (`[confirm]`) is design-lab only and has to be resolved before production. Show the production state of each field (e.g. technologies listed once the club confirms) so the Head Designer judges the real page |
| B2 | No company backs a build, and that's said 4 times (2 partner slots + 2 fact rows). To sponsors, honesty becomes pleading | `page.tsx:309,314`; `content.ts:138,152` | low | Say it once in the For-companies block ("Partner slots: 2 open"). In fact sheets the row reads `Partner · Open` |
| B3 | From D's lens: there's no human trace at all. Nothing says what a Thursday is, what an owner does in a week, or what you leave with. The Venture Studies "learn" lines are the only outcomes for a person | `crit/slices/d-5400.png` / `d-7200.png` | med | E's way, without photos or faces: make each seat row a **role spec**. "You own: boot path, timing, debug. You sign: Gate 3 test log. You hand off to: Operating System." It's all derivable from `phoneV2` subsystem bullets + the 4 gates. A job post is a studio's human voice |

## 6. Project storytelling (§41)

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| P1 | The RSVP demo is the strongest storytelling on this page: the method runs, the reader sets the pace, it doesn't autoplay, and the caption is honest. Keep it as-is (after U1) | `crit/slices/d-3600.png`; frames 90–92 | — (strength) | Add a third pace that the reader types in (`wpm` number input, 100–700, labelled). "Reader sets WPM" is the project's own claim (`glasses.ts`), so let the demo prove it |
| P2 | The scroll story walks 7 subsystems in step order, but the exploded schematic stacks them in physical order (top→back 05, 04, 01, 03, 02, 07, 06). The highlight zig-zags up and down the stack while you scroll down, so space and sequence tell two stories | frames 28–45 (`crit/sheet-scrub-a.png`, `sheet-scrub-b.png`); `crit/slices/d-1800.png` labels | med | Order the story by the stack (Apps/UX top → Mechanical/CAD back) so the highlight descends with the scroll, and keep the 01–07 numbering in that order. Or keep step order and animate each layer *out of the stack* when its step activates, so the explode itself becomes the progress. Both stay inside E's "motion only on state change" |
| P3 | Outcome slots are three display-size em dashes (`— / 7`, `—`, `—`). That's honest but inert | `crit/slices/d-3600.png` top | low | Replace with the X2 gate board (28 empty cells, legend "0 of 28 gates passed · as of [date]"). Same honesty, and it shows what the number *will* measure |

## 7. Responsiveness

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| R1 | RSVP overflow at 390 (see U1) | `crit/mobile-rsvp.png` | high | see U1 |
| R2 | On mobile each fact sheet (10–11 rows, 6 of them placeholders on DG-001) comes *before* the problem statement, so the reader meets metadata blanks before the reason the project exists | `crit/slices/m-sheet1.png` col 4 | med | Below 1,100 px order narrative first (problem → approach), then the fact sheet. Collapse pending rows into one `Pending (5)` disclosure (`<details>`, works without JS) |
| R3 | Schematic labels clip at 834: "01 SYSTEMS ARCHITECTUR", "07 INTEGRATION / TESTI". At 390 the labels drop to numbers only, in the zig-zag order (P2) | `crit/slices/t-sheet.png` col 1; `PhoneSchematic.tsx:177` viewBox, `e.module.css:574` | low | Widen the viewBox right padding at 600–959 px, or switch to numbers + a legend list at the same breakpoint as mobile |
| R4 | Mobile page ≈13,500 CSS px. That's long for a homepage, but the ledger still shows its first row in the first 844 px viewport | `v1/e-mobile-stitched.png` (27,082 px @2x) | low | Fixes H3 + R2 cut ~1,500 px without losing a field |

## 8. Implementation feasibility

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| F1 | A dated ledger is only credible if it stays current. `As of [placeholder date]` with no owner or source invites a stale public ledger, which is worse than none for E's audience | `content.ts:59`; footer `page.tsx` "Ledger as of" | med | Add a required `ledgerAsOf` field (ISO date) to the data and render it with `Intl.DateTimeFormat`. Fail the build if it's missing or older than N days. Name an owner seat for it ("Secretary updates the ledger") |
| F2 | Three motion runtimes for one page: `motion` (one layoutId morph), `gsap` + ScrollTrigger (one scrub), `lenis` (smooth wheel). Lenis also means wheel hijack and a ~5,000 px fly-through on anchor jumps | `SmoothScroll.tsx:27-32`; frames 85–90 | med | Drop Lenis: native scroll + `scrub: 0.6` already smooths the scrub. Keep GSAP for the scrub, and `motion` only if the morph survives U3 |
| F3 | Prod-chrome hiding by `<style>` override is brittle: it already missed the cursor (U4) | `layout.tsx:28-35` | low | Orchestrator: `IMMERSIVE_PREFIXES` += `/design-lab` |
| F4 | Enhancement reflow: `.seqEnhanced` is added after hydration and grows steps 141–157 → 342 px, so the document grows by 1,329 px after load. Deep links to `#case-dg-002` resolved before hydration land wrong | `e.module.css:475`; measured no-JS vs JS | low | Move `min-height: 38vh` into `@media (min-width: 960px) and (prefers-reduced-motion: no-preference)` in CSS, so layout is final at first paint |

## 9. Motion quality (§34; full detail in `e-gemini-motion.md`)

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| M1 | Scrub is front-loaded: the explode completes over ~585 px of a 2,394 px step list (~24%), then 5 steps of static geometry. Gemini agrees | `PhoneSequence.tsx:55`; frame 28 fully exploded | med | `end: 'bottom 60%'` on the steps list, or tie each layer's separation to its own step trigger (see P2) |
| M2 | Inactive steps dim to 0.38 opacity: body ≈2.7:1, meta ≈2.1:1 on `#111311`, so the next step can't be read ahead. Gemini flagged readability but blamed speed | `e.module.css:462` | med | Dim to 0.6 (≈4.9:1 body). Show "active" with the red step number + 2 px rail tick, which E already has, not with fade |
| M3 | Entrance delays the thesis ~0.5–0.75 s and flashes an empty ledger frame (frame 6). From D's lens text shouldn't animate in. E's own rule ("only state changes move") agrees | frames 6–9 (`crit/sheet-load.png`); `e.module.css:216` | med | Render hero text static. If anything moves on load, let the ledger rows *post* (a 1-row-at-a-time state change, 40 ms, opacity only), which is a ledger event, not a decorative rise |
| M4 | Brief morph: shared ID/title/status *do* travel (frame 60), and the spring (damping ratio ≈1.03) has no overshoot. Gemini was wrong on both. Weak spot: the return frame ghosts dialog text over the DG-002 row (frame 70) | `Ledger.tsx:18,30-46`; `crit/sheet-close.png` frame 70 | low | Fade `.sheetBody` out fully (already 80 ms) *before* the container starts shrinking: `exit` delay on the layout transition ≈80 ms |
| M5 | Reduced-motion parity: pass. Rise is removed, the morph is instant, there's no Lenis, and the schematic is static and exploded. RSVP is user-initiated in both modes. Gemini's "critical flash" call is overstated (small area, never autoplays) | frames R36–R44 (`crit/sheet-reduced-mid.png`); `RsvpDemo.tsx:22` | — (pass) | Optional: under reduced motion default the pace to 250 wpm |

---

## Appendix A: web-design-guidelines audit (§6, auditor only)

Source: `vercel-labs/web-interface-guidelines/main/command.md` (fetched 2026-10-02). Rules that conflict with E's or BRAND.md's deliberate choices (Title Case buttons, `&` over "and") are skipped, not flagged.

```text
## app/design-lab/e/e.module.css
e.module.css:489 - aspect-ratio + min-height overflows container at 390 (see U1)
e.module.css:462 - opacity .38 on readable text → contrast < AA during scrub
e.module.css:153-157 - .textLink inline-flex min-height:44px used inside paragraphs → breaks line box / baseline
e.module.css:233,419 - numeral displays lack font-variant-numeric: tabular-nums
e.module.css:475 - layout-affecting class added post-hydration → reflow; do it in CSS media query
e.module.css (global) - no touch-action: manipulation / -webkit-tap-highlight-color set on controls

## app/design-lab/e/components/Ledger.tsx
Ledger.tsx:125-144 - <a> swapped for <button> after hydration → loses Cmd/middle-click + URL; brief state not in URL
Ledger.tsx:184 - overflow:hidden on <html> without scrollbar-gutter → horizontal jump on Windows/desktop scrollbars
Ledger.tsx:198 - focus-trap selector ignores [tabindex]/input; fine today, fragile

## app/design-lab/e/components/CaseStudy.tsx
CaseStudy.tsx:88-129 - 6 × <section aria-label> per case → 12 extra region landmarks; use aria-labelledby on the h4 or plain <div>

## app/design-lab/e/components/RsvpDemo.tsx
✓ pass (aria-pressed toggles, aria-label on icon button, img width/height + lazy, curly quotes, offscreen pause)

## app/design-lab/e/components/PhoneSequence.tsx
PhoneSequence.tsx:82 - ScrollTrigger.refresh() runs before Fontshare fonts settle → refresh again on document.fonts.ready

## app/design-lab/e/page.tsx
page.tsx (codes) - DG-001 / DIGITAL / RSVP identifiers lack translate="no"
page.tsx:63 + join CTA - same label, two destinations (see U5)

## app/design-lab/e/layout.tsx
layout.tsx:13-16 - CDN fonts without <link rel="preload" as="font">; display swap at 96px = visible reflow
layout.tsx:28-35 - chrome override misses production CursorProvider (see U4)
```

Passes worth keeping: skip link, `:focus-visible` 2 px ring on both themes, `aria-modal` dialog with focus in, trap and return, `scroll-margin-top`, 44 px targets, no-JS ledger links, reduced-motion handling across CSS, motion and GSAP.

## Appendix B: Taste (§7) lens, in one pass

- **Pass:** one accent, no pure black (`#111311`), no glow/gradient text, no 3-equal-card feature row at section level, organic real data only, no fake names.
- **Flags:** oversized H1 (H1), the Taste-default font kit (T2), custom cursor (U4, inherited), 3-equal dashed outcome slots ×2 (P3: the gate board fixes it).

---

## Top 5 fix-now

1. **Fix the RSVP mobile overflow.** `e.module.css:489`: replace `min-height` + `aspect-ratio` on <600 px with a fixed height, then re-measure word centre = figure centre at 390. (U1/R1, high)
2. **Split "Open" from "Pending" from "TODO".** Three chip states in `.ph`/`.status`, no brackets in the visitor-facing states, `[confirm]` resolved before any production pass. (B1, high)
3. **Swap signature lines for assignee cells + a 7×4 gate board.** `Owner · Unassigned` chips; 28-cell subsystem × gate grid replaces the em-dash outcome slots; close on a draft ledger row. That's E's own answer to the shared "BUILT BY ______" device. (X2/P3, med)
4. **Lead "Open roles" with the 7 subsystem-owner seats** as role-spec rows (own / sign / hand off to). Officer seats fold below. (U2/B3, med)
5. **Re-pace the DG-001 story.** Order steps by stack position (or per-step layer pull-out), stretch the explode across the whole list, inactive steps at 0.6 opacity, hero text static on load. (P2/M1/M2/M3, med)

Next action: open `app/design-lab/e/e.module.css:489`, and check this critique's U1 numbers against `design-lab/renders/e/crit/mobile-rsvp.png` before DA-E's second iteration.
