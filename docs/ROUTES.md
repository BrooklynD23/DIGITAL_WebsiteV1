# Routes & Pages

This document outlines all routes and pages in the DIGITAL website.

## Route Overview

Updated 2026-10-07, when the Apple-system pages became the default routes. Pages live in one
route group (`app/(apple)/`; the group folder is not part of the URL). Every route is statically exported.

### Live pages — Apple system (`app/(apple)/`)

| Route | File | Description | Design doc |
|-------|------|-------------|------------|
| `/` | `app/(apple)/page.tsx` | Home: phone hero (four played stages), the three builds, join | `DESIGN.md` |
| `/projects/sidekick/` | `app/(apple)/projects/sidekick/page.tsx` | SIDEKICK: the FPGA main board in nine played stages | `docs/design/sidekick.DESIGN.md` (**locked**) |
| `/projects/shades/` | `app/(apple)/projects/shades/page.tsx` | SHADES: reading glasses, live reader, light-path stages | `DESIGN.md` |
| `/projects/brain/` | `app/(apple)/projects/brain/page.tsx` | BRAIN: six lessons on one dot figure | `docs/design/brain.DESIGN.md` (**locked**) |

### Shared-frame pages (`app/(apple)/`)

`/about`, `/team`, `/community`, `/contact`, `/get-involved`, `/privacy`, `/terms`, `/cookies`.
Simple pages use the `SitePage` frame (`app/(apple)/_chrome/SitePage.tsx`); legal pages use
`LegalPage` (`app/(apple)/_legal/LegalPage.tsx`). Governing doc: `DESIGN.md`.

### Redirect stubs (`app/(apple)/`, `noindex`, not in the sitemap)

| Old route | Goes to |
|-----------|---------|
| `/pillars` | `/about#how-we-work` |
| `/projects` | `/#builds` |
| `/projects/modular-smartphone` | `/projects/sidekick/` |
| `/projects/smart-reading` | `/projects/shades/` |
| `/design-lab/r2/apple/hero` | `/` |
| `/design-lab/r2/apple/sidekick`, `/shades`, `/brain` | the matching `/projects/…/` page |

Stubs use `app/(apple)/_redirect.tsx`: a client-side `location.replace` plus a visible
fallback link (static-export safe).

### Retired

`/review` (internal stakeholder hub) was archived with no redirect. The previous landing, the
PhoneV2 smartphone page and the R3F smart-reading page are in `archive/` (see
`archive/README.md`).

---

## Page details

> **Note (2026-10-07):** the sections below were written before the route groups. Live pages are under `app/(apple)/`. The Homepage, DIGITAL Pillars, Projects, Modular Smartphone and Smart Reading sections describe archived designs or redirect stubs; the live pages are in the tables above.

### Homepage (`/`)
**Files (archived):** `archive/app/page.tsx`, `archive/components/home/HomeLanding.tsx`

Newsreader / IBM Plex landing with loader, sticky anchor nav, thesis gaps, pathways, build-record cards, and join CTA. Hides global Navbar/Footer.

**Data (archived):** `archive/lib/data/homeLanding.ts`

---

### DIGITAL Pillars (`/pillars`)
**File:** `app/(apple)/pillars/page.tsx` (redirect stub to `/about/#how-we-work`; the original page is archived)

Interactive DIGITAL acronym, seven pillar cards, mission statement, framework phases, CTA.

---

### About (`/about`)
**File:** `app/(apple)/about/page.tsx`

Mission cards, flagship project showcase, roadmap, executive team preview, CTA.

**Data:** `app/(apple)/_content/about.ts`, `lib/data/about.ts`

---

### Team (`/team`)
**File:** `app/(apple)/team/page.tsx`

Search, department filters, responsive member grid.

**Data:** `lib/data/team.ts`

---

### Contact (`/contact`)
**Files:** `app/(apple)/contact/page.tsx`, `app/(apple)/contact/ContactForm.tsx`

Contact form with topic dropdown, info sidebar, social links, campus map.

**Query parameters:**
- `?type=<involvement-type>` — pre-selects the topic dropdown via `lib/data/contactTopics.ts`

Supported `type` values map from `lib/data/involvement.ts`:
`membership`, `project-team`, `leadership`, `mentorship`, `alumni-network`, `mentor`, `speaker`, `sponsor`, `recruit`, `workshop`, `donate`

**Data:** `lib/data/siteConfig.ts`, `lib/data/contactTopics.ts`

---

### Projects (`/projects`)
**File:** `app/(apple)/projects/page.tsx` (redirect stub to `/#builds`; the original page is archived)

Flagship hero, search/filter, project grid, CTA.

**Data (archived):** `archive/lib/data/projects.ts`

---

### Modular Smartphone (`/projects/modular-smartphone`)
**File:** `app/(apple)/projects/modular-smartphone/page.tsx` (redirect stub to `/projects/sidekick/`; the original page is archived)

Immersive Anime.js exploded-smartphone scrollytelling (`PhoneV2Experience`). Hides global Navbar/Footer.

**Data (archived):** `archive/lib/data/phoneV2.ts`, `archive/lib/data/projects.ts`

---

### Smart Reading (`/projects/smart-reading`)
**File:** `app/(apple)/projects/smart-reading/page.tsx` (redirect stub to `/projects/shades/`; the original page is archived)

Client-only R3F immersive scroll experience (`GlassesExperience`).

**Data (archived):** `archive/lib/data/experiments/glasses.ts`, `archive/lib/data/projects.ts`

---

### Get Involved (`/get-involved`)
**File:** `app/(apple)/get-involved/page.tsx`

Student, alumni, and company involvement cards with deep-links to `/contact?type=...`.

**Data:** `lib/data/involvement.ts`

---

### Legal pages

| Route | File |
|-------|------|
| `/privacy` | `app/(apple)/privacy/page.tsx` |
| `/terms` | `app/(apple)/terms/page.tsx` |
| `/cookies` | `app/(apple)/cookies/page.tsx` |

Linked from Footer legal row. Included in `app/sitemap.ts`.

---

### 404 (`not-found`)
**File:** `app/not-found.tsx`

---

## Navigation structure

**Sticky bar:** `app/(apple)/_chrome/LocalNav.tsx` (one per page).

**Footer** (`app/(apple)/_chrome/WorldFooter.tsx`; link lists in `app/(apple)/_chrome/routes.ts`):

1. Builds: DIGITAL (`/`), SIDEKICK, SHADES, BRAIN
2. Site pages (`SITE_PAGES`): About, Team, Community, Get involved, Contact
3. Legal (`LEGAL_PAGES`): Privacy, Terms, Cookies
4. Social icons: Discord, Instagram, LinkedIn, GitHub

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
| `lib/data/siteConfig.ts` | Site metadata, contact, social links (stats and sponsors are exported but not rendered) |
| `lib/data/team.ts` | Team members |
| `lib/data/involvement.ts` | Get Involved options |
| `lib/data/contactTopics.ts` | Contact form topics + `?type=` mapping |
| `lib/data/about.ts` | About page acronym |
| `lib/data/community.ts` | Community channels |
| `archive/lib/data/projects.ts` | Project data (archived) |
| `archive/lib/data/reviewRoutes.ts` | Stakeholder review hub metadata (archived) |
| `archive/lib/data/homeLanding.ts` | Homepage landing copy (archived) |
| `archive/lib/data/phoneV2.ts` | Modular smartphone experience copy (archived) |
| `archive/lib/data/experiments/glasses.ts` | Smart Reading experience copy (archived) |
