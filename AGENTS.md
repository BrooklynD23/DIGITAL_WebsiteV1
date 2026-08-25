# AGENTS.md — Entry Point for Automated Agents

Full agent conventions live in [`AGENT.md`](./AGENT.md); full project conventions in
[`CLAUDE.md`](./CLAUDE.md). This file exists under the standard `AGENTS.md` name so every
tool finds the same direction. The single most important rule is repeated here:

## Design Docs — Read Before Any UI/UX Change

Every route is governed by a style reference. **Read the governing doc before touching
that route's UI.** Changes beyond token-faithful adjustments require explicit **Head
Designer (user) approval before implementation** — propose the change and wait for
sign-off; never overhaul first.

| Route | Governing style reference |
|-------|---------------------------|
| `/` home landing | `docs/design/landing.DESIGN.md` |
| `/contact`, `/get-involved`, `/about` (incl. folded pillars), `/team`, `/community`, legal pages, error pages | `docs/design/landing.DESIGN.md` (secondary routes rebuilt 2026-08) |
| `/projects/modular-smartphone` | `docs/design/smartphone.DESIGN.md` |
| `/projects/smart-reading` | `docs/design/glasses.DESIGN.md` |
| `/pillars` (redirect stub → `/about`) and `/review` (internal hub, removal pending) | root `DESIGN.md` legacy — do not extend |

**Copy and wording** are governed separately, across all routes, by
[`docs/design/BRAND.md`](./docs/design/BRAND.md). Before changing any string in `lib/data/`,
read it. Copy changes go through the `brand-voice-strategist` agent to write and the
`brand-guardian` agent to review before committing.

## Quick Constraints

- Verify with `./run.sh check` before committing.
- Static export only; content lives in `lib/data/`; Tailwind only; TypeScript strict.
- Record every commit in `TODO.md`'s Dev Build / Version Control table.
