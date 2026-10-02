# Concept D, critiqued through the lens of Concept C (CRIT-3)

**Verdict: D is the most humane and the most finished-looking of the concepts, but its warmth comes from four synthetic photos instead of from the work. Make the pencil carry the artifacts, and D becomes a concept no one else could have made.**

Critic: CRIT-3, thinking as C's designer ("the page draws itself from the work"). Date 2026-10-02. Read-only: no code was edited.
Scope: ORIGINAL_PROMPT §35 axes, §34 motion critique, §6 audit lens, §7 Taste audit. All suggestions stay in D's own language (paper, pencil, signature, second person). None of them ask D to become C.

## Evidence used

| Source | Path |
|---|---|
| Spec | `design-lab/concepts/concept-d.md` |
| Source | `app/design-lab/d/{page.tsx,content.ts,sketch.tsx,DrawOn.tsx,d.module.css,layout.tsx,fonts.ts}` |
| D's renders (final, 06:18) | `design-lab/renders/d/v1/d-{desktop,tablet,mobile}.png`, `checks/*`, `crops/*` |
| Fresh desktop slices (from the 06:18 full page) | `design-lab/critiques/crit3-d/fp/desk-{0..4}.png` |
| Fresh section captures, 1440 + 390 | `design-lab/critiques/crit3-d/{desk,mob}-{fold,hero,become,work,how,seats,join,footer}.png` |
| Keyboard check (ArrowRight on seats) | `design-lab/critiques/crit3-d/{desk,mob}-seats-key.png` |
| Nav translucency check | `design-lab/critiques/crit3-d/nav-over-join-{390,1440}.png` |
| Motion recording, 1440 | `design-lab/critiques/crit3-d/d-motion-1440.webm` |
| Gemini motion critique (§34) | `design-lab/critiques/crit3-d/gemini-motion.md` (verified claim by claim below) |
| Scripts | `design-lab/scripts/crit3-d.mjs` (captures + metrics), `design-lab/scripts/crit3-d-motion.mjs` (video) |

Measured (`crit3-d.mjs`): 0 console errors at 1440 and 390. Horizontal overflow 0px. 0 targets under 44px. H1 96px (1440) / 44px (390). H2 64 / 36px.
Page height 7,906px (1440) and 11,190px (390). At 390 the Work section alone is 3,493px. 32 text nodes are set at 12px. 6 eyebrows. "Built by" appears 6 times as text, and the blank line repeats about 18 times (spec §5).
Keyboard: focusing seat 1 and pressing ArrowRight selects `hardware-pcb` and swaps the panel. Draw-on (probed): `stroke-dashoffset` goes 1 → 0.57 (300ms) → 0.08 (500ms) → 0 (800ms) on `cubic-bezier(.45,.05,.3,1)`.

---

## 1. Hierarchy

