# Round 2 plan: one system, four pages

Status: **approved 2026-10-02**: two worlds side by side (Signal Capture + Apple page played straight), BRAIN builds 8 chapters (cut to 6 if over ~1,300 vh), fonts re-explored from SaaS/FAANG systems, cinematics made in code by Opus agents (no Higgsfield).
Inputs: `PRODUCT.md`; `design-lab/round2/research/{apple-playbook,google-approaches,signature-systems,agentic-storytelling,kb-smartphone,notion-directives}.md`.

## 1. Job, audience, outcome

| | |
|---|---|
| Pages | **Home**, **SIDEKICK** (formerly the Modular Smartphone), **SHADES** (formerly Smart Reading), **BRAIN** (agentic AI) |
| Audience | Prospective members and sponsors/recruiters/faculty, weighted equally. Home recruits; project pages prove credibility |
| Success | A visitor knows within one viewport what DIGITAL builds and which part could be theirs, then reaches build night or "back a build" |
| Mode | Persuade (Home) / Experience (project pages): the artifact leads, the interface recedes |
| Kept from round 1 | C's dot-orb 4-stage strip, and E's exploded isometric phone with a locked list. Nothing else carries over |

## 2. Visual world (decided on the choice page)

**Default if you keep the roll: "Signal Capture".** The site reads as a live oscilloscope capture:
- near-black graticule ground, phosphor-bone dots and traces;
- scroll is the timebase;
- each initiative is a channel you can probe (CH1 SIDEKICK, CH2 SHADES, CH3 BRAIN);
- red `#d8412f` is the single trigger marker (here / now / open seat), never a dot colour.

Raises it took from the declined challengers:
- State is carried by line form, not colour: solid = live, dashed = pending, half-height = stale, struck = paused.
- One vertical timebase rules every line of copy.
- Each initiative has a portable channel mark that carries through nav, transitions and footer.
- Each project page holds one object for its whole length.
- All pages share one ground, and each channel has its own signal behaviour.

Alternates on the page: Exploded Assembly (my pick, closest to round-1 E), Event Display (competitive), and the Apple-page canon.

## 3. Shared system (built first, used by every page)

| Piece | Spec |
|---|---|
| **Dot engine** | Our own, about 250 lines. One pure `frame(t, state) → dots` function shared by SVG icons and a 2D canvas stage. No WebGL (≤1,200 dots). **Acceptance gate: 0 rAF at rest**; the canvas sleeps when settled, offscreen or paused. Each verb has a deterministic rest pose, used for SSR, reduced motion and the no-JS view. thinking-orbs is a reference only (its paused frame is random and it runs one rAF loop per orb) |
| **Motion verbs** | Build states: form, orbit, scramble→solve, wire, explode, pulse, fixate, seat, hold, settle. Agentic states: emit/absorb, fill, pin, evict, compress, bud/merge, route(gate), halt, tether. **At most 1 moving glyph per viewport** |
| **Custom icons** | About 20 glyphs on a 24-unit grid (1-unit non-scaling stroke, 2-unit dot pitch, at most 1 red anchor dot). Each has idle → working → done states, driven from one source per icon via a `data-state` axis (the Material Symbols idea). Sets: build (slab, stack, seat, handoff, gate, wire, form, orbit, swap, trace, lens, night) plus agentic (loop, tool, MCP port, context, compact, harness gate, subagent, eval) |
| **Motion tokens** | UI state 240–320 ms `cubic-bezier(0.4,0,0.6,1)` (Apple). Reveal: 30 px translate + fade, scroll-linked. Interactive springs: Material 3 spatial (damping 0.8 / stiffness 380) and effects (1.0 / 800). Scroll: CSS `animation-timeline: view()` with a JS `--p` fallback, or a paused GSAP timeline driven by native scroll. No ScrollTrigger rAF loop |
| **Copy budget** (Apple, measured) | Headline median 5 words, cap 8. Eyebrow 1–3 words. One lead sentence ≤25 words. Captions 9–19 words. ≥45% of viewports carry ≤12 words, and every quiet viewport shows an artifact (never empty). About 30 words average per viewport, 100 cap |
| **Layout** | Sticky local nav (52 px) with one filled CTA. Pins of 1–4 viewport heights. One scrubbed asset per page; everything else plays once on entry. A horizontal highlights strip carries breadth. Pages end on a light "join" chapter |
| **Type** | Not SF Pro (license forbids web use). Wave 0 runs a type trial for the chosen world. Candidates: the team-liked Clash Display / General Sans / Martian Mono trio vs a neo-grotesk with one display cut. Fontshare faces need your DESIGN.md §8 exception |
| **Accessibility** | Reduced motion is a designed state: pins collapse to stacked stills, nothing autoplays, full content parity. Content is visible without JS. 44 px targets. Every demo is keyboard-operable |

## 4. Pages and their spins

