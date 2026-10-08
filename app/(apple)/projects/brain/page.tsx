import type { Metadata } from 'next';
import { JoinChapter, LINKS, LocalNav, MEETINGS, WorldFooter, WorldNav } from '../../_chrome';
import { brain, story } from '../../_content/brain';
import { Sources } from '../../_brain';
import { BrainStages } from './BrainStages';
import s from './brain.module.css';

const { hero, join, nav } = story;

export const metadata: Metadata = {
  title: 'BRAIN · DIGITAL',
  description: `${hero.beats.join(' ')} ${hero.lead}`,
};

/** LOCKED 2026-10-07 (Head Designer): approved as built. Spec and locked-file list: docs/design/brain.DESIGN.md. */
export default function BrainApplePage() {
  return (
    <>
      <WorldNav world="apple" current="brain" join={false} />
      <LocalNav
        title={brain.name}
        titleHref="/projects/brain/"
        tone="dark"
        links={[{ label: nav.lessons, href: '#lessons' }]}
        cta={{ label: nav.cta, href: '#join' }}
      />
      {/* one continuous black surface: hero and lessons (one pin), then the join */}
      <main id="r2-main" className={s.page} data-tone="dark">
        <BrainStages />
        <JoinChapter
          world="apple"
          className={s.join}
          headline={join.headline}
          lead={join.thesis}
          {...MEETINGS.brain}
          primary={{ label: join.cta, href: LINKS.brainDiscord, external: true }}
          primaryStyle="pill"
          visual={null}
          backers={false}
        />
        <div className={s.sources}>
          <Sources world="apple" />
        </div>
      </main>
      <WorldFooter world="apple" />
    </>
  );
}
