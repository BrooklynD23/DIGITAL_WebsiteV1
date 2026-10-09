⚠️ DEGRADED: Assessment A ran inside the critic's own context, because the W2 brief assigns one critic per page. Assessment B (the detector) ran as an isolated sub-agent. Its output was read only after Assessment A's findings were recorded.

# W2 critique: Home (`/design-lab/r2/signal/` + `/design-lab/r2/apple/`)

**Verdict: Signal is FIX. Apple is FIX. Neither needs a rebuild.** Both worlds share one P0 bug: under reduced motion the H1 thesis and the lead disappear. They also share one P1 bug: the layout flips from static to pinned after hydration and briefly shows the wrong stage. Both bugs come from one root cause in the shared hook `app/design-lab/r2/_home/useStageScrub.ts:101-107`.

Evidence is in `design-lab/renders/r2/crit/home/`:
- Scroll stills: `<world>-<1440|390>-NN.png`, with contact sheets `sheet-*.png`.
- Reduced motion: `*-rm-*`. No JS: `*-nojs-*`.
- Videos: `<world>-1440.webm`. Frames at 4 fps: `frames-<world>/`, tiled in `vsheet-*.png`.
- Data: `gemini.md`, `raf.txt`, `words.txt`, `detect.json`.

Scripts: `design-lab/scripts/r2-crit-home-{shots,probe,rm,geom,keys}.mjs`.

## Gates (both worlds)

| Gate | Signal | Apple | Evidence |
|---|---|---|---|
| rAF at rest | **0** in all 5 scenarios (57 rAF while scrolling) | **0** in all 5 scenarios (103 while scrolling) | `raf.txt` |
| Console errors | 0 | 0 | `shots-log-*.json` |
| Detector | 0 findings, exit 0 | 0 findings, exit 0 | `detect.json` |
| Reduced-motion parity | **FAIL**: H1, lead and channel chips hidden | **FAIL**: H1 and lead hidden | `r2-crit-home-rm.mjs`: `reduce → phase:"stages", parentVisibility:"hidden", checkVis:false` |
| No JS | pass. The hero shows the Plan pose and all 4 stage lines | pass. The hero is followed by 4 stills | `sheet-*-1440-nojs.png` |
| Keyboard | pass. Ruler range plus 4 jump buttons; ArrowRight, Home and End work | pass. 4 tracker buttons, prev/next, clip pause | `log-keys.txt`, `r2-crit-home-keys.mjs` |

The detector stayed clean, but it cannot see behavioural bugs. Both P0/P1 issues appear only at runtime.

## Copy budget (`r2-words.mjs`)

| World @ viewport | Viewports | Avg | p90 | Max | Quiet (≤12 words) | Budget |
|---|---|---|---|---|---|---|
| Signal 1440×900 | 11 (10.4 vh) | 21 | 36 | 49 | 45% | pass, but quiet is exactly at the 45% floor |
| Signal 390×844 | 12 | 19 | 36 | 39 | 58% | pass |
| Apple 1440×900 | 10 (9.7 vh) | 18 | 29 | 29 | 50% | pass |
| Apple 390×844 | 11 | 18 | 29 | 34 | 55% | pass |

- **Headlines (median 5, cap 8): all pass.** The thesis has 7 words; the others have 4–6.
- **Lead: pass** (17 words).
- **Highlight captions: 2 of 5 are below the 9-word floor.** "Every subsystem runs the same four stages." has 7 words.

## Extra lens: does Home beat concept C's endorsed 4-stage dot-orb strip?

The reference is `round2/references/signature/c-1440-06-section-full.png`. C shows 4 bordered tiles with ~64 px orbs, plus the four "1" counters, in one viewport.

