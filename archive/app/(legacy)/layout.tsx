import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { legacyShell } from '@/app/(legacy)/_shell';

// Progressive enhancement — never in server HTML; the site is fully
// functional with it absent (ui-revision D8).
const CursorProvider = dynamic(() => import('@/components/ui/CursorProvider'), {
  ssr: false,
});

/** Chrome for the pre-Apple-world pages (about, team, contact, legal, redirect stubs). URLs are unchanged. */
export default function LegacyLayout({ children }: { readonly children: ReactNode }) {
  return (
    <div className={legacyShell}>
      {/* Skip-to-content link — visually hidden until focused */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-studio focus:text-ink focus:border focus:border-ink focus:rounded focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />

      {/* Custom cursor — progressive enhancement only */}
      <CursorProvider />
    </div>
  );
}
