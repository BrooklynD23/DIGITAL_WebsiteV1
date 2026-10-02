# Concept C "Formation", critiqued through Concept B's lens (CRIT-2, §35)

Critic: CRIT-2, thinking as B's designer (Engineering / System: "every drawing is computed from the club's records; inspect, don't animate").
Rule I hold myself to (§35): suggestions make C a better C. No light theme, no Plex, no tables-for-everything, no schematics.
Lenses also applied: §6 (Vercel guidelines as auditor: hierarchy, spacing, interaction clarity) and §7 (Taste skill `design-taste-frontend-v1`, filtered: its "perpetual motion" and spring defaults contradict BRIEF §9 and were ignored).

**Verdict:** C is the most distinctive hero in the lab and its "No signal" honesty device is better than B's `[confirm]` cells. It loses points where the motion outruns the information: labels lead the particles, interrupts snap, the Still fallback breaks, and below the hero the page becomes a generic dark archive that never reuses its own material.

Evidence sources

| Source | Path |
|---|---|
| v1 renders (DA-C) | `design-lab/renders/c/v1/` (`c-desktop.png` 1440x6313, `c-hero-*.png`, `fallback/`) |
| Section crops of `c-desktop.png` | `design-lab/renders/c/crit/desk-crop{1..4}.png` (y 1100, 2600, 3800, 5000) |
| Fresh states (live / reduced / mobile) | `design-lab/renders/c/crit/crit-{d,d-rm,m}-*.png` via `design-lab/scripts/crit2-motion.mjs` |
| Motion | `crit/motion.webm`, `motion-reduced.webm`, `motion-mobile.webm`; frames `crit/frames/NNN.png` (4 fps, frame n = (n-1)/4 s); sheets `crit/sheet-{dg002,interrupt,mobile,reduced,orbs}.png` |
| Measurements | `design-lab/scripts/crit2-measure.mjs` (Still mode, `?fx=off`) |
| Gemini motion critique + cross-check | `design-lab/critiques/c-gemini-motion.md` |

---

## 1. Hierarchy

| # | Finding | Evidence | Sev | Suggestion (C's own style) |
|---|---|---|---|---|
| H1 | The type scale is flat, and the closing line is the loudest thing on the page. At 1440: H1 66px, H2 57px, record title 53px, footer close 86px. H1:H2 is 1.16; the close is 1.3x the thesis | `c.module.css:118` (H2 clamp), spec §2 table; `desk-crop4.png` ("Put your name on one." vs hero `c-hero-desktop.png`) | med | Let the formation be the loud object and set a real ratio: H2 ≤ 44px, record titles ≤ 40px, close ≤ H1. C's drama belongs to the field, not to four competing display sizes |
| H2 | The layer readout, which is the actual information behind the highlight, sits below the fold. At 1440x900 the readout is at y 947–992; at 1280x800, y 906–951 | `crit2-measure.mjs` output; `crit-d-layer.png` (legend row 3 cut off at 900) | high | Put the readout inside the stage, bottom-left under the crop mark, in Martian Mono, as an instrument caption. The stage is the viewport, so the reading should be on it |
| H3 | Labels change before the image does. The stage tag and caption swap instantly via `:has()`, while particles take 1.25s, so "DG-003 · BLANK LINE" and "BUILT BY" sit over the glasses | `crit/sheet-interrupt.png` frames 057–058; `HeroFormation.tsx:290-297` | med | Tie the tag to the morph: cross-fade it at p ≈ 0.6 (expose `p` from `FormationCanvas` through the existing `live` ref). The label should land when the form does, like a readout settling |
| H4 | The workflow appears 3 times (hero caption, DG-001 record, stages section) and ownership rules twice (DG-001 record, "1" row) | `content.ts:93,147-148`; `page.tsx:238-248`; `desk-crop1.png`, `desk-crop3.png` | low | Keep the workflow in one place: the stages section. In the record, replace it with a link-chip "→ How a build runs". The record is evidence; the process section is the method |

