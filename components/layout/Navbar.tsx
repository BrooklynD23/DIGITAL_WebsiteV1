'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Layers3,
  Smartphone,
  Info,
  Users,
  UserPlus,
  Mail,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { isImmersiveRoute } from '@/lib/immersiveRoutes';
import { BrandLogo } from '@/components/layout/BrandLogo';

export const NAVBAR_HEIGHT = 72;

interface NavLink {
  href: string;
  label: string;
  sublabel: string;
  icon: LucideIcon;
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Home', sublabel: 'start & mission', icon: Home },
  { href: '/pillars', label: 'Pillars', sublabel: 'the framework', icon: Layers3 },
  { href: '/projects', label: 'Projects', sublabel: 'what we build', icon: Smartphone },
  { href: '/about', label: 'About', sublabel: 'who we are', icon: Info },
  { href: '/team', label: 'Team', sublabel: 'the people', icon: Users },
  { href: '/get-involved', label: 'Join', sublabel: 'get involved', icon: UserPlus },
  { href: '/contact', label: 'Contact', sublabel: 'reach us', icon: Mail },
];

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

const glassPill = cn(
  'border border-white/75 bg-[rgba(255,255,255,0.42)]',
  'shadow-pill backdrop-blur-[18px] backdrop-saturate-[1.45]',
  'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]',
  'before:bg-gradient-to-b before:from-white/50 before:to-transparent before:opacity-80'
);

function NavItem({
  link,
  active,
  onNavigate,
}: {
  link: NavLink;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = link.icon;

  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative flex items-center gap-2.5 rounded-full px-3 pb-[7px] pt-2 leading-none',
        'transition-all duration-200 ease-studio',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue',
        active
          ? cn(
              'bg-white/95 shadow-active',
              'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]',
              'after:p-[1px] after:[background:linear-gradient(135deg,rgba(28,108,255,.28),rgba(216,65,47,.22),rgba(255,255,255,.9))]',
              'after:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]',
              'after:[-webkit-mask-composite:xor] after:[mask-composite:exclude]'
            )
          : 'hover:bg-white/55'
      )}
    >
      <Icon
        size={15}
        strokeWidth={1.6}
        className={cn(
          'shrink-0',
          active ? 'text-accent' : 'text-ink-soft'
        )}
        aria-hidden
      />
      <span className="flex flex-col gap-[3px]">
        <span
          className={cn(
            'font-display text-[12px] font-bold uppercase tracking-[.06em]',
            active ? 'text-accent' : 'text-ink'
          )}
        >
          {link.label}
        </span>
        <span className="font-mono text-[10px] leading-none text-ink-soft">
          {link.sublabel}
        </span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Immersive routes render their own chrome — hide the site nav.
  if (isImmersiveRoute(pathname)) return null;

  return (
    <>
      {/* Floating glass pill — desktop (ione-style: icons + segmented bar) */}
      <nav
        aria-label="Primary"
        className={cn(
          'fixed left-1/2 top-[18px] z-50 hidden -translate-x-1/2 items-center gap-0 rounded-full p-[6px] lg:flex',
          'relative overflow-hidden',
          glassPill
        )}
      >
        {navLinks.map((link, index) => {
          const active = isActiveRoute(pathname, link.href);
          return (
            <div key={link.href} className="flex items-center">
              {index > 0 && (
                <span
                  className="mx-[2px] h-7 w-px shrink-0 bg-line/50"
                  aria-hidden
                />
              )}
              <NavItem link={link} active={active} />
            </div>
          );
        })}
      </nav>

      {/* Compact pill + sheet — mobile/tablet */}
      <div className="lg:hidden">
        <nav
          aria-label="Primary"
          className={cn(
            'fixed left-1/2 top-[18px] z-50 flex -translate-x-1/2 items-center gap-1 rounded-full p-[7px]',
            'relative overflow-hidden',
            glassPill
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full px-3 py-2 font-display text-[12px] font-bold uppercase tracking-[.06em] text-ink"
          >
            <BrandLogo size={22} />
            DIGITAL
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className={cn(
              'flex size-9 items-center justify-center rounded-full text-ink',
              'transition-colors duration-200 hover:bg-white/60',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue'
            )}
          >
            {mobileMenuOpen ? (
              <X size={18} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Menu size={18} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-ink/10 backdrop-blur-[2px]"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        <div
          className={cn(
            'fixed left-1/2 top-[74px] z-50 w-[min(92vw,360px)] -translate-x-1/2 overflow-hidden rounded-lg',
            glassPill,
            'transition-[opacity,transform] duration-200 ease-studio',
            mobileMenuOpen
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0'
          )}
        >
          <ul className="flex flex-col p-2">
            {navLinks.map((link) => {
              const active = isActiveRoute(pathname, link.href);
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded px-4 py-3',
                      'transition-colors duration-200',
                      active ? 'bg-white/95 shadow-active' : 'hover:bg-white/55'
                    )}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.6}
                      className={active ? 'text-accent' : 'text-ink-soft'}
                      aria-hidden
                    />
                    <span className="flex flex-1 items-baseline justify-between gap-3">
                      <span
                        className={cn(
                          'font-display text-[13px] font-bold uppercase tracking-[.06em]',
                          active ? 'text-accent' : 'text-ink'
                        )}
                      >
                        {link.label}
                      </span>
                      <span className="font-mono text-[10px] text-ink-soft">
                        {link.sublabel}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
