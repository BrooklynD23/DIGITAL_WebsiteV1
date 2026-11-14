# BRAIN sphere — home "Explore our projects"

Recommendation: **Direction A, Loop.** Open `sphere-proto.html` and press the A / B / C tiles.

Status: prototype only. No app code changed. Head Designer sign-off needed before implementation.

## 1. What the current sphere does

| What | Where |
|---|---|
| Four soft colour blobs (blue, violet, cyan, white) drift inside a clipped circle | `app/(apple)/_home/BrainOrb.tsx:12-17`, `:42-52` |
| Blobs are radial gradients blended with `screen` on a navy fill `#0a1230` | `BrainOrb.tsx:40-41`, `:46-51` |
| A soft rim (a radial gradient ring) around the circle | `BrainOrb.tsx:54-58` |
| `energy` eases to 0.9 while a job runs and 0.25 at rest; it speeds the drift and adds about 1–3% size pulse | `BrainOrb.tsx:31-36`; set from `AgentReadout.tsx:46`, `:57` |
| Each tool line sets `kick = 1`: a 3.5% swell that decays in about 420ms | `BrainOrb.tsx:32-36`; `AgentReadout.tsx:55`; `BrainVisual.tsx:14` |
| Runs only on screen with the tab visible; one still frame under reduced motion | `BrainVisual.tsx:17-27`; `BrainOrb.tsx:59-61` |
| Readout types the thought (18ms per 2 characters), adds a tool line every 650ms, holds 2.2s, closes 1.4s | `AgentReadout.tsx:47-60` |
| 300px canvas above a fixed 196px readout | `brain.module.css:3-4` |
| Accessible name: "An orb that swells while an example agent works." | `_content/home.ts:58` |

## 2. Why it does not read as AI

1. It is the voice-assistant orb. A blurred colour ball says "assistant is listening", not "agent is working".
2. The only link between the readout and the orb is a 3.5% swell. Most visitors will not see it.
3. Nothing in it shows a tool, a call, a result or a loop — the four things BRAIN teaches.
4. It is the one figure on the site that is not dots or line art, so it looks like it came from another product. SIDEKICK and SHADES rows are ink line art; the BRAIN page itself is a dot figure.
5. It uses gradients and a soft rim. The logged exception (`DESIGN.md` §6) covers the **colours** only; §11 "Never: gradients, glow" and the §18 row are not lifted for it, and it is not listed under §18 known deviations.
6. It loops with no pause control (§14: "a loop has a pause control").

## 3. Shared idea for all three directions

- A sphere of dots painted in the element's ink (`currentColor`), like `_system/dots`. No gradients, blur or glow.
- **One clock.** The readout and the sphere are both a pure function of the same time value, so the figure shows exactly what the text says: thinking, a call going out, a result coming back.
- The example jobs are the existing `homeJobs` (`_content/home.ts:89-94`). No new copy.
- The tool result prints when the call returns (62% through the call), not when it leaves.
- A "Pause" button beside the "Thinking…" line (44px tall).
- The `needs approval` job uses the one red mark: the call stops at a gate and waits.

Timing, shared:

| Step | Duration | Easing |
|---|---|---|
| Think | 24ms per character, 1,200ms minimum (1.4–1.9s for the four jobs) | linear typing |
| One tool call | 1,300ms: out 455ms, tool works 325ms, back 390ms, lands 130ms | cubic in-out (same curve as stage playback, §10) |
| Done hold | 2,200ms (unchanged) | — |
| Readout closes, sphere rests | 1,400ms (unchanged); fade `--r2-dur-ui-slow` 320ms, `--r2-ease-ui` | |
| Full loop, four jobs | about 34s | |
| Sphere turn | one revolution in about 39s, constant | linear |

Pauses: off screen (`IntersectionObserver`), tab hidden, Pause pressed. Paused = 0 animation frames (measured: loop stopped).

