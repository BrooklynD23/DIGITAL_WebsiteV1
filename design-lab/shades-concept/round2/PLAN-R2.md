# SHADES round 2 — plan for four approaches (2026-10-09)

Status: draft for audit. Supersedes the A / B split in `../DECISIONS.md` for this round; every other decision there
still holds (see "Still true").

## Why round 2

The Head Designer rejected mockups A (`/projects/shades-a/`) and B (`/projects/shades-b/`) on 2026-10-09. Their reasons
(all four ticked): the glasses drawing looks like a wireframe; the page is too diagrammatic; the story / structure
(seven stages in one pin) does not land; the book treatment does not work. Kept from round 1: **A's system breakdown**
(the frame separating into five coloured functional groups, SIDEKICK-style). Nothing else is protected.

## Research input

`../research/round2/01…04-*.md` (Haiku 5.5, 22 pages fetched). Findings used here:

1. Product pages rarely say "prototype" in the hero; stage sits in a definition block, the call to action or the FAQ
   (Meta Orion, XREAL, Rivian "Coming 2027").
2. Research labs state stage and aim in the first lines and lead with access ("applications are open", Project Aria).
3. Concept cars carry status with words like "vision" and centre the story on one signature control (BMW i Vision Dee
   mixed-reality slider).
4. No fetched page labels visuals "illustrative"; SHADES must label its own.

## Head Designer answers (2026-10-09)

| Question | Answer |
|---|---|
| Approaches | Build all four (below) |
| Story length | Each approach decides |
| Where "concept" is stated | **Hero line** (overrides finding 1 for every approach) |
| Glasses | **Mixed**: solid product object in hero and closing; line art only for the anatomy breakdown |
| Imagery | **Show both**: some approaches code-only, some with generated images |

## Shared foundation

- One shared glasses artwork, `app/(apple)/_shades-art/Glasses.tsx` (modes `solid` / `line` / `exploded`, views
  front / three-quarter / side, optional in-lens word in HUD green `#7FE6A3`). Built first, preview at
  `/projects/shades-art-preview/`. Every approach imports it.
- Copy facts only from `app/(apple)/_content/shades.ts`, `_content/shades-concept.ts` and `../DECISIONS.md`. Any new
  string goes in the approach's own content file and through `brand-guardian` before review.
- Reuse the reader demo (`_shades/Reader.tsx`) where it earns a place.

## The four approaches

| # | Route | Model | Imagery | Story shape |
|---|---|---|---|---|
| 1 | `/projects/shades-reveal/` | Product reveal (Meta Orion, Vision Pro 2023) | Generated: hero render + 1–2 detail shots (code stand-ins until approved) | Hero object with concept line → "what SHADES is" block → anatomy (system breakdown) → the view through the lens → roadmap + seats as the closing "availability" section |
| 2 | `/projects/shades-research/` | Research platform (Project Aria, Starline) | Code-only | Hero states stage + aim → "seats are open" as the lead call to action → short code-drawn how-it-works sequence, each visual labelled illustrative → research questions / boundary → roadmap |
| 3 | `/projects/shades-control/` | One signature control (BMW i Vision Dee) | Code-only | 3–4 beats; the centre is one interactive see-through control the visitor drives (fade the display over a page, set the pace, watch the word hold) |
| 4 | `/projects/shades-catalog/` | Catalog page (AirPods Pro) | Generated product shots (code stand-ins until approved) | Highlight tiles → "take a closer look" anatomy viewer → reader demo → FAQ that answers "is this real?" → seats |

Every route: `robots: { index: false }`, not in nav or sitemap; live `/projects/shades/` (V0.1) untouched.

## Still true (from DECISIONS.md and the handoff)

