import type { CSSProperties } from 'react';
import { homeLandingCopy } from '@/lib/data/homeLanding';
import { projects } from '@/lib/data/projects';
import { VISION_LINE } from '@/lib/data/mission';
import { PAIRINGS, type Pairing } from './pairings';
import styles from './type-lab.module.css';

const hero = homeLandingCopy.hero.lines;
const thesis = homeLandingCopy.thesis.heading;
const phone = projects[0];
const reading = projects[1];

function panelStyle(p: Pairing): CSSProperties {
  return {
    ['--f-display' as string]: p.display.stack,
    ['--f-body' as string]: p.body.stack,
    ['--f-mono' as string]: p.mono.stack,
    ['--d-weight' as string]: String(p.tune.weight),
    ['--d-track' as string]: p.tune.tracking,
    ['--d-lead' as string]: String(p.tune.leading),
    ['--d-case' as string]: p.tune.upper ? 'uppercase' : 'none',
    ['--d-var' as string]: p.tune.variation ?? 'normal',
    ['--d-scale' as string]: String(p.tune.scale ?? 1),
  };
}

function Specimen({ p, index }: { readonly p: Pairing; readonly index: number }) {
  const faces = [
    ['Display', p.display],
    ['Body', p.body],
    ['Mono', p.mono],
  ] as const;
  return (
    <section id={p.id} className={styles.panel} style={panelStyle(p)} aria-labelledby={`${p.id}-h`}>
      <header className={styles.meta}>
        <p className={styles.metaIndex}>{String(index).padStart(2, '0')}</p>
        <div>
          <h2 id={`${p.id}-h`} className={styles.metaTitle}>{p.label}</h2>
          <p className={styles.metaDir}>{p.direction}</p>
        </div>
        <dl className={styles.faces}>
          {faces.map(([role, f]) => (
            <div key={role}>
              <dt>{role}</dt>
              <dd>
                {f.name} · {f.source} · {f.license}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <div className={styles.specimen}>
        <p className={styles.eyebrow}>{homeLandingCopy.thesis.eyebrow} · DG-0001 · REV A</p>
        <p className={styles.display}>
          <span>{hero[0]}</span>{' '}
          <span className={p.tune.italicSecondLine ? styles.italic : undefined}>{hero[1]}</span>
        </p>

        <div className={styles.cols}>
          <div>
            <p className={styles.h2}>{thesis}</p>
            <p className={styles.body}>{phone.shortDescription}</p>
            <p className={styles.body}>{reading.fullDescription}</p>
          </div>
          <div>
            <p className={styles.h3}>{phone.title}</p>
            <ul className={styles.specs} aria-label={`${phone.title} stack`}>
              {phone.techStack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <dl className={styles.stats}>
              {(phone.stats ?? []).map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.caption}>{VISION_LINE}</p>
            <p className={styles.cta}>{homeLandingCopy.hero.cta} →</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TypeLabPage() {
  return (
    <main className={styles.page}>
      <header className={styles.top}>
        <p className={styles.kicker}>DIGITAL design lab · W1-SYSTEMS</p>
        <h1 className={styles.title}>Type lab</h1>
        <p className={styles.lede}>
          {PAIRINGS.length} pairings set with real copy from <code>lib/data</code>. Same layout, same sizes, same
          colors — only the faces and their tuning change. Sources: Google Fonts (next/font), Fontshare CSS API,
          Fontesk (Departure Mono self-hosted, Instrument Serif and Bricolage also listed there), Fontjoy (generator
          control).
        </p>
        <nav aria-label="Pairings" className={styles.toc}>
          <ol>
            {PAIRINGS.map((p, i) => (
              <li key={p.id}>
                <a href={`#${p.id}`}>
                  {String(i).padStart(2, '0')} {p.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </header>
      {PAIRINGS.map((p, i) => (
        <Specimen key={p.id} p={p} index={i} />
      ))}
    </main>
  );
}