Reduced motion: no loop, no shimmer, no pause button. One still pose from job 1 — the second call (`read_file`) at its tool, with the thought and both tool lines printed. This still reads as "an agent mid-task". (Today's still shows the finished job; either works, the proposal changes it so the figure and text agree.)

Layout change for all three: canvas grows from `min(300px, 80%)` to `min(400px, 100%)` so the call has room. The row gets about 100px taller on desktop. The readout stays 196px.

## 4. Directions

### A · Loop — recommended

**Concept.** 420 dots on a sphere. While the agent thinks, a wave crosses the dots and hairlines flash between neighbours as it passes. For a tool call, one dot leaves the sphere along a line to a small open ring, the ring fills while the tool works, the dot comes back, and where it lands a new wave starts. Think, act, check, repeat.

**Maps to BRAIN.** Lesson 1 "The agent loop" (think, act, check, repeat) and lesson 2 "Tool calling" (the model writes a call; the program runs the tool). The gate on `needs approval` is lesson 5, the harness.

**Motion.**
- Think: two waves, one every 1,000ms, offset by 500ms, each from a different point; band width 0.42 rad; dots in the band grow up to 2.1× and brighten; fades in over 300ms.
- Act: call line dashed (pending), solid behind the dot; four fixed slots around the sphere, used in turn.
- Check: landing wave, 1,000ms, from the slot the dot came back from.
- Held call: dot stops at 60% of the line in 455ms, turns red, waits through the hold, returns over 1,400ms.
- Rest: slow turn and a 0.8% breath.

**Reduced motion.** Still pose: landing wave part-way across, one dot out at its tool.

**Perf.** Canvas 2D. 420 dots, at most about 250 hairlines in a frame. Neighbour table built once (176k multiplications at load).

**DESIGN.md.** Fits §11 dot figures as written. Needs nothing lifted. Retires the orb colour exception unless "Tint" is kept (section 6).

### B · Tokens

**Concept.** The sphere is the context window. 560 dots sit dim on the surface. They fill in spiral order from one pole as the thought is written, then in bursts as each tool result lands. A hairline ring around the sphere closes with the fill and a mono figure shows the percentage. At the end of the job the window empties back to its 12% base.

**Maps to BRAIN.** Lesson 4 "Context engineering" (every call and result lands in one finite window) and its context % pill.

**Motion.** Think adds 14% over the thought; each result adds 16% over 650ms, cubic in-out; arriving dots fly in from 1.5× radius over 14 dots of travel, ease-out; rest empties over 1,400ms. A held call adds nothing.

**Reduced motion.** Still pose: half-filled sphere, ring at 56%.

**Perf.** Canvas 2D. 560 dots, 2 arcs, one text draw.

**DESIGN.md.** Fits §11. Ink only as drawn. If the percentage should use green / amber / red like the BRAIN page, the meter exception (§6, "the meter only", BRAIN lesson) must be extended to the home row. Not recommended.

**Weak point.** It reads as a progress meter. "Thinking" and "acting" are not visible; it teaches one lesson well and hides the loop.

### C · Tools

**Concept.** A smaller sphere (the model) in the middle of a dotted orbit with six open rings, one per tool in `homeJobs` (`run_tests`, `read_file`, `edit_file`, `bash`, `mcp · discord`, `write`). Dotted lines tie each tool to the model. While thinking, the model's dots twinkle. For a call, the line to that tool turns solid, its name appears in mono, a dot travels out and back, and the model swells 7% when the result lands.

**Maps to BRAIN.** Lesson 3 "Model Context Protocol" (one client reaches many servers) and lesson 2 "Tool calling".

**Motion.** Orbit turns once in about 126s; twinkle is per dot, random phase; call timing as the shared table; landing swell decays in 280ms.

**Reduced motion.** Still pose: one line solid, the tool named, the dot at the tool.

**Perf.** Canvas 2D. 300 dots, 6 rings, 7 lines, one text draw.

**DESIGN.md.** Fits §11. Puts mono text inside the canvas (tool names); those strings already exist in `home.ts` but they would now also appear in the figure — run past `brand-guardian`.

**Weak point.** Busiest of the three. At 343px on a phone the orbit is small and the label sits close to the sphere. It also overlaps the BRAIN page's MCP lesson figure, so the home row would give that lesson away.

## 5. Recommendation: A

1. It shows the whole sentence BRAIN is built on — think, act, check, repeat — in one figure, without a label.
2. Every motion is tied to a readout line, so a visitor can match "run_tests" appearing to the dot leaving.
3. It is one object. It stays a sphere, as asked, and reads at 100px (tile) and 400px.
4. It needs no rule lifted and removes one exception.
5. It leaves the context meter and the MCP servers for the BRAIN page.

Suggested accessible name (copy change, goes through `brand-voice-strategist` and `brand-guardian`): "A sphere of dots. A wave crosses it while the agent thinks; one dot leaves to call a tool and returns." The current `verbNote` ("An orb that swells…") would be wrong for any of the three.

## 6. Rules: what needs a decision

| Item | Rule | Ask |
|---|---|---|
| Ink-only sphere (default in the prototype) | §6, §11 | Nothing to lift. The 2026-10-15 orb colour exception can be retired. |
| "Tint: orb blue" toggle — firing dots in `rgb(88,140,255)` | §6 "No other hue", §6 "red … never a dot colour" spirit | Optional. If wanted, re-scope the existing orb exception from "that orb" to "the firing dots of the BRAIN home sphere". Flat colour only, still no gradient. |
| Red dot for the held call | §6 one red, §11 "at most one red anchor dot" | Within the rule (one mark, one dot, a "here / waiting" point). Flagging it because it is a new use of red: confirm. |
| The figure loops | §14 "Nothing loops for decoration; a loop has a pause control" | Covered by the new Pause button. The shipped orb has none. |
| Tool-result colours `#7ad08f` / `#ffb35c` | §6 "No other hue" | Existing, unlogged literal hexes in `brain.module.css:18-19`; unreadable on a light ground. The prototype keeps them on dark and uses ink on light. Log them or move them to `--r2-meter-ok` / `-warn` with an exception. |
| "Thinking…" shimmer (gradient text) | §18 "Use gradients" | Existing, shipped (`brain.module.css:10-11`); copied unchanged. Not part of this proposal. |
| Canvas 300 → 400px | none | Row grows about 100px. Confirm. |
| Shared dot engine | §11 "Painted by `_system/dots`" | The prototype paints its own dots. For the build, write it as a page-scoped figure in `_home/` using `_system/dots/paint.ts` and the shared ticker; do not touch `_system` (BRAIN and SIDEKICK are locked and depend on it). |

## 7. Verification

Run: `node design-lab/proposals/2026-11-14-brain-sphere/verify.mjs` (repo root; Playwright from `node_modules`, headless Chromium, software rendering).

| Check | Result |
|---|---|
| Console and page errors | 0 |
| Frame cost, live, 1440×900 (4 canvases on screen, 180 frames) | 0.76ms average, 3.8ms worst |
| Frame cost, all 5 canvases forced, 60 paints | 0.77ms average, 2.7ms worst |
| Loop after Pause | stopped (0 animation frames) |
| Reduced motion | loop never starts; still pose painted; pause button hidden |
| Horizontal overflow at 1440 and 375 | 0px |

Not measured: a real phone, and the React build. The numbers are one headless desktop run.

Screenshots (`images/`):

| File | Shows |
|---|---|
| `desktop-1440.png`, `phone-375.png` | Full page, both chapters |
| `A-1-think.png` → `A-2-call-out.png` → `A-3-at-tool.png` → `A-4-check.png` | Direction A over one call |
| `A-5-held.png` | The `needs approval` call stopped at the gate, red |
| `row-dark-A.png`, `row-dark-B.png`, `row-dark-C.png`, `row-light-A.png` | Each direction in the row |
| `reduced-motion-A.png` | The still pose |

## 8. Next action

Open `sphere-proto.html`, watch A for one full job, then answer two questions: ink only or tinted, and is the red held call approved.

---

# Addendum (2026-11-14) — all three on the BRAIN page

Recommendation: **three columns from 735px, one sphere with a switch below 735px, placed after the pinned lessons and before the join.** Open `brain-page-proto.html`; the bar at the bottom switches layouts.

Status: prototype only. `/projects/brain/` is locked; the Head Designer's request opens it, and this needs approval before build. Home ships Direction A separately.

## A1. What the section is

One new section, "One job, three layers". The same example job plays in three spheres at once, on one clock:

| Sphere | Shows | Caption (provisional) |
|---|---|---|
| The loop (A) | think → act → check, step by step | Think, act, check, repeat. It sets how many steps a job gets. |
| The context window (B) | the window filling as the thought and each result land | Everything the model can see. Each result uses up some of it. |
| The tools (C) | the call going out to one tool or server and coming back | Everything the model can reach. A call goes out and a result comes back. |

Above them, one line of text is the clock in words: `think` + the thought, then `act run_tests auth.spec.ts`, then `check … → 1 failed`. A 44px pause button sits beside it (same icon and labels as the page's existing pause).

**Why it is not a repeat of a lesson.** The six lessons each explain one part, alone, one after the other. This section shows three of those parts during the same moment: when `read_file` returns, the loop's dot lands, the window jumps 16%, and the `read_file` tool goes quiet. No lesson shows that. It adds no new concept, so it sits after the lessons as the recap.

## A2. Placement

| Option | Verdict |
|---|---|
| **After the pin (after Evals), before the join** — a normal-flow section | **Recommended.** Touches no stage, no tracker, no pin height. Reads as "now all together". |
| Inside the pin, as stage 8 | No. Needs a new scene in `_brain/lessons.ts` that morphs from the 72-dot orb, a 7th tracker button and a longer pin. Largest change to the locked figure for no gain. |
| After Harness (stage 5) | No. Same cost as above, and it splits Harness from Evals. |

The join follows directly on the same black surface. No rule between them (§8, no dividers).

## A3. Layouts

| Layout | 1440×900 | 375×667 |
|---|---|---|
| 1 · Three columns | All three and the comparison line fit one screen. The point of the section — seeing them at once — works. | Stacks to about 1,800px. Only one sphere is on screen at a time, so the comparison is lost. |
| 2 · One sphere + switch | One 460px sphere; the reader must press to compare, and sees one layer at a time. | One screen. Loop / Context / Tools buttons, 44px. |

Recommended: layout 1 at ≥ 735px and layout 2 below (the third button in the review bar, "Columns, switch on phone").

The switch reuses the lesson tracker's button (dot + name), with `aria-pressed`.

## A4. Copy (provisional — needs `brand-voice-strategist`, then `brand-guardian`)

| Slot | Text |
|---|---|
| Heading | One job, three layers |
| Line | The same job, seen from the loop, the context window and the tools. |
| Panel headings | The loop · The context window · The tools |
| Captions | as in A1 |
| Comparison line | The loop sets how long it works, the window what it knows, the tools what it can do. (17 words; the lesson limit is 16) |
| Switch labels | Loop · Context · Tools (the tracker's own short names) |
| Step words | think · act · check (the loop lesson's in-figure labels) |
| Example job | thought: "A test is failing. Run it, read the file, then check the open issues." Calls: `run_tests auth.spec.ts → 1 failed`, `read_file src/demo.ts → 212 lines`, `GitHub issues.list → 3 open`, `run_tests auth.spec.ts → 24 passed, 0 failed`, `send_message #general → needs approval` |

Names in sphere C are the page's own: the four calls (`run_tests`, `read_file`, `web_search`, `send_message`) and the four servers (GitHub, Notion, Discord, Google Drive) from `figureExamples` in `_content/brain.ts`. New strings that are not in `figureExamples` today: the thought, `auth.spec.ts` as a bare argument, `1 failed`, `3 open`, `needs approval`. They are illustrative, like the rest of `figureExamples`, and belong there.

## A5. Motion and fallbacks

- One job, about 11.8s per loop: think 1.7s, five calls at 1.3s, hold 2.2s, rest 1.4s. Call and wave timing as section 3.
- The last call is held: it stops at the gate and turns red in A and C; the window (B) does not grow.
- Pauses: off screen, tab hidden, Pause pressed. All three were measured (A7).
- Reduced motion: no loop, no pause button; three still poses of the same moment (`read_file` at its tool, window at 56%).
- No JS: the canvases are empty in the prototype. The build must server-render three SVG stills, as the lessons do (`lessonStill`).

## A6. What must change in the specs

`docs/design/brain.DESIGN.md`:

| Section | Change |
|---|---|
| Header quote and §1 | "One black surface, one figure, six lessons" is no longer true. Add: a recap section with three figures follows the pin. |
| §2 Copy | Add the section's heading, line, three headings and captions, comparison line, example job. |
| §3 Layout | Add the section: normal flow, three columns ≥ 735px, switch below; canvas `min(100%, 340px)`. |
| §5 Colour | Add: the held call is the red anchor dot, the same mark the Harness lesson uses for its denied call (`_brain/lessons.ts:159`). §5 does not mention red today. |
| §6 Motion | Add the second loop: its clock, its 11.8s period, its own pause. State "0 subscribers at the join" still holds. |
| §7 | Add the switch, the pause, the stills, the canvases' accessible names. |
| §8 Locked files | `page.tsx` changes (one new component between `<BrainStages />` and `<JoinChapter />`). `_content/brain.ts` gains the section's copy and the example job. Add the new component and its CSS to the list. `BrainStages.tsx`, `stages.module.css`, `_brain/lessons.ts` do **not** change. |
| §10 Changelog | Record the sign-off. |

Root `DESIGN.md`:

| Section | Change |
|---|---|
| §9 page structure table | BRAIN row: "Hero + lessons pin, layers, join". |
| §11 | No rule lifted: dots, hairlines, one red dot per figure. Note that two figures show their red dot at the same moment. |
| §14 | No change; the loop has a pause. |
| §20 | Changelog entry. |

No colour exception is needed. The section is ink only; the context sphere's percentage is ink, not the green / amber / red meter of the context lesson.

## A7. Performance and verification

Run: `node design-lab/proposals/2026-11-14-brain-sphere/verify-brain.mjs` (headless Chromium, software rendering, one desktop run).

| Check | Result |
|---|---|
| Console and page errors | 0 |
| Paint, three canvases at once, 1440×900 (1,280 dots) | 0.77ms average, 5.0ms worst over 121 frames |
| Paint, one canvas (switch), 1440×900 | 0.19ms average, 1.3ms worst |
| Paint, 375×667 at 2× | 0.33ms (columns, one sphere in view), 0.27ms (switch) |
| After Pause | loop stopped |
| Section scrolled off screen | 0 canvases painted, loop stopped |
| Reduced motion | loop never starts, pause hidden, stills painted |
| Buttons under 44px in the section | 0 |
| Horizontal overflow, 1440 and 375, both layouts | 0px |

Not measured: a real phone; the section running while the pin above it is also on screen (in the build both loops must share the one ticker, `_system/dots/ticker.ts`).

Screenshots (`images/`): `brain-1440-cols.png`, `brain-1440-switch.png`, `brain-375-cols.png`, `brain-375-switch.png` (+ `-viewport` versions), `brain-1440-switch-B.png`, `-C.png`, `brain-375-switch-B.png`, `-C.png`, `brain-1440-cols-think.png` → `-check.png` → `-held.png`, `brain-1440-fullpage.png`, `brain-reduced-motion.png`.

## A8. Questions for the Head Designer

1. Layout: columns on desktop with the switch on phones (recommended), or one of the two everywhere?
2. Placement: after the lessons, before the join — yes?
3. Red: the held call is red in the loop and the tools spheres at the same moment (two red dots on screen). Keep both, or red in the loop sphere only?
4. Pause: its own button (as drawn), or should the pin's pause button also stop this section?
5. Copy: is "One job, three layers" the right frame, and may the comparison line run 17 words?
6. Context sphere: ink percentage (as drawn), or the lesson's green / amber / red meter? The second needs the meter exception widened.
