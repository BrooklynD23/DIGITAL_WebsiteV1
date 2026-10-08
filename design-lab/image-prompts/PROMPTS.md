# Image prompts — DIGITAL @ Cal Poly Pomona

Engineered prompts for every image the site does not have. Written 2026-10-08 from `DESIGN.md` (Apple system), `docs/design/sidekick.DESIGN.md`, `docs/design/brain.DESIGN.md`, `design-lab/shades-concept/DECISIONS.md` and `PLAN.md` §6. Nothing here is generated yet. "Saved to" paths are proposals; none exists on disk.

**Read first.** `DESIGN.md` §11 says: "Never: gradients, glow, bloom, drop shadows, glass, photographic renders, stock imagery." Every site-wide prompt below is line art, dot figure or pencil drawing for that reason. The only photographic prompts are the SHADES pack, under the book-photograph exception in `DECISIONS.md` (Decision 2), and that pack is optional.

## 1. Index

| ID | Where it goes (route → file) | Size / aspect / format / budget | Status | Priority |
|---|---|---|---|---|
| ICON-01 | every route → `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico` | 1024×1024 master, 1:1 → PNG 512 (≤ 15 KB), PNG 180 (≤ 6 KB), ICO 48/32/16 (≤ 15 KB) | missing (`/favicon.ico` 404s) | P0 |
| OG-01 | every route's share card → `app/opengraph-image.png`, `app/twitter-image.png` | 2400×1260 master, 1.91:1 → PNG 1200×630 (≤ 300 KB) | missing (no `og:image`) | P0 |
| SEAT-01 | `/team/` seat rows → `public/team/seat.svg` (or `seat.webp`) | 800×1000 master, 4:5 → traced SVG ≤ 4 KB or WebP ≤ 15 KB | placeholder (seats render as text only) | P2 |
| COMM-01 | `/community/` hero → `public/community/build-night.avif` | 2400×1350 master, 16:9 → AVIF ≤ 120 KB, plus 1440×1800 4:5 ≤ 80 KB | optional (no imagery in the data) | P2 |
| BOOK-01 | `/projects/shades*/` book ground → `public/shades/book-16x9.avif`, `book-4x5.avif` | 2560×1440 and 1440×1800 → AVIF ≤ 250 KB, ≤ 120 KB | placeholder (archived photo has typos) | P1 |
| SH-REF | never shipped (identity sheet for the SHADES pack) | 2560×1440, PNG, kept in `design-lab/` | optional | P3 |
| SH-IDEA | SHADES pin, stage Idea → `public/shades-a/`, `public/shades-b/` | 2560×1440 + 1440×1800 → A ≤ 90 / 60 KB, B ≤ 150 / 100 KB | optional | P3 |
| SH-FORM | SHADES pin, stage Form → same folders | same | optional | P3 |
| SH-SYSTEM | SHADES pin, stage System → same folders | same | optional | P3 |
| SH-OPTICS | SHADES pin, stage Optics → same folders | same | optional | P3 |
| SH-VIEW | SHADES pin, stage View → same folders | same | optional | P3 |
| SH-GLASSES | SHADES pin, stage Glasses → same folders | same | optional | P3 |

**Needs a human-supplied asset, not generation**

| Gap | Evidence | What to supply |
|---|---|---|
| Vector logo | `public/assets/landing/DIGITAL_V1_Logo1*.png` are opaque RGB rasters (449–732 KB, no alpha) and no file in `app/` or `lib/` reads `siteConfig.assets` | The three-shard mark as SVG. ICON-01 approach 1 is only a stopgap |
| SIDEKICK photo board | `TODO.md` line 117; `sidekick.DESIGN.md` §10: the README photo board (XC7Z020 CLG484, RTL8211F) has no design file | The `.kicad_pcb`, then rerun `design-lab/scripts/sidekick-mainboard.mjs`. A generated board would invent parts |
| Team portraits | `TODO.md` line 133; `_content/team.ts`: "no names, no photos" | Real photos with consent, once names are confirmed. SEAT-01 covers the gap until then |
| Community / build-night photos | `_content/community.ts`: "No posts, videos or events exist in the data" | Real bench photos from members. COMM-01 is a drawing, not a stand-in photo |
| Cal Poly Pomona marks | project rule | Only the university's own files, under its brand policy. Never generated |

**Checked and clean:** every image path referenced in `app/` and `lib/` exists on disk (3 logo PNGs, 19 SIDEKICK SVGs, the `public/cine/` clip and posters). About, Contact, Get involved, legal and error pages have no image slot and need none.

## 2. House style block

Paste-ready. Each prompt below already contains it; it is repeated here for new prompts.

```
HOUSE STYLE: a documented engineering drawing, not a decorated illustration. Flat pure black ground #000000 reaching all four edges. One ink colour, warm white #f5f5f7, with a quieter grey #a1a1a6 for secondary lines. Thin even outlines with round caps and round joins. Depth is shown only by line opacity, from very faint construction lines to full-strength lines on the part in focus. Dashed lines mean planned or unresolved, solid lines mean built. Fills are flat and rare. At most one small flat red mark, #d8412f, and only where this prompt asks for it. Calm, exact, generous empty space, one subject.
```

House negative prompt:

```
gradient, glow, bloom, neon, lens flare, light rays, drop shadow, soft shadow pool, glass effect, glossy reflection, reflective floor, vignette, fog, haze, bokeh lights, film grain, texture overlay, 3D bevel, stock-photo look, text, letters, numbers, captions, labels, logo, brand mark, university seal or mascot, watermark, signature, UI, HUD, hologram, people, faces, hands, body parts, any real product or brand design, extra colours, second red mark
```

Source of each value: ground `#000000`, ink `#f5f5f7`, ink-2 `#a1a1a6` (`DESIGN.md` §6, dark column); red `#d8412f` "is a mark, not a colour scheme" (§6); "Hierarchy is stroke opacity only", "Dashed strokes mean planned or unresolved; solid means built", "Never a gradient fill" (§11); copper `#c9965f` "is the board colour on any page that draws a board" (§12); model grey `#86868b` is `--r2-hairline-strong`.

---

## 3. Site-wide images

### ICON-01 — favicon and app icon

**Objective:** let a visitor find the DIGITAL tab among twenty others at 16px.

**Placement:** every route, browser tab, bookmark and home-screen icon (`app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`, picked up by the Next.js file convention). Nothing is drawn on top.

**Specs:** 1024×1024 master, 1:1. Subject inside the centre 70% (safe area for the rounded home-screen mask). Ground `#000000`, opaque (the Apple icon must not be transparent). Export PNG 512×512 ≤ 15 KB, PNG 180×180 ≤ 6 KB, ICO with 48 / 32 / 16 ≤ 15 KB.

**Approach 1 — the existing mark, redrawn clean (recommended).** Reference image: `public/assets/landing/DIGITAL_V1_Logo1_DarkMode.png`. This is the studio's own logo, so the prompt is a clean-up, not a new design.

```
Redraw the exact mark in the reference image as a clean flat vector-style icon. Do not redesign it: keep the three shapes, their angles, their sizes and the gaps between them exactly as in the reference. The mark is three separate flat quadrilateral shards arranged around an empty centre, like three blades of a pinwheel: one tall diamond at the upper left of centre, one wide slanted shard at the lower left, one notched slanted shard at the right.
COLOUR: shards in flat warm white #f5f5f7 on a flat pure black #000000 square that reaches all four edges. No other colour.
COMPOSITION: square 1:1. The mark is centred and fits inside the middle 70% of the square. Perfectly sharp straight edges and crisp corners. Nothing else in the image.
STYLE: flat two-colour logo artwork, like a vector file exported at high resolution. No texture, no lighting.
```

Negative prompt:

```
gradient, glow, bloom, neon, lens flare, light rays, drop shadow, soft shadow pool, glass effect, glossy reflection, reflective floor, vignette, fog, haze, bokeh lights, film grain, texture overlay, 3D bevel, stock-photo look, text, letters, numbers, captions, labels, logo, brand mark, university seal or mascot, watermark, signature, UI, HUD, hologram, people, faces, hands, body parts, any real product or brand design, extra colours, second red mark, added shapes, fourth shard, rounded corners, outline stroke, letters, wordmark, changed proportions
```

**Approach 2 — the open seat (dot figure).** Echoes the join section's "200px open-seat dot figure" with "the red anchor" (`DESIGN.md` §13.2).

```
HOUSE STYLE: a documented engineering drawing, not a decorated illustration. Flat pure black ground #000000 reaching all four edges. One ink colour, warm white #f5f5f7, with a quieter grey #a1a1a6 for secondary lines. Thin even outlines with round caps and round joins. Depth is shown only by line opacity, from very faint construction lines to full-strength lines on the part in focus. Dashed lines mean planned or unresolved, solid lines mean built. Fills are flat and rare. At most one small flat red mark, #d8412f, and only where this prompt asks for it. Calm, exact, generous empty space, one subject.
SUBJECT: an app icon made of dots. Eight small round dots sit evenly spaced on one invisible circle. Seven dots are flat warm white #f5f5f7. The eighth position, at the upper right, is the open seat: one flat red dot #d8412f of the same size. No lines join the dots.
COMPOSITION: square 1:1, pure black #000000 to every edge. The ring of dots is centred and fits inside the middle 62% of the square. Each dot is about one ninth of the ring's diameter, large enough to survive at 16 pixels.
MOOD: a table with one seat left for you.
```

Negative prompt:

```
gradient, glow, bloom, neon, lens flare, light rays, drop shadow, soft shadow pool, glass effect, glossy reflection, reflective floor, vignette, fog, haze, bokeh lights, film grain, texture overlay, 3D bevel, stock-photo look, text, letters, numbers, captions, labels, logo, brand mark, university seal or mascot, watermark, signature, UI, HUD, hologram, people, faces, hands, body parts, any real product or brand design, extra colours, second red mark, connecting lines, rings, orbit paths, more than one red dot, dots of different sizes
```

**Approach 3 — the wordmark initial.** This image is a logo, so it carries text. The exact string is one capital letter: `D`.

```
A flat two-colour app icon containing exactly one capital letter "D" and nothing else. The letter is set in a clean geometric sans-serif at semibold weight, with even stroke width and a round bowl, in flat warm white #f5f5f7 on a flat pure black #000000 square that reaches all four edges.
COMPOSITION: square 1:1. The letter is optically centred and its height is 56% of the square. Below the letter's lower right corner sits one small flat red square dot, #d8412f, about one tenth of the letter height, like a test point on a drawing.
STYLE: flat vector logo artwork, perfectly sharp edges, no texture, no lighting.
The only text in the image is the single letter D.
```

Negative prompt:

