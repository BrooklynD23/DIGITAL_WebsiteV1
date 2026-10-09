# Round 2 handoff — DIGITAL design lab

> **Historical from 2026-10-07.** Every section except "Head Designer decisions, 2026-10-07" describes the lab as it was on 2026-10-02: the `/design-lab/r2/...` routes and `app/design-lab/r2/...` paths no longer exist (promoted to `app/(apple)/` or moved to `archive/`). Current state: root `DESIGN.md`, `CLAUDE.md`, `archive/README.md`.

Written 2026-10-02 by the round-2 orchestrator (context full). **Point the next agent's `/goal` at this file.**

## Goal for the next agent

Finish round 2 of the DIGITAL design lab and STOP for Head Designer review. Done when:
1. The finish-review loop is closed for all 4 pages × 2 worlds. Each original reviewer item is scored resolved, partial or unresolved, and the disposition is ship or fix-resolved.
2. The shared-chrome fix batch is verified across all 8 routes.
3. `design-lab/round2/DESIGN.md` is written by a documenter from the built system.
4. The stakeholder review page works at http://localhost:3100/design-lab/r2/review.html, with links into every approach.
5. Everything is committed (`#0065`, plus `#0066` if needed) and logged in `TODO.md`.
6. A short round-2 report is delivered in chat.

Then STOP. Do not pick a winner. Do not touch production.

## Session start (about 10 min)

1. `cd /home/danny/worktrees/digital-design-lab && git status --short | head && git log --oneline -3`. The branch is `design-lab/exploration`. Uncommitted finish-fix work is expected; see "State".
2. Start the dev server with `bash design-lab/scripts/ensure-server.sh` (shared; never kill it).
3. Read, in order: `PRODUCT.md` → `design-lab/round2/PLAN.md` (§4b, §6, §7) → this file → `design-lab/round2/system/SYSTEM.md`.
4. Delegate every substantial task to subagents (Agent tool, `model: "opus"`). The orchestrator plans, routes, verifies and commits. Every Agent prompt must include `Output style: follow ~/.claude/rules/common/subagent-output.md (i-have-adhd)`.
5. Ask the user decisions in chat with AskUserQuestion. Never use a localhost decision page: impeccable's `serve-question` does not load for this user.

## Head Designer decisions, 2026-10-07 (these override older lines in this file)

- **The Apple pages are the default routes.** `/` → `app/(apple)/page.tsx` (phone hero; artwork in `app/(apple)/projects/_hero/`), `/projects/sidekick/`, `/projects/shades/`, `/projects/brain/` → `app/(apple)/projects/…`. Shared code moved with them: `app/(apple)/_system/`, `_chrome/`, `_content/`. The old `/design-lab/r2/apple/*` URLs are redirect stubs in `app/(legacy)/design-lab/`.
- **SIDEKICK is LOCKED** (approved as built, 2026-10-07). Spec and locked-file list: `docs/design/sidekick.DESIGN.md`. It keeps the repository board `zynq_sdr_dongle.kicad_pcb` for now; swapping boards is a rerun of `design-lab/scripts/sidekick-mainboard.mjs`.
- **BRAIN stays LOCKED** at its new path `app/(apple)/projects/brain/` (`docs/design/brain.DESIGN.md`). SHADES and the home page are not locked.
- **`archive/`** holds every earlier design and iteration (lab round 1, the Signal world, the unpromoted round-2 parts, the previous production site). It is excluded from the build and from type-checking. Index: `archive/README.md`.
- **Legacy pages are being redesigned onto the Apple system.** `app/(legacy)/` (about, team, community, get-involved, contact, legal) moves to `app/(apple)/` on the shared `SitePage` frame (`app/(apple)/_chrome/SitePage.tsx`).
- **Root `DESIGN.md` is now the Apple system**, written from the shipped code. The previous brand-system document is in git history. The "never touch the root `DESIGN.md`" line under "Work queue" no longer applies.
- **One sticky nav bar** per page (BRAIN keeps its two-bar chrome because it is locked).
- **BRAIN (Apple world) is LOCKED.** `/design-lab/r2/apple/brain/` (now `/projects/brain/`) is approved as built. Spec and the locked-file list: `docs/design/brain.DESIGN.md`. Do not edit those files, and re-check BRAIN after any change to `_system`, `_chrome` or `apple/_hero/useStagePlayback.ts`. The "6 chapters / words gate" notes below describe the earlier build.
- **Focus from here:** SIDEKICK, the home page (phone hero at `/design-lab/r2/apple/hero/`) and SHADES. The Apple world is the direction for production.
- **`[confirm]` tags are removed** from the Apple-world pages by Head Designer instruction. The fabrication rule still stands: print only what a source states.
- **Scroll model:** scroll picks the target stage and a timed tween plays it (`app/(apple)/projects/_hero/useStagePlayback.ts`). No frame-by-frame scrubbing.
- **Links:** main club Discord `https://discord.gg/U77P2U2D84` (`CLUB.discord`), BRAIN Discord `https://discord.gg/Smfv4weJMz`, GitHub and LinkedIn in `_chrome/club.ts` `LINKS`. `lib/data` still has an older Discord invite; production data is not edited from the lab.
- **Meetings:** BRAIN Fridays 12:00 – 1:00 PM. SIDEKICK and SHADES subteam meetings depend on the team (`MEETINGS` in `_chrome/club.ts`).

