# Modules Landing + Glasses Realism + Cross-Linking — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. In this project the implementation workers are **Codex CLI** subagents (`codex:codex-rescue`); hand each task verbatim, including the Global Constraints block.

**Goal:** Regrade the glasses page to a premium "warm paper" look with a real HUD system and PBR materials; build the "Modules → Everything" WebGL landing at `/landing-preview`; promote the glasses experience to `/projects/smart-reading` and cross-link everything.

**Architecture:** Three ordered tracks. Track B refines the existing glasses experience in place (palette, panels, HUD, materials). Track A adds a new, self-contained R3F landing (instanced-block formations driven by scroll, following the exact orchestrator pattern the glasses page already proves). Track C is IA glue (route move, redirect stub, chrome guard, data entry, next-project cards) and runs last because it touches shared files.

**Tech Stack:** Next.js 14 App Router (static export), React 18, TypeScript strict, Tailwind 3, framer-motion 11, Lenis 1.3, three 0.169 + @react-three/fiber 8 + three-stdlib, lucide-react.

**Spec:** `docs/superpowers/specs/2026-07-04-hud-landing-design.md` (approved). The spec's §0 decisions are binding.

## Global Constraints

- Static export (`output: 'export'`): all R3F behind `next/dynamic` + `ssr: false`; **no runtime CDN fetches** (no drei `<Environment preset>`); assets under `/public` only.
- `npx tsc --noEmit` → 0 errors after every task.
- `npx next lint --dir app --dir components --dir lib` → 0 errors (a pre-existing `TeardownMobilePoster` `<img>` warning is allowed).
- Tailwind utilities only; no CSS-in-JS; no new dependencies except `npm i --no-save playwright` for the harness.
- ALL copy in `lib/data/` — zero hard-coded strings in components.
- Signal red `#d8412f` only per DESIGN.md roles on production surfaces.
- WSL gotchas: after edits, **restart dev** before screenshots (`pkill -f next-server; npm run dev &`); never `npm run build` while dev runs.
- Commit after every task with the team's `<type>: <subject> (#00XX)` format, taking the next sequential commit number at commit time (history is at `#0015` when this plan starts). TODO.md sync happens once, in Task 11.

---

## Verification harness (used by every task)

The project has no unit-test framework; the test cycle is: types + lint + build + deterministic screenshots. Create the screenshot harness once (Task B1 Step 1) at `scripts/shot.mjs`:

```js
// scripts/shot.mjs — deterministic scroll screenshots.
// Usage: node scripts/shot.mjs <url> <outPrefix> <frac1> [frac2 ...]
// Requires: npm i --no-save playwright && npx playwright install chromium
import { chromium } from 'playwright';

const [url, prefix, ...fracs] = process.argv.slice(2);
if (!url || !prefix || fracs.length === 0) {
  console.error('usage: node scripts/shot.mjs <url> <outPrefix> <frac...>');
  process.exit(1);
}
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500); // R3F mount + FBX load
for (const f of fracs) {
  await page.evaluate((frac) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = max * Number(frac);
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  }, f);
  await page.waitForTimeout(1200); // let 60fps lerps settle
  await page.screenshot({ path: `${prefix}-${f}.png` });
  console.log(`${prefix}-${f}.png`);
}
await browser.close();
```

Standard verify block (referenced as **VERIFY** below — run all of it, in order):

```bash
npx tsc --noEmit                                          # expect: no output, exit 0
npx next lint --dir app --dir components --dir lib        # expect: only the known img warning
pkill -f next-server; (npm run dev &) ; sleep 25          # fresh dev server
node scripts/shot.mjs <url> <prefix> <fracs…>             # per-task values
```

Full build check (run at the end of Tasks B4, A3, C2, 11): `pkill -f next-server` then `npm run build` → expect successful static export with all routes emitted, then restart dev.

---

### Task 1 (B1): Warm-paper palette regrade + decor restraint

**Files:**
- Create: `scripts/shot.mjs` (harness above, verbatim)
- Modify: `lib/data/experiments/glasses.ts` (add palette export)
- Modify: `components/experiments/glasses/GlassesExperience.tsx:81-96` (bg stops, container color, sweep/grain overlay)
- Modify: `components/experiments/glasses/FloatingDecor.tsx` (stroke shapes, palette)
- Modify: `components/experiments/glasses/InfoPanels.tsx:60` (spec-key accent color)

**Interfaces:**
- Produces: `GLASSES_PALETTE` export in `lib/data/experiments/glasses.ts` — later tasks import it:
  ```ts
  export const GLASSES_PALETTE = {
    paper: '#e9dfc8', paperEdge: '#d9cba6', dusk: '#6f6654',
    charcoal: '#111827', deep: '#0b0e16', accent: '#e3b341',
  } as const;
  ```

- [ ] **Step 1: Create the harness** — write `scripts/shot.mjs` exactly as above; run `npm i --no-save playwright && npx playwright install chromium`. Baseline screenshot before any change: `node scripts/shot.mjs http://localhost:3000/experiments/glasses /tmp/b1-before 0 0.5 0.85` (dev must be running; restart it first).

- [ ] **Step 2: Add `GLASSES_PALETTE`** to `lib/data/experiments/glasses.ts` (block above, after the interfaces, before `GLASSES_CONTENT`).

- [ ] **Step 3: Regrade the experience.** In `GlassesExperience.tsx`:
  - Import the palette: `import { GLASSES_CONTENT, GLASSES_PALETTE } from '@/lib/data/experiments/glasses';`
  - Replace the `bg` transform (lines 81–85) with:
    ```ts
    const bg = useTransform(
      scrollYProgress,
      [0, 0.16, 0.3, 0.42, 0.8],
      [GLASSES_PALETTE.paper, GLASSES_PALETTE.paper, GLASSES_PALETTE.dusk, GLASSES_PALETTE.charcoal, GLASSES_PALETTE.deep]
    );
    ```
  - Container (line 96): `bg-[#FACC15]` → `bg-[#e9dfc8]`.
  - Directly inside the sticky `motion.div` (before `<ExperienceNav …/>`), add the studio-sweep + grain overlay (pure CSS, sits under everything at z-[1]):
    ```tsx
    {/* Radial sweep + film grain so no beat reads as a flat fill */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] opacity-60"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 38%, rgba(255,255,255,0.28) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.22) 100%)',
      }}
    />
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] opacity-[0.05] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
    ```

- [ ] **Step 4: Retire remaining flat yellow.** `grep -rn "FACC15" components/experiments/glasses/ lib/data/experiments/` — replace every remaining hit: `InfoPanels.tsx` spec key `text-[#FACC15]` → `text-[#e3b341]`; any hit in `ExperienceNav.tsx` → ink/paper equivalents (`#16161a` on paper). Zero `FACC15` hits when done.

- [ ] **Step 5: Restrain the decor.** In `FloatingDecor.tsx`, replace `ITEMS` colors with the restrained set (`'#16161a'`, `'#d8412f'`, `'#e3b341'`, `'#16161a'`, `'#6f6654'`, `'#d8412f'` in order a–f) and convert every `<Shape>` case to hairline strokes — each `fill={color}` becomes `fill="none" stroke={color} strokeWidth="1.3"`; in `leaf`, the white detail stroke becomes `stroke={color} strokeWidth="1"`; in `dots`, circles get `fill="none" stroke={color} strokeWidth="1.2"` and radius `2.4`. Positions/timing unchanged.

- [ ] **Step 6: VERIFY.** Run the standard verify block with `node scripts/shot.mjs http://localhost:3000/experiments/glasses /tmp/b1-after 0 0.24 0.5 0.85`. Expected: 0 = warm paper hero with graded sweep + stroke decor; 0.24 = dusk transition; 0.5/0.85 unchanged charcoal beats; no yellow field anywhere.

- [ ] **Step 7: Commit.** `git add -A components/experiments/glasses lib/data/experiments scripts/shot.mjs && git commit -m "feat(glasses): warm-paper palette regrade + hairline decor (#00XX)"`

---

### Task 2 (B2): Info panels — sequential fade + direction-aware auto-advance

**Files:**
- Modify: `components/experiments/glasses/InfoPanels.tsx:19-25` (band gaps)
- Modify: `components/experiments/glasses/GlassesExperience.tsx:28-32,44-47` (centers, snap logic)

**Interfaces:**
- Produces: `PANEL_CENTERS: readonly number[]` exported from `InfoPanels.tsx`; consumed by `GlassesExperience.tsx` for both `NAV_TARGET` and snapping. Derivation: band base `0.74`, span `(1 − 0.74) / 4 = 0.065`, centers `0.74 + 0.0325 + i·0.065` → `[0.7725, 0.8375, 0.9025, 0.9675]`.

- [ ] **Step 1: Non-overlapping bands.** In `InfoPanels.tsx`, replace `band()` and add the centers export:
  ```ts
  const BASE = 0.74;
  const TOTAL = 4; // GLASSES_CONTENT.info.length
  const SPAN = (1 - BASE) / TOTAL;
  /** Panel i's full-opacity center — shared with nav + scroll snapping. */
  export const PANEL_CENTERS: readonly number[] = Array.from(
    { length: TOTAL },
    (_, i) => BASE + SPAN / 2 + i * SPAN
  );
  /** Fade fully INSIDE the band (dead zone at each edge) so adjacent
   *  panels can never both be visible: at any boundary both are at 0. */
  function band(i: number, total: number): [number, number, number, number] {
    const start = BASE + i * ((1 - BASE) / total);
    const end = start + (1 - BASE) / total;
    return [start + 0.004, start + 0.022, end - 0.022, end - 0.004];
  }
  ```
  (`total` still flows through from props for the per-panel call; `TOTAL` only feeds `PANEL_CENTERS`.)

