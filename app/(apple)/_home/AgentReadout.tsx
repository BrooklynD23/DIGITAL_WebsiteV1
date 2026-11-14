'use client';

/** AI SDK Elements "Reasoning" pattern: a fixed-height readout, rendered from the shared loop state. A tool's result prints only when its dot returns. */
import type { ReactNode } from 'react';
import { readoutLabels } from '../_content/home';
import { CHAR, held, type LoopState } from './sphere/timeline';
import s from './brain.module.css';

const ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    <path d="M12 18v-5" />
  </svg>
);

function view(st: LoopState) {
  const chars = st.phase === 'think' ? Math.floor(st.u / CHAR) : st.job.think.length;
  const shown = st.phase === 'think' ? 0 : st.phase === 'tool' ? st.ti + 1 : st.job.tools.length;
  const pending = st.phase === 'tool' && !held(st.job.tools[st.ti]) && st.p < 0.62;
  return { chars, shown, pending };
}
/** Changes only when the readout would look different. */
export function readoutKey(st: LoopState): string {
  const v = view(st);
  return [st.ji, v.chars, v.shown, v.pending, st.phase].join('|');
}

export function AgentReadout({ st, reduce, children }: { readonly st: LoopState; readonly reduce: boolean; readonly children?: ReactNode }) {
  const { chars, shown, pending } = view(st);
  const busy = st.phase === 'think' || st.phase === 'tool';
  return (
    <div className={s.rsn} data-open={st.phase === 'rest' ? '0' : '1'}>
      <div className={s.rsnTop}>
        <span className={s.trigger}>
          {ICON}
          <span className={busy && !reduce ? s.shimmer : undefined}>{busy ? readoutLabels.thinking : readoutLabels.thought(st.job.sec)}</span>
        </span>
        {children}
      </div>
      <div className={s.body} aria-live="off">
        <p className={s.think}>{st.job.think.slice(0, chars)}</p>
        {st.job.tools.slice(0, shown).map((t, i) => (
          <div key={i} className={s.tool}>
            <b>{t[0]}</b><span>{t[1]}</span>
            {!(pending && i === shown - 1) && <span className={held(t) ? s.no : s.ok}>{t[2]}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
