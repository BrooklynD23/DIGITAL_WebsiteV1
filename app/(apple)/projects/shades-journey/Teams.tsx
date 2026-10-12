'use client';

/**
 * MOCKUP. Two takes on introducing the sub-teams, both on the page for review.
 * V1 "Exploded ownership": the exploded view returns; hover, focus or press a team and its parts light, the rest
 * ghost. Each team button also names its parts in text, so no-JS and screen readers get the same answer.
 * V2 "Signed sheets": one drawing sheet per team, the title block signed DRAWN BY <team>. The stack fans out when
 * it scrolls into view or on the toggle; with no JS it is already fanned.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { claims, join, partLabels, teams as TM } from '../../_content/shades-journey';
import k from '../shades-drawings/drawings.module.css';
import { ArtExplode } from './Art';
import { useMounted, type Paper } from './hooks';
import j from './journey.module.css';

type RoleId = (typeof TM.roles)[number]['id'];

function JoinLinks() {
  return (
    <p className={j.joinRow}>
      <a className={j.joinBtn} href={join.action.href}>{`${join.headline.text}: ${join.action.label}`}</a>
      <a className={j.joinLink} href={join.discord.href} rel="noopener noreferrer" target="_blank">{join.discord.label}</a>
    </p>
  );
}

function V1() {
  const [hot, setHot] = useState<RoleId | null>(null);
  const [pick, setPick] = useState<RoleId | null>(null);
  const cur = hot ?? pick;
  const lit = cur ? claims[cur].parts : null;
  return (
    <div className={j.v1}>
      <div className={j.v1Art}>
        <ArtExplode lit={lit} />
      </div>
      <div className={j.v1Side}>
        <p className={k.line}>{TM.v1Hint.text}</p>
        <ul className={j.teamList} onMouseLeave={() => setHot(null)}>
          {TM.roles.map((r) => {
            const parts = claims[r.id].parts;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  className={j.teamBtn}
                  aria-pressed={pick === r.id}
                  onMouseEnter={() => setHot(r.id)}
                  onFocus={() => setHot(r.id)}
                  onBlur={() => setHot(null)}
                  onClick={() => setPick((p) => (p === r.id ? null : r.id))}
                >
                  <span className={j.teamName}>{r.name}</span>
                  <span className={j.teamLine}>{r.line}</span>
                  <span className={j.teamParts}>{parts.length ? parts.map((p) => partLabels[p].text).join(' · ') : TM.noPart.text}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <JoinLinks />
      </div>
    </div>
  );
}

function V2() {
  const mounted = useMounted();
  const ref = useRef<HTMLDivElement>(null);
  const [fan, setFan] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setFan(false);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setFan(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className={j.v2}>
      {mounted ? (
        <button type="button" className={j.fanBtn} aria-pressed={fan} onClick={() => setFan((f) => !f)}>
          {fan ? TM.stack.text : TM.fan.text}
        </button>
      ) : null}
      <div ref={ref} className={j.fanWrap} data-fan={fan ? 'open' : 'stacked'}>
        {TM.roles.map((r, i) => (
          <article key={r.id} className={j.card} style={{ '--i': i, '--n': TM.roles.length } as CSSProperties} aria-labelledby={`sg-${r.id}`}>
            <p className={j.cardLine}>{r.line}</p>
            <dl className={j.cardTb}>
              <div>
                <dt>{TM.drawnBy.text}</dt>
                <dd id={`sg-${r.id}`}>{r.name}</dd>
              </div>
              <div>
                <dt>SHEET</dt>
                <dd>{`${i + 1} / ${TM.roles.length}`}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <JoinLinks />
    </div>
  );
}

export function Teams({ paper }: { readonly paper: Paper }) {
  return (
    <section id="teams" className={j.teams} data-paper={paper} aria-labelledby="jn-teams">
      <header className={j.teamsHead}>
        <h2 id="jn-teams" className={j.h2}>{TM.heading.text}</h2>
        <p className={k.line}>{TM.lead.text}</p>
      </header>
      <p className={j.variation}>{`${TM.variation(1).text} · ${TM.v1Name.text}`}</p>
      <V1 />
      <p className={j.variation}>{`${TM.variation(2).text} · ${TM.v2Name.text}`}</p>
      <V2 />
    </section>
  );
}
