# Library fit: Part 1.4 resources + thinking-orbs + page-mascot

W1-REFS · 2026-10-02. Sources: `tooling-audit.md` (installed versions, §5 fit map), scout notes
(`research/scout/*.md`, `_SCOUT-1/2-summary.md`), installed `node_modules/*/package.json`, bundlephobia API
(motion, gsap), and fancy component source read from GitHub (`danielpetho/fancy@main`).
Weight = gzip. "local" = measured from `node_modules/<pkg>/dist`. "n/v" = not verified.
Design-system shortlist lives in `research/design-systems-shortlist.md` (not repeated here).

Directions: **A** Editorial/Studio · **B** Engineering/System · **C** Creative Technology · **D** Human/Community ·
**E** Startup/Product Studio · **F** Radical. Fit: ● strong · ○ possible · — avoid.

---

## 1. Resource table

| Resource | Good for (DIGITAL use) | Weight | Installed (worktree) | A | B | C | D | E | F | Caveats |
|---|---|---|---|---|---|---|---|---|---|---|
| **fancycomponents.dev** | Copy-paste text/scroll/pointer effects on `motion/react`: masked headline reveal, scramble labels, sticky project stack | per component, 86-510 LOC; only `motion` (+ `matter-js` for Gravity) | not a package (copy-paste, MIT); deps `motion`, `clsx`, `tailwind-merge`, `cn` in `lib/utils.ts` all present | ● | ○ | ● | ○ | ● | ● | **0 reduced-motion handling in source**; pointer effects have no touch fallback. See §2 |
| **Motion** (motion.dev) | Reveals, stagger, `layoutId` shared transitions, `useScroll` scroll-linked, drag | 47.6 KB full package (bundlephobia 13.4.6); `LazyMotion` smaller (n/v) | **motion 13.4.6** (nested framer-motion 13.5.1; production keeps framer-motion 11.18.2) | ● | ● | ● | ● | ● | ● | Import only in `app/design-lab/**`; don't mix with production framer-motion contexts. Global `<MotionConfig reducedMotion="user">` |
| **vgpu examples** (vercel-labs/vgpu; TypeGPU = separate lib) | Shader ideas only: a texture on a hardware object, "jelly" tactile UI idea | vgpu claims ~25 KB per effect (n/v) | **not installed**; vgpu 0.5.0 exists | — | — | ○ | — | — | ○ | WebGPU-only, no WebGL fallback, black-hole/bloom look = §39 crypto/AI risk. Rebuild any idea in three/R3F |
| **HealthCentral** | Unknown: user-listed content-page reference | n/a | n/a | ? | ? | ? | ? | ? | ? | **NOT SCOUTED** (HTTP 403 bot block). No fit can be claimed |
| **Beautiful UI** | Presentation grammar: numbered specimen + one-line caption + variant switch; state micro-UIs (queued → running → done) for honest project status | copy-paste, no package | not installed | ○ | ● | — | — | ○ | — | Look = AI-agent chat UI (§39). Borrow layout grammar, not styling |
| **COBE** | One instrument-like globe with labelled markers, **only with real coordinates** (campus / build sites / events) | 5.9 KB, 0 deps | **cobe 2.0.1** | ○ small figure | ○ | ● | ○ | — | ○ | One dot (campus) = ornament. Regional focus or skip. rAF must pause offscreen + reduced motion; CSS anchor labels need a fallback outside Chromium |
| **R3F examples** | One lazy 3D object viewer (phone parts exploded view, glasses), poster fallback | three 185 + fiber 57 KB; drei up to 521 KB (import named helpers) | **three 0.169.0, @react-three/fiber 8.18.0, @react-three/drei 9.122.0** | — | ○ | ● | — | ○ | ● | **Never upgrade to fiber 9 / drei 10 (React 19 only).** `next/dynamic` ssr:false, `frameloop="demand"`. Production hero already does a teardown; don't duplicate it |
| **Lenis** | Desktop smooth-scroll feel under one scrubbed sequence | few KB, 0 deps (README) | **lenis 1.3.23** | ○ long-form | — | ● | — | — | ● | Desktop pointer only; reduced motion = lerp 1 (built in). Never double-smooth with `useScroll` springs |
| **MotionSites AI** | Anti-reference map; at most the "big type over looping real footage" pattern | n/a (prompt marketplace) | not installed | — | — | ○ | — | — | ○ | Glow, glass, pills, generic AI heroes = §39 list. Study motion only, copy nothing |
| **GSAP ScrollTrigger** | ONE pinned, scrubbed signature sequence per concept (teardown, assembly) | gsap core 27.2 KB (bundlephobia 3.13.0); ScrollTrigger n/v | **gsap 3.15.0** | ● | ○ | ● | — | ○ | ● | `gsap.matchMedia()` gates desktop + no-reduce; no pinning on mobile. Pick GSAP **or** Motion per effect |
| **Rough.js** | Hand-drawn annotation layer: margin notes, circled callouts on schematics/photos | 8.8 KB | **roughjs 4.6.6** | ○ | ○ | ○ | ● | — | ● | Fixed `seed` for SSR-stable output. Annotations only; sketchy-everything reads Excalidraw-cute |
| **Recharts** | Real project data only (timeline, discipline mix) | 151 KB | **recharts 3.10.1** (+ react-is 18.3.1 pinned) | — | ● | — | ○ | ○ | — | For ≤3 simple charts hand SVG wins (0 KB). Re-theme the default violet palette. **No vanity dashboards** |
| **Lucide** | Default utility icons, 16-20px at 1.5 stroke, inline with mono labels | ~1 KB per named icon | **lucide-react 1.17.0** | ○ | ● | ○ | ○ | ● | ○ | Never barrel / dynamic-by-name imports (193 KB). No icon-in-rounded-square feature rows. Phosphor 2.1.10 + Tabler 3.48.0 also installed for comparison |
| **dnd kit** | Team-builder (pick disciplines → subsystem), sortable project board, nonlinear explorer, assemble-the-phone toy | core 14.2 + sortable 3.7 KB | **@dnd-kit/core 6.3.1, sortable 10.0.0, utilities 3.2.2** | — | ○ | ○ | ● | ● | ● | Always `KeyboardSensor` + screen-reader announcements + a non-drag button path; `touch-action` on mobile |
| **thinking-orbs** | Project-phase indicator (e.g. `shaping` = design, `connecting` = integration, `working` = build) at 20 or 64 px | ~14.5 KB ESM (local) | **thinking-orbs 0.3.2** (MIT, peer react ≥18) | — | ○ | ● | ○ | ● | ● | 2D canvas, monochrome; reduced motion = static frame; pauses offscreen. Built "for AI & agent UIs": using it as decoration reads as a generic AI company. Map each state to a **real** phase only |
| **page-mascot** | A character that follows the cursor; a guide for the radical or community concept | ~2.1 KB (local) + 2 webp sprite sheets per character | **page-mascot 0.1.0** (+ skill in `.claude/skills/page-mascot/`) | — | — | ○ | ● | — | ● | Tracking off without a fine pointer; click squash honours reduced motion. Pre-drawn characters work now (sheets go in `public/`, needs orchestrator approval). Custom drawing **blocked** (no `OPENAI_API_KEY`, no PIL/numpy) or via Gemini (counts against ≤8 cap) |

