# Apple playbook, measured (R2-APPLE, 2026-10-02)

Result: Apple's pages are quiet, not clever. Median headline 5 words, 45-58% of viewports carry 12 words or fewer, one pinned or scrubbed artifact per chapter, no scroll library. Everything below is measured from apple.com US, unless tagged `[HIG]`, `[license]` or `[inference]`.

## 0. Method and limits

- 8 pages, desktop 1440x900 and mobile 390x844 (iPhone UA, DPR 2): iphone-18-pro, iphone-air, macbook-pro, airpods-pro, apple-vision-pro, apple-watch-series-12, environment, privacy. All returned HTTP 200 with full content; none blocked automation.
- Playwright headless Chromium, scrolled in 0.4-viewport steps (23-134 steps/page). Screenshots at 8 positions + contact sheets: `design-lab/round2/references/apple/<page>/`. Raw JSON: `metrics-{desktop,mobile}.json`, `video-probe.json`. Scripts: `design-lab/scripts/r2-apple-*.mjs`.
- "Words in view" = text nodes whose box intersects the viewport, opacity >= 0.5, and which win `elementFromPoint` (hit-tested). Nav, footer, footnotes and legal text excluded. Words inside video pixels are not counted.
- Light/dark rhythm = mean luminance of the 8 screenshots (D < 90, L >= 170). Coarse: 8 samples per page.
- Not measured: the content of the `<canvas>` on the two iPhone pages (1440x760 and 1728x912, purpose unidentified), real scroll-lag feel, Safari-only behavior.
- Apple's own pages serve SF Pro Display/Text (`ff` measured). Screenshots are study material, not to be shipped.

## 1. Per-page table, desktop 1440x900

| Page | Doc height | Words in view avg / med / p90 | Viewports <=12 words | Viewports >100 words | Headline words med (avg) | Hero H1 | Section med height | Sticky >=300px | Scroll-linked els | `<video>` | Light/dark, 8 shots |
|---|---|---|---|---|---|---|---|---|---|---|---|
| iPhone 18 Pro | 37.3 vh | 23 / 5 / 67 | 58% | 3% | 5 (5.3) | 80/84 "Pro further." | 1.38 vh | 1 | 7 | 13 | D D D D D M L L |
| iPhone Air | 36.8 vh | 31 / 17 / 81 | 45% | 4% | 6 (5.9) | 56/60 "iPhone" | 1.37 vh | 1 | 7 | 16 | all L |
| MacBook Pro | 46.9 vh | 26 / 14 / 69 | 49% | 1% | 5 (4.8) | 80/84 "M5. M5 Pro. M5 Max." | 1.67 vh | 3 | 8 | 14 | D D D D D D L L |
| AirPods Pro 3 | 32.1 vh | 33 / 13 / 101 | 49% | 10% | 4.5 (4.7) | 96/100 | 1.11 vh (one 19.9 vh chapter) | 1 | 9 | 16 | all L |
| Vision Pro | 36.3 vh | 39 / 40 / 87 | 33% | 3% | 6 (5.8) | 80/84, wt 700 | 2.00 vh | 8 | 3 | 26 | L D M M M D D L |
| Watch Series 12 | 33.5 vh | 32 / 6 / 101 | 54% | 11% | 5 (5.9) | 80/84 "A work of heart." | 1.58 vh | 2 | 19 | 7 | D D M D L M L L |
| Environment (story) | 15.5 vh | 58 / 32 / 145 | 34% | 18% | 6 (5.7) | 80/80 | 1.24 vh | 2 | 3 | 7 | all L |
| Privacy (story) | 9.5 vh | 42 / 26 / 97 | 22% | 9% | 5 (5.5) | 72/76 | 0.96 vh | 1 | 0 | 10 | all D |

Headline words = h1/h2 plus `[class*=headline]` elements of 20 words or fewer (n = 24-55 per page). "Scroll-linked els" = elements in view with 5 or more distinct transform/opacity states across the scroll.