| | Signal | Apple |
|---|---|---|
| Signature | **Better than C.** One 520 px orb is scrubbed by scroll, and a measured timebase (`T+092%`, a red trigger on a ruler) turns the stages into an instrument reading. It is a real upgrade (`signal-1440-01..04.png`) | **Better than C as spectacle, weaker as information.** One 440 px orb with captions and a tracker is calm and Apple-correct. But only one stage is ever visible, so the visitor loses C's at-a-glance "same four stages, side by side" |
| Then | It repeats C almost verbatim right afterwards (`StageStrip.tsx`). The tiles and rules are now split across a viewport boundary (`signal-1440-06.png` / `-07.png`), where C kept them in one. The page tells the 4 stages twice in a row | The rules sit about 3 vh below the pin, after three build chapters (`apple-1440-08.png`). The ownership rules lose their link to the stages |
| Morph | Four stacked DotStages cross-fade by opacity (`ScopeHero.tsx:91-104`) | Same (`StagePin.tsx:45-58`). The contract says "the orb morphs". Gemini also flagged the dissolve |
| To truly beat C | Retire the tile strip. Hang each rule on its stage as a ruler footnote | Put each rule's stat under its stage caption. Cut or shrink the separate rules chapter |

Suggested stage ↔ rule pairing (needs Head Designer confirmation):

| Stage | Rule |
|---|---|
| Plan | 1 owner per subsystem |
| Prototype | 1 review path per handoff |
| Test | 1 test gate before merge |
| Integrate | 1 repair plan before release |

This delivers PLAN §4's "upgraded strip with the counters" inside the single scrubbed asset.

---

## Signal Capture: `/design-lab/r2/signal/`

### Design specificity
**The page is authored for this product, not a generic template.** The graticule ground, the timebase ruler as a real `<input type=range>`, CH marks carried through nav, rows and footer, and line-form status (`StateMark pending`) all belong to this world. No unrelated product could use the hero unchanged.

The weak spots are:
- The C-copy strip (generic tiles).
- The channel rows: a 360 px box plus a giant name in a 100 svh row, which leaves large empty bands (`signal-1440-07..09`).

### Heuristics
Persuade surface. Heuristics 7, 9 and 10 are n/a: there is no expert path, no error state, and no help surface.

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | Readout `0N/04`, `T+%` and the marker track well. The hydration flash shows "INTEGRATE" on load (`frames-signal/f009–f013`) |
| 2 | Match system / real world | 3 | The oscilloscope metaphor holds. `T+092%` is opaque to non-engineers but harmless |
| 3 | User control and freedom | 3 | Scroll, drag, keys and jump buttons all work. The pin is 500vh, i.e. 4 vh of travel, which is the playbook ceiling. There is no "skip past" control |
| 4 | Consistency and standards | 2 | A filled CTA in a no-fill world. The 4 stages are told twice. 2 reds share a viewport at pin release |
| 5 | Error prevention | 3 | Clean |
| 6 | Recognition rather than recall | 2 | Nav at 390 px shows only `CH1 CH2 CH3`, with the names visually hidden |
| 7 | Flexibility and efficiency | n/a | Landing page |
| 8 | Aesthetic and minimalist design | 3 | Restrained. Channel rows waste about 40% of each viewport |
| 9 | Error recovery | n/a | No error states |
| 10 | Help and documentation | n/a | Landing page |
| **Total** | | **19/28 (68%)** | **Acceptable**, 2 points from Good |

### Audit
**15/20, Good.**

| Dimension | Score | Key finding |
|---|---|---|
| Accessibility | 2 | The P0 reduced-motion content loss. Otherwise the ruler, buttons and links are 44 px, focus rings are solid 2 px, and labels are complete |
| Performance | 3 | 0 rAF at rest. The page height jumps 5,581 → 9,322 px after hydration (`r2-crit-home-probe.mjs`), which is a layout-shift risk |
| Responsive | 2 | A 216 px dead band in the 390 px pin. Mobile nav labels are hidden |
| Theming | 4 | All world tokens. The red rule glyph is neutralised to currentColor (`home.module.css:97`) |
| Implementation integrity | 4 | Coherent and product-specific |

