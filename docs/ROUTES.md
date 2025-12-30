# Routes & Pages

This document outlines all routes and pages in the DIGITAL website.

## Route Overview

| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | Main landing page with hero, stats, featured projects, and CTA |
| `/about` | About/Mission | Club mission, values, flagship project showcase, roadmap |
| `/team` | Team Members | Filterable team directory with all members |
| `/contact` | Contact | Contact form and club information |
| `/projects` | Projects Showcase | Filterable grid of all projects |
| `/projects/[slug]` | Project Details | Individual project page with specs, timeline, team |
| `/get-involved` | Get Involved | Scalable involvement options for students, alumni, companies |

---

## Page Details

### Homepage (`/`)
**File:** `app/page.tsx`

**Sections:**
1. **Hero** - Main headline with gradient text, badge, CTA buttons, hero image with overlay elements
2. **Stats Bar** - Active members, prototypes, lines of code, sponsors
3. **Mission** - Brief mission statement
4. **Featured Projects** - Bento grid of 4 featured projects
5. **Sponsors** - Text display of industry partners (Cal Poly Pomona Project Hatchery, MEP-WiSE)
6. **CTA** - "Ready to Join the Circuit?" call-to-action with Card component

**Data Sources:**
- `lib/data/siteConfig.ts` - Stats, sponsors
- `lib/data/projects.ts` - Featured projects

**UI Components Used:**
- `Button` - Primary and secondary CTAs
- `Badge` - "Now Recruiting" with pulse animation
- `Card` - Hero image container, CTA section

---

### About Page (`/about`)
**File:** `app/about/page.tsx`

**Sections:**
1. **Hero** - "Building the Future, Modularly" with lab image
2. **Affiliations** - Cal Poly Pomona, Project Hatchery, CPP Engineering
3. **Mission Cards** - Industry Standard, Peer Mentorship, Radical Innovation
4. **Flagship Project** - Modular Smartphone showcase with features
5. **Roadmap** - Project timeline (Concept, PCB Fabrication, Integration)
6. **Team Preview** - Executive board members
7. **CTA** - "Ready to Build?" call-to-action

**Data Sources:**
- `lib/data/team.ts` - Executive team members

---

### Team Page (`/team`)
**Files:**
- `app/team/page.tsx` (main page)
- `app/team/layout.tsx` (SEO metadata)

**Features:**
- Search bar (filters by name or role)
- Department filter tabs: All, Executive, Hardware, Software, Outreach
- Responsive grid layout
- "Join" cards for each department

**Sections by Department:**
1. **Executive Board** - Large cards with photos, titles, social links
2. **Hardware Team** - Compact cards
3. **Software Team** - Compact cards
4. **Outreach & Design** - Compact cards

**Data Sources:**
- `lib/data/team.ts` - All team members

---

### Contact Page (`/contact`)
**Files:**
- `app/contact/page.tsx` (main page)
- `app/contact/layout.tsx` (SEO metadata)

**Sections:**
1. **Contact Form** (left column)
   - Full Name (required)
   - Email Address (required)
   - Topic dropdown (General, Joining, Project, Sponsorship)
   - Message textarea (required)
   - Submit button with loading state
   - Success/error messages

2. **Info Sidebar** (right column)
   - Contact Info card (email, meeting times, location)
   - Social links card (LinkedIn, Instagram, Discord)
   - Campus map/image

3. **Footer** - Project Hatchery attribution

**Data Sources:**
- `lib/data/siteConfig.ts` - Contact info, social links, Formspree endpoint

**Query Parameters:**
- `?type=<involvement-type>` - Pre-selects topic based on Get Involved page links

---

### Projects Showcase (`/projects`)
**Files:**
- `app/projects/page.tsx` (main page)
- `app/projects/layout.tsx` (SEO metadata)

**Sections:**
1. **Flagship Hero** - Large hero for the flagship project (Modular Smartphone)
2. **Search & Filter**
   - Search bar (filters by title or description)
   - Category chips: All, Hardware, Software, Embedded, Robotics
3. **Projects Grid** - 3-column responsive grid of project cards
4. **CTA** - "Have a Project Idea?" call-to-action

