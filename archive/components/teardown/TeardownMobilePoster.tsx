import type { TeardownConfig } from '@/lib/teardown/types';
import { posterPngSrc, TEARDOWN_ENCODED_ASSETS, posterSrcSet } from '@/lib/teardown/assets';

interface TeardownMobilePosterProps {
  cfg: TeardownConfig;
  eyebrow: string;
  heading: React.ReactNode;
  caption: string;
}

export function TeardownMobilePoster({
  cfg,
  eyebrow,
  heading,
  caption,
}: TeardownMobilePosterProps) {
  const layerLabels =
    cfg.renderer === 'registered'
      ? cfg.layers.map((l) => ({ label: l.label, note: l.note }))
      : cfg.states.map((s) => ({ label: s.label, note: s.note }));

  return (
    <section
      id="teardown"
      aria-label="Modular Smartphone teardown"
      className="border-t border-line py-16"
    >
      <div className="wrap">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="font-display text-[clamp(28px,8vw,42px)] font-bold uppercase leading-none tracking-[-.02em]">
          {heading}
        </h2>
        <p className="mt-3 max-w-[42ch] text-sm leading-[1.55] text-ink-soft">
          {caption}
        </p>

        <div className="relative mx-auto mt-10 w-full max-w-[520px]">
          {TEARDOWN_ENCODED_ASSETS ? (
            <picture>
              <source
                type="image/avif"
                srcSet={posterSrcSet('avif')}
                sizes="(max-width: 820px) 94vw, 520px"
              />
              <source
                type="image/webp"
                srcSet={posterSrcSet('webp')}
                sizes="(max-width: 820px) 94vw, 520px"
              />
              <img
                src={posterPngSrc()}
                alt="Exploded view of the modular smartphone"
                className="mx-auto block h-auto w-full object-contain"
                width={760}
                height={500}
                loading="eager"
                decoding="async"
              />
            </picture>
          ) : (
            <img
              src={posterPngSrc()}
              alt="Exploded view of the modular smartphone"
              className="mx-auto block h-auto w-full object-contain"
              width={760}
              height={500}
              loading="eager"
              decoding="async"
            />
          )}
        </div>

        <ol className="mx-auto mt-8 max-w-[520px] space-y-3 border-t border-line pt-6">
          {layerLabels.map((item) => (
            <li
              key={item.label}
              className="flex flex-col gap-1 border-b border-line pb-3 last:border-0"
            >
              <span className="font-mono text-[10px] uppercase tracking-label text-ink-soft">
                {item.label}
              </span>
              <span className="font-display text-lg font-bold uppercase text-accent">
                {item.note}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