```
gradient, glow, bloom, neon, lens flare, light rays, drop shadow, soft shadow pool, glass effect, glossy reflection, reflective floor, vignette, fog, haze, bokeh lights, film grain, texture overlay, 3D bevel, stock-photo look, extra letters, words, numbers, captions, labels, logo, brand mark, university seal or mascot, watermark, signature, UI, HUD, hologram, people, faces, hands, body parts, any real product or brand design, extra colours, second red mark, serif letter, italic, outline letter, lowercase d
```

**Acceptance checklist**

- [ ] Reads at 16×16 (downscale and look) without turning into a grey blob.
- [ ] Two colours only (plus the one red dot in approaches 2 and 3); corners sample `#000000`.
- [ ] Approach 1: laid over the reference at 50% opacity, the shards agree.
- [ ] Nothing outside the centre 70%.
- [ ] No Cal Poly Pomona mark, no extra letters.

**Post-processing:** trace to SVG if possible (three polygons or nine circles are faster to hand-draw than to clean). Then:
`node -e "const s=require('sharp');s('icon-master.png').resize(512).png({palette:true}).toFile('app/icon.png');s('icon-master.png').resize(180).png({palette:true}).toFile('app/apple-icon.png')"`
ICO needs a separate tool, for example ImageMagick: `magick icon-master.png -define icon:auto-resize=48,32,16 app/favicon.ico`. No alt text (icons have none).

### OG-01 — social share image

**Objective:** make a link to DIGITAL in Discord, LinkedIn or iMessage look like a studio that builds real hardware.

**Placement:** `og:image` and `twitter:image` for every route (`app/opengraph-image.png`, `app/twitter-image.png`; `app/layout.tsx` already sets `twitter.card: 'summary_large_image'`). **The text is not generated.** After generation, a script typesets `DIGITAL` and the thesis "Make something worth putting your name on." in Geist 600 over the empty left side, so the words match the site and cannot be misspelled.

**Specs:** 2400×1260 master, 1.91:1, exported 1200×630 PNG ≤ 300 KB. Ground `#000000`, opaque. Safe area: the left 55% is empty black for the typeset words; keep every detail 60px (at 1200 wide) from each edge because some apps crop to a square from the centre.

**Approach 1 — line art: the board, opened.** Follows SIDEKICK: "copper line art on black" (`sidekick.DESIGN.md` §6).

```
HOUSE STYLE: a documented engineering drawing, not a decorated illustration. Flat pure black ground #000000 reaching all four edges. One ink colour, warm white #f5f5f7, with a quieter grey #a1a1a6 for secondary lines. Thin even outlines with round caps and round joins. Depth is shown only by line opacity, from very faint construction lines to full-strength lines on the part in focus. Dashed lines mean planned or unresolved, solid lines mean built. Fills are flat and rare. At most one small flat red mark, #d8412f, and only where this prompt asks for it. Calm, exact, generous empty space, one subject.
SUBJECT: an original, generic circuit board drawn as thin line art in isometric view, its layers lifted apart into a vertical stack of six thin outlined sheets, like an exploded technical drawing. For this image the line colour is copper #c9965f instead of white. The outer sheet outlines are full strength; the fine traces inside them are very faint. A few small rectangular part outlines float just above the top sheet. One of them is a flat red square mark, #d8412f, no larger than a part.
COMPOSITION: wide 1.91:1 image. The stack sits in the right 40% of the image, vertically centred, and stays clear of every edge. The left 55% is completely empty flat black, reserved for words added later.
CAMERA: true isometric, no perspective, no depth of field.
MOOD: taken apart on purpose, in order.
```

Negative prompt:

```
gradient, glow, bloom, neon, lens flare, light rays, drop shadow, soft shadow pool, glass effect, glossy reflection, reflective floor, vignette, fog, haze, bokeh lights, film grain, texture overlay, 3D bevel, stock-photo look, text, letters, numbers, captions, labels, logo, brand mark, university seal or mascot, watermark, signature, UI, HUD, hologram, people, faces, hands, body parts, any real product or brand design, extra colours, second red mark, solder glow, green circuit board, photorealistic render, chip names, part numbers, silkscreen text
```

**Approach 2 — dot figure: one seat open.** Follows BRAIN: "`#000` ground, `--r2-ink` (warm white) figure" and no "gradients, glow, glass, cards" (`brain.DESIGN.md` §5).

```
HOUSE STYLE: a documented engineering drawing, not a decorated illustration. Flat pure black ground #000000 reaching all four edges. One ink colour, warm white #f5f5f7, with a quieter grey #a1a1a6 for secondary lines. Thin even outlines with round caps and round joins. Depth is shown only by line opacity, from very faint construction lines to full-strength lines on the part in focus. Dashed lines mean planned or unresolved, solid lines mean built. Fills are flat and rare. At most one small flat red mark, #d8412f, and only where this prompt asks for it. Calm, exact, generous empty space, one subject.
SUBJECT: a figure made only of small round flat dots and a few hairlines. On the right, a loose round cluster of about seventy small warm white #f5f5f7 dots. Three hairlines in #a1a1a6 run from the cluster to three small groups of four dots each. A fourth hairline, drawn dashed, runs to an empty position marked by one flat red dot, #d8412f: the open seat. All dots are the same small size and perfectly flat.
COMPOSITION: wide 1.91:1 image. The whole figure sits in the right 40% of the image, vertically centred, clear of every edge. The left 55% is completely empty flat black, reserved for words added later.
MOOD: a team with room for one more.
```

Negative prompt:

```
gradient, glow, bloom, neon, lens flare, light rays, drop shadow, soft shadow pool, glass effect, glossy reflection, reflective floor, vignette, fog, haze, bokeh lights, film grain, texture overlay, 3D bevel, stock-photo look, text, letters, numbers, captions, labels, logo, brand mark, university seal or mascot, watermark, signature, UI, HUD, hologram, people, faces, hands, body parts, any real product or brand design, extra colours, second red mark, glowing nodes, network mesh background, stars, particles, constellations, more than one red dot
```

**Approach 3 — theory sketch: the drawing before the build.**

```
HOUSE STYLE: a documented engineering drawing, not a decorated illustration. Flat pure black ground #000000 reaching all four edges. One ink colour, warm white #f5f5f7, with a quieter grey #a1a1a6 for secondary lines. Thin even outlines with round caps and round joins. Depth is shown only by line opacity, from very faint construction lines to full-strength lines on the part in focus. Dashed lines mean planned or unresolved, solid lines mean built. Fills are flat and rare. At most one small flat red mark, #d8412f, and only where this prompt asks for it. Calm, exact, generous empty space, one subject.
SUBJECT: a hand-drawn engineering concept sketch, shown as light pencil lines on black: an original slab-shaped handheld device seen in three views side by side (front, side, three-quarter), its back cover lifted away in the three-quarter view to show plain rectangular module outlines inside. Thin, slightly irregular hand-drawn lines in warm white #f5f5f7, lighter construction lines and centre lines in #a1a1a6. Dashed lines for the parts that are still planned. One small flat red cross mark, #d8412f, at one corner of the device. No shading, no hatching.
COMPOSITION: wide 1.91:1 image. The three views sit in the right 42% of the image, vertically centred, clear of every edge. The left 55% is completely empty flat black, reserved for words added later.
MOOD: the page of a notebook where a build starts.
```

Negative prompt:

```
gradient, glow, bloom, neon, lens flare, light rays, drop shadow, soft shadow pool, glass effect, glossy reflection, reflective floor, vignette, fog, haze, bokeh lights, film grain, texture overlay, 3D bevel, stock-photo look, text, letters, numbers, captions, labels, logo, brand mark, university seal or mascot, watermark, signature, UI, HUD, hologram, people, faces, hands, body parts, any real product or brand design, extra colours, second red mark, handwriting, dimensions, arrows with labels, paper texture, coffee stain, pencil, desk, screen content, app icons, camera bump styled after any real phone
```

**Acceptance checklist**

- [ ] Left 55% samples `#000000`; white 64px type on it passes 7:1.
- [ ] Still reads when centre-cropped to a square.
- [ ] Exactly one red mark, small.
- [ ] No letter, number or logo at 200% zoom.
- [ ] Looks drawn from a file, not decorated (`DESIGN.md` §17, the drawing test).

**Post-processing:** resize to 1200×630, composite the words from an SVG so they are real Geist outlines, export PNG:
`node -e "const s=require('sharp');s('og-master.png').resize(1200,630,{fit:'cover'}).composite([{input:'og-text.svg'}]).png({compressionLevel:9}).toFile('app/opengraph-image.png')"`
Copy to `app/twitter-image.png`. Add `app/opengraph-image.alt.txt`: "DIGITAL, a student-run venture studio at Cal Poly Pomona. Line drawing of a circuit board opened into layers." (edit to the approach chosen). Check the static export output for the `og:image` tag before shipping; this path is untested here.

### SEAT-01 — team seat placeholder

**Objective:** show that a seat exists and is open, without pretending anyone sits in it.

**Why no portraits:** the roster has no confirmed names or photos (`_content/team.ts`). A generated face would be a fabricated person on a page whose rule is "Print only what a source states" and "Name people → Roles and teams only" (`DESIGN.md` §4, §18). It fails the signature test. So this card prompts abstract seat art, one image reused for every seat.

**Placement:** `/team/`, beside or above each seat row (role, then term or build, both typeset live). The page renders no image today; this is optional. Drawn live: role title, meta line.

**Specs:** 800×1000 master, 4:5. Subject inside the centre 70%. Light-section art: ground `#ffffff`, ink `#1d1d1f`, secondary `#6e6e73` (`DESIGN.md` §6, light column). Deliver as a traced SVG using `currentColor` (≤ 4 KB) so it follows the tone, or WebP ≤ 15 KB.

**Approach 1 — the open seat (dot ring).**

```
A flat minimal figure made only of dots on a pure white #ffffff ground. Twelve small round dots sit evenly spaced on one invisible circle. Eleven are flat near-black #1d1d1f. The twelfth, at the top, is one flat red dot, #d8412f, the same size: the open seat. No lines join the dots. No other marks.
COMPOSITION: 4:5 portrait. The ring is centred and fills the middle 60% of the width. Everything else is empty white.
STYLE: flat vector artwork, perfectly even dots, no texture, no lighting, no shadow.
MOOD: a place kept for someone.
```

Negative prompt:

```
gradient, glow, bloom, neon, lens flare, light rays, drop shadow, soft shadow pool, glass effect, glossy reflection, reflective floor, vignette, fog, haze, bokeh lights, film grain, texture overlay, 3D bevel, stock-photo look, text, letters, numbers, captions, labels, logo, brand mark, university seal or mascot, watermark, signature, UI, HUD, hologram, people, faces, hands, body parts, any real product or brand design, extra colours, second red mark, avatar silhouette, head and shoulders shape, profile icon, connecting lines, more than one red dot
```

**Approach 2 — line art: the empty bench stool.**

