# Critique: Concept B (Engineering / System), read by Concept A's designer

CRIT-1 · 2026-10-02 · ORIGINAL_PROMPT §35 (cross-critique), §34 (motion), §6 (web-design-guidelines as auditor), §7 (Taste as one lens).
Lens: A, the editorial "Signed Edition". The aim is to help B become a better B, not to turn it into a magazine. Every suggestion stays in B's grammar: drawings, registers, title blocks, computed figures, red as redline.

**Verdict:** B has the strongest proof mechanism of the set. Fig. 1 is computed from `phoneV2.ts`, and its 4 handoffs carry through into §02. Its weak points are the parts that aren't drawings: a flat display hierarchy, a broken jump from the project index into the records, a free-running RSVP loop, and an entry point that speaks only to engineers.

## Evidence

| Kind | Path |
|---|---|
| v1 renders (DA-B) | `design-lab/renders/b/v1/b-desktop.png`, `b-tablet.png`, `b-mobile-dpr1.png`, `states/*.png` |
| Fresh crops (this critique) | `design-lab/renders/b/crit/{d,t,m}-fold.png`, `d-work.png`, `d-dg-001.png`, `d-dg-002.png`, `d-process.png`, `d-join.png`, `m-work.png`, `m-dg-002.png`, `m-process.png`, `t-work.png` |
| Anchor bug shot | `design-lab/renders/b/crit/d-anchor-dg-002.png` |
| Motion recording | `design-lab/renders/b/crit/b-motion.webm` (load → Fig. 1 draw-in → hover S5 → RSVP) |
| Gemini motion critique | `design-lab/critiques/b-by-a-motion-gemini.md` |
| Scripts | `design-lab/scripts/crit1-shots.mjs`, `crit1-anchor.mjs`, `crit1-anchor-shot.mjs` |

Measured by `crit1-shots.mjs` (0 console errors and 0 px horizontal overflow at all 3 widths):

| | 1440 | 834 | 390 |
|---|---|---|---|
| Page height | 5 740 px (6.4 screens) | 8 472 px | 11 331 px (13.4 screens) |
| `#join` starts at | 4 604 px | 6 760 px | 9 244 px (≈11 screens down) |
| h1 rendered size | **59.0 px** | **70.1 px** | 44 px |
| Min SVG text height | 12 px | 12 px | **10 px** |
| Links/buttons < 44 px tall | 13 (Fig. 1 blocks 33 px, ledger links 32 px, footer links 24 px) | 13 | 13 (Fig. 1 blocks **27 px**) |
| Visible unfinished marks | `______` ×14, `[confirm]` ×6, `[placeholder]` ×5 = **25** | same | same |

---

## 1. Hierarchy

| # | Finding | Evidence | Sev | Suggestion (B's own style) |
|---|---|---|---|---|
| H1 | **The thesis barely outranks the section heads.** h1 is 59 px at 1440 and section h2 is 48 px, a 1.23 ratio. Condensed caps carry 6 levels (h1, h2, record display, rail names, chain labels, footer vision), so the thesis isn't the page's one signature move. Fig. 1 (7 of 12 columns, framed) out-weighs it. | `b.module.css:63` (`clamp(44px, 4.1vw, 68px)`), `:77` (h2 `clamp(30px, 3.4vw, 48px)`), `d-fold.png` | high | Keep caps and condensed, and set a real drawing-title scale: thesis ≈ 88–104 px at 1440 (2 lines over the full 12 columns, Fig. 1 below it, or the thesis spanning the top of a 12-column title band), and drop h2 to 36–40 px. Rail names and chain labels (`:521`, `:281`) move to Plex Sans 600 so only titles use the condensed caps. A drawing has one title. |
| H2 | **Heading semantics and visual weight are inverted in records.** The `<h3>` is the 17 px strip title. The real visual headline ("SEVEN SUBSYSTEMS. ONE PHONE.") is a `<p class="h2">`. Screen readers get the small label, and the eye gets the big unlabeled line. | `page.tsx:146`, `:205` (p), `:395` (h3), `b.module.css:410` | med | Make the condensed display line the `h3` and turn the strip into a metadata row (ID · title · status), the same way a sheet header sits above the drawing title. |
| H3 | **Each project's facts appear twice before the drawing.** The ledger states problem, needs, cycle and status, then the record restates all 4. On mobile that's ≈2 extra screens before §02. | `d-work.png` vs `d-dg-001.png`; `m-work.png` | med | Treat the ledger as the drawing index: keep ID · title · status · glyph, and let the record own problem/needs/cycle. On <700 px, put the DG-001 subsystem register inside a native `<details>` ("Subsystem register: 7 rows"). That's documentation-native and works without JS. |
| H4 | **The fold has 165 px of dead space under the meta table** at 1440×900, while Fig. 1 runs to 735 px. | `d-fold.png` | low | Top-align the left column to the figure's caption baseline, or pull the meta table into the figure's caption row as a title-block strip. |

