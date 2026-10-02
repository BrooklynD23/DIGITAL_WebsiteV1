Method: dual-agent (A: design-review sub-agent · B: detector + overlay sub-agent) · synthesis, motion and facts by W2-CRIT-SIDEKICK

# SIDEKICK critique: round 2, wave 2

**Verdicts.** Signal Capture: **fix**. Apple played straight: **fix**. Neither needs a rebuild. Both pass the 0-rAF gate and get the facts right. Both fail the quiet-viewport budget (13–26% against a 45% target). Signal's teardown also janks on scroll, because it animates inside a single large inline SVG.

Evidence lives in `design-lab/renders/r2/crit/sidekick/`:

| File | Contents |
|---|---|
| `{signal,apple}-{1440,390}-step00..09.png` | 10 scroll stills per world and viewport |
| `sheet-*.png` | Contact sheets of those stills |
| `{signal,apple}-1440.webm` | Screen recordings |
| `frames-*/`, `fsheet-*.png` | Frames at 4 fps |
| `apple-pin-{25,50,75}.png` | Pinned-chapter stills |
| `nojs-rm-compare.png` | No-JS vs reduced-motion comparison |
| `*-kbd-tab20.png` | Keyboard focus still |
| `shoot-report-*.json`, `scrub-report.json`, `paint-report.json`, `raf-*.json` | Measurement output |
| `gemini.md` | Gemini motion critique |

Scripts are in `design-lab/scripts/`: `r2-crit-sidekick-{shoot,scrub,paint,stall,rest2}.mjs`.

---

## 0. Measured facts (both worlds)

| Check | Signal | Apple | Gate |
|---|---|---|---|
| r2 rAF at rest (`r2-sidekick-raf.mjs`, 6 scenarios) | 0 | 0 | PASS |
| rAF at rest, parked inside the scrub pin at 25/40/75% (`r2-crit-sidekick-rest2.mjs`) | n/a | 0 / 0 / 0 after settle | PASS |
| rAF while scrubbing (Apple pin) | n/a | 34.7/s, only while scrolling | OK |
| Console errors at 1440/390 | 0 | 0 | PASS |
| Horizontal overflow at 390 | none | none | PASS |
| Frames over 120 ms while scrolling (SwiftShader, 48 px steps, 3 passes) | **pass 1: 3; pass 2: 21; pass 3: 18. Each 0.3–4.2 s, all inside `#teardown`** | 0 / 0 / 0 | **Signal FAIL** |
| HTML size | 605 KB (99 KB gzip) | 763 KB (119 KB gzip) | heavy |
| Carrier outline path serialised per page | 10× (6 markup + 4 RSC) | 16× (10 + 6) | waste |
| Page length 1440 / 390 | 13.6 / 14.7 vh | 18.8 / 19.1 vh | — |
| Reduced-motion length 1440 | 5,725 px (−53%) | 9,611 px (−43%) | designed state ✓ |
| No-JS length 1440 | 12,216 px (= JS length, full of empty gaps) | 13,701 px | see fixes |
| Word parity, RM vs no-JS vs JS | 453 = 453 | 582 = 582 | PASS |
| `impeccable detect` CLI | 0 findings (exit 0) | 0 findings | clean |

**The Signal jank, explained.** `useStackDrive.ts:58-64` writes `--e` on every tier on every scroll frame. `stack.module.css:32` turns `--e` into `transform: translateY(...)` on `<g data-layer>` groups *inside* the board `<svg>`. Transforms inside an SVG are not composited, so every frame re-rasterises the whole carrier drawing (431 pads, 36 footprints) and the fingerprint drawing.

On top of that, `stack.module.css:20` puts a 420 ms spring `transition` on each tier's scroll-driven transform. That time-eases a scrub, which the playbook bans ("do not time-ease the scrub", apple-playbook §12b). The Apple page avoids both problems because its scrub is a video.

SwiftShader exaggerates absolute times. The relative result is still clear: Apple has 0 slow frames, Signal has 3–21 per pass, and the slowness repeats on every pass instead of being a one-off first paint.

The Signal recording shows the effect directly. The page appears frozen on entry 01 for about 15 s (`fsheet-signal-v2.png`, 19–35 s).

**The Apple scrub.** It is rAF-quiet at rest and tracks within 4.2% of progress on average (max 8.4%). Seek latency is p50 113 ms, p90 261 ms, max 407 ms.

The cause is the clip's encoding:
- `sidekick-explode-16x9.webm` has a keyframe every 15 frames: 12 keyframes in 180 frames.
- The mp4 also has a keyframe every 0.5 s.

Each seek therefore decodes up to 14 frames.

Fix: re-encode the **scrub** clip with a 1–3 frame GOP. In ffmpeg that is `-g 1` (all-intra) for VP9 and `-g 2 -bf 0` for H.264. 180 frames at 1080p all-intra comes to roughly 3–5 MB, which is acceptable for the page's only scrubbed asset.

