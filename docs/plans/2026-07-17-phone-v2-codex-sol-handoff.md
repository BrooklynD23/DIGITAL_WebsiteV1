# Codex Sol Handoff — `/phone-v2` finish pass

**Date:** 2026-07-17  
**Branch:** `swarm/feature-6` (tracks `origin/swarm/feature-6`)  
**Repo:** `/mnt/c/Users/DangT/Documents/GitHub/DIGITAL_WebsiteV1` (Windows path: `c:\Users\DangT\Documents\GitHub\DIGITAL_WebsiteV1`)  
**Orchestrator context:** Fable confirmed the brief and launched Codex rescue; Codex scaffolded the route then stalled in verification. Three Composer 2.5 audits + local checks completed. **You are picking up to finish fidelity gaps, not re-scaffold.**

**Do not commit unless the human explicitly asks.** Previous brief also said do not commit.

---

## 0. Mission (one sentence)

Finish the confirmed Anime.js v4 exploded-smartphone scrollytelling preview at `/phone-v2` so it matches the Fable-approved brief at production quality, then verify with `./run.sh check` (and a quick visual sanity pass if possible).

---

## 1. Critical constraints (read first)

| Rule | Detail |
|------|--------|
| Static export only | `output: 'export'` — client components OK; no server actions / stateful API routes |
| Do **not** touch | `app/landing-v2/**`, `components/teardown/**`, `public/assets/frames/**` |
| Content in data files | All user-facing strings → `lib/data/phoneV2.ts` (never hardcode in components) |
| Copy is provisional | Keep the `pending human sign-off` warning at top of `phoneV2.ts` |
| Design system | `DESIGN.md` wins over improvisation. `/phone-v2` uses **scoped** Dark Mode Developer palette (§15) — **no** global signal red `#d8412f`, **no** CPP green/gold on this route |
| Marketing skill | `.cursor/skills/digital-marketing/` for claims/voice if you touch copy |
| TypeScript | `strict: true`; must pass `tsc --noEmit` |
| Tailwind only | No new CSS-in-JS libs; route-local CSS only if unavoidable |
| Escape hatch pattern | Immersive routes use `components/ui/EscapeHatch.tsx` + hide Navbar/Footer via `lib/immersiveRoutes.ts` |

### Model / runner note

- Prior Codex attempt with `--model sol` **failed** on ChatGPT-auth Codex: `The 'sol' model is not supported when using Codex with a ChatGPT account.`
- A second run (default model, medium effort) wrote the scaffold; job `task-mrotb30r-cj1dxg` may still show **running**/stale (PID was alive after local green checks). **Do not wait on that job.** Start fresh work on the working tree.
- If your launcher supports Sol and the account allows it, use Sol; otherwise use the best available Codex model at medium+ effort. Same brief either way.

---

## 2. Workspace state (as of handoff)

### Git

```
Branch: swarm/feature-6
HEAD:   a7060d0 feat(landing-v2): add landingV2 data file (copy + layer manifest)

Modified:
  DESIGN.md          (§15 Subsystem Accent Scale for /phone-v2 — keep)
  package.json       (animejs ^4.0.0 dep — keep)
  package-lock.json  (after npm install)
  tsconfig.json      (HAS BAD PATH ALIAS — see §4)
  .claude/settings.local.json  (ignore / do not need)

Untracked:
  app/phone-v2/
  components/phone-v2/
  lib/data/phoneV2.ts
  lib/vendor/         (shim — planned for removal / de-alias)
```

### Verified locally (Composer build-health + controller)

| Check | Result |
|-------|--------|
| `npm install` | Required once — `animejs@4.5.0` in `node_modules` |
| `npx tsc --noEmit` | **PASS** |
| `npm run lint` | **PASS** (~12s); only pre-existing warning in `TeardownMobilePoster.tsx` |
| `npm run build` | **PASS**; `/phone-v2` static page generated (~11.2 kB) |

**Implication:** Compile/lint are green. Remaining work is **brief fidelity**, not getting CI green.

---

## 3. Confirmed brief (source of truth)

User-confirmed answers that shaped the brief:

