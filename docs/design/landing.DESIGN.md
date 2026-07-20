# DIGITAL Home Landing — Style Reference

> A field notebook set in warm paper and forest ink — quiet serif declarations, mono annotations, and one bar of gold.

**Theme:** light (with full-bleed dark bands)

The home landing (`/`) is a warm editorial system, deliberately isolated from the root `DESIGN.md` industrial-studio kit. It reads like a letterpress broadsheet crossed with an engineering logbook: a soft parchment page (`#F7F6F2`), near-black green-tinted ink (`#111311`), and two reserved accents — forest green (`#1E4D2B`) for hover states and pathway titles, and harvest gold (`#C28E0E`) for the loader bar, glyph marks, and the single primary CTA on the dark join band. Newsreader serif carries every headline at medium weight; IBM Plex Mono carries every label, eyebrow, nav item, and button in tightly letter-spaced micro sizes; IBM Plex Sans carries body copy. Structure is drawn, not shaded: hairline rgba borders, ✳-star section dividers, `+` crosshair registration marks, and diagonal-stripe placeholder plates. Depth comes from full-bleed inversions to near-black (`#0A0C0A`) rather than shadows. Motion is a single gesture — rise 18px, fade in — orchestrated by a loader curtain and an IntersectionObserver.

All copy, links, and the loader duration live in `lib/data/homeLanding.ts` (`homeLandingCopy`). Never inline copy into components.

Source of truth files: `app/page.tsx`, `components/home/HomeLanding.tsx`, `components/home/home-landing.css`, `lib/data/homeLanding.ts`.

## Tokens — Colors

| Name | Value | Token | Role |
|---|---|---|---|
| Parchment | `#F7F6F2` | `--dg-bg` | Page background; inverse text on dark-ink buttons |
| Ink | `#111311` | `--dg-ink` | Primary text, borders (via rgba), dark button fill |
| Forest Green | `#1E4D2B` | `--dg-green` | Link hover color, dark CTA hover fill, pathway card titles |
| Gold | `#C28E0E` | `--dg-gold` | Loader bar, thesis glyphs, join primary CTA fill, dark ghost hover accent |
| Gold Bright | `#D8A62A` | `--dg-gold-bright` | Hover fill of the gold join CTA |
| Void | `#0A0C0A` | `--dg-dark` | Loader overlay, thesis band, join band, footer backgrounds |
| Void Hover | `#111511` | `--dg-dark-hover` | Hover background of thesis gap rows |
| Cream | `#F2F0E8` | `--dg-cream` | Text on dark bands; source of dark-band rgba borders |
| Muted | `#5A615B` | `--dg-muted` | Secondary text on light (eyebrows, nav links, card body) |
| Muted Dark | `#8B948C` | `--dg-muted-dark` | Secondary text on dark (loader subtitle, gap body, footer) |
| Card | `#FCFBF8` | `--dg-card` | Card surfaces (pathway cards, results cards) |
| Stripe A | `#E7E4DC` | `--dg-stripe-a` | Diagonal placeholder stripe, dark band |
| Stripe B | `#EFEDE6` | `--dg-stripe-b` | Diagonal placeholder stripe, light band |
| Selection | `rgba(194,142,14,0.3)` | `--dg-selection` | `::selection` background (gold at 30%) |
| Nav Veil | `rgba(247,246,242,.92)` | `--dg-nav-bg` | Sticky nav background over `backdrop-blur-[10px]` |

Ink-derived hairlines (light sections) — always `rgba(17,19,17, α)`: `.1` (hero visual frame), `.12` (nav border, results card inner rules), `.15` (card borders at rest), `.2`/`.25` (structural lines, divider lines, mid frames), `.3` (pathway connector lines), `.35` (nav pill border, results card hover border), `.4` (way card hover border, `+` crosshair glyphs), `.45`–`.5` (micro labels and divider stars).

Cream-derived hairlines (dark sections) — always `rgba(242,240,232, α)`: `.12` (band borders), `.16` (loader track), `.18` (divider lines), `.3` (glyph chip and ghost CTA borders), `.35` (divider stars).

## Tokens — Typography

### Newsreader (serif) — `--font-home-serif`

The voice of the page. Every `h1`/`h2` headline and the large stat numerals. Loaded via `next/font/google` in `app/page.tsx` with weights **400, 500, 600**; headings render at **500 (medium)** with an occasional **600 (semibold)** inline span for emphasis (e.g. "Smartphone Project"). Substitute if unavailable: any high-contrast text serif (e.g. Source Serif), never a display slab.