## 2. Typography

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| T1 | Footer wordmark still splits as "DIGIT AL". The nav wordmark got `letter-spacing: 0.08em`; `.footName` has none | `desk-crop4.png` footer; `c.module.css:1369-1374` vs `:206-210` | low | Give `.footName` the same tracking (or a shared `.wordmark` class). Clash's T/A pair needs it everywhere |
| T2 | The H1 runs 4 lines at 1440 (y 144–402) in a 5-col column, pushing the picker and CTA to y 797–845 | `crit2-measure.mjs`; `c-hero-desktop.png` | med | Widen the copy column to 6/12 at ≥1200 or hold the H1 at 3 lines. The picker is C's real call to action; it should sit above y 700 |
| T3 | Clash 600 is right for C, and the −0.01em tracking holds. Mono stays scoped to metadata, which is good discipline | `c-hero-desktop.png`, `desk-crop1.png` field keys | — | Keep. One addition: set the HUD word (`.hudWord`) in Martian Mono, not General Sans. It is an instrument readout, and it would echo the mono stage tags |
| T4 | "NO SIGNAL" tag plus "BUILT BY ______ [placeholder]" prints two empty-state systems in one cell | `desk-crop1.png` (Built by row), `content.ts:152,172` | low | Pick one. C's device is "No signal"; drop the underscores there and save `______` for the DG-003 row only |

## 3. Distinctiveness

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| D1 | The hero is the most original object in the lab: one point buffer, three forms, each computed from `lib/data`. Signing the line is the only interactive version of the shared "BUILT BY ______" device across all six concepts | `geometry.ts`, `crit-d-signed-long.png` | — | Protect it. Every fix below is about making it read better, not about adding more |
| D2 | **The shared device, earned or generic?** In the hero it is *earned*: the visitor types a name and the build material re-forms into it. Elsewhere it is *generic*. It appears 4 more times (2 record cells, the DG-003 row "Unsigned ______", and the footer "Put your name on one." over a drawn X-and-line), and those last 3 are the same seeded close all six concepts converged on | `desk-crop1.png`, `desk-crop2.png`, `desk-crop3.png` (DG-003 row), `desk-crop4.png` (footer); CONTEXT-PACK §6 direction 10 | med | Only C can make the footer *remember*. If the visitor signed in the hero, the footer line carries their name in the same dot language (a static `dotPath` of `nameToPoints`, no WebGL needed) with "Still in this tab. Bring it Thursday." If they didn't sign, the line stays blank and the close reads as a question to that blank. Then drop the static X-and-line SVG and the underscores in the DG-003 row. One signature, two appearances, both computed |
| D3 | Below the hero, C stops using its own material. Records use striped photo plates, and the stages use a third-party orb library with a different dot vocabulary | `desk-crop1.png`, `desk-crop2.png` (2 plates, ≈700x395 each); `desk-crop3.png` (orbs); `BuildStages.tsx:243` | med | Reuse `geometry.ts` downstream: each record's left plate becomes that build's dot poster (the phone stack, the glasses), and each stage mark becomes a small static poster from the same field (plan = outline only, prototype = loose layers, test = one scrambled layer, integrate = the stacked phone). The whole page is then drawn in one material, which is what C's thesis says |
| D4 | Particle field on near-black risks the "generic AI landing" read. The morph midpoint is a formless cloud and the glasses carry a dust halo | `crit/sheet-dg002.png` frame 043; `crit/sheet-interrupt.png` frame 061; `state-d-reading.png` | med | Keep the edges legible during the sweep: lower the z-arc (`FormationCanvas.tsx:74`, 0.3 → ~0.12) and cut glasses dust ~50%. Each frame should still look drawn, never like a nebula |

## 4. Usability

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| U1 | **Still mode breaks signing.** The name is SVG `<text>` at a fixed `font-size: 0.34px` with no fit, so 19 chars clip to "Okonkwo-Ram". The Still "blank line" is also a dot blob above the line, because `signCloud(null)` fills the name slot with `unformed()` points. Still mode is what reduced-motion users, no-WebGL visitors and low-power touch devices get by default | `crit/crit-d-rm-signed-long.png`; `c.module.css:532-537`; `HeroFormation.tsx:262-266`; `geometry.ts:434-438`; `HeroFormation.tsx:41-51` | **high** | Render the Still name as dots too: on input, `dotPath(signCloud(nameToPoints(...)))` already exists in the pipeline and has the same fit as Live. For the unsigned poster, place the name-slot points *on the baseline* (a dense line) rather than in a blob, so "blank line" is literally a blank line |
| U2 | Nav label "Studio" points to `#process`, a section titled "How a build runs" | `page.tsx:27-31`; `desk-crop3.png` | med | Rename to "Process" or "How it runs". C's IA has no Studio section |
| U3 | Render toggle buttons are 36px tall, under the 44px target (known gap, §10 of spec) | `c.module.css:751-753` | low | 44px min-height; it costs 8px of a caption that already has room |
| U4 | Interrupting a morph snaps the field back to the previous keyframe before re-morphing | `crit/sheet-interrupt.png` frames 059→060; `FormationCanvas.tsx:179-181` | med | See Motion M1 |
| U5 | Legend buttons render only after hydration, so without JS the hero has no subsystem list | `HeroFormation.tsx:316` (`mounted` gate); `fallback/c-1440-nojs.png` | low | Acceptable because the DG-001 record has the full `<details>` list. Add a no-JS text link "7 subsystems ↓" to `#c-dg-001` in the caption |