1. **Route:** New preview route `/phone-v2` (not replace landing-v2).  
2. **Palette conflict:** Extend `DESIGN.md` with route-scoped tokens (done as §15).  
3. **Copy:** Placeholder pending human sign-off (flag in data file).  
4. **Build mode:** Codex implements; Fable orchestrates/reviews.

### Required page flow

1. **Loader** — Full-viewport; phone outline self-draws via stroke-dashoffset / `svg.createDrawable`; bottom-right tick scrubber; DIGITAL wordmark; plays once; skippable by scroll/click. Reduced-motion: instant skip.  
2. **Hero** — Left stacked display headline: `Build the phone. / Build the team. / Build the system.` + subline; exploded phone right ~60%.  
3. **Toolbox** — “Complete builder's toolbox”: circular HUD lens + right pseudo-code SpecCard.  
4. **Seven subsystem sections in ONE sticky pinned stage** — Phone stays fixed center-right; 7 copy panels scroll on left (title, description, 3 bullets); SpecCard + bottom-right TickScrubber swap per section. Active phone part translates forward + glows in section accent; others dim to line-art.  
5. **Build scope** — Inverted light section (`#F1F5F9` bg / `#0F172A` ink) + scope card.  
6. **Final CTA** — Phone **reassembles** (animated, not static snap); headline `Pick a subsystem. Own a part of the build.`; links: Join → `/get-involved`, Teams → `/pillars`, Projects → `/projects`.

### Subsystem accents (exact)

| Section | Accent |
|---------|--------|
| Systems Architecture | `#F87171` |
| Hardware / PCB | `#FBBF24` |
| Firmware / Embedded | `#4ADE80` |
| Operating System | `#22D3EE` |
| Apps / UX | `#60A5FA` |
| Mechanical / CAD | `#C084FC` |
| Integration / Testing | `#FACC15` |

### Route palette (scoped; DESIGN.md §15)

- bg `#0F172A`, panel `#1E293B`, raised `#334155`, text `#F1F5F9`, text-dim `#94A3B8`, CTA/focus `#818CF8`, success `#4ADE80`, warning `#FBBF24`  
- Schematic strokes `#94A3B8` / `#F1F5F9`  
- Typography: site fonts (Archivo display + DM Mono)

### SVG requirements

`components/phone-v2/PhoneSchematicSvg.tsx` — original inline SVG, stroke-first technical line-art, no embedded text, no raster. **14 independently transformable groups:**

`phone-front-glass`, `phone-screen-ui`, `phone-display-panel`, `phone-midframe`, `phone-main-pcb`, `phone-battery`, `phone-camera-module`, `phone-antenna-module`, `phone-speakers`, `phone-buttons`, `phone-haptics`, `phone-flex-cables`, `phone-screws`, `phone-back-cover`

Keep comments marking placeholder geometry vs future CAD paths.

### Anime.js v4 API (required)

Use real package API: `animate`, `createTimeline`, `onScroll`, `svg.createDrawable`, `stagger` from `animejs` (installed `4.5.0`).

### Reduced motion

`prefers-reduced-motion: reduce` → static exploded view, all labels visible / equal emphasis, crossfades only, loader instant. Content never gated on animation.

### Mobile `<768px`

Simplified schematic (**5 parts**), visual above copy, SpecCard collapsed, **no pinning**. Avoid phantom tall scroll containers.

### Deliverables already mostly present

`app/phone-v2/page.tsx` + `layout.tsx`, `components/phone-v2/*` (Loader, Hero, PhoneSchematicSvg, SubsystemStage, HUD, SpecCard, TickScrubber, FinalCta, PhoneV2Experience), `lib/data/phoneV2.ts`, DESIGN.md §15, `animejs` in package.json.

---

## 4. Prioritized gap backlog (do these)

Composer audits agreed on this order. Treat as your todo list.

### P0 — Blockers / must-fix

1. **Wire real anime.js v4; remove shim alias**  
   - Delete or stop using `lib/vendor/animejs.ts` as the resolve target.  
   - Remove `"animejs": ["./lib/vendor/animejs"]` from `tsconfig.json` `paths`.  
   - Import from package `animejs` (v4.5.0). Fix any type/API mismatches against real v4.  
   - Confirm `svg.createDrawable` behaves as real drawables (stroke draw), not a DOM-node passthrough.

