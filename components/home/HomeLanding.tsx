'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { homeLandingCopy } from '@/lib/data/homeLanding';
import './home-landing.css';

const copy = homeLandingCopy;

function Divider({ dark = false }: { dark?: boolean }) {
  const starColor = dark ? 'rgba(242,240,232,.35)' : 'rgba(17,19,17,.5)';
  const lineColor = dark ? 'rgba(242,240,232,.18)' : 'rgba(17,19,17,.25)';

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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-[30px] bg-[#0A0C0A] transition-transform duration-[850ms] ease-[cubic-bezier(.76,0,.24,1)]"
          style={{ transform: loaderExiting ? 'translateY(-100%)' : 'translateY(0)' }}
        >
          <div className="flex flex-col items-center gap-[10px]">
            <div className="font-[family-name:var(--font-home-mono)] text-[clamp(30px,4.5vw,44px)] font-medium tracking-[.42em] text-[#F2F0E8] [text-indent:.42em]">
              {copy.loader.title}
            </div>
            <div className="font-[family-name:var(--font-home-mono)] text-[10px] uppercase tracking-[.3em] text-[#8B948C] [text-indent:.3em]">
              {copy.loader.subtitle}
            </div>
          </div>
          <div className="relative h-px w-[min(300px,60vw)] overflow-hidden bg-[rgba(242,240,232,.16)]">
            <div className="home-landing__loader-bar absolute bottom-0 left-0 top-0 bg-[#C28E0E]" />
          </div>
          <div className="home-landing__loader-status font-[family-name:var(--font-home-mono)] text-[9.5px] tracking-[.22em] text-[#8B948C]">
            {copy.loader.status}
          </div>
        </div>
      ) : null}

      <nav className="sticky top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center border-b border-[rgba(17,19,17,.12)] bg-[rgba(247,246,242,.92)] px-[18px] py-[10px] backdrop-blur-[10px]">
        <Link href="#top" className="flex items-center gap-2 justify-self-start hover:text-[#111311]">
          <span className="relative inline-block size-[14px] border-[1.5px] border-[#111311]">
            <span className="absolute inset-[3px] bg-[#C28E0E]" />
          </span>
          <span className="font-[family-name:var(--font-home-mono)] text-[13px] font-medium tracking-[.12em]">
            DIGITAL
          </span>
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
              className="font-[family-name:var(--font-home-mono)] text-[10.5px] tracking-[.1em] text-[#5A615B] hover:text-[#111311]"
            >
              {item.label}
            </a>
          ))}
        </div>
        <Link
          href={copy.links.contact}
          className="justify-self-end rounded-[2px] border border-[rgba(17,19,17,.35)] px-4 py-[7px] font-[family-name:var(--font-home-mono)] text-[10px] tracking-[.12em] text-[#111311] hover:bg-[#111311] hover:text-[#F7F6F2]"
        >
          {copy.nav.cta}
        </Link>
      </nav>

      <header id="top" className="px-[18px] pb-0 pt-[clamp(48px,8vh,90px)] text-center">
        <h1 className="mx-auto mb-[22px] max-w-[760px] font-[family-name:var(--font-home-serif)] text-[clamp(34px,5vw,58px)] font-medium leading-[1.14] tracking-[-0.01em] text-[#111311]">
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
          className="mx-auto mb-[26px] font-[family-name:var(--font-home-mono)] text-[11px] tracking-[.06em] text-[#5A615B]"
        >
          {copy.hero.subline}
        </p>
        <div data-hero-word className="mb-9">
          <a
            href="#join"
            className="inline-block rounded-[2px] bg-[#111311] px-6 py-[11px] font-[family-name:var(--font-home-mono)] text-[10.5px] tracking-[.12em] text-[#F7F6F2] hover:bg-[#1E4D2B]"
          >
            {copy.hero.cta}
          </a>
        </div>
        <div
          data-hero-word
          className="home-landing__stripe relative mx-auto h-[clamp(360px,72vh,640px)] max-w-full overflow-hidden border border-[rgba(17,19,17,.1)]"
        >
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[70%] w-[min(420px,70%)] -translate-x-1/2 -translate-y-1/2 border border-[rgba(17,19,17,.25)]" />
            <div className="absolute left-1/2 top-1/2 grid h-1/2 w-[min(300px,50%)] -translate-x-1/2 -translate-y-1/2 grid-cols-4 grid-rows-4">
              {['1/1', '1/2', '1/3', '1/4', '2/1', '2/4', '3/1', '3/4', '4/1', '4/2', '4/3', '4/4'].map(
                (area) => (
                  <span
                    key={area}
                    style={{ gridArea: area }}
                    className="flex items-center justify-center font-[family-name:var(--font-home-mono)] text-[13px] text-[rgba(17,19,17,.4)]"
                  >
                    +
                  </span>
                )
              )}
            </div>
          </div>
          <div className="absolute bottom-14 left-1/2 flex w-[min(440px,70%)] -translate-x-1/2 flex-col gap-[9px]">
            <div className="h-px bg-[rgba(17,19,17,.25)]" />
            <div className="mx-6 h-px bg-[rgba(17,19,17,.2)]" />
            <div className="mx-12 h-px bg-[rgba(17,19,17,.15)]" />
            <div className="mx-[72px] h-px bg-[rgba(17,19,17,.1)]" />
          </div>
          <div className="absolute left-1/2 top-[14px] -translate-x-1/2 font-[family-name:var(--font-home-mono)] text-[9.5px] tracking-[.2em] text-[rgba(17,19,17,.45)]">
            {copy.hero.visualLabel}
          </div>
        </div>
      </header>

      <Divider />

      <section id="thesis" className="relative bg-[#0A0C0A] text-[#F2F0E8]">
        <div
          className="flex items-center gap-[18px] border-b border-[rgba(242,240,232,.12)] px-[18px] py-[10px]"
          aria-hidden="true"
        >
          <span className="font-[family-name:var(--font-home-mono)] text-[11px] text-[rgba(242,240,232,.35)]">✳</span>
          <span className="h-px flex-1 bg-[rgba(242,240,232,.18)]" />
          <span className="font-[family-name:var(--font-home-mono)] text-[11px] text-[rgba(242,240,232,.35)]">✳</span>
          <span className="h-px flex-1 bg-[rgba(242,240,232,.18)]" />
          <span className="font-[family-name:var(--font-home-mono)] text-[11px] text-[rgba(242,240,232,.35)]">✳</span>
        </div>
        <div className="grid border-b border-[rgba(242,240,232,.12)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]">
          <div className="flex flex-col items-center justify-center gap-5 border-r border-[rgba(242,240,232,.12)] px-[clamp(24px,4vw,56px)] py-[clamp(60px,10vh,110px)] text-center">
            <div
              data-reveal
              className="font-[family-name:var(--font-home-mono)] text-[10px] uppercase tracking-[.24em] text-[#8B948C]"
            >
              {copy.thesis.eyebrow}
            </div>
            <div className="overflow-hidden">
              <h2
                data-reveal
                data-reveal-delay="110"
                className="m-0 max-w-[420px] font-[family-name:var(--font-home-serif)] text-[clamp(26px,3vw,38px)] font-medium leading-[1.25] text-[#F2F0E8]"
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
                className="flex flex-1 flex-col gap-3 border-b border-[rgba(242,240,232,.12)] px-[clamp(24px,3.5vw,44px)] py-[clamp(24px,3vw,36px)] hover:bg-[#111511]"
              >
                <span className="inline-flex size-[26px] items-center justify-center rounded-[3px] border border-[rgba(242,240,232,.3)] font-[family-name:var(--font-home-mono)] text-[12px] text-[#C28E0E]">
                  {gap.glyph}
                </span>
                <h3 className="m-0 text-[14px] font-semibold tracking-[.02em] text-[#F2F0E8]">{gap.title}</h3>
                <p className="m-0 max-w-[460px] text-[12.5px] leading-[1.7] text-[#8B948C]">{gap.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-[18px] px-[18px] py-[10px]" aria-hidden="true">
          <span className="font-[family-name:var(--font-home-mono)] text-[11px] text-[rgba(242,240,232,.35)]">✳</span>
          <span className="h-px flex-1 bg-[rgba(242,240,232,.18)]" />
          <span className="font-[family-name:var(--font-home-mono)] text-[11px] text-[rgba(242,240,232,.35)]">✳</span>
          <span className="h-px flex-1 bg-[rgba(242,240,232,.18)]" />
          <span className="font-[family-name:var(--font-home-mono)] text-[11px] text-[rgba(242,240,232,.35)]">✳</span>
        </div>
      </section>

      <Divider />

      <section id="pathways" className="px-[18px] py-[clamp(64px,10vh,110px)] text-center">
        <div
          data-reveal
          className="mb-[26px] font-[family-name:var(--font-home-mono)] text-[10px] uppercase tracking-[.24em] text-[#5A615B]"
        >
          {copy.pathways.eyebrow}
        </div>
        <div className="mb-14 overflow-hidden">
          <h2
            data-reveal
            data-reveal-delay="110"
            className="mx-auto m-0 max-w-[640px] font-[family-name:var(--font-home-serif)] text-[clamp(24px,3vw,36px)] font-medium leading-[1.3] text-[#111311]"
          >
            Two ways to build with DIGITAL, both grounded in real systems, real constraints, and our
            flagship <span className="font-semibold">Smartphone Project</span>
          </h2>
        </div>
        <div
          data-reveal
          data-reveal-delay="100"
          className="relative mx-auto mb-0 h-[34px] w-px bg-[rgba(17,19,17,.3)]"
        >
          <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 font-[family-name:var(--font-home-mono)] text-[12px] text-[rgba(17,19,17,.5)]">
            +
          </span>
        </div>
        <div
          data-reveal
          data-reveal-delay="140"
          className="relative mx-auto mb-[34px] h-px w-[min(340px,70%)] bg-[rgba(17,19,17,.3)]"
        >
          <span className="absolute left-0 top-0 h-[26px] w-px bg-[rgba(17,19,17,.3)]" />
          <span className="absolute right-0 top-0 h-[26px] w-px bg-[rgba(17,19,17,.3)]" />
        </div>
        <div className="mb-11 flex flex-wrap justify-center gap-[22px]">
          {copy.pathways.ways.map((way, index) => (
            <div
              key={way.title}
              data-reveal
              data-reveal-delay={String(120 + index * 110)}
              className="flex w-[min(300px,86vw)] flex-col items-center gap-[14px] border border-[rgba(17,19,17,.15)] bg-[#FCFBF8] p-[34px_26px] hover:border-[rgba(17,19,17,.4)]"
            >
              <span className="inline-flex size-[34px] items-center justify-center rounded-[4px] border border-[rgba(17,19,17,.25)] font-[family-name:var(--font-home-mono)] text-[15px] text-[#111311]">
                {way.glyph}
              </span>
              <h3 className="m-0 text-[14px] font-semibold tracking-[.02em] text-[#1E4D2B]">{way.title}</h3>
              <p className="m-0 text-[12px] leading-[1.75] text-[#5A615B]">{way.body}</p>
            </div>
          ))}
        </div>
        <a
          data-reveal
          data-reveal-delay="260"
          href="#join"
          className="inline-block rounded-[2px] bg-[#111311] px-6 py-[11px] font-[family-name:var(--font-home-mono)] text-[10.5px] tracking-[.12em] text-[#F7F6F2] hover:bg-[#1E4D2B]"
        >
          {copy.pathways.cta}
        </a>
      </section>

      <Divider />

      <section id="results" className="px-[18px] py-[clamp(56px,9vh,96px)] pb-[clamp(64px,10vh,110px)]">
        <div
          data-reveal
          className="mb-[18px] font-[family-name:var(--font-home-mono)] text-[10px] uppercase tracking-[.24em] text-[#5A615B]"
        >
          {copy.results.eyebrow}
        </div>
        <div className="mb-9 overflow-hidden">
          <h2
            data-reveal
            data-reveal-delay="110"
            className="m-0 font-[family-name:var(--font-home-serif)] text-[clamp(26px,3.2vw,40px)] font-medium leading-[1.2] text-[#111311]"
          >
            {copy.results.heading}
          </h2>
        </div>
        <div className="flex gap-[22px] overflow-x-auto pb-4">
          {copy.results.cases.map((cs, index) => {
            const href =
              cs.title === 'The Smartphone Project' ? copy.links.smartphoneProject : copy.links.join;
            return (
              <div
                key={cs.title}
                data-reveal
                data-reveal-delay={String(120 + index * 110)}
                className="flex flex-none items-stretch gap-[14px]"
              >
                <div className="home-landing__stripe flex w-[clamp(160px,18vw,220px)] flex-none items-center justify-center rounded-[10px] border border-[rgba(17,19,17,.12)] p-3 text-center">
                  <span className="font-[family-name:var(--font-home-mono)] text-[9px] leading-[1.8] tracking-[.14em] text-[rgba(17,19,17,.45)]">
                    [ {cs.imageLabel} ]
                  </span>
                </div>
                <Link
                  href={href}
                  className="flex w-[min(520px,78vw)] flex-col overflow-hidden rounded-[8px] border border-[rgba(17,19,17,.15)] bg-[#FCFBF8] hover:border-[rgba(17,19,17,.35)]"
                >
                  <div className="flex items-center gap-3 border-b border-[rgba(17,19,17,.12)] px-5 py-4">
                    <span className="inline-flex size-7 flex-none items-center justify-center rounded-[4px] border border-[rgba(17,19,17,.25)] font-[family-name:var(--font-home-mono)] text-[13px]">
                      {cs.glyph}
                    </span>
                    <div className="text-left">
                      <div className="font-[family-name:var(--font-home-mono)] text-[9px] uppercase tracking-[.16em] text-[#5A615B]">
                        {cs.kicker}
                      </div>
                      <div className="text-base font-semibold text-[#111311]">{cs.title}</div>
                    </div>
                  </div>
                  <div className="border-b border-[rgba(17,19,17,.12)] px-5 py-[14px] text-left text-[12.5px] text-[#111311]">
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
                        className={`px-5 py-4 text-left ${statIndex < 2 ? 'border-r border-[rgba(17,19,17,.12)]' : ''}`}
                      >
                        <div className="font-[family-name:var(--font-home-serif)] text-2xl font-medium text-[#111311]">
                          {stat.value}
                        </div>
                        <div className="mt-1 font-[family-name:var(--font-home-mono)] text-[8.5px] uppercase tracking-[.14em] text-[#5A615B]">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[rgba(17,19,17,.12)] px-5 py-[14px] text-left">
                    <div className="mb-2 font-[family-name:var(--font-home-mono)] text-[8.5px] uppercase tracking-[.16em] text-[#5A615B]">
                      Learnings
                    </div>
                    <div className="text-[12px] leading-[1.8] text-[#111311]">
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

      <section id="join" className="bg-[#0A0C0A] px-[18px] py-[clamp(80px,13vh,140px)] text-center text-[#F2F0E8]">
        <div className="mb-6 overflow-hidden">
          <h2
            data-reveal
            className="mx-auto m-0 max-w-[640px] font-[family-name:var(--font-home-serif)] text-[clamp(28px,3.6vw,46px)] font-medium leading-[1.2] text-[#F2F0E8]"
          >
            {copy.join.heading}
          </h2>
        </div>
        <p
          data-reveal
          data-reveal-delay="120"
          className="mx-auto mb-8 max-w-[460px] text-[13px] leading-[1.75] text-[#8B948C]"
        >
          {copy.join.body}
        </p>
        <div data-reveal data-reveal-delay="200" className="flex flex-wrap justify-center gap-[14px]">
          <Link
            href={copy.links.join}
            className="inline-block rounded-[2px] bg-[#C28E0E] px-[26px] py-3 font-[family-name:var(--font-home-mono)] text-[10.5px] tracking-[.12em] text-[#0A0C0A] hover:bg-[#D8A62A]"
          >
            {copy.join.primaryCta}
          </Link>
          <Link
            href={copy.links.contact}
            className="inline-block rounded-[2px] border border-[rgba(242,240,232,.3)] px-[26px] py-3 font-[family-name:var(--font-home-mono)] text-[10.5px] tracking-[.12em] text-[#F2F0E8] hover:border-[#C28E0E] hover:text-[#C28E0E]"
          >
            {copy.join.secondaryCta}
          </Link>
        </div>
      </section>

      <footer className="border-t border-[rgba(242,240,232,.12)] bg-[#0A0C0A] px-[18px] py-9 text-[#8B948C]">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-start justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-[family-name:var(--font-home-mono)] text-sm font-medium tracking-[.2em] text-[#F2F0E8]">
              DIGITAL
            </span>
            <span className="font-[family-name:var(--font-home-mono)] text-[9.5px] uppercase tracking-[.16em]">
              @ Cal Poly Pomona
            </span>
          </div>
          <div className="flex flex-col gap-[7px] text-right font-[family-name:var(--font-home-mono)] text-[9.5px] uppercase tracking-[.14em]">
            {copy.footer.taglines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