- [ ] **Step 2: Direction-aware snap.** In `GlassesExperience.tsx`:
  - `import InfoPanels, { PANEL_CENTERS } from './InfoPanels';`
  - Replace `NAV_TARGET` values with the derived centers:
    ```ts
    const NAV_TARGET: Record<string, number> = {
      '#info-approach': PANEL_CENTERS[1],
      '#info-platform': PANEL_CENTERS[2],
      '#info-join': PANEL_CENTERS[3],
    };
    ```
  - Add a snap ref and a `glideTo` helper, and extend the existing `useMotionValueEvent`:
    ```ts
    const snap = useRef({ gliding: false, lastV: 0 });

    const glideTo = (frac: number) => {
      const el = containerRef.current;
      const lenis = lenisRef.current;
      if (!el || !lenis) return;
      const dist = el.offsetHeight - window.innerHeight;
      snap.current.gliding = true;
      lenis.scrollTo(el.offsetTop + dist * frac, {
        duration: 0.9,
        onComplete: () => {
          snap.current.gliding = false;
          snap.current.lastV = frac;
        },
      });
    };

    useMotionValueEvent(scrollYProgress, 'change', (v) => {
      progressRef.current = v;
      const s = snap.current;
      const dir = v > s.lastV ? 1 : v < s.lastV ? -1 : 0;
      s.lastV = v;
      // Snap only inside the panels zone, only with Lenis, never mid-glide.
      if (s.gliding || !lenisRef.current || v < PANEL_CENTERS[0] - 0.03) return;
      let nearest = 0;
      for (let i = 1; i < PANEL_CENTERS.length; i++) {
        if (Math.abs(PANEL_CENTERS[i] - v) < Math.abs(PANEL_CENTERS[nearest] - v)) nearest = i;
      }
      const drift = v - PANEL_CENTERS[nearest];
      const HYST = 0.008; // ignore sub-threshold jitter
      if (dir > 0 && drift > HYST && nearest < PANEL_CENTERS.length - 1) glideTo(PANEL_CENTERS[nearest + 1]);
      else if (dir < 0 && drift < -HYST && nearest > 0) glideTo(PANEL_CENTERS[nearest - 1]);
      else if (Math.abs(drift) > HYST) glideTo(PANEL_CENTERS[nearest]);
    });
    ```
    (This REPLACES the old one-line `useMotionValueEvent` at lines 44–47 — `progressRef` is still updated first.) Reduced-motion users have no Lenis → no snapping, and Step 1's dead-zone bands alone guarantee no mixed text.

- [ ] **Step 3: VERIFY.** Standard verify block, then scripted checks:
  `node scripts/shot.mjs http://localhost:3000/experiments/glasses /tmp/b2 0.755 0.775 0.805 0.84 0.87 0.9`.
  Expected: every screenshot shows EITHER one panel or none — never two; shots near 0.775/0.84/0.9 show fully-opaque single panels (the snap pulls fractional positions to centers, so intermediate fracs settle on a center after the 1200 ms wait). Manually wheel-scroll up and down through the section in a browser once: each gesture lands cleanly on the next/previous panel.

- [ ] **Step 4: Commit.** `git add components/experiments/glasses && git commit -m "feat(glasses): sequential panel fades + direction-aware snap (#00XX)"`

---

### Task 3 (B3): HUD design system rewrite

**Files:**
- Modify: `lib/data/experiments/glasses.ts` (HUD theme tokens)
- Rewrite: `components/experiments/glasses/HudOverlay.tsx`

**Interfaces:**
- Consumes: `GlassesHud`, `GLASSES_PALETTE` (Task 1).
- Produces: `HUD_THEME` export in `lib/data/experiments/glasses.ts`:
  ```ts
  export const HUD_THEME = {
    phosphor: 'rgba(127,230,163,0.95)',
    phosphorDim: 'rgba(127,230,163,0.5)',
    focus: '#ffffff',
    glass: 'rgba(6,10,8,0.55)',
    glow: '0 0 6px rgba(127,230,163,0.55), 0 0 18px rgba(127,230,163,0.22)',
    fringe: '1px 0 0 rgba(255,80,80,0.28), -1px 0 0 rgba(90,130,255,0.28)',
  } as const;
  ```
  `HudOverlay` keeps its existing props signature (`scrollYProgress`, `words`, `hud`) — no caller changes.

- [ ] **Step 1: Add `HUD_THEME`** to `lib/data/experiments/glasses.ts` (block above, next to `GLASSES_PALETTE`).

- [ ] **Step 2: Rewrite `HudOverlay.tsx`.** Full replacement:
  ```tsx
  'use client';

  /**
   * Wearer-POV HUD — a real waveguide-display aesthetic. One grid, two colors
   * (phosphor + white focus word), tabular mono data, hairline brackets with a
   * faint chromatic fringe, spring-damped pointer parallax. Reduced motion falls
   * back to plain fades. DOM overlay, pointer-events-none.
   */

  import { useEffect, useRef, useState } from 'react';
  import {
    motion, useTransform, useMotionValueEvent, useMotionValue, useSpring,
    type MotionValue,
  } from 'framer-motion';
  import { Clock3, BatteryMedium, Radio } from 'lucide-react';
  import { HUD_THEME, type GlassesHud } from '@/lib/data/experiments/glasses';

  interface HudOverlayProps {
    scrollYProgress: MotionValue<number>;
    words: ReadonlyArray<string>;
    hud: GlassesHud;
  }

  const T = HUD_THEME;
  const CHIP = 'rounded-[3px] px-2 py-1 font-mono text-[10px] tracking-[0.22em]';

  function Bracket({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
    const map = {
      tl: 'left-0 top-0 border-l border-t',
      tr: 'right-0 top-0 border-r border-t',
      bl: 'left-0 bottom-0 border-l border-b',
      br: 'right-0 bottom-0 border-r border-b',
    } as const;
    return (
      <span
        className={`absolute h-6 w-6 ${map[pos]}`}
        style={{ borderColor: T.phosphorDim, boxShadow: T.fringe }}
      />
    );
  }

  export default function HudOverlay({ scrollYProgress, words, hud }: HudOverlayProps) {
    const opacity = useTransform(scrollYProgress, [0.34, 0.4, 0.56, 0.6], [0, 1, 1, 0]);

    const [active, setActive] = useState(false);
    const [idx, setIdx] = useState(0);
    const [reduce, setReduce] = useState(false);
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);

    // Pointer parallax — "projected, not printed" (disabled under reduced motion).
    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const sx = useSpring(px, { stiffness: 60, damping: 18 });
    const sy = useSpring(py, { stiffness: 60, damping: 18 });

    useEffect(() => {
      setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }, []);

    useEffect(() => {
      if (reduce) return;
      const onMove = (e: PointerEvent) => {
        px.set((e.clientX / window.innerWidth - 0.5) * 12);
        py.set((e.clientY / window.innerHeight - 0.5) * 10);
      };
      window.addEventListener('pointermove', onMove);
      return () => window.removeEventListener('pointermove', onMove);
    }, [reduce, px, py]);

    useMotionValueEvent(scrollYProgress, 'change', (v) => {
      const inWindow = v >= 0.34 && v <= 0.6;
      if (inWindow !== active) setActive(inWindow);
    });

    useEffect(() => {
      if (!active) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        setIdx(0);
        return;
      }
      timer.current = setInterval(() => setIdx((i) => (i + 1) % words.length), 320);
      return () => {
        if (timer.current) clearInterval(timer.current);
      };
    }, [active, words.length]);

    const word = words[idx] ?? '';

    // Staggered entrance; exits ~40% faster than entrances.
    const item = (delay: number) =>
      reduce
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : {
            initial: { opacity: 0, y: 6 },
            animate: {
              opacity: 1, y: 0,
              transition: { type: 'spring' as const, stiffness: 120, damping: 20, delay },
            },
            exit: { opacity: 0, transition: { duration: 0.14 } },
          };

    return (
      <motion.div
        style={{ opacity, x: reduce ? 0 : sx, y: reduce ? 0 : sy }}
        className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
        aria-hidden
      >
        <div
          className="relative grid h-[38vh] max-h-[360px] w-[min(76vw,540px)] grid-rows-[auto_1fr_auto]"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          <Bracket pos="tl" />
          <Bracket pos="tr" />
          <Bracket pos="bl" />
          <Bracket pos="br" />

          {/* Row 1 — ambient data, aligned to bracket edges */}
          {active && (
            <div className="flex items-start justify-between px-3 pt-3">
              <motion.span {...item(0.05)} className={`${CHIP} flex items-center gap-1.5`}
                style={{ color: T.phosphor, backgroundColor: T.glass, textShadow: T.glow }}>
                <Clock3 size={11} strokeWidth={1.5} /> {hud.time}
              </motion.span>
              <motion.span {...item(0.12)} className={`${CHIP} flex items-center gap-1.5`}
                style={{ color: T.phosphor, backgroundColor: T.glass, textShadow: T.glow }}>
                <BatteryMedium size={12} strokeWidth={1.5} /> {hud.battery}
              </motion.span>
            </div>
          )}

          {/* Row 2 — focal RSVP word + reticle */}
          <div className="flex flex-col items-center justify-center">
            {active && (
              <motion.div {...item(0)} className="flex flex-col items-center">
                <span className="mb-2 block h-2.5 w-px" style={{ backgroundColor: T.phosphorDim }} />
                <span className="rounded-md px-5 py-2" style={{ backgroundColor: T.glass }}>
                  <span key={idx} className="font-display text-3xl font-semibold tracking-tight sm:text-[2.25rem]"
                    style={{ color: T.focus, textShadow: T.glow }}>
                    {word}
                  </span>
                </span>
                {/* reticle underline */}
                <span className="mt-2 block h-px w-10" style={{ backgroundColor: T.phosphor, boxShadow: T.glow }} />
              </motion.div>
            )}
          </div>

          {/* Row 3 — status line */}
          {active && (
            <div className="flex justify-center pb-3">
              <motion.span {...item(0.18)} className={`${CHIP} flex items-center gap-1.5 uppercase`}
                style={{ color: T.phosphor, backgroundColor: T.glass, textShadow: T.glow }}>
                <Radio size={11} strokeWidth={1.5} /> {hud.label} · {hud.wpm} WPM · {hud.caption}
              </motion.span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }
  ```

