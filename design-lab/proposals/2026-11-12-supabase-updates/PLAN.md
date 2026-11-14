# Implementation Plan: Updates blog on Supabase

Status: APPROVED by the Head Designer 2026-11-12 (with the revisions and the images addendum at the end). Coloured tag chips approved by the Head Designer in chat, 2026-11-12.

Recommendation: posts live in Supabase and are read **at build time**. Editors use **Supabase Studio**. A **Supabase database webhook calls a Vercel deploy hook** to rebuild the site after each edit. A daily GitHub Action keeps the free project awake. Tags show as coloured chips on new `--r2-tag-*` tokens.

## Overview
- Today the 7 posts are hard-coded in `lib/data/updates.ts`. They move into one Supabase table, `public.posts`.
- The static export stays as it is: pages fetch the data when the site is built, so there is no server and no client-side fetch.
- Tags never show a "#". Each one is a coloured chip you can click, and the URL changes to `?tag=<slug>` so a filtered view can be shared.

## Requirements
1. All Updates posts are stored in Supabase, and members can add and edit them without a code change.
2. A daily GitHub Action keeps the free-tier project from being paused.
3. Posts carry tags (DIGITAL, SIDEKICK, SHADES, BRAIN, TWINS, DIGITAL Business), shown as coloured chips that filter the list.
4. Constraints: `output: 'export'` (no server runtime), RLS on every table, no secrets in source, only the anon key in reach of the browser, copy kept in data files, and every new hue logged as an exception.

## Decisions

### 1. Read path: build-time fetch (chosen)
| | Build-time fetch (chosen) | Client fetch with the anon key |
|---|---|---|
| Search engines, no-JS visitors, link previews | Full HTML | Empty shell until JavaScript runs |
| `/updates/[slug]/` | `generateStaticParams` keeps working, `dynamicParams = false` stays | Needs a catch-all route plus client rendering; post pages lose per-post metadata |
| Content Security Policy | No change | `connect-src` needs the Supabase domain |
| If Supabase is down | The deployed site stays up | The Updates page breaks live |
| Cost | An edit needs a rebuild (about 1–2 min) | Edits show instantly |

**How the rebuild is triggered**
- **Normal path:** a Supabase database webhook on `public.posts` (insert, update, delete) POSTs to a **Vercel deploy hook** for the `deployment` branch. `vercel.json`'s `ignoreCommand` exits 1 on `deployment`, so the build runs.
- **Manual backup:** the keep-alive workflow has a `workflow_dispatch` input, `redeploy: true`, that POSTs to the same hook.
- The deploy builds the latest commit on `deployment`, which `promote-deployment.yml` fast-forwards from `main` after CI passes.
- Known limit: changing 5 rows at once queues 5 deploys; the last one wins.

**When Supabase can't be reached at build time**
- `SUPABASE_URL` not set (local dev, fork PR) → use the frozen `UPDATES` array in `lib/data/updates.ts`.
- `SUPABASE_URL` set but the fetch fails or a row is invalid → throw, the build fails, Vercel keeps the last good deploy live.

### 2. Edit path: Supabase Studio table editor (chosen)
- **Who:** officers invited to the Supabase project as Developer; Head Designer is Owner. No editor gets a key.
- **RLS:** `anon` can only `SELECT` published rows. No insert/update/delete policies; `anon` and `authenticated` lose write grants. Studio runs as `postgres` and bypasses RLS.
- **Drafts:** `status = 'draft'`; RLS hides drafts from the build.
- **Later**, only if non-members must write: `/updates/admin/` client page with Supabase Auth magic link, an `editors(email)` allowlist, and `authenticated` policies checking it.

