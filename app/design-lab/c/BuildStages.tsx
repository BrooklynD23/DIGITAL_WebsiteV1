'use client';

/**
 * Concept C — the four workflow stages (phoneV2Copy.toolbox.workflowStages)
 * drawn with thinking-orbs. Each orb state is mapped to one real stage:
 *   plan → shaping      (an outline settles on a form)
 *   prototype → working (parts in motion on their own orbits)
 *   test → solving      (bands scramble, then click back)
 *   integrate → connecting (separate nodes wire into one network)
 * Orbs stay frozen until their stage is hovered, focused or pressed, so the
 * section never animates on its own. Reduced motion: the library draws a
 * static frame.
 */
import { useState } from 'react';
import { ThinkingOrb, type OrbState } from 'thinking-orbs';
import styles from './c.module.css';

const ORB_FOR: Record<string, OrbState> = {
  plan: 'shaping',
  prototype: 'working',
  test: 'solving',
  integrate: 'connecting',
};

const WHY: Record<string, string> = {
  plan: 'An outline settles on a form.',
  prototype: 'Parts move on their own orbits.',
  test: 'It scrambles, then clicks back.',
  integrate: 'Separate nodes wire into one.',
};

export default function BuildStages({ stages }: { readonly stages: readonly string[] }) {
  const [active, setActive] = useState(-1);
  const [pinned, setPinned] = useState(-1);
  const on = pinned >= 0 ? pinned : active;
  return (
    <ol className={styles.stages}>
      {stages.map((s, i) => (
        <li key={s} className={styles.stage4}>
          <button
            type="button"
            className={styles.stageBtn}
            aria-pressed={pinned === i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(-1)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(-1)}
            onClick={() => setPinned((p) => (p === i ? -1 : i))}
          >
            <span className={styles.stageOrb}>
              <ThinkingOrb
                state={ORB_FOR[s] ?? 'breathing'}
                size={64}
                theme="dark"
                color="#ece8de"
                paused={on !== i}
                aria-label={`${s} stage mark`}
              />
            </span>
            <span className={styles.stageNum}>Stage {String(i + 1).padStart(2, '0')}</span>
            <span className={styles.stageName}>{s}</span>
            <span className={styles.stageWhy}>{WHY[s] ?? ''}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}
