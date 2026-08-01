# Design Spec — Modules Landing, Glasses-Page Realism, and Cross-Linking IA

**Date:** 2026-07-04
**Branch:** `experiment/glasses-scroll-hero`
**Status:** Approved by user (brainstorming session 2026-07-04); pending implementation.
**Source handoff:** `docs/HANDOFF-hud-landing.md`
**Working method:** Claude plans/verifies; implementation is delegated to Codex CLI
(`codex:setup` → `codex:rescue`) as file-scoped, verifiable tasks (§7).

---

## 0. Decisions log (user-approved)

| # | Decision | Choice |
|---|----------|--------|
| 1 | Landing concept | **"Modules → Everything"** — one WebGL block metaphor carries loader → mission narrative → product portals |
| 2 | Landing atmosphere | **Light → dark journey**: `#d6d4d3` studio sweep deepening to a `#16161a` product chamber |
| 3 | Landing route | **Stage at `/landing-preview`** first; swap to `/` only after team sign-off (separate future task) |
| 4 | Glasses IA | **Promote to `/projects/smart-reading`**; `/experiments/glasses` becomes a client redirect stub |
| 5 | HUD scope | **HUD design system + PBR material pass**; in-lens render-to-texture is a stretch task attempted only after core verifies |
| 6 | Glasses hero palette | **Warm paper / reading light** regrade (flat `#FACC15` retired); book blurry→clear POV beat preserved exactly |
| 7 | Landing focus | The star is **DIGITAL the platform**. The two projects appear only as closing exhibits. No HUD UI on the landing. |
| 8 | Info panels | **Sequential fade (never crossfade) + direction-aware auto-advance** so two paragraphs can never blend |

---

## 1. Hard constraints (apply to every task)

- **Static export** (`output: 'export'`): no server-only features; all R3F via `next/dynamic` with
  `ssr: false`; **no runtime CDN fetches** (no drei `Environment` preset); all assets under `/public`.
- **TypeScript strict**: `npx tsc --noEmit` → 0 errors.
- **Tailwind only** for styling; no CSS-in-JS.
- **All copy lives in `lib/data/`** — never hard-coded in components.
- **Signal red `#d8412f`** on production surfaces only for eyebrows, margin notes, progress rail,
  active nav, primary CTA hover (per `DESIGN.md`).
- **`TODO.md` Dev Build / Version Control table** updated for every commit.
- Environment gotchas (from handoff §5a): restart dev server after edits before screenshotting
  (`pkill -f next-server; npm run dev`); never `npm run build` while dev runs; screenshots via the
  self-installed Playwright harness (`/tmp/glasses-shot.mjs` pattern) using
  `window.__lenis.scrollTo(y, { immediate: true })`.

---

## 2. Track A — The Modules Landing (`/landing-preview`)

### 2.1 Concept

DIGITAL is made of modules — disciplines, people, parts. A single field of ink-colored 3D blocks
assembles the DIGITAL logo mark on load, then disperses and recomposes into a formation per mission
beat, and finally splits into the two flagship products, which are clickable portals into their
pages. One metaphor carries the entire page. Reference sensibility: `cobloc.archi`
(minimalist, skippable intro, scroll narrative, Awwwards-grade restraint).

### 2.2 Files