### 3. Schema: one table
- Tags: `text[]` limited to the canonical list by a CHECK (every new tag needs a colour token anyway, which is a code change).
- People: `authors` / `mentors` / `lead` stay plain text. Add a `people` table when photos arrive.
- Body: `page jsonb`, same shape as today's `UpdatePage` (`dek`, `sections[{heading, body, flow?}]`), rendered by existing React code (escaped, no `dangerouslySetInnerHTML`). Markdown later: `react-markdown` without `rehype-raw`.
- Links: CHECK constraints block `javascript:` links and stray paths.

```sql
-- supabase/migrations/0001_posts.sql
create extension if not exists moddatetime schema extensions;

create table public.posts (
  slug          text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title         text not null check (char_length(title) between 1 and 160),
  type          text not null check (type in ('paper','milestone','prototype','achievement','product-definition','case-study')),
  sub_team      text not null check (sub_team in ('SIDEKICK','SHADES','BRAIN','TWINS','DIGITAL Business')),
  detail        text check (char_length(detail) <= 40),
  tags          text[] not null default '{}'
                check (tags <@ array['digital','sidekick','shades','brain','twins','business']::text[]),
  published_at  date not null,
  summary       text not null check (char_length(summary) between 1 and 400),
  authors       text[] not null default '{}',
  mentors       text[] not null default '{}',
  lead          text,
  cover_src     text check (cover_src ~ '^/updates/[a-z0-9-]+\.(jpg|png|webp)$'),
  cover_alt     text,
  pdf_src       text check (pdf_src ~ '^/papers/[a-z0-9-]+\.pdf$'),
  pdf_title     text,
  source        text not null check (source in ('site','linkedin')),
  external_url  text check (external_url ~ '^https://www\.linkedin\.com/'),
  page          jsonb,
  status        text not null default 'draft' check (status in ('draft','published')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint linkedin_needs_url check (source <> 'linkedin' or external_url is not null),
  constraint site_needs_page    check (source <> 'site' or (jsonb_typeof(page->'dek') = 'string' and jsonb_typeof(page->'sections') = 'array')),
  constraint cover_pair         check ((cover_src is null) = (cover_alt is null)),
  constraint pdf_pair           check ((pdf_src is null) = (pdf_title is null))
);

create trigger posts_updated_at before update on public.posts
  for each row execute procedure extensions.moddatetime(updated_at);

alter table public.posts enable row level security;
revoke insert, update, delete, truncate on public.posts from anon, authenticated;
create policy "anon reads published posts" on public.posts
  for select to anon using (status = 'published');
-- No write policies on purpose: Studio (postgres role) is the only writer.
```

### 4. Tags (coloured chips)
Canonical list lives in `lib/data/updates.ts` as `UPDATE_TAGS`.

| Slug (URL, DB) | Label (UI, never "#") | Maps from |
|---|---|---|
| `digital` | DIGITAL | Club-wide posts (added by hand) |
| `sidekick` | SIDEKICK | `sub_team = 'SIDEKICK'` |
| `shades` | SHADES | `sub_team = 'SHADES'` |
| `brain` | BRAIN | `sub_team = 'BRAIN'` |
| `twins` | TWINS | `sub_team = 'TWINS'` |
| `business` | DIGITAL Business | `sub_team = 'DIGITAL Business'` |

- Shown tags = team tag + `tags` column, deduplicated, team first. `type` stays its own filter group.

**Tokens** (`app/(apple)/_system/tokens/worlds.css`; light on `.world-apple`, dark on `[data-tone='dark']`):

| Token pair `--r2-tag-<slug>-bg / -ink` | Light bg / ink | Ratio | Dark bg / ink | Ratio |
|---|---|---|---|---|
| digital (graphite, never red) | `#e8e8ed` / `#1d1d1f` | ≈13.8 | `#2c2c2e` / `#f5f5f7` | ≈12.8 |
| sidekick (blue) | `#e3f2ff` / `#0b4f80` | ≈7.4 | `#0d2a40` / `#9fd6ff` | ≈9.5 |
| shades (amber) | `#fff1d6` / `#7a4a00` | ≈6.7 | `#3a2700` / `#ffd27a` | ≈10.1 |
| brain (violet) | `#efe7fd` / `#5b2fa3` | ≈7.4 | `#2a1a4a` / `#cdb6ff` | ≈8.7 |
| twins (green) | `#ddf6ea` / `#11603f` | ≈6.7 | `#0f3324` / `#8fe3bb` | ≈8.2 |
| business (magenta) | `#fce4f1` / `#8a1f5a` | ≈7.2 | `#3d1028` / `#ffb3dc` | ≈9.8 |

