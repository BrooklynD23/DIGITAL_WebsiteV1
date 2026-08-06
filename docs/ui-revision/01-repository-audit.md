# 01 — Repository Audit

## 1. Technical inventory

| Area | Finding |
|---|---|
| Framework | Next.js `^14.2.0`, App Router, React 18, TypeScript `^5.3` (`strict: true`) |
| Rendering | Static export — `output: 'export'` **only when `NODE_ENV === 'production'`** (`next.config.js:4`), `trailingSlash: true`. Dev runs a normal server (`docs/troubleshooting/KNOWN_ISSUES.md` §2) |
| Routing | File-based. **No dynamic routes, no route groups, no `loading.tsx`, no `template.tsx`.** The `[slug]` catch-all was deleted (`docs/ROUTES.md:188`) |
| Styling | Tailwind 3.4 + `@tailwindcss/forms`. No CSS-in-JS (forbidden by `CLAUDE.md`). Global CSS in `app/globals.css`; one component stylesheet, `components/home/home-landing.css` |
| Animation | Four libraries, **strictly partitioned** — `framer-motion@11` (smart-reading only), `gsap@3.13` + ScrollTrigger + SplitText (`components/motion/*`, smartphone only), `animejs@4` (`components/phone-v2/*`), `lenis@1.3` (teardown + glasses). **The landing `/` uses none of them** — pure CSS transitions + IntersectionObserver + `setTimeout` |
| Component library | Local only — `components/ui/*` (13 barrel exports + 2 unbarrelled) |
| Icons | `lucide-react@1.17`, wrapped by `components/ui/Icon.tsx` (46-entry legacy material-symbols name map) |
| State | React local state only. No store, no context provider anywhere |
| Content | `lib/data/*.ts` — enforced by `CLAUDE.md`, `AGENT.md`, `AGENTS.md` |
| Images | `next/image` with `unoptimized: true` (static export). `sharp` used only by `scripts/encode-teardown-assets.mjs` |
| Fonts | `next/font/google`, two disjoint stacks — Archivo / Hanken Grotesk / DM Mono on `<body>` (`app/layout.tsx:10-29`) and Newsreader / IBM Plex Sans / IBM Plex Mono on a wrapper div (`app/page.tsx:5-24`). **All six load on `/`; three never render there** |
| 3D | `three@0.169` + `@react-three/fiber` + `drei` — smart-reading only |
| Testing | **None.** No test runner, no test files, no browser automation in `package.json` |
| Lint / types | `eslint-config-next` (`next/core-web-vitals`), `tsc --noEmit` |
| CI | `.github/workflows/ci.yml` — validate `vercel.json` → `tsc --noEmit` → `npm run lint` → production build. Plus `promote-deployment.yml` |
| Analytics | `@vercel/analytics` + `@vercel/speed-insights`, mounted globally (`app/layout.tsx:91-92`) — cookieless |
| Vercel | `vercel.json` — deploys only from the `deployment` branch; security headers; **CSP is `Content-Security-Policy-Report-Only` by deliberate design** |
| Env vars | `NEXT_PUBLIC_SITE_URL` only (falls back to `siteConfig.url`). Tracked in `docs/PRE-LAUNCH.md` §2 |
| Node | `24.x` (`package.json` engines) |
| **Environment state** | **`node_modules` is not installed in this session.** `npm ci` is required before any check can run |

## 2. Route matrix

Legend — **S** = specialized (keeps its own art direction), **M** = migrate to the shared
landing system, **N** = new.

