Here is a detailed motion design critique of the prototype, comparing the default (FILE 1) and reduced-motion (FILE 2) behaviors based on the provided design intent.

**1. Timing / Pacing**
*   **00:08–00:10:** The drag interaction is highly responsive, tracking the pointer with zero perceived lag. 
*   **00:10:** The drop animation resolves quickly. The ~120/180ms durations are snappy and prevent the interaction from feeling sluggish.
*   **00:08–00:11:** The RSVP demo flashes at 200 wpm. This pacing is intentionally fast to simulate speed-reading, but it remains readable because it acts as the singular focal point on that side of the screen.

**2. Easing Quality**
*   **00:08:** The pickup easing (cubic-bezier) feels immediate and natural, lifting the sticker off the page smoothly.
*   **00:10:** The drop physics perfectly match the intent. The high stiffness (520) and low damping (26) create a sharp, energetic "slap" with a satisfying micro-bounce that feels physical without being overly cartoonish.

**3. Purpose of Each Motion**
*   The strict "nothing moves unless you move it" intent is successfully upheld. There are no decorative scroll reveals or idle floating elements (00:04–00:06, 00:16–00:20), which keeps the cognitive focus entirely on the interactive builder club tasks.
*   **00:08–00:10:** Drag/drop motions carry crucial state (claiming a seat).
*   **00:08–00:11:** The RSVP demo is decorative/illustrative, providing a narrative explanation of the DG-002 project.

**4. Readability During Motion**
*   **00:04–00:06 / 00:16–00:20:** Because there are no scroll-triggered animations, page readability remains exceptionally high while navigating.
*   **00:08–00:11:** The RSVP flashing text uses high contrast and a large, legible font inside the glasses, ensuring the rapid motion doesn't compromise the ability to read the words.

**5. Drag Feedback**
*   **00:08:** Pickup feedback is excellent. The rotation (-3deg), scale increase, and hard shadow clearly detach the sticker from the tray.
*   **00:09:** **Over-target feedback is missing.** When the dragged sticker hovers over the "Hardware / PCB" box, neither the box nor the button changes visually. The drop zone is completely ambiguous.
*   **00:10:** Drop feedback is definitive and satisfying due to the spring animation.
*   **00:12:** **Hover state is missing.** The design intent states that hovering a DG-001 seat should invert the phone layers in the pixel drawing. This does not occur; the drawing remains static.

**6. Reduced-Motion Parity (FILE 1 vs. FILE 2)**
*   **00:10 (Pass):** In FILE 2, the spring drop animation is correctly removed. The sticker snaps into place instantly.
*   **00:08–00:11 (Fail):** In FILE 2, the rapid RSVP flashing text still autoplays. This is a significant accessibility failure; flashing elements must be paused, hidden, or slowed down for users requesting reduced motion.
*   **00:08 (Partial Fail):** In FILE 2, picking up the sticker still applies the -3deg rotation. While scale and shadow are necessary to communicate state (lifted), rotation is decorative and should be omitted in reduced-motion mode.

**7. Continuity**
*   **00:03, 00:06, 00:10, 00:17, 00:20:** Data propagation is flawless. The typed name instantly updates the large sticker, the sticky tray, placed seats, the summary sheet, and the footer signature.
*   **00:11, 00:16:** The sticky tray correctly updates its state to reflect the number of claimed seats dynamically.

**8. Frame Timing / Jank / Layout Shift**
*   **00:10 & 00:15:** Dropping or keyboard-placing a sticker replaces the smaller "Put [Name] here" button with a larger visual element. The layout handles this perfectly without causing any vertical shifting or jitter in the parent card. 
*   **00:04–00:06:** Scrolling performance is smooth and jank-free.

---

### Top 5 Highest-Impact Motion Fixes

1.  **00:08–00:11 (FILE 2):** **Accessibility Violation.** Disable or pause the autoplaying RSVP flashing text inside the glasses when `prefers-reduced-motion: reduce` is active.
2.  **00:09 (FILE 1 & 2):** Add visual over-target feedback. When dragging a sticker over a seat card (like Hardware / PCB), the background should highlight or the border should change to clearly indicate a valid drop zone.
3.  **00:12 (FILE 1):** Implement the missing design intent: hovering over a DG-001 seat must invert the corresponding phone layers in the pixel drawing on the left.
4.  **00:15 (FILE 1):** Keyboard placements are currently completely instant. Apply the same satisfying spring "slap" animation to keyboard placements (Enter key) that pointer users get on drop (00:10), ensuring equal interaction feedback.
5.  **00:08 (FILE 2):** Remove the decorative -3deg rotation from the drag overlay in reduced-motion mode. Rely exclusively on the scale and hard shadow to communicate that the item has been picked up.
---

## Orchestrator cross-check

