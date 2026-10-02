# Concept F — "The Bench" (Radical Experiment)

Route: `/design-lab/f` · Code: `app/design-lab/f/` · Renders: `design-lab/renders/f/v1/` · Agent DA-F · 2026-10-02
Copy is exploratory. Production copy goes through `brand-voice-strategist` → `brand-guardian`.

## Thesis

**The homepage is a bench you sign, not a brochure you read.**

DIGITAL's thesis is "Make something worth putting your name on." Every other homepage *says* that line. This one makes the
visitor *do* it in the first ten seconds: they write their name, it lands on a red "MY NAME IS" sticker inside the headline,
and they carry that sticker onto an unowned part of a real build (drag, keyboard, a button, or a list). The page then
recomposes around the choice: a build sheet fills in with their name as owner, the join steps tick off step 1, and the footer
prints their name 240px tall under "DRAWN BY". Projects stop being cards to admire and become objects with empty
signature lines. Nothing is sent anywhere; the name lives in the browser.

## The assumption challenged, and why

| Assumption | Challenge | Why it is worth testing |
|---|---|---|
| A homepage is a stack of sections you scroll through and read | The page is a single task (sign → place → read your sheet → show up) and the page changes with your answer | DIGITAL has no proof (0 photos, 0 verified metrics, 0 testimonials). It does have open seats. An empty roster is a weakness on a brochure and the whole point on a bench |
| Projects are cards in a grid | Projects are sheets lying on a cutting mat, each with "Built by ______" slots | §41 wants artifacts. An artifact you can put your name on is the strongest artifact a club with no photos can show |
| Navigation is a top bar | Site routes stay in a thin strip; in-page nav is binder index tabs on the right edge (desktop) / bottom (mobile) | The page is one document with four sheets; tabs tell you where you are in the task |
| Display type is set by the designer | The largest type on the page (hero sticker, footer signature) is the visitor's own name | Literal enactment of the thesis; also the most memorable thing a visitor can screenshot |

## Visual system (§31)

### Typography

| Role | Family | Size (min → max) | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| Display (thesis) | Bricolage Grotesque, `font-stretch: 75%`, `opsz 96` | `clamp(56px, 14.5vw, 216px)` | 800 | 0.86 | −0.005em |
| Footer signature | Bricolage, wdth 75 | `clamp(64px, 15vw, 240px)` | 800 | 0.88 | −0.005em |
| H2 | Bricolage, wdth 75 | `clamp(44px, 6.2vw, 96px)` | 800 | 0.90 | −0.005em |
| Record title | Bricolage, wdth 75 | `clamp(34px, 3.6vw, 52px)` | 800 | 0.95 | 0 |
| H3 / sheet values | Bricolage, wdth 75 | `clamp(22px, 2.4vw, 34–40px)` | 800 | 1.0 | 0 |
| Lead / problem line | Bricolage (opsz auto, wdth 100) | 19–21px | 650 | 1.25–1.45 | 0 |
| Body | Bricolage (opsz auto) | 17px (15px in records, 13–14px seat lines) | 400 | 1.5 | 0 |
| Mono (metadata only) | Departure Mono (self-hosted OFL) | 11px caps, 22px for record codes / ledger | 400 | 1.45 | 0.04em |

Rules: one display voice (Bricolage condensed 800). Departure Mono only at 11px or 22px (its pixel grid is 11px), only for
metadata, codes and the sticker band. Display stays ≥ 40px on mobile (thesis floor 56px). `text-wrap: balance` on headings.

### Color

