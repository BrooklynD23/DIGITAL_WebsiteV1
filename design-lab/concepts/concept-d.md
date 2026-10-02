# Concept D: Human / Community ("Pull up a chair")

Route: `/design-lab/d` · Files: `app/design-lab/d/{layout.tsx,page.tsx,content.ts,sketch.tsx,DrawOn.tsx,fonts.ts,d.module.css}`
Assets: `public/design-lab/d/*.webp` (4 Gemini placeholders + 1 converted project asset) · Renders: `design-lab/renders/d/v1/`
Status: exploration prototype. All copy is exploratory; production copy still goes brand-voice-strategist → brand-guardian.

## 1. Thesis

**One sentence:** DIGITAL is the room where you stop being "a CS major" and become "the person who owns the boot path", and this page shows that change happening to *you*.

**Paragraph:** The question is "Who will I become and what will I make if I join?" With 0 named members, 0 photos and 0 testimonials, a people-centred site can't show people. So it shows the *seat* instead. Every section is written in second person and ends in a blank signature line (`BUILT BY ______`) that the visitor is invited to fill. Warmth comes from paper, a serif with soft terminals, and a pencil layer (Rough.js) that draws the real ownership model (owner → review → test gate → repair plan) the way someone would sketch it on a Thursday night. It doesn't come from stock smiles. The projects stay the hero as portfolio records, and every unknown field stays visibly `[placeholder]`.

## 2. Visual system (§31)

### Typography
| Role | Family | Size (clamp) | Weight | Line-height | Tracking | Notes |
|---|---|---|---|---|---|---|
| Display (H1) | Fraunces, `SOFT 100, WONK 1, opsz 144` | `clamp(2.75rem, 1.2rem + 5.4vw, 6rem)` (44 → 96px) | 480 | 0.98 | −0.02em | Italic only on "your name" (one signature move per page) |
| H2 | Fraunces, `opsz 96` | `clamp(2.25rem, 1.5rem + 3vw, 4rem)` | 460 | 1.02 | −0.015em | Two-line, period-ended sentences |
| H3 (records, seats) | Fraunces, `WONK 0, opsz 48` | `clamp(1.75rem, 1.4rem + 1.2vw, 2.5rem)` | 520 | 1.08 | −0.01em | |
| Problem line | Fraunces italic, `opsz 24` | 1.25rem | 400 | 1.4 | 0 | The human sentence of each record |
| Body | Figtree | 17px (16px ≤640) | 400 / 600 for links | 1.6 | 0 | max ~62ch; lead 18 → 21px |
| Meta / labels | IBM Plex Mono | 12–13px | 400 / 500 | 1.4 | 0.02–0.08em, caps for labels only | Never body copy |
| Margin notes | Caveat | 20–32px | 500 / 600 | 1.1 | 0 | ≤6 uses: hero note, step numbers, "open", join numerals, rail footnote, table label. Annotation only, never information that exists nowhere else |

Loaded via `next/font/google` in `app/design-lab/d/fonts.ts` (all OFL). Mono + Caveat use `preload: false`.

### Color
| Token | Value | Use | Contrast |
|---|---|---|---|
| `--d-paper` (bg) | `#f4eee4` | page | — |
| `--d-paper-2` (secondary surface) | `#ebe2d3` | "How a build runs" band | — |
| `--d-card` (elevated) | `#fbf8f2` | photo prints, seat panel, tag | — |
| `--d-ink` (fg) | `#1e1a15` | text, primary button | 15.0:1 on paper |
| `--d-ink-2` | `#463e35` | lead, secondary text | 9.1:1 |
| `--d-muted` | `#675d51` | meta, captions | 5.6:1 (5.0:1 on paper-2) |
| `--d-pencil` | `#8a7f71` | sketch strokes, link underlines (non-text) | — |
| `--d-line` (border) | `#d6cab8` | hairlines | — |
| `--d-accent` (one chromatic accent) | `#d8412f` (production signal red, kept on purpose) | marks only: name underline, status dot, selected seat, "Signed" circle, numerals on night | not used for small text |
| `--d-accent-ink` (accent text / hover / focus) | `#a8321f` | `[placeholder]` labels, button hover, focus ring | 5.8:1 |
| `--d-night` / `--d-night-fg` / `--d-night-muted` / `--d-night-line` | `#1e1a15` / `#f4eee4` / `#bfb4a4` / `#4a4238` | Join band ("Thursday night") | fg 15.0:1, muted 8.5:1; accent numerals 2rem (large text) |
| States | hover: accent underline grows (nav), `accent-ink` fill (button), arrow nudges 3px; focus: 3px `accent-ink` outline + 3px offset; selected: filled red chair + red underline; disabled: n/a | | |

