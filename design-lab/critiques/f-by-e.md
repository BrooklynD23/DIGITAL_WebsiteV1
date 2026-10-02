# Concept F "The Bench", critiqued through concept E's lens

CRIT-5 · 2026-10-02 · ORIGINAL_PROMPT §35 (cross-critique), §34 (motion), §6 (audit), §7 (Taste).
Lens: E's designer ("The Ledger"). E's priorities are honest status, the mechanism over adjectives, state that moves only when it changes, and blanks that stay blank. **Goal: help F become a better F, not turn F into E.** Read-only: no code was edited.

**Verdict:** F has the strongest single idea in the set: the visitor's name is the largest type on the page and it lands on real seats. Three problems hold it back:
1. At desktop height the hero hides its own control.
2. The bench lets 14 seat boxes out-shout the projects.
3. Cause and effect drift apart, both in space (hover → phone) and in time (RSVP plays during the drag).

## Evidence index

| Kind | Path |
|---|---|
| Fresh full-page renders (1440 / 834 / 390) | `design-lab/renders/f/crit/f-crit-{desktop,tablet,mobile}.png` |
| Desktop viewport slices | `design-lab/renders/f/crit/d-{0,900,1800,2700,3600,4500,5400}.png` |
| Mobile and tablet contact strips | `design-lab/renders/f/crit/mstrip{1,2}.png`, `tstrip.png` |
| Sticky tray state, signed, 1440 / 390 | `design-lab/renders/f/crit/f-crit-sticky-{1440,390}.png` |
| Motion video, default and reduced | `design-lab/renders/f/crit/motion.webm`, `motion-reduced.webm` (+ `*-beats.txt`) |
| Frames at 4 fps (frame N = (N−1)/4 s) | `design-lab/renders/f/crit/frames/`, `frames-r/`, sheets `cs1–cs4.png`, `cs1r.png`, `rsvp-r.png`, `drop-tile.png` |
| Gemini motion critique + cross-check | `design-lab/critiques/f-gemini-motion.md` |
| Recorder | `design-lab/scripts/crit5-f-motion.mjs` |

Measurements were taken with Playwright against `localhost:3100`. Both recordings logged 0 console errors.

---

## 1. Hierarchy

| # | Finding | Evidence | Sev | Suggestion in F's own style |
|---|---|---|---|---|
| H1 | **The hero hides its own control at desktop height.** At 1440×900 the sign input starts at y=862 and ends at 939, and the CTA starts at 901. At 1366×768 the input is at 833 and the CTA at 872, so both sit below the fold. The sticker draws the eye, but it is an `aria-hidden` span: clicking it only focuses the field further down, so the visitor has no visible cue that typing does something. Tablet (570) and mobile (395) are fine | `d-0.png`, `d-900.png`; `Sections.tsx:20-24`; thesis `clamp(56px,14.5vw,216px)` renders at 209px | **high** | **Write on the tag itself.** Put a real `<input>` inside the sticker's white field, set in Bricolage 800 so the letters appear where they land. Keep the labelled field below for no-JS and screen readers. Also cap the thesis by height (`min(14.5vw, 19vh)`) so line 3 and the sign line share the first screen |
| H2 | **Seats out-shout projects.** DG-001 alone has 7 dashed boxes, each with a 44px outlined button. The problem line and the figure lose to 14 identical buttons on the bench | `d-1800.png`, `f-crit-sticky-1440.png`, `Bench.tsx:101-161` | med | **Make a seat a cut line, not a card.** Use one row per seat: title · `Built by ______` · a right-aligned "Put Danny here". Make the whole row the 44px target. The dashed cut line already says "open", so the box around it is redundant |
| H3 | **The unsigned Sheet is half-empty and repeats itself.** 3 of 6 title-block cells are blank. The footnote repeats the 3 filled cells word for word. The 4-stage rail shows bare words with no meaning attached | `d-4500.png`; `Sections.tsx:91-102` | low | Cut the footnote to its `[confirm they apply to every build]` flag. Fold the rail into the title block as a "REV / stage" row, like a real drawing's revision strip |

## 2. Typography

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| T1 | Bricolage condensed 800 at ~209px is the most ownable display move in the six concepts. The name filling it pays off the type choice | `cs1.png` frame 014 | (keep) | Do not soften it. Fix the fold with height capping (H1), not a smaller face |
| T2 | **The main call to action inside each record is the page's smallest text.** "PUT A NAME ON" is an `h4` in Departure Mono at 11px caps, above 15–19px seat titles | `d-1800.png`; `Bench.tsx:245-247` | med | Set it in Departure at **22px**, F's second allowed size, as the sheet's cut-line label. That stays within F's own "11 or 22 only" rule |
| T3 | **The last impression is grey placeholder type.** Visitors who never sign end on a 240px grey "your name" | `d-5400.png`, `mstrip2.png` (bottom right) | low | When unsigned, print F's own blank: a full-width signature rule `______` under "DRAWN BY". Only set the name in type once there is a name |

