# archive/

Previous designs and iterations of the DIGITAL site, moved here on **2026-10-07** when the approved
"Apple world" pages became the default routes (`app/(apple)/`).

Nothing in this folder is built, type-checked, linted or deployed:

- Next.js only routes `app/`; Tailwind only scans `app/` and `components/`; `next lint` only lints `app/`, `components/`, `lib/`.
- `tsconfig.json` excludes `archive`.
- Archived code is **not expected to compile in place** (its imports point at the old locations).

Paths mirror the originals: `archive/<original path>`. To restore something, `git mv` it back to the
path in the "Original path" column. Every move was a `git mv` (or a plain `mv` for files that were
not yet tracked), so `git log --follow` still works.

## Lab round 1 (2026-10-02) — six concept directions and their gallery

| Original path | What it was | Files |
|---|---|---|
| `app/design-lab/page.tsx` | Lab gallery index | 1 |
| `app/design-lab/_gallery/` | Gallery chrome, concept data, fonts | 9 |
| `app/design-lab/a/` … `f/` | Concepts A–F (one full landing each) | 69 |
| `app/design-lab/components/` | Component specimen page | 2 |
| `app/design-lab/mascot/` | Mascot demo | 5 |
| `app/design-lab/type-lab/` | Round-1 type trial | 7 |
| `public/design-lab/gallery/`, `d/`, `e/` | Gallery screenshots, reel, concept D/E images | 61 (3.6 MB) |

## Lab round 2 (2026-10-02 → 2026-10-07) — the parts that were not promoted

| Original path | What it was | Files |
|---|---|---|
| `app/design-lab/r2/layout.tsx` | Lab shell (hid the production nav/footer/cursor, patched `matchMedia`); replaced by `app/(apple)/layout.tsx` | 1 |
| `app/design-lab/r2/signal/` | Signal Capture world (home, sidekick, shades, brain) | 13 |
| `app/design-lab/r2/boards/` | Board explorer / bench pages | 8 |
| `app/design-lab/r2/system/` | Shared-system specimen page | 9 |
| `app/design-lab/r2/type/` | Round-2 type trial | 5 |
| `app/design-lab/r2/apple/page.tsx` | Old Apple home with the dot orb (replaced by the phone hero, now `app/(apple)/page.tsx`) | 1 |
| `app/design-lab/r2/apple/_home/StagePin.tsx` | Orb stage pin, only used by the old orb home | 1 |
| `app/design-lab/r2/apple/hero/stills/page.tsx` | Phone-hero stills page (lab review aid) | 1 |
| `public/design-lab/r2/cine/` | 78 unused cinematic files: every Signal-world clip and the six Apple clips no page plays (only `shades-fixate-apple-*` is live, now in `public/cine/`) | 78 (57 MB) |
| `public/design-lab/r2/boards/fingerprint/`, `zynq-carrier-power/` | Layer SVGs for `BoardLayers` (no live page renders it) | 38 |
| `public/design-lab/r2/boards/sidekick-mainboard/components.json` | Footprint table written by `design-lab/scripts/sidekick-mainboard.mjs`; no page fetches it | 1 |
| `public/design-lab/r2/review.html` | Round-2 review board | 1 (2.2 MB) |

## Previous production site (2025-12 → 2026-09) — replaced by the promotion

| Original path | What it was | Dates | Files |
|---|---|---|---|
| `app/page.tsx` | Old landing (`HomeLanding`) | 2025-12 → 2026-08 | 1 |
| `app/projects/` | Projects index, `/projects/modular-smartphone`, `/projects/smart-reading` and their layouts (URLs now redirect, see `app/(apple)/projects/`) | 2025-12 → 2026-08 | 6 |
| `app/review/` | Internal stakeholder hub (no redirect stub) | 2026-07 → 2026-08 | 1 |
| `components/home/` | Old landing component + CSS | 2026-07 → 2026-08 | 2 |
| `components/phone-v2/` | Modular-smartphone immersive page | 2026-07 → 2026-08 | 11 |
| `components/teardown/` | Scroll-driven hardware teardown | 2026-06 → 2026-07 | 7 |
| `components/experiments/glasses/` | Smart-reading 3D experience | 2026-07 → 2026-08 | 10 |
| `components/motion/` | `TextReveal`, GSAP setup | 2026-07 → 2026-08 | 2 |
| `components/ui/` (13 of 15 files) | `Badge`, `Button`, `Card`, `EscapeHatch`, `Eyebrow`, `Icon`, `Input`, `NextProjectCard`, `Section`, `Select`, `Textarea`, `Timeline`, `index.ts`. `CursorProvider` and `Reveal` followed on 2026-10-07 (legacy chrome, below). | 2025-12 → 2026-08 | 13 |
| `lib/teardown/` | Teardown config, assets, types, utils | 2026-06 → 2026-07 | 4 |
| `lib/data/homeLanding.ts`, `phoneV2.ts`, `projects.ts`, `mission.ts`, `reviewRoutes.ts`, `experiments/glasses.ts` | Content for the pages above | 2025-12 → 2026-09 | 6 |
| `public/assets/frames/`, `layers/`, `teardown/` | Teardown frames, layers, video | 2026-06 → 2026-07 | 235 (15.7 MB) |
| `public/assets/experiments/` | Glasses model and textures | 2026-07 | 5 (10.2 MB) |
| `public/images/` | Placeholder images | 2025-12 → 2026-01 | 8 |