### Contract compliance (`.impeccable/surfaces/app-design-lab-r2-signal-page-tsx.md`)

| Block | Status | Evidence |
|---|---|---|
| THESIS | met | Scroll is the timebase; one orb is scrubbed through 4 stages (`signal-1440-00..04`) |
| OWN-WORLD | **partial** | "No cards, no fills": the filled bone CTA (`JoinScope.tsx:26`, `home.module.css:130`) and tile hover fills (`:85`). "Red once per viewport": the ruler marker and the active tile's red top-rule appear together (`signal-1440-05.png`) |
| STORY | met | Stages → channels → Thursday |
| FIRST VIEWPORT | **partial** | The grid is 6fr/6fr, not 5/7 (`home.module.css:22`). The thesis wraps to 4 lines at 72 px. There is no scope frame around the orb (a readout hairline only). The red trigger is on the ruler and Join is outlined in the nav ✓ |
| FORM | met | Scroll, drag and arrow keys drive the orb, and the marker and readout track it (`r2-crit-home-keys.mjs`). The first ArrowRight from the hero skips Plan (p 0 → 0.5006, Prototype) |
| FINISH | n/a yet | W3 |

### Motion verdict
**Sound, with 2 fixes.**
- The scrub is linear to scroll, as `apple-playbook` §7 requires.
- At most 1 moving stage per viewport.
- Strip tiles play once on hover or focus.
- 0 rAF at rest.

Problems:
- The hydration flash (P1).
- One recorded case where the stage label went blank for about 1.5 s while the orb sat on Prototype at `T+066%`, during a keyboard-driven smooth scroll (`frames-signal/f107–f113`, in `vcheck-signal.png`). I could not reproduce it with 1.8 s waits (`r2-crit-home-keys.mjs`), so treat it as intermittent.

**Gemini cross-check** (`gemini.md`, against frames at 4 fps):

| Gemini claim | Verdict | Frame evidence |
|---|---|---|
| Left text snaps between states with no cross-fade (0:05–0:12) | **Disagree** | A mid-fade grey "PROTOTYPE" is visible (`vsheet-signal.png` row 3). There is a 320 ms transition at `home.module.css:30` |
| Keyboard causes brutal cuts (0:21–0:28) | **Partial** | The smooth scroll passes through intermediate poses, but the blank-label interval at f107–f113 is real |
| Ambient 3D rotation in the SIDEKICK/BRAIN rows | **Disagree** | 0 rAF at rest (`raf.txt`). The motion seen was the scripted hover at the end of the video |
| Harsh hover on stage tiles | **Partial, P3** | The 2 px red top-rule has no transition (`home.module.css:83`) |
| Morph halts when scroll stops | **Disagree** | This is the design: the scrub stays linear to scroll with no time-easing (playbook §7) |
| *(missed by Gemini)* | | The hydration flip and the "INTEGRATE" flash at 0:03–0:04.5 (`f009–f013`) |

### Fix now (Signal)

