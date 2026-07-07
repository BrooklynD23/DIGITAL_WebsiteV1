---
name: digital-marketing
description: Positioning, voice, and copy rules for DIGITAL @ Cal Poly Pomona. Load for any branding, marketing copy, UI/UX messaging, or landing-page work. Governs what we say; DESIGN.md governs how it looks.
---

# DIGITAL Marketing Skill

Rules for writing and editing any user-facing wording on the DIGITAL @ Cal Poly
Pomona site: headlines, eyebrows, body copy, CTAs, nav labels, FAQ answers,
sponsor lines, stats.

## Scope split — this skill vs DESIGN.md

| Concern | Authority |
|---|---|
| Colors, typography, components, layout, motion | `DESIGN.md` (source of truth for visuals) |
| Positioning, voice, tone, new copy, claims/stats | **This skill** |

`DESIGN.md` §13 says "Do not invent new copy — restyle existing DIGITAL text
only." That rule protects **existing strings during visual refactors** — when
re-skinning a page, preserve the approved wording exactly. It does **not**
forbid new copy forever: NEW copy (new pages, new sections, new claims) is
allowed, but **only** via the copy workflow below. If a task is purely visual,
DESIGN.md's rule applies unchanged: keep every string as-is.

## Positioning core

The canonical purpose statement lives in `lib/data/mission.ts`
(`PURPOSE_STATEMENT`, assembled verbatim from the approved mission beats).
Everything we publish must be consistent with it:

- **Depth over scale.** DIGITAL does not sell headcount, prize pools, or
  celebrity keynotes. It sells depth of work, method, and access. Never
  compete on scale claims we can't back.
- **We develop people who lead complex technical work.** The product is the
  member's growth, demonstrated through real hardware and software.
- **Projects are educational ecosystems.** Every project is an education —
  you build the whole system, not just your slice of it.
- **The method is the story:** explore → design → build → communicate
  (the four mission beats: WE EXPLORE / WE DESIGN / WE BUILD / WE COMMUNICATE).
- **The Modular Smartphone is a reference implementation of our values**,
  not a limit on what the club is. Use it as proof of method; don't frame
  DIGITAL as "the smartphone club."
- **Entrepreneurship and business awareness are part of engineering
  practice** — "we scope the work, raise the funding, and pitch it like a
  business" — not a separate track.

## Voice — do

- **Terse industrial headlines.** Short, uppercase-friendly, one idea.
  ("Take it apart." / "Built from modules.")
- **Concrete nouns.** PCB, module, FPGA, kernel, Building 17, Thursday 6PM.
  Specifics are the brand.
- **Honest status words.** "prototyping," "student-built," "in build phase,"
  "open-source." Say where the work actually is.
- **Plain verbs, active voice.** We build, we test, we pitch.
- **Proof next to every claim.** A stat, a spec, a named project, a named
  sponsor — or don't make the claim.

## Voice — don't

- Never "revolutionary," "game-changing," "seamless," "cutting-edge,"
  "world-class," or any startup-superlative filler.
- Never scale claims we can't back ("Backed by Industry Leaders" is
  do-not-use — we have 2 named campus sponsors; say "Campus partners" /
  "Supported by").
- Never unverified stats. Check `claims.md` before writing any number.
- Never imply shipped products — flagship hardware is prototyping, say so.
- Never use accent red `#d8412f` decoratively — per DESIGN.md it is reserved
  for eyebrows, margin notes, progress rail, active nav, primary CTA hover.
  (Copy implication: don't design copy that demands extra red emphasis.)
- Never hard-code copy in page/component files — all strings live in
  `lib/data/*` (CLAUDE.md rule).

## Copy workflow

1. **All user-facing strings live in `lib/data/*`.** Pages and components
   consume data files; never inline new copy in `.tsx`.
2. **Rephrasing approved strings is free.** Tightening or restyling wording
   that already exists in `lib/data/*` needs no sign-off, as long as facts,
   names, and stats are unchanged.
3. **New claims, stats, or names require sign-off.** Any new number,
   sponsor/partner name, superlative, or factual claim needs an entry in
   `claims.md` with status `verify`, and human sign-off before it ships with
   status `approved`.
4. **Conflict resolution order:** purpose statement (`lib/data/mission.ts`)
   > `lib/data/landing.ts` > inline page copy. When strings disagree, the
   higher source wins and the lower one gets fixed.

## Read next

- `audiences.md` — 7-segment messaging table (message / proof / CTA per
  audience) + headline/eyebrow/CTA formulas for the industrial type system.
- `claims.md` — approved-claims registry. **Check it before writing any stat,
  sponsor line, or factual claim.**
- `lib/data/mission.ts` — canonical purpose statement (verbatim source).
- `DESIGN.md` — visual system; §11 lists copy to preserve, §13 anti-patterns.
