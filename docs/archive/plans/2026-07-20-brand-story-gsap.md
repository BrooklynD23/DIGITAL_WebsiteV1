# Brand Story System + GSAP Text Choreography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the site a written voice standard (`BRAND.md` + a review-only `brand-guardian` agent), then rewrite the smartphone, glasses, and landing pages as one story each — promise → proof → invitation — with disciplined typography and, on the smartphone page only, GSAP-choreographed text reveals.

**Architecture:** Docs-and-copy-first, then a small new `components/motion/` module (GSAP `SplitText` + `ScrollTrigger`, registered once) that wraps existing headline/subline JSX in place — no layout, component, or transition changes. Copy edits go through the existing `brand-voice-strategist` agent (already established in this repo for exactly this job — see `lib/data/experiments/glasses.ts:11`) and are gated by a new read-only `brand-guardian` review agent before each phase commits.

**Tech Stack:** Next.js 14 (static export) + React 18 + TypeScript strict + Tailwind CSS 3, adding `gsap` (core + `ScrollTrigger` + `SplitText`, free since GSAP 3.13) alongside the existing `animejs`, `framer-motion`, and `lenis` — each library stays scoped to the page(s) it already owns.

## Global Constraints

- No component, layout, or transition mechanics change. Existing motion stacks stay: anime.js loader/scrub on the smartphone page, Framer Motion + Lenis on glasses, CSS/`IntersectionObserver` reveals on the landing page. The only allowed markup change is wrapping existing text nodes in the new `TextReveal` component.
- No new font families. Typography work is usage discipline (sizes, weights already loaded, jumps) within each page's existing families.
- No new font weights added to Google Fonts loading — only weights already listed as "loaded" in each page's `docs/design/*.DESIGN.md` may be used.
- Copy lives in `lib/data/` (`phoneV2.ts`, `experiments/glasses.ts`, `homeLanding.ts`) — never inline in components. Where a component currently hardcodes text that has a matching data field, wire it through the data field (this is an existing CLAUDE.md rule, not new scope).
- Hard facts are preserved exactly: subsystem `id`/`accent`/`activePartIds`/`scrubberLabel` values, `specHeading`/`specLines`, `meetingInfo`/`siteConfig`-derived strings, stat numbers, links, `Dr. El Hadedy`, `Cal Poly Pomona`, RSVP mechanics (`wpm: 450`, `'9:41'`, `'86%'`).
- Static export safe: all GSAP code is client-only (`'use client'`, runs inside `useLayoutEffect`), no SSR APIs touched.
- `prefers-reduced-motion: reduce` renders plain, unsplit text — no `SplitText` spans, no animation.
- GSAP and anime.js never animate the same DOM node.
- Each page's `docs/design/*.DESIGN.md` is updated in the same phase/commit as the page it governs (existing governance rule from `DESIGN.md` §0.1).
- No test framework exists in this repo (`package.json` has no jest/vitest/playwright). Verification per task is `npx tsc --noEmit`, `npx next lint`, and a manual dev-server check — this matches the approved spec's own Testing section (`docs/superpowers/specs/2026-07-19-brand-story-gsap-design.md`).
- `./run.sh` fails in this WSL environment (`bash\r` — CRLF shebang). Use `npx tsc --noEmit` / `npx next lint` directly, not `./run.sh check`.
- Every commit that touches docs, config, or feature work must be recorded in `TODO.md`'s Dev Build / Version Control table (standing rule, `CLAUDE.md`).

---

## File Structure

**New:**
- `docs/design/BRAND.md` — voice pillars, per-page narrative spine, message hierarchy, do's/don'ts.
- `.claude/agents/brand-guardian.md` — read-only agent that reviews copy against `BRAND.md` + the route's `DESIGN.md`.
- `components/motion/gsapSetup.ts` — single `gsap.registerPlugin(ScrollTrigger, SplitText)` site; re-exports `gsap`, `ScrollTrigger`, `SplitText`.
- `components/motion/TextReveal.tsx` — client component: splits a text node into lines/words via `SplitText`, animates opacity/`yPercent` in on mount or scroll-enter, renders plain text under reduced motion.

**Modified:**
- `.claude/agents/brand-voice-strategist.md` — add a line pointing it at `docs/design/BRAND.md`.
- `CLAUDE.md`, `AGENT.md`, `AGENTS.md` — extend the existing "Design Docs" routing section with a copy/voice row.
- `package.json` / `package-lock.json` — add `gsap`.
- `lib/data/phoneV2.ts`, `lib/data/experiments/glasses.ts`, `lib/data/homeLanding.ts` — story-first copy (via `brand-voice-strategist`).
- `components/phone-v2/Hero.tsx`, `PhoneV2Experience.tsx`, `SubsystemStage.tsx`, `FinalCta.tsx` — wrap headlines in `TextReveal`, collapse mid-scale display sizes.
- `components/experiments/glasses/InfoPanels.tsx` — collapse panel-title size to match the reveal headline.
- `components/home/HomeLanding.tsx` — sharpen the serif/sans role split, wire `pathways.heading` through the data file (currently hardcoded — see Task 22).
- `docs/design/smartphone.DESIGN.md`, `glasses.DESIGN.md`, `landing.DESIGN.md` — updated Type Scale, Scale Philosophy, and (smartphone only) Motion & Interaction / Do's-Don'ts sections.
- `TODO.md` — one Dev Build row per phase commit.

---

## Typography Decisions (reference for Tasks 10–12, 17, 22)

These are the concrete, opinionated calls this plan implements — written out once here so each task can cite them instead of re-deriving them.

**Smartphone** (`docs/design/smartphone.DESIGN.md` currently documents 5 near-distinct display clamps in the 28–58px "section headline" register — this is the mid-scale clutter the spec calls out):
- Hero headline and FinalCta headline are the page's two "big promise" moments (open and close) — unify both to `clamp(44px,7vw,100px)` (was hero `44,7,100` unchanged; FinalCta was `40,7,92`, now matches hero exactly).
- Subsystem titles are the page's most-repeated story beat (7 of them) — bump to `clamp(34px,5vw,72px)` (was `32,4.8,68`), making them the largest of the "section" family.
- Toolbox headline and Build Scope headline are one-off transitional sections — collapse both to one shared size `clamp(28px,4.5vw,52px)` (was `30,5,58` and `28,4.8,56` respectively — two near-duplicates become one true duplicate).
- Mobile stage headline and mobile subsystem-card title are both "compact viewport headline" jobs — collapse both to `clamp(28px,6vw,48px)` (was `28,5,52` and `30,6,44`).
- HUD title (`clamp(28px,3vw,42px)`) is untouched — it's a widget label inside the Toolbox panel, not a competing section headline.
- Whisper-weight is **not** applied here: the page's established voice (already documented in its own DESIGN.md Do's) is bold/extrabold uppercase Archivo, and no lighter weight than 500 is loaded. Introducing 300 would require loading a new font weight, which is out of scope. Intentionality on this page comes from the scale collapse above, not a weight change. This is a deliberate deviation from the design spec's generic Part 3 guidance, made now that the as-implemented audit shows the bold register is this page's actual identity.

**Glasses** (`docs/design/glasses.DESIGN.md` currently documents 3 distinct "headline-scale" sizes: Hero 48→72px, Reveal 36→60px, Panel title 30→36px):
- Panel titles (`InfoPanels.tsx`) move from `text-3xl sm:text-4xl` (30→36px) to `text-4xl sm:text-6xl` (36→60px), exactly matching the Reveal headline. This turns three near-distinct display sizes into two: Hero (one-time opening statement, stays biggest) and Reveal+Panels (four equal-weight story beats).
- The `Next-card title` (20px, in the shared `components/ui/NextProjectCard.tsx`) is a cross-route shared component, not glasses-specific — left untouched; noted as an acknowledged exception in the updated doc rather than silently ignored.
- HUD type (`HudOverlay.tsx`, `HUD_THEME`) is untouched per spec.

**Landing** (`docs/design/landing.DESIGN.md` currently documents 5 distinct serif clamps: Hero 34–58, Join 28–46, Results 26–40, Thesis 26–38, Pathways 24–36):
- Newsreader (serif) is reserved for exactly two moments: the Hero headline (the promise, unchanged `clamp(34px,5vw,58px)`) and the Join heading (the invitation, which restates the promise at the close) — Join is resized from `clamp(28px,3.6vw,46px)` to match the hero exactly: `clamp(34px,5vw,58px)`, `leading-[1.14]`, `tracking-[-0.01em]`.
- Thesis, Pathways, and Results headings are the "proof" register — they move from Newsreader `font-medium` to IBM Plex Sans `font-semibold` (heavier weight compensates for losing serif gravitas) and collapse from three near-distinct clamps to one shared `clamp(26px,3.4vw,42px)`.
- Fixes an existing content-source bug while touching this JSX: the Pathways heading is currently hardcoded inline (`components/home/HomeLanding.tsx:279-281`) instead of reading `copy.pathways.heading`, violating CLAUDE.md's "content lives in `lib/data/`" rule. Task 22 wires it through the data field and drops the inline `<span className="font-semibold">Smartphone Project</span>` emphasis trick (fragile to do from a plain data string) in favor of plain text.

