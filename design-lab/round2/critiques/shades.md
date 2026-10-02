# W2-CRIT-SHADES: /design-lab/r2/{signal,apple}/shades

Method: dual-agent. A = isolated design-review sub-agent (read code and stills, never saw detector output). B = this critic (detector, probes, video, Gemini). Read-only run: no code edited, nothing committed.

**Verdict: Signal = fix · Apple = fix.** Neither world needs a rebuild. Both carry the same 3 shared defects:
1. Honesty: the scope list says "Medical claims" are only out of the *first* build.
2. The "Pick your seat." close has no seat to pick.
3. The scanpath figure clips at 390px.

Each world also has one broken signature mechanic:
- **Signal:** the light-path band shows a caption one stage ahead of the lit station, then 2 to 4 empty viewports.
- **Apple:** the light-path clip draws a chip under CONTROL, and its captions run about 35vh ahead of the clip.

## Evidence index

All evidence is under `design-lab/renders/r2/crit/shades/`. Scripts are `design-lab/scripts/r2-crit-shades-{shots,probe,nojs}.mjs`.

| What | Files |
|---|---|
| 10 scroll steps × 2 viewports × 2 worlds | `{signal,apple}-{1440,390}-step00..09.png`; contact sheets `sheet-{signal,apple}-1440.png`, `sheet-{signal,apple}-390.png` |
| Reduced-motion steps | `{signal,apple}-{1440,390}-rm-step00..09.png` |
| No-JS steps | `{signal,apple}-1440-nojs-step0..5.png`, `sheet-nojs.png` |
| Video (load → full scroll → reader: Read, Pause, ←/→, More spacing, speed, Read) | `signal.webm`, `apple.webm`, `signal-rm.webm`, `apple-rm.webm` |
| Frames at 4 fps | `frames/{signal,apple}-NNN.png`, tiles `frames/*-tile-{a,b,c}.png` (0–18 s) |
| Probe (type, contrast, targets, keyboard, spacing, flash) | `probe.json` |
| Detector | `detect.json` |
| Gemini | `gemini.md` |
| Assessment A extra stills | `a-*.png` |

## Gate results (both worlds)

| Gate | Signal | Apple |
|---|---|---|
| Console errors at 1440, 390 and reduced motion | 0 | 0 |
| rAF at rest (`r2-shades-raf.mjs`) | **FAIL at default 2 s settle** (16 at 1440, 20 at 390, all `ticker.ts:29`); **PASS at 6 s settle** in all 6 scenarios. The hero fixate pass (120 ms delay + 1,800 ms) has not settled after 2 s on the dev server. Not a leak | PASS in all 6 scenarios |
| No-JS | PASS. `waitUntil:'commit'` loads in 2.65 s; the W1 hang came from `networkidle` on the dev server's HMR socket. The pin is hidden and the static pair shows; the reader sentence is printed in full; all 6 light stages and the boundary are present. The 5 reader buttons render but do nothing | PASS. Same result: the light pin falls back to the static list |
| Reduced motion | Designed state. Height drops from 12.9 to 11.3 vh; the scanpath pin becomes the static pair; the reader steps one word at a time with a printed note | Designed state. Height drops from 14.1 to 10.6 vh; the light pin becomes the static list; the clips show posters with a "Play animation" opt-in |
| Detector | 1 finding, `codex-grid-background` at `_shades/reader.module.css:24`. It is a **false positive**: the grid is the Signal-only RSVP scope graticule (`[data-variant='signal']`), which is a real measuring surface in this world. Apple's screen has no grid | Same file, same false positive |

### RSVP reader and WCAG

