# Maintainer Guide

This guide explains how to update and maintain the DIGITAL website.

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Updating Team Members](#updating-team-members)
3. [Updating Projects](#updating-projects)
4. [Updating Site Configuration](#updating-site-configuration)
5. [Updating Get Involved Options](#updating-get-involved-options)
6. [Replacing Placeholder Images](#replacing-placeholder-images)
7. [Adding New Pages](#adding-new-pages)
8. [UI Components Guide](#ui-components-guide)
9. [Styling Guide](#styling-guide)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## Quick Reference

| Task | File to Edit |
|------|--------------|
| Add/edit team members | `lib/data/team.ts` |
| Add/edit projects | `lib/data/projects.ts` |
| Update contact info | `lib/data/siteConfig.ts` |
| Change social links | `lib/data/siteConfig.ts` |
| Update stats | `lib/data/siteConfig.ts` |
| Update sponsors | `lib/data/siteConfig.ts` |
| Add/edit involvement options | `lib/data/involvement.ts` |
| Replace images | `public/images/` |
| Edit page content | `app/[page]/page.tsx` |
| Modify UI components | `components/ui/` |
| Update navigation | `components/layout/Navbar.tsx` |

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

**File:** `lib/data/projects.ts`

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
  email: 'digital@cpp.edu',
  meetingTime: 'Thursdays @ 6:00 PM',
  location: 'Building 17, Room 1635',
  campus: 'Cal Poly Pomona',
},
```

### Social Links

```typescript
social: {
  linkedin: 'https://linkedin.com/company/digital-cpp',
  instagram: 'https://instagram.com/digital_cpp',
  discord: 'https://discord.gg/your-invite-code',
  github: 'https://github.com/digital-cpp',
},
```

### Stats (Homepage)

```typescript
stats: {
  activeMembers: '120+',
  prototypes: '15',
  linesOfCode: '50k+',
  sponsors: '2',
},
```

### Sponsors

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

### Image Locations

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

1. Add your image to the appropriate folder in `public/images/`
2. Update the path in the data file:
   - Team: `lib/data/team.ts` → `image` field
   - Projects: `lib/data/projects.ts` → `image` field
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

1. Create a new folder in `app/`:
   ```
   app/
   └── new-page/
       └── page.tsx
   ```

2. Create the page component:
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

3. Add navigation link in `components/layout/Navbar.tsx`:
   ```typescript
   const navLinks = [
     // ... existing links
     { href: '/new-page', label: 'New Page' },
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

All reusable UI components are in `components/ui/`. Import them from the barrel export:

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

### Design System: "Refined Futurism"

The UI follows Apple-inspired restraint with subtle futuristic accents:
- Clean layouts with generous whitespace
- Subtle glow effects only on interactive elements
- Smooth 300ms transitions
- Scale animations on hover (1.02-1.03x)

### Colors

| Token | Tailwind Class | Usage |
|-------|----------------|-------|
| Primary | `bg-primary`, `text-primary` | Buttons, links, accents |
| Primary Subtle | `bg-primary-subtle` | Hover backgrounds |
| Primary Glow | `shadow-glow` | Hover effects |
| Background Light | `bg-background-light` | Light mode background |
| Background Dark | `bg-background-dark` | Dark mode background |
| Surface Dark | `bg-surface-dark` | Cards in dark mode |
| Border Light | `border-surface-border-light` | Borders in light mode |
| Border Dark | `border-surface-border` | Borders in dark mode |

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

If connected to GitHub, Vercel automatically deploys on every push to `main`.

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. The static files are in the `out/` directory

3. Upload to any static hosting (Netlify, GitHub Pages, etc.)

### Environment Check

Before deploying, verify:
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
- Verify the file exists in `public/images/`
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
2. Verify Tailwind classes are valid
3. Run `npm run dev` to rebuild styles
4. Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

### Animations Not Working

1. Check if `prefers-reduced-motion` is enabled in your OS
2. Verify the animation classes are in `tailwind.config.ts`
3. Ensure `ease-smooth` timing function is defined

---

## Getting Help

- Check [Next.js Documentation](https://nextjs.org/docs)
- Check [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- Check [Material Symbols](https://fonts.google.com/icons) for icon names
- Review the design document: `docs/plans/2025-01-29-ui-revamp-design.md`
- Review existing code patterns in the codebase