| URL | Page component | C/S | Layout chain | Purpose | Current visual family | Spec? | Migrate? | Shared primitives | Metadata | Mobile | Known problems | Action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | `components/home/HomeLanding.tsx` via `app/page.tsx` | client | root | Home landing | **Parchment editorial** `#F7F6F2`/`#111311`/forest/gold, Newsreader + Plex | S | **No** | `BrandLogo` only | `app/page.tsx:26-30` | 1 breakpoint (`sm:flex`) | No focus styles; **no nav below 640px**; global grain paints over its `<header>`/`<footer>` | Fix the 3 defects only; extract its DNA |
| `/projects/modular-smartphone` | `app/projects/.../page.tsx` | client | root → projects → own | Flagship product story | Dark navy bench, own accents | S | **No** | `EscapeHatch` | `phoneV2Metadata` | own | Entry transition — see `04` | Transition fix only |
| `/projects/smart-reading` | `app/projects/.../page.tsx` | client, `ssr:false` | root → projects → own | Glasses product story | Paper beige + phosphor HUD, R3F | S | **No** | `EscapeHatch`, `NextProjectCard` | `smartReadingMetadata` | own | `FloatingDecor.tsx:71` reduced-motion guard is a **comment only** (open Medium in `docs/AUDIT-brand-story-gsap.md:56`) | Leave; optionally close the audit defect |
| `/contact` | `app/contact/page.tsx` | client | root → metadata shim | Contact + Formspree form | **Studio grey + white glass + 21× signal red + black** | M | **Yes** | `Card Button Input Textarea Select Icon Eyebrow` | `contact/layout.tsx:3-6` | `px-4 md:px-7`, `lg:grid-cols-12` | See §4 | Rebuild on shared shell |
| `/team` | `app/team/page.tsx` | client | root → metadata shim | Member directory | Studio glass + sticky filter bar | M | **Yes** | `Card Button Icon Eyebrow` + `NAVBAR_HEIGHT` | `team/layout.tsx:3-6` | `sm:2 lg:4` grid | See §5 | Rebuild + new data model |
| `/about` | `app/about/page.tsx` | server | root | Org story | Studio glass | M | Yes | `Badge Button Card Eyebrow Icon OutlineHeading Section` | inline | 11 `md:`/`sm:` | Hover-only member role reveal (`:357`); `dangerouslySetInnerHTML` observer (`:108`); hand-rolled Card ×2 (`:152,:339`) | Migrate |
| `/pillars` | `app/pillars/page.tsx` | server | root | D-I-G-I-T-A-L framework | Studio glass | M | Yes | `Button Card Eyebrow Icon OutlineHeading Section` | inline | 5 breakpoints | **Hover-only pillar names (`:155`) → on mobile the section is 7 unlabelled letters**; `dangerouslySetInnerHTML` observer (`:119`) | Migrate |
| `/projects` | `app/projects/page.tsx` | client | root → metadata shim | Project index | Studio grey + one dark ink tile | M | Yes | `Badge Button Eyebrow Icon Input OutlineHeading` (no `Card`/`Section`) | `projects/layout.tsx:3-6` | 5 breakpoints | `<Icon name="hourglass_empty"/>` (`:210`) **is not in `iconMap`** → renders nothing in prod; one-off `white/[.22]`; `text-ink/60` below contrast | Migrate |
| `/get-involved` | `app/get-involved/page.tsx` | server | root | Join pathways | Studio glass | M | Yes | `Card* Button Badge Icon Eyebrow Section` | inline | `md:2 lg:4` | 3 hand-rolled buttons; one-off `white/40` | Migrate |
| `/privacy` `/terms` `/cookies` | `app/{privacy,terms,cookies}/page.tsx` | server | root | Legal | Studio, 720px prose | M | Yes | `Eyebrow OutlineHeading Section` | inline | fluid | `pt-[140px]` hand-set | Migrate |
| `/review` | `app/review/page.tsx` | server | root | Internal variant hub | Studio, hand-rolled cards | M | **Delete** | `Eyebrow` only | `noindex` (`:11-15`) | — | **`TODO.md:88` says remove once decisions land; `reviewRoutes.ts:28-42` shows nothing left to decide** | Remove (confirm) |
| 404 | `app/not-found.tsx` | server | root | Not found | Studio, outline "404" | M | Yes | `Button Eyebrow` | none | — | Hand-rolled heading + button | Migrate |
| route error | `app/error.tsx` | client | root | Error boundary | Studio | M | Yes | `Button Eyebrow` | none | — | Hand-rolled | Migrate |
| global error | `app/global-error.tsx` | client | **replaces root layout** | Fatal boundary | `bg-studio` | M | Yes | none | none | — | **Own `<html>/<body>` → no font vars, no `globals.css`, no skip-link.** Re-inlines the stroke because `.text-outline` is unavailable (`:20`) | Migrate w/ self-contained styling |
| `/sitemap.xml` | `app/sitemap.ts` | — | — | — | — | — | Update | — | — | — | 12 routes, `/review` excluded — **must add new routes** |
| `/robots.txt` | `app/robots.ts` | — | — | — | — | — | Update | — | — | — | Disallows `/review` |
| **`/team`** (rebuild) | — | — | — | Leadership + projects | — | N | — | — | — | — | Exists but wrong model — §5 | Rebuild |
| **`/community`** | — | — | — | Discord / LinkedIn / YouTube | — | N | — | — | — | — | **No `/community`, `/connect`, `/media` or `/resources` exists anywhere** | Create |