## Hard rules (unchanged from round 1)

- **Where to work:** only in `/home/danny/worktrees/digital-design-lab`. The production checkout `/mnt/c/Users/DangT/Documents/Github/DIGITAL_WebsiteV1` is read-only. Never edit production files in the worktree either: `app/*` outside `app/design-lab/`, `components/`, `lib/`, `app/layout.tsx`, `app/globals.css`, `tailwind.config.ts`, `next.config.js`, `package.json`.
- **Fabrication:** never invent facts, metrics, people, partners or testimonials. Club-unconfirmed facts are tagged `[confirm]`. No personal names except mentor Dr. Mohamed El Hadedy.
- **Not used (user decision):** Higgsfield, Blender, 21st.dev, and video-generation models. Cinematics are code-only (Remotion).
- **Secrets:** the Gemini key lives only in the worktree `.env.local`. Never print or commit it.
- **Commits:** every commit is logged in the `TODO.md` Dev Build table (next row `lab.12 | #0065`). End commit messages with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **Before committing:** `npx tsc --noEmit` and `npx next lint --dir app/design-lab/r2` must be clean, plus a secret scan: `grep -rIl -E "AIza[0-9A-Za-z_-]{20,}" app/design-lab design-lab public/design-lab`.
- **Copy:** all lab copy is exploratory. Production copy must go through brand-voice-strategist → brand-guardian.

## What exists (round 2)

| Thing | Where |
|---|---|
| 8 pages (4 pages × 2 worlds) | `/design-lab/r2/{signal,apple}/` · `/sidekick/` · `/shades/` · `/brain/` → `app/design-lab/r2/{signal,apple}/…` |
| Shared content | `app/design-lab/r2/_content/{home,sidekick,shades,brain}.ts` |
| Page-scoped shared code | `app/design-lab/r2/{_home,_sidekick,_shades,_brain}/` |
| Shared system | `app/design-lab/r2/_system/` (dot engine `dots/`, 20 state icons `icons/`, tokens `tokens/worlds.css`, OFL fonts `fonts/`, KiCad boards `boards/` with `BoardLayers`, cinematics `cine/` with `CineClip` + manifest, plus PlayOnce, useScrollSteps, Highlights, Graticule). Docs: `design-lab/round2/system/{SYSTEM,BOARDS,CINE}.md` |
| Shared chrome | `app/design-lab/r2/_chrome/` (WorldNav, WorldFooter, LocalNav, JoinChapter, `club.ts`) |
| Specimens | `/design-lab/r2/system`, `/design-lab/r2/boards`, `/design-lab/r2/type` |
| Cinematics | `public/design-lab/r2/cine/` (7 clips × 2 worlds × 16:9/4:5), source in `design-lab/motion-reel/src/r2/` |
| Board geometry | `public/design-lab/r2/boards/` (38 layer SVGs) from `design-lab/scripts/kicad-to-*.mjs`; KiCad copies are in gitignored `design-lab/round2/assets/kb/source/` |
| Direction contracts | `.impeccable/surfaces/app-design-lab-r2-*-page-tsx.md`, each with a "## W3b changes" and a "## Finish fixes" log |
| Research | `design-lab/round2/research/*.md` (Apple playbook, Google, KB truth, Notion, agentic storytelling, type study, signature systems) |
| Critiques / finish reviews | `design-lab/round2/critiques/*.md`; `design-lab/round2/finish/{PACKET,home,sidekick,shades,brain}.md` |
| Stakeholder page | Source `design-lab/round2/stakeholder/compare.src.html`; build with `node design-lab/scripts/r2-stake-build.mjs` → `compare.html` (+ copy at `public/design-lab/r2/review.html`) |
| Lab tooling | `design-lab/scripts/shoot.mjs` (stitches tall pages, sets `data-r2-static` after hydration), `r2-words.mjs` (clip-aware words-per-viewport meter), `r2-*-raf.mjs` (0-rAF-at-rest gates), `gemini.mjs` |