### Mobile 390x844 deltas

| Page | Doc height | Words in view avg / max | Viewports <=12 words | Hero H1 size |
|---|---|---|---|---|
| iPhone 18 Pro | 42.4 vh | 17 / 99 | 65% | 40/44 |
| iPhone Air | 43.1 vh | 27 / 106 | 50% | 34/50 |
| MacBook Pro | 53.9 vh | 23 / 128 | 55% | 48/52 |
| AirPods Pro 3 | 30.7 vh | 35 / 137 | 43% | 48/52 |
| Vision Pro | 27.1 vh | 58 / 140 | 15% | 40/44 |
| Watch S12 | 36.1 vh | 31 / 234 | 56% | 40/44 |
| Environment / Privacy | 16.9 / 9.9 vh | 47 / 140 and 31 / 97 | 29% / 33% | 40/40 and 48/48 |

Mobile doc height is -25% to +17% of desktop (iPhone/MacBook +14-17%) and sparser: 4 of 6 product pages have 50% or more of viewports at 12 words or fewer. Median text block is 223-284 px wide, 29-37 chars/line (desktop 326-455 px, 31-52 chars; Vision is the outlier at 697 px / 78).

## 2. Type scale (computed styles, all pages agree)

| Role | Desktop size / line / tracking / weight | Mobile size / line | Where |
|---|---|---|---|
| Hero super | 80/84, -1.2px (-0.015em), 600 (96/100, -1.44px on AirPods) | 40/44 or 48/52 | hero + chapter H2 |
| Chapter headline | 56/60 -0.28px, or 48/52 -0.144px, 600 | 32/36 | big statements |
| Sub-headline | 28/32 +0.196px (+0.007em), 600 | 21/25 | most common H: 17-21 per page |
| Lead paragraph | 21/25-29 +0.231px, 600 (the "one paragraph" per chapter) | 17/25 | 49-57 words, once per chapter |
| Eyebrow / card title | 17-28, 600, 1-3 words | 17-21 | above headline |
| Body | 17/21-25 -0.374px (-0.022em), 400/600 | same | caption, spec |
| Footnote | 12/16 -0.12px | same | legal |

- Six sizes cover the whole page (80, 56, 48, 28, 21, 17) plus 12 for footnotes. Weight 600 dominates; 700 only on Vision Pro. Headline line-height ratio 1.05; body 1.24-1.47.
- Tracking changes with size (SF optical sizing). With Inter or Geist, re-tune by eye; do not copy the px values blind.
- Body color `rgb(29,29,31)` on white, headlines on dark are near-white. Stat numerals (Environment): 48/52 -0.144px 600, caption <= 15 words.

## 3. Pattern findings

