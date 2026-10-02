Here is a critique of the homepage prototype motion design, analyzing both the standard and reduced-motion versions against the stated constraints.

### Axis Critique

**1) Timing (durations, stagger, delays)**
*   **V1 [0:00–0:02] | Severity: Low:** The initial entrance delay feels slightly sluggish. The 60ms stagger on the hero text is acceptable, but the ledger on the right appears disconnected from the primary sequence, fading in late.
*   **V1 [0:21–0:24] | Severity: Med:** Clicking the brief CTA triggers a strictly sequential animation: the dialog fully closes, *then* the page initiates a long smooth-scroll. This feels disjointed; the scroll should begin slightly before the modal fully disappears to bridge the context switch.

**2) Easing (mechanical, springy, premium)**
*   **V1 [0:14–0:17, 0:19–0:21] | Severity: Med:** The shared-layout morph uses a spring with noticeable bounce (`stiffness: 420, damping: 40`). For a "restrained startup/product-studio register," this bouncy elasticity feels out of character. A tighter, critically damped spring or a standard ease-out would feel more premium and serious.

**3) Purpose of each motion (state change vs. decoration)**
*   **V1 [0:00–0:02] | Severity: High:** The design rule states "motion is supposed to appear ONLY where it carries a state change." The initial CSS rise and stagger on page load are purely decorative entrance animations, directly violating the core design constraint.
*   **V1 [0:07–0:13] | Severity: Low:** The progress rail and highlighting clearly communicate state changes as the user scrolls, serving a valid functional purpose.

**4) Readability during motion**
*   **V1 [0:07–0:13] | Severity: Med:** During the smooth-scroll scrub, the dense text paragraphs on the right move too quickly to be read comfortably while in motion. The user is forced to stop scrolling entirely to consume the content.
*   **V1 & V2 [0:24–0:31] | Severity: Low:** The RSVP text flashes rapidly, which inherently challenges readability, but this is the explicit mechanical purpose of the UI component being demonstrated.

**5) Continuity of shared-layout transitions**
*   **V1 [0:14–0:17] | Severity: High:** The layout morph fails to maintain true object continuity. It operates as an expanding container where the row content crossfades out and the modal content crossfades in. Key identical elements—specifically the project ID and title ("DG-001", "The Modular Smartphone")—do not travel smoothly from their origin coordinates to their destination coordinates. The scrim also snaps in too abruptly.

**6) Scroll-scrub pacing**
*   **V1 [0:07–0:13] | Severity: High:** The pacing is severely front-loaded. The exploded-phone schematic separates into its 7 layers entirely within the first 1-2 steps of the scroll distance. For the remaining 5 steps, the phone geometry remains static (dead scroll), only updating the red text labels. The structural expansion should map to the entire scroll height.

**7) Reduced-motion parity**
*   **V2 [0:24–0:31] | Severity: High (Critical):** The RSVP reading demo still flashes rapidly at 450 wpm and 250 wpm when `prefers-reduced-motion: reduce` is active. Rapidly flashing large text is a major accessibility violation for users with vestibular or seizure sensitivities. If reduced motion is requested, this component must not auto-play or allow rapid flashing.
*   **V2 [0:00–0:17] | Severity: Low:** The removal of the smooth scroll, the removal of the entrance stagger, and the instant modal appearance correctly map to standard reduced-motion expectations.

---

### Top 5 Concrete Fixes Ranked

1.  **Resolve RSVP Accessibility Violation (V2):** When `prefers-reduced-motion` is true, disable the automatic "Play" functionality of the RSVP demo. The component should default to a static display of the full sentence, or only permit manual advancing via the "Step" button, removing all rapid frame-replacement animation.
2.  **Enforce Strict State-Change Motion Rule (V1):** Remove the CSS rise and 60ms stagger from the hero text and ledger on initial page load (0:00-0:02). Elements should render immediately in their final resting state, honoring the restraint that motion only exists for state changes.
3.  **Fix Scroll-Scrub Animation Pacing (V1):** Remap the GSAP ScrollTrigger timeline so the 7-layer phone separation is interpolated across the *entire* vertical scroll height of the dark section, rather than completing near the top. The graphic should continuously expand as the user reads through to the 7th step.
4.  **Establish True Shared-Layout Continuity (V1):** Apply individual `layoutId` tags to the specific text nodes (ID, Title, active badge) within the ledger row so they seamlessly translate and scale to their new positions in the dialog header, replacing the current cheap-feeling container crossfade.
5.  **Stiffen the Dialog Morph Easing (V1):** Change the `motion.dev` spring settings on the modal open/close transitions from `stiffness: 420, damping: 40` to a stiffer, non-bouncing value (e.g., `stiffness: 300, damping: 30`, or a simple `easeOut` of 0.3s) to align with the restrained, premium brand register.
---

