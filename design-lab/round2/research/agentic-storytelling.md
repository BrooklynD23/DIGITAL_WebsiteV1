# BRAIN page: agentic storytelling with the dot engine (R2-AGENTIC)

Verdict: build BRAIN as **one pinned 2D-canvas stage + 8 scroll chapters**, each chapter one concept, all drawn by one shared dot engine that emits the same `OrbFrame` the `thinking-orbs` painter already draws. No WebGL needed. Copy lines below are drafts for brand-voice-strategist. Real BRAIN facts come from Notion via another agent and appear here only as `[content from Notion]`.

Fidelity tags: **F** = mirrors the documented mechanism (cited). **M** = metaphor; the page must not imply it is literal. Standing rule: a dot is not a token. Any count shown is labelled "illustrative".

## 1. Technical ground truth (what the visuals must not contradict)

| Concept | Correct model (short) | Source |
|---|---|---|
| Agent loop | Prompt + system prompt + tool definitions + history go in. The model responds with text and/or tool calls. The SDK runs the tools and feeds results back. One round trip = one turn. The loop ends when a response has no tool calls. `maxTurns` / `maxBudgetUsd` cap it (`error_max_turns`). | S5 |
| Tool call | The model only *requests* a call (name + arguments matching an `inputSchema`). The host application intercepts, executes and returns a result. Read-only tools can run in parallel; state-changing tools (Edit, Write, Bash) run sequentially. A denied call returns a rejection as the tool result. | S1, S5 |
| MCP participants | **Host** (AI app) creates **one client per server**. Each client keeps a dedicated connection to one **server**. Local servers use **stdio** (usually 1 client). Remote servers use **Streamable HTTP** (POST + optional SSE, OAuth recommended; usually many clients). | S1 |
| MCP primitives | Server side: **tools** (actions), **resources** (context data), **prompts** (templates); discovered with `*/list`, run with `tools/call`. Client side: **elicitation** (ask the user). Sampling and logging are deprecated as of spec `2026-07-28`. | S1 |
| MCP protocol (2026-07-28) | Two layers: JSON-RPC 2.0 data layer (inner), transport layer (outer). **Stateless**: every request carries protocol version + capabilities in `_meta`. `server/discover` is mandatory for servers, optional for clients. Change notifications (`notifications/tools/list_changed`) are opt-in through `subscriptions/listen` and best-effort. | S1 |
| Why MCP | Replaces N×M one-off integrations with one open protocol (announced 2024-11-25). | S2 |
| Context window | Everything accumulates and nothing resets between turns: system prompt, tool definitions, history, tool inputs and outputs. Stable prefixes are prompt-cached. | S5 |
| Context rot / attention budget | Recall degrades as tokens grow. Context is "a finite resource with diminishing marginal returns". Transformers form n² pairwise token relationships. | S3 |
| Context engineering | "Curating and maintaining the optimal set of tokens" for each inference, repeated every turn. Levers: **just-in-time retrieval** (keep pointers, load on demand), **compaction** (summarize history near the limit), **structured notes** (memory outside the window), **sub-agents** (clean windows that return condensed summaries of 1-2k tokens), lean tools. | S3, S5 |
| Harness | The software layer around the model: loop, tools, permissions, hooks, context management, sessions, limits. Hooks (`PreToolUse`, `PostToolUse`, `Stop`, `PreCompact`, `SubagentStart/Stop`) run outside the context window and can block a call. Permission modes: `default` (ask), `acceptEdits`, `plan`, `dontAsk`, `auto` (classifier), `bypassPermissions` (isolated envs only). | S5, S6 |
| Long-running harness | An initializer agent writes a feature list (all marked failing), a progress file, `init.sh` and a first git commit. Each later coding session reads the git log and progress notes, makes one increment, verifies end to end, and leaves a clean state. | S7 |
| Workflows vs agents | Workflows follow predefined code paths. Agents direct their own tool use. Patterns: chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer. Building block = LLM + retrieval + tools + memory. | S4 |
| Verify step | Agent SDK loop = gather context → take action → verify work → repeat. Verification uses rules (lint/tests), visual feedback, or an LLM as judge. | S8 |
| Evals | Task, trial, grader (code / model / human), transcript, outcome (the real end state). **pass@k** = at least 1 of k trials succeeds. **pass^k** = all k succeed. Capability suites start low; regression suites sit near 100%. | S9 |