---

## 1. Signal Capture: `/design-lab/r2/signal/sidekick/`

### 1.1 Critique (impeccable, Experience mode)

**Design specificity: high.** Only this club could ship this page:
- the measured carrier is the hero;
- a `CUR L03 · F.Cu · Front copper` readout;
- the struck and dashed line-form states;
- the pause-and-branch timebase SVG (`page.tsx:23-46`);
- "Two are real KiCad boards. Three are drawn as outlines."

The band layout is the weak spot. A sticky picture beside a scrolling key/value list is concept E's skeleton reskinned. The oscilloscope character lives in the readout strip, not in the walk.

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of status | 2 | The readout is good, but after a swap every tier reads "seat 01 open" (`SignalTeardown.tsx:84`). The readout is `aria-hidden` (`:78`) |
| 2 | Match with the real world | 2 | B.Cu, F.Silk, CUR L03, "timebase scroll", I²C and "100-pin mezzanine" go unglossed. The headline promises "A phone", but the object never reads as one |
| 3 | User control | 2 | The band is about 9.3 of 13.6 vh, with no skip to Status and no jump to a module |
| 4 | Consistency | 3 | Line form is consistent. Red appears 2–3 times per viewport (see Fix 6) |
| 5 | Error prevention | 3 | The swap is reversible, but its state persists after you scroll away |
| 6 | Recognition over recall | 2 | The stack carries only the dim numbers 01–05; names live only in the scrolling list |
| 7 | Flexibility | n/a | Experience surface |
| 8 | Aesthetic and minimalist | 2 | Strong type, but 165 vh entries leave 70–80% of the right column empty (`signal-1440-step05/06.png`). Each entry has 6 data units |
| 9 | Error recovery | 3 | Nothing fails |
| 10 | Help | n/a | Experience surface |
| **Total** | | **19/32 (59%)** | **Acceptable** |

**Cognitive load: 4 of 8 checks fail.**
- **Chunking:** 5 modules × 6 units = 30.
- **Working memory:** numbers on the object, names off it.
- **Progressive disclosure:** Scope, Risk and Owner are always open.
- **Choices:** 5 inert seats in Join.

"Owner: Unassigned" appears 10 times (5 in the walk, 5 in Join) and carries zero information. "Scope" duplicates the Status "Next" list.

**Emotional journey.**
- **Peak:** the hero. The phosphor carrier, measured.
- **Second peak:** the swap. A red open-seat dot appears where the module was.
- **Valley:** entries 04–05, the outline tiers. A whole viewport of empty graticule (`signal-390-step04.png`).
- **End:** a calm but static join, whose only action is a Discord text link.

### 1.2 Audit

| # | Dimension | Score | Key finding |
|---|---|---|---|
| 1 | Accessibility | 2 | Inactive tier tags 02–05 are **1.75:1** at 11 px (`stack.module.css:48` dims the whole tier to 0.38). `[confirm]` is 11 px, below the world's 12 px label floor (`sidekick.module.css:67-71`). `aria-labelledby` sits on a plain `div` (`SignalTeardown.tsx:64`). `aria-pressed` is combined with a label that changes (`:140`). The readout is `aria-hidden` |
| 2 | Performance | 1 | Repeated 0.3–4.2 s scroll frames from SVG-internal transforms plus a time-eased scrub (see §0). The carrier is serialised 10× (605 KB HTML) |
| 3 | Responsive | 3 | No overflow. At 390 the stack is 30 svh, about 100 px wide, above roughly 60% empty graticule (`signal-390-step04.png`). Channel links are 25×44 (passes on height) |
| 4 | Theming | 3 | Tokens are used throughout. The owner glyph's red anchor breaks the "single red marker" rule |
| 5 | Integrity | 3 | The detector found 0. The overlay's "grid background" hit is a false positive (the graticule is the world). Section numbers 01–05 are allowed here because they lock the object to the list, which is exactly the job E's numbers did |
| **Total** | | **12/20** | **Acceptable** |

Overlay notes (Assessment B):
- 29 undersized-text hits and the cursor hits are false positives. They come from production chrome that `r2/layout.tsx:16-18` hides.
- Heading-rhythm and cramped-padding hits are false positives: margin 0 by design, and `min-height: var(--r2-target)` sets the height.

### 1.3 Contract compliance (`.impeccable/surfaces/app-design-lab-r2-signal-sidekick-page-tsx.md`)

