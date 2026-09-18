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

### Content types

| Type | API | Editable in Admin |
|------|-----|-------------------|
| **Product** | `/api/products` | Content Manager → Product — names, **descriptions**, prices, images, shop featured flags, box-builder flags, pack builder titles |
| **Homepage** (single) | `/api/homepage` | Content Manager → Homepage — hero, story, how-to-order, CTA, fan favourites titles, footer tagline/links, site meta description + **images** |
| **Shop Page** (single) | `/api/shop-page` | Content Manager → Shop Page — shop header + section blurbs + how-to-order teaser |
| **Storefront Copy** (single) | `/api/storefront-copy` | Content Manager → Storefront Copy — cart / checkout / confirmation titles & CTAs |
| **Store Outlet** (single) | `/api/store-outlet` | Content Manager → Store Outlet — pickup name, hours, address, time windows |
| **Testimonial** | `/api/testimonials` | Content Manager → Testimonial |
| **Order Step** | `/api/order-steps` | Content Manager → Order Step — step titles + descriptions |

After deploy, seed from repo root:

```bash
npx tsx scripts/seed-strapi.ts      # products
npx tsx scripts/seed-homepage.ts    # homepage, shop page, testimonials, order steps
```

Upload **heroImage**, **storyImage**, and **ctaBackgroundImage** on the Homepage entry in Admin.

### Where to edit page descriptions

| Page / section | Strapi entry |
|----------------|--------------|
| Product cards (all pages) | **Product** → Description |
| Homepage hero, story, CTA, how-to-order | **Homepage** |
| Fan Favourites / Merch headings | **Homepage** → `bestSellersTitle`, `merchTitle`, … |
| Shop header + Crinkles / Packs / Lava / Drinks blurbs | **Shop Page** |
| How to Order step blurbs | **Order Step** |
| Testimonials | **Testimonial** |

## Deploy on Railway (monorepo)

This repo has **two services**. Each must use a different root directory:

| Service | Root Directory | Start command | Healthcheck |
|---------|----------------|---------------|-------------|
| **mangcrinkle** (Next.js) | `/` (repo root) | `npm run start` | `/` |
| **Strapi** (CMS) | `strapi` | `yarn start` | `/admin` |

### Strapi service setup

1. Railway → **Strapi** service → **Settings → Source**
2. Connect **shaygail/mangcrinkle** repo
3. Set **Root Directory** to **`strapi`** ← critical
4. Keep existing env vars (`DATABASE_URL`, `APP_KEYS`, `JWT_SECRET`, `URL`, etc.)
5. **Deploy**

If Root Directory is wrong, Railway builds Next.js (`npm run build`) but healthchecks `/admin` — that always fails.

### Next.js service setup

1. Railway → **mangcrinkle** service → **Settings → Source**
2. Root Directory: **`/`** (empty / repo root)
3. Healthcheck path: **`/`** (not `/admin`)
4. Add env vars: `STRAPI_URL`, `STRAPI_API_TOKEN`

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
