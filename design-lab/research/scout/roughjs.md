# Rough.js (https://roughjs.com)
Category: SVG/canvas hand-drawn graphics. Screenshots: design-lab/references/roughjs/{desktop,mobile,scroll-1,scroll-2}.png (local headless Playwright; devtools MCP down).
Why good: tiny (v4.6.6: 27 KB min / 8.8 KB gzip, 4 deps ~ site says <9 KB), draws shapes with sketchy hachure/cross-hatch fills; works with SVG and canvas.

## Site
Old-style page: teal-green gradient hero, centered, SF Pro Display 300 40px, body #606c71 18px; examples = heart/circle/diamond with hatch fills in primary red/orange/blue. Dated chrome, strong demo artifacts. Libs: GA, embed.navu.co (no framework).
## Compat
Framework-agnostic; React 18 fine via ref + useEffect to a canvas, or `rough.generator()` -> path d strings rendered as SVG (SSR-safe, static-export safe, deterministic with `seed`). Seeded output avoids hydration mismatch.
## Fit
Matches "engineering notebook / whiteboard" feel: annotate hardware diagrams (phone teardown callouts, wiring sketches), underline/circle marks, hand-drawn dividers. Risk: reads as "Excalidraw/startup-cute" and can fight a precise industrial grid. Use sparingly for annotations only, never as a global theme. Replaceable with hand-authored SVG at zero kB.
Steal: (1) sketch-annotation layer over real photos/renders; (2) seeded determinism; (3) hatch fills as print-style texture.
Avoid: sketchy everything; animated re-draw loops; replacing real project imagery.
Direction fit: A Editorial/Studio (annotations), D Human/Community (warmth), B (engineer sketch). Weak for F/E.
