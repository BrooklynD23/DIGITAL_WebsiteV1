# Maintainer Guide

This guide explains how to update and maintain the DIGITAL website.

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Updating Team Members](#updating-team-members)
3. [Updating Projects](#updating-projects)
4. [Updating Site Configuration](#updating-site-configuration)
5. [Replacing Placeholder Images](#replacing-placeholder-images)
6. [Adding New Pages](#adding-new-pages)
7. [Styling Guide](#styling-guide)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## Quick Reference

| Task | File to Edit |
|------|--------------|
| Add/edit team members | `lib/data/team.ts` |
| Add/edit projects | `lib/data/projects.ts` |
| Update contact info | `lib/data/siteConfig.ts` |
| Change social links | `lib/data/siteConfig.ts` |
| Update stats | `lib/data/siteConfig.ts` |
| Replace images | `public/images/` |
| Edit page content | `app/[page]/page.tsx` |

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
  meetingTime: 'Fridays, 4–6 PM',
  location: 'Building 9, Room 123',
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
  activeMembers: '45+',
  prototypes: '12',
  linesOfCode: '50K+',
  sponsors: '5',
},
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

   export const metadata: Metadata = {
     title: 'Page Title - DIGITAL',
     description: 'Page description for SEO',
   };

   export default function NewPage() {
     return (
       <main className="flex-grow">
         {/* Your content here */}
       </main>
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

export default function Layout({ children }) {
  return children;
}
```

---

## Styling Guide

### Colors

| Color | Tailwind Class | Hex |
|-------|----------------|-----|
| Primary (Blue) | `bg-primary`, `text-primary` | #0d7ff2 |
| Background (Dark) | `bg-background-dark` | #101922 |
| Surface (Dark) | `bg-surface-dark` | #1b232d |
| Border | `border-surface-border` | #283039 |

### Typography

| Element | Classes |
|---------|---------|
| Page Title | `text-4xl md:text-5xl lg:text-6xl font-bold` |
| Section Title | `text-3xl md:text-4xl font-bold` |
| Card Title | `text-xl font-bold` |
| Body Text | `text-base text-slate-600 dark:text-slate-400` |
| Small Text | `text-sm text-slate-500` |

### Common Patterns

**Card:**
```html
<div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-surface-border p-6">
  <!-- content -->
</div>
```

**Button (Primary):**
```html
<button className="bg-primary hover:bg-blue-600 text-white font-bold px-6 h-12 rounded-lg transition-colors">
  Button Text
</button>
```

**Button (Secondary):**
```html
<button className="bg-transparent border border-gray-300 dark:border-gray-700 text-slate-900 dark:text-white font-bold px-6 h-12 rounded-lg hover:border-primary transition-colors">
  Button Text
</button>
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

---

## Getting Help

- Check [Next.js Documentation](https://nextjs.org/docs)
- Check [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- Review existing code patterns in the codebase
