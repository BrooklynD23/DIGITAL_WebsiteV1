'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isImmersiveRoute } from '@/lib/immersiveRoutes';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { primaryNavLinks, type SiteLink } from '@/lib/data/siteLinks';

export const NAVBAR_HEIGHT = 72;

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

const linkBase =
  'font-homeMono text-[10.5px] tracking-[.1em] text-dg-muted hover:text-dg-ink';

function NavLinkItem({ link, active }: { link: SiteLink; active: boolean }) {
  return (
    <Link
      href={link.href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative pb-[3px] pt-[3px] transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green',
        linkBase,
        active &&
          'text-dg-ink after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-dg-line-strong'
      )}
    >
      {link.label}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Escape closes the sheet; focus returns to the toggle.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  // Focus trap while the sheet is open.
  useEffect(() => {
    if (!mobileMenuOpen || !sheetRef.current) return;
    const sheet = sheetRef.current;
    const focusables = sheet.querySelectorAll<HTMLElement>('a[href], button');
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusables.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    sheet.addEventListener('keydown', trap);
    first?.focus();
    return () => sheet.removeEventListener('keydown', trap);
  }, [mobileMenuOpen]);

  // Immersive routes render their own chrome — hide the site nav.
  if (isImmersiveRoute(pathname)) return null;

  const links = [{ label: 'Home', href: '/' }, ...primaryNavLinks];

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 border-b border-dg-line-soft bg-dg-nav-bg px-[var(--dg-gutter)] py-[10px] backdrop-blur-[10px]"
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        <Link
          href="/"
          className="flex items-center gap-[10px] justify-self-start hover:opacity-80"
        >
          <BrandLogo size={22} />
          <span className="font-homeMono text-[13px] font-medium tracking-[.12em] text-dg-ink">
            DIGITAL
          </span>
        </Link>

        {/* Desktop links — single-line mono items, switch at 820px */}
        <div className="hidden items-center gap-[26px] nav:flex">
          {links.map((link) => (
            <NavLinkItem
              key={link.href}
              link={link}
              active={isActiveRoute(pathname, link.href)}
            />
          ))}
        </div>

        <div className="flex justify-self-end">
          <Link
            href="/contact"
            className="hidden rounded-cta border border-dg-line-hover px-4 py-[7px] font-homeMono text-[10px] tracking-[.12em] text-dg-ink transition-colors duration-200 hover:bg-dg-ink hover:text-dg-bg nav:inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green"
          >
            Talk to us
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className={cn(
              'flex size-9 items-center justify-center rounded-cta text-dg-ink nav:hidden',
              'transition-colors duration-200 hover:bg-dg-card',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-dg-green'
            )}
          >
            {mobileMenuOpen ? (
              <X size={18} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Menu size={18} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile sheet — unmounted when closed, so it can never be tabbed into */}
      {mobileMenuOpen ? (
        <div
          ref={sheetRef}
          className="absolute inset-x-[var(--dg-gutter)] top-[calc(100%+8px)] overflow-hidden rounded-card border border-dg-line-soft bg-dg-card shadow-none"
        >
          <ul className="flex flex-col p-2">
            {links.map((link) => {
              const active = isActiveRoute(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center justify-between rounded px-4 py-3 font-homeMono text-[11px] tracking-[.12em]',
                      'transition-colors duration-200',
                      active ? 'bg-dg-bg text-dg-ink' : 'text-dg-muted hover:bg-dg-bg'
                    )}
                  >
                    {link.label}
                    <span aria-hidden="true" className="text-dg-ink-50">
                      {active ? '●' : '·'}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