### IBM Plex Sans — `--font-home-sans`

Workhorse body text; the `.home-landing` root `font-family`. Weights **400, 500, 600**. Card titles use **600** at 14px; body paragraphs use **400** at 12–13px with generous 1.7–1.75 line height.

### IBM Plex Mono — `--font-home-mono`

The annotation layer: loader, nav, eyebrows, buttons, kickers, stat labels, footer, divider stars, crosshairs. Weights **400, 500**. Always paired with wide letter-spacing (`.06em`–`.42em`) and frequently uppercase. Substitute: any Plex-adjacent mono; never lose the tracking.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|---|---|---|---|---|
| Hero headline (serif 500) | `clamp(34px,5vw,58px)` | 1.14 | −0.01em | `--dg-type-hero` |
| Join heading (serif 500) | `clamp(28px,3.6vw,46px)` | 1.2 | normal | `--dg-type-join` |
| Results heading (serif 500) | `clamp(26px,3.2vw,40px)` | 1.2 | normal | `--dg-type-results` |
| Thesis heading (serif 500) | `clamp(26px,3vw,38px)` | 1.25 | normal | `--dg-type-thesis` |
| Pathways heading (serif 500) | `clamp(24px,3vw,36px)` | 1.3 | normal | `--dg-type-pathways` |
| Loader wordmark (mono 500) | `clamp(30px,4.5vw,44px)` | normal | .42em (+matching text-indent) | `--dg-type-loader` |
| Stat numeral (serif 500) | 24px (`text-2xl`) | Tailwind default | normal | `--dg-type-stat` |
| Card title (sans 600) | 14px | normal | .02em | `--dg-type-card-title` |
| Body / join copy (sans 400) | 13px | 1.75 | normal | `--dg-type-body` |
| Card body (sans 400) | 12–12.5px | 1.7–1.75 | normal | `--dg-type-card-body` |
| Nav wordmark (mono 500) | 13px | normal | .12em | `--dg-type-wordmark` |
| Hero subline (mono 400) | 11px | normal | .06em | `--dg-type-subline` |
| Nav link (mono 400) | 10.5px | normal | .1em | `--dg-type-nav` |
| CTA label (mono 400) | 10–10.5px | normal | .12em | `--dg-type-cta` |
| Eyebrow (mono 400, uppercase) | 10px | normal | .24em | `--dg-type-eyebrow` |
| Micro label (mono 400, uppercase) | 8.5–9.5px | normal | .14em–.3em | `--dg-type-micro` |

Notable micro-label instances: loader subtitle 10px/.3em; loader status 9.5px/.22em; hero visual label 9.5px/.2em; image-plate caption 9px/1.8/.14em; kicker 9px/.16em; stat labels 8.5px/.14em; footer lines 9.5px/.14–.16em.

## Tokens — Spacing & Shapes

Density: **compact horizontal chrome, expansive vertical breathing.** A tight fixed 18px page gutter frames sections that stretch to 8–13% of viewport height in padding. Nothing floats — everything is registered to hairlines.

| Step | Value | Use |
|---|---|---|
| micro | 7–11px | Button vertical padding (7/11/12px), nav py 10px, divider py 14px |
| gutter | 18px | Universal horizontal page padding; divider gap |
| card gap | 14–22px | Way-card internal gap 14px; card-row gaps 22px; CTA cluster gap 14px |
| nav gap | 26px | Center nav link spacing |
| card pad | `34px 26px` (ways), `px-5 py-4` (results rows) | Card interiors |
| cell pad | `clamp(24px,3.5vw,44px)` × `clamp(24px,3vw,36px)` | Thesis gap rows |
| section | `clamp(48px,8vh,90px)` → `clamp(80px,13vh,140px)` | Vertical section padding (see Layout) |

| Radius | Value | Where |
|---|---|---|
| none | 0 | Default — hero frame, thesis rows, dividers, footer, logo mark |
| hairline | 2px | All pill CTAs (`rounded-[2px]`) |
| chip-sm | 3px | Thesis glyph chip (26px square) |
| chip | 4px | Pathway glyph chip (34px), results glyph chip (28px, `size-7`) |
| card | 8px | Results project card |
| plate | 10px | Results striped image plate |

