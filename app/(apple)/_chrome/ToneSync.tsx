'use client';

/**
 * Keeps the sticky <LocalNav> tone matched to the chapter under its bottom edge.
 * Pages mark dark chapters with data-tone="dark" (light is the default). One IntersectionObserver watches a
 * 1px band just under the bar; the deepest chapter crossing it decides the tone. No scroll listener, no rAF.
 * The band is rebuilt on resize. Without JS the server `tone` stays.
 */
import { useEffect, useRef } from 'react';

const CHAPTERS = 'main section, main [data-tone], main footer';

export function ToneSync() {
  const probe = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const bar = probe.current?.closest<HTMLElement>('[data-chrome="local-nav"]');
    if (!bar) return undefined;
    const hits = new Set<Element>();
    let io: IntersectionObserver | null = null;

    const apply = (): void => {
      const all = Array.from(hits);
      // deepest = an intersecting chapter that contains no other intersecting chapter (last in document order)
      const leaves = all.filter((el) => !all.some((o) => o !== el && el.contains(o)));
      const pick = leaves[leaves.length - 1];
      if (!pick) return; // nothing under the band (top of page, above the first chapter): keep the current tone
      const tone = pick.closest<HTMLElement>('[data-tone]')?.dataset.tone === 'dark' ? 'dark' : 'light';
      if (tone === 'dark') bar.dataset.tone = 'dark';
      else delete bar.dataset.tone;
    };

    const build = (): void => {
      io?.disconnect();
      hits.clear();
      const bottom = Math.round(bar.getBoundingClientRect().height || 52);
      const vh = window.innerHeight;
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) hits.add(e.target);
            else hits.delete(e.target);
          }
          apply();
        },
        { rootMargin: `-${bottom}px 0px -${Math.max(0, vh - bottom - 1)}px 0px` },
      );
      document.querySelectorAll(CHAPTERS).forEach((el) => {
        if (!bar.contains(el)) io?.observe(el);
      });
    };

    build();
    let t = 0;
    const onResize = (): void => {
      window.clearTimeout(t);
      t = window.setTimeout(build, 150);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      io?.disconnect();
      window.clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return <span ref={probe} hidden />;
}
