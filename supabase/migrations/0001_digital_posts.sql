-- DIGITAL website Updates blog (design-lab/proposals/2026-11-12-supabase-updates/PLAN.md, with review revisions).
-- Applied 2026-11-13 to the shared Supabase project exwufjcrxwcaoflhrkwo ("DroneOS/DIGITAL"); names are prefixed
-- because the project also hosts another app's tables. Read at build time with the publishable key; written only
-- from the Supabase dashboard (postgres role bypasses RLS).
create table public.digital_posts (
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
  cover_src     text check (cover_src ~ '^[a-z0-9-]+/[a-z0-9-]+\.(jpg|png|webp)$'),
  cover_alt     text,
  pdf_src       text check (pdf_src ~ '^[a-z0-9-]+/[a-z0-9-]+\.pdf$'),
  pdf_title     text,
  source        text not null check (source in ('site','linkedin')),
  external_url  text check (external_url ~ '^https://www\.linkedin\.com/'),
  dek           text,
  body          text,
  status        text not null default 'draft' check (status in ('draft','published')),
  created_at    timestamptz not null default now(),
  constraint linkedin_needs_url check (source <> 'linkedin' or external_url is not null),
  constraint site_needs_body    check (source <> 'site' or (dek is not null and body is not null)),
  constraint cover_pair         check ((cover_src is null) = (cover_alt is null)),
  constraint pdf_pair           check ((pdf_src is null) = (pdf_title is null))
);
comment on table public.digital_posts is 'DIGITAL website /updates/ posts. body: blank line = paragraph, "## " = heading, "- " lines = value-stream list. cover_src/pdf_src are paths in the digital-updates bucket. Edits go live on the next site build.';

alter table public.digital_posts enable row level security;
revoke insert, update, delete, truncate on public.digital_posts from anon, authenticated;
create policy "anon reads published digital posts" on public.digital_posts
  for select to anon using (status = 'published');

-- Media bucket: public read via public URL; no insert/update policies, so uploads only through the dashboard.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('digital-updates', 'digital-updates', true, 5242880, array['image/jpeg','image/png','image/webp','application/pdf']);