Layout metrics: hero h1 max-width 760px; thesis heading 420px; pathways/join headings 640px; join body & gap body 460px; footer content 1100px; way card `min(300px,86vw)`; results card `min(520px,78vw)`; image plate `clamp(160px,18vw,220px)` wide; hero visual `clamp(360px,72vh,640px)` tall; loader track `min(300px,60vw)`.

## Components

### Loader Overlay

**Role:** Boot-sequence curtain that establishes the brand before the page appears.
Fixed full-viewport panel, `z-[100]`, background `#0A0C0A`, column-centered with 30px gaps. "DIGITAL" wordmark in mono medium `clamp(30px,4.5vw,44px)` cream `#F2F0E8` with .42em tracking and matching `.42em` text-indent to optically center; subtitle "Cal Poly Pomona" 10px uppercase .3em in `#8B948C`. Below: a 1px-tall track `min(300px,60vw)` wide in `rgba(242,240,232,.16)` with a gold `#C28E0E` fill bar animating `width 0→100%` over 1.8s `cubic-bezier(.65,0,.35,1)`. Status line "INITIALIZING SYSTEMS" 9.5px/.22em in `#8B948C`, blinking (opacity 1↔0.15) at 1.2s ease-in-out infinite. The whole panel exits by `translateY(-100%)` over 850ms `cubic-bezier(.76,0,.24,1)` and unmounts 900ms after exit begins.

### Sticky Nav

**Role:** Persistent thin instrument bar; the only fixed chrome on the page.
`sticky top-0 z-50`, 3-column grid (`1fr auto 1fr`), 18px horizontal / 10px vertical padding, background `rgba(247,246,242,.92)` with `backdrop-blur-[10px]`, bottom hairline `rgba(17,19,17,.12)`. Left: logo — a 14px square with 1.5px `#111311` border and a gold `#C28E0E` inner square inset 3px, beside "DIGITAL" in mono 13px medium /.12em. Center (hidden below `sm`): three anchor links (Thesis / Pathways / Results) mono 10.5px/.1em in `#5A615B`, hover `#111311`. Right: "Talk to us" pill — `rounded-[2px]`, border `rgba(17,19,17,.35)`, `px-4 py-[7px]`, mono 10px/.12em ink text; hover inverts to solid `#111311` with `#F7F6F2` text.

### Hero

**Role:** Serif declaration plus a drafted placeholder visual.
Centered header, top padding `clamp(48px,8vh,90px)`. H1 in Newsreader 500 `clamp(34px,5vw,58px)`, line-height 1.14, tracking −0.01em, `#111311`, max 760px; each of the three lines wraps in an `overflow:hidden` span so words rise from `translateY(108%)`. Subline in mono 11px/.06em `#5A615B`. CTA: solid `#111311` block, `rounded-[2px]`, `px-6 py-[11px]`, mono 10.5px/.12em `#F7F6F2`, hover fill `#1E4D2B`. Below sits the hero visual: a `clamp(360px,72vh,640px)`-tall diagonal-striped plate (`repeating-linear-gradient(-45deg, #E7E4DC 0 14px, #EFEDE6 14px 28px)`) framed in `rgba(17,19,17,.1)`, containing a centered `min(420px,70%)` × 70% frame at `.25` opacity ink, a 4×4 grid of `+` crosshairs (mono 13px, `rgba(17,19,17,.4)`) at the perimeter cells, four stacked horizontal rules fading `.25→.1` near the bottom, and a top mono caption 9.5px/.2em at `.45` ink reading the `visualLabel` string from data.

### Section Divider

**Role:** Typographic rule that meters the page — a row of ✳ stars joined by hairlines.
`.home-landing__divider`: flex row, `padding 14px 18px`, `gap 18px`; four ✳ glyphs (mono 11px) alternating with three 1px flex-1 lines. Light variant: stars `rgba(17,19,17,.5)`, lines `rgba(17,19,17,.25)`. Dark variant (`dark` prop and the inline rows inside the thesis band): stars `rgba(242,240,232,.35)`, lines `rgba(242,240,232,.18)`.

### Thesis Gap Cards

