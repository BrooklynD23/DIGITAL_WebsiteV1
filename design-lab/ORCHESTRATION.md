# DESIGN LAB ORCHESTRATION PLAYBOOK

Executable plan for the DIGITAL redesign exploration. Pointed to by `/goal`.
Revision 2 (2026-10-02): user decisions applied. Gemini is set up. No Higgsfield, no Blender, no 21st.dev, no
user screenshots. Sonnet scouts replace the screenshot collection.

| File | Role |
|------|------|
| `design-lab/ORCHESTRATION.md` (this) | What the orchestrator does, wave by wave, and the exact subagent prompts |
| `design-lab/ORIGINAL_PROMPT.md` | The user's full original brief, verbatim. Cited below as §N. **Part 3 user decisions override it** |
| `design-lab/BRIEF.md` | Condensed brief every subagent reads first |
| `~/.claude/agents/ref-scout.md` | Sonnet / low-effort scout agent definition (Wave 1A) |

Worktree: `/home/danny/worktrees/digital-design-lab` · branch `design-lab/exploration` (from `5693b8d`).
Production checkout `/mnt/c/Users/DangT/Documents/Github/DIGITAL_WebsiteV1` is READ-ONLY for this goal.

---

## 0. Session start (orchestrator, ~10 min, inline)

1. `cd /home/danny/worktrees/digital-design-lab && git status && git log --oneline -1`
2. Read `design-lab/BRIEF.md` and Parts 1 + 3 below. Do not read `ORIGINAL_PROMPT.md` in full; open single §N sections only when needed.
3. Finish the infra left pending in session 1:
   ```bash
   cd /home/danny/worktrees/digital-design-lab
   bash design-lab/scripts/ensure-server.sh
   node design-lab/scripts/shoot.mjs / design-lab/renders/current home
   node design-lab/scripts/gemini.mjs text "Reply with exactly: GEMINI OK"
   ```
   Read the 3 PNGs to confirm the screenshot pipeline works.
4. Confirm the `ref-scout` agent type is listed among the available agent types. If it isn't (agent list not
   reloaded), use `subagent_type: "general-purpose"` with `model: "sonnet"` and paste the body of
   `~/.claude/agents/ref-scout.md` into each scout prompt.
5. Launch Wave 1A in one message. No questions are pending; Part 3 answers them.

---

## Part 1 — Findings so far

### 1.1 Repo and project facts