| Check | Result | Evidence |
|---|---|---|
| 2.2.2 Pause, Stop, Hide | **Pass.** Nothing autoplays; the visitor presses Read. Pause works by button and by K. Pause and finish are announced politely, never per word | `Reader.tsx:63-90`; `probe.json` readerKeys: playing → paused, live = "Paused at word 7 of 25." |
| 2.3.1 Three Flashes | **Pass with margin.** Stepping all 25 words, the worst word change alters 4,234 px by ≥10% relative luminance. The 25%-of-10° area limit is 21,824 px, so this is 19% of it. Mean luminance delta is ≤0.0073. Even the fastest word (100 ms at 600 wpm, about 10 changes/s) stays under the area threshold. There is no red flash; the red anchor stays fixed | `probe.json` flash (screen 880×300 CSS px) |
| Keyboard | **Pass.** Native buttons and range input; ←/→ step and K toggles while focus is in the reader; a 2px focus ring on every stop. **Gap:** K and the arrows are never shown on screen (`kVisible:false`); only `aria-keyshortcuts` carries them | `probe.json` keyboard; `*-kbd-reader.png` |
| Reduced motion | The primary control becomes "Next word" and a note explains why. **Gap:** the speed slider stays visible but does nothing, because `wpm` is read only by the playing timer | `Reader.tsx:40-50, 196-210`; `apple-rm.webm` about 20 s |
| Sighted parity | **Gap.** With JS on and motion allowed, the full sentence is sr-only (`Reader.tsx:204`, `reader.module.css:363`). Sighted readers can never see the whole sentence, even after "done" | `a-signal-1440-reader-done.png` |

### Readability (the page has to model it)

| Measure | Signal | Apple | Target |
|---|---|---|---|
| Body face | Atkinson Hyperlegible Next 400 on every lead and body | Atkinson **600** on leads (`apple.module.css` lead), 400 on body | Atkinson; BDA guidance prefers regular weight for running text |
| Lead measure | 39–49 characters per line (heroLead 540 px, lead 528 px) | 39 characters per line (640 px) | 45–75 |
| Reader sentence measure | 73 characters per line (682 px) | 73 characters per line | 65–75 |
| Line height, standard | 1.5 | **1.45** (heroLead 30.45/21; 390 lead 24.65/17) | ≥1.5 (BDA) |
| More spacing | Applies page-wide: +0.05em letters, +0.16em words, line height 1.75. Remembered via localStorage | Same values | Matches `--reading-spaced-*`. The world CSS hard-codes the numbers instead of using the tokens (`signal.module.css:67-69`, `apple.module.css:79-81`) |
| Contrast | Body 7.79:1, readouts 16:1, `[confirm]` 5.54:1 | Body 5.07–8.16:1, `[confirm]` 4.66–8.16:1 | Passes AA everywhere measured |
| Smallest text | **"Illustrative, not recorded data" and the axis labels at 7.9 px** (reduced-motion and no-JS pair, 1440) **and 9.1 px** (390) | Same note at 9.1 px at 390; the lens word "here" at 11.9 px at 390 | ≥12 px; for this audience ≥13 px |
| Monospace on prose | Krypton 12–13 px carries `[confirm]`, the "Is / Is not" labels on the boundary, the definition "RSVP: rapid serial visual presentation" (`page.tsx:62`) and the "More spacing / Standard" chip | Geist Mono only on `[confirm]` and figure notes | The contract allows Krypton "only on true readouts" |

### The two figure labels drawn inside aria-hidden SVG

| Label | Screen readers | Sighted readers |
|---|---|---|
| "Illustrative, not recorded data" (`_shades/Scanpath.tsx:142`) | **Perceivable.** The `<svg role="img">` label starts "Illustrative scanpath, not recorded data". The Signal pin keeps the "problem" label after it collapses to "still." (minor) | **Barely perceivable:** 7.9–9.1 px Krypton or Geist Mono at ink-3. Fix: render it as an HTML `<figcaption>` at ≥13 px Atkinson |
| "Diagram, not a render [confirm]" (`_shades/LightPath.tsx:166`; Apple clip overlay `LightPin.tsx:41-45`) | **Perceivable.** The wrapper and the CineClip are `role="img"`, labelled "Diagram, not a render, of the SHADES light path…". The `[confirm]` tag is missing from that label | 13.5–18.9 px, contrast 5.54–5.8:1. Fine |

---

## Signal Capture (`/design-lab/r2/signal/shades/`)

### Critique

**Design specificity (A, confirmed by the stills):**
- **Authored for SHADES.** The hero reticle sits on the graticule's centre crosshair, and the red trigger dot is the reader's fixation point (`signal-1440-step00.png`). The staircase trace flattening into "still." is the clearest explanation of RSVP in either world (`frames/signal-tile-b.png`, row 2). No other product could reuse it.
- **Specificity drops after the reader.** The tracks, scope and roles sections become generic dark list rows. The light-path band is mostly empty black.

