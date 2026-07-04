'use client';

/**
 * Whimsical floating vector decor around the hero glasses (Mana-style floral/lifestyle
 * overlays, here tech-flavored: sparkles, signal arcs, app dots). Each item has its own
 * independent float loop + hover spring, and the whole set scales/fades out as the user
 * scrolls into the transition (driven by scrollYProgress).
 */

import { motion, useTransform, type MotionValue } from 'framer-motion';

interface DecorItem {
  id: string;
  left: string;
  top: string;
  size: number;
  color: string;
  shape: 'spark' | 'arc' | 'dots' | 'leaf';
  dur: number;
  delay: number;
  range: number;
}

const ITEMS: DecorItem[] = [
  { id: 'a', left: '16%', top: '26%', size: 78, color: '#16161a', shape: 'spark', dur: 5.5, delay: 0, range: 22 },
  { id: 'b', left: '78%', top: '22%', size: 66, color: '#d8412f', shape: 'leaf', dur: 6.2, delay: 0.6, range: 18 },
  { id: 'c', left: '24%', top: '68%', size: 70, color: '#e3b341', shape: 'arc', dur: 5.0, delay: 0.3, range: 26 },
  { id: 'd', left: '82%', top: '64%', size: 60, color: '#16161a', shape: 'dots', dur: 6.8, delay: 0.9, range: 20 },
  { id: 'e', left: '50%', top: '14%', size: 52, color: '#6f6654', shape: 'spark', dur: 5.8, delay: 0.45, range: 16 },
  { id: 'f', left: '60%', top: '78%', size: 58, color: '#d8412f', shape: 'dots', dur: 6.4, delay: 1.1, range: 24 },
];

function Shape({ shape, size, color }: { shape: DecorItem['shape']; size: number; color: string }) {
  const s = size;
  switch (shape) {
    case 'spark':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M12 0l2.4 8.2L22 12l-7.6 3.8L12 24l-2.4-8.2L2 12l7.6-3.8L12 0z" fill="none" stroke={color} strokeWidth="1.3" />
        </svg>
      );
    case 'leaf':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M21 3C9 3 3 9 3 21c12 0 18-6 18-18z" fill="none" stroke={color} strokeWidth="1.3" />
          <path d="M7 17C11 13 14 10 18 6" stroke={color} strokeWidth="1" />
        </svg>
      );
    case 'arc':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M3 18a9 9 0 0118 0" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="12" cy="18" r="2.2" fill="none" stroke={color} strokeWidth="1.3" />
        </svg>
      );
    case 'dots':
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          {[5, 12, 19].map((cx) =>
            [6, 13, 20].map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.4" fill="none" stroke={color} strokeWidth="1.2" />)
          )}
        </svg>
      );
  }
}

export default function FloatingDecor({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0, 0.16, 0.32], [1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.18, 0.34], [1, 1, 0.2]);

  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0 z-10" aria-hidden>
      {ITEMS.map((it) => (
        <motion.div
          key={it.id}
          className="pointer-events-auto absolute"
          style={{ left: it.left, top: it.top }}
          animate={{ y: [0, -it.range, 0], rotate: [0, 6, 0] }}
          transition={{ duration: it.dur, delay: it.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div whileHover={{ scale: 1.25, rotate: 12 }} transition={{ type: 'spring', stiffness: 300, damping: 12 }}>
            <Shape shape={it.shape} size={it.size} color={it.color} />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