```
A thin-line isometric drawing of one plain, original four-legged workshop stool, empty, on a pure white #ffffff ground. Even thin outlines in near-black #1d1d1f with round caps and joins. Hidden edges and the floor contact points are drawn as very faint lines in #6e6e73. The whole stool is drawn in dashed lines, because the seat is not filled yet. One small flat red dot, #d8412f, sits at the centre of the seat. No fill, no shading.
COMPOSITION: 4:5 portrait. The stool is centred and fills the middle 55% of the width. Everything else is empty white.
CAMERA: true isometric, no perspective.
MOOD: a seat waiting at the bench.
```

Negative prompt:

```
gradient, glow, bloom, neon, lens flare, light rays, drop shadow, soft shadow pool, glass effect, glossy reflection, reflective floor, vignette, fog, haze, bokeh lights, film grain, texture overlay, 3D bevel, stock-photo look, text, letters, numbers, captions, labels, logo, brand mark, university seal or mascot, watermark, signature, UI, HUD, hologram, people, faces, hands, body parts, any real product or brand design, extra colours, second red mark, person sitting, clothing on the stool, office chair, gaming chair, wood grain, floor line, room
```

**Approach 3 — theory sketch: the unsigned title block.** From the belief "Sign your work." (`DESIGN.md` §3).

```
A pencil-style line drawing on a pure white #ffffff ground: the empty title block from the corner of an engineering drawing. A plain rectangle divided by thin rules into four blank fields of different widths, all empty. Thin, slightly irregular hand-drawn lines in near-black #1d1d1f; lighter guide lines in #6e6e73. In the largest field, one short dashed baseline where a signature would go, with one small flat red dot, #d8412f, at its left end. Every field is blank.
COMPOSITION: 4:5 portrait. The title block is centred, about 70% of the width and 30% of the height. Everything else is empty white.
MOOD: the drawing is ready; the name is not on it yet.
```

Negative prompt:

```
gradient, glow, bloom, neon, lens flare, light rays, drop shadow, soft shadow pool, glass effect, glossy reflection, reflective floor, vignette, fog, haze, bokeh lights, film grain, texture overlay, 3D bevel, stock-photo look, text, letters, numbers, captions, labels, logo, brand mark, university seal or mascot, watermark, signature, UI, HUD, hologram, people, faces, hands, body parts, any real product or brand design, extra colours, second red mark, handwriting, scribble that looks like a signature, stamp, date, paper texture, pencil, desk
```

**Acceptance checklist**

- [ ] No shape reads as a head, face or body.
- [ ] One red dot; two greys; white corners sample `#ffffff`.
- [ ] Reads at 96px wide.
- [ ] No text at 200% zoom.

**Post-processing:** trace to SVG, replace the dark colour with `currentColor`, keep the red literal; run `npx svgo seat.svg`. Raster fallback: `node -e "require('sharp')('seat.png').resize(640,800).webp({quality:70}).toFile('public/team/seat.webp')"`. Alt text: `alt=""` (the role text beside it carries the meaning).

### COMM-01 — community / build-night plate

**Objective:** give `/community/` one picture of where the work happens, without staging an event that was not photographed.

**Placement:** `/community/` dark hero, behind or beside the `h1` "Where the build happens." (typeset live, with the lead and the channel rows). Optional: the page has no image slot today. Real bench photos from members beat any of these; ask for them first.

**Specs:** 2400×1350 master, 16:9, plus a recomposed 1440×1800 4:5. Ground `#000000`, opaque. Safe area: the left 50% (16:9) or the top 45% (4:5) is empty black for the heading. AVIF ≤ 120 KB and ≤ 80 KB.

**Approach 1 — line art: the bench, isometric.**

```
HOUSE STYLE: a documented engineering drawing, not a decorated illustration. Flat pure black ground #000000 reaching all four edges. One ink colour, warm white #f5f5f7, with a quieter grey #a1a1a6 for secondary lines. Thin even outlines with round caps and round joins. Depth is shown only by line opacity, from very faint construction lines to full-strength lines on the part in focus. Dashed lines mean planned or unresolved, solid lines mean built. Fills are flat and rare. At most one small flat red mark, #d8412f, and only where this prompt asks for it. Calm, exact, generous empty space, one subject.
SUBJECT: an original workbench drawn as thin isometric line art, with no people. On the bench: a small bare circuit board on a stand, a bench power supply drawn as a plain box with two blank round dials, a coil of wire, a closed laptop and three plain stools pulled up to it. Bench and stools at medium line strength, the board at full strength, everything else faint. For the board only, the line colour is copper #c9965f. One small flat red dot, #d8412f, on the board, like a probe point.
COMPOSITION: 16:9. The bench sits in the right 45% of the image, vertically centred, clear of every edge. The left 50% is completely empty flat black for a heading.
COMPOSITION (4:5, use instead for the phone master): the bench fills the lower 50%; the top 45% is empty black.
CAMERA: true isometric, no perspective.
MOOD: Thursday evening, tools out, seats open.
```

Negative prompt:

```
gradient, glow, bloom, neon, lens flare, light rays, drop shadow, soft shadow pool, glass effect, glossy reflection, reflective floor, vignette, fog, haze, bokeh lights, film grain, texture overlay, 3D bevel, stock-photo look, text, letters, numbers, captions, labels, logo, brand mark, university seal or mascot, watermark, signature, UI, HUD, hologram, people, faces, hands, body parts, any real product or brand design, extra colours, second red mark, people working, screen content, brand names on tools, posters, whiteboard writing, classroom, campus building
```

**Approach 2 — dot figure: the channels.**

```
HOUSE STYLE: a documented engineering drawing, not a decorated illustration. Flat pure black ground #000000 reaching all four edges. One ink colour, warm white #f5f5f7, with a quieter grey #a1a1a6 for secondary lines. Thin even outlines with round caps and round joins. Depth is shown only by line opacity, from very faint construction lines to full-strength lines on the part in focus. Dashed lines mean planned or unresolved, solid lines mean built. Fills are flat and rare. At most one small flat red mark, #d8412f, and only where this prompt asks for it. Calm, exact, generous empty space, one subject.
SUBJECT: a figure made only of small flat round dots and hairlines. One round cluster of about forty warm white #f5f5f7 dots in the middle of the right half: the studio. Five hairlines in #a1a1a6 leave it at different angles, each ending in a small tidy group of dots of a different arrangement (a row, a square, a triangle, a ring, a pair). One dot inside the main cluster is flat red, #d8412f.
COMPOSITION: 16:9. The figure sits in the right 45% of the image, vertically centred, clear of every edge. The left 50% is completely empty flat black for a heading.
COMPOSITION (4:5, use instead for the phone master): the figure fills the lower 50%; the top 45% is empty black.
MOOD: the work carries on between build nights.
```

Negative prompt:

```
gradient, glow, bloom, neon, lens flare, light rays, drop shadow, soft shadow pool, glass effect, glossy reflection, reflective floor, vignette, fog, haze, bokeh lights, film grain, texture overlay, 3D bevel, stock-photo look, text, letters, numbers, captions, labels, logo, brand mark, university seal or mascot, watermark, signature, UI, HUD, hologram, people, faces, hands, body parts, any real product or brand design, extra colours, second red mark, app icons, chat bubbles, social media logos, globe, network mesh background, stars
```

**Approach 3 — theory sketch: the bench notebook.**

```
HOUSE STYLE: a documented engineering drawing, not a decorated illustration. Flat pure black ground #000000 reaching all four edges. One ink colour, warm white #f5f5f7, with a quieter grey #a1a1a6 for secondary lines. Thin even outlines with round caps and round joins. Depth is shown only by line opacity, from very faint construction lines to full-strength lines on the part in focus. Dashed lines mean planned or unresolved, solid lines mean built. Fills are flat and rare. At most one small flat red mark, #d8412f, and only where this prompt asks for it. Calm, exact, generous empty space, one subject.
SUBJECT: a hand-drawn notebook sketch shown as light pencil lines on black, with no people: a top-down plan of a shared workbench with six plain stool circles around it, and on the bench the outlines of a small board, a meter drawn as a blank box, and a few loose parts. Thin, slightly irregular lines in warm white #f5f5f7, construction lines in #a1a1a6. Five stools are solid; the sixth is dashed and holds one small flat red dot, #d8412f. No shading.
COMPOSITION: 16:9. The plan sits in the right 45% of the image, vertically centred, clear of every edge. The left 50% is completely empty flat black for a heading.
COMPOSITION (4:5, use instead for the phone master): the plan fills the lower 50%; the top 45% is empty black.
MOOD: a plan for the evening, one seat still open.
```

Negative prompt:

```
gradient, glow, bloom, neon, lens flare, light rays, drop shadow, soft shadow pool, glass effect, glossy reflection, reflective floor, vignette, fog, haze, bokeh lights, film grain, texture overlay, 3D bevel, stock-photo look, text, letters, numbers, captions, labels, logo, brand mark, university seal or mascot, watermark, signature, UI, HUD, hologram, people, faces, hands, body parts, any real product or brand design, extra colours, second red mark, handwriting, dimensions, arrows with labels, paper texture, pencil, coffee cup, floor plan of a real building
```

**Acceptance checklist**

- [ ] No people, no faces, no event that reads as a photograph.
- [ ] Heading area samples `#000000`.
- [ ] One red mark.
- [ ] No brand, no campus landmark, no text at 200% zoom.

**Post-processing:** `node -e "require('sharp')('build-night.png').resize(2400,1350,{fit:'cover'}).avif({quality:50,effort:9}).toFile('public/community/build-night.avif')"` (4:5: `1440,1800`, quality 45). Alt text: `alt=""` if it sits behind the heading; if it stands alone, "Line drawing of a shared workbench with one open seat."

---

## 4. SHADES pack — optional, ready if approved

**Status: not in use.** `DECISIONS.md` Decision 1: "No generated images. Everything is code-drawn, the way SIDEKICK is." The two mockups are being built that way. This pack exists so that, if the Head Designer later approves plates for either mockup, the prompts are ready. The one live need is BOOK-01, because Decision 2 keeps the archived photograph and notes "the photo's own printed text is invented and has typos".

Rules that hold for every prompt in this section:

1. SHADES is a concept in planning. The images show a matte design-study model, never a finished product.
2. No medical imagery, no efficacy visuals, no named optics or parts, no hardware the content file does not name.
3. "Display is see through" (Decision 6): lenses are clear and the page stays visible behind them.
4. The held word is HUD green `#7FE6A3`, "Flat colour: no glow, no blur halo" (Decision 3). **It is never in the image.** The site draws it, and the red fixation point `#d8412f`, live.
5. Original design only. The frame is the identity paragraph below, improved from `PLAN.md` §6.1 (lenses now stated as see-through).

Two mockup approaches (`DECISIONS.md`):

- **A — the object leads.** Black ground. The glasses are carried through the stages. The book appears only at the reader's view.
- **B — the book leads.** The book photograph is the ground from the first viewport. The see-through lens frames the page.

