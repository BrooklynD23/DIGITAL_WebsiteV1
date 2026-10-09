import { createTimeline, stagger, svg } from 'animejs';

/**
 * Ambient loops for the subsystem stage.
 *
 * Each looped section gets one timeline that shows what that subsystem *does*,
 * rather than restating the same exploded diagram with a different part lit.
 * Only the active section's timeline runs; the caller reverts it on change.
 *
 * Ownership rule: these timelines animate elements *inside* a part group only —
 * never the group itself. Part group opacity belongs to CSS and part group
 * transform belongs to React, both in PhoneSchematicSvg. Writing either from
 * here would put anime.js in a race with React's inline styles.
 */

type Timeline = ReturnType<typeof createTimeline>;

const LOOPED_SECTION_IDS = ['operating-system', 'apps-ux'] as const;

export type LoopedSectionId = (typeof LOOPED_SECTION_IDS)[number];

function isLoopedSection(id: string): id is LoopedSectionId {
  return (LOOPED_SECTION_IDS as readonly string[]).includes(id);
}

/**
 * Operating System — the shell coming up.
 * Service rows draw in one after another, the status indicator blinks while
 * they load, and a scanline sweeps the panel once per cycle.
 */
function createOsLoop(root: SVGSVGElement): Timeline | null {
  const lines = Array.from(
    root.querySelectorAll<SVGPathElement>('[data-screen-line="true"]')
  );
  const indicator = root.querySelector<SVGCircleElement>('[data-screen-indicator="true"]');
  const scan = root.querySelector<SVGPathElement>('[data-screen-scan="true"]');
  if (lines.length === 0 || !indicator || !scan) return null;

  const drawableLines = svg.createDrawable(lines);

  return createTimeline({
    loop: true,
    loopDelay: 420,
    defaults: { ease: 'inOut(2)' },
  })
    .add(drawableLines, { draw: ['0 0', '0 1'], duration: 640, delay: stagger(200) }, 0)
    .add(
      indicator,
      { opacity: [0.9, 0.12, 0.9], duration: 1400, ease: 'inOut(1)' },
      0
    )
    .add(
      scan,
      {
        translateY: [0, 296],
        strokeOpacity: [0, 0.45, 0],
        duration: 1700,
        ease: 'linear',
      },
      240
    )
    .add(drawableLines, { draw: ['0 1', '1 1'], duration: 480, delay: stagger(130) }, 2300);
}

/**
 * Apps / UX — action, then result.
 * A tap ripple opens at a point on the glass; the service rows answer it a beat
 * later. That ordering is the section's own claim: "motion connects an action
 * to its result."
 */
function createAppsLoop(root: SVGSVGElement): Timeline | null {
  const tap = root.querySelector<SVGCircleElement>('[data-screen-tap="true"]');
  const lines = Array.from(
    root.querySelectorAll<SVGPathElement>('[data-screen-line="true"]')
  );
  if (!tap || lines.length === 0) return null;

  return createTimeline({
    loop: true,
    loopDelay: 640,
    defaults: { ease: 'out(3)' },
  })
    .add(tap, { scale: [0.4, 2.8], strokeOpacity: [0.85, 0], duration: 940 }, 0)
    .add(
      lines,
      {
        translateX: [0, 7, 0],
        strokeOpacity: [0.5, 0.95, 0.5],
        duration: 780,
        delay: stagger(95),
      },
      280
    );
}

const LOOP_BUILDERS: Record<LoopedSectionId, (root: SVGSVGElement) => Timeline | null> = {
  'operating-system': createOsLoop,
  'apps-ux': createAppsLoop,
};

/**
 * Build the ambient loop for a subsystem section, or null when that section has
 * none (or its schematic hooks are missing, e.g. the reduced mobile part set).
 * Callers must call `.revert()` on the result to restore the schematic.
 */
export function createSubsystemLoop(
  sectionId: string,
  root: SVGSVGElement
): Timeline | null {
  if (!isLoopedSection(sectionId)) return null;
  return LOOP_BUILDERS[sectionId](root);
}