**Nielsen: 21/32 (Acceptable).** Heuristics 7 and 10 are n/a (Experience page).

| # | Score | Key issue |
|---|---|---|
| 1 Status | 2 | The band caption runs one stage ahead of the lit station: "04 Display" is visible while "Control" is lit (`signal-1440-step05.png`). At 390 the caption area is blank except a lone "[confirm]" (`signal-390-step05.png`) |
| 2 Real world | 3 | Honest axis labels. "CH2" and "More spacing / Standard" are insider terms |
| 3 Control | 3 | Nothing autoplays; pause, step, restart and K all work |
| 4 Consistency | 2 | The spacing setting appears in 2 forms (hero chip, reader pill). The reader's primary button is a solid bone fill, which breaks the line-form state grammar |
| 5 Error prevention | 3 | WPM is clamped; Next is disabled at the end |
| 6 Recognition | 2 | The sentence is hidden for sighted readers; K is not shown |
| 8 Minimalism | 3 | Copy is tight. 5 of 13 viewports are quiet with no artifact |
| 9 Recovery | 3 | Read again, restart and back all work |

**Cognitive load:** 3 of 8 checks fail.
- Working memory: the sentence is never shown whole.
- Minimal choices: the reader row has 6 controls.
- Chunking: 6 out-items and 7 phases.

**Emotional journey:**
- **Peak:** the scanpath collapsing to "still." with the red dot.
- **Valley:** the light-path band.
- **Second valley:** scope, roadmap and roles read like a spec sheet.
- **End:** flat. "Ask on Discord" is a text link, and the footer thesis outweighs the page's own close.

**Personas:**
- **Dyslexic reader:**
  - Cannot re-read the sentence.
  - The "Standard" state word is ambiguous.
  - Krypton 12–13 px carries the definition and the boundary labels.
  - Positive: More spacing changes the whole page and is remembered.
- **Sponsor or faculty skimmer:** the mentor appears only at the end, and "[confirm]" appears 15+ times.
- **Mobile first-timer:** the scanpath clips, there are about 4 near-empty screens in the band, and the global nav shows only "CH1/CH2/CH3" at 25 px wide.

### Audit: 14/20 (Good)

| Dimension | Score | Key finding |
|---|---|---|
| Accessibility | 3 | Keyboard, focus, sr text and reduced motion are done well. Gaps: 7.9–9.1 px figure notes, hidden sentence, K not shown, CH links 25 px wide at 390 (shared WorldNav) |
| Performance | 3 | 0 rAF at rest once settled; the band uses IntersectionObserver with no scroll listener. The hero pass outlasts the 2 s gate |
| Responsive | 2 | The scanpath clips at 390 ("g a line, … then ju", `signal-390-step01.png`). The compact strip stations are about 20 px at 390. 15.2 vh on mobile |
| Theming | 3 | Tokens are used. Spacing values are hard-coded instead of `--reading-spaced-*` |
| Integrity | 3 | Coherent world. The 1 detector hit is a false positive |

### Contract compliance

| Block | Status | Evidence |
|---|---|---|
| THESIS: crosshair = fixation point; refuse the eyewear ad and the explaining paragraph | **Met** | `signal-1440-step00.png` |
| OWN-WORLD: graticule, bone, Hubot Sans, Atkinson for every sentence, Krypton only on readouts, red once per viewport, roadmap all dashed | **Partial** | Krypton sets the RSVP definition sentence (`page.tsx:62`), "Is / Is not" and the spacing chip. Everything else is met; the roadmap is all dashed (`step08`) |
| STORY: eyes jump → collapse → run reader → light path → tracks and boundary → pick a seat | **Partial** | The sequence is right, but "pick a seat" is not actionable: roles are static `<li>` and `join.action` is never rendered (`_content/shades.ts:251`) |
| FIRST VIEWPORT: reticle on the centre crosshair, fixate converging once; 4-word 72 px headline; Atkinson lead; "Try the reader"; spacing toggle upper right | **Met** | The h1 is 72 px with 4 words, and the dot field converges once in 0.5–3.5 s (`frames/signal-tile-a.png`). The CH2 readout sits upper left rather than lower left (cosmetic) |
| SIGNATURE: pinned scanpath staircase flattening into one red dot; live reader with WPM, Read and keyboard | **Met** | `frames/signal-tile-b.png` rows 1–2; `probe.json` readerKeys |
| FORM: Signal Capture, seed 0a795440 | **Met** | |

