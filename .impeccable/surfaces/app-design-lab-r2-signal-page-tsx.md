---
version: 1
slug: "app-design-lab-r2-signal-page-tsx"
primary_target: "app/design-lab/r2/signal/page.tsx"
related_targets: []
---

# Home · Signal Capture world

Scope: /design-lab/r2/signal/ (home). Visitor mode: Persuade. Audience: CPP students from any major + sponsors/recruiters/faculty, weighted equally. Job: in one viewport, know what DIGITAL builds and which part could be yours; then reach build night (#join) or probe a channel page. Proof: the 4-stage build cycle, the four ownership rules, 3 initiatives (all status [confirm]), build night Thursdays 6:00 PM, Building 17, Room 1635. Constraints: 0 rAF at rest, ≤1 moving glyph per viewport, reduced-motion and no-JS parity, copy budget per apple-playbook §6.

## Direction contract

THESIS: The home page is one oscilloscope capture of a build. Scroll is the timebase; the visitor scrubs a single dot orb through Plan → Prototype → Test → Integrate and reads the trace. Refuses the club-landing default of hero banner + three feature cards + "about us" paragraph.

OWN-WORLD: Near-black #0b0c0a graticule, bone #ece8de dots and 1px traces, Hubot Sans wide caps for channel names, Mona Sans text, Monaspace Krypton readouts. Red #d8412f appears once per viewport as the trigger marker (here/now/open seat). State by line form: solid live, dashed pending. Channel marks CH1/CH2/CH3 carry through nav, rows and footer. No cards, no fills, no radii.

STORY: Understand: every DIGITAL build runs the same four stages and every subsystem has one owner. Believe: the three channels are real builds with honest status. Do: pick a channel or come Thursday.

FIRST VIEWPORT: Left 5 columns: thesis at 72px, one lead line, channel readout strip (CH1 SIDEKICK / CH2 SHADES / CH3 BRAIN). Right 7 columns: a 520px live orb inside a scope frame with stage readout top-left and the timebase ruler beneath it, red trigger cursor on the ruler. Join sits in the nav as an outlined trigger.

FORM: Signal Capture, roll index 3, seed key 0a795440. Signature interaction: scrubbing the timebase (scroll, drag or arrow keys on the ruler) drives the orb through Plan → Prototype → Test → Integrate while the red trigger marker and cursor readout track the position.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## W3b changes

Applied:
- P0: reduced motion keeps the thesis, lead and chips. The scrub moved to `_system` `useScrollSteps`, which calls nothing when not enhanced; the phase rules only apply inside the pinned media query. `r2-crit-home-rm.mjs` → checkVis:true.
- P1: no hydration flip. The pin ships in the server HTML, gated by `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`; first paint = hydrated paint (height 8,475 px from the start).
- P1: the duplicate tile strip is retired. Each stage carries its ownership rule in the capture: PLAN · 1 owner per subsystem, PROTOTYPE · 1 review path, TEST · 1 test gate, INTEGRATE · 1 repair plan. The pairing needs Head Designer confirmation.
- P1: mobile pin dead band is gone. The thesis scrolls away in flow; the scope and the stage readout stick, stacked, and release together.
- One orb, not four stacked. The scene is a deliberate cut (retrigger) per stage through the dot engine (`_home/stageScene.ts`); Plan opens on its finished rest pose.
- Join: shared `<JoinChapter world="signal">` (outlined action, seat anchor = the viewport's one red). Filled bone CTA, the `--r2-trigger: currentColor` workaround and the second red are removed.
- First ArrowRight from the hero now lands on Plan.
- SIDEKICK line tagged `[confirm]` on the claim itself.

Rejected:
- Grid back to 5/7 (FIRST VIEWPORT "partial"). 6/6 keeps the thesis to 4 lines at 72px; 5/7 wrapped it to 5.

Deferred:
- Channel-row empty bands at 1440. Kept full-viewport rows: they are the quiet, artifact-led viewports that hold the copy budget.