**Role:** The argument — three "gaps" stacked beside a serif thesis, on the first dark band.
Full-bleed `#0A0C0A` section, cream text. Split grid `repeat(auto-fit,minmax(min(100%,380px),1fr))` with `rgba(242,240,232,.12)` rules between and around. Left cell: eyebrow (mono 10px uppercase /.24em `#8B948C`) over a Newsreader 500 heading `clamp(26px,3vw,38px)`/1.25 in `#F2F0E8`, max 420px. Right column: three rows, each `border-b rgba(242,240,232,.12)`, padded `clamp(24px,3.5vw,44px)` × `clamp(24px,3vw,36px)`, hover background `#111511`. Each row: a 26px square chip (`rounded-[3px]`, border `rgba(242,240,232,.3)`) holding a gold `#C28E0E` mono glyph (⌗ ⊞ ⇄, from data), a 14px semibold /.02em title in `#F2F0E8`, and 12.5px/1.7 body in `#8B948C` max 460px. The band is bookended by inline star-divider rows (18px gap, 18px/10px padding).

### Pathways Way Cards

**Role:** Two engagement modes presented as twin specimen cards under a drafted "org chart" connector.
Light section, centered, `py clamp(64px,10vh,110px)`. Eyebrow + Newsreader heading `clamp(24px,3vw,36px)`/1.3 max 640px (with a 600-weight span). Connector diagram: a 34px vertical 1px line at `.3` ink topped by a `+` (mono 12px, `.5` ink), then a `min(340px,70%)` horizontal 1px line with 26px vertical ticks at each end. Cards: `min(300px,86vw)` wide, background `#FCFBF8`, border `rgba(17,19,17,.15)` (hover `.4`), square corners, padding `34px 26px`, centered column with 14px gap. Inside: 34px glyph chip (`rounded-[4px]`, border `.25` ink, mono 15px `#111311`), title 14px semibold /.02em in **forest green `#1E4D2B`**, body 12px/1.75 `#5A615B`. Section ends with the same solid-ink CTA block as the hero.

### Build Record / Results Cards

**Role:** Horizontal-scrolling case-study ledger pairing a striped photo plate with a data card.
Light section, left-aligned eyebrow and Newsreader heading `clamp(26px,3.2vw,40px)`/1.2. Row: `flex gap-[22px] overflow-x-auto pb-4`; each case is a flex-none pair with 14px internal gap. Image plate: `clamp(160px,18vw,220px)` wide, `rounded-[10px]`, striped background, border `.12` ink, centered mono caption 9px/1.8/.14em at `.45` ink in `[ BRACKETS ]`. Card: `min(520px,78vw)`, `rounded-[8px]`, `#FCFBF8`, border `.15` ink (hover `.35`); the whole card is a `Link`. Internal rows separated by `.12` ink hairlines: header (28px glyph chip + kicker 9px uppercase /.16em `#5A615B` + 16px semibold title), summary line 12.5px, a 3-column stat grid (`.12` ink column rules; serif 500 24px numeral over 8.5px uppercase /.14em label), and a "Learnings" footer (8.5px/.16em label + 12px/1.8 lines).

### Join CTA Band

**Role:** The close — second dark band, and the only place gold becomes a button.
`#0A0C0A`, centered, `py clamp(80px,13vh,140px)`. Newsreader 500 heading `clamp(28px,3.6vw,46px)`/1.2 `#F2F0E8` max 640px; body 13px/1.75 `#8B948C` max 460px. Two CTAs, 14px gap: primary — solid gold `#C28E0E`, `rounded-[2px]`, `px-[26px] py-3`, mono 10.5px/.12em text in `#0A0C0A`, hover `#D8A62A`; secondary — transparent with border `rgba(242,240,232,.3)` and `#F2F0E8` text, hover border **and** text turn gold `#C28E0E`.

### Footer

**Role:** Colophon strip continuing the dark band.
`#0A0C0A`, top hairline `rgba(242,240,232,.12)`, `px-[18px] py-9`, base text `#8B948C`. Content max 1100px, space-between wrap. Left: "DIGITAL" mono 14px (`text-sm`) medium /.2em in `#F2F0E8` over "@ CAL POLY POMONA" 9.5px uppercase /.16em. Right: right-aligned stack (7px gap) of four taglines from data, mono 9.5px uppercase /.14em.

### Buttons / CTAs