**Layouts: 6.** Only `app/layout.tsx` injects chrome (skip-link `:77-82`, `<Navbar/>` `:84`,
`<main id="main-content" tabIndex={-1}>` `:85`, `<Footer/>` `:88`, Analytics `:91-92`, JSON-LD
`:95-98`). The other five (`contact`, `team`, `projects`, `modular-smartphone`, `smart-reading`)
are **pure `return children` metadata shims**. There is no immersive-guard layout — the guard is
client-side inside `Navbar`/`Footer`.

**The migration seam is already drawn.** `lib/immersiveRoutes.ts` returns `true` for exactly the
three specialized routes; `Navbar.tsx:119` and `Footer.tsx:28` both `return null` on them. **The
set of routes to migrate is precisely the set where `isImmersiveRoute()` is `false`.** Note the
asymmetry: `/` is special-cased *inside the function* rather than listed in
`IMMERSIVE_PREFIXES`, so anything iterating that array misses `/`.

## 3. Existing design architecture

Two disjoint systems sharing **zero** tokens.

### 3a. Industrial studio — global, governs every secondary page

`app/globals.css:10-23` + `tailwind.config.ts:10-30`.

`--studio #d6d4d3` page · `--studio-lo #c4c1c0` · `--studio-hi #eceae9` · `--ink #16161a` ·
`--ink-soft #5d5b59` · `--accent #d8412f` (signal red) · `--accent-2 #1c6cff` (focus/links only)
· `--line #b9b6b4` · `--maxw 1180px` · `--ease cubic-bezier(.22,.61,.36,1)`.
Archivo / Hanken Grotesk / DM Mono. Radii `4 / 10 / full`. Shadows `pill`, `card`, `active`.
Glass convention `border-white/60 bg-white/[.42] backdrop-blur-[6px] shadow-card`.
Persistent background: `body::before` radial sweep + `body::after` 4% grain, with
`section { z-index: 2 }` lifting content above them (`globals.css:36-62`).

### 3b. Warm editorial — the landing, and the target system

`components/home/home-landing.css:2-12` (scoped to `.home-landing`).

Parchment `#F7F6F2` · ink `#111311` · forest `#1E4D2B` · gold `#C28E0E` / bright `#D8A62A` ·
void `#0A0C0A` / hover `#111511` · cream `#F2F0E8` · muted `#5A615B` (light) / `#8B948C` (dark) ·
card `#FCFBF8` · stripes `#E7E4DC`/`#EFEDE6`. Newsreader (promise) / IBM Plex Sans 600 (proof) /
IBM Plex Mono (annotation). Radii `2 / 3 / 4 / 8 / 10`. **Zero shadows** — hierarchy is surface
step + hairline alpha + full-bleed inversion. Motion is one gesture: rise `18px` + fade, `0.8s`,
`cubic-bezier(0.22,1,0.36,1)`, ~110ms stagger. Hover is colour/border only.

### 3c. The token layer exists mostly on paper

`docs/design/landing.DESIGN.md:258-337` advertises **~64 custom properties**.
`home-landing.css` declares **11**. Of those, **5 are consumed** (`--dg-bg`, `--dg-ink`,
`--dg-green`, `--dg-stripe-a`, `--dg-stripe-b`); 6 are dead. **Zero `var(--dg-*)` references
exist in any `.tsx` file.** Everything else — every hairline alpha, all 16 type sizes, all 5
radii, all 10 spacing values, all 8 motion values — lives as inline literals.
`HomeLanding.tsx` alone contains **71 colour literals in 464 lines.**

**This is the single most useful finding in the audit.** The shared token layer the revision
needs is already specified and approved; it has simply never been implemented. Building it is
*token-faithful work against an existing spec*, not new design.

