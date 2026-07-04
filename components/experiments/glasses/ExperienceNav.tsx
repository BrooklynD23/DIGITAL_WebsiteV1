'use client';

/**
 * Floating pill nav for the smart-glasses experiment — Mana-style: rounded pill, thin
 * borders, hover scale + color invert. Items + CTA come from GLASSES_CONTENT.
 */

import { motion } from 'framer-motion';
import type { GlassesContent } from '@/lib/data/experiments/glasses';

interface ExperienceNavProps {
  nav: GlassesContent['nav'];
  cta: GlassesContent['cta'];
  onNavigate: (href: string) => void;
}

export default function ExperienceNav({ nav, cta, onNavigate }: ExperienceNavProps) {
  return (
    <nav className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-black/80 bg-white/70 p-1.5 backdrop-blur-md">
        <span className="px-3 font-display text-sm font-extrabold uppercase tracking-tight text-black">
          DIGITAL
        </span>
        {nav.map((item) => (
          <motion.button
            key={item.href}
            type="button"
            onClick={() => onNavigate(item.href)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="rounded-full border border-transparent px-4 py-1.5 font-display text-sm font-bold uppercase tracking-tight text-black transition-colors hover:border-black/80 hover:bg-black hover:text-white"
          >
            {item.label}
          </motion.button>
        ))}
        <motion.button
          type="button"
          onClick={() => onNavigate(cta.href)}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className="ml-1 rounded-full bg-black px-4 py-1.5 font-display text-sm font-bold uppercase tracking-tight text-white transition-colors hover:bg-[#d8412f]"
        >
          {cta.label}
        </motion.button>
      </div>
    </nav>
  );
}
