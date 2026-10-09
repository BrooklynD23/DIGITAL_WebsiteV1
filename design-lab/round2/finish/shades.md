disposition (signal / SHADES): fix
disposition (apple / SHADES): fix

What I didn't read: PLAN.md, the prior critiques (`design-lab/round2/critiques/shades.md`, `system.md`), Glasses.tsx, HighlightArt.tsx, Band.tsx, Saccade.tsx, Scanpath.tsx, LightPath.tsx, the world CSS beyond its font-family lines, the per-raster provenance files, and the full step sets. From the step sets I read 13 of 92 frames plus all 4 contact sheets.

The full-page captures were checked for size and read at thumbnail scale. The long black stretches in `gate3/apple-shades-desktop.png` and `gate3/signal-shades-mobile.png` are the scroll runways of the pinned chapters, not capture failures. The pinned states are covered frame by frame in `steps/`.

Pixel sampling was not possible (no PIL in this environment), so I judged GROUND by eye.

Evidence (check 0): **pass.** Both worlds have desktop (1440 wide), tablet (834) and mobile (780 = 390 at 2x) captures in `v2/` and `gate3/`. Step frames are 1440×900 and 780×1688, and the `-reduced` sets are present. No capture is blank or mislabelled.

---

## persistence

Pass.
1. `PRODUCT.md` exists.
2. The build is code-led, so a missing `.impeccable/build/state.json`, spec and diff directories is expected, not a finding.
3. There is no `.impeccable/mocks/`, so no comp-round approval is owed.
4. Signal: FORM carries seed key `0a795440`, and the packet confirms it ("roll, seed 0a795440").
5. Apple: FORM is "canon", and the packet confirms the world has no roll and no QUALITY BAR card.
6. DESIGN.md does not exist yet. This is a new world, so the documenter writes it after this review. Not a finding.

## fidelity

There is no approved comp. Every row below is judged against each world's direction contract (OWN-WORLD, FIRST VIEWPORT, SIGNATURE).

### Signal Capture: `/design-lab/r2/signal/shades/`

| Element | State | Evidence |
|---|---|---|
| Fixation reticle on the graticule's centre crosshair, red trigger dot | match | `steps/signal-1440-00.png`, `steps/signal-390-00.png` |
| CH2 SHADES readout "lower left" with the headline | adaptation, uncited (defect) | The readout sits in a top-left strip ~400px above the headline (`signal-1440-00`). No answer or brief is cited for the move. |
| 4-word headline ~72px, Atkinson lead, "Try the reader" text action | match | `signal-1440-00` |
| Spacing setting as a readout toggle, upper right | match (wraps under the readout at 390, an acceptable reflow) | `signal-1440-00`, `signal-390-00` |
| Fixate dot field converging once on load | not verifiable from stills | The rest state shows the dotted ring only. |
| Pinned scanpath: staircase flattens, dots collapse to the red trigger dot | match at 1440 | `signal-1440-01` to `-05` |
| Scanpath two-row layout below 735px | **contradicted** | The return-sweep trace runs diagonally across the word tiles "a" and "line," (`signal-390-02.png`). On a page that has to model readable text, the signature graphic strikes through the words it is about. |
| Live RSVP reader: WPM, Read, word on the fixation point, K / ← → | match | `signal-1440-06`. Idle state `01/25 · 250 wpm`, so no autoplay. `Reader.tsx:5-6` (setTimeout chain only while playing) and `Reader.tsx:111-124` (key handling). |
| Reader under reduced motion: step-through plus full sentence printed | match | `sheet-signal-1440-rm.png` frame 3 ("Next word", sentence printed, "Reduced motion is on…" note) |
| Light-path band: lit station and caption on one index | match | `signal-1440-09.png`: "03/06 You pause, resume…" with Control lit |
| Two tracks plus the honest boundary (Is / Is not / Never), mentor line | match on content | `signal-1440-12.png` |
| Boundary rows set as sentences | **contradicted** | "A research platform. / Not a medical device, and not a treatment. / Medical claims, now or later." are in the Hubot Sans display face with tight word spacing. OWN-WORLD says Atkinson for every sentence a visitor reads (`signal-1440-12`). |
| Roadmap all dashed until a phase is confirmed | match | Sheet frames 13–14 |
| Join primary action | **contradicted** | "COME TO BUILD NIGHT" is uppercase Krypton (`signal-1440-15.png`). OWN-WORLD limits Krypton to true readouts (WPM, word count, axis labels). |
| Join ornament (8-node dot octagon) | **added without approval** | It fills the left half at 1440 and ~450 css px above the heading at 390 (`signal-390-15.png`). It has 8 nodes while the copy says "five kinds of builders", so the drawing contradicts the sentence beside it. |
| TYPE | match, with 2 leaks | Hubot Sans display, Atkinson reading face, Krypton readouts are correct. The leaks are the CTA and the boundary rows above. |
| MATERIAL | match | Crisp vector traces and dots on a graticule. Geometry, no imitated physicality. |
| GROUND | match | OWN-WORLD names "near-black graticule" and no hex. The render is a neutral near-black with bone ink. Judged by eye. |

