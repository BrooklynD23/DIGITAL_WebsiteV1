# BRAIN critique (W2-CRIT-BRAIN)

Verdict: **Signal = fix · Apple = fix.** Neither world needs a rebuild. Both fail the copy budget the same way (0% quiet viewports at 1440). The 6-chapter merge (§3) is the fix. Apple also needs its hero clip and its ch4 clip/readout pairing reworked.

Targets: `/design-lab/r2/signal/brain/`, `/design-lab/r2/apple/brain/`. Code: `app/design-lab/r2/{signal,apple}/brain/page.tsx`, `_brain/*`, `_content/brain.ts`.
Evidence: `design-lab/renders/r2/crit/brain/`, made by `design-lab/scripts/r2-crit-brain-capture.mjs`, `r2-words.mjs`, `r2-brain-raf.mjs`, `r2-brain-vpwords.mjs`, the impeccable detector and Gemini.

---

## 0. Measurements (both worlds)

| Check | Signal 1440 | Signal 390 | Apple 1440 | Apple 390 | Budget |
|---|---|---|---|---|---|
| Page length | 10.85 vh | 12.16 vh | 12.74 vh | 12.39 vh | ≤13 vh |
| Words / viewport avg | **40** | **33** | **35** | **34** | ≤30 |
| p90 | 46 | 39 | 59 | 51 | ≤70 |
| max | 68 | 49 | 68 | 57 | ≤100 |
| Quiet viewports (≤12 words) | **0%** | **0%** | **0%** | **8%** | ≥45% (mobile ≥50%) |
| rAF at rest (r2) | 0 / 3 s ✓ | 0 ✓ | 0 / 3 s ✓ | 0 ✓ | 0 |
| Console | 1 hydration warning (eval slider `<input>` style) | | same | | 0 |
| Horizontal scroll | none | none | none | none | none |
| Reduced motion | 10.89 vh; 8/8 step lists visible; 0 videos playing | | 13.37 vh (+5%); 8/8 step lists visible; 0 videos playing | | parity |
| No-JS | renders in under 60 s: 10 h2s, 8 step lists, 11 SVG rest poses | | renders: 11 h2s, 8 step lists, 9 SVG rest poses | | parity |
| Keyboard | 68 tab stops, every one with a 2px ring; gate Enter/Esc works | | 69 stops, rings on every one; gate works | | operable |

Source files: `words-*.txt`, `raf-*.txt`, `capture.json`, `vpwords-*-1440.txt`.

**Why the density is high.** Headlines are already short: 4–6 words, so the median is in budget. Captions run 9–13 words. The weight comes from two things:

1. **Chapters are shorter than one viewport, so viewports straddle chapters.** At Signal 1440, viewports 6, 7, 8 and 9 each hold two chapters' text (`vpwords-signal-1440.txt`).
2. **Every chapter adds 10–20 words of instrument chrome.** That is the "Faithful" chip, the illustrative note, the live readout, control labels and legends.

No viewport is stage-only.

---

## 1. Signal Capture world

### Critique: Nielsen (Experience surface; heuristics 7 and 10 n/a)

| # | Heuristic | Score | Note |
|---|---|---|---|
| 1 | Visibility of system status | 3 | Live mono readouts name every state (`CH3 · TOOL CALL · PENDING`). |
| 2 | Match with the real world | 2 | Scope jargon stacks up: `TRIG · SINGLE`, `T+04 · SCRUB`, `tool_call` in the hero. It reads in-world, but first-timers get no gloss. |
| 3 | User control and freedom | 3 | Run again, Refill and Again are present. The hero has no way to keep the system running. |
| 4 | Consistency and standards | 3 | One DemoShell grammar is used across all 7 demos. |
| 5 | Error prevention | 3 | Strategies stay disabled until the document waits; the gate is disabled until the call is held. |
| 6 | Recognition over recall | 3 | Labels sit on the stage, and controls name their action. |
| 7 | Flexibility | n/a | Experience surface |
| 8 | Aesthetic and minimalist design | 2 | The world is strong, but 0% quiet viewports and two captures per screen break "one idea per viewport". |
| 9 | Error recovery | 3 | The denied call returns as a result and is shown; Refill resets the window. |
| 10 | Help | n/a | |
| | **Total** | **22/32 (69%)** | Acceptable, at the edge of Good |