Agreement with `tooling-audit.md` §5: matches except (1) COBE for D downgraded to ○ (no real photo locations in
`lib/data`), (2) Beautiful UI and MotionSites added, (3) Lucide marked ● for B/E per SCOUT-2.

---

## 2. fancycomponents: best 6 for DIGITAL

All six import `motion/react` (installed) and `cn` from `@/lib/utils` (exists). Copy into `app/design-lab/<slug>/`
with the author header kept (MIT).

| # | Component | Docs | Source | LOC | DIGITAL use | Directions |
|---|---|---|---|---|---|---|
| 1 | **Stacking Cards** | https://www.fancycomponents.dev/docs/components/blocks/stacking-cards | https://github.com/danielpetho/fancy/blob/main/src/fancy/components/blocks/stacking-cards.tsx | 105 | Project dossiers stacking on scroll (`useScroll` + CSS sticky): one Build Record per card | A, E, B |
| 2 | **Vertical Cut Reveal** | https://www.fancycomponents.dev/docs/components/text/vertical-cut-reveal | https://github.com/danielpetho/fancy/blob/main/src/fancy/components/text/vertical-cut-reveal.tsx | 221 | Masked line-by-line thesis reveal (BRAND cadence: ≤9 words/line, subject first) | A, E, C, F |
| 3 | **Scramble Hover** | https://www.fancycomponents.dev/docs/components/text/scramble-hover | https://github.com/danielpetho/fancy/blob/main/src/fancy/components/text/scramble-hover.tsx | 188 | Mono labels, subsystem IDs, nav items resolving on hover | B, C |
| 4 | **Media Between Text** | https://www.fancycomponents.dev/docs/components/blocks/media-between-text | https://github.com/danielpetho/fancy/blob/main/src/fancy/components/blocks/media-between-text.tsx | 228 | Project title parts to reveal real build media (has `fallbackUrl`) | A, D, E |
| 5 | **Text Highlighter** | https://www.fancycomponents.dev/docs/components/text/text-highlighter | https://github.com/danielpetho/fancy/blob/main/src/fancy/components/text/text-highlighter.tsx | 211 | Highlight the one clause that matters in a real quote or claim (RC highlighter move) | A, D |
| 6 | **Drag Elements** | https://www.fancycomponents.dev/docs/components/blocks/drag-elements | https://github.com/danielpetho/fancy/blob/main/src/fancy/components/blocks/drag-elements.tsx | 86 | Draggable specimen cards / parts on a workbench (flat-lay you can touch) | C, F, D |

