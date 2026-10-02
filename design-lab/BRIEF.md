# DESIGN LAB BRIEF — DIGITAL @ Cal Poly Pomona redesign exploration

Shared brief for every design-lab agent. Source: the user's orchestration prompt (2026-10-02).
This is EXPLORATION, not implementation. The user (Head Designer) picks the direction.

## Ground rules

1. Work ONLY in the worktree `/home/danny/worktrees/digital-design-lab` (branch `design-lab/exploration`).
   Never edit `/mnt/c/Users/DangT/Documents/Github/DIGITAL_WebsiteV1` (production checkout).
2. Never edit existing production routes/components (`app/*` outside `app/design-lab/`, `components/`, `lib/data/`).
   Read them freely. Prototype code lives in `app/design-lab/<slug>/` + `design-lab/`.
3. Don't touch shared config (`tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`, `next.config.js`,
   `package.json`) — the orchestrator owns those. Need a dependency? Say so in your report.
4. Never fabricate a tool install, a project fact, a metric, a testimonial, or a partner.
   Real content lives in `lib/data/` and `design-lab/audit.md`. Placeholder content must be labeled `[placeholder]`.
5. No API keys printed or committed.
6. Do not commit. The orchestrator commits.

## Organization positioning (§20)

Multidisciplinary student builder org: CS, Engineering, Business, Data, AI, Product, Design, Science,
Entrepreneurship. Members collaborate on real projects (see `lib/data/projects.ts`, `phoneV2.ts`,
`experiments/glasses.ts`).

Thesis: **MAKE SOMETHING WORTH PUTTING YOUR NAME ON.**

Should feel like: startup studio + engineering lab + creative technology collective + student builder community.
Should NOT feel like: generic student club, consulting org, university department, template SaaS landing,
hackathon site, crypto startup, generic AI company.

Homepage narrative (agents may challenge): WHY THIS EXISTS → WHAT MEMBERS BUILD → REAL PROJECTS →
HOW TEAMS WORK → WHO CAN JOIN → PROOF → HOW TO PARTICIPATE.

## Every concept must deliver (§23, §31, §32)

1. design thesis  2. visual system  3. typography  4. palette  5. layout  6. navigation  7. hero
8. project section  9. one secondary section  10. responsive behavior  11. interaction language
12. a FUNCTIONING homepage prototype at `/design-lab/<slug>` (desktop + mobile).

Spec doc `design-lab/concepts/concept-<slug>.md` must cover:
- Typography: display / heading / body / mono families, sizes, weights, line-heights, tracking, responsive scale
- Color: bg, fg, muted fg, primary, secondary, accent, borders, elevated surfaces, states
- Geometry: spacing scale, margins, max width, grid, radii, border weights, shadows
- Motion: duration scale, easing, springs, entrance, hover, page transitions, reduced-motion behavior
- Iconography: family, stroke, scale, usage rules

Build it, don't describe it. Render and LOOK at it (screenshots) before reporting.

## Projects are the hero (§41)

Treat projects as portfolio artifacts, not decorative cards: title, real imagery, problem, team disciplines,
technologies, duration, status, outcome, contributions, partner, repo/demo where real.

## Anti-generic rules (§39)

Avoid by default: giant centered headline + generic gradient + two CTA buttons; 3-card feature rows;
random testimonials; bento-everything; pill overload; rounded-card overload; floating gradient orbs;
glow everywhere; huge radii; meaningless dashboards; purple/blue AI palette; glassmorphism; stock AI
illustration; startup buzzwords. Every visual decision needs a purpose.

## Copy rules (§40)

Banned: "Empowering innovation." "Transforming ideas into impact." "Where innovation meets opportunity."
"Build the future." "Unlock your potential." "Join a community of innovators."
Use concrete language. Territory to explore (not mandatory): "Build work people can actually use." /
"Don't just join something. Make something." / "Different majors. One product." /
"Your portfolio should contain evidence." / "Turn coursework into shipped work." /
"Products need more than programmers." Also respect `docs/design/BRAND.md` voice rules.

## Accessibility (§42) and performance (§43)

Semantic HTML, keyboard nav, visible focus, AA contrast, `prefers-reduced-motion`, 44px touch targets,
responsive text, sane line lengths, screen-reader labels. Experimental ≠ inaccessible.
Progressive enhancement for shaders / Three.js / canvas / video / cursor effects / mascots: lazy-load,
fallback, mobile-aware, no idle GPU saturation.

## Motion (§9)

Motion with purpose: staggered reveals, shared-layout transitions, scroll-linked transitions, masked
transitions, hover feedback. Avoid constant movement, gratuitous parallax, floating blobs, animation that
delays information. Always honor `prefers-reduced-motion`.

## Medium specialization (§19)

Claude/code: SVG, diagrams, geometry, layout, procedural graphics, Three.js interaction.
Image models / Blender: rendered imagery, textures, 3D representation. Pick the right medium per artifact.

## Lab infrastructure

- Dev server: `http://localhost:3100` (worktree). If it is down: `bash design-lab/scripts/ensure-server.sh`.
- Screenshots: `node design-lab/scripts/shoot.mjs <route> <outDir> [label]` → desktop 1440, tablet 834,
  mobile 390 full-page PNGs. Then Read the PNGs and look.
- Shared directories: `design-lab/{audit.md,tooling-audit.md,research/,concepts/,renders/,critiques/,comparison/,assets/}`.
- chrome-devtools MCP is ONE shared browser: hold `bash design-lab/scripts/devtools-lock.sh acquire <id>` while
  using it, then `release <id>`.
- Gemini (external vision/video critic + limited placeholder images, ≤8 total):
  `node design-lab/scripts/gemini.mjs critique "<prompt>" <png|webm|mp4...> [--out=file.md]`.
  The key lives in `.env.local`; never print or commit it.
- NOT available by user decision: Higgsfield, Blender, 21st.dev.

## Resource libraries the user wants considered

fancycomponents.dev (primary inspiration), Motion / motion.dev, GSAP ScrollTrigger, Lenis, COBE globe
(portfolio photo locations), React Three Fiber, vgpu/TypeGPU examples, Rough.js, Recharts (real data only),
Lucide, dnd kit, Beautiful UI, MotionSites AI, HealthCentral (reference page).
Fit per direction: `design-lab/research/library-fit.md` (written in Wave 1B).