| Block | Status | Evidence |
|---|---|---|
| THESIS: honest teardown, every layer a seat, no product hero | **met** | Status chapter, struck "Never started" list, `[confirm]` tags throughout (`signal-1440-step07.png`) |
| OWN-WORLD: graticule, bone line art from real files, wide caps, mono for measured values, line form, **one red caret, nothing else red** | **partial** | Everything else holds. Red also appears on the owner-glyph anchors (5 in the walk, 5 in Join) and the swap seat dot (`signal-1440-step01.png`, Owner row) |
| STORY: see real boards → what exists/paused/never started → trust → take a subsystem | **partial** | The arc is all there. "Nothing fabricated or tested" sits about 10 vh down, behind the 165 vh-per-entry band, with no skip |
| FIRST VIEWPORT: CH1 readout, 5-word 72 px headline, lead, struck paused line, carrier iso about 560 px with a **measurement cursor** reading 49.0 × 41.0 | **partial** | The board is 528 px wide (`shoot-report-all-steps.json` heroFig). The measurement renders as a caption row ("A 49.0 mm B 41.0 mm"), not as a cursor on the object (`signal-1440-step00.png`) |
| SIGNATURE: scroll timebase, one gap per entry, the active board separates, the readout reports layer and subsystem; keyboard-operable swap | **partial** | Mechanically correct, but it janks (§0). The swap is a real button but inert without JS. The readout lies after a swap |
| FORM / FINISH | **pending** | W3 |

### 1.4 Copy budget (`r2-words.mjs`)

| | Viewports | Avg | p90 | Max | Quiet (≤12 words) | Target |
|---|---|---|---|---|---|---|
| 1440×900 | 14 | 29 | 53 | 55 | **21% (3/14)** | ≥45% |
| 390×844 | 15 | 27 | 41 | 45 | **13% (2/15)** | ≥50% mobile |

Per viewport at 1440: `45 53 0 37 31 2 35 0 32 21 14 55 46 39`.

The two 0-word viewports and the one 2-word viewport are the band's empty half-columns. They count as quiet, but they are quiet the wrong way: the object is small and nothing changes. Headlines all fall within 3–6 words; the lead is 16 words.

### 1.5 Motion verdict

| Motion | Purpose | Verdict |
|---|---|---|
| Stack gap opens one per entry (scroll) | Progress = explode, the right idea | **Rework**: the per-tier 420 ms spring transition time-eases the scrub, and SVG-internal layer transforms jank |
| Active board's layer separation (`subExplode`) | Shows the board is real copper and silk | Good idea, wrong renderer |
| Readout swap | Live state | Good. It needs `aria-live` and must stop reporting "seat 01 open" for every tier |
| Swap (button) | Signature beat, the open seat | Good, and keyboard-operable. Not wired without JS |
| Rest | — | 0 rAF ✓ |

Gemini cross-check: see §4.

### 1.6 Fix now, ranked (Signal grammar)

1. **[P1 · perf] Composite the explode.**
   - **Where:** `stack.module.css:32` (layer transform inside the SVG) and `:20` (spring transition on a scroll transform). Evidence: `paint-report.json`, `fsheet-signal-v2.png`.
   - **Fix:**
     1. Render each board layer as its own stacked `<svg>`/`<img>` box (one per `data-layer`). Ideally use static per-layer SVG files emitted by `kicad-to-json.mjs`.
     2. Translate the boxes. Set `will-change: transform` only while `data-exploding`.
     3. Drop the transform `transition` on `.tier`, so the scroll position *is* the timebase.
   - **Pass:** 0 frames over 120 ms in `r2-crit-sidekick-stall.mjs`.
2. **[P1 · quiet viewports] Collapse the walk to the active entry, a channel list, and a disclosure.** Full spec in §3.1. Short form:
   1. Entries shrink to 70 vh.
   2. A locked 5-row channel list (name and line-form mark) sits on the graticule beside the stack, with leader traces to each tier.
   3. Only the active entry shows its one-line description.
   4. Scope and Risk move into a closed `<details>` ("Scope · risk").
   5. Owner moves onto the object as dashed seat marks, with one line under the stack: "Every seat open."
   - **Target:** at least 45% quiet viewports at 1440 and at least 50% at 390.
3. **[P1 · a11y/state] Fix the swap state and its semantics.**
   - **Where:** `SignalTeardown.tsx:84`, `:140`, `:78`, `:64`.
   - **Fix:**
     1. Show "seat 01 open" only while tier 01 or the swap step is active.
     2. Re-seat on leaving the swap step.
     3. Use one constant label with `aria-pressed`.
     4. Readout gets `aria-live="polite"`, not `aria-hidden`.
     5. The band becomes a `<section>`.
4. **[P1 · no-JS] Make the swap work without JS.**
   - **Where:** `SignalTeardown.tsx:139-149`. The button is inert without JS.
   - **Fix:** a CSS-only toggle. Use a visually hidden `<input type="checkbox" id="swap">` plus a `<label>` styled as the trace button, with `.band:has(#swap:checked) [data-tier='fingerprint'] .slide { … }`. It stays keyboard-operable (Space), needs no JS, and JS can still mirror the state into the readout.
5. **[P2 · no-JS] Gate the long timebase.**
   - **Where:** `sidekick.module.css:236` (`min-height: 165vh`) applies without JS, so the no-JS page is 12,216 px of mostly empty graticule (`nojs-rm-compare.png`).
   - **Fix:** use the reduced-motion layout (`:597-601`) as the default. Apply the tall entries only under `[data-enhanced]`, which `useStackDrive` already sets.