**Chip spec (`.tag` in `updates.module.css`):** rounded pill, tag bg/ink tokens, `--r2-fs-label`, no border/shadow/gradient. Pressed = bg and ink swap. Disabled = `--r2-ink-3` on transparent. 44px hit box. Colour never without label; red never a tag.

**Filtering (`UpdatesBrowser.tsx`):** Team pills become a Tag chip group (DIGITAL + 5 teams, live counts); Type group stays. URL `?tag=shades`; old `?team=` mapped on read (`_chrome/club.ts:60` link changed to `?tag=business`). `history.replaceState` on chip click. Search matches tag labels. Row chips link to `/updates/?tag=<slug>`; post pages show chips in the byline.

### 5. Keep-alive GitHub Action
- Calls `posts?select=slug&limit=1` with the anon key (hits Postgres). Add a `heartbeat` RPC only if the project still pauses.
- 60-day rule: the workflow runs `gh workflow enable` on itself each run (`actions: write`).
- Failure: `curl --fail` fails the job; GitHub emails the workflow's last editor.

```yaml
# .github/workflows/supabase-keepalive.yml
name: Supabase keep-alive
on:
  schedule:
    - cron: '17 9 * * *'
  workflow_dispatch:
    inputs:
      redeploy:
        description: 'Also rebuild the site (republish Updates)'
        type: boolean
        default: false
permissions:
  actions: write
jobs:
  ping:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - name: Ping Supabase (cheap REST select)
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        run: |
          curl --fail --silent --show-error --max-time 30 \
            "$SUPABASE_URL/rest/v1/posts?select=slug&limit=1" \
            -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $SUPABASE_ANON_KEY" > /dev/null
      - name: Keep this schedule from being disabled (60-day rule)
        env:
          GH_TOKEN: ${{ github.token }}
        run: gh workflow enable supabase-keepalive.yml --repo "$GITHUB_REPOSITORY"
      - name: Rebuild site (manual only)
        if: ${{ inputs.redeploy }}
        env:
          HOOK: ${{ secrets.VERCEL_DEPLOY_HOOK_URL }}
        run: curl --fail --silent --show-error -X POST "$HOOK" > /dev/null
```

### 6. Migration
1. `supabase/seed.sql`: 7 posts copied from `lib/data/updates.ts`, all `published`; 1 `site` (VESSEL, `page` as jsonb), 6 `linkedin`; `tags` `'{}'`.
2. `lib/data/updates-source.ts`: `getUpdates()` GETs `/rest/v1/posts?select=*&order=published_at.desc` (`cache: 'force-cache'`), maps snake→camel, validates by hand, throws on bad row; no env → `UPDATES`.
3. `updates/page.tsx` and `[slug]/page.tsx` become async and await `getUpdates()`.
4. Rollback: `UPDATES` stays as frozen fallback. A: unset `SUPABASE_URL` in Vercel and redeploy. B: revert the Phase 2 commit.

### 7. Env vars and secrets
| Name | Where | Notes |
|---|---|---|
| `SUPABASE_URL` | Vercel (Prod + Preview), GitHub secrets, `.env.local` | Not `NEXT_PUBLIC_`; build only |
| `SUPABASE_ANON_KEY` | same | Public by design; RLS limits it |
| `VERCEL_DEPLOY_HOOK_URL` | GitHub secrets (+ Supabase webhook) | Secret: anyone holding it can trigger builds |
| Service-role key | Nowhere | Not needed |