Concept in planning, research platform, not a medical device, no efficacy / speed / comprehension claims, no named
parts, optics types or vendors, no invented people, numbers, dates or partners. Display is see-through. Held word HUD
green, flat, no glow; red `#d8412f` is the fixation point only. Scroll picks a stage, a timed tween plays it; no
scrubbing, no wheel hijack, one sticky bar. Reduced-motion and no-JS stills. Must sit beside SIDEKICK and BRAIN
(locked; untouched). Verification recipe: `../../HANDOFF-NEXT.md` §4.

## Process

1. Shared glasses artwork (Opus 5.5) — running.
2. **Fable high-level audit of this plan** → revisions folded in here.
3. Four Opus 5.5 agents, one per approach, using the `impeccable` skill, disjoint folders.
4. `brand-guardian` on each approach's new copy.
5. **Fable render audit** of all four (screenshots + live routes).
6. Fixes, then comparison page and Head Designer pick.

## Motion method for approach 3 (Head Designer, 2026-10-09)

After Effects is not installed, so `after-effects-mcp` is not used. Approach 3 keeps code-drawn motion
(DECISIONS.md #1) and borrows the post's loop instead: script the motion → render frames headlessly (Playwright
frame capture at fixed timestamps) → look at the frames → fix. Timing is measured, not guessed: capture a frame
sequence of each played stage and check the tween durations and easing with ffmpeg (frame diffs per step).

## Revisions after the Fable plan audit (2026-10-09)

Audit verdict: proceed with changes. Head Designer answers to the audit's questions:

| Decision | Answer |
|---|---|
| Approach 4 (catalog) | **Merged into 1.** Build three. 4's "Is this real?" block (max 4 questions, answers only from `shades.ts`) closes approach 1. No tiles, no cards |
| Book treatment | **Drop the archived photograph.** Supersedes `DECISIONS.md` #2. "The page" behind the word is typeset live by the site (`bookWords`, or the site's own copy in approach 3) |
| Image waiver | `DESIGN.md` §11 waived **for `/projects/shades-reveal/` review only**. Renders: object only, lens empty (the word is drawn by code on top), matte, on literal black, visible caption "Concept render. Not a built device." under each, max two renders. Code stand-ins (the shared solid `Glasses.tsx`) until the Head Designer generates them |
| Approach 3 control | **"Hold still" slider**: one native `<input type="range">`, five named steps Page → Line → Phrase → Word → Hold; the eye's jumps shorten until one green word holds. Pace is beat two (`reader.wpm`). No pin |

Rules added from the audit:

1. **Gate:** the Head Designer signs off `/projects/shades-art-preview/` and the `Glasses.tsx` props are frozen before any approach agent starts.
2. **Exploded mode** = solid flat bodies in group hue (SIDEKICK style); dashed only for the two off-frame functions.
3. **Copy first:** `brand-voice-strategist` writes the three content files, `brand-guardian` reviews, then build.
4. **Labels:** every concept visual carries a visible caption ("Concept render", "Illustrative view", "Simulation in your browser, not the device"), not alt text only.
5. **Pins:** at most 4 stages per pin; no pin in approaches 2 and 3.
6. **Approach 2** drops the "seats first" lead (CTA comes after the description) and drops the how-it-works diagram sequence; no "applications", "participants", "study", "protocol".
7. **Render audit** adds one pass/fail line per round-1 failure: no dashed stroke in hero or closing frames; the page reads as a product page, not a diagram; ≤ 4 beats per pin; the page behind the word reads as a page at 390.
8. Research findings that are summary-only (Meta Orion wording, Vision Pro visuals, AirPods viewer, BMW slider) are not to be cited as seen.

Creative briefs for the builders: the audit's §7, briefs 1–3 (kept in the session record; copied into each builder's prompt).

## Artwork sign-off (Head Designer, 2026-10-09)

`app/(apple)/_shades-art/Glasses.tsx` approved; props frozen. Polish continues in parallel without prop changes.
Waivers for SHADES only: gradients in solid mode (`DESIGN.md` §11) and the group hues in exploded mode
(`DESIGN.md` §12: optics blue, display green, timing amber, control violet, frame greys).
