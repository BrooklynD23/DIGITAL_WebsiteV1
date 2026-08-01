# Audit Remediation Design — `feature/brand-story-gsap`

**Date:** 2026-07-31  
**Status:** Approved by the Head Designer  
**Source:** `docs/AUDIT-brand-story-gsap.md` and the remediation plan at
`/home/danny/.claude/plans/review-suggest-fixes-keen-treasure.md`

## Objective

Close every live pre-merge audit finding without changing either immersive route's approved
visual language. Preserve static export, route-local content ownership, reduced-motion behavior,
and the existing report-only CSP guard.

## Approved Changes

1. Give `/projects/smart-reading` route-specific metadata and a server-safe static shell sourced
   entirely from `GLASSES_CONTENT`. Use that shell as the client experience's loading fallback and
   verify its text and metadata are present in exported HTML.
2. Render `comingSoon` project cards as non-interactive articles while preserving their visual
   treatment and removing hover/focus affordances.
3. Delete the `/phone-v2` and `/experiments/glasses` legacy client redirects, then remove their
   review, immersive-route, and active-route documentation references.
4. Add Privacy, Terms, and Cookies links to the home landing's own footer. Store the labels and
   targets in `lib/data/homeLanding.ts` and retain the landing's existing footer tokens.
5. Remove the nested `<main>` landmark from `/review`; the root layout remains the sole main
   landmark and skip-link target.
6. Respect `prefers-reduced-motion` in Smart Reading's floating decor by disabling its looping
   transforms and hover spring.
7. Derive Smart Reading panel bands, centers, and navigation targets from
   `GLASSES_CONTENT.info.length` through one shared module.
8. Add a pre-launch checklist for production-only configuration. Keep CSP report-only, make the
   Formspree placeholder surface an explicit form error without sending a request, and disallow
   `/review` in robots metadata.
9. Keep `TODO.md`'s Dev Build / Version Control record aligned with the resulting branch history.

## Constraints

- No CSP promotion in this branch.
- Do not replace the Formspree placeholder or set the Vercel site URL in-repo.
- Do not modify `docs/archive/**`.
- Keep user-facing strings in `lib/data/**`.
- Preserve the approved Smart Reading and home-landing design systems.
- Do not retain legacy redirects; the approved behavior is deletion.

## Acceptance

- `./run.sh check` and `./run.sh build` succeed.
- Exported Smart Reading HTML includes `One word at a time.` plus route-specific title and Open
  Graph metadata.
- Export output contains neither legacy route and no links to either legacy URL.
- `/review` exports exactly one `<main>` landmark.
- A fifth Smart Reading info item requires no band or navigation-map code changes.
- Reduced-motion decor is static and has no hover spring.
- The placeholder contact endpoint produces a clear visible error without a network request.

