# Tooling audit (W1-TOOLING, 2026-10-02)

Status: done. Environment: WSL2, Node `v26.10.0`, npm `11.19.1`, Next `14.2.35`, React `18.3.1`.
Statuses: **INSTALLED** · **VERIFIED** (real, checked, not installed) · **NOT VERIFIED** · **NOT COMPATIBLE** ·
**NOT USED (user decision)** · **METHOD** (a workflow, not software). Part 1.2 rows in ORCHESTRATION.md were
verified by the orchestrator and are only referenced here.

## 1. What changed in the worktree

| Change | Detail |
|---|---|
| `package.json` / lock (main app) | ONE command: `npm install motion@13.4.6 cobe@2.0.1 roughjs@4.6.6 recharts@3.10.1 react-is@18.3.1 @dnd-kit/core@6.3.1 @dnd-kit/sortable@10.0.0 @dnd-kit/utilities@3.2.2 @phosphor-icons/react@2.1.10 @tabler/icons-react@3.48.0 thinking-orbs@0.3.2 page-mascot@0.1.0` → added 56 packages. `npm audit`: 17 findings, all pre-existing (next, eslint-config-next, sharp, postcss, glob…); 0 from the new packages |
| `design-lab/motion-reel/` | Separate package: `remotion@4.0.532`, `@remotion/cli@4.0.532`, `react@18.3.1`, `react-dom@18.3.1` (0 audit findings). Smoke render **passed**: `out/smoke.mp4`, h264 1280×720, 45 frames. Remotion downloaded its own `chrome-headless-shell` into `motion-reel/node_modules/.remotion` |
| `.claude/skills/design-taste-frontend/` | Taste v2 SKILL.md, from `Leonxlnx/taste-skill@ce26fc2` (2026-09-26), MIT. Read before install |
| `.claude/skills/page-mascot/` | page-mascot skill from `nilbuild/page-mascot@76a44ed` (2026-09-15), MIT. Read before install. Removed its `mascot.tsx` copy (it would be type-checked by the root tsconfig; the npm package ships the same component) |
| Checks | `npx tsc --noEmit` exit 0 (also with a smoke file importing every new lib); `curl -sI localhost:3100/` → 200 |

