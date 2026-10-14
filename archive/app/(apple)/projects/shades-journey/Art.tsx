/**
 * MOCKUP. The art for each stage of the journey, drawn in code. The line resolves stage by stage:
 * IDEATE loose doubled pencil, REFINE marker greys over a line, EXPLODE clean line art, SPECIFY the drafting sheet
 * (shades-drawings ArtFrame), RENDER the shared Glasses artwork in solid mode.
 * Line tiers: silhouette 3, form 1.5, construction 0.75 (non-scaling). Every path uses pathLength 1 so the
 * drawings mockup's draw-on transitions apply when the sheet is pinned.
 */
import type { ReactNode } from 'react';
import { callouts as C, candidateTag, chips, directions, partLabels as PL, render as R, type PartId } from '../../_content/shades-journey';
import { Glasses } from '../../_shades-art/Glasses';
import { TagMark } from '../shades-drawings/Drawings';
import k from '../shades-drawings/drawings.module.css';
import j from './journey.module.css';

type Paper = 'dark' | 'light';

/** A pencil stroke: the line, then a lighter second pass a hair off, as a hand draws it. */
function Pen({ d, w = 'form', mark }: { readonly d: string; readonly w?: 'sil' | 'form' | 'con'; readonly mark?: boolean }) {
  const cls = `${k.ln} ${j[w]} ${mark ? j.mk : ''}`;
  return (
    <>
      <path className={cls} pathLength={1} d={d} />
      {w === 'con' ? null : <path className={`${k.con} ${mark ? j.mk : ''}`} pathLength={1} d={d} transform="translate(1.2 0.8)" />}
    </>
  );
}

