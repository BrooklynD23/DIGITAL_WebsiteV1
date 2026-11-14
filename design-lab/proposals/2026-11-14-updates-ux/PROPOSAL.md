# Updates UX proposal (2026-11-14)

Status: PROPOSED. Nothing in `app/` changed. Prototype: `updates-ux-proto.html` (same folder), screenshots `d-*.png` (1440×900) and `m-*.png` (375×667).

Decision needed from the Head Designer: **may the "All updates" log stop repeating the four posts already shown as cards?** (Idea 1. It edits the cards exception in `DESIGN.md` §18, which says "then the hairline rows of every post".)

## What Astryx is

1. [meta/astryx](https://github.com/meta/astryx) is Meta's open source design system (MIT, beta, public since January 2026): 150+ React 19 components styled with StyleX, seven themes, a CLI. Docs: <https://astryx.atmeta.com>.
2. It is a component library, not a blog product. We should not install it: it needs React 19 (we are on 18) and brings its own tokens, which would fight the `--r2-*` system.
3. What transfers is its **docsite blog**, a small editorial UI built from those components: [`apps/docsite/src/components/blog/`](https://github.com/meta/astryx/tree/main/apps/docsite/src/components/blog) (index, card, article, byline, generated covers) and [`src/lib/blog/schema.ts`](https://github.com/meta/astryx/blob/main/apps/docsite/src/lib/blog/schema.ts).
4. Its patterns: one featured post then a grid with no repeats, a type filter that lists only types with posts, a byline with date and reading time, a breadcrumb, a "Related" block at the end of every article, heading anchor links, and a hover that tints rather than moves.
5. Its motion rules are short and match ours: motion must explain a change, small feedback is faster than entrances, and reduced motion keeps the meaning ([`docs/design/motion.md`](https://github.com/meta/astryx/blob/main/docs/design/motion.md), [`reduced-motion.md`](https://github.com/meta/astryx/blob/main/docs/design/reduced-motion.md)).

Source read: the repo through the GitHub API on 2026-11-14. I did not load the live blog page, only its source.

## Audit of our Updates pages

| # | Finding | Where |
|---|---------|-------|
| A | The newest four posts appear twice: as cards, then again as the first four rows of "All updates". 7 posts render as 11 items. | `UpdatesBrowser.tsx` (`shown` is every hit) |
| B | The post page is a dead end: after "Read the post on LinkedIn" comes the footer. No way to the next post except the back link at the top. | `[slug]/page.tsx` |
| C | On a phone, six type pills (two of them disabled at 0) and the search field sit between the title and the first card. | `updates.module.css` `.filters` |
| D | The post page does not say how long the read is, and "‹ Updates" does not say what kind of post it is. | `[slug]/page.tsx` |
| E | Only the lead card can carry art; a lead post with no cover and no value stream is text only. Covers arrive with the storage bucket (PLAN addendum). | `Art()` in `UpdatesBrowser.tsx` |
| F | Section headings on a post cannot be linked to. | `[slug]/page.tsx` |
| G | Six of seven posts open LinkedIn; the card says so only on its last line. | `Card()` |

Out of scope here because they are already decided: tag chips and `?tag=` (Phase 3, `tags-proto.html`), Supabase and bucket images (`PLAN.md`).

## Do next (3)

### 1. Show each post once; group the log by year

- **What:** cards stay as they are (lead + three). The log below holds only the posts the cards did not show, under the heading "Earlier", with a mono year label per group. Dates in the log drop the year ("Jan 22"). Under a filter the same rule applies to the hits.
- **Why:** the reader stops re-reading four posts, and the page is about one screen shorter at both widths. Years make an old post easy to find once the list grows.
- **Borrows:** Astryx `BlogIndex` splits `featurePost` from `restPosts` and never repeats ([`BlogIndex.tsx`](https://github.com/meta/astryx/blob/main/apps/docsite/src/components/blog/BlogIndex.tsx), lines 60–62).
- **Effort:** 2 h (slice the list, one year label, one new string "Earlier", tests).
- **DESIGN.md:** needs a one-line edit to the §18 cards exception ("rows of every post" becomes "rows of the remaining posts"). No new token, hairlines only.

```
[ lead card: VESSEL                         ]
[ Samsung ] [ FIFO v3 ] [ FIFO IP ]

Earlier
2026 ─────────────────────────────────────────
Jan 22  (SIDEKICK)  Light sensor mini-project ↗
Jan 21  (SIDEKICK)  Smartphone enclosure ↗
2025 ─────────────────────────────────────────
Nov 25  (SIDEKICK)  IMU mini-project ↗
```

### 2. End the post page with "More updates", add a breadcrumb and reading time

- **What:** (a) after the LinkedIn link, three hairline rows of other posts (same tag first, then nearest in date) and an "All updates" link; (b) "‹ Updates" becomes the breadcrumb "Updates / Product definition"; (c) the meta line gains "1 min read" (words ÷ 200, computed at build).
- **Why:** a reader who finishes a post has a next step that stays on our site. The breadcrumb and read time set expectations before they start.
- **Borrows:** Astryx `BlogArticle` ends with a "Related" block and opens with `Breadcrumbs` (Blog / post type); `AuthorByline` prints date and "N min read" ([`BlogArticle.tsx`](https://github.com/meta/astryx/blob/main/apps/docsite/src/components/blog/BlogArticle.tsx), [`AuthorByline.tsx`](https://github.com/meta/astryx/blob/main/apps/docsite/src/components/blog/AuthorByline.tsx)).
- **Effort:** 3 h (reuse the existing row markup; extract it from `UpdatesBrowser.tsx` so both pages share it).
- **DESIGN.md:** none. Rows are a hairline list (§9 rule 4). New strings "More updates", "All updates", "min read" go through the brand-voice and brand-guardian agents.

```
Updates / Product definition
Product definition: VESSEL
(TWINS)  Sep 30, 2026 · 1 min read · Coming soon
…body…
Read the post on LinkedIn ↗

More updates
Aug 19, 2026  (DIGITAL Business)  Samsung financial reporting case study ↗
Apr 30, 2026  (SIDEKICK)          FIFO IP v3 ↗
Mar 23, 2026  (SIDEKICK)          FIFO IP ↗
All updates
```

### 3. Fold Type and search into one control on phones; list only types that have posts

- **What:** at ≤ 734px the type pills and the search field sit inside one native `<details>` labelled "Type and search" (with a count when a type or a search is active). At desktop width they stay visible as today. Type pills with 0 posts (Paper, Achievement today) are not rendered. Tag chips are untouched, including the 0-count "soon" chips.
- **Why:** the first card moves up by roughly 200px on a phone (estimate from the prototype, not measured on the live page): the top of the lead card is inside the first 667px screen.
- **Borrows:** Astryx renders filter buttons only for `availableTypes` and hides the filter when there is one type ([`BlogIndex.tsx`](https://github.com/meta/astryx/blob/main/apps/docsite/src/components/blog/BlogIndex.tsx), lines 77–93).
- **Effort:** 2 h. No JavaScript beyond opening the `<details>` at desktop width.
- **DESIGN.md:** none for the fold. Dropping 0-count type pills reverses the "0 = disabled, still visible" note in `UpdatesBrowser.tsx` for types only; say no to this half and the fold still works.

```
375px:  (All) (SIDEKICK 5) (SHADES 0) (BRAIN 0)
        (TWINS soon 1) (DIGITAL Business soon 1)
        [ Type and search ⌄ ]
        7 updates
```

## Later (5)

| # | Idea | Why | Borrows | Effort | DESIGN.md |
|---|------|-----|---------|--------|-----------|
| 4 | Heading anchor links on post pages (`id` on each `h2`, `scroll-margin-top: var(--r2-nav-h)`, link shown on hover and focus) | A member can share one section of a post | Astryx `BlogPostBody.module.css` + `e2e/blog-heading-links.spec.ts` ([file](https://github.com/meta/astryx/blob/main/apps/docsite/src/components/blog/BlogPostBody.module.css)) | 1.5 h | none |
| 5 | Cover on the post page (16:9, under the byline) and on grid cards once the bucket has images | Posts with photos read as news, not notes | Astryx `BlogCard` / `BlogArticle` 16:9 `AspectRatio` cover ([file](https://github.com/meta/astryx/blob/main/apps/docsite/src/components/blog/BlogCard.tsx)) | 2 h after PLAN images land | none for real images. A generated fallback like Astryx `BlogCoverArt` is decoration: **needs exception**, not recommended |
| 6 | Card hover: summary and byline go from `--r2-ink-2` to `--r2-ink` (keep the 2px lift) | Clearer "this whole card is a link" on hover, and it still works under reduced motion where the lift is off | Astryx `BlogCard.module.css` `.card:hover .description` ([file](https://github.com/meta/astryx/blob/main/apps/docsite/src/components/blog/BlogCard.module.css)) | 0.5 h | none (one hover language stays: underline on the title) |
| 7 | "LinkedIn ↗" moves from the card's last line into the meta line | The reader knows before clicking that a card leaves the site | Astryx byline keeps all meta in one line (`AuthorByline`) | 0.5 h | none |
| 8 | `/updates/feed.xml` written at build time | Members can follow Updates without LinkedIn | Astryx serves a plain-text copy of each post (`app/blog/txt/[slug]/route.ts`) ([file](https://github.com/meta/astryx/blob/main/apps/docsite/src/app/blog/txt/%5Bslug%5D/route.ts)) | 2 h | none |

Not proposed: installing `@astryxdesign/core` (React 19, second token system), view transitions between card and post (Next 14 client navigation does not run them without extra code), a table of contents (the one site post has three sections).

## Prototype notes

- `updates-ux-proto.html` shows ideas 1, 2 and 3 on the seven real posts. Open it and use the strip at the top (or the VESSEL card) to switch between the index and the post page.
- Tokens are copied from `app/(apple)/_system/tokens/worlds.css`; chips follow the approved `tags-proto.html`. No new colour, no new token, no dependency.
- Checked at 1440×900 and 375×667: no horizontal scroll, no page errors. Reshoot: `node design-lab/proposals/2026-11-14-updates-ux/shoot.mjs` from the repo root.
- New strings in the prototype are placeholders until the copy agents review them: "Earlier", "Type and search", "More updates", "All updates", "min read".
