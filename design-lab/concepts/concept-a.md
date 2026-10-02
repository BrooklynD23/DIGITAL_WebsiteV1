# Concept A — "The Signed Edition" (Editorial / Studio)

Route: `/design-lab/a` · Code: `app/design-lab/a/` · Renders: `design-lab/renders/a/v1/` · Stitch study: `design-lab/renders/a/stitch/`
Author: DA-A · 2026-10-02 · Status: prototype for Head Designer review. Copy is exploratory and still needs brand-voice-strategist → brand-guardian before production.

## Thesis

**DIGITAL publishes its work as a printed edition, and every story in it ends on a signature line that is still blank.**

The homepage is set like a design annual: a cover, a contents list, long features, a rules spread, a credits page and a colophon. The thesis "Make something worth putting your name on." is treated literally. *Name* sits on a red signature rule, a footnote defines "worth", and every project record, subsystem and leadership seat carries an unsigned `BUILT BY` line. The page has no proof it can't back up. The empty lines are the honest proof and the recruiting device in one move: the work is real, and the credits are open.

## 1. Visual system (§31)

### Typography

| Role | Family | Source | Weights | Size (clamp) | Line-height | Tracking |
|---|---|---|---|---|---|---|
| Display: thesis | Zodiak | Fontshare CDN `zodiak@400,401` (ITF FFL, not committed) | 400, 400 italic | `clamp(2.6rem, 11.2vw, 11rem)` = 42→176px | 0.94 | −0.02em |
| Display: feature title | Zodiak | same | 400 | `clamp(2.75rem, 7.2vw, 7rem)` | 0.98 | −0.02em |
| Heading: chapter lede | Zodiak | same | 400 | `clamp(2.25rem, 5.2vw, 4.75rem)` | 1.02 | −0.015em |
| Heading: rules spread | Zodiak | same | 400 | `clamp(2rem, 4.4vw, 4.25rem)` | 1.05 | −0.015em |
| Dek / split headline | Zodiak italic | same | 400i | `clamp(1.25rem,1.7vw,1.5rem)` / `clamp(1.75rem,3.2vw,3rem)` | 1.4 / 1.1 | 0 |
| Body | Switzer | Fontshare CDN `switzer@1` (variable) | 400, 500, 600 | 17px (`1.0625rem`); small 15px | 1.6 | 0 |
| Metadata | JetBrains Mono | `next/font/google`, route-scoped, `preload:false` | 400, 500 | 12px, uppercase | 1.4 | 0.06–0.08em |

Rules: one display voice (Zodiak) per page. Italic marks exactly one idea per block (*name*, the split headline, the open slot). Mono is scoped to metadata: IDs, labels, figure numbers, the HUD. It is never used for body text and never set below 12px. Display stays ≥40px at 390. Headings use `text-wrap: balance`.

### Color

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--a-paper` bg | `#f1eee7` | page | — |
| `--a-ink` fg | `#15130f` | text, rules, primary CTA fill | 16.0:1 on paper |
| `--a-ink-2` | `#3a362f` | secondary text | 11:1 |
| `--a-muted` | `#5f594f` | captions, dt labels | 5.98:1 |
| `--a-red` accent (primary) | `#d8412f` | signature rules, markers, focus ring, CTA hover, the rules-spread proof band | 3.84:1, so never small text |
| `--a-red-ink` | `#b3311f` | small red text (IDs, figure numbers) | 5.37:1 |
| `--a-highlight` (secondary) | `#f2c6b9` | red tint: Fig. 1 hover, selected pace | ink on it 11.97:1 |
| `--a-plate` (elevated surface) | `#e6e0d4` | photo plate stripes, ledger hover | muted 5.28:1 |
| `--a-rule` border | `#cfc8bb` | hairlines (decorative) | — |
| Night surface | `#15130f` / fg `#f1eee7` / muted `#a39c90` (6.82:1) / rule `#3a362f` | rules spread, RSVP screen, colophon | — |
| Red on night | `#ef5a45` | markers on dark | 5.49:1 |
| States | hover: underline 1→2px, red fill on CTAs; focus: 2px red outline, 3px offset (`#ef5a45` on dark); pressed: `aria-pressed` tint `#f2c6b9` | | |

