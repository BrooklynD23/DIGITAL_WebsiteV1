// Prints a compact digest of design-lab/renders/a11y/<slug>/results.json + axe-*.json for writing critiques.
import { readFileSync } from 'node:fs';
const slug = process.argv[2];
const dir = `design-lab/renders/a11y/${slug}`;
const r = JSON.parse(readFileSync(`${dir}/results.json`, 'utf8'));
for (const [vp, v] of Object.entries(r.viewports)) {
  const axe = JSON.parse(readFileSync(`${dir}/axe-${vp}.json`, 'utf8'));
  console.log(`\n## ${vp}  errs=${v.consoleErrors.length} scrollW=${v.scrollWidth}/${v.vw}`);
  for (const x of axe.violations) console.log(`  AXE ${x.impact} ${x.id} (${x.nodes}) ${x.help} :: ${x.targets.slice(0, 4).map((t) => t.target).join(' | ')}`);
  console.log(`  incomplete: ${v.axe.incomplete.join(', ')}`);
  if (v.overflowOffenders.length) console.log(`  overflow: ${JSON.stringify(v.overflowOffenders.slice(0, 5))}`);
  console.log(`  targets small ${v.targets.small} (non-inline ${v.targets.smallNonInline}) of ${v.targets.checked}: ${v.targets.list.slice(0, 10).map((t) => `${t.el} ${t.w}x${t.h}${t.inline ? ' inline' : ''}`).join(' ; ')}`);
  console.log(`  headings h1=${v.headings.h1} count=${v.headings.count} skips=${JSON.stringify(v.headings.skips)}`);
  console.log(`  images ${JSON.stringify(v.images)}`);
  console.log(`  fonts min=${v.fonts.min} p10=${v.fonts.p10} under12=${v.fonts.under12}: ${v.fonts.tinyList.slice(0, 6).map((t) => `${t.el}@${t.px}`).join(' ; ')}`);
  console.log(`  lines n=${v.lineLength.paragraphs} max=${v.lineLength.maxCpl} median=${v.lineLength.medianCpl} >80=${v.lineLength.over80}: ${v.lineLength.worst.slice(0, 2).map((w) => `${w.el} ${w.cpl}cpl`).join(' ; ')}`);
  console.log(`  contrast est fails: ${v.contrastProbe.estFails.map((c) => `${c.target} "${c.text}" ${c.ratio}<${c.need} @${c.px}px`).join(' ; ') || 'none'} (probed ${v.contrastProbe.probed})`);
  console.log(`  landmarks ${JSON.stringify(v.landmarks)}`);
  if (v.focus) {
    const bad = v.focus.filter((s) => s.visibleIndicator === false || s.inView === false);
    console.log(`  focus: ${v.focus.length} stops; no-ring/out-of-view: ${bad.map((s) => `${s.i}:${s.el} inView=${s.inView} vis=${s.visibleIndicator} d=${s.diffRatio}`).join(' ; ') || 'none'}`);
    console.log(`  focus order: ${v.focus.map((s) => `${s.i}:${(s.el || '').slice(0, 38)}`).join(' | ')}`);
  }
}
console.log(`\nreduced ${JSON.stringify(r.reducedMotion)}\nnojs ${JSON.stringify(r.noJs)}`);