- [ ] **Step 3: VERIFY.** Standard verify block with `node scripts/shot.mjs http://localhost:3000/experiments/glasses /tmp/b3 0.4 0.47 0.55`. Expected: HUD shows tabular mono chips with Lucide icons in the top corners, white focus word with phosphor glow + reticle underline, hairline brackets with a barely-visible chromatic fringe; all elements grid-aligned; only phosphor + white in use.

- [ ] **Step 4: Commit.** `git add components/experiments/glasses lib/data/experiments && git commit -m "feat(glasses): waveguide HUD design system (#00XX)"`

---

### Task 4 (B4): PBR material pass + local environment lighting

**Files:**
- Modify: `components/experiments/glasses/GlassesModel.tsx:88-104` (loader manager, material replacement)
- Modify: `components/experiments/glasses/GlassesScene.tsx` (light rig + local env)

**Interfaces:**
- Consumes: existing `FbxModel`, `normalize`, `FBX_KEEP`.
- Produces: no API changes — visual-only.

- [ ] **Step 1: Silence the texture 404 + replace materials.** In `GlassesModel.tsx`, replace `FbxModel` with:
  ```tsx
  /** 1x1 transparent PNG — FBX-referenced textures are missing on disk; redirect
   *  their fetches here so the loader never 404s (we replace materials anyway). */
  const BLANK_PX =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

  const ACETATE = new THREE.MeshPhysicalMaterial({
    color: '#17171c',
    roughness: 0.32,
    metalness: 0.08,
    clearcoat: 1,
    clearcoatRoughness: 0.22,
  });
  const LENS = new THREE.MeshPhysicalMaterial({
    color: '#2a3a3f',
    roughness: 0.06,
    metalness: 0,
    transmission: 0.85,
    transparent: true,
    opacity: 0.5,
    thickness: 0.25,
  });

  function FbxModel({ url, keep }: { url: string; keep?: string }) {
    const fbx = useLoader(FBXLoader, url, (loader) => {
      const mgr = new THREE.LoadingManager();
      mgr.setURLModifier((u) => (/\.(png|jpe?g|tga|tif|bmp)$/i.test(u) ? BLANK_PX : u));
      loader.manager = mgr;
    });
    const obj = useMemo(() => {
      const clone = fbx.clone(true);
      if (keep) {
        const drop: THREE.Object3D[] = [];
        clone.traverse((o) => {
          if ((o as THREE.Mesh).isMesh && o.name !== keep) drop.push(o);
        });
        drop.forEach((o) => o.parent?.remove(o));
      }
      // PBR pass: acetate frame; if the mesh has multiple material groups,
      // treat any material whose name hints at glass/lens as the lens.
      clone.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const assign = (m: THREE.Material) =>
          /lens|glass|transparent/i.test(m.name ?? '') ? LENS : ACETATE;
        mesh.material = Array.isArray(mesh.material)
          ? mesh.material.map(assign)
          : assign(mesh.material);
      });
      return normalize(clone, 2.7);
    }, [fbx, keep]);
    return <primitive object={obj} />;
  }
  ```
  (This folds the old `keep` pruning into the same function — the previous standalone pruning block in `FbxModel` is removed.)

- [ ] **Step 2: Local environment + tuned rig.** In `GlassesScene.tsx`:
  ```tsx
  import { Suspense, useEffect, type MutableRefObject } from 'react';
  import { Canvas, useThree } from '@react-three/fiber';
  import { RoomEnvironment } from 'three-stdlib';
  import * as THREE from 'three';
  import GlassesModel from './GlassesModel';

  /** PMREM-baked RoomEnvironment — ships in three-stdlib, zero network fetches. */
  function LocalEnvironment() {
    const { gl, scene } = useThree();
    useEffect(() => {
      const pmrem = new THREE.PMREMGenerator(gl);
      const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = env;
      return () => {
        scene.environment = null;
        env.dispose();
        pmrem.dispose();
      };
    }, [gl, scene]);
    return null;
  }
  ```
  Inside `<Canvas>`, replace the four existing lights with:
  ```tsx
  <LocalEnvironment />
  <ambientLight intensity={0.25} />
  <directionalLight position={[4, 6, 5]} intensity={1.1} />
  <directionalLight position={[-5, 2, -3]} intensity={0.35} color="#cfd8e6" />
  <directionalLight position={[0, 4, -6]} intensity={0.9} color="#fff4dd" />
  ```
  (key / fill / rim.)

- [ ] **Step 3: VERIFY.** Standard verify block with `node scripts/shot.mjs http://localhost:3000/experiments/glasses /tmp/b4 0 0.25 0.7 0.9`. Expected: frames read as dark glossy acetate with visible environment reflections and a warm rim highlight — no flat light-gray. Dev-server console shows **no 404** for any texture. Then full build check (stop dev → `npm run build` → export succeeds → restart dev).

- [ ] **Step 4: Commit.** `git add components/experiments/glasses && git commit -m "feat(glasses): PBR materials + local environment lighting (#00XX)"`

---

### Task 5 (A1): Landing scaffold — route, orchestrator, palette journey, data file

**Files:**
- Create: `app/landing-preview/layout.tsx`, `app/landing-preview/page.tsx`
- Create: `components/landing/LandingExperience.tsx`, `components/landing/LandingScene.tsx`, `components/landing/ModuleField.tsx` (placeholder)
- Create: `lib/data/landing.ts`
- Create: `public/assets/landing/DIGITAL_LOGO-removebg-preview.png` (copy from `/mnt/c/Users/DangT/curseforge/Downloads/DIGITAL_LOGO-removebg-preview.png`)

**Interfaces:**
- Produces (consumed by Tasks 6–8):
  - `LANDING_CONTENT` and `LANDING_PALETTE` from `lib/data/landing.ts` (shape below).
  - `LandingExperience` renders `LandingScene` with `progressRef: MutableRefObject<number>` and exposes `window.__lenis`.
  - `LandingScene` accepts `{ progressRef, onPortal }` where `onPortal: (href: string) => void`; Task 7 extends this with `onHover`.

- [ ] **Step 1: Copy the logo asset.**
  `mkdir -p public/assets/landing && cp "/mnt/c/Users/DangT/curseforge/Downloads/DIGITAL_LOGO-removebg-preview.png" public/assets/landing/`

- [ ] **Step 2: Data file `lib/data/landing.ts`:**
  ```ts
  /**
   * Copy + config for the Modules landing (/landing-preview).
   * Per CLAUDE.md all copy lives here. Wording gets a brand-voice pass in Task 8.
   */

  export interface MissionBeat {
    readonly id: string;
    readonly label: string;   // "WE EXPLORE"
    readonly line: string;    // supporting sentence
  }

  export interface LandingPortal {
    readonly id: 'phone' | 'glasses';
    readonly eyebrow: string;
    readonly title: string;
    readonly caption: string;
    readonly href: string;
  }

  export const LANDING_PALETTE = {
    studio: '#d6d4d3', studioMid: '#a8a5a3', chamber: '#16161a',
    ink: '#16161a', accent: '#d8412f',
  } as const;

  export const LANDING_CONTENT = {
    logoSrc: '/assets/landing/DIGITAL_LOGO-removebg-preview.png',
    wordmark: 'DIGITAL',
    eyebrow: 'DIGITAL @ Cal Poly Pomona',
    tagline: 'A student platform for building real technology.',
    skipLabel: 'Skip intro',
    mission: [
      { id: 'explore', label: 'WE EXPLORE', line: 'Real systems, real trade-offs, real constraints — hands-on from day one.' },
      { id: 'design', label: 'WE DESIGN', line: 'Hardware, software, mechanical, business — every discipline has a seat.' },
      { id: 'build', label: 'WE BUILD', line: 'Projects that rival commercial products, built by student teams.' },
      { id: 'communicate', label: 'WE COMMUNICATE', line: 'Ideas scoped, funded, and translated into value for people and industry.' },
    ] as readonly MissionBeat[],
    chamber: {
      eyebrow: 'What we are building',
      portals: [
        { id: 'phone', eyebrow: '01 · Flagship', title: 'The Modular Smartphone', caption: 'A repairable, upgradeable phone — take it apart layer by layer.', href: '/projects/modular-smartphone' },
        { id: 'glasses', eyebrow: '02 · Wearable', title: 'Smart Reading', caption: 'Heads-up glasses that bring the words to your eyes.', href: '/experiments/glasses' },
      ] as readonly LandingPortal[],
    },
    club: {
      joinHeading: 'Ready to build?',
      joinBody: 'Engineering, CS, design, business — no experience required.',
      joinCta: { label: 'Get involved', href: '/get-involved' },
      links: [
        { label: 'About', href: '/about' },
        { label: 'Projects', href: '/projects' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  } as const;
  ```
  (The glasses portal `href` is updated to `/projects/smart-reading` in Task 9.)

