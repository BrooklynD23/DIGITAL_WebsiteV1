# Modular Smartphone Page — Style Reference

> An engineering bench at midnight: navy glass, schematic strokes, and seven signal colors calling out the subsystems of a phone laid open.

**Theme:** dark

The `/projects/modular-smartphone` experience is a self-contained, dark-technical design system deliberately isolated from the site's root "industrial studio" theme. Its register is the *engineering bench*: a deep navy canvas (`#0F172A`) on which a wireframe smartphone schematic is drawn in thin slate and off-white strokes, exploded apart, and reassembled as the visitor scrolls. Color is informational, never decorative — a single indigo (`#818CF8`) carries every call to action and focus ring, while exactly seven subsystem accents (red through amber) identify the seven engineering disciplines of the build, one at a time. Typography is loud and disciplined: extrabold uppercase Archivo display headlines with tight negative tracking sit against small, widely-tracked DM Mono eyebrows and spec lines, echoing silkscreen labels on a PCB. Surfaces stay flat and line-drawn; depth comes from soft accent glows and one large drop shadow under the schematic. One — and only one — section flips to light mode ("Build scope") as a deliberate contrast beat before the dark reassembly finale.

---

## Tokens — Colors

### Base palette

| Name | Value | Token | Role |
|------|-------|-------|------|
| Navy canvas | `#0F172A` | `--phone-bg` | Page background; also dark text on indigo CTA buttons and the light section |
| Panel | `#1E293B` | `--phone-panel` | Dark SpecCard background |
| Raised | `#334155` | `--phone-raised` | Raised/hover surface (reserved); light-section body text |
| Text | `#F1F5F9` | `--phone-text` | Primary text; brightest schematic strokes; light section background |
| Text dim | `#94A3B8` | `--phone-text-dim` | Eyebrows, labels, inactive ticks, default schematic stroke |
| Body text | `#CBD5E1` | `--phone-text-body` | Paragraph copy, bullets, spec-line text on dark surfaces |
| CTA / Interactive | `#818CF8` | `--phone-cta` | Primary CTA fill, focus rings, default accent dots, hero glow |
| Light dim text | `#475569` | `--phone-light-dim` | Eyebrow/label text inside the light Build Scope section |
| Light border | `#CBD5E1` | `--phone-light-border` | Borders on the light SpecCard variant |
| Hairline | `rgba(255,255,255,0.10)` | `--phone-hairline` | Section dividers (`border-white/10`), card borders on dark |

The first six values are set as CSS custom properties on the page root in
`components/phone-v2/PhoneV2Experience.tsx` (constants `DARK_BG`, `PANEL`, `RAISED`,
`TEXT`, `TEXT_DIM`, `CTA`); the rest appear as literal Tailwind arbitrary values.

### Subsystem accents (7)

| Name | Value | Token | Role |
|------|-------|-------|------|
| Systems Architecture | `#F87171` | `--phone-accent-architecture` | Section 01 accent |
| Hardware / PCB | `#FBBF24` | `--phone-accent-hardware` | Section 02 accent; also route-level "warning" |
| Firmware / Embedded | `#4ADE80` | `--phone-accent-firmware` | Section 03 accent; also route-level "success"; secondary hero/CTA glow |
| Operating System | `#22D3EE` | `--phone-accent-os` | Section 04 accent |
| Apps / UX | `#60A5FA` | `--phone-accent-apps` | Section 05 accent |
| Mechanical / CAD | `#C084FC` | `--phone-accent-mechanical` | Section 06 accent |
| Integration / Testing | `#FACC15` | `--phone-accent-testing` | Section 07 accent |

