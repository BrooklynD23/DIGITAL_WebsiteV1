/**
 * Procedural figures for concept A (server components, no JS).
 * Fig. 1 is a diagram of DG-001's seven subsystems as stacked layers, each with a blank
 * owner line. It is explicitly NOT a teardown of the club's device (no photos exist).
 */
import styles from './a.module.css';
import { BLANK } from './content';

interface Subsystem {
  readonly n: string;
  readonly id: string;
  readonly title: string;
}

const W = 64; // phone plan width
const H = 128; // phone plan height
const COS = 0.866;
const SIN = 0.5;
const GAP = 30;

const iso = (x: number, y: number, z: number): [number, number] => [
  (x - y) * COS,
  (x + y) * SIN - z,
];

function layerPoints(z: number): string {
  return [iso(0, 0, z), iso(W, 0, z), iso(W, H, z), iso(0, H, z)]
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ');
}

function innerPoints(z: number, inset: number): string {
  return [
    iso(inset, inset, z),
    iso(W - inset, inset, z),
    iso(W - inset, H - inset, z),
    iso(inset, H - inset, z),
  ]
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ');
}

export function FigSubsystems({ items }: { readonly items: readonly Subsystem[] }) {
  const count = items.length;
  const labelX = 150;
  return (
    <figure className={styles.fig1}>
      <svg
        className={styles.fig1Svg}
        viewBox="-125 -210 470 320"
        role="img"
        aria-labelledby="fig1-title"
      >
        <title id="fig1-title">
          {`Diagram: DG-001 as ${count} stacked layers, one per subsystem, each with a blank owner line.`}
        </title>
        {items.map((s, i) => {
          // top of the stack = first subsystem
          const z = (count - 1 - i) * GAP;
          const [cx, cy] = iso(W, 0, z);
          const rowY = -168 + i * 34;
          return (
            <g key={s.id} className={styles.fig1Layer} transform="translate(0 0)">
              <polygon points={layerPoints(z)} className={styles.fig1Plate} />
              <polygon points={innerPoints(z, 8)} className={styles.fig1Inner} />
              <polyline
                points={`${cx.toFixed(1)},${cy.toFixed(1)} ${labelX - 30},${rowY} ${labelX - 6},${rowY}`}
                className={styles.fig1Leader}
              />
              <circle cx={cx} cy={cy} r={2.2} className={styles.fig1Dot} />
              <text x={labelX} y={rowY - 3} className={styles.fig1Num}>
                {s.n}
              </text>
              <text x={labelX + 22} y={rowY - 3} className={styles.fig1Label}>
                {s.title}
              </text>
              <text x={labelX + 22} y={rowY + 11} className={styles.fig1Owner}>
                {`owner ${BLANK}`}
              </text>
            </g>
          );
        })}
      </svg>
      {/* Compact drawing for narrow screens: layers only; labels move to the list below. */}
      <svg
        className={styles.fig1SvgCompact}
        viewBox="-120 -195 210 300"
        role="img"
        aria-label={`Diagram: DG-001 as ${count} stacked layers, numbered 01 to ${String(count).padStart(2, '0')}.`}
      >
        {items.map((s, i) => {
          const z = (count - 1 - i) * GAP;
          const [cx, cy] = iso(W, 0, z);
          return (
            <g key={s.id}>
              <polygon points={layerPoints(z)} className={styles.fig1Plate} />
              <polygon points={innerPoints(z, 8)} className={styles.fig1Inner} />
              <text x={cx + 6} y={cy + 4} className={styles.fig1Num}>
                {s.n}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className={styles.caption}>
        <span className={styles.figNo}>Fig. 1</span> DG-001, the Modular Smartphone, drawn as its
        seven subsystems (listed in full under 01). A diagram, not a teardown. Every owner line
        is still blank.
      </figcaption>
    </figure>
  );
}

/** Small inline glyph used between the words of the DG-001 headline. */
export function PhoneGlyph() {
  const zs = [48, 32, 16, 0];
  return (
    <svg viewBox="-115 -60 175 160" className={styles.glyph} aria-hidden="true" focusable="false">
      {zs.map((z) => (
        <polygon key={z} points={layerPoints(z)} className={styles.glyphPlate} />
      ))}
    </svg>
  );
}

/** Small inline RSVP word card used between the words of the DG-002 headline. */
export function WordGlyph() {
  return (
    <span className={styles.wordGlyph} aria-hidden="true">
      <span className={styles.wordGlyphTick} />
      w<span className={styles.wordGlyphPivot}>o</span>rd
    </span>
  );
}

/** Striped plate standing in for a real project photo. */
export function PhotoPlate({ label, ratio = '16 / 9' }: { readonly label: string; readonly ratio?: string }) {
  return (
    <div className={styles.plate} style={{ aspectRatio: ratio }} role="img" aria-label={label}>
      <span className={styles.plateLabel}>{label}</span>
    </div>
  );
}
