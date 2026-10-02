import { SignProvider } from './SignProvider';
import { Bench } from './Bench';
import {
  FooterSignature,
  HeroTitle,
  IndexTabs,
  JoinSteps,
  OtherPaths,
  Sheet,
  SignField,
} from './Sections';
import { PixelIcon } from './icons';
import { LINKS, MEETING, ORG } from './content';
import styles from './f.module.css';

const RULER = Array.from({ length: 16 }, (_, i) => i * 5);

export default function ConceptFPage() {
  return (
    <SignProvider>
      <div className={styles.root} data-lab-f="">
        <header className={styles.strip}>
          <a href="/design-lab/f/" className={styles.brand} aria-label="DIGITAL at Cal Poly Pomona, home">
            <span className={styles.brandMark} aria-hidden="true">
              DIGITAL
            </span>
            <span className={styles.brandSub} aria-hidden="true">
              @ Cal Poly Pomona
            </span>
          </a>
          <nav aria-label="Site" className={styles.siteNav}>
            <ul>
              {LINKS.site.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <p className={styles.stripMeta}>
            <span className={styles.mono}>Build night</span> {MEETING.when} · Bldg 17 Rm 1635
          </p>
        </header>

        <IndexTabs />

        <section id="sign" className={styles.hero} aria-label="Sign">
          <p className={styles.eyebrow}>{ORG.positioning}</p>
          <HeroTitle />
          <div className={styles.heroFoot}>
            <SignField />
            <div className={styles.heroAside}>
              <p className={styles.body}>
                Two builds, one program, and one record nobody has pitched yet. Each has parts with no name on them.
              </p>
              <a className={styles.cta} href="#bench">
                <span>Take a seat at the bench</span>
                <PixelIcon name="arrow-down" />
              </a>
            </div>
          </div>
        </section>

        <section id="bench" className={styles.bench} aria-labelledby="bench-title">
          <div className={styles.ruler} aria-hidden="true">
            {RULER.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
          <div className={styles.benchInner}>
            <Bench>
              <div className={styles.benchHead}>
                <h2 id="bench-title" className={styles.h2}>
                  The bench.
                </h2>
                <p className={styles.benchLede}>
                  Every build here is missing names. Products need more than programmers: pick the part you would
                  sign.
                </p>
              </div>
            </Bench>
          </div>
        </section>

        <section id="sheet" className={styles.sheet} aria-label="Sheet">
          <div className={styles.inner}>
            <Sheet />
          </div>
        </section>

        <section id="thursday" className={styles.thursday} aria-labelledby="thursday-title">
          <div className={styles.inner}>
            <h2 id="thursday-title" className={styles.h2}>
              Bring the tag Thursday.
            </h2>
            <p className={styles.thursdayLede}>No project experience required. Free to join.</p>
            <JoinSteps />
            <OtherPaths />
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.inner}>
            <FooterSignature />
            <p className={styles.closer}>Put your name on one.</p>
            <div className={styles.footRow}>
              <span>{ORG.fullName}</span>
              <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
              <a href={LINKS.discord} rel="noopener noreferrer" target="_blank">
                Discord<span className={styles.srOnly}> (opens in a new tab)</span>
              </a>
              {LINKS.legal.map((l) => (
                <a key={l.href} href={`${l.href}/`}>
                  {l.label}
                </a>
              ))}
              <span className={styles.mono}>Sheet 1 of 1 · concept F · lab prototype</span>
            </div>
          </div>
        </footer>
      </div>
    </SignProvider>
  );
}
