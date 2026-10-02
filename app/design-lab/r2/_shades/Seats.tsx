/**
 * SHADES open seats, passed into <JoinChapter> as children (both worlds). Each row is a real link: it opens the
 * club Discord to ask about that seat. Line form carries state: dashed = open seat, solid on hover / focus.
 * No red here: the JoinChapter seat orb carries the page's one trigger in this viewport.
 */
import { GlyphSeat } from '../_system';
import { SHADES } from '../_content/shades';
import s from './seats.module.css';

export function Seats({ world }: { readonly world: 'signal' | 'apple' }) {
  const { roles, discord } = SHADES.join;
  return (
    <ul className={s.seats} data-world={world} aria-label="Open seats on SHADES">
      {roles.map((r) => (
        <li key={r.id}>
          <a className={s.seat} href={discord.href} target="_blank" rel="noopener noreferrer" data-glyph-host="">
            <GlyphSeat size={24} className={s.glyph} />
            <span className={s.name}>{r.name}</span>
            <span className={s.line}>{r.line}</span>
            <span className="sr-only">
              {SHADES.labels.seatSuffix}, {discord.label} (opens in a new tab)
            </span>
            <svg className={s.go} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
              <path d="M8 16L16 8M9.5 8H16v6.5" />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
