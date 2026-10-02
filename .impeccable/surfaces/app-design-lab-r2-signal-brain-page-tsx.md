---
version: 1
slug: "app-design-lab-r2-signal-brain-page-tsx"
primary_target: "app/design-lab/r2/signal/brain/page.tsx"
related_targets: ["app/design-lab/r2/_content/brain.ts"]
---

# BRAIN · Signal Capture world

Scope: /design-lab/r2/signal/brain/ (CH3). Visitor mode: Experience (the mechanism leads; the close persuades). Audience: CPP students from any major + sponsors/recruiters/faculty. Job: feel a live system think, understand 8 agentic mechanisms one per viewport, then meet BRAIN (Notion facts, all [confirm]) and build night. Proof: documented mechanisms (Agent SDK loop, MCP spec 2026-07-28, context engineering, harness hooks/permission modes, subagents, pass@k/pass^k); metaphors labelled illustrative. Must not claim DIGITAL teaches or built MCP/harness infrastructure; no curriculum. Constraints: 0 rAF at rest, one running stage at a time, keyboard demos, reduced-motion + no-JS parity, ≤1,300 vh at 1440 (else merge ch4→5, ch7→6).

## Direction contract

THESIS: BRAIN is a live capture of an agent at work. Each chapter is one single-shot trigger on the scope: the trace runs once, halts, and the visitor can re-arm it by acting. Refuses the AI-page default of glowing neural blob + gradient + grid of concept cards.

OWN-WORLD: Near-black #0b0c0a graticule, bone dots and 1px traces only; screens are hairline-framed graticule rectangles with mono corner readouts (Krypton), headlines in Hubot Sans wide caps-weight. Line form is state: solid live, dashed pending/boundary, dotted leader, hollow = empty slot or rejected call. One red per viewport, and on this page that is the shared nav's trigger; the held call at the gate is marked by a dashed ring instead. A vertical timebase rule with chapter ticks carries every line of copy. No cards, fills or radii.

STORY: Understand: the model only predicts; the loop, tools, servers, window curation, harness gates, subagents and evals are what get work done. Believe: every picture is either the documented mechanism or labelled illustrative. Do: come to Thursday build night or read BRAIN's method.

FIRST VIEWPORT: Left 5 columns on the timebase: readout "CH3 · BRAIN · RUN 01", h1 "A model predicts. A system gets work done." at 72px, one lead line, a "Run again" control. Right 7 columns: a 560px orb captured on a framed screen runs one agent loop (evaluate, tool call, result, done) for ~7 s then halts; a mono trace line under it lights the live step. The viewport's one red is the nav's Join trigger (shared chrome), so the page itself adds no red.

FORM: Signal Capture, roll index 3, seed key 0a795440. Signature interactions: approve/deny the pending Edit at the harness gate (Enter/Esc), drag a document into a full window and pick evict / compact / load on demand, toggle MCP servers; cursor readouts name the state ("CH3 · TOOL CALL · PENDING").

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
