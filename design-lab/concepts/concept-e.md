# Concept E — "The Ledger" (Startup / Product Studio)

DA-E · 2026-10-02 · route `/design-lab/e` · status: v1 prototype, exploratory copy (production copy still goes
brand-voice-strategist → brand-guardian).

## Thesis

**One sentence:** DIGITAL earns a startup studio's credibility the way good product teams do: it publishes its build
ledger, with honest status, real ownership and the blanks left visibly blank.

**Paragraph:** Executives, recruiters, sponsors and faculty trust a team that reports state precisely, more than one
that sounds big. DIGITAL has 2 active builds, 0 shipped outcomes, 0 confirmed partners and 7 open seats. Concept E
does not hide that: it makes it the brand. The homepage reads like a product studio's internal board made public: a
ledger of builds (ID, stage, status, outcome) as the hero artifact, case studies with a fixed template (§41) whose
empty fields say `[placeholder — not shipped yet]` instead of inventing a number, and an open-roles board instead of a
team photo wall. Rigor is the proof: the ownership model (one owner per subsystem, one review path per handoff, one
test gate before merge, one repair plan before release) is shown as a mechanism, not described as a value.
Restrained type, one accent, no shadows, motion only where it carries state change.

## What it takes from where

| Source | Taken |
|---|---|
| Linear (`references/linear`) | Real artifact with real fields as the hero; type discipline; dark product band |
| IBM Carbon (shortlist) | 4px base, hairlines + surface steps instead of shadows, one accent, small fixed radius |
| Wired (shortlist) | Story rows split by hairlines; black footer band |
| Framework | "Parts not prose": the phone shown as its subsystems |
| Darkroom ("a small sample") / Linear changelog | Honest status as proof |
| Startup careers pages | Open-roles board for the 7 TBA seats |

## 1. Typography (§31)

| Role | Family | Weight | Size (390 → 1440) | Line height | Tracking |
|---|---|---|---|---|---|
| Display (hero thesis) | Cabinet Grotesk (Fontshare CDN, ITF FFL) | 800 | `clamp(44px, 6.4vw, 96px)` | 0.96 | −0.025em |
| H2 (section) | Cabinet Grotesk | 800 | `clamp(32px, 4.2vw, 60px)` | 1.0 | −0.02em |
| H3 (case title, brief title) | Cabinet Grotesk | 700 | `clamp(24px, 2.4vw, 34px)` | 1.08 | −0.01em |
| Body | Satoshi (Fontshare CDN) | 400 / 500 | 17px (16px < 600px) | 1.55 | 0 |
| Lead | Satoshi | 500 | `clamp(18px, 1.5vw, 21px)` | 1.45 | −0.005em |
| Small / table | Satoshi | 500 | 15px | 1.45 | 0 |
| Mono metadata | JetBrains Mono (`next/font/google`, OFL) | 500 | 12px caps, 13px values | 1.4 | +0.06em caps / 0 values |
| Numerals | Cabinet Grotesk 800, tabular via mono where aligned | — | 40–56px | 1 | −0.02em |

Rules: one display voice (Cabinet). Mono is scoped to metadata (IDs, field labels, status, dates). No all-caps body.
Headings `text-wrap: balance`, body `text-wrap: pretty`, body measure ≤ 68ch.