Version notes:
- `motion` pinned to 13.4.6 (13.5.1 was published hours earlier, so we kept a release cooldown). Its range `framer-motion ^13.4.6` still resolved a **nested** `framer-motion@13.5.1` (signed by maintainer `popmotion`). The top-level `framer-motion@11.18.2` used by production stays as it is.
- `react-is@18.3.1` added explicitly so recharts 3 does not pull react-is 19 (its element checks don't match React 18).
- `@dnd-kit/react@0.5.0` supports React 18 but is pre-1.0, so we used the stable `@dnd-kit/core` 6.x instead.

## 2. §48 capability checklist + §2–§19 tools

| Tool | Found | Installed | Version | Purpose | Agent usage |
|---|---|---|---|---|---|
| Claude Design ([launch](https://venturebeat.com/technology/anthropic-just-launched-claude-design-an-ai-tool-that-turns-prompts-into-prototypes-and-challenges-figma)) | VERIFIED (Anthropic Labs, research preview since 2026-04-17, claude.ai web) | No (web product, can't be called from the CLI) | n/a | Prototypes and design systems | Only the user can use it in a browser. Agents copy the *method* (rows below) |
| Design-system-first workflow | METHOD | n/a | n/a | Tokens before components | Every `concept-<slug>.md` defines type/colour/geometry/motion/icons before building (BRIEF). Optional: `design:design-system` skill |
| Deriving systems from screenshots/sites/decks | METHOD | n/a | n/a | Extract tokens from references | SCOUT-1…4 + `shoot.mjs` + `gemini.mjs critique`; Stitch MCP `create_design_system_from_design_md` |
| Design-system shortlisting (~3) | METHOD | n/a | n/a | Pick systems on purpose | W1-REFS writes the shortlist + reasons to `research/library-fit.md` |
| Fontshare ([site](https://www.fontshare.com), ITF Free Font License) | VERIFIED; CSS API answers (`api.fontshare.com/v2/css?f[]=satoshi@400,700&display=swap` → woff2) | No (no npm) | n/a | Free foundry-grade display/body faces | Commercial + web use and self-hosting are allowed. You may not resell or redistribute the font files. See §3 |
| Fontesk ([license page](https://fontesk.com/license/)) | VERIFIED | No | n/a | Free font directory | Licenses vary per font. Use only fonts tagged OFL or free-commercial, and check the license file inside the zip. No license file = not allowed |
| Fontjoy ([fontjoy.com](https://fontjoy.com/)) | VERIFIED (neural-net pairing generator) | No | n/a | Pairing ideas | Ideas only. Every pairing must be rendered and looked at (§3 "Fonts"). Its font source wasn't confirmed, so check each face's license |
| Competitor copy research | METHOD | n/a | n/a | Rhetorical patterns | SCOUT agents → `research/`. Never copy wording |
| Mixing compatible design systems | METHOD | n/a | n/a | One coherent system | Each concept doc states what it took from which reference |
| Superdesign ([skill](https://github.com/superdesigndev/superdesign-skill), [orig. VS Code ext](https://github.com/superdesigndev/superdesign)) | VERIFIED. The current form is a skill (`npx skills add superdesigndev/superdesign-skill`) + `@superdesign/cli@0.14.0`, which needs `superdesign login` to the superdesign.dev cloud. The original repo is a VS Code extension | **No: BLOCKED (needs the user's account login)** | cli 0.14.0 | Canvas-based UI drafting | Not usable until the user installs the CLI and logs in. §4 asks one agent to try it, so the user has to decide |
| Aria Icons ([repo](https://github.com/LeulAria/Aria-Icons), [site](https://icons.leularia.com)) | VERIFIED: `npx -y aria-icons@0.1.0 search wrench` returned 284 hits; no key needed. MIT, 53★, new 0.1.0 | No MCP config added (the setup step edits agent config, which only the user should do). CLI works via npx | 0.1.0 | Search ~340k SVGs; write icons in as source; `doctor`/`migrate` to keep to one family | `search`/`get` to compare families and fill gaps. Don't mix families (§8) |
| Thinking Orbs ([repo](https://github.com/Jakubantalik/thinking-orbs)) | VERIFIED (npm `repository` points to the author's `Libraries.dev` monorepo, same author) | **INSTALLED** | thinking-orbs 0.3.2 | 9 canvas loader states; reduced-motion = static frame; pauses offscreen | `<ThinkingOrb state="connecting" size={64}/>`. Reuse the states as project phases (§14), only if they help the brand |
| Vercel custom shaders / vgpu ([repo](https://github.com/vercel-labs/vgpu), [site](https://vgpu.sh)) | VERIFIED (vercel-labs, WebGPU TS lib + example gallery) | No | vgpu 0.5.0 | Shader inspiration | WebGPU only: no universal browser support and no WebGL fallback stated. It pulls a native Dawn adapter. Use `npx vgpu examples` / vgpu.sh for ideas; build in three/R3F (already installed). TypeGPU is a different project |
| Interface-detail refinement | METHOD | n/a | n/a | "Feel better" pass | MICRO agent; skills `impeccable`, `web-design-guidelines` |
| Balanced text wrapping | VERIFIED (native CSS) | n/a | n/a | `text-wrap: balance` (headings) / `pretty` (body) | Put it in concept CSS Modules; no package needed |
| Procedural animation with Claude | METHOD | n/a | n/a | Deterministic motion | Remotion / canvas / three + explicit timelines |
| Remotion + React ([license](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)) | VERIFIED | **INSTALLED** (separate pkg) | 4.0.532 | Programmatic video | Free for individuals, companies with ≤3 staff, and non-profits; a student club fits. See §3 |
| Raw HTML5 Canvas | VERIFIED (native) | n/a | n/a | Procedural 2D | Client leaf + rAF + reduced-motion guard |
| Three.js / R3F | VERIFIED (Part 1.1) | Already present | three ^0.169, fiber ^8.18, drei ^9.122 | 3D / GLSL | Lazy-load (`next/dynamic`, `ssr:false`), static fallback, `frameloop="demand"` |
| Explicit keyframe timelines | VERIFIED | Present | gsap ^3.13, animejs ^4, remotion `interpolate`/`spring` | Timelines | GSAP for scroll; Remotion for video |
| Headless Chromium rendering | VERIFIED (Part 1.2) | Present | playwright 1.63.0 + Remotion's own headless shell | Screenshots / frames | `shoot.mjs`; Remotion render |
| FFmpeg composition | VERIFIED (Part 1.2) | Present | `/usr/bin/ffmpeg` | Encode, extract frames | `ffmpeg -ss 1 -i x.mp4 -frames:v 1 f.png` |
| OpenRouter | NOT USED (not configured, not needed) | No | n/a | Multi-model routing | Gemini direct covers §12 |
| External image/audio generation | VERIFIED (Gemini image) | n/a | gemini-3.1-flash-image | Placeholder imagery | ≤8 images total. Audio/video generation NOT USED |
| Video-capable model critique | VERIFIED (Part 1.2) | n/a | gemini-pro-latest | Motion critique | `node design-lab/scripts/gemini.mjs critique "<p>" clip.mp4` |
| Render → inspect → refine loop | METHOD | n/a | n/a | Quality loop | `shoot.mjs` → Read PNGs → fix → reshoot |
| Image-gen vs procedural specialization | METHOD | n/a | n/a | Right medium per asset | §19: code for diagrams/geometry/SVG; Gemini only for photo-like placeholders |
| Blender MCP | NOT USED (user decision) | No | n/a | Procedural 3D | Dropped (resource constraints) |
| Reference-based procedural 3D reconstruction | NOT USED (user decision: needs Blender) | No | n/a | n/a | Any 3D stays lightweight R3F |
| Camera/angle/proportion reasoning | METHOD (R3F only) | n/a | n/a | 3D framing | Applies to R3F scenes only |
| Opus-driven motion/showreel | METHOD | Uses Remotion | n/a | §11 reel | MOTION-BRAND builds compositions in `design-lab/motion-reel/src/` |
| page-mascot ([repo](https://github.com/nilbuild/page-mascot), by Kamran Ahmed) | VERIFIED | **INSTALLED** (component + skill) | page-mascot 0.1.0 | Cursor-following character | Pre-drawn route works (52 characters, fetched from koboyo.com). **Custom-drawing route BLOCKED**: it needs `OPENAI_API_KEY` (not set) and Python `PIL/numpy/scipy` (missing). Fallback: the manual prompts in `reference/prompts.md` through Gemini image (2 images per character, counts against the ≤8 cap) |
| OpenUI ([thesysdev/openui](https://github.com/thesysdev/openui), [openui.com](https://www.openui.com)) | VERIFIED (the generative-UI spec/runtime by Thesys; `@openuidev/react-lang@0.3.0`). Other repos named "openui" are forks | No: **NOT COMPATIBLE** with the site (it needs a live LLM at runtime, and the site is a static export) | n/a | Streams LLM-generated UI | Lab: not needed, since agents write real components. Site: a project finder or team builder should be deterministic code (dnd kit), not AI (§17) |
| Vercel web-design-guidelines | VERIFIED (Part 1.2) | Present (global skill) | n/a | Auditor | CRIT agents: `/web-design-guidelines` on a concept. Auditor only, so concepts don't all converge on one look |
| Taste skill ([repo](https://github.com/Leonxlnx/taste-skill)) | VERIFIED. v2 is now the default `design-taste-frontend` | **INSTALLED v2 worktree-local**; v1 already global | v2 @ce26fc2 | Anti-slop rules + 50-box pre-flight check | At least one critic runs its §14 pre-flight. **Conflicts with this repo**: it assumes Tailwind v4, suggests picsum placeholders, bans hand-drawn SVG and section-number eyebrows, and discourages Lucide. Where they clash, BRIEF/DESIGN.md wins |
| Awesome DESIGN.md ([VoltAgent/awesome-design-md](https://github.com/voltagent/awesome-design-md)) | VERIFIED (exists; DESIGN.md files analysed from 59+ brand sites, e.g. Vercel, Stripe, Notion, Apple) | No (a reference collection) | n/a | Rules for layout, type and tokens | W1-REFS / research agent reads the relevant files. **Folder layout NOT VERIFIED**: my fetch of the repo page was denied by the permission classifier |
| DESIGN.md-based reproduction/analysis | METHOD | n/a | n/a | Spec-driven UI | Stitch MCP `upload_design_md` / `create_design_system_from_design_md`; the repo's own `DESIGN.md` |
| Multiple independent prototype agents | METHOD | n/a | n/a | Wave 2 | DA-A…F, blind to each other |
| Visual review before production | METHOD | n/a | n/a | Waves 3 + 5 gates | Nothing ships to production routes |
| Higgsfield / 21st.dev | NOT USED (user decision) | No | n/a | n/a | Don't use or suggest them |

## 3. Part 1.4 resource libraries

| Tool | Found | Installed | Version | Purpose | Agent usage |
|---|---|---|---|---|---|
| Fancy Components ([docs](https://www.fancycomponents.dev/docs/installation)) | VERIFIED (React + TS + Tailwind + Motion; copy-paste or shadcn registry `@fancy`) | No (no `components.json` here; use **copy-paste**) | n/a | Primary interaction inspiration | Copy the source into `app/design-lab/<slug>/`. It imports `motion/react` (installed). Check each component's extra deps and ask the orchestrator if one is missing |
| Motion ([motion.dev](https://motion.dev)) | VERIFIED | **INSTALLED** | motion 13.4.6 | Layout/shared transitions, reveals, `useScroll` | `import { motion, useReducedMotion } from 'motion/react'`. Use it only in new `design-lab` code; don't mix with production `framer-motion@11` contexts (two separate copies) |
| COBE ([repo](https://github.com/shuding/cobe)) | VERIFIED (shuding, ~5 KB WebGL, MIT; v2 adds DOM/CSS-anchored markers) | **INSTALLED** | cobe 2.0.1 | Globe of where project photos were taken | `createGlobe(canvas,{…markers, onRender})`; `globe.destroy()` on unmount. Only real coordinates from `lib/data` |
| Rough.js ([roughjs.com](https://roughjs.com)) | VERIFIED | **INSTALLED** | roughjs 4.6.6 | Hand-drawn SVG/canvas | `rough.svg(svgEl).rectangle(…)`. Use a fixed `seed` for deterministic output |
| Recharts ([examples](https://recharts.github.io/en-US/examples)) | VERIFIED | **INSTALLED** | recharts 3.10.1 | Charts | **Real data only** (§39). `'use client'` |
| dnd kit ([dndkit.com](https://dndkit.com)) | VERIFIED | **INSTALLED** | core 6.3.1, sortable 10.0.0, utilities 3.2.2 | Drag & drop (F's nonlinear explorer, team builder) | Always add `KeyboardSensor` + `sortableKeyboardCoordinates`, plus screen-reader announcements |
| Lucide ([lucide.dev](https://lucide.dev)) | VERIFIED (Part 1.1) | Present | lucide-react ^1.17 | Icons (production default) | — |
| Phosphor ([phosphoricons.com](https://phosphoricons.com)) | VERIFIED | **INSTALLED** (for W1-SYSTEMS to compare) | @phosphor-icons/react 2.1.10 | 6 weights, friendlier | Server components: `@phosphor-icons/react/dist/ssr` |
| Tabler ([tabler.io/icons](https://tabler.io/icons)) | VERIFIED | **INSTALLED** (for comparison) | @tabler/icons-react 3.48.0 | 24px grid, adjustable `stroke`, technical feel | `<IconCube size={20} stroke={1.5}/>` |
| GSAP ScrollTrigger | VERIFIED (Part 1.1) | Present | gsap ^3.13 | Scroll storytelling | Register the plugin in a client leaf; kill it on unmount |
| Lenis | VERIFIED (Part 1.1) | Present | lenis ^1.3 | Smooth scroll | Turn it off under reduced motion |
| React Three Fiber examples | VERIFIED (Part 1.1) | Present | fiber ^8.18 (React 18 line) | 3D patterns | Don't upgrade to fiber 9 (it needs React 19) |
| vgpu "Examples" | VERIFIED = vercel-labs/vgpu (row above) | No | 0.5.0 | Shader ideas | Inspiration only |
| Beautiful UI ([site](https://beautiful-ui-five.vercel.app/)) | VERIFIED (copy-paste primitives for AI-agent UIs, by Turbo studio) | No (copy-paste, no package) | n/a | Styling reference for primitives | Low fit: chat/approval/tool-call UI. Borrow only detail craft (states, spacing) |
| MotionSites AI ([site](https://motionsites.ai)) | VERIFIED (a library of hero-section prompts, partly paid) | No | n/a | Motion-forward prompt examples | Reference only. Its outputs are the template heroes §39 bans, so study the motion, not the layout |
| HealthCentral | Reference URL from user (scouted by SCOUT agents, not a tool) | n/a | n/a | Content/product page reference | See `research/` |

## 4. How agents use it (copy-paste)

```bash
cd /home/danny/worktrees/digital-design-lab
# server + screenshots
bash design-lab/scripts/ensure-server.sh
node design-lab/scripts/shoot.mjs /design-lab/<slug> design-lab/renders/<slug> v1
# icons: compare families / fetch one glyph as source (no new dependency)
npx -y aria-icons@0.1.0 search "circuit"
npx -y aria-icons@0.1.0 get tabler:cpu --format react --size 24
# Remotion reel (compositions are .jsx so the root tsc ignores them)
cd design-lab/motion-reel && npx remotion studio src/index.jsx          # preview
cd design-lab/motion-reel && npx remotion render src/index.jsx <CompId> out/<name>.mp4
ffmpeg -v error -ss 2 -i design-lab/motion-reel/out/<name>.mp4 -frames:v 1 /tmp/f.png
node design-lab/scripts/gemini.mjs critique "Critique motion timing" design-lab/motion-reel/out/<name>.mp4
# Fontshare face (self-host per concept; layout.tsx/globals.css are off-limits)
curl -s "https://api.fontshare.com/v2/css?f[]=<font-slug>@400,700&display=swap"   # read woff2 URLs
#   → download the woff2 into app/design-lab/<slug>/fonts/ and load it with next/font/local in that route
# page-mascot (pre-drawn character; skill: .claude/skills/page-mascot/SKILL.md)
mkdir -p public/design-lab/mascots   # orchestrator approval: public/ is shared
```

```tsx
'use client';
import { motion, useReducedMotion } from 'motion/react';
import { ThinkingOrb } from 'thinking-orbs';          // <ThinkingOrb state="weaving" size={64} />
import { Mascot } from 'page-mascot';                  // <Mascot directions=… reactions=… label="…" />
import createGlobe from 'cobe';
import rough from 'roughjs';
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { IconCpu } from '@tabler/icons-react';
import { Cpu } from '@phosphor-icons/react';
```

Rules: every lib above runs in a `'use client'` leaf. Lazy-load WebGL (`next/dynamic`, `ssr:false`) and give it a static
fallback. Gate all motion on `useReducedMotion()`. Need a new dependency? Ask the orchestrator; don't run npm.

## 5. Lib → concept fit map

| Lib / tool | A Editorial/Studio | B Engineering/System | C Creative Tech | D Human/Community | E Startup/Product | F Radical |
|---|---|---|---|---|---|---|
| motion (layout, reveals) | ● | ● | ● | ● | ● | ● |
| GSAP ScrollTrigger + Lenis | ● long-form scroll | ○ | ● | ○ | ○ | ● |
| three / R3F (+ vgpu ideas) | — | ○ spec diagrams | ● hero object/shader | — | ○ | ● |
| COBE globe | — | ○ | ● | ● where photos were taken | ○ | ○ |
| Rough.js | ○ margin notes | — | ○ | ● process sketches | — | ● |
| Recharts (real data only) | — | ● only with real numbers | — | ○ | ○ | — |
| dnd kit | — | ○ | ○ | ● team builder | ● project board | ● nonlinear explorer |
| Thinking Orbs (project-phase states) | — | ○ | ● | ○ | ● status | ● |
| page-mascot | — | — | ○ | ● (MASCOT agent) | — | ● |
| Remotion reel | ○ | ○ | ● | ○ | ● launch reel | ● |
| Icons | Phosphor light / none | Tabler 1.5 | Tabler / custom via Aria | Phosphor regular | Lucide / Tabler | any one family |
| Fonts | Fontshare serif/grotesk | mono-led | Fontshare display | warm humanist | crisp grotesk | experimental (Fontesk OFL) |
| Fancy Components | ● text effects | ○ | ● | ○ | ● | ● |

● strong fit · ○ possible · — avoid

## 6. Blockers / user decisions pending

1. **Superdesign** needs `npm i -g @superdesign/cli && superdesign login` (a superdesign.dev account). The user decides; until then, no agent uses it.
2. **page-mascot custom drawing** needs `OPENAI_API_KEY` + `pip install pillow numpy scipy`, or else the manual Gemini route (counts against the ≤8 image cap). Pre-drawn characters work now.
3. **Aria Icons MCP** isn't configured (that would edit agent MCP config). The CLI works via npx.
4. **Awesome DESIGN.md** folder layout wasn't inspected (my repo fetch was denied by the permission classifier). The research agent needs access.
