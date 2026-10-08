/* eslint-disable @next/next/no-img-element -- static export; pre-sized webp crops of the v2 renders */
import type { Metadata } from 'next';
import { CONCEPTS, gallery } from '../_gallery/concepts';
import { GALLERY_CHROME_CSS } from '../_gallery/chrome';
import { ROWS } from '../_gallery/grid';
import styles from './components.module.css';

export const metadata: Metadata = {
  title: 'Component comparison · DIGITAL design lab',
  description: 'Navigation, hero, project card, CTA and typography from concepts A–F, side by side.',
  robots: { index: false, follow: false },
};

export default function ComponentComparison() {
  return (
    <>
      {/* Static constant, no user input. */}
      <style dangerouslySetInnerHTML={{ __html: GALLERY_CHROME_CSS }} />
      <div data-lab-gallery="" className={styles.root}>
        <header className={styles.top}>
          <p className={styles.eyebrow}>DIGITAL design lab · component comparison</p>
          <h1 className={styles.title}>Same component, six directions</h1>
          <p className={styles.intro}>
            Each row is one component; each column is one concept, A to F. Pick parts across columns and name them, for
            example: <q>Use C’s hero, A’s typography, E’s project grid and F’s interaction.</q> Every image links to that
            block on its prototype. Crops come from the v2 desktop renders at 1440 px, cut at positions measured in the
            live page. Nothing is ranked.
          </p>
          <nav aria-label="Comparison pages" className={styles.labNav}>
            <a href="/design-lab/">Back to the concept gallery</a>
            {ROWS.map((r) => (
              <a key={r.key} href={`#row-${r.key}`}>
                {r.label}
              </a>
            ))}
          </nav>
        </header>

        <div className={styles.wrap}>
          {/* CSS-only toggle (:has), works without JS. */}
          <p className={styles.toggle}>
            <input type="checkbox" id="g-large" className={styles.check} />
            <label htmlFor="g-large">Larger previews (the grid scrolls sideways)</label>
          </p>
          <div className={styles.scroller} role="region" aria-labelledby="grid-caption" tabIndex={0}>
            <table className={styles.table}>
              <caption id="grid-caption" className={styles.caption}>
                Components (rows) by concept (columns). When the grid is wider than the screen it scrolls sideways inside this box.
              </caption>
              <thead>
                <tr>
                  <td className={styles.corner} />
                  {CONCEPTS.map((c) => (
                    <th key={c.slug} id={`col-${c.slug}`} scope="col" className={styles.colHead}>
                      <span className={styles.letter}>{c.letter}</span>
                      <span className={styles.colName}>{c.name}</span>
                      <a className={styles.colLink} href={`/design-lab/#${c.slug}`}>
                        Gallery entry
                      </a>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.key} id={`row-${r.key}`} className={styles.row}>
                    <th scope="row" className={styles.rowHead}>
                      <span className={styles.rowLabel}>{r.label}</span>
                      <span className={styles.rowWhat}>{r.what}</span>
                    </th>
                    {CONCEPTS.map((c) => {
                      const cell = r.cells[c.slug];
                      return (
                        <td key={c.slug} className={styles.cell} data-label={`${c.letter} · ${c.name}`}>
                          {/* Pointer shortcut; the text link below is the accessible one (one tab stop per cell). */}
                          <a className={styles.shot} href={cell.href} tabIndex={-1} aria-hidden="true">
                            <img
                              src={gallery(`crops/${r.key}-${c.slug}.webp`)}
                              width={cell.w}
                              height={cell.h}
                              loading="lazy"
                              decoding="async"
                              alt=""
                            />
                          </a>
                          <p className={styles.note}>{cell.note}</p>
                          <p className={styles.cellLinks}>
                            <a href={cell.href} aria-label={`Open in ${c.letter}: ${r.label.toLowerCase()}`}>
                              Open in {c.letter} <span aria-hidden="true">→</span>
                            </a>
                            <a
                              href={gallery(`crops/${r.key}-${c.slug}.webp`)}
                              aria-label={`Full-size crop: ${r.label.toLowerCase()}, concept ${c.letter}`}
                            >
                              Full-size crop
                            </a>
                          </p>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className={styles.foot}>
          <p>
            Interaction is not a static crop: compare it on the prototypes themselves (each gallery entry lists the notable
            interactions). Crop sources: <code>design-lab/comparison/crops/</code>; measured boxes:{' '}
            <code>design-lab/comparison/crops/regions.json</code>; regenerate with{' '}
            <code>node design-lab/scripts/gallery-crops.mjs</code>.
          </p>
        </footer>
      </div>
    </>
  );
}