### Copy budget

| Viewport | Viewports | vh | avg | p90 | max | Quiet (≤12 words) | Result |
|---|---|---|---|---|---|---|---|
| 1440×900 | 13 | 12.9 | 28 | 49 | 74 | 46% | Pass on numbers. **Fails "every quiet viewport shows an artifact"**: steps 05 and 06 are near-empty |
| 390×844 | 16 | 15.2 | 24 | 45 | 54 | 50% | Pass (mobile target is ≥50%) |

All headlines are within budget (2–5 words, cap 8). Leads are ≤20 words. Stage captions are 5–8 words.

### Motion verdict

**Restrained and purposeful.** There are 3 motions:
1. The hero converges once.
2. The scanpath collapse is scroll-scrubbed with CSS `--p`.
3. The reader runs only on demand.

Each carries state. **Pacing is broken in one place:** the band's discrete IntersectionObserver steps plus 6 stage blocks at `min-height: calc(100svh - 150px)` (`signal.module.css:382`) give about 5 vh where the strip barely changes. The caption also arrives below the reading line before its station lights (`Band.tsx:26`, rootMargin -48%). Mid-collapse, the word row ghosts to low opacity while the dots travel and the headlines cross-fade through a near-blank moment (`frames/signal-tile-b.png`, row 1 cols 4–6 and row 2 col 1). This is acceptable but could be tighter.

**Gemini cross-check (frames at 4 fps):**

| Gemini claim | Verdict | Frame evidence |
|---|---|---|
| Reduced-motion parity: the pin becomes a static side-by-side pair and no content is lost | Agree | `signal-rm.webm`; `signal-1440-rm-step*`; `Saccade.tsx:43-55` |
| Reader is usable; the red fixation point is strong | Agree | `a-signal-1440-reader-playing.png` |
| Reduced-motion speed slider is vestigial | Agree | `Reader.tsx` (wpm is used only in the timer) |
| "Headline types out character by character" | **Disagree** | The h1 is static from its first painted frame; only the dot field moves (`frames/signal-tile-a.png`, frames 4–16) |
| Light-path captions "perfectly in sync" | **Disagree** | `signal-1440-step05.png` shows caption "04 Display" while "Control" is lit |
| "No dead viewports" | **Disagree** | `signal-1440-step05/06.png`, `signal-390-step04..06.png` |
| Pin "lacks restraint; several elements animate at once" | Partly agree | It is one figure (words, dots and trace move as a unit). The ghosted word row mid-collapse is the real readability cost |

### Fix now (Signal), ranked

| # | Sev | Issue | Evidence | Fix (Signal grammar) |
|---|---|---|---|---|
| 1 | P1 | The light-path band is out of step and leaves 2–4 dead viewports | `signal-1440-step05.png`, `signal-390-step04..06.png`; `signal.module.css:382`; `Band.tsx:26` | Make it one short timebase: the strip pinned for about 1.5 vh, with the trace advancing station to station. One caption line swaps in place directly under the strip, like a scope's measurement readout. If the list stays, cut `.stage` to about 45svh and set the IntersectionObserver line at the strip's bottom edge, so the lit station and the visible caption are always the same stage |
| 2 | P1 | "Medical claims" is listed under "Not in it", meaning not in the first build. That implies a later build might make them | `_content/shades.ts:206` (rendered `page.tsx:118-124`) | Remove it from the out-list. Add a struck (paused-form) line in the boundary block: "Medical claims: never." Route the copy through brand-voice → brand-guardian |
| 3 | P1 | "Pick your seat." offers no seat | `page.tsx:150-170`; `shades.ts:251` (`join.action` unused) | Make each role row a link with a dashed "open seat" line that turns solid on hover or focus. End on one outlined "Come to build night" action, with the red trigger dot as the "now" marker |
| 4 | P1 | The scanpath clips at 390 | `signal-390-step01.png` | Below 735 px, render the line as 2 rows (4 + 5 words) with 2 short staircases, or fit the viewBox to the column. Never crop the words |
| 5 | P2 | Figure notes are 7.9–9.1 px | `probe.json` text.note and axisLabel; `scanpath.module.css:161-165` | Move "Illustrative, not recorded data" to an HTML caption at ≥13 px Atkinson under the graticule. Keep the axis labels as Krypton readouts at ≥12 px rendered |
| 6 | P2 | Krypton is used on prose (the RSVP definition, Is / Is not, the spacing chip) | `page.tsx:62`, `page.tsx:88-95` | Set the definition in Atkinson as part of the reader lead. "Is / Is not" become Atkinson labels. Krypton stays on WPM, the counter and the axes |
| 7 | P2 | Sighted readers never see the whole sentence | `Reader.tsx:204`; `reader.module.css:363` | On pause or done, print the sentence under the screen as a transcript trace, with the current word underlined. Keep it sr-only only while playing |
| 8 | P3 | K and ← → are never shown. The chip reads "More spacing Standard". The hero pass is longer than 2 s | `probe.json` kVisible:false; `signal-390-step00.png`; raf run | Add a Krypton readout hint "K play/pause · ← → step" inside the screen frame. Make the chip read "Spacing: standard / more" with line form (dashed off, solid on). Shorten the hero pass to ≤1,500 ms or start it on first paint |