| Pattern | Measured evidence |
|---|---|
| Sticky + changing caption | `position: sticky` pin parents are 2.0-4.0 vh tall (MacBook 4.0 and 3.0, Watch 2.5 and 2.0, AirPods 2.5, iPhone 2.2). Vision Pro stacks 7-8 "drawer" pins of 1.6-2.0 vh each. Pinned element is 848-901 px tall (full viewport). |
| Scroll-scrubbed asset | 0 `<canvas>` frame sequences and 0 numbered image sequences (>= 12 frames) found on 8 pages. Scrub is a paused `<video>`: AirPods `#design` 4.9 s 1260x900 (currentTime changed 11 times while paused), Watch 4.8 s 606x606 (8 times). iPhone-18-pro and Vision showed 1 weak hit each. |
| Play-on-enter clips | 7-26 `<video>` per page, muted, no `autoplay` attribute (JS starts them), clips 2.2-7 s non-looping; ambient backgrounds 7.5-16.7 s looping. Pause buttons present on product pages (14-72 matched controls). |
| Zoom-to-device | MacBook `.hardware-container`: scale 1.265 held ~6 steps (2160 px), then 1.036 -> 0.719 and translateY 47 -> 3 px across ~720 px (0.8 vh). Linear to scroll. |
| "Get the highlights." carousel | AirPods: 29 items, item 1260x680 (87% of width, 76% of height), gap 20 px, `scroll-snap-type: x mandatory`, section 1226 px (1.36 vh), heading 3 words, first 6 captions 9-19 words (later ones to 57). On iPhone, MacBook, AirPods, Watch. |
| "Take a closer look." viewer | MacBook, AirPods, Watch, Vision. Section 1000-1060 px (1.1-1.2 vh), 4 own words (the heading), prev/next buttons labelled "Previous/Next feature, ... product viewer". Content is swapped media, not a text list. |
| Stat callout | Environment: 4 numerals (60%, 50%, 70%, 100%) at 48/52, 600, each with a line icon and 4-15 words. |
| Compare table | Privacy: Safari vs Chrome, 6 rows, 2 columns, check/cross icons, rows 53 px high, one 40-72 px headline above. |
| Tile / bento | Used at the bottom only: "Why Apple is the best place to buy" 4 cards, "Keep exploring" cards, "Our values lead the way" 3 cards. Never mid-story. |
| Chapters | Page = Hero, highlights, closer look, 5-8 chapters (eyebrow 1-3 words + 2-6 word headline + 1 lead paragraph + media), buy/explore tiles, footer. Doc height 32-47 vh on product pages, 9.5-15.5 vh on story pages. |
| Local nav | Sticky 52 px (72 px on iPhone, includes model switcher), `top: 44` at load, `top: 0` after <= 5% scroll (global nav is `absolute`, scrolls away). Holds product name, 3-6 anchors, blue Buy. Buy stayed visible at all 7 scroll samples on 5 of 6 product pages; Vision hides it (top -52 px) after the first scroll. Mobile: pill with name + "Explore" + "Buy". |
| Scroll libs | GSAP, ScrollTrigger and Lenis absent on all 8. Proprietary `data-anim-*` groups (12-22 per page; 2 on Privacy). CSS `animation-timeline`/`scroll-timeline` rules present on 7 of 8 (not Environment). |
| CTA economy | "Buy" 4, 5, 4, 4, 2, 4 on the six product pages (0 on story pages) vs "Learn more" text links 22-34 (4 on Vision). One filled blue pill, many chevron text links. |

## 4. Motion measurements

- Computed transitions across 6,862 transitioning elements (8 pages): 0.32 s 32%, 0.24 s 18%, 0.10 s 12%, 0.20 s 5%, 0.344 s 4%. Easing: `cubic-bezier(0.4, 0, 0.6, 1)` 38%, `ease` 36%, `linear` 11%, `ease-out` 6%.
- Stylesheet beziers (counts per page): `(0.4,0,0.6,1)` 94-167, `(0,0,0.2,1)` 35, `(0.42,0,0.58,1)` 26, `(0.25,0.1,0.3,1)` 13, `(1,0.1,0,0.3)` 2.
- Running CSS animations sampled: 320 ms most common, then 1000, 450, 400, 100 ms. Scroll-linked values are unitless progress, not timed.
- Reveal offset is 30 px: gallery cards start at `translateY(30px)`, opacity 0, end at 0 / 1 (5 distinct states across the scroll).
- `prefers-reduced-motion: reduce`, same pages: AirPods in-view video samples playing 23 of 55 -> 0 of 25; MacBook 28 of 39 -> 0 of 13. Gallery cards render at opacity 1, `transform: none`. MacBook doc height 42,229 -> 36,934 px (-12.5%): pins collapse.

## 5. The 12 transferable principles