**Design specificity:** pass.
- It could only be this page: a graticule scope, single-shot triggers, and line form as state (dashed = pending gate, hollow = rejected call). No neural blob, no gradient, no card grid. The harness screen (`signal-i-harness-pending.png`) is the best frame on either page.

**Persona flags:**
- **Jordan (first-timer):** meets 8 dense captures in 10.8 vh with no breathing room.
- **Casey (mobile):** the mobile tags are 10px and the readouts 11px mono (`demo.module.css:186-187`).

### Audit

| Dimension | Score | Key finding |
|---|---|---|
| Accessibility | 3 | AA contrast holds (ink-3 #8c887d is 5.5:1). Labels are 10–11px at 390. Shared nav CH links are 25px wide at 390 (`capture.json` smallTargets390). |
| Performance | 3 | 0 r2 rAF at rest. The document card transitions `left` (`demo.module.css:88`), which is a layout property, though not on a scroll path. |
| Responsive | 3 | No overflow. At 390 the ch4 stage stays sticky while the text scrolls past, which is correct. |
| Theming | 3 | Tokens are used throughout. |
| Implementation integrity | 3 | The detector flagged 2 `codex-grid-background` advisories (`signal/brain/brain.module.css:4`, `_brain/demo.module.css:107`). Both are **brief-sanctioned false positives**: the graticule is the world's measurement surface (PLAN §2, SYSTEM §4). |
| **Total** | **15/20 (Good)** | |

### Contract compliance

| Block | Status | Evidence |
|---|---|---|
| THESIS | met | Each demo is a single-shot `useEntryPlay` that the visitor re-arms by acting (`DemoShell.tsx:286`). No blob, gradient or cards. |
| OWN-WORLD | partial | Graticule, hairline screens, mono corners and the timebase rule all hold. The contract names the nav's Join as the one red, but it renders bone-on-black with no red anywhere (`signal-hero-t1.png`), so the page has zero trigger markers. |
| STORY | partial | Mechanism plus fidelity is present. The density buries the "one idea" beat. |
| FIRST VIEWPORT | partial | Built: h1, lead, status, key, the stage and its trace, Run again under the stage, and the RUN readout in the stage corner. The contract wanted readout + h1 + one lead + Run again in the left column. The extra status and key lines add 20 words. The 72px h1 breaks into 4 lines with an orphaned "A" ("predicts. A", `signal-hero-t1.png`). |
| FORM | met | Gate Enter/Esc, document plus 3 strategies, MCP switches and cursor readouts all work (`capture.json` readouts). |
| FINISH | missed (W3) | Pending finish review, verdict and DESIGN.md. |

### Copy budget (Signal)

| Element | Budget | Measured |
|---|---|---|
| h1 | ≤8 | 8 ✓ |
| Chapter headlines | median 5, cap 8 | 4–6, median 6 ✓ |
| Captions | 9–19 | 9–13 ✓ |
| Hero viewport | quiet | 45 words ✗ (`vpwords` vp 0) |
| Viewport avg / quiet | ≤30 / ≥45% | 40 / 0% ✗ |

### Motion verdict

The restraint is right: no scroll reveals, single-shot beats, and stillness after every beat (0 rAF).

The **hero is under-powered for the "live system thinking" ask**:
- The loop plays once in about 7 s and locks into a solid ring.
- From t3 to t7 the frames are identical (`signal-hero-crop-t2-t7.png`).
- The trace, which is the strongest "thinking" signal, is 12px ink-3 mono (`demo.module.css:100`).
- The tool-call packet is too small to read at 1440.

The halt itself is good orb language: the exit condition is visible.

### Fix now (Signal)

| # | Sev | Issue | Evidence | Fix (Signal grammar) |
|---|---|---|---|---|
| 1 | P1 | 0% quiet viewports, avg 40; two captures per screen | `words-signal-1440.txt`; `vpwords-signal-1440.txt` vp 6–9 | Apply the §3 merge. Each capture becomes a ≥1.6 vh pin. The first viewport is the scope screen running its beat with only the T+ tick and the headline on the timebase. Caption and control arrive in the last 0.6 vh. |
| 2 | P1 | Hero runs once, then a still life | `signal-hero-crop-t2-t7.png` | Change `TRIG · SINGLE` to `TRIG · AUTO ×3`. Three runs, each lighting a different tool spoke (emit, then absorb), then a hold with `RUN 03`. Raise the trace to 14–16px, live step in `--r2-ink`. Sleep after the third run (keeps 0 rAF at rest). |
| 3 | P1 | Loop turn limit is wrong: max 3 shows `error_max_turns`, but S5 counts tool-use turns only, so 3 tool turns plus the answer succeed | `_brain/scenes-a.ts:139` `final = maxTurns >= LOOP.needed` | `final = maxTurns >= LOOP.needed - 1`, and label the stepper `max tool turns`. |
| 4 | P1 | Plan mode is described as "blocked and returned". S5: plan explores without editing; edits are never auto-approved and go through `canUseTool` | `_content/brain.ts:238`, `_brain/DemosB.tsx:288` | Mode line: `plan · proposes, does not edit`. Readout: `PLAN · EDIT NOT RUN`. |
| 5 | P2 | Hero first viewport is 45 words | `vpwords` vp 0 | Move the status line to the close. Put the key in the stage corner (`1 DOT ≠ 1 TOKEN · ILLUSTRATIVE`, mono). Widen heroText to 6 columns or step the h1 to 64px so it sets in 3 lines without the orphaned "A". |
| 6 | P2 | A "Faithful" chip on all 8 chapters reads as a claim and costs words. Harness has no illustrative note although the turns/budget arcs and the notes coda are pictures | `_brain/Bits.tsx:18-28`; `_content/brain.ts:148-164` | Drop the chip. Add one scope-corner readout `ILLUSTRATIVE · <part>` on each screen that holds a metaphor; harness gets `ILLUSTRATIVE · ARCS, NOTES`. |
| 7 | P2 | Mobile labels at 10px (tags) and 11px (readouts) | `_brain/demo.module.css:186-187` | Mobile floor of 12px mono. Cut tag text rather than shrink it. |
| 8 | P3 | No red trigger anywhere, against the contract | `signal-hero-t1.png` | Put the one red anchor on the held gate call (the `route` verb's anchor), or on the nav trigger as contracted. Choose one. |

---

## 2. Apple world

### Critique: Nielsen (7 and 10 n/a)

| # | Heuristic | Score | Note |
|---|---|---|---|
| 1 | Visibility of system status | 2 | The hero's trace row vanishes once the clip loads, and the ch4 readout contradicts the clip. |
| 2 | Match with the real world | 3 | Plain sentence readouts ("Edit waits. Enter approves, Esc denies."). |
| 3 | User control | 3 | The hero clip has a pause/replay control. |
| 4 | Consistency | 3 | |
| 5 | Error prevention | 3 | |
| 6 | Recognition | 3 | The highlights strip uses glyph anchors. |
| 7 | Flexibility | n/a | |
| 8 | Aesthetic and minimalist design | 2 | 0% quiet viewports. Every chapter stacks headline, caption, stage, readout, controls and fidelity. |
| 9 | Error recovery | 3 | |
| 10 | Help | n/a | |
| | **Total** | **22/32 (69%)** | Acceptable |

**Design specificity:** partial.
- The page reads as a competent product page: black chapters, a centred column, a pill segmented control and an 8-card strip.
- The hero is not shot like hardware. The orb sits small inside a grey #0b0c0a rectangle on #000 (`apple-hero-t8.png`, box at x 400–1040), which reads as a letterboxed video, not an object.

**Persona flags:**
- **Casey (mobile):** the local-nav "Join build night" target is 28px tall (`capture.json`).
- **Jordan (first-timer):** ch4 says "nothing evicts yet" while the picture evicts.

### Audit

| Dimension | Score | Key finding |
|---|---|---|
| Accessibility | 3 | Rings show on every stop. The local CTA is 114×28 at 390 (shared chrome, `_chrome/chrome.module.css:52`). |
| Performance | 3 | 0 r2 rAF at rest. Clips are 0.5–0.9 MB webm. |
| Responsive | 3 | No overflow. 390 uses the 4×5 clips. |
| Theming | 3 | Clip ground #0b0c0a does not match chapter #000. |
| Implementation integrity | 2 | Clip mode overrides the manifest intent (once vs loop). Clip content contradicts the ch4 copy. The close's `does` list is untagged. |
| **Total** | **14/20 (Good, low)** | |

### Contract compliance

| Block | Status | Evidence |
|---|---|---|
| THESIS | partial | Chapters do isolate one mechanism. The hero orb is not "shot like hardware": it is small and letterboxed (`apple-hero-t8.png`). |
| OWN-WORLD | partial | Black then light, Geist 600, pills, the strip and the local nav with a filled CTA all hold. Red appears beyond the contract's two uses: the brain-context clip draws a red "now" dot in every frame (`clips/brain-context-contact.png`). |
| STORY | partial | Fidelity is labelled on every chapter. The ch4 picture contradicts its own steps. |
| FIRST VIEWPORT | partial | Local nav and the two-line 80px h1 hold. The orb renders at about 150px inside a 640×360 box, not 560px. The clip plays once and freezes at t = 6 s (`capture.json` heroVideo `paused:true, t:6`). |
| FORM | partial | brain-context is scrubbed through ch4 ✓, but the picture runs fill, then evict, then compress, while the readout says "Turn 5 of 6: 73% full" (`apple-390-step04.png`) and the reduced-motion poster shows evicted rows under "Turn 6 of 6: 95% full" (`apple-rm-context.png`). Gate and drag work. |
| FINISH | missed (W3) | |

### Copy budget (Apple)

| Element | Budget | Measured |
|---|---|---|
| h1 | ≤8 | 8 ✓ |
| Strip cards | 9–14 | 6–9 ✗ (short; fine for a strip) |
| Hero viewport | quiet | 23 ✗ |
| Viewport avg / quiet | ≤30 / ≥45% | 35 / 0% ✗ (390: 34 / 8%) |

### Motion verdict

Restraint is right in the chapters: no scroll reveals (verified, no `r2-reveal` or `animation-timeline` in `apple/brain/*`) and 0 rAF at rest.

The two clips are mis-cast:

- **brain-orb**
  - The manifest authors it as `'loop'` with a pause control (`_system/cine/manifest.ts:105-110`).
  - The page forces `mode="once"` (`apple/brain/page.tsx:234`), so the "live system" lasts 6 s and then freezes.
  - Once the clip is ready, the `HeroOrb` fallback (and with it the trace row and Run again) never renders. Visitors lose the only text that says what the orb is doing.
- **brain-context**
  - The clip shows fill, then evict, then compress (`clips/brain-context-contact.png`).
  - That is the merged chapter's whole arc, so it is the right asset for the 6-chapter page and the wrong one for the current ch4.

### Fix now (Apple)

| # | Sev | Issue | Evidence | Fix (Apple grammar) |
|---|---|---|---|---|
| 1 | P1 | Hero clip plays once and freezes; trace row lost; orb small in a grey letterbox | `apple-hero-t8.png`; `capture.json` heroVideo; `page.tsx:234` | `mode="loop"` with the existing pause control, auto-paused after 3 loops or offscreen. Set the HTML trace row under the clip from `currentTime` (`evaluate · tool_call · result · done`). Render or crop the clip on #000 at a 1:1 ~560px stage, no visible box. |
| 2 | P1 | ch4 readout contradicts the scrubbed clip | `apple-390-step04.png`; `apple-rm-context.png` | Resolved by the §3 merge. The merged "Context" chapter scrubs brain-context end to end, and the readout follows clip phases (`% full` → `Oldest turn evicted` → `History compacted`). The interactive end frame follows. |
| 3 | P1 | 0% quiet viewports, avg 35 | `words-apple-1440.txt` | §3 merge. Each dark chapter opens on headline + stage alone; the stage plays its beat once. Caption, control and readout enter below after ~0.6 vh. Fidelity and steps go into one "How it works +" disclosure per chapter. |
| 4 | P1 | Honesty: "Competes in hackathons." and the rest of the `does` list are untagged (only the status line carries [confirm]) | `apple/brain/page.tsx:321-328` vs signal `page.tsx:142-144` | Put [confirm] on the list as Signal does, or set "Planned" status as the list's lead-in. |
| 5 | P1 | Local nav CTA is 28px tall at 390 (44px rule) | `capture.json` smallTargets390; `_chrome/chrome.module.css:52` | Keep the 28px pill and extend the hit area to 44px (pseudo-element or block padding). Shared chrome, so flag it to the chrome owner. |
| 6 | P2 | Loop turn limit and plan-mode copy are wrong (shared) | `scenes-a.ts:139`; `brain.ts:238` | See §4 rows 1–2. |
| 7 | P2 | Strip says "Eight ideas. One system." | `page.tsx:243` | After the merge: "Six ideas. One system." with 6 cards (merged cards carry both glyphs' meanings in one line). |
| 8 | P3 | Clip red "now" dot exceeds the red contract | `clips/brain-context-contact.png` | Re-render the clip with the dot in ink, or accept it as the single anchor and remove red from the gate on this page. |

---

## 3. The 6-chapter merge plan (Head Designer decision, applied in W3)

The **rule that produces ≥45% quiet**:
1. Every chapter is one pin of **1.6 vh** (1440) or **1.8 vh** (390).
2. The first ~1.0 vh shows **only the headline and the stage running its beat**. That is the quiet viewport, with ≤12 counted words.
3. The caption and the single control enter in the last 0.6–0.8 vh.
4. Everything else moves into one disclosure per chapter: Signal `HOW IT WORKS ▸` (mono), Apple "How it works +". It is closed by default and open under reduced motion and no-JS, so parity holds.
5. Visible live state is ≤3 words.
6. Remove the "Faithful" chip. One `illustrative` tag sits on the stage where a metaphor appears.

| # | Chapter (merged from) | Headline (≤5) | The one caption | Surviving interaction | Behind the disclosure | Stage-only quiet viewport |
|---|---|---|---|---|---|---|
| H | Hero | "A model predicts. A system gets work done." (8, kept) | Lead moves to the hero's second half-viewport: "BRAIN builds software with agentic tools. Here is how they work. [confirm]" | Run again / pause | The key "A dot is not a token. Counts are illustrative." | First viewport: h1 + orb looping 3 runs (Signal: DotStage; Apple: brain-orb loop) + trace. ≤12 words |
| 1 | Agent loop (ch1) | "Think. Act. Check. Repeat." (4) | "A reply with no tool call ends the loop." (9) | Max **tool** turns stepper (bug fixed) | 4 steps; `error_max_turns` and `maxBudgetUsd`; S5 | Ring laps 3 times, then halts on the answer |
| 2 | Tool use (ch2) | "The model only asks." (4) | "The harness runs the tool and hands back the result." (10) | Tool picker: search / read file / run tests | Read-only tools may run in parallel; Edit/Write/Bash run in sequence; a denied call returns as the result; S1 S5 | One call: emit → node pulse → 3×3 result absorbed |
| 3 | MCP (ch3) | "One protocol. Any server." (4) | "One client per server: stdio on this machine, Streamable HTTP for remote." (12) | 3 server switches | Primitives legend (tools / resources / prompts); `server/discover` then `tools/list`; `list_changed` is opt-in via `subscriptions/listen` and best-effort; sampling and logging deprecated; spec 2026-07-28 | Three servers wire in, each with its discover round trip |
| 4 | **Context** (ch4 + ch5) | "One window. Choose what stays." (5) | "Every turn adds to it. When it fills, something has to give." (12) | Drag the document in → Evict oldest / Compact / Load on demand (one interaction, 3 outcomes) | Pinned and cached prefix; context rot (illustrative); notes outside the window; just-in-time loading; S3 S5 | **The page's one scrubbed asset:** about 1.2 vh where scroll fills the window to 95% (Apple: brain-context; Signal: contextScene). Readout `% FULL` only |
| 5 | **Harness** (ch6 + ch7) | "The harness decides what runs." (5) | "Edits wait at the gate. A denial returns as the result." (11) | Gate: Approve (Enter) / Deny (Esc), default mode only | Mode table (default, acceptEdits, plan, dontAsk, auto, bypassPermissions); hooks (PreToolUse, PostToolUse, Stop, PreCompact, SubagentStart/Stop); turn and budget limits; long-task notes coda; one-window vs subagent meters (85% / 30%, illustrative) | Two: (a) the call routes and holds at the gate; (b) **subagent coda**, plays once: the orb buds 3 helpers in clean windows, each returns one summary dot. Label: "Helpers start clean. Summaries come back." (6) |
| 6 | Evals (ch8) | "Passed once. Pass every time." (5) | "pass@k: at least one of k passes. pass^k: all k pass." (11) | k slider (1–10) | Both formulas; p = 0.7 and independence (illustrative); graders (code / model / human); capability vs regression suites; S9 | The trial row resolves on entry (5 click-backs) |
| C | Close | "BRAIN" + expansion | Thesis [confirm] | Join build night (link) | Sources and spec version | BRAIN mark + name + expansion (7 words) |

**Projection** (re-measure, don't trust it): 6 × 1.6 + hero 1.4 + close 2 ≈ **13 vh at 1440**, about 8 of 13 viewports quiet (≈60%). Text viewports carry about 5 + 12 + 6 control labels + 3 state words ≈ 26, so avg ≈ 18–22.

Gate: `node design-lab/scripts/r2-words.mjs` must show ≥45% quiet (≥50% at 390) and avg ≤30 in both worlds.

The cut also removes 2 interactions (the context-window stage has none to lose; the subagent toggle and the harness mode switch become static). That leaves 6 interactions for 6 chapters.

---

## 4. Both worlds: content, accuracy, honesty

### Technical accuracy

Checked against `research/agentic-storytelling.md` and today's live fetches of S1 (modelcontextprotocol.io architecture page, states spec `2026-07-28`) and S5 (Agent SDK agent-loop page).

| # | Claim on page | Verdict | Location | Fix |
|---|---|---|---|---|
| 1 | Max turns < 4 → `error_max_turns` | **Wrong.** S5: "`max_turns` … counts tool-use turns only"; the example's 3 tool turns + final answer = 4 turns | `scenes-a.ts:138-139`, `brain.ts:205` | Threshold `needed - 1`; label "max tool turns" |
| 2 | plan = "Read-only: edits are blocked" / "Edit blocked and returned" | **Inexact.** S5: plan explores without editing; edits are never auto-approved and prompt through `canUseTool` | `brain.ts:238`, `DemosB.tsx:288` | "plan · proposes, does not edit" |
| 3 | "Everything it knows fits in here." | **Overclaim.** The window is what the model sees now, not what it knows (weights) | `brain.ts:116` | Merged headline "One window. Choose what stays." |
| 4 | "Discovery lists each server's tools, resources and prompts." | **Inexact.** `server/discover` returns versions and capabilities (optional for clients); `tools/list` etc. list primitives | `brain.ts:108` | "Discovery reports what it supports; `*/list` names its tools." The readout sequence `SERVER/DISCOVER → TOOLS/LIST` is already right |
| 5 | Subagents "each with an empty window" | Slightly off. S5: fresh conversation, no parent history, but it loads its own system prompt and CLAUDE.md | `brain.ts:176` | "each with a clean window (no parent history)" |
| 6 | "pass@k: one success in k trials" | Ambiguous (reads as exactly one) | `brain.ts:187` | "at least one of k" |
| 7 | "Each trial scrambles the task…" | **Metaphor stated as fact** | `brain.ts:193` | "Each trial runs the task; a grader checks the end state." Keep the scramble as the illustrative picture |
| 8 | Host / one client per server / stdio vs Streamable HTTP | ✓ matches S1 verbatim | `brain.ts:99-109` | Use "Streamable HTTP" in the caption too |
| 9 | Toggling a server | ✓ shows connect/discover/list and "tools removed". It does **not** misuse `list_changed` (that is server-initiated, opt-in via `subscriptions/listen`, best-effort) | `DemosA.tsx:212-227` | If W3 adds a list_changed pulse, fire it only for a server whose own tools change, never on connect |
| 10 | Tool call = request; host runs it; denial returns as result | ✓ S1, S5 | `brain.ts:82-91`, `DemosB.tsx:285` | |
| 11 | MCP spec pinned | ✓ `MCP_SPEC = '2026-07-28'` in readout, legend and sources; matches the live S1 page (sampling and logging deprecated as of that version) | `brain.ts:13` | Re-check before launch |
| 12 | "Illustrative" labelling | Partial. Ch2 tools (1 → 3×3 transform) and ch6 harness (turn/budget arcs, notes coda) carry metaphors but no illustrative note; every chapter wears "Faithful" | `brain.ts:79-164`, `Bits.tsx:18` | One stage tag per metaphor; drop the chip |

### Honesty (concept story, no claim of teaching or building)

- ✓ No chapter says DIGITAL teaches or has built MCP or harness infrastructure, and no curriculum appears.
- ✓ Hero lead and status carry [confirm].
- ✗ The Apple close's `does` list is untagged (`apple/brain/page.tsx:321-325`); see Apple fix 4.
- ✗ In both worlds the method loop (Predict → Record) and the three questions are untagged Notion facts (`signal/page.tsx:126-137`, `apple/page.tsx:311-319`). Add one [confirm] to the close block.
- ⚠ `close.headline` "BRAIN builds with these tools." is unused (`brain.ts:247`). "These tools" next to MCP/harness chapters reads as "BRAIN built/uses this infrastructure". Delete it, or tag it if W3 uses it.
- ⚠ "Open to every engineering major" (Notion) vs Home's "any major" (PRODUCT.md). Flag for the cross-page consistency reviewer.

### Hero: "watching a live system think"

| | Signal | Apple |
|---|---|---|
| Feels alive for | about 3–7 s (one run), then a still ring | 6 s (clip once), then a frozen frame |
| What says "thinking" | Trace row (12px, ink-3, too quiet) plus a small packet | Nothing textual: the trace row is gone when the clip loads |
| Orb/dot language at its best? | Yes for the halt (ring locks = exit condition). The tool spoke is not legible | The clip's wiring to 6 tool nodes is clear (`clips/brain-orb-contact.png`), but too small in its box |
| Fix | 3 auto runs, each a different tool, larger trace, then sleep | brain-orb **loop + pause** as the manifest intends, the trace row synced to the clip, on #000 at ~560px |

Both fixes keep the gate: stop after N runs or offscreen, then 0 rAF at rest.

### Shared and system issues (outside BRAIN, report to owners)

1. **Production cursor rAF still runs on r2 routes.** 180–182 callbacks per 3 s at rest on desktop in both worlds (`raf-*.txt`, "cursor" column). The r2 layout hides the cursor but not its loop. Owner: SYS / layout.
2. **Hydration warning** "Extra attributes from the server: style" on the eval slider `<input>` (`DemosB.tsx:436`, `capture.json` errors). `r2-brain-raf.mjs` reports "console errors 0" because it does not count this warning.
3. **Local nav CTA** is 28px tall (`_chrome/chrome.module.css:52`); signal nav CH links are 25px wide at 390.

---

## 5. Gemini cross-check (`gemini.md`, gemini-pro)

| Gemini claim | Agree? | Evidence |
|---|---|---|
| Signal: highly stateful, no decorative motion, text readable on entry | **Agree** | No reveals in code; `signal-1440-steps-contact.png` |
| Signal hero alive about 4–5 s | **Agree** | `signal-hero-crop-t2-t7.png` (locked by t3) |
| Signal hero keeps a "subtle idle rotation" | **Disagree** | t3–t7 frames identical; 0 rAF at rest (`raf-signal.txt`) |
| Signal loop "tied to scroll speed" | **Disagree** | Loop is time-driven on entry (`DemosA.tsx:89`); only ch4 scrubs |
| Signal compaction "snaps instantly" | **Inconclusive** | Frames f0630–f0636 are duplicated mid-travel streaks, then f0637 jumps (`gem-signal-compact-f0630.png`). The recorder dropped frames under SwiftShader. Code tweens over `ENG_MS` |
| Signal deny "red line snaps back" | **Disagree** | No red in the Signal harness (`signal-i-harness-denied.png`) |
| Signal ch4: text scrolls away before the window is full | **Agree (desktop partial)** | At 1440 the text is in the sticky block; at 390 it scrolls away by design (`brain.module.css:180`). The merge's quiet scrub fixes the intent |
| Apple: "every section fades up on scroll" | **Disagree** | No `r2-reveal` or `animation-timeline` in `apple/brain/*` |
| Apple: context window "abandons scroll-scrub" | **Disagree** | brain-context scrubs (`DemosB.tsx:78`; `apple-390-step04.png` mid-scrub) |
| Apple hero "never stops moving" | **Disagree** | Video paused at t = 6.0 s, `loop:false` (`capture.json`) |
| Apple deny bounce feels springy and playful | **Partly agree** | The bounce is the documented "reject → hollow, returned as result"; a 240 ms linear return would read more like a refusal |
| Apple compaction and MCP layout motion fluid | **Agree** | `apple-i-eng-compact.png`, `apple-i-mcp-off.png` |

Gemini was wrong on 6 of 12 claims, mostly by inventing ambient motion and reveals. Trust the frames and code over Gemini.

---

## Run notes

- The critique snapshot was **not** persisted through the impeccable helper: this critic's write scope is this file plus its evidence. Persist it in W3 if wanted.
- Signal webm interactions for loop and engineering hit 30 s screenshot timeouts (SwiftShader font wait). Their readouts were verified by `r2-brain-raf.mjs` instead (`raf-signal.txt`).
- Evidence (`design-lab/renders/r2/crit/brain/`): `{signal,apple}-{1440,390}-step00..09.png`, `*-steps-contact.png`, `{world}-1440.webm`, `frames-{world}/`, `{world}-hero-t0..8.png`, `{world}-i-*.png`, `{world}-rm-*.png`, `{world}-nojs-*.png`, `clips/*-contact.png`, `words-*.txt`, `vpwords-*.txt`, `raf-*.txt`, `detect.json`, `capture.json`, `gemini.md`.
