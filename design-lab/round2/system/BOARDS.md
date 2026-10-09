# BOARDS: real KiCad geometry for the web

Regenerate: `node design-lab/scripts/kicad-to-json.mjs && node design-lab/scripts/kicad-to-svg.mjs`.
Check: `kicad-boards-check.mjs` (errors, aspect), `kicad-boards-bench.mjs` (HTML/RSC bytes, scrub frames). Specimen: `/design-lab/r2/boards/`.

**Pages: use `BoardLayers` for any large or animated figure. `BoardSvg` inlines every path (carrier = 65 KB per
instance, re-serialised in RSC for each client use) and moves layers inside one SVG; keep it for small static uses.**
Inputs: read-only lab copies in `design-lab/round2/assets/kb/source/` (gitignored). The knowledge base itself is never read by the script.

## What was extracted

| Board | Size (mm) | Tracks | Vias | Footprints | Pads | Copper fills | JSON |
|---|---|---|---|---|---|---|---|
| Power carrier (`zynq-carrier-power.json`) | 49 × 41, r = 2.5 corners | 14 (all F.Cu) | 8 | 36 (19 parked off-board) | 431 | 11 (4 teardrops) | 65 KB |
| Fingerprint module (`fingerprint.json`) | 22.81 × 26.12 | 77 (66 F, 11 B) | 12 | 9 | 70 | 5 | 19 KB |
| Sensor module (`thermometer-schematic-summary.json`) | no outline | – | – | 4 parts + 7 power symbols | – | – | 0.5 KB |

Per board: Edge.Cuts outline as one closed SVG path (lines/arcs/rects/polys/circles chained), cutouts, tracks per copper layer
(segment + arc, real widths), vias `[x, y, size, drill]`, footprints (ref, side, rotation, courtyard quad, `parked` flag) with pads
(shape, size, absolute angle, F/B/FB/H, drill, roundrect ratio), F/B silkscreen line art, zones per copper layer (KiCad's
`filled_polygon` when present, else the dashed outline). Units mm, origin = board top-left, coords rounded to 0.01 mm.
Sensor module: component count, refs, named nets (unique labels + power names), sheet count/names, wires. Status: "in rework".

## Stripped for privacy (whitelist extraction + audit)

1. Never read: title block, comments, author/company, paths, UUIDs, groups, net names, footprint library ids, values, descriptions, datasheet links, 3D model paths, all text bodies (silk text, `fp_text`, `gr_text`).
2. Reference designators kept only if they match `^[A-Z]{1,4}\d{1,4}$` (else `null`).
3. Board names/status are authored in the script, not taken from the files.
4. A final audit throws if any output string is not a path/number, a plain designator or a known enum. Both boards pass.
5. Sensor-module defect detail is not exported; only neutral counts and "in rework".

## Accuracy limits

- Outline aspect checked in the browser: carrier 1.195 (49/41), fingerprint 0.873 (22.81/26.12). Exact.
- Zone fills simplified (Douglas–Peucker, 0.03 mm): carrier 9,873 → 2,476 points, fingerprint 2,342 → 705.
- Custom/trapezoid pads draw as their bounding rect. Pad corner chamfers, solder mask, paste and courtyard detail are not drawn.
- Part "bodies" are courtyard boxes, not real heights or 3D models (STEP files are not converted). Off by default.
- Fills are KiCad's last saved fill; the carrier is partly routed, so its copper is incomplete. That is honest, not a bug.
- Carrier: 19 passives sit beside the board (unplaced). Hidden unless `parked` is set; the flat specimen shows them.
- The carrier's J1 (SoM mezzanine, 312 pads) is on the back side.

## BoardLayers (preferred): static per-layer files, one composited box per layer

