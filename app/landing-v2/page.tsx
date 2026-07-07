/**
 * Landing V2 preview — TreeHacks-inspired single-scroll page.
 * Placeholder sections only; real components (IntroLoader, ParallaxHero,
 * PillarsMarquee, …) get wired in by follow-up tasks. Section ids match the
 * plan flow and anchor the floating pill nav.
 */

const SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'mission', label: 'Mission' },
  { id: 'metrics', label: 'Depth Metrics' },
  { id: 'pillars', label: 'Pillars' },
  { id: 'projects', label: 'Projects' },
  { id: 'backing', label: 'Backing' },
  { id: 'paths', label: 'Paths In' },
  { id: 'faq', label: 'FAQ' },
  { id: 'join', label: 'Join' },
] as const;

export default function LandingV2Page() {
  return (
    <main className="min-h-screen bg-ink text-studio">
      {SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-label={section.label}
          className="flex min-h-[60vh] items-center justify-center border-b border-ink-soft/30"
        >
          <p className="font-mono text-sm uppercase tracking-eyebrow text-studio-lo">
            {section.label} — coming soon
          </p>
        </section>
      ))}
    </main>
  );
}
