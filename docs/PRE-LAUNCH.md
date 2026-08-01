# Pre-Launch Checklist

Production configuration that **cannot be completed inside the repository**. Each item needs a
production value, dashboard access, or a deployed validation pass. Work top to bottom before
announcing the site.

Source: pre-merge audit [`AUDIT-brand-story-gsap.md`](./AUDIT-brand-story-gsap.md) — "Pre-ship
hygiene". None of these were rated as vulnerabilities; they are launch blockers, not defects.

---

## 1. Formspree endpoint — blocks the contact form

`lib/data/siteConfig.ts` ships the placeholder:

```ts
formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
```

Until it is replaced, `/contact` **refuses to submit** and tells visitors to email directly
(`app/contact/page.tsx`, `status === 'unconfigured'`). This is deliberate — a placeholder POST
would 404 and read to the user as a transient network glitch.

- [ ] Create the form at [formspree.io](https://formspree.io) on the club account
- [ ] Replace `YOUR_FORM_ID` with the real ID
- [ ] Submit a live test and confirm the message arrives
- [ ] Confirm the `unconfigured` notice no longer appears

## 2. `NEXT_PUBLIC_SITE_URL` — affects canonical URLs, sitemap, JSON-LD

Falls back to `siteConfig.url` when unset. It feeds `metadataBase` (`app/layout.tsx`),
`app/sitemap.ts`, and `app/robots.ts`, so a wrong value ships wrong canonical URLs.

- [ ] Set it in the Vercel project's environment variables to the production origin, no trailing
      slash (e.g. `https://example.org`)
- [ ] Redeploy and confirm `/sitemap.xml` and `/robots.txt` show the production origin

## 3. CSP — promote to enforcing **only after** validating report-only

`vercel.json` carries a deliberate guard comment. The header is `Content-Security-Policy-Report-Only`
by design and **must not** be promoted before a deployed validation pass — a branch cannot validate
a report-only phase that has never shipped.

Validate in the browser console on a production deploy, exercising **every** route, especially the
two immersive ones:

- [ ] `/` — home landing (GSAP, Lenis, next/font)
- [ ] `/projects/modular-smartphone` — PhoneV2 (inline SVG styles)
- [ ] `/projects/smart-reading` — R3F/three.js (WebGL, blob workers)
- [ ] `/contact` — Formspree `form-action` and `connect-src`
- [ ] Vercel Analytics + Speed Insights beacons on any route

Watch for violations against `script-src` (inline styles injected by Framer Motion),
`font-src` (Google Fonts), `connect-src` (analytics, Formspree), and `worker-src` / `blob:`
(three.js). Add any missing directive to the report-only policy first and re-validate.

Only once the console is clean across all of the above, make this one-line change in `vercel.json`
and remove the `_comment` guard:

```diff
-          "key": "Content-Security-Policy-Report-Only",
+          "key": "Content-Security-Policy",
```

- [ ] Zero violations observed across all routes above
- [ ] Header promoted and `_comment` guard removed
- [ ] Post-promotion smoke test — all three immersive routes still render

## 4. Dependency + preflight gates

- [ ] `npm audit` — triage anything moderate or above
- [ ] `./run.sh check` green (TypeScript strict + lint)
- [ ] `./run.sh build` produces a clean static export

## 5. Search-engine hygiene

- [x] `/review` is `noindex` (`app/review/page.tsx`) and excluded from `app/sitemap.ts`
- [x] `/review` disallowed in `app/robots.ts`
- [ ] Submit `/sitemap.xml` to Google Search Console once the domain is live

---

## Deliberately not done in-repo

| Item | Why |
|------|-----|
| Real Formspree ID | Needs the club account; no credential belongs in git |
| `NEXT_PUBLIC_SITE_URL` | Vercel dashboard setting, not a source value |
| CSP promotion | Requires a deployed report-only validation pass first |