**Order of work:** BOOK-01 → SH-FORM A → approve → SH-REF → the other A plates (references: SH-FORM A, then SH-REF) → B plates (references: BOOK-01, then SH-FORM A) → each 4:5 (reference: its own approved 16:9). Reject and regenerate; do not paint text or marks out of a failed frame.

### BOOK-01 — clean book plate (replaces `BookBG_Clear.png`)

**Objective:** give the live words a real page to move across, with no printed word of its own to compete or to be wrong.

**What is wrong with the current file** (`archive/public/assets/experiments/glasses/BookBG_Clear.png`, 1672×941, 2.7 MB): fully legible invented text, including "recnocile" and "onccome"; running heads and page numbers (172, 173); a magazine with a landscape picture and a drop cap behind the book; a dark object at the top left; a brown wooden desk; cream paper. Its origin is undocumented.

**Placement:** `/projects/shades-a/` at the View stage only; `/projects/shades-b/` as the ground from the first viewport. Drawn live on top: the streaming page words in Atkinson Hyperlegible Next, the scan-path dots, the held green word, the red point, the lens rim hairline.

**Specs:** masters 2560×1440 (16:9) and 1440×1800 (4:5, recomposed). Opaque. AVIF ≤ 250 KB desktop and ≤ 120 KB mobile (`DECISIONS.md` Decision 2), plus a 16:9 JPEG fallback ≤ 300 KB. Safe area: no detail that matters in the top 30% or bottom 12%. The focal band across the right-hand page must take white 21px text at 4.5:1 after one flat darkening value.

**Approach 1 — edit the archived photograph (keeps the picture the Head Designer chose).** Edit / inpaint mode. Reference image 1: `BookBG_Clear.png`.

```
Edit reference image 1. Keep the same open hardback book, the same camera position, the same page curvature, gutter and soft daylight. Change only the following:
1. Replace every line of printed text on both book pages with fine, evenly spaced grey lines of soft unreadable type at the same line spacing and the same slight curve. No legible word anywhere. Remove both running heads and both page numbers and leave plain paper there.
2. Remove the magazine behind the book, the dark object at the top left and the wooden desk. Replace everything outside the book with a flat matte black table, #000000, that reaches the top, left and right edges.
3. Make the paper neutral white, near #f5f5f7, not cream. Colour-neutral grade.
Do not add anything. Do not change the book's shape or position. Photographic, natural, sharpest on a horizontal band across the middle of the right-hand page.
```

Negative prompt:

```
readable words, letters, numbers, heading, page number, drop cap, picture, newspaper, magazine, wooden desk, pen, cup, bookmark, glasses, hands, person, lamp, window, warm or yellow tint, glow, vignette, logo, watermark
```

**Approach 2 — new plate on black (fits A).** Improved from `PLAN.md` §6 P1. No reference image.

```
A photograph of one open hardback book lying on a matte black table, lit by one soft lamp from above. The pages are the brightest thing in the image. The table and everything around the book fall to pure flat black #000000 before all four edges. Paper is neutral white, near #f5f5f7, not cream; the grade is colour-neutral. Both pages carry body text only, as evenly spaced fine grey lines of soft unreadable type: no legible word, no heading, no page number, no picture, no drop cap. Nothing else is in the scene.
CAMERA: the reader's own seated view, looking down at the book at about 35 degrees, 35 mm lens look. The book is square to the camera, spine vertical. Shallow focus, sharpest on a horizontal band across the middle of the right-hand page.
COMPOSITION (16:9): both pages visible; the book spans about 80% of the image width and sits in the lower 65% of the image. The top 30% is the far edge of the table, pure black.
COMPOSITION (4:5, use instead for the phone master): the right-hand page and the gutter only, filling the lower 70% of the image.
MOOD: a quiet desk, one lamp, ready to read.
```

Negative prompt:

```
readable words, letters, numbers, heading, page number, drop cap, picture, glasses, pen, cup, bookmark, lamp in frame, window, second book, newspaper, hands, person, warm or yellow tint, cream paper, glow, vignette glow, gradient, bokeh lights, logo, watermark
```

**Approach 3 — new plate, page to every edge (fits B).** No reference image.

```
GROUND: a photograph of an open hardback book seen from the reader's own seated position, looking down at about 35 degrees. The book is square to the camera with the spine vertical, and the two pages fill the whole image past all four edges, so no table, desk or background is visible. Paper is neutral white, near #f5f5f7, not cream, with a colour-neutral grade. Both pages carry body text only, as evenly spaced fine grey lines of soft unreadable type: no legible word, no heading, no page number, no picture, no drop cap. One soft lamp from above, even light, no hard shadow.
CAMERA: 35 mm lens look. Shallow focus, sharpest on a horizontal band across the middle of the right-hand page; the far edge of the pages at the top is softer.
COMPOSITION (16:9): the gutter runs vertically just left of centre. Line spacing is generous, about 22 lines per page. The top 30% of the image is the softer, far part of the pages.
COMPOSITION (4:5, use instead for the phone master): the right-hand page and the gutter only; the gutter is at the left edge.
MOOD: bright, even, calm paper that can sit under live type.
```

Negative prompt:

```
readable words, letters, numbers, heading, page number, drop cap, picture, table, desk, background, glasses, pen, cup, bookmark, lamp, window, second book, newspaper, hands, person, warm or yellow tint, cream paper, hard shadow, glow, vignette, logo, watermark
```

**Acceptance checklist**

- [ ] Zoom to 200%: no readable word, heading, number or picture.
- [ ] Paper is neutral: R, G and B within 4% of each other on the page.
- [ ] Approaches 1 and 2: all four corners and the top band sample `#000000`. Approach 3: no table visible.
- [ ] Line spacing is even enough that live text can sit on a line without fighting it.
- [ ] White 21px text on the focal band reaches 4.5:1 after one flat darkening value (no radial scrim).

**Post-processing:**
`node -e "require('sharp')('book-16x9.png').resize(2560,1440,{fit:'cover'}).avif({quality:50,effort:9}).toFile('public/shades/book-16x9.avif')"`
`node -e "require('sharp')('book-4x5.png').resize(1440,1800,{fit:'cover'}).avif({quality:48,effort:9}).toFile('public/shades/book-4x5.avif')"`
JPEG fallback: `.jpeg({quality:72,mozjpeg:true})`. If a size is over budget, lower quality in steps of 5 before reducing pixels. Alt text: `alt=""` (the live text on top is the content).

### SH-REF — identity sheet (never shipped)

**Objective:** keep the frame the same object in every plate.

**Placement:** none. Used only as reference image 2 for the stage plates. Keep it in `design-lab/image-prompts/refs/`.

**Specs:** 2560×1440, PNG, `#000000` ground. Reference image 1: the approved SH-FORM A plate.

```
SUBJECT: the DIGITAL SHADES study frame, an original eyeglasses design. Full-rim frame. Two softly squared lenses, each about 1.25 times wider than tall, corner radius about one fifth of the lens height. The top edges of both rims and the bridge form one straight, continuous brow line. Keyhole bridge, no separate nose-pad arms. Rim thickness even all the way round. Temples are straight flat-sided bars, about one and a half times the depth of ordinary eyewear temples from the hinge to mid-length, then tapering to a plain rounded tip. One simple barrel hinge per side. One thin plain cable leaves the tip of the wearer's right temple and runs out of the image. The lenses are clear and see-through. Nothing else is attached to, cut into, printed on or lit inside the frame or the lenses.
STYLE: a design-study model photographed in a studio. Every solid surface is the same matte mid-grey model-board finish, about #86868b: no gloss, no metal, no texture, no material change. The lenses are clear uncoated blanks with only a faint edge. Background is pure flat black #000000 reaching every edge. The object floats: no floor, no horizon, no reflection, no shadow pool. One large soft key light from the upper left and a weak fill. The whole object is in focus. Colour-neutral, no tint.
Show the exact object in reference image 1, unchanged, three times side by side at the same scale: straight front view, straight side view of the wearer's right side, straight top view. Orthographic, no perspective. Even spacing. 16:9.
```

Negative prompt:

```
text, letters, numbers, readable words, heading, page number, logo, brand mark, watermark, signature, UI, HUD, hologram, display content in the lens, green light, glow, neon, bloom, lens flare, LED, light strip, camera, sensor window, microphone holes, speaker grille, button, touch pad, charging pins, circuit board, chip, battery, controller box, dock, visor, goggles, wraparound shield, angular gaming styling, vents, tinted or mirrored lenses, eye, eye chart, medical equipment, clinic, before-and-after comparison, gradient background, vignette, fog, bokeh lights, reflective floor, hands, face, person, second pair of glasses, any real eyewear product or brand design
```

**Acceptance checklist**

- [ ] Lens proportion, brow line, bridge, temple depth and the single cable agree with SH-FORM A in all three views.
- [ ] One material; corners sample `#000000`.

**Post-processing:** none.

### SH-IDEA — stage "Idea"

**Objective:** show that the glasses begin as a drawing made around one fixed point.

**Placement:** `/projects/shades-a/` and `/projects/shades-b/` review routes (later `/projects/shades/`), the concept pin, stage "Idea". Drawn live on top by code: the red fixation point `#d8412f` and, under it, the held word in flat HUD green `#7FE6A3`; the caption; the tracker.

**Specs:** masters 2560×1440 (16:9) and 1440×1800 (4:5, recomposed, not centre-cropped). Safe area: top 30% and bottom 12% carry no key detail (caption band and tracker). Opaque, no transparency. Export AVIF plus a 16:9 JPEG fallback.

| Approach | Ground | Saved to | Budget |
|---|---|---|---|
| A — the object leads | `#000000` | `public/shades-a/idea-16x9.avif`, `idea-4x5.avif` | ≤ 90 KB, ≤ 60 KB |
| B — the book leads | book page, paper near `#f5f5f7` | `public/shades-b/idea-16x9.avif`, `idea-4x5.avif` | ≤ 150 KB, ≤ 100 KB |

**Approach A — the object leads.** Reference images: SH-FORM A first, SH-REF second (none when generating SH-FORM A itself).

```
SUBJECT: the DIGITAL SHADES study frame, an original eyeglasses design. Full-rim frame. Two softly squared lenses, each about 1.25 times wider than tall, corner radius about one fifth of the lens height. The top edges of both rims and the bridge form one straight, continuous brow line. Keyhole bridge, no separate nose-pad arms. Rim thickness even all the way round. Temples are straight flat-sided bars, about one and a half times the depth of ordinary eyewear temples from the hinge to mid-length, then tapering to a plain rounded tip. One simple barrel hinge per side. One thin plain cable leaves the tip of the wearer's right temple and runs out of the image. The lenses are clear and see-through. Nothing else is attached to, cut into, printed on or lit inside the frame or the lenses.
A technical pencil drawing of the frame, delivered as light lines on black. Thin even lines in warm white #f5f5f7 on a pure flat black #000000 ground. A few lighter construction lines in #a1a1a6. The whole frame is drawn dashed, because it is planned, not built. No shading, no hatching, no colour.
VIEW: straight front elevation, drawn large. Lighter and smaller, to its right, the straight side view of the wearer's right side and the straight top view, at one shared scale.
COMPOSITION (16:9): the front elevation is centred, about 50% of the image width, between 32% and 86% of the height. The centre of the wearer's right lens is left completely empty. The top 30% and bottom 12% are plain black.
COMPOSITION (4:5, use instead for the phone master): front elevation only, about 80% of the width, inside the middle 55% of the height.
MOOD: quiet, exact, a study on a bench. Leave every lens empty: the site draws the word.
```