Accent hexes are defined once, in `lib/data/phoneV2.ts` (the `PhoneSectionAccent`
union type and each entry's `accent` field). Each accent colors, for its own section
only: the `01 / 07` index eyebrow, bullet dots, SpecCard dot, schematic highlight
stroke, and the active part glow. The schematic line-art itself stays `#94A3B8` /
`#F1F5F9` at all times; accents touch only highlighted parts.

*(This table absorbs root `DESIGN.md` §15 "Subsystem Accent Scale" in full,
including its usage rule: these values are scoped to `/projects/modular-smartphone`
only and must never leak into `/`, `/projects`, `/pillars`, or any shared component.)*

---

## Tokens — Typography

### Archivo (display)

- **Role:** All headlines, section titles, and button labels. Always uppercase, tight negative tracking, sub-1.0 line height.
- **Loaded via:** `next/font/google` in `app/layout.tsx`, exposed as `font-display`; substitute stack `system-ui, sans-serif`.
- **Weights loaded:** 500, 600, 700, 800. This page uses **800 (extrabold)** for hero/loader/subsystem/final headlines, **700 (bold)** for toolbox/HUD/build-scope headings, **600 (semibold)** for button labels.
- **Sizes used:** `clamp(48px,10vw,150px)` loader wordmark; `clamp(44px,7vw,100px)` hero; `clamp(40px,7vw,92px)` final CTA; `clamp(32px,4.8vw,68px)` subsystem titles; `clamp(30px,5vw,58px)` toolbox; `clamp(28px,4.8vw,56px)` build scope; `clamp(28px,3vw,42px)` HUD title; 13px buttons.

### Hanken Grotesk (body)

- **Role:** Default body text — paragraph copy, sublines, descriptions (inherited; no explicit `font-body` class appears in the phone-v2 files).
- **Loaded via:** `next/font/google`, `font-body`; substitute stack `system-ui, sans-serif`.
- **Weights loaded:** 400, 500, 600; this page uses 400 (regular) for all paragraphs.
- **Sizes used:** 17px (hero subline ≥ md), 16px (section descriptions), 15px (HUD/mobile descriptions, loader subline), 14px (SpecCard lead).

### DM Mono (mono)

- **Role:** Technical register — eyebrows, spec lines, scrubber labels, section indices (`01 / 07`), support line, escape hatch. Always uppercase with wide tracking.
- **Loaded via:** `next/font/google`, `font-mono`; substitute stack `ui-monospace, monospace`.
- **Weights loaded:** 400, 500; this page uses 400.
- **Sizes used:** 10px (eyebrows, scrubber), 11px (spec lines, taglines, support line, escape hatch).

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| Loader wordmark | `clamp(48px,10vw,150px)` | 0.85 | -0.04em | `--phone-type-wordmark` |
| Hero headline | `clamp(44px,7vw,100px)` | 0.88 | -0.05em | `--phone-type-hero` |
| Final CTA headline | `clamp(40px,7vw,92px)` | 0.88 | -0.05em | `--phone-type-final` |
| Subsystem title | `clamp(32px,4.8vw,68px)` | 0.9 | -0.05em | `--phone-type-subsystem` |
| Toolbox headline | `clamp(30px,5vw,58px)` | 0.9 | -0.04em | `--phone-type-section` |
| Build-scope headline | `clamp(28px,4.8vw,56px)` | 0.92 | -0.04em | `--phone-type-section-alt` |
| Mobile stage headline | `clamp(28px,5vw,52px)` | 0.92 | -0.04em | `--phone-type-mobile-stage` |
| Mobile card title | `clamp(30px,6vw,44px)` | 0.92 | -0.04em | `--phone-type-mobile-card` |
| HUD title | `clamp(28px,3vw,42px)` | 0.95 | -0.02em | `--phone-type-hud` |
| Body large | 17px (md), 16px base | 1.6 | normal | `--phone-type-body-lg` |
| Body | 15px | 1.55 | normal | `--phone-type-body` |
| SpecCard lead | 14px | 1.55 | normal | `--phone-type-lead` |
| Button label | 13px | (flex-centered) | 0.04em | `--phone-type-button` |
| Spec line / tagline | 11px | (default) | 0.18em (0.16em mobile bullets; 0.24em loader tagline; 0.2em escape hatch) | `--phone-type-specline` |
| Eyebrow / scrubber | 10px | (default) | 0.24em (0.28em hero eyebrow) | `--phone-type-eyebrow` |

---

## Tokens — Spacing & Shapes

- **Density:** Generous editorial spacing. Sections use `py-16` (64px) standard, `py-20` (80px) final CTA, `py-10` (40px) hero/loader vertical padding.
- **Horizontal gutters:** `px-6` (24px) base → `md:px-8` (32px) → `lg:px-10` (40px).
- **Content max width:** `max-w-[1360px]` for every section container (wider than the site-wide 1180px `max-w-content` — intentional).
- **Vertical rhythm within blocks:** eyebrow → headline `mt-4`–`mt-6`; headline → description `mt-3`–`mt-5`; description → bullets/CTAs `mt-4`–`mt-8`; grid gaps `gap-8`/`gap-10` (subsystem columns `md:gap-8 lg:gap-12`, HUD/spec pair `gap-6`).
- **Measure caps:** copy is width-limited in characters — `max-w-[34ch]` (descriptions), `[36ch]`, `[38ch]`, `[40ch]`, `[28ch]` (loader tagline), `[46ch]` (support line), `[12ch]` (big headlines forced to wrap).
- **Border radius:** `4px` buttons (`rounded-[4px]`); `10px` cards (`rounded-[10px]` SpecCard, mobile subsystem cards); `rounded` (4px) spec-line chips; `rounded-full` dots, ticks, HUD rings. Schematic rects use SVG `rx` of 10–40.
- **Dots & ticks:** accent bullets `size-1.5` (6px); SpecCard dot `size-2` (8px); scrubber ticks `h-2 w-2` (8px) or `h-1.5 w-1.5` compact; HUD center pupil `size-1.5` inside a `size-5` ring.
- **Borders:** 1px everywhere; `border-white/10` hairlines on dark, `border-white/14` ghost buttons (hover `/24`), `#CBD5E1` on light.

---

## Components

### Loader

**Role:** Full-screen boot sequence overlay shown once on entry (skipped entirely under reduced motion).

Fixed overlay, `z-[60]`, `#0F172A` background with a layered radial highlight (`rgba(255,255,255,0.06)` at 50% 30%) over a near-opaque navy vertical gradient. Content column max-w-6xl: a giant Archivo extrabold wordmark ("DIGITAL", `clamp(48px,10vw,150px)`, leading 0.85, tracking -0.04em), a DM Mono 11px tagline at `tracking-[0.24em]` in `#94A3B8`, a 15px `#CBD5E1` subline, a compact TickScrubber whose active tick and progress mirror the SVG draw progress (7 ticks), and the PhoneSchematicSvg (max-w-[860px]) with front-glass + display-panel active, un-assembled at progress 0. Four outline groups (front glass, display panel, midframe, back cover) are line-drawn via anime.js `svg.createDrawable`. Any wheel, scroll, keydown, or pointerdown skips it: timeline pauses and the overlay fades out over 220ms `out(3)`, after which the page root pulses opacity 0.96→1 (220ms `out(3)`).

### Hero

**Role:** First viewport — split pitch + exploded schematic.

`min-h-[100svh]` section on `#0F172A` with two faint radial glows baked into the background: indigo `rgba(129,140,248,0.13)` at 70% 30% and green `rgba(74,222,128,0.08)` at 20% 80%. Split layout at `md:`: text column `md:w-[40%]` (max-w-[38rem]), schematic column `md:w-[60%]`. Text stack: 10px mono eyebrow at `tracking-[0.28em]` `#94A3B8` → three-line stacked headline (each line a block span; `clamp(44px,7vw,100px)`, extrabold, uppercase, leading 0.88, tracking -0.05em) → 16/17px `#CBD5E1` subline capped at 34ch → two CTAs. Primary CTA: solid `#818CF8` fill, navy `#0F172A` text, `rounded-[4px]`, `px-5 py-3`, Archivo 13px semibold uppercase `tracking-[0.04em]`, hover lifts `-translate-y-0.5` (200ms ease-out), indigo focus ring offset against navy. Secondary CTA: ghost — `border-white/14 bg-white/5`, hover `border-white/24 bg-white/10`. Schematic renders at progress 0.96 (near fully exploded) with glass/screen-ui/display active; a TickScrubber (7/7, progress 1) floats at its top-right, hidden below `md`.

### TickScrubber

**Role:** Progress indicator — a row of dot "ticks" plus a mono label/detail pair, right-aligned.

`pointer-events-none`, `role="img"` with a combined aria-label. Ticks are `rounded-full` dots: `#F1F5F9` when index ≤ activeIndex, `#94A3B8` at 45% opacity otherwise, with a secondary opacity ramp driven by normalized progress; all transitions 300ms ease-out. Sizes: 8px default, 6px `compact`. Below the ticks: label in `#F1F5F9`, optional detail line in `#94A3B8`, both DM Mono 10px uppercase `tracking-[0.24em]`. Used in the loader (compact, draw-progress), hero (static 7/7), and subsystem stage (per-section label + `01 / 07` detail).

### HUD

**Role:** Decorative "lens" reticle with a labeled spec block beneath — the toolbox section's visual anchor.

A square frame (max-w-[440px], `aspect-square`) built from concentric pure-CSS rings: outer `rounded-full` circle with `border-[#94A3B8]/30` and a radial sheen (white 6% → navy fade), an inner ring inset 12% at `border-[#F1F5F9]/15`, vertical + horizontal crosshairs (`#94A3B8`/35, 62% span, 1px), a dashed orbit circle (64%, `border-dashed border-[#94A3B8]/20`), a 20px center ring at `#F1F5F9`/70, and a 6px accent-colored pupil. Below (`mt-5`, max-w-[34ch]): 10px mono label, Archivo bold HUD title (`clamp(28px,3vw,42px)`, leading 0.95, tracking -0.02em), 15px `#CBD5E1` description, then mono 11px `tracking-[0.18em]` bullet list with 6px accent dots.

### SpecCard

**Role:** Machine-readout side card — heading dot, optional lead sentence, and stacked mono "spec line" chips.

`<aside>` with `rounded-[10px]`, 20px padding (`p-5`), and shadow `0 16px 40px rgba(2,6,23,0.16)`. Dark variant (default): `bg-[#1E293B]`, `border-white/10`, text `#F1F5F9`; heading in mono 10px `tracking-[0.24em]` `#94A3B8`; each line a `rounded` chip with `border-white/10 bg-white/[0.02]` and `#CBD5E1` mono 11px `tracking-[0.18em]` text. Light variant (`dark={false}`, Build Scope only): white background, `#CBD5E1` borders, `#0F172A` heading text, `#475569` label, `#334155` line text. An 8px accent dot sits beside the heading. `collapsed` mode (mobile stage) shows only the first line. The card never uses accent for text — only the dot.

### SubsystemStage

**Role:** The signature scrollytelling section (`#phone-systems`) — seven pinned beats, one per engineering subsystem.

Desktop (`md:` and up): the container stretches to `md:min-h-[700svh]` (7 × 100svh). Two-column grid `[minmax(0,0.47fr)_minmax(0,0.53fr)]`. Left column: seven `<article>`s, each `min-h-[100svh]`, flex-centered, separated by `border-white/5`. Right column: a `sticky top-0 h-[100svh]` panel containing the TickScrubber (top-right), the PhoneSchematicSvg at progress 0.68, and a SpecCard (max-w-[340px], right-aligned, `mt-6`) whose heading/lines/accent swap per active section. An anime.js timeline synced to scroll (`onScroll` enter `'top top'`, leave `'bottom bottom'`, `sync: true`) maps scroll progress → `activeIndex` (0–6).

**Accent switching:** each section's `accent` comes from its entry in `lib/data/phoneV2.ts`. On the active section only: the `01 / 07` index eyebrow takes the section accent (inactive sections' eyebrows fall back to `#94A3B8`), bullet dots take it, the SpecCard dot takes it, and the schematic receives it as its highlight color. Inactive articles dim to opacity 0.48 (upcoming) or 0.34 (past); active is 1; content transitions 700ms ease-out.

