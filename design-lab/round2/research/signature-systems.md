# R2 — Signature systems (research, not built)

Verdict: the two liked pieces share one grammar — **a small, quiet, line/dot object that changes state only when the reader is on it, next to a dense numbered list that says what that state means.** Round 2 should generalise that grammar into four systems (§5) and drop the per-page palettes and ambient loops.

Evidence: `design-lab/round2/references/signature/` (videos `c-build-stages-{1440,390}.webm`, `e-dg001-sequence-{1440,390}.webm`; state shots `c-*`, `e-*`; `metrics.json`) and `…/signature/prod/` (production frames `phone-*`, `glasses-*`, full-page shots, `prod-metrics.json`). Scripts: `design-lab/scripts/r2-sig-record.mjs`, `r2-sig-prod.mjs`, `r2-sig-rafsrc.mjs`.

---

## 1. Concept C — 4-stage workflow strip (`app/design-lab/c/BuildStages.tsx`, `c.module.css:1161-1235`)

| Attribute | As built |
|---|---|
| Composition | 4-col grid, 0 gap, hairline `#2a2925` borders, tiles min-h 240px, pad 24. Orb 64px top-left, 20px gap, then `STAGE 0n` / name / one line. Below: 4 "1" rules on the same 4 columns, so the rules read as the tiles' footnotes. 390: 2×2 tiles, rules 1-col. |
| Contrast | bg `#0c0c0b`, ink `#ece8de` (name), `#a39e92` (line), `#8a857b` (stage no.). Orbs monochrome in ink colour. Only colour on screen: red eyebrow + 2px red top line on the pinned tile. |
| Line / dot | Hairlines 1px. Orb dots 0.6-1.4px with depth shading (near = bright, far = dim): the only "3D" on the section is made of dots, not gradients. |
| Type | Clash Display 600 30px (names) / 56px (the "1"); General Sans 15-17px (lines); Martian Mono 12px, wdth 87.5, +0.04em caps (stage no.). Three voices, three jobs: label, name, meaning. |
| Motion | Orbs frozen until hover/focus/press (`paused={on !== i}`); one orb moves at a time. Tile bg 120ms. No scroll-linked motion. Reduced motion: static frame. |
| Red means | "You are here / this is the one you picked" — never decoration. |
| Words / viewport | 1440: **87** (incl. ~6 nav). 390: **63** (tiles), **69** (rules). |

Why it works:
1. **Verb → picture → sentence.** Each orb state is a literal metaphor for the stage (form / orbit / scramble / wire) and the one-liner names the metaphor, so the animation is legible, not ornamental.
2. **Restraint makes the motion an event.** 4 objects, 1 moving, 0 ambient; the big "1"s are the loudest marks and they are static numbers, so the section reads as a rule-set with a pulse.
3. **The grid is the process.** Equal columns + shared borders = "same four stages for every subsystem" said by layout before copy.

Flaws to fix: rest frame is non-deterministic (paused orb paints `performance.now()` — Plan shows a triangle at 1440, a circle at 390); hover-only reveal is invisible on touch until tapped; orb library reads "AI is thinking" by origin (its states are named searching/listening/composing).

## 2. Concept E — DG-001 scroll story (`app/design-lab/e/components/PhoneSequence.tsx`, `PhoneSchematic.tsx`, `e.module.css:441-510`)

| Attribute | As built |
|---|---|
| Composition | Dark band inside a light page. ≥960px: 2 cols; left sticky (`top 64`, `100vh-64`) SVG of 7 iso slabs (150×300 units, `matrix(.866 .5 -.866 .5)`, gap 26→66); right 7 entries `min-h 34vh`, 2px rail. <960: diagram on top, entries as a static list, labels become numbers at 30px. |
| Contrast | `#111311` bg, `#f1f1ec` ink, `#a3a69c` muted (7.5:1). Inactive slabs opacity 0.3; active 1.0. Labels never fade (contrast kept). |
| Line / dot | 1px `non-scaling-stroke` everywhere; inner detail at 0.4-0.7 opacity. Dash pattern encodes layer kind: solid = part, `5 4` = boundary (Systems Arch), `2 5` = firmware ring, `1 6` = test perimeter. Leaders dotted `2 3` → solid when active. Red dot r 3.5 at each leader end. Dashed 22px circle = "Unassigned" seat. |
| Type | Cabinet Grotesk 700 22px (entry name); Satoshi 15px (line, kv values); JetBrains Mono 12-16px caps +0.06em (numbers, SCOPE/RISK/OWNER, SVG labels). |
| Motion | Paused GSAP timeline scrubbed from native `scroll` (Lenis-smoothed wheel); 1 rAF per scroll frame, **0 at rest**; reading line 65% vh; the stack opens one gap per entry, so the explode **is** the progress bar. Opacity 240ms `cubic-bezier(.2,0,0,1)`. Off <960 or reduced motion (fully exploded static). |
| Red means | Anchors (where a label attaches to the object) + the active entry bar (4px). Rail fill is ink, not red. |
| Words / viewport | 1440: **101-103**. 390: **71-106**. Densest liked piece, still calm because 6 of 7 entries are muted. |