/** A handwritten callout with a curved leader ending in a dot on the part. */
function Callout({ x, y, tx, ty, text, end }: { readonly x: number; readonly y: number; readonly tx: number; readonly ty: number; readonly text: string; readonly end?: boolean }) {
  const cx = (x + tx) / 2;
  return (
    <g>
      <path className={`${k.lead} ${j.mkLead}`} pathLength={1} d={`M${x} ${y} Q${cx} ${ty} ${tx} ${ty}`} />
      <circle className={k.dot} cx={x} cy={y} r={3} />
      <text className={j.hand} x={tx + (end ? -8 : 8)} y={ty + 6} textAnchor={end ? 'end' : 'start'}>
        {text}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ IDEATE: the thumbnail wall */
const lens = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;

function GlassesFront({ x, y, s = 1, r = 14 }: { readonly x: number; readonly y: number; readonly s?: number; readonly r?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Pen w="sil" d={`${lens(0, 10, 90, 58, r)} ${lens(110, 10, 90, 58, r)}`} />
      <Pen d="M90 26 Q100 16 110 26 M0 18 L-14 12 M200 18 L214 12" />
      <Pen w="con" d="M-20 39 H220 M100 0 V80" />
    </g>
  );
}

export function ArtIdeate() {
  return (
    <div className={j.art} style={{ aspectRatio: '1200 / 700' }}>
      <svg className={j.svg} viewBox="0 0 1200 700" role="img" aria-label="Ideation sheet: glasses fronts, a heavy-temple three-quarter, controller shapes, a dial, a hand holding the pocket controller and a figure wearing the glasses, with handwritten notes.">
        {/* row 1: three glasses fronts, round to square */}
        <GlassesFront x={40} y={40} s={0.9} r={28} />
        <GlassesFront x={260} y={44} s={0.8} r={6} />
        {/* heavy-temple three-quarter */}
        <g transform="translate(470 40)">
          <Pen w="sil" d="M0 30 L120 10 L130 70 Q100 86 70 80 L10 92 Z" />
          <Pen d="M120 10 L250 34 L252 62 L128 52 M250 34 Q262 48 252 62" />
          <Pen d="M170 22 L230 33 L231 55 L172 46 Z" mark />
          <Pen w="con" d="M-10 50 L270 50 M60 0 V110" />
          <Pen d="M252 60 Q280 120 260 170" />
        </g>
        <Callout x={720} y={210} tx={780} ty={180} text={C.cable.text} />
        {/* glasses side profile with the cable */}
        <g transform="translate(900 50)">
          <Pen w="sil" d="M0 30 Q0 10 20 10 H220 Q236 10 240 30 L246 70 Q230 74 222 50 H20 Q0 50 0 30 Z" />
          <Pen d="M30 22 H150 M30 38 H150" mark />
          <Pen d="M240 66 Q250 130 220 190" />
        </g>
        <Callout x={1000} y={68} tx={1060} ty={150} text={C.oneEye.text} />

        {/* row 2: controller shapes */}
        <g transform="translate(40 230)">
          <Pen w="sil" d={lens(0, 0, 150, 76, 16)} />
          <circle className={`${k.ln} ${j.form}`} pathLength={1} cx={112} cy={38} r={22} />
          <circle className={`${k.ln} ${j.form}`} pathLength={1} cx={40} cy={24} r={9} />
          <circle className={`${k.ln} ${j.form}`} pathLength={1} cx={40} cy={54} r={9} />
          <Pen w="con" d="M-10 38 H160 M75 -10 V86" />
        </g>
        <Callout x={40 + 40} y={230 + 54} tx={60} ty={380} text={C.rewind.text} />
        <Callout x={40 + 40} y={230 + 24} tx={230} ty={350} text={C.play.text} />
        <g transform="translate(250 240)">
          <Pen w="sil" d="M30 0 H110 A30 30 0 0 1 110 60 H30 A30 30 0 0 1 30 0 Z" />
          <Pen d="M90 12 A18 18 0 1 1 89.9 12" mark />
        </g>
        <g transform="translate(420 236)">
          <Pen w="sil" d="M50 0 A50 50 0 1 1 49.9 0" />
          <Pen d="M50 22 A28 28 0 1 1 49.9 22" />
          <Pen w="con" d="M-6 50 H106 M50 -6 V106" />
        </g>
        {/* dial close-up, with the turn */}
        <g transform="translate(40 450)">
          <Pen w="sil" d="M70 10 A60 60 0 1 1 69.9 10" />
          {Array.from({ length: 18 }, (_, i) => {
            const a = (i / 18) * Math.PI * 2;
            return <path key={i} className={`${k.ln} ${j.con}`} pathLength={1} d={`M${(70 + Math.cos(a) * 60).toFixed(2)} ${(70 + Math.sin(a) * 60).toFixed(2)} L${(70 + Math.cos(a) * 52).toFixed(2)} ${(70 + Math.sin(a) * 52).toFixed(2)}`} />;
          })}
          <Pen d="M10 -4 A80 80 0 0 1 130 -4" mark />
          <path className={`${k.lead} ${j.mkLead}`} pathLength={1} d="M130 -4 l-14 -2 M130 -4 l-6 12" />
        </g>
        <Callout x={110} y={470} tx={210} ty={470} text={C.dial.text} />
        <Callout x={150} y={560} tx={210} ty={640} text={C.touch.text} />

        {/* the hand holding the pocket controller */}
        <g transform="translate(560 300) rotate(-18)">
          <Pen w="sil" d={lens(0, 0, 96, 190, 18)} />
          <Pen d="M48 40 A22 22 0 1 1 47.9 40" mark />
          <Pen d="M30 110 A8 8 0 1 1 29.9 110 M30 140 A8 8 0 1 1 29.9 140" />
          {/* fingers wrap the left edge, thumb reaches for the dial */}
          <Pen w="sil" d="M0 70 Q-36 70 -40 90 Q-38 108 0 106 M0 108 Q-40 110 -42 130 Q-40 148 0 146 M0 148 Q-38 150 -38 168 Q-34 184 0 182" />
          <Pen w="sil" d="M-40 90 Q-90 120 -96 200 Q-90 280 -20 300 L80 290" />
          <Pen w="sil" d="M96 120 Q130 110 128 80 Q122 56 84 58 Q66 60 62 70" />
          <Pen w="con" d="M48 -30 V230 M-60 95 H150" />
        </g>
        <Callout x={612} y={318} tx={800} ty={300} text={C.dial.text} />

        {/* a figure wearing the glasses, the cable to the pocket */}
        <g transform="translate(930 300)">
          <Pen w="sil" d="M40 10 Q90 -6 112 40 Q118 60 114 72 L126 96 L114 100 Q118 120 108 128 Q100 142 80 140 L78 170 M40 10 Q6 30 12 80 Q16 120 36 140 L34 172" />
          <Pen w="sil" d="M34 172 Q-10 190 -20 260 L-24 380 M78 170 Q150 184 160 260 L166 380" />
          <Pen d="M60 70 H120 M98 62 h20 v16 h-20 Z" mark />
          <Pen d="M60 70 Q50 70 46 78" />
          <Pen d="M46 78 Q20 160 50 260 Q60 300 100 310" />
          <Pen d={lens(90, 300, 40, 60, 6)} />
          <Pen w="con" d="M-40 72 H190 M60 -10 V400" />
        </g>
        <Callout x={1050} y={620} tx={1110} ty={690} text={C.pocket.text} end />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ EXPLORE: five directions */
function Thumb({ i }: { readonly i: number }) {
  // Each direction gets a quick drawing of the one thing it changes.
  const draws: readonly ReactNode[] = [
    // A: controls on the frame
    <>
      <GlassesFront x={20} y={30} s={0.8} r={12} />
      <circle className={`${k.markDot}`} cx={24} cy={52} r={7} />
      <circle className={`${k.markDot}`} cx={196} cy={52} r={7} />
    </>,
    // B: everything in the pocket
    <>
      <GlassesFront x={20} y={14} s={0.6} r={12} />
      <Pen d="M150 30 Q200 70 160 110" />
      <g transform="translate(60 100)">
        <Pen w="sil" d={lens(0, 0, 120, 50, 12)} />
        <Pen d="M88 10 A15 15 0 1 1 87.9 10" mark />
      </g>
    </>,
    // C: ±4 mm carriage
    <>
      <Pen w="sil" d="M30 60 H120 L150 30 M120 60 L150 90" />
      <Pen d="M160 40 V80 M160 40 h10 v40 h-10" />
      <path className={`${k.dim}`} pathLength={1} d="M150 120 H200" markerStart="url(#dw-arrow)" markerEnd="url(#dw-arrow)" />
      <text className={j.hand} x={175} y={146} textAnchor="middle">±4</text>
    </>,
    // D: move the projector
    <>
      <Pen w="sil" d="M30 50 h40 v30 h-40 Z" />
      <Pen d="M80 65 H170 M170 40 Q190 65 170 90" />
      <path className={`${k.dim}`} pathLength={1} d="M30 110 H90" markerStart="url(#dw-arrow)" markerEnd="url(#dw-arrow)" />
    </>,
    // E: waveguide (out of scope)
    <>
      <Pen w="sil" d="M20 60 H200 V74 H20 Z" />
      <Pen d="M40 60 L60 74 M80 60 L100 74 M120 60 L140 74 M160 60 L180 74" />
    </>,
  ];
  return (
    <svg className={j.svg} viewBox="0 0 220 160" aria-hidden="true">
      {draws[i]}
    </svg>
  );
}

export function ArtExplore() {
  return (
    <ul className={j.dirs}>
      {directions.map((v, i) => (
        <li key={v.name.text} className={v.ghost ? j.dirOut : undefined}>
          <div className={j.dirArt}>
            <Thumb i={i} />
            {v.ghost ? (
              <svg className={j.cross} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path className={k.strike} pathLength={1} d="M6 8 Q50 46 94 90 M94 10 Q52 52 8 92" />
              </svg>
            ) : null}
          </div>
          <span className={k.route}>{v.route}</span>
          <span className={k.vName}>{v.name.text}</span>
          <span className={k.vBody}>{v.body.text}</span>
          <TagMark tag={v.tag} />
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ REFINE: marker sketch, grey shading, cast shadow */
export function ArtRefine({ paper }: { readonly paper: Paper }) {
  return (
    <div className={j.art} style={{ aspectRatio: '1200 / 640' }}>
      <svg className={j.svg} viewBox="0 0 1200 640" aria-hidden="true">
        <defs>
          <radialGradient id="jr-shadow">
            <stop offset="0" stopColor="var(--j-shadow)" stopOpacity="0.85" />
            <stop offset="1" stopColor="var(--j-shadow)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* perspective construction lines */}
        <path className={`${k.con}`} pathLength={1} d="M0 470 L1200 400 M60 120 L760 520 M100 560 L800 140 M820 200 L1180 560" />
        <ellipse cx={380} cy={470} rx={330} ry={46} fill="url(#jr-shadow)" />
        <ellipse cx={960} cy={520} rx={170} ry={30} fill="url(#jr-shadow)" />
        {/* the controller in marker: three greys, a line over it */}
        <g transform="translate(820 360)">
          <path className={j.g1} d="M0 60 L130 0 L250 60 L120 120 Z" />
          <path className={j.g2} d="M0 60 L120 120 L120 146 L0 86 Z" />
          <path className={j.g3} d="M120 120 L250 60 L250 86 L120 146 Z" />
          <ellipse className={j.g3} cx={150} cy={58} rx={36} ry={18} />
          <ellipse className={j.g2} cx={150} cy={54} rx={36} ry={18} />
          <ellipse className={j.g1} cx={78} cy={52} rx={12} ry={6} />
          <ellipse className={j.g1} cx={104} cy={40} rx={12} ry={6} />
          <path className={`${k.ln} ${j.sil}`} pathLength={1} d="M0 60 L130 0 L250 60 L250 86 L120 146 L0 86 Z M0 60 L120 120 L250 60 M120 120 V146" />
          <path className={`${k.ln} ${j.form}`} pathLength={1} d="M114 58 A36 18 0 1 0 186 58 M114 54 A36 18 0 1 1 186 54" />
          <path className={j.hi} d="M20 62 L128 10" />
          <path className={`${k.ln} ${j.form}`} pathLength={1} d="M-10 80 Q-80 40 -140 -40" />
        </g>
      </svg>
      <div className={j.refineObject} data-paper={paper}>
        <Glasses mode="solid" view="three-quarter" ground={paper} fit="object" title="SHADES glasses, refined sketch, three-quarter view" />
      </div>
      <div className={j.refineLine} aria-hidden="true">
        <Glasses mode="line" view="three-quarter" ground={paper} fit="object" title="SHADES glasses, line" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ EXPLODE: one axis, line art */
/** Plates in a plane leaning back-right; they separate along AX (down-right). */
const AX = [0.86, 0.5] as const;
const plane = (x: number, y: number) => `matrix(0.86 -0.5 0 1 ${x} ${y})`;
const T = 8;

interface PartDef {
  readonly id: PartId;
  /** Step along the axis. */
  readonly t: number;
  /** Local shape and its offset in the plane. */
  readonly d: string;
  readonly ux: number;
  readonly label: 'left' | 'right';
  /** Anchor on the plate (local). */
  readonly ax: number;
  readonly ay: number;
}

const PARTS: readonly PartDef[] = [
  { id: 'frame', t: 0, ux: 0, d: `${lens(0, 10, 90, 58, 14)} ${lens(110, 10, 90, 58, 14)} M90 26 Q100 16 110 26 M0 10 H200`, label: 'left', ax: 10, ay: 40 },
  { id: 'optics', t: 1, ux: 130, d: 'M0 0 L40 40 M10 0 Q34 20 10 46 M0 46 H44', label: 'right', ax: 40, ay: 4 },
  { id: 'display', t: 2, ux: 136, d: lens(0, 0, 40, 26, 3), label: 'left', ax: 0, ay: 13 },
  { id: 'temple', t: 3, ux: 180, d: lens(0, 0, 40, 60, 10), label: 'right', ax: 40, ay: 30 },
  { id: 'dial', t: 5.4, ux: 90, d: 'M30 0 A30 30 0 1 1 29.9 0', label: 'right', ax: 58, ay: 20 },
  { id: 'lid', t: 6.2, ux: 0, d: `${lens(0, 0, 200, 100, 16)} M150 20 A30 30 0 1 1 149.9 20`, label: 'left', ax: 0, ay: 50 },
  { id: 'control', t: 7.2, ux: 12, d: `${lens(0, 0, 176, 40, 4)} M120 8 h24 v24 h-24 Z`, label: 'right', ax: 176, ay: 6 },
  { id: 'processing', t: 8.2, ux: 12, d: `${lens(0, 0, 176, 76, 4)} M60 18 h40 v40 h-40 Z M68 26 h24 v24 h-24 Z`, label: 'left', ax: 0, ay: 38 },
  { id: 'power', t: 9.2, ux: 12, d: `${lens(0, 0, 176, 76, 4)} M10 14 h110 v48 h-110 Z M164 30 h12 v16 h-12 Z`, label: 'right', ax: 176, ay: 10 },
  { id: 'base', t: 10.2, ux: 0, d: lens(0, 0, 200, 100, 16), label: 'left', ax: 0, ay: 60 },
];

const STEP = 72;
const O = [250, 170] as const;
const at = (t: number, ux: number, ax: number, ay: number) => {
  const x = O[0] + AX[0] * STEP * t + 0.86 * (ux + ax);
  const y = O[1] + AX[1] * STEP * t - 0.5 * (ux + ax) + ay;
  return [x, y] as const;
};

export function ArtExplode({ lit, labels = true }: { readonly lit?: readonly PartId[] | null; readonly labels?: boolean }) {
  return (
    <div className={j.art} style={{ aspectRatio: '1200 / 860' }}>
      <svg className={j.svg} viewBox="0 0 1200 860" role="img" aria-label="Exploded view on one axis: frame, optics, display, temple housing, one cable, then the controller: dial, case, control board, processing board, carrier and power board, case base. Board parts are candidates.">
        {/* the shared axis */}
        <path className={k.cl} d={`M${O[0] - 40} ${O[1] - 23} L${O[0] + AX[0] * STEP * 11.6} ${O[1] + AX[1] * STEP * 11.6}`} />
        {/* the cable from the temple to the case */}
        <g className={lit && !lit.includes('cable') ? j.ghost : lit ? j.lit : undefined}>
          <path className={`${k.ln} ${j.form}`} pathLength={1} d={`M${at(3, 180, 40, 60).join(' ')} C700 470 340 380 ${at(6.2, 0, 0, 46).join(' ')}`} />
        </g>
        {PARTS.map((p) => {
          const [x, y] = [O[0] + AX[0] * STEP * p.t, O[1] + AX[1] * STEP * p.t];
          const on = lit ? lit.includes(p.id) : true;
          const [lx, ly] = at(p.t, p.ux, p.ax, p.ay);
          const right = p.label === 'right';
          const ex = lx + (right ? 50 : -50);
          const ey = ly - 50;
          const chip = chips[p.id];
          return (
            <g key={p.id} className={lit ? (on ? j.lit : j.ghost) : undefined}>
              <g transform={plane(x + 0.86 * p.ux + AX[0] * T, y - 0.5 * p.ux + AX[1] * T)}>
                <path className={`${k.con}`} pathLength={1} d={p.d} />
              </g>
              <g transform={plane(x + 0.86 * p.ux, y - 0.5 * p.ux)}>
                <path className={`${k.ln} ${p.id === 'frame' || p.id === 'lid' || p.id === 'base' ? j.sil : j.form}`} pathLength={1} d={p.d} />
              </g>
              {labels ? (
                <g>
                  <path className={`${k.lead} ${j.mkLead}`} pathLength={1} d={`M${lx} ${ly} L${ex} ${ey} H${ex + (right ? 30 : -30)}`} />
                  <circle className={k.dot} cx={lx} cy={ly} r={3} />
                  <text className={j.hand} x={ex + (right ? 38 : -38)} y={ey + 6} textAnchor={right ? 'start' : 'end'}>{PL[p.id].text}</text>
                  {chip ? (
                    <text className={j.chip} x={ex + (right ? 38 : -38)} y={ey + 30} textAnchor={right ? 'start' : 'end'}>
                      {`${candidateTag.text} · ${chip.text}`}
                    </text>
                  ) : null}
                </g>
              ) : null}
            </g>
          );
        })}
        {labels ? (
          <text className={j.hand} x={560} y={300} textAnchor="end">{PL.cable.text}</text>
        ) : null}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ RENDER: three views on a soft gradient */
export function ArtRender({ paper }: { readonly paper: Paper }) {
  return (
    <figure className={j.render} data-paper={paper}>
      <p className={j.renderTitle}>{R.title.text}</p>
      <div className={j.renderViews}>
        <div className={j.rvSide}><Glasses mode="solid" view="front" ground={paper} fit="object" title={`SHADES glasses, ${R.views.front.toLowerCase()} view`} /></div>
        <div className={j.rvMain}><Glasses mode="solid" view="three-quarter" ground={paper} fit="object" tether title={`SHADES glasses and controller, ${R.views.threeQuarter.toLowerCase()} view`} /></div>
        <div className={j.rvSide}><Glasses mode="solid" view="side" ground={paper} fit="object" title={`SHADES glasses, ${R.views.side.toLowerCase()} view`} /></div>
      </div>
      <figcaption className={j.renderCredit}>{R.credit.text}</figcaption>
    </figure>
  );
}