**Part highlighting:** each section lists `activePartIds` (2 SVG group ids from the 14-part schematic). On section change, active parts animate opacity 0.65→1 (640ms, `out(3)`, stagger 40ms) and inactive parts 0.9→0.58 (520ms, `out(3)`, stagger 18ms); active parts get the accent stroke and an accent glow `drop-shadow(0 0 20px {accent}66)`.

### PhoneSchematicSvg

**Role:** The page's single illustration — a 920×760 viewBox exploded wireframe smartphone made of 14 named part groups (back cover, display panel, midframe, front glass, screen UI, main PCB, battery, camera module, antenna module, speakers, buttons, haptics, flex cables, screws).

Pure line art: strokes `#94A3B8` (default part) or `#F1F5F9` (bright detail lines at opacities 0.42–0.96), 1–1.7px width with `vectorEffect="non-scaling-stroke"`. Active parts swap their primary stroke to the current accent; small filled circles (camera lenses, PCB test point, screen status dot, all six screws) fill with the accent at 0.78–0.9 opacity. The only fill surface is the back cover's `phone-v2-surface` linear gradient (`#F1F5F9` 18% → `#94A3B8` 4%); an embedded style rule collapses fills on inactive parts to `fill-opacity: 0.08`. Each part carries a hand-tuned explode transform (translate up to ±194px, rotate ±17°, scale ≤1.04) multiplied by the `progress` prop; active parts spread 1.2× further and scale 1.18×. `assembled` zeroes all transforms. The whole SVG wears `drop-shadow(0 38px 60px rgba(15, 23, 42, 0.45))`. Part opacity/filter transitions run 420ms ease-out. A `mobile` prop restricts rendering to 5 parts (front glass, screen UI, PCB, battery, back cover). The geometry is explicitly placeholder CAD, per in-file comments, to be replaced with real CAD-derived paths.

