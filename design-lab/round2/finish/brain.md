disposition (signal): fix
disposition (apple): fix

Unread or not applicable: no comp, no QUALITY BAR card, no `.impeccable/build/` (code-led; packet confirms). Prior critiques (`design-lab/round2/critiques/brain.md`, `system.md`) and the `_brain` demo sources were not read; the review stands on the 2 contracts, `_content/brain.ts`, both `page.tsx` files, the research doc, the craft floor and 27 of the 76 step captures plus both gate3 desktop full-pages.

Evidence note (check 0, passed): all 12 named full-page captures exist (v2 + gate3, desktop 1440 / tablet 834 / mobile 780@2x) and all 70 steps sit at 1440x900 or 390x844. The full-page shots show long empty bands below each chapter. These are the sticky-pin runways rendered at document scale, not capture faults, and the per-viewport steps show the pinned content. I accepted the full-page shots for structure and judged content from the steps.

---

## persistence

**Pass, both worlds.**

1. `PRODUCT.md` and `DESIGN.md` are at the worktree root. Contracts are at `.impeccable/surfaces/app-design-lab-r2-{signal,apple}-brain-page-tsx.md`.
2. The build is code-led, so there is no `state.json`, spec, plates or comp round. Nothing under `.impeccable/mocks/` needs an approval record.
3. **Signal:** FORM carries seed key `0a795440` (roll index 3). The packet corroborates it ("roll, seed 0a795440"). `.impeccable/decision-r2.json` does not contain the string, so the packet is the only corroboration.
4. **Apple:** FORM is canon ("Apple product page played straight"). It is not a roll, so it has no seed key, and the packet confirms this.

## fidelity

There is no approved comp. TYPE and MATERIAL are judged against OWN-WORLD. GROUND is judged against the hex value OWN-WORLD names.

### Signal Capture (`/design-lab/r2/signal/brain/`)

| Element | State | Evidence |
|---|---|---|
| TYPE | match | Hubot Sans wide heavy display (h1 72px, h2 about 52px), Krypton mono readouts. No system face. `signal-1440-step00.png` |
| MATERIAL | match | Bone dots and 1px traces on hairline-framed graticule screens. No fills, radii, bevels or faked physicality. `step03`, `step06`, `step08` |
| GROUND | match | Near-black, neutral-warm, consistent with `#0b0c0a`. No drift toward blue-black. All steps. |
| First viewport: h1 + lead + framed orb + trace + Run again | match | `step00`: "CH3 · BRAIN · RUN 01/03", "TRIG · AUTO ×3", trace lit on `tool_call`. Run again sits under the stage, not in the left column (acceptable). |
| Timebase rule with chapter ticks "carrying every line" | **contradicted** | Only the hero tick (T+00) and close tick (T+07) sit on the rule. Chapter ticks T+01 to T+06 and "T+05 · CODA" render as 12px mono labels above each h2/h3 in the text column (`step04` y=524, `step06` y=347, `step08` y=347, `step09` y=644; `.tickInline` in `brain.module.css:61`). That is a kicker/eyebrow (floor ban), and it duplicates the stage readout "CH3 · 0n …". |
| 6 chapters + harness coda | match | Loop, Tools, MCP, Context, Harness (+coda), Evals, in line with the Head Designer decision. |
| Framed-screen grammar on every stage | **contradicted** (coda) | The coda stage is unframed. Its "ILLUSTRATIVE · METER" label is pushed to x=122 and is struck through by the timebase rule at x=128 (`step09`). |
| MCP transport picture | **contradicted** (faithfulness) | The remote server label "Issue tracker · Streamable HTTP" starts inside the dashed "this machine" boundary and overlaps the host ring (`step04` x=995 y=625; `signal-390-step05`). The glyph is outside the boundary but the label reads as local. |
| Signature interactions (gate approve/deny, server toggles, window strategies, k slider) | adaptation, partly unseen | Present in code. The tool picker appears in `step03`. ChapterPin shows `data-late` controls only for pin progress 0.3 to 0.9 and then **hides them again** (`ChapterPin.tsx:21,56`), so the control is absent in `step05`, `step07`, `step08`, `step10` and `step11`. The THESIS says "the visitor can re-arm it by acting", and a control that withdraws while its stage is still on screen breaks that promise. |
| Evals legend | **contradicted** | The stage reads "solid = pass · dashed = fail", but no solid or dashed marks are visible under the lattices (`step10`, `step11`). Apple renders them (`apple-1440-step13`). |
| Red discipline | match | No page red at 1440. The held-call red appears only at the gate (`signal-390-step09`). |
| Close (BRAIN mark + JoinChapter) | match | All facts carry `[confirm]` (`step14`). |
| Dead runway between pins | added without approval | About 350 to 450px of empty ground with only "HOW IT WORKS +" floating mid-column after every pin (`step02`, `step04`, `step07`, `step09`, `step11`). This is the main source of the 14.0 vh length. |