Why it works:
1. **Two views of one fact, locked together.** Object (left) and ledger (right) share numbering 01-07, leader dots, and active state; scrolling is literally walking down the stack.
2. **Honest diagram language.** Iso line art says "schematic, not render" — it fits a club with no hardware revision yet, and `Owner: Unassigned` turns the gap into an invitation.
3. **Engineered calm.** 0 rAF at rest, static SSR fallback, no reflow on enhance; dense data without motion noise.

Flaws to fix: at entry 06 the 06/07 labels sit 20px apart (gap below the active slab is still closed); <960 the diagram scrolls away, so mobile loses the lock between object and list.

## 3. Production project pages — current spins

| | `/projects/modular-smartphone` | `/projects/smart-reading` |
|---|---|---|
| Spin | Engineering bench: 7-beat loader, then a 7×100svh pinned "teardown" (anime.js scroll sync), front-on wireframe phone with 14 floating part "stickers", per-subsystem accent (7 colours) + indigo CTA. | Putting the glasses on: 460vh sticky track, paper → dusk → charcoal bg, R3F stock sunglasses model, blur→clear book POV with phosphor HUD flashing RSVP words, 4 snapped panels. |
| Works | Subsystem = section = schematic part is a real mapping; spec card (scope/risk) is the seed of E's kv rows; loader beats match the 7 subsystems. | The POV beat (frame `glasses-1440-f04-47.png`) is the best idea on either page: you *see* RSVP from inside the lens. Paper→dark arc is a clear story. |
| Fails | 7 accents + indigo vs the single red system; the "explode" is parts drifting, not layers opening (no depth order); 100svh per beat leaves 37-56 words on screens that are mostly empty; mobile drops to static cards. | 8-16 words/viewport for 30% of the scroll (dead transition beats); stock fashion sunglasses read as eyewear ad, not engineering; sticker decor (sparkle, leaf) overlaps the eyebrow at 1440 and the headline at 390; 390 pill nav overflows (logo clipped); 3D frame covers body copy at 390. |
| Type / palette | Archivo / Hanken / DM Mono; navy `#0F172A` + indigo `#818CF8` + 7 accents. | Same trio; paper `#e9dfc8`, gold `#e3b341`, phosphor green; red only on CTA hover. |
| rAF at rest | **~200/s** (ScrollTrigger `_rafBugFix` 60 + anime engine 60 + CursorProvider 60 + gsap ticker 17). | 4 permanent loops (CursorProvider, framer batcher, Lenis, R3F) — 5/s each here only because SwiftShader throttles; ~240/s on real GPUs. |

Note: production `components/ui/CursorProvider.tsx:76` runs a 60/s rAF on every route, including C and E (it is the only rAF at rest on both).

## 4. Engines

**thinking-orbs 0.3.2** — MIT (© 2026 Jakub Antalik): copy, modify, derive allowed with notice. ~15 KB gz (index 7.7 + core 7.1). Plain 2D canvas arcs; DPR capped at 2; per-state presets at 64 / 20 px. Measured dots per frame at 64px: shaping 24, connecting 48 + 86 lines, solving 138, searching 204, breathing 484, working 516, composing 566 (20px: 9-208). One rAF loop **per instance** while unpaused (60/s each); paused / offscreen (IntersectionObserver) / hidden tab = 0. Rest frame = whatever `performance.now()` gives (non-deterministic). Escape hatches: `opts` (raw knobs, e.g. `shape` 0/1/2 holds circle/triangle/square), `frame` (supply our own `(size,t,opts) → {dots,lines}`; library keeps painter, theme, pause, IO, reduced motion), exported helpers (`makeProj`, `fibDir`, `vnoise`, `finalizeFrame`).