6. **[P2 · world] One red only.**
   - **Where:** the owner `GlyphSeat` anchor (walk and Join) and the seat dot.
   - **Fix:** render owner seats as `GlyphSeat state="idle"` without the anchor in lists. Keep red for the caret and the single open seat that the swap reveals.
7. **[P2 · first viewport] Make the measurement a cursor.**
   - **Fix:**
     1. Draw two graticule cursor lines with mono tick labels (`A 49.0 mm`, `B 41.0 mm`) on the carrier's iso edges, as the contract specifies.
     2. Raise the board to the specified 560 px.
     3. Drop the separate figcaption row.
8. **[P3 · a11y] Fix legibility.**
   - **Fix:**
     1. Tier tags: dim the board, not the tag. Keep `.tag` at ink-3 (5.5:1) when the tier is inactive (`stack.module.css:48`).
     2. Raise `[confirm]` to 12 px.

---

## 2. Apple played straight: `/design-lab/r2/apple/sidekick/`

### 2.1 Critique

**Design specificity: medium.** The grammar is faithfully Apple:
- a 52 px local nav with a pill;
- a highlights strip;
- one pinned scrub;
- a closer-look viewer;
- light status and join chapters.

By design that grammar is interchangeable with any product page. All of the specificity comes from the boards. The clips undercut it, because they are drawn in the Signal palette.

The closer-look exploded frame is the best single teardown image in round 2.

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of status | 3 | Captions swap in place. The 4.8 vh pin has no progress marks. Inactive walk tiers fade to near-invisible (`apple-1440-step04.png`) |
| 2 | Match with the real world | 3 | Plain captions ("Front copper. Routed on…"). The walk keeps the jargon key/value block |
| 3 | User control | 3 | Local-nav anchors, a pause/replay control and viewer arrows all exist. Nothing lets you skip out of the 480 svh pin |
| 4 | Consistency | 2 | Copper filled boards (hero, walk, closer look) vs bone line clips on a #0a0b08 box (pin, swap). The stack is drawn 3 times in 3 styles |
| 5 | Error prevention | 3 | Viewer views are disabled for the sensor module, with no reason given |
| 6 | Recognition over recall | 3 | Closer look names its layers. The walk stack hides its tags (`tags={false}`) |
| 7 | Flexibility | n/a | |
| 8 | Aesthetic and minimalist | 2 | Four chapters retell the teardown: pin, walk, swap, closer look. 105 vh gaps in the walk. 18.8 vh total |
| 9 | Error recovery | 3 | Nothing fails |
| 10 | Help | n/a | |
| **Total** | | **22/32 (69%)** | **Acceptable** (one point below Good) |

**Cognitive load: 3 of 8 checks fail.**
- **Chunking:** the walk has the same 6 units per module.
- **Progressive disclosure:** the walk repeats what the closer look discloses better.
- **Choices:** 8 links in the top 96 px (global and local nav), plus 5 inert seats.

**Emotional journey.**
- **Peak:** the hero. An 80 px headline over the copper carrier.
- **Dip:** the pin. Small grey boards inside a visible box.
- **Valley:** the walk. Near-black voids.
- **Recovery:** the closer look.
- **End:** honest, light status and join. There is no sponsor path.

### 2.2 Audit

| # | Dimension | Score | Key finding |
|---|---|---|---|
| 1 | Accessibility | 3 | Inactive pin captions are `visibility: hidden`, so assistive tech gets 1 of 5 at a time (`sidekick.module.css:315-322`). The pin heading hides itself after step 1 (`:312`). `.walkKv dd` leading is 1.29 (`:527`, a real overlay hit). `[confirm]` on #f5f5f7 is 4.66:1. Keyboard path is complete: nav → pill → highlights → swap clip control → views → arrows → Discord (`shoot-report-all-video_rm_nojs_kbd.json`) |
| 2 | Performance | 2 | 763 KB HTML (carrier serialised 16×). The scrub clip's 15-frame GOP gives 113–407 ms seeks. `ApplePinned.tsx:40` calls `setClipP` up to 500 times per pass and re-renders the captions list each time. Viewer views remount the whole SVG through `key` (`CloserLook.tsx:27`), which blanks the stage while it rasterises (`fsheet-apple-2.png` 46–52 s) |
| 3 | Responsive | 2 | Hero board cut off at the 1440 fold: the figure spans 526→1020 px in a 900 px viewport, and the caption is never seen (`apple-1440-step00.png`). On mobile both clips are forced to 16:9 (`aspect="16x9"` at `ApplePinned.tsx:80` and `page.tsx:130`), so the scrub plays at 358×200 even though the 4:5 render exists (`apple-390-step01/02.png`) |
| 4 | Theming | 2 | Clip ground `rgb(10,11,8)` inside a `#000` chapter draws a visible box (sampled from `apple-1440-step02.png`). Clip ink is bone where the page uses copper `#c9965f` |
| 5 | Integrity | 3 | Detector: 0 findings. Local-nav pill: 28 px visual with a 44 px hit area (`.pill::before`, `:76`), which is **correct**; Assessment A's "below 44" claim is withdrawn |
| **Total** | | **12/20** | **Acceptable** |

