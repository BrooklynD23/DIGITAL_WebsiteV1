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
