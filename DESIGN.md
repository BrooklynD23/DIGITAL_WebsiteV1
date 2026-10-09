# DESIGN.md — DIGITAL Design System (Apple system)

> **Make something worth putting your name on.**

**Status:** Authoritative. As of 2026-10-07 the "Apple" system is the site's default design system. This document is extracted from the shipped code in `app/(apple)/`. Every value below was read from a source file; where this document and the code disagree, fix the one that is wrong and note it in the changelog. Locked pages (§2) change only with Head Designer sign-off.

**Stack:** Next.js 14 (App Router, static export) · React 18 · TypeScript strict · CSS modules on `--r2-*` custom properties · anime.js for stage playback. The Apple system does not use Tailwind classes; Tailwind CSS 3 is configured (`tailwind.config.ts`) but no live route uses it.

---

## 1. Document stack

| Layer | File | Governs |
|---|---|---|
| Brand + system | `DESIGN.md` (this file) | What DIGITAL is, tokens, patterns, rules for every route |
| Voice | `docs/design/BRAND.md` | Wording, cadence, the copy review workflow |
| Route specs | `docs/design/sidekick.DESIGN.md`, `docs/design/brain.DESIGN.md` | As-built specs and locked-file lists for the two locked pages |
| Content | `app/(apple)/_content/*.ts`, `app/(apple)/_chrome/club.ts`; `lib/data/*` for club facts, team and involvement | Every printed string, number and link |

Conflict order for look: locked route spec → this file → code comments. Conflict order for words: `BRAND.md` → the content files.

`docs/design/landing.DESIGN.md`, `smartphone.DESIGN.md` and `glasses.DESIGN.md` describe designs that are now in `archive/`. They are kept as history and govern nothing.

## 2. Routes and lock status

| Route | Source | Spec | Status |
|---|---|---|---|
| `/` | `app/(apple)/page.tsx` (hero artwork in `app/(apple)/projects/_hero/`) | this file | Open |
| `/projects/sidekick/` | `app/(apple)/projects/sidekick/` | `docs/design/sidekick.DESIGN.md` | **LOCKED 2026-10-07** |
| `/projects/brain/` | `app/(apple)/projects/brain/` | `docs/design/brain.DESIGN.md` | **LOCKED 2026-10-07** |
| `/projects/shades/` | `app/(apple)/projects/shades/` | this file | Open |
| `/about`, `/team`, `/community`, `/contact`, `/get-involved`, `/privacy`, `/terms`, `/cookies` | `app/(apple)/…` | this file | Apple system on the `SitePage` frame (§13.4); legal pages on `LegalPage` |
| `/pillars`, `/projects`, `/projects/modular-smartphone`, `/projects/smart-reading`, `/design-lab/r2/apple/*` | `app/(apple)/…` | none | Redirect stubs only (`app/(apple)/_redirect.tsx`); do not extend |

Every earlier design and iteration is in `archive/` (index: `archive/README.md`). `archive/` is excluded from the build, lint and type-check (`tsconfig.json` `exclude`).

## 3. What DIGITAL is

DIGITAL is a **student-run venture studio** at Cal Poly Pomona: mixed-discipline teams take one part of a real build and own it. The home hero states it as "A student-run venture studio at Cal Poly Pomona. Pick one part of a real build and own it." (`hero.lead`, `app/(apple)/_content/home.ts`).

It is not an engineering club, a professional-development organisation, a hackathon group, a résumé farm, a software org or a department showcase. Outward copy uses studio, team, build, project, work. "Club" appears only where campus policy requires the category.

**Thesis:** *Make something worth putting your name on.* It is the home `h1` and the first line of every footer. One use per surface.

**Beliefs** (unchanged from the 2026-09-14 brand layer):

1. Ideas aren't accomplishments. Making them real is.
2. The problem picks the team.
3. Reality grades the work.
4. Sign your work.

**Builds:** SIDEKICK (modular phone, an archived design), SHADES (reading glasses, planned), BRAIN (agentic-AI team). Names are all caps. The name of the studio is **DIGITAL**, all caps; full form **DIGITAL @ Cal Poly Pomona**.

## 4. Voice

Detail lives in `docs/design/BRAND.md`. The rules that shaped the shipped pages:

1. One idea per line. Declarative. No stacked dependent clauses.
2. Verbs over adjectives. Concrete nouns (a part number, a room, a day).
3. Headings are sentence case and state the thing. The topic name is the heading.
4. One supporting sentence per stage or lesson (BRAIN: 16 words or fewer).
5. Print only what a source states. `[confirm]` tags are removed from the pages; a fact with no source is left out, not tagged.
6. Honest status words: "Archived design", "Planned", "An archive, not a finished phone."
7. CTAs are imperative, 2–4 words: "Join build night", "Take a subsystem", "Join BRAIN".
8. No hype adjectives, no exclamation marks, no personal names.
9. Banned filler: comprehensive, innovative, cutting-edge, seamless, robust, leverage (verb), empower, elevate, unlock, journey, passionate.

Copy changes go through the `brand-voice-strategist` agent to write and the `brand-guardian` agent to review.

## 5. File map

| Path | Holds |
|---|---|
| `app/(apple)/layout.tsx` | World shell: `<div class="world-apple {fontApple}" data-world="apple">`, imports the tokens, sets the overscroll ground to `#f5f5f7` |
| `app/(apple)/_system/tokens/worlds.css` | All `--r2-*` tokens (`.world-apple` and its `[data-tone='dark']` set), focus ring, `.r2-reveal` |
| `app/(apple)/_system/tokens/scroll.ts` | `useScrollSteps`, `useScrollProgress`, `useReducedMotion`, `stepAt`, `stepRestPoint` |
| `app/(apple)/_system/tokens/motion.ts` | `EASE`, `DURATION`, `REVEAL`, spring tables (JS mirror of the CSS motion tokens) |
| `app/(apple)/_system/fonts/` | Self-hosted variable fonts and the font classes (`fontApple`, `fontReadingText`) |
| `app/(apple)/_system/dots/` | Dot engine: `DotStage`, `DotGlyph`, `paintFrame`, the shared ticker |
| `app/(apple)/_system/ui/` | `PlayOnce`, `Highlights`, `Chevron` |
| `app/(apple)/_chrome/` | `LocalNav`, `WorldFooter`, `JoinChapter`, `SitePage`, `ToneSync`, `routes.ts` (`PAGES`, `href`), `club.ts` (`CLUB`, `LINKS`, `MEETINGS`) |
| `app/(apple)/_content/` | Page copy: `home.ts`, `sidekick.ts`, `shades.ts`, `brain.ts` |
| `app/(apple)/projects/_hero/` | Home phone hero: `HeroStages`, `PhoneArtwork`, `poses.ts`, `useStagePlayback.ts` |
| `app/(apple)/_sidekick/`, `_shades/`, `_brain/`, `_home/` | Page-scoped figures and helpers |
| `public/boards/sidekick-mainboard/` | Static SVG layers for the SIDEKICK board |

## 6. Colour

Light is the default. A section becomes dark with `data-tone="dark"`; the same token names re-resolve. Never hard-code a tone-dependent hex in a component; use the token.

| Token | Light | Dark (`data-tone="dark"`) | Use |
|---|---|---|---|
| `--r2-ground` | `#ffffff` | `#000000` | Section ground |
| `--r2-ground-raised` | `#f5f5f7` | `#161617` | Footer, grey catalogue band, highlight cells |
| `--r2-ink` | `#1d1d1f` | `#f5f5f7` | Headings, body, line art |
| `--r2-ink-2` | `#6e6e73` | `#a1a1a6` | Supporting lines, tracker labels, captions |
| `--r2-ink-3` | `#6e6e73` | `#86868b` | Smallest text floor |
| `--r2-hairline` | `#d2d2d7` | `#424245` | 1px rules in tables and lists |
| `--r2-hairline-strong` | `#86868b` | `#86868b` | Fact-grid rule, underline colour, outlined controls |
| `--r2-focus` | `#0b0c0a` | `#f5f5f7` | Focus ring |
| `--r2-nav-bg` | `rgba(255,255,255,.78)` | `rgba(22,22,23,.8)` | Nav token; the bar itself paints `rgba(22,22,23,.86)` when dark |
| `--r2-cta-bg` / `--r2-cta-ink` | `#1d1d1f` / `#ffffff` | `#f5f5f7` / `#1d1d1f` | The one filled pill |
| `--r2-cta-bg-hover` / `--r2-cta-ink-hover` | `#b3321f` / `#ffffff` | same | Pill hover |
| `--r2-trigger` | `#d8412f` | `#d8412f` | The one red |
| `--r2-trigger-ink` | `#b3321f` | `#ef6a55` | Red as text or under white text (error text, invalid border) |

