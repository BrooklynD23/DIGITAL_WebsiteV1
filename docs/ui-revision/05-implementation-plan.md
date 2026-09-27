# 05 — Implementation Plan

## 0. Branch

| | |
|---|---|
| Source branch | `main` (`1e1a9da`) |
| Working branch | **`claude/digital-ui-revision-zjb8zr`** — already checked out, working tree clean, `0` ahead / `0` behind `origin/main` |
| Created? | Already exists locally and on `origin`; no creation needed |
| Dirty files | **None** at planning time (`git status --porcelain` empty) |
| Naming | Repo merge history shows `feature/*` (`feature/brand-story-gsap`, `Admin-Dashboard`). The session's standing directive pins this work to `claude/digital-ui-revision-zjb8zr`, which takes precedence over the brief's fallback name `ui-revision` |
| Risks | Deploys run from the `deployment` branch only (`vercel.json`), so nothing ships from this branch. `main` deployment is disabled. No push, merge, or PR until every batch and check is complete |
| Environment | **`node_modules` is absent** — `npm ci` is required before any check runs |

## 1. Architectural decisions

### D1 — Promote the landing tokens to `:root`; do not port them into `components/ui/*`

`landing.DESIGN.md:252` says *"do not port landing tokens into `components/ui/*`."* That rule
exists to stop the two systems blending inside shared primitives. It is honoured by inverting
the dependency: **tokens move up to `:root`, and components consume tokens** — no landing value
is ever hardcoded into a primitive.

`docs/design/landing.DESIGN.md:258-337` already specifies ~64 custom properties. Only 11 are
declared today and 5 are consumed; the rest live as inline literals (71 in `HomeLanding.tsx`
alone). Batch 1 implements that published block verbatim in `app/globals.css` `:root`, adds a
thin semantic layer on top, and re-points `.home-landing` at it. **No new design values are
invented — this is implementing an approved spec that was never built.**

```
:root {
  /* raw — verbatim from landing.DESIGN.md:258-337 */
  --dg-bg --dg-ink --dg-green --dg-gold --dg-gold-bright --dg-dark --dg-dark-hover
  --dg-cream --dg-muted --dg-muted-dark --dg-card --dg-stripe-a --dg-stripe-b
  --dg-selection --dg-nav-bg
  --dg-line --dg-line-soft --dg-line-card --dg-line-strong
  --dg-line-dark --dg-line-dark-mid --dg-line-dark-strong
  --dg-type-* (16)  --dg-radius-* (5)  spacing (10)  motion (8)

  /* semantic — the layer pages and primitives actually use */
  --ds-bg: var(--dg-bg);              --ds-bg-inverse: var(--dg-dark);
  --ds-surface: var(--dg-card);       --ds-surface-hover: var(--dg-dark-hover);
  --ds-text: var(--dg-ink);           --ds-text-inverse: var(--dg-cream);
  --ds-text-muted: var(--dg-muted);   --ds-text-muted-inverse: var(--dg-muted-dark);
  --ds-accent: var(--dg-gold);        --ds-accent-2: var(--dg-green);
  --ds-border / --ds-border-soft / --ds-border-strong / (+ -inverse variants)
  --ds-focus: var(--dg-green);        --ds-selection: var(--dg-selection);
  --ds-error / --ds-success          /* NEW — see D2 */
  --ds-z-nav: 50; --ds-z-overlay: 60; --ds-z-cursor: 90; --ds-z-loader: 100;
}
```

Mirrored into `tailwind.config.ts` as a `dg` colour namespace, `fontFamily.{serif,sans,mono}`
entries for the landing stack, the 2/3/4/8/10 radius set, and the existing
`letterSpacing` tokens — so components write `border-dg-line text-dg-muted rounded-cta`, never a
hex literal. This satisfies `CLAUDE.md`'s "never hardcode raw hex in components."

### D2 — Two genuinely new tokens require sign-off

The landing has no error or success colour and no focus ring. Forms and validation need both.
Proposal, minimal and inside the existing hue family:
- `--ds-error`: a desaturated brick that is not the studio signal red — validated to ≥4.5:1 on
  `#F7F6F2`. Paired **always** with an icon and text, never colour alone (§15).
