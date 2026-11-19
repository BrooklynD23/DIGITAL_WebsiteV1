# AGENTS.md — Entry Point for Automated Agents

All project and agent conventions live in [`CLAUDE.md`](./CLAUDE.md). Read it before any work; it is the
single source, so this file does not repeat it.

The three rules most often missed:

1. Read the design doc that governs a route before touching its UI (table in `CLAUDE.md`). Locked pages
   (`/projects/sidekick/`, `/projects/brain/`) change only with Head Designer sign-off.
2. Copy changes follow [`docs/design/BRAND.md`](./docs/design/BRAND.md): `brand-voice-strategist` writes,
   `brand-guardian` reviews.
3. Run `./run.sh check` before committing, and record every commit in `TODO.md`'s Dev Build / Version
   Control table.
