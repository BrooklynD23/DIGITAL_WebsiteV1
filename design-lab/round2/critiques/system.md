# W2-CRIT-SYSTEM — cross-page system critique (8 routes, 2 worlds)

Verdict: **Signal: fix. Apple: fix.** Both worlds hold together through the shared WorldNav, WorldFooter and tokens. Both break in the same 4 places: local chrome, join endings, the red-anchor rule, and per-page copies of system parts. Neither needs a rebuild.

Method: dual-agent with one deviation. A ran as an isolated Opus sub-agent on the screenshots (no detector output). B was run inline by this critic because it is measurement-heavy: detector, prod-build sweep, rAF gates, CineClip probe and Gemini. The two were synthesised below.
Build measured: **production static export** (`next build`, `output: 'export'`) served with HTTP Range support by `design-lab/scripts/r2-crit-system-serve.mjs` on :3199. rAF gates ran on the dev server (:3100), because only dev keeps stack names for attribution.

Evidence (all under `design-lab/renders/r2/crit/system/`):

| Kind | Files |
|---|---|
| Viewport shots | `shots/<world>-<page>-<1440\|390>-00…07.png`: 128 shots, 8 evenly spaced steps per page |
| Contact sheets | `sheet-{signal,apple}-{1440,390}.png`. Rows: home, sidekick, shades, brain |
| Per-step metrics | `audit.json`: words, red blobs (pixel scan), moving regions (2-frame diff), network by type, fonts, chrome |
| Other measurements | `align.json` (grid edges) · `cine.json` (CineClip behaviour) · `raf/*.txt` (all 4 page gates × 2 worlds) · `detect.json` |
| Gemini | `montage-{signal,apple}.webm` (4 pages back to back, about 105 s each) · `gemini.md` · `gframes/` (cross-check frames) |

Scripts: `design-lab/scripts/r2-crit-system-{serve,audit,cine,cineprobe,align,montage}.mjs`.

---

## 0. Scores

### Nielsen 10 heuristics, whole 4-page site (Assessment A)

Heuristic 9 is scored n/a: there are no forms or error states on the path.

| # | Heuristic | Signal | Apple | Key issue |
|---|---|---|---|---|
| 1 | Visibility of status | 3 | 3 | Signal: CUR / T+ readouts. Apple: turn counters |
| 2 | Match with the real world | 2 | 3 | Signal jargon on mobile: CH1–3, F.Silk, TIMEBASE |
| 3 | User control | 3 | 2 | Apple global bar scrolls away. On a phone, the only route between projects is the footer |
| 4 | Consistency | 2 | 2 | See §1 and §2 |
| 5 | Error prevention | 3 | 3 | Reader: "Nothing plays until you press Read" |
| 6 | Recognition over recall | 2 | 3 | Signal 390 nav shows only `CH1 CH2 CH3` (`shots/signal-home-390-00.png`) |
| 7 | Flexibility | 3 | 3 | Speed slider, More spacing, scrub |
| 8 | Minimalist design | 3 | 3 | `[confirm]` noise. Apple home stacks 2 DIGITAL bars |
| 9 | Error recovery | n/a | n/a | — |
| 10 | Help | 3 | 3 | "illustrative" / FAITHFUL labels on BRAIN |
| | **Total** | **24/36** | **25/36** | Both: Acceptable to Good |

### Audit health

| Dimension | Signal | Apple | Key finding |
|---|---|---|---|
| Accessibility | 3 | 3 | Skip link and 44 px targets on all 8 routes; 0 small targets (`align.json`). Signal 390 nav hides project names |
| Performance | 2 | 2 | Monaspace Krypton 445 KB unsubset (Signal). SIDEKICK HTML 603 / 762 KB, and its 234 / 274 KB RSC is prefetched on every page of its world |
| Responsive | 3 | 3 | 0 horizontal overflow in 64 steps. Apple SIDEKICK clips are forced 16:9 at 390 |
| Theming | 3 | 3 | Signal page CSS has 0 raw hex. Apple has 20 raw colour literals. About 80 raw font sizes off the 6-step scale |
| Implementation integrity | 3 | 2 | 12 duplicated subsystems (§6). Apple: 2 forked local navs, 4 highlights strips |
| **Total** | **14/20** | **13/20** | Good / Acceptable |

### Detector

`impeccable detect`: 4 advisory findings, all `codex-grid-background`:
- `_system/tokens/worlds.css:252`
- `signal/brain/brain.module.css:4`
- `_shades/reader.module.css:24`
- `_brain/demo.module.css:107`

