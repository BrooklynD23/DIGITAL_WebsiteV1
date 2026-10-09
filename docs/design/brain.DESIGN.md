# BRAIN Page — Style Reference

> A model thinks. A system acts. One black surface, one figure, six lessons.

**Status: LOCKED — approved by the Head Designer on 2026-10-07.** No adjustments are to be made to
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
gradients, glow, glass, cards, hairlines or section rules. The join shares the black surface (its
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

## 7. Controls and accessibility

- Stage tracker: real `<button>`s, `aria-current="step"`, 44px targets, focus ring `--r2-focus`.
  At ≤ 734px it shows dots only; the names stay for screen readers.
- The canvas is decorative; every lesson carries a text alternative (`alt` in `story.lessons`).
- Inactive captions are `aria-hidden`.
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
- `story` in `app/(apple)/_content/brain.ts`

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
