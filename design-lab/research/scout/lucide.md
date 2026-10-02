# Lucide (https://lucide.dev)
Category: icon set. Screenshot: design-lab/references/lucide/desktop.png (desktop only; script did not finish the mobile/scroll captures).
v1.50.0, 1858 icons, 24px grid, 2px stroke default, round caps/joins, customizable colour/size/strokeWidth; hero grid is an isometric dotted-line construction grid (nice "blueprint" cue). Site: Inter, VitePress tokens, coral-red accent on white (exact hex not extracted), rounded cards.
## Compat / weight
lucide-react 1.50 (repo already depends ^1.17.0 - already installed, zero new dep). Peers react ^16.5..^19. Tree-shakable: named imports ~ <1 KB gzip each; bundlephobia full-barrel 761 KB min / 193 KB gzip -> NEVER `import * as` or dynamic-by-name lookup. Static export OK; SVG, aria-hidden by default (add label when icon-only).
## Fit
Neutral and clean; DIGITAL's current DESIGN.md governs iconography. 2px rounded stroke can feel "SaaS template" if used in 3-up feature rows (BRIEF §39). Use at 1.5px stroke, small (16-20px), inline with mono labels; or use sparingly + custom SVG marks for brand moments.
Steal: (1) strict grid/keyline construction as a drawing discipline; (2) stroke-width as a token; (3) isometric construction-grid visual for B/A heroes.
Avoid: icon-in-rounded-square feature cards; coral-style default accent; barrel imports.
Direction fit: all (utility). Best B Engineering/System, E; neutral elsewhere.