These are **false positives as slop**: the graticule is the Signal world's stated measuring instrument. They are **true positives as duplication**: there are 4 graticule implementations at 3 different pitches (80 px, 50 px, 10%×12.5%). Gemini independently flagged the density change on BRAIN (montage 01:31).

---

## 1. Signal Capture — does it read as one site?

**Design specificity (A):** written for DIGITAL. Projects are channels, the red trigger means "now / open", and glyphs sit beside real state (`UNASSIGNED`). The 4 home rules come back as seats on the project pages (`shots/signal-home-1440-04.png` → `shots/signal-sidekick-1440-07.png`). Risk: instrument jargon becomes costume on mobile.

### Chrome and grid

| Check | Result | Evidence |
|---|---|---|
| WorldNav | Same on all 4 pages: sticky 52 px, channel marks, active underline, outlined Join | `audit.json` chrome.nav = sticky/52 ×8 |
| WorldFooter | Same on all 4 | `shots/signal-*-1440-07.png` |
| Grid edge (nav container left = 168 px at 1440) | home 168, sidekick 168, **shades 48**, **brain 228**. SHADES' More-spacing chip ends at 1392, outside the 1272 nav edge | `align.json`; `shots/signal-shades-1440-00.png` |
| Channel / status strip | 3 formats for the same data (SIDEKICK `CH / WAS / STATE`, SHADES `CH2 SHADES ⎍ Planning`, BRAIN `CH3 · BRAIN · RUN 01`) | `shots/signal-{sidekick,shades,brain}-1440-00.png` |
| Join ending | 4 patterns: home **filled** bone button (`signal/_home/home.module.css:130`, `.ctaFilled`), SIDEKICK text link, SHADES `.action`, BRAIN outlined link back to home#join. SYSTEM.md §4 says "Signal CTA: none filled" | `shots/signal-*-1440-07.png` |
| Mobile nav | Labels visually hidden at ≤640 (`_chrome/chrome.module.css:36`). A newcomer sees `CH1 CH2 CH3` | `shots/signal-home-390-00.png` |

### Type stacks

- `fontSignal` is applied by `signal/layout.tsx` on all 4 pages. h1 is Hubot Sans 700 at 72 / 40 px on every page (`align.json`).
- SHADES sets Atkinson on its page root through its own `--font-read` (`signal/shades/signal.module.css:4-7`) and imports `atkinsonNext.variable` instead of the `fontReading` class (`signal/shades/page.tsx:5,21`).
- This is intended by PLAN §4 ("the page itself models dyslexia-friendly reading"). Keep it.
- But `fontReading` as specified also swaps mono to Geist Mono, which would break the Krypton readouts. The page was right to skip it, and the class is wrong (SYSTEM).
- BRAIN runs Krypton on 156 text elements against 23 for Mona (`audit.json` families). Mono is carrying prose labels there, not just readouts.

### Red: a single trigger per viewport (pixel scan, 32 Signal steps)

| Page | Steps with 0 / 1 / 2 red marks | Violations |
|---|---|---|
| Home | 3 / 4 / 1 | `shots/signal-home-390-03.png`: ruler trigger plus the active tile's 2 px red top line (`home.module.css:83`) |
| SIDEKICK | 3 / 4 / 1 | `shots/signal-sidekick-390-03.png`: trigger caret plus the GlyphSeat red anchor in the teardown row |
| SHADES | 5 / 3 / 0 | none |
| BRAIN | **8 / 0 / 0** | BRAIN never shows the trigger. Its brief assigns the red to "the nav's Join trigger", but WorldNav draws no red (`_chrome/WorldNav.tsx:6` comment vs `chrome.module.css:21`) |

- Root cause: `GlyphSeat` always draws its red anchor when idle (`_system/icons/glyphs.tsx:60`).
- Home's StageStrip already works around it with `--r2-trigger: currentColor` (`home.module.css:97`). SIDEKICK did not.
- There is no red text anywhere, and `--r2-trigger-ink` is unused. Marker fills are 4.4:1 on #0b0c0a, which passes the 3:1 non-text minimum.

### Icons

