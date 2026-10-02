import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { JetBrains_Mono } from 'next/font/google';
import MotionRoot from './MotionRoot';
import styles from './a.module.css';

export const metadata: Metadata = {
  title: 'Concept A — Editorial / Studio · DIGITAL design lab',
  description: 'Design lab prototype A: DIGITAL as a printed edition of its own work.',
  robots: { index: false, follow: false },
};

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  preload: false,
  variable: '--a-font-mono',
});

/**
 * Fontshare (ITF Free Font License): link to the CDN, never commit the files.
 * One stylesheet per family — combined requests drop families (fonts.md flag).
 */
const FONTSHARE = [
  'https://api.fontshare.com/v2/css?f[]=zodiak@400,401&display=swap',
  'https://api.fontshare.com/v2/css?f[]=switzer@1&display=swap',
];

// Lab-only: the production Navbar/Footer render on every route (lib/immersiveRoutes.ts is
// off-limits). This route ships its own masthead + colophon, so hide the global chrome here.
const HIDE_GLOBAL_CHROME =
  'body > nav[aria-label="Primary"], body > footer { display: none !important; } body { background: #f1eee7; }';

export default function ConceptALayout({ children }: { readonly children: ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://api.fontshare.com" />
      <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
      {FONTSHARE.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <style dangerouslySetInnerHTML={{ __html: HIDE_GLOBAL_CHROME }} />
      <div className={`${mono.variable} ${styles.root}`}>
        <MotionRoot>{children}</MotionRoot>
      </div>
    </>
  );
}
