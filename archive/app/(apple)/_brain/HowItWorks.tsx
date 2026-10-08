'use client';

/**
 * "How it works" disclosure: the full sequence and the detail the chapter keeps off the stage.
 * Open in the server HTML (no JS) and under reduced motion; closed by default once the page can move.
 */
import { useEffect, useState } from 'react';
import { useReducedMotion } from '../_system';
import type { Chapter } from '../_content/brain';
import type { World } from './DemoShell';
import s from './bits.module.css';

export function HowItWorks({ ch, world }: { readonly ch: Chapter; readonly world: World }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(true);
  useEffect(() => setOpen(reduced), [reduced]);
  return (
    <details className={s.how} data-world={world} open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>{world === 'signal' ? 'HOW IT WORKS' : 'How it works'}</summary>
      <ol>
        {ch.how.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ol>
      <p className={s.srcLine}>{`Sources: ${ch.src.join(', ')} (below)`}</p>
    </details>
  );
}
