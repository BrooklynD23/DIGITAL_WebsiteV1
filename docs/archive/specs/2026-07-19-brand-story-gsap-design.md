# Brand Story System + GSAP Text Choreography — Design Spec

**Date:** 2026-07-19 · **Status:** Approved design, pending spec review
**Scope:** Brand guideline + guardian agent, then story-first copy, intentional typography,
and GSAP text animation across `/projects/modular-smartphone`, `/projects/smart-reading`, `/`.

## Problem

The three immersive pages read as information lists — bullet dumps, spec grids, evenly
weighted sections. Flagship consumer brands (Apple, Samsung, Google) write pages that tell
one story: a headline that promises, a subline that proves, details that arrive only when
the reader is ready. The pages also animate copy generically (uniform fades) rather than
pacing the story. There is no written voice standard, so every future copy edit drifts.

## Constraints (non-negotiable)

- **No component/transition changes.** Existing mechanics stay: anime.js loader/scrub on
  the smartphone page, Framer Motion + Lenis on glasses, CSS/IntersectionObserver reveals
  on the landing. The only allowed markup change is the minimal span-wrapping GSAP SplitText
  requires on animated text nodes.
- **No new font families.** Typography redesign = usage discipline (sizes, weights, jumps)
  within each page's existing families.
- **Copy lives in `lib/data/`** (`phoneV2.ts`, `experiments/glasses.ts`, `homeLanding.ts`)
  — never in components.
- **Hard facts preserved exactly:** subsystem names, meeting time/place, links, stats,
  contact details.
- **Static export safe:** all GSAP work client-side (`'use client'`, effects), no SSR APIs.
- **Accessibility:** `prefers-reduced-motion` renders static text (no split spans animating);
  contrast and heading order unchanged.
- Route style docs in `docs/design/` remain source of truth and are updated in the same
  phase as the page they govern.

## Part 1 — Brand system

### `docs/design/BRAND.md`

Voice guideline in the same reference register as the route style docs:

- **Voice pillars:** declarative, concrete, one idea per line; verbs over adjectives;
  second person sparingly, imperative for CTAs; no filler ("comprehensive", "innovative").
- **Narrative spine per page** (each page argues exactly one idea):
  - Smartphone: *one device, owned in parts* — you don't join a club, you take a subsystem.
  - Glasses: *reading without the chase* — the text moves so your eyes don't have to.
  - Landing: *students become builders* — the gap between coursework and real systems.
- **Message hierarchy:** headline = promise (≤7 words), subline = proof, body = invitation.
  Specs and lists are progressive disclosure — they may exist, but never open a section and
  never carry the argument.
- **Do's / Don'ts** with before→after rewrites of actual current lines from the three data
  files (at least 3 pairs per page).
- **Cadence rules for animated text:** lines written to be revealed — front-load the
  subject, one clause per line, no line over ~9 words in display sizes.

### `.claude/agents/brand-guardian.md`

Repo-local review agent. Frontmatter: tools `Read, Grep, Glob` (review-only, cannot edit);
description triggers on copy/wording/microcopy changes. Behavior: read `BRAND.md` + the
governing route style doc, diff proposed copy against the pillars/hierarchy, flag
info-dump regressions and spine drift, output pass/revise verdicts with line-level notes.
Wired into the existing routing sections of `CLAUDE.md`, `AGENT.md`, `AGENTS.md`:
copy changes → consult brand-guardian; visual changes → route DESIGN.md; both require
Head Designer approval beyond faithful adjustments.

## Part 2 — GSAP text layer

- Add `gsap` (core, ScrollTrigger, SplitText — all free since GSAP 3.13).
- New `components/motion/` module:
  - `TextReveal.tsx` — client component wrapping a text node; splits (lines or words),
    animates opacity/transform-only on scroll enter (ScrollTrigger) or mount; props:
    `as`, `split: 'lines' | 'words'`, `stagger`, `delay`, `trigger` behavior.
    Under `prefers-reduced-motion` (or JS-off/SSR pass) it renders the plain node.
  - `motion/gsapSetup.ts` — single `gsap.registerPlugin` site + shared defaults
    (easing/duration tokens read from the page's design-doc values).
- **Integration:** smartphone page only in this project's GSAP phase (hero headline,
  section headlines, subsystem stage titles/copy beats). Glasses and landing keep their
  existing animation stacks; their phases are copy + typography only. (Standardizing
  them on GSAP is explicitly out of scope — future decision.)
- anime.js remains untouched; GSAP and anime.js never animate the same node.

## Part 3 — Typography intentionality (per page)

Usage redesign within existing families; each page's `docs/design/*.DESIGN.md` Type Scale
and Scale Philosophy sections updated to match in the same phase:

- **Smartphone** (Archivo / Hanken / DM Mono): collapse mid-scale clutter — UI chrome
  clusters small (11–14px mono/label), display jumps hard (clamp-based hero ≥ current);
  whisper-weight on the largest statements where Archivo's lighter weights are loaded;
  subsystem titles gain a consistent single display size instead of ad-hoc sizes.
- **Glasses** (Archivo / Hanken / DM Mono): the stepped Tailwind scale stays but drops
  intermediate sizes between chrome and display; phosphor HUD type untouched.
- **Landing** (Newsreader / IBM Plex): sharpen the serif/sans role split — Newsreader only
  for promise lines, IBM Plex for proof/invitation; remove mid-size drift.

Exact values are decided during implementation against each page in the browser, then
recorded in the route docs — the docs are updated in the same commit as the page.

## Part 4 — Copy rewrite (story-first)

Per page, in its data file only:

1. Write the spine as one sentence at the top of the data file (comment).
2. Rewrite headline/subline/body fields to promise→proof→invitation order.
3. Convert bullet dumps into sequenced beats (arrays stay arrays — components unchanged —
   but items become story-paced lines, trimmed hard; relocated detail moves into existing
   spec/disclosure fields, or is cut).
4. Hard facts verified against the pre-rewrite file in review.

## Phases & order

| Phase | Deliverable | Commit gate |
|-------|-------------|-------------|
| P1 | `BRAND.md`, brand-guardian agent, routing wiring | docs commit |
| P2 | Smartphone: GSAP layer + copy + type + smartphone.DESIGN.md update | `tsc`/lint green, reduced-motion check |
| P3 | Glasses: copy + type + glasses.DESIGN.md update | same |
| P4 | Landing: copy + type + landing.DESIGN.md update | same |

Each phase is a separate commit (recorded in TODO.md per standing rule) so the Head
Designer can review page-by-page.

## Testing / verification

- `npx tsc --noEmit` and `npx next lint` per phase (run.sh is CRLF-broken in WSL).
- Manual: dev server per page — verify GSAP reveals fire once, no layout shift from span
  wrapping, anime.js sequences unaffected; toggle `prefers-reduced-motion` and verify
  static rendering; mobile breakpoint unchanged.
- brand-guardian agent run against each rewritten data file before its phase commit;
  hard-fact diff (grep meeting info, links, subsystem names pre/post).

## Out of scope

- Migrating glasses/landing to GSAP; any layout, color, or transition changes; new fonts;
  new sections or routes; imagery changes.
