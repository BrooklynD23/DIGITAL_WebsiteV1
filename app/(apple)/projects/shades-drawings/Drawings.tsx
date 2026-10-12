/**
 * MOCKUP. The drafted views for each drawing sheet. Pencil construction lines (`con`) sit under the drafted
 * lines (`ln`); dimensions, centre lines and labels on top. The glasses views reuse the shared Glasses artwork
 * (line mode); everything else is drafted here. All views NTS; dimensions are Notion targets.
 */
import type { ReactNode } from 'react';
import { boards as B, frame as F, optics as O, parts as P, puck as K, routes as R, type Tag, type Variant } from '../../_content/shades-drawings';
import { Glasses } from '../../_shades-art/Glasses';
import k from './drawings.module.css';

type Ground = 'dark' | 'light';

/** Shared markers and the section hatch. Colour comes from the section's tokens via currentColor. */
export function Defs() {
  return (
    <svg className={k.defs} aria-hidden="true" focusable="false">
      <defs>
        <marker id="dw-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
          <path d="M0 1.5 L10 5 L0 8.5 Z" fill="currentColor" />
        </marker>
        <pattern id="dw-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
    </svg>
  );
}

/** A dimension: extension lines, a two-headed line, the value in mono above it. Horizontal or vertical. */
function Dim({ x1, y1, x2, y2, off, text, sub }: { readonly x1: number; readonly y1: number; readonly x2: number; readonly y2: number; readonly off: number; readonly text: string; readonly sub?: string }) {
  const h = y1 === y2;
  const a = h ? { x1, y1: y1 + off, x2, y2: y2 + off } : { x1: x1 + off, y1, x2: x2 + off, y2 };
  const mx = (a.x1 + a.x2) / 2;
  const my = (a.y1 + a.y2) / 2;
  return (
    <g>
      <path className={k.ext} pathLength={1} d={h ? `M${x1} ${y1 + Math.sign(off) * 3} V${y1 + off + Math.sign(off) * 5} M${x2} ${y2 + Math.sign(off) * 3} V${y2 + off + Math.sign(off) * 5}` : `M${x1 + Math.sign(off) * 3} ${y1} H${x1 + off + Math.sign(off) * 5} M${x2 + Math.sign(off) * 3} ${y2} H${x2 + off + Math.sign(off) * 5}`} />
      <line className={k.dim} pathLength={1} {...a} markerStart="url(#dw-arrow)" markerEnd="url(#dw-arrow)" />
      {h ? (
        <text className={k.dimT} x={mx} y={my - 5} textAnchor="middle">
          {text}
          {sub ? <tspan className={k.dimSub} dx={6}>{sub}</tspan> : null}
        </text>
      ) : (
        <text className={k.dimT} x={mx - 6} y={my} textAnchor="middle" transform={`rotate(-90 ${mx - 6} ${my})`}>
          {text}
          {sub ? <tspan className={k.dimSub} dx={6}>{sub}</tspan> : null}
        </text>
      )}
    </g>
  );
}

function Label({ x, y, children, end }: { readonly x: number; readonly y: number; readonly children: ReactNode; readonly end?: boolean }) {
  return (
    <text className={k.lbl} x={x} y={y} textAnchor={end ? 'end' : 'middle'}>
      {children}
    </text>
  );
}

/** A leader from (x, y) to a note at (tx, ty), with a dot on the part. */
function Leader({ x, y, tx, ty, text, end }: { readonly x: number; readonly y: number; readonly tx: number; readonly ty: number; readonly text: string; readonly end?: boolean }) {
  return (
    <g>
      <path className={k.lead} pathLength={1} d={`M${x} ${y} L${tx} ${ty} H${tx + (end ? -6 : 6)}`} />
      <circle className={k.dot} cx={x} cy={y} r={2.2} />
      <text className={k.note} x={tx + (end ? -9 : 9)} y={ty + 3.5} textAnchor={end ? 'end' : 'start'}>
        {text}
      </text>
    </g>
  );
}

function Datum({ x, y, id }: { readonly x: number; readonly y: number; readonly id: string }) {
  return (
    <g className={k.datum}>
      <path className={k.ln} pathLength={1} d={`M${x} ${y} v10`} />
      <path d={`M${x - 5} ${y} L${x + 5} ${y} L${x} ${y - 7} Z`} className={k.datumTri} />
      <rect className={k.ln} pathLength={1} x={x - 8} y={y + 10} width={16} height={16} />
      <text className={k.dimT} x={x} y={y + 22} textAnchor="middle">{id}</text>
    </g>
  );
}

