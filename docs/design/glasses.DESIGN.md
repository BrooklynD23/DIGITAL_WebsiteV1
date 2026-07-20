# Smart Reading Glasses Page — Style Reference

> A paper-warm world seen through a wearable; the phosphor HUD is the only chromatic event.

**Theme:** light-to-dark (paper → dusk → charcoal → deep, driven by scroll)

The `/projects/smart-reading` page is a single sticky-viewport scroll experience whose entire
visual arc is the act of putting on the glasses. It opens in a warm paper beige — a book-page
world with hand-drawn floating decor and black display type — and darkens through dusk to a
near-black deep navy as the wearer's point of view takes over. Color is rationed: the world is
paper, ink, and muted olive; the single accent inside panels is a soft gold; and the only
saturated, glowing color on the page is the phosphor green of the in-lens HUD, which reads as
projected light, not printed ink. Typography is the site's shared trio (Archivo display,
Hanken Grotesk body, DM Mono data), but here the mono voice carries the HUD's
waveguide-display aesthetic: tabular numerals, wide tracking, hairline brackets with a faint
chromatic fringe. Every beat is positioned on a 0→1 scroll-progress track; nothing is
paginated. This document is extracted as-implemented from the component source.

---

## Tokens — Colors

Palette source: `GLASSES_PALETTE` and `HUD_THEME` in `lib/data/experiments/glasses.ts`.

### World palette

| Name | Value | Token | Role |
|---|---|---|---|
| Paper | `#e9dfc8` | `--glasses-paper` | Hero background; also the pin-track fallback `bg-[#e9dfc8]` |
| Paper Edge | `#d9cba6` | `--glasses-paper-edge` | Darker paper edge tone (defined in palette; reserved) |
| Dusk | `#6f6654` | `--glasses-dusk` | Mid-transition background (progress ~0.30); also a decor stroke color |
| Charcoal | `#111827` | `--glasses-charcoal` | Background during POV/HUD beat (progress ~0.42) |
| Deep | `#0b0e16` | `--glasses-deep` | Final background (progress ≥0.80); POV scrim base |
| Gold Accent | `#e3b341` | `--glasses-accent` | Spec-row keys in InfoPanels; one floating decor arc |
| Ink | `#000000` (`text-black`) | `--glasses-ink` | Hero headline, nav text, CTA button fill |
| Ink Soft | `black/70`, `black/75`, `black/60` | `--glasses-ink-soft` | Hero eyebrow (70%), lede (75%), scroll cue (60%) |
| White | `#ffffff` | `--glasses-white` | Dark-phase headlines, CTA label |
| White Soft | `white/70`, `white/65`, `white/55` | `--glasses-white-soft` | Panel body (70%), reveal sub (65%), spec values (55%) |
| Signal Red | `#d8412f` | `--glasses-signal-red` | CTA hover fill only (site-wide accent rule) + one decor leaf/dots stroke |
| Decor Ink | `#16161a` / `#16171c` | `--glasses-decor-ink` | Floating decor strokes / procedural frame material |

### HUD family (`HUD_THEME`)

| Name | Value | Token | Role |
|---|---|---|---|
| Phosphor | `rgba(127,230,163,0.95)` | `--hud-phosphor` | HUD chip text, reticle underline, in-lens glimpse strokes |
| Phosphor Dim | `rgba(127,230,163,0.5)` | `--hud-phosphor-dim` | Bracket borders, focus-point tick |
| Focus White | `#ffffff` | `--hud-focus` | The RSVP focal word — the only white inside the HUD |
| HUD Glass | `rgba(6,10,8,0.55)` | `--hud-glass` | Chip and focal-word backing plates |
| Phosphor Glow | `0 0 6px rgba(127,230,163,0.55), 0 0 18px rgba(127,230,163,0.22)` | `--hud-glow` | text-shadow on all phosphor text and the reticle box-shadow |
| Chromatic Fringe | `1px 0 0 rgba(255,80,80,0.28), -1px 0 0 rgba(90,130,255,0.28)` | `--hud-fringe` | box-shadow on brackets — red/blue lens aberration |

**Rule:** phosphor green appears ONLY in the HUD overlay and the in-lens glimpse texture.
It never colors world-layer UI, headings, or panels.

---

## Tokens — Typography