## 2. Color (§31)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#F6F6F2` | page canvas (warm neutral paper, not cream) |
| `--surface` | `#FFFFFF` | elevated: ledger, fact sheets, dialog |
| `--surface-2` | `#ECECE6` | sunken: placeholder plates, table header |
| `--fg` | `#121411` | text, primary rules |
| `--fg-2` | `#3B3E38` | secondary text |
| `--muted` | `#62655D` | metadata (5.4:1 on `--bg`) |
| `--line` | `#DCDBD3` | hairlines |
| `--line-strong` | `#B9B8AE` | dashed open-slot outlines, input borders |
| `--accent` (primary) | `#D8412F` signal red | primary CTA fill, open-slot marker, focus-adjacent markers only. Kept from production so execs/sponsors see one brand; white on it = 4.6:1 |
| `--secondary` | `#121411` ink | secondary buttons (outline), active nav underline |
| `--dark` / `--dark-fg` / `--dark-muted` | `#111311` / `#F1F1EC` / `#A3A69C` | case-study storytelling band + footer |
| State: active | `#1D7A4A` dot + text | "Active" status only |
| State: open | dashed `--line-strong` + accent dot | empty slot (DG-003, partner slot, seats) |
| State: not shipped | `--muted` | outcome rows |
| Focus | 2px `--fg` outline, 2px offset (on dark: `--dark-fg`) | every interactive element |
| Hover | surface step (`--surface` → `#FAFAF7`) + 1px `--fg` rule; links underline | — |

No gradients, no glow, no purple/blue.

## 3. Geometry (§31)

- Spacing scale (4px base): 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
- Section rhythm: 96px desktop / 72px tablet / 56px mobile.
- Page margins: 20px (<600) · 40px (600–1099) · 64px (≥1100). Max content width 1312px.
- Grid: 12 columns, 24px gutter desktop; 6 columns tablet; 4 columns mobile.
- Radius: **4px everywhere** (buttons, plates, chips, dialog). Never mixed, never larger.
- Borders: 1px hairlines; 2px only for active/selected rows and the progress rail.
- Shadows: none. Elevation = surface step + hairline. The dialog uses a 1px ink border and a `rgba(18,20,17,.45)` scrim.

## 4. Motion (§31, §9)

| Token | Value | Use |
|---|---|---|
| `--dur-1` | 120ms | hover, press |
| `--dur-2` | 240ms | disclosure, color/state |
| `--dur-3` | 480ms | layout / shared element |
| `--dur-4` | 720ms | hero entrance |
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | everything entering |
| `--ease-in-out` | `cubic-bezier(0.6, 0, 0.2, 1)` | scrubbed schematic |
| Spring (layoutId) | `{ type: 'spring', stiffness: 420, damping: 40, mass: 0.9 }` (no visible bounce) | ledger row ↔ brief |

- **Entrance:** hero lines and ledger rows rise 10px + fade, 60ms stagger, **CSS keyframes** so first paint never
  depends on JS (with JS off the animation still runs once; with reduced motion it is removed).
- **Hover:** 120ms surface step; arrow icon nudges 2px; ledger row gets a 2px ink left rule.
- **Shared layout (motion.dev):** ledger row → case brief dialog. The row's ID, title, status chip and container share
  `layoutId`s with the dialog. Close morphs back. Focus moves into the dialog and returns to the row.
- **Scroll storytelling (GSAP ScrollTrigger + Lenis):** DG-001 case study. A sticky exploded-phone schematic; 7
  subsystem steps scroll past; scrub separates the 7 layers and a 2px rail fills; the active layer and step switch per
  step. Lenis smooths wheel scroll on desktop and drives `ScrollTrigger.update`.
- **Page transitions:** n/a for a single page; the brief dialog is the "page" transition (row → sheet). Spec for a full
  site: the same layoutId on title + ID from `/` ledger to `/projects/<slug>` header.
- **Reduced motion:** `<MotionConfig reducedMotion="user">` (layout morph → instant), CSS entrance removed, Lenis not
  created, `gsap.matchMedia` builds the scrub only for `(min-width: 960px) and (prefers-reduced-motion: no-preference)`;
  otherwise the schematic renders fully exploded with every step visible. The RSVP demo does not autoplay; it shows the
  full sentence with a Step button.

## 5. Iconography (§31)

Lucide (`lucide-react`, already a dependency), `strokeWidth={1.5}`, 16px inline with text / 20px for controls,
ink or current color only. Used for: arrow-up-right (external / route), arrow-right (CTA), x (close), play/pause/step
(RSVP), plus (expand affordance). No icon-in-circle chips, no decorative icons. Icon-only controls get `aria-label`
and a 44px hit area.

## 6. Layout + sections

