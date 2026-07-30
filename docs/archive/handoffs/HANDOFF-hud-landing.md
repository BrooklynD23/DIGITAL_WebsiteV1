# Handoff — HUD realism, landing-page revamp, and cross-linking the product experiences

**For:** the next planning agent.
**Branch:** `experiment/glasses-scroll-hero` (work is in the working tree but **not** git-committed).
**Date of handoff:** 2026-07-04.

---

## 0. Your mission (three tracks)

1. **HUD realism (primary).** Redesign the smart-glasses HUD + 3D presentation so it reads as a
   real AR product, not an "AI/amateur" demo. This is a differentiation play — the frontend
   system design must look intentional and premium.
2. **Landing-page revamp.** Create a new DIGITAL landing page that ties the two signature product
   experiences together (the **smart-glasses** experiment and the **smartphone teardown**) and
   frames the club.
3. **Tie the pages together.** Connect the HUD-glasses page and the smartphone page into one
   coherent journey (shared nav, shared motion/typography language, cross-links).

**Working method the user requested:** *You* plan the designs (brainstorm → written design spec),
then **delegate the implementation to Codex CLI via the codex plugin** (see §6). Don't hand Codex a
vague goal — hand it file-scoped, verifiable tasks derived from your design spec.

---

## 1. What exists today (ground truth)

### The smart-glasses experiment — `/experiments/glasses`
An isolated, client-only (R3F) scroll experience for **"Smart Reading"** — the club's FPGA-based,
RSVP dyslexia-assistive smart glasses (source of truth: `docs/The Smartglasses Project … [Master
Document].md`; faculty mentor Dr. Mohamed El Hadedy). It intentionally departs from the production
`DESIGN.md` "industrial studio" theme.

Files:
- `app/experiments/glasses/page.tsx` — client page; `next/dynamic` import of the experience with
  `ssr:false` (required for static export).