All three families are the site-wide Google fonts loaded in `app/layout.tsx`; the page adds no
fonts of its own.

### Archivo (`font-display`, `--font-display`)
- Role: headlines, nav labels, buttons, the RSVP focal word.
- Substitute: `system-ui, sans-serif`.
- Weights loaded: 500, 600, 700, 800. Used here: 800 (`font-extrabold`) for headlines,
  700 (`font-bold`) for nav/CTA/next-card title, 600 (`font-semibold`) for the RSVP word.
- Always `uppercase` + `tracking-tight` in this experience.

### Hanken Grotesk (`font-body`, `--font-body`)
- Role: lede, reveal sub, panel body, POV text-wall.
- Substitute: `system-ui, sans-serif`.
- Weights loaded: 400, 500, 600. Used here: 400 only.

### DM Mono (`font-mono`, `--font-mono`)
- Role: eyebrows, scroll cue, HUD chips, spec rows, escape hatch, next-card eyebrow.
- Substitute: `ui-monospace, monospace`.
- Weights loaded: 400, 500. Used here: 400. Always uppercase with wide letter-spacing.
- HUD data uses `font-variant-numeric: tabular-nums` (set inline on the HUD grid).

### Type Scale

Sizes are Tailwind utilities as written in code (px equivalents given).

| Role | Size | Line Height | Letter Spacing | Token |
|---|---|---|---|---|
| Hero headline (H1) | `text-5xl` (48px) → `sm:text-7xl` (72px) | `leading-[0.92]` | `tracking-tight` | `--type-hero` |
| Reveal headline (H2) | `text-4xl` (36px) → `sm:text-6xl` (60px) | `leading-[0.95]` | `tracking-tight` | `--type-reveal` |
| Panel title (H2) | `text-3xl` (30px) → `sm:text-4xl` (36px) | `leading-[1.02]` | `tracking-tight` | `--type-panel-title` |
| RSVP focal word | `text-3xl` (30px) → `sm:text-[2.25rem]` (36px) | default | `tracking-tight` | `--type-hud-word` |
| Next-card title | `text-xl` (20px) | default | `tracking-tight` | `--type-next-title` |
| Body / lede / panel body | `text-base` (16px) | `leading-relaxed` (1.625) | normal | `--type-body` |
| POV text-wall | `text-[15px]` | `leading-[1.7]` | normal | `--type-povwall` |
| Nav / CTA label | `text-sm` (14px) | default | `tracking-tight` | `--type-nav` |
| Eyebrow (hero) | `text-xs` (12px) | default | `tracking-[0.26em]` | `--type-eyebrow` |
| Scroll cue | `text-xs` (12px) | default | `tracking-[0.3em]` | `--type-cue` |
| Spec row | `text-xs` (12px) | default | `tracking-[0.18em]` | `--type-spec` |
| Escape hatch / next-card eyebrow | `text-[11px]` | default | `tracking-[0.2em]` | `--type-micro` |
| HUD chip | `text-[10px]` | default | `tracking-[0.22em]` | `--type-hud-chip` |

---

## Tokens — Spacing & Shapes

- **Density:** airy, single-focus. One headline block or one panel visible at a time;
  max content widths: hero column `max-w-xl` (lede `max-w-md`), reveal `max-w-3xl`
  (sub `max-w-md`), panels `max-w-2xl` (body `max-w-lg`).
- **Spacing scale (as used):** hero stack `mt-4 / mt-5 / mt-7`; panel stack `mt-4 / mt-6`;
  horizontal padding `px-6` mobile, `px-8`→`sm:px-14` hero; spec-row gaps `gap-x-6 gap-y-2`.
- **Border radius:** `rounded-full` (nav pill, buttons), `rounded-lg` = 10px (next-project
  card, per tailwind config), `rounded-md` (HUD focal-word plate), `rounded-[3px]` (HUD chips).
- **Layout metrics:** pin track `h-[460vh]`; sticky stage `h-screen`; HUD frame
  `h-[38vh] max-h-[360px] w-[min(76vw,540px)]`; brackets `h-6 w-6` hairline (1px) corners;
  panels anchored `top-[26%]`; reveal anchored `top-[16%]`; next card `bottom-[8%]`;
  scroll cue `bottom-8`; nav pill `top-4`, escape hatch `left-6 top-6`.
