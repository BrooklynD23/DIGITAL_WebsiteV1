'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, AtSign, MessageSquare, Code, FileText } from 'lucide-react';
import { siteConfig } from '@/lib/data/siteConfig';

const quickLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/team', label: 'Team' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const socials = [
  { href: siteConfig.social.linkedin, label: 'LinkedIn', Icon: Globe, external: true },
  { href: `mailto:${siteConfig.contact.email}`, label: 'Email', Icon: AtSign, external: false },
  { href: siteConfig.community.discord, label: 'Discord', Icon: MessageSquare, external: true },
  { href: siteConfig.community.github, label: 'GitHub', Icon: Code, external: true },
  { href: siteConfig.community.notion, label: 'Notion', Icon: FileText, external: true },
];

export function Footer() {
  const pathname = usePathname();
  // Standalone experiment routes render their own chrome — hide the site footer.
  if (pathname?.startsWith('/experiments')) return null;

  return (
    <footer className="border-t border-line py-[54px] font-mono text-[13px] leading-[1.6] text-ink-soft">
      <div className="mx-auto max-w-content px-7">
        <div className="flex flex-wrap justify-between gap-x-12 gap-y-8">
          {/* Brand + description */}
          <div className="max-w-xs">
            <p className="font-display text-base font-bold uppercase tracking-[.06em] text-ink">
              DIGITAL
            </p>
            <p className="mt-3">{siteConfig.description}</p>
          </div>

          {/* Quick links */}
          <div>
            <p className="uppercase tracking-[.16em] text-ink">Links</p>
            <ul className="mt-3 flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-200 hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="uppercase tracking-[.16em] text-ink">Contact</p>
            <ul className="mt-3 flex flex-col gap-2">
              <li>{siteConfig.contact.location}</li>
              <li>{siteConfig.contact.campus}</li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="transition-colors duration-200 hover:text-ink"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>{siteConfig.contact.meetingTime}</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="uppercase tracking-[.16em] text-ink">Connect</p>
            <div className="mt-3 flex gap-2">
              {socials.map(({ href, label, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="flex size-9 items-center justify-center rounded transition-colors duration-200 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                >
                  <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Legal links + Copyright readout */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <span>© {new Date().getFullYear()} DIGITAL @ Cal Poly Pomona</span>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/privacy" className="transition-colors duration-200 hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors duration-200 hover:text-ink">
              Terms
            </Link>
            <Link href="/cookies" className="transition-colors duration-200 hover:text-ink">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