**Role:** Mono-labeled blocks; never rounded past 2px, never large type.
Four variants, all `rounded-[2px]` with mono 10–10.5px /.12em labels: (1) **Ink block** — `#111311` fill, `#F7F6F2` text, `px-6 py-[11px]`, hover `#1E4D2B` (hero, pathways); (2) **Outline pill** — `.35` ink border, ink text, hover inverts to solid ink (nav); (3) **Gold block** — `#C28E0E` fill, `#0A0C0A` text, `px-[26px] py-3`, hover `#D8A62A` (join primary); (4) **Dark ghost** — cream text, `rgba(242,240,232,.3)` border, hover gold text + border (join secondary). Color is the only hover channel — no lift, no shadow, no scale.

## Motion & Interaction

- **Easings:** reveal — `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quint feel); loader exit — `cubic-bezier(0.76, 0, 0.24, 1)`; loader bar fill — `cubic-bezier(0.65, 0, 0.35, 1)`; status blink — `ease-in-out`.
- **Durations:** reveal transitions 0.8s (opacity + transform); loader exit 850ms; bar fill 1.8s; blink loop 1.2s.
- **Loader timing** (from `homeLandingCopy.motion` + `HomeLanding.tsx`): dwell `loaderMs = 1900ms` (250ms under `prefers-reduced-motion`); at that mark the panel slides up and hero reveal begins; panel unmounts 900ms later; the IntersectionObserver only starts observing at `loaderMs + 200ms`; a 7000ms safety timer force-reveals everything if timing fails.
- **Hero stagger:** each `[data-hero-word]` (three headline lines, subline, CTA, visual) starts at `translateY(108%)` inside an `overflow:hidden` line wrapper and receives `transitionDelay = 0.12 + i × 0.1` seconds in DOM order.
- **Scroll reveal:** all `[data-reveal]` elements start `opacity:0; translateY(18px)`. Observer config: `threshold: 0.1`, `rootMargin: '0px 0px -6% 0px'`. On intersect, an optional `data-reveal-delay` (milliseconds as string; typical values `110`, `120 + index × 110`, `100`, `140`, `200`, `260`) becomes the transition delay, `is-visible` is added, and the element is unobserved — reveals fire once, never reverse.
- **Reduced motion:** the CSS clamps every transition/animation inside `.home-landing` to `0.01ms` and one iteration; JS additionally shortens the loader dwell to 250ms. Content is never withheld from reduced-motion users.
- **Micro-interactions:** hover is color/border-only (see Buttons); global `a:hover` shifts to `--dg-green` unless overridden; text selection is gold at 30%; `scroll-behavior: smooth` on the root for anchor nav.

## Do's and Don'ts

### Do

- Keep every headline in Newsreader at weight 500 — reserve 600 for a single inline emphasis span.
- Set every label, button, eyebrow, and caption in IBM Plex Mono with its prescribed tracking; wide letter-spacing is the system's texture.
- Draw structure with 1px rgba-of-ink (or rgba-of-cream on dark) hairlines; add a border before you ever consider a shadow.
- Use the ✳ star divider between light sections and its dark inline variant to bookend dark bands.
- Keep gold `#C28E0E` scarce: loader bar, glyph accents, and the join band's primary CTA only.
- Alternate parchment and `#0A0C0A` full-bleed bands for rhythm; carry `#F2F0E8`/`#8B948C` text onto dark.
- Route all copy through `lib/data/homeLanding.ts` and wire new sections into the `data-reveal` observer with staggered `data-reveal-delay` values in ~110ms steps.
- Preserve the loader sequence timings and the `prefers-reduced-motion` fallbacks whenever touching mount logic.

### Don't

- Don't import the studio kit (`components/ui/*`, Archivo `font-display`, signal-red accents, glass cards) into the landing — the two systems must not blend.
- Don't add box-shadows, gradients (other than the flat diagonal stripe), or blur surfaces beyond the nav veil.
- Don't round corners past the sanctioned set (2/3/4/8/10px); no pill buttons, no circles.
- Don't use gold for body text, backgrounds, or borders at rest, and don't introduce new accent hues.
- Don't set buttons in sans or serif, enlarge CTA type past 10.5px, or drop the .12em tracking.
- Don't animate anything except opacity and translateY, and never re-trigger a reveal on scroll-up.
- Don't uppercase serif headings or tighten their tracking beyond the hero's −0.01em.
- Don't replace the striped placeholder plates with unframed photography — imagery must sit inside the drafted frames.

## Surfaces

