import { JoinChapter, LocalNav } from '../../_chrome';
import { join as homeJoin } from '../../_content/home';
import { fontApple, fontSignal } from '../../_system/fonts';
import { DotGlyph } from '../../_system/dots/DotGlyph';
import { VERBS } from '../../_system/dots/engine';
import { Graticule } from '../../_system/ui/Graticule';
import { Highlights } from '../../_system/ui/Highlights';
import s from '../system.module.css';

const HL = VERBS.filter((v) => ['form', 'orbit', 'scramble', 'wire'].includes(v.verb)).map((v) => ({
  id: v.verb,
  title: v.label,
  caption: `${v.motion}. On a page it stands for one state: ${v.means.toLowerCase()}.`,
  media: <DotGlyph verb={v.verb} size={220} seed={`hl-${v.verb}`} />,
}));

/** Specimen of the shared chrome + UI extractions (W3a). Static content; ids are prefixed so they don't clash. */
export function ChromeDemo() {
  return (
    <div className={s.chromeDemo}>
      <div className={`world-apple ${fontApple} ${s.chromeFrame}`}>
        <LocalNav
          title="SHADES"
          titleHref="#chrome"
          links={[
            { label: 'Light path', href: '#chrome' },
            { label: 'Try it', href: '#chrome' },
            { label: 'Tracks', href: '#chrome' },
          ]}
          cta={{ label: 'Join build night', href: '#join-apple' }}
          utility={
            <button type="button" className={s.utilityChip} aria-pressed="false">
              More spacing
            </button>
          }
        />
        <Highlights id="hl-demo" title="Highlights strip" items={HL} />
        <JoinChapter world="apple" id="join-apple" lead={homeJoin.lead} />
      </div>

      <div className={`world-signal ${fontSignal} ${s.chromeFrame}`}>
        <JoinChapter world="signal" id="join-signal" />
        <div className={s.graticules}>
          {(['base', 'fine', 'scope'] as const).map((p) => (
            <figure key={p} className={s.graticuleFig}>
              <Graticule pitch={p} className={s.graticuleBox} aria-hidden="true" />
              <figcaption className={s.monoLabel}>pitch=&quot;{p}&quot;</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