---

## Phase 1 — Brand System

### Task 1: Write `docs/design/BRAND.md`

**Files:**
- Create: `docs/design/BRAND.md`

**Interfaces:**
- Produces: a markdown doc other tasks and the `brand-guardian`/`brand-voice-strategist` agents read by path `docs/design/BRAND.md`.

- [ ] **Step 1: Write the file**

```markdown
# DIGITAL Brand Voice — Story System

> One idea per page. Say it, prove it, invite the reader in — then stop.

**Status:** authoritative for wording/voice across all routes. Visual systems remain governed
by `DESIGN.md` and the route-scoped docs in `docs/design/`. See Governance below.

## Voice Pillars

1. **Declarative, concrete, one idea per line.** Say the thing. Don't hedge it, qualify it,
   or wrap it in a dependent clause. "You own a subsystem end to end" beats "Members are
   given opportunities to take ownership of various subsystems."
2. **Verbs over adjectives.** "Build the phone" does more work than "an innovative,
   comprehensive smartphone-building experience." If a sentence needs an adjective to carry
   its weight, rewrite it around a verb instead.
3. **Second person sparingly, imperative for CTAs.** Body copy can address "you" once a
   section needs to. Buttons and CTAs are always imperative: "Join DIGITAL," not "You can
   join DIGITAL."
4. **No filler.** Banned: comprehensive, innovative, cutting-edge, seamless, robust,
   leverage (as a verb), empower, elevate, unlock, journey (as a metaphor for using a
   product), passionate, dedicated (as a stand-alone virtue with no object).
5. **Specs are furniture, not argument.** Technical detail (mono-label specs, bullet lists,
   stat grids) exists to back up a claim already made in prose — it never opens a section
   and never is the section.
6. **Accessibility framing is capability, not pity.** When copy touches a disability (Smart
   Reading's dyslexia framing), the reader isn't broken; the tool is well-designed. Confident,
   matter-of-fact, person-first.

## Narrative Spine Per Page

Each page argues exactly one idea. Everything on the page either states it, proves it, or
invites the reader to join it — nothing sits outside the spine.

| Route | Spine |
|---|---|
| `/projects/modular-smartphone` | One device, owned in parts. You don't join a club — you take a subsystem. |
| `/projects/smart-reading` | Reading without the chase. The text moves so your eyes don't have to. |
| `/` | Students become builders. The gap between coursework and real systems closes here. |

## Message Hierarchy

Every story beat — a hero, a section, a card — follows the same three-part shape:

1. **Promise** — the headline. What's true, stated plainly. ≤7 words where the layout allows it.
2. **Proof** — the subline or body. Why the promise is credible: a mechanism, a number, a
   named constraint.
3. **Invitation** — what the reader does next, or what they now understand. Not every beat
   needs a CTA, but every beat should leave the reader somewhere, not just informed.

Specs, bullet lists, and stat grids attach to the *proof* step as progressive disclosure —
present, but never load-bearing for the argument.

## Cadence Rules for Animated Text

Lines that will be revealed word-by-word or line-by-line (see `components/motion/TextReveal`
on the smartphone page) are written for that reveal:

- Front-load the subject. The first word or two should carry meaning on its own, since it's
  what the reader sees mid-animation.
- One clause per line. A reveal that splits a compound sentence mid-clause reads as broken,
  not paced.
- ≤9 words per line at display sizes (47px+ equivalents on this site). Longer lines wrap
  unpredictably across viewport widths, breaking the stagger.

## Do's and Don'ts — Worked Examples

Each pair is a real line from the current codebase and a direction to rewrite toward. These
are illustrative, not final copy — the actual rewrite happens per-phase via the
`brand-voice-strategist` agent, briefed against this file.

### Smartphone (`lib/data/phoneV2.ts`)

**Do** open with the promise, not the mechanism.
- Before: *"One interface for architecture, tooling, ownership, and the trade-offs that keep
  the project honest."* (Toolbox description — lists four abstract nouns before saying
  anything concrete.)
- Toward: *"Everything you need to build a phone from scratch, in one place."*

**Do** keep subsystem bullets as sequenced beats, not a flat checklist.
- Before: *"Map dependencies before the first board spin. / Keep module boundaries explicit
  and reviewable. / Use integration risks to drive the build order."* (three imperatives,
  identical weight, no throughline)
- Toward: *"You decide where the frame ends and the board begins. / Every boundary gets
  reviewed before it's built. / What could break first is what you build first."* (each line
  builds on the one before it)

**Don't** let the closing CTA re-list the page instead of restating the promise.
- Before: *"Join a team that values real systems thinking, repeatable testing, and
  transparent ownership."* (three abstract nouns, could describe any club)
- Toward: something that echoes the page's opening promise ("Build the phone. Build the
  team. Build the system.") rather than introducing new abstractions at the close.

### Smart Reading (`lib/data/experiments/glasses.ts`)

**Do** lead with the benefit, not the acronym.
- Before: *"RSVP, rapid serial visual presentation, shows one word at a time at a single
  fixed point. You set the speed."* (defines the acronym before saying what it does for the
  reader)
- Toward: *"Your eyes stay still. The words move instead. You set how fast."*

**Do** keep specs (`AUDIENCE`, `LOAD`, `METHOD`, `COMPUTE`...) exactly where they are — below
the headline and body, in mono key-value pairs. This page already does progressive
disclosure correctly; preserve the pattern.

### Landing (`lib/data/homeLanding.ts`)

**Don't** give three cards the same weight as a three-paragraph essay.
- Before: three "Gap" cards (Theory / Access / Ownership), each ~50 words, reading as a
  report abstract rather than a story beat.
- Toward: state the spine once, briefly ("Coursework describes systems. We build them."),
  then let the three gaps serve as short supporting evidence — not a triptych of essays.

## Governance

This doc is authoritative for **wording and voice** across every route. It does not govern
color, layout, spacing, or motion — those stay with `DESIGN.md` and the route-scoped docs in
`docs/design/`. Any copy change beyond a small, faithful wording fix requires the
`brand-guardian` agent's review before it ships, and any change to the *spine* of a page (not
just its wording) requires explicit Head Designer (user) approval before implementation.
```

- [ ] **Step 2: Verify the file was written correctly**

Run: `wc -l docs/design/BRAND.md`
Expected: a line count roughly in the 120–160 range, no shell errors.

- [ ] **Step 3: Commit**

```bash
git add docs/design/BRAND.md
git commit -m "docs: add BRAND.md voice and story-spine guideline"
```

---

### Task 2: Create the `brand-guardian` review agent

**Files:**
- Create: `.claude/agents/brand-guardian.md`

**Interfaces:**
- Consumes: `docs/design/BRAND.md` (Task 1), the route's `docs/design/*.DESIGN.md`.
- Produces: an agent invocable via the `Agent` tool with `subagent_type: "brand-guardian"`, used by Tasks 13, 18, 23 as a review gate.

- [ ] **Step 1: Write the agent file**

Follow the existing `.claude/agents/brand-voice-strategist.md` frontmatter style exactly
(same repo, same conventions), but tools are review-only (no `Write`/`Edit`):

```markdown
---
name: brand-guardian
description: Read-only reviewer of customer-facing copy against docs/design/BRAND.md and the route's DESIGN.md. Use after any copy change to lib/data/phoneV2.ts, lib/data/experiments/glasses.ts, or lib/data/homeLanding.ts, before that change is committed. Cannot edit — only reports pass/revise verdicts.
tools: Read, Grep, Glob
model: sonnet
---

You are the brand guardian for the DIGITAL @ Cal Poly Pomona website. You review copy
changes — you never write or edit them. Your job is to catch drift from the voice standard
before it ships.

## Review procedure

1. Read `docs/design/BRAND.md` in full.
2. Read the route-scoped style doc for the page under review (`docs/design/landing.DESIGN.md`,
   `docs/design/smartphone.DESIGN.md`, or `docs/design/glasses.DESIGN.md`) for that page's
   narrative spine and any page-specific constraints.
3. Read the data file under review (e.g. `lib/data/phoneV2.ts`) in full — not a diff, the
   whole file, so you can judge the page as one story, not a series of edits.
4. If a "before" version is available (via `git diff` or a prior commit), diff against it to
   confirm hard facts were preserved exactly: names, numbers, links, meeting details,
   subsystem/section identifiers, and any field that is not prose (ids, hex colors, arrays of
   part identifiers, spec key-value technical data).

## What to check

- **Spine alignment:** does every string on the page serve the one narrative spine, or has a
  section drifted into a different argument?
- **Message hierarchy:** headline = promise, subline/body = proof, is there an invitation?
  Flag any section that lists information without a throughline.
- **Info-dump regression:** flag bullet lists or spec grids that carry the argument instead of
  supporting an already-made claim.
- **Banned words / filler:** check against the Voice Pillars' banned-word list and the
  cadence rules (line length, front-loaded subject) for any text that will be animated via
  `TextReveal`.
- **Hard-fact drift:** flag ANY change to a name, number, link, meeting detail, or
  identifier field — these must be reported as CRITICAL regardless of how small.

## Output

Report a verdict per section reviewed: PASS or REVISE. For REVISE, quote the exact line,
explain which pillar/rule it violates, and suggest a direction (not final copy — that's
`brand-voice-strategist`'s job). End with one overall verdict for the file: PASS or REVISE.
Never edit the file yourself.
```

