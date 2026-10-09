# Current-site audit — DIGITAL @ Cal Poly Pomona

W1-AUDIT · 2026-10-02 · worktree `design-lab/exploration` at `5693b8d` (same tree as production `feature/site-consolidation`).
Scope: ORIGINAL_PROMPT §1 (non-destructive inspection) + §22 groundwork. Companion files:
`research/content-inventory.md` (every real fact) and `research/ia-proposal.md` (IA + homepage narrative).

Renders: `renders/current/*.png` (shoot.mjs full-page) and `renders/current/states/*.png`
(`scripts/capture-states.mjs` — revealed / forced / scroll-state captures; see §9).

---

## 0. Verdict in five lines

1. **4 of 9 public routes ship blank to real users.** `/about`, `/get-involved`, `/projects`, `/community` wrap content in `<Reveal>` but nothing calls `useReveal`, so every block stays `opacity:0` forever (§9.2). Production bug, not a capture artifact.
2. **The brand system on paper (DESIGN.md) is strong and specific; the code is two generations behind it.** Code still runs gold/forest accents, "engineering club" copy, and a Tailwind-slate + indigo palette on the smartphone route.
3. **Real content is thin**: 2 projects, 0 named people, 0 real photos of student work, 0 dated milestones, 1 named mentor. Any IA has to be sized to that (see `ia-proposal.md`).
4. **Worth keeping**: the thesis line, the warm-paper/ink/mono register, the Sign-Off Block + Build Record concepts (DESIGN.md §4, §14), the smartphone subsystem content model, Smart Reading's POV/RSVP beat.
5. **Generic / must go**: legacy `UI_Pages/` (blue SaaS template with unverified sponsors/stats), smartphone route palette (slate + `#818CF8` indigo), the 7-card D·I·G·I·T·A·L acronym grid, filter chips/search for 2 projects.

---

## 1. Architecture

| Item | Fact | Cite |
|---|---|---|
| Framework | Next.js 14 App Router, React 18, TS strict, Tailwind 3.4 | `package.json` |
| Output | `output: 'export'` in production only; `images.unoptimized: true` | `next.config.js:4,12` |
| Chrome | Global `Navbar` + `Footer` in root layout; both return `null` on "immersive" routes (`/`, smartphone, smart-reading) which render their own chrome | `app/layout.tsx:80-84`, `lib/immersiveRoutes.ts:1-11` |
| Routes (public) | `/` · `/projects` · `/projects/modular-smartphone` · `/projects/smart-reading` · `/about` · `/team` · `/community` · `/get-involved` · `/contact` · legal ×3 | `app/sitemap.ts` |
| Routes (internal/legacy) | `/review` (stakeholder hub), `/pillars` (redirect stub) | `lib/data/reviewRoutes.ts`, `app/pillars/page.tsx` |
| Content | All copy in `lib/data/*` (13 files). Canonical mission strings in `lib/data/mission.ts` with a stated copy workflow | `lib/data/mission.ts:1-9` |
| Analytics | Vercel Analytics + Speed Insights (cookieless) | `app/layout.tsx:87-88` |
| Contact form | Formspree endpoint is a placeholder `YOUR_FORM_ID`; page degrades to `mailto:` | `lib/data/siteConfig.ts:31`, `app/contact/page.tsx:20` |

### Dependencies (installed, relevant to the lab)

`gsap ^3.13` (+ScrollTrigger, SplitText registered in `components/motion/gsapSetup.ts`), `framer-motion ^11.18`,
`animejs ^4` (smartphone loader), `lenis ^1.3` (smart-reading only), `three ^0.169` + `@react-three/fiber ^8.18`
+ `@react-three/drei ^9.122` (smart-reading), `lucide-react`, `clsx`/`tailwind-merge`, `playwright` + `sharp` (dev).
Not installed: Motion One/`motion`, Rough.js, COBE, Recharts, dnd-kit, TypeGPU.

### Dead code (no importer)

- `components/teardown/*` + `lib/teardown/*` — the scroll-frame teardown engine. `Teardown` is imported by nothing.
  Its assets are still shipped: `public/assets/frames` (9.0 MB), `public/assets/teardown` (5.9 MB), `public/assets/layers` (0.9 MB).