**E sequence** — gsap timeline `paused:true` + `tl.progress(p)` from scroll; `gsap.ticker.sleep()` after build; 0 rAF at rest, ~1 per scroll frame (measured 217/s total during a wheel burst incl. Lenis + cursor). No ScrollTrigger (its `_rafBugFix` is what keeps the phone page at 60/s forever).

Recommendation: **(b) write our own small dot engine; use thinking-orbs only as a prototyping reference.** Reasons:
1. The icon family (§5b) must exist as **static SVG** (SSR, no-JS, 16-24px inline, print); one geometry source should feed both SVG rest poses and canvas motion. thinking-orbs is canvas-only.
2. We need deterministic rest/done poses and a **single shared ticker** for all glyphs on a page (max one moving), not one loop per instance.
3. Our verbs (explode, fixate, seat, pulse) are not in its nine; via `frame` we would be writing the geometry anyway, while paying for 9 unused modes.
4. Brand: its states are named and tuned as AI-thinking loaders; our dots should mean build states.
Scope estimate: ~250 lines (projector + 8 verb functions + painter + shared ticker + IO pause) + glyph data. Derive math (Fibonacci sphere, value noise, z-sort) under MIT with attribution in a file header. Pattern E's scroll engine as is (paused timeline or plain lerp, no ScrollTrigger).

## 5. Proposed signature systems (DO NOT BUILD — for round-2 concepts)

### 5a. Dot STATE language — motion grammar

Rules: monochrome ink dots + hairlines; red is never a dot colour except the single **anchor dot** (here / now / open). Max 1 animating glyph per viewport. Motion only on hover, focus, press, or when its row is the active scroll entry; never ambient. Every verb has a deterministic **rest pose** (t = rest) used for SSR, reduced motion, and paused. Cycle 2.4-3.2 s; state change 240 ms `cubic-bezier(.2,0,0,1)`; snap 120 ms.

| Verb | Dots do | Real project state | Rest pose |
|---|---|---|---|
| form | dotted outline settles circle → target shape | Concept / planning | target shape, dotted |
| orbit | parts circle on tilted orbits | Prototyping, in progress | 3 parts parked on orbits |
| scramble | bands shuffle, then click into rows | Testing / verification | aligned rows |
| wire | nodes connect into one graph | Integration | connected graph |
| explode | layers separate along one axis | Teardown / scope reveal | fully exploded |
| pulse | one packet runs a leader A → B | Handoff / review path | packet at B |
| fixate | scattered dots converge to one point | Focus / reading (RSVP) | single point + reticle |
| seat | ring of n dots, one slot dashed | Recruiting / open role | dashed slot visible |
| hold | dots drift in place, no progress | Blocked / needs owner | dots at 40% ink |
| settle | everything stops, outline goes solid | Done / shipped | solid closed form |

### 5b. Custom icon family — "dot-matrix + isometric line"

Grid 24×24 units (live area 20, 2-unit padding). Dot lattice pitch 2 units; dot r 0.75 (idle), 1.0 (node), anchor dot r 1.5 red, max 1 per glyph. Stroke 1 unit, `vector-effect: non-scaling-stroke` (stays 1px at 16/24/64). Iso axes 30° (`matrix(.866 .5 -.866 .5)`, same as E). Dash code from E: solid = exists/owned, `1 2` dotted = planned / not built, `2 3` = leader/reference, `5 4` = boundary/interface. Sizes: 16 (inline), 24 (UI), 64 (tile, animated). State axis per glyph: **idle** (dotted outline, 60% ink, rest pose) → **working** (verb animates, 100% ink) → **done** (settle: solid stroke, filled centre node; never red).

| # | Glyph | Meaning | Construction (idle → done) |
|---|---|---|---|
| 1 | Slab | One subsystem / layer | iso rhombus slab, 1u stroke; dotted → solid |
| 2 | Stack | Whole build (N layers) | 3 iso slabs, 3u gaps; explode opens gaps to 6u |
| 3 | Seat | Owner / open role | 9u circle, `2 2` dash + red anchor → solid ring with initials |
| 4 | Handoff | Review path | 2 nodes + `2 3` leader; pulse packet travels; done = solid leader |
| 5 | Gate | Test gate before merge | 2 posts + 4×3 dot block between; scramble → rows aligned |
| 6 | Wire | Integrate | 5 nodes on a ring; wire draws edges → closed graph |
| 7 | Form | Plan | 12-dot circle morphing to triangle/square; done = solid square |
| 8 | Orbit | Prototype | 2 tilted ellipses, 3 parts; done = parts parked on one orbit |
| 9 | Swap | Repair plan / replaceable part | iso slab with an inner module slid out 4u; done = slotted back |
| 10 | Trace | Signal / PCB / data path | orthogonal 1u trace, 3 via dots; pulse runs; done = solid trace |
| 11 | Lens | Optical path (Smart Reading) | iso ellipse + 5-dot ray converging to a fixation point; fixate |
| 12 | Night | Build night / meeting | 7-dot ring (seats), filled = attending, one dashed = open |

