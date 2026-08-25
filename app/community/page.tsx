import type { Metadata } from 'next';
import Link from 'next/link';
import {
  communityChannels,
  linkedInPosts,
  videos,
} from '@/lib/data/community';
import { PageShell } from '@/components/layout/PageShell';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Community — DIGITAL @ Cal Poly Pomona',
  description:
    'Where the build happens: Discord standups, build milestones on LinkedIn, and recorded reviews.',
};

function EmptyPlate({ label }: { label: string }) {
  return (
    <div
      className="flex h-40 items-center justify-center rounded-plate border border-dg-line-hair p-3 text-center"
      style={{
        background:
          'repeating-linear-gradient(-45deg, var(--dg-stripe-a) 0 14px, var(--dg-stripe-b) 14px 28px)',
      }}
    >
      <span className="font-homeMono text-[9px] leading-[1.8] tracking-[.14em] text-dg-ink-45">
        [ {label} ]
      </span>
    </div>
  );
}

export default function CommunityPage() {
  const discord = communityChannels.find((c) => c.id === 'discord');
  const linkedin = communityChannels.find((c) => c.id === 'linkedin');
  const youtube = communityChannels.find((c) => c.id === 'youtube');

  return (
    <PageShell
      eyebrow="Community"
      title="Where the build happens."
      metaRow={['Open to all majors', 'Free to join']}
    >
      <div className="mx-auto max-w-[var(--dg-footer-max)]">
        <Reveal className="mb-[26px] max-w-[560px]">
          <p className="m-0 text-[13px] leading-[1.75] text-dg-muted">
            The club runs in the open. Join a channel, sit in on a review, or watch a
            teardown — no membership required to look around.
          </p>
        </Reveal>

        <div className="grid items-start gap-[22px] [grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr))]">
          {/* Discord */}
          <Reveal delay={110} className="flex flex-col rounded-card border border-dg-line-card bg-dg-card">
            <div className="border-b border-dg-line-soft px-[clamp(20px,2.5vw,28px)] py-4">
              <h2 className="m-0 text-[14px] font-semibold tracking-[.02em] text-dg-ink">
                {discord?.name}
              </h2>
              <p className="m-0 mt-[4px] text-[12.5px] leading-[1.65] text-dg-muted">
                {discord?.description}
              </p>
            </div>
            <ul className="m-0 flex flex-col px-[clamp(20px,2.5vw,28px)] py-4">
              {discord?.expectations?.map((line, i, arr) => (
                <li
                  key={line}
                  className={`py-[9px] text-[13px] leading-[1.6] text-dg-ink ${i < arr.length - 1 ? 'border-b border-dg-line-soft' : ''}`}
                >
                  {line}
                </li>
              ))}
            </ul>
            {discord?.url ? (
              <div className="mt-auto px-[clamp(20px,2.5vw,28px)] pb-[clamp(18px,2vw,24px)]">
                <a
                  href={discord.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block self-start rounded-cta bg-dg-ink px-6 py-[11px] font-homeMono text-[10.5px] tracking-[.12em] text-dg-bg transition-colors duration-200 hover:bg-dg-green focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
                >
                  Join the server ↗
                </a>
              </div>
            ) : null}
          </Reveal>

          {/* LinkedIn */}
          <Reveal delay={140} className="flex flex-col rounded-card border border-dg-line-card bg-dg-card">
            <div className="border-b border-dg-line-soft px-[clamp(20px,2.5vw,28px)] py-4">
              <h2 className="m-0 text-[14px] font-semibold tracking-[.02em] text-dg-ink">
                {linkedin?.name}
              </h2>
              <p className="m-0 mt-[4px] text-[12.5px] leading-[1.65] text-dg-muted">
                {linkedin?.description}
              </p>
            </div>
            <div className="px-[clamp(20px,2.5vw,28px)] py-5">
              {linkedInPosts.length === 0 ? (
                <>
                  <EmptyPlate label="NOTHING PUBLISHED YET" />
                  <p className="m-0 mt-3 text-[12.5px] leading-[1.7] text-dg-muted">
                    First milestone post is being drafted. Follow the page so it finds you.
                  </p>
                </>
              ) : null}
            </div>
          </Reveal>

          {/* YouTube */}
          <Reveal delay={170} className="flex flex-col rounded-card border border-dg-line-card bg-dg-card">
            <div className="border-b border-dg-line-soft px-[clamp(20px,2.5vw,28px)] py-4">
              <h2 className="m-0 text-[14px] font-semibold tracking-[.02em] text-dg-ink">
                {youtube?.name}
              </h2>
              <p className="m-0 mt-[4px] text-[12.5px] leading-[1.65] text-dg-muted">
                {youtube?.description}
              </p>
            </div>
            <div className="px-[clamp(20px,2.5vw,28px)] py-5">
              <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
                {videos.map((video) =>
                  video.isPlaceholder || !video.youtubeId ? (
                    <div key={video.id}>
                      <EmptyPlate label="RECORDING PENDING" />
                      <p className="m-0 mt-2 font-homeMono text-[9.5px] uppercase tracking-[.14em] text-dg-muted">
                        {video.title}
                      </p>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Contribution callout */}
        <Reveal delay={200} className="mt-[34px] border-t border-dg-line-soft pt-6">
          <p className="m-0 max-w-[560px] text-[12.5px] leading-[1.7] text-dg-muted">
            Made something worth showing — footage, write-ups, photos from the bench?{' '}
            <Link
              href="/contact?type=workshop"
              className="text-dg-ink underline underline-offset-2 hover:text-dg-green focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
            >
              Send it to the team
            </Link>{' '}
            and it ships here.
          </p>
        </Reveal>
      </div>
    </PageShell>
  );
}