| # | Sev | Issue | Evidence | Fix (Signal grammar) |
|---|---|---|---|---|
| 1 | **P0** | Reduced motion hides the thesis, lead and channel chips | `signal-1440-rm-00.png`. Code path: `useStageScrub.ts:106` calls `onProgress(1)`, then `ScopeHero.tsx:36` sets `data-phase=stages`, then `home.module.css:27` sets `visibility:hidden` | Scope the phase rules to the pinned state: `.capture[data-enhanced][data-phase='stages']`. In the hook's static branch, do not call `onProgress` (or call it with the hero phase). The static capture then shows thesis + rest orb + all 4 division lines |
| 2 | **P1** | The server HTML paints the static capture first. After hydration it flips to the 500vh pin, flashes "INTEGRATE", then settles at the loose ring. Height goes 5,581 → 9,322 px | `frames-signal/f009–f013`; `r2-crit-home-probe.mjs` | Ship the pinned layout in the HTML. Gate `height:500vh` and `position:sticky` on `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)` instead of the post-mount `data-enhanced`. Initialise `active=0` and `phase=hero`, so the first frame equals the hydrated frame |
| 3 | **P1** | Mobile pin dead band: the stage line ends at y=178, the readout starts at y=394 (216 px empty), and there are ~8 px plus ~55 px of inner canvas margin to the dots. This is the known W1 gap | `signal-390-pin-mid.png`; `r2-crit-home-geom.mjs`. Cause: the hidden `.heroCopy` still sizes `.leftCol` (`home.module.css:23-24`) | At ≤734 px, take `.heroCopy` out of flow once `phase=stages` (absolute). Let the readout sit directly under the stage line, and grow `.orbStack` to `min(100vw - 32px, 100svh - 360px)` |
| 4 | **P1** | The 4-stage tile strip repeats the hero one viewport later, and the rules fall in the next viewport | `signal-1440-06/07.png` vs `c-1440-06-section-full.png` | Retire the tiles. Each stage's rule becomes a Krypton mono footnote under the big stage name (e.g. `TEST · 1 test gate before merge`) and under its ruler division in the static state. This saves about 1 vh and makes the hero the single upgraded C |
| 5 | **P2** | Filled CTA in a no-fill world | `signal-1440-10.png`; `JoinScope.tsx:26`; `home.module.css:130` | Use a 1 px bone outline trigger, the same grammar as the nav Join. Hover goes to full ink. The seat's anchor stays the viewport's one red |
| 6 | **P2** | The seat orb's red anchor at rest is about a 3 px dot inside a hollow ring at 360 px, so the "open seat" does not read. This is the known W1 gap | `signal-1440-rm-10.png`; `_system/dots/verbs-build.ts:276` (`c.r * 1.3`) | `_system` request: at rest the anchor fills the opened slot at `c.r * 2.4`, matching the ring dots, with the hollow ring around it |
| 7 | **P2** | Two reds in one viewport at pin release: the ruler marker and the active tile's top-rule | `signal-1440-05.png`; `home.module.css:83` | Draw the active tile mark as a 2 px bone rule. This becomes moot if fix 4 lands |
| 8 | **P2** | The first ArrowRight from the hero skips Plan and lands at Prototype (p 0.5006) | `r2-crit-home-keys.mjs` output | In `ScopeHero.onKey`, while `phase=hero`, ArrowRight calls `jumpTo(0)` |

Later (P3):
- `anchor={st.id==='integrate'}` does nothing, because `wire` ignores `opts.anchor` (`ScopeHero.tsx:99`; `verbs-build.ts:113-140`).
- No-JS shows the Plan pose but reduced motion shows the Integrate pose. Pick one designed still.

---

## Apple page played straight: `/design-lab/r2/apple/`

### Design specificity
**The page reads as authored, and it does not read as a fake apple.com.**
- Own type (Geist), dot-orb artifacts, the dark→light arc, `[confirm]` honesty tags, and signal red only on the CTA hover.
- The pin, tracker, highlights strip and light join chapter hit the canon.

The weak spot is the build chapters: a 420 px orb plus three lines at 78 svh leaves large black fields (`apple-1440-06/07`). The orbs are also sized inconsistently at rest: the BRAIN `bud` looks about 40% the size of SIDEKICK's `explode`.

### Heuristics
Heuristics 7, 9 and 10 are n/a for the same reasons as Signal.

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | The tracker is clear. The tracker lags the caption during jumps (`frames-apple/f025`). Hydration flash |
| 2 | Match system / real world | 3 | Plain language throughout |
| 3 | User control and freedom | 3 | Tracker jump, prev/next, clip pause |
| 4 | Consistency and standards | 2 | First viewport shows "DIGITAL" ×2 and "Join" ×2 across two bars. The local nav stays dark over light chapters. 2 of 4 Apple pages fork their own local nav |
| 5 | Error prevention | 3 | Clean |
| 6 | Recognition rather than recall | 3 | Fine |
| 7 | Flexibility and efficiency | n/a | |
| 8 | Aesthetic and minimalist design | 3 | Calm. The 4-stage story is told 3 times (pin, tracker, highlights clip) |
| 9 | Error recovery | n/a | |
| 10 | Help and documentation | n/a | |
| **Total** | | **20/28 (71%)** | **Good** |