| # | Finding | Evidence | Sev | Suggestion (in D's style) |
|---|---|---|---|---|
| H1 | **The projects arrive too late.** "Who you become" (a text-only ledger, 1,092px at 1440) sits between the hero and the work. The first real artifact field (DG-001) appears around y≈1,700 on desktop and y≈2,300 at 390. The brief says projects are the hero (§41), and the IA puts "what members build" second. | `fp/desk-0.png`, `fp/desk-1.png`; `page.tsx:695-697` | **high** | Do the cut D already proposed (spec risk #1): fold "arrive as → leave as" into the seat panel. Each chair's panel would open with "You arrive as ___. You leave as the person who…". That keeps the becoming idea and puts the work directly under the hero. |
| H2 | **The ledger's right column shouts as loud as the H3s.** The 5 "the person who…" lines are set in roughly 30px Fraunces, the same voice and size as the record titles, so nothing in that block reads as secondary. | `fp/desk-0.png` lower half | med | If the section survives, set the "leave as" lines in Figtree 20px. Let one pencil-circled line carry the emphasis instead of five. |
| H3 | **The records leave a dead column.** In DG-001 the print ends about 300px above the end of the field list. Sticky positioning hides this while you scroll, but in a static read it's a hole. | `fp/desk-1.png` (photo ends at y≈1,255, fields run to y≈1,545) | low | Put a small pencil sketch of the real 7-subsystem stack (from `phoneV2.ts`) under the print. It fills the hole with evidence instead of whitespace. |
| H4 | **Hero hierarchy is strong.** The thesis with the red pencil underline under *your name* is the best single typographic moment of the six concepts. Keep it. | `crit3-d/desk-fold.png` | — | — |

## 2. Typography

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| T1 | **The Join headline breaks badly.** At 1440 it wraps to "Thursday, 6:00 / PM. / Building 17, Room / 1635." The logistics, which are the whole point of the band, break mid-unit. At 390 it still orphans "1635." | `fp/desk-4.png` top; `crit3-d/mob-join.png`; `d.module.css:982-988` (`clamp(2.5rem, 1.4rem+4vw, 5rem)`) | **med** | Use `&nbsp;` in "6:00&nbsp;PM" and "Room&nbsp;1635", add `text-wrap: balance`, and cap it at about 4rem. Better still, set it as two lines on purpose: "Thursday, 6:00 PM." / "Building 17, Room 1635." |
| T2 | **Prose captions are set in 12px mono.** The photo captions are full sentences in IBM Plex Mono 12px (5.6:1). That passes contrast, but mono prose at 12px reads like a stack trace. The CONTEXT-PACK invariant is "mono scoped to metadata". | `crit3-d/desk-work.png`; metric `captionSize: 12px` | low | Keep `[placeholder]` in mono. Set the rest of each caption in Figtree 13–14px italic, like a note pencilled under a print. |
| T3 | **The type system is right for D.** Fraunces SOFT/WONK, Figtree and Plex Mono each have one role, and Caveat is confined to annotation (6 kinds of use, 17 nodes). Gemini's self-critique agrees. | `fonts.ts`; spec §2 | — | Keep it. See Taste clash TS1. |
| T4 | **Step numerals start at 0.** "0 Thursday, 6 PM → 5 Signed" reads as an engineer's zero-index in a section written for people. | `fp/desk-3.png` top | low | Either number 1–6, or drop the 0 and give Thursday a pencil tick instead of a numeral. |

## 3. Distinctiveness

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| X1 | **The "BUILT BY ______" device is native to D but over-repeated.** All six concepts converged on the unsigned line and the "Put your name on one" close, because CONTEXT-PACK seeded them. D has the strongest claim to it: paper, pencil and signing are its medium, and the device sits on a hand-drawn line, not a UI rule. But at about 18 repetitions (hero tag, both records, every seat panel, 7 sheet rows, footer) the signature turns into wallpaper. And no blank ever gets filled or chosen, so the page asks for a signature 18 times and accepts none. Verdict: **earned in kind, generic in dose.** | `page.tsx:27-41` (Blank), `:157-160`, `:287-291`, `:338-341`, `:555-558`, `:622`, `:642-645`; spec §5 "repeats 18×" | **high** | Cut it to 3 blanks: the hero tag, the seat panel's OWNER, and the footer. In the records, swap "Built by ____" for the honest "7 owner slots, names added at sign-off" sentence D already has. |
| X2 | **What only D can do: make the blank specific to the visitor.** D is the only concept with a no-JS chooser (the chair radio group plus `:has()`). | `page.tsx:504-561` | **high** | Carry the chosen seat down the page with the same CSS `:has()` mechanism. The Join step 3 and the footer line then read "Hardware / PCB · owner: ______". The primary CTA becomes one of 7 pre-rendered links (`/contact?type=project-team&seat=hardware-pcb`), and only the checked one is shown. That still works without JS and invents nothing. It also turns "Put your name on one" into "put your name on *this* one", which no other concept can do without a canvas. |
| X3 | **Warmth is borrowed from synthetic photos.** Take away the 4 Gemini images and D's identity is cream paper, a serif and Caveat. That is the familiar warm-editorial default (see Taste TS3), and the brief's NOT list includes "university department". D's own distinct asset is the Rough.js pencil, but it only draws a rail, arrows, chairs and a 3-rectangle phone. | `fp/desk-3.png` (seat table); `page.tsx:507-520` | **high** | Let the pencil draw the actual builds from `lib/data`. For DG-001, a pencilled exploded stack of the 7 subsystems with handoff arrows labelled from `phoneV2.ts`. For DG-002, the saccade problem drawn as rough eye-jump arcs across lines of text versus one fixed point (from `glasses.ts` 122-129). A hand-drawn teardown of a real build is evidence, warmth and distinctiveness in one stroke. |

## 4. Usability

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| U1 | **One intent has 3 labels and 2 destinations.** Nav says "Come build" (→ `#join`), the hero says "Come on a Thursday" (→ `#join`), and Join says "Tell us you're coming" (→ `/contact?type=membership`). Taste flags this as duplicate CTA intent. It also means 2 of the 3 "commit" buttons only scroll. | `page.tsx:87-89`, `:128-130`, `:593-595` | **med** | Pick one imperative label (e.g. "Come Thursday") and use it in all three places. Point the nav and hero CTAs at the form, or make the nav CTA plainly a jump ("Thursday 6 PM ↓"). |
| U2 | **There is no navigation at 390.** Below 960px the links are hidden and only the CTA remains (`navLinksVisible: 0`). On an 11,190px page you can't reach The work or Seats except by scrolling. | `crit3-d/mob-fold.png`; metric | **med** | Add a native `<details>` "Contents" card in the nav: a paper index card with 3 ruled lines, which works without JS. That is D's idiom (an index card), not a hamburger. |
| U3 | **The seat panel isn't announced.** Changing the radio swaps the visible `<article>` through CSS, but there is no `aria-live`, `aria-describedby` or `aria-controls` (grep: 0 hits). A screen-reader user hears "Hardware / PCB, radio, 2 of 7" and nothing about the panel. | `page.tsx:526-561` | med | Give each radio `aria-describedby="seat-desc-<id>"` pointing at that panel's description and bullets. Hidden panels still resolve for descriptions, so it stays CSS-only. |
| U4 | **The sticky nav is 94% opaque.** Text ghosts through it, and over the dark Join band you can read "2 Sit in on a standup." behind the wordmark. | `crit3-d/nav-over-join-390.png`; `d.module.css:302` | low | Make it solid `--d-paper`, or switch the nav to `--d-night` while it overlaps `#join`. |
| U5 | **"Read without the chase" is ambiguous out of context.** In a screen-reader link list it doesn't say where it goes. | `page.tsx:342-344` | low | Use "Open Smart Reading", or keep the phrase and add an sr-only " (Smart Reading)". |

## 5. Brand fit

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| B1 | **Second person everywhere, against BRAND pillar 3.** BRAND.md says "Second person sparingly." D's thesis is "every section is written in second person", so most headings and bodies say "you". Here it's intentional and mostly works, but it's a documented conflict that brand-guardian will flag. | `docs/design/BRAND.md:16-18`; spec §1 | med | Keep "you" in the H1, the seats and Join, where the visitor acts. Put the records and the How section in third-person declaratives ("Each subsystem has one owner"). The second person then lands harder where it remains. |
| B2 | **It tips toward a literary magazine more than an engineering lab.** The positioning needs startup studio + engineering lab. D's engineering signal comes almost entirely from generated photos (soldering iron, multimeter). | all `fp/` slices | med | Same fix as X3. Also consider an engineering-pad texture (faint 5mm grid) in the How band only, so the pencil sits on an engineer's paper, not a café napkin. |
| B3 | **Honesty discipline is excellent.** It uses `[placeholder]` and `[confirm phase]` in place, names only the real mentor, uses only real numbers (7, 8-month, Thu 6 PM, Bldg 17 Rm 1635), takes leadership roles and the 2026–27 term from `team.ts`, and has 0 banned words. | `content.ts`; `lib/data/team.ts:51` | — | Keep it. |

## 6. Project storytelling (§41)

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| P1 | **Neither record shows its own artifact.** DG-001's visual is generated hands over a generic PCB, captioned "not DG-001 hardware". DG-002's visual is the real `BookBG` asset with a static "where" word, which is the honest one. The phone itself never appears except as 3 rounded rectangles on the seat table. | `fp/desk-1.png`, `fp/desk-2.png`, `fp/desk-3.png` | **high** | Make the record's media a pencil plate of the build (see X3), and demote the photo slot to a small taped-on `[placeholder]` print in the corner, to be replaced by real bench photos when they exist. |
| P2 | **"Who it needs" lists subsystems, not people.** DG-001's field repeats the 7 subsystem names. DG-002's lists disciplines. The field label promises people. | `content.ts:61`; `fp/desk-1.png` | low | For DG-001, list the disciplines the subsystems imply, marked `[confirm]`, or rename the field "Owned in 7 parts". |
| P3 | **The DG-002 HUD frame is a still.** One word is frozen at 450 wpm, so the record says what RSVP is but never shows it. | `page.tsx:301-316` | low | D shouldn't add an animated reader (that is C's move). Draw the explanation instead: a pencil "before" (zig-zag saccade arcs over the page) beside the "after" (one circled fixed point). Static, honest and explanatory. |
| P4 | **The field coverage is honest and complete.** Problem, object, status plus an honest note, mentor, duration, outcome and repo/cost are all present, and unknowns are visibly `[placeholder]`. This matches C's "No signal" device in spirit with less ceremony. | `page.tsx:264-291`, `:319-341` | — | — |

