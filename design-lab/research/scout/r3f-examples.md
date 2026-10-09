# React Three Fiber examples (https://r3f.docs.pmnd.rs/getting-started/examples)
Category: 3D / React renderer. Verified URL (200). Screenshots: design-lab/references/r3f-examples/{desktop,mobile,scroll-1}.png (docs page only; the live demos are on external sandboxes, not opened).

## Content
Showcase of production sites (product configurator w/ chairs, tilt-shift, "selection"), game prototypes, basic examples. Visual character = glossy rendered 3D scenes, soft DoF/tilt-shift, product-viz. Docs chrome: Inter 700 51px, bg #f7f9ff, shadcn-style tokens, rounded 0.625rem.

## CRITICAL compat (npm view, today)
- @react-three/fiber 9.8.1 peers: react >=19 <19.4. DIGITAL is React 18.2 / Next 14 -> use **@react-three/fiber@8** (peers react >=18 <19, three >=0.133) and **@react-three/drei@9** (peers react ^18, fiber ^8). Never install v9/drei 10 without a React 19 upgrade.
- Repo already has three@^0.169 (OK for fiber 8).
- Weight (bundlephobia, v9): three 184.9 KB gzip, fiber 57 KB gzip, drei 521 KB gzip full (tree-shake; import named helpers only). Realistic floor ~250 KB gzip for a scene -> lazy-load (`next/dynamic`, ssr:false), gate on viewport + `prefers-reduced-motion` + mobile, poster-image fallback.
- Static export: client-only canvas, fine. GPU model assets must be committed (no Blender/Higgsfield here) -> procedural geometry or SVG-derived shapes only.

## Steal / Avoid
Steal: (1) one interactive object with a static poster fallback; (2) product-viz lighting restraint (soft DoF) for hardware projects (phone, glasses); (3) examples-as-proof gallery.
Avoid: (1) full-page 3D hero on mobile; (2) importing all of drei; (3) floating-blob scenes (BRIEF §39).

## Direction fit
C Creative Technology (best), B (exploded/teardown views of phone/glasses), F Radical. Poor for D; E only for a single product viewer. Existing production hero already uses scroll teardown; R3F would duplicate that unless used for a project-detail 3D viewer.
