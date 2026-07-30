# Image Replacement Guide

> **Note (2026-07):** The homepage now uses the immersive `HomeLanding` component with
> assets under `public/assets/landing/`. Sections below referencing `app/page.tsx` hero
> placeholders are **legacy** from the pre-overhaul layout. See `lib/data/homeLanding.ts`
> and `docs/design/landing.DESIGN.md` for current homepage imagery.

This document provides a complete audit of all placeholder images in the codebase and step-by-step instructions for replacing them with PNG images.

## 📋 Audit Summary

**Total Placeholder Images Found: 27 references**

### Breakdown by Category:
- **General Images**: 3 unique images (used in 3 locations)
- **Project Images**: 1 unique image (used in 7 locations)
- **Team Images**: 2 unique images (used in 17 locations)

---

## 📁 Current Placeholder Structure

```
public/images/placeholders/
├── general/
│   ├── campus-aerial.svg      (Contact page)
│   ├── hero-device.svg        (Homepage hero)
│   └── lab-session.svg        (About page hero)
├── projects/
│   └── modular-phone.svg      (Used for all projects)
└── team/
    ├── avatar-placeholder.svg (All team members)
    └── group-photo.svg        (Team page hero)
```

---

## 🔍 Detailed Image Inventory

### 1. General Images (`/images/placeholders/general/`)

#### `hero-device.svg`
- **Location**: Homepage hero section
- **File**: `app/page.tsx` (line 69)
- **Usage**: Main hero image on homepage
- **Recommended Size**: 1200×900px (4:3 aspect ratio)
- **Description**: Exploded view of advanced smartphone components and circuitry

#### `lab-session.svg`
- **Location**: About page hero section
- **File**: `app/about/page.tsx` (line 119)
- **Usage**: Hero image showing lab work
- **Recommended Size**: 1200×900px (4:3 aspect ratio)
- **Description**: Close up of a student soldering a circuit board in an engineering lab

#### `campus-aerial.svg`
- **Location**: Contact page map section
- **File**: `app/contact/page.tsx` (line 310)
- **Usage**: Campus aerial view/map placeholder
- **Recommended Size**: 1200×600px (2:1 aspect ratio)
- **Description**: Aerial view of Cal Poly Pomona campus

---

### 2. Project Images (`/images/placeholders/projects/`)

#### `modular-phone.svg`
- **Locations**: Multiple project references
- **Files**:
  - `lib/data/projects.ts` (lines 13, 71, 83, 95, 107, 119) - 6 project entries
  - `app/page.tsx` (line 176) - Featured project fallback
  - `app/projects/page.tsx` (line 73) - Flagship project hero
  - `app/about/page.tsx` (line 201) - Flagship project showcase
- **Usage**: Currently used for ALL projects (needs individual images)
- **Recommended Size**: 1200×900px (4:3 aspect ratio)
- **Description**: Modular smartphone project image

**⚠️ Note**: All 6 projects currently use the same placeholder. You'll need individual images for:
1. `modular-smartphone` (flagship)
2. `embedded-systems`
3. `robotics-initiative`
4. `software-hatchery`
5. `smart-mirror`
6. `drone-swarm`

---

### 3. Team Images (`/images/placeholders/team/`)

#### `avatar-placeholder.svg`
- **Locations**: All team member profiles
- **File**: `lib/data/team.ts` (lines 11, 23, 35, 46, 58, 66, 74, 82, 91, 99, 107, 116, 124)
- **Usage**: Individual team member avatars (13 members)
- **Recommended Size**: 400×400px (1:1 square)
- **Description**: Default avatar for team members

**Team Members Needing Individual Photos**:
1. Alex Chen (President)
2. Sarah Kim (VP of Engineering)
3. Marcus Johnson (Treasurer)
4. Emily Rodriguez (Secretary)
5. David Park (Hardware Lead)
6. Jessica Lee (PCB Designer)
7. Ryan Nguyen (Hardware Engineer)
8. Amanda Torres (Hardware Engineer)
9. Kevin Wang (Software Lead)
10. Sophia Martinez (Full-Stack Developer)
11. James Wilson (Embedded Developer)
12. Olivia Brown (Outreach Lead)
13. Ethan Davis (Graphic Designer)

