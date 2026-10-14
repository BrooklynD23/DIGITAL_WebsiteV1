/* Self-check for shades-concept-x/pathmin.ts against every path in a saved page:
   node --import ./ts-hooks.mjs pathmin.check.mjs <page.html>
   eps 0 must round-trip exactly; eps 0.15 must keep every original point within 0.15 of the output. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { minPath } from '../../../../../app/(apple)/projects/shades-concept-x/pathmin.ts';

const decode = (d) => {
  const subs = [];
  const tok = d.match(/[mz]|-?(?:\d+\.?\d*|\.\d+)/g);
  let cur = [0, 0], start = [0, 0], sub = null;
  for (let i = 0; i < tok.length; ) {
    if (tok[i] === 'z') { sub.closed = true; cur = start; i++; continue; }
    if (tok[i] === 'm') { i++; cur = [cur[0] + +tok[i], cur[1] + +tok[i + 1]]; start = cur; sub = { pts: [cur], closed: false }; subs.push(sub); i += 2; continue; }
    cur = [cur[0] + +tok[i], cur[1] + +tok[i + 1]]; sub.pts.push(cur); i += 2;
  }
  return subs;
};
const absSubs = (d) => {
  const subs = [];
  const tok = d.match(/[MLZ]|-?(?:\d+\.?\d*|\.\d+)/g);
  for (let i = 0; i < tok.length; ) {
    if (tok[i] === 'Z') { subs[subs.length - 1].closed = true; i++; continue; }
    if (tok[i] === 'M') { subs.push({ pts: [], closed: false }); i++; continue; }
    if (tok[i] === 'L') { i++; continue; }
    subs[subs.length - 1].pts.push([+tok[i], +tok[i + 1]]); i += 2;
  }
  return subs;
};
const segDist = ([px, py], [ax, ay], [bx, by]) => {
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
  const t = l2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2)) : 0;
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
};

assert.equal(minPath('M1 2L3 4L3 4Z'), 'm1 2 2 2z');
assert.equal(minPath('M10.5 0L10 -0.5'), 'm10.5 0-.5-.5');
assert.equal(minPath('M0 0L1 0L2 0L3 0', 0.15), 'm0 0 3 0');
assert.equal(minPath('Q1 2 3 4'), 'Q1 2 3 4');

const html = readFileSync(process.argv[2], 'utf8');
const ds = [...html.matchAll(/ d="(M[^"]*)"/g)].map((m) => m[1]).filter((d) => /^[MLZ0-9 .-]+$/.test(d));
let worst = 0;
for (const d of ds) {
  const a = absSubs(d);
  const exact = decode(minPath(d));
  assert.equal(exact.length, a.length);
  exact.forEach((s, i) => {
    const dedup = a[i].pts.filter((p, j) => j === 0 || p[0] !== a[i].pts[j - 1][0] || p[1] !== a[i].pts[j - 1][1]);
    assert.equal(s.closed, a[i].closed);
    assert.equal(s.pts.length, dedup.length, d);
    s.pts.forEach((p, j) => assert.ok(Math.hypot(p[0] - dedup[j][0], p[1] - dedup[j][1]) < 1e-6, d));
  });
  decode(minPath(d, 0.15)).forEach((s, i) => {
    for (const p of a[i].pts) {
      let best = s.pts.length === 1 ? Math.hypot(p[0] - s.pts[0][0], p[1] - s.pts[0][1]) : Infinity;
      for (let j = 1; j < s.pts.length; j++) best = Math.min(best, segDist(p, s.pts[j - 1], s.pts[j]));
      worst = Math.max(worst, best);
    }
  });
}
assert.ok(worst <= 0.15 + 1e-6, `worst deviation ${worst}`);
console.log(`pathmin ok: ${ds.length} paths, exact at eps 0, worst deviation ${worst.toFixed(3)} at eps 0.15`);