- [ ] **Step 3: Route files.**
  `app/landing-preview/layout.tsx`:
  ```tsx
  import type { Metadata } from 'next';

  export const metadata: Metadata = {
    title: 'DIGITAL — Built from Modules',
    description: 'A student platform for building real technology at Cal Poly Pomona.',
  };

  export default function LandingPreviewLayout({ children }: { children: React.ReactNode }) {
    return children;
  }
  ```
  `app/landing-preview/page.tsx`:
  ```tsx
  'use client';

  /** Staged landing revamp — promoted to `/` after team sign-off. R3F ⇒ client-only. */

  import dynamic from 'next/dynamic';

  const LandingExperience = dynamic(
    () => import('@/components/landing/LandingExperience'),
    { ssr: false }
  );

  export default function LandingPreviewPage() {
    return <LandingExperience />;
  }
  ```

- [ ] **Step 4: Orchestrator `components/landing/LandingExperience.tsx`** (same proven pattern as `GlassesExperience`):
  ```tsx
  'use client';

  /**
   * Orchestrator for the Modules landing. Lenis smooth scroll; useScroll progress
   * mirrored into progressRef for the R3F scene; background interpolates the
   * light→dark studio journey. Exposes window.__lenis for the screenshot harness.
   */

  import { useEffect, useRef, useState } from 'react';
  import { useRouter } from 'next/navigation';
  import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
  import Lenis from 'lenis';
  import { LANDING_CONTENT, LANDING_PALETTE } from '@/lib/data/landing';
  import LandingScene from './LandingScene';

  export default function LandingExperience() {
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(0);
    const lenisRef = useRef<Lenis | null>(null);
    const router = useRouter();
    const [webgl, setWebgl] = useState(true);
    const [reduce, setReduce] = useState(false);

    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ['start start', 'end end'],
    });

    useMotionValueEvent(scrollYProgress, 'change', (v) => {
      progressRef.current = v;
    });

    useEffect(() => {
      setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      const canvas = document.createElement('canvas');
      setWebgl(!!(canvas.getContext('webgl2') || canvas.getContext('webgl')));
    }, []);

    useEffect(() => {
      if (reduce) return;
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenisRef.current = lenis;
      (window as Window & { __lenis?: Lenis }).__lenis = lenis;
      let raf = 0;
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
        lenisRef.current = null;
      };
    }, [reduce]);

    const bg = useTransform(
      scrollYProgress,
      [0, 0.3, 0.6, 0.82],
      [LANDING_PALETTE.studio, LANDING_PALETTE.studio, LANDING_PALETTE.studioMid, LANDING_PALETTE.chamber]
    );

    const onPortal = (href: string) => router.push(href);

    // Static fallback (no WebGL / reduced motion) — completed in Task 7.
    if (!webgl || reduce) {
      return (
        <main className="min-h-screen bg-[#16161a] px-8 py-24 text-center text-white">
          <p className="font-mono text-xs uppercase tracking-[0.26em] opacity-70">
            {LANDING_CONTENT.eyebrow}
          </p>
          <h1 className="mt-6 font-display text-6xl font-extrabold uppercase tracking-tight">
            {LANDING_CONTENT.wordmark}
          </h1>
          <p className="mx-auto mt-4 max-w-md font-body text-base opacity-75">
            {LANDING_CONTENT.tagline}
          </p>
        </main>
      );
    }

    return (
      <div ref={containerRef} className="relative h-[700vh] bg-[#d6d4d3]">
        <motion.div
          style={{ backgroundColor: bg }}
          className="sticky top-0 h-screen w-full overflow-hidden"
        >
          {/* sweep + grain (same treatment as the glasses regrade) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] opacity-60"
            style={{
              background:
                'radial-gradient(120% 90% at 50% 38%, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.24) 100%)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] opacity-[0.05] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
          <LandingScene progressRef={progressRef} onPortal={onPortal} />
          {/* MissionBeats overlay mounts here in Task 7 */}
        </motion.div>
        {/* ClubStrip mounts after the track in Task 7 */}
      </div>
    );
  }
  ```

- [ ] **Step 5: Scene shell `components/landing/LandingScene.tsx`:**
  ```tsx
  'use client';

  /** R3F canvas for the Modules landing. Client-only; plain local lights only. */

  import { Suspense, type MutableRefObject } from 'react';
  import { Canvas } from '@react-three/fiber';
  import ModuleField from './ModuleField';

  export interface LandingSceneProps {
    progressRef: MutableRefObject<number>;
    onPortal: (href: string) => void;
  }

  export default function LandingScene({ progressRef, onPortal }: LandingSceneProps) {
    void onPortal; // consumed by ProductChamber in Task 7
    return (
      <Canvas
        className="!absolute inset-0 z-[2]"
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 7], fov: 40 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 5]} intensity={1.2} />
        <directionalLight position={[0, 3, -6]} intensity={0.7} color="#fff2df" />
        <Suspense fallback={null}>
          <ModuleField progressRef={progressRef} />
        </Suspense>
      </Canvas>
    );
  }
  ```
  Minimal `components/landing/ModuleField.tsx` placeholder so this task compiles standalone (Task 6 replaces it entirely):
  ```tsx
  'use client';

  import type { MutableRefObject } from 'react';

  /** Instanced block field — full implementation lands in the next task. */
  export default function ModuleField(_: { progressRef: MutableRefObject<number> }) {
    return (
      <mesh>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#16161a" />
      </mesh>
    );
  }
  ```

- [ ] **Step 6: VERIFY.** Standard verify block with `node scripts/shot.mjs http://localhost:3000/landing-preview /tmp/a1 0 0.5 0.9`. Expected: sweep+grain background interpolating light→dark across the three shots, a single ink cube rendered, no console errors, `window.__lenis` defined.

- [ ] **Step 7: Commit.** `git add app/landing-preview components/landing lib/data/landing.ts public/assets/landing && git commit -m "feat(landing): scaffold /landing-preview route + scroll orchestrator (#00XX)"`

---

### Task 6 (A2): ModuleField — formations, logo sampling, intro + skip

**Files:**
- Create: `components/landing/formations.ts`
- Rewrite: `components/landing/ModuleField.tsx`
- Modify: `components/landing/LandingExperience.tsx` + `LandingScene.tsx` (intro state, skip button, prop threading)

**Interfaces:**
- Consumes: `LANDING_CONTENT.logoSrc`, `LANDING_CONTENT.skipLabel`, `progressRef`.
- Produces: `formations.ts` exports (Task 7 reuses nothing from it directly, but `ModuleField`'s chamber formation forms the phone silhouette Task 7's hit-box sits over):
  ```ts
  export const BLOCK_COUNT = 300;
  export type Formation = Float32Array; // length BLOCK_COUNT * 3
  export function sphere(count: number, r?: number): Formation;
  export function compass(count: number): Formation;
  export function blueprintGrid(count: number): Formation;
  export function stack(count: number): Formation;
  export function wave(count: number): Formation;
  export function phoneSlab(count: number): Formation;      // slab at x = -1.6
  export function pedestals(count: number): Formation;      // pads under both exhibits
  export function logoFromImage(url: string, count: number): Promise<Formation>;
  ```
  `ModuleField` props become `{ progressRef, introDone, onIntroEnd }`; `LandingSceneProps` gains `introDone: boolean; onIntroEnd: () => void`.