### Build Scope (light section)

**Role:** The single light-mode band — a deliberate inversion beat between the subsystem stage and the finale.

Background `#F1F5F9`, text `#0F172A`, same 1360px grid (`[minmax(0,0.44fr)_minmax(0,0.56fr)]`, `py-16`). Eyebrow in `#475569`; headline `clamp(28px,4.8vw,56px)` bold; description `#334155` capped at 34ch. The right column is the light SpecCard variant (`dark={false}`) with the indigo `#818CF8` accent dot — subsystem accents do not appear here.

### FinalCta

**Role:** Reassembly finale — the phone snaps back together as the join pitch lands.

Dark section (`py-20`) with corner glows: indigo `rgba(129,140,248,0.16)` at 25% 25%, green `rgba(74,222,128,0.10)` at 80% 75%. Grid `[minmax(0,0.52fr)_minmax(0,0.48fr)]`. Headline `clamp(40px,7vw,92px)` extrabold capped at 12ch. Three CTAs: primary solid indigo (as hero), secondary ghost, tertiary ghost without background fill whose text brightens `#CBD5E1`→`#F1F5F9` on hover. A mono 11px `#94A3B8` support line carries meeting/Discord facts from `lib/data`. The schematic (max-w-[760px], progress 0.86, no active parts) starts exploded; when the section is ≥35% visible, an IntersectionObserver fires a one-shot timeline animating every `[data-phone-part]` to translate 0 / rotate 0 / scale 1 / opacity 1 over 1050ms `inOut(3)`, staggered 45ms from center. Under reduced motion it renders assembled immediately.

