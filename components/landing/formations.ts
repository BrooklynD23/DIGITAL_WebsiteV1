/**
 * Precomputed block-target formations for the Modules landing.
 * Every formation returns BLOCK_COUNT xyz triplets in world units
 * (scene is framed for roughly x ∈ [-3.4, 3.4], y ∈ [-2, 2.2]).
 */

export const BLOCK_COUNT = 300;
export type Formation = Float32Array;

function make(
  count: number,
  fill: (i: number, set: (x: number, y: number, z: number) => void) => void
): Formation {
  const a = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    fill(i, (x, y, z) => {
      a[i * 3] = x; a[i * 3 + 1] = y; a[i * 3 + 2] = z;
    });
  }
  return a;
}

/** Deterministic pseudo-random (no Math.random → stable between renders). */
function prand(i: number, salt: number): number {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function sphere(count: number, r = 5): Formation {
  return make(count, (i, set) => {
    const t = prand(i, 1) * Math.PI * 2;
    const p = Math.acos(2 * prand(i, 2) - 1);
    const rr = r * (0.7 + 0.3 * prand(i, 3));
    set(rr * Math.sin(p) * Math.cos(t), rr * Math.sin(p) * Math.sin(t), rr * Math.cos(p) - 2);
  });
}

export function compass(count: number): Formation {
  return make(count, (i, set) => {
    if (i % 5 === 0) {
      const spoke = Math.floor(i / 5) % 8;
      const ang = (spoke / 8) * Math.PI * 2;
      const d = 0.5 + prand(i, 4) * 1.6;
      set(Math.cos(ang) * d, Math.sin(ang) * d, 0);
    } else {
      const ang = prand(i, 5) * Math.PI * 2;
      const ring = 1.9 + 0.12 * (i % 3);
      set(Math.cos(ang) * ring, Math.sin(ang) * ring, (prand(i, 6) - 0.5) * 0.4);
    }
  });
}

export function blueprintGrid(count: number): Formation {
  const cols = 20;
  return make(count, (i, set) => {
    const cx = (i % cols) - cols / 2 + 0.5;
    const cy = Math.floor(i / cols) - count / cols / 2 + 0.5;
    set(cx * 0.32, cy * 0.32, (prand(i, 7) - 0.5) * 0.15);
  });
}

export function stack(count: number): Formation {
  const towers = 7;
  return make(count, (i, set) => {
    const t = i % towers;
    const level = Math.floor(i / towers);
    set(
      (t - (towers - 1) / 2) * 0.85 + (prand(i, 8) - 0.5) * 0.1,
      -1.6 + level * 0.22,
      (prand(i, 9) - 0.5) * 0.5
    );
  });
}

export function wave(count: number): Formation {
  const cols = 30;
  return make(count, (i, set) => {
    const cx = (i % cols) / cols;
    const row = Math.floor(i / cols);
    set((cx - 0.5) * 6.4, Math.sin(cx * Math.PI * 3) * 0.9 + (row - 5) * 0.16, (prand(i, 10) - 0.5) * 0.3);
  });
}

/** Modular phone: a 4×8×2 module lattice standing at x = -1.6. */
export function phoneSlab(count: number): Formation {
  return make(count, (i, set) => {
    const idx = i % 64;
    const col = idx % 4;
    const row = Math.floor(idx / 4) % 8;
    const layer = Math.floor(idx / 32);
    if (i < 64) set(-1.6 + (col - 1.5) * 0.3, (row - 3.5) * 0.42, (layer - 0.5) * 0.3);
    else set((prand(i, 11) - 0.5) * 7, -2.1, -1.5 - prand(i, 12) * 3); // dim floor scatter
  });
}

export function pedestals(count: number): Formation {
  return make(count, (i, set) => {
    const side = i % 2 === 0 ? -1.6 : 1.6;
    const idx = Math.floor(i / 2) % 24;
    const col = idx % 6;
    const row = Math.floor(idx / 6);
    if (i < 96) set(side + (col - 2.5) * 0.3, -1.9 + row * 0.16, (prand(i, 13) - 0.5) * 0.6);
    else set((prand(i, 14) - 0.5) * 8, -2.2, -2 - prand(i, 15) * 3);
  });
}

/**
 * Sample the logo mark from the PNG's alpha channel. The file contains the
 * square circuit-mark on top and a wordmark below; take only pixels in the
 * upper 55% of the opaque bounding box (the mark).
 */
export function logoFromImage(url: string, count: number): Promise<Formation> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const S = 110;
      const cv = document.createElement('canvas');
      cv.width = S; cv.height = S;
      const ctx = cv.getContext('2d');
      if (!ctx) return reject(new Error('2d context unavailable'));
      ctx.drawImage(img, 0, 0, S, S);
      const data = ctx.getImageData(0, 0, S, S).data;
      let minY = S, maxY = 0;
      for (let y = 0; y < S; y++)
        for (let x = 0; x < S; x++)
          if (data[(y * S + x) * 4 + 3] > 100) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
      const cutY = minY + (maxY - minY) * 0.55;
      const pts: Array<[number, number]> = [];
      for (let y = 0; y < S; y++)
        for (let x = 0; x < S; x++)
          if (data[(y * S + x) * 4 + 3] > 100 && y < cutY) pts.push([x, y]);
      if (pts.length === 0) return reject(new Error('no opaque pixels found'));
      const a = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const [px, py] = pts[Math.floor(prand(i, 16) * pts.length)];
        a[i * 3] = (px / S - 0.5) * 4.4;
        a[i * 3 + 1] = (0.5 - py / S) * 4.4 + 0.4;
        a[i * 3 + 2] = (prand(i, 17) - 0.5) * 0.25;
      }
      resolve(a);
    };
    img.onerror = () => reject(new Error(`logo image failed: ${url}`));
    img.src = url;
  });
}