## 2. Typography

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| T1 | **The desktop thesis is smaller than the tablet thesis** (59 px at 1440 vs 70 px at 834). The 600–1023 override scales up while the ≥1024 rule scales down. | `b.module.css:63` vs `:69`; `t-fold.png` vs `d-fold.png` | med | Use one monotonic clamp, e.g. `clamp(44px, 6.6vw, 104px)`, and re-check the 3-line limit at 1024. |
| T2 | **SVG text renders at 10 px on mobile** (Fig. 1 compact, Fig. 2 ref/detail). That's below B's own 12 px floor for mono labels. | measured min 10.0 px at 390; `InterfaceMap.tsx:55` (`fs = 10`), `SignalChain.tsx:67,79` (`fontSize={10}`) | med | The compact map already uses short labels (`scrubberLabel`), so raise compact `fs` to 12 and widen the block column. Fig. 2's vertical layout has room for 12 px detail text. |
| T3 | **Plex works.** One superfamily, `next/font/google`, and caps limited to 3 lines. It needs no font-licence exception (A does, for Fontshare). | `layout.tsx:11-32` | — | Keep. Credit. |
| T4 | Mono labels are 11 px uppercase across 7 `dt` families. That's legible, but there are so many of them that the records read as a uniform field of caps (Gemini v1 flagged "border fatigue", and this is the type half of it). | `b.module.css:190-193` | low | Drop caps on value cells (already lowercase) and keep caps only on keys, as now. Then halve the key count per record by merging Partner/Repo/Outcome into one "Release" row. |

