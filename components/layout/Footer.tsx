'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/lib/data/siteConfig';
import { isImmersiveRoute } from '@/lib/immersiveRoutes';
import {
  footerQuickLinks,
  legalLinks,
  socialLinks,
} from '@/lib/data/siteLinks';

const monoMicro =
  'font-homeMono text-[9.5px] uppercase tracking-[.14em] leading-[1.9]';
const linkHover = 'transition-colors duration-200 hover:text-dg-cream';

export function Footer() {
  const pathname = usePathname();
  // Immersive routes render their own chrome — hide the site footer.
  if (isImmersiveRoute(pathname)) return null;

  return (
    <footer className="border-t border-dg-line-dark bg-dg-dark px-[var(--dg-gutter)] py-9 text-dg-muted-dark">
      <div className="mx-auto flex max-w-[var(--dg-footer-max)] flex-wrap items-start justify-between gap-x-12 gap-y-8">
        {/* Colophon mark */}
        <div className="flex flex-col gap-3">
          <Image
            src={siteConfig.assets.logoFull}
            alt="DIGITAL @ Cal Poly Pomona"
            width={200}
            height={52}
            className="h-auto w-[min(200px,56vw)] invert"
          />
          <p className={`${monoMicro} max-w-[300px] normal-case tracking-[.06em]`}>
            {siteConfig.contact.meetingTime} · {siteConfig.contact.location}
          </p>
        </div>

        {/* Route links */}
        <nav aria-label="Footer" className={monoMicro}>
          <p className="text-dg-muted-dark">Index</p>
          <ul className="mt-2 flex flex-col">
            {footerQuickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkHover}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div className={monoMicro}>
          <p className="text-dg-muted-dark">Contact</p>
          <ul className="mt-2 flex flex-col">
            <li>
              <a href={`mailto:${siteConfig.contact.email}`} className={linkHover}>
                {siteConfig.contact.email}
              </a>
            </li>
            <li>{siteConfig.contact.campus}</li>
          </ul>
        </div>

        {/* Socials — visible text labels, external affordance */}
        <div className={monoMicro}>
          <p className="text-dg-muted-dark">Elsewhere</p>
          <ul className="mt-2 flex flex-col">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkHover}
                >
                  {social.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Legal row */}
      <div
        className={`mx-auto mt-8 flex max-w-[var(--dg-footer-max)] flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-dg-line-dark pt-6 ${monoMicro}`}
      >
        <span>© {new Date().getFullYear()} DIGITAL @ Cal Poly Pomona</span>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkHover}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
