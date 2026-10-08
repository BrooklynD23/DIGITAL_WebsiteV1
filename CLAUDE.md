# CLAUDE.md — Project Conventions for Claude Code

## Project Overview

**DIGITAL @ Cal Poly Pomona** is the website of a student-run venture studio, built with
**Next.js 14 (App Router)**, React 18 and TypeScript. The site is configured for **static
export** (`output: 'export'` in `next.config.js`) and is deployed to Vercel.

As of 2026-10-07 the **Apple system** is the site's default design system. The live pages are
in the `app/(apple)/` route group: `/` (phone-hero home), `/projects/sidekick/`,
`/projects/shades/` and `/projects/brain/`. The remaining pages (about, team, community, get involved, contact, legal) are in
`app/(apple)/` on the same system. Every earlier design and
iteration is in `archive/`, which is excluded from the build and from type-checking.

The system is documented as implemented in the root `DESIGN.md`. When code and that document
disagree, fix whichever is wrong and record it in the `DESIGN.md` changelog; for a **locked**
page, the route spec wins and the code does not change without Head Designer sign-off.

---

## How to Run / Verify

The project ships a preflight + dev launcher script at the repo root:

```bash
./run.sh            # Run preflight checks, then start the dev server (default)
./run.sh check      # Run preflight checks only and exit — use this to verify health
./run.sh build      # Run preflight checks, then produce a production static export
```

Run `./run.sh check` before committing to confirm TypeScript and lint are clean.

---

## Key Reference Files

| File / Path | Purpose |
|-------------|---------|
| `DESIGN.md` | Source-of-truth design system (Apple system): tokens, patterns, rules, route lock status |
| `docs/design/` | Route specs for locked pages + `BRAND.md` (see Design Docs below) |
| `TODO.md` | Living work log — sprint tasks + Dev Build / Version Control |
| `app/(apple)/` | Live pages on the Apple system (route group; the folder name is not part of the URL) |
| `app/(apple)/layout.tsx` | World shell: token class `world-apple` + font class |
| `app/(apple)/_system/` | Shared system: tokens (`tokens/worlds.css`), scroll hooks (`tokens/scroll.ts`), fonts, dot engine, shared UI |
| `app/(apple)/_chrome/` | `LocalNav`, `WorldFooter`, `JoinChapter`, `SitePage` (frame for simple pages), `routes.ts`, `club.ts` (`CLUB` / `LINKS` / `MEETINGS`) |
| `app/(apple)/_content/` | Copy for the Apple pages (`home.ts`, `sidekick.ts`, `shades.ts`, `brain.ts`) |
| `app/(apple)/projects/_hero/` | Home phone-hero artwork + `useStagePlayback.ts` (stage playback used by every pinned page) |
| `lib/data/` | Club facts and content read by the Apple pages (siteConfig, team, involvement, about, community) |
| `archive/` | Every earlier design and iteration; not built, linted or type-checked. Index: `archive/README.md` |
| `design-lab/` | Design-lab record: research, renders, scripts (e.g. `scripts/sidekick-mainboard.mjs`) |

### Design Docs — Route-Scoped Style References

**Before any UI/UX change, read the DESIGN.md governing that route.** Changes beyond
token-faithful adjustments require explicit **Head Designer (user) approval before
implementation** — propose the change and wait for sign-off; never overhaul first.

| Route | Governing style reference |
|-------|---------------------------|
| `/` home | root `DESIGN.md` |
| `/projects/shades/` | root `DESIGN.md` |
| `/projects/sidekick/` | `docs/design/sidekick.DESIGN.md` — **LOCKED 2026-10-07: no changes without Head Designer sign-off** |
| `/projects/brain/` | `docs/design/brain.DESIGN.md` — **LOCKED 2026-10-07: no changes without Head Designer sign-off** |
| `/about`, `/team`, `/community`, `/contact`, `/get-involved`, `/privacy`, `/terms`, `/cookies`, error pages | Apple system (`SitePage` / `LegalPage` frames) — root `DESIGN.md` |
| Redirect stubs: `/pillars`, `/projects`, `/projects/modular-smartphone`, `/projects/smart-reading`, `/design-lab/r2/apple/*` | None — `app/(apple)/_redirect.tsx`; do not extend |

A locked page also depends on shared code (`_system`, `_chrome`, `projects/_hero/useStagePlayback.ts`).
Each locked spec lists its dependencies; re-check the locked page after touching any of them.

`docs/design/landing.DESIGN.md`, `docs/design/smartphone.DESIGN.md` and
`docs/design/glasses.DESIGN.md` describe **archived** designs (now in `archive/`). They are
kept as history, carry an "ARCHIVED 2026-10-07" banner, and govern no live route.

**Copy and wording** are governed separately, across all routes, by
[`docs/design/BRAND.md`](./docs/design/BRAND.md). Before changing any string in
`app/(apple)/_content/`, `app/(apple)/_chrome/club.ts` or `lib/data/`, read it. Copy changes go through the `brand-voice-strategist` agent to write and the
`brand-guardian` agent to review before committing.

---

## Standing Rule — Keep TODO.md in Sync with Git History

> **Whenever documentation is updated, record the corresponding commit (commit number +
> message) in `TODO.md` under the current Sprint's Dev Build / Version Control table,
> keeping the work log in sync with git history.**

Commit numbers are sequential, zero-padded identifiers assigned by the team (e.g. `#0001`,
`#0002`). The Dev Build / Version Control table in `TODO.md` maps each internal build number
to its commit SHA, commit message, and any relevant notes. No commit that touches docs,
config, or feature work should be left unrecorded in that table.

---

## Additional Conventions

- **Static export only.** Do not introduce server-only Next.js features (Server Actions that
  require a Node.js runtime, API routes that persist state, etc.). All data must be
  resolvable at build time.
- **Styling.** The Apple system uses CSS modules on the `--r2-*` tokens from
  `app/(apple)/_system/tokens/worlds.css`; do not add Tailwind classes or new hex values to
  Apple pages. Tailwind (`tailwind.config.ts`) is configured but no live route uses it. Do
  not add a CSS-in-JS library.
- **Content lives in data files** — never hard-code copy into page or component files.
  Apple pages read `app/(apple)/_content/*.ts` and `app/(apple)/_chrome/club.ts`; club facts,
  team, involvement and community content live in `lib/data/`. Print only facts a source states.
- **TypeScript strict.** The project uses `strict: true`. All new code must pass
  `tsc --noEmit` without errors.
- **One red (`#d8412f`, `--r2-trigger`).** Per `DESIGN.md` §6 it is a mark: the test point
  and marker in the home artwork, the anchor dot of a dot figure, and (in its darker
  text-safe shade `#b3321f`) the CTA hover. Never body text, never decoration.
- **Scroll plays stages.** Scroll picks a stage and a timed tween plays it
  (`useStagePlayback`); never scrub a figure frame by frame. One sticky nav bar per page.