## 2. Reference findings (screens in `design-lab/round2/references/agentic/`)

| # | Reference | What it does well | Take / avoid | Screens |
|---|---|---|---|---|
| R1 | Claude Agent SDK, "How the agent loop works" | One small loop diagram: prompt → evaluate ⇄ tool calls → final answer. Exits are explicit. | **Take** the exit edge ("no tool calls") as a visible event. | `claude-agent-loop-1` |
| R2 | Anthropic, "Effective context engineering" | Prompt vs context engineering figure: a big pool of possible context, curated into a small dashed window with scissors. | **Take** the dashed fixed window + "curation" step. This is chapter 4-5's skeleton. | `anthropic-context-eng-1,4` |
| R3 | Anthropic, "Building effective agents" | Augmented-LLM hub with 3 satellites; orchestrator fan-out and fan-in. Calm, labeled, 1 idea per figure. | **Take** fan-out and fan-in for subagents. **Avoid** box-and-arrow look; dots carry it. | `anthropic-effective-agents-1,2` |
| R4 | modelcontextprotocol.io architecture | Host box containing N clients, each with a "dedicated connection" to a server. | **Take** the 1 client per server rule literally: one port per server on the ring. | `mcp-architecture-1` |
| R5 | Ciechanowski, Mechanical Watch / GPS | One slider per idea. Prose names the part in the part's color. Every figure is manipulable. | **Take** "named part = colored word" and one control per figure. | `ciechanowski-watch-1`, `ciechanowski-gps-1` |
| R6 | Distill, "Attention and Augmented RNNs" | Memory drawn as an array of cells with read/write heads; prose sits above each figure. | **Take** cells as slots for the context lattice; read/write as dot travel. | `distill-attention-3` |
| R7 | Transformer Explainer (Polo Club) | Live model, flows drawn as ribbons, guided 1-of-20 tour over a dense canvas. | **Avoid** this density for BRAIN. **Take** the "stepper over a live diagram" for reduced motion. | `transformer-explainer-0` |
| R8 | Linear for Agents | Real agent transcripts: "Thinking…", "Mobile Triage added to context". | **Take** a mono trace line ("read · call · check") beside the orb as live-system texture. | `linear-agents-0` |
| R9 | Cursor home | Agent work shown as an activity log: "Read about-acme.md", "Thought 6s", diffs +52 -0. | Same as R8. Keep it to 1 line, not a fake app chrome. | `cursor-0` |
| R10 | LangGraph | Hero lines pinch through one point, then fan out: "control with agency". | **Take** pinch-then-fan for the harness gate. | `langgraph-0` |
| R11 | Stripe home | A live ticking figure in the hero ("GDP running on Stripe"). | **Take** a live counter (turn number, window fill %). Never a fake metric. | `stripe-home-0` |
| R12 | Vercel AI SDK | Code beside output, tabbed by capability. | **Avoid** on BRAIN. Code belongs in the class module, not the story. | `vercel-ai-sdk-0` |

Pattern across the best ones (R1, R2, R5, R6): **one mechanism per figure, the exit condition shown, one control, and words that name parts.** That fits Apple's one idea per viewport.

## 3. The story: hero + 8 chapters + close

Stage: one sticky full-viewport `<canvas>` (dots) + one SVG overlay (wires, labels, focus rings) + DOM text column. Each chapter = a **scrub segment** (pinned 150vh desktop, 100vh mobile; scroll drives a paused timeline) and then a **play beat** (pin releases, the end frame holds, controls appear, time-based tweens run only while you interact). Visitors never have to interact while the page is scrolling.

### H0. Hero: the orb at full size
- **Idea (draft):** "A model predicts. A system gets work done." (8 words)
- **Dots:** the `working` orb at 560px (≈900 dots desktop, 450 mobile). A mono trace line under it cycles real loop verbs: `evaluate · tool_call · result · evaluate · done`.
- **Choreography:** on load, a 1.2s settle from scattered to orbit (trigger). Scroll 0→100vh scrubs the orbits flattening into one ring, which is chapter 1's loop.
- **Interaction:** pointer proximity bends nearby orbits (the library already has `gravity`; desktop fine pointer only).
- **Reduced:** static `working` frame + the trace line as a static list.  **Fidelity:** M (the orb is a mark for "the model").