### Mobile stage variant

**Role:** Below `md` (768px), the pinned scrollytelling collapses into a stacked card list.

An intro block (eyebrow / `clamp(28px,5vw,52px)` headline / description, from `phoneV2Copy.mobileStage`) precedes seven cards, each `rounded-[10px] border-white/10 bg-white/[0.03] p-4`: a mobile schematic (5 parts, progress 0.42, max-w-[420px], section accent) above the accent-colored index, `clamp(30px,6vw,44px)` title, description, accent-dotted bullets (`tracking-[0.16em]`), and a collapsed dark SpecCard. No pinning, no scroll-driven animation.

### EscapeHatch

**Role:** Shared immersive-route exit link ("← DIGITAL") — the only chrome imported from outside the page system (`components/ui/EscapeHatch.tsx`).

Fixed at `left-6 top-6`, `z-50`, DM Mono 11px uppercase `tracking-[0.2em]`. Rendered with `tone="dark"`: `text-white/70 hover:text-white`. Fades out (500ms opacity transition, pointer-events disabled) while scroll progress is between 8% and 90% of the page, returning near the end.

---

## Motion & Interaction

- **Library:** anime.js (`animate`, `createTimeline`, `stagger`, `svg.createDrawable`, `onScroll` from `'animejs'`). Supplemented by Tailwind CSS transitions.
- **Signature easings:** `out(3)` for nearly all entrances/fades; `inOut(3)` for the reassembly; `linear` for the scroll-scrub timeline; CSS `ease-out` for hover/opacity transitions.
- **Loader timing:** timeline defaults 620ms `out(3)`. Draw-on of 4 outline groups: 900ms, stagger 70ms, from t=0. Wordmark: opacity 0→1, y 12→0, 420ms at t=120ms. Tagline: y 8→0, 360ms at t=240ms. Scrubber: 360ms at t=280ms. Skip fade: 220ms. Root settle pulse after dismiss: opacity 0.96→1, 220ms.
- **Scroll pin/scrub:** SubsystemStage pins its right column with CSS `sticky top-0 h-[100svh]` inside a `md:min-h-[700svh]` track. An anime timeline with `autoplay: onScroll({ enter: 'top top', leave: 'bottom bottom', sync: true })` and one `sections.length × 1000`ms segment converts progress into a discrete `activeIndex` (`Math.floor(p × 7)`, clamped). Note: the `onUpdate` handler normalizes progress that may arrive as 0–100 (`self.progress > 1 ? self.progress / 100 : self.progress`).
- **Subsystem transitions:** on index change — active SVG parts opacity 0.65→1, 640ms `out(3)`, stagger 40ms; inactive parts 0.9→0.58, 520ms `out(3)`, stagger 18ms; text articles cross-fade via inline opacity (1 / 0.48 upcoming / 0.34 past) with 700ms ease-out on content; part glow/opacity CSS transition 420ms ease-out; scrubber ticks 300ms ease-out.
- **Reassembly (FinalCta):** IntersectionObserver threshold 0.35, one-shot; all parts to identity transform, 1050ms `inOut(3)`, stagger 45ms from center.
- **Hover:** primary CTA `-translate-y-0.5` lift, 200ms ease-out; ghost buttons border/background color shift, 200ms ease-out. Focus: 2px `#818CF8` ring with 2px offset against `#0F172A`.
- **Breakpoint behavior:** the desktop/mobile split is Tailwind `md:` — **768px** (the project defines no custom `screens`; no 820px value exists in this code). Below 768px: the subsystem stage swaps to stacked cards, the hero scrubber hides, and schematics render the 5-part mobile subset.
- **prefers-reduced-motion:** tracked live via `matchMedia` in PhoneV2Experience and re-checked defensively in stage/CTA effects. When set: the loader never mounts (immediate `onComplete`), the subsystem stage drops `min-h` pinning and the scroll timeline (activeIndex stays 0, all 14 parts shown, articles fully opaque, accents shown per-section statically), part animations are skipped, and the final phone renders assembled with no timeline.

