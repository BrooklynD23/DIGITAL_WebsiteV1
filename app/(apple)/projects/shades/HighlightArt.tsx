/**
 * SHADES highlight media (server-safe line art), one per card of the shared <Highlights> strip.
 * Each is a diagram of the fact in its caption, drawn in the page's dotted line language.
 */
import type { ReactNode } from 'react';
import { SHADES, type Highlight } from '../../_content/shades';
import s from './apple.module.css';

export function Art({ id }: { readonly id: Highlight['id'] }): ReactNode {
  switch (id) {
    case 'timing':
      return (
        <svg viewBox="0 0 300 160" className={s.art} aria-hidden="true" focusable="false">
          <path className={s.artLine} d="M10 120h30v-40h50v40h20v-40h50v40h20v-40h50v40h60" />
          {[40, 110, 180].map((x) => (
            <rect key={x} className={s.artFill} x={x + 8} y={52} width={34} height={8} rx={2} />
          ))}
          <path className={s.artHair} d="M10 140h280" strokeDasharray="2 6" />
        </svg>
      );
    case 'pace':
      return (
        <svg viewBox="0 0 300 160" className={s.art} aria-hidden="true" focusable="false">
          <path className={s.artHair} d="M40 100h220" />
          {[40, 84, 128, 172, 216, 260].map((x) => (
            <path key={x} className={s.artHair} d={`M${x} 92v16`} />
          ))}
          <path className={s.artLine} d="M40 100h110" />
          <circle className={s.artKnob} cx={150} cy={100} r={13} />
          <text className={s.artMono} x={150} y={62} textAnchor="middle">
            {SHADES.reader.wpm.initial} {SHADES.reader.unit}
          </text>
        </svg>
      );
    case 'type':
      return (
        <svg viewBox="0 0 300 160" className={s.art} aria-hidden="true" focusable="false">
          <text className={s.artType} x={150} y={104} textAnchor="middle">
            Il1 O0 rn
          </text>
        </svg>
      );
    case 'link':
      return (
        <svg viewBox="0 0 300 160" className={s.art} aria-hidden="true" focusable="false">
          <rect className={s.artLine} x={22} y={46} width={92} height={60} rx={4} />
          <path className={s.artLine} d="M10 116h116" />
          <path className={s.artDots} d="M126 96C170 96 160 72 206 72" />
          <rect className={s.artLine} x={206} y={52} width={72} height={40} rx={8} />
          <circle className={s.artKnobSmall} cx={228} cy={72} r={5} />
          <circle className={s.artKnobSmall} cx={252} cy={72} r={5} />
        </svg>
      );
    case 'optics':
      return (
        <svg viewBox="0 0 300 160" className={s.art} aria-hidden="true" focusable="false">
          <path className={s.artDots} d="M20 80h170" />
          <path className={s.artLine} d="M120 30Q140 80 120 130Q100 80 120 30Z" />
          <path className={s.artLine} d="M200 80Q236 52 272 80Q236 108 200 80Z" />
          <circle className={s.artKnobSmall} cx={226} cy={80} r={6} />
          <circle className={s.artAnchor} cx={190} cy={80} r={4} />
        </svg>
      );
    default:
      return null;
  }
}