There is one chromatic accent, kept from production (`#d8412f`). It has one meaning here: the signature or proof mark. No gradients, no second hue.

### Geometry

| Item | Value |
|---|---|
| Spacing scale | 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 144 px |
| Page margin | `clamp(16px, 4vw, 56px)` |
| Max width | 1440px |
| Grid | 12 columns, gap `clamp(16px, 2vw, 24px)`; collapses to stacked at ≤640 |
| Section rhythm | 96px between chapters (64px on phone) |
| Radii | **0 everywhere** (an identity decision, never mixed) |
| Borders | 1px hairline `--a-rule` (inside lists) · 1px ink (chapter breaks) · 2px ink (record/table tops) · 3px double ink (masthead) |
| Shadows | none; depth comes from paper ↔ night inversion only |

### Motion

| Item | Spec |
|---|---|
| Durations | 120 (hover tint) · 240 (underline, nudge) · 480 · 900ms (reveals) |
| Easing | `--ease-ink: cubic-bezier(0.2, 0.7, 0.1, 1)`; `--ease-std: cubic-bezier(0.4, 0, 0.2, 1)` |
| Springs | motion springs with `bounce: 0` only (highlighter 0.9s, media-between-text 0.7s). Nothing bounces: print doesn't wobble |
| Entrance | Thesis: Vertical Cut Reveal per word, 80ms stagger, CSS keyframe from first paint, then the red signature rule draws (scaleX, 0.9s delay). Chapter ledes: cut reveal on scroll. Rule nouns: proof band wipes left→right. Split headlines open their figure on scroll |
| Hover | links thicken the red underline and nudge the arrow 3px; contents labels slide 6px and go italic; ledger rows shift 12px on a plate tint; Fig. 1 layers tint |
| Page transitions | none (static export, in-page anchors) |
| Reduced motion | `MotionConfig reducedMotion="user"` + `useReducedMotion()` in each component + CSS `@media (prefers-reduced-motion)`. Final text, highlights fully drawn, media open, no keyframes, transitions ~0. RSVP never autoplays; it swaps words only on request |
| No-JS | all text renders final. In-view effects arm only after mount, and only for elements below the fold (verified with JS disabled at 390) |

### Iconography

Phosphor **Light** (`@phosphor-icons/react/dist/ssr`), 16–20px, ink color, `aria-hidden`. Used only as punctuation: `ArrowRight` on text links and CTAs, `ArrowUpRight` on external links. At most one icon per block. No icon chips or icon-in-circle. Figures are procedural SVG, not icons.

## 2. Layout and navigation

- **Masthead:** wordmark `DIGITAL @ Cal Poly Pomona`, issue-line meta "Build night · Thu 6:00 PM · Bldg 17, Rm 1635", 3 links (Work · Studio · Join → in-page anchors), one outlined CTA "Take a subsystem". It sits over a 3px double rule. It is not sticky (minimal chrome) and has no hamburger: on phones it keeps wordmark + 3 links at 44px targets.
- **Cover:** kicker → thesis over 3 staggered lines (line 2 indented 16%, line 3 indented 4%) → a 3-column band: footnote + dek + "See the work" | **Fig. 1** | "In this edition" contents (01–05).
- **Chapters**, each opened by `NN —— TITLE` mono meta + a Zodiak lede:
  01 The work → 02 How a build runs (the one dark spread) → 03 Where you fit → 04 Credits → 05 Thursday → colophon.

## 3. Hero

The thesis is the image. "Make something / worth¹ putting / your *name* on." *Name* is italic and sits on a red signature rule with a red `×`, like a contract line. The footnote defines the standard: "¹ Worth it: you can explain every decision in it to a stranger." The artifact sits under it: **Fig. 1**, a procedural isometric stack of DG-001's 7 subsystems (real names from `phoneV2.ts`), each with an empty `owner ______` line. It is captioned as a diagram, not a teardown. There is one CTA in the hero area ("See the work"), and the masthead CTA is the only other one.