### Apple product page (`/design-lab/r2/apple/brain/`)

| Element | State | Evidence |
|---|---|---|
| TYPE | match | Geist 600, centred, with scale steps 80, 56 and 21. `apple-1440-step00`, `step04`, `step11` |
| MATERIAL | match | Dot-engine stages are the only imagery, pill segmented controls, no trade-dress fakery. |
| GROUND | match | `#000` dark chapters, then a light `#f5f5f7` / white close (`step15`). |
| First viewport: local nav + h1 + orb + one grey line | **contradicted** | At 1440x900 the hero clip fills to the fold. The stage key "1 dot ≠ 1 token · illustrative" is clipped at y≈895, and the trace row and the lead line fall below the fold (`step00`, `step01`). The promised line beneath the orb is not in the first viewport. |
| Hero at 390 | **contradicted** | The trace row overflows both screen edges: "evaluate" is clipped at x=0, "evaluate" is cut at the right, and "done" wraps off-screen (`apple-390-step00`). |
| Highlights strip "Six ideas. One system." | **contradicted** | Each snap card is about 820x500 at 1440 and holds a 64px glyph in a `#1a1a1a` rounded rectangle. That is an empty soft card standing in for content (floor), and nothing like the product-page highlight it imitates (`step01`). Going from 8 cards to 6 is a cited adaptation (6-chapter decision). |
| Chapter pins, headline + stage + caption + control | match | The harness pin shows caption, readout "Read and Grep pass. Edit approaches." and Approve (Enter) / Deny (Esc) pills (`step11`). It has the same reveal-then-hide behaviour as Signal. |
| One scrubbed asset (brain-context, ch4) | match / **contradicted** (red) | The scrub is present, with readout "Summary kept" (`step08`). The clip draws its own red "now" dot at (782,431). OWN-WORLD allows red only on the CTA hover and the gate's held call. The build log discloses this as deferred, so it is still open. |
| MCP transport picture | **contradicted** (faithfulness) | Same label fault as Signal: "Issue tracker · Streamable HTTP" sits inside "this machine" and over the host ring (`apple-390-step06`). |
| Illustrative tags | match | "Illustrative: shapes / belt / slots / arcs / scramble" are under each metaphor stage. |
| Close (light) | match | `[confirm]` on the thesis and on the facts. |

### Truth (both worlds)

**Pass.**

1. Every mechanism line in `_content/brain.ts` traces to `agentic-storytelling.md` §1:
   - loop and `error_max_turns` (S5)
   - parallel read-only vs sequential state-changing tools (S5)
   - one client per server, stdio vs Streamable HTTP, `server/discover`, opt-in best-effort `list_changed`, sampling/logging deprecated at 2026-07-28 (S1)
   - six permission modes and the hook names (S5, S6)
   - pass@k / pass^k with the independence caveat (S9)
2. No line claims that DIGITAL teaches, built or runs MCP or harness infrastructure, and nothing presents a curriculum. "BRAIN builds software with agentic tools" is a usage claim and carries `[confirm]` in both worlds. The metaphors are labelled.
3. One wording risk: "a grader … checks the end state, not the reply text" matches research line 108, but model graders can also read transcripts (S9 lists transcript as a grader input). Softening it to "checks the outcome, the real end state" stays faithful.

### Craft floor (both worlds)

1. Signal chapter ticks above headings are kickers. This is a ban and is listed in material fixes.
2. The Apple highlight cards are empty soft rectangles. Listed in material fixes.
3. The shared JoinChapter label "BACK A BUILD" sits above the sponsor links as a mono eyebrow (Signal `step13`). It is shared chrome and outside this scope, so it goes to later.
4. No gradient text, glass, offset shadows, glyph icons or system display faces were found.

## ceiling

1. **Signal: the trigger metaphor stops after the hero.** "TRIG · AUTO ×3", "RUN 01/03" and the armed/halted state appear only in the first viewport. The chapter screens never show ARMED, TRIGGERED or HALTED in their readouts, and no chapter stage shows the "halt, then re-arm by acting" beat. The world's signature device is used once.
2. **Signal: the timebase rule is unused as a carrier.** The 1px rule runs the full page, but only 2 of its 8 ticks sit on it, so it reads as a margin line rather than an instrument.
3. **Apple: the highlights strip has no imagery.** The canon device for that strip is media-led cards (the product shot carries the card). Here the live dot stages or clip posters are the obvious media, and they are not used.
4. **Apple: the hero clip is cropped to the fold.** Apple hero framing shows the object whole, with its single line under it, inside the first viewport. The clip is scaled one step too large to do that at 900px.

## material_fixes

