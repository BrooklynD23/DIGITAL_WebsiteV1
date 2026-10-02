# Concept C, Gemini motion critique (CRIT-2, §34)

Model: gemini.mjs default (gemini-pro-latest; no timeout, flash not needed). Inputs: `renders/c/crit/motion.webm` (1440x900, live WebGL via SwiftShader), `motion-reduced.webm` (prefers-reduced-motion), `motion-mobile.webm` (390x844 touch). Script: `design-lab/scripts/crit2-motion.mjs`. Gemini output below is verbatim; the orchestrator cross-check follows it.

---

Here is a critique of the prototype based on the provided recordings, evaluating your design intent and execution as a senior motion designer. 

### 1. TIMING
*   **HUD Word Delay (Desktop 00:09–00:12):** The 1.25s morph length is appropriate, but the delay before the text ("The words arrive...") begins streaming in the DG-002 glasses is too long. The morph finishes around 00:10.5, but the text doesn't start until 00:12. This creates a dead zone where the user is waiting for the system to respond. 
    *   *Severity: Medium*
*   **Keystroke Lag (Desktop 00:18–00:21):** When typing in the DG-003 input, the particle formation lags behind the keystrokes. While some delay is inevitable when recalculating target coordinates for 4,900 particles, it currently feels sluggish rather than fluid.
    *   *Severity: Low*

### 2. EASING 
*   **Mid-Morph Interrupt Snapping (Desktop 00:14–00:16):** You specified "smoothstep, no spring overshoot." While smoothstep provides a gentle ease-in/ease-out for a complete A-to-B transition, it fails during the mid-flight interrupt from DG-003 back to DG-001. Because the particles do not preserve their current velocity vectors when the new target is assigned, they abruptly jerk into their new trajectories. This creates a harsh, unnatural corner in the motion path that breaks the physics illusion. 
    *   *Severity: High*
*   **Layer Spread Scroll (Desktop 00:23–00:26):** The layers spread apart as the user scrolls away. The easing here feels entirely linear (tied 1:1 to the scroll wheel delta). Without a slight lerp/spring to smooth out the wheel ticks, it looks mechanical and stutters.
    *   *Severity: Medium*

### 3. PURPOSE 
*   **Pointer Repulsion (Desktop 00:04):** Purely decorative. It scatters the particles and actively works against the goal of showing a structured, engineered build. If the goal is to show a "system," let it be stable. 
    *   *Severity: Low*
*   **Layer Spread (Desktop 00:23):** Highly purposeful. It visually reinforces the "7 subsystems" text organically as the user moves down the page.
*   **Test Orb Scramble (Desktop 00:29):** Purposeful and clever. It executes exactly what the copy ("It scrambles, then clicks back") describes without taking over the screen.
*   **Signature Typing (Desktop 00:18):** Gimmicky. Forming text out of particles fails its primary purpose: being a legible signature line. (See Readability below).

### 4. READABILITY 
*   **Particle Typography (Desktop 00:18–00:22):** The typed name ("Ada Okonkwo-Ramirez") in DG-003 is nearly illegible. 4,900 particles are not enough to clearly define complex serif/sans-serif letterforms, especially when stray "noise" particles are floating in the background. The contrast is terrible. 
    *   *Severity: High*
*   **Mobile HUD Legibility (Mobile 00:10–00:13):** The text streaming inside the glasses lens for DG-002 is completely unreadable on the mobile viewport. The WebGL canvas scales down too much, turning the RSVP text into a pixelated blur.
    *   *Severity: High*
*   **Layer Highlight (Desktop 00:06–00:08):** Highlighting the '04 Operating System' layer works well; the dimming of inactive layers ensures the active one is instantly readable.

### 5. PERFORMANCE SMELL
*   **Scroll Hitching (Desktop 00:23–00:26):** Combining a scroll event listener, 3D camera translation, and particle rendering causes noticeable frame hitching. Even accounting for software WebGL recording, tying complex vertex updates directly to main-thread scroll events is a known performance killer.
    *   *Severity: Medium*