### 5c. Exploded-object storytelling pattern ("Teardown band")

One reusable band per project page, built from E: dark band; sticky object left (iso line drawing, N layers in a stated order, numbered dotted leaders, red anchor dots); right column N entries (number, name, one line, `SCOPE / RISK / OWNER`, state glyph from 5b); 2px rail; scroll opens one gap per entry (explode = progress); 0 rAF at rest; static fully-exploded SSR. Fixes from §2: keep a minimum label gap (≥28u) when collapsed; on <960 pin a compact object strip (64-96px tall) above the list so mobile keeps the lock between object and entry.

Data contract per layer: `{ id, n, label, draw, axisOffset, scope, risk, owner?, state: idle|working|done, verb }`.

Per project the **axis of explosion** is the story:
- **Phone (DG-001)** — Z axis, 7 physical/logical layers top → back (Apps/UX … Mechanical/CAD), as E.
- **Smart Reading (DG-002)** — the **optical path**, exploded along the light ray, not depth: text source → RSVP timing (FPGA/Verilog) → embedded control (Embedded C) → display → optics → the eye's fixation point. The final "layer" is the reader: the `fixate` verb lands one word at the fixation point (reuses the POV beat that works today). Label it "diagram, not a render" like E; do not name components (waveguide, panel type) until the club confirms them — data only says FPGA, RSVP, Optics, Verilog, Embedded C.
- **Future projects** — choose one axis (depth, signal path, assembly order, time) and state it in the band head line.

### 5d. Per-project spin rules — shared vs unique

| Shared on every project page (system) | Unique per project (the spin) |
|---|---|
| Single red `#d8412f` = anchor / active / open seat only; no per-project accent palettes | The axis of explosion (5c) and its object drawing |
| Type trio from the chosen round-2 direction (one display, one text, one mono) on all project pages | One **signature beat** that only that project can do (phone: modules swap out of the stack with `swap`; glasses: the POV `fixate` beat with live RSVP) |
| Teardown band anatomy, kv rows `SCOPE / RISK / OWNER`, `Unassigned` seat | The glyph subset that leads (phone: slab/stack/swap; glasses: lens/fixate/trace) |
| 4-stage strip (Plan / Prototype / Test / Integrate) with the dot verbs + the "1" rules | Surface tone of the band (both dark; paper vs ink outside it is allowed if it serves the story) |
| Motion budget: 0 rAF at rest, ≤1 moving glyph/viewport, scroll-scrubbed not time-looped, reduced-motion rest poses | The single "hero object" medium: line SVG by default; 3D only if it shows something line art cannot (e.g. light through the lens), never a stock model |
| Density floor: ≥40 words in every resting viewport of the story (no 8-word transition beats) | Copy voice of the one-liners (per BRAND.md) |

## 6. Risks

1. **Over-generalising**: 10 verbs + 12 glyphs can turn into decoration everywhere. Gate: a glyph appears only beside a real state value from `lib/data/`.
2. **Honesty**: state glyphs imply progress the club has not recorded (most fields are "No signal" / Unassigned). Default state must be `idle`; `done` only with a source.
3. **Mobile**: both liked pieces are desktop-first (C hover, E ≥960 only). Round 2 must design the 390 version first.
4. **Engine cost**: own engine = ~250 lines to maintain; mitigate with one geometry file shared by SVG and canvas.
5. **Governance**: production pages are governed by `smartphone.DESIGN.md` / `glasses.DESIGN.md`; replacing their palettes and media needs Head Designer sign-off.

Next action: show the team `c-1440-05-pinned-stage2.png`, `e-1440-03-scrub.png` and `prod/glasses-1440-f04-47.png` side by side and confirm the §5d shared/unique split before any concept work.