---

## Do's and Don'ts

### Do

- Keep the page on the `#0F172A` navy canvas with `border-white/10` hairline section dividers.
- Use `#818CF8` for every CTA fill, focus ring, and default (non-subsystem) accent dot.
- Apply exactly one subsystem accent per section, sourced from that section's `accent` field in `lib/data/phoneV2.ts` — index eyebrow, bullet dots, card dot, schematic highlight all share it.
- Keep display type uppercase Archivo with negative tracking (-0.02em to -0.05em) and sub-1.0 leading; keep all technical labels DM Mono uppercase at 10–11px with 0.16–0.28em tracking.
- Draw all new schematic geometry as stroke-only line art in `#94A3B8`/`#F1F5F9` with `vectorEffect="non-scaling-stroke"`, reserving fills for accent micro-dots.
- Route every user-facing string through `lib/data/phoneV2.ts` — never hard-code copy in components.
- Preserve the full reduced-motion path (no loader, no pinning, assembled phone, all parts visible) for any new animated element.
- Use `out(3)` for entrances and `inOut(3)` for large assembly moves to stay in the page's motion voice.

### Don't

- Don't mix two subsystem accents in one view, gradient between them, or use an accent outside its own section.
- Don't add a second light section — Build Scope (`#F1F5F9`) is the single, deliberate inversion.
- Don't import industrial-studio tokens (signal red `#d8412f`, `studio`/`ink` grays) into this route, or leak these navy/indigo/accent tokens back into the rest of the site.
- Don't recolor the schematic's base line-art with accents — accents mark *active* parts only.
- Don't add photography, textures, or filled illustrations; the wireframe schematic is the page's only imagery.
- Don't use subsystem accents for body text, headings, or button fills — they are dots, index labels, and strokes only.
- Don't exceed the copy measure caps (34–46ch) or let headlines run wider than ~12ch on the big beats.
- Don't introduce a new easing curve, spring, or duration regime outside the 200–1050ms `ease-out` / `out(3)` / `inOut(3)` family.

---

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Navy canvas | `#0F172A` | Page background, loader, hero, stage, final CTA |
| 0+ | Glow wash | radial `rgba(129,140,248,.13–.16)` + `rgba(74,222,128,.08–.10)` | Ambient corner glows on hero and final CTA |
| 1 | Ghost tint | `bg-white/[0.02]`–`bg-white/[0.05]` | Spec-line chips, ghost buttons, mobile cards (`0.03`) |
| 2 | Panel | `#1E293B` | Dark SpecCard body |
| 3 | Raised | `#334155` | Reserved raised/hover surface (declared token; currently unused as a background) |
| Alt | Light band | `#F1F5F9` | Build Scope section background |
| Alt+1 | Light card | `#FFFFFF` | Light SpecCard variant on the light band |

---

## Elevation

Depth on this page is expressed almost entirely through **line, opacity, and glow — not stacked shadows**. There are exactly three shadow treatments: the schematic's single large ambient shadow (`drop-shadow(0 38px 60px rgba(15,23,42,0.45))`) that seats the phone on the bench; the SpecCard's soft card shadow (`0 16px 40px rgba(2,6,23,0.16)`); and the accent glow on active schematic parts (`drop-shadow(0 0 20px {accent}66)`), which reads as *signal*, not elevation. Everything else separates by hairline borders (`white/5`–`white/14`) and opacity steps (0.34 / 0.48 / 0.58 / 1). Hover "elevation" is a 2px translate lift on the primary CTA rather than a shadow change. Do not add layered shadow scales.

---

## Imagery

The page has **no photographs, icon sets, or raster assets**. Its only imagery is `PhoneSchematicSvg` — a hand-authored 920×760 exploded wireframe smartphone (currently placeholder CAD, per in-code comments, awaiting real CAD-derived geometry). Treatment rules, all from code:

