# BOARDS: real KiCad geometry for the web

Regenerate: `node design-lab/scripts/kicad-to-json.mjs`. Check: `node design-lab/scripts/kicad-boards-check.mjs`. Specimen: `/design-lab/r2/boards/`.
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

## BoardSvg API (`app/design-lab/r2/_system/boards/`)

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

Status words for copy: carrier "layout in progress (partly routed)", fingerprint "layout routed (not yet merged)",
sensor "schematic in rework". Dimensions are labelled "from the club's KiCad files [confirm]".