Negative prompt:

```
text, letters, numbers, readable words, heading, page number, logo, brand mark, watermark, signature, UI, HUD, hologram, display content in the lens, green light, glow, neon, bloom, lens flare, LED, light strip, camera, sensor window, microphone holes, speaker grille, button, touch pad, charging pins, circuit board, chip, battery, controller box, dock, visor, goggles, wraparound shield, angular gaming styling, vents, tinted or mirrored lenses, eye, eye chart, medical equipment, clinic, before-and-after comparison, gradient background, vignette, fog, bokeh lights, reflective floor, hands, face, person, second pair of glasses, any real eyewear product or brand design
```

**Approach B — the book leads.** Reference images: BOOK-01 (approved plate) first, SH-FORM A second.

```
SUBJECT: the DIGITAL SHADES study frame, an original eyeglasses design. Full-rim frame. Two softly squared lenses, each about 1.25 times wider than tall, corner radius about one fifth of the lens height. The top edges of both rims and the bridge form one straight, continuous brow line. Keyhole bridge, no separate nose-pad arms. Rim thickness even all the way round. Temples are straight flat-sided bars, about one and a half times the depth of ordinary eyewear temples from the hinge to mid-length, then tapering to a plain rounded tip. One simple barrel hinge per side. One thin plain cable leaves the tip of the wearer's right temple and runs out of the image. The lenses are clear and see-through. Nothing else is attached to, cut into, printed on or lit inside the frame or the lenses.
GROUND: a photograph of an open hardback book seen from the reader's own seated position, looking down at about 35 degrees. The book is square to the camera with the spine vertical, and the two pages fill the whole image past all four edges, so no table, desk or background is visible. Paper is neutral white, near #f5f5f7, not cream, with a colour-neutral grade. Both pages carry body text only, as evenly spaced fine grey lines of soft unreadable type: no legible word, no heading, no page number, no picture, no drop cap. One soft lamp from above, even light, no hard shadow.
ON THE PAGE: one sheet of translucent drafting paper lies flat across the right-hand page. On it, a thin even graphite line drawing of the frame in straight front elevation, with a few lighter construction lines. No shading, no handwriting, no dimensions, no arrows. The printed lines of the page show faintly through the sheet.
COMPOSITION (16:9): the drawing sits on the right-hand page, about 38% of the image width, in the lower 60% of the image. The centre of the wearer's right lens is left empty. The left-hand page carries nothing but its lines of type. The top 30% is quiet page, slightly out of focus.
COMPOSITION (4:5, use instead for the phone master): right-hand page and gutter only; the drawing is about 78% of the width, in the lower 60%.
MOOD: a reading desk, calm and bright. Leave every lens empty: the site draws the word.
```

Negative prompt:

```
text, letters, numbers, readable words, heading, page number, logo, brand mark, watermark, signature, UI, HUD, hologram, display content in the lens, green light, glow, neon, bloom, lens flare, LED, light strip, camera, sensor window, microphone holes, speaker grille, button, touch pad, charging pins, circuit board, chip, battery, controller box, dock, visor, goggles, wraparound shield, angular gaming styling, vents, tinted or mirrored lenses, eye, eye chart, medical equipment, clinic, before-and-after comparison, gradient background, vignette, fog, bokeh lights, reflective floor, hands, face, person, second pair of glasses, any real eyewear product or brand design, table, desk surface, pen, cup, bookmark, lamp, window, second book, newspaper, cream or yellow paper
```

**Acceptance checklist**