### Ch1. The agent loop (F)
- **Idea:** "Think. Act. Check the result. Repeat until done." (8)
- **Dots:** one ring. A bright packet dot laps it through 3 waypoints: *evaluate* (orb), *tool call* (out on a spoke), *result* (back). Each lap ticks a mono `turn 01…04` counter. On the last lap no spoke fires: the packet drops into the centre and the ring **halts** (final answer).
- **Choreography:** scrub = laps 1-3. Trigger = final settle + halt (300ms, `cubic-bezier(.2,0,0,1)`).
- **Interaction:** a `max turns` stepper (1-6). Set it below 4 and the ring stops early, broken, labelled `error_max_turns`. This is a faithful stop condition.
- **Reduced:** 4 static frames in a row (turn 1, 2, 3, done) with captions.  **Cost:** 1 ring (≈120 dots) + 1 packet; trivial.

### Ch2. Tool use (F)
- **Idea:** "The model asks. The harness runs the tool." (8)
- **Dots:** a dot **emits** from the orb carrying a 3-dot tail (name + args). It crosses the harness ring, then hits a square tool node, which **pulses**. It returns **transformed** (1 dot → a 3×3 result cluster) and is **absorbed**; the orb grows by those 9 dots.
- **Choreography:** scrub = one full call. Trigger = node pulse.
- **Interaction:** pick 1 of 3 tools: `search` / `read file` / `run tests`. Each returns a different payload shape (wide row / tall block / pass-fail pair). A "parallel" toggle: 3 read-only calls fly at once, but `run tests` (state-changing in this demo) waits its turn. This mirrors S5's parallel rule.
- **Reduced:** before/after pair + numbered steps.  **Cost:** <60 moving dots.

### Ch3. MCP: plug a server in (F, with 1 M)
- **Idea:** "One protocol. Any tool server plugs in." (7)
- **Dots:** the harness ring is the **host**. It grows **one port per server** (= client). Outside sit 3 generic server glyphs (filesystem, database, issue tracker; examples, not DIGITAL claims). Each glyph shows its primitives: **tools = squares, resources = filled dot stack, prompts = outline triangle**. Connecting a server **wires** it: a dotted tether draws to its own port. A `server/discover` packet runs out and back (its `_meta` rides as a trailing dot). Then the server's tool squares slide onto a **registry belt** around the orb. **Transport:** local = short solid tether inside a dashed "this machine" boundary (stdio); remote = long dashed wire leaving frame (Streamable HTTP).
- **Choreography:** scrub = 3 servers wire in sequence. Trigger = each discover round trip.
- **Interaction:** toggle each server on or off. Turning one on or off fires a `list_changed` **pulse** down its wire, and the belt adds or drops its tools. Hover a glyph to name its tools, resources and prompts.
- **Reduced:** static wired diagram with a legend for the three primitive shapes.  **M:** the belt is a stand-in for the tool registry.

### Ch4. The context window (F mechanism, M rot)
- **Idea:** "Everything it knows right now fits in here." (8)
- **Dots:** a **fixed-capacity lattice sphere** (12 × 16 = 192 slots, illustrative). The top band is **pinned** (system prompt, tool definitions); its outline marks "cached". Each turn **fills** slots in order: user message, assistant reply, tool result (big tool results take many slots). A live `% full` counter. As fill rises, all dots **dim** a little (attention spread thinner) and a few far dots blur.
- **Choreography:** scrub = 6 turns fill the sphere to 95%. Nothing evicts yet; the tension carries into Ch5.
- **Interaction:** none; this chapter only sets up the problem.
- **Reduced:** 3 static fills (20%, 60%, 95%).  **M:** dimming is a picture of context rot (S3), not attention math.

### Ch5. Context engineering (F)
- **Idea:** "Choose what enters. Compress what stays." (6)
- **Dots:** the same sphere. Three levers, each a primitive: **compress** (old history dots collapse into one dense summary cluster; pinned band untouched; frees ≈60% of slots); **just-in-time** (a document arrives as one hollow *pointer* dot and expands to a full cluster only when a scan line selects it); **notes** (decisions written to a small "file" stack *outside* the sphere and read back later).
- **Choreography:** scrub = compaction plays once (the S5 `compact_boundary` moment, shown as a hairline). Trigger = summary cluster lands.
- **Interaction (signature):** drag a document card (24 dots) into the sphere. Keyboard: an "Add document" button. If it overflows, pick a strategy: **Evict oldest** (dots leave and are gone; a lost-detail marker shows the risk), **Compact** (history compresses), or **Load on demand** (only the pointer enters). The `% full` counter reacts each time.
- **Reduced:** 3-up comparison of the strategies, end states only.  **Cost:** ≤260 dots.

