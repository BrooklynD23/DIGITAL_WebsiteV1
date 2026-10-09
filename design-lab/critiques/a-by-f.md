# Critique: Concept A "The Signed Edition", read by F (CRIT-6)

Verdict: **A is the best-typeset page in the lab and the safest one.** The desktop cover and the RSVP plate are real wins.
Three things hold it back. On a phone the cover shrinks to a heading. The blank "Built by" line is printed 17 times and never
does anything. DG-001 tells its story 3 times while its largest figure is an empty photo plate. Every fix below stays in
A's print grammar. None of them adds drag-and-drop, stickers or a name field, because that is F's language, not A's.

Lens: F ("The Bench": the page is a task, not a brochure) critiquing A per ORIGINAL_PROMPT §35 (9 axes), §34 (motion),
§6 (audit as auditor, not homogenizer), §7 (Taste skill). Copy suggestions are exploratory and still need
brand-voice-strategist → brand-guardian.

## Evidence used

| Source | Path |
|---|---|
| A's renders (1440 / 834 / 390) | `design-lab/renders/a/v1/a-{desktop,tablet,mobile}.png` |
| Readable bands cut from those | `design-lab/critiques/a-by-f/desk-0..8.png` (1100px bands), `mob-sheet-1..3.png` (390px, 3 bands each) |
| Fresh fold + motion captures | `design-lab/critiques/a-by-f/fold-desk.png`, `fold-mob.png`, `load-sheet.png` (150 / 600 / 1200 / 2200 ms), `load-desk-reduced-150ms.png`, `rules-desk.png`, `tab-and-reduced.png`, `scroll-desk.webm` (12 s) |
| Probe script (read-only) | `design-lab/scripts/crit6-a-check.mjs`. 0 console errors at 1440 and 390 |
| Gemini motion critique of the webm | `design-lab/critiques/a-by-f/gemini-motion.md` |
| Stitch study | `design-lab/renders/a/stitch/variant-{1,2,3}-*.png` |
| Source | `app/design-lab/a/{page.tsx,content.ts,a.module.css,layout.tsx,Figures.tsx}` |

Measured facts (from `crit6-a-check.mjs`):
- **1440×900.** Thesis spans y 164–620 at 161px. Only the masthead CTA is in the first viewport. "See the work" and most of Fig. 1 sit below the fold. Page height is 9,247px.
- **390×844.** Thesis spans y 165–288 at 43.7px, so it fills 15% of the first screen. The first "Take a subsystem" (`#join`) starts at y 9,958 of 11,524. The masthead CTA is hidden at ≤640px (`a.module.css:1525-1528`).
- **Repetition.** "Systems Architecture" appears 3× in desktop body text (Fig. 1 label, parts list, fit column) and 2× on mobile.
- **Blank lines.** Desktop shows 17: 9 `signLine` elements, 7 `owner ______` lines in Fig. 1, and the hero rule.

---

## 1. Hierarchy

| # | Finding | Evidence | Sev | Suggestion (in A's style) |
|---|---|---|---|---|
| H1 | The phone cover is not a cover. At 390 the thesis is a 44px, 3-line heading. The kicker wraps to an orphaned "POMONA", the footnote mark is 6px, and the "×" is 11px. The page's one big idea reads like a section title. | `fold-mob.png`; `a.module.css:353-362` (`.fnMark` 0.14em), `:369-378` (`.signX` 0.26em) | **high** | Crop the phone cover like a poster. Set one or two words per line (Make / something / worth¹ / putting / your / *name* / on.) at ~19–22vw, and make *name* the largest line on its signature rule. Give the footnote mark and × a floor of 14px. A magazine never shrinks its coverline to fit the newsstand. It re-crops. |
| H2 | On desktop the cover band breaks at the fold. Fig. 1 is cut mid-stack, and "See the work" sits below 900px. The fold lands on a half-drawn figure. | `fold-desk.png`, `desk-0.png` | med | Either (a) trim the cover's top padding and band gap so the band's top edge, footnote and link land above the fold, or (b) treat it as a deliberate cover/inside split: thesis plus contents on the cover, with Fig. 1 opening the inside spread. Choose one on purpose. |
| H3 | Every chapter opens the same way: `NN ─── TITLE` mono + Zodiak lede, 5 times. The rhythm is correct but flat. A design annual changes its openers. | `desk-1/4/5/6/7.png`; `page.tsx:25-40` | low | Keep the numbering, which pairs with the contents list. Vary the opener scale: one full-page lede (02 already inverts), one in the margin, one cropped. |
| H4 | The glosses ("You take a subsystem.", "You own it through the test gate.") are the most human lines on the page. They are set in small muted Switzer in the margin of the night spread. | `rules-desk.png` (gloss column, x≈1096) | med | Promote the gloss to Zodiak italic at ~1/3 of the rule size, hung in the margin like a pull-quote. The rule is the law. The gloss is what it means for you. |

