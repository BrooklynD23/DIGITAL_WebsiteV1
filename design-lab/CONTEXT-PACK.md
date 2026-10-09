# CONTEXT-PACK — what every Wave 2+ agent needs

Orchestrator, Gate 1 (2026-10-02). Read this instead of the raw research. Open a source file only when you need detail.
Sources: `audit.md`, `research/{content-inventory,ia-proposal,reference-analysis,copy-analysis,library-fit,design-systems-shortlist,fonts,icons}.md`, `tooling-audit.md`.

## 1. Real content (the only facts you may state)

| Record | Real fields you can use | Do NOT use (UNVERIFIED / MISSING) |
|---|---|---|
| **DG-001 Modular Smartphone** `/projects/modular-smartphone` | Problem: throwaway, unrepairable devices. 7 subsystems w/ descriptions (`phoneV2.ts:140-288`): Systems Architecture · Hardware/PCB · Firmware/Embedded · Operating System · Apps/UX · Mechanical/CAD · Integration/Testing. Workflow plan→prototype→test→integrate (`phoneV2.ts:138`). Ownership model: one owner per subsystem · one review path per handoff · one test gate before merge · one repair plan before release (`phoneV2.ts:295-300`). Status `active`. Procedural `PhoneSchematicSvg` exists | Member counts (25+/40+), "4 core modules", ESP32 spec sheet, "custom Android kernels", "WiFi 6", KiCad vs Altium, "100% open source", phase name (conflict), dates, contributors, repo, photos |
| **DG-002 Smart Reading** `/projects/smart-reading` | FPGA heads-up glasses showing one word at a time where you look; built with dyslexic readers in mind (`projects.ts:65-66`). Problem: saccades, losing your place (`glasses.ts:122-129`). Method RSVP, reader sets WPM (demo 450 wpm). Tech: FPGA, RSVP, Optics, Verilog, Embedded C. Needs: engineering, optics, firmware, design, research. Mentor **Dr. Mohamed El Hadedy** (only real named person). "8-month build cycle". Free to join. Assets: `public/assets/experiments/glasses/BookBG_{Blurry,Clear}.png`, R3F `GlassesModel.tsx` | "5–20% of people" (uncited), phase, dates, contributors, photos |
| **Venture Studies** (program, no page) | "Turn engineering scope into budgets, sponsor briefs, and pitches." Learnings: map scope→budget/sponsorship; defend trade-offs to sponsors | Its stats (5 case studies / 12 briefs / 2 pitch cycles) |
| **Org** | Name DIGITAL @ Cal Poly Pomona; "student-run venture studio"; thesis **"Make something worth putting your name on."**; vision "Real systems, built by students, handed to the next cohort." (verbatim only); build night **Thursdays 6:00 PM · Building 17, Room 1635**; Discord discord.gg/Vsg3qcNVzv; contact@digitalcpp.org; "No project experience required"; 7 leadership seats all open (TBA); 11 involvement paths → one contact form (`/contact?type=…`) | Any stat (120+ members, 15 prototypes, 50k LOC), sponsors (Project Hatchery, MEP-WiSE), testimonials, events, photos, founding year |

**Safe numbers only:** 7 subsystems · 4 workflow stages · 8-month build cycle · 2 projects · 7 open seats · 11 paths · Thu 6 PM · Bldg 17 Rm 1635.
**Imagery:** zero real photos exist. Use procedural SVG/WebGL of the actual artifacts, or striped plates captioned `[ PROJECT PHOTO — … ] [placeholder]`. `public/images/Landing-Page-Hero.png` (drafting table) is unconfirmed as real; avoid as a hero, and if used, it's 8.2 MB, so use next/image. Contributor names → `[placeholder]` or an unsigned `BUILT BY ______` block.

## 2. IA + homepage narrative (from `research/ia-proposal.md`, challenge freely)

Surfaces: **Home · Work (/projects) · Studio (about+team) · Join · Contact**. No Partners/Events/Members/News pages (no content).
Homepage, 6 beats: (1) Thesis + artifact hero; (2) The work: DG-001, DG-002, Venture Studies, plus an unsigned DG-003 "pitch the next build" row;
(3) How a build runs: one subsystem traced owner → review → test gate → repair plan; (4) Where you fit: subsystem × discipline matrix
(codes ME EE SW DS ID VN CM OP); (5) Unsigned block / open seats (stand-in for PROOF); (6) Join: Thursday build night, Discord, one CTA.
**There's no PROOF section, since no real proof exists.** Proof = the artifacts, the mechanism, honest status.
The prototype is a homepage; nav may link to sibling routes as `#` or to real production routes.