- `--ds-success`: forest `#1E4D2B` reused (already in the palette).
- `--ds-focus`: forest `#1E4D2B`, 2px ring + 2px offset. Replaces the studio electric blue
  `#1c6cff` on secondary pages.

These are the **only** new values in the entire revision and are listed in `N. Risks`.

### D3 — Delete the studio sweep and grain

`app/globals.css:36-62` paints `body::before` (radial sweep) and `body::after` (4% grain) as
fixed full-viewport layers, with `section { z-index: 2 }` lifting content above them.

After migration **no route uses them**: secondary pages move to flat parchment, `/` has its own
background, and both immersive routes paint their own (`bg-[#0F172A]`, R3F canvas). Deleting all
three rules fixes four things at once:

1. the grain bleeding over the landing's `<header>` and `<footer>` — a visible defect its own
   spec forbids (`landing.DESIGN.md:184`);
2. **root cause #4 of the smartphone transition** — the light wash that flashes over the dark
   page during the handoff (`04-smartphone-transition.md` §2);
3. two fixed compositing layers on every route (perf);
4. the `section { z-index: 2 }` hack, which is a latent stacking-context trap.

`body` background becomes `var(--ds-bg)`. **Verification required:** grep for anything relying
on `section { z-index: 2 }` before deleting (Batch 1 acceptance criterion).

### D4 — Fonts

Move both stacks into `lib/fonts.ts`. `app/layout.tsx` applies the **landing stack** (Newsreader
/ IBM Plex Sans / IBM Plex Mono) to `<body>` — it serves 13 of 15 routes, and `/` drops from six
families to three. The **studio stack** (Archivo / Hanken Grotesk / DM Mono) is declared with
`preload: false` and its variables applied by `app/projects/modular-smartphone/layout.tsx` and
`app/projects/smart-reading/layout.tsx`, which currently are bare metadata shims. Those two
routes still consume `font-display` / `font-body` / `font-mono` in 14 component files, so the
variables must remain available there. Measure in Batch 9; flip `preload` per route if FOUT is
visible on the immersive pages.

### D5 — Shell placement

There are no route groups, and the root layout is a server component that cannot read the
pathname. Introducing `app/(site)/` would relocate 12 directories for no functional gain.
Instead: a server component `components/layout/PageShell.tsx` that each secondary page wraps
itself in. Explicit, 12 small edits, zero routing risk. It owns the page top (derived from
`NAVBAR_HEIGHT`, replacing five hand-set values), the surface class, the `PageIntro`, and the
band rhythm.

### D6 — Community route name: `/community`

Chosen over `/connect`, `/media`, `/resources` because `siteConfig.community` already exists in
`lib/types.ts:77-81` with `discord` / `github` / `notion` — the repository's own vocabulary for
this concept. Nav label: "Community".

### D7 — Embeds and CSP

`vercel.json` has no `frame-src`, so `default-src 'self'` governs iframes, and `img-src` is
`'self' data:`. `docs/PRE-LAUNCH.md` §3 requires new directives be added to the **report-only**
policy first and forbids promoting to enforcing before a deployed validation pass.

- Add to the report-only policy: `frame-src 'self' https://www.linkedin.com
  https://www.youtube-nocookie.com`.
- **Do not change `img-src`.** YouTube facade thumbnails are stored locally under
  `public/images/community/` (or fall back to a drawn stripe plate), so no remote image origin
  is needed. This keeps the CSP delta to one directive.
- Every embed is lazy and interaction-gated. No Discord, LinkedIn, or YouTube script loads
  globally — the community page is the only route that can create an iframe, and only after a
  click.

### D8 — Cursor is progressive enhancement, outside the critical path

A single client component mounted once in the root layout, `dynamic(… { ssr: false })`. It never
appears in server-rendered HTML, never intercepts pointer events, and the site is fully
functional with it disabled or removed. Full spec in §4.

## 2. Component architecture

### New — `components/ui/`