## 2. Typography

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| T1 | Zodiak 400 + Switzer + JetBrains Mono is the strongest type system in the lab. Display tracking −0.02em holds up at 161px. | `desk-0.png`, `desk-7.png` | (strength) | Keep it. |
| T2 | Italic has 6+ jobs: *name*, both split headlines, *Pitch the next build.*, *6:00 PM.*, the fit note and the footnote. On a page whose thesis is *name*, italic should mean one thing. | `desk-0/3/4/6/7.png` | med | Make italic mean "the open slot / you": *name*, *Pitch the next build.* and the blank bylines (see D2). Set "6:00 PM." roman and the fit note roman. The split headlines can carry their figure without italic. |
| T3 | The "Where you fit" lists are 15 items in Zodiak ~28px with a hairline under every row. At heading size, list items read like 15 headlines. | `desk-5.png`, `desk-6.png`, `mob-sheet-3.png` | med | Set them as a run-in paragraph per build ("DG-001 needs: Systems Architecture, Hardware/PCB, …") in Switzer, or as a 3-column index with no rules. Save Zodiak for things you read once. |
| T4 | Rule 04 wraps to a one-word line ("release.") at 1440. | `rules-desk.png` | low | `text-wrap: balance` on `.ruleText` (the spec already requires it for headings). |
| T5 | 2 drop caps plus a colophon plus "In this edition" drift toward the pastiche A names as risk 5. Gemini flagged the drop caps too. | `desk-2.png`, `desk-3.png`; `renders/a/v1/gemini-critique.md` fix 4 | low | Keep one drop cap, on DG-001 only, so it marks the lead story. |

## 3. Distinctiveness

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| D1 | **The unsigned device is wallpaper, not proof.** All six concepts use "BUILT BY ______" plus "Put your name on one." (seeded by CONTEXT-PACK). A has the strongest claim to it, because credits and colophons are real editorial forms. It then prints 17 blanks: Fig. 1 owners ×7, record "Built by" ×2, credits ×7, hero ×1. After the third, the blank stops meaning "open" and starts meaning "template". Nothing ever happens to a line. | DOM count above; `desk-0/2/3/6.png`; `page.tsx:53-60`, `:336-346`; `Figures.tsx` | **high** | **Earn it with fewer, more editorial blanks:** (1) keep the hero rule as the one drawn signature; (2) move "Built by" out of the record table into the **byline slot under each feature title** ("Words and build by ______"), where magazines credit people and readers look; (3) drop the owner lines from Fig. 1 (the caption already says they are blank). That takes it from 17 blanks to about 4, and each one sits where a real name would go in print. |
| D2 | "Credits" (04) is a generic role list with dotted leaders. The native editorial form already exists: **the masthead / staff box**. | `desk-6.png`; `page.tsx:333-350` | med | Rebuild 04 as a staff box: a narrow column with "Edition 2026–27" (term from `team.ts`) and roles grouped (Officers / Project leads) with the blank beside each. This is something only A can do. No other concept is a publication, so none of them can have a masthead. |
| D3 | The close "Put your name on one." is the line all 6 concepts share. | `desk-7.png`; `content.ts:181` | med | Close as an edition closes: on the colophon. For example, "The next edition prints when these lines fill." `[copy, confirm]` Then set the colophon's 21vw wordmark band as the last page of the issue. Keep "Take a subsystem" as the action. |
| D4 | **Push for risk.** The cover is still a web hero: headline, then a 3-column band. The Stitch study V1 "Monograph" (`renders/a/stitch/variant-1-monograph.png`) was more editorial than the build. | `desk-0.png` vs stitch V1 | med | Let Fig. 1 **overprint** the thesis: tuck the isometric stack into the 16% indent of line 2 (`a.module.css:345-347`) so type and drawing interlock like a real cover. Contents become cover lines in the right margin. One bold composition beats three tidy columns. |