**Project Card Features:**
- Image with gradient overlay
- Status badge (Active, Completed, Paused)
- Title and description
- Tech stack tags (max 3 shown)

**Data Sources:**
- `lib/data/projects.ts` - All projects

---

### Project Details (`/projects/[slug]`)
**File:** `app/projects/[slug]/page.tsx`

**Dynamic Routes:**
- `/projects/modular-smartphone`
- `/projects/embedded-systems`
- `/projects/robotics-initiative`
- `/projects/iot-dashboard`
- `/projects/smart-mirror`
- `/projects/drone-swarm`

**Sections:**
1. **Hero** - Project title, description, status badge, image
2. **Quick Stats** - 4-column grid of key metrics
3. **Description** - Full project description
4. **Modules Grid** - Technical components with colored icons
5. **Timeline** - Project phases with status indicators
6. **Specifications Table** - Technical specs (if available)
7. **Image Gallery** - Project photos (if available)
8. **Team Preview** - Project team members (shows executive team)
9. **CTA** - Navigation to projects list

**Data Sources:**
- `lib/data/projects.ts` - Project data by slug
- `lib/data/team.ts` - Team members for preview

---

### Get Involved Page (`/get-involved`)
**File:** `app/get-involved/page.tsx`

**Purpose:** Scalable page for different audiences to find involvement opportunities

**Sections:**
1. **Hero** - "Get Involved with DIGITAL" with badge "Open to Everyone"
2. **Students Section** - 4 options:
   - Become a Member (featured)
   - Join a Project Team
   - Apply for Leadership
   - Get Mentorship
3. **Alumni Section** - 3 options:
   - Join Alumni Network (featured)
   - Mentor Students
   - Speak at an Event
4. **Companies Section** - 4 options:
   - Become a Sponsor (featured)
   - Recruit Talent
   - Host a Workshop
   - Donate Equipment
5. **Meeting Info** - General meeting details with perks list
6. **CTA** - "Not Sure Where to Start?" with contact links

**Data Sources:**
- `lib/data/involvement.ts` - All involvement categories and options
- `lib/data/involvement.ts` - Meeting information

**UI Components Used:**
- `Card` - Interactive cards for each option, featured card for meeting info
- `CardHeader`, `CardTitle`, `CardDescription` - Card subcomponents
- `Badge` - "Popular" badges on featured options, "Open to Everyone" hero badge
- `Button` - CTAs throughout

**Scalability:**
To add new involvement options, edit `lib/data/involvement.ts`. See `MAINTAINER_GUIDE.md` for details.

---

### 404 Page (`/not-found`)
**File:** `app/not-found.tsx`

Simple 404 error page with:
- Error icon
- "Page Not Found" message
- Link back to homepage

---

## Layouts

### Root Layout (`app/layout.tsx`)
Applied to all pages. Includes:
- HTML structure with dark mode class
- Google Fonts (Space Grotesk, Noto Sans)
- Material Symbols icon font
- Navbar component
- Footer component
- Global styles

### Nested Layouts
- `app/team/layout.tsx` - SEO metadata for team page
- `app/contact/layout.tsx` - SEO metadata for contact page
- `app/projects/layout.tsx` - SEO metadata for projects pages

---

## Navigation Structure

**File:** `components/layout/Navbar.tsx`

Current navigation links (in order):
1. Home (`/`)
2. Projects (`/projects`)
3. About Us (`/about`)
4. Team (`/team`)
5. Get Involved (`/get-involved`)
6. Contact (`/contact`)

Plus "Join Us" CTA button linking to `/contact`

---

## Static Generation

All pages are statically generated at build time. The project uses Next.js static export (`output: 'export'`).

Dynamic routes (`/projects/[slug]`) use `generateStaticParams()` to pre-render all project pages based on the slugs in `lib/data/projects.ts`.

---

## Data Files Summary

| File | Purpose |
|------|---------|
| `lib/data/siteConfig.ts` | Site metadata, contact info, social links, stats, sponsors |
| `lib/data/projects.ts` | All project data with full details |
| `lib/data/team.ts` | Team member information |
| `lib/data/involvement.ts` | Get Involved categories, options, and meeting info |
