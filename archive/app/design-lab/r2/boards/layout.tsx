import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Board specimens · R2 system · DIGITAL design lab',
  description: "The club's real KiCad boards rendered as web geometry for the R2 teardown.",
  robots: { index: false, follow: false },
};

/** Same scoped chrome-hiding approach as /design-lab/e: this specimen ships its own frame. */
const HIDE_PRODUCTION_CHROME = [
  'body > nav[aria-label="Primary"], body > footer { display: none !important; }',
  'body { background: #0c0d0e; }',
  'html { cursor: auto !important; }',
  '[style*="ds-z-cursor"] { display: none !important; }',
  'body > a[href="#main-content"] { display: none !important; }',
].join('\n');

export default function BoardsLayout({ children }: { readonly children: ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIDE_PRODUCTION_CHROME }} />
      {children}
    </>
  );
}