| Token | Value | Use |
|---|---|---|
| `--paper` (bg) | `#EEEBE1` | page surface |
| `--sheet` (elevated) | `#F7F5EE` | record sheets, tray, tabs, title block |
| `--ink` (fg) | `#15171A` | text, rules, borders |
| `--muted` | `#4F534C` | secondary text (7.0:1 on paper) |
| `--hair` / `--hair-strong` | ink @ 18% / 58% | hairlines / open-seat dashed borders (≥3:1 non-text) |
| `--mat` (secondary surface) | `#173B2F` | the bench: a self-healing cutting mat, 24px minor + 120px major grid |
| `--mat-ink` / `--mat-muted` | `#E9EFE6` / `#AFC4B7` | text on the mat (6.5:1 muted) |
| `--night` | `#15171A` | the Thursday (join) surface: build night is at night |
| **`--tag` (the one accent)** | `#C8361F` | the name tag sticker and the CTA that carries it. White on it = 5.3:1 |
| `--tag-hover` | `#A92B17` | CTA hover |
| `--tag-empty` | `#6E716A` | unwritten name ("your name"), 4.9:1 on white |
| States | focus = 3px solid currentcolour-of-surface, offset 3px; drag-over seat = solid `--tag` border + 14% tag tint; my seat = solid ink border + paper fill; pressed toggle = ink fill |

Why `#C8361F` not production `#d8412f`: same signal red, darkened so white text on the sticker and CTA passes AA. The accent
is reserved for *your name* and the button that sends it. No other chromatic colour is decorative; the green is a material
(the mat), not a brand colour.

### Geometry

| Item | Value |
|---|---|
| Spacing scale | 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 96 (sections `clamp(64px, 8vw, 112px)`) |
| Page margin | `clamp(16px, 4vw, 48px)` + 52px right rail allowance ≥1100px |
| Max width | 1320px |
| Grid | 12 col / 32px gap ≥1100 · 6 col 700–1099 · 1 col <700. Mat texture grid 24px / 120px with a numbered ruler |
| Procedural layout | ≥1100: records placed like paper on a bench: DG-001 cols 1–7 (−0.35°), DG-002 cols 8–12 dropped 72px (+0.45°), VS cols 2–6 (+0.3°), DG-003 cols 7–12 (−0.5°). Rotation off below 1100 |
| Radii | **0 everywhere except the name tag (8px)**. Radius is the identity: the only rounded thing is the thing with your name on it |
| Borders | 1px hairlines, 2px dashed for open seats (cut lines), 2px title-block rules, 3–4px signature/rail rules |
| Shadows | none, except the lifted tag while dragging: hard `0 8px 0 rgba(0,0,0,.28)` (a physical object lifted off the mat) |

### Motion

Principle: **nothing moves unless you move it.** No scroll reveals, no idle animation. Content is final at first paint.