| # | Principle | Backing measurement |
|---|---|---|
| 1 | One idea per viewport; most viewports are nearly silent | 45-58% of viewports <= 12 words on 5 of 6 product pages; avg 23-39 words |
| 2 | Headline is a short sentence; eyebrow names the topic | median 5 words (4.5-6); eyebrows 1-3 words; product-page max 13-16 (MacBook 31, Vision 74 are paragraphs tagged headline) |
| 3 | Hero = name + 2-5 word line + one action | "Pro further." (2), "A work of heart." (4), "M5. M5 Pro. M5 Max." (5), price/Buy pill beside it |
| 4 | Few type sizes, one weight family, huge top size | 6 sizes (80/56/48/28/21/17), weight 600, hero 80/84 at 1440 and 40/44 at 390 |
| 5 | Text column is narrow; wide blocks are rare | median block 326-455 px, 31-52 chars/line (Vision 697 px / 78), p90 718-852 px; max 920-1408 px only for full-bleed captions |
| 6 | Dark chapters for hardware, light for the shop; flip rarely | iPhone/MacBook D x5-6 then L x2; Watch flips 3 times; every page ends light |
| 7 | Pin one artifact; pin short | pin parents 2.0-4.0 vh; 1-3 sticky >=300 px elements per page |
| 8 | Scrub one asset, play the rest once | 0 canvas sequences; ~1 scrubbed video per page; 7-26 clips of 2.2-7 s, non-looping |
| 9 | A horizontal highlights strip carries breadth so the main scroll stays short | 29 cards, snap-x mandatory, 1260x680, 20 px gap, 1.36 vh section |
| 10 | "Closer look" is a 1.1-1.2 vh viewer with 4 words and arrows | 1000-1060 px sections; prev/next buttons |
| 11 | Persistent local nav carries the single primary CTA | 52 px sticky, Buy visible at 7 of 7 samples on 5 of 6 pages; 2-5 Buy vs 22-34 text links |
| 12 | Reduced motion is a designed state, not a break | 0 videos playing, opacity 1 immediately, page 12.5% shorter on MacBook |

## 6. Copy-density rules (budgets for DIGITAL, derived from the table)

| Element | Budget | Apple measure |
|---|---|---|
| Eyebrow | 1-3 words | 1-3 |
| Headline | median 5, hard cap 8 (2-line max at 80 px) | median 5, product-page max 13-16 |
| Lead line under headline | 1 sentence, <= 25 words | Apple's lead paragraph is 49-57 words, once per chapter. We halve it |
| Card / caption | 9-19 words | 9-19 (first 6 AirPods cards) |
| Stat callout | numeral + <= 15 words | 4-15 |
| Viewport budget | avg <= 30, p90 <= 70, cap 100 | avg 23-39, p90 67-101 |
| Silent viewports | >= 45% of viewports <= 12 words | 45-58% |
| Chapter length | 1.1-1.7 vh median | 1.11-2.00 |
| Mobile | same words, taller; >= 50% of viewports <= 12 words | 50-65% on 4 of 6 product pages |
| Primary CTA | <= 4 filled buttons per 35 vh; text links for the rest | 2-5 per 32-47 vh |

## 7. Motion rules

| Rule | Value |
|---|---|
| UI state (hover, tab, card) | 240-320 ms, `cubic-bezier(0.4, 0, 0.6, 1)`; colour 100 ms linear |
| Enter reveal | translateY 30 px + opacity 0 -> 1, scroll-linked, never more than 30-48 px of travel |
| Pin | 1-4 vh of scroll per artifact; sticky container = viewport height |
| Zoom/assemble | scale ~1.26 -> 0.72 over ~0.8 vh, linear to scroll position |
| Media clip | 2.2-7 s, plays once on enter, ambient loops only as background; pause control always present |
| Triggers | (a) viewport entry = play once; (b) scroll position = scrub one asset; (c) tap/arrow = carousel step; no cursor-driven or idle motion |
| Reduced motion | no autoplay, content visible at load, pins collapse to static stacked sections |

## 8. Icon rules (Apple HIG SF Symbols page, fetched via the HIG JSON endpoint) `[HIG]`

