// prebuild: download the media (cover_src / pdf_src) of published Updates posts from the Supabase bucket
// `digital-updates` into public/updates/media/<path> (gitignored), so the site serves them itself (CSP img-src 'self').
// No SUPABASE_URL → no-op (the snapshot has no Supabase media). Any failure → exit 1 and the build stops.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const { SUPABASE_URL: url, SUPABASE_PUBLISHABLE_KEY: key } = process.env;
const PATH = /^[a-z0-9-]+\/[a-z0-9-]+\.(jpg|png|webp|pdf)$/; // same CHECK as the DB; blocks ../ traversal

async function main() {
  if (!url) return console.info('[updates] SUPABASE_URL unset: no media to fetch');
  if (!key) throw new Error('SUPABASE_URL is set but SUPABASE_PUBLISHABLE_KEY is missing');
  const res = await fetch(`${url}/rest/v1/digital_posts?select=cover_src,pdf_src`, { headers: { apikey: key } });
  if (!res.ok) throw new Error(`rows: HTTP ${res.status} ${await res.text()}`);
  const paths = (await res.json()).flatMap((r) => [r.cover_src, r.pdf_src]).filter(Boolean);
  for (const p of paths) {
    if (!PATH.test(p)) throw new Error(`invalid media path "${p}"`);
    const file = await fetch(`${url}/storage/v1/object/public/digital-updates/${p}`);
    if (!file.ok) throw new Error(`download ${p}: HTTP ${file.status}`);
    const out = join('public', 'updates', 'media', p);
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, Buffer.from(await file.arrayBuffer()));
  }
  console.info(`[updates] ${paths.length} media files fetched from Supabase`);
}

main().catch((e) => {
  console.error(`[updates] media fetch failed: ${e.message}`);
  process.exit(1);
});