| Component | Purpose |
|---|---|
| `Panel.tsx` | Flat surface: `bg-dg-card`, 1px `--ds-border`, hover raises alpha to `--ds-border-strong`, radius 4/8, **zero shadow**. Replaces glass `Card` on secondary pages |
| `GlyphChip.tsx` | Bordered mono-glyph square (26/28/34px, radius 3/4) — extracted from the three hardcoded copies at `HomeLanding.tsx:235,296,351` |
| `Divider.tsx` | The ✳ star rule, `light` / `dark` — extracted from the local `Divider` fn at `HomeLanding.tsx:13-36` |
| `PageIntro.tsx` | Eyebrow → serif promise → mono metadata row. Replaces seven inline `OutlineHeading` re-implementations |
| `SectionHeader.tsx` | Eyebrow + IBM Plex Sans 600 proof heading at `--dg-type-thesis` |
| `Reveal.tsx` + `lib/useReveal.ts` | **One** IntersectionObserver implementation (`threshold 0.1`, `rootMargin '0px 0px -6% 0px'`, unobserve on intersect). Retires the two `dangerouslySetInnerHTML` copies, the `useEffect` copy, and the `.reveal`/`.in` system |
| `TextLink.tsx` | Underline-on-hover link, external-link affordance + `rel="noopener noreferrer"` + visible "opens in a new tab" semantics |
| `EmptyState.tsx` | Bracketed mono placeholder plate — the fallback for every unconfigured community module |
| `SocialLink.tsx` | Icon + visible or `aria-label`ed text, ≥44px target. Fixes the `contact` vs `Footer` inconsistency |
| `ProfileCard.tsx` | Team member; three weights (executive / lead / manager) |
| `MediaCard.tsx` | Video facade + LinkedIn preview card |
| `FormField.tsx` | Label + control + `role="alert"` error, wrapping the existing `Input`/`Select`/`Textarea` |
| `CursorProvider.tsx` | §4 |

### Modified — `components/ui/`

| Component | Change |
|---|---|
| `Button.tsx` | Add `as` / `href` polymorphism (kills six hand-rolled copies). Add `variant: 'ink' \| 'gold' \| 'outline' \| 'dark-ghost'` per `landing.DESIGN.md:153-156` — radius 2px, mono 10–10.5px `.12em`, **colour-only hover, no `-translate-y-0.5`** |
| `Card.tsx` | Add `variant: 'flat'`. **Glass variants stay** — do not break anything mid-migration; remove only after every consumer has moved |
| `Eyebrow.tsx` | Add `tone: 'light' \| 'dark'` → `#5A615B` / `#8B948C`, 10px `.24em`. **Also fixes the 3.4:1 contrast failure** that currently ships on every secondary page |
| `Section.tsx` | Token-drive the rhythm (`--dg-section-*`) and gutter; keep the API |
| `Input/Select/Textarea` | Repoint to landing tokens; `--ds-focus` ring; wire the existing but unused `error` prop |
| `Icon.tsx` | Add the missing `hourglass_empty` entry (`projects:210` renders nothing today) |
| `index.ts` | Export `EscapeHatch` and `NextProjectCard`; drop dead `Timeline` exports or delete the file |

**Do not touch** `EscapeHatch.tsx` or `NextProjectCard.tsx` behaviour — they are the only
`components/ui/*` files consumed by the two immersive experiences.

### Layout

| File | Change |
|---|---|
| `components/layout/PageShell.tsx` | **New** — surface, page top from `NAVBAR_HEIGHT`, intro slot, band rhythm |
| `components/layout/Navbar.tsx` | Rebuild on landing tokens: thin mono bar, `aria-current`, active state that is not colour-only. **Fix: unmount the mobile sheet when closed** (it is currently tabbable while invisible), add Escape-to-close, focus trap, focus return. Move the desktop switch to the specced 820px, and drop the two-line cells so 8 items fit |
| `components/layout/Footer.tsx` | Landing dark-band footer. Source links from one place shared with `homeLandingCopy.footer` so the two footers stop drifting (1100 vs 1180px, `py-9` vs `py-[54px]`) |
| `components/home/HomeLanding.tsx` | **Token substitution only** — replace 71 literals with token classes. Plus the three defect fixes: focus-visible styling, a sub-640px nav fallback, and (via D3) the grain bleed |

