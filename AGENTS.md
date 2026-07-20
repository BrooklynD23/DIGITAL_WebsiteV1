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
| `/` (home landing; also holds subsidiary-page direction for `/contact`, `/get-involved`) | `docs/design/landing.DESIGN.md` |
| `/projects/modular-smartphone` | `docs/design/smartphone.DESIGN.md` |
| `/projects/smart-reading` | `docs/design/glasses.DESIGN.md` |
| All other routes | root `DESIGN.md` (industrial studio system) |

## Quick Constraints

- Verify with `./run.sh check` before committing.
- Static export only; content lives in `lib/data/`; Tailwind only; TypeScript strict.
- Record every commit in `TODO.md`'s Dev Build / Version Control table.