- Stroke-only line art: `#94A3B8` for default part outlines, `#F1F5F9` for bright detail lines (opacities 0.28–0.96), widths 1–1.7px, always `vectorEffect="non-scaling-stroke"`.
- The single fill surface is the back cover's faint `#F1F5F9`→`#94A3B8` gradient; inactive parts' fills collapse to `fill-opacity: 0.08`.
- Highlight behavior: active parts swap stroke to the current accent, gain `drop-shadow(0 0 20px {accent}66)`, sit at opacity 1 while inactive parts rest at 0.58; accent-filled micro-circles (lenses, test points, screws) at 0.78–0.9 fill opacity.
- Explode behavior: per-part transforms scaled by `progress` (hero 0.96, stage 0.68, final 0.86, mobile 0.42, loader 0); `assembled` collapses all transforms.
- Mobile renders only 5 of the 14 parts.

---

## Layout

- **Page model:** one full-bleed vertical experience — Loader (overlay) → Hero (100svh) → Toolbox → SubsystemStage (700svh pinned) → Build Scope (light) → FinalCta. Dark sections chain with `border-b border-white/10`.
- **Container:** every section centers a `max-w-[1360px]` block with `px-6 / md:px-8 / lg:px-10` gutters.
- **Split ratios (all `minmax(0, fr)` grids at `md:`):** Hero 40/60 (flex widths); Toolbox 42/58, inner HUD/spec pair 46/54; SubsystemStage 47/53; Build Scope 44/56; FinalCta 52/48.
- **Section rhythm:** `py-16` standard, `py-20` finale, `py-10` hero; intra-block steps of `mt-3`–`mt-8`.
- **Breakpoints as implemented:** the only structural breakpoint is Tailwind `md` (**768px** — no custom `screens` in `tailwind.config.ts`; an 820px figure does not appear anywhere in this code). `lg` (1024px) only widens gutters and grid gaps. Below `md`: single column, stacked subsystem cards, hidden hero scrubber, 5-part mobile schematic, no pinning.
- **Pinning:** desktop subsystem stage only — CSS sticky right column inside a 7×100svh scroll track.

---

## Agent Prompt Guide

### Quick Color Reference

- Background: `#0F172A` · Panel: `#1E293B` · Raised: `#334155`
- Text: `#F1F5F9` · Body: `#CBD5E1` · Dim: `#94A3B8`
- CTA / focus / default accent: `#818CF8`
- Subsystem accents — Architecture `#F87171`, Hardware `#FBBF24`, Firmware `#4ADE80`, OS `#22D3EE`, Apps `#60A5FA`, Mechanical `#C084FC`, Testing `#FACC15`
- Light band: bg `#F1F5F9`, text `#0F172A`, dim `#475569`, borders `#CBD5E1`

### Example Component Prompts

1. **SpecCard:** "Build an `<aside>` on `#1E293B` with `border-white/10`, `rounded-[10px]`, `p-5`, shadow `0 16px 40px rgba(2,6,23,0.16)`. Top row: an 8px accent dot beside a DM Mono 10px uppercase heading at `tracking-[0.24em]` in `#94A3B8`, then an optional 14px lead in `#F1F5F9`. Below, stack `rounded` chips (`border-white/10 bg-white/[0.02]`, `px-3 py-2`) holding DM Mono 11px uppercase `tracking-[0.18em]` `#CBD5E1` spec lines."
2. **Primary CTA:** "A Next.js `Link` with `bg-[#818CF8]`, text `#0F172A`, `rounded-[4px]`, `px-5 py-3`, Archivo (`font-display`) 13px semibold uppercase `tracking-[0.04em]`; hover `-translate-y-0.5` over 200ms ease-out; `focus-visible` 2px `#818CF8` ring with 2px offset against `#0F172A`."
3. **TickScrubber:** "A `pointer-events-none` right-aligned cluster: seven 8px `rounded-full` ticks (6px in compact mode), `#F1F5F9` when index ≤ active, `#94A3B8/45` otherwise, 300ms ease-out transitions; beneath, a DM Mono 10px uppercase `tracking-[0.24em]` label in `#F1F5F9` with an optional `#94A3B8` detail line; `role='img'` with a combined aria-label."
4. **Subsystem beat (desktop):** "A `min-h-[100svh]` flex-centered article: mono 10px `tracking-[0.24em]` index `NN / 07` colored with the section accent when active (else `#94A3B8`); Archivo extrabold uppercase title `clamp(32px,4.8vw,68px)`, leading 0.9, tracking -0.05em, max 12ch; 16px `#CBD5E1` description max 34ch; bullets with 6px accent dots in mono 11px `tracking-[0.18em]`. Inactive articles dim to opacity 0.48 (upcoming) / 0.34 (past)."
5. **Hero glow layer:** "An absolute-inset backdrop on `#0F172A`: `radial-gradient(circle at 70% 30%, rgba(129,140,248,0.13), transparent 28%), radial-gradient(circle at 20% 80%, rgba(74,222,128,0.08), transparent 24%)` — no other decoration."