### Ch6. The harness (F)
- **Idea:** "The harness decides what the model may touch." (8)
- **Dots:** the ring becomes a **cage** with notched **gates**: `PreToolUse`, `PostToolUse`, `PreCompact`, `Stop`. Tool-call dots **route** through gates: pass straight, or **reject** (bounce back as a hollow dot, delivered as the tool result, as S5 describes). A turn-limit arc and a budget arc thin as they are used. **Pinch-then-fan** (R10) at the gate: calls funnel through 1 point, then fan out to tools.
- **Choreography:** scrub = 4 calls; 1 is blocked by a hook. Trigger = bounce.
- **Interaction (signature):** *you are the permission callback.* A pending `Edit` call stops at the gate and blinks. Approve, and it passes; deny, and it bounces and the orb picks another path. A mode switch (`plan` / `default` / `acceptEdits`) re-colors which call types wait at the gate. Keyboard: Enter = approve, Esc = deny.
- **Coda (long-running harness, F):** the orb fades out (the session ends). Its notes stack and a feature list (dots, all hollow = failing) stay. A new orb buds in, reads the notes and fills one hollow dot.
- **Reduced:** a gate diagram + a table of the 3 modes.  **Cost:** ≤200 dots.

### Ch7. Subagents (F)
- **Idea:** "Split the work. Each helper starts clean." (7)
- **Dots:** the orb **buds** 3 child orbs. Each has its own empty mini-lattice (a fresh window). The children work (orbit), then **compress** to 1 summary cluster each and **merge** home. The parent's fill meter rises by 3 small clusters, not 3 transcripts.
- **Choreography:** scrub = bud → work → return. Trigger = merge flashes.
- **Interaction:** toggle "one window" vs "subagents" and compare the parent meters side by side (fill numbers illustrative).
- **Reduced:** two static end states with meters.  **Cost:** 4 orbs × ≤120 dots.

### Ch8. Evals (F)
- **Idea:** "It passed once. Make it pass every time." (8)
- **Dots:** the team's beloved **scramble-then-clicks-back** (`solving`) *is* one trial. A row of k small lattices scrambles; each either clicks back (pass) or stays scrambled (fail). Three grader glyphs: code (square), model (orb), human (outline). Outcome is checked on the end state, not on the reply text.
- **Choreography:** scrub = 5 trials resolve in sequence. Trigger = each click-back.
- **Interaction:** a k slider (1-10) with a fixed per-trial pass rate p = 0.7 (labelled illustrative). Two live readouts: **pass@k = 1 − (1 − p)^k** rises; **pass^k = p^k** falls. That gap is the lesson. The formulas assume independent trials; say so.
- **Reduced:** static row + a 2-line table at k = 1, 3, 10.  **Cost:** 10 × 64-dot lattices.

### Close. BRAIN itself
- Orb returns to `shaping` (Plan outline). Text: `[content from Notion: BRAIN name + expansion, thesis, method loop, three questions, what members do, join path]`. No modules, partners, wins or curriculum unless Notion supplies them.

## 4. Scroll + performance architecture
1. **One stage, one canvas:** dots for all chapters live in 1 particle pool (cap 1,200 desktop, 600 mobile). Chapters reassign roles rather than mount new canvases.
2. **Drive:** Lenis `scroll` event → `timeline.progress(p)` on a paused GSAP timeline → 1 canvas draw. No ScrollTrigger scrub; IntersectionObserver picks the active chapter. Same pattern as the endorsed concept E (`signature-systems.md`: 0 rAF at rest).
3. **Triggered beats** (click-back, pulses, interactions) use short GSAP tweens. Acceptance check: a Performance trace shows **0 rAF callbacks within 1s of the last tween ending**. If GSAP's ticker does not sleep, drive beats with our own rAF that stops itself.
4. **Ambient life:** the hero orb animates while in view, at 30fps, and settles to a still frame after 10s without input. It resumes on scroll or pointer move. Offscreen or hidden tab = stopped (the library already does this).
5. **Rendering:** 2D canvas arcs (library painter), DPR cap 2. Estimated draw cost ~1ms for 1,200 dots (to be measured). SVG overlay for wires and labels. **WebGL/R3F does not earn its cost here**: counts stay under 1.5k and the language is flat ink.
6. **Mobile (<960px):** scrub segments shrink to 100vh. The drag interaction becomes tap-to-add. The text column moves above the stage, which takes 60vh.