| File | Role |
|------|------|
| `app/landing-preview/page.tsx` | Thin client page; `next/dynamic` import of the experience, `ssr: false`; metadata |
| `components/landing/LandingExperience.tsx` | Orchestrator: Lenis smooth scroll, framer-motion `useScroll` → `progressRef`, background color interpolation, exposes `window.__lenis`, mounts everything. Total scroll ≈ 700vh |
| `components/landing/LandingScene.tsx` | Single R3F `<Canvas>`; plain/local lights only; DPR clamp |
| `components/landing/ModuleField.tsx` | One `InstancedMesh` (~300 blocks). Named formations = precomputed target-transform arrays; scroll eases instances between formations |
| `components/landing/ProductChamber.tsx` | Final formations: procedural modular phone (stacked module blocks, hairline gaps) + glasses FBX (reuse `GlassesModel` loader/normalize logic). Raycast hover → spotlight + mono label; click → camera dolly-in → `router.push` |
| `components/landing/MissionBeats.tsx` | DOM text overlays for the four mission beats (Archivo display + DM Mono labels), driven by `progressRef` |
| `components/landing/ClubStrip.tsx` | Dark DOM section after the chamber: condensed stats, pillars, sponsors, join CTA, footer links, full-color logo |
| `lib/data/landing.ts` | ALL copy (mission beats, labels, portal captions, club strip), formation config, palette stops |
| `public/assets/landing/DIGITAL_LOGO-removebg-preview.png` | Logo source (copied from user's file); alpha channel sampled for the logo formation |

### 2.3 Logo usage

- The **square circuit-trace "D" mark**'s alpha channel is sampled on-mount to generate block
  target positions for the loader formation. Blocks render in ink `#16161a` — the logo contributes
  **geometry, not its gradient colors**.
- The "DIGITAL" wordmark under the assembling mark is live DOM type (Archivo ExtraBold), crisp and
  selectable.
- The full-color PNG (white wordmark — legible only on dark) appears verbatim once, in the dark
  ClubStrip/footer.

### 2.4 Scroll choreography (progress 0→1)

| Progress | Beat | Blocks | DOM |
|----------|------|--------|-----|
| 0.00–0.12 | **Loader** (also plays as hero) | fly in → assemble logo mark | wordmark fades in below; "Skip intro" button (jumps to 0.15) |
| 0.12–0.25 | Break-apart | mark disperses into orbiting field | eyebrow: "DIGITAL @ Cal Poly Pomona" |
| 0.25–0.40 | **WE EXPLORE** | compass/field formation | mission line 1 |
| 0.40–0.55 | **WE DESIGN** | blueprint grid formation | mission line 2 |
| 0.55–0.70 | **WE BUILD** | stacked structures formation | mission line 3 |
| 0.70–0.82 | **WE COMMUNICATE** | signal-wave formation | mission line 4 |
| 0.82–0.95 | **Product chamber** | split: half → procedural phone; glasses FBX descends beside it | two mono labels + CTAs; background fully `#16161a`; spotlights |
| 0.95–1.00 | **Club strip** | canvas fades/parks | stats · pillars · sponsors · join CTA · footer (DOM, dark) |

Background interpolates `#d6d4d3` → deepening greys → `#16161a` across the journey (grain +
vignette overlay throughout so no beat reads flat). The phone (flagship) takes first position in
the chamber.

### 2.5 Interaction & fallbacks

- **Portals:** hover = spotlight intensifies + label underlines; click = eased camera dolly toward
  the object, then route change (`/projects/modular-smartphone`, `/projects/smart-reading`).
- **Skip intro** per cobloc; intro ≤ 3.5 s; assets (FBX, logo) preload during it.
- **`prefers-reduced-motion` or no WebGL:** static hero (logo image on dark, mission text as plain
  sections, two product cards) — fully functional page, no canvas.
- **Mobile:** reduced instance count, DPR clamp, simplified formations; same content.
- **Chrome:** global Navbar/Footer hidden on this route (see Track C guard). ClubStrip carries the
  footer essentials.

### 2.6 Copy

Mission-beat copy derives from the user's mission statement (platform for all disciplines;
explore → design → build → communicate; bridging theory and execution; projects as educational
ecosystems; entrepreneurship connected to engineering). Draft in `lib/data/landing.ts`, then refine
via the **`brand-voice-strategist`** agent (no AI-tells, Apple/Google restraint).

---

## 3. Track B — Glasses page realism (`/projects/smart-reading`)

The page **keeps its identity and choreography** (hero split → swirl → POV book blurry→clear with
RSVP HUD → fly-back reveal → info panels). This track changes only: the palette grade, the HUD
presentation, panel transition mechanics, and 3D materials.

### 3.1 Palette regrade — "warm paper / reading light"