- [ ] **Step 2: Verify the frontmatter is valid**

Run: `head -6 .claude/agents/brand-guardian.md`
Expected: valid YAML frontmatter block with `name: brand-guardian`, `tools: Read, Grep, Glob`, no `Write`/`Edit` in the tools list.

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/brand-guardian.md
git commit -m "feat: add brand-guardian read-only copy review agent"
```

---

### Task 3: Point `brand-voice-strategist` at `BRAND.md`

**Files:**
- Modify: `.claude/agents/brand-voice-strategist.md`

**Interfaces:**
- Consumes: `docs/design/BRAND.md` (Task 1).

- [ ] **Step 1: Add a reference line to the operating rules**

In `.claude/agents/brand-voice-strategist.md`, after rule 6 ("Match the data shape...") and
before the `## Output` heading, add a new rule 7:

```markdown
7. **Read the brand system first.** Before writing, read `docs/design/BRAND.md` for the
   page's narrative spine (promise → proof → invitation) and voice pillars, plus the route's
   `docs/design/*.DESIGN.md` for any page-specific constraints (e.g. copy-measure caps,
   cadence rules for animated text). Write to the spine, not just the style rules below.
```

- [ ] **Step 2: Verify**

Run: `grep -n "docs/design/BRAND.md" .claude/agents/brand-voice-strategist.md`
Expected: one match, inside the new rule 7.

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/brand-voice-strategist.md
git commit -m "docs: point brand-voice-strategist at BRAND.md"
```

---

### Task 4: Wire brand routing into `CLAUDE.md` / `AGENT.md` / `AGENTS.md`

**Files:**
- Modify: `CLAUDE.md`, `AGENT.md`, `AGENTS.md`

**Interfaces:**
- Consumes: the "Design Docs — Route-Scoped Style References" section already present in all three files (added in a prior session — table of route → `docs/design/*.DESIGN.md`).

- [ ] **Step 1: Extend the routing table in each of the three files**

In `CLAUDE.md`, immediately after the existing "Design Docs — Route-Scoped Style References"
table (the 4-row table ending in "All other routes | root `DESIGN.md`..."), add:

```markdown

**Copy and wording** are governed separately, across all routes, by
[`docs/design/BRAND.md`](./docs/design/BRAND.md). Before changing any string in `lib/data/`,
read it. Copy changes go through the `brand-voice-strategist` agent to write and the
`brand-guardian` agent to review before committing.
```

Apply the identical addition (same markdown block) to `AGENT.md` and `AGENTS.md`, in each
case immediately after their own existing routing table.

- [ ] **Step 2: Verify all three files were updated**

Run: `grep -l "docs/design/BRAND.md" CLAUDE.md AGENT.md AGENTS.md`
Expected: all three filenames printed.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md AGENT.md AGENTS.md
git commit -m "docs: route copy/wording changes through BRAND.md + brand-guardian"
```

---

### Task 5: Phase 1 verification + TODO log

**Files:**
- Modify: `TODO.md`

- [ ] **Step 1: Run static checks**

Run: `npx tsc --noEmit && npx next lint`
Expected: both exit 0 (Phase 1 touched no `.ts`/`.tsx` application code, so this should be a no-op confirmation — if it fails, something outside this phase's scope broke and must be investigated before continuing).

- [ ] **Step 2: Record the phase in `TODO.md`**

Open `TODO.md`, find the last row of the "Dev Build / Version Control" table under the
current sprint, and add one row summarizing Task 1–4's commits (use the actual commit SHAs
from `git log --oneline -4`):

```markdown
| v0.9.0  | #00XX    | `<sha>` | docs: add BRAND.md + brand-guardian review agent (#00XX) | Phase 1 of brand-story-gsap plan — voice pillars, per-page spine, brand-voice-strategist/brand-guardian routing |
```

(Replace `#00XX` with the next sequential commit number and `<sha>` with the actual squashed
or final commit SHA per this repo's existing numbering convention — check the last row
already in the table for the next number.)

- [ ] **Step 3: Commit the TODO update**

```bash
git add TODO.md
git commit -m "docs: record Phase 1 brand-system build in TODO"
```

---

## Phase 2 — Smartphone (`/projects/modular-smartphone`)

### Task 6: Add GSAP dependency + registration module

**Files:**
- Modify: `package.json`, `package-lock.json`
- Create: `components/motion/gsapSetup.ts`

**Interfaces:**
- Produces: `gsap`, `ScrollTrigger`, `SplitText` re-exported from `components/motion/gsapSetup.ts` — this is the only place plugins are registered; Task 7's `TextReveal.tsx` imports from here, never from `gsap` directly.

- [ ] **Step 1: Install gsap**

Run: `npm install gsap@^3.13.0`
Expected: `package.json` gains a `"gsap": "^3.13.0"` line under `dependencies`; `package-lock.json` updates; exit 0.

- [ ] **Step 2: Verify SplitText ships in this version (free since 3.13, no separate paid plugin needed)**

Run: `test -f node_modules/gsap/SplitText.js && test -f node_modules/gsap/ScrollTrigger.js && echo OK`
Expected: `OK` printed. If either file is missing, the installed version predates 3.13 — check `npm ls gsap` and re-run `npm install gsap@latest`.

- [ ] **Step 3: Create the registration module**

```typescript
// components/motion/gsapSetup.ts
'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export { gsap, ScrollTrigger, SplitText };
```

- [ ] **Step 4: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: exit 0, no errors referencing `gsapSetup.ts`.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json components/motion/gsapSetup.ts
git commit -m "feat: add gsap dependency + single plugin-registration module"
```

---

### Task 7: Create the `TextReveal` component

**Files:**
- Create: `components/motion/TextReveal.tsx`

**Interfaces:**
- Consumes: `gsap`, `SplitText` from `components/motion/gsapSetup.ts` (Task 6).
- Produces: `TextReveal` React component — `<TextReveal as="h1"|"h2"|"h3"|"p"|"span" split="lines"|"words" trigger="mount"|"scroll" stagger?={number} delay?={number} className?={string}>{text: string}</TextReveal>`. Consumed by Tasks 9, 10, 11, 12.

- [ ] **Step 1: Write the component**

```typescript
// components/motion/TextReveal.tsx
'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap, SplitText } from './gsapSetup';

type TextRevealTag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

export interface TextRevealProps {
  readonly as: TextRevealTag;
  readonly split?: 'lines' | 'words';
  readonly trigger?: 'mount' | 'scroll';
  readonly stagger?: number;
  readonly delay?: number;
  readonly className?: string;
  readonly children: string;
}

/**
 * Wraps a text node and reveals it via GSAP SplitText, once, on mount or on
 * scroll-enter. Renders plain unsplit text under prefers-reduced-motion.
 * Scoped to the smartphone page — never mixed with anime.js on the same node.
 */
export function TextReveal({
  as: Component,
  split = 'lines',
  trigger = 'scroll',
  stagger = 0.06,
  delay = 0,
  className,
  children,
}: TextRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const splitInstance = new SplitText(el, {
      type: split,
      mask: split,
      linesClass: 'text-reveal-line',
      wordsClass: 'text-reveal-word',
    });
    const targets = split === 'lines' ? splitInstance.lines : splitInstance.words;

    const tween = gsap.fromTo(
      targets,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger,
        delay,
        scrollTrigger:
          trigger === 'scroll'
            ? { trigger: el, start: 'top 85%', once: true }
            : undefined,
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      splitInstance.revert();
    };
  }, [split, trigger, stagger, delay]);

  return (
    <Component ref={ref as React.Ref<HTMLElement>} className={className}>
      {children}
    </Component>
  );
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: exit 0. (The `ref={ref as React.Ref<HTMLElement>}` cast on the dynamic `Component`
is the one intentional, localized cast — matches the existing `as CSSProperties` pattern
already used in `components/phone-v2/PhoneV2Experience.tsx:69-77`.)

