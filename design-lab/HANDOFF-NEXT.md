# Handoff — DIGITAL site, next conversation

Written 2026-10-08 by the outgoing orchestrator. **Point the next session at this file first.**
You are the orchestrator: plan, route, verify, report. Delegate the work to subagents.

## 0. Status after the second session (2026-10-08) — read this first

| Item | State |
|---|---|
| Commits | `#0066` to `#0071` are committed. Nothing is uncommitted |
| Draft PR | [#4](https://github.com/BrooklynD23/DIGITAL_WebsiteV1/pull/4): `design-lab/exploration` → `main`, at `#0070`. CI green. **Squash-merge** (branch history carries about 620 MB of lab renders). Vercel builds only the `deployment` branch, so there is no preview: stakeholders see it after merge → CI → promote |
| Working branch | `design-lab/shades-revamp` (PR branch + the two SHADES mockups) |
| §5.1 docs sweep, clean-up, small code items | Done. Left: Tailwind / `globals.css` token trim, dead `design-lab/scripts/*.mjs`, unread fields in `_content/shades.ts`, `npm ci` in this tree (node_modules still holds the 21 removed packages) |
| §5.2 SHADES mockups | Built and verified: `/projects/shades-a/` (object leads) and `/projects/shades-b/` (book leads), `noindex`, not in nav or sitemap. Screenshots and `NOTES.md` in `design-lab/shades-concept/mockups/{a,b}/`. Copy: `app/(apple)/_content/shades-concept.ts` (brand-reviewed) |
| Image prompts | `design-lab/image-prompts/PROMPTS.md`: 28 prompts (icon, share image, seat art, community art, book plate, optional SHADES pack). Nothing generated |

**Next action:** the Head Designer picks A or B (or parts of each), then answers: green or white held word; dashed or solid frame; blurred book or a new plate (`BOOK-01` prompt); concept-label wording. Then promote the pick to `/projects/shades/`, archive V0.1 and the other mockup, and move the styles mockup A borrows from `projects/shades/apple.module.css`.

## 0b. Status after the third session (2026-10-09)

**Next task: `design-lab/shades-concept/round2/HANDOFF-NOTION.md` (Notion pass on SHADES).**

SHADES round 2 is done and the Head Designer picked a direction: **`/projects/shades-reveal/`** (product reveal with the
Hold still slider as its view beat). Plan, decisions and audits: `design-lab/shades-concept/round2/PLAN-R2.md`,
`design-lab/shades-concept/DECISIONS.md` (#7 tethered controller box). Fable's last verdict: ready with small fixes, all
applied. Next: Head Designer review beside BRAIN and SIDEKICK, then promote it to `/projects/shades/` (move
`HoldStill`, `HoldStillStills` and `_shades-art/` into shared homes, archive V0.1, shades-a/b, research and control
routes, drop the art preview from the export). Open: an on-page caption for the anatomy drawing (new string, brand
review); optional generated renders (`round2/reveal/RENDER-PROMPTS.md`).

## 1. Where things are

| Thing | Value |
|---|---|
| Work tree | `/home/danny/worktrees/digital-design-lab`, branch `design-lab/exploration` |
| Main checkout | `/mnt/c/Users/DangT/Documents/GitHub/DIGITAL_WebsiteV1` (branch `feature/site-consolidation`) — untouched, still the OLD site. Do not work there. |
| Dev server | `http://localhost:3100`, started from the work tree. Shared: never kill it. `bash design-lab/scripts/ensure-server.sh` if it is down. |
| Git state | **Nothing committed.** About 870 changed paths on top of `c094e50` (#0065): the whole Apple promotion, the archive move, eight page redesigns, docs. Renames are staged by `git mv`; edits are not. |
| Backup | `~/worktrees/_backups/digital-design-lab-pre-promotion-2026-10-07.tgz` (1.4 GB, taken before the restructure) |
| Deploy | Vercel static export, no custom domain: `https://digitalcpp.vercel.app/`. Last measured build: 41 s, `out/` 6.0 MB, 128 files. |

Committed as `#0066` on 2026-10-08 (see §0). The "Git state" row above describes the state before that commit.

## 2. Read, in this order (about 10 minutes)

1. This file.
2. `DESIGN.md` (root) — the Apple system, as built. It is the global design system now.
3. `docs/design/brain.DESIGN.md` and `docs/design/sidekick.DESIGN.md` — the two LOCKED pages.
4. `design-lab/shades-concept/README.md`, then `PLAN.md` there (the SHADES concept plan; see §5).
5. `TODO.md` → "Open items from the Head Designer, 2026-10-07".
6. `archive/README.md` — what was archived and from where.

## 3. Routes (all under `app/(apple)/`)

| URL | Source | Status |
|---|---|---|
| `/` | `app/(apple)/page.tsx`, artwork `projects/_hero/` | Approved direction, not locked |
| `/projects/sidekick/` | `projects/sidekick/`, `_sidekick/` | **LOCKED** |
| `/projects/brain/` | `projects/brain/`, `_brain/` | **LOCKED** |
| `/projects/shades/` | `projects/shades/`, `_shades/` | Open — "not too good", being re-concepted (§5) |
| `/about/`, `/team/`, `/community/`, `/get-involved/`, `/contact/` | `<name>/page.tsx` on `_chrome/SitePage.tsx` | Redesigned 2026-10-07; awaiting stakeholder keep / archive |
| `/privacy/`, `/terms/`, `/cookies/` | on `_legal/LegalPage.tsx` | Restyled; legal text unchanged (one Privacy sentence, see TODO) |
| `/pillars/`, `/projects/`, `/projects/modular-smartphone/`, `/projects/smart-reading/`, `/design-lab/r2/apple/{hero,sidekick,shades,brain}/` | redirect stubs (`_redirect.tsx`) | Keep |

Shared: `app/(apple)/_system/` (tokens `tokens/worlds.css`, scroll hooks, dot engine, fonts),
`_chrome/` (LocalNav, WorldFooter, JoinChapter, SitePage, SystemScreen, `routes.ts`, `club.ts`),
`_content/` (all copy). Links live once, in `lib/data/siteConfig.ts` `social`.

## 4. Hard rules

- **Locked pages.** BRAIN and SIDEKICK: no change to markup, styles, copy or behaviour without the Head
  Designer's explicit sign-off. Their locked-file lists are in the two spec docs. After any edit to `_system/`,
  `_chrome/` or `projects/_hero/useStagePlayback.ts`, screenshot both at 1600×790 and 390×844 and confirm they
  look the same above the footer. Shared-chrome changes that reach them (footer, link targets) are allowed
  only when the Head Designer asked for that change.
- **Scroll model.** Scroll picks a stage; a timed tween plays it. No frame-by-frame scrubbing, no half-way
  resting state, no wheel hijack. One sticky nav bar.
- **Facts.** Print only what a source states. No `[confirm]` tags, no invented people, numbers, partners,
  dates, hardware or outcomes. SIDEKICK = archived prototype design; SHADES = planning-stage concept, a
  research platform, not a medical device, no efficacy claims.
- **Voice.** `docs/design/BRAND.md`. Apple product-page register: short declaratives, concrete nouns, no hype.
  Copy changes go through `brand-voice-strategist` (write) and `brand-guardian` (review) before commit.
- **Never** run `next build` or `next dev` inside the work tree (the server on 3100 owns its `.next`). Build in
  a copy: `rsync -a --exclude .next --exclude out --exclude node_modules --exclude .git --exclude archive
  --exclude 'design-lab/renders' --exclude 'design-lab/motion-reel' --exclude 'design-lab/references'
  --exclude 'design-lab/assets' <tree>/ <scratch>/build/`, symlink `node_modules`, `npx next build` there.
- **Moves, not deletes.** `git mv` into `archive/` (mirror the path, add a line to `archive/README.md`).
  Never `rm` tracked source. Ask before any deletion.
- **Subagents.** Every Agent prompt includes the line
  `Output style: follow ~/.claude/rules/common/subagent-output.md (i-have-adhd)`.
  Pass `model` explicitly. Give each agent a disjoint file-ownership list; agents that run in parallel must
  not share a file. Tell every agent the locked pages are off limits.
- **Decisions** go to the Head Designer with AskUserQuestion (the localhost decision page does not load for
  them). They read with the ADHD output rules: result first, numbered steps, short lists, one next action.

### Verification recipe (the chrome-devtools MCP is broken here)

Playwright with the installed headless Chromium, run from the work tree root, scripts kept in the session
scratchpad:

```
EXE=~/.cache/ms-playwright/chromium_headless_shell-1246/chrome-headless-shell-linux64/chrome-headless-shell \
NODE_PATH=$PWD/node_modules node <script>.cjs      # chromium.launch({ executablePath: process.env.EXE })
```

Pinned pages are stage-based: `window.scrollTo`, wait about 2 s per stage, then screenshot. Standard checks:
status 200, zero console errors, `document.documentElement.scrollWidth === innerWidth`, exactly one `<main>`
and one `h1`, no heading under the 52px sticky bar, tap targets ≥ 44px, at 1600×790, 1280×720, 768×1024 and
390×844, plus one run with `reducedMotion: 'reduce'` and one with `javaScriptEnabled: false`. This headless
build cannot decode H.264. Then `npx tsc --noEmit` and `npx next lint`. If `tsc` reports errors only under
`.next/types/`, those are stale stubs from moved routes: remove just that generated folder.

## 5. Work for this session (what the Head Designer asked for)

### 5.1 Docs sweep and clean-up — Haiku agents

Use **Haiku 5.5** (`model: "haiku"`, `claude-haiku-5-5`), as the Head Designer asked. Use it for
read-and-report exploration and mechanical doc edits; check its edits before accepting them.

Run in parallel, disjoint ownership, each reporting a list before changing anything risky:

1. **Docs audit + update.** Find every stale statement in `*.md` at the root, under `docs/` and
   `design-lab/round2/HANDOFF.md`: references to `app/(legacy)` (23 lines known across `CLAUDE.md`,
   `DESIGN.md`, `README.md`, `docs/ROUTES.md`), `digitalcpp.org` / "custom domain DNS" (`README.md:99`,
   `docs/DEPLOYMENT.md`, `docs/PRE-LAUNCH.md`), the old Discord invite, `/design-lab/r2/...` routes described
   as live, `components/layout/*`, the footer description in `DESIGN.md` §13.3 (first paragraph still lists
   Discord / GitHub / LinkedIn as text links; the paragraph after it is current), `docs/design/BRAND.md`
   (names archived routes and `lib/data/mission.ts`, `phoneV2.ts`, `homeLanding.ts`), `docs/README.md`
   ("Branch: feature/brand-story-gsap"), `docs/MAINTAINER_GUIDE.md` (never checked), `AGENT.md` / `AGENTS.md`.
   Fix paths and routes; do not rewrite brand or legal content.
2. **Redundant-file audit (report first, then archive on approval).** Candidates already identified:
   - Dead code: `app/(apple)/_home/stageScene.ts`, `_system/boards/BoardLayers.tsx` (+ `layers-manifest.json`,
     board JSON), `_sidekick/Stack.tsx`, `IsoModules.tsx`, `stackFrame.ts`, `lineForm.ts`, Signal-only parts
     of `_brain/` (ContextChapter, DemosA/B, DemoShell, SceneStage, scenes-a/b) — **check the BRAIN lock list
     before touching `_brain/`**; the LEGACY block in `_content/sidekick.ts`; `confirmTag` / `confirm:` /
     `lineConfirm` fields and `SHADES.nav`, `join.action` in `_content/`; unrendered `stats`, `sponsors` in
     `lib/data/siteConfig.ts`; `community.ts` `videos` / `linkedInPosts`; unused types in `lib/types.ts`;
     `lib/data/about.ts` phone-era exports.
   - Assets: three `DIGITAL_V1_Logo1*.png` (1.9 MB) in `public/assets/landing/` that no component reads.
   - Config: unused `theme.extend` in `tailwind.config.ts` and unused tokens / rules in `app/globals.css`
     (lists are in the link-audit findings summarised in `TODO.md`); the `./components/**` content glob.
   - Dependencies no live route imports (verify with the import graph, then propose a `package.json` change —
     this is a production-config edit, ask first): `recharts`, `cobe`, `page-mascot`, `react-is`, `motion`,
     `roughjs`, `@phosphor-icons/react`, `@dnd-kit/*`, `thinking-orbs`, `three`, `@react-three/*`,
     `framer-motion`, `lenis`, `gsap`, `lucide-react`. Keep `animejs` and `@tabler/icons-react`.
   - Scripts: `design-lab/scripts/*.mjs` with ~100 references to lab URLs that no longer exist;
     `scripts/encode-teardown-assets.mjs` (its inputs are archived); `kicad-to-svg.mjs` / `kicad-to-json.mjs`
     write to paths that no longer exist. Keep `sidekick-mainboard.mjs`, `kicad-sexpr.mjs`, `kicad-geom.mjs`,
     `ensure-server.sh`.
   - `design-lab/` itself is 1.8 GB of renders, references and motion reels: propose what moves under
     `archive/` or out of the repo; do not move it without approval.
   Method: build the import graph from `app/**` entry points (`tsc --listFilesOnly`), string-search for
   public assets, never guess.
3. **Small open code items** (S effort, from the final review; safe to batch with an Opus agent instead if
   Haiku struggles): one shared tracker / caption stylesheet instead of four copies; pin height from a
   `--steps` variable; SIDEKICK tablet `--art-h` and narrow tracker buttons are **locked — report only**;
   SHADES no-JS controls enabled before hydration; sentence-case the "Back a build" labels
   (`lib/data/involvement.ts`); the sticky bar looking lighter grey at scroll 0 on `SitePage` routes.

### 5.2 SHADES — two mockups (Opus agent)

Input folder: `design-lab/shades-concept/`

| File | What |
|---|---|
| `SOL-PLAN.md` | The GPT-6 Sol plan as received, plus the Head Designer's notes (requirements) |
| `DECISIONS.md` | **Read first.** The Head Designer's answers to the six open decisions (2026-10-08); overrides `PLAN.md` |
| `PLAN.md` | The improved plan (written by an Opus agent with Haiku web research): critique, resolved tensions, the six played stages, TWO mockup directions, the image-prompt system, guard-rails, open decisions, work breakdown |
| `research/*.md` | Haiku research notes with sources |
| `references/01…05*.png` | Sol's three directions, Sol's six-frame sequence (the one the Head Designer likes), the current SHADES light path, and the two locked pages as the bar |
| `mockups/` | Empty — put mockup screenshots and notes here |

`PLAN.md` (426 lines) and four research notes exist. Its two directions:
- **A — "Line"** (the plan's recommended default): one code-drawn SVG frame in seven poses on `#000`; the book
  is a two-page spread typeset in code whose words brighten one by one; no generated image, no design-system
  waiver, about 40 KB.
- **B — "Plate"**: four generated images (book plate, pencil idea sheet, matte design-study model, empty-lens
  macro) with every word, dot and label drawn live on top; needs a waiver of `DESIGN.md` §11 (no photographic
  renders); image budget capped at 1.05 MB; built with stand-ins until generation is approved.
Both share one pin of seven stages (hero + Idea · Form · System · Optics · View · Glasses) and the unchanged
reader demo. PLAN §8 has six open decisions; §9 the work breakdown (captions go through the brand agents into
a new `_content/shades-concept.ts` before either mockup agent starts). The research notes are Haiku output
with unchecked URLs — read PLAN §10 for which to trust.

What the Head Designer wants (their words, condensed):
- SHADES is still a prototype, so focus on the **concept**; they like the six-frame sequence (idea drawing →
  physical form → inside the system → the optics → through the wearer's eyes → the complete product).
- The hero is a **conceptual / theory visualization**.
- **Keep the book background with the motion of words going through it.**
- FAANG product aesthetic **leaning Apple**; it must fit beside SIDEKICK and BRAIN.
- Original design; do not copy the ASUS head-up-display glasses.
- "Two different mockups."

**The six open decisions are ANSWERED: read `design-lab/shades-concept/DECISIONS.md` first; it overrides
`PLAN.md`.** In short: no generated images (code-rendered like SIDEKICK); the book background is the archived
photograph; the held word is HUD green `#7FE6A3`; each mockup proposes its own "concept" labelling; the current
page is V0.1 and this is a complete revamp; the display is see-through. Direction B as written in `PLAN.md`
(generated plates) is void; `DECISIONS.md` gives the new A / B split (object leads / book leads).

How to run it:
1. Confirm the A / B split in `DECISIONS.md` with the Head Designer in one question, then send the seven
   captions through `brand-voice-strategist` and `brand-guardian`.
2. One Opus agent per mockup (or one agent, two routes), building review routes
   `app/(apple)/projects/shades-a/` and `shades-b/` with `robots: { index: false }`, on the played-stage
   pattern (`useScrollSteps` + `projects/_hero/useStagePlayback.ts`), reusing what works on the current page
   (the reader demo, the scan-path chapter). The live `/projects/shades/` stays as it is until one is chosen.
3. Verify with the recipe in §4; save stage screenshots at 1600×790 and 390×844 into
   `design-lab/shades-concept/mockups/`; post both links for the Head Designer.
4. Optional, if they ask: a Fable review at high effort (`model: "fable"`, `effort: "high"`), read-only, as was
   done for the other pages.

### 5.3 Waiting on the Head Designer / stakeholder

From `TODO.md`: public contact email (none yet — `siteConfig.contact.email` is `''`), Formspree form ID,
favicon and social-share image, the legal drafts, the SIDEKICK board file (photo board is not in the repo;
`zynq_sdr_dongle` kept "for now"), the team roster, keep-or-archive for `/team/` and `/community/`, a
brand-voice pass on the eight redesigned pages and the 404 / error copy.

## 6. What the outgoing session did (for orientation only)

Rebuilt the home hero as one SVG phone with four played poses; rebuilt SIDEKICK from the real KiCad board and
BRAIN as one pinned lesson sequence (both approved and locked); converted SHADES' light path to a played
figure; promoted the Apple pages to the default routes; moved every earlier design to `archive/`; redesigned
the eight remaining pages on a shared shell; rewrote root `DESIGN.md`; fixed all links at one source; added
Instagram and the footer icon row; cut the deploy from 118 MB to 6 MB.

Memory for this project is in
`~/.claude/projects/-mnt-c-Users-DangT-Documents-GitHub-DIGITAL-WebsiteV1/memory/` (locks, direction,
model preference: Opus at low effort for coding unless a task needs more).
