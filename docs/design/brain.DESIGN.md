# BRAIN Page — Style Reference

> A model thinks. A system acts. One black surface, one figure, six lessons, one job in three views.

> **Unlocked by the Head Designer 2026-11-14 for the three-views section (§1, §2, §3, §5, §6, §7, §8, §10); re-locked after merge.**

**Status: LOCKED — approved by the Head Designer on 2026-10-07; re-locked 2026-11-14 with the three-views section.** No adjustments are to be made to
this page. Any change to the files listed under [Locked files](#locked-files), or any shared change
that alters how this page renders, needs explicit Head Designer sign-off first. This document is
extracted as-implemented from the component source.

**Route:** `/projects/brain/` (promoted from the design lab `/design-lab/r2/apple/brain/` on 2026-10-07; files moved, nothing else changed).
**Theme:** dark, one continuous `#000` surface from the hero to the end of the join.

---

## 1. Concept

BRAIN is the studio's agentic-AI team. The page does not describe a curriculum; it makes one
argument, in order, and each line picks up from the last:

model alone → loop → tools → protocol → context → harness → proof → come build one.

One pinned section carries the hero and six lessons as seven stages of a single dot figure. The
same 72 dots (the model orb) survive every stage; the rest of each figure flies into the next one
dot for dot. Nothing wipes to blank and no rule, card or divider separates lessons.

After the pin, one normal-flow section, **"One job, three views"**, is the recap: one example job plays in three dot
spheres at once, on one clock (`ThreeViews.tsx`). It adds no new concept; it shows the loop, the context window and the
tools during the same moment. When a result lands, the loop moves on, the window grows and the tool goes quiet.

## 2. Copy (verbatim — source: `story` in `app/(apple)/_content/brain.ts`)

| Stage | Heading | Tracker | Line |
|---|---|---|---|
| Hero | A model thinks. / A system acts. | — | BRAIN builds the systems around agents. |
| 1 | The agent loop | Loop | A model alone answers once, so we put it in a loop: think, act, check, repeat. |
| 2 | Tool calling | Tools | To act, the model writes a structured call and the program around it runs the tool. |
| 3 | Model Context Protocol | MCP | MCP is the open protocol that lets one client reach many tool and data servers. |
| 4 | Context engineering | Context | Every call and result lands in one finite window, so you budget what stays. |
| 5 | Harness engineering | Harness | The program around the model is the harness: its loop, tools, permissions and checks. |
| 6 | Evals | Evals | Evals are repeatable tests of behaviour, the proof it works more than once. |

**One job, three views** (`story.layers` and `figureExamples.job` in `_content/brain.ts`; brand-reviewed 2026-11-14):

| Slot | Text |
|---|---|
| Heading | One job, three views |
| Line | One example job plays in all three at once: the loop, the window, the tools. |
| The loop | Think, act, check, repeat. It lets one job take many steps. |
| The context window | Everything the model can see. Each result takes up room in it. |
| The tools | Everything the model can reach. It writes the call; the program runs it. |
| Compare | When a result lands, the loop moves on, the window grows, the tool goes quiet. |
| Clock words | think · act · check. Switch group "View": Loop · Context · Tools. Pause / Play (names "Pause the three spheres" / "Play the three spheres"). |
| Example job | "A test is failing. Run it, read the code, check the open issues, then post in #general." Calls: `run_tests auth.spec.ts → 1 failed`; `read_file src/demo.ts → 212 lines`; `GitHub issues.list → 3 open`; `send_message #general → needs approval` (held). |

Tool and server names in the Tools sphere are the page's own (`figureExamples.calls` / `.servers`, unchanged).

**Ending:** "Come build one with us." · "Idea first, tool second." · **Fridays, 12:00 – 1:00 PM** ·
"No project experience required." · filled pill "Join the BRAIN Discord" →
`https://discord.gg/Smfv4weJMz` (new tab, `rel="noopener noreferrer"`).

**Local nav:** title `BRAIN`, one link "Lessons" → `#lessons`, CTA pill "Join BRAIN" → `#join`.

Copy rules that produced this: topic name is the heading (no eyebrow, no 01/02 numerals), one
sentence per lesson (≤ 16 words), no `[confirm]` tags, no hype adjectives, no exclamation marks.
In-figure labels are single lowercase words (`think`, `act`, `check`, `repeat`, `call`, `result`,
`client`, `one interface`, `servers`, `context window`, `harness`, `tools`, `24 runs of one test`).

## 3. Layout

| Property | Value |
|---|---|
| Pin height | `calc(100svh + 7 * 50svh)` — half a viewport of scroll per stage (7 stages; must match `STAGE_COUNT`) |
| Sticky box | `calc(100svh - var(--r2-nav-h) - 44px)`, `overflow: hidden` (52px local nav + 44px global bar at scroll 0) |
| Grid rows | `auto minmax(0, 1fr) auto` — caption band · figure · tracker bar |
| Caption band | All captions share one grid cell, so the band is as tall as the tallest and the figure never moves |
| Figure | `min(100cqw, 100cqh, 640px)` square inside a `container-type: size` box; takes whatever height is left |
| Nothing | is placed by a pixel offset; nothing can pass the nav or the fold |

**Three views** sit between the pin and the join, same black surface, no rule. Padding `--r2-space-9` top,
`--r2-space-7` bottom. Heading, line, then the clock line (one row, 44px, fixed height) with its Pause/Play button, then the
spheres, then the compare line. From 735px: three equal columns (max 1120px, 340px spheres, name and line under each). Below
735px: one sphere (up to 460px) with a 3-way switch (Loop / Context / Tools, 44px, `aria-pressed`); the names are
visually hidden but stay in the DOM.

Verified with no clipped heading or figure and no horizontal overflow at 1600×790, 1440×900,
1280×720, 1024×768, 768×1024, 390×844 and 375×667 (hero and stage 1 at all seven; all stages at
1600×790 and 390×844).

## 4. Type

| Role | Size | Notes |
|---|---|---|
| Hero h1 | `clamp(34px, min(10vw, 11svh), 80px)` / 1.05 | `--font-display`, `--r2-fw-display`, `--r2-ls-hero`, two `display: block` beats, balanced |
| Lesson h2 | `clamp(28px, min(8vw, 8svh), 56px)` / 1.08 | same face, `--r2-ls-h1` |
| Line | `clamp(17px, min(4.6vw, 3.2svh), 21px)` / 1.4, weight 600 | `--r2-ink-2`, max 32rem, balanced |
| Figure tag | 12px / 16px (11px ≤ 734px) | `--r2-ink-2` |
| Tracker | 12px / 16px | `--r2-ink-2`; active and hover `--r2-ink` |

Type clamps on viewport **height** as well as width. That is what keeps the headline on screen.

## 5. Colour

`#000` ground, `--r2-ink` (warm white) figure and headings, `--r2-ink-2` supporting text. No
gradients, glow, glass, cards, hairlines or section rules. In the three views the one red (`--r2-trigger`) is the held call in the Loop sphere only; in the Tools sphere the held call stops at its gate in ink, and the Context sphere is ink (a percentage and a hairline ring, no coloured meter). The join shares the black surface (its
default top rule is removed in `brain.module.css`); the light footer is where the surface ends.

## 6. Motion

| Behaviour | Implementation |
|---|---|
| Stage pick | `useScrollSteps` over 7 stages (`lead: 0`, `playShare: 0.72`). Native scroll, no wheel hijack. |
| Transition | `useStagePlayback` (from `app/(apple)/projects/_hero`) tweens a playhead to the target stage in **900 ms**, cubic in-out, interruptible and reversible. `lessonFrame(pos, time)` lerps the two neighbouring scenes dot for dot; lines crossfade. |
| Loop | Each scene is periodic (4.2–7.8 s, seamless). One shared-ticker subscription advances the clock and paints, only while the figure is on screen, the tab is visible and pause is off. 0 subscribers at the join. |
| Caption swap | Out-then-in: outgoing 160 ms, incoming 240 ms after a 160 ms delay, opacity + 12px y. Never two at once. |
| Figure tags | Fade out 160 ms; fade in 320 ms after a 620 ms delay (after the morph lands). |
| Pause | 44px button beside the tracker freezes the loop; stage transitions still paint. |
| Three views loop | A second loop, independent of the pin and `_system` ticker: one rAF clock (`makeTimeline`, one ~11s job: think, four calls, hold, rest) paints the three canvases. It runs only while a canvas is on screen, the tab is visible and Pause is off. Its own Pause/Play button (44px, visible "Pause" / "Play"). dpr capped at 2; measured ≤ 2 ms per frame for three canvases at 1440. |

## 7. Controls and accessibility

- Stage tracker: real `<button>`s, `aria-current="step"`, 44px targets, focus ring `--r2-focus`.
  At ≤ 734px it shows dots only; the names stay for screen readers.
- The canvas is decorative; every lesson carries a text alternative (`alt` in `story.lessons`).
- Inactive captions are `aria-hidden`.
- Three views: each canvas is `role="img"` with its own text alternative (`story.layers.views[].alt`). The switch is a `role="group"` named "View" of `aria-pressed` buttons. The clock line is not a live region. Reduced motion: three still poses (same moment: `read_file` at its tool, window at 56%), Pause hidden. No JS: three server-rendered SVG stills stacked, no switch.
- Reduced motion / no JS: the pin does not exist. The same caption elements stack in normal flow,
  each with a server-rendered SVG still (`lessonStill`). Full content parity. The pin switches on
  only under `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`.

## 8. Locked files

Do not edit without Head Designer sign-off:

- `app/(apple)/projects/brain/page.tsx`
- `app/(apple)/projects/brain/BrainStages.tsx`
- `app/(apple)/projects/brain/stages.module.css`
- `app/(apple)/projects/brain/brain.module.css`
- `app/(apple)/_brain/lessons.ts` (and `_brain/kit.ts`, `_brain/Bits.tsx` as it uses them)
- `story` in `app/(apple)/_content/brain.ts` (including `story.layers`) and `figureExamples.job`
- `app/(apple)/projects/brain/ThreeViews.tsx` and `three.module.css`
- `app/(apple)/_home/sphere/draw.ts` and `timeline.ts` (shared with the home BRAIN sphere; check both after any change)

### Shared code this page depends on

A change to any of these can alter the locked page. Check BRAIN at 1600×790 and 390×844 after
touching them, and keep its rendering identical:

| Dependency | Used for |
|---|---|
| `app/(apple)/projects/_hero/useStagePlayback.ts` | The stage playhead tween |
| `app/(apple)/_system` (`useScrollSteps`, ticker, dot paint, tokens in `tokens/worlds.css`) | Stage pick, loop clock, canvas, type and colour tokens |
| `app/(apple)/_chrome` (`WorldNav`, `LocalNav`, `JoinChapter`, `WorldFooter`, `MEETINGS.brain`, `LINKS.brainDiscord`) | Chrome, the ending, the Discord button |

The sticky-box height assumes the two-bar chrome (44px global bar + 52px local nav). If the chrome
is ever consolidated to one bar, this page keeps its current chrome until the Head Designer says
otherwise.

## 9. Out of scope for the lock

The Signal-world page (archived: `archive/app/design-lab/r2/signal/brain/`) is a separate route and is not covered: it
still renders the older chapters, demos and `[confirm]` tags.

## 10. Changelog

### 2026-10-15 — Head Designer sign-off

The Head Designer approved these changes to the locked page:

1. Shared sticky nav: `WorldNav` is removed; `LocalNav` (with the project links) is the one sticky bar.
2. Short-landscape layout: at `orientation: landscape` and `max-height: 500px` the caption sits left, the figure right, the tracker across the bottom.
3. Tool calling lesson: each loop shows a different example call (`run_tests`, `read_file`, `web_search`, `send_message`) in mono: the call JSON above the call arc, `→ result` below the result arc, the tool name under the tool. Under a 400px figure the call JSON is hidden.
4. MCP lesson: the four servers are named (GitHub, Notion, Discord, Google Drive); the visited one brightens and shows its request (`issues.list`, `pages.search`, `messages.read`, `files.get`) in mono.
5. Context engineering lesson: a small pill beside the "context window" label shows `NN.N%` of a 128K window with a ring, synced to the figure's fill. Under 50% green, 50-80% amber, 80% and up red. The figure's accessible name describes the meter; the pill itself is `aria-hidden`.
6. Tokens: `--r2-meter-ok #5ad17a`, `--r2-meter-warn #ffb35c`, `--r2-meter-hot #ef6a55` in `.world-apple`. The hot value equals the Signal `--r2-trigger-ink` and is the approved context warning; it is not for any other use (it is not `--r2-trigger`).

All example calls, results, servers and requests are illustrative (`figureExamples` in `_content/brain.ts`); BRAIN is a concept story and the page never claims DIGITAL runs them. The stills (reduced motion / no JS) are unchanged. Labels are HTML driven by the same loop clock as the canvas (`projects/brain/liveLabels.ts`).

### 2026-11-12 — Head Designer sign-off (shared nav)

The shared `LocalNav` gains an Updates link (2026-10-15) and a "Coming soon" menu (TWINS, DIGITAL Business;
DESIGN.md §13.1). The bar stays 52px and sticky, so the sticky-box height is unchanged. Nothing else on this page changes.

### 2026-11-14 — Head Designer unlock: one job, three views

The Head Designer unlocked the route for one change and re-locked it after merge:

1. New section `ThreeViews` between `<BrainStages />` and `<JoinChapter />`: one example job in three spheres (Loop, Context, Tools) on one clock, with a clock line (think / act / check) and its own Pause/Play.
2. Three columns from 735px; below, one sphere with a 3-way switch.
3. Red only for the held call in the Loop sphere. Ink elsewhere.
4. Copy in `story.layers` and `figureExamples.job` (`figureExamples.calls` / `.servers` unchanged, so the Tool-calling lesson is unchanged).
5. `drawB`, `drawC`, `makeTimeline` added beside the home sphere's pure module in `_home/sphere/`. `BrainStages.tsx`, `stages.module.css`, `_brain/lessons.ts` are untouched.
