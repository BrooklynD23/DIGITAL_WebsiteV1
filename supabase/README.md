# Updates posts in Supabase

The `/updates/` pages are built from the Supabase table `public.digital_posts` (project `exwufjcrxwcaoflhrkwo`).
The site reads it **at build time** (`lib/data/updates-source.ts`), so **an edit goes live on the next site build**,
not the moment you save.

## Add or edit a post (Supabase Studio)
1. Dashboard → Table Editor → `digital_posts`.
2. Insert row (or click a cell to edit). Studio saves each cell as you leave it.
3. Keep `status = draft` while writing. Drafts are invisible to the site. Set `status = published` when it is ready.
4. Trigger a build (see "When edits go live").

| Column | What to put |
|---|---|
| `slug` | URL id, lowercase words joined by `-`, e.g. `fifo-ip-v4`. **Permanent once published**: changing it breaks links. |
| `title`, `summary` | Plain text; summary is one or two sentences in our own words. |
| `type` | `paper`, `milestone`, `prototype`, `achievement`, `product-definition`, `case-study` |
| `sub_team` | `SIDEKICK`, `SHADES`, `BRAIN`, `TWINS`, `DIGITAL Business` |
| `detail` | Optional area, e.g. `SoC` |
| `tags` | Extra tags beyond the team: any of `digital`, `sidekick`, `shades`, `brain`, `twins`, `business`, e.g. `{digital}` |
| `published_at` | Date, `YYYY-MM-DD` |
| `authors`, `mentors`, `lead` | Names exactly as posted; arrays look like `{"Ada Lovelace","Alan Turing"}` |
| `source` | `linkedin` (card opens LinkedIn; `external_url` required) or `site` (own page; `dek` + `body` required) |
| `external_url` | `https://www.linkedin.com/...` |
| `dek` | One-sentence standfirst under a site post's title |
| `body` | Site post text, format below |
| `cover_src` + `cover_alt`, `pdf_src` + `pdf_title` | Optional media, always in pairs (see below) |

## Body format (site posts)
```
## Section heading

A paragraph. A blank line starts a new paragraph.

- First step of the value stream
- Second step
```
- `## ` starts a section; the body must start with one.
- Blank line = new paragraph.
- A block of `- ` lines = the value-stream (flow) list of that section.
- No other Markdown: text shows exactly as typed.

## Images and PDFs
- Dashboard → Storage → bucket `digital-updates`. Upload into a folder named after the post, e.g. `fifo-ip-v4/cover.jpg`.
- Limits: 5 MB per file; jpg, png, webp or pdf. Lowercase names, `-` instead of spaces.
- Put the path (`fifo-ip-v4/cover.jpg`) in `cover_src` and describe the image in `cover_alt` (or `pdf_src` + `pdf_title`).
- The build copies the file into the site; a missing or misspelled file fails the build.

## When edits go live
- Edits appear on the next production build of the `deployment` branch (any merge to `main` that passes CI, or a redeploy in Vercel).
- A bad row (wrong value, missing field) fails the build with the row's slug in the log. The live site keeps the last good version; fix the row and rebuild.

## Escape hatch
If Supabase is paused or down, every build fails. To publish anyway from the snapshot in `lib/data/updates.ts`:
Vercel → Project → Settings → Environment Variables → remove `SUPABASE_URL` (Production) → Deployments → Redeploy.
A free project pauses after a week without activity; the pause email has a Restore link (Dashboard → Restore project).
Put `SUPABASE_URL` back once it is restored.

## Access
- Head Designer is Owner. At most 2 more people as **Developer**, with MFA on.
- Developer = full database admin (can read secret keys, turn off RLS, drop tables). Invite only people you trust with the whole project, which also hosts another app's tables.
- The site uses only the publishable key, which can read published rows and nothing else (RLS).

## Files
- `migrations/0001_digital_posts.sql` — table, RLS, bucket (applied 2026-11-13).
- `seed.sql` — the 7 original posts.
- Env (Vercel Production + Preview, GitHub Actions secrets, local `.env.local`): `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`.