## 7. Responsiveness

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| R1 | **The mobile page is very long.** It is 11,190px, and Work alone is 3,493px. Gemini's self-critique asked for accordions. D rejected that, correctly for §41, but the length problem is still there. | metrics; `crit3-d/mob-work.png` | med | Cuts that keep §41 visible: H1 (move "Who you become" into the seats) saves about 1,080px; X1 (fewer blanks) saves about 150px; on mobile, drop the hero print below the CTA to a 4:3 crop. |
| R2 | **The mobile collapses are well judged.** At 390 the seat table becomes a radio list with 56px rows, the rail becomes a vertical pencil line, and record fields stack label over value. | `crit3-d/mob-seats-key.png`, `mob-how.png` | — | Keep. |
| R3 | **At 390, the hero's "BUILT BY" tag peeks above the fold without its photo.** It reads as a stray label. | `crit3-d/mob-fold.png` bottom | low | On narrow viewports, anchor the tag to the photo's lower edge, not its top-right corner. |

## 8. Implementation feasibility

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| F1 | **It's the most shippable concept in engineering terms.** Rough.js runs at build time with fixed seeds, so there is 0 KB of drawing JS. About 30 lines of client JS, a no-JS seat picker, it is static-export safe, and it adds no new dependencies. | `sketch.tsx:1-15`; `DrawOn.tsx` | — | — |
| F2 | **The content dependency is the real risk.** The concept's warmth needs real build-night photos and the club has 0 (CONTEXT-PACK §1). Without them, production ships either generated images (an honesty risk, see the placeholder audit) or empty slots. | spec risk #2 | **high** | Design the photo-free state now: prints become pencil-outlined empty frames with "photo from build night goes here". If D still holds up in that state, it is safe to ship. |
| F3 | **Font weight.** The preloaded Fraunces (latin, SOFT/WONK/opsz axes) is 120.8 KB, plus italic, Figtree 20 KB, Plex Mono and Caveat. The dev SSR HTML is 248 KB, including 7 hidden seat panels and the inline rough paths. | `.next/static/media/cb9f64d62d112b41-s.p.woff2` | low | Subset Fraunces to the axes actually used (opsz plus SOFT; WONK only for the H1), or use static instances. |
| F4 | **Global chrome hack.** Same as C: `layout.tsx` hides the production Navbar and Footer with `body:has(...)`, and the header and footer lose their landmarks inside the root `<main>`. | `layout.tsx:12-17` | low | This is orchestrator-owned: add `/design-lab` to the immersive prefixes. |