- `ci.yml` build step gets the 2 Supabase env vars. Local: `.env.local` (gitignored) or no env → snapshot.
- No new npm package: plain `fetch`. Add `@supabase/supabase-js` only with the admin page.

## Phases
| Phase | Work | Time | Gate |
|---|---|---|---|
| 0 | Chip prototype artifact (`tags-proto.html`, light/dark, 1440×900 + 375×667); copy via brand-voice-strategist → brand-guardian | 1.5h | Head Designer sign-off |
| 1 | Create project, run migration + seed, `supabase/check-rls.sh` (7 rows, no drafts, anon POST 401/403) | 1.5h | — |
| 2 | `updates-source.ts` + async pages + CI env; `node --test lib/data/updates-source.test.ts`; `./run.sh build` lists VESSEL | 2h | After current Updates PR merges |
| 3 | Tag tokens, `UPDATE_TAGS`, chip UI, `?tag=`; `scripts/check-tag-contrast.mjs`; Playwright 3 viewports; re-check locked pages | 3h | Phase 0 |
| 4 | Vercel deploy hook, Supabase webhook, keep-alive workflow + secrets; manual run, redeploy run, Studio edit reaches live | 1h | — |
| 5 | DESIGN.md §6/§18/§19/§20, `supabase/README.md`, CLAUDE.md row, TODO.md rows | 1h | — |

Total: about 10 hours.

## Risks
| Risk | Mitigation |
|---|---|
| Bad Studio edit blocks publishing | DB CHECKs; build fails loudly; last good deploy stays live |
| REST ping doesn't count as activity | Add `heartbeat` RPC |
| Bulk edit queues several deploys | Acceptable; last build wins |
| Anon key in CI and Vercel | Public by design; RLS published-only, no anon writes |
| Clash with in-flight Updates edits | Phase 2 starts after that PR merges |

## Open questions (defaults)
1. Editors: Head Designer (Owner) + 2 officers (Developer).
2. Any seeded post tagged DIGITAL? Default none.
3. Tag chips fully replace Team pills? Default yes.
4. Keep `UPDATES` snapshot? Default yes; delete after 30 days with no rollback.

---

## Revisions after adversarial review (2026-11-12) — these override the sections above

Verdict: APPROVE WITH CHANGES (Opus reviewer). Applied:

1. **Cache (BLOCKER):** drop `cache: 'force-cache'`. Vercel restores `.next/cache/fetch-cache` between builds, so a rebuild would serve stale posts. Put a per-build header in the fetch cache key: `headers: { 'x-build': process.env.VERCEL_DEPLOYMENT_ID ?? String(Date.now()) }`. Phase 2 gate: change a row, build twice, the change shows.
2. **Keys:** new Supabase projects get `sb_publishable_…` keys, which are rejected in `Authorization: Bearer`. Rename to `SUPABASE_PUBLISHABLE_KEY`; send only the `apikey:` header (curl and `getUpdates()`). `check-rls.sh` asserts 200 with that header.
3. **No DB webhook.** Studio saves cell by cell, so a webhook would fire dozens of deploys per post (Vercel caps 60 hook calls/hour), and the hook URL would sit in the DB. Instead the daily job: (a) pings Supabase, (b) POSTs the Vercel deploy hook, (c) uploads `posts?select=*` as a JSON Actions artifact (backup of published posts). Edits go live within 24h; `workflow_dispatch` ("Run workflow") publishes now.
4. **Trust model:** Supabase "Developer" = full DB admin (can read secret keys, disable RLS, drop tables). Cap at 2 people, MFA required. Free plan has no backups → the daily artifact covers published posts; drafts need a manual Studio CSV export.
5. **Body format:** replace `page jsonb` with `dek text` + `body text`. Blank line = paragraph, `## ` = heading, `- ` lines = the flow list. ~15-line splitter, no dependency, same escaped React output.
6. **Validator guards:** throw "at least one published site post required" (else `generateStaticParams` → `[]` fails the export); throw if `cover_src`/`pdf_src` file is missing from `public/`.
7. **Images and PDFs:** superseded by the addendum below (Supabase Storage, Head Designer request 2026-11-12).
8. **README escape hatch:** if Supabase is paused/down every deploy fails → unset `SUPABASE_URL` in Vercel and redeploy (serves the snapshot). Document pause email + restore steps. Rule: a slug is permanent once published.
9. **Cut (YAGNI):** dark tag tokens (Updates pages are light-only), `moddatetime`/`updated_at`, `?team=` alias, `check-tag-contrast.mjs`, heartbeat-RPC fallback. Saves ~1h.
10. **Contrast table corrected:** light DIGITAL 13.78, SIDEKICK 7.53, SHADES 6.70, BRAIN 7.36, TWINS 6.66, Business 7.22 — all ≥ 4.5:1. Never put `--r2-ink-3` text on a chip (4.15 on the DIGITAL chip).
11. **60-day rule:** repo is public, so it applies. Self `gh workflow enable` stays (community practice, not GitHub-documented); README notes it.

