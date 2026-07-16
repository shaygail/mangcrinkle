-- Mang Crinkle product catalogue
-- Generated from src/data/products.ts (fallbackProducts)
-- Compatible with PostgreSQL (e.g. Railway Postgres)
--
-- NOTE: If you use Strapi, do NOT import this into Strapi's DB.
-- Strapi owns its own tables. Use: npx tsx scripts/seed-strapi.ts
-- This SQL is for a standalone products table / backup / migration reference.

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10, 2) NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN (
    'crinkle-standard',
    'crinkle-premium',
    'crinkle-signature',
    'crinkle-pack',
    'lava',
    'hot-drink',
    'iced-drink'
  )),
  tier TEXT,
  badge TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);

TRUNCATE products;

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'classic-chocolate',
  'Classic Chocolate',
  'Standard crinkle — soft-centred and fudgy.',
  4.5,
  '/images/placeholders/cookie.svg',
  'crinkle-standard',
  'Standard',
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'red-velvet',
  'Red Velvet',
  'Standard crinkle — soft-centred and fudgy.',
  4.5,
  '/images/placeholders/cookie.svg',
  'crinkle-standard',
  'Standard',
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'chocolate-mint',
  'Chocolate Mint',
  'Standard crinkle — soft-centred and fudgy.',
  4.5,
  '/images/placeholders/cookie.svg',
  'crinkle-standard',
  'Standard',
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'ube',
  'Ube',
  'Premium crinkle — Filipino-inspired ube flavour.',
  5,
  '/images/placeholders/cookie.svg',
  'crinkle-premium',
  'Premium',
  'Premium',
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'coconut-pandan',
  'Coconut Pandan',
  'Premium crinkle — coconut pandan flavour.',
  5,
  '/images/placeholders/cookie.svg',
  'crinkle-premium',
  'Premium',
  'Premium',
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'chocolate-butternut',
  'Chocolate Butternut',
  'Premium crinkle — chocolate butternut flavour.',
  5,
  '/images/placeholders/cookie.svg',
  'crinkle-premium',
  'Premium',
  'Premium',
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'chocolate-pistachio',
  'Chocolate Pistachio',
  'Signature premium crinkle.',
  5.5,
  '/images/placeholders/cookie.svg',
  'crinkle-signature',
  'Signature Premium',
  'Signature',
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'ube-matcha',
  'Ube Matcha',
  'Signature premium crinkle.',
  5.5,
  '/images/placeholders/cookie.svg',
  'crinkle-signature',
  'Signature Premium',
  'Signature',
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'pack-3',
  '3 Pack Crinkles',
  'Mix & match any flavours. Premium +$0.50, Signature +$1.00 per crinkle.',
  13,
  '/images/placeholders/pack.svg',
  'crinkle-pack',
  NULL,
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'pack-6',
  '6 Pack Crinkles',
  'Mix & match any flavours. Premium +$0.50, Signature +$1.00 per crinkle.',
  25,
  '/images/placeholders/pack.svg',
  'crinkle-pack',
  NULL,
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'pack-12',
  '12 Pack Crinkles',
  'Mix & match any flavours. Premium +$0.50, Signature +$1.00 per crinkle.',
  48,
  '/images/placeholders/pack.svg',
  'crinkle-pack',
  NULL,
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'lava-ube',
  'Lava Ube Crinkle — Each',
  'Rich, gooey ube crinkle with a melty centre.',
  6.5,
  '/images/lava/ube.jpeg',
  'lava',
  NULL,
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'lava-choco',
  'Lava Chocolate Crinkle — Each',
  'Rich, gooey chocolate crinkle with a melty centre.',
  6.5,
  '/images/lava/choco.jpeg',
  'lava',
  NULL,
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'lava-3',
  'Lava Crinkle — 3 Pack',
  'Rich, gooey and made to melt.',
  19,
  '/images/lava/choco.jpeg',
  'lava',
  NULL,
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'lava-6',
  'Lava Crinkle — 6 Pack',
  'Rich, gooey and made to melt.',
  38,
  '/images/lava/ube.jpeg',
  'lava',
  NULL,
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'lava-12',
  'Lava Crinkle — 12 Pack',
  'Pre-order required. Please allow 2–3 days.',
  76,
  '/images/lava/choco.jpeg',
  'lava',
  NULL,
  'Pre-order',
  'Pre-order required. Allow 2–3 days.'
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'long-black',
  'Long Black',
  'Hot drink — 410 ml. Whole milk included. Alternative milk +$1.00 in cart.',
  5.5,
  '/images/placeholders/drink-hot.svg',
  'hot-drink',
  NULL,
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'americano',
  'Americano',
  'Hot drink — 410 ml. Whole milk included. Alternative milk +$1.00 in cart.',
  5.5,
  '/images/placeholders/drink-hot.svg',
  'hot-drink',
  NULL,
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'latte',
  'Latte',
  'Hot drink — 410 ml. Whole milk included. Alternative milk +$1.00 in cart.',
  6.5,
  '/images/placeholders/drink-hot.svg',
  'hot-drink',
  NULL,
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'cappuccino',
  'Cappuccino',
  'Hot drink — 410 ml. Whole milk included. Alternative milk +$1.00 in cart.',
  6.5,
  '/images/placeholders/drink-hot.svg',
  'hot-drink',
  NULL,
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'flat-white',
  'Flat White',
  'Hot drink — 410 ml. Whole milk included. Alternative milk +$1.00 in cart.',
  6.5,
  '/images/placeholders/drink-hot.svg',
  'hot-drink',
  NULL,
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'mochaccino',
  'Mochaccino',
  'Hot drink — 410 ml. Whole milk included. Alternative milk +$1.00 in cart.',
  7,
  '/images/placeholders/drink-hot.svg',
  'hot-drink',
  NULL,
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'hot-chocolate',
  'Hot Chocolate',
  'Hot drink — 410 ml. Whole milk included. Alternative milk +$1.00 in cart.',
  7,
  '/images/placeholders/drink-hot.svg',
  'hot-drink',
  NULL,
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'iced-ube-marble-matcha',
  'Iced Ube Marble Matcha',
  'Premium iced drink — 530 ml. Whole milk included. Alternative milk +$1.00 in cart.',
  14,
  '/images/placeholders/drink-iced.svg',
  'iced-drink',
  'Premium',
  'Premium',
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'iced-ube-latte',
  'Iced Ube Latte',
  'Premium iced drink — 530 ml. Whole milk included. Alternative milk +$1.00 in cart.',
  12.5,
  '/images/placeholders/drink-iced.svg',
  'iced-drink',
  'Premium',
  'Premium',
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'iced-matcha',
  'Iced Matcha',
  'Premium iced drink — 530 ml. Whole milk included. Alternative milk +$1.00 in cart.',
  11,
  '/images/placeholders/drink-iced.svg',
  'iced-drink',
  'Premium',
  'Premium',
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'iced-chocolate',
  'Iced Chocolate',
  'Standard iced drink — 530 ml. Whole milk included. Alternative milk +$1.00 in cart.',
  10.5,
  '/images/placeholders/drink-iced.svg',
  'iced-drink',
  'Standard',
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'iced-mocha',
  'Iced Mocha',
  'Standard iced drink — 530 ml. Whole milk included. Alternative milk +$1.00 in cart.',
  9.5,
  '/images/placeholders/drink-iced.svg',
  'iced-drink',
  'Standard',
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'iced-latte',
  'Iced Latte',
  'Standard iced drink — 530 ml. Whole milk included. Alternative milk +$1.00 in cart.',
  8.5,
  '/images/placeholders/drink-iced.svg',
  'iced-drink',
  'Standard',
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'iced-latte-vanilla',
  'Iced Flavoured Latte — Vanilla',
  'Standard iced drink — 530 ml. Whole milk included. Alternative milk +$1.00 in cart.',
  9.5,
  '/images/placeholders/drink-iced.svg',
  'iced-drink',
  'Standard',
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'iced-latte-caramel',
  'Iced Flavoured Latte — Caramel',
  'Standard iced drink — 530 ml. Whole milk included. Alternative milk +$1.00 in cart.',
  9.5,
  '/images/placeholders/drink-iced.svg',
  'iced-drink',
  'Standard',
  NULL,
  NULL
);

INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  'iced-latte-hazelnut',
  'Iced Flavoured Latte — Hazelnut',
  'Standard iced drink — 530 ml. Whole milk included. Alternative milk +$1.00 in cart.',
  9.5,
  '/images/placeholders/drink-iced.svg',
  'iced-drink',
  'Standard',
  NULL,
  NULL
);
