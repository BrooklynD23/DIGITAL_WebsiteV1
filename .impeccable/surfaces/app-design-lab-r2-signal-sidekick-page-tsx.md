---
version: 1
slug: "app-design-lab-r2-signal-sidekick-page-tsx"
primary_target: "app/design-lab/r2/signal/sidekick/page.tsx"
related_targets: []
---

Scope: /design-lab/r2/signal/sidekick (lab, round 2, Signal Capture world). Mode: Experience. Audience: prospective members and sponsors/faculty equally. Job: show the real, paused SIDEKICK hardware honestly and turn one visitor into the owner of one subsystem. Proof: the club's KiCad geometry (carrier, fingerprint), KB status facts, all [confirm]. Constraints: 0 rAF at rest, <=1 moving object per viewport, reduced motion and no-JS show the fully exploded stack with full copy.

## Direction contract

THESIS: SIDEKICK is an honest teardown of a paused phone. The club's real KiCad boards come apart under the scroll and every layer is a seat with no owner yet. It refuses the product hero: renders, spec cards, "coming soon" gloss.

OWN-WORLD: near-black graticule, bone line art drawn from real board files, Hubot Sans wide caps for names, Monaspace Krypton for every measured value, state carried by line form (struck = paused, dashed = pending, solid = exists). One red trigger caret rides the timebase rail; nothing else is red.

STORY: the visitor sees the real boards, learns what exists, what is paused and what was never started, believes the club tells the truth, then takes a subsystem and comes on Thursday.

FIRST VIEWPORT: left 5 columns: CH1 SIDEKICK channel readout, a 5-word headline at 72px, one lead sentence, a struck "paused" state line. Right 7 columns: the power carrier in iso at about 560px with a measurement cursor reading 49.0 x 41.0 mm. Action: a text link "Take a subsystem" to the join chapter.

SIGNATURE: scroll is the timebase. The stack of five modules explodes one gap per entry while the active real board separates into copper, substrate and silk; a cursor readout beside the object reports the layer and the subsystem. Beat: the fingerprint module swaps out of the stack on a keyboard-operable control.

FORM: Signal Capture, roll index 3, seed key 0a795440

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## W3b changes

Applied (12):
1. Boards render as BoardLayers (static per-layer files, composited boxes); the HTML is 125 KB, down from 605 KB. The stack driver is now a pure frame writer (`_sidekick/stackFrame.ts`) on `useScrollSteps`. Scroll transforms have no transition; tiers are promoted to their own layers.
2. The walk collapsed to the active entry. One sticky panel sits beside the stack and shows state, a 4–5 word line, and Scope/Risk inside a closed details element. Steps are 70 vh each.
3. The locked name list is back on the object (E's leaders, dashed seat rings). "Every seat open." appears once, as a figure note.
4. A never-started phone shell (front and back, dashed and struck) now surrounds the stack, so the object reads as a phone.
5. The swap is a CSS-only checkbox with a constant label and works without JS. The readout says "seat open" only on tier 01 or the swap step. Leaving the swap step re-seats the module. The readout is `aria-live`. The band is a section.
6. Tall timebase layout applies only when enhanced. No-JS and reduced motion share the static layout (5,563 px, word parity).
7. The hero measurement is now two cursors drawn on the board's real edges (A 49.0 mm, B 41.0 mm).
8. One red per viewport: owner glyphs drop the anchor. Red appears only on the trigger caret, the swap seat and the join seat.
9. Tier names never dim (ink-2/ink-3). `[confirm]` is 12 px.
10. JoinChapter brings the sponsor path. The seat rows say "unassigned" once.
11. Copy: "track segments"; nine planned modules named; "Both board drawings…".
12. Quiet viewports: 50% at 1440 and 50% at 390.

Rejected (1):
- The swap's own transform transition stays. It is a user action, not a scrub; the recipe's ban covers scroll-driven transforms only.

Deferred (2):
- Glossary codes (F.Cu etc.) remain in the readout. They are measured values in the Signal grammar; the plain layer names sit beside them.
- Production cursor rAF: W3a already opted it out.
