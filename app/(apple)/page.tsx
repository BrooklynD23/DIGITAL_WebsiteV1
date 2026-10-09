import { JoinChapter, LocalNav, PAGES, WorldFooter, href } from './_chrome';
import chrome from './_chrome/chrome.module.css';
import { channels, channelsHeadline, join, localTitle } from './_content/home';
import { BuildChapter } from './projects/_home/BuildChapter';
import { HeroStages } from './projects/_hero/HeroStages';
import s from './projects/_home/home.module.css';

/** Home: the phone hero, the three builds, the join chapter. Title and description come from the root layout. */
export default function HomePage() {
  return (
    <div className={s.page}>
      {/* One sticky bar: the three builds live in it, so they are reachable from anywhere on the page. */}
      <a className={chrome.skip} href="#r2-main">Skip to content</a>
      <LocalNav
        title={localTitle}
        titleHref="/"
        tone="dark"
        links={PAGES.filter((p) => p.id !== 'home').map((p) => ({ label: p.label, href: href('apple', p.id) }))}
      />
      <main id="r2-main">
        <HeroStages />

        <section id="builds" data-tone="dark" className={s.builds} aria-labelledby="builds-title">
          <div className={s.inner}>
            <h2 id="builds-title" className={`${s.h2} r2-reveal`}>{channelsHeadline}</h2>
          </div>
          {channels.map((c, i) => (
            <BuildChapter key={c.id} channel={c} flip={i % 2 === 1} />
          ))}
        </section>

        <JoinChapter world="apple" secondary={{ label: join.secondary, href: '#builds' }} />
      </main>
      <WorldFooter world="apple" />
    </div>
  );
}
