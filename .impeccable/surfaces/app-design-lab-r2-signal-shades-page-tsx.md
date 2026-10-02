---
version: 1
slug: "app-design-lab-r2-signal-shades-page-tsx"
primary_target: "app/design-lab/r2/signal/shades/page.tsx"
related_targets: []
---

Scope: /design-lab/r2/signal/shades (lab, round 2, Signal Capture world, channel CH2). Mode: Experience. Audience: prospective members and sponsors/faculty equally. Job: make the RSVP method felt, not explained, then show the light path, the two tracks, the 7-phase roadmap [confirm] and the open seats. Proof: Notion SHADES facts and lib/data glasses facts, all [confirm]; no medical or efficacy claims; mentor Dr. Mohamed El Hadedy is the only name. Constraints: Atkinson Hyperlegible Next for body and the RSVP word, an optional "more spacing" reader setting, demo never autoplays, reduced motion = step-through with the full sentence printed, 0 rAF at rest.

## Direction contract

THESIS: the oscilloscope's centre crosshair is the reader's fixation point. Every chapter converges on that one point. The page refuses the eyewear-ad spin (stock glasses, sunsets) and the paragraph that explains RSVP instead of running it.

OWN-WORLD: near-black graticule, bone ink traces and dots, Hubot Sans display, Atkinson Hyperlegible Next for every sentence a visitor reads, Krypton only on true readouts (WPM, word count, axis labels). Red appears once per viewport, as the trigger dot at the fixation point. State by line form: the roadmap is all dashed until the club confirms a phase.

STORY: the visitor sees their own eyes jump (a staircase scanpath trace), watches it collapse into one dot, runs the reader at their own pace, follows the light from laptop to eye, learns the two tracks and the honest boundary, then picks a seat.

FIRST VIEWPORT: full-bleed graticule; the fixation reticle sits exactly on the graticule's centre crosshair, a fixate dot field converging once on load. Lower left: CH2 SHADES readout, the 4-word headline at 72px, one Atkinson lead line, the text action "Try the reader". Upper right: the spacing setting as a readout toggle.

SIGNATURE: a pinned scanpath chapter: the eye-position trace jumps word to word (saccades, one regression), and as the visitor scrolls the staircase flattens and the fixation dots converge into the single red trigger dot; then the live RSVP reader: set WPM, press Read, words land on the point (`fixate`), keyboard operable.

FORM: Signal Capture, roll index 3, seed key 0a795440

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## W3b changes

Applied (14):
1. Honesty: "Medical claims" removed from "Not in it"; the boundary is permanent ("Never: Medical claims, now or later.", struck-form marker) and "A research platform. Not a medical device." sits beside the full name in the hero.
2. Light-path band rebuilt as one short timebase: the strip pins for ~2.5 vh of scroll (3.3 vh on phones); one caption line swaps in place under it; lit station and caption share one step index (useScrollSteps). Static list for no-JS / reduced motion.
3. Scanpath never crops: a two-row layout with a return sweep below 735 px.
4. "Illustrative, not recorded data" is an HTML caption (14 px Atkinson), not SVG text.
5. Join: shared <JoinChapter world="signal"> with SHADES seats as links (dashed → solid on hover / focus), primary "Come to build night", secondary Discord.
6. Reader: K / ← → hint on the screen, the full sentence printed once paused or finished, speed slider removed under reduced motion (note says why).
7. Krypton off prose: the RSVP definition moved into the reader lead (Atkinson); "Is / Is not / Never" labels and the spacing chip are Atkinson. Chip reads "Spacing: standard / more".
8. fontReadingText replaces the page-local --font-read; spacing values use --reading-spaced-* tokens.
9. Shared parts adopted: PlayOnceStage (hero pass now 1.4 s; rAF gate passes at the default settle), scope graticule (r2-graticule data-pitch="scope") in the reader. Page copies deleted (HeroStage, _shades/PlayOnce).
10. Mentor line moved up beside the boundary (sponsor skim).
11. Unused "Your eyes do not travel." field deleted; "Your eyes can stay." wording.
12. Easing tokens (--r2-ease-entrance) replace raw cubic-beziers.
13. Pins tuned so ≥45% of viewports are quiet with the artifact in view.
14. Detector advisory (reader grid) resolved by using the shared graticule.

Rejected (2): channel-strip format unification across pages (system-level, not this page's call); 6 out-items / 7 phases chunking (they are the real scope and roadmap; Notion facts, kept whole).

Deferred (2): WorldNav CH links ~25 px wide at 390 (shared _chrome); body overscroll colour (shared layout).
