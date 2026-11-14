// Run: npm run test:updates  (node --experimental-strip-types --test lib/data/updates-source.test.ts)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getUpdates, parseBody, toUpdate } from './updates-source.ts';
import { UPDATES } from './updates.ts';

const VESSEL_BODY = `## What VESSEL is

VESSEL is a TWINS project.

- Material recovery
- Processing
- Annealing
- Fabrication
- Finishing
- Inspection
- Packaging
- Warehouse

## The engineering goal

Turn each stage into a simulation.

## Why it is different

Most projects study these separately.`;

const row = {
  slug: 'vessel-product-definition', title: 'Product definition: VESSEL', type: 'product-definition', sub_team: 'TWINS',
  detail: null, tags: ['digital'], published_at: '2026-09-30', summary: 'A virtual factory.', authors: ['Oscar Cao'],
  mentors: [], lead: null, cover_src: null, cover_alt: null, pdf_src: null, pdf_title: null, source: 'site',
  external_url: 'https://www.linkedin.com/posts/x', dek: 'A virtual factory.', body: VESSEL_BODY, status: 'published',
};

test('valid site row maps snake to camel', () => {
  const u = toUpdate(row);
  assert.equal(u.subTeam, 'TWINS');
  assert.equal(u.publishedAt, '2026-09-30');
  assert.deepEqual(u.tags, ['digital']);
  assert.ok(u.source === 'site' && u.page.dek === 'A virtual factory.');
});

test('linkedin row without external_url throws', () => {
  assert.throws(() => toUpdate({ ...row, source: 'linkedin', external_url: null }), /external_url/);
});

test('unknown tag throws', () => {
  assert.throws(() => toUpdate({ ...row, tags: ['nope'] }), /tag "nope"/);
});

test('body parses into the VESSEL sections', () => {
  const s = parseBody(VESSEL_BODY);
  assert.deepEqual(s.map((x) => x.heading), ['What VESSEL is', 'The engineering goal', 'Why it is different']);
  assert.equal(s[0].body, 'VESSEL is a TWINS project.');
  assert.equal(s[0].flow?.length, 8);
  assert.equal(s[1].flow, undefined);
  assert.equal(parseBody('## A\n\nOne.\n\nTwo.')[0].body, 'One.\n\nTwo.');
});

test('no env returns the UPDATES snapshot', async () => {
  delete process.env.SUPABASE_URL;
  assert.equal(await getUpdates(), UPDATES);
});

test('env set: fetches with apikey only and maps rows', async () => {
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_PUBLISHABLE_KEY = 'k';
  const real = globalThis.fetch;
  let headers: Record<string, string> = {};
  globalThis.fetch = (async (_: unknown, init?: RequestInit) => {
    headers = init?.headers as Record<string, string>;
    return new Response(JSON.stringify([row]));
  }) as typeof fetch;
  try {
    const got = await getUpdates();
    assert.equal(got.length, 1);
    assert.equal(headers.apikey, 'k');
    assert.equal(headers.Authorization, undefined);
    assert.ok(headers['x-build']);
    globalThis.fetch = (async () => new Response('[]')) as typeof fetch;
    await assert.rejects(getUpdates(), /at least one published site post/);
  } finally {
    globalThis.fetch = real;
    delete process.env.SUPABASE_URL;
  }
});
