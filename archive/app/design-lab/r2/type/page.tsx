import type { CSSProperties } from 'react';
import { COPY, READING, READING_FACES, STACKS, type Stack, type ReadingFace } from './stacks';
import styles from './type.module.css';
import { fontApple, fontReading, fontSignal } from '../_system/fonts';

function stackVars(s: Stack): CSSProperties {
  return {
    ['--fd' as string]: s.display.css,
    ['--ft' as string]: s.text.css,
    ['--fm' as string]: s.mono.css,
    ['--wd' as string]: String(s.display.weight),
    ['--wt' as string]: String(s.text.weight),
    ['--wm' as string]: String(s.mono.weight),
    ['--sd' as string]: s.display.stretch ?? '100%',
    ['--tr-hero' as string]: s.track.hero,
    ['--tr-h2' as string]: s.track.h2,
    ['--tr-sub' as string]: s.track.sub,
    ['--tr-lead' as string]: s.track.lead,
    ['--tr-body' as string]: s.track.body,
    ['--tr-dark' as string]: s.darkTextTrack,
  };
}

const LINE_FORMS = ['solid', 'dashed', 'half'] as const;

function SignalPanel({ s }: { readonly s: Stack }) {
  return (
    <div className={styles.signal} data-world="signal">
      <div className={styles.sigTop}>
        <p className={styles.readout}>
          <span className={styles.trigger} aria-hidden="true" />
          {COPY.readouts[0]}
        </p>
        <p className={styles.readoutDim}>{s.display.name} / {s.text.name} / {s.mono.name}</p>
      </div>
      <p className={styles.hero}>{COPY.thesis}</p>
      <div className={styles.sigGrid}>
        <div>
          <p className={styles.h2}>{COPY.headline}</p>
          <p className={styles.lead}>{COPY.lead}</p>
        </div>
        <div className={styles.sigSide}>
          <ul className={styles.channels}>
            {COPY.readouts.map((r, i) => (
              <li key={r} className={styles.channel}>
                <span className={styles.trace} data-form={LINE_FORMS[i]} aria-hidden="true" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <p className={styles.stat}>
            {COPY.stat.value}
            <span className={styles.statUnit}> {COPY.stat.unit}</span>
          </p>
          <p className={styles.body}>{COPY.stat.caption}</p>
        </div>
      </div>
      <p className={styles.names}>
        {COPY.names.map((n, i) => (
          <span key={n}>
            <span className={styles.chTag}>CH{i + 1}</span>
            {n}
          </span>
        ))}
      </p>
      <p className={styles.body}>{COPY.caption}</p>
      <p className={styles.foot}>{COPY.footnote}</p>
    </div>
  );
}

function ApplePanel() {
  return (
    <div className={styles.apple} data-world="apple">
      <p className={styles.eyebrow}>{COPY.names[0]}</p>
      <p className={styles.hero}>{COPY.thesis}</p>
      <p className={styles.sub}>
        {COPY.names.join('. ')}.
      </p>
      <p className={styles.appleLead}>
        Every build splits into subsystems. <strong>Each subsystem has one owner,</strong> one review path, one test
        gate and one repair plan before release.
      </p>
      <div className={styles.appleRow}>
        <div>
          <p className={styles.h2}>{COPY.headline}</p>
          <p className={styles.body}>{COPY.caption}</p>
        </div>
        <div>
          <p className={styles.h3}>
            {COPY.stat.value} {COPY.stat.unit}
          </p>
          <p className={styles.body}>{COPY.stat.caption}</p>
          <p className={styles.spec}>{COPY.readouts[0]}</p>
        </div>
      </div>
      <p className={styles.foot}>{COPY.footnote}</p>
    </div>
  );
}

function StackSection({ s }: { readonly s: Stack }) {
  return (
    <section id={s.id} className={styles.stack} style={stackVars(s)} aria-labelledby={`${s.id}-h`}>
      <header className={styles.meta}>
        <h2 id={`${s.id}-h`} className={styles.metaTitle}>{s.system}</h2>
        <dl className={styles.metaList}>
          <div><dt>Display</dt><dd>{s.display.name}</dd></div>
          <div><dt>Text</dt><dd>{s.text.name}</dd></div>
          <div><dt>Mono</dt><dd>{s.mono.name}</dd></div>
          <div><dt>Licence</dt><dd>{s.licence}</dd></div>
          <div><dt>Tracking</dt><dd>80 {s.track.hero} · 56 {s.track.h2} · 28 {s.track.sub} · 21 {s.track.lead} · 17 {s.track.body}</dd></div>
        </dl>
      </header>
      <SignalPanel s={s} />
      <ApplePanel />
    </section>
  );
}

function ReadingColumn({ f }: { readonly f: ReadingFace }) {
  const w = READING.word;
  return (
    <article className={styles.readCol} style={{ ['--fr' as string]: f.css }} data-reading={f.id}>
      <h3 className={styles.readName}>{f.name}</h3>
      <p className={styles.readLic}>{f.licence}</p>
      <div className={styles.rsvp} aria-label={`RSVP word: ${w}`}>
        <span className={styles.rsvpTick} aria-hidden="true" />
        <span className={styles.rsvpWord}>
          {w.slice(0, READING.orp)}
          <span className={styles.orp}>{w[READING.orp]}</span>
          {w.slice(READING.orp + 1)}
        </span>
      </div>
      <p className={styles.confuse}>{READING.confusables}</p>
      <p className={styles.readDefault}>{READING.paragraph}</p>
      <p className={styles.readSpaced}>{READING.paragraph}</p>
    </article>
  );
}

export default function R2TypeTrial() {
  return (
    <main className={styles.page}>
      <header className={styles.top}>
        <p className={styles.topKicker}>Design lab · round 2 · W0-TYPE</p>
        <h1 className={styles.topTitle}>Type trial: seven published stacks, two worlds</h1>
        <p className={styles.topNote}>
          Apple-measured scale: 80 / 56 / 48 / 28 / 21 / 17 / 12, display weight 600, hero 40/44 under 734 px. Each
          stack shows the Signal Capture panel (dark graticule) and the Apple panel (light), with tracking tuned per
          size.
        </p>
        <nav className={styles.toc} aria-label="Stacks">
          {STACKS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>{s.system}</a>
          ))}
          <a href="#reading">SHADES reading</a>
        </nav>
      </header>
      <section id="recommended" className={styles.rec} aria-labelledby="rec-h">
        <h2 id="rec-h" className={styles.metaTitle}>Recommended, via the drop-in module (_system/fonts)</h2>
        <div className={`${fontSignal} ${styles.recSignal}`} data-world="signal">
          <p className={styles.recMono}>.font-signal · {COPY.readouts[0]}</p>
          <p className={styles.recHero}>{COPY.thesis}</p>
          <p className={styles.recText}>{COPY.lead}</p>
        </div>
        <div className={`${fontApple} ${styles.recApple}`} data-world="apple">
          <p className={styles.recMono}>.font-apple · {COPY.readouts[0]}</p>
          <p className={styles.recHero}>{COPY.thesis}</p>
          <p className={styles.recText}>{COPY.lead}</p>
        </div>
        <div className={`${fontReading} ${styles.recApple}`} data-world="reading">
          <p className={styles.recMono}>.font-reading · CH2 SHADES · RSVP [confirm]</p>
          <p className={styles.recText}>{READING.paragraph}</p>
        </div>
      </section>
      {STACKS.map((s) => (
        <StackSection key={s.id} s={s} />
      ))}
      <section id="reading" className={styles.reading} aria-labelledby="reading-h">
        <h2 id="reading-h" className={styles.metaTitle}>SHADES reading face</h2>
        <p className={styles.topNote}>
          Top paragraph at the face&apos;s defaults (21/32). Bottom paragraph with British Dyslexia Association style-guide
          spacing: +0.05em letters, wider words, 1.5 line height. No medical or efficacy claim is made.
        </p>
        <div className={styles.readGrid}>
          {READING_FACES.map((f) => (
            <ReadingColumn key={f.id} f={f} />
          ))}
        </div>
      </section>
    </main>
  );
}