| Item | Finding |
|------|---------|
| Branch at start | `feature/site-consolidation`, clean, HEAD `5693b8d` (#0053: hero promise becomes the brand thesis) |
| Stack | Next.js 14 App Router, React 18, TS strict, Tailwind 3. `output: 'export'` only when `NODE_ENV=production`, so the dev server is unaffected |
| Already-installed libs | `framer-motion ^11.18`, `gsap ^3.13` (ScrollTrigger included), `lenis ^1.3`, `animejs ^4`, `three ^0.169`, `@react-three/fiber ^8.18`, `@react-three/drei ^9.122`, `lucide-react ^1.17` |
| Node | Local `v26.10.0`; `package.json` engines says `24.x`. `npm ci` still succeeded |
| npm | `npm ci` warns that install scripts are blocked (`unrs-resolver` postinstall). Harmless so far |
| Governing docs | `DESIGN.md` (brand system, #0052), `docs/design/{landing,smartphone,glasses}.DESIGN.md`, `docs/design/BRAND.md` (copy voice) |
| Content | `lib/data/`: `projects.ts`, `phoneV2.ts`, `experiments/glasses.ts`, `homeLanding.ts`, `team.ts`, `involvement.ts`, `about.ts`, `community.ts`, `mission.ts`, `siteConfig.ts`, `siteLinks.ts`, `contactTopics.ts`, `reviewRoutes.ts` |
| Routes | `/`, `/about`, `/community`, `/contact`, `/get-involved`, `/team`, `/projects/modular-smartphone`, `/projects/smart-reading`, `/pillars` (redirect stub), `/review` (internal), legal |
| Other reference material | `Refractor/` (industrial-studio reference build), `prototypes/`, `UI_Pages/` (not yet inspected), `public/assets/layers/*.png` (phone teardown layers) |
| Project rules that still apply | Copy goes through `brand-voice-strategist` and is reviewed by `brand-guardian`; every commit is logged in the `TODO.md` Dev Build table (`#0054`…). Prototypes may diverge from `DESIGN.md` because they're approved exploration on an isolated branch |

### 1.2 Environment / tooling

| Tool | Status | Notes |
|------|--------|-------|
| **Gemini API** | **WORKING** (verified: text + image critique) | Key stored ONLY in worktree `.env.local` (mode 600, git-ignored). Helper: `design-lab/scripts/gemini.mjs` (modes `text`, `critique`, `image`). Defaults: critique `gemini-pro-latest`; image `gemini-3.1-flash-image`. Also available: `gemini-3.1-pro-preview`, `gemini-3.8-flash`, `veo-3.1-generate-preview` (video gen, NOT to be used), `lyria-3.5` (music, NOT to be used). Never print the key |
| Headless Chromium (Playwright) | WORKING | Playwright `1.63.0` is a worktree-only devDependency. `shoot.mjs` picks the cached `chromium_headless_shell-1246` via `executablePath` |
| chrome-devtools MCP | AVAILABLE, ONE shared browser | Parallel agents must hold the baton: `bash design-lab/scripts/devtools-lock.sh acquire|release <id>` |
| ffmpeg | FOUND `/usr/bin/ffmpeg` | Frame extraction + reel encoding |
| google-chrome | FOUND `~/.local/bin/google-chrome` | |
| Stitch MCP (Google) | AVAILABLE | Optional layout/variant exploration (`generate_variants`, `create_design_system_from_design_md`) |
| Skills | `web-design-guidelines` (Vercel auditor), `design-taste-frontend-v1` (Taste; v2 not installed), `impeccable`, `ui-ux-pro-max`, `design:*`, `building-components`, `frontend-patterns` | |
| OpenRouter | NOT CONFIGURED, not needed | Gemini direct covers §12 |
| Higgsfield | **NOT USED** (user decision) | |
| Blender / Blender MCP | **NOT USED** (user decision: resource constraints) | §18 is recorded as NOT USED. Any 3D stays in lightweight R3F/Three.js |
| 21st.dev magic MCP | **REMOVED** from user MCP config (user decision: no budget) | |
| Still to verify (W1-TOOLING) | Superdesign, Aria Icons, Thinking Orbs, page-mascot skill, OpenUI, Awesome DESIGN.md, Taste v2, Remotion, `motion` (motion.dev), Fontshare/Fontesk/Fontjoy, plus the Part 1.4 resource libraries | |

### 1.3 Files in the worktree (uncommitted)

| Path | State |
|------|-------|
| `design-lab/BRIEF.md`, `ORIGINAL_PROMPT.md`, `ORCHESTRATION.md` | Done |
| `design-lab/scripts/shoot.mjs` | Written; first run happens in step 0.3 |
| `design-lab/scripts/ensure-server.sh` | Written; first run happens in step 0.3 |
| `design-lab/scripts/gemini.mjs` | Working (text + critique verified; `image` mode not yet run) |
| `design-lab/scripts/devtools-lock.sh` | Written |
| `.env.local` | Gemini key (git-ignored, never commit) |
| `package.json` / lock | `playwright@1.63.0` devDependency (worktree only) |
| `.gitignore` | Appended: `.server.log`, `.server.lock`, `.devtools.lock/` |

### 1.4 User-supplied resource list (scouts and design agents use these)

The user named these; scouts verify the URLs marked "verify".

| Resource | URL | Intended use |
|----------|-----|--------------|
| Fancy Components | https://www.fancycomponents.dev/ | Primary component/interaction inspiration (user asked explicitly) |
| Motion (Framer Motion) | https://motion.dev (examples: https://motion.dev/examples) | Layout/shared transitions, reveals |
| vgpu "Examples" | verify (possibly TypeGPU examples: https://docs.swmansion.com/TypeGPU/examples/) | GPU/shader inspiration |
| HealthCentral | verify (https://www.healthcentral.com) | Listed by the user as a reference; scout it as a content/product page |
| Beautiful UI ("Crafted primitives for AI-native interfaces") | verify via search | Primitive styling reference |
| COBE | https://cobe.vercel.app | Lightweight WebGL globe. User idea: portfolio globe showing where project photos were taken |
| React Three Fiber examples | https://r3f.docs.pmnd.rs/getting-started/examples | 3D/renderer patterns (already a dep) |
| Lenis | https://lenis.darkroom.engineering | Smooth scroll (already a dep) |
| MotionSites AI | verify via search | Motion-forward site prompts/examples |
| GSAP ScrollTrigger | https://gsap.com/docs/v3/Plugins/ScrollTrigger/ | Scroll-linked storytelling (already a dep) |
| Rough.js | https://roughjs.com | Hand-drawn generative SVG (sketch/process aesthetics) |
| Recharts | verify (https://recharts.github.io/en-US/examples) | Charts. **Only with real data**; no meaningless dashboards (§39) |
| Lucide | https://lucide.dev | Icons (already a dep) |
| dnd kit | verify (https://dndkit.com, React quickstart) | Drag & drop, e.g. F's nonlinear project exploration or a team-builder |

### 1.5 Lessons that shape the plan

1. The chrome-devtools MCP is one browser. Parallel agents either hold the devtools baton or use `shoot.mjs`.
2. All npm installs happen once, in W1-TOOLING. Later agents request deps in their report and never edit `package.json`.
3. One shared dev server on `:3100`. Agents call `ensure-server.sh` and never kill it.
4. Each concept is isolated in `app/design-lab/<slug>/` with a CSS Module or scoped layout. No global CSS or config edits.
5. The worktree is on the Linux filesystem for a fast `next dev`. The user views it at `http://localhost:3100/design-lab`.

---

## Part 2 — Waves

Rules for every wave:
- **Model policy:** `ref-scout` = Sonnet, low effort (user instruction). Every agent that builds, critiques or synthesizes = `model: "opus"`.
- Every prompt starts with the **Common Header** (Part 4). Exception: `ref-scout` has its own built-in header.
- Every agent writes its artifacts to disk and returns a ≤25-line report. The orchestrator reads reports, not whole artifacts, except at the gates.
- Launch every agent in a wave in ONE message.

| Wave | Agents (parallel) | Gate before next wave |
|------|-------------------|-----------------------|
| 1A Discovery | SCOUT-1…4 (Sonnet), W1-AUDIT, W1-TOOLING, W1-SYSTEMS | All files present |
| 1B Synthesis | W1-REFS (Opus): synthesizes scout notes | Orchestrator writes `CONTEXT-PACK.md`. Commit `#0054` |
| 2 Exploration | DA-A … DA-F, MOTION-BRAND, MASCOT | Every route renders in 3 viewports with 0 console errors. Commit `#0055` |
| 3 Critique | CRIT-1 … CRIT-6 (ring), MICRO, A11Y-RESP | Every concept has its critique bundle. Commit `#0056` |
| 4 Refine | DA-A … DA-F (one pass each) | v2 renders saved. Commit `#0057` |
| 5 Present | GALLERY | `/design-lab` + `/design-lab/components` render. Commit `#0058` |
| 6 Report | orchestrator | §45 report → **STOP** (§46) |

About 30 agent runs. If budget forces a cut, drop MASCOT first (fold it into F), then A11Y-RESP (fold it into the CRIT agents).

### Wave 1A — Discovery (7 agents, parallel)

**Scouts:** `subagent_type: "ref-scout"` (Sonnet, low effort). Each visits sites through the chrome-devtools MCP under the baton and writes `design-lab/research/scout/<site>.md` + `design-lab/references/<site>/*.png`.

| ID | Sites | Focus |
|----|-------|-------|
| SCOUT-1 Components & motion | fancycomponents.dev (≥6 components, read their source pages), motion.dev examples, GSAP ScrollTrigger demos, Lenis, MotionSites AI, Beautiful UI | Interaction patterns worth stealing as principles; reduced-motion handling; implementation hints (which lib) |
| SCOUT-2 Generative / 3D / data | COBE, R3F examples, vgpu/TypeGPU examples, Rough.js, Recharts examples, dnd kit, Lucide | Weight/perf cost, visual character, which concept direction each fits |
| SCOUT-3 Landing & product pages | Self-selected ≥8 widely praised landing/product pages (e.g. hardware, dev tools, design tools, consumer product) + HealthCentral | Narrative order, hero, product/project presentation, proof, CTA, mobile |
| SCOUT-4 Organization / studio / lab / community | Self-selected ≥8: startup studios, engineering collectives, university/innovation labs, creative-technology studios, builder communities, accelerators | Mission rhetoric, project showcases, joining/recruiting flows, partner/sponsor language |

Scout prompt (send to each, adjusting ID and list):
```
You are <SCOUT-n>. Sites: <list from the table; for self-selected lists, choose by craft quality
and relevance to a multidisciplinary student builder org, then justify each pick in one line>.
Write notes to design-lab/research/scout/<site-slug>.md and screenshots to
design-lab/references/<site-slug>/. Follow your agent definition's browser baton protocol.
Finish with design-lab/research/scout/_<scout-id>-summary.md: a ≤40-line cross-site pattern
summary for your focus area.
```

**Opus agents (same message):**

| ID | subagent_type | Output files | Done when |
|----|---------------|--------------|-----------|
| W1-AUDIT | general-purpose | `audit.md`, `research/content-inventory.md`, `research/ia-proposal.md`, `renders/current/*.png` | Covers all 10 §1 checks; current-site screenshots via `shoot.mjs` (NOT the devtools MCP); IA proposal per §22 from real content |
| W1-TOOLING | general-purpose | `tooling-audit.md` (§2 table, one row per §48 item AND per Part 1.4 resource), installs | Every item is VERIFIED / INSTALLED / NOT VERIFIED / NOT COMPATIBLE / NOT USED (user decision) with a source URL |
| W1-SYSTEMS | general-purpose | `research/design-systems-shortlist.md`, `research/fonts.md` + `app/design-lab/type-lab/page.tsx`, `research/icons.md` | ≥8 font pairings rendered and screenshotted; ≥3 icon families compared on the §8 axes |

### Wave 1B — Synthesis (1 agent)

| ID | Output | Done when |
|----|--------|-----------|
| W1-REFS (Opus) | `research/reference-analysis.md` (§21), `research/copy-analysis.md` (§3), built from the `research/scout/*` notes + extra WebFetch where needed | ≥12 sites analyzed on the §21 axes; copy patterns for ≥5 orgs; 10 DIGITAL copy directions |

**Gate 1 (orchestrator):** read the reports and write `design-lab/CONTEXT-PACK.md` (≤150 lines): real projects + facts, IA summary, the 3 shortlisted systems, font + icon candidates, top scout patterns, copy patterns, resource-library fit map (which lib suits which direction), and a tool roster with how-to-use lines. Design agents read the CONTEXT-PACK, not the raw research. Commit.

### Wave 2 — Exploration (8 agents, parallel, blind to each other)

Each DA-x gets the Common Header + the Design Agent Template + its row. Agents must not read other slugs' code or concept docs (§23).

| ID | Route | Direction (§) | Required experiment (libs from Part 1.4 where they fit) |
|----|-------|---------------|---------------------------------------------------------|
| DA-A | `/design-lab/a` | §24 Editorial / Studio | **Superdesign** (§4) if verified, else Stitch `generate_variants`; fancycomponents-style typographic interactions |
| DA-B | `/design-lab/b` | §25 Engineering / System | Procedural SVG schematics; status-driven project index; **Recharts** only on real project data |
| DA-C | `/design-lab/c` | §26 Creative Technology | **R3F/GLSL shader hero** (§13), lazy-loaded with a static fallback; **Thinking Orbs** as project-formation states (§14); optional **COBE** globe |
| DA-D | `/design-lab/d` | §27 Human / Community | People + process storytelling; **Rough.js** sketch layer for process/collaboration; Gemini `image` mode for ≤4 placeholder scenes, labeled `[placeholder]` and never presented as real members |
| DA-E | `/design-lab/e` | §28 Startup / Product Studio | Case-study project template (§41); **motion.dev** shared-layout transitions; **GSAP ScrollTrigger + Lenis** scroll storytelling |
| DA-F | `/design-lab/f` | §29 Radical | Free choice, must be a working site. Candidates: **dnd kit** nonlinear project board, page mascot, **OpenUI** (§17) if verified |
| MOTION-BRAND | `design-lab/motion-reel/` (own package) | §10–11 | ~15 s procedural reel: Remotion (or Canvas + Playwright frame capture) → ffmpeg → `renders/motion/reel.mp4`, then **Gemini video critique** → one revision |
| MASCOT | `/design-lab/mascot` | §16 | Brand-adapted page character with a mascot / no-mascot toggle; off on touch and under reduced motion |

§18 Blender / SPATIAL-3D: **dropped by user decision.** Record it as NOT USED in the final report.

**Gate 2:** shoot every route (`shoot.mjs /design-lab/<slug> design-lab/renders/<slug>/v1 <slug>`) and read the PNGs. Broken routes go back to their agent via `SendMessage`. Commit.

### Wave 3 — Critique (8 agents, parallel)

CRIT-n is a fresh Opus agent that adopts the critic concept's lens and critiques the target in the target's own style (§35).

| ID | Critic lens → target | Also runs |
|----|---------------------|-----------|
| CRIT-1 | A → B | `web-design-guidelines` skill |
| CRIT-2 | B → C | **Gemini motion critique** (§34) |
| CRIT-3 | C → D | Taste (`design-taste-frontend-v1`, or v2 if installed) |
| CRIT-4 | D → E | `web-design-guidelines` + Gemini motion critique |
| CRIT-5 | E → F | Gemini motion critique + Taste |
| CRIT-6 | F → A | Taste |
| MICRO | all 6 | §15 checklist via the `impeccable` skill → `critiques/micro-<slug>.md` |
| A11Y-RESP | all 6 + mascot | §42 a11y + responsive at 390/834/1440 → `critiques/a11y-<slug>.md` |

**Gemini motion critique recipe:**
1. Record: a Playwright script with `recordVideo` covering load, scroll and 2 interactions → `renders/<slug>/motion.webm`.
2. Critique: `node design-lab/scripts/gemini.mjs critique "<§34 axes prompt>" renders/<slug>/motion.webm --out=critiques/<slug>-gemini-motion.md`.
3. Cross-check: `ffmpeg -i motion.webm -vf fps=4 frames/%03d.png` and read the frames yourself. Report agreements and disagreements with Gemini.

Commit at Gate 3.

### Wave 4 — Refine (6 agents)

Use `SendMessage` to the Wave-2 DA agents if they're still addressable; otherwise start fresh agents with the Refine Template. ONE pass (§36). Re-render to `renders/<slug>/v2/`. Commit at Gate 4.

### Wave 5 — Present (1 agent)

GALLERY builds `/design-lab` (§37), `/design-lab/components` (§38) and `comparison/README.md`. No ranking, no winner. Commit at Gate 5.

### Wave 6 — Report and STOP

§45 report in chat and in `design-lab/comparison/REPORT.md`. Its Experimental Features table must list every §48 item and every Part 1.4 resource with the prototype that uses it, or NOT VERIFIED / NOT COMPATIBLE / NOT USED (user decision). Then **STOP** (§46).

---

## Part 3 — User decisions (2026-10-02, override ORIGINAL_PROMPT)

| # | Decision |
|---|----------|
| 1 | **No Higgsfield.** Remove it from every workflow |
| 2 | **Gemini API is the external model.** Use it for video/motion critique, second-opinion visual critique, and limited placeholder imagery. Cap image generation at ≤8 images for the whole goal; no video generation |
| 3 | **No 21st.dev.** MCP server removed; record it as NOT USED (no budget) |
| 4 | **No Blender** (resource constraints). §18 → NOT USED; SPATIAL-3D agent dropped |
| 5 | **No user screenshots exist.** SCOUT-1…4 (Sonnet, low effort, chrome-devtools MCP) build the reference collection instead |
| 6 | **Resources from Part 1.4 + fancycomponents.dev** must be researched and offered to design agents |
| 7 | Still default (user hasn't objected): commit each wave on `design-lab/exploration` only, logged in `TODO.md` `#0054`–`#0058`; verified skills are installed worktree-local (`.claude/skills/` in the worktree) |

---

## Part 4 — Subagent prompt templates

### Common Header (prepend to every non-scout agent prompt)

```
Output style: follow ~/.claude/rules/common/subagent-output.md (i-have-adhd)

You are a subagent in the DIGITAL design lab. Before anything else read:
  /home/danny/worktrees/digital-design-lab/design-lab/BRIEF.md
  /home/danny/worktrees/digital-design-lab/design-lab/CONTEXT-PACK.md   (Wave 2+ only)
Work ONLY inside /home/danny/worktrees/digital-design-lab. Never edit the production checkout
/mnt/c/Users/DangT/Documents/Github/DIGITAL_WebsiteV1. Never edit package.json, tailwind.config.ts,
app/globals.css, app/layout.tsx or next.config.js; request deps in your report instead.
Never fabricate installs, facts, metrics, people, partners or testimonials; label placeholders
"[placeholder]". Never print, log or commit secrets (Gemini key lives in .env.local). Do not commit.
Not available by user decision: Higgsfield, Blender, 21st.dev. Don't use or suggest them.
Dev server: http://localhost:3100. If it's down: bash design-lab/scripts/ensure-server.sh (never kill it).
Screenshots: node design-lab/scripts/shoot.mjs <route> <outDir> <label> [--viewport-only] [--wait=ms]
then Read the PNGs and look at them. Use the chrome-devtools MCP only while holding
bash design-lab/scripts/devtools-lock.sh acquire <your-id> (release right after).
Gemini: node design-lab/scripts/gemini.mjs critique "<prompt>" <files...> [--out=path.md]
Original brief sections are in design-lab/ORIGINAL_PROMPT.md; read only the § numbers cited to you.
Final report: ≤25 lines. Files written, key decisions, blockers, requested deps, one next action.
```

### W1-AUDIT

```
Task: repository + brand + current-site audit (ORIGINAL_PROMPT §1, §22).
1. Inspect: app/, components/, lib/data/, DESIGN.md, docs/design/*.md, Refractor/, prototypes/, UI_Pages/, public/.
2. Write design-lab/audit.md: architecture, current design system (tokens, type, color, motion),
   reusable components, brand assets (paths), responsive behavior, copy voice, dependencies,
   what is strong and worth keeping, what is generic. Cite file:line.
3. Write design-lab/research/content-inventory.md: every real project with every real field
   (title, problem, disciplines, tech, status, dates, imagery paths, links), team data, involvement
   paths. Mark missing fields MISSING; do not invent them.
4. Write design-lab/research/ia-proposal.md: evaluate each §22 page against the actual content and
   propose an IA plus homepage narrative, with reasons. Challenge §22 where the content doesn't support it.
5. shoot.mjs for / /about/ /team/ /get-involved/ /projects/modular-smartphone/ /projects/smart-reading/
   into design-lab/renders/current/. Look at them and note defects in audit.md.
```

### W1-TOOLING

```
Task: tooling audit + installs (ORIGINAL_PROMPT §2–§19, §48; ORCHESTRATION Part 1.2, 1.4, 3).
Part 1.2 facts are verified; don't re-verify them.
1. For each §48 item and each Part 1.4 resource: find the canonical repo/docs, check compatibility
   (WSL2, Node 26, Next 14, React 18), and decide install / skip. Must resolve: Superdesign
   (VS Code ext vs CLI vs skill?), Aria Icons, Thinking Orbs, page-mascot skill, OpenUI (which
   project?), Awesome DESIGN.md, Taste v2, Remotion, motion (motion.dev), Fontshare/Fontesk/Fontjoy,
   the "vgpu" examples, Beautiful UI, MotionSites AI.
2. Install verified, safe, React-18-compatible JS deps into the worktree package.json in ONE npm
   command. Expected candidates: motion, cobe, roughjs, recharts, @dnd-kit/core (or @dnd-kit/react
   if it supports React 18), plus the chosen icon set if not Lucide. Remotion goes in a SEPARATE
   package at design-lab/motion-reel/. Skills install worktree-local (.claude/skills/).
   Record exact versions and sources.
3. Write design-lab/tooling-audit.md: the §2 table (Tool | Found | Installed | Version | Purpose |
   Agent usage), one row per item, using NOT VERIFIED / NOT COMPATIBLE / NOT USED (user decision)
   honestly. Add a "How agents use it" section with copy-paste commands and a lib → concept fit map.
4. Verify: npx tsc --noEmit passes; ensure-server.sh still serves /.
```

### W1-SYSTEMS

```
Task: design-system shortlist + fonts + icons (ORIGINAL_PROMPT §3, §5, §8).
1. Find the Awesome DESIGN.md collection (canonical repo). Read ≥6 relevant specs. Extract layout
   rules, type systems, token structures, interaction principles, density, whitespace,
   composition, nav behavior.
2. design-lab/research/design-systems-shortlist.md: exactly 3 systems that fit DIGITAL, with
   reasons, plus "compatible mixes" (which axis from which system, and why it stays coherent).
3. Fonts: ≥8 display/body(/mono) pairings from Fontshare, Fontesk, Fontjoy and Google Fonts, with
   licenses noted. Build app/design-lab/type-lab/page.tsx rendering each pairing with a real
   headline and paragraph from lib/data. Shoot it, look at it, and write
   design-lab/research/fonts.md with verdicts based on the render.
4. Icons: compare ≥3 families (Lucide is a dep; plus Phosphor, Tabler, Aria Icons if verified)
   on stroke, corner geometry, optical size, weight, friendliness vs technicality, brand fit.
   Write design-lab/research/icons.md with one recommendation per direction A–F.
```

### W1-REFS (Wave 1B)

```
Task: synthesize the reference research (ORIGINAL_PROMPT §3 "Competitor copy analysis", §21).
Inputs: design-lab/research/scout/*.md (incl. _SCOUT-n-summary.md files) and design-lab/references/*.
1. design-lab/research/reference-analysis.md: per-site table on the §21 axes (≥12 sites),
   cross-cutting patterns, and "steal as principle / avoid" for DIGITAL. Fill gaps with WebFetch.
2. design-lab/research/copy-analysis.md: rhetorical PATTERNS (hero, CTA, project descriptions,
   membership, proof, partner, recruiting) for ≥5 orgs. No copied sentences. End with 10 concrete
   DIGITAL copy directions extending "Make something worth putting your name on." that obey
   BRIEF copy rules + docs/design/BRAND.md.
3. design-lab/research/library-fit.md: for each Part 1.4 resource, what it's good for, its weight,
   and which of directions A–F it fits (from scout notes).
```

### Design Agent Template (DA-A … DA-F)

```
Task: design concept <X> "<direction name>" (ORIGINAL_PROMPT §<24–29>, §23, §31–§33, §39–§43).
Direction: <paste the §24–29 block>
Required experiment: <from the Wave 2 table>
You work BLIND: do not open app/design-lab/* or design-lab/concepts/* belonging to other slugs.
1. Read CONTEXT-PACK.md, content-inventory.md, ia-proposal.md, copy-analysis.md, library-fit.md,
   fonts.md, icons.md, tooling-audit.md, renders/current/home-*.png, and the reference screenshots
   CONTEXT-PACK points you to.
2. Write design-lab/concepts/concept-<x>.md: thesis (1 sentence + 1 paragraph), the full §31 spec,
   layout, navigation, hero, project section, secondary section, responsive behavior, interaction
   language, copy, risks, and the libraries used with the reason for each.
3. Build app/design-lab/<x>/ (page.tsx + layout.tsx + CSS module or Tailwind; fonts via next/font
   or a scoped <link>). Import real data from lib/data (don't edit it). Required: nav, hero,
   project section as portfolio artifacts (§41), one secondary section, join path, footer.
   Works at 390 / 834 / 1440. Accessible (§42), progressively enhanced (§43), reduced motion honored.
4. Render loop (§33): shoot.mjs → look → fix → re-shoot, at least 2 loops, 0 console errors.
   Motion-heavy concepts (C, E, F) also get one Gemini critique pass on a screenshot set or recording.
5. Report: route, thesis, 3 distinctive decisions, experiment outcome, known weaknesses.
```

### Specialist done criteria

- **MOTION-BRAND:** `renders/motion/reel.mp4` (~15 s, 1920×1080, deterministic), `concepts/motion-reel.md` (storyboard, timing table, easing), `critiques/motion-reel-gemini.md`, and one revision applied.
- **MASCOT:** `/design-lab/mascot` with a toggle, plus `concepts/mascot.md`. Decoration is `aria-hidden`, there's a pause control, and the mascot is off under reduced motion and on touch devices.

### Critic Template (CRIT-1 … CRIT-6)

```
Task: critique concept <TARGET> through the lens of concept <CRITIC> (ORIGINAL_PROMPT §35, §34, §6, §7).
1. Read concepts/concept-<critic>.md (your lens) and concepts/concept-<target>.md.
2. shoot.mjs /design-lab/<target> (3 viewports), read the PNGs, and read app/design-lab/<target>/.
3. Run the assigned skill(s) and/or the Gemini motion critique recipe (ORCHESTRATION Wave 3).
4. Write critiques/<target>-by-<critic>.md: one section per §35 axis (hierarchy, typography,
   distinctiveness, usability, brand fit, project storytelling, responsiveness, feasibility,
   motion). Each finding: evidence (screenshot/file:line), severity, and a suggestion in <TARGET>'s
   own style. Do not edit code.
```

### Refine Template (Wave 4)

```
Task: ONE refinement pass on concept <X> (ORIGINAL_PROMPT §36).
Inputs: concepts/concept-<x>.md, renders/<x>/v1/*, critiques/<x>-by-*.md, critiques/<x>-gemini-motion.md,
critiques/micro-<x>.md, critiques/a11y-<x>.md.
1. Triage into fix now (≤8) / reject with reason / defer. Keep the thesis; don't drift toward the critics.
2. Implement the fix-now items in app/design-lab/<x>/ only.
3. shoot.mjs into renders/<x>/v2/, look at the result, and fix regressions.
4. Append "## v2 changes" (applied / rejected-with-reason / deferred) to concepts/concept-<x>.md.
```

### GALLERY

```
Task: build the comparison experience (ORIGINAL_PROMPT §37, §38).
Inputs: all concepts/*.md, renders/*/v2/*, renders/motion/*, renders/mascot/*.
1. app/design-lab/page.tsx: §37 gallery with concept switching via tabs or a keyboard-navigable list.
   Neutral styling that doesn't favor any concept. Includes tiles for MOTION-BRAND (embedded video)
   and MASCOT (with vs without). No ranking.
2. app/design-lab/components/page.tsx: §38 grid (NAV, HERO, PROJECT CARD, CTA, TYPOGRAPHY × A–F),
   using screenshot crops (design-lab/comparison/crops/) or scoped iframes, each linked to its source.
3. design-lab/comparison/README.md: how to read the gallery and phrase hybrid requests.
4. Shoot both pages, look at them, fix them. 0 console errors.
```
