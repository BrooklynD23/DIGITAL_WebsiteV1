'use client';

/** AI SDK Elements "Reasoning" pattern: a fixed-height readout (never changes the chapter's height). Newest line at the bottom. */
import { useEffect, useState } from 'react';
import { homeJobs, readoutLabels, type HomeJob } from '../_content/home';
import s from './brain.module.css';

type Line = { readonly k: 'think'; readonly text: string } | { readonly k: 'tool'; readonly tool: HomeJob['tools'][number] };

const ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    <path d="M12 18v-5" />
  </svg>
);
const CHEV = (
  <svg className={s.chev} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="m6 15 6-6 6 6" />
  </svg>
);

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function AgentReadout({ reduce, active, onKick, onTarget }: { readonly reduce: boolean; readonly active: boolean; readonly onKick: () => void; readonly onTarget: (v: number) => void }) {
  const [lines, setLines] = useState<readonly Line[]>([]);
  const [label, setLabel] = useState<string>(readoutLabels.thinking);
  const [busy, setBusy] = useState(true);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (reduce) {
      const j = homeJobs[0];
      setLines([{ k: 'think', text: j.think }, ...j.tools.map((tool) => ({ k: 'tool' as const, tool }))]);
      setLabel(readoutLabels.thought(j.sec));
      setBusy(false);
      return;
    }
    if (!active) return;
    let dead = false;
    const sleep = async (ms: number) => { await wait(ms); return !dead; };
    (async () => {
      for (let j = 0; !dead; j = (j + 1) % homeJobs.length) {
        const job = homeJobs[j];
        setLines([]); setLabel(readoutLabels.thinking); setBusy(true); setOpen(true); onTarget(0.9);
        for (let i = 0; i <= job.think.length; i += 2) {
          setLines([{ k: 'think', text: job.think.slice(0, i) }]);
          if (!(await sleep(18))) return;
        }
        setLines([{ k: 'think', text: job.think }]);
        for (const tool of job.tools) {
          if (!(await sleep(650))) return;
          setLines((l) => [...l, { k: 'tool', tool }]);
          onKick();
        }
        setLabel(readoutLabels.thought(job.sec)); setBusy(false); onTarget(0.25);
        if (!(await sleep(2200))) return;
        setOpen(false);
        if (!(await sleep(1400))) return;
      }
    })();
    return () => { dead = true; };
  }, [reduce, active, onKick, onTarget]);

  return (
    <div className={s.rsn} data-open={open ? '1' : '0'}>
      <button type="button" className={s.trigger} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {ICON}
        <span className={busy ? s.shimmer : undefined}>{label}</span>
        {CHEV}
      </button>
      <div className={s.body} aria-live="off">
        {lines.map((l, i) =>
          l.k === 'think' ? (
            <p key={i} className={s.think}>{l.text}</p>
          ) : (
            <div key={i} className={s.tool}>
              <b>{l.tool[0]}</b><span>{l.tool[1]}</span>
              <span className={l.tool[3] === false ? s.no : s.ok}>{l.tool[2]}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
