# Routes & Pages

This document outlines all routes and pages in the DIGITAL website.

## Route Overview

### Production routes (public nav + sitemap)

| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | Newsreader landing — thesis, pathways, build record, join CTA (own nav/footer) |
| `/pillars` | DIGITAL Pillars | The DIGITAL acronym and engineering framework |
| `/about` | About | Mission, values, flagship project, roadmap |
| `/team` | Team | Filterable team directory |
| `/contact` | Contact | Contact form and club information |
| `/projects` | Projects | Filterable project grid |
| `/projects/modular-smartphone` | Modular Smartphone | Immersive exploded-smartphone scrollytelling (PhoneV2 experience) |
| `/projects/smart-reading` | Smart Reading | Immersive R3F scroll experience (wearable project) |
| `/get-involved` | Get Involved | Membership, alumni, and sponsor paths |
| `/privacy` | Privacy Policy | Legal — privacy |
| `/terms` | Terms of Service | Legal — terms |
| `/cookies` | Cookie Policy | Legal — cookies |

### Preview / candidate routes (not in sitemap or public nav)

| Route | Status | Description |
|-------|--------|-------------|
| `/review` | Internal | Stakeholder hub for remaining variant review (`noindex`) |

### Legacy routes

| Route | Behavior |
|-------|----------|
| `/experiments/glasses` | Client redirect to `/projects/smart-reading` |

---

## Stakeholder review hub

**File:** `app/review/page.tsx`  
**Data:** `lib/data/reviewRoutes.ts`

Internal-only page for comparing experience variants before promotion. Not linked from Navbar, Footer, or sitemap. Open at `/review` during stakeholder meetings.

**Decision groups:**
1. **Smart Reading** — `/projects/smart-reading` (production) vs `/experiments/glasses` (legacy redirect)

---

## Immersive routes

These routes hide the global Navbar and Footer (`lib/immersiveRoutes.ts`):

- `/` (homepage has own nav/footer)
- `/experiments/*`
- `/projects/modular-smartphone`
- `/projects/smart-reading`

Each immersive experience includes an `EscapeHatch` component linking back to `/`.

Route-scoped style references (authoritative per route; root `DESIGN.md` governs everything else):

- `/` → `docs/design/landing.DESIGN.md`
- `/projects/modular-smartphone` → `docs/design/smartphone.DESIGN.md`
- `/projects/smart-reading` → `docs/design/glasses.DESIGN.md`

---

## Page details

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

**Legacy:** `/phone-v2` redirects here.

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

### Legacy / redirect routes

| Route | Behavior |
|-------|----------|
| `/phone-v2` | Client redirect to `/projects/modular-smartphone` |
| `/experiments/glasses` | Client redirect to `/projects/smart-reading` |

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

Includes production routes and legal pages. Excludes internal review (`/review`) and legacy redirects (`/phone-v2`, `/experiments/glasses`).

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
