# SHADES concept — improved plan

Written 2026-10-08 for the next orchestrator and its mockup agents. Input: `SOL-PLAN.md` (with the Head
Designer's notes), `references/`, `research/`. Nothing here is built, generated or approved yet.
Rules that win over this file: root `DESIGN.md`, the two locked specs, `docs/design/BRAND.md`.

## 1. Brief

1. **What it is.** SHADES: glasses that show one word at a time, at one fixed point, at the pace the reader sets (RSVP). An FPGA times the words. Two tracks: engineering and medical research.
2. **Where it is.** Status "Planning". Parts are not chosen. Seven roadmap phases, current phase unconfirmed. So the page sells the **concept**, not a product.
3. **Fixed requirements.** Concept-led six-beat sequence (idea drawing → form → inside the system → optics → the wearer's view → the glasses). A conceptual / theory hero. The book background with words moving through it. Two different mockups.
4. **Fit.** Apple-leaning; sits beside locked SIDEKICK and BRAIN on the played-stage pattern; an original frame design, not ASUS's.
5. **Honesty.** Concept framing on every figure. No medical or efficacy claims ("A research platform. Not a medical device."). No invented hardware facts. Every printed fact comes from `app/(apple)/_content/shades.ts`.

## 2. Critique of the Sol plan

**Keep**

| Item | Why |
|---|---|
| The six-frame arc | The Head Designer likes it; it maps 1:1 onto six played stages |
| A silhouette / B storytelling / C payoff | Ordinary-looking frame, engineering explained in the middle, one held word as the payoff |
| Generation order against identity drift | Approve one hero, derive views, condition every later frame on them |
| "UI, captions and transitions in the website, not baked into images" | Matches `_content/*.ts` and keeps words live, selectable and accessible |
| "Concept art, not a claim that parts are built" | Correct instinct; this plan makes it visible on the page, not only in a note |

**Wrong or risky for this site**

| # | Sol plan | Problem here | Source |
|---|---|---|---|
| 1 | Photoreal "premium physically based CGI" hero of the glasses | The hardware does not exist. SIDEKICK is drawn from a real KiCad file and BRAIN is code-drawn dots; a glossy render beside them reads as the one page that is pretending. `DESIGN.md` lists "photographic renders" under Never | `DESIGN.md` §11, §17; `research/03` obs 1, 2, 14 |
| 2 | "FPGA development board" dual-object render | Invents a board, package, connectors and power circuitry. The content names no FPGA part and no board | `_content/shades.ts` header; `lightPath.figureLabel` |
| 3 | Exploded view with "conceptual electronics", "optical module" | Invented internals. Only six functions are sourced (text, timing, control, display, optics, eye) and one placement: compute and power in an external controller | `scope.in` |
| 4 | Materials: graphite acetate, brushed titanium, tinted lenses | Invented material spec for an unchosen design | `status`, `lightPath.figureLabel` |
| 5 | Phosphor-green HUD `#7FE6A3` with glow | The system allows one red mark and no other hue; glow and bloom are banned. The green is also 10 units from SIDEKICK's Power hue `#68d7a1`, so it would read as "power" one page over | `DESIGN.md` §6, §12, §18 |
| 6 | Charcoal / silver gradient backgrounds, "dark vignette" | Gradients are banned; story surfaces paint literal `#000` | `DESIGN.md` §6, §18 |
| 7 | One 16:9 hero frame with text-safe space | Ignores the pinned played stage (caption band · figure · tracker), phones (390×844), reduced-motion stills and no-JS parity | `DESIGN.md` §10 |
| 8 | "Assistive reading device", "reading assistance", "developed with dyslexic readers in mind" | Efficacy and medical framing. The page's boundary is "claims no effect on dyslexia or on reading outcomes"; wording is person-first ("readers with dyslexia") | `tracks.boundary`; `BRAND.md` pillar 6 |
| 9 | Frame 04 and direction C bake HUD text into the render | Baked text is not selectable, not translatable, not accessible, and drifts from the content file | `DESIGN.md` §18 "Hard-code copy" |
| 10 | Frame 05 "the page remains visible" through the lens | Implies see-through optics. The content file does not say that | Open decision 6 |
| 11 | Frame 06 "The complete product" | There is no product. The honest close is the roadmap: seven phases to a wearable prototype | `roadmap` |
| 12 | Six UHD renders plus a dual-object render | Weight. The whole deploy is 6.0 MB (`HANDOFF-NEXT.md` §1). Seven UHD frames with mobile crops would add 1.5–3 MB | §5 budgets below |
| 13 | "Use the ASUS image for lighting and composition" | Still derives from the reference the Head Designer said not to copy. Drop it as an input entirely | Head Designer note |
| 14 | Built for "the existing Next.js / React Three Fiber experience" | That experience is archived. The live page is CSS modules + anime.js played stages | `DESIGN.md` §2, §10 |

## 3. Tensions, each with a default

| Tension | Options | Default | Reason |
|---|---|---|---|
| Medium for the glasses | (a) rendered images, (b) code-drawn line art, (c) hybrid | **(b) in mockup A; (c) in mockup B.** Ship (b) unless the Head Designer waives `DESIGN.md` §11 | Line art is what "documented, not decorated" means on this site, and dashed strokes already mean "planned" |
| Book: hero ground or a chapter | Ground of the whole story / hero only / one chapter | **It opens and closes the story.** Ground of the hero (stage 0), returns as the wearer's view (stage 5), absent in stages 1–4 and 6 | Keeps the book and the moving words without fighting the black object stages |
| Warm paper vs the black surface | Paper ground then a seam / paper inside a framed plate / the book as an object on black | **The book is an object on `#000`, neutral-graded, never a warm ground.** The page keeps its one dark-to-light seam after the story | `DESIGN.md` §9 allows one seam; a paper→black seam would be a second |
| A second accent (HUD green) | Sanctioned exception like SIDEKICK's palette / white word | **White word (`--r2-ink`), the fixation point is the one red mark.** No green | See critique 5. SIDEKICK's exception is a legend with labels; a green word is decoration |
| How "concept" is labelled | Eyebrow / badge / per-figure note / status word | **Three places, no badge:** hero foot (`boundaryShort` + "Planning"), a persistent note under the tracker, and stage 2's caption | Eyebrows are an anti-pattern; the current page already uses a tracker note ("Diagram, not a render") |
| Existing light-path pin | Keep as a second pin / fold in | **Fold in.** Its six stations become the tags of stage 3 | Two pins on one page doubles the scroll; the six functions are exactly "inside the system" |
| Existing scan-path chapter and `shades-fixate` clip | Keep / fold in | **Fold into the hero.** The clip (672 KB in `public/cine/`) is not used by either mockup | The hero now is the scan path collapsing to one point |
| Existing reader demo | Keep | **Keep unchanged, directly after the pin** | It is the one thing on the page that is real and runs |

## 4. The page story

### 4.1 Page order (both directions)

| # | Section | Tone | Source |
|---|---|---|---|
| 1 | **Concept pin**: hero + six stages (7 stages, one figure) | dark `#000` | new |
| 2 | Reader demo ("Set the pace. Press Read.") | dark | `_shades/Reader.tsx`, imported as is |
| — | the one seam | | |
| 3 | Highlights, tracks + boundary, first-build scope, roadmap | light | as on the live page |
| 4 | Join (five seats), footer | light | `_chrome` |

### 4.2 Pattern numbers

| Property | Value |
|---|---|
| Stage pick | `useScrollSteps(ref, { count: 7, lead: 0, playShare: 0.72 })` |
| Playback | `useStagePlayback(active, 7, 1100, paint)`; never scrubbed |
| Pin height | `calc(100svh + 7 * 50svh)` |
| Sticky box | `top: var(--r2-sticky-top)`; `height: calc(100svh - var(--r2-nav-h))`; `overflow: hidden` |
| Grid | rows `auto minmax(0, 1fr) auto`: caption band · figure · tracker; all captions in one cell |
| Type in the pin | BRAIN's clamps: `h1` `clamp(34px, min(10vw, 11svh), 80px)`, `h2` `clamp(28px, min(8vw, 8svh), 56px)`, line `clamp(17px, min(4.6vw, 3.2svh), 21px)` weight 600 `--r2-ink-2` |
| Caption swap | out 160 ms, in 240 ms after 160 ms, 12px y |
| Tracker | six buttons (hero has none, as on BRAIN): Idea · Form · System · Optics · View · Glasses; markers only at ≤ 734px; plus one 44px pause button |
| Note under tracker | one 12/16 line in `--r2-ink-2` (§7) |
| Gate | pin only under `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)` |
| Stills | seven stacked stills in normal flow, server-rendered, same copy |

### 4.3 The persistent element

**The fixation point never leaves the figure.** One red dot (`--r2-trigger`), with the held word under it.
It is on screen in all seven stages, the way BRAIN's 72 dots survive every lesson. The book, the drawing,
the object, the lens and the view are all arranged around it. That is the concept: one word, one point.

### 4.4 Hero (stage 0): the theory of reading

Plays once on entry as a timed sequence (not scroll), then rests.

| Beat | Time | What the figure shows | Source of the facts |
|---|---|---|---|
| Page | 0–1.2 s | An open book. Lines of text. Words brighten left to right along one line | `problem.line`, `reader.words` as the page text |
| Jumps | 1.2–2.8 s | Fixation dots land on words, joined by jumps, one jump back. Dots sized by illustrative dwell | reuse the `SEQ` and geometry of `_shades/Scanpath.tsx`; `research/04` obs 4 |
| One point | 2.8–4.0 s | Every dot converges on one point; the line's words leave the page one by one and appear there | `method.figureLabel` |
| Rest | after | The word at the point keeps advancing through `reader.words` at `reader.wpm.min` (100 wpm); on the page, the matching word brightens. Pause button stops it | "book background with words moving through it" |

Rules: the rest loop runs on a `setTimeout` chain like `Reader` (0 rAF), only while on screen and the tab is
visible; 100 wpm keeps it under three changes a second; the pivot letter is bold, not red (`rsvp.ts`
`splitWord`); the figure carries `problem.figureNote` ("Illustrative, not recorded data") while the dots
are visible; no printed fixation or saccade numbers (they are not in the content file).

### 4.5 The seven stages

Captions are **drafts**. Each line is one sentence, ≤ 16 words, built only from `_content/shades.ts`. They go
through `brand-voice-strategist` then `brand-guardian` before any mockup prints them (§8).

| # | Tracker | Heading (draft) | Line (draft) | Words | Fact source |
|---|---|---|---|---|---|
| 0 | — | Read without the chase. (`h1`) | One word at a time, at one fixed point, at the pace you set. | 14 | `hero` |
| 1 | Idea | Start from one point. | The glasses are drawn around one fixed point, where each word will appear. | 13 | `method.lead` |
| 2 | Form | A design study. | SHADES is in planning, and its parts are not chosen yet. | 11 | `status`, `lightPath.figureLabel` |
| 3 | System | Six stages, from text to eye. | In the first build, an external controller handles compute and power. | 11 | `lightPath.lead`, `scope.in` |
| 4 | Optics | One word. One point. | A small display shows one word, and optics carry it to one eye. | 13 | `lightPath.stages`, `highlights` |
| 5 | View | The words move. Your eyes can stay. | Each word arrives where you already look, at the pace you set. | 12 | `method.appleLead`, `lightPath.stages[5]` |
| 6 | Glasses | Seven phases. | The roadmap runs from basic FPGA operation to a wearable prototype. | 11 | `roadmap` |

| # | Figure shows | Transition FROM the previous stage (shared geometry) | Asset |
|---|---|---|---|
| 0 | The book, the scan path, then one held word at the point | Entry sequence (§4.4) | book (A: live text; B: plate P1) |
| 1 | The idea drawing: front elevation of the frame, with faint side and top views and construction lines | **The point becomes the lens.** The book drops to construction opacity; the right lens outline draws on around the held word, then the rest of the frame | A: frame line art; B: sheet G2 |
| 2 | The frame as an object, three-quarter view | **The drawing becomes the object.** The front elevation turns to three-quarter (the `flat` un-projection used by `PhoneArtwork.rigTransform`); side and top views fade; lines rise to full weight | A: same line art; B: study G1 |
| 3 | The frame opened: front, two lenses, two temples. A dashed chain runs text → timing → control → display → optics → eye with six one-word tags; a dashed line leaves the right temple to a dashed box tagged `controller` | **The object opens.** Whole parts translate apart along the view axes; nothing is redrawn | A: same line art; B: G1 dimmed + SVG overlay |
| 4 | One lens, close. A dashed display region, the word, the point | **The camera goes to the lens.** The rig scales and translates to the right lens; other parts dim to 0.16 | A: same line art; B: macro G3 |
| 5 | The wearer's view: the lens rim is now the edge of the figure; the book is behind; the word is held | **The lens becomes the view.** The rim keeps scaling until it frames the figure; the hero's book fades back in behind; the point does not move on screen | book again (A: live text; B: P1) |
| 6 | The whole frame again, closed, three-quarter, the word small in the right lens | **The view pulls back to the glasses.** Reverse of 4–5 to the stage 2 pose; the book fades out | A: same line art; B: G1 again |

In-figure tags follow BRAIN: single lowercase words, 12/16, `--r2-ink-2`, fading in after the pose lands
(`text`, `timing`, `control`, `display`, `optics`, `eye`, `controller`, `one point`). Stage 3 places only
`display` and `optics` near the lens and `eye` behind it; `text`, `timing` and `control` sit along the chain
off the frame, because the content file does not say where they live.

## 5. Two mockup directions

Both use the same page order, the same seven captions, the same frame silhouette (§6.1) and the same pin
numbers (§4.2). They differ in medium, in how the book exists, and in which rules they need waived.

| | **A — "Line"** | **B — "Plate"** |
|---|---|---|
| One-line idea | One drawing, seven poses: the whole story is code-drawn line art and live type on black | A studio sequence: a photographed book and a matte design-study model, with the site drawing words and labels on top |
| Feel | A set of drawings that come alive; closest to SIDEKICK and the home phone | An Apple product film made of stills; closest to Sol's six frames |
| Rules it needs waived | None | `DESIGN.md` §11 "photographic renders" and "one artwork per pin; nothing is swapped" |
| Recommended | **Yes, as the default to ship** | Build it so the Head Designer can compare; ship only with the waiver |

### 5.1 Direction A — "Line"

| Topic | Spec |
|---|---|
| Hero | A two-page book spread **typeset in code**: page outlines, gutter curve, 9–11 lines of real text per page in Atkinson Hyperlegible Next, `--r2-ink` at 0.28 opacity, tilted with one CSS `transform` (no 3D library). Words brighten to 1.0 as they are "read". Scan-path dots and arcs in ink; the point in red |
| Stages 1–6 | One inline SVG, `viewBox` about 960×540, parts as `<g data-part>`: `front`, `lensL`, `lensR`, `templeL`, `templeR`, `chain`, `views` (side + top), `region` (display), `book`. Poses in a `poses.ts` table; `paint(pos)` lerps two poses and writes `transform` / `opacity` per part plus one rig transform, as `HeroStages.tsx` does |
| Medium | 100% code-drawn. **No generated image.** Book text is DOM / SVG text from the content file |
| Line language | `stroke: currentColor`, 1.25, round caps, `vector-effect: non-scaling-stroke`. **The frame is dashed throughout** (`DESIGN.md` §11: dashed = planned). Only the word and the point are solid, because the demo is real. Hierarchy by stroke opacity 0.07–1. Flat black occlusion fills where a near part hides a far one. No gradient, no blur (this removes the lens glow and blur filter listed under "Known deviations") |
| Reused | `_shades/Reader.tsx`, `_shades/rsvp.ts`, `_shades/ShadesRoot.tsx` (+ `SpacingToggle`), `Seats`, `SeatRing`, `fontReadingText`, the `SEQ` idea from `Scanpath.tsx`; highlights, tracks, scope, roadmap markup from the live page. Not used: `LightPin`, `LightPath`, `Glasses.tsx`, `CineClip` |
| Palette | `#000`, `--r2-ink`, `--r2-ink-2`, one `--r2-trigger` dot. Nothing else |
| Type | Geist display / text per the scale; Atkinson Hyperlegible Next for the book text and the held word; no Geist Mono in the pin |
| Motion | 1100 ms per stage, cubic in-out; lens outline draws on with `stroke-dashoffset` inside the stage 0→1 tween; tags fade in 320 ms after a 620 ms delay; hero entry 4.0 s once; rest loop at 100 wpm with pause |
| Mobile (≤ 734px) | A narrow camera table (as `NARROW_CAMERA` in `projects/_hero/poses.ts`): stages 2, 3, 6 frame the wearer's-right half of the glasses at larger scale; the book shows the right-hand page only, 6 lines; tags drop to 11px; tracker shows markers only |
| Assets, bytes | Inline SVG ≈ 10–14 KB (move to `public/shades/frame.svg` + `<use>` if it passes 16 KB); CSS + JS ≈ 25 KB; images 0. Net page weight goes **down** by 672 KB if the clip is retired |
| Risks | (1) A code-drawn book may not feel like "the book background" the Head Designer remembers. (2) Dashed line art at phone size can look thin: test at 390×844. (3) The three-quarter turn of a hand-drawn frame needs real geometry (define the frame in 3 views, project in `poses.ts`), not a tween between two unrelated paths |
| Route / files | `app/(apple)/projects/shades-a/`: `page.tsx` (`robots: { index: false }`), `ConceptStages.tsx`, `FrameArtwork.tsx`, `BookSpread.tsx`, `poses.ts`, `concept.module.css` |

### 5.2 Direction B — "Plate"

| Topic | Spec |
|---|---|
| Hero | The book plate **P1** fills the sticky box edge to edge. It is a real-looking open book on a black table, neutral grade, falling to `#000` at every edge inside the photograph, so there is no visible rectangle. One live line of text crosses the plate's focal band; scan-path dots hop along it; the words then arrive one at a time at the point |
| Stage 1 | **G2**, the idea sheet: a graphite drawing of the same frame at the same camera as G1. Shown inverted (`filter: invert(1)` + `mix-blend-mode: screen`) so it is light lines on `#000`, not a white card |
| Stage 2 | **G1**, the design-study model: one matte grey material, clear lens blanks, on `#000`. Registered dissolve from G2, so the drawing becomes the object |
| Stage 3 | G1 dims to 0.35. An SVG overlay (the same chain, tags and dashed controller box as A) is drawn over it. **No exploded render.** |
| Stage 4 | G1 scales ≤ 1.6× about the right lens, then dissolves to **G3**, a macro of one empty lens. The site draws the dashed region, the word and the point |
| Stage 5 | G3 scales up and dissolves to **P1** (near crop). The word is held; the site draws the lens rim as one hairline |
| Stage 6 | P1 dissolves to G1, scaling 1.6× → 1 |
| Medium | 4 generated images (P1, G1, G2, G3) as `<picture>` AVIF with a JPEG fallback; every word, dot, tag and line is DOM / SVG on top. One plate layer per image, stacked in the figure; `paint(pos)` writes `opacity` and `transform` only |
| Reused | Same list as A, plus A's `chain` overlay geometry if A is built first |
| Palette | `#000`; images are colour-neutral (no warm paper, no tint); ink, ink-2, one red dot. No green |
| Type | Same as A. Captions sit over the top 30% of each plate, which the prompts keep empty or dark |
| Motion | 1100 ms per stage; dissolves take the middle 400 ms of the tween so a rest position is always one plate; no parallax, no Ken Burns drift at rest |
| Mobile | Separate 4:5 compositions (recomposed, not centre-cropped): object ≤ 80% of width, inside the middle 55% of height |
| Assets, bytes (budget) | P1 16:9 ≤ 150 KB + 4:5 ≤ 100 KB; G1 ≤ 90 + 60; G2 ≤ 70 + 50; G3 ≤ 80 + 55; AVIF total ≤ 655 KB; JPEG fallbacks (16:9 only) ≤ 400 KB. **Cap: 1.05 MB**, about +18% on a 6.0 MB deploy; +6% net if the 672 KB clip is retired. Encode by hand: static export does not optimise images |
| Risks | (1) Generated hardware imagery on a site whose rule is "drawn from the real files" fails the signature test unless labelled on every stage. (2) Identity drift between G1, G2, G3. (3) The dissolves break "nothing is swapped between stages". (4) No image exists yet: the mockup is blocked on generation and on who generates. (5) A plate cannot be restyled later the way line art can |
| Placeholder plan | Until images exist, build B with stand-ins: the archived `BookBG_Clear.png` re-encoded to AVIF ≤ 150 KB for P1, and A's line art in the G1–G3 slots. Mark the route's tracker note "Stand-in images". Do not ship the archived book image: it carries readable invented article text with typos and its origin is undocumented |
| Route / files | `app/(apple)/projects/shades-b/`: `page.tsx` (`robots: { index: false }`), `PlateStages.tsx`, `Overlay.tsx`, `plates.ts` (paths, anchor coordinates in %), `plate.module.css`; images in `public/shades-b/` |

Shared by both: captions in a new `app/(apple)/_content/shades-concept.ts` (written once, before the mockup
agents start; neither agent edits it). Neither route is added to `PAGES` in `_chrome/routes.ts`. Neither
agent edits `_system/`, `_chrome/`, `projects/_hero/`, `_shades/` or anything on the locked lists.

## 6. Image-generation prompt system (Direction B only)

Direction A needs no generated image. B needs four shipped images and one reference sheet that is never
shipped. The exploded frame (Sol 03) and the "complete product" frame (Sol 06) are not generated: stage 3
is a site overlay and stage 6 reuses G1.

**Model capabilities assumed** (any model that has them): text-to-image at ≥ 2048 px on the long side;
reference-image conditioning with 1–4 references; a chosen aspect ratio (16:9 and 4:5); a negative prompt
or an "avoid" clause; an edit / inpaint pass for small fixes. Seed locking helps but is not required.

**Order.** G1 → approve → T0 (reference sheet from G1) → G2 and G3 (references: G1 first, T0 second) → P1
(no reference) → the 4:5 version of each (reference: its own approved 16:9). Reject and regenerate; do not
hand-paint text or logos out of a failed frame.

### 6.1 Identity block — paste into G1, T0, G2, G3 unchanged

```
SUBJECT — the DIGITAL Shades study frame, an original eyeglasses design:
Full-rim frame. Two softly squared lenses, each about 1.25 times wider than tall, corner radius about one
fifth of the lens height. The top edges of both rims and the bridge form one straight, continuous brow line.
Keyhole bridge; no separate nose-pad arms. Rim thickness even all the way round.
Temples are straight, flat-sided bars, about one and a half times the depth of ordinary eyewear temples from
the hinge to mid-length, then tapering to a plain rounded tip. One simple barrel hinge per side.
One thin, plain cable leaves the tip of the wearer's right temple and runs out of the frame.
Nothing else is attached to, cut into, printed on or lit inside the frame or the lenses.
```

Never, in any image: cameras, sensor windows, microphones, speakers, buttons, touch pads, LEDs, light bars,
charging pins, circuit boards, chips, batteries, a controller box, a visor or shield lens, wraparound or
angular gaming shapes, any ASUS / ROG geometry, any word, number, logo or display content.

### 6.2 Style blocks

```
STYLE-STUDY (G1, T0, G3):
A design-study model photographed in a studio. Every solid surface is the same matte mid-grey model-board
finish (about #86868b), no gloss, no metal, no texture, no visible material change. The lenses are clear,
uncoated blanks with only a faint edge. Background is pure flat black #000000 reaching every edge of the
image. The object floats: no floor, no horizon, no reflection, no pool of shadow. One large soft key light
from the upper left and a weak fill. No rim glow, no bloom, no lens flare, no haze, no light rays, no
gradient in the background. The whole object is in focus. Colour-neutral, no tint.

STYLE-SHEET (G2):
A technical pencil drawing on smooth white paper, scanned flat and square. Thin, even graphite lines. A few
lighter construction lines. No shading, no hatching, no colour, no handwriting, no dimensions, no numbers,
no arrows, no title block, no border, no paper grain, no desk, no pencil.

STYLE-PLATE (P1):
A photograph of an open hardback book lying on a matte black table, lit by one soft lamp from above. The
pages are the brightest thing in the image. The table and everything around the book fall to pure black
#000000 before all four edges of the image. Paper is neutral white, not cream; the grade is colour-neutral.
The pages carry body text only, as fine grey lines of soft unreadable type: no legible word, no heading, no
page number, no picture, no drop cap. Nothing else is in the scene.
```

```
NEGATIVE (all images):
text, letters, numbers, logo, brand mark, watermark, signature, UI, HUD, hologram, glow, neon, green light,
LED, light strip, lens display content, camera, sensor, microphone holes, speaker grille, button, touch pad,
charging pins, circuit board, chip, battery, controller, dock, visor, goggles, wraparound shield, angular
gaming styling, vents, gradient background, vignette glow, fog, bokeh lights, reflective floor, hands, face,
person, second pair of glasses
```

### 6.3 Per-asset prompts

Text-safe rule for every 16:9: the top 30% and the bottom 12% of the frame hold no key detail (black, or for
P1 the dark far edge of the table). Masters: 2560×1440 and 1440×1800.

**G1 — the form (stages 2, 3, 6).** References: none.

```
[IDENTITY BLOCK] [STYLE-STUDY]
CAMERA: three-quarter front view from slightly above eye level, about 30 degrees to the wearer's right side,
50 mm lens look, no perspective distortion. Temples open. The wearer's right lens is the lens nearest the
camera.
COMPOSITION 16:9: the whole frame is visible and centred, about 55% of the image width, sitting in the
middle band of the image between 30% and 88% of the height. The cable leaves toward the lower right corner.
COMPOSITION 4:5: same view; the frame is about 80% of the image width, centred, inside the middle 55% of the
height.
[NEGATIVE]
```

Accept if: the silhouette matches the identity block line by line; one material; background samples `#000`
at all four corners and both text-safe bands; no shadow pool; nothing on the temples; zoom to 200% finds no
mark, letter or seam that reads as a part.

**T0 — reference sheet (never shipped).** References: G1.

```
[IDENTITY BLOCK] [STYLE-STUDY]
The exact object in reference image 1, unchanged, shown three times side by side at the same scale:
straight front view, straight side view of the wearer's right side, straight top view. Orthographic, no
perspective. Even spacing. 16:9.
[NEGATIVE]
```

Accept if: lens proportion, brow line, bridge, temple depth and the single cable agree with G1 in all three
views.

**G2 — the idea sheet (stage 1; Sol frame 01).** References: G1, then T0.

```
[IDENTITY BLOCK] [STYLE-SHEET]
Draw the exact object in reference image 1 as a line drawing, from the same camera position and at the same
size and position in the frame as reference image 1, so the two images overlay. Lighter and smaller, to the
right of it, add its straight side view and straight top view from reference image 2. One small cross marks
a point at the centre of the wearer's right lens.
COMPOSITION: as reference image 1 (16:9, then 4:5).
[NEGATIVE]
```

Accept if: laid over G1 at 50% opacity, the outlines agree to within a line width; white paper is clean
(it becomes black when inverted); no handwriting, number or arrow; one cross only.

**G3 — the optics (stage 4; Sol frame 04).** References: G1, then T0.

```
[IDENTITY BLOCK] [STYLE-STUDY]
CAMERA: macro view of the wearer's right lens of the exact object in reference image 1, seen from the front
and slightly to the wearer's right, 100 mm macro look. The lens is empty and clear; nothing is shown in it.
COMPOSITION 16:9: the lens fills about 60% of the image height, centred. Part of the rim, the hinge and the
first part of the temple are visible. The middle of the lens is plain and dark: it is where the site draws
a word.
COMPOSITION 4:5: the lens fills about 85% of the image width, centred.
[NEGATIVE]
```

Accept if: the lens is empty (no word, icon, grid, reflection of a screen, or glow); rim and hinge match
G1; the centre 40% × 25% of the lens is flat enough for white 28px text at ≥ 7:1 contrast.

**P1 — the book plate (hero and stage 5; Sol frame 05).** References: none. No glasses in the image.

```
[STYLE-PLATE]
CAMERA: the reader's own seated view, looking down at the book at about 35 degrees, 35 mm lens look. The
book is square to the camera, spine vertical. Shallow focus: sharpest on a horizontal band across the middle
of the right-hand page.
COMPOSITION 16:9: both pages visible; the book spans about 80% of the image width and sits in the lower 65%
of the image. The top 30% is the far edge of the table, pure black.
COMPOSITION 4:5: the right-hand page and the gutter only, filling the lower 70% of the image.
[NEGATIVE], plus: glasses, pen, cup, bookmark, lamp, window, second book, newspaper
```

Accept if: zoom to 200% finds **no readable word**; no heading, number or picture; paper is neutral (R, G
and B within 4% of each other on the page); all four edges and the top band sample `#000`; white 21px text
on the focal band reaches ≥ 4.5:1 after the site's flat darkening (one `opacity` value, no radial scrim).

## 7. Guard-rails checklist (both mockups must pass)

**Concept labelling**

- [ ] Hero foot prints `SHADES.boundaryShort` and `SHADES.status.text` ("Planning").
- [ ] A note stays under the tracker in every stage. A: "Concept drawing. Parts are not chosen yet." B: "Design-study images. Not photographs of a built device." (drafts; copy workflow).
- [ ] Stage 0 shows `problem.figureNote` while the scan path is visible; stage 5 is noted "Illustrative view".
- [ ] A: the frame is dashed. B: the model is one matte material. Neither reads as a finished product.

**Claims**

- [ ] No sentence says or implies built, tested, working, shipped, available, worn or measured.
- [ ] No efficacy or medical wording: not "assistive", "helps", "improves", "easier", "faster", "treats", "for dyslexia". The research line is printed verbatim from `tracks.items` only.
- [ ] No RSVP benefit claim and no reading-speed or comprehension number (`research/04` obs 8–11 are cautions, not copy).
- [ ] Regressions are described ("sometimes jump back"), never called wasted or a flaw.
- [ ] Person-first wording as in the content file ("readers with dyslexia").

**Facts**

- [ ] Every printed string is in `_content/shades.ts` or `_content/shades-concept.ts`; none in a component.
- [ ] No part number, material, weight, size, field of view, brightness, battery or price.
- [ ] No hardware that the content file does not name: no camera, sensor, eye tracker, wireless, board.
- [ ] Stage 5's caption does not say the page is seen through the lens.
- [ ] No personal name except the existing mentor line, where the live page already prints it.
- [ ] No `[confirm]` tag, no eyebrow, no section number, no lab wording in UI or metadata.

**Original design and system**

- [ ] The frame matches §6.1; nothing traces ASUS, ROG, or any reference product.
- [ ] One `h1`, one `<main id="r2-main">`, one sticky bar, one filled CTA.
- [ ] Colours are tokens; one red mark; no green; no gradient, glow, blur, shadow, glass, card.
- [ ] No text baked into any image.
- [ ] Reduced motion and no-JS show seven stills with the same copy; the hero word is static.
- [ ] The rest loop has a pause button, runs only on screen, and leaves 0 rAF at rest.
- [ ] SIDEKICK and BRAIN render identically at 1600×790 and 390×844 after the work.

## 8. Open decisions for the Head Designer

| # | Decision | Default |
|---|---|---|
| 1 | May SHADES use generated images at all (waiving `DESIGN.md` §11), and who generates them with which tool? | Build A fully; build B with stand-ins; generate P1, G1–G3 only after a yes |
| 2 | Is "the book background" the photograph, or any book page with words moving through it? | A typesets it in code; B uses a new plate. Do not reuse the archived image |
| 3 | A second accent (HUD green `#7FE6A3`) for the held word? | No. White word, red point |
| 4 | Concept label wording and placement (§7) | Hero foot + tracker note + stage 2 caption; no badge |
| 5 | Retire the separate light-path pin, the scan-path chapter and the `shades-fixate` clip (folded into the new pin)? | Yes, in the mockups; the live page is untouched until one is chosen |
| 6 | Stage 5 shows the page behind the word. Is the display see-through? The content file does not say | Keep the stage, noted "Illustrative view", with a caption that makes no see-through claim; ask the SHADES team |

## 9. Work breakdown for the next orchestrator

| Step | Agent | Model | Does | Owns (only) | Verify |
|---|---|---|---|---|---|
| 0 | orchestrator | — | Put §8 to the Head Designer with AskUserQuestion. Ask about the commit first (`HANDOFF-NEXT.md` §1) | — | answers recorded in `mockups/DECISIONS.md` |
| 1 | `brand-voice-strategist`, then `brand-guardian` | opus | Write the seven headings, lines, tracker labels, tags and the two notes from §4.5 and §7 into `_content/shades-concept.ts`; review | `app/(apple)/_content/shades-concept.ts` | every line ≤ 16 words; guardian verdict "pass"; `npx tsc --noEmit` |
| 2a | general-purpose | opus | Build Direction A (§5.1) | `app/(apple)/projects/shades-a/**` | recipe below |
| 2b | general-purpose | opus | Build Direction B (§5.2) with stand-ins, or with images if decision 1 is yes | `app/(apple)/projects/shades-b/**`, `public/shades-b/**` | recipe below, plus image bytes ≤ the §5.2 cap |
| 2c | per decision 1 | — | Generate G1 → T0 → G2, G3 → P1 → 4:5 versions (§6); apply each acceptance check; encode to AVIF + JPEG | `design-lab/shades-concept/generated/**` | every "Accept if" line, recorded per image |
| 3 | Explore | haiku | Read-only sweep of both routes against the §7 checklist; report file:line for each miss | none | list returned; orchestrator spot-checks |
| 4 | orchestrator | — | Screenshot all seven stages of both routes at 1600×790 and 390×844 into `mockups/a/` and `mockups/b/`; post both URLs | `design-lab/shades-concept/mockups/**` | files exist; locked pages compared |
| 5 | optional reviewer | fable, high effort | Read-only critique of both, if the Head Designer asks | none | — |

2a and 2b run in parallel after step 1. Every Agent prompt carries the line
`Output style: follow ~/.claude/rules/common/subagent-output.md (i-have-adhd)` and the sentence "BRAIN and
SIDEKICK are locked; do not edit `_system/`, `_chrome/`, `projects/_hero/`, `_shades/` or `_content/shades.ts`."

**Verification recipe** (full text: `design-lab/HANDOFF-NEXT.md` §4). Playwright with the installed headless
Chromium against `http://localhost:3100`; never run `next dev` or `next build` in the work tree.

1. Status 200 and 0 console errors on `/projects/shades-a/` and `/projects/shades-b/`.
2. At 1600×790, 1280×720, 768×1024, 390×844: `scrollWidth === innerWidth`; one `<main>`, one `h1`; no heading under the 52px bar; tap targets ≥ 44px.
3. For each of the 7 stages: `window.scrollTo` the rest point, wait 2 s, screenshot; no caption overlap, figure not clipped.
4. One run with `reducedMotion: 'reduce'` and one with `javaScriptEnabled: false`: seven stills, same copy, no moving word.
5. rAF count at rest is 0 with the hero paused and with the pin off screen.
6. SIDEKICK and BRAIN at 1600×790 and 390×844 look the same as `references/04` and `05`.
7. `npx tsc --noEmit` and `npx next lint` clean.

## 10. Research notes: how they were used

| File | Used for | Read with care |
|---|---|---|
| `research/01-apple-wearable-pages.md` | Minimal hero copy; headline → figure → one line; exploded view as component isolation; reduced-motion parity | Obs 2 (scroll-scrubbed video) is the pattern this site bans; obs 6 (real photography) is not available to a concept |
| `research/02-headworn-and-reading-devices.md` | Neutral palette with one accent; everyday silhouette; no HUD chrome, glow or floating overlays | "Lifestyle photography" and materials language cannot be used: no people, no stock, no material spec |
| `research/03-honest-concept-presentation.md` | Line drawings, orthographic views and explicit status labels signal "idea"; photoreal renders signal "shipping" | Obs 14 has no source; the legal points are context, not advice |
| `research/04-rsvp-reading-visualisation.md` | Fixations as circles sized by duration, saccades as lines, one regression, pivot letter left of centre | Obs 8–11 are documented limits of RSVP: a reason to make no benefit claim, never page copy. The red pivot letter convention is not used; red is the point, not text |

All four were written by Haiku subagents from web searches; the URLs were not re-checked here.