const glassesLine = (view: 'front' | 'side' | 'three-quarter', ground: Ground, title: string, yaw?: number) => (
  <Glasses mode="line" view={view} yaw={yaw} fit="object" ground={ground} title={title} />
);

/* ------------------------------------------------------------------ sheet 1: the glasses, three views + iso */
export function ArtFrame({ ground }: { readonly ground: Ground }) {
  const d = F.dims;
  return (
    <div className={k.art} style={{ aspectRatio: '640 / 400' }}>
      <svg className={k.under} viewBox="0 0 640 400" aria-hidden="true">
        {/* projection lines from the front view into the top and side views */}
        <path className={k.con} pathLength={1} d="M30 92 H470 M30 150 H470 M48 28 V372 M292 28 V372 M170 20 V380 M340 20 V380 M450 20 V380" />
      </svg>
      <div className={k.view} style={{ left: '7.5%', top: '12%', width: '38%' }}>{glassesLine('front', ground, 'SHADES glasses, front view')}</div>
      <div className={k.view} style={{ left: '55%', top: '12%', width: '13%' }}>{glassesLine('side', ground, 'SHADES glasses, right side view')}</div>
      <div className={k.view} style={{ left: '74%', top: '8%', width: '24%' }}>{glassesLine('three-quarter', ground, 'SHADES glasses, isometric view from the right')}</div>
      <div className={k.view} style={{ left: '74%', top: '50%', width: '24%' }}>{glassesLine('three-quarter', ground, 'SHADES glasses, isometric view from the left', -36)}</div>
      <svg className={k.over} viewBox="0 0 640 400" role="img" aria-label={`Frame width ${d.width.text} mm, target. Mass ${d.mass.text}, target. Nose-to-ear split ${d.split.text}, target.`}>
        {/* centre line, front view */}
        <path className={k.cl} d="M170 30 V170" />
        {/* top view: drafted brow bar and splayed temples */}
        <g>
          <path className={k.ln} pathLength={1} d="M48 230 H292 V240 H48 Z" />
          <path className={k.ln} pathLength={1} d="M52 240 L46 352 M288 240 L294 352" />
          <path className={k.hid} d="M80 240 v10 M260 240 v10" />
          <path className={k.cl} d="M170 220 V362" />
          <rect className={k.ln} pathLength={1} x={196} y={240} width={46} height={14} />
          <Leader x={219} y={254} tx={238} ty={290} text="DISPLAY + OPTICS" />
        </g>
        <Dim x1={48} y1={352} x2={292} y2={352} off={22} text={d.width.text} sub="TARGET" />
        <Dim x1={300} y1={240} x2={300} y2={265} off={30} text={d.strain.text} />
        {/* side view: nose : ear split */}
        <path className={k.dim} pathLength={1} d="M356 170 H446" markerStart="url(#dw-arrow)" markerEnd="url(#dw-arrow)" />
        <text className={k.dimT} x={401} y={186} textAnchor="middle">
          {`NOSE : EAR ${d.split.text}`}
        </text>
        <text className={k.dimSub} x={401} y={199} textAnchor="middle">TARGET</text>
        {/* mass callout, boxed */}
        <g>
          <rect className={k.ln} pathLength={1} x={352} y={292} width={110} height={40} />
          <text className={k.dimT} x={407} y={309} textAnchor="middle">{`MASS ${d.mass.text}`}</text>
          <text className={k.dimSub} x={407} y={324} textAnchor="middle">TARGET</text>
          <path className={k.lead} pathLength={1} d="M352 312 L312 312 L292 292" />
        </g>
        <Datum x={170} y={172} id="A" />
        <Label x={170} y={212}>{F.views.front}</Label>
        <Label x={170} y={390}>{F.views.top}</Label>
        <Label x={398} y={140}>{F.views.side}</Label>
        <Label x={552} y={180}>{`${F.views.iso} 1`}</Label>
        <Label x={552} y={388}>{`${F.views.iso} 2`}</Label>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ sheet 2: the controller */
/** Iso box for the puck: L axis (0.866, 0.5), W axis (0.866, -0.5), thickness straight down. */
const ISO = (() => {
  const o = [438, 112] as const;
  const L = [112.6, 65] as const;
  const W = [56.3, -32.5] as const;
  const t = 12;
  const p = (a: number, b: number, c = 0) => `${(o[0] + L[0] * a + W[0] * b).toFixed(1)} ${(o[1] + L[1] * a + W[1] * b + t * c).toFixed(1)}`;
  return { p };
})();

export function ArtPuck() {
  const d = K.dims;
  const c = K.parts;
  const { p } = ISO;
  return (
    <div className={k.art} style={{ aspectRatio: '640 / 400' }}>
      <svg className={k.over} viewBox="0 0 640 400" role="img" aria-label={`Controller, approximately ${d.w.text} by ${d.l.text} by ${d.t.text} millimetres, target. ${c.dial.text}, ${c.play.text}, ${c.rewind.text}, ${c.cable.text}.`}>
        <path className={k.con} pathLength={1} d="M20 60 H400 M20 180 H400 M60 30 V300 M300 30 V300 M40 240 H340 M40 256 H340" />
        {/* plan view: the face with the controls */}
        <rect className={k.ln} pathLength={1} x={60} y={60} width={240} height={120} rx={14} />
        <circle className={k.ln} pathLength={1} cx={236} cy={120} r={30} />
        <circle className={k.hid} cx={236} cy={120} r={20} />
        <circle className={k.ln} pathLength={1} cx={124} cy={98} r={11} />
        <circle className={k.ln} pathLength={1} cx={124} cy={142} r={11} />
        <path className={k.ln} pathLength={1} d="M60 114 H38 M60 126 H38 M38 110 V130" />
        <path className={k.cl} d="M180 48 V192 M48 120 H312" />
        <Leader x={236} y={90} tx={258} ty={38} text={c.dial.text} />
        <Leader x={124} y={87} tx={96} ty={38} text={c.play.text} end />
        <Leader x={124} y={153} tx={96} ty={174} text={c.rewind.text} end />
        <Leader x={38} y={110} tx={30} ty={74} text={c.cable.text} end />
        {/* section cut line A–A through the dial */}
        <path className={k.cut} d="M40 120 h14 M306 120 h14" />
        <text className={k.lblSm} x={34} y={110} textAnchor="middle">A</text>
        <text className={k.lblSm} x={326} y={110} textAnchor="middle">A</text>
        <Dim x1={60} y1={180} x2={300} y2={180} off={26} text={d.l.text} sub="TARGET" />
        <Dim x1={300} y1={60} x2={300} y2={180} off={42} text={d.w.text} />
        {/* edge view */}
        <rect className={k.ln} pathLength={1} x={60} y={240} width={240} height={16} rx={4} />
        <Dim x1={300} y1={240} x2={300} y2={256} off={42} text={d.t.text} />
        {/* section A–A: shell hatched, cavity open */}
        <g transform="translate(0 60)">
          <path className={k.hatch} d="M60 240 h240 v28 h-240 Z M66 246 v16 h228 v-16 Z" fillRule="evenodd" />
          <path className={k.ln} pathLength={1} d="M60 240 h240 v28 h-240 Z M66 246 h228 v16 h-228 Z" />
          <rect className={k.ln} pathLength={1} x={206} y={232} width={60} height={8} />
          <Label x={180} y={292}>{K.section.text}</Label>
        </g>
        {/* iso */}
        <path className={k.ln} pathLength={1} d={`M${p(0, 0)} L${p(1, 0)} L${p(1, 1)} L${p(0, 1)} Z`} />
        <path className={k.ln} pathLength={1} d={`M${p(0, 0)} L${p(0, 0, 1)} L${p(1, 0, 1)} L${p(1, 0)} M${p(1, 0, 1)} L${p(1, 1, 1)} L${p(1, 1)}`} />
        <ellipse className={k.ln} pathLength={1} cx={548} cy={112} rx={22} ry={12.5} />
        <ellipse className={k.ln} pathLength={1} cx={480} cy={82} rx={8} ry={4.6} />
        <ellipse className={k.ln} pathLength={1} cx={498} cy={92} rx={8} ry={4.6} />
        <Label x={520} y={230}>ISO</Label>
        <Label x={180} y={226}>PLAN</Label>
        <Label x={180} y={278}>EDGE</Label>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ sheet 3: where the parts live */
function MiniGlasses({ x, y, marks }: { readonly x: number; readonly y: number; readonly marks?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path className={k.ln} pathLength={1} d="M0 6 H180 M4 6 v34 q0 12 12 12 h52 q12 0 12 -12 v-26 M100 14 v26 q0 12 12 12 h52 q12 0 12 -12 v-34 M80 16 q10 -8 20 0" />
      <rect className={k.ln} pathLength={1} x={130} y={18} width={30} height={14} />
      {marks ? (
        <>
          <circle className={k.markDot} cx={176} cy={22} r={5} />
          <circle className={k.markDot} cx={4} cy={22} r={5} />
        </>
      ) : null}
    </g>
  );
}

function MiniPuck({ x, y, controls }: { readonly x: number; readonly y: number; readonly controls?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className={k.ln} pathLength={1} x={0} y={0} width={120} height={60} rx={9} />
      <path className={k.hid} d="M10 10 h50 v40 h-50 Z M68 10 h42 v40 h-42 Z" />
      {controls ? (
        <>
          <circle className={k.markDot} cx={92} cy={30} r={12} />
          <circle className={k.markDot} cx={28} cy={20} r={6} />
          <circle className={k.markDot} cx={28} cy={42} r={6} />
        </>
      ) : null}
    </g>
  );
}

export function ArtRoutes() {
  return (
    <div className={k.art} style={{ aspectRatio: '640 / 300' }}>
      <svg className={k.over} viewBox="0 0 640 300" role="img" aria-label="Route A: controls on the frame. Route B: dial and buttons on the pocket controller. Both open.">
        <path className={k.con} pathLength={1} d="M320 10 V290 M20 150 H620" />
        <path className={k.cl} d="M320 20 V280" />
        {[0, 1].map((r) => {
          const ox = r * 320;
          return (
            <g key={r}>
              <text className={k.route} x={ox + 24} y={34}>{R.variants[r].route}</text>
              <MiniGlasses x={ox + 70} y={60} marks={r === 0} />
              <path className={k.ln} pathLength={1} d={`M${ox + 250} ${88} q30 40 -40 92 L${ox + 210} 200`} />
              <MiniPuck x={ox + 150} y={200} controls={r === 1} />
              <text className={k.note} x={ox + 24} y={280}>{r === 0 ? 'CONTROLS · FRAME' : 'CONTROLS · PUCK'}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ sheet 4: optics and focus */
function BirdBath({ x, travel, slide, ghost }: { readonly x: number; readonly travel?: boolean; readonly slide?: boolean; readonly ghost?: boolean }) {
  const L = O.labels;
  if (ghost) {
    return (
      <g transform={`translate(${x} 0)`} className={k.ghost}>
        <rect className={k.ln} pathLength={1} x={20} y={110} width={110} height={14} />
        <path className={k.hid} d="M30 117 L120 117 M40 110 l8 14 M102 110 l8 14" />
        <path className={k.strike} pathLength={1} d="M14 170 L136 70" />
        <Label x={75} y={150}>{L.waveguide.text}</Label>
      </g>
    );
  }
  return (
    <g transform={`translate(${x} 0)`}>
      <rect className={k.ln} pathLength={1} x={slide ? 40 : 52} y={52} width={46} height={12} />
      <path className={k.ln} pathLength={1} d="M48 118 L104 74" />
      <path className={k.ln} pathLength={1} d="M120 70 q14 26 0 52" />
      <path className={k.ray} pathLength={1} d="M75 64 V96 L120 96 M118 98 L22 98" markerEnd="url(#dw-arrow)" />
      <path className={k.ln} pathLength={1} d="M4 98 q9 -11 18 0 q-9 11 -18 0 Z" />
      {travel ? <path className={k.dim} pathLength={1} d="M96 40 H54" markerStart="url(#dw-arrow)" markerEnd="url(#dw-arrow)" /> : null}
      {travel ? <text className={k.dimT} x={75} y={34} textAnchor="middle">{`${L.travel.text} mm`}</text> : null}
      {slide ? <path className={k.dim} pathLength={1} d="M30 136 H96" markerStart="url(#dw-arrow)" markerEnd="url(#dw-arrow)" /> : null}
    </g>
  );
}

export function ArtOptics() {
  const L = O.labels;
  return (
    <div className={k.art} style={{ aspectRatio: '640 / 220' }}>
      <svg className={k.over} viewBox="0 0 640 220" role="img" aria-label="Route A fixed focus; Route B a plus or minus 4 millimetre focal carriage; Route C the projector slides; waveguide and varifocal are out of scope.">
        <path className={k.con} pathLength={1} d="M160 8 V212 M320 8 V212 M480 8 V212 M8 98 H632" />
        <BirdBath x={0} />
        <BirdBath x={160} travel />
        <BirdBath x={320} slide />
        <BirdBath x={480} ghost />
        {O.variants.map((v, i) => (
          <text key={v.name.text} className={`${k.route} ${v.ghost ? k.ghostT : ''}`} x={i * 160 + 12} y={200}>{v.route}</text>
        ))}
        <Leader x={75} y={64} tx={20} ty={20} text={L.display.text} />
        <Leader x={90} y={86} tx={20} ty={150} text={L.splitter.text} />
        <Leader x={127} y={110} tx={100} ty={172} text={L.mirror.text} />
        <text className={k.note} x={13} y={124} textAnchor="middle">{L.eye.text}</text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ tags + variant tables (sheets 3–6) */
const TAG_CLASS: Readonly<Record<Tag, string>> = {
  TARGET: k.tTarget,
  OPEN: k.tOpen,
  MVP: k.tMvp,
  STRETCH: k.tStretch,
  CONDITIONAL: k.tCond,
  CANDIDATE: k.tCand,
  'OUT OF SCOPE': k.tOut,
};

export function TagMark({ tag }: { readonly tag: Tag }) {
  return <span className={`${k.tag} ${TAG_CLASS[tag]}`}>{tag}</span>;
}

export function Variants({ items, cols }: { readonly items: readonly Variant[]; readonly cols: number }) {
  return (
    <ul className={k.variants} style={{ ['--cols' as string]: cols }}>
      {items.map((v) => (
        <li key={v.name.text} className={v.ghost ? k.ghostRow : undefined}>
          <span className={k.route}>{v.route}</span>
          <span className={k.vName}>{v.ghost ? <s>{v.name.text}</s> : v.name.text}</span>
          <span className={k.vBody}>{v.body.text}</span>
          <TagMark tag={v.tag} />
        </li>
      ))}
    </ul>
  );
}

/** Package footprint per function: quad flat pack, USB-C receptacle, display glass, small outline. */
function Footprint({ kind }: { readonly kind: string }) {
  const pins = (n: number, x: number, y: number, dx: number, dy: number, w: number, h: number) =>
    Array.from({ length: n }, (_, i) => <rect key={`${x}${y}${i}`} className={k.pinR} x={x + dx * i} y={y + dy * i} width={w} height={h} />);
  let body: ReactNode;
  if (kind === 'FPGA' || kind === 'MCU') {
    body = (
      <>
        <rect className={k.ln} pathLength={1} x={18} y={10} width={44} height={44} />
        <circle className={k.ln} pathLength={1} cx={25} cy={17} r={2.5} />
        {pins(7, 22, 4, 6, 0, 2.4, 5)}
        {pins(7, 22, 55, 6, 0, 2.4, 5)}
        {pins(7, 12, 14, 0, 6, 5, 2.4)}
        {pins(7, 63, 14, 0, 6, 5, 2.4)}
      </>
    );
  } else if (kind === 'LINK') {
    body = (
      <>
        <rect className={k.ln} pathLength={1} x={12} y={22} width={56} height={20} rx={10} />
        <rect className={k.hid} x={22} y={29} width={36} height={6} rx={3} />
      </>
    );
  } else if (kind === 'DISPLAY') {
    body = (
      <>
        <rect className={k.ln} pathLength={1} x={14} y={12} width={52} height={40} />
        <rect className={k.hid} x={20} y={18} width={40} height={28} />
      </>
    );
  } else {
    body = (
      <>
        <rect className={k.ln} pathLength={1} x={24} y={18} width={32} height={28} />
        {pins(5, 27, 12, 6, 0, 2.4, 5)}
        {pins(5, 27, 47, 6, 0, 2.4, 5)}
      </>
    );
  }
  return (
    <svg className={k.fp} viewBox="0 0 80 64" aria-hidden="true">
      {body}
    </svg>
  );
}

export function ArtParts() {
  return (
    <ul className={k.parts}>
      {P.variants.map((v) => (
        <li key={v.name.text}>
          <Footprint kind={v.route} />
          <span className={k.route}>{v.route}</span>
          <span className={k.vName}>{v.name.text}</span>
          <span className={k.vBody}>{v.body.text}</span>
          <TagMark tag={v.tag} />
        </li>
      ))}
    </ul>
  );
}

export function ArtBoards() {
  return (
    <ul className={k.boards}>
      {B.items.map((b) => (
        <li key={b.name.text} className={k.board}>
          <span className={k.boardName}>{b.name.text}</span>
          <ul className={k.modules}>
            {b.modules.map((mo) => (
              <li key={mo.name.text}>
                <span>{mo.name.text}</span>
                <TagMark tag={mo.tag} />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
