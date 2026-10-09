# IA proposal + homepage narrative

W1-AUDIT · 2026-10-02 · answers ORIGINAL_PROMPT §22 against the real content in `content-inventory.md`.
Rule used: **a page earns a URL only if real content can fill it today, or a single confirmed fact from the club would.**
Proposal only — any change to a page spine needs Head Designer sign-off (BRAND.md Governance).

---

## 1. What the content can support

| Asset | Count today |
|---|---|
| Project records with a real page | 2 (DG-001 Modular Smartphone, DG-002 Smart Reading) |
| Programs without a page | 1 (Venture Studies) |
| Named people | 1 (faculty mentor) · 7 roles all TBA |
| Real photos of work or people | 0 |
| Dated events / posts / videos | 0 / 0 / 0 |
| Verified partners | 0 (2 names in `siteConfig.sponsors`, unrendered, unconfirmed) |
| Verified metrics | 0 (all stats conflict — inventory §5) |
| Involvement paths | 11, all ending in one contact form |
| Standing fact | Build night every Thursday 6 PM, Bldg 17 Rm 1635 |
| Richest "how we work" content | Smartphone's 7 subsystems × owner / review / test gate (`phoneV2.ts:140-300`) |

The site today has **9 public routes** for this. That is too many surfaces for 2 projects and 0 people, and 4 of them
currently render blank (`audit.md` §9.2).

## 2. §22 page-by-page verdict

| §22 page | Verdict | Why (against content) | Where the content goes instead |
|---|---|---|---|
| **Home** | Keep | Thesis + 2 artifacts + one way in is enough for a strong single page | — |
| **Projects** | Keep, as **Work** (ledger, not catalogue) | 2 real records + 1 program + an open slot justify a ledger. Search + 5 filters for 1 item (current `/projects`) do not | `/projects` (keep URL) |
| Project detail ×2 | Keep | Richest content on the site; already built | `/projects/modular-smartphone`, `/projects/smart-reading` — add Build Record anatomy (DESIGN.md §14.1) |
| **About** | Merge → **Studio** | Current `/about` is 5 parallel frameworks + a TBA board, mostly repeating `/`. The useful part is *how a build runs* | `/studio`: pipeline, ownership model, beliefs, people |
| **Disciplines** | Reject as page | No per-discipline content exists. A page per major is the "navigate-by-degree department site" DESIGN.md §5.2 bans | A **discipline matrix** (subsystem × ME/EE/SW/DS/ID/VN/CM/OP) on Home + Join |
| **Teams** | Reject as page | Teams = project teams; they have no data apart from their project | Inside each project record ("Built by" block, subsystem owners) |
| **Join** | Keep, restructure | Real: meeting, Discord, 11 paths, eligibility. Student path should dominate; alumni/company paths are 7 of 11 cards today | `/join` (redirect `/get-involved`) |
| **Partners** | Reject for now | 0 confirmed partners. A logo wall of unverified names = fabricated proof (BRIEF rule 4) | "Back a build" section on Join (sponsor / recruit / workshop / donate). Re-evaluate when ≥2 partners confirm in writing |
| **Events** | Reject for now | Only a recurring meeting. An events page with one row is a dead page | Build-night fact in nav meta / footer title block. Add page when ≥3 dated events per term |
| **Members** | Reject | 0 named members; DESIGN.md §4/§15 puts names on work, not headshot grids; privacy | Credits on project records; 7 open seats on Studio |
| **News** | Reject for now | 0 posts; LinkedIn list empty | Per-project **revision log** (`REV` entries) when real. Later a site-wide "Record" feed aggregating REV entries |
| **Resources** | Reject for now | Nothing exists | Later: handoff docs per project (supports VISION_LINE) |
| *Community* (current) | Merge into Join | Only Discord is real; LinkedIn/YouTube shelves are empty states | Join → "Watch first" block (Discord expectations, `community.ts:26-30`) |
| *Team* (current) | Merge into Studio | 7 TBA cards | Studio → "Seats" (unsigned blocks) |
| *Contact* | Keep | Form with intent mapping (`contactTopics.ts`) works without JS backend via mailto fallback | `/contact` — every CTA deep-links `?type=` |

## 3. Proposed IA (5 surfaces + legal)

```
/                      Home — thesis, the work, how a build runs, where you fit, join
/projects              Work — ledger: DG-001, DG-002, Venture Studies (program), DG-003 [open slot]
  /modular-smartphone  Build record DG-001 (immersive allowed, Build Record elements mandatory)
  /smart-reading       Build record DG-002
/studio                How a build runs (FIND→SIGN, ownership model, beliefs) + people/seats
/join                  Students first; "Watch first" (Discord); "Back a build" (companies, alumni)
/contact               Form, ?type= intents
/privacy /terms /cookies
Redirects: /about → /studio · /team → /studio#seats · /get-involved → /join · /community → /join#watch · /pillars → /studio
```