### Apple product page, played straight: `/design-lab/r2/apple/shades/`

| Element | State | Evidence |
|---|---|---|
| Black first chapter, centred: SHADES 28px, headline 80px, grey lead, "Try the reader ›" | match on contract, but the 28px SHADES line is a floor violation (see `material_fixes`) | `steps/apple-1440-00.png` |
| Dotted glasses ~760px wide | acceptable adaptation | Lens frames ~520px, ~700px with temples (`apple-1440-00`). |
| "One word glowing inside the right lens" | **contradicted** | "here" sits in a dashed grey rectangle with no glow (`apple-1440-00`, `apple-390-00`). The dashed box is Signal's line language leaking into this world. |
| 52px local nav, one filled pill "Join build night" | match at 1440 | `apple-1440-00` |
| Local nav spacing toggle at 390 | **contradicted** | It reads "Spacing:" with the value dropped, which looks like a broken label (`apple-390-00`, `apple-390-03`). |
| "Your eyes jump." scanpath, "Illustrative, not recorded data" caption | match | Sheet frame 1 |
| shades-fixate clip plays once on entry, with a control | match | Sheet frame 2: play/pause control bottom right |
| Red limited to the pill hover and the fixation anchor | **contradicted** | The fixate clip paints the pivot letter red ("f**o**cus", `sheet-apple-1440.png` frame 2). The W3b log defers this to CINE, but it still ships. |
| Live reader, outline Read pill, K / ← → hint, no autoplay | match | `apple-1440-03.png`, idle `01/25`. Reduced: "Next word" plus printed sentence (`sheet-apple-1440-rm.png` frame 3). |
| SIGNATURE: pinned light path, caption swapping on the clip's progress | **contradicted at entry** | `apple-1440-04.png` and `apple-1440-05.png` (identical bytes) show the whole ray lit through to the red fixation point under "1 / 6 Prepared text leaves a laptop over one wire." Later frames agree (`-06` 3/6, `-07` 4/6, `-08` 6/6), so the clip enters showing its final frame. The contract's "caption never runs ahead of the packet" (`LightPin.tsx:4-5`) is broken in the other direction. |
| Light-path clip stage labels | **contradicted** | Uppercase tracked monospace, ~8 css px at 390, "FIXATION POINT" in low-contrast grey (`apple-390-05.png`, `apple-1440-04`). Monospace is not in the Apple OWN-WORLD, and the page has to model readable type. |
| "Part by part." highlights carousel | match | `apple-1440-09.png` |
| Two tracks plus boundary (Never line, "claims no effect", mentor) | match | `apple-1440-10.png`, all Atkinson |
| "The first build, honestly." on #f5f5f7, Seven phases on white | match | Sheet frames 11–12 |
| Join: date line, 5 seats as links, Discord secondary | match | `apple-1440-13.png` |
| Join ornament (8-node dot octagon) | **added without approval** | Same 8 nodes vs "five kinds of builders" mismatch as Signal (`apple-1440-13`). |
| TYPE | match, with mono leaks | Geist 600 headlines and Atkinson leads, captions and RSVP word are correct. The leaks are the clip labels, "Diagram, not a render" and the reader key hint, all in monospace. |
| MATERIAL | match | Round-cap dotted line art is the only imagery. No imitated material. |
| GROUND | match | Black chapters, then one flip to white and #f5f5f7 (full page, `gate3/apple-shades-desktop.png`). Judged by eye. |

### Hard constraints (both worlds)

| Constraint | Result | Evidence |
|---|---|---|
| No medical or efficacy claims | **Pass** | `_content/shades.ts:52` ("A research platform. Not a medical device."), `:177` ("no outcome promised in advance"), `:181-183` ("Not a medical device, and not a treatment", "Never: Medical claims, now or later", "SHADES claims no effect on dyslexia or on reading outcomes"). The hero copy describes how the reader works, not an outcome. |
| Atkinson Hyperlegible Next for reading text | **Pass for leads, captions and the RSVP word.** 3 leaks listed above. | `apple.module.css:7`, `signal.module.css:6`, `reader.module.css:11,70` |
| RSVP never autoplays and is keyboard operable | **Pass** | Every reader capture is idle at `01/25`. Timer runs only in the playing phase. K / ← / → handled on the reader group (`Reader.tsx:111-124`, `:150`). The slider keeps its own arrow keys. K responds once focus is inside the reader (the group has no tabindex); the Read button is the first stop. |

## ceiling

There is no QUALITY BAR card for either world. Signal is judged against its contract raises; Apple against the canon craft bar (measured iPhone, AirPods and MacBook pages).

