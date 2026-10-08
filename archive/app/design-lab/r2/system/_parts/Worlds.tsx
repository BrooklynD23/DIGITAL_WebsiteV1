import { fontApple, fontSignal } from '../../_system/fonts';
import { GlyphNight, GlyphSeat } from '../../_system/icons/glyphs';
import { StateMark } from '../../_system/icons/StateMark';
import s from '../system.module.css';

const SCALE = [
  { token: 'hero', sample: 'Worth your name.' },
  { token: 'h1', sample: 'Seven subsystems.' },
  { token: 'h2', sample: 'One owner each.' },
  { token: 'h3', sample: 'One review path per handoff.' },
  { token: 'lead', sample: 'Each build splits into subsystems, and each one has a named owner.' },
  { token: 'body', sample: 'Build night is every Thursday, 6:00 PM, Building 17, Room 1635.' },
] as const;

const SIGNAL_SWATCHES = ['ground', 'ground-raised', 'ink', 'ink-2', 'ink-3', 'hairline', 'trigger'] as const;
const APPLE_SWATCHES = ['ground', 'ground-raised', 'ink', 'ink-2', 'hairline', 'cta-bg', 'trigger'] as const;

function Swatches({ names }: { readonly names: readonly string[] }) {
  return (
    <ul className={s.swatches}>
      {names.map((n) => (
        <li key={n}>
          <span className={s.chip} style={{ background: `var(--r2-${n})` }} />
          <code className={s.monoLabel}>--r2-{n}</code>
        </li>
      ))}
    </ul>
  );
}

function Scale() {
  return (
    <ol className={s.scale}>
      {SCALE.map(({ token, sample }) => (
        <li key={token}>
          <span className={s.monoLabel}>{token}</span>
          <span
            className={s.scaleSample}
            style={{
              fontFamily: token === 'lead' || token === 'body' ? 'var(--font-text)' : 'var(--font-display)',
              fontSize: `var(--r2-fs-${token})`,
              lineHeight: `var(--r2-lh-${token})`,
              letterSpacing: `var(--r2-ls-${token}, normal)`,
              fontWeight: token === 'body' ? 'var(--r2-fw-text)' : 'var(--r2-fw-display)',
              fontStretch: token === 'body' || token === 'lead' ? undefined : 'var(--r2-fstretch-display)',
            }}
          >
            {sample}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Worlds() {
  return (
    <div className={s.worlds}>
      <article className={`world-signal ${fontSignal} r2-graticule ${s.worldPanel}`} aria-labelledby="w-signal">
        <header className={s.worldHead}>
          <h3 id="w-signal" className={s.worldTitle}>
            Signal Capture
          </h3>
          <code className={s.monoLabel}>.world-signal + fontSignal</code>
        </header>
        <ul className={s.channels}>
          {[
            ['CH1', 'SIDEKICK'],
            ['CH2', 'SHADES'],
            ['CH3', 'BRAIN'],
          ].map(([ch, name], i) => (
            <li key={ch}>
              <span className={s.chLabel}>{ch}</span>
              <span className={s.chName}>{name}</span>
              <StateMark state="pending" size={24} />
              <span className={s.small}>planned [confirm]</span>
              {i === 2 ? <span className={s.trigger} aria-label="Trigger marker: open seat" /> : null}
            </li>
          ))}
        </ul>
        <p className={s.small}>
          Red is the one trigger marker (here, now, open seat). Never a dot colour, never body text.
        </p>
        <Swatches names={SIGNAL_SWATCHES} />
        <Scale />
      </article>

      <article className={`world-apple ${fontApple} ${s.worldPanel} ${s.applePanel}`} aria-labelledby="w-apple">
        <nav className={s.localNav} aria-label="Sample local nav">
          <span className={s.localNavName}>DIGITAL</span>
          <span className={s.localNavLinks}>
            <a href="#w-apple">Builds</a>
            <a href="#w-apple">Join</a>
          </span>
          <a className={s.cta} href="#w-apple">
            Join build night
          </a>
        </nav>
        <section data-tone="dark" className={s.appleDark}>
          <header className={s.worldHead}>
            <h3 id="w-apple" className={s.worldTitle}>
              Apple page, played straight
            </h3>
            <code className={s.monoLabel}>.world-apple [data-tone=dark]</code>
          </header>
          <p className={s.appleHero}>Make something worth putting your name on.</p>
          <div className={s.row}>
            <GlyphSeat state="idle" size={64} />
            <GlyphNight state="idle" size={64} />
          </div>
          <Swatches names={APPLE_SWATCHES} />
        </section>
        <section className={s.appleLight}>
          <code className={s.monoLabel}>.world-apple (light chapter)</code>
          <Swatches names={APPLE_SWATCHES} />
          <Scale />
        </section>
      </article>
    </div>
  );
}