## 4. Project section (§41)

1. **Ledger** (layout taken from Stitch variant B): DG-001 / DG-002 / DG-003 rows: ID, title, problem, status marker (■ active, □ open). These are anchor links.
2. **DG-001 feature:** kicker, Zodiak title, the Media Between Text split headline "One device. [layer glyph] Owned in parts." (real copy from `phoneV2.ts`), drop-cap dek, body, a 2-column parts list of all 7 subsystems with their real descriptions, and a link to the real build route. A **Build record** sidebar lists Problem · Status (active · phase [confirm]) · Subsystems · Workflow plan → prototype → test → integrate · Duration [confirm] · Outcome "Not shipped yet" · Partner "None confirmed" · Repo "Not public yet [confirm]" · **Built by ______**. **Fig. 2** is a 3:1 striped plate `[ PROJECT PHOTO — DG-001 on the bench ] [placeholder]`.
3. **DG-002 feature** is mirrored (record left, title right-aligned). Split headline: "One word [RSVP chip] at a time." (real reveal copy from `glasses.ts`). **Fig. 3** is a working RSVP plate: the real word stream from `glasses.ts` with the recognition letter pinned on a red fixation tick, "Read it" / Pause, and pace buttons 200 · 300 · 450 (450 = real HUD demo). The record lists Method, Stack, Build cycle 8 months, Mentor Dr. Mohamed El Hadedy, Needs, Outcome [confirm], and Built by ______.
4. **Also on the bench:** Venture Studies (program, real line + learnings) | DG-003 *Pitch the next build.* → `/contact?type=project`.

## 5. Secondary section: "How a build runs"

This is a full-bleed night spread. The 4 real ownership rules (`phoneV2.ts:295-300`) are set at 34–68px. The key noun in each (owner, review path, test gate, repair plan) gets a **proof band**, a Text Highlighter adapted to draw a red band under the lower x-height, like a proofreader's mark. A one-line gloss runs in the margin ("You take a subsystem." …), and a workflow rail 1 PLAN —— 2 PROTOTYPE —— 3 TEST —— 4 INTEGRATE sits below. Also secondary: **Where you fit** (3 columns of real needs + "No project experience required.") and **Credits**: 7 real seats from `team.ts`, each with a dotted leader to a blank red signature line, plus "Apply for a seat".

## 6. Join path and footer

"Thursday, *6:00 PM.*" is set at poster size, followed by "Building 17, Room 1635 · Cal Poly Pomona", the real meeting description, 3 numbered steps ("Come to build night. Free to join." / "Pick a subsystem, or a need from a build." / "Take it through the test gate. Sign it."), the close line "Put your name on one.", one filled CTA "Take a subsystem" → `/contact?type=project-team`, and a secondary link "Watch first on Discord". The **colophon** is a night band with a 21vw cropped wordmark plus Colophon / Write (email, Discord) / Print ("Set in Zodiak, Switzer and JetBrains Mono. Design lab prototype A. Not the live site.") / legal links.

## 7. Responsive behavior

| Width | Behavior |
|---|---|
| 1440 | 12-col. Cover band 3/6/3. Features 7 + 4 cols with record sidebar. Rules: no. / text / gloss. Credits 2 columns |
| 834 | Masthead meta hidden. Cover: text and contents side by side, Fig. 1 full width below. Records drop under the body as 2-col definition grids. Rules gloss under the text. Credits 1 column |
| 390 | Single column. Thesis 44px, line 2 indented 6%. Fig. 1 switches to a compact numbered drawing (its own `role="img"` label). Ledger rows stack. Credits roles wrap above their sign lines. RSVP screen 4:3. Masthead CTA hidden (Join stays) |

Checks: 0px horizontal overflow at 390 / 834 / 1440 (`da-a-overflow.mjs`). Every link and button is ≥44px tall except the global skip link.

## 8. Interaction language