- `components/ui/{Badge,Button,Card,Icon,Input,Section,Select,Textarea,Timeline}.tsx` — 0 importers (studio-era kit).
  `Eyebrow` is used only by `/review`.

---

## 2. Design system — documented vs shipped

### 2.1 Governing documents

| Doc | Status | What it says |
|---|---|---|
| `DESIGN.md` (1054 lines, rewritten #0052) | Authoritative brand layer | "Drawing office that ships." Thesis, 4 beliefs, FIND→PROVE→MAKE→SHIP→SIGN pipeline, Sign-Off Block, DG-### artifact IDs, discipline codes, signal red as the single mark | 
| `docs/design/BRAND.md` | Authoritative voice | Promise → Proof → Invitation; banned filler list; per-page spines | 
| `docs/design/landing.DESIGN.md` | As-built spec for `/` + secondary routes | Gold/forest era — predates DESIGN.md rewrite |
| `docs/design/smartphone.DESIGN.md`, `glasses.DESIGN.md` | As-built immersive specs | Own palettes + studio type stack |
| `prototypes/brand-system.html` (898 lines) | Prototype of DESIGN.md | The only artifact that actually renders the new system (`renders/current/brand-prototype-*.png`) |

DESIGN.md §0.3 lists 6 open reconciliation items (R1–R6), **all "Pending"** (`DESIGN.md:72-79`). The shipped site is the pre-R1 state.

### 2.2 Color

| Token (shipped) | Value | Cite | DESIGN.md target |
|---|---|---|---|
| bg / paper | `#f7f6f2` | `app/globals.css:34` | same (`--paper`) |
| ink | `#111311` | `globals.css:35` | same |
| muted | `#5a615b` | `globals.css:42` | same (`--graphite`, 5.9:1) |
| dark band | `#0a0c0a` / cream `#f2f0e8` | `globals.css:39,41` | same (`--void` / `--cream`) |
| **accent** | **gold `#c28e0e`** | `globals.css:125` | signal red `#D8412F` (R1) — gold demoted to `--warn` |
| secondary accent / focus | forest `#1e4d2b` | `globals.css:126,132` | focus = blueprint `#1C6CFF` |
| error | `#9c3a2a` | `globals.css:137` | same |
| hairlines | 10 ink-alpha + 5 cream-alpha steps | `globals.css:51-67` | same — this ladder is good |
| Legacy studio kit | `--studio #d6d4d3`, `--accent #d8412f`, `--accent-2 #1c6cff` | `globals.css:12-25` | retire (R5) |
| Smartphone route | Tailwind slate `#0F172A/#F1F5F9/#94A3B8/#CBD5E1` + indigo `#818CF8` CTAs + 7 subsystem accents incl. purple `#C084FC` | `components/phone-v2/*.tsx`, `lib/data/phoneV2.ts:11-18` | DESIGN.md §7.6 prohibits purple/violet and "AI-startup tell" |
| Smart Reading route | paper `#e9dfc8`, charcoal, gold `#e3b341`, phosphor HUD green | `lib/data/experiments/glasses.ts:69-81` | route-local; acceptable as a "project color" (§7.5) |

Net: **3 different palettes ship across 3 surfaces.** The home/secondary paper+ink system is the one to build on.

### 2.3 Typography

- Landing stack: Newsreader (serif promise) / IBM Plex Sans (proof) / IBM Plex Mono (record) via `next/font` (`lib/fonts.ts:27-46`). Matches DESIGN.md §8.
- Studio stack: Archivo / Hanken Grotesk / DM Mono (`lib/fonts.ts:48-70`) for the two immersive routes.
- **Defect — studio stack never renders.** Tailwind maps `font-display/body/mono` to the literal names `'Archivo'`, `'"Hanken Grotesk"'`, `'"DM Mono"'` (`tailwind.config.ts:54-56`) instead of `var(--font-display)` etc. next/font registers hashed families (`__Archivo_03f655`). Probe on `/projects/modular-smartphone/`: h1 computed `Archivo, system-ui, sans-serif`; `__Archivo_*` status `unloaded`. Both immersive routes fall back to system-ui (DejaVu Sans Bold in the renders; Segoe UI on Windows).
- **Body copy is small**: 12–13px body, 8.5–10.5px mono labels/nav/CTAs (`globals.css:76-85`, DESIGN.md §8.4). 9px mono at `.14em` on paper is legible on retina, marginal on 1x Windows and fails the BRIEF's "responsive text" bar. Any concept should raise the floor to ≥15–16px body, ≥11px mono.
- **Glyph chips render as tofu**: `⌗ ⊞ ◨` are not in IBM Plex Mono (`lib/data/homeLanding.ts:68-139`); headless shows empty boxes (crop: thesis cards in `states/home-revealed-desktop.png`). Platform-dependent — risky as an identity device.
- Six font families are attached to `<body>` on every route (`app/layout.tsx:61-68`); the studio three are `preload:false`, so cost is low, but the stack is muddled.

### 2.4 Geometry

Gutter 18px; radii 2px (CTA) / 3–4px (chips) / 8px (cards) / 10px (plates) (`globals.css:88-96`); no max-width container on landing bands, `max-w-content 1180px` on utility pages (`tailwind.config.ts:72`). Shadows exist in Tailwind (`pill`, `card`) but the landing uses none. Hairline-first, flat — good and on-brand.

### 2.5 Motion

| Where | Mechanism | Cite |
|---|---|---|
| `/` | 1.9s full-screen loader ("INITIALIZING SYSTEMS") then hero word stagger; IntersectionObserver reveals start at loader+200ms; 7s safety timer reveals all | `components/home/HomeLanding.tsx:43-96`, `lib/data/homeLanding.ts:46,195` |
| Secondary routes | CSS `[data-reveal]` rise-in, 0.8s `cubic-bezier(.22,1,.36,1)` | `app/globals.css:161-172` |
| Smartphone | anime.js loader, GSAP SplitText `TextReveal`, sticky 100svh schematic stage with explode values 0.95→0.12 | `components/phone-v2/Loader.tsx`, `SubsystemStage.tsx:192`, `lib/data/phoneV2.ts:160-286` |
| Smart Reading | Lenis inertial scroll + R3F; 460vh container, sticky canvas; snap inside panel zone | `components/experiments/glasses/GlassesExperience.tsx:89,135-138` |
| Global | Crosshair cursor (progressive enhancement) | `components/ui/CursorProvider.tsx`, `app/layout.tsx:13` |
| Reduced motion | Global `*` transition/animation collapse + reveal override | `globals.css:180-201` |

Loader on `/` delays the thesis by ~2s on every visit — contradicts §9 "animation that delays information".

---

## 3. Reusable components / patterns (worth carrying into concepts)

| Pattern | Where | Keep because |
|---|---|---|
| `PageShell` eyebrow → serif H1 → mono meta row | `components/layout/PageShell.tsx:18-36` | Clean, consistent page register |
| `useReveal` + `<Reveal>` | `lib/useReveal.ts`, `components/ui/Reveal.tsx` | Fine primitive — just needs to be wired (§9.2) |
| `TextReveal` (GSAP SplitText, armed pre-state + noscript un-arm) | `components/motion/TextReveal.tsx` | Robust line reveal with failure fallback |
| `PhoneSchematicSvg` — SVG exploded phone with part ids | `components/phone-v2/PhoneSchematicSvg.tsx` | Procedural, brand-correct "exploded view" register (DESIGN.md §9.4) — re-skin, don't redraw |
| `TickScrubber` / `WorkflowRail` | `components/phone-v2/` | Mono instrument furniture — fits FIND→SIGN stage rail |
| Glasses POV + RSVP HUD | `components/experiments/glasses/HudOverlay.tsx`, `PovBackground.tsx` | The single most distinctive interaction on the site |
| Team placeholder card + dashed "Lead a project" slot | `app/team/page.tsx` | Honest empty state; seed of the "unsigned block" recruitment device |
| `Navbar` mobile menu with focus return | `components/layout/Navbar.tsx:43-56` | Accessible |
| Contact `?type=` → topic mapping | `lib/data/contactTopics.ts:15-36` | Lets every CTA pre-fill intent |

## 4. Brand assets (paths)

| Asset | Path | Notes |
|---|---|---|
| Exploded Mark + wordmark lockup | `public/assets/landing/DIGITAL_V1_Logo1_Full.png` (732 KB) | **Raster only, white background.** Footer applies CSS `invert` → renders as a black box with a visible rectangle (`HomeLanding.tsx:527`, every footer render). Needs an SVG. |
| Mark (light / dark) | `public/assets/landing/DIGITAL_V1_Logo1.png` (709 KB), `…_DarkMode.png` (449 KB) | Raster; used by `BrandLogo` |
| Hero photo — drafting table | `public/assets/landing/Landing-Page-Hero.png` (**8.2 MB PNG**, shipped unoptimized) | DESIGN.md §10.1 calls it the photography template. Origin not documented (could be generated) — confirm before treating as "real bench photography". |
| Teardown render frames (phone, 12 steps) | `public/assets/frames/frame-01…12-*.{avif,webp,png}`, `public/assets/teardown/frames/f-*.webp`, `teardown.{mp4,webm}`, `teardown-poster.jpg` | Generic phone renders from the Refractor build (`Refractor/hardware-teardown-site/README.md`); **not the club's device**. Unused by any route. |
| Layered phone parts | `public/assets/layers/layer-01…06-*.webp` | Same source; unused |
| Reading POV backgrounds | `public/assets/experiments/glasses/BookBG_{Blurry,Clear}.png` | Used by Smart Reading POV beat |
| 3D models | `public/assets/experiments/glasses/Sunglasses.fbx`, `vuzix-re2-hipoly.fbx` | Opt-in via `?model=`; default is a **procedural** glasses model (`GlassesModel.tsx:7-25`) — i.e. no model of the real prototype exists |
| Placeholder SVGs | `public/images/placeholders/{general,projects,team}/*.svg` | `/projects` and both project records use `modular-phone.svg` — Smart Reading's `image` points at the phone placeholder (`lib/data/projects.ts:72`) |
| Legacy mockups | `UI_Pages/*/screen.png` + `code.html` (7 pages) | 2023 blue SaaS template: "Building the Future", "Backed by industry leaders: Autodesk, NVIDIA", 120+/15/50k+/8 stats, "Room 123, Building 9". **Unverified/contradicted — do not reuse any fact from here.** |
| Brand prototype | `prototypes/brand-system.html` | Best existing expression of DESIGN.md |

**No real photography of members, prototypes, benches, or events exists in the repo.**

## 5. Responsive behavior

- Breakpoints: Tailwind default + `xs 375`, `nav 820` (`tailwind.config.ts:49-52`); DESIGN.md §12.3 names 375/768/1024/1440.
- Home nav: 3-col grid; on `<sm` links drop to a second hairline row (no hamburger) (`HomeLanding.tsx:161-186`). Works at 390.
- Home "Build record" is a horizontal `overflow-x-auto` strip (`HomeLanding.tsx:364`): at 1440 the 3rd case (Venture Studies) is fully off-screen with no affordance; at 390 one card is cropped mid-stat.
- Global Navbar: hamburger menu below `nav` (820px).
- Smart Reading mobile (`states/glasses-mobile-000.png`): pill nav overflows 390px (logo and "Join the build" clipped); 3D glasses render **over** the lede and CTA; decorative star overlaps the eyebrow and headline. Desktop also has a star overlapping "POMONA" (`states/glasses-desktop-000.png`).
- Smartphone mobile: sticky stage disabled under reduced motion; headline at `99-end` collides with the `← DIGITAL` back link.
- No horizontal page overflow at 390 on `/` (scrollWidth 390).

## 6. Copy voice

Strong, concrete lines that are earning their place:
- "Make something worth putting your name on." (`homeLanding.ts:56`)
- "Coursework describes systems. We build them." (`homeLanding.ts:65`)
- "One device. Owned in parts. Take a subsystem." (`phoneV2.ts:115`)
- "Read without the chase." / "The words move so your eyes don't have to." (`glasses.ts:98-99`)
- "Run by students. Built in the open." (`app/team/page.tsx:99`)
- "Tell us what you want to build." (`app/contact/page.tsx:128`)

Contradictions and weak spots:
- **Positioning conflict.** DESIGN.md §1: "It is **not** an engineering club." Shipped: `<title>` "Engineering Club @ Cal Poly Pomona" (`app/layout.tsx:21`, `app/page.tsx:6`), `siteConfig.description` "student-run engineering club" (`siteConfig.ts:6`), `/about` H1 "A student-run engineering club." (`app/about/page.tsx:46`), mission statement (`homeLanding.ts:159`). Hero subline says "venture studio" (`homeLanding.ts:57`). R2 pending.
- **Numbers disagree with each other** (see content-inventory §5): smartphone "25+ student engineers" vs "40+ members" vs site "120+ active members"; "4 core modules" vs "7 subsystems"; KiCad vs "Altium, SolidWorks".
- **Implausible spec claims** on the smartphone record: an ESP32-S3 "running custom Android kernels" with "WiFi 6" (`projects.ts:8,58`). ESP32-S3 is a microcontroller with 802.11 b/g/n; it does not run Android. Today `/projects` renders the flagship's `fullDescription` (`app/projects/page.tsx:137`), so the Android line is not shown; `specifications`, `modules`, `timeline` and `stats` are rendered nowhere. Note: lab route `app/design-lab/type-lab/page.tsx:63,74` already renders `phone.shortDescription` + `stats` (Android claim, "25+"). Treat as unverified; never put on a concept.
- Mission beats, D·I·G·I·T·A·L acronym, FIND→SIGN pipeline, thesis gaps, and pathways = **5 parallel frameworks** for "how we work". DESIGN.md §3.1 already says never show two in one section; the site shows four across `/` and `/about`.
- Homepage says "Two ways in" but `/get-involved` lists 11 options across 3 audiences (`involvement.ts`).
- BRAND.md-banned register mostly avoided. Remaining generic: "Redefining repairability and customization in consumer electronics" (`projects.ts:9`), "Close the gap. Build with us." is fine but echoes the retired "gap" triptych.

## 7. What is strong — keep

1. Thesis + Sign-Off Block idea (DESIGN.md §2.1, §4): a brand device that *is* the positioning (names on work). Nothing generic about it.
2. Paper/ink/hairline/mono register on `/` and secondary pages — calm, documentary, distinct from student-club and SaaS sites.
3. Build Record anatomy (DESIGN.md §14.1) — the right shape for "projects as hero" (§41).
4. Smartphone subsystem content model: 7 owners × (description, 3 bullets, scope/risk/mode) (`phoneV2.ts:140-288`). Best real content on the site for "how teams work".
5. Smart Reading's wearer-POV RSVP beat — a working demo of the product idea, not decoration.
6. Honest placeholders: team TBA cards, striped `[ PROJECT PHOTO — … ]` plates, community "nothing here yet" shelves.

## 8. What is generic or off-brand — drop or rethink

1. `UI_Pages/` template and every number in `siteConfig.stats` (`siteConfig.ts:34-39`; not rendered today — keep it that way).
2. Smartphone route skin: slate-navy + indigo CTA + glow + 7-color accent rail = dev-tool/AI-startup look the BRIEF bans.
3. Loader screens on `/` and smartphone ("INITIALIZING SYSTEMS") — terminal cosplay, delays content.
4. `/about` 7-card acronym grid + 3 phases + roadmap + board + CTA — a framework wall; mostly repeats `/`.
5. `/projects` catalogue with search box and 5 category filters for 1 listed item (Hardware/Software/Embedded/Robotics are all empty).
6. Footer raster logo in a black box; tofu glyph chips.
7. Floating decor (stars, leaves, dot grids) on Smart Reading — random ornament, overlaps copy.

---

## 9. Render defects — what the screenshots show and why

### 9.1 Home full-page blank bands — cause confirmed (not GSAP)

The home page uses **no GSAP and no pinning.** The blank bands in `renders/current/home-*.png` are 28 `[data-reveal]`
blocks still at `opacity:0`:

1. `HomeLanding` only starts observing reveals at `loaderMs + 200` = 2.1s after mount (`HomeLanding.tsx:86-88`).
2. `shoot.mjs` scrolls right after `networkidle` (before 2.1s), with 120ms steps.
3. `html { scroll-behavior: smooth }` (`globals.css:147`) turns each `window.scrollTo` into an interrupted smooth scroll — the probe measured `scrollY` reaching only 497px of 4400.
4. Full-page capture does not scroll, so off-screen IntersectionObservers never fire; the 7s safety timer is beyond the 1.5s settle.

Probe result: after a shoot.mjs-style scroll, hidden = 28/28; after waiting 2.6s and instant-scrolling, hidden = 1/28.
Real users scrolling the page see content. **Capture artifact only.** `states/home-revealed-{desktop,mobile}.png` show the true page.

Note for all lab agents: shoot.mjs full-page captures of *any* route using `[data-reveal]` will look blank. Use
`capture-states.mjs` or `--viewport-only`, or have shoot.mjs scroll with `behavior:'instant'` (orchestrator's call; I did not change it).

### 9.2 `/about`, `/get-involved`, `/projects`, `/community` — PRODUCTION BUG

These pages wrap content in `<Reveal>` (sets `data-reveal` → `opacity:0` via `globals.css:161-167`) but **no component on
those routes calls `useReveal()`**. Only `/team` (`app/team/page.tsx:80`) and `/contact` (`app/contact/page.tsx:39`) do.

| Route | `[data-reveal]` blocks | Hidden after real scroll |
|---|---|---|
| `/about` | 31 | 31 |
| `/get-involved` | 16 | 16 |
| `/projects` | 5 | 5 |
| `/community` | 5 | 5 |
| `/team`, `/contact` | 13, 5 | 0, 0 |

Users without `prefers-reduced-motion` see only the H1 and the footer on 4 routes, including the primary nav's
"Projects" and "Join". Fix (production, not this lab): call `useReveal` in a client wrapper (e.g. make `PageShell`'s body
a client component holding the ref). `states/*-forced-*.png` show the intended content with `.is-visible` forced.

### 9.3 Other visible defects

| # | Route | Defect | Evidence |
|---|---|---|---|
| D1 | `/get-involved` | "Dark contrast band" for General Meetings has cream text but **no dark background** → cream-on-paper, unreadable | `app/get-involved/page.tsx:110-114`; `states/get-involved-forced-desktop.png` |
| D2 | both immersive routes | Studio fonts never load (§2.3) | font probe; DejaVu headlines in `states/phone-*`, `states/glasses-*` |
| D3 | all footers | Raster logo inverted → black box | `HomeLanding.tsx:527`, `components/layout/Footer.tsx` |
| D4 | `/` | Glyph chips render as tofu | `states/home-revealed-desktop.png` thesis + results cards |
| D5 | `/` | Results strip hides 3rd case off-screen with no scroll cue | `HomeLanding.tsx:364` |
| D6 | `/projects/smart-reading` mobile | Pill nav clipped; 3D model covers lede + CTA; decor overlaps headline | `states/glasses-mobile-000.png` |
| D7 | `/projects/smart-reading` | 15%–45% of scroll is an empty dark/olive screen while the model transitions | `states/glasses-desktop-030.png`, `-045` |
| D8 | `/projects` | Flagship plate is a generic SVG phone labelled "Placeholder Image"; 4 of 5 filter chips return nothing | `states/projects-forced-desktop.png` |
| D9 | `/` | 8.2 MB hero PNG with `unoptimized` images → LCP risk on mobile | `next.config.js:12`, `public/assets/landing/Landing-Page-Hero.png` |
| D10 | `/projects/modular-smartphone` mobile | Final headline collides with `← DIGITAL` link | `states/phone-mobile-99-end.png` |

Capture caveat: shoot.mjs **mobile** full-page PNGs (DSF 2) stitch incorrectly on long pages — `home-mobile.png` repeats the
hero after the mission band, though the real page (5190px) ends with join + footer. Verified with a viewport shot at
y=3900. Treat mobile full-page PNGs as approximate; confirm with viewport shots.

---

## 10. Implications for concepts (short)

- Build on paper/ink/mono + Sign-Off/Build Record; replace gold with one mark color; raise the type floor.
- Projects must carry honest placeholders: there are no photos, no named contributors, no dates. Design the empty
  state as a feature (unsigned block, striped plate, `MISSING` cells), not a hole.
- Never pull numbers from `siteConfig.stats`, `UI_Pages/`, or the smartphone `specifications` block.
- Don't depend on scroll-reveal for content visibility; content must be visible without JS/IO.