## 5. Shared DOT ENGINE: states and primitives

**Contract:** the engine is a pure function `(scene, t, params) → OrbFrame` (`{dots, lines}`), the exact type `thinking-orbs` exports (`dist/engine/core.d.ts`). Three consumers draw it 3 ways:
(a) small icons go through the `ThinkingOrb` `frame` prop, inheriting theme, tint, reduced motion, offscreen pause and DPR cap; (b) the BRAIN stage and hero call `paintFrame` on our own canvas, because `ThinkingOrb.size` only allows 64/32/20 while `MODE_FRAMES` geometry accepts any size; (c) the homepage workflow strip keeps the stock states.
Each dot carries `{id, role, slot, home, pos, ink, r, pinned}`. Forms are layouts; verbs are transitions between them.

| Primitive | What dots do | Built from | Used by |
|---|---|---|---|
| `form(shape)` | settle into circle / triangle / square / lattice / glyph | lib `shaping`, `fibDir` | Plan stage, close, all icons |
| `orbit` | dots on tilted orbits | lib `working` | Prototype stage, hero, subagent work |
| `scan` | a meridian sweeps; selected dots light up | lib `searching` | JIT retrieval, discover |
| `scramble` / `solve` | bands quarter-turn out of place, then click back | lib `solving` | Test stage, evals |
| `wire` | edges draw between nodes; packets run along them | lib `connecting` | Integrate stage, MCP, orchestration |
| `emit` / `absorb` | a dot leaves along a path / merges back into a form | new | tool call, MCP packets |
| `transform` | a packet changes shape (1 → n cluster) | new | tool result |
| `fill(capacity)` | slots in a fixed lattice fill in order | new | context window |
| `pin` | marks dots immune to evict/compress (outlined) | new | system prompt, cached prefix |
| `evict` | chosen dots exit and fade; slot empties | new | context overflow |
| `compress(n→k)` | a group collapses into a denser cluster | new | compaction, subagent summary |
| `bud` / `merge` | a child form spawns from parent dots / returns as a cluster | new | subagents, new session |
| `route(gate)` | a path passes a gate: `pass`, `hold`, `reject` (bounce) | new | harness, permissions, hooks |
| `pulse` | a radial brightness wave along a ring or wire | new | notifications, turn tick |
| `dim(f)` | ink fades with a scalar (fill level) | new | context rot (M) |
| `halt` | motion stops; the form locks with a 300ms settle | new | stop condition, "done" icon state |
| `tether(kind)` | solid short (local) vs dashed long (remote) link | new | MCP transports |

Shared tokens: ink `#ece8de` on `#111311`; dot r scale 0.8/1.1/1.6px at 20/32/64; one red role only (**pending decision**: the gate holding a call for approval, and nothing else). Durations: beat 300ms, travel 600-900ms, settle 1.2s; ease `cubic-bezier(.2,0,0,1)`.

## 6. Custom dot icons (14), 9×9 dot grid, 32px (also 20 and 64)

Every icon has 3 states: **idle** = static frame (reduced motion shows this), **working** = loop, **done** = resolved frame held.