## 3. Design systems (from `research/design-systems-shortlist.md`)

| System | Take | Best for |
|---|---|---|
| IBM Carbon | 16/8/4 grid, 4px base, 0 radius, 1px hairlines + surface steps (no shadows), one accent | B, E |
| Wired | One face per role (display serif 400 / text / sans labels), story rows split by hairlines, masthead + black footer band | A, D, E |
| PostHog | Warm canvas, marginalia as the decorative system, 80px rhythm, docs density, one loud CTA | D, F, C |

Invariants from 10 specs: one chromatic accent; no drop shadows; radius is an identity decision (never mixed); mono scoped to metadata; one signature display move; 80–96px section rhythm.
Production accent `#d8412f` (signal red). Concepts may choose differently, but must justify it.

## 4. Type + icons (rendered at `/design-lab/type-lab`, `renders/type-lab/panels/`)

| Dir | Display / body / mono (verified in render) | Icons |
|---|---|---|
| A | Zodiak 400 / Switzer / JetBrains Mono (alt: Instrument Serif ≥56px only) | Phosphor Light, ≤1 per block |
| B | IBM Plex Sans Condensed 600 caps (≤3 lines) / Plex Sans / Plex Mono | Tabler `stroke={1.5}` (has circuit-symbol glyphs) |
| C | Clash Display 600 (track −0.01em, not tighter) / General Sans / Martian Mono | Lucide 1.5 + `absoluteStrokeWidth` |
| D | Fraunces (SOFT 100, WONK 1, opsz 144) / Figtree / Plex Mono | Phosphor Regular (Duotone ≤3 spots) |
| E | Cabinet Grotesk 800 / Satoshi / JetBrains Mono | Lucide 1.5 |
| F | Bricolage Grotesque (opsz 96, wdth 75) 800, track −0.005em / Bricolage / Departure Mono | Pixelarticons (not installed: fetch SVG source via `npx -y aria-icons@0.1.0 get pixelarticons:<name>`) or Departure-Mono glyphs |

Font loading: Google faces via `next/font/google` in your route. Fontshare faces (Zodiak, Switzer, Clash, General Sans, Cabinet, Satoshi): **one `<link>` per family** to `https://api.fontshare.com/v2/css?f[]=<slug>@<weights>&display=swap` in your route's layout (multi-family requests drop families). Fontshare's license forbids redistribution, so link to the CDN; don't commit the woff2. Departure Mono is self-hosted OFL at `app/design-lab/type-lab/fonts/DepartureMono-Regular.woff2` (copy it into your route if needed).
Rules: re-check tracking at real size; display ≥40px on mobile; one display voice per page; Archivo is display-only.

## 5. Reference patterns (from `research/reference-analysis.md` §5; 17 sites, screenshots in `references/<slug>/`)

**Steal as principle:** (1) the hero shows a real artifact with real fields (`linear`, `framework`, `playdate`); (2) project entry = title + problem + discipline roster + status + duration in mono metadata, which no site in the set does, so DIGITAL can own it; (3) "different majors, one product" as a flat-lay of the 7 subsystems (`framework`); (4) mechanism over adjectives (`recurse-center`, `y-combinator`); (5) join = numbered steps + time cost + date (`recurse-center`, `berkeley-launchpad`); (6) one accent on CTAs/markers only (`darkroom-engineering`); (7) serif voice + mono metadata, an open slot no one uses (`y-combinator`, `nothing`); (8) one focal motion object per page (`vercel`, `playdate`); (9) one structural texture: dot grid / hairline grid / glyph per project (`nothing`, `mit-media-lab`); (10) hero as a discipline filter (`stanford-dschool`).
**Avoid:** painted gradient/violet heroes; logo walls / unbacked stats; elite tone; thin project cards; 10px all-caps mono body; sticker whimsy; content hidden until scroll reveal (blank first paint fails no-JS); modals over hero; autoplay video without poster; many simultaneous effects.

## 6. Copy (from `research/copy-analysis.md` §3; lines are directions, not final)

Rules: `docs/design/BRAND.md` voice (declarative, verbs, imperative CTAs, no filler words); promise lines ≤7 words; reveal lines ≤9 words, subject first; §40 banned slogans; `[confirm]`/`[placeholder]` for anything unverified.
Ten directions: 1 Signature as proof ("Every build is signed.") · 2 Footnoted standard (define "worth") · 3 Mechanism ("You take a subsystem." / "You own it through the test gate.") · 4 "Seven subsystems. One phone." · 5 "No project yet? Take an open subsystem." / "Products need more than programmers." · 6 "Résumés claim it. Builds show it." · 7 Honest status ("Prototyping. Not shipped yet.") · 8 Project formula problem → object → who → state · 9 Repeated stem ("Your name on the schematic / pull request / repair plan.") · 10 CTA "Take a subsystem" + "See the builds"; close "Put your name on one."
Concepts should differ in voice too. Don't all use the same 3 lines.

