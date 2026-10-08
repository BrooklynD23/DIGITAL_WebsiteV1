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

## Quick Constraints

- Verify with `./run.sh check` before committing.
- Static export only; content lives in `app/(apple)/_content/` and `lib/data/`; Apple pages use CSS modules on tokens (no live route uses Tailwind); TypeScript strict.
- Record every commit in `TODO.md`'s Dev Build / Version Control table.