- [ ] **Step 1: `components/landing/formations.ts`:**
  ```ts
  /**
   * Precomputed block-target formations for the Modules landing.
   * Every formation returns BLOCK_COUNT xyz triplets in world units
   * (scene is framed for roughly x ∈ [-3.4, 3.4], y ∈ [-2, 2.2]).
   */

  export const BLOCK_COUNT = 300;
  export type Formation = Float32Array;

  function make(
    count: number,
    fill: (i: number, set: (x: number, y: number, z: number) => void) => void
  ): Formation {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      fill(i, (x, y, z) => {
        a[i * 3] = x; a[i * 3 + 1] = y; a[i * 3 + 2] = z;
      });
    }
    return a;
  }

  /** Deterministic pseudo-random (no Math.random → stable between renders). */
  function prand(i: number, salt: number): number {
    const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  export function sphere(count: number, r = 5): Formation {
    return make(count, (i, set) => {
      const t = prand(i, 1) * Math.PI * 2;
      const p = Math.acos(2 * prand(i, 2) - 1);
      const rr = r * (0.7 + 0.3 * prand(i, 3));
      set(rr * Math.sin(p) * Math.cos(t), rr * Math.sin(p) * Math.sin(t), rr * Math.cos(p) - 2);
    });
  }

  export function compass(count: number): Formation {
    return make(count, (i, set) => {
      if (i % 5 === 0) {
        const spoke = Math.floor(i / 5) % 8;
        const ang = (spoke / 8) * Math.PI * 2;
        const d = 0.5 + prand(i, 4) * 1.6;
        set(Math.cos(ang) * d, Math.sin(ang) * d, 0);
      } else {
        const ang = prand(i, 5) * Math.PI * 2;
        const ring = 1.9 + 0.12 * (i % 3);
        set(Math.cos(ang) * ring, Math.sin(ang) * ring, (prand(i, 6) - 0.5) * 0.4);
      }
    });
  }

  export function blueprintGrid(count: number): Formation {
    const cols = 20;
    return make(count, (i, set) => {
      const cx = (i % cols) - cols / 2 + 0.5;
      const cy = Math.floor(i / cols) - count / cols / 2 + 0.5;
      set(cx * 0.32, cy * 0.32, (prand(i, 7) - 0.5) * 0.15);
    });
  }

  export function stack(count: number): Formation {
    const towers = 7;
    return make(count, (i, set) => {
      const t = i % towers;
      const level = Math.floor(i / towers);
      set(
        (t - (towers - 1) / 2) * 0.85 + (prand(i, 8) - 0.5) * 0.1,
        -1.6 + level * 0.22,
        (prand(i, 9) - 0.5) * 0.5
      );
    });
  }

  export function wave(count: number): Formation {
    const cols = 30;
    return make(count, (i, set) => {
      const cx = (i % cols) / cols;
      const row = Math.floor(i / cols);
      set((cx - 0.5) * 6.4, Math.sin(cx * Math.PI * 3) * 0.9 + (row - 5) * 0.16, (prand(i, 10) - 0.5) * 0.3);
    });
  }

  /** Modular phone: a 4×8×2 module lattice standing at x = -1.6. */
  export function phoneSlab(count: number): Formation {
    return make(count, (i, set) => {
      const idx = i % 64;
      const col = idx % 4;
      const row = Math.floor(idx / 4) % 8;
      const layer = Math.floor(idx / 32);
      if (i < 64) set(-1.6 + (col - 1.5) * 0.3, (row - 3.5) * 0.42, (layer - 0.5) * 0.3);
      else set((prand(i, 11) - 0.5) * 7, -2.1, -1.5 - prand(i, 12) * 3); // dim floor scatter
    });
  }

  export function pedestals(count: number): Formation {
    return make(count, (i, set) => {
      const side = i % 2 === 0 ? -1.6 : 1.6;
      const idx = Math.floor(i / 2) % 24;
      const col = idx % 6;
      const row = Math.floor(idx / 6);
      if (i < 96) set(side + (col - 2.5) * 0.3, -1.9 + row * 0.16, (prand(i, 13) - 0.5) * 0.6);
      else set((prand(i, 14) - 0.5) * 8, -2.2, -2 - prand(i, 15) * 3);
    });
  }

  /**
   * Sample the logo mark from the PNG's alpha channel. The file contains the
   * square circuit-mark on top and a wordmark below; take only pixels in the
   * upper 55% of the opaque bounding box (the mark).
   */
  export function logoFromImage(url: string, count: number): Promise<Formation> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const S = 110;
        const cv = document.createElement('canvas');
        cv.width = S; cv.height = S;
        const ctx = cv.getContext('2d');
        if (!ctx) return reject(new Error('2d context unavailable'));
        ctx.drawImage(img, 0, 0, S, S);
        const data = ctx.getImageData(0, 0, S, S).data;
        let minY = S, maxY = 0;
        for (let y = 0; y < S; y++)
          for (let x = 0; x < S; x++)
            if (data[(y * S + x) * 4 + 3] > 100) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
        const cutY = minY + (maxY - minY) * 0.55;
        const pts: Array<[number, number]> = [];
        for (let y = 0; y < S; y++)
          for (let x = 0; x < S; x++)
            if (data[(y * S + x) * 4 + 3] > 100 && y < cutY) pts.push([x, y]);
        if (pts.length === 0) return reject(new Error('no opaque pixels found'));
        const a = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          const [px, py] = pts[Math.floor(prand(i, 16) * pts.length)];
          a[i * 3] = (px / S - 0.5) * 4.4;
          a[i * 3 + 1] = (0.5 - py / S) * 4.4 + 0.4;
          a[i * 3 + 2] = (prand(i, 17) - 0.5) * 0.25;
        }
        resolve(a);
      };
      img.onerror = () => reject(new Error(`logo image failed: ${url}`));
      img.src = url;
    });
  }
  ```

- [ ] **Step 2: Rewrite `ModuleField.tsx`:**
  ```tsx
  'use client';

  /**
   * The instanced block field. A time-based intro assembles the logo formation;
   * after that, scroll progress drives eased transitions between formations:
   * logo → orbit → compass → grid → stack → wave → chamber (phone + pedestals).
   */

  import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
  import { useFrame } from '@react-three/fiber';
  import * as THREE from 'three';
  import { LANDING_CONTENT } from '@/lib/data/landing';
  import {
    BLOCK_COUNT, sphere, compass, blueprintGrid, stack, wave, pedestals,
    phoneSlab, logoFromImage, type Formation,
  } from './formations';

  const { clamp, lerp } = THREE.MathUtils;
  const ease = (t: number) => { const x = clamp(t, 0, 1); return x * x * (3 - 2 * x); };

  /** progress boundaries between consecutive formations (spec §2.4). */
  const SEGS = [0.12, 0.25, 0.4, 0.55, 0.7, 0.82] as const;

  interface ModuleFieldProps {
    progressRef: MutableRefObject<number>;
    introDone: boolean;
    onIntroEnd: () => void;
  }

  /** Chamber = phone slab for the first half of blocks, pedestals for the rest. */
  function mergeChamber(a: Formation, b: Formation): Formation {
    const out = new Float32Array(a.length);
    for (let i = 0; i < BLOCK_COUNT; i++) {
      const src = i < BLOCK_COUNT / 2 ? a : b;
      out[i * 3] = src[i * 3]; out[i * 3 + 1] = src[i * 3 + 1]; out[i * 3 + 2] = src[i * 3 + 2];
    }
    return out;
  }

  export default function ModuleField({ progressRef, introDone, onIntroEnd }: ModuleFieldProps) {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const [, setLogoReady] = useState(false);
    const intro = useRef(0); // 0→1 over ~2.8s
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const forms = useMemo(() => {
      const start = sphere(BLOCK_COUNT, 6);
      return {
        start,
        list: [
          start, // index 0 = logo; replaced when sampling resolves
          sphere(BLOCK_COUNT, 3),
          compass(BLOCK_COUNT),
          blueprintGrid(BLOCK_COUNT),
          stack(BLOCK_COUNT),
          wave(BLOCK_COUNT),
          mergeChamber(phoneSlab(BLOCK_COUNT), pedestals(BLOCK_COUNT)),
        ] as Formation[],
      };
    }, []);

    useEffect(() => {
      logoFromImage(LANDING_CONTENT.logoSrc, BLOCK_COUNT)
        .then((f) => { forms.list[0] = f; setLogoReady(true); })
        .catch((err) => {
          if (process.env.NODE_ENV !== 'production') console.warn('[landing] logo sample failed:', err);
          forms.list[0] = blueprintGrid(BLOCK_COUNT); // graceful fallback shape
          setLogoReady(true);
        });
    }, [forms]);

    useFrame((_, delta) => {
      const m = mesh.current;
      if (!m) return;

      if (!introDone) {
        intro.current = Math.min(1, intro.current + delta / 2.8);
        if (intro.current >= 1) onIntroEnd();
      }

      const p = progressRef.current;
      let from: Formation; let to: Formation; let t: number;
      if (!introDone || p <= SEGS[0]) {
        from = forms.start; to = forms.list[0]; t = introDone ? 1 : ease(intro.current);
      } else if (p >= SEGS[SEGS.length - 1]) {
        from = forms.list[forms.list.length - 1]; to = from; t = 1;
      } else {
        let seg = 0;
        while (seg < SEGS.length - 1 && p > SEGS[seg + 1]) seg++;
        from = forms.list[seg]; to = forms.list[seg + 1];
        t = ease((p - SEGS[seg]) / (SEGS[seg + 1] - SEGS[seg]));
      }

      for (let i = 0; i < BLOCK_COUNT; i++) {
        dummy.position.set(
          lerp(from[i * 3], to[i * 3], t),
          lerp(from[i * 3 + 1], to[i * 3 + 1], t),
          lerp(from[i * 3 + 2], to[i * 3 + 2], t)
        );
        dummy.rotation.set(0, (i % 7) * 0.12 + t * 0.4, 0);
        dummy.scale.setScalar(0.11 + (i % 5) * 0.012);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
      }
      m.instanceMatrix.needsUpdate = true;
    });

    return (
      <instancedMesh ref={mesh} args={[undefined, undefined, BLOCK_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#16161a" roughness={0.5} metalness={0.15} />
      </instancedMesh>
    );
  }
  ```

- [ ] **Step 3: Intro state + skip button.** In `LandingExperience.tsx`: add `const [introDone, setIntroDone] = useState(false);`; pass `introDone={introDone} onIntroEnd={() => setIntroDone(true)}` into `LandingScene` (extend `LandingSceneProps` and forward both into `ModuleField`); render the skip control inside the sticky div:
  ```tsx
  {!introDone && (
    <button
      type="button"
      onClick={() => setIntroDone(true)}
      className="absolute bottom-8 right-8 z-30 rounded-full border border-ink/30 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70 transition-colors hover:border-ink hover:text-ink"
    >
      {LANDING_CONTENT.skipLabel}
    </button>
  )}
  ```

- [ ] **Step 4: VERIFY.** Standard verify block with `node scripts/shot.mjs http://localhost:3000/landing-preview /tmp/a2 0 0.18 0.32 0.47 0.62 0.76 0.9`. Expected: 0 = blocks assembled into the logo-mark silhouette (compare against the PNG by eye); 0.18 = dispersed orbit; 0.32/0.47/0.62/0.76 = compass → grid → stack → wave; 0.9 = phone slab + two pedestals on dark. Skip button visible only during the intro.

