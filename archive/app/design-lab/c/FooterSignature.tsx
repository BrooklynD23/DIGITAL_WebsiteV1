'use client';

/**
 * Concept C — the footer remembers the hero signature, drawn in the same dots
 * (line + name from geometry.ts; no WebGL). Unsigned, the line stays blank.
 */
import { useEffect, useMemo, useState } from 'react';
import styles from './c.module.css';
import { SIGNATURE_VIEWBOX_BLANK, dotPath, signatureDots } from './geometry';
import { nameToPoints } from './textPoints';
import { useSignature } from './signStore';

const SIGN_FONT = '"Clash Display", "General Sans", sans-serif';

interface Props {
  readonly blankTitle: string;
  readonly blankSub: string;
  readonly signedTitle: string;
  readonly signedSub: string;
}

export default function FooterSignature({ blankTitle, blankSub, signedTitle, signedSub }: Props) {
  const name = useSignature().trim();
  const [points, setPoints] = useState<Float32Array | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!name) {
      setPoints(null);
      return;
    }
    (async () => {
      try {
        await document.fonts?.load(`600 200px ${SIGN_FONT}`);
      } catch {
        /* use whatever face is ready */
      }
      if (!cancelled) setPoints(nameToPoints(name, SIGN_FONT));
    })();
    return () => {
      cancelled = true;
    };
  }, [name]);

  const { d, box } = useMemo(() => {
    const cloud = signatureDots(points);
    let minY = Infinity;
    for (let i = 1; i < cloud.length; i += 3) minY = Math.min(minY, cloud[i]);
    let maxY = -Infinity;
    for (let i = 1; i < cloud.length; i += 3) maxY = Math.max(maxY, cloud[i]);
    // SVG y is flipped world y; pad 0.04 around the drawn band
    const top = -maxY - 0.04;
    const h = maxY - minY + 0.08;
    return { d: dotPath(cloud, undefined, 2), box: `-1.06 ${top.toFixed(3)} 2.12 ${h.toFixed(3)}` };
  }, [points]);
  const signed = Boolean(name && points);

  return (
    <div className={styles.footSign}>
      <p className={styles.close}>{signed ? signedTitle : blankTitle}</p>
      <svg
        className={styles.footSignArt}
        viewBox={signed ? box : SIGNATURE_VIEWBOX_BLANK}
        role="img"
        aria-label={signed ? `Signature line signed: ${name}` : 'A blank signature line'}
        preserveAspectRatio="xMidYMid meet"
      >
        <path d={d} />
      </svg>
      <p className={styles.footSignSub} aria-live="polite">
        {signed ? signedSub : blankSub}
      </p>
    </div>
  );
}