## 4. Usability

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| U1 | **The recruiting action is 86% of the way down the phone page.** The masthead CTA is hidden at ≤640px, and the first "Take a subsystem" sits at y 9,958 of 11,524. | `a.module.css:1525-1528`; probe output | **high** | No sticky chrome is needed, because A rejects it. End the DG-001 parts list with "Take one of these seven. →" (same `/contact?type=project-team`), and make contents item 05 "Thursday" read "05 Thursday: take a subsystem". Both are print-native: a sidebar call-out and a contents line. |
| U2 | DG-003 "Propose a build" links to `/contact?type=project`, which pre-selects **"Modular Phone Project"**. The proposer lands in the wrong topic. | `content.ts:124`; `lib/data/contactTopics.ts:8,27` | med | Use `?type=general` or `?type=join` until the contact form gets a "New build proposal" topic (that is a production change, so flag it to the orchestrator). |
| U3 | The masthead label "Studio" jumps to "How a build runs" (#rules). | `content.ts:28` | low | Rename it "How it runs", or point "Studio" to the credits/staff box (D2), which is the studio. |
| U4 | Reduced motion is correct. The thesis and rule are final at 150ms, and no-JS shows the text final (A's own check). | `load-desk-reduced-150ms.png` (in `tab-and-reduced.png`) | (pass) | — |

## 5. Brand fit

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| B1 | "Four rules hold **every** build together." The 4 rules come from DG-001 only (`phoneV2.ts:295-300`, CONTEXT-PACK §1). This overclaims. F's spec lists the same scope as its own risk 3. | `content.ts:139`; `desk-4.png` | med | "Four rules hold DG-001 together." Or keep "every build" and add `[confirm]` to the lede until the club confirms the rules apply to DG-002. |
| B2 | "Come to build night. **Free to join.**" comes from DG-002's cost field (`glasses.ts:161`), here stretched to the whole org. | `content.ts:177` | low | Add `[confirm]`, or scope it: "Build night is open. No project experience required." (that line is real, `content.ts:157`). |
| B3 | The paper `#f1eee7` and ink `#15130f` sit inside Taste's "warm paper / espresso" family (`#efeae0`, `#1a1714`). With serif, drop caps and a colophon, the page leans toward literary journal or craft brand. The "engineering lab" half of the brief (§20) rests on mono labels and one diagram. | `concept-a.md` Color table; `desk-*.png` | med | Keep the paper but make the lab visible. The build records could carry a faint 4mm drafting grid, the kind found on engineering notebook paper, which is a print artifact, not a UI one. Or the night spread could show the real 4-stage rail at poster size. One engineering texture is enough. |

## 6. Project storytelling (§41)

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| P1 | **The largest image on the page is an empty 3:1 striped plate** (1328×~440px, Fig. 2), while the only real DG-001 artifact (Fig. 1) is stuck in the hero band, half below the fold. | `desk-2.png`, `desk-3.png` | **high** | Make Fig. 2 the **annotated exploded spread**: Fig. 1 redrawn at plate scale, with each layer's real description (`phoneV2.ts`) as a leader-line callout. That replaces the parts list. Shrink the photo placeholder to a one-column margin plate captioned `[placeholder]`. The hero keeps a small unlabeled stack, or none (see D4). |
| P2 | DG-001's 7 subsystems are told 3 times (Fig. 1 labels → parts list → "DG-001 needs"), which pads the page to 9.2k / 11.5k px. | probe count; `page.tsx:197-205`, `content.ts:153` | med | After P1, the fit column becomes a single line: "DG-001: any of the seven above." |
| P3 | The **RSVP plate is the best project artifact in the lab.** It is the real method, running, with real pace values and an honest caption. | `desk-3.png`, `desk-4.png`; `RsvpPlate.tsx` | (strength) | Give DG-001 an equal artifact (P1), so the two features are equally strong. |
| P4 | The records say what exists but not what a newcomer would own this term. "Built by ______" is the only door. | `page.tsx:42-64` | low | Add a record row "Open this term" listing the subsystems or needs, marked `[confirm]`. That turns the blank into a specific seat, the way a classified ad does. |

## 7. Responsiveness

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| R1 | 0 horizontal overflow at 390/834/1440 (A's check). Grids collapse cleanly, and the tablet cover (text + contents, then a large Fig. 1) is the most legible Fig. 1 of any width. | `tab-and-reduced.png`; `mob-sheet-*.png` | (pass) | — |
| R2 | The phone cover (H1) and the long phone tail are the issues. Credits are 7 × ~88px rows of empty lines, and fit is 15 rows. | `mob-sheet-3.png` | med | D2 (staff box) and T3 (run-in lists) together remove about 1,500px on phone without losing content. |

## 8. Implementation feasibility

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| F1 | Zodiak and Switzer load from the Fontshare CDN via `<link>`, and the licence forbids self-hosting. DESIGN.md §8 requires `next/font`, and Taste §3.A bans `<link>` fonts in production. | `layout.tsx:25-28`; concept-a risk 1 | med | Decide the OFL fallback now: Instrument Serif ≥56px + Instrument Sans is A's own plan, but Taste bans Instrument Serif as an LLM default (§4.1). Re-render the cover with the fallback before the Head Designer picks A, so the choice is made on the shippable face. |
| F2 | The global chrome hide (`body > nav[aria-label="Primary"], body > footer`) is brittle. | `layout.tsx:32-33` | low | In production, give the route its own layout group instead. |
| F3 | Everything else ships easily: server components, a CSS-keyframe cut reveal (no-JS safe), 3 small client islands, no WebGL, static-export safe. | `page.tsx`, `fancy/*` | (pass) | — |

## 9. Motion quality (§34)

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| M1 | The focal moment works. Gemini: "the red signature line drawing under 'name' … lands." It is meaningful, not decoration. | `gemini-motion.md`; `load-sheet.png` frame 4 | (strength) | Make it more physical: a pen stroke that slightly overshoots the rule's right end and tapers. Still `bounce: 0`, and it stays print. |
| M2 | **The thesis is not legible until about 1.2s.** At 150ms, line 3 is invisible. At 600ms, "your" is clipped and "name on." is missing. The rule finishes around 2s. The thesis is the LCP text. | `load-sheet.png` (150 / 600 / 1200 / 2200 ms) | med | Reveal by line, not by word (3 steps at ~60ms), so the sentence is readable by ~500ms. Then the rule draws as the single pause. |
| M3 | Below the fold, motion reads as near-static. The ledes' cut reveal and the proof bands fire but are barely visible at scroll speed (Gemini, with the caveat that the scroll was automated). The proof band also sits over the descenders of "path / gate / plan" at 60px+. | `gemini-motion.md`; `rules-desk.png` | low | Don't add fade-ups. Gemini suggests them, but BRIEF/CONTEXT-PACK reject content hidden until scroll. Instead, reuse the one meaningful gesture: the few remaining blank bylines (D1) draw on once when they enter, like the hero rule. Drop the proof band below the baseline (a proofreader's underline) so descenders stay clean. |

---

## Taste skill audit (Taste v2, `.claude/skills/design-taste-frontend/SKILL.md`)

Design read: *editorial / publication landing for students and faculty, print-emulating, leaning toward native CSS + a serif
display voice.* Dials for A: VARIANCE 6 · MOTION 3 · DENSITY 4 (Taste §1.B "Editorial / Blog" = 6/4/3; A is slightly calmer and denser).

| Pre-flight item (§14) | A | Note / BRIEF clash |
|---|---|---|
| Serif discipline (§4.1) | pass | The serif is justified: editorial/publication with an articulated reason. Zodiak is not on the banned list. |
| Em-dash ban (§9.G) | **fail: 5 strings** | `[ PROJECT PHOTO — … ]`, "2026–27", 3× "Project Lead — …" (from `team.ts`). **Clash:** BRIEF has no em-dash ban, and the em-dash is real editorial typography. Fix only the credits rows by setting role and project as two columns (D2). |
| Theme lock (§4.11) | partial | Night rules spread + RSVP + colophon. **Clash:** A uses paper↔night as its only depth device. Taste allows one deliberate colour-block, so the rules spread qualifies and the colophon is a footer. Accept. |
| Eyebrow count / section-number eyebrows (§4.7, §9.F) | **fail** | 6 mono labels above heads plus 4 feature kickers, against a cap of 3. Numbered `01 ─── THE WORK` is Taste's named tell. **Clash:** the numbers pair with A's contents list, which is real wayfinding. Keep the numbers and drop the repeated title word or the kicker per feature (H3). |
| Hero fits viewport / ≤2-line headline / ≤4 hero elements (§4.7) | **fail** | 3-line thesis and 7 hero elements. "See the work" is below the fold at 1440×900. **Clash:** §4.3 allows manifesto heroes, and BRIEF wants an artifact in the hero, so the line count and element count are justified. The CTA below the fold is not justified (H2, U1). |
| Middot rationed (§9.F) | minor fail | Masthead "Build night · Thu 6:00 PM · Bldg 17, Rm 1635" has 2. |
| Status dots (§9.F) | pass | ■ Active / □ Open is real semantic state. |
| Long lists / border on every row (§4.9, §9.F) | **fail on fit lists** | The fit lists (15 rows) fail. The build records also fail Taste's spec-sheet ban, but **BRIEF wins** there: CONTEXT-PACK §5 principle 2 makes the mono-metadata project record DIGITAL's own pattern. Fix fit only (T3). |
| Real images (§4.8) | n/a | **Clash:** Taste wants picsum or generated photos. BRIEF/CONTEXT-PACK forbid fake photos, so labelled plates are correct. The problem is plate *size* (P1), not the plate. |
| Hand-rolled SVG (§4.8, §9.E) | n/a | **Clash:** BRIEF §19 asks for procedural SVG of real artifacts. BRIEF wins. |
| Dark mode (§6.C) | exempt | Taste §8 exempts print-emulating editorial. |
| Icons (§3.C) | pass | Phosphor Light, one family. |
| No duplicate CTA intent (§4.5) | pass | "Take a subsystem" has one label. "Apply for a seat" and "Propose a build" are distinct intents. |
| Fonts via `next/font` (§3.A) | **fail** | Fontshare `<link>` (F1). |
| Reduced motion (§6.B) / motion motivated (§5) | pass | `load-desk-reduced-150ms.png` |
| Copy self-audit (§4.9) | minor | "on the bench" appears 3× (dek, lede, plate caption) and is close to Taste's "Currently on the bench" poetic-label tell. Keep it in the lede only. "Your proposal" as a problem cell is weak: use "Problem: blank". |

Taste verdict: about 5 real fails (fold CTA, fit lists, eyebrow count, font loading, 5 dash strings). The rest are clashes
where BRIEF correctly overrides Taste. Taste would push A toward a sans display and stock photos, and both would erase A.
Per §6, ignore those parts.

---

## Top 5 fix-now

1. **Re-crop the phone cover** as a poster: one or two words per line at ~20vw, *name* largest on its rule, footnote mark and × at ≥14px (H1). `a.module.css:1517+`
2. **Put the action within reach on phone.** Add "Take one of these seven. →" after the DG-001 parts list and a CTA in contents item 05 (U1). Fix the DG-003 link to stop pre-selecting "Modular Phone Project" (U2). `content.ts:124`
3. **Turn the empty Fig. 2 plate into the annotated exploded DG-001 spread** (layer descriptions as callouts). Delete the duplicate parts list and the "DG-001 needs" column (P1, P2).
4. **Cut 17 blanks to about 4 and make them editorial.** Keep the hero rule, use bylines under each feature title, rebuild Credits as a masthead staff box, and end on the colophon instead of the shared "Put your name on one." (D1–D3).
5. **Fix the facts and the reveal.** Scope "Four rules hold every build together" to DG-001 or mark it `[confirm]` (B1), and `[confirm]` "Free to join" (B2). Reveal the thesis by line so it is legible by ~500ms (M2).
