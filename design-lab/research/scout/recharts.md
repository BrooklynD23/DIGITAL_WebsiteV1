# Recharts examples (https://recharts.github.io/en-US/examples; recharts.org path 404)
Category: React chart lib. Screenshots: design-lab/references/recharts/{desktop,mobile,scroll-1}.png
Gallery: line/area/bar/composed/scatter/pie/radar/radial/treemap (treemap demo literally shows its own bundle: recharts 512 KB min, "98.70 KB minified+gzip" label). Docs chrome: Source Sans Pro, <Recharts /> mono-ish logo (Oswald), grey scale #fafafa..#09090b, default chart palette = pastel violet #8884d8 + green #82ca9d (generic; must be re-themed).
## Weight / compat
recharts 3.10.1: 566 KB min / 151 KB gzip (bundlephobia), 11 deps (d3-shape, es-toolkit...). Peers react ^16.8..^19 -> React 18 OK; SVG-based so SSR/static export OK. Existing repo has no recharts. Heavy for a marketing page: only import chart types needed, lazy-load, or hand-roll SVG sparklines (0 kB) for 1-2 simple charts.
## Rules for DIGITAL
BRIEF: real data only, no meaningless dashboards. Candidate real data: project timelines, discipline mix per project (from lib/data/projects.ts / phoneV2.ts). If <=3 simple charts, hand SVG beats Recharts. Use only with tokenised colours, direct labels (no legend), no animation on load without reduced-motion gate.
Steal: (1) composed/annotated charts that tell one fact; (2) reference-line annotation; (3) treemap-as-proof of own bundle size (honest-metrics move).
Avoid: default pastel palette; dashboards of vanity metrics; shipping 150 KB gzip for one bar chart.
Direction fit: B Engineering/System (best), E Startup/Product Studio (proof section), A (editorial figures). Weak for D/F.