- `components/experiments/glasses/`
  - `GlassesExperience.tsx` — orchestrator: Lenis smooth-scroll, framer-motion `useScroll`
    progress mirrored into a `progressRef`, background color interpolation, mounts everything.
    Exposes `window.__lenis` (debug handle for scripted scroll). `NAV_TARGET` maps nav anchors to
    scroll fractions (lands on panel **centers** to avoid overlap).
  - `GlassesScene.tsx` — R3F `<Canvas>` (`z-[2]`), plain lights only (NO drei `Environment` preset
    — it fetches an HDR from a CDN and breaks static export/offline).
  - `GlassesModel.tsx` — loads FBX via `useLoader(FBXLoader)` from `three-stdlib`. `?model=` query
    switches models (`sunglasses` default, `vuzix`). `FBX_KEEP` prunes multi-mesh FBX to one mesh.
    `normalize()` recenters + scales (wrapper-group so pivot offset can't leak). Motion is a set of
    keyframe tracks (`POS_Y/POS_Z/ROT_X/SCALE`) lerped at 60fps; includes split-hero x-offset,
    swirl, curbed "parked sway", and a first-person **fly-out** (glasses leave frame during the
    book/HUD beat, return after).
  - `HudOverlay.tsx` — the wearer HUD: RSVP word on a dark glass chip, hairline corner brackets,
    ambient chips (time/battery/label). Currently a DOM overlay.
  - `PovBackground.tsx` — the "put the glasses on" book world: `BookBG_Blurry.png` → `BookBG_Clear.png`
    crossfade, darkened + desaturated + scrim for legibility.
  - `FloatingDecor.tsx` — hero-only floating vector decor.
  - `InfoPanels.tsx` — crossfading spec/detail panels (band base `0.74`).
- `lib/data/experiments/glasses.ts` — ALL copy + `pov`/`hud` config (per CLAUDE.md, no hard-coded
  copy in components). Copy was refined by the `brand-voice-strategist` agent (Apple/Google tone).
- `public/assets/experiments/glasses/` — `Sunglasses.fbx`, `vuzix-re2-hipoly.fbx`,
  `BookBG_Blurry.png`, `BookBG_Clear.png`, `README.md` (model drop-in guide).
- `.claude/agents/brand-voice-strategist.md` — reusable marketing/UX-copy agent (use it for any
  landing-page copy; it explicitly avoids AI-tells).

**Scroll choreography (progress 0→1):** hero split (glasses right / text left) → swirl to center →
first-person POV (glasses fly out; book blurry→clear; HUD RSVP) → book clears, glasses fly back in,
reveal headline on charcoal → info panels crossfade while glasses rest at the bottom. Background
interpolates `#FACC15` (yellow) → `#111827`/`#0b0e16` (charcoal).

### The smartphone teardown — `/projects/modular-smartphone`
The production "signature hero" scroll-driven hardware teardown (governed by `DESIGN.md`). Engine in
`components/teardown/` + `lib/teardown/config.ts` (renderers: 12-frame `sequence` [jagged],
97-frame `canvas` [smooth], `video`; `smoothScroll` flag / Lenis). Uses the industrial-studio theme.

### The current site shell
- `app/layout.tsx` renders global `<Navbar/>` + `<Footer/>` around all routes. Both now hide on
  `/experiments/*` (via `usePathname` guard) so the experiment is standalone.
- `app/page.tsx` is the current home (sub-team funnel). `DESIGN.md` is the production design system;
  `lib/data/` holds all content; `TODO.md` tracks the Dev Build / Version Control log.

---

## 2. Design tension to resolve (important)

There are currently **two visual languages**: the calm **industrial-studio** theme (`DESIGN.md`,
used by the smartphone teardown + site) and the **vibrant** experiment (yellow→charcoal, used by the
glasses). Your landing-page + cross-linking work must decide the unifying language:
- Option A: pull the glasses experience toward the industrial-studio system (on-brand, cohesive).
- Option B: elevate a new shared "product-cinematic" system both experiences adopt.
Make this an explicit decision in your plan (ask the user if unsure). The HUD-realism goal likely
pushes toward a refined, restrained system either way.

---

## 3. HUD realism — direction to plan (make it *not* look AI)

The HUD is currently a DOM overlay with a green word chip. To read as a real AR product, plan
improvements such as:
- **A real HUD design system**: a tight type scale (tabular/mono for data), a restrained 1–2 color
  monochrome palette (phosphor or white), consistent hairline strokes, iconography (Lucide, not
  emoji), grid alignment. Ground it with the `ui-ux-pro-max` skill (rules: `color-contrast`,
  `depth-layering`, `visual-hierarchy`, `number-tabular`, `motion-consistency`).
- **In-lens rendering** (optional, higher effort): render the HUD to a texture/plane inside the
  lens in R3F so it tracks the glasses with real parallax/depth, instead of a flat DOM card.
- **Believable optics**: subtle waveguide-style glow, slight chromatic edge, focal reticle, gentle
  drift/parallax tied to pointer — measured, not flashy.
- **Better 3D materials/lighting**: the FBX currently renders flat/light-gray (a texture 404s).
  Plan PBR materials + baked/local environment lighting (NO CDN HDR — bake a tiny local one or use
  area lights) so the frame reads as real acetate/metal with reflections.
- **Motion discipline**: spring/eased transitions, exit faster than enter, reduced-motion support.
- **Content**: keep it honest to the product (RSVP, WPM, live captions) — the realism comes from
  restraint and correctness, not more widgets.

Reference the user liked: `evenrealities.com/hud-glasses` (minimal, "stay in the moment").

---

## 4. Landing page + cross-linking — direction to plan
- A new landing that introduces DIGITAL and routes to the two flagship experiences (glasses +
  smartphone) with a shared, premium motion/typography language and one nav.
- Decide IA: is the glasses experience promoted from `/experiments/*` to a first-class product route
  (e.g. `/projects/smart-reading`)? If so, plan the nav/footer/link updates and whether the global
  chrome should return (it's currently hidden on `/experiments/*`).
- Reuse `lib/data/` for content; use the `brand-voice-strategist` agent for copy.

---

## 5. Hard constraints (do not violate)
- **Static export** (`output:'export'` in `next.config.js`): no server-only features; R3F must stay
  client-only via `ssr:false`; **no runtime CDN asset fetches** (no drei `Environment` preset);
  keep 3D/image assets under `/public`.
- **TypeScript strict** must stay green (`tsc --noEmit`).
- **Tailwind only** for styling; **content lives in `lib/data/`**; **one signal-red `#d8412f`** rule
  applies to production surfaces per `DESIGN.md`.
- **Keep `TODO.md` in sync** — record each doc/feature commit in the Dev Build / Version Control
  table (project standing rule).

## 5a. Environment gotchas that will bite you (learned this session)
- **WSL on `/mnt/c`: HMR misses file edits.** After editing, the dev server serves STALE code.
  **Restart the dev server** (`pkill -f next-server; npm run dev`) after changes before trusting a
  screenshot. This wasted real time — budget for it.
- **Don't run `npm run build` while `npm run dev` is running** — the build clobbers `.next` and the
  dev server then 404s its chunks (blank page). Build only after stopping dev.
- **Google Fonts are blocked in this sandbox** → first compile is slow (minutes) via fallback fonts;
  cosmetic only, not a failure.
- **No browser for the MCP screenshot tools** (chrome-devtools MCP = "Target closed"; Playwright MCP
  = "chrome executable not found"). Verification screenshots were done with a **self-installed
  Playwright chromium** driven by `/tmp/glasses-shot.mjs`, which jumps scroll via
  `window.__lenis.scrollTo(y,{immediate:true})`. Reuse/extend that harness; keep the `__lenis` hook.
- **FBX detail**: `Sunglasses.fbx` bundles two meshes (pruned via `FBX_KEEP`);
  `vuzix-re2-hipoly.fbx` needs an orientation fix + darker material if revisited. A referenced
  texture 404s (harmless today; relevant to §3).

---

## 6. How to delegate implementation to Codex CLI (the plugin)

The user wants **you to plan, Codex to implement**. Mechanism:
1. Run the **`codex:setup`** skill first to confirm the local Codex CLI is ready.
2. Hand each implementation unit to Codex via the **`codex:rescue`** skill (or the
   **`codex:codex-rescue`** agent). See also `codex:codex-cli-runtime` and `codex:gpt-5-4-prompting`
   for how to drive the runtime and prompt well.
3. Give Codex **file-scoped, verifiable tasks** from your design spec — e.g. "implement the in-lens
   HUD plane in `HudOverlay`/`GlassesScene` per spec section X; acceptance: `tsc` clean, renders at
   p≈0.5, screenshot matches". Include the constraints in §5 in every task.
4. After each Codex pass: verify with `tsc --noEmit`, `next lint`, and the Playwright screenshot
   harness; **restart dev before screenshotting** (§5a).

---

## 7. Recommended first steps for you
1. Read `DESIGN.md`, `lib/data/experiments/glasses.ts`, and the six `components/experiments/glasses/*`
   files; skim `components/teardown/` + `lib/teardown/config.ts` for the smartphone engine.
2. Decide the unifying design language (§2) — ask the user if needed (`AskUserQuestion`).
3. Use `superpowers:brainstorming` + `frontend-design` + `ui-ux-pro-max` to produce a written design
   spec for: (a) HUD realism, (b) landing page, (c) cross-linking/IA.
4. Break the spec into Codex tasks and delegate (§6); verify each (§5, §5a).

## 8. Verification checklist (per change)
- `npx tsc --noEmit` → 0
- `npx next lint --dir app --dir components --dir lib` → 0 (ignore the pre-existing
  `TeardownMobilePoster` `<img>` warning)
- Stop dev, `npm run build` → static export succeeds, routes emitted
- Screenshots via the Playwright harness on a freshly-restarted dev server