CRIT-5 (concept E's lens), 2026-10-02. Model: gemini.mjs default (`gemini-pro-latest`); it ran without a timeout, so the flash fallback was not needed.
Inputs: `renders/f/crit/motion.webm` (FILE 1) and `renders/f/crit/motion-reduced.webm` (FILE 2), both 1440×900, recorded by `design-lab/scripts/crit5-f-motion.mjs`. Beat log: `renders/f/crit/motion-beats.txt`.
Frames: `renders/f/crit/frames/NNN.png` and `frames-r/NNN.png` at 4 fps, so frame N is at t = (N−1)/4 s. Contact sheets: `renders/f/crit/cs1–cs4.png` and `cs1r.png`. Both recordings: 0 console errors.

### Agreements (verified in frames, code or measurements)

| # | Gemini claim | Evidence |
|---|---|---|
| 1 | Pickup reads well: the tag lifts, tilts and casts a hard shadow | `frames/040.png` (lifted tag over the DG-001 field table); `f.module.css:404-408` |
| 2 | The drop "slap" is physical and quick | `frames/044→048`; `Bench.tsx:123-127` spring 520/26 gives a damping ratio of ≈0.57 (≈11% overshoot, settles in about 250 ms) |
| 3 | No scroll reveals or idle motion, so the page reads cleanly while scrolling | `frames/020–030` and `068–090`: content is final at every frame |
| 4 | Continuity is strong: name → hero sticker → tray → seat → sheet → footer | `frames/014` (hero "Danny"), `048` (tray "Your tag is on DG-001 · Hardware / PCB"), `074` (sheet Owner = Danny), `082/090` (footer "Danny" at display size) |
| 5 | Reduced motion removes the spring | `MotionConfig reducedMotion="user"` (`SignProvider.tsx:75`); `frames-r/046` shows the tag already settled |
| 6 | The phone-layer hover is not visible in the video | Agree on what the user sees, not on the cause. See disagreement D3 |
| 7 | The drag overlay still tilts −3° under reduced motion | True (`.tagLifted` is not in the reduce block, `f.module.css:1399-1408`). Severity is low: it is a static pose, not movement |

### Disagreements (Gemini is wrong or overstated)

| # | Gemini claim | What the evidence shows |
|---|---|---|
| D1 | "Over-target feedback is missing" at 00:09 | **Wrong.** `frames/044.png` (t=10.75 s): Hardware / PCB gets a red tint and a solid border while the tag is over it. In `frames-r/040.png` the same appears under reduced motion. While dragging, seat buttons hide and the other seats switch to solid ink borders (`f.module.css:1434-1440`) |
| D2 | "RSVP still autoplays in FILE 2", called an accessibility violation | **Wrong.** `frames-r/030, 034, 038, 044` (`rsvp-r.png`) show the lens fixed on "The" with a "Play at 450 wpm" button. `Rsvp.tsx:51-53` returns before the observer when reduce is set. The real reduced-motion gap is the reverse: the lens shows **one word** ("The"), and the full sentence exists only as screen-reader text (`Rsvp.tsx:83`), so sighted reduced-motion users lose the demo's content |
| D3 | "Hover phone-layer inversion not implemented" | **Wrong cause.** It is implemented (`Bench.tsx:362-365`), but it happens off-screen. With DG-001 seats in view, the figure sits at viewport y −235…−58 and under the sticky tray (measured; `renders/f/crit/f-crit-sticky-1440.png`). Inverted layers peek out under the tray in `drop-tile.png`. Cause and effect are never on screen together |
| D4 | "Keyboard placements are instant, with no slap" | **Not supported.** The spring sits on the placed tag's `motion.span` whatever the input (`Bench.tsx:122-127`), so the button/Enter path gets the same `initial→animate`. At 4 fps the 250 ms settle falls between frames (`frames/058→062`) |
| D5 | "Tray shows the number of claimed seats" | Overstated. There is one tag. The tray names the single seat that holds it (`frames/048`, `Bench.tsx:319-327`) |
| D6 | "RSVP at 200 wpm, readable as the single focal point" | Partly wrong. It plays **during** the drag task: lens words change "arrive → right → look." in `frames/030–044` while the visitor drags beside it. Two motions compete in the one moment F wants the visitor's full attention |

### Found by the cross-check, missed by Gemini

1. **Autoscroll is fast.** Holding the dragged tag 20 px from the bottom edge scrolls about 1,545 px/s (default motion) and about 1,686 px/s (reduced motion). That is more than one record per second, so a pointer drag to an off-screen DG-002 seat overshoots (measured with Playwright; my first take of this video dropped onto the wrong place for that reason). dnd-kit `autoScroll` is left at its defaults (`Bench.tsx:376-387`).
2. **The sign field is below the fold at desktop sizes:** the `#f-sign` top is at 862 px of 900 at 1440×900, and 833 of 768 at 1366×768. The CTA is at 901 and 872. The first motion F asks for (typing) cannot start without a scroll on common laptops.
3. **The hero reflows on each keystroke.** Line 3 ("[tag] on.") changes width as the name grows (`frames/004` vs `014` vs `020`). This is intentional, but "on." jumps about 30 px per character on the first letters.