## 9. Motion quality (§34)

The recording (`d-motion-1440.webm`) was sent to Gemini (`crit3-d/gemini-motion.md`). Its claims were checked against a DOM probe:

| Gemini claim | Verified? |
|---|---|
| "Sketches don't draw on; blank, then pop" | **Partly true.** The draw-on does run (dashoffset 1 → 0 over about 800ms, probed). The *blank* part is real: armed sketches are invisible until 15% of them enters a viewport shrunk by `rootMargin: -12%` bottom (`DrawOn.tsx:25`), so on a normal wheel scroll the rail and the table sit empty for a beat. |
| "Seat switch teleports, no transition" | **True.** The panel swap is `display` only. The chair fill has a 200ms transition, but the panel does not. |
| "Footer accordion opens instantly" | **False.** D has no accordions. Rejected. |

| # | Finding | Evidence | Sev | Suggestion (pencil language, no springs) |
|---|---|---|---|---|
| M1 | **Every stroke in a sketch draws at once.** The rail line and all 6 circles start and finish together, so it reads as a wipe, not a hand. This is the one thing D's motion is about. | `d.module.css:255-266` (one transition for all paths) | **med** | Stagger by path index (`transition-delay: calc(var(--i) * 70ms)`, with `--i` set in `Sketch`). Draw the rail first, then circle each stop in order, ending on the red "Signed" circle. The drawing then tells the owner → signed story. |
| M2 | **Undrawn blank before reveal.** | `DrawOn.tsx:25` | med | Use `rootMargin: '0px 0px 10% 0px'` with `threshold: 0`, so drawing starts just before the sketch enters. Never let a section's main sketch be seen empty. |
| M3 | **There's no focal motion object.** About 59 sketch paths across 6 sections each animate once. Together that is many small simultaneous effects, which CONTEXT-PACK §5 says to avoid. | spec §5; `page.tsx` | low | Choose one sequenced drawing (the How rail, M1) and mark everything else `still`. The page gets one memorable moment instead of six faint ones. |
| M4 | **The seat switch has no feedback beyond the chair fill.** | `crit3-d/desk-seats-key.png` | low | When a chair is checked, draw a pencil ring around it and redraw the OWNER blank in the panel (about 320ms, existing draw-on CSS). Skip the crossfade Gemini suggested, since sliding and fading isn't D's language. |
| M5 | **Reduced motion and no-JS are exemplary.** Sketches are fully drawn in the server HTML, `DrawOn` never arms under reduced motion, and transitions drop to 0.01ms. | `DrawOn.tsx:15`; `d.module.css:268-273`, `:1329-1335` | — | — |

