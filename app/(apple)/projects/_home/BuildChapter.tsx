/** Apple world: one build per chapter. The visual is the chapter's hero (~560px column): board, glasses, or the BRAIN orb.
 *  Visual and copy rise in with .r2-reveal (worlds.css); the copy trails slightly (home.module.css). */
import Link from 'next/link';
import { Chevron } from '../../_system';
import { BrainVisual } from '../../_home/BrainVisual';
import { Glasses } from '../../_shades-art/Glasses';
import { Mainboard } from '../../_sidekick/Mainboard';
import type { Channel } from '../../_content/home';
import s from './home.module.css';

const orb = `${s.buildOrb} r2-reveal`;

function Visual({ c }: { readonly c: Channel }) {
  if (c.id === 'brain') return <BrainVisual label={c.verbNote} className={orb} />;
  if (c.id === 'shades') return <div className={orb}><Glasses mode="solid" view="three-quarter" ground="dark" title={c.verbNote} /></div>;
  // Assembled, still, all copper (the 'board' pose). Mainboard is aria-hidden, so the wrapper carries the name.
  return <div className={orb} role="img" aria-label={c.verbNote}><Mainboard stage="board" still /></div>;
}

export function BuildChapter({ channel: c, flip }: { readonly channel: Channel; readonly flip: boolean }) {
  return (
    <article className={s.build} data-flip={flip ? 'true' : undefined} data-stage-host aria-labelledby={`build-${c.id}`}>
      <Visual c={c} />
      <div className={`${s.buildCopy} r2-reveal`}>
        <h3 id={`build-${c.id}`} className={s.buildName}>
          <Link className={s.buildLink} href={`/projects/${c.id}/`} prefetch={false}>
            {c.name}
            <Chevron dir="right" size={28} />
          </Link>
        </h3>
        <p className={s.buildLine}>{c.line}</p>
      </div>
    </article>
  );
}