**Decided by the Head Designer (don't reopen):**
- Two worlds: Signal Capture (seed `0a795440`) and Apple product page played straight.
- Names: SIDEKICK / SHADES / BRAIN.
- BRAIN has 6 chapters, at most 13 vh at 1440, as a concept story with no curriculum claims.
- The stage-to-rule pairing on Home is kept.
- The Apple nav title is "DIGITAL".
- Fonts: Hubot / Mona / Monaspace for Signal; Geist for Apple; Atkinson Hyperlegible Next for SHADES reading text (all OFL, self-hosted).
- Code-first build path.
- Knowledgebase facts are allowed, tagged `[confirm]`.

## State at handoff

- **Committed:** `#0059`–`#0065`. `#0065` holds the finish-review fixes, the SYS shared-chrome batch and the stakeholder review page.
- **Uncommitted (complete, gates passed by each agent):**
  - The finish-review fix batch for SIDEKICK, SHADES, BRAIN and Home (renders in `design-lab/renders/r2/<page>/v3/`).
  - CINE clip fixes: fixate pivot now bone, lightpath 4:5 labels, brain-context red removed.
- **Possibly still running when the orchestrator stopped** (check the files, not the agents; agent IDs don't survive sessions):
  1. **SYS shared-chrome fix batch:**
     - mono only for measured values (Join and nav buttons);
     - LocalNav tone follows the chapter beneath it;
     - WorldNav targets ≥44 px at 390;
     - overscroll matches the world ground;
     - `Highlights` per-card `tone` prop with no red progress dots;
     - optional compact `JoinChapter`;
     - optional DotStage `onFrame`.

     Verify with `git diff app/design-lab/r2/_chrome app/design-lab/r2/_system` and `SYSTEM.md`. If it's unfinished, spawn a fresh agent with that list.
- **Stakeholder review page: DONE (uncommitted).** It loads at http://localhost:3100/design-lab/r2/review.html (HTTP 200, 24 lab links, 0 errors, click-through verified with `design-lab/scripts/r2-review-click.mjs`).
  - **To rebuild:** edit `design-lab/round2/stakeholder/compare.src.html`, then run `HOME_STEPS=home/v3/steps HOME_PICK='<json>' node design-lab/scripts/r2-stake-build.mjs`. The picks are in the build script's header comment and the agent report. Then re-wrap it into `public/design-lab/r2/review.html` (doctype + charset + viewport + `<meta name="robots" content="noindex">`).
  - **Permission:** writing to `public/` was blocked for subagents and approved by the Head Designer for this file, so ask before writing other public files.
  - **Rebuild trigger:** if the SYS chrome batch changes visuals, re-capture the steps and rebuild the page.

## Work queue

1. **DONE:** `#0065` committed. The SYS chrome batch landed with ToneSync, Highlights `tone`, compact JoinChapter and DotStage `onFrame`/`exclusive`; see SYSTEM.md §5. Next TODO row: `lab.13 | #0066`.
2. **Follow-ups (SYS has landed):** each Apple page marks every dark chapter wrapper and clip card `data-tone="dark"` for LocalNav ToneSync, and sets `tone: 'dark'` on dark Highlights clip cards. Also:
   - Home: swap its local `.clipCard` wrap for `<Highlights tone>`.
   - SHADES: delete its page-scoped Signal JoinChapter button override.

   A small agent can do both. Then re-shoot all 8 routes.
3. **Verdict pass (impeccable finish review):** for each page, spawn a FRESH reviewer (general-purpose, opus) that reads `/home/danny/.claude/skills/impeccable/agents/impeccable_finish_reviewer.toml` as its role, plus `design-lab/round2/finish/PACKET.md`, its own earlier review `design-lab/round2/finish/<page>.md`, and the v3 captures. It scores every listed fix as resolved, partial or unresolved, writes the result to `design-lab/round2/finish/<page>-verdict.md`, and edits nothing.
   - Partial or unresolved items get one more fix batch (fresh page agent, same rules as `design-lab/round2/WAVE3B-BRIEF.md`), then one recapture and verdict.
   - Two rounds is the ceiling. After that, report what's open to the user.
4. **Documenter:** spawn an agent that reads `/home/danny/.claude/skills/impeccable/agents/impeccable_documenter.toml` and `/home/danny/.claude/skills/impeccable/reference/document.md`. It writes `design-lab/round2/DESIGN.md` (plus `.impeccable/design.json` if the reference asks) describing BOTH worlds and the shared system as built. Write boundary: `design-lab/round2/` and `.impeccable/` only. Never touch the root `DESIGN.md` (production).
5. **Report + stop:** append a "Round 2 result" section to `design-lab/round2/PLAN.md`. Give the user a ≤40-line chat report:
   - routes;
   - what each world does best and worst (no winner);
   - open `[confirm]` facts;
   - production findings (below);
   - the review-page URL.

   Commit `#0066`, then STOP.

## Gates every page must keep

- **Words per viewport** (`node design-lab/scripts/r2-words.mjs <route>` plus `--width=390 --height=844`): avg ≤30, p90 ≤70, max ≤100, quiet ≥45%.
- **Animation:** 0 rAF at rest (page scripts `design-lab/scripts/r2-<page>-raf.mjs`, or `r2-sys-raf.mjs --rest-only`).
- **Errors:** 0 console errors; `tsc` and lint clean; `impeccable detect --json` reports `[]`.
- **Parity:** reduced motion and no-JS show the full content.
- **Accessibility:** WCAG AA, 44px targets.
- **Measured state at handoff:** every page passes the words gate. BRAIN is 12.5 / 12.9 vh at 1440; SHADES Signal 1440 is borderline at 46%.

## Production findings (report only; production is read-only here)

1. **Blank routes:** `/about`, `/get-involved`, `/projects` and `/community` render blank (`<Reveal>` without `useReveal()`).
2. **Project-page fonts:** the project pages never load their fonts (`tailwind.config.ts:54-56` maps to literal names).
3. **Red contrast:** `#d8412f` fails AA as text (about 4.1:1) and under white text (4.45:1).
4. **Cursor loop:** `components/ui/CursorProvider.tsx` runs a 60 fps rAF loop at rest. The lab silences it on r2 routes.
5. **Deployment gap:** the live site https://digitalcpp.vercel.app is built from `1e1a9da` (2026-08-01). `main`/`deployment` are at `37dfd63` (2026-09-27), 26 commits ahead and not deployed. `digitalcpp.org` doesn't resolve.

## Gotchas

- **Shared dev server:** parallel agents saving files cause transient 500s on every r2 route, so re-measure after it recovers. Headless captures use SwiftShader, so long-frame numbers are pessimistic.
- **Copyright:** Apple and Google screenshots are gitignored (copyrighted); keep it that way.
- **Large evidence:** critique evidence videos and frames are gitignored (`design-lab/renders/r2/crit/**/*.webm`, `frames*/`).
- **chrome-devtools MCP:** broken all session. Use Playwright with the headless shell pattern in `shoot.mjs`.
- **Gemini motion critiques:** often wrong. Always cross-check them against extracted frames.
- **Memory:** `/home/danny/.claude/projects/-mnt-c-Users-DangT-Documents-Github-DIGITAL-WebsiteV1/memory/` holds `design-lab-exploration.md` and `questions-in-chat.md`. Update them at the end.
