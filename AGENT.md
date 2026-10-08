# AGENT.md — Conventions for Automated Agents

This file provides a concise reference for any automated agent (CI bot, AI coding assistant,
or other tooling) working in this repository. For full detail on every convention, see
`CLAUDE.md` — this file highlights the rules most likely to affect agentic workflows.

---

## Project Overview

**DIGITAL @ Cal Poly Pomona** is the website of a student-run venture studio, built with
**Next.js 14 (App Router)**, static export (`output: 'export'`), React 18 and TypeScript, and
deployed to Vercel. The **Apple system** is the default design system (2026-10-07): live
pages are in `app/(apple)/`, earlier designs in `archive/` (not built). All design decisions are governed by `DESIGN.md`.

---

## Verify Before You Commit

```bash
./run.sh check      # Preflight: toolchain, deps, critical files, routes, tsc, lint
./run.sh build      # Full production static export (use to catch build-time errors)
```

Always run `./run.sh check` before creating a commit. If it exits non-zero, fix the
failures first.

---

## Key Reference Files

- `DESIGN.md` — design system source of truth
- `docs/design/` — route-scoped style references (see below)
- `TODO.md` — living work log (sprint tasks + Dev Build / Version Control table)
- `CLAUDE.md` — full project conventions

---

## Design Docs — Route-Scoped Style References

Before **any** UI/UX change, read the DESIGN.md governing that route. Changes beyond
token-faithful adjustments require explicit **Head Designer (user) approval before
implementation** — propose the change and wait for sign-off; never overhaul first.

| Route | Governing style reference |
|-------|---------------------------|
| `/` home, `/projects/shades/` | root `DESIGN.md` |
| `/projects/sidekick/` | `docs/design/sidekick.DESIGN.md` — **LOCKED 2026-10-07** |
| `/projects/brain/` | `docs/design/brain.DESIGN.md` — **LOCKED 2026-10-07** |
| `/about`, `/team`, `/community`, `/contact`, `/get-involved`, legal pages, error pages | Apple system (`SitePage` / `LegalPage` frames) — root `DESIGN.md` |

Locked pages change only with Head Designer sign-off. `docs/design/landing.DESIGN.md`,
`smartphone.DESIGN.md` and `glasses.DESIGN.md` describe archived designs.

**Copy and wording** are governed separately, across all routes, by
[`docs/design/BRAND.md`](./docs/design/BRAND.md). Before changing any string in
`app/(apple)/_content/`, `app/(apple)/_chrome/club.ts` or `lib/data/`, read it. Copy changes go through the `brand-voice-strategist` agent to write and the
`brand-guardian` agent to review before committing.

---

## Standing Rule — Keep TODO.md in Sync with Git History

> **Whenever documentation is updated, record the corresponding commit (commit number +
> message) in `TODO.md` under the current Sprint's Dev Build / Version Control table,
> keeping the work log in sync with git history.**

Commit numbers are sequential, zero-padded identifiers (e.g. `#0001`, `#0002`). Every
commit that touches docs, config, or feature work must be recorded in the Dev Build /
Version Control table in `TODO.md`. Do not leave commits unrecorded.

---

## Quick Constraints

- Static export only — no runtime server features.
- Content in `app/(apple)/_content/` (Apple pages) and `lib/data/` (club facts, team, involvement) — never hard-code copy into pages or components.
- Apple pages: CSS modules on `--r2-*` tokens. No live route uses Tailwind. No CSS-in-JS libraries.
- TypeScript strict — all code must pass `tsc --noEmit`.
- One red (`#d8412f`) — a mark only, per `DESIGN.md` §6.
- Scroll picks a stage and a timed tween plays it; never scrub. One sticky nav bar per page.