---

## Apple played straight (`/design-lab/r2/apple/shades/`)

### Critique

**Design specificity (A, confirmed by the stills):**
- **Mostly authored for SHADES.** The dotted glasses with one word in the right lens (`apple-1440-step00.png`), the "Il1 O0 rn" legibility card (`apple-1440-step06.png`) and the 4:5 zig-zag light path on mobile (`apple-390-step03..05.png`) belong to this product.
- **Generic spots:**
  - 5 identical seat icons.
  - Centred track text.
  - The 7-dot timeline could front any Apple-style page.
  - The highlights heading is Apple's verbatim.

**Nielsen: 21/32 (Acceptable).** A scored 22; heuristic 1 is lowered after B's caption-lag measurement.

| # | Score | Key issue |
|---|---|---|
| 1 Status | 2 | The caption "4 / 6 A small display shows one word." shows while the packet has not reached DISPLAY (`apple-1440-step04.png`) |
| 2 Real world | 3 | "RSVP" expands only in a hover `title`, so touch users get nothing |
| 3 Control | 3 | Clips have a pause control; highlights have prev/next |
| 4 Consistency | 2 | 2 filled white pills in one viewport (nav "Join the build" and reader "Read", `apple-1440-step02.png`). The fixate clip's pivot is red; the live reader's is bold |
| 5 Error prevention | 3 | Same as Signal |
| 6 Recognition | 2 | The sentence is hidden. At 390 the local links are hidden with no disclosure (`apple.module.css:934`) |
| 8 Minimalism | 3 | Light chapters are forced to `min-height:100svh` (`apple.module.css:711`), leaving 300–400 px blank bands (`step07/08`) |
| 9 Recovery | 3 | Same as Signal |

**Cognitive load:** 3 of 8 checks fail.
- The sentence is never shown whole.
- The reader row has 6 controls and the local nav has 5 items.
- Chunks run to 7 phases, 6 out-items and 5 roles.

**Emotional journey:**
- **Peak:** the light path completing, then the "Il1 O0 rn" card.
- **Valley:** the problem chapter, about 400 px of black before "One word. One point.".
- **End:** soft. The nav pill lands on a section whose only action is a text link.

**Personas:**
- **Dyslexic reader:**
  - Atkinson 600 grey leads at line height 1.45.
  - `[confirm]` breaks sentences.
  - Positive: More spacing reaches every lead.
- **Sponsor skimmer:** the mentor and the club context appear only at the bottom.
- **Mobile first-timer:**
  - 2 "More spacing" controls on one screen (`apple-390-step02.png`).
  - No section nav.
  - The Research role is orphaned in the 2-column grid (`apple-390-step09.png`).

### Audit: 13/20 (Acceptable)

