/**
 * Build-time read of Updates posts from Supabase `public.digital_posts` (PLAN: design-lab/proposals/2026-11-12-supabase-updates/).
 * Env SUPABASE_URL + SUPABASE_PUBLISHABLE_KEY (build only, never NEXT_PUBLIC_). No SUPABASE_URL → the UPDATES snapshot.
 * Any bad row, failed fetch, missing media file or zero published site posts throws, so the build fails and
 * Vercel keeps the last good deploy live. Media files are downloaded first by scripts/fetch-update-assets.mjs.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { UPDATES, UPDATE_TAGS, UPDATE_TEAMS, UPDATE_TYPES } from './updates.ts';
import type { TagSlug, Update, UpdatePage } from './updates.ts';

/** Per-build fetch cache key: Vercel restores .next/cache between builds, so a fixed key would serve stale rows. */
const BUILD_ID = process.env.VERCEL_DEPLOYMENT_ID ?? String(Date.now());
const MEDIA = '/updates/media/';
const TAG_SLUGS = UPDATE_TAGS.map((t) => t.slug);

type Row = Readonly<Record<string, unknown>>;

const fail = (row: Row, field: string): never => {
  throw new Error(`[updates] Supabase row "${String(row.slug)}": invalid ${field}`);
};
const str = (r: Row, k: string): string => (typeof r[k] === 'string' && r[k] !== '' ? (r[k] as string) : fail(r, k));
const optStr = (r: Row, k: string): string | undefined => (r[k] == null ? undefined : str(r, k));
const strs = (r: Row, k: string): readonly string[] =>
  Array.isArray(r[k]) && (r[k] as unknown[]).every((v) => typeof v === 'string' && v !== '') ? (r[k] as string[]) : fail(r, k);
const oneOf = <T extends string>(r: Row, k: string, list: readonly T[]): T =>
  list.includes(r[k] as T) ? (r[k] as T) : fail(r, k);

/** body: blank line = paragraph, "## " = section heading, "- " lines = the flow list. Paragraphs join with "\n\n". */
export function parseBody(body: string): UpdatePage['sections'] {
  const sections: { heading: string; paras: string[]; flow: string[] }[] = [];
  for (const block of body.replace(/\r\n/g, '\n').split(/\n\s*\n/)) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines[0]?.startsWith('## ')) sections.push({ heading: lines.shift()!.slice(3).trim(), paras: [], flow: [] });
    if (!lines.length) continue;
    const cur = sections.at(-1);
    if (!cur) throw new Error('[updates] body must start with a "## " heading');
    if (lines.every((l) => l.startsWith('- '))) cur.flow.push(...lines.map((l) => l.slice(2).trim()));
    else cur.paras.push(lines.join(' '));
  }
  // ponytail: flow renders after the section's paragraphs; one flow list per section.
  return sections.map((s) => ({ heading: s.heading, body: s.paras.join('\n\n'), ...(s.flow.length ? { flow: s.flow } : {}) }));
}

export function toUpdate(r: Row): Update {
  const publishedAt = str(r, 'published_at');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) fail(r, 'published_at');
  const coverSrc = optStr(r, 'cover_src');
  const pdfSrc = optStr(r, 'pdf_src');
  const externalUrl = optStr(r, 'external_url');
  if (externalUrl && !externalUrl.startsWith('https://')) fail(r, 'external_url');
  const base = {
    slug: str(r, 'slug'),
    title: str(r, 'title'),
    type: oneOf(r, 'type', UPDATE_TYPES),
    subTeam: oneOf(r, 'sub_team', UPDATE_TEAMS),
    detail: optStr(r, 'detail'),
    tags: strs(r, 'tags').map((t) => (TAG_SLUGS.includes(t as TagSlug) ? (t as TagSlug) : fail(r, `tag "${t}"`))),
    publishedAt,
    summary: str(r, 'summary'),
    authors: strs(r, 'authors'),
    mentors: strs(r, 'mentors'),
    lead: optStr(r, 'lead'),
    coverImage: coverSrc ? { src: MEDIA + coverSrc, alt: str(r, 'cover_alt') } : undefined,
    pdf: pdfSrc ? { src: MEDIA + pdfSrc, title: str(r, 'pdf_title') } : undefined,
  };
  const source = oneOf(r, 'source', ['site', 'linkedin'] as const);
  if (source === 'linkedin') return { ...base, source, externalUrl: externalUrl ?? fail(r, 'external_url (required for linkedin)') };
  return { ...base, source, externalUrl, page: { dek: str(r, 'dek'), sections: parseBody(str(r, 'body')) } };
}

export async function getUpdates(): Promise<readonly Update[]> {
  const url = process.env.SUPABASE_URL;
  if (!url) return UPDATES;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!key) throw new Error('[updates] SUPABASE_URL is set but SUPABASE_PUBLISHABLE_KEY is missing');
  const res = await fetch(`${url}/rest/v1/digital_posts?select=*&order=published_at.desc`, {
    headers: { apikey: key, 'x-build': BUILD_ID },
  }).catch((e: unknown) => {
    throw new Error(`[updates] Supabase fetch failed: ${String(e)}`, { cause: e });
  });
  if (!res.ok) throw new Error(`[updates] Supabase fetch failed: HTTP ${res.status} ${await res.text()}`);
  const rows: unknown = await res.json();
  if (!Array.isArray(rows)) throw new Error('[updates] Supabase returned a non-array body');
  const updates = (rows as Row[]).map(toUpdate);
  if (!updates.some((u) => u.source === 'site')) throw new Error('[updates] at least one published site post required');
  for (const src of updates.flatMap((u) => [u.coverImage?.src, u.pdf?.src])) {
    if (src && !existsSync(join(process.cwd(), 'public', src))) {
      throw new Error(`[updates] media file ${src} missing: did scripts/fetch-update-assets.mjs run (npm run build)?`);
    }
  }
  // stdout, not console: next.config removeConsole strips console.* from production bundles.
  process.stdout.write(`[updates] ${updates.length} posts from Supabase\n`);
  return updates;
}