- **Buttons:** CTA `px-6 py-2.5`; nav items `px-4 py-1.5`; nav pill padding `p-1.5`, gap `gap-1`.

---

## Components

### ExperienceNav
**Role:** Floating pill navigation, fixed top-center, always visible.
`fixed inset-x-0 top-4 z-50`, centered. Pill: `rounded-full border border-black/80
bg-white/70 backdrop-blur-md p-1.5`, items `gap-1`. Wordmark "DIGITAL" in Archivo 800
uppercase `text-sm` black. Nav items: Archivo 700 uppercase `text-sm` black, transparent
border; hover → `border-black/80 bg-black text-white` plus Framer `whileHover scale:1.05`
(spring stiffness 400, damping 22). CTA button: black pill, white text, hover fill
`#d8412f`. Labels/CTA come from `GLASSES_CONTENT.nav` / `.cta`. Clicks call `onNavigate`,
which Lenis-glides to `NAV_TARGET` fractions (panel centers; fallback 0.78) over 1.4s.

### Hero (split text + 3D glasses)
**Role:** Opening beat on paper; copy left, glasses right — text never sits under the device.
Left column `absolute inset-y-0 left-0 max-w-xl px-8 sm:px-14`, vertically centered,
left-aligned; on `max-sm` it stacks top-center (`pt-[16vh] text-center`). Stack: mono
eyebrow (`text-xs tracking-[0.26em] text-black/70`), H1 (Archivo 800, `text-5xl
sm:text-7xl leading-[0.92] uppercase`, black, `mt-4`), lede (Hanken 16px `text-black/75
max-w-md`, `mt-5`), CTA (`mt-7`). Fades out over progress 0.10→0.18 with a −30px Y drift.
Scroll cue at `bottom-8`: mono `tracking-[0.3em] text-black/60`, "{footnote} ↓", gone by
progress 0.06. Copy strings: `GLASSES_CONTENT.hero`.

### GlassesScene (3D canvas)
**Role:** The device itself — an R3F canvas layered over the POV background (`z-[2]`),
full-bleed, `dpr [1,2]`, alpha, camera `[0,0,6.5]` fov 38. Lighting is fully local (static
export: no CDN HDRs): PMREM-baked `RoomEnvironment` from three-stdlib as
`scene.environment`, plus `ambientLight 0.25`, key `directionalLight [4,6,5] 1.1`, cool
fill `[-5,2,-3] 0.35 #cfd8e6`, warm rim `[0,4,-6] 0.9 #fff4dd`. Default model: the
`sunglasses` FBX (`/assets/experiments/glasses/Sunglasses.fbx`, keeping only mesh
`Large_Framed_Glasses_`), normalized to fit 2.7 units; `?model=vuzix` A/B override; GLB
and procedural fallbacks exist. Materials: acetate frame `MeshPhysicalMaterial #17171c`
(roughness 0.32, metalness 0.08, clearcoat 1, clearcoatRoughness 0.22); lens `#2a3a3f`
(roughness 0.06, transmission 0.85, opacity 0.5, thickness 0.25). An additive-blended
"hud-glimpse" plane (canvas texture: phosphor `rgba(127,230,163,0.95)` corner brackets +
`28px "DM Mono"` "RSVP · 450 WPM") sits at the left lens; visible only on the fly-back
beat (opacity ramps in over p 0.60→0.64, out 0.68→0.72, max 0.85). Hover: cursor pointer,
scale ×1.04; click toggles ×1.05.

### PovBackground (blur-to-clear)
**Role:** The wearer's reading world behind the glasses — uncorrected vision resolving to
corrected. Layer `z-0`, visible over progress 0.30→0.36 (in) and 0.55→0.60 (out). Uses
`pov.blurry` / `pov.clear` images (`BookBG_Blurry.png` / `BookBG_Clear.png`, object-cover);
the clear image crossfades over the blurry base across progress 0.40→0.50. Fallback: a
3-column justified text-wall from `pov.paragraph` (Hanken 15px/1.7 `text-white/70`, 6
repeats), blurred `blur(7px) contrast(0.8)` at opacity 0.5 under the sharp copy. The whole
scene is muted `saturate(0.7) brightness(0.62)`, then a flat scrim `bg-[#0b0e16]/45`, then
a radial "lens window": `radial-gradient(58% 52% at 50% 50%, transparent 0%,
rgba(11,14,22,0.45) 68%, rgba(11,14,22,0.85) 100%)` — center brighter, edges dark, so HUD
text clears WCAG 4.5:1.