| Dimension | Score | Key finding |
|---|---|---|
| Accessibility | 3 | Same strengths as Signal. Gaps: hidden sentence, 9.1 px note at 390, `abbr` hover-only. The nav CTA is visually 104×30 but its `::after` extends the hit area to 44 px (`apple.module.css:217`), so A's "undersized CTA" is a **false positive** for target size |
| Performance | 3 | 0 rAF at rest; the scrub runs rAF only while progress changes (18 callbacks in 0.6 s while playing, then 0) |
| Responsive | 2 | The scanpath clips at 390 (`apple-390-step01.png`). No local-nav disclosure. 47% quiet viewports at 390 (mobile target ≥50%) |
| Theming | 3 | Tokens are used. A few literals (`#d2d2d7` at `reader.module.css:187`; hard-coded spacing values) |
| Integrity | 2 | Uses Apple's "Take a closer look." heading verbatim (banned in `apple-playbook.md` §11). Hand-built local nav instead of `_chrome/LocalNav`. The clip's chip contradicts the copy. Red text on the clip pivot |

### Contract compliance

| Block | Status | Evidence |
|---|---|---|
| THESIS: the eye is the product shot; dotted glasses, one word at a time; no stock 3D, no invented specs, **no promise about dyslexia** | **Partial** | The art is met. The hero foot shows "Smart Headset for Adaptive **Dyslexia Enhancement** System" (`page.tsx:62-64`) about 8 viewports before the boundary line, with nothing beside it to say "not a treatment" |
| OWN-WORLD: black flips once to light; Geist 600 on 6 sizes; Atkinson on every lead and caption; dotted art only; **one filled pill**; red only on pill hover and anchor | **Partial** | Flips once (step06). Sizes are 80/56/28/21 Geist 600. The reader "Read" is a second filled pill (`step02`). The fixate clip paints the pivot "o" red (`a-apple-1440-fixate.png`) |
| STORY: glasses → eyes chase → one word lands → try it → light path → highlights → tracks and boundary → 7 phases → pick a role | **Partial** | The order is met. "Pick a role" is not actionable (`page.tsx:177-205`) |
| FIRST VIEWPORT: black; SHADES 28 px; 4-word 80 px headline; grey lead; "Try the reader"; glasses about 760 px with a word in the right lens; nav with filled "Join the build" | **Met** | `apple-1440-step00.png`; `probe.json` (h1 80/600, productName 28) |
| SIGNATURE: pinned light path, one scrubbed asset, ray text → FPGA timing → control → display → optics → eye, one caption per stage swapping in place; fixate plays once above the reader | **Partial** | The mechanics are met. The asset contradicts the copy (chip under CONTROL, no FPGA at timing), and the captions lead the clip by about 35vh |
| FORM: Apple canon, legal and original | **Partial** | "Take a closer look." is copied verbatim (`_content/shades.ts:229`) |

### Copy budget

| Viewport | Viewports | vh | avg | p90 | max | Quiet (≤12 words) | Result |
|---|---|---|---|---|---|---|---|
| 1440×900 | 15 | 14.1 | 29 | 56 | 58 | 47% | Pass |
| 390×844 | 15 | 14.6 | 25 | 47 | 54 | 47% | **Miss** by 1 viewport (mobile target ≥50%) |

Headlines are 2–5 words; leads are ≤15 words; highlight captions are 9–10 words. The page is under the about-15 vh story range.

### Motion verdict

**Closest to Apple restraint.** Each motion plays once:
- the problem arcs draw in about 2 s;
- the fixate clip converges in about 3 s and has a pause control;
- the light path is the single scrub.

The scrub eases (CineClip `SCRUB_EASE 0.45` per frame), so it feels smooth.

**Two defects:**
1. **Clip content vs copy.** `design-lab/motion-reel/src/r2/clips/ShadesLightpath.jsx:12` labels the stages `TEXT / RSVP TIMING / CONTROL / DISPLAY / OPTICS / FIXATION`. The QFP chip glyph is `Control` (`:57-75`), while `Timing` (`:41-55`) is a bare tick bar. The copy says "An FPGA gives each word its slot" at stage 2 and "You pause, resume, speed up or rewind" at stage 3 (`_content/shades.ts:147, 154`). The SVG fallback gets this right: chip at timing, a button pill at control (`_shades/LightPath.tsx:33-56`). The labels also differ from the copy ("RSVP TIMING" vs "Word timing"; "FIXATION" vs "Fixation point").
2. **Caption timing.**
   - Captions switch at `k ≥ i/6` (`LightPin.tsx:52`) on `k = (p − 0.04)/0.9` (`apple.module.css:392`).
   - The clip reaches stage *i* at `p = (14 + 29.2·i)/180`.
   - For DISPLAY: the caption appears at p ≈ 0.47, but the clip arrives at p ≈ 0.56.
   - Over the 480vh pin, that is about 35vh early.

