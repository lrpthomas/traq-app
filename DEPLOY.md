# Deploying TRAQ to Cloudflare Pages — `traq.lrpdm.com`

TRAQ ships as a **static export** (the same `output: 'export'` build the iOS/Android
apps use), so it hosts as plain files on **Cloudflare Pages** — exactly like
`canopygis.lrpdm.com`. No server, no Vercel.

We use Cloudflare Pages' **built-in Git integration** (Cloudflare runs the build on
each push). This deliberately does **not** use GitHub Actions, which sidesteps the
account-level Actions billing block.

---

## What's already true

- The static export builds cleanly: `npm run build:native` → `out/` with all routes
  prerendered. **Verified.**
- Node is pinned to **20** via `.nvmrc` (matches CI) so Cloudflare uses a Next-16-
  compatible runtime.

## Prerequisites (yours)

- A Cloudflare account with the `lrpdm.com` zone (the same one serving
  `canopygis.lrpdm.com`).
- The **TRAQ Supabase anon key** (the value posted in chat on 2026-07-06). The
  Supabase **URL** is `https://kxjsvpqwdhmmczslbtgq.supabase.co`.

---

## Step 1 — Create the Pages project (Git integration)

Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** →
select `lrpthomas/traq-app`, production branch **`master`**.

**Build settings:**

| Setting | Value |
|---|---|
| Framework preset | None *(or "Next.js (Static HTML Export)" if offered)* |
| Build command | `npm run build:native` |
| Build output directory | `out` |
| Root directory | *(leave blank / repo root)* |

**Environment variables — add to BOTH Production and Preview:**

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://kxjsvpqwdhmmczslbtgq.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(the TRAQ anon key)* |

> ⚠️ Both vars are **required at build time** — without them the export fails on
> `/_not-found` (`@supabase/ssr: URL and API key are required`). `.nvmrc` handles the
> Node version; you don't need a `NODE_VERSION` var, but setting it to `20` is harmless.

**Save & Deploy.** The first build runs and gives you a `https://<project>.pages.dev`
URL. Confirm that loads before doing the domain.

## Step 2 — Attach the custom domain

Pages project → **Custom domains → Set up a custom domain** → `traq.lrpdm.com`.

Because `lrpdm.com` is already on Cloudflare, it creates the proxied CNAME
(`traq` → `<project>.pages.dev`) for you and provisions the TLS cert (usually a few
minutes).

## Step 3 — Verify

- Visit `https://traq.lrpdm.com` — the login page should load.
- DNS resolves:
  ```bash
  python3 -c "import socket; socket.getaddrinfo('traq.lrpdm.com', 443); print('ok')"
  ```

Once `traq.lrpdm.com` resolves, the CanopyGIS Field-Intelligence loop will
automatically merge `lrpdm-website` PR #1 (the TRAQ site block), build the dedicated
`traq.html` page, and — once the mirror secrets are set — run the two-project E2E
mirror drill.

---

## Notes / caveats

- **Middleware is disabled in a static export.** `src/middleware.ts` does *server-side*
  auth redirects (unauthenticated → `/login`). Static hosting can't run it, so auth
  gating happens **client-side** — the same as the iOS/Android builds, which are also
  static exports. Expect a possible brief app-shell flash before the client redirects
  to `/login`. Not a functional blocker; worth a 30-second sanity check once live.
- **Auto-rebuilds** happen on every push to `master`.
- **Do NOT commit the anon key** to the repo — it lives only in the Cloudflare project
  env (and in the other places it's already needed: Vercel-if-used, GitHub repo
  secrets, and the `traq-mirror` Supabase function secret).

## Alternative — direct upload (only if you skip Git integration)

```bash
npm run build:native            # produces out/ (needs the two NEXT_PUBLIC_SUPABASE_* env vars)
npx wrangler pages deploy out --project-name traq
```
Requires `CLOUDFLARE_API_TOKEN` + account id in your shell. The Git-integration path
above is preferred — it rebuilds automatically and needs no token in CI.