## 3. Distinctiveness (incl. the cross-concept "BUILT BY ______" / "Put your name on one")

**Verdict: earned, but only half cashed in.** F is the only concept where the blank does something: the visitor's name fills it (`cs2.png` frame 048 seat, `cs4.png` frame 074 sheet Owner = Danny, frames 082/090 footer). Elsewhere the device is decoration. In F it is the interface. Three things still make it read as the seeded template:

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| X1 | **The closer never pays off.** "Put your name on one." is the CONTEXT-PACK line word for word, and it stays the same after signing: frame 090 shows "Danny" in display type with "Put your name on one." under it | `cs4.png` frame 090; `page.tsx:105` | med | Make the closer depend on state. Unsigned: keep the line. Signed: show the real next step, "Danny · Hardware / PCB · Thursday 6:00 PM · Bldg 17 Rm 1635". Only F can end the page on the visitor's own appointment |
| X2 | **There are four words for one act**: MY NAME IS (tag), Built by (seats), Drawn by (footer), Sign / Put my name here / Take a seat / Take a subsystem (controls) | `NameTag.tsx:42`, `Bench.tsx:121`, `Sections.tsx:213` | med | Pick the drawing vocabulary and use it everywhere. Change the tag band to **BUILT BY** so the sticker literally fills the seat's blank |
| X3 | **"HELLO, MY NAME IS" is a mixer-badge trope.** It drifts toward "student club social", which §20 says to avoid. The asset only F owns is the **engineering title block** with the visitor as Owner | `d-4500.png` title block | med | What only F could do: make the sign-off chain the mechanism. Use a title block with **DRAWN BY (you) / CHECKED BY (review path, open) / RELEASED AT (test gate, open)**, mapped 1:1 to the real ownership model (`phoneV2.ts:295-300`). The footer then prints the visitor's completed title block, not just a big name. This is honest: two of three signatures stay blank until people actually review and gate the work |

## 4. Usability

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| U1 | The hero fold problem (H1) is also the main usability problem: the first task cannot start without a scroll on 1366/1440 laptops | measurements above | **high** | See H1 |
| U2 | **Dragging to an off-screen seat overshoots.** Autoscroll runs at about 1,545 px/s (default motion) and about 1,686 px/s (reduced motion) when the tag is held 20px from the bottom edge. My first take of the recording dropped onto the wrong spot for this reason | Playwright measurement; `Bench.tsx:376-387` (dnd-kit `autoScroll` at its defaults) | med | "The bench doesn't slide under your hand." Pass `autoScroll={{ threshold: { x: 0, y: 0.12 }, acceleration: 3 }}`, or turn autoscroll off and rely on the sticky tray: scroll first, then drag |
| U3 | **Hover → phone-layer inversion happens off-screen.** With DG-001 seats in view, the figure is at viewport y −235…−58, under the sticky tray. Inverted layers only peek out under it | `f-crit-sticky-1440.png`, `drop-tile.png`; `Bench.tsx:362-365` | med | Put a **24px pixel phone glyph inside each seat** with that seat's layers filled, drawn in the same pixel language, so the cause and effect sit in one row. Alternatively, at ≥1100 make the figure sticky beside the seats |
| U4 | **The seat choice is lost at the form.** "Take a subsystem" goes to `/contact/?type=project-team` with no seat, and step 2 tells the visitor to retype it | `content.ts:224`, `Sections.tsx:164-169` | med | Append `&seat=<seatId>` (an ID, never the name, so the privacy rule holds). The production form reading it is an orchestrator/production item |
| U5 | **Two near-identical CTAs go to different places.** "Take a seat at the bench" is an in-page anchor; "Take a subsystem" opens the form | `page.tsx:56-59`, `Sections.tsx:166-169` | low | Rename the hero CTA **"Sign the bench ↓"** so it matches join step 1, and keep "Take a subsystem" for the form |

## 5. Brand fit

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| B1 | **Both sides of known conflicts are printed.** "Toolchain: KiCad or Altium [confirm]" and "Phase: Prototyping or PCB fab [confirm]". CONTEXT-PACK §1 lists KiCad vs Altium and phase as do-not-use. Naming the candidates still publishes unverified claims | `content.ts:139,142`; `d-1800.png` | med | Use F's own blank: `Toolchain ______ [confirm]`. The cut line is already F's sign for "unknown" |
| B2 | **The seats imply openings no one has confirmed.** There are 14 "Put my name here" seats; 5 come from DG-002's "needs" list turned into seats (`content.ts:90-103`). No seat carries the `[confirm]` that F's own Risk #2 asks for | `concept-f.md` Risks §2 | med | Add one flag per record in the seat label: "PUT A NAME ON · open this term [confirm]" |
| B3 | Copy referent: "Bring the tag Thursday." There is no tag to bring (it lives in `localStorage`) | `page.tsx:94` | low | e.g. "Say your seat out loud Thursday." [exploratory; production copy goes through brand-voice-strategist → brand-guardian] |
| B4 | The accent rule is the cleanest in the set: red means "about you" (tag + the CTA that carries it), and the green mat is a material, not a brand colour | `concept-f.md` Color | (keep) | — |

