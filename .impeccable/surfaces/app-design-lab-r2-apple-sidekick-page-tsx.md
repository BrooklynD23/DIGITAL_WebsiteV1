---
version: 1
slug: "app-design-lab-r2-apple-sidekick-page-tsx"
primary_target: "app/design-lab/r2/apple/sidekick/page.tsx"
related_targets: []
---

Scope: /design-lab/r2/apple/sidekick (lab, round 2, Apple product page played straight). Mode: Experience. Audience: prospective members and sponsors/faculty equally. Job: present the paused SIDEKICK hardware as the product it is, with honest status, and route to "Take a subsystem". Proof: the club's KiCad geometry, KB status facts, all [confirm]. Constraints: legal and original (no Apple assets, names or headings), one scrubbed asset, clips play once on entry with a control, reduced motion collapses the pin.

## Direction contract

THESIS: the power carrier is the product shot. The page treats an unfinished 49 x 41 mm board with the reverence of a flagship launch, then tells the plain truth about it. It refuses fake renders, invented specs and a buy-now promise.

OWN-WORLD: black hardware chapters turning to white and #f5f5f7 for status and joining, Geist 600 on six sizes, line-art boards from the real files as the only imagery, one filled dark pill in the 52px local nav, red only on that pill's hover and one anchor dot.

STORY: the visitor meets the board, skims the highlights, watches the stack come apart, looks closer at each board, learns it is paused, reads the four ownership rules and takes a subsystem.

FIRST VIEWPORT: black chapter. Centered: SIDEKICK at 28px, the 5-word headline at 80px, one lead line, a text link. Below it the carrier board in iso at about 640px wide, assembled, with one caption naming the source file. The local nav pins at the top with the filled "Take a subsystem" pill.

SIGNATURE: a pinned exploded-board chapter: one scrubbed asset (clip sidekick-explode, or the BoardSvg stack) separates the modules layer by layer while a one-line caption per layer swaps in place. The swap clip (sidekick-swap) plays once on entry with a replay control.

FORM: canon: Apple product page played straight (craft bar: measured iPhone/AirPods/MacBook pages)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## W3b changes

Applied (11):
1. BoardLayers everywhere; the HTML is 160 KB, down from 763 KB. The forked local nav is replaced by `_chrome` LocalNav, with WorldNav `join={false}`.
2. AppleWalk is deleted. The single pin (380 svh) scrubs `sidekick-explode` (world apple, `ref.setProgress`, captions on `markerIndex`), then hands over to the module stack for five module beats using `modules[].caption`. Inactive captions are `aria-hidden` and transparent, never removed.
3. The swap uses CineClip `sidekick-swap` (world apple, auto aspect) and plays once with its own control. SwapClip is deleted.
4. The closer-look viewer covers all five modules: name, spec, one risk line. Board views are pre-mounted and cross-fade. Disabled views say "No board file yet".
5. Hero: the board is capped at 640 px and fits with its caption above the 1440×900 fold. It settles once via Web Animations on the layer boxes.
6. Tone flips once: dark (hero, teardown, swap, closer look), then light (highlights, status, rules, join).
7. Highlights now use the system `<Highlights>`.
8. JoinChapter brings the sponsor path. The seats say "unassigned" once.
9. Phone shell and locked names on the module stack.
10. Copy fixes, same as Signal.
11. Glyph anchors are off by default.

Rejected (1):
- The pin is 380 svh, not about 300. Below 340 the five module beats fall under the minimum dwell, and the quiet share drops.

Deferred (2):
- Quiet viewports are 42% at 1440 and 36% at 390, against a 45% target. `r2-words.mjs` counts every horizontally clipped highlight card (+50–70 words in one viewport). The join chapter is shared.
- The clips keep their own material: the CINE agent owns the Apple variants, and they are used as-is.

## Finish fixes

Evidence for every item is in `design-lab/renders/r2/sidekick/v3/`.

1. **Kicker:** resolved. The 28px "SIDEKICK" above the headline is deleted; the local nav names the product. See `steps/apple-d-00-top`.
2. **Quiet gate:** resolved. The clip-aware `r2-words.mjs` measures 50% at 1440 and 50% at 390. To get there:
   - The viewer specs are shorter, and its risk line is dropped. Risks stay in Signal and in the status "Next" list.
   - The highlights title is now "At a glance.".
   - The status lists are shorter.
   - The mobile pin runs 430 svh.
3. **CTA contract:** resolved. The pill reads "Take a subsystem" → #join, and the join primary is "Take a subsystem on Discord". The hero's "See it come apart" link is removed.
4. **Hero-metric "1"s:** resolved. The rules are now one headline plus four quiet lines. See `steps/apple-d-10`.
5. **Truth:** resolved, but not routed through brand-voice-strategist or brand-guardian (lab).
   - The pin's first caption reads "Three boards in KiCad. Two are routed."
   - "Fully routed" became "routed".
   - "Not built." became "No module swaps yet."
6. **Legibility of module beats:** resolved. Board ink tokens are re-resolved inside dark chapters; the `.page` var had inherited the light #1d1d1f. Inactive tiers dim to 0.82 and the shell to 0.85–0.9. See `steps/apple-d-04`.
7. **[confirm] style:** resolved. The highlight captions no longer carry an inline tag. One 12px confirm note sits under the strip.