- [ ] **Step 3: Verify it lints**

Run: `npx next lint`
Expected: exit 0, no new warnings from `components/motion/TextReveal.tsx`.

- [ ] **Step 4: Commit**

```bash
git add components/motion/TextReveal.tsx
git commit -m "feat: add TextReveal GSAP SplitText component"
```

---

### Task 8: Rewrite smartphone copy (`lib/data/phoneV2.ts`)

**Files:**
- Modify: `lib/data/phoneV2.ts`

**Interfaces:**
- Consumes: `docs/design/BRAND.md` (Task 1), the smartphone narrative spine ("One device, owned in parts").
- Produces: rewritten string values on the existing `phoneV2Copy` object — field names, types, and array lengths for non-prose fields are unchanged, so Tasks 9–12's component code (which reads `phoneV2Copy.hero.headline`, `.subline`, etc.) keeps working without modification.

- [ ] **Step 1: Dispatch `brand-voice-strategist` to rewrite the file**

Use the `Agent` tool with `subagent_type: "brand-voice-strategist"`, run in the foreground
(its edit must land before the next step), with this prompt:

```
Rewrite the prose copy in lib/data/phoneV2.ts for the DIGITAL @ Cal Poly Pomona modular
smartphone page. Read docs/design/BRAND.md first — this page's narrative spine is "One
device, owned in parts. You don't join a club — you take a subsystem." Also read
docs/design/smartphone.DESIGN.md for the copy-measure caps (34-46ch body, headlines under
~12ch) and the cadence rules in BRAND.md for any line that reads as a headline (front-loaded
subject, one clause per line, <=9 words at display sizes).

ONLY rewrite these string fields (promise -> proof -> invitation shape, cut info-dump
lists into sequenced beats per BRAND.md's worked example for this page):
- hero.headline (3-string tuple; may tighten wording but keep exactly 3 short lines)
- hero.subline
- toolbox.headline, toolbox.description
- each subsystemSections[].description and .bullets (bullets stay an array; each item
  should read as a sequenced beat, not a flat checklist -- see BRAND.md's before/after
  example for "Map dependencies before the first board spin...")
- buildScope.headline, buildScope.description
- finalCta.headline, finalCta.description
- mobileStage.headline, mobileStage.description

DO NOT touch, for any reason: subsystemSections[].id, .accent, .activePartIds,
.scrubberLabel, .specHeading, .specLines; buildScope.scopeItems; toolbox.specLines;
routeFacts; finalCta.supportLine; loaderWordmark ('DIGITAL' is the brand name); any line
that references the meetingInfo or siteConfig imports. These are either technical/factual
data or computed from source-of-truth imports, not voice.

Preserve every TypeScript interface and field name exactly -- change only string values.
Keep the file readonly/const-asserted exactly as it is now. Report which lines you changed
and the single strongest line you wrote.
```

- [ ] **Step 2: Verify hard facts are unchanged**

Run:
```bash
git diff lib/data/phoneV2.ts | grep '^[+-]' | grep -v '^[+-][+-]' > /tmp/phonev2-diff.txt
grep -E "id: '|accent: '|activePartIds|scrubberLabel|specHeading|specLines|routeFacts|meetingInfo|siteConfig" /tmp/phonev2-diff.txt
```
Expected: no output (empty) — if any line prints, a field that should have been untouched
changed; revert and re-dispatch with a more explicit constraint before continuing.

- [ ] **Step 3: Verify the file still type-checks**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Do not commit yet** — Task 13 runs the `brand-guardian` review gate before this phase's copy is committed alongside the type/GSAP work.

---

### Task 9: Wrap the Hero headline + subline in `TextReveal`

**Files:**
- Modify: `components/phone-v2/Hero.tsx`

**Interfaces:**
- Consumes: `TextReveal` (Task 7), `phoneV2Copy.hero` (Task 8).

- [ ] **Step 1: Import `TextReveal`**

In `components/phone-v2/Hero.tsx`, add to the imports:

```typescript
import { TextReveal } from '@/components/motion/TextReveal';
```

- [ ] **Step 2: Wrap the headline lines**

Replace:

```tsx
          <h1 className="mt-6 font-display text-[clamp(44px,7vw,100px)] font-extrabold uppercase leading-[0.88] tracking-[-0.05em] text-[#F1F5F9]">
            {phoneV2Copy.hero.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
```

with:

```tsx
          <h1 className="mt-6 font-display text-[clamp(44px,7vw,100px)] font-extrabold uppercase leading-[0.88] tracking-[-0.05em] text-[#F1F5F9]">
            {phoneV2Copy.hero.headline.map((line, index) => (
              <TextReveal
                key={line}
                as="span"
                split="words"
                trigger="mount"
                delay={index * 0.12}
                className="block"
              >
                {line}
              </TextReveal>
            ))}
          </h1>
```

- [ ] **Step 3: Wrap the subline**

Replace:

```tsx
          <p className="mt-6 max-w-[34ch] text-[16px] leading-[1.6] text-[#CBD5E1] md:text-[17px]">
            {phoneV2Copy.hero.subline}
          </p>
```

with:

```tsx
          <TextReveal
            as="p"
            split="lines"
            trigger="mount"
            delay={0.4}
            className="mt-6 max-w-[34ch] text-[16px] leading-[1.6] text-[#CBD5E1] md:text-[17px]"
          >
            {phoneV2Copy.hero.subline}
          </TextReveal>
```

- [ ] **Step 4: Verify it type-checks and lints**

Run: `npx tsc --noEmit && npx next lint`
Expected: both exit 0.

- [ ] **Step 5: Do not commit yet** — verified together with Tasks 10–12 in Task 15.

---

### Task 10: Wrap Toolbox + Build Scope headlines, collapse to section-scale

**Files:**
- Modify: `components/phone-v2/PhoneV2Experience.tsx`

**Interfaces:**
- Consumes: `TextReveal` (Task 7), `phoneV2Copy.toolbox` / `.buildScope` (Task 8).

- [ ] **Step 1: Import `TextReveal`**

Add to the imports in `components/phone-v2/PhoneV2Experience.tsx`:

```typescript
import { TextReveal } from '@/components/motion/TextReveal';
```

- [ ] **Step 2: Wrap and resize the Toolbox headline**

Replace:

```tsx
            <h2 className="mt-4 font-display text-[clamp(30px,5vw,58px)] font-bold uppercase leading-[0.9] tracking-[-0.04em]">
              {phoneV2Copy.toolbox.headline}
            </h2>
```

with:

```tsx
            <TextReveal
              as="h2"
              split="lines"
              trigger="scroll"
              className="mt-4 font-display text-[clamp(28px,4.5vw,52px)] font-bold uppercase leading-[0.9] tracking-[-0.04em]"
            >
              {phoneV2Copy.toolbox.headline}
            </TextReveal>
```

- [ ] **Step 3: Wrap and resize the Build Scope headline**

Replace:

```tsx
            <h2 className="mt-4 font-display text-[clamp(28px,4.8vw,56px)] font-bold uppercase leading-[0.92] tracking-[-0.04em]">
              {phoneV2Copy.buildScope.headline}
            </h2>
```

with:

```tsx
            <TextReveal
              as="h2"
              split="lines"
              trigger="scroll"
              className="mt-4 font-display text-[clamp(28px,4.5vw,52px)] font-bold uppercase leading-[0.92] tracking-[-0.04em]"
            >
              {phoneV2Copy.buildScope.headline}
            </TextReveal>
```

- [ ] **Step 4: Verify it type-checks and lints**

Run: `npx tsc --noEmit && npx next lint`
Expected: both exit 0.

- [ ] **Step 5: Do not commit yet** — verified together in Task 15.

---

### Task 11: Wrap Subsystem titles, resize desktop + collapse mobile variants

**Files:**
- Modify: `components/phone-v2/SubsystemStage.tsx`

**Interfaces:**
- Consumes: `TextReveal` (Task 7), `phoneV2Copy.subsystemSections[].title` (Task 8).

- [ ] **Step 1: Import `TextReveal`**

Add to the imports in `components/phone-v2/SubsystemStage.tsx`:

```typescript
import { TextReveal } from '@/components/motion/TextReveal';
```

- [ ] **Step 2: Wrap and resize the desktop subsystem title**

Replace (inside the `md:grid` desktop branch, around line 167):

```tsx
                    <h3 className="mt-4 max-w-[12ch] font-display text-[clamp(32px,4.8vw,68px)] font-extrabold uppercase leading-[0.9] tracking-[-0.05em] text-[#F1F5F9]">
                      {section.title}
                    </h3>
```

with:

```tsx
                    <TextReveal
                      as="h3"
                      split="words"
                      trigger="scroll"
                      className="mt-4 max-w-[12ch] font-display text-[clamp(34px,5vw,72px)] font-extrabold uppercase leading-[0.9] tracking-[-0.05em] text-[#F1F5F9]"
                    >
                      {section.title}
                    </TextReveal>
```