### 2.3 Contract compliance (`.impeccable/surfaces/app-design-lab-r2-apple-sidekick-page-tsx.md`)

| Block | Status | Evidence |
|---|---|---|
| THESIS: the carrier as the flagship product shot, then the plain truth, with no fake renders or specs | **met** | Hero plus the status chapter (`apple-1440-step00/08.png`) |
| OWN-WORLD: black hardware chapters turning white, Geist 600 in 6 sizes, **line-art boards** as the only imagery, **one filled dark pill**, red only on pill hover and one anchor | **partial** | The boards are filled copper renders, not line art. The pill is light-on-dark, not "dark". Tone flips 3 times (dark hero → light highlights → dark ×3 → light), not one dark-to-light turn |
| STORY: meet → highlights → explode → closer look → paused → four rules → take a subsystem | **met, with surplus** | The walk and swap chapters are extra retellings between the explode and the closer look |
| FIRST VIEWPORT: SIDEKICK at 28 px, 5-word 80 px headline, lead, text link, carrier about 640 px **assembled with a caption naming the file**, pill in the local nav | **partial** | The board is 760 px and **cropped at the fold**. The caption sits below the fold (`apple-1440-step00.png`) |
| SIGNATURE: one scrubbed asset, one caption per layer swapping in place; swap plays once on entry with replay | **partial** | It works. But the clip reads as a boxed, off-material video. The pin is 4.8 vh, against the playbook's 2–4. The swap clip's 16:9 box sits in the same mismatched ground |
| FORM / FINISH | **pending** | W3 |

### 2.4 Copy budget

| | Viewports | Avg | p90 | Max | Quiet (≤12 words) | Target |
|---|---|---|---|---|---|---|
| 1440×900 | 19 | 27 | 51 | 68 | **26% (5/19)** | ≥45% |
| 390×844 | 20 | 26 | 39 | 39 | **15% (3/20)** | ≥50% |

Per viewport at 1440: `26 46 4 20 21 23 11 51 1 36 33 35 0 45 8 14 68 37 40`.

The walk viewports (33–51 words) and the Status chapter (68 words) are the heavy ones. Headlines: "A phone, part by part." 5 · "Every layer, in order." 4 · "Five modules. One stack." 4 · "One module out. The rest stays." 6 · "Every board, up close." 4 · "Paused, not finished." 3. All are within the cap of 8.

### 2.5 Motion verdict