*   **Typing Re-calculation (Desktop 00:18–00:21):** Re-rasterizing text to a canvas, pulling the pixel data, and updating 4,900 particle targets on every `keyup` event causes the main thread to choke, resulting in dropped frames during typing.
    *   *Severity: Medium*

### 6. REDUCED-MOTION PARITY
*   **Execution (Reduced 00:00–00:30):** Executed perfectly. You successfully bypass the morphs and snap instantly to the final states (00:09, 00:14). The HUD text starts immediately without the delay seen in the motion version. The orb scramble is disabled (00:28), and the layer spread is bypassed for a standard scroll (00:23). No critical information is lost.
    *   *Severity: None*

### 7. MOBILE
*   **Canvas Scaling (Mobile entire video):** The hero canvas is forced into a small square at the top of the stack. This ruins the detail of the particle morphs and makes the intricate 7-layer phone model look like a dense, noisy brick.
    *   *Severity: High*
*   **Touch Interactions:** The video does not clearly demonstrate if the pointer repulsion fires on touch (which is good, it shouldn't, as it would block scrolling). The scroll behavior appears standard and unblocked.

***

### Top-5 Fix List (Ranked by Severity)

1.  **Redesign DG-003 Particle Typography (High):** The particle-based name typing is illegible and hurts performance. Replace this by having the particles form an abstract "signature" shape or fingerprint, while rendering the actual typed name in standard HTML/CSS text layered *above* the canvas.
2.  **Fix Velocity on Mid-Morph Interrupts (High):** Do not snap particles to new Smoothstep paths from $t=0$ upon interruption. You must calculate the current velocity vector of each particle at the moment of interruption and blend it into the new trajectory (e.g., using a critically damped spring or a bezier curve that starts with the current velocity derivative).
3.  **Fix Mobile WebGL Scaling (High):** The canvas is too small on mobile. Either increase the particle size/thickness on mobile to compensate for the smaller viewport, or simplify the mobile geometry (e.g., only show the outer shell of the phone, hide the internal layers) so the forms read clearly.
4.  **Remove HUD Text Delay in DG-002 (Medium):** Tie the start of the RSVP text stream to a morph completion threshold (e.g., when 90% of particles have reached their target) rather than a hardcoded timeout, eliminating the 1.5s dead zone.
5.  **Smooth the Layer Spread on Scroll (Medium):** Decouple the 3D layer separation from raw scroll ticks. Read the scroll position in an animation loop via `requestAnimationFrame` and `lerp` the separation value to smooth out wheel hitching and prevent dropping frames.
---

## Orchestrator cross-check

Method: read 136 frames at 4 fps (`renders/c/crit/frames/NNN.png`, frame n = (n-1)/4 s), contact sheets `crit/sheet-dg002.png` (frames 039–058) and `crit/sheet-interrupt.png` (frames 056–063, stage crop), still states `crit/crit-{d,d-rm,m}-*.png`, and the source in `app/design-lab/c/`.

### Agree

| # | Gemini claim | Evidence | Notes |
|---|---|---|---|
| 1 | Mid-morph interrupt jumps (high) | `sheet-interrupt.png`: frame 059 shows the glasses smearing toward DG-003; frame 060 (after DG-001 is picked) shows the glasses re-formed, then the morph to the phone restarts. Code: `FormationCanvas.tsx:179-181` resets `from` to a stored keyframe (`m.p >= 0.5 ? m.to : m.from`) and `p = 0`, so the field snaps from its blended position to a keyframe | Cause is a **position** discontinuity, not lost velocity as Gemini says. Fix: when the new target equals `m.from`, swap and set `p = 1 - p` (reverse in place); otherwise bake the current blend into the idle 4th slot (`aPos3`, which already ping-pongs for signatures) and morph from there |
| 2 | Pointer repulsion is decorative (low) | `HeroFormation.tsx:169-180`, shader push `FormationCanvas.tsx:79-82` | It scatters a drawing that exists to be inspected. Make the probe *reveal* instead (see c-by-b.md, motion) |
| 3 | Layer highlight reads well | `crit-d-layer.png`: layer 04 in solder, others at 40% | But its readout sits below the fold at 1440x900 (y 947–992), so the explanation is not visible when the highlight is |
| 4 | Mobile HUD word too small (Gemini: high; I rate med) | `.hudWord` `clamp(12px, 2.3cqw, 24px)` (`c.module.css:574`) resolves to 12px on the 358px stage (`crit2-measure.mjs`); `sheet-mobile.png` panel 3 | Readable, but a 12px word is a poor demo of a reading aid. Floor it at 16px or show the word in the caption under the stage on narrow screens |
| 5 | Orb "Test" scramble is purposeful | frames 110–119 (`crit/sheet-orbs.png`, hover from frame 110) | Agree on meaning, but at frame scale the 64px orb change is barely visible inside a 316px cell; the other three orbs are near-identical dot balls at 64px (`desk-crop3.png`) |

### Disagree

| # | Gemini claim | Why it is wrong or overstated |
|---|---|---|
| 1 | HUD words start ~1.5s after the morph ends ("dead zone") | Frames 045 (glasses formed) → 046 ("The" in the lens): the gap is ≈0.25s. The 1500ms timeout (`HeroFormation.tsx:145`) overlaps the 1.25s morph. Valid smaller point: the delay is a hard-coded timeout, not tied to morph completion |
| 2 | Layer spread is linear 1:1 with scroll and stutters | `FormationCanvas.tsx:234` already eases `explode` with `k = 8/s`; the scroll handler only writes a ref and calls `invalidate` (`HeroFormation.tsx:112-125`). Hitching in the video is SwiftShader software rendering |
| 3 | Typing re-rasterizes "on every keyup", choking the main thread | Rasterization is debounced 280ms and waits for the font (`HeroFormation.tsx:153-167`). The lag Gemini sees is that debounce plus the 1.25s morph, which is a timing choice, not a perf fault |
| 4 | Particle name is "nearly illegible" | `crit-d-signed-long.png`: "Ada Okonkwo-Ramirez" (19 chars) reads cleanly at 1440 Live. Gemini watched a downscaled video |
| 5 | Reduced-motion parity is "executed perfectly" | **Missed the worst bug on the page.** `crit-d-rm-signed-long.png`: in Still mode the name is an SVG `<text>` at a fixed `font-size: 0.34px` (`c.module.css:532-537`, `HeroFormation.tsx:263`) and clips to "Okonkwo-Ram". The Still DG-003 poster is also a dot blob above the line (`signCloud(null)` fills the name slot with `unformed()` points, `geometry.ts:434-438`), so "a blank line" is not blank. Still mode is what reduced-motion users, no-WebGL and low-power touch devices get |
| 6 | Mobile canvas is "forced into a small square" | The stage is full-width (358px) at 390; it cannot be bigger. The real mobile issue is length: the hero CTA sits at y 1479px, ~1.75 screens down (`crit2-measure.mjs`) |

### Gemini missed

1. Labels lead the particles. The stage tag and caption swap instantly through CSS `:has()`, while the field takes 1.25s: `sheet-interrupt.png` frames 057–058 show "DG-003 · BLANK LINE" and "BUILT BY" over the glasses. Fade the tag/label in at `p ≈ 0.6`, or hold the old tag until the morph passes halfway.
2. The morph midpoint is a formless cloud (`sheet-dg002.png` frame 043; `sheet-interrupt.png` frame 061). Shortening the arc `p.z += arc * 0.3` (`FormationCanvas.tsx:74`) or raising the x-rank weight keeps a recognisable edge on screen during the sweep.