**Signal Capture**

1. Move chapter ticks T+01 to T+06 and "T+05 · CODA" onto the timebase rule, as the hero does with `.tick` on grid column 1 and a leader. Delete `.tickInline` above the h2/h3. Evidence: `signal-1440-step04` y=524, `step09` y=644, `brain.module.css:61`. Basis: floor (eyebrow ban) and OWN-WORLD ("timebase rule … carries every line").
2. Fix the MCP remote label in the shared `McpDemo`, which affects both worlds. Anchor "Issue tracker · Streamable HTTP" beside its glyph outside the dashed "this machine" boundary, clear of the host ring. Evidence: `signal-1440-step04` x=995 y=625; `apple-390-step06`. Basis: truth, because the picture currently reads remote as local.
3. Stop hiding `data-late` caption, readout and control after pin progress 0.9 in `ChapterPin.tsx:21,56` (both worlds). Once revealed, they stay until the pin releases. Evidence: no control at `step05`, `step07`, `step08`, `step10`, `step11` while the stage is still on screen. Basis: THESIS ("re-arm it by acting") and keyboard demos.
4. Frame the coda as a graticule screen with its own corner readout, and move "ILLUSTRATIVE · METER" into that frame, off the rule. Evidence: `step09`, label at x=122 crossing the rule at x=128. Basis: OWN-WORLD ("screens are hairline-framed").
5. Render the evals pass/fail line marks (solid or dashed under each lattice) in Signal ink, or remove the legend. Evidence: `step10` and `step11` show the legend with no marks. `apple-1440-step13` shows the marks.
6. Bring the page to ≤13 vh at 1440 (now 14.0 vh, 12,586px). Cut runway, not chapters: `.capture --pin` 150vh to about 125vh, and place "How it works" directly under the caption so the empty band after each pin disappears. Evidence: `step02`, `step07`, `step11`. Basis: contract constraint "≤1,300 vh at 1440".

**Apple**

1. Fix the hero first viewport at 1440x900. Scale the clip down so the stage key, the trace row and the 21px lead all land above y=900. Evidence: `apple-1440-step00` key clipped at y≈895, lead at `step01`. Basis: FIRST VIEWPORT.
2. Contain the hero trace row at 390. Let it wrap centred inside the 16px gutters, or show only the live verb. Evidence: `apple-390-step00`, clipped at x=0 and at the right edge.
3. Apply the same MCP remote-label fix as Signal fix 2 (shared component).
4. Rebuild the highlight cards so media fills them, using the chapter's dot stage at rest or a still poster from the clip. A 64px glyph in an 820px card is not acceptable. Removing the strip is also an option; see the page-length note below. Evidence: `apple-1440-step01`. Basis: floor (soft rectangles standing in for content) and ceiling.
5. Remove the red "now" dot from the brain-context clip, or re-render it in `#f5f5f7`. Evidence: `apple-1440-step08` (782,431). Basis: OWN-WORLD red rule. The build log lists this as deferred, so it is still open.
6. Apply the same ChapterPin reveal fix as Signal fix 3.
7. Bring the page to ≤13 vh at 1440 (now 16.4 vh, 14,720px):
   - `.chapter --pin` 150vh to about 115vh: −175vh
   - `.chapterB` 125vh to about 100vh: −25vh
   - drop the highlights strip, which repeats the six chapter headlines: about −95vh
   - total ≈ −2.95 vh, which still leaves about 13.4 vh against the 13 vh cap, so trimming the strip and pins alone is not enough to close the gap.

**Page length (Head Designer question).** Hold the contract's ≤13 vh (1,300 vh) in both worlds. The overage is pin runway and dead air (`signal-1440-step02`, `step07`; `apple-1440-step01`), not content. All 6 chapters fit under the cap once the runway is cut. Signal reaches it with fix 6. Apple loses about 2.95 vh with fix 7 and still lands about 0.4 vh over 13 vh, so it needs one more cut beyond fix 7 before it meets the cap. Merging chapters would reopen the 6-chapter decision and is not needed.

**Later**

1. Soften the evals grader line: "checks the outcome (the real end state)".
2. The shared JoinChapter "BACK A BUILD" mono eyebrow (Signal close). This is outside BRAIN scope and belongs to the chrome owner.
3. Carry ARMED, TRIGGERED and HALTED states into the Signal chapter readouts (ceiling item 1).

## keep

Do not dilute these while fixing:

1. The 6-chapter structure, one mechanism per viewport.
2. The source-faithful copy in `_content/brain.ts`, with `[confirm]` on every BRAIN fact and illustrative labels on every metaphor.
3. Signal's bone-on-near-black framed graticule screens with live mono readouts.
4. Apple's centred black product-page chapters with the Approve (Enter) / Deny (Esc) gate as the signature moment.
