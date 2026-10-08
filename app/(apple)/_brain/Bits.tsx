/**
 * Server-safe BRAIN pieces (no hooks): method loop, plan mark, sources, [confirm] tag.
 */
import { DotGlyph } from '../_system';
import { close, footnote, sources } from '../_content/brain';
type World = 'signal' | 'apple';
import s from './bits.module.css';

export function Confirm() {
  return (
    <span className={s.confirm} title="Club planning notes, not yet confirmed">
      [confirm]
    </span>
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
