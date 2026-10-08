/* eslint-disable @next/next/no-img-element -- static export; pre-sized webp copies of the v2 renders */
import type { CSSProperties } from 'react';
import { gallery, SPECIMEN_LINE, type Concept } from './concepts';
import styles from './gallery.module.css';

function Specimen({ c }: { readonly c: Concept }) {
  const s = c.specimen;
  const box: CSSProperties = { background: s.bg, color: s.fg };
  const display: CSSProperties = {
    fontFamily: s.display,
    textTransform: s.upper ? 'uppercase' : undefined,
    ...s.displayStyle,
  };
  const [before, after] = s.italicWord ? SPECIMEN_LINE.split(s.italicWord) : [SPECIMEN_LINE, undefined];
  return (
    <figure className={styles.specimen}>
      <div className={styles.specimenBox} style={box}>
        <p className={styles.specimenDisplay} style={display}>
          {before}
          {s.italicWord && after !== undefined ? (
            <>
              <em>{s.italicWord}</em>
              {after}
            </>
          ) : null}
        </p>
        <p className={styles.specimenBody} style={{ fontFamily: s.body }}>
          {s.bodyLine}
        </p>
        <p className={styles.specimenMono} style={{ fontFamily: s.mono, color: s.muted }}>
          {s.monoLine}
        </p>
        {s.note ? (
          <p className={styles.specimenNote} style={{ fontFamily: s.note.font, color: s.muted }}>
            {s.note.text}
          </p>
        ) : null}
      </div>
      <figcaption className={styles.caption}>
        <strong>{s.faces}</strong>
        <br />
        Rendered live. {s.loading} Sample lines are the concept’s own exploratory copy.
      </figcaption>
    </figure>
  );
}

export default function ConceptPanel({ c }: { readonly c: Concept }) {
  const route = `/design-lab/${c.slug}/`;
  return (
    <div className={styles.panelInner}>
      <header className={styles.panelHead}>
        <p className={styles.eyebrow}>
          Concept {c.letter} · {c.direction}
        </p>
        <h2 id={`${c.slug}-title`} className={styles.panelTitle}>
          {c.letter} · {c.name}
        </h2>
        <p className={styles.thesis}>{c.thesis}</p>
        <p className={styles.actions}>
          <a className={styles.button} href={route}>
            Open prototype {c.letter} <span aria-hidden="true">→</span>
          </a>
          <a className={styles.textLink} href={`/design-lab/components/#col-${c.slug}`}>
            {c.letter} in the component grid
          </a>
          <span className={styles.docPath}>
            Spec: <code>{c.doc}</code>
          </span>
        </p>
      </header>

      <div className={styles.previews}>
        <figure className={styles.previewDesktop}>
          <img
            src={gallery(`${c.slug}-desktop.webp`)}
            width={1440}
            height={900}
            loading="lazy"
            decoding="async"
            alt={`Concept ${c.letter} at 1440 × 900: the first screen of the prototype.`}
          />
          <figcaption className={styles.caption}>Desktop · 1440 × 900, first screen (v2 render)</figcaption>
        </figure>
        <figure className={styles.previewMobile}>
          <img
            src={gallery(`${c.slug}-mobile.webp`)}
            srcSet={`${gallery(`${c.slug}-mobile.webp`)} 390w, ${gallery(`${c.slug}-mobile@2x.webp`)} 780w`}
            sizes="(min-width: 900px) 260px, 60vw"
            width={390}
            height={844}
            loading="lazy"
            decoding="async"
            alt={`Concept ${c.letter} at 390 × 844: the first screen on a phone.`}
          />
          <figcaption className={styles.caption}>Mobile · 390 × 844, first screen</figcaption>
        </figure>
      </div>

      <details className={styles.strip}>
        <summary>Whole desktop page, scaled down</summary>
        <img
          src={gallery(`${c.slug}-strip.webp`)}
          width={320}
          height={c.stripHeight}
          loading="lazy"
          decoding="async"
          alt={`Concept ${c.letter}: the full desktop page at reduced scale, top to bottom.`}
        />
      </details>

      <div className={styles.facts}>
        <section className={styles.block} aria-labelledby={`${c.slug}-type`}>
          <h3 id={`${c.slug}-type`} className={styles.blockTitle}>
            Typography
          </h3>
          <Specimen c={c} />
        </section>

        <section className={styles.block} aria-labelledby={`${c.slug}-palette`}>
          <h3 id={`${c.slug}-palette`} className={styles.blockTitle}>
            Palette
          </h3>
          <ul className={styles.swatches}>
            {c.palette.map((s) => (
              <li key={s.hex + s.role} className={styles.swatch}>
                <span className={styles.chip} style={{ background: s.hex }} aria-hidden="true" />
                <code className={styles.hex}>{s.hex.toLowerCase()}</code>
                <span className={styles.role}>{s.role}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.block} aria-labelledby={`${c.slug}-int`}>
          <h3 id={`${c.slug}-int`} className={styles.blockTitle}>
            Notable interactions
          </h3>
          <ul className={styles.list}>
            {c.interactions.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        <section className={styles.block} aria-labelledby={`${c.slug}-idea`}>
          <h3 id={`${c.slug}-idea`} className={styles.blockTitle}>
            Distinctive idea
          </h3>
          <p className={styles.idea}>{c.distinctive}</p>
        </section>

        <section className={`${styles.block} ${styles.blockWide}`} aria-labelledby={`${c.slug}-trade`}>
          <h3 id={`${c.slug}-trade`} className={styles.blockTitle}>
            Tradeoffs
          </h3>
          <div className={styles.tradeGrid}>
            <div>
              <h4 className={styles.tradeHead}>Works for it</h4>
              <ul className={styles.list}>
                {c.strengths.map((t) => (
                  <li key={t.text}>
                    {t.text} <span className={styles.source}>({t.source})</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className={styles.tradeHead}>Costs and open risks</h4>
              <ul className={styles.list}>
                {c.costs.map((t) => (
                  <li key={t.text}>
                    {t.text} <span className={styles.source}>({t.source})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
