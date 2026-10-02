# "vgpu Examples" -> RESOLVED as Vercel Labs vgpu: https://vgpu.sh/examples (plus TypeGPU as the other candidate)
User wording "vgpu Examples" matches vercel-labs/vgpu (WebSearch + vgpu.sh, 200). TypeGPU (Software Mansion) is a separate lib: https://docs.swmansion.com/TypeGPU/examples/ (200). Both captured. Screenshots: design-lab/references/vgpu-examples/, design-lab/references/typegpu-examples/. Chrome-devtools MCP was down; used local headless Playwright (no WebGPU in headless, so only gallery thumbnails seen, demos NOT run).

## vgpu
- TS WebGPU lib: typed WGSL imports, tiny gpu-first API; browser + headless Node. MIT. npm `vgpu` (+ @vgpu/wgsl-std noise/color/hash). Claims full-screen effect ~25 KB gzip. Docs mention no React/Next integration and no non-WebGPU fallback.
- Gallery: gradient, holographic card (Geist type), triangle LED hero, black hole (HDR bloom), FFT ocean, raymarched fractal, fluid, Earth, MNIST/depth/hand-tracking, "Next.js logo shader".
- Character: dark, black-void shaders + light-on-dark glow = "crypto/AI hero" risk per BRIEF §39. Docs chrome: Geist 40px/-2.4 tracking, bg ~#fafafa, ds-gray scale.
## TypeGPU (v0.12.6, MIT, 1.35 MB unpacked)
Examples: jelly slider/switch, 3D fish, clouds, caustics, selfie segmentation, ray marching. Character: soft, tactile, playful rendered UI (jelly slider is the most "product-feel"). Aeonik + JetBrains Mono, light chrome.

## Verdict
WebGPU-only (Chrome/Edge/Safari 26-ish; Firefox partial) -> needs a CSS/static fallback for every use. Experimental maturity; React 18 OK only as imperative canvas in useEffect (library is framework-agnostic) but unverified here. Not needed for DIGITAL's goals; treat as inspiration for 1 shader accent at most. Do not add to package.json.
Steal: (1) examples gallery as thumbnail grid with tag chips; (2) tactile "jelly" micro-interaction idea as pure CSS/SVG; (3) shader as texture on a hardware object, not as background.
Avoid: black-hole/bloom heroes; GPU-heavy idle loops; WebGPU-only content paths.
Direction fit: F Radical, C (accent only). Poor elsewhere.
