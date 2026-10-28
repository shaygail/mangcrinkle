# Mang Crinkle

Menu-poster storefront for Mang Crinkle — browse the menu, build a cart, and place pickup orders.

## Project plan

See **[PHASES.md](./PHASES.md)** for the full architecture, phase tracker, deployment checklist, and go-live plan.

| Phase | Status |
|-------|--------|
| 1 — Storefront & cart | ✅ Complete |
| 2 — Supabase CMS + order emails | ✅ Catalogue and admin use Supabase |
| 3 — Tie it all together | 🔲 Go-live checklist in PHASES.md |

## Set up on a new laptop

Everything code-related is on GitHub. You do **not** need to copy `node_modules` or the whole OneDrive folder.

### 1. Clone the repo

```bash
git clone https://github.com/shaygail/mangcrinkle.git
cd mangcrinkle
npm install
```

### 2. Copy your secrets (manual — not in Git)

Copy `.env.local` from this laptop to the new one (USB, OneDrive personal folder, password manager, etc.):

```bash
# On the new laptop, create:
cp .env.local.example .env.local
# Then paste in your real values from the old .env.local
```

Required today:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Optional (when you set up orders):

```env
RESEND_API_KEY=
ORDER_EMAIL_TO=
ORDER_EMAIL_FROM=
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### What's already in the cloud (no laptop copy needed)

| Service | Where it lives |
|---------|----------------|
| Source code | GitHub — `shaygail/mangcrinkle` |
| Products, website copy, media, admin login | Supabase |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful commands

```bash
npm run build          # production build
npm run lint           # ESLint
npm run cms:seed       # seed Supabase drafts (needs .env.local)
```

## Deploy on Vercel

Connect the GitHub repo at [vercel.com](https://vercel.com). Add the same env vars as `.env.local`. See **PHASES.md** for the full go-live checklist.
