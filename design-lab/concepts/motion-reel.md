# MOTION-BRAND — procedural brand reel

Render: `design-lab/renders/motion/reel.mp4` (v2, 1920×1080, 30 fps, 15.5 s, h264 yuv420p, 1.27 MB) ·
v1 kept at `renders/motion/reel-v1.mp4` · poster `renders/motion/reel-poster.png` (frame 430).
Source: `design-lab/motion-reel/src/reel/` (`tokens.js`, `timing.js`, `Chrome.jsx`, `SceneWork.jsx`, `SceneOwn.jsx`,
`SceneClose.jsx`, `Reel.jsx`), composition id `Reel` in `src/Root.jsx`.
Critique: `design-lab/critiques/motion-reel-gemini.md`.

```bash
cd design-lab/motion-reel
npx remotion render src/index.jsx Reel out/reel.mp4 --codec=h264 --crf=20
ffmpeg -i out/reel.mp4 -vf "scale=in_range=pc:out_range=tv,format=yuv420p" -c:v libx264 -crf 18 \
  -preset slow -movflags +faststart -an ../renders/motion/reel.mp4   # Remotion emits yuvj420p, so this converts it
npx remotion still src/index.jsx Reel ../renders/motion/reel-poster.png --frame=430
```

## Thesis

The reel delivers **"Make something worth putting your name on."** through the club's real mechanisms rather than
adjectives. One person (a dot) arrives at Thursday build night. The dot branches into the 7 real DG-001 subsystems,
and those lock into a phone. One subsystem is traced through the real ownership model. Then DG-002's RSVP mechanism
delivers the thesis one word at a time. The reel ends on an unsigned `BUILT BY ______` line, which collapses back into
the opening dot, so the loop reads "your name goes here → show up Thursday."

Narrative (§11): student → disciplines combine → project forms → real artifact → ownership → name.

## Content used, all real (CONTEXT-PACK §1)

| Element | Source |
|---|---|
| THURSDAY 6:00 PM · BUILD NIGHT; THURSDAYS 6:00 PM · BUILDING 17, ROOM 1635; NO PROJECT EXPERIENCE REQUIRED | org facts |
| 7 subsystem titles, DG-001 · MODULAR SMARTPHONE · ACTIVE | `lib/data/phoneV2.ts` |
| owner / review / test gate / repair plan + the 4 "one … per …" rules | `phoneV2.ts:295-300` |
| DG-002 · SMART READING · FPGA HEADS-UP GLASSES; RSVP, one word at a time, reader sets the pace | `projects.ts`, `experiments/glasses.ts` |
| Thesis, unsigned BUILT BY block | BRIEF, CONTEXT-PACK |

