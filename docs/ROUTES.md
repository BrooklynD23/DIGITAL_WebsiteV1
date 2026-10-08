# Routes & Pages

This document outlines all routes and pages in the DIGITAL website.

## Route Overview

Updated 2026-10-07, when the Apple-system pages became the default routes. Pages live in two
route groups (the group folder is not part of the URL). Every route is statically exported.

### Live pages — Apple system (`app/(apple)/`)

| Route | File | Description | Design doc |
|-------|------|-------------|------------|
| `/` | `app/(apple)/page.tsx` | Home: phone hero (four played stages), the three builds, join | `DESIGN.md` |
| `/projects/sidekick/` | `app/(apple)/projects/sidekick/page.tsx` | SIDEKICK: the FPGA main board in nine played stages | `docs/design/sidekick.DESIGN.md` (**locked**) |
| `/projects/shades/` | `app/(apple)/projects/shades/page.tsx` | SHADES: reading glasses, live reader, light-path stages | `DESIGN.md` |
| `/projects/brain/` | `app/(apple)/projects/brain/page.tsx` | BRAIN: six lessons on one dot figure | `docs/design/brain.DESIGN.md` (**locked**) |

### Pages being migrated to the Apple system (`app/(legacy)/` → `app/(apple)/`)

`/about`, `/team`, `/community`, `/contact`, `/get-involved`, `/privacy`, `/terms`, `/cookies`.
Until a page is migrated it renders with the legacy layout (`app/(legacy)/layout.tsx`:
`components/layout/Navbar` + `Footer`). A migrated page uses the `SitePage` frame
(`app/(apple)/_chrome/SitePage.tsx`). Governing doc: `DESIGN.md`.

### Redirect stubs (`app/(legacy)/`, `noindex`, not in the sitemap)

| Old route | Goes to |
|-----------|---------|
| `/pillars` | `/about#how-we-work` |
| `/projects` | `/#builds` |
| `/projects/modular-smartphone` | `/projects/sidekick/` |
| `/projects/smart-reading` | `/projects/shades/` |
| `/design-lab/r2/apple/hero` | `/` |
| `/design-lab/r2/apple/sidekick`, `/shades`, `/brain` | the matching `/projects/…/` page |

Stubs use `app/(legacy)/_redirect.tsx`: a client-side `location.replace` plus a visible
fallback link (static-export safe).

### Retired

`/review` (internal stakeholder hub) was archived with no redirect. The previous landing, the
PhoneV2 smartphone page and the R3F smart-reading page are in `archive/` (see
`archive/README.md`).

---

## Page details

> **Note (2026-10-07):** the sections below were written before the route groups. For a page that still exists, read `app/<route>/` as `app/(legacy)/<route>/` (or `app/(apple)/<route>/` once migrated). The Homepage, DIGITAL Pillars, Projects, Modular Smartphone and Smart Reading sections describe archived pages; the live pages are in the tables above.

### Homepage (`/`)
**Files:** `app/page.tsx`, `components/home/HomeLanding.tsx`

Newsreader / IBM Plex landing with loader, sticky anchor nav, thesis gaps, pathways, build-record cards, and join CTA. Hides global Navbar/Footer.

**Data:** `lib/data/homeLanding.ts`

---

### DIGITAL Pillars (`/pillars`)
**File:** `app/pillars/page.tsx`

Interactive DIGITAL acronym, seven pillar cards, mission statement, framework phases, CTA.

---

### About (`/about`)
**File:** `app/about/page.tsx`

Mission cards, flagship project showcase, roadmap, executive team preview, CTA.

**Data:** `lib/data/team.ts`

---

### Team (`/team`)
**Files:** `app/team/page.tsx`, `app/team/layout.tsx`

Search, department filters, responsive member grid.

**Data:** `lib/data/team.ts`

---

### Contact (`/contact`)
**Files:** `app/contact/page.tsx`, `app/contact/layout.tsx`

Contact form with topic dropdown, info sidebar, social links, campus map.

**Query parameters:**
- `?type=<involvement-type>` — pre-selects the topic dropdown via `lib/data/contactTopics.ts`

Supported `type` values map from `lib/data/involvement.ts`:
`membership`, `project-team`, `leadership`, `mentorship`, `alumni-network`, `mentor`, `speaker`, `sponsor`, `recruit`, `workshop`, `donate`

**Data:** `lib/data/siteConfig.ts`, `lib/data/contactTopics.ts`

---

### Projects (`/projects`)
**Files:** `app/projects/page.tsx`, `app/projects/layout.tsx`

Flagship hero, search/filter, project grid, CTA.

**Data:** `lib/data/projects.ts`

---

### Modular Smartphone (`/projects/modular-smartphone`)
**Files:** `app/projects/modular-smartphone/page.tsx`, `app/projects/modular-smartphone/layout.tsx`

Immersive Anime.js exploded-smartphone scrollytelling (`PhoneV2Experience`). Hides global Navbar/Footer.

**Data:** `lib/data/phoneV2.ts`, `lib/data/projects.ts`

---

### Smart Reading (`/projects/smart-reading`)
**File:** `app/projects/smart-reading/page.tsx`

Client-only R3F immersive scroll experience (`GlassesExperience`).

**Data:** `lib/data/experiments/glasses.ts`, `lib/data/projects.ts`

---

### Get Involved (`/get-involved`)
**File:** `app/get-involved/page.tsx`

Student, alumni, and company involvement cards with deep-links to `/contact?type=...`.

**Data:** `lib/data/involvement.ts`

---

### Legal pages

| Route | File |
|-------|------|
| `/privacy` | `app/privacy/page.tsx` |
| `/terms` | `app/terms/page.tsx` |
| `/cookies` | `app/cookies/page.tsx` |

Linked from Footer legal row. Included in `app/sitemap.ts`.

---

### 404 (`not-found`)
**File:** `app/not-found.tsx`

---

## Navigation structure

**Navbar** (`components/layout/Navbar.tsx`):

1. Home (`/`)
2. Pillars (`/pillars`)
3. Projects (`/projects`)
4. About (`/about`)
5. Team (`/team`)
6. Get Involved (`/get-involved`)
7. Contact (`/contact`)

**Footer quick links:** Projects, Team, About, Contact  
**Footer legal:** Privacy, Terms, Cookies

---

## Static generation

All pages are statically generated at build time (`output: 'export'` in `next.config.js`).

Project detail pages use dedicated route files — there is no dynamic `[slug]` catch-all.

---

## Sitemap

**File:** `app/sitemap.ts`

Includes production routes and legal pages. Excludes the internal review hub (`/review`).

---

## Data files summary

| File | Purpose |
|------|---------|
| `lib/data/siteConfig.ts` | Site metadata, contact, social, stats, sponsors |
| `lib/data/projects.ts` | Project data |
| `lib/data/team.ts` | Team members |
| `lib/data/involvement.ts` | Get Involved options |
| `lib/data/contactTopics.ts` | Contact form topics + `?type=` mapping |
| `lib/data/reviewRoutes.ts` | Stakeholder review hub metadata |
| `lib/data/homeLanding.ts` | Homepage landing copy |
| `lib/data/phoneV2.ts` | Modular smartphone experience copy |
| `lib/data/experiments/glasses.ts` | Smart Reading experience copy |