| Token | Value | Use |
|---|---|---|
| `--dur-1` | 120ms | hover fills, seat border, phone-layer highlight |
| `--dur-2` | 180ms | tab offset, CTA arrow nudge, tag drop animation |
| `--dur-3` | 320ms | reserved |
| Easing | `cubic-bezier(.2,.8,.2,1)` | everything CSS |
| Spring | `stiffness 520, damping 26` (motion/react) | the sticker "slap" when placed in a seat (scale 1.25→1, rotate −4°→−1.5°) |
| Pickup | rotate −3°, scale 1.05, hard shadow | DragOverlay |
| Entrance | none | — |
| Hover | ink fill on buttons; seat border darkens; hovering a DG-001 seat inverts the phone layers that subsystem touches (from `phoneV2.ts activePartIds`) | |
| Page transitions | none (single page; anchors jump) | |
| The one focal motion | DG-002 RSVP demo: plays once at 200 wpm when 60% visible (3.3s, under WCAG 2.2.2's 5s), replay on request at the record's 450 wpm | |
| Reduced motion | `MotionConfig reducedMotion="user"` (spring → opacity only), CSS transitions off, RSVP never autoplays (button still works), hero sticker not rotated | |

### Iconography

Pixelarticons (MIT), 12 glyphs inlined as SVG paths in `icons.tsx` (fetched with `npx aria-icons get pixelarticons:<name>`;
no dependency added). 24px only (48px allowed), `shape-rendering: crispEdges`, `currentColor`, always paired with a text
label, never in a chip or circle. Used for: arrows on CTAs/links, drag-and-drop/list on the view toggle, calendar/map on
meeting facts, message for Discord, play/close on the RSVP control, check on step 1.

## Layout and sections

| # | Section (tab) | Content | Data source |
|---|---|---|---|
| — | Strip | DIGITAL wordmark · Work / Studio / Join / Contact (real routes) · "Build night Thursdays · 6:00 PM · Bldg 17 Rm 1635" | `siteLinks`, `involvement.meetingInfo` |
| 01 | **Sign** (hero) | eyebrow "A student-run venture studio at Cal Poly Pomona." · thesis with the sticker in place of "your name" · sign field ("Sign here. Watch where it lands.") · aside + CTA "Take a seat at the bench" | `homeLanding.hero` |
| 02 | **Bench** (projects, §41) | Cutting mat; sticky tray holding the draggable tag + Bench/List toggle; 4 records: DG-001, DG-002, Venture Studies (program), DG-003 (unsigned, dashed, empty) | `projects.ts`, `phoneV2.ts`, `glasses.ts`, `homeLanding.results` |
| 03 | **Sheet** (secondary: how a build runs) | "You take a subsystem. / You own it through the test gate. / Someone reviews every handoff." · engineering title block (Record, Seat, Owner = your name, Review, Test gate, Repair plan) · workflow rail plan → prototype → test → integrate · detail of the chosen seat (description, bullets, scope/risk/mode) | `phoneV2.buildScope`, `toolbox.workflowStages`, `subsystemSections` |
| 04 | **Thursday** (join) | "Bring the tag Thursday." · 4 steps: sign the bench (live status) / tell us the seat → **Take a subsystem** (`/contact/?type=project-team`) / show up Thu 6 PM Bldg 17 Rm 1635 / Discord · "Alumni, mentors, companies: 7 more ways to back a build" | `involvement`, `siteConfig` |
| — | Footer | "DRAWN BY" + the visitor's name at display size · "Put your name on one." · org, email, Discord, legal | `siteConfig`, `siteLinks.legalLinks` |

### Project records as artifacts (§41)

Every record carries: code, kind, title, problem line, one-line description, figure, fields (status, phase, workflow,
toolchain, duration, outcome, repo / method, compute, tech, cycle, mentor, cost), seats with "Built by ______", link to the
full record. Unknowns are printed, not hidden: `[confirm]` (phase conflict, toolchain conflict, repo, prototype state) and
`[placeholder]` (start date, photo plates). Figures are procedural pixel drawings, labelled as illustrations: DG-001 is the
phone pulled apart into 7 layers, and hovering a seat inverts the layers that subsystem touches. DG-002 is the glasses with a
live RSVP word in the right lens.

Seats: DG-001's 7 subsystems (`phoneV2.ts`), DG-002's 5 needed disciplines (`glasses.ts info-join`), 1 Venture Studies seat,
1 DG-003 pitch lead. Whether each is actually open this term is `[confirm]`.

## Navigation

- `<nav aria-label="Site">`: 4 real routes in the strip.
- `<nav aria-label="Page index">`: 4 binder tabs (01 Sign · 02 Bench · 03 Sheet · 04 Thursday), plain anchor links with
  `aria-current` from an IntersectionObserver. Desktop ≥1100: fixed right edge, vertical text, active tab steps out 6px and
  fills ink. Below 1100: a fixed 56px bottom bar (thumb zone), page padded so nothing hides under it.
- The production Navbar/Footer are hidden on this route only (`body:has([data-lab-f])` style in `layout.tsx`).

## Responsive behaviour

| Width | Behaviour |
|---|---|
| 1440 | 12-col bench with rotated sheets; DG-001 seats 2-up; right-edge tabs; meta in strip |
| 834 | 6-col bench: DG-001 and DG-002 full width, VS + DG-003 side by side; bottom tab bar; meta hidden in strip (still in Thursday) |
| 390 | 1 column; thesis 56px; tray = tag + one line + toggle on its own row; open seats show title, line and button only ("Built by" appears once you sign); workflow rail 2×2; footer name 64px |

## Interaction language

1. Your name is the only thing that is red and rounded. If it is red, it is about you.
2. Dashed = unsigned (a cut line). Solid = someone owns it.
3. Every drag has three equivalents: keyboard (Space, arrows jump seat to seat, Space; screen-reader announcements in plain
   language), a per-seat button ("Put Danny here"), and a List view table. During a drag the seat buttons hide, so the drop target is not also a click target.
4. Hovering a seat shows what it touches (phone layers).
5. The page reacts in place: tray status, sheet, step 1, footer, all from one state (`SignProvider`, persisted to
   `localStorage` with try/catch; nothing is sent).

## Copy (exploratory)

Hero: "Make something worth putting [your name] on." / "Sign here. Watch where it lands." / "Two builds, one program, and
one record nobody has pitched yet. Each has parts with no name on them." / CTA "Take a seat at the bench".
Bench: "The bench." / "Every build here is missing names. Products need more than programmers: pick the part you would sign."
Records: "Phones are built to be replaced, not repaired." · "Reading means chasing the line." · "A build needs a budget
before it needs a board." · "Nobody has pitched this one yet. Problem: blank."
Sheet: "The sheet you'd sign." → "Your sheet." Join: "Bring the tag Thursday." Close: "Put your name on one."
Banned-slogan check (§40): 0. BRAND banned words: 0. Facts: only CONTEXT-PACK §1 safe facts; unknowns flagged.

## Progressive enhancement (§43) and accessibility (§42)

- Without JS: every record, field, seat, the sheet (blank) and join steps render; the sign input is disabled with a note;
  seat buttons become "Ask about this seat" links to `/contact/?type=project-team`; the tray explains instead of offering
  a tag. Verified with a JS-disabled render (`f-nojs-mobile.png`).
- `h1` has the plain thesis as screen-reader text; the sticker version is `aria-hidden`. The pixel phone has a descriptive
  label; the glasses are decorative and the RSVP sentence is given in full as SR text.
- 44px minimum targets (52px CTA, 56px tab bar). Visible 3px focus on every surface. AA contrast on all text.
- Weight: no WebGL, no canvas, no GSAP/Lenis. Added JS = `@dnd-kit/core` (~14 KB gz) + `motion` (already used lab-wide).
  Fonts: Bricolage variable (next/font, self-hosted) + Departure Mono woff2.

## Libraries used

| Library | Why |
|---|---|
| `@dnd-kit/core` 6.3.1 | the experiment: draggable tag, droppable seats, `KeyboardSensor` with a custom seat-to-seat coordinate getter, custom announcements and instructions, `DragOverlay` |
| `motion` 13.4.6 (`motion/react`) | the placement spring and `MotionConfig reducedMotion="user"` |
| `next/font` (Bricolage Grotesque, Departure Mono local) | type, self-hosted, OFL |
| Pixelarticons via Aria Icons CLI | 12 inline SVG paths, no package |
| Not used, on purpose | three/R3F, shaders, GSAP, Lenis, page-mascot, thinking-orbs: one focal experiment per page; the experiment is the visitor's own name, so no mascot or shader competes with it. OpenUI: not compatible (runtime LLM) |

## Risks

1. **Gimmick risk.** Typing your name on a club site can read as a toy. Mitigation: it takes one field, the page is fully
   readable without doing it, and the payoff (a sheet that says what you would own) is real information.
2. **Implied commitment.** "Seats" can imply openings that don't exist. Every seat set needs a `[confirm]` from the club each term.
3. **Ownership model scope.** The 4 rules come from DG-001; applying them to every build needs confirmation.
4. **Long mobile page** (~8.8k px at 390): 14 seats. A future version could collapse seats per record behind a count.
5. **Name privacy.** Stored only in `localStorage`; the contact link never carries it. Shared/lab computers would keep it until cleared (a "clear" is one tap: empty the field).
6. **Pixel art tone** could drift toward games (Playdate). Kept to two drawings, ink only.