### Audit
**14/20, Good.**

| Dimension | Score | Key finding |
|---|---|---|
| Accessibility | 2 | P0 reduced-motion loss of the H1 and lead. Targets are otherwise 44 px; the LocalNav pill is visually 52×28 with a 44 px hit area via `::after` |
| Performance | 3 | 0 rAF at rest. Page height 5,880 → 8,756 px on hydration |
| Responsive | 3 | 390 px reads well. The build chapters at 100 svh are mostly empty |
| Theming | 3 | The chrome hard-codes `#161617`, `#a1a1a6`, `#f5f5f7` and an `rgba` dark nav (`chrome.module.css:25-32, 46`) |
| Implementation integrity | 3 | Coherent. The anchor prop is a no-op. LocalNav is bypassed on 2 pages |

### Contract compliance (`.impeccable/surfaces/app-design-lab-r2-apple-page-tsx.md`)

| Block | Status | Evidence |
|---|---|---|
| THESIS | met | One scrubbed pin; build orbs and the seat play once on entry. The highlights clip also plays once and has a pause button |
| OWN-WORLD | **partial** | "Red otherwise only as the orb's anchor dot": the Integrate anchor never renders (`wire` ignores it, `StagePin.tsx:53`). Red does appear on the rules' seat glyph (`apple-1440-08`) and in the clip's own tracker (`apple-1440-09`). The dark→light arc and the ending in light are ✓ |
| STORY | met | |
| FIRST VIEWPORT | **partial** | The 52 px local nav is present, but stacked under a 44 px global bar that duplicates "DIGITAL" and "Join" (`apple-1440-00.png`). The orb is not "at rest in its Plan pose": it opens at `OPEN_T 0.45`, a loose ring about 260 px of visible dots, which reads as noise |
| FORM | met / partial | The 400vh pin (3 vh of travel) and the 4-dot tracker are ✓. "The orb morphs" is really 4 orbs cross-fading (`StagePin.tsx:45-58`) |
| FINISH | n/a yet | W3 |

### Motion verdict
**Restrained and correct in structure**: one scrubbed asset, everything else plays once, nothing ambient. Problems:
- Caption cross-fades overlap text-on-text, and the orbs double-expose at stage boundaries (`frames-apple/f097.png`).
- Hydration flips the four stills into the pin with an Integrate flash under the thesis (`f015`).

**Gemini cross-check:**

| Gemini claim | Verdict | Frame evidence |
|---|---|---|
| Captions snap on tracker click (0:21–0:27) | **Partial** | Captions do fade over 320 ms, but a tracker jump smooth-scrolls through 1–2 intermediate stages, so the captions flick. The tracker lags the caption (`f025`) |
| Prototype/Test rotate ambiently while pinned | **Disagree** | 0 rAF at rest. They move only with scroll |
| Test → Integrate dissolves instead of morphing | **Agree** | 4 stacked DotStages with opacity cross-fade (`StagePin.tsx:56`) |
| Carousel moves linearly and stops abruptly | **Disagree (low confidence)** | Native smooth `scrollBy` plus `snap mandatory`. At 4 fps the settle looks eased |
| Captions fade out first and leave a gap | **Disagree on mechanism** | Frames show the opposite: both captions overlap mid-swap (`f097`) |
| *(missed by Gemini)* | | Hydration stills → pin flip and the Integrate flash (`f001–f015`) |

### Fix now (Apple)

