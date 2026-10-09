# CINE: procedural cinematics (W1-CINE, refined W3a)

The 7 clips are rendered in code with Remotion. They use the live dot engine and the club's real KiCad geometry, with no video-generation models. Each clip has 2 worlds and carries at most one `#d8412f` mark. The only text baked into a clip is a small mono label where it is needed; the page owns all captions.

| World | Ground | Ink | Boards | File stem |
|---|---|---|---|---|
| `signal` (default) | `#0b0c0a` | bone `#ece8de` / `#a8a396` / `#8c887d` | bone-copper `#c9c2b0` | `<name>-16x9.mp4` … |
| `apple` | `#000` (= `[data-tone='dark']`) | `#f5f5f7` / `#a1a1a6` / `#86868b` | copper `#c9965f` (apple/sidekick `--board-copper` on dark) | `<name>-apple-16x9.mp4` … |

All 7 clips have an apple variant. Every Apple chapter is `#000` or a dark well, so the Signal ground would show as a box anywhere in that world.

## Clips (`public/design-lab/r2/cine/`, mp4 MB: signal 16:9 · 4:5 / apple 16:9 · 4:5)

| Name | s | Mode | Encode | mp4 MB | Rest / poster |
|---|---|---|---|---|---|
| home-stages | 6 | once | 30 fps, GOP 60, 1920×1080 / 1080×1350 | 0.93 · 0.98 / 0.86 · 0.91 | wire graph, red playhead on 04 |
| sidekick-explode | 6 | scrub | **15 fps all-intra**, 1280×720 / 864×1080 | 1.29 · 1.47 / 1.33 · 1.24 | fully exploded, layer tags |
| sidekick-swap | 4 | once | 30 fps, GOP 60, full | 1.02 · 0.49 / 1.08 · 0.52 | seated, red mark at J3 |
| shades-lightpath | 6 | scrub | **15 fps all-intra**, full | 1.47 · 1.41 / 1.35 · 1.33 | path live, red fixation point |
| shades-fixate | 4 | once | 30 fps, GOP 60, full | 0.19 · 0.19 / 0.18 · 0.17 | "focus", ORP "o" bold bone on the fixation point (no red) |
| brain-orb | 6 | **loop** | 30 fps, GOP 60, full | 0.86 · 0.86 / 0.74 · 0.74 | frame 0 (seamless) |
| brain-context | 5 | scrub | **15 fps all-intra**, full | 1.43 · 1.49 / 1.36 · 1.39 | summary seated, bone write-head ring on next free slot (no red) |

There are 84 files (58 MB on disk). Per clip and world: `-16x9.{mp4,webm}`, `-4x5.{mp4,webm}`, `-poster.webp` and `-poster-4x5.webp`. Every mp4 is ≤ 1.5 MB.

The scrub webms (VP9 intra, 1.2–2.4 MB) are only a fallback for browsers without H.264, because scrub sources list mp4 first.

## Scrub seeking (`node design-lab/scripts/r2-cine-seek.mjs`, Chrome 1440, set → `seeked`)

| | median | p90 | max |
|---|---|---|---|
| Before (GOP 15, 30 fps), 12 files | 18–46 ms | 26–94 ms | 126 ms (explode 16:9) |
| After (all-intra, 15 fps), 24 files | 6–19 ms | 12–23 ms | 37 ms |

Results are in `renders/cine/seek-{before,after}.json`. The page probe saw 113–407 ms under scroll load; re-measure it in-page.

## API (`app/design-lab/r2/_system/cine/`)

```tsx
import { CINE, CineClip, markerIndex, type CineClipHandle } from '@/app/design-lab/r2/_system/cine';
<CineClip name="sidekick-swap" world="apple" />                              // once
<CineClip name="brain-orb" world="apple" eager label="" maxLoops={3} />      // loop: hero bg, pauses after 3 loops
<CineClip name="sidekick-explode" world="apple" ref={clipRef} />             // scrub: clipRef.current.setProgress(p) per frame
<CineClip name="shades-lightpath" world="apple" progress={p} fallback={<LightPath />} />
const step = markerIndex('shades-lightpath', p);                             // caption i, synced to the packet
```

- `CINE[name]` returns:
  - `worlds.{signal,apple}`: `{ src16x9, src4x5, poster, poster4x5, ground }`.
  - `duration`, `mode`, `label`, `order` (`mp4-first` for scrub) and `ready`.
  - `markers: {id, at}[]`, where `at` is a fraction of the duration.
  - The top-level `src16x9/src4x5/poster/poster4x5` still equal `worlds.signal`, so the old shape keeps working.
- Markers:
  - **lightpath:** text-source .078 · word-timing .240 · control .402 · display .564 · optics .727 · fixation-point .889. Stage *i* is reached at frame (14 + 29.2·i)/180.
  - **context:** fill .053 · full .467 · evict .480 · compress .667 · summary .920.
  - **explode:** start .078 · tags .565 · carrier .833 · module .922.
  - **home-stages:** .000 / .289 / .556 / .822.
  - **swap**, **fixate**, and **orb** (call-k / result-k) are listed in `manifest.ts`.
- `<CineClip>` props:
  - `name`, `world` (`'signal'` default), `mode?`, `progress?`, `fallback?`, `label?`.
  - `aspect` (default **`'auto'`**: 4:5 under 640px), `controls?`, `threshold?`, `maxLoops?`, `onTime?(s)` (timeupdate or scrub seek, no rAF), `eager?`, `onEnded?`.
  - `ref`: `{ setProgress, play, pause, video }`.
