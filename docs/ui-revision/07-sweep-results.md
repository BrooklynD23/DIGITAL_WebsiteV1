# 07 — Consolidation Sweep Results (#0051)

Run against `feature/site-consolidation` after the site consolidation batches. Automated
gates and static-output assertions were executed; visual/manual items are listed with their
status for the next session.

## Executed — pass

| Matrix § | Check | Result |
|---|---|---|
| §1 | `node scripts/validate-vercel-json.mjs` | exit 0 |
| §1 | `npx tsc --noEmit` | 0 errors |
| §1 | `npm run lint` | 0 errors |
| §1 | `./run.sh check` (with `/community`) | green |
| §1 | production export | 19/19 routes; `out/community/index.html` present |
| §2 | exactly one `<h1>` per route (14 routes incl. `/pillars`, `/404`) | pass (fixed `/pillars` stub during sweep) |
| §2 | no third-party iframe in any route's initial HTML | pass |
| §2 | `/contact`: Formspree refusal logic + all 15 `?type=` deep links in source; no duplicate copyright | pass |
| §2 | `/team`: placeholders marked; lead projects on card face; count via `aria-live` | pass |
| §2 | `/community`: complete with zero configured content; no iframes/scripts | pass |
| §2 | `/sitemap.xml`: `/community` in, `/pillars` + `/review` out; robots disallows `/review` | pass |
| §6 | smartphone entry: loader present at first paint, hero armed, noscript un-arm — verified against **production build** | pass |
| §10 | contrast: eyebrow 5.89:1 · body 17.26:1 · muted-dark/void 6.27:1 · gold CTA 6.7:1 · error brick 6.36:1 | all ≥4.5:1 |
| §10 | external links carry `rel="noopener noreferrer"` (all exported routes) | pass |

## Remaining — manual / needs a browser session

- §3 responsive widths (375–1920) incl. horizontal-scroll probe
- §4 cross-browser (Firefox `backdrop-filter`, iOS Safari)
- §5 full keyboard walk (tab order, skip link landing, focus trap live-test)
- §7 60fps screen recording of the handoff; throttled CPU/network runs
- §11 runtime perf probes (font counts per route verified structurally = 3; CLS needs a browser)

## Known deviations (accepted)

- Desktop ribbon links are ~20px tall (mono micro register); mobile sheet items meet ≥44px.
  Pointer-context desktop nav at this scale predates the rebuild and matches the landing's own nav.
- Loader `elapsed` state updates are throttled (~30fps) rather than moved fully off React state;
  the SVG still re-renders per update by design (it drives `explode`). Full motion-value refactor
  deferred as micro-optimization.
- `Loader` keeps a `reduceMotion → return` guard (no callback) instead of deleting the branch:
  child effects run before the parent's reduced-motion effect unmounts it, so the timeline must
  not initialize even for one frame.