- Hero field: radial sweep ≈ `#e9dfc8` (center) → `#d9cba6` (edges) with grain + gentle vignette —
  a book page under a reading lamp. Flat `#FACC15` is retired; yellow survives only as a small
  accent (eyebrow / highlight ring).
- Scroll journey: warm paper → amber-grey dusk → existing charcoal (`#111827`/`#0b0e16`) POV world
  (unchanged). Update the color interpolation stops in `GlassesExperience.tsx` +
  `lib/data/experiments/glasses.ts`.
- `FloatingDecor.tsx`: hairline-stroke treatment (no filled cartoon shapes); density unchanged.

### 3.2 HUD design system (`HudOverlay.tsx` rewrite + tokens in `lib/data/experiments/glasses.ts`)

- **Palette (2 colors total):** phosphor green family (≈ `#7fe6a3`) on dark glass; white reserved
  for the RSVP focus word.
- **Type:** DM Mono, `font-variant-numeric: tabular-nums` for all data; 3-step scale
  (focus word / data / micro-labels).
- **Structure:** one grid. Hairline (1px) corner brackets frame the focal zone; thin reticle
  underline beneath the RSVP word; ambient chips (time · WPM · battery) aligned to bracket edges;
  Lucide stroke icons only.
- **Optics:** layered soft glow on glyph edges (waveguide bloom); 1px chromatic fringe on the
  outermost brackets only; whole HUD drifts 4–6px with spring-damped pointer parallax.
- **Motion:** staggered eased-spring entrances; exits ~40% faster than entrances;
  `prefers-reduced-motion` → simple fades.
- **Content honesty:** RSVP word cadence, WPM readout, caption line — real product functions only;
  no invented widgets.

### 3.3 Info panels — no mixed text, ever (`InfoPanels.tsx` + `GlassesExperience.tsx`)

1. **Sequential fade:** outgoing panel reaches opacity 0 *before* the incoming panel starts
   (dead-zone between bands). At no scroll position do two panels have nonzero opacity.
2. **Direction-aware auto-advance:** inside the panels section, downward scroll intent glides
   (eased `lenis.scrollTo`) to the *next* panel's center in order; upward to the previous.
   Hysteresis threshold ignores jitter; an in-flight glide is never interrupted by sub-threshold
   input. Nav-anchor jumps (`NAV_TARGET`) still land on panel centers.

### 3.4 PBR material pass (`GlassesModel.tsx`)

- Fix the 404'd texture reference (correct path or remove the stale reference).
- `MeshPhysicalMaterial`: clearcoat acetate frame; brushed-metal temples; tinted transmission on
  the lens region.
- Local light rig (3-point + area light). **No CDN HDR**; any env map ships in `/public`.

### 3.5 Stretch (only after 3.1–3.4 verify)

Render-to-texture HUD glimpse inside a procedurally fitted lens plane during the fly-back-in beat.
Note: `Sunglasses.fbx` is pruned to a single mesh (`FBX_KEEP`), so the lens plane must be fitted and
tracked procedurally. If fit quality can't be reached quickly, drop without blocking anything.

---

## 4. Track C — IA & cross-linking

### 4.1 Route promotion

- Move experience mount to `app/projects/smart-reading/page.tsx` (thin client wrapper, `ssr: false`).
- `app/experiments/glasses/page.tsx` becomes a one-line client stub: `router.replace('/projects/smart-reading')`
  (static export has no server redirects; keeps old links alive).
- Add a `smart-reading` entry to `lib/data/projects.ts` (not `comingSoon`) → projects grid, home
  bento, and sitemap pick it up automatically. Content from
  `docs/The Smartglasses Project … [Master Document].md`.

### 4.2 Chrome rules

- Generalize the Navbar/Footer hide-guard from `pathname.startsWith('/experiments')` to a shared
  list of immersive prefixes: `/experiments`, `/landing-preview`, `/projects/smart-reading`.
- Immersive pages get a mono **"← DIGITAL"** escape hatch (top-left; fades out on scroll,
  reappears near the end).