#### `group-photo.svg`
- **Location**: Team page hero section
- **File**: `app/team/page.tsx` (line 78)
- **Usage**: Team group photo hero image
- **Recommended Size**: 1200×800px (3:2 aspect ratio)
- **Description**: Group of diverse students working together

---

## 📝 Step-by-Step Replacement Instructions

### Step 1: Prepare Your PNG Images

1. **Optimize all images** before adding them:
   - Use tools like [TinyPNG](https://tinypng.com/) or [ImageOptim](https://imageoptim.com/)
   - Aim for file sizes under 500KB for large images, under 100KB for avatars
   - Maintain aspect ratios as specified above

2. **Naming Convention**:
   - Use kebab-case (lowercase with hyphens)
   - Be descriptive but concise
   - Examples:
     - `modular-smartphone.png`
     - `alex-chen.png`
     - `group-photo.png`

### Step 2: Add Images to Public Folder

Create the following structure (if it doesn't exist):

```
public/images/
├── general/
│   ├── hero-device.png
│   ├── lab-session.png
│   └── campus-aerial.png
├── projects/
│   ├── modular-smartphone.png
│   ├── embedded-systems.png
│   ├── robotics-initiative.png
│   ├── software-hatchery.png
│   ├── smart-mirror.png
│   └── drone-swarm.png
└── team/
    ├── group-photo.png
    ├── alex-chen.png
    ├── sarah-kim.png
    ├── marcus-johnson.png
    ├── emily-rodriguez.png
    ├── david-park.png
    ├── jessica-lee.png
    ├── ryan-nguyen.png
    ├── amanda-torres.png
    ├── kevin-wang.png
    ├── sophia-martinez.png
    ├── james-wilson.png
    ├── olivia-brown.png
    └── ethan-davis.png
```

### Step 3: Update Code References

#### A. Update General Images

**File: `app/page.tsx`**
```typescript
// Line 69 - Change from:
src="/images/placeholders/general/hero-device.svg"
// To:
src="/images/general/hero-device.png"
```

**File: `app/about/page.tsx`**
```typescript
// Line 119 - Change from:
src="/images/placeholders/general/lab-session.svg"
// To:
src="/images/general/lab-session.png"
```

**File: `app/contact/page.tsx`**
```typescript
// Line 310 - Change from:
src="/images/placeholders/general/campus-aerial.svg"
// To:
src="/images/general/campus-aerial.png"
```

#### B. Update Project Images

**File: `lib/data/projects.ts`**

Replace each project's `image` field:

```typescript
// Modular Smartphone (line 13)
image: '/images/projects/modular-smartphone.png',

// Embedded Systems (line 71)
image: '/images/projects/embedded-systems.png',

// Robotics Initiative (line 83)
image: '/images/projects/robotics-initiative.png',

// Software Hatchery (line 95)
image: '/images/projects/software-hatchery.png',

// Smart Mirror (line 107)
image: '/images/projects/smart-mirror.png',

// Drone Swarm (line 119)
image: '/images/projects/drone-swarm.png',
```

**File: `app/page.tsx`**
```typescript
// Line 176 - Change fallback from:
src={featuredProjects[0]?.image || '/images/placeholders/projects/modular-phone.svg'}
// To:
src={featuredProjects[0]?.image || '/images/projects/modular-smartphone.png'}
```

**File: `app/projects/page.tsx`**
```typescript
// Line 73 - Change fallback from:
src={flagship?.image || '/images/placeholders/projects/modular-phone.svg'}
// To:
src={flagship?.image || '/images/projects/modular-smartphone.png'}
```

**File: `app/about/page.tsx`**
```typescript
// Line 201 - Change from:
src="/images/placeholders/projects/modular-phone.svg"
// To:
src="/images/projects/modular-smartphone.png"
```

#### C. Update Team Images

**File: `lib/data/team.ts`**

Replace each team member's `image` field:

```typescript
// Alex Chen (line 11)
image: '/images/team/alex-chen.png',

// Sarah Kim (line 23)
image: '/images/team/sarah-kim.png',

// Marcus Johnson (line 35)
image: '/images/team/marcus-johnson.png',

// Emily Rodriguez (line 46)
image: '/images/team/emily-rodriguez.png',

// David Park (line 58)
image: '/images/team/david-park.png',

// Jessica Lee (line 66)
image: '/images/team/jessica-lee.png',

// Ryan Nguyen (line 74)
image: '/images/team/ryan-nguyen.png',

// Amanda Torres (line 82)
image: '/images/team/amanda-torres.png',

// Kevin Wang (line 91)
image: '/images/team/kevin-wang.png',

// Sophia Martinez (line 99)
image: '/images/team/sophia-martinez.png',

// James Wilson (line 107)
image: '/images/team/james-wilson.png',

// Olivia Brown (line 116)
image: '/images/team/olivia-brown.png',

// Ethan Davis (line 124)
image: '/images/team/ethan-davis.png',
```

**File: `app/team/page.tsx`**
```typescript
// Line 78 - Change from:
src="/images/placeholders/team/group-photo.svg"
// To:
src="/images/team/group-photo.png"
```

### Step 4: Verify Changes

1. **Build the project** to ensure no errors:
   ```bash
   npm run build
   ```

2. **Test locally**:
   ```bash
   npm run dev
   ```

3. **Check each page**:
   - ✅ Homepage (`/`) - Hero device image
   - ✅ About page (`/about`) - Lab session image
   - ✅ Contact page (`/contact`) - Campus aerial image
   - ✅ Projects page (`/projects`) - All project images
   - ✅ Team page (`/team`) - Group photo and all member avatars

### Step 5: Clean Up (Optional)

After verifying everything works, you can optionally remove the placeholder SVG files:

```
public/images/placeholders/  (can be deleted if no longer needed)
```

**⚠️ Warning**: Only delete placeholders after confirming all PNG images are working correctly!

---

## 🎨 Image Requirements Summary

| Image Type | Dimensions | Aspect Ratio | Max File Size | Format |
|------------|------------|--------------|---------------|--------|
| Hero Images | 1200×900px | 4:3 | 500KB | PNG |
| Project Images | 1200×900px | 4:3 | 500KB | PNG |
| Team Avatars | 400×400px | 1:1 | 100KB | PNG |
| Group Photo | 1200×800px | 3:2 | 500KB | PNG |
| Campus Aerial | 1200×600px | 2:1 | 400KB | PNG |

---

## 🔄 Quick Reference: Find & Replace

If you want to do a bulk find-and-replace, here are the patterns:

### Find & Replace Patterns:

1. **General images**:
   - Find: `/images/placeholders/general/`
   - Replace: `/images/general/`

2. **Project images**:
   - Find: `/images/placeholders/projects/`
   - Replace: `/images/projects/`
   - Find: `modular-phone.svg`
   - Replace: `modular-smartphone.png` (for flagship project)

3. **Team images**:
   - Find: `/images/placeholders/team/`
   - Replace: `/images/team/`
   - Find: `avatar-placeholder.svg`
   - Replace: Individual member names (e.g., `alex-chen.png`)

---

## 📌 Notes

- **Next.js Image Optimization**: The `next/image` component will automatically optimize images, but starting with optimized PNGs is still recommended.

- **Dark Mode**: Ensure images look good in both light and dark themes. Consider using images with transparent backgrounds or neutral backgrounds.

- **Accessibility**: Make sure all `alt` attributes are descriptive and accurate for the new images.

- **Performance**: Consider using WebP format for better compression, but PNG is more universally supported for static exports.

---

## ✅ Checklist

- [ ] Prepare all PNG images with correct dimensions
- [ ] Optimize images for web (TinyPNG/ImageOptim)
- [ ] Add images to `public/images/` folder structure
- [ ] Update `app/page.tsx` (hero-device)
- [ ] Update `app/about/page.tsx` (lab-session, modular-phone)
- [ ] Update `app/contact/page.tsx` (campus-aerial)
- [ ] Update `app/projects/page.tsx` (modular-phone fallback)
- [ ] Update `lib/data/projects.ts` (all 6 project images)
- [ ] Update `lib/data/team.ts` (all 13 team member images)
- [ ] Update `app/team/page.tsx` (group-photo)
- [ ] Test build (`npm run build`)
- [ ] Test locally (`npm run dev`)
- [ ] Verify all images display correctly
- [ ] (Optional) Remove placeholder SVG files

---

**Last Updated**: 2025-01-29
**Total Images to Replace**: 22 unique images (27 references)

