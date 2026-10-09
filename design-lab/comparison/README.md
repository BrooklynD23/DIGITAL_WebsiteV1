# Comparison: how to read the design lab

Open `http://localhost:3100/design-lab/` (concept gallery) and `http://localhost:3100/design-lab/components/` (component grid).
Six directions, A to F, in the order they were briefed. Nothing is ranked, scored or recommended. The choice, or a hybrid, belongs to the Head Designer.

## 1. The two pages

| Page | What it shows | How to use it |
|---|---|---|
| `/design-lab/` gallery (ORIGINAL_PROMPT §37) | Per concept: name, one-sentence thesis, desktop + mobile first screen, whole-page overview, live type specimen, palette with hex values, notable interactions, distinctive idea, tradeoffs (each with its source file), "Open prototype". Below: motion reel, mascot study, type lab, component grid | Switch concepts with the A–F tabs (arrow keys, Home, End). Each concept has its own link: `/design-lab/#a` … `#f`. Without JS all six render stacked |
| `/design-lab/components/` grid (§38) | Rows NAVIGATION, HERO, PROJECT CARD, CALL TO ACTION, TYPOGRAPHY × columns A–F | Read across a row to compare one component. Every cell links to that block on its prototype, plus a full-size crop. "Larger previews" switches the grid to wide columns that scroll sideways; under 720 px the grid stacks |

Reading notes:

1. Previews are the v2 renders (after the cross-critique round). The prototypes themselves are the source of truth: open them.
2. Type specimens render the concepts' real faces live, loaded the way each concept loads them (Fontshare CDN `<link>` per family for Zodiak, Switzer, Clash Display, General Sans, Cabinet Grotesk, Satoshi; `next/font` for the Google faces; local OFL woff2 for Departure Mono). The grid's TYPOGRAPHY row uses screenshot crops of the same faces in context.
3. Tradeoffs list "works for it" and "costs and open risks" in equal numbers per concept (2 + 4), pulled from the cross-critiques, each concept's own risk list and its v2 deferred list. Each line cites its file.
4. Interaction can't be compared in a crop. Use the "Notable interactions" list in the gallery, then try it on the prototype.
5. All copy on the prototypes is exploratory and still goes through brand-voice-strategist → brand-guardian before production.

## 2. Where every artifact lives

| Artifact | Path |
|---|---|
| Brief, context, original prompt | `design-lab/BRIEF.md`, `design-lab/CONTEXT-PACK.md`, `design-lab/ORIGINAL_PROMPT.md` (§37 gallery, §38 grid) |
| Concept specs (thesis, §31 system, v2 changes) | `design-lab/concepts/concept-{a..f}.md` |
| Mascot study + recommendation (no homepage mascot) | `design-lab/concepts/mascot.md`, route `/design-lab/mascot/` |
| Motion reel spec | `design-lab/concepts/motion-reel.md` |
| Prototype code | `app/design-lab/{a..f}/`, `app/design-lab/mascot/`, `app/design-lab/type-lab/` |
| Cross-critiques (one concept read through another's lens) | `design-lab/critiques/a-by-f.md`, `b-by-a.md`, `c-by-b.md`, `d-by-c.md`, `e-by-d.md`, `f-by-e.md` |
| Micro-interaction and accessibility audits | `design-lab/critiques/micro-{a..f}.md`, `a11y-{a..f}.md`, `a11y-mascot.md` |
| Gemini critiques (vision + motion) | `design-lab/critiques/*-gemini*.md`, `crit3-d/`, `motion-reel-gemini.md` |
| Renders v1 (first build) | `design-lab/renders/{a..f}/v1/` |
| Renders v2 (after critique; used by the gallery) | `design-lab/renders/{a..f}/v2/<x>-{desktop,tablet,mobile}.png` (+ state shots, `motion.webm` for C and E) |
| Motion reel | `design-lab/renders/motion/reel.mp4` (v2), `reel-v1.mp4`, `reel-poster.png`; source `design-lab/motion-reel/` |
| Mascot renders | `design-lab/renders/mascot/v1/{with,without}.png`, close-ups; `v2/` full pages |
| Type lab | route `/design-lab/type-lab/`, panels `design-lab/renders/type-lab/panels/` |
| Current production site (baseline) | `design-lab/renders/current/` |
| Research | `design-lab/research/`, `design-lab/audit.md`, `design-lab/tooling-audit.md` |
| Gallery code | `app/design-lab/page.tsx`, `app/design-lab/_gallery/` (data in `concepts.ts`, grid rows in `grid.ts`) |
| Component grid code | `app/design-lab/components/` |
| Web copies of renders | `public/design-lab/gallery/` (previews, reel, mascot) and `public/design-lab/gallery/crops/` |
| Crop sources + measured boxes | `design-lab/comparison/crops/*.png`, `design-lab/comparison/crops/regions.json` |
| Gallery screenshots | `design-lab/renders/gallery/` |

Regenerate:

```bash
cd /home/danny/worktrees/digital-design-lab
node design-lab/scripts/gallery-assets.mjs   # previews, strips, reel, mascot -> public/design-lab/gallery/
node design-lab/scripts/gallery-crops.mjs    # measures the live DOM at 1440, cuts grid crops from the v2 renders
node design-lab/scripts/gallery-check.mjs    # console errors, overflow, tabs, deep links, no-JS, live fonts
```

If a concept changes after v2, re-shoot it (`shoot.mjs`) before running `gallery-crops.mjs`; the script warns when a render's height no longer matches the live page.

## 3. How to ask for a hybrid

Name the part, the concept letter, and what to keep or drop. The grid row names are the vocabulary.

- "Use C's hero, A's typography, E's project grid and F's interaction."
- "B's navigation and project records, set in D's typography and palette."
- "E's ledger as the hero, but with A's thesis treatment above it."
- "D's seat picker as the join section, on F's cutting-mat surface."
- "Keep A whole, swap its Fontshare faces for an OFL pair, and re-render."
- "C's particle hero, but only on the project pages; the homepage uses B's Fig. 1."

Useful to say alongside it:

1. Which accent rule wins (most concepts keep production `#d8412f` for marks only; C lifts it to `#f0573a` on dark; F darkens it to `#c8361f` for the name tag).
2. Which empty-state device wins: A bylines, B "UNASSIGNED" in the drawing, C "No signal", D seat echo, E typed blanks (Open / Pending / Unassigned), F your name on the tag.
3. Whether the motion reel should take the chosen display face and palette (it is brand-neutral on purpose).

Mixing caveat: each concept keeps one display voice, one accent and one radius rule. When parts from two concepts meet, decide which concept's tokens they share.