Editorial and quiet. Interactions behave like reading marks, not app widgets: red underlines thicken, proof bands wipe, figures open between words, and the signature rule draws itself once. The one real "toy" is the RSVP plate, because it demonstrates the actual project method rather than decorating it. There is no cursor effect of our own, no parallax, no scroll-jacking, no idle animation.

## 9. Copy (exploratory, concept-specific voice: annotated, footnoted)

| Slot | Line | Source |
|---|---|---|
| Thesis | Make something worth putting your name on. | canonical |
| Footnote | ¹ Worth it: you can explain every decision in it to a stranger. | copy-analysis direction 2 |
| Dek | Engineering, computer science, design and business students build real hardware here, one owned part at a time. This is the record of what is on the bench. | new; disciplines from `homeLanding.ts:169` |
| 01 lede | Two builds on the bench. One open slot. | new |
| DG-001 split | One device. Owned in parts. | `phoneV2.ts` hero |
| DG-002 split | One word at a time. | `glasses.ts` reveal |
| 02 lede | Four rules hold every build together. | new + real rules |
| 03 lede | Products need more than programmers. | BRIEF §40 territory |
| 04 lede | The credits are blank. | new (copy-analysis directions 1 + 6) |
| Close | Put your name on one. | copy-analysis direction 10 |

Unverified values are rendered as `[confirm]` / `[placeholder]` on the page itself. No stats, partners, people (except the real mentor), dates or photos are invented.

## 10. Libraries used and why

| Library | Where | Why |
|---|---|---|
| fancycomponents **Vertical Cut Reveal** (MIT, header kept) | `fancy/vertical-cut-reveal.tsx` | masked word reveal for the thesis and chapter ledes. The motion spring was **ported to a CSS keyframe**: motion serializes `initial="hidden"` as `translateY(100%)` into the SSR HTML, which would hide the headline without JS |
| fancycomponents **Text Highlighter** (MIT) | `fancy/text-highlighter.tsx` | proof band on the 4 rule nouns. SSR shows it drawn; it arms only below the fold; reduced motion keeps it static; `mark="band"` added |
| fancycomponents **Media Between Text** (MIT) | `fancy/media-between-text.tsx` | figure opens between the words of each project's split headline. The media is a ReactNode (procedural SVG / RSVP chip, no photos exist). SSR renders it open; `sr-only` full sentence |
| `motion` 13.4.6 (`motion/react`) | `MotionRoot.tsx`, highlighter, MBT | springs, `useInView`, `useReducedMotion`, `MotionConfig reducedMotion="user"` |
| `@phosphor-icons/react` Light (SSR build) | page | direction-A icon family from `research/icons.md`; hairline weight matches Zodiak |
| `next/font/google` JetBrains Mono | `layout.tsx` | OFL, self-hosted, route-scoped |
| Fontshare CDN (Zodiak, Switzer) | `layout.tsx` `<link>`, one per family | best A pairing in the type-lab renders. FFL forbids redistribution, so production needs a Head Designer exception to DESIGN.md §8 ("next/font only") or an OFL swap (Instrument Serif ≥56px only + Instrument Sans) |
| Procedural SVG (no lib) | `Figures.tsx` | Fig. 1 isometric subsystem stack, layer glyph, striped photo plates (§19: code for diagrams) |
| Not used (by choice) | GSAP/Lenis, R3F, COBE, Rough.js, Recharts, dnd-kit, thinking-orbs | the direction asks for minimal chrome. One focal motion (the cut reveal plus signature) is enough, and there's no real data for charts or locations |

## 11. Stitch experiment (Superdesign substitute)

Stitch project `projects/11223608568082692807` produced 3 screens. Screenshots are in `design-lab/renders/a/stitch/`.