| # | Section | Content | Notes |
|---|---|---|---|
| 0 | Nav | DIGITAL wordmark · Ledger · Case studies · Roles · Join · CTA "Take a subsystem" · mono meta "Build night Thu 6 PM" | sticky, hairline bottom; mobile = wordmark + CTA + `<details>` menu (no-JS) |
| 1 | Hero | Thesis (Cabinet 800) + lead "Student-run venture studio at Cal Poly Pomona. 2 builds active. 0 shipped. This page is the ledger." + **the Build Ledger** (the hero artifact) | 5/7 split desktop, stacked mobile |
| 2 | Case studies (§41 template) | DG-001 Modular Smartphone, DG-002 Smart Reading. Same anatomy: header strip → fact sheet (11 fields) → problem → approach → artifact → team → outcome slots → what's next | DG-001's artifact = GSAP scroll sequence on a dark band; DG-002's = RSVP demo over the real POV backdrop |
| 3 | Secondary: Open roles + Partner slots | 7 leadership seats from `team.ts` as an open-roles board; Venture Studies; partner slots per build; 4 real company paths from `involvement.ts` | "careers page" register, honest |
| 4 | Join | 3 numbered steps: build night (Thu 6 PM · Bldg 17 Rm 1635) → Discord → pick a seat (`/contact?type=project-team`) | one primary CTA |
| 5 | Footer | dark band, colophon, contact, Discord, "Ledger as of [placeholder date]" | — |

## 7. Case-study template (§41) — field contract

| Field | DG-001 | DG-002 | Rule |
|---|---|---|---|
| ID / title | DG-001 · The Modular Smartphone | DG-002 · Smart Reading | real |
| One line | `homeLanding.ts` one-liner | `projects.ts` shortDescription | real |
| Problem | throwaway, unrepairable devices | saccades, losing your place | real |
| Approach | 7 subsystems, plan→prototype→test→integrate | RSVP, reader sets WPM, FPGA real-time | real |
| Disciplines | 7 subsystem names | engineering, optics, firmware, design, research | real |
| Technologies | `[confirm — toolchain conflict]` | FPGA · RSVP · Optics · Verilog · Embedded C | only verified |
| Duration | `[placeholder — not set]` | 8-month build cycle | real or placeholder |
| Status | Active · phase `[confirm]` | Active · phase `[confirm]` | never pick a side of a conflict |
| Outcome | `[placeholder — not shipped yet]` + `— / 7 subsystems through test gate` | `[placeholder — not shipped yet]` | denominators only when real |
| Contributors | `BUILT BY ______` unsigned | `BUILT BY ______` unsigned | names only when real |
| Mentor / partner | Partner slot open | Mentor: Dr. Mohamed El Hadedy · Partner slot open | mentor ≠ partner |
| Repo / demo | Not public `[placeholder]` | Not public `[placeholder]` | — |
| Imagery | procedural exploded schematic (SVG) + `[ PROJECT PHOTO ] [placeholder]` plate | real POV backdrop asset (`BookBG_*`, captioned illustrative) + plate | no fake photos |

## 8. Responsive behavior

- **1440:** hero 5/7 split; case fact sheet sticky in a 4-col left rail; DG-001 scrub sequence with sticky schematic.
- **834:** hero stacks (thesis, then ledger full width); fact sheet becomes a 2-col definition grid above the narrative;
  DG-001 sequence is a static list with the schematic shown once (scrub needs ≥960px).
- **390:** single column; ledger rows collapse to ID + title + status (stage moves under title); menu in `<details>`;
  display floor 44px; all targets ≥44px; no horizontal scroll.

## 9. Interaction language

State changes are the only things that move. A row that opens becomes the thing it opened. Status chips never
animate. The single focal motion object per page is the DG-001 schematic. Everything that animates has a static
equivalent that carries the same information.

## 10. Copy (exploratory, voice = product changelog: short declaratives, numbers only when real)

- Hero: "Make something worth putting your name on." / "A student-run venture studio at Cal Poly Pomona. Two builds
  active. None shipped yet. This page is the ledger."