## 6. Project storytelling

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| P1 | **The DG-001 figure is 7 unlabelled pixel rectangles (~440px wide).** It only explains the subsystems on hover (and the hover is off-screen, U3). The project's best idea, "seven subsystems, one phone", never reads at a glance | `d-900.png` bottom, `d-1800.png` top; `PixelArt.tsx` | med | Number the 7 layers **01–07** in Departure 11px with pixel leaders, matching the seat order, so the drawing teaches the build without hover |
| P2 | The DG-002 RSVP lens is F's best storytelling moment. It is a real artifact behaviour | `cs2.png` frames 036–048 | (keep) | Start it from the visitor's own act (see M1) |
| P3 | **Records show seats but no next step.** Outcome lines are honest ("No shipped revision yet"), but there is no "what happens next" line | `content.ts:144,166` | low | Add one `Next ______ [confirm]` field per build. A blank next step fits F's language |

## 7. Responsiveness

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| R1 | **Mobile is 8,876 px long at 390**, and 14 seat boxes take most of it | measured `scrollHeight`; `mstrip1.png` | med | Use the cut-line rows from H2 on mobile. Optionally collapse to "7 seats · 0 signed ▸" per record. The List view already exists and could be the default under 700px |
| R2 | Tablet and mobile otherwise work: bottom tab bar (57px), rotation off below 1100, no horizontal overflow, 3-up seats at 834 | `tstrip.png`, `mstrip*.png` | (keep) | — |
| R3 | Under reduced motion the RSVP lens shows one word ("The"). The full sentence is screen-reader text only | `rsvp-r.png`; `Rsvp.tsx:83` | med | See M2 |

## 8. Implementation feasibility

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| F1 | Cheap and static-export-safe: `@dnd-kit/core` + `motion` only, no WebGL, `localStorage` wrapped in try/catch, IntersectionObserver instead of scroll listeners | `SignProvider.tsx`, `Sections.tsx:228-241` | (keep) | — |
| F2 | **Seats exist only in the prototype.** They are derived in `content.ts`, not stored in `lib/data`. Production needs a seat source with per-term status, or claims go stale | `content.ts:77-127` | med | Spec a `seats` data contract (id, record, title, open: `[confirm]`) for the orchestrator before any production move |
| F3 | Production chrome is hidden with a `:has()` style tag, the same workaround as E | `layout.tsx:30-33` | low | The orchestrator's `IMMERSIVE_PREFIXES` fix covers both |

## 9. Motion quality (§34; full detail in `f-gemini-motion.md`)

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| M1 | **F breaks its own rule, "nothing moves unless you move it".** The RSVP autoplays when 60% visible, which is exactly while the visitor is dragging beside it ("arrive → right → look." during the drag) | `frames/030–044` (`cs1.png`, `cs2.png`) | med | Trigger the RSVP from the visitor: play it when their tag lands on a DG-002 seat, or on hover/focus of the lens. The rule then holds with no exceptions |
| M2 | **Reduced-motion parity gap.** Sighted reduced-motion users get one word, not the demo's content (Gemini claimed the reverse; it is wrong, see cross-check D2) | `rsvp-r.png`; `Rsvp.tsx:51-53, 83` | med | Under reduce, replace "Play" with a pixel **Step ▸** button that advances one word per press, and print the sentence under the lens in Departure 11px |
| M3 | The drop spring (520/26, damping ratio ≈0.57, ≈11% overshoot) reads as a physical slap. Over-target tint, solid borders and hidden seat buttons during the drag make the target clear | `frames/044→048`; `f.module.css:1434-1440` | (keep) | — |
| M4 | Autoscroll speed during drag | U2 | med | See U2 |
| M5 | The drag overlay keeps its −3° tilt under reduce | `f.module.css:404-408`, reduce block `1399-1408` | low | Optional: drop the tilt under reduce. It is a static pose, not motion, so this is cosmetic |

---

## Taste skill audit (Taste v2, `.claude/skills/design-taste-frontend/SKILL.md`)

