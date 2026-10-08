/** Web geometry extracted from the club's KiCad 9 board files by design-lab/scripts/kicad-to-json.mjs. All units mm, origin = board top-left. */

export type Side = 'F' | 'B';
export type PadShape = 'rect' | 'roundrect' | 'circle' | 'oval' | 'trapezoid' | 'custom';
/** Copper presence: front, back, both (plated through-hole) or H (non-plated hole). */
export type PadLayer = 'F' | 'B' | 'FB' | 'H';

export interface BoardPad {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  /** Absolute orientation, degrees CCW (KiCad convention). */
  readonly a: number;
  readonly s: PadShape;
  readonly l: PadLayer;
  /** Drill diameter (through-hole pads). */
  readonly d?: number;
  /** Corner ratio for roundrect pads. */
  readonly rr?: number;
}

export interface BoardFootprint {
  /** Reference designator (U1, C3…) or null when it was not a plain designator. */
  readonly ref: string | null;
  readonly side: Side;
  readonly mount: 'smd' | 'th';
  /** All pads lie outside the board outline: the part is parked beside the board, not yet placed. */
  readonly parked: boolean;
  readonly x: number;
  readonly y: number;
  readonly rot: number;
  /** Courtyard (or fab/pad) bounding quad in board coords, 4 points. */
  readonly body: ReadonlyArray<readonly [number, number]> | null;
  readonly pads: ReadonlyArray<BoardPad>;
}

export interface BoardTrack {
  readonly l: Side;
  /** Track width. */
  readonly w: number;
  /** SVG path data. */
  readonly d: string;
}

export interface BoardZone {
  readonly l: Side;
  /** true = KiCad's computed fill; false = unfilled zone outline. */
  readonly filled: boolean;
  readonly teardrop?: boolean;
  readonly d: string;
}

export type BoardStatus = 'routed' | 'partly-routed';

export interface BoardData {
  readonly id: string;
  readonly title: string;
  readonly status: BoardStatus;
  readonly statusLabel: string;
  readonly source: string;
  readonly units: 'mm';
  readonly size: { readonly w: number; readonly h: number };
  readonly thickness: number;
  readonly copperLayers: number;
  readonly counts: {
    readonly tracks: number;
    readonly vias: number;
    readonly footprints: number;
    readonly pads: number;
    readonly zones: number;
    readonly teardropZones: number;
    /** Footprints parked off-board (not yet placed). */
    readonly parked: number;
  };
  readonly outline: string;
  readonly cutouts: ReadonlyArray<string>;
  readonly zones: ReadonlyArray<BoardZone>;
  readonly tracks: ReadonlyArray<BoardTrack>;
  /** [x, y, diameter, drill] */
  readonly vias: ReadonlyArray<readonly [number, number, number, number]>;
  readonly footprints: ReadonlyArray<BoardFootprint>;
  /** Silkscreen line art per side (no text). */
  readonly silk: { readonly F: string; readonly B: string };
  /** Silkscreen of parked (off-board) footprints. */
  readonly silkParked: { readonly F: string; readonly B: string };
}

export interface SchematicSummary {
  readonly id: string;
  readonly title: string;
  readonly status: 'schematic-in-rework';
  readonly statusLabel: string;
  readonly source: string;
  readonly paper: string | null;
  readonly sheets: number;
  readonly sheetNames: ReadonlyArray<string>;
  readonly components: number;
  readonly refs: ReadonlyArray<string>;
  readonly powerSymbols: number;
  readonly namedNets: number;
  readonly wires: number;
  readonly junctions: number;
  readonly note: string;
}
