# CLAUDE.md — Project Conventions for Claude Code

## Project Overview

**DIGITAL @ Cal Poly Pomona** is a student engineering club website built with
**Next.js 14 (App Router)**, React 18, TypeScript, and Tailwind CSS 3. The site is
configured for **static export** (`output: 'export'` in `next.config.js`) and is deployed
to Vercel. The UI/UX follows an **"industrial studio" theme** — a scroll-driven hardware
teardown as the signature hero experience — documented fully in `DESIGN.md`. All design
decisions are governed by `DESIGN.md`; when code and that document conflict, the document
wins.

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

| File / Path      | Purpose                                                        |
|------------------|----------------------------------------------------------------|
| `DESIGN.md`      | Source-of-truth design system — colors, typography, components |
| `TODO.md`        | Living work log — sprint tasks + Dev Build / Version Control   |
| `lib/data/`      | All site content (projects, team, involvement, siteConfig)     |
| `app/`           | Next.js App Router pages and layouts                           |
| `components/`    | Shared React components                                        |
| `Refractor/`     | Reference HTML/CSS build driving the industrial studio theme   |

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
- **Tailwind for styling.** Do not add a separate CSS-in-JS library. Global overrides go in
  `app/globals.css`; component-level styles use Tailwind utility classes.
- **Content lives in `lib/data/`** — never hard-code copy into page or component files.
  Update the data files and let components consume them.
- **TypeScript strict.** The project uses `strict: true`. All new code must pass
  `tsc --noEmit` without errors.
- **One signal-red accent (`#d8412f`).** Per `DESIGN.md`, this color is reserved for
  eyebrows, margin notes, the progress rail, the active nav item, and the primary CTA hover.
  Do not use it decoratively.
