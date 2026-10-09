'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { homeLandingCopy } from '@/lib/data/homeLanding';
import { siteConfig } from '@/lib/data/siteConfig';
import { BrandLogo } from '@/components/layout/BrandLogo';
import './home-landing.css';

const copy = homeLandingCopy;

function Divider({ dark = false }: { dark?: boolean }) {
  const starColor = dark ? 'var(--dg-star-dark)' : 'var(--dg-ink-50)';
  const lineColor = dark ? 'var(--dg-line-dark-mid)' : 'var(--dg-line)';

  return (
    <div className="home-landing__divider" aria-hidden="true">
      <span className="home-landing__divider-star" style={{ color: starColor }}>
        ✳
      </span>
      <span className="home-landing__divider-line" style={{ background: lineColor }} />
      <span className="home-landing__divider-star" style={{ color: starColor }}>
        ✳
      </span>
      <span className="home-landing__divider-line" style={{ background: lineColor }} />
      <span className="home-landing__divider-star" style={{ color: starColor }}>
        ✳
      </span>
      <span className="home-landing__divider-line" style={{ background: lineColor }} />
      <span className="home-landing__divider-star" style={{ color: starColor }}>
        ✳
      </span>
    </div>
  );
}

export default function HomeLanding() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [showLoader, setShowLoader] = useState(true);
  const [loaderExiting, setLoaderExiting] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const loaderMs = reduced ? 250 : copy.motion.loaderMs;

    const revealHero = () => {
      rootRef.current?.querySelectorAll('[data-hero-word]').forEach((el, i) => {
        const node = el as HTMLElement;
        node.style.transitionDelay = `${(0.12 + i * 0.1).toFixed(2)}s`;
        node.classList.add('is-visible');
      });
    };

    const showAll = () => {
      rootRef.current
        ?.querySelectorAll('[data-reveal],[data-hero-word]')
        .forEach((el) => el.classList.add('is-visible'));
      setLoaderExiting(true);
      setShowLoader(false);
    };

    const finishLoader = () => {
      setLoaderExiting(true);
      revealHero();
      window.setTimeout(() => setShowLoader(false), 900);
    };

    const loaderTimer = window.setTimeout(finishLoader, loaderMs);
    const safetyTimer = window.setTimeout(showAll, 7000);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const delay = el.getAttribute('data-reveal-delay');
          if (delay) el.style.transitionDelay = `${parseInt(delay, 10) / 1000}s`;
          el.classList.add('is-visible');
          io.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );

    const startObserver = window.setTimeout(() => {
      rootRef.current?.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    }, loaderMs + 200);

    return () => {
      window.clearTimeout(loaderTimer);
      window.clearTimeout(safetyTimer);
      window.clearTimeout(startObserver);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef} className="home-landing min-h-screen">
      {showLoader ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-[30px] bg-dg-dark transition-transform duration-[var(--dg-duration-loader-exit)] ease-[var(--dg-ease-loader-exit)]"
          style={{ transform: loaderExiting ? 'translateY(-100%)' : 'translateY(0)' }}
        >
          <div className="flex flex-col items-center gap-[10px]">
            <BrandLogo variant="dark" size={72} priority />
            <div className="font-homeMono text-[length:var(--dg-type-loader)] font-medium tracking-[.42em] text-dg-cream [text-indent:.42em]">
              {copy.loader.title}
            </div>
            <div className="font-homeMono text-[10px] uppercase tracking-[.3em] text-dg-muted-dark [text-indent:.3em]">
              {copy.loader.subtitle}
            </div>
          </div>
          <div className="relative h-px w-[min(300px,60vw)] overflow-hidden bg-dg-line-track">
            <div className="home-landing__loader-bar absolute bottom-0 left-0 top-0 bg-dg-gold" />
          </div>
          <div className="home-landing__loader-status font-homeMono text-[9.5px] tracking-[.22em] text-dg-muted-dark">
            {copy.loader.status}
          </div>
        </div>
      ) : null}

      <nav className="sticky top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center border-b border-dg-line-soft bg-dg-nav-bg px-[var(--dg-gutter)] py-[10px] backdrop-blur-[10px]">
        <Link href="#top" className="justify-self-start hover:opacity-80">
          <Image
            src={siteConfig.assets.logoFull}
            alt="DIGITAL @ Cal Poly Pomona"
            width={88}
            height={32}
            className="h-[32px] w-auto"
            priority
          />
        </Link>
        <div className="hidden justify-self-center gap-[26px] sm:flex">
          {[
            { href: '#thesis', label: copy.nav.thesis },
            { href: '#pathways', label: copy.nav.pathways },
            { href: '#results', label: copy.nav.results },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-homeMono text-[10.5px] tracking-[.1em] text-dg-muted hover:text-dg-ink"
            >
              {item.label}
            </a>
          ))}
          <Link
            href={copy.links.join}
            className="font-homeMono text-[10.5px] tracking-[.1em] text-dg-muted hover:text-dg-ink"
          >
            {copy.nav.join}
          </Link>
        </div>
        <Link
          href={copy.links.contact}
          className="justify-self-end rounded-[2px] border border-dg-line-hover px-4 py-[7px] font-homeMono text-[10px] tracking-[.12em] text-dg-ink hover:bg-dg-ink hover:text-dg-bg"
        >
          {copy.nav.cta}
        </Link>
        <div className="mt-[9px] flex justify-center gap-[18px] border-t border-dg-line-soft pb-[2px] pt-[8px] [grid-column:1/-1] sm:hidden">
          {[
            { href: '#thesis', label: copy.nav.thesis },
            { href: '#pathways', label: copy.nav.pathways },
            { href: '#results', label: copy.nav.results },
            { href: copy.links.join, label: copy.nav.join },
          ].map((item) =>
            item.href.startsWith('#') ? (
              <a
                key={item.label}
                href={item.href}
                className="font-homeMono text-[10px] tracking-[.1em] text-dg-muted hover:text-dg-ink"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="font-homeMono text-[10px] tracking-[.1em] text-dg-muted hover:text-dg-ink"
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </nav>

      <header id="top" className="px-[var(--dg-gutter)] pb-0 pt-[clamp(48px,8vh,90px)] text-center">
        <h1 className="mx-auto mb-[22px] max-w-[var(--dg-hero-max)] font-homeSerif text-[length:var(--dg-type-hero)] font-medium leading-[1.14] tracking-[-0.01em] text-dg-ink">
          {copy.hero.lines.map((line) => (
            <span key={line} className="home-landing__hero-line">
              <span data-hero-word className="inline-block">
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p
          data-hero-word
          className="mx-auto mb-[26px] font-homeMono text-[11px] tracking-[.06em] text-dg-muted"
        >
          {copy.hero.subline}
        </p>
        <div data-hero-word className="mb-9">
          <a
            href="#join"
            className="inline-block rounded-[2px] bg-dg-ink px-6 py-[11px] font-homeMono text-[10.5px] tracking-[.12em] text-dg-bg hover:bg-dg-green"
          >
            {copy.hero.cta}
          </a>
        </div>
        <div
          data-hero-word
          className="relative mx-auto h-[clamp(360px,72vh,640px)] max-w-full overflow-hidden border border-dg-line-hair"
        >
          <Image
            src={copy.hero.imageSrc}
            alt={copy.hero.imageAlt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </header>

      <Divider />

      <section id="thesis" className="relative bg-dg-dark text-dg-cream">
        <div
          className="flex items-center gap-[18px] border-b border-dg-line-dark px-[var(--dg-gutter)] py-[10px]"
          aria-hidden="true"
        >
          <span className="font-homeMono text-[11px] text-dg-star-dark">✳</span>
          <span className="h-px flex-1 bg-dg-line-dark-mid" />
          <span className="font-homeMono text-[11px] text-dg-star-dark">✳</span>
          <span className="h-px flex-1 bg-dg-line-dark-mid" />
          <span className="font-homeMono text-[11px] text-dg-star-dark">✳</span>
        </div>
        <div className="grid border-b border-dg-line-dark [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]">
          <div className="flex flex-col items-center justify-center gap-5 border-r border-dg-line-dark px-[clamp(24px,4vw,56px)] py-[clamp(60px,10vh,110px)] text-center">
            <div
              data-reveal
              className="font-homeMono text-[10px] uppercase tracking-[.24em] text-dg-muted-dark"
            >
              {copy.thesis.eyebrow}
            </div>
            <div className="overflow-hidden">
              <h2
                data-reveal
                data-reveal-delay="110"
                className="m-0 max-w-[420px] font-homeSans text-[length:var(--dg-type-thesis)] font-semibold leading-[1.2] text-dg-cream"
              >
                {copy.thesis.heading}
              </h2>
            </div>
          </div>
          <div className="flex flex-col">
            {copy.thesis.gaps.map((gap, index) => (
              <div
                key={gap.title}
                data-reveal
                data-reveal-delay={String(120 + index * 110)}
                className="flex flex-1 flex-col gap-3 border-b border-dg-line-dark px-[clamp(24px,3.5vw,44px)] py-[clamp(24px,3vw,36px)] hover:bg-dg-dark-hover"
              >
                <span className="inline-flex size-[26px] items-center justify-center rounded-[3px] border border-dg-line-dark-strong font-homeMono text-[12px] text-dg-gold">
                  {gap.glyph}
                </span>
                <h3 className="m-0 text-[14px] font-semibold tracking-[.02em] text-dg-cream">{gap.title}</h3>
                <p className="m-0 max-w-[460px] text-[12.5px] leading-[1.7] text-dg-muted-dark">{gap.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-[18px] px-[var(--dg-gutter)] py-[10px]" aria-hidden="true">
          <span className="font-homeMono text-[11px] text-dg-star-dark">✳</span>
          <span className="h-px flex-1 bg-dg-line-dark-mid" />
          <span className="font-homeMono text-[11px] text-dg-star-dark">✳</span>
          <span className="h-px flex-1 bg-dg-line-dark-mid" />
          <span className="font-homeMono text-[11px] text-dg-star-dark">✳</span>
        </div>
      </section>

      <Divider />

      <section id="pathways" className="px-[var(--dg-gutter)] py-[var(--dg-section-pathways)] text-center">
        <div
          data-reveal
          className="mb-[26px] font-homeMono text-[10px] uppercase tracking-[.24em] text-dg-muted"
        >
          {copy.pathways.eyebrow}
        </div>
        <div className="mb-14 overflow-hidden">
          <h2
            data-reveal
            data-reveal-delay="110"
            className="mx-auto m-0 max-w-[var(--dg-heading-max)] font-homeSans text-[length:var(--dg-type-thesis)] font-semibold leading-[1.2] text-dg-ink"
          >
            {copy.pathways.heading}
          </h2>
        </div>
        <div
          data-reveal
          data-reveal-delay="100"
          className="relative mx-auto mb-0 h-[34px] w-px bg-dg-line-accent"
        >
          <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 font-homeMono text-[12px] text-dg-ink-50">
            +
          </span>
        </div>
        <div
          data-reveal
          data-reveal-delay="140"
          className="relative mx-auto mb-[34px] h-px w-[min(340px,70%)] bg-dg-line-accent"
        >
          <span className="absolute left-0 top-0 h-[26px] w-px bg-dg-line-accent" />
          <span className="absolute right-0 top-0 h-[26px] w-px bg-dg-line-accent" />
        </div>
        <div className="mb-11 flex flex-wrap justify-center gap-[22px]">
          {copy.pathways.ways.map((way, index) => (
            <div
              key={way.title}
              data-reveal
              data-reveal-delay={String(120 + index * 110)}
              className="flex w-[min(300px,86vw)] flex-col items-center gap-[14px] border border-dg-line-card bg-dg-card p-[34px_26px] hover:border-dg-line-strong"
            >
              <span className="inline-flex size-[34px] items-center justify-center rounded-[4px] border border-dg-line font-homeMono text-[15px] text-dg-ink">
                {way.glyph}
              </span>
              <h3 className="m-0 text-[14px] font-semibold tracking-[.02em] text-dg-green">{way.title}</h3>
              <p className="m-0 text-[12px] leading-[1.75] text-dg-muted">{way.body}</p>
            </div>
          ))}
        </div>
        <a
          data-reveal
          data-reveal-delay="260"
          href="#join"
          className="inline-block rounded-[2px] bg-dg-ink px-6 py-[11px] font-homeMono text-[10.5px] tracking-[.12em] text-dg-bg hover:bg-dg-green"
        >
          {copy.pathways.cta}
        </a>
      </section>

      <Divider />

      <section id="results" className="px-[var(--dg-gutter)] py-[var(--dg-section-results)] pb-[var(--dg-section-pathways)]">
        <div
          data-reveal
          className="mb-[18px] font-homeMono text-[10px] uppercase tracking-[.24em] text-dg-muted"
        >
          {copy.results.eyebrow}
        </div>
        <div className="mb-9 overflow-hidden">
          <h2
            data-reveal
            data-reveal-delay="110"
            className="m-0 font-homeSans text-[length:var(--dg-type-thesis)] font-semibold leading-[1.2] text-dg-ink"
          >
            {copy.results.heading}
          </h2>
        </div>
        <div className="flex gap-[22px] overflow-x-auto pb-4">
          {copy.results.cases.map((cs, index) => {
            return (
              <div
                key={cs.title}
                data-reveal
                data-reveal-delay={String(120 + index * 110)}
                className="flex flex-none items-stretch gap-[14px]"
              >
                <div className="home-landing__stripe flex w-[clamp(160px,18vw,220px)] flex-none items-center justify-center rounded-[10px] border border-dg-line-soft p-3 text-center">
                  <span className="font-homeMono text-[9px] leading-[1.8] tracking-[.14em] text-dg-ink-45">
                    [ {cs.imageLabel} ]
                  </span>
                </div>
                <Link
                  href={cs.href}
                  className="flex w-[min(520px,78vw)] flex-col overflow-hidden rounded-[8px] border border-dg-line-card bg-dg-card hover:border-dg-line-hover"
                >
                  <div className="flex items-center gap-3 border-b border-dg-line-soft px-5 py-4">
                    <span className="inline-flex size-7 flex-none items-center justify-center rounded-[4px] border border-dg-line font-homeMono text-[13px]">
                      {cs.glyph}
                    </span>
                    <div className="text-left">
                      <div className="font-homeMono text-[9px] uppercase tracking-[.16em] text-dg-muted">
                        {cs.kicker}
                      </div>
                      <div className="text-base font-semibold text-dg-ink">{cs.title}</div>
                    </div>
                  </div>
                  <div className="border-b border-dg-line-soft px-5 py-[14px] text-left text-[12.5px] text-dg-ink">
                    {cs.line}
                  </div>
                  <div className="grid grid-cols-3">
                    {[
                      { value: cs.stat1, label: cs.stat1label },
                      { value: cs.stat2, label: cs.stat2label },
                      { value: cs.stat3, label: cs.stat3label },
                    ].map((stat, statIndex) => (
                      <div
                        key={stat.label}
                        className={`px-5 py-4 text-left ${statIndex < 2 ? 'border-r border-dg-line-soft' : ''}`}
                      >
                        <div className="font-homeSerif text-2xl font-medium text-dg-ink">
                          {stat.value}
                        </div>
                        <div className="mt-1 font-homeMono text-[8.5px] uppercase tracking-[.14em] text-dg-muted">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-dg-line-soft px-5 py-[14px] text-left">
                    <div className="mb-2 font-homeMono text-[8.5px] uppercase tracking-[.16em] text-dg-muted">
                      Learnings
                    </div>
                    <div className="text-[12px] leading-[1.8] text-dg-ink">
                      {cs.learn1}
                      <br />
                      {cs.learn2}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <Divider />

      <section
        id="mission"
        className="grid border-y border-dg-line-soft [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]"
      >
        <div className="flex flex-col items-center justify-center gap-5 px-[clamp(24px,4vw,56px)] py-[clamp(60px,10vh,110px)] text-center">
          <div
            data-reveal
            className="font-homeMono text-[10px] uppercase tracking-[.24em] text-dg-muted"
          >
            {copy.mission.eyebrow}
          </div>
          <div className="overflow-hidden">
            <h2
              data-reveal
              data-reveal-delay="110"
              className="m-0 max-w-[420px] font-homeSans text-[length:var(--dg-type-thesis)] font-semibold leading-[1.2] text-dg-ink"
            >
              {copy.mission.heading}
            </h2>
          </div>
          <p
            data-reveal
            data-reveal-delay="120"
            className="m-0 max-w-[460px] text-[13px] leading-[1.75] text-dg-muted"
          >
            {copy.mission.statement}
          </p>
          <div data-reveal data-reveal-delay="140" className="mt-1 flex flex-col items-center gap-[7px]">
            <span className="font-homeMono text-[9px] uppercase tracking-[.18em] text-dg-muted">
              {copy.mission.visionLabel}
            </span>
            <p className="m-0 max-w-[420px] text-[14px] font-semibold leading-[1.5] tracking-[.02em] text-dg-ink">
              {copy.mission.vision}
            </p>
          </div>
        </div>
        <div className="flex flex-col border-l border-dg-line-soft">
          {copy.mission.beats.map((beat, index) => (
            <div
              key={beat.label}
              data-reveal
              data-reveal-delay={String(120 + index * 110)}
              className="flex flex-1 flex-col justify-center gap-[7px] border-b border-dg-line-soft px-[clamp(24px,3.5vw,44px)] py-[clamp(20px,3vh,34px)] last:border-b-0 hover:bg-dg-card"
            >
              <span className="font-homeMono text-[9.5px] uppercase tracking-[.18em] text-dg-muted">
                {beat.label}
              </span>
              <p className="m-0 max-w-[460px] text-[13px] leading-[1.65] text-dg-ink">{beat.line}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="join" className="bg-dg-dark px-[var(--dg-gutter)] py-[var(--dg-section-join)] text-center text-dg-cream">
        <div className="mb-6 overflow-hidden">
          <h2
            data-reveal
            className="mx-auto m-0 max-w-[var(--dg-heading-max)] font-homeSerif text-[length:var(--dg-type-hero)] font-medium leading-[1.14] tracking-[-0.01em] text-dg-cream"
          >
            {copy.join.heading}
          </h2>
        </div>
        <p
          data-reveal
          data-reveal-delay="120"
          className="mx-auto mb-8 max-w-[460px] text-[13px] leading-[1.75] text-dg-muted-dark"
        >
          {copy.join.body}
        </p>
        <div data-reveal data-reveal-delay="200" className="flex flex-wrap justify-center gap-[14px]">
          <Link
            href={copy.links.join}
            className="inline-block rounded-[2px] bg-dg-gold px-[26px] py-3 font-homeMono text-[10.5px] tracking-[.12em] text-dg-dark hover:bg-dg-gold-bright"
          >
            {copy.join.primaryCta}
          </Link>
          <Link
            href={copy.links.contact}
            className="inline-block rounded-[2px] border border-dg-line-dark-strong px-[26px] py-3 font-homeMono text-[10.5px] tracking-[.12em] text-dg-cream hover:border-dg-gold hover:text-dg-gold"
          >
            {copy.join.secondaryCta}
          </Link>
        </div>
      </section>

      <footer className="border-t border-dg-line-dark bg-dg-dark px-[var(--dg-gutter)] py-9 text-dg-muted-dark">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-start justify-between gap-6">
          <div className="flex flex-col gap-2">
            <Image
              src={siteConfig.assets.logoFull}
              alt="DIGITAL @ Cal Poly Pomona"
              width={200}
              height={52}
              className="h-auto w-[min(200px,56vw)] invert"
            />
          </div>
          <div className="flex flex-col gap-[7px] text-right font-homeMono text-[9.5px] uppercase tracking-[.14em]">
            {copy.footer.taglines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-[1100px] flex-wrap gap-x-5 gap-y-2 border-t border-dg-line-dark pt-6 font-homeMono text-[9.5px] uppercase tracking-[.14em]">
          {copy.footer.legal.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors duration-200 hover:text-dg-cream"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
