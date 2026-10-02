/**
 * Typed loader for the club's real board geometry. Regenerate the JSON with:
 *   node design-lab/scripts/kicad-to-json.mjs
 * Sources: read-only lab copies of the KiCad 9 files (design-lab/round2/assets/kb/source/).
 */
import carrierJson from './zynq-carrier-power.json';
import fingerprintJson from './fingerprint.json';
import thermometerJson from './thermometer-schematic-summary.json';
import type { BoardData, SchematicSummary } from './types';

export type * from './types';
export { BoardSvg, BOARD_LAYERS, BOARD_STATES } from './BoardSvg';
export type { BoardLayer, BoardState, BoardSvgProps } from './BoardSvg';

export const BOARD_IDS = ['zynq-carrier-power', 'fingerprint'] as const;
export type BoardId = (typeof BOARD_IDS)[number];

// JSON imports infer `string` for literal unions; the generator's privacy audit guarantees the enum values.
const BOARDS: Readonly<Record<BoardId, BoardData>> = {
  'zynq-carrier-power': carrierJson as unknown as BoardData,
  fingerprint: fingerprintJson as unknown as BoardData,
};

export function getBoard(id: BoardId): BoardData {
  return BOARDS[id];
}

export const allBoards: ReadonlyArray<BoardData> = BOARD_IDS.map((id) => BOARDS[id]);

/** Sensor module: schematic only (no board outline or copper exists yet). */
export const thermometerSummary = thermometerJson as unknown as SchematicSummary;