_Run note (CRIT-4): model = gemini.mjs default (`gemini-pro-latest`), no timeout, no flash fallback. Inputs: `design-lab/renders/e/crit/motion.webm` (normal, 33 s) and `motion-reduced.webm` (prefers-reduced-motion, 27 s), both 1440x900, recorded by `design-lab/scripts/crit4-e-record.mjs`. Prompt covered the §34 axes (timing, easing, purpose, readability, shared-layout continuity, scrub pacing, reduced-motion parity)._

## Orchestrator cross-check

Method: `ffmpeg -vf fps=4` → `renders/e/crit/frames/` (133 frames) and `frames-reduced/` (110 frames). Read as labelled 3x3 sheets: `renders/e/crit/sheet-{load,scrub-a,scrub-b,morph,close,jump}.png`, `sheet-reduced-mid.png`. Checked against `app/design-lab/e/` source.

### Agreements (verified)

| # | Gemini claim | Evidence | Verdict |
|---|---|---|---|
| 1 | Scrub is front-loaded; explode finishes in the first 1–2 steps, then 5 steps of static geometry | `PhoneSequence.tsx:55` explode runs `top 75%`→`top 10%` (~585 px) while the steps list is 7 × 342 px = 2,394 px (measured). Frame 28 is already fully exploded; frames 28–45 only swap highlights | Agree. ~24% of the story's scroll distance carries the explode |
| 2 | Hero entrance is decoration, not a state change | Frames 6–9: frame 6 shows nav + an empty ledger frame with no hero text; thesis readable at frame 8–9 (~0.5–0.75 s later). `e.module.css:216` 720 ms + 60 ms stagger, last row `--i: 7` (≈1.14 s total) | Agree, but severity med, not high: it's CSS-only, so no-JS and reduced motion get the full page at first paint |
| 3 | Brief CTA → case jump is sequential (close, then a long scroll) | Frames 84–90: dialog exits, ledger returns (86), then Lenis flies ~5,000 px through the whole DG-001 band (88) before landing (90). `Ledger.tsx:91-97` waits for `onExitComplete` + 30 ms | Agree. Problem is the fly-through more than the sequencing |
| 4 | Text in the scrub is hard to read while moving | Inactive steps are dimmed to 0.38 (`e.module.css:462`): body text computes to ~2.7:1 and meta to ~2.1:1 on `#111311` | Agree, with a different cause: the dimming, not the scroll speed |

### Disagreements

| # | Gemini claim | Evidence | Verdict |
|---|---|---|---|
| 1 | Spring `420/40` "has noticeable bounce"; suggests `300/30` | Damping ratio = 40 / (2·√(420·0.9)) ≈ 1.03, so it's critically damped with no overshoot. No overshoot is visible in frames 60–61 / 70–71. Gemini's `300/30` (mass 1) ≈ 0.87, so its fix would **add** bounce | Disagree. Keep the spring |
| 2 | ID + title don't travel; it's a container crossfade | `Ledger.tsx:30,35,46` / `241,245,267` share `layoutId` for id, title, status. Frame 60 shows the title already at dialog scale riding the moving container | Mostly disagree. They do travel. The real flaw is on the return path: frame 70 ghosts dialog text over the DG-002 row |
| 3 | Scrim "snaps in" | `Ledger.tsx:224` 320 ms opacity fade; frame 60 shows a partial scrim, frame 61 full | Disagree. That's 4 fps aliasing |
| 4 | RSVP under reduced motion is a "critical" seizure/flash violation | Playback never autoplays (`RsvpDemo.tsx:22`, `playing` starts `false`); it only starts on a user press, with Pause and Step. One word in a ~360×100 px box falls below the WCAG 2.3.1 flash-area threshold. The full sentence is in the caption and SR text | Disagree on severity (low). A reduced-motion nicety would be to default to 250 wpm and label the Play button with the rate |
| 5 | Entrance "violates the core constraint" (high) | Concept spec §4 lists the entrance as intended | Downgraded to med (see agreement 2) |

### Missed by Gemini (found in frames / code)

1. **Highlight zig-zags the stack.** Step order (01→07) ≠ physical layer order (top→back: 05, 04, 01, 03, 02, 07, 06). So the active layer jumps 3rd → 5th → 4th → 2nd → 1st → 7th → 6th (frames 28–45). The scroll goes down; the highlight goes up, then jumps to the bottom. **Med.**
2. **The production cursor leaks into E.** A 28 px ring + 5 px dot follow the pointer in frames 56, 61, 71, 85, 89. DOM check: 2 fixed `aria-hidden` divs, `body { cursor: none }`. Source: `app/layout.tsx:91` `CursorProvider`, not hidden by `app/design-lab/e/layout.tsx:28-35`. **Med.**
3. **Enhancement reflow.** GSAP adds `.seqEnhanced` after hydration: steps grow 141–157 px → 342 px, and the document grows 8,469 → 9,798 px (+1,329). It's below the fold, so CLS is only 0.0005, but anchors resolved before hydration land wrong. **Low.**
4. **Reduced-motion parity holds.** Verified in frames R36–R44: instant dialog, body opacity fade only, no Lenis, no rise, schematic static and exploded. **Pass.**
