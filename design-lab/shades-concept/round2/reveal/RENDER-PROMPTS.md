# SHADES reveal — render prompts (2 images)

For `/projects/shades-reveal/` only, under the `DESIGN.md` §11 image waiver in `../PLAN-R2.md` ("Revisions after the Fable plan audit"): object only, lens empty, matte, on literal black, max two renders, each captioned "Concept render. Not a built device." on the page. Until the Head Designer generates and approves them, the page shows the code stand-in (`app/(apple)/_shades-art/Glasses.tsx`, `mode="solid"`).

House style follows `design-lab/image-prompts/PROMPTS.md` (SH-REF wording for the frame, house negative prompt), with one change: these two are product renders, so soft studio light and form shading are allowed; glow, gloss and reflections are still not.

**Design change, 2026-10-09 (Head Designer):** the glasses are wired by one cable to an external controller box (compute and power live in the box; no software runs on the glasses), and the temples are deeper and heavier because they house components. Both prompts include the cable and the box. If the Head Designer prefers the glasses alone, delete the CABLE AND BOX paragraph and add "cable, box" to the negative prompt.

| ID | Page slot | Master | Ship | Budget |
|---|---|---|---|---|
| RV-HERO | Hero, beat 1 (`page.tsx`, `.heroObject`) | 3200×1600, 2:1 | AVIF 2000×1000 and 1200×600 (`<picture>` with `srcset`) | ≤ 140 KB and ≤ 60 KB |
| RV-CLOSE | Close, beat 5 (`page.tsx`, `.closeObject`) | 3200×1400, 16:7 | AVIF 1640×718 and 820×359 | ≤ 110 KB and ≤ 45 KB |

Proposed paths (not on disk): `public/shades-reveal/hero-3q.avif`, `public/shades-reveal/close-front.avif` (+ `-sm` variants).

## Shared subject block (paste into both)

```
SUBJECT: the SHADES concept glasses, an original eyewear design. Full-rim frame. Two softly squared lenses, wider than tall, the lower outer corners more rounded than the upper ones (a soft D shape). The top edges of both rims and the bridge form one straight, continuous brow line. Keyhole bridge with two small integrated nose pads, no metal pad arms. Rim depth even all the way round and generous, like thick acetate. Temples are deep, flat-sided bars, clearly heavier than ordinary eyewear temples, about twice the usual depth from the hinge to mid-length, then tapering to a plain rounded tip; they read as housings, but have no seams, vents, buttons, lights or markings. One simple concealed hinge per side.
CABLE AND BOX: one thin, plain, matte cable leaves the tip of the wearer's right temple and runs in a calm curve to a small plain rectangular box with rounded edges, about the size of a deck of cards, resting flat behind and to the side of the glasses. The box has no buttons, screen, ports, lights, text or seams.
LENSES: clear, lightly smoke-tinted, see-through, uncoated, with only a faint edge highlight. The lenses are EMPTY: nothing is shown, lit, printed or reflected inside them.
MATERIAL: every solid surface is one matte graphite finish, about #3a3b3f, like bead-blasted acetate. No gloss, no metal, no chrome, no texture, no material change, no colour.
GROUND: pure flat black #000000 reaching every edge. The object floats: no floor, no horizon, no reflection, no shadow pool.
LIGHT: one large soft key light from the upper left, a weak fill from the right, and a thin cool rim light along the top edges so the dark object separates from the black ground. The whole object is in sharp focus.
```

## RV-HERO — three-quarter, hero

**Objective:** in one glance the visitor sees a real-feeling product and is not misled: a calm studio render of an object, with nothing that implies it works (no display content, no glow).

**Placement:** under the `h1` "SHADES" and the concept line, centred, on `#000`. The caption "Concept render. Not a built device." is set in HTML under the image; nothing is drawn on top.

**Specs:** 3200×1600 master, 2:1, ground `#000000` to every edge (sample all four corners). Object fills about 78% of the width, centred, top of the frame at about 18% from the top. AVIF, 4:4:4 if the encoder allows (the black must stay `#000`, no banding), budgets in the table above.

