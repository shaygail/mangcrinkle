/**
 * Generates data/products.sql from fallbackProducts.
 * Run: npx tsx scripts/generate-products-sql.ts
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { fallbackProducts } from "../src/data/products";

function esc(value: string | undefined | null): string {
  if (value == null) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

const header = `-- Mang Crinkle product catalogue
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

`;

const inserts = fallbackProducts
  .map(
    (p) => `INSERT INTO products (id, name, description, price, image, category, tier, badge, note)
VALUES (
  ${esc(p.id)},
  ${esc(p.name)},
  ${esc(p.description)},
  ${p.price},
  ${esc(p.image)},
  ${esc(p.category)},
  ${esc(p.tier ?? null)},
  ${esc(p.badge ?? null)},
  ${esc(p.note ?? null)}
);`
  )
  .join("\n\n");

const outDir = join(process.cwd(), "data");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "products.sql");
writeFileSync(outPath, header + inserts + "\n", "utf8");
console.log(`Wrote ${outPath} (${fallbackProducts.length} products)`);