### 4.3 Journey loop

- Shared "Next project" handoff card component; phone page ends with *"Next: Smart Reading →"*,
  glasses page with *"Next: Modular Smartphone →"* — styled per each page's world.
- Full loop: landing → either product → the other product → club strip / join. No dead ends.

### 4.4 Connective tissue

- DM Mono for instrument labels on all three surfaces; shared eased-glide motion timing;
  signal red only per `DESIGN.md` rules on production surfaces.
- Update `app/sitemap.ts` if the new routes aren't picked up automatically.

---

## 5. Error handling & testing

- **WebGL context loss** (landing + glasses): listen for `webglcontextlost`; show the static
  fallback rather than a blank canvas.
- **FBX/asset load failure:** ProductChamber degrades to the procedural phone + a block-built
  glasses silhouette; log a console warning (dev only).
- **Verification per change (handoff §8):** `npx tsc --noEmit` → 0;
  `npx next lint --dir app --dir components --dir lib` → 0 (ignore pre-existing
  `TeardownMobilePoster` `<img>` warning); stop dev then `npm run build` → static export green,
  new routes emitted; Playwright-harness screenshots on a freshly restarted dev server at defined
  scroll positions (landing: 0, 0.3, 0.6, 0.88, 1.0; glasses: hero, POV mid, panels).
- **Interaction checks (scripted via harness):** portal click routes correctly; panel
  auto-advance lands on centers in both directions; reduced-motion renders static fallback.

---

## 6. Explicit non-goals

- No swap of `/` — the current home stays until sign-off (the swap is its own future task).
- No redesign of the smartphone teardown or its assets.
- No dark-mode variants (DESIGN.md ships light-only for production surfaces).
- No new copy hard-coded in components; no new CSS-in-JS; no server features.
- HUD UI never appears on the landing page.

---

## 7. Delegation plan (Codex CLI)

Preflight: run `codex:setup`. Every task prompt includes §1 constraints + its acceptance criteria.
Order (shared-file edits last):

| Seq | Track | Task (file-scoped) | Acceptance |
|-----|-------|--------------------|------------|
| B1 | B | Palette regrade + decor restraint (`GlassesExperience.tsx`, `glasses.ts`, `FloatingDecor.tsx`) | tsc/lint 0; screenshots at hero/dusk/charcoal match spec §3.1 |
| B2 | B | Panel sequential fade + direction auto-advance (`InfoPanels.tsx`, `GlassesExperience.tsx`) | scripted scroll shows zero blended text; both directions land on centers |
| B3 | B | HUD system rewrite (`HudOverlay.tsx`, `glasses.ts` tokens) | POV screenshots match spec §3.2; reduced-motion fade works |
| B4 | B | PBR pass (`GlassesModel.tsx`, asset fix) | frames read as acetate/metal in screenshots; no CDN fetches; build green |
| A1 | A | Landing scaffold: route, experience shell, Lenis, bg interpolation, `lib/data/landing.ts`, logo asset | route renders; `window.__lenis` present; tsc/lint/build green |
| A2 | A | `ModuleField` formations incl. logo-alpha sampling + loader/skip | formations verified at scroll stops 0/0.3/0.5/0.7 |
| A3 | A | `ProductChamber` portals (procedural phone + FBX) + `MissionBeats` + `ClubStrip` | portal clicks route; chamber screenshot matches; fallbacks render |
| A4 | A | Copy pass via `brand-voice-strategist` into `lib/data/landing.ts` | copy reviewed; no hard-coded strings |
| C1 | C | Route move + redirect stub + projects data entry | old URL redirects; grid/sitemap show Smart Reading |
| C2 | C | Chrome guard list + escape hatch + Next-project cards | chrome hidden on immersive routes; loop navigable end-to-end |
| — | B (stretch) | In-lens render-to-texture glimpse | attempted only after B1–B4 + A + C verify; droppable |

After each Codex pass: verify per §5, restart dev before screenshots, record the commit in
`TODO.md`.