**Design read (§0.B):** "Reading this as: a student builder-studio homepage for prospective members (with recruiters and sponsors second), in an experimental, tool-like language, leaning toward an engineering-drawing aesthetic (paper, cutting mat, title block) on native CSS + dnd-kit."
**Dials (§1):** target VARIANCE 9 / MOTION 3 (user-driven only, by design) / DENSITY 5. Observed: VARIANCE 9 (rotated sheets) / MOTION 3 / DENSITY 7 (the bench is denser than the read wants; see H2, R1).

| Pre-flight item (§14) | Result | Evidence / note |
|---|---|---|
| Zero em-dashes | **FAIL** | 2 visible strings: plate labels `content.ts:150,172` ("PROJECT PHOTO — …"), plus the tab title `layout.tsx:7` |
| Hero fits viewport | **FAIL** | Sign field and CTA below the fold at 1440×900 and 1366×768 (H1). The 3-line headline breaks Taste's 2-line cap → **clash: BRIEF wins** (one signature display move), but the fold failure stands |
| Hero stack ≤ 4 text elements | WARN | Eyebrow, thesis, sign label + note, aside, CTA = 5–6. The sign field is the hero's function and the privacy note is required, so cut the aside instead |
| Page theme lock (§4.11) | FAIL → **clash, BRIEF wins** | paper → mat → paper → night → paper. Both are justified as materials (bench surface, build *night*) |
| Real images (§4.8) / hand-rolled SVG (§9.E) | FAIL → **clash, BRIEF wins** | 0 real photos exist. BRIEF §19 and CONTEXT-PACK §1 require procedural drawings of the real artifacts and forbid invented photography. The plates are labelled `[placeholder]` correctly |
| Dark mode (§6.C) | FAIL → **clash, BRIEF silent** | Not in scope for the lab. Note for production |
| Colour lock / shape lock | PASS | One red. Radius 0, with a documented 8px exception for the tag only |
| Button / form contrast | PASS | White on `#C8361F` 5.3:1. Placeholder `#6E716A` on paper ≈4.2:1, passes only as large text (~44px) |
| Duplicate CTA intent | WARN | "Take a seat at the bench" vs "Take a subsystem" (U5) |
| Eyebrow count / section-number eyebrows | PASS | 1 section eyebrow (hero). "01 Sign…04 Thursday" are real navigable tabs, which Taste allows. Vertical tab text is allowed for an experimental brief with a purpose (binder tabs) |
| Split-header ban | PASS (borderline) | Sheet header: the right column holds the 3-line mechanism, which is real content, not filler |
| Long lists / hairline every row (§4.9) | WARN | 8-row field tables ×2 plus 14 seat boxes. E has the same fact-sheet pattern, so this is an honest flag for both |
| Middle-dot rationing / version footer | WARN (low) | Strip and footer use 2 dots each. "Sheet 1 of 1 · concept F · lab prototype" is a lab marker; remove it in production |
| Decorative grid lines | WARN (low) | Mat grid = material (OK). The numbered ruler 0–75 measures nothing; drop it or make it measure something real |
| Copy self-audit | WARN | "Bring the tag Thursday." (B3); split signature vocabulary (X2) |
| Motion motivated / no scroll listeners / cleanup | PASS | Every motion is feedback or state. IntersectionObserver only. Effects clean up |
| Reduced motion | PASS with a parity gap | M2 |
| Icons from a library | PASS | Pixelarticons (MIT) paths inlined; one family |
| Empty states | PASS | Sheet and tray explain how to fill them |

Totals: 2 hard fails that F should fix (em-dash, hero fold); 4 Taste fails overridden by BRIEF (theme lock, real images, dark mode, 2-line headline); 6 warnings.

---

## Top 5 fix-now

1. **Put the sign field on the tag and in the first viewport** (H1/U1, high). Use an input inside the sticker and cap the thesis by height with `min(14.5vw, 19vh)`. Re-measure `#f-sign` < 900 at 1440×900 and < 768 at 1366×768.
2. **Turn the 14 seat boxes into cut-line rows** (H2/R1, med). One 44px row per seat; drop the box and the outlined button. Target mobile height ≤ 6,500 px.
3. **Keep cause and effect together** (U3/P1/M1, med). Number the phone layers 01–07 to match the seats, add a 24px layer glyph per seat, and start the RSVP on the visitor's own act (tag on a DG-002 seat or lens focus), never on scroll.
4. **One signature vocabulary, paid off at the end** (X1/X2/X3, med). Tag band "BUILT BY"; title block DRAWN / CHECKED / RELEASED mapped to the real ownership model; a closer that changes on signed state to the visitor's Thursday appointment.
5. **Honesty fixes** (B1/B2 + Taste em-dash, med). Replace "KiCad or Altium" and "Prototyping or PCB fab" with `______ [confirm]`, add "open this term [confirm]" per record, and replace the 2 visible em-dashes in the plate labels with a colon.