Primary nav (≤4 + CTA, DESIGN.md §13.1 allows ≤6): **Work · Studio · Join** + CTA **Talk to us**.
One nav for every route, including `/` (today `/` has its own anchor nav: Thesis/Pathways/Results — `HomeLanding.tsx:135-153`)
and the immersive pages (today: only a `← DIGITAL` back link or in-page anchors).

Why 5 and not 9: every page now argues one idea (BRAND.md "one idea per page"), none renders an empty state as its main
content, and each one grows naturally when real material arrives (photos → project records; names → sign-off blocks;
events/partners → new pages only past the thresholds above).

## 4. Homepage narrative

### §22 default, tested against content

| §22 beat | Content available | Verdict |
|---|---|---|
| WHY THIS EXISTS | Thesis, "Coursework describes systems. We build them.", B1–B4 | Strong — but it's one line, not a section. Fold into hero |
| WHAT MEMBERS BUILD | Same 2 projects as REAL PROJECTS | Duplicate with only 2 projects. Merge |
| REAL PROJECTS | 2 records + 1 program | Keep — this is the hero of the page (§41) |
| HOW TEAMS WORK | 7-subsystem ownership model, workflow, gates | Strong, real, distinctive. Keep |
| WHO CAN JOIN | Disciplines per subsystem + Smart Reading's list | Keep, as a matrix, not prose |
| PROOF | 0 verified metrics, 0 testimonials, 0 partners, 0 photos | **Cannot be a section today.** Anything here would be fabricated or contradictory. Proof is carried by the artifacts themselves (specs, subsystem breakdown, RSVP demo) |
| HOW TO PARTICIPATE | Thursday 6 PM, room, Discord, form | Keep |

### Proposed order (6 beats)

| # | Beat | Content (all real unless marked) | Reason |
|---|---|---|---|
| 1 | **Thesis + artifact** (hero) | "Make something worth putting your name on." + "A student-run venture studio at Cal Poly Pomona." + one primary CTA "See the work" + mono meta "Build night · Thu 6 PM · Bldg 17 Rm 1635". Visual = the work itself (schematic / RSVP word stream), not the stock-feel drafting photo | WHY lands in one line; the first thing seen is evidence, not atmosphere |
| 2 | **The work** | DG-001 and DG-002 as Build Record rows: ID, stage, problem line, disciplines, status, `[ PROJECT PHOTO ] [placeholder]` plate. Venture Studies as a program row. DG-003 as an **unsigned** row: "Pitch the next build" | Projects are the hero (§41); merges WHAT MEMBERS BUILD + REAL PROJECTS; the open slot recruits without inventing a project |
| 3 | **How a build runs** | One subsystem traced: owner → review path → test gate → repair plan (`phoneV2.ts:295-300`) on the FIND→PROVE→MAKE→SHIP→SIGN rail | Distinctive, real, and explains "different majors, one product" by mechanism, not adjectives |
| 4 | **Where you fit** | Matrix: 7 smartphone subsystems + Smart Reading needs × discipline codes. Line territory: "Products need more than programmers." | Replaces WHO CAN JOIN prose; shows non-CS paths concretely (VN for Venture Studies, ID for Apps/UX + CAD, DS for research) |
| 5 | **Unsigned block** | Sign-off block with `BUILT BY ______` and the 7 open seats (`team.ts`) | Turns the empty roster into the recruitment device (DESIGN.md §4.4) — honest stand-in for PROOF |
| 6 | **Join** | Thursday build night, Discord, "No project experience required", one primary CTA → `/join`, secondary → `/contact?type=join` | One participation path, concrete logistics |
| — | Footer = title block | Mark (SVG), route as SHEET, legal | DESIGN.md §4.3 |

Dropped from today's home: the loader, the 3 "gap" cards (BRAND.md already flags them), the "Two ways in" pathways card pair
(moves to `/join`), the mission-beats band (canonical copy stays on Studio verbatim — BRAND.md allows it to render once).

### When PROOF can come back

Add a proof beat only when at least one of these exists and is confirmed: a dated REV entry with a photo, a named
contributor list for one project, a confirmed partner, or a reconciled member count (resolve C1/C2 in the inventory).

## 5. Open questions for the Head Designer / club

1. Is Venture Studies a project (gets DG-003 and a record) or a program that serves all builds?
2. Confirm or drop: Project Hatchery and MEP-WiSE as supporters; the 25+/40+/120+ counts; smartphone current phase.
3. Where is the Smart Reading master document (`glasses.ts:4`)? It likely holds dates, status, and contributors.
4. Is `Landing-Page-Hero.png` a real photo of club work or a generated image? It decides whether it can be "documentary".
5. OK to rename routes (`/get-involved` → `/join`, `/about` + `/team` → `/studio`) with redirects?
