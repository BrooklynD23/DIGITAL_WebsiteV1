# CINE: procedural cinematics (W1-CINE)

The 7 clips are rendered in code with Remotion. They use the live dot engine and the club's real KiCad geometry, with no video-generation models. Clips play on Signal ground `#0b0c0a` in bone ink, with at most one `#d8412f` mark per clip. The only text baked into a clip is a small mono label where it is needed; the page owns all captions.

## Clips (`public/design-lab/r2/cine/`)

| Name | s | Mode | What it shows | Rest / poster | mp4 16:9 · 4:5 (MB) | webm 16:9 · 4:5 |
|---|---|---|---|---|---|---|
| home-stages | 6 | once | Engine verbs form → orbit → scramble → wire, morphing by angular pairing, each stage held, a 01–04 rail with a red playhead | wire graph, playhead on 04 | 0.92 · 0.98 | 0.80 · 0.84 |
| sidekick-explode | 6 | scrub | Real power carrier and fingerprint boards in 30° iso, 7 tiers separating (sine in/out, locked camera), mono layer tags | fully exploded | 1.21 · 1.43 | 1.37 · 1.19 |
| sidekick-swap | 4 | once | Fingerprint module lifts, slides out, then back in with a quintic decel + seat overshoot; dashed empty seat | seated, red mark at J3 | 1.02 · 0.49 | 0.81 · 0.41 |
| shades-lightpath | 6 | scrub | text → RSVP timing → control → display → optics → fixation. Linear packet, solid live trail, dotted planned leader | path live, red fixation | 0.34 · 0.36 | 0.28 · 0.31 |
| shades-fixate | 4 | once | Engine `fixate`, then "focus" lands with the ORP letter (red) on the fixation point | word in reticle | 0.19 · 0.19 | 0.15 · 0.15 |
| brain-orb | 6 | loop | Ring-lattice orb turns TAU/6 per loop; 5 tools wire, call and return on uneven phases. Seamless, no red | frame 0 | 0.85 · 0.86 | 0.68 · 0.68 |
| brain-context | 5 | scrub | Lattice fills behind a red write head, evicts 2 oldest rows, then compresses 4 rows into a 7-slot summary | summary seated, head on next free slot | 0.57 · 0.54 | 0.47 · 0.45 |

Each clip ships 5 files: `<name>-16x9.{mp4,webm}` (1920×1080), `<name>-4x5.{mp4,webm}` (1080×1350), `<name>-poster.webp` and `<name>-poster-4x5.webp`. Every mp4 is ≤ 1.5 MB.

## Manifest + `<CineClip>` (`app/design-lab/r2/_system/cine/`)

```tsx
import { CINE, CineClip } from '@/app/design-lab/r2/_system/cine';
<CineClip name="sidekick-swap" />                                   // once: plays when ≥60% visible
<CineClip name="sidekick-explode" progress={p} />                   // scrub: p 0..1 from your scroll drive
<CineClip name="brain-orb" label="" eager />                        // loop: decorative hero bg, eager poster
<CineClip name="home-stages" fallback={<DotGlyph verb="wire" size={320} />} />
```

- `CINE[name]` returns `{ src16x9:{mp4,webm}, src4x5:{mp4,webm}, poster, poster4x5, duration, mode, label, ready }`. `ready:false` renders `fallback` (or nothing), never a broken video.
- Props: `name`, `mode?` (overrides the manifest), `progress?` (scrub), `fallback?`, `label?` (`''` = decorative), `aspect?` (`auto` picks 4:5 under 640px), `controls?` (default true; scrub never shows one), `threshold?` (0.6), `eager?`, `onEnded?`, `className`, `style`.
- Layers: the server HTML is a `<picture>` poster (4:5 source under 640px), so no-JS shows the rest frame. On the client a muted, `playsInline`, `preload="metadata"` `<video>` mounts with no `autoplay` attribute. It fades in on `loadeddata`, and preload moves to `auto` within half a viewport.
- once plays on IO entry, and the 44px button cycles pause / play / replay. loop plays while on screen and pauses offscreen, with a pause/play button. scrub keeps the video paused and sets `currentTime` from `progress` through rAF steps that stop once settled, so there is **0 rAF at rest**.
- Reduced motion shows the poster only. once and loop never autoplay and offer an opt-in "Play animation" button. scrub stays on the poster, which is the final frame.
- The root wraps media in a `role="img"` box labelled from the manifest. The control sits outside that box as a real `<button>`.
- Sizing: the clip fills its container's width at 16/9, or 4/5 under 640px. Set height/aspect yourself via `className`. The ground is `#0b0c0a`, so in Apple dark chapters (`#000`) place clips in a `#0b0c0a` well or full-bleed.