**The one red (`#d8412f`).** It is a mark, not a colour scheme. Shipped uses: the test point and marker triangle in the home phone artwork, the anchor dot of a dot figure (the open seat in the join), and the CTA hover (in its darker text-safe shade). Never body text, never a dot colour, never a fill behind content. Red text uses `--r2-trigger-ink`.

**Black is literal.** Product-story sections paint `#000` directly (`.pin`, `.story`, `.facts`, BRAIN `.page`) so the surface is continuous across sections.

**No other hue** except the SIDEKICK functional palette (§12).

## 7. Type

**Faces** (`app/(apple)/_system/fonts/`, all SIL OFL 1.1, self-hosted `woff2`, Latin subset, variable, `font-display: swap`, not preloaded):

| Slot | Face | Axis range | Stack after it |
|---|---|---|---|
| `--font-display`, `--font-text` | Geist | wght 100–900 | `ui-sans-serif, system-ui, sans-serif` |
| `--font-mono` | Geist Mono | wght 100–900 | `ui-monospace, SFMono-Regular, Menlo, monospace` |
| `--font-text` on SHADES only (`fontReadingText`) | Atkinson Hyperlegible Next | wght 200–800 | `ui-sans-serif, system-ui, sans-serif` |

**Scale** (size / line height in px; tracking is the value the `font-apple` class supplies):

| Token step | ≥ 735px | ≤ 734px | Tracking | Used for |
|---|---|---|---|---|
| `hero` | 80 / 84 | 40 / 44 | `-0.035em` | Page `h1` |
| `h1` | 56 / 60 | 32 / 36 | `-0.03em` | Section headings, stage headings |
| `h2` | 48 / 52 | 32 / 36 | `-0.03em` | Join title, highlights title, SIDEKICK stage headings |
| `h3` | 28 / 32 | 21 / 25 | `-0.015em` | Fact values, meeting line |
| `lead` | 21 / 29 | 17 / 25 | `-0.004em` | The one supporting line |
| `body` | 17 / 25 | 17 / 25 | `0` | Lists, table rows |
| `small` / `label` | 12 / 16 | 12 / 16 | label `0.04em` | Nav links, tracker, fact notes, footer |

Tokens: `--r2-fs-*`, `--r2-lh-*`, `--r2-ls-*`.

**Weights:** display `600` (`--r2-fw-display`), text `400` (`--r2-fw-text`), strong `600` (`--r2-fw-strong`). The supporting line under a heading is `600` in `--r2-ink-2`. The nav and join pills are `500`.

**Rules**

- Display type is sentence case. Uppercase appears only in Geist Mono labels.
- Geist Mono is for measured values and reference designators (part values, layer names, status words), not for prose.
- Headings use `text-wrap: balance`; body lines use `text-wrap: pretty`.
- **Type inside a pinned stage clamps on viewport height as well as width.** The reference values are BRAIN's: `h1` `clamp(34px, min(10vw, 11svh), 80px)` / 1.05, `h2` `clamp(28px, min(8vw, 8svh), 56px)` / 1.08, line `clamp(17px, min(4.6vw, 3.2svh), 21px)` / 1.4. Pages that use the fixed scale inside a pin step it down by media query instead (home: stage heading 40/44 at `max-height: 820px`; SIDEKICK: 36/40 at ≤ 1200px, 28/32 at ≤ 899px). A title must never be clipped by the nav or the fold.

## 8. Spacing and layout

| Token | Value |
|---|---|
| `--r2-space-1` … `-10` | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px |
| `--r2-gutter` | 16px; 32px at ≥ 735px; 48px at ≥ 1069px |
| `--r2-measure` | 34rem |
| `--r2-radius` | 12px |
| `--r2-target` | 44px (minimum hit target) |
| `--r2-nav-h` | 52px |
| `--r2-sticky-top` | `var(--r2-nav-h)` (top offset for anything pinned under the nav) |

- **Breakpoints:** 734 / 735 (phone), 1068 / 1069 (tablet). Pins also stack at ≤ 899px.
- **Columns:** nav, footer, join and simple pages 1024px. SIDEKICK catalogue 980px; SIDEKICK story 1360px; home build rows 1120px; SHADES 1200px.
- **Pill radius** is the literal `980px` (nav pill, join pill, tracker buttons).
- Section padding is `--r2-space-9` or `--r2-space-10` top and bottom; chapters are separated by space and by ground colour, not by rules.
- Hairlines belong to data: table rows, fact grids, definition lists. They never separate two stages, lessons or chapters.
- Use `svh` for anything sized to the viewport.

## 9. Page structure: dark story, light catalogue

Each page opens with the product story on black and ends with the catalogue on light.