- 9 weights, each matched to an SF text weight; 3 scales (small/medium/large) defined relative to cap height. Rule for us: size icons to the cap height of the adjacent label, and match stroke to the label weight.
- 4 render modes: monochrome, hierarchical (one colour, different opacity per layer), palette, multicolor. Variable color is for change over time ("use it to communicate change, don't use it to communicate depth").
- Custom symbols: start from a template, stay "simple, recognizable, inclusive, directly related to the action"; match detail level, optical weight, alignment of the system set. Draw whole shapes instead of cutouts so layers animate; name and annotate layers (primary/secondary/tertiary).
- Animations: appear, bounce, scale, pulse, variable color, replace, wiggle, breathe, rotate, draw on/off (SF Symbols 7, "draws the symbol along a path through guide points", maps to SVG `stroke-dashoffset`). "Apply symbol animations judiciously."
- Not on the HIG page: the numeric grid (that guidance was removed to developer docs, Sept 2022 note). Open the template in the SF Symbols app if exact guides are needed.
- DIGITAL translation: 24 px grid, one stroke (1.5 px, as chosen in round 1) with a 1.25/2 px pair for light/bold contexts; two layers per icon (primary stroke 100%, secondary 40-50%); labelled `aria-label` or `aria-hidden` plus visible text; draw-on 400-600 ms, once; never replicate an Apple product or logo.

## 9. HIG extracts that apply to web marketing `[HIG]`

| Topic | Rule (source: developer.apple.com HIG JSON, fetched today) |
|---|---|
| Motion | "Add motion purposefully"; "Don't add motion for the sake of adding motion"; make motion optional; brief precise feedback; avoid motion on frequent UI interactions; let people cancel. visionOS: avoid ~0.2 Hz oscillation, peripheral motion. Page last updated Sept 9, 2025. |
| Reduce Motion | Tighten springs; track gestures directly; avoid z-depth animation; replace x/y/z transitions with fades; avoid animating into/out of blur. Matches Apple.com behavior in 4. |
| Typography | Avoid Ultralight, Thin, Light; prefer Regular to Bold. Min sizes: iOS default 17 pt, min 11 pt. Minimise typefaces. Variable fonts with optical sizing. Support 200% text enlargement. |
| Contrast | WCAG AA: 4.5:1 up to 17 pt, 3:1 at 18 pt or bold. Don't use color alone. |
| Targets | 44x44 pt default (28 min iOS); ~12 pt padding around bezeled controls, ~24 pt around bare ones. |
| Media | No autoplay audio/video without discoverable controls; avoid fast flashing; offer captions/transcripts. |
| Materials | Liquid Glass is for the functional layer (nav, controls), not content; standard materials in content; for clear glass over bright media add a ~35% dark dim layer; thicker material for fine text. For us: blur only on the sticky stage tracker, never on text cards. |

## 10. Licensing `[license]`

| Asset | Finding | May DIGITAL use it? |
|---|---|---|
| SF Pro, SF Compact, SF Mono, New York (developer.apple.com/fonts) | License: "solely for creating mock-ups of user interfaces to be used in software products running on Apple's iOS, OS X or tvOS". "You may not embed the Apple Font in any software programs or other products." Non-Apple OS use prohibited. No redistribution. Apple Developer registration required. | No. Not as web font, not self-hosted, not on a website. |
| SF Symbols | Licensed for UI of software on Apple OSes; HIG itself notes "prohibition against using symbols, or images that are confusingly similar, in app icons, logos, or any other trademarked use", and some symbols depict Apple products and cannot be customised. Full PDF terms were not fetched; relied on HIG text plus search results quoting the agreement. | No. |
| CSS stack `-apple-system, BlinkMacSystemFont, system-ui` | References the installed font; distributes nothing. Community answers say this needs no permission. Renders SF only on Apple devices. Not legal advice. | Yes, as fallback only. |
| Legal alternatives `[inference, licences from memory, not re-verified today]` | Inter (SIL OFL 1.1, variable, has an optical-size axis in v4, the closest SF Pro Display analogue), Geist (OFL), IBM Plex (OFL). Round-1 `research/fonts.md` already lists self-hostable OFL options. Icons: Lucide, Phosphor, Tabler per CONTEXT-PACK 4; confirm each licence before shipping. | Yes |