- Ledger header: "Build ledger" · "As of [placeholder date]".
- DG-001: "One phone, owned in seven parts." DG-002: "One word, held still."
- Outcome slot: "Outcome: [placeholder — not shipped yet]. We publish a number when a test log backs it."
- Roles: "Seven seats. All open." / "Names go here when people take them."
- Partners: "Partner slots: open. No company backs a DIGITAL build yet."
- Join: "Put your name on a build." CTA "Take a subsystem".

## 11. Libraries

| Library | Used for | Why |
|---|---|---|
| `motion/react` 13.4.6 | `layoutId` ledger → brief, `AnimatePresence`, `MotionConfig reducedMotion="user"` | the cleanest shared-element API; reduced motion built in |
| `gsap` 3 + ScrollTrigger | DG-001 scrubbed explode + rail + step activation | scrub precision; `gsap.matchMedia` gives a clean reduced-motion/mobile split |
| `lenis` 1.3 | desktop smooth wheel scroll synced to ScrollTrigger | makes the scrub read as continuous; off under reduced motion; stopped while the dialog is open |
| `lucide-react` | 6 utility icons | already a dependency, product-neutral |
| `next/font/google` | JetBrains Mono | OFL, self-hosted |
| Fontshare CDN `<link>` | Cabinet Grotesk, Satoshi | best E pairing from the type lab; FFL forbids self-hosting (needs Head Designer exception vs DESIGN.md §8) |

Not used: recharts (no real data), thinking-orbs (no verified phase to map), R3F (one focal object is enough, SVG is
lighter), dnd kit (a draggable board would be a meaningless dashboard with 4 rows).

## 12. Risks

1. **Honesty can read as emptiness.** Many `[placeholder]` fields could make the studio look thin to sponsors. Mitigation:
   placeholders are styled as deliberate slots (dashed, labelled), and the ownership mechanism carries the weight.
2. **"Ledger" can tip into dashboard.** Kept to 4 rows, no charts, no fake KPIs.
3. **Fontshare CDN** conflicts with DESIGN.md §8 (next/font only).
4. **Production chrome:** the root layout renders the production Navbar/Footer on `/design-lab/*`. This route hides
   them with a scoped style tag; a clean fix is adding `/design-lab` to `IMMERSIVE_PREFIXES` (orchestrator-owned).
5. Phase conflict (C5) leaves both builds at "phase [confirm]", which a recruiter may read as vague.

## 13. Render log (§33)

| Loop | Found | Fixed |
|---|---|---|
| 1 | Hydration error (`<style>` text escaping); schematic labels ~6px on mobile; step numbers misaligned; 46vh steps = dead space; 16:7 photo plate too loud; brand sub-label wrapping on 390 | `dangerouslySetInnerHTML` style; labels 15u + numbered; numbers in flow; 38vh; 16:5 plate; sub-label hidden < 600px |
| 2 | Brief CTA did not scroll (Lenis stopped until the brief unmounts); "Recruit Talent" data copy claims grads "who have shipped" | scroll in `onExitComplete` + `force`; recruit line swapped for the category subtitle |
| Gemini (`critiques/e-v1-self-gemini.md`) | text stretch during morph; abrupt scrim; low-contrast leaders | `layout="position"` on non-shared row text; 320ms scrim fade; active leader solid + full opacity. Rejected: "linear entrance easing" (already `cubic-bezier(0.2,0,0,1)`) |
| 3 | Mobile labels: numbers only (01–07, matching the step list) | — |

Checks (`scripts/da-e-motion.mjs`): 0 console errors; reduced motion → Lenis off, schematic static and exploded; JS off → all
section copy present, ledger rows are links; keyboard → Enter opens brief, focus on Close, Tab trapped, Esc returns focus to the row.
Capture note: headless Chromium tiles full-page PNGs past ~8192px, so `e-*.png` repeat near the bottom. Use
`e-*-stitched.png` (`scripts/da-e-stitch.mjs`, reduced-motion static layout) for the whole page.
