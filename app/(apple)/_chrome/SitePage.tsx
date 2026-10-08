/**
 * SitePage: the frame for a simple Apple-world page (contact, about, team, legal …).
 * Renders: skip link → ONE sticky <LocalNav> (DIGITAL wordmark → `/`, the three builds, one filled CTA)
 * → a single <main id="r2-main"> → <WorldFooter world="apple" />.
 *
 * Props
 *   children  the page's sections (put them straight inside; do not add another <main>)
 *   cta       nav pill. Default "Join build night" → `/#join` (the home join chapter). `null` hides it.
 *   tone      first paint of the nav: 'dark' (default, for a page that opens on a dark hero) or 'light'.
 *             With JS the bar then follows the section under it (data-tone="dark" = dark, otherwise light).
 *
 * Usage
 *   import { SitePage } from '../_chrome';
 *   import s from '../_chrome/site-page.module.css';
 *   <SitePage>
 *     <section className={s.hero} data-tone="dark" aria-labelledby="x-title"> … </section>
 *     <section className={s.section}> <div className={s.wrap}> … </div> </section>
 *   </SitePage>
 *
 * Classes in site-page.module.css (all on --r2-* tokens; tone comes from data-tone on the section)
 *   Layout
 *     .hero          page opener: centred, viewport-height-aware padding. Add data-tone="dark" for black.
 *     .heroTitle     the h1 (hero scale, clamps on width and height). One per page.
 *     .heroLead      the one line under it, in --r2-ink-2.
 *     .section       a chapter: vertical padding + gutter. data-tone="dark" = #000, none = white,
 *                    data-tone="raised" = light grey #f5f5f7. Add .flush to drop the top padding
 *                    when it continues the section above on the same ground.
 *     .wrap          1024px centred column (same as the nav).  .narrow  44rem centred column.
 *     .h2 / .h3      section heading steps.  .lead  a 21px supporting line under an .h2.
 *   Content
 *     .prose         long text: 68ch measure; styles h2, h3, p, ul, ol, a, strong inside it.
 *     .facts         <dl> of hairline rows; each row is a <div> with <dt> (label) + <dd> (value).
 *     .linkRow       <a> block row with a trailing chevron (put a list of them in <ul class={s.rows}>).
 *     .rows          unstyled <ul> with a top hairline, for .linkRow items.
 *     .textLink      inline underlined link, 44px tall hit area when it stands alone.
 *     .grid          card-free grid for people / items (auto-fill, 220px min); children are .item.
 *     .item          one cell: top hairline.  .itemTitle (17px/600) + .itemMeta (ink-2).
 *   Forms
 *     .form          vertical stack of fields.
 *     .field         label + control + hint/error.  .fieldPair  two fields side by side (stacks ≤734px).
 *     .label         label above the field.  .optional  the quiet "(optional)" suffix inside a label.
 *     .control       <input>, <select>, <textarea>: 48px, 17px text, focus ring in --r2-focus,
 *                    [aria-invalid="true"] brightens the border.
 *     .hint / .error helper and error text under a control (.error is the one red).
 *     .choices       <fieldset> of pill radios; .legend is its <legend>; .choiceList wraps the pills;
 *                    .choice is a <label> wrapping a visually hidden <input type="radio"> + <span>.
 *     .button        the one filled pill (44px). Works on <button> and <a>. :disabled / [aria-busy] dim it.
 *     .buttonQuiet   secondary outlined pill.
 *     .notice        form-level result message (data-kind="error" turns it red).
 *     .srOnly        visually hidden, still read.  .trap  honeypot wrapper (hidden from everyone).
 */
import type { ReactNode } from 'react';
import { localTitle } from '../_content/home';
import { LOCAL_CTA, LocalNav } from './LocalNav';
import { WorldFooter } from './WorldFooter';
import { PAGES, href } from './routes';
import chrome from './chrome.module.css';

const SITE_CTA = { label: LOCAL_CTA.label, href: '/#join' } as const;
const BUILD_LINKS = PAGES.filter((p) => p.id !== 'home').map((p) => ({ label: p.label, href: href('apple', p.id) }));

export interface SitePageProps {
  readonly children: ReactNode;
  readonly cta?: { readonly label: string; readonly href: string } | null;
  readonly tone?: 'light' | 'dark';
}

export function SitePage({ children, cta = SITE_CTA, tone = 'dark' }: SitePageProps) {
  return (
    <>
      <a className={chrome.skip} href="#r2-main">Skip to content</a>
      <LocalNav title={localTitle} titleHref="/" links={BUILD_LINKS} cta={cta} tone={tone} />
      <main id="r2-main">{children}</main>
      <WorldFooter world="apple" />
    </>
  );
}
