/**
 * Procedural figures for concept A (server components, no JS).
 * The stack is a DIAGRAM of DG-001's seven subsystems, explicitly NOT a teardown of the
 * club's device (no photos exist). Fig. 1 (cover) is the small numbered stack; Fig. 2
 * (DG-001 feature) is the same stack at plate scale with a numbered key that carries
 * each subsystem's real description from lib/data/phoneV2.ts.
 */
import styles from './a.module.css';

interface Subsystem {
  readonly n: string;
  readonly id: string;
  readonly title: string;
  readonly description?: string;
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

const pts = (corners: [number, number][]): string =>
  corners.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

const layerPoints = (z: number): string => pts([iso(0, 0, z), iso(W, 0, z), iso(W, H, z), iso(0, H, z)]);

const innerPoints = (z: number, inset: number): string =>
  pts([iso(inset, inset, z), iso(W - inset, inset, z), iso(W - inset, H - inset, z), iso(inset, H - inset, z)]);

function Stack({
  items,
  label,
  numSize,
  className,
}: {
  readonly items: readonly Subsystem[];
  readonly label: string;
  readonly numSize: number;
  readonly className: string;
}) {
  const count = items.length;
  return (
    <svg className={className} viewBox="-120 -195 210 300" role="img" aria-label={label}>
      {items.map((s, i) => {
        const z = (count - 1 - i) * GAP;
        const [cx, cy] = iso(W, 0, z);
        return (
          <g key={s.id} data-layer={s.n} className={styles.figLayer}>
            <polygon points={layerPoints(z)} className={styles.figPlate} />
            <polygon points={innerPoints(z, 8)} className={styles.figInner} />
            <circle cx={cx} cy={cy} r={2} className={styles.figDot} />
            <text x={cx + 6} y={cy + numSize * 0.35} className={styles.figNum} style={{ fontSize: numSize }}>
              {s.n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Fig. 1 — cover: small numbered stack, no labels (the key lives in Fig. 2). */
export function FigCover({ items }: { readonly items: readonly Subsystem[] }) {
  const last = items.length.toString().padStart(2, '0');
  return (
    <figure className={styles.figCover}>
      <Stack
        items={items}
        numSize={11}
        className={styles.figCoverSvg}
        label={`Diagram: DG-001 as ${items.length} stacked layers, numbered 01 to ${last}. The key is in Fig. 2.`}
      />
      <figcaption className={styles.caption}>
        <span className={styles.figNo}>Fig. 1</span> DG-001 drawn as its seven subsystems. Key in Fig. 2.
      </figcaption>
    </figure>
  );
}

/** Fig. 2 — DG-001 feature: plate-scale stack + numbered key with real descriptions. */
export function FigSpread({ items }: { readonly items: readonly Subsystem[] }) {
  return (
    <figure className={styles.spread}>
      <div className={styles.spreadDrawing}>
        <Stack
          items={items}
          numSize={10.5}
          className={styles.spreadSvg}
          label={`Exploded diagram of DG-001: ${items.map((s) => `${s.n} ${s.title}`).join(', ')}.`}
        />
      </div>
      <ol className={styles.spreadKey}>
        {items.map((s) => (
          <li key={s.id} data-key={s.n}>
            <span className={styles.spreadNo}>{s.n}</span>
            <span className={styles.spreadTitle}>{s.title}</span>
            <span className={styles.spreadDesc}>{s.description}</span>
          </li>
        ))}
      </ol>
      <figcaption className={`${styles.caption} ${styles.spreadCaption}`}>
        <span className={styles.figNo}>Fig. 2</span> DG-001, exploded into its seven subsystems. A
        diagram, not a teardown: the layer order is editorial, not the board stack.
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
export function PhotoPlate({ label, ratio = '4 / 3' }: { readonly label: string; readonly ratio?: string }) {
  return (
    <div className={styles.plate} style={{ aspectRatio: ratio }} role="img" aria-label={label}>
      <span className={styles.plateLabel}>{label}</span>
    </div>
  );
}