### HudOverlay (phosphor readout)
**Role:** The waveguide-display HUD — one grid, two colors, projected not printed.
DOM overlay `z-30`, pointer-events-none, `aria-hidden`; opacity 0.34→0.40 in, 0.56→0.60
out. Frame: `h-[38vh] max-h-[360px] w-[min(76vw,540px)]`, `grid-rows-[auto_1fr_auto]`,
tabular-nums, four 24px hairline corner brackets in phosphor-dim with the chromatic-fringe
box-shadow. Row 1 (edges, `px-3 pt-3`): time chip (Clock3 icon 11px) and battery chip
(BatteryMedium 12px). Row 2 (center): a `h-2.5 w-px` phosphor-dim tick, the RSVP focal
word — Archivo 600 `text-3xl sm:text-[2.25rem]` in Focus White with the phosphor glow
text-shadow on a `rounded-md px-5 py-2` glass plate — and a `h-px w-10` phosphor reticle
underline carrying the glow as box-shadow. Row 3 (center, `pb-3`): status chip (Radio icon)
"RSVP · 450 WPM · Live · EN". Chip recipe (`CHIP`): `rounded-[3px] px-2 py-1 font-mono
text-[10px] tracking-[0.22em]`, color phosphor, background HUD glass, text-shadow glow.
Words cycle every **320ms** while progress is within 0.34–0.60. Entrance: staggered springs
(stiffness 120, damping 20; delays 0.05/0.12/0/0.18, y 6→0); exits are plain 0.14s fades.
Pointer parallax: springs (stiffness 60, damping 18) on ±12px X / ±10px Y. All HUD strings
come from `GLASSES_CONTENT.hud` and `pov.words`.

### InfoPanels
**Role:** Four crossfading spec/detail panels over the deep background while the glasses
park at mid-bottom. Container `z-20` pointer-events-none; each panel `absolute inset-x-0
top-[26%] max-w-2xl px-6 text-center`. Band math: `BASE = 0.74`, `SPAN = 0.065`; panel *i*
occupies `[0.74 + i·0.065, 0.74 + (i+1)·0.065]` with opacity keyframes at
`[start+0.004, start+0.022, end−0.022, end−0.004]` → dead zones at every boundary so two
panels are never visible together; the last panel stays pinned at 1. Entrance Y 28→0 over
the fade-in. Anatomy: Archivo 800 uppercase title (`text-3xl sm:text-4xl leading-[1.02]`
white), Hanken body (`text-white/70 max-w-lg`, `mt-4`), then spec rows (`mt-6`, wrap,
`gap-x-6 gap-y-2`): DM Mono `text-xs uppercase tracking-[0.18em]`, key in gold `#e3b341`,
value in `text-white/55`. Content: `GLASSES_CONTENT.info` (ids `info-why`,
`info-approach`, `info-platform`, `info-join`).

### Reveal section
**Role:** The resolve headline between the HUD beat and the panels, on charcoal.
`absolute inset-x-0 top-[16%] z-20 text-center`, pointer-events-none. Archivo 800
`text-4xl sm:text-6xl leading-[0.95]` white headline + Hanken `text-white/65 max-w-md`
sub. Opacity `[0.60, 0.64, 0.70, 0.74] → [0, 1, 1, 0]`; Y 24→0 over 0.60→0.64. Copy:
`GLASSES_CONTENT.reveal`.

### NextProjectCard
**Role:** End-of-experience handoff (shared `components/ui/NextProjectCard.tsx`, rendered
`tone="dark"`). Appears bottom-center (`bottom-[8%] z-20`) over progress 0.955→0.975.
Bordered card `rounded-lg border-white/20 px-8 py-5`, hover `border-white`; mono eyebrow
`text-[11px] tracking-[0.2em] text-white/50`; Archivo 700 `text-xl uppercase` title with
an arrow that translates +4px on hover. Target: `GLASSES_CONTENT.next`.

