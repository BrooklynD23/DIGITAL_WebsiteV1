---
version: 1
slug: "app-design-lab-r2-apple-brain-page-tsx"
primary_target: "app/design-lab/r2/apple/brain/page.tsx"
related_targets: ["app/design-lab/r2/_content/brain.ts"]
---

# BRAIN · Apple world

Scope: /design-lab/r2/apple/brain/. Visitor mode: Experience (product page for an idea; the close persuades). Audience: CPP students from any major + sponsors/recruiters/faculty. Job: in the first viewport see the system as the product; skim 8 concepts in the highlights strip; play one mechanism per chapter; end on BRAIN (Notion facts, [confirm]) and the join CTA. Must not claim DIGITAL teaches or built MCP/harness infrastructure; no curriculum. Constraints: copy budget per apple-playbook §6, one scrubbed asset (brain-context, ch4), clips play once on entry, 0 rAF at rest, reduced-motion + no-JS parity, ≤1,300 vh at 1440.

## Direction contract

THESIS: An Apple product page whose product is an agent system. The orb is the hero object, shot like hardware on black; each dark chapter isolates one mechanism the way a product page isolates one feature. Refuses the tutorial/docs register (diagrams with paragraphs) and fake-Apple trade dress.

OWN-WORLD: Black #000 chapters with #f5f5f7 / #a1a1a6 ink, Geist 600 on the 80/56/48/28/21/17 scale, centred column, dot-engine stages as the only imagery, hairline pill segmented controls, a highlights strip of 8 snap cards; one filled CTA in a 52px sticky local nav; red only on the CTA hover and the gate's held call. The page ends light (#f5f5f7 then white) on BRAIN and join.

STORY: Understand: a model predicts; the system around it gets work done, mechanism by mechanism. Believe: faithful vs illustrative is labelled on every chapter. Do: join Thursday build night.

FIRST VIEWPORT: Local nav (BRAIN · Concepts · Chapters · filled "Join build night"). Centred h1 at 80px over two lines, "A model predicts. A system gets work done."; under it the 560px orb (brain-orb clip plays once on entry; dot-stage fallback runs one loop and halts); one 21px grey line beneath. Global nav scrolls away; local nav sticks.

FORM: canon: Apple product page played straight (craft bar: measured iPhone/AirPods/MacBook pages). Signature interactions: brain-context scrubbed through ch4; the harness gate (Enter approves, Esc denies); drag a document into a full window.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## W3b changes

Applied (Head Designer: 6 chapters):
- Structure: Loop, Tools, MCP, Context (window + engineering merged), Harness (+ one-beat subagent coda, no control), Evals. Each chapter is a ChapterPin: the stage-only first part is quiet; caption, readout and the one control fade in for a window of pin progress (focus always reveals). "How it works" disclosure after each pin (open without JS / under reduced motion). Removed: the per-chapter Faithful chip, the step lists, the mode switch and the one-window/subagent toggle (detail moved into How it works).
- Accuracy: max turns counts tool-use turns only (3 tool turns + answer succeed at 3); plan = "proposes and does not edit"; "Everything it knows fits in here" dropped; pass@k = "at least one of k"; scramble labelled illustrative; discover vs */list wording; subagents "clean window (no parent history)"; list_changed still not faked.
- Illustrative tags only where a picture is a metaphor (tools, MCP, context, harness, evals, coda); hero key "1 dot ≠ 1 token · illustrative" on the stage.
- Hero: Signal runs the loop 3 times (one tool per run, TRIG · AUTO ×3), larger trace, then halts and sleeps. Apple: brain-orb loop clip (world="apple", eager, maxLoops 3) cropped and scaled as the hero object on #000, trace row synced from the clip markers via onTime.
- Apple: brain-context is the one scrubbed asset (ref.setProgress, readout from markerIndex) in pin A; pin B is the interactive window. Shared LocalNav (default CTA), WorldNav join={false}, <Highlights>, <JoinChapter> with BRAIN facts as children, "Competes in hackathons." tagged [confirm].
- Signal: shared scope graticule (r2-graticule data-pitch="scope"); red = JoinChapter seat + the held call's anchor at the gate (separate viewports); mobile labels ≥11–12px.
- Eval slider hydration warning: not reproducible after the rewrite (label/input split); the rAF gate now counts warnings: 0.

Rejected (with reason):
- Migrating SceneStage to DotStage `scene`: DotStage has no per-frame callback (live readouts need t) and no one-runner conductor or container-sized canvas. Kept SceneStage on barrel imports; requested `onFrame(t)` on DotStage.

Deferred:
- brain-context clip draws its own red "now" dot (CINE re-render owner).
- Page length grew with the pins (1440: Signal 14.0 vh, Apple 16.4 vh); quiet/avg targets met.