| Motion | Purpose | Verdict |
|---|---|---|
| Hero layers `settle` (1.6 s, expo-out, once) | Assembles the product shot | Good and restrained. It plays only on load |
| Pinned scrub (`sidekick-explode`) | The single scrubbed asset | Right choice. Fix the GOP (§0), the box ground and the material |
| Walk tier highlight (IntersectionObserver, discrete) | Ties list to object | Redundant with the pin. Inactive tiers at 0.45 opacity vanish (dashed outlines on #000) |
| Swap clip (once, plus a 44 px replay) | Signature beat | Correct mechanics. Wrong material/box. The pause control sits bottom-right without a caption |
| Viewer view switch (320 ms `viewIn` on remount) | State change | Cross-fade pre-mounted views instead of remounting |
| Reduced motion | Pins collapse, posters only, opt-in play | Designed state ✓ (−43% length) |

### 2.6 Fix now, ranked (Apple grammar)

1. **[P1 · quiet viewports + pin discipline] Delete `AppleWalk`. Let the one pin carry modules, with captions swapping in place.**
   - The pin runs the layer explode (4 captions), then 5 module beats. The unused `modules[].caption` strings already exist (`_content/sidekick.ts`), e.g. "Fingerprint module. Routed, waiting to be merged."
   - Each beat is 19 words or fewer and states the state word.
   - Pin: 3 vh or less (`sidekick.module.css:301`, 480 → about 300 svh).
   - Extend `CloserLook` to all 5 modules (name, spec line, one Risk line).
   - Say "Unassigned" once, in Join.
   - Expected result: about 5 dense viewports become about 3 quiet ones. Quiet share ≥45%.
2. **[P1 · material] Make the clips look like this page.**
   - **Real fix:** re-render `sidekick-explode` and `sidekick-swap` as an Apple variant: copper `#c9965f` ink and substrate fill on `#000` ground, with no frame. Add a `world` parameter to the Remotion composition and add `-apple` names to the manifest.
   - **Interim fix (same day):** feather the box edge with `mask-image: radial-gradient(closest-side, #000 82%, transparent)` on `.pinMedia` and `.swapMedia`. Alternatively, set the chapters that host a clip to the clip ground `#0a0b08` through a token, so there is no edge.
   - **If a dark clip ever has to sit in a light chapter:** present it deliberately as a dark "screen" (radius 28 px, full-bleed within the column, caption below). Never let it read as a stray letterbox.
3. **[P1 · scrub smoothness] Re-encode the scrub clip with a 1–3 frame GOP** (VP9 `-g 1`; H.264 `-g 2 -bf 0`).
   - Also stop the 500-step `setClipP` re-render: pass progress through a ref or a CSS variable to `CineClip` and keep the caption state discrete.
4. **[P1 · first viewport] Fit the hero to the 1440 fold.**
   - **Fix:**
     1. Make `.heroFig` `max-width: 640px` (the contract value; it is 760 at `:162`).
     2. Cap its height with `max-height: calc(100svh - 470px)`.
     3. Trim `.hero` top padding (`:137`) by one step.
   - **Pass:** figure plus caption end at 880 px or less in a 1440×900 viewport.
5. **[P2 · mobile] Use `aspect="auto"` on both `CineClip`s** (`ApplePinned.tsx:80`, `page.tsx:130`) so the 4:5 renders play under 640 px.
6. **[P2 · tone] Flip once.** Move the light highlights strip after the swap, or put it on `#000`, so the page runs dark (hero, explode, swap, closer look) then light (highlights, status, rules, join). That matches playbook rule 6 and the contract.
7. **[P2 · a11y] Keep inactive pin captions in the accessibility tree.**
   - Use `opacity: 0` plus `aria-hidden` toggled on the inactive captions, or one `aria-live="polite"` caption node.
   - Do not hide `#teardown-title` (`:312`). Fade it, but keep it in the accessibility tree.
   - Set `.walkKv dd` to `line-height: var(--r2-lh-body)` if the walk survives.
8. **[P3 · viewer] Cross-fade instead of remounting.**
   - Mount the three views once and toggle `data-view` with a 280 ms opacity cross-fade, rather than `key` remounts that rebuild a 431-pad SVG (`CloserLook.tsx:27`).
   - Give the disabled Flat and Exploded buttons a reason ("No board file yet").

---

## 3. Specific asks from the brief

### 3.1 Quiet-viewport share is 13–26% (target ≥45%). The recommendation

The SCOPE / RISK / OWNER walk is the problem in both worlds. It has 6 units per module, 30 per walk, and "Unassigned" 10 times.

The teardown's power is the **object coming apart in sync with a name**, not the key/value table. So keep the object and the name, and make the rest progressive:

| Layer | Shows | Words | Mechanism |
|---|---|---|---|
| Always (on the object) | Stack + locked channel list: 5 names with leader traces to tiers (concept E's locked list, rebuilt on real boards) + line-form state mark | 0 per viewport beyond the list (about 10) | Static SVG/HTML beside the stack |
| Active entry | Name + state word + one ≤12-word line | ≤ 14 | Scroll / IntersectionObserver (`data-active`) |
| On demand | Scope and Risk | 0 until opened | `<details><summary>Scope · risk</summary>` (works without JS, keyboard-native) |
| Once per page | Owner | "Every seat open." under the stack + 5 dashed seat marks on the tiers | Delete the Owner rows |
| Merge | Scope → the Status "Next" list (already says the same thing) | −5 rows | Content edit |

**Signal.**
- Entries go from 165 vh to about 70 vh; the band from about 9.3 vh to about 5 vh.
- Each band viewport carries about 10–14 words: the readout plus the active name, state and line.
- Expected: about 7 of 11 viewports are quiet (≥60%).

**Apple.**
- The walk is deleted, and module beats go into the single pin (Fix 2.6-1).
- Expected: 8 of 15 or more viewports are quiet.

Both should be re-verified with `r2-words.mjs` at 1440 and 390.

### 3.2 About 600 KB of HTML from inlining the carrier 3–5×

The measured figures are worse than estimated: 10× on Signal and 16× on Apple, counting markup plus RSC payload.

The payload is duplicated because client components (`SignalTeardown` → `SidekickStack`, `ApplePinned`, `CloserLook`) import the board JSON. Every client render serialises it again.

Fix, in priority order:
1. **Emit static per-layer SVG files.** Have `kicad-to-json.mjs` also write `public/design-lab/r2/boards/<board>/<layer>.svg` (flat and iso).
2. **Load the layers as files, not inline paths.** `BoardSvg` renders `<img src>` or `<svg><use href="/…/<layer>.svg#l"/></svg>` per layer. Each layer is fetched and cached once, and each layer is its own composited box. That also fixes the Signal jank (§1.6 Fix 1).
3. **Do not pass board data into client components.** Pass only ids. Client components toggle `data-*` attributes on server-rendered markup.

Expected HTML: about 100–150 KB (gzip about 25 KB).

### 3.3 Apple hero board cropped at the 1440 fold

Confirmed: the figure runs to 1020 px in a 900 px viewport. Fix 2.6-4 covers it.

### 3.4 No-JS swap button inert

Confirmed on Signal. The fix is §1.6 Fix 4 (a CSS `:has(:checked)` toggle).

Apple's no-JS state is fine. The swap clip shows its poster, and the control mounts only on the client.

### 3.5 SIDEKICK vs concept E's exploded isometric phone (`references/signature/e-1440-04-scrub.png`)

| | Concept E | SIDEKICK (W1) |
|---|---|---|
| Proof | Fictional phone schematic | **Real KiCad geometry, real layers, measured. Wins** |
| Gestalt | **Reads as a phone (outline, camera bump). Wins** | Reads as a pile of PCBs; the headline promises a phone |
| Locked list | **Named leader labels on the object, red dots. Wins** | Dim numbers 01–05 only |
| Cadence | **About 0.35 vh per entry, always co-present. Wins** | 1.65 vh (Signal) / 1.05 vh (Apple walk), with long empty stretches |
| Best frame | Mid-scrub stack | **Apple closer-look exploded. Better than anything in E** |

**Net: not yet better.** SIDEKICK is E plus credibility, minus legibility. Two moves make it unambiguously better:
1. Restore E's locked, named leader list on the real stack (§3.1).
2. Draw the **enclosure as a struck, dashed phone shell** around the stack. `status.notStarted` already lists "Enclosure", so the phone appears exactly as unfinished as it is: honest, and it restores the gestalt.

---

## 4. Motion: Gemini cross-check

Source: `design-lab/renders/r2/crit/sidekick/gemini.md` (one pass over both webms). Each claim was checked against 4 fps frames (`fsheet-signal-v2.png`, `fsheet-apple-1.png`, `fsheet-apple-2.png`) and the measurement scripts.

| # | Gemini says | Verdict | Frame / measurement evidence |
|---|---|---|---|
| 1 | Signal 0:10–0:19 and 0:21–0:35: content frozen while scrolling. It is "not a render stall", but scroll distance wasted on an empty timeline | **Half right.** The symptom is real. The cause is mostly a render stall, with dead distance on top | `r2-crit-sidekick-stall.mjs`: 18–21 frames of 0.3–4.2 s per pass, all inside `#teardown`. Apple has 0. The dead distance is also real: `.step` is 165 vh (`sidekick.module.css:236`) |
| 2 | Signal 0:19: "harsh snap, zero easing" as the layers separate | **Disagree on cause.** The compositor catches up after a stall; the code itself scrubs continuously (`subExplode`) | `fsheet-signal-v2.png` 18.5 s → 19.0 s: the hero jumps to the band in one frame |
| 3 | Signal: "trigger logic fails to activate later modules" | **Disagree.** It is a recording artefact | Stepped stills show L02–L05 activating (`signal-1440-step02..06.png`: readout `L02 schematic in rework` … `L05 research only`) |
| 4 | Signal: reads as a stack of bare boards, not a phone | **Agree** | `signal-1440-step01.png` vs `references/signature/e-1440-04-scrub.png`. See §3.5 |
| 5 | Apple pin scrub is "very smooth, 1:1" | **Partly disagree.** It is smooth at a glance but lags on seek | `scrub-report.json`: seeks p50 113 / p90 261 / max 407 ms; tracking lag mean 4.2%, max 8.4% of progress; webm GOP is 15 frames |
| 6 | Apple 0:08: visible lighter box behind the clip on `#000` | **Agree** | Pixel samples from `apple-1440-step02.png`: clip ground rgb(10,11,8) vs page rgb(0,0,0) |
| 7 | Apple: clip material (pale bone wireframe) clashes with the copper hero, walk and viewer | **Agree** | `apple-1440-step00.png` (copper) vs `apple-pin-50.png` (bone) |
| 8 | Apple: the viewer's Exploded state is off-colour vs Flat | **Disagree** | `fsheet-apple-2.png` 47.5 s (exploded) and 49.5 s (flat) are both copper |
| 9 | Apple viewer transitions are "too fast and linear" | **Disagree on cause.** The 320 ms `viewIn` uses the UI ease. The visible problem is a **blank stage** while the keyed remount rasterises | `fsheet-apple-2.png` 46.0–46.5 s, 49.0 s and 50.5–52.5 s show an empty stage |
| 10 | Apple walk honours "one moving thing" | **Agree, with a caveat.** Inactive tiers at 0.45 opacity disappear: dashed outlines on `#000` | `fsheet-apple-2.png` 28–43 s |
| 11 | Reduced motion needs stacked stills and crossfades | **Already met** (Gemini only saw the motion run) | `nojs-rm-compare.png`, `*-rm` in `shoot-report-all-video_rm_nojs_kbd.json`: no videos playing, pins collapsed, page 43–53% shorter, words equal |

Net motion verdict:
- **Signal:** the right idea, the wrong renderer. Fix 1.6-1 (composited per-layer boxes, no transition on the scrub) comes before any pacing change.
- **Apple:** the right mechanics. Fix the clip's GOP, ground and material (2.6-2 and 2.6-3), and swap the viewer remount for a cross-fade (2.6-8).

---

## 5. Both worlds: shared content, facts and system issues

### 5.1 Fact check vs `kb-smartphone.md` (§6 must-not-claim, §7 never-publish)

| Check | Result |
|---|---|
| Must-NOT-claim items 1–12 (ESP32, Android, 4-layer, display/battery, Altium, fabrication, tests, "club designed the SoM", Zynq-7020, open source, head counts, "3 semesters") | **None present.** Compute is "designed outside the club"; the exact part is "not stated" ✓ |
| Personal names, handles, emails, personal repos | **None.** A grep for all 6 handles plus pinguz97, gmail and cpp.edu across content, pages, board JSON and posters returned no hits ✓ |
| Defect-level language ("SCL tied to GND") | None. "Schematic in rework" is used ✓ |
| Board drawings come from real KiCad JSON | **Verified.** Carrier: 14 segments (all F), 8 vias, 36 footprints, 49.0 × 41.0 mm. Fingerprint: 77 segments (66 F + 11 B), 12 vias, Edge.Cuts 135.41→158.22 × 60.84→86.96 = 22.81 × 26.12 mm. Each `grep -c` on the `.kicad_pcb` files matches the JSON. Caption "Fills on both boards, eleven traces on one" ✓. "17 footprints placed / 19 unplaced" = 36 ✓ |

Copy defects to route through the brand-voice-strategist and brand-guardian agents, in order:
1. **"Every drawing here comes from those files."** (`_content/sidekick.ts:125`). This is false for the sensor, compute and planned tiers, which are nominal outlines. Change it to "Both board drawings come from those files."
2. **"77 traces · 12 vias" / "14 traces · 8 vias"** (`:54`, `:80`). These are KiCad *segments*, not traces. A trace is usually several segments. Say "77 track segments", or count nets.
3. **"Nine ideas" vs the named list.** The line names 8 ("Clock, motion, distance, light, haptics, sound, camera and touch", `:101`) while the measure says "9 modules" (`:106`), because "sound" merges mic and speaker. Split "sound" into "microphone, speaker", or say "eight".
4. **"Paused" without a source.** `kb-smartphone` F3 is high-confidence, but PRODUCT.md says the status comes from Notion ("legacy project"). Keep the tag `[confirm]`, which it is ✓.

### 5.2 Shared gaps

1. **[P1] No sponsor path.** PRODUCT.md weights sponsors and faculty equally, but both pages end on "Say which one on Discord". Add one text action in Join, e.g. "Back this board". The 19 unplaced parts and the missing connector make a concrete ask. Keep it in each world's grammar: a Signal trace link, or an Apple text link with a chevron.
2. **[P2] The Join seats look interactive but do nothing.** Both worlds use 5 `GlyphSeat` rows with `data-glyph-host` hover animation. Either link each seat to Discord with a prefilled channel or anchor, or remove the hover so they stop promising an action.
3. **[P2] Production cursor rAF on every r2 page.** `r2-sidekick-raf.mjs` counts 178–180 cursor rAF callbacks per 3 s at rest on desktop, even though `r2/layout.tsx:18` hides the cursor. This is outside SIDEKICK. Route it to the cross-page reviewer: unmount `CursorProvider` on `/design-lab/r2/*` rather than hiding it.
4. **[P3] Glossary.** B.Cu, F.Silk, I²C, FPC2532AP and mezzanine are unglossed in both worlds. Lead with the plain name and dim the code second ("Back copper · B.Cu").

## 6. Run notes

- **Target slugs:** `app-design-lab-r2-signal-sidekick-page-tsx`, `app-design-lab-r2-apple-sidekick-page-tsx`.
- **Ignore list:** none exists.
- **Assessments:** A and B ran as isolated sub-agents. A finished before detector output entered synthesis.
- **CLI detector:** 0 findings, exit 0. Re-run with `--no-config --no-inline-ignores` gave the same result.
- **Overlay:** injected at 1440 on both routes. Signal logged 41 entries and Apple 37; nearly all are false positives on hidden production chrome. One true positive: `.walkKv` leading.
- **Live server:** started twice, stopped twice, `/health` returns 000.
- **Recording caveat:** the first Signal recording used wheel input and stalled in the band. The re-take with instant `scrollBy` stalls in the same place, which is how the paint jank was found.
- **Renderer caveat:** all timings come from SwiftShader (software). Treat absolute times as pessimistic and comparisons as valid.
- **Code changes:** none. Only scripts under `design-lab/scripts/r2-crit-sidekick-*` and evidence under `design-lab/renders/r2/crit/sidekick/` were written.