### EscapeHatch
**Role:** "← DIGITAL" back-link (shared `components/ui/EscapeHatch.tsx`, `tone="light"`
here). `fixed left-6 top-6 z-50`, DM Mono `text-[11px] uppercase tracking-[0.2em]
text-ink/70 hover:text-ink`. Fades out (500ms opacity transition, pointer-events off)
while page scroll fraction is between 0.08 and 0.90, returns near the end.

### FloatingDecor
**Role:** Six whimsical outlined SVG shapes (spark, leaf, arc, dots) floating around the
hero — hand-drawn tech marginalia on the paper world. Layer `z-10`. Stroke-only, weights
1.0–1.3, colors `#16161a`, `#d8412f`, `#e3b341`, `#6f6654`; sizes 52–78px at fixed
percentage positions. Each loops `y: [0, −range, 0]` (ranges 16–26px) + `rotate: [0,6,0]`
over 5.0–6.8s ease-in-out with 0–1.1s delays; hover springs to scale 1.25 / rotate 12°
(stiffness 300, damping 12). The set fades out over progress 0.16→0.32 and scales to 0.2
over 0.18→0.34. Hero-only — never present in dark phases.

---

## Motion & Interaction

- **Lenis:** `new Lenis({ lerp: 0.1, smoothWheel: true })`, driven by a rAF loop. Skipped
  entirely when `prefers-reduced-motion: reduce` (native scroll instead). Exposed as
  `window.__lenis` for deterministic E2E jumps.
- **Scroll binding:** `useScroll({ target: containerRef, offset: ['start start',
  'end end'] })` over the `h-[460vh]` pin track; `scrollYProgress` (0..1) drives every
  overlay via `useTransform` and is mirrored into `progressRef` for the R3F scene.
- **Background color track:** progress `[0, 0.16, 0.30, 0.42, 0.80]` →
  `[paper, paper, dusk, charcoal, deep]`.
- **Panel snap:** active only past `PANEL_CENTERS[0] − 0.03`, only when Lenis exists, never
  mid-glide. `PANEL_CENTERS = [0.7725, 0.8375, 0.9025, 0.9675]` (BASE 0.74 + SPAN/2 +
  i·0.065). Hysteresis `HYST = 0.008`; drifting past it advances to the next/previous
  center in the scroll direction, otherwise re-centers. Glides: `lenis.scrollTo` duration
  0.9s with a 1100ms snap lockout; nav jumps use duration 1.4s with a 1500ms lockout and
  land on panel centers (`NAV_TARGET`; fallback 0.78).
- **3D scene binding:** the model lerps toward scroll targets at 60fps with frame-rate-
  independent damping `k = 1 − 0.001^delta`. Keyframe stops `[0, 0.15, 0.40, 0.50, 0.60, 1]`
  drive Y `[0.15, 0.15, 0.12, 0.10, −0.40, −1.30]`, Z `[0, 0, 0.5, 0.7, 0.4, 0.5]`, tilt-X
  `[0.12, 0.12, 0, 0, 0.2, 0.24]`, scale `[0.95, 0.95, 1.02, 1.06, 0.90, 0.72]`, eased by
  smoothstep between stops. Hero X offset `1.7 × wideness` (wideness =
  `clamp((aspect − 0.8) × 1.6, 0, 1)`) collapses to center over 0.15→0.40 while a full
  2π swirl unwinds; a POV "fly-out" lifts the model +5.5 Y / +1.2 Z across 0.32→0.60 (the
  wearer is wearing them); parked sway `sin(t·0.5) × 0.12` after ~0.62. Idle float
  `sin(t·1.1) × 0.07` and pointer parallax fade out by 0.70.
- **Beat map (opacity ranges):** hero 1→0 over 0.10–0.18; cue gone by 0.06; decor
  0.16–0.32; POV layer 0.30–0.36 in / 0.55–0.60 out (clear crossfade 0.40–0.50); HUD
  0.34–0.40 in / 0.56–0.60 out; in-lens glimpse 0.60–0.72; reveal 0.60–0.74; panels
  0.744–1; next card 0.955–0.975.
- **Reduced motion:** Lenis off (no smoothing, no snap glides); HUD parallax off and its
  staggered springs collapse to plain opacity fades. The scroll-progress fades themselves
  still run (they are scrubbed by scroll position, not time).

---

## Do's and Don'ts

### Do
- Keep all copy in `lib/data/experiments/glasses.ts` (`GLASSES_CONTENT`); components render
  data only.
