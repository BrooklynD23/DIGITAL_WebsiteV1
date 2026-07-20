# DIGITAL — Design System (Source of Truth)

> **Status:** Authoritative. This document governs every UI/UX decision on the DIGITAL
> website. When code and this document disagree, **this document wins** — update the code,
> or update this document deliberately (with a note in the changelog at the bottom).

---

## 0. Purpose & Scope

This is the single source of truth for the visual and interaction design of the DIGITAL @
Cal Poly Pomona website.

The entire UI/UX is being refactored to mirror the **industrial studio aesthetic** of the
reference build in [`Refractor/hardware-teardown-site/`](./Refractor/hardware-teardown-site/index.html).
That reference was designed for the smartphone (hardware) team and is the canonical look.

Two rules govern the refactor:

1. **Text content is preserved.** All copy, facts, names, stats, project specs, pillar
   definitions, and contact details come from the current repo (`lib/data/*`, page files).
   See [§11 Content Inventory](#11-content-inventory-preserve-verbatim).
2. **UI/components/look come from `Refractor/`.** Colors, typography, spacing, components,
   effects, motion, and the signature scroll-driven teardown are derived from the reference.

Stack: **Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS 3**. The reference
is a single static HTML file; this document translates its CSS into Tailwind tokens and
React components.

### 0.1 Route-Scoped Design Systems

Three immersive routes carry deliberately isolated visual languages. Each has its own
style reference under [`docs/design/`](./docs/design/), which is **authoritative for that
route only**; this document governs everything else. Agents making UI/UX changes must read
the governing doc first, and any change beyond token-faithful adjustments requires explicit
Head Designer approval before implementation.

| Route | Style reference | Theme summary |
|-------|-----------------|---------------|
| `/` (home landing, plus subsidiary-page direction for `/contact`, `/get-involved`) | [`docs/design/landing.DESIGN.md`](./docs/design/landing.DESIGN.md) | Warm editorial — cream canvas, forest green, gold; Newsreader + IBM Plex |
| `/projects/modular-smartphone` | [`docs/design/smartphone.DESIGN.md`](./docs/design/smartphone.DESIGN.md) | Dark technical bench — navy canvas, indigo CTA, 7 subsystem accents |
| `/projects/smart-reading` | [`docs/design/glasses.DESIGN.md`](./docs/design/glasses.DESIGN.md) | Ambient wearable — paper beige, phosphor-green HUD, gold accent |

---

## 1. Design Philosophy

> *"One device. Every layer. Take it apart."*

**Industrial studio.** The site should feel like a product render in a photographer's
studio sweep — a calm, light grey backdrop, near-black hardware, and a single signal-red
accent that marks the important things (callouts, progress, the live CTA). It is the
opposite of the current blue-glow SaaS look.

Principles:

- **Studio sweep, not flat fill.** The page background is one continuous radial grey
  gradient with faint grain, so content and device renders sit in the same space with no
  visible seam.
- **Industrial typography.** Tight, uppercase, condensed grotesque headlines with negative
  tracking. Outline (stroked, transparent-fill) treatment on the keyword of each headline.
- **One accent, used sparingly.** Signal red `#d8412f` is for eyebrows, margin notes, the
  progress rail, the active nav item, and the primary CTA hover. Never decorate with it.
- **Glass, not cards-on-color.** Surfaces are translucent white with hairline borders and
  soft blur, floating over the studio sweep.
- **Motion is mechanical and meaningful.** Scroll drives disassembly; transitions are
  smooth eased glides, never bouncy or decorative.
- **Mono for instruments.** Labels, counters, captions, specs, and footer use a monospace
  face — they read like readouts on a bench instrument.

---

## 2. Design Tokens

These are the canonical values, lifted directly from
`Refractor/hardware-teardown-site/index.html` (`:root` block). They are expressed as CSS
custom properties (defined in `app/globals.css`) **and** mirrored into
`tailwind.config.ts`. Never hardcode raw hex in components — use the token.

### 2.1 Color

| Token | Hex / value | Role |
|-------|-------------|------|
| `--studio` | `#d6d4d3` | Studio sweep base — the page background |
| `--studio-lo` | `#c4c1c0` | Sweep edge (darker, bottom) |
| `--studio-hi` | `#eceae9` | Sweep highlight (center light) |
| `--ink` | `#16161a` | Near-black — primary text, device, borders, primary button fill |
| `--ink-soft` | `#5d5b59` | Muted text, captions, secondary copy |
| `--accent` | `#d8412f` | **Signal red** — eyebrows, margin notes, progress rail, active nav, CTA hover |
| `--accent-2` | `#1c6cff` | **Electric blue** — links, screen glow, focus rings (functional only) |
| `--line` | `#b9b6b4` | Hairlines, dividers, section top-borders |
| `--pill` | `rgba(255,255,255,.55)` | Glass surface fill (nav pill, cards) |

**Contrast checkpoints (WCAG AA):**

- `--ink` on `--studio` → passes (≈ 11:1). Default body text pairing.
- `--ink-soft` on `--studio` → ≈ 4.6:1. OK for body, **not** for < 16px secondary text on
  the lighter `--studio-hi` zones — verify with a checker before shipping small muted text.
- `--accent` on `--studio` → ≈ 4.0:1. **Large/bold text and non-text UI only** (eyebrows
  are bold uppercase, margin notes are large). Do not use accent red for body paragraphs.
- Accent and blue are functional colors; never the *only* signal — pair with text/icon.

### 2.2 Dark mode

The reference is **light-only** by design (it's a studio sweep). Dark mode is therefore
**deprecated for the refactor** — remove `dark:` variants as pages are migrated, and drop
`darkMode: 'class'` once no page depends on it.

> If a dark variant is ever required, it must be designed as a deliberate pairing (a dark
> studio: `#1b1b1e` base, `#eceae9` ink, same accent), not an auto-inverted palette. Until
> then, **ship light only.** This is a conscious change from the current dual-theme code.

### 2.3 Typography

Fonts (Google Fonts — load via `next/font` in `app/layout.tsx`, not a raw `<link>`, for
`font-display: swap` and zero layout shift):

| Family | Use | Weights |
|--------|-----|---------|
| **Archivo** | Display — all headings, buttons, card titles, margin notes | 500, 600, 700, 800 |
| **Hanken Grotesk** | Body — paragraphs, ledes, descriptions | 400, 500, 600 |
| **DM Mono** | Labels — eyebrows, nav sublabels, captions, counters, specs, footer | 400, 500 |

Tailwind family tokens (replaces current `display: Space Grotesk` / `body: Noto Sans`):

```ts
fontFamily: {
  display: ['Archivo', 'system-ui', 'sans-serif'],
  body:    ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
  mono:    ['"DM Mono"', 'ui-monospace', 'monospace'],
}
```

**Type roles** (from the reference):

| Role | Spec |
|------|------|
| Hero H1 | Archivo 800, `clamp(52px,10.5vw,150px)`, line-height `.86`, tracking `-.03em`, **UPPERCASE** |
| Section H2 (`.big`) | Archivo 800, `clamp(34px,6vw,76px)`, line-height `.92`, tracking `-.03em`, UPPERCASE |
| Block H2 | Archivo 700, `clamp(28px,3.6vw,42px)`, line-height `1`, tracking `-.02em`, UPPERCASE |
| Card title (H3) | Archivo 700, 21px, tracking `-.01em`, UPPERCASE |
| Margin note (big) | Archivo 700, `clamp(26px,3.4vw,46px)`, line-height `.95`, color `--accent` |
| Eyebrow | DM Mono 500, 12px, tracking `.22em`, UPPERCASE, color `--accent` |
| Body / lede | Hanken Grotesk 400, `clamp(16px,1.5vw,19px)`, line-height `1.55`, color `--ink-soft` |
| Card body | Hanken Grotesk 400, 15px, line-height `1.55`, color `--ink-soft` |
| Label / caption / counter | DM Mono 400–500, 10–12px, tracking `.16em–.3em`, UPPERCASE |
| Footer | DM Mono 400, 13px, line-height `1.6`, color `--ink-soft` |

**Outline text treatment** — the signature move. The keyword in a headline is rendered
stroked with transparent fill:

```css
.text-outline { -webkit-text-stroke: 2px var(--ink); color: transparent; }
/* 1.5px stroke for section-size H2 */
```

Used like: `take it <span class="out">apart</span>.` — the trailing `.` is accent red.
Apply to ONE keyword per headline maximum.

Body min size **16px** on mobile (avoids iOS auto-zoom). Body measure: 35–60ch mobile,
60–75ch desktop (the reference ledes use `max-width: 34ch`).

### 2.4 Spacing & layout

- Base rhythm: **4 / 8px** scale (Tailwind default is fine).
- Content max width: `--maxw: 1180px` → use `max-w-[1180px]` (introduce as the standard
  container; current code uses `max-w-7xl` = 1280px — migrate to 1180).
- Section horizontal padding: `28px` (`px-7`) desktop, `≥16px` mobile.
- Section vertical rhythm (`.band`): `120px` top/bottom (`py-[120px]`), with a
  `1px solid var(--line)` top border separating bands.
- Join/CTA bands: `140px` vertical, centered.
- Footer: `54px` vertical.

### 2.5 Radius

The reference is intentionally **low-radius / industrial**. This is a major change from the
current rounded-2xl SaaS look.

| Token | Value | Use |
|-------|-------|-----|
| `rounded` (button) | `4px` | Buttons, small chips |
| `rounded-lg` (card) | `10px` | Glass cards |
| `rounded-full` | `999px` | Nav pill, progress rail, scroll-cue dashes |

Do **not** use `rounded-xl/2xl/3xl` on new components.

### 2.6 Elevation / shadows

Soft, low, single-direction. No glow shadows (remove the current `glow-*` shadows).

| Token | Value | Use |
|-------|-------|-----|
| `shadow-pill` | `0 10px 40px rgba(20,20,26,.12), inset 0 1px 0 rgba(255,255,255,.7)` | Nav pill |
| `shadow-card` | `0 14px 40px rgba(20,20,26,.06)` | Glass cards |
| `shadow-active` | `0 2px 10px rgba(0,0,0,.07)` | Active nav item |

### 2.7 Motion

| Token | Value |
|-------|-------|
| `--ease` (standard) | `cubic-bezier(.22,.61,.36,1)` |
| Micro-interaction | 150–250ms |
| State transition | 250–300ms |
| Reveal (scroll-in) | 800ms |
| Button hover | `transform .2s, background .2s, color .2s` |
| Scroll lerp (teardown) | `progress += (target - progress) * 0.16` |

Easing: ease-out for entering, ease-in for exiting. No linear UI transitions. All motion
respects `prefers-reduced-motion` (see §9).

### 2.8 Z-index scale

`0` page background sweep → `1` grain overlay → `2` section content → `3` teardown
captions/rail → `50` floating nav → `100` modals/overlays.

---

## 3. Tailwind Config — Target State

Replace the `theme.extend` block in `tailwind.config.ts` with the token set below. (Showing
the deltas from the current config; keep `content`, plugins.)

```ts
theme: {
  extend: {
    colors: {
      studio:    { DEFAULT: '#d6d4d3', lo: '#c4c1c0', hi: '#eceae9' },
      ink:       { DEFAULT: '#16161a', soft: '#5d5b59' },
      accent:    { DEFAULT: '#d8412f' },           // signal red
      'accent-blue': '#1c6cff',                    // electric blue (functional)
      line:      '#b9b6b4',
    },
    fontFamily: {
      display: ['Archivo', 'system-ui', 'sans-serif'],
      body:    ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      mono:    ['"DM Mono"', 'ui-monospace', 'monospace'],
    },
    borderRadius: { DEFAULT: '4px', lg: '10px', full: '9999px' },
    maxWidth: { content: '1180px' },
    boxShadow: {
      pill:   '0 10px 40px rgba(20,20,26,.12), inset 0 1px 0 rgba(255,255,255,.7)',
      card:   '0 14px 40px rgba(20,20,26,.06)',
      active: '0 2px 10px rgba(0,0,0,.07)',
    },
    transitionTimingFunction: { studio: 'cubic-bezier(.22,.61,.36,1)' },
    letterSpacing: { eyebrow: '.22em', label: '.16em', wide: '.3em' },
    keyframes: {
      'reveal-up': { '0%': { opacity: '0', transform: 'translateY(28px)' },
                     '100%': { opacity: '1', transform: 'none' } },
      cue: { '0%,100%': { transform: 'scaleX(.3)', opacity: '.4' },
             '50%': { transform: 'scaleX(1)', opacity: '1' } },
    },
    animation: {
      'reveal-up': 'reveal-up .8s cubic-bezier(.22,.61,.36,1)',
      cue: 'cue 2.4s cubic-bezier(.22,.61,.36,1) infinite',
    },
  },
}
```

**Removed from current config:** the `primary.*` blue scale, `background-*` / `surface-*` /
`text-muted` tokens, all `glow-*` shadows, `float`/`subtle-pulse` animations, and (once
migrated) `darkMode: 'class'`.

`app/globals.css` defines the `:root` tokens, the `body::before` studio sweep, the
`body::after` grain, `.text-outline`, and `.eyebrow` (see §4 / §5.3).

---

## 4. Global Background — The Studio Sweep

Every page sits on the continuous studio sweep + grain. Defined once on `body` in
`globals.css` — never per-section background colors (this is what kills the "seam").

```css
body {
  font-family: "Hanken Grotesk", system-ui, sans-serif;
  color: var(--ink);
  background: var(--studio);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
/* studio sweep */
body::before {
  content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(70vmax 70vmax at 50% 38%, var(--studio-hi) 0%, transparent 60%),
    radial-gradient(90vmax 90vmax at 50% 120%, var(--studio-lo) 0%, transparent 70%);
}
/* faint grain */
body::after {
  content: ""; position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: .04;
  background-image: url("data:image/svg+xml,...feTurbulence fractalNoise baseFrequency=.85...");
}
section { position: relative; z-index: 2; }
```

Sections are transparent and rely on the sweep. Use `.band` top borders (`border-line`)
and vertical rhythm to separate them — **not** alternating background fills (remove the
current `bg-gray-50` / `bg-white` / `bg-[#0d131a]` section banding).

---

## 5. Component Specifications

All components live in `components/ui/` and `components/layout/`. Each spec below is the
target; refactor the existing component to match.

### 5.1 Floating Nav Pill (`components/layout/Navbar.tsx`)

Replaces the current sticky full-width header.

- **Position:** `fixed; top: 18px; left: 50%; translateX(-50%); z-index: 50`. Floats,
  centered, over content.
- **Shape:** `rounded-full`, `padding: 7px`, gap `4px` between items.
- **Surface:** `background: var(--pill)`, `border: 1px solid rgba(255,255,255,.7)`,
  `shadow-pill`, `backdrop-filter: blur(14px) saturate(1.3)`.
- **Item:** two-line stack — `<b>` label (Archivo 700, 12px, tracking `.06em`, UPPERCASE)
  over `<span>` sublabel (DM Mono 400, 10px, `--ink-soft`). Radius `999px`, padding
  `8px 16px 7px`.
- **States:** hover → `background: rgba(255,255,255,.6)`. Active → `background: #fff` +
  `shadow-active`. Active is driven by scroll position / current route via
  IntersectionObserver (single-page) or `usePathname` (multi-page).
- **Mobile (≤820px):** hide `<span>` sublabels; shrink `<b>` to 11px. The pill stays. If
  links exceed width, collapse to a compact pill + sheet — but keep it a floating pill, not
  a full-width bar.
- **Touch:** each item ≥44px tall (the two-line padding achieves this).

Nav labels mirror the reference's four-section model but carry DIGITAL's routes. Recommended
sublabels (DM Mono micro-copy):

| Label | Sublabel | Route |
|-------|----------|-------|
| Home | start & mission | `/` |
| Pillars | the framework | `/pillars` |
| Projects | what we build | `/projects` |
| Team | who we are | `/team` |
| Join | get involved | `/get-involved` |

(`About` and `Contact` fold into the footer + the Join page to keep the pill ≤5 primary
items per `bottom-nav-limit`/`nav` guidance. About may remain a sixth item if needed, but 5
is the target.)

### 5.2 Buttons (`components/ui/Button.tsx`)

| Variant | Spec |
|---------|------|
| Base | Archivo 600, 14px, tracking `.04em`, UPPERCASE; padding `16px 26px`; `rounded` (4px); `border: 1.5px solid var(--ink)`; `cursor: pointer`; transition `transform .2s, background .2s, color .2s` |
| Hover (all) | `translateY(-2px)` |
| `primary` | fill `--ink`, text `--studio`; **hover** → background + border become `--accent` |
| `ghost` / `secondary` | transparent fill, text `--ink`, ink border |
| `sm` | padding `10px 18px`, 13px |
| `lg` | padding `18px 30px`, 15px |

- Disabled: opacity `.5`, `cursor: not-allowed`, no hover transform.
- Loading: show inline spinner, disable, keep label.
- One **primary** CTA per screen; everything else ghost (`primary-action` rule).
- Remove the current `.btn-glow` radial-glow effect.

### 5.3 Eyebrow

Small accent-red mono kicker above headings. Use on every section intro.

```css
.eyebrow { font: 500 12px/1 "DM Mono", monospace; letter-spacing: .22em;
           text-transform: uppercase; color: var(--accent); }
```

### 5.4 Glass Card (`components/ui/Card.tsx`)

- **Surface:** `background: rgba(255,255,255,.42)`, `border: 1px solid rgba(255,255,255,.6)`,
  `backdrop-filter: blur(6px)`, `rounded-lg` (10px), `shadow-card`, padding `30px`.
- **Index label** (`.n`): DM Mono 500, 12px, `--accent`, tracking `.1em` — e.g.
  `01 · DISPLAY`.
- **Title** (h3): Archivo 700, 21px, UPPERCASE, tracking `-.01em`.
- **Body:** Hanken Grotesk 400, 15px, line-height `1.55`, `--ink-soft`.
- **Grid:** `display:grid; gap:30px; grid-template-columns:repeat(auto-fit,minmax(240px,1fr))`.
- **Interactive variant:** hover lifts `translateY(-2px)` (subtle), border brightens. No
  glow. Keep press states layout-stable.

Replaces the current dark `surface-dark` cards. Featured/flagship cards may use the dark ink
device-render treatment (image with `from-ink/90` gradient overlay) — see §10 home bento.

### 5.5 Margin Note / State Callout

The right-rail teardown callout (reference `.state`). Reusable for any "current state"
annotation.

- Small label (`.t`): DM Mono 500, 11px, tracking `.16em`, `--ink-soft`.
- Big note (`.m`): Archivo 700, `clamp(26px,3.4vw,46px)`, UPPERCASE, `--accent`, prefixed
  with a small `◂` glyph.
- Hidden ≤820px.

### 5.6 Progress Rail

Scroll-progress indicator for the teardown (reference `.rail` + `.railcount`).

- Track: `width: min(300px,46vw)`, `height: 3px`, `rounded-full`, `background: var(--line)`.
- Fill (`i`): `background: var(--accent)`, width driven by scroll progress %.
- Counter: DM Mono 500, 10px, tracking `.2em`, `--ink-soft`, e.g. `04 / 12`.

### 5.7 Scroll Cue

`Scroll` label (DM Mono 500, 11px, tracking `.3em`, UPPERCASE, `--ink-soft`) followed by an
animated 80px dash using the `cue` keyframe. Reduced-motion: static dash.

### 5.8 Forms (`Input`, `Textarea`, `Select`)

The reference has no forms; derive from its language:

- Field: `background: rgba(255,255,255,.55)`, `border: 1px solid var(--line)`, `rounded`
  (4px), `padding: 14px 16px`, Hanken Grotesk 16px (≥16px to avoid iOS zoom), min height
  44px.
- Label: DM Mono 500, 11px, tracking `.16em`, UPPERCASE, `--ink-soft`, **always visible
  above the field** (not placeholder-only).
- Focus: `2px` ring in `--accent-blue` (the functional electric blue), visible.
- Error: helper text below field in `--accent`, `role="alert"` / `aria-live`. State the
  cause + fix.
- Required: mark with `*`. Validate on blur, not keystroke.

### 5.9 Badge (`components/ui/Badge.tsx`)

Industrial chip. DM Mono 500, 11px, tracking `.1em`, UPPERCASE; `rounded` (4px);
`border: 1px solid`. Variants: `default` (ink border/text), `flagship`/`accent` (accent
border + accent text + `rgba(216,65,47,.08)` fill). No pulsing glow.

### 5.10 Footer (`components/layout/Footer.tsx`)

- `padding: 54px 0`, `border-top: 1px solid var(--line)`, DM Mono 400, 13px/1.6,
  `--ink-soft`.
- Layout: `flex; justify-content: space-between; flex-wrap: wrap; gap: 16px` within the
  1180px wrap (simpler than the current 4-column grid — match the reference's terse,
  instrument-readout footer). Keep DIGITAL's brand line, quick links, contact block, and
  social icons, styled as mono text/links; links hover → `--ink`.

### 5.11 Icons

- **SVG only** — Lucide or Heroicons (stroke 1.5–2px, consistent set). **No emoji.**
- **Migrate off `material-symbols-outlined`** (the current icon font) — it doesn't match the
  industrial stroke language and adds a font dependency. Map existing icon names to Lucide
  equivalents during migration (e.g. `memory`→`Cpu`, `arrow_forward`→`ArrowRight`,
  `smartphone`→`Smartphone`, `code`→`Code`, `science`→`FlaskConical`, `school`→`GraduationCap`).
- Icon-only controls need `aria-label`. Touch target ≥44px (use padding/hit area).

---

## 6. Signature Pattern — Scroll-Driven Teardown

The centerpiece, reserved for the **home page hero→teardown** and optionally the **Modular
Smartphone project page**. This is what makes the site "the smartphone team's" site.

### Renderers (two modes, one component)

| Mode | Config | Purpose |
|------|--------|---------|
| `registered` (default) | `lib/teardown/config.ts` → `layers[]` | **Option B** — full-frame transparent layer PNGs at a shared origin; each layer moves via `translate3d` along one explosion axis with per-layer `start`/`end` windows. |
| `sequence` | `frameAdjust[]` + 12 frames | **Option C stopgap** — crossfade calibrated frames until registered assets ship. Pass `{ renderer: 'sequence' }` to `<Teardown>`. |

Implementation: [`components/teardown/Teardown.tsx`](components/teardown/Teardown.tsx) with
engines in `components/teardown/engine/`.

### Assets + payload (S1)

- **Source PNGs:** `public/assets/frames/frame-01..12.png` (assembled → exploded).
- **Encoded delivery:** AVIF + WebP at **760 / 1100 / 1700** widths via `npm run encode:teardown`
  (`scripts/encode-teardown-assets.mjs`). Target total hero payload **≤ ~1.5 MB**.
- **Registered layers:** `public/assets/layers/layer-01-chassis..layer-06-glass` (transparent,
  same canvas origin). Replace script-generated slices with real exports when ready.
- **Mobile poster:** `public/assets/frames/poster-{760,1100,1700}.{avif,webp}` (frame-12).
- Eager low-res first frame: `frame-01-760.webp`.

### Desktop scrub

- Tall pin track (`pinLen`, default `170vh`) + sticky `100svh` stage.
- Scroll → progress lerp (`lerp`, default `0.25`); optional **Lenis** smooth scroll
  (`smoothScroll: true` + `npm install lenis` — wire in `Teardown.tsx` when deps are available).
- **Registered:** layers stay fully opaque; separate shadow `<div>` elements track separation
  (no animated `filter: drop-shadow`). Contact shadow on ground plane.
- **Sequence:** staged blur-dissolve crossfade (`hold`, default `0.28`) + per-frame `frameAdjust`.
- Margin notes crossfade with small y-offset per active layer/state.

### Mobile + a11y (S2)

- **≤820px and `prefers-reduced-motion`:** static exploded poster + layer label list
  ([`TeardownMobilePoster.tsx`](components/teardown/TeardownMobilePoster.tsx)) — no pinned scrub.

### Tuning knobs

- `pinLen`, `lerp`, `hold`, `frameAdjust`, `layers[].{start,end,dx,dy,depth}`, `renderer`,
  `smoothScroll`, stage size classes on `.phone` container.

Reference implementation: `Refractor/hardware-teardown-site/index.html` and
`scroll-frame-sequence.skill.md`.

---

## 7. Layout Primitives

- `.wrap` → `max-w-content (1180px) mx-auto px-7` (28px; `px-4`/16px on mobile).
- `.band` → section with `py-[120px]` and `border-t border-line`.
- `.grid` → `grid gap-[30px] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]`.
- `.reveal` → starts `opacity-0 translate-y-[28px]`, transitions to visible over 800ms when
  scrolled into view (IntersectionObserver, threshold .2, unobserve after). Honor reduced
  motion.

---

## 8. Motion & Interaction Rules

- Standard easing token `cubic-bezier(.22,.61,.36,1)` for all UI transitions.
- Micro 150–250ms, state 250–300ms, reveals 800ms, page scroll-driven via lerp.
- Animate `transform` / `opacity` / `filter` only — never `width`/`height`/`top`/`left`.
- One or two animated elements per view; exits faster than enters.
- Hover lifts are `translateY(-2px)`; press states must not shift layout bounds.
- Every animation must express cause→effect (the teardown *is* the content). No decorative
  motion.

---

## 9. Accessibility (CRITICAL — non-negotiable)

- **Contrast:** body text `--ink` on studio passes; verify any `--ink-soft` small text and
  any accent text (large/bold only) against the specific sweep zone. ≥4.5:1 normal, ≥3:1
  large/UI.
- **Color never the only signal:** accent red and blue always paired with text/icon.
- **Focus:** visible 2px focus ring (`--accent-blue`) on all interactive elements; never
  remove outlines.
- **Touch:** ≥44×44px targets, ≥8px spacing.
- **Keyboard:** full tab support, logical order, escape closes overlays.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables `scroll-behavior`,
  the scroll cue, reveals, and the teardown dissolve (show final frame). Already scaffolded
  in `globals.css` — keep and extend.
- **Headings:** sequential `h1→h6`, one `h1` per page.
- **Images:** meaningful images get alt text; decorative teardown frames are `aria-hidden`.
- **Viewport:** `width=device-width, initial-scale=1`; never disable zoom. Prefer `min-h-dvh`
  over `100svh`/`100vh` where supported (reference uses `100svh`).

---

## 10. Responsive

Breakpoints: **375 / 768 / 1024 / 1440**. Mobile-first. The reference's key breakpoint is
**820px** (`.state`/`.seq-caption` hidden, phone resized, nav sublabels hidden) — preserve
that behavior.

- No horizontal scroll; `overflow-x: hidden` on body.
- Container `max-w-content`; gutters `28px` desktop → `16px` mobile.
- Hero H1 and section H2 use `clamp()` (already specified) so type scales fluidly.
- Test at 375px and in landscape; verify with largest dynamic-type setting.

---

## 11. Content Inventory (Preserve Verbatim)

All copy/data below is **kept from the current repo** and re-skinned with the system above.
Source files are authoritative for exact strings.

### Identity — `lib/data/siteConfig.ts`
- Name: **DIGITAL** · Full: **DIGITAL @ Cal Poly Pomona**
- Description: *"A student-run engineering organization at Cal Poly Pomona dedicated to
  bridging the gap between academic theory and industry practice."*
- Contact: `contact@digitalcpp.org` · Building 17, Room 1635 · Cal Poly Pomona ·
  Thursdays @ 6:00 PM
- Social: LinkedIn, GitHub, Instagram, Discord (`discord.gg/Vsg3qcNVzv`), Notion.
- Stats: **120+** active members · **15** prototypes · **50k+** lines of code · **2** sponsors.
- Sponsors: *Cal Poly Pomona Project Hatchery*, *College of Engineering: MEP-WiSE*.

### Pages & key copy to preserve
| Route | Source | Preserved content |
|-------|--------|-------------------|
| `/` | `app/page.tsx` | Hero ("Building the Future, One Module at a Time."), stats bar, mission, featured projects (bento), sponsors, "Ready to Join the Circuit?" CTA |
| `/pillars` | `app/pillars/page.tsx` | The 7 DIGITAL pillars (Device, Implementation, Generating, Integrating, Testing, Analyzing, Learning) with descriptions/details; mission quote; Design/Build/Growth phases |
| `/projects` + `/projects/[slug]` | `app/projects/*`, `lib/data/projects.ts` | Project cards, flagship Modular Smartphone (specs, modules, timeline, tech stack, stats) |
| `/about` | `app/about/page.tsx` | Mission/about narrative |
| `/team` | `app/team/page.tsx`, `lib/data/team.ts` | Members by department (executive/hardware/software/outreach) |
| `/get-involved` | `app/get-involved/page.tsx`, `lib/data/involvement.ts` | Students / Alumni / Companies involvement options; meeting info |
| `/contact` | `app/contact/page.tsx` | Contact form + details |

**Copy-tone alignment:** where the reference uses terse industrial phrasing
("take it apart.", "screen off.", "the board."), DIGITAL's *existing* copy is preserved but
may be **set** in the industrial type treatment (uppercase headlines, outline keyword, mono
eyebrows). Do not invent new marketing copy; only restyle existing strings. The flagship
Modular Smartphone maps naturally onto the teardown narrative — reuse its real spec/module
data as the teardown's margin-note labels.

### Home bento (re-skin, keep structure)
The current home featured-projects bento (1 large + 2 secondary + 1 wide) is kept, restyled:
dark ink device-render tiles with `from-ink/90 via-ink/40 to-transparent` gradient overlays,
Archivo titles, mono index labels, accent "View Specs" underline.

---

## 12. Migration Checklist (per page/component)

When refactoring any page or component to this system:

- [ ] Replace fonts with Archivo / Hanken Grotesk / DM Mono via `next/font`.
- [ ] Swap color classes to studio/ink/accent tokens; delete `primary` blue + `dark:` usage.
- [ ] Background: remove section fills; rely on the global studio sweep + `.band` borders.
- [ ] Headlines: UPPERCASE Archivo, `clamp()` sizing, one outline keyword, accent `.`.
- [ ] Eyebrow (mono, accent) above each section intro.
- [ ] Cards → glass (`rgba(255,255,255,.42)`, hairline, blur, `rounded-lg`, `shadow-card`).
- [ ] Buttons → square (4px), 1.5px ink border, uppercase Archivo, ink-fill primary w/
      accent hover; remove `.btn-glow`.
- [ ] Radius: no `xl/2xl/3xl`; only 4 / 10 / full.
- [ ] Icons → Lucide/Heroicons SVG; remove `material-symbols-outlined` + emoji.
- [ ] Shadows → `pill` / `card` / `active`; remove all `glow-*`.
- [ ] Motion → `cubic-bezier(.22,.61,.36,1)`, transform/opacity only.
- [ ] Nav → floating glass pill; Footer → mono instrument-readout.
- [ ] A11y pass (§9) + responsive at 375/768/1024/1440 + reduced-motion.
- [ ] Verify all preserved copy matches `lib/data/*` / source page (§11).

---

## 13. Anti-Patterns (Do Not)

- ❌ Blue primary brand color, glow shadows, `text-gradient` blue→blue (the old look).
- ❌ Per-section background fills that break the studio sweep / create seams.
- ❌ Rounded-2xl/3xl SaaS cards; soft pastel surfaces.
- ❌ Emoji as icons; mixed icon sets; raster icons.
- ❌ Accent red as body text, decoration, or more than one keyword/headline.
- ❌ Placeholder-only form labels; errors only at top of form.
- ❌ Decorative-only animation; animating width/height/top/left; bouncy springs on UI.
- ❌ Auto-inverted dark mode; new `dark:` variants.
- ❌ Inventing new copy — restyle existing DIGITAL text only.
- ❌ Hardcoded hex in components — use tokens.

---

## 14. References

- **Visual source of truth:** `Refractor/hardware-teardown-site/index.html` (+ `README.md`,
  `scroll-frame-sequence.skill.md`, `assets/frames/`).
- **Content source of truth:** `lib/data/*`, `app/**/page.tsx`.
- **This system supersedes:** `docs/plans/2025-01-29-ui-revamp-design.md` and the prior
  blue/dark Tailwind theme.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06-01 | Initial DESIGN.md — industrial studio system derived from `Refractor/`, content preserved from current repo. |

---

## 15. Subsystem Accent Scale (Scoped: `/projects/modular-smartphone`)

**Migrated.** The route-local token and accent system for the modular smartphone
experience (background/panel/CTA tokens plus the seven subsystem accents) now lives in
[`docs/design/smartphone.DESIGN.md`](./docs/design/smartphone.DESIGN.md), which is the
authoritative style reference for `/projects/modular-smartphone`. See
[§0.1 Route-Scoped Design Systems](#01-route-scoped-design-systems). The scoping rule
still holds: those tokens must not leak into `/`, `/projects`, `/pillars`, or any shared
component.