2. **Register immersive chrome**  
   - Add `'/phone-v2'` to `IMMERSIVE_PREFIXES` in `lib/immersiveRoutes.ts`.  
   - Mount `<EscapeHatch tone="dark" />` (or light where bg flips) inside `PhoneV2Experience` — mirror `components/landing/LandingExperience.tsx`.

3. **Reduced-motion correctness** (`SubsystemStage.tsx`)  
   - Do not freeze `activeIndex` at `0` forever.  
   - Prefer: show all sections with equal emphasis / static exploded schematic; skip scroll timeline + part `animate()` calls when reduced-motion.  
   - Guard every `animate()` / timeline so JS motion cannot bypass `prefers-reduced-motion`.

4. **Mobile phantom scroll**  
   - `minHeight: sections.length * 100svh` currently applies on mobile too → ~700svh empty scroll. Scope tall min-height to `md+` only.

### P1 — Brief fidelity (interaction)

5. **Animated reassembly on Final CTA**  
   - Today: `assembled` boolean snap (`FinalCta.tsx`).  
   - Need: scroll- or IO-triggered anime timeline collapsing explode offsets into assembled state.

6. **TickScrubber should track progress**  
   - Today: `pointer-events-none`, decorative; Loader/Hero scrubbers stuck at index 0.  
   - Minimum: reflect active section / loader draw progress.  
   - Stretch: click/drag scrubbing if it stays simple and a11y-safe.

7. **Active part “forward” + line-art inactive**  
   - Stronger translate-toward-viewer + accent glow on active ids.  
   - Inactive parts → true line-art (stroke emphasis, fills dimmed/removed), not just opacity 0.3.

8. **Extract hardcoded copy into `phoneV2.ts`**  
   Known offenders:  
   - `PhoneV2Experience.tsx`: “Builder / tools”, “Light mode / build scope”  
   - `Hero.tsx`: “DIGITAL / PHONE V2”, TickScrubber “Launch” / “ready”  
   - `SubsystemStage.tsx`: mobile intro (“Subsystems”, “Scroll the stack.”, body)  
   - `FinalCta.tsx`: “Reassembly”  
   - `Loader.tsx`: “Boot”, “click or scroll to skip” (use `hero.skipLabel`)  
   - Wire unused `mobileSummary` / `routeFacts` if still useful, else leave but stop adding dead fields.

9. **Focus rings on CTAs**  
   - DESIGN.md §9: visible focus ring on interactives. Add `focus-visible:` rings on Hero/FinalCta Links.

### P2 — Polish (if time)

10. Loader composition: scrubber bottom-right of viewport; fuller outline draw targets.  
11. Spec card section swap: subtle crossfade via timeline.  
12. Optional: HUD lens also in sticky subsystem column (brief says phone/HUD fixed center-right).  
13. Optional: `NextProjectCard` cross-link (glasses/phone pattern) — not in original brief; only if trivial.

### Out of scope

- Committing / pushing / PR (unless human asks).  
- Rewriting landing-v2 or teardown frame sequence.  
- Approving marketing copy (keep pending sign-off).  
- Replacing SVG with real CAD exports (placeholders OK with comments).

---

## 5. File map

```
app/phone-v2/
  layout.tsx              metadata from phoneV2Metadata
  page.tsx                client → PhoneV2Experience

components/phone-v2/
  PhoneV2Experience.tsx   root orchestrator + CSS vars
  Loader.tsx              intro draw timeline
  Hero.tsx
  HUD.tsx
  SpecCard.tsx            supports collapsed / dark props
  TickScrubber.tsx        currently display-only
  SubsystemStage.tsx      sticky pin + onScroll index
  PhoneSchematicSvg.tsx   14 groups + mobile 5-part + assembled
  FinalCta.tsx

lib/data/phoneV2.ts       ALL copy + accents + metadata
lib/immersiveRoutes.ts    MISSING /phone-v2  ← fix
lib/vendor/animejs.ts     SHIM ← remove alias; prefer delete after real v4 works

DESIGN.md                 §15 addendum already present — preserve
package.json              "animejs": "^4.0.0"
tsconfig.json             REMOVE animejs path override
```