**Gemini cross-check:**

| Gemini claim | Verdict | Frame evidence |
|---|---|---|
| Fixate dot collapse is well eased; one major event per viewport | Agree | `frames/apple-tile-b.png`, row 2 |
| Reduced motion: scrub replaced by a static diagram plus captions; reader steps; nothing lost | Agree | `apple-rm.webm`; `apple-1440-rm-step*` |
| Scrub feels eased, not raw | Agree | `CineClip.tsx` SCRUB_EASE |
| Reduced-motion slider vestigial | Agree | `Reader.tsx` |
| "Glasses draw, sequentially highlighting words inside the lenses" | **Disagree** | The glasses are static SVG; one word, "here", fades in once (`frames/apple-tile-a.png`, frames 3–5) |
| Captions "perfectly" in sync | **Disagree** | `apple-1440-step04.png` shows caption 4/6 "display" while the packet sits between CONTROL and DISPLAY and DISPLAY is still dotted |
| Dark → light flip without an empty viewport | Partly agree | The flip itself is clean (step06); the light chapters after it carry 300–400 px of blank `min-height` (step07/08) |

### Fix now (Apple), ranked

| # | Sev | Issue | Evidence | Fix (Apple grammar) |
|---|---|---|---|---|
| 1 | P1 | The light-path clip draws the chip under CONTROL; the copy puts the FPGA at word timing | `ShadesLightpath.jsx:12, 41-75`; `design-lab/round2/system/renders/cine/shades-lightpath-16x9-sheet.png`; `apple-1440-step04.png` | In the clip: move the QFP chip glyph to stage 2, with the clock-tick train under it. Redraw stage 3 as a rounded handheld pill with pause and play buttons, matching `_shades/LightPath.tsx:47-56`. Relabel to `TEXT SOURCE / WORD TIMING / CONTROL / DISPLAY / OPTICS / FIXATION POINT`. Re-render 16×9 and 4×5 plus posters (`r2-cine-render.mjs`) |
| 2 | P1 | Captions run about 35vh ahead of the clip | `LightPin.tsx:52`; `apple.module.css:392`; `apple-1440-step04.png` | Drive the captions and the clip from one progress. Set `--t_i = (14 + 29.2·i)/180` (the clip's arrival frames) and either remove the `k` remap for captions or apply the same remap to the clip's `progress` |
| 3 | P1 | Honesty: "Dyslexia Enhancement" in the hero with no boundary nearby, and "Medical claims" listed as out of the *first* build only | `page.tsx:62-64`; `_content/shades.ts:206` | Put the boundary beside the name in the hero foot: "A research platform. Not a medical device." (grey, 13→17 px). Delete "Medical claims" from the compare list and make it the boundary's "Never" line. Copy goes via brand-voice → brand-guardian |
| 4 | P1 | Apple's heading is copied verbatim | `_content/shades.ts:229`; `apple-playbook.md` §11 | Rename the strip heading through brand-voice (e.g. "Up close.", "The details."); keep it at ≤3 words |
| 5 | P1 | The close has no action, and roles are not selectable | `page.tsx:177-205`; `shades.ts:251` unused | End the light join chapter with one filled "Come to build night" pill that mirrors the nav pill (the nav CTA should anchor here). Role tiles link to it |
| 6 | P1 | The scanpath clips at 390 | `apple-390-step01.png` | Set the problem line as 2 centred rows of dotted word boxes below 735 px, or scale the figure to the column |
| 7 | P2 | The local nav is hand-built and has no mobile disclosure | `page.tsx:27-44`; `apple.module.css:934` | Add an `aside` (or `children`) slot to `_chrome/LocalNav` for the SpacingToggle, plus Apple's chevron disclosure below 735 px holding Try it, Light path and Roadmap. Consume it here and delete the local copy. This is shared chrome, so coordinate with the HOME owner |
| 8 | P2 | A second filled pill, a red pivot only in the clip, and blank light bands | `apple-1440-step02.png`; `a-apple-1440-fixate.png`; `apple.module.css:711` | Make the reader's Read an outline pill on black. Render the clip pivot bold-white like the live reader (red stays on the anchor dot only). Drop `min-height:100svh` on `.light`/`.grey` in favour of content height with about 160 px padding, and merge tracks with the boundary. Also set leads to line height ≥1.5 and consider Atkinson 400 for leads |

---

## Both worlds (shared content and facts: `_content/shades.ts`, `_shades/*`)

### Honesty sweep: every sentence that could read as a claim

| String | Location | Rendered? | Risk | Action |
|---|---|---|---|---|
| "Not in it: … Medical claims" | `shades.ts:206` | Yes, both worlds | **P1.** Implies medical claims could come in a later build | Move to the boundary as "never" |
| "Smart Headset for Adaptive **Dyslexia Enhancement** System" | `shades.ts:49` | Yes: Signal hero (15 px), Apple hero foot (13 px) | **P1 (Apple) / P2 (Signal).** The official name reads as an efficacy promise; the boundary is 6–8 viewports away | Keep the name (it is the Notion name) but pair it with "A research platform, not a treatment." in the same viewport |
| "Glasses that show one word at a time…" (present tense) | `shades.ts:70` | Yes, both heroes | **P2.** Describes a planned device as if it exists. Signal shows "Planning [confirm]" in the hero; **Apple shows no status in the hero** | Apple: add the status to the hero foot. Brand-voice may consider "Glasses that will show…" |
| "Your eyes do not travel." | `shades.ts:174` (`lightPath.stages[5].line`) | **No** (unused field) | Latent absolute physiology claim | Delete the field, or reword to "so your eyes need not travel" if it is ever rendered |
| "The words move. Your eyes stay." / "your eyes stay." / reader text "Your eyes hold still." | `shades.ts:93, 98`; reader words | Yes | **P3.** A true mechanism description, but stated as an absolute | Optional: "Your eyes can stay." |
| "Read without the chase." beside "Your eyes jump." | hero, problem | Yes | **P3.** Implies a benefit, not a medical claim | Keep; the boundary line in the hero (above) neutralises it |
| "Study how dyslexic readers respond to RSVP, with no outcome promised in advance." / "SHADES claims no effect on dyslexia or on reading outcomes." / "Not a medical device, and not a treatment." | `shades.ts:185-191` | Yes | **Good.** These are the model lines | Apple: render "Not a medical device…" at ink-1, not ink-2 grey; the safety line is currently the weaker one |

The type evidence checks out:
- No "dyslexia font" claim appears anywhere.
- The highlight says only "Set in Atkinson Hyperlegible Next, with a wider-spacing setting".
- This matches `type-saas-faang.md` §4: Atkinson was designed for low vision, specialised dyslexia fonts showed no benefit, and spacing is the better-supported lever.

### Other shared issues

| # | Sev | Issue | Fix |
|---|---|---|---|
| 1 | P1 | `join.action` ("Come to build night") is defined but rendered nowhere | Render it in both #join sections (see each world's Fix now) |
| 2 | P1 | `Scanpath` has a fixed 1000-unit line with no narrow layout | One shared fix in `_shades/Scanpath.tsx` (2-row variant below 735 px) fixes both worlds |
| 3 | P2 | The reader hides the sentence from sighted users (`Reader.tsx:204`); the reduced-motion slider does nothing | Show the transcript on pause or done. In reduced motion, hide the speed slider or relabel it as disabled with a reason |
| 4 | P2 | The scanpath note is HTML-less (inside aria-hidden SVG) at 7.9–9.1 px | Move it to a `<figcaption>`, as in Fix now #5 (Signal) |
| 5 | P3 | `spacing.note` is unused. "More spacing" values are hard-coded instead of `--reading-spaced-*`. Body overscroll is light `#f7f6f2` under dark pages (A). WorldNav CH links are 25 px wide at 390 (Signal), and WorldNav "Join" leaves the page for home#join | Use the tokens. Set an r2 body background per world. Route the shared chrome items to the HOME / chrome owner |

Club confirmations still open: the current phase (the roadmap is correctly all pending), whether "Formerly Smart Reading" stays, and the open-source claim (correctly absent).

**Next action:** add `join.action` to both `#join` sections and delete "Medical claims" from `SHADES.scope.out`. These are the 2 shared P1 fixes, and both are small edits in `_content/shades.ts` and the two `page.tsx` files, routed through brand-voice → brand-guardian.