- Reserve phosphor green (`rgba(127,230,163,…)`) strictly for the HUD overlay and the
  in-lens glimpse texture.
- Use the glow token (`--hud-glow`) as `text-shadow` on phosphor text and the fringe token
  only on the HUD brackets — glow says "projected", fringe says "lens".
- Keep the hero a split layout: copy in the left column, glasses offset right — copy never
  sits under the device.
- Keep `#d8412f` limited to CTA hover fill (site accent rule) plus its two decor strokes.
- Drive every new beat from `scrollYProgress` ranges; if it enters the panels zone, align
  it to the `PANEL_CENTERS` / band dead-zone math so crossfades never overlap.
- Keep the 3D scene self-contained: local PMREM RoomEnvironment lighting only, assets under
  `/public/assets/experiments/glasses/`.
- Gate smoothing, parallax, and spring staggers behind `prefers-reduced-motion`.

### Don't
- Don't use phosphor green, HUD glass, or the fringe anywhere in the world layer (nav,
  hero, panels, decor).
- Don't add a drei `<Environment preset>` or any CDN-fetched HDR/texture — it breaks the
  static-export/offline contract.
- Don't let two info panels be visible simultaneously — respect the boundary dead zones
  (both at opacity 0 at every band edge).
- Don't hard-code copy, WPM values, or spec rows into components.
- Don't give the parked glasses a continuous spin — end-state motion is the bounded
  `sin(t·0.5)·0.12` sway only.
- Don't place long-form text over the POV imagery without the scrim + radial lens-window
  treatment (contrast is engineered, not incidental).
- Don't change the pin-track height (`460vh`) or `STOPS` without re-deriving every beat
  range, `PANEL_CENTERS`, and `NAV_TARGET` together.
- Don't introduce new fonts; this page uses only the site trio (Archivo, Hanken Grotesk,
  DM Mono).

---

## Surfaces

| Level | Name | Value | Purpose |
|---|---|---|---|
| 0 | Paper world | `#e9dfc8` | Hero stage; warm book-page ground |
| 0 | Dusk / Charcoal / Deep | `#6f6654` / `#111827` / `#0b0e16` | Scroll-driven darkening of the same stage |
| 0+ | Sweep + grain | radial `rgba(255,255,255,0.28)→rgba(0,0,0,0.22)` at 60%; SVG fractal noise at 0.05 overlay | Keeps every beat from reading as a flat fill |
| 1 | POV scene | imagery at `saturate(0.7) brightness(0.62)` + `#0b0e16/45` scrim + radial lens window | The wearer's reading world |
| 2 | HUD glass | `rgba(6,10,8,0.55)` | Chip and focal-word backing plates |
| 3 | Nav pill | `bg-white/70` + `backdrop-blur-md`, `border-black/80` | The one frosted surface, fixed above everything |
| 2 | Panels / cards | none (type sits directly on Deep); next card `border-white/20` | Dark-phase content is borderless typography |

---

## Elevation

Depth on this page is expressed by light, not shadow. There are no box-shadow elevations
anywhere; the only "shadows" are the phosphor glow (`--hud-glow`) and chromatic fringe
(`--hud-fringe`), which signify projected HUD light. Layering is literal z-index stagecraft:
POV world `z-0`, sweep/grain `z-[1]`, 3D canvas `z-[2]`, decor `z-10`, text overlays `z-20`,
HUD `z-30`, nav/escape hatch `z-50`. Separation on the dark phases comes from the radial
scrim and opacity tiers of white; on the paper phase from ink contrast and the frosted nav
pill. Do not add drop shadows to panels or cards.

---

## Imagery

- **3D model:** the `Sunglasses.fbx` asset (single kept mesh `Large_Framed_Glasses_`),
  normalized to a 2.7-unit fit, re-materialed in code: dark acetate physical material
  (`#17171c`, clearcoat 1) and cool translucent lenses (`#2a3a3f`, transmission 0.85). FBX
  texture fetches are redirected to a 1×1 blank PNG — materials are always authored in code.
  `?model=vuzix` swaps in the hi-poly Vuzix FBX for A/B comparison.