**Prompt**

```
[SHARED SUBJECT BLOCK]
VIEW: three-quarter view from the front-left, the frame turned about 30 degrees, the camera slightly above the brow line, long lens, little perspective distortion. The wearer's left temple runs back toward the right of the image; the wearer's right temple is partly hidden behind the frame, and its cable drops behind the glasses to the box, which sits low at the right, small and out of the way.
COMPOSITION: 2:1, object centred, generous black space all round, the glasses clearly the subject and the box secondary.
STYLE: a quiet product studio render, like a design-review image of a matte prototype model. Neutral colour. No props.
```

**Negative prompt**

```
text, letters, numbers, readable words, logo, brand mark, watermark, signature, UI, HUD, hologram, display content in the lens, green light, red dot, glow, neon, bloom, lens flare, LED, light strip, light rays, camera, sensor window, microphone holes, speaker grille, button, touch pad, charging pins, ports, seams, screws, vents, circuit board, chip, battery visible, visor, goggles, wraparound shield, angular gaming styling, mirrored lenses, glossy plastic, metal, chrome, reflection, reflective floor, shadow pool, gradient background, vignette, fog, haze, bokeh, film grain, eye, face, person, hands, medical equipment, clinic, second pair of glasses, ASUS, ROG, Meta, Ray-Ban, XREAL, Vuzix, Even Realities, Google Glass, Apple Vision Pro, any real eyewear or headset product or brand design
```

**Acceptance checks**

- [ ] Object only: glasses, one cable, one plain box. No props, no person.
- [ ] Lens empty: zoom 400% on both lenses; no word, symbol, light or reflection of a screen.
- [ ] Matte: no specular hotspot brighter than the rim light; no chrome or gloss.
- [ ] No text, logo or brand anywhere (check temples, box, cable).
- [ ] Original design: does not match ASUS, Meta, Ray-Ban, XREAL or any real product silhouette (compare side by side with a reverse image search before shipping).
- [ ] All four corners sample `#000000`; AVIF under budget.
- [ ] Brow line straight, D-shaped lenses, deep temples: agrees with the code stand-in silhouette.

## RV-CLOSE — straight front, closing

**Objective:** close the page on the same object, seen square on, calmer than the hero, as the visitor reads the roadmap.

**Placement:** top of the closing section, above "Seven phases to a prototype.", centred on `#000`, with the same HTML caption under it.

**Specs:** 3200×1400 master, 16:7, ground `#000000`. Glasses fill about 72% of the width, horizontally centred, optical centre at 45% from the top. AVIF, budgets in the table above. Must be the same object as RV-HERO: generate with RV-HERO as reference image 1.

**Prompt**

```
[SHARED SUBJECT BLOCK]
Show the exact object in reference image 1, unchanged.
VIEW: straight front view, orthographic feel, the camera level with the lenses, both temples hidden behind the rims except their hinge blocks. The cable runs from behind the wearer's right temple down out of view; the box is not visible in this view.
COMPOSITION: 16:7, perfectly symmetrical, generous black above and below.
STYLE: a quiet product studio render, same light and finish as reference image 1.
```

**Negative prompt:** as RV-HERO, plus `perspective, turned head, visible box, tilted`.

**Acceptance checks**

- [ ] Object only; perfectly front-on and symmetrical.
- [ ] Lens empty, matte, no text, no logo, no brand.
- [ ] Original design, same object as RV-HERO (brow line, lens shape, rim depth match within a glance).
- [ ] Corners `#000000`; AVIF under budget.

## Post-processing

1. Crop to the master aspect; do not resize the object between the two renders.
2. Clip the ground to exactly `#000000` (levels, black point only; do not touch the object).
3. Export AVIF at the two sizes; check bytes against the table.
4. Replace the stand-in in `app/(apple)/projects/shades-reveal/page.tsx` with `<picture>` (`width`/`height` set, `alt` = the caption text, `fetchpriority="high"` on the hero only). Keep the HTML caption.