| Page | Dark (story) | Seam | Light (catalogue) |
|---|---|---|---|
| `/` | Hero pin, "Three builds" | before the join | Join, footer |
| SIDEKICK | Board story pin, "The board, in numbers" | after the facts strip | Subsystems, status, rules (`#f5f5f7`), join, footer |
| SHADES | Hero, problem, method, reader, light-path pin | after the pin | Highlights, tracks, scope (`#f5f5f7`), roadmap, join, footer |
| BRAIN | Hero + lessons pin, join | before the footer | Footer |

Rules:

1. One dark-to-light seam per page. Do not alternate.
2. The seam goes where the argument ends and the reference material starts.
3. Mark every dark section `data-tone="dark"`. That flips the tokens and tells the nav which tone to take (`ToneSync`).
4. Light catalogue sections use data layouts: hairline lists, a `dl` fact grid, numbered steps. No cards.
5. A simple page (contact, about, team, legal) is a `SitePage` (§13.4): an optional dark hero, then light sections.

## 10. The pinned played stage

The signature pattern. **Scroll picks a stage; a timed tween plays it.** The figure is never scrubbed frame by frame and can never rest half-way between two stages.

### 10.1 Mechanism

| Part | Source | Behaviour |
|---|---|---|
| Stage pick | `useScrollSteps(ref, { count, lead, playShare })` in `_system/tokens/scroll.ts` | Maps pin progress to an integer `active` step (React state changes only when the step changes). `playShare` is `0.72` on every page. Native scroll; no wheel capture. |
| Playback | `useStagePlayback(active, count, msPerStage, onUpdate)` in `projects/_hero/useStagePlayback.ts` | One anime.js tween moves a float playhead to the target index, `ease: 'inOut(3)'`, duration `min(1.5 × ms, ms × distance)`. A retarget continues from the current value (interruptible, reversible). |
| Paint | the page's `onUpdate(pos)` | Lerps the two neighbouring poses and writes `transform` / `opacity` (or one CSS variable, or one canvas frame) straight to the DOM. No per-frame React state. |
| Jump | `jumpTo(i)` from `useScrollSteps` | Scrolls to the step's rest point; the tracker buttons call it. |

### 10.2 Numbers per page

| Page | Stages | Pin height | Sticky box height | ms per stage | `lead` |
|---|---|---|---|---|---|
| Home hero | 4 | `400vh` (`320vh` ≤ 734px) | `calc(100svh - var(--r2-nav-h))` | 1200 | 0.12 |
| SIDEKICK board | 9 | `calc(100svh + 8 * 50svh)` | `calc(100svh - var(--r2-nav-h))` | 1100 | 0 |
| SHADES light path | 6 | `calc(100svh + 6 * 50svh)` | `calc(100svh - var(--r2-nav-h))` | 1100 | 0 |
| BRAIN lessons | 7 | `calc(100svh + 7 * 50svh)` | `calc(100svh - var(--r2-nav-h) - 44px)` | 900 | 0 |

For a new pin: height `calc(100svh + N * 50svh)` (half a viewport of scroll per stage); sticky box `position: sticky; top: var(--r2-sticky-top); height: calc(100svh - var(--r2-nav-h)); overflow: hidden`. BRAIN subtracts a further 44px because it keeps a second bar (§13.1).

### 10.3 Layout inside the sticky box

- A grid of **caption band · figure · tracker**. Centred pages use rows `auto minmax(0, 1fr) auto`. SIDEKICK puts the figure and the captions side by side (`minmax(0, 1.3fr) minmax(0, 1fr)`) over a 52px tracker row, and stacks at ≤ 899px.
- All captions share one grid cell, so the band is as tall as the tallest caption and the figure does not move between stages.
- The figure takes the space that is left (`minmax(0, 1fr)`, container units). Nothing is placed by a pixel offset.

### 10.4 Caption swap (out, then in)

Outgoing caption: `opacity` and `translateY(12px)` over 160ms, then `visibility: hidden`. Incoming caption: 240ms, after a 160ms delay. Easing `--r2-ease-ui`. Two captions are never visible at once. Inactive captions are `aria-hidden`.

### 10.5 Tracker

A `<nav aria-label>` of real `<button>`s. Each is at least 44px tall, 12/16 text in `--r2-ink-2`, `--r2-ink` on hover and when current, with an 8px marker that has a 1px border and fills when current. The current button carries `aria-current="step"`. Buttons are `disabled` until the pin is enhanced. On phones BRAIN shows markers only and keeps the names for screen readers.