| Icon | Meaning | Construction (9×9 grid) | idle → working → done |
|---|---|---|---|
| Loop | agent loop | 16-dot ring r=4 + 1 bright packet at 12 o'clock | still → packet laps → packet in centre, ring `halt` |
| Tool call | request + result | orb (r=2 cluster, left) · 3-dot link · 2×2 square node (right) | still → dot out and back → returns as 2×2 |
| Tool | MCP tool primitive | 3×3 filled square | still → square `pulse` → solid |
| Resource | MCP resource | 3 stacked 3-dot rows | still → rows `scan` → top row lit |
| Prompt | MCP prompt | outline triangle (9 dots) | still → `form` circle→triangle → triangle |
| Server plug | connect MCP server | half-ring socket (left) + 3×3 node (right) | apart → `wire` draws → tether solid, node lit |
| Context window | finite window | 5×5 lattice clipped to circle, top row outlined (pinned) | half full → `fill` → full, pinned row intact |
| Compact | compaction | 12 scattered dots | still → `compress` → 4-dot dense cluster |
| Evict | drop from window | 5×5 lattice, 1 dot outside right edge | still → dot exits and fades → empty slot outlined |
| Retrieve | just-in-time load | 1 hollow pointer dot + scan line | hollow → `scan` hits it → 3×3 filled |
| Notes | memory outside window | 3 dot rows in a dashed page with folded corner | blank → rows write left→right → page closed |
| Subagent | delegate | parent r=3 orb + 2 child r=1 orbs | still → `bud` + `orbit` → children `merge` as 1 dot each |
| Gate | permission / hook | ring with 1 notch; 1 dot waiting at the notch | waiting (blink) → `route` → pass (through) or deny (hollow bounce) |
| Eval | test trial | 5×5 lattice in bands | still → `scramble` → `solve` clicks back aligned |

Tool / Resource / Prompt form one family that shares the MCP chapter's primitive shapes. Icons sit in `aria-hidden` wrappers next to a visible text label; standalone use needs `aria-label`.

## 7. Reduced motion + accessibility (content parity)
1. `prefers-reduced-motion`: no scrub, no pin. Each chapter renders a static key frame (canvas painted once) + a visible numbered step list. Interactions still work; state changes jump-cut.
2. No JS: each chapter is a `<figure>` with a static SVG fallback + `<figcaption>` holding the same idea line and steps.
3. Every control is a real `<button>` / `<input type=range>`, 44px targets. Drag has a button twin. Gate approval works with Enter/Esc. Live readouts (`turn`, `% full`, pass@k) sit in `aria-live="polite"` and update on change only, not every frame.
4. Each canvas has `role="img"` and a state-specific label, e.g. "Context window 95% full; 2 pinned rows".

## 8. Risks
1. **Accuracy drift:** MCP changed in spec `2026-07-28` (stateless, `server/discover`, sampling deprecated). Pin the spec version in a footnote and re-check before launch.
2. **Metaphor read as fact:** dimming (rot), dot = token, the registry belt. Mitigate with the "illustrative" label and a 1-line "how to read the dots" key in Ch1.
3. **Length:** 8 pinned chapters ≈ 1,300-1,700vh. Cut path: merge Ch4 into Ch5, and Ch7 into Ch6 → 6 chapters.
4. **Idle cost vs "live system":** ambient motion must stop (§4.4). Gate: 0 rAF at rest, measured.
5. **Content gap:** Notion has no MCP, harness or curriculum material (`notion-directives.md`). The story teaches concepts. It must not claim DIGITAL built or teaches them until the Head Designer confirms.
6. **Library edge:** what `ThinkingOrb` paints under reduced motion for a custom `frame` (which `t`?) is unverified. Test it before relying on it for icons.

## Sources
S1 modelcontextprotocol.io/docs/learn/architecture (spec 2026-07-28) · S2 anthropic.com/news/model-context-protocol (2024-11-25) · S3 anthropic.com/engineering/effective-context-engineering-for-ai-agents · S4 anthropic.com/engineering/building-effective-agents · S5 code.claude.com/docs/en/agent-sdk/agent-loop · S6 code.claude.com/docs/en/agent-sdk/overview · S7 anthropic.com/engineering/effective-harnesses-for-long-running-agents · S8 claude.com/blog/building-agents-with-the-claude-agent-sdk · S9 anthropic.com/engineering/demystifying-evals-for-ai-agents (2026-01-09) · Visual: ciechanow.ski/mechanical-watch, ciechanow.ski/gps, distill.pub/2016/augmented-rnns, poloclub.github.io/transformer-explainer, linear.app/agents, cursor.com, langchain.com/langgraph, stripe.com, ai-sdk.dev. Library: `node_modules/thinking-orbs/dist/{types,engine/core,engine/registry}.d.ts` v0.3.2. Capture script: `design-lab/scripts/r2-agentic-shoot.mjs`.
