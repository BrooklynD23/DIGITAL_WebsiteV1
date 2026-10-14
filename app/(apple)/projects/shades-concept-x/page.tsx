import type { Metadata } from 'next';
import { JoinChapter, LocalNav, MEETINGS, PAGES, WorldFooter, href } from '../../_chrome';
import chrome from '../../_chrome/chrome.module.css';
import { fontReadingText } from '../../_system/fonts';
import { localTitle } from '../../_content/home';
import { SHADES } from '../../_content/shades';
import { closing, disclaimer } from '../../_content/shades-reveal';
import {
  PARTS,
  anatomy,
  chromeCopy,
  compare,
  features,
  hero,
  join,
  meta,
  moves,
  questions,
  research,
  tagKey,
  thesis,
  type RoleId,
} from '../../_content/shades-concept-x';
import { ShadesRoot, SpacingToggle } from '../../_shades/ShadesRoot';
import { Seats } from '../../_shades/Seats';
import { SeatRing } from '../../_shades/SeatRing';
import { Glasses } from '../../_shades-art/Glasses';
import { Chevron } from '../../_system/ui/Chevron';
import v1 from '../shades/apple.module.css';
import s from '../shades-reveal/reveal.module.css';
import { Anatomy } from './Anatomy';
import { Art, DetailPanel, HeroArt } from './Art';
import { FIGURE, HERO } from './geometry';
import './iso.css';
import './concept-x.css';

/** SHADES Concept X (default since 2026-10-13: variation B, the round-4 Codex review fixes; variation A archived to
*  archive/app/(apple)/projects/shades-concept-x-a/). Every changed style is scoped under `.cx-b`. Not in the nav or the sitemap. */
export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  robots: { index: false, follow: false },
};

const OWNERS = Object.fromEntries(SHADES.join.roles.map((r) => [r.id, r.name])) as Record<RoleId, string>;
/** In-page index, in page order. `id` is the section anchor. */
const SECTIONS = [
  { id: 'overview', label: thesis.nav.text },
  { id: 'anatomy', label: anatomy.nav.text },
  { id: 'changes', label: compare.nav.text },
  { id: 'research', label: research.nav.text },
  { id: 'questions', label: questions.nav.text },
  { id: 'join', label: join.nav.text },
] as const;

const host = (url: string) => new URL(url).hostname.replace(/^www\./, '');

