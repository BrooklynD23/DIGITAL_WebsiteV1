import Link from 'next/link';
import { siteConfig } from '@/lib/data/siteConfig';

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b1117] py-12 px-4 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="size-6 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">memory</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">DIGITAL</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-body max-w-xs mb-6">
            {siteConfig.description}
          </p>
          <div className="flex gap-4">
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <span className="material-symbols-outlined">public</span>
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-slate-400 hover:text-primary transition-colors"
              aria-label="Email"
            >
              <span className="material-symbols-outlined">alternate_email</span>
            </a>
            <a
              href={siteConfig.social.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-primary transition-colors"
              aria-label="Discord"
            >
              <span className="material-symbols-outlined">group</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold mb-4 text-sm uppercase tracking-wider">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-slate-400 font-body">
            <li>
              <Link href="/projects" className="hover:text-primary transition-colors">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/team" className="hover:text-primary transition-colors">
                Team
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold mb-4 text-sm uppercase tracking-wider">
            Contact
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-slate-400 font-body">
            <li>{siteConfig.contact.location}</li>
            <li>{siteConfig.contact.campus}</li>
            <li>{siteConfig.contact.email}</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center md:text-left">
        <p className="text-slate-600 dark:text-slate-500 text-xs font-body">
          © {new Date().getFullYear()} DIGITAL Engineering Club. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