**Signal: native devices unused**
1. The trigger reticle in the first viewport is the focal device, but at ~200px it covers ~4% of a 1440×900 frame, and 60% of the frame is empty graticule (`signal-1440-00`). The oscilloscope world lets the fixation point own the screen.
2. Light-path stations are generic outline icons (document, chip, eye). The scope's own vocabulary is not used: no pulse travelling a timebase, no persistence trail on the lit segment (`signal-1440-09`).
3. The scanpath has no measurement readouts. Fixation durations and saccade Δx as Krypton cursors would be true readouts and would earn the mono face honestly.
4. The join viewport spends half its width on an ornament instead of an instrument.

**Apple: canon devices unused**
1. The hero product shot sits at ~36% of viewport width (520px lens span on 1440). Canon product heroes fill 60–80%.
2. The word in the lens is boxed instead of luminous, so there is no light in the product shot.
3. The page ends on a list. There is no closing chapter where the product line art returns at scale above the action.
4. The highlights carousel's pagination and play controls are not visible in the 1440 frames. This could not be verified.

## material_fixes

### Signal Capture (ordered)
1. **Scanpath at under 735px:** reroute the return-sweep trace so it never crosses a word tile. Run it beneath row 1 to the left margin and down to row 2, or draw it behind tiles that mask it. Evidence: `signal-390-02.png`, diagonal through "a" and "line,". Ties to SIGNATURE and the readability constraint.
2. **Join CTA:** set "Come to build night" in sentence case in Atkinson or Hubot, not uppercase Krypton. Evidence: `signal-1440-15.png`. Ties to OWN-WORLD (Krypton only on true readouts). The fix lands in the shared `<JoinChapter world="signal">`.
3. **Boundary rows:** set "A research platform." / "Not a medical device, and not a treatment." / "Medical claims, now or later." in Atkinson 600 at the current size, with normal word spacing. Evidence: `signal-1440-12.png`. Ties to OWN-WORLD (Atkinson for every sentence).
4. **Join ornament:** reduce to 5 nodes, one per seat, each lighting on hover or focus of its seat row. Otherwise delete it. At 390, cap it at ~160px or drop it. Evidence: `signal-1440-15.png`, `signal-390-15.png` (8 nodes vs "five kinds of builders", ~450 css px before the heading).
5. **First viewport:** scale the reticle to roughly 40–50% of viewport height on the centre crosshair. Move the CH2 readout to the lower-left block above the headline as the contract says, or cite why it moved. Evidence: `signal-1440-00.png`. Ties to FIRST VIEWPORT and ceiling item 1.

### Apple product page (ordered)
1. **Light pin entry:** the clip must show frame 0 at p = 0. Use the first frame as the poster and seek to the current p on mount before the stage reveals. Recapture `apple-1440-04` and confirm "1 / 6" shows only Text source lit. Evidence: `apple-1440-04.png` and `-05.png` show the full ray and red fixation point under "1 / 6". Ties to SIGNATURE.
2. **Light-path clip labels:** produce `shades-lightpath` again as a re-rendered raster asset with sentence-case labels in Atkinson, at least 14 css px at 390 and at least 4.5:1 contrast, including "Fixation point". Evidence: `apple-390-05.png`, `apple-1440-04.png`. Ties to OWN-WORLD and the readable-typography constraint. The W3b log defers this to CINE; it still ships.
3. **shades-fixate clip:** produce it again as a re-rendered raster with the pivot letter in ink, not red. Red stays only on the fixation anchor. Evidence: `sheet-apple-1440.png` frame 2 ("f**o**cus"). Ties to OWN-WORLD (red allowance).
4. **Hero eyebrow:** delete the 28px "SHADES" line above the headline. The local nav already names SHADES 100px above it, and the craft floor bans the kicker outright, with no brief exception. Evidence: `apple-1440-00.png`, `apple-390-00.png`. Amend FIRST VIEWPORT to match.
5. **Hero lens word:** remove the dashed rectangle around "here" and render the promised glow (luminous ink with a soft bloom inside the lens). Evidence: `apple-1440-00.png`. Ties to FIRST VIEWPORT and ceiling item 2.
6. **Spacing toggle at 390:** keep the value visible ("Spacing: standard / more"), or move the control into the section menu with its value. Evidence: `apple-390-00.png`, `apple-390-03.png`.
7. **Join ornament:** same fix as Signal #4, 5 nodes keyed to the 5 seats, or delete it. Evidence: `apple-1440-13.png`.

## keep

Do not dilute these while fixing:
1. The honesty layer: "A research platform. Not a medical device." in the hero foot, the permanent "Never: Medical claims" line, and "claims no effect on dyslexia".
2. The idle-until-pressed reader, with K / ← / → and the printed sentence under reduced motion.
3. Signal's staircase-to-trigger-dot collapse.
4. Apple's dotted line art as its only imagery.