- [ ] **Step 5: Commit.** `git add components/landing && git commit -m "feat(landing): instanced module formations + logo assembly intro (#00XX)"`

---

### Task 7 (A3): ProductChamber portals + MissionBeats + ClubStrip + fallback

**Files:**
- Create: `components/landing/ProductChamber.tsx`, `components/landing/MissionBeats.tsx`, `components/landing/ClubStrip.tsx`
- Modify: `components/landing/LandingScene.tsx` (mount chamber, `onHover` prop, context-loss handler), `components/landing/LandingExperience.tsx` (mount overlays + full static fallback)

**Interfaces:**
- Consumes: `LANDING_CONTENT.chamber.portals`, `onPortal(href)`, `progressRef`; `stats`, `sponsors` from `@/lib/data/siteConfig`.
- Produces: `ProductChamber` props `{ progressRef, onPortal, onHover: (id: string | null) => void }`; `MissionBeats` props `{ scrollYProgress, hoveredId?: string | null }`; `ClubStrip` props: none.

- [ ] **Step 1: `ProductChamber.tsx`** — glasses exhibit + interaction (the phone silhouette is the block formation; this adds the FBX, hit-boxes, spotlights):
  ```tsx
  'use client';

  /**
   * Final-beat exhibits. The block field forms the phone; this adds the real
   * glasses FBX on the right pedestal, invisible hit-boxes over both exhibits,
   * and spotlights that answer hover. Click = brief beat, then route.
   */

  import { useMemo, useRef, useState, type MutableRefObject } from 'react';
  import { useFrame, useLoader } from '@react-three/fiber';
  import { FBXLoader } from 'three-stdlib';
  import * as THREE from 'three';
  import { LANDING_CONTENT } from '@/lib/data/landing';

  const GLASSES_URL = '/assets/experiments/glasses/Sunglasses.fbx';
  const KEEP = 'Large_Framed_Glasses_';

  function normalize(obj: THREE.Object3D, target: number): THREE.Object3D {
    const clone = obj.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3(); const center = new THREE.Vector3();
    box.getSize(size); box.getCenter(center);
    clone.position.sub(center);
    const wrapper = new THREE.Group();
    wrapper.add(clone);
    wrapper.scale.setScalar(target / (Math.max(size.x, size.y, size.z) || 1));
    return wrapper;
  }

  interface ProductChamberProps {
    progressRef: MutableRefObject<number>;
    onPortal: (href: string) => void;
    onHover: (id: string | null) => void;
  }

  export default function ProductChamber({ progressRef, onPortal, onHover }: ProductChamberProps) {
    const root = useRef<THREE.Group>(null);
    const exhibit = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState<string | null>(null);
    const leaving = useRef(false);

    const fbx = useLoader(FBXLoader, GLASSES_URL);
    const glasses = useMemo(() => {
      const clone = fbx.clone(true);
      const drop: THREE.Object3D[] = [];
      clone.traverse((o) => {
        if ((o as THREE.Mesh).isMesh && o.name !== KEEP) drop.push(o);
      });
      drop.forEach((o) => o.parent?.remove(o));
      clone.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: '#17171c', roughness: 0.32, metalness: 0.08,
            clearcoat: 1, clearcoatRoughness: 0.22,
          });
        }
      });
      return normalize(clone, 1.7);
    }, [fbx]);

    useFrame((state) => {
      const g = root.current;
      if (!g) return;
      const p = progressRef.current;
      const vis = THREE.MathUtils.clamp((p - 0.78) / 0.08, 0, 1);
      g.visible = vis > 0.01;
      g.position.y = (1 - vis) * -1.2;
      if (exhibit.current) exhibit.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.25;
    });

    const enter = (id: string) => { setHovered(id); onHover(id); document.body.style.cursor = 'pointer'; };
    const leave = () => { setHovered(null); onHover(null); document.body.style.cursor = ''; };
    const click = (href: string) => {
      if (leaving.current) return;
      leaving.current = true;
      setTimeout(() => onPortal(href), 350);
    };
    const [phone, glassesPortal] = LANDING_CONTENT.chamber.portals;

    return (
      <group ref={root}>
        <spotLight position={[-1.6, 3.2, 2]} angle={0.5} penumbra={0.6}
          intensity={hovered === 'phone' ? 2.4 : 1.2} color="#fff4dd" />
        <spotLight position={[1.6, 3.2, 2]} angle={0.5} penumbra={0.6}
          intensity={hovered === 'glasses' ? 2.4 : 1.2} color="#fff4dd" />

        <group ref={exhibit} position={[1.6, -0.4, 0]} scale={hovered === 'glasses' ? 1.05 : 1}>
          <primitive object={glasses} />
        </group>

        <mesh position={[-1.6, 0, 0]} visible={false}
          onPointerOver={(e) => { e.stopPropagation(); enter('phone'); }}
          onPointerOut={leave}
          onClick={(e) => { e.stopPropagation(); click(phone.href); }}>
          <boxGeometry args={[1.6, 3.8, 1]} />
        </mesh>
        <mesh position={[1.6, -0.4, 0]} visible={false}
          onPointerOver={(e) => { e.stopPropagation(); enter('glasses'); }}
          onPointerOut={leave}
          onClick={(e) => { e.stopPropagation(); click(glassesPortal.href); }}>
          <boxGeometry args={[2.2, 1.6, 1.4]} />
        </mesh>
      </group>
    );
  }
  ```
  In `LandingScene.tsx`: add `onHover: (id: string | null) => void` to `LandingSceneProps`, mount `<ProductChamber progressRef={progressRef} onPortal={onPortal} onHover={onHover} />` inside `<Suspense>` after `ModuleField`, remove the `void onPortal;` line, and add the context-loss handler on the Canvas:
  `onCreated={({ gl }) => { gl.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); window.location.reload(); }); }}`.

- [ ] **Step 2: `MissionBeats.tsx`** — DOM overlay bands (bands from the spec §2.4 table):
  ```tsx
  'use client';

  /** Mission narrative overlays + hero wordmark + chamber labels. */

  import { motion, useTransform, type MotionValue } from 'framer-motion';
  import { LANDING_CONTENT } from '@/lib/data/landing';

  const BEAT_BANDS: ReadonlyArray<[number, number, number, number]> = [
    [0.25, 0.28, 0.37, 0.4],
    [0.4, 0.43, 0.52, 0.55],
    [0.55, 0.58, 0.67, 0.7],
    [0.7, 0.73, 0.79, 0.82],
  ];

  function Beat({ i, scrollYProgress }: { i: number; scrollYProgress: MotionValue<number> }) {
    const [a, b, c, d] = BEAT_BANDS[i];
    const opacity = useTransform(scrollYProgress, [a, b, c, d], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [a, b], [24, 0]);
    const beat = LANDING_CONTENT.mission[i];
    const dark = i >= 2; // background has darkened by the 3rd beat
    return (
      <motion.div style={{ opacity, y }}
        className="absolute inset-x-0 top-[18%] z-20 mx-auto max-w-2xl px-6 text-center">
        <h2 className={`font-display text-4xl font-extrabold uppercase tracking-tight sm:text-6xl ${dark ? 'text-studio' : 'text-ink'}`}>
          {beat.label}
        </h2>
        <p className={`mx-auto mt-4 max-w-md font-body text-base leading-relaxed ${dark ? 'text-studio/70' : 'text-ink-soft'}`}>
          {beat.line}
        </p>
      </motion.div>
    );
  }

  interface MissionBeatsProps {
    scrollYProgress: MotionValue<number>;
    hoveredId?: string | null;
  }

  export default function MissionBeats({ scrollYProgress, hoveredId }: MissionBeatsProps) {
    const heroOpacity = useTransform(scrollYProgress, [0, 0.08, 0.14], [1, 1, 0]);
    const chamberOpacity = useTransform(scrollYProgress, [0.84, 0.88, 1], [0, 1, 1]);
    const { eyebrow, wordmark, tagline, chamber } = LANDING_CONTENT;
    return (
      <div className="pointer-events-none absolute inset-0 z-20">
        {/* Hero wordmark under the assembling mark */}
        <motion.div style={{ opacity: heroOpacity }}
          className="absolute inset-x-0 bottom-[12%] text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-ink-soft">{eyebrow}</p>
          <h1 className="mt-3 font-display text-5xl font-extrabold uppercase tracking-tight text-ink sm:text-7xl">
            {wordmark}
          </h1>
          <p className="mt-3 font-body text-base text-ink-soft">{tagline}</p>
        </motion.div>

        {LANDING_CONTENT.mission.map((m, i) => (
          <Beat key={m.id} i={i} scrollYProgress={scrollYProgress} />
        ))}

        {/* Chamber labels — pointer events ON so the DOM links also work */}
        <motion.div style={{ opacity: chamberOpacity }}
          className="pointer-events-auto absolute inset-x-0 bottom-[8%] z-20">
          <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.26em] text-studio/60">
            {chamber.eyebrow}
          </p>
          <div className="mx-auto flex max-w-3xl justify-between px-10">
            {chamber.portals.map((pt) => (
              <a key={pt.id} href={pt.href} className="group text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{pt.eyebrow}</p>
                <p className={`mt-1 font-display text-xl font-bold uppercase tracking-tight text-studio group-hover:underline ${hoveredId === pt.id ? 'underline' : ''}`}>
                  {pt.title}
                </p>
                <p className="mt-1 max-w-[28ch] font-body text-sm text-studio/60">{pt.caption}</p>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }
  ```