## Pipeline

```bash
node design-lab/scripts/r2-cine-render.mjs [name…] [--aspect=16x9|4x5] [--encode-only]   # render + encode + posters
node design-lab/scripts/r2-cine-sheet.mjs [name…] [--aspect=4x5]   # fps=2 contact sheets → round2/system/renders/cine/
cd design-lab/motion-reel && npx remotion studio src/index.jsx     # compositions <name>--16x9 / <name>--4x5
```

- Source lives in `design-lab/motion-reel/src/r2/`: `register.jsx` (registered from `Root.jsx`), `clips/*.jsx`, `DotLayer.jsx` (the DotGlyph mapping), `IsoBoard.jsx` (the BoardSvg tiers + ISO matrix in one shared SVG, so the boards share a mm scale) and `engine.js`. `engine.js` imports `_system/dots` and `_system/boards` **by relative path**: one engine and no copies. Fonts are Geist Mono and Atkinson Hyperlegible Next, imported from `_system/fonts`.
- Deterministic: every value is a pure function of the frame. Rendering frame 110 twice gave byte-identical PNGs.
- Encode: a Remotion h264 crf 8 intermediate goes through `scale=in_range=pc:out_range=tv,format=yuv420p`. Then:
  - mp4: `libx264 -preset slow -tune animation`, CRF stepped 20→34 until ≤ 1.5 MB, `+faststart`, `-an`.
  - webm: VP9 `-b:v 0`, CRF stepped 34→52, `-row-mt 1`.
  - GOP: scrub `-g 15 -keyint_min 15 -sc_threshold 0`; once/loop `-g 60`.
  - Poster: the rest frame → `libwebp -quality 82`.
- The explode clip is the costliest: dense line art and a GOP of 15 push it to crf 26–30 mp4 and crf 46–49 webm. Frame crops at those settings stay clean.

## Gemini review (`round2/critiques/cine-gemini.md`) vs our frame read

| Gemini said | Our read | Action |
|---|---|---|
| Explode layer tags too small | Agree: 16px tags fall to about 8px at half width | Raised to 26/24px at 500 weight in ink-2; leaders 1.5px |
| home-stages floaty, needs holds and a snap | Agree: verbs used their whole window | Verbs now finish at 78% of the window and hold; the rail playhead snaps (easeOutBack, capped 3%) |
| Swap insertion lacks mass | Agree | Slide-in uses quintic decel, then the existing seat overshoot |
| Lightpath: discrete dots are hard to track when scrubbed | Partly: a solid trail already exists, but at 1.5px it was weak | Trail raised to 2.5px at 0.95; labels to 22px |
| Orb packets fire on a metronome | Agree | Uneven phase offsets [0, .17, .43, .58, .81], still periodic |
| Fixate dots "vanish" as the word cuts in | Disagree: the dots converge into the point (engine `fixate`), and the word only cross-fades with it | No change; the verb is the shared engine contract |
| Context should ripple-scale instead of fading | Disagree: fill is already staggered per slot, with radius 0.6→1 | No change |

## Known gaps

1. There is no in-browser test route for `<CineClip>` (none was requested). Page agents get the first live rAF and seek check; tsc is clean.
2. All clips sit on the Signal ground, so the Apple light chapters need a dark well. No light-ground variants exist.
3. The explode scrub at GOP 15 is near budget. If a page wants a sharper clip, raise the budget or render the scrub at 24 fps.