## 7. Library fit (installed in worktree; versions in `tooling-audit.md` §1)

| Lib | Use for | Fit | Notes |
|---|---|---|---|
| `motion` 13.4.6 (`motion/react`) | reveals, shared layout, `useScroll` | all | wrap in `<MotionConfig reducedMotion="user">` |
| `gsap` 3.13 + ScrollTrigger, `lenis` 1.3 | long scroll storytelling, pin/scrub | A, C, E, F | `gsap.matchMedia()` for reduced motion; Lenis honors it |
| `three` 0.169 / `@react-three/fiber` 8 / `drei` 9 | hero object / shader | C, F (B diagrams) | `next/dynamic` `ssr:false`, static poster fallback, pause offscreen; don't upgrade (v9/v10 need React 19) |
| `cobe` 2.0.1 (5.9 KB) | globe | C (D only with real locations, and none exist) | Never invent locations |
| `roughjs` 4.6.6 (8.8 KB) | hand-drawn process sketches, margin notes | D, A, F | |
| `recharts` 3.10.1 (151 KB) | charts | B, E | **real data only**; ≤3 charts → hand SVG instead |
| `@dnd-kit/core` 6.3.1 + sortable | draggable board / team builder | F, E, D | KeyboardSensor required |
| `thinking-orbs` 0.3.2 | project-phase states | C, E, F | Each state must map to a real phase, otherwise it reads "generic AI" |
| `page-mascot` 0.1.0 (+ skill `.claude/skills/page-mascot/`) | page character | MASCOT, F | 52 pre-drawn characters; aria-hidden, off on touch/reduced motion |
| Icons: `lucide-react`, `@phosphor-icons/react`, `@tabler/icons-react` | — | see §4 | one family per concept |
| fancycomponents.dev (copy source, MIT, keep header) | Stacking Cards (A,E,B), Vertical Cut Reveal (A,E,C,F), Scramble Hover (B,C), Media Between Text (A,D,E), Text Highlighter (A,D), Drag Elements (C,F,D) | — | URLs + fallbacks in `library-fit.md` §2. **None handles reduced motion**, so add it yourself. Import `cn` from `@/lib/utils` |
| Stitch MCP (`mcp__stitch__*`, load via ToolSearch) | layout variants | A (Superdesign substitute) | Superdesign NOT VERIFIED (needs account login) |
| Remotion 4.0.532 at `design-lab/motion-reel/` | procedural reel | MOTION-BRAND | `.jsx` compositions |
| NOT USED | Higgsfield, Blender, 21st.dev (user decision); OpenUI (needs runtime LLM; static export); vgpu/TypeGPU (WebGPU-only, ideas only); MotionSites AI (anti-reference); HealthCentral (403, not scouted) | | |

## 8. Tool roster

```bash
cd /home/danny/worktrees/digital-design-lab
bash design-lab/scripts/ensure-server.sh                                  # dev server :3100, never kill it
node design-lab/scripts/shoot.mjs /design-lab/<slug> design-lab/renders/<slug>/v1 <slug>   # 1440/834/390 full-page
node design-lab/scripts/shoot.mjs /design-lab/<slug> <dir> <label> --viewport-only --wait=3000  # hero/WebGL
node design-lab/scripts/gemini.mjs critique "<prompt>" <png|webm|mp4…> --out=<file.md>
node design-lab/scripts/gemini.mjs image "<prompt>" <out.png>             # counts against the image budget below
npx tsc --noEmit                                                          # must stay clean
```
- shoot.mjs prints console errors per viewport. 0 is required. It waits 2.5s, then scroll-primes reveals (`--prewait=ms` to change).
- **The chrome-devtools MCP is broken this session ("Target closed").** Don't use it. For interaction checks or video, write a small Playwright script in `design-lab/scripts/` (see `capture-states.mjs`; the Playwright `recordVideo` option gives webm).
- **Gemini image budget (≤8 total for the goal):** DA-D ≤4, MASCOT ≤2, reserve 2 (orchestrator). Label every output `[placeholder]`; never present one as real members or real work.
- Copy is exploratory. Production copy still goes through brand-voice-strategist → brand-guardian later; note this in your concept doc.
- Production bug found by the audit (out of scope, don't fix): `/about`, `/get-involved`, `/projects`, `/community` render blank (`<Reveal>` without `useReveal()`). Don't copy that pattern. Content must be visible without JS.