| Level | Name | Value | Purpose |
|---|---|---|---|
| 0 | Parchment page | `#F7F6F2` | Base canvas for hero, pathways, results |
| 0-inv | Void band | `#0A0C0A` | Full-bleed thesis, join, footer, loader |
| 1 | Card | `#FCFBF8` | Way cards and results cards on parchment |
| 1-inv | Void hover | `#111511` | Hover state of thesis gap rows |
| 2 | Stripe plate | `#E7E4DC` / `#EFEDE6` repeating −45° | Hero visual and image placeholder plates |
| 3 | Nav veil | `rgba(247,246,242,.92)` + 10px blur | Sticky nav over scrolling content |

## Elevation

There is effectively none. The landing rejects shadows entirely — no card, button, or band casts one. Hierarchy is achieved by three flat means: surface steps of a few points of lightness (`#F7F6F2` → `#FCFBF8`), hairline borders whose alpha rises on hover (`.15` → `.35`/`.4`), and wholesale inversion to the void band. The single "floating" element, the sticky nav, separates itself with a hairline and a backdrop blur rather than a drop shadow. Any future component that seems to need a shadow should instead get a border or a surface step.

## Imagery

No photography ships today. Imagery slots are drafted as **striped placeholder plates**: the `-45°` repeating gradient of `#E7E4DC`/`#EFEDE6` in 14px bands, framed by an ink hairline, annotated with a bracketed mono caption (e.g. `[ PROJECT PHOTO — PROTOTYPE BENCH SHOT ]`, strings from data). The hero plate layers registration graphics on top: a centered rectangular frame, perimeter `+` crosshairs in a 4×4 grid, and fading horizontal rules — a technical-drawing vocabulary. Decorative glyphs are typographic, not iconographic: ✳ dividers, `+` crosshairs, and per-card marks (⌗ ⊞ ⇄ ◨) rendered as mono characters inside bordered chips. When real photography arrives it must replace only the stripe fill, keeping the frame, radius, and caption conventions.

## Layout

Single-column, center-axis page composed of full-width horizontal bands: loader → sticky nav → hero → ✳ divider → dark thesis band → ✳ divider → pathways → ✳ divider → results → dark join band → footer. There is no global max-width container; sections run edge-to-edge with an 18px gutter, while individual text blocks self-constrain (420–760px) and the footer caps at 1100px. Vertical rhythm uses viewport-relative clamps that escalate toward the close: hero `clamp(48px,8vh,90px)` top, results `clamp(56px,9vh,96px)`, pathways `clamp(64px,10vh,110px)`, join `clamp(80px,13vh,140px)`. Alignment is centered in hero, pathways, and join; left-aligned in results and inside all card interiors on the dark band. Responsiveness is intrinsic, not breakpoint-driven: `clamp()` type and padding, `auto-fit minmax(min(100%,380px),1fr)` for the thesis split, `min()` card widths, flex-wrap CTA clusters, and a horizontally scrolling results rail. The only breakpoint switch is Tailwind `sm:` revealing the center nav links (`hidden … sm:flex`).

## Agent Prompt Guide

Quick Color Reference:

- **Text:** `#111311` on light; `#F2F0E8` on dark; muted `#5A615B` (light) / `#8B948C` (dark)
- **Background:** page `#F7F6F2`; dark bands `#0A0C0A`; cards `#FCFBF8`
- **Border:** `rgba(17,19,17,.12–.15)` at rest on light; `rgba(242,240,232,.12)` on dark; hover raises alpha to `.35–.4`
- **Accent:** gold `#C28E0E` (glyphs, loader, join CTA); forest green `#1E4D2B` (hovers, pathway titles)
- **Primary action:** ink block `#111311` → hover `#1E4D2B` on light; gold block `#C28E0E` → hover `#D8A62A` on dark

Example Component Prompts:

1. "Add a new gap row to the thesis band: border-b `rgba(242,240,232,.12)`, padding `clamp(24px,3.5vw,44px)` x `clamp(24px,3vw,36px)`, hover bg `#111511`; a 26px `rounded-[3px]` chip with `rgba(242,240,232,.3)` border holding a gold `#C28E0E` IBM Plex Mono glyph; title 14px semibold tracking .02em `#F2F0E8`; body 12.5px leading 1.7 `#8B948C` max-w 460px. Copy goes in `homeLandingCopy.thesis.gaps`, and the row gets `data-reveal` with a delay continuing the `120 + index * 110` stagger."
2. "Create a third pathways card: `min(300px,86vw)` wide, bg `#FCFBF8`, square corners, border `rgba(17,19,17,.15)` hover `.4`, padding `34px 26px`, centered column gap 14px; 34px `rounded-[4px]` glyph chip (border `.25` ink, mono 15px `#111311`); title 14px semibold `#1E4D2B`; body 12px leading 1.75 `#5A615B`. Add the copy object to `homeLandingCopy.pathways.ways`."
3. "Add a section eyebrow + heading: eyebrow in IBM Plex Mono 10px uppercase tracking .24em (`#5A615B` on light, `#8B948C` on dark) with `data-reveal`; heading in Newsreader weight 500, `clamp(26px,3vw,38px)`, leading 1.2–1.3, wrapped in an `overflow-hidden` div, with `data-reveal data-reveal-delay='110'`."
4. "Add a CTA pair to a dark band: primary `rounded-[2px]` bg `#C28E0E` text `#0A0C0A` px-[26px] py-3 mono 10.5px tracking .12em hover `#D8A62A`; secondary transparent, border `rgba(242,240,232,.3)`, text `#F2F0E8`, hover border and text `#C28E0E`; wrap both in a flex row gap-[14px] with `data-reveal data-reveal-delay='200'`."
5. "Insert a light section divider between two sections: flex row, padding 14px 18px, gap 18px, four ✳ stars (mono 11px, `rgba(17,19,17,.5)`) alternating with 1px flex-1 lines (`rgba(17,19,17,.25)`), `aria-hidden='true'` — i.e. reuse the `Divider` component in `HomeLanding.tsx`."

## Scale Philosophy

The scale is a deliberate two-pole system with a hollowed-out middle. At one pole, fluid serif headlines (`clamp()` ranges topping out at 36–58px) do all the emotional work; at the other, a dense ladder of mono micro-sizes (8.5 → 13px, differentiated by half-point steps and tracking) does all the informational work. Sans body copy occupies a narrow 12–13px band between them. There is almost no "medium" type — no 18–22px subheads — and that absence is the point: the page reads as proclamation plus annotation. An agent must not flatten this: do not introduce intermediate sizes, do not bump micro labels up "for readability" (raise contrast or tracking instead), do not convert clamps to fixed pixels, and do not let any mono label exceed 13px or any serif heading fall below its clamp minimum. When adding a new text role, adopt the nearest existing row of the type-scale table rather than inventing a size.

## Subsidiary Pages (Contact, Get Involved)

`/contact` and `/get-involved` are the landing's primary exits (`homeLandingCopy.links`), but today they are **not** part of this system. Both are built on the global industrial-studio kit governed by root `DESIGN.md`: `font-display` heroes at `clamp(40px,7vw,76px)` extrabold uppercase with `leading-[.92]` and `tracking-[-.03em]`, `text-outline` and `text-accent` accents, the `Eyebrow` component (accent-red mono kicker per DESIGN §5.3), glass `Card` surfaces (`bg-white/[.42]`, `border-white/60`, `backdrop-blur-[6px]`, `rounded-lg`, `shadow-card`), the studio `Button` (1.5px ink border, uppercase display face, hover lift `-translate-y-0.5`, `ease-studio`, `accent-blue` focus ring), and `pt-[120px]` page tops under the global site nav.