### Geometry
- Spacing scale (px): 4 · 8 · 12 · 16 · 20 · 24 · 28 · 32 · 48 · 64 · 88. Section rhythm `clamp(64px, 8vw, 112px)`.
- Page margins: `--d-gutter: clamp(16px, 4vw, 48px)`. Max width: 1280 (content 1184).
- Grid: 12 cols / 24px gutter (hero, records); 7:5 splits (how, seats); 6:5 (join). 1 col ≤960 for records, seats and join.
- Radii: **2px everywhere** (prints, buttons). No pills, no rounded cards. Chairs are the only circles (they're seats).
- Borders: 1px hairline (`--d-line`), 1.5px ink for "ruled" heads of tables and lists, 1px dashed pencil for the unsigned DG-003 slot.
- Shadows: **none**. Paper sits flat; depth comes from ±0.6–4° rotation on at most 4 objects (hero print, tag, whiteboard print, sign-up sheet).

### Motion
- Durations: 120 (fast) · 200 (base hover) · 320 (fills) · 900ms (pencil draw-on).
- Easing: `cubic-bezier(0.2, 0.7, 0.2, 1)` UI; draw-on `cubic-bezier(0.45, 0.05, 0.3, 1)`. No springs (nothing bounces; a pencil doesn't).
- Entrance: Rough.js sketches draw on once when 15% visible (`DrawOn.tsx`, IntersectionObserver, stroke-dash on `pathLength=1`). **Text never animates in**, so first paint is complete.
- Hover: nav underline wipes in (accent, 1.5px), arrows nudge 3px, chairs scale 1.08, button darkens to `accent-ink`.
- Page transitions: none (single page). Future: View Transitions between Work records.
- Reduced motion: `DrawOn` never arms, so every sketch is already drawn (server HTML). All transitions → 0.01ms. Verified: 0 undrawn paths under `reducedMotion: 'reduce'`.
- No JS: identical page. Sketches are server-rendered paths, and the seat picker is CSS-only (radio group + `:has()`, with a list fallback via `@supports not selector(:has(*))`).

### Iconography
Phosphor **Regular** (`@phosphor-icons/react/dist/ssr`, server-rendered). 18–20px, `aria-hidden`, ink colour. 5 glyphs total: ArrowRight, ArrowUpRight, CalendarBlank, MapPin, DiscordLogo. Rules: icons only beside text, never alone, never in a circle chip. No Duotone used; the hand-drawn layer does that job.

## 3. Layout and sections (homepage)

| # | Section | What it does | Real data |
|---|---|---|---|
| 0 | **Nav** (sticky, 64px) | Wordmark · The work · How a build runs · Seats · CTA "THU 6 PM Come build". ≤960: links hide, CTA stays | meeting time |
| 1 | **Hero** | H1 thesis with a red pencil underline under *your name*; second-person lead; 1 button + 1 text link; mono meta row (Thu 6 PM · Bldg 17 Rm 1635 · no experience required). Right: workbench print `[placeholder]`, a rotated `BUILT BY ____` tag, Caveat note "this part's yours" | thesis, meeting, eligibility |
| 2 | **Who you become** (signature section) | Ledger: *You arrive as* (discipline) → pencil arrow → *you leave as* "the person who…" (each line paraphrases a real subsystem bullet, with source in mono). Footnote: examples, not assignments | `phoneV2` bullets, glasses, Venture Studies learnings |
| 3 | **The work** (§41) | DG-001 and DG-002 as **portfolio records**: ID · status + honest note · title · italic problem · object · `dl` of fields (who it needs, how it runs / built with, what you learn / mentor, duration, outcome, repo/cost) · `BUILT BY ____` sign-off · link to the real route. Sticky print beside the record. Then a 2-col ledger: Venture Studies (program) + **DG-003 unsigned** "The next build is ____" → pitch | `projects.ts`, `phoneV2.ts`, `glasses.ts`, `homeLanding.ts` |
| 4 | **How a build runs** (Rough.js experiment) | Pencil rail through 6 hand-circled stops: Thursday 6 PM → Owner → Review → Test gate → Repair plan → **Signed**. Each stop: a second-person sentence + the verbatim rule in mono. Footnote: plan, prototype, test, integrate. Whiteboard print `[placeholder]` | `buildScope.scopeItems`, `workflowStages`, `meetingInfo` |
| 5 | **Pull up a chair** (secondary, interactive) | Top-down sketch of a workbench with an exploded phone; 7 chairs = 7 subsystems (radio group). Selecting a chair opens its panel: description, 3 "you" bullets, scope/risk/mode, `OWNER ____`. ≤640: becomes a sign-up list | `phoneV2.subsystemSections` |
| 6 | **Join** (night band) | "Thursday, 6:00 PM. Building 17, Room 1635." · 3 numbered steps · primary CTA "Tell us you're coming" (`/contact?type=membership`) + Discord text link · room print `[placeholder]` · **sign-up sheet** of the 7 real leadership roles, all "open" → `/contact?type=leadership` | `team.ts`, `involvement.ts`, `siteConfig` |
| 7 | **Footer** | Closing line in italic "Put your name on one." over a signature line; 3 link columns (projects/contact, email/Discord/meeting, legal + "Concept D") | — |

**Navigation model:** in-page anchors for the 3 story beats plus one persistent action (come Thursday). Records link out to the 2 real immersive routes. Every CTA deep-links an existing `/contact?type=` intent.

## 4. Responsive behavior
- **1440:** 12-col hero (7/5), records alternate image left/right with a sticky print, 6-stop horizontal rail, workbench table with 4 + 3 chairs beside the seat panel, join 6/5.
- **834:** single column for hero photo, records, how, seats and join. The rail drops the drawing and becomes a 3×2 grid with Caveat numerals. The workbench table keeps its sketch (full width) above the panel.
- **390:** nav = wordmark + CTA. "Who you become" rows stack (arrow becomes "→" after the major). Record fields stack label over value. The rail becomes a vertical pencil line on the left with numerals on it. Seats become a sign-up list of radios (56px rows). Footer columns stack.
- Display floor 44px (H1) / 36px (H2) at 390. 0px horizontal overflow at 390. All links and labels ≥44px tall (checked by script).

## 5. Interaction language
"Pencil on paper." Things get **drawn**, **circled**, **underlined** and **signed**; they don't glow, float or slide. The one interactive object (choose a chair) is a real form control: arrow keys move between seats, `Tab` enters the group, and the panel follows the checked radio. Hover feedback is an underline drawn in red or a 3px arrow nudge. The blank signature line repeats 18× as the page's motif: the space your name goes in.

## 6. Copy (exploratory; voice = second person, short declaratives)
- H1: *Make something worth putting your name on.* (canonical thesis)
- Lead: *Different majors, one product. You take one part of a real build, carry it through review and testing, and sign it. Nobody hands you a finished project.*
- *You arrive with a major. You leave owning a part.* · *Two builds on the bench. Both need owners.* · *How a part gets your name on it.* · *Seven seats at one table. Pick the one you'd take.* · *Put your name on one.*
- Status honesty: "prototyping, not shipped [confirm phase]", "phase [confirm]", `[placeholder]` for duration / outcome / repo.
- Banned-list check (§40 + BRAND): 0 hits. No names, quotes, stats, partners or events invented. The only person named is the real mentor, Dr. Mohamed El Hadedy.
- "Free to join" / "No project experience required" are from `glasses.ts` / `homeLanding.ts`.

## 7. Libraries and why
| Library | Why | Where |
|---|---|---|
| `roughjs` 4.6.6 (generator only) | The required sketch layer. `rough.generator()` runs **server-side with fixed seeds**: SSR-stable, 0 KB drawing JS on the client, visible without JS | `sketch.tsx` |
| `@phosphor-icons/react` 2.1.10 (ssr entry) | Direction D's family per `research/icons.md`; server-rendered, no context provider | `page.tsx` |
| `next/font/google` (Fraunces, Figtree, IBM Plex Mono, Caveat) | OFL, self-hosted; Fraunces/Figtree is the type-lab D pick | `fonts.ts` |
| Native IntersectionObserver (~30 lines) | The only client JS on the page: arms the draw-on | `DrawOn.tsx` |
| **Not used:** motion, GSAP, Lenis, three, cobe, dnd-kit, page-mascot | Less spectacle is the brief. COBE has no real locations. dnd-kit wasn't needed because the seat picker works better as a native radio group. A mascot would turn into a fake "person" | — |

## 8. Gemini images (4 of 4 budget used, 0 retries)
Shared style suffix: *"Documentary photograph, 35mm film look, natural available light, slightly grainy, muted warm colors, shallow depth of field, honest and unpolished, not stock photography, no logos, no brand names, no legible text anywhere, no faces."*
1. `d-workbench.webp` (hero), 120 KB: "Landscape 3:2. A cluttered university lab workbench in the evening, three-quarter overhead angle. A bare green PCB in a small vise, a soldering iron in its stand with a thin wisp of smoke, a digital multimeter with probes, loose jumper wires, tweezers, a spiral sketchbook open with pencil block diagrams, a half-finished 3D-printed phone-shaped enclosure in pale grey, two coffee mugs, a desk lamp casting warm tungsten light. Nobody in frame."
2. `d-hands.webp` (DG-001), 80 KB: "Close-up of two people's hands and forearms only, working together over a small green circuit board on an anti-static mat: one steadies it with tweezers, the other holds a multimeter probe to a test pad. A pencil and a paper checklist with illegible handwriting. Faces completely out of frame." **Post-processed:** cropped the top 90px because a partial chin appeared.
3. `d-whiteboard.webp` (How), 80 KB: "A classroom whiteboard covered in a hand-drawn marker diagram: seven rough rectangles connected by arrows around a tall rounded-rectangle outline of a phone, sticky notes, smudges, half-erased lines, three markers on the tray. All handwriting scribbled and illegible. Nobody in frame."
4. `d-room.webp` (Join), 80 KB: "An engineering lab classroom at dusk, two long tables pushed together, open laptops showing grey CAD wireframes, a box of electronic parts, calipers, a roll of solder, backpacks on chairs, empty chairs pulled out as if people just stepped away, purple-orange evening sky. Nobody in frame."
Plus `d-book-pov.webp` (132 KB): an ffmpeg webp of the Smart Reading route's own `BookBG_Clear.png` (2.7 MB → 132 KB). It is captioned as a render asset, not a prototype photo.
Every generated image shows `[placeholder]` in its visible caption **and** at the start of its alt text, and says "Not a DIGITAL photo."

## 9. Verification (render loop §33)
- 3 loops of `shoot.mjs` at 1440/834/390 → final set in `design-lab/renders/d/v1/d-{desktop,tablet,mobile}.png`. **0 console errors** at all 3 viewports.
- Interaction and fallback script `design-lab/scripts/da-d-check.mjs`: mobile overflow 0px, 0 targets <44px, seat click and ArrowRight both switch panels, no-JS shows the H1 + 59 sketch paths + seat 1, reduced motion leaves 0 undrawn paths. Section captures: `design-lab/scripts/da-d-section.mjs` → `renders/d/v1/checks/`.
- Gemini critique: `design-lab/critiques/d-v1-gemini.md`. Acted on: the oval "potato" table was redrawn as a workbench with an exploded phone. Rejected: hiding record fields behind accordions on mobile (§41 wants the fields visible).
- `npx tsc --noEmit`: 0 errors in `app/design-lab/d/`.
- Capture note: `shoot.mjs` full-page PNGs tile (repeat content) past ~10k px on tablet / at DPR 2 on mobile. Use `checks/mobile-dpr1.png` and the section captures for the true mobile and tablet bottom.

## 10. Risks and known weaknesses
1. **Long page:** ~11,200 CSS px at 390. The records' 6-field tables and the 5-row ledger add density (Gemini's top complaint). Candidate cut: merge "Who you become" into the seat panel.
2. **The placeholders carry the warmth.** Without real build-night photos, a 4-image concept rests on generated scenes. The hands in `d-hands` read as older adults, not students. The concept only works if the club supplies real photos.
3. **Caveat** is a familiar face and can tip toward cute or café. It's limited to ≤6 annotation spots; Pencil-style alternatives (e.g. Gochi Hand, a custom hand) are untested.
4. **Global chrome override:** the root layout always renders the production Navbar/Footer/cursor. `layout.tsx` hides them with a `body:has([data-concept="d"])` style tag (needs `:has`, which is fine in evergreen browsers). The prototype's `<header>`/`<footer>` sit inside the root `<main>`, so their landmark roles are lost. Production would need its own layout.
5. Exploratory pairings ("Computer science → the person who takes a board from reset to a known state") are illustrative. Each needs club sign-off so they don't read as role assignments.
6. Fontshare is not used. No new deps needed.

## v2 changes (Wave 4 refinement, §36)

Inputs: `critiques/d-by-c.md`, `critiques/crit3-d/gemini-motion.md`, `critiques/micro-d.md`, `critiques/a11y-d.md`, orchestrator must-fix.
Renders: `design-lab/renders/d/v2/d-{desktop,tablet,mobile}.png` (stitched), crops in `v2/crops/`, checks in `v2/checks/`.
Sections 3, 8 and 10 above describe v1. Where they conflict with this section, this section wins.

### Images (BRIEF rule 4)
| Image | v2 | Why |
|---|---|---|
| `d-workbench.webp` (hero) | **Removed** | Its 3D-printed phone enclosure implied a physical DG-001 prototype exists |
| `d-hands.webp` (DG-001) | **Removed** | Hands beside DG-001 read as members working on the real build |
| `d-whiteboard.webp` (How) | **Removed** | It mimicked the real subsystem map; the pencil now draws that map from `phoneV2.ts` |
| `d-book-pov.webp` (DG-002) | **Removed** | Replaced by the pencil method plate (consistency; the real asset stays on `/projects/smart-reading`) |
| `d-room.webp` | **Kept, moved to the hero** | An empty room, no hardware and no people, can't be read as DIGITAL work. It renders as a desaturated proof print (`.proof`). Caption and alt start with `[placeholder]`, and the caption also says "not Building 17" |

Gemini images this pass: **0**. Lab D total: still 4 generated, now **1 shipped** (`public/design-lab/d/` holds only `d-room.webp`, 80 KB).

### Applied (fix-now, 8)
1. **Each build draws its own artifact (X3, P1, must-fix).** DG-001 shows a pencil "ownership stack" of the 7 real subsystems, with review hooks on every handoff. It's captioned "an ownership map, not a hardware stack". DG-002 shows saccade hops and a return sweep along lines of text (the problem), beside one word in a frame with fixation marks (RSVP). Both are Rough.js, server-rendered, on a faint 5mm engineer's-pad grid (B2).
2. **Work moves up (H1, R1).** "Who you become" is folded into the seats. The seat H2 is now "You arrive with a major. You leave owning a part.", and each panel opens with "You leave as the person who…", paraphrasing that subsystem's own bullets. Mobile height: 11,190 → ~9,600px. Desktop: 7,906 → ~6,360px.
3. **The chosen seat is carried down the page, with no JS (X2, lab item).** The checked radio drives, through `.root:has(input[value=…]:checked) [data-echo=…]`, Join step 3 ("Take the Hardware / PCB seat."), the primary CTA (`/contact?type=project-team&seat=<id>`), the footer close ("Put your name on Hardware / PCB.") and the signature caption ("Owner, Hardware / PCB"). A fallback for browsers without `:has()` shows generic text. Blanks went from 18 to 3 (hero tag, seat panel OWNER, footer). The records now say "Seven owner slots. Names are added at sign-off.", and sign-up sheet rows use a dotted leader instead of rough blanks. Verified by script: after ArrowRight, all 4 echoes read "Integration / Testing".
4. **One sequenced drawing (M1, M2, M3).** Only the How rail animates: the line draws first (1300ms), then circles 1→6 every 190ms, ending on the red "Signed". The order comes from a per-drawable `--i` in `sketch.tsx`. All other sketches default to `still`. The observer now starts 10% *before* entry (`threshold: 0`). Probe (`da-d-drawprobe.mjs`): rail 0.97 → 0.20 → 0.00, c6 1.00 → 1.00 → 0.11 at 600/1200/2200ms. The fill fade now uses the spec UI curve (micro #20).
5. **Mobile navigation (U2, a11y #3).** Below 960px a native `<details>` "Contents" index card (ruled lines, 44px rows) offers The work, How, Seats and Come Thursday. It works without JS. At ≤640 the CTA reads "Thu 6 PM ↓".
6. **Seat panel announced (U3, micro #19, a11y #1).** Each radio has `aria-describedby="seat-desc-<id>"`, pointing at that panel's leave-as line, description and bullets. Still CSS-only.
7. **One CTA intent per label (U1, TA2).** "Come Thursday ↓" (nav + hero) is plainly a jump to Join. The only form CTA is the seat-specific "Take the … seat". A secondary "Ask a question instead" goes to `?type=membership`.
8. **Join headline and copy hygiene (T1, T2, T4, TA1, TA3, TA6).** The Join H2 is two deliberate lines ("Thursday, 6:00 PM." / "Building 17, Room 1635.") with nbsp and a 4rem cap. Photo and plate captions are Figtree italic, with only `[placeholder]` in mono. Step numerals run 1–6. Eyebrows went from 6 to 3 (hero, Pull up a chair, Come build). The hero lead is 19 words. Leadership roles are split on " — " into role / project, so no em-dash renders.

Trivial lab items (not counted): the production cursor elements stay hidden and `html{cursor:auto!important}` is unchanged in `layout.tsx`; the production skip link is now hidden too (micro #24). The nav is solid paper (U4). `::selection` is a red tint. "Seats"/"Terms" are ≥44px wide. The sign-up sheet is a `<section>` (a11y #2). The wordmark gets the hover underline (micro #6). The DG-002 link reads "Open Smart Reading" (U5). The hero BUILT BY tag sits on the paper, not on the photo. **Accent text check:** `#d8412f` is used only for non-text marks (underline, status dot, chair fill, Signed circle). Text uses `#a8321f` (5.8:1 on paper). The Join numerals on night use `#ef6a55` (5.3:1). No white-on-`#d8412f` fill exists.

### Rejected (with reason)
- **Seat-panel crossfade / sliding indicator (Gemini motion #3):** sliding and fading isn't D's pencil language (the critic agrees, M4).
- **"Footer accordion opens instantly" (Gemini):** false; D has no accordion.
- **Accordions or carousels for record fields on mobile (v1 Gemini):** §41 wants the fields visible. The length problem was solved by the fold (item 2) instead.
- **Third-person rewrite of How (B1):** How is the visitor's path ("from your seat"). Records were already third person. Second person is now confined to the hero, How, seats and Join, which is where the visitor acts.
- **Engineer's grid page-wide:** limited to plates and the How band so it reads as one object, not wallpaper.

### Deferred
- **Pencil ring and owner-blank redraw on seat change (M4):** needs per-chair SVG; low value next to item 3.
- **Fraunces subsetting / static instances (F3):** production concern.
- **CursorProvider rAF opt-out (micro #8) and `/design-lab` in `IMMERSIVE_PREFIXES` (F4, landmarks):** orchestrator-owned (`components/`, `lib/`).
- **Middle dots in mono meta lines (TA4):** reduced (fields now comma lists; spec lines use " / "), but the `DG-00x ·` id rows keep them.
- **Production `/contact` doesn't read `&seat=`:** harmless today; needs a contact-form change to prefill the topic.

### Checks (v2)
`shoot.mjs` ×3 loops: 0 console errors at 1440/834/390 · `da-d-check.mjs`: overflow 0px, 0 targets under 44px, click + ArrowRight switch panels, echo verified, no-JS shows H1 + 87 server sketch paths, reduced motion leaves 0 undrawn paths · `npx tsc --noEmit` exit 0.
