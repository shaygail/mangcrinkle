# Mang Crinkle Strapi CMS

Pre-configured Strapi 5 instance for the Mang Crinkle menu. The **Product** content type is defined in code (`src/api/product/`) so it works in production without using the Content-Type Builder.

## Product fields

| Field | Type |
|-------|------|
| `productId` | Text (unique) — maps to Next.js `Product.id` |
| `name` | Text |
| `description` | Text |
| `price` | Decimal |
| `category` | Enum (crinkle-standard, crinkle-premium, etc.) |
| `tier`, `badge`, `note` | Optional text |
| `image` | Single media |

Public **find** / **findOne** permissions are enabled automatically on bootstrap.

## Deploy on Railway (monorepo)

1. Push this repo to GitHub (if not already).
2. Railway → **Strapi** service → **Settings → Source**.
3. Connect your **mangcrinkle** GitHub repo.
4. Set **Root Directory** to `strapi`.
5. Keep existing env vars (`DATABASE_URL`, `APP_KEYS`, `JWT_SECRET`, etc.) — copy them from the old template service if redeploying fresh.
6. **Deploy**.

After deploy, open `/admin`, create your admin user, then from the repo root run:

```bash
npx tsx scripts/seed-strapi.ts
```

(Set `STRAPI_URL` and `STRAPI_API_TOKEN` in `.env.local` first.)

## Local development

```bash
cd strapi
npm install
# Set DATABASE_URL to Railway Postgres public URL, plus APP_KEYS etc.
npm run develop
```

Open http://localhost:1337/admin