- [ ] **Step 3: `ClubStrip.tsx`** — dark closing section (normal flow after the 700vh track):
  ```tsx
  'use client';

  /** Dark club strip after the chamber: stats, sponsors, join CTA, footer links. */

  import Link from 'next/link';
  import Image from 'next/image';
  import { LANDING_CONTENT } from '@/lib/data/landing';
  import { stats, sponsors } from '@/lib/data/siteConfig';

  const statItems = [
    { value: stats.activeMembers, label: 'Active Members' },
    { value: stats.prototypes, label: 'Prototypes' },
    { value: stats.sponsors, label: 'Sponsors' },
  ];

  export default function ClubStrip() {
    const { club, logoSrc } = LANDING_CONTENT;
    return (
      <section className="relative z-10 bg-[#16161a] px-8 py-24 text-center">
        <Image src={logoSrc} alt="DIGITAL @ Cal Poly Pomona" width={140} height={140} className="mx-auto" />
        <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-6">
          {statItems.map((s) => (
            <div key={s.label}>
              <span className="font-display text-4xl font-extrabold text-white">{s.value}</span>
              <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8">
          {sponsors.map((sp) => (
            <span key={sp.name} className="font-display text-sm font-semibold uppercase text-white/40">
              {sp.name}
            </span>
          ))}
        </div>
        <h2 className="mt-20 font-display text-4xl font-extrabold uppercase tracking-tight text-white">
          {club.joinHeading}
        </h2>
        <p className="mx-auto mt-3 max-w-md font-body text-base text-white/60">{club.joinBody}</p>
        <Link href={club.joinCta.href}
          className="mt-8 inline-block rounded-full bg-white px-7 py-3 font-display text-sm font-bold uppercase tracking-tight text-[#16161a] transition-colors hover:bg-[#d8412f] hover:text-white">
          {club.joinCta.label}
        </Link>
        <nav className="mt-16 flex justify-center gap-8">
          {club.links.map((l) => (
            <Link key={l.href} href={l.href}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>
      </section>
    );
  }
  ```
  Note: `next/image` with static export requires `images.unoptimized` in `next.config.js` — the repo already exports statically with `Image` used on the home page, so no config change is expected; if the build complains, switch the logo to a plain `<img>` with an eslint-disable comment matching the existing `TeardownMobilePoster` pattern.

- [ ] **Step 4: Wire into `LandingExperience.tsx`:**
  - `const [hoveredPortal, setHoveredPortal] = useState<string | null>(null);`
  - Mount `<MissionBeats scrollYProgress={scrollYProgress} hoveredId={hoveredPortal} />` inside the sticky div after `LandingScene`; pass `onHover={setHoveredPortal}` into `LandingScene`.
  - Change the WebGL branch's return to a fragment ending with `<ClubStrip />` after the scroll container `</div>`.
  - Extend the static fallback: after the tagline, add the two portal cards and `<ClubStrip />`:
    ```tsx
    <div className="mx-auto mt-12 flex max-w-2xl flex-col justify-center gap-6 sm:flex-row">
      {LANDING_CONTENT.chamber.portals.map((pt) => (
        <a key={pt.id} href={pt.href} className="rounded-lg border border-white/20 p-6 text-left hover:border-white">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#d8412f]">{pt.eyebrow}</p>
          <p className="mt-2 font-display text-xl font-bold uppercase">{pt.title}</p>
          <p className="mt-1 font-body text-sm opacity-60">{pt.caption}</p>
        </a>
      ))}
    </div>
    ```
    (wrap the fallback `<main>` + `<ClubStrip />` in a fragment).

- [ ] **Step 5: VERIFY.** Standard verify block with `node scripts/shot.mjs http://localhost:3000/landing-preview /tmp/a3 0 0.3 0.6 0.88 0.99`. Expected: hero wordmark under the logo blocks; mission beats legible with correct light/dark text; 0.88 = chamber with FBX glasses right, block phone left, labels below; 0.99 = ClubStrip. In a real browser: click each exhibit → routes to `/projects/modular-smartphone` and `/experiments/glasses`. Full build check.

- [ ] **Step 6: Commit.** `git add components/landing && git commit -m "feat(landing): product chamber portals, mission beats, club strip (#00XX)"`

---

### Task 8 (A4): Landing copy pass (brand-voice-strategist)

**Files:**
- Modify: `lib/data/landing.ts` (string values only)

**Note:** Executed by **Claude directly** (dispatch the `.claude/agents/brand-voice-strategist.md` agent), not Codex.

- [ ] **Step 1:** Dispatch the `brand-voice-strategist` agent with: the current `lib/data/landing.ts`, the user's mission statement (spec §2.6), and constraints — `label`s stay in the "WE …" imperative form; every `line` ≤ 110 characters; string values only, no structural edits.
- [ ] **Step 2:** `npx tsc --noEmit` → 0. Restart dev; `node scripts/shot.mjs http://localhost:3000/landing-preview /tmp/a4 0.3 0.47 0.62 0.76`. Expected: refined copy renders without overflow.
- [ ] **Step 3: Commit.** `git add lib/data/landing.ts && git commit -m "feat(landing): brand-voice copy pass (#00XX)"`

---

### Task 9 (C1): Promote glasses to /projects/smart-reading

**Files:**
- Create: `app/projects/smart-reading/page.tsx`
- Rewrite: `app/experiments/glasses/page.tsx` (redirect stub)
- Modify: `lib/data/projects.ts:62-74` (replace placeholder entry), `app/projects/[slug]/page.tsx:18-27` (exclusion), `lib/data/landing.ts` (portal href)

**Interfaces:**
- Consumes: existing `Project` type from `lib/types`.
- Produces: route `/projects/smart-reading`; project entry `slug: 'smart-reading'`.

- [ ] **Step 1: New route** `app/projects/smart-reading/page.tsx`:
  ```tsx
  'use client';

  /**
   * Smart Reading — flagship wearable. The immersive scroll experience (R3F)
   * must be client-only: dynamic import with ssr:false for the static export.
   */

  import dynamic from 'next/dynamic';

  const GlassesExperience = dynamic(
    () => import('@/components/experiments/glasses/GlassesExperience'),
    { ssr: false }
  );

  export default function SmartReadingPage() {
    return <GlassesExperience />;
  }
  ```

- [ ] **Step 2: Redirect stub** — replace the body of `app/experiments/glasses/page.tsx`:
  ```tsx
  'use client';

  /** Legacy URL — the experience was promoted to /projects/smart-reading. */

  import { useEffect } from 'react';
  import { useRouter } from 'next/navigation';

  export default function LegacyGlassesRedirect() {
    const router = useRouter();
    useEffect(() => {
      router.replace('/projects/smart-reading');
    }, [router]);
    return null;
  }
  ```

- [ ] **Step 3: Project data.** In `lib/data/projects.ts`, replace the entire `heads-up-display-glasses` placeholder object (lines 62–74) with:
  ```ts
  {
    id: 'smart-reading',
    slug: 'smart-reading',
    title: 'Smart Reading',
    shortDescription:
      'FPGA-based heads-up glasses that show one word at a time, right where you look. Built with dyslexic readers in mind.',
    fullDescription:
      'Smart Reading uses RSVP — rapid serial visual presentation — to stream text one word at a time at a fixed focal point, so the eyes never have to chase the line. An FPGA renders the stream in real time on an open, documented hardware platform, mentored by Dr. Mohamed El Hadedy.',
    category: 'wearable',
    status: 'active',
    isFlagship: true,
    image: '/images/placeholders/projects/modular-phone.svg',
    techStack: ['FPGA', 'RSVP', 'Optics', 'Verilog', 'Embedded C'],
    stats: [
      { label: 'Method', value: 'RSVP' },
      { label: 'Compute', value: 'FPGA' },
      { label: 'Build Cycle', value: '8 months' },
    ],
  },
  ```
  (Image stays the placeholder SVG until a real render exists — say so in the commit body.)

- [ ] **Step 4: Exclude from `[slug]`.** In `app/projects/[slug]/page.tsx` `generateStaticParams`:
  ```ts
  // Exclude slugs with dedicated static segments — duplicating them here
  // would cause a duplicate-route build error.
  const DEDICATED = ['modular-smartphone', 'smart-reading'];
  return projects
    .filter((p) => !DEDICATED.includes(p.slug))
    .map((project) => ({ slug: project.slug }));
  ```

- [ ] **Step 5: Landing portal href.** In `lib/data/landing.ts`, change the glasses portal `href` from `/experiments/glasses` to `/projects/smart-reading`.

- [ ] **Step 6: VERIFY.** Standard verify block. `node scripts/shot.mjs http://localhost:3000/projects/smart-reading /tmp/c1 0 0.5` shows the experience; browsing `/experiments/glasses` lands on `/projects/smart-reading`; `/projects` grid shows Smart Reading (no "coming soon"). Confirm `app/sitemap.ts` picks up the new slug (it derives from `lib/data/projects.ts`; if it hardcodes routes instead, add `/projects/smart-reading`). Known-and-accepted: the navbar now shows on `/projects/smart-reading` — fixed in the next task; do not fix here.

- [ ] **Step 7: Commit.** `git add app lib/data && git commit -m "feat(ia): promote glasses experience to /projects/smart-reading (#00XX)"`

---