Revised estimate: about 9 hours.

## Addendum: images and PDFs in Supabase Storage (Head Designer request, 2026-11-12)

- **Bucket:** public bucket `updates` in Supabase Storage (free tier 1 GB). Editors upload in Studio → Storage, then put the object path (e.g. `vessel/cover.jpg`) in `cover_src` / `pdf_src`. Limits on the bucket: 5 MB per file; types `image/jpeg`, `image/png`, `image/webp`, `application/pdf`. Writes only through Studio (no anon insert policy).
- **Served from our own site, not Supabase:** a `prebuild` script (`scripts/fetch-update-assets.mjs`, plain `fetch`) downloads every file the published posts reference into `public/updates/media/` (gitignored) before `next build`. Why:
  - CSP stays `img-src 'self'` (`vercel.json:32`); no new domain.
  - If the Supabase project pauses, live images keep working.
  - No runtime egress from Supabase.
- **Schema change:** `cover_src` / `pdf_src` CHECK becomes a storage path: `^[a-z0-9-]+/[a-z0-9-]+\.(jpg|png|webp|pdf)$`. `cover_alt` still required with a cover (pair constraint stays).
- **Validator:** the build throws if a referenced file fails to download (missing upload or typo) — replaces the `fs.existsSync` guard.
- **Backup:** the daily artifact lists object paths; the files themselves are in each deploy's `out/`.
- **Cost:** about +1.5h (bucket + script + check). Revised total: about 10.5 hours.

## Phase 1 done (2026-11-13)
- Free-plan limit (2 active projects) blocked a new project. Head Designer chose the existing project `exwufjcrxwcaoflhrkwo` (to be renamed "DroneOS/DIGITAL" in the dashboard), which also hosts another app's tables.
- Names prefixed to avoid collisions: table `public.digital_posts`, bucket `digital-updates`. REST path: `/rest/v1/digital_posts`. SQL in `supabase/migrations/0001_digital_posts.sql`, seed in `supabase/seed.sql` (generated from `lib/data/updates.ts`; VESSEL body converted to the dek/body text format).
- Checked with the publishable key (`apikey` header only): read = 7 rows; insert 401; update 401 (permission denied); storage upload 400 (blocked); a draft row is hidden. Security advisors: 2 WARN, both on the other app (`public.is_admin()` SECURITY DEFINER, leaked-password protection off), none on `digital_posts`.
- Env for Phase 2: `SUPABASE_URL=https://exwufjcrxwcaoflhrkwo.supabase.co`, `SUPABASE_PUBLISHABLE_KEY` = the `sb_publishable_…` key from the dashboard (Project Settings → API Keys).