Runners-up: Text Rotate (`text/text-rotate.tsx`, 440 LOC: "we need ___" disciplines rotator), Image Trail
(`image/image-trail.tsx`, 248 LOC: real project photos only). Avoid: Screensaver (idle motion), Gravity (matter-js, 510 LOC; lazy-load only).

### React 18 caveats (checked in source)

1. All 6 are `"use client"` leaves. Vertical Cut Reveal, Media Between Text and Text Highlighter use `forwardRef` +
   `useImperativeHandle` (React 18-safe). No React-19-only APIs (`use()`, ref-as-prop) found in the 8 files read.
2. They import `motion/react` (v13, peer React 18 OK). Don't swap to the production `framer-motion@11` import.
3. Vertical Cut Reveal and Text Rotate use `Intl.Segmenter` with a built-in fallback. No action needed.
4. Docs pages intermittently return HTTP 500 to fetchers. The GitHub source is the reference.

### Reduced-motion caveats (must fix on copy)

1. **0 of 6 check `prefers-reduced-motion`.** Wrap the route in `<MotionConfig reducedMotion="user">` (drops transform/layout,
   keeps opacity) **and** branch with `useReducedMotion()` per component:
   - Stacking Cards → plain stacked list, no scale transform.
   - Vertical Cut Reveal → render the final text, no mask.
   - Scramble Hover → no scramble; colour/underline hover only.
   - Media Between Text → media shown inline, text already parted.
   - Text Highlighter → highlight drawn instantly.
   - Drag Elements → static layout; offer buttons for reorder.
2. Screen readers: Scramble Hover and Vertical Cut Reveal already render an `sr-only` copy + `aria-hidden` animated
   copy. Keep it. The other 4 need checking per use.
3. Pointer-only: Drag Elements (and Image Trail) do nothing on touch. Give a tap or static fallback, 44px targets.
4. Content is never gated behind an effect: first paint must show the final text (no blank pre-reveal state; d.school/Linear pitfall).

---

## 3. Dependency requests

None. Every library above is already installed in the worktree, or is copy-paste / reference-only.
