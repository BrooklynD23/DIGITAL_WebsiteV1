import type { ReactNode } from 'react';
import { join as homeJoin } from '../_content/home';
import { PlayOnceStage } from '../_system/ui/PlayOnce';
import { Chevron } from '../_system/ui/Chevron';
import { BACKER_PATHS, CLUB } from './club';
import type { World } from './routes';
import s from './join.module.css';

/**
 * <JoinChapter world …> — the one join ending for every r2 page, both worlds (replaces 8 implementations).
 * Facts come from ./club (siteConfig): Thursdays 6:00 PM, Building 17 Room 1635, Discord, no experience needed.
 * One primary action + a "Back a build" path for sponsors, recruiters and faculty (/contact?type=…, production).
 *   Signal: WHEN / WHERE / BRING readout, line-form (outlined) action, never filled. The default seat carries
 *           the page's red trigger (open seat) unless `trigger={false}`.
 *   Apple:  centred light chapter. The page's ONE filled CTA is the LocalNav pill ("Join build night" → #join),
 *           which stays in view here, so the primary action defaults to a chevron text link.
 *           Use `primaryStyle="pill"` only on an Apple page without a LocalNav.
 * id defaults to "join" (the LocalNav CTA target).
 */
export interface JoinAction {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
}

export interface JoinChapterProps {
  readonly world: World;
  readonly id?: string;
  readonly headline?: string;
  /** One optional sentence under the headline (page-specific: which part could be theirs). */
  readonly lead?: string;
  readonly primary?: JoinAction;
  readonly secondary?: JoinAction;
  /** Apple only: chevron text link (default; the LocalNav pill is the page's one filled CTA) or a filled pill. */
  readonly primaryStyle?: 'pill' | 'link';
  /** Visual slot. Default: an open-seat orb that plays once on entry. `null` = none. */
  readonly visual?: ReactNode | null;
  /** Red anchor on the default seat (the page's one trigger in this viewport). Default true. */
  readonly trigger?: boolean;
  /** Show the sponsor / recruiter / faculty path. Default true. */
  readonly backers?: boolean;
  /** Extra page content under the facts (e.g. SIDEKICK's open-seat rows). */
  readonly children?: ReactNode;
  readonly className?: string;
}

const DISCORD: JoinAction = { label: homeJoin.cta, href: CLUB.discord, external: true };

function ActionLink({ a, className, chevron }: { readonly a: JoinAction; readonly className: string; readonly chevron?: boolean }) {
  const ext = a.external ? { rel: 'noopener noreferrer', target: '_blank' } : {};
  return (
    <a className={className} href={a.href} {...ext}>
      {a.label}
      {chevron ? <Chevron dir="right" size={14} /> : null}
    </a>
  );
}

export function JoinChapter({
  world,
  id = 'join',
  headline = homeJoin.headline,
  lead,
  primary = DISCORD,
  secondary,
  primaryStyle = 'link',
  visual,
  trigger = true,
  backers = true,
  children,
  className,
}: JoinChapterProps) {
  const titleId = `${id}-title`;
  const seat =
    visual === undefined ? (
      <PlayOnceStage
        verb="seat"
        size={world === 'signal' ? 320 : 200}
        seed={`${world}-join-seat`}
        anchor={trigger}
        threshold={0.5}
        label="An open seat in a ring of seats"
        className={s.seat}
      />
    ) : (
      visual
    );
  const backerRow = backers ? (
    <div className={s.backers}>
      <p className={s.backersLabel} id={`${id}-backers`}>
        Back a build
      </p>
      <ul className={s.backerLinks} aria-labelledby={`${id}-backers`}>
        {BACKER_PATHS.map((b) => (
          <li key={b.id}>
            <ActionLink a={{ label: b.label, href: b.href }} className={s.backerLink} chevron={world === 'apple'} />
          </li>
        ))}
      </ul>
    </div>
  ) : null;

  return (
    <section
      id={id}
      className={className ? `${s.join} ${className}` : s.join}
      data-world-join={world}
      aria-labelledby={titleId}
    >
      <div className={s.inner}>
        {seat ? <div className={s.visual}>{seat}</div> : null}
        <div className={s.copy}>
          <h2 id={titleId} className={s.title}>
            {headline}
          </h2>
          {lead ? <p className={s.lead}>{lead}</p> : null}
          {world === 'signal' ? (
            <dl className={s.facts}>
              <div>
                <dt>When</dt>
                <dd>{CLUB.when}</dd>
              </div>
              <div>
                <dt>Where</dt>
                <dd>{CLUB.where}</dd>
              </div>
              <div>
                <dt>Bring</dt>
                <dd>{CLUB.noExperience}</dd>
              </div>
            </dl>
          ) : (
            <>
              <p className={s.when}>
                {CLUB.when} · {CLUB.where}
              </p>
              <p className={s.bring}>{CLUB.noExperience}</p>
            </>
          )}
          {children}
          <div className={s.actions}>
            {world === 'apple' && primaryStyle === 'pill' ? (
              <ActionLink a={primary} className={s.pill} />
            ) : (
              <ActionLink a={primary} className={world === 'signal' ? s.lineBtn : s.textLink} chevron={world === 'apple'} />
            )}
            {secondary ? <ActionLink a={secondary} className={s.textLink} chevron={world === 'apple'} /> : null}
          </div>
          {backerRow}
        </div>
      </div>
    </section>
  );
}
