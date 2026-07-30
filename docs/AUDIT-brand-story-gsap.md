# Pre-Merge Audit — `feature/brand-story-gsap`

**Date:** 2026-07-30  
**Orchestrator:** GPT-5.6 Sol Medium  
**Subagents:** Composer 2.5 (Bugbot + Security Review)  
**Scope:** Branch changes vs `main` — **audit only, no fixes applied**

---

## Executive summary

| Review | Verdict | Findings |
|--------|---------|----------|
| Security Review | Pass | 0 medium+ security issues |
| Bugbot | Action required | 2 high, 6 medium, 1 low |

The branch is structurally sound for a static-export marketing site. Security posture is appropriate (report-only CSP, no API routes, whitelisted contact topics). Bugbot flagged **routing and static-export UX gaps** that should be triaged before or immediately after merge.

---

## Security Review (Composer 2.5)

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

## Bugbot (Composer 2.5)

| Severity | Location | Finding |
|----------|----------|---------|
| High | `app/contact/page.tsx:317-322` | Contact route wraps `useSearchParams()` form in `Suspense` with `fallback={null}` — static export may ship empty contact HTML until hydration |
| High | `app/projects/page.tsx:179-183` | `comingSoon` projects still link to `/projects/${slug}` but `[slug]` catch-all was removed — 404 for placeholder projects |
| Medium | `app/phone-v2/page.tsx:8-13` | Legacy redirects use client-only `router.replace()` with no static/meta redirect — blank page without JS |
| Medium | `app/review/page.tsx:36` | Nested `<main>` inside layout's `#main-content` — duplicate landmark |
| Medium | `components/experiments/glasses/GlassesExperience.tsx:114-126` | Lenis disabled for reduced motion but scroll-scrubbed transforms still run |
| Medium | `components/experiments/glasses/FloatingDecor.tsx:74-81` | Infinite animation loops without `prefers-reduced-motion` guard |
| Medium | `components/home/home-landing.css:14` | `scroll-behavior: smooth` not disabled in reduced-motion media query |
| Medium | `components/home/HomeLanding.tsx:100-120` | Full-screen loader has no skip/dismiss — 1.9s minimum wait |
| Medium | `lib/data/contactTopics.ts:15-18` | `project-team` maps to `join` topic instead of `project` |
| Low | `components/experiments/glasses/InfoPanels.tsx:17-23` | `PANEL_CENTERS` hardcodes `TOTAL = 4` — drifts if sections change |

---

## Documentation changes (this commit)

- Added [`docs/README.md`](./README.md) — documentation hub
- Archived superseded plans/specs/handoffs to [`docs/archive/`](./archive/)
- Rewrote root [`README.md`](../README.md) for current stack and routes
- Updated [`MAINTAINER_GUIDE.md`](./MAINTAINER_GUIDE.md), [`KNOWN_ISSUES.md`](./troubleshooting/KNOWN_ISSUES.md), [`IMAGE_REPLACEMENT_GUIDE.md`](./IMAGE_REPLACEMENT_GUIDE.md)

---

## Recommended merge order

1. **Before merge (high):** Fix `comingSoon` project links; validate contact page static HTML
2. **Soon after merge (medium):** Reduced-motion gaps on glasses/home; contact topic mapping; legacy redirect hardening
3. **Launch hygiene:** Formspree endpoint, CSP enforcement, `./run.sh check` green on CI

---

*This audit does not include uncommitted working-tree changes on the branch. Re-run Bugbot after WIP lands.*