### Task 10 (C2): Chrome guard list, escape hatch, next-project cards

**Files:**
- Create: `lib/immersiveRoutes.ts`, `components/ui/EscapeHatch.tsx`, `components/ui/NextProjectCard.tsx`
- Modify: `components/layout/Navbar.tsx:117`, `components/layout/Footer.tsx` (same guard — locate with `grep -n "experiments" components/layout/Footer.tsx`), `components/experiments/glasses/GlassesExperience.tsx` (hatch + next card), `components/landing/LandingExperience.tsx` (hatch), `app/projects/modular-smartphone/page.tsx` (next card), `lib/data/experiments/glasses.ts` + `lib/data/projects.ts` (next-card copy)

**Interfaces:**
- Produces:
  ```ts
  // lib/immersiveRoutes.ts
  export const IMMERSIVE_PREFIXES = ['/experiments', '/landing-preview', '/projects/smart-reading'] as const;
  export function isImmersiveRoute(pathname: string | null): boolean;
  ```
  `EscapeHatch` props `{ tone?: 'light' | 'dark' }`; `NextProjectCard` props `{ eyebrow: string; title: string; href: string; tone: 'light' | 'dark' }`.

- [ ] **Step 1: `lib/immersiveRoutes.ts`:**
  ```ts
  /** Routes that render their own chrome — global Navbar/Footer hide on these. */
  export const IMMERSIVE_PREFIXES = [
    '/experiments',
    '/landing-preview',
    '/projects/smart-reading',
  ] as const;

  export function isImmersiveRoute(pathname: string | null): boolean {
    if (!pathname) return false;
    return IMMERSIVE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  }
  ```
  In `Navbar.tsx` line 117 replace `if (pathname?.startsWith('/experiments')) return null;` with `if (isImmersiveRoute(pathname)) return null;` (+ import). Apply the same replacement to the equivalent guard in `Footer.tsx`.

- [ ] **Step 2: `components/ui/EscapeHatch.tsx`:**
  ```tsx
  'use client';

  /** Minimal "back to DIGITAL" link for immersive pages: visible at rest,
   *  fades while scrolling through the middle, returns near the end. */

  import { useEffect, useState } from 'react';
  import Link from 'next/link';

  export default function EscapeHatch({ tone = 'dark' }: { tone?: 'light' | 'dark' }) {
    const [faded, setFaded] = useState(false);
    useEffect(() => {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        setFaded(p > 0.08 && p < 0.9);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener('scroll', onScroll);
    }, []);
    const color = tone === 'dark' ? 'text-white/70 hover:text-white' : 'text-ink/70 hover:text-ink';
    return (
      <Link href="/"
        className={`fixed left-6 top-6 z-50 font-mono text-[11px] uppercase tracking-[0.2em] transition-opacity duration-500 ${color} ${faded ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
        ← DIGITAL
      </Link>
    );
  }
  ```
  Mount `<EscapeHatch tone="light" />` in `GlassesExperience` (first child of the sticky div — hero is warm paper) and in `LandingExperience`'s WebGL branch.

- [ ] **Step 3: `components/ui/NextProjectCard.tsx`:**
  ```tsx
  'use client';

  /** End-of-experience handoff card — keeps the journey loop unbroken. */

  import Link from 'next/link';

  export interface NextProjectCardProps {
    eyebrow: string;
    title: string;
    href: string;
    tone: 'light' | 'dark';
  }

  export default function NextProjectCard({ eyebrow, title, href, tone }: NextProjectCardProps) {
    const box = tone === 'dark'
      ? 'border-white/20 text-white hover:border-white'
      : 'border-ink/20 text-ink hover:border-ink';
    const sub = tone === 'dark' ? 'text-white/50' : 'text-ink-soft';
    return (
      <Link href={href}
        className={`group inline-flex flex-col items-center gap-1 rounded-lg border px-8 py-5 transition-colors ${box}`}>
        <span className={`font-mono text-[11px] uppercase tracking-[0.2em] ${sub}`}>{eyebrow}</span>
        <span className="font-display text-xl font-bold uppercase tracking-tight">
          {title} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </span>
      </Link>
    );
  }
  ```
  Copy lives in data:
  - Extend `GlassesContent` with `readonly next: { readonly eyebrow: string; readonly title: string; readonly href: string };` and add to `GLASSES_CONTENT`: `next: { eyebrow: 'Next project', title: 'The Modular Smartphone', href: '/projects/modular-smartphone' },`.
  - In `GlassesExperience`, render inside the sticky div:
    ```tsx
    <motion.div
      style={{ opacity: useTransform(scrollYProgress, [0.955, 0.975], [0, 1]) }}
      className="pointer-events-auto absolute inset-x-0 bottom-[8%] z-20 text-center"
    >
      <NextProjectCard {...GLASSES_CONTENT.next} tone="dark" />
    </motion.div>
    ```
    (hoist the `useTransform` to a named const beside the other transforms — hooks can't be inline in JSX; name it `nextCardOpacity`.)
  - In `lib/data/projects.ts` add:
    ```ts
    export const NEXT_PROJECT_CARDS = {
      'modular-smartphone': { eyebrow: 'Next project', title: 'Smart Reading', href: '/projects/smart-reading' },
    } as const;
    ```
    and render at the end of `app/projects/modular-smartphone/page.tsx` (centered section, `py-24`): `<NextProjectCard {...NEXT_PROJECT_CARDS['modular-smartphone']} tone="light" />`.

- [ ] **Step 4: VERIFY.** Standard verify block. Checks: navbar/footer absent on `/landing-preview`, `/projects/smart-reading`, `/experiments/glasses`; present on `/`, `/projects`, `/projects/modular-smartphone`. Escape hatch visible at top of both immersive pages, gone mid-scroll, back near the end. Next-card appears past the glasses final panel (`node scripts/shot.mjs http://localhost:3000/projects/smart-reading /tmp/c2 0.99`) and at the phone page's end; both navigate. Full build check. Full journey click-through: landing → phone → next-card → glasses → escape hatch → home.

- [ ] **Step 5: Commit.** `git add components lib app && git commit -m "feat(ia): immersive chrome guard, escape hatch, next-project loop (#00XX)"`

---

### Task 11: TODO.md sync + final sweep

**Files:**
- Modify: `TODO.md` (Dev Build / Version Control table)

- [ ] **Step 1:** `git log --oneline` since `#0015`; add one table row per implementation commit (Build `v0.7.x` sequence, commit #, SHA, message, one-line note) following the existing column format.
- [ ] **Step 2:** Final full verification: `npx tsc --noEmit`; lint; stop dev → `npm run build` → export green → restart dev; one final harness pass on all three surfaces (`/landing-preview` 0/0.5/0.9, `/projects/smart-reading` 0/0.5/0.97, `/projects/modular-smartphone` 0/0.9).
- [ ] **Step 3: Commit.** `git add TODO.md && git commit -m "docs: record landing/glasses/IA build commits in TODO (#00XX)"`

---

### Task 12 (STRETCH — attempt only after Tasks 1–11 verify): In-lens HUD glimpse

**Files:**
- Modify: `components/experiments/glasses/GlassesScene.tsx`, `components/experiments/glasses/GlassesModel.tsx`

**Approach (concrete, but droppable):** Draw a one-time HUD snapshot into a `THREE.CanvasTexture` (512×256 canvas: phosphor `rgba(127,230,163,0.95)` corner brackets + `GLASSES_CONTENT.hud.label · wpm WPM` text in 28px DM Mono, transparent background). In `GlassesModel`, after `normalize`, compute the model's bounding box and add a `planeGeometry` plane (width ≈ 38% of bbox width, height ≈ 55% of bbox height) at the left-lens position (x ≈ −bboxWidth·0.22, z ≈ front face + 0.01) with `MeshBasicMaterial({ map: texture, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })`. In the existing `useFrame`, drive that material's opacity: `opacity = smoothstep((p - 0.60) / 0.04) * (1 - smoothstep((p - 0.68) / 0.04)) * 0.85` — the glimpse exists only on the fly-back beat.
**Drop condition:** if the plane cannot be made to sit convincingly inside the lens within ~3 fit iterations (screenshot-judged at p = 0.62/0.66), revert and close as dropped — the spec explicitly allows this.
**Verify:** standard verify block + `node scripts/shot.mjs http://localhost:3000/projects/smart-reading /tmp/b5 0.62 0.66`; the glimpse must read as projected light inside the lens, not a sticker.
**Commit:** `git commit -m "feat(glasses): in-lens HUD glimpse on fly-back beat (#00XX)"`

---

## Self-review notes (already applied)

- Spec §2.4 loader ≤ 3.5 s → intro `delta/2.8` ≈ 2.8 s; skip button covers impatience.
- Spec §5 WebGL-context-loss → Task 7 Step 1 (landing Canvas). The glasses page predates the spec and has no handler; adding one there is out of scope (not a regression).
- Spec §4.4 sitemap → checked inside Task 9 Step 6.
- Type consistency: `PANEL_CENTERS` (T2) consumed only in `GlassesExperience`; `LandingSceneProps` grows in T6 (`introDone`, `onIntroEnd`) and T7 (`onHover`) in the same tasks that consume them; `GlassesContent.next` added and consumed in T10.
- `three-stdlib` is not a direct dependency but is already imported by existing code (`GlassesModel`), provided via drei — no package.json change.
- Spec §3.2 says "exits ~40% faster than entrances" — HUD `item()` exit duration 0.14 s vs spring entrance ≈ 0.25 s: satisfied.
