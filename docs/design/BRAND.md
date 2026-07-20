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