- Behaviour:
  - The server, no-JS and reduced-motion states all show the `<picture>` poster.
  - `once` plays on ≥60% entry. A rejected `play()` now retries on the next entry instead of being dropped.
  - `loop` pauses offscreen.
  - `scrub` uses rAF only while the target moves, so there is 0 rAF at rest.
  - The control and the ground follow `data-world`: Apple is `#000` with a `rgba(66,66,69,.72)` disc and a `#f5f5f7` glyph; Signal is bone on near-black.

### Migration for page agents (7 call sites)

1. Pass `world="apple"` on every Apple-world clip:
   - `apple/sidekick/page.tsx:130`
   - `apple/sidekick/ApplePinned.tsx:80`
   - `apple/shades/LightPin.tsx:33`
   - `apple/shades/FixateClip.tsx:41`
   - `apple/_home/Highlights.tsx:15`
   - `apple/brain/page.tsx:67`
   - `_brain/DemosB.tsx:78` (when `world === 'apple'`)
2. Remove `aspect="16x9"` (`apple/sidekick/page.tsx:130`, `ApplePinned.tsx:80`) so phones get the 4:5 render.
3. BRAIN hero: drop `mode="once"` (brain-orb is authored as `loop`), add `eager`, and optionally `maxLoops={3}`. Drive the trace row from `onTime`.
4. Scroll scrubs: replace per-frame `setState(progress)` with `ref.current.setProgress(p)`, so React does not re-render.
5. SHADES LightPin: switch captions with `markerIndex('shades-lightpath', p)` on the same `p` the clip gets. Drop the separate `k` remap.

## Pipeline

```bash
node design-lab/scripts/r2-cine-render.mjs [name…] [--world=signal|apple] [--aspect=16x9|4x5] [--encode-only]
node design-lab/scripts/r2-cine-sheet.mjs [name…] [--aspect=4x5]     # fps=2 contact sheets → renders/cine/
node design-lab/scripts/r2-cine-seek.mjs [file…] [--out=…]           # scrub seek latency (real Chrome, H.264)
```

- Source lives in `design-lab/motion-reel/src/r2/`:
  - `register.jsx` registers `<name>--<aspect>` (signal) and `<name>--apple--<aspect>`.
  - `tokens.js` holds `PALETTES` + `useC()` context.
  - `clips/*.jsx` are the 7 clips.
  - `IsoBoard.jsx` and `DotLayer.jsx` are the shared renderers.
  - `engine.js` imports `_system/dots` and `_system/boards` by relative path.
- Renders are deterministic: every value is a pure function of the frame.
- Encoding:
  - **once/loop:** libx264 `-preset slow -tune animation`, CRF 20→34 to ≤ 1.5 MB, plus VP9 webm.
  - **scrub:** `fps=15`, `-g 1 -keyint_min 1 -bf 0`. It tries full resolution at crf ≤ 28 first, then 1280×720 / 864×1080 at crf ≤ 32. Only explode needs the step-down, at crf 28–30.
  - All outputs: yuv420p tv-range, `+faststart`, and posters from the rest frame as webp q82.

## Changes in W3a

1. Apple-world variants for all 7 clips, with copper boards on `#000`.
2. Scrub clips are now all-intra at 15 fps, with mp4 listed first.
3. shades-lightpath:
   - The QFP chip and the word clock now sit at stage 2, and control is a pause/play pill. Both match `_shades/LightPath.tsx`.
   - Labels now read Text source / Word timing / Control / Display / Optics / Fixation point (sentence case since the finish fixes).
4. Manifest additions: `worlds`, `markers` and `order`. `<CineClip>` gains `world`, `maxLoops`, `onTime`, a ref handle and world-token chrome, plus the once-retry fix.
5. shades-fixate: the horizontal reticle ticks fade out as the word lands, so they no longer read as dashes beside "focus".

Earlier Gemini review and revision: `round2/critiques/cine-gemini.md`. Explode tags were enlarged; home-stages got holds and a playhead snap; the swap return got a heavy decel; the lightpath trail is heavier; orb tools fire on uneven phases.

## Finish-review fixes

1. **shades-fixate:** the pivot letter is now bold (700) in the clip's ink instead of red. The anchor dot is the only red, and pages place it.
2. **shades-lightpath:** labels are sentence case.
   - 4:5 is now one glyph column with labels to the right at 42 px, which is ≥ 15 CSS px when the clip is 390 px wide. The optics lens turns 90° to suit the vertical path.
   - 16:9 labels are 24 px.
   - Timing is unchanged, so the markers stand.
3. **brain-context:** the red write head is replaced by a bone ring + dot, in both worlds.
4. **Red per clip:**
   - Red remains only in home-stages (rail playhead), sidekick-swap (J3 seat) and shades-lightpath (the fixation point, the diagram's anchor dot).
   - explode, fixate, orb and context carry no red.

## Known gaps

1. brain-orb is 16:9 / 4:5 only. The BRAIN critique asks for a 1:1 ~560px stage, which pages can crop with `object-fit: cover`; a 1:1 render is not made yet.
2. The 15 fps scrub reads smooth through the CineClip ease. A direct `currentTime` drive would show 67 ms steps.
3. 58 MB of media in `public/` is not gitignored, so it goes into the commit.
