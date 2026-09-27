# 06 — Test Matrix

There is **no test runner in this repository** — no test files, no browser automation in
`package.json`. Verification is therefore: the repo's own gates (`tsc`, lint, production build,
`./run.sh check`), plus the manual matrix below, plus Playwright-driven screenshots using the
pre-installed Chromium (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`) where a check is visual.

**Baseline first.** Batch 0 records the output of `./run.sh check` on an untouched tree so that
any pre-existing failure is reported separately from introduced ones.

## 1. Build, type, and lint gates

| Check | Command | Gate |
|---|---|---|
| Install | `npm ci` | exit 0 |
| Vercel schema | `node scripts/validate-vercel-json.mjs` | exit 0 — **runs first in CI**, and `vercel.json` is being edited |
| Types | `npx tsc --noEmit` | 0 errors |
| Lint | `npm run lint` | no new warnings vs baseline |
| Preflight | `./run.sh check` | green, **with `/community` added to `run.sh:109-119`** |
| Production export | `npm run build` (`NODE_ENV=production`) | exit 0; `out/` contains every route incl. `out/community/index.html` |
| Static output review | inspect exported HTML | no `CursorProvider` markup in any server-rendered file; no third-party iframe in the initial HTML of any route |

## 2. Route checks

Every route: renders, correct `<h1>` (exactly one), heading order sequential, `metadata` present,
no console errors, no horizontal scroll.

| Route | Additional |
|---|---|
| `/` | Pixel-comparable to pre-change except: focus rings now visible, nav present below 640px, no grain over `<header>`/`<footer>`. Loader timing unchanged |
| `/projects/modular-smartphone` | Entry sequence per §7. Chrome still suppressed. Art direction unchanged |
| `/projects/smart-reading` | Unchanged. Chrome suppressed. R3F still loads |
| `/contact` | Formspree `unconfigured` notice shown; all 15 `?type=` values preselect the right topic; no duplicate copyright line |
| `/team` | 7 role categories; every lead's project visible without interaction; managers grouped separately; placeholders marked |
| `/community` | Complete with zero configured content; then with one LinkedIn URN; then with one video |
| `/about` `/pillars` `/projects` `/get-involved` | Migrated palette; **no hover-only content** |
| `/privacy` `/terms` `/cookies` | Editorial column; readable measure |
| `/404` (bad URL) `/error` (forced throw) `global-error` | Styled; `global-error` has working fonts and type despite having no `globals.css` |
| `/sitemap.xml` `/robots.txt` | `/community` present; `/review` still excluded and disallowed |

## 3. Responsive widths

375 · 414 · 768 · 1024 · 1280 · 1440 · 1920, portrait and landscape at the two smallest.

| Check | Applies to |
|---|---|
| No horizontal scroll (`document.scrollWidth <= clientWidth`) | every route |
| Tap targets ≥44×44px with ≥8px spacing | nav, filters, social links, form controls, video facades |
| Nav: 8 items fit without clipping at **820–1180px** — the current 7-item pill clips here | `Navbar` |
| Long-content stress: a 40-char name, a 60-char project name, an unfilled placeholder, a member with zero links | `/team` |
| Embeds contained; iframes never exceed the viewport | `/community` |
| Decorative motifs simplified or dropped below 768px | contact / team / community |
| Hover-only reveals replaced by visible or tap-toggled state | `/pillars`, `/about`, `/contact` map |
| Filter chip rows have a visible scroll affordance | `/team`, `/projects` |

## 4. Browser checks

Chromium (primary, pre-installed) · Firefox · WebKit/Safari · iOS Safari · Android Chrome.
Specific fragilities: `backdrop-filter` on the nav (Firefox), `-webkit-mask-composite` if any
gradient-border survives the nav rebuild, `clamp()` with `vh` units on mobile URL-bar resize,
and `@media (any-hover: hover) and (pointer: fine)` on hybrid touch laptops — which must **not**
get the custom cursor while touching.

## 5. Keyboard

| Check |
|---|
| Tab order matches visual order on every route |
| Skip-to-content works and lands focus on `<main>` |
| Focus visible on **every** interactive element, including on `/`, which has none today |
| **Mobile nav sheet is not reachable by Tab while closed** — the current implementation is (`Navbar.tsx:192-241`) |
| Escape closes the mobile sheet; focus returns to the toggle |
| `/team` filters operable by keyboard; result count announced via `aria-live` |
| `/contact` fully completable by keyboard; each invalid field announces via `role="alert"`; success announces via `role="status"` and moves focus |
| `/community` facades are `<button>`s, activate on Enter and Space, and move focus into the player |
| Cursor component changes nothing about any of the above |

## 6. Reduced motion (`prefers-reduced-motion: reduce`)

| Check |
|---|
| All content reachable and readable; nothing withheld |
| `/` loader dwell drops to 250ms (existing behaviour preserved) |
| Smartphone entry per `04` §4 — `booting → ready` with no timeline |
| No reveal transforms anywhere; reveals resolve to final state |
| Cursor: no lag or inertia, or not mounted at all |
| Page motifs static |
| `FloatingDecor.tsx:71` — the guard is a **comment only** today (open Medium in `docs/AUDIT-brand-story-gsap.md:56`). Verify whether Batch 8 closes it or it remains a documented pre-existing defect |

## 7. Smartphone transition (Batch 6) — **production build only**

Dev and production behave differently here: `output: 'export'` applies only in production, and
`reactStrictMode: true` double-invokes the rAF in dev. Test `npm run build` + a static server.

| Check |
|---|
| No frame in which the finished page is visible before the loader |
| The H1 never appears at full opacity before its reveal — record at 60fps and step through |
| Title reveals exactly **once** |
| No blank or reset frame between loader and page |
| **No light wash** — the studio sweep flashing over the dark page must be gone (D3 + removal of the page-level `0.96` opacity animation) |
| Loader body duration unchanged from the approved 2800ms budget; only the handoff overlaps |
| Ordinary internal navigation to and from the route behaves as intended |
| Reduced motion: content immediately available |
| With JS disabled: the `<noscript>` fallback hides the overlay and un-arms the reveal — content is readable |
| Throttled CPU 4× and Slow 3G: no worse than baseline |

## 8. Embed fallback checks (`/community`)

| Scenario | Expected |
|---|---|
| `linkedInPosts: []` | Designed empty state; page complete; no iframe |
| One valid URN | Official embed renders with an accessible `<iframe title>`, a loading state, and a direct link to the post |
| Invalid / unavailable URN | Falls back to the manually-maintained preview card, then a plain external link — never a broken frame |
| Network blocked to `linkedin.com` | Fallback shown; no layout shift; no console error surfaced to the user |
| CSP report-only with `frame-src` added | No violation reported for LinkedIn or YouTube; **`img-src` unchanged** because thumbnails are local |
| `videos: []` | Placeholder module explains what will appear; no iframe |
| Video present, not clicked | **No YouTube iframe and no YouTube script in the document** — verify in the network panel |
| Video clicked | `youtube-nocookie.com` iframe created, focus moves into it |
| Any other route | Zero requests to `linkedin.com`, `youtube.com`, `ytimg.com`, or `discord.com` |
| Nothing fabricated | No follower counts, member counts, view counts, engagement figures, or invented publication dates anywhere |

## 9. Cursor fallback checks

| Scenario | Expected |
|---|---|
| Touch device / coarse pointer | Component never mounts; native cursor and behaviour untouched |
| Hybrid laptop, finger input | Custom cursor does not appear or activate |
| Reduced motion | No trailing or inertial movement |
| JS fails or component deleted | Site fully functional; native cursor throughout |
| Text selection | Drag-select works normally |
| Form fields | Native I-beam restored; no precision loss |
| Click-through | `pointer-events: none` — every click lands on the intended target |
| Screen reader | `aria-hidden="true"`; nothing announced |
| Contrast | Cursor never obscures text; no large opaque element over content |
| Route change ×10 | Listener and rAF counts unchanged (DevTools performance monitor) |
| On `/projects/modular-smartphone` | Entry-sequence frame timing unchanged vs Batch 6 measurement |

## 10. Accessibility audit

Target: WCAG 2.2 AA (`DESIGN.md` §9 defines no stricter bar).

| Check |
|---|
| Contrast ≥4.5:1 body / ≥3:1 large and UI — **specifically re-verify `Eyebrow`**, which is ~3.4:1 today on every secondary page |
| Colour is never the only signal for role, project, validation, or interaction state |
| Landmarks: one `<main>`, `<nav aria-label>`, `<footer>`; no nested `<main>` |
| One `<h1>` per route; no skipped levels |
| Every `<img>` has meaningful alt or is `aria-hidden`; team placeholder avatars have alt text |
| Decorative glyphs (✳, `+`, chips, motifs) are `aria-hidden` |
| External links carry `rel="noopener noreferrer"` and communicate that they open a new tab |
| Iframes have descriptive `title` attributes |
| Route-change focus behaves sanely (`<main tabIndex={-1}>` exists) |
| Loading and result-count changes announced where they matter |

## 11. Performance

| Check | Gate |
|---|---|
| Font families per route | Exactly 3 (see `05` D4). `/` drops from 6 |
| Fixed full-viewport layers | 0 — `body::before` / `body::after` deleted |
| Third-party requests on non-community routes | 0 |
| Below-the-fold embeds and images | lazy |
| `CursorProvider` | absent from server-rendered HTML |
| Route JS payloads | no route larger than baseline; `/community` must not bundle a video or embed library |
| CLS | no regression; verify the smartphone H1 against font-swap reflow |
| Long tasks during the smartphone entry | no worse than baseline (per-frame `setElapsed` removal should improve it) |