---

## Gemini placeholder images: labeling and risk

All four have `[placeholder]` in a visible caption **and** at the start of the alt text, plus "Not a DIGITAL photo" or an equivalent. Labeling is complete in markup. The risk is in how they *read*:

| Image | Where | Labeled? | Reads as real members or work? | Sev | Fix (D-native) |
|---|---|---|---|---|---|
| `d-workbench.webp` | Hero, the LCP image | Yes (caption + alt) | **Yes, moderately.** A PCB in a vise next to a grey 3D-printed *phone enclosure* implies a physical DG-001 prototype exists, which is unverified. The "BUILT BY" tag is pinned onto the photo, which visually claims the photo as members' work. | **high** | Move the tag off the photo onto the paper. Swap the phone enclosure for neutral bench clutter, or replace the hero print with the pencil teardown (X3). |
| `d-hands.webp` | DG-001 record | Yes ("not DG-001 hardware") | **Yes, most risky.** Hands are people, and next to a record titled DG-001 they read as members at work. D notes they read as older adults, not students. | **high** | Replace it first. Use the pencilled subsystem stack as the record's media. If a photo slot stays, show a sketched empty frame. |
| `d-whiteboard.webp` | How a build runs | Yes | **Yes, as real planning.** About 7 boxes around a phone outline mimic DG-001's real subsystem map, so a generated image is illustrating real structure that D's own Rough.js could draw truthfully from `phoneV2.ts`. | med | Replace it with a Rough.js "whiteboard" of the real map (7 labelled boxes, 4 handoff rules). It becomes evidence instead of a stand-in. |
| `d-room.webp` | Join | Yes ("Not Building 17, Room 1635") | **Low–med.** The caption is explicit, but the image sits beside the address in 80px type, so the eye pairs them. | low | Acceptable as a labeled placeholder. Consider desaturating to an ink-on-paper duotone so it reads as a proof print, not documentary. |

Systemic notes: (1) the captions are 12px, and screenshots or social crops drop them, so the image travels unlabeled. (2) All four use the documentary "print on paper" grammar (rotated, white border), which is exactly the visual code for *real* photos. Rendering placeholders as pencil-traced or halftone proofs, or as sketched empty frames, keeps the honesty visible inside the image, not only in the caption. Taste bans text overlays on images. A hand-pencilled "sample" note on the paper *beside* the print avoids that and stays in D's idiom.

---

## Taste skill audit (Taste v2, `.claude/skills/design-taste-frontend/SKILL.md`)

Design read: *a student-org landing page for prospective members, in a warm human editorial language, leaning toward paper + serif + pencil annotation.* Dials for this brief: VARIANCE 6 / MOTION 3 / DENSITY 4.

**Clashes where BRIEF wins (noted, not penalized):**