- **POV imagery:** `/assets/experiments/glasses/BookBG_Blurry.png` and `BookBG_Clear.png`,
  full-bleed object-cover, always shown muted (`saturate(0.7) brightness(0.62)`) under the
  scrim + lens-window radial. The blur-to-clear pair IS the product story — never show the
  clear image without the crossfade.
- **Decorative art:** stroke-only inline SVGs (no fills, 1.0–1.3 weight) in the four decor
  ink/accent colors. No raster decoration, no photography outside the POV beat.

---

## Layout

- **Page model:** one `h-[460vh]` pin track containing a single `sticky top-0 h-screen`
  stage; every component is absolutely positioned inside the stage and choreographed by
  scroll progress. No stacked sections, no in-page anchors (nav "anchors" are progress
  fractions).
- **Section map (scroll progress):**
  - 0–0.18 — Hero on paper (split layout, decor afloat, cue at bottom)
  - 0.15–0.40 — Transition: glasses swirl to center, paper → dusk, decor exits by 0.32
  - 0.30–0.60 — POV beat on charcoal: book world in (0.30–0.36), blur→clear (0.40–0.50),
    HUD live (0.34/0.40–0.56/0.60)
  - 0.60–0.74 — Resolve: glasses fly back with in-lens glimpse (0.60–0.72), reveal headline
  - 0.74–1.0 — Deep phase: four panels at centers 0.7725 / 0.8375 / 0.9025 / 0.9675 with
    scroll snapping; next card 0.955–0.975
- **Breakpoints:** effectively one breakpoint, Tailwind `sm` (640px). Below it the hero
  stacks top-center (`max-sm:pt-[16vh] max-sm:text-center`) and headline sizes drop one
  step; the HUD is fluid (`min(76vw, 540px)`); the 3D hero X-offset collapses continuously
  via the viewport-aspect `wideness` factor rather than a media query.

---

## Agent Prompt Guide

### Quick Color Reference
- Paper (hero bg): `#e9dfc8` · Dusk: `#6f6654` · Charcoal: `#111827` · Deep: `#0b0e16`
- Gold accent (spec keys): `#e3b341` · CTA hover red: `#d8412f`
- HUD phosphor: `rgba(127,230,163,0.95)` · dim: `rgba(127,230,163,0.5)` · glass:
  `rgba(6,10,8,0.55)` · focus word: `#ffffff`
- Glow: `0 0 6px rgba(127,230,163,0.55), 0 0 18px rgba(127,230,163,0.22)`
- Fringe: `1px 0 0 rgba(255,80,80,0.28), -1px 0 0 rgba(90,130,255,0.28)`

### Example Component Prompts
1. "Build a HUD chip for the smart-reading page: DM Mono 10px uppercase,
   letter-spacing 0.22em, color `rgba(127,230,163,0.95)`, background `rgba(6,10,8,0.55)`,
   `rounded-[3px] px-2 py-1`, text-shadow `0 0 6px rgba(127,230,163,0.55), 0 0 18px
   rgba(127,230,163,0.22)`, tabular-nums, with an 11px lucide icon at gap-1.5."
2. "Add a fifth info panel: absolute `inset-x-0 top-[26%] max-w-2xl text-center`; Archivo
   800 uppercase `text-3xl sm:text-4xl leading-[1.02]` white title; Hanken `text-base
   leading-relaxed text-white/70 max-w-lg` body; spec rows in DM Mono `text-xs uppercase
   tracking-[0.18em]` with keys in `#e3b341` and values `text-white/55`. Recompute the
   band math (`BASE 0.74`, `TOTAL 5`) and `PANEL_CENTERS`, and keep the boundary dead
   zones (`±0.004/±0.022`)."
3. "Restyle the hero CTA to match this page: `rounded-full bg-black px-6 py-2.5`, Archivo
   700 `text-sm` uppercase tracking-tight white, `hover:bg-[#d8412f]` color transition
   only — no shadows, no scale on the hero CTA."
4. "Create a floating decor shape: stroke-only SVG (strokeWidth 1.3, no fill) in
   `#16161a`, `#d8412f`, `#e3b341`, or `#6f6654`; loop `y: [0, -range, 0]` and
   `rotate: [0, 6, 0]` over 5–7s easeInOut; hover spring scale 1.25 / rotate 12 (stiffness
   300, damping 12); fade the layer out over scroll progress 0.16→0.32."
