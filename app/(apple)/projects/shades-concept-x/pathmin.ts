/**
 * Variation B: shortens the figure's path data (the kit emits only M, L and Z, rounded to 0.1).
 * 1. Drops repeated points, then points within `eps` of the simplified line (Douglas-Peucker), so low-detail
 *    curves keep fewer samples. eps 0 keeps every distinct point (used for the optics and rims).
 * 2. Writes relative commands on the input's own grid (0.1, 0.01 or 0.001) with implicit repeats: `m` start,
 *    deltas, `z`. Lossless at eps 0.
 * Anything it does not recognise is returned unchanged.
 */
type Pt = readonly [number, number];
interface Sub {
  pts: Pt[];
  closed: boolean;
}

const TOKEN = /[MLZmlz]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g;
function parse(d: string, scale: number): Sub[] | null {
  const tokens = d.match(TOKEN);
  if (!tokens || tokens.join('').length !== d.replace(/[\s,]/g, '').length) return null;
  const subs: Sub[] = [];
  let cmd = '';
  for (let i = 0; i < tokens.length; ) {
    const t = tokens[i];
    if (t === 'Z' || t === 'z') {
      const last = subs[subs.length - 1];
      if (!last) return null;
      last.closed = true;
      cmd = 'Z';
      i++;
      continue;
    }
    if (t === 'M' || t === 'L') {
      cmd = t;
      i++;
      continue;
    }
    if (/[a-z]/i.test(t)) return null; /* relative or other commands: leave the path alone */
    if (cmd === 'Z' || cmd === '') return null;
    const x = Number(t);
    const y = Number(tokens[i + 1]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    const p: Pt = [Math.round(x * scale), Math.round(y * scale)];
    if (cmd === 'M') {
      subs.push({ pts: [p], closed: false });
      cmd = 'L';
    } else subs[subs.length - 1].pts.push(p);
    i += 2;
  }
  return subs;
}

/** Douglas-Peucker on grid integers; `eps` in grid units. */
function simplify(pts: Pt[], eps: number): Pt[] {
  const uniq = pts.filter((p, i) => i === 0 || p[0] !== pts[i - 1][0] || p[1] !== pts[i - 1][1]);
  if (eps <= 0 || uniq.length < 3) return uniq;
  const keep = new Uint8Array(uniq.length);
  keep[0] = keep[uniq.length - 1] = 1;
  const stack: [number, number][] = [[0, uniq.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    const [ax, ay] = uniq[a];
    const [bx, by] = uniq[b];
    const [dx, dy] = [bx - ax, by - ay];
    const l2 = dx * dx + dy * dy;
    let worst = -1;
    let at = -1;
    for (let i = a + 1; i < b; i++) {
      /* Distance to the segment, not the infinite line, so thin tips past an end are kept. */
      const [px, py] = uniq[i];
      const t = l2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2)) : 0;
      const dist = Math.hypot(px - ax - t * dx, py - ay - t * dy);
      if (dist > worst) (worst = dist), (at = i);
    }
    if (worst > eps) {
      keep[at] = 1;
      stack.push([a, at], [at, b]);
    }
  }
  return uniq.filter((_, i) => keep[i]);
}

const num = (t: number, scale: number) => {
  const s = (Math.abs(t) / scale).toString().replace(/^0\./, '.');
  return t < 0 ? `-${s}` : s;
};
/** Numbers need a separator unless the next one starts with '-', or both are fractions and the next starts with '.'. */
function joinNums(nums: number[], scale: number): string {
  let out = '';
  let prev = '';
  for (const n of nums) {
    const s = num(n, scale);
    if (prev && !s.startsWith('-') && !(s.startsWith('.') && prev.includes('.'))) out += ' ';
    out += s;
    prev = s;
  }
  return out;
}

export function minPath(d: string, eps = 0): string {
  /* The grid: the finest decimal place the input uses (the kit writes 0.1; a few helpers write 0.01). */
  const places = Math.max(0, ...(d.match(/\.\d+/g) ?? []).map((f) => f.length - 1));
  if (places > 3 || /e/i.test(d)) return d;
  const scale = 10 ** places;
  const subs = parse(d, scale);
  if (!subs || !subs.length) return d;
  let out = '';
  let cur: Pt = [0, 0];
  for (const sub of subs) {
    const pts = simplify(sub.pts, eps * scale);
    const nums: number[] = [];
    let last = cur;
    for (const p of pts) {
      nums.push(p[0] - last[0], p[1] - last[1]);
      last = p;
    }
    out += `m${joinNums(nums, scale)}${sub.closed ? 'z' : ''}`;
    cur = sub.closed ? pts[0] : last;
  }
  return out;
}

/** Rewrites every d="…" in a piece's markup. */
export const minSvg = (svg: string, eps = 0) => svg.replace(/ d="([^"]*)"/g, (_, d: string) => ` d="${minPath(d, eps)}"`);
