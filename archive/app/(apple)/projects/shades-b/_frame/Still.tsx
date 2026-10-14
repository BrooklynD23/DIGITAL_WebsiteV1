/**
 * SHADES mockup B · one stage as a still (reduced motion, no JS). Pure SVG from the same geometry and pose table
 * as the live figure, so a still is the rest pose of its stage, not a separate drawing.
 */
import { bookWords, heldWord, systemGroups } from '../../../_content/shades-concept';
import { EX_DISPLAY, EX_OPTICS, HELD, framePaths, planeMatrix, poseAt, project } from './geometry';
import s from '../book.module.css';

const W = 720;
const H = 440;
const LINES = [0, 8, 16, 24, 32, 40].map((k) => bookWords.slice(k, k + 8).join(' '));
const LINE_Y = [98, 130, 162, 290, 322, 354];
/** Illustrative fixations over the first lines (hero still): x, y, radius. One jump goes back. */
const FIX: ReadonlyArray<readonly [number, number, number]> = [[232, 92, 8], [300, 92, 6], [392, 92, 10], [352, 92, 6], [470, 92, 8], [250, 124, 9], [338, 124, 6], [432, 124, 10]];
const OFF: Readonly<Record<string, readonly [number, number]>> = { timing: [40, 368], control: [222, 368] };
const label = (id: string): string => systemGroups.find((g) => g.id === id)?.label ?? '';

export function Still({ index, alt }: { readonly index: number; readonly alt: string }) {
  const { p, cam } = poseAt(index, W, H);
  const f = framePaths(cam, p.explode);
  const dark = p.shade > 0.5;
  const solid = p.fill > 0.5;
  const at = [HELD[0], HELD[1], p.explode * EX_DISPLAY] as const;
  const k = (50 * cam.s * p.word) / 300;
  const [dx, dy] = project(at, cam);
  const tag = (pt: readonly [number, number, number], dz: number, off: number): { readonly x: number; readonly y: number } => {
    const [x, y] = project(pt, cam, dz);
    return { x: Math.round(x), y: Math.round(y + off) }; // rounded: server and browser floats differ in the last bit
  };
  const frameTag = tag([31, -25.5, 0], 0, -8);
  const opticsTag = tag([-31, -25.5, 0], p.explode * EX_OPTICS, -8);
  const displayTag = tag([-31, 8, 0], p.explode * EX_DISPLAY, 18);
  return (
    <svg className={s.still} data-tone={dark ? 'dark' : undefined} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={alt}>
      {dark ? <rect width={W} height={H} className={s.stillGround} /> : null}
      {p.glass > 0 ? <path className={s.glass} style={{ ['--glass' as string]: p.glass }} d={f.glass} /> : null}
      {p.page > 0.5 ? (
        <g className={s.stillPage}>
          {LINES.map((line, n) => (
            <text key={line} x={W / 2} y={LINE_Y[n]} textAnchor="middle">{line}</text>
          ))}
        </g>
      ) : null}
      {index === 0 ? (
        <g className={s.stillScan}>
          <path d={FIX.slice(1).map(([x, y], n) => `M${FIX[n][0]} ${FIX[n][1]}Q${(FIX[n][0] + x) / 2} ${Math.min(FIX[n][1], y) - 16} ${x} ${y}`).join('')} />
          {FIX.map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
          ))}
        </g>
      ) : null}
      {p.frame > 0 ? (
        <g className={s.body} data-line={solid ? 'solid' : 'dashed'} style={{ ['--fill' as string]: p.fill, ['--tint' as string]: p.tint, ['--glass' as string]: p.glass, ['--temple' as string]: p.yaw ? 1 : 0 }}>
          <path className={s.temple} d={f.templeL} />
          <path className={s.temple} d={f.templeR} />
          <path className={s.back} d={f.back} />
          <path className={s.tint} d={f.lenses} />
          <path className={s.front} d={f.front} />
          {p.explode > 0 ? <path className={s.optics} d={f.optics} /> : null}
          {p.explode > 0 ? <path className={s.axis} d={f.axis} /> : null}
          {p.cons > 0 ? <path className={s.cons} d={f.cons} /> : null}
        </g>
      ) : null}
      {p.sys > 0 ? (
        <g className={s.stillSys}>
          <path className={s.chain} d={`M190 388H222M297 368L${dx.toFixed(0)} ${(dy + 48 * k).toFixed(0)}`} />
          {(['timing', 'control'] as const).map((id) => (
            <g key={id} transform={`translate(${OFF[id][0]} ${OFF[id][1]})`}>
              <rect width="150" height="40" rx="8" className={s.stillOff} />
              <text x="75" y="25" textAnchor="middle">{label(id)}</text>
            </g>
          ))}
          <text x={frameTag.x} y={frameTag.y} textAnchor="middle">{label('frame')}</text>
          <text x={opticsTag.x} y={opticsTag.y} textAnchor="middle">{label('optics')}</text>
          <text x={displayTag.x} y={displayTag.y} textAnchor="middle">{label('display')}</text>
        </g>
      ) : null}
      <g transform={planeMatrix(cam, at, k)}>
        <rect x="-150" y="-48" width="300" height="96" rx="14" className={s.stillPlate} />
        <text className={s.stillWord} y="8" textAnchor="middle">{heldWord}</text>
        <circle className={s.stillPoint} cy="30" r="4" />
      </g>
    </svg>
  );
}