### 10.6 Fallbacks and the gate

The default CSS is the **still page**: no pin, every stage in normal flow with its heading, line and a server-rendered still of its pose. The pin switches on only inside

```css
@media (scripting: enabled) and (prefers-reduced-motion: no-preference) { … }
```

`useScrollSteps` returns `enhanced = false` until hydration confirms that same query, and the stills are rendered while `enhanced` is false. Reduced motion and no-JS get full content parity.

## 11. Artwork

Two kinds of figure. Both draw in the current ink colour.

**Line art (SVG).** Reference implementations: the home phone (`projects/_hero/PhoneArtwork.tsx`) and the SIDEKICK board (`_sidekick/Mainboard.tsx`).

- `stroke="currentColor"`, `fill="none"` by default, 1.25 outline width, round caps and joins, `vector-effect: non-scaling-stroke`.
- Hierarchy is stroke opacity only, from about 0.07 for construction lines to 1 for the part in focus. A dimmed part is still the same colour.
- Dashed strokes mean planned or unresolved; solid means built.
- Fills are flat and rare: black occlusion faces on the phone (a nearer part hides the lines behind it), board substrate and copper pours at 6–7% opacity, solid `currentColor` part bodies on the SIDEKICK board, and the red marks. Never a gradient fill.
- One artwork per pin. Stages are poses of the same parts; nothing is swapped between stages.

**Dot figures (canvas / SVG).** BRAIN lessons, the home build orbs, the join seat.

- Painted by `_system/dots` from the element's computed `color`. Dots, hairline connectors, and at most one red anchor dot.
- The same dots persist across stages and travel dot for dot; a figure never wipes to blank.
- A looping figure runs only while on screen, with the tab visible, and not paused.

**Never:** gradients, glow, bloom, drop shadows, glass, photographic renders, stock imagery.

## 12. SIDEKICK functional palette

The one sanctioned multi-colour exception, requested by the Head Designer for `/projects/sidekick/` only. Six hues with alternating lightness so that neighbours separate without relying on hue. A group colour is never shown without its text label. Source: `app/(apple)/projects/sidekick/sidekick.module.css`.

| Variable | Group | sRGB fallback | `oklch` |
|---|---|---|---|
| `--sk-g-compute` | Processing | `#60c2ff` | `oklch(0.78 0.13 240)` |
| `--sk-g-memory` | Memory | `#b28fef` | `oklch(0.72 0.14 300)` |
| `--sk-g-power` | Power | `#68d7a1` | `oklch(0.8 0.13 160)` |
| `--sk-g-usb` | USB | `#5ce9f0` | `oklch(0.86 0.12 200)` |
| `--sk-g-rf` | RF transceiver | `#ef8bc5` | `oklch(0.76 0.14 345)` |
| `--sk-g-io` | Board I/O | `#cce576` | `oklch(0.88 0.14 120)` |
| `--board-copper` | Copper and parts at rest | `#c9965f` | — |
| `--sk-fr4` | FR-4 core outline | `#efe6d2` | — |

Copper is the board colour on any page that draws a board. The group hues stay on SIDEKICK.

## 13. Chrome: nav, join, footer

### 13.1 Nav — one sticky bar

`<LocalNav>` (`_chrome/LocalNav.tsx`): `position: sticky; top: 0`, 52px, 1024px column, translucent ground with `backdrop-filter: saturate(1.8) blur(20px)`, 1px bottom hairline.

