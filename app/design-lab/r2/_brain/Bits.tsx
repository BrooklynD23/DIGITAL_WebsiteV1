/**
 * Server-safe BRAIN pieces (no hooks): fidelity note, notes coda, method loop, sources, [confirm] tag.
 */
import { DotGlyph } from '../_system';
import { close, footnote, sources, type Chapter } from '../_content/brain';
import type { World } from './DemoShell';
import s from './bits.module.css';

export function Confirm() {
  return (
    <span className={s.confirm} title="Club planning notes, not yet confirmed">
      [confirm]
    </span>
  );
}

/** Faithful vs metaphor, every chapter. The illustrative note names the picture so no one reads it as fact. */
export function Fidelity({ ch, world }: { readonly ch: Chapter; readonly world: World }) {
  const kind = ch.fidelity === 'faithful' ? 'Faithful' : 'Metaphor';
  return (
    <p className={s.fidelity} data-world={world}>
      <span className={s.kind} data-kind={ch.fidelity}>
        {kind}
      </span>
      {ch.illustrative ? <span className={s.illus}>{`Illustrative: ${ch.illustrative}`}</span> : null}
    </p>
  );
}

/** Ch6 coda: notes outside the window carry a long task across sessions (static figure). */
export function NotesCoda({ world }: { readonly world: World }) {
  return (
    <figure className={s.coda} data-world={world}>
      <svg viewBox="0 0 320 64" width="320" height="64" role="img" aria-label="Session one ends; its notes and feature list stay; session two reads them and continues.">
        <g fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
          <circle cx="32" cy="32" r="18" strokeDasharray="2 3" opacity="0.5" />
          <path d="M60 32h46" strokeDasharray="1 3" opacity="0.6" />
          <rect x="116" y="14" width="40" height="36" strokeDasharray="4 3" opacity="0.7" />
          <path d="M166 32h46" strokeDasharray="1 3" opacity="0.6" />
          <circle cx="288" cy="32" r="18" />
        </g>
        <g fill="currentColor">
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3].map((col) => <circle key={`${row}-${col}`} cx={124 + col * 8} cy={23 + row * 9} r="1.6" opacity={row < 2 ? 0.9 : 0.35} />),
          )}
          {[0, 1, 2, 3, 4].map((n) => (
            <circle key={`f${n}`} cx={226 + n * 10} cy="32" r="2.2" fill={n === 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1" />
          ))}
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <circle key={`o${n}`} cx={288 + Math.cos((n / 6) * Math.PI * 2) * 7} cy={32 + Math.sin((n / 6) * Math.PI * 2) * 7} r="1.8" />
          ))}
        </g>
      </svg>
      <figcaption>Notes kept outside the window carry a long task into the next session.</figcaption>
    </figure>
  );
}

/** BRAIN's method as a closed loop: predict → build → measure → revise → record → predict. */
export function MethodLoop({ world }: { readonly world: World }) {
  return (
    <ol className={s.method} data-world={world} aria-label="BRAIN method, a loop">
      {close.method.map((step, i) => (
        <li key={step}>
          <span className={s.node} aria-hidden="true" data-first={i === 0 ? 'true' : undefined} />
          {step}
        </li>
      ))}
    </ol>
  );
}

/** The close's mark: the orb returns to its plan outline (form, rest pose). */
export function PlanMark({ size = 160, label }: { readonly size?: number; readonly label?: string }) {
  return <DotGlyph verb="form" size={size} shape="triangle" label={label} />;
}

export function Sources({ world }: { readonly world: World }) {
  return (
    <details className={s.sources} data-world={world}>
      <summary>{footnote.summary}</summary>
      <p>{footnote.note}</p>
      <ol>
        {sources.map((src) => (
          <li key={src.id}>
            <span className={s.srcId}>{src.id}</span>{' '}
            <a href={src.href} rel="noopener noreferrer" target="_blank">
              {src.title}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