---

## Scale Philosophy

The type scale is **viewport-fluid at the top, fixed at the bottom**. Every display size is a `clamp(min, vw, max)` expression tuned per beat (150px loader wordmark down to 42px HUD title), so headlines scale continuously with the viewport instead of stepping at breakpoints — the *only* structural breakpoint is layout (`md`), never type size. Body and label sizes are pinned pixels (17/16/15/14/13/11/10) so spec text reads like fixed instrument labeling at any width. Hierarchy is carried by three coupled axes that move together: as size grows, tracking goes more negative (-0.02em → -0.05em) and leading drops (0.95 → 0.85); as size shrinks into mono-label territory, tracking widens dramatically (0.16em → 0.28em). Agents must not: convert clamps to breakpoint-stepped sizes, add intermediate display sizes, loosen the negative tracking on display type, apply wide mono tracking to Archivo (or vice versa), or introduce sizes outside the pinned pixel set for labels and body copy.

---

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Base palette */
  --phone-bg: #0F172A;
  --phone-panel: #1E293B;
  --phone-raised: #334155;
  --phone-text: #F1F5F9;
  --phone-text-dim: #94A3B8;
  --phone-text-body: #CBD5E1;
  --phone-cta: #818CF8;
  --phone-light-dim: #475569;
  --phone-light-border: #CBD5E1;
  --phone-hairline: rgba(255, 255, 255, 0.10);

  /* Subsystem accents */
  --phone-accent-architecture: #F87171;
  --phone-accent-hardware: #FBBF24;
  --phone-accent-firmware: #4ADE80;
  --phone-accent-os: #22D3EE;
  --phone-accent-apps: #60A5FA;
  --phone-accent-mechanical: #C084FC;
  --phone-accent-testing: #FACC15;

  /* Type scale */
  --phone-type-wordmark: clamp(48px, 10vw, 150px);
  --phone-type-hero: clamp(44px, 7vw, 100px);
  --phone-type-final: clamp(40px, 7vw, 92px);
  --phone-type-subsystem: clamp(32px, 4.8vw, 68px);
  --phone-type-section: clamp(30px, 5vw, 58px);
  --phone-type-section-alt: clamp(28px, 4.8vw, 56px);
  --phone-type-mobile-stage: clamp(28px, 5vw, 52px);
  --phone-type-mobile-card: clamp(30px, 6vw, 44px);
  --phone-type-hud: clamp(28px, 3vw, 42px);
  --phone-type-body-lg: 16px; /* 17px at >= 768px (hero subline) */
  --phone-type-body: 15px;
  --phone-type-lead: 14px;
  --phone-type-button: 13px;
  --phone-type-specline: 11px;
  --phone-type-eyebrow: 10px;
}
```

Fonts (loaded globally in `app/layout.tsx` via `next/font/google`): Archivo
(`font-display`, weights 500/600/700/800), Hanken Grotesk (`font-body`,
400/500/600), DM Mono (`font-mono`, 400/500).

---

## Governance

- **This document is the authoritative style reference for `/projects/modular-smartphone`.** When code and this document conflict for that route, this document wins.
- It **supersedes and fully absorbs root `DESIGN.md` §15 ("Subsystem Accent Scale")**; §15's route tokens, section accents, and scoping rule now live in the "Tokens — Colors" section above. Root `DESIGN.md` continues to govern **everything else** on the site — these tokens must never leak outside this route, and industrial-studio tokens must never leak in.
- **Any change beyond token-faithful adjustments** — new colors, new fonts or sizes, new motion regimes, layout restructures, a second light section, schematic restyling — **requires explicit Head Designer approval BEFORE implementation.** Token-faithful work (using existing tokens, scales, and easings exactly as specified here) may proceed without escalation.
- **Agents must read this document before touching this page's UI.** All copy changes go through `lib/data/phoneV2.ts` (currently pending human sign-off, per that file's header) — never inline strings in components.
- Source of truth for implementation: `components/phone-v2/*`, `app/projects/modular-smartphone/*`, `lib/data/phoneV2.ts`.
