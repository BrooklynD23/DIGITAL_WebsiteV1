# Handoff — SHADES Notion pass (written 2026-10-09)

**Next orchestrator: start here.** Then read `design-lab/HANDOFF-NEXT.md` §0b and §4 (hard rules, verification recipe).

## State

| Thing | Value |
|---|---|
| Work tree | `/home/danny/worktrees/digital-design-lab`, branch `design-lab/shades-revamp` (pushed, clean at `24eb765`) |
| Dev server | `http://localhost:3100` — shared, never kill. `bash design-lab/scripts/ensure-server.sh` if down |
| Draft PR | #4, `design-lab/exploration` → `main` (site without the SHADES revamp). Not merged |
| SHADES pick | `/projects/shades-reveal/` = product reveal + Hold still slider. Head Designer chose it 2026-10-09; awaiting their review, then promotion to `/projects/shades/` |
| Comparison page | `design-lab/shades-concept/round2/compare.html` (round 2, three approaches) |
| Plan + decisions | `design-lab/shades-concept/round2/PLAN-R2.md`, `design-lab/shades-concept/DECISIONS.md` (#1–#7) |
| SHADES facts | Only `app/(apple)/_content/shades.ts` + `DECISIONS.md`. Copy files: `_content/shades-reveal.ts`, `shades-research.ts`, `shades-control.ts`, `shades-concept.ts` |
| Notion | Notion MCP connected 2026-10-09 (`mcp__notion__*`, load with ToolSearch). DIGITAL workspace |

## The task (Head Designer's request)

> Delegate an Opus 5.5 subagent that can run its own Haiku 5.5 subagents to go through Notion MCP for the DIGITAL
> workspace, look at SHADES for relevant information, and update the proposed research comparison page.
> Page: https://app.notion.com/p/SHADES-45f169473d77821fb3ad81ac68585a5c

Do it as:

1. Spawn ONE agent: `subagent_type: "general-purpose"`, `model: "opus"` (it has the Agent tool, so it can spawn
   readers). Brief it with the prompt below.
2. When it reports, review its findings yourself; anything that changes printed copy goes through
   `brand-voice-strategist` (write) → `brand-guardian` (review) before it lands in `_content/`.
3. Ask the Head Designer (AskUserQuestion) before changing any `shades.ts` fact, the chosen page, or `DECISIONS.md`.

### Prompt for the Opus agent

```
Output style: follow ~/.claude/rules/common/subagent-output.md (i-have-adhd)

Goal: harvest what the DIGITAL Notion workspace says about SHADES and fold it into the SHADES research
and comparison material. Repo: /home/danny/worktrees/digital-design-lab (branch design-lab/shades-revamp).
Read first: design-lab/shades-concept/round2/HANDOFF-NOTION.md, PLAN-R2.md, ../DECISIONS.md,
app/(apple)/_content/shades.ts.

Notion (READ-ONLY: never create, update, move, comment on or delete anything in Notion):
- Load tools with ToolSearch ("select:mcp__notion__notion-fetch,mcp__notion__notion-search").
- Root: https://app.notion.com/p/SHADES-45f169473d77821fb3ad81ac68585a5c . Fetch it, list every child
  page and database, then fan out: spawn Haiku 5.5 readers (Agent tool, model "haiku", general-purpose),
  one per subtree, max 5 in parallel, each with the line
  "Output style: follow ~/.claude/rules/common/subagent-output.md (i-have-adhd)" and these rules:
  read-only Notion, quote verbatim with the Notion page URL and last-edited date, flag anything that
  looks like personal data (names, emails, phone numbers) instead of copying it, write findings to
  design-lab/shades-concept/research/notion/<nn>-<subtree>.md, return a 5-line summary.
- Then verify the readers' key quotes yourself with notion-fetch before relying on them.

Produce:
1. design-lab/shades-concept/research/notion/SUMMARY.md: facts Notion states about SHADES (goal,
   hardware, controller, display, team roles, roadmap/phases, dates, research aims, constraints),
   each with source URL + date; a table "Notion vs site" comparing each fact with shades.ts /
   DECISIONS.md: agrees / conflicts / new / site claims something Notion does not support.
2. A "Notion findings" section added to design-lab/shades-concept/round2/compare.html (keep the page's
   style; desktop + 390 readable; no new dependencies) listing: conflicts first, then new facts, then
   what each of the three approaches (reveal, Hold still, research) would gain or must change.
3. A proposed diff for app/(apple)/_content/shades.ts as a markdown block in SUMMARY.md — DO NOT edit
   shades.ts or any _content file. Personal names never go into proposals (the site prints no names
   without the Head Designer's sign-off).

Rules: print only what a source states; SHADES is a planning-stage concept, research platform, not a
medical device, no efficacy claims. Locked pages BRAIN and SIDEKICK: untouched. Never run next build /
next dev in the tree; never kill the server on 3100. Do not commit.
Return: counts (pages read, facts, conflicts, new), the top 5 conflicts/new facts, files written.
```

## After the agent

1. Read `research/notion/SUMMARY.md`; spot-check 3 quotes in Notion.
2. Open `round2/compare.html` (Windows: `cmd.exe /c start "" "$(wslpath -w <file>)"`), check desktop + phone toggle.
3. Ask the Head Designer which conflicts/new facts to adopt. Adopted facts → `shades.ts` via the brand agents →
   `npx tsc --noEmit` → re-check `/projects/shades-reveal/` renders.
4. Commit on `design-lab/shades-revamp`, add a `TODO.md` row (`#0073`), push.

## Still open from the last session

- Anatomy drawing has no on-page caption (needs a new reviewed string).
- Optional generated renders: `round2/reveal/RENDER-PROMPTS.md`.
- On Head Designer approval: promote `shades-reveal` to `/projects/shades/`, move `HoldStill`, `HoldStillStills`,
  `_shades-art/` to shared homes, archive V0.1 + shades-a/b/research/control, drop `shades-art-preview` from the
  export (it is 4.7 MB of the 12 MB `out/`).