| # | Sev | Issue | Evidence | Fix (Apple grammar) |
|---|---|---|---|---|
| 1 | **P0** | Reduced motion hides the H1 thesis and lead | `apple-1440-rm-00.png`; `StagePin.tsx:23` → `home.module.css:31`; root cause `useStageScrub.ts:106` | Scope to `.pin[data-enhanced][data-phase='stages']` and fix the hook's static branch, as in Signal fix 1. The static page is then: dark hero, then the four stills |
| 2 | **P1** | Hydration flips stills to the pin with an Integrate heptagon under the thesis | `frames-apple/f001–f015`; height 5,880 → 8,756 | Ship the pin in the HTML, gated on `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`. Initialise `active=0` |
| 3 | **P1** | Caption swap overlaps text-on-text and orbs double-expose | `frames-apple/f097.png`; `home.module.css:38-44` | Out-then-in: the outgoing caption and orb fade over 160 ms, the incoming one fades in with a 160 ms delay and a 240 ms duration, using `--r2-ease-ui`. Apple never overlaps two lines |
| 4 | **P1** | Duplicate chrome: "DIGITAL" ×2 and "Join" ×2 in 96 px of bars | `apple-1440-00.png` | `WorldNav join={false}` when a LocalNav is present (see Chrome). The Home LocalNav title should name the page subject rather than repeat the brand (copy via brand-voice-strategist) |
| 5 | **P1** | The rules are 3 vh away from the stages they govern | `apple-1440-08.png` | Under each stage caption, add a stat line in the stat-callout form (48 px glyph, "1 test gate before merge"). Shrink the rules chapter to a recap row or cut it |
| 6 | **P2** | The first-viewport orb is a half-formed loose ring | `apple-1440-00.png`; `useStageScrub.ts:18` (`OPEN_T 0.45`) | Open on the Plan rest pose (the dotted triangle), so the hero artifact is a finished shape; scroll then plays Prototype. Make it per-world (`openT` option) if Signal wants to keep its scan-in |
| 7 | **P2** | Highlights card 1 tells the 4 stages a third time, as a `#0b0c0a` video box inside a light card | `apple-1440-09.png` | Give card 1 a different fact (the 7-subsystem split, or Discord between nights), or render the clip on the card's light ground |
| 8 | **P2** | The local nav stays dark over light chapters | `apple-1440-08..10` | Tone follows the chapter under it: an IntersectionObserver on `[data-tone]` sections flips the LocalNav `data-tone` (chrome change) |

Later (P3):
- Integrate `anchor` is a no-op (`StagePin.tsx:53`).
- The BRAIN `bud` rest pose is visibly smaller than the other two build orbs.

---

## Shared chrome (`app/design-lab/r2/_chrome/`), used by every page

| # | Sev | Finding | Evidence | Request / fix |
|---|---|---|---|---|
| 1 | P1 | **LocalNav has no slot for an extra control**, so 2 of 4 Apple pages fork it: SHADES (spacing toggle) and SIDEKICK | `apple/shades/page.tsx:27-40` + `apple.module.css:108`; `apple/sidekick/page.tsx:58` + `sidekick.module.css:14-19` | Add `extra?: ReactNode` (rendered between the links and the CTA, hidden links still collapse at ≤734 px but `extra` stays). Also `cta?: {…} \| null`, and drop the forks. **Endorse** the requested SHADES spacing-toggle slot |
| 2 | P1 | **Duplicate Join when a page has a LocalNav** (Apple Home and Brain) | `apple-1440-00.png`; `WorldNav.tsx:24-26` | `WorldNav { join?: boolean }`, false whenever LocalNav renders, so the page has exactly one filled CTA. **Endorse** the request |
| 3 | P2 | **Signal WorldNav is always sticky** (`chrome.module.css:17`). Pages that pin their own instrument need it to scroll away | `chrome.module.css:17` | `WorldNav { sticky?: boolean }`, defaulting to true for signal and ignored for apple. **Endorse** the request |
| 4 | P2 | **Signal nav at ≤640 px hides the channel names**, leaving only `CH1 CH2 CH3` | `signal-390-00.png`; `chrome.module.css:36-38` | Keep the names and drop the CH marks at ≤640 px. The names carry recognition; the marks are decoration at that size |
| 5 | P3 | The LocalNav tone is static (see Apple fix 8). Hard-coded Apple global-bar colours (`chrome.module.css:25-32, 46`). The footer hard-codes the Discord URL (`WorldFooter.tsx:21`) instead of `DISCORD_URL`. Comments promise a red trigger dot on the Signal Join that is not drawn (`chrome.module.css:2`, `WorldNav.tsx:6`) | as cited | Tokenise the colours, import the URL, fix the comments |