The visual transition boundary is therefore hard: leaving `/` swaps fonts (Newsreader/Plex → the studio display/mono stack), palette (parchment/forest/gold → studio ink/signal red), chrome (the landing's own sticky mono nav and dark footer → the global site header/footer), and elevation language (borders-only → glass + shadow + hover lift). This is a known, accepted seam.

Any future restyling of these two pages toward the landing's warm editorial language is **directional only and lives in this document**; it is pending explicit Head Designer approval and must not be started speculatively. Do not invent a hybrid palette, do not port landing tokens into `components/ui/*`, and do not partially reskin either page — until approval, both pages remain faithfully on the studio kit.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors — from components/home/home-landing.css + HomeLanding.tsx */
  --dg-bg: #f7f6f2;
  --dg-ink: #111311;
  --dg-green: #1e4d2b;
  --dg-gold: #c28e0e;
  --dg-gold-bright: #d8a62a;
  --dg-dark: #0a0c0a;
  --dg-dark-hover: #111511;
  --dg-cream: #f2f0e8;
  --dg-muted: #5a615b;
  --dg-muted-dark: #8b948c;
  --dg-card: #fcfbf8;
  --dg-stripe-a: #e7e4dc;
  --dg-stripe-b: #efede6;
  --dg-selection: rgba(194, 142, 14, 0.3);
  --dg-nav-bg: rgba(247, 246, 242, 0.92);

  /* Hairlines */
  --dg-line: rgba(17, 19, 17, 0.25);
  --dg-line-soft: rgba(17, 19, 17, 0.12);
  --dg-line-card: rgba(17, 19, 17, 0.15);
  --dg-line-strong: rgba(17, 19, 17, 0.4);
  --dg-line-dark: rgba(242, 240, 232, 0.12);
  --dg-line-dark-mid: rgba(242, 240, 232, 0.18);
  --dg-line-dark-strong: rgba(242, 240, 232, 0.3);

  /* Fonts — loaded via next/font in app/page.tsx */
  --font-home-serif: 'Newsreader', serif;        /* 400 / 500 / 600 */
  --font-home-sans: 'IBM Plex Sans', sans-serif; /* 400 / 500 / 600 */
  --font-home-mono: 'IBM Plex Mono', monospace;  /* 400 / 500 */

  /* Type scale */
  --dg-type-hero: clamp(34px, 5vw, 58px);
  --dg-type-join: clamp(28px, 3.6vw, 46px);
  --dg-type-results: clamp(26px, 3.2vw, 40px);
  --dg-type-thesis: clamp(26px, 3vw, 38px);
  --dg-type-pathways: clamp(24px, 3vw, 36px);
  --dg-type-loader: clamp(30px, 4.5vw, 44px);
  --dg-type-stat: 24px;
  --dg-type-card-title: 14px;
  --dg-type-body: 13px;
  --dg-type-card-body: 12.5px;
  --dg-type-wordmark: 13px;
  --dg-type-subline: 11px;
  --dg-type-nav: 10.5px;
  --dg-type-cta: 10.5px;
  --dg-type-eyebrow: 10px;
  --dg-type-micro: 9.5px;

  /* Shape */
  --dg-radius-cta: 2px;
  --dg-radius-chip-sm: 3px;
  --dg-radius-chip: 4px;
  --dg-radius-card: 8px;
  --dg-radius-plate: 10px;

  /* Spacing & layout */
  --dg-gutter: 18px;
  --dg-divider-gap: 18px;
  --dg-card-gap: 22px;
  --dg-section-hero-top: clamp(48px, 8vh, 90px);
  --dg-section-results: clamp(56px, 9vh, 96px);
  --dg-section-pathways: clamp(64px, 10vh, 110px);
  --dg-section-join: clamp(80px, 13vh, 140px);
  --dg-footer-max: 1100px;
  --dg-hero-max: 760px;
  --dg-heading-max: 640px;

  /* Motion */
  --dg-ease-reveal: cubic-bezier(0.22, 1, 0.36, 1);
  --dg-ease-loader-exit: cubic-bezier(0.76, 0, 0.24, 1);
  --dg-ease-loader-bar: cubic-bezier(0.65, 0, 0.35, 1);
  --dg-duration-reveal: 0.8s;
  --dg-duration-loader-exit: 850ms;
  --dg-duration-loader-bar: 1.8s;
  --dg-loader-dwell: 1900ms; /* homeLandingCopy.motion.loaderMs; 250ms reduced-motion */
  --dg-reveal-rise: 18px;
}
```

## Governance

- This document is **authoritative for `/` (the home landing)** and for the subsidiary-page restyling direction noted in "Subsidiary Pages." The root `DESIGN.md` (industrial studio) governs every other route, including `/contact` and `/get-involved` as they exist today.
- Values in this doc are extracted as-implemented from `app/page.tsx`, `components/home/HomeLanding.tsx`, `components/home/home-landing.css`, and `lib/data/homeLanding.ts`. If code and this doc diverge, reconcile deliberately — do not silently drift either side.
- Token-faithful adjustments (reusing documented colors, type rows, spacing, and motion exactly as specified) may proceed within the landing. **Any change beyond that — new tokens, new type sizes, new motion patterns, palette shifts, or any restyling of the subsidiary pages — requires explicit Head Designer approval BEFORE implementation.**
- Agents must read this document in full before touching landing UI, and must route all copy changes through `lib/data/homeLanding.ts`.
