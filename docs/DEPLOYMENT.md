# Deployment & CI/CD

Production deploys follow a three-branch model:

```
feature/*  ──PR──►  main  ──CI green──►  deployment  ──►  Vercel production
```

| Branch | Role | Vercel |
|--------|------|--------|
| `feature/*` | Development; opens PRs to `main` | No deploy (`ignoreCommand` skips build) |
| `main` | Integration; must pass CI | No deploy (`git.deploymentEnabled.main: false`) |
| `deployment` | Production release pointer | Production deploy only |

Automation lives in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) and
[`.github/workflows/promote-deployment.yml`](../.github/workflows/promote-deployment.yml).

---

## Vercel project settings (one-time)

Project: **digital-website-v1** (`prj_bOUpDDm91cGjwVIi16yNiZzDqaqc`)

In [Vercel → digital-website-v1 → Settings → Git](https://vercel.com/danny-trans-projects-ca92f130/digital-website-v1/settings/git):

1. **Production Branch** → set to `deployment` (not `main`).
2. Confirm **Ignored Build Step** is not overriding the in-repo `ignoreCommand` in [`vercel.json`](../vercel.json).

Optional hardening — [Settings → Deployment Checks](https://vercel.com/danny-trans-projects-ca92f130/digital-website-v1/settings/deployment-checks):

- Add check name **`CI`** (must match the GitHub Actions job name).
- Enable **Block production alias assignment** until the GitHub `CI` workflow succeeds on the deploying commit.

Environment variables — [Settings → Environment Variables](https://vercel.com/danny-trans-projects-ca92f130/digital-website-v1/settings/environment-variables):

- `NEXT_PUBLIC_SITE_URL` → production origin (no trailing slash), scoped to **Production** / `deployment` branch.
- See also [`docs/PRE-LAUNCH.md`](./PRE-LAUNCH.md) for Formspree and CSP promotion.

---

## GitHub branch protection (one-time)

In **GitHub → Settings → Branches → Branch protection rules**:

### `main`

- [ ] Require a pull request before merging
- [ ] Require status checks to pass: **`CI`**
- [ ] Require branches to be up to date before merging
- [ ] Restrict who can push (maintainers)

### `deployment`

- [ ] Restrict who can push — allow **github-actions[bot]** and admins only
- [ ] Do not allow force pushes (keeps production history linear)

The promote workflow uses `GITHUB_TOKEN` with `contents: write`. If pushes to `deployment` are blocked, add an exception for `github-actions[bot]` or use a dedicated PAT stored as `DEPLOYMENT_PROMOTE_TOKEN`.

---

## Local validation

```bash
node scripts/validate-vercel-json.mjs   # or: npm run validate:vercel
./run.sh check
./run.sh build
```

---

## Rollout checklist

1. Merge CI/CD changes to `main` (via PR from `feature/brand-story-gsap` or direct push).
2. Ensure `deployment` branch exists on GitHub (created from `main` if missing).
3. Set Vercel **Production Branch** to `deployment` (above).
4. Merge feature work into `main`; wait for **CI** then **Promote to deployment** workflows.
5. Confirm Vercel production deploy succeeds (no `vercel.json` schema errors).
6. Smoke-test `https://digitalcpp.vercel.app` per [`PRE-LAUNCH.md`](./PRE-LAUNCH.md).
7. Record the release commit in [`TODO.md`](../TODO.md) Dev Build table.

---

## CSP note

`vercel.json` ships `Content-Security-Policy-Report-Only` intentionally. Do **not** promote to enforcing `Content-Security-Policy` until post-deploy validation passes — see [`PRE-LAUNCH.md`](./PRE-LAUNCH.md) §3. Documentation belongs in that file, not in `vercel.json` (Vercel rejects `_comment` and other non-schema keys).
