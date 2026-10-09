# SHADES concept — Head Designer decisions (2026-10-08)

These answer the six open decisions in `PLAN.md` §8. **Where this file and `PLAN.md` disagree, this file wins.**
The mockup agents read this first.

| # | Question | Decision (Head Designer's words) | What it means for the build |
|---|---|---|---|
| 1 | Generated images? | "We want to render it like based on how SideKick is rendered, with agents creating codes/transitions." | **No generated images.** Everything is code-drawn, the way SIDEKICK is: geometry authored in code or static SVG files, isometric / line-art parts that separate, lift and take colour, played stage by stage with `useScrollSteps` + `useStagePlayback`. Drop every image-generation step and the prompt system in `PLAN.md` §6 from the work; keep it only as reference. Direction B as written ("Plate", four generated images) is void. |
| 2 | Which book background? | "Book background is the old photograph we have from the archived SHADES web route." | Use the archived photograph: `archive/public/assets/experiments/glasses/` (`BookBG_Clear.png` 2.7 MB, `BookBG_Blurry.png` 1.4 MB). It is the one raster on the page, a sanctioned exception to "no photographic renders" for this page. Bring it back with `git mv`/copy into `public/`, re-encoded (AVIF/WebP, target ≤ 250 KB desktop, ≤ 120 KB mobile crop). The words that move through it are drawn live by the site on top. Known issue to report in the mockups: the photo's own printed text is invented and has typos ("recnocile", "onccome"); propose how to handle it (blur plate, crop, or cover with the live typeset words). |
| 3 | Colour of the held word | "Green might work better." | The held word (and only the in-lens display content) is the HUD green `#7FE6A3`, as a sanctioned second accent for SHADES, the way SIDEKICK has its group palette. Flat colour: no glow, no blur halo. The red fixation point stays the site's one red. Show a white-word variant in one mockup frame so the choice can be confirmed by eye. |
| 4 | How "concept" is labelled | "Provide suggestions in mockup." | Each mockup shows its own labelling proposal in place (wording and position), and the mockup notes list 2–3 alternatives. No decision yet. |
| 5 | Retire the current sections? | "Current is V0.1, this is complete revamp of SHADE." | The mockups are a full replacement, not an edit. Nothing on the current page is protected: the light-path pin, the scan-path chapter, the `shades-fixate` clip, the hero glasses and the highlights strip may all be replaced or folded in. Keep what earns its place (the reader demo is the likely survivor). Facts still come only from `app/(apple)/_content/shades.ts` plus this file. |
| 6 | Is the display see-through? | "Display is see through." | Stated by the Head Designer, so it may be shown and said: the page stays visible behind the word in the "through the wearer's eyes" stage. Add it to the SHADES content as a sourced fact (source: Head Designer, 2026-10-08). It is still a planning-stage concept: no optics type, panel or part is named. |

## What the two mockups are now

Both are code-rendered in the SIDEKICK manner, both use the archived book photograph, both use the green word,
both replace the whole page. They must still be two genuinely different takes. Suggested split (the next
orchestrator may refine it with the Head Designer):

- **Mockup A — the object leads.** Black ground. One code-drawn glasses frame carried through the seven stages
  like the SIDEKICK board (assemble → separate into functional groups that lift and take a colour → the lens →
  the view). The book photograph appears only where the story reaches the reader's view.
- **Mockup B — the book leads.** The book photograph is the ground from the first viewport, with live words
  streaming across it; the code-drawn glasses arrive over the book, and the see-through lens frames the page so
  the held green word sits over real paper. Dark sections follow for the system and the roadmap.

Review routes: `app/(apple)/projects/shades-a/` and `shades-b/`, `robots: { index: false }`. The live
`/projects/shades/` (V0.1) stays untouched until one is chosen.

## Still true from `PLAN.md`

The seven-stage arc (hero + Idea · Form · System · Optics · View · Glasses), one sentence per stage, captions
through the brand agents before building, the honesty guard-rails (concept in planning, research platform,
not a medical device, no efficacy claims, no invented hardware, no part names), reduced-motion and no-JS
stills, the verification recipe in `design-lab/HANDOFF-NEXT.md` §4, and that SIDEKICK and BRAIN are locked.