No stats, people, partners, photos, or dates. The on-screen RSVP rate (8 frames/word ≈ 225 wpm) is the reel's own
pacing. It is captioned "THE READER SETS THE PACE" and does not claim a device spec. Exploratory lines ("Seven
subsystems. One phone.", "You take a subsystem.") come from copy-analysis directions 3 and 4. Production copy still
goes through brand-voice-strategist → brand-guardian. No §40 banned slogans are used.

## Storyboard (v2)

| # | Time | Frames | Shot | Motion |
|---|---|---|---|---|
| 01 | 0.00–0.93 | 0–28 | Paper + dot grid. A centre dot (one person). `THURSDAY 6:00 PM · BUILD NIGHT` types in below it. | Mono type-on (6–22), caption out (26–32). The dot is present at frame 0 (loop seam). |
| 02a | 0.93–2.67 | 28–80 | 7 nodes radiate on a 300 px ring with hairline spokes, each labelled with a subsystem title. | Per-node settle spring, 4-frame stagger. |
| 02b | 2.67–4.60 | 80–138 | Nodes travel into a phone flat-lay (7 bands, leader lines, `01–07` mono index). Left side: `DG-001 · MODULAR SMARTPHONE · ACTIVE` / "Seven subsystems. / One phone." Band 03 fills ink at 4.27 s. | Settle spring over 34 frames. The outline draws by dash offset (inOut). Headline uses a cut reveal (mask rise), 6-frame line stagger. |
| 02→03 | 4.60–5.13 | 138–154 | Flat-lay exits left. | Opacity plus a 60 px drift, ease-in. Scene 03 waits for it to finish. |
| 03 | 5.13–8.67 | 154–260 | `03 · FIRMWARE / EMBEDDED · THE OWNERSHIP MODEL` / "You take a subsystem." Track with 4 stations. A marker stops at Owner → Review → **Test gate** (accent posts) → Repair plan, and each rule appears under its station. | Track draws (inOut). Marker travels on inOut with 4-frame holds. Station fills use a tick spring (one small overshoot). Labels rise 16 px. |
| 04 | 8.53–11.33 | 256–340 | HUD corner brackets + accent focal ticks. `DG-002 · SMART READING · FPGA HEADS-UP GLASSES`. Thesis words flash one at a time with the ORP letter in accent, pinned to the focal column. | Words cut on, with no tween, honest to RSVP. 8 frames per word. |
| 05 | 11.13–12.67 | 334–380 | Full thesis sets in two lines at 140 px. The period is accent. | Per-word cut reveal, 2-frame stagger. |
| 06 | 12.67–14.93 | 380–448 | `BUILT BY` + blank signature line drawing in; accent cursor blinks on it. Right: Thursday / Building 17 / no experience required. | Line draws (inOut). Cursor blinks 12 on / 8 off. Details stagger 4 frames. Hold ≈ 1.2 s. |
| seam | 14.93–15.5 | 448–464 | Everything fades except the signature line, which shrinks to a 24 px dot and travels to frame centre. Frame 464 equals frame 0. | Collapse (inOut, 10 frames) overlapped with travel (inOut, 12 frames). |

Persistent chrome: `DIGITAL @ CAL POLY POMONA` top-left, chapter index top-right (`01 BUILD NIGHT` … `06 SIGN IT`,
8-frame crossfade with a 10 px slide), and a 3 px accent progress rail at y=1012.

## Timing tokens (`timing.js`)

| Token | Value | Use |
|---|---|---|
| beat | 4 frames (133 ms) | stagger unit (nodes, details) |
| short | 8–10 frames | chapter swap, exits, seam collapse |
| medium | 14–20 frames | text reveals, station label rise |
| long | 24–34 frames | structural travel (flat-lay, track draw) |
| RSVP word | 8 frames | ≈ 225 wpm on screen |
| hold minimum | ≥ 1.0 s for any headline; end card ≈ 1.2 s fully set | readability floor |

## Easing and springs (`tokens.js`)

| Name | Definition | Where |
|---|---|---|
| `EASE.out` | cubic-bezier(0.16, 1, 0.3, 1) | all entrances (fast start, long settle) |
| `EASE.inOut` | cubic-bezier(0.65, 0, 0.35, 1) | travels, draws, camera-like moves, seam |
| `EASE.in` | cubic-bezier(0.4, 0, 1, 1) | exits only |
| `SPRING.settle` | `{ damping: 200 }` (critically damped) | node ring, flat-lay morph: structure never bounces |
| `SPRING.tick` | `{ damping: 14, stiffness: 180, mass: 0.5 }` | station fills, marker in: the only overshoot, reserved for "checked" moments |

Rule: structure settles, markers tick. No easing is used for RSVP words, because the mechanism is a hard cut.

## Type

| Role | Face | Size / weight / tracking |
|---|---|---|
| Display | Inter Tight (via `@remotion/google-fonts`) | 140 / 600 / −0.025em (thesis), 104 / 600 / −0.02em (scene heads), 120 / 500 (RSVP), 44 / 600 (station labels) |
| Labels | Inter Tight | 26 / 500 (subsystem names) |
| Metadata | JetBrains Mono | 20–24 / 500 / +0.08em, uppercase; 21 / 400 lowercase for the ownership rules |

Inter Tight is a deliberately neutral placeholder so the reel can serve any direction. Swap `FONT.display` for the
chosen concept's display face (Zodiak, Plex Condensed, Clash, Fraunces, Cabinet, Bricolage). Layout is left-aligned on
a 96 px margin, so a wider face only needs the thesis size retuned. JetBrains Mono is already the mono for A and E.
Minimum on-screen text is 20 px at 1080p.

## Palette

| Token | Value | Role |
|---|---|---|
| paper | `#F2EFE8` | ground (drafting stock, not a UI surface) |
| ink | `#141414` | all type and geometry |
| muted | `#6B675F` | metadata, chapter index |
| hair | `rgba(20,20,20,.16)` | spokes, unlit track |
| grid | `rgba(20,20,20,.11)` | 32 px dot grid (the one structural texture) |
| accent | `#D8412F` | progress rail, test gate, RSVP focal ticks + ORP letter, thesis period, BUILT BY cursor |

Why: paper/ink plus one accent follows the cross-spec invariant (one chromatic accent, no shadows), and it is the
production signal red, so nothing new is introduced. Every concept can re-token `accent` and `paper`. The accent marks
only "the point that matters" in each scene, five places in all, and is never decorative. There are no gradients, glow,
or violet.

## Site embed: reduced motion and poster plan

1. Never make the page depend on the reel (§11). Ship it as an optional figure, never as the hero's only content.
2. `<video muted playsinline loop preload="none" poster="reel-poster.webp">`. Start playback only when ≥50 % visible
   (IntersectionObserver) and pause offscreen and on `visibilitychange`.
3. `prefers-reduced-motion: reduce`: do not autoplay. Show the poster (frame 430: thesis + BUILT BY + Thursday
   details, which reads as a complete static card). Offer a visible "Play reel" button (44 px target) for opt-in
   playback.
4. Mobile / `saveData`: poster only, with a tap to play. 1.27 MB h264 is acceptable once opted in. Also export a
   720p, crf 26 variant for mobile if it is embedded.
5. Accessibility: `aria-label` or `<figcaption>` carrying the full text sequence. The thesis, the 7 subsystem names,
   the 4 ownership rules, and the Thursday / Building 17 line must also exist as real HTML on the page, never only
   inside the video. No audio track. RSVP word changes run at 3.75 per second, which is above WCAG 2.3.1's three-per-second
   count. Each change is a small-area ink-on-paper swap (the word covers under 10 % of the frame), which should fall
   under the small-area threshold. Verify with a PEAT check before embedding, or slow the words to 10 frames each.
6. The loop is seamless (see Revision), so `loop` does not produce a visible jump apart from the progress rail reset.

## Critique: my frame read vs Gemini (v1)

| Axis | Gemini (score) | My frame read (fps=2 contact sheet) | Verdict |
|---|---|---|---|
| Timing | 7.5: opening dot slow, end card leaves too fast | Agree. Scene 01 sat 1.5 s on a single dot; end card set for only 0.6 s before fade. | agree |
| Easing | 8.5: engineered damping, no bounce | Agree | agree |
| Readability | 7.0: 7 labels compete with the headline at ~4 s; ownership rules < 20 frames of rest; logistics fade too soon | Agree on logistics and ownership rest | agree |
| Hierarchy | 9.0 | Agree | agree |
| Brand fit | 9.5 | Agree it avoids SaaS/AI tropes. Gemini's "CI/CD pipeline" and "Klein" readings are its own embellishment. | agree, ignore embellishment |
| Loop | 6.0: linear fade breaks continuity; suggests collapsing the BUILT BY line into the opening dot | Agree | agree |
| Messy frames | 9.0: "transitions razor-sharp" | **Disagree.** v1 at 5.5 s overlapped the "Seven subsystems" exit with the "You take a subsystem" cut reveal, and at 3.5 s labels piled up mid-morph. Gemini's sampling missed both. | disagree |

Gemini Pro timed out (`UND_ERR_HEADERS_TIMEOUT`). The critique ran on `--model=gemini-flash-latest`.

## Revision

**One revision applied (v1 → v2): retime the reel and make the loop seamless**, following Gemini's highest-impact
call, with the 02→03 sequencing folded in because it is the same timeline edit.

1. Scene 01 trimmed by 22 frames (dot present at frame 0, caption types 6–22). All later beats shift 22 frames earlier.
2. Scene 03 now enters only after scene 02 has fully left (exit 138–154, title 156+). This removes v1's overlapped
   headline frame.
3. Ownership scene holds 32 frames after the last station (was 14). The end card holds ≈ 1.2 s fully set (was 0.6 s).
4. Loop seam: the linear fade is replaced. Everything fades except the blank signature line, which collapses into a
   24 px ink dot and travels to frame centre. Frame 464 matches frame 0, verified by rendering stills 0 and 464. The
   chapter label fades out at the end so frame 0 and frame 464 both show no chapter text.

Still open (next pass, not applied):
- 3.5 s: labels stack while nodes travel from the ring to the flat-lay. Fix: fade labels during travel (p 0.2–0.8) or
  route nodes on non-crossing paths.
- 11.2 s: the thesis cut reveal starts while the RSVP HUD is still fading (frames 334–340). Fix: start `thesisLine1`
  at 340.
- Possibly extend to 16 s if the end card needs a 1.5 s hold.