## Legacy chrome (2025-12 → 2026-10) — dead once every page moved to `app/(apple)/`

Archived 2026-10-07 by the link audit, after `app/(legacy)/` held no page. Nothing under `app/` imports any of these.

| Original path | What it was | Files |
|---|---|---|
| `app/(legacy)/layout.tsx`, `app/(legacy)/_shell.ts` | Route-group layout (Navbar, Footer, cursor, skip link) and its font/colour shell | 2 |
| `components/layout/Navbar.tsx`, `Footer.tsx`, `BrandLogo.tsx`, `PageShell.tsx` | Pre-Apple site chrome. `components/` is now empty and gone. | 4 |
| `components/ui/CursorProvider.tsx`, `Reveal.tsx` | Crosshair cursor and scroll-reveal wrapper | 2 |
| `lib/fonts.ts` | `next/font` stacks for the landing and studio systems (the live fonts are `app/(apple)/_system/fonts/`) | 1 |
| `lib/immersiveRoutes.ts` | Route list that hid the old Navbar/Footer; only they read it | 1 |
| `lib/useReveal.ts`, `lib/utils.ts` (`cn`) | Helpers used only by the files above | 2 |
| `lib/data/siteLinks.ts` | Nav / footer / social link lists for the old chrome (carried the stale Notion and personal-GitHub links). Live footer links are in `app/(apple)/_chrome/routes.ts`; public URLs in `lib/data/siteConfig.ts` `social`. | 1 |
| `public/assets/landing/Landing-Page-Hero.png` | Old landing hero image; no page referenced it (`siteConfig.assets.landingHero` removed) | 1 (7.8 MB) |

Same method as below: `tsc --listFilesOnly` from `app/**` (134 files in the graph), then a string search for each public asset.
Left in place: `app/globals.css` and `tailwind.config.ts` (Tailwind preflight, the forms plugin, `sr-only`, `antialiased`,
`overflow-x-hidden` and `html { scroll-behavior }` still reach the live pages; the legacy tokens in them do not), and
`public/assets/landing/DIGITAL_V1_Logo1*.png` (still named by `siteConfig.assets`, though no live component reads it).

## Earlier references and prototypes

| Original path | What it was | Date | Files |
|---|---|---|---|
| `UI_Pages/` | First static page mockups | 2025-12-26 | 14 (18.3 MB) |
| `Refractor/` | Reference HTML/CSS build for the "industrial studio" theme | 2026-06-10 | 17 (15.7 MB) |
| `prototypes/brand-system.html` | Brand-system prototype | 2026-09-14 | 1 |

## How "unused" was decided

Import graph from the live entry points (`app/**/{page,layout,error,not-found,global-error,sitemap,robots}.tsx?`
after the move), resolved with `tsc --listFilesOnly`, plus CSS imports. A file under `components/`, `lib/`
was archived only if it is outside that graph. A public asset was archived only if neither its URL nor its
file name appears in any file of the graph (template-built URLs — `public/boards/sidekick-mainboard/*.svg`,
`public/cine/*` — were kept by hand).

## Not archived

- `design-lab/` (top level): the lab's docs, research, renders and scripts — the working record.
- `docs/`, `scripts/`, config files.
- Unused exports inside `app/(apple)/_system`, `_brain`, `_sidekick`, `_shades`, `_content`, `_home`: left in place on purpose.