export default function ShadesConceptXBPage() {
  const { spacing } = SHADES;
  return (
    <ShadesRoot className={`${v1.root} ${fontReadingText} ${s.page} cx-page cx-b`}>
      <a className={chrome.skip} href="#cx-main">Skip to content</a>
      <LocalNav
        title={localTitle}
        titleHref="/"
        current={href('apple', 'shades')}
        cta={{ label: join.headline.text, href: '#join' }}
        links={PAGES.filter((p) => p.id !== 'home').map((p) => ({ label: p.label, href: href('apple', p.id) }))}
        tone="dark"
        utility={<SpacingToggle className={v1.localSpacing} label={spacing.label} stateText={{ on: spacing.more, off: spacing.standard }} />}
      />

      <main id="cx-main">
        {/* Hero: the planned render beside Concept X, then the page index. */}
        <section className="cx-hero-sec" data-tone="dark" aria-labelledby="cx-h1">
          <header className={s.heroHead}>
            <h1 id="cx-h1" className={s.heroName}>{hero.title.text}</h1>
            <p className={s.heroLine}>{hero.caption.text}</p>
            <p className="cx-note">{disclaimer.text}</p> {/* brand-reviewed 2026-10-12 */}
            <p className="cx-hero-lead">{hero.lead.text}</p>
          </header>
          <div className="cx-pair">
            <figure className="cx-pair-item">
              <div className="cx-pair-art">
                <Glasses mode="solid" view="three-quarter" ground="dark" tether title={hero.original.text} />
              </div>
              <figcaption>
                <span className="cx-tag" data-tag="PLANNED">PLANNED</span> {hero.original.text}
              </figcaption>
            </figure>
            <figure className="cx-pair-item">
              <div className="cx-pair-art">
                <HeroArt scene={HERO} title={`${hero.title.text}. ${hero.concept.text}`} />
              </div>
              <figcaption>
                <span className="cx-tag" data-tag="CONCEPT">CONCEPT</span> {hero.concept.text}
              </figcaption>
            </figure>
          </div>
          <nav className="cx-index" aria-label={chromeCopy.indexLabel}>
            <a className="cx-back" href={chromeCopy.backHref}>
              <Chevron dir="left" size={14} />
              {chromeCopy.back.text}
            </a>
            <ol>
              {SECTIONS.map((x) => (
                <li key={x.id}>
                  <a href={`#${x.id}`}>{x.label}</a>
                </li>
              ))}
            </ol>
          </nav>
        </section>

        {/* Overview: thesis and three signature features. */}
        <section id="overview" className="cx-sec" data-tone="dark" aria-labelledby="cx-thesis">
          <header className={s.head}>
            <h2 id="cx-thesis" className={s.h2}>{thesis.line.text}</h2>
            <p className={s.lead}>{thesis.body.text}</p>
          </header>
          <ol className="cx-features">
            {features.map((f) => (
              <li key={f.id}>
                <span className="cx-tag" data-tag={f.tag}>{f.tag}</span>
                <h3>{f.title.text}</h3>
                <p>{f.line.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Anatomy: the figure, the tag key and every part in both layouts. */}
        <section id="anatomy" className="cx-sec" data-tone="dark" aria-labelledby="cx-anatomy">
          <header className={s.head}>
            <h2 id="cx-anatomy" className={s.h2}>{anatomy.title.text}</h2>
            <p className={s.lead}>{anatomy.lead.text}</p>
          </header>
          <div className="cx-wrap">
            <noscript>
              <p className="cx-note">{anatomy.noscript.text}</p>
            </noscript>
            <Anatomy
              width={FIGURE.width}
              height={FIGURE.height}
              light={FIGURE.light}
              owners={OWNERS}
              art={<Art key="art" scene={FIGURE} />}
              detail={<DetailPanel scene={FIGURE} />}
              describedBy="cx-b-caption"
            />
            <p id="cx-b-caption" className="cx-note">{anatomy.caption.text}</p>
            <ul className="cx-key">
              {(Object.keys(tagKey) as (keyof typeof tagKey)[]).map((k) => (
                <li key={k}>
                  <span className="cx-tag" data-tag={k}>{k}</span> {tagKey[k].text}
                </li>
              ))}
            </ul>
            <details className="cx-details">
              <summary>
                <Chevron dir="right" size={14} />
                {anatomy.partsSummary.text}
              </summary>
              <table className="cx-table cx-parts">
                <thead>
                  <tr>
                    <th scope="col">Part</th>
                    <th scope="col">Team</th>
                    <th scope="col">Planned</th>
                    <th scope="col">Concept X</th>
                  </tr>
                </thead>
                <tbody>
                  {PARTS.map((p) => (
                    <tr key={p.id}>
                      <th scope="row">{p.name}</th>
                      <td data-label="Team">{OWNERS[p.owner]}</td>
                      {(['planned', 'potential'] as const).map((l) => {
                        const side = p[l];
                        return (
                          <td key={l} data-label={l === 'planned' ? 'Planned' : 'Concept X'}>
                            {side ? (
                              <>
                                <span className="cx-tag" data-tag={side.tag}>{side.tag}</span> {side.note.text}
                                {side.value ? <span className="cx-val">{side.value.text}</span> : null}
                                <span className="cx-srcline">{anatomy.sourcePrefix} {side.note.src}</span>
                              </>
                            ) : (
                              <span className="cx-absent">{anatomy.absent.text}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </div>
        </section>

        {/* Planned vs Concept X. */}
        <section id="changes" className="cx-sec" data-tone="dark" aria-labelledby="cx-compare">
          <header className={s.head}>
            <h2 id="cx-compare" className={s.h2}>{compare.title.text}</h2>
          </header>
          <div className="cx-wrap">
            <table className="cx-table cx-compare">
              <thead>
                <tr>
                  {compare.columns.map((c) => (
                    <th key={c} scope="col">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compare.rows.map((r) => (
                  <tr key={r.part}>
                    <th scope="row">{r.part}</th>
                    <td data-label="Planned">{r.planned.text}</td>
                    <td data-label="Concept X">{r.potential.text}</td>
                    <td data-label="Why">{r.why.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="cx-note">{compare.stays.text}</p>
          </div>
        </section>

        {/* Research: eleven products, then the moves they taught. */}
        <section id="research" className="cx-sec" data-tone="dark" aria-labelledby="cx-research">
          <header className={s.head}>
            <h2 id="cx-research" className={s.h2}>{research.title.text}</h2>
            <p className={s.lead}>{research.lead.text}</p>
          </header>
          <div className="cx-wrap">
            <table className="cx-table cx-research">
              <thead>
                <tr>
                  {research.columns.map((c) => (
                    <th key={c} scope="col">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {research.rows.map((r) => (
                  <tr key={r.product}>
                    <th scope="row">
                      {r.product}
                      <span className="cx-kind">{r.kind}</span>
                      <span className="cx-src">
                        {r.urls.map((u, i) => (
                          <a key={u} href={u} rel="noopener noreferrer" target="_blank">
                            [{i + 1}] {host(u)}
                          </a>
                        ))}
                      </span>
                    </th>
                    <td data-label="Weight">{r.weight}</td>
                    <td data-label="Optics">{r.optics}</td>
                    <td data-label="Battery">{r.battery}</td>
                    <td data-label="Compute">{r.compute}</td>
                    <td data-label="Controls">{r.controls}</td>
                    <td data-label="Repair">{r.repair}</td>
                    <td data-label="CMF">{r.cmf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="cx-note">{research.note.text}</p>
            <h3 className="cx-h3">{research.movesTitle.text}</h3>
            <ol className="cx-moves">
              {moves.map((m) => (
                <li key={m.n}>
                  <span className="cx-move-n" aria-hidden="true">{m.n}</span>
                  <span className="cx-move-text">{m.move.text}</span>
                  <a className="cx-move-src" href={m.url} rel="noopener noreferrer" target="_blank">
                    {research.movesFrom} {m.taught} · {host(m.url)}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Open questions. */}
        <section id="questions" className="cx-sec" data-tone="dark" aria-labelledby="cx-questions">
          <header className={s.head}>
            <h2 id="cx-questions" className={s.h2}>{questions.title.text}</h2>
          </header>
          <ol className="cx-wrap cx-questions">
            {questions.items.map((q) => (
              <li key={q.text}>{q.text}</li>
            ))}
          </ol>
          <p className="cx-wrap cx-back-row">
            <a className="cx-back" href={chromeCopy.backHref}>
              <Chevron dir="left" size={14} />
              {chromeCopy.back.text}
            </a>
          </p>
        </section>

        {/* Join. */}
        <JoinChapter
          world="apple"
          visual={<SeatRing world="apple" />}
          headline={join.headline.text}
          lead={join.lead.text}
          {...MEETINGS.subteam}
          primary={{ label: closing.join.discord.label, href: closing.join.discord.href, external: true }}
        >
          <Seats world="apple" />
          <p className={s.note}>{SHADES.join.affiliation}</p>
        </JoinChapter>
      </main>
      <WorldFooter world="apple" />
    </ShadesRoot>
  );
}
