# AGENT.md — Conventions for Automated Agents

This file provides a concise reference for any automated agent (CI bot, AI coding assistant,
or other tooling) working in this repository. For full detail on every convention, see
`CLAUDE.md` — this file highlights the rules most likely to affect agentic workflows.

---

## Project Overview

**DIGITAL @ Cal Poly Pomona** is a student engineering club website built with
**Next.js 14 (App Router)**, static export (`output: 'export'`), React 18, TypeScript, and
Tailwind CSS 3. It is deployed to Vercel. The signature UI is an **"industrial studio"
scroll-driven teardown**. All design decisions are governed by `DESIGN.md`.

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
| `/` (home landing; also holds subsidiary-page direction for `/contact`, `/get-involved`) | `docs/design/landing.DESIGN.md` |
| `/projects/modular-smartphone` | `docs/design/smartphone.DESIGN.md` |
| `/projects/smart-reading` | `docs/design/glasses.DESIGN.md` |
| All other routes | root `DESIGN.md` (industrial studio system) |

**Copy and wording** are governed separately, across all routes, by
[`docs/design/BRAND.md`](./docs/design/BRAND.md). Before changing any string in `lib/data/`,
read it. Copy changes go through the `brand-voice-strategist` agent to write and the
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
- Content in `lib/data/` — never hard-code copy into pages or components.
- Tailwind for styling — no CSS-in-JS libraries.
- TypeScript strict — all code must pass `tsc --noEmit`.
- One accent color (`#d8412f`) — used sparingly per `DESIGN.md`.