- Left: the `DIGITAL` wordmark (21px / 600; 19px ≤ 734px) linking to `/`.
- Links: the three builds from `PAGES` in `_chrome/routes.ts`, 12px. The current page's link gets `aria-current="page"`. At ≤ 734px the links collapse into a chevron disclosure menu.
- Right: **one** filled pill, 30px tall inside a 44px hit target, 12px / 500. Default label "Join build night" → `#join`. A page may relabel it; it may not add a second one.
- `utility` slot: at most one extra control (SHADES' spacing toggle).
- Tone: `tone="dark"` sets the first paint; `ToneSync` then follows the section under the bar.

BRAIN is locked with its earlier two-bar chrome (a 44px global bar that scrolls away above a BRAIN-titled local nav). Do not copy that to another page.

### 13.2 Join ending

`<JoinChapter world="apple">` (`_chrome/JoinChapter.tsx`), `id="join"`, is the last section before the footer on every build page and the home page.

- Centred, 1024px column, `--r2-space-10` vertical padding (`-9` on phones).
- Title at the `h2` step, an optional lead, the meeting line at the `h3` step / 600, then "No project experience required."
- Primary action: a chevron text link by default, because the nav pill is the page's one filled CTA. `primaryStyle="pill"` (44px, 17px / 500) is for a page whose join is the destination (BRAIN).
- Default visual: a 200px open-seat dot figure that plays once on entry and carries the red anchor.
- "Back a build" row: sponsor, recruiter and faculty links read from `lib/data/involvement.ts`.

Facts come from `_chrome/club.ts`, not from the page:

| Constant | Value |
|---|---|
| `CLUB.when` | Thursdays, 6:00 PM (build night) |
| `CLUB.discord` | `https://discord.gg/U77P2U2D84` |
| `LINKS.brainDiscord` | `https://discord.gg/Smfv4weJMz` |
| `LINKS.github` | `https://github.com/DIGITALatCalPolyPomonaCPP/SIDEKICK-Prev.-TheSmartphoneProject-` |
| `LINKS.linkedin` | `https://www.linkedin.com/company/digital-cal-poly-pomona` |
| `MEETINGS.brain.when` | Fridays, 12:00 – 1:00 PM |
| `MEETINGS.subteam.when` | Subteam meetings depend on the team. (SIDEKICK, SHADES) |

### 13.3 Footer

`<WorldFooter world="apple">`: `--r2-ground-raised`, 1024px column, padding 48px top / 56px bottom. Rows, top to bottom: the thesis (17/25, 600); the build links (DIGITAL, SIDEKICK, SHADES, BRAIN; 12px, 44px tall); site and legal links; the social icons (Discord, Instagram, LinkedIn, GitHub; external, new tab, `rel="noopener noreferrer"`); meta (12/16: build night, room, "DIGITAL @ Cal Poly Pomona").

**Rows (2026-10-07):** builds, then site pages, then legal (`SITE_PAGES`, `LEGAL_PAGES` in `routes.ts`), then the social row, then the meta lines.

**Social icons.** Discord, Instagram, LinkedIn and GitHub are line icons from `@tabler/icons-react` (the brand set: `IconBrandDiscord`, `IconBrandInstagram`, `IconBrandLinkedin`, `IconBrandGithub`), 22px at stroke 1.5 so they match the page's line art. `--r2-ink-2` at rest, `--r2-ink` on hover and focus, each in a 44px target with an `aria-label` and `title`. No filled brand marks, no brand colours, no icon without a text name. Use the same set and weight anywhere else a social icon is needed. URLs come from `siteConfig.social` through `LINKS` / `CLUB`.

### 13.4 SitePage — the frame for a simple page

`<SitePage>` (`_chrome/SitePage.tsx`) renders the skip link, the one `LocalNav`, a single `<main id="r2-main">`, and the footer. Props: `children`; `cta` (default "Join build night" → `/#join`, `null` hides it); `tone` (`'dark'` default, or `'light'`). Its class vocabulary (`.hero`, `.section`, `.wrap`, `.prose`, `.facts`, `.rows`, `.grid`, form controls) is in `_chrome/site-page.module.css` and documented in the component's header comment. It was being built on 2026-10-07; read that comment before relying on a class.

## 14. Motion

| Token | Value | Use |
|---|---|---|
| `--r2-ease-ui` | `cubic-bezier(0.4, 0, 0.6, 1)` | Colour, opacity, caption swap, nav tone |
| `--r2-ease-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | The home hero's art box opening |
| `--r2-ease-entrance` | `cubic-bezier(0.16, 1, 0.3, 1)` | Page entrance moves |
| `--r2-dur-snap` | 120ms | Colour snap |
| `--r2-dur-ui-fast` / `-ui` / `-ui-slow` | 240 / 280 / 320ms | Hover, nav tone, state change |
| `--r2-dur-draw` | 480ms | A glyph drawing on, once |
| `--r2-spring-spatial-fast` / `-spatial` / `-effects` | `linear()` springs, 350 / 420 / 300ms | Available; pair each with its `-dur` |
| `--r2-reveal-y` | 30px | `.r2-reveal` travel |

- Stage playback: 900–1200ms per stage, cubic in-out (§10).
- `.r2-reveal`: 30px rise and fade tied to `animation-timeline: view()` (`entry 0% cover 30%`). Where the browser lacks it, or under reduced motion, the element is simply visible.
- A figure plays once on entry (`PlayOnce`) or is driven by a pin. Nothing loops for decoration; a loop has a pause control (BRAIN).
- `prefers-reduced-motion: reduce` removes pins, transitions and loops; content is unchanged.

## 15. Accessibility

1. Every interactive target is at least 44 × 44px (`--r2-target`), including a 30px pill.
2. Focus ring: `2px solid var(--r2-focus)`, `outline-offset: 3px`, on every focusable element (global rule in `worlds.css`). Never remove it without replacing it.
3. One `h1` per page. Stage headings after the first are `h2`.
4. One `<main id="r2-main">` per page, with a "Skip to content" link as the first focusable element. New pages get this from `SitePage`.
5. `aria-current="page"` on the current nav link; `aria-current="step"` on the current tracker button.
6. Artwork is `aria-hidden`; the stage's heading and line are the text alternative. A canvas figure has a written alternative per stage.
7. Contrast: `--r2-ink-2` is 5.1:1 on white and 8.2:1 on black. `#d8412f` is not used as text.
8. Colour is never the only signal: SIDEKICK group colours always sit beside a label.
9. Reduced motion and no-JS show the full content (§10.6).

## 16. Performance

1. **0 rAF at rest.** No animation frame runs while nothing is moving. A pin's passive scroll listener is attached only while the pin is near the viewport (`IntersectionObserver`, 25% margin) and coalesces its work into one frame of the shared ticker.
2. Animate `transform` and `opacity` only. No layout properties, no per-frame React state.
3. Heavy geometry lives in **static SVG files** referenced with `<use href="…#l">`, not in the HTML or the RSC payload. A pose moves whole boxes and never rewrites a path. (The 19 SIDEKICK board files total about 227 KB; the extraction script enforces a 250 KB budget.)
4. Server HTML paints the final still layout. Hydration adds the pin; it does not move content.
5. Fonts: variable, Latin subset, `swap`, self-hosted.
6. Sibling page links use `prefetch={false}`.
7. `IntersectionObserver` for nav tone and entry detection. Page components do not add their own scroll listeners; they use `useScrollSteps`.

## 17. On-brand test

**The signature test.** Could a member sign this? If attribution would be embarrassing (borrowed claims, stock imagery, an unsourced number) it fails.

**The drawing test.** Does it look documented rather than decorated? Line art drawn from the real files, real measurements and honest status pass. Gradients, glow and filler fail.

Checklist for a new page:

1. One `h1`, one `main`, one sticky nav, one filled CTA.
2. Dark story first, one seam, light catalogue after.
3. Any scroll-driven figure is a played stage with stills and a tracker.
4. Every colour is a token; the only red is a mark; no new hue.
5. Every number and part name is traceable to a file.
6. The heading is the topic. One supporting line.
7. Nothing is clipped at 1600×790, 1280×720, 768×1024 and 390×844.
8. Reduced motion and no-JS lose nothing.
9. 0 rAF at rest; 0 console errors; `./run.sh check` is clean.

## 18. Anti-patterns

Rejected by the Head Designer. Do not reintroduce.

| Do not | Do instead |
|---|---|
| Scrub a figure frame by frame with scroll | Scroll picks a stage; a timed tween plays it |
| Let a figure rest half-way between stages | Every rest position is a stage pose |
| Add a second nav bar that scrolls away | One sticky bar |
| Draw divider lines between lessons or stages | Separate with space and the caption swap |
| Let a title clip under the nav or the fold | Clamp on `svh`; let the figure take the remainder |
| Print `[confirm]` tags | Print only source-backed facts |
| Use lab wording (round, world, wave, variant, prototype) in the UI or metadata | Plain product wording |
| Add eyebrow labels above headings | The heading is the topic |
| Number sections (01, 02) | Order carries the sequence |
| Put content in cards | Hairline lists and grids on the section ground |
| Use gradients | Flat ground from a token |
| Use glow, bloom, shadow or glass on artwork | Line weight and opacity |
| Use red as decoration, fill or body text | Red is one mark |
| Add a hue outside the tokens | Ink, ink-2, copper; group hues on SIDEKICK only |
| Inline large SVG geometry in a component | Static file + `<use>` |
| Hard-code copy in a component | `_content/*.ts` and `_chrome/club.ts` |
| Name people | Roles and teams only |

**Known deviations in the shipped code** (recorded so they are not copied):

- SIDEKICK (locked as built): each stage caption has a Geist Mono label line above the heading. It carries the group swatch and is the colour legend.
- BRAIN (locked as built): two-bar chrome (§13.1).
- SHADES (open): the hero glasses use a radial-gradient lens glow and a blur filter (`projects/shades/Glasses.tsx`), and the highlights strip uses rounded cells (`_system/ui/Highlights`).
- Home, SIDEKICK and SHADES wrap content in `<div id="r2-main">`, not `<main>`. Only BRAIN and `SitePage` render `<main>`. `ToneSync` selects sections inside `main`.

## 19. Token reference

Source: `app/(apple)/_system/tokens/worlds.css` (`.world-apple`, `.world-apple [data-tone='dark']`) and `_system/fonts/fonts.css` (`.font-apple`). The files win over this table.

| Family | Tokens | Values (light → dark where they differ) |
|---|---|---|
| Ground | `--r2-ground`, `--r2-ground-raised` | `#ffffff` → `#000000`; `#f5f5f7` → `#161617` |
| Ink | `--r2-ink`, `--r2-ink-2`, `--r2-ink-3` | `#1d1d1f` → `#f5f5f7`; `#6e6e73` → `#a1a1a6`; `#6e6e73` → `#86868b` |
| Hairline | `--r2-hairline`, `--r2-hairline-strong` | `#d2d2d7` → `#424245`; `#86868b` |
| Red | `--r2-trigger`, `--r2-trigger-ink` | `#d8412f`; `#b3321f` → `#ef6a55` |
| Focus | `--r2-focus` | `#0b0c0a` → `#f5f5f7` |
| Nav | `--r2-nav-bg`, `--r2-nav-h` | `rgba(255,255,255,.78)` → `rgba(22,22,23,.8)`; `52px` |
| CTA | `--r2-cta-bg`, `--r2-cta-ink`, `--r2-cta-bg-hover`, `--r2-cta-ink-hover` | `#1d1d1f` → `#f5f5f7`; `#ffffff` → `#1d1d1f`; `#b3321f`; `#ffffff` |
| Type size / line | `--r2-fs-*`, `--r2-lh-*` | hero 80/84, h1 56/60, h2 48/52, h3 28/32, lead 21/29, body 17/25, small 12/16, label 12/16 |
| Type, ≤ 734px | same | hero 40/44, h1 32/36, h2 32/36, h3 21/25, lead 17/25 (body, small, label unchanged) |
| Tracking | `--r2-ls-*` via `--track-80/56/28/21/17/mono` | `-0.035em`, `-0.03em`, `-0.015em`, `-0.004em`, `0`, `0.04em` |
| Weight | `--r2-fw-display`, `--r2-fw-text`, `--r2-fw-strong` | `600`, `400`, `600` |
| Fonts | `--font-display`, `--font-text`, `--font-mono` | Geist, Geist, Geist Mono |
| Space | `--r2-space-1` … `--r2-space-10` | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px |
| Layout | `--r2-gutter`, `--r2-measure`, `--r2-radius`, `--r2-target`, `--r2-sticky-top` | 16 / 32 / 48px; `34rem`; `12px`; `44px`; `var(--r2-nav-h)` |
| Ease | `--r2-ease-ui`, `--r2-ease-emphasized`, `--r2-ease-entrance` | `cubic-bezier(0.4, 0, 0.6, 1)`; `(0.2, 0, 0, 1)`; `(0.16, 1, 0.3, 1)` |
| Duration | `--r2-dur-snap`, `-ui-fast`, `-ui`, `-ui-slow`, `-draw`; `--r2-reveal-y` | 120, 240, 280, 320, 480 ms; `30px` |
| SIDEKICK only | `--sk-g-*`, `--board-copper`, `--sk-fr4` | §12 |

`worlds.css` also still defines a `.world-signal` token set. No live route uses it.

## 20. Changelog

| Date | Change |
|---|---|
| 2026-06-01 | Initial DESIGN.md: industrial studio system derived from `Refractor/`. |
| 2026-09-14 | Rewritten as the DIGITAL brand system (paper and ink palette, serif / sans / mono registers, the sheet model, the sign-off block). |
| 2026-10-07 | **Rewritten as the Apple system, as implemented.** The Head Designer made the Apple pages the default routes (`/`, `/projects/sidekick/`, `/projects/shades/`, `/projects/brain/`) and the Apple system the site's design system. SIDEKICK and BRAIN are locked. The previous visual system (parchment ground, Newsreader / IBM Plex, the sheet model, the sign-off block, the build-record page anatomy) is retired; its code is in `archive/` and its specification is in git history (`DESIGN.md` before this date). The brand layer is kept: the venture-studio positioning, the thesis, the four beliefs, the voice rules and the on-brand test. Remaining `app/(legacy)/` routes are being migrated onto this system. |
