# DESIGN.md — DIGITAL Brand & Design System

> **Make something worth putting your name on.**

**Status:** Authoritative brand layer. This document governs the DIGITAL identity — what
the organization looks like, sounds like, and behaves like — across the website, print,
social, decks, merchandise, and any future surface. Route-level implementation specs live
in `docs/design/` and are **expressions of this system**, not peers of it. When a route doc
and this document conflict, this document wins; reconcile the route doc deliberately and
note it in the changelog.

**Stack:** Next.js 14 (App Router, static export) + React 18 + TypeScript + Tailwind CSS 3.
All copy lives in `lib/data/`; wording detail is governed by `docs/design/BRAND.md` and the
`digital-marketing` skill.

---

## Contents

0. [Authority, file map & reconciliation](#0-authority-file-map--reconciliation)
1. [What DIGITAL is](#1-what-digital-is)
2. [Brand thesis & beliefs](#2-brand-thesis--beliefs)
3. [The operating model: FIND → PROVE → MAKE → SHIP → SIGN](#3-the-operating-model-find--prove--make--ship--sign)
4. [The identity device: the Sign-Off Block](#4-the-identity-device-the-sign-off-block)
5. [Personality — feel & never-feel](#5-personality--feel--never-feel)
6. [Voice & copywriting](#6-voice--copywriting)
7. [Color system](#7-color-system)
8. [Typography](#8-typography)
9. [Graphic language](#9-graphic-language)
10. [Imagery & art direction](#10-imagery--art-direction)
11. [Motion](#11-motion)
12. [Layout — the sheet model](#12-layout--the-sheet-model)
13. [Components](#13-components)
14. [Project presentation — the Build Record](#14-project-presentation--the-build-record)
15. [Expressing multidisciplinarity](#15-expressing-multidisciplinarity)
16. [Applications beyond the site](#16-applications-beyond-the-site)
17. [The on-brand test](#17-the-on-brand-test)
18. [Anti-patterns](#18-anti-patterns)
19. [Research digest](#19-research-digest)
20. [Token reference](#20-token-reference)
21. [Changelog](#21-changelog)

---

## 0. Authority, file map & reconciliation

### 0.1 The document stack

| Layer | File | Governs |
|-------|------|---------|
| **Brand** (this doc) | `DESIGN.md` | Positioning, thesis, palette, type, devices, motion, applications — the whole visual/verbal identity |
| **Voice** | `docs/design/BRAND.md` | Wording, per-page narrative spines, copy cadence; the `digital-marketing` skill carries workflow + claims registry |
| **Route expressions** | `docs/design/landing.DESIGN.md` — `/` + rebuilt secondary routes (`/about`, `/team`, `/community`, `/contact`, `/get-involved`, legal, error pages) · `docs/design/smartphone.DESIGN.md` — `/projects/modular-smartphone` · `docs/design/glasses.DESIGN.md` — `/projects/smart-reading` | As-implemented specs for those routes. Token-faithful work may proceed there; changes beyond it need Head Designer sign-off |
| **Content** | `lib/data/*` | Every user-facing string, stat, name, and link |

Conflict order for **look**: this doc → route doc → code. Conflict order for **words**:
`lib/data/mission.ts` purpose statement → `BRAND.md` → `lib/data/*` → inline copy.

### 0.2 What this document changes

This is a rewrite, not a restatement. The previous root `DESIGN.md` (the grey "industrial
studio" kit derived from `Refractor/hardware-teardown-site/`) is **retired**; it survives in
git history and had already been narrowed to `/pillars` and `/review` — both slated for
removal. The new system keeps the landing's warm-editorial skeleton (parchment, hairlines,
serif/sans/mono registers, flat surfaces) and rebuilds the accent, identity, and voice
layers around the signature thesis.

### 0.3 Reconciliation register

Open diffs between this document and the shipped routes. Each item is a **directed change**
but still lands through the normal per-doc amendment + Head Designer sign-off flow before
implementation.

| # | Item | Where | Directed change | Status |
|---|------|-------|-----------------|--------|
| R1 | Accent swap | `landing.DESIGN.md` + rebuilt routes | Gold `#C28E0E` retires as brand accent → Signal Red `#D8412F` becomes the single mark color; gold survives only as `--warn` (never text). Forest `#1E4D2B` retires as accent → survives as `--ok` semantic + hover ink. CTAs adopt the signature-underline hover (§13.2) | Pending |
| R2 | Positioning copy | `lib/data/siteConfig.ts`, `homeLanding.ts` | "student-run engineering club" → "student-run venture studio" framing per §1; goes through the brand-voice workflow (new claim/wording, needs sign-off) | Pending |
| R3 | Sign-off block | Footer + project pages | Footer gains the title-block fields (§4); project pages gain the Build Record anatomy (§14) | Pending |
| R4 | Artifact IDs | `lib/data/projects.ts` | Assign `DG-001` Modular Smartphone, `DG-002` Smart Reading; render on project surfaces | Pending |
| R5 | Studio tokens | `globals.css`, `tailwind.config.ts`, unmigrated components | `--studio*`/`--accent` studio kit retires with the last legacy route; single accent = `--signal` | Pending |
| R6 | Type stack | `docs/design/smartphone.DESIGN.md`, `glasses.DESIGN.md` | Immersive routes keep Archivo/Hanken/DM Mono until their next revision; new brand work elsewhere uses the §8 stack only | Pending |

---

## 1. What DIGITAL is

DIGITAL is a **student-run venture studio** at Cal Poly Pomona — a multidisciplinary build
studio where students organize around problems, form mixed teams, and ship real systems
under their own names.

It is **not**:

- an engineering club
- a professional-development organization
- a hackathon group
- a résumé farm
- a software org
- a department showcase

"Club" appears only where campus policy requires the legal category (ASI paperwork, room
bookings). Everywhere else the words are **studio, venture, team, build, project, work**.

The studio draws members from any college where a real problem needs them — Engineering,
Science, Business, and design/communications/agriculture where useful. Teams form around
problems, not departments: a build might pair Biology + Mechanical Engineering + Marketing,
or CS + Finance + EE. The structure to copy is Texas Convergent's build teams and LavaLab's
cross-functional cohorts — but framed as a studio, not an incubator.

### 1.1 The one-line description

> **DIGITAL is a student-run venture studio at Cal Poly Pomona. Mixed-discipline teams find
> real problems, prove them, build working systems, ship them, and sign their names.**

Short forms for constrained contexts (bio, alt text, meta):

- `A student-run venture studio at Cal Poly Pomona.`
- `Students building work worth signing.`

---

## 2. Brand thesis & beliefs

### 2.1 Thesis

> **Make something worth putting your name on.**

This is the operating philosophy, not a headline. It means: graduate with work you are
genuinely willing to publicly own. Not "I attended a workshop," not "I was a member of a
club" — "I helped build that." The thesis drives three design consequences:

1. **Work is attributed.** Every artifact DIGITAL publishes carries names (§4, §14).
2. **Work is documented.** Projects are presented as controlled documents — numbered,
   revised, dated (§14) — not marketing pages.
3. **Work is honest.** Status words tell the truth ("prototyping," "in build phase"), and
   the visual system is built from documentation furniture, not decoration.

### 2.2 Beliefs — canonical set

Four beliefs. These are the brand's permanent creed; they may appear verbatim as section
copy, poster lines, or the about-page spine.

| # | Belief | What it rules out |
|---|--------|-------------------|
| B1 | **Ideas aren't accomplishments. Making them real is.** | Celebrating pitches, brainstorming sessions, "ideation" as an outcome |
| B2 | **The problem picks the team.** | Recruiting by major; department-first org charts; "engineering club" framing |
| B3 | **Reality grades the work.** | Untested claims, demo-only projects, self-awarded superlatives |
| B4 | **Sign your work.** | Anonymous output, unattributed team pages, work no one will own publicly |

B3's full form, when a second line is needed: *"Users, tests, and the world are the final
reviewers."*

### 2.3 Canonical lines registry

Which stock phrases are load-bearing and where they may be used. Do not paraphrase
canonical lines; do not promote contextual lines to canonical status without sign-off.

| Line | Class | Use |
|------|-------|-----|
| **Make something worth putting your name on.** | Canonical thesis | Hero moments, join page, posters, deck close. One per surface max. |
| **Built by ______.** | Canonical device | Credit lines inside sign-off blocks, captions, merch. The blank is filled with real names or left visibly blank as an invitation (§4.4). |
| **Work worth signing.** | Canonical short form | Tagline contexts where the full thesis won't fit (social bio, sticker). |
| **Your transcript says what you studied. Your work says what you can do.** | Recruitment line | Posters, `/get-involved`, pitch decks to students. |
| **Different disciplines. Shared ownership.** | Structural line | Section headings near credit/team content (§15). |
| **Work that survives the semester.** | Durability line | Handoff/continuity stories; pairs with the canonical `VISION_LINE` ("Real systems, built by students, handed to the next cohort." — `lib/data/mission.ts`). |
| **Build it. Test it. Stand behind it.** | Process credo | Internal docs, deck section dividers, workshop walls. |
| "Ship it," "Move fast," "Disrupt," "10x" | **Rejected** | Generic startup language; never appears (§6.6). |

---

## 3. The operating model: FIND → PROVE → MAKE → SHIP → SIGN

**Adopted.** This is DIGITAL's canonical project lifecycle — the spine for project pages,
recruitment storytelling, and internal vocabulary. It is not a marketing slogan; it is the
studio's process made visible.

| Stage | Meaning | Evidence it produces |
|-------|---------|----------------------|
| **FIND** | Find a problem worth solving. | A named problem, a named audience, a reason it matters |
| **PROVE** | Prove the problem, science, market, or need is real. | Research, interviews, experiments, a verified claim |
| **MAKE** | Design and build a credible solution. | Prototypes, schematics, code, revisions |
| **SHIP** | Put the work in front of reality — users, partners, environments, reviewers. | A deployment, a demo day, a user test, a pitch delivered |
| **SIGN** | Document it publicly and attach names. | The sign-off block on the artifact (§4) |

### 3.1 Relationship to the mission beats

The pipeline does **not** replace the canonical mission beats (`WE EXPLORE / WE DESIGN /
WE BUILD / WE COMMUNICATE` in `lib/data/mission.ts`). They operate at different levels:

- **Mission beats** = what members commit to (the org's promise).
- **FIND→…→SIGN** = what a project passes through (the studio's pipeline).

Mapping for designers who need to reconcile them: EXPLORE ≈ FIND+PROVE · DESIGN+BUILD ≈
MAKE · COMMUNICATE ≈ SHIP+SIGN. Never display both systems in the same section; pages use
one spine or the other.

### 3.2 Where the pipeline appears

- **Stage rail** on every project page (§13.6) — five mono labels, completed stages in ink,
  current stage marked with the red pencil.
- **Project IDs** — the pipeline gives artifacts their numbering (§9.4).
- **Posters/decks** — a thin five-tick rule is an approved structural ornament (§16).
- **Copy** — stage names may be used as plain verbs in body copy ("we're proving it now").

Never render the pipeline as a marketing funnel graphic, an arrow-cheveron process
infographic, or a circular diagram. It is a ledger row — five words and a line.

---

## 4. The identity device: the Sign-Off Block

Engineering drawings have carried a **title block** for a century: the framed panel in the
sheet's corner that records who drew the work, who checked it, who approved it, the drawing
number, the revision, and the date (codified in ISO 7200). It exists so a stranger can tell
what a sheet is and who stands behind it — without reading the drawing.

That is DIGITAL's thesis made literal. The **Sign-Off Block** is the brand's signature
graphic element: DIGITAL's title block, adapted so the signature is the point.

### 4.1 Anatomy

A hairline-framed grid of labeled cells. Monochrome by default — the only color permitted
inside is one signal-red mark (a revision tag, a check, or the underline of a signature).

```
┌──────────────┬──────────┬──────┬────────────┬─────────┐
│ TITLE        │ DWG NO   │ REV  │ DATE       │ SHEET   │
│ MODULAR      │ DG-001   │  C   │ 2026-09-14 │ 01 / 03 │
│ SMARTPHONE   │          │      │            │         │
├──────────────┼──────────┴──────┴────────────┴─────────┤
│ BUILT BY              │ CHECKED BY        │ APPROVED  │
│ A. Nguyen — EE        │ M. Torres — ME    │ DIGITAL   │
│ R. Okafor — SW        │                   │ LEADS     │
└───────────────────────┴───────────────────┴───────────┘
```

- **Field labels:** IBM Plex Mono 9–10px, uppercase, tracking `.16em`, `--graphite`.
- **Field values:** IBM Plex Sans 600, 12–14px, `--ink`.
- **Frame:** `1px` `--rule` hairlines; square corners; internal cells divided, never
  spaced — it's a printed block, not a card grid.
- **Signature cells:** `BUILT BY` may hold multiple names, each carrying a discipline code
  (§15). `APPROVED` is reserved for the studio ("DIGITAL" or "DIGITAL LEADS"), never a
  faculty/staff name used decoratively.

### 4.2 Signature variant

For hero moments (top of a project page, the join page, a poster's focal block) the
`BUILT BY` cell may render names in **Newsreader italic** — the handwritten register. One
signature variant per surface. Never add a script/handwriting font; the italic serif *is*
the signature voice.

### 4.3 The footer is a title block

On the website, every page's footer IS the sheet's title block: it carries the org mark,
the page's identifying meta (route as SHEET, build as REV where surfaced), the canonical
taglines, and the legal row — always bottom-anchored, always framed by hairlines. Do not
design footers that are "link farms"; a footer is a signature.

### 4.4 The unsigned block — recruitment device

A sign-off block rendered with `BUILT BY` **visibly empty** is the brand's core recruitment
image: *this space is waiting for a name.* Use it on `/get-involved`, posters, and pitch
decks — once per surface, never as ambient decoration.

### 4.5 Revision tags

`REV A` … `REV Z` (per ISO 7200, skip `I` and `O`). Rendered as a small mono tag, optionally
in signal red, in a bordered cell or inline chip. Governs:

- project page revision logs (`REV B — frame spun`, terse past-tense entries)
- versioned posters and documents
- announcements that are genuine iterations ("RECRUITING — REV B" for a second wave)

Do not invent revision letters for decoration; a REV tag claims a real version exists.

### 4.6 Artifact IDs

Every project gets a studio artifact number: **`DG-###`**, assigned sequentially, recorded
in `lib/data/projects.ts`. `DG-001` = Modular Smartphone, `DG-002` = Smart Reading.
Documents extend it: `DG-001 · SHEET 02`. IDs appear on project pages, posters, part
labels, and merch — always mono, always with the `DG-` prefix, never as a hashtag.

---

## 5. Personality — feel & never-feel

### 5.1 What DIGITAL feels like

A **drawing office that ships.** Specifically, the overlap of:

- an engineering drawing office (title blocks, revisions, controlled documents)
- a research notebook (honest status, dated entries, margin notes)
- an industrial design studio (material restraint, physical artifacts)
- an editorial broadsheet (serif promises, measured columns, ruled structure)
- a venture studio (work aimed at users, markets, and reality — not grades)

The register is **calm, precise, and accountable**. The site should feel authored by people
who measure twice. Quiet confidence: the work argues; the design frames it.

### 5.2 What DIGITAL never feels like

- generic university marketing (campus beauty shots, crests, "excellence")
- hackathon branding (glitch effects, sticker-bomb energy, countdown hype)
- cyberpunk / dev-tool neon (glow, grids-for-vibes, terminal cosplay)
- a YC-clone or AI-startup page (purple gradients, "Backed by", sparkle icons)
- a corporate consultancy (blue stock handshakes, "solutions," three-column icon rows)
- an engineering department site (navigate-by-degree, mission-paragraph walls)
- a résumé club ("boost your career," headcount flexing)
- a false-luxury brand (over-wrought serif everywhere, gold-everything, precious whitespace
  with nothing in it)

### 5.3 Tone sliders

| Axis | Setting |
|------|---------|
| Formal ↔ casual | 65% formal — precise, but plain-spoken; contractions allowed in body |
| Serious ↔ playful | 80% serious — wit appears as dry structural jokes (an unsigned `BUILT BY` cell), never as mascots or memes |
| Dense ↔ sparse | Dense information, sparse decoration |
| Institutional ↔ personal | Personal authorship inside institutional discipline — real names on controlled documents |

---

## 6. Voice & copywriting

Wording is governed in detail by `docs/design/BRAND.md`; this section is the brand-level
contract — the rules that make DIGITAL sound like DIGITAL anywhere, not just on the site.

### 6.1 Core rules

1. **One idea per line.** Declare it plainly; don't hedge or stack dependent clauses.
2. **Verbs over adjectives.** If an adjective carries the sentence, rewrite around a verb.
3. **Concrete nouns.** PCB, module, Building 17, Thursday 6PM. Specifics are the brand.
4. **Honest status.** "Prototyping," "in build phase," "student-built," "open-source." Say
   where the work actually is; never imply shipped products that are still prototypes.
5. **Proof next to every claim.** A stat, spec, named project, or named partner — or don't
   make the claim. All stats come from the claims registry
   (`.cursor/skills/digital-marketing/claims.md`).
6. **Second person sparingly; CTAs always imperative.**

### 6.2 Headlines

- **Register by family:** serif headlines make *promises* (opening and closing moments);
  sans headlines make *proof statements* (section headings in between). See §8.3.
- **Length:** ≤7 words where layout allows; one idea.
- **Case:** sentence case. Uppercase is reserved for the mono annotation layer — display
  type never gets it (the 2026-08 de-caps rule stands brand-wide).
- **Shape:** state the thing, not the aspiration. `Coursework describes systems. We build
  them.` — not `Empowering tomorrow's innovators.`
- **Punctuation:** periods are allowed and encouraged on declaratives; the full stop reads
  as a decision. Question-mark headlines only when the page genuinely answers the question.

### 6.3 Body copy

- 1–4 sentences per block; 12–13px web body is canonical (§8.4) with line-height 1.7+.
- Mechanism before abstraction: say *how* before *how great*.
- Write for the reveal: lines that animate word-by-word front-load meaning, one clause per
  line, ≤9 words at display sizes (BRAND.md cadence rules apply everywhere).

### 6.4 Buttons & CTAs

- **Formula:** `[VERB] [OBJECT]`, 2–4 words, concrete destination, no hype, no
  exclamation. `Get involved` · `See the build record` · `Come Thursday 6PM` · `Read the
  spec`.
- One primary CTA per view; everything else ghost.
- Banned CTA words: *Learn more, Discover, Explore, Unlock, Start your journey, Join us
  today, Submit.*

### 6.5 Naming & brand language

- The name is **DIGITAL** — all caps, always. Full form: **DIGITAL @ Cal Poly Pomona**
  (read "Digital at Cal Poly Pomona"). Never "Digital," "Digital Club," "the DIGITAL club,"
  or "DigitalCPP" in prose (social handles excepted).
- Members are **builders** or by discipline (designers, engineers, researchers). Not
  "members" in outward copy where a role word exists; never "Digitalites."
- Projects are **builds** or named artifacts (`DG-001`, "the smartphone"), never "initiatives."
- The studio **ships** and **signs**; it does not "launch solutions" or "deliver value."

### 6.6 Banned language

Superlatives and filler — revolutionary, game-changing, seamless, cutting-edge,
world-class, innovative, comprehensive, robust, leverage (verb), empower, elevate, unlock,
passionate, journey, ecosystem (as self-description), community (as a claim instead of a
route), "industry-leading," "best-in-class," "next-generation." Also banned: scale claims
without proof ("Backed by Industry Leaders" → the honest form is "Campus partners" /
"Supported by"), and any framing where members are an audience rather than authors.

---

## 7. Color system

The palette is drawn from **the drafting table, not the screen**: vellum paper, ink,
graphite, hairline rules — plus the two working inks of a drawing office: **red pencil**
(markup, signatures, revisions) and **blueprint blue** (the drawing itself, i.e. the
functional/interactive layer).

**Prime directive:** color is annotation. Ink carries information; the red pencil marks
what matters; blue marks what's interactive. Nothing else earns chroma on a shared surface.

### 7.1 Core palette

| Token | Hex | RGB | Role |
|-------|-----|-----|------|
| `--paper` | `#F7F6F2` | 247 246 242 | Page background — drafting vellum |
| `--paper-raised` | `#FCFBF8` | 252 251 248 | Cards, spec sheets, fields — one step lighter |
| `--plate-a` / `--plate-b` | `#E7E4DC` / `#EFEDE6` | — | Diagonal-stripe placeholder plates only |
| `--ink` | `#111311` | 17 19 17 | Text, borders (via alpha), dark fills, the mark |
| `--graphite` | `#5A615B` | 90 97 91 | Secondary text, field labels, captions |
| `--void` | `#0A0C0A` | 10 12 10 | Full-bleed dark bands (the "verso" of the sheet) |
| `--void-raised` | `#111511` | 17 21 17 | Hover surface inside dark bands |
| `--cream` | `#F2F0E8` | 242 240 232 | Text/borders (via alpha) on void bands |
| `--cream-dim` | `#8B948C` | 139 148 140 | Secondary text on void bands |

**Hairlines** are always alpha-of-ink or alpha-of-cream, never grays pulled from elsewhere:

- Light sections: `rgba(17,19,17, α)` — `.10` decorative frames · `.12` dividers/card
  internals · `.15` card borders at rest · `.20–.25` structural rules · `.30` connectors ·
  `.35–.40` hover borders · `.45–.50` micro glyphs.
- Dark sections: `rgba(242,240,232, α)` — `.12` band borders · `.16` tracks · `.18`
  divider lines · `.30` ghost/chip borders · `.35` divider stars.

### 7.2 Brand accent — Signal Red

| Token | Hex | Role |
|-------|-----|------|
| `--signal` | `#D8412F` | **The red pencil.** Signature underlines, revision tags, active marks, margin notes, the single mark a reader should notice |

Rules — these are the whole accent policy:

1. **One mark per viewport.** Red appears at most once per screen region — a signature
   underline OR a margin note OR a stage marker — never all three. Treat it like the
   highlighter you get to use once (the Linear rule).
2. **Marks, not fills.** Red inks lines, small text at ≥large sizes, tags, and strokes. It
   never fills a large area and never sits behind text: `--paper` on red is 4.12:1 and
   `--void` on red is 4.41:1 — both fail small text.
3. **Meaning, not decoration.** Every red element must *mean* something — a signature, a
   revision, the current stage, the active nav item. If removing it loses no information,
   it shouldn't be red.
4. Contrast on `--paper` ≈ **4.1:1** → bold/uppercase/≥18px or non-text UI only; never body.

### 7.3 Functional color — Blueprint

| Token | Hex | Role |
|-------|-----|------|
| `--blueprint` | `#1C6CFF` | Focus rings (2px), interactive affordances in technical contexts (schematic highlights, link states where ink alone is ambiguous), informational chips |

Blueprint is **functional, not brand.** It may appear more than once per viewport only
because it means "interactive/focus," never as emphasis. On `--paper` ≈ 4.2:1 — UI and
large text only. Body-copy links stay `--ink` with a hairline underline; hover adds the
signal-red underline (§13.2).

### 7.4 Semantic colors

| Token | Hex | Role |
|-------|-----|------|
| `--ok` | `#1E4D2B` | Passed checks, verified revisions, "checked" marks in sign-off blocks, success states. On `--paper` ≈ 9:1 — text-safe. |
| `--warn` | `#C28E0E` | Caution/pending states. On `--paper` ≈ 2.7:1 → **chip, border, or icon only — never text.** Always paired with `--ink` text. |
| `--err` | `#9C3A2A` | Errors. Desaturated brick (approved 2026-08). On `--paper` ≈ 6.3:1 — text-safe. Never the only signal — pair with icon/text. |
| `--info` | `#1C6CFF` | Informational — shares blueprint. |

Semantics never appear as decoration, and decorative elements never borrow semantic colors.

### 7.5 Project colors

A project may carry **one** identifying "material" color on its own surfaces only —
declared in its data file, documented in its route spec. Rules:

- Project color never appears on shared components (nav, footer, generic cards, `/projects`
  listing beyond the project's own plate).
- The smartphone's seven subsystem accents (`docs/design/smartphone.DESIGN.md`) are a
  sanctioned *route-local informational scale* — the precedent, not a loophole. New accent
  scales need Head Designer sign-off and must stay route-scoped.
- When in doubt: no project color. The artifact's name, ID, and sign-off block are the
  identity; the color is optional.

### 7.6 Prohibited

- Gradients (any), except the flat `-45°` stripe on placeholder plates.
- Shadows-as-color (glows, colored drop shadows).
- Gold, forest green, or any legacy accent used as decoration (their semantic roles above
  are their only jobs).
- Purple/violet anywhere — it is the AI-startup tell.
- More than one chromatic accent per viewport (excluding blueprint's functional role).

---

## 8. Typography

Three families, three registers. The hierarchy is the brand's argument structure set in
type: **a promise is made (serif), proven (sans), and recorded (mono).**

| Register | Family | Carries |
|----------|--------|---------|
| **Promise** | **Newsreader** (400/500/600, + italic for signatures) | The page's opening claim and closing invitation; large stat numerals; signature-variant names |
| **Proof** | **IBM Plex Sans** (400/500/600) | Section headings (600), body copy, card titles (600), sign-off values |
| **Record** | **IBM Plex Mono** (400/500) | Eyebrows, labels, nav, buttons, specs, IDs, stage rail, sign-off field labels, captions, footer |

Substitutes (print/Office contexts where the families aren't installed): Newsreader →
Source Serif 4 → Georgia; IBM Plex Sans → IBM Plex Sans (it's free — install it) →
Helvetica/Arial; IBM Plex Mono → IBM Plex Mono → Consolas. Never substitute with a display
slab, a geometric sans for body, or a handwriting font for signatures.

### 8.1 Loading (web)

Via `next/font` in `lib/fonts.ts` — never raw `<link>`. The studio stack
(Archivo/Hanken Grotesk/DM Mono) is retired at brand level (R6); immersive routes keep
their stacks until reconciled and must not export them to shared components.

### 8.2 Case & tracking rules

- Display type (serif + sans headings): **sentence case**, tracking `−0.01em` (serif) to
  normal (sans). No uppercase, ever — the 2026-08 de-caps revision is now brand law.
- Mono layer: **uppercase with wide tracking** (`.10em`–`.42em`) — the annotation texture.
  This contrast (calm sentence-case display over tracked mono micro-type) is the system's
  signature rhythm.
- Signature variant: Newsreader *italic*, sentence case — the only italic in the system.

### 8.3 Register discipline

The scale has a **hollowed-out middle**: no 18–22px subhead tier exists. A surface reads
as promise → proof → annotation. Do not introduce intermediate sizes "for hierarchy" —
add a mono label or a hairline instead.

| Moment | Register | Rule |
|--------|----------|------|
| Hero / closing invitation | Serif promise | `clamp(34px,5vw,58px)` — used at most twice per page (open + close) |
| Section headings between | Sans proof | `clamp(26px,3.4vw,42px)`, 600 |
| Everything informational | Mono record | 8.5–13px, tracked, uppercase |

### 8.4 Type scale (canonical web rows)

| Role | Spec |
|------|------|
| Promise headline (serif 500) | `clamp(34px,5vw,58px)`, lh 1.14, −0.01em |
| Proof heading (sans 600) | `clamp(26px,3.4vw,42px)`, lh 1.2 |
| Stat numeral (serif 500) | 24px |
| Card title (sans 600) | 14px, .02em |
| Body (sans 400) | 12–13px, lh 1.7–1.75 — raise to ≥16px where a form field or iOS-zoom context requires |
| Sign-off value (sans 600) | 12–14px |
| Signature name (serif italic 500) | same size as sign-off value, italic |
| Wordmark (mono 500) | 13px, .12em |
| Subline / nav / CTA (mono 400) | 10–11px, .06–.12em |
| Eyebrow (mono 400, upper) | 10px, .24em |
| Field labels / micro (mono 400, upper) | 8.5–10px, .14–.30em |

Measure: 60–75ch desktop, 35–60ch mobile; ledes may constrain to ~34–46ch.

---

## 9. Graphic language

Structure is **drawn, not shaded.** The system has no shadows and no gradients; hierarchy
comes from hairlines, surface steps of a few points of lightness, typographic registers,
and full-bleed inversions to `--void`.

### 9.1 The mark

The DIGITAL mark is the **Exploded Mark**: three black geometric shards (a diamond and two
parallelograms) held in loose formation — a module mid-explosion, or three parts coming
together to be assembled. Both readings are the brand.

Rules:

- Monochrome only: `--ink` on light, `--cream` on void. Never colored, never gradient,
  never outlined, never in signal red.
- Clear space = the height of the diamond shard on all sides.
- The mark may render alone (favicon, avatar, stamp) or in the full lockup (mark +
  `DIGITAL` tracked wordmark + `Cal Poly Pomona` subline).
- Do not redraw, rotate, animate, or add shards.

### 9.2 Registration & drafting marks

Approved typographic ornaments — the only decoration the system permits:

| Mark | Name | Use |
|------|------|-----|
| `✳` | Registration star | Section dividers — four stars alternating with three flex-1 hairlines (the canonical `Divider`) |
| `+` | Crosshair | Registration marks in plates/frames; the progressive-enhancement cursor |
| `[ … ]` | Bracketed caption | Image-plate captions: `[ PROJECT PHOTO — PROTOTYPE BENCH SHOT ]` |
| `—` | Annotation dash | Margin notes, learnings lines |
| `DG-###` / `REV x` / `SHEET n` | Document furniture | IDs, revisions, sheet numbers (§4) |
| `│ ─ ┌ ┐ └ ┘` | Box rules | ASCII construction of sign-off blocks in plaintext contexts |
| `⌗ ⊞ ⇄ ◨ ◎` | Glyph chips | Per-card typographic marks inside bordered chips (mono glyphs, not icons) |

### 9.3 Discipline tags

Two-letter mono codes mark a contributor's discipline on credits, rosters, and team
graphics — the title-block "discipline designator" adapted for a multidisciplinary studio.
The sanctioned set (extend only by amending this doc):

| Code | Discipline |
|------|------------|
| `ME` | Mechanical & manufacturing |
| `EE` | Electrical & embedded |
| `SW` | Software & firmware |
| `DS` | Data & science / research |
| `ID` | Industrial design & UX |
| `VN` | Venture — business, finance, go-to-market |
| `CM` | Communications & media |
| `OP` | Operations & program |

Format: `NAME — CODE` (e.g. `A. NGUYEN — EE`). Tag chips are mono 9–10px uppercase in an
ink-hairline bordered cell; never colored by discipline (disciplines are equal — the
problem picks the team, the palette doesn't rank them).

### 9.4 Dimension & measurement devices

- **Dimension lines:** thin rule + end ticks + centered mono measurement — an approved
  ornament on posters and schematic-adjacent graphics. The measurement must be real (a
  width, a count, a date) — never a fake number for texture.
- **Zone ticks:** drawing sheets mark their edges A–D / 1–4. Permitted on posters and
  immersive page margins: tiny mono letters/numbers at the sheet edge, `--graphite`,
  `aria-hidden` on web.
- **Exploded views:** the product-teardown motif (signature on `/` teardown heritage and
  the smartphone schematic) is the brand's hero imagery register — things shown in layers,
  assembled or mid-separation, labeled with leader lines and mono callouts.

### 9.5 Icons

SVG only — Lucide or Heroicons, stroke 1.5–2px, one set per surface. No emoji, no icon
fonts, no raster icons, no `material-symbols-outlined`. Where a semantic mark exists (✓
passed, `+` registration, `*` note), prefer the typographic glyph to an icon.

---

## 10. Imagery & art direction

### 10.1 Photography

**Documentary bench photography.** The current hero (`public/assets/landing/
Landing-Page-Hero.png`) is the template: a real drafting table — technical drawings, an
exploded smartphone sketch, compass, scale rule, pencil — in warm, directional light.

Rules:

- **Real work, real hands.** Bench shots, prototypes mid-assembly, annotated prints,
  solder, calipers, screenshots taped to paper. Nothing staged to look like a stock
  "team meeting in a glass office."
- **Grade:** warm-neutral; paper reads `--paper`-adjacent; blacks stay `--ink`, not blue.
  Mild desaturation; no HDR pop, no bokeh portraits of laptops.
- **Honesty requirement:** a photo claims the thing exists. Never photograph mockups as if
  finished products; a prototype photo is captioned as a prototype.
- People appear *working*, not posing. Faces are optional; hands and artifacts are the
  subject. Team identity is carried by credits (§15), not headshot grids.

### 10.2 Technical graphics

- **Line-art:** exploded views, schematics, orthographic sketches — hairline strokes
  (ink at `.25–.50` alpha), mono labels, leader lines, `+` registration marks. Line weight
  stays thin; the drawing explains, it doesn't shout.
- **Placeholder plates:** the sanctioned stand-in for missing photography — `-45°`
  diagonal stripes (`--plate-a`/`--plate-b`, 14px bands) inside an ink-hairline frame with
  a bracketed mono caption naming what will live there. A drafted slot is honest; a stock
  photo is a lie. When real photography arrives it replaces only the stripe fill — frame,
  radius, and caption conventions stay.

### 10.3 Never

- Stock imagery of any kind (handshakes, lab-coat diversity shots, "innovation" lightbulbs)
- 3D chrome/glassmorphic renders as decoration
- Photos of campus landmarks, classrooms, or crests
- Screenshots without a device frame or plate treatment
- Any image whose only job is to look expensive

---

## 11. Motion

Motion is **mechanical and meaningful** — the system animates the way the studio works:
things draw, rise, separate along axes, and get marked. One gesture at a time.

### 11.1 Grammar

| Move | Spec | Meaning |
|------|------|---------|
| Rise-in | `translateY(18px)` + opacity → 0, `0.8s cubic-bezier(0.22,1,0.36,1)` | Content enters the sheet |
| Signature underline | `scaleX(0→1)`, origin left, `180ms`, `cubic-bezier(.22,.61,.36,1)` | The pencil marks the CTA (§13.2) |
| Line draw | `stroke-dashoffset` or `scaleX/Y` on hairlines, ≤600ms | Rules draw themselves on load/reveal |
| Scrub | scroll-driven `lerp` (`progress += (target-progress) * 0.16–0.25`) | Teardowns/exploded views — cause→effect |
| Loader exit | `translateY(-100%)`, `850ms cubic-bezier(0.76,0,0.24,1)` | The sheet lifts |

### 11.2 Rules

- Animate `transform` / `opacity` / `stroke-dashoffset` only — never `width`, `height`,
  `top`, `left`, or layout properties.
- Micro-interactions 150–250ms; state changes 250–300ms; reveals 800ms. Exits faster than
  entrances. No springs on UI; no bounce easing; no parallax for its own sake.
- Every animation must express cause→effect (the teardown IS the content). Decorative
  motion is an anti-pattern.
- Hover is a mark, not a lift: the system prefers color/underline changes over
  `translateY(-2px)` lifts (route docs that still lift should migrate at their next touch).
- `prefers-reduced-motion`: all of the above collapses — content never withheld, loaders
  shorten to ≤250ms, scrubs become static final frames. Non-negotiable (§13.10).

---

## 12. Layout — the sheet model

**Every surface is a drawing sheet.** A page is not a scroll of cards; it is a controlled
document with margins, ruled separations, a register of contents, and a title block at the
bottom.

### 12.1 Sheet anatomy (web page)

1. **Instrument bar** — the thin sticky nav: hairline-bottom, `--paper` veil at 92% +
  10px backdrop blur, mono links, the mark + wordmark left, one CTA right.
2. **Register** — hero/header zone stating the sheet's promise (serif) with mono meta
  (eyebrow, subline, date/version where real).
3. **Ruled bands** — content sections separated by `✳` star dividers (light→light) or
  hard seams (light→void). Vertical rhythm escalates toward the close:
  `clamp(48px,8vh,90px)` → `clamp(80px,13vh,140px)`.
4. **Verso bands** — full-bleed `--void` sections for the argument's dark moments (thesis,
  join, footer). Cream text, cream-alpha hairlines. Dark is a structural event, not a theme.
5. **Title block** — the footer (§4.3). Every sheet ends signed or visibly unsigned.

### 12.2 Grid & spacing

- Universal gutter: **18px** page padding (mobile ≥16px).
- No global max-width container on landing-family pages — bands run edge-to-edge; text
  blocks self-constrain (420–760px). Utility pages may use `max-w-content` (1180px).
- Split grids: `repeat(auto-fit,minmax(min(100%,380px),1fr))` with hairline cells — the
  ledger split used by thesis/mission bands.
- Rhythm: 4/8px base scale; section padding is viewport-relative (`vh` clamps), not fixed.
- Nothing floats: elements register to hairlines and baselines. A component that "needs" a
  shadow gets a border or a surface step instead.

### 12.3 Responsive

Breakpoints: **375 / 768 / 1024 / 1440**, mobile-first, intrinsic layout preferred
(`clamp()`, `min()`, `auto-fit minmax`, flex-wrap) over breakpoint switches. The `nav:`
820px breakpoint is sanctioned for the instrument bar's compact mode. No horizontal
scroll, ever.

---

## 13. Components

Target specs for shared components. Route docs contain the as-implemented detail; where
they differ, reconcile toward these (see §0.3).

### 13.1 Instrument bar (nav)

Thin mono bar, not a floating pill: `sticky top-0`, 3-column grid `1fr auto 1fr`, 18px/10px
padding, `--paper` veil + `backdrop-blur-[10px]`, bottom hairline `.12` ink. Left: Exploded
Mark + `DIGITAL` mono 13px/.12em. Center: ≤6 route links, mono 10.5px/.1em `--graphite`,
hover `--ink`; **active route carries the signal-red underline** (the only red in the bar).
Right: one ghost CTA. Mobile (`<sm`): center links collapse into a fourth-row hairline-topped
link row — never a hamburger that hides the whole register.

### 13.2 Buttons — the signature move

All buttons are mono-labeled blocks: `rounded-[2px]`, mono 10–10.5px, tracking `.12em`,
padding ~`11px 24px`.

| Variant | Rest | Hover |
|---------|------|-------|
| Primary (light band) | `--ink` fill, `--paper` text | **Signal-red underline draws under the label** (2px bar, scaleX 0→1, 180ms) — the signature gesture |
| Primary (void band) | `--cream` fill, `--void` text | Same red underline draw |
| Ghost (light) | transparent, `.35` ink border, ink text | Border + label → `--signal` |
| Ghost (void) | transparent, `.30` cream border, cream text | Border + label → `--signal` |

- The underline draw is THE hover signature — it belongs on primary CTAs, nav items,
  and prominent links. Don't dilute it by drawing under every hoverable element; one or
  two underline-eligible elements per viewport.
- No lift, no shadow, no scale, no glow. Focus: 2px `--blueprint` ring + offset.
- One primary per view (§6.4); disabled = 50% opacity, no hover.

### 13.3 Cards

Flat, ruled, registered:

- **Spec card / way card:** `--paper-raised`, `.15` ink border (hover `.40`), square or
  `≤8px` radius, generous padding (`34px 26px`), glyph chip + sans-600 title + 12px/1.75
  body in `--graphite`.
- **Build-record card:** the ledger format (§14) — hairline-rowed data card beside a
  striped plate; whole card is a link.
- No glassmorphism, no glow, no image-collage cards. Dark featured tiles may carry an
  ink-gradient scrim over a real render — the only sanctioned gradient use, and it must be
  functional (legibility), not decorative.

### 13.4 The Sign-Off Block

Per §4. Implement as a `dl`-structured or grid component with hairline cell divisions;
`aria-label` the block ("Document control: built by …"). Field labels mono, values sans.
Signature variant swaps name values to Newsreader italic. The empty `BUILT BY` cell state
is a first-class variant, not a broken state.

### 13.5 Spec table

Mono key-value rows separated by `.12` hairlines: key uppercase 9–10px tracked
`--graphite`, value 12–13px ink sans or mono depending on content (units → mono tabular).
Spec tables are **proof furniture** — they support a prose claim, never open a section.

### 13.6 Stage rail

Five mono labels — `FIND PROVE MAKE SHIP SIGN` — on a 1px track. Completed stages: ink
text + ink tick. Current stage: `--signal` label + the tick filled red (the pencil's mark).
Future: `--graphite` at 60%. Compact variant: `DG-001 · MAKE` as a single mono line.
Appears on every project page header and project card.

### 13.7 Eyebrow & margin note

- Eyebrow: mono 10px, `.24em`, uppercase, `--graphite` (light) / `--cream-dim` (dark).
  The old accent-red eyebrow is retired — red is for marks, and an eyebrow is furniture.
- Margin note: sans-600 or serif-accent annotation at `clamp(26px,3.4vw,46px)` in
  `--signal`, prefixed `◂` — the one place red sets display-size type. One per viewport.

### 13.8 Forms

- Field: `--paper-raised`, `.15→.35` ink border, `rounded-[2px]`, 14px/16px padding,
  ≥16px text, ≥44px height.
- Label: mono 11px uppercase above the field, always visible (never placeholder-only).
- Focus: 2px `--blueprint` ring. Error: `--err` text + icon, `role="alert"`, on blur not
  keystroke. Success: `--ok` + `✓`.
- Submit button is a primary CTA (red underline hover), never a red fill.

### 13.9 Badge / chip / tags

Mono 9–11px uppercase in a `.30`-ink bordered cell, square-ish (`rounded-[2–4px]`).
Variants: default (ink), stage tag (current stage may mark red), discipline tag (§9.3),
REV tag. No filled-color badges except semantic chips (`--ok`/`--warn`/`--err` borders +
icons + ink text).

### 13.10 Accessibility floor (non-negotiable)

- Contrast: ≥4.5:1 body, ≥3:1 large/UI. Verified pairs: `--ink` on `--paper` ≈ 17:1;
  `--graphite` on `--paper` ≈ 5.9:1; `--cream` on `--void` ≈ 17:1; `--err` on `--paper` ≈
  6.3:1; `--signal`/`--blueprint` on paper ≈ 4.1–4.2 → large/UI only; `--warn` never as
  text.
- Color never the only signal — red marks, semantic states, and stage markers always pair
  with text, icon, or position.
- 2px `--blueprint` focus ring on every interactive element; full keyboard support;
  logical heading order (one `h1`); ≥44px targets; alt text on meaningful images,
  `aria-hidden` on drafting ornaments; `prefers-reduced-motion` collapses all motion.

---

## 14. Project presentation — the Build Record

A DIGITAL project is presented as a **controlled document**, not a product landing page.
The reader should be able to tell what it is, where it stands, who built it, and how to
verify that — the same job a title block does for a drawing.

### 14.1 Anatomy of a project page

| Order | Element | Content |
|-------|---------|---------|
| 1 | Sheet header | `DG-###` ID + stage rail (§13.6) + promise headline (serif) + one-paragraph abstract in proof register |
| 2 | Artifact | Hero plate — exploded view, bench photo, or schematic. Real artifact or honest placeholder; caption in `[ BRACKETS ]` |
| 3 | The problem | Why it exists — the FIND/PROVE evidence, terse |
| 4 | The work | What was made — subsystems/specs as spec tables and labeled diagrams (the MAKE evidence) |
| 5 | The record | Revision log: `REV` entries in mono, terse past tense, dated; test results; honest status |
| 6 | Sign-off block | The title block: who built it (names + discipline codes), who checked, approval, date, SHEET number |
| 7 | Invitation | What the reader does next — join the team, see the next artifact |

Immersive experiences (`/projects/modular-smartphone`, `/projects/smart-reading`) may
re-order this anatomy for narrative effect, but every element must exist — an immersive
page without credits or a stage marker fails §17.

### 14.2 Rules for student work

- **Names are mandatory.** Work without credits is unfinished. The minimum credit is the
  team ("Smartphone Team — EE/ME/SW") plus a lead name when verified.
- **Status is honest.** "Prototyping," "REV B," "phase 3 of 4" — the record shows where
  the work actually is (per the claims registry).
- **Process is the content.** Revision logs, test notes, and spec tables are features, not
  appendices. A failed revision noted in the log is more on-brand than a polished lie.
- **Handoff is shown.** Work that survives the semester names its next steward when it has
  one — continuity is part of the record (pairs with `VISION_LINE`).

---

## 15. Expressing multidisciplinarity

The brand shows mixed teams **structurally**, never as a stock-photo claim.

- **Discipline tags in credits.** The sign-off block and rosters list `NAME — CODE`
  (§9.3). One block holding `EE`, `ME`, `VN`, and `ID` signatures *is* the message —
  different disciplines, shared ownership, made literal.
- **Problems organize teams.** Copy describes what a team is building and what disciplines
  the problem required — never "our diverse community." When a project needs a discipline
  it lacks, the block can say so: an empty `DS` cell is a recruitment post.
- **The pipeline is discipline-agnostic.** FIND/PROVE stages legitimize research, market
  validation, and fieldwork as real studio work — a biologist's lit review and an EE's
  board spin are both evidence on the same rail.
- **Org visuals** use the ledger: team pages are registers of contributions (name →
  discipline → artifact), not grids of headshots with majors underneath.
- **Say the mix, don't perform it.** "Biology + Mechanical Engineering + Marketing" in a
  project brief beats any stock photo of smiling diversity.

---

## 16. Applications beyond the site

The system is surface-agnostic: if it has a sheet, it can be a DIGITAL artifact.

### 16.1 Posters & flyers

- Sheet: `--paper` field, 18px-equivalent margins, optional zone ticks at edges.
- Header: Exploded Mark + `DIGITAL` mono wordmark, top-left. Meta block top-right (mono):
  event name, date, `BLDG 17 · RM 1635`, `SHEET`/`DG` number if artifact-related.
- One serif promise at display scale; one red-pencil mark (annotation, underline, or REV
  tag — one). Body in sans; details in mono.
- Bottom-right: the **sign-off block** — or the unsigned variant when recruiting.
- QR codes sit inside a hairline cell with a mono caption (`SCAN — /GET-INVOLVED`), never
  floating unframed.

### 16.2 Social & digital

- Avatar: Exploded Mark only, ink on paper.
- Post templates: paper card + one message + mono meta row; announcement format uses
  honest REV framing (`RECRUITING — REV B` when a round re-opens).
- Decks: paper slides, mono footer meta (project ID · sheet no · date), serif section
  promises; the title slide carries a sign-off block.

### 16.3 Merchandise & physical

- The signature is the merch: **name tapes** (`BUILT BY ____` with a blank to fill),
  field notebooks (paper cover, grid + title block printed inside), REV tags as stickers,
  discipline-code pins.
- One color per item: ink on paper, or paper on void. Red appears as the pencil mark only.
- Tool aesthetics over swag aesthetics — a DIGITAL object should look issued, not branded.

### 16.4 Documents

Internal docs, briefs, and proposals use the same furniture: title block on the cover,
mono headers, numbered sheets, REV history. A sponsor brief that looks controlled is worth
more than one that looks slick.

---

## 17. The on-brand test

Two litmus tests, then the checklist. Any artifact that fails a litmus test is off-brand
regardless of how many checklist items it passes.

**The Signature Test** — *Could a member sign this?* If the work couldn't carry a `BUILT
BY` line (or proudly does), it's brand-aligned. If attribution would be embarrassing —
stock photos, borrowed claims, anonymous output — it fails.

**The Drawing Test** — *Does it look documented rather than decorated?* Hairlines, mono
labels, real measurements, honest status, and a title block pass. Gradients, glows, stock
imagery, and vibe-graphics fail.

### Checklist

1. ≤1 signal-red element per viewport, and it means something.
2. Type registers intact: serif promises / sans proofs / mono records; sentence-case
   display; tracked uppercase only in the mono layer.
3. One idea per section; promise → proof → invitation order.
4. Concrete nouns; zero banned words (§6.6); honest status.
5. Real artifacts or honest striped plates — never stock.
6. A hairline was chosen before any shadow; no gradients outside plates/scrims.
7. Motion is a single gesture; reduced-motion loses nothing.
8. Teams shown as name + discipline code in a ledger — not headshots + majors.
9. The sheet has its furniture: meta row, ruled bands, title block at the foot.
10. Every claim has a proof adjacent (or came out).

---

## 18. Anti-patterns

- ❌ Purple/violet, gradients, glows, glassmorphism, bento-for-its-own-sake — the
  AI-startup/YC-clone surface.
- ❌ Cyberpunk/hacker cosplay — neon, terminal green, glitch, matrix rain (we are not
  Hack Club's loud palette either; study their *belonging*, not their rainbow).
- ❌ Hackathon energy — countdowns, prize bragging, sticker-bomb layouts, exclamation CTAs.
- ❌ University marketing — crests, campus beauty shots, "excellence," department-nav IA.
- ❌ Corporate consultancy — handshake stock, "solutions," "value proposition," icon trios.
- ❌ Résumé-club signals — "boost your career," headcount flexing, member-as-audience copy.
- ❌ False luxury — gold-on-cream heritage styling, serif-everywhere, whitespace with no
  evidence in it.
- ❌ Red as decoration, fill, or body text; more than one red mark per viewport.
- ❌ Color-coded disciplines (ranking by palette), colored logo variants, outlined or
  animated marks.
- ❌ Fake furniture — REV tags on unversioned work, signed blocks without real names,
  dimension lines measuring nothing.
- ❌ Inventing copy in components — strings live in `lib/data/`; hardcoded hex anywhere.

---

## 19. Research digest

What was studied and what was extracted (not imitated). Full audit trail: 2026-09 session.

| Reference | Take |
|-----------|------|
| **Hack Club** | Belonging through builder identity and real member work — proof-of-work as the membership card. Their palette (loud rainbow) and voice (chaotic) are deliberately *not* imported; the lesson is cultural, not visual. Also: strict name conventions ("always Hack Club") are worth copying — hence §6.5. |
| **buildspace** | "Tell us what you've shipped" — recruitment framed as evidence. Cohort/build-team structures prove the studio model works for students. |
| **Texas Convergent / Cornell DTI / LavaLab** | Cross-functional teams (tech + product + design + ops) and demo-day rituals are the proven student-studio mechanics. Their brands read as ordinary startup-clone marketing — DIGITAL differentiates by *looking like a drawing office, not a startup*. |
| **Linear / Vercel / Stripe** | Monochrome base + one accent "like a highlighter pen you only get to use once"; surface ladders and hairlines over shadows; explicit anti-pattern lists; craft = performance, stability, accessibility. Adopted wholesale as discipline — not their dark surfaces. |
| **Teenage Engineering / Nothing** | Monospaced type carries engineering authority; exposed construction = honesty ("constraint is the point"); a single ownable device (dot-matrix, transparent back) beats a palette of accents — the Sign-Off Block is our equivalent. "Undersell and over-deliver." |
| **ISO 7200 title blocks** | The hundred-year-old convention the brand is built on: DRAWN / CHECKED / APPROVED / DWG NO / REV / SHEET / DATE. Authorship as infrastructure. (Detail adopted: REV letters skip I and O.) |
| **A24 / editorial systems** | Restraint reads as confidence; a consistent register across every artifact makes a catalog feel like a single author. |

---

## 20. Token reference

Canonical tokens. Web implementations surface these as CSS custom properties; the current
`--dg-*` raw layer in `globals.css` remains the *as-built* source for the landing system
until R1/R5 reconciliation — this table is the target state. Never hardcode hex in
components.

```css
:root {
  /* — Core — */
  --paper:        #F7F6F2;   /* drafting vellum — page background */
  --paper-raised: #FCFBF8;   /* cards, spec sheets, fields */
  --plate-a:      #E7E4DC;   /* placeholder stripe dark band */
  --plate-b:      #EFEDE6;   /* placeholder stripe light band */
  --ink:          #111311;   /* text, borders (via alpha), fills, mark */
  --graphite:     #5A615B;   /* secondary text, labels, captions */
  --void:         #0A0C0A;   /* dark bands — the verso */
  --void-raised:  #111511;   /* hover surface on void */
  --cream:        #F2F0E8;   /* text/border source on void */
  --cream-dim:    #8B948C;   /* secondary text on void */

  /* — Brand accent — */
  --signal:       #D8412F;   /* the red pencil — marks only, ≤1/viewport */

  /* — Functional — */
  --blueprint:    #1C6CFF;   /* focus rings, interactive affordances */

  /* — Semantic — */
  --ok:           #1E4D2B;   /* verified / passed (text-safe) */
  --warn:         #C28E0E;   /* caution (chip/border/icon only — never text) */
  --err:          #9C3A2A;   /* error (text-safe; always paired w/ text|icon) */
  --info:         #1C6CFF;   /* informational */

  /* — Hairlines (alpha of ink on light / cream on void) — */
  --rule:         rgba(17,19,17,.12);
  --rule-strong:  rgba(17,19,17,.40);
  --rule-dark:    rgba(242,240,232,.12);

  /* — Type — */
  --font-promise: 'Newsreader', 'Source Serif 4', Georgia, serif;
  --font-proof:   'IBM Plex Sans', Helvetica, Arial, sans-serif;
  --font-record:  'IBM Plex Mono', Consolas, monospace;

  /* — Motion — */
  --ease-reveal:  cubic-bezier(.22,1,.36,1);
  --ease-mark:    cubic-bezier(.22,.61,.36,1);
  --dur-reveal:   .8s;
  --dur-mark:     180ms;
}
```

---

## 21. Changelog

| Date | Change |
|------|--------|
| 2026-06-01 | Initial DESIGN.md — industrial studio system derived from `Refractor/` (now retired; see git history). |
| 2026-09-14 | **Rewritten as the DIGITAL brand system.** Repositioned the org as a student-run venture studio; canonized the thesis "Make something worth putting your name on," the FIND→PROVE→MAKE→SHIP→SIGN pipeline, the Sign-Off Block identity device (ISO 7200), the `DG-###` artifact registry, and discipline codes. Palette unified on paper/ink + signal red (pencil) + blueprint (functional); gold and forest demoted to semantic roles. Type unified on the three-register Newsreader/Plex system. Route docs become expressions of this layer; open diffs tracked in §0.3 (R1–R6). |
