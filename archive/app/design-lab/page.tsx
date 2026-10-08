/* eslint-disable @next/next/no-img-element -- static export; pre-sized webp copies of the lab renders */
import type { Metadata } from 'next';
import ConceptPanel from './_gallery/ConceptPanel';
import GalleryTabs from './_gallery/GalleryTabs';
import { CONCEPTS, gallery } from './_gallery/concepts';
import { FONTSHARE_HREFS, galleryFontVars } from './_gallery/fonts';
import { GALLERY_CHROME_CSS } from './_gallery/chrome';
import styles from './_gallery/gallery.module.css';

export const metadata: Metadata = {
  title: 'Concept gallery · DIGITAL design lab',
  description: 'Six homepage directions for DIGITAL @ Cal Poly Pomona, side by side. No ranking.',
  robots: { index: false, follow: false },
};

export default function DesignLabGallery() {
  return (
    <>
      <link rel="preconnect" href="https://api.fontshare.com" />
      <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
      {FONTSHARE_HREFS.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      {/* Static constant, no user input. */}
      <style dangerouslySetInnerHTML={{ __html: GALLERY_CHROME_CSS }} />
      <div data-lab-gallery="" className={`${styles.root} ${galleryFontVars}`}>
        <header className={styles.top}>
          <p className={styles.eyebrow}>DIGITAL design lab · exploration, not the live site</p>
          <h1 className={styles.title}>Six homepage directions</h1>
          <p className={styles.intro}>
            Each concept is a working homepage prototype built on the same real content (two builds, one program, Thursday
            build night). They are listed A to F in the order they were briefed. Nothing here is ranked, scored or
            recommended: the choice, or a mix, is yours.
          </p>
          <nav aria-label="Lab pages" className={styles.labNav}>
            <a href="/design-lab/components/">Component comparison (nav, hero, project, CTA, type)</a>
            <a href="/design-lab/type-lab/">Type lab</a>
            <a href="#motion">Motion reel</a>
            <a href="#mascot">Mascot study</a>
          </nav>
        </header>

        <div className={styles.main}>
          <GalleryTabs
            items={CONCEPTS.map((c) => ({ id: c.slug, letter: c.letter, name: c.name }))}
            panels={CONCEPTS.map((c) => (
              <ConceptPanel key={c.slug} c={c} />
            ))}
          />
        </div>

        <section className={styles.extras} aria-labelledby="extras-title">
          <h2 id="extras-title" className={styles.extrasTitle}>
            Studies that work with any direction
          </h2>
          <div className={styles.extraGrid}>
            <article id="motion" className={styles.extra} aria-labelledby="motion-title">
              <h3 id="motion-title" className={styles.blockTitle}>
                Motion brand reel
              </h3>
              <video
                className={styles.video}
                controls
                muted
                playsInline
                preload="none"
                poster={gallery('reel-poster.webp')}
                width={1280}
                height={720}
              >
                <source src={gallery('reel.mp4')} type="video/mp4" />
                Your browser can’t play this video. <a href={gallery('reel.mp4')}>Download the reel (MP4, 1.3 MB)</a>.
              </video>
              <p className={styles.extraText}>
                15.5 s procedural reel (Remotion): one dot arrives at Thursday build night, branches into the 7 DG-001
                subsystems, traces the ownership model, and ends on an unsigned BUILT BY line. No sound. It is
                <strong> brand-neutral on purpose</strong>: Inter Tight is a placeholder face and the accent can be
                re-tokened, so the reel can take any concept’s display face and palette.
              </p>
              <p className={styles.docPath}>
                Spec: <code>design-lab/concepts/motion-reel.md</code>
              </p>
            </article>

            <article id="mascot" className={styles.extra} aria-labelledby="mascot-title">
              <h3 id="mascot-title" className={styles.blockTitle}>
                Mascot: “The Module”
              </h3>
              <div className={styles.pair}>
                <figure>
                  <img
                    src={gallery('mascot-with.webp')}
                    width={1440}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    alt="Mascot demo page with The Module perched under the hero: a line-drawn circuit board with lens eyes."
                  />
                  <figcaption className={styles.caption}>With the mascot</figcaption>
                </figure>
                <figure>
                  <img
                    src={gallery('mascot-without.webp')}
                    width={1440}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    alt="The same mascot demo page with the mascot switched off."
                  />
                  <figcaption className={styles.caption}>Without</figcaption>
                </figure>
              </div>
              <p className={styles.extraText}>
                A code-drawn character made only from real artifacts (subsystem board, 7 pins, the reading-glasses lenses).
                The study’s own recommendation: <strong>no mascot on the homepage</strong>. If wanted, use it as an opt-in
                on project pages and the 404 only, or reuse its drawing as a static glyph.
              </p>
              <p className={styles.actions}>
                <a className={styles.textLink} href="/design-lab/mascot/">
                  Open the mascot study
                </a>
                <span className={styles.docPath}>
                  Spec: <code>design-lab/concepts/mascot.md</code>
                </span>
              </p>
            </article>

            <article className={styles.extra} aria-labelledby="type-title">
              <h3 id="type-title" className={styles.blockTitle}>
                Type lab
              </h3>
              <p className={styles.extraText}>
                Every candidate pairing for the six directions, rendered at real sizes. This is where each concept’s faces
                were chosen.
              </p>
              <p className={styles.actions}>
                <a className={styles.textLink} href="/design-lab/type-lab/">
                  Open the type lab
                </a>
              </p>
            </article>

            <article className={styles.extra} aria-labelledby="grid-title">
              <h3 id="grid-title" className={styles.blockTitle}>
                Component comparison
              </h3>
              <p className={styles.extraText}>
                Navigation, hero, project card, call to action and typography from all six concepts in one grid, so you
                can say “C’s hero, A’s typography, E’s project grid, F’s interaction”.
              </p>
              <p className={styles.actions}>
                <a className={styles.textLink} href="/design-lab/components/">
                  Open the component grid
                </a>
              </p>
            </article>
          </div>
          <p className={styles.footnote}>
            How to read all of this, and where every file lives: <code>design-lab/comparison/README.md</code>. Copy on
            every prototype is exploratory and still goes through brand review before production.
          </p>
        </section>
      </div>
    </>
  );
}
