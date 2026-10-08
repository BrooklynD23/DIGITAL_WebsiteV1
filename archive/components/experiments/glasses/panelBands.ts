/**
 * Scroll-band geometry for the Smart Reading detail panels.
 *
 * The panels occupy the tail of the scroll track (BASE → 1.0), split into one equal band
 * per section. Both InfoPanels (crossfade ranges) and GlassesExperience (nav targets +
 * scroll snapping) derive from these functions, so the panel count follows
 * GLASSES_CONTENT.info.length — add a section and everything stays in sync.
 */

/** Where the panels zone begins along the 0..1 scroll track. */
export const BASE = 0.74;

/**
 * Each panel's full-opacity center. Nav jumps and scroll snapping land here so a jump
 * never stops inside a crossfade gap where two panels overlap.
 */
export function panelCenters(total: number): readonly number[] {
  const span = (1 - BASE) / total;
  return Array.from({ length: total }, (_, i) => BASE + span / 2 + i * span);
}

/**
 * Panel i's fade stops: [fadeInStart, fullIn, fullOut, fadeOutEnd].
 * Fades complete strictly INSIDE the band (dead zone at each edge) so at any boundary
 * both neighbours sit at 0 and can never be visible simultaneously.
 */
export function band(i: number, total: number): [number, number, number, number] {
  const width = (1 - BASE) / total;
  const start = BASE + i * width;
  const end = start + width;
  return [start + 0.004, start + 0.022, end - 0.022, end - 0.004];
}