| ID | Taste rule | D does | Why BRIEF wins |
|---|---|---|---|
| TS1 | §4.1 Fraunces "banned as default" | Fraunces display | CONTEXT-PACK §4 assigns Fraunces SOFT/WONK to D, verified in the type-lab render. Same-family italic emphasis on *your name* follows Taste's own emphasis rule. |
| TS2 | §4.8 / §9.E: hand-rolled decorative SVG discouraged | Rough.js sketch layer | BRIEF §19 assigns SVG/procedural drawing to Claude, and library-fit gives `roughjs` to D. These are generated from data and seeds, not freehand illustration. |
| TS3 | §4.2 premium-consumer palette ban (`#f5f1ea`-family paper, espresso ink) | `--d-paper #f4eee4`, `--d-ink #1e1a15` | Not a premium-consumer brief, so the rule doesn't strictly apply. The *warning* still holds: it's the warm-craft default (see B2/X3). |
| TS4 | §4.11 theme lock | Join is a dark "night" band | Taste allows one deliberate theme switch per page, and this one is motivated ("Thursday night"). Pass. |
| TS5 | §9.F photo captions as decoration | `[placeholder]` captions | BRIEF rule 4 *requires* placeholder labels. These are functional, not decorative. |

**Taste findings that stand:**

| ID | Check | Result | Evidence | Sev |
|---|---|---|---|---|
| TA1 | Eyebrow count ≤ ceil(7/3)=3 | **Fail: 6** (hero, Who you become, The work, How a build runs, Pull up a chair, Come build) | rendered HTML; `page.tsx:99,189,239,403,493,572` | med: keep the hero, "Pull up a chair" (it's the invitation) and "Come build". Drop the other 3; the H2s already name the sections. |
| TA2 | No duplicate CTA intent | **Fail** (3 labels for "come Thursday") | U1 | med |
| TA3 | Em-dash zero | **Fail, via data:** `Project Lead — Modular Smartphone` ×3 (from `team.ts`) and the en-dash in `2026–27` | rendered text | low: D can't edit `lib/data`. Render the role as two lines (role / project) by splitting on " — " in `content.ts`. BRAND.md itself uses em-dashes, so this is a Taste-only rule; flag it to brand-guardian rather than enforce it. |
| TA4 | Middle-dot ≤1 per line | **Fail**: 6 lines with 2–6 dots (needs, tech, seat spec lines) | `page.tsx:274,329,330,554` | low: set "Who it needs" and "Built with" as short wrapped lists separated by commas, or in pencil-ruled columns. |
| TA5 | Zigzag cap (≤2 consecutive image+text splits) | **Borderline**: DG-001 split → DG-002 split → How head split | `fp/desk-1..2.png` | low: H1/X3 fix it naturally, because the DG-001 media becomes a full-width pencil plate. |
| TA6 | Hero stack ≤4 text elements, subtext ≤20 words | **Soft fail**: eyebrow + 3-line H1 + 25-word lead + CTAs + meta strip | `page.tsx:99-143` | low: the meta strip is real logistics (time, room), so keep it. Trim the lead to ≤20 words, e.g. drop "Nobody hands you a finished project." or "Different majors, one product." |
| TA7 | No `border-b` on every spec row | **Fail** (6-row field tables, hairline each row) | `fp/desk-1.png` | low: D's equivalent of Taste's "grouped chunks" is two pencil-ruled groups (what it is / where it stands). |
| TA8 | Dark mode | Light only (plus the night band) | — | low: not required by the BRIEF. Note it for production. |
| Pass | Hero fits the viewport, nav on one line at 64px, one radius system (2px), one accent, button contrast, reduced motion, no `scroll` listeners, `useEffect` cleanup, IntersectionObserver used, no fake numbers, no Jane Doe, no glow or gradients | — | — | — |

---

## Top 5 fix-now

1. **Make the pencil draw the real builds (X3, P1).** A Rough.js exploded stack of DG-001's 7 subsystems from `phoneV2.ts` as the DG-001 media, and a saccade-vs-fixed-point sketch for DG-002. *high*
2. **Defuse the people-implying placeholders (placeholder audit, F2).** Replace `d-hands` and `d-whiteboard` with pencil plates, move the BUILT BY tag off the hero photo, and design the photo-free fallback (sketched empty frames). *high*
3. **Cut the blanks from about 18 to 3, and make one of them the visitor's (X1, X2).** Carry the checked seat through `:has()` into Join step 3, the CTA link and the footer signature line. *high*
4. **Put the work right after the hero (H1, R1).** Fold "Who you become" into the seat panels. That saves about 1,080px at 390. *high*
5. **Sequence one drawing and stop the blank-before-draw (M1, M2).** Per-path stagger on the How rail, ending on the red "Signed" circle, and `rootMargin` 10% early. Then fix the Join headline breaks (T1) and the single CTA label (U1) in the same pass. *med*