5. "Add an ambient readout to the HUD top row: reuse the CHIP recipe, stagger it in with a
   spring (stiffness 120, damping 20, delay ~0.12, y 6→0), exit as a 0.14s fade, and fall
   back to plain opacity fades under prefers-reduced-motion."

---

## Scale Philosophy

The scale is a two-voice system: compressed Archivo display (uppercase, tracking-tight,
sub-1.0 line heights — 0.92 hero, 0.95 reveal, 1.02 panels) against small, widely-tracked
DM Mono data (10–12px, 0.18–0.3em tracking). Body copy sits at a single fixed 16px
(`leading-relaxed`) everywhere. Responsive sizing is stepwise at the one `sm` breakpoint —
not fluid `clamp()` — and each display role moves exactly one Tailwind step. Agents must
not: introduce intermediate display sizes, loosen display line heights above the values
listed, apply display tracking to body text, exceed 12px on any mono label, or add
`clamp()`-based fluid type — the stepped scale is intentional and matched to the beat
choreography.

---

## Quick Start

### CSS Custom Properties

```css
:root {
  /* World palette */
  --glasses-paper: #e9dfc8;
  --glasses-paper-edge: #d9cba6;
  --glasses-dusk: #6f6654;
  --glasses-charcoal: #111827;
  --glasses-deep: #0b0e16;
  --glasses-accent: #e3b341;
  --glasses-signal-red: #d8412f;
  --glasses-ink: #000000;
  --glasses-decor-ink: #16161a;
  --glasses-white: #ffffff;

  /* HUD family */
  --hud-phosphor: rgba(127, 230, 163, 0.95);
  --hud-phosphor-dim: rgba(127, 230, 163, 0.5);
  --hud-focus: #ffffff;
  --hud-glass: rgba(6, 10, 8, 0.55);
  --hud-glow: 0 0 6px rgba(127, 230, 163, 0.55), 0 0 18px rgba(127, 230, 163, 0.22);
  --hud-fringe: 1px 0 0 rgba(255, 80, 80, 0.28), -1px 0 0 rgba(90, 130, 255, 0.28);

  /* Fonts (loaded site-wide in app/layout.tsx) */
  --font-display: 'Archivo', system-ui, sans-serif;       /* 500-800 loaded; 600-800 used */
  --font-body: 'Hanken Grotesk', system-ui, sans-serif;   /* 400-600 loaded; 400 used */
  --font-mono: 'DM Mono', ui-monospace, monospace;        /* 400-500 loaded; 400 used */

  /* Type scale (mobile → sm) */
  --type-hero: 48px;            /* sm: 72px; line-height 0.92 */
  --type-reveal: 36px;          /* sm: 60px; line-height 0.95 */
  --type-panel-title: 30px;     /* sm: 36px; line-height 1.02 */
  --type-hud-word: 30px;        /* sm: 36px */
  --type-next-title: 20px;
  --type-body: 16px;            /* line-height 1.625 */
  --type-povwall: 15px;         /* line-height 1.7 */
  --type-nav: 14px;
  --type-eyebrow: 12px;         /* tracking 0.26em */
  --type-cue: 12px;             /* tracking 0.3em */
  --type-spec: 12px;            /* tracking 0.18em */
  --type-micro: 11px;           /* tracking 0.2em */
  --type-hud-chip: 10px;        /* tracking 0.22em */

  /* Layout */
  --track-height: 460vh;
  --panel-base: 0.74;
  --panel-span: 0.065;
  --snap-hysteresis: 0.008;
}
```

---

## Governance

- This document is **authoritative for `/projects/smart-reading` only** (implemented in
  `components/experiments/glasses/` with content in `lib/data/experiments/glasses.ts`).
  The root `DESIGN.md` (industrial-studio system) governs every other route; where the two
  conflict on this page, this document wins.
- Any change beyond token-faithful adjustments — new colors, new type roles, altered beat
  ranges/`PANEL_CENTERS`, new sections, model or lighting changes — requires explicit
  **Head Designer approval BEFORE implementation**.
- Agents must read this document in full before touching this page's UI, and must keep it
  in sync: if code values change with approval, update the corresponding token/spec here in
  the same commit.
- Copy changes go through `lib/data/experiments/glasses.ts` (and the brand-voice process
  noted there) — never inline in components.