## 3. Distinctiveness

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| D1 | **The figures are unmistakably B. The chrome isn't.** Mono caps labels, hairlines, dot grid, square status glyphs and a sticky numbered nav are the shared "technical-minimal / Carbon docs" genre. Remove Fig. 1–3 and the page could belong to any dev tool. | `d-work.png`, `d-join.png`, `d-process.png` | med | Push the figure grammar into the chrome, not more cosplay. Draw the §02 rail with the same wire weights, pins and orthogonal routing as Fig. 1 (it currently uses heavier CSS borders and squares), and draw the seat register's "OPEN" cells as the Fig. 1 owner nodes. One line language from hero to footer. |
| D2 | **Cross-concept: the unsigned device.** B uses `______` 14 times ("Owner" column ×7, Built by ×2, DG-003 Problem/Built by/Cycle, §02 owner bar, footer DRAWN BY), plus "Unsigned" as DG-003's title, "This row is unsigned." and a "Signed" column. **The red "needs a person" system is earned. The underscore lines and "signed" vocabulary aren't.** Redline marks for open handoffs and seats come from engineering review, and B gave them one meaning. The blank signature line is a print and contract gesture: A's idiom, seeded to all 6 concepts, and it's generic here. A real drawing doesn't leave DRAWN BY blank; it reads unfinished. Credit: B did **not** use the shared "Put your name on one" close. "Take a subsystem." is better and specific. | `page.tsx:191`, `:264`, `:269-270`, `:325`; `copy.ts:116-119`, `:140`, `:165`, `:182`, `:193`, `:232` | high | **Do what only B can: put ownership inside the drawing.** Make owner a property of each Fig. 1 node, computed: unowned subsystem blocks get B's dashed-red outline, handoff tags stay red until a reviewer exists, and the figure header reads `7 subsystems · 10 parts · 4 handoffs · 0 owners [confirm]`. "Your name" then has a coordinate in a real drawing. Replace `______` with the engineering state `UNASSIGNED` in red mono (or B's dashed glyph). Rename DG-003 "Open slot" or "Unassigned". Fill DRAWN BY with something true (`DIGITAL design lab [placeholder]`) or drop the cell. An optional, very B move: a drawing balloon callout from the word NAME in the thesis to the S1 owner field. |
| D3 | The status glyphs and the computed signature glyphs (7×10 incidence matrix, 11-pulse gate train) are the most original small marks in any concept. They're hidden below 1024 px. | `b.module.css:608-609`, `Glyphs.tsx` | low | Show them on tablet and mobile in the ledger's code cell. They're 50×35 px and data-true. |

## 4. Usability

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| U1 | **The project index jumps under the sticky nav.** Clicking a ledger row (`#dg-001`…`#dg-003`, `#vs`) lands the record strip (ID, title, status) at 13 px, under the 56 px nav, at 1440, 834 and 390. The visitor arrives at "ONE WORD AT A TIME." with no idea which record they're in. `.record` has no `scroll-margin-top` (only register rows do, `:469`). | `crit1-anchor.mjs` output; `d-anchor-dg-002.png`; `b.module.css:400` | high | `.record { scroll-margin-top: 72px; }`. One line, and it makes the index work like a real drawing index. |
| U2 | **"Take a subsystem" never knows which subsystem.** §02 lets you select S4, but every CTA goes to the generic `/contact?type=project-team`. | `copy.ts:48`, `:57`, `:220`; `BuildRun.tsx:273-289` | med | Add a per-subsystem CTA in the §02 side panel: "Take S4 Operating System" → `/contact?type=project-team&subsystem=operating-system`. Whether the production form reads the extra param is unverified, so mark it [confirm]. Sync the selector to the URL hash (`#run-s4`) so a lead can send someone a link to their subsystem (web-design-guidelines: "URL reflects state"). |
| U3 | **The join path is 11 screens down on mobile** (9 244 px), and the mobile bar hides the CTA inside the INDEX disclosure. | `m-fold.png`, measurements table; `b.module.css:155` | med | Show a compact "Take a subsystem" button in the mobile bar (verify wordmark + INDEX + CTA fit at 360 px with 44 px targets), plus H3's `<details>` register. |
| U4 | **Touch targets under the 44 px BRIEF §42 rule.** Fig. 1 blocks are links at 27 px tall on mobile and 33 px on desktop. Ledger row links are 32 px. | measured; `b.module.css:366`; `schematic.ts` compact block height | med | Make the compact node height ≥44 viewBox px (the map is 1:1 at 390), or wrap each node in a transparent 44 px hit-rect. Set `.rowLink { min-height: 44px }`. |
| U5 | The §02 selector is a horizontal-scroll strip on mobile. Only 2 of 7 tabs are visible, and the third is cut at the edge. | `m-process.png` | low | Use a 4+3 grid of ref-code buttons (`S1`…`S7`, 44 px) with the selected title printed in the owner bar below, like a sheet selector. |

## 5. Brand fit

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| B1 | **The page speaks to engineers only.** §20 positions DIGITAL as multidisciplinary (business, design, product, data, science). DG-001's "Needs" column lists *subsystems* (`systems · hardware · firmware · os…`), not disciplines, while DG-002's lists disciplines. That's the same column with two meanings. A business or design student finds "subsystem", "handoff", "G1", "H1–H4", "P01" and only Venture Studies, which B itself admits gets the least weight (concept-b.md, Risk 2). | `copy.ts:85` (`needs: subsystems.map(…scrubberLabel)`) vs `:96`; `d-work.png`; §03 lede "Bring engineering, computer science, design, or business." | high | **B should own the IA's subsystem × discipline matrix** (CONTEXT-PACK §2, beat 4). It's an incidence matrix, B's native figure, and the DG-001 glyph is already one. Rows S1–S7, columns ME EE SW DS ID VN…, cells derived from the subsystem descriptions and marked [confirm] until the leads verify them. Then "Needs" lists disciplines for every row. Add a one-line gloss in the Fig. 1 caption: "Subsystem: one part of the phone one person owns." |
| B2 | The voice fits BRAND.md: declarative, verbs, honest status ("Status is what's true today, not what's planned."). Red-as-redline is the best-argued accent choice in the lab. | `copy.ts:76`; concept-b.md §Color | — | Keep. |
| B3 | 25 visible unfinished marks read as "unfinished site" more than "honest status" (concept-b.md, Risk 4). | measurements table | med | Use the documentation convention: number the open items (`TBD-1`…`TBD-6`) in place and list them once in the footer title block as "Open items: 6 [confirm]". The honesty stays, and the noise drops. |

## 6. Project storytelling

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| S1 | **The mechanism is told brilliantly; the why is told in one line.** The computed handoffs (`page.tsx:20-36`) carry from Fig. 1 into §02 ("H1 midframe → review with S6 Mechanical / CAD"), which no other concept does. But DG-002's human reason, "Built with dyslexic readers in mind", sits at the end of the Object field at 17 px. | `d-dg-002.png`; `copy.ts` dg002.object | med | Give each record a one-line "Requirement" row at the top of the fields, in spec language: "REQ-1 · A reader keeps their place without moving their eyes." Engineering docs start from requirements, and that's where B can tell the why without editorial prose. |
| S2 | **A third of each record's top band is an empty hatched photo plate** (4 of 12 columns, 312 px tall at 1440), and DG-001's record has no figure of its own (Fig. 1 is back in the hero, above the whole ledger). | `d-dg-001.png`, `d-dg-002.png`; `page.tsx:164`, `:223` | med | Put a computed figure in that slot. For DG-001, that's the incidence matrix enlarged, or a highlighted re-render of Fig. 1. Shrink the photo to a "Photo log · 0 entries [placeholder]" row in the fields list. Documentation lists missing photos instead of reserving a hero frame for them. |
| S3 | Fig. 3 (RSVP timing: slot = 60 000 / 450 = 133.3 ms) is the best explanation of DG-002 in the lab. Gemini v1 called it "a masterclass" and I agree. | `RsvpTiming.tsx`; `d-dg-002.png` | — | Keep. See M1 for its playback. |

## 7. Responsiveness

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| R1 | Clean overall: 0 px overflow at 3 widths. The register becomes cards at <700 px. The rail turns vertical. Fig. 1 has a real compact layout, not a scaled one (Gemini v1's "scaled down" claim is out of date). | `m-process.png`, `t-fold.png`, `b-mobile-dpr1.png` | — | Keep. |
| R2 | T1 (tablet thesis > desktop thesis), T2 (10 px SVG text), U3 (CTA hidden on mobile) and U4 (27 px map targets) are the responsive defects. | above | — | See those rows. |
| R3 | Fig. 3's plot needs horizontal scrolling inside its frame on mobile (`min-width: 560px`), with no visible affordance. | `b.module.css:309-310` | low | Under 600 px, wrap the 11 slots onto 2 rows (6 + 5) on the same time axis, or add a fade edge plus a "scroll →" mono hint. |

## 8. Implementation feasibility

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| F1 | **Highest feasibility in the lab.** It has no animation library, no WebGL and no external fonts. The generator in `schematic.ts` is reusable, so new data means a new drawing. It's static-export safe and readable without JS (DA-B: 89 SVG paths with no JS). | `schematic.ts`, `layout.tsx` | — | Keep. |
| F2 | **Styling convention.** The page is a 615-line CSS Module. CLAUDE.md says "component-level styles use Tailwind utility classes". CSS Modules aren't CSS-in-JS, so this isn't banned, but it needs a port or a recorded exception. | `b.module.css` (615 lines) | med | Port the tokens to `tailwind.config.ts` under a `b-` namespace and keep the SVG classes as a small module. Flag it to the Head Designer as a convention decision. |
| F3 | Fig. 1 depends on unconfirmed part names (`activePartIds` is the build page's illustration model, not a BOM). The page says so. | `copy.ts:69`; concept-b.md Risk 1 | med | Keep the caption. Before production, have the phone leads sign off on the part list. That's one data edit, and the drawing regenerates. |
| F4 | Global chrome is hidden with `body:has(#lab-b)`. It's brittle, but it's lab-only. | `layout.tsx:38-42` | low | Production: add the route to `lib/immersiveRoutes.ts`. |

## 9. Motion quality (§34)

Recording: `renders/b/crit/b-motion.webm`. Gemini: `critiques/b-by-a-motion-gemini.md`. Note that Gemini says the hovered wires turn "red". That's wrong: they go to 2.5 px ink, and the others dim to 20% (`states/hover-s2.png`, `b.module.css:253-254`).

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| M1 | **The RSVP readout free-runs forever.** It swaps a high-contrast word every 133 ms (7.5 Hz) and loops while visible, next to the record's body copy. A pause control exists (WCAG 2.2.2 passes) and reduced motion is honored. But it's the page's only constant motion, it competes with reading, and Gemini calls it "strobing". | `RsvpTiming.tsx:204-207` (autoplay), `:218-222` (modulo loop); `b-motion.webm` 00:04–00:07 | high | **Make it a single-shot trigger, like a scope.** On first entering view, play one pass (11 words, 1.47 s), then hold on "look." with every slot lit in the plot and a `▶ Run again` button. That's still real timing and still B, but it stops. |
| M2 | Fig. 1 draw-in (700 ms per wire, 45 ms stagger, removed at 1.6 s) is the right single focal motion. On mobile, Fig. 1 starts at 675 px in an 844 px viewport, so most of the draw happens below the fold, unseen. | `InterfaceMap.tsx:23-28`; `m-fold.png` | low | Arm the draw with an IntersectionObserver (≥40% visible), the same pattern RSVP already uses. |
| M3 | The hover trace (invert the block, thicken its wires, dim the rest) is the best interaction-as-explanation in the set. | `states/hover-s2.png` | — | Keep. Optionally give the 4 shared parts a red pin on trace, so the handoff reads during the hover too. |
| M4 | There are no `:active` states (§7 Taste lens: tactile feedback), and no reduced-motion block for the 120 ms colour transitions, although concept-b.md says "global CSS kills transitions". | `b.module.css` (no `:active`; only `@media (prefers-reduced-motion: no-preference)` at `:259`) | low | Add `.btn:active { transform: translateY(1px) }` (B has no springs, so that's enough). Either add the `reduce` block or correct the spec. |

---

## web-design-guidelines audit (Vercel `command.md`, fetched 2026-10-02) applied to `app/design-lab/b/`

Used as an auditor (§6). I'm not flagging conventions B breaks on purpose: uppercase mono buttons instead of Title Case, and `aria-pressed` toggles instead of tabs.

```text
## app/design-lab/b/b.module.css
b.module.css:400 - .record anchors lack scroll-margin-top → sticky nav covers record strip (U1)
b.module.css:366 - .rowLink min-height 32px (<44 BRIEF §42)
b.module.css:237 - .mapLink:focus outline:none; replacement exists via state, but no-JS :focus-visible sets .ref fill to surface on a surface block (:239) → ref text vanishes
b.module.css:259 - only no-preference motion block; no reduce block for transitions (spec claims one)
b.module.css - no :active states; no touch-action: manipulation; no -webkit-tap-highlight-color
b.module.css:309-310 - plot min-width 560 → hidden horizontal scroll on mobile

## app/design-lab/b/BuildRun.tsx
BuildRun.tsx:223 - aria-live="polite" on whole panel → announces ~100 words per tab press; use a one-line sr-only summary
BuildRun.tsx:249,256 - aria-label on generic <span> (gate G1/G2) is not exposed; use sr-only text or role="img"
BuildRun.tsx:199 - selected subsystem not in URL (useState only); sync to hash

## app/design-lab/b/ProjectIndex.tsx
ProjectIndex.tsx:73 - filter state not in URL (low; 4 rows)
ProjectIndex.tsx:95 - ✓ live region for counts

## app/design-lab/b/RsvpTiming.tsx
RsvpTiming.tsx:204-207,218-222 - autoplay loops indefinitely; pause ✓, reduced-motion ✓; make single-shot (M1)

## app/design-lab/b/InterfaceMap.tsx
InterfaceMap.tsx:55 - compact SVG text 10px rendered at 390
InterfaceMap.tsx:23-28 - draw-in runs on mount, not on visibility

## app/design-lab/b/SignalChain.tsx
SignalChain.tsx:67,79 - fontSize 10 SVG text

## app/design-lab/b/page.tsx
page.tsx:41,348 - <header>/<footer> render inside root <main id="main-content"> (app/layout.tsx:81) → no banner/contentinfo landmarks; skip link lands on B's nav
page.tsx:146,205 - visual headline is <p>; h3 is the 17px strip (H2)
page.tsx:308-311 - ✓ target=_blank with rel + sr-only "(opens in a new tab)"
page.tsx:394 - DG codes: consider translate="no" (low)

## app/design-lab/b/layout.tsx
layout.tsx:11-32 - ✓ next/font, display swap
layout.tsx - no <meta name="theme-color"> matching #f2f2ee (low)

## app/design-lab/b/copy.ts
copy.ts - ✓ curly apostrophes, no "...", numerals for counts
copy.ts:85 vs :96 - "Needs" column mixes subsystems and disciplines (B1)
```

Pass: no `transition: all`, no `<img>`, no div-click handlers, icons `aria-hidden`, `text-wrap: balance`/`pretty` on headings and body, no zoom blocking.

**Taste (§7) note:** Its anti-card rule ("at high density use `border-t`/`divide-y`, not boxed containers") matches Gemini v1's "border fatigue". B frames figures, records, seats and the run diagram as 1 px ink boxes, so the boxes stop meaning "this is a drawing sheet". Reserve the ink frame for figures, and group records with a 2 px top rule. I'm ignoring Taste's default "perpetual micro-animations" and "spring physics" advice: it contradicts B's correct "inspect, don't animate" stance.

---

## Top 5 fix-now

1. **Add scroll-margin-top to project records.** The ledger jumps hide the ID, title and status under the nav (`b.module.css:400`).
2. **Make RSVP single-shot, then hold.** Play one 1.47 s pass, hold on the last word, offer "Run again" (`RsvpTiming.tsx:204-222`).
3. **Put ownership inside Fig. 1.** Replace the 14 `______` lines with computed unassigned nodes and red `UNASSIGNED` (D2).
4. **Build the subsystem × discipline incidence matrix.** Fix "Needs" (`copy.ts:85`) and give non-engineers a door (B1).
5. **Give the thesis one real drawing-title scale.** About 96 px at 1440, h2 at 40 px, and fix the tablet > desktop inversion (`b.module.css:63-69`).
