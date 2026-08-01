/**
 * Server-safe static shell for /projects/smart-reading.
 *
 * The immersive experience is R3F/three and must load client-only (`ssr: false`), which
 * would otherwise leave this route's exported HTML empty — invisible to crawlers, link
 * previews, and no-JS visitors. This component is the `loading` fallback for that dynamic
 * import, so it renders into the static export AND doubles as the loading state.
 *
 * Deliberately free of motion, three.js, and client hooks. All copy comes from
 * GLASSES_CONTENT per CLAUDE.md.
 */

import Link from 'next/link';
import { GLASSES_CONTENT, GLASSES_PALETTE } from '@/lib/data/experiments/glasses';

export default function SmartReadingShell() {
  const { hero, reveal, info, next, cta } = GLASSES_CONTENT;

  return (
    <div
      className="min-h-screen px-6 py-20"
      style={{ backgroundColor: GLASSES_PALETTE.paper, color: GLASSES_PALETTE.charcoal }}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-16">
        <header className="flex flex-col gap-4">
          <p
            className="font-mono text-[11px] uppercase tracking-[.16em]"
            style={{ color: GLASSES_PALETTE.dusk }}
          >
            {hero.eyebrow}
          </p>
          <h1 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl">
            {hero.headline}
          </h1>
          <p
            className="max-w-xl font-body text-base leading-relaxed"
            style={{ color: GLASSES_PALETTE.dusk }}
          >
            {hero.lede}
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight sm:text-3xl">
            {reveal.headline}
          </h2>
          <p
            className="max-w-xl font-body text-base leading-relaxed"
            style={{ color: GLASSES_PALETTE.dusk }}
          >
            {reveal.sub}
          </p>
        </section>

        {info.map((section) => (
          <section key={section.id} id={section.id} className="flex flex-col gap-3">
            <h2 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight sm:text-3xl">
              {section.title}
            </h2>
            <p
              className="max-w-xl font-body text-base leading-relaxed"
              style={{ color: GLASSES_PALETTE.dusk }}
            >
              {section.body}
            </p>
            {section.specs && (
              <dl className="mt-2 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[.12em]">
                {section.specs.map((spec) => (
                  <div key={spec.k} className="flex gap-2">
                    <dt style={{ color: GLASSES_PALETTE.dusk }}>{spec.k}</dt>
                    <dd>{spec.v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        ))}

        <nav className="flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[.16em]">
          <Link href="/get-involved" className="underline underline-offset-4">
            {cta.label}
          </Link>
          <Link href={next.href} className="underline underline-offset-4">
            {next.eyebrow}: {next.title}
          </Link>
        </nav>
      </div>
    </div>
  );
}