This is safe alongside the existing anime.js-driven SVG part animation in this file: anime.js
targets `phoneRef.current` (the schematic SVG, a sibling DOM subtree in the sticky right
column) and the parent `<article>`'s inline `opacity` style (set from React state); `TextReveal`
targets only the `SplitText`-generated spans inside this `h3`. No shared node, no double
animation.

- [ ] **Step 3: Resize the mobile stage headline (no `TextReveal` — mobile variants stay outside GSAP scope per plan)**

Replace:

```tsx
          <h2 className="mt-3 font-display text-[clamp(28px,5vw,52px)] font-bold uppercase leading-[0.92] tracking-[-0.04em]">
            {phoneV2Copy.mobileStage.headline}
          </h2>
```

with:

```tsx
          <h2 className="mt-3 font-display text-[clamp(28px,6vw,48px)] font-bold uppercase leading-[0.92] tracking-[-0.04em]">
            {phoneV2Copy.mobileStage.headline}
          </h2>
```

- [ ] **Step 4: Resize the mobile subsystem card title**

Replace:

```tsx
                <h3 className="mt-3 font-display text-[clamp(30px,6vw,44px)] font-extrabold uppercase leading-[0.92] tracking-[-0.04em]">
                  {section.title}
                </h3>
```

with:

```tsx
                <h3 className="mt-3 font-display text-[clamp(28px,6vw,48px)] font-extrabold uppercase leading-[0.92] tracking-[-0.04em]">
                  {section.title}
                </h3>
```

- [ ] **Step 5: Verify it type-checks and lints**

Run: `npx tsc --noEmit && npx next lint`
Expected: both exit 0.

- [ ] **Step 6: Do not commit yet** — verified together in Task 15.

---

### Task 12: Wrap FinalCta headline, unify to hero scale

**Files:**
- Modify: `components/phone-v2/FinalCta.tsx`

**Interfaces:**
- Consumes: `TextReveal` (Task 7), `phoneV2Copy.finalCta.headline` (Task 8).

- [ ] **Step 1: Import `TextReveal`**

Add to the imports in `components/phone-v2/FinalCta.tsx`:

```typescript
import { TextReveal } from '@/components/motion/TextReveal';
```

- [ ] **Step 2: Wrap and resize the headline**

Replace:

```tsx
            <h2 className="mt-4 max-w-[12ch] font-display text-[clamp(40px,7vw,92px)] font-extrabold uppercase leading-[0.88] tracking-[-0.05em]">
              {phoneV2Copy.finalCta.headline}
            </h2>
```

with:

```tsx
            <TextReveal
              as="h2"
              split="words"
              trigger="scroll"
              className="mt-4 max-w-[12ch] font-display text-[clamp(44px,7vw,100px)] font-extrabold uppercase leading-[0.88] tracking-[-0.05em]"
            >
              {phoneV2Copy.finalCta.headline}
            </TextReveal>
```

This section already runs its own `IntersectionObserver`-gated anime.js reassembly timeline
targeting `phone.querySelectorAll('[data-phone-part="true"]')` (the SVG). `TextReveal`'s
`ScrollTrigger` targets the `h2` text only — no shared node.

- [ ] **Step 3: Verify it type-checks and lints**

Run: `npx tsc --noEmit && npx next lint`
Expected: both exit 0.

- [ ] **Step 4: Do not commit yet** — verified together in Task 15.

---

### Task 13: `brand-guardian` review pass on smartphone copy

**Files:**
- None modified (review-only task; may loop back into Task 8 if REVISE).

- [ ] **Step 1: Dispatch `brand-guardian`**

Use the `Agent` tool with `subagent_type: "brand-guardian"`, foreground, prompt:

```
Review the copy changes in lib/data/phoneV2.ts against docs/design/BRAND.md and
docs/design/smartphone.DESIGN.md. Use `git diff lib/data/phoneV2.ts` against the last commit
to see exactly what changed. Report PASS or REVISE per section, and one overall verdict.
```

- [ ] **Step 2: Act on the verdict**

If REVISE: re-dispatch `brand-voice-strategist` (Task 8's prompt, plus the specific lines
`brand-guardian` flagged) and re-run this task. If PASS: continue to Task 14.

---

### Task 14: Update `docs/design/smartphone.DESIGN.md`

**Files:**
- Modify: `docs/design/smartphone.DESIGN.md`

**Interfaces:**
- Consumes: the Typography Decisions section above and the final GSAP integration from Tasks 6–12.

- [ ] **Step 1: Update the Type Scale table**

In the `### Type Scale` table (around line 81), update these rows to match the new values
from Tasks 10–11, and add a `Trigger` note where GSAP now drives the reveal:

```markdown
| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| Loader wordmark | `clamp(48px,10vw,150px)` | 0.85 | -0.04em | `--phone-type-wordmark` |
| Hero headline (GSAP word-reveal, mount) | `clamp(44px,7vw,100px)` | 0.88 | -0.05em | `--phone-type-hero` |
| Final CTA headline (GSAP word-reveal, scroll) | `clamp(44px,7vw,100px)` | 0.88 | -0.05em | `--phone-type-final` |
| Subsystem title (GSAP word-reveal, scroll) | `clamp(34px,5vw,72px)` | 0.9 | -0.05em | `--phone-type-subsystem` |
| Toolbox headline (GSAP line-reveal, scroll) | `clamp(28px,4.5vw,52px)` | 0.9 | -0.04em | `--phone-type-section` |
| Build-scope headline (GSAP line-reveal, scroll) | `clamp(28px,4.5vw,52px)` | 0.92 | -0.04em | `--phone-type-section-alt` |
| Mobile stage headline | `clamp(28px,6vw,48px)` | 0.92 | -0.04em | `--phone-type-mobile-stage` |
| Mobile card title | `clamp(28px,6vw,48px)` | 0.92 | -0.04em | `--phone-type-mobile-card` |
| HUD title | `clamp(28px,3vw,42px)` | 0.95 | -0.02em | `--phone-type-hud` |
| Body large | 17px (md), 16px base | 1.6 | normal | `--phone-type-body-lg` |
| Body | 15px | 1.55 | normal | `--phone-type-body` |
| SpecCard lead | 14px | 1.55 | normal | `--phone-type-lead` |
| Button label | 13px | (flex-centered) | 0.04em | `--phone-type-button` |
| Spec line / tagline | 11px | (default) | 0.18em (0.16em mobile bullets; 0.24em loader tagline; 0.2em escape hatch) | `--phone-type-specline` |
| Eyebrow / scrubber | 10px | (default) | 0.24em (0.28em hero eyebrow) | `--phone-type-eyebrow` |
```

Note that hero and final-CTA headlines, toolbox and build-scope headlines are now
deliberately identical pairs (bookend/section-scale unification) — this is intentional, not
drift; see the Scale Philosophy update below.

- [ ] **Step 2: Update the Scale Philosophy section**

Find the `## Scale Philosophy` section and append:

```markdown

**2026-07 revision:** the section-headline register (formerly five near-distinct clamps
between 28–58px: HUD title, mobile stage, mobile card, toolbox, build-scope) is deliberately
collapsed to three exact values: subsystem titles (largest, `clamp(34px,5vw,72px)`, the
page's most-repeated story beat), one shared section size for Toolbox/Build-Scope
(`clamp(28px,4.5vw,52px)`), and one shared mobile-headline size
(`clamp(28px,6vw,48px)`). Hero and Final-CTA headlines are unified to the same
`clamp(44px,7vw,100px)` as an intentional bookend — the page's opening promise and closing
invitation now read at the same scale. Do not reintroduce a distinct clamp for a new section
headline without first checking whether it belongs to one of these three registers.
Whisper-weight (300) was considered per the general brand direction but rejected for this
page: no weight lighter than 500 is loaded, and the bold/extrabold uppercase register is this
page's established identity (see Do's below), not an oversight to fix.
```

- [ ] **Step 3: Update the Motion & Interaction section**

In `## Motion & Interaction` (around line 188), add a new bullet after the existing
"**Library:**" line:

```markdown
- **Text reveals (GSAP, added 2026-07):** hero headline/subline, toolbox headline, build-scope
  headline, subsystem titles, and the final-CTA headline animate via `components/motion/TextReveal`
  (GSAP `SplitText` + `ScrollTrigger`, registered once in `components/motion/gsapSetup.ts`).
  Word/line targets animate `yPercent: 110 → 0`, `opacity: 0 → 1`, 900ms `power3.out` — chosen
  as GSAP's named equivalent to anime.js's `out(3)` curve, keeping this addition inside the
  page's existing easing family per the Don't rule below. Hero elements trigger on mount
  (`trigger="mount"`); everything below the fold triggers once on scroll-enter
  (`ScrollTrigger` `start: 'top 85%'`, `once: true`). GSAP and anime.js never target the same
  DOM node — GSAP owns text spans inside headlines; anime.js continues to own the schematic
  SVG parts, loader, and scroll-scrub timeline untouched. Under `prefers-reduced-motion`,
  `TextReveal` skips `SplitText` entirely and renders plain text.
```