## 3. Data model

```ts
// lib/types.ts — additions
export type RoleCategory =
  | 'president' | 'co-president' | 'vice-president'
  | 'secretary'  | 'treasurer'
  | 'project-lead' | 'project-manager';

export interface TeamMember {
  id: string;
  name: string;                 // placeholder text when unfilled
  role: string;                 // display title
  roleCategory: RoleCategory;
  project?: string;             // REQUIRED for 'project-lead' — the team/project they run
  bio?: string;
  image?: string;
  imageAlt?: string;            // required whenever `image` is set
  links?: { linkedin?: string; github?: string; portfolio?: string; email?: string };
  order: number;
  term?: string;                // e.g. '2026–27'
  isPlaceholder: boolean;       // renders the explicit placeholder treatment
}

export interface CommunityChannel {
  id: 'discord' | 'linkedin' | 'youtube';
  name: string; description: string; url?: string;
  expectations?: string[]; artwork?: string;
}
export interface LinkedInPostRef {
  id: string; urn: string;      // urn:li:share:… → /embed/feed/update/<urn>
  title: string; postUrl: string; height?: number;
}
export interface VideoItem {
  id: string; youtubeId?: string; title: string;
  project?: string; presenter?: string; description?: string;
  thumbnail?: string; duration?: string; watchUrl?: string;
  isPlaceholder: boolean;
}
```

