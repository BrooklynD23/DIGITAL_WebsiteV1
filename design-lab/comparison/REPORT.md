# Design Exploration Ready

DIGITAL @ Cal Poly Pomona · design lab · 2026-10-02 · branch `design-lab/exploration` (worktree
`/home/danny/worktrees/digital-design-lab`) · commits `#0054`–`#0058`. Production checkout untouched.

**Open the gallery:** `bash design-lab/scripts/ensure-server.sh`, then http://localhost:3100/design-lab
(component grid: http://localhost:3100/design-lab/components). No winner is declared (§46).

---

## Environment

| Area | Status |
|---|---|
| Stack | Next.js 14 App Router, React 18, TS strict, Tailwind 3; lab routes under `app/design-lab/*` |
| Installed for the lab (worktree `package.json` only) | `motion` 13.4.6, `cobe` 2.0.1, `roughjs` 4.6.6, `recharts` 3.10.1, `@dnd-kit/core` 6.3.1 (+ sortable, utilities), `@phosphor-icons/react` 2.1.10, `@tabler/icons-react` 3.48.0, `thinking-orbs` 0.3.2, `page-mascot` 0.1.0, `playwright` 1.63.0 (dev) |
| Already present | `three` 0.169, `@react-three/fiber` 8, `drei` 9, `gsap` 3.13, `lenis` 1.3, `framer-motion` 11, `lucide-react`, `axe-core` |
| Separate packages | Remotion 4.0.532 at `design-lab/motion-reel/` |
| Skills | `web-design-guidelines`, `impeccable`, Taste v1 (global) + **Taste v2 installed worktree-local**, `page-mascot` skill (worktree-local) |
| External model | Gemini API (key in worktree `.env.local` only): video/motion critique, visual critique, 4 placeholder images (cap 8) |
| MCP | Stitch: used by A (partially; timeouts). chrome-devtools: **broken all session ("Target closed")**, so every agent used Playwright headless Chromium instead |
| Lab tooling | `shoot.mjs` (3-viewport capture; fixed this run for smooth-scroll, delayed reveals, and an ~8k px headless capture limit via chunk stitching), `gemini.mjs`, `ensure-server.sh`, ffmpeg |
| Not used (user decision) | Higgsfield, Blender / Blender MCP, 21st.dev |

Full table with sources: `design-lab/tooling-audit.md`.

## Existing Site

Short version of `design-lab/audit.md` (production code, not changed by this run):

1. **Production bug:** `/about`, `/get-involved`, `/projects`, `/community` render blank to real users. They use `<Reveal>`, but nothing on those routes calls `useReveal()`, so 57 content blocks stay at `opacity:0`.
2. **Fonts:** both project pages never load their fonts (`tailwind.config.ts:54-56` maps to literal family names instead of the next/font variables).
3. **Accent contrast:** `#d8412f` fails WCAG AA as text on paper (~4.1:1) and under white text (4.45:1). Concepts used `#a8321f`–`#c63a28` for text/fills.
4. **Cursor:** `components/ui/CursorProvider.tsx` runs a 60 fps animation loop even when the pointer is still.
5. **Drift:** code is behind `DESIGN.md` (gold accent, "engineering club" copy in 5 places, an indigo/purple smartphone palette; R1–R6 pending). `DESIGN.md` §8 names Source Serif 4, but `lib/fonts.ts` loads Newsreader.
6. **Content is thin and partly contradictory:**
   - 2 real projects, 0 named members (1 named mentor), 0 photos of real work, 0 verified stats or partners.
   - 7 contradictions (C1–C7 in `research/content-inventory.md`), e.g. 25+ vs 40+ vs 120+ members, ESP32 vs "custom Android kernels". Every concept marks these `[confirm]` instead of choosing.
7. **Strengths worth keeping:** the thesis, the 7-subsystem ownership model (`phoneV2.ts:140-300`), the RSVP idea, and the paper/ink + single-red system.

IA proposal (`research/ia-proposal.md`): 5 surfaces (Home · Work · Studio · Join · Contact) and no PROOF section until a real fact exists.

---

## Concept A — "The Signed Edition" (Editorial / Studio) · `/design-lab/a`
**Thesis:** DIGITAL publishes its work as a printed edition, and every story in it ends on a signature line that is still blank.
**Key visual characteristics:**
- Design-annual structure: cover, contents, features, rules spread, staff box, colophon.
- Type is Zodiak (high-contrast serif) / Switzer / JetBrains Mono on warm paper, with one red signature rule.
- Fig. drawings of the real subsystems.
- v2 adds a phone "poster" cover (one word per line) and a faint drafting grid on records.

**Interesting interaction:** the working RSVP plate (Fig. 3), which streams the real Smart Reading sentence at 200/300/450 wpm. Also a masked line-by-line thesis reveal adapted from fancycomponents (works without JS).
**Tradeoffs:**
- Fontshare fonts need a `DESIGN.md` §8 exception or an OFL swap.
- The page is long.
- Stitch generated people and specs that were fabricated; they were rejected.

## Concept B — Engineering / System (no working title in its doc) · `/design-lab/b`
**Thesis:** the homepage is the build's documentation set; every drawing on it is computed from the club's own project records.
**Key visual characteristics:**
- Type is the IBM Plex superfamily (condensed caps display), with 0 radius and no shadows.
- Red means exactly one thing: "this needs a person".
- Fig. 1 is an interface map generated from `phoneV2.ts`. v2 draws unowned subsystems dashed red ("0 of 7 owned").
- A status-filterable project ledger.
- A drawing title block as the footer.
- v2 adds Fig. 4, a build × discipline matrix. Its inferred cells are `[confirm]`.

**Interesting interaction:** the "how a build runs" tracer. Pick a subsystem and follow it through owner → review → test gate. Also the RSVP timing figure, which plays the real 133.3 ms slot once and offers "Run again".
**Tradeoffs:**
- Dense; it can feel heavy to non-engineers.
- The mobile page is still about 11.8k px long.
- Recharts was deliberately not used: there is no real quantitative series.

## Concept C — "Formation" (Creative Technology) · `/design-lab/c`
**Thesis:** the page draws itself from the work; every moving point is computed from a real build.
**Key visual characteristics:**
- Graphite and bone with one lifted red (`#f0573a`).
- Type is Clash Display / General Sans / Martian Mono.
- One 4,900-point WebGL field (R3F v8 + hand-written GLSL) with three forms: DG-001 as 7 stacked subsystem layers, DG-002 as glasses with a live RSVP lens, and DG-003 as a blank line.
- Records say "No signal" instead of guessing.

**Interesting interaction:**
- Type your name and the particles spell it; v2's footer redraws it in dots.
- Thinking-orbs map the 4 real workflow stages.
- Still mode is a server-rendered SVG dot poster that works without JS, WebGL or motion.

**Tradeoffs:**
- WebGL cost on low-end devices (gated, lazy, pauses offscreen; bundle size not yet measured).
- The phone stack is a diagram, not the real device.
- The mobile page is about 9.5k px.

## Concept D — "Pull up a chair" (Human / Community) · `/design-lab/d`
**Thesis:** DIGITAL is the room where you stop being "a CS major" and become "the person who owns the boot path"; the page shows that change happening to *you*.
**Key visual characteristics:**
- Warm paper, Fraunces (soft, wonky) / Figtree / Plex Mono.
- A Rough.js pencil layer rendered at build time with fixed seeds, so it shows without JS. v2 projects show their own artifact in pencil: the DG-001 ownership stack, and DG-002 saccades vs one fixed word.
- One clearly labelled `[placeholder]` room photo.

**Interesting interaction:** the seat picker. The 7 subsystems are chairs around a workbench (a CSS-only radio group). In v2 the chosen seat carries through the Join step, the CTA link and the footer, without JS.
**Tradeoffs:**
- The warmth still depends on real build-night photos the club doesn't have yet.
- In v2, 3 of 4 generated images were removed because they could pass as real club work.

## Concept E — "The Ledger" (Startup / Product Studio) · `/design-lab/e`
**Thesis:** DIGITAL earns a startup studio's credibility by publishing its build ledger, with honest status, real ownership and the blanks left visibly blank.
**Key visual characteristics:**
- Cabinet Grotesk / Satoshi / JetBrains Mono, restrained.
- The hero is the ledger itself: 2 active / **0 shipped** / 7 seats.
- One case-study template (§41) for both builds.
- v2 adds typed blank-state chips (Open = an invitation, Pending = an honest gap), a 7-subsystem × 4-gate board (0 of 28 reported), and owner seats written as role specs.

**Interesting interaction:**
- A ledger row morphs into a case-brief dialog (`motion` `layoutId`; focus is trapped and returned).
- A scroll-scrubbed exploded isometric phone (GSAP).
- In v2 the page runs 0 animation frames per second at rest: ScrollTrigger was replaced by a paused timeline driven by native scroll, because ScrollTrigger never lets the page idle.

**Tradeoffs:**
- Credibility without shipped work is a hard sell. E chooses honesty over polish.
- The DG-001 scroll band is tall on desktop.

## Concept F — "The Bench" (Radical) · `/design-lab/f`
**Thesis:** the homepage is a bench you sign, not a brochure you read.
**Key visual characteristics:**
- Bricolage Grotesque (narrow, heavy) / Departure Mono pixel type, with inline Pixelarticons.
- Paper project records on a green cutting mat.
- A red "BUILT BY" name tag inside the headline is the only rounded, red object.
- Binder index tabs as navigation (a bottom bar on mobile).
- The rule is "nothing moves unless you move it".

**Interesting interaction:**
- Type your name into the tag, then drag it onto an unowned part of a real build. Drag uses dnd kit, with keyboard sensor, per-seat buttons and a list view as alternatives.
- A build sheet fills in (BUILT BY / CHECKED BY / RELEASED AT / REPAIR PLAN).
- The closer changes to your Thursday appointment.
- Nothing is sent anywhere.

**Tradeoffs:** typing a name can read as a toy. Whether each seat is actually open needs club `[confirm]`. The mobile page is about 7.7k px.

### Also built
| Artifact | Where | Note |
|---|---|---|
| Motion reel | `design-lab/renders/motion/reel.mp4` (15.5 s, 1080p, 1.3 MB), source in `design-lab/motion-reel/`, doc `concepts/motion-reel.md` | Procedural Remotion reel: one dot → 7 subsystems → ownership trace → RSVP thesis → unsigned line, looping seamlessly. One Gemini-driven revision. Known leftovers: label pile-up at 3.5 s, small overlap at 11.2 s, RSVP word rate 3.75/s (needs a photosensitivity check before site use) |
| Mascot | `/design-lab/mascot`, doc `concepts/mascot.md` | Code-drawn "Module" (DG-001 board body, DG-002 glasses eyes, RSVP mouth) with an on/off toggle; off on touch and under reduced motion. **Agent's own recommendation: no homepage mascot** |
| Type lab | `/design-lab/type-lab`, doc `research/fonts.md` | 11 rendered pairings with real copy; Fontjoy tested and rejected |

---

## Experimental Features Explored

Every §48 item and every resource you listed, with the prototype that uses it.

| Feature / resource | Status | Used in |
|---|---|---|
| Claude Design | VERIFIED, NOT USED (web-only research preview; no CLI/API path in this run) | — |
| Design-system-first workflow | USED | All six: each `concept-<x>.md` §31 spec was written before building |
| Deriving systems from sites | USED | SCOUT-1…4 token extraction (17 sites); W1-SYSTEMS |
| Design-system shortlisting | USED | `research/design-systems-shortlist.md`: IBM Carbon → B, Wired → A, PostHog → D |
| Awesome DESIGN.md | VERIFIED + USED (research) | W1-SYSTEMS read 10 of 73 specs (VoltAgent/awesome-design-md) |
| DESIGN.md-based reproduction/analysis | USED | Shortlist extraction; Stitch screens for A |
| Mixing compatible design systems | USED | Shortlist "compatible mixes"; each concept doc states its sources |
| Fontshare | USED (CDN `<link>`; license forbids self-hosting) | A (Zodiak, Switzer), C (Clash Display, General Sans), E (Cabinet Grotesk, Satoshi) |
| Fontesk | USED | Departure Mono (OFL), self-hosted in F + type lab |
| Fontjoy | VERIFIED, rejected after render (13 generations, all dated Google staples) | Type lab control panel |
| Competitor copy research | USED | `research/copy-analysis.md` (11 orgs, patterns only) → all concepts |
| Superdesign | NOT VERIFIED: needs `superdesign login` with an account. Stitch MCP substituted | A (Stitch: 3 screens; variants timed out) |
| Aria Icons | VERIFIED + USED (CLI via npx; MCP not configured) | W1-SYSTEMS icon sheet (5 families × 16 glyphs) |
| Thinking Orbs | INSTALLED + USED | C (one orb per real workflow stage) |
| Vercel custom shaders / vgpu | NOT COMPATIBLE (WebGPU-only, no fallback): inspiration only | C wrote its own GLSL in WebGL instead |
| Interface-detail refinement | USED | MICRO audit (`critiques/micro-*.md`) + Wave 4 |
| Balanced text wrapping | USED | `text-wrap: balance/pretty` in A, B, C, D, E, F |
| Procedural animation with Claude | USED | Motion reel; C particle field; B/D procedural drawings |
| Remotion + React | INSTALLED + USED | Motion reel |
| Raw HTML5 Canvas | USED indirectly (thinking-orbs renders to canvas); no concept hand-wrote a 2D canvas | C |
| Three.js / R3F | USED | C (R3F v8, custom shader, SVG fallback) |
| Explicit keyframe timelines | USED | Reel (`timing.js`); E (paused GSAP timeline) |
| GSAP ScrollTrigger | USED in E v1, **removed in E v2** (its permanent rAF loop prevents idle); GSAP timeline kept | E |
| Lenis | USED | E (runs only while scrolling; off under reduced motion) |
| Motion (motion.dev) | USED | A, E (`layoutId` shared layout), F |
| Fancy Components | USED (MIT, copied with headers, reduced motion added) | A: Vertical Cut Reveal (as CSS), Text Highlighter, Media Between Text |
| COBE globe | INSTALLED, NOT USED: no real photo locations exist, and the agents refused to invent any | — (C evaluated and skipped it) |
| Rough.js | USED | D (build-time pencil layer) |
| Recharts | INSTALLED, NOT USED: no real quantitative series (§39) | — (B used hand SVG for the real numbers) |
| dnd kit | USED | F (keyboard sensor + button + list alternatives) |
| Lucide | USED | C, E |
| Phosphor / Tabler | USED | A, D (Phosphor); B (Tabler) |
| Headless Chromium rendering | USED | `shoot.mjs` + Playwright checks in every wave |
| FFmpeg composition | USED | Reel encode, frame extraction, stitched captures, gallery previews |
| OpenRouter | NOT USED (not needed; Gemini direct) | — |
| External image/audio generation | Image: USED (Gemini, 4 of 8 budget, all D; 3 removed in v2 as too real). Audio/video gen: NOT USED | D (`[placeholder]` room only) |
| Video-capable model critique | USED (Gemini, cross-checked against extracted frames; it was wrong several times) | C, E, F critiques; motion reel |
| Render → inspect → refine loops | USED | Every agent (≥2 loops) + orchestrator gates |
| Image-gen vs procedural specialization | USED | D v2 moved from generated photos to data-drawn pencil plates |
| Blender MCP | NOT USED (user decision) | — |
| Reference-based procedural 3D reconstruction | NOT USED (needs Blender; user decision) | — |
| Camera/angle/proportion reasoning | USED (R3F only) | C |
| Opus-driven motion/showreel | USED | Motion reel |
| page-mascot | INSTALLED; behavior adapted, package not imported | `/design-lab/mascot` |
| OpenUI (generative UI) | NOT COMPATIBLE (needs a runtime LLM; the site is static export) | — |
| Vercel web-design-guidelines | USED | Critiques of B and E |
| Taste skill | USED (v2) | Critiques of D, F, A (clashes with the BRIEF noted, BRIEF wins) |
| impeccable | USED | MICRO audit |
| Multiple independent prototype agents | USED | DA-A…F, blind to each other |
| Visual review before production | USED | This gallery; no production route changed |
| vgpu / TypeGPU examples | Researched; inspiration only (WebGPU) | — |
| Beautiful UI | VERIFIED, reference only (AI-chat primitives; low fit) | — |
| MotionSites AI | VERIFIED, anti-reference (template heroes §39 bans) | — |
| HealthCentral | NOT SCOUTED: HTTP 403 bot block; not evaded | — |
| Higgsfield, 21st.dev | NOT USED (user decision) | — |

---

## Comparison

- **Gallery:** http://localhost:3100/design-lab — tabs A–F (arrow keys; deep links `#a`…`#f`; all panels readable without JS). Each panel: thesis, desktop + mobile previews, whole-page overview, live type specimen, palette hexes, interactions, distinctive idea, tradeoffs citing their critique. Plus the motion reel, mascot with/without, type lab. Neutral greys + system UI; no ranking.
- **Component grid:** http://localhost:3100/design-lab/components — NAVIGATION / HERO / PROJECT CARD / CTA / TYPOGRAPHY × A–F, crops cut at DOM-measured positions from the v2 renders, each linking to the live block. Interaction is best compared on the prototypes themselves.
- **How to read it and how to ask for hybrids:** `design-lab/comparison/README.md`.
- **Per concept:** `design-lab/concepts/concept-<x>.md` (spec + "## v2 changes"), `design-lab/critiques/` (ring critique, micro, a11y, Gemini motion), `design-lab/renders/<x>/v1|v2/`.

No winner is declared.

## Decisions that are yours (none block the review)

1. **Fontshare:** A, C and E use Fontshare faces via CDN `<link>`, which `DESIGN.md` §8 forbids. Grant an exception, or swap to OFL faces if one of them wins.
2. **Production bug:** 4 production routes render blank (Existing Site #1). Fix now, separately from this exploration?
3. **Club facts:** resolve C1–C7 (member counts, toolchain, current phase), and confirm which seats are actually open. Every concept carries `[confirm]` until then.
4. **Lab plumbing:** adding `/design-lab` to `lib/immersiveRoutes.ts` (and a cursor opt-out) would remove each concept's scoped hide hack and restore header/footer landmarks. It's production code, so I didn't touch it.
5. **Superdesign:** it needs your account login if you want it in a future round.

## Limitations of this run

- The chrome-devtools MCP failed all session. Scouting and checks used Playwright, so motion on external reference sites was judged from static captures.
- The `ref-scout` agent type wasn't loaded in this session. Scouts ran as Sonnet general-purpose agents that loaded its definition; the effort setting can't be passed through the Agent tool.
- The root layout wraps every lab route in production `<main>`, nav, footer and cursor. Concepts hide them with scoped CSS, so their own header/footer lose landmark roles.
- All copy is exploratory. Production copy still goes through brand-voice-strategist → brand-guardian.