## 5. Brand fit

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| B1 | Strong fit for "creative technology collective + engineering lab": one accent, 0 radius, no glow, no gradients, real data driving the art. Copy is concrete ("Evidence, field by field.", "Thursday is build night.") with 0 banned phrases | `content.ts`; `c-desktop.png` | — | Keep |
| B2 | `#ff5a36` drifts from production `#d8412f`. It is justified for AA on graphite (6.3:1), but it is fully saturated (HSL S 100%), which the Taste lens flags as an AI-tell | spec §2 colour table | low | Try `#f0573a`–`#e8553a` and re-check AA (it should stay ≥4.5:1 on `#0c0c0b`). Solder, not neon |
| B3 | Meta-copy explains the design instead of the build: "The marks below are the stages, not a progress bar: the current phase is still being confirmed." | `content.ts:204`; `desk-crop3.png` | low | Cut to one fact: "Every subsystem passes the same four stages." Put "phase: No signal" in the record, where C's honesty device already lives |

## 6. Project storytelling

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| P1 | The phone formation is 7 plates in data order. Selecting a layer colours it, but nothing in the drawing says *why* it is that layer (what it touches, where it sits) | spec §14 risk 2; `crit-d-layer.png` | med | Use C's own scroll-spread mechanic on selection: the picked layer lifts out of the stack (an exploded pull along `uAxis`), and the readout names it. "Take one apart" becomes literal, and the spread motion gains a purpose it lacks today (M3) |
| P2 | DG-001's record is 6 of 10 fields "No signal" (Toolchain, Duration, Outcome, Built by, Partner, Repo). Honest, but the visual weight of the record goes to absences plus a ≈700x395 empty plate | `desk-crop1.png`; `content.ts:149-154` | med | Group the absences into one "No signal yet" strip at the bottom of the field list (keys in a row, one shared reason), so the 4 real fields lead. Same honesty, less noise |
| P3 | DG-002 storytelling is the best on the page: the problem line, the RSVP reader with a real pace slider, and a real mentor | `desk-crop2.png`; `RsvpReader.tsx` | — | Move the reader above the fold of the record (it already is) and make the photo plate a small thumbnail beneath it |
| P4 | Venture Studies gets a single row with two learnings, which is honest but has no visual | `desk-crop2.png` bottom | low | A third, tiny formation (a dot ledger or bar of the scope→budget mapping) is not warranted without data. Leave it, but align its right column with the DG-003 row (learnings start at x 879, the DG-003 link at x 861 in `desk-crop2.png`/`desk-crop3.png`) |

## 7. Responsiveness

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| R1 | Mobile hero is ~1.8 screens: the primary CTA is at y 1479px on 390x844. Page height is 9,030px | `crit2-measure.mjs`; `c-hero-mobile.png` | med | Under 600px, move "See the builds" up beside the picker legend, and collapse the caption fields to one line (ID · status). The spec already flags the length (§14 risk 5) |
| R2 | At 834 the stage spans the full width (≈640px tall) and the picker starts at y ~985, below the fold | `c-hero-tablet.png` | med | At 600–899, cap the stage at `min(56vh, 6:5)` or put stage and picker side by side (stage 7/12, picker 5/12). The picker is what makes the stage meaningful |
| R3 | The HUD word is 12px on mobile (`clamp(12px, 2.3cqw, 24px)` on a 358px stage) | `c.module.css:574`; `crit/sheet-mobile.png` panel 3 | med | Floor at 16px, or on <600px echo the current word in the caption under the stage at 24px. A reading aid demo has to be readable |
| R4 | 0px horizontal overflow at 390/834/1440 (DA-C check) and the `<details>` menu works without JS | spec §8, §15 | — | Keep |

