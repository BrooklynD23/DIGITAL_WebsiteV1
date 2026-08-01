# Pre-Merge Audit — `feature/brand-story-gsap`

**Date:** 2026-07-30  
**Orchestrator:** GPT-5.6 Sol Medium  
**Subagents:** [Security branch audit](75efd712-9d88-47b0-bcca-d61e91671c40) · [Bugbot branch audit](0c2605af-3b39-4a70-9945-26640577a128) (Composer 2.5)  
**Scope:** Branch changes vs `main` — **audit only, no fixes applied**

---

## Executive summary

| Review | Verdict | Findings |
|--------|---------|----------|
| [Security branch audit](75efd712-9d88-47b0-bcca-d61e91671c40) | Pass | 0 medium+ security issues |
| [Bugbot branch audit](0c2605af-3b39-4a70-9945-26640577a128) | Action required | 2 high, 6 medium, 1 low |

The branch is structurally sound for a static-export marketing site. Security posture is appropriate (report-only CSP, no API routes, whitelisted contact topics). Bugbot flagged **static-export HTML gaps, routing regressions, and a11y/motion issues** that should be triaged before or immediately after merge.

---

## Security Review

**Verdict:** No medium, high, or critical security issues in production paths.

### Validated

- CSP in `vercel.json` is report-only by design; allowlists match Vercel Analytics, Speed Insights, and Formspree
- GSAP, Lenis, Three/R3F are bundled — no new runtime CDN script loads
- Contact `?type=` maps through `resolveContactTopic()` whitelist; not rendered to DOM
- No API routes, server actions, or client-exposed secrets in changed paths
- JSON-LD uses `JSON.stringify` over static `siteConfig` fields
- `/review` is `noindex` and omitted from sitemap

### Pre-ship hygiene (not rated as vulnerabilities)

| Item | Notes |
|------|-------|
| Replace Formspree placeholder | `siteConfig.formspreeEndpoint` still `YOUR_FORM_ID` |
| Promote CSP to enforcing | After console validation of report-only phase |
| Set `NEXT_PUBLIC_SITE_URL` in Vercel | Match production domain |
| Run `npm audit` / `./run.sh check` | CI gate before release |
| Optional: `Disallow: /review` in robots | Harden internal hub discoverability |

---

## Bugbot

| Severity | Location | Finding |
|----------|----------|---------|
| High | `app/projects/page.tsx:179-182` | `comingSoon` cards still link to `/projects/${slug}` but `[slug]` catch-all was removed — placeholder projects 404 |
| High | `app/projects/smart-reading/page.tsx:10-12` | `dynamic(..., { ssr: false })` ships empty static HTML until client JS — blank page for crawlers, previews, no-JS users |
| Medium | `app/phone-v2/page.tsx:8-13` | Legacy `/phone-v2` and `/experiments/glasses` redirects are client-only `useEffect` — blank page without JS or before hydration |
| Medium | `components/layout/Footer.tsx:27-28` | Global footer (Privacy/Terms/Cookies) suppressed on `/` via `isImmersiveRoute`; `HomeLanding` footer omits legal links |
| Medium | `app/projects/smart-reading/page.tsx:1-17` | No `layout.tsx` metadata export — shared links fall back to generic site title/description (unlike PhoneV2 route) |
| Medium | `app/review/page.tsx:36` | Nested `<main>` inside layout's `#main-content` — duplicate landmark, skip-link confusion |
| Medium | `components/experiments/glasses/FloatingDecor.tsx:75-80` | Infinite `y`/`rotate` loops with no `prefers-reduced-motion` guard |
| Medium | `components/experiments/glasses/InfoPanels.tsx:17-23` | `PANEL_CENTERS` hardcodes `TOTAL = 4` while panels use `sections.length` — snap/nav drift if content changes |
| Low | `.claude/settings.local.json:24-26` | Machine-specific absolute paths committed — won't resolve for other contributors |

---

## Recommended merge order

1. **Before merge (high):** Disable links on `comingSoon` project cards; add static fallback shell + metadata for Smart Reading route
2. **Soon after merge (medium):** Legal links in home footer; server/meta redirects for legacy URLs; Smart Reading `layout.tsx` metadata; reduced-motion guard on `FloatingDecor`; derive `PANEL_CENTERS` from `sections.length`; fix nested `<main>` on `/review`
3. **Launch hygiene:** Formspree endpoint, CSP enforcement, `./run.sh check` green on CI; strip or gitignore machine-local Claude paths

---

## Documentation changes (commit #0046)

- Added [`docs/README.md`](./README.md) — documentation hub
- Archived superseded plans/specs/handoffs to [`docs/archive/`](./archive/)
- Rewrote root [`README.md`](../README.md) for current stack and routes
- Updated [`MAINTAINER_GUIDE.md`](./MAINTAINER_GUIDE.md), [`KNOWN_ISSUES.md`](./troubleshooting/KNOWN_ISSUES.md), [`IMAGE_REPLACEMENT_GUIDE.md`](./IMAGE_REPLACEMENT_GUIDE.md)

---

*This audit does not include uncommitted working-tree changes on the branch. Re-run Bugbot after WIP lands.*