| Variant | How | Result |
|---|---|---|
| 1 "Monograph" (desktop) | `generate_screen_from_text` (default model) **timed out** ("The operation timed out."). `list_screens` kept returning `{}`. The screen surfaced only as the project thumbnail (fetched at `=w1200`) | Masthead + red-footnote thesis, TOC with page numbers, "dossier" features with spec registers, "Seats currently open" |
| 2 "Poster / asymmetric" (desktop) | `generate_screen_from_text`, `GEMINI_3_5_FLASH_LITE`, ok | huge italic "name" with signature rule; full-width DG ledger with status markers |
| 3 "Mobile long-read" (390) | `generate_screen_from_text`, `GEMINI_3_5_FLASH_LITE`, ok | single column, TOC naming projects, ■ STATUS ACTIVE kickers, boxed rules |
| `generate_variants` (3× REIMAGINE, LAYOUT) on screen 2 | **timed out**. `list_screens` stayed `{}`, so variant IDs were never retrievable | — |

**Kept:** (a) the full-width **ledger** of DG rows with status markers (V2, V3) → added above the features; (b) **"Built by ______"** signature line under records (V1); (c) spec-register records with a 2px top rule (V1); (d) TOC as a cover element (V1, V3).
**Rejected:** every fabricated fact Stitch invented despite explicit "do not invent" prompts: people "J. Vasquez (EE/ME '25)", "K. Chen (CE '26)", "850 wpm", "Spartan-7", "6061-T6 aluminum", "Vol. IV", "Cohort IV", "© 2024", "REV v0.9 Spring Alpha", stock photos of a teardown and smart glasses. Also rejected: cosplay jargon (serial refs, GPS coordinates, "cadre", "venture monograph"); Bodoni Moda (hairlines break at small sizes; Zodiak rendered better in type-lab); the poster hero (the thesis reduced to a margin note loses the sentence); boxed pill-like rule rows; all-caps mono body text.
**Lesson:** Stitch is useful for layout grammar only. Its output must be scrubbed line by line, because it fabricates credible-looking specs and people even when told not to.

## 12. Render loop (§33)

| Loop | Found | Fixed |
|---|---|---|
| 1 | thesis line 2 overflowed ("putting y…") · `shoot.mjs` full-page repeats the top of the page after ~8192 device px (tile artifact) · DG-001 glyph clipped | re-split lines 2/3 · wrote `da-a-fullpage.mjs` (3000px clipped bands stitched with ffmpeg) · glyph sizing |
| 2 | mobile: credits overflow +14px; night spread lost side padding (`.chapter` shorthand overrode it); 7 subsystems listed twice | wrapping credit rows; `padding-block`; compact Fig. 1 + caption pointer; tablet credits 1-col |
| 3 | Gemini critique (`v1/gemini-critique.md`): full-height red highlight read as "UI highlighter"; hero figure floated; dek claimed "every major" (unbacked) | proof band (`mark="band"`); figure aligned to band baseline; dek now names the 4 real disciplines; Fig. 2 plate 21:9 → 3:1 |

Final: 0 console errors at 1440 / 834 / 390 (both `shoot.mjs` and `da-a-fullpage.mjs`); also 0 with JS disabled and with reduced motion. RSVP play/pause/pace verified by Playwright (`da-a-inspect.mjs --interact`). `tsc --noEmit` is clean for `app/design-lab/a/**`.

## 13. Risks / known weaknesses

1. **Fontshare licensing**: Zodiak/Switzer can't be self-hosted; production needs a DESIGN.md exception or an OFL fallback.
2. **Length**: 9.2k px desktop / 11.5k px mobile. The editorial rhythm needs scroll; a short-attention visitor may not reach "Thursday". Mitigated by the masthead CTA + contents, but there's no sticky nav.
3. **Placeholder load**: Fig. 2 and many `[confirm]` cells are honest but visually heavy until real photos and phases arrive. The concept depends on the club producing photography.
4. **Global chrome hack**: the route hides the production Navbar/Footer with a scoped `<style>` (`body > nav[aria-label="Primary"], body > footer`). It's brittle if those components change.
5. **Drop caps / magazine tropes** can tip into pastiche if more editorial devices are added. Keep it to one drop cap per feature.
6. "Free to join", the [confirm] phases and the leadership seat flow all need club confirmation before production.