| Page | Spin (the one thing only it does) | Real content | Must not claim |
|---|---|---|---|
| **Home** | The live orb hero cycles Plan → Prototype → Test → Integrate as you scroll. The upgraded 4-stage strip has the "1 owner / 1 review / 1 gate / 1 repair plan" counters. Three channel tiles (SIDEKICK / SHADES / BRAIN), each with its signature micro-motion. Join on Thursday | Thesis, ownership model, 3 initiatives, build night | Member counts, sponsors |
| **SIDEKICK** | E's teardown band, rebuilt. The exploded stack is drawn from the **real KiCad board geometry** (parsed from `.kicad_pcb`: power carrier 49×41 mm, sensor board, FPC2532AP fingerprint board 22.8×26.1 mm). Signature beat: a module swaps out of the stack | Zynq-7000 SoM, KiCad 9, 3 two-layer boards, design paused mid-way (all `[confirm]`) | Fabricated or tested hardware; ESP32, Wi-Fi 6, Android |
| **SHADES** | Exploded along the **light path**: text → RSVP timing (FPGA) → control → display → optics → the reader's eye. Signature beat: `fixate`, a live RSVP word landing at the fixation point. The page itself models dyslexia-friendly reading | RSVP method, FPGA roadmap phases, engineering + medical-research tracks, mentor (all `[confirm]`) | Any medical or efficacy claim |
| **BRAIN** | "A model predicts. A system gets work done." A 560 px live orb hero, then 6–8 chapters: agent loop, tool use, MCP (ports; local tether vs remote wire), context window (fixed lattice that must evict), context engineering, harness (gates and permission modes), subagents (budding orbs), evals (scramble → clicks back). Interactions: drag a doc into a full context window; approve/deny a tool call at the gate; toggle MCP servers | Concept story only, with the MCP spec version pinned and metaphors labelled "illustrative". BRAIN facts from Notion `[confirm]` | That DIGITAL teaches or has built these; any curriculum |

## 4b. Approved changes (2026-10-02)

- **Two worlds, each page built in both:** `/design-lab/r2/signal/*` (Signal Capture, seed `0a795440`) and `/design-lab/r2/apple/*` (Apple product page played straight; craft bar = the measured iPhone/AirPods/MacBook pages in `apple-playbook.md`). Content, dot engine, icons and board geometry are shared; layout, tokens and type differ.
- **Cinematics in code:** a CINE agent (Opus) renders procedural clips with Remotion (the round-1 reel pipeline). Clips include the SIDEKICK board explode from real KiCad geometry, the SHADES light path, the BRAIN orb and per-page hero loops. Output is mp4/webm + posters. The Apple world plays them once on entry and scrubs one per page; Signal Capture may use them sparingly.
- **Fonts:** the TYPE agent catalogues typefaces from SaaS/FAANG design systems, checks each licence for web self-hosting, renders a trial with real copy, and recommends one stack per world.

## 5. Waves (all in the lab worktree; production untouched)

| Wave | Agents (parallel) | Output | Gate |
|---|---|---|---|
| **W0 Foundation** | SYS (dot engine + icons + motion tokens + 2 theme token sets); BOARD (KiCad `.kicad_pcb` parser → SVG layer geometry for the 3 boards); TYPE (SaaS/FAANG font exploration + trial) | `app/design-lab/r2/_system/`, `/design-lab/r2/system` specimen page, `round2/assets/boards/*.json` | Specimen renders; 0 rAF at rest verified; icons in 3 states at 16/24/64 |
| **W1 Pages + cinematics** | HOME, SIDEKICK, SHADES, BRAIN (each builds both worlds); CINE (Remotion clips per a manifest set in W0) | `/design-lab/r2/{signal,apple}/{home,sidekick,shades,brain}` + direction contract per page; `public/design-lab/r2/cine/*` | 0 console errors at 390/834/1440; copy budget measured; reduced-motion + no-JS parity |
| **W2 Critique** | impeccable `critique` + `audit` per page (4); Gemini motion critique cross-checked with frames; one cross-page consistency reviewer | `round2/critiques/*` | Every page has its bundle |
| **W3 Refine + finish** | One refine pass per page; `impeccable-finish-reviewer` per page; documenter writes the lab DESIGN.md for the chosen world | v2 renders, verdicts, `round2/DESIGN.md` | Reviewer disposition = ship or fix-resolved |
| **W4 Present** | Gallery update | `/design-lab/r2/compare` + report | Then STOP for your review |

About 15 agent runs, wall-clock similar to round 1. Commits `#0059`–`#0063`, each logged in TODO.md.

## 6. Open decisions (none block W0 except the world)

1. **World**: pick on the choice page (default: Signal Capture).
2. **BRAIN length**: full 8 chapters, or the 6-chapter cut (merges context window into context engineering, and subagents into harness)? Default: build 8, measure, cut if it exceeds about 1,300 vh.
3. **Fontshare exception** for the team-liked Clash/General Sans trio (DESIGN.md §8), or OFL-only.
4. **Club confirmations** (before production, not for the lab): SIDEKICK "legacy"/paused status, SHADES phase, whether BRAIN may say it teaches MCP etc.