## 11. What NOT to copy

- Apple logo, product names ("Pro", "Air", "Max", "Vision"), SF fonts/Symbols, any Apple media, copy lines (e.g. "Pro further."), the green/white check-cross icon art, the "Get the highlights."/"Take a closer look." headings verbatim, Safari/Chrome app icons.
- Overall trade dress. If a page could be mistaken for apple.com (black hero + 80 px SF-like headline + blue Buy pill + "Learn more >" everywhere), it reads as fake Apple. Our identity must keep signal-red `#d8412f` (one accent), the industrial-studio tone and real artifacts.
- Apple's product photography/film budget. We have zero real photos (CONTEXT-PACK 1); our substitute is procedural SVG/WebGL of the real artifacts, labelled `[placeholder]` when not real.
- Screenshots in `references/apple/` are third-party copyrighted: keep them local, do not commit to a public repo or deploy. 15 MB.
- Do not invent proof. Apple stats are Apple's. Our safe numbers: 7 subsystems, 4 stages, 8-month cycle, 2 projects.

## 12. Application

### (a) Workflow-orb strip (Plan / Prototype / Test / Integrate)

1. Strip = one chapter: eyebrow <= 3 words (e.g. the 8-month cycle), headline <= 5 words, 4 stages.
2. Each stage: 1-word eyebrow (the stage name) + <= 12-word line. Orb animates once on entry (2.2-7 s clip rule); loops only if a pause control exists.
3. Sticky stage tracker 52 px, 4 dots, one filled CTA, text links for the rest (principles 10-11).
4. Stage switch = 30 px translate + opacity, 320 ms `cubic-bezier(0.4,0,0.6,1)`. Pin 4 stages in ~4-5 vh (1.0-1.2 vh each, in the 1-4 vh pin range).
5. Reduced motion: four static orbs stacked, all copy visible, no pin.

### (b) Exploded phone story

1. Pin the phone in a sticky container sized to the viewport; parent height = 7 subsystems x ~1.0 vh + 1 vh intro (Vision Pro uses 1.6-2.0 vh per drawer; AirPods 2.5 vh for one scrubbed asset).
2. Layers separate by linear scroll mapping (scale 1.26 -> 0.72 over 0.8 vh is Apple's MacBook ratio); do not time-ease the scrub.
3. Subsystem caption: 2-word eyebrow + <= 5-word headline + one <= 12-word line; list stays sticky beside it.
4. Mobile: replace the pin with a "closer look" viewer (1.1-1.2 vh, 4 own words, prev/next) stepping through 7 subsystems; Apple mobile pages are sparser (17-35 words avg), so cut copy, do not shrink it.
5. Reduced motion: stacked 7 static layered diagrams; page height drops (Apple: -12.5%).

### (c) Smart-reading-glasses page

1. Hero is silent: product name + <= 5-word line + one CTA. The artifact is the RSVP word itself, one word at a time (demo 450 wpm per CONTEXT-PACK), with a pause control.
2. Chapters (eyebrow + headline + <= 25-word lead): the problem (saccades, losing your place), the method (RSVP, reader sets WPM), the hardware (FPGA). One idea per viewport; 45% or more viewports at 12 words or fewer.
3. "Highlights" strip: 4-6 cards, snap-x mandatory, 20 px gap, 9-19-word captions; this holds the FPGA, dyslexia-first and WPM facts so the main scroll stays under ~15 vh (story-page range 9.5-15.5 vh).
4. Compare table (6 rows, 2 columns) only with facts we can state; stat callouts only with real figures (450 wpm demo). No invented numbers.
5. Dark chapter for hardware, light for join/footer; flip once.

## 13. Next step for the orchestrator

Prototype (a) or (b) with the budgets in sections 6-7, then run the hit-tested words-in-view check (the `__visibleWords` function in `design-lab/scripts/r2-apple-measure.mjs`) against `/design-lab/<slug>` to confirm avg <= 30 words and >= 45% of viewports <= 12.