## 8. Implementation feasibility

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| F1 | Sound architecture: R3F lazy via `next/dynamic` (`ssr:false`), `frameloop="demand"`, `never` offscreen, one draw call, capability gating. Static-export safe | `FormationCanvas.tsx:253-267`; `HeroFormation.tsx:23,41-51` | — | Keep |
| F2 | ~154 KB of SSR poster path markup (3 posters inlined) | spec §11 | med | Emit the three posters at build time as static `.svg` files (a small script over `geometry.ts`) and swap `<use href>`/`<img>`. It also fixes U1 cleanly if the name poster is generated client-side only |
| F3 | Production depends on the Fontshare CDN (licence forbids self-hosting), and the sign rasterizer depends on that font loading | `layout.tsx:322-326`; `HeroFormation.tsx:157` | low | Acceptable. Keep the `fonts.load` guard and document the CDN dependency for the production decision |
| F4 | Bundle sizes not measured (`next build` would collide with the shared dev server) | spec §11 | low | Measure in a throwaway worktree before any production pick |

## 9. Motion quality (§34; full detail in `c-gemini-motion.md`)

| # | Finding | Evidence | Sev | Suggestion |
|---|---|---|---|---|
| M1 | Mid-morph interrupt jumps back to the previous keyframe (position discontinuity) | `crit/sheet-interrupt.png` frames 059→060; `FormationCanvas.tsx:179-181` | **high** | If the new target equals `from`, reverse in place (`swap; p = 1 - p`). Otherwise bake the current blend into the idle 4th slot (`aPos3`, which already ping-pongs) and morph from it. Interruptible motion is the bar for an instrument |
| M2 | Labels lead the morph by up to 1.25s | see H3 | med | see H3 |
| M3 | Purpose audit: picker morph = explains (the same material, different build); layer highlight = explains; HUD stream = explains; sign = explains (in Live); **pointer push = decorates** (it scatters a drawing that exists to be inspected); **scroll spread = half-purposeful** (nice, but nobody is looking at the hero while scrolling away) | `HeroFormation.tsx:112-125,169-180` | med | Turn the probe into a lens: points within the radius brighten and the nearest layer's name shows in the stage caption (no displacement). Move the spread from scroll to selection (P1) |
| M4 | The 1.5s HUD start is a hard-coded timeout, not tied to morph completion. In practice the gap after forming is ≈0.25s (frames 045→046), so it works today but breaks if the morph length changes | `HeroFormation.tsx:145` | low | Fire on morph completion via the `live` ref or an `onSettled` callback |
| M5 | Reduced-motion parity is good apart from U1: no autoplay, instant swaps, static orbs, Live disabled, 0 console errors in all 3 recordings | `crit/sheet-reduced.png`; `motion-reduced.webm` | — | Fix U1, then parity is complete |
| M6 | The stage orbs move only on hover and the change is barely visible at 64px in a 316px cell | `crit/sheet-orbs.png` frames 110–119 | low | Folded into D3: static dot posters from `geometry.ts`, with the "test" scramble as the one hover motion |

---

## Gemini: agreements and disagreements (summary)

- **Agree:** interrupt snap (cause corrected: position, not velocity), pointer push is decorative, layer highlight reads, the mobile HUD word is too small.
- **Disagree:** "1.5s dead zone" (measured ≈0.25s), "scroll spread is linear/unsmoothed" (already eased k=8/s), "re-rasterizes on every keyup" (debounced 280ms), "name illegible" (legible at 1440 Live), "reduced-motion perfect" (missed U1, the clipped Still signature).
- **Gemini missed:** labels lead particles (H3), the formless midpoint (D4), and the Still clip (U1).

## Top 5 fix-now

1. **Fix Still-mode signing** (U1, high). Draw the Still name as dots via `signCloud(nameToPoints())` and lay the unformed name slot on the baseline. `HeroFormation.tsx:262-266`, `geometry.ts:434-438`.
2. **Make morphs interruptible** (M1, high). Reverse in place or bake the current blend into `aPos3`. `FormationCanvas.tsx:174-183`.
3. **Put the layer readout on the stage** (H2, high) so the explanation is visible with the highlight at 1440x900 and 1280x800.
4. **Sync labels to the form** (H3/M2, med). Cross-fade the stage tag and "Built by" at p ≈ 0.6.
5. **Earn the signature once** (D2/D3, med). Footer line remembers the hero signature in dots, the records and DG-003 row drop the underscores, and record plates become each build's own dot poster.

Later: flat type scale (H1), 834/390 hero length (R1/R2), HUD word floor 16px (R3), "Studio" nav label (U2), footer "DIGIT AL" tracking (T1), 36px toggle (U3), static poster files (F2).