Reference patterns:

- Immersive + EscapeHatch: `components/landing/LandingExperience.tsx`  
- Immersive route list: `lib/immersiveRoutes.ts`  
- Data-only copy: `lib/data/landingV2.ts`  
- Marketing: `.cursor/skills/digital-marketing/SKILL.md`

---

## 6. Suggested execution order

```text
1. npm install (ensure animejs present)
2. Remove tsconfig animejs path → fix imports against real animejs v4
3. Delete lib/vendor/animejs.ts once unused
4. Add /phone-v2 to immersiveRoutes + EscapeHatch
5. Fix reduced-motion + mobile minHeight
6. Animate FinalCta reassembly
7. Scrubber progress binding + stronger explode/line-art
8. Move hardcoded strings → phoneV2.ts
9. Focus-visible rings
10. ./run.sh check  (or: npx tsc --noEmit && npm run lint)
11. Manual: /phone-v2 desktop sticky stage, mobile stack, prefers-reduced-motion
12. STOP — report diff summary; do not commit unless asked
```

---

## 7. Acceptance checklist (Definition of Done)

- [ ] Imports resolve to **real** `animejs@4` (no `lib/vendor` alias)  
- [ ] `/phone-v2` hides Navbar/Footer; EscapeHatch present  
- [ ] Loader stroke-draws once, skippable; instant under reduced-motion  
- [ ] Sticky 7-section stage works on desktop; mobile no pin + no 700svh ghost scroll  
- [ ] Active parts accent-glow / push forward; inactive read as line-art  
- [ ] Final CTA phone reassembles via animation  
- [ ] Tick scrubber reflects section/loader progress  
- [ ] Zero user-facing hardcoded strings outside `phoneV2.ts`  
- [ ] No `#d8412f` / CPP green-gold on route; §15 tokens only  
- [ ] Focus-visible rings on primary links  
- [ ] `tsc --noEmit` + lint clean for new files  
- [ ] Protected paths untouched  
- [ ] No commit unless human requested  

---

## 8. Audit provenance (for trust)

| Source | Role |
|--------|------|
| Fable session `8d99b334-fa58-4cc4-8d78-dd48e711a53e` | Confirmed brief; launched Codex rescue |
| Codex job `task-mrotb30r-cj1dxg` | Scaffolded files; stalled verifying (lint hang when animejs missing / companion stale) |
| Composer brief audit | ~74% structural; blocker = vendor shim |
| Composer a11y/motion audit | immersive route, EscapeHatch, reduced-motion, mobile 700svh, focus rings |
| Composer build health | tsc/lint/build PASS after `npm install` |

Do not re-litigate palette or route location — user already confirmed.

---

## 9. Prompt seed (paste into Codex Sol)

```text
Continue unfinished /phone-v2 work on branch swarm/feature-6 in DIGITAL_WebsiteV1.
Read docs/plans/2026-07-17-phone-v2-codex-sol-handoff.md and execute the P0→P1 backlog.
Scaffold already exists and tsc/lint/build are green — do NOT rewrite from scratch.
Priority: (1) remove tsconfig animejs→lib/vendor alias and use real animejs v4,
(2) add /phone-v2 to immersiveRoutes + EscapeHatch, (3) fix reduced-motion + mobile minHeight,
(4) animated Final CTA reassembly, (5) scrubber progress + explode/line-art fidelity,
(6) move hardcoded copy into lib/data/phoneV2.ts, (7) focus-visible rings.
Do not touch app/landing-v2, components/teardown, or public/assets/frames.
Verify with ./run.sh check (or tsc + lint). Do not commit unless asked.
Report what changed and what remains.
```

---

## 10. Human follow-ups (not for Codex)

- Cancel stale Codex job `task-mrotb30r-cj1dxg` if still “running” in Claude Code.  
- After Sol finishes: visual QA + marketing sign-off on `phoneV2.ts` copy.  
- Then commit + record in `TODO.md` Dev Build table per CLAUDE.md standing rule.