What works:
- Skip link to `#r2-main`.
- Every nav, local-nav and footer link is ≥44 px tall with a solid 2 px focus ring (`log-keys.txt`).
- `aria-current` page marking.
- The footer gives each world its own grammar from one component.

## Both worlds: content and facts (`_content/home.ts`)

| Sev | Finding | Fix |
|---|---|---|
| **P0 (shared code)** | `useStageScrub.ts:101-107`: the static branch calls `onProgress(1)`, which both pages read as "leave the hero" | Fix once in the hook. Both P0s close |
| P2 | `home.ts:78` "A modular phone on a Zynq-7000 module." is a knowledgebase fact shown untagged. The `[confirm]` follows only the status line | Tag the claim itself: `… Zynq-7000 module. [confirm]` |
| P2 | `home.ts:121` "…students own parts." implies a current membership mix that is not verified | Change to "…students can own parts." |
| P3 | `channels[].expands` is unused on Home. **Acceptable:** all 4 project pages render the SHADES and BRAIN expansions (checked with curl on `signal/apple × shades/brain`). This closes the known W1 gap | Delete the field or use it as the `aria-description` on the channel link |
| P3 | 2 of 5 highlight captions are 7 words (budget 9–19) | Lengthen with a fact, not filler |

All other facts check out against their sources:
- Thursday 6:00 PM, Building 17, Room 1635.
- "No project experience required." (`lib/data/homeLanding.ts:169`).
- Venture Studies as a program.
- Statuses tagged `[confirm]`.
- No names, counts or partners.

## Known W1 gaps, judged

1. **Mobile Signal pin gap: confirmed, P1.** The real gap is 216 px, between the stage line and the readout (more than between the readout and the orb). Root cause and fix are in Signal fix 3.
2. **Seat orb's red anchor at rest: confirmed, P2.** About 3 px at 360 px. Needs a `_system` change (Signal fix 6).
3. **Home dropping the SHADES/BRAIN acronym expansions: fine.** The project pages carry them.

## Persona red flags

- **Sam (reduced motion / screen magnifier):** opens either Home and gets no H1 and no thesis. The page starts at a pose-only orb (Signal) or a row of stills (Apple).
- **Casey (390 px, one thumb):** in Signal, a 216 px black band mid-pin and a nav reading `CH1 CH2 CH3` with no names. Apple is fine.
- **Jordan (first-timer):** in Apple, sees "DIGITAL" and "Join" twice before any content. In Signal, `T+092%` and `04/04` read as noise without a legend. Acceptable for the world, but the stage name must never blank (the intermittent f107–f113 case).

Questions skipped: W2 critic run is read-only and reports to the dispatcher, not the user.

## Run notes

| Item | Status |
|---|---|
| Target | `app/design-lab/r2/{signal,apple}/page.tsx` + `_home/`, `signal/_home/`, `apple/_home/`, `_content/home.ts`, `_chrome/` |
| Ignore list | none |
| Assessment independence | A in-context, B an isolated sub-agent; detector read after A |
| CLI detector | ran, exit 0, `[]` |
| Browser overlay | not attempted (chrome-devtools MCP is broken); Playwright headless shell used for all evidence |
| Live server | shared `:3100`, not started or stopped by this run |
| Snapshot persistence | skipped, per the W2 output contract |
