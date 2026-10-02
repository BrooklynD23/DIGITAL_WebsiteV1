# SCOUT-2 summary: Generative / 3D / data
Method note: chrome-devtools MCP failed ("Target closed") even after lock acquired; used local headless Playwright (own browser, no shared-browser conflict) for screenshots/tokens. WebGPU demos and live 3D sandboxes were NOT run. Sizes = bundlephobia/npm view, 2026-10-02.

| Lib | gzip | React 18 / Next 14 | Verdict | Best direction |
|---|---|---|---|---|
| COBE 2.0.1 | 5.9 KB, 0 deps | yes (canvas in useEffect) | ADOPT-able; only with REAL locations | C, B, F |
| R3F | three 185 + fiber 57 KB (+drei up to 521) | ONLY fiber@8 + drei@9 (v9/v10 need React 19) | lazy, one object, poster fallback | C, B |
| vgpu (vercel-labs) / TypeGPU | ~25 KB claimed / n/a | framework-agnostic, WebGPU-only, no fallback | inspiration only | F |
| Rough.js 4.6.6 | 8.8 KB | yes (seeded SVG path generator) | annotation layer only | A, D, B |
| Recharts 3.10.1 | 151 KB | yes (peers 16-19) | hand SVG for <=3 charts; real data only | B, E |
| dnd-kit | core 14 KB / @dnd-kit/react ~33 KB | both OK (react pkg is 0.x) | needs keyboard + non-drag alt | C, E, D |
| lucide-react | ~1 KB per named icon | yes; already in repo (^1.17) | default icons, small stroke | all |

## Findings
1. "vgpu Examples" = Vercel Labs vgpu (https://vgpu.sh/examples), not TypeGPU; TypeGPU also captured. Both WebGPU-only.
2. React 18 trap: @react-three/fiber 9.x / drei 10.x require React >=19. Pin fiber@8 + drei@9. Repo has three@^0.169 already.
3. COBE globe idea: technically cheap (5.9 KB) but DIGITAL builds are campus-based; a world globe needs genuinely varied photo locations (none verified in lib/data). Prefer regional focus (SoCal) or skip. Never invent locations; label [placeholder].
4. Cheapest wins: COBE (single hero object), Lucide (already installed), hand-rolled SVG instead of Recharts/Rough where possible.
5. Perf rules for any canvas: next/dynamic ssr:false, IntersectionObserver pause, prefers-reduced-motion = single static frame, mobile gate/poster.

## Direction recs
- A Editorial/Studio: Rough.js annotations over real photos; no 3D.
- B Engineering/System: COBE w/ mono labels, R3F exploded view (lazy), hand SVG charts of real project data, Lucide at 1.5px.
- C Creative Technology: COBE + R3F object viewer + dnd-kit assemble toy.
- D Human/Community: Rough.js warmth, dnd-kit team-builder; skip 3D.
- E Startup/Product Studio: dnd-kit workflow demo, honest metrics chart.
- F Radical: large COBE or WebGPU shader accent (with static fallback).
Anti-generic: COBE's pixel type + single ink accent + mono caps labels is the one reusable visual idea; vgpu black-hole/bloom heroes hit BRIEF section 39 (crypto/AI look).
Needs from orchestrator (do not install yet): cobe (only if chosen), @react-three/fiber@8 + @react-three/drei@9 (only if chosen).