### 3d. Duplicated / dead / drifting (fix candidates)

| # | Issue | Evidence |
|---|---|---|
| 1 | Landing palette re-typed as 71 hex literals | `HomeLanding.tsx` |
| 2 | Landing fonts not Tailwind tokens — `font-[family-name:var(--font-home-mono)]` ×26 | `HomeLanding.tsx` throughout |
| 3 | **Two reveal systems** — rise 18 vs 28px, easing `.22,1,.36,1` vs `.22,.61,.36,1`, threshold 0.1 vs 0.2, class `.is-visible` vs `.in` | `home-landing.css:64-81` vs `globals.css:114-125` |
| 4 | **Three reveal implementations** — inline `dangerouslySetInnerHTML` observer ×2, `useEffect` observer ×1, and a literal `className="reveal in"` that skips animation | `about:82-101` ≡ `pillars:95-114`; `projects:47-68`; `team:39` |
| 5 | `.wrap` dead — re-inlined as `mx-auto max-w-content px-7` | `globals.css:93-95` vs `Section.tsx:44`, `Footer.tsx:32` |
| 6 | `.scrollcue`, `animate-cue`, `animate-reveal-up` fully dead | `globals.css:128-135`, `tailwind.config.ts:31-44` |
| 7 | `components/ui/Timeline.tsx` (251 lines) imported by no page | — |
| 8 | Focus ring inlined 7× ; `.focus-glow` used once. **Landing has no focus styles at all** | `Button:42, Input:35, Textarea:35, Select:38, Navbar:72,173, Footer:92` |
| 9 | Legal links duplicated (the data file's own comment admits it) | `homeLanding.ts:162-168` vs `Footer.tsx:105-113` |
| 10 | Two footer max-widths (1100 vs 1180) and paddings (`py-9` vs `py-[54px]`) | `HomeLanding.tsx:433` vs `Footer.tsx:31-32` |
| 11 | **Five hand-set page tops** (`pt-[120px]`, `pt-[140px]`, `pt-28`, `py-[120px]`, `py-24`); `NAVBAR_HEIGHT = 72` exists but only `/team` imports it | `Navbar.tsx:22` vs 11 pages |
| 12 | `OutlineHeading` presets unused — 7 pages hand-roll the outline heading inline | `OutlineHeading.tsx:41-43` vs `contact:87`, `team:117`, `get-involved:33`, `review:39`, `not-found:9`, `error:22`, `global-error:18` |
| 13 | `letterSpacing` tokens (`eyebrow/label/wide`) never used — exact values written as arbitraries | `tailwind.config.ts:30` |
| 14 | `#d8412f` re-encoded as `rgba(216,65,47,.22)`, bypassing the token | `Navbar.tsx:77` |
| 15 | `rounded-md` used once but undefined in config → silent off-system 6px | repo-wide ×1 |
| 16 | Reduced-motion clamp declared twice; the landing copy is fully shadowed by the global | `home-landing.css:116-124` vs `globals.css:65-88` |
| 17 | Six hand-rolled `Button` copies (because `Button` renders `<button>` only — no `href`) | `team:245, projects:292, get-involved:204,213,222, contact:111, global-error:29` |
| 18 | Three different glass opacities in the wild — `.42` (Card), `.40` (get-involved/cookies), `.22` (projects) | — |
| 19 | `--pill: rgba(255,255,255,0.55)` declared, never used | `globals.css:19` |
| 20 | `social.github` (`digitalcpp`) ≠ `community.github` (`SunnyYoshimitsu/CelestiCall`); JSON-LD uses one, every visible link uses the other | `siteConfig.ts:22,28` |

**246 colour literals across 23 files.** `app/**` and `components/ui/**` are **100% clean**.
Only **two** literals sit in genuinely shared code: `Navbar.tsx:47`
`bg-[rgba(255,255,255,0.42)]` (should be `--pill`) and `Navbar.tsx:77` (should be `accent/22`).
The rest are the landing (71, undocumented) and the two immersive experiences (~125, legitimised
by their own DESIGN docs).

### 3e. Doc ↔ code drift

- `landing.DESIGN.md:119` describes the hero as a striped placeholder plate with `+` crosshairs.
  Code renders a real `next/image` `/assets/landing/Landing-Page-Hero.png` (`HomeLanding.tsx:181-193`).
- `landing.DESIGN.md:114` describes a drawn 14px square logo mark. Code uses `logoFull` 88×32
  (`:125-132`), so `--dg-type-wordmark: 13px` has no counterpart.
- `DESIGN.md:340-342` specifies 5 nav items; `Navbar.tsx:31-39` has 7. Blur specced 14px
  (`DESIGN.md:316`), implemented 18px. Breakpoint specced 820px, implemented `lg`/1024px.
- `docs/ROUTES.md` lists a deleted `/experiments/*` immersive route (`:49`), says nav item 6 is
  "Get Involved" when it renders "Join" (`:176`), lists 11 `?type=` values against the real 15,
  and never mentions `app/error.tsx`, `app/global-error.tsx`, or `app/robots.ts`.
- `tailwind.config.ts` has **no `screens` override** (defaults 640/768/1024/1280/1536), while
  `DESIGN.md:542` declares targets 375/768/1024/1440 with a key breakpoint of 820. **Spec and
  config disagree.**

## 4. Secondary-page audit — `/contact` in detail

The reported "white, orange and black" is not off-token; it is **the most saturated possible use
of the studio tokens with no mid-tone relief**:

- **White** — `Card variant="glass"` (`border-white/60 bg-white/[.42]`, `Card.tsx:39-41`) used as
  three large slabs (`:99, :191, :251`), plus form fields at `bg-white/55`. Nothing on the page
  carries `--studio` grey, so it reads as white panels, not a grey studio.
- **Orange** — `--accent #d8412f` used **21 times**, more than any other page: every info icon,
  every hover, the success ring, the CTA chip (`:89,102×3,113,159,165,193,205,212,219,238,263,271,279,287,295,312,325`).
- **Black** — `text-ink #16161a` on the H1 and every `<dd>`, plus a solid-black
  `Button variant="primary"` (`border-ink bg-ink text-studio`).

**Structural divergence (the deeper inconsistency):**
- Only content page that **does not use `Section`** — hand-rolls
  `px-4 pt-[120px] pb-16 md:px-7 md:pb-24` (`:82`), giving a `px-4` gutter against `px-7` everywhere else.
- Does not use `OutlineHeading` — re-implements it inline (`:87-90`), one of seven copies.
- No band rhythm, no `border-t border-line` separators.
- **Renders its own footer** — `© {year} DIGITAL Club. All rights reserved.` (`:336`) stacked
  directly above the global footer's `© {year} DIGITAL @ Cal Poly Pomona`. **Two copyright lines
  with two different org names on one page.**

**Form — what must be preserved:**
- Real `<label>`s via `useId()` + `htmlFor` (`Input.tsx:11-24`). **Not** placeholder-as-label.
- `noValidate` on the form (`:119`) with **no JS validation replacing it** — an empty form
  submits. The `error` prop that `Input`/`Select`/`Textarea` all support (rendering
  `role="alert"` + `aria-invalid` + `aria-describedby`) is **never passed**.
- Required conveyed only by a literal `*` in the label string, with no legend.
- Success state (`:100-117`) swaps out the form but is **not** `role="status"`/`aria-live` and
  does not move focus.
- Error and unconfigured states *do* use `role="alert"` (`:159,165`).
- **Submission is a deliberate dead end.** `siteConfig.formspreeEndpoint` is
  `'https://formspree.io/f/YOUR_FORM_ID'`; `:26` detects the placeholder and `:53-56` sets
  `status:'unconfigured'`, telling visitors to email instead. Documented in
  `docs/PRE-LAUNCH.md` §1. **This behaviour must survive the redesign unchanged.**
- Data: `lib/data/contactTopics.ts:5-10` (4 topics) and `:15-31` (15 `?type=` deep-link
  mappings from `/get-involved`), consumed via `useSearchParams()` — hence the `<Suspense>`
  wrapper at `:346`, whose `fallback={null}` causes a blank flash.
- Map tile (`:303-309`) is a hover-only `opacity-70 grayscale` → un-grayscale on a
  non-focusable div: no keyboard or touch equivalent.

## 5. Secondary-page audit — `/team` in detail

`app/team/page.tsx` (client, 255 lines) + metadata shim + `lib/data/team.ts`.

```ts
// lib/types.ts:1-13
export interface TeamMember {
  id: string; name: string; role: string;
  department: 'executive' | 'hardware' | 'software' | 'outreach';
  title: string; image: string;
  links?: { linkedin?: string; github?: string; email?: string };
}
```

- **Four flat departments**, hardcoded in three places that must stay in sync: the union in
  `lib/types.ts:5`, the `Department` type + `filters` in `app/team/page.tsx:15-23`, and the
  `departments` render array at `:25-35`.
- **No support for the required model** — no President / Co-President / Vice-President /
  Secretary / Treasurer distinction, no project association for leads, no Project Manager group,
  no bio, no portfolio URL, no display order, no term, no placeholder flag, no image alt text.
- `role` and `title` are **identical on all 13 records**, so `app/team/page.tsx:55`
  (`{member.role !== member.title && …}`) is dead code.
- **⚠️ Content/privacy issue:** the 13 records are invented individuals — "Alex Chen", "Sarah
  Kim", "Marcus Johnson", "Emily Rodriguez", etc., with plausible role-based emails
  (`president@digitalcpp.org`). They are **not marked as placeholders** and read as real people.
  §17 of the brief forbids invented member identities. These must be replaced with explicitly
  labelled placeholders.
- Filter changes have no `aria-live`; the chip row is `overflow-x-auto` with no scroll
  affordance; the search `<label>` wrapper has no text.

## 6. Cross-cutting accessibility and responsive problems

| Issue | Evidence | Severity |
|---|---|---|
| **`Eyebrow` fails contrast on every secondary page** — `#d8412f` on `#d6d4d3` ≈ **3.4:1** at 12px, below AA for small text. It is the most-used primitive (12 files) | `globals.css:98-105`, `Eyebrow.tsx:15` | High |
| **Hover-only reveals with no keyboard or touch path** — pillar names (`pillars:155`), member role (`about:357`), map (`contact:308`). On mobile `/pillars` is seven unlabelled letters | — | High |
| **Mobile nav sheet stays tabbable when closed** — always mounted; closed state is only `pointer-events-none -translate-y-2 opacity-0` (`Navbar.tsx:199`), which does not remove focusability. No Escape handler, no focus trap, no focus return | `Navbar.tsx:192-241` | High |
| **The landing has no `focus-visible` styling at all** — `DESIGN.md:527` calls this non-negotiable | `HomeLanding.tsx` | High |
| **No mobile nav on `/` below 640px** — `sm:flex` hides the only three links with no fallback | `HomeLanding.tsx:134` | High |
| **Global grain paints over the landing's `<header>` and `<footer>`** — `body::after` is fixed at `z-index:1` and only `section` is lifted to `z-index:2`, so the landing's non-`section` bands carry a 4% noise wash its own spec forbids (`landing.DESIGN.md:184`) | `globals.css:49-62` vs `HomeLanding.tsx:157,432` | Medium (visible defect) |
| `global-error.tsx` loses the entire design system — own `<html>/<body>`, no font vars, no `globals.css`, no skip-link | `app/global-error.tsx` | Medium |
| `<Icon name="hourglass_empty"/>` is not in `iconMap` → renders `null` in production with only a dev `console.warn` | `projects:210`, `Icon.tsx:125-131` | Medium |
| Filter/search result changes never announced (no `aria-live`) | `team:98-107`, `projects:35-44` | Medium |
| `FloatingDecor.tsx:71` has a reduced-motion **comment but no guard** — infinite `y`/`rotate` loops. Open Medium in `docs/AUDIT-brand-story-gsap.md:56` | smart-reading | Medium |
| `text-ink-soft/60` and `text-ink/60` on the coming-soon card push below contrast minimums | `projects:199,203,207` | Medium |
| Desktop nav overflow risk — 7 items × (icon + two-line label) in one `fixed -translate-x-1/2` pill with `overflow-hidden`, shown from 1024px. **Adding a `/community` item will clip at 1024–1180px** | `Navbar.tsx:127-130` | Blocking for §11 |
| `<Suspense fallback={null}>` → blank flash on `/contact` hydration | `contact:346` | Low |
| Landing runs the full loader, blur, and stripe gradient identically on phones; gutter is a fixed `18px` at every width. **No decorative simplification on mobile at all** | `HomeLanding.tsx` | Low |

## 7. Binding repository rules

**Contractual / compliance tier**
1. `vercel.json` CSP (report-only, deliberately). `frame-src` is **absent**, so `default-src
   'self'` governs iframes; `img-src` is `'self' data:`. **A LinkedIn or YouTube embed and any
   remote thumbnail violate the current policy.** `docs/PRE-LAUNCH.md` §3 forbids promoting the
   header to enforcing before a deployed report-only validation pass, and instructs that any
   missing directive be added to the report-only policy first.
2. `scripts/validate-vercel-json.mjs` runs first in CI — schema changes must pass it.
3. `docs/PRE-LAUNCH.md` §1 — the Formspree `unconfigured` refusal is deliberate and must survive.
4. §17 of the brief and the existing placeholder problem — no invented identities, no
   fabricated social metrics.

**Repository architecture tier**
5. Static export only — no server actions, no API routes, no runtime data fetching.
6. Content lives in `lib/data/` — never inline copy in components.
7. Tailwind only — no CSS-in-JS.
8. TypeScript strict — `tsc --noEmit` must be clean.
9. `./run.sh check` before every commit. **`run.sh:109-119` hardcodes a route-page list** — new
   routes must be added there or the check misreports.
10. `TODO.md` Dev Build / Version Control table must record every commit (`CLAUDE.md` standing rule).
11. Prefer existing libraries; the repo already carries four animation libraries.

**Design documentation tier**
12. `docs/design/landing.DESIGN.md` is authoritative for `/` **and** holds the subsidiary-page
    direction. §"Subsidiary Pages" (`:246-252`) states the seam is "known, accepted" and that
    restyling `/contact` and `/get-involved` toward the landing "is directional only … pending
    explicit Head Designer approval and must not be started speculatively." **The revision brief
    is that approval.** §252 also says *"do not port landing tokens into `components/ui/*`"* —
    see the resolution in `05-implementation-plan.md`.
13. `DESIGN.md` §0.1 currently declares root DESIGN.md governs every non-immersive route. The
    revision inverts this and requires a documented amendment — `landing.DESIGN.md:343` forbids
    silent drift in either direction.
14. `docs/design/BRAND.md` governs all copy; changes route through `brand-voice-strategist` to
    write and `brand-guardian` to review.
15. `CLAUDE.md` "one signal-red accent `#d8412f`" and the `digital-ui` skill's "industrial
    studio / no dark mode / no per-section background fills" both describe the *outgoing* system.
    Both must be amended or they will cause future agents to revert this work.

## 8. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| **CSP blocks the community embeds** | LinkedIn/YouTube iframes and remote thumbnails violate the current policy | Extend the **report-only** policy with `frame-src https://www.linkedin.com https://www.youtube-nocookie.com` and `img-src … https://i.ytimg.com`; keep it report-only per `PRE-LAUNCH.md` §3; prefer a local thumbnail so `img-src` need not change |
| **Nav overflow when `/community` is added** | 8 items clip at 1024–1180px | Nav is being rebuilt in Batch 2 anyway; move to a text/mono nav without two-line cells, and set the desktop switch at the specced 820px |
| **`components/ui/*` is shared with the two immersive routes** | Rewriting primitives could leak into specialized pages | Only `EscapeHatch` (both) and `NextProjectCard` (glasses) are shared. Every other primitive is secondary-only and safe to migrate. **Do not touch those two** |
| **Six font families would ship globally** | Perf regression on secondary routes | Move both stacks into `lib/fonts.ts`; apply landing vars in the secondary shell and studio vars in the two immersive route layouts, so each route loads exactly three |
| **Governing docs contradict the new direction** | Future agents revert the work | Doc amendments are in-scope batches, not afterthoughts |
| **`node_modules` absent** | No check can run | `npm ci` is Batch 0 |
| **No test suite exists** | No regression net | Verification is `tsc` + lint + production build + the manual matrix in `06-test-matrix.md` |
| **Landing itself has three real defects** (no focus styles, no mobile nav, grain bleed) | Migrating a broken system propagates the breakage | Fix these three on `/` as part of Batch 1 — all are token-faithful corrections its own spec already mandates |