- `lib/data/team.ts` — **rewritten**. The 13 current records are invented individuals ("Alex
  Chen", "Sarah Kim", …) with plausible emails and no placeholder marking; §17 forbids this.
  Replaced with one explicitly-marked placeholder per required role, `isPlaceholder: true`.
- `lib/data/community.ts` — **new**. Channels, an empty `linkedInPosts: []`, and placeholder
  video entries. **Every list may legally be empty** — the page must render complete with none.
- `lib/data/siteConfig.ts` — add `social.youtube: ''` (empty = unconfigured). Reconcile
  `social.github` vs `community.github` or document why they differ.
- All copy routes through `brand-voice-strategist` → `brand-guardian` per `AGENTS.md`.

## 4. Custom cursor specification

**Eligibility** — all must hold, or nothing mounts and the native cursor is untouched:
`window.matchMedia('(any-hover: hover) and (pointer: fine)').matches`, JS initialised, and
`!matchMedia('(prefers-reduced-motion: reduce)').matches` *or* the static (no-trail) variant is
in use. The OS cursor is hidden **only after** the replacement has mounted and painted one
frame.

**Visual** — a `+` crosshair centre point (the landing's own registration glyph, 1px strokes)
plus a 28px lagging hairline ring at `--ds-border-strong`. Colour flips to the cream ladder on
`--ds-bg-inverse` bands. No fill, no blur, no blend mode, no shadow (`landing.DESIGN.md:184`).

**States**, driven by `data-cursor` attributes — never CSS selectors:

| `data-cursor` | Behaviour |
|---|---|
| *(default)* | Point + ring at rest |
| `link` | Ring 1.4× |
| `button` | Ring 1.4× + `--ds-accent` stroke |
| `field` | **Native cursor restored** — precision matters more than the effect |
| `media` | Ring 2× + mono label from `data-cursor-label` |
| `card` | Ring 1.2× |
| `disabled` | Ring at 40% opacity, no scale |
| `drag` | Horizontal double-chevron |
| `external` | Ring + `↗` glyph |
| `nav` | Ring 1.2× + accent tick |

**Accessibility** — keyboard behaviour unchanged; focus rings untouched and never obscured;
text selection unaffected; form controls revert to native; `pointer-events: none` and
`aria-hidden="true"`; the cursor is **never** the only indicator of interactivity (every target
keeps its own hover/focus state); reduced motion removes all lag/inertia (point and ring move
together, or the component does not mount); the site is fully functional with the component
deleted.

**Performance** — `useMotionValue` + `useSpring` from the already-installed `framer-motion@11`,
or a plain rAF loop writing `transform` directly. **No React state per pointer event.** No layout
reads in the loop. Listeners attached once at the provider, with `data-cursor` resolved by
`closest()` on the event target — so route changes add no listeners. All frames and listeners
cleaned up on unmount. Batch 9 verifies the smartphone entry sequence is unaffected.

## 5. File-by-file plan

### Tokens & global
| File | Change |
|---|---|
| `app/globals.css` | Implement the `landing.DESIGN.md:258-337` block at `:root` + the `--ds-*` semantic layer; **delete `body::before`, `body::after`, `section { z-index: 2 }`** (D3); body → `var(--ds-bg)`; global `::selection`; one `.reveal` system; global `:focus-visible`; retire `.eyebrow`'s hardcoded `'DM Mono'`, `.scrollcue`, `.text-outline` |
| `tailwind.config.ts` | `dg` colour namespace; landing font families; radii 2/3/4/8/10; `screens` reconciled with `DESIGN.md:542` (375/768/**820**/1024/1440); remove dead `keyframes`/`animation` |
| `lib/fonts.ts` | **New** — both stacks (D4) |
| `app/layout.tsx` | Landing font vars on `<body>`; parchment surface; mount `CursorProvider` via `dynamic(ssr:false)`; keep skip-link, `<main>`, Analytics, JSON-LD |
| `app/projects/{modular-smartphone,smart-reading}/layout.tsx` | Apply studio font vars (D4). **No other change** |
| `components/home/home-landing.css` | Consume `:root` tokens; drop the redundant reduced-motion block (shadowed by `globals.css:65-88`) and the no-op `scroll-behavior` |

### Primitives
`components/ui/{Panel,GlyphChip,Divider,PageIntro,SectionHeader,Reveal,TextLink,EmptyState,SocialLink,ProfileCard,MediaCard,FormField,CursorProvider}.tsx` — new.
`components/ui/{Button,Card,Eyebrow,Section,Input,Select,Textarea,Icon,index}.ts(x)` — modified.
`components/ui/Timeline.tsx` — delete (imported by nothing).
`lib/useReveal.ts` — new.

### Chrome
`components/layout/PageShell.tsx` — new. `components/layout/{Navbar,Footer}.tsx` — rebuilt.
`components/home/HomeLanding.tsx` — token substitution + three defect fixes.

### Routes
| File | Change |
|---|---|
| `app/contact/page.tsx` | Rebuild on `PageShell`; signal-path motif; real validation wired to the existing `error` props; `role="status"` + focus move on success; **preserve the Formspree `unconfigured` refusal, the 15 `?type=` mappings, and every visible label**; delete the duplicate page footer (`:336`) |
| `app/team/page.tsx` (+ `layout.tsx`) | Rebuild: executive band → project groups (lead + project named on the card face) → project-manager roster. Filters by role and project, `aria-live` result count, no hover-only reveals |
| `app/community/{page.tsx,layout.tsx}` | **New** — intro, channel selector, Discord module, LinkedIn module, tutorial module, upcoming placeholder, contribution callout |
| `app/{about,pillars,projects,get-involved}/page.tsx` | Migrate to `PageShell` + tokens; **fix the three hover-only reveals**; single reveal implementation; add the missing icon |
| `app/{privacy,terms,cookies}/page.tsx` | Migrate; editorial prose column (Direction C) |
| `app/{not-found,error,global-error}.tsx` | Migrate; `global-error` gets self-contained inline tokens since it has no `globals.css` |
| `app/{sitemap,robots}.ts` | Add `/community`; keep `/review` excluded |
| `app/review/page.tsx` | See `N. Risks` — removal is proposed, not assumed |

### Config, checks, docs
`vercel.json` (+`frame-src`, report-only) · `run.sh:109-119` (add `/community`) ·
`docs/design/secondary.DESIGN.md` **new — authoritative for all non-immersive routes** ·
`DESIGN.md` §0.1 amended · `docs/design/landing.DESIGN.md` §"Subsidiary Pages" + §Governance
amended, and the stale hero/logo descriptions reconciled · `CLAUDE.md`, `AGENT.md`, `AGENTS.md`
routing tables + the signal-red rule · `docs/ROUTES.md` (9 drift items) · `TODO.md` Dev Build
table.

## 6. Batches

Each batch ends with `npm run lint`, `npx tsc --noEmit`, and `npm run build`, plus its own
acceptance criteria. No batch starts before the previous one is complete.

| # | Objective | Key files | Acceptance |
|---|---|---|---|
| **0** | Environment | — | `npm ci` succeeds; `./run.sh check` green — **record every pre-existing failure as the baseline** |
| **1** | Token foundation | `globals.css`, `tailwind.config.ts`, `lib/fonts.ts`, `app/layout.tsx`, `home-landing.css`, `HomeLanding.tsx`, both immersive layouts | `/` renders **pixel-identical** except the three fixed defects; zero literals left in `HomeLanding.tsx`; sweep/grain deleted with nothing depending on `section{z-index:2}`; each route loads 3 font families |
| **2** | Shell, nav, footer | `PageShell`, `Navbar`, `Footer`, `Section`, `Button`, `Eyebrow`, `Reveal`, `useReveal` | Mobile sheet not tabbable when closed; Escape closes; focus returns; `aria-current` present; 8 nav items fit at 820–1180px; one reveal implementation repo-wide; `Eyebrow` passes 4.5:1; immersive routes still suppress chrome |
| **3** | Contact | `app/contact/page.tsx`, `FormField`, `Input/Select/Textarea` | No studio palette remains; Formspree `unconfigured` path unchanged; all 15 `?type=` deep links still resolve; empty submit blocked with a `role="alert"` message per field; success is `role="status"` and moves focus; duplicate footer gone; no hover-only content |
| **4** | Team | `lib/types.ts`, `lib/data/team.ts`, `app/team/*`, `ProfileCard` | All 7 role categories present; every project lead shows its project **without opening a profile**; project managers are a distinct group; placeholders visibly marked; **no invented names**; works at 375px with no hover; `aria-live` count |
| **5** | Community | `app/community/*`, `lib/data/community.ts`, `MediaCard`, `EmptyState`, `vercel.json` | Page is visually complete with **zero** configured content; a LinkedIn post renders from a URN with a working fallback chain; YouTube facade creates no iframe until click; no third-party script loads on any other route; nothing overflows at 375px |
| **6** | Smartphone transition | `PhoneV2Experience`, `Loader`, `TextReveal`, `Hero` | Per `04` §4 — no fast title, no double reveal, no light-wash flash, overlapping handoff, one state owner, reduced-motion usable, **verified against a production build, not dev** |
| **7** | Cursor | `CursorProvider`, `data-cursor` attributes | Absent on touch and coarse pointers; native cursor in form fields; clicks never intercepted; focus rings visible; reduced motion removes lag; no listeners added on route change; smartphone entry unaffected |
| **8** | Responsive + a11y sweep | all migrated routes | `06-test-matrix.md` passes |
| **9** | Production readiness + docs | docs, `run.sh`, `sitemap`, `robots`, `TODO.md` | `./run.sh check` and `./run.sh build` green; static export inspected; diff contains no unrelated changes; governing docs amended |

## 7. Migration risks

| Risk | Mitigation |
|---|---|
| Deleting the sweep changes an immersive route's appearance | Batch 1 acceptance requires visual comparison of all three specialized routes before/after |
| Token promotion silently shifts a landing value | Tokens are transcribed from `landing.DESIGN.md:258-337`, which was extracted from the code; diff each substituted literal against the table |
| `Card` glass removal breaks a page mid-migration | Glass variants are kept until the last consumer moves; removed in Batch 9 |
| Nav rebuild regresses the immersive suppression | `isImmersiveRoute` is untouched; Batch 2 explicitly re-tests all three |
| Contact rebuild breaks the deep-link contract | All 15 `?type=` values are an explicit Batch 3 acceptance criterion |
| Smartphone changes exceed the approved scope | Batch 6 touches only the four named files; no art direction, copy, or layout changes |
| Doc amendments contradict `landing.DESIGN.md`'s no-silent-drift rule | Amendments are explicit, in-batch, and reference this plan |