Files: `public/design-lab/r2/boards/<board>/<layer>-<flat|iso>.svg` (layers `b-silk b-pads b-cu substrate edge vias
f-cu f-pads f-silk bodies`; fingerprint has no b-silk). 38 files, 184 KB raw total. Carrier iso set 70 KB, largest
`b-pads` 30 KB (J1's 312 pads), `b-cu` 18 KB, `f-cu` 10.5 KB; fingerprint iso set 22 KB. Each is fetched + cached once.
Manifest (numbers only): `_system/boards/layers-manifest.json` (viewBoxes, layer list, label anchor).
Colour: the page draws `<svg><use href="…svg#l"/></svg>`, so currentColor and `--board-*` inherit (an `<img>` can't).
Drawing attributes mirror BoardSvg; the specimen's parity row is pixel-identical.

```tsx
import { BoardLayers } from '../_system/boards/BoardLayers'; // direct import: keeps board JSON out of client bundles
<BoardLayers board="carrier" proj="iso" explode={p} state="copper" labels gap={13.7} live={scrubbing} />
```

| Prop | Default | Notes |
|---|---|---|
| `board` | required | `'zynq-carrier-power' \| 'carrier' \| 'fingerprint'` (ids only; no geometry crosses to the client) |
| `proj` | `iso` | `flat \| iso` |
| `explode` | inherit | 0..1. Omit to read `--board-explode`, else `--e`, from an ancestor (scroll drivers write one var, no re-render) |
| `layers`, `state`, `labels`, `stableFrame` | as BoardSvg | `state` dims via `[data-dim]` opacity |
| `gap` | 28% long side | board mm per tier |
| `live` | false | `will-change: transform`; also on under `[data-board-live]` or `[data-exploding='true']` |

Root is a `div role=img` with `aspect-ratio`; layers are `div[data-board-layer]` moved by
`translate3d(calc(var(--E)*var(--ux)*1%), …)`. No transform transition (scroll position is the timebase).
Not drawn: parked off-board parts and drill axes (BoardSvg only).

Measured (dev server, 1440 px, `kicad-boards-bench.mjs`):

| | HTML | gzip | RSC |
|---|---|---|---|
| Specimen before (BoardSvg ×9) | 969 KB | 150 KB | 457 KB |
| Specimen after (BoardLayers + 1 BoardSvg parity figure) | 157 KB | 23 KB | 73 KB |
| Bench 2 boards: BoardSvg / BoardLayers | 257 / 41 KB | 44 / 7 KB | 124 / 18 KB |

Scrub, 3 passes × 78 steps: bench-layers 0 frames > 120 ms and 0 > 50 ms (max 46 ms; SwiftShader max 48 ms).
bench-svg max 97 ms. Signal SIDEKICK today (`r2-crit-sidekick-stall.mjs`): 2 / 16 / 18 frames > 120 ms per pass.

## Migration recipe (SIDEKICK agent)

1. In `_sidekick/Stack.tsx`, `apple/sidekick/{ApplePinned,CloserLook,page}.tsx`, `signal/sidekick/page.tsx`: replace
   `import { BoardSvg, getBoard } from '…/_system/boards'` with `import { BoardLayers } from '…/_system/boards/BoardLayers'`.
2. `<BoardSvg board={getBoard(id)} iso stableFrame={false} className=… />` → `<BoardLayers board={id} stableFrame={false} className=… />`.
   Flat: add `proj="flat"`. `layers={['substrate','edge']}` carries over unchanged.
3. Explode: keep `useStackDrive` / `ApplePinned` writing `--e`; BoardLayers reads it. Pass `gap={t.subGap}` instead of `--g`.
   `data-exploding='true'` (already set by useStackDrive) turns on will-change.
4. `_sidekick/stack.module.css`: delete the `.tier :global([data-layer])` transform rule and the six `--t` lines; remove
   `transform` from `.slide`'s `transition` (keep opacity). Retarget highlight selectors `[data-layer]` → `[data-board-layer]`.
5. CloserLook's flat carrier with `parked`: BoardLayers has no parked layer; keep one BoardSvg there or drop the parked parts.
6. Verify: `node design-lab/scripts/r2-crit-sidekick-stall.mjs` (target 0 > 120 ms) and `curl -s <route> | wc -c`.

## BoardSvg API (`app/design-lab/r2/_system/boards/`), small static figures only

```tsx
import { getBoard, BoardSvg } from '../_system/boards';
<BoardSvg board={getBoard('fingerprint')} iso explode={p} state="copper" labels />
```

| Prop | Default | Notes |
|---|---|---|
| `board` | required | `BoardData` from `getBoard(id)` / `allBoards` |
| `layers` | all but `bodies` | `B.Silk, B.Pads, B.Cu, substrate, edge, vias, F.Cu, F.Pads, F.Silk, bodies` |
| `explode` | 0 | 0..1, separates layer tiers along Z (drives the scroll teardown); drill axes fade in |
| `iso` | false | 30° iso, same matrix as concept E `PhoneSchematic`. Flat mode explodes on an oblique offset |
| `state` | `assembled` | `assembled \| outline \| copper \| parts`; non-focus layers drop to 0.16 opacity |
| `gap` | 28% of long side | mm per tier |
| `labels` | false | layer names beside each tier when exploded |
| `stableFrame` | true | viewBox fixed at explode=1 so scrubbing never rescales; set false for static views |
| `parked` | false | include off-board parked parts |
| `title`, `className`, `style` | – | `role="img"` + `<title>` built from board size |

Styling: no palette inside. Uses `currentColor` plus optional vars `--board-ink`, `--board-copper`, `--board-silk`,
`--board-substrate`, `--board-hole` (hole fill; set to the page background), `--board-label-font`. Every layer is a
`<g data-layer="…">` and the root has `data-board` / `data-state`, so worlds can restyle or animate per layer in CSS.
SSR-safe: no hooks, no rAF, no `use client`; works in server and client components.
Note: on `<g>` the non-scaling-stroke attribute is a no-op, so pad/via/zone strokes scale (mm); the files keep that look.

Status words for copy: carrier "layout in progress (partly routed)", fingerprint "layout routed (not yet merged)",
sensor "schematic in rework". Dimensions are labelled "from the club's KiCad files [confirm]".
