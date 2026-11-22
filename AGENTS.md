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

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