- 14 of 20 custom glyphs are used across the site. 6 build glyphs (Seat, Handoff, Gate, Swap, Night, plus StateMark) appear by name. The 8 agentic glyphs appear **only on Apple BRAIN**, through the `GLYPHS` lookup in its highlights strip (`apple/brain/page.tsx:43,80`).
- **Signal BRAIN uses 0 glyphs**, so the two BRAIN pages diverge on the one family drawn for them.
- 6 build glyphs are never used (Slab, Stack, Wire, Form, Orbit, Trace). §5d's project-leading subsets are absent: SIDEKICK has no slab / stack / swap, and SHADES has no lens / trace.
- No library icons were found (grep for lucide / heroicons / react-icons: 0). Chevrons and play icons are drawn per file (§6 #12).

---

## 2. Apple played straight — does it read as one site?

**Design specificity (A):** coherent, but borrowed. Centred Geist 600, pill CTAs and black→light chapters would fit any Apple-clone template (`shots/apple-home-1440-00.png`, `shots/apple-brain-1440-00.png`). What makes it DIGITAL is the content, the dot verbs and the copy, not the form.

### Chrome and grid

| Check | Result | Evidence |
|---|---|---|
| Global bar | 44 px, scrolls away, same on all 4 pages | `audit.json` nav = relative/44 ×8 |
| Local nav | **2 of 4 pages fork it**: `apple/sidekick/page.tsx:58` (+ CSS `sidekick.module.css:17-77`) and `apple/shades/page.tsx:28` (+ `apple.module.css:108-226`). SIDEKICK title sits at x=278 vs 256 (980 vs 1024 max-width); its pill is 28 px vs 30 px; link opacity 0.8 vs 0.88 | `align.json`; `shots/apple-sidekick-1440-00.png` vs `shots/apple-brain-1440-00.png` |
| Local-nav CTA | 4 labels and 2 destinations: "Join" (#join), "Take a subsystem" (#join), "Join the build" (#join), "Join build night" (→ home#join) | `audit.json` chrome.ctaLocal |
| Filled CTAs at the ending | HOME and BRAIN show 2 filled pills at once (nav pill + join pill). SIDEKICK and SHADES use a text link. Within the playbook (≤4 per 35 vh), but SYSTEM.md says "one filled CTA" | `shots/apple-home-1440-07.png`, `shots/apple-brain-1440-07.png` |
| Entrance grammar | `.r2-reveal` (30 px + fade) is used only on Apple HOME (3 uses). SIDEKICK, SHADES and BRAIN enter without it | grep `r2-reveal` |
| Highlights strip | 4 versions: home (edge-disabled arrows, 16-grid chevrons), SIDEKICK (no edge state, 24-grid chevrons), SHADES (own), BRAIN (`apple/brain/page.tsx:78`, no arrows at all) | §6 #2 |
| Footer | Shared. On SHADES it inherits Atkinson, because footer links and meta set no `font-family` | `shots/apple-shades-1440-07.png` |

### Type stacks

- `fontApple` is on all 4 pages. h1 is Geist 600 at 80 / 40 px on 3 pages.
- Apple SIDEKICK's `<h1>` computes to 16 px / 400, and its 80 px display lives on spans inside it. Its join `h2` is set at 80 px (`align.json`). The heading scale is out of step with the other 3 pages.

### Red

- Apple showed 0 red marks on SIDEKICK. HOME and SHADES show 1 anchor, and BRAIN shows 1 on the context write-head. This is compliant: CTA hover and anchor only.
- But `_system/cine/cine.module.css:50-52` paints the clip control in **Signal colours** (bone border on near-black, `#ece8de` ink) on Apple chapters.
- The clips are rendered on Signal's `#0b0c0a`. Apple SHADES has to lift contrast to hide the box on `#000` (`apple/shades/apple.module.css:427`).

### Icons

- Apple home uses 4 build glyphs well in the rules row.
- Apple BRAIN shows all 8 agentic glyphs at 64 px idle in its strip. This is the honest use: one glyph per concept card.
- SIDEKICK and SHADES still miss their §5d lead glyphs.

---

## 3. Motion grammar (both worlds)

| Rule | Result | Evidence |
|---|---|---|
| 0 rAF at rest | **7 of 8 gates PASS**. Signal home: 1 stray callback (a single `once` subscribe at `dots/ticker.ts:33`, not a loop). Signal SHADES failed at load→rest with 22 / 53 callbacks during a contended run, then **PASSED solo** (`raf/shades-signal-rerun.txt`) | `raf/*.txt` |
| ≤1 moving object per viewport | **Met.** The 2-frame diff found >1 changing region on 19 of 64 steps, but every one checked was a single stage with disjoint parts (bud children, scene readouts) | `shots/apple-home-1440-05.png`, `shots/signal-brain-1440-05.png` |
| No ambient loops | Met. No running infinite CSS animation in any viewport | `audit.json` anims (only scroll-linked `r2-p` / `r2-reveal`) |
| Verbs keep their real-state meaning | **Partial.** Apple home highlights use `orbit` (= Prototype) for "majors" and `pulse` (= handoff / review) for Venture Studies (`apple/_home/Highlights.tsx:23,25`). Elsewhere: form / orbit / scramble / wire = stages, explode = SIDEKICK, fixate = SHADES, bud = BRAIN. Correct | code |
| Shared drives | `useScrollProgress` / `useScrollDrive` are used only by SHADES and BRAIN. HOME and SIDEKICK hand-roll 4 drives (§6 #4) | grep |
| Easing tokens | `cubic-bezier(0.16,1,0.3,1)` is used 4 times off-token (`apple/shades/apple.module.css:339`, `apple/sidekick/sidekick.module.css:178`, `_shades/scanpath.module.css:135`) | grep |

### Gemini cross-check (`gemini.md`, frames in `gframes/`)

| Gemini claim | Verdict | Frame evidence |
|---|---|---|
| Signal: grid density changes on BRAIN (01:31) | **Agree** | 3 graticule pitches (§0 detector) |
| Signal: verbs map to technical actions; one mover at a time | **Agree** | 2-frame diff |
| Signal SHADES 01:00: red dot on "The" plus a red timeline mark at once | **Disagree** | `gframes/signal-{58,60,62}.png` pixel scan: 1 red blob each (14–52 px), the fixation dot only |
| Apple SHADES 01:13: red dot beside "Build night" | **Disagree** | `gframes/apple-{72,73,74}.png`: 0 red pixels |
| Apple: dark→light flip lands at different depths per page | **Partly agree**. Depth varies by story, as allowed; all 4 pages end light (playbook §5.6). The inconsistency is the white vs `#f5f5f7` join ground on SHADES | `shots/apple-shades-1440-07.png` |
| Apple: high restraint, no ambient loops | **Agree** | `audit.json` |

---

## 4. CineClip in a browser (`cine.json`, 4 Apple pages, 7 clips)

| Behaviour | Result |
|---|---|
| `once` | Plays on ≥60% entry, then ends: sidekick-swap, shades-fixate and brain-orb reach `ended` at t = 4 / 4 / 6 s. home-stages stayed `idle` once in dev (hydration lag); it plays in prod (`r2-crit-system-cineprobe.mjs`: ratio 1, `ended`). **Latent bug:** `played = true` is set before `play()` resolves, and the rejection is swallowed (`CineClip.tsx:136-139`). A rejected play never retries |
| `scrub` | currentTime follows scroll: explode 0→1.79 s, lightpath 0→1.87 s, context 0.70→5.0 s. **rAF only while scrubbing:** 52–57 CineClip callbacks while scrubbing, **0 at rest** for all 3 |
| `loop` | Not used on any page. Untested in the browser |
| Reduced motion | Posters only. Scrub clips mount no `<video>`; once clips show the "Play animation" opt-in. Correct on all 7 |
| 4:5 under 640 px | Correct on SHADES and BRAIN (`*-poster-4x5.webp`, 358×448). **SIDEKICK forces `aspect="16x9"` on both clips** (`apple/sidekick/page.tsx:130`, `ApplePinned.tsx:80`), so the scrubbed explode is a 358×201 strip at 390. Home-stages is forced 16:9 too, but it sits inside a card, which is acceptable |
| LCP | Apple BRAIN hero clip is first-viewport, but `eager` is not passed (`apple/brain/page.tsx:67`), so the hero poster is `loading="lazy"` |

---

## 5. Performance budget (prod export; raw bytes, my server does not gzip)

| Route | HTML (gz) | RSC .txt | JS first load (gz, build table) | CSS raw | Fonts | Prefetch (sibling RSC) | Cine at load → after full scroll |
|---|---|---|---|---|---|---|---|
| signal/ | 232 KB (31) | 19 KB | 116 KB | 161 KB | 739 KB | 295 KB | 0 → 0 |
| signal/sidekick | **603 KB (97)** | **234 KB** | 136 KB | 162 KB | 739 KB | 84 KB | 0 → 0 |
| signal/shades | 97 KB (17) | 30 KB | 122 KB | 198 KB | 676 KB | 283 KB | 0 → 0 |
| signal/brain | 349 KB (44) | 37 KB | 130 KB | 201 KB | 739 KB | 277 KB | 0 → 0 |
| apple/ | 156 KB (24) | 21 KB | 118 KB | 192 KB | 168 KB | 361 KB | 0 → 327 KB |
| apple/sidekick | **762 KB (114)** | **274 KB** | 140 KB | 229 KB | 168 KB | 114 KB | 0 → 61 KB (390: 378) |
| apple/shades | 102 KB (19) | 39 KB | 124 KB | 198 KB | 201 KB | 343 KB | 40 → 230 KB (390: 320 → 790) |
| apple/brain | 284 KB (38) | 55 KB | 130 KB | 201 KB | 168 KB | 327 KB | **693 → 723 KB** (390: 694 → 1,047) |

Where the weight comes from:
1. **SIDEKICK HTML.** 314–422 KB is inline board SVG (each board is ~81 KB, rendered 3–4×). Another 264–310 KB is RSC flight data, because server-rendered `<BoardSvg>` trees are passed as children / fallback into client components (`Highlights`, `ApplePinned`, `CloserLook`). Client components also import the board JSON, which puts it in JS too.
2. **Prefetch.** WorldNav `<Link>`s prefetch every sibling's RSC, so SIDEKICK's 234 / 274 KB payload downloads on every page of its world.
3. **BRAIN and home HTML.** SSR dot rest poses are 1,449–2,306 `<circle>` elements at 2-decimal precision.
4. **Fonts.** Signal: Krypton is 445 KB unsubset (`_system/fonts/index.ts`, flagged there). Both worlds also pay 119 KB of production root-layout preloads (`*.p.woff2`) that r2 never uses (lab-only, root layout off-limits).
5. **CSS.** Every r2 route loads 11 stylesheets, ~160–230 KB raw / ~35–45 KB gz. That includes other routes' modules (`/system` specimen, `/type` trial, the other world's SIDEKICK). Next's shared chunking merges sibling r2 CSS.
6. **Cine media.** Of the 20 MB on disk, at most 1.05 MB transfers per page view (Apple BRAIN, 390, full scroll).
   - Only brain-orb (693 KB, hero) loads eagerly. Everything else is `preload="metadata"`: 4–36 KB per clip at load, then full when within half a viewport.
   - The 10 MB of mp4 is never fetched by Chromium; it is the Safari fallback.
   - The brain-orb webm duplicates what the dot engine draws for 0 bytes (its `HeroOrb` fallback).
7. **Console.** 2 errors on every route are `_vercel/insights` and `speed-insights` 404s. These are a false positive off Vercel.

---

## 6. Duplicated code that should move into `_system` / `_chrome` (list only, not moved)

| # | Duplicate | Copies | Proposed home |
|---|---|---|---|
| 1 | Apple local nav | `_chrome/LocalNav.tsx`, `apple/sidekick/page.tsx:58` + `sidekick.module.css:17-77`, `apple/shades/page.tsx:28` + `apple.module.css:108-226` | `_chrome/LocalNav` with a `utility` slot |
| 2 | Highlights strip (snap-x + arrows) | `apple/_home/Highlights.tsx`, `apple/sidekick/Highlights.tsx`, `apple/shades/Highlights.tsx`, `apple/brain/page.tsx:74-90` (inline) | `_chrome/HighlightsStrip` |
| 3 | Play once on entry (IO + reduced-motion guard) | `_shades/PlayOnce.tsx`, `apple/shades/FixateClip.tsx`, `apple/sidekick/SwapClip.tsx`, `signal/shades/HeroStage.tsx`, + CineClip's own | `_system` `usePlayOnEntry` |
| 4 | Scroll-progress drive | `_home/useStageScrub.ts`, `_sidekick/useStackDrive.ts`, `apple/sidekick/ApplePinned.tsx:27-51`, `signal/sidekick/SignalTeardown.tsx:40-44`. The system `useScrollProgress` is used by 2 of 4 pages | extend `_system/tokens/scroll.ts` (pin + discrete-step modes) |
| 5 | Reduced-motion check | 12 inline `matchMedia('(prefers-reduced-motion…)')` calls vs `useReducedMotion` | `_system` hook (already exists) |
| 6 | Graticule background | `worlds.css:252`, `signal/brain/brain.module.css:4`, `_shades/reader.module.css:24`, `_brain/demo.module.css:107`; 3 pitches | `.r2-graticule` + a `.r2-scope-screen` (10×8 divisions) |
| 7 | Join chapter | 8 implementations (`signal/_home/JoinScope.tsx`, `apple/_home/JoinChapter.tsx`, plus the sidekick / shades / brain page sections ×2) | `_chrome/JoinChapter { world, headline, lead, roles?, seat? }` |
| 8 | Build-night / Discord facts | hardcoded in `_content/home.ts:8,127`, `_content/sidekick.ts:170`, `_content/brain.ts:259`, `_chrome/WorldFooter.tsx:21,25`. Only `_content/shades.ts:249` reads `lib/data/siteConfig` | one `_content/club.ts` re-exporting siteConfig |
| 9 | Canvas stage contract | `_brain/SceneStage.tsx` (230 lines) re-implements DotStage's ticker / IO / reduced-motion / SSR-rest contract for composed scenes | `DotStage` accepts `draw(t,size) → Frame` |
| 10 | Channel / status strip (Signal) | SIDEKICK, SHADES and BRAIN each have their own | `_chrome/ChannelStrip { ch, name, state, was? }` |
| 11 | Off-token easing | `cubic-bezier(0.16,1,0.3,1)` ×4 | `--r2-ease-entrance` token |
| 12 | Chevron / arrow / play SVGs | ad hoc in `apple/_home/Highlights.tsx`, `apple/sidekick/Highlights.tsx`, `apple/_home/JoinChapter.tsx:25`, `apple/shades` text links, `CineClip.tsx:283-297` | `GlyphChevron` / `GlyphPlay` in `_system/icons` |

---

## 7. Pending chrome requests: decisions

| Request | Recommendation |
|---|---|
| Non-sticky WorldNav option | **Accept as a prop, scoped by world, not by page.** Add `sticky?: boolean` to WorldNav. Apple is already non-sticky in CSS, so `apple/sidekick/sidekick.module.css:15` is a redundant override and should go. In Signal, keep sticky on all 4 pages; one page opting out breaks the instrument strip. Publish one `--r2-sticky-top` token so pins stop hand-computing it. Apple SHADES has its own `--chrome`; Apple home's pin subtracts the 44 px global bar that has already scrolled away (`apple/_home/home.module.css:26`) |
| LocalNav extra-control slot | **Accept.** Add `utility?: ReactNode` between the links and the CTA, so SHADES' SpacingToggle lives in the shared nav. Pair it with a `cta` contract: one label pattern ("Join build night") and one destination (`#join` on the page). This is the single change that removes duplicate #1 |

---

## 8. Copy budget, cross-page (8 sampled viewports per page, `audit.json`; page critics hold the full per-viewport runs)

| World | Home avg / max | SIDEKICK | SHADES | BRAIN | Page length at 1440 |
|---|---|---|---|---|---|
| Signal | 37 / 73 | 35 / 86 | 42 / 101 | **80 / 92** | 10.4 · 13.6 · 12.9 · 10.8 vh |
| Apple | 30 / 64 | 39 / 83 | 50 / 105 | **68 / 85** | 9.7 · **18.8** · 14.1 · 12.7 vh |

Budget: avg ≤30, cap 100.
- BRAIN is the density outlier in both worlds (PLAN §6.2's cut to 6 chapters is pending).
- Apple SIDEKICK is the length outlier at 18.8 vh.
- The SHADES ending exceeds the cap at 1440 (101 / 105).

---

## 9. Contract compliance: shared system (SYSTEM.md + signature-systems §5d)

| Block | Signal | Apple |
|---|---|---|
| Shared chrome (nav, footer, skip link, `#r2-main`) | **met** ×4 | **partial**: 2 forked local navs |
| One type trio per world | **partial**: SHADES text face by design; chrome inherits it | **partial**: same; SIDEKICK h1 scale |
| Red = single marker / CTA-anchor only | **partial**: 2 two-red viewports; BRAIN has 0 | **met**; cine control is off-world |
| Custom icon family, honesty rule | **missed** on projects: BRAIN 0 glyphs, no §5d lead subsets | **partial**: BRAIN strip uses all 8 agentic glyphs; SIDEKICK and SHADES lead subsets missing |
| Motion budget (0 rAF at rest, ≤1 mover, no ambient) | **met**: 1 stray callback on home | **met** |
| Each project keeps its spin | **met**: board stack, RSVP fixate, orb run (A, Gemini agree) | **met**: teardown, light path, context window |

---

## 10. Fix now, by world (ranked; owner-tagged for W3 routing)

### Signal Capture (≤8)

1. **[P1] SYSTEM: one red per viewport, enforced by the system.**
   - Evidence: `shots/signal-home-390-03.png`, `shots/signal-sidekick-390-03.png`.
   - Fix: `GlyphSeat` / `GlyphNight` anchors render ink unless the host carries `data-trigger`. On Signal, the trigger is the timebase marker. A seat is an open slot drawn as a dashed ring.
2. **[P1] SYSTEM + HOME: one shared Signal join ending.**
   - Evidence: `signal/_home/home.module.css:130` is filled, vs 3 other patterns in `shots/signal-*-1440-07.png`.
   - Fix: a `_chrome/JoinChapter` with WHEN / WHERE / BRING readout rows, one outlined mono action to Discord, and a slot for each project's seat row. HOME drops `.ctaFilled`.
3. **[P1] SIDEKICK + SYSTEM: cut SIDEKICK's 603 KB HTML / 234 KB RSC.**
   - Evidence: §5.
   - Fix: draw each board once as a `<symbol>` (or a static `.svg` asset) and `<use>` it. Stop passing server-rendered `<BoardSvg>` into client components. Set WorldNav links to `prefetch={false}`, or make the payload small, because every Signal page downloads it.
4. **[P1] SYSTEM: subset Monaspace Krypton to Latin.**
   - Evidence: 445 KB on every Signal page (`audit.json` fonts).
   - Fix: target ≤60 KB, as `_system/fonts/index.ts` already notes.
5. **[P2] SHADES + BRAIN: content edges on the nav container.**
   - Evidence: `align.json` (h1 at 48 and 228 vs 168), `shots/signal-shades-1440-00.png`.
   - Fix: hero inside the 1200 wrap plus gutter. BRAIN's T-rail sits in the gutter so the copy starts at 168.
6. **[P2] SYSTEM: a shared `ChannelStrip`** (CH · NAME · STATE line-form mark · WAS) for the 3 project heads. Evidence: `shots/signal-{sidekick,shades,brain}-1440-00.png`.
7. **[P2] SYSTEM: mobile nav names the projects.**
   - Evidence: `shots/signal-home-390-00.png`.
   - Fix: at ≤640 show `SIDEKICK SHADES BRAIN` in Hubot 12 px and drop the CH prefix. CH stays on desktop and in the footer.
8. **[P2] BRAIN: give BRAIN its trigger.**
   - Evidence: 0 red marks in 16 steps.
   - Fix: the red marker sits on the loop's live step in the hero trace ("here / now"). Leave the gate's held call as a dashed ring, as the brief says. Lead each chapter with its agentic glyph, as Apple BRAIN's strip already does (`apple/brain/page.tsx:80`): Loop, Tool, McpPort, Context, Compact, HarnessGate, Subagent, Eval, in `idle` state beside the chapter readout.

### Apple played straight (≤8)

1. **[P1] SYSTEM + SIDEKICK + SHADES: one LocalNav.**
   - Evidence: `apple/sidekick/page.tsx:58`, `apple/shades/page.tsx:28`; `align.json` title x 278 vs 256.
   - Fix: add the `utility` slot (§7). SHADES' spacing toggle goes in it. Delete both forks (~180 CSS lines).
2. **[P1] SYSTEM: one CTA contract.**
   - Evidence: 4 labels and 2 destinations in `audit.json` ctaLocal; `shots/apple-home-1440-07.png` shows 2 filled pills.
   - Fix: nav pill = "Join build night" → `#join` on every page. The join chapter's action is a chevron text link, so only one filled pill shows.
3. **[P1] SIDEKICK + SYSTEM: SIDEKICK weight.** 762 KB HTML / 274 KB RSC, prefetched by the other Apple pages. Same fix as Signal #3.
4. **[P2] SIDEKICK: let both clips pick 4:5 under 640.** Drop the forced `aspect="16x9"` at `apple/sidekick/page.tsx:130` and `ApplePinned.tsx:80`. The scrubbed explode is the page's one scrubbed asset, and at 390 it is a 358×201 strip.
5. **[P2] BRAIN: hero clip.**
   - Pass `eager` to the first-viewport `CineClip` (`apple/brain/page.tsx:67`).
   - Then decide whether the 693 KB brain-orb webm earns its bytes over the 0-byte DotStage hero it already falls back to.
6. **[P2] CINE + SYSTEM: on-world clip chrome.**
   - The control uses tokens instead of Signal literals (`_system/cine/cine.module.css:50-52`).
   - CINE renders Apple variants on `#000` (or alpha), so `apple/shades/apple.module.css:427` can drop its contrast lift.
7. **[P2] SYSTEM: one HighlightsStrip** (§6 #2): same arrows, edge-disabled state and 20 px gap on all 4 pages. BRAIN's strip gains the arrows it lacks (`apple/brain/page.tsx:78`).
8. **[P2] SHADES + SIDEKICK + BRAIN: shared entrance grammar.**
   - Apply `.r2-reveal` (30 px + fade on `view()`) to chapter heads, as HOME does.
   - Fix SIDEKICK's heading scale: the page title is the 80 px h1, and no h2 is set at hero size.

### Both worlds: shared improvements that lift both

1. **[P1] SYSTEM: a sponsor / faculty path.**
   - PRODUCT.md weights them equally, but all 8 endings route only to Discord or build night (`shots/*-1440-07.png`).
   - Fix: add a "Back a build" line to the shared JoinChapter (sponsor a build, host a workshop, donate equipment). Address `[confirm]` copy before production.
2. **[P2] SYSTEM: one club-facts source.** `_content/club.ts` from `lib/data/siteConfig` feeds the footer and the 4 join chapters. Today the facts live in 4 hardcoded copies (§6 #8).
3. **[P2] SYSTEM: chrome sets its own face.** `.footer`, `.footLinks a` and `.meta` declare `font-family: var(--font-text)`, so SHADES' Atkinson stays in the page body (`shots/apple-shades-1440-07.png`).
4. **[P2] SYSTEM: fix `fontReading`.** It should override only `--font-text` (Atkinson) and keep the world's mono. Then both SHADES pages use the class instead of `atkinsonNext.variable` + `--font-read`.
5. **[P2] HOME (Apple) + BRAIN copy.**
   - Swap verbs that drift from their meaning (`apple/_home/Highlights.tsx:23,25`): majors ≠ `orbit`, Venture ≠ `pulse`. Use `bud` / `seat` or a static glyph.
   - Replace "Open to every engineering major" (`_content/brain.ts:255`) with "any major", per PRODUCT.md.
6. **[P3] SYSTEM: duplicates #3–#6, #9, #11, #12 from §6.** These are refactors with no visual change. Schedule them after the visual fixes.
7. **[P3] CINE: `once` retry.**
   - Set `played` only after `play()` resolves, and retry on the next intersection (`CineClip.tsx:136-139`).
   - Also run the 1 stray rAF callback on Signal home (`raf/home.txt`) through the gate solo once more.

---

## 11. Head-to-head: two options for the team (no winner)

| | Signal Capture | Apple played straight |
|---|---|---|
| Best at | Being DIGITAL. Channels, trigger and line-form state turn the ownership model into the interface itself. SHADES' RSVP fixate and SIDEKICK's board stack feel native to it. Page CSS has 0 raw hex | Calm reading and a clear dark→light arrival at Join. Lower load per viewport; the most familiar shape for sponsors and faculty |
| Weakest at | Grid and strip discipline (3 left edges, 3 status-strip formats). Jargon and CH-only nav on a phone. 739 KB of fonts. BRAIN at 80 words per viewport reads like a dashboard | Template sameness: the form is borrowed and the identity sits only in content. Local chrome forked on 2 of 4 pages. Clip chrome and ground come from the other world |
| Cost to finish | Medium: alignment, strip, join, fonts | Medium: LocalNav, CTA contract, clip variants |
| Shared lift | Shared JoinChapter with a sponsor path; one LocalNav / ChannelStrip; the agentic glyphs on Signal BRAIN and the §5d lead glyphs on SIDEKICK and SHADES; SIDEKICK payload; one-red enforced by the glyphs, not by page workarounds | (same) |

Questions for the team:
1. If the CH1–3 labels need translating for half the audience, are they serving the student or the designer?
2. Could Apple keep its form and take Signal's seat / owner row as its one DIGITAL-only element? Would that be enough identity?
3. Should SIDEKICK's copper boards be the one sanctioned material colour, or is that a second accent?

Questions skipped: this is a sub-agent run; the orchestrator routes the fixes.

Run notes:
- Detector: ran once, 4 advisories.
- Browser: Playwright headless shell (SwiftShader).
- Overlay injection: not attempted (no `[Human]` tab in a sub-agent).
- Static server on :3199: stopped after the run.
- Temp build: in the scratchpad, outside the repo.
- Signal SHADES rAF: the first gate run was contended; it passed solo.
