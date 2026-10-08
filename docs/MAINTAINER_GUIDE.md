# Maintainer Guide

How to update and maintain the DIGITAL website. For route maps, see [`ROUTES.md`](./ROUTES.md). For design rules, see [`DESIGN.md`](../DESIGN.md)
and route-scoped docs under [`docs/design/`](./design/). For copy voice, see
[`docs/design/BRAND.md`](./design/BRAND.md).

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Updating Team Members](#updating-team-members)
3. [Updating Projects](#updating-projects)
4. [Updating Site Configuration](#updating-site-configuration)
5. [Updating Page Copy](#updating-page-copy)
6. [Updating Get Involved Options](#updating-get-involved-options)
7. [Replacing Placeholder Images](#replacing-placeholder-images)
8. [Adding New Pages](#adding-new-pages)
9. [UI Components Guide](#ui-components-guide)
10. [Styling Guide](#styling-guide)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## Quick Reference

| Task | File to Edit |
|------|--------------|
| Add/edit team members | `lib/data/team.ts` |
| Build pages' copy (home, SIDEKICK, SHADES, BRAIN) | `app/(apple)/_content/{home,sidekick,shades,brain}.ts` |
| Update contact info | `lib/data/siteConfig.ts` |
| Change social links | `lib/data/siteConfig.ts` (`social`) |
| Update stats | `lib/data/siteConfig.ts` (exported; no live page renders it) |
| Update sponsors | `lib/data/siteConfig.ts` (exported; no live page renders it) |
| Add/edit involvement options | `lib/data/involvement.ts` |
| Replace images | `public/assets/` |
| Edit a standard page's content | `app/(apple)/<page>/page.tsx` + `app/(apple)/_content/<page>.ts` |
| Modify shared UI | `app/(apple)/_system/ui/` |
| Update navigation and footer lists | `app/(apple)/_chrome/routes.ts` |

---

## Updating Team Members

**File:** `lib/data/team.ts`

### Add a New Member

Add a new object to the `teamMembers` array:

```typescript
{
  id: 'unique-id',           // Unique identifier (lowercase, dashes)
  name: 'John Doe',          // Full name
  role: 'PCB Design Lead',   // Their role/responsibility
  department: 'hardware',    // One of: 'executive' | 'hardware' | 'software' | 'outreach'
  title: 'Hardware Lead',    // Display title
  image: '/images/team/john-doe.jpg',  // Photo path
  links: {                   // Optional social links
    linkedin: 'https://linkedin.com/in/johndoe',
    email: 'john@example.com',
    github: 'https://github.com/johndoe',
  },
},
```

### Department Options

| Department | Description |
|------------|-------------|
| `executive` | Executive board members (President, VP, etc.) |
| `hardware` | Hardware/electrical team |
| `software` | Software/firmware team |
| `outreach` | Marketing, design, outreach team |

### Remove a Member

Delete their object from the array.

### Update a Member

Find their object by `id` and modify the fields.

---

## Updating Projects

> **Retired 2026-10-07.** `lib/data/projects.ts` is archived at `archive/lib/data/projects.ts`. The build pages' copy now lives in `app/(apple)/_content/{sidekick,shades,brain}.ts`. The schema below is kept for reference only.

**File (archived):** `archive/lib/data/projects.ts`

### Add a New Project

Add a new object to the `projects` array:

```typescript
{
  id: 'unique-id',
  slug: 'project-url-name',              // Used in URL: /projects/[slug]
  title: 'Project Name',
  shortDescription: 'Brief description for cards',
  fullDescription: 'Detailed description for project page',
  category: 'hardware',                  // 'hardware' | 'software' | 'embedded' | 'robotics'
  status: 'active',                      // 'active' | 'completed' | 'paused'
  isFlagship: false,                     // true for the main featured project
  image: '/images/projects/my-project.jpg',

  // Optional fields:
  stats: [
    { label: 'Team Size', value: '8' },
    { label: 'Duration', value: '6 months' },
  ],
  techStack: ['React', 'Node.js', 'Python'],
  timeline: [
    { phase: 1, title: 'Research', status: 'completed' },
    { phase: 2, title: 'Development', status: 'current' },
    { phase: 3, title: 'Testing', status: 'future' },
  ],
  modules: [
    {
      icon: 'memory',           // Material Symbols icon name
      title: 'Module Name',
      description: 'What this module does',
      color: 'blue',            // 'blue' | 'green' | 'purple' | 'orange' | 'red'
    },
  ],
  specifications: [
    { label: 'Processor', value: 'ARM Cortex-M4' },
    { label: 'Memory', value: '512KB Flash' },
  ],
  gallery: [
    '/images/projects/my-project-1.jpg',
    '/images/projects/my-project-2.jpg',
  ],
},
```

### Category Options

| Category | Description |
|----------|-------------|
| `hardware` | Physical hardware projects |
| `software` | Software/web applications |
| `embedded` | Embedded systems, firmware |
| `robotics` | Robotics and automation |

### Status Options

| Status | Badge Color | Description |
|--------|-------------|-------------|
| `active` | Green | Currently in development |
| `completed` | Blue | Finished project |
| `paused` | Yellow | On hold |

### Set Flagship Project

Only one project should have `isFlagship: true`. This project appears in the hero section on the Projects page.

---

## Updating Site Configuration

**File:** `lib/data/siteConfig.ts`

### Contact Information

```typescript
contact: {
  email: '', // no public email yet; empty makes pages show Discord instead
  meetingTime: 'Thursdays @ 6:00 PM',
  location: 'Building 17, Room 1635',
  campus: 'Cal Poly Pomona',
},
```

### Social Links

Edit links in this one block only. `app/(apple)/_chrome/club.ts`, the footer and the Community page read it.

```typescript
social: {
  discord: 'https://discord.gg/U77P2U2D84',
  brainDiscord: 'https://discord.gg/Smfv4weJMz',
  github: 'https://github.com/DIGITALatCalPolyPomonaCPP/SIDEKICK-Prev.-TheSmartphoneProject-',
  linkedin: 'https://www.linkedin.com/company/digital-cal-poly-pomona',
  instagram: 'https://www.instagram.com/digital.cpp/',
},
```

### Stats (exported; no live page renders it)

```typescript
stats: {
  activeMembers: '120+',
  prototypes: '15',
  linesOfCode: '50k+',
  sponsors: '2',
},
```

### Sponsors (exported; no live page renders it)

```typescript
sponsors: [
  { name: 'Cal Poly Pomona Project Hatchery' },
  { name: 'College of Engineering: MEP-WiSE' },
  // Add more sponsors as needed
],
```

### Formspree Endpoint

```typescript
formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
```

To get your form ID:
1. Go to [formspree.io](https://formspree.io)
2. Create an account and new form
3. Copy the endpoint URL

---

## Updating Page Copy

Copy for each live page lives in `app/(apple)/_content/`. **Never** hard-code strings in page components.

| Route | Copy file | Page |
|-------|-----------|------|
| `/` | `app/(apple)/_content/home.ts` | `app/(apple)/page.tsx` + `app/(apple)/projects/_hero/` |
| `/projects/sidekick/` | `app/(apple)/_content/sidekick.ts` | `app/(apple)/projects/sidekick/` (LOCKED) |
| `/projects/shades/` | `app/(apple)/_content/shades.ts` | `app/(apple)/projects/shades/` |
| `/projects/brain/` | `app/(apple)/_content/brain.ts` | `app/(apple)/projects/brain/` (LOCKED) |
| `/about`, `/team`, `/community`, `/get-involved`, `/contact` | `app/(apple)/_content/<page>.ts` | `app/(apple)/<page>/page.tsx` |

**Copy workflow:** Read [`docs/design/BRAND.md`](./design/BRAND.md) first. Route copy changes
through the `brand-voice-strategist` agent and `brand-guardian` review before commit.
Locked pages (`/projects/sidekick/`, `/projects/brain/`) also need Head Designer sign-off.

**Motion:** The GSAP text reveal (`TextReveal.tsx`, `gsapSetup.ts`) is archived in
`archive/components/motion/` with the smartphone page; no live page imports it.
Respect `prefers-reduced-motion`.

---

## Updating Get Involved Options

**File:** `lib/data/involvement.ts`

The Get Involved page is designed to be easily scalable. You can add new categories or options by editing the data file.

### Add a New Involvement Option

Find the appropriate category and add to its `options` array:

```typescript
{
  id: 'unique-option-id',
  title: 'Option Title',
  description: 'Brief description of what this involvement option offers.',
  icon: 'material_icon_name',  // See: https://fonts.google.com/icons
  link: '/contact?type=option-id',  // Links to contact form with type param
  linkText: 'Apply Now',  // Button text (optional, defaults to "Learn More")
  featured: true,  // Set to true to highlight with "Popular" badge (optional)
},
```

### Add a New Category

Add a new object to the `involvementCategories` array:

```typescript
{
  id: 'category-id',
  title: 'Category Name',
  subtitle: 'Brief description of this category',
  icon: 'material_icon_name',
  options: [
    // Add options here
  ],
},
```

### Current Categories

| Category | Description | Target Audience |
|----------|-------------|-----------------|
| `students` | Membership, project teams, leadership, mentorship | Current students |
| `alumni` | Alumni network, mentoring, speaking | Graduated members |
| `companies` | Sponsorship, recruiting, workshops, donations | Industry partners |

### Update Meeting Information

In the same file, update the `meetingInfo` object:

```typescript
export const meetingInfo = {
  title: 'General Meetings',
  description: 'Your meeting description here.',
  schedule: 'Thursdays @ 6:00 PM',
  location: 'Building 17, Room 1635',
  campus: 'Cal Poly Pomona',
  perks: ['Hands-on workshops', 'Industry guest speakers', 'Project updates', 'Networking'],
};
```

---

## Replacing Placeholder Images

> **Retired 2026-10-07.** `public/images/` no longer exists. Live images are under `public/assets/` (`landing/`, `boards/`, `cine/`). The placeholder inventory in `IMAGE_REPLACEMENT_GUIDE.md` is partly legacy.

### Image Locations (retired tree)

```
public/images/
├── projects/              # Project images
│   ├── modular-phone.jpg  # Flagship project
│   ├── smart-mirror.jpg
│   └── ...
├── team/                  # Team photos
│   ├── group-photo.jpg    # Team page hero
│   ├── member-name.jpg    # Individual photos
│   └── ...
└── general/               # General images
    ├── hero-device.jpg    # Homepage hero
    ├── lab-session.jpg    # About page hero
    └── campus-aerial.jpg  # Contact page
```

### Image Guidelines

| Type | Recommended Size | Aspect Ratio |
|------|------------------|--------------|
| Project images | 1200×900px | 4:3 |
| Team photos | 400×400px | 1:1 (square) |
| Hero images | 1200×800px | 3:2 |
| Group photo | 1200×800px | 3:2 |

### How to Replace

1. Add your image to the appropriate folder in `public/assets/`
2. Update the path in the data file:
   - Team: `lib/data/team.ts` → `image` field
   - Projects: retired (`archive/lib/data/projects.ts`)
3. Use the path starting from `/images/...`

Example:
```typescript
// Before (placeholder)
image: '/images/placeholders/team/avatar-1.svg',

// After (real image)
image: '/images/team/john-doe.jpg',
```

---

## Adding New Pages

### Create a New Page

1. Create a new folder in `app/(apple)/`:
   ```
   app/(apple)/
   └── new-page/
       └── page.tsx
   ```
   Build it on the `SitePage` frame (`app/(apple)/_chrome/SitePage.tsx`) with CSS modules on the `--r2-*` tokens. The Tailwind example in step 2 is retired.

2. Create the page component (retired pattern, kept for reference):
   ```typescript
   import type { Metadata } from 'next';
   import { Button, Card } from '@/components/ui';

   export const metadata: Metadata = {
     title: 'Page Title - DIGITAL @ Cal Poly Pomona',
     description: 'Page description for SEO',
   };

   export default function NewPage() {
     return (
       <>
         {/* Hero Section */}
         <section className="relative w-full py-16 md:py-20 px-4 md:px-10">
           <div className="max-w-4xl mx-auto text-center">
             <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
               Page Title
             </h1>
           </div>
         </section>

         {/* Content sections */}
       </>
     );
   }
   ```

3. Add the page to `SITE_PAGES` (or `LEGAL_PAGES`) in `app/(apple)/_chrome/routes.ts`. The footer reads those lists:
   ```typescript
   export const SITE_PAGES = [
     // ... existing pages
     { label: 'New Page', href: '/new-page/' },
   ];
   ```

### Client Components

If your page needs interactivity (useState, useEffect), add `'use client'` at the top and create a separate layout for metadata:

**page.tsx:**
```typescript
'use client';

import { useState } from 'react';

export default function InteractivePage() {
  const [state, setState] = useState(false);
  // ...
}
```

**layout.tsx:**
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title - DIGITAL',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
```

---

## UI Components Guide

> **Retired 2026-10-07.** `components/ui/` is archived (`archive/components/ui/`). Shared UI for live pages is `app/(apple)/_system/ui/` (`Chevron`, `Graticule`, `Highlights`, `PlayOnce`). The reference below describes the retired library.

All reusable UI components were in `components/ui/`. Import them from the barrel export:

```typescript
import { Button, Card, Badge, Timeline, ProgressBar } from '@/components/ui';
```

### Button Component

**File:** `components/ui/Button.tsx`

```tsx
// Variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// With Icon
<Button
  icon={<span className="material-symbols-outlined">arrow_forward</span>}
  iconPosition="right"
>
  Next Step
</Button>

// Disabled
<Button disabled>Disabled</Button>
```

**Features:**
- Glow effect on hover
- Scale animation (1.03x hover, 0.98x active)
- Automatic focus ring with glow
- GPU-accelerated transitions

### Card Component

**File:** `components/ui/Card.tsx`

```tsx
// Variants
<Card variant="default">Static content</Card>
<Card variant="interactive">Clickable card with hover lift</Card>
<Card variant="featured">Highlighted card with glow</Card>
<Card variant="glass">Translucent glass effect</Card>

// Padding
<Card padding="none">No padding</Card>
<Card padding="sm">16px padding</Card>
<Card padding="md">20-24px padding (default)</Card>
<Card padding="lg">24-32px padding</Card>

// Subcomponents
<Card variant="interactive">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    Main content here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Badge Component

**File:** `components/ui/Badge.tsx`

```tsx
// Variants
<Badge variant="default">Default</Badge>
<Badge variant="active">Active</Badge>       // Green
<Badge variant="completed">Completed</Badge> // Blue
<Badge variant="paused">Paused</Badge>       // Yellow
<Badge variant="flagship">Flagship</Badge>   // Primary blue
<Badge variant="outline">Outline</Badge>     // Border only

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium (default)</Badge>

// With pulse animation
<Badge variant="active" pulse>Live</Badge>
```

### Timeline Component

**File:** `components/ui/Timeline.tsx`

```tsx
import { Timeline, ProgressBar, MilestoneBar } from '@/components/ui';

// Step Timeline
const steps = [
  { id: '1', title: 'Research', status: 'completed' },
  { id: '2', title: 'Development', status: 'current' },
  { id: '3', title: 'Testing', status: 'upcoming' },
];

<Timeline steps={steps} orientation="horizontal" />
<Timeline steps={steps} orientation="vertical" />

// Simple Progress Bar
<ProgressBar value={75} />
<ProgressBar value={75} showLabel />
<ProgressBar value={75} size="sm" />

// Milestone Bar
const milestones = [
  { id: '1', label: 'Q1', position: 25 },
  { id: '2', label: 'Q2', position: 50 },
  { id: '3', label: 'Q3', position: 75 },
  { id: '4', label: 'Launch', position: 100 },
];

<MilestoneBar milestones={milestones} currentProgress={60} />
```

### Icon Component

Uses Google Material Symbols. Find icons at [fonts.google.com/icons](https://fonts.google.com/icons).

```tsx
<span className="material-symbols-outlined">icon_name</span>

// With size
<span className="material-symbols-outlined text-xl">memory</span>
<span className="material-symbols-outlined text-2xl">rocket_launch</span>
```

---

## Styling Guide

All live pages use one design system, the Apple system:

| Scope | Reference | Theme |
|-------|-----------|-------|
| All live routes (`app/(apple)/`) | `DESIGN.md`; locked: `docs/design/sidekick.DESIGN.md`, `docs/design/brain.DESIGN.md` | Apple system — CSS modules on `--r2-*` tokens |
| Archived: old `/` landing, smartphone, smart reading | `docs/design/landing.DESIGN.md`, `smartphone.DESIGN.md`, `glasses.DESIGN.md` | History only |

**Signal-red (`#d8412f`, `--r2-trigger`)** is a mark only, per `DESIGN.md` §6: the test point,
anchor dot, and (darker `#b3321f`) the CTA hover. Never body text, never decoration.

### Tailwind tokens (retired)

> The Tailwind sections below (tokens, shadows, animations, typography, patterns) describe the archived industrial-studio pages. No live route uses Tailwind.


| Token | Tailwind Class | Usage |
|-------|----------------|-------|
| Primary accent | `text-signal`, `bg-signal` | Callouts, active states |
| Background | `bg-studio` | Page sweep gradient base |
| Surface | `bg-surface` | Cards, panels |
| Border | `border-hairline` | Subtle dividers |

### Custom Shadows

```typescript
shadow-glow-sm   // Subtle glow: 0 0 15px primary at 15%
shadow-glow      // Medium glow: 0 0 20px primary at 20%
shadow-glow-lg   // Strong glow: 0 0 30px primary at 25%
shadow-lift      // Card hover: 0 8px 30px black at 12%
```

### Animations

```typescript
animate-subtle-pulse  // Gentle opacity pulse for indicators
animate-float         // Floating effect for hero elements
animate-fade-in-up    // Entrance animation
animate-slide-in-right // Mobile menu animation
```

### Typography

| Element | Classes |
|---------|---------|
| Page Title | `text-4xl md:text-5xl lg:text-6xl font-bold` |
| Section Title | `text-2xl md:text-3xl font-bold` |
| Card Title | `text-lg font-semibold` |
| Body Text | `text-base text-slate-600 dark:text-slate-400` |
| Muted Text | `text-sm text-text-muted-light dark:text-text-muted-dark` |
| Gradient Text | `text-gradient` (primary to blue gradient) |

### Common Patterns

**Section Container:**
```html
<section className="w-full py-16 md:py-20 px-4 md:px-10 bg-white dark:bg-background-dark">
  <div className="max-w-7xl mx-auto">
    <!-- content -->
  </div>
</section>
```

**Alternating Section Backgrounds:**
```html
<!-- Even sections -->
<section className="bg-white dark:bg-background-dark">

<!-- Odd sections -->
<section className="bg-gray-50 dark:bg-[#0d131a]">
```

**Background Glow Decoration:**
```html
<div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />
```

---

## Deployment

### Automatic (Vercel)

Production deploys from the `deployment` branch only (`ignoreCommand` in `vercel.json`). See [`DEPLOYMENT.md`](./DEPLOYMENT.md).

### Manual Deployment

```bash
./run.sh build    # preflight + static export
```

The static files are in the `out/` directory. Upload to any static host.

### Pre-deploy checklist
- [ ] All images load correctly
- [ ] Contact form works (test with Formspree)
- [ ] All links work
- [ ] Mobile responsive design works
- [ ] No console errors
- [ ] Animations work smoothly
- [ ] Dark mode displays correctly

---

## Troubleshooting

### "Module not found" Error

Run `npm install` to reinstall dependencies.

### Images Not Loading

- Check the file path starts with `/images/...`
- Verify the file exists in `public/assets/`
- File names are case-sensitive

### Contact Form Not Working

1. Check Formspree endpoint in `lib/data/siteConfig.ts`
2. Verify the endpoint URL format: `https://formspree.io/f/FORM_ID`
3. Test the form on the Formspree dashboard

### Build Errors

1. Run `npm run lint` to check for code issues
2. Check TypeScript errors in the terminal
3. Verify all imports are correct

### Styles Not Applying

1. Check class names for typos
2. Check the CSS module import and the `--r2-*` token names in `app/(apple)/_system/tokens/worlds.css`
3. Run `npm run dev` to rebuild styles
4. Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

### Animations Not Working

1. Check if `prefers-reduced-motion` is enabled in your OS
2. Check stage playback in `app/(apple)/projects/_hero/useStagePlayback.ts`
3. Check the scroll hooks in `app/(apple)/_system/tokens/scroll.ts`

---

## Getting Help

- Check [Next.js Documentation](https://nextjs.org/docs)
- Check [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- Check [Material Symbols](https://fonts.google.com/icons) for icon names
- Documentation hub: [`docs/README.md`](./README.md)
- Design system: [`DESIGN.md`](../DESIGN.md) + [`docs/design/`](./design/)
- Review existing code patterns in the codebase