- [ ] A: The centre of the wearer's right lens is empty; lines are dashed; black samples `#000000` at all four corners.
- [ ] B: No readable word at 200% zoom; no handwriting or numbers on the sheet; the right lens centre is empty.
- [ ] Frame matches the identity paragraph line by line; nothing reads as a named part.
- [ ] Zoom to 200%: no letter, number, logo or lens content anywhere.
- [ ] Top 30% and bottom 12% are quiet enough for a white caption at 4.5:1 (B: after the site's one flat darkening value).

**Post-processing:** crop to exact size, no sharpening halo. Re-encode:
`node -e "require('sharp')('idea-16x9.png').resize(2560,1440,{fit:'cover'}).avif({quality:45,effort:9}).toFile('public/shades-a/idea-16x9.avif')"`
(4:5: `1440,1800`; B: `public/shades-b/`, quality 50). Alt text: `alt=""` (the stage heading and line are the text alternative, DESIGN.md §15.6).

### SH-FORM — stage "Form"

**Objective:** let the visitor see the frame as one plain physical object, clearly a study and not a finished product.

**Placement:** `/projects/shades-a/` and `/projects/shades-b/` review routes (later `/projects/shades/`), the concept pin, stage "Form". Drawn live on top by code: the red point and green word inside the wearer's right lens; the caption; the concept note under the tracker.

**Specs:** masters 2560×1440 (16:9) and 1440×1800 (4:5, recomposed, not centre-cropped). Safe area: top 30% and bottom 12% carry no key detail (caption band and tracker). Opaque, no transparency. Export AVIF plus a 16:9 JPEG fallback.

| Approach | Ground | Saved to | Budget |
|---|---|---|---|
| A — the object leads | `#000000` | `public/shades-a/form-16x9.avif`, `form-4x5.avif` | ≤ 90 KB, ≤ 60 KB |
| B — the book leads | book page, paper near `#f5f5f7` | `public/shades-b/form-16x9.avif`, `form-4x5.avif` | ≤ 150 KB, ≤ 100 KB |

**Approach A — the object leads.** Reference images: SH-FORM A first, SH-REF second (none when generating SH-FORM A itself).

```
SUBJECT: the DIGITAL SHADES study frame, an original eyeglasses design. Full-rim frame. Two softly squared lenses, each about 1.25 times wider than tall, corner radius about one fifth of the lens height. The top edges of both rims and the bridge form one straight, continuous brow line. Keyhole bridge, no separate nose-pad arms. Rim thickness even all the way round. Temples are straight flat-sided bars, about one and a half times the depth of ordinary eyewear temples from the hinge to mid-length, then tapering to a plain rounded tip. One simple barrel hinge per side. One thin plain cable leaves the tip of the wearer's right temple and runs out of the image. The lenses are clear and see-through. Nothing else is attached to, cut into, printed on or lit inside the frame or the lenses.
STYLE: a design-study model photographed in a studio. Every solid surface is the same matte mid-grey model-board finish, about #86868b: no gloss, no metal, no texture, no material change. The lenses are clear uncoated blanks with only a faint edge. Background is pure flat black #000000 reaching every edge. The object floats: no floor, no horizon, no reflection, no shadow pool. One large soft key light from the upper left and a weak fill. The whole object is in focus. Colour-neutral, no tint.
CAMERA: three-quarter front view from slightly above eye level, about 30 degrees to the wearer's right side, 50 mm lens look, no perspective distortion. Temples open. The wearer's right lens is nearest the camera.
COMPOSITION (16:9): the whole frame is visible and centred, about 55% of the image width, between 30% and 88% of the height. The cable leaves toward the lower right corner. The top 30% and bottom 12% are plain black.
COMPOSITION (4:5, use instead for the phone master): same view; the frame is about 80% of the width, inside the middle 55% of the height.
MOOD: quiet, exact, a study on a bench. Leave every lens empty: the site draws the word.
```

Negative prompt:

```
text, letters, numbers, readable words, heading, page number, logo, brand mark, watermark, signature, UI, HUD, hologram, display content in the lens, green light, glow, neon, bloom, lens flare, LED, light strip, camera, sensor window, microphone holes, speaker grille, button, touch pad, charging pins, circuit board, chip, battery, controller box, dock, visor, goggles, wraparound shield, angular gaming styling, vents, tinted or mirrored lenses, eye, eye chart, medical equipment, clinic, before-and-after comparison, gradient background, vignette, fog, bokeh lights, reflective floor, hands, face, person, second pair of glasses, any real eyewear product or brand design
```

**Approach B — the book leads.** Reference images: BOOK-01 (approved plate) first, SH-FORM A second.

```
SUBJECT: the DIGITAL SHADES study frame, an original eyeglasses design. Full-rim frame. Two softly squared lenses, each about 1.25 times wider than tall, corner radius about one fifth of the lens height. The top edges of both rims and the bridge form one straight, continuous brow line. Keyhole bridge, no separate nose-pad arms. Rim thickness even all the way round. Temples are straight flat-sided bars, about one and a half times the depth of ordinary eyewear temples from the hinge to mid-length, then tapering to a plain rounded tip. One simple barrel hinge per side. One thin plain cable leaves the tip of the wearer's right temple and runs out of the image. The lenses are clear and see-through. Nothing else is attached to, cut into, printed on or lit inside the frame or the lenses.
GROUND: a photograph of an open hardback book seen from the reader's own seated position, looking down at about 35 degrees. The book is square to the camera with the spine vertical, and the two pages fill the whole image past all four edges, so no table, desk or background is visible. Paper is neutral white, near #f5f5f7, not cream, with a colour-neutral grade. Both pages carry body text only, as evenly spaced fine grey lines of soft unreadable type: no legible word, no heading, no page number, no picture, no drop cap. One soft lamp from above, even light, no hard shadow.
ON THE PAGE: the frame rests on the open book, temples open, standing on its lower rims and temple tips, seen three-quarter from the wearer's right. Every solid surface of the frame is one matte mid-grey model-board finish, about #86868b, with no gloss and no material change. The lenses are clear, uncoated and see-through: the lines of type on the page are visible through them, undistorted. A soft, short contact shadow only where the frame touches the paper.
COMPOSITION (16:9): the frame sits across the gutter in the lower 60% of the image, about 50% of the width. The top 30% is quiet page, slightly out of focus.
COMPOSITION (4:5, use instead for the phone master): the frame is about 82% of the width, in the lower 55%.
MOOD: a reading desk, calm and bright. Leave every lens empty: the site draws the word.
```

Negative prompt:

```
text, letters, numbers, readable words, heading, page number, logo, brand mark, watermark, signature, UI, HUD, hologram, display content in the lens, green light, glow, neon, bloom, lens flare, LED, light strip, camera, sensor window, microphone holes, speaker grille, button, touch pad, charging pins, circuit board, chip, battery, controller box, dock, visor, goggles, wraparound shield, angular gaming styling, vents, tinted or mirrored lenses, eye, eye chart, medical equipment, clinic, before-and-after comparison, gradient background, vignette, fog, bokeh lights, reflective floor, hands, face, person, second pair of glasses, any real eyewear product or brand design, table, desk surface, pen, cup, bookmark, lamp, window, second book, newspaper, cream or yellow paper
```

**Acceptance checklist**

- [ ] A: One material only; no shadow pool; nothing on the temples; corners sample `#000000`.
- [ ] B: Page lines are visible through both lenses; no readable word; lenses carry no tint and no content.
- [ ] Frame matches the identity paragraph line by line; nothing reads as a named part.
- [ ] Zoom to 200%: no letter, number, logo or lens content anywhere.
- [ ] Top 30% and bottom 12% are quiet enough for a white caption at 4.5:1 (B: after the site's one flat darkening value).

**Post-processing:** crop to exact size, no sharpening halo. Re-encode:
`node -e "require('sharp')('form-16x9.png').resize(2560,1440,{fit:'cover'}).avif({quality:45,effort:9}).toFile('public/shades-a/form-16x9.avif')"`
(4:5: `1440,1800`; B: `public/shades-b/`, quality 50). Alt text: `alt=""` (the stage heading and line are the text alternative, DESIGN.md §15.6).

### SH-SYSTEM — stage "System"

**Objective:** show the frame as a small set of whole parts, so a code-drawn chain can name the six stages from text to eye.

**Placement:** `/projects/shades-a/` and `/projects/shades-b/` review routes (later `/projects/shades/`), the concept pin, stage "System". Drawn live on top by code: the dashed six-step chain with its one-word tags, the dashed controller box, the red point and green word; group colours if the mockup lifts groups.

**Specs:** masters 2560×1440 (16:9) and 1440×1800 (4:5, recomposed, not centre-cropped). Safe area: top 30% and bottom 12% carry no key detail (caption band and tracker). Opaque, no transparency. Export AVIF plus a 16:9 JPEG fallback.

| Approach | Ground | Saved to | Budget |
|---|---|---|---|
| A — the object leads | `#000000` | `public/shades-a/system-16x9.avif`, `system-4x5.avif` | ≤ 90 KB, ≤ 60 KB |
| B — the book leads | book page, paper near `#f5f5f7` | `public/shades-b/system-16x9.avif`, `system-4x5.avif` | ≤ 150 KB, ≤ 100 KB |

**Approach A — the object leads.** Reference images: SH-FORM A first, SH-REF second (none when generating SH-FORM A itself).

```
SUBJECT: the DIGITAL SHADES study frame, an original eyeglasses design. Full-rim frame. Two softly squared lenses, each about 1.25 times wider than tall, corner radius about one fifth of the lens height. The top edges of both rims and the bridge form one straight, continuous brow line. Keyhole bridge, no separate nose-pad arms. Rim thickness even all the way round. Temples are straight flat-sided bars, about one and a half times the depth of ordinary eyewear temples from the hinge to mid-length, then tapering to a plain rounded tip. One simple barrel hinge per side. One thin plain cable leaves the tip of the wearer's right temple and runs out of the image. The lenses are clear and see-through. Nothing else is attached to, cut into, printed on or lit inside the frame or the lenses.
STYLE: a design-study model photographed in a studio. Every solid surface is the same matte mid-grey model-board finish, about #86868b: no gloss, no metal, no texture, no material change. The lenses are clear uncoated blanks with only a faint edge. Background is pure flat black #000000 reaching every edge. The object floats: no floor, no horizon, no reflection, no shadow pool. One large soft key light from the upper left and a weak fill. The whole object is in focus. Colour-neutral, no tint.
ARRANGEMENT: the frame is opened into exactly five whole parts, each moved a short distance straight along its own axis and still aligned: the front, the two clear lens blanks just in front of their rims, and the two temples just behind their hinges. Nothing is cut open. No internal parts are shown or implied.
CAMERA: the same three-quarter front view from slightly above, about 30 degrees to the wearer's right, 50 mm lens look.
COMPOSITION (16:9): the five parts together span about 62% of the image width, centred, between 30% and 88% of the height, with clear black gaps between parts. The cable leaves toward the lower right corner. The top 30% and bottom 12% are plain black.
COMPOSITION (4:5, use instead for the phone master): the parts span about 84% of the width, inside the middle 58% of the height.
MOOD: quiet, exact, a study on a bench. Leave every lens empty: the site draws the word.
```

Negative prompt:

```
text, letters, numbers, readable words, heading, page number, logo, brand mark, watermark, signature, UI, HUD, hologram, display content in the lens, green light, glow, neon, bloom, lens flare, LED, light strip, camera, sensor window, microphone holes, speaker grille, button, touch pad, charging pins, circuit board, chip, battery, controller box, dock, visor, goggles, wraparound shield, angular gaming styling, vents, tinted or mirrored lenses, eye, eye chart, medical equipment, clinic, before-and-after comparison, gradient background, vignette, fog, bokeh lights, reflective floor, hands, face, person, second pair of glasses, any real eyewear product or brand design
```

**Approach B — the book leads.** Reference images: BOOK-01 (approved plate) first, SH-FORM A second.

```
SUBJECT: the DIGITAL SHADES study frame, an original eyeglasses design. Full-rim frame. Two softly squared lenses, each about 1.25 times wider than tall, corner radius about one fifth of the lens height. The top edges of both rims and the bridge form one straight, continuous brow line. Keyhole bridge, no separate nose-pad arms. Rim thickness even all the way round. Temples are straight flat-sided bars, about one and a half times the depth of ordinary eyewear temples from the hinge to mid-length, then tapering to a plain rounded tip. One simple barrel hinge per side. One thin plain cable leaves the tip of the wearer's right temple and runs out of the image. The lenses are clear and see-through. Nothing else is attached to, cut into, printed on or lit inside the frame or the lenses.
GROUND: a photograph of an open hardback book seen from the reader's own seated position, looking down at about 35 degrees. The book is square to the camera with the spine vertical, and the two pages fill the whole image past all four edges, so no table, desk or background is visible. Paper is neutral white, near #f5f5f7, not cream, with a colour-neutral grade. Both pages carry body text only, as evenly spaced fine grey lines of soft unreadable type: no legible word, no heading, no page number, no picture, no drop cap. One soft lamp from above, even light, no hard shadow.
ON THE PAGE: the frame's five whole parts are laid flat on the open book in a tidy, evenly spaced arrangement: the front in the middle, the two clear lens blanks below it, one temple on each side, all parallel to the page edges. Every solid part is one matte mid-grey model-board finish, about #86868b. The lens blanks are clear and the type shows through them. Nothing is cut open and no internal parts are shown or implied. Soft, short contact shadows only.
COMPOSITION (16:9): the arrangement sits in the lower 62% of the image, about 60% of the width, centred on the gutter. The top 30% is quiet page, slightly out of focus.
COMPOSITION (4:5, use instead for the phone master): the arrangement is about 84% of the width, in the lower 60%.
MOOD: a reading desk, calm and bright. Leave every lens empty: the site draws the word.
```

Negative prompt:

```
text, letters, numbers, readable words, heading, page number, logo, brand mark, watermark, signature, UI, HUD, hologram, display content in the lens, green light, glow, neon, bloom, lens flare, LED, light strip, camera, sensor window, microphone holes, speaker grille, button, touch pad, charging pins, circuit board, chip, battery, controller box, dock, visor, goggles, wraparound shield, angular gaming styling, vents, tinted or mirrored lenses, eye, eye chart, medical equipment, clinic, before-and-after comparison, gradient background, vignette, fog, bokeh lights, reflective floor, hands, face, person, second pair of glasses, any real eyewear product or brand design, table, desk surface, pen, cup, bookmark, lamp, window, second book, newspaper, cream or yellow paper
```

**Acceptance checklist**

- [ ] A: Exactly five parts; no electronics, boards or cells; gaps are clean black for the overlay.
- [ ] B: Exactly five parts; type visible through the lens blanks; no readable word; no tools or screws.
- [ ] Frame matches the identity paragraph line by line; nothing reads as a named part.
- [ ] Zoom to 200%: no letter, number, logo or lens content anywhere.
- [ ] Top 30% and bottom 12% are quiet enough for a white caption at 4.5:1 (B: after the site's one flat darkening value).

**Post-processing:** crop to exact size, no sharpening halo. Re-encode:
`node -e "require('sharp')('system-16x9.png').resize(2560,1440,{fit:'cover'}).avif({quality:45,effort:9}).toFile('public/shades-a/system-16x9.avif')"`
(4:5: `1440,1800`; B: `public/shades-b/`, quality 50). Alt text: `alt=""` (the stage heading and line are the text alternative, DESIGN.md §15.6).

### SH-OPTICS — stage "Optics"

**Objective:** bring the visitor close to one empty, see-through lens, where the site places one word at one point.

**Placement:** `/projects/shades-a/` and `/projects/shades-b/` review routes (later `/projects/shades/`), the concept pin, stage "Optics". Drawn live on top by code: a dashed display region, the held word in flat HUD green `#7FE6A3`, the red fixation point `#d8412f`; nothing in the image may suggest what makes the word.

**Specs:** masters 2560×1440 (16:9) and 1440×1800 (4:5, recomposed, not centre-cropped). Safe area: top 30% and bottom 12% carry no key detail (caption band and tracker). Opaque, no transparency. Export AVIF plus a 16:9 JPEG fallback.

| Approach | Ground | Saved to | Budget |
|---|---|---|---|
| A — the object leads | `#000000` | `public/shades-a/optics-16x9.avif`, `optics-4x5.avif` | ≤ 90 KB, ≤ 60 KB |
| B — the book leads | book page, paper near `#f5f5f7` | `public/shades-b/optics-16x9.avif`, `optics-4x5.avif` | ≤ 150 KB, ≤ 100 KB |

**Approach A — the object leads.** Reference images: SH-FORM A first, SH-REF second (none when generating SH-FORM A itself).

```
SUBJECT: the DIGITAL SHADES study frame, an original eyeglasses design. Full-rim frame. Two softly squared lenses, each about 1.25 times wider than tall, corner radius about one fifth of the lens height. The top edges of both rims and the bridge form one straight, continuous brow line. Keyhole bridge, no separate nose-pad arms. Rim thickness even all the way round. Temples are straight flat-sided bars, about one and a half times the depth of ordinary eyewear temples from the hinge to mid-length, then tapering to a plain rounded tip. One simple barrel hinge per side. One thin plain cable leaves the tip of the wearer's right temple and runs out of the image. The lenses are clear and see-through. Nothing else is attached to, cut into, printed on or lit inside the frame or the lenses.
STYLE: a design-study model photographed in a studio. Every solid surface is the same matte mid-grey model-board finish, about #86868b: no gloss, no metal, no texture, no material change. The lenses are clear uncoated blanks with only a faint edge. Background is pure flat black #000000 reaching every edge. The object floats: no floor, no horizon, no reflection, no shadow pool. One large soft key light from the upper left and a weak fill. The whole object is in focus. Colour-neutral, no tint.
CAMERA: macro view of the wearer's right lens, from the front and slightly to the wearer's right, 100 mm macro look. The lens is empty and clear; nothing is shown in it or reflected in it.
COMPOSITION (16:9): the lens fills about 60% of the image height, centred. Part of the rim, the hinge and the first part of the temple are visible. The middle 40% by 25% of the lens is plain and dark.
COMPOSITION (4:5, use instead for the phone master): the lens fills about 85% of the image width, centred.
MOOD: quiet, exact, a study on a bench. Leave every lens empty: the site draws the word.
```

Negative prompt:

```
text, letters, numbers, readable words, heading, page number, logo, brand mark, watermark, signature, UI, HUD, hologram, display content in the lens, green light, glow, neon, bloom, lens flare, LED, light strip, camera, sensor window, microphone holes, speaker grille, button, touch pad, charging pins, circuit board, chip, battery, controller box, dock, visor, goggles, wraparound shield, angular gaming styling, vents, tinted or mirrored lenses, eye, eye chart, medical equipment, clinic, before-and-after comparison, gradient background, vignette, fog, bokeh lights, reflective floor, hands, face, person, second pair of glasses, any real eyewear product or brand design
```

**Approach B — the book leads.** Reference images: BOOK-01 (approved plate) first, SH-FORM A second.

```
SUBJECT: the DIGITAL SHADES study frame, an original eyeglasses design. Full-rim frame. Two softly squared lenses, each about 1.25 times wider than tall, corner radius about one fifth of the lens height. The top edges of both rims and the bridge form one straight, continuous brow line. Keyhole bridge, no separate nose-pad arms. Rim thickness even all the way round. Temples are straight flat-sided bars, about one and a half times the depth of ordinary eyewear temples from the hinge to mid-length, then tapering to a plain rounded tip. One simple barrel hinge per side. One thin plain cable leaves the tip of the wearer's right temple and runs out of the image. The lenses are clear and see-through. Nothing else is attached to, cut into, printed on or lit inside the frame or the lenses.
GROUND: a photograph of an open hardback book seen from the reader's own seated position, looking down at about 35 degrees. The book is square to the camera with the spine vertical, and the two pages fill the whole image past all four edges, so no table, desk or background is visible. Paper is neutral white, near #f5f5f7, not cream, with a colour-neutral grade. Both pages carry body text only, as evenly spaced fine grey lines of soft unreadable type: no legible word, no heading, no page number, no picture, no drop cap. One soft lamp from above, even light, no hard shadow.
ON THE PAGE: a close view of the wearer's right lens of the frame as it lies on the right-hand page. The rim is one matte mid-grey model-board finish, about #86868b. The lens is clear, uncoated and see-through: the paper and its fine grey lines of type continue through the lens, undistorted and no darker than outside it. Nothing is shown in the lens.
CAMERA: 100 mm macro look from the reader's side, focus on the lens.
COMPOSITION (16:9): the lens fills about 60% of the image height, centred. A short length of rim, the hinge and the start of the temple are visible. Inside the lens, the middle band holds only plain paper between two lines of type.
COMPOSITION (4:5, use instead for the phone master): the lens fills about 85% of the image width, centred.
MOOD: a reading desk, calm and bright. Leave every lens empty: the site draws the word.
```

Negative prompt:

```
text, letters, numbers, readable words, heading, page number, logo, brand mark, watermark, signature, UI, HUD, hologram, display content in the lens, green light, glow, neon, bloom, lens flare, LED, light strip, camera, sensor window, microphone holes, speaker grille, button, touch pad, charging pins, circuit board, chip, battery, controller box, dock, visor, goggles, wraparound shield, angular gaming styling, vents, tinted or mirrored lenses, eye, eye chart, medical equipment, clinic, before-and-after comparison, gradient background, vignette, fog, bokeh lights, reflective floor, hands, face, person, second pair of glasses, any real eyewear product or brand design, table, desk surface, pen, cup, bookmark, lamp, window, second book, newspaper, cream or yellow paper
```

**Acceptance checklist**

- [ ] A: Lens is empty: no word, icon, grid, screen reflection or glow; its centre is flat enough for 28px text at 7:1 or better.
- [ ] B: Paper reads the same inside and outside the lens; the lens centre holds no type line; no readable word.
- [ ] Frame matches the identity paragraph line by line; nothing reads as a named part.
- [ ] Zoom to 200%: no letter, number, logo or lens content anywhere.
- [ ] Top 30% and bottom 12% are quiet enough for a white caption at 4.5:1 (B: after the site's one flat darkening value).

**Post-processing:** crop to exact size, no sharpening halo. Re-encode:
`node -e "require('sharp')('optics-16x9.png').resize(2560,1440,{fit:'cover'}).avif({quality:45,effort:9}).toFile('public/shades-a/optics-16x9.avif')"`
(4:5: `1440,1800`; B: `public/shades-b/`, quality 50). Alt text: `alt=""` (the stage heading and line are the text alternative, DESIGN.md §15.6).

### SH-VIEW — stage "View"

**Objective:** put the visitor in the reader's seat: the page stays visible while the site holds one word at one point.

**Placement:** `/projects/shades-a/` and `/projects/shades-b/` review routes (later `/projects/shades/`), the concept pin, stage "View". Drawn live on top by code: the held word in flat HUD green `#7FE6A3`, the red fixation point `#d8412f`, live words brightening on the page, the note "Illustrative view".

**Specs:** masters 2560×1440 (16:9) and 1440×1800 (4:5, recomposed, not centre-cropped). Safe area: top 30% and bottom 12% carry no key detail (caption band and tracker). Opaque, no transparency. Export AVIF plus a 16:9 JPEG fallback.

| Approach | Ground | Saved to | Budget |
|---|---|---|---|
| A — the object leads | `#000000` | `public/shades-a/view-16x9.avif`, `view-4x5.avif` | ≤ 90 KB, ≤ 60 KB |
| B — the book leads | book page, paper near `#f5f5f7` | `public/shades-b/view-16x9.avif`, `view-4x5.avif` | ≤ 150 KB, ≤ 100 KB |

**Approach A — the object leads.** Reference images: SH-FORM A first, SH-REF second (none when generating SH-FORM A itself).

```
SUBJECT: the DIGITAL SHADES study frame, an original eyeglasses design. Full-rim frame. Two softly squared lenses, each about 1.25 times wider than tall, corner radius about one fifth of the lens height. The top edges of both rims and the bridge form one straight, continuous brow line. Keyhole bridge, no separate nose-pad arms. Rim thickness even all the way round. Temples are straight flat-sided bars, about one and a half times the depth of ordinary eyewear temples from the hinge to mid-length, then tapering to a plain rounded tip. One simple barrel hinge per side. One thin plain cable leaves the tip of the wearer's right temple and runs out of the image. The lenses are clear and see-through. Nothing else is attached to, cut into, printed on or lit inside the frame or the lenses.
SCENE: the reader's own view through one clear, see-through eyeglass lens toward an open book. The lens rim is a softly squared shape with rounded corners, one matte mid-grey finish, about #86868b, out of focus, and it runs just inside the edges of the image like a frame around the view. Everything outside the rim is pure flat black #000000.
THROUGH THE LENS: an open hardback book on a matte black table, lit by one soft lamp from above, seen looking down at about 35 degrees. Paper is neutral white, near #f5f5f7, not cream. The pages carry fine grey lines of soft unreadable type only. Sharpest on a horizontal band across the middle of the right-hand page. The lens adds no tint, no darkening and no content.
COMPOSITION (16:9): the rim touches no key detail; the book fills the lower 65% of the view; the exact centre of the image is plain paper between two lines of type. The top 30% is the dark far edge of the table.
COMPOSITION (4:5, use instead for the phone master): the right-hand page and gutter only, the book in the lower 70%.
MOOD: quiet, exact, a study on a bench. Leave every lens empty: the site draws the word.
```

Negative prompt:

```
text, letters, numbers, readable words, heading, page number, logo, brand mark, watermark, signature, UI, HUD, hologram, display content in the lens, green light, glow, neon, bloom, lens flare, LED, light strip, camera, sensor window, microphone holes, speaker grille, button, touch pad, charging pins, circuit board, chip, battery, controller box, dock, visor, goggles, wraparound shield, angular gaming styling, vents, tinted or mirrored lenses, eye, eye chart, medical equipment, clinic, before-and-after comparison, gradient background, vignette, fog, bokeh lights, reflective floor, hands, face, person, second pair of glasses, any real eyewear product or brand design
```

**Approach B — the book leads.** Reference images: BOOK-01 (approved plate) first, SH-FORM A second.

```
SUBJECT: the DIGITAL SHADES study frame, an original eyeglasses design. Full-rim frame. Two softly squared lenses, each about 1.25 times wider than tall, corner radius about one fifth of the lens height. The top edges of both rims and the bridge form one straight, continuous brow line. Keyhole bridge, no separate nose-pad arms. Rim thickness even all the way round. Temples are straight flat-sided bars, about one and a half times the depth of ordinary eyewear temples from the hinge to mid-length, then tapering to a plain rounded tip. One simple barrel hinge per side. One thin plain cable leaves the tip of the wearer's right temple and runs out of the image. The lenses are clear and see-through. Nothing else is attached to, cut into, printed on or lit inside the frame or the lenses.
GROUND: a photograph of an open hardback book seen from the reader's own seated position, looking down at about 35 degrees. The book is square to the camera with the spine vertical, and the two pages fill the whole image past all four edges, so no table, desk or background is visible. Paper is neutral white, near #f5f5f7, not cream, with a colour-neutral grade. Both pages carry body text only, as evenly spaced fine grey lines of soft unreadable type: no legible word, no heading, no page number, no picture, no drop cap. One soft lamp from above, even light, no hard shadow.
OVER THE PAGE: the view is taken through one clear, see-through eyeglass lens. Its rim is a softly squared shape with rounded corners in one matte mid-grey finish, about #86868b, out of focus, running just inside the edges of the image like a frame. The page inside the rim is exactly as bright and as neutral as the page outside it. Focus is sharpest on a horizontal band across the middle of the right-hand page.
COMPOSITION (16:9): the rim sits about 6% in from every edge; the exact centre of the image is plain paper between two lines of type; the top 30% is quiet, softer page.
COMPOSITION (4:5, use instead for the phone master): right-hand page and gutter only, the rim about 5% in from every edge.
MOOD: a reading desk, calm and bright. Leave every lens empty: the site draws the word.
```

Negative prompt:

```
text, letters, numbers, readable words, heading, page number, logo, brand mark, watermark, signature, UI, HUD, hologram, display content in the lens, green light, glow, neon, bloom, lens flare, LED, light strip, camera, sensor window, microphone holes, speaker grille, button, touch pad, charging pins, circuit board, chip, battery, controller box, dock, visor, goggles, wraparound shield, angular gaming styling, vents, tinted or mirrored lenses, eye, eye chart, medical equipment, clinic, before-and-after comparison, gradient background, vignette, fog, bokeh lights, reflective floor, hands, face, person, second pair of glasses, any real eyewear product or brand design, table, desk surface, pen, cup, bookmark, lamp, window, second book, newspaper, cream or yellow paper
```

**Acceptance checklist**

- [ ] A: No readable word; the image centre is plain paper; outside the rim samples `#000000`; nothing is drawn in the lens.
- [ ] B: Same paper tone inside and outside the rim; centre is plain paper; no readable word; no content in the lens.
- [ ] Frame matches the identity paragraph line by line; nothing reads as a named part.
- [ ] Zoom to 200%: no letter, number, logo or lens content anywhere.
- [ ] Top 30% and bottom 12% are quiet enough for a white caption at 4.5:1 (B: after the site's one flat darkening value).

**Post-processing:** crop to exact size, no sharpening halo. Re-encode:
`node -e "require('sharp')('view-16x9.png').resize(2560,1440,{fit:'cover'}).avif({quality:45,effort:9}).toFile('public/shades-a/view-16x9.avif')"`
(4:5: `1440,1800`; B: `public/shades-b/`, quality 50). Alt text: `alt=""` (the stage heading and line are the text alternative, DESIGN.md §15.6).

### SH-GLASSES — stage "Glasses"

**Objective:** close on the whole frame at rest, so it reads as simple eyewear and the story returns to where it started.

**Placement:** `/projects/shades-a/` and `/projects/shades-b/` review routes (later `/projects/shades/`), the concept pin, stage "Glasses". Drawn live on top by code: a small green word and red point in the wearer's right lens, the caption, the concept note, the link to the roadmap.

**Specs:** masters 2560×1440 (16:9) and 1440×1800 (4:5, recomposed, not centre-cropped). Safe area: top 30% and bottom 12% carry no key detail (caption band and tracker). Opaque, no transparency. Export AVIF plus a 16:9 JPEG fallback.

| Approach | Ground | Saved to | Budget |
|---|---|---|---|
| A — the object leads | `#000000` | `public/shades-a/glasses-16x9.avif`, `glasses-4x5.avif` | ≤ 90 KB, ≤ 60 KB |
| B — the book leads | book page, paper near `#f5f5f7` | `public/shades-b/glasses-16x9.avif`, `glasses-4x5.avif` | ≤ 150 KB, ≤ 100 KB |

**Approach A — the object leads.** Reference images: SH-FORM A first, SH-REF second (none when generating SH-FORM A itself).

```
SUBJECT: the DIGITAL SHADES study frame, an original eyeglasses design. Full-rim frame. Two softly squared lenses, each about 1.25 times wider than tall, corner radius about one fifth of the lens height. The top edges of both rims and the bridge form one straight, continuous brow line. Keyhole bridge, no separate nose-pad arms. Rim thickness even all the way round. Temples are straight flat-sided bars, about one and a half times the depth of ordinary eyewear temples from the hinge to mid-length, then tapering to a plain rounded tip. One simple barrel hinge per side. One thin plain cable leaves the tip of the wearer's right temple and runs out of the image. The lenses are clear and see-through. Nothing else is attached to, cut into, printed on or lit inside the frame or the lenses.
STYLE: a design-study model photographed in a studio. Every solid surface is the same matte mid-grey model-board finish, about #86868b: no gloss, no metal, no texture, no material change. The lenses are clear uncoated blanks with only a faint edge. Background is pure flat black #000000 reaching every edge. The object floats: no floor, no horizon, no reflection, no shadow pool. One large soft key light from the upper left and a weak fill. The whole object is in focus. Colour-neutral, no tint.
CAMERA: three-quarter front view from slightly above eye level, about 30 degrees to the wearer's right side, 50 mm lens look. Temples folded closed behind the front. The wearer's right lens is nearest the camera.
COMPOSITION (16:9): the whole folded frame is centred, about 46% of the image width, between 34% and 84% of the height. The cable leaves toward the lower right corner. The top 30% and bottom 12% are plain black.
COMPOSITION (4:5, use instead for the phone master): the frame is about 76% of the width, inside the middle 50% of the height.
MOOD: quiet, exact, a study on a bench. Leave every lens empty: the site draws the word.
```

Negative prompt:

```
text, letters, numbers, readable words, heading, page number, logo, brand mark, watermark, signature, UI, HUD, hologram, display content in the lens, green light, glow, neon, bloom, lens flare, LED, light strip, camera, sensor window, microphone holes, speaker grille, button, touch pad, charging pins, circuit board, chip, battery, controller box, dock, visor, goggles, wraparound shield, angular gaming styling, vents, tinted or mirrored lenses, eye, eye chart, medical equipment, clinic, before-and-after comparison, gradient background, vignette, fog, bokeh lights, reflective floor, hands, face, person, second pair of glasses, any real eyewear product or brand design
```

**Approach B — the book leads.** Reference images: BOOK-01 (approved plate) first, SH-FORM A second.

```
SUBJECT: the DIGITAL SHADES study frame, an original eyeglasses design. Full-rim frame. Two softly squared lenses, each about 1.25 times wider than tall, corner radius about one fifth of the lens height. The top edges of both rims and the bridge form one straight, continuous brow line. Keyhole bridge, no separate nose-pad arms. Rim thickness even all the way round. Temples are straight flat-sided bars, about one and a half times the depth of ordinary eyewear temples from the hinge to mid-length, then tapering to a plain rounded tip. One simple barrel hinge per side. One thin plain cable leaves the tip of the wearer's right temple and runs out of the image. The lenses are clear and see-through. Nothing else is attached to, cut into, printed on or lit inside the frame or the lenses.
GROUND: a photograph of an open hardback book seen from the reader's own seated position, looking down at about 35 degrees. The book is square to the camera with the spine vertical, and the two pages fill the whole image past all four edges, so no table, desk or background is visible. Paper is neutral white, near #f5f5f7, not cream, with a colour-neutral grade. Both pages carry body text only, as evenly spaced fine grey lines of soft unreadable type: no legible word, no heading, no page number, no picture, no drop cap. One soft lamp from above, even light, no hard shadow.
ON THE PAGE: the frame lies folded on the lower right of the right-hand page, temples closed, lenses facing up. Every solid surface is one matte mid-grey model-board finish, about #86868b. The lenses are clear and see-through: the lines of type show through them. A soft, short contact shadow only where it touches the paper. The rest of both pages is free.
COMPOSITION (16:9): the frame is about 30% of the image width, in the lower right third. The left-hand page and the top 30% hold only lines of type.
COMPOSITION (4:5, use instead for the phone master): the frame is about 60% of the width, in the lower 40%.
MOOD: a reading desk, calm and bright. Leave every lens empty: the site draws the word.
```

Negative prompt:

```
text, letters, numbers, readable words, heading, page number, logo, brand mark, watermark, signature, UI, HUD, hologram, display content in the lens, green light, glow, neon, bloom, lens flare, LED, light strip, camera, sensor window, microphone holes, speaker grille, button, touch pad, charging pins, circuit board, chip, battery, controller box, dock, visor, goggles, wraparound shield, angular gaming styling, vents, tinted or mirrored lenses, eye, eye chart, medical equipment, clinic, before-and-after comparison, gradient background, vignette, fog, bokeh lights, reflective floor, hands, face, person, second pair of glasses, any real eyewear product or brand design, table, desk surface, pen, cup, bookmark, lamp, window, second book, newspaper, cream or yellow paper
```

**Acceptance checklist**

- [ ] A: Silhouette matches the Form plate; one material; no shadow pool; corners sample `#000000`.
- [ ] B: Frame matches the Form plate; left page is free for live words; no readable word.
- [ ] Frame matches the identity paragraph line by line; nothing reads as a named part.
- [ ] Zoom to 200%: no letter, number, logo or lens content anywhere.
- [ ] Top 30% and bottom 12% are quiet enough for a white caption at 4.5:1 (B: after the site's one flat darkening value).

**Post-processing:** crop to exact size, no sharpening halo. Re-encode:
`node -e "require('sharp')('glasses-16x9.png').resize(2560,1440,{fit:'cover'}).avif({quality:45,effort:9}).toFile('public/shades-a/glasses-16x9.avif')"`
(4:5: `1440,1800`; B: `public/shades-b/`, quality 50). Alt text: `alt=""` (the stage heading and line are the text alternative, DESIGN.md §15.6).

---

## 5. Model notes

Generic phrasing tips. Check each model's current documentation for exact sizes and flags.

**Both models**

1. State the aspect ratio twice: in the model's size or aspect setting, and in words inside the prompt ("16:9", "4:5 portrait"). Generate at the model's largest size on that aspect, then downscale with `sharp`; never upscale.
2. Put the empty area in positive terms ("the left 55% is completely empty flat black"). A negative alone ("no clutter") does not reserve space.
3. Name colours by hex and by word together ("warm white #f5f5f7"). Hex alone is often approximated; check with a colour picker and correct in post.
4. Where a model has no negative-prompt field, append the negative block as a last line: "Avoid: …".
5. Generate four candidates, pick one, then fix by editing that image. Do not re-roll a nearly right frame.
6. The acceptance checklist is the gate, not taste. A plate with one readable word is rejected.

**GPT Image 2**

- It follows long, ordered, structured prompts well: keep the SUBJECT / STYLE / CAMERA / COMPOSITION labels.
- It renders short text accurately, so say plainly when no text is wanted ("no letters anywhere, including on the book pages"), and for ICON-01 approach 3 quote the exact string and add "the only text is the single letter D".
- For BOOK-01 approach 1 use the edit endpoint with the photograph as input, and number the changes as written.
- Transparent backgrounds: ask for them only for the icon, if supported; every other image here is opaque.

**Nano Banana Pro**

- Strongest with reference images. Attach them in the order the card gives and refer to them as "reference image 1", "reference image 2" exactly as the prompts do.
- For the SHADES plates, "the exact object in reference image 1, unchanged" holds identity better than repeating adjectives.
- Edits are conversational: after a near miss, send one change at a time ("remove the page numbers; keep everything else").
- It tends to add believable text to books and paper. Repeat the no-readable-text line at the end of the prompt and inspect at 200%.

**After any model**

- Strip metadata and re-encode with the card's command; a static export does not optimise images.
- Record the model, date, prompt ID and approach in the commit message, and log the commit in `TODO.md`.
- Generated images of hardware need the on-page note the mockups already carry ("Design-study images. Not photographs of a built device.", draft in `PLAN.md` §7).
