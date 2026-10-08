import type { ReactNode } from 'react';
import './_system/tokens/worlds.css';
import { fontApple } from './_system/fonts';

// Overscroll / rubber-band and any gap below a short page show the world's ground, not the root page background.
const GROUND = 'html:has(.world-apple), html:has(.world-apple) body { background: #f5f5f7 !important; color-scheme: light; }';

// World shell: token set + font stack for every live page. Pages own their content, chrome and skip link.
export default function AppleWorldLayout({ children }: { readonly children: ReactNode }) {
  return (
    <div className={`world-apple ${fontApple}`} data-world="apple">
      <style dangerouslySetInnerHTML={{ __html: GROUND }} />
      {children}
    </div>
  );
}