- [ ] **Step 4: Update the Do's and Don'ts section**

In `### Do`, add:

```markdown
- Use `power3.out` for any new GSAP text reveal — it is this page's anime.js `out(3)` curve, ported to GSAP's naming, staying inside the documented easing family.
```

In `### Don't`, the existing line reads "Don't introduce a new easing curve, spring, or
duration regime outside the 200–1050ms `ease-out` / `out(3)` / `inOut(3)` family." — update it
to:

```markdown
- Don't introduce a new easing curve, spring, or duration regime outside the 200–1050ms `ease-out` / `out(3)` / `inOut(3)` (anime.js) / `power3.out` (GSAP text only) family.
```

- [ ] **Step 5: Verify the doc structure is intact**

Run: `grep -c "^## " docs/design/smartphone.DESIGN.md`
Expected: `15` (unchanged section count — this task edits existing sections, doesn't add or remove any).

- [ ] **Step 6: Do not commit yet** — committed together with the rest of Phase 2 in Task 15.

---

### Task 15: Phase 2 verification + commit

**Files:**
- Modify: `TODO.md`

- [ ] **Step 1: Full static verification**

Run: `npx tsc --noEmit && npx next lint`
Expected: both exit 0.

- [ ] **Step 2: Manual dev-server check**

Run: `npm run dev` (background), then in a browser visit `/projects/modular-smartphone`:
- Confirm the hero headline/subline animate in on load (word-by-word for the headline, then
  the subline).
- Scroll to Toolbox, Build Scope, each Subsystem section, and the Final CTA — confirm each
  headline reveals once as it enters view and does not re-trigger on scroll-back.
- Confirm the schematic SVG highlight/reassembly animations still run exactly as before (no
  visual regression from anime.js).
- In DevTools, enable "prefers-reduced-motion: reduce" (Rendering tab) and reload — confirm
  all headlines render immediately as plain text with no split spans, no animation, and the
  rest of the page's existing reduced-motion behavior (documented in `smartphone.DESIGN.md`)
  is unaffected.
- Resize below 768px — confirm the mobile subsystem cards and mobile stage headline render at
  the new collapsed size with no layout shift.

Stop the dev server when done.

- [ ] **Step 3: Record the phase in `TODO.md`**

Add a row to the Dev Build / Version Control table:

```markdown
| v0.10.0 | #00XX    | `<sha>` | feat(smartphone): GSAP text reveals + story-first copy + type collapse (#00XX) | Phase 2 of brand-story-gsap plan |
```

- [ ] **Step 4: Commit everything from Tasks 8–14 together**

```bash
git add lib/data/phoneV2.ts components/phone-v2/Hero.tsx components/phone-v2/PhoneV2Experience.tsx components/phone-v2/SubsystemStage.tsx components/phone-v2/FinalCta.tsx docs/design/smartphone.DESIGN.md TODO.md
git commit -m "feat(smartphone): GSAP text reveals + story-first copy + type collapse"
```

---

## Phase 3 — Glasses (`/projects/smart-reading`)

### Task 16: Rewrite glasses copy (`lib/data/experiments/glasses.ts`)

**Files:**
- Modify: `lib/data/experiments/glasses.ts`

**Interfaces:**
- Consumes: `docs/design/BRAND.md` (Task 1), the glasses narrative spine ("Reading without the chase").
- Produces: rewritten string values on `GLASSES_CONTENT` — interface `GlassesContent` and all field names/types unchanged, so `GlassesExperience.tsx` and `InfoPanels.tsx` keep working without modification.

- [ ] **Step 1: Dispatch `brand-voice-strategist`**

Use the `Agent` tool with `subagent_type: "brand-voice-strategist"`, foreground, prompt:

```
Rewrite the prose copy in lib/data/experiments/glasses.ts for the DIGITAL @ Cal Poly Pomona
Smart Reading page. Read docs/design/BRAND.md first -- this page's narrative spine is
"Reading without the chase. The text moves so your eyes don't have to." Also read
docs/design/glasses.DESIGN.md for this page's existing type treatment. Follow BRAND.md's
"Do lead with the benefit, not the acronym" example for this exact page.

ONLY rewrite these string fields:
- hero.lede (keep hero.headline and hero.eyebrow as-is -- they already land the promise
  cleanly: "Read without the chase.")
- reveal.sub (keep reveal.headline as-is)
- each info[].body (title may tighten slightly if it strengthens the promise-shape, but
  must stay recognizable)
- pov.paragraph (the text-wall fallback prose)

DO NOT touch, for any reason: nav[], cta, hero.eyebrow, hero.headline, hero.footnote,
reveal.headline, hud (all fields -- wpm: 450, time, battery, caption are product facts, not
voice), pov.blurry, pov.clear, pov.words (the RSVP stream is tuned to read as one sentence
word-by-word -- do not touch), every info[].specs array (k/v technical pairs), next (the
next-project handoff). Preserve "Dr. El Hadedy", "Cal Poly Pomona", "FPGA", and "RSVP" exactly
where they appear as facts, not just style.

Preserve the GlassesContent interface and every field name exactly -- change only string
values. GLASSES_PALETTE and HUD_THEME are visual config, not copy -- do not touch. Report
which lines you changed and the single strongest line you wrote.
```

- [ ] **Step 2: Verify hard facts are unchanged**

Run:
```bash
git diff lib/data/experiments/glasses.ts | grep '^[+-]' | grep -v '^[+-][+-]' > /tmp/glasses-diff.txt
grep -E "wpm:|time:|battery:|caption:|blurry:|clear:|words:|specs:|k:|v:|href:|GLASSES_PALETTE|HUD_THEME" /tmp/glasses-diff.txt
```
Expected: no output. Any match means a field that should have been untouched changed —
revert and re-dispatch with a tighter constraint.

- [ ] **Step 3: Verify the file still type-checks**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Do not commit yet** — Task 18 runs the review gate first.

---

### Task 17: Collapse Panel-title size to match the Reveal headline

**Files:**
- Modify: `components/experiments/glasses/InfoPanels.tsx`

**Interfaces:**
- No new interfaces — pure Tailwind class change, no GSAP integration on this page per plan scope.

- [ ] **Step 1: Resize the panel title**

In `components/experiments/glasses/InfoPanels.tsx`, replace:

```tsx
      <h2 className="font-display text-3xl font-extrabold uppercase leading-[1.02] tracking-tight text-white sm:text-4xl">
        {section.title}
      </h2>
```

with:

```tsx
      <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">
        {section.title}
      </h2>
```

This now exactly matches the Reveal headline's classes in `GlassesExperience.tsx:199`
(`text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl`) —
intentional: Reveal and the four Panels are now one consistent "story beat" register, distinct
only from the larger one-time Hero.

- [ ] **Step 2: Verify it type-checks and lints**

Run: `npx tsc --noEmit && npx next lint`
Expected: both exit 0.

- [ ] **Step 3: Do not commit yet** — committed together in Task 20.

---

### Task 18: `brand-guardian` review pass on glasses copy

**Files:**
- None modified (review-only task; may loop back into Task 16 if REVISE).

- [ ] **Step 1: Dispatch `brand-guardian`**

Use the `Agent` tool with `subagent_type: "brand-guardian"`, foreground, prompt:

```
Review the copy changes in lib/data/experiments/glasses.ts against docs/design/BRAND.md and
docs/design/glasses.DESIGN.md. Use `git diff lib/data/experiments/glasses.ts` against the
last commit. Pay special attention to the accessibility framing pillar (capability, not
pity) given this page's dyslexia context. Report PASS or REVISE per section, and one overall
verdict.
```

- [ ] **Step 2: Act on the verdict**

If REVISE: re-dispatch `brand-voice-strategist` with the flagged lines and re-run this task.
If PASS: continue to Task 19.

---

### Task 19: Update `docs/design/glasses.DESIGN.md`

**Files:**
- Modify: `docs/design/glasses.DESIGN.md`

- [ ] **Step 1: Update the Type Scale table**

In `### Type Scale`, update the "Panel title (H2)" row:

```markdown
| Panel title (H2) | `text-4xl` (36px) → `sm:text-6xl` (60px) | `leading-[0.95]` | `tracking-tight` | `--type-panel-title` |
```

(was `text-3xl` (30px) → `sm:text-4xl` (36px), `leading-[1.02]` — now exactly matches the
Reveal headline row above it.)

- [ ] **Step 2: Update the Scale Philosophy section**

Append to `## Scale Philosophy`:

```markdown

**2026-07 revision:** Panel titles (`InfoPanels.tsx`) now match the Reveal headline exactly
(`text-4xl sm:text-6xl`, was a distinct smaller size). The page's headline-scale register
collapses from three near-distinct sizes to two: Hero (one-time opening statement, largest)
and Reveal+Panels (four equal-weight story beats sharing one size). The shared
`components/ui/NextProjectCard.tsx` title (20px) sits outside both registers — it is a
cross-route component governed by the root `DESIGN.md`, not this page, and is left as an
acknowledged exception rather than a drift to fix here.
```

- [ ] **Step 3: Verify the doc structure is intact**

Run: `grep -c "^## " docs/design/glasses.DESIGN.md`
Expected: `14` (unchanged section count).

- [ ] **Step 4: Do not commit yet** — committed together in Task 20.

---

### Task 20: Phase 3 verification + commit

**Files:**
- Modify: `TODO.md`

- [ ] **Step 1: Full static verification**

Run: `npx tsc --noEmit && npx next lint`
Expected: both exit 0.

- [ ] **Step 2: Manual dev-server check**

Run: `npm run dev` (background), then in a browser visit `/projects/smart-reading`:
- Confirm the hero, POV/HUD beat, reveal headline, and all four info panels render and
  crossfade exactly as before (Lenis/Framer Motion untouched by this phase).
- Confirm each panel title now visually matches the Reveal headline's size.
- Confirm no layout shift or overlap from the larger panel-title size at any viewport width.
- Toggle `prefers-reduced-motion: reduce` — confirm existing reduced-motion behavior (Lenis
  smoothing disabled) is unaffected, since this phase touched no motion code.

Stop the dev server when done.

- [ ] **Step 3: Record the phase in `TODO.md`**

```markdown
| v0.11.0 | #00XX    | `<sha>` | feat(glasses): story-first copy + panel-title type collapse (#00XX) | Phase 3 of brand-story-gsap plan |
```

- [ ] **Step 4: Commit**

```bash
git add lib/data/experiments/glasses.ts components/experiments/glasses/InfoPanels.tsx docs/design/glasses.DESIGN.md TODO.md
git commit -m "feat(glasses): story-first copy + panel-title type collapse"
```

---

## Phase 4 — Landing (`/`)

### Task 21: Rewrite landing copy (`lib/data/homeLanding.ts`)

**Files:**
- Modify: `lib/data/homeLanding.ts`

**Interfaces:**
- Consumes: `docs/design/BRAND.md` (Task 1), the landing narrative spine ("Students become builders").
- Produces: rewritten string values on `homeLandingCopy` — field names/types unchanged, arrays keep their length, so `HomeLanding.tsx` (including Task 22's data-wiring fix) keeps working without further changes.

- [ ] **Step 1: Dispatch `brand-voice-strategist`**

Use the `Agent` tool with `subagent_type: "brand-voice-strategist"`, foreground, prompt:

```
Rewrite the prose copy in lib/data/homeLanding.ts for the DIGITAL @ Cal Poly Pomona homepage.
Read docs/design/BRAND.md first -- this page's narrative spine is "Students become builders.
The gap between coursework and real systems closes here." Follow BRAND.md's "Don't give
three cards the same weight as a three-paragraph essay" example: the thesis.gaps array
currently reads as three ~50-word essay paragraphs of equal weight -- state the spine once,
briefly, then let the three gaps serve as short supporting evidence, not a triptych of
independent essays. Apply the same discipline to pathways.ways and results.cases: title
stays close to current meaning, .body/.line get cut hard toward one clear sentence each.

ONLY rewrite these string fields:
- hero.lines (3-string array; keep exactly 3 short lines), hero.subline
- thesis.heading, each thesis.gaps[].body (may tighten .title to <=3 words if it stays
  recognizable: Theory Gap / Access Gap / Ownership Gap)
- pathways.heading (IMPORTANT: this field exists but the component currently ignores it and
  hardcodes different text inline -- write a good full sentence here, since Task 22 wires the
  component to read this field for the first time), each pathways.ways[].body
- results.heading, each results.cases[].line, .learn1, .learn2
- join.heading, join.body

DO NOT touch, for any reason: any glyph field (symbolic, not prose), loader (title/subtitle/
status), nav (thesis/pathways/results/cta -- these are short nav labels, not story copy),
hero.cta, hero.visualLabel, pathways.cta, join.primaryCta, join.secondaryCta, footer.taglines,
links (all fields), motion.loaderMs, and every stat1/stat1label/stat2/stat2label/stat3/
stat3label field in results.cases (these are real numbers: 7 subsystems, 40+ members, 3
semesters, 5 case studies, 12 sponsor briefs, 2 pitch cycles -- never invent or change a
number), and cs.imageLabel/kicker fields.

Preserve every interface (HomeGap, HomeWay, HomeCase) and field name exactly -- change only
string values, and keep the `as const` / `satisfies` assertions exactly as they are. Report
which lines you changed and the single strongest line you wrote.
```

- [ ] **Step 2: Verify hard facts are unchanged**

Run:
```bash
git diff lib/data/homeLanding.ts | grep '^[+-]' | grep -v '^[+-][+-]' > /tmp/landing-diff.txt
grep -E "stat1|stat2|stat3|glyph:|loaderMs|links:|join: '|contact: '|smartphoneProject: '|footer|nav:" /tmp/landing-diff.txt
```
Expected: no output for stat/glyph/links/loaderMs/footer/nav fields (only `pathways.heading`
and the intentionally-rewritten prose fields listed in Step 1 should appear in the diff).

- [ ] **Step 3: Verify the file still type-checks**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Do not commit yet** — Task 23 runs the review gate first.

---

### Task 22: Sharpen the serif/sans role split + wire `pathways.heading` through

**Files:**
- Modify: `components/home/HomeLanding.tsx`

**Interfaces:**
- Consumes: `homeLandingCopy.pathways.heading` (Task 21, now used for the first time).

- [ ] **Step 1: Fix the hardcoded Pathways heading (content-source bug)**

Replace (around line 274–281):

```tsx
        <div className="mb-14 overflow-hidden">
          <h2
            data-reveal
            data-reveal-delay="110"
            className="mx-auto m-0 max-w-[640px] font-[family-name:var(--font-home-serif)] text-[clamp(24px,3vw,36px)] font-medium leading-[1.3] text-[#111311]"
          >
            Two ways to build with DIGITAL, both grounded in real systems, real constraints, and our
            flagship <span className="font-semibold">Smartphone Project</span>
          </h2>
        </div>
```

with:

```tsx
        <div className="mb-14 overflow-hidden">
          <h2
            data-reveal
            data-reveal-delay="110"
            className="mx-auto m-0 max-w-[640px] font-[family-name:var(--font-home-sans)] text-[clamp(26px,3.4vw,42px)] font-semibold leading-[1.2] text-[#111311]"
          >
            {copy.pathways.heading}
          </h2>
        </div>
```

- [ ] **Step 2: Move Thesis heading from serif to sans, collapse size**

Replace (around line 229–235):

```tsx
              <h2
                data-reveal
                data-reveal-delay="110"
                className="m-0 max-w-[420px] font-[family-name:var(--font-home-serif)] text-[clamp(26px,3vw,38px)] font-medium leading-[1.25] text-[#F2F0E8]"
              >
                {copy.thesis.heading}
              </h2>
```

with:

```tsx
              <h2
                data-reveal
                data-reveal-delay="110"
                className="m-0 max-w-[420px] font-[family-name:var(--font-home-sans)] text-[clamp(26px,3.4vw,42px)] font-semibold leading-[1.2] text-[#F2F0E8]"
              >
                {copy.thesis.heading}
              </h2>
```

- [ ] **Step 3: Move Results heading from serif to sans, collapse size**

Replace (around line 336–342):

```tsx
          <h2
            data-reveal
            data-reveal-delay="110"
            className="m-0 font-[family-name:var(--font-home-serif)] text-[clamp(26px,3.2vw,40px)] font-medium leading-[1.2] text-[#111311]"
          >
            {copy.results.heading}
          </h2>
```

with:

```tsx
          <h2
            data-reveal
            data-reveal-delay="110"
            className="m-0 font-[family-name:var(--font-home-sans)] text-[clamp(26px,3.4vw,42px)] font-semibold leading-[1.2] text-[#111311]"
          >
            {copy.results.heading}
          </h2>
```

- [ ] **Step 4: Unify the Join heading to hero scale (stays serif — the closing promise-echo)**

Replace (around line 416–421):

```tsx
          <h2
            data-reveal
            className="mx-auto m-0 max-w-[640px] font-[family-name:var(--font-home-serif)] text-[clamp(28px,3.6vw,46px)] font-medium leading-[1.2] text-[#F2F0E8]"
          >
            {copy.join.heading}
          </h2>
```

with:

```tsx
          <h2
            data-reveal
            className="mx-auto m-0 max-w-[640px] font-[family-name:var(--font-home-serif)] text-[clamp(34px,5vw,58px)] font-medium leading-[1.14] tracking-[-0.01em] text-[#F2F0E8]"
          >
            {copy.join.heading}
          </h2>
```

- [ ] **Step 5: Verify it type-checks and lints**

Run: `npx tsc --noEmit && npx next lint`
Expected: both exit 0.

- [ ] **Step 6: Do not commit yet** — committed together in Task 25.

---

### Task 23: `brand-guardian` review pass on landing copy

**Files:**
- None modified (review-only task; may loop back into Task 21 if REVISE).

- [ ] **Step 1: Dispatch `brand-guardian`**

Use the `Agent` tool with `subagent_type: "brand-guardian"`, foreground, prompt:

```
Review the copy changes in lib/data/homeLanding.ts against docs/design/BRAND.md and
docs/design/landing.DESIGN.md. Use `git diff lib/data/homeLanding.ts` against the last
commit. Confirm pathways.heading now reads as a complete, standalone sentence (it is newly
wired into the component render in this phase, replacing hardcoded JSX text). Report PASS or
REVISE per section, and one overall verdict.
```

- [ ] **Step 2: Act on the verdict**

If REVISE: re-dispatch `brand-voice-strategist` with the flagged lines and re-run this task.
If PASS: continue to Task 24.

---

### Task 24: Update `docs/design/landing.DESIGN.md`

**Files:**
- Modify: `docs/design/landing.DESIGN.md`

- [ ] **Step 1: Update the Type Scale table**

In `### Type Scale`, update these rows:

```markdown
| Role | Size | Line Height | Letter Spacing | Token |
|---|---|---|---|---|
| Hero headline (serif 500) | `clamp(34px,5vw,58px)` | 1.14 | −0.01em | `--dg-type-hero` |
| Join heading (serif 500) | `clamp(34px,5vw,58px)` | 1.14 | −0.01em | `--dg-type-join` |
| Results heading (sans 600) | `clamp(26px,3.4vw,42px)` | 1.2 | normal | `--dg-type-results` |
| Thesis heading (sans 600) | `clamp(26px,3.4vw,42px)` | 1.2 | normal | `--dg-type-thesis` |
| Pathways heading (sans 600) | `clamp(26px,3.4vw,42px)` | 1.2 | normal | `--dg-type-pathways` |
| Loader wordmark (mono 500) | `clamp(30px,4.5vw,44px)` | normal | .42em (+matching text-indent) | `--dg-type-loader` |
| Stat numeral (serif 500) | 24px (`text-2xl`) | Tailwind default | normal | `--dg-type-stat` |
| Card title (sans 600) | 14px | normal | .02em | `--dg-type-card-title` |
| Body / join copy (sans 400) | 13px | 1.75 | normal | `--dg-type-body` |
| Card body (sans 400) | 12–12.5px | 1.7–1.75 | normal | `--dg-type-card-body` |
| Nav wordmark (mono 500) | 13px | normal | .12em | `--dg-type-wordmark` |
| Hero subline (mono 400) | 11px | normal | .06em | `--dg-type-subline` |
| Nav link (mono 400) | 10.5px | normal | .1em | `--dg-type-nav` |
| CTA label (mono 400) | 10–10.5px | normal | .12em | `--dg-type-cta` |
| Eyebrow (mono 400, uppercase) | 10px | normal | .24em | `--dg-type-eyebrow` |
| Micro label (mono 400, uppercase) | 8.5–9.5px | normal | .14em–.3em | `--dg-type-micro` |
```

(Join heading moved from `clamp(28px,3.6vw,46px)`/1.2/normal to match Hero exactly. Results,
Thesis, Pathways headings moved from serif 500 to sans 600 and collapsed from three distinct
clamps — `26-40`, `26-38`, `24-36` — to one shared `clamp(26px,3.4vw,42px)`.)

- [ ] **Step 2: Update the font-family role descriptions**

In the `### Newsreader (serif)` subsection, replace the first sentence:

```markdown
The voice of the page. Every `h1`/`h2` headline and the large stat numerals.
```

with:

```markdown
Reserved for exactly two moments: the Hero headline (the page's promise) and the Join
heading (the closing invitation, which restates the promise at the same scale) — plus the
large stat numerals. Thesis, Pathways, and Results headings moved to IBM Plex Sans in the
2026-07 revision; see Scale Philosophy.
```

In the `### IBM Plex Sans` subsection, replace:

```markdown
Workhorse body text; the `.home-landing` root `font-family`. Weights **400, 500, 600**. Card titles use **600** at 14px; body paragraphs use **400** at 12–13px with generous 1.7–1.75 line height.
```

with:

```markdown
Workhorse body text; the `.home-landing` root `font-family`. Weights **400, 500, 600**. Card titles use **600** at 14px; body paragraphs use **400** at 12–13px with generous 1.7–1.75 line height. Since the 2026-07 revision, the Thesis, Pathways, and Results section headings also use **600 (semibold)** at `clamp(26px,3.4vw,42px)` — the "proof" register, distinct from Newsreader's "promise" register.
```

- [ ] **Step 3: Update the Scale Philosophy section**

Append:

```markdown

**2026-07 revision:** the serif/sans role split is now strict — Newsreader appears only at
the Hero and Join headings (promise, stated and then restated at the close, both at
`clamp(34px,5vw,58px)`), and every other section heading (Thesis, Pathways, Results) moved to
IBM Plex Sans 600, collapsing three near-distinct serif clamps (26–40, 26–38, 24–36) into one
shared `clamp(26px,3.4vw,42px)`. The Pathways heading is now sourced from
`homeLandingCopy.pathways.heading` for the first time — it was previously hardcoded inline in
`HomeLanding.tsx`, a violation of this project's "content lives in `lib/data/`" rule, fixed as
part of this pass.
```

- [ ] **Step 4: Verify the doc structure is intact**

Run: `grep -c "^## " docs/design/landing.DESIGN.md`
Expected: `16` (unchanged section count).

- [ ] **Step 5: Do not commit yet** — committed together in Task 25.

---

### Task 25: Phase 4 verification + commit

**Files:**
- Modify: `TODO.md`

- [ ] **Step 1: Full static verification**

Run: `npx tsc --noEmit && npx next lint`
Expected: both exit 0.

- [ ] **Step 2: Manual dev-server check**

Run: `npm run dev` (background), then in a browser visit `/`:
- Confirm the loader, hero word-reveal, and all `data-reveal`/`data-hero-word`
  `IntersectionObserver` animations still fire exactly as before (this phase touched no
  motion code, only typography and one data-wiring fix).
- Confirm the Pathways section now renders the full sentence from `pathways.heading` (not the
  old hardcoded JSX text) with the bold "Smartphone Project" emphasis removed.
- Confirm Thesis, Pathways, and Results headings render in IBM Plex Sans at the new
  collapsed size, and Join renders in Newsreader at the same size as the Hero headline.
- Confirm no layout shift or text overflow at 375px, 768px, 1024px, 1440px widths.
- Toggle `prefers-reduced-motion: reduce` — confirm the existing reduced-motion path
  (250ms loader, `.home-landing *` transition-duration override in `home-landing.css`) is
  unaffected.

Stop the dev server when done.

- [ ] **Step 3: Record the phase in `TODO.md`**

```markdown
| v0.12.0 | #00XX    | `<sha>` | feat(landing): story-first copy + serif/sans role split (#00XX) | Phase 4 of brand-story-gsap plan — completes docs/superpowers/specs/2026-07-19-brand-story-gsap-design.md |
```

- [ ] **Step 4: Commit**

```bash
git add lib/data/homeLanding.ts components/home/HomeLanding.tsx docs/design/landing.DESIGN.md TODO.md
git commit -m "feat(landing): story-first copy + serif/sans role split"
```

---

## Final Verification (after all 4 phases)

- [ ] Run `npx tsc --noEmit && npx next lint` one final time across the whole repo — exit 0.
- [ ] Run `git log --oneline -20` and confirm one commit per phase deliverable (docs, feature,
  TODO) with no stray uncommitted changes (`git status --short` empty).
- [ ] Re-open all three pages (`/`, `/projects/modular-smartphone`, `/projects/smart-reading`)
  in sequence and read each one top-to-bottom as a reader would — confirm each now reads as
  one argument (promise → proof → invitation) rather than a list of sections.
- [ ] Confirm `docs/design/BRAND.md`, `smartphone.DESIGN.md`, `glasses.DESIGN.md`, and
  `landing.DESIGN.md` are all internally consistent with the shipped code (spot-check 3–4
  values per doc against the actual rendered page, same method used when these docs were
  first written).
